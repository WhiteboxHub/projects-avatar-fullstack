"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AxiosError } from 'axios';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { FaDownload } from "react-icons/fa";
import AddRowModal from "@/modals/batch_modals/AddRowBatch";
import EditRowModal from "@/modals/batch_modals/EditRowBatch";
import ViewRowModal from "@/modals/batch_modals/ViewRowBatch";
import { MdDelete } from "react-icons/md";
import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import withAuth from "@/modals/withAuth";
import {
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlineSearch,
  AiOutlineReload,
} from "react-icons/ai";
import { MdAdd } from "react-icons/md";
import { Batch } from "@/types/index";

jsPDF.prototype.autoTable = autoTable;
const Batches = () => {
  const [rowData, setRowData] = useState<Batch[]>([]);
  const [columnDefs, setColumnDefs] = useState<
    { headerName: string; field: string }[]
  >([]);
  const [paginationPageSize] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [, setLoading] = useState<boolean>(false);
  const [modalState, setModalState] = useState<{
    add: boolean;
    edit: boolean;
    view: boolean;
  }>({ add: false, edit: false, view: false });
  const [selectedRow, setSelectedRow] = useState<Batch | null>(null);
  
  const [alertMessage, setAlertMessage] = useState<string | null>(null); // Added state for alert message
  const [searchValue, setSearchValue] = useState<string>("");
  const gridRef = useRef<AgGridReact>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchData = useCallback(async (page = currentPage, searchQuery = searchValue) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/batches/search`, {
        params: {
          page: page,
          pageSize: paginationPageSize,
          search: searchQuery.trim(),
        },
        headers: { AuthToken: localStorage.getItem("token") },
      });
  
      const { data, totalRows } = response.data;
  
      setRowData(data);
      setTotalRows(totalRows);
      setupColumns(data);
    } catch (error) {
      console.error("Error loading data:", error);
      setAlertMessage("Error loading data. Please try again.");
      setTimeout(() => setAlertMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  }, [API_URL, currentPage, paginationPageSize, searchValue]);
  
  interface ErrorResponse {
    message: string;
    // Add other properties if needed
  }

  // Debounce function with proper typing
  // Custom debounce function with proper typing for our specific use case
  const debounce = <F extends (query: string) => void>(
    func: F,
    delay: number
  ): ((query: string) => void) => {
    let timeoutId: NodeJS.Timeout;
    return function(query: string) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(query), delay);
    };
  };

  // Create a debounced version of fetchData with correct typing
  const debouncedFetch = useCallback(
    debounce((query: string) => {
      fetchData(1, query); // Reset to page 1 when searching
    }, 500),
    [fetchData]
  );
  
  // Handle search input change with debouncing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedFetch(value);
    if (value === '') {
      setCurrentPage(1); // Reset to page 1 when clearing search
    }
  };
    
  const handleSearch = () => {
    fetchData(1, searchValue); // Always go to first page on manual search
    setCurrentPage(1);
  };
  

  const setupColumns = useCallback((data: Batch[]) => {
    if (data.length > 0) {
      // Create an array to hold the columns
      const columns = [];
      
      // First, check if batchname exists and add it as "Name"
      if ('batchname' in data[0]) {
        columns.push({ headerName: "Name", field: "batchname" });
      }
      
      // Then, check if current exists and add it next
      if ('current' in data[0]) {
        columns.push({ headerName: "Current", field: "current" });
      }
      
      // Add all other fields except batchname and current which we've already handled
      Object.keys(data[0]).forEach(key => {
        if (key !== 'batchname' && key !== 'current') {
          columns.push({
            headerName: key.charAt(0).toUpperCase() + key.slice(1),
            field: key,
          });
        }
      });
      
      setColumnDefs(columns);
    }
  }, []);
  

  
  useEffect(() => {
    fetchData(currentPage, searchValue);
  }, [currentPage, fetchData, searchValue]);
  
  const handleRefresh = () => {
    setSearchValue(""); // Clear search value before refreshing
    setCurrentPage(1);
    fetchData(1, "");
  };
  
  const handleAddRow = () =>
    setModalState((prevState) => ({ ...prevState, add: true }));


  const handleEditRow = () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        setSelectedRow(selectedRows[0]);
        setModalState((prevState) => ({ ...prevState, edit: true }));
      } else {
        setAlertMessage("Please select a row to edit."); // Set alert message
        setTimeout(() => setAlertMessage(null), 3000); // Clear alert message after 3 seconds
      }
    }
  };

 
  const handleDeleteRow = async () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        const batchId = selectedRows[0].batchid || selectedRows[0].id;
        if (batchId) {
          const confirmation = window.confirm(
            `Are you sure you want to delete batch ID ${batchId}?`
          );
          if (!confirmation) return;

          try {
            await axios.delete(`${API_URL}/batches/batches/delete/${batchId}`, {
              headers: { AuthToken: localStorage.getItem("token") },
            });
            alert("Batch deleted successfully.");
            fetchData(); // Refresh data after delete
          } catch (error) {
            const axiosError = error as AxiosError;
        
            alert(
                `Failed to delete batch: ${
                    (axiosError.response?.data as ErrorResponse)?.message || axiosError.message
                }`
            );
          }
        } else {
          alert("No valid batch ID found for the selected row.");
        }
      } else {
        setAlertMessage("Please select a row to delete."); // Set alert message
        setTimeout(() => setAlertMessage(null), 3000); // Clear alert message after 3 seconds
      }
    }
  };

  const handlePageChange = (newPage: number) => setCurrentPage(newPage);

  const handleViewRow = () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        setSelectedRow(selectedRows[0]); // Set the selected row data
        setModalState((prevState) => ({ ...prevState, view: true })); // Open the view modal
      } else {
        setAlertMessage("Please select a row to view."); // Set alert message
        setTimeout(() => setAlertMessage(null), 3000); // Clear alert message after 3 seconds
      }
    }
  };


const handleDownloadPDF = () => {
  // Create a new instance of jsPDF
  const doc = new jsPDF();

  // Add title text
  doc.text("Batch Data", 20, 10);

  // Prepare data for PDF
  const pdfData = rowData.map((row) => Object.values(row));
  const headers = columnDefs.map((col) => col.headerName);

  // Create the autoTable
  autoTable(doc, {
      head: [headers],
      body: pdfData,
      theme: 'grid', // Optional: set the theme for the table
      styles: { fontSize: 5 }, // Optional: adjust font size
  });

  // Save the PDF
  doc.save("batch_data.pdf");
};


  
  const totalPages = Math.ceil(totalRows / paginationPageSize);
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);
  const pageOptions = Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage);

  return (
    <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md  relative max-w-7xl ">
    {alertMessage && ( // Conditional rendering of alert message
      <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded-md shadow-md z-50">
        {alertMessage}
      </div>
    )}
    <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Batch Management</h1>
      </div>
         {/* Search Functionality */}
         <div className="flex flex-col md:flex-row mb-4 justify-between items-center">
         <div className="flex w-full md:w-auto mb-2 md:mb-0">
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={handleSearchChange}
              className="border border-gray-300 rounded-md p-2 w-64"
            />
            <button
              onClick={handleSearch}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md ml-2 transition duration-300 hover:bg-blue-900 text-xs md:text-base"
            >
              <AiOutlineSearch className="mr-1" /> Search
            </button>
          </div>
        
          

        <div className="flex flex-col md:flex-row md:items-center md:justify-end md:space-x-2 mb-4">
          <div className="flex flex-wrap space-x-2 mb-4 md:mb-0">

            <button
              onClick={handleAddRow}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700 text-xs md:text-base"
            >
              <MdAdd className="mr-2" />
            </button>
            <button
              onClick={handleEditRow}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700 text-xs md:text-base"
            >
              <AiOutlineEdit className="mr-1" />
            </button>
            <button
              onClick={handleViewRow}
              className="flex items-center px-3 py-2 bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-700 text-xs md:text-base"
            >
              <AiOutlineEye className="mr-1" />
            </button>
            <button
              onClick={handleDeleteRow}
              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700 text-xs md:text-base"
            >
              <MdDelete className="mr-1" />
            </button>
          </div>
          <div className="flex flex-wrap space-x-2 mb-4 md:mb-0">
            <button
              onClick={handleRefresh}
              className="flex items-center px-3 py-2 bg-gray-500 text-white rounded-md transition duration-300 hover:bg-gray-900 text-xs md:text-base"
            >
            <AiOutlineReload className="mr-2" />
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700"
          >
            <FaDownload className="mr-2" />
          </button>
        
         </div>
     
         </div>

    </div>
      <div
        className="ag-theme-alpine"
        style={{ height: "400px", width: "100%", overflowY: "auto" }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          pagination={false}
          domLayout="normal"
          rowSelection="multiple"
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            cellStyle: { color: "#333", fontSize: "0.75rem", padding: "1px" },
            minWidth: 80,
            maxWidth: 150,
          }}
          rowHeight={30}
          headerHeight={35}
          overlayNoRowsTemplate={
            '<span class="ag-overlay-no-rows-center" style="border: 1px solid #ccc; padding: 8px; border-radius: 4px;">Loading...</span>'
          }
        />
      </div>

      <div className="flex justify-between mt-4">
      <div className="flex items-center">
        {/* Double Left Icon */}
        <button 
          onClick={() => handlePageChange(1)} 
          disabled={currentPage === 1}
          className="p-2 disabled:opacity-50"
        >
          <FaAngleDoubleLeft />
        </button>
        {/* Left Icon */}
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          className="p-2 disabled:opacity-50"
        >
          <FaChevronLeft />
        </button>
        {/* Page Numbers */}
        {pageOptions.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-2 py-1 rounded-md ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            {page}
          </button>
        ))}
        {/* Right Icon */}
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className="p-2 disabled:opacity-50"
        >
          <FaChevronRight />
        </button>
        {/* Double Right Icon */}
        <button 
          onClick={() => handlePageChange(totalPages)} 
          disabled={currentPage === totalPages}
          className="p-2 disabled:opacity-50"
        >
          <FaAngleDoubleRight />
        </button>
      </div>
      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages} | Total: {totalRows}
      </div>
    </div>

      {modalState.add && (
        <AddRowModal
          isOpen={modalState.add}
          onClose={() => setModalState((prev) => ({ ...prev, add: false }))}
          refreshData={fetchData}
        />
      )}
      {modalState.edit && selectedRow && (
        <EditRowModal
          isOpen={modalState.edit}
          onRequestClose={() => setModalState((prev) => ({ ...prev, edit: false }))}
          rowData={selectedRow}
          onSave={fetchData}
        />
      )}
      {modalState.view && selectedRow && (
        <ViewRowModal
          isOpen={modalState.view}
          onClose={() => setModalState((prev) => ({ ...prev, view: false }))}
          rowData={selectedRow}
        />
      )}
    
    </div>
  );
};

export default withAuth(Batches);
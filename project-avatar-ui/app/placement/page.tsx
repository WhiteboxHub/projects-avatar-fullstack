"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AxiosError } from 'axios';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { FaDownload } from "react-icons/fa";
import AddRowModal from "../../modals/placement_models/AddRowPlacement";
import EditRowModal from "../../modals/placement_models/EditRowPlacement";
import ViewRowModal from "../../modals/placement_models/ViewRowPlacement";
import { MdDelete } from "react-icons/md";
import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import {
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlineSearch,
  AiOutlineReload,
} from "react-icons/ai";
import { MdAdd } from "react-icons/md";
import { ErrorResponse, Placement } from "@/types";

jsPDF.prototype.autoTable = autoTable;
const Placements = () => {
  const [rowData, setRowData] = useState<Placement[]>([]);
  const [columnDefs, setColumnDefs] = useState<
    { headerName: string; field: string }[]
  >([]);
  const [paginationPageSize] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null); // Added state for alert message
  const [modalState, setModalState] = useState<{
    add: boolean;
    edit: boolean;
    view: boolean;
  }>({ add: false, edit: false, view: false });
  const [selectedRow, setSelectedRow] = useState<Placement | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const gridRef = useRef<AgGridReact>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(`${API_URL}/placement`, {
  //       params: {
  //         page: currentPage,
  //         pageSize: paginationPageSize, // Make sure this is 100
  //       },
  //       headers: { AuthToken: localStorage.getItem("token") },
  //     });
  
  //     console.log("Full API Response:", response); // Log the entire response object
  //     console.log("API Response Data:", response.data); // Log the data
  
  //     // Assuming response.data is the array of placements
  //     const data = response.data; // Directly use response.data if it's the array
  //     const totalRows = response.headers['total-rows'] || data.length; // Adjust based on actual API response
  
  //     // Check if 'data' is valid
  //     if (!Array.isArray(data)) {
  //       throw new Error("Data is not an array or is undefined");
  //     }
  
  //     // Add serial numbers to each row
  //     const dataWithSerials = data.map((item: Placement, ) => ({
  //       ...item,
  //       // serialNo: (currentPage - 1) * paginationPageSize + index + 1,
  //     }));
  
  //     setRowData(dataWithSerials);
  //     setTotalRows(totalRows);
  //     setupColumns(dataWithSerials);
  //   } catch (error) {
  //     console.error("Error loading data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchData = async () => {
    setLoading(true);
    try {
        const response = await axios.get(`${API_URL}/placement`, {
            params: {
                page: currentPage, // Current page number
                pageSize: paginationPageSize, // Page size (e.g., 100)
            },
            headers: { AuthToken: localStorage.getItem("token") },
        });

        console.log("Full API Response:", response); // Log the entire response object
        console.log("API Response Data:", response.data); // Log the data

        const data = response.data; // Directly use response.data if it's the array
        const totalRows = response.headers['total-rows'] || data.length; // Adjust based on actual API response

        // Check if 'data' is valid
        if (!Array.isArray(data)) {
            throw new Error("Data is not an array or is undefined");
        }

        // Add serial numbers to each row
        const dataWithSerials = data.map((item: Placement, index: number) => ({
            ...item,
            serialNo: (currentPage - 1) * paginationPageSize + index + 1, // Add serial number
        }));

        setRowData(dataWithSerials);
        setTotalRows(totalRows);
        setupColumns(dataWithSerials);
    } catch (error) {
        console.error("Error loading data:", error);
    } finally {
        setLoading(false);
    }
};
  
  const fetchPlacements = async (searchQuery = "") => {
    try {
      const response = await axios.get(`${API_URL}/placements/search`, {
        params: {
          page: currentPage,
          pageSize: paginationPageSize,
          search: searchQuery,
        },
        headers: { AuthToken: localStorage.getItem("token") },
      });

      const { data, totalRows } = response.data;
      setRowData(data);
      setTotalRows(totalRows);
      setupColumns(data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleSearch = () => {
    fetchPlacements(searchValue);
  };

  const setupColumns = (data: Placement[]) => {
    if (data.length > 0) {
      const columns = [
        ...Object.keys(data[0]).map((key) => ({
          headerName: key.charAt(0).toUpperCase() + key.slice(1),
          field: key,
        })),
      ];
      setColumnDefs(columns);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handleRefresh = () => {
    setSearchValue("");
    fetchData();
    window.location.reload();
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
        const placementId = selectedRows[0].placementid || selectedRows[0].id;
        if (placementId) {
          const confirmation = window.confirm(
            `Are you sure you want to delete placement ID ${placementId}?`
          );
          if (!confirmation) return;

          try {
            await axios.delete(`${API_URL}/placements/delete/${placementId}`, {
              headers: { AuthToken: localStorage.getItem("token") },
            });
            alert("Placement deleted successfully.");
            fetchData();
          } catch (error) {
            const axiosError = error as AxiosError;
            alert(
              `Failed to delete placement: ${
                (axiosError.response?.data as ErrorResponse)?.message || axiosError.message
              }`
            );
          }
        } else {
          alert("No valid placement ID found for the selected row.");
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
    const doc = new jsPDF();
    doc.text("Placement Data", 20, 10);
    const pdfData = rowData.map((row) => Object.values(row));
    const headers = columnDefs.map((col) => col.headerName);
    autoTable(doc, {
      head: [headers],
      body: pdfData,
      theme: 'grid',
      styles: { fontSize: 5 },
    });
    doc.save("placement_data.pdf");
  };

  const totalPages = Math.ceil(totalRows / paginationPageSize);
  const startPage = Math.max(1, currentPage );
  const endPage = Math.min(totalPages, currentPage + 4);
  const pageOptions = Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage);


  return (
    <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md relative">
    {alertMessage && ( // Conditional rendering of alert message
      <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded-md shadow-md z-50">
        {alertMessage}
      </div>
    )}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Placement Management</h1></div>


        <div className="flex flex-col md:flex-row mb-4 justify-between   items-center">
        <div className="flex w-full md:w-auto mb-2 md:mb-0">
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-64"
        />
        <button
          onClick={handleSearch}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md ml-2 transition duration-300 hover:bg-blue-900"
        >
          <AiOutlineSearch className="mr-2" /> Search
        </button>
        </div>



        <div className="flex space-x-2">
          <button
            onClick={handleAddRow}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700"
          >
            <MdAdd className="mr-2" /> 
          </button>
          <button
            onClick={handleEditRow}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700"
          >
            <AiOutlineEdit className="mr-2" /> 
          </button>
          <button
            onClick={handleDeleteRow}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700"
          >
            <MdDelete className="mr-2" /> 
          </button>
          <button
            onClick={handleViewRow}
            className="flex items-center px-4 py-2 bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-700"
          >
            <AiOutlineEye className="mr-2" /> 
          </button>
          <button
            onClick={handleRefresh}
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md transition duration-300 hover:bg-gray-900"
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
      
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <span className="text-xl">Loading...</span>
        </div>
      ) : (
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
              cellStyle: { color: "#333", fontSize: "0.75rem", padding: "1px" },
              minWidth: 60,
              maxWidth: 100,
            }}
            rowHeight={30}
            headerHeight={35}
          />
        </div>
      )}
      <div className="flex justify-between mt-4">
        <div className="flex items-center">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="p-2 disabled:opacity-50"
          >
            <FaAngleDoubleLeft />
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 disabled:opacity-50"
          >
            <FaChevronLeft />
          </button>
          {pageOptions.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-2 py-1 rounded-md ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 disabled:opacity-50"
          >
            <FaChevronRight />
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 disabled:opacity-50"
          >
            <FaAngleDoubleRight />
          </button>
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

export default Placements;

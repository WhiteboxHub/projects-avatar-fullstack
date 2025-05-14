"use client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import AddRowModal from "@/modals/url_modals/AddRowUrl";
import EditRowModal from "@/modals/url_modals/EditRowUrl";
import React, { useEffect, useRef, useState } from "react";
import ViewRowModal from "@/modals/url_modals/ViewRowUrl";
import autoTable from "jspdf-autotable";
import axios from "axios";
import withAuth from "@/modals/withAuth";
import { AgGridReact } from "ag-grid-react";
import { jsPDF } from "jspdf";
import { MdAdd, MdDelete } from "react-icons/md";
import { Url } from "@/types/urls";

import {
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import {
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlineSearch,
  AiOutlineReload
} from "react-icons/ai";

jsPDF.prototype.autoTable = autoTable;

const Urls = () => {
  const [rowData, setRowData] = useState<Url[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [columnDefs, setColumnDefs] = useState<
    { headerName: string; field: string; editable?: boolean; width?: number; editoptions?: Record<string, unknown>; formatter?: string; label?: string; }[]
  >([]);
  const [paginationPageSize] = useState<number>(500);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalState, setModalState] = useState<{
    add: boolean;
    edit: boolean;
    view: boolean;
  }>({ add: false, edit: false, view: false });
  const [selectedRow, setSelectedRow] = useState<Url | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const gridRef = useRef<AgGridReact>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Track window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get appropriate icon sizes based on screen width
  const getIconSize = () => {
    if (windowWidth < 640) return "text-xs"; // Mobile
    if (windowWidth < 1024) return "text-sm"; // Tablet
    return "text-base"; // Desktop
  };

  // Get appropriate button padding based on screen width
  const getButtonPadding = () => {
    if (windowWidth < 640) return "px-1 py-1"; // Mobile
    if (windowWidth < 1024) return "px-1.5 py-1"; // Tablet
    return "px-2 py-1.5"; // Desktop
  };

  const iconSize = getIconSize();
  const buttonPadding = getButtonPadding();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/urls`, {
        params: {
          page: currentPage,
          pageSize: paginationPageSize,
        },
        headers: { AuthToken: localStorage.getItem("token") },
      });

      const { data, totalRows } = response.data;

      setRowData(data);
      setTotalRows(totalRows);
      setupColumns(data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUrls = async (searchQuery = "") => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/urls/search`, {
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
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchUrls(searchValue);
  };

  const setupColumns = (data: Url[]) => {
    if (data.length > 0) {
      // Define responsive column widths
      const getColumnWidth = (field: string) => {
        if (windowWidth < 640) { // Mobile
          if (field === 'sl_no') return 50;
          if (field === 'url') return 150;
          return 80;
        } else if (windowWidth < 1024) { // Tablet
          if (field === 'sl_no') return 70;
          if (field === 'url') return 200;
          return 100;
        } else { // Desktop
          if (field === 'sl_no') return 80;
          if (field === 'url') return 300;
          return 120;
        }
      };

      const columns = Object.keys(data[0]).map((key) => ({
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
        field: key,
        width: getColumnWidth(key),
        editable: false,
      }));
      
      setColumnDefs(columns);
    }
  };

  // Re-setup columns when window width changes
  useEffect(() => {
    if (rowData.length > 0) {
      setupColumns(rowData);
    }
  }, [windowWidth, rowData]);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handleRefresh = () => {
    setSearchValue("");
    fetchData();
  };

  const handleAddRow = () =>
    setModalState((prevState) => ({ ...prevState, add: true }));

  const handleEditRow = () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        setSelectedRow({
          sl_no: selectedRows[0].sl_no || 0,
          url: selectedRows[0].url || '',
          id: selectedRows[0].id
        });
        setModalState((prevState) => ({ ...prevState, edit: true }));
      } else {
        setAlertMessage("Please select a row to edit.");
        setTimeout(() => setAlertMessage(null), 3000);
      }
    }
  };
  
  const handleDeleteRow = async () => {
    if (gridRef.current) {
      try {
        const selectedRows = gridRef.current.api.getSelectedRows();
        
        if (selectedRows.length === 0) {
          setAlertMessage("Please select a row to delete.");
          setTimeout(() => setAlertMessage(null), 3000);
          return;
        }
  
        const sl_no = selectedRows[0].sl_no;
        
        const confirmation = window.confirm(
          `Are you sure you want to delete URL with SL No ${sl_no}?`
        );
  
        if (confirmation) {
          setLoading(true);
          const response = await axios.delete(
            `${API_URL}/urls/delete/${sl_no}`, 
            {
              params: {
                page: currentPage,
                page_size: paginationPageSize
              },
              headers: { 
                AuthToken: localStorage.getItem("token") || "" 
              }
            }
          );
  
          if (response.status === 200) {
            setAlertMessage("URL deleted successfully.");
            setTimeout(() => setAlertMessage(null), 3000);
            fetchData();
          }
        }
      } catch (error) {
        console.error("Delete error:", error);
        setAlertMessage(
          error instanceof Error 
            ? error.message 
            : "Failed to delete URL"
        );
        setTimeout(() => setAlertMessage(null), 3000);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  const handleViewRow = () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        setSelectedRow({
          sl_no: selectedRows[0].sl_no || 0,
          url: selectedRows[0].url || '',
          id: selectedRows[0].id
        });
        setModalState((prevState) => ({ ...prevState, view: true }));
      } else {
        setAlertMessage("Please select a row to view.");
        setTimeout(() => setAlertMessage(null), 3000);
      }
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("URL Data", 20, 10);
    const pdfData = rowData.map((row) => Object.values(row));
    const headers = columnDefs.map((col) => col.headerName);
    autoTable(doc, {
      head: [headers],
      body: pdfData,
      theme: 'grid',
      styles: { fontSize: 5 },
    });
    doc.save("url_data.pdf");
  };

  const totalPages = Math.ceil((totalRows) / paginationPageSize);
  const startPage = Math.max(1, currentPage - (windowWidth < 640 ? 1 : 2));
  const endPage = Math.min(totalPages, currentPage + (windowWidth < 640 ? 1 : 2));
  const pageOptions = Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage);

  return (
    <div className="relative">
      {alertMessage && (
        <div className={`fixed top-4 right-4 p-3 sm:p-4 ${alertMessage.includes("successfully") ? "bg-green-500" : "bg-red-500"} text-white text-xs sm:text-sm rounded-md shadow-md z-50`}>
          {alertMessage}
        </div>
      )}
      <div className="p-2 sm:p-4 mt-16 sm:mt-20 mb-6 sm:mb-10 mx-2 sm:mx-4 md:mx-8 lg:mx-12 xl:mx-16 bg-gray-100 rounded-lg shadow-md relative">
        <div className="flex flex-col md:flex-row justify-between items-center mb-3 sm:mb-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">URL Management</h1>
        </div>

        <div className="flex flex-col sm:flex-row mb-3 sm:mb-4 justify-between items-center">
          <div className="flex w-full sm:w-auto mb-2 sm:mb-0">
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="border border-gray-300 rounded-md p-1.5 sm:p-2 w-full sm:w-64 text-xs sm:text-sm"
            />
            <button
              onClick={handleSearch}
              className={`flex items-center ${buttonPadding} bg-blue-600 text-white rounded-md ml-1 sm:ml-2 transition duration-300 hover:bg-blue-900 text-xs sm:text-sm`}
            >
              <AiOutlineSearch className={`mr-1 ${iconSize}`} /> 
              <span className="hidden xs:inline">Search</span>
            </button>
          </div>
        
          <div className="flex items-center space-x-1">
            <button
              onClick={handleAddRow}
              className={`flex items-center justify-center ${buttonPadding} bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700 text-xs sm:text-sm`}
              title="Add URL"
            >
              <MdAdd className={iconSize} />
            </button>
            <button
              onClick={handleEditRow}
              className={`flex items-center justify-center ${buttonPadding} bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700 text-xs sm:text-sm`}
              title="Edit URL"
            >
              <AiOutlineEdit className={iconSize} />
            </button>
            <button
              onClick={handleDeleteRow}
              className={`flex items-center justify-center ${buttonPadding} bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700 text-xs sm:text-sm`}
              title="Delete URL"
            >
              <MdDelete className={iconSize} />
            </button>
            <button
              onClick={handleViewRow}
              className={`flex items-center justify-center ${buttonPadding} bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-700 text-xs sm:text-sm`}
              title="View URL"
            >
              <AiOutlineEye className={iconSize} />
            </button>
            <button
              onClick={handleRefresh}
              className={`flex items-center justify-center ${buttonPadding} bg-gray-500 text-white rounded-md transition duration-300 hover:bg-gray-900 text-xs sm:text-sm`}
              title="Refresh"
            >
              <AiOutlineReload className={iconSize} />
            </button>
            <button
              onClick={handleDownloadPDF}
              className={`flex items-center justify-center ${buttonPadding} bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700 text-xs sm:text-sm`}
              title="Download PDF"
            >
              <FaDownload className={iconSize} />
            </button>
          </div>
        </div>
      
        <div 
          className="ag-theme-alpine" 
          style={{ 
            height: windowWidth < 640 ? "300px" : windowWidth < 1024 ? "350px" : "400px", 
            width: "100%", 
            overflowY: "auto",
            fontSize: windowWidth < 640 ? '10px' : windowWidth < 1024 ? '12px' : '14px'
          }}
        >
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <span className="text-xl">Loading...</span>
            </div>
          ) : (
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
                cellStyle: { 
                  color: "#333", 
                  fontSize: windowWidth < 640 ? "0.65rem" : windowWidth < 1024 ? "0.7rem" : "0.75rem", 
                  padding: windowWidth < 640 ? "0px" : "1px" 
                },
                minWidth: windowWidth < 640 ? 60 : windowWidth < 1024 ? 70 : 80,
                maxWidth: windowWidth < 640 ? 120 : windowWidth < 1024 ? 150 : 200,
              }}
              rowHeight={windowWidth < 640 ? 25 : windowWidth < 1024 ? 28 : 30}
              headerHeight={windowWidth < 640 ? 30 : windowWidth < 1024 ? 32 : 35}
              onGridReady={(params) => {
                params.api.sizeColumnsToFit();
              }}
              onGridSizeChanged={(params) => {
                params.api.sizeColumnsToFit();
              }}
              overlayLoadingTemplate={
                '<span class="ag-overlay-loading-center">Loading...</span>'
              }
              overlayNoRowsTemplate={
                '<span class="ag-overlay-no-rows-center">No rows to show</span>'
              }
            />
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-3 sm:mt-4">
          <div className="flex items-center justify-center w-full md:w-auto overflow-x-auto">
            <div className="flex space-x-1 overflow-x-auto">
              <button 
                onClick={() => handlePageChange(1)} 
                disabled={currentPage === 1}
                className={`p-1 sm:p-2 disabled:opacity-50 ${iconSize}`}
                title="First Page"
              >
                <FaAngleDoubleLeft className={iconSize} />
              </button>
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                className={`p-1 sm:p-2 disabled:opacity-50 ${iconSize}`}
                title="Previous Page"
              >
                <FaChevronLeft className={iconSize} />
              </button>
              {pageOptions.map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md text-xs sm:text-sm ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className={`p-1 sm:p-2 disabled:opacity-50 ${iconSize}`}
                title="Next Page"
              >
                <FaChevronRight className={iconSize} />
              </button>
              <button 
                onClick={() => handlePageChange(totalPages)} 
                disabled={currentPage === totalPages}
                className={`p-1 sm:p-2 disabled:opacity-50 ${iconSize}`}
                title="Last Page"
              >
                <FaAngleDoubleRight className={iconSize} />
              </button>
            </div>
          </div>
          <span className="mt-2 md:mt-0 text-xs sm:text-sm text-gray-600">
            Total Records: {totalRows}
          </span>
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
            onClose={() => setModalState((prev) => ({ ...prev, edit: false }))}
            onSave={fetchData}
            initialData={selectedRow}
            currentPage={currentPage}
            pageSize={paginationPageSize}
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
    </div>
  );
};

export default withAuth(Urls);
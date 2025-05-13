"use client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "jspdf-autotable";
import "react-dropdown/style.css";
import * as XLSX from "xlsx";
import AddRowModal from "@/modals/employee_modals/AddEmployee";
import Dropdown, { Option } from "react-dropdown";
import EditRowModal from "@/modals/employee_modals/EditEmployee";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ViewRowModal from "@/modals/employee_modals/ViewEmployee";
import axios from "axios";
import jsPDF from "jspdf";
import withAuth from "@/modals/withAuth";
import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AgGridReact } from "ag-grid-react";
import { debounce } from "lodash";
import { AiOutlineEdit, AiOutlineEye, AiOutlineReload, AiOutlineSearch } from "react-icons/ai";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdAdd } from "react-icons/md";
import { Employee } from "@/types/index";

interface OptionType {
  value: string;
  label: JSX.Element | string;
}

const Employees = () => {
  const [rowData, setRowData] = useState<Employee[]>([]);
  const [columnDefs, setColumnDefs] = useState<{ headerName: string; field: string }[]>([]);
  const [paginationPageSize] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [modalState, setModalState] = useState<{ add: boolean; edit: boolean; view: boolean }>({ add: false, edit: false, view: false });
  const [selectedRow, setSelectedRow] = useState<Employee | null>(null);
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

  const fetchData = useCallback(
    async (searchQuery = "", page = 1) => {
      try {
        const endpoint = searchQuery ? `${API_URL}/employee/search` : `${API_URL}/employee`;
        const response = await axios.get(endpoint, {
          params: {
            page: page,
            pageSize: paginationPageSize,
            ...(searchQuery && { query: searchQuery }),
          },
          headers: { AuthToken: localStorage.getItem("token") },
        });

        const responseData = response.data.items || response.data.data || [];
        const responseTotal = response.data.total || responseData.length;

        setRowData(responseData);
        setTotalRows(responseTotal);
        
        if (responseData.length > 0) {
          setupColumns(responseData[0]);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    },
    [paginationPageSize, API_URL]
  );

  const setupColumns = (sampleData: Employee) => {
    try {
      if (!sampleData) return;
      
      const baseColumns = [{
        headerName: "SI No",
        field: "si_no",
        filter: true,
        sortable: true,
        resizable: true,
        width: getColumnWidth("si_no")
      }];

      const keys = Object.keys(sampleData).filter(key => key !== "si_no");
      const dynamicColumns = keys.map((key) => ({
        headerName: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
        field: key,
        filter: true,
        sortable: true,
        resizable: true,
        width: getColumnWidth(key)
      }));

      setColumnDefs([...baseColumns, ...dynamicColumns]);
    } catch (error) {
      console.error("Error setting up columns:", error);
    }
  };

  const getColumnWidth = (field: string) => {
    if (windowWidth < 640) { // Mobile
      return field === 'si_no' ? 60 : 100;
    } else if (windowWidth < 1024) { // Tablet
      return field === 'si_no' ? 80 : 120;
    } else { // Desktop
      return field === 'si_no' ? 100 : 150;
    }
  };

  const debouncedFetchData = useCallback(
    debounce((query: string, page: number) => {
      fetchData(query, page);
    }, 300),
    [fetchData]
  );

  useEffect(() => {
    fetchData(searchValue, currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (searchValue) {
      debouncedFetchData(searchValue, currentPage);
    } else {
      fetchData("", currentPage);
    }
    return () => {
      debouncedFetchData.cancel();
    };
  }, [searchValue]);

  const handleAddRow = () => {
    setModalState((prevState) => ({ ...prevState, add: true }));
  };

  const handleEditRow = () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        setSelectedRow(selectedRows[0]);
        setModalState((prevState) => ({ ...prevState, edit: true }));
      } else {
        setAlertMessage("Please select a row to edit.");
        setTimeout(() => setAlertMessage(null), 3000);
      }
    }
  };

  const handleViewRow = () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        setSelectedRow(selectedRows[0]);
        setModalState((prevState) => ({ ...prevState, view: true }));
      } else {
        setAlertMessage("Please select a row to view.");
        setTimeout(() => setAlertMessage(null), 3000);
      }
    }
  };

  const handleDeleteRow = async () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        const employeeId = selectedRows[0].id;
        if (employeeId) {
          const confirmation = window.confirm(
            `Are you sure you want to delete employee ID ${employeeId}?`
          );
          if (!confirmation) return;

          try {
            await axios.delete(`${API_URL}/employee/remove/${employeeId}`, {
              headers: { AuthToken: localStorage.getItem("token") },
            });
            setAlertMessage("Employee deleted successfully.");
            setTimeout(() => setAlertMessage(null), 3000);
            fetchData(searchValue, currentPage);
          } catch (error) {
            console.error("Error deleting employee:", error);
            setAlertMessage(
              `Failed to delete employee: ${(error as Error).message || "Unknown error occurred"}`
            );
            setTimeout(() => setAlertMessage(null), 3000);
          }
        }
      } else {
        setAlertMessage("Please select a row to delete.");
        setTimeout(() => setAlertMessage(null), 3000);
      }
    }
  };

  const handleRefresh = () => {
    setSearchValue("");
    setCurrentPage(1);
    debouncedFetchData.cancel();
    fetchData("", 1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData(searchValue, 1);
  };

  const handleDownloadPDF = () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        const doc = new jsPDF();
        let y = 10;
        
        selectedRows.forEach(row => {
          doc.text(`ID: ${row.id}, Name: ${row.name}`, 10, y);
          y += 10;
        });
  
        doc.save("simple_export.pdf");
      }
    }
  };

  const handleExportToExcel = () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        const ws = XLSX.utils.json_to_sheet(selectedRows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Selected Employee Data");
        XLSX.writeFile(wb, "Selected_Employee_data.xlsx");
      } else {
        setAlertMessage("Please select a row to export.");
        setTimeout(() => setAlertMessage(null), 3000);
      }
    }
  };

  const totalPages = Math.ceil(totalRows / paginationPageSize);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = windowWidth < 640 ? 3 : 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

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

  // Function to handle row selection
  const onRowSelected = () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        setSelectedRow(selectedRows[0]);
      } else {
        setSelectedRow(null);
      }
    }
  };

  return (
    <div className="relative">
      {alertMessage && (
        <div className={`fixed top-4 right-4 p-3 sm:p-4 ${alertMessage.includes("successfully") ? "bg-green-500" : "bg-red-500"} text-white text-xs sm:text-sm rounded-md shadow-md z-50`}>
          {alertMessage}
        </div>
      )}

      <div className="p-2 sm:p-4 mt-16 sm:mt-20 mb-6 sm:mb-10 mx-auto bg-gray-100 rounded-lg shadow-md relative max-w-full sm:max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-3 sm:mb-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Employee List</h1>
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
              title="Add Employee"
            >
              <MdAdd className={iconSize} />
            </button>
            <button
              onClick={handleEditRow}
              className={`flex items-center justify-center ${buttonPadding} ${
                selectedRow
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              } rounded-md transition duration-300 text-xs sm:text-sm`}
              disabled={!selectedRow}
              title="Edit Employee"
            >
              <AiOutlineEdit className={iconSize} />
            </button>
            <button
              onClick={handleDeleteRow}
              className={`flex items-center justify-center ${buttonPadding} ${
                selectedRow
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              } rounded-md transition duration-300 text-xs sm:text-sm`}
              disabled={!selectedRow}
              title="Delete Employee"
            >
              <MdDelete className={iconSize} />
            </button>
            <button
              onClick={handleViewRow}
              className={`flex items-center justify-center ${buttonPadding} ${
                selectedRow
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              } rounded-md transition duration-300 text-xs sm:text-sm`}
              disabled={!selectedRow}
              title="View Employee"
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
              title="Export to PDF"
            >
              <FontAwesomeIcon icon={faFilePdf} className="mr-1" />
              <span className="hidden xs:inline">PDF</span>
            </button>
            <button
              onClick={handleExportToExcel}
              className={`flex items-center justify-center ${buttonPadding} bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700 text-xs sm:text-sm`}
              title="Export to Excel"
            >
              <FontAwesomeIcon icon={faFileExcel} className="mr-1" />
              <span className="hidden xs:inline">Excel</span>
            </button>
          </div>
        </div>

        <div 
          className="ag-theme-alpine" 
          style={{ 
            height: windowWidth < 640 ? "300px" : windowWidth < 1024 ? "350px" : "370px", 
            width: "100%", 
            overflowY: "visible", 
            overflowX: 'visible',
            fontSize: windowWidth < 640 ? '10px' : windowWidth < 1024 ? '12px' : '14px'
          }}
        >
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            pagination={false}
            domLayout="normal"
            rowSelection="multiple"
            onRowSelected={onRowSelected}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
              cellStyle: { 
                color: "#333", 
                fontSize: windowWidth < 640 ? "0.65rem" : windowWidth < 1024 ? "0.7rem" : "0.75rem", 
                padding: windowWidth < 640 ? "0px" : "1px" 
              },
              minWidth: windowWidth < 640 ? 60 : 80,
              maxWidth: windowWidth < 640 ? 120 : 150,
            }}
            rowHeight={windowWidth < 640 ? 25 : windowWidth < 1024 ? 28 : 30}
            headerHeight={windowWidth < 640 ? 30 : windowWidth < 1024 ? 32 : 35}
            overlayNoRowsTemplate={
              '<span class="ag-overlay-no-rows-center">No rows to show</span>'
            }
            overlayLoadingTemplate={
              '<span class="ag-overlay-loading-center">Loading...</span>'
            }
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-3 sm:mt-4">
          <div className="flex items-center justify-center w-full md:w-auto overflow-x-auto">
            <div className="flex space-x-1 sm:space-x-2 overflow-x-auto">
              <button 
                onClick={() => handlePageChange(1)} 
                disabled={currentPage === 1}
                className="p-1 sm:p-2 disabled:opacity-50 text-xs sm:text-sm"
                title="First Page"
              >
                <FaAngleDoubleLeft className={iconSize} />
              </button>
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                className="p-1 sm:p-2 disabled:opacity-50 text-xs sm:text-sm"
                title="Previous Page"
              >
                <FaChevronLeft className={iconSize} />
              </button>
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md text-xs sm:text-sm ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  {page}
                </button>
              ))}
              <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="p-1 sm:p-2 disabled:opacity-50 text-xs sm:text-sm"
                title="Next Page"
              >
                <FaChevronRight className={iconSize} />
              </button>
              <button 
                onClick={() => handlePageChange(totalPages)} 
                disabled={currentPage === totalPages}
                className="p-1 sm:p-2 disabled:opacity-50 text-xs sm:text-sm"
                title="Last Page"
              >
                <FaAngleDoubleRight className={iconSize} />
              </button>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-0">
            Page {currentPage} of {totalPages} | Total: {totalRows}
          </div>
        </div>

        {/* Ensure modals are properly rendered */}
        {modalState.add && (
          <AddRowModal
            isOpen={modalState.add}
            onRequestClose={() => setModalState((prev) => ({ ...prev, add: false }))}
            onSave={() => {
              fetchData(searchValue, currentPage);
              setModalState((prev) => ({ ...prev, add: false }));
            }}
          />
        )}
        
        {modalState.edit && selectedRow && (
          <EditRowModal
            isOpen={modalState.edit}
            onRequestClose={() => setModalState((prev) => ({ ...prev, edit: false }))}
            rowData={selectedRow}
            onSave={() => {
              fetchData(searchValue, currentPage);
              setModalState((prev) => ({ ...prev, edit: false }));
            }}
          />
        )}
        
        {modalState.view && selectedRow && (
          <ViewRowModal
            isOpen={modalState.view}
            onRequestClose={() => setModalState((prev) => ({ ...prev, view: false }))}
            rowData={selectedRow}
          />
        )}
      </div>
    </div>
  );
};

export default withAuth(Employees);
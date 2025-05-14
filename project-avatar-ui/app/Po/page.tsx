import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import AddRowModal from "../../modals/po_modals/AddRowPo";
import EditRowModal from "../../modals/po_modals/EditRowPo";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ViewRowModal from "../../modals/po_modals/ViewRowPo";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { jsPDF } from "jspdf";
import { debounce } from "lodash";
import { FaDownload } from "react-icons/fa";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { Po } from "@/types/index";
"use client";
import {
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlineSearch,
  AiOutlineReload,
} from "react-icons/ai";

const PO = () => {
  const [rowData, setRowData] = useState<Po[]>([]);
  const [columnDefs, setColumnDefs] = useState<{ headerName: string; field: string }[]>([]);
  const [paginationPageSize] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [, setLoading] = useState<boolean>(false);
  const [modalState, setModalState] = useState<{ add: boolean; edit: boolean; view: boolean }>({ add: false, edit: false, view: false });
  const [selectedRow, setSelectedRow] = useState<Po | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [originalData, setOriginalData] = useState<Po[]>([]);
  const [originalTotalRows, setOriginalTotalRows] = useState<number>(0);
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

  const fetchData = useCallback(async (searchQuery = "", page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/po`, {
        params: {
          page: page,
          pageSize: paginationPageSize,
          name_fragment: searchQuery,
        },
        headers: { AuthToken: localStorage.getItem("token") },
      });

      if (response.data) {
        const { data, totalRows } = response.data;
        const formattedData = Array.isArray(data) ? data : [data];
        setRowData(formattedData);
        setTotalRows(totalRows);
        
        if (!searchQuery) {
          setOriginalData(formattedData);
          setOriginalTotalRows(totalRows);
        }
        
        setupColumns(formattedData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [API_URL, paginationPageSize]);

  const searchPOsByName = useCallback(async (searchQuery: string) => {
    try {
      const response = await axios.get(`${API_URL}/po/name`, {
        params: {
          name_fragment: searchQuery,
          page: currentPage,
          pageSize: paginationPageSize,
        },
        headers: { AuthToken: localStorage.getItem("token") },
      });

      let data = response.data.data || response.data;
      if (!Array.isArray(data)) {
        data = [data];
      }

      setRowData(data);
      setTotalRows(data.length);
      setupColumns(data);
    } catch (error) {
      console.error("Error searching POs:", error);
      setAlertMessage("No PO with that name.");
      setTimeout(() => setAlertMessage(null), 3000);
    }
  }, [API_URL, currentPage, paginationPageSize]);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query) {
        searchPOsByName(query);
      } else {
        setRowData(originalData);
        setTotalRows(originalTotalRows);
      }
    }, 300),
    [searchPOsByName, originalData, originalTotalRows]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (searchValue) {
      debouncedSearch(searchValue);
    } else {
      setRowData(originalData);
      setTotalRows(originalTotalRows);
    }
  }, [searchValue, debouncedSearch, originalData, originalTotalRows]);

  useEffect(() => {
    if (!searchValue) {
      fetchData("", currentPage);
    }
  }, [currentPage, fetchData, searchValue]);

  const setupColumns = (data: Po[]) => {
    if (data && data.length > 0) {
      const keys = Object.keys(data[0]);
      const columns = keys.map((key) => ({
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
        field: key,
        width: getColumnWidth(),
        minWidth: windowWidth < 640 ? 60 : 80,
        maxWidth: windowWidth < 640 ? 120 : 150
      }));
      setColumnDefs(columns);
    }
  };

  const getColumnWidth = () => {
    if (windowWidth < 640) { // Mobile
      return 100;
    } else if (windowWidth < 1024) { // Tablet
      return 120;
    } else { // Desktop
      return 150;
    }
  };

  const handleSearch = () => {
    if (searchValue) {
      searchPOsByName(searchValue);
    }
  };

  const handleRefresh = () => {
    setSearchValue("");
    fetchData();
  };

  const handleAddRow = () => setModalState((prevState) => ({ ...prevState, add: true }));

  const handleEditRow = () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        // Extensive debugging
        console.log('SELECTED ROW DATA:', JSON.stringify(selectedRows[0], null, 2));
        
        // Ensure we have a proper data object before setting it
        if (typeof selectedRows[0] === 'object' && selectedRows[0] !== null) {
          setSelectedRow(selectedRows[0]);
          setModalState((prevState) => ({ ...prevState, edit: true }));
        } else {
          console.error('Selected row is not a valid object:', selectedRows[0]);
          setAlertMessage("Error: Invalid row data selected.");
        }
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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("PO Data", 20, 10);
    const pdfData = rowData.map((row) => Object.values(row));
    const headers = columnDefs.map((col) => col.headerName);
    autoTable(doc, {
      head: [headers],
      body: pdfData,
      theme: 'grid',
      styles: { fontSize: 5 },
    });
    doc.save("po_data.pdf");
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

  // Handle row selection to update selectedRow state
  const onSelectionChanged = () => {
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
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">PO Management</h1>
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
              title="Add PO"
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
              title="Edit PO"
            >
              <AiOutlineEdit className={iconSize} />
            </button>
            <button
              onClick={handleViewRow}
              className={`flex items-center justify-center ${buttonPadding} ${
                selectedRow
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              } rounded-md transition duration-300 text-xs sm:text-sm`}
              disabled={!selectedRow}
              title="View PO"
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
            onSelectionChanged={onSelectionChanged}
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

        {modalState.add && (
          <AddRowModal
            isOpen={modalState.add}
            onClose={() => {
              setModalState((prev) => ({ ...prev, add: false }));
              fetchData();
            }}
            refreshData={fetchData}
          />
        )}
        {modalState.edit && selectedRow && (
          <EditRowModal
            isOpen={modalState.edit}
            onRequestClose={() => {
              setModalState((prev) => ({ ...prev, edit: false }));
              fetchData();
            }}
            rowData={selectedRow}
            onSave={fetchData}
          />
        )}
        {modalState.view && selectedRow && (
          <ViewRowModal
            isOpen={modalState.view}
            onClose={() => {
              setModalState((prev) => ({ ...prev, view: false }));
            }}
            rowData={selectedRow}
          />
        )}
      </div>
    </div>
  );
};

export default PO;
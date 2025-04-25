"use client"; 
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "react-dropdown/style.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import EditRowModal from "@/modals/access_modals/EditRowUser";
import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import ViewRowModal from "@/modals/access_modals/ViewRowUser";
import withAuth from "@/modals/withAuth";
import { AiOutlineEdit, AiOutlineSearch, AiOutlineReload, AiOutlineEye } from "react-icons/ai";
import { User } from "@/types/index";
import debounce from "lodash/debounce";

const Users = () => {
  const [rowData, setRowData] = useState<User[]>([]);
  const [columnDefs, setColumnDefs] = useState<{ headerName: string; field: string; width?: number; editable?: boolean; frozen?: boolean; hide?: boolean; cellRenderer?: any }[]>([]);
  const [paginationPageSize, setPaginationPageSize] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [modalState, setModalState] = useState<{ add: boolean; edit: boolean; view: boolean }>({ add: false, edit: false, view: false });
  const [selectedRow, setSelectedRow] = useState<User | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [sortField, setSortField] = useState<string>("lastlogin");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const gridRef = useRef<AgGridReact>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchData = useCallback(async (searchQuery = "", page = 1) => {
    try {
      let url;
      if (searchQuery) {
        url = `${API_URL}/access/authuser/search/${searchQuery}`;
      } else {
        url = `${API_URL}/access/authuser?page=${page}&page_size=${paginationPageSize}&sort_field=${sortField}&sort_order=${sortOrder}`;
      }
      
      const response = await axios.get(url, {
        headers: { AuthToken: localStorage.getItem("token") },
      });

      let data = response.data;
      
      if (!Array.isArray(data)) { 
        if (data.data && Array.isArray(data.data)) {
          setTotalRows(data.totalRows || data.data.length);
          setTotalPages(Math.ceil((data.totalRows || data.data.length) / paginationPageSize));
          data = data.data;
        } else {
          data = [data]; 
        }
      }
      
      setRowData(data);
      
      if (data.totalRows !== undefined) {
        setTotalRows(data.totalRows);
        setTotalPages(Math.ceil(data.totalRows / paginationPageSize));
      } else if (response.data.totalRows !== undefined) {
        setTotalRows(response.data.totalRows);
        setTotalPages(Math.ceil(response.data.totalRows / paginationPageSize));
      } else {
        const totalRows = data.length;
        setTotalRows(totalRows);
        setTotalPages(Math.ceil(totalRows / paginationPageSize));
      }
      
      setupColumns(data);
      
      if (gridRef.current && gridRef.current.api) {
        gridRef.current.api.refreshClientSideRowModel();
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setAlertMessage("Error loading data. Please try again.");
      setTimeout(() => setAlertMessage(null), 3000);
    }
  }, [paginationPageSize, API_URL, sortField, sortOrder]);

  useEffect(() => {
    fetchData("", currentPage);
  }, [currentPage, fetchData, sortField, sortOrder]);

  const setupColumns = (data: User[]) => {
    if (Array.isArray(data) && data.length > 0) {
      // Define specific column configurations based on the PHP code
      const columnConfigs: { [key: string]: any } = {
        id: { headerName: "ID", field: "id", width: 70, hide: true, editable: false },
        uname: { headerName: "LoginID", field: "uname", width: 200, editable: false, frozen: true },
        level: { headerName: "Level", field: "level", width: 70, editable: true },
        instructor: { headerName: "Instructor", field: "instructor", width: 70, editable: true },
        override: { headerName: "Override", field: "override", width: 70, editable: true },
        status: { headerName: "Status", field: "status", width: 70, editable: true },
        registereddate: { 
          headerName: "Reg Date", 
          field: "registereddate", 
          width: 100, 
          editable: false,
          cellRenderer: (params: any) => {
            if (!params.value) return '';
            try {
              const date = new Date(params.value);
              if (isNaN(date.getTime())) return 'Invalid date';
              return date.toISOString().split('T')[0];
            } catch (error) {
              console.error("Error formatting date:", error);
              return 'Invalid date';
            }
          }
        },
        lastlogin: { 
          headerName: "Last Login", 
          field: "lastlogin", 
          width: 100, 
          editable: false,
          cellRenderer: (params: any) => {
            if (!params.value) return '';
            try {
              const date = new Date(params.value);
              if (isNaN(date.getTime())) return 'Invalid date';
              return date.toISOString().split('T')[0];
            } catch (error) {
              console.error("Error formatting date:", error);
              return 'Invalid date';
            }
          }
        },
        logincount: { headerName: "Login Count", field: "logincount", width: 100, editable: false },
        fullname: { headerName: "Full Name", field: "fullname", width: 200, editable: false, frozen: true },
        address: { headerName: "Address", field: "address", width: 200, editable: false },
        phone: { headerName: "Phone", field: "phone", width: 100, editable: false },
        state: { headerName: "State", field: "state", width: 90, editable: false },
        zip: { headerName: "Zip", field: "zip", width: 70, editable: false },
        city: { headerName: "City", field: "city", width: 90, editable: false },
        country: { headerName: "Country", field: "country", width: 100, editable: false },
        level3date: { 
          headerName: "Level3 Date", 
          field: "level3date", 
          width: 100, 
          editable: true,
          cellRenderer: (params: any) => {
            if (!params.value) return '';
            try {
              const date = new Date(params.value);
              if (isNaN(date.getTime())) return 'Invalid date';
              return date.toISOString().split('T')[0];
            } catch (error) {
              console.error("Error formatting date:", error);
              return 'Invalid date';
            }
          }
        }
      };

      // Create columns based on data and apply specific configurations
      const columns = Object.keys(data[0]).map((key) => {
        const config = columnConfigs[key] || {
          headerName: key.charAt(0).toUpperCase() + key.slice(1),
          field: key,
          width: 100
        };
        return config;
      });

      setColumnDefs(columns);
    } else {
      console.error("Data is not an array or is empty:", data);
    }
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

  const handleRefresh = () => {
    setSearchValue("");
    setIsSearching(false);
    fetchData("", currentPage);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchData(searchValue, newPage); 
  };

  const handlePageSizeChange = (newSize: number) => {
    setPaginationPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
    fetchData(searchValue, 1);
  };

  const searchUsers = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setIsSearching(false);
        fetchData("", currentPage);
        return;
      }
      
      try {
        setIsSearching(true);
        fetchData(query, 1);
      } catch (error) {
        console.error("Error searching users:", error);
        setAlertMessage("Error searching users. Please try again.");
        setTimeout(() => setAlertMessage(null), 3000);
      }
    },
    [currentPage, fetchData]
  );

  // Create a debounced version of the search function
  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      searchUsers(searchTerm);
    }, 500),
    [searchUsers]
  );

  const handleSearch = () => {
    if (searchValue.trim()) {
      searchUsers(searchValue);
    } else {
      setIsSearching(false);
      fetchData("", currentPage);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    
    if (value.trim()) {
      debouncedSearch(value);
    } else if (isSearching) {
      setIsSearching(false);
      fetchData("", currentPage);
    }
  };

  const handleSortChanged = () => {
    if (gridRef.current && gridRef.current.api) {
      const sortModel = gridRef.current.api.getModel().getSort();
      if (sortModel && sortModel.length > 0) {
        setSortField(sortModel[0].colId);
        setSortOrder(sortModel[0].sort);
      }
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`text-sm px-3 py-1 mx-1 rounded-md ${
            currentPage === i
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const renderPageSizeSelector = () => {
    const pageSizes = [10, 20, 50, 100, 500, 1000];
    return (
      <select
        value={paginationPageSize}
        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
        className="text-sm border border-gray-300 rounded-md p-1"
      >
        {pageSizes.map(size => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="relative">
      {alertMessage && (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-2 rounded-md shadow-md z-50">
          {alertMessage}
        </div>
      )}
      
      <div className="p-4 mt-10 mb-4 mx-auto bg-gray-100 rounded-lg shadow-md relative max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800" style={{ marginTop: '3.5rem' }}>Access Management</h1>
        </div>

        <div className="flex flex-col md:flex-row mb-4 justify-between items-center">
          <div className="flex flex-wrap w-full space-x-2 mb-2 md:mb-0">
            <div className="flex grow">
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={handleSearchInputChange}
                className="border border-gray-300 rounded-md p-1 w-full md:w-64 text-xs md:text-sm"
              />
              <button
                onClick={handleSearch}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md ml-2 transition duration-300 hover:bg-blue-900 text-xs md:text-sm"
              >
                <AiOutlineSearch className="mr-1" /> Search
              </button>
            </div>
            <button
              onClick={handleEditRow}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700 text-xs md:text-sm"
              title="Edit Selected Row"
            >
              <AiOutlineEdit className="mr-1" />
            </button>
            <button
              onClick={handleViewRow}
              className="flex items-center px-3 py-2 bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-700 text-xs md:text-sm"
              title="View Selected Row"
            >
              <AiOutlineEye className="mr-1" />
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-md transition duration-300 hover:bg-gray-700 text-xs md:text-sm"
              title="Refresh Data"
            >
              <AiOutlineReload className="mr-1" />
            </button>
          </div>
        </div>

        <div
          className="ag-theme-alpine bg-white shadow-lg rounded-lg"
          style={{ height: "400px", width: "100%" }}
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
            }}
            rowHeight={30}
            headerHeight={35}
            onSortChanged={handleSortChanged}
            suppressRowClickSelection={false}
            rowMultiSelectWithClick={true}
            enableCellTextSelection={true}
          />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center mt-4">
          <div className="flex items-center justify-center w-full md:w-auto mb-2 md:mb-0">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-2 disabled:opacity-50 bg-gray-200 rounded-md hover:bg-gray-300"
                title="First Page"
              >
                <FaAngleDoubleLeft />
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 disabled:opacity-50 bg-gray-200 rounded-md hover:bg-gray-300"
                title="Previous Page"
              >
                <FaChevronLeft />
              </button>
              {renderPageNumbers()}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 disabled:opacity-50 bg-gray-200 rounded-md hover:bg-gray-300"
                title="Next Page"
              >
                <FaChevronRight />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 disabled:opacity-50 bg-gray-200 rounded-md hover:bg-gray-300"
                title="Last Page"
              >
                <FaAngleDoubleRight />
              </button>
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="text-sm mr-2">Rows per page:</span>
            {renderPageSizeSelector()}
            <span className="text-sm ml-4">
              Showing {Math.min((currentPage - 1) * paginationPageSize + 1, totalRows)} - {Math.min(currentPage * paginationPageSize, totalRows)} of {totalRows} entries
            </span>
          </div>
        </div>

        <EditRowModal
          isOpen={modalState.edit}
          onRequestClose={() => setModalState({ ...modalState, edit: false })}
          rowData={selectedRow}
          onSave={() => {
            fetchData(searchValue, currentPage);
            setModalState({ ...modalState, edit: false });
          }}
        />
        <ViewRowModal
          isOpen={modalState.view}
          onRequestClose={() => setModalState({ ...modalState, view: false })}
          rowData={selectedRow}
        />
      </div>
    </div>
  );
};

export default withAuth(Users);
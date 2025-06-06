"use client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "react-dropdown/style.css";
import EditRowModal from "@/modals/access_modals/EditRowUser";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ViewRowModal from "@/modals/access_modals/ViewRowUser";
import axios from "axios";
import debounce from "lodash/debounce";
import withAuth from "@/modals/withAuth";
import { ColDef, ICellRendererParams, SortChangedEvent, ValueGetterParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { AiOutlineEdit, AiOutlineEye, AiOutlineReload, AiOutlineSearch } from "react-icons/ai";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { User } from "@/types/index";

interface CellRendererParams extends ICellRendererParams {
  value: string | null;
}

interface ColumnConfig extends ColDef {
  headerName: string;
  field: string;
  width?: number;
  editable?: boolean;
  frozen?: boolean;
  hide?: boolean;
  cellRenderer?: (params: CellRendererParams) => string;
  valueGetter?: (params: ValueGetterParams) => string | number;
}

const Users = () => {
  const [rowData, setRowData] = useState<User[]>([]);
  const [columnDefs, setColumnDefs] = useState<ColumnConfig[]>([]);
  const [paginationPageSize, setPaginationPageSize] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [modalState, setModalState] = useState<{ add: boolean; edit: boolean; view: boolean }>({ add: false, edit: false, view: false });
  const [selectedRow, setSelectedRow] = useState<User | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [sortField, setSortField] = useState<string>("registereddate");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [, setNotificationModal] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: "" });
  const gridRef = useRef<AgGridReact<User>>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // const closeNotificationModal = () => {
  //   setNotificationModal({ isOpen: false, message: "" });
  // };

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
      setNotificationModal({
        isOpen: true,
        message: "Error loading data. Please try again."
      });
    }
  }, [paginationPageSize, API_URL, sortField, sortOrder]);

  useEffect(() => {
    fetchData("", currentPage);
  }, [currentPage, fetchData, sortField, sortOrder]);

  const setupColumns = (data: User[]) => {
    if (Array.isArray(data) && data.length > 0) {
      // Define specific column configurations based on the PHP code
      const columnConfigs: Record<string, ColumnConfig> = {
        rowNumber: { 
          headerName: "", 
          field: "rowNumber", 
          width: 70, 
          editable: false, 
          frozen: true,
          valueGetter: (params: ValueGetterParams) => {
            const rowIndex = params.node?.rowIndex ?? 0;
            return ((currentPage - 1) * paginationPageSize) + rowIndex + 1;
          }
        },
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
          cellRenderer: (params: CellRendererParams) => {
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
          cellRenderer: (params: CellRendererParams) => {
            if (!params.value) return '';
            try {
              const date = new Date(params.value);
              if (isNaN(date.getTime())) return '';
              return date.toISOString().split('T')[0];
            } catch (error) {
              console.error("Error formatting date:", error);
              return '';
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
          cellRenderer: (params: CellRendererParams) => {
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

      // Add row number column at the beginning
      columns.unshift(columnConfigs.rowNumber);

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
        setNotificationModal({
          isOpen: true,
          message: "Please select a row to edit."
        });
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
        setNotificationModal({
          isOpen: true,
          message: "Please select a row to view."
        });
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
        setNotificationModal({
          isOpen: true,
          message: "Error searching users. Please try again."
        });
      }
    },
    [currentPage, fetchData, setIsSearching]
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

  const handleSortChanged = (event: SortChangedEvent<User>) => {
    const columnState = event.api.getColumnState();
    if (columnState.length > 0) {
      const sortModel = columnState.find((column) => column.sort);
      if (sortModel) {
        setSortField(sortModel.colId);
        setSortOrder(sortModel.sort || "asc");
      }
    }
  };
  
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
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
      <div className="p-4 mt-10 mb-4 mx-auto bg-gray-100 rounded-lg shadow-md relative max-w-full lg:max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800" style={{ marginTop: '3.5rem' }}>Access Management</h1>
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
                <AiOutlineSearch className="mr-1" /> 
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
          className="ag-theme-alpine bg-white shadow-lg rounded-lg w-full overflow-hidden"
          style={{ height: "calc(100vh - 300px)", minHeight: "400px" }}
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
              <div className="hidden sm:flex">
                {renderPageNumbers()}
              </div>
              <div className="sm:hidden">
                <span className="px-3 py-1 bg-blue-600 text-white rounded-md">
                  {currentPage} / {totalPages}
                </span>
              </div>
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
          
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
            <div className="flex items-center mb-2 sm:mb-0">
              <span className="text-xs sm:text-sm mr-2">Rows per page:</span>
              {renderPageSizeSelector()}
            </div>
            <span className="text-xs sm:text-sm ml-0 sm:ml-4">
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

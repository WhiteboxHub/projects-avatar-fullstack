"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
// import { AxiosError } from 'axios';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { FaDownload } from "react-icons/fa";
import EditRowModal from "@/modals/overdue_modals/EditRowOverdue";
import ViewRowModal from "@/modals/overdue_modals/ViewRowOverdue";
// import { MdDelete } from "react-icons/md";
import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import {
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlineSearch,
  AiOutlineReload,
} from "react-icons/ai";
// import { MdAdd } from "react-icons/md";
import { debounce } from "lodash";

interface Overdue {
  pkid?: number;
  candidateid?: number;
  candidatename?: string;
  clientname?: string;
  startdate?: string;
  enddate?: string;
  invoicedate?: string;
  amountexpected?: number;
  amountreceived?: number;
  expecteddate?: string;
  receiveddate?: string;
  checknumber?: string;
  status?: string;
  notes?: string;
  serialNo?: number;
  poid?: string;
  invoicenumber?: string;
  quantity?: number;
  rate?: number;
  remindertype?: string;
  releaseddate?: string;
  invoiceurl?: string;
  checkurl?: string;
  companyname?: string;
  vendorfax?: string;
  vendorphone?: string;
  vendoremail?: string;
  timsheetemail?: string;
  hrname?: string;
  hremail?: string;
  hrphone?: string;
  managername?: string;
  manageremail?: string;
  managerphone?: string;
  secondaryname?: string;
  secondaryemail?: string;
  secondaryphone?: string;
  candidatephone?: string;
  candidateemail?: string;
  wrkemail?: string;
  wrkphone?: string;
  recruitername?: string;
  recruiterphone?: string;
  recruiteremail?: string;
}

interface ApiOverdueResponse {
  data: Overdue[];
  totalRows: number;
}

jsPDF.prototype.autoTable = autoTable;

const OverdueComponent = () => {
  const [rowData, setRowData] = useState<Overdue[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [columnDefs, setColumnDefs] = useState<
    { headerName: string; field: string }[]
  >([]);
  const [paginationPageSize] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalState, setModalState] = useState<{
    add: boolean;
    edit: boolean;
    view: boolean;
  }>({ add: false, edit: false, view: false });
  const [selectedRow, setSelectedRow] = useState<Overdue | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const gridRef = useRef<AgGridReact>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const setupColumns = useCallback((data: Overdue[]) => {
    if (data.length > 0) {
      const columns = Object.keys(data[0]).map((key) => ({
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
        field: key,
      }));
      setColumnDefs(columns);
    }
  }, []);

  const fetchData = useCallback(async (_: unknown, page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get<ApiOverdueResponse>(`${API_URL}/overdue/get`, {
        params: {
          page: page,
          page_size: paginationPageSize,
          search_term: searchValue.trim() || null,
        },
        headers: { AuthToken: localStorage.getItem("token") || "" },
      });

      const { data, totalRows } = response.data;

      const dataWithSerials = data.map((item, index) => ({
        ...item,
        serialNo: (page - 1) * paginationPageSize + index + 1,
        amountreceived: item.amountreceived ? Number(item.amountreceived) : undefined
      }));

      setRowData(dataWithSerials);
      setTotalRows(totalRows);
      setupColumns(dataWithSerials);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [API_URL, paginationPageSize, setupColumns, searchValue]);

  const fetchOverdues = useCallback(async (searchQuery = "") => {
    setLoading(true);
    try {
      const response = await axios.get<ApiOverdueResponse>(`${API_URL}/overdue/name/${searchQuery}`, {
        headers: { AuthToken: localStorage.getItem("token") || "" },
      });
  
      console.log("API Response:", response);
  
      const { data, totalRows } = response.data;
      
      if (!Array.isArray(data)) {
        console.error("Expected an array but received:", data);
        setRowData([]);
        setTotalRows(0);
        return;
      }
  
      const processedData = data.map((item, index) => ({
        ...item,
        serialNo: index + 1,
        amountreceived: item.amountreceived ? Number(item.amountreceived) : undefined
      }));
  
      setRowData(processedData);
      setTotalRows(totalRows);
      setupColumns(processedData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [API_URL, setupColumns]);


  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query) {
        fetchOverdues(query);
      } else {
        fetchData(null, currentPage);
      }
    }, 300),
    [fetchOverdues, fetchData, currentPage]
  );

  useEffect(() => {
    fetchData(null, currentPage);
  }, [fetchData, currentPage]);

  useEffect(() => {
    if (searchValue) {
      debouncedSearch(searchValue);
    } else {
      fetchData(null, currentPage);
    }
  }, [searchValue, currentPage, fetchData, debouncedSearch]);

  const handleSearch = () => {
    if (searchValue) {
      fetchOverdues(searchValue);
    }
  };

  const handleRefresh = () => {
    setSearchValue("");
    fetchData(null, currentPage);
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

  const handlePageChange = (newPage: number) => setCurrentPage(newPage);

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

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Overdue Data", 20, 10);
    const pdfData = rowData.map((row) => Object.values(row));
    const headers = columnDefs.map((col) => col.headerName);
    autoTable(doc, {
      head: [headers],
      body: pdfData,
      theme: 'grid',
      styles: { fontSize: 5 },
    });
    doc.save("overdue_data.pdf");
  };

  const totalPages = Math.ceil(totalRows / paginationPageSize);
  const startPage = Math.max(1, currentPage);
  const endPage = Math.min(totalPages, currentPage + 4);
  const pageOptions = Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage);

  return (
    <div className="p-4 mt-20 mb-10 mx-auto bg-gray-100 rounded-lg shadow-md relative max-w-7xl">
      {alertMessage && (
        <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded-md shadow-md z-50">
          {alertMessage}
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Overdue Management</h1>
      </div>

      <div className="flex flex-col md:flex-row mb-4 justify-between items-center">
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
            onClick={handleEditRow}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700"
          >
            <AiOutlineEdit className="mr-2" />
          </button>
          {/* <button
            onClick={handleDeleteRow}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700"
          >
            <MdDelete className="mr-2" />
          </button> */}
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
          overlayLoadingTemplate={
            '<span class="ag-overlay-loading-center" style="border: 1px solid #ccc; padding: 8px; border-radius: 4px;">Loading...</span>'
          }
          onGridReady={(params) => {
            if (loading) {
              params.api.showLoadingOverlay();
            } else if (rowData.length === 0) {
              params.api.showNoRowsOverlay();
            }
          }}
        />
      </div>

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
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages} | Total: {totalRows}
        </div>
      </div>

      {modalState.edit && selectedRow && (
        <EditRowModal
          isOpen={modalState.edit}
          onRequestClose={() => setModalState((prev) => ({ ...prev, edit: false }))}
          rowData={selectedRow}
          onSave={() => fetchData(null, currentPage)}
        />
      )}
      {modalState.view && selectedRow && (
  <ViewRowModal
    isOpen={modalState.view}
    onClose={() => setModalState((prev) => ({ ...prev, view: false }))}
    rowData={{
      ...selectedRow,
      amountexpected: selectedRow.amountexpected?.toString(),
      amountreceived: selectedRow.amountreceived?.toString(),
      quantity: selectedRow.quantity?.toString()
    }}
  />
)}
    </div>
  );
};

export default OverdueComponent;

"use client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import AddRowModal from "@/modals/candidate_modals/AddRowCandidate";
import EditRowModal from "@/modals/candidate_modals/EditRowCandidate";
import React, { useEffect, useRef, useState } from "react";
import ViewRowModal from "@/modals/candidate_modals/ViewRowCandidate";
import autoTable from "jspdf-autotable";
import axios from "axios";
import withAuth from "@/modals/withAuth";
import { AgGridReact } from "ag-grid-react";
import { AxiosError } from "axios";
import { jsPDF } from "jspdf";
import { FaDownload } from "react-icons/fa";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdAdd } from "react-icons/md";
import { Candidate, TransformedCandidate } from "@/types/index";

import {
  AiOutlineEdit,
  AiOutlineSearch,
  AiOutlineReload,
  AiOutlineEye,
} from "react-icons/ai";

interface GroupedData {
  [batch: string]: Candidate[];
}

const Candidates = () => {
  const [rowData, setRowData] = useState<Candidate[]>([]);
  const [, setGroupedData] = useState<GroupedData>({});
  const [columnDefs] = useState<{ headerName: string; field: string ; width?: number;
    cellStyle?: any;}[]>([
    { headerName: "Batchname", field: "batchname", width: 120, cellStyle: { fontWeight: 'bold' } },
    { headerName: "Candidateid", field: "candidateid", width: 120 },
    { headerName: "Name", field: "name", width: 120 },
    { headerName: "Email", field: "email", width: 120 },
    { headerName: "Phone", field: "phone", width: 120 },
    { headerName: "Course", field: "course", width: 120 },
    { headerName: "Enrolleddate", field: "enrolleddate", width: 120 },
    { headerName: "Status", field: "status", width: 120 },
    { headerName: "Statuschangedate", field: "statuschangedate", width: 120 },
    { headerName: "Processflag", field: "processflag", width: 120 },
    { headerName: "Diceflag", field: "diceflag", width: 120 },
    { headerName: "Workstatus", field: "workstatus", width: 120 },
    { headerName: "Education", field: "education", width: 120 },
    { headerName: "Workexperience", field: "workexperience", width: 120 },
    { headerName: "SSN", field: "ssn", width: 120 },
    { headerName: "DOB", field: "dob", width: 120 },
    { headerName: "Portalid", field: "portalid", width: 120 },
    { headerName: "WP Expiration", field: "wpexpirationdate", width: 120 },
    { headerName: "SSN Validated", field: "ssnvalidated", width: 120 },
    { headerName: "BGV", field: "bgv", width: 120 },
    { headerName: "Secondary Email", field: "secondaryemail", width: 120 },
    { headerName: "Secondary Phone", field: "secondaryphone", width: 120 },
    { headerName: "Address", field: "address", width: 120 },
    { headerName: "City", field: "city", width: 120 },
    { headerName: "State", field: "state", width: 120 },
    { headerName: "Country", field: "country", width: 120 },
    { headerName: "ZIP", field: "zip", width: 120 },
    { headerName: "Guarantor Name", field: "guarantorname", width: 120 },
    { headerName: "Guarantor Designation", field: "guarantordesignation", width: 120 },
    { headerName: "Guarantor Company", field: "guarantorcompany", width: 120 },
    { headerName: "Emergency Contact", field: "emergcontactname", width: 120 },
    { headerName: "Emergency Email", field: "emergcontactemail", width: 120 },
    { headerName: "Emergency Phone", field: "emergcontactphone", width: 120 },
    { headerName: "Emergency Address", field: "emergcontactaddrs", width: 120 },
    { headerName: "Term", field: "term", width: 120 },
    { headerName: "Fee Paid", field: "feepaid", width: 120 },
    { headerName: "Fee Due", field: "feedue", width: 120 },
    { headerName: "Referral ID", field: "referralid", width: 120 },
    { headerName: "Salary 0", field: "salary0", width: 120 },
    { headerName: "Salary 6", field: "salary6", width: 120 },
    { headerName: "Salary 12", field: "salary12", width: 120 },
    { headerName: "Original Resume", field: "originalresume", width: 120 },
    { headerName: "Contract URL", field: "contracturl", width: 120 },
    { headerName: "Emp Agreement URL", field: "empagreementurl", width: 120 },
    { headerName: "Offer Letter URL", field: "offerletterurl", width: 120 },
    { headerName: "DL URL", field: "dlurl", width: 120 },
    { headerName: "Work Permit URL", field: "workpermiturl", width: 120 },
    { headerName: "SSN URL", field: "ssnurl", width: 120 },
    { headerName: "Notes", field: "notes", width: 120 }
  ]);
  const [paginationPageSize] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalState, setModalState] = useState<{
    add: boolean;
    edit: boolean;
    view: boolean;
  }>({ add: false, edit: false, view: false });
  const [selectedRow, setSelectedRow] = useState<Candidate | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const gridRef = useRef<AgGridReact>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchData = async () => {
    try {
      setLoading(true);
      if (gridRef.current?.api) {
        gridRef.current.api.showLoadingOverlay();
      }
      const response = await axios.get(`${API_URL}/candidates/search`, {
        params: {
          page: currentPage,
          pageSize: paginationPageSize,
          search: searchValue
        },
        headers: { AuthToken: localStorage.getItem("token") },
      });
      const { data, totalRows } = response.data;
      setRowData(data);
      setTotalRows(totalRows);
      setTotalPages(Math.ceil(totalRows / paginationPageSize));
    } catch (error) {
      console.error("Error loading data:", error);
      setRowData([]);
      if (gridRef.current?.api) {
        gridRef.current.api.showNoRowsOverlay();
      }
    } finally {
      setLoading(false);
    }
  };

  interface ErrorResponse {
    message: string;
  }

  const fetchBatches = async (searchQuery = "") => {
    try {
      setLoading(true);
      if (gridRef.current?.api) {
        gridRef.current.api.showLoadingOverlay();
      }
      const response = await axios.get(`${API_URL}/search`, {
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
      setTotalPages(Math.ceil(totalRows / paginationPageSize));
    } catch (error) {
      console.error("Error loading data:", error);
      setRowData([]);
      if (gridRef.current?.api) {
        gridRef.current.api.showNoRowsOverlay();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchBatches(searchValue);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Candidate Data", 10, 10);
    const pdfData = rowData.map((row) => Object.values(row));
    const headers = columnDefs.map((col) => col.headerName);

    autoTable(doc, {
      head: [headers],
      body: pdfData,
      theme: 'grid',
      styles: { fontSize: 5 },
    });

    doc.save("candidate_data.pdf");
  };

  const handleRefresh = () => {
    setSearchValue("");
    setCurrentPage(1);
    fetchData();
  };

  const handleViewRow = () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        setSelectedRow(selectedRows[0]);
        setModalState((prevState) => ({ ...prevState, view: true }));
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.sizeColumnsToFit();
    }
  }, [rowData]);

  const handleAddRow = () =>
    setModalState((prevState) => ({ ...prevState, add: true }));

  const handleEditRow = () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        setSelectedRow(selectedRows[0]);
        setModalState((prevState) => ({ ...prevState, edit: true }));
      } else {
        alert("Please select a row to edit");
      }
    }
  };

  const handleDeleteRow = async () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        const candidateid = selectedRows[0].candidateid;

        if (candidateid) {
          const confirmation = window.confirm(
            `Are you sure you want to delete candidate ${candidateid}?`
          );
          if (!confirmation) return;

          try {
            await axios.delete(`${API_URL}/candidates/candidates/delete/${candidateid}`, {
              headers: { AuthToken: localStorage.getItem("token") },
            });
            alert(`Candidate ${candidateid} deleted successfully.`);
            fetchData();
          } catch (error) {
            const axiosError = error as AxiosError;
            alert(
              `Failed to delete candidate: ${(axiosError.response?.data as ErrorResponse)?.message || axiosError.message
              }`
            );
          }
        } else {
          alert("No valid candidate ID found for the selected row.");
        }
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = startPage + maxVisiblePages - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Candidate Management</h1>
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
            suppressSizeToFit: true
          }}
          rowHeight={30}
          headerHeight={35}
          getRowStyle={() => ({
            paddingTop: "5px",
            backgroundColor: '#ffffff',
            fontWeight: 'normal',
          })}
          onGridReady={(params) => {
            params.api.sizeColumnsToFit();
            if (loading) {
              params.api.showLoadingOverlay();
            }
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
      </div>

      <div className="flex justify-between mt-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="p-2 disabled:opacity-50 bg-gray-200 rounded hover:bg-gray-300"
          >
            <FaAngleDoubleLeft />
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 disabled:opacity-50 bg-gray-200 rounded hover:bg-gray-300"
          >
            <FaChevronLeft />
          </button>

          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 disabled:opacity-50 bg-gray-200 rounded hover:bg-gray-300"
          >
            <FaChevronRight />
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 disabled:opacity-50 bg-gray-200 rounded hover:bg-gray-300"
          >
            <FaAngleDoubleRight />
          </button>
          <span className="ml-4 text-sm text-gray-600">
            Total Records: {totalRows}
          </span>
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
          onClose={() => setModalState({ ...modalState, edit: false })}
          refreshData={fetchData}
          candidateData={selectedRow}
        />
      )}
      {modalState.view && selectedRow && (
        <ViewRowModal
          isOpen={modalState.view}
          onClose={() => setModalState((prev) => ({ ...prev, view: false }))}
          onRequestClose={() => setModalState((prev) => ({ ...prev, view: false }))}
          rowData={selectedRow}
        />
      )}
    </div>
  );
};

export default withAuth(Candidates);
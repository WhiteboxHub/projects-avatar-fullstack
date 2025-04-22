"use client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import AddRowModal from "@/modals/list_vendor_modals/AddRowListVendor";
import EditRowModal from "@/modals/list_vendor_modals/EditRowListVendor";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ViewRowModal from "@/modals/list_vendor_modals/ViewRowListVendor";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { jsPDF } from "jspdf";

import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdVisibility,
  MdSearch,
  MdDownload,
} from "react-icons/md";
import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";

// Define types
interface Recruiter {
  id: number;
  name: string;
  email: string;
  phone: string;
  designation: string;
  vendorid: number;
  comp: string;
  status: string;
  dob: string;
  personalemail: string;
  skypeid: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  review: string;
  notes: string;
  employeeid?: string;
  lastmoddatetime?: string;
}

const RecruiterByVendorList = () => {
  const [rowData, setRowData] = useState<Recruiter[]>([]);
  const [selectedRow, setSelectedRow] = useState<Recruiter | null>(null);
  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    view: false,
  });
  const [ setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageSize] = useState<number>(200);
  const [searchValue, setSearchValue] = useState<string>("");
  const gridRef = useRef<AgGridReact>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchRecruiters(currentPage);
  }, [currentPage]);

  // Debounced search function
  const debouncedSearch = useCallback((value: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (value === '') {
        fetchRecruiters(1);
      } else {
        fetchRecruiters(1, value);
      }
    }, 500); // 500ms debounce delay
  }, []);

  // Handle search input changes with debounce
  useEffect(() => {
    debouncedSearch(searchValue);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchValue, debouncedSearch]);

  const fetchRecruiters = async (page: number, search?: string) => {
    setLoading(true);
    try {
      const params: any = {
        page,
        pageSize,
      };

      if (search) {
        params.search = search;
      }

      const response = await axios.get(`${API_URL}/recruiters/byVendorList`, {
        headers: { AuthToken: localStorage.getItem("token") },
        params,
      });

      setRowData(response.data.data);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error("Error fetching recruiters:", error);
      showAlert("Failed to fetch recruiters", "error");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message: string, type: string) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  };

  const handleAdd = () => setModalState({ ...modalState, add: true });
  const handleEdit = () => {
    const selectedRows = gridRef.current?.api.getSelectedRows();
    if (selectedRows && selectedRows.length > 0) {
      setSelectedRow(selectedRows[0]);
      setModalState({ ...modalState, edit: true });
    } else {
      showAlert("Please select a row to edit", "error");
    }
  };
  const handleView = () => {
    const selectedRows = gridRef.current?.api.getSelectedRows();
    if (selectedRows && selectedRows.length > 0) {
      setSelectedRow(selectedRows[0]);
      setModalState({ ...modalState, view: true });
    } else {
      showAlert("Please select a row to view", "error");
    }
  };
  const handleDelete = async () => {
    const selectedRows = gridRef.current?.api.getSelectedRows();
    if (selectedRows && selectedRows.length > 0) {
      try {
        await axios.delete(
          `${API_URL}/by/recruiters/byVendorList/remove/${selectedRows[0].id}`,
          { headers: { AuthToken: localStorage.getItem("token") } }
        );
        showAlert("Recruiter deleted successfully", "success");
        fetchRecruiters(currentPage);
      } catch (error) {
        console.error("Error deleting recruiter:", error);
        showAlert("Failed to delete recruiter", "error");
      }
    } else {
      showAlert("Please select a row to delete", "error");
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Vendor Recruiter Data", 20, 10);
    autoTable(doc, {
      head: [["ID", "Name", "Email", "Phone", "Company", "Status", "Designation", "DOB", "Personal Email", "Employee ID", "Skype ID", "LinkedIn", "Twitter", "Facebook", "Review", "Vendor ID", "Notes", "Last Modified DateTime"]],
      body: rowData.map((row) => [
        row.id,
        row.name || "",
        row.email,
        row.phone,
        row.comp || "",
        row.status,
        row.designation || "",
        row.dob || "",
        row.personalemail || "",
        row.employeeid || "",
        row.skypeid || "",
        row.linkedin || "",
        row.twitter || "",
        row.facebook || "",
        row.review || "",
        row.vendorid,
        row.notes || "",
        row.lastmoddatetime || "",
      ]),
    });
    doc.save("vendor_recruiter_data.pdf");
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`text-sm px-2 py-1 rounded-md ${
              currentPage === i
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            } hidden sm:block`}
          >
            {i}
          </button>
        );
      }
    }
    return pageNumbers;
  };

  const columnDefs = [
    { headerName: "ID", field: "id", width: 70 },
    { headerName: "Name", field: "name", width: 150 },
    { headerName: "Email", field: "email", width: 180 },
    { headerName: "Phone", field: "phone", width: 120 },
    { headerName: "Designation", field: "designation", width: 150 },
    { headerName: "Vendor ID", field: "vendorid", width: 100 },
    { headerName: "Company", field: "comp", width: 150 },
    { headerName: "Status", field: "status", width: 100 },
    { headerName: "DOB", field: "dob", width: 110 },
    { headerName: "Personal Email", field: "personalemail", width: 180 },
    { headerName: "Skype ID", field: "skypeid", width: 120 },
    { headerName: "LinkedIn", field: "linkedin", width: 150 },
    { headerName: "Twitter", field: "twitter", width: 120 },
    { headerName: "Facebook", field: "facebook", width: 120 },
    { headerName: "Review", field: "review", width: 100 },
    { headerName: "Notes", field: "notes", width: 200 },
  ];

  return (
    <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md relative">
      {alert.show && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-md z-50 ${
            alert.type === "error" ? "bg-red-500" : "bg-green-500"
          } text-white`}
        >
          {alert.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Vendor Recruiter Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleAdd}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <MdAdd className="mr-2" />
          </button>
          <button
            onClick={handleEdit}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <MdEdit className="mr-2" />
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <MdDelete className="mr-2" />
          </button>
          <button
            onClick={handleView}
            className="flex items-center px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-700"
          >
            <MdVisibility className="mr-2" />
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            <MdDownload className="mr-2" />
          </button>
        </div>
      </div>

      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-64"
        />
        <button
          onClick={() => fetchRecruiters(1, searchValue)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md ml-2 hover:bg-blue-900"
        >
          <MdSearch className="mr-2" /> Search
        </button>
      </div>

      <div
        className="ag-theme-alpine"
        style={{ height: "400px", width: "100%", overflowY: "auto" }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          rowSelection="multiple"
          pagination={false}
          defaultColDef={{
            sortable: true,
            filter: true,
            cellStyle: { color: "#333", fontSize: "0.75rem", padding: "1px" },
            minWidth: 60,
            maxWidth: 200,
          }}
          rowHeight={30}
          headerHeight={35}
        />
      </div>

      <div className="flex justify-between mt-4">
        <div className="flex items-center flex-wrap gap-2 overflow-auto">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="text-sm px-2 py-1 rounded-md"
          >
            <FaAngleDoubleLeft />
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-sm px-2 py-1 rounded-md"
          >
            <FaChevronLeft />
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="text-sm px-2 py-1 rounded-md"
          >
            <FaChevronRight />
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="text-sm px-2 py-1 rounded-md"
          >
            <FaAngleDoubleRight />
          </button>
        </div>
      </div>

      {modalState.add && (
        <AddRowModal
          isOpen={modalState.add}
          onClose={() => setModalState((prev) => ({ ...prev, add: false }))}
          onSubmit={() => {
            fetchRecruiters(currentPage);
            setModalState((prev) => ({ ...prev, add: false }));
          }}
        />
      )}

      {modalState.edit && selectedRow && (
        <EditRowModal
          isOpen={modalState.edit}
          onClose={() => setModalState((prev) => ({ ...prev, edit: false }))}
          initialData={selectedRow}
          onSubmit={() => {
            fetchRecruiters(currentPage);
            setModalState((prev) => ({ ...prev, edit: false }));
          }}
        />
      )}

      {modalState.view && selectedRow && (
        <ViewRowModal
          isOpen={modalState.view}
          onClose={() => setModalState((prev) => ({ ...prev, view: false }))}
          recruiter={selectedRow}
        />
      )}
    </div>
  );
};

export default RecruiterByVendorList;

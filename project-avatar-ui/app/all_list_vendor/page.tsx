"use client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import AddRowModal from "@/modals/vendor_list_modals/AddRowListVendor";
import EditRowModal from "@/modals/vendor_list_modals/EditRowListVendor";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ViewRowModal from "@/modals/vendor_list_modals/ViewRowListVendor";
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
  FaSync
} from "react-icons/fa";

interface Vendor {
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
  clientid: number;
  facebook: string;
  review: string;
  notes: string;
}

interface SearchParams {
  page: number;
  pageSize: number;
  search?: string;
}

const RecruiterByAllListVendor = () => {
  const [rowData, setRowData] = useState<Vendor[]>([]);
  const [selectedRow, setSelectedRow] = useState<Vendor | null>(null);
  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    view: false,
  });
  const [, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageSize] = useState<number>(200);
  const [searchValue, setSearchValue] = useState<string>("");
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const gridRef = useRef<AgGridReact>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Track window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchRecruiters = useCallback(async (page: number, search?: string) => {
    setLoading(true);
    try {
      const params: SearchParams = { 
        page, 
        pageSize,
      };
      
      if (search) {
        params.search = search;
      }
  
      const response = await axios.get(`${API_URL}/recruiters/byAllListVendor`, {
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
  }, [API_URL, pageSize]);

  useEffect(() => {
    fetchRecruiters(currentPage);
  }, [currentPage, fetchRecruiters]);

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
    }, 500);
  }, [fetchRecruiters]);

  useEffect(() => {
    debouncedSearch(searchValue);
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchValue, debouncedSearch]);

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
          `${API_URL}/recruiters/byAllListVendor/remove/${selectedRows[0].id}`,
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
    doc.text("Recruiter Data", 20, 10);
    autoTable(doc, {
      head: [["ID", "Name", "Email", "Phone", "Company", "Status", "Designation", "DOB", "Personal Email", "Skype ID", "LinkedIn", "Twitter", "Facebook", "Review", "Vendor ID", "Notes"]],
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
        row.skypeid || "",
        row.linkedin || "",
        row.twitter || "",
        row.facebook || "",
        row.review || "",
        row.vendorid,
        row.notes || "",
      ]),
    });
    doc.save("recruiter_data.pdf");
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
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

  const startPage = Math.max(1, currentPage);
  const endPage = Math.min(totalPages, currentPage + (windowWidth < 640 ? 2 : 4));
  const pageOptions = Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage);

  const columnDefs = useMemo(() => [
    { 
      headerName: "ID", 
      field: "id", 
      width: windowWidth < 640 ? 50 : 70,
      hide: windowWidth < 768 
    },
    { 
      headerName: "Name", 
      field: "name", 
      width: windowWidth < 640 ? 120 : 150 
    },
    { 
      headerName: "Email", 
      field: "email", 
      width: windowWidth < 640 ? 150 : 180,
      hide: windowWidth < 1024 
    },
    { 
      headerName: "Phone", 
      field: "phone", 
      width: windowWidth < 640 ? 100 : 120 
    },
    { 
      headerName: "Designation", 
      field: "designation", 
      width: windowWidth < 640 ? 120 : 150,
      hide: windowWidth < 768 
    },
    { 
      headerName: "Vendor ID", 
      field: "vendorid", 
      width: windowWidth < 640 ? 80 : 100,
      hide: windowWidth < 640 
    },
    { 
      headerName: "Company", 
      field: "comp", 
      width: windowWidth < 640 ? 120 : 150,
      hide: windowWidth < 1024 
    },
    { 
      headerName: "Status", 
      field: "status", 
      width: windowWidth < 640 ? 80 : 100 
    },
    { 
      headerName: "DOB", 
      field: "dob", 
      width: windowWidth < 640 ? 80 : 100,
      hide: true 
    },
    { 
      headerName: "Personal Email", 
      field: "personalemail", 
      width: windowWidth < 640 ? 150 : 180,
      hide: true 
    },
    { 
      headerName: "Skype ID", 
      field: "skypeid", 
      width: windowWidth < 640 ? 100 : 120,
      hide: true 
    },
    { 
      headerName: "LinkedIn", 
      field: "linkedin", 
      width: windowWidth < 640 ? 120 : 150,
      hide: true 
    },
    { 
      headerName: "Twitter", 
      field: "twitter", 
      width: windowWidth < 640 ? 100 : 120,
      hide: true 
    },
    { 
      headerName: "Facebook", 
      field: "facebook", 
      width: windowWidth < 640 ? 100 : 120,
      hide: true 
    },
    { 
      headerName: "Review", 
      field: "review", 
      width: windowWidth < 640 ? 80 : 100,
      hide: true 
    },
    { 
      headerName: "Notes", 
      field: "notes", 
      width: windowWidth < 640 ? 150 : 200,
      hide: windowWidth < 1024 
    },
  ], [windowWidth]);

  return (
    <div className="relative">
      {alert.show && (
        <div
          className={`fixed top-4 right-4 p-3 sm:p-4 rounded-md shadow-md z-50 ${
            alert.type === "error" ? "bg-red-500" : "bg-green-500"
          } text-white text-xs sm:text-sm`}
        >
          {alert.message}
        </div>
      )}

      <div className="p-2 sm:p-4 mt-16 sm:mt-20 mb-6 sm:mb-10 mx-2 sm:mx-4 md:mx-8 lg:mx-12 xl:mx-16 bg-gray-100 rounded-lg shadow-md relative">
        <div className="flex flex-col md:flex-row justify-between items-center mb-3 sm:mb-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            Recruiter Management (Vendor)
          </h1>
          <div className="flex items-center space-x-1 mt-2 md:mt-0">
            <button
              onClick={handleAdd}
              className={`flex items-center justify-center ${buttonPadding} bg-green-600 text-white rounded-md hover:bg-green-700 text-xs sm:text-sm`}
              title="Add Recruiter"
            >
              <MdAdd className={iconSize} />
            </button>
            <button
              onClick={handleEdit}
              className={`flex items-center justify-center ${buttonPadding} bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs sm:text-sm`}
              title="Edit Recruiter"
            >
              <MdEdit className={iconSize} />
            </button>
            <button
              onClick={handleDelete}
              className={`flex items-center justify-center ${buttonPadding} bg-red-600 text-white rounded-md hover:bg-red-700 text-xs sm:text-sm`}
              title="Delete Recruiter"
            >
              <MdDelete className={iconSize} />
            </button>
            <button
              onClick={() => fetchRecruiters(currentPage)}
              className={`flex items-center justify-center ${buttonPadding} bg-gray-500 text-white rounded-md hover:bg-gray-900 text-xs sm:text-sm`}
              title="Refresh"
            >
              <FaSync className={iconSize} />
            </button>
            <button
              onClick={handleView}
              className={`flex items-center justify-center ${buttonPadding} bg-gray-400 text-white rounded-md hover:bg-gray-700 text-xs sm:text-sm`}
              title="View Recruiter"
            >
              <MdVisibility className={iconSize} />
            </button>
            <button
              onClick={handleDownloadPDF}
              className={`flex items-center justify-center ${buttonPadding} bg-purple-600 text-white rounded-md hover:bg-purple-700 text-xs sm:text-sm`}
              title="Download PDF"
            >
              <MdDownload className={iconSize} />
            </button>
          </div>
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
              onClick={() => fetchRecruiters(1, searchValue)}
              className={`flex items-center ${buttonPadding} bg-blue-600 text-white rounded-md ml-1 sm:ml-2 hover:bg-blue-900 text-xs sm:text-sm`}
            >
              <MdSearch className={`mr-1 ${iconSize}`} /> 
              <span className="hidden xs:inline">Search</span>
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
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            rowSelection="multiple"
            pagination={false}
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
            overlayNoRowsTemplate={
              '<span class="ag-overlay-no-rows-center" style="border: 1px solid #ccc; padding: 8px; border-radius: 4px;">Loading...</span>'
            }
            rowHeight={windowWidth < 640 ? 25 : windowWidth < 1024 ? 28 : 30}
            headerHeight={windowWidth < 640 ? 30 : windowWidth < 1024 ? 32 : 35}
          />
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
                  className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md text-xs sm:text-sm ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
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
            Page {currentPage} of {totalPages}
          </span>
        </div>

        {modalState.add && (
          <AddRowModal
            isOpen={modalState.add}
            onClose={() => setModalState((prev) => ({ ...prev, add: false }))}
            onSubmit={() => {
              fetchRecruiters(currentPage);
              setModalState((prev) => ({ ...prev, add: false }));
            }}
            type="vendor"
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
            type="vendor"
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

export default RecruiterByAllListVendor;
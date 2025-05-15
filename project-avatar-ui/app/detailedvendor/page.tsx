"use client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import AddRowModal from "@/modals/vendor_modals_detailed/AddRowVendor";
import EditRowRecruiter from "@/modals/vendor_modals_detailed/EditRowVendor";
import Modal from "react-modal";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { ColDef, SortChangedEvent, ValueGetterParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { jsPDF } from "jspdf";
import { debounce } from "lodash";
import { AiOutlineClose, AiOutlineReload } from "react-icons/ai";
import { FaFilePdf } from "react-icons/fa";
import { MdAdd, MdDelete } from "react-icons/md";
import { RecruiterDetails } from "@/types/byDetailed";

import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import {
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlineSearch
} from "react-icons/ai";

interface ViewRowRecruiterComponentProps {
  isOpen: boolean;
  onClose: () => void;
  recruiter: RecruiterDetails | null;
}

const ViewRowRecruiterComponent: React.FC<ViewRowRecruiterComponentProps> = ({ isOpen, onClose, recruiter }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, -50%)',
          maxWidth: '400px',
          width: '90%',
          maxHeight: '80vh',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          overflowY: 'auto',
          fontFamily: 'Arial, sans-serif',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      contentLabel="View Recruiter Details"
      ariaHideApp={false}
    >
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
        >
          <AiOutlineClose />
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">Recruiter Details</h2>

      <div className="space-y-4">
        {recruiter ? (
          <>
            {Object.entries(recruiter).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</label>
                <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                  {value || 'N/A'}
                </div>
              </div>
            ))}
          </>
        ) : (
          <p>No data available</p>
        )}
      </div>
    </Modal>
  );
};

jsPDF.prototype.autoTable = autoTable;

const RecruiterByVendor = () => {
  const [modalState, setModalState] = useState<{
    add: boolean;
    edit: boolean;
    view: boolean;
  }>({ add: false, edit: false, view: false });

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [rowData, setRowData] = useState<RecruiterDetails[]>([]);
  const [selectedRecruiter, setSelectedRecruiter] = useState<RecruiterDetails | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const gridRef = useRef<AgGridReact>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(1000);
  const [sortField, setSortField] = useState("status");
  const [sortOrder, setSortOrder] = useState("asc");
  const [vendorsList, setVendorsList] = useState<{ id: number; companyname: string }[]>([]);
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

  // Add a function to fetch vendors
  const fetchVendors = useCallback(async () => {
    try {
      // This endpoint exists in the API (byvendorRoute.py)
      const response = await axios.get(`${API_URL}/recruiters/byVendor/vendors`, {
        headers: { AuthToken: localStorage.getItem("token") },
      });
      
      // Transform vendor data
      const vendorOptions = response.data.map((vendor: { id: number; companyname?: string; comp?: string; name?: string }) => ({
        id: vendor.id,
        companyname: vendor.companyname || vendor.comp || vendor.name || `Vendor ${vendor.id}`
      }));
      
      console.log("Fetched vendors:", vendorOptions);
      setVendorsList(vendorOptions);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setAlertMessage("Failed to load vendors list. Please try again.");
      setTimeout(() => setAlertMessage(null), 3000);
    }
  }, [API_URL]);

  // Call this when component mounts
  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const fetchRecruiters = async (page: number, search?: string) => {
    try {
      const response = await axios.get(`${API_URL}/recruiters/byVendorDetailed`, {
        params: {
          page,
          pageSize,
          sortField,
          sortOrder,
          searchTerm: search || undefined
        },
        headers: { AuthToken: localStorage.getItem("token") }
      });
      setRowData(response.data.data);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error("Error fetching recruiters:", error);
    }
  };

  useEffect(() => {
    fetchRecruiters(currentPage);
  }, [currentPage, sortField, sortOrder]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      fetchRecruiters(1, searchTerm);
      setCurrentPage(1);
    }, 500),
    []
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleAddRow = () => setModalState((prevState) => ({ ...prevState, add: true }));

  const handleEditRow = () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        // Don't open the edit modal immediately - first make sure we have vendors
        setSelectedRecruiter(selectedRows[0]);
        
        // If vendors list is empty, fetch them first
        if (vendorsList.length === 0) {
          setAlertMessage("Loading vendors list...");
          fetchVendors()
            .then(() => {
              setModalState((prevState) => ({ ...prevState, edit: true }));
              setAlertMessage(null);
            })
            .catch(() => {
              setAlertMessage("Failed to load vendors. Please try again.");
              setTimeout(() => setAlertMessage(null), 3000);
            });
        } else {
          // We already have vendors, just open the modal
          setModalState((prevState) => ({ ...prevState, edit: true }));
        }
      } else {
        setAlertMessage("Please select a row to edit.");
        setTimeout(() => setAlertMessage(null), 3000);
      }
    }
  };

  const handleDeleteRow = async () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        const confirmDelete = window.confirm("Are you sure you want to delete the selected recruiter(s)?");
        if (confirmDelete) {
          setAlertMessage("Deleting selected recruiters...");
          try {
            // Batch delete requests
            await Promise.all(selectedRows.map(row =>
              axios.delete(`${API_URL}/recruiters/byVendorDetailed/remove/${row.id}`, {
                headers: { AuthToken: localStorage.getItem("token") }
              })
            ));
            setAlertMessage("Recruiters deleted successfully.");
            fetchRecruiters(currentPage, searchValue);
          } catch (error) {
            console.error("Error deleting recruiters:", error);
            setAlertMessage("Error deleting recruiters.");
          } finally {
            setTimeout(() => setAlertMessage(null), 3000);
          }
        }
      } else {
        setAlertMessage("Please select a row to delete.");
        setTimeout(() => setAlertMessage(null), 3000);
      }
    }
  };
  
  const handleViewRow = () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        setSelectedRecruiter(selectedRows[0]);
        setModalState((prevState) => ({ ...prevState, view: true }));
      } else {
        setAlertMessage("Please select a row to view.");
        setTimeout(() => setAlertMessage(null), 3000);
      }
    }
  };

  const handleDownloadPDF = () => {
    if (!rowData.length) return;

    const doc = new jsPDF();
    doc.text("Vendor Recruiters Data", 20, 10);

    const tableColumn = ["ID", "Name", "Email", "Phone", "Designation", "Vendor", "Status"];
    const tableRows = rowData.map(item => [
      item.id,
      item.name,
      item.email,
      item.phone,
      item.designation,
      item.comp,
      item.status
    ]);

    doc.autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20
    });

    doc.save("vendor_recruiters_data.pdf");
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const startPage = Math.max(1, currentPage);
  const endPage = Math.min(totalPages, currentPage + (windowWidth < 640 ? 2 : 4));
  const pageOptions = Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage);

  const handleSortChanged = (event: SortChangedEvent) => {
    const columnState = event.api.getColumnState();
    if (columnState.length > 0) {
      const sortModel = columnState.find((column) => column.sort);
      if (sortModel) {
        setSortField(sortModel.colId);
        setSortOrder(sortModel.sort || "asc");
      }
    }
  };

  // const columnDefs = useMemo<ColDef[]>(() => [
  //   {
  //     headerName: "#",
  //     width: windowWidth < 640 ? 40 : 60,
  //     valueGetter: (params: ValueGetterParams) => {
  //       if (params.node && params.node.rowIndex !== null) {
  //         return params.node.rowIndex + 1;
  //       }
  //       return null;
  //     },
  //     pinned: windowWidth < 640 ? undefined : 'left',
  //     cellStyle: {
  //       borderRight: '2px solid #ccc'
  //     }
  //   },
  //   { 
  //     headerName: "ID", 
  //     field: "id", 
  //     width: windowWidth < 640 ? 50 : 70,
  //     hide: windowWidth < 768 
  //   },
  //   { 
  //     headerName: "Name", 
  //     field: "name", 
  //     width: windowWidth < 640 ? 120 : 150, 
  //     pinned: windowWidth < 640 ? undefined : 'left'
  //   },
  //   { 
  //     headerName: "Email", 
  //     field: "email", 
  //     width: windowWidth < 640 ? 150 : 180,
  //     hide: windowWidth < 1024
  //   },
  //   { 
  //     headerName: "Phone", 
  //     field: "phone", 
  //     width: windowWidth < 640 ? 100 : 120 
  //   },
  //   { 
  //     headerName: "Designation", 
  //     field: "designation", 
  //     width: windowWidth < 640 ? 120 : 150,
  //     hide: windowWidth < 768 
  //   },
  //   { 
  //     headerName: "Vendor ID", 
  //     field: "vendorid", 
  //     width: windowWidth < 640 ? 80 : 100,
  //     hide: windowWidth < 640
  //   },
  //   { 
  //     headerName: "Company", 
  //     field: "comp", 
  //     width: windowWidth < 640 ? 120 : 150,
  //     hide: windowWidth < 1024
  //   },
  //   {
  //     headerName: "Status",
  //     field: "status",
  //     width: windowWidth < 640 ? 80 : 100,
  //     cellRenderer: (params: { value: string }) => {
  //       const statusMap: {[key: string]: string} = {
  //         'A': 'Active',
  //         'I': 'Inactive',
  //         'D': 'Delete',
  //         'R': 'Rejected',
  //         'N': 'Not Interested',
  //         'E': 'Excellent'
  //       };
  //       return statusMap[params.value] || params.value;
  //     }
  //   },
  //   { 
  //     headerName: "DOB", 
  //     field: "dob", 
  //     width: windowWidth < 640 ? 80 : 110,
  //     hide: true
  //   },
  //   { 
  //     headerName: "Personal Email", 
  //     field: "personalemail", 
  //     width: windowWidth < 640 ? 150 : 180,
  //     hide: true
  //   },
  //   { 
  //     headerName: "Skype ID", 
  //     field: "skypeid", 
  //     width: windowWidth < 640 ? 100 : 120,
  //     hide: true
  //   },
  //   { 
  //     headerName: "LinkedIn", 
  //     field: "linkedin", 
  //     width: windowWidth < 640 ? 100 : 120,
  //     hide: true
  //   },
  //   { 
  //     headerName: "Twitter", 
  //     field: "twitter", 
  //     width: windowWidth < 640 ? 100 : 120,
  //     hide: true
  //   },
  //   { 
  //     headerName: "Facebook", 
  //     field: "facebook", 
  //     width: windowWidth < 640 ? 100 : 120,
  //     hide: true
  //   },
  //   {
  //     headerName: "Review",
  //     field: "review",
  //     width: windowWidth < 640 ? 80 : 100,
  //     hide: windowWidth < 1024,
  //     cellRenderer: (params: { value: string }) => {
  //       return params.value === 'Y' ? 'Yes' : params.value === 'N' ? 'No' : params.value;
  //     }
  //   },
  //   { 
  //     headerName: "Notes", 
  //     field: "notes", 
  //     width: windowWidth < 640 ? 150 : 200,
  //     hide: windowWidth < 1024
  //   },
  // ], [windowWidth]);
  const columnDefs = useMemo<ColDef[]>(() => [
    {
      headerName: "#",
      width: windowWidth < 640 ? 40 : 60,
      valueGetter: (params: ValueGetterParams) => {
        if (params.node && params.node.rowIndex !== null) {
          return (currentPage - 1) * pageSize + params.node.rowIndex + 1;
        }
        return null;
      },
      pinned: windowWidth < 640 ? undefined : 'left',
      cellStyle: {
        borderRight: '2px solid #ccc'
      }
    },
    { 
      headerName: "ID", 
      field: "id", 
      width: windowWidth < 640 ? 50 : 70,
      hide: windowWidth < 768 
    },
    { 
      headerName: "Name", 
      field: "name", 
      width: windowWidth < 640 ? 120 : 150, 
      pinned: windowWidth < 640 ? undefined : 'left'
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
      width: windowWidth < 640 ? 80 : 100,
      cellRenderer: (params: { value: string }) => {
        const statusMap: {[key: string]: string} = {
          'A': 'Active',
          'I': 'Inactive',
          'D': 'Delete',
          'R': 'Rejected',
          'N': 'Not Interested',
          'E': 'Excellent'
        };
        return statusMap[params.value] || params.value;
      }
    },
    { 
      headerName: "DOB", 
      field: "dob", 
      width: windowWidth < 640 ? 80 : 110,
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
      width: windowWidth < 640 ? 100 : 120,
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
      hide: windowWidth < 1024,
      cellRenderer: (params: { value: string }) => {
        return params.value === 'Y' ? 'Yes' : params.value === 'N' ? 'No' : params.value;
      }
    },
    { 
      headerName: "Notes", 
      field: "notes", 
      width: windowWidth < 640 ? 150 : 200,
      hide: windowWidth < 1024
    },
  ], [windowWidth, currentPage, pageSize]); ;
  return (
    <div className="relative">
      {alertMessage && (
        <div className="fixed top-4 right-4 p-3 sm:p-4 bg-red-500 text-white rounded-md shadow-md z-50 text-xs sm:text-sm">
          {alertMessage}
        </div>
      )}
      
      <div className="p-2 sm:p-4 mt-16 sm:mt-20 mb-6 sm:mb-10 mx-2 sm:mx-4 md:mx-8 lg:mx-12 xl:mx-16 bg-gray-100 rounded-lg shadow-md relative">
        <div className="flex flex-col md:flex-row justify-between items-center mb-3 sm:mb-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            Vendor Recruiter Management
          </h1>
          <div className="flex items-center space-x-1 mt-2 md:mt-0">
            <button
              onClick={handleAddRow}
              className={`flex items-center justify-center ${buttonPadding} bg-green-600 text-white rounded-md hover:bg-green-700 text-xs sm:text-sm`}
              title="Add Recruiter"
            >
              <MdAdd className={iconSize} />
            </button>
            <button
              onClick={handleEditRow}
              className={`flex items-center justify-center ${buttonPadding} bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs sm:text-sm`}
              title="Edit Recruiter"
            >
              <AiOutlineEdit className={iconSize} />
            </button>
            <button
              onClick={handleDeleteRow}
              className={`flex items-center justify-center ${buttonPadding} bg-red-600 text-white rounded-md hover:bg-red-700 text-xs sm:text-sm`}
              title="Delete Recruiter"
            >
              <MdDelete className={iconSize} />
            </button>
            <button
              onClick={handleViewRow}
              className={`flex items-center justify-center ${buttonPadding} bg-gray-400 text-white rounded-md hover:bg-gray-700 text-xs sm:text-sm`}
              title="View Recruiter"
            >
              <AiOutlineEye className={iconSize} />
            </button>
            <button
              onClick={() => fetchRecruiters(currentPage, searchValue)}
              className={`flex items-center justify-center ${buttonPadding} bg-gray-500 text-white rounded-md hover:bg-gray-900 text-xs sm:text-sm`}
              title="Refresh"
            >
              <AiOutlineReload className={iconSize} />
            </button>
            <button
              onClick={handleDownloadPDF}
              className={`flex items-center justify-center ${buttonPadding} bg-purple-600 text-white rounded-md hover:bg-purple-700 text-xs sm:text-sm`}
              title="Download PDF"
            >
              <FaFilePdf className={iconSize} />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row mb-3 sm:mb-4 justify-between items-center">
          <div className="flex w-full sm:w-auto mb-2 sm:mb-0">
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={handleSearchChange}
              className="border border-gray-300 rounded-md p-1.5 sm:p-2 w-full sm:w-64 text-xs sm:text-sm"
            />
            <button
              onClick={() => fetchRecruiters(1, searchValue)}
              className={`flex items-center ${buttonPadding} bg-blue-600 text-white rounded-md ml-1 sm:ml-2 hover:bg-blue-900 text-xs sm:text-sm`}
            >
              <AiOutlineSearch className={`mr-1 ${iconSize}`} /> 
              <span className="hidden xs:inline">Search</span>
            </button>
          </div>
        </div>

        <div
          className="ag-theme-alpine"
          style={{ 
            height: windowWidth < 640 ? "300px" : windowWidth < 1024 ? "400px" : "500px", 
            width: "100%", 
            overflowY: "auto",
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
            onSortChanged={handleSortChanged}
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
      </div>

      {modalState.add && (
        <AddRowModal
          isOpen={modalState.add}
          onClose={() => setModalState((prev) => ({ ...prev, add: false }))}
          onSubmit={() => {
            fetchRecruiters(currentPage, searchValue);
            setModalState((prev) => ({ ...prev, add: false }));
          }}
        />
      )}
      {modalState.edit && selectedRecruiter && (
        <EditRowRecruiter
          isOpen={modalState.edit}
          onClose={() => setModalState((prev) => ({ ...prev, edit: false }))}
          initialData={selectedRecruiter}
          onSubmit={() => {
            fetchRecruiters(currentPage, searchValue);
            setModalState((prev) => ({ ...prev, edit: false }));
          }}
          vendors={vendorsList}
        />
      )}
      {modalState.view && selectedRecruiter && (
        <ViewRowRecruiterComponent
          isOpen={modalState.view}
          onClose={() => setModalState((prev) => ({ ...prev, view: false }))}
          recruiter={selectedRecruiter}
        />
      )}
    </div>
  );
};

export default RecruiterByVendor;
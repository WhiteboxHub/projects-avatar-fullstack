"use client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import AddRowModal from "@/modals/recruiter_byDetailed_modals/AddRowRecruiter";
import EditRowRecruiter from "@/modals/recruiter_byDetailed_modals/EditRowRecruiter";
import Modal from "react-modal";
import React, { useCallback, useEffect, useRef, useState } from "react";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { jsPDF } from "jspdf";
import { debounce } from "lodash";
import { AiOutlineClose } from "react-icons/ai";
import { FaDownload } from "react-icons/fa";
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
import { SortChangedEvent } from "ag-grid-community";

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
  const gridRef = useRef<AgGridReact>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(1000);
  const [sortField, setSortField] = useState("status");
  const [sortOrder, setSortOrder] = useState("asc");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
        setSelectedRecruiter(selectedRows[0]);
        setModalState((prevState) => ({ ...prevState, edit: true }));
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
          try {
            await Promise.all(selectedRows.map(row =>
              axios.delete(`${API_URL}/api/admin/by/recruiters/byVendorDetailed/remove/${row.id}`, {
                headers: { AuthToken: localStorage.getItem("token") }
              })
            ));
            fetchRecruiters(currentPage, searchValue);
          } catch (error) {
            console.error("Error deleting recruiters:", error);
            setAlertMessage("Error deleting recruiters.");
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

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
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
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pageNumbers.push(<span key={i}>...</span>);
      }
    }
    return pageNumbers;
  };

  const handleSortChanged = (event: SortChangedEvent<RecruiterDetails>) => {
    const columnState = event.api.getColumnState();
    if (columnState.length > 0) {
      const sortModel = columnState.find((column) => column.sort);
      if (sortModel) {
        setSortField(sortModel.colId);
        setSortOrder(sortModel.sort || "asc");
      }
    }
  };

  return (
    <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md relative">
      {alertMessage && (
        <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded-md shadow-md z-50">
          {alertMessage}
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Vendor Recruiter Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleAddRow}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700"
            title="Add Recruiter"
          >
            <MdAdd className="mr-2" />
          </button>
          <button
            onClick={handleEditRow}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700"
            title="Edit Recruiter"
          >
            <AiOutlineEdit className="mr-2" />
          </button>
          <button
            onClick={handleDeleteRow}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700"
            title="Delete Recruiter"
          >
            <MdDelete className="mr-2" />
          </button>
          <button
            onClick={handleViewRow}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md transition duration-300 hover:bg-gray-700"
            title="View Recruiter Details"
          >
            <AiOutlineEye className="mr-2" />
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700"
            title="Download PDF"
          >
            <FaDownload className="mr-2" />
          </button>
        </div>
      </div>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded-md p-2 w-64"
        />
        <button
          onClick={() => fetchRecruiters(1, searchValue)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md ml-2 transition duration-300 hover:bg-blue-900"
        >
          <AiOutlineSearch className="mr-2" /> Search
        </button>
      </div>
      <div
        className="ag-theme-alpine"
        style={{ height: "500px", width: "100%", overflowY: "auto" }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={[
            {
              headerName: "#",
              width: 60,
              valueGetter: (params) => {
                if (params.node && params.node.rowIndex !== null) {
                  return params.node.rowIndex + 1;
                }
                return null;
              },
              pinned: 'left',
              cellStyle: {
                borderRight: '2px solid #ccc'
              }
            },
            { headerName: "ID", field: "id", width: 70 },
            { headerName: "Name", field: "name", width: 150, pinned: 'left' },
            { headerName: "Email", field: "email", width: 180 },
            { headerName: "Phone", field: "phone", width: 120 },
            { headerName: "Designation", field: "designation", width: 150 },
            { headerName: "Vendor ID", field: "vendorid", width: 100 },
            { headerName: "Company", field: "comp", width: 150 },
            {
              headerName: "Status",
              field: "status",
              width: 100,
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
            { headerName: "DOB", field: "dob", width: 110 },
            { headerName: "Personal Email", field: "personalemail", width: 180 },
            { headerName: "Skype ID", field: "skypeid", width: 120 },
            { headerName: "LinkedIn", field: "linkedin", width: 120 },
            { headerName: "Twitter", field: "twitter", width: 120 },
            { headerName: "Facebook", field: "facebook", width: 120 },
            {
              headerName: "Review",
              field: "review",
              width: 100,
              cellRenderer: (params: any) => {
                return params.value === 'Y' ? 'Yes' : params.value === 'N' ? 'No' : params.value;
              }
            },
            { headerName: "Notes", field: "notes", width: 200 },
          ]}
          pagination={false}
          domLayout="normal"
          rowSelection="multiple"
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            cellStyle: { color: "#333", fontSize: "0.75rem", padding: "1px" },
          }}
          onSortChanged={handleSortChanged}
          rowHeight={30}
          headerHeight={35}
        />
      </div>
      <div className="flex justify-between mt-4">
        <div className="flex items-center flex-wrap gap-2 overflow-auto">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="text-sm px-2 py-1 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            <FaAngleDoubleLeft />
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-sm px-2 py-1 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            <FaChevronLeft />
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="text-sm px-2 py-1 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            <FaChevronRight />
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="text-sm px-2 py-1 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            <FaAngleDoubleRight />
          </button>
          <span className="ml-4 text-sm text-gray-600">
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

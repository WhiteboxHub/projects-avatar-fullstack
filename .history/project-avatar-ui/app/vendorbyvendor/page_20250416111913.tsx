"use client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import AddRowModal from "@/modals/vendor_byVendor_modals/AddRowVendor";
import EditRowModal from "@/modals/vendor_byVendor_modals";
import ViewRowModal from "@/modals/recruiter_byVendor_modals/ViewRowRecruiter";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { jsPDF } from "jspdf";
import { AiOutlineEdit, AiOutlineEye, AiOutlineSearch } from "react-icons/ai";
import { MdAdd, MdDelete } from "react-icons/md";
import { Vendor } from "@/types/vendor";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaDownload,
} from "react-icons/fa";
jsPDF.prototype.autoTable = autoTable;

interface VendorCompany {
  vendorid: number;
  companyname: string;
  recruiters: RecruiterData[];
  isGroup: boolean;
  isCollapsed: boolean;
  recruiter_count: number;
}

interface RecruiterData {
  id: number;
  name: string;
  email: string;
  phone: string;
  designation: string;
  status: string;
  dob?: string;
  personalemail: string;
  skypeid: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  review: string;
  notes: string;
  vendorid: number;
  companyname: string;
  employeeid?: number;
  lastmoddatetime?: string;
  clientid: string;
}

interface RowData extends RecruiterData {
  isGroupRow?: boolean;
  level?: number;
  expanded?: boolean;
}

interface AlertMessage {
  text: string;
  type: "success" | "error";
}

interface ModalState {
  add: boolean;
  view: boolean;
  edit: boolean;
  selectedRow: RecruiterData | null;
}

const RecruiterByVendor = () => {
  const gridRef = useRef<any>();
  const [modalState, setModalState] = useState<ModalState>({
    add: false,
    view: false,
    edit: false,
    selectedRow: null,
  });
  const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [vendors, setVendors] = useState<VendorCompany[]>([]);
  const [expandedVendors, setExpandedVendors] = useState<{
    [key: number]: boolean;
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [vendorList, setVendorList] = useState<Vendor[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState<number | null>(null);
  const pageSize = 10;

  const showAlert = (text: string, type: "success" | "error") => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 3000);
  };

  // Debounce search value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/recruiters/by-vendor`,
        {
          params: {
            page: currentPage,
            pageSize: pageSize,
            type: "vendor",
            search: debouncedSearchValue || undefined,
          },
        }
      );
      setVendors(response.data.data);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error("Error fetching data:", error);
      showAlert("Error loading data", "error");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchValue]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleGroup = (vendorId: number) => {
    setSelectedVendorId(vendorId); // Store the selected vendor ID
    setExpandedVendors((prev) => ({
      ...prev,
      [vendorId]: !prev[vendorId],
    }));
  };

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/recruiters/byVendor/vendors`
        );
        setVendorList(response.data || []);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };
    fetchVendors();
  }, []);

  const rowData = useMemo(() => {
    const rows: RowData[] = [];
    vendors.forEach((vendor) => {
      rows.push({
        id: vendor.vendorid,
        name: vendor.companyname,
        email: "",
        phone: "",
        designation: "",
        status: "",
        dob: undefined,
        personalemail: "",
        skypeid: "",
        linkedin: "",
        clientid: "",
        twitter: "",
        facebook: "",
        review: "",
        notes: "",
        vendorid: vendor.vendorid,
        companyname: vendor.companyname,
        isGroupRow: true,
        level: 0,
        expanded: expandedVendors[vendor.vendorid],
      });

      if (expandedVendors[vendor.vendorid]) {
        vendor.recruiters.forEach((recruiter) => {
          rows.push({
            ...recruiter,
            name: `${recruiter.id} ${recruiter.name} - ${vendor.companyname}`,
            isGroupRow: false,
            level: 1,
          });
        });
        rows.push({
          id: -1,
          name: "",
          email: "",
          phone: "",
          designation: "",
          status: "",
          dob: undefined,
          personalemail: "",
          skypeid: "",
          linkedin: "",
          twitter: "",
          facebook: "",
          review: "",
          notes: "",
          vendorid: -1,
          companyname: "",
          clientid: "",
          isGroupRow: false,
          level: 1,
        });
      }
    });
    return rows;
  }, [vendors, expandedVendors]);

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Name",
        field: "name" as keyof RowData,
        cellRenderer: (params: any) => {
          if (params.data.isGroupRow) {
            const expanded = expandedVendors[params.data.vendorid];
            return (
              <div className="flex items-center">
                <span
                  className="cursor-pointer pl-1 flex items-center hover:bg-gray-100 rounded-md py-1 px-2 transition-colors duration-200"
                  onClick={() => toggleGroup(params.data.vendorid)}
                >
                  <span className="mr-2 text-gray-600 flex items-center justify-center w-4 h-4 bg-white border border-gray-300 rounded">
                    {expanded ? (
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="font-medium">{params.value}</span>
                </span>
              </div>
            );
          }
          return <span className="pl-3">{params.value}</span>;
        },
        minWidth: 200,
        flex: 1,
      },
      {
        headerName: "Email",
        field: "email" as keyof RowData,
        hide: false,
        minWidth: 150,
      },
      {
        headerName: "Phone",
        field: "phone" as keyof RowData,
        hide: false,
        minWidth: 120,
      },
      {
        headerName: "Designation",
        field: "designation" as keyof RowData,
        hide: false,
        minWidth: 150,
      },
      {
        headerName: "Status",
        field: "status" as keyof RowData,
        hide: false,
        minWidth: 100,
        cellRenderer: (params: any) => {
          const statusMap: { [key: string]: string } = {
            A: "Active",
            I: "Inactive",
            D: "Delete",
            R: "Rejected",
            N: "Not Interested",
            E: "Excellent",
          };
          return statusMap[params.value] || params.value;
        },
      },
      {
        headerName: "DOB",
        field: "dob" as keyof RowData,
        hide: false,
        minWidth: 100,
      },
      {
        headerName: "Personal Email",
        field: "personalemail" as keyof RowData,
        hide: false,
        minWidth: 150,
      },
      {
        headerName: "Skype ID",
        field: "skypeid" as keyof RowData,
        hide: false,
        minWidth: 120,
      },
      {
        headerName: "LinkedIn",
        field: "linkedin" as keyof RowData,
        hide: false,
        minWidth: 120,
      },
      {
        headerName: "Twitter",
        field: "twitter" as keyof RowData,
        hide: false,
        minWidth: 120,
      },
      {
        headerName: "Facebook",
        field: "facebook" as keyof RowData,
        hide: false,
        minWidth: 120,
      },
      {
        headerName: "Review",
        field: "review" as keyof RowData,
        hide: false,
        minWidth: 100,
      },
      {
        headerName: "Notes",
        field: "notes" as keyof RowData,
        hide: false,
        minWidth: 200,
      },
      {
        headerName: "Employee ID",
        field: "employeeid" as keyof RowData,
        hide: false,
        minWidth: 120,
      },
      {
        headerName: "Last Modified",
        field: "lastmoddatetime" as keyof RowData,
        hide: false,
        minWidth: 150,
      },
    ],
    [expandedVendors]
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleAdd = async (formData: RecruiterData) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/recruiters/byVendor/add`,
        formData
      );
      showAlert("Recruiter added successfully", "success");
      setModalState({ ...modalState, add: false });
      fetchData();
    } catch (error) {
      // Suppress error tooltip
      console.error("Error adding recruiter:", error);
    }
  };

  const handleEdit = async (formData: RecruiterData) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/recruiters/byVendor/update/${formData.id}`,
        formData
      );
      showAlert("Recruiter updated successfully", "success");
      setModalState({ ...modalState, edit: false });
      fetchData();
    } catch (error) {
      showAlert("Error updating recruiter", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this recruiter?")) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/recruiters/byVendor/remove/${id}`
        );
        showAlert("Recruiter deleted successfully", "success");
        fetchData();
      } catch (error) {
        showAlert("Error deleting recruiter", "error");
      }
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const tableData = rowData
      .filter((row) => !row.isGroupRow && row.id !== -1)
      .map((row) => [
        row.companyname,
        row.name,
        row.email,
        row.phone,
        row.designation,
        row.status,
        row.dob || "",
        row.personalemail || "",
        row.skypeid || "",
        row.linkedin || "",
        row.twitter || "",
        row.facebook || "",
        row.review || "",
        row.notes || "",
      ]);

    autoTable(doc, {
      head: [
        [
          "Company",
          "Name",
          "Email",
          "Phone",
          "Designation",
          "Status",
          "DOB",
          "Personal Email",
          "Skype ID",
          "LinkedIn",
          "Twitter",
          "Facebook",
          "Review",
          "Notes",
        ],
      ],
      body: tableData,
      styles: { fontSize: 8 },
      margin: { top: 20 },
    });

    doc.save("recruiters-by-vendor.pdf");
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

  return (
    <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md relative">
      {alertMessage && (
        <div
          className={`fixed top-4 right-4 p-4 ${
            alertMessage.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white rounded-md shadow-md z-50`}
        >
          {alertMessage.text}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Recruiter Management (Vendors)
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setModalState({ ...modalState, add: true })}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700"
          >
            <MdAdd className="mr-2" />
          </button>
          <button
            onClick={() => {
              const selectedRows = gridRef.current?.api.getSelectedRows();
              if (selectedRows?.length > 0 && !selectedRows[0].isGroupRow) {
                setModalState({
                  ...modalState,
                  edit: true,
                  selectedRow: selectedRows[0],
                });
              } else {
                showAlert("Please select a recruiter to edit", "error");
              }
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700"
          >
            <AiOutlineEdit className="mr-2" />
          </button>
          <button
            onClick={() => {
              const selectedRows = gridRef.current?.api.getSelectedRows();
              if (selectedRows?.length > 0 && !selectedRows[0].isGroupRow) {
                handleDelete(selectedRows[0].id);
              } else {
                showAlert("Please select a recruiter to delete", "error");
              }
            }}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700"
          >
            <MdDelete className="mr-2" />
          </button>
          <button
            onClick={() => {
              const selectedRows = gridRef.current?.api.getSelectedRows();
              if (selectedRows?.length > 0 && !selectedRows[0].isGroupRow) {
                setModalState({
                  ...modalState,
                  view: true,
                  selectedRow: selectedRows[0],
                });
              } else {
                showAlert("Please select a recruiter to view", "error");
              }
            }}
            className="flex items-center px-4 py-2 bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-700"
          >
            <AiOutlineEye className="mr-2" />
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700"
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
          onChange={(e) => setSearchValue(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-64"
        />
        <button
          onClick={fetchData}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md ml-2 transition duration-300 hover:bg-blue-900"
        >
          <AiOutlineSearch className="mr-2" /> Search
        </button>
      </div>
      
      <div
        className="ag-theme-alpine relative"
        style={{ height: "400px", width: "100%", overflowY: "auto" }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 z-10">
            <span className="ml-3 text-gray-700 font-medium">Loading...</span>
          </div>
        )}
        
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{
            sortable: true,
            filter: true,
            cellStyle: { color: "#333", fontSize: "0.75rem", padding: "1px" },
            minWidth: 60,
          }}
          suppressRowClickSelection={false}
          rowSelection="single"
          rowHeight={30}
          headerHeight={35}
          overlayLoadingTemplate={
            '<span class="ag-overlay-loading-center">Loading...</span>'
          }
          overlayNoRowsTemplate={
            '<span class="ag-overlay-no-rows-center">No rows to show</span>'
          }
          onGridReady={(params) => {
            params.api.sizeColumnsToFit();
          }}
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

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
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
        </div>
        <span className="ml-4 text-sm text-gray-600">
          Total Records: {vendors.reduce((acc, vendor) => acc + vendor.recruiter_count, 0)}
        </span>
      </div>

      <AddRowModal
        isOpen={modalState.add}
        onClose={() => setModalState({ ...modalState, add: false })}
        onSubmit={handleAdd}
      />

      <ViewRowModal
        isOpen={modalState.view}
        onClose={() => setModalState({ ...modalState, view: false })}
        recruiter={modalState.selectedRow}
      />

      <EditRowModal
        isOpen={modalState.edit}
        onClose={() => setModalState({ ...modalState, edit: false })}
        initialData={modalState.selectedRow as RecruiterData | null}
        onSubmit={handleEdit}
        vendors={vendorList}
        defaultVendorId={
          selectedVendorId || modalState.selectedRow?.vendorid || 0
        }
      />
    </div>
  );
};

export default RecruiterByVendor;
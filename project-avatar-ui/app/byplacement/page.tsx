"use client";
"use client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import AddRowModal from "@/modals/recruiter_byPlacement_modals/AddRowRecruiter";
import EditRowRecruiter from "@/modals/recruiter_byPlacement_modals/EditRowRecruiter";
import ViewRowRecruiter from "@/modals/recruiter_byPlacement_modals/ViewRowRecruiter";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { jsPDF } from "jspdf";
import { AiOutlineEdit, AiOutlineEye, AiOutlineSearch } from "react-icons/ai";
import { MdAdd, MdDelete } from "react-icons/md";
import { Recruiter } from "@/types/byPlacement";
import { Client } from "@/types/client";
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
  FaSync,
} from "react-icons/fa";

interface Company {
  clientid: number;
  companyname: string;
  recruiters: RecruiterData[];
  isGroup: boolean;
  isCollapsed: boolean;
}

interface RecruiterData {
  id: number;
  name: string;
  email: string;
  phone: string;
  designation: string;
  status: string;
  dob: string | null;
  personalemail: string;
  skypeid: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  review: string;
  notes: string;
  clientid: number;
  companyname: string;
  employeeid?: number;
  lastmoddatetime?: string;
  vendorid: string;
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

const RecruiterByPlacement = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [modalState, setModalState] = useState<ModalState>({ 
    add: false, 
    view: false, 
    edit: false, 
    selectedRow: null 
  });
  const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [expandedCompanies, setExpandedCompanies] = useState<{
    [key: number]: boolean;
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const pageSize = 100;

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
        `${process.env.NEXT_PUBLIC_API_URL}/by/recruiters/by-client-placement`,
        {
          params: {
            page: currentPage,
            pageSize: pageSize,
            search: debouncedSearchValue || undefined,
          },
        }
      );
      setCompanies(response.data.data);
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

  const toggleGroup = (clientId: number) => {
    setSelectedCompanyId(clientId);
    setExpandedCompanies((prev) => ({
      ...prev,
      [clientId]: !prev[clientId],
    }));
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/recruiters/byClient/clients`);
        setClients(response.data || []);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, []);

  const rowData = useMemo(() => {
    const rows: RowData[] = [];
    companies.forEach((company) => {
      rows.push({
        id: company.clientid,
        name: company.companyname,
        email: "",
        vendorid: "",
        phone: "",
        designation: "",
        status: "",
        dob: null,
        personalemail: "",
        skypeid: "",
        linkedin: "",
        twitter: "",
        facebook: "",
        review: "",
        notes: "",
        clientid: company.clientid,
        companyname: company.companyname,
        isGroupRow: true,
        level: 0,
        expanded: expandedCompanies[company.clientid],
      });

      if (expandedCompanies[company.clientid]) {
        company.recruiters.forEach((recruiter) => {
          rows.push({
            ...recruiter,
            name: `${recruiter.id} ${recruiter.name} - ${company.companyname}`,
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
          dob: null,
          vendorid: "",
          personalemail: "",
          skypeid: "",
          linkedin: "",
          twitter: "",
          facebook: "",
          review: "",
          notes: "",
          clientid: -1,
          companyname: "",
          isGroupRow: false,
          level: 1,
        });
      }
    });
    return rows;
  }, [companies, expandedCompanies]);

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Name",
        field: "name" as keyof RowData,
        cellRenderer: (params: { data: RowData; value: string }) => {
          if (params.data.isGroupRow) {
            const expanded = expandedCompanies[params.data.clientid];
            return (
              <div className="flex items-center">
                <span
                  className="cursor-pointer pl-1 flex items-center hover:bg-gray-100 rounded-md py-1 px-2 transition-colors duration-200"
                  onClick={() => toggleGroup(params.data.clientid)}
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
        cellRenderer: (params: { value: string }) => {
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
    [expandedCompanies]
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleAdd = async (formData: RecruiterData) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/by/recruiters/by-client-placement/add`,
        formData
      );
      showAlert("Recruiter added successfully", "success");
      setModalState({...modalState, add: false});
      fetchData();
    } catch (error) {
      console.error("Error adding recruiter:", error);
    }
  };

  const handleEdit = async (formData: RecruiterData) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/by/recruiters/by-client-placement/update/${formData.id}`,
        formData
      );
      showAlert("Recruiter updated successfully", "success");
      setModalState({...modalState, edit: false});
      fetchData();
    } catch (error) {
      showAlert("Error updating recruiter", "error");
      console.error("Error updating recruiter:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this recruiter?")) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/by/recruiters/by-client-placement/remove/${id}`
        );
        showAlert("Recruiter deleted successfully", "success");
        fetchData();
      } catch (error) {
        showAlert("Error deleting recruiter", "error");
        console.error("Error deleting recruiter:", error);
      }
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const tableData = rowData
      .filter((row) => !row.isGroupRow && row.id !== -1)
      .map((row) => [
        row.companyname,
        row.name.split(' - ')[0],
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

    doc.save("recruiters-by-placement.pdf");
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
          Placement Recruiters
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setModalState({...modalState, add: true})}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700"
          >
            <MdAdd className="mr-2" />
          </button>
          <button
            onClick={() => {
              const selectedRows = gridRef.current?.api.getSelectedRows();
              if (selectedRows && selectedRows.length > 0 && !selectedRows[0].isGroupRow && selectedRows[0].id !== -1) {
                setModalState({
                  ...modalState,
                  edit: true,
                  selectedRow: selectedRows[0]
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
              if (selectedRows && selectedRows.length > 0 && !selectedRows[0].isGroupRow && selectedRows[0].id !== -1) {
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
            onClick={fetchData}
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md transition duration-300 hover:bg-gray-600"
          >
            <FaSync className="mr-2" /> 
          </button>
          <button
            onClick={() => {
              const selectedRows = gridRef.current?.api.getSelectedRows();
              if (selectedRows && selectedRows.length > 0 && !selectedRows[0].isGroupRow && selectedRows[0].id !== -1) {
                setModalState({
                  ...modalState,
                  view: true,
                  selectedRow: selectedRows[0]
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
        className="ag-theme-alpine"
        style={{ height: "400px", width: "100%", overflowY: "auto" }}
      >
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
          overlayNoRowsTemplate={
            isLoading 
              ? '<span class="ag-overlay-loading-center">Loading...</span>'
              : '<span class="ag-overlay-loading-center">No data found</span>'
          }
          onGridReady={(params) => {
            params.api.sizeColumnsToFit();
          }}
        />
      </div>

      <div className="flex justify-between mt-4">
        <div className="flex items-center flex-wrap gap-2 overflow-auto">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="text-sm px-2 py-1 rounded-md bg-gray-200 text-gray-800 disabled:opacity-50"
          >
            <FaAngleDoubleLeft />
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-sm px-2 py-1 rounded-md bg-gray-200 text-gray-800 disabled:opacity-50"
          >
            <FaChevronLeft />
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="text-sm px-2 py-1 rounded-md bg-gray-200 text-gray-800 disabled:opacity-50"
          >
            <FaChevronRight />
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="text-sm px-2 py-1 rounded-md bg-gray-200 text-gray-800 disabled:opacity-50"
          >
            <FaAngleDoubleRight />
          </button>
          <span className="ml-2 text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </div>

      <AddRowModal
        isOpen={modalState.add}
        onClose={() => setModalState({...modalState, add: false})}
        onSubmit={handleAdd}
        clientOptions={clients.map(c => ({ id: c.id, name: c.name }))}
      />

      <EditRowRecruiter
        isOpen={modalState.edit}
        onClose={() => setModalState({ ...modalState, edit: false })}
        initialData={modalState.selectedRow as Recruiter | null}
        onSubmit={handleEdit}
        clients={clients}
        defaultClientId={selectedCompanyId || modalState.selectedRow?.clientid || 0}
      />

      <ViewRowRecruiter
        isOpen={modalState.view}
        onClose={() => setModalState({ ...modalState, view: false })}
        recruiter={modalState.selectedRow as Recruiter | null}
      />
    </div>
  );
};

export default RecruiterByPlacement;
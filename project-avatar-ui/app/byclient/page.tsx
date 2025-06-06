"use client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import AddRowModal from "@/modals/recruiter_byClient_modals/AddRowRecruiter";
import EditRowModal from "@/modals/recruiter_byClient_modals/EditRowRecruiter";
import ViewRowModal from "@/modals/recruiter_byClient_modals/ViewRowRecruiter";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { jsPDF } from "jspdf";
import { AiOutlineEdit, AiOutlineEye, AiOutlineSearch } from "react-icons/ai";
import { MdAdd, MdDelete } from "react-icons/md";
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

const RecruiterByClient = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [modalState, setModalState] = useState<ModalState>({
    add: false,
    view: false,
    edit: false,
    selectedRow: null,
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
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null
  );
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const pageSize = 10;

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
        `${process.env.NEXT_PUBLIC_API_URL}/recruiters/by-client`,
        {
          params: {
            page: currentPage,
            pageSize: pageSize,
            type: "client",
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
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/recruiters/byClient/clients`
        );
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
        phone: "",
        designation: "",
        status: "",
        dob: undefined,
        personalemail: "",
        skypeid: "",
        linkedin: "",
        vendorid: "",
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
          dob: undefined,
          personalemail: "",
          skypeid: "",
          linkedin: "",
          twitter: "",
          facebook: "",
          review: "",
          notes: "",
          clientid: -1,
          companyname: "",
          vendorid: "",
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
        minWidth: windowWidth < 640 ? 150 : 200,
        flex: 1,
      },
      {
        headerName: "Email",
        field: "email" as keyof RowData,
        hide: windowWidth < 1024,
        minWidth: 150,
      },
      {
        headerName: "Phone",
        field: "phone" as keyof RowData,
        hide: windowWidth < 768,
        minWidth: 120,
      },
      {
        headerName: "Designation",
        field: "designation" as keyof RowData,
        hide: windowWidth < 1024,
        minWidth: 150,
      },
      {
        headerName: "Status",
        field: "status" as keyof RowData,
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
        hide: true,
        minWidth: 100,
      },
      {
        headerName: "Personal Email",
        field: "personalemail" as keyof RowData,
        hide: true,
        minWidth: 150,
      },
      {
        headerName: "Skype ID",
        field: "skypeid" as keyof RowData,
        hide: true,
        minWidth: 120,
      },
      {
        headerName: "LinkedIn",
        field: "linkedin" as keyof RowData,
        hide: true,
        minWidth: 120,
      },
      {
        headerName: "Twitter",
        field: "twitter" as keyof RowData,
        hide: true,
        minWidth: 120,
      },
      {
        headerName: "Facebook",
        field: "facebook" as keyof RowData,
        hide: true,
        minWidth: 120,
      },
      {
        headerName: "Review",
        field: "review" as keyof RowData,
        hide: true,
        minWidth: 100,
      },
      {
        headerName: "Notes",
        field: "notes" as keyof RowData,
        hide: windowWidth < 1024,
        minWidth: 200,
      },
      {
        headerName: "Employee ID",
        field: "employeeid" as keyof RowData,
        hide: true,
        minWidth: 120,
      },
      {
        headerName: "Last Modified",
        field: "lastmoddatetime" as keyof RowData,
        hide: true,
        minWidth: 150,
      },
    ],
    [expandedCompanies, windowWidth]
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleAdd = async (formData: RecruiterData) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/recruiters/byClient/add`,
        formData
      );
      showAlert("Recruiter added successfully", "success");
      setModalState({ ...modalState, add: false });
      fetchData();
    } catch (error) {
      console.error("Error adding recruiter:", error);
    }
  };

  const handleEdit = async (formData: RecruiterData) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/recruiters/byClient/update/${formData.id}`,
        formData
      );
      showAlert("Recruiter updated successfully", "success");
      setModalState({ ...modalState, edit: false });
      fetchData();
    } catch (error) {
      console.error("Error updating recruiter:", error);
      showAlert("Error updating recruiter", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this recruiter?")) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/recruiters/byClient/remove/${id}`
        );
        showAlert("Recruiter deleted successfully", "success");
        fetchData();
      } catch (error) {
        console.error("Error deleting recruiter:", error);
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
        row.name.split(' - ')[0],
        row.email,
        row.phone,
        row.designation,
        row.status === 'A' ? 'Active' : 
          row.status === 'I' ? 'Inactive' : 
          row.status === 'D' ? 'Delete' : 
          row.status === 'R' ? 'Rejected' : 
          row.status === 'N' ? 'Not Interested' : 
          row.status === 'E' ? 'Excellent' : row.status,
        row.dob || "",
        row.personalemail || "",
        row.skypeid || "",
        row.linkedin || "",
        row.twitter || "",
        row.facebook || "",
        row.review || "",
        row.notes || "",
      ]);

    const options = {
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
    };

    autoTable(doc, options);
    doc.save("recruiters-by-client.pdf");
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = windowWidth < 640 ? 3 : 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);
    
    if (currentPage - halfVisible < 1) {
      endPage = Math.min(totalPages, maxVisiblePages);
    }
    
    if (currentPage + halfVisible > totalPages) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-2 py-1 rounded-md text-xs sm:text-sm ${
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

  return (
    <div className="relative">
      {alertMessage && (
        <div
          className={`fixed top-4 right-4 p-3 sm:p-4 ${
            alertMessage.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white text-xs sm:text-sm rounded-md shadow-md z-50`}
        >
          {alertMessage.text}
        </div>
      )}

      <div className="p-2 sm:p-4 mt-16 sm:mt-20 mb-6 sm:mb-10 mx-2 sm:mx-4 md:mx-8 lg:mx-12 xl:mx-16 bg-gray-100 rounded-lg shadow-md relative">
        <div className="flex flex-col md:flex-row justify-between items-center mb-3 sm:mb-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            Recruiter Management
          </h1>
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
              onClick={fetchData}
              className={`flex items-center ${buttonPadding} bg-blue-600 text-white rounded-md ml-1 sm:ml-2 transition duration-300 hover:bg-blue-900 text-xs sm:text-sm`}
            >
              <AiOutlineSearch className={`mr-1 ${iconSize}`} /> 
              <span className="hidden xs:inline">Search</span>
            </button>
          </div>
        
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setModalState({ ...modalState, add: true })}
              className={`flex items-center justify-center ${buttonPadding} bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700 text-xs sm:text-sm`}
              title="Add Recruiter"
            >
              <MdAdd className={iconSize} />
            </button>
            <button
              onClick={() => {
                const selectedRows = gridRef.current?.api.getSelectedRows();
                if (selectedRows && selectedRows.length > 0 && !selectedRows[0].isGroupRow) {
                  setModalState({
                    ...modalState,
                    edit: true,
                    selectedRow: selectedRows[0],
                  });
                } else {
                  showAlert("Please select a recruiter to edit", "error");
                }
              }}
              className={`flex items-center justify-center ${buttonPadding} bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700 text-xs sm:text-sm`}
              title="Edit Recruiter"
            >
              <AiOutlineEdit className={iconSize} />
            </button>
            <button
              onClick={() => {
                const selectedRows = gridRef.current?.api.getSelectedRows();
                if (selectedRows && selectedRows.length > 0 && !selectedRows[0].isGroupRow) {
                  handleDelete(selectedRows[0].id);
                } else {
                  showAlert("Please select a recruiter to delete", "error");
                }
              }}
              className={`flex items-center justify-center ${buttonPadding} bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700 text-xs sm:text-sm`}
              title="Delete Recruiter"
            >
              <MdDelete className={iconSize} />
            </button>
            <button
              onClick={fetchData}
              className={`flex items-center justify-center ${buttonPadding} bg-gray-500 text-white rounded-md transition duration-300 hover:bg-gray-900 text-xs sm:text-sm`}
              title="Refresh"
            >
              <FaSync className={iconSize} />
            </button>
            <button
              onClick={() => {
                const selectedRows = gridRef.current?.api.getSelectedRows();
                if (selectedRows && selectedRows.length > 0 && !selectedRows[0].isGroupRow) {
                  setModalState({
                    ...modalState,
                    view: true,
                    selectedRow: selectedRows[0],
                  });
                } else {
                  showAlert("Please select a recruiter to view", "error");
                }
              }}
              className={`flex items-center justify-center ${buttonPadding} bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-700 text-xs sm:text-sm`}
              title="View Recruiter"
            >
              <AiOutlineEye className={iconSize} />
            </button>
            <button
              onClick={handleDownloadPDF}
              className={`flex items-center justify-center ${buttonPadding} bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700 text-xs sm:text-sm`}
              title="Download PDF"
            >
              <FaDownload className={iconSize} />
            </button>
          </div>
        </div>

        <div
          className="ag-theme-alpine relative"
          style={{ 
            height: windowWidth < 640 ? "300px" : windowWidth < 1024 ? "350px" : "400px", 
            width: "100%", 
            overflowY: "auto",
            fontSize: windowWidth < 640 ? '10px' : windowWidth < 1024 ? '12px' : '14px'
          }}
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
              resizable: true,
              cellStyle: { 
                color: "#333", 
                fontSize: windowWidth < 640 ? "0.65rem" : windowWidth < 1024 ? "0.7rem" : "0.75rem", 
                padding: windowWidth < 640 ? "0px" : "1px" 
              },
              minWidth: windowWidth < 640 ? 60 : windowWidth < 1024 ? 70 : 80,
              maxWidth: windowWidth < 640 ? 120 : windowWidth < 1024 ? 150 : 200,
            }}
            suppressRowClickSelection={false}
            rowSelection="single"
            rowHeight={windowWidth < 640 ? 25 : windowWidth < 1024 ? 28 : 30}
            headerHeight={windowWidth < 640 ? 30 : windowWidth < 1024 ? 32 : 35}
            onGridReady={(params) => {
              params.api.sizeColumnsToFit();
            }}
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
              {renderPageNumbers()}
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
            Total Records: {companies.reduce((acc, company) => acc + company.recruiter_count, 0)}
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
          clients={clients}
          defaultClientId={
            selectedCompanyId || modalState.selectedRow?.clientid || 0
          }
        />
      </div>
    </div>
  );
};

export default RecruiterByClient;
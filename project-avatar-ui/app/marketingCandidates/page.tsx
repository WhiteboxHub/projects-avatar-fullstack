"use client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "jspdf-autotable";
import "react-dropdown/style.css";
import * as XLSX from "xlsx";
import Dropdown, { Option } from "react-dropdown";
import EditRowModal from "@/modals/Marketing/MarketingCandidate/EditCandidateMarketing";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ViewRowModal from "@/modals/Marketing/MarketingCandidate/ViewCandidateMarketing";
import axios from "axios";
import jsPDF from "jspdf";
import withAuth from "@/modals/withAuth";
import { AgGridReact } from "ag-grid-react";
import { UserOptions } from "jspdf-autotable";
import { debounce } from "lodash";
import { AiOutlineEdit, AiOutlineEye, AiOutlineReload, AiOutlineSearch } from "react-icons/ai";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaChevronLeft, FaChevronRight, FaFileExcel, FaFilePdf } from "react-icons/fa";
import { CandidateMarketing } from "@/types/index";

interface RowData {
  id: number;
  candidateid: number;
  startdate: string;
  mmid: number;
  instructorid: number;
  status: string;
  submitterid: number;
  priority: string;
  technology: string;
  minrate: number;
  currentlocation: string;
  relocation: string;
  locationpreference: string;
  skypeid: string;
  ipemail: string;
  resumeid: number;
  coverletter: string;
  intro: string;
  closedate: string;
  closedemail: string;
  notes: string;
  suspensionreason: string;
  yearsofexperience: string;
  candidate_name?: string;
  email?: string;
  phone?: string;
  manager?: string;
  instructor?: string;
  submitter?: string;
  secondaryemail?: string;
  secondaryphone?: string;
  workstatus?: string;
  resumelink?: string;
  ipphone?: string;
}

interface AutoTableDoc extends jsPDF {
  autoTable: (d: jsPDF, options: UserOptions) => void;
}

interface Employee {
  id: number;
  name: string;
}

interface IPEmail {
  id: number;
  email: string;
}

interface Resume {
  id: string;
  name: string;
  link?: string;
}

// Function to normalize status values
const normalizeStatus = (status: string): string => {
  if (status.includes('-')) {
    const statusPart = status.split('-')[1].trim();
    if (statusPart.toLowerCase() === 'inprogress') return 'Inprogress';
    if (statusPart.toLowerCase() === 'todo') return 'To Do';
    if (statusPart.toLowerCase() === 'closed') return 'Closed';
    if (statusPart.toLowerCase() === 'suspended') return 'Suspended';
    return statusPart;
  }
  return status;
};

const MarketingCandidates = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [columnDefs, setColumnDefs] = useState<{ headerName: string; field: string }[]>([]);
  const [paginationPageSize] = useState<number>(100);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [modalState, setModalState] = useState<{ add: boolean; edit: boolean; view: boolean }>({ add: false, edit: false, view: false });
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [ipEmails, setIpEmails] = useState<IPEmail[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const gridRef = useRef<AgGridReact>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Track window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/candidatemarketing/employees`, {
        headers: { AuthToken: localStorage.getItem("token") },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  }, [API_URL]);

  const fetchIpEmails = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/candidatemarketing/ipemails`, {
        headers: { AuthToken: localStorage.getItem("token") },
      });
      setIpEmails(response.data);
    } catch (error) {
      console.error("Error fetching IP emails:", error);
    }
  }, [API_URL]);

  const fetchResumes = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/candidatemarketing/resumes`, {
        headers: { AuthToken: localStorage.getItem("token") },
      });
      setResumes(response.data);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  }, [API_URL]);

  const fetchData = useCallback(async (searchQuery: string = "", page: number = 1) => {
    try {
      const response = await axios.get(`${API_URL}/candidatemarketing`, {
        params: {
          page: page,
          page_size: paginationPageSize,
          search: searchQuery,
          status_filter: "active" // Exclude suspended/closed
        },
        headers: { AuthToken: localStorage.getItem("token") },
      });

      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // Add status normalization
        const normalizedData = response.data.data.map((item: RowData) => ({
          ...item,
          status: normalizeStatus(item.status)
        }));
        setRowData(normalizedData);
        setTotalRows(response.data.total);
        setTotalPages(Math.ceil(response.data.total / paginationPageSize));
        setupColumns(normalizedData);
      } else {
        console.error("Invalid data format:", response.data);
        setRowData([]);
        setTotalRows(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }, [API_URL, paginationPageSize]);

  const searchCandidatesByName = useCallback(async (searchQuery: string) => {
    try {
      const response = await axios.get(`${API_URL}/candidatemarketing/search/name?name=${searchQuery}`, {
        headers: { AuthToken: localStorage.getItem("token") },
      });

      let data = response.data;
      if (!Array.isArray(data)) {
        if (data && typeof data === 'object') {
          data = [data]; // Convert single object to an array with one element
        } else {
          data = [];
        }
      }

      // Add status normalization
      const normalizedData = data.map((item: RowData) => ({
        ...item,
        status: normalizeStatus(item.status)
      }));
      setRowData(normalizedData);
      setTotalRows(normalizedData.length);
      setTotalPages(Math.ceil(normalizedData.length / paginationPageSize));
      setupColumns(normalizedData);
    } catch (error) {
      console.error("Error searching candidates:", error);
      setAlertMessage("No candidate found with that name.");
      setTimeout(() => setAlertMessage(null), 3000);
      setRowData([]);
      setTotalRows(0);
      setTotalPages(0);
    }
  }, [API_URL, paginationPageSize]);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      searchCandidatesByName(query);
    }, 300),
    [searchCandidatesByName]
  );

  useEffect(() => {
    fetchData();
    fetchEmployees();
    fetchIpEmails();
    fetchResumes();
  }, [fetchData, fetchEmployees, fetchIpEmails, fetchResumes]);

  useEffect(() => {
    if (searchValue) {
      debouncedSearch(searchValue);
    } else {
      fetchData("", currentPage);
    }
  }, [searchValue, currentPage, fetchData, debouncedSearch]);

  const setupColumns = (data: RowData[]) => {
    if (Array.isArray(data) && data.length > 0) {
      const keys = Object.keys(data[0]);
      
      // Adjust column widths based on screen size
      const getColumnWidth = (field: string) => {
        if (windowWidth < 640) { // Mobile
          return 70;
        } else if (windowWidth < 1024) { // Tablet
          return 100;
        } else { // Desktop
          return 120;
        }
      };
      
      const columns = keys.map((key) => ({
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
        field: key,
        width: getColumnWidth(key),
      }));
      
      setColumnDefs(columns);
    }
  };

  // Re-setup columns when window width changes
  useEffect(() => {
    if (rowData.length > 0) {
      setupColumns(rowData);
    }
  }, [windowWidth, rowData]);

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

  const handleViewRow = () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        setSelectedRow(selectedRows[0] as RowData);
        setModalState((prevState) => ({ ...prevState, view: true }));
      } else {
        setAlertMessage("Please select a row to view.");
        setTimeout(() => setAlertMessage(null), 3000);
      }
    }
  };

  const handleRefresh = () => {
    setSearchValue("");
    fetchData();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchData("", newPage);
  };

  const handleDownloadPDF = () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        const doc = new jsPDF({ orientation: "landscape" }) as unknown as AutoTableDoc;
        doc.text("Selected Candidate Marketing Data", 15, 10);

        const pdfData = selectedRows.map((row: RowData) => [
          row.candidateid,
          row.candidate_name || "",
          row.email || "",
          row.phone || "",
          row.startdate,
          row.manager || "",
          row.instructor || "",
          row.submitter || "",
          row.status,
          row.priority,
          row.technology,
          row.minrate,
          row.currentlocation,
          row.relocation,
          row.locationpreference,
          row.skypeid,
          row.ipemail,
          row.resumelink || "",
          row.intro,
          row.notes,
          row.suspensionreason ?? "",
          row.yearsofexperience ?? 0,
        ]).map(row => row.filter(value => value !== undefined));

        doc.autoTable(doc, {
          head: [
            [
              "Candidate ID",
              "Name",
              "Email",
              "Phone",
              "Start Date",
              "Manager",
              "Instructor",
              "Submitter",
              "Status",
              "Priority",
              "Technology",
              "Min Rate",
              "Current Location",
              "Relocation",
              "Location Preference",
              "Skype ID",
              "IP Email",
              "Resume Link",
              "Intro",
              "Notes",
              "Suspension Reason",
              "Years of Experience",
            ],
          ],
          body: pdfData,
          styles: { fontSize: 8, cellPadding: 4 },
          margin: { top: 15, left: 15, right: 15 }
        });

        doc.save("Selected_Candidate_Marketing_Data.pdf");
      } else {
        alert("Please select a row to download.");
      }
    }
  };

  const handleSearch = () => {
    if (searchValue) {
      searchCandidatesByName(searchValue);
    }
  };

  const handleExportToExcel = () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        const ws = XLSX.utils.json_to_sheet(selectedRows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Selected Candidate Marketing Data");
        XLSX.writeFile(wb, "Selected_Candidate_Marketing_Data.xlsx");
      } else {
        alert("Please select a row to export.");
      }
    }
  };

  // Function to get page numbers to display
  const getPageNumbers = () => {
    const maxPagesToShow = windowWidth < 640 ? 3 : 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
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

  return (
    <div className="relative">
      <div className="p-2 sm:p-4 mt-16 sm:mt-20 mb-6 sm:mb-10 mx-2 sm:mx-4 md:mx-10 lg:mx-20 bg-gray-100 rounded-lg shadow-md relative">
        {alertMessage && (
          <div className="fixed top-4 right-4 p-3 sm:p-4 bg-red-500 text-white text-xs sm:text-sm rounded-md shadow-md z-50">
            {alertMessage}
          </div>
        )}
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Marketing Candidates</h1>
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
              onClick={handleSearch}
              className={`flex items-center ${buttonPadding} bg-blue-600 text-white rounded-md ml-1 sm:ml-2 transition duration-300 hover:bg-blue-900 text-xs sm:text-sm`}
            >
              <AiOutlineSearch className={`mr-1 ${iconSize}`} /> 
              <span className="hidden xs:inline">Search</span>
            </button>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-end space-x-1 sm:space-x-2 mt-2 sm:mt-0">
            <button
              onClick={handleEditRow}
              className={`flex items-center justify-center ${buttonPadding} bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700 text-xs sm:text-sm`}
              title="Edit"
            >
              <AiOutlineEdit className={iconSize} />
            </button>
            <button
              onClick={handleViewRow}
              className={`flex items-center justify-center ${buttonPadding} bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-700 text-xs sm:text-sm`}
              title="View"
            >
              <AiOutlineEye className={iconSize} />
            </button>
            <button
              onClick={handleRefresh}
              className={`flex items-center justify-center ${buttonPadding} bg-gray-500 text-white rounded-md transition duration-300 hover:bg-gray-900 text-xs sm:text-sm`}
              title="Refresh"
            >
              <AiOutlineReload className={iconSize} />
            </button>
            <button
              onClick={handleDownloadPDF}
              className={`flex items-center justify-center ${buttonPadding} bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700 text-xs sm:text-sm`}
              title="Export to PDF"
            >
              <FaFilePdf className={iconSize} />
            </button>
            <button
              onClick={handleExportToExcel}
              className={`flex items-center justify-center ${buttonPadding} bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700 text-xs sm:text-sm`}
              title="Export to Excel"
            >
              <FaFileExcel className={iconSize} />
            </button>
          </div>
        </div>

        <div
          className="ag-theme-alpine"
          style={{ 
            height: windowWidth < 640 ? "300px" : windowWidth < 1024 ? "350px" : "370px", 
            width: "100%", 
            overflowY: "visible", 
            overflowX: 'visible',
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
              maxWidth: windowWidth < 640 ? 100 : windowWidth < 1024 ? 120 : 150,
            }}
            rowHeight={windowWidth < 640 ? 25 : windowWidth < 1024 ? 28 : 30}
            headerHeight={windowWidth < 640 ? 30 : windowWidth < 1024 ? 32 : 35}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-3 sm:mt-4">
          <div className="flex items-center justify-center w-full sm:w-auto overflow-x-auto mb-2 sm:mb-0">
            <div className="flex space-x-1 overflow-x-auto">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`p-1 sm:p-2 rounded-md ${
                  currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
                title="First Page"
              >
                <FaAngleDoubleLeft className={`${currentPage === 1 ? "text-gray-500" : "text-white"} ${iconSize}`} />
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-1 sm:p-2 rounded-md ${
                  currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
                title="Previous Page"
              >
                <FaChevronLeft className={`${currentPage === 1 ? "text-gray-500" : "text-white"} ${iconSize}`} />
              </button>
              
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-2 py-1 rounded-md text-xs sm:text-sm ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-1 sm:p-2 rounded-md ${
                  currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
                title="Next Page"
              >
                <FaChevronRight className={`${currentPage === totalPages ? "text-gray-500" : "text-white"} ${iconSize}`} />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={`p-1 sm:p-2 rounded-md ${
                  currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
                title="Last Page"
              >
                <FaAngleDoubleRight className={`${currentPage === totalPages ? "text-gray-500" : "text-white"} ${iconSize}`} />
              </button>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            Showing {(currentPage - 1) * paginationPageSize + 1} to {Math.min(currentPage * paginationPageSize, totalRows)} of {totalRows} entries
          </div>
        </div>

        <EditRowModal
          isOpen={modalState.edit}
          onRequestClose={() => setModalState({ ...modalState, edit: false })}
          rowData={
            selectedRow
              ? {
                  ...selectedRow,
                  mmid: selectedRow.mmid || 0,
                  instructorid: selectedRow.instructorid || 0,
                  submitterid: selectedRow.submitterid || 0,
                  ipemailid:
                    ipEmails.find((email) => email.email === selectedRow.ipemail)?.id || 0, // Corrected to use ID
                  resumeid: selectedRow.resumeid || 0, // Keep as number, no String conversion
                  status: selectedRow.status || "",
                  relocation: selectedRow.relocation || "",
                  manager_name:
                    employees.find((emp) => emp.id === selectedRow.mmid)?.name || "",
                  instructor_name:
                    employees.find((emp) => emp.id === selectedRow.instructorid)
                      ?.name || "",
                  submitter_name:
                    employees.find((emp) => emp.id === selectedRow.submitterid)
                      ?.name || "",
                }
              : null
          }
          onSave={fetchData}
          employees={employees}
          ipEmails={ipEmails}
          resumes={resumes}
        />
        <ViewRowModal
          isOpen={modalState.view}
          onRequestClose={() => setModalState({ ...modalState, view: false })}
          rowData={selectedRow ? {
            ...selectedRow,
            ipemail: selectedRow.ipemail || '',
            manager_name: selectedRow.manager || '',
            instructor_name: selectedRow.instructor || '',
            submitter_name: selectedRow.submitter || '',
            ipemailid: ipEmails.find(email => email.email === selectedRow.ipemail)?.id || 0,
            mmid: selectedRow.mmid || 0,
            instructorid: selectedRow.instructorid || 0,
            submitterid: selectedRow.submitterid || 0,
            resume_name: resumes.find(resume => resume.id === String(selectedRow.resumeid))?.name || ''
          } as unknown as CandidateMarketing : null}
        />
      </div>
    </div>
  );
};

export default withAuth(MarketingCandidates);

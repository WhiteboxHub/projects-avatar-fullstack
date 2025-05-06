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
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
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
  const gridRef = useRef<AgGridReact>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
        setRowData(response.data.data);
        setTotalRows(response.data.total);
        setTotalPages(Math.ceil(response.data.total / paginationPageSize));
        setupColumns(response.data.data);
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

      setRowData(data);
      setTotalRows(data.length);
      setTotalPages(Math.ceil(data.length / paginationPageSize));
      setupColumns(data);
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
      const columns = keys.map((key) => ({
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
        field: key,
      }));
      setColumnDefs(columns);
    }
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

  const options = [
    { value: "Export to PDF", label: "Export to PDF" },
    { value: "Export to Excel", label: "Export to Excel" },
  ];

  const defaultOption = "Download";

  // Function to get page numbers to display
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  return (
    <div className="relative">
      <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md relative">
        {alertMessage && (
          <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded-md shadow-md z-50">
            {alertMessage}
          </div>
        )}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Marketing Candidates</h1>
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
            <Dropdown
              options={options as Option[]}
              value={defaultOption}
              onChange={(selectedOption) => {
                if (selectedOption.value === "Export to PDF") {
                  handleDownloadPDF();
                } else if (selectedOption.value === "Export to Excel") {
                  handleExportToExcel();
                }
              }}
              placeholder="Select an option"
              className="bg-purple-600 text-black rounded-lg transition duration-300 hover:bg-purple-700"
              controlClassName="bg-purple-600 text-black rounded-lg transition duration-300 hover:bg-purple-700 border-none px-4 py-2"
              menuClassName="bg-purple-600 text-black rounded-lg transition duration-300"
              arrowClassName="text-black"
              placeholderClassName="text-black"
            />
          </div>
        </div>

        <div
          className="ag-theme-alpine"
          style={{ height: "370px", width: "100%", overflowY: "visible", overflowX: 'visible' }}
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
          />
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <FaAngleDoubleLeft className="text-white" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <FaChevronLeft className="text-white" />
            </button>
            
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <FaChevronRight className="text-white" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <FaAngleDoubleRight className="text-white" />
            </button>
          </div>
          <div className="text-sm text-gray-600">
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
                    selectedRow.ipemail ||
                    ipEmails.find((email) => email.email === selectedRow.ipemail)?.id ||
                    0,
                  resumeid:
                    selectedRow.resumeid !== undefined
                      ? String(selectedRow.resumeid)
                      : "",
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

"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "jspdf-autotable";
import Dropdown, { Option } from "react-dropdown";
import "react-dropdown/style.css";
import * as XLSX from "xlsx";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import EditRowModal from "../../modals/Marketing/MarketingCandidate/EditCandidateMarketing";
// import ViewRowModal from "../../modals/Marketing/CurrentMarketing/ViewCandidateMarketing";
import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import { MdDelete } from "react-icons/md";
import { debounce } from "lodash";
import jsPDF from "jspdf";
import withAuth from "@/modals/withAuth";
import { AiOutlineEdit, AiOutlineSearch, AiOutlineReload, AiOutlineEye } from "react-icons/ai";
import { UserOptions } from 'jspdf-autotable';
// import { CandidateMarketing } from "@/types";

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
}

interface AutoTableDoc extends jsPDF {
  autoTable: (d: jsPDF, options: UserOptions) => void;
}

const MarketingCandidates = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [columnDefs, setColumnDefs] = useState<{ headerName: string; field: string }[]>([]);
  const [paginationPageSize] = useState<number>(200);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [modalState, setModalState] = useState<{ add: boolean; edit: boolean; view: boolean }>({ add: false, edit: false, view: false });
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [employees, setEmployees] = useState<{ id: number; name: string }[]>([]);
  const gridRef = useRef<AgGridReact>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchData = useCallback((searchQuery = "", page = 1) => {
    const fetchDataAsync = async () => {
      try {
        const response = await axios.get(`${API_URL}/candidatemarketing`, {
          params: {
            page: page,
            page_size: paginationPageSize,
            search: searchQuery,
          },
          headers: { AuthToken: localStorage.getItem("token") },
        });

        console.log("Full API Response:", response); // Log the full response

        // Check if the response data is an array
        const apiData = response.data;
        if (Array.isArray(apiData)) {
          console.log("Fetched Data:", apiData);
          setRowData(apiData);
          setTotalRows(apiData.length); // Assuming totalRows is the length of the array
          setupColumns(apiData);
        } else {
          console.error("Data is not an array:", apiData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchDataAsync();
  }, [API_URL, paginationPageSize]);

  const debouncedFetchData = useCallback(
    debounce((query: string) => {
      fetchData(query, currentPage);
    }, 300),
    [fetchData, currentPage]
  );

  useEffect(() => {
    console.log("Fetching data with search value:", searchValue);
    if (searchValue) {
      debouncedFetchData(searchValue);
    }
    return () => {
      debouncedFetchData.cancel();
    };
  }, [searchValue, debouncedFetchData]);

  useEffect(() => {
    console.log("Fetching data for page:", currentPage);
    if (!searchValue) {
      fetchData("", currentPage);
    }
  }, [currentPage, fetchData, searchValue]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${API_URL}/employees`, {
          headers: { AuthToken: localStorage.getItem("token") },
        });
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, [API_URL]);

  const setupColumns = (data: RowData[]) => {
    console.log("Setting up columns with data:", data);
    if (Array.isArray(data) && data.length > 0) {
      const keys = Object.keys(data[0]);
      const columns = keys.map((key) => ({
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
        field: key,
      }));
      setColumnDefs(columns);
    } else {
      console.error("Data is not an array or is empty:", data);
    }
  };

  const handleEditRow = () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        console.log("Selected Row:", selectedRows[0]); // Add this line

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

  const handleDeleteRow = async () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        const id = selectedRows[0].id;
        const confirmation = window.confirm(`Are you sure you want to delete entry ID ${id}?`);
        if (!confirmation) return;

        try {
          await axios.delete(`${API_URL}/candidatemarketing/${id}`, {
            headers: { AuthToken: localStorage.getItem("token") },
          });
          alert("Entry deleted successfully.");
          fetchData(searchValue);
        } catch (error) {
          console.error("Error deleting entry:", error);
          alert(`Failed to delete entry: ${error || "Unknown error occurred"}`);
        }
      } else {
        setAlertMessage("Please select a row to delete.");
        setTimeout(() => setAlertMessage(null), 3000);
      }
    }
  };

  const handleRefresh = () => {
    setSearchValue("");
    fetchData();
    window.location.reload();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDownloadPDF = () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        const doc = new jsPDF({ orientation: "landscape" }) as unknown as AutoTableDoc;
        doc.text("Selected Candidate Marketing Data", 15, 10);

        const pdfData = selectedRows.map((row: RowData) => [
          row.candidateid,
          row.startdate,
          row.mmid,
          row.instructorid,
          row.status,
          row.submitterid,
          row.priority,
          row.technology,
          row.minrate,
          row.currentlocation,
          row.relocation,
          row.locationpreference,
          row.skypeid,
          row.ipemail,
          row.resumeid,
          row.coverletter,
          row.intro,
          row.closedate,
          row.closedemail,
          row.notes,
          row.suspensionreason ?? "",
          row.yearsofexperience ?? 0,
        ]).map(row => row.filter(value => value !== undefined));
        doc.autoTable(doc, {
          head: [
            [
              "Candidate ID",
              "Start Date",
              "MMID",
              "Instructor ID",
              "Status",
              "Submitter ID",
              "Priority",
              "Technology",
              "Min Rate",
              "Current Location",
              "Relocation",
              "Location Preference",
              "Skype ID",
              "IP Email ",
              "Resume ID",
              "Cover Letter",
              "Intro",
              "Close Date",
              "Closed Email",
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
    fetchData(searchValue);
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
    {
      value: "Export to PDF",
      label: "Export to PDF",
    },
    {
      value: "Export to Excel",
      label: "Export to Excel",
    },
  ];

  const defaultOption = "Download";

  const totalPages = Math.ceil(totalRows / paginationPageSize);
  const startPage = Math.max(1, currentPage);
  const endPage = Math.min(totalPages, currentPage + 4);
  const pageOptions = Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage);

  return (
    <div className="relative">
      <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md relative">
        {alertMessage && (
          <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded-md shadow-md z-50">
            {alertMessage}
          </div>
        )}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800"> Marketing Candidates </h1>
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
              onClick={handleDeleteRow}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700"
            >
              <MdDelete className="mr-2" />
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
        <div className="flex flex-col md:flex-row justify-between items-center mt-4">
          <div className="flex items-center justify-center w-full md:w-auto overflow-x-auto">
            <div className="flex space-x-1 overflow-x-auto">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-2 disabled:opacity-50"
              >
                <FaAngleDoubleLeft />
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 disabled:opacity-50"
              >
                <FaChevronLeft />
              </button>
              {pageOptions.map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-2 py-1 rounded-md ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 disabled:opacity-50"
              >
                <FaChevronRight />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 disabled:opacity-50"
              >
                <FaAngleDoubleRight />
              </button>
            </div>
          </div>
        </div>
        <EditRowModal
          isOpen={modalState.edit}
          onRequestClose={() => setModalState({ ...modalState, edit: false })}
          rowData={selectedRow}
          onSave={fetchData}
          employees={employees}
        />
        {/* <ViewRowModal
          isOpen={modalState.view}
          onRequestClose={() => setModalState({ ...modalState, view: false })}
          rowData={selectedRow as RowData}
        /> */}
      </div>
    </div>
  );
};

export default withAuth(MarketingCandidates);


"use client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import AddRowModal from "@/modals/candidate_modals/AddRowCandidate";
import EditRowModal from "@/modals/candidate_modals/EditRowCandidate";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ViewRowModal from "@/modals/candidate_modals/ViewRowCandidate";
import autoTable from "jspdf-autotable";
import axios from "axios";
import withAuth from "@/modals/withAuth";
import { ColDef, RowClassParams, RowStyle } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { AxiosError } from "axios";
import { jsPDF } from "jspdf";
import { AiOutlineEdit, AiOutlineEye, AiOutlineReload, AiOutlineSearch } from "react-icons/ai";
import { FaDownload } from "react-icons/fa";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdAdd } from "react-icons/md";
import { Candidate } from "@/types/index";

interface DropdownOptions {
  courses: string[];
  diceCandidate: string[];
  workStatus: string[];
  ssnValid: string[];
  bgvDone: string[];
  salary: string[];
  batches: string[];
  portalIds: { id: number; name: string }[];
  referralIds: { id: number; name: string }[];
}

interface GroupedData {
  [key: string]: Candidate[];
}

interface ICellRendererParams {
  value: string | number | boolean | null; 
  data: CandidateRow; 
}

// Define a type that extends Candidate to include isGroupRow property
type CandidateRow = Candidate & {
  isGroupRow?: boolean;
  statuschangedate?: string;
  processflag?: string; 
  emergcontactname?: string;  
  emergcontactemail?: string;  
  emergcontactaddrs?: string;  
  originalresume?: string;  
  dlurl?: string;  
  ssnurl?: string;  
  diceflag?: string;
};

const Candidates = () => {
  const [rowData, setRowData] = useState<CandidateRow[]>([]);
  const [groupedData, setGroupedData] = useState<GroupedData>({});
  const [, setDropdownOptions] = useState<DropdownOptions | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<{[key: string]: boolean}>({});
  const [columnDefs] = useState<ColDef<CandidateRow>[]>([
    {
      headerName: "Batch Name",
      field: "batchname",
      width: 90,
      cellStyle: { fontWeight: 'bold' },
      cellRenderer: (params: ICellRendererParams) => {
        if (params.data && params.data.isGroupRow) {
          const expanded = expandedGroups[params.value as string];
          return (
            <div className="flex items-center">
              <span
                className="cursor-pointer pl-1 flex items-center hover:bg-gray-100 rounded-md py-1 px-2 transition-colors duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleGroup(params.value as string);
                }}
              >
                <span className="mr-2 text-gray-600 flex items-center justify-center w-5 h-5 bg-white border border-gray-300 rounded">
                  {expanded ? (
                    <span className="text-gray-600 text-lg font-bold">−</span>
                  ) : (
                    <span className="text-gray-600 text-lg font-bold">+</span>
                  )}
                </span>
                <span className="font-medium">{params.value === 'No Batch' ? 'Unassigned' : params.value}</span>
              </span>
            </div>
          );
        }
        return <span className="pl-8">{params.value}</span>;
      }
    },
    { headerName: "ID", field: "candidateid", width: 25 },
    { headerName: "Name", field: "name", width: 200, cellStyle: { fontWeight: 'bold' } },
    { headerName: "Email", field: "email", width: 150, cellRenderer: 'emailRenderer' },
    { headerName: "Phone", field: "phone", width: 90 },
    { headerName: "Course", field: "course", width: 40 },
    { headerName: "Enrolled Date", field: "enrolleddate", width: 70, cellRenderer: 'dateRenderer' },
    {
      headerName: "Status",
      field: "status",
      width: 70,
      cellRenderer: (params: ICellRendererParams) => {
        return params.value || 'Active';
      }
    },
    { headerName: "Status Change Date", field: "statuschangedate", width: 70, cellRenderer: 'dateRenderer' },
    { headerName: "Process", field: "processflag", width: 50 },
    { headerName: "Dice Candidate", field: "diceflag", width: 50 },
    { headerName: "US Status", field: "workstatus", width: 70 },
    { headerName: "Education", field: "education", width: 90 },
    { headerName: "Work Experience", field: "workexperience", width: 90 },
    { headerName: "SSN", field: "ssn", width: 90 },
    { headerName: "Birth Date", field: "dob", width: 70, cellRenderer: 'dateRenderer' },
    { headerName: "Portal ID", field: "portalid", width: 200 },
    { headerName: "Work Auth Exp Date", field: "wpexpirationdate", width: 115, cellRenderer: 'dateRenderer' },
    { headerName: "SSN Valid", field: "ssnvalidated", width: 60 },
    { headerName: "BGV Done", field: "bgv", width: 60 },
    { headerName: "Sec Email", field: "secondaryemail", width: 150, cellRenderer: 'emailRenderer' },
    { headerName: "Secondary Phone", field: "secondaryphone", width: 90 },
    { headerName: "Address", field: "address", width: 150 },
    { headerName: "City", field: "city", width: 90 },
    { headerName: "State", field: "state", width: 90 },
    { headerName: "Country", field: "country", width: 90 },
    { headerName: "Zip", field: "zip", width: 90 },
    { headerName: "Guarantor Name", field: "guarantorname", width: 150 },
    { headerName: "Guarantor Desig", field: "guarantordesignation", width: 150 },
    { headerName: "Guarantor Company", field: "guarantorcompany", width: 150 },
    { headerName: "Emeg: Contact Name", field: "emergcontactname", width: 150 },
    { headerName: "Emeg: Contact Email", field: "emergcontactemail", width: 150 },
    { headerName: "Emeg: Contact Phone", field: "emergcontactphone", width: 150 },
    { headerName: "Emeg: Contact Address", field: "emergcontactaddrs", width: 150 },
    { headerName: "Term", field: "term", width: 90 },
    { headerName: "Fee Paid", field: "feepaid", width: 90, cellRenderer: 'currencyRenderer' },
    { headerName: "Fee Due", field: "feedue", width: 90, cellRenderer: 'currencyRenderer' },
    { headerName: "Referral ID", field: "referralid", width: 200 },
    { headerName: "Salary0-6", field: "salary0", width: 70 },
    { headerName: "Salary6-12", field: "salary6", width: 70 },
    { headerName: "Salary12+", field: "salary12", width: 70 },
    { headerName: "Resume Url", field: "originalresume", width: 200, cellRenderer: 'linkRenderer' },
    { headerName: "Contract Url", field: "contracturl", width: 200, cellRenderer: 'linkRenderer' },
    { headerName: "Emp Agreement Url", field: "empagreementurl", width: 200, cellRenderer: 'linkRenderer' },
    { headerName: "Offer Letter Url", field: "offerletterurl", width: 200, cellRenderer: 'linkRenderer' },
    { headerName: "DL Url", field: "dlurl", width: 200, cellRenderer: 'linkRenderer' },
    { headerName: "Work Permit Url", field: "workpermiturl", width: 200, cellRenderer: 'linkRenderer' },
    { headerName: "SSN Url", field: "ssnurl", width: 200, cellRenderer: 'linkRenderer' },
    { headerName: "Notes", field: "notes", width: 400, cellRenderer: 'textareaRenderer' }
  ]);
  const [paginationPageSize] = useState<number>(1000);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalState, setModalState] = useState<{
    add: boolean;
    edit: boolean;
    view: boolean;
  }>({ add: false, edit: false, view: false });
  const [selectedRow, setSelectedRow] = useState<Candidate | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const gridRef = useRef<AgGridReact<CandidateRow>>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState<boolean>(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const toggleGroup = (batchName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [batchName]: !prev[batchName]
    }));

    const updatedRows = [...rowData];
    const groupIndex = updatedRows.findIndex(row => row.isGroupRow && row.batchname === batchName);

    if (groupIndex !== -1) {
      const isExpanded = !expandedGroups[batchName];
      const batchData = groupedData[batchName] || [];

      if (isExpanded) {
        updatedRows.splice(groupIndex + 1, 0, ...batchData);
      } else {
        updatedRows.splice(groupIndex + 1, batchData.length);
      }

      setRowData(updatedRows);
    }
  };

  const fetchDropdownOptions = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/candidates/dropdown-options`, {
        headers: { AuthToken: localStorage.getItem("token") },
      });
      setDropdownOptions(response.data);
    } catch (error) {
      console.error("Error fetching dropdown options:", error);
    }
  }, [API_URL]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      if (gridRef.current?.api) {
        gridRef.current.api.showLoadingOverlay();
      }
      const response = await axios.get(`${API_URL}/candidates/search`, {
        params: {
          page: currentPage,
          pageSize: paginationPageSize,
          search: searchValue
        },
        headers: { AuthToken: localStorage.getItem("token") },
      });
      
      // Verify response data contains correct course values
      console.log('Candidates data:', response.data);
      
      const { data, totalRows } = response.data;

      const grouped: GroupedData = {};
      data.forEach((candidate: Candidate) => {
        const batchName = candidate.batchname || 'No Batch';
        if (!grouped[batchName]) {
          grouped[batchName] = [];
        }
        grouped[batchName].push(candidate);
      });

      const sortedBatchNames = Object.keys(grouped).sort((a, b) => {
        if (a === 'No Batch') return 1;
        if (b === 'No Batch') return -1;
        return b.localeCompare(a);
      });

      const initialExpandedState: {[key: string]: boolean} = {};
      sortedBatchNames.forEach(batchName => {
        initialExpandedState[batchName] = true;
      });

      if (!initialDataLoaded) {
        setExpandedGroups(initialExpandedState);
        setInitialDataLoaded(true);
      }

      setGroupedData(grouped);

      const rows: CandidateRow[] = [];
      sortedBatchNames.forEach(batchName => {
        rows.push({
          batchname: batchName,
          isGroupRow: true,
        } as CandidateRow);

        if (expandedGroups[batchName]) {
          rows.push(...grouped[batchName]);
        }
      });

      setRowData(rows);
      setTotalRows(totalRows);
      setTotalPages(Math.ceil(totalRows / paginationPageSize));
    } catch (error) {
      console.error("Error loading data:", error);
      setRowData([]);
      if (gridRef.current?.api) {
        gridRef.current.api.showNoRowsOverlay();
      }
    } finally {
      setLoading(false);
    }
  }, [API_URL, currentPage, paginationPageSize, searchValue, expandedGroups, initialDataLoaded]);

  interface ErrorResponse {
    message: string;
  }

  const debouncedSearch = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchData();
    }, 500);
  }, [fetchData]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData();
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Candidate Data", 10, 10);

    const filteredData = rowData.filter(row => !row.isGroupRow);
    const pdfData = filteredData.map((row) => {
      // Convert row to array of values, ensuring no undefined values
      return Object.values(columnDefs).map(col => {
        const fieldName = col.field;
        return fieldName ? row[fieldName as keyof CandidateRow] || '' : '';
      });
    });

    const headers = columnDefs.map((col) => col.headerName || '');

    autoTable(doc, {
      head: [headers],
      body: pdfData,
      theme: 'grid',
      styles: { fontSize: 5 },
    });

    doc.save("candidate_data.pdf");
  };

  const handleRefresh = () => {
    setSearchValue("");
    setCurrentPage(1);
    setExpandedGroups({});
    setInitialDataLoaded(false);
    fetchData();
    if (gridRef.current?.api) {
      gridRef.current.api.showLoadingOverlay();
      gridRef.current.api.refreshCells({ force: true });
    }
  };

  const handleViewRow = () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0 && !selectedRows[0].isGroupRow) {
        setSelectedRow(selectedRows[0]);
        setModalState((prevState) => ({ ...prevState, view: true }));
      } else {
        alert("Please select a candidate row to view");
      }
    }
  };

  useEffect(() => {
    fetchData();
    fetchDropdownOptions();
  }, [currentPage, fetchData, fetchDropdownOptions]);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.sizeColumnsToFit();
    }
  }, [rowData]);

  const handleAddRow = () =>
    setModalState((prevState) => ({ ...prevState, add: true }));

  const handleEditRow = () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0 && !selectedRows[0].isGroupRow) {
        const currentCandidate = selectedRows[0];
        setSelectedRow(currentCandidate);
        setModalState((prevState) => ({ ...prevState, edit: true }));
      } else {
        alert("Please select a candidate row to edit");
      }
    }
  };

  const handleDeleteRow = async () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0 && !selectedRows[0].isGroupRow) {
        const candidateid = selectedRows[0].candidateid;

        if (candidateid) {
          try {
            await axios.delete(`${API_URL}/candidates/candidates/delete/${candidateid}`, {
              headers: { AuthToken: localStorage.getItem("token") },
            });
            alert(`Candidate ${candidateid} deleted successfully.`);
            fetchData();
          } catch (error) {
            const axiosError = error as AxiosError;
            alert(
              `Failed to delete candidate: ${(axiosError.response?.data as ErrorResponse)?.message || axiosError.message
              }`
            );
          }
        } else {
          alert("No valid candidate ID found for the selected row.");
        }
      } else {
        alert("Please select a candidate row to delete");
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = startPage + maxVisiblePages - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  const getRowStyle = (params: RowClassParams<CandidateRow>): RowStyle | undefined => {
    if (params.data && params.data.isGroupRow) {
      return {
        backgroundColor: '#f0f0f0',
        fontWeight: 'bold',
        borderBottom: '1px solid #ccc'
      };
    }
    return {
      backgroundColor: '#ffffff',
      fontWeight: 'normal'
    };
  };

  return (
    <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Candidate Management</h1>
      </div>

      <div className="flex flex-col md:flex-row mb-4 justify-between items-center">
        <div className="flex w-full md:w-auto mb-2 md:mb-0">
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={handleSearchInputChange}
            className="border border-gray-300 rounded-md p-2 w-64"
          />
          <button
            onClick={handleSearch}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md ml-2 transition duration-300 hover:bg-blue-900 text-xs md:text-base"
          >
            <AiOutlineSearch className="mr-1" /> Search
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-end md:space-x-2 mb-4">
          <div className="flex flex-wrap space-x-2 mb-4 md:mb-0">
            <button
              onClick={handleAddRow}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700 text-xs md:text-base"
            >
              <MdAdd className="mr-2" />
            </button>
            <button
              onClick={handleEditRow}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700 text-xs md:text-base"
            >
              <AiOutlineEdit className="mr-1" />
            </button>
            <button
              onClick={handleViewRow}
              className="flex items-center px-3 py-2 bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-700 text-xs md:text-base"
            >
              <AiOutlineEye className="mr-1" />
            </button>
            <button
              onClick={handleDeleteRow}
              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700 text-xs md:text-base"
            >
              <MdDelete className="mr-1" />
            </button>
          </div>
          <div className="flex flex-wrap space-x-2 mb-4 md:mb-0">
            <button
              onClick={handleRefresh}
              className="flex items-center px-3 py-2 bg-gray-500 text-white rounded-md transition duration-300 hover:bg-gray-900 text-xs md:text-base"
            >
              <AiOutlineReload className="mr-2" />
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700"
            >
              <FaDownload className="mr-2" />
            </button>
          </div>
        </div>
      </div>

      <div
        className="ag-theme-alpine"
        style={{ height: "400px", width: "100%" }}
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
            suppressSizeToFit: true
          }}
          rowHeight={30}
          headerHeight={35}
          getRowStyle={getRowStyle}
          isRowSelectable={(params) => params.data ? !params.data.isGroupRow : false}
          onGridReady={(params) => {
            params.api.sizeColumnsToFit();
            if (loading) {
              params.api.showLoadingOverlay();
            }
          }}
          onGridSizeChanged={(params) => {
            params.api.sizeColumnsToFit();
          }}
          overlayLoadingTemplate={
            '<span class="ag-overlay-loading-center">Loading...</span>'
          }
          overlayNoRowsTemplate={
            '<span class="ag-overlay-no-rows-center">No rows to show</span>'
          }
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

          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${currentPage === page
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
          <span className="ml-4 text-sm text-gray-600">
            Total Records: {totalRows}
          </span>
        </div>
      </div>

      {modalState.add && (
        <AddRowModal
          isOpen={modalState.add}
          onClose={() => setModalState((prev) => ({ ...prev, add: false }))}
          refreshData={fetchData}
        />
      )}
      {modalState.edit && selectedRow && (
        <EditRowModal
          isOpen={modalState.edit}
          onClose={() => setModalState((prev) => ({ ...prev, edit: false }))}
          refreshData={fetchData}
          candidateData={selectedRow}
        />
      )}
      {modalState.view && selectedRow && (
        <ViewRowModal
          isOpen={modalState.view}
          onClose={() => setModalState((prev) => ({ ...prev, view: false }))}
          onRequestClose={() => setModalState((prev) => ({ ...prev, view: false }))}
          rowData={selectedRow}
        />
      )}
    </div>
  );
};

export default withAuth(Candidates);

<<<<<<< HEAD
// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { AxiosError } from 'axios';
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import { FaDownload } from "react-icons/fa";
// import AddRowModal from "../../modals/placement_models/AddRowPlacement";
// import EditRowModal from "../../modals/placement_models/EditRowPlacement";
// import ViewRowModal from "../../modals/placement_models/ViewRowPlacement";
// import { MdDelete } from "react-icons/md";
// import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
// import {
//   AiOutlineEdit,
//   AiOutlineEye,
//   AiOutlineSearch,
//   AiOutlineReload,
// } from "react-icons/ai";
// import { MdAdd } from "react-icons/md";
// import { ErrorResponse, Placement } from "@/types";

// jsPDF.prototype.autoTable = autoTable;
// const Placements = () => {
//   const [rowData, setRowData] = useState<Placement[]>([]);
//   const [columnDefs, setColumnDefs] = useState<
//     { headerName: string; field: string }[]
//   >([]);
//   const [paginationPageSize] = useState<number>(100);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [totalRows, setTotalRows] = useState<number>(0);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [alertMessage, setAlertMessage] = useState<string | null>(null); // Added state for alert message
//   const [modalState, setModalState] = useState<{
//     add: boolean;
//     edit: boolean;
//     view: boolean;
//   }>({ add: false, edit: false, view: false });
//   const [selectedRow, setSelectedRow] = useState<Placement | null>(null);
//   const [searchValue, setSearchValue] = useState<string>("");
//   const gridRef = useRef<AgGridReact>(null);

//   const API_URL = process.env.NEXT_PUBLIC_API_URL;
//   // const fetchData = async () => {
//   //   setLoading(true);
//   //   try {
//   //     const response = await axios.get(`${API_URL}/placement`, {
//   //       params: {
//   //         page: currentPage,
//   //         pageSize: paginationPageSize, // Make sure this is 100
//   //       },
//   //       headers: { AuthToken: localStorage.getItem("token") },
//   //     });
  
//   //     console.log("Full API Response:", response); // Log the entire response object
//   //     console.log("API Response Data:", response.data); // Log the data
  
//   //     // Assuming response.data is the array of placements
//   //     const data = response.data; // Directly use response.data if it's the array
//   //     const totalRows = response.headers['total-rows'] || data.length; // Adjust based on actual API response
  
//   //     // Check if 'data' is valid
//   //     if (!Array.isArray(data)) {
//   //       throw new Error("Data is not an array or is undefined");
//   //     }
  
//   //     // Add serial numbers to each row
//   //     const dataWithSerials = data.map((item: Placement, ) => ({
//   //       ...item,
//   //       // serialNo: (currentPage - 1) * paginationPageSize + index + 1,
//   //     }));
  
//   //     setRowData(dataWithSerials);
//   //     setTotalRows(totalRows);
//   //     setupColumns(dataWithSerials);
//   //   } catch (error) {
//   //     console.error("Error loading data:", error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//         const response = await axios.get(`${API_URL}/placement`, {
//             params: {
//                 page: currentPage, // Current page number
//                 pageSize: paginationPageSize, // Page size (e.g., 100)
//             },
//             headers: { AuthToken: localStorage.getItem("token") },
//         });

//         console.log("Full API Response:", response); // Log the entire response object
//         console.log("API Response Data:", response.data); // Log the data

//         const data = response.data; // Directly use response.data if it's the array
//         const totalRows = response.headers['total-rows'] || data.length; // Adjust based on actual API response

//         // Check if 'data' is valid
//         if (!Array.isArray(data)) {
//             throw new Error("Data is not an array or is undefined");
//         }

//         // Add serial numbers to each row
//         const dataWithSerials = data.map((item: Placement, index: number) => ({
//             ...item,
//             serialNo: (currentPage - 1) * paginationPageSize + index + 1, // Add serial number
//         }));

//         setRowData(dataWithSerials);
//         setTotalRows(totalRows);
//         setupColumns(dataWithSerials);
//     } catch (error) {
//         console.error("Error loading data:", error);
//     } finally {
//         setLoading(false);
//     }
// };
  
//   const fetchPlacements = async (searchQuery = "") => {
//     try {
//       const response = await axios.get(`${API_URL}/placements/search`, {
//         params: {
//           page: currentPage,
//           pageSize: paginationPageSize,
//           search: searchQuery,
//         },
//         headers: { AuthToken: localStorage.getItem("token") },
//       });

//       const { data, totalRows } = response.data;
//       setRowData(data);
//       setTotalRows(totalRows);
//       setupColumns(data);
//     } catch (error) {
//       console.error("Error loading data:", error);
//     }
//   };

//   const handleSearch = () => {
//     fetchPlacements(searchValue);
//   };

//   const setupColumns = (data: Placement[]) => {
//     if (data.length > 0) {
//       const columns = [
//         ...Object.keys(data[0]).map((key) => ({
//           headerName: key.charAt(0).toUpperCase() + key.slice(1),
//           field: key,
//         })),
//       ];
//       setColumnDefs(columns);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [currentPage]);

//   const handleRefresh = () => {
//     setSearchValue("");
//     fetchData();
//     window.location.reload();
//   };

//   const handleAddRow = () =>
//     setModalState((prevState) => ({ ...prevState, add: true }));

//   const handleEditRow = () => {
//     if (gridRef.current) {
//       const selectedRows = gridRef.current.api.getSelectedRows();
//       if (selectedRows.length > 0) {
//         setSelectedRow(selectedRows[0]);
//         setModalState((prevState) => ({ ...prevState, edit: true }));
//       } else {
//         setAlertMessage("Please select a row to edit."); // Set alert message
//         setTimeout(() => setAlertMessage(null), 3000); // Clear alert message after 3 seconds
//       }
//     }
//   };


//   const handleDeleteRow = async () => {
//     if (gridRef.current) {
//       const selectedRows = gridRef.current.api.getSelectedRows();
//       if (selectedRows.length > 0) {
//         const placementId = selectedRows[0].placementid || selectedRows[0].id;
//         if (placementId) {
//           const confirmation = window.confirm(
//             `Are you sure you want to delete placement ID ${placementId}?`
//           );
//           if (!confirmation) return;

//           try {
//             await axios.delete(`${API_URL}/placements/delete/${placementId}`, {
//               headers: { AuthToken: localStorage.getItem("token") },
//             });
//             alert("Placement deleted successfully.");
//             fetchData();
//           } catch (error) {
//             const axiosError = error as AxiosError;
//             alert(
//               `Failed to delete placement: ${
//                 (axiosError.response?.data as ErrorResponse)?.message || axiosError.message
//               }`
//             );
//           }
//         } else {
//           alert("No valid placement ID found for the selected row.");
//         }
//       } else {
//         setAlertMessage("Please select a row to delete."); // Set alert message
//         setTimeout(() => setAlertMessage(null), 3000); // Clear alert message after 3 seconds
//       }
//     }
//   };

//   const handlePageChange = (newPage: number) => setCurrentPage(newPage);

//   const handleViewRow = () => {
//     if (gridRef.current) {
//       const selectedRows = gridRef.current.api.getSelectedRows();
//       if (selectedRows.length > 0) {
//         setSelectedRow(selectedRows[0]); // Set the selected row data
//         setModalState((prevState) => ({ ...prevState, view: true })); // Open the view modal
//       } else {
//         setAlertMessage("Please select a row to view."); // Set alert message
//         setTimeout(() => setAlertMessage(null), 3000); // Clear alert message after 3 seconds
//       }
//     }
//   };


//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Placement Data", 20, 10);
//     const pdfData = rowData.map((row) => Object.values(row));
//     const headers = columnDefs.map((col) => col.headerName);
//     autoTable(doc, {
//       head: [headers],
//       body: pdfData,
//       theme: 'grid',
//       styles: { fontSize: 5 },
//     });
//     doc.save("placement_data.pdf");
//   };

//   const totalPages = Math.ceil(totalRows / paginationPageSize);
//   const startPage = Math.max(1, currentPage );
//   const endPage = Math.min(totalPages, currentPage + 4);
//   const pageOptions = Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage);


//   return (
//     <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md relative">
//     {alertMessage && ( // Conditional rendering of alert message
//       <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded-md shadow-md z-50">
//         {alertMessage}
//       </div>
//     )}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-3xl font-bold text-gray-800">Placement Management</h1></div>


//         <div className="flex flex-col md:flex-row mb-4 justify-between   items-center">
//         <div className="flex w-full md:w-auto mb-2 md:mb-0">
//         <input
//           type="text"
//           placeholder="Search..."
//           value={searchValue}
//           onChange={(e) => setSearchValue(e.target.value)}
//           className="border border-gray-300 rounded-md p-2 w-64"
//         />
//         <button
//           onClick={handleSearch}
//           className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md ml-2 transition duration-300 hover:bg-blue-900"
//         >
//           <AiOutlineSearch className="mr-2" /> Search
//         </button>
//         </div>



//         <div className="flex space-x-2">
//           <button
//             onClick={handleAddRow}
//             className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700"
//           >
//             <MdAdd className="mr-2" /> 
//           </button>
//           <button
//             onClick={handleEditRow}
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700"
//           >
//             <AiOutlineEdit className="mr-2" /> 
//           </button>
//           <button
//             onClick={handleDeleteRow}
//             className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700"
//           >
//             <MdDelete className="mr-2" /> 
//           </button>
//           <button
//             onClick={handleViewRow}
//             className="flex items-center px-4 py-2 bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-700"
//           >
//             <AiOutlineEye className="mr-2" /> 
//           </button>
//           <button
//             onClick={handleRefresh}
//             className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md transition duration-300 hover:bg-gray-900"
//           >
//             <AiOutlineReload className="mr-2" /> 
//           </button>
//           <button
//             onClick={handleDownloadPDF}
//             className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700"
//           >
//             <FaDownload className="mr-2" />  
//           </button>
//         </div>
//         </div>   
      
//       {loading ? (
//         <div className="flex justify-center items-center h-48">
//           <span className="text-xl">Loading...</span>
//         </div>
//       ) : (
//         <div
//           className="ag-theme-alpine"
//           style={{ height: "400px", width: "100%", overflowY: "auto" }}
//         >
//           <AgGridReact
//             ref={gridRef}
//             rowData={rowData}
//             columnDefs={columnDefs}
//             pagination={false}
//             domLayout="normal"
//             rowSelection="multiple"
//             defaultColDef={{
//               sortable: true,
//               filter: true,
//               cellStyle: { color: "#333", fontSize: "0.75rem", padding: "1px" },
//               minWidth: 60,
//               maxWidth: 100,
//             }}
//             rowHeight={30}
//             headerHeight={35}
//           />
//         </div>
//       )}
//       <div className="flex justify-between mt-4">
//         <div className="flex items-center">
//           <button
//             onClick={() => handlePageChange(1)}
//             disabled={currentPage === 1}
//             className="p-2 disabled:opacity-50"
//           >
//             <FaAngleDoubleLeft />
//           </button>
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="p-2 disabled:opacity-50"
//           >
//             <FaChevronLeft />
//           </button>
//           {pageOptions.map((page) => (
//             <button
//               key={page}
//               onClick={() => handlePageChange(page)}
//               className={`px-2 py-1 rounded-md ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
//             >
//               {page}
//             </button>
//           ))}
//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="p-2 disabled:opacity-50"
//           >
//             <FaChevronRight />
//           </button>
//           <button
//             onClick={() => handlePageChange(totalPages)}
//             disabled={currentPage === totalPages}
//             className="p-2 disabled:opacity-50"
//           >
//             <FaAngleDoubleRight />
//           </button>
//         </div>
//       </div>
//       {modalState.add && (
//         <AddRowModal
//           isOpen={modalState.add}
//           onClose={() => setModalState((prev) => ({ ...prev, add: false }))}
//           refreshData={fetchData}
//         />
//       )}
//       {modalState.edit && selectedRow && (
//         <EditRowModal
//           isOpen={modalState.edit}
//           onRequestClose={() => setModalState((prev) => ({ ...prev, edit: false }))}
//           rowData={selectedRow}
//           onSave={fetchData}
//         />
//       )}
//       {modalState.view && selectedRow && (
//         <ViewRowModal
//           isOpen={modalState.view}
//           onClose={() => setModalState((prev) => ({ ...prev, view: false }))}
//           rowData={selectedRow}
//         />
//       )}
//     </div>
//   );
// };

// export default Placements;


"use client";
import React, { useState, useEffect, useRef } from "react";
=======
"use client";
import React, { useState, useRef, useEffect } from "react";
>>>>>>> a9385fe7f370ff17031408577a9aaae61c0dbb18
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
<<<<<<< HEAD
import { FaDownload, FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight, FaTimes } from "react-icons/fa";
import { AiOutlinePlus, AiOutlineEye, AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import { MktSubmission, CandidateOption, EmployeeOption } from "@/types/mkl_submissions";
import AddRowModal from "@/modals/mkl_submissions_models/AddRowModal";
=======
import { FaDownload } from "react-icons/fa";
import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaTimes
} from "react-icons/fa";
import {
  AiOutlinePlus,
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlineSearch
} from "react-icons/ai";
import { MdAdd, MdDelete } from "react-icons/md";
import AddRowModal from "@/modals/mkl_submissions_models/AddRowModal";
import axios from "axios";
import { MktSubmission, CandidateOption, EmployeeOption } from "@/types/mkl_submissions";
>>>>>>> a9385fe7f370ff17031408577a9aaae61c0dbb18

const PlacementPage = () => {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [rowData, setRowData] = useState<MktSubmission[]>([]);
  const [selectedRow, setSelectedRow] = useState<MktSubmission | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageSize] = useState<number>(100);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [candidateOptions, setCandidateOptions] = useState<CandidateOption[]>([]);
  const [employeeOptions, setEmployeeOptions] = useState<EmployeeOption[]>([]);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
<<<<<<< HEAD
=======
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedPlacement, setSelectedPlacement] = useState<MktSubmission | null>(null);
>>>>>>> a9385fe7f370ff17031408577a9aaae61c0dbb18
  const gridRef = useRef<AgGridReact>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchPlacements();
    fetchCandidateOptions();
    fetchEmployeeOptions();
  }, [currentPage]);

  const fetchPlacements = async () => {
    try {
<<<<<<< HEAD
      const response = await axios.get(`${API_URL}/placements`, {
=======
      const response = await axios.get(`${API_URL}/mkt-submissions`, {
>>>>>>> a9385fe7f370ff17031408577a9aaae61c0dbb18
        headers: { AuthToken: localStorage.getItem("token") },
        params: {
          page: currentPage,
          rows: pageSize,
          sidx: "submissiondate",
          sord: "desc"
        },
      });
      
      setRowData(response.data.records);
      setTotalPages(response.data.total);
      setTotalRecords(response.data.total_records);
    } catch (error) {
      console.error("Error fetching placements:", error);
      setAlertMessage("Failed to fetch placement data");
      setTimeout(() => setAlertMessage(null), 3000);
    }
  };

  const fetchCandidateOptions = async () => {
    try {
      const response = await axios.get(`${API_URL}/mkt-submissions/candidates`, {
        headers: { AuthToken: localStorage.getItem("token") },
      });
      setCandidateOptions(response.data);
    } catch (error) {
      console.error("Error fetching candidate options:", error);
    }
  };

  const fetchEmployeeOptions = async () => {
    try {
      const response = await axios.get(`${API_URL}/mkt-submissions/employees`, {
        headers: { AuthToken: localStorage.getItem("token") },
      });
      setEmployeeOptions(response.data);
    } catch (error) {
      console.error("Error fetching employee options:", error);
    }
  };

<<<<<<< HEAD
=======

>>>>>>> a9385fe7f370ff17031408577a9aaae61c0dbb18
  const handleSearch = () => {
    fetchPlacements();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Placement Submissions Data", 20, 10);
    autoTable(doc, {
      head: [["ID", "Submission Date", "Candidate ID", "Name", "Email", "Phone", "Location", "Course", "Feedback"]],
      body: rowData.map((row) => [
        row.id,
        row.submissiondate,
        row.candidateid,
        row.name,
        row.email,
        row.phone,
        row.location,
        row.course,
        row.feedback || "",
      ]),
    });
    doc.save("placement_submissions.pdf");
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRowClick = (row: MktSubmission) => {
    setSelectedRow(row);
<<<<<<< HEAD
=======
    // Not showing details immediately on row click
>>>>>>> a9385fe7f370ff17031408577a9aaae61c0dbb18
  };

  const handleViewDetails = () => {
    if (selectedRow) {
      setShowDetails(true);
    } else {
      setAlertMessage("Please select a placement record first");
      setTimeout(() => setAlertMessage(null), 3000);
    }
  };

  const getCandidateName = (candidateId: number) => {
    const candidate = candidateOptions.find(c => c.id === candidateId);
    return candidate ? candidate.name : "Unknown";
  };

  const getEmployeeName = (employeeId: number) => {
    const employee = employeeOptions.find(e => e.id === employeeId);
    return employee ? employee.name : "Unknown";
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
        pageNumbers.push(
          <span key={i} className="px-1">...</span>
        );
      }
    }
    return pageNumbers;
  };

  return (
    <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md relative">
      {alertMessage && (
        <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded-md shadow-md z-50">
          {alertMessage}
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Placement Submissions</h1>
        <div className="flex space-x-2">
          <AddRowModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            refreshData={fetchPlacements}
          />
          <button
            onClick={() => setIsAddModalOpen(true)}   
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700"
          >
            <AiOutlinePlus className="mr-2" /> Add Placement
          </button>
          <button
            onClick={handleViewDetails}
            className={`flex items-center px-4 py-2 ${
              selectedRow 
                ? "bg-blue-600 text-white hover:bg-blue-700" 
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            } rounded-md transition duration-300`}
            disabled={!selectedRow}
          >
            <AiOutlineEye className="mr-2" /> View Details
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700"
          >
            <FaDownload className="mr-2" /> Export
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
          onClick={handleSearch}
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
            { headerName: "ID", field: "id", width: 70 },
            { headerName: "Submission Date", field: "submissiondate", width: 150 },
            { headerName: "Candidate ID", field: "candidateid", width: 120 },
            { 
              headerName: "Candidate Name", 
              field: "candidate_name", 
              width: 150,
<<<<<<< HEAD
              // valueGetter: (params: any) => {
              //   const candidateId = params.data.candidateid;
              //   return getCandidateName(candidateId);
              // }
=======
              valueGetter: (params: any) => {
                const candidateId = params.data.candidateid;
                return getCandidateName(candidateId);
              }
>>>>>>> a9385fe7f370ff17031408577a9aaae61c0dbb18
            },
            { headerName: "Course", field: "course", width: 100 },
            { headerName: "Client Name", field: "name", width: 150 },
            { headerName: "Email", field: "email", width: 200 },
            { headerName: "Phone", field: "phone", width: 120 },
            { headerName: "Location", field: "location", width: 150 },
            { headerName: "Submitter", field: "submitter", width: 150 },
            { 
              headerName: "Employee Name", 
              field: "employee_name", 
              width: 150,
<<<<<<< HEAD
              // valueGetter: (params: any) => {
              //   const employeeId = params.data.employeeid;
              //   return getEmployeeName(employeeId);
              // }
=======
              valueGetter: (params: any) => {
                const employeeId = params.data.employeeid;
                return getEmployeeName(employeeId);
              }
>>>>>>> a9385fe7f370ff17031408577a9aaae61c0dbb18
            },
            { headerName: "Feedback", field: "feedback", width: 200 },
            { headerName: "Notes", field: "notes", width: 200 }
          ]}
          pagination={false}
          domLayout="normal"
          rowSelection="single"
          defaultColDef={{
            sortable: true,
            filter: true,
            cellStyle: { color: "#333", fontSize: "0.75rem", padding: "1px" },
            minWidth: 60,
            maxWidth: 200,
          }}
          rowHeight={30}
          headerHeight={35}
          onRowClicked={(event) => handleRowClick(event.data)}
          rowClass="cursor-pointer hover:bg-gray-100"
        />
      </div>
      {showDetails && selectedRow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg max-w-2xl w-full relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
              aria-label="Close"
            >
              <FaTimes size={18} />
            </button>
            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">Placement Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800">ID</span>
                  <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.id}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800">Submission Date</span>
                  <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.submissiondate}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800">Candidate</span>
                  <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{getCandidateName(selectedRow.candidateid)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800">Employee</span>
                  <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{getEmployeeName(selectedRow.employeeid)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800">Course</span>
                  <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.course}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800">Client</span>
                  <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800">Email</span>
                  <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.email}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800">Phone</span>
                  <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.phone}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800">Location</span>
                  <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.location}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-800">Notes</span>
                <span className="text-sm bg-gray-50 p-2 rounded border-b border-gray-200">{selectedRow.notes || "No notes available"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-800">Feedback</span>
                <span className="text-sm bg-gray-50 p-2 rounded border-b border-gray-200">{selectedRow.feedback || "No feedback available"}</span>
              </div>
            </div>
            <div className="mt-4 flex justify-end border-t border-gray-200 pt-3">
              <button
                onClick={() => setShowDetails(false)}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between mt-4">
        <div className="flex items-center flex-wrap gap-2 overflow-auto">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="text-sm px-2 py-1 rounded-md"
          >
            <FaAngleDoubleLeft />
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-sm px-2 py-1 rounded-md"
          >
            <FaChevronLeft />
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="text-sm px-2 py-1 rounded-md"
          >
            <FaChevronRight />
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="text-sm px-2 py-1 rounded-md"
          >
            <FaAngleDoubleRight />
          </button>
        </div>
        <div className="text-sm text-gray-600">
          Total Records: {totalRecords}
        </div>
      </div>
    </div>
  );
};

export default PlacementPage;

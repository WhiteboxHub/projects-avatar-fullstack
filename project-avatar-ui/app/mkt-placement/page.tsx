"use client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import AddRowModal from "@/modals/mkl_submissions_models/AddRowModal";
import EditRowModal from "@/modals/mkl_submissions_models/EditRowModal";
import React, { useEffect, useRef, useState } from "react";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { jsPDF } from "jspdf";
import { CandidateOption, EmployeeOption, MktSubmission } from "@/types/mkl_submissions";

// "use client";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import AddRowModal from "@/modals/mkl_submissions_models/AddRowModal";
// import EditRowModal from "@/modals/mkl_submissions_models/EditRowModal";
// import React, { useEffect, useRef, useState} from "react";
// import autoTable from "jspdf-autotable";
// import axios from "axios";
// import { AgGridReact } from "ag-grid-react";
// import { jsPDF } from "jspdf";
// import { 
//     AiOutlineDownload,
//     AiOutlineDelete,
//     AiOutlineEdit,
//     AiOutlineSync,
//     AiOutlineClose,
//     AiOutlinePlus,
//     AiOutlineEye,
//     AiOutlineSearch
// } from "react-icons/ai";
// import { 
//     FaAngleDoubleLeft,
//     FaChevronLeft,
//     FaChevronRight,
//     FaAngleDoubleRight
// } from "react-icons/fa";
// import { CandidateOption, EmployeeOption, MktSubmission } from "@/types/mkl_submissions";

// const PlacementPage = () => {
//     const [alertMessage, setAlertMessage] = useState<string | null>(null);
//     const [searchValue, setSearchValue] = useState<string>("");
//     const [searchInputValue, setSearchInputValue] = useState<string>("");
//     const [rowData, setRowData] = useState<MktSubmission[]>([]);
//     const [selectedRow, setSelectedRow] = useState<MktSubmission | null>(null);
//     const [currentPage, setCurrentPage] = useState<number>(1);
//     const [totalPages, setTotalPages] = useState<number>(0);
//     const [pageSize] = useState<number>(100);
//     const [totalRecords, setTotalRecords] = useState<number>(0);
//     const [candidateOptions, setCandidateOptions] = useState<CandidateOption[]>([]);
//     const [employeeOptions, setEmployeeOptions] = useState<EmployeeOption[]>([]);
//     const [showDetails, setShowDetails] = useState<boolean>(false);
//     const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
//     const [sortField, setSortField] = useState<string>("submissiondate");
//     const [sortOrder, setSortOrder] = useState<string>("desc");
//     const gridRef = useRef<AgGridReact>(null);
//     const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//     const API_URL = process.env.NEXT_PUBLIC_API_URL;

//     useEffect(() => {
//         fetchPlacements();
//         fetchCandidateOptions();
//         fetchEmployeeOptions();
//     }, [currentPage, searchValue, sortField, sortOrder]);

//     // Debounce search input
//     useEffect(() => {
//         if (searchTimeoutRef.current) {
//             clearTimeout(searchTimeoutRef.current);
//         }
        
//         searchTimeoutRef.current = setTimeout(() => {
//             setSearchValue(searchInputValue);
//             setCurrentPage(1);
//         }, 500);
        
//         return () => {
//             if (searchTimeoutRef.current) {
//                 clearTimeout(searchTimeoutRef.current);
//             }
//         };
//     }, [searchInputValue]);

//     const fetchPlacements = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.get(`${API_URL}/placements/mkt-submissions`, {
//                 headers: { AuthToken: localStorage.getItem("token") },
//                 params: {
//                     page: currentPage,
//                     rows: pageSize,
//                     sidx: sortField,
//                     sord: sortOrder,
//                     _search: searchValue ? true : false,
//                     searchField: searchValue ? "name" : "",
//                     searchString: searchValue,
//                     searchOper: searchValue ? "cn" : ""
//                 },
//             });

//             setRowData(response.data.records);
//             setTotalPages(response.data.total);
//             setTotalRecords(response.data.total_records);
//             setLoading(false);
//         } catch (error) {
//             console.error("Error fetching placements:", error);
//             setAlertMessage("Failed to fetch placement data");
//             setTimeout(() => setAlertMessage(null), 3000);
//             setLoading(false);
//         }
//     };

//     const fetchCandidateOptions = async () => {
//         try {
//             const response = await axios.get(`${API_URL}/mkt-submissions/candidates`, {
//                 headers: { AuthToken: localStorage.getItem("token") },
//             });
//             setCandidateOptions(response.data);
//         } catch (error) {
//             console.error("Error fetching candidate options:", error);
//         }
//     };

//     const fetchEmployeeOptions = async () => {
//         try {
//             const response = await axios.get(`${API_URL}/mkt-submissions/employees`, {
//                 headers: { AuthToken: localStorage.getItem("token") },
//             });
//             setEmployeeOptions(response.data);
//         } catch (error) {
//             console.error("Error fetching employee options:", error);
//         }
//     };

//     const handleSearch = () => {
//         setSearchValue(searchInputValue);
//         setCurrentPage(1);
//     };

//     const handleDownloadPDF = () => {
//         const doc = new jsPDF();
//         doc.text("Placement Submissions Data", 20, 10);
//         autoTable(doc, {
//             head: [["ID", "Submission Date", "Candidate ID", "Name", "Email", "Phone", "Location", "Course", "Feedback"]],
//             body: rowData.map((row) => [
//                 row.id,
//                 row.submissiondate,
//                 row.candidateid,
//                 row.name,
//                 row.email,
//                 row.phone,
//                 row.location,
//                 row.course,
//                 row.feedback || "",
//             ]),
//         });
//         doc.save("placement_submissions.pdf");
//     };

//     const handlePageChange = (newPage: number) => {
//         if (newPage > 0 && newPage <= totalPages) {
//             setCurrentPage(newPage);
//         }
//     };

//     const handleRowClick = (row: MktSubmission) => {
//         setSelectedRow(row);
//     };

//     const handleViewDetails = () => {
//         if (selectedRow) {
//             setShowDetails(true);
//         } else {
//             setAlertMessage("Please select a placement record first");
//             setTimeout(() => setAlertMessage(null), 3000);
//         }
//     };

//     const handleEditPlacement = () => {
//         if (selectedRow) {
//             setIsEditModalOpen(true);
//         } else {
//             setAlertMessage("Please select a placement record first");
//             setTimeout(() => setAlertMessage(null), 3000);
//         }
//     };

//     const handleDeletePlacement = async () => {
//         if (!selectedRow) {
//             setAlertMessage("Please select a placement record first");
//             setTimeout(() => setAlertMessage(null), 3000);
//             return;
//         }
        
//         setConfirmDelete(true);
//     };

//     const confirmDeletePlacement = async () => {
//         try {
//             await axios.delete(`${API_URL}/placements/mkt-submissions/${selectedRow?.id}`, {
//                 headers: { AuthToken: localStorage.getItem("token") },
//             });
            
//             setAlertMessage("Placement deleted successfully");
//             setTimeout(() => setAlertMessage(null), 3000);
            
//             // Refresh data and reset selection
//             fetchPlacements();
//             setSelectedRow(null);
//             setConfirmDelete(false);
//         } catch (error) {
//             console.error("Error deleting placement:", error);
//             setAlertMessage("Failed to delete placement");
//             setTimeout(() => setAlertMessage(null), 3000);
//             setConfirmDelete(false);
//         }
//     };

//     const getCandidateName = (candidateId: number) => {
//         const candidate = candidateOptions.find(c => c.id === candidateId);
//         return candidate ? candidate.name : "Unknown";
//     };

//     const getEmployeeName = (employeeId: number) => {
//         const employee = employeeOptions.find(e => e.id === employeeId);
//         return employee ? employee.name : "Unknown";
//     };

//     const getPageNumbers = () => {
//         const pageNumbers = [];
//         const maxPagesToShow = 5;
        
//         let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
//         const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
        
//         if (endPage - startPage + 1 < maxPagesToShow) {
//             startPage = Math.max(1, endPage - maxPagesToShow + 1);
//         }
        
//         for (let i = startPage; i <= endPage; i++) {
//             pageNumbers.push(i);
//         }
        
//         return pageNumbers;
//     };

//     const handleSortChanged = () => {
//         if (gridRef.current && gridRef.current.api) {
//             const columnState = gridRef.current.api.getColumnState();
//             const sortedColumn = columnState.find(column => column.sort);
            
//             if (sortedColumn) {
//                 setSortField(sortedColumn.colId);
//                 setSortOrder(sortedColumn.sort || "asc");
//             } else {
//                 setSortField("submissiondate");
//                 setSortOrder("desc");
//             }
//         }
//     };

//     return (
//         <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md relative">
//             {alertMessage && (
//                 <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded-md shadow-md z-50">
//                     {alertMessage}
//                 </div>
//             )}
//             <div className="flex justify-between items-center mb-4">
//                 <h1 className="text-3xl font-bold text-gray-800">Placement Submissions</h1>
//                 <div className="flex space-x-2">
//                     <AddRowModal
//                         isOpen={isAddModalOpen}
//                         onClose={() => setIsAddModalOpen(false)}
//                         refreshData={fetchPlacements}
//                     />
//                     <EditRowModal
//                         isOpen={isEditModalOpen}
//                         onClose={() => setIsEditModalOpen(false)}
//                         refreshData={fetchPlacements}
//                         submission={selectedRow}
//                     />
//                     <button
//                         onClick={() => setIsAddModalOpen(true)}
//                         className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700"
//                     >
//                         <AiOutlinePlus className="mr-2" />
//                     </button>
//                     <button
//                         onClick={handleEditPlacement}
//                         className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-green-700"
//                     >
//                         <AiOutlineEdit className="mr-2" />
//                     </button>
//                     <button
//                         onClick={handleViewDetails}
//                         className={`flex items-center px-4 py-2 ${
//                             selectedRow
//                                 ? "bg-blue-600 text-white hover:bg-blue-700"
//                                 : "bg-gray-400 text-gray-200 cursor-not-allowed"
//                         } rounded-md transition duration-300`}
//                         disabled={!selectedRow}
//                     >
//                         <AiOutlineEye className="mr-2" /> 
//                     </button>
//                     <button
//                         onClick={handleDeletePlacement}
//                         className={`flex items-center px-4 py-2 ${
//                             selectedRow
//                                 ? "bg-red-600 text-white hover:bg-red-700"
//                                 : "bg-gray-400 text-gray-200 cursor-not-allowed"
//                         } rounded-md transition duration-300`}
//                         disabled={!selectedRow}
//                     >
//                         <AiOutlineDelete className="mr-2" />
//                     </button>
//                     <button
//                         onClick={fetchPlacements}
//                         className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700"
//                     >
//                         <AiOutlineSync className="mr-2" />
//                     </button>
//                     <button
//                         onClick={handleDownloadPDF}
//                         className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700"
//                     >
//                         <AiOutlineDownload className="mr-2" />
//                     </button>
//                 </div>
//             </div>
//             <div className="flex mb-4">
//                 <input
//                     type="text"
//                     placeholder="Search..."
//                     value={searchInputValue}
//                     onChange={(e) => setSearchInputValue(e.target.value)}
//                     className="border border-gray-300 rounded-md p-2 w-64"
//                 />
//                 <button
//                     onClick={handleSearch}
//                     className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md ml-2 transition duration-300 hover:bg-blue-900"
//                 >
//                     <AiOutlineSearch className="mr-2" /> Search
//                 </button>
//             </div>
//             <div
//                 className="ag-theme-alpine"
//                 style={{ height: "500px", width: "100%", overflowY: "auto" }}
//             >
//                 <AgGridReact
//                     ref={gridRef}
//                     rowData={rowData}
//                     columnDefs={[
//                         { headerName: "ID", field: "id", width: 70 },
//                         { headerName: "Submission Date", field: "submissiondate", width: 150 },
//                         { headerName: "Candidate ID", field: "candidateid", width: 120 },
//                         {
//                             headerName: "Candidate Name",
//                             field: "candidate_name",
//                             width: 150,
//                             valueGetter: (params) => getCandidateName(params.data?.candidateid)
//                         },
//                         { headerName: "Course", field: "course", width: 100 },
//                         { headerName: "Client Name", field: "name", width: 150 },
//                         { headerName: "Email", field: "email", width: 200 },
//                         { headerName: "Phone", field: "phone", width: 120 },
//                         { headerName: "Location", field: "location", width: 150 },
//                         { headerName: "Submitter", field: "submitter", width: 150 },
//                         {
//                             headerName: "Employee Name",
//                             field: "employee_name",
//                             width: 150,
//                             valueGetter: (params) => getEmployeeName(params.data?.employeeid)
//                         },
//                         { headerName: "Feedback", field: "feedback", width: 200 },
//                         { headerName: "Notes", field: "notes", width: 200 }
//                     ]}
//                     pagination={false}
//                     domLayout="normal"
//                     rowSelection="single"
//                     defaultColDef={{
//                         sortable: true,
//                         filter: true,
//                         cellStyle: { color: "#333", fontSize: "0.75rem", padding: "1px" },
//                         minWidth: 60,
//                         maxWidth: 200,
//                     }}
//                     rowHeight={30}
//                     headerHeight={35}
//                     onRowClicked={(event) => handleRowClick(event.data)}
//                     rowClass="cursor-pointer hover:bg-gray-100"
//                     onGridReady={(params) => {
//                         params.api.sizeColumnsToFit();
//                         if (loading) {
//                             params.api.showLoadingOverlay();
//                         }
//                     }}
//                     onGridSizeChanged={(params) => {
//                         params.api.sizeColumnsToFit();
//                     }}
//                     onSortChanged={handleSortChanged}
//                     overlayLoadingTemplate={
//                         '<span class="ag-overlay-loading-center">Loading...</span>'
//                     }
//                     overlayNoRowsTemplate={
//                         '<span class="ag-overlay-no-rows-center">No rows to show</span>'
//                     }
//                 />
//             </div>
//             {showDetails && selectedRow && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white p-5 rounded-lg shadow-lg max-w-2xl w-full relative max-h-[80vh] overflow-y-auto">
//                         <button
//                             onClick={() => setShowDetails(false)}
//                             className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
//                             aria-label="Close"
//                         >
//                             <AiOutlineClose size={18} />
//                         </button>
//                         <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">Placement Details</h2>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div className="space-y-2">
//                                 <div className="flex flex-col">
//                                     <span className="text-xs font-bold text-gray-800">ID</span>
//                                     <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.id}</span>
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <span className="text-xs font-bold text-gray-800">Submission Date</span>
//                                     <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.submissiondate}</span>
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <span className="text-xs font-bold text-gray-800">Candidate</span>
//                                     <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{getCandidateName(selectedRow.candidateid)}</span>
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <span className="text-xs font-bold text-gray-800">Employee</span>
//                                     <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{getEmployeeName(selectedRow.employeeid)}</span>
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <span className="text-xs font-bold text-gray-800">Course</span>
//                                     <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.course}</span>
//                                 </div>
//                             </div>
//                             <div className="space-y-2">
//                                 <div className="flex flex-col">
//                                     <span className="text-xs font-bold text-gray-800">Client</span>
//                                     <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.name}</span>
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <span className="text-xs font-bold text-gray-800">Email</span>
//                                     <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.email}</span>
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <span className="text-xs font-bold text-gray-800">Phone</span>
//                                     <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.phone}</span>
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <span className="text-xs font-bold text-gray-800">Location</span>
//                                     <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.location}</span>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="mt-4 space-y-2">
//                             <div className="flex flex-col">
//                                 <span className="text-xs font-bold text-gray-800">Notes</span>
//                                 <span className="text-sm bg-gray-50 p-2 rounded border-b border-gray-200">{selectedRow.notes || "No notes available"}</span>
//                             </div>
//                             <div className="flex flex-col">
//                                 <span className="text-xs font-bold text-gray-800">Feedback</span>
//                                 <span className="text-sm bg-gray-50 p-2 rounded border-b border-gray-200">{selectedRow.feedback || "No feedback available"}</span>
//                             </div>
//                         </div>
//                         <div className="mt-4 flex justify-end border-t border-gray-200 pt-3">
//                             <button
//                                 onClick={() => setShowDetails(false)}
//                                 className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm"
//                             >
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//             {confirmDelete && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white p-5 rounded-lg shadow-lg max-w-md w-full">
//                         <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
//                         <p className="mb-4">Are you sure you want to delete this placement record? This action cannot be undone.</p>
//                         <div className="flex justify-end space-x-2">
//                             <button
//                                 onClick={() => setConfirmDelete(false)}
//                                 className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={confirmDeletePlacement}
//                                 className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
//                             >
//                                 Delete
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//             <div className="flex justify-between mt-4">
//                 <div className="flex items-center space-x-2">
//                     <button
//                         onClick={() => handlePageChange(1)}
//                         disabled={currentPage === 1}
//                         className="p-2 disabled:opacity-50 bg-gray-200 rounded hover:bg-gray-300"
//                     >
//                         <FaAngleDoubleLeft />
//                     </button>
//                     <button
//                         onClick={() => handlePageChange(currentPage - 1)}
//                         disabled={currentPage === 1}
//                         className="p-2 disabled:opacity-50 bg-gray-200 rounded hover:bg-gray-300"
//                     >
//                         <FaChevronLeft />
//                     </button>

//                     {getPageNumbers().map((page) => (
//                         <button
//                             key={page}
//                             onClick={() => handlePageChange(page)}
//                             className={`px-3 py-1 rounded ${currentPage === page
//                                 ? 'bg-blue-600 text-white'
//                                 : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
//                                 }`}
//                         >
//                             {page}
//                         </button>
//                     ))}

//                     <button
//                         onClick={() => handlePageChange(currentPage + 1)}
//                         disabled={currentPage === totalPages}
//                         className="p-2 disabled:opacity-50 bg-gray-200 rounded hover:bg-gray-300"
//                     >
//                         <FaChevronRight />
//                     </button>
//                     <button
//                         onClick={() => handlePageChange(totalPages)}
//                         disabled={currentPage === totalPages}
//                         className="p-2 disabled:opacity-50 bg-gray-200 rounded hover:bg-gray-300"
//                     >
//                         <FaAngleDoubleRight />
//                     </button>
//                     <span className="ml-4 text-sm text-gray-600">
//                         Total Records: {totalRecords}
//                     </span>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PlacementPage;

import { 
    AiOutlineDownload,
    AiOutlineDelete,
    AiOutlineEdit,
    AiOutlineSync,
    AiOutlineClose,
    AiOutlinePlus,
    AiOutlineEye,
    AiOutlineSearch
} from "react-icons/ai";
import { 
    FaAngleDoubleLeft,
    FaChevronLeft,
    FaChevronRight,
    FaAngleDoubleRight
} from "react-icons/fa";

const PlacementPage = () => {
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchInputValue, setSearchInputValue] = useState<string>("");
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
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [sortField, setSortField] = useState<string>("submissiondate");
    const [sortOrder, setSortOrder] = useState<string>("desc");
    const gridRef = useRef<AgGridReact>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // Track window resize for responsive design
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetchPlacements();
        fetchCandidateOptions();
        fetchEmployeeOptions();
    }, [currentPage, searchValue, sortField, sortOrder]);

    // Debounce search input
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        
        searchTimeoutRef.current = setTimeout(() => {
            setSearchValue(searchInputValue);
            setCurrentPage(1);
        }, 500);
        
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchInputValue]);

    const fetchPlacements = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/placements/mkt-submissions`, {
                headers: { AuthToken: localStorage.getItem("token") },
                params: {
                    page: currentPage,
                    rows: pageSize,
                    sidx: sortField,
                    sord: sortOrder,
                    _search: searchValue ? true : false,
                    searchField: searchValue ? "name" : "",
                    searchString: searchValue,
                    searchOper: searchValue ? "cn" : ""
                },
            });

            setRowData(response.data.records);
            setTotalPages(response.data.total);
            setTotalRecords(response.data.total_records);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching placements:", error);
            setAlertMessage("Failed to fetch placement data");
            setTimeout(() => setAlertMessage(null), 3000);
            setLoading(false);
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

    const handleSearch = () => {
        setSearchValue(searchInputValue);
        setCurrentPage(1);
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
    };

    const handleViewDetails = () => {
        if (selectedRow) {
            setShowDetails(true);
        } else {
            setAlertMessage("Please select a placement record first");
            setTimeout(() => setAlertMessage(null), 3000);
        }
    };

    const handleEditPlacement = () => {
        if (selectedRow) {
            setIsEditModalOpen(true);
        } else {
            setAlertMessage("Please select a placement record first");
            setTimeout(() => setAlertMessage(null), 3000);
        }
    };

    const handleDeletePlacement = async () => {
        if (!selectedRow) {
            setAlertMessage("Please select a placement record first");
            setTimeout(() => setAlertMessage(null), 3000);
            return;
        }
        
        setConfirmDelete(true);
    };

    const confirmDeletePlacement = async () => {
        try {
            await axios.delete(`${API_URL}/placements/mkt-submissions/${selectedRow?.id}`, {
                headers: { AuthToken: localStorage.getItem("token") },
            });
            
            setAlertMessage("Placement deleted successfully");
            setTimeout(() => setAlertMessage(null), 3000);
            
            fetchPlacements();
            setSelectedRow(null);
            setConfirmDelete(false);
        } catch (error) {
            console.error("Error deleting placement:", error);
            setAlertMessage("Failed to delete placement");
            setTimeout(() => setAlertMessage(null), 3000);
            setConfirmDelete(false);
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

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = windowWidth < 640 ? 3 : 5;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
        
        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        
        return pageNumbers;
    };

    const handleSortChanged = () => {
        if (gridRef.current && gridRef.current.api) {
            const columnState = gridRef.current.api.getColumnState();
            const sortedColumn = columnState.find(column => column.sort);
            
            if (sortedColumn) {
                setSortField(sortedColumn.colId);
                setSortOrder(sortedColumn.sort || "asc");
            } else {
                setSortField("submissiondate");
                setSortOrder("desc");
            }
        }
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
            {alertMessage && (
                <div className={`fixed top-4 right-4 p-3 sm:p-4 ${alertMessage.includes("successfully") ? "bg-green-500" : "bg-red-500"} text-white text-xs sm:text-sm rounded-md shadow-md z-50`}>
                    {alertMessage}
                </div>
            )}

            <div className="p-2 sm:p-4 mt-16 sm:mt-20 mb-6 sm:mb-10 mx-auto bg-gray-100 rounded-lg shadow-md relative max-w-full sm:max-w-7xl">
                <AddRowModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    refreshData={fetchPlacements}
                />
                <EditRowModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    refreshData={fetchPlacements}
                    submission={selectedRow}
                />

                <div className="flex flex-col md:flex-row justify-between items-center mb-3 sm:mb-4">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Placement Submissions</h1>
                </div>

                <div className="flex flex-col sm:flex-row mb-3 sm:mb-4 justify-between items-center">
                    <div className="flex w-full sm:w-auto mb-2 sm:mb-0">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchInputValue}
                            onChange={(e) => setSearchInputValue(e.target.value)}
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
                
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className={`flex items-center justify-center ${buttonPadding} bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700 text-xs sm:text-sm`}
                            title="Add Submission"
                        >
                            <AiOutlinePlus className={iconSize} />
                        </button>
                        <button
                            onClick={handleEditPlacement}
                            className={`flex items-center justify-center ${buttonPadding} ${
                                selectedRow
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                            } rounded-md transition duration-300 text-xs sm:text-sm`}
                            disabled={!selectedRow}
                            title="Edit Submission"
                        >
                            <AiOutlineEdit className={iconSize} />
                        </button>
                        <button
                            onClick={handleViewDetails}
                            className={`flex items-center justify-center ${buttonPadding} ${
                                selectedRow
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                            } rounded-md transition duration-300 text-xs sm:text-sm`}
                            disabled={!selectedRow}
                            title="View Details"
                        >
                            <AiOutlineEye className={iconSize} />
                        </button>
                        <button
                            onClick={handleDeletePlacement}
                            className={`flex items-center justify-center ${buttonPadding} ${
                                selectedRow
                                    ? "bg-red-600 text-white hover:bg-red-700"
                                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                            } rounded-md transition duration-300 text-xs sm:text-sm`}
                            disabled={!selectedRow}
                            title="Delete Submission"
                        >
                            <AiOutlineDelete className={iconSize} />
                        </button>
                        <button
                            onClick={fetchPlacements}
                            className={`flex items-center justify-center ${buttonPadding} bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700 text-xs sm:text-sm`}
                            title="Refresh"
                        >
                            <AiOutlineSync className={iconSize} />
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            className={`flex items-center justify-center ${buttonPadding} bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700 text-xs sm:text-sm`}
                            title="Download PDF"
                        >
                            <AiOutlineDownload className={iconSize} />
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
                        columnDefs={[
                            { 
                                headerName: "ID", 
                                field: "id", 
                                width: windowWidth < 640 ? 50 : windowWidth < 1024 ? 60 : 70 
                            },
                            { 
                                headerName: "Date", 
                                field: "submissiondate", 
                                width: windowWidth < 640 ? 90 : windowWidth < 1024 ? 120 : 150 
                            },
                            { 
                                headerName: "Candidate", 
                                field: "candidate_name", 
                                width: windowWidth < 640 ? 100 : windowWidth < 1024 ? 120 : 150,
                                valueGetter: (params) => getCandidateName(params.data?.candidateid)
                            },
                            { 
                                headerName: "Course", 
                                field: "course", 
                                width: windowWidth < 640 ? 80 : windowWidth < 1024 ? 90 : 100 
                            },
                            { 
                                headerName: "Client", 
                                field: "name", 
                                width: windowWidth < 640 ? 100 : windowWidth < 1024 ? 120 : 150 
                            },
                            { 
                                headerName: "Email", 
                                field: "email", 
                                width: windowWidth < 640 ? 120 : windowWidth < 1024 ? 150 : 200 
                            },
                            { 
                                headerName: "Phone", 
                                field: "phone", 
                                width: windowWidth < 640 ? 90 : windowWidth < 1024 ? 100 : 120 
                            },
                            { 
                                headerName: "Location", 
                                field: "location", 
                                width: windowWidth < 640 ? 100 : windowWidth < 1024 ? 120 : 150 
                            }
                        ]}
                        pagination={false}
                        domLayout="normal"
                        rowSelection="single"
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
                        onRowClicked={(event) => handleRowClick(event.data)}
                        rowClass="cursor-pointer hover:bg-gray-100"
                        onGridReady={(params) => {
                            params.api.sizeColumnsToFit();
                            if (loading) {
                                params.api.showLoadingOverlay();
                            }
                        }}
                        onGridSizeChanged={(params) => {
                            params.api.sizeColumnsToFit();
                        }}
                        onSortChanged={handleSortChanged}
                        overlayLoadingTemplate={
                            '<span class="ag-overlay-loading-center">Loading...</span>'
                        }
                        overlayNoRowsTemplate={
                            '<span class="ag-overlay-no-rows-center">No rows to show</span>'
                        }
                    />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center mt-3 sm:mt-4">
                    <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-0">
                        Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords} entries
                    </div>
                    <div className="flex items-center justify-center w-full md:w-auto overflow-x-auto">
                        <div className="flex space-x-1 overflow-x-auto">
                            <button 
                                onClick={() => handlePageChange(1)} 
                                disabled={currentPage === 1}
                                className="p-1 sm:p-2 disabled:opacity-50 text-xs sm:text-sm"
                                title="First Page"
                            >
                                <FaAngleDoubleLeft className={iconSize} />
                            </button>
                            <button 
                                onClick={() => handlePageChange(currentPage - 1)} 
                                disabled={currentPage === 1}
                                className="p-1 sm:p-2 disabled:opacity-50 text-xs sm:text-sm"
                                title="Previous Page"
                            >
                                <FaChevronLeft className={iconSize} />
                            </button>
                            {getPageNumbers().map((page) => (
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
                                className="p-1 sm:p-2 disabled:opacity-50 text-xs sm:text-sm"
                                title="Next Page"
                            >
                                <FaChevronRight className={iconSize} />
                            </button>
                            <button 
                                onClick={() => handlePageChange(totalPages)} 
                                disabled={currentPage === totalPages}
                                className="p-1 sm:p-2 disabled:opacity-50 text-xs sm:text-sm"
                                title="Last Page"
                            >
                                <FaAngleDoubleRight className={iconSize} />
                            </button>
                        </div>
                    </div>
                </div>

                {showDetails && selectedRow && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-5 rounded-lg shadow-lg max-w-2xl w-full relative max-h-[80vh] overflow-y-auto">
                            <button
                                onClick={() => setShowDetails(false)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
                                aria-label="Close"
                            >
                                <AiOutlineClose size={18} />
                            </button>
                            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">Submission Details</h2>
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

                {confirmDelete && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-5 rounded-lg shadow-lg max-w-md w-full">
                            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
                            <p className="mb-4">Are you sure you want to delete this submission? This action cannot be undone.</p>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setConfirmDelete(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDeletePlacement}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlacementPage;
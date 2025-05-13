"use client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "jspdf-autotable";
import "react-dropdown/style.css";
import * as XLSX from "xlsx";
import Dropdown, { Option } from "react-dropdown";
import EditRowModal from "@/modals/Marketing/CurrentMarketing/EditCandidateMarketing";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ViewRowModal from "@/modals/Marketing/CurrentMarketing/ViewCandidateMarketing";
import axios from "axios";
import jsPDF from "jspdf";
import withAuth from "@/modals/withAuth";
import { AgGridReact } from "ag-grid-react";
import { UserOptions } from "jspdf-autotable";
import { debounce } from "lodash";
import { AiOutlineEdit, AiOutlineEye, AiOutlineReload, AiOutlineSearch } from "react-icons/ai";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { CandidateMarketing } from "@/types";

// "use client";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import "jspdf-autotable";
// import "react-dropdown/style.css";
// import * as XLSX from "xlsx";
// import Dropdown, { Option } from "react-dropdown";
// import EditRowModal from "@/modals/Marketing/CurrentMarketing/EditCandidateMarketing";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import ViewRowModal from "@/modals/Marketing/CurrentMarketing/ViewCandidateMarketing";
// import axios from "axios";
// import jsPDF from "jspdf";
// import withAuth from "@/modals/withAuth";
// import { AgGridReact } from "ag-grid-react";
// import { UserOptions } from "jspdf-autotable";
// import { debounce } from "lodash";
// import { AiOutlineEdit, AiOutlineEye, AiOutlineReload, AiOutlineSearch } from "react-icons/ai";
// import { FaAngleDoubleLeft, FaAngleDoubleRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { CandidateMarketing } from "@/types";

// // new-projects-avatar-fullstack/project-avatar-ui/app/candidateMarketing/page.tsx

// // import { MdDelete } from "react-icons/md";

// interface RowData {
//   id: number;
//   candidateid: number;
//   startdate: string;
//   mmid: number;
//   instructorid: number;
//   status: string;
//   submitterid: number;
//   priority: string;
//   technology: string;
//   minrate: number;
//   currentlocation: string;
//   relocation: string;
//   locationpreference: string;
//   skypeid: string;
//   ipemail: string;
//   resumeid: number;
//   coverletter: string;
//   intro: string;
//   closedate: string;
//   closedemail: string;
//   notes: string;
//   suspensionreason: string;
//   yearsofexperience: string;
//   manager_name?: string;
//   instructor_name?: string;
//   submitter_name?: string;
// }

// interface Employee {
//   id: number;
//   name: string;
// }

// interface Resume {
//   id: number;
//   name: string;
// }

// interface AutoTableDoc extends jsPDF {
//   autoTable: (d: jsPDF, options: UserOptions) => void;
// }

// const CurrentMarketing = () => {
//   const [rowData, setRowData] = useState<RowData[]>([]);
//   const [columnDefs, setColumnDefs] = useState<{ headerName: string; field: string }[]>([]);
//   const [paginationPageSize] = useState<number>(200);
//   const [alertMessage, setAlertMessage] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [totalRows, setTotalRows] = useState<number>(0);
//   const [modalState, setModalState] = useState<{ add: boolean; edit: boolean; view: boolean }>({ add: false, edit: false, view: false });
//   const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
//   const [searchValue, setSearchValue] = useState<string>("");
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [resumes, setResumes] = useState<Resume[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const gridRef = useRef<AgGridReact>(null);

//   const API_URL = process.env.NEXT_PUBLIC_API_URL;

//   const fetchEmployeesAndResumes = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       const [employeesResponse, resumesResponse] = await Promise.all([
//         axios.get(`${API_URL}/currentmarketing/employees`, {
//           headers: { AuthToken: localStorage.getItem("token") },
//         }),
//         axios.get(`${API_URL}/currentmarketing/resumes`, {
//           headers: { AuthToken: localStorage.getItem("token") },
//         })
//       ]);
      
//       setEmployees(employeesResponse.data);
//       setResumes(resumesResponse.data);
//       return {
//         employees: employeesResponse.data,
//         resumes: resumesResponse.data
//       };
//     } catch (error) {
//       console.error("Error fetching employees and resumes:", error);
//       return { employees: [], resumes: [] };
//     } finally {
//       setIsLoading(false);
//     }
//   }, [API_URL]);

//   const mapEmployeeNamesToData = useCallback((data: RowData[], employeesList: Employee[]) => {
//     return data.map(row => {
//       const manager = employeesList.find(emp => emp.id === row.mmid);
//       const instructor = employeesList.find(emp => emp.id === row.instructorid);
//       const submitter = employeesList.find(emp => emp.id === row.submitterid);
      
//       return {
//         ...row,
//         manager_name: manager ? manager.name : 'Unknown',
//         instructor_name: instructor ? instructor.name : 'Unknown',
//         submitter_name: submitter ? submitter.name : 'Unknown'
//       };
//     });
//   }, []);

//   const fetchAllCandidates = useCallback(async (page = 1) => {
//     try {
//       setIsLoading(true);
//       const { employees: employeesList } = await fetchEmployeesAndResumes();
      
//       const response = await axios.get(`${API_URL}/currentmarketing`, {
//         params: { page: page, page_size: paginationPageSize },
//         headers: { AuthToken: localStorage.getItem("token") },
//       });

//       const data = response.data;
//       if (Array.isArray(data)) {
//         // Add status normalization
//         const normalizedData = data.map((item: RowData) => ({
//           ...item,
//           status: item.status.includes('-') ? item.status.split('-')[1] : item.status
//         }));
        
//         const mappedData = mapEmployeeNamesToData(normalizedData, employeesList);
//         setRowData(mappedData);
//         setTotalRows(mappedData.length);
//         setupColumns(mappedData);
//       } else {
//         console.error("Data is not an array:", data);
//         setRowData([]);
//         setTotalRows(0);
//         setColumnDefs([]);
//       }
//     } catch (error) {
//       console.error("Error loading candidates:", error);
//       alert("Failed to load candidates");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [paginationPageSize, API_URL, fetchEmployeesAndResumes, mapEmployeeNamesToData]);

//   useEffect(() => {
//     fetchAllCandidates(currentPage);
//   }, [fetchAllCandidates, currentPage]);

//   const searchCandidatesByName = useCallback(async (searchQuery: string) => {
//     try {
//       setIsLoading(true);
//       const { employees: employeesList } = await fetchEmployeesAndResumes();
      
//       const response = await axios.get(`${API_URL}/currentmarketing/search/name`, {
//         params: { name: searchQuery },
//         headers: { AuthToken: localStorage.getItem("token") },
//       });

//       let data = response.data;
//       if (!Array.isArray(data)) {
//         data = [data]; // Convert single object to an array with one element
//       }

//       if (Array.isArray(data)) {
//         // Add status normalization
//         const normalizedData = data.map((item: RowData) => ({
//           ...item,
//           status: item.status.includes('-') ? item.status.split('-')[1] : item.status
//         }));
        
//         const mappedData = mapEmployeeNamesToData(normalizedData, employeesList);
//         setRowData(mappedData);
//         setTotalRows(mappedData.length);
//         setupColumns(mappedData);
//       } else {
//         console.error("Data is not an array:", data);
//         setRowData([]);
//         setTotalRows(0);
//         setColumnDefs([]);
//       }
//     } catch (error) {
//       console.error("Error searching candidates:", error);
//       alert("No candidate with that name.");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [API_URL, fetchEmployeesAndResumes, mapEmployeeNamesToData]);

//   const debouncedSearch = useCallback(
//     debounce((query: string) => {
//       searchCandidatesByName(query);
//     }, 300),
//     [searchCandidatesByName]
//   );

//   useEffect(() => {
//     if (searchValue) {
//       debouncedSearch(searchValue);
//     } else {
//       fetchAllCandidates(currentPage);
//     }
//   }, [searchValue, currentPage, fetchAllCandidates, debouncedSearch]);

//   const setupColumns = (data: RowData[]) => {
//     if (Array.isArray(data) && data.length > 0) {
//       const keys = Object.keys(data[0]);
//       const columns = keys.map((key) => ({
//         headerName: key.charAt(0).toUpperCase() + key.slice(1),
//         field: key,
//       }));
//       setColumnDefs(columns);
//     } else {
//       console.error("Data is not an array or is empty:", data);
//       setColumnDefs([]);
//     }
//   };

//   const handleEditRow = () => {
//     if (gridRef.current) {
//       const selectedRows = gridRef.current.api.getSelectedRows();
//       if (selectedRows.length > 0) {
//         setSelectedRow(selectedRows[0]);
//         setModalState((prevState) => ({ ...prevState, edit: true }));
//       } else {
//         setAlertMessage("Please select a row to edit.");
//         setTimeout(() => setAlertMessage(null), 3000);
//       }
//     }
//   };

//   const handleViewRow = () => {
//     if (gridRef.current) {
//       const selectedRows = gridRef.current.api.getSelectedRows();
//       if (selectedRows.length > 0) {
//         setSelectedRow(selectedRows[0]);
//         setModalState((prevState) => ({ ...prevState, view: true }));
//       } else {
//         setAlertMessage("Please select a row to view.");
//         setTimeout(() => setAlertMessage(null), 3000);
//       }
//     }
//   };

//   // const handleDeleteRow = async () => {
//   //   if (gridRef.current) {
//   //     const selectedRows = gridRef.current.api.getSelectedRows();
//   //     if (selectedRows.length > 0) {
//   //       const id = selectedRows[0].id;
//   //       const confirmation = window.confirm(`Are you sure you want to delete entry ID ${id}?`);
//   //       if (!confirmation) return;

//   //       try {
//   //         await axios.delete(`${API_URL}/api/admin/candidatemarketing/${id}`, {
//   //           headers: { AuthToken: localStorage.getItem("token") },
//   //         });
//   //         alert("Entry deleted successfully.");
//   //         fetchAllCandidates(currentPage);
//   //       } catch (error) {
//   //         console.error("Error deleting entry:", error);
//   //         alert(`Failed to delete entry: ${error || "Unknown error occurred"}`);
//   //       }
//   //     } else {
//   //       setAlertMessage("Please select a row to delete.");
//   //       setTimeout(() => setAlertMessage(null), 3000);
//   //     }
//   //   }
//   // };

//   const handleRefresh = () => {
//     setSearchValue("");
//     fetchAllCandidates(currentPage);
//     window.location.reload();
//   };

//   const handlePageChange = (newPage: number) => {
//     setCurrentPage(newPage);
//     if (!searchValue) {
//       fetchAllCandidates(newPage);
//     }
//   };

//   const handleDownloadPDF = () => {
//     if (gridRef.current) {
//       const selectedRows = gridRef.current.api.getSelectedRows();
//       if (selectedRows.length > 0) {
//         const doc = new jsPDF({ orientation: "landscape" }) as unknown as AutoTableDoc;
//         doc.text("Selected Candidate Marketing Data", 15, 10);

//         const pdfData = selectedRows.map((row: RowData) => [
//           row.candidateid,
//           row.startdate,
//           row.manager_name || row.mmid,
//           row.instructor_name || row.instructorid,
//           row.status,
//           row.submitter_name || row.submitterid,
//           row.priority,
//           row.technology,
//           row.minrate,
//           row.currentlocation,
//           row.relocation,
//           row.locationpreference,
//           row.skypeid,
//           row.ipemail,
//           row.resumeid,
//           row.coverletter,
//           row.intro,
//           row.closedate,
//           row.closedemail,
//           row.notes,
//           row.suspensionreason ?? "",
//           row.yearsofexperience ?? 0,
//         ]).map(row => row.filter(value => value !== undefined));

//         doc.autoTable(doc, {
//           head: [
//             [
//               "Candidate ID",
//               "Start Date",
//               "Manager",
//               "Instructor",
//               "Status",
//               "Submitter",
//               "Priority",
//               "Technology",
//               "Min Rate",
//               "Current Location",
//               "Relocation",
//               "Location Preference",
//               "Skype ID",
//               "IP Email",
//               "Resume ID",
//               "Cover Letter",
//               "Intro",
//               "Close Date",
//               "Closed Email",
//               "Notes",
//               "Suspension Reason",
//               "Years of Experience",
//             ],
//           ],
//           body: pdfData,
//           styles: {
//             fontSize: 8,
//             cellPadding: 4,
//           },
//           margin: { top: 15, left: 15, right: 15 },
//         });

//         doc.save("Selected_Candidate_Marketing_Data.pdf");
//       } else {
//         alert("Please select a row to download.");
//       }
//     }
//   };

//   const handleSearch = () => {
//     if (searchValue) {
//       searchCandidatesByName(searchValue);
//     }
//   };

//   const handleExportToExcel = () => {
//     if (gridRef.current) {
//       const selectedRows = gridRef.current.api.getSelectedRows();
//       if (selectedRows.length > 0) {
//         const ws = XLSX.utils.json_to_sheet(selectedRows);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, "Selected Candidate Marketing Data");
//         XLSX.writeFile(wb, "Selected_Candidate_Marketing_Data.xlsx");
//       } else {
//         alert("Please select a row to export.");
//       }
//     }
//   };

//   const options: Option[] = [
//     {
//       value: "Export to PDF",
//       label: "Export to PDF",
//     },
//     {
//       value: "Export to Excel",
//       label: "Export to Excel",
//     },
//   ];

//   const defaultOption = "Download";

//   const totalPages = Math.ceil(totalRows / paginationPageSize);
//   const startPage = Math.max(1, currentPage - 2);
//   const endPage = Math.min(totalPages, currentPage + 2);
//   const pageOptions = Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage);

//   return (
//     <div className="relative">
//       <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md relative">
//         {alertMessage && (
//           <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded-md shadow-md z-50">
//             {alertMessage}
//           </div>
//         )}
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-3xl font-bold text-gray-800">Current Marketing</h1>
//         </div>
//         <div className="flex flex-col md:flex-row mb-4 justify-between items-center">
//           <div className="flex w-full md:w-auto mb-2 md:mb-0">
//             <input
//               type="text"
//               placeholder="Search..."
//               value={searchValue}
//               onChange={(e) => setSearchValue(e.target.value)}
//               className="border border-gray-300 rounded-md p-2 w-64"
//             />
//             <button
//               onClick={handleSearch}
//               className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md ml-2 transition duration-300 hover:bg-blue-900"
//             >
//               <AiOutlineSearch className="mr-2" /> Search
//             </button>
//           </div>
//           <div className="flex space-x-2">
//             <button
//               onClick={handleEditRow}
//               className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700"
//             >
//               <AiOutlineEdit className="mr-2" />
//             </button>
//             {/* <button
//               onClick={handleDeleteRow}
//               className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700"
//             >
//               <MdDelete className="mr-2" />
//             </button> */}
//             <button
//               onClick={handleViewRow}
//               className="flex items-center px-4 py-2 bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-700"
//             >
//               <AiOutlineEye className="mr-2" />
//             </button>
//             <button
//               onClick={handleRefresh}
//               className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md transition duration-300 hover:bg-gray-900"
//             >
//               <AiOutlineReload className="mr-2" />
//             </button>
//             <Dropdown
//               options={options}
//               value={defaultOption}
//               onChange={(selectedOption) => {
//                 if (selectedOption.value === "Export to PDF") {
//                   handleDownloadPDF();
//                 } else if (selectedOption.value === "Export to Excel") {
//                   handleExportToExcel();
//                 }
//               }}
//               placeholder="Select an option"
//               className="bg-purple-600 text-black rounded-lg transition duration-300 hover:bg-purple-700"
//               controlClassName="bg-purple-600 text-black rounded-lg transition duration-300 hover:bg-purple-700 border-none px-4 py-2"
//               menuClassName="bg-purple-600 text-black rounded-lg transition duration-300"
//               arrowClassName="text-black"
//               placeholderClassName="text-black"
//             />
//           </div>
//         </div>
//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : (
//           <div
//             className="ag-theme-alpine"
//             style={{ height: "400px", width: "100%", overflowY: "auto" }}
//           >
//             <AgGridReact
//               ref={gridRef}
//               rowData={rowData}
//               columnDefs={columnDefs}
//               pagination={false}
//               domLayout="normal"
//               rowSelection="multiple"
//               defaultColDef={{
//                 sortable: true,
//                 filter: true,
//                 resizable: true,
//                 cellStyle: { color: "#333", fontSize: "0.75rem", padding: "1px" },
//                 minWidth: 80,
//                 maxWidth: 150,
//               }}
//               rowHeight={30}
//               headerHeight={35}
//             />
//           </div>
//         )}
//         <div className="flex justify-between mt-4">
//           <div className="flex items-center">
//             <button
//               onClick={() => handlePageChange(1)}
//               disabled={currentPage === 1}
//               className="p-2 disabled:opacity-50"
//             >
//               <FaAngleDoubleLeft />
//             </button>
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="p-2 disabled:opacity-50"
//             >
//               <FaChevronLeft />
//             </button>
//             {pageOptions.map((page) => (
//               <button
//                 key={page}
//                 onClick={() => handlePageChange(page)}
//                 className={`px-2 py-1 rounded-md ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
//               >
//                 {page}
//               </button>
//             ))}
//             <button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className="p-2 disabled:opacity-50"
//             >
//               <FaChevronRight />
//             </button>
//             <button
//               onClick={() => handlePageChange(totalPages)}
//               disabled={currentPage === totalPages}
//               className="p-2 disabled:opacity-50"
//             >
//               <FaAngleDoubleRight />
//             </button>
//           </div>
//         </div>
//         <EditRowModal
//           isOpen={modalState.edit}
//           onRequestClose={() => setModalState({ ...modalState, edit: false })}
//           rowData={selectedRow ? {
//             ...selectedRow,
//             ipemail: selectedRow.ipemail || '',
//             manager_name: selectedRow.manager_name || '',
//             instructor_name: selectedRow.instructor_name || '',
//             submitter_name: selectedRow.submitter_name || '',
//             ipemailid: selectedRow.ipemail || 0,
//             mmid: selectedRow.mmid || 0,
//             instructorid: selectedRow.instructorid || 0,
//             submitterid: selectedRow.submitterid || 0,
//             priority: selectedRow.priority || '',
//             technology: selectedRow.technology || '',
//             status: selectedRow.status || '',
//             yearsofexperience: selectedRow.yearsofexperience || '0',
//             currentlocation: selectedRow.currentlocation || '',
//             locationpreference: selectedRow.locationpreference || '',
//             relocation: selectedRow.relocation || '',
//             suspensionreason: selectedRow.suspensionreason || '',
//             closedate: selectedRow.closedate || '',
//             notes: selectedRow.notes || '',
//             intro: selectedRow.intro || '',
//             resumeid: selectedRow.resumeid || 0
//           } as CandidateMarketing : null}
//           onSave={() => fetchAllCandidates(currentPage)}
//           employees={employees}
//           resumes={resumes}
//         />
//         <ViewRowModal
//           isOpen={modalState.view}
//           onRequestClose={() => setModalState({ ...modalState, view: false })}
//           rowData={selectedRow ? {
//             ...selectedRow,
//             ipemail: selectedRow.ipemail || '',
//             manager_name: selectedRow.manager_name || '',
//             instructor_name: selectedRow.instructor_name || '',
//             submitter_name: selectedRow.submitter_name || '',
//             ipemailid: selectedRow.ipemail || 0,
//             mmid: selectedRow.mmid || 0,
//             instructorid: selectedRow.instructorid || 0,
//             submitterid: selectedRow.submitterid || 0,
//             resumeid: selectedRow.resumeid || 0
//           } as CandidateMarketing : null}
//           resumes={resumes}
//         />
//       </div>
//     </div>
//   );
// };

// export default withAuth(CurrentMarketing);


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
  manager_name?: string;
  instructor_name?: string;
  submitter_name?: string;
}

interface Employee {
  id: number;
  name: string;
}

interface Resume {
  id: number;
  name: string;
}

interface AutoTableDoc extends jsPDF {
  autoTable: (d: jsPDF, options: UserOptions) => void;
}

const CurrentMarketing = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [columnDefs, setColumnDefs] = useState<{ headerName: string; field: string; width?: number }[]>([]);
  const [paginationPageSize] = useState<number>(200);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [modalState, setModalState] = useState<{ add: boolean; edit: boolean; view: boolean }>({ add: false, edit: false, view: false });
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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

  const fetchEmployeesAndResumes = useCallback(async () => {
    try {
      setIsLoading(true);
      const [employeesResponse, resumesResponse] = await Promise.all([
        axios.get(`${API_URL}/currentmarketing/employees`, {
          headers: { AuthToken: localStorage.getItem("token") },
        }),
        axios.get(`${API_URL}/currentmarketing/resumes`, {
          headers: { AuthToken: localStorage.getItem("token") },
        })
      ]);
      
      setEmployees(employeesResponse.data);
      setResumes(resumesResponse.data);
      return {
        employees: employeesResponse.data,
        resumes: resumesResponse.data
      };
    } catch (error) {
      console.error("Error fetching employees and resumes:", error);
      return { employees: [], resumes: [] };
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  const mapEmployeeNamesToData = useCallback((data: RowData[], employeesList: Employee[]) => {
    return data.map(row => {
      const manager = employeesList.find(emp => emp.id === row.mmid);
      const instructor = employeesList.find(emp => emp.id === row.instructorid);
      const submitter = employeesList.find(emp => emp.id === row.submitterid);
      
      return {
        ...row,
        manager_name: manager ? manager.name : 'Unknown',
        instructor_name: instructor ? instructor.name : 'Unknown',
        submitter_name: submitter ? submitter.name : 'Unknown'
      };
    });
  }, []);

  const fetchAllCandidates = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const { employees: employeesList } = await fetchEmployeesAndResumes();
      
      const response = await axios.get(`${API_URL}/currentmarketing`, {
        params: { page: page, page_size: paginationPageSize },
        headers: { AuthToken: localStorage.getItem("token") },
      });

      const data = response.data;
      if (Array.isArray(data)) {
        const normalizedData = data.map((item: RowData) => ({
          ...item,
          status: item.status.includes('-') ? item.status.split('-')[1] : item.status
        }));
        
        const mappedData = mapEmployeeNamesToData(normalizedData, employeesList);
        setRowData(mappedData);
        setTotalRows(mappedData.length);
        setupColumns(mappedData);
      } else {
        console.error("Data is not an array:", data);
        setRowData([]);
        setTotalRows(0);
        setColumnDefs([]);
      }
    } catch (error) {
      console.error("Error loading candidates:", error);
      setAlertMessage("Failed to load candidates");
      setTimeout(() => setAlertMessage(null), 3000);
    } finally {
      setIsLoading(false);
    }
  }, [paginationPageSize, API_URL, fetchEmployeesAndResumes, mapEmployeeNamesToData]);

  useEffect(() => {
    fetchAllCandidates(currentPage);
  }, [fetchAllCandidates, currentPage]);

  const searchCandidatesByName = useCallback(async (searchQuery: string) => {
    try {
      setIsLoading(true);
      const { employees: employeesList } = await fetchEmployeesAndResumes();
      
      const response = await axios.get(`${API_URL}/currentmarketing/search/name`, {
        params: { name: searchQuery },
        headers: { AuthToken: localStorage.getItem("token") },
      });

      let data = response.data;
      if (!Array.isArray(data)) {
        data = [data];
      }

      if (Array.isArray(data)) {
        const normalizedData = data.map((item: RowData) => ({
          ...item,
          status: item.status.includes('-') ? item.status.split('-')[1] : item.status
        }));
        
        const mappedData = mapEmployeeNamesToData(normalizedData, employeesList);
        setRowData(mappedData);
        setTotalRows(mappedData.length);
        setupColumns(mappedData);
      } else {
        console.error("Data is not an array:", data);
        setRowData([]);
        setTotalRows(0);
        setColumnDefs([]);
      }
    } catch (error) {
      console.error("Error searching candidates:", error);
      setAlertMessage("No candidate with that name");
      setTimeout(() => setAlertMessage(null), 3000);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, fetchEmployeesAndResumes, mapEmployeeNamesToData]);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      searchCandidatesByName(query);
    }, 300),
    [searchCandidatesByName]
  );

  useEffect(() => {
    if (searchValue) {
      debouncedSearch(searchValue);
    } else {
      fetchAllCandidates(currentPage);
    }
  }, [searchValue, currentPage, fetchAllCandidates, debouncedSearch]);

  const setupColumns = (data: RowData[]) => {
    if (Array.isArray(data) && data.length > 0) {
      // Calculate column width based on screen size
      const getColumnWidth = (field: string) => {
        if (windowWidth < 640) return 80; // Mobile
        if (windowWidth < 1024) return 100; // Tablet
        return 120; // Desktop
      };
      
      const keys = Object.keys(data[0]);
      const columns = keys.map((key) => ({
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
        field: key,
        width: getColumnWidth(key)
      }));
      setColumnDefs(columns);
    } else {
      console.error("Data is not an array or is empty:", data);
      setColumnDefs([]);
    }
  };

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
        setSelectedRow(selectedRows[0]);
        setModalState((prevState) => ({ ...prevState, view: true }));
      } else {
        setAlertMessage("Please select a row to view.");
        setTimeout(() => setAlertMessage(null), 3000);
      }
    }
  };

  const handleRefresh = () => {
    setSearchValue("");
    fetchAllCandidates(currentPage);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (!searchValue) {
      fetchAllCandidates(newPage);
    }
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
          row.manager_name || row.mmid,
          row.instructor_name || row.instructorid,
          row.status,
          row.submitter_name || row.submitterid,
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
              "Manager",
              "Instructor",
              "Status",
              "Submitter",
              "Priority",
              "Technology",
              "Min Rate",
              "Current Location",
              "Relocation",
              "Location Preference",
              "Skype ID",
              "IP Email",
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
          styles: {
            fontSize: windowWidth < 640 ? 6 : 8,
            cellPadding: windowWidth < 640 ? 2 : 4,
          },
          margin: { top: 15, left: 15, right: 15 },
        });

        doc.save("Selected_Candidate_Marketing_Data.pdf");
      } else {
        setAlertMessage("Please select a row to download.");
        setTimeout(() => setAlertMessage(null), 3000);
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
        setAlertMessage("Please select a row to export.");
        setTimeout(() => setAlertMessage(null), 3000);
      }
    }
  };

  const options: Option[] = [
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
  const startPage = Math.max(1, currentPage - (windowWidth < 640 ? 1 : 2));
  const endPage = Math.min(totalPages, startPage + (windowWidth < 640 ? 2 : 4));
  const pageOptions = Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage);

  // Get appropriate icon sizes based on screen width
  const getIconSize = () => {
    if (windowWidth < 640) return "text-xs";
    if (windowWidth < 1024) return "text-sm";
    return "text-base";
  };

  // Get appropriate button padding based on screen width
  const getButtonPadding = () => {
    if (windowWidth < 640) return "px-1.5 py-1";
    if (windowWidth < 1024) return "px-2 py-1";
    return "px-3 py-1.5";
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
        <div className="flex flex-col md:flex-row justify-between items-center mb-3 sm:mb-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Current Marketing</h1>
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
        
          <div className="flex items-center space-x-1">
            <button
              onClick={handleEditRow}
              className={`flex items-center justify-center ${buttonPadding} bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700 text-xs sm:text-sm`}
              title="Edit Candidate"
            >
              <AiOutlineEdit className={iconSize} />
            </button>
            <button
              onClick={handleViewRow}
              className={`flex items-center justify-center ${buttonPadding} bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-700 text-xs sm:text-sm`}
              title="View Candidate"
            >
              <AiOutlineEye className={iconSize} />
            </button>
            <button
              onClick={handleDownloadPDF}
              className={`flex items-center justify-center ${buttonPadding} bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700 text-xs sm:text-sm`}
              title="Export to PDF"
            >
              <FaFilePdf className={iconSize} />
            </button>
            <button
              onClick={handleExportToExcel}
              className={`flex items-center justify-center ${buttonPadding} bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700 text-xs sm:text-sm`}
              title="Export to Excel"
            >
              <FaFileExcel className={iconSize} />
            </button>
            <button
              onClick={handleRefresh}
              className={`flex items-center justify-center ${buttonPadding} bg-gray-500 text-white rounded-md transition duration-300 hover:bg-gray-900 text-xs sm:text-sm`}
              title="Refresh"
            >
              <AiOutlineReload className={iconSize} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center" style={{ 
            height: windowWidth < 640 ? "300px" : windowWidth < 1024 ? "350px" : "400px" 
          }}>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div 
            className="ag-theme-alpine" 
            style={{ 
              height: windowWidth < 640 ? "300px" : windowWidth < 1024 ? "350px" : "400px", 
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
        )}

        <div className="flex flex-col md:flex-row justify-between items-center mt-3 sm:mt-4">
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
              {pageOptions.map((page) => (
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
          <div className="text-xs sm:text-sm text-gray-600 mt-2 md:mt-0">
            Total Records: {totalRows}
          </div>
        </div>

        <EditRowModal
          isOpen={modalState.edit}
          onRequestClose={() => setModalState({ ...modalState, edit: false })}
          rowData={selectedRow ? {
            ...selectedRow,
            ipemail: selectedRow.ipemail || '',
            manager_name: selectedRow.manager_name || '',
            instructor_name: selectedRow.instructor_name || '',
            submitter_name: selectedRow.submitter_name || '',
            ipemailid: selectedRow.ipemail || 0,
            mmid: selectedRow.mmid || 0,
            instructorid: selectedRow.instructorid || 0,
            submitterid: selectedRow.submitterid || 0,
            priority: selectedRow.priority || '',
            technology: selectedRow.technology || '',
            status: selectedRow.status || '',
            yearsofexperience: selectedRow.yearsofexperience || '0',
            currentlocation: selectedRow.currentlocation || '',
            locationpreference: selectedRow.locationpreference || '',
            relocation: selectedRow.relocation || '',
            suspensionreason: selectedRow.suspensionreason || '',
            closedate: selectedRow.closedate || '',
            notes: selectedRow.notes || '',
            intro: selectedRow.intro || '',
            resumeid: selectedRow.resumeid || 0
          } as CandidateMarketing : null}
          onSave={() => fetchAllCandidates(currentPage)}
          employees={employees}
          resumes={resumes}
        />
        <ViewRowModal
          isOpen={modalState.view}
          onRequestClose={() => setModalState({ ...modalState, view: false })}
          rowData={selectedRow ? {
            ...selectedRow,
            ipemail: selectedRow.ipemail || '',
            manager_name: selectedRow.manager_name || '',
            instructor_name: selectedRow.instructor_name || '',
            submitter_name: selectedRow.submitter_name || '',
            ipemailid: selectedRow.ipemail || 0,
            mmid: selectedRow.mmid || 0,
            instructorid: selectedRow.instructorid || 0,
            submitterid: selectedRow.submitterid || 0,
            resumeid: selectedRow.resumeid || 0
          } as CandidateMarketing : null}
          resumes={resumes}
        />
      </div>
    </div>
  );
};

export default withAuth(CurrentMarketing);
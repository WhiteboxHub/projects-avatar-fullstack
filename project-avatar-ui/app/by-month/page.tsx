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
// import AddRowModal from "../../modals/bymonth_modals/AddRowByMonth";
// import EditRowModal from "../../modals/bymonth_modals/EditRowByMonth";
// import ViewRowModal from "../../modals/bymonth_modals/ViewRowByMonth";
// import { MdDelete } from "react-icons/md";
// import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
// import {
//   AiOutlineEdit,
//   AiOutlineEye,
//   AiOutlineSearch,
//   AiOutlineReload,
// } from "react-icons/ai";
// import { MdAdd } from "react-icons/md";
// import type { ByMonth } from "../../types/index"; // Use type-only import

// jsPDF.prototype.autoTable = autoTable;

// const ByMonth = () => {
//   const [rowData, setRowData] = useState<ByMonth[]>([]);
//   const [alertMessage, setAlertMessage] = useState<string | null>(null);
//   const [columnDefs, setColumnDefs] = useState<{ headerName: string; field: string }[]>([]);
//   const [paginationPageSize] = useState<number>(100);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [totalRows, setTotalRows] = useState<number>(0);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [modalState, setModalState] = useState<{
//     add: boolean;
//     edit: boolean;
//     view: boolean;
//   }>({ add: false, edit: false, view: false });
//   const [selectedRow, setSelectedRow] = useState<ByMonth | null>(null);
//   const [searchValue, setSearchValue] = useState<string>("");
//   const [monthData, setMonthData] = useState<ByMonth[]>([]);
//   const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
//   const gridRef = useRef<AgGridReact>(null);

//   const API_URL = process.env.NEXT_PUBLIC_API_URL;

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${API_URL}/invoices/months/`, {
//         params: {
//           page: currentPage,
//           pageSize: paginationPageSize,
//         },
//         headers: { AuthToken: localStorage.getItem("token") },
//       });

//       const data = response.data;
//       console.log("Fetched Data:", data); // Log the data
//       setRowData(data);
//       setTotalRows(data.length); // Assuming totalRows is the length of the data array
//       setupColumns(data);
//     } catch (error) {
//       console.error("Error loading data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchByMonths = async (month = null, searchQuery = "") => {
//     try {
//       const response = await axios.get(`${API_URL}/invoices/month/${month || ''}`, {
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
//     fetchByMonths(null, searchValue);
//   };

//   const setupColumns = (data: Record<string, unknown>[]) => {
//     if (data.length > 0) {
//       const columns = Object.keys(data[0]).map((key) => ({
//         headerName: key.charAt(0).toUpperCase() + key.slice(1),
//         field: key,
//       }));
//       console.log("Column Definitions:", columns);
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

//   interface ErrorResponse {
//     message: string;
//     // Add other properties if needed
//   }

//   const handleDeleteRow = async () => {
//     if (gridRef.current) {
//       const selectedRows = gridRef.current.api.getSelectedRows();
//       if (selectedRows.length > 0) {
//         const byMonthId = selectedRows[0].byMonthid || selectedRows[0].id;
//         if (byMonthId) {
//           const confirmation = window.confirm(
//             `Are you sure you want to delete By Month ID ${byMonthId}?`
//           );
//           if (!confirmation) return;

//           try {
//             await axios.delete(`${API_URL}/bymonth/delete/${byMonthId}`, {
//               headers: { AuthToken: localStorage.getItem("token") },
//             });
//             alert("By Month deleted successfully.");
//             fetchData();
//           } catch (error) {
//             const axiosError = error as AxiosError;
//             alert(
//                 `Failed to delete By Month: ${
//                     (axiosError.response?.data as ErrorResponse)?.message || axiosError.message
//                 }`
//             );
//           }
//         } else {
//           alert("No valid By Month ID found for the selected row.");
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

//     interface RowClickParams {
//       data: {
//         invmonth?: string;
//         [key: string]: string | number | boolean | null | undefined; // Specify possible types for additional properties
//       };
//     }

//     const handleRowClick = async (params: RowClickParams) => {
//       const month = params.data.invmonth; // Ensure 'invmonth' is the correct field name
//       console.log("Row clicked with data:", params.data); // Log the entire row data
//       console.log("Selected Month:", month); // Log the selected month

//       if (month) {
//         setSelectedMonth(month);
//         try {
//           const response = await axios.get(`${API_URL}/invoices/month/${month}`, {
//             headers: { AuthToken: localStorage.getItem("token") },
//           });
//           const data = response.data; // Ensure this matches your API response structure
//           console.log("Fetched Month Data:", data); // Log the fetched data
//           setMonthData(data);
//         } catch (error) {
//           console.error("Error loading month data:", error);
//         }
//       } else {
//         console.error("Month is undefined. Please check the data structure.");
//       }
//     };

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     doc.text("By Month Data", 20, 10);
//     const pdfData = rowData.map((row) => Object.values(row));
//     const headers = columnDefs.map((col) => col.headerName);
//     autoTable(doc, {
//       head: [headers],
//       body: pdfData,
//       theme: 'grid',
//       styles: { fontSize: 5 },
//     });
//     doc.save("by_month_data.pdf");
//   };

//   const totalPages = Math.ceil(totalRows / paginationPageSize);
//   const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

//   return (
//     <div className="p-4 mt-20 mb-10 mx-auto bg-gray-100 rounded-lg shadow-md relative max-w-7xl">
//       {alertMessage && ( 
//         <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded-md shadow-md z-50">
//           {alertMessage}
//         </div>
//       )}

//       <div className="flex flex-col md:flex-row justify-between items-center mb-4">
//         <h1 className="text-3xl font-bold text-gray-800">Invoice Management</h1>
//       </div>

//       <div className="flex flex-col md:flex-row mb-4 justify-between items-center">
//         <div className="flex w-full md:w-auto mb-2 md:mb-0">
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchValue}
//             onChange={(e) => setSearchValue(e.target.value)}
//             className="border border-gray-300 rounded-md p-2 w-64"
//           />
//           <button
//             onClick={handleSearch}
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md ml-2 transition duration-300 hover:bg-blue-900"
//           >
//             <AiOutlineSearch className="mr-2" /> Search
//           </button>
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
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-48">
//           <span className="text-xl">Loading...</span>
//         </div>
//       ) : (
//         <div
//           className="ag-theme-alpine table-container"
//           style={{ height: "300px", width: "100%", overflowY: "auto" }}
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
//               maxWidth: 1200,
//               width: 150,
              
//             }}
//             rowHeight={30}
//             headerHeight={35}
//             onRowClicked={handleRowClick} // Ensure this is correctly set
//           />
//         </div>
//       )}

//       {selectedMonth && (
//         <div className="mt-4">
//           <h2 className="text-2xl font-bold text-gray-800">Data for {selectedMonth}</h2>
//           <div
//             className="ag-theme-alpine"
//             style={{ height: "200px", width: "100%", overflowY: "auto" }}
//           >
//             <AgGridReact
//               rowData={monthData}
//               columnDefs={[
//                 { headerName: "ID", field: "id" },
//                 { headerName: "PO ID", field: "poid" },
//                 { headerName: "Invoice Number", field: "invoicenumber" },
//                 { headerName: "Start Date", field: "startdate" },
//                 { headerName: "End Date", field: "enddate" },
//                 { headerName: "Invoice Date", field: "invoicedate" },
//                 { headerName: "Invoice Month", field: "invmonth" },
//                 { headerName: "Quantity", field: "quantity" },
//                 { headerName: "OT Quantity", field: "otquantity" },
//                 { headerName: "Rate", field: "rate" },
//                 { headerName: "Overtime Rate", field: "overtimerate" },
//                 { headerName: "Status", field: "status" },
//                 { headerName: "Emp Paid Date", field: "emppaiddate" },
//                 { headerName: "Cand Payment Status", field: "candpaymentstatus" },
//                 { headerName: "Reminders", field: "reminders" },
//                 { headerName: "Amount Expected", field: "amountexpected" },
//                 { headerName: "Expected Date", field: "expecteddate" },
//                 { headerName: "Amount Received", field: "amountreceived" },
//                 { headerName: "Received Date", field: "receiveddate" },
//                 { headerName: "Released Date", field: "releaseddate" },
//                 { headerName: "Check Number", field: "checknumber" },
//                 { headerName: "Invoice URL", field: "invoiceurl" },
//                 { headerName: "Check URL", field: "checkurl" },
//                 { headerName: "Freq Type", field: "freqtype" },
//                 { headerName: "Invoice Net", field: "invoicenet" },
//                 { headerName: "Company Name", field: "companyname" },
//                 { headerName: "Vendor Fax", field: "vendorfax" },
//                 { headerName: "Vendor Phone", field: "vendorphone" },
//                 { headerName: "Vendor Email", field: "vendoremail" },
//                 { headerName: "Timesheet Email", field: "timsheetemail" },
//                 { headerName: "HR Name", field: "hrname" },
//                 { headerName: "HR Email", field: "hremail" },
//                 { headerName: "HR Phone", field: "hrphone" },
//                 { headerName: "Manager Name", field: "managername" },
//                 { headerName: "Manager Email", field: "manageremail" },
//                 { headerName: "Manager Phone", field: "managerphone" },
//                 { headerName: "Secondary Name", field: "secondaryname" },
//                 { headerName: "Secondary Email", field: "secondaryemail" },
//                 { headerName: "Secondary Phone", field: "secondaryphone" },
//                 { headerName: "Candidate Name", field: "candidatename" },
//                 { headerName: "Candidate Phone", field: "candidatephone" },
//                 { headerName: "Candidate Email", field: "candidateemail" },
//                 { headerName: "WRK Email", field: "wrkemail" },
//                 { headerName: "WRK Phone", field: "wrkphone" },
//                 { headerName: "Recruiter Name", field: "recruitername" },
//                 { headerName: "Recruiter Phone", field: "recruiterphone" },
//                 { headerName: "Recruiter Email", field: "recruiteremail" },
//                 { headerName: "Notes", field: "notes" },
//               ]}
//               pagination={false}
//               domLayout="normal"
//               defaultColDef={{
//                 sortable: true,
//                 filter: true,
//                 cellStyle: { color: "#333", fontSize: "0.75rem", padding: "1px" },
//                 minWidth: 60,
//                 maxWidth: 1200,
//               }}
//               rowHeight={30}
//               headerHeight={35}
//             />
//           </div>
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

// export default ByMonth;





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
// import AddRowModal from "../../modals/bymonth_modals/AddRowByMonth";
// import EditRowModal from "../../modals/bymonth_modals/EditRowByMonth";
// import ViewRowModal from "../../modals/bymonth_modals/ViewRowByMonth";
// import { MdDelete } from "react-icons/md";
// import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
// import {
//   AiOutlineEdit,
//   AiOutlineEye,
//   AiOutlineSearch,
//   AiOutlineReload,
// } from "react-icons/ai";
// import { MdAdd } from "react-icons/md";
// import type { ByMonth } from "../../types/index";

// jsPDF.prototype.autoTable = autoTable;

// const ByMonth = () => {
//   const [rowData, setRowData] = useState<ByMonth[]>([]);
//   const [alertMessage, setAlertMessage] = useState<string | null>(null);
//   const [columnDefs, setColumnDefs] = useState<{ headerName: string; field: string }[]>([]);
//   const [paginationPageSize] = useState<number>(100);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [totalRows, setTotalRows] = useState<number>(0);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [modalState, setModalState] = useState<{
//     add: boolean;
//     edit: boolean;
//     view: boolean;
//   }>({ add: false, edit: false, view: false });
//   const [selectedRow, setSelectedRow] = useState<ByMonth | null>(null);
//   const [searchValue, setSearchValue] = useState<string>("");
//   const [monthData, setMonthData] = useState<ByMonth[]>([]);
//   const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
//   const gridRef = useRef<AgGridReact>(null);

//   const API_URL = process.env.NEXT_PUBLIC_API_URL;

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${API_URL}/invoices/months/`, {
//         params: {
//           page: currentPage,
//           pageSize: paginationPageSize,
//         },
//         headers: { AuthToken: localStorage.getItem("token") },
//       });

//       const data = response.data;
//       console.log("Fetched Data:", data);
//       setRowData(data);
//       setTotalRows(data.length);
//       setupColumns(data);
//     } catch (error) {
//       console.error("Error loading data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchByMonths = async (month = null, searchQuery = "") => {
//     try {
//       const response = await axios.get(`${API_URL}/invoices/month/${month || ''}`, {
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
//     fetchByMonths(null, searchValue);
//   };

//   const setupColumns = (data: Record<string, unknown>[]) => {
//     if (data.length > 0) {
//       const columns = Object.keys(data[0]).map((key) => ({
//         headerName: key.charAt(0).toUpperCase() + key.slice(1),
//         field: key,
//       }));
//       console.log("Column Definitions:", columns);
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
//         setAlertMessage("Please select a row to edit.");
//         setTimeout(() => setAlertMessage(null), 3000);
//       }
//     }
//   };

//   interface ErrorResponse {
//     message: string;
//   }

//   const handleDeleteRow = async () => {
//     if (gridRef.current) {
//       const selectedRows = gridRef.current.api.getSelectedRows();
//       if (selectedRows.length > 0) {
//         const byMonthId = selectedRows[0].byMonthid || selectedRows[0].id;
//         if (byMonthId) {
//           const confirmation = window.confirm(
//             `Are you sure you want to delete By Month ID ${byMonthId}?`
//           );
//           if (!confirmation) return;

//           try {
//             await axios.delete(`${API_URL}/bymonth/delete/${byMonthId}`, {
//               headers: { AuthToken: localStorage.getItem("token") },
//             });
//             alert("By Month deleted successfully.");
//             fetchData();
//           } catch (error) {
//             const axiosError = error as AxiosError;
//             alert(
//                 `Failed to delete By Month: ${
//                     (axiosError.response?.data as ErrorResponse)?.message || axiosError.message
//                 }`
//             );
//           }
//         } else {
//           alert("No valid By Month ID found for the selected row.");
//         }
//       } else {
//         setAlertMessage("Please select a row to delete.");
//         setTimeout(() => setAlertMessage(null), 3000);
//       }
//     }
//   };

//   const handlePageChange = (newPage: number) => setCurrentPage(newPage);

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

//   interface RowClickParams {
//     data: {
//       invmonth?: string;
//       [key: string]: string | number | boolean | null | undefined;
//     };
//   }

//   const handleRowClick = async (params: RowClickParams) => {
//     const month = params.data.invmonth;
//     console.log("Row clicked with data:", params.data);
//     console.log("Selected Month:", month);

//     if (month) {  
//       setSelectedMonth(month);
//       try {
//         const response = await axios.get(`${API_URL}/invoices/month/${month}`, {
//           headers: { AuthToken: localStorage.getItem("token") },
//         });
//         const data = response.data;
//         console.log("Fetched Month Data:", data);
//         setMonthData(data);
//         // Get the current row node
//         const rowNode = gridRef.current?.api.getRowNode(params.data.id as string);
//         if (rowNode) {
//           // Set the expanded state
//           rowNode.setExpanded(!rowNode.expanded);
//         }
//       } catch (error) {
//         console.error("Error loading month data:", error);
//       }
//     } else {
//       console.error("Month is undefined. Please check the data structure.");
//     }
//   };

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     doc.text("By Month Data", 20, 10);
//     const pdfData = rowData.map((row) => Object.values(row));
//     const headers = columnDefs.map((col) => col.headerName);
//     autoTable(doc, {
//       head: [headers],
//       body: pdfData,
//       theme: 'grid',
//       styles: { fontSize: 5 },
//     });
//     doc.save("by_month_data.pdf");
//   };

//   const totalPages = Math.ceil(totalRows / paginationPageSize);
//   const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

//   // Detail cell renderer component
// // Also update the DetailCellRenderer component to handle cases where data might be undefined
// const DetailCellRenderer = ({ data }: { data: unknown }) => {
//   if (!data || !monthData.length) {
//     return <div className="p-4 text-gray-500">No invoice data available</div>;
//   }
//     return (
//       <div className="ag-theme-alpine" style={{ height: '200px', width: '100%' }}>
//         <AgGridReact
//           rowData={monthData}
//           columnDefs={[
//             { headerName: "ID", field: "id" },
//             { headerName: "PO ID", field: "poid" },
//             { headerName: "Invoice Number", field: "invoicenumber" },
//             { headerName: "Start Date", field: "startdate" },
//             { headerName: "End Date", field: "enddate" },
//             { headerName: "Invoice Date", field: "invoicedate" },
//             { headerName: "Invoice Month", field: "invmonth" },
//             { headerName: "Quantity", field: "quantity" },
//             { headerName: "OT Quantity", field: "otquantity" },
//             { headerName: "Rate", field: "rate" },
//             { headerName: "Overtime Rate", field: "overtimerate" },
//             { headerName: "Status", field: "status" },
//             { headerName: "Emp Paid Date", field: "emppaiddate" },
//             { headerName: "Cand Payment Status", field: "candpaymentstatus" },
//             { headerName: "Reminders", field: "reminders" },
//             { headerName: "Amount Expected", field: "amountexpected" },
//             { headerName: "Expected Date", field: "expecteddate" },
//             { headerName: "Amount Received", field: "amountreceived" },
//             { headerName: "Received Date", field: "receiveddate" },
//             { headerName: "Released Date", field: "releaseddate" },
//             { headerName: "Check Number", field: "checknumber" },
//             { headerName: "Invoice URL", field: "invoiceurl" },
//             { headerName: "Check URL", field: "checkurl" },
//             { headerName: "Freq Type", field: "freqtype" },
//             { headerName: "Invoice Net", field: "invoicenet" },
//             { headerName: "Company Name", field: "companyname" },
//             { headerName: "Vendor Fax", field: "vendorfax" },
//             { headerName: "Vendor Phone", field: "vendorphone" },
//             { headerName: "Vendor Email", field: "vendoremail" },
//             { headerName: "Timesheet Email", field: "timsheetemail" },
//             { headerName: "HR Name", field: "hrname" },
//             { headerName: "HR Email", field: "hremail" },
//             { headerName: "HR Phone", field: "hrphone" },
//             { headerName: "Manager Name", field: "managername" },
//             { headerName: "Manager Email", field: "manageremail" },
//             { headerName: "Manager Phone", field: "managerphone" },
//             { headerName: "Secondary Name", field: "secondaryname" },
//             { headerName: "Secondary Email", field: "secondaryemail" },
//             { headerName: "Secondary Phone", field: "secondaryphone" },
//             { headerName: "Candidate Name", field: "candidatename" },
//             { headerName: "Candidate Phone", field: "candidatephone" },
//             { headerName: "Candidate Email", field: "candidateemail" },
//             { headerName: "WRK Email", field: "wrkemail" },
//             { headerName: "WRK Phone", field: "wrkphone" },
//             { headerName: "Recruiter Name", field: "recruitername" },
//             { headerName: "Recruiter Phone", field: "recruiterphone" },
//             { headerName: "Recruiter Email", field: "recruiteremail" },
//             { headerName: "Notes", field: "notes" },
//           ]}
//           defaultColDef={{
//             sortable: true,
//             filter: true,
//             cellStyle: { color: "#333", fontSize: "0.75rem", padding: "1px" },
//             minWidth: 60,
//             maxWidth: 1200,
//           }}
//           rowHeight={30}
//           headerHeight={35}
//         />
//       </div>
//     );
//   };

//   return (
//     <div className="p-4 mt-20 mb-10 mx-auto bg-gray-100 rounded-lg shadow-md relative max-w-7xl">
//       {alertMessage && ( 
//         <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded-md shadow-md z-50">
//           {alertMessage}
//         </div>
//       )}

//       <div className="flex flex-col md:flex-row justify-between items-center mb-4">
//         <h1 className="text-3xl font-bold text-gray-800">Invoice Management</h1>
//       </div>

//       <div className="flex flex-col md:flex-row mb-4 justify-between items-center">
//         <div className="flex w-full md:w-auto mb-2 md:mb-0">
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchValue}
//             onChange={(e) => setSearchValue(e.target.value)}
//             className="border border-gray-300 rounded-md p-2 w-64"
//           />
//           <button
//             onClick={handleSearch}
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md ml-2 transition duration-300 hover:bg-blue-900"
//           >
//             <AiOutlineSearch className="mr-2" /> Search
//           </button>
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
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-48">
//           <span className="text-xl">Loading...</span>
//         </div>
//       ) : (
//         <div
//           className="ag-theme-alpine table-container"
//           style={{ height: "300px", width: "100%", overflowY: "auto" }}
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
//               maxWidth: 1200,
//               width: 150,
//             }}
//             rowHeight={30}
//             headerHeight={35}
//             onRowClicked={handleRowClick}
//             masterDetail={true}
//             detailCellRenderer={DetailCellRenderer}
//             isRowMaster={(rowNode) => {
//               return rowNode.data && selectedMonth === rowNode.data.invmonth;
//             }}
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

// export default ByMonth;



"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AxiosError } from 'axios';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { FaDownload } from "react-icons/fa";
import AddRowModal from "../../modals/bymonth_modals/AddRowByMonth";
import EditRowModal from "../../modals/bymonth_modals/EditRowByMonth";
import ViewRowModal from "../../modals/bymonth_modals/ViewRowByMonth";
import { MdDelete } from "react-icons/md";
import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import {
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlineSearch,
  AiOutlineReload,
} from "react-icons/ai";
import { MdAdd } from "react-icons/md";
import type { ByMonth } from "../../types/index";

jsPDF.prototype.autoTable = autoTable;

const ByMonth = () => {
  const [rowData, setRowData] = useState<ByMonth[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [columnDefs, setColumnDefs] = useState<{ headerName: string; field: string }[]>([]);
  const [paginationPageSize] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalState, setModalState] = useState<{
    add: boolean;
    edit: boolean;
    view: boolean;
  }>({ add: false, edit: false, view: false });
  const [selectedRow, setSelectedRow] = useState<ByMonth | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [monthData, setMonthData] = useState<ByMonth[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
  const gridRef = useRef<AgGridReact>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/invoices/months/`, {
        params: {
          page: currentPage,
          pageSize: paginationPageSize,
        },
        headers: { AuthToken: localStorage.getItem("token") },
      });

      const data = response.data;
      console.log("Fetched Data:", data);
      setRowData(data);
      setTotalRows(data.length);
      setupColumns(data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchByMonths = async (month = null, searchQuery = "") => {
    try {
      const response = await axios.get(`${API_URL}/invoices/month/${month || ''}`, {
        params: {
          page: currentPage,
          pageSize: paginationPageSize,
          search: searchQuery,
        },
        headers: { AuthToken: localStorage.getItem("token") },
      });

      const { data, totalRows } = response.data;
      setRowData(data);
      setTotalRows(totalRows);
      setupColumns(data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleSearch = () => {
    fetchByMonths(null, searchValue);
  };

  const setupColumns = (data: Record<string, unknown>[]) => {
    if (data.length > 0) {
      const columns = Object.keys(data[0]).map((key) => ({
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
        field: key,
      }));
      console.log("Column Definitions:", columns);
      setColumnDefs(columns);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handleRefresh = () => {
    setSearchValue("");
    fetchData();
    window.location.reload();
  };

  const handleAddRow = () =>
    setModalState((prevState) => ({ ...prevState, add: true }));

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

  interface ErrorResponse {
    message: string;
  }

  const handleDeleteRow = async () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        const byMonthId = selectedRows[0].byMonthid || selectedRows[0].id;
        if (byMonthId) {
          const confirmation = window.confirm(
            `Are you sure you want to delete By Month ID ${byMonthId}?`
          );
          if (!confirmation) return;

          try {
            await axios.delete(`${API_URL}/bymonth/delete/${byMonthId}`, {
              headers: { AuthToken: localStorage.getItem("token") },
            });
            alert("By Month deleted successfully.");
            fetchData();
          } catch (error) {
            const axiosError = error as AxiosError;
            alert(
                `Failed to delete By Month: ${
                    (axiosError.response?.data as ErrorResponse)?.message || axiosError.message
                }`
            );
          }
        } else {
          alert("No valid By Month ID found for the selected row.");
        }
      } else {
        setAlertMessage("Please select a row to delete.");
        setTimeout(() => setAlertMessage(null), 3000);
      }
    }
  };

  const handlePageChange = (newPage: number) => setCurrentPage(newPage);

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

  interface RowClickParams {
    data: {
      invmonth?: string;
      [key: string]: string | number | boolean | null | undefined;
    };
  }

  const handleRowClick = async (params: RowClickParams) => {
    const month = params.data.invmonth;
    console.log("Row clicked with data:", params.data);
    console.log("Selected Month:", month);

    if (month) {
      setSelectedMonth(month);
      try {
        const response = await axios.get(`${API_URL}/invoices/month/${month}`, {
          headers: { AuthToken: localStorage.getItem("token") },
        });
        const data = response.data;
        console.log("Fetched Month Data:", data);
        setMonthData(data);
        // Toggle the expanded state
        setExpandedMonths((prev) =>
          new Set(prev).has(month) ? new Set([...prev].filter(m => m !== month)) : new Set([...prev, month])
        );
      } catch (error) {
        console.error("Error loading month data:", error);
      }
    } else {
      console.error("Month is undefined. Please check the data structure.");
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("By Month Data", 20, 10);
    const pdfData = rowData.map((row) => Object.values(row));
    const headers = columnDefs.map((col) => col.headerName);
    autoTable(doc, {
      head: [headers],
      body: pdfData,
      theme: 'grid',
      styles: { fontSize: 5 },
    });
    doc.save("by_month_data.pdf");
  };

  const totalPages = Math.ceil(totalRows / paginationPageSize);
  const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    // <div className="p-4 mt-20 mb-10 mx-auto bg-gray-100 rounded-lg shadow-md relative max-w-7xl">
      <div className="p-4 mt-4 mb-4 mx-auto bg-gray-100 rounded-lg shadow-md relative max-w-7xl h-[600px] overflow-y-auto">

      {alertMessage && (
        <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded-md shadow-md z-50">
          {alertMessage}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Invoice Management</h1>
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
            onClick={handleAddRow}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700"
          >
            <MdAdd className="mr-2" />
          </button>
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
          <button
            onClick={handleDownloadPDF}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700"
          >
            <FaDownload className="mr-2" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <span className="text-xl">Loading...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {rowData.map((row) => (
            <div key={row.id}>
              <div
                className="flex justify-between items-center p-2 bg-gray-200 cursor-pointer"
                onClick={() => handleRowClick({ data: row })}
              >
                <span>{row.invmonth}</span>
                <span
                  className="text-blue-600 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedMonths((prev) =>
                      new Set(prev).has(row.invmonth) ? new Set([...prev].filter(m => m !== row.invmonth)) : new Set([...prev, row.invmonth])
                    );
                  }}
                >
                  {expandedMonths.has(row.invmonth) ? "-" : "+"}
                </span>
              </div>
              {expandedMonths.has(row.invmonth) && (
                <div className="overflow-x-auto overflow-y-auto max-h-[400px] text-xs border border-gray-300 rounded-md">
                  <table className="min-w-full bg-white">
                    <thead className="sticky top-0 bg-gray-100 z-10">
                      <tr>
                        <th className="px-4 py-2 border-b border-r border-gray-300 whitespace-nowrap w-24">ID</th>
                        <th className="px-4 py-2 border-b border-gray-300 w-34">POID</th>
                        <th className="px-4 py-2 border-b border-gray-300 w-42">Invoice Number</th>
                        <th className="px-4 py-2 border-b border-gray-300">Start Date</th>
                        <th className="px-4 py-2 border-b border-gray-300">End Date</th>
                        <th className="px-4 py-2 border-b border-gray-300">Invoice Date</th>
                        <th className="px-4 py-2 border-b border-gray-300">Invoice Month</th>
                        <th className="px-4 py-2 border-b border-gray-300">Quantity</th>
                        <th className="px-4 py-2 border-b border-gray-300">OT Quantity</th>
                        <th className="px-4 py-2 border-b border-gray-300">Rate</th>
                        <th className="px-4 py-2 border-b border-gray-300">OT Rate</th>
                        <th className="px-4 py-2 border-b border-gray-300">Status</th>
                        <th className="px-4 py-2 border-b border-gray-300">Emp Paid Date</th>
                        <th className="px-4 py-2 border-b border-gray-300">Cand Payment Status</th>
                        <th className="px-4 py-2 border-b border-gray-300">Reminders</th>
                        <th className="px-4 py-2 border-b border-gray-300">Amount Expected</th>
                        <th className="px-4 py-2 border-b border-gray-300">Expected Date</th>
                        <th className="px-4 py-2 border-b border-gray-300">Amount Received</th>
                        <th className="px-4 py-2 border-b border-gray-300">Received Date</th>
                        <th className="px-4 py-2 border-b border-gray-300">Released Date</th>
                        <th className="px-4 py-2 border-b border-gray-300">Check Number</th>
                        <th className="px-4 py-2 border-b border-gray-300">Invoice URL</th>
                        <th className="px-4 py-2 border-b border-gray-300">Check URL</th>
                        <th className="px-4 py-2 border-b border-gray-300">Freq Type</th>
                        <th className="px-4 py-2 border-b border-gray-300">Invoice Net</th>
                        <th className="px-4 py-2 border-b border-gray-300">Company Name</th>
                        <th className="px-4 py-2 border-b border-gray-300">Vendor Fax</th>
                        <th className="px-4 py-2 border-b border-gray-300">Vendor Phone</th>
                        <th className="px-4 py-2 border-b border-gray-300">Vendor Email</th>
                        <th className="px-4 py-2 border-b border-gray-300">Timesheet Email</th>
                        <th className="px-4 py-2 border-b border-gray-300">HR Name</th>
                        <th className="px-4 py-2 border-b border-gray-300">HR Email</th>
                        <th className="px-4 py-2 border-b border-gray-300">HR Phone</th>
                        <th className="px-4 py-2 border-b border-gray-300">Manager Name</th>
                        <th className="px-4 py-2 border-b border-gray-300">Manager Email</th>
                        <th className="px-4 py-2 border-b border-gray-300">Manager Phone</th>
                        <th className="px-4 py-2 border-b border-gray-300">Secondary Name</th>
                        <th className="px-4 py-2 border-b border-gray-300">Secondary Email</th>
                        <th className="px-4 py-2 border-b border-gray-300">Secondary Phone</th>
                        <th className="px-4 py-2 border-b border-gray-300">Candidate Name</th>
                        <th className="px-4 py-2 border-b border-gray-300">Candidate Phone</th>
                        <th className="px-4 py-2 border-b border-gray-300">Candidate Email</th>
                        <th className="px-4 py-2 border-b border-gray-300">WRK Email</th>
                        <th className="px-4 py-2 border-b border-gray-300">WRK Phone</th>
                        <th className="px-4 py-2 border-b border-gray-300">Recruiter Name</th>
                        <th className="px-4 py-2 border-b border-gray-300">Recruiter Phone</th>
                        <th className="px-4 py-2 border-b border-gray-300">Recruiter Email</th>
                        <th className="px-4 py-2 border-b border-gray-300">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthData.map((data) => (
                        <tr key={data.id} className="hover:bg-gray-50 even:bg-gray-50">
                          <td className="px-4 py-1 border-b border-r border-gray-300 whitespace-nowrap">{data.id}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.poid}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.invoicenumber}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.startdate}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.enddate}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.invoicedate}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.invmonth}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.quantity}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.otquantity}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.rate}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.overtimerate}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.status}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.emppaiddate}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.candpaymentstatus}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.reminders}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.amountexpected}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.expecteddate}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.amountreceived}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.receiveddate}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.releaseddate}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.checknumber}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.invoiceurl}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.checkurl}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.freqtype}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.invoicenet}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.companyname}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.vendorfax}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.vendorphone}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.vendoremail}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.timsheetemail}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.hrname}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.hremail}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.hrphone}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.managername}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.manageremail}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.managerphone}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.secondaryname}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.secondaryemail}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.secondaryphone}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.candidatename}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.candidatephone}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.candidateemail}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.wrkemail}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.wrkphone}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.recruitername}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.recruiterphone}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.recruiteremail}</td>
                          <td className="px-4 py-2 border-b border-gray-300">{data.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mt-2 text-xs">
        <div className="flex items-center">
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
          onRequestClose={() => setModalState((prev) => ({ ...prev, edit: false }))}
          rowData={selectedRow}
          onSave={fetchData}
        />
      )}
      {modalState.view && selectedRow && (
        <ViewRowModal
          isOpen={modalState.view}
          onClose={() => setModalState((prev) => ({ ...prev, view: false }))}
          rowData={selectedRow}
        />
      )}
    </div>
  );
};

export default ByMonth;


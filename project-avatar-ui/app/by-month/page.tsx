// // // "use client";

// // // import React, { useState, useEffect, useRef } from "react";
// // // import axios from "axios";
// // // import { jsPDF } from 'jspdf';
// // // import autoTable from 'jspdf-autotable';
// // // import { AxiosError } from 'axios';
// // // import { AgGridReact } from "ag-grid-react";
// // // import "ag-grid-community/styles/ag-grid.css";
// // // import "ag-grid-community/styles/ag-theme-alpine.css";
// // // import { FaDownload } from "react-icons/fa";
// // // import AddRowModal from "../../modals/bymonth_modals/AddRowByMonth";
// // // import EditRowModal from "../../modals/bymonth_modals/EditRowByMonth";
// // // import ViewRowModal from "../../modals/bymonth_modals/ViewRowByMonth";
// // // import { MdDelete } from "react-icons/md";
// // // import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
// // // import {
// // //   AiOutlineEdit,
// // //   AiOutlineEye,
// // //   AiOutlineSearch,
// // //   AiOutlineReload,
// // // } from "react-icons/ai";
// // // import { MdAdd } from "react-icons/md";
// // // import type { ByMonth } from "../../types/index"; // Use type-only import

// // // jsPDF.prototype.autoTable = autoTable;

// // // const ByMonth = () => {
// // //   const [rowData, setRowData] = useState<ByMonth[]>([]);
// // //   const [alertMessage, setAlertMessage] = useState<string | null>(null);
// // //   const [columnDefs, setColumnDefs] = useState<{ headerName: string; field: string }[]>([]);
// // //   const [paginationPageSize] = useState<number>(100);
// // //   const [currentPage, setCurrentPage] = useState<number>(1);
// // //   const [totalRows, setTotalRows] = useState<number>(0);
// // //   const [loading, setLoading] = useState<boolean>(false);
// // //   const [modalState, setModalState] = useState<{
// // //     add: boolean;
// // //     edit: boolean;
// // //     view: boolean;
// // //   }>({ add: false, edit: false, view: false });
// // //   const [selectedRow, setSelectedRow] = useState<ByMonth | null>(null);
// // //   const [searchValue, setSearchValue] = useState<string>("");
// // //   const [monthData, setMonthData] = useState<ByMonth[]>([]);
// // //   const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
// // //   const gridRef = useRef<AgGridReact>(null);

// // //   const API_URL = process.env.NEXT_PUBLIC_API_URL;

// // //   const fetchData = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const response = await axios.get(`${API_URL}/invoices/months/`, {
// // //         params: {
// // //           page: currentPage,
// // //           pageSize: paginationPageSize,
// // //         },
// // //         headers: { AuthToken: localStorage.getItem("token") },
// // //       });

// // //       const data = response.data;
// // //       console.log("Fetched Data:", data); // Log the data
// // //       setRowData(data);
// // //       setTotalRows(data.length); // Assuming totalRows is the length of the data array
// // //       setupColumns(data);
// // //     } catch (error) {
// // //       console.error("Error loading data:", error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const fetchByMonths = async (month = null, searchQuery = "") => {
// // //     try {
// // //       const response = await axios.get(`${API_URL}/invoices/month/${month || ''}`, {
// // //         params: {
// // //           page: currentPage,
// // //           pageSize: paginationPageSize,
// // //           search: searchQuery,
// // //         },
// // //         headers: { AuthToken: localStorage.getItem("token") },
// // //       });

// // //       const { data, totalRows } = response.data;
// // //       setRowData(data);
// // //       setTotalRows(totalRows);
// // //       setupColumns(data);
// // //     } catch (error) {
// // //       console.error("Error loading data:", error);
// // //     }
// // //   };

// // //   const handleSearch = () => {
// // //     fetchByMonths(null, searchValue);
// // //   };

// // //   const setupColumns = (data: Record<string, unknown>[]) => {
// // //     if (data.length > 0) {
// // //       const columns = Object.keys(data[0]).map((key) => ({
// // //         headerName: key.charAt(0).toUpperCase() + key.slice(1),
// // //         field: key,
// // //       }));
// // //       console.log("Column Definitions:", columns);
// // //       setColumnDefs(columns);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchData();
// // //   }, [currentPage]);

// // //   const handleRefresh = () => {
// // //     setSearchValue("");
// // //     fetchData();
// // //     window.location.reload();
// // //   };

// // //   const handleAddRow = () =>
// // //     setModalState((prevState) => ({ ...prevState, add: true }));

// // //   const handleEditRow = () => {
// // //     if (gridRef.current) {
// // //       const selectedRows = gridRef.current.api.getSelectedRows();
// // //       if (selectedRows.length > 0) {
// // //         setSelectedRow(selectedRows[0]);
// // //         setModalState((prevState) => ({ ...prevState, edit: true }));
// // //       } else {
// // //         setAlertMessage("Please select a row to edit."); // Set alert message
// // //         setTimeout(() => setAlertMessage(null), 3000); // Clear alert message after 3 seconds
// // //       }
// // //     }
// // //   };

// // //   interface ErrorResponse {
// // //     message: string;
// // //     // Add other properties if needed
// // //   }

// // //   const handleDeleteRow = async () => {
// // //     if (gridRef.current) {
// // //       const selectedRows = gridRef.current.api.getSelectedRows();
// // //       if (selectedRows.length > 0) {
// // //         const byMonthId = selectedRows[0].byMonthid || selectedRows[0].id;
// // //         if (byMonthId) {
// // //           const confirmation = window.confirm(
// // //             `Are you sure you want to delete By Month ID ${byMonthId}?`
// // //           );
// // //           if (!confirmation) return;

// // //           try {
// // //             await axios.delete(`${API_URL}/bymonth/delete/${byMonthId}`, {
// // //               headers: { AuthToken: localStorage.getItem("token") },
// // //             });
// // //             alert("By Month deleted successfully.");
// // //             fetchData();
// // //           } catch (error) {
// // //             const axiosError = error as AxiosError;
// // //             alert(
// // //                 `Failed to delete By Month: ${
// // //                     (axiosError.response?.data as ErrorResponse)?.message || axiosError.message
// // //                 }`
// // //             );
// // //           }
// // //         } else {
// // //           alert("No valid By Month ID found for the selected row.");
// // //         }
// // //       } else {
// // //         setAlertMessage("Please select a row to delete."); // Set alert message
// // //         setTimeout(() => setAlertMessage(null), 3000); // Clear alert message after 3 seconds
// // //       }
// // //     }
// // //   };

// // //   const handlePageChange = (newPage: number) => setCurrentPage(newPage);

// // //   const handleViewRow = () => {
// // //     if (gridRef.current) {
// // //       const selectedRows = gridRef.current.api.getSelectedRows();
// // //       if (selectedRows.length > 0) {
// // //         setSelectedRow(selectedRows[0]); // Set the selected row data
// // //         setModalState((prevState) => ({ ...prevState, view: true })); // Open the view modal
// // //       } else {
// // //         setAlertMessage("Please select a row to view."); // Set alert message
// // //         setTimeout(() => setAlertMessage(null), 3000); // Clear alert message after 3 seconds
// // //       }
// // //     }
// // //   };

// // //     interface RowClickParams {
// // //       data: {
// // //         invmonth?: string;
// // //         [key: string]: string | number | boolean | null | undefined; // Specify possible types for additional properties
// // //       };
// // //     }

// // //     const handleRowClick = async (params: RowClickParams) => {
// // //       const month = params.data.invmonth; // Ensure 'invmonth' is the correct field name
// // //       console.log("Row clicked with data:", params.data); // Log the entire row data
// // //       console.log("Selected Month:", month); // Log the selected month

// // //       if (month) {
// // //         setSelectedMonth(month);
// // //         try {
// // //           const response = await axios.get(`${API_URL}/invoices/month/${month}`, {
// // //             headers: { AuthToken: localStorage.getItem("token") },
// // //           });
// // //           const data = response.data; // Ensure this matches your API response structure
// // //           console.log("Fetched Month Data:", data); // Log the fetched data
// // //           setMonthData(data);
// // //         } catch (error) {
// // //           console.error("Error loading month data:", error);
// // //         }
// // //       } else {
// // //         console.error("Month is undefined. Please check the data structure.");
// // //       }
// // //     };

// // //   const handleDownloadPDF = () => {
// // //     const doc = new jsPDF();
// // //     doc.text("By Month Data", 20, 10);
// // //     const pdfData = rowData.map((row) => Object.values(row));
// // //     const headers = columnDefs.map((col) => col.headerName);
// // //     autoTable(doc, {
// // //       head: [headers],
// // //       body: pdfData,
// // //       theme: 'grid',
// // //       styles: { fontSize: 5 },
// // //     });
// // //     doc.save("by_month_data.pdf");
// // //   };

// // //   const totalPages = Math.ceil(totalRows / paginationPageSize);
// // //   const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

// // //   return (
// // //     <div className="p-4 mt-20 mb-10 mx-auto bg-gray-100 rounded-lg shadow-md relative max-w-7xl">
// // //       {alertMessage && ( 
// // //         <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded-md shadow-md z-50">
// // //           {alertMessage}
// // //         </div>
// // //       )}

// // //       <div className="flex flex-col md:flex-row justify-between items-center mb-4">
// // //         <h1 className="text-3xl font-bold text-gray-800">Invoice Management</h1>
// // //       </div>

// // //       <div className="flex flex-col md:flex-row mb-4 justify-between items-center">
// // //         <div className="flex w-full md:w-auto mb-2 md:mb-0">
// // //           <input
// // //             type="text"
// // //             placeholder="Search..."
// // //             value={searchValue}
// // //             onChange={(e) => setSearchValue(e.target.value)}
// // //             className="border border-gray-300 rounded-md p-2 w-64"
// // //           />
// // //           <button
// // //             onClick={handleSearch}
// // //             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md ml-2 transition duration-300 hover:bg-blue-900"
// // //           >
// // //             <AiOutlineSearch className="mr-2" /> Search
// // //           </button>
// // //         </div>

// // //         <div className="flex space-x-2">
// // //           <button
// // //             onClick={handleAddRow}
// // //             className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700"
// // //           >
// // //             <MdAdd className="mr-2" />
// // //           </button>
// // //           <button
// // //             onClick={handleEditRow}
// // //             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700"
// // //           >
// // //             <AiOutlineEdit className="mr-2" />
// // //           </button>
// // //           <button
// // //             onClick={handleDeleteRow}
// // //             className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700"
// // //           >
// // //             <MdDelete className="mr-2" />
// // //           </button>
// // //           <button
// // //             onClick={handleViewRow}
// // //             className="flex items-center px-4 py-2 bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-700"
// // //           >
// // //             <AiOutlineEye className="mr-2" />
// // //           </button>
// // //           <button
// // //             onClick={handleRefresh}
// // //             className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md transition duration-300 hover:bg-gray-900"
// // //           >
// // //             <AiOutlineReload className="mr-2" />
// // //           </button>
// // //           <button
// // //             onClick={handleDownloadPDF}
// // //             className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700"
// // //           >
// // //             <FaDownload className="mr-2" />
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {loading ? (
// // //         <div className="flex justify-center items-center h-48">
// // //           <span className="text-xl">Loading...</span>
// // //         </div>
// // //       ) : (
// // //         <div
// // //           className="ag-theme-alpine table-container"
// // //           style={{ height: "300px", width: "100%", overflowY: "auto" }}
// // //         >
// // //           <AgGridReact
// // //             ref={gridRef}
// // //             rowData={rowData}
// // //             columnDefs={columnDefs}
// // //             pagination={false}
// // //             domLayout="normal"
// // //             rowSelection="multiple"
// // //             defaultColDef={{
// // //               sortable: true,
// // //               filter: true,
// // //               cellStyle: { color: "#333", fontSize: "0.75rem", padding: "1px" },
// // //               minWidth: 60,
// // //               maxWidth: 1200,
// // //               width: 150,
              
// // //             }}
// // //             rowHeight={30}
// // //             headerHeight={35}
// // //             onRowClicked={handleRowClick} // Ensure this is correctly set
// // //           />
// // //         </div>
// // //       )}

// // //       {selectedMonth && (
// // //         <div className="mt-4">
// // //           <h2 className="text-2xl font-bold text-gray-800">Data for {selectedMonth}</h2>
// // //           <div
// // //             className="ag-theme-alpine"
// // //             style={{ height: "200px", width: "100%", overflowY: "auto" }}
// // //           >
// // //             <AgGridReact
// // //               rowData={monthData}
// // //               columnDefs={[
// // //                 { headerName: "ID", field: "id" },
// // //                 { headerName: "PO ID", field: "poid" },
// // //                 { headerName: "Invoice Number", field: "invoicenumber" },
// // //                 { headerName: "Start Date", field: "startdate" },
// // //                 { headerName: "End Date", field: "enddate" },
// // //                 { headerName: "Invoice Date", field: "invoicedate" },
// // //                 { headerName: "Invoice Month", field: "invmonth" },
// // //                 { headerName: "Quantity", field: "quantity" },
// // //                 { headerName: "OT Quantity", field: "otquantity" },
// // //                 { headerName: "Rate", field: "rate" },
// // //                 { headerName: "Overtime Rate", field: "overtimerate" },
// // //                 { headerName: "Status", field: "status" },
// // //                 { headerName: "Emp Paid Date", field: "emppaiddate" },
// // //                 { headerName: "Cand Payment Status", field: "candpaymentstatus" },
// // //                 { headerName: "Reminders", field: "reminders" },
// // //                 { headerName: "Amount Expected", field: "amountexpected" },
// // //                 { headerName: "Expected Date", field: "expecteddate" },
// // //                 { headerName: "Amount Received", field: "amountreceived" },
// // //                 { headerName: "Received Date", field: "receiveddate" },
// // //                 { headerName: "Released Date", field: "releaseddate" },
// // //                 { headerName: "Check Number", field: "checknumber" },
// // //                 { headerName: "Invoice URL", field: "invoiceurl" },
// // //                 { headerName: "Check URL", field: "checkurl" },
// // //                 { headerName: "Freq Type", field: "freqtype" },
// // //                 { headerName: "Invoice Net", field: "invoicenet" },
// // //                 { headerName: "Company Name", field: "companyname" },
// // //                 { headerName: "Vendor Fax", field: "vendorfax" },
// // //                 { headerName: "Vendor Phone", field: "vendorphone" },
// // //                 { headerName: "Vendor Email", field: "vendoremail" },
// // //                 { headerName: "Timesheet Email", field: "timsheetemail" },
// // //                 { headerName: "HR Name", field: "hrname" },
// // //                 { headerName: "HR Email", field: "hremail" },
// // //                 { headerName: "HR Phone", field: "hrphone" },
// // //                 { headerName: "Manager Name", field: "managername" },
// // //                 { headerName: "Manager Email", field: "manageremail" },
// // //                 { headerName: "Manager Phone", field: "managerphone" },
// // //                 { headerName: "Secondary Name", field: "secondaryname" },
// // //                 { headerName: "Secondary Email", field: "secondaryemail" },
// // //                 { headerName: "Secondary Phone", field: "secondaryphone" },
// // //                 { headerName: "Candidate Name", field: "candidatename" },
// // //                 { headerName: "Candidate Phone", field: "candidatephone" },
// // //                 { headerName: "Candidate Email", field: "candidateemail" },
// // //                 { headerName: "WRK Email", field: "wrkemail" },
// // //                 { headerName: "WRK Phone", field: "wrkphone" },
// // //                 { headerName: "Recruiter Name", field: "recruitername" },
// // //                 { headerName: "Recruiter Phone", field: "recruiterphone" },
// // //                 { headerName: "Recruiter Email", field: "recruiteremail" },
// // //                 { headerName: "Notes", field: "notes" },
// // //               ]}
// // //               pagination={false}
// // //               domLayout="normal"
// // //               defaultColDef={{
// // //                 sortable: true,
// // //                 filter: true,
// // //                 cellStyle: { color: "#333", fontSize: "0.75rem", padding: "1px" },
// // //                 minWidth: 60,
// // //                 maxWidth: 1200,
// // //               }}
// // //               rowHeight={30}
// // //               headerHeight={35}
// // //             />
// // //           </div>
// // //         </div>
// // //       )}

// // //       <div className="flex justify-between mt-4">
// // //         <div className="flex items-center">
// // //           <button
// // //             onClick={() => handlePageChange(1)}
// // //             disabled={currentPage === 1}
// // //             className="p-2 disabled:opacity-50"
// // //           >
// // //             <FaAngleDoubleLeft />
// // //           </button>
// // //           <button
// // //             onClick={() => handlePageChange(currentPage - 1)}
// // //             disabled={currentPage === 1}
// // //             className="p-2 disabled:opacity-50"
// // //           >
// // //             <FaChevronLeft />
// // //           </button>
// // //           {pageOptions.map((page) => (
// // //             <button
// // //               key={page}
// // //               onClick={() => handlePageChange(page)}
// // //               className={`px-2 py-1 rounded-md ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
// // //             >
// // //               {page}
// // //             </button>
// // //           ))}
// // //           <button
// // //             onClick={() => handlePageChange(currentPage + 1)}
// // //             disabled={currentPage === totalPages}
// // //             className="p-2 disabled:opacity-50"
// // //           >
// // //             <FaChevronRight />
// // //           </button>
// // //           <button
// // //             onClick={() => handlePageChange(totalPages)}
// // //             disabled={currentPage === totalPages}
// // //             className="p-2 disabled:opacity-50"
// // //           >
// // //             <FaAngleDoubleRight />
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {modalState.add && (
// // //         <AddRowModal
// // //           isOpen={modalState.add}
// // //           onClose={() => setModalState((prev) => ({ ...prev, add: false }))}
// // //           refreshData={fetchData}
// // //         />
// // //       )}
// // //       {modalState.edit && selectedRow && (
// // //         <EditRowModal
// // //           isOpen={modalState.edit}
// // //           onRequestClose={() => setModalState((prev) => ({ ...prev, edit: false }))}
// // //           rowData={selectedRow}
// // //           onSave={fetchData}
// // //         />
// // //       )}
// // //       {modalState.view && selectedRow && (
// // //         <ViewRowModal
// // //           isOpen={modalState.view}
// // //           onClose={() => setModalState((prev) => ({ ...prev, view: false }))}
// // //           rowData={selectedRow}
// // //         />
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default ByMonth;


// // // "use client";

// // // import React, { useState, useEffect, useRef } from "react";
// // // import axios from "axios";
// // // import { jsPDF } from 'jspdf';
// // // import autoTable from 'jspdf-autotable';
// // // import { AxiosError } from 'axios';
// // // import { AgGridReact } from "ag-grid-react";
// // // import "ag-grid-community/styles/ag-grid.css";
// // // import "ag-grid-community/styles/ag-theme-alpine.css";
// // // import { FaDownload } from "react-icons/fa";
// // // import AddRowModal from "../../modals/bymonth_modals/AddRowByMonth";
// // // import EditRowModal from "../../modals/bymonth_modals/EditRowByMonth";
// // // import ViewRowModal from "../../modals/bymonth_modals/ViewRowByMonth";
// // // import { MdDelete } from "react-icons/md";
// // // import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
// // // import {
// // //   AiOutlineEdit,
// // //   AiOutlineEye,
// // //   AiOutlineSearch,
// // //   AiOutlineReload,
// // // } from "react-icons/ai";
// // // import { MdAdd } from "react-icons/md";
// // // import type { ByMonth } from "../../types/index";

// // // jsPDF.prototype.autoTable = autoTable;

// // // const ByMonth = () => {
// // //   const [rowData, setRowData] = useState<ByMonth[]>([]);
// // //   const [alertMessage, setAlertMessage] = useState<string | null>(null);
// // //   const [columnDefs, setColumnDefs] = useState<{ headerName: string; field: string }[]>([]);
// // //   const [paginationPageSize] = useState<number>(100);
// // //   const [currentPage, setCurrentPage] = useState<number>(1);
// // //   const [totalRows, setTotalRows] = useState<number>(0);
// // //   const [loading, setLoading] = useState<boolean>(false);
// // //   const [modalState, setModalState] = useState<{
// // //     add: boolean;
// // //     edit: boolean;
// // //     view: boolean;
// // //   }>({ add: false, edit: false, view: false });
// // //   const [selectedRow, setSelectedRow] = useState<ByMonth | null>(null);
// // //   const [searchValue, setSearchValue] = useState<string>("");
// // //   const [monthData, setMonthData] = useState<{ [key: string]: ByMonth[] }>({});
// // //   const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
// // //   const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
// // //   const [selectedSubRow, setSelectedSubRow] = useState<ByMonth | null>(null);
// // //   const gridRef = useRef<AgGridReact>(null);

// // //   const API_URL = process.env.NEXT_PUBLIC_API_URL;

// // //   const fetchData = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const response = await axios.get(`${API_URL}/invoices/months/`, {
// // //         params: {
// // //           page: currentPage,
// // //           pageSize: paginationPageSize,
// // //         },
// // //         headers: { AuthToken: localStorage.getItem("token") },
// // //       });

// // //       const data = response.data;
// // //       console.log("Fetched Data:", data);
// // //       setRowData(data);
// // //       setTotalRows(data.length);
// // //       setupColumns(data);
// // //     } catch (error) {
// // //       // console.error("Error loading data:", error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const fetchByMonths = async (month = null, searchQuery = "") => {
// // //     try {
// // //       const response = await axios.get(`${API_URL}/invoices/month/${month || ''}`, {
// // //         params: {
// // //           page: currentPage,
// // //           pageSize: paginationPageSize,
// // //           search: searchQuery,
// // //         },
// // //         headers: { AuthToken: localStorage.getItem("token") },
// // //       });

// // //       const { data, totalRows } = response.data;
// // //       setRowData(data);
// // //       setTotalRows(totalRows);
// // //       setupColumns(data);
// // //     } catch (error) {
// // //       console.error("Error loading data:", error);
// // //     }
// // //   };

// // //   const handleSearch = () => {
// // //     fetchByMonths(null, searchValue);
// // //   };

// // //   const setupColumns = (data: Record<string, unknown>[]) => {
// // //     if (data.length > 0) {
// // //       const columns = Object.keys(data[0]).map((key) => ({
// // //         headerName: key.charAt(0).toUpperCase() + key.slice(1),
// // //         field: key,
// // //       }));
// // //       console.log("Column Definitions:", columns);
// // //       setColumnDefs(columns);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchData();
// // //   }, [currentPage]);

// // //   const handleRefresh = () => {
// // //     setSearchValue("");
// // //     setCurrentPage(1); // Reset to the first page
// // //     setSelectedMonth(null); // Reset selected month
// // //     setExpandedMonths(new Set()); // Reset expanded months
// // //     setSelectedSubRow(null); // Reset selected subrow
// // //     fetchData(); // Refetch the data
// // //   };

// // //   const handleAddRow = () =>
// // //     setModalState((prevState) => ({ ...prevState, add: true }));

// // //   const handleEditRow = () => {
// // //     if (selectedSubRow) {
// // //       setSelectedRow(selectedSubRow);
// // //       setModalState((prevState) => ({ ...prevState, edit: true }));
// // //     } else {
// // //       setAlertMessage("Please select a row to edit.");
// // //       setTimeout(() => setAlertMessage(null), 3000);
// // //     }
// // //   };

// // //   interface ErrorResponse {
// // //     message: string;
// // //   }

// // //   const handleDeleteRow = async () => {
// // //     if (selectedSubRow) {
// // //       const invoiceId = selectedSubRow.id;
// // //       if (invoiceId) {
// // //         const confirmation = window.confirm(
// // //           `Are you sure you want to delete invoice ID ${invoiceId}?`
// // //         );
// // //         if (!confirmation) return;
  
// // //         try {
// // //           setLoading(true);
// // //           const response = await axios.delete(
// // //             `${API_URL}/invoices/${invoiceId}`,
// // //             {
// // //               headers: { AuthToken: localStorage.getItem("token") },
// // //             }
// // //           );
  
// // //           // Show success message
// // //           setAlertMessage("Invoice deleted successfully.");
// // //           setTimeout(() => setAlertMessage(null), 3000);
  
// // //           // Refresh the appropriate data based on current view
// // //           if (selectedMonth) {
// // //             // If we're viewing a specific month, refresh that month's data
// // //             await fetchMonthData(selectedMonth);
// // //           } else {
// // //             // Otherwise refresh the main data
// // //             await fetchData();
// // //           }
  
// // //           // Clear the selected row
// // //           setSelectedSubRow(null);
// // //         } catch (error) {
// // //           const axiosError = error as AxiosError<{ error?: string }>;
// // //           setAlertMessage(
// // //             `Failed to delete invoice: ${
// // //               axiosError.response?.data?.error || axiosError.message
// // //             }`
// // //           );
// // //           setTimeout(() => setAlertMessage(null), 3000);
// // //         } finally {
// // //           setLoading(false);
// // //         }
// // //       } else {
// // //         setAlertMessage("No valid invoice ID found for the selected row.");
// // //         setTimeout(() => setAlertMessage(null), 3000);
// // //       }
// // //     } else {
// // //       setAlertMessage("Please select a row to delete.");
// // //       setTimeout(() => setAlertMessage(null), 3000);
// // //     }
// // //   };
// // //   const handlePageChange = (newPage: number) => setCurrentPage(newPage);

// // //   const handleViewRow = () => {
// // //     if (selectedSubRow) {
// // //       setSelectedRow(selectedSubRow);
// // //       setModalState((prevState) => ({ ...prevState, view: true }));
// // //     } else {
// // //       setAlertMessage("Please select a row to view.");
// // //       setTimeout(() => setAlertMessage(null), 3000);
// // //     }
// // //   };

// // //   const fetchMonthData = async (month: string) => {
// // //     try {
// // //       const response = await axios.get(`${API_URL}/invoices/month/${month}`, {
// // //         headers: { AuthToken: localStorage.getItem("token") },
// // //       });
// // //       const data = response.data;
// // //       console.log("Fetched Month Data:", data);
// // //       setMonthData(prev => ({ ...prev, [month]: data }));
// // //     } catch (error) {
// // //       console.error("Error loading month data:", error);
// // //     }
// // //   };

// // //   const handleRowClick = async (month: string) => {
// // //     setSelectedMonth(month);
// // //     setSelectedSubRow(null); // Reset selected subrow when changing months
    
// // //     // Toggle the expanded state
// // //     setExpandedMonths((prev) => {
// // //       const newSet = new Set(prev);
// // //       if (newSet.has(month)) {
// // //         newSet.delete(month);
// // //       } else {
// // //         newSet.add(month);
// // //         // Only fetch data if we don't already have it
// // //         if (!monthData[month]) {
// // //           fetchMonthData(month);
// // //         }
// // //       }
// // //       return newSet;
// // //     });
// // //   };

// // //   const handleSubRowClick = (row: ByMonth) => {
// // //     setSelectedSubRow(row);
// // //     console.log("Selected SubRow:", row);
// // //   };

// // //   const handleDownloadPDF = () => {
// // //     const doc = new jsPDF();
// // //     doc.text("By Month Data", 20, 10);
// // //     const pdfData = rowData.map((row) => Object.values(row));
// // //     const headers = columnDefs.map((col) => col.headerName);
// // //     autoTable(doc, {
// // //       head: [headers],
// // //       body: pdfData,
// // //       theme: 'grid',
// // //       styles: { fontSize: 5 },
// // //     });
// // //     doc.save("by_month_data.pdf");
// // //   };

// // //   const totalPages = Math.ceil(totalRows / paginationPageSize);
// // //   const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

// // //   return (
// // //     <div className="p-4 mt-4 mb-4 mx-auto bg-gray-100 rounded-lg shadow-md relative max-w-7xl h-[600px] overflow-y-auto">
// // //       {alertMessage && (
// // //         <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded-md shadow-md z-50">
// // //           {alertMessage}
// // //         </div>
// // //       )}

// // //       <div className="flex flex-col md:flex-row justify-between items-center mb-4">
// // //         <h1 className="text-3xl font-bold text-gray-800">Invoice Management</h1>
// // //       </div>

// // //       <div className="flex flex-col md:flex-row mb-4 justify-between items-center">
// // //         <div className="flex w-full md:w-auto mb-2 md:mb-0">
// // //           <input
// // //             type="text"
// // //             placeholder="Search..."
// // //             value={searchValue}
// // //             onChange={(e) => setSearchValue(e.target.value)}
// // //             className="border border-gray-300 rounded-md p-2 w-64"
// // //           />
// // //           <button
// // //             onClick={handleSearch}
// // //             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md ml-2 transition duration-300 hover:bg-blue-900"
// // //           >
// // //             <AiOutlineSearch className="mr-2" /> Search
// // //           </button>
// // //         </div>

// // //         <div className="flex space-x-2">
// // //           <button
// // //             onClick={handleAddRow}
// // //             className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700"
// // //           >
// // //             <MdAdd className="mr-2" />
// // //           </button>
// // //           <button
// // //             onClick={handleEditRow}
// // //             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700"
// // //           >
// // //             <AiOutlineEdit className="mr-2" />
// // //           </button>
// // //           <button
// // //             onClick={handleDeleteRow}
// // //             className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700"
// // //           >
// // //             <MdDelete className="mr-2" />
// // //           </button>
// // //           <button
// // //             onClick={handleViewRow}
// // //             className="flex items-center px-4 py-2 bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-700"
// // //           >
// // //             <AiOutlineEye className="mr-2" />
// // //           </button>
// // //           <button
// // //             onClick={handleRefresh}
// // //             className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md transition duration-300 hover:bg-gray-900"
// // //           >
// // //             <AiOutlineReload className="mr-2" />
// // //           </button>
// // //           <button
// // //             onClick={handleDownloadPDF}
// // //             className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700"
// // //           >
// // //             <FaDownload className="mr-2" />
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {loading ? (
// // //         <div className="flex justify-center items-center h-48">
// // //           <span className="text-xl">Loading...</span>
// // //         </div>
// // //       ) : (
// // //         <div className="space-y-4">
// // //           {rowData.map((row) => (
// // //             <div key={row.invmonth}>
// // //               <div
// // //                 className="flex justify-between items-center p-2 bg-gray-200 cursor-pointer"
// // //                 onClick={() => handleRowClick(row.invmonth)}
// // //               >
// // //                 <span>{row.invmonth}</span>
// // //                 <span
// // //                   className="text-blue-600 cursor-pointer"
// // //                   onClick={(e) => {
// // //                     e.stopPropagation();
// // //                     handleRowClick(row.invmonth);
// // //                   }}
// // //                 >
// // //                   {expandedMonths.has(row.invmonth) ? "-" : "+"}
// // //                 </span>
// // //               </div>
// // //               {expandedMonths.has(row.invmonth) && (
// // //                 <div className="overflow-x-auto overflow-y-auto max-h-[400px] text-xs border border-gray-300 rounded-md">
// // //                   <table className="min-w-full bg-white">
// // //                     <thead className="sticky top-0 bg-gray-100 z-10">
// // //                       <tr>
// // //                         <th className="px-4 py-2 border-b border-r border-gray-300 whitespace-nowrap w-24">ID</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300 w-34">POID</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300 w-42">Invoice Number</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Start Date</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">End Date</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Invoice Date</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Invoice Month</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Quantity</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">OT Quantity</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Rate</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">OT Rate</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Status</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Emp Paid Date</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Cand Payment Status</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Reminders</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Amount Expected</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Expected Date</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Amount Received</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Received Date</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Released Date</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Check Number</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Invoice URL</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Check URL</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Freq Type</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Invoice Net</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Company Name</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Vendor Fax</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Vendor Phone</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Vendor Email</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Timesheet Email</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">HR Name</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">HR Email</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">HR Phone</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Manager Name</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Manager Email</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Manager Phone</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Secondary Name</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Secondary Email</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Secondary Phone</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Candidate Name</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Candidate Phone</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Candidate Email</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">WRK Email</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">WRK Phone</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Recruiter Name</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Recruiter Phone</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Recruiter Email</th>
// // //                         <th className="px-4 py-2 border-b border-gray-300">Notes</th>
// // //                       </tr>
// // //                     </thead>
// // //                     <tbody>
// // //                       {monthData[row.invmonth]?.map((data) => (
// // //                         <tr
// // //                           key={data.id}
// // //                           className={`hover:bg-gray-50 even:bg-gray-50 cursor-pointer ${selectedSubRow?.id === data.id ? 'bg-blue-200' : ''}`}
// // //                           onClick={() => handleSubRowClick(data)}
// // //                         >
// // //                           <td className="px-4 py-1 border-b border-r border-gray-300 whitespace-nowrap">{data.id}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.poid}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.invoicenumber}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.startdate}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.enddate}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.invoicedate}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.invmonth}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.quantity}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.otquantity}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.rate}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.overtimerate}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.status}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.emppaiddate}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.candpaymentstatus}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.reminders}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.amountexpected}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.expecteddate}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.amountreceived}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.receiveddate}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.releaseddate}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.checknumber}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.invoiceurl}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.checkurl}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.freqtype}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.invoicenet}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.companyname}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.vendorfax}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.vendorphone}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.vendoremail}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.timsheetemail}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.hrname}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.hremail}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.hrphone}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.managername}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.manageremail}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.managerphone}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.secondaryname}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.secondaryemail}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.secondaryphone}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.candidatename}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.candidatephone}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.candidateemail}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.wrkemail}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.wrkphone}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.recruitername}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.recruiterphone}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.recruiteremail}</td>
// // //                           <td className="px-4 py-2 border-b border-gray-300">{data.notes}</td>
// // //                         </tr>
// // //                       ))}
// // //                     </tbody>
// // //                   </table>
// // //                 </div>
// // //               )}
// // //             </div>
// // //           ))}
// // //         </div>
// // //       )}

// // //       <div className="flex justify-between items-center mt-2 text-xs">
// // //         <div className="flex items-center">
// // //           <button
// // //             onClick={() => handlePageChange(1)}
// // //             disabled={currentPage === 1}
// // //             className="p-2 disabled:opacity-50"
// // //           >
// // //             <FaAngleDoubleLeft />
// // //           </button>
// // //           <button
// // //             onClick={() => handlePageChange(currentPage - 1)}
// // //             disabled={currentPage === 1}
// // //             className="p-2 disabled:opacity-50"
// // //           >
// // //             <FaChevronLeft />
// // //           </button>
// // //           {pageOptions.map((page) => (
// // //             <button
// // //               key={page}
// // //               onClick={() => handlePageChange(page)}
// // //               className={`px-2 py-1 rounded-md ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
// // //             >
// // //               {page}
// // //             </button>
// // //           ))}
// // //           <button
// // //             onClick={() => handlePageChange(currentPage + 1)}
// // //             disabled={currentPage === totalPages}
// // //             className="p-2 disabled:opacity-50"
// // //           >
// // //             <FaChevronRight />
// // //           </button>
// // //           <button
// // //             onClick={() => handlePageChange(totalPages)}
// // //             disabled={currentPage === totalPages}
// // //             className="p-2 disabled:opacity-50"
// // //           >
// // //             <FaAngleDoubleRight />
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {/* {modalState.add && (
// // //         <AddRowModal
// // //           isOpen={modalState.add}
// // //           onClose={() => setModalState((prev) => ({ ...prev, add: false }))}
// // //           refreshData={fetchData}
// // //         />
// // //       )}
// // //       {modalState.edit && selectedRow && (
// // //         <EditRowModal
// // //           isOpen={modalState.edit}
// // //           onRequestClose={() => setModalState((prev) => ({ ...prev, edit: false }))}
// // //           rowData={selectedRow}
// // //           onSave={() => {
// // //             if (selectedMonth) {
// // //               fetchMonthData(selectedMonth);
// // //             }
// // //           }}
// // //         />
// // //       )}
// // //       {modalState.view && selectedRow && (
// // //         <ViewRowModal
// // //           isOpen={modalState.view}
// // //           onRequestClose={() => setModalState((prev) => ({ ...prev, view: false }))}
// // //           rowData={selectedRow}
// // //         />
// // //       )} */}



// // //         {modalState.add && (
// // //           <AddRowModal
// // //             isOpen={modalState.add}
// // //             onClose={() => setModalState((prev) => ({ ...prev, add: false }))}
// // //             refreshData={fetchData}
// // //           />
// // //         )}
// // //         {modalState.edit && selectedRow && (
// // //           <EditRowModal
// // //             isOpen={modalState.edit}
// // //             onRequestClose={() => setModalState((prev) => ({ ...prev, edit: false }))}
// // //             rowData={selectedRow}
// // //             onSave={() => {
// // //               if (selectedMonth) {
// // //                 fetchMonthData(selectedMonth);
// // //               }
// // //             }}
// // //           />
// // //         )}
// // //         {modalState.view && selectedRow && (
// // //           <ViewRowModal
// // //             isOpen={modalState.view}
// // //             onRequestClose={() => setModalState((prev) => ({ ...prev, view: false }))}
// // //             rowData={selectedRow}
// // //           />
// // //         )}
// // //     </div>
// // //   );
// // // };

// // // export default ByMonth;


// // "use client";

// // import React, { useState, useEffect, useRef } from "react";
// // import axios from "axios";
// // import { jsPDF } from 'jspdf';
// // import autoTable from 'jspdf-autotable';
// // import { AxiosError } from 'axios';
// // import { AgGridReact } from "ag-grid-react";
// // import "ag-grid-community/styles/ag-grid.css";
// // import "ag-grid-community/styles/ag-theme-alpine.css";
// // import { FaDownload } from "react-icons/fa";
// // import AddRowModal from "../../modals/bymonth_modals/AddRowByMonth";
// // import EditRowModal from "../../modals/bymonth_modals/EditRowByMonth";
// // import ViewRowModal from "../../modals/bymonth_modals/ViewRowByMonth";
// // import { MdDelete } from "react-icons/md";
// // import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
// // import {
// //   AiOutlineEdit,
// //   AiOutlineEye,
// //   AiOutlineSearch,
// //   AiOutlineReload,
// // } from "react-icons/ai";
// // import { MdAdd } from "react-icons/md";
// // import type { ByMonth } from "../../types/index";

// // jsPDF.prototype.autoTable = autoTable;

// // const ByMonth = () => {
// //   const [rowData, setRowData] = useState<ByMonth[]>([]);
// //   const [alertMessage, setAlertMessage] = useState<string | null>(null);
// //   const [paginationPageSize] = useState<number>(100);
// //   const [currentPage, setCurrentPage] = useState<number>(1);
// //   const [totalRows, setTotalRows] = useState<number>(0);
// //   const [loading, setLoading] = useState<boolean>(false);
// //   const [modalState, setModalState] = useState<{
// //     add: boolean;
// //     edit: boolean;
// //     view: boolean;
// //   }>({ add: false, edit: false, view: false });
// //   const [selectedRow, setSelectedRow] = useState<ByMonth | null>(null);
// //   const [searchValue, setSearchValue] = useState<string>("");
// //   const [monthData, setMonthData] = useState<{ [key: string]: ByMonth[] }>({});
// //   const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
// //   const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
// //   const [selectedSubRow, setSelectedSubRow] = useState<ByMonth | null>(null);
// //   const gridRef = useRef<AgGridReact>(null);

// //   const API_URL = process.env.NEXT_PUBLIC_API_URL;

// //   const fetchData = async () => {
// //     setLoading(true);
// //     try {
// //       const response = await axios.get(`${API_URL}/invoices/months/`, {
// //         params: {
// //           page: currentPage,
// //           pageSize: paginationPageSize,
// //         },
// //         headers: { AuthToken: localStorage.getItem("token") },
// //       });

// //       const data = response.data;
// //       console.log("Fetched Data:", data);
// //       setRowData(data);
// //       setTotalRows(data.length);
// //     } catch (error) {
// //       console.error("Error loading data:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchByMonths = async (month = null, searchQuery = "") => {
// //     try {
// //       const response = await axios.get(`${API_URL}/invoices/month/${month || ''}`, {
// //         params: {
// //           page: currentPage,
// //           pageSize: paginationPageSize,
// //           search: searchQuery,
// //         },
// //         headers: { AuthToken: localStorage.getItem("token") },
// //       });

// //       const { data, totalRows } = response.data;
// //       setRowData(data);
// //       setTotalRows(totalRows);
// //     } catch (error) {
// //       console.error("Error loading data:", error);
// //     }
// //   };

// //   const handleSearch = () => {
// //     fetchByMonths(null, searchValue);
// //   };

// //   useEffect(() => {
// //     fetchData();
// //   }, [currentPage]);

// //   const handleRefresh = () => {
// //     setSearchValue("");
// //     setCurrentPage(1); // Reset to the first page
// //     setSelectedMonth(null); // Reset selected month
// //     setExpandedMonths(new Set()); // Reset expanded months
// //     setSelectedSubRow(null); // Reset selected subrow
// //     fetchData(); // Refetch the data
// //   };

// //   const handleAddRow = () =>
// //     setModalState((prevState) => ({ ...prevState, add: true }));

// //   const handleEditRow = () => {
// //     if (selectedSubRow) {
// //       setSelectedRow(selectedSubRow);
// //       setModalState((prevState) => ({ ...prevState, edit: true }));
// //     } else {
// //       setAlertMessage("Please select a row to edit.");
// //       setTimeout(() => setAlertMessage(null), 3000);
// //     }
// //   };

// //   const handleDeleteRow = async () => {
// //     if (selectedSubRow) {
// //       const invoiceId = selectedSubRow.id;
// //       if (invoiceId) {
// //         const confirmation = window.confirm(
// //           `Are you sure you want to delete invoice ID ${invoiceId}?`
// //         );
// //         if (!confirmation) return;

// //         try {
// //           setLoading(true);
// //           const response = await axios.delete(
// //             `${API_URL}/invoices/${invoiceId}`,
// //             {
// //               headers: { AuthToken: localStorage.getItem("token") },
// //             }
// //           );

// //           setAlertMessage("Invoice deleted successfully.");
// //           setTimeout(() => setAlertMessage(null), 3000);

// //           if (selectedMonth) {
// //             await fetchMonthData(selectedMonth);
// //           } else {
// //             await fetchData();
// //           }

// //           setSelectedSubRow(null);
// //         } catch (error) {
// //           const axiosError = error as AxiosError<{ error?: string }>;
// //           setAlertMessage(
// //             `Failed to delete invoice: ${
// //               axiosError.response?.data?.error || axiosError.message
// //             }`
// //           );
// //           setTimeout(() => setAlertMessage(null), 3000);
// //         } finally {
// //           setLoading(false);
// //         }
// //       } else {
// //         setAlertMessage("No valid invoice ID found for the selected row.");
// //         setTimeout(() => setAlertMessage(null), 3000);
// //       }
// //     } else {
// //       setAlertMessage("Please select a row to delete.");
// //       setTimeout(() => setAlertMessage(null), 3000);
// //     }
// //   };

// //   const handlePageChange = (newPage: number) => setCurrentPage(newPage);

// //   const handleViewRow = () => {
// //     if (selectedSubRow) {
// //       setSelectedRow(selectedSubRow);
// //       setModalState((prevState) => ({ ...prevState, view: true }));
// //     } else {
// //       setAlertMessage("Please select a row to view.");
// //       setTimeout(() => setAlertMessage(null), 3000);
// //     }
// //   };

// //   const fetchMonthData = async (month: string) => {
// //     try {
// //       const response = await axios.get(`${API_URL}/invoices/month/${month}`, {
// //         headers: { AuthToken: localStorage.getItem("token") },
// //       });
// //       const data = response.data;
// //       console.log("Fetched Month Data:", data);
// //       setMonthData(prev => ({ ...prev, [month]: data }));
// //     } catch (error) {
// //       console.error("Error loading month data:", error);
// //     }
// //   };

// //   const handleRowClick = async (month: string) => {
// //     setSelectedMonth(month);
// //     setSelectedSubRow(null); // Reset selected subrow when changing months

// //     setExpandedMonths((prev) => {
// //       const newSet = new Set(prev);
// //       if (newSet.has(month)) {
// //         newSet.delete(month);
// //       } else {
// //         newSet.add(month);
// //         if (!monthData[month]) {
// //           fetchMonthData(month);
// //         }
// //       }
// //       return newSet;
// //     });
// //   };

// //   const handleSubRowClick = (row: ByMonth) => {
// //     setSelectedSubRow(row);
// //     console.log("Selected SubRow:", row);
// //   };

// //   const handleDownloadPDF = () => {
// //     const doc = new jsPDF();
// //     doc.text("By Month Data", 20, 10);
// //     const pdfData = rowData.map((row) => Object.values(row));
// //     const headers = Object.keys(rowData[0]).map((key) => key.charAt(0).toUpperCase() + key.slice(1));
// //     autoTable(doc, {
// //       head: [headers],
// //       body: pdfData,
// //       theme: 'grid',
// //       styles: { fontSize: 5 },
// //     });
// //     doc.save("by_month_data.pdf");
// //   };

// //   const totalPages = Math.ceil(totalRows / paginationPageSize);
// //   const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

// //   return (
// //     <div className="p-4 mt-4 mb-4 mx-auto bg-gray-100 rounded-lg shadow-md relative max-w-7xl h-[600px] overflow-y-auto">
// //       {alertMessage && (
// //         <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded-md shadow-md z-50">
// //           {alertMessage}
// //         </div>
// //       )}

// //       <div className="flex flex-col md:flex-row justify-between items-center mb-4">
// //         <h1 className="text-3xl font-bold text-gray-800">Invoice Management</h1>
// //       </div>

// //       <div className="flex flex-col md:flex-row mb-4 justify-between items-center">
// //         <div className="flex w-full md:w-auto mb-2 md:mb-0">
// //           <input
// //             type="text"
// //             placeholder="Search..."
// //             value={searchValue}
// //             onChange={(e) => setSearchValue(e.target.value)}
// //             className="border border-gray-300 rounded-md p-2 w-64"
// //           />
// //           <button
// //             onClick={handleSearch}
// //             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md ml-2 transition duration-300 hover:bg-blue-900"
// //           >
// //             <AiOutlineSearch className="mr-2" /> Search
// //           </button>
// //         </div>

// //         <div className="flex space-x-2">
// //           <button
// //             onClick={handleAddRow}
// //             className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700"
// //           >
// //             <MdAdd className="mr-2" />
// //           </button>
// //           <button
// //             onClick={handleEditRow}
// //             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700"
// //           >
// //             <AiOutlineEdit className="mr-2" />
// //           </button>
// //           <button
// //             onClick={handleDeleteRow}
// //             className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700"
// //           >
// //             <MdDelete className="mr-2" />
// //           </button>
// //           <button
// //             onClick={handleViewRow}
// //             className="flex items-center px-4 py-2 bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-700"
// //           >
// //             <AiOutlineEye className="mr-2" />
// //           </button>
// //           <button
// //             onClick={handleRefresh}
// //             className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md transition duration-300 hover:bg-gray-900"
// //           >
// //             <AiOutlineReload className="mr-2" />
// //           </button>
// //           <button
// //             onClick={handleDownloadPDF}
// //             className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700"
// //           >
// //             <FaDownload className="mr-2" />
// //           </button>
// //         </div>
// //       </div>

// //       {loading ? (
// //         <div className="flex justify-center items-center h-48">
// //           <span className="text-xl">Loading...</span>
// //         </div>
// //       ) : (
// //         <div className="space-y-4">
// //           {rowData.map((row) => (
// //             <div key={row.invmonth}>
// //               <div
// //                 className="flex justify-between items-center p-2 bg-gray-200 cursor-pointer"
// //                 onClick={() => handleRowClick(row.invmonth)}
// //               >
// //                 <span>{row.invmonth}</span>
// //                 <span
// //                   className="text-blue-600 cursor-pointer"
// //                   onClick={(e) => {
// //                     e.stopPropagation();
// //                     handleRowClick(row.invmonth);
// //                   }}
// //                 >
// //                   {expandedMonths.has(row.invmonth) ? "-" : "+"}
// //                 </span>
// //               </div>
// //               {expandedMonths.has(row.invmonth) && (
// //                 <div className="overflow-x-auto overflow-y-auto max-h-[400px] text-xs border border-gray-300 rounded-md">
// //                   <table className="min-w-full bg-white">
// //                     <thead className="sticky top-0 bg-gray-100 z-10">
// //                       <tr>
// //                         <th className="px-4 py-2 border-b border-r border-gray-300 whitespace-nowrap w-24">ID</th>
// //                         <th className="px-4 py-2 border-b border-gray-300 w-34">POID</th>
// //                         <th className="px-4 py-2 border-b border-gray-300 w-42">Invoice Number</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Start Date</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">End Date</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Invoice Date</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Invoice Month</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Quantity</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">OT Quantity</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Rate</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">OT Rate</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Status</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Emp Paid Date</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Cand Payment Status</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Reminders</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Amount Expected</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Expected Date</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Amount Received</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Received Date</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Released Date</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Check Number</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Invoice URL</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Check URL</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Freq Type</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Invoice Net</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Company Name</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Vendor Fax</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Vendor Phone</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Vendor Email</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Timesheet Email</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">HR Name</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">HR Email</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">HR Phone</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Manager Name</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Manager Email</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Manager Phone</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Secondary Name</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Secondary Email</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Secondary Phone</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Candidate Name</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Candidate Phone</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Candidate Email</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">WRK Email</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">WRK Phone</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Recruiter Name</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Recruiter Phone</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Recruiter Email</th>
// //                         <th className="px-4 py-2 border-b border-gray-300">Notes</th>
// //                       </tr>
// //                     </thead>
// //                     <tbody>
// //                       {monthData[row.invmonth]?.map((data) => (
// //                         <tr
// //                           key={data.id}
// //                           className={`hover:bg-gray-50 even:bg-gray-50 cursor-pointer ${selectedSubRow?.id === data.id ? 'bg-blue-200' : ''}`}
// //                           onClick={() => handleSubRowClick(data)}
// //                         >
// //                           <td className="px-4 py-1 border-b border-r border-gray-300 whitespace-nowrap">{data.id}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.poid}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.invoicenumber}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.startdate}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.enddate}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.invoicedate}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.invmonth}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.quantity}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.otquantity}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.rate}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.overtimerate}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.status}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.emppaiddate}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.candpaymentstatus}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.reminders}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.amountexpected}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.expecteddate}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.amountreceived}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.receiveddate}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.releaseddate}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.checknumber}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.invoiceurl}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.checkurl}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.freqtype}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.invoicenet}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.companyname}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.vendorfax}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.vendorphone}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.vendoremail}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.timsheetemail}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.hrname}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.hremail}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.hrphone}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.managername}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.manageremail}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.managerphone}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.secondaryname}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.secondaryemail}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.secondaryphone}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.candidatename}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.candidatephone}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.candidateemail}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.wrkemail}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.wrkphone}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.recruitername}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.recruiterphone}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.recruiteremail}</td>
// //                           <td className="px-4 py-2 border-b border-gray-300">{data.notes}</td>
// //                         </tr>
// //                       ))}
// //                     </tbody>
// //                   </table>
// //                 </div>
// //               )}
// //             </div>
// //           ))}
// //         </div>
// //       )}

// //       <div className="flex justify-between items-center mt-2 text-xs">
// //         <div className="flex items-center">
// //           <button
// //             onClick={() => handlePageChange(1)}
// //             disabled={currentPage === 1}
// //             className="p-2 disabled:opacity-50"
// //           >
// //             <FaAngleDoubleLeft />
// //           </button>
// //           <button
// //             onClick={() => handlePageChange(currentPage - 1)}
// //             disabled={currentPage === 1}
// //             className="p-2 disabled:opacity-50"
// //           >
// //             <FaChevronLeft />
// //           </button>
// //           {pageOptions.map((page) => (
// //             <button
// //               key={page}
// //               onClick={() => handlePageChange(page)}
// //               className={`px-2 py-1 rounded-md ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
// //             >
// //               {page}
// //             </button>
// //           ))}
// //           <button
// //             onClick={() => handlePageChange(currentPage + 1)}
// //             disabled={currentPage === totalPages}
// //             className="p-2 disabled:opacity-50"
// //           >
// //             <FaChevronRight />
// //           </button>
// //           <button
// //             onClick={() => handlePageChange(totalPages)}
// //             disabled={currentPage === totalPages}
// //             className="p-2 disabled:opacity-50"
// //           >
// //             <FaAngleDoubleRight />
// //           </button>
// //         </div>
// //       </div>

// //       {modalState.add && (
// //         <AddRowModal
// //           isOpen={modalState.add}
// //           onClose={() => setModalState((prev) => ({ ...prev, add: false }))}
// //           refreshData={fetchData}
// //         />
// //       )}
// //       {modalState.edit && selectedRow && (
// //         <EditRowModal
// //           isOpen={modalState.edit}
// //           onRequestClose={() => setModalState((prev) => ({ ...prev, edit: false }))}
// //           rowData={selectedRow}
// //           onSave={() => {
// //             if (selectedMonth) {
// //               fetchMonthData(selectedMonth);
// //             }
// //           }}
// //         />
// //       )}
// //       {modalState.view && selectedRow && (
// //         <ViewRowModal
// //           isOpen={modalState.view}
// //           onRequestClose={() => setModalState((prev) => ({ ...prev, view: false }))}
// //           rowData={selectedRow}
// //         />
// //       )}
// //     </div>
// //   );
// // };

// // export default ByMonth;




// "use client";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import AddRowModal from "../../modals/bymonth_modals/AddRowByMonth";
// import EditRowModal from "../../modals/bymonth_modals/EditRowByMonth";
// import ViewRowModal from "../../modals/bymonth_modals/ViewRowByMonth";
// import autoTable from "jspdf-autotable";
// import axios from "axios";
// import { AgGridReact } from "ag-grid-react";
// import { jsPDF } from "jspdf";
// import { AiOutlineEdit, AiOutlineEye, AiOutlineSearch } from "react-icons/ai";
// import { MdAdd, MdDelete } from "react-icons/md";

// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import {
//   FaChevronLeft,
//   FaChevronRight,
//   FaAngleDoubleLeft,
//   FaAngleDoubleRight,
//   FaDownload,
// } from "react-icons/fa";

// jsPDF.prototype.autoTable = autoTable;

// interface MonthGroup {
//   invmonth: string;
//   invoices: InvoiceData[];
//   isGroup: boolean;
//   isCollapsed: boolean;
//   invoice_count: number;
// }

// interface InvoiceData {
//   id: number;
//   invoicenumber: string;
//   poid: number;
//   candidatename: string;
//   companyname: string;
//   startdate: string;
//   enddate: string;
//   invoicedate: string;
//   invmonth: string;
//   quantity: number;
//   otquantity: number;
//   rate: number;
//   overtimerate: number;
//   status: string;
//   emppaiddate: string;
//   candpaymentstatus: string;
//   reminders: string;
//   amountexpected: number;
//   expecteddate: string;
//   amountreceived: number;
//   receiveddate: string;
//   releaseddate: string;
//   checknumber: string;
//   invoiceurl: string;
//   checkurl: string;
//   freqtype: string;
//   invoicenet: number;
//   vendorfax: string;
//   vendorphone: string;
//   vendoremail: string;
//   timsheetemail: string;
//   hrname: string;
//   hremail: string;
//   hrphone: string;
//   managername: string;
//   manageremail: string;
//   managerphone: string;
//   secondaryname: string;
//   secondaryemail: string;
//   secondaryphone: string;
//   candidatephone: string;
//   candidateemail: string;
//   wrkemail: string;
//   wrkphone: string;
//   recruitername: string;
//   recruiterphone: string;
//   recruiteremail: string;
//   notes: string;
// }

// interface RowData extends InvoiceData {
//   isGroupRow?: boolean;
//   level?: number;
//   expanded?: boolean;
// }

// interface AlertMessage {
//   text: string;
//   type: "success" | "error";
// }

// interface ModalState {
//   add: boolean;
//   view: boolean;
//   edit: boolean;
//   selectedRow: InvoiceData | null;
// }

// const ByMonth = () => {
//   const gridRef = useRef<any>();
//   const [modalState, setModalState] = useState<ModalState>({
//     add: false,
//     view: false,
//     edit: false,
//     selectedRow: null,
//   });
//   const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
//   const [searchValue, setSearchValue] = useState("");
//   const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
//   const [monthGroups, setMonthGroups] = useState<MonthGroup[]>([]);
//   const [expandedMonthGroups, setExpandedMonthGroups] = useState<{
//     [key: string]: boolean;
//   }>({});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isLoading, setIsLoading] = useState(true);
//   const [clients, setClients] = useState<any[]>([]); // Adjust the type as per your client data structure
//   const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
//   const pageSize = 10;

//   const showAlert = (text: string, type: "success" | "error") => {
//     setAlertMessage({ text, type });
//     setTimeout(() => setAlertMessage(null), 3000);
//   };

//   // Debounce search value
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearchValue(searchValue);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchValue]);

//   const fetchData = useCallback(async () => {
//     try {
//       setIsLoading(true);
      
//       // First fetch the month list
//       const monthResponse = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/invoices/month-list`,
//         {
//           params: {
//             page: currentPage,
//             page_size: pageSize,
//             search: debouncedSearchValue || undefined,
//           }
//         }
//       );
      
//       // Then fetch detailed data for each month
//       const detailedResponse = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/invoices/dataByMonth`
//       );
      
//       // Merge the data
//       const mergedData = monthResponse.data.map((monthItem: any) => {
//         const detailedMonth = detailedResponse.data.data.find(
//           (d: any) => d.invmonth === monthItem.invmonth
//         );
        
//         return {
//           ...monthItem,
//           invoices: detailedMonth ? detailedMonth.invoices : [],
//           isGroup: true,
//           isCollapsed: expandedMonthGroups[monthItem.invmonth] || false,
//           invoice_count: detailedMonth ? detailedMonth.invoices.length : 0
//         };
//       });
      
//       setMonthGroups(mergedData);
//       setTotalPages(monthResponse.data.pages || 1);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       showAlert("Error loading data", "error");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [currentPage, debouncedSearchValue]);

//   const fetchClients = useCallback(async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/invoices/dataByMonth` // Adjust the endpoint as per your API
//       );
//       setClients(response.data || []);
//     } catch (error) {
//       console.error("Error fetching clients:", error);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//     fetchClients();
//   }, [fetchData, fetchClients]);

//   const toggleGroup = (month: string) => {
//     setSelectedMonth(month); // Store the selected month
//     setExpandedMonthGroups((prev) => ({
//       ...prev,
//       [month]: !prev[month],
//     }));
//   };

//   const rowData = useMemo(() => {
//     const rows = [];
//     if (monthGroups && monthGroups.length > 0) {
//       monthGroups.forEach((monthGroup) => {
//         rows.push({
//           id: monthGroup.invoices[0]?.id || -1,
//           name: monthGroup.invmonth,
//           invoicenumber: "",
//           startdate: "",
//           enddate: "",
//           invoicedate: "",
//           invmonth: monthGroup.invmonth,
//           quantity: 0,
//           otquantity: 0,
//           rate: 0,
//           overtimerate: 0,
//           status: "",
//           emppaiddate: "",
//           candpaymentstatus: "",
//           reminders: "",
//           amountexpected: 0,
//           expecteddate: "",
//           amountreceived: 0,
//           receiveddate: "",
//           releaseddate: "",
//           checknumber: "",
//           invoiceurl: "",
//           checkurl: "",
//           freqtype: "",
//           invoicenet: 0,
//           companyname: "",
//           vendorfax: "",
//           vendorphone: "",
//           vendoremail: "",
//           timsheetemail: "",
//           hrname: "",
//           hremail: "",
//           hrphone: "",
//           managername: "",
//           manageremail: "",
//           managerphone: "",
//           secondaryname: "",
//           secondaryemail: "",
//           secondaryphone: "",
//           candidatename: "",
//           candidatephone: "",
//           candidateemail: "",
//           wrkemail: "",
//           wrkphone: "",
//           recruitername: "",
//           recruiterphone: "",
//           recruiteremail: "",
//           poid: 0,
//           notes: "",
//           isGroupRow: true,
//           level: 0,
//           expanded: expandedMonthGroups[monthGroup.invmonth],
//         });
  
//         if (expandedMonthGroups[monthGroup.invmonth]) {
//           monthGroup.invoices.forEach((invoice) => {
//             rows.push({
//               ...invoice,
//               name: `${invoice.id} ${invoice.invoicenumber} - ${monthGroup.invmonth}`,
//               isGroupRow: false,
//               level: 1,
//             });
//           });
//           rows.push({
//             id: -1,
//             name: "",
//             invoicenumber: "",
//             startdate: "",
//             enddate: "",
//             invoicedate: "",
//             invmonth: "",
//             quantity: 0,
//             otquantity: 0,
//             rate: 0,
//             overtimerate: 0,
//             status: "",
//             emppaiddate: "",
//             candpaymentstatus: "",
//             reminders: "",
//             amountexpected: 0,
//             expecteddate: "",
//             amountreceived: 0,
//             receiveddate: "",
//             releaseddate: "",
//             checknumber: "",
//             invoiceurl: "",
//             checkurl: "",
//             freqtype: "",
//             invoicenet: 0,
//             companyname: "",
//             vendorfax: "",
//             vendorphone: "",
//             vendoremail: "",
//             timsheetemail: "",
//             hrname: "",
//             hremail: "",
//             hrphone: "",
//             managername: "",
//             manageremail: "",
//             managerphone: "",
//             secondaryname: "",
//             secondaryemail: "",
//             secondaryphone: "",
//             candidatename: "",
//             candidatephone: "",
//             candidateemail: "",
//             wrkemail: "",
//             wrkphone: "",
//             recruitername: "",
//             recruiterphone: "",
//             recruiteremail: "",
//             poid: -1,
//             notes: "",
//             isGroupRow: false,
//             level: 1,
//           });
//         }
//       });
//     }
//     return rows;
//   }, [monthGroups, expandedMonthGroups]);
  


//   const columnDefs = useMemo(
//     () => [
//       {
//         headerName: "Month",
//         field: "name" as keyof RowData,
//         cellRenderer: (params: any) => {
//           if (params.data.isGroupRow) {
//             const expanded = expandedMonthGroups[params.data.invmonth];
//             return (
//               <div className="flex items-center">
//                 <span
//                   className="cursor-pointer pl-1 flex items-center hover:bg-gray-100 rounded-md py-1 px-2 transition-colors duration-200"
//                   onClick={() => toggleGroup(params.data.invmonth)}
//                 >
//                   <span className="mr-2 text-gray-600 flex items-center justify-center w-4 h-4 bg-white border border-gray-300 rounded">
//                     {expanded ? (
//                       <svg
//                         className="w-3 h-3"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M20 12H4"
//                         />
//                       </svg>
//                     ) : (
//                       <svg
//                         className="w-3 h-3"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M12 4v16m8-8H4"
//                         />
//                       </svg>
//                     )}
//                   </span>
//                   <span className="font-medium">{params.value}</span>
//                 </span>
//               </div>
//             );
//           }
//           return <span className="pl-3">{params.value}</span>;
//         },
//         minWidth: 200,
//         flex: 1,
//       },
//       {
//         headerName: "Invoice Number",
//         field: "invoicenumber" as keyof RowData,
//         hide: false,
//         minWidth: 150,
//       },
//       {
//         headerName: "Start Date",
//         field: "startdate" as keyof RowData,
//         hide: false,
//         minWidth: 120,
//       },
//       {
//         headerName: "End Date",
//         field: "enddate" as keyof RowData,
//         hide: false,
//         minWidth: 120,
//       },
//       {
//         headerName: "Invoice Date",
//         field: "invoicedate" as keyof RowData,
//         hide: false,
//         minWidth: 120,
//       },
//       {
//         headerName: "Quantity",
//         field: "quantity" as keyof RowData,
//         hide: false,
//         minWidth: 100,
//       },
//       {
//         headerName: "OT Quantity",
//         field: "otquantity" as keyof RowData,
//         hide: false,
//         minWidth: 100,
//       },
//       {
//         headerName: "Rate",
//         field: "rate" as keyof RowData,
//         hide: false,
//         minWidth: 100,
//       },
//       {
//         headerName: "Overtime Rate",
//         field: "overtimerate" as keyof RowData,
//         hide: false,
//         minWidth: 120,
//       },
//       {
//         headerName: "Status",
//         field: "status" as keyof RowData,
//         hide: false,
//         minWidth: 100,
//         cellRenderer: (params: any) => {
//           const statusMap: { [key: string]: string } = {
//             A: "Active",
//             I: "Inactive",
//             D: "Delete",
//             R: "Rejected",
//             N: "Not Interested",
//             E: "Excellent",
//           };
//           return statusMap[params.value] || params.value;
//         },
//       },
//       {
//         headerName: "Amount Expected",
//         field: "amountexpected" as keyof RowData,
//         hide: false,
//         minWidth: 120,
//       },
//       {
//         headerName: "Expected Date",
//         field: "expecteddate" as keyof RowData,
//         hide: false,
//         minWidth: 120,
//       },
//       {
//         headerName: "Amount Received",
//         field: "amountreceived" as keyof RowData,
//         hide: false,
//         minWidth: 120,
//       },
//       {
//         headerName: "Received Date",
//         field: "receiveddate" as keyof RowData,
//         hide: false,
//         minWidth: 120,
//       },
//       {
//         headerName: "Released Date",
//         field: "releaseddate" as keyof RowData,
//         hide: false,
//         minWidth: 120,
//       },
//       {
//         headerName: "Check Number",
//         field: "checknumber" as keyof RowData,
//         hide: false,
//         minWidth: 120,
//       },
//       {
//         headerName: "Invoice URL",
//         field: "invoiceurl" as keyof RowData,
//         hide: false,
//         minWidth: 120,
//       },
//       {
//         headerName: "Check URL",
//         field: "checkurl" as keyof RowData,
//         hide: false,
//         minWidth: 120,
//       },
//       {
//         headerName: "Freq Type",
//         field: "freqtype" as keyof RowData,
//         hide: false,
//         minWidth: 100,
//       },
//       {
//         headerName: "Invoice Net",
//         field: "invoicenet" as keyof RowData,
//         hide: false,
//         minWidth: 100,
//       },
//       {
//         headerName: "Company Name",
//         field: "companyname" as keyof RowData,
//         hide: false,
//         minWidth: 150,
//       },
//       {
//         headerName: "Vendor Fax",
//         field: "vendorfax" as keyof RowData,
//         hide: false,
//         minWidth: 120,
//       },
//       {
//         headerName: "Vendor Phone",
//         field: "vendorphone" as keyof RowData,
//         hide: false,
//         minWidth: 120,
//       },
//       {
//         headerName: "Vendor Email",
//         field: "vendoremail" as keyof RowData,
//         hide: false,
//         minWidth: 150,
//       },
//       {
//         headerName: "Timesheet Email",
//         field: "timsheetemail" as keyof RowData,
//         hide: false,
//         minWidth: 150,
//       },
//       {
//         headerName: "HR Name",
//         field: "hrname" as keyof RowData,
//         hide: false,
//         minWidth: 120,
//       },
//       {
//         headerName: "HR Email",
//         field: "hremail" as keyof RowData,
//         hide: false,
//         minWidth: 150,
//       },
//       {
//         headerName: "HR Phone",
//         field: "hrphone" as keyof RowData,
//         hide: false,
//         minWidth: 120,
//       },
//       {
//         headerName: "Manager Name",
//         field: "managername" as keyof RowData,
//         hide: false,
//         minWidth: 120,
//       },
//       {
//         headerName: "Manager Email",
//         field: "manageremail" as keyof RowData,
//         hide: false,
//         minWidth: 150,
//       },
//       {
//         headerName: "Manager Phone",
//         field: "managerphone" as keyof RowData,
//         hide: false,
//         minWidth: 120,
//       },
//       {
//         headerName: "Secondary Name",
//         field: "secondaryname" as keyof RowData,
//         hide: false,
//         minWidth: 120,
//       },
//       {
//         headerName: "Secondary Email",
//         field: "secondaryemail" as keyof RowData,
//         hide: false,
//         minWidth: 150,
//       },
//       {
//         headerName: "Secondary Phone",
//         field: "secondaryphone" as keyof RowData,
//         hide: false,
//         minWidth: 120,
//       },
//       {
//         headerName: "Candidate Name",
//         field: "candidatename" as keyof RowData,
//         hide: false,
//         minWidth: 150,
//       },
//       {
//         headerName: "Candidate Phone",
//         field: "candidatephone" as keyof RowData,
//         hide: false,
//         minWidth: 120,
//       },
//       {
//         headerName: "Candidate Email",
//         field: "candidateemail" as keyof RowData,
//         hide: false,
//         minWidth: 150,
//       },
//       {
//         headerName: "Work Email",
//         field: "wrkemail" as keyof RowData,
//         hide: false,
//         minWidth: 150,
//       },
//       {
//         headerName: "Work Phone",
//         field: "wrkphone" as keyof RowData,
//         hide: false,
//         minWidth: 120,
//       },
//       {
//         headerName: "Recruiter Name",
//         field: "recruitername" as keyof RowData,
//         hide: false,
//         minWidth: 150,
//       },
//       {
//         headerName: "Recruiter Phone",
//         field: "recruiterphone" as keyof RowData,
//         hide: false,
//         minWidth: 120,
//       },
//       {
//         headerName: "Recruiter Email",
//         field: "recruiteremail" as keyof RowData,
//         hide: false,
//         minWidth: 150,
//       },
//       {
//         headerName: "Notes",
//         field: "notes" as keyof RowData,
//         hide: false,
//         minWidth: 200,
//       },
//     ],
//     [expandedMonthGroups]
//   );

//   const handlePageChange = (newPage: number) => {
//     if (newPage > 0 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//     }
//   };

//   const handleAdd = async (formData: InvoiceData) => {
//     try {
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/invoices/post/`,
//         formData
//       );
//       showAlert("Invoice added successfully", "success");
//       setModalState({ ...modalState, add: false });
//       fetchData();
//     } catch (error) {
//       // Suppress error tooltip
//       console.error("Error adding invoice:", error);
//     }
//   };

//   const handleEdit = async (formData: InvoiceData) => {
//     try {
//       await axios.put(
//         `${process.env.NEXT_PUBLIC_API_URL}/invoices/put/${formData.id}`,
//         formData
//       );
//       showAlert("Invoice updated successfully", "success");
//       setModalState({ ...modalState, edit: false });
//       fetchData();
//     } catch (error) {
//       showAlert("Error updating invoice", "error");
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (window.confirm("Are you sure you want to delete this invoice?")) {
//       try {
//         await axios.delete(
//           `${process.env.NEXT_PUBLIC_API_URL}/invoices/bypo/delete/${id}`
//         );
//         showAlert("Invoice deleted successfully", "success");
//         fetchData();
//       } catch (error) {
//         showAlert("Error deleting invoice", "error");
//       }
//     }
//   };

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     const tableData = rowData
//       .filter((row) => !row.isGroupRow && row.id !== -1)
//       .map((row) => [
//         row.companyname,
//         row.name,
//         row.invoicenumber,
//         row.startdate,
//         row.enddate,
//         row.invoicedate,
//         row.quantity,
//         row.otquantity,
//         row.rate,
//         row.overtimerate,
//         row.status,
//         row.amountexpected,
//         row.expecteddate,
//         row.amountreceived,
//         row.receiveddate,
//         row.releaseddate,
//         row.checknumber,
//         row.invoiceurl,
//         row.checkurl,
//         row.freqtype,
//         row.invoicenet,
//         row.vendorfax,
//         row.vendorphone,
//         row.vendoremail,
//         row.timsheetemail,
//         row.hrname,
//         row.hremail,
//         row.hrphone,
//         row.managername,
//         row.manageremail,
//         row.managerphone,
//         row.secondaryname,
//         row.secondaryemail,
//         row.secondaryphone,
//         row.candidatename,
//         row.candidatephone,
//         row.candidateemail,
//         row.wrkemail,
//         row.wrkphone,
//         row.recruitername,
//         row.recruiterphone,
//         row.recruiteremail,
//         row.notes,
//       ]);

//     autoTable(doc, {
//       head: [
//         [
//           "Company",
//           "Name",
//           "Invoice Number",
//           "Start Date",
//           "End Date",
//           "Invoice Date",
//           "Quantity",
//           "OT Quantity",
//           "Rate",
//           "Overtime Rate",
//           "Status",
//           "Amount Expected",
//           "Expected Date",
//           "Amount Received",
//           "Received Date",
//           "Released Date",
//           "Check Number",
//           "Invoice URL",
//           "Check URL",
//           "Freq Type",
//           "Invoice Net",
//           "Vendor Fax",
//           "Vendor Phone",
//           "Vendor Email",
//           "Timesheet Email",
//           "HR Name",
//           "HR Email",
//           "HR Phone",
//           "Manager Name",
//           "Manager Email",
//           "Manager Phone",
//           "Secondary Name",
//           "Secondary Email",
//           "Secondary Phone",
//           "Candidate Name",
//           "Candidate Phone",
//           "Candidate Email",
//           "Work Email",
//           "Work Phone",
//           "Recruiter Name",
//           "Recruiter Phone",
//           "Recruiter Email",
//           "Notes",
//         ],
//       ],
//       body: tableData,
//       styles: { fontSize: 8 },
//       margin: { top: 20 },
//     });

//     doc.save("invoices-by-month.pdf");
//   };

//   const renderPageNumbers = () => {
//     const pageNumbers = [];
//     for (let i = 1; i <= totalPages; i++) {
//       if (i === 1 || (i >= currentPage - 1 && i <= currentPage + 1)) {
//         pageNumbers.push(
//           <button
//             key={i}
//             onClick={() => handlePageChange(i)}
//             className={`text-sm px-2 py-1 rounded-md ${
//               currentPage === i
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-200 text-gray-800"
//             } hidden sm:block`}
//           >
//             {i}
//           </button>
//         );
//       }
//     }
//     return pageNumbers;
//   };

//   return (
//     <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md relative">
//       {alertMessage && (
//         <div
//           className={`fixed top-4 right-4 p-4 ${
//             alertMessage.type === "success" ? "bg-green-500" : "bg-red-500"
//           } text-white rounded-md shadow-md z-50`}
//         >
//           {alertMessage.text}
//         </div>
//       )}

//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-3xl font-bold text-gray-800">Invoice Management</h1>
//         <div className="flex space-x-2">
//           <button
//             onClick={() => setModalState({ ...modalState, add: true })}
//             className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700"
//           >
//             <MdAdd className="mr-2" />
//           </button>
//           <button
//             onClick={() => {
//               const selectedRows = gridRef.current?.api.getSelectedRows();
//               if (selectedRows?.length > 0 && !selectedRows[0].isGroupRow) {
//                 setModalState({
//                   ...modalState,
//                   edit: true,
//                   selectedRow: selectedRows[0],
//                 });
//               } else {
//                 showAlert("Please select an invoice to edit", "error");
//               }
//             }}
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700"
//           >
//             <AiOutlineEdit className="mr-2" />
//           </button>
//           <button
//             onClick={() => {
//               const selectedRows = gridRef.current?.api.getSelectedRows();
//               if (selectedRows?.length > 0 && !selectedRows[0].isGroupRow) {
//                 handleDelete(selectedRows[0].id);
//               } else {
//                 showAlert("Please select an invoice to delete", "error");
//               }
//             }}
//             className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700"
//           >
//             <MdDelete className="mr-2" />
//           </button>
//           <button
//             onClick={() => {
//               const selectedRows = gridRef.current?.api.getSelectedRows();
//               if (selectedRows?.length > 0 && !selectedRows[0].isGroupRow) {
//                 setModalState({
//                   ...modalState,
//                   view: true,
//                   selectedRow: selectedRows[0],
//                 });
//               } else {
//                 showAlert("Please select an invoice to view", "error");
//               }
//             }}
//             className="flex items-center px-4 py-2 bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-700"
//           >
//             <AiOutlineEye className="mr-2" />
//           </button>
//           <button
//             onClick={handleDownloadPDF}
//             className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700"
//           >
//             <FaDownload className="mr-2" />
//           </button>
//         </div>
//       </div>

//       <div className="flex mb-4">
//         <input
//           type="text"
//           placeholder="Search..."
//           value={searchValue}
//           onChange={(e) => setSearchValue(e.target.value)}
//           className="border border-gray-300 rounded-md p-2 w-64"
//         />
//         <button
//           onClick={fetchData}
//           className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md ml-2 transition duration-300 hover:bg-blue-900"
//         >
//           <AiOutlineSearch className="mr-2" /> Search
//         </button>
//       </div>

//       <div
//         className="ag-theme-alpine relative"
//         style={{ height: "400px", width: "100%", overflowY: "auto" }}
//       >
//         {isLoading && (
//           <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 z-10">
//             <span className="ml-3 text-gray-700 font-medium">Loading...</span>
//           </div>
//         )}

//         <AgGridReact
//           ref={gridRef}
//           rowData={rowData}
//           columnDefs={columnDefs}
//           defaultColDef={{
//             sortable: true,
//             filter: true,
//             cellStyle: { color: "#333", fontSize: "0.75rem", padding: "1px" },
//             minWidth: 60,
//           }}
//           suppressRowClickSelection={false}
//           rowSelection="single"
//           rowHeight={30}
//           headerHeight={35}
//           overlayLoadingTemplate={
//             '<span class="ag-overlay-loading-center">Loading...</span>'
//           }
//           overlayNoRowsTemplate={
//             '<span class="ag-overlay-no-rows-center">No rows to show</span>'
//           }
//           onGridReady={(params) => {
//             params.api.sizeColumnsToFit();
//           }}
//         />
//       </div>

//       <div className="flex justify-between mt-4">
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={() => handlePageChange(1)}
//             disabled={currentPage === 1}
//             className="p-2 disabled:opacity-50 bg-gray-200 rounded hover:bg-gray-300"
//           >
//             <FaAngleDoubleLeft />
//           </button>
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="p-2 disabled:opacity-50 bg-gray-200 rounded hover:bg-gray-300"
//           >
//             <FaChevronLeft />
//           </button>

//           {/* Show limited page numbers */}
//           {totalPages > 0 && (
//             <>
//               {currentPage > 2 && (
//                 <span className="px-2 text-gray-500">...</span>
//               )}
//               {currentPage > 1 && (
//                 <button
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
//                 >
//                   {currentPage - 1}
//                 </button>
//               )}
//               <button
//                 className="px-3 py-1 rounded bg-blue-600 text-white"
//               >
//                 {currentPage}
//               </button>
//               {currentPage < totalPages && (
//                 <button
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
//                 >
//                   {currentPage + 1}
//                 </button>
//               )}
//               {currentPage < totalPages - 1 && (
//                 <span className="px-2 text-gray-500">...</span>
//               )}
//             </>
//           )}

//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="p-2 disabled:opacity-50 bg-gray-200 rounded hover:bg-gray-300"
//           >
//             <FaChevronRight />
//           </button>
//           <button
//             onClick={() => handlePageChange(totalPages)}
//             disabled={currentPage === totalPages}
//             className="p-2 disabled:opacity-50 bg-gray-200 rounded hover:bg-gray-300"
//           >
//             <FaAngleDoubleRight />
//           </button>
//         </div>
//         {/* <span className="ml-4 text-sm text-gray-600">
//           Page {currentPage} of {totalPages} | Total Records:{" "}
//           {monthGroups.reduce((acc, monthGroup) => acc + monthGroup.invoices.length, 0)}
//         </span> */}


// <span className="ml-4 text-sm text-gray-600">
//   Page {currentPage} of {totalPages} | Total Records:{" "}
//   {monthGroups && monthGroups.length > 0
//     ? monthGroups.reduce((acc, monthGroup) => acc + monthGroup.invoices.length, 0)
//     : 0}
// </span>

//       </div>

//       <AddRowModal
//         isOpen={modalState.add}
//         onClose={() => setModalState({ ...modalState, add: false })}
//         onSubmit={handleAdd}
//       />

//       <ViewRowModal
//         isOpen={modalState.view}
//         onClose={() => setModalState({ ...modalState, view: false })}
//         invoice={modalState.selectedRow}
//       />

//       <EditRowModal
//         isOpen={modalState.edit}
//         onClose={() => setModalState({ ...modalState, edit: false })}
//         rowData={modalState.selectedRow as InvoiceData} // Pass the selected row data
//         onSave={fetchData} // Pass the function to refresh data after save
//         clients={clients}
//         defaultClientId={selectedMonth || modalState.selectedRow?.poid || 0}
//       />
//     </div>
//   );
// };

// export default ByMonth;






"use client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import AddRowModal from "../../modals/bymonth_modals/AddRowByMonth";
import EditRowModal from "../../modals/bymonth_modals/EditRowByMonth";
import ViewRowModal from "../../modals/bymonth_modals/ViewRowByMonth";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { jsPDF } from "jspdf";
import { AiOutlineEdit, AiOutlineEye, AiOutlineSearch } from "react-icons/ai";
import { MdAdd, MdDelete } from "react-icons/md";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaDownload,
} from "react-icons/fa";

jsPDF.prototype.autoTable = autoTable;

interface InvoiceData {
  id: number;
  invoicenumber: string;
  startdate: string;
  enddate: string;
  invoicedate: string;
  invmonth: string;
  quantity: number;
  otquantity: number;
  rate: number;
  overtimerate: number;
  status: string;
  emppaiddate: string;
  candpaymentstatus: string;
  reminders: string;
  amountexpected: number;
  expecteddate: string;
  amountreceived: number;
  receiveddate: string;
  releaseddate: string;
  checknumber: string;
  invoiceurl: string;
  checkurl: string;
  freqtype: string;
  invoicenet: number;
  companyname: string;
  vendorfax: string;
  vendorphone: string;
  vendoremail: string;
  timsheetemail: string;
  hrname: string;
  hremail: string;
  hrphone: string;
  managername: string;
  manageremail: string;
  managerphone: string;
  secondaryname: string;
  secondaryemail: string;
  secondaryphone: string;
  candidatename: string;
  candidatephone: string;
  candidateemail: string;
  wrkemail: string;
  wrkphone: string;
  recruitername: string;
  recruiterphone: string;
  recruiteremail: string;
  poid: number;
  notes: string;
}

interface MonthGroup {
  invmonth: string;
  invoices: InvoiceData[];
  isGroup?: boolean;
  isCollapsed?: boolean;
  invoice_count: number;
}

interface RowData extends InvoiceData {
  isGroupRow?: boolean;
  level?: number;
  expanded?: boolean;
  name?: string;
}

interface AlertMessage {
  text: string;
  type: "success" | "error";
}

interface ModalState {
  add: boolean;
  view: boolean;
  edit: boolean;
  selectedRow: InvoiceData | null;
}

const ByMonth = () => {
  const gridRef = useRef<AgGridReact<RowData>>(null);
  const [modalState, setModalState] = useState<ModalState>({
    add: false,
    view: false,
    edit: false,
    selectedRow: null,
  });
  const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [monthGroups, setMonthGroups] = useState<MonthGroup[]>([]);
  const [expandedMonthGroups, setExpandedMonthGroups] = useState<{
    [key: string]: boolean;
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<{ id: number; pname: string }[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const pageSize = 10;

  const showAlert = (text: string, type: "success" | "error") => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 3000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // First fetch the month list
      const monthResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/invoices/month-list`,
        {
          params: {
            page: currentPage,
            page_size: pageSize,
            search: debouncedSearchValue || undefined,
          }
        }
      );
      
      // Then fetch detailed data for all months
      const detailedResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/invoices/dataByMonth`,
        {
          params: {
            page: currentPage,
            page_size: pageSize,
            search: debouncedSearchValue || undefined,
          }
        }
      );
      
      // Merge the data
      const mergedData = monthResponse.data.map((monthItem: { invmonth: string }) => {
        const detailedMonth = detailedResponse.data.data.find(
          (d: { invmonth: string; invoices: InvoiceData[] }) => d.invmonth === monthItem.invmonth
        );
        
        return {
          invmonth: monthItem.invmonth,
          invoices: detailedMonth ? detailedMonth.invoices : [],
          isGroup: true,
          isCollapsed: expandedMonthGroups[monthItem.invmonth] || false,
          invoice_count: detailedMonth ? detailedMonth.invoices.length : 0
        };
      });
      
      setMonthGroups(mergedData);
      setTotalPages(monthResponse.data.pages || 1);
      setClients(detailedResponse.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      showAlert("Error loading data", "error");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchValue, expandedMonthGroups]);

  useEffect(() => {
    fetchData();
  }, [fetchData, currentPage, debouncedSearchValue  ]);

  const toggleGroup = (month: string) => {
    setSelectedMonth(month);
    setExpandedMonthGroups((prev) => ({
      ...prev,
      [month]: !prev[month],
    }));
  };

  const rowData = useMemo(() => {
    const rows: RowData[] = [];
    
    monthGroups.forEach((monthGroup) => {
      // Add month group row
      rows.push({
        id: -1, // Use negative ID for group rows
        name: monthGroup.invmonth,
        invoicenumber: "",
        startdate: "",
        enddate: "",
        invoicedate: "",
        invmonth: monthGroup.invmonth,
        quantity: 0,
        otquantity: 0,
        rate: 0,
        overtimerate: 0,
        status: "",
        emppaiddate: "",
        candpaymentstatus: "",
        reminders: "",
        amountexpected: 0,
        expecteddate: "",
        amountreceived: 0,
        receiveddate: "",
        releaseddate: "",
        checknumber: "",
        invoiceurl: "",
        checkurl: "",
        freqtype: "",
        invoicenet: 0,
        companyname: "",
        vendorfax: "",
        vendorphone: "",
        vendoremail: "",
        timsheetemail: "",
        hrname: "",
        hremail: "",
        hrphone: "",
        managername: "",
        manageremail: "",
        managerphone: "",
        secondaryname: "",
        secondaryemail: "",
        secondaryphone: "",
        candidatename: "",
        candidatephone: "",
        candidateemail: "",
        wrkemail: "",
        wrkphone: "",
        recruitername: "",
        recruiterphone: "",
        recruiteremail: "",
        poid: 0,
        notes: "",
        isGroupRow: true,
        level: 0,
        expanded: expandedMonthGroups[monthGroup.invmonth],
      });

      // Add child rows if expanded
      if (expandedMonthGroups[monthGroup.invmonth] && monthGroup.invoices) {
        monthGroup.invoices.forEach((invoice) => {
          rows.push({
            ...invoice,
            name: `${invoice.invoicenumber} - ${monthGroup.invmonth}`,
            isGroupRow: false,
            level: 1,
          });
        });
      }
    });
    
    return rows;
  }, [monthGroups, expandedMonthGroups]);

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Month",
        field: "name",
        cellRenderer: (params: { data: RowData; value: string }) => {
          if (params.data.isGroupRow) {
            const expanded = expandedMonthGroups[params.data.invmonth];
            return (
              <div className="flex items-center">
                <span
                  className="cursor-pointer pl-1 flex items-center hover:bg-gray-100 rounded-md py-1 px-2 transition-colors duration-200"
                  onClick={() => toggleGroup(params.data.invmonth)}
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
                  <span className="ml-2 text-sm text-gray-500">
                    {/* ({params.data.invoice_count || 0} invoices) */}
                  </span>
                </span>
              </div>
            );
          }
          return <span className="pl-8">{params.value}</span>;
        },
        minWidth: 250,
        flex: 1,
      },
      {
        headerName: "Invoice Number",
        field: "invoicenumber",
        hide: false,
        minWidth: 150,
      },
      {
        headerName: "Company",
        field: "companyname",
        hide: false,
        minWidth: 150,
      },
      {
        headerName: "Start Date",
        field: "startdate",
        hide: false,
        minWidth: 120,
      },
      {
        headerName: "End Date",
        field: "enddate",
        hide: false,
        minWidth: 120,
      },
      {
        headerName: "Invoice Date",
        field: "invoicedate",
        hide: false,
        minWidth: 120,
      },
      {
        headerName: "Amount Expected",
        field: "amountexpected",
        hide: false,
        minWidth: 120,
        valueFormatter: (params: { value: number }) => {
          return params.value ? `$${params.value.toFixed(2)}` : '';
        }
      },
      {
        headerName: "Amount Received",
        field: "amountreceived",
        hide: false,
        minWidth: 120,
        valueFormatter: (params: { value: number }) => {
          return params.value ? `$${params.value.toFixed(2)}` : '';
        }
      },
      {
        headerName: "Status",
        field: "status",
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
                headerName: "Amount Expected",
                field: "amountexpected" as keyof RowData,
                hide: false,
                minWidth: 120,
              },
              {
                headerName: "Expected Date",
                field: "expecteddate" as keyof RowData,
                hide: false,
                minWidth: 120,
              },
              {
                headerName: "Amount Received",
                field: "amountreceived" as keyof RowData,
                hide: false,
                minWidth: 120,
              },
              {
                headerName: "Received Date",
                field: "receiveddate" as keyof RowData,
                hide: false,
                minWidth: 120,
              },
              {
                headerName: "Released Date",
                field: "releaseddate" as keyof RowData,
                hide: false,
                minWidth: 120,
              },
              {
                headerName: "Check Number",
                field: "checknumber" as keyof RowData,
                hide: false,
                minWidth: 120,
              },
              {
                headerName: "Invoice URL",
                field: "invoiceurl" as keyof RowData,
                hide: false,
                minWidth: 120,
              },
              {
                headerName: "Check URL",
                field: "checkurl" as keyof RowData,
                hide: false,
                minWidth: 120,
              },
              {
                headerName: "Freq Type",
                field: "freqtype" as keyof RowData,
                hide: false,
                minWidth: 100,
              },
              {
                headerName: "Invoice Net",
                field: "invoicenet" as keyof RowData,
                hide: false,
                minWidth: 100,
              },
              {
                headerName: "Company Name",
                field: "companyname" as keyof RowData,
                hide: false,
                minWidth: 150,
              },
              {
                headerName: "Vendor Fax",
                field: "vendorfax" as keyof RowData,
                hide: false,
                minWidth: 120,
              },
              {
                headerName: "Vendor Phone",
                field: "vendorphone" as keyof RowData,
                hide: false,
                minWidth: 120,
              },
              {
                headerName: "Vendor Email",
                field: "vendoremail" as keyof RowData,
                hide: false,
                minWidth: 150,
              },
              {
                headerName: "Timesheet Email",
                field: "timsheetemail" as keyof RowData,
                hide: false,
                minWidth: 150,
              },
              {
                headerName: "HR Name",
                field: "hrname" as keyof RowData,
                hide: false,
                minWidth: 120,
              },
              {
                headerName: "HR Email",
                field: "hremail" as keyof RowData,
                hide: false,
                minWidth: 150,
              },
              {
                headerName: "HR Phone",
                field: "hrphone" as keyof RowData,
                hide: false,
                minWidth: 120,
              },
              {
                headerName: "Manager Name",
                field: "managername" as keyof RowData,
                hide: false,
                minWidth: 120,
              },
              {
                headerName: "Manager Email",
                field: "manageremail" as keyof RowData,
                hide: false,
                minWidth: 150,
              },
              {
                headerName: "Manager Phone",
                field: "managerphone" as keyof RowData,
                hide: false,
                minWidth: 120,
              },
              {
                headerName: "Secondary Name",
                field: "secondaryname" as keyof RowData,
                hide: false,
                minWidth: 120,
              },
              {
                headerName: "Secondary Email",
                field: "secondaryemail" as keyof RowData,
                hide: false,
                minWidth: 150,
              },
              {
                headerName: "Secondary Phone",
                field: "secondaryphone" as keyof RowData,
                hide: false,
                minWidth: 120,
              },
              {
                headerName: "Candidate Name",
                field: "candidatename" as keyof RowData,
                hide: false,
                minWidth: 150,
              },
              {
                headerName: "Candidate Phone",
                field: "candidatephone" as keyof RowData,
                hide: false,
                minWidth: 120,
              },
              {
                headerName: "Candidate Email",
                field: "candidateemail" as keyof RowData,
                hide: false,
                minWidth: 150,
              },
              {
                headerName: "Work Email",
                field: "wrkemail" as keyof RowData,
                hide: false,
                minWidth: 150,
              },
              {
                headerName: "Work Phone",
                field: "wrkphone" as keyof RowData,
                hide: false,
                minWidth: 120,
              },
              {
                headerName: "Recruiter Name",
                field: "recruitername" as keyof RowData,
                hide: false,
                minWidth: 150,
              },
              {
                headerName: "Recruiter Phone",
                field: "recruiterphone" as keyof RowData,
                hide: false,
                minWidth: 120,
              },
              {
                headerName: "Recruiter Email",
                field: "recruiteremail" as keyof RowData,
                hide: false,
                minWidth: 150,
              },
              {
                headerName: "Notes",
                field: "notes" as keyof RowData,
                hide: false,
                minWidth: 200,
              },













    ],
    [expandedMonthGroups]
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleAdd = async (formData: InvoiceData) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/invoices/post/`,
        formData
      );
      showAlert("Invoice added successfully", "success");
      setModalState({ ...modalState, add: false });
      fetchData();
    } catch (error) {
      console.error("Error adding invoice:", error);
    }
  };

  const handleEdit = async (formData: InvoiceData) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/invoices/put/${formData.id}`,
        formData
      );
      showAlert("Invoice updated successfully", "success");
      setModalState({ ...modalState, edit: false });
      fetchData();
    } catch (error) {
      showAlert("Error updating invoice", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/invoices/delete/${id}`
        );
        showAlert("Invoice deleted successfully", "success");
        fetchData();
      } catch (error) {
        showAlert("Error deleting invoice", "error");
      }
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const tableData = rowData
      .filter((row) => !row.isGroupRow && row.id !== -1)
      .map((row) => [
        row.companyname,
        row.invoicenumber,
        row.startdate,
        row.enddate,
        row.invoicedate,
        row.quantity,
        row.otquantity,
        row.rate,
        row.overtimerate,
        row.status,
        row.amountexpected,
        row.expecteddate,
        row.amountreceived,
        row.receiveddate,
      ]);

    autoTable(doc, {
      head: [
        [
          "Company",
          "Invoice Number",
          "Start Date",
          "End Date",
          "Invoice Date",
          "Quantity",
          "OT Quantity",
          "Rate",
          "Overtime Rate",
          "Status",
          "Amount Expected",
          "Expected Date",
          "Amount Received",
          "Received Date",
        ],
      ],
      body: tableData,
      styles: { fontSize: 8 },
      margin: { top: 20 },
    });

    doc.save("invoices-by-month.pdf");
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || (i >= currentPage - 1 && i <= currentPage + 1)) {
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
        <h1 className="text-3xl font-bold text-gray-800">Invoice Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setModalState({ ...modalState, add: true })}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700"
          >
            <MdAdd className="mr-2" />
          </button>
          <button
            onClick={() => {
              const selectedRows = gridRef.current?.api.getSelectedRows();
              if (selectedRows?.length > 0 && !selectedRows[0].isGroupRow) {
                setModalState({
                  ...modalState,
                  edit: true,
                  selectedRow: selectedRows[0],
                });
              } else {
                showAlert("Please select an invoice to edit", "error");
              }
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700"
          >
            <AiOutlineEdit className="mr-2" />
          </button>
          <button
            onClick={() => {
              const selectedRows = gridRef.current?.api.getSelectedRows();
              if (selectedRows?.length > 0 && !selectedRows[0].isGroupRow) {
                handleDelete(selectedRows[0].id);
              } else {
                showAlert("Please select an invoice to delete", "error");
              }
            }}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700"
          >
            <MdDelete className="mr-2" />
          </button>
          <button
            onClick={() => {
              const selectedRows = gridRef.current?.api.getSelectedRows();
              if (selectedRows?.length > 0 && !selectedRows[0].isGroupRow) {
                setModalState({
                  ...modalState,
                  view: true,
                  selectedRow: selectedRows[0],
                });
              } else {
                showAlert("Please select an invoice to view", "error");
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
        className="ag-theme-alpine relative"
        style={{ height: "400px", width: "100%", overflowY: "auto" }}
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
            cellStyle: { color: "#333", fontSize: "0.75rem", padding: "1px" },
            minWidth: 60,
          }}
          suppressRowClickSelection={false}
          rowSelection="single"
          rowHeight={30}
          headerHeight={35}
          overlayLoadingTemplate={
            '<span class="ag-overlay-loading-center">Loading...</span>'
          }
          overlayNoRowsTemplate={
            '<span class="ag-overlay-no-rows-center">No rows to show</span>'
          }
          onGridReady={(params) => {
            params.api.sizeColumnsToFit();
          }}
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

          {renderPageNumbers()}

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
        </div>
        <span className="ml-4 text-sm text-gray-600">
          Page {currentPage} of {totalPages} | Total Records:{" "}
          {monthGroups && monthGroups.length > 0
            ? monthGroups.reduce((acc, monthGroup) => acc + monthGroup.invoice_count, 0)
            : 0}
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
        invoice={modalState.selectedRow}
      />

      <EditRowModal
        isOpen={modalState.edit}
        onClose={() => setModalState({ ...modalState, edit: false })}
        rowData={modalState.selectedRow as InvoiceData}
        onSave={fetchData}
        clients={clients}
        defaultClientId={selectedMonth || modalState.selectedRow?.poid || 0}
      />
      
    </div>
  );
};

export default ByMonth;

import { useEffect } from 'react';

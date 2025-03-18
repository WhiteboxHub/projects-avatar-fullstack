// ***********************************************************

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
// import Accordion from "../../components/Accordion"; // Import the Accordion component
// import { MdDelete } from "react-icons/md";
// import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
// import {
//   AiOutlineEdit,
//   AiOutlineEye,
//   AiOutlineSearch,
//   AiOutlineReload,
// } from "react-icons/ai";
// import { MdAdd } from "react-icons/md";
// import type { ByPO } from "../../types/index"; // Use type-only import

// jsPDF.prototype.autoTable = autoTable;
// const ByPO = () => {
//   const [rowData, setRowData] = useState<ByPO[]>([]);
//   const [columnDefs, setColumnDefs] = useState<
//     { headerName: string; field: string }[]
//   >([]);
//   const [paginationPageSize] = useState<number>(100);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [totalRows, setTotalRows] = useState<number>(0);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [selectedRow, setSelectedRow] = useState<ByPO | null>(null);
//   const [expandedRow, setExpandedRow] = useState<ByPO | null>(null); // New state for expanded row
//   const [detailedData, setDetailedData] = useState<ByPO | null>(null); // New state for detailed data
//   const [alertMessage, setAlertMessage] = useState<string | null>(null); // Added state for alert message
//   const [searchValue, setSearchValue] = useState<string>("");
//   const gridRef = useRef<AgGridReact>(null);

//   const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/admin"; // Ensure this matches your backend URL

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${API_URL}/invoices`, {
//         params: {
//           page: currentPage,
//           pageSize: paginationPageSize,
//         },
//         headers: { AuthToken: localStorage.getItem("token") },
//       });

//       const data = response.data;
//       if (Array.isArray(data)) {
//         console.log("Fetched data:", data); // Log the fetched data
//         setRowData(data);
//         setTotalRows(data.length);
//         setupColumns(data);
//       } else {
//         console.error("Data is not an array:", data);
//       }
//     } catch (error) {
//       console.error("Error loading data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchByPOs = async (searchQuery = "") => {
//     try {
//       const response = await axios.get(`${API_URL}/invoices`, {
//         params: {
//           page: currentPage,
//           pageSize: paginationPageSize,
//           search: searchQuery,
//         },
//         headers: { AuthToken: localStorage.getItem("token") },
//       });

//       const { data, totalRows } = response.data;
//       console.log("Fetched data with search query:", data); // Log the fetched data
//       setRowData(data);
//       setTotalRows(totalRows);
//       setupColumns(data);
//     } catch (error) {
//       console.error("Error loading data:", error);
//     }
//   };

//   const handleSearch = () => {
//     fetchByPOs(searchValue);
//   };

//   // const setupColumns = (data) => {
//   //   if (Array.isArray(data) && data.length > 0) {
//   //     const columns = Object.keys(data[0]).map((key) => ({
//   //       headerName: key.charAt(0).toUpperCase() + key.slice(1),
//   //       field: key,
//   //     }));
      
//   //     setColumnDefs(columns);
//   //   } else {
//   //     console.warn("Data is not an array or is empty:", data);
//   //   }
//   // };

//   const setupColumns = (data) => {
//     if (Array.isArray(data) && data.length > 0) {
//       const columns = Object.keys(data[0]).map((key) => {
//         const columnDef = {
//           headerName: key.charAt(0).toUpperCase() + key.slice(1),
//           field: key,
//         };
//         // Set custom width for the 'pname' column
//         if (key === 'pname') {
//           columnDef.width = 1200; // Adjust the width as needed
//         }
//         return columnDef;
//       });
//       setColumnDefs(columns);
//     } else {
//       console.warn("Data is not an array or is empty:", data);
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
//         const byPoId = selectedRows[0].byPoid || selectedRows[0].id;
//         if (byPoId) {
//           const confirmation = window.confirm(
//             `Are you sure you want to delete By PO ID ${byPoId}?`
//           );
//           if (!confirmation) return;

//           try {
//             await axios.delete(`${API_URL}/by-po/delete/${byPoId}`, {
//               headers: { AuthToken: localStorage.getItem("token") },
//             });
//             alert("By PO deleted successfully.");
//             fetchData();
//           } catch (error) {
//             const axiosError = error as AxiosError;
//             alert(
//                 `Failed to delete By PO: ${
//                     (axiosError.response?.data as ErrorResponse)?.message || axiosError.message
//                 }`
//             );
//           }
//         } else {
//           alert("No valid By PO ID found for the selected row.");
//         }
//       } else {
//         setAlertMessage("Please select a row to delete."); // Set alert message
//         setTimeout(() => setAlertMessage(null), 3000); // Clear alert message after 3 seconds
//       }
//     }
//   };

//   const handlePageChange = (newPage: number) => setCurrentPage(newPage);

//   const handleViewRow = async (event: React.MouseEvent<HTMLElement>) => {
//     if (gridRef.current) {
//       const selectedRows = gridRef.current.api.getSelectedRows();
//       if (selectedRows.length > 0) {
//         const invoiceId = selectedRows[0].id; // Assuming the ID is stored in the 'id' field
//         try {
//           const response = await axios.get(`${API_URL}/invoices/${invoiceId}`, {
//             headers: { AuthToken: localStorage.getItem("token") },
//           });
//           setExpandedRow(response.data); // Store expanded row data in the state
//         } catch (error) {
//           console.error("Error fetching detailed data:", error);
//         }
//       } else {
//         setAlertMessage("Please select a row to view."); // Set alert message
//         setTimeout(() => setAlertMessage(null), 3000); // Clear alert message after 3 seconds
//       }
//     }
//   };

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     doc.text("By PO Data", 20, 10);
//     const pdfData = rowData.map((row) => Object.values(row));
//     const headers = columnDefs.map((col) => col.headerName);
//     autoTable(doc, {
//       head: [headers],
//       body: pdfData,
//       theme: 'grid',
//       styles: { fontSize: 5 },
//     });
//     doc.save("by_po_data.pdf");
//   };

//   const totalPages = Math.ceil(totalRows / paginationPageSize);
//   const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

//   return (
//     <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md relative">
//       {alertMessage && ( // Conditional rendering of alert message
//         <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded-md shadow-md z-50">
//           {alertMessage}
//         </div>
//       )}
//       <div className="flex justify-between items-center mb-4">
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
//               maxWidth: 1300,
//             }}
//             rowHeight={30}
//             headerHeight={35}
//             onRowClicked={handleViewRow} 
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

//       {expandedRow && (
//         <Accordion header={`Details for Invoice ID: ${expandedRow.id}`}>
//           <pre>{JSON.stringify(expandedRow, null, 2)}</pre>
//         </Accordion>
//       )}
//     </div>
//   );
// };

// export default ByPO;

// *****************************************************************************



// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { AxiosError } from 'axios';
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import 'ag-grid-enterprise'; // Import AG Grid Enterprise
// import { FaDownload } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";
// import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
// import {
//   AiOutlineEdit,
//   AiOutlineEye,
//   AiOutlineSearch,
//   AiOutlineReload,
// } from "react-icons/ai";
// import { MdAdd } from "react-icons/md";
// import type { ByPO } from "../../types/index"; // Use type-only import

// jsPDF.prototype.autoTable = autoTable;

// const ByPO = () => {
//   const [rowData, setRowData] = useState<ByPO[]>([]);
//   const [columnDefs, setColumnDefs] = useState<
//     { headerName: string; field: string }[]
//   >([]);
//   const [paginationPageSize] = useState<number>(100);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [totalRows, setTotalRows] = useState<number>(0);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [selectedRow, setSelectedRow] = useState<ByPO | null>(null);
//   const [alertMessage, setAlertMessage] = useState<string | null>(null); // Added state for alert message
//   const [searchValue, setSearchValue] = useState<string>("");
//   const gridRef = useRef<AgGridReact>(null);

//   const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/admin"; // Ensure this matches your backend URL

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${API_URL}/invoices`, {
//         params: {
//           page: currentPage,
//           pageSize: paginationPageSize,
//         },
//         headers: { AuthToken: localStorage.getItem("token") },
//       });

//       const data = response.data;
//       if (Array.isArray(data)) {
//         console.log("Fetched data:", data); // Log the fetched data
//         setRowData(data);
//         setTotalRows(data.length);
//         setupColumns(data);
//       } else {
//         console.error("Data is not an array:", data);
//       }
//     } catch (error) {
//       console.error("Error loading data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchByPOs = async (searchQuery = "") => {
//     try {
//       const response = await axios.get(`${API_URL}/invoices`, {
//         params: {
//           page: currentPage,
//           pageSize: paginationPageSize,
//           search: searchQuery,
//         },
//         headers: { AuthToken: localStorage.getItem("token") },
//       });

//       const { data, totalRows } = response.data;
//       console.log("Fetched data with search query:", data); // Log the fetched data
//       setRowData(data);
//       setTotalRows(totalRows);
//       setupColumns(data);
//     } catch (error) {
//       console.error("Error loading data:", error);
//     }
//   };

//   const handleSearch = () => {
//     fetchByPOs(searchValue);
//   };

//   const setupColumns = (data) => {
//     if (Array.isArray(data) && data.length > 0) {
//       const columns = Object.keys(data[0]).map((key) => {
//         const columnDef = {
//           headerName: key.charAt(0).toUpperCase() + key.slice(1),
//           field: key,
//         };
//         // Set custom width for the 'pname' column
//         if (key === 'pname') {
//           columnDef.width = 1200; // Adjust the width as needed
//         }
//         return columnDef;
//       });
//       setColumnDefs(columns);
//     } else {
//       console.warn("Data is not an array or is empty:", data);
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
//         const byPoId = selectedRows[0].byPoid || selectedRows[0].id;
//         if (byPoId) {
//           const confirmation = window.confirm(
//             `Are you sure you want to delete By PO ID ${byPoId}?`
//           );
//           if (!confirmation) return;

//           try {
//             await axios.delete(`${API_URL}/by-po/delete/${byPoId}`, {
//               headers: { AuthToken: localStorage.getItem("token") },
//             });
//             alert("By PO deleted successfully.");
//             fetchData();
//           } catch (error) {
//             const axiosError = error as AxiosError;
//             alert(
//                 `Failed to delete By PO: ${
//                     (axiosError.response?.data as ErrorResponse)?.message || axiosError.message
//                 }`
//             );
//           }
//         } else {
//           alert("No valid By PO ID found for the selected row.");
//         }
//       } else {
//         setAlertMessage("Please select a row to delete."); // Set alert message
//         setTimeout(() => setAlertMessage(null), 3000); // Clear alert message after 3 seconds
//       }
//     }
//   };

//   const handlePageChange = (newPage: number) => setCurrentPage(newPage);

//   const handleViewRow = async (event: React.MouseEvent<HTMLElement>) => {
//     if (gridRef.current) {
//       const selectedRows = gridRef.current.api.getSelectedRows();
//       if (selectedRows.length > 0) {
//         const invoiceId = selectedRows[0].id; // Assuming the ID is stored in the 'id' field
//         try {
//           const response = await axios.get(`${API_URL}/invoices/${invoiceId}`, {
//             headers: { AuthToken: localStorage.getItem("token") },
//           });

//           // Assuming the additional data is in response.data.details
//           const additionalData = response.data.details;

//           // Update the row data to include the additional data
//           const updatedRowData = rowData.map(row => {
//             if (row.id === invoiceId) {
//               return { ...row, details: additionalData };
//             }
//             return row;
//           });

//           setRowData(updatedRowData);

//           // Trigger the grid to expand the row
//           gridRef.current.api.forEachNode(node => {
//             if (node.data.id === invoiceId) {
//               node.setExpanded(true);
//             }
//           });
//         } catch (error) {
//           console.error("Error fetching detailed data:", error);
//         }
//       } else {
//         setAlertMessage("Please select a row to view."); // Set alert message
//         setTimeout(() => setAlertMessage(null), 3000); // Clear alert message after 3 seconds
//       }
//     }
//   };

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     doc.text("By PO Data", 20, 10);
//     const pdfData = rowData.map((row) => Object.values(row));
//     const headers = columnDefs.map((col) => col.headerName);
//     autoTable(doc, {
//       head: [headers],
//       body: pdfData,
//       theme: 'grid',
//       styles: { fontSize: 5 },
//     });
//     doc.save("by_po_data.pdf");
//   };

//   const totalPages = Math.ceil(totalRows / paginationPageSize);
//   const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

//   return (
//     <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md relative">
//       {alertMessage && ( // Conditional rendering of alert message
//         <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded-md shadow-md z-50">
//           {alertMessage}
//         </div>
//       )}
//       <div className="flex justify-between items-center mb-4">
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
//               maxWidth: 1300,
//             }}
//             rowHeight={30}
//             headerHeight={35}
//             onRowClicked={handleViewRow}
//             masterDetail={true} // Enable master-detail
//             detailCellRendererParams={{
//               detailGridOptions: {
//                 columnDefs: [
//                   // Define columns for the detailed view
//                   { field: 'detailField1', headerName: 'Detail 1' },
//                   { field: 'detailField2', headerName: 'Detail 2' },
//                   // Add more columns as needed
//                 ],
//                 // Other grid options for the detail view
//               },
//               getDetailRowData: (params) => {
//                 // Return the additional data for the selected row
//                 return params.data.details;
//               },
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
//     </div>
//   );
// };

// export default ByPO;

// __________________________________________________



"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
// import { AxiosError } from 'axios';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { FaDownload } from "react-icons/fa";
import Accordion from "../../components/Accordion"; // Import the Accordion component
import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import {
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlineSearch,
  AiOutlineReload,
} from "react-icons/ai";
import { MdAdd } from "react-icons/md";
import type { ByPO } from "../../types/index"; // Use type-only import

jsPDF.prototype.autoTable = autoTable;
const ByPO = () => {
  const [rowData, setRowData] = useState<ByPO[]>([]);
  const [columnDefs, setColumnDefs] = useState<
    { headerName: string; field: string }[]
  >([]);
  const [paginationPageSize] = useState<number>(100);
  // const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedRow, setExpandedRow] = useState<ByPO | null>(null); // New state for expanded row
  const [alertMessage, setAlertMessage] = useState<string | null>(null); // Added state for alert message
  const [searchValue, setSearchValue] = useState<string>("");
  const gridRef = useRef<AgGridReact>(null);
  const [modalState, setModalState] = useState({ add: false, edit: false }); //eslint-disable-line @typescript-eslint/no-unused-vars
  const [selectedRow, setSelectedRow] = useState<ByPO | null>(null); // eslint-disable-line @typescript-eslint/no-unused-vars

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/admin"; // Ensure this matches your backend URL

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/invoices`, {
        params: {
          page: currentPage,
          pageSize: paginationPageSize,
        },
        headers: { AuthToken: localStorage.getItem("token") },
      });

      const data = response.data;
      if (Array.isArray(data)) {
        console.log("Fetched data:", data); // Log the fetched data
        setRowData(data);
        setTotalRows(data.length);
        setupColumns(data);
      } else {
        console.error("Data is not an array:", data);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchByPOs = async (searchQuery = "") => {
    try {
      const response = await axios.get(`${API_URL}/invoices`, {
        params: {
          page: currentPage,
          pageSize: paginationPageSize,
          search: searchQuery,
        },
        headers: { AuthToken: localStorage.getItem("token") },
      });

      const { data, totalRows } = response.data;
      console.log("Fetched data with search query:", data); // Log the fetched data
      setRowData(data);
      setTotalRows(totalRows);
      setupColumns(data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchData(); // Fetch data for the new page
  };
  //   const handlePageChange = (newPage: number) => setCurrentPage(newPage);

  const handleSearch = () => {
    fetchByPOs(searchValue);
  };

  // const setupColumns = (data) => {
  //   if (Array.isArray(data) && data.length > 0) {
  //     const columns = Object.keys(data[0]).map((key) => {
  //       const columnDef = {
  //         headerName: key.charAt(0).toUpperCase() + key.slice(1),
  //         field: key,
  //       };
  //       // Set custom width for the 'pname' column
  //       if (key === 'pname') {
  //         columnDef.width = 1200; // Adjust the width as needed
  //       }
  //       return columnDef;
  //     });
  //     setColumnDefs(columns);
  //   } else {
  //     console.warn("Data is not an array or is empty:", data);
  //   }
  // };

  const setupColumns = (data: ByPO[]) => {
    if (Array.isArray(data) && data.length > 0) {
      const columns = Object.keys(data[0]).map((key) => {
        const columnDef: { headerName: string; field: string; width?: number } = {
          headerName: key.charAt(0).toUpperCase() + key.slice(1),
          field: key,
        };
        // Set custom width for the 'pname' column
        if (key === 'pname') {
          columnDef.width = 1200; // Adjust the width as needed
        }
        return columnDef;
      });
      setColumnDefs(columns);
    } else {
      console.warn("Data is not an array or is empty:", data);
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
        setAlertMessage("Please select a row to edit."); // Set alert message
        setTimeout(() => setAlertMessage(null), 3000); // Clear alert message after 3 seconds
      }
    }
  };

  const handleViewRow = async () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        const invoiceId = selectedRows[0].id; // Assuming the ID is stored in the 'id' field
        try {
          const response = await axios.get(`${API_URL}/invoices/${invoiceId}`, {
            headers: { AuthToken: localStorage.getItem("token") },
          });
          setExpandedRow(response.data); // Store expanded row data in the state
        } catch (error) {
          console.error("Error fetching detailed data:", error);
        }
      } else {
        setAlertMessage("Please select a row to view."); // Set alert message
        setTimeout(() => setAlertMessage(null), 3000); // Clear alert message after 3 seconds
      }
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("By PO Data", 20, 10);
    const pdfData = rowData.map((row) => Object.values(row));
    const headers = columnDefs.map((col) => col.headerName);
    autoTable(doc, {
      head: [headers],
      body: pdfData,
      theme: 'grid',
      styles: { fontSize: 5 },
    });
    doc.save("by_po_data.pdf");
  };

  const totalPages = Math.ceil(totalRows / paginationPageSize);
  const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md relative">
      {alertMessage && ( // Conditional rendering of alert message
        <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded-md shadow-md z-50">
          {alertMessage}
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
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
        <div
          className="ag-theme-alpine"
          style={{ height: "400px", width: "100%", overflowY: "auto" }}
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
              cellStyle: { color: "#333", fontSize: "0.75rem", padding: "1px" },
              minWidth: 60,
              maxWidth: 1300,
            }}
            rowHeight={30}
            headerHeight={35}
            onRowClicked={handleViewRow}
          />
        </div>
      )}

      <div className="flex justify-between mt-4">
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

      {expandedRow && (
        <Accordion header={`Details for Invoice ID: ${expandedRow.id}`}>
          <pre>{JSON.stringify(expandedRow, null, 2)}</pre>
        </Accordion>
      )}
    </div>
  );
};

export default ByPO;

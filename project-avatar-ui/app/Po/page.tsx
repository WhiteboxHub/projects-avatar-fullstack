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
// import AddRowModal from "../../modals/po_modals/AddRowPo";
// import EditRowModal from "../../modals/po_modals/EditRowPo";
// import ViewRowModal from "../../modals/po_modals/ViewRowPo";
// import { MdDelete } from "react-icons/md";
// import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
// import {
//   AiOutlineEdit,
//   AiOutlineEye,
//   AiOutlineSearch,
//   AiOutlineReload,
// } from "react-icons/ai";
// import { MdAdd } from "react-icons/md";
// import { Po } from "../../../types/index";

// jsPDF.prototype.autoTable = autoTable;
// const PO = () => {
//   const [rowData, setRowData] = useState<PO[]>([]);
//   const [columnDefs, setColumnDefs] = useState<
//     { headerName: string; field: string }[]
//   >([]);
//   const [paginationPageSize] = useState<number>(100);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [totalRows, setTotalRows] = useState<number>(0);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [modalState, setModalState] = useState<{
//     add: boolean;
//     edit: boolean;
//     view: boolean;
//   }>({ add: false, edit: false, view: false });
//   const [selectedRow, setSelectedRow] = useState<Po | null>(null);
//   const [searchField, setSearchField] = useState('');
//   const [searchValue, setSearchValue] = useState('');
//   const gridRef = useRef<AgGridReact>(null);

//   const API_URL = process.env.NEXT_PUBLIC_API_URL;
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${API_URL}/po`, {
//         params: {
//           page: currentPage,
//           pageSize: paginationPageSize,
//         },
//         headers: { AuthToken: localStorage.getItem("token") },
//       });
  
//       const { data, totalRows } = response.data;
  
//       // Add serial numbers to each row
//       const dataWithSerials = data.map((item: Po) => ({
//         ...item,
//         // serialNo: (currentPage - 1) * paginationPageSize + index + 1,
//       }));
  
//       setRowData(dataWithSerials);
//       setTotalRows(totalRows);
//       setupColumns(dataWithSerials);
//     } catch (error) {
//       console.error("Error loading data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
  
  
  
  
//   const setupColumns = (data: Po[]) => {
//     if (data.length > 0) {
//       const columns = [
//         // { headerName: "Serial No", field: "serialNo", width: 100 }, // Add this line for serial numbers
//         ...Object.keys(data[0]).map((key) => ({
//           headerName: key.charAt(0).toUpperCase() + key.slice(1),
//           field: key,
//         })),
//       ];
//       setColumnDefs(columns);
//     }
//   };
  
//   const fetchPOs = async (searchField = "", searchValue = "") => {
//     try {
//       const response = await axios.get(`${API_URL}/searchPO`, {
//         params: {
//           searchField,
//           searchValue,
//           page: currentPage,
//           pageSize: paginationPageSize,
//         },
//         headers: { AuthToken: localStorage.getItem("token") },
//       });

//       const { data, totalRows } = response.data;
//       setRowData(data);
//       setTotalRows(totalRows);
//       // setupColumns(data); // Assuming this function sets up columns for display
//     } catch (error) {
//       console.error("Error loading data:", error);
//     }
//   };

//   const handleSearch = () => {
//     fetchPOs(searchField, searchValue);
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
//         alert("Please select a row to edit.");
//       }
//     }
//   };
 
  
//   const handleDeleteRow = async () => {
//     if (gridRef.current) {
//       const selectedRows = gridRef.current.api.getSelectedRows();
//       if (selectedRows.length > 0) {
//         const poId = selectedRows[0]["PO ID"];
//         if (poId) {
//           const confirmation = window.confirm(
//             `Are you sure you want to delete PO ID ${poId}?`
//           );
//           if (!confirmation) return;
  
//           try {
//             await axios.delete(`${API_URL}/po/delete/${poId}`, {
//               headers: { AuthToken: localStorage.getItem("token") },
//             });
//             alert("PO deleted successfully.");
//             fetchData();
//           } catch (error) {
//             const axiosError = error as AxiosError;
//             alert(
//                 `Failed to delete PO: ${
//                     (axiosError.response?.data as ErrorResponse)?.message || axiosError.message
//                 }`
//             );
//           }
//         } else {
//           alert("No valid PO ID found for the selected row.");
//         }
//       } else {
//         alert("Please select a row to delete.");
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
//         alert("Please select a row to view.");
//       }
//     }
//   };
  

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     doc.text("PO Data", 20, 10);
//     const pdfData = rowData.map((row) => Object.values(row));
//     const headers = columnDefs.map((col) => col.headerName);
//     autoTable(doc, {
//       head: [headers],
//       body: pdfData,
//       theme: 'grid',
//       styles: { fontSize: 5 },
//     });
//     doc.save("po_data.pdf");
//   };

//   const totalPages = Math.ceil(totalRows / paginationPageSize);
//   const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

//   return (
//     <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md relative">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-3xl font-bold text-gray-800">Po Management</h1>
//         <div className="flex space-x-2">
//           <button
//             onClick={handleAddRow}
//             className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700"
//           >
//             <MdAdd className="mr-2" /> Add Po
//           </button>
//           <button
//             onClick={handleEditRow}
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700"
//           >
//             <AiOutlineEdit className="mr-2" /> Edit
//           </button>
//           <button
//             onClick={handleDeleteRow}
//             className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700"
//           >
//             <MdDelete className="mr-2" /> Delete
//           </button>
//           <button
//             onClick={handleViewRow}
//             className="flex items-center px-4 py-2 bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-700"
//           >
//             <AiOutlineEye className="mr-2" /> View
//           </button>
//           <button
//             onClick={handleRefresh}
//             className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md transition duration-300 hover:bg-gray-900"
//           >
//             <AiOutlineReload className="mr-2" /> Refresh
//           </button>
//           <button
//             onClick={handleDownloadPDF}
//             className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700"
//           >
//             <FaDownload className="mr-2" /> Download PDF
//           </button>
//         </div>
//       </div>
//           {/* Search Functionality */}
//           <div className="flex mb-4">
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchValue}
//            onChange={(e) => setSearchValue(e.target.value)}
//             className="border border-gray-300 rounded-md p-2 w-64"
//           />
//           <button
//             onClick={handleSearch}
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md ml-2 transition duration-300 hover:bg-blue-900"
//           >
//             <AiOutlineSearch className="mr-2" /> Search
//           </button>
//         </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-48">
//           <span className="text-xl">Loading...</span>
//         </div>
//       ) : (
//         <div
//         className="ag-theme-alpine"
//         style={{ height: "400px", width: "100%", overflowY: "auto" }}
//       >
//         <AgGridReact
//         ref={gridRef}
//         rowData={rowData}
//         columnDefs={columnDefs}
//         pagination={false}
//         domLayout="normal"
//         rowSelection="multiple"
//         defaultColDef={{
//           sortable: true,
//           filter: true,
//           cellStyle: { color: "#333", fontSize: "0.75rem", padding: "1px" },
//           minWidth: 60,
//           maxWidth: 100,
//         }}
//         rowHeight={30}
//         headerHeight={35}
//       />
//       </div>  
//       )}

//       <div className="flex justify-between mt-4">
//       <div className="flex items-center">
//         {/* Double Left Icon */}
//         <button 
//           onClick={() => handlePageChange(1)} 
//           disabled={currentPage === 1}
//           className="p-2 disabled:opacity-50"
//         >
//           <FaAngleDoubleLeft />
//         </button>
//         {/* Left Icon */}
//         <button 
//           onClick={() => handlePageChange(currentPage - 1)} 
//           disabled={currentPage === 1}
//           className="p-2 disabled:opacity-50"
//         >
//           <FaChevronLeft />
//         </button>
//         {/* Page Numbers */}
//         {pageOptions.map((page) => (
//           <button
//             key={page}
//             onClick={() => handlePageChange(page)}
//             className={`px-2 py-1 rounded-md ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
//           >
//             {page}
//           </button>
//         ))}
//         {/* Right Icon */}
//         <button 
//           onClick={() => handlePageChange(currentPage + 1)} 
//           disabled={currentPage === totalPages}
//           className="p-2 disabled:opacity-50"
//         >
//           <FaChevronRight />
//         </button>
//         {/* Double Right Icon */}
//         <button 
//           onClick={() => handlePageChange(totalPages)} 
//           disabled={currentPage === totalPages}
//           className="p-2 disabled:opacity-50"
//         >
//           <FaAngleDoubleRight />
//         </button>
//       </div>
//     </div>

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


// export default PO;







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
// import AddRowModal from "../../modals/po_modals/AddRowPo";
// import EditRowModal from "../../modals/po_modals/EditRowPo";
// import ViewRowModal from "../../modals/po_modals/ViewRowPo";
// import { MdDelete } from "react-icons/md";
// import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
// import {
//   AiOutlineEdit,
//   AiOutlineEye,
//   AiOutlineSearch,
//   AiOutlineReload,
// } from "react-icons/ai";
// import { MdAdd } from "react-icons/md";
// import { Po } from "@/types/index";

// jsPDF.prototype.autoTable = autoTable;

// const PO = () => {
//   const [rowData, setRowData] = useState<Po[]>([]);
//   const [columnDefs, setColumnDefs] = useState<{ headerName: string; field: string }[]>([]);
//   const [paginationPageSize] = useState<number>(100);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [totalRows, setTotalRows] = useState<number>(0);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [modalState, setModalState] = useState<{ add: boolean; edit: boolean; view: boolean }>({ add: false, edit: false, view: false });
//   const [selectedRow, setSelectedRow] = useState<Po | null>(null);
//   const [searchValue, setSearchValue] = useState<string>('');
//   const gridRef = useRef<AgGridReact>(null);

//   const API_URL = process.env.NEXT_PUBLIC_API_URL;

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${API_URL}/po`, {
//         params: {
//           page: currentPage,
//           pageSize: paginationPageSize,
//         },
//         headers: { AuthToken: localStorage.getItem("token") },
//       });

//       const { data, totalRows } = response.data;
//       setRowData(data);
//       setTotalRows(totalRows);
//       setupColumns(data);
//     } catch (error) {
//       console.error("Error loading data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const setupColumns = (data: Po[]) => {
//     if (data.length > 0) {
//       const columns = Object.keys(data[0]).map((key) => ({
//         headerName: key.charAt(0).toUpperCase() + key.slice(1),
//         field: key,
//       }));
//       setColumnDefs(columns);
//     }
//   };

//   const fetchPOs = async (searchValue = "") => {
//     try {
//       const response = await axios.get(`${API_URL}/po/search`, {
//         params: {
//           searchQuery: searchValue,
//           page: currentPage,
//           pageSize: paginationPageSize,
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
//     fetchPOs(searchValue);
//   };

//   useEffect(() => {
//     fetchData();
//   }, [currentPage]);

//   const handleRefresh = () => {
//     setSearchValue("");
//     fetchData();
//     window.location.reload();
//   };

//   const handleAddRow = () => setModalState((prevState) => ({ ...prevState, add: true }));

//   const handleEditRow = () => {
//     if (gridRef.current) {
//       const selectedRows = gridRef.current.api.getSelectedRows();
//       if (selectedRows.length > 0) {
//         setSelectedRow(selectedRows[0]);
//         setModalState((prevState) => ({ ...prevState, edit: true }));
//       } else {
//         alert("Please select a row to edit.");
//       }
//     }
//   };

//   const handleDeleteRow = async () => {
//     if (gridRef.current) {
//       const selectedRows = gridRef.current.api.getSelectedRows();
//       if (selectedRows.length > 0) {
//         const poId = selectedRows[0]["PO ID"];
//         if (poId) {
//           const confirmation = window.confirm(`Are you sure you want to delete PO ID ${poId}?`);
//           if (!confirmation) return;

//           try {
//             await axios.delete(`${API_URL}/po/delete/${poId}`, {
//               headers: { AuthToken: localStorage.getItem("token") },
//             });
//             alert("PO deleted successfully.");
//             fetchData();
//           } catch (error) {
//             const axiosError = error as AxiosError;
//             alert(`Failed to delete PO: ${(axiosError.response?.data as ErrorResponse)?.message || axiosError.message}`);
//           }
//         } else {
//           alert("No valid PO ID found for the selected row.");
//         }
//       } else {
//         alert("Please select a row to delete.");
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
//         alert("Please select a row to view.");
//       }
//     }
//   };

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     doc.text("PO Data", 20, 10);
//     const pdfData = rowData.map((row) => Object.values(row));
//     const headers = columnDefs.map((col) => col.headerName);
//     autoTable(doc, {
//       head: [headers],
//       body: pdfData,
//       theme: 'grid',
//       styles: { fontSize: 5 },
//     });
//     doc.save("po_data.pdf");
//   };

//   const totalPages = Math.ceil(totalRows / paginationPageSize);
//   const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

//   return (
//     <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md relative">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-3xl font-bold text-gray-800">PO Management</h1>
//         <div className="flex space-x-2">
//           <button
//             onClick={handleAddRow}
//             className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700"
//           >
//             <MdAdd className="mr-2" /> Add PO
//           </button>
//           <button
//             onClick={handleEditRow}
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700"
//           >
//             <AiOutlineEdit className="mr-2" /> Edit
//           </button>
//           <button
//             onClick={handleDeleteRow}
//             className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700"
//           >
//             <MdDelete className="mr-2" /> Delete
//           </button>
//           <button
//             onClick={handleViewRow}
//             className="flex items-center px-4 py-2 bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-700"
//           >
//             <AiOutlineEye className="mr-2" /> View
//           </button>
//           <button
//             onClick={handleRefresh}
//             className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md transition duration-300 hover:bg-gray-900"
//           >
//             <AiOutlineReload className="mr-2" /> Refresh
//           </button>
//           <button
//             onClick={handleDownloadPDF}
//             className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700"
//           >
//             <FaDownload className="mr-2" /> Download PDF
//           </button>
//         </div>
//       </div>

//       {/* Search Functionality */}
//       <div className="flex mb-4">
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
//               maxWidth: 100,
//             }}
//             rowHeight={30}
//             headerHeight={35}
//           />
//         </div>
//       )}

//       <div className="flex justify-between mt-4">
//         <div className="flex items-center">
//           {/* Double Left Icon */}
//           <button
//             onClick={() => handlePageChange(1)}
//             disabled={currentPage === 1}
//             className="p-2 disabled:opacity-50"
//           >
//             <FaAngleDoubleLeft />
//           </button>
//           {/* Left Icon */}
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="p-2 disabled:opacity-50"
//           >
//             <FaChevronLeft />
//           </button>
//           {/* Page Numbers */}
//           {pageOptions.map((page) => (
//             <button
//               key={page}
//               onClick={() => handlePageChange(page)}
//               className={`px-2 py-1 rounded-md ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
//             >
//               {page}
//             </button>
//           ))}
//           {/* Right Icon */}
//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="p-2 disabled:opacity-50"
//           >
//             <FaChevronRight />
//           </button>
//           {/* Double Right Icon */}
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

// export default PO;

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
import AddRowModal from "../../modals/po_modals/AddRowPo";
import EditRowModal from "../../modals/po_modals/EditRowPo";
import ViewRowModal from "../../modals/po_modals/ViewRowPo";
import { MdDelete } from "react-icons/md";
import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import {
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlineSearch,
  AiOutlineReload,
} from "react-icons/ai";
import { MdAdd } from "react-icons/md";
import { Po,ErrorResponse } from "@/types/index";

jsPDF.prototype.autoTable = autoTable;

const PO = () => {
  const [rowData, setRowData] = useState<Po[]>([]);
  const [columnDefs, setColumnDefs] = useState<{ headerName: string; field: string }[]>([]);
  const [paginationPageSize] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [alertMessage, setAlertMessage] = useState<string | null>(null); // Added state for alert message
  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalState, setModalState] = useState<{ add: boolean; edit: boolean; view: boolean }>({ add: false, edit: false, view: false });
  const [selectedRow, setSelectedRow] = useState<Po | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const gridRef = useRef<AgGridReact>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/po`, {
        params: {
          page: currentPage, // Send current page to the API
          pageSize: paginationPageSize, // Send page size to the API
        },
        headers: { AuthToken: localStorage.getItem("token") },
      });

      const { data, totalRows } = response.data;
      setRowData(data);
      setTotalRows(totalRows); // Set total rows from the response
      setupColumns(data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const setupColumns = (data: Po[]) => {
    if (data.length > 0) {
      const columns = Object.keys(data[0]).map((key) => ({
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
        field: key,
      }));
      setColumnDefs(columns);
    }
  };

  const fetchPOs = async (searchValue = "") => {
    try {
      const response = await axios.get(`${API_URL}/po/search`, {
        params: {
          searchQuery: searchValue,
          page: currentPage,
          pageSize: paginationPageSize,
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
    fetchPOs(searchValue);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handleRefresh = () => {
    setSearchValue("");
    fetchData();
    window.location.reload();
  };

  const handleAddRow = () => setModalState((prevState) => ({ ...prevState, add: true }));
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


  const handleDeleteRow = async () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        const poId = selectedRows[0]["PO ID"];
        if (poId) {
          const confirmation = window.confirm(`Are you sure you want to delete PO ID ${poId}?`);
          if (!confirmation) return;

          try {
            await axios.delete(`${API_URL}/po/delete/${poId}`, {
              headers: { AuthToken: localStorage.getItem("token") },
            });
            alert("PO deleted successfully.");
            fetchData();
          } catch (error) {
            const axiosError = error as AxiosError;
            alert(`Failed to delete PO: ${(axiosError.response?.data as ErrorResponse)?.message || axiosError.message}`);
          }
        } else {
          alert("No valid PO ID found for the selected row.");
        }
      } else {
        setAlertMessage("Please select a row to delete."); // Set alert message
        setTimeout(() => setAlertMessage(null), 3000); // Clear alert message after 3 seconds
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage); // Update current page
    fetchData(); // Fetch data for the new page
  };

  const handleViewRow = () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        setSelectedRow(selectedRows[0]); // Set the selected row data
        setModalState((prevState) => ({ ...prevState, view: true })); // Open the view modal
      } else {
        setAlertMessage("Please select a row to view."); // Set alert message
        setTimeout(() => setAlertMessage(null), 3000); // Clear alert message after 3 seconds
      }
    }
  };


  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("PO Data", 20, 10);
    const pdfData = rowData.map((row) => Object.values(row));
    const headers = columnDefs.map((col) => col.headerName);
    autoTable(doc, {
      head: [headers],
      body: pdfData,
      theme: 'grid',
      styles: { fontSize: 5 },
    });
    doc.save("po_data.pdf");
  };

  const totalPages = Math.ceil(totalRows / paginationPageSize); // Calculate total pages
  const startPage = Math.max(1, currentPage );
  const endPage = Math.min(totalPages, currentPage + 4);
  const pageOptions = Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage);

  return (
    <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md relative">
    {alertMessage && ( // Conditional rendering of alert message
      <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded-md shadow-md z-50">
        {alertMessage}
      </div>
    )}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">PO Management</h1></div>


        <div className="flex flex-col md:flex-row mb-4 justify-between   items-center">
        {/* Search Functionality */}
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
              maxWidth: 100,
            }}
            rowHeight={30}
            headerHeight={35}
          />
        </div>
      )}

      <div className="flex justify-between mt-4">
        <div className="flex items-center">
          {/* Double Left Icon */}
          <button 
            onClick={() => handlePageChange(1)} 
            disabled={currentPage === 1}
            className="p-2 disabled:opacity-50"
          >
            <FaAngleDoubleLeft />
          </button>
          {/* Left Icon */}
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className="p-2 disabled:opacity-50"
          >
            <FaChevronLeft />
          </button>
          {/* Page Numbers */}
          {pageOptions.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-2 py-1 rounded-md ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              {page}
            </button>
          ))}
          {/* Right Icon */}
          <button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="p-2 disabled:opacity-50"
          >
            <FaChevronRight />
          </button>
          {/* Double Right Icon */}
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

export default PO;
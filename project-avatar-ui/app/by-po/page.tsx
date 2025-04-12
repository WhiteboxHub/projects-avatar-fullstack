// "use client";

// import React, { useState, useEffect, useRef, useCallback } from "react";
// import axios from "axios";
// import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import { FaDownload, FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
// import { AiOutlineEdit, AiOutlineEye, AiOutlineSearch, AiOutlineReload } from "react-icons/ai";
// import Accordion from "../../components/Accordion";

// // Extend jsPDF with autoTable
// (jsPDF as { prototype: { autoTable: typeof autoTable } }).prototype.autoTable = autoTable;

// interface InvoiceData {
//   id?: string;
//   pname?: string;
//   startdate?: string;
//   enddate?: string;
//   invoicedate?: string;
//   expecteddate?: string;
//   receiveddate?: string;
//   releaseddate?: string;
//   emppaiddate?: string;
//   quantity?: number;
//   otquantity?: number;
//   amountexpected?: number;
//   amountreceived?: number;
//   [key: string]: unknown; // Replaces explicit 'any' for dynamic properties
// }

// interface ColumnDef {
//   headerName: string;
//   field: string;
//   width?: number;
//   type?: string;
//   valueFormatter?: (params: { value: unknown }) => string;
//   aggFunc?: string;
// }

// const ByPO = () => {
//   const [rowData, setRowData] = useState<InvoiceData[]>([]);
//   const [columnDefs, setColumnDefs] = useState<ColumnDef[]>([]);
//   const [paginationPageSize] = useState(100);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalRows, setTotalRows] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [detailedData, setDetailedData] = useState<InvoiceData[]>([]);
//   const [alertMessage, setAlertMessage] = useState<string | null>(null);
//   const [searchValue, setSearchValue] = useState("");
//   const gridRef = useRef<AgGridReact<InvoiceData>>(null);

//   const API_URL = process.env.NEXT_PUBLIC_API_URL;

//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${API_URL}/invoices`, {
//         params: {
//           page: currentPage,
//           pageSize: paginationPageSize,
//         },
//         headers: { AuthToken: localStorage.getItem("token") || "" },
//       });

//       const data = response.data;
//       if (Array.isArray(data)) {
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
//   }, [API_URL, currentPage, paginationPageSize]);

//   const fetchByPOs = async (searchQuery = "") => {
//     try {
//       const response = await axios.get(`${API_URL}/invoices`, {
//         params: {
//           page: currentPage,
//           pageSize: paginationPageSize,
//           search: searchQuery,
//         },
//         headers: { AuthToken: localStorage.getItem("token") || "" },
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
//     fetchByPOs(searchValue);
//   };

//   const setupColumns = (data: InvoiceData[]) => {
//     if (Array.isArray(data) && data.length > 0) {
//       const columns = Object.keys(data[0]).map((key) => {
//         const columnDef: ColumnDef = {
//           headerName: key.charAt(0).toUpperCase() + key.slice(1),
//           field: key,
//           width: key === 'pname' ? 200 : 150,
//         };

//         if (['startdate', 'enddate', 'invoicedate', 'expecteddate', 'receiveddate', 'releaseddate', 'emppaiddate'].includes(key)) {
//           columnDef.type = 'dateColumn';
//           columnDef.valueFormatter = (params) => {
//             if (params.value) {
//               return new Date(params.value as string).toISOString().split('T')[0];
//             }
//             return '';
//           };
//         }

//         if (['quantity', 'otquantity', 'amountexpected', 'amountreceived'].includes(key)) {
//           columnDef.type = 'numericColumn';
//           columnDef.aggFunc = 'sum';
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
//   }, [currentPage, fetchData]);

//   const handleRefresh = () => {
//     setSearchValue("");
//     fetchData();
//   };

//   const handleAddRow = () => {
//     // Implement add row functionality
//   };

//   const handleEditRow = () => {
//     if (gridRef.current && gridRef.current.api) {
//       const selectedRows = gridRef.current.api.getSelectedRows();
//       if (selectedRows.length > 0) {
//         setAlertMessage("Edit functionality not implemented yet");
//         setTimeout(() => setAlertMessage(null), 3000);
//       } else {
//         setAlertMessage("Please select a row to edit.");
//         setTimeout(() => setAlertMessage(null), 3000);
//       }
//     }
//   };

//   const handlePageChange = (newPage: number) => setCurrentPage(newPage);

//   const handleViewRow = async () => {
//     if (gridRef.current && gridRef.current.api) {
//       const selectedRows = gridRef.current.api.getSelectedRows();
//       if (selectedRows.length > 0) {
//         const invoiceId = selectedRows[0].id;
//         try {
//           const response = await axios.get(`${API_URL}/invoices/${invoiceId}`, {
//             headers: { AuthToken: localStorage.getItem("token") || "" },
//           });
//           setDetailedData(Array.isArray(response.data) ? response.data : [response.data]);
//         } catch (error) {
//           console.error("Error fetching detailed data:", error);
//         }
//       } else {
//         setAlertMessage("Please select a row to view.");
//         setTimeout(() => setAlertMessage(null), 3000);
//       }
//     }
//   };

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     doc.text("By PO Data", 20, 10);
//     const pdfData = rowData.map((row) => Object.values(row)) as (string | number)[][];
//     const headers = columnDefs.map((col) => col.headerName);

//     autoTable(doc, {
//       head: [headers],
//       body: pdfData,
//       theme: 'grid',
//       styles: { fontSize: 8 },
//     });

//     doc.save("by_po_data.pdf");
//   };

//   const totalPages = Math.ceil(totalRows / paginationPageSize);
//   const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

//   const detailedColumns = [
//     "Invoice Number", "Start Date", "End Date", "Invoice Date", "Quantity",
//     "OT Quantity", "Rate", "Overtime Rate", "Status", "Emp Paid Date",
//     "Cand Payment Status", "Reminders", "Amount Expected", "Expected Date",
//     "Amount Received", "Received Date", "Released Date", "Check Number",
//     "Invoice URL", "Check URL", "Freq Type", "Invoice Net", "Company Name",
//     "Vendor Fax", "Vendor Phone", "Vendor Email", "Timesheet Email", "HR Name",
//     "HR Email", "HR Phone", "Manager Name", "Manager Email", "Manager Phone",
//     "Secondary Name", "Secondary Email", "Secondary Phone", "Candidate Name",
//     "Candidate Phone", "Candidate Email", "Work Email", "Work Phone",
//     "Recruiter Name", "Recruiter Phone", "Recruiter Email", "PO ID", "Notes"
//   ];

//   return (
//     <div className="p-4 mt-20 mb-10 mx-auto bg-gray-100 rounded-lg shadow-md relative max-w-7xl">
//       {alertMessage && ( // Conditional rendering of alert message
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
//             {/* Add icon if needed */}
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
//           <AgGridReact<InvoiceData>
//             ref={gridRef}
//             rowData={rowData}
//             columnDefs={columnDefs}
//             pagination={false}
//             domLayout="normal"
//             rowSelection="multiple"
//             defaultColDef={{
//               sortable: true,
//               filter: true,
//               cellStyle: { color: "#333", fontSize: "0.85rem", padding: "8px" },
//               minWidth: 100,
//               maxWidth: 1300,
//             }}
//             rowHeight={40}
//             headerHeight={40}
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

//       {detailedData.length > 0 && (
//         <Accordion header={`Details for Invoice ${detailedData[0]?.id || ''}`}>
//           <div className="overflow-auto" style={{ maxHeight: "300px" }}>
//             <table className="min-w-full bg-white border border-gray-300">
//               <thead>
//                 <tr>
//                   {detailedColumns.map((column, index) => (
//                     <th key={index} className="py-2 px-4 border-b text-sm">
//                       {column}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {detailedData.map((data, dataIndex) => (
//                   <tr key={dataIndex} className="text-sm">
//                     {detailedColumns.map((column, index) => {
//                       const fieldName = column.toLowerCase().replace(/ /g, '');
//                       const value = data[fieldName];
//                       return (
//                         <td key={index} className="py-2 px-4 border-b">
//                           {value !== undefined ? String(value) : 'N/A'}
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Accordion>
//       )}
//     </div>
//   );
// };

// export default ByPO;

"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import axios from "axios";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { FaDownload, FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { AiOutlineEdit, AiOutlineEye, AiOutlineSearch, AiOutlineReload } from "react-icons/ai";

// Extend jsPDF with autoTable
(jsPDF as { prototype: { autoTable: typeof autoTable } }).prototype.autoTable = autoTable;

interface InvoiceData {
  id?: string;
  pname?: string;
  startdate?: string;
  enddate?: string;
  invoicedate?: string;
  expecteddate?: string;
  receiveddate?: string;
  releaseddate?: string;
  emppaiddate?: string;
  quantity?: number;
  otquantity?: number;
  amountexpected?: number;
  amountreceived?: number;
  details?: InvoiceDetail[];
}

interface InvoiceDetail {
  detailId?: string;
  detailName?: string;
  detailValue?: string;
}

interface AlertMessage {
  text: string;
  type: "success" | "error";
}

const ByPO = () => {
  const [rowData, setRowData] = useState<InvoiceData[]>([]);
  const [paginationPageSize] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});
  const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const gridRef = useRef<AgGridReact<InvoiceData>>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/invoices`, {
        params: {
          page: currentPage,
          pageSize: paginationPageSize,
        },
        headers: { AuthToken: localStorage.getItem("token") || "" },
      });

      const data = response.data;
      if (Array.isArray(data)) {
        setRowData(data);
        setTotalRows(data.length);
      } else {
        console.error("Data is not an array:", data);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [API_URL, currentPage, paginationPageSize]);

  const fetchByPOs = async (searchQuery = "") => {
    try {
      const response = await axios.get(`${API_URL}/invoices`, {
        params: {
          page: currentPage,
          pageSize: paginationPageSize,
          search: searchQuery,
        },
        headers: { AuthToken: localStorage.getItem("token") || "" },
      });

      const { data, totalRows } = response.data;
      setRowData(data);
      setTotalRows(totalRows);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleSearch = () => {
    fetchByPOs(searchValue);
  };

  const columnDefs = useMemo(() => [
    {
      headerName: "ID",
      field: "id",
      minWidth: 100,
      cellRenderer: (params) => {
        const invoiceId = params.data.id;
        const expanded = expandedRows[invoiceId];
        return (
          <div className="flex items-center">
            <span
              className="cursor-pointer pl-1 flex items-center hover:bg-gray-100 rounded-md py-1 px-2 transition-colors duration-200"
              onClick={(e) => {
                e.stopPropagation();
                toggleRow(invoiceId);
              }}
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
            </span>
          </div>
        );
      },
    },
    { headerName: "Project Name", field: "pname", minWidth: 200 },
    { headerName: "Start Date", field: "startdate", minWidth: 150, type: 'dateColumn', valueFormatter: (params) => params.value ? new Date(params.value).toISOString().split('T')[0] : '' },
    { headerName: "End Date", field: "enddate", minWidth: 150, type: 'dateColumn', valueFormatter: (params) => params.value ? new Date(params.value).toISOString().split('T')[0] : '' },
    { headerName: "Invoice Date", field: "invoicedate", minWidth: 150, type: 'dateColumn', valueFormatter: (params) => params.value ? new Date(params.value).toISOString().split('T')[0] : '' },
    { headerName: "Expected Date", field: "expecteddate", minWidth: 150, type: 'dateColumn', valueFormatter: (params) => params.value ? new Date(params.value).toISOString().split('T')[0] : '' },
    { headerName: "Received Date", field: "receiveddate", minWidth: 150, type: 'dateColumn', valueFormatter: (params) => params.value ? new Date(params.value).toISOString().split('T')[0] : '' },
    { headerName: "Released Date", field: "releaseddate", minWidth: 150, type: 'dateColumn', valueFormatter: (params) => params.value ? new Date(params.value).toISOString().split('T')[0] : '' },
    { headerName: "Emp Paid Date", field: "emppaiddate", minWidth: 150, type: 'dateColumn', valueFormatter: (params) => params.value ? new Date(params.value).toISOString().split('T')[0] : '' },
    { headerName: "Quantity", field: "quantity", minWidth: 100, type: 'numericColumn', aggFunc: 'sum' },
    { headerName: "OT Quantity", field: "otquantity", minWidth: 100, type: 'numericColumn', aggFunc: 'sum' },
    { headerName: "Amount Expected", field: "amountexpected", minWidth: 150, type: 'numericColumn', aggFunc: 'sum' },
    { headerName: "Amount Received", field: "amountreceived", minWidth: 150, type: 'numericColumn', aggFunc: 'sum' },
  ], [expandedRows]);

  const detailColumnDefs = useMemo(() => [
    { headerName: "Detail ID", field: "detailId", minWidth: 100 },
    { headerName: "Detail Name", field: "detailName", minWidth: 200 },
    { headerName: "Detail Value", field: "detailValue", minWidth: 150 },
  ], []);


  const getDetailRowData = useCallback(async (params) => {
    console.log("getDetailRowData called", params);
    const invoiceId = params.data.id;
    if (expandedRows[invoiceId]) {
      try {
        const response = await axios.get(`${API_URL}/invoices/${invoiceId}`, {
          headers: { AuthToken: localStorage.getItem("token") || "" },
        });
        const detailData = response.data.details || [];
        console.log("Fetched detail data:", detailData);
        params.successCallback(detailData);
      } catch (error) {
        console.error("Error fetching detailed data:", error);
        params.failCallback();
      }
    } else {
      params.successCallback([]);
    }
  }, [API_URL, expandedRows]);
  
  const toggleRow = useCallback((invoiceId: string) => {
    console.log("toggleRow called", invoiceId);
    setExpandedRows((prev) => {
      const newExpandedRows = { ...prev, [invoiceId]: !prev[invoiceId] };
      if (gridRef.current) {
        gridRef.current.api.onGroupExpandedOrCollapsed();
      }
      return newExpandedRows;
    });
  }, []);


  useEffect(() => {
    fetchData();
  }, [currentPage, fetchData]);

  const handleRefresh = () => {
    setSearchValue("");
    fetchData();
  };

  const handleAddRow = () => {
    // Implement add row functionality
  };

  const handleEditRow = () => {
    if (gridRef.current && gridRef.current.api) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        setAlertMessage({ text: "Edit functionality not implemented yet", type: "error" });
        setTimeout(() => setAlertMessage(null), 3000);
      } else {
        setAlertMessage({ text: "Please select a row to edit.", type: "error" });
        setTimeout(() => setAlertMessage(null), 3000);
      }
    }
  };

  const handlePageChange = (newPage: number) => setCurrentPage(newPage);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("By PO Data", 20, 10);
    const pdfData = rowData.map((row) => Object.values(row)) as (string | number)[][];
    const headers = columnDefs.map((col) => col.headerName);

    autoTable(doc, {
      head: [headers],
      body: pdfData,
      theme: 'grid',
      styles: { fontSize: 8 },
    });

    doc.save("by_po_data.pdf");
  };

  const totalPages = Math.ceil(totalRows / paginationPageSize);
  const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="p-4 mt-20 mb-10 mx-auto bg-gray-100 rounded-lg shadow-md relative max-w-7xl">
      {alertMessage && ( // Conditional rendering of alert message
        <div className={`fixed top-4 right-4 p-4 ${alertMessage.type === "success" ? "bg-green-500" : "bg-red-500"} text-white rounded-md shadow-md z-50`}>
          {alertMessage.text}
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
            {/* Add icon if needed */}
          </button>
          <button
            onClick={handleEditRow}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700"
          >
            <AiOutlineEdit className="mr-2" />
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
          <AgGridReact<InvoiceData>
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            pagination={false}
            domLayout="normal"
            rowSelection="single"
            masterDetail={true}
            detailCellRendererParams={{
              detailGridOptions: {
                columnDefs: detailColumnDefs,
                defaultColDef: {
                  sortable: true,
                  filter: true,
                  cellStyle: { color: "#333", fontSize: "0.85rem", padding: "8px" },
                  minWidth: 100,
                  maxWidth: 1300,
                },
                rowHeight: 40,
                headerHeight: 40,
              },
              getDetailRowData: getDetailRowData,
            }}
            defaultColDef={{
              sortable: true,
              filter: true,
              cellStyle: { color: "#333", fontSize: "0.85rem", padding: "8px" },
              minWidth: 100,
              maxWidth: 1300,
            }}
            rowHeight={40}
            headerHeight={40}
            onRowClicked={(event) => {
              if (event.data) {
                toggleRow(event.data.id);
              }
            }}
            getRowNodeId={(data) => data.id} // Ensure unique row keys
            onGridReady={(params) => {
              params.api.sizeColumnsToFit();
            }}
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
    </div>
  );
};

export default ByPO;
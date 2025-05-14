// "use client";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import EditRowModal from "@/modals/overdue_modals/EditRowOverdue";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import ViewRowModal from "@/modals/overdue_modals/ViewRowOverdue";
// import autoTable from "jspdf-autotable";
// import axios from "axios";
// import { AgGridReact } from "ag-grid-react";
// import { jsPDF } from "jspdf";
// import { debounce } from "lodash";
// import { FaDownload } from "react-icons/fa";
// import { FaAngleDoubleLeft, FaAngleDoubleRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// import {
//   AiOutlineEdit,
//   AiOutlineEye,
//   AiOutlineSearch,
//   AiOutlineReload,
// } from "react-icons/ai";

// interface Overdue {
//   pkid?: number;
//   candidateid?: number;
//   candidatename?: string;
//   clientname?: string;
//   startdate?: string;
//   enddate?: string;
//   invoicedate?: string;
//   amountexpected?: number;
//   amountreceived?: number;
//   expecteddate?: string;
//   receiveddate?: string;
//   checknumber?: string;
//   status?: string;
//   notes?: string;
//   serialNo?: number;
//   poid?: string;
//   invoicenumber?: string;
//   quantity?: number;
//   rate?: number;
//   remindertype?: string;
//   releaseddate?: string;
//   invoiceurl?: string;
//   checkurl?: string;
//   companyname?: string;
//   vendorfax?: string;
//   vendorphone?: string;
//   vendoremail?: string;
//   timsheetemail?: string;
//   hrname?: string;
//   hremail?: string;
//   hrphone?: string;
//   managername?: string;
//   manageremail?: string;
//   managerphone?: string;
//   secondaryname?: string;
//   secondaryemail?: string;
//   secondaryphone?: string;
//   candidatephone?: string;
//   candidateemail?: string;
//   wrkemail?: string;
//   wrkphone?: string;
//   recruitername?: string;
//   recruiterphone?: string;
//   recruiteremail?: string;
// }

// interface ApiOverdueResponse {
//   data: Overdue[];
//   totalRows: number;
// }

// jsPDF.prototype.autoTable = autoTable;

// const OverdueComponent = () => {
//   const [rowData, setRowData] = useState<Overdue[]>([]);
//   const [alertMessage, setAlertMessage] = useState<string | null>(null);
//   const [columnDefs, setColumnDefs] = useState<{ headerName: string; field: string }[]>([]);
//   const [paginationPageSize] = useState<number>(100);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [totalRows, setTotalRows] = useState<number>(0);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [modalState, setModalState] = useState<{ add: boolean; edit: boolean; view: boolean }>({ add: false, edit: false, view: false });
//   const [selectedRow, setSelectedRow] = useState<Overdue | null>(null);
//   const [searchValue, setSearchValue] = useState<string>("");
//   const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);
//   const gridRef = useRef<AgGridReact>(null);

//   const API_URL = process.env.NEXT_PUBLIC_API_URL;

//   // Track window resize for responsive design
//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };
    
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const setupColumns = useCallback((data: Overdue[]) => {
//     if (data.length > 0) {
//       const columns = Object.keys(data[0]).map((key) => ({
//         headerName: key.charAt(0).toUpperCase() + key.slice(1),
//         field: key,
//         width: getColumnWidth(key),
//         minWidth: windowWidth < 640 ? 60 : 80,
//         maxWidth: windowWidth < 640 ? 120 : 150
//       }));
//       setColumnDefs(columns);
//     }
//   }, [windowWidth]);

//   const getColumnWidth = (field: string) => {
//     if (windowWidth < 640) { // Mobile
//       return field.length * 8 + 30; // Dynamic width based on field name length
//     } else if (windowWidth < 1024) { // Tablet
//       return field.length * 10 + 40;
//     } else { // Desktop
//       return field.length * 12 + 50;
//     }
//   };

//   const fetchData = useCallback(async (_: unknown, page = 1) => {
//     setLoading(true);
//     try {
//       const response = await axios.get<ApiOverdueResponse>(`${API_URL}/overdue/get`, {
//         params: {
//           page: page,
//           page_size: paginationPageSize,
//           search_term: searchValue.trim() || null,
//         },
//         headers: { AuthToken: localStorage.getItem("token") || "" },
//       });

//       const { data, totalRows } = response.data;

//       const dataWithSerials = data.map((item, index) => ({
//         ...item,
//         serialNo: (page - 1) * paginationPageSize + index + 1,
//         amountreceived: item.amountreceived ? Number(item.amountreceived) : undefined
//       }));

//       setRowData(dataWithSerials);
//       setTotalRows(totalRows);
//       setupColumns(dataWithSerials);
//     } catch (error) {
//       console.error("Error loading data:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [API_URL, paginationPageSize, searchValue, setupColumns]);

//   const fetchOverdues = useCallback(async (searchQuery = "") => {
//     setLoading(true);
//     try {
//       const response = await axios.get<ApiOverdueResponse>(`${API_URL}/overdue/name/${searchQuery}`, {
//         headers: { AuthToken: localStorage.getItem("token") || "" },
//       });
  
//       const { data, totalRows } = response.data;
      
//       if (!Array.isArray(data)) {
//         console.error("Expected an array but received:", data);
//         setRowData([]);
//         setTotalRows(0);
//         return;
//       }
  
//       const processedData = data.map((item, index) => ({
//         ...item,
//         serialNo: index + 1,
//         amountreceived: item.amountreceived ? Number(item.amountreceived) : undefined
//       }));
  
//       setRowData(processedData);
//       setTotalRows(totalRows);
//       setupColumns(processedData);
//     } catch (error) {
//       console.error("Error loading data:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [API_URL, setupColumns]);

//   const debouncedSearch = useCallback(
//     debounce((query: string) => {
//       if (query) {
//         fetchOverdues(query);
//       } else {
//         fetchData(null, currentPage);
//       }
//     }, 300),
//     [fetchOverdues, fetchData, currentPage]
//   );

//   useEffect(() => {
//     fetchData(null, currentPage);
//   }, [fetchData, currentPage]);

//   useEffect(() => {
//     if (searchValue) {
//       debouncedSearch(searchValue);
//     } else {
//       fetchData(null, currentPage);
//     }
//   }, [searchValue, currentPage, fetchData, debouncedSearch]);

//   const handleSearch = () => {
//     if (searchValue) {
//       fetchOverdues(searchValue);
//     }
//   };

//   const handleRefresh = () => {
//     setSearchValue("");
//     fetchData(null, currentPage);
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

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Overdue Data", 20, 10);
//     const pdfData = rowData.map((row) => Object.values(row));
//     const headers = columnDefs.map((col) => col.headerName);
//     autoTable(doc, {
//       head: [headers],
//       body: pdfData,
//       theme: 'grid',
//       styles: { fontSize: 5 },
//     });
//     doc.save("overdue_data.pdf");
//   };

//   const totalPages = Math.ceil(totalRows / paginationPageSize);

//   const getPageNumbers = () => {
//     const pageNumbers = [];
//     const maxPagesToShow = windowWidth < 640 ? 3 : 5;
    
//     let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
//     const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
//     if (endPage - startPage + 1 < maxPagesToShow) {
//       startPage = Math.max(1, endPage - maxPagesToShow + 1);
//     }
    
//     for (let i = startPage; i <= endPage; i++) {
//       pageNumbers.push(i);
//     }
    
//     return pageNumbers;
//   };

//   // Get appropriate icon sizes based on screen width
//   const getIconSize = () => {
//     if (windowWidth < 640) return "text-xs"; // Mobile
//     if (windowWidth < 1024) return "text-sm"; // Tablet
//     return "text-base"; // Desktop
//   };

//   // Get appropriate button padding based on screen width
//   const getButtonPadding = () => {
//     if (windowWidth < 640) return "px-1 py-1"; // Mobile
//     if (windowWidth < 1024) return "px-1.5 py-1"; // Tablet
//     return "px-2 py-1.5"; // Desktop
//   };

//   const iconSize = getIconSize();
//   const buttonPadding = getButtonPadding();

//   // Handle row selection
//   const onRowSelected = (event: { api: { getSelectedRows: () => Overdue[] } }) => {
//     if (event.api.getSelectedRows().length > 0) {
//       setSelectedRow(event.api.getSelectedRows()[0]);
//     } else {
//       setSelectedRow(null);
//     }
//   };

//   return (
//     <div className="relative">
//       {alertMessage && (
//         <div className={`fixed top-4 right-4 p-3 sm:p-4 ${alertMessage.includes("successfully") ? "bg-green-500" : "bg-red-500"} text-white text-xs sm:text-sm rounded-md shadow-md z-50`}>
//           {alertMessage}
//         </div>
//       )}

//       <div className="p-2 sm:p-4 mt-16 sm:mt-20 mb-6 sm:mb-10 mx-auto bg-gray-100 rounded-lg shadow-md relative max-w-full sm:max-w-7xl">
//         <div className="flex flex-col md:flex-row justify-between items-center mb-3 sm:mb-4">
//           <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Overdue Management</h1>
//         </div>

//         <div className="flex flex-col sm:flex-row mb-3 sm:mb-4 justify-between items-center">
//           <div className="flex w-full sm:w-auto mb-2 sm:mb-0">
//             <input
//               type="text"
//               placeholder="Search..."
//               value={searchValue}
//               onChange={(e) => setSearchValue(e.target.value)}
//               className="border border-gray-300 rounded-md p-1.5 sm:p-2 w-full sm:w-64 text-xs sm:text-sm"
//             />
//             <button
//               onClick={handleSearch}
//               className={`flex items-center ${buttonPadding} bg-blue-600 text-white rounded-md ml-1 sm:ml-2 transition duration-300 hover:bg-blue-900 text-xs sm:text-sm`}
//             >
//               <AiOutlineSearch className={`mr-1 ${iconSize}`} /> 
//               <span className="hidden xs:inline">Search</span>
//             </button>
//           </div>
        
//           <div className="flex items-center space-x-1">
//             <button
//               onClick={handleEditRow}
//               className={`flex items-center justify-center ${buttonPadding} ${
//                 selectedRow
//                   ? "bg-blue-600 text-white hover:bg-blue-700"
//                   : "bg-gray-400 text-gray-200 cursor-not-allowed"
//               } rounded-md transition duration-300 text-xs sm:text-sm`}
//               disabled={!selectedRow}
//               title="Edit Overdue"
//             >
//               <AiOutlineEdit className={iconSize} />
//             </button>
//             <button
//               onClick={handleViewRow}
//               className={`flex items-center justify-center ${buttonPadding} ${
//                 selectedRow
//                   ? "bg-blue-600 text-white hover:bg-blue-700"
//                   : "bg-gray-400 text-gray-200 cursor-not-allowed"
//               } rounded-md transition duration-300 text-xs sm:text-sm`}
//               disabled={!selectedRow}
//               title="View Overdue"
//             >
//               <AiOutlineEye className={iconSize} />
//             </button>
//             <button
//               onClick={handleRefresh}
//               className={`flex items-center justify-center ${buttonPadding} bg-gray-500 text-white rounded-md transition duration-300 hover:bg-gray-900 text-xs sm:text-sm`}
//               title="Refresh"
//             >
//               <AiOutlineReload className={iconSize} />
//             </button>
//             <button
//               onClick={handleDownloadPDF}
//               className={`flex items-center justify-center ${buttonPadding} bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700 text-xs sm:text-sm`}
//               title="Download PDF"
//             >
//               <FaDownload className={iconSize} />
//             </button>
//           </div>
//         </div>

//         <div 
//           className="ag-theme-alpine" 
//           style={{ 
//             height: windowWidth < 640 ? "300px" : windowWidth < 1024 ? "350px" : "370px", 
//             width: "100%", 
//             overflowY: "visible", 
//             overflowX: 'auto',
//             fontSize: windowWidth < 640 ? '10px' : windowWidth < 1024 ? '12px' : '14px'
//           }}
//         >
//           <AgGridReact
//             ref={gridRef}
//             rowData={rowData}
//             columnDefs={columnDefs}
//             pagination={false}
//             domLayout="normal"
//             rowSelection="multiple"
//             onRowSelected={onRowSelected}
//             onRowClicked={(event) => setSelectedRow(event.data)}
//             defaultColDef={{
//               sortable: true,
//               filter: true,
//               resizable: true,
//               cellStyle: { 
//                 color: "#333", 
//                 fontSize: windowWidth < 640 ? "0.65rem" : windowWidth < 1024 ? "0.7rem" : "0.75rem", 
//                 padding: windowWidth < 640 ? "0px" : "1px" 
//               },
//               minWidth: windowWidth < 640 ? 60 : 80,
//               maxWidth: windowWidth < 640 ? 120 : 150,
//             }}
//             rowHeight={windowWidth < 640 ? 25 : windowWidth < 1024 ? 28 : 30}
//             headerHeight={windowWidth < 640 ? 30 : windowWidth < 1024 ? 32 : 35}
//             overlayNoRowsTemplate={
//               '<span class="ag-overlay-no-rows-center">No rows to show</span>'
//             }
//             overlayLoadingTemplate={
//               '<span class="ag-overlay-loading-center">Loading...</span>'
//             }
//             onGridReady={(params) => {
//               if (loading) {
//                 params.api.showLoadingOverlay();
//               } else if (rowData.length === 0) {
//                 params.api.showNoRowsOverlay();
//               }
//             }}
//           />
//         </div>

//         <div className="flex flex-col md:flex-row justify-between items-center mt-3 sm:mt-4">
//           <div className="flex items-center justify-center w-full md:w-auto overflow-x-auto">
//             <div className="flex space-x-1 sm:space-x-2 overflow-x-auto">
//               <button 
//                 onClick={() => handlePageChange(1)} 
//                 disabled={currentPage === 1}
//                 className="p-1 sm:p-2 disabled:opacity-50 text-xs sm:text-sm"
//                 title="First Page"
//               >
//                 <FaAngleDoubleLeft className={iconSize} />
//               </button>
//               <button 
//                 onClick={() => handlePageChange(currentPage - 1)} 
//                 disabled={currentPage === 1}
//                 className="p-1 sm:p-2 disabled:opacity-50 text-xs sm:text-sm"
//                 title="Previous Page"
//               >
//                 <FaChevronLeft className={iconSize} />
//               </button>
//               {getPageNumbers().map((page) => (
//                 <button
//                   key={page}
//                   onClick={() => handlePageChange(page)}
//                   className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md text-xs sm:text-sm ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
//                 >
//                   {page}
//                 </button>
//               ))}
//               <button 
//                 onClick={() => handlePageChange(currentPage + 1)} 
//                 disabled={currentPage === totalPages}
//                 className="p-1 sm:p-2 disabled:opacity-50 text-xs sm:text-sm"
//                 title="Next Page"
//               >
//                 <FaChevronRight className={iconSize} />
//               </button>
//               <button 
//                 onClick={() => handlePageChange(totalPages)} 
//                 disabled={currentPage === totalPages}
//                 className="p-1 sm:p-2 disabled:opacity-50 text-xs sm:text-sm"
//                 title="Last Page"
//               >
//                 <FaAngleDoubleRight className={iconSize} />
//               </button>
//             </div>
//           </div>
//           <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-0">
//             Page {currentPage} of {totalPages} | Total: {totalRows}
//           </div>
//         </div>

//         {modalState.edit && selectedRow && (
//           <EditRowModal
//             isOpen={modalState.edit}
//             onRequestClose={() => {
//               setModalState((prev) => ({ ...prev, edit: false }));
//               fetchData(null, currentPage);
//             }}
//             rowData={selectedRow}
//             onSave={() => {
//               fetchData(null, currentPage);
//               setModalState((prev) => ({ ...prev, edit: false }));
//             }}
//           />
//         )}
//         {modalState.view && selectedRow && (
//           <ViewRowModal
//             isOpen={modalState.view}
//             onClose={() => setModalState((prev) => ({ ...prev, view: false }))}
//             rowData={{
//               ...selectedRow,
//               amountexpected: selectedRow.amountexpected?.toString(),
//               amountreceived: selectedRow.amountreceived?.toString(),
//               quantity: selectedRow.quantity?.toString()
//             }}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default OverdueComponent;



"use client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import EditRowModal from "@/modals/overdue_modals/EditRowOverdue";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ViewRowModal from "@/modals/overdue_modals/ViewRowOverdue";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { jsPDF } from "jspdf";
import { debounce } from "lodash";
import { FaDownload } from "react-icons/fa";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";

import {
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlineSearch,
  AiOutlineReload,
} from "react-icons/ai";

interface Overdue {
  pkid?: number;
  candidateid?: number;
  candidatename?: string;
  clientname?: string;
  startdate?: string;
  enddate?: string;
  invoicedate?: string;
  amountexpected?: number;
  amountreceived?: number;
  expecteddate?: string;
  receiveddate?: string;
  checknumber?: string;
  status?: string;
  notes?: string;
  serialNo?: number;
  poid?: string;
  invoicenumber?: string;
  quantity?: number;
  rate?: number;
  remindertype?: string;
  releaseddate?: string;
  invoiceurl?: string;
  checkurl?: string;
  companyname?: string;
  vendorfax?: string;
  vendorphone?: string;
  vendoremail?: string;
  timsheetemail?: string;
  hrname?: string;
  hremail?: string;
  hrphone?: string;
  managername?: string;
  manageremail?: string;
  managerphone?: string;
  secondaryname?: string;
  secondaryemail?: string;
  secondaryphone?: string;
  candidatephone?: string;
  candidateemail?: string;
  wrkemail?: string;
  wrkphone?: string;
  recruitername?: string;
  recruiterphone?: string;
  recruiteremail?: string;
}

interface ApiOverdueResponse {
  data: Overdue[];
  totalRows: number;
}

jsPDF.prototype.autoTable = autoTable;

const OverdueComponent = () => {
  const [rowData, setRowData] = useState<Overdue[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [columnDefs, setColumnDefs] = useState<{ headerName: string; field: string }[]>([]);
  const [paginationPageSize] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalState, setModalState] = useState<{ add: boolean; edit: boolean; view: boolean }>({ add: false, edit: false, view: false });
  const [selectedRow, setSelectedRow] = useState<Overdue | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
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

  const setupColumns = useCallback((data: Overdue[]) => {
    if (data.length > 0) {
      const columns = Object.keys(data[0]).map((key) => ({
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
        field: key,
        width: getColumnWidth(key),
        minWidth: windowWidth < 640 ? 60 : 80,
        maxWidth: windowWidth < 640 ? 120 : 150
      }));
      setColumnDefs(columns);
    }
  }, [windowWidth]);

  const getColumnWidth = (field: string) => {
    if (windowWidth < 640) { // Mobile
      return field.length * 8 + 30; // Dynamic width based on field name length
    } else if (windowWidth < 1024) { // Tablet
      return field.length * 10 + 40;
    } else { // Desktop
      return field.length * 12 + 50;
    }
  };

  const fetchData = useCallback(async (_: unknown, page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get<ApiOverdueResponse>(`${API_URL}/overdue/get`, {
        params: {
          page: page,
          page_size: paginationPageSize,
          search_term: searchValue.trim() || null,
        },
        headers: { AuthToken: localStorage.getItem("token") || "" },
      });

      const { data, totalRows } = response.data;

      const dataWithSerials = data.map((item, index) => ({
        ...item,
        serialNo: (page - 1) * paginationPageSize + index + 1,
        amountreceived: item.amountreceived ? Number(item.amountreceived) : undefined
      }));

      setRowData(dataWithSerials);
      setTotalRows(totalRows);
      setupColumns(dataWithSerials);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [API_URL, paginationPageSize, searchValue, setupColumns]);

  const fetchOverdues = useCallback(async (searchQuery = "") => {
    setLoading(true);
    try {
      const response = await axios.get<ApiOverdueResponse>(`${API_URL}/overdue/name/${searchQuery}`, {
        headers: { AuthToken: localStorage.getItem("token") || "" },
      });
  
      const { data, totalRows } = response.data;
      
      if (!Array.isArray(data)) {
        console.error("Expected an array but received:", data);
        setRowData([]);
        setTotalRows(0);
        return;
      }
  
      const processedData = data.map((item, index) => ({
        ...item,
        serialNo: index + 1,
        amountreceived: item.amountreceived ? Number(item.amountreceived) : undefined
      }));
  
      setRowData(processedData);
      setTotalRows(totalRows);
      setupColumns(processedData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [API_URL, setupColumns]);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query) {
        fetchOverdues(query);
      } else {
        fetchData(null, currentPage);
      }
    }, 300),
    [fetchOverdues, fetchData, currentPage]
  );

  useEffect(() => {
    fetchData(null, currentPage);
  }, [fetchData, currentPage]);

  useEffect(() => {
    if (searchValue) {
      debouncedSearch(searchValue);
    } else {
      fetchData(null, currentPage);
    }
  }, [searchValue, currentPage, fetchData, debouncedSearch]);

  const handleSearch = () => {
    if (searchValue) {
      fetchOverdues(searchValue);
    }
  };

  const handleRefresh = () => {
    setSearchValue("");
    fetchData(null, currentPage);
  };

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

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Overdue Data", 20, 10);
    const pdfData = rowData.map((row) => Object.values(row));
    const headers = columnDefs.map((col) => col.headerName);
    autoTable(doc, {
      head: [headers],
      body: pdfData,
      theme: 'grid',
      styles: { fontSize: 5 },
    });
    doc.save("overdue_data.pdf");
  };

  const totalPages = Math.ceil(totalRows / paginationPageSize);

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

  // Handle row selection
  const onRowSelected = (event: { api: { getSelectedRows: () => Overdue[] } }) => {
    if (event.api.getSelectedRows().length > 0) {
      setSelectedRow(event.api.getSelectedRows()[0]);
    } else {
      setSelectedRow(null);
    }
  };

  return (
    <div className="relative">
      {alertMessage && (
        <div className={`fixed top-4 right-4 p-3 sm:p-4 ${alertMessage.includes("successfully") ? "bg-green-500" : "bg-red-500"} text-white text-xs sm:text-sm rounded-md shadow-md z-50`}>
          {alertMessage}
        </div>
      )}

      <div className="p-2 sm:p-4 mt-16 sm:mt-20 mb-6 sm:mb-10 mx-auto bg-gray-100 rounded-lg shadow-md relative max-w-full sm:max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-3 sm:mb-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Overdue Management</h1>
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
              className={`flex items-center justify-center ${buttonPadding} ${
                selectedRow
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              } rounded-md transition duration-300 text-xs sm:text-sm`}
              disabled={!selectedRow}
              title="Edit Overdue"
            >
              <AiOutlineEdit className={iconSize} />
            </button>
            <button
              onClick={handleViewRow}
              className={`flex items-center justify-center ${buttonPadding} ${
                selectedRow
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              } rounded-md transition duration-300 text-xs sm:text-sm`}
              disabled={!selectedRow}
              title="View Overdue"
            >
              <AiOutlineEye className={iconSize} />
            </button>
            <button
              onClick={handleRefresh}
              className={`flex items-center justify-center ${buttonPadding} bg-gray-500 text-white rounded-md transition duration-300 hover:bg-gray-900 text-xs sm:text-sm`}
              title="Refresh"
            >
              <AiOutlineReload className={iconSize} />
            </button>
            <button
              onClick={handleDownloadPDF}
              className={`flex items-center justify-center ${buttonPadding} bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700 text-xs sm:text-sm`}
              title="Download PDF"
            >
              <FaDownload className={iconSize} />
            </button>
          </div>
        </div>

        <div 
          className="ag-theme-alpine" 
          style={{ 
            height: windowWidth < 640 ? "300px" : windowWidth < 1024 ? "350px" : "370px", 
            width: "100%", 
            overflowY: "visible", 
            overflowX: 'auto',
            fontSize: windowWidth < 640 ? '10px' : windowWidth < 1024 ? '12px' : '14px'
          }}
        >
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            pagination={false}
            domLayout="normal"
            suppressRowClickSelection={true}
            enableCellTextSelection={true}
            ensureDomOrder={true}
            rowSelection="single"
            suppressRowDeselection={false}
            onRowSelected={onRowSelected}
            onRowClicked={(event) => setSelectedRow(event.data)}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
              cellStyle: { 
                color: "#333", 
                fontSize: windowWidth < 640 ? "0.65rem" : windowWidth < 1024 ? "0.7rem" : "0.75rem", 
                padding: windowWidth < 640 ? "0px" : "1px" 
              },
              minWidth: windowWidth < 640 ? 60 : 80,
              maxWidth: windowWidth < 640 ? 120 : 150,
            }}
            rowHeight={windowWidth < 640 ? 25 : windowWidth < 1024 ? 28 : 30}
            headerHeight={windowWidth < 640 ? 30 : windowWidth < 1024 ? 32 : 35}
            overlayNoRowsTemplate={
              '<span class="ag-overlay-no-rows-center">No rows to show</span>'
            }
            overlayLoadingTemplate={
              '<span class="ag-overlay-loading-center">Loading...</span>'
            }
            onGridReady={(params) => {
              if (loading) {
                params.api.showLoadingOverlay();
              } else if (rowData.length === 0) {
                params.api.showNoRowsOverlay();
              }
            }}
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-3 sm:mt-4">
          <div className="flex items-center justify-center w-full md:w-auto overflow-x-auto">
            <div className="flex space-x-1 sm:space-x-2 overflow-x-auto">
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
          <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-0">
            Page {currentPage} of {totalPages} | Total: {totalRows}
          </div>
        </div>

        {modalState.edit && selectedRow && (
          <EditRowModal
            isOpen={modalState.edit}
            onRequestClose={() => {
              setModalState((prev) => ({ ...prev, edit: false }));
              fetchData(null, currentPage);
            }}
            rowData={selectedRow}
            onSave={() => {
              fetchData(null, currentPage);
              setModalState((prev) => ({ ...prev, edit: false }));
            }}
          />
        )}
        {modalState.view && selectedRow && (
          <ViewRowModal
            isOpen={modalState.view}
            onClose={() => setModalState((prev) => ({ ...prev, view: false }))}
            rowData={{
              ...selectedRow,
              amountexpected: selectedRow.amountexpected?.toString(),
              amountreceived: selectedRow.amountreceived?.toString(),
              quantity: selectedRow.quantity?.toString()
            }}
          />
        )}
      </div>
    </div>
  );
};

export default OverdueComponent;
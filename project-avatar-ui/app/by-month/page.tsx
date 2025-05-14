"use client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import AddRowModal from "@/modals/bymonth_modals/AddRowByMonth";
import EditRowModal from "@/modals/bymonth_modals/EditRowByMonth";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ViewRowModal from "@/modals/bymonth_modals/ViewRowByMonth";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { CellClassParams, ColDef, ICellRendererParams, RowSelectedEvent } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { jsPDF } from "jspdf";
import { AiOutlineEdit, AiOutlineEye, AiOutlineReload, AiOutlineSearch } from "react-icons/ai";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaChevronLeft, FaChevronRight, FaDownload } from "react-icons/fa";
import { MdAdd, MdDelete } from "react-icons/md";

// "use client";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import AddRowModal from "@/modals/bymonth_modals/AddRowByMonth";
// import EditRowModal from "@/modals/bymonth_modals/EditRowByMonth";
// import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import ViewRowModal from "@/modals/bymonth_modals/ViewRowByMonth";
// import autoTable from "jspdf-autotable";
// import axios from "axios";
// import { CellClassParams, ColDef, ICellRendererParams } from "ag-grid-community";
// import { AgGridReact } from "ag-grid-react";
// import { jsPDF } from "jspdf";
// import { AiOutlineEdit, AiOutlineEye, AiOutlineSearch } from "react-icons/ai";
// import { MdAdd, MdDelete } from "react-icons/md";

// // "use client";
// // import "ag-grid-community/styles/ag-grid.css";
// // import "ag-grid-community/styles/ag-theme-alpine.css";
// // import AddRowModal from "@/modals/bymonth_modals/AddRowByMonth";
// // import EditRowModal from "@/modals/bymonth_modals/EditRowByMonth";
// // import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// // import ViewRowModal from "@/modals/bymonth_modals/ViewRowByMonth";
// // import autoTable from "jspdf-autotable";
// // import axios from "axios";
// // import { CellClassParams, ColDef, ICellRendererParams } from "ag-grid-community";
// // import { AgGridReact } from "ag-grid-react";
// // import { jsPDF } from "jspdf";
// // import { AiOutlineEdit, AiOutlineEye, AiOutlineSearch } from "react-icons/ai";
// // import { MdAdd, MdDelete } from "react-icons/md";

// // import {
// //   FaChevronLeft,
// //   FaChevronRight,
// //   FaAngleDoubleLeft,
// //   FaAngleDoubleRight,
// //   FaDownload,
// // } from "react-icons/fa";

// // jsPDF.prototype.autoTable = autoTable;

// // interface InvoiceData {
// //   id: number;
// //   invoicenumber: string;
// //   startdate: string;
// //   placementid:number;
// //   enddate: string;
// //   invoicedate: string;
// //   invmonth: string;
// //   quantity: number;
// //   otquantity: number;
// //   rate: number;
// //   overtimerate: number;
// //   status: string;
// //   emppaiddate: string;
// //   candpaymentstatus: string;
// //   reminders: string;
// //   amountexpected: number;
// //   expecteddate: string;
// //   amountreceived: number;
// //   receiveddate: string;
// //   releaseddate: string;
// //   checknumber: string;
// //   invoiceurl: string;
// //   checkurl: string;
// //   freqtype: string;
// //   invoicenet: number;
// //   companyname: string;
// //   vendorfax: string;
// //   vendorphone: string;
// //   vendoremail: string;
// //   timsheetemail: string;
// //   hrname: string;
// //   hremail: string;
// //   hrphone: string;
// //   managername: string;
// //   manageremail: string;
// //   managerphone: string;
// //   secondaryname: string;
// //   secondaryemail: string;
// //   secondaryphone: string;
// //   candidatename: string;
// //   candidatephone: string;
// //   candidateemail: string;
// //   wrkemail: string;
// //   wrkphone: string;
// //   recruitername: string;
// //   recruiterphone: string;
// //   recruiteremail: string;
// //   poid: number;
// //   notes: string;
// // }

// // interface MonthGroup {
// //   invmonth: string;
// //   name: string;
// //   invoices: InvoiceData[];
// //   isGroup?: boolean;
// //   isCollapsed?: boolean;
// //   invoice_count: number;
// //   summary: {
// //     quantity: number;
// //     amountexpected: number;
// //     amountreceived: number;
// //   };
// // }

// // interface RowData extends InvoiceData {
// //   isGroupRow?: boolean;
// //   isSummaryRow?: boolean;
// //   level?: number;
// //   expanded?: boolean;
// //   name?: string;
// // }

// // interface AlertMessage {
// //   text: string;
// //   type: "success" | "error";
// // }

// // interface ModalState {
// //   add: boolean;
// //   view: boolean;
// //   edit: boolean;
// //   selectedRow: InvoiceData | null;
// // }

// // interface SortState {
// //   field: string;
// //   order: string;
// // }

// // const ByMonth = () => {
// //   const gridRef = useRef<AgGridReact<RowData>>(null);
// //   const [modalState, setModalState] = useState<ModalState>({
// //     add: false,
// //     view: false,
// //     edit: false,
// //     selectedRow: null,
// //   });
// //   const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
// //   const [searchValue, setSearchValue] = useState("");
// //   const [monthGroups, setMonthGroups] = useState<MonthGroup[]>([]);
// //   const [expandedMonthGroups, setExpandedMonthGroups] = useState<{
// //     [key: string]: boolean;
// //   }>({});
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [totalPages, setTotalPages] = useState(1);
// //   const [totalRecords, setTotalRecords] = useState(0);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [clients, setClients] = useState<{ id: number; pname: string }[]>([]);
// //   const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
// //   const [sortState, setSortState] = useState<SortState>({
// //     field: "invoicedate",
// //     order: "desc",
// //   });
// //   const pageSize = 100;

// //   const showAlert = (text: string, type: "success" | "error") => {
// //     setAlertMessage({ text, type });
// //     setTimeout(() => setAlertMessage(null), 3000);
// //   };

// //   const fetchData = useCallback(async () => {
// //     try {
// //       setIsLoading(true);
// //       const response = await axios.get(
// //         `${process.env.NEXT_PUBLIC_API_URL}/invoices/dataByMonth`,
// //         {
// //           params: {
// //             page: currentPage,
// //             page_size: pageSize,
// //             search_companyname: searchValue || undefined,
// //             sort_field: sortState.field,
// //             sort_order: sortState.order,
// //           },
// //         }
// //       );
      
// //       const processedData = response.data.data.map((group: any) => ({
// //         ...group,
// //         isGroup: true,
// //         isCollapsed: expandedMonthGroups[group.invmonth] || false,
// //         invoice_count: group.invoices.length,
// //       }));

// //       setMonthGroups(processedData);
// //       setTotalPages(response.data.pages);
// //       setTotalRecords(response.data.total);
// //     } catch (error) {
// //       console.error("Error fetching data:", error);
// //       showAlert("Error loading data", "error");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   }, [currentPage, searchValue, sortState, expandedMonthGroups]);

// //   useEffect(() => {
// //     fetchData();
// //   }, [fetchData]);

// //   const toggleGroup = (month: string) => {
// //     setSelectedMonth(month === selectedMonth ? null : month);
// //     setExpandedMonthGroups((prev) => ({
// //       ...prev,
// //       [month]: !prev[month],
// //     }));
// //   };

// //   const handleSortChange = (field: string) => {
// //     setSortState((prev) => ({
// //       field,
// //       order: prev.field === field ? (prev.order === "asc" ? "desc" : "asc") : "desc",
// //     }));
// //   };

// //   const rowData = useMemo(() => {
// //     const rows: RowData[] = [];
// //     monthGroups.forEach((monthGroup) => {
// //       rows.push({
// //         id: -1,
// //         name: monthGroup.invmonth,
// //         invoicenumber: "",
// //         startdate: "",
// //         enddate: "",
// //         invoicedate: "",
// //         invmonth: monthGroup.invmonth,
// //         quantity: 0,
// //         otquantity: 0,
// //         rate: 0,
// //         overtimerate: 0,
// //         status: "",
// //         emppaiddate: "",
// //         candpaymentstatus: "",
// //         reminders: "",
// //         amountexpected: 0,
// //         expecteddate: "",
// //         amountreceived: 0,
// //         receiveddate: "",
// //         releaseddate: "",
// //         checknumber: "",
// //         invoiceurl: "",
// //         checkurl: "",
// //         freqtype: "",
// //         invoicenet: 0,
// //         companyname: "",
// //         vendorfax: "",
// //         vendorphone: "",
// //         vendoremail: "",
// //         timsheetemail: "",
// //         hrname: "",
// //         hremail: "",
// //         hrphone: "",
// //         managername: "",
// //         manageremail: "",
// //         managerphone: "",
// //         secondaryname: "",
// //         secondaryemail: "",
// //         secondaryphone: "",
// //         candidatename: "",
// //         candidatephone: "",
// //         candidateemail: "",
// //         wrkemail: "",
// //         wrkphone: "",
// //         recruitername: "",
// //         recruiterphone: "",
// //         recruiteremail: "",
// //         poid: 0,
// //         notes: "",
// //         isGroupRow: true,
// //         level: 0,
// //         expanded: expandedMonthGroups[monthGroup.invmonth],
// //       });

// //       if (expandedMonthGroups[monthGroup.invmonth]) {
// //         monthGroup.invoices.forEach((invoice) => {
// //           rows.push({
// //             ...invoice,
// //             name: `${invoice.candidatename} - ${invoice.companyname} - ${invoice.poid}`,
// //             isGroupRow: false,
// //             level: 1,
// //           });
// //         });

// //         // Add summary row
// //         rows.push({
// //           id: -2,
// //           name: "Summary",
// //           invoicenumber: "",
// //           startdate: "",
// //           enddate: "",
// //           invoicedate: "",
// //           invmonth: monthGroup.invmonth,
// //           quantity: monthGroup.summary.quantity,
// //           otquantity: 0,
// //           rate: 0,
// //           overtimerate: 0,
// //           status: "",
// //           emppaiddate: "",
// //           candpaymentstatus: "",
// //           reminders: "",
// //           amountexpected: monthGroup.summary.amountexpected,
// //           expecteddate: "",
// //           amountreceived: monthGroup.summary.amountreceived,
// //           receiveddate: "",
// //           releaseddate: "",
// //           checknumber: "",
// //           invoiceurl: "",
// //           checkurl: "",
// //           freqtype: "",
// //           invoicenet: 0,
// //           companyname: "",
// //           vendorfax: "",
// //           vendorphone: "",
// //           vendoremail: "",
// //           timsheetemail: "",
// //           hrname: "",
// //           hremail: "",
// //           hrphone: "",
// //           managername: "",
// //           manageremail: "",
// //           managerphone: "",
// //           secondaryname: "",
// //           secondaryemail: "",
// //           secondaryphone: "",
// //           candidatename: "",
// //           candidatephone: "",
// //           candidateemail: "",
// //           wrkemail: "",
// //           wrkphone: "",
// //           recruitername: "",
// //           recruiterphone: "",
// //           recruiteremail: "",
// //           poid: 0,
// //           notes: "",
// //           isGroupRow: false,
// //           isSummaryRow: true,
// //           level: 1,
// //         });
// //       }
// //     });
// //     return rows;
// //   }, [monthGroups, expandedMonthGroups]);

// //   const columnDefs = useMemo<ColDef<RowData>[]>(
// //     () => [
// //       {
// //         headerName: "Name",
// //         field: "name",
// //         cellRenderer: (params: ICellRendererParams<RowData>) => {
// //           if (!params.data) return null;
          
// //           if (params.data.isGroupRow) {
// //             const expanded = params.data.invmonth ? expandedMonthGroups[params.data.invmonth] : false;
// //             return (
// //               <div className="flex items-center">
// //                 <span
// //                   className="cursor-pointer pl-1 flex items-center hover:bg-gray-100 rounded-md py-1 px-2 transition-colors duration-200"
// //                   onClick={() => params.data && params.data.invmonth ? toggleGroup(params.data.invmonth) : undefined}
// //                 >
// //                   <span className="mr-2 text-gray-600 flex items-center justify-center w-4 h-4 bg-white border border-gray-300 rounded">
// //                     {expanded ? (
// //                       <svg
// //                         className="w-3 h-3"
// //                         fill="none"
// //                         stroke="currentColor"
// //                         viewBox="0 0 24 24"
// //                       >
// //                         <path
// //                           strokeLinecap="round"
// //                           strokeLinejoin="round"
// //                           strokeWidth={2}
// //                           d="M20 12H4"
// //                         />
// //                       </svg>
// //                     ) : (
// //                       <svg
// //                         className="w-3 h-3"
// //                         fill="none"
// //                         stroke="currentColor"
// //                         viewBox="0 0 24 24"
// //                       >
// //                         <path
// //                           strokeLinecap="round"
// //                           strokeLinejoin="round"
// //                           strokeWidth={2}
// //                           d="M12 4v16m8-8H4"
// //                         />
// //                       </svg>
// //                     )}
// //                   </span>
// //                   <span className="font-medium">{params.value}</span>
// //                 </span>
// //               </div>
// //             );
// //           }
// //           if (params.data.isSummaryRow) {
// //             return <span className="pl-3 font-semibold">{params.value}</span>;
// //           }
// //           return <span className="pl-3">{params.value}</span>;
// //         },
// //         minWidth: 300,
// //         flex: 1,
// //       },
// //       {
// //         headerName: "Invoice Number",
// //         field: "invoicenumber",
// //         hide: false,
// //         minWidth: 150,
// //         valueFormatter: (params) => params.value || '',
// //       },
// //       {
// //         headerName: "Company",
// //         field: "companyname",
// //         hide: false,
// //         minWidth: 150,
// //         valueFormatter: (params) => params.value || '',
// //       },
// //       {
// //         headerName: "Start Date",
// //         field: "startdate",
// //         hide: false,
// //         minWidth: 120,
// //         valueFormatter: (params) => params.value || '',
// //       },
// //       {
// //         headerName: "End Date",
// //         field: "enddate",
// //         hide: false,
// //         minWidth: 120,
// //         valueFormatter: (params) => params.value || '',
// //       },
// //       {
// //         headerName: "Invoice Date",
// //         field: "invoicedate",
// //         hide: false,
// //         minWidth: 120,
// //         valueFormatter: (params) => params.value || '',
// //       },
// //       {
// //         headerName: "Amount Expected",
// //         field: "amountexpected",
// //         hide: false,
// //         minWidth: 120,
// //         cellStyle: (params: CellClassParams<RowData>) => {
// //           if (params.data?.isSummaryRow) {
// //             return { fontWeight: "bold" };
// //           }
// //           return null;
// //         },
// //         valueFormatter: (params) => params.value === 0 && !params.data?.isSummaryRow ? '' : `$${params.value?.toFixed(2) || '0.00'}`,
// //       },
// //       {
// //         headerName: "Amount Received",
// //         field: "amountreceived",
// //         hide: false,
// //         minWidth: 120,
// //         cellStyle: (params: CellClassParams<RowData>) => {
// //           if (params.data?.isSummaryRow) {
// //             return { fontWeight: "bold" };
// //           }
// //           return null;
// //         },
// //         valueFormatter: (params) => params.value === 0 && !params.data?.isSummaryRow ? '' : `$${params.value?.toFixed(2) || '0.00'}`,
// //       },
// //       {
// //         headerName: "Status",
// //         field: "status",
// //         hide: false,
// //         minWidth: 100,
// //         cellRenderer: (params: ICellRendererParams<RowData>) => {
// //           const statusMap: { [key: string]: string } = {
// //             A: "Active",
// //             I: "Inactive",
// //             D: "Delete",
// //             R: "Rejected",
// //             N: "Not Interested",
// //             E: "Excellent",
// //           };
// //           return statusMap[params.value as string] || params.value;
// //         },
// //       },
// //     ],
// //     [expandedMonthGroups]
// //   );

// //   const handlePageChange = (newPage: number) => {
// //     if (newPage > 0 && newPage <= totalPages) {
// //       setCurrentPage(newPage);
// //     }
// //   };

// //   const renderPageNumbers = () => {
// //     const pageNumbers = [];
// //     const maxVisiblePages = 5;
// //     let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
// //     const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

// //     if (endPage - startPage + 1 < maxVisiblePages) {
// //       startPage = Math.max(1, endPage - maxVisiblePages + 1);
// //     }

// //     if (startPage > 1) {
// //       pageNumbers.push(
// //         <button
// //           key={1}
// //           onClick={() => handlePageChange(1)}
// //           className={`text-sm px-3 py-1 rounded-md ${
// //             currentPage === 1
// //               ? "bg-blue-600 text-white"
// //               : "bg-gray-200 text-gray-800 hover:bg-gray-300"
// //           }`}
// //         >
// //           1
// //         </button>
// //       );
// //       if (startPage > 2) {
// //         pageNumbers.push(
// //           <span key="start-ellipsis" className="px-2 text-gray-500">
// //             ...
// //           </span>
// //         );
// //       }
// //     }

// //     for (let i = startPage; i <= endPage; i++) {
// //       pageNumbers.push(
// //         <button
// //           key={i}
// //           onClick={() => handlePageChange(i)}
// //           className={`text-sm px-3 py-1 rounded-md ${
// //             currentPage === i
// //               ? "bg-blue-600 text-white"
// //               : "bg-gray-200 text-gray-800 hover:bg-gray-300"
// //           }`}
// //         >
// //           {i}
// //         </button>
// //       );
// //     }

// //     if (endPage < totalPages) {
// //       if (endPage < totalPages - 1) {
// //         pageNumbers.push(
// //           <span key="end-ellipsis" className="px-2 text-gray-500">
// //             ...
// //           </span>
// //         );
// //       }
// //       pageNumbers.push(
// //         <button
// //           key={totalPages}
// //           onClick={() => handlePageChange(totalPages)}
// //           className={`text-sm px-3 py-1 rounded-md ${
// //             currentPage === totalPages
// //               ? "bg-blue-600 text-white"
// //               : "bg-gray-200 text-gray-800 hover:bg-gray-300"
// //           }`}
// //         >
// //           {totalPages}
// //         </button>
// //       );
// //     }

// //     return pageNumbers;
// //   };

// //   const handleAdd = async (formData: InvoiceData) => {
// //     try {
// //       await axios.post(
// //         `${process.env.NEXT_PUBLIC_API_URL}/invoices/post/`,
// //         formData
// //       );
// //       showAlert("Invoice added successfully", "success");
// //       setModalState({ ...modalState, add: false });
// //       fetchData();
// //     } catch (error) {
// //       console.error("Error adding invoice:", error);
// //       showAlert("Error adding invoice", "error");
// //     }
// //   };

// //   const handleDelete = async (id: number) => {
// //     if (window.confirm("Are you sure you want to delete this invoice?")) {
// //       try {
// //         await axios.delete(
// //           `${process.env.NEXT_PUBLIC_API_URL}/invoices/delete/${id}`
// //         );
// //         showAlert("Invoice deleted successfully", "success");
// //         fetchData();
// //       } catch (error) {
// //         console.error("Error deleting invoice:", error);
// //         showAlert("Error deleting invoice", "error");
// //       }
// //     }
// //   };

// //   const handleDownloadPDF = () => {
// //     const doc = new jsPDF();
// //     const tableData = rowData
// //       .filter((row) => !row.isGroupRow && !row.isSummaryRow && row.id !== -1 && row.id !== -2)
// //       .map((row) => [
// //         row.companyname,
// //         row.name,
// //         row.invoicenumber,
// //         row.startdate,
// //         row.enddate,
// //         row.invoicedate,
// //         row.quantity,
// //         row.otquantity,
// //         row.rate,
// //         row.overtimerate,
// //         row.status,
// //         `$${row.amountexpected?.toFixed(2) || '0.00'}`,
// //         row.expecteddate,
// //         `$${row.amountreceived?.toFixed(2) || '0.00'}`,
// //         row.receiveddate,
// //       ]);

// //     autoTable(doc, {
// //       head: [
// //         [
// //           "Company",
// //           "Name",
// //           "Invoice Number",
// //           "Start Date",
// //           "End Date",
// //           "Invoice Date",
// //           "Quantity",
// //           "OT Quantity",
// //           "Rate",
// //           "Overtime Rate",
// //           "Status",
// //           "Amount Expected",
// //           "Expected Date",
// //           "Amount Received",
// //           "Received Date",
// //         ],
// //       ],
// //       body: tableData,
// //       styles: { fontSize: 8 },
// //       margin: { top: 20 },
// //     });

// //     doc.save("invoices-by-month.pdf");
// //   };

// //   // Calculate dynamic height based on row count
// //   const gridHeight = useMemo(() => {
// //     const rowHeight = 30;
// //     const headerHeight = 35;
// //     const maxHeight = 600;
// //     const minHeight = 200;
    
// //     let rowCount = monthGroups.length;
// //     monthGroups.forEach(group => {
// //       if (expandedMonthGroups[group.invmonth]) {
// //         rowCount += group.invoices.length + 1; // +1 for summary row
// //       }
// //     });
    
// //     const calculatedHeight = Math.min(
// //       maxHeight,
// //       Math.max(minHeight, rowCount * rowHeight + headerHeight + 20)
// //     );
    
// //     return `${calculatedHeight}px`;
// //   }, [monthGroups, expandedMonthGroups]);

// //   return (
// //     <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md relative">
// //       {alertMessage && (
// //         <div
// //           className={`fixed top-4 right-4 p-4 ${
// //             alertMessage.type === "success" ? "bg-green-500" : "bg-red-500"
// //           } text-white rounded-md shadow-md z-50`}
// //         >
// //           {alertMessage.text}
// //         </div>
// //       )}

// //       <div className="flex justify-between items-center mb-4">
// //         <h1 className="text-3xl font-bold text-gray-800">Invoice Management (By Month)</h1>
// //         <div className="flex space-x-2">
// //           <button
// //             onClick={() => setModalState({ ...modalState, add: true })}
// //             className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700"
// //           >
// //             <MdAdd className="mr-2" />
// //           </button>
// //           <button
// //             onClick={() => {
// //               const selectedRows = gridRef.current?.api.getSelectedRows();
// //               if (selectedRows && selectedRows.length > 0 && !selectedRows[0].isGroupRow && !selectedRows[0].isSummaryRow) {
// //                 setModalState({
// //                   ...modalState,
// //                   edit: true,
// //                   selectedRow: selectedRows[0],
// //                 });
// //               } else {
// //                 showAlert("Please select an invoice to edit", "error");
// //               }
// //             }}
// //             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700"
// //           >
// //             <AiOutlineEdit className="mr-2" />
// //           </button>
// //           <button
// //             onClick={() => {
// //               const selectedRows = gridRef.current?.api.getSelectedRows();
// //               if (selectedRows && selectedRows.length > 0 && !selectedRows[0].isGroupRow && !selectedRows[0].isSummaryRow) {
// //                 handleDelete(selectedRows[0].id);
// //               } else {
// //                 showAlert("Please select an invoice to delete", "error");
// //               }
// //             }}
// //             className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700"
// //           >
// //             <MdDelete className="mr-2" />
// //           </button>
// //           <button
// //             onClick={() => {
// //               const selectedRows = gridRef.current?.api.getSelectedRows();
// //               if (selectedRows && selectedRows.length > 0 && !selectedRows[0].isGroupRow && !selectedRows[0].isSummaryRow) {
// //                 setModalState({
// //                   ...modalState,
// //                   view: true,
// //                   selectedRow: selectedRows[0],
// //                 });
// //               } else {
// //                 showAlert("Please select an invoice to view", "error");
// //               }
// //             }}
// //             className="flex items-center px-4 py-2 bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-700"
// //           >
// //             <AiOutlineEye className="mr-2" />
// //           </button>
// //           <button
// //             onClick={handleDownloadPDF}
// //             className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700"
// //           >
// //             <FaDownload className="mr-2" />
// //           </button>
// //         </div>
// //       </div>

// //       <div className="flex mb-4">
// //         <input
// //           type="text"
// //           placeholder="Search by company name..."
// //           value={searchValue}
// //           onChange={(e) => setSearchValue(e.target.value)}
// //           className="border border-gray-300 rounded-md p-2 w-64"
// //         />
// //         <button
// //           onClick={() => {
// //             setCurrentPage(1);
// //             fetchData();
// //           }}
// //           className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md ml-2 transition duration-300 hover:bg-blue-900"
// //         >
// //           <AiOutlineSearch className="mr-2" /> Search
// //         </button>
// //       </div>

// //       <div
// //         className="ag-theme-alpine relative"
// //         style={{ height: gridHeight, width: "100%", overflowY: "auto" }}
// //       >
// //         {isLoading && (
// //           <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 z-10">
// //             <span className="ml-3 text-gray-700 font-medium">Loading...</span>
// //           </div>
// //         )}

// //         <AgGridReact
// //           ref={gridRef}
// //           rowData={rowData}
// //           columnDefs={columnDefs}
// //           defaultColDef={{
// //             sortable: true,
// //             filter: true,
// //             resizable: true,
// //             cellStyle: { color: "#333", fontSize: "0.75rem", padding: "1px" },
// //             minWidth: 60,
// //           }}
// //           suppressRowClickSelection={false}
// //           rowSelection="single"
// //           rowHeight={30}
// //           headerHeight={35}
// //           overlayLoadingTemplate={
// //             '<span class="ag-overlay-loading-center">Loading...</span>'
// //           }
// //           overlayNoRowsTemplate={
// //             '<span class="ag-overlay-no-rows-center">No rows to show</span>'
// //           }
// //           onGridReady={(params) => {
// //             params.api.sizeColumnsToFit();
// //           }}
// //         />
// //       </div>

// //       <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
// //         <div className="flex items-center space-x-2">
// //           <button
// //             onClick={() => handlePageChange(1)}
// //             disabled={currentPage === 1}
// //             className="p-2 disabled:opacity-50 bg-gray-200 rounded hover:bg-gray-300"
// //           >
// //             <FaAngleDoubleLeft />
// //           </button>
// //           <button
// //             onClick={() => handlePageChange(currentPage - 1)}
// //             disabled={currentPage === 1}
// //             className="p-2 disabled:opacity-50 bg-gray-200 rounded hover:bg-gray-300"
// //           >
// //             <FaChevronLeft />
// //           </button>

// //           {renderPageNumbers()}

// //           <button
// //             onClick={() => handlePageChange(currentPage + 1)}
// //             disabled={currentPage === totalPages}
// //             className="p-2 disabled:opacity-50 bg-gray-200 rounded hover:bg-gray-300"
// //           >
// //             <FaChevronRight />
// //           </button>
// //           <button
// //             onClick={() => handlePageChange(totalPages)}
// //             disabled={currentPage === totalPages}
// //             className="p-2 disabled:opacity-50 bg-gray-200 rounded hover:bg-gray-300"
// //           >
// //             <FaAngleDoubleRight />
// //           </button>
// //         </div>
// //         <span className="text-sm text-gray-600">
// //           Page {currentPage} of {totalPages} | Total Records: {totalRecords}
// //         </span>
// //       </div>

// //       <AddRowModal
// //         isOpen={modalState.add}
// //         onClose={() => setModalState({ ...modalState, add: false })}
// //         onSubmit={handleAdd}
// //         clients={clients}
// //       />

// //       <ViewRowModal
// //         isOpen={modalState.view}
// //         onClose={() => setModalState({ ...modalState, view: false })}
// //         invoice={modalState.selectedRow}
// //       />

// //       <EditRowModal
// //         isOpen={modalState.edit}
// //         onClose={() => setModalState({ ...modalState, edit: false })}
// //         rowData={modalState.selectedRow as InvoiceData}
// //         onSave={fetchData}
// //         clients={clients}
// //       />
// //     </div>
// //   );
// // };

// // export default ByMonth;

// import {
//   FaChevronLeft,
//   FaChevronRight,
//   FaAngleDoubleLeft,
//   FaAngleDoubleRight,
//   FaDownload,
// } from "react-icons/fa";

// jsPDF.prototype.autoTable = autoTable;

// interface InvoiceData {
//   id: number;
//   invoicenumber: string;
//   startdate: string;
//   placementid: number;
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
//   companyname: string;
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
//   candidatename: string;
//   candidatephone: string;
//   candidateemail: string;
//   wrkemail: string;
//   wrkphone: string;
//   recruitername: string;
//   recruiterphone: string;
//   recruiteremail: string;
//   poid: number;
//   notes: string;
// }

// interface MonthGroup {
//   invmonth: string;
//   name: string;
//   invoices: InvoiceData[];
//   isGroup?: boolean;
//   isCollapsed?: boolean;
//   invoice_count: number;
//   summary: {
//     quantity: number;
//     amountexpected: number;
//     amountreceived: number;
//   };
// }

// interface RowData extends InvoiceData {
//   isGroupRow?: boolean;
//   isSummaryRow?: boolean;
//   level?: number;
//   expanded?: boolean;
//   name?: string;
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

// interface SortState {
//   field: string;
//   order: string;
// }

// const ByMonth = () => {
//   const gridRef = useRef<AgGridReact<RowData>>(null);
//   const [modalState, setModalState] = useState<ModalState>({
//     add: false,
//     view: false,
//     edit: false,
//     selectedRow: null,
//   });
//   const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
//   const [searchValue, setSearchValue] = useState("");
//   const [monthGroups, setMonthGroups] = useState<MonthGroup[]>([]);
//   const [expandedMonthGroups, setExpandedMonthGroups] = useState<{
//     [key: string]: boolean;
//   }>({});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [clients] = useState<{ id: number; pname: string }[]>([]);
//   const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
//   const [sortState] = useState<SortState>({
//     field: "invoicedate",
//     order: "desc",
//   });
//   const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);
//   const pageSize = 100;

//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const showAlert = (text: string, type: "success" | "error") => {
//     setAlertMessage({ text, type });
//     setTimeout(() => setAlertMessage(null), 3000);
//   };

//   const fetchData = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/invoices/dataByMonth`,
//         {
//           params: {
//             page: currentPage,
//             page_size: pageSize,
//             search_companyname: searchValue || undefined,
//             sort_field: sortState.field,
//             sort_order: sortState.order,
//           },
//         }
//       );

//       const processedData = response.data.data.map((group: MonthGroup) => ({
//         ...group,
//         isGroup: true,
//         isCollapsed: expandedMonthGroups[group.invmonth] || false,
//         invoice_count: group.invoices.length,
//       }));

//       setMonthGroups(processedData);
//       setTotalPages(response.data.pages);
//       setTotalRecords(response.data.total);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       showAlert("Error loading data", "error");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [currentPage, searchValue, sortState, expandedMonthGroups]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const toggleGroup = (month: string) => {
//     setSelectedMonth(month === selectedMonth ? null : month);
//     setExpandedMonthGroups((prev) => ({
//       ...prev,
//       [month]: !prev[month],
//     }));
//   };

//   const rowData = useMemo(() => {
//     const rows: RowData[] = [];
//     monthGroups.forEach((monthGroup) => {
//       rows.push({
//         id: -1,
//         name: monthGroup.invmonth,
//         invoicenumber: "",
//         startdate: "",
//         enddate: "",
//         invoicedate: "",
//         invmonth: monthGroup.invmonth,
//         quantity: 0,
//         otquantity: 0,
//         rate: 0,
//         overtimerate: 0,
//         status: "",
//         emppaiddate: "",
//         candpaymentstatus: "",
//         reminders: "",
//         amountexpected: 0,
//         expecteddate: "",
//         amountreceived: 0,
//         receiveddate: "",
//         releaseddate: "",
//         checknumber: "",
//         invoiceurl: "",
//         checkurl: "",
//         freqtype: "",
//         invoicenet: 0,
//         companyname: "",
//         vendorfax: "",
//         vendorphone: "",
//         vendoremail: "",
//         timsheetemail: "",
//         hrname: "",
//         hremail: "",
//         hrphone: "",
//         managername: "",
//         manageremail: "",
//         managerphone: "",
//         secondaryname: "",
//         secondaryemail: "",
//         secondaryphone: "",
//         candidatename: "",
//         candidatephone: "",
//         candidateemail: "",
//         wrkemail: "",
//         wrkphone: "",
//         recruitername: "",
//         recruiterphone: "",
//         recruiteremail: "",
//         poid: 0,
//         notes: "",
//         isGroupRow: true,
//         level: 0,
//         expanded: expandedMonthGroups[monthGroup.invmonth],
//         placementid: 0
//       });

//       if (expandedMonthGroups[monthGroup.invmonth]) {
//         monthGroup.invoices.forEach((invoice) => {
//           rows.push({
//             ...invoice,
//             name: `${invoice.candidatename} - ${invoice.companyname} - ${invoice.poid}`,
//             isGroupRow: false,
//             level: 1,
//           });
//         });

//         // Add summary row
//         rows.push({
//           id: -2,
//           name: "Summary",
//           invoicenumber: "",
//           startdate: "",
//           enddate: "",
//           invoicedate: "",
//           invmonth: monthGroup.invmonth,
//           quantity: monthGroup.summary.quantity,
//           otquantity: 0,
//           rate: 0,
//           overtimerate: 0,
//           status: "",
//           emppaiddate: "",
//           candpaymentstatus: "",
//           reminders: "",
//           amountexpected: monthGroup.summary.amountexpected,
//           expecteddate: "",
//           amountreceived: monthGroup.summary.amountreceived,
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
//           isGroupRow: false,
//           isSummaryRow: true,
//           level: 1,
//           placementid: 0
//         });
//       }
//     });
//     return rows;
//   }, [monthGroups, expandedMonthGroups]);

//   const getColumnWidth = (field: string) => {
//     if (windowWidth < 640) { // Mobile
//       return field === 'name' ? 120 : 80;
//     } else if (windowWidth < 1024) { // Tablet
//       return field === 'name' ? 150 : 100;
//     } else { // Desktop
//       return field === 'name' ? 200 : 120;
//     }
//   };

//   const columnDefs = useMemo<ColDef<RowData>[]>(
//     () => [
//       {
//         headerName: "Name",
//         field: "name",
//         cellRenderer: (params: ICellRendererParams<RowData>) => {
//           if (!params.data) return null;

//           if (params.data.isGroupRow) {
//             const expanded = params.data.invmonth ? expandedMonthGroups[params.data.invmonth] : false;
//             return (
//               <div className="flex items-center">
//                 <span
//                   className="cursor-pointer pl-1 flex items-center hover:bg-gray-100 rounded-md py-1 px-2 transition-colors duration-200"
//                   onClick={() => params.data && params.data.invmonth ? toggleGroup(params.data.invmonth) : undefined}
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
//           if (params.data.isSummaryRow) {
//             return <span className="pl-3 font-semibold">{params.value}</span>;
//           }
//           return <span className="pl-3">{params.value}</span>;
//         },
//         minWidth: getColumnWidth('name'),
//         flex: 1,
//         suppressSizeToFit: windowWidth < 1024,
//       },
//       {
//         headerName: "Invoice Number",
//         field: "invoicenumber",
//         hide: windowWidth < 768,
//         minWidth: getColumnWidth('invoicenumber'),
//         valueFormatter: (params) => params.value || '',
//       },
//       {
//         headerName: "Company",
//         field: "companyname",
//         hide: windowWidth < 768,
//         minWidth: getColumnWidth('companyname'),
//         valueFormatter: (params) => params.value || '',
//       },
//       {
//         headerName: "Start Date",
//         field: "startdate",
//         hide: windowWidth < 768,
//         minWidth: getColumnWidth('startdate'),
//         valueFormatter: (params) => params.value || '',
//       },
//       {
//         headerName: "End Date",
//         field: "enddate",
//         hide: windowWidth < 768,
//         minWidth: getColumnWidth('enddate'),
//         valueFormatter: (params) => params.value || '',
//       },
//       {
//         headerName: "Invoice Date",
//         field: "invoicedate",
//         minWidth: getColumnWidth('invoicedate'),
//         valueFormatter: (params) => params.value || '',
//       },
//       {
//         headerName: "Amount Expected",
//         field: "amountexpected",
//         minWidth: getColumnWidth('amountexpected'),
//         cellStyle: (params: CellClassParams<RowData>) => {
//           if (params.data?.isSummaryRow) {
//             return { fontWeight: "bold" };
//           }
//           return null;
//         },
//         valueFormatter: (params) => params.value === 0 && !params.data?.isSummaryRow ? '' : `$${params.value?.toFixed(2) || '0.00'}`,
//       },
//       {
//         headerName: "Amount Received",
//         field: "amountreceived",
//         minWidth: getColumnWidth('amountreceived'),
//         cellStyle: (params: CellClassParams<RowData>) => {
//           if (params.data?.isSummaryRow) {
//             return { fontWeight: "bold" };
//           }
//           return null;
//         },
//         valueFormatter: (params) => params.value === 0 && !params.data?.isSummaryRow ? '' : `$${params.value?.toFixed(2) || '0.00'}`,
//       },
//       {
//         headerName: "Status",
//         field: "status",
//         minWidth: getColumnWidth('status'),
//         cellRenderer: (params: ICellRendererParams<RowData>) => {
//           const statusMap: { [key: string]: string } = {
//             A: "Active",
//             I: "Inactive",
//             D: "Delete",
//             R: "Rejected",
//             N: "Not Interested",
//             E: "Excellent",
//           };
//           return statusMap[params.value as string] || params.value;
//         },
//       },
//     ],
//     [expandedMonthGroups, windowWidth]
//   );

//   const handlePageChange = (newPage: number) => {
//     if (newPage > 0 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//     }
//   };

//   const renderPageNumbers = () => {
//     const pageNumbers = [];
//     const maxVisiblePages = 5; // Show 5 page numbers at a time

//     let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//     const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

//     // Adjust startPage if we're near the end
//     if (endPage - startPage + 1 < maxVisiblePages) {
//       startPage = Math.max(1, endPage - maxVisiblePages + 1);
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       pageNumbers.push(
//         <button
//           key={i}
//           onClick={() => handlePageChange(i)}
//           className={`text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-md mx-0.5 ${
//             currentPage === i
//               ? "bg-blue-600 text-white"
//               : "bg-gray-200 text-gray-800 hover:bg-gray-300"
//           }`}
//         >
//           {i}
//         </button>
//       );
//     }

//     return pageNumbers;
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
//       console.error("Error adding invoice:", error);
//       showAlert("Error adding invoice", "error");
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (window.confirm("Are you sure you want to delete this invoice?")) {
//       try {
//         await axios.delete(
//           `${process.env.NEXT_PUBLIC_API_URL}/invoices/delete/${id}`
//         );
//         showAlert("Invoice deleted successfully", "success");
//         fetchData();
//       } catch (error) {
//         console.error("Error deleting invoice:", error);
//         showAlert("Error deleting invoice", "error");
//       }
//     }
//   };

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     const tableData = rowData
//       .filter((row) => !row.isGroupRow && !row.isSummaryRow && row.id !== -1 && row.id !== -2)
//       .map((row) => [
//         row.companyname || '',
//         row.name || '',
//         row.invoicenumber || '',
//         row.startdate || '',
//         row.enddate || '',
//         row.invoicedate || '',
//         row.quantity || 0,
//         row.otquantity || 0,
//         row.rate || 0,
//         row.overtimerate || 0,
//         row.status || '',
//         `$${row.amountexpected ? row.amountexpected.toFixed(2) : '0.00'}`,
//         row.expecteddate || '',
//         `$${row.amountreceived ? row.amountreceived.toFixed(2) : '0.00'}`,
//         row.receiveddate || '',
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
//         ],
//       ],
//       body: tableData,
//       styles: { fontSize: 8 },
//       margin: { top: 20 },
//     });

//     doc.save("invoices-by-month.pdf");
//   };

//   const gridHeight = useMemo(() => {
//     const rowHeight = windowWidth < 640 ? 25 : windowWidth < 1024 ? 28 : 30;
//     const headerHeight = windowWidth < 640 ? 30 : windowWidth < 1024 ? 32 : 35;
//     const maxHeight = windowWidth < 640 ? 300 : windowWidth < 1024 ? 350 : 400;
//     const minHeight = 200;

//     let rowCount = monthGroups.length;
//     monthGroups.forEach(group => {
//       if (expandedMonthGroups[group.invmonth]) {
//         rowCount += group.invoices.length + 1; // +1 for summary row
//       }
//     });

//     const calculatedHeight = Math.min(
//       maxHeight,
//       Math.max(minHeight, rowCount * rowHeight + headerHeight + 20)
//     );

//     return `${calculatedHeight}px`;
//   }, [monthGroups, expandedMonthGroups, windowWidth]);

//   const getIconSize = () => {
//     if (windowWidth < 640) return "text-xs"; // Mobile
//     if (windowWidth < 1024) return "text-sm"; // Tablet
//     return "text-base"; // Desktop
//   };

//   const getButtonPadding = () => {
//     if (windowWidth < 640) return "px-1 py-1"; // Mobile
//     if (windowWidth < 1024) return "px-1.5 py-1"; // Tablet
//     return "px-2 py-1.5"; // Desktop
//   };

//   const iconSize = getIconSize();
//   const buttonPadding = getButtonPadding();

//   return (
//     <div className="p-4 mt-20 mb-10 mx-auto bg-gray-100 rounded-lg shadow-md relative max-w-full sm:max-w-7xl">
//       {alertMessage && (
//         <div
//           className={`fixed top-4 right-4 p-4 ${
//             alertMessage.type === "success" ? "bg-green-500" : "bg-red-500"
//           } text-white rounded-md shadow-md z-50`}
//         >
//           {alertMessage.text}
//         </div>
//       )}

//       <div className="flex flex-col md:flex-row justify-between items-center mb-4">
//         <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Invoice Management (By Month)</h1>
//       </div>

//       <div className="flex flex-col sm:flex-row mb-4 justify-between items-center">
//         <div className="flex w-full sm:w-auto mb-2 sm:mb-0">
//           <input
//             type="text"
//             placeholder="Search by company name..."
//             value={searchValue}
//             onChange={(e) => setSearchValue(e.target.value)}
//             className="border border-gray-300 rounded-md p-1.5 sm:p-2 w-full sm:w-64 text-xs sm:text-sm"
//           />
//           <button
//             onClick={() => {
//               setCurrentPage(1);
//               fetchData();
//             }}
//             className={`flex items-center ${buttonPadding} bg-blue-600 text-white rounded-md ml-1 sm:ml-2 transition duration-300 hover:bg-blue-900 text-xs sm:text-sm`}
//           >
//             <AiOutlineSearch className={`mr-1 ${iconSize}`} />
//             <span className="hidden xs:inline">Search</span>
//           </button>
//         </div>

//         <div className="flex items-center space-x-1">
//           <button
//             onClick={() => setModalState({ ...modalState, add: true })}
//             className={`flex items-center justify-center ${buttonPadding} bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700 text-xs sm:text-sm`}
//             title="Add Invoice"
//           >
//             <MdAdd className={iconSize} />
//           </button>
//           <button
//             onClick={() => {
//               const selectedRows = gridRef.current?.api.getSelectedRows();
//               if (selectedRows && selectedRows.length > 0 && !selectedRows[0].isGroupRow && !selectedRows[0].isSummaryRow) {
//                 setModalState({
//                   ...modalState,
//                   edit: true,
//                   selectedRow: selectedRows[0],
//                 });
//               } else {
//                 showAlert("Please select an invoice to edit", "error");
//               }
//             }}
//             className={`flex items-center justify-center ${buttonPadding} bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700 text-xs sm:text-sm`}
//             title="Edit Invoice"
//           >
//             <AiOutlineEdit className={iconSize} />
//           </button>
//           <button
//             onClick={() => {
//               const selectedRows = gridRef.current?.api.getSelectedRows();
//               if (selectedRows && selectedRows.length > 0 && !selectedRows[0].isGroupRow && !selectedRows[0].isSummaryRow) {
//                 handleDelete(selectedRows[0].id);
//               } else {
//                 showAlert("Please select an invoice to delete", "error");
//               }
//             }}
//             className={`flex items-center justify-center ${buttonPadding} bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700 text-xs sm:text-sm`}
//             title="Delete Invoice"
//           >
//             <MdDelete className={iconSize} />
//           </button>
//           <button
//             onClick={() => {
//               const selectedRows = gridRef.current?.api.getSelectedRows();
//               if (selectedRows && selectedRows.length > 0 && !selectedRows[0].isGroupRow && !selectedRows[0].isSummaryRow) {
//                 setModalState({
//                   ...modalState,
//                   view: true,
//                   selectedRow: selectedRows[0],
//                 });
//               } else {
//                 showAlert("Please select an invoice to view", "error");
//               }
//             }}
//             className={`flex items-center justify-center ${buttonPadding} bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-700 text-xs sm:text-sm`}
//             title="View Invoice"
//           >
//             <AiOutlineEye className={iconSize} />
//           </button>
//           <button
//             onClick={handleDownloadPDF}
//             className={`flex items-center justify-center ${buttonPadding} bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700`}
//             title="Download PDF"
//           >
//             <FaDownload className={iconSize} />
//           </button>
//         </div>
//       </div>

//       <div
//         className="ag-theme-alpine relative"
//         style={{
//           height: gridHeight,
//           width: "100%",
//           overflowY: "auto",
//           fontSize: windowWidth < 640 ? '10px' : windowWidth < 1024 ? '12px' : '14px'
//         }}
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
//             resizable: true,
//             cellStyle: {
//               color: "#333",
//               fontSize: windowWidth < 640 ? "0.65rem" : windowWidth < 1024 ? "0.7rem" : "0.75rem",
//               padding: windowWidth < 640 ? "0px" : "1px"
//             },
//             minWidth: windowWidth < 640 ? 60 : windowWidth < 1024 ? 70 : 80,
//             maxWidth: windowWidth < 640 ? 100 : windowWidth < 1024 ? 120 : 150,
//           }}
//           suppressRowClickSelection={false}
//           rowSelection="single"
//           rowHeight={windowWidth < 640 ? 25 : windowWidth < 1024 ? 28 : 30}
//           headerHeight={windowWidth < 640 ? 30 : windowWidth < 1024 ? 32 : 35}
//           overlayLoadingTemplate={
//             '<span class="ag-overlay-loading-center">Loading...</span>'
//           }
//           overlayNoRowsTemplate={
//             '<span class="ag-overlay-no-rows-center">No rows to show</span>'
//           }
//           onGridReady={(params) => {
//             params.api.sizeColumnsToFit();
//           }}
//           enableRangeSelection={true}
//         />
//       </div>

//       <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
//         <div className="flex items-center justify-center w-full md:w-auto overflow-x-auto">
//           <div className="flex space-x-1 overflow-x-auto">
//             <button
//               onClick={() => handlePageChange(1)}
//               disabled={currentPage === 1}
//               className="p-1 sm:p-2 disabled:opacity-50 text-xs sm:text-sm"
//               title="First Page"
//             >
//               <FaAngleDoubleLeft className={iconSize} />
//             </button>
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="p-1 sm:p-2 disabled:opacity-50 text-xs sm:text-sm"
//               title="Previous Page"
//             >
//               <FaChevronLeft className={iconSize} />
//             </button>

//             {renderPageNumbers()}

//             <button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className="p-1 sm:p-2 disabled:opacity-50 text-xs sm:text-sm"
//               title="Next Page"
//             >
//               <FaChevronRight className={iconSize} />
//             </button>
//             <button
//               onClick={() => handlePageChange(totalPages)}
//               disabled={currentPage === totalPages}
//               className="p-1 sm:p-2 disabled:opacity-50 text-xs sm:text-sm"
//               title="Last Page"
//             >
//               <FaAngleDoubleRight className={iconSize} />
//             </button>
//           </div>
//         </div>
//         <span className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-0">
//           Page {currentPage} of {totalPages} | Total Records: {totalRecords}
//         </span>
//       </div>

//       <AddRowModal
//         isOpen={modalState.add}
//         onClose={() => setModalState({ ...modalState, add: false })}
//         onSubmit={handleAdd}
//         clients={clients}
//       />

//       <ViewRowModal
//         isOpen={modalState.view}
//         onClose={() => setModalState({ ...modalState, view: false })}
//         invoice={modalState.selectedRow}
//       />

//       <EditRowModal
//         isOpen={modalState.edit}
//         onClose={() => setModalState({ ...modalState, edit: false })}
//         rowData={modalState.selectedRow as InvoiceData}
//         onSave={fetchData}
//         clients={clients}
//       />
//     </div>
//   );
// };

// export default ByMonth;







// "use client";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import AddRowModal from "@/modals/bymonth_modals/AddRowByMonth";
// import EditRowModal from "@/modals/bymonth_modals/EditRowByMonth";
// import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import ViewRowModal from "@/modals/bymonth_modals/ViewRowByMonth";
// import autoTable from "jspdf-autotable";
// import axios from "axios";
// import { CellClassParams, ColDef, ICellRendererParams } from "ag-grid-community";
// import { AgGridReact } from "ag-grid-react";
// import { jsPDF } from "jspdf";
// import { AiOutlineEdit, AiOutlineEye, AiOutlineSearch } from "react-icons/ai";
// import { MdAdd, MdDelete } from "react-icons/md";

// import {
//   FaChevronLeft,
//   FaChevronRight,
//   FaAngleDoubleLeft,
//   FaAngleDoubleRight,
//   FaDownload,
// } from "react-icons/fa";

// jsPDF.prototype.autoTable = autoTable;

// interface InvoiceData {
//   id: number;
//   invoicenumber: string;
//   startdate: string;
//   placementid: number;
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
//   companyname: string;
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
//   candidatename: string;
//   candidatephone: string;
//   candidateemail: string;
//   wrkemail: string;
//   wrkphone: string;
//   recruitername: string;
//   recruiterphone: string;
//   recruiteremail: string;
//   poid: number;
//   notes: string;
// }

// interface MonthGroup {
//   invmonth: string;
//   name: string;
//   invoices: InvoiceData[];
//   isGroup?: boolean;
//   isCollapsed?: boolean;
//   invoice_count: number;
//   summary: {
//     quantity: number;
//     amountexpected: number;
//     amountreceived: number;
//   };
// }

// interface RowData extends InvoiceData {
//   isGroupRow?: boolean;
//   isSummaryRow?: boolean;
//   level?: number;
//   expanded?: boolean;
//   name?: string;
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

// interface SortState {
//   field: string;
//   order: string;
// }

// const ByMonth = () => {
//   const gridRef = useRef<AgGridReact<RowData>>(null);
//   const [modalState, setModalState] = useState<ModalState>({
//     add: false,
//     view: false,
//     edit: false,
//     selectedRow: null,
//   });
//   const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
//   const [searchValue, setSearchValue] = useState("");
//   const [monthGroups, setMonthGroups] = useState<MonthGroup[]>([]);
//   const [expandedMonthGroups, setExpandedMonthGroups] = useState<{
//     [key: string]: boolean;
//   }>({});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [clients] = useState<{ id: number; pname: string }[]>([]);
//   const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
//   const [sortState] = useState<SortState>({
//     field: "invoicedate",
//     order: "desc",
//   });
//   const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);
//   const pageSize = 100;

//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const showAlert = (text: string, type: "success" | "error") => {
//     setAlertMessage({ text, type });
//     setTimeout(() => setAlertMessage(null), 3000);
//   };

//   const fetchData = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/invoices/dataByMonth`,
//         {
//           params: {
//             page: currentPage,
//             page_size: pageSize,
//             search_companyname: searchValue || undefined,
//             sort_field: sortState.field,
//             sort_order: sortState.order,
//           },
//         }
//       );

//       const processedData = response.data.data.map((group: MonthGroup) => ({
//         ...group,
//         isGroup: true,
//         isCollapsed: expandedMonthGroups[group.invmonth] || false,
//         invoice_count: group.invoices.length,
//       }));

//       setMonthGroups(processedData);
//       setTotalPages(response.data.pages);
//       setTotalRecords(response.data.total);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       showAlert("Error loading data", "error");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [currentPage, searchValue, sortState, expandedMonthGroups]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const toggleGroup = (month: string) => {
//     setSelectedMonth(month === selectedMonth ? null : month);
//     setExpandedMonthGroups((prev) => ({
//       ...prev,
//       [month]: !prev[month],
//     }));
//   };

//   const rowData = useMemo(() => {
//     const rows: RowData[] = [];
//     monthGroups.forEach((monthGroup) => {
//       rows.push({
//         id: -1,
//         name: monthGroup.invmonth,
//         invoicenumber: "",
//         startdate: "",
//         enddate: "",
//         invoicedate: "",
//         invmonth: monthGroup.invmonth,
//         quantity: 0,
//         otquantity: 0,
//         rate: 0,
//         overtimerate: 0,
//         status: "",
//         emppaiddate: "",
//         candpaymentstatus: "",
//         reminders: "",
//         amountexpected: 0,
//         expecteddate: "",
//         amountreceived: 0,
//         receiveddate: "",
//         releaseddate: "",
//         checknumber: "",
//         invoiceurl: "",
//         checkurl: "",
//         freqtype: "",
//         invoicenet: 0,
//         companyname: "",
//         vendorfax: "",
//         vendorphone: "",
//         vendoremail: "",
//         timsheetemail: "",
//         hrname: "",
//         hremail: "",
//         hrphone: "",
//         managername: "",
//         manageremail: "",
//         managerphone: "",
//         secondaryname: "",
//         secondaryemail: "",
//         secondaryphone: "",
//         candidatename: "",
//         candidatephone: "",
//         candidateemail: "",
//         wrkemail: "",
//         wrkphone: "",
//         recruitername: "",
//         recruiterphone: "",
//         recruiteremail: "",
//         poid: 0,
//         notes: "",
//         isGroupRow: true,
//         level: 0,
//         expanded: expandedMonthGroups[monthGroup.invmonth],
//         placementid: 0
//       });

//       if (expandedMonthGroups[monthGroup.invmonth]) {
//         monthGroup.invoices.forEach((invoice) => {
//           rows.push({
//             ...invoice,
//             name: `${invoice.candidatename} - ${invoice.companyname} - ${invoice.poid}`,
//             isGroupRow: false,
//             level: 1,
//           });
//         });

//         // Add summary row
//         rows.push({
//           id: -2,
//           name: "Summary",
//           invoicenumber: "",
//           startdate: "",
//           enddate: "",
//           invoicedate: "",
//           invmonth: monthGroup.invmonth,
//           quantity: monthGroup.summary.quantity,
//           otquantity: 0,
//           rate: 0,
//           overtimerate: 0,
//           status: "",
//           emppaiddate: "",
//           candpaymentstatus: "",
//           reminders: "",
//           amountexpected: monthGroup.summary.amountexpected,
//           expecteddate: "",
//           amountreceived: monthGroup.summary.amountreceived,
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
//           isGroupRow: false,
//           isSummaryRow: true,
//           level: 1,
//           placementid: 0
//         });
//       }
//     });
//     return rows;
//   }, [monthGroups, expandedMonthGroups]);

//   const getColumnWidth = (field: string) => {
//     if (windowWidth < 640) { // Mobile
//       return field === 'name' ? 120 : 80;
//     } else if (windowWidth < 1024) { // Tablet
//       return field === 'name' ? 150 : 100;
//     } else { // Desktop
//       return field === 'name' ? 200 : 120;
//     }
//   };

//   const columnDefs = useMemo<ColDef<RowData>[]>(
//     () => [
//       {
//         headerName: "Name",
//         field: "name",
//         cellRenderer: (params: ICellRendererParams<RowData>) => {
//           if (!params.data) return null;

//           if (params.data.isGroupRow) {
//             const expanded = params.data.invmonth ? expandedMonthGroups[params.data.invmonth] : false;
//             return (
//               <div className="flex items-center">
//                 <span
//                   className="cursor-pointer pl-1 flex items-center hover:bg-gray-100 rounded-md py-1 px-2 transition-colors duration-200"
//                   onClick={() => params.data && params.data.invmonth ? toggleGroup(params.data.invmonth) : undefined}
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
//           if (params.data.isSummaryRow) {
//             return <span className="pl-3 font-semibold">{params.value}</span>;
//           }
//           return <span className="pl-3">{params.value}</span>;
//         },
//         minWidth: getColumnWidth('name'),
//         flex: 1,
//         suppressSizeToFit: windowWidth < 1024,
//       },
//       {
//         headerName: "Invoice Number",
//         field: "invoicenumber",
//         hide: windowWidth < 768,
//         minWidth: getColumnWidth('invoicenumber'),
//         valueFormatter: (params) => params.value || '',
//       },
//       {
//         headerName: "Company",
//         field: "companyname",
//         hide: windowWidth < 768,
//         minWidth: getColumnWidth('companyname'),
//         valueFormatter: (params) => params.value || '',
//       },
//       {
//         headerName: "Start Date",
//         field: "startdate",
//         hide: windowWidth < 768,
//         minWidth: getColumnWidth('startdate'),
//         valueFormatter: (params) => params.value || '',
//       },
//       {
//         headerName: "End Date",
//         field: "enddate",
//         hide: windowWidth < 768,
//         minWidth: getColumnWidth('enddate'),
//         valueFormatter: (params) => params.value || '',
//       },
//       {
//         headerName: "Invoice Date",
//         field: "invoicedate",
//         minWidth: getColumnWidth('invoicedate'),
//         valueFormatter: (params) => params.value || '',
//       },
//       {
//         headerName: "Amount Expected",
//         field: "amountexpected",
//         minWidth: getColumnWidth('amountexpected'),
//         cellStyle: (params: CellClassParams<RowData>) => {
//           if (params.data?.isSummaryRow) {
//             return { fontWeight: "bold" };
//           }
//           return null;
//         },
//         valueFormatter: (params) => params.value === 0 && !params.data?.isSummaryRow ? '' : `$${params.value?.toFixed(2) || '0.00'}`,
//       },
//       {
//         headerName: "Amount Received",
//         field: "amountreceived",
//         minWidth: getColumnWidth('amountreceived'),
//         cellStyle: (params: CellClassParams<RowData>) => {
//           if (params.data?.isSummaryRow) {
//             return { fontWeight: "bold" };
//           }
//           return null;
//         },
//         valueFormatter: (params) => params.value === 0 && !params.data?.isSummaryRow ? '' : `$${params.value?.toFixed(2) || '0.00'}`,
//       },
//       {
//         headerName: "Status",
//         field: "status",
//         minWidth: getColumnWidth('status'),
//         cellRenderer: (params: ICellRendererParams<RowData>) => {
//           const statusMap: { [key: string]: string } = {
//             A: "Active",
//             I: "Inactive",
//             D: "Delete",
//             R: "Rejected",
//             N: "Not Interested",
//             E: "Excellent",
//           };
//           return statusMap[params.value as string] || params.value;
//         },
//       },
//     ],
//     [expandedMonthGroups, windowWidth]
//   );

//   const handlePageChange = (newPage: number) => {
//     if (newPage > 0 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//     }
//   };

//   const renderPageNumbers = () => {
//     const pageNumbers = [];
//     const maxVisiblePages = 5; // Show 5 page numbers at a time

//     let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//     const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

//     // Adjust startPage if we're near the end
//     if (endPage - startPage + 1 < maxVisiblePages) {
//       startPage = Math.max(1, endPage - maxVisiblePages + 1);
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       pageNumbers.push(
//         <button
//           key={i}
//           onClick={() => handlePageChange(i)}
//           className={`text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-md mx-0.5 ${
//             currentPage === i
//               ? "bg-blue-600 text-white"
//               : "bg-gray-200 text-gray-800 hover:bg-gray-300"
//           }`}
//         >
//           {i}
//         </button>
//       );
//     }

//     return pageNumbers;
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
//       console.error("Error adding invoice:", error);
//       showAlert("Error adding invoice", "error");
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (window.confirm("Are you sure you want to delete this invoice?")) {
//       try {
//         await axios.delete(
//           `${process.env.NEXT_PUBLIC_API_URL}/invoices/delete/${id}`
//         );
//         showAlert("Invoice deleted successfully", "success");
//         fetchData();
//       } catch (error) {
//         console.error("Error deleting invoice:", error);
//         showAlert("Error deleting invoice", "error");
//       }
//     }
//   };

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     const tableData = rowData
//       .filter((row) => !row.isGroupRow && !row.isSummaryRow && row.id !== -1 && row.id !== -2)
//       .map((row) => [
//         row.companyname || '',
//         row.name || '',
//         row.invoicenumber || '',
//         row.startdate || '',
//         row.enddate || '',
//         row.invoicedate || '',
//         row.quantity || 0,
//         row.otquantity || 0,
//         row.rate || 0,
//         row.overtimerate || 0,
//         row.status || '',
//         `$${row.amountexpected ? row.amountexpected.toFixed(2) : '0.00'}`,
//         row.expecteddate || '',
//         `$${row.amountreceived ? row.amountreceived.toFixed(2) : '0.00'}`,
//         row.receiveddate || '',
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
//         ],
//       ],
//       body: tableData,
//       styles: { fontSize: 8 },
//       margin: { top: 20 },
//     });

//     doc.save("invoices-by-month.pdf");
//   };

//   const gridHeight = useMemo(() => {
//     const rowHeight = windowWidth < 640 ? 25 : windowWidth < 1024 ? 28 : 30;
//     const headerHeight = windowWidth < 640 ? 30 : windowWidth < 1024 ? 32 : 35;
//     const maxHeight = windowWidth < 640 ? 300 : windowWidth < 1024 ? 350 : 400;
//     const minHeight = 200;

//     let rowCount = monthGroups.length;
//     monthGroups.forEach(group => {
//       if (expandedMonthGroups[group.invmonth]) {
//         rowCount += group.invoices.length + 1; // +1 for summary row
//       }
//     });

//     const calculatedHeight = Math.min(
//       maxHeight,
//       Math.max(minHeight, rowCount * rowHeight + headerHeight + 20)
//     );

//     return `${calculatedHeight}px`;
//   }, [monthGroups, expandedMonthGroups, windowWidth]);

//   const getIconSize = () => {
//     if (windowWidth < 640) return "text-xs"; // Mobile
//     if (windowWidth < 1024) return "text-sm"; // Tablet
//     return "text-base"; // Desktop
//   };

//   const getButtonPadding = () => {
//     if (windowWidth < 640) return "px-1 py-1"; // Mobile
//     if (windowWidth < 1024) return "px-1.5 py-1"; // Tablet
//     return "px-2 py-1.5"; // Desktop
//   };

//   const iconSize = getIconSize();
//   const buttonPadding = getButtonPadding();

//   return (
//     <div className="p-4 mt-20 mb-10 mx-auto bg-gray-100 rounded-lg shadow-md relative max-w-full sm:max-w-7xl">
//       {alertMessage && (
//         <div
//           className={`fixed top-4 right-4 p-4 ${
//             alertMessage.type === "success" ? "bg-green-500" : "bg-red-500"
//           } text-white rounded-md shadow-md z-50`}
//         >
//           {alertMessage.text}
//         </div>
//       )}

//       <div className="flex flex-col md:flex-row justify-between items-center mb-4">
//         <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Invoice Management (By Month)</h1>
//       </div>

//       <div className="flex flex-col sm:flex-row mb-4 justify-between items-center">
//         <div className="flex w-full sm:w-auto mb-2 sm:mb-0">
//           <input
//             type="text"
//             placeholder="Search by company name..."
//             value={searchValue}
//             onChange={(e) => setSearchValue(e.target.value)}
//             className="border border-gray-300 rounded-md p-1.5 sm:p-2 w-full sm:w-64 text-xs sm:text-sm"
//           />
//           <button
//             onClick={() => {
//               setCurrentPage(1);
//               fetchData();
//             }}
//             className={`flex items-center ${buttonPadding} bg-blue-600 text-white rounded-md ml-1 sm:ml-2 transition duration-300 hover:bg-blue-900 text-xs sm:text-sm`}
//           >
//             <AiOutlineSearch className={`mr-1 ${iconSize}`} />
//             <span className="hidden xs:inline">Search</span>
//           </button>
//         </div>

//         <div className="flex items-center space-x-1">
//           <button
//             onClick={() => setModalState({ ...modalState, add: true })}
//             className={`flex items-center justify-center ${buttonPadding} bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700 text-xs sm:text-sm`}
//             title="Add Invoice"
//           >
//             <MdAdd className={iconSize} />
//           </button>
//           <button
//             onClick={() => {
//               const selectedRows = gridRef.current?.api.getSelectedRows();
//               if (selectedRows && selectedRows.length > 0 && !selectedRows[0].isGroupRow && !selectedRows[0].isSummaryRow) {
//                 setModalState({
//                   ...modalState,
//                   edit: true,
//                   selectedRow: selectedRows[0],
//                 });
//               } else {
//                 showAlert("Please select an invoice to edit", "error");
//               }
//             }}
//             className={`flex items-center justify-center ${buttonPadding} bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700 text-xs sm:text-sm`}
//             title="Edit Invoice"
//           >
//             <AiOutlineEdit className={iconSize} />
//           </button>
//           <button
//             onClick={() => {
//               const selectedRows = gridRef.current?.api.getSelectedRows();
//               if (selectedRows && selectedRows.length > 0 && !selectedRows[0].isGroupRow && !selectedRows[0].isSummaryRow) {
//                 handleDelete(selectedRows[0].id);
//               } else {
//                 showAlert("Please select an invoice to delete", "error");
//               }
//             }}
//             className={`flex items-center justify-center ${buttonPadding} bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700 text-xs sm:text-sm`}
//             title="Delete Invoice"
//           >
//             <MdDelete className={iconSize} />
//           </button>
//           <button
//             onClick={() => {
//               const selectedRows = gridRef.current?.api.getSelectedRows();
//               if (selectedRows && selectedRows.length > 0 && !selectedRows[0].isGroupRow && !selectedRows[0].isSummaryRow) {
//                 setModalState({
//                   ...modalState,
//                   view: true,
//                   selectedRow: selectedRows[0],
//                 });
//               } else {
//                 showAlert("Please select an invoice to view", "error");
//               }
//             }}
//             className={`flex items-center justify-center ${buttonPadding} bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-700 text-xs sm:text-sm`}
//             title="View Invoice"
//           >
//             <AiOutlineEye className={iconSize} />
//           </button>
//           <button
//             onClick={handleDownloadPDF}
//             className={`flex items-center justify-center ${buttonPadding} bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700`}
//             title="Download PDF"
//           >
//             <FaDownload className={iconSize} />
//           </button>
//         </div>
//       </div>

//       <div
//         className="ag-theme-alpine relative"
//         style={{
//           height: gridHeight,
//           width: "100%",
//           overflowY: "auto",
//           fontSize: windowWidth < 640 ? '10px' : windowWidth < 1024 ? '12px' : '14px'
//         }}
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
//             resizable: true,
//             cellStyle: {
//               color: "#333",
//               fontSize: windowWidth < 640 ? "0.65rem" : windowWidth < 1024 ? "0.7rem" : "0.75rem",
//               padding: windowWidth < 640 ? "0px" : "1px"
//             },
//             minWidth: windowWidth < 640 ? 60 : windowWidth < 1024 ? 70 : 80,
//             maxWidth: windowWidth < 640 ? 100 : windowWidth < 1024 ? 120 : 150,
//           }}
//           suppressRowClickSelection={true}
//           enableCellTextSelection={true}
//           ensureDomOrder={true}
//           rowSelection="single"
//           suppressRowDeselection={false}
//           rowHeight={windowWidth < 640 ? 25 : windowWidth < 1024 ? 28 : 30}
//           headerHeight={windowWidth < 640 ? 30 : windowWidth < 1024 ? 32 : 35}
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

//       <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
//         <div className="flex items-center justify-center w-full md:w-auto overflow-x-auto">
//           <div className="flex space-x-1 overflow-x-auto">
//             <button
//               onClick={() => handlePageChange(1)}
//               disabled={currentPage === 1}
//               className="p-1 sm:p-2 disabled:opacity-50 text-xs sm:text-sm"
//               title="First Page"
//             >
//               <FaAngleDoubleLeft className={iconSize} />
//             </button>
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="p-1 sm:p-2 disabled:opacity-50 text-xs sm:text-sm"
//               title="Previous Page"
//             >
//               <FaChevronLeft className={iconSize} />
//             </button>

//             {renderPageNumbers()}

//             <button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className="p-1 sm:p-2 disabled:opacity-50 text-xs sm:text-sm"
//               title="Next Page"
//             >
//               <FaChevronRight className={iconSize} />
//             </button>
//             <button
//               onClick={() => handlePageChange(totalPages)}
//               disabled={currentPage === totalPages}
//               className="p-1 sm:p-2 disabled:opacity-50 text-xs sm:text-sm"
//               title="Last Page"
//             >
//               <FaAngleDoubleRight className={iconSize} />
//             </button>
//           </div>
//         </div>
//         <span className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-0">
//           Page {currentPage} of {totalPages} | Total Records: {totalRecords}
//         </span>
//       </div>

//       <AddRowModal
//         isOpen={modalState.add}
//         onClose={() => setModalState({ ...modalState, add: false })}
//         onSubmit={handleAdd}
//         clients={clients}
//       />

//       <ViewRowModal
//         isOpen={modalState.view}
//         onClose={() => setModalState({ ...modalState, view: false })}
//         invoice={modalState.selectedRow}
//       />

//       <EditRowModal
//         isOpen={modalState.edit}
//         onClose={() => setModalState({ ...modalState, edit: false })}
//         rowData={modalState.selectedRow as InvoiceData}
//         onSave={fetchData}
//         clients={clients}
//       />
//     </div>
//   );
// };

// export default ByMonth;



jsPDF.prototype.autoTable = autoTable;

interface InvoiceData {
  id: number;
  invoicenumber: string;
  startdate: string;
  placementid: number;
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
  name: string;
  invoices: InvoiceData[];
  isGroup?: boolean;
  isCollapsed?: boolean;
  invoice_count: number;
  summary: {
    quantity: number;
    amountexpected: number;
    amountreceived: number;
  };
}

interface RowData extends InvoiceData {
  isGroupRow?: boolean;
  isSummaryRow?: boolean;
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

interface SortState {
  field: string;
  order: string;
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
  const [monthGroups, setMonthGroups] = useState<MonthGroup[]>([]);
  const [expandedMonthGroups, setExpandedMonthGroups] = useState<{
    [key: string]: boolean;
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [clients] = useState<{ id: number; pname: string }[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [sortState] = useState<SortState>({
    field: "invoicedate",
    order: "desc",
  });
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [, setSelectedRowId] = useState<number | null>(null);
  const pageSize = 100;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showAlert = (text: string, type: "success" | "error") => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/invoices/dataByMonth`,
        {
          params: {
            page: currentPage,
            page_size: pageSize,
            search_companyname: searchValue || undefined,
            sort_field: sortState.field,
            sort_order: sortState.order,
          },
        }
      );

      const processedData = response.data.data.map((group: MonthGroup) => ({
        ...group,
        isGroup: true,
        isCollapsed: expandedMonthGroups[group.invmonth] || false,
        invoice_count: group.invoices.length,
      }));

      setMonthGroups(processedData);
      setTotalPages(response.data.pages);
      setTotalRecords(response.data.total);
    } catch (error) {
      console.error("Error fetching data:", error);
      showAlert("Error loading data", "error");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchValue, sortState, expandedMonthGroups]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleGroup = (month: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedMonth(month === selectedMonth ? null : month);
    setExpandedMonthGroups((prev) => ({
      ...prev,
      [month]: !prev[month],
    }));
  };

  const rowData = useMemo(() => {
    const rows: RowData[] = [];
    monthGroups.forEach((monthGroup) => {
      rows.push({
        id: -1,
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
        placementid: 0
      });

      if (expandedMonthGroups[monthGroup.invmonth]) {
        monthGroup.invoices.forEach((invoice) => {
          rows.push({
            ...invoice,
            name: `${invoice.candidatename} - ${invoice.companyname} - ${invoice.poid}`,
            isGroupRow: false,
            level: 1,
          });
        });

        // Add summary row
        rows.push({
          id: -2,
          name: "Summary",
          invoicenumber: "",
          startdate: "",
          enddate: "",
          invoicedate: "",
          invmonth: monthGroup.invmonth,
          quantity: monthGroup.summary.quantity,
          otquantity: 0,
          rate: 0,
          overtimerate: 0,
          status: "",
          emppaiddate: "",
          candpaymentstatus: "",
          reminders: "",
          amountexpected: monthGroup.summary.amountexpected,
          expecteddate: "",
          amountreceived: monthGroup.summary.amountreceived,
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
          isGroupRow: false,
          isSummaryRow: true,
          level: 1,
          placementid: 0
        });
      }
    });
    return rows;
  }, [monthGroups, expandedMonthGroups]);

  const getColumnWidth = (field: string) => {
    if (windowWidth < 640) { // Mobile
      return field === 'name' ? 120 : 80;
    } else if (windowWidth < 1024) { // Tablet
      return field === 'name' ? 150 : 100;
    } else { // Desktop
      return field === 'name' ? 200 : 120;
    }
  };

  const columnDefs = useMemo<ColDef<RowData>[]>(
    () => [
      {
        headerName: "Name",
        field: "name",
        cellRenderer: (params: ICellRendererParams<RowData>) => {
          if (!params.data) return null;

          if (params.data.isGroupRow) {
            const expanded = params.data.invmonth ? expandedMonthGroups[params.data.invmonth] : false;
            return (
              <div className="flex items-center">
                <span
                  className="cursor-pointer pl-1 flex items-center hover:bg-gray-100 rounded-md py-1 px-2 transition-colors duration-200"
                  onClick={(e) => params.data && params.data.invmonth ? toggleGroup(params.data.invmonth, e) : undefined}
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
          }
          if (params.data.isSummaryRow) {
            return <span className="pl-3 font-semibold">{params.value}</span>;
          }
          return <span className="pl-3">{params.value}</span>;
        },
        minWidth: getColumnWidth('name'),
        flex: 1,
        suppressSizeToFit: windowWidth < 1024,
      },
      {
        headerName: "Invoice Number",
        field: "invoicenumber",
        hide: windowWidth < 768,
        minWidth: getColumnWidth('invoicenumber'),
        valueFormatter: (params) => params.value || '',
      },
      {
        headerName: "Company",
        field: "companyname",
        hide: windowWidth < 768,
        minWidth: getColumnWidth('companyname'),
        valueFormatter: (params) => params.value || '',
      },
      {
        headerName: "Start Date",
        field: "startdate",
        hide: windowWidth < 768,
        minWidth: getColumnWidth('startdate'),
        valueFormatter: (params) => params.value || '',
      },
      {
        headerName: "End Date",
        field: "enddate",
        hide: windowWidth < 768,
        minWidth: getColumnWidth('enddate'),
        valueFormatter: (params) => params.value || '',
      },
      {
        headerName: "Invoice Date",
        field: "invoicedate",
        minWidth: getColumnWidth('invoicedate'),
        valueFormatter: (params) => params.value || '',
      },
      {
        headerName: "Amount Expected",
        field: "amountexpected",
        minWidth: getColumnWidth('amountexpected'),
        cellStyle: (params: CellClassParams<RowData>) => {
          if (params.data?.isSummaryRow) {
            return { fontWeight: "bold" };
          }
          return null;
        },
        valueFormatter: (params) => params.value === 0 && !params.data?.isSummaryRow ? '' : `$${params.value?.toFixed(2) || '0.00'}`,
      },
      {
        headerName: "Amount Received",
        field: "amountreceived",
        minWidth: getColumnWidth('amountreceived'),
        cellStyle: (params: CellClassParams<RowData>) => {
          if (params.data?.isSummaryRow) {
            return { fontWeight: "bold" };
          }
          return null;
        },
        valueFormatter: (params) => params.value === 0 && !params.data?.isSummaryRow ? '' : `$${params.value?.toFixed(2) || '0.00'}`,
      },
      {
        headerName: "Status",
        field: "status",
        minWidth: getColumnWidth('status'),
        cellRenderer: (params: ICellRendererParams<RowData>) => {
          const statusMap: { [key: string]: string } = {
            A: "Active",
            I: "Inactive",
            D: "Delete",
            R: "Rejected",
            N: "Not Interested",
            E: "Excellent",
          };
          return statusMap[params.value as string] || params.value;
        },
      },
    ],
    [expandedMonthGroups, windowWidth]
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-md mx-0.5 ${
            currentPage === i
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }
    
    return pageNumbers;
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
      showAlert("Error adding invoice", "error");
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
        console.error("Error deleting invoice:", error);
        showAlert("Error deleting invoice", "error");
      }
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const tableData = rowData
      .filter((row) => !row.isGroupRow && row.id !== -1 && !row.isSummaryRow)
      .map((row) => [
        row.companyname || "",
        row.name || "",
        row.invoicenumber || "",
        row.startdate || "",
        row.enddate || "",
        row.invoicedate || "",
        row.quantity || "",
        row.otquantity || "",
        row.rate || "",
        row.overtimerate || "",
        row.status || "",
        row.amountexpected || "",
        row.expecteddate || "",
        row.amountreceived || "",
        row.receiveddate || "",
        row.releaseddate || "",
        row.checknumber || "",
        row.invoiceurl || "",
        row.checkurl || "",
        row.freqtype || "",
        row.invoicenet || "",
        row.vendorfax || "",
        row.vendorphone || "",
        row.vendoremail || "",
        row.timsheetemail || "",
        row.hrname || "",
        row.hremail || "",
        row.hrphone || "",
        row.managername || "",
        row.manageremail || "",
        row.managerphone || "",
        row.secondaryname || "",
        row.secondaryemail || "",
        row.secondaryphone || "",
        row.candidatename || "",
        row.candidatephone || "",
        row.candidateemail || "",
        row.wrkemail || "",
        row.wrkphone || "",
        row.recruitername || "",
        row.recruiterphone || "",
        row.recruiteremail || "",
        row.notes || "",
      ]);

    autoTable(doc, {
      head: [
        [
          "Company",
          "Name",
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
          "Released Date",
          "Check Number",
          "Invoice URL",
          "Check URL",
          "Freq Type",
          "Invoice Net",
          "Vendor Fax",
          "Vendor Phone",
          "Vendor Email",
          "Timesheet Email",
          "HR Name",
          "HR Email",
          "HR Phone",
          "Manager Name",
          "Manager Email",
          "Manager Phone",
          "Secondary Name",
          "Secondary Email",
          "Secondary Phone",
          "Candidate Name",
          "Candidate Phone",
          "Candidate Email",
          "Work Email",
          "Work Phone",
          "Recruiter Name",
          "Recruiter Phone",
          "Recruiter Email",
          "Notes",
        ],
      ],
      body: tableData,
      styles: { fontSize: 8 },
      margin: { top: 20 },
    });

    doc.save("invoices-by-month.pdf");
  };

  const gridHeight = useMemo(() => {
    const rowHeight = windowWidth < 640 ? 25 : windowWidth < 1024 ? 28 : 30;
    const headerHeight = windowWidth < 640 ? 30 : windowWidth < 1024 ? 32 : 35;
    const maxHeight = windowWidth < 640 ? 300 : windowWidth < 1024 ? 350 : 400;
    const minHeight = 200;
    
    let rowCount = monthGroups.length;
    monthGroups.forEach(group => {
      if (expandedMonthGroups[group.invmonth]) {
        rowCount += group.invoices.length + 1;
      }
    });
    
    const calculatedHeight = Math.min(
      maxHeight,
      Math.max(minHeight, rowCount * rowHeight + headerHeight + 20)
    );
    
    return `${calculatedHeight}px`;
  }, [monthGroups, expandedMonthGroups, windowWidth]);

  const getIconSize = () => {
    if (windowWidth < 640) return "text-xs";
    if (windowWidth < 1024) return "text-sm";
    return "text-base";
  };

  const getButtonPadding = () => {
    if (windowWidth < 640) return "px-1 py-1";
    if (windowWidth < 1024) return "px-1.5 py-1";
    return "px-2 py-1.5";
  };

  const iconSize = getIconSize();
  const buttonPadding = getButtonPadding();

  // Handle row selection
  const onRowSelected = useCallback((event: RowSelectedEvent<RowData>) => {
    if (event.node.isSelected() && event.data && !event.data.isGroupRow && !event.data.isSummaryRow) {
      setSelectedRowId(event.data.id);
    }
  }, []);

  return (
    <div className="relative">
      {alertMessage && (
        <div
          className={`fixed top-4 right-4 p-4 ${
            alertMessage.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white rounded-md shadow-md z-50`}
        >
          {alertMessage.text}
        </div>
      )}

      <div className="p-2 sm:p-4 mt-16 sm:mt-20 mb-6 sm:mb-10 mx-auto bg-gray-100 rounded-lg shadow-md relative max-w-full sm:max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-3 sm:mb-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Invoice Management (By Month)</h1>
        </div>

        <div className="flex flex-col sm:flex-row mb-3 sm:mb-4 justify-between items-center">
          <div className="flex w-full sm:w-auto mb-2 sm:mb-0">
            <input
              type="text"
              placeholder="Search by company name..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="border border-gray-300 rounded-md p-1.5 sm:p-2 w-full sm:w-64 text-xs sm:text-sm"
            />
            <button
              onClick={() => {
                setCurrentPage(1);
                fetchData();
              }}
              className={`flex items-center ${buttonPadding} bg-blue-600 text-white rounded-md ml-1 sm:ml-2 transition duration-300 hover:bg-blue-900 text-xs sm:text-sm`}
            >
              <AiOutlineSearch className={`mr-1 ${iconSize}`} /> 
              <span className="hidden xs:inline">Search</span>
            </button>
          </div>
        
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setModalState({ ...modalState, add: true })}
              className={`flex items-center justify-center ${buttonPadding} bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700 text-xs sm:text-sm`}
              title="Add Invoice"
            >
              <MdAdd className={iconSize} />
            </button>
            <button
              onClick={() => {
                const selectedRows = gridRef.current?.api.getSelectedRows();
                if (selectedRows && selectedRows.length > 0 && !selectedRows[0].isGroupRow && !selectedRows[0].isSummaryRow) {
                  setModalState({
                    ...modalState,
                    edit: true,
                    selectedRow: selectedRows[0],
                  });
                } else {
                  showAlert("Please select an invoice to edit", "error");
                }
              }}
              className={`flex items-center justify-center ${buttonPadding} bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700 text-xs sm:text-sm`}
              title="Edit Invoice"
            >
              <AiOutlineEdit className={iconSize} />
            </button>
            <button
              onClick={() => {
                const selectedRows = gridRef.current?.api.getSelectedRows();
                if (selectedRows && selectedRows.length > 0 && !selectedRows[0].isGroupRow && !selectedRows[0].isSummaryRow) {
                  setModalState({
                    ...modalState,
                    view: true,
                    selectedRow: selectedRows[0],
                  });
                } else {
                  showAlert("Please select an invoice to view", "error");
                }
              }}
              className={`flex items-center justify-center ${buttonPadding} bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-700 text-xs sm:text-sm`}
              title="View Invoice"
            >
              <AiOutlineEye className={iconSize} />
            </button>
            <button
              onClick={() => {
                const selectedRows = gridRef.current?.api.getSelectedRows();
                if (selectedRows && selectedRows.length > 0 && !selectedRows[0].isGroupRow && !selectedRows[0].isSummaryRow) {
                  handleDelete(selectedRows[0].id);
                } else {
                  showAlert("Please select an invoice to delete", "error");
                }
              }}
              className={`flex items-center justify-center ${buttonPadding} bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700 text-xs sm:text-sm`}
              title="Delete Invoice"
            >
              <MdDelete className={iconSize} />
            </button>
            <button
              onClick={() => {
                setSearchValue("");
                fetchData();
              }}
              className={`flex items-center justify-center ${buttonPadding} bg-gray-500 text-white rounded-md transition duration-300 hover:bg-gray-900 text-xs sm:text-sm`}
              title="Refresh"
            >
              <AiOutlineReload className={iconSize} />
            </button>
            <button
              onClick={handleDownloadPDF}
              className={`flex items-center justify-center ${buttonPadding} bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700`}
              title="Download PDF"
            >
              <FaDownload className={iconSize} />
            </button>
          </div>
        </div>
      
        <div 
          className="ag-theme-alpine relative"
          style={{ 
            height: gridHeight, 
            width: "100%", 
            overflowY: "auto",
            fontSize: windowWidth < 640 ? '10px' : windowWidth < 1024 ? '12px' : '14px'
          }}
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
              editable: true,
              resizable: true,
              cellStyle: { 
                color: "#333", 
                fontSize: windowWidth < 640 ? "0.65rem" : windowWidth < 1024 ? "0.7rem" : "0.75rem", 
                padding: windowWidth < 640 ? "0px" : "1px" 
              },
              minWidth: windowWidth < 640 ? 60 : windowWidth < 1024 ? 70 : 80,
              maxWidth: windowWidth < 640 ? 100 : windowWidth < 1024 ? 120 : 150,
            }}
            rowSelection="single"
            onRowSelected={onRowSelected}
            suppressCellFocus={true}
            enableCellTextSelection={true}
            ensureDomOrder={true}
            rowHeight={windowWidth < 640 ? 25 : windowWidth < 1024 ? 28 : 30}
            headerHeight={windowWidth < 640 ? 30 : windowWidth < 1024 ? 32 : 35}
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

        <div className="flex flex-col sm:flex-row justify-between items-center mt-3 sm:mt-4">
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

              {renderPageNumbers()}

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
          <span className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-0">
            Page {currentPage} of {totalPages} | Total Records: {totalRecords}
          </span>
        </div>

        <AddRowModal
          isOpen={modalState.add}
          onClose={() => setModalState({ ...modalState, add: false })}
          onSubmit={handleAdd}
          clients={clients}
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
    </div>
  );
};

export default ByMonth;
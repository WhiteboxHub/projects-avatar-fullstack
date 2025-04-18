// // new-projects-avatar-fullstack/project-avatar-ui/app/by-po/page.tsx

// "use client";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import ViewRowModal from "@/modals/bypo_modals/ViewRowByPO";
// import EditRowModal from "@/modals/bypo_modals/EditRowByPO";
// import AddRowModal from "@/modals/bypo_modals/AddRowByPO";
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

// interface PoGroup {
//   poid: number;
//   name: string;
//   pos: InvoiceData[];
//   isGroup: boolean;
//   isCollapsed: boolean;
//   invoice_count: number;
// }

// interface InvoiceData {
//   id: number;
//   invoicenumber: string;
//   startdate: string;
//   enddate: string;
//   invoicedate: string;
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

// const ByPo = () => {
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
//   const [poGroups, setPoGroups] = useState<PoGroup[]>([]);
//   const [expandedPoGroups, setExpandedPoGroups] = useState<{
//     [key: number]: boolean;
//   }>({});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isLoading, setIsLoading] = useState(true);
//   const [clients, setClients] = useState<any[]>([]); // Adjust the type as per your client data structure
//   const [selectedPoId, setSelectedPoId] = useState<number | null>(null);
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
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/invoices-po`,
//         {
//           params: {
//             page: currentPage,
//             page_size: pageSize,
//             search: debouncedSearchValue || undefined,
//           },
//         }
//       );
//       setPoGroups(response.data.data);
//       setTotalPages(response.data.pages);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       showAlert("Error loading data", "error");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [currentPage, debouncedSearchValue]);


// // // Update your fetchData function to include the selectedPoId in the API call
// // const fetchData = useCallback(async () => {
// //   try {
// //     setIsLoading(true);
// //     const response = await axios.get(
// //       `${process.env.NEXT_PUBLIC_API_URL}/invoices-po`,
// //       {
// //         params: {
// //           page: currentPage,
// //           page_size: pageSize,
// //           search: debouncedSearchValue || undefined,
// //           po_id: selectedPoId || undefined, // Include selectedPoId in the request
// //         },
// //       }
// //     );
// //     setPoGroups(response.data.data);
// //     setTotalPages(response.data.pages);
// //   } catch (error) {
// //     console.error("Error fetching data:", error);
// //     showAlert("Error loading data", "error");
// //   } finally {
// //     setIsLoading(false);
// //   }
// // }, [currentPage, debouncedSearchValue, selectedPoId]); // Add selectedPoId to dependencies


//   const fetchClients = useCallback(async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/invoices` // Adjust the endpoint as per your API
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

//   const toggleGroup = (poId: number) => {
//     setSelectedPoId(poId); // Store the selected PO ID
//     setExpandedPoGroups((prev) => ({
//       ...prev,
//       [poId]: !prev[poId],
//     }));
//   };

//   const rowData = useMemo(() => {
//     const rows: RowData[] = [];
//     poGroups.forEach((poGroup) => {
//       rows.push({
//         id: poGroup.poid,
//         name: poGroup.name,
//         invoicenumber: "",
//         startdate: "",
//         enddate: "",
//         invoicedate: "",
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
//         poid: poGroup.poid,
//         notes: "",
//         isGroupRow: true,
//         level: 0,
//         expanded: expandedPoGroups[poGroup.poid],
//       });

//       if (expandedPoGroups[poGroup.poid]) {
//         poGroup.pos.forEach((invoice) => {
//           rows.push({
//             ...invoice,
//             name: `${invoice.id} ${invoice.invoicenumber} - ${poGroup.name}`,
//             isGroupRow: false,
//             level: 1,
//           });
//         });
//         rows.push({
//           id: -1,
//           name: "",
//           invoicenumber: "",
//           startdate: "",
//           enddate: "",
//           invoicedate: "",
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
//           poid: -1,
//           notes: "",
//           isGroupRow: false,
//           level: 1,
//         });
//       }
//     });
//     return rows;
//   }, [poGroups, expandedPoGroups]);

//   const columnDefs = useMemo(
//     () => [
//       {
//         headerName: "Name",
//         field: "name" as keyof RowData,
//         cellRenderer: (params: any) => {
//           if (params.data.isGroupRow) {
//             const expanded = expandedPoGroups[params.data.poid];
//             return (
//               <div className="flex items-center">
//                 <span
//                   className="cursor-pointer pl-1 flex items-center hover:bg-gray-100 rounded-md py-1 px-2 transition-colors duration-200"
//                   onClick={() => toggleGroup(params.data.poid)}
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
//     [expandedPoGroups]
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

//     doc.save("invoices-by-po.pdf");
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
//         <span className="ml-4 text-sm text-gray-600">
//           Page {currentPage} of {totalPages} | Total Records:{" "}
//           {poGroups.reduce((acc, poGroup) => acc + poGroup.invoice_count, 0)}
//         </span>
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

//       {/* <EditRowModal
//         isOpen={modalState.edit}
//         onClose={() => setModalState({ ...modalState, edit: false })}
//         initialData={modalState.selectedRow as InvoiceData | null}
//         onSubmit={handleEdit}
//         clients={clients}
//         defaultClientId={
//           selectedPoId || modalState.selectedRow?.poid || 0
//         }
//       /> */}

// <EditRowModal
//   isOpen={modalState.edit}
//   onClose={() => setModalState({ ...modalState, edit: false })}
//   rowData={modalState.selectedRow as InvoiceData} // Pass the selected row data
//   onSave={fetchData} // Pass the function to refresh data after save
//   clients={clients}
//   defaultClientId={selectedPoId || modalState.selectedRow?.poid || 0}
// />
//     </div>
//   );
// };

// export default ByPo;






"use client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import ViewRowModal from "@/modals/bypo_modals/ViewRowByPO";
import EditRowModal from "@/modals/bypo_modals/EditRowByPO";
import AddRowModal from "@/modals/bypo_modals/AddRowByPO";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { jsPDF } from "jspdf";
import { AiOutlineEdit, AiOutlineEye, AiOutlineSearch } from "react-icons/ai";
import { MdAdd, MdDelete } from "react-icons/md";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaDownload,
} from "react-icons/fa";

jsPDF.prototype.autoTable = autoTable;

interface PoGroup {
  poid: number;
  name: string;
  pos: InvoiceData[];
  isGroup: boolean;
  isCollapsed: boolean;
  invoice_count: number;
}

interface InvoiceData {
  id: number;
  invoicenumber: string;
  startdate: string;
  enddate: string;
  invoicedate: string;
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

interface RowData extends InvoiceData {
  isGroupRow?: boolean;
  level?: number;
  expanded?: boolean;
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

const ByPo = () => {
  const gridRef = useRef<any>();
  const [modalState, setModalState] = useState<ModalState>({
    add: false,
    view: false,
    edit: false,
    selectedRow: null,
  });
  const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [poGroups, setPoGroups] = useState<PoGroup[]>([]);
  const [expandedPoGroups, setExpandedPoGroups] = useState<{
    [key: number]: boolean;
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<any[]>([]); // Adjust the type as per your client data structure
  const [selectedPoId, setSelectedPoId] = useState<number | null>(null);
  const pageSize = 10;

  const showAlert = (text: string, type: "success" | "error") => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 3000);
  };

  // Debounce search value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/invoices-po`,
        {
          params: {
            page: currentPage,
            page_size: pageSize,
            search: debouncedSearchValue || undefined,
          },
        }
      );
      setPoGroups(response.data.data);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error("Error fetching data:", error);
      showAlert("Error loading data", "error");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchValue]);

  const fetchClients = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/invoices` // Adjust the endpoint as per your API
      );
      setClients(response.data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchClients();
  }, [fetchData, fetchClients]);

  const toggleGroup = (poId: number) => {
    setSelectedPoId(poId); // Store the selected PO ID
    setExpandedPoGroups((prev) => ({
      ...prev,
      [poId]: !prev[poId],
    }));
  };

  const rowData = useMemo(() => {
    const rows: RowData[] = [];
    poGroups.forEach((poGroup) => {
      rows.push({
        id: poGroup.poid,
        name: poGroup.name,
        invoicenumber: "",
        startdate: "",
        enddate: "",
        invoicedate: "",
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
        poid: poGroup.poid,
        notes: "",
        isGroupRow: true,
        level: 0,
        expanded: expandedPoGroups[poGroup.poid],
      });

      if (expandedPoGroups[poGroup.poid]) {
        poGroup.pos.forEach((invoice) => {
          rows.push({
            ...invoice,
            name: `${invoice.id} ${invoice.invoicenumber} - ${poGroup.name}`,
            isGroupRow: false,
            level: 1,
          });
        });
        rows.push({
          id: -1,
          name: "",
          invoicenumber: "",
          startdate: "",
          enddate: "",
          invoicedate: "",
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
          poid: -1,
          notes: "",
          isGroupRow: false,
          level: 1,
        });
      }
    });
    return rows;
  }, [poGroups, expandedPoGroups]);

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Name",
        field: "name" as keyof RowData,
        cellRenderer: (params: any) => {
          if (params.data.isGroupRow) {
            const expanded = expandedPoGroups[params.data.poid];
            return (
              <div className="flex items-center">
                <span
                  className="cursor-pointer pl-1 flex items-center hover:bg-gray-100 rounded-md py-1 px-2 transition-colors duration-200"
                  onClick={() => toggleGroup(params.data.poid)}
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
          return <span className="pl-3">{params.value}</span>;
        },
        minWidth: 200,
        flex: 1,
      },
      {
        headerName: "Invoice Number",
        field: "invoicenumber" as keyof RowData,
        hide: false,
        minWidth: 150,
      },
      {
        headerName: "Start Date",
        field: "startdate" as keyof RowData,
        hide: false,
        minWidth: 120,
      },
      {
        headerName: "End Date",
        field: "enddate" as keyof RowData,
        hide: false,
        minWidth: 120,
      },
      {
        headerName: "Invoice Date",
        field: "invoicedate" as keyof RowData,
        hide: false,
        minWidth: 120,
      },
      {
        headerName: "Quantity",
        field: "quantity" as keyof RowData,
        hide: false,
        minWidth: 100,
      },
      {
        headerName: "OT Quantity",
        field: "otquantity" as keyof RowData,
        hide: false,
        minWidth: 100,
      },
      {
        headerName: "Rate",
        field: "rate" as keyof RowData,
        hide: false,
        minWidth: 100,
      },
      {
        headerName: "Overtime Rate",
        field: "overtimerate" as keyof RowData,
        hide: false,
        minWidth: 120,
      },
      {
        headerName: "Status",
        field: "status" as keyof RowData,
        hide: false,
        minWidth: 100,
        cellRenderer: (params: any) => {
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
    [expandedPoGroups]
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
      showAlert("Error adding invoice", "error");
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
          `${process.env.NEXT_PUBLIC_API_URL}/invoices/bypo/delete/${id}`
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
        row.name,
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
        row.releaseddate,
        row.checknumber,
        row.invoiceurl,
        row.checkurl,
        row.freqtype,
        row.invoicenet,
        row.vendorfax,
        row.vendorphone,
        row.vendoremail,
        row.timsheetemail,
        row.hrname,
        row.hremail,
        row.hrphone,
        row.managername,
        row.manageremail,
        row.managerphone,
        row.secondaryname,
        row.secondaryemail,
        row.secondaryphone,
        row.candidatename,
        row.candidatephone,
        row.candidateemail,
        row.wrkemail,
        row.wrkphone,
        row.recruitername,
        row.recruiterphone,
        row.recruiteremail,
        row.notes,
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

    doc.save("invoices-by-po.pdf");
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

          {/* Show limited page numbers */}
          {totalPages > 0 && (
            <>
              {currentPage > 2 && (
                <span className="px-2 text-gray-500">...</span>
              )}
              {currentPage > 1 && (
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                  {currentPage - 1}
                </button>
              )}
              <button
                className="px-3 py-1 rounded bg-blue-600 text-white"
              >
                {currentPage}
              </button>
              {currentPage < totalPages && (
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                  {currentPage + 1}
                </button>
              )}
              {currentPage < totalPages - 1 && (
                <span className="px-2 text-gray-500">...</span>
              )}
            </>
          )}

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
          {poGroups.reduce((acc, poGroup) => acc + poGroup.invoice_count, 0)}
        </span>
      </div>
      <AddRowModal
        isOpen={modalState.add}
        onClose={() => setModalState({ ...modalState, add: false })}
        refreshData={fetchData}
      />

      <ViewRowModal
        isOpen={modalState.view}
        onClose={() => setModalState({ ...modalState, view: false })}
        invoice={modalState.selectedRow}
      />

      <EditRowModal
        isOpen={modalState.edit}
        onClose={() => setModalState({ ...modalState, edit: false })}
        rowData={modalState.selectedRow as InvoiceData} // Pass the selected row data
        onSave={fetchData} // Pass the function to refresh data after save
        clients={clients}
        defaultClientId={
          selectedPoId || modalState.selectedRow?.poid || 0
        }
      />
    </div>
  );
};

export default ByPo;

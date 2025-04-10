// // "use client";
// // import React, { useState, useRef, useEffect } from "react";
// // import { jsPDF } from "jspdf";
// // import autoTable from "jspdf-autotable";
// // import { AgGridReact } from "ag-grid-react";
// // import "ag-grid-community/styles/ag-grid.css";
// // import "ag-grid-community/styles/ag-theme-alpine.css";
// // import { FaDownload } from "react-icons/fa";
// // import AddRowModal from "@/modals/recruiter_byPlacement_modals/AddRowRecruiter";
// // import EditRowModal from "@/modals/recruiter_byClient_modals/EditRowRecruiter";
// // import ViewRowModal from "@/modals/recruiter_byPlacement_modals/ViewRowRecruiter";
// // import {
// //   FaChevronLeft,
// //   FaChevronRight,
// //   FaAngleDoubleLeft,
// //   FaAngleDoubleRight,
// // } from "react-icons/fa";
// // import {
// //   AiOutlineEdit,
// //   AiOutlineEye,
// //   AiOutlineSearch,
// // } from "react-icons/ai";
// // import { MdAdd, MdDelete } from "react-icons/md";
// // import { Recruiter } from "@/types/byPlacement";
// // import axios from "axios";

// // jsPDF.prototype.autoTable = autoTable;

// // const RecruiterByPlacement = () => {
// //   const [modalState, setModalState] = useState<{
// //     add: boolean;
// //     edit: boolean;
// //     view: boolean;
// //   }>({ add: false, edit: false, view: false });

// //   const [alertMessage, setAlertMessage] = useState<string | null>(null);
// //   const [searchValue, setSearchValue] = useState<string>("");
// //   const [rowData, setRowData] = useState<Recruiter[]>([]);
// //   const [selectedRow, setSelectedRow] = useState<Recruiter | null>(null);
// //   const [currentPage, setCurrentPage] = useState<number>(1);
// //   const [totalPages, setTotalPages] = useState<number>(0);
// //   const [pageSize] = useState<number>(100);
// //   const gridRef = useRef<AgGridReact>(null);

// //   const API_URL = process.env.NEXT_PUBLIC_API_URL;

// //   useEffect(() => {
// //     fetchRecruiters(currentPage);
// //   }, [currentPage]);

// //   const fetchRecruiters = async (page: number) => {
// //     try {
// //       const response = await axios.get(`${API_URL}/by/recruiters/by-placement`, {
// //         params: { page, pageSize },
// //         headers: { AuthToken: localStorage.getItem("token") },
// //       });
// //       setRowData(response.data.data);
// //       setTotalPages(response.data.pages);
// //       console.log(response.data.pages);
// //     } catch (error) {
// //       console.error("Error fetching recruiters:", error);
// //     }
// //   };

// //   const handleAddRow = () =>
// //     setModalState((prevState) => ({ ...prevState, add: true }));

// //   const handleEditRow = () => {
// //     if (gridRef.current) {
// //       const selectedRows = gridRef.current.api.getSelectedRows();
// //       if (selectedRows.length > 0) {
// //         setSelectedRow(selectedRows[0]);
// //         setModalState((prevState) => ({ ...prevState, edit: true }));
// //       } else {
// //         setAlertMessage("Please select a row to edit.");
// //         setTimeout(() => setAlertMessage(null), 3000);
// //       }
// //     }
// //   };

// //   const handleDeleteRow = async () => {
// //     if (gridRef.current) {
// //       const selectedRows = gridRef.current.api.getSelectedRows();
// //       if (selectedRows.length > 0) {
// //         const recruiterId = selectedRows[0].id; // Assuming 'id' is the identifier
// //         try {
// //           await axios.delete(`${API_URL}/by/recruiters/byPlacement/remove/${recruiterId}`, {
// //             headers: { AuthToken: localStorage.getItem("token") },
// //           });
// //           setAlertMessage("Recruiter deleted successfully.");
// //           fetchRecruiters(currentPage); // Refresh the list after deletion
// //         } catch (error) {
// //           setAlertMessage("Error deleting recruiter.");
// //           console.error("Error deleting recruiter:", error);
// //         }
// //       } else {
// //         setAlertMessage("Please select a row to delete.");
// //         setTimeout(() => setAlertMessage(null), 3000);
// //       }
// //     }
// //   };

// //   const handleViewRow = () => {
// //     if (gridRef.current) {
// //       const selectedRows = gridRef.current.api.getSelectedRows();
// //       if (selectedRows.length > 0) {
// //         setSelectedRow(selectedRows[0]);
// //         setModalState((prevState) => ({ ...prevState, view: true }));
// //       } else {
// //         setAlertMessage("Please select a row to view.");
// //         setTimeout(() => setAlertMessage(null), 3000);
// //       }
// //     }
// //   };

// //   const handleDownloadPDF = () => {
// //     const doc = new jsPDF();
// //     doc.text("Recruiter Data", 20, 10);
// //     autoTable(doc, {
// //       head: [["ID", "Name", "Email", "Phone", "Company", "Status", "Designation", "DOB", "Personal Email", "Employee ID", "Skype ID", "LinkedIn", "Twitter", "Facebook", "Review", "Client ID", "Notes", "Last Modified DateTime"]],
// //       body: rowData.map((row) => [
// //         row.id,
// //         row.name || "",
// //         row.email || "",
// //         row.phone || "",
// //         // row.comp || "",
// //         row.status || "",
// //         row.designation || "",
// //         row.dob || "",
// //         row.personalemail || "",
// //         row.employeeid || "",
// //         row.skypeid || "",
// //         row.linkedin || "",
// //         row.twitter || "",
// //         row.facebook || "",
// //         row.review || "",
// //         row.clientid || "",
// //         row.notes || "",
// //         row.lastmoddatetime || "",
// //       ]),
// //     });
// //     doc.save("recruiter_data.pdf");
// //   };

// //   const handlePageChange = (newPage: number) => {
// //     if (newPage > 0 && newPage <= totalPages) {
// //       setCurrentPage(newPage);
// //     }
// //   };

// //   const renderPageNumbers = () => {
// //     const pageNumbers = [];
// //     for (let i = 1; i <= totalPages; i++) {
// //       if (i === 1 || (i >= currentPage - 1 && i <= currentPage + 1)) {
// //         pageNumbers.push(
// //           <button
// //             key={i}
// //             onClick={() => handlePageChange(i)}
// //             className={`text-sm px-2 py-1 rounded-md ${
// //               currentPage === i
// //                 ? "bg-blue-600 text-white"
// //                 : "bg-gray-200 text-gray-800"
// //             } hidden sm:block`}
// //           >
// //             {i}
// //           </button>
// //         );
// //       }
// //     }
// //     return pageNumbers;
// //   };

// //   return (
// //     <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md relative">
// //       {alertMessage && (
// //         <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded-md shadow-md z-50">
// //           {alertMessage}
// //         </div>
// //       )}
// //       <div className="flex justify-between items-center mb-4">
// //         <h1 className="text-3xl font-bold text-gray-800">Recruiter Management</h1>
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
// //           placeholder="Search..."
// //           value={searchValue}
// //           onChange={(e) => setSearchValue(e.target.value)}
// //           className="border border-gray-300 rounded-md p-2 w-64"
// //         />
// //         <button
// //           onClick={() => {}}
// //           className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md ml-2 transition duration-300 hover:bg-blue-900"
// //         >
// //           <AiOutlineSearch className="mr-2" /> Search
// //         </button>
// //       </div>
// //       <div
// //         className="ag-theme-alpine"
// //         style={{ height: "400px", width: "100%", overflowY: "auto" }}
// //       >
// //         <AgGridReact
// //           ref={gridRef}
// //           rowData={rowData}
// //           columnDefs={[
// //             { headerName: "ID", field: "id" },
// //             { headerName: "Name", field: "name" },
// //             { headerName: "Email", field: "email" },
// //             { headerName: "Phone", field: "phone" },
// //             { headerName: "Company", field: "comp" },
// //             { headerName: "Status", field: "status" },
// //             { headerName: "Designation", field: "designation" },
// //             { headerName: "DOB", field: "dob" },
// //             { headerName: "Personal Email", field: "personalemail" },
// //             { headerName: "Employee ID", field: "employeeid" },
// //             { headerName: "Skype ID", field: "skypeid" },
// //             { headerName: "LinkedIn", field: "linkedin" },
// //             { headerName: "Twitter", field: "twitter" },
// //             { headerName: "Facebook", field: "facebook" },
// //             { headerName: "Review", field: "review" },
// //             { headerName: "Client ID", field: "clientid" },
// //             { headerName: "Notes", field: "notes" },
// //             { headerName: "Last Modified DateTime", field: "lastmoddatetime" },
// //           ]}
// //           pagination={false}
// //           domLayout="normal"
// //           rowSelection="multiple"
// //           defaultColDef={{
// //             sortable: true,
// //             filter: true,
// //             cellStyle: { color: "#333", fontSize: "0.75rem", padding: "1px" },
// //             minWidth: 60,
// //             maxWidth: 200,
// //           }}
// //           rowHeight={30}
// //           headerHeight={35}
// //         />
// //       </div>
// //       <div className="flex justify-between mt-4">
// //         <div className="flex items-center flex-wrap gap-2 overflow-auto">
// //           <button
// //             onClick={() => handlePageChange(1)}
// //             disabled={currentPage === 1}
// //             className="text-sm px-2 py-1 rounded-md"
// //           >
// //             <FaAngleDoubleLeft />
// //           </button>
// //           <button
// //             onClick={() => handlePageChange(currentPage - 1)}
// //             disabled={currentPage === 1}
// //             className="text-sm px-2 py-1 rounded-md"
// //           >
// //             <FaChevronLeft />
// //           </button>
// //           {renderPageNumbers()}
// //           <button
// //             onClick={() => handlePageChange(currentPage + 1)}
// //             disabled={currentPage === totalPages}
// //             className="text-sm px-2 py-1 rounded-md"
// //           >
// //             <FaChevronRight />
// //           </button>
// //           <button
// //             onClick={() => handlePageChange(totalPages)}
// //             disabled={currentPage === totalPages}
// //             className="text-sm px-2 py-1 rounded-md"
// //           >
// //             <FaAngleDoubleRight />
// //           </button>
// //         </div>
// //       </div>
// //       {modalState.add && (
// //         <AddRowModal
// //           isOpen={modalState.add}
// //           onClose={() => setModalState((prev) => ({ ...prev, add: false }))}
// //           onSubmit={() => {
// //             // Handle add logic
// //           }}
// //         />
// //       )}
// //       {modalState.edit && selectedRow && (
// //         <EditRowModal
// //           isOpen={modalState.edit}
// //           onClose={() => setModalState((prev) => ({ ...prev, edit: false }))}
// //           initialData={selectedRow}
// //           onSubmit={() => {
// //           }}
// //         />
// //       )}
// //       {modalState.view && selectedRow && (
// //         <ViewRowModal
// //           isOpen={modalState.view}
// //           onClose={() => setModalState((prev) => ({ ...prev, view: false }))}
// //           recruiter={selectedRow}
// //         />
// //       )}
// //     </div>
// //   );
// // };

// // export default RecruiterByPlacement;

// "use client";

// import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
// import axios from 'axios';
// import { jsPDF } from "jspdf";
// import autoTable from 'jspdf-autotable';
// import AddRowModal from "@/modals/recruiter_byPlacement_modals/AddRowRecruiter";
// import ViewRowModal from "@/modals/recruiter_byPlacement_modals/ViewRowRecruiter";
// import {
//     FaChevronLeft,
//     FaChevronRight,
//     FaAngleDoubleLeft,
//     FaAngleDoubleRight,
//     FaDownload
// } from "react-icons/fa";
// import {
//     AiOutlineEdit,
//     AiOutlineEye,
//     AiOutlineSearch,
// } from "react-icons/ai";
// import { MdAdd, MdDelete } from "react-icons/md";

// interface Company {
//     clientid: number;
//     companyname: string;
//     recruiters: RecruiterData[];
//     isGroup: boolean;
//     isCollapsed: boolean;
//     recruiter_count: number;
// }

// interface RecruiterData {
//     id: number;
//     name: string;
//     email: string;
//     phone: string;
//     designation: string;
//     status: string;
//     dob: string | null;
//     personalemail: string;
//     skypeid: string;
//     linkedin: string;
//     twitter: string;
//     facebook: string;
//     review: string;
//     notes: string;
//     clientid: number;
//     companyname: string;
//     employeeid?: string;
//     lastmoddatetime?: string;
// }

// interface RowData extends RecruiterData {
//     isGroupRow?: boolean;
//     level?: number;
//     expanded?: boolean;
// }

// interface AlertMessage {
//     text: string;
//     type: 'success' | 'error';
// }

// const RecruiterByPlacement = () => {
//     const gridRef = useRef<any>();
//     const [modalState, setModalState] = useState<{
//         add: boolean;
//         edit: boolean;
//         view: boolean;
//     }>({ add: false, edit: false, view: false });
//     const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
//     const [searchValue, setSearchValue] = useState('');
//     const [companies, setCompanies] = useState<Company[]>([]);
//     const [expandedCompanies, setExpandedCompanies] = useState<{ [key: number]: boolean }>({});
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [isLoading, setIsLoading] = useState(true);
//     const [selectedRow, setSelectedRow] = useState<RecruiterData | null>(null);
//     const pageSize = 1000; // Match PHP's default of 1000 rows

//     const showAlert = (text: string, type: 'success' | 'error') => {
//         setAlertMessage({ text, type });
//         setTimeout(() => setAlertMessage(null), 3000);
//     };

//     const fetchData = useCallback(async () => {
//         try {
//             setIsLoading(true);
//             const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/by/recruiters/by-client-placement`, {
//                 params: {
//                     page: currentPage,
//                     pageSize: pageSize,
//                     search: searchValue || undefined
//                 }
//             });
//             setCompanies(response.data.data);
//             setTotalPages(response.data.pages);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//             showAlert('Error loading data', 'error');
//         } finally {
//             setIsLoading(false);
//         }
//     }, [currentPage, searchValue]);

//     useEffect(() => {
//         fetchData();
//     }, [fetchData]);

//     const toggleGroup = (clientId: number) => {
//         setExpandedCompanies(prev => ({
//             ...prev,
//             [clientId]: !prev[clientId]
//         }));
//     };

//     const rowData = useMemo(() => {
//         const rows: RowData[] = [];
//         companies.forEach(company => {
//             rows.push({
//                 id: company.clientid,
//                 name: company.companyname,
//                 email: '',
//                 phone: '',
//                 designation: '',
//                 status: '',
//                 dob: null,
//                 personalemail: '',
//                 skypeid: '',
//                 linkedin: '',
//                 twitter: '',
//                 facebook: '',
//                 review: '',
//                 notes: '',
//                 clientid: company.clientid,
//                 companyname: company.companyname,
//                 isGroupRow: true,
//                 level: 0,
//                 expanded: expandedCompanies[company.clientid]
//             });

//             if (expandedCompanies[company.clientid]) {
//                 company.recruiters.forEach(recruiter => {
//                     rows.push({
//                         ...recruiter,
//                         name: `${recruiter.id} ${recruiter.name} - ${company.companyname}`,
//                         isGroupRow: false,
//                         level: 1
//                     });
//                 });
//             }
//         });
//         return rows;
//     }, [companies, expandedCompanies]);

//     const columnDefs = useMemo(() => [
//         {
//             headerName: 'Company/Name',
//             field: 'name',
//             cellRenderer: (params: any) => {
//                 if (params.data.isGroupRow) {
//                     const expanded = expandedCompanies[params.data.clientid];
//                     const company = companies.find(c => c.clientid === params.data.clientid);
//                     return (
//                         <div className="flex items-center">
//                             <span 
//                                 className="cursor-pointer pl-1 flex items-center hover:bg-gray-100 rounded-md py-1 px-2 transition-colors duration-200"
//                                 onClick={() => toggleGroup(params.data.clientid)}
//                             >
//                                 <span className="mr-2 text-gray-600 flex items-center justify-center w-4 h-4 bg-white border border-gray-300 rounded">
//                                     {expanded ? '▼' : '▶'}
//                                 </span>
//                                 <span className="font-medium">{params.value}</span>
//                                 <span className="ml-2 text-gray-500 text-sm">
//                                     ({company?.recruiters?.length || 0} recruiters)
//                                 </span>
//                             </span>
//                         </div>
//                     );
//                 }
//                 return <span className="pl-8">{params.value}</span>;
//             },
//             minWidth: 200,
//             flex: 1
//         },
//         { 
//             headerName: 'Email', 
//             field: 'email',
//             hide: (params: any) => params.data.isGroupRow,
//             minWidth: 150
//         },
//         { 
//             headerName: 'Phone', 
//             field: 'phone',
//             hide: (params: any) => params.data.isGroupRow,
//             minWidth: 120
//         },
//         { 
//             headerName: 'Designation', 
//             field: 'designation',
//             hide: (params: any) => params.data.isGroupRow,
//             minWidth: 150
//         },
//         { 
//             headerName: 'Status', 
//             field: 'status',
//             hide: (params: any) => params.data.isGroupRow,
//             minWidth: 100,
//             cellRenderer: (params: any) => {
//                 const statusMap: { [key: string]: string } = {
//                     'A': 'Active',
//                     'I': 'Inactive',
//                     'D': 'Delete',
//                     'R': 'Rejected',
//                     'N': 'Not Interested',
//                     'E': 'Excellent'
//                 };
//                 return statusMap[params.value] || params.value;
//             }
//         },
//         { 
//             headerName: 'DOB', 
//             field: 'dob',
//             hide: (params: any) => params.data.isGroupRow,
//             minWidth: 100
//         },
//         { 
//             headerName: 'Personal Email', 
//             field: 'personalemail',
//             hide: (params: any) => params.data.isGroupRow,
//             minWidth: 150
//         },
//         { 
//             headerName: 'Skype ID', 
//             field: 'skypeid',
//             hide: (params: any) => params.data.isGroupRow,
//             minWidth: 120
//         },
//         { 
//             headerName: 'LinkedIn', 
//             field: 'linkedin',
//             hide: (params: any) => params.data.isGroupRow,
//             minWidth: 120
//         },
//         { 
//             headerName: 'Twitter', 
//             field: 'twitter',
//             hide: (params: any) => params.data.isGroupRow,
//             minWidth: 120
//         },
//         { 
//             headerName: 'Facebook', 
//             field: 'facebook',
//             hide: (params: any) => params.data.isGroupRow,
//             minWidth: 120
//         },
//         { 
//             headerName: 'Review', 
//             field: 'review',
//             hide: (params: any) => params.data.isGroupRow,
//             minWidth: 100
//         },
//         { 
//             headerName: 'Notes', 
//             field: 'notes',
//             hide: (params: any) => params.data.isGroupRow,
//             minWidth: 200
//         }
//     ], [companies, expandedCompanies]);

//     const handlePageChange = (newPage: number) => {
//         if (newPage > 0 && newPage <= totalPages) {
//             setCurrentPage(newPage);
//         }
//     };

//     const handleAdd = async (formData: RecruiterData) => {
//         try {
//             await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/by/recruiters/by-client-placement/add`, formData);
//             showAlert('Recruiter added successfully', 'success');
//             setModalState(prev => ({ ...prev, add: false }));
//             fetchData();
//         } catch (error) {
//             showAlert('Error adding recruiter', 'error');
//         }
//     };

//     const handleEdit = async (formData: RecruiterData) => {
//         try {
//             await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/by/recruiters/by-client-placement/update/${formData.id}`, formData);
//             showAlert('Recruiter updated successfully', 'success');
//             setModalState(prev => ({ ...prev, edit: false }));
//             fetchData();
//         } catch (error) {
//             showAlert('Error updating recruiter', 'error');
//         }
//     };

//     const handleDelete = async (id: number) => {
//         if (window.confirm('Are you sure you want to delete this recruiter?')) {
//             try {
//                 await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/by/recruiters/by-client-placement/remove/${id}`);
//                 showAlert('Recruiter deleted successfully', 'success');
//                 fetchData();
//             } catch (error) {
//                 showAlert('Error deleting recruiter', 'error');
//             }
//         }
//     };

//     const handleDownloadPDF = () => {
//         const doc = new jsPDF();
//         const tableData = rowData
//             .filter(row => !row.isGroupRow)
//             .map(row => [
//                 row.companyname,
//                 row.name,
//                 row.email,
//                 row.phone,
//                 row.designation,
//                 row.status,
//                 row.dob || '',
//                 row.personalemail || '',
//                 row.skypeid || '',
//                 row.linkedin || '',
//                 row.twitter || '',
//                 row.facebook || '',
//                 row.review || '',
//                 row.notes || ''
//             ]);

//         autoTable(doc, {
//             head: [['Company', 'Name', 'Email', 'Phone', 'Designation', 'Status', 'DOB', 
//                    'Personal Email', 'Skype ID', 'LinkedIn', 'Twitter', 'Facebook', 'Review', 'Notes']],
//             body: tableData,
//             styles: { fontSize: 8 },
//             margin: { top: 20 }
//         });

//         doc.save('recruiters-by-placement.pdf');
//     };

//     return (
//         <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md relative">
//             {alertMessage && (
//                 <div className={`fixed top-4 right-4 p-4 ${
//                     alertMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'
//                 } text-white rounded-md shadow-md z-50`}>
//                     {alertMessage.text}
//                 </div>
//             )}

//             <div className="flex justify-between items-center mb-4">
//                 <h1 className="text-3xl font-bold text-gray-800">Placement Recruiters</h1>
//                 <div className="flex space-x-2">
//                     <button
//                         onClick={() => setModalState(prev => ({ ...prev, add: true }))}
//                         className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//                     >
//                         <MdAdd className="mr-2" /> Add
//                     </button>
//                     <button
//                         onClick={() => {
//                             const selectedRows = gridRef.current?.api.getSelectedRows();
//                             if (selectedRows?.length > 0 && !selectedRows[0].isGroupRow) {
//                                 setSelectedRow(selectedRows[0]);
//                                 setModalState(prev => ({ ...prev, edit: true }));
//                             } else {
//                                 showAlert("Please select a recruiter to edit", "error");
//                             }
//                         }}
//                         className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                     >
//                         <AiOutlineEdit className="mr-2" /> Edit
//                     </button>
//                     <button
//                         onClick={() => {
//                             const selectedRows = gridRef.current?.api.getSelectedRows();
//                             if (selectedRows?.length > 0 && !selectedRows[0].isGroupRow) {
//                                 handleDelete(selectedRows[0].id);
//                             } else {
//                                 showAlert("Please select a recruiter to delete", "error");
//                             }
//                         }}
//                         className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
//                     >
//                         <MdDelete className="mr-2" /> Delete
//                     </button>
//                     <button
//                         onClick={() => {
//                             const selectedRows = gridRef.current?.api.getSelectedRows();
//                             if (selectedRows?.length > 0 && !selectedRows[0].isGroupRow) {
//                                 setSelectedRow(selectedRows[0]);
//                                 setModalState(prev => ({ ...prev, view: true }));
//                             } else {
//                                 showAlert("Please select a recruiter to view", "error");
//                             }
//                         }}
//                         className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
//                     >
//                         <AiOutlineEye className="mr-2" /> View
//                     </button>
//                     <button
//                         onClick={handleDownloadPDF}
//                         className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
//                     >
//                         <FaDownload className="mr-2" /> Export PDF
//                     </button>
//                 </div>
//             </div>

//             <div className="flex mb-4">
//                 <input
//                     type="text"
//                     placeholder="Search..."
//                     value={searchValue}
//                     onChange={(e) => setSearchValue(e.target.value)}
//                     className="border border-gray-300 rounded-md p-2 w-64"
//                 />
//                 <button
//                     onClick={fetchData}
//                     className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md ml-2 hover:bg-blue-700"
//                 >
//                     <AiOutlineSearch className="mr-2" /> Search
//                 </button>
//             </div>

//             <div className="ag-theme-alpine" style={{ height: '600px', width: '100%' }}>
//                 <AgGridReact
//                     ref={gridRef}
//                     rowData={rowData}
//                     columnDefs={columnDefs}
//                     defaultColDef={{
//                         sortable: true,
//                         filter: true,
//                         resizable: true,
//                     }}
//                     suppressRowClickSelection={true}
//                     rowSelection="multiple"
//                     pagination={true}
//                     paginationPageSize={pageSize}
//                     onGridReady={(params) => {
//                         params.api.sizeColumnsToFit();
//                     }}
//                 />
//             </div>

//             <AddRowModal
//                 isOpen={modalState.add}
//                 onClose={() => setModalState(prev => ({ ...prev, add: false }))}
//                 onSubmit={handleAdd}
//                 clientOptions={companies.map(c => ({ id: c.clientid, name: c.companyname }))}
//             />

//             {/* <EditRowModal
//                 isOpen={modalState.edit}
//                 onClose={() => setModalState(prev => ({ ...prev, edit: false }))}
//                 onSubmit={handleEdit}
//                 initialData={selectedRow}
//                 clientOptions={companies.map(c => ({ id: c.clientid, name: c.companyname }))}
//             /> */}

//             <ViewRowModal
//                 isOpen={modalState.view}
//                 onClose={() => setModalState(prev => ({ ...prev, view: false }))}
//                 recruiter={selectedRow}
//             />
//         </div>
//     );
// };

// export default RecruiterByPlacement;


"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import AddRowModal from "@/modals/recruiter_byClient_modals/AddRowRecruiter";
import ViewRowModal from "@/modals/recruiter_byClient_modals/ViewRowRecruiter";
import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaDownload,
} from "react-icons/fa";
import { AiOutlineEdit, AiOutlineEye, AiOutlineSearch } from "react-icons/ai";
import { MdAdd, MdDelete } from "react-icons/md";

interface Company {
  clientid: number;
  companyname: string;
  recruiters: RecruiterData[];
  isGroup: boolean;
  isCollapsed: boolean;
  recruiter_count: number;
}

interface RecruiterData {
  id: number;
  name: string;
  email: string;
  phone: string;
  designation: string;
  status: string;
  dob: string | null;
  personalemail: string;
  skypeid: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  review: string;
  notes: string;
  clientid: number;
  companyname: string;
  employeeid?: string;
  lastmoddatetime?: string;
}

interface RowData extends RecruiterData {
  isGroupRow?: boolean;
  level?: number;
  expanded?: boolean;
}

interface AlertMessage {
  text: string;
  type: "success" | "error";
}

const RecruiterByClient = () => {
  const gridRef = useRef<any>();
  const [modalState, setModalState] = useState<{
    add: boolean;
    edit: boolean;
    view: boolean;
  }>({ add: false, edit: false, view: false });
  const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [expandedCompanies, setExpandedCompanies] = useState<{
    [key: number]: boolean;
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState<RecruiterData | null>(null);
  const pageSize = 1000; // Match PHP's default of 1000 rows

  const showAlert = (text: string, type: "success" | "error") => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/by/recruiters/by-client-placement`,
        {
          params: {
            page: currentPage,
            pageSize: pageSize,
            search: searchValue || undefined,
          },
        }
      );
      setCompanies(response.data.data);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error("Error fetching data:", error);
      showAlert("Error loading data", "error");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchValue]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleGroup = (clientId: number) => {
    setExpandedCompanies((prev) => ({
      ...prev,
      [clientId]: !prev[clientId],
    }));
  };

  const rowData = useMemo(() => {
    const rows: RowData[] = [];
    companies.forEach((company) => {
      rows.push({
        id: company.clientid,
        name: company.companyname,
        email: "",
        phone: "",
        designation: "",
        status: "",
        dob: null,
        personalemail: "",
        skypeid: "",
        linkedin: "",
        twitter: "",
        facebook: "",
        review: "",
        notes: "",
        clientid: company.clientid,
        companyname: company.companyname,
        isGroupRow: true,
        level: 0,
        expanded: expandedCompanies[company.clientid],
      });

      if (expandedCompanies[company.clientid]) {
        company.recruiters.forEach((recruiter) => {
          rows.push({
            ...recruiter,
            name: `${recruiter.id} ${recruiter.name} - ${company.companyname}`,
            isGroupRow: false,
            level: 1,
          });
        });
      }
    });
    return rows;
  }, [companies, expandedCompanies]);

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Company/Name",
        field: "name",
        cellRenderer: (params: any) => {
          if (params.data.isGroupRow) {
            const expanded = expandedCompanies[params.data.clientid];
            const company = companies.find(c => c.clientid === params.data.clientid);
            return (
              <div className="flex items-center">
                <span
                  className="cursor-pointer pl-1 flex items-center hover:bg-gray-100 rounded-md py-1 px-2 transition-colors duration-200"
                  onClick={() => toggleGroup(params.data.clientid)}
                >
                  <span className="mr-2 text-gray-600 flex items-center justify-center w-4 h-4 bg-white border border-gray-300 rounded">
                    {expanded ? "➖" : "➕"}
                  </span>
                  <span className="font-medium">{params.value}</span>
                  <span className="ml-2 text-gray-500 text-sm">
                    ({company?.recruiters?.length || 0} recruiters)
                  </span>
                </span>
              </div>
            );
          }
          return <span className="pl-8">{params.value}</span>;
        },
        minWidth: 200,
        flex: 1,
      },
      {
        headerName: "Email",
        field: "email",
        hide: (params: any) => params.data.isGroupRow,
        minWidth: 150,
      },
      {
        headerName: "Phone",
        field: "phone",
        hide: (params: any) => params.data.isGroupRow,
        minWidth: 120,
      },
      {
        headerName: "Designation",
        field: "designation",
        hide: (params: any) => params.data.isGroupRow,
        minWidth: 150,
      },
      {
        headerName: "Status",
        field: "status",
        hide: (params: any) => params.data.isGroupRow,
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
        headerName: "DOB",
        field: "dob",
        hide: (params: any) => params.data.isGroupRow,
        minWidth: 100,
      },
      {
        headerName: "Personal Email",
        field: "personalemail",
        hide: (params: any) => params.data.isGroupRow,
        minWidth: 150,
      },
      {
        headerName: "Skype ID",
        field: "skypeid",
        hide: (params: any) => params.data.isGroupRow,
        minWidth: 120,
      },
      {
        headerName: "LinkedIn",
        field: "linkedin",
        hide: (params: any) => params.data.isGroupRow,
        minWidth: 120,
      },
      {
        headerName: "Twitter",
        field: "twitter",
        hide: (params: any) => params.data.isGroupRow,
        minWidth: 120,
      },
      {
        headerName: "Facebook",
        field: "facebook",
        hide: (params: any) => params.data.isGroupRow,
        minWidth: 120,
      },
      {
        headerName: "Review",
        field: "review",
        hide: (params: any) => params.data.isGroupRow,
        minWidth: 100,
      },
      {
        headerName: "Notes",
        field: "notes",
        hide: (params: any) => params.data.isGroupRow,
        minWidth: 200,
      },
    ],
    [companies, expandedCompanies]
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleAdd = async (formData: RecruiterData) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/by/recruiters/by-client-placement/add`,
        formData
      );
      showAlert("Recruiter added successfully", "success");
      setModalState((prev) => ({ ...prev, add: false }));
      fetchData();
    } catch (error) {
      showAlert("Error adding recruiter", "error");
    }
  };

  const handleEdit = async (formData: RecruiterData) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/by/recruiters/by-client-placement/update/${formData.id}`,
        formData
      );
      showAlert("Recruiter updated successfully", "success");
      setModalState((prev) => ({ ...prev, edit: false }));
      fetchData();
    } catch (error) {
      showAlert("Error updating recruiter", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this recruiter?")) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/by/recruiters/by-client-placement/remove/${id}`
        );
        showAlert("Recruiter deleted successfully", "success");
        fetchData();
      } catch (error) {
        showAlert("Error deleting recruiter", "error");
      }
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const tableData = rowData
      .filter((row) => !row.isGroupRow)
      .map((row) => [
        row.companyname,
        row.name,
        row.email,
        row.phone,
        row.designation,
        row.status,
        row.dob || "",
        row.personalemail || "",
        row.skypeid || "",
        row.linkedin || "",
        row.twitter || "",
        row.facebook || "",
        row.review || "",
        row.notes || "",
      ]);

    autoTable(doc, {
      head: [
        [
          "Company",
          "Name",
          "Email",
          "Phone",
          "Designation",
          "Status",
          "DOB",
          "Personal Email",
          "Skype ID",
          "LinkedIn",
          "Twitter",
          "Facebook",
          "Review",
          "Notes",
        ],
      ],
      body: tableData,
      styles: { fontSize: 8 },
      margin: { top: 20 },
    });

    doc.save("recruiters-by-placement.pdf");
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
        <h1 className="text-3xl font-bold text-gray-800">Placement Recruiters</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setModalState((prev) => ({ ...prev, add: true }))}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <MdAdd className="mr-2" /> Add
          </button>
          <button
            onClick={() => {
              const selectedRows = gridRef.current?.api.getSelectedRows();
              if (selectedRows?.length > 0 && !selectedRows[0].isGroupRow) {
                setSelectedRow(selectedRows[0]);
                setModalState((prev) => ({ ...prev, edit: true }));
              } else {
                showAlert("Please select a recruiter to edit", "error");
              }
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <AiOutlineEdit className="mr-2" /> Edit
          </button>
          <button
            onClick={() => {
              const selectedRows = gridRef.current?.api.getSelectedRows();
              if (selectedRows?.length > 0 && !selectedRows[0].isGroupRow) {
                handleDelete(selectedRows[0].id);
              } else {
                showAlert("Please select a recruiter to delete", "error");
              }
            }}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <MdDelete className="mr-2" /> Delete
          </button>
          <button
            onClick={() => {
              const selectedRows = gridRef.current?.api.getSelectedRows();
              if (selectedRows?.length > 0 && !selectedRows[0].isGroupRow) {
                setSelectedRow(selectedRows[0]);
                setModalState((prev) => ({ ...prev, view: true }));
              } else {
                showAlert("Please select a recruiter to view", "error");
              }
            }}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            <AiOutlineEye className="mr-2" /> View
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            <FaDownload className="mr-2" /> Export PDF
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
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md ml-2 hover:bg-blue-700"
        >
          <AiOutlineSearch className="mr-2" /> Search
        </button>
      </div>

      <div className="ag-theme-alpine" style={{ height: "600px", width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
          }}
          suppressRowClickSelection={true}
          rowSelection="multiple"
          pagination={true}
          paginationPageSize={pageSize}
          onGridReady={(params) => {
            params.api.sizeColumnsToFit();
          }}
        />
      </div>

      <AddRowModal
        isOpen={modalState.add}
        onClose={() => setModalState((prev) => ({ ...prev, add: false }))}
        onSubmit={handleAdd}
        clientOptions={companies.map((c) => ({
          id: c.clientid,
          name: c.companyname,
        }))}
      />

      <ViewRowModal
        isOpen={modalState.view}
        onClose={() => setModalState((prev) => ({ ...prev, view: false }))}
        recruiter={selectedRow}
      />
    </div>
  );
};

export default RecruiterByClient;

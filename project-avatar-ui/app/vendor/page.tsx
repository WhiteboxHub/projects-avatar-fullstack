// "use client";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import AddRowModal from "@/modals/vendor_modals/AddRowVendor";
// import EditRowModal from "@/modals/vendor_modals/EditRowVendor";
// import React, { useEffect, useRef, useState } from "react";
// import ViewRowModal from "@/modals/vendor_modals/ViewRowVendor";
// import autoTable from "jspdf-autotable";
// import axios from "axios";
// import { AgGridReact } from "ag-grid-react";
// import { AxiosError } from "axios";
// import { jsPDF } from "jspdf";
// import { MdAdd, MdDelete } from "react-icons/md";
// import { ErrorResponse } from "@/types";
// import { Vendor } from "@/types/vendor";

// import {
//   FaDownload,
//   FaChevronLeft,
//   FaChevronRight,
//   FaAngleDoubleLeft,
//   FaAngleDoubleRight,
// } from "react-icons/fa";
// import {
//   AiOutlineEdit,
//   AiOutlineEye,
//   AiOutlineSearch,
//   AiOutlineReload,
// } from "react-icons/ai";

// jsPDF.prototype.autoTable = autoTable;

// const Vendors = () => {
//   const [rowData, setRowData] = useState<Vendor[]>([]);
//   const [alertMessage, setAlertMessage] = useState<string | null>(null);
//   const [columnDefs, setColumnDefs] = useState<
//     { headerName: string; field: string; editable?: boolean; width?: number; editoptions?: string | number; formatter?: string; label?: string; }[]
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
//   const [selectedRow, setSelectedRow] = useState<Vendor | null>(null);
//   const [searchValue, setSearchValue] = useState<string>("");
//   const gridRef = useRef<AgGridReact>(null);

//   const API_URL = process.env.NEXT_PUBLIC_API_URL;

//   const fetchData = async (page: number = currentPage) => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${API_URL}/vendor/get`, {
//         params: {
//           page: page,
//           pageSize: paginationPageSize,
//         },
//         headers: { AuthToken: localStorage.getItem("token") },
//       });

//       const { data, total } = response.data;

//       setRowData(data);
//       setTotalRows(total);
//       setupColumns(data);
//     } catch (error) {
//       console.error("Error loading data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchVendors = async (searchQuery = "") => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${API_URL}/vendor/search`, {
//         params: {
//           page: currentPage,
//           pageSize: paginationPageSize,
//           search: searchQuery,
//         },
//         headers: { AuthToken: localStorage.getItem("token") },
//       });

//       const { data, total } = response.data;
//       setRowData(data);
//       setTotalRows(total);
//       setupColumns(data);
//     } catch (error) {
//       console.error("Error loading data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const delaySearch = setTimeout(() => {
//       if (searchValue) {
//         fetchVendors(searchValue);
//       }
//     }, 500);
//     return () => clearTimeout(delaySearch);
//   }, [searchValue]);

//   const handleSearch = () => {
//     fetchVendors(searchValue);
//   };

//   const setupColumns = (data: Vendor[]) => {
//     if (data.length > 0) {
//       const columns = [
//         { headerName: "ID", field: "id", width: 40, editable: false },
//         { headerName: "Company Name", field: "companyname", width: 250, editable: true, editoptions: { size: 75, maxlength: 250, style: "text-transform: uppercase" }, label: "Company Name" },
//         { headerName: "Status", field: "status", width: 90, editable: true, label: "Status", edittype: "select" },
//         { headerName: "Tier", field: "tier", width: 50, editable: true, label: "Tier", edittype: "select" },
//         { headerName: "Culture", field: "culture", width: 50, editable: true, label: "Culture", edittype: "select" },
//         { headerName: "Solicited", field: "solicited", width: 50, editable: true, label: "Solicited", edittype: "select" },
//         { headerName: "Min Rate", field: "minrate", width: 50, editable: true, formatter: "currency", editoptions: { defaultValue: 62.0 }, formatoptions: { decimalPlaces: 2, thousandsSeparator: ",", prefix: "$" }, sorttype: "currency", label: "Rate" },
//         { headerName: "Hire Before Term", field: "hirebeforeterm", width: 50, editable: true, label: "HBT", edittype: "select" },
//         { headerName: "Hire After Term", field: "hireafterterm", width: 50, editable: true, label: "HAT", edittype: "select" },
//         { headerName: "Late Payments", field: "latepayments", width: 50, editable: true, label: "Late Pay", edittype: "select" },
//         { headerName: "Total Net Term", field: "totalnetterm", width: 70, editable: true, editoptions: { defaultValue: 45 }, editrules: { minValue: 0, maxValue: 80 }, label: "Net" },
//         { headerName: "Defaulted Payment", field: "defaultedpayment", width: 50, editable: true, label: "Defaulted", edittype: "select" },
//         { headerName: "URL", field: "url", width: 200, editable: true, editoptions: { size: 75, maxlength: 200, style: "text-transform: lowercase" }, formatter: "link", label: "Url" },
//         { headerName: "Account Number", field: "accountnumber", width: 90, editable: true, label: "Acct. No" },
//         { headerName: "Email", field: "email", width: 200, editable: true, editoptions: { size: 75, maxlength: 250, style: "text-transform: lowercase" }, formatter: "email", label: "Email" },
//         { headerName: "Phone", field: "phone", width: 150, editable: true, editoptions: { size: 75, maxlength: 250 }, label: "Phone" },
//         { headerName: "Fax", field: "fax", width: 150, editable: true, editoptions: { size: 75, maxlength: 250 }, label: "Fax" },
//         { headerName: "Address", field: "address", width: 150, editable: true, editoptions: { size: 75, maxlength: 250 }, label: "Address" },
//         { headerName: "City", field: "city", width: 120, editable: true, editoptions: { size: 75, maxlength: 250 }, label: "City" },
//         { headerName: "State", field: "state", width: 120, editable: true, editoptions: { size: 75, maxlength: 250 }, label: "State" },
//         { headerName: "Country", field: "country", width: 120, editable: true, editoptions: { size: 75, maxlength: 250 }, label: "Country" },
//         { headerName: "Zip", field: "zip", width: 120, editable: true, editoptions: { size: 75, maxlength: 250 }, label: "Zip" },
//         { headerName: "Twitter", field: "twitter", width: 200, editable: true, label: "Twitter" },
//         { headerName: "Facebook", field: "facebook", width: 200, editable: true, label: "Facebook" },
//         { headerName: "LinkedIn", field: "linkedin", width: 200, editable: true, label: "Linkedin" },
//         { headerName: "HR Name", field: "hrname", width: 200, editable: true, label: "HR Name" },
//         { headerName: "HR Email", field: "hremail", width: 150, editable: true, formatter: "email", label: "HR Email" },
//         { headerName: "HR Phone", field: "hrphone", width: 90, editable: true, label: "HR Phone" },
//         { headerName: "Manager Name", field: "managername", width: 200, editable: true, label: "Mgr Name" },
//         { headerName: "Manager Email", field: "manageremail", width: 150, editable: true, formatter: "email", label: "Mgr Email" },
//         { headerName: "Manager Phone", field: "managerphone", width: 90, editable: true, label: "Mgr Phone" },
//         { headerName: "Secondary Name", field: "secondaryname", width: 200, editable: true, label: "Sec Name" },
//         { headerName: "Secondary Email", field: "secondaryemail", width: 150, editable: true, formatter: "email", label: "Sec Email" },
//         { headerName: "Secondary Phone", field: "secondaryphone", width: 90, editable: true, label: "Secondary Phone" },
//         { headerName: "Timesheet Email", field: "timsheetemail", width: 150, editable: true, formatter: "email", label: "Time Sheet Email" },
//         { headerName: "Agreement Status", field: "agreementstatus", width: 90, editable: true, label: "Agr Status", edittype: "select" },
//         { headerName: "Agreement Name", field: "agreementname", width: 200, editable: true, label: "Agreement Name" },
//         { headerName: "Agreement Link", field: "agreementlink", width: 200, editable: true, formatter: "link", label: "Agreement Url" },
//         { headerName: "Subcontractor Link", field: "subcontractorlink", width: 200, editable: true, formatter: "link", label: "Sub Contractor Url" },
//         { headerName: "Nonsolicitation Link", field: "nonsolicitationlink", width: 200, editable: true, formatter: "link", label: "NSA Url" },
//         { headerName: "Nonhire Link", field: "nonhirelink", width: 200, editable: true, formatter: "link", label: "Non Hire Url" },
//         { headerName: "Clients", field: "clients", width: 400, editable: true, edittype: "textarea", editoptions: { rows: 6, cols: 60 }, label: "Clients" },
//         { headerName: "Notes", field: "notes", width: 400, editable: true, edittype: "textarea", editoptions: { rows: 6, cols: 60 }, label: "Notes" }
//       ];
//       setColumnDefs(columns);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [currentPage]);

//   const handleRefresh = () => {
//     setSearchValue("");
//     fetchData();
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

//   const handleDeleteRow = async () => {
//     if (gridRef.current) {
//       const selectedRows = gridRef.current.api.getSelectedRows();
//       if (selectedRows.length > 0) {
//         const vendorId = selectedRows[0].id;
//         if (vendorId) {
//           const confirmation = window.confirm(
//             `Are you sure you want to delete vendor ID ${vendorId}?`
//           );
//           if (!confirmation) return;

//           try {
//             await axios.delete(`${API_URL}/vendor/delete/${vendorId}`, {
//               headers: { AuthToken: localStorage.getItem("token") },
//             });
//             alert("Vendor deleted successfully.");
//             fetchData();
//           } catch (error) {
//             const axiosError = error as AxiosError;
//             alert(
//               `Failed to delete vendor: ${
//                 (axiosError.response?.data as ErrorResponse)?.message ||
//                 axiosError.message
//               }`
//             );
//           }
//         } else {
//           alert("No valid vendor ID found for the selected row.");
//         }
//       } else {
//         setAlertMessage("Please select a row to delete.");
//         setTimeout(() => setAlertMessage(null), 3000);
//       }
//     }
//   };

//   const handlePageChange = (newPage: number) => {
//     if (newPage !== currentPage) {
//       setCurrentPage(newPage);
//       fetchData(newPage);
//     }
//   };

//   const totalPages = Math.ceil(totalRows / paginationPageSize);

//   const getPageNumbers = () => {
//     const maxPagesToShow = 5;
//     let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
//     let endPage = startPage + maxPagesToShow - 1;

//     if (endPage > totalPages) {
//       endPage = totalPages;
//       startPage = Math.max(1, endPage - maxPagesToShow + 1);
//     }

//     return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
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

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Vendor Data", 20, 10);
//     const pdfData = rowData.map((row) => Object.values(row));
//     const headers = columnDefs.map((col) => col.headerName);
//     autoTable(doc, {
//       head: [headers],
//       body: pdfData,
//       theme: "grid",
//       styles: { fontSize: 5 },
//     });
//     doc.save("vendor_data.pdf");
//   };

//   return (
//     <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md relative">
//       {alertMessage && (
//         <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded-md shadow-md z-50">
//           {alertMessage}
//         </div>
//       )}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-3xl font-bold text-gray-800">Vendor Management</h1>
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
//       <div className="relative">
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
//             }}
//             rowHeight={30}
//             headerHeight={35}
//             onGridReady={(params) => {
//               params.api.sizeColumnsToFit();
//               if (loading) {
//                 params.api.showLoadingOverlay();
//               }
//             }}
//             onGridSizeChanged={(params) => {
//               params.api.sizeColumnsToFit();
//             }}
//             overlayLoadingTemplate={
//               '<span class="ag-overlay-loading-center">Loading...</span>'
//             }
//             overlayNoRowsTemplate={
//               '<span class="ag-overlay-no-rows-center">No rows to show</span>'
//             }
//           />
//         </div>
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

//           {getPageNumbers().map((page) => (
//             <button
//               key={page}
//               onClick={() => handlePageChange(page)}
//               className={`px-3 py-1 rounded ${
//                 currentPage === page
//                   ? 'bg-blue-600 text-white'
//                   : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
//               }`}
//             >
//               {page}
//             </button>
//           ))}

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
//           <span className="ml-4 text-sm text-gray-600">
//             Total Records: {totalRows}
//           </span>
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
//           onClose={() => setModalState((prev) => ({ ...prev, edit: false }))}
//           vendorData={selectedRow}
//           onSave={fetchData}
//         />
//       )}
//       {modalState.view && selectedRow && (
//         <ViewRowModal
//           isOpen={modalState.view}
//           onClose={() => setModalState((prev) => ({ ...prev, view: false }))}
//           vendor={selectedRow}
//         />
//       )}
//     </div>
//   );
// };

// export default Vendors;


"use client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import AddRowModal from "@/modals/vendor_modals/AddRowVendor";
import EditRowModal from "@/modals/vendor_modals/EditRowVendor";
import React, { useEffect, useRef, useState } from "react";
import ViewRowModal from "@/modals/vendor_modals/ViewRowVendor";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { AxiosError } from "axios";
import { jsPDF } from "jspdf";
import { MdAdd, MdDelete } from "react-icons/md";
import { ErrorResponse } from "@/types";
import { Vendor } from "@/types/Vendor";

import {
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import {
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlineSearch,
  AiOutlineReload,
} from "react-icons/ai";

jsPDF.prototype.autoTable = autoTable;

const Vendors = () => {
  const [rowData, setRowData] = useState<Vendor[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [columnDefs, setColumnDefs] = useState<
    { headerName: string; field: string; editable?: boolean; width?: number; editoptions?: Record<string, unknown>; formatter?: string; label?: string; }[]
  >([]);
  const [paginationPageSize] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalState, setModalState] = useState<{
    add: boolean;
    edit: boolean;
    view: boolean;
  }>({ add: false, edit: false, view: false });
  const [selectedRow, setSelectedRow] = useState<Vendor | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const gridRef = useRef<AgGridReact>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchData = async (page: number = currentPage, searchQuery = "") => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/vendor/get`, {
        params: {
          page: page,
          pageSize: paginationPageSize,
          search: searchQuery,
        },
        headers: { AuthToken: localStorage.getItem("token") },
      });

      const { data, total } = response.data;
      console.log("Fetched data:", data); // Debug statement

      setRowData(data);
      setTotalRows(total);
      setupColumns(data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, searchValue);
  }, [currentPage, searchValue]);

  useEffect(() => {
    console.log("Grid data updated:", rowData); // Debug statement
  }, [rowData]);

  const handleRefresh = () => {
    setSearchValue("");
    setCurrentPage(1); // Reset to the first page on refresh
    fetchData(1, "");
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

  const handleDeleteRow = async () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        const vendorId = selectedRows[0].id;
        if (vendorId) {
          const confirmation = window.confirm(
            `Are you sure you want to delete vendor ID ${vendorId}?`
          );
          if (!confirmation) return;

          try {
            await axios.delete(`${API_URL}/vendor/delete/${vendorId}`, {
              headers: { AuthToken: localStorage.getItem("token") },
            });
            alert("Vendor deleted successfully.");
            fetchData(currentPage, searchValue);
          } catch (error) {
            const axiosError = error as AxiosError;
            alert(
              `Failed to delete vendor: ${
                (axiosError.response?.data as ErrorResponse)?.message ||
                axiosError.message
              }`
            );
          }
        } else {
          alert("No valid vendor ID found for the selected row.");
        }
      } else {
        setAlertMessage("Please select a row to delete.");
        setTimeout(() => setAlertMessage(null), 3000);
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  const totalPages = Math.ceil(totalRows / paginationPageSize);

  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
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

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Vendor Data", 20, 10);
    const pdfData = rowData.map((row) => Object.values(row));
    const headers = columnDefs.map((col) => col.headerName);
    autoTable(doc, {
      head: [headers],
      body: pdfData,
      theme: "grid",
      styles: { fontSize: 5 },
    });
    doc.save("vendor_data.pdf");
  };

  const setupColumns = (data: Vendor[]) => {
    if (data.length > 0) {
      const columns = [
        { headerName: "ID", field: "id", width: 40, editable: false },
        { headerName: "Company Name", field: "companyname", width: 250, editable: true, editoptions: { size: 75, maxlength: 250, style: "text-transform: uppercase" }, label: "Company Name" },
        { headerName: "Status", field: "status", width: 90, editable: true, label: "Status", edittype: "select" },
        { headerName: "Tier", field: "tier", width: 50, editable: true, label: "Tier", edittype: "select" },
        { headerName: "Culture", field: "culture", label: "Culture", width: 50, editable: true, edittype: "select" },
        { headerName: "Solicited", field: "solicited", label: "Solicited", width: 50, editable: true, edittype: "select" },
        { headerName: "Min Rate", field: "minrate", width: 50, formatter: "currency", editoptions: { defaultValue: 62.0 }, formatoptions: { decimalPlaces: 2, thousandsSeparator: ",", prefix: "$" }, sorttype: "currency", label: "Rate" },
        { headerName: "Hire Before Term", field: "hirebeforeterm", label: "HBT", width: 50, editable: true, edittype: "select" },
        { headerName: "Hire After Term", field: "hireafterterm", label: "HAT", width: 50, editable: true, edittype: "select" },
        { headerName: "Late Payments", field: "latepayments", label: "Late Pay", width: 50, editable: true, edittype: "select" },
        { headerName: "Total Net Term", field: "totalnetterm", width: 70, editable: true, editoptions: { defaultValue: 45 }, editrules: { minValue: 0, maxValue: 80 }, label: "Net" },
        { headerName: "Defaulted Payment", field: "defaultedpayment", label: "Defaulted", width: 50, editable: true, edittype: "select" },
        { headerName: "URL", field: "url", width: 200, editable: true, editoptions: { size: 75, maxlength: 200, style: "text-transform: lowercase" }, formatter: "link", formatoptions: { target: "_blank" }, editrules: { url: true, required: false }, label: "Url" },
        { headerName: "Account Number", field: "accountnumber", width: 90, editable: true, label: "Acct. No" },
        { headerName: "Email", field: "email", width: 200, editable: true, editoptions: { size: 75, maxlength: 250, style: "text-transform: lowercase" }, formatter: "email", editrules: { email: true, required: true }, label: "Email" },
        { headerName: "Phone", field: "phone", width: 150, editable: true, editoptions: { size: 75, maxlength: 250 }, label: "Phone" },
        { headerName: "Fax", field: "fax", width: 150, editable: true, editoptions: { size: 75, maxlength: 250 }, label: "Fax" },
        { headerName: "Address", field: "address", width: 150, editable: true, editoptions: { size: 75, maxlength: 250 }, label: "Address" },
        { headerName: "City", field: "city", width: 120, editable: true, editoptions: { size: 75, maxlength: 250 }, label: "City" },
        { headerName: "State", field: "state", width: 120, editable: true, editoptions: { size: 75, maxlength: 250 }, label: "State" },
        { headerName: "Country", field: "country", width: 120, editable: true, editoptions: { size: 75, maxlength: 250 }, label: "Country" },
        { headerName: "Zip", field: "zip", width: 120, editable: true, editoptions: { size: 75, maxlength: 250 }, label: "Zip" },
        { headerName: "Twitter", field: "twitter", width: 200, editable: true, label: "Twitter" },
        { headerName: "Facebook", field: "facebook", width: 200, editable: true, label: "Facebook" },
        { headerName: "LinkedIn", field: "linkedin", width: 200, editable: true, label: "Linkedin" },
        { headerName: "HR Name", field: "hrname", width: 200, editable: true, editoptions: { size: 75, maxlength: 200 }, label: "HR Name" },
        { headerName: "HR Email", field: "hremail", width: 150, editable: true, formatter: "email", label: "HR Email" },
        { headerName: "HR Phone", field: "hrphone", width: 90, editable: true, label: "HR Phone" },
        { headerName: "Manager Name", field: "managername", width: 200, editable: true, editoptions: { size: 75, maxlength: 200 }, label: "Mgr Name" },
        { headerName: "Manager Email", field: "manageremail", width: 150, editable: true, formatter: "email", label: "Mgr Email" },
        { headerName: "Manager Phone", field: "managerphone", width: 90, editable: true, label: "Mgr Phone" },
        { headerName: "Secondary Name", field: "secondaryname", width: 200, editable: true, editoptions: { size: 75, maxlength: 200 }, label: "Sec Name" },
        { headerName: "Secondary Email", field: "secondaryemail", width: 150, editable: true, formatter: "email", label: "Sec Email" },
        { headerName: "Secondary Phone", field: "secondaryphone", width: 90, editable: true, label: "Secondary Phone" },
        { headerName: "Time Sheet Email", field: "timsheetemail", width: 150, editable: true, formatter: "email", label: "Time Sheet Email" },
        { headerName: "Agreement Status", field: "agreementstatus", width: 90, editable: true, label: "Agr Status", edittype: "select" },
        { headerName: "Agreement Name", field: "agreementname", width: 200, editable: true, editoptions: { size: 75, maxlength: 200 }, label: "Agreement Name" },
        { headerName: "Agreement Link", field: "agreementlink", width: 200, editable: true, editoptions: { size: 75, maxlength: 200 }, formatter: "link", formatoptions: { target: "_blank" }, editrules: { url: true, required: false }, label: "Agreement Url" },
        { headerName: "Subcontractor Link", field: "subcontractorlink", width: 200, editable: true, editoptions: { size: 75, maxlength: 200 }, formatter: "link", formatoptions: { target: "_blank" }, editrules: { url: true, required: false }, label: "Sub Contractor Url" },
        { headerName: "Nonsolicitation Link", field: "nonsolicitationlink", width: 200, editable: true, editoptions: { size: 75, maxlength: 200 }, formatter: "link", formatoptions: { target: "_blank" }, editrules: { url: true, required: false }, label: "NSA Url" },
        { headerName: "Non Hire Link", field: "nonhirelink", width: 200, editable: true, editoptions: { size: 75, maxlength: 200 }, formatter: "link", formatoptions: { target: "_blank" }, editrules: { url: true, required: false }, label: "Non Hire Url" },
        { headerName: "Clients", field: "clients", width: 400, editable: true, edittype: "textarea", editoptions: { rows: 6, cols: 60 }, label: "Clients" },
        { headerName: "Notes", field: "notes", width: 400, editable: true, edittype: "textarea", editoptions: { rows: 6, cols: 60 }, label: "Notes" }
      ];
      setColumnDefs(columns);
    }
  };

  return (
    <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md relative">
      {alertMessage && (
        <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded-md shadow-md z-50">
          {alertMessage}
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Vendor Management</h1>
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
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-64"
        />
        <button
          onClick={() => {}}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md ml-2 transition duration-300 hover:bg-blue-900"
        >
          <AiOutlineSearch className="mr-2" /> Search
        </button>
      </div>
      <div className="relative">
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
            }}
            rowHeight={30}
            headerHeight={35}
            onGridReady={(params) => {
              params.api.sizeColumnsToFit();
              if (loading) {
                params.api.showLoadingOverlay();
              }
            }}
            onGridSizeChanged={(params) => {
              params.api.sizeColumnsToFit();
            }}
            overlayLoadingTemplate={
              '<span class="ag-overlay-loading-center">Loading...</span>'
            }
            overlayNoRowsTemplate={
              '<span class="ag-overlay-no-rows-center">No rows to show</span>'
            }
          />
        </div>
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

          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {page}
            </button>
          ))}

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
          <span className="ml-4 text-sm text-gray-600">
            Total Records: {totalRows}
          </span>
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
          onClose={() => setModalState((prev) => ({ ...prev, edit: false }))}
          vendorData={selectedRow}
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

export default Vendors;



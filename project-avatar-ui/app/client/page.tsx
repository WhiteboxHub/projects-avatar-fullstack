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
// import AddRowModal from "../../modals/client_modals/AddRowClient";
// import EditRowModal from "../../modals/client_modals/EditRowClient";
// // import ViewRowModal from "../../modals/client_modals/ViewRowClient";
// import { MdDelete } from "react-icons/md";
// import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
// import {
//   AiOutlineEdit,
//   AiOutlineEye,
//   AiOutlineSearch,
//   AiOutlineReload,
// } from "react-icons/ai";
// import { MdAdd } from "react-icons/md";
// import { Client, ErrorResponse } from "@/types";


// jsPDF.prototype.autoTable = autoTable;
// const Clients = () => {
//   const [rowData, setRowData] = useState<Client[]>([]);
//   const [alertMessage, setAlertMessage] = useState<string | null>(null); // Added state for alert message
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
//   const [selectedRow, setSelectedRow] = useState<Client | null>(null);
//   const [searchValue, setSearchValue] = useState<string>("");
//   const gridRef = useRef<AgGridReact>(null);

//   const API_URL = process.env.NEXT_PUBLIC_API_URL;

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${API_URL}/client`, {
//         params: {
//           page: currentPage,
//           pageSize: paginationPageSize,
//         },
//         headers: { AuthToken: localStorage.getItem("token") },
//       });

//       const { data, totalRows } = response.data;

//       const dataWithSerials = data.map((item: Client) => ({
//         ...item,
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

//   const fetchClients = async (searchQuery = "") => {
//     try {
//       const response = await axios.get(`${API_URL}/client/search`, {
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
//     fetchClients(searchValue);
//   };

//   const setupColumns = (data: Client[]) => {
//     if (data.length > 0) {
//       const columns = [
//         ...Object.keys(data[0]).map((key) => ({
//           headerName: key.charAt(0).toUpperCase() + key.slice(1),
//           field: key,
//         })),
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
//         const clientId = selectedRows[0].clientid || selectedRows[0].id;
//         if (clientId) {
//           const confirmation = window.confirm(
//             `Are you sure you want to delete client ID ${clientId}?`
//           );
//           if (!confirmation) return;

//           try {
//             await axios.delete(`${API_URL}/client/delete/${clientId}`, {
//               headers: { AuthToken: localStorage.getItem("token") },
//             });
//             alert("Client deleted successfully.");
//             fetchData();
//           } catch (error) {
//             const axiosError = error as AxiosError;
//             alert(
//               `Failed to delete client: ${
//                 (axiosError.response?.data as ErrorResponse)?.message || axiosError.message
//               }`
//             );
//           }
//         } else {
//           alert("No valid client ID found for the selected row.");
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


//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Client Data", 20, 10);
//     const pdfData = rowData.map((row) => Object.values(row));
//     const headers = columnDefs.map((col) => col.headerName);
//     autoTable(doc, {
//       head: [headers],
//       body: pdfData,
//       theme: 'grid',
//       styles: { fontSize: 5 },
//     });
//     doc.save("client_data.pdf");
//   };

//   const totalPages = Math.ceil(totalRows / paginationPageSize);
//   const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

//   return (
//     <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md relative">
//     {alertMessage && ( // Conditional rendering of alert message
//       <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded-md shadow-md z-50">
//         {alertMessage}
//       </div>
//     )}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-3xl font-bold text-gray-800">Client Management</h1>
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
//           onClose={() => setModalState((prev) => ({ ...prev, edit: false }))}
//           clientData={selectedRow} // Changed 'data' back to 'clientData' to match AddRowModalProps
//           onSave={fetchData}
//         />
//       )}
//     </div>
//   )
// };

// export default Clients;
"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColDef, GridReadyEvent } from "ag-grid-community";
import { FaDownload, FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { MdDelete, MdAdd } from "react-icons/md";
import { AiOutlineEdit, AiOutlineEye, AiOutlineSearch, AiOutlineReload } from "react-icons/ai";
import { toast } from "react-hot-toast";

// Import types
import { Client, ClientStatus, ClientTier, PaginatedResponse } from "@/types/client";
import { ErrorResponse } from "@/types";

// Import modals
import AddClientModal from "@/modals/client_modals/AddRowClient";
import EditClientModal from "@/modals/client_modals/EditRowClient";
import ViewClientModal from "@/modals/client_modals/ViewRowClient";

const ClientPage = () => {
  // State management
  const [rowData, setRowData] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [paginationPageSize] = useState<number>(100);
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    view: false,
  });

  const gridRef = useRef<AgGridReact>(null);

  // Column Definitions
  const columnDefs = useMemo<ColDef[]>(() => [
    {
      headerName: "ID",
      field: "id",
      sortable: true,
      filter: true,
      width: 100,
      pinned: "left",
    },
    {
      headerName: "Company Name",
      field: "companyName",
      sortable: true,
      filter: true,
      width: 200,
      pinned: "left",
      cellRenderer: (params: any) => {
        return params.value?.toUpperCase();
      },
    },
    {
      headerName: "Tier",
      field: "tier",
      sortable: true,
      filter: true,
      width: 120,
      cellRenderer: (params: any) => {
        const tier = params.value;
        let className = "px-2 py-1 rounded text-white text-sm ";
        switch (tier) {
          case ClientTier.PREMIUM:
            className += "bg-purple-500";
            break;
          case ClientTier.STANDARD:
            className += "bg-blue-500";
            break;
          case ClientTier.BASIC:
            className += "bg-green-500";
            break;
          default:
            className += "bg-gray-500";
        }
        return <span className={className}>{tier}</span>;
      },
    },
    {
      headerName: "Status",
      field: "status",
      sortable: true,
      filter: true,
      width: 120,
      cellRenderer: (params: any) => {
        const status = params.value;
        let className = "px-2 py-1 rounded text-white text-sm ";
        switch (status) {
          case ClientStatus.ACTIVE:
            className += "bg-green-500";
            break;
          case ClientStatus.INACTIVE:
            className += "bg-red-500";
            break;
          case ClientStatus.PENDING:
            className += "bg-yellow-500";
            break;
          case ClientStatus.SUSPENDED:
            className += "bg-orange-500";
            break;
          default:
            className += "bg-gray-500";
        }
        return <span className={className}>{status}</span>;
      },
    },
    {
      headerName: "Email",
      field: "email",
      sortable: true,
      filter: true,
      width: 200,
      cellRenderer: (params: any) => {
        return params.value ? (
          <a
            href={`mailto:${params.value}`}
            className="text-blue-600 hover:text-blue-800"
          >
            {params.value.toLowerCase()}
          </a>
        ) : "";
      },
    },
    {
      headerName: "Phone",
      field: "phone",
      sortable: true,
      filter: true,
      width: 150,
      cellRenderer: (params: any) => {
        return params.value ? (
          <a href={`tel:${params.value}`} className="text-blue-600 hover:text-blue-800">
            {params.value}
          </a>
        ) : "";
      },
    },
    {
      headerName: "Website",
      field: "url",
      sortable: true,
      filter: true,
      width: 150,
      cellRenderer: (params: any) => {
        return params.value ? (
          <a
            href={params.value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            Visit Site
          </a>
        ) : "";
      },
    },
    {
      headerName: "Location",
      field: "address",
      sortable: true,
      filter: true,
      width: 200,
      cellRenderer: (params: any) => {
        const { data } = params;
        const address = [
          data.address,
          data.city,
          data.state,
          data.zip,
          data.country,
        ]
          .filter(Boolean)
          .join(", ");
        return address;
      },
    },
    {
      headerName: "City",
      field: "city",
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      headerName: "State",
      field: "state",
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      headerName: "Country",
      field: "country",
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      headerName: "ZIP",
      field: "zip",
      sortable: true,
      filter: true,
      width: 100,
    },
    {
      headerName: "Manager",
      field: "manager1Name",
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      headerName: "Manager Email",
      field: "manager1Email",
      sortable: true,
      filter: true,
      width: 200,
      cellRenderer: (params: any) => {
        return params.value ? (
          <a
            href={`mailto:${params.value}`}
            className="text-blue-600 hover:text-blue-800"
          >
            {params.value.toLowerCase()}
          </a>
        ) : "";
      },
    },
    {
      headerName: "Manager Phone",
      field: "manager1Phone",
      sortable: true,
      filter: true,
      width: 150,
      cellRenderer: (params: any) => {
        return params.value ? (
          <a href={`tel:${params.value}`} className="text-blue-600 hover:text-blue-800">
            {params.value}
          </a>
        ) : "";
      },
    },
    {
      headerName: "Hiring Manager",
      field: "hmName",
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      headerName: "HM Email",
      field: "hmEmail",
      sortable: true,
      filter: true,
      width: 200,
      cellRenderer: (params: any) => {
        return params.value ? (
          <a
            href={`mailto:${params.value}`}
            className="text-blue-600 hover:text-blue-800"
          >
            {params.value.toLowerCase()}
          </a>
        ) : "";
      },
    },
    {
      headerName: "HM Phone",
      field: "hmPhone",
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      headerName: "HR Name",
      field: "hrName",
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      headerName: "HR Email",
      field: "hrEmail",
      sortable: true,
      filter: true,
      width: 200,
      cellRenderer: (params: any) => {
        return params.value ? (
          <a
            href={`mailto:${params.value}`}
            className="text-blue-600 hover:text-blue-800"
          >
            {params.value.toLowerCase()}
          </a>
        ) : "";
      },
    },
    {
      headerName: "HR Phone",
      field: "hrPhone",
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      headerName: "Social Media",
      field: "social",
      sortable: false,
      filter: false,
      width: 150,
      cellRenderer: (params: any) => {
        const { data } = params;
        return (
          <div className="flex space-x-2">
            {data.twitter && (
              <a
                href={data.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-600"
              >
                <i className="fab fa-twitter"></i>
              </a>
            )}
            {data.facebook && (
              <a
                href={data.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                <i className="fab fa-facebook"></i>
              </a>
            )}
            {data.linkedIn && (
              <a
                href={data.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-800 hover:text-blue-900"
              >
                <i className="fab fa-linkedin"></i>
              </a>
            )}
          </div>
        );
      },
    },
    {
      headerName: "Notes",
      field: "notes",
      sortable: true,
      filter: true,
      width: 200,
      cellRenderer: (params: any) => {
        return params.value ? (
          <div className="truncate" title={params.value}>
            {params.value}
          </div>
        ) : "";
      },
    },
    {
      headerName: "Last Modified",
      field: "lastModDateTime",
      sortable: true,
      filter: true,
      width: 150,
      cellRenderer: (params: any) => {
        return params.value ? new Date(params.value).toLocaleString() : "";
      },
    },
  ], []);

  // API calls
  const fetchClients = async (page: number, searchQuery: string = "") => {
    setLoading(true);
    try {
      const response = await axios.get<PaginatedResponse<Client>>(
        `${process.env.NEXT_PUBLIC_API_URL}/client`,
        {
          params: {
            page,
            pageSize: paginationPageSize,
            search: searchQuery,
          },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setRowData(response.data.data);
      setTotalRows(response.data.totalRows);
    } catch (error) {
      toast.error("Failed to fetch clients");
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  // Event handlers
  const handleSearch = () => {
    setCurrentPage(1);
    fetchClients(1, searchValue);
  };

  const handleRefresh = () => {
    setSearchValue("");
    setCurrentPage(1);
    fetchClients(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchClients(newPage, searchValue);
  };

  const handleAddClient = () => {
    setModalState((prev) => ({ ...prev, add: true }));
  };

  const handleEditClient = () => {
    const selectedRows = gridRef.current?.api.getSelectedRows();
    if (selectedRows && selectedRows.length > 0) {
      setSelectedClient(selectedRows[0]);
      setModalState((prev) => ({ ...prev, edit: true }));
    } else {
      toast.error("Please select a client to edit");
    }
  };

  const handleViewClient = () => {
    const selectedRows = gridRef.current?.api.getSelectedRows();
    if (selectedRows && selectedRows.length > 0) {
      setSelectedClient(selectedRows[0]);
      setModalState((prev) => ({ ...prev, view: true }));
    } else {
      toast.error("Please select a client to view");
    }
  };

  const handleDeleteClient = async () => {
    const selectedRows = gridRef.current?.api.getSelectedRows();
    if (!selectedRows || selectedRows.length === 0) {
      toast.error("Please select a client to delete");
      return;
    }

    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/client/${selectedRows[0].id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        toast.success("Client deleted successfully");
        fetchClients(currentPage, searchValue);
      } catch (error) {
        toast.error("Failed to delete client");
        console.error("Error deleting client:", error);
      }
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Client Data", 20, 10);
    
    const headers = columnDefs.map((col) => col.headerName);
    const data = rowData.map((row) => 
      columnDefs.map((col) => row[col.field as keyof Client]?.toString() || "")
    );

    autoTable(doc, {
      head: [headers],
      body: data,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [71, 85, 105] },
    });

    doc.save("clients.pdf");
  };

  // Effects
  useEffect(() => {
    fetchClients(currentPage);
  }, [currentPage]);

  // Calculate pagination
  const totalPages = Math.ceil(totalRows / paginationPageSize);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="p-4 mt-20 mb-10 mx-20 bg-gray-100 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Client Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleAddClient}
            className="btn-primary"
            title="Add Client"
          >
            <MdAdd />
          </button>
          <button
            onClick={handleEditClient}
            className="btn-secondary"
            title="Edit Client"
          >
            <AiOutlineEdit />
          </button>
          <button
            onClick={handleDeleteClient}
            className="btn-danger"
            title="Delete Client"
          >
            <MdDelete />
          </button>
          <button
            onClick={handleViewClient}
            className="btn-info"
            title="View Client"
          >
            <AiOutlineEye />
          </button>
          <button
            onClick={handleRefresh}
            className="btn-default"
            title="Refresh"
          >
            <AiOutlineReload />
          </button>
          <button
            onClick={handleDownloadPDF}
            className="btn-success"
            title="Download PDF"
          >
            <FaDownload />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search clients..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
        >
          <AiOutlineSearch className="text-xl" />
        </button>
      </div>

      {/* Grid */}
      <div className="ag-theme-alpine h-[600px] w-full rounded-md overflow-hidden">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          rowSelection="single"
          animateRows={true}
          defaultColDef={{
            flex: 1,
            minWidth: 100,
            sortable: true,
            filter: true,
            resizable: true,
          }}
        />
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            <FaAngleDoubleLeft />
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            <FaChevronLeft />
          </button>
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`pagination-btn ${
                currentPage === page ? "bg-blue-600 text-white" : ""
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            <FaChevronRight />
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            <FaAngleDoubleRight />
          </button>
        </div>
      </div>

      {/* Modals */}
      {modalState.add && (
        <AddClientModal
          isOpen={modalState.add}
          onClose={() => setModalState((prev) => ({ ...prev, add: false }))}
          refreshData={() => fetchClients(currentPage)}
        />
      )}
      {modalState.edit && selectedClient && (
        <EditClientModal
          isOpen={modalState.edit}
          onClose={() => setModalState((prev) => ({ ...prev, edit: false }))}
          clientData={selectedClient}
          onSave={() => fetchClients(currentPage)}
        />
      )}
      {modalState.view && selectedClient && (
        <ViewClientModal
          isOpen={modalState.view}
          onClose={() => setModalState((prev) => ({ ...prev, view: false }))}
          clientData={selectedClient}
        />
      )}
    </div>
  );
};

export default ClientPage;
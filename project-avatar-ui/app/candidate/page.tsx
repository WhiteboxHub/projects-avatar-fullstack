// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { AgGridReact } from "ag-grid-react";
// import { AxiosError } from 'axios';
// import "ag-grid-community/styles/ag-grid.css";
// import { FaDownload } from "react-icons/fa";
// import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import AddRowModal from "../../modals/candidate_modals/AddRowCandidate";
// import EditRowModal from "../../modals/candidate_modals/EditRowCandidate";
// import ViewRowModal from "../../modals/candidate_modals/ViewRowCandidate";
// import withAuth from "@/modals/withAuth";
// import {
//   AiOutlineEdit,
//   AiOutlineSearch,
//   AiOutlineReload,
//   AiOutlineEye,
// } from "react-icons/ai";
// import { MdDelete } from "react-icons/md";
// import { MdAdd } from "react-icons/md";
// import { Candidate, TransformedCandidate } from "../../types/index"; // Adjust the import path accordingly

// interface GroupedData {
//   [batch: string]: Candidate[];
// }
// interface BatchRow {
//   batchname: string;
//   isBatch: true;
// }
// const Candidates = () => {
//   const [rowData, setRowData] = useState<Candidate[]>([]);
//   const [alertMessage, setAlertMessage] = useState<string | null>(null); // Added state for alert message
//   const [, setGroupedData] = useState<GroupedData>({});
//   const [columnDefs, setColumnDefs] = useState<
//     { headerName: string; field: string }[]
//   >([]);
//   const [paginationPageSize] = useState<number>(200); // Increased records per page to 200
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   //const [groupedData, setGroupedData] = useState({});
//   const [totalRows, setTotalRows] = useState<number>(0);
//   const [loading,] = useState<boolean>(false);
//   const [modalState, setModalState] = useState<{
//     add: boolean;
//     edit: boolean;
//     view: boolean;
//   }>({ add: false, edit: false, view: false });
//   const [selectedRow, setSelectedRow] = useState<Candidate | null>(null);
//   const [searchValue, setSearchValue] = useState<string>("");
//   const gridRef = useRef<AgGridReact>(null);

//   const API_URL = process.env.NEXT_PUBLIC_API_URL;
  
  

//   const fetchData = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/candidates`, {
//         params: { page: currentPage, pageSize: paginationPageSize },
//         headers: { AuthToken: localStorage.getItem("token") },
//       });
//       const { data, totalRows } = response.data;
  
//       // Filter candidates to keep only those with a batchname or batchid
//       const filteredData = data.filter((candidate: { batchname: string; batchid: number }) => candidate.batchname || candidate.batchid);
  
//       if (filteredData.length > 0) {
//         setTotalRows(totalRows);
  
//         // Group candidates by 'batchname'
//         const groupedData = filteredData.reduce((acc: GroupedData, candidate: Candidate) => {
//           const batch = candidate.batchname;
//           if (!Array.isArray(acc[batch])) {
//             acc[batch] = [];
//           }
//           acc[batch].push(candidate);
//           return acc;
//         }, {});
  
// type TransformedRow = TransformedCandidate | BatchRow;

// const transformedRowData: TransformedRow[] = [];

//         for (const batch in groupedData) {
//           // Add a batch row
//           transformedRowData.push({
//             batchname: batch,
//             isBatch: true, // This is a batch (parent) row
//           });
        
//           // Add candidate rows for the batch
//           const candidates = groupedData[batch];
//           candidates.forEach((candidate: Candidate) => {
//             transformedRowData.push({
//               ...candidate,
//               batchname: '', // Clear batchname for candidate rows
//               isBatch: false, // This is a candidate row
//             });
//           });
//         }
//         // Only set Candidate objects in rowData
//         // setRowData(transformedRowData); // Use transformedRowData instead of filteredData
//         // Filter out only TransformedCandidate items (those with isBatch: false)
//       setRowData(transformedRowData.filter((row) => !row.isBatch) as TransformedCandidate[]);

//         setGroupedData(groupedData);
  
//         // Setup columns based on filtered data
//         setupColumns(filteredData);
//       } else {
//         setRowData([]); // Clear row data if no candidates are available
//         setGroupedData({}); // Clear grouped data
//       }
//     } catch (error) {
//       console.error("Error loading data:", error);
//     }
//   };
  
  
  
//   interface ErrorResponse {
//     message: string;
//     // Add other properties if needed
// }
//   const fetchBatches = async (searchQuery = "") => {
//     try {
//       const response = await axios.get(`${API_URL}/candidates/search`, {
//         params: {
//           page: currentPage, // Pass current page for pagination
//           pageSize: paginationPageSize, // Pass pageSize for pagination
//           search: searchQuery, // Pass the search query to the backend
//         },
//         headers: { AuthToken: localStorage.getItem("token") },
//       });
  
//       const { data, totalRows } = response.data;
//       setRowData(data); // Set the table data
//       setTotalRows(totalRows); // Set the total rows for pagination
//       setupColumns(data); // Optional: If needed for dynamic columns
//     } catch (error) {
//       console.error("Error loading data:", error);
//     }
//   };
//   interface BatchNameRendererProps {
//     data: {
//       isBatch: boolean; // Adjust the type if necessary
//       batchname: string | number | null | undefined; // Adjust the type if necessary
//     };
//   }
  
//   const BatchNameRenderer: React.FC<BatchNameRendererProps> = (props) => {
//     return (
//       <div style={{ height: '100%', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
//         {props.data.isBatch ? (
//           <span className='font-bold'>{props.data.batchname}</span> // Bold batchname
//         ) : (
//           ''
//         )}
//       </div>
//     );
//   };
  
  
//   const setupColumns = (data: Candidate[]) => {
//   if (data.length > 0) {
//     const keys = Object.keys(data[0]);

//     const columns = keys.map((key) => ({
//       headerName: key.charAt(0).toUpperCase() + key.slice(1),
//       field: key,
//       editable: key === "batchname",
//       cellEditor: key === "batchname" ? "agSelectCellEditor" : undefined,
//       cellRenderer: key === "batchname" ? 'batchNameRenderer' : undefined,
//       cellStyle: key === "batchname" ? { fontWeight: 'bold' } : {}, // Make batchname column bold
//     }));

//     const batchnameCol = {
//       headerName: "Batch Name",
//       field: "batchname",
//       editable: true,
//       cellEditor: "agSelectCellEditor",
//       cellEditorParams: {
//         values: Array.from(new Set(data.map((candidate) => candidate.batchname))),
//       },
//       cellStyle: { fontWeight: 'bold' }, // Make batchname column bold
//     };

//     const filteredColumns = columns.filter(col => col.field !== "batchname");

//     setColumnDefs([batchnameCol, ...filteredColumns]);
//   }
// };

  
//   const handleSearch = () => {
//     fetchBatches(searchValue); // Fetch data using the search term
//   };
//   const handleDownloadPDF = () => {
//     // Create a new instance of jsPDF
//     const doc = new jsPDF();
  
//     // Add title text
//     doc.text("Candidate Data", 10, 10);
  
//     // Prepare data for PDF
//     const pdfData = rowData.map((row) => Object.values(row));
//     const headers = columnDefs.map((col) => col.headerName);
  
//     // Create the autoTable
//     autoTable(doc, {
//         head: [headers],
//         body: pdfData,
//         theme: 'grid', // Optional: set the theme for the table
//         styles: { fontSize: 5 }, // Optional: adjust font size
//     });
  
//     // Save the PDF
//     doc.save("candidate_data.pdf");
//   };

//   const handleRefresh = () => {
//     setSearchValue(""); // Clear search value before refreshing
//     fetchData(); // Re-fetch data
//     window.location.reload(); // Trigger page reload
//   };

//   const handleViewRow = () => {
//     if (gridRef.current) {
//       const selectedRows = gridRef.current.api.getSelectedRows();
//       if (selectedRows.length > 0) {
//         setSelectedRow(selectedRows[0]); // Set the selected row data
//         setModalState((prevState) => ({ ...prevState, view: true })); // Open the view modal
//       } else {
//         // setAlertMessage("Please select a row to view."); // Set alert message
//         setTimeout(() => setAlertMessage(null), 3000); // Clear alert message after 3 seconds
//       }
//     }
//   };


//   useEffect(() => {
//     fetchData();
//   }, [currentPage]);

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

//     const handleDeleteRow = async () => {
//     if (gridRef.current) {
//       const selectedRows = gridRef.current.api.getSelectedRows();
//       if (selectedRows.length > 0) {
//         const candidateName = selectedRows[0].name; // Assuming 'name' is the property for the candidate's name
  
//         if (candidateName) {
//           const confirmation = window.confirm(
//             `Are you sure you want to delete candidate ${candidateName}?`
//           );
//           if (!confirmation) return;
  
//           try {
//             await axios.delete(`${API_URL}/candidates/delete/${candidateName}`, {
//               headers: { AuthToken: localStorage.getItem("token") },
//             });
//             alert(`Candidate ${candidateName} deleted successfully.`);
//             fetchData(); // Refresh data after delete
//           } catch (error) {
//             const axiosError = error as AxiosError;
//             alert(
//               `Failed to delete candidate: ${
//                 (axiosError.response?.data as ErrorResponse)?.message || axiosError.message
//               }`
//             );
//           }
//         } else {
//           alert("No valid candidate name found for the selected row.");
//         }
//       } else {
//         setAlertMessage("Please select a row to delete."); // Set alert message
//         setTimeout(() => setAlertMessage(null), 3000); // Clear alert message after 3 seconds
//       }
//     }
//   };
  

//   const handlePageChange = (newPage: number) => {
//     setCurrentPage(newPage);
//   };

//   const totalPages = Math.ceil(totalRows / paginationPageSize);
//   const startPage = Math.max(1, currentPage );
//   const endPage = Math.min(totalPages, currentPage + 4);
//   const pageOptions = Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage);

//   return (
//     <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md relative">
//     {/* {alertMessage && ( // Conditional rendering of alert message
//       <div className="fixed top-4 right-4 p-4 bg-blue-500 text-white rounded-md shadow-md z-50">
//         {alertMessage}
//       </div>
//     )} */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-3xl font-bold text-gray-800">Candidate Management</h1>
        
//         </div>
      
//         {/* Search Functionality */}
//         <div className="flex flex-col md:flex-row mb-4 justify-between   items-center">
//           <div className="flex w-full md:w-auto mb-2 md:mb-0">
//             <input
//               type="text"
//               placeholder="Search..."
//               value={searchValue}
//               onChange={(e) => setSearchValue(e.target.value)}
//               className="border border-gray-300 rounded-md p-2 w-64"
//             />
//             <button
//               onClick={handleSearch}
//               className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md ml-2 transition duration-300 hover:bg-blue-900 text-xs md:text-base"
//             >
//               <AiOutlineSearch className="mr-1" /> Search
//             </button>
//           </div>
        
          

//         <div className="flex flex-col md:flex-row md:items-center md:justify-end md:space-x-2 mb-4">
//           <div className="flex flex-wrap space-x-2 mb-4 md:mb-0">

//             <button
//               onClick={handleAddRow}
//               className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700 text-xs md:text-base"
//             >
//               <MdAdd className="mr-2" />
//             </button>
//             <button
//               onClick={handleEditRow}
//               className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700 text-xs md:text-base"
//             >
//               <AiOutlineEdit className="mr-1" />
//             </button>
//             <button
//               onClick={handleViewRow}
//               className="flex items-center px-3 py-2 bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-700 text-xs md:text-base"
//             >
//               <AiOutlineEye className="mr-1" />
//             </button>
//             <button
//               onClick={handleDeleteRow}
//               className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700 text-xs md:text-base"
//             >
//               <MdDelete className="mr-1" />
//             </button>
//           </div>
//           <div className="flex flex-wrap space-x-2 mb-4 md:mb-0">
//             <button
//               onClick={handleRefresh}
//               className="flex items-center px-3 py-2 bg-gray-500 text-white rounded-md transition duration-300 hover:bg-gray-900 text-xs md:text-base"
//             >
//             <AiOutlineReload className="mr-2" />
//           </button>
//           <button
//             onClick={handleDownloadPDF}
//             className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700"
//           >
//             <FaDownload className="mr-2" />
//           </button>
//         </div>
      
//          </div>
//     </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-48">
//           <span className="text-xl">Loading...</span>
//         </div>
//       ) : (
//         <div
//         className="ag-theme-alpine"
//         style={{ height: "400px", width: "100%", overflowY: "auto" }}
//       >
//         {<AgGridReact
//           ref={gridRef}
//           rowData={rowData}
//           columnDefs={columnDefs}
//           pagination={false}
//           domLayout="normal" 
//           rowSelection="multiple"
//           defaultColDef={{
//             sortable: true,
//             filter: true,
//             resizable: true,
//             cellStyle: { color: "#333", fontSize: "0.75rem", padding: "1px" },
//             minWidth: 80,
//             maxWidth: 150,
//           }}
//           rowHeight={30}
//           headerHeight={35}
//           getRowHeight={(params) => (params.data.isBatch ? 40 : 30)} // Set a taller height for batch rows
//           getRowStyle={(params) => ({
//             paddingTop: "5px",
//             backgroundColor: params.data.isBatch ? '#f0f0f0' : '#ffffff', // Different background for batch rows
//             fontWeight: params.data.isBatch ? 'bold' : 'normal', // Bold text for batch rows
//           })} // Set a taller height for batch rows
//           components={{
//             batchNameRenderer: BatchNameRenderer, // Custom component for rendering batch names
//           }}
//         />
        
//          }

//       </div>
//      )}
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
//         isOpen={modalState.edit}
//         onRequestClose={() => setModalState({ ...modalState, edit: false })}
//         rowData={selectedRow} // Fixed the typo from 'Candidateandidate' to 'Candidate'
//         onSave={fetchData}
    
//       />
//       )}
//       {modalState.view && selectedRow && (
//         <ViewRowModal
//         isOpen={modalState.view}
//         onClose={() => setModalState((prev) => ({ ...prev, view: false }))}
//         onRequestClose={() => setModalState((prev) => ({ ...prev, view: false }))}  // Pass the missing prop
//         rowData={selectedRow}
//       />
//       )}
//     </div>
//   );
// };


// export default withAuth(Candidates);







"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { AxiosError } from 'axios';
import "ag-grid-community/styles/ag-grid.css";
import { FaDownload } from "react-icons/fa";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import "ag-grid-community/styles/ag-theme-alpine.css";
import AddRowModal from "../../modals/candidate_modals/AddRowCandidate";
import EditRowModal from "../../modals/candidate_modals/EditRowCandidate";
import ViewRowModal from "../../modals/candidate_modals/ViewRowCandidate";
import withAuth from "@/modals/withAuth";
import {
  AiOutlineEdit,
  AiOutlineSearch,
  AiOutlineReload,
  AiOutlineEye,
} from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { MdAdd } from "react-icons/md";
import { Candidate, TransformedCandidate } from "../../types/index"; // Adjust the import path accordingly

interface GroupedData {
  [batch: string]: Candidate[];
}

  const Candidates = () => {
  const [rowData, setRowData] = useState<Candidate[]>([]);
  // const [alertMessage, setAlertMessage] = useState<string | null>(null); // Added state for alert message
  const [, setGroupedData] = useState<GroupedData>({});
  const [columnDefs, setColumnDefs] = useState<
    { headerName: string; field: string }[]
  >([]);
  const [paginationPageSize] = useState<number>(200); // Increased records per page to 200
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading,] = useState<boolean>(false);
  const [modalState, setModalState] = useState<{
    add: boolean;
    edit: boolean;
    view: boolean;
  }>({ add: false, edit: false, view: false });
  const [selectedRow, setSelectedRow] = useState<Candidate | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const gridRef = useRef<AgGridReact>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/candidates/search`, {
        params: { page: currentPage, pageSize: paginationPageSize },
        headers: { AuthToken: localStorage.getItem("token") },
      });
      const { data, totalRows } = response.data;

      // Filter candidates to keep only those with a batchname or batchid
      const filteredData = data.filter((candidate: { batchname: string; batchid: number }) => candidate.batchname || candidate.batchid);

      if (filteredData.length > 0) {
        setTotalRows(totalRows);

        // Group candidates by 'batchname'
        const groupedData = filteredData.reduce((acc: GroupedData, candidate: Candidate) => {
          const batch = candidate.batchname;
          if (!Array.isArray(acc[batch])) {
            acc[batch] = [];
          }
          acc[batch].push(candidate);
          return acc;
        }, {});

        const transformedRowData: TransformedCandidate[] = [];

        for (const batch in groupedData) {
          // Add candidate rows for the batch
          const candidates = groupedData[batch];
          candidates.forEach((candidate: Candidate) => {
            transformedRowData.push({
              ...candidate,
              batchname: '', // Clear batchname for candidate rows
             // Add the required isBatch property
            });
          });
        }
        // Only set Candidate objects in rowData
        setRowData(transformedRowData);

        setGroupedData(groupedData);

        // Setup columns based on filtered data
        setupColumns(filteredData);
      } else {
        setRowData([]); // Clear row data if no candidates are available
        setGroupedData({}); // Clear grouped data
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  interface ErrorResponse {
    message: string;
    // Add other properties if needed
}
  const fetchBatches = async (searchQuery = "") => {
    try {
      const response = await axios.get(`${API_URL}/candidates/search`, {
        params: {
          page: currentPage, // Pass current page for pagination
          pageSize: paginationPageSize, // Pass pageSize for pagination
          search: searchQuery, // Pass the search query to the backend
        },
        headers: { AuthToken: localStorage.getItem("token") },
      });

      const { data, totalRows } = response.data;
      setRowData(data); // Set the table data
      setTotalRows(totalRows); // Set the total rows for pagination
      setupColumns(data); // Optional: If needed for dynamic columns
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const setupColumns = (data: Candidate[]) => {
  if (data.length > 0) {
    const keys = Object.keys(data[0]);

    const columns = keys.map((key) => ({
      headerName: key.charAt(0).toUpperCase() + key.slice(1),
      field: key,
      editable: key === "batchname",
      cellEditor: key === "batchname" ? "agSelectCellEditor" : undefined,
      cellStyle: key === "batchname" ? { fontWeight: 'bold' } : {}, // Make batchname column bold
    }));

    const batchnameCol = {
      headerName: "Batch Name",
      field: "batchname",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: Array.from(new Set(data.map((candidate) => candidate.batchname))),
      },
      cellStyle: { fontWeight: 'bold' }, // Make batchname column bold
    };

    const filteredColumns = columns.filter(col => col.field !== "batchname");

    setColumnDefs([batchnameCol, ...filteredColumns]);
  }
};

  const handleSearch = () => {
    fetchBatches(searchValue); // Fetch data using the search term
  };
  const handleDownloadPDF = () => {
    // Create a new instance of jsPDF
    const doc = new jsPDF();

    // Add title text
    doc.text("Candidate Data", 10, 10);

    // Prepare data for PDF
    const pdfData = rowData.map((row) => Object.values(row));
    const headers = columnDefs.map((col) => col.headerName);

    // Create the autoTable
    autoTable(doc, {
        head: [headers],
        body: pdfData,
        theme: 'grid', // Optional: set the theme for the table
        styles: { fontSize: 5 }, // Optional: adjust font size
    });

    // Save the PDF
    doc.save("candidate_data.pdf");
  };

  const handleRefresh = () => {
    setSearchValue(""); // Clear search value before refreshing
    fetchData(); // Re-fetch data
    window.location.reload(); // Trigger page reload
  };

  const handleViewRow = () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        setSelectedRow(selectedRows[0]); // Set the selected row data
        setModalState((prevState) => ({ ...prevState, view: true })); // Open the view modal
      } 
      // else {
      //   // setAlertMessage("Please select a row to view."); // Set alert message
      //   setTimeout(() => setAlertMessage(null), 3000); // Clear alert message after 3 seconds
      // }
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handleAddRow = () =>
    setModalState((prevState) => ({ ...prevState, add: true }));

  const handleEditRow = () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        setSelectedRow(selectedRows[0]);
        setModalState((prevState) => ({ ...prevState, edit: true }));
       } 
       //else {
      //   setAlertMessage("Please select a row to edit."); // Set alert message
      //   setTimeout(() => setAlertMessage(null), 3000); // Clear alert message after 3 seconds
      // }
    }
  };

    const handleDeleteRow = async () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        const candidateid = selectedRows[0].name; // Assuming 'name' is the property for the candidate's name

        if (candidateid) {
          const confirmation = window.confirm(
            `Are you sure you want to delete candidate ${candidateid}?`
          );
          if (!confirmation) return;

          try {
            await axios.delete(`${API_URL}/candidates/delete/${candidateid}`, {
              headers: { AuthToken: localStorage.getItem("token") },
            });
            alert(`Candidate ${candidateid} deleted successfully.`);
            fetchData(); // Refresh data after delete
          } catch (error) {
            const axiosError = error as AxiosError;
            alert(
              `Failed to delete candidate: ${
                (axiosError.response?.data as ErrorResponse)?.message || axiosError.message
              }`
            );
          }
        } else {
          alert("No valid candidate name found for the selected row.");
        }
       } 
       //else {
      //   setAlertMessage("Please select a row to delete."); // Set alert message
      //   setTimeout(() => setAlertMessage(null), 3000); // Clear alert message after 3 seconds
      // }
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(totalRows / paginationPageSize);
  const startPage = Math.max(1, currentPage );
  const endPage = Math.min(totalPages, currentPage + 4);
  const pageOptions = Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage);

  return (
    <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md relative">
    {/* {alertMessage && ( // Conditional rendering of alert message
      <div className="fixed top-4 right-4 p-4 bg-blue-500 text-white rounded-md shadow-md z-50">
        {alertMessage}
      </div>
    )} */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Candidate Management</h1>

        </div>

        {/* Search Functionality */}
        <div className="flex flex-col md:flex-row mb-4 justify-between   items-center">
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
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md ml-2 transition duration-300 hover:bg-blue-900 text-xs md:text-base"
            >
              <AiOutlineSearch className="mr-1" /> Search
            </button>
          </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-end md:space-x-2 mb-4">
          <div className="flex flex-wrap space-x-2 mb-4 md:mb-0">

            <button
              onClick={handleAddRow}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700 text-xs md:text-base"
            >
              <MdAdd className="mr-2" />
            </button>
            <button
              onClick={handleEditRow}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700 text-xs md:text-base"
            >
              <AiOutlineEdit className="mr-1" />
            </button>
            <button
              onClick={handleViewRow}
              className="flex items-center px-3 py-2 bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-700 text-xs md:text-base"
            >
              <AiOutlineEye className="mr-1" />
            </button>
            <button
              onClick={handleDeleteRow}
              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700 text-xs md:text-base"
            >
              <MdDelete className="mr-1" />
            </button>
          </div>
          <div className="flex flex-wrap space-x-2 mb-4 md:mb-0">
            <button
              onClick={handleRefresh}
              className="flex items-center px-3 py-2 bg-gray-500 text-white rounded-md transition duration-300 hover:bg-gray-900 text-xs md:text-base"
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
        {<AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          pagination={false}
          domLayout="normal"
          rowSelection="multiple"
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            cellStyle: { color: "#333", fontSize: "0.75rem", padding: "1px" },
            minWidth: 80,
            maxWidth: 150,
          }}
          rowHeight={30}
          headerHeight={35}
          getRowStyle={() => ({
            paddingTop: "5px",
            backgroundColor: '#ffffff', // Different background for batch rows
            fontWeight: 'normal', // Bold text for batch rows
          })} // Set a taller height for batch rows
        />
         }

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
        onRequestClose={() => setModalState({ ...modalState, edit: false })}
        rowData={selectedRow} // Fixed the typo from 'Candidatecandidate' to 'Candidate'
        onSave={fetchData}

      />
      )}
      {modalState.view && selectedRow && (
        <ViewRowModal
        isOpen={modalState.view}
        onClose={() => setModalState((prev) => ({ ...prev, view: false }))}
        onRequestClose={() => setModalState((prev) => ({ ...prev, view: false }))}  // Pass the missing prop
        rowData={selectedRow}
      />
      )}
    </div>
  );
};

export default withAuth(Candidates);

























// "use client";
// import React, { useState, useEffect, useRef, useCallback } from "react";
// import axios from "axios";

// import "jspdf-autotable";
// import * as XLSX from "xlsx";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import  AddRowModal from "../../modals/candidate_modals/AddRowCandidate";
// import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
// import EditRowModal from "../../modals/candidate_modals/EditRowCandidate";
// import ViewRowModal from "../../modals/candidate_modals/ViewRowCandidate";
// import { MdDelete } from "react-icons/md";
// import { debounce } from "lodash";
// import jsPDF from "jspdf";
// import { faFilePdf, faFileExcel } from "@fortawesome/free-solid-svg-icons";
// import withAuth from "@/modals/withAuth";

// import {
//   AiOutlineEdit,
//   AiOutlineSearch,
//   AiOutlineReload,
//   AiOutlineEye,
// } from "react-icons/ai";
// import { MdAdd } from "react-icons/md";
// import { Candidate } from "../../types/index"; // Adjust the import path accordingly
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import ViewRowCandidate from "../../modals/candidate_modals/ViewRowCandidate";
// import EditRowCandidate from "../../modals/candidate_modals/EditRowCandidate";
// import AddRowCandidate from "../../modals/candidate_modals/AddRowCandidate";

// interface jsPDFPageData {
//   settings: {
//     margin: {
//       left: number;
//       right: number;
//       top: number;
//       bottom?: number; // Optional bottom margin if needed
//     };
//   };
// }

// const Candidates = () => {
//   const [rowData, setRowData] = useState<Candidate[]>([]);
//   const [columnDefs, setColumnDefs] = useState<
//     { headerName: string; field: string }[]
//   >([]);
//   const [paginationPageSize] = useState<number>(200);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [totalRows, setTotalRows] = useState<number>(0);
//   const [modalState, setModalState] = useState<{
//     add: boolean;
//     edit: boolean;
//     view: boolean;
//   }>({ add: false, edit: false, view: false });
//   const [alertMessage, setAlertMessage] = useState<string | null>(null); // Added state for alert message
//   const [selectedRow, setSelectedRow] = useState<Candidate | null>(null);
//   const [searchValue, setSearchValue] = useState<string>("");
//   const gridRef = useRef<AgGridReact>(null);

//   const API_URL = process.env.NEXT_PUBLIC_API_URL;

//   const fetchData = useCallback(
//     async (searchQuery = "", page = 1) => {
//       try {
//         const response = await axios.get(`${API_URL}/candidates/search`, {
//           params: {
//             page: page,
//             pageSize: paginationPageSize,
//             search: searchQuery,
//           },
//           headers: { AuthToken: localStorage.getItem("token") },
//         });

//         const { data, totalRows } = response.data;
//         setRowData(data);
//         setTotalRows(totalRows);
//         setupColumns(data);
//       } catch (error) {
//         console.error("Error loading data:", error);
//       }
//     },
//     [paginationPageSize, API_URL]
//   );

//   const debouncedFetchData = useCallback(
//     debounce((query: string) => {
//       fetchData(query, currentPage);
//     }, 300),
//     [fetchData, currentPage]
//   );

//   useEffect(() => {
//     if (searchValue) {
//       debouncedFetchData(searchValue);
//     }
//     return () => {
//       debouncedFetchData.cancel();
//     };
//   }, [searchValue, debouncedFetchData]);

//   useEffect(() => {
//     if (!searchValue) {
//       fetchData("", currentPage);
//     }
//   }, [currentPage, fetchData, searchValue]);

//   const setupColumns = (data: Candidate[]) => {
//     if (data.length > 0) {
//       const keys = Object.keys(data[0]);
//       const columns = keys.map((key) => ({
//         headerName: key.charAt(0).toUpperCase() + key.slice(1),
//         field: key,
//       }));
//       setColumnDefs(columns);
//     }
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

//   const handleDeleteRow = async () => {
//     if (gridRef.current) {
//       const selectedRows = gridRef.current.api.getSelectedRows();
//       if (selectedRows.length > 0) {
//         const candidateId = selectedRows[0].candidateid;
//         if (candidateId) {
//           const confirmation = window.confirm(
//             `Are you sure you want to delete candidate ID ${candidateId}?`
//           );
//           if (!confirmation) return;

//           try {
//             await axios.delete(`${API_URL}/candidates/delete/${candidateId}`, {
//               headers: { AuthToken: localStorage.getItem("token") },
//             });
//             alert("Candidate deleted successfully.");
//             fetchData(searchValue);
//           } catch (error) {
//             console.error("Error deleting candidate:", error);
//             alert(
//               `Failed to delete candidate: ${
//                 (error as Error).message || "Unknown error occurred"
//               }`
//             );
//           }
//         } else {
//           alert("No valid candidate ID found for the selected row.");
//         }
//       } else {
//         setAlertMessage("Please select a row to delete."); // Set alert message
//         setTimeout(() => setAlertMessage(null), 3000); // Clear alert message after 3 seconds
//       }
//     }
//   };

//   const handleRefresh = () => {
//     setSearchValue("");
//     fetchData();
//     window.location.reload();
//   };

//   const handlePageChange = (newPage: number) => {
//     setCurrentPage(newPage);
//   };

//   const handleDownloadPDF = () => {
//     if (gridRef.current) {
//       const selectedRows = gridRef.current.api.getSelectedRows();
//       if (selectedRows.length === 1) { // Ensure only one row is selected
//         const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

//         // Add Title
//         doc.text("Selected Candidate Data", 15, 10);

//         // Prepare the data for the table
//         const row = selectedRows[0]; // Get the single selected row
//         const pdfData = [
//           {
//             Name: row.name,
//             EnrolledDate: row.enrolleddate,
//             Email: row.email,
//             Course: row.course,
//             Phone: row.phone,
//             Status: row.status,
//             WorkStatus: row.workstatus,
//             Education: row.education,
//             WorkExperience: row.workexperience,
//             SSN: row.ssn,
//             Agreement: row.agreement,
//             Promissory: row.promissory,
//             DriversLicense: row.driverslicense,
//             WorkPermit: row.workpermit,
//             WPExpirationDate: row.wpexpirationdate,
//             OfferLetter: row.offerletter,
//             SecondaryEmail: row.secondaryemail,
//             SecondaryPhone: row.secondaryphone,
//             Address: row.address,
//             City: row.city,
//             State: row.state,
//             Country: row.country,
//             Zip: row.zip,
//             LinkedIn: row.linkedin,
//             DOB: row.dob,
//             EmergContactName: row.emergcontactname,
//             EmergContactEmail: row.emergcontactemail,
//             EmergContactPhone: row.emergcontactphone,
//             EmergContactAddrs: row.emergcontactaddrs,
//             Guidelines: row.guidelines,
//             SSNValidated: row.ssnvalidated,
//             BGV: row.bgv,
//             Term: row.term,
//             FeePaid: row.feepaid,
//             FeeDue: row.feedue,
//             Salary0: row.salary0,
//             Salary6: row.salary6,
//             Salary12: row.salary12,
//             GuarantorName: row.guarantorname,
//             GuarantorDesignation: row.guarantordesignation,
//             GuarantorCompany: row.guarantorcompany,
//             ContractURL: row.contracturl,
//             EmpAgreementURL: row.empagreementurl,
//             OfferLetterURL: row.offerletterurl,
//             DLURL: row.dlurl,
//             WorkPermitURL: row.workpermiturl,
//             SSNURL: row.ssnurl,
//             ReferralID: row.referralid,
//             PortalID: row.portalid,
//             AvatarID: row.avatarid,
//             Notes: row.notes,
//             BatchName: row.batchname,
//             CoverLetter: row.coverletter,
//             Background: row.background,
//             RecruiterAssesment: row.recruiterassesment,
//             InstructorAssesment: row.instructorassesment,
//             ProcessFlag: row.processflag,
//             DefaultProcessFlag: row.defaultprocessflag,
//             OriginalResume: row.originalresume,
//             LastModDateTime: row.lastmoddatetime,
//             StatusChangeDate: row.statuschangedate,
//             DiceFlag: row.diceflag,
//             BatchID: row.batchid,
//             EmailList: row.emaillist,
//           },
//         ];

//         // Add autoTable with adjusted styling
//         (doc as unknown as { autoTable: (options: unknown) => void }).autoTable({
//           head: [
//             [
//               "Name",
//               "EnrolledDate",
//               "Email",
//               "Course",
//               "Phone",
//               "Status",
//               "WorkStatus",
//               "Education",
//               "WorkExperience",
//               "SSN",
//               "Agreement",
//               "Promissory",
//               "DriversLicense",
//               "WorkPermit",
//               "WPExpirationDate",
//               "OfferLetter",
//               "SecondaryEmail",
//               "SecondaryPhone",
//               "Address",
//               "City",
//               "State",
//               "Country",
//               "Zip",
//               "LinkedIn",
//               "DOB",
//               "EmergContactName",
//               "EmergContactEmail",
//               "EmergContactPhone",
//               "EmergContactAddrs",
//               "Guidelines",
//               "SSNValidated",
//               "BGV",
//               "Term",
//               "FeePaid",
//               "FeeDue",
//               "Salary0",
//               "Salary6",
//               "Salary12",
//               "GuarantorName",
//               "GuarantorDesignation",
//               "GuarantorCompany",
//               "ContractURL",
//               "EmpAgreementURL",
//               "OfferLetterURL",
//               "DLURL",
//               "WorkPermitURL",
//               "SSNURL",
//               "ReferralID",
//               "PortalID",
//               "AvatarID",
//               "Notes",
//               "BatchName",
//               "CoverLetter",
//               "Background",
//               "RecruiterAssesment",
//               "InstructorAssesment",
//               "ProcessFlag",
//               "DefaultProcessFlag",
//               "OriginalResume",
//               "LastModDateTime",
//               "StatusChangeDate",
//               "DiceFlag",
//               "BatchID",
//               "EmailList",
//             ],
//           ],
//           body: pdfData.map((data) => Object.values(data)), // Convert object to array for table body
//           styles: {
//             fontSize: 8, // Slightly smaller font
//             cellPadding: 4, // Add padding for readability
//             overflow: 'linebreak', // Allow line breaks in cells
//           },
//           columnStyles: {
//             0: { cellWidth: 15 }, // Name
//             1: { cellWidth: 20 }, // EnrolledDate
//             2: { cellWidth: 25 }, // Email
//             3: { cellWidth: 20 }, // Course
//             4: { cellWidth: 20 }, // Phone
//             5: { cellWidth: 20 }, // Status
//             6: { cellWidth: 20 }, // WorkStatus
//             7: { cellWidth: 20 }, // Education
//             8: { cellWidth: 20 }, // WorkExperience
//             9: { cellWidth: 20 }, // SSN
//             10: { cellWidth: 20 }, // Agreement
//             11: { cellWidth: 20 }, // Promissory
//             12: { cellWidth: 20 }, // DriversLicense
//             13: { cellWidth: 20 }, // WorkPermit
//             14: { cellWidth: 20 }, // WPExpirationDate
//             15: { cellWidth: 20 }, // OfferLetter
//             16: { cellWidth: 25 }, // SecondaryEmail
//             17: { cellWidth: 20 }, // SecondaryPhone
//             18: { cellWidth: 30 }, // Address
//             19: { cellWidth: 20 }, // City
//             20: { cellWidth: 20 }, // State
//             21: { cellWidth: 20 }, // Country
//             22: { cellWidth: 15 }, // Zip
//             23: { cellWidth: 20 }, // LinkedIn
//             24: { cellWidth: 20 }, // DOB
//             25: { cellWidth: 25 }, // EmergContactName
//             26: { cellWidth: 25 }, // EmergContactEmail
//             27: { cellWidth: 25 }, // EmergContactPhone
//             28: { cellWidth: 30 }, // EmergContactAddrs
//             29: { cellWidth: 20 }, // Guidelines
//             30: { cellWidth: 20 }, // SSNValidated
//             31: { cellWidth: 20 }, // BGV
//             32: { cellWidth: 20 }, // Term
//             33: { cellWidth: 20 }, // FeePaid
//             34: { cellWidth: 20 }, // FeeDue
//             35: { cellWidth: 20 }, // Salary0
//             36: { cellWidth: 20 }, // Salary6
//             37: { cellWidth: 20 }, // Salary12
//             38: { cellWidth: 30 }, // GuarantorName
//             39: { cellWidth: 30 }, // GuarantorDesignation
//             40: { cellWidth: 30 }, // GuarantorCompany
//             41: { cellWidth: 25 }, // ContractURL
//             42: { cellWidth: 25 }, // EmpAgreementURL
//             43: { cellWidth: 25 }, // OfferLetterURL
//             44: { cellWidth: 25 }, // DLURL
//             45: { cellWidth: 25 }, // WorkPermitURL
//             46: { cellWidth: 25 }, // SSNURL
//             47: { cellWidth: 20 }, // ReferralID
//             48: { cellWidth: 20 }, // PortalID
//             49: { cellWidth: 20 }, // AvatarID
//             50: { cellWidth: 40 }, // Notes
//             51: { cellWidth: 20 }, // BatchName
//             52: { cellWidth: 40 }, // CoverLetter
//             53: { cellWidth: 40 }, // Background
//             54: { cellWidth: 40 }, // RecruiterAssesment
//             55: { cellWidth: 40 }, // InstructorAssesment
//             56: { cellWidth: 20 }, // ProcessFlag
//             57: { cellWidth: 20 }, // DefaultProcessFlag
//             58: { cellWidth: 30 }, // OriginalResume
//             59: { cellWidth: 25 }, // LastModDateTime
//             60: { cellWidth: 25 }, // StatusChangeDate
//             61: { cellWidth: 20 }, // DiceFlag
//             62: { cellWidth: 20 }, // BatchID
//             63: { cellWidth: 20 }, // EmailList
//           },
//           margin: { top: 15, left: 15, right: 15 }, // Adjust margins for better fit
//           pageBreak: "avoid", // Prevent page breaks
//           didDrawPage: function (data: jsPDFPageData) { // Specify the type for data
//             doc.setFontSize(10);
//             doc.text(
//               "Page " + doc.internal.pages.length,
//               data.settings.margin.left,
//               data.settings.margin.top + 10 // Adjust position for page number
//             );
//           },
//         });

//         // Save the PDF
//         doc.save("Selected_Candidate_data.pdf");
//       } else {
//         alert("Please select exactly one row to download.");
//       }
//     }
//   };

//   const handleSearch = () => {
//     fetchData(searchValue);
//   };

//   const handleExportToExcel = () => {
//     if (gridRef.current) {
//       const selectedRows = gridRef.current.api.getSelectedRows() as Candidate[];
//       if (selectedRows.length > 0) {
//         const ws = XLSX.utils.json_to_sheet(selectedRows);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, "Selected Candidate Data");
//         XLSX.writeFile(wb, "Selected_Candidate_data.xlsx");
//       } else {
//         alert("Please select a row to export.");
//       }
//     }
//   };

//   const totalPages = Math.ceil(totalRows / paginationPageSize);
//   const startPage = Math.max(1, currentPage );
//   const endPage = Math.min(totalPages, currentPage + 4);
//   const pageOptions = Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage);

//   return (
//     <div className="relative">
//       {alertMessage && ( // Conditional rendering of alert message
//         <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded-md shadow-md z-50">
//           {alertMessage}
//         </div>
//       )}
//       <div className="p-4 mt-20 mb-10 mx-auto bg-gray-100 rounded-lg shadow-md relative max-w-7xl">
//         <div className="flex flex-col md:flex-row justify-between items-center mb-4">
//           <h1 className="text-3xl font-bold text-gray-800">Candidates Management</h1>
//         </div>

//         <div className="flex flex-col md:flex-row mb-4 justify-between   items-center">
//           <div className="flex w-full md:w-auto mb-2 md:mb-0">
//             <input
//               type="text"
//               placeholder="Search..."
//               value={searchValue}
//               onChange={(e) => setSearchValue(e.target.value)}
//               className="border border-gray-300 rounded-md p-2 w-64"
//             />
//             <button
//               onClick={handleSearch}
//               className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md ml-2 transition duration-300 hover:bg-blue-900 text-xs md:text-base"
//             >
//               <AiOutlineSearch className="mr-1" /> Search
//             </button>
//           </div>

//           <div className="flex flex-col md:flex-row md:items-center md:justify-end md:space-x-2 mb-4">
//             <div className="flex flex-wrap space-x-2 mb-4 md:mb-0">
//               <button
//                 onClick={handleAddRow}
//                 className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700 text-xs md:text-base"
//               >
//                 <MdAdd className="mr-2" />
//               </button>
//               <button
//                 onClick={handleEditRow}
//                 className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700 text-xs md:text-base"
//               >
//                 <AiOutlineEdit className="mr-1" />
//               </button>
//               <button
//                 onClick={handleViewRow}
//                 className="flex items-center px-3 py-2 bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-700 text-xs md:text-base"
//               >
//                 <AiOutlineEye className="mr-1" />
//               </button>
//               <button
//                 onClick={handleDeleteRow}
//                 className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700 text-xs md:text-base"
//               >
//                 <MdDelete className="mr-1" />
//               </button>
//             </div>
//             <div className="flex flex-wrap space-x-2 mb-4 md:mb-0">
//               <button
//                 onClick={handleRefresh}
//                 className="flex items-center px-3 py-2 bg-gray-500 text-white rounded-md transition duration-300 hover:bg-gray-900 text-xs md:text-base"
//               >
//                 <AiOutlineReload className="mr-1" />
//               </button>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={handleDownloadPDF}
//                   className="flex items-center p-2 bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700"
//                 >
//                   <FontAwesomeIcon icon={faFilePdf} className="text-lg" />
//                 </button>
//                 <button
//                   onClick={handleExportToExcel}
//                   className="flex items-center p-2 bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700"
//                 >
//                   <FontAwesomeIcon icon={faFileExcel} className="text-lg" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="ag-theme-alpine" style={{ height: "370px", width: "100%", overflowY: "visible", overflowX: 'visible'  }}>
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
//               resizable: true,
//               cellStyle: { color: "#333", fontSize: "0.75rem", padding: "1px" },
//               minWidth: 80,
//               maxWidth: 150,
//             }}
//             rowHeight={30}
//             headerHeight={35}
//           />
//         </div>
//         <div className="flex flex-col md:flex-row justify-between items-center mt-4">
//           <div className="flex items-center justify-center w-full md:w-auto overflow-x-auto">
//             {/* Pagination Buttons */}
//             <div className="flex space-x-1 overflow-x-auto">
//               <button
//                 onClick={() => handlePageChange(1)}
//                 disabled={currentPage === 1}
//                 className="p-2 disabled:opacity-50"
//               >
//                 <FaAngleDoubleLeft />
//               </button>
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="p-2 disabled:opacity-50"
//               >
//                 <FaChevronLeft />
//               </button>
//               {pageOptions.map((page) => (
//                 <button
//                   key={page}
//                   onClick={() => handlePageChange(page)}
//                   className={`px-2 py-1 rounded-md ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
//                 >
//                   {page}
//                 </button>
//               ))}
//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="p-2 disabled:opacity-50"
//               >
//                 <FaChevronRight />
//               </button>
//               <button
//                 onClick={() => handlePageChange(totalPages)}
//                 disabled={currentPage === totalPages}
//                 className="p-2 disabled:opacity-50"
//               >
//                 <FaAngleDoubleRight />
//               </button>
//             </div>
//           </div>
//         </div>
//         <AddRowCandidate
//           isOpen={modalState.add}
//           onRequestClose={() => setModalState({ ...modalState, add: false })}
//           onSave={fetchData}
//         />
//         <EditRowCandidate
//           isOpen={modalState.edit}
//           onRequestClose={() => setModalState({ ...modalState, edit: false })}
//           rowData={selectedRow}
//           onSave={fetchData}
//         />
//         <ViewRowCandidate
//           isOpen={modalState.view}
//           onRequestClose={() => setModalState({ ...modalState, view: false })}
//           rowData={selectedRow}
//         />
//       </div>
//     </div>
//   );
// }

// export default withAuth(Candidates);

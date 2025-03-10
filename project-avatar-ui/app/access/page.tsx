// // avatar/wbl_admin/app/access/page.tsx

// "use client";
// import React, { useState, useEffect, useRef, useCallback } from "react";
// import axios from "axios";
// import "react-dropdown/style.css";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import EditRowModal from "../../modals/Access/EditRowUser";
// import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
// import ViewRowModal from "../../modals/access_modals/ViewRowUser";
// import { debounce } from "lodash";
// import withAuth from "@/modals/withAuth";
// import { AiOutlineEdit, AiOutlineSearch, AiOutlineReload, AiOutlineEye } from "react-icons/ai";
// import { User } from "../../types/index";

// const Users = () => {
//   const [rowData, setRowData] = useState<User[]>([]);
//   const [columnDefs, setColumnDefs] = useState<{ headerName: string; field: string }[]>([]);
//   const [paginationPageSize] = useState<number>(200);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [totalRows, setTotalRows] = useState<number>(0);
//   const [modalState, setModalState] = useState<{ add: boolean; edit: boolean; view: boolean }>({ add: false, edit: false, view: false });
//   const [selectedRow, setSelectedRow] = useState<User | null>(null);
//   const [searchValue, setSearchValue] = useState<string>("");
//   const [, setAlertMessage] = useState<string | null>(null);
//   const gridRef = useRef<AgGridReact>(null);

//   const API_URL = process.env.NEXT_PUBLIC_API_URL;

//   const fetchData = useCallback(async (searchQuery = "", page = 1) => {
//     try {
//       const response = await axios.get(`${API_URL}/app/admin/authuser`, {
//         params: {
//           page: page,
//           pageSize: paginationPageSize,
//           search: searchQuery,
//         },
//         headers: { AuthToken: localStorage.getItem("token") },
//       });

//       const { data, totalRows } = response.data;
//       const dataWithSerials = data.map((item: User) => ({
//         ...item,
//       }));
//       setRowData(dataWithSerials);
//       setTotalRows(totalRows);
//       setupColumns(dataWithSerials);
//     } catch (error) {
//       console.error("Error loading data:", error);
//     }
//   }, [paginationPageSize, API_URL, currentPage]);

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

//   const setupColumns = (data: User[]) => {
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

//   const handleRefresh = () => {
//     setSearchValue("");
//     fetchData();
//     window.location.reload();
//   };

//   const handlePageChange = (newPage: number) => {
//     setCurrentPage(newPage);
//   };

//   const handleSearch = () => {
//     fetchData(searchValue);
//   };

//   const totalPages = Math.ceil(totalRows / paginationPageSize);
//   const startPage = Math.max(1, currentPage );
//   const endPage = Math.min(totalPages, currentPage + 4);
//   const pageOptions = Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage);

//   return (
//     <div className="relative">
//       <div className="p-4 mt-10 mb-4 mx-auto bg-gray-100 rounded-lg shadow-md relative max-w-7xl"> 
//         {/* // Adjusted padding and margins */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-4"> 
//           {/* // Increased margin bottom for spacing */}
//           <h1 className="text-3xl font-bold text-gray-800" style={{ marginTop: '3.5rem' }}>Access Management</h1> 
//           {/* // Added margin bottom for spacing */}
//         </div>

//         <div className="flex flex-col md:flex-row mb-4 justify-between   items-center">
//           {/* // Increased margin bottom for spacing */}
//           <div className="flex flex-wrap w-full space-x-2 mb-2 md:mb-0">
//             {/* // Adjusted margin bottom */}
//             <div className="flex grow">
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 value={searchValue}
//                 onChange={(e) => setSearchValue(e.target.value)}
//                 className="border border-gray-300 rounded-md p-1 w-full md:w-64 text-xs md:text-sm" // Adjusted padding and font size
//               />
//               <button
//                 onClick={handleSearch}
//                 className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md ml-2 transition duration-300 hover:bg-blue-900 text-xs md:text-sm" // Adjusted padding and font size
//               >
//                 <AiOutlineSearch className="mr-1" /> Search
//               </button>
//             </div>
//             <button
//               onClick={handleEditRow}
//               className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700 text-xs md:text-sm" // Adjusted padding and font size
//             >
//               <AiOutlineEdit className="mr-1" /> 
//             </button>  
//             <button
//               onClick={handleViewRow}
//               className="flex items-center px-3 py-2 bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-700 text-xs md:text-sm" // Adjusted padding and font size
//             >
//               <AiOutlineEye className="mr-1" /> 
//             </button>
//             <button
//               onClick={handleRefresh}
//               className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-md transition duration-300 hover:bg-gray-700 text-xs md:text-sm" // Adjusted padding and font size
//             >
//               <AiOutlineReload className="mr-1" /> 
//             </button>
//           </div>
//         </div>

//         <div
//           className="ag-theme-alpine bg-white shadow-lg rounded-lg" // Added background and shadow for the table
//           style={{ height: "370px", width: "100%", overflowY: 'visible', overflowX: 'visible' }}
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
//               resizable: true,
//               cellStyle: { color: "#333", fontSize: "0.75rem", padding: "1px" },
//               minWidth: 80,
//               maxWidth: 150,
//             }}
//             rowHeight={30}
//             headerHeight={35} // Adjusted header height for better fit
//           />
//         </div>

//         <div className="flex flex-col md:flex-row justify-between items-center mt-4"> 
//           {/* // Increased margin top for spacing */}
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

//         <EditRowModal
//           isOpen={modalState.edit}
//           onRequestClose={() => setModalState({ ...modalState, edit: false })}
//           rowData={selectedRow}
//           onSave={fetchData}
//         />
//         <ViewRowModal
//           isOpen={modalState.view}
//           onRequestClose={() => setModalState({ ...modalState, view: false })}
//           rowData={selectedRow}
//         />
//       </div>
//     </div>
//   );

// };

// export default withAuth(Users);


"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "react-dropdown/style.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import EditRowModal from "../../modals/Access/EditRowUser";
import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import ViewRowModal from "../../modals/access_modals/ViewRowUser";
import { debounce } from "lodash";
import withAuth from "@/modals/withAuth";
import { AiOutlineEdit, AiOutlineSearch, AiOutlineReload, AiOutlineEye } from "react-icons/ai";
import { User } from "../../types/index";

const Users = () => {
  const [rowData, setRowData] = useState<User[]>([]);
  const [columnDefs, setColumnDefs] = useState<{ headerName: string; field: string }[]>([]);
  const [paginationPageSize] = useState<number>(200);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [modalState, setModalState] = useState<{ add: boolean; edit: boolean; view: boolean }>({ add: false, edit: false, view: false });
  const [selectedRow, setSelectedRow] = useState<User | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [, setAlertMessage] = useState<string | null>(null);
  const gridRef = useRef<AgGridReact>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"; // Update this if needed
  const fetchData = useCallback(async (searchQuery = "", page = 1) => {
    try {
      const response = await axios.get(`${API_URL}/access/authuser`, {
        params: {
          page: page,
          pageSize: paginationPageSize,
          search: searchQuery,
        },
        headers: { AuthToken: localStorage.getItem("token") },
      });
  
      // Assume the response is directly the array of data
      const data = response.data;
      const totalRows = data.length; // Assuming totalRows is the length of the data array
      console.log("API Response Data:", data); // Log the API response data
      const dataWithSerials = data.map((item: User) => ({
        ...item,
      }));
      console.log("Processed Row Data:", dataWithSerials); // Log the processed row data
      setRowData(dataWithSerials);
      setTotalRows(totalRows);
      setupColumns(dataWithSerials);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }, [paginationPageSize, API_URL, currentPage]);
  
  const debouncedFetchData = useCallback(
    debounce((query: string) => {
      fetchData(query, currentPage);
    }, 300),
    [fetchData, currentPage]
  );

  useEffect(() => {
    if (searchValue) {
      debouncedFetchData(searchValue);
    }
    return () => {
      debouncedFetchData.cancel();
    };
  }, [searchValue, debouncedFetchData]);

  useEffect(() => {
    if (!searchValue) {
      fetchData("", currentPage);
    }
  }, [currentPage, fetchData, searchValue]);

  const setupColumns = (data: User[]) => {
    if (Array.isArray(data) && data.length > 0) {
      const columns = [
        ...Object.keys(data[0]).map((key) => ({
          headerName: key.charAt(0).toUpperCase() + key.slice(1),
          field: key,
        })),
      ];
      console.log("Column Definitions:", columns); // Log the column definitions
      setColumnDefs(columns);
    } else {
      console.error("Data is not an array or is empty:", data);
    }
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

  const handleRefresh = () => {
    setSearchValue("");
    fetchData();
    window.location.reload();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearch = () => {
    fetchData(searchValue);
  };

  const totalPages = Math.ceil(totalRows / paginationPageSize);
  const startPage = Math.max(1, currentPage );
  const endPage = Math.min(totalPages, currentPage + 4);
  const pageOptions = Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage);

  return (
    <div className="relative">
      <div className="p-4 mt-10 mb-4 mx-auto bg-gray-100 rounded-lg shadow-md relative max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800" style={{ marginTop: '3.5rem' }}>Access Management</h1>
        </div>

        <div className="flex flex-col md:flex-row mb-4 justify-between   items-center">
          <div className="flex flex-wrap w-full space-x-2 mb-2 md:mb-0">
            <div className="flex grow">
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="border border-gray-300 rounded-md p-1 w-full md:w-64 text-xs md:text-sm"
              />
              <button
                onClick={handleSearch}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md ml-2 transition duration-300 hover:bg-blue-900 text-xs md:text-sm"
              >
                <AiOutlineSearch className="mr-1" /> Search
              </button>
            </div>
            <button
              onClick={handleEditRow}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700 text-xs md:text-sm"
            >
              <AiOutlineEdit className="mr-1" />
            </button>
            <button
              onClick={handleViewRow}
              className="flex items-center px-3 py-2 bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-700 text-xs md:text-sm"
            >
              <AiOutlineEye className="mr-1" />
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-md transition duration-300 hover:bg-gray-700 text-xs md:text-sm"
            >
              <AiOutlineReload className="mr-1" />
            </button>
          </div>
        </div>

        <div
          className="ag-theme-alpine bg-white shadow-lg rounded-lg"
          style={{ height: "370px", width: "100%", overflowY: 'visible', overflowX: 'visible' }}
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
              resizable: true,
              cellStyle: { color: "#333", fontSize: "0.75rem", padding: "1px" },
              minWidth: 80,
              maxWidth: 150,
            }}
            rowHeight={30}
            headerHeight={35}
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-4">
          <div className="flex items-center justify-center w-full md:w-auto overflow-x-auto">
            <div className="flex space-x-1 overflow-x-auto">
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

        <EditRowModal
          isOpen={modalState.edit}
          onRequestClose={() => setModalState({ ...modalState, edit: false })}
          rowData={selectedRow}
          onSave={fetchData}
        />
        <ViewRowModal
          isOpen={modalState.view}
          onRequestClose={() => setModalState({ ...modalState, view: false })}
          rowData={selectedRow}
        />
      </div>
    </div>
  );

};

export default withAuth(Users);

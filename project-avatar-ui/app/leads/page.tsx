"use client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import AddRowModal from "@/modals/Leads/AddRowModal";
import EditRowModal from "@/modals/Leads/EditRowModal";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ViewRowModal from "@/modals/Leads/ViewRowModal";
import axios from "axios";
import debounce from "lodash/debounce";
import jsPDF from "jspdf";
import withAuth from "@/modals/withAuth";
import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdAdd } from "react-icons/md";
import { Lead } from "@/types/index";

import {
  AiOutlineEdit,
  AiOutlineSearch,
  AiOutlineReload,
  AiOutlineEye,
} from "react-icons/ai";

interface CellRendererParams extends ICellRendererParams {
  value: string | null;
}

interface ColumnConfig extends ColDef {
  headerName: string;
  field: string;
  width?: number;
  editable?: boolean;
  frozen?: boolean;
  hide?: boolean;
  cellRenderer?: (params: CellRendererParams) => string;
}

interface ModalState {
  add: boolean;
  edit: boolean;
  view: boolean;
}

interface AutoTableData {
  settings: {
    margin: {
      left: number;
      right: number;
      top: number;
      bottom?: number;
    };
  };
}

interface CachedPageData {
  data: Lead[];
  totalRows: number;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-4">{message}</h3>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const Leads = () => {
  const [rowData, setRowData] = useState<Lead[]>([]);
  const [columnDefs, setColumnDefs] = useState<ColumnConfig[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [modalState, setModalState] = useState<{
    add: boolean;
    edit: boolean;
    view: boolean;
  }>({ add: false, edit: false, view: false });
  const [alertMessage,] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<Lead | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const gridRef = useRef<AgGridReact>(null);
  const cachedPages = useRef<Map<number, CachedPageData>>(new Map());
  const [notificationModal, setNotificationModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: "" });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const pageSize = 100;

  const fetchData = useCallback(
    async (page = 1, useCache = true) => {
      if (useCache && cachedPages.current.has(page)) {
        const cachedData = cachedPages.current.get(page)!;
        setRowData(cachedData.data);
        setTotalRows(cachedData.totalRows);
        setupColumns(cachedData.data);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/leads`, {
          params: {
            page: page,
            page_size: pageSize,
          },
          headers: { AuthToken: localStorage.getItem("token") },
        });

        const { data, totalRows } = response.data;
        setRowData(data);
        setTotalRows(totalRows);
        setupColumns(data);
        
        cachedPages.current.set(page, { data, totalRows });
      } catch (error) {
        console.error("Error loading data:", error);
      }
    },
    [API_URL, pageSize]
  );

  const searchLeads = useCallback(
    async (name: string) => {
      if (!name.trim()) {
        setIsSearching(false);
        fetchData(currentPage, true);
        return;
      }
      
      try {
        setIsSearching(true);
        const response = await axios.get(`${API_URL}/leads/search/`, {
          params: {
            name: name,
          },
          headers: { AuthToken: localStorage.getItem("token") },
        });

        setRowData(response.data);
        setTotalRows(response.data.length);
        setupColumns(response.data);
      } catch (error) {
        console.error("Error searching leads:", error);
        showNotification("Error searching leads. Please try again.");
      }
    },
    [API_URL, currentPage, fetchData]
  );

  // Create a debounced version of the search function
  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      searchLeads(searchTerm);
    }, 500),
    [searchLeads]
  );

  useEffect(() => {
    if (searchValue.trim()) {
      debouncedSearch(searchValue);
    } else if (isSearching) {
      setIsSearching(false);
      fetchData(currentPage, true); 
    } else {
      fetchData(currentPage);
    }
    
    
    return () => {
      debouncedSearch.cancel();
    };
  }, [currentPage, fetchData, searchValue, debouncedSearch, isSearching]);

  const setupColumns = (data: Lead[]) => {
    if (data.length > 0) {
      const keys = Object.keys(data[0]);
      
      // Create a row number column first
      const columns: ColumnConfig[] = [
        {
          headerName: '',
          field: 'rowNumber',
          width: 70,
          cellRenderer: (params: ICellRendererParams) => {
            // Calculate the row number based on the current page and row index
            const rowIndex = params.node?.rowIndex || 0;
            const rowNumber = (currentPage - 1) * pageSize + rowIndex + 1;
            return rowNumber.toString();
          }
        },
        // Then add all other columns
        ...keys.map((key) => ({
          headerName: key.charAt(0).toUpperCase() + key.slice(1),
          field: key,
        }))
      ];
      
      setColumnDefs(columns);
    }
  };
  
  const handleSearch = () => {
    if (searchValue.trim()) {
      searchLeads(searchValue);
    } else {
      setIsSearching(false);
      fetchData(currentPage, true); 
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    
    if (!value.trim()) {
      setIsSearching(false);
      fetchData(currentPage, true);
    }
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
        showNotification("Please select a row to edit.");
      }
    }
  };

  const handleViewRow = () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        setSelectedRow(selectedRows[0]);
        setModalState((prevState: ModalState) => ({ ...prevState, view: true }));
      } else {
        showNotification("Please select a row to view.");
      }
    }
  };

  const showNotification = (message: string) => {
    setNotificationModal({
      isOpen: true,
      message: message
    });
  };

  const closeNotificationModal = () => {
    setNotificationModal({
      isOpen: false,
      message: ""
    });
  };

  const handleDeleteRow = async () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        const leadId = selectedRows[0].leadid;
        if (leadId) {
          const confirmation = window.confirm(
            `Are you sure you want to delete lead ID ${leadId}?`
          );
          if (!confirmation) return;

          try {
            await axios.delete(`${API_URL}/leads/delete/${leadId}`, {
              headers: { AuthToken: localStorage.getItem("token") },
            });
            showNotification("Lead deleted successfully.");
            // Clear cache after modification
            cachedPages.current.clear();
            fetchData(currentPage, false);
          } catch (error) {
            console.error("Error deleting lead:", error);
            showNotification(
              `Failed to delete lead: ${
                (error as Error).message || "Unknown error occurred"
              }`
            );
          }
        }
      } else {
        showNotification("Please select a row to delete.");
      }
    }
  };

  const handleRefresh = () => {
    setSearchValue("");
    setIsSearching(false);
    cachedPages.current.clear();
    fetchData(currentPage, false);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

const handleDownloadPDF = () => {
  if (gridRef.current) {
    const selectedRows = gridRef.current.api.getSelectedRows();
    if (selectedRows.length === 1) {
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      doc.text("Selected Lead Data", 15, 10);

      const row = selectedRows[0];
      const pdfData = [
        {
          Name: row.name,
          Email: row.email,
          Phone: row.phone,
          Address: row.address,
          City: row.city,
          State: row.state,
          Country: row.country,
          Zip: row.zip,
          Course: row.course,
          Status: row.status,
          "Spouse Name": row.spousename,
          "Spouse Email": row.spouseemail,
          "Spouse Phone": row.spousephone,
          FAQ: row.faq,
          "Calls Made": row.callsmade,
          "Close Date": row.closedate,
          Notes: row.notes,
        },
      ];

      doc.autoTable(doc, {
        head: [
          [
            "Name", "Email", "Phone", "Address", "City", "State", "Country", 
            "Zip", "Course", "Status", "Spouse Name", "Spouse Email", 
            "Spouse Phone", "FAQ", "Calls Made", "Close Date", "Notes"
          ],
        ],
        body: pdfData.map((data) => Object.values(data)),
        styles: {
          fontSize: 8,
          cellPadding: 4,
          overflow: 'linebreak',
        },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 25 },
          2: { cellWidth: 20 },
          3: { cellWidth: 30 },
          4: { cellWidth: 20 },
          5: { cellWidth: 20 },
          6: { cellWidth: 20 },
          7: { cellWidth: 15 },
          8: { cellWidth: 20 },
          9: { cellWidth: 20 },
          10: { cellWidth: 25 },
          11: { cellWidth: 25 },
          12: { cellWidth: 20 },
          13: { cellWidth: 20 },
          14: { cellWidth: 20 },
          15: { cellWidth: 20 },
          16: { cellWidth: 40 },
        },
        margin: { top: 15, left: 15, right: 15 },
        pageBreak: "avoid",
        didDrawPage: function (data: AutoTableData) {
          doc.setFontSize(10);
          doc.text(
            "Page " + doc.internal.pages.length,
            data.settings.margin.left,
            data.settings.margin.top + 10
          );
        },
      });

      doc.save("Selected_Lead_data.pdf");
    } else {
      showNotification("Please select exactly one row to download.");
    }
  }
};


  const handleExportToExcel = () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        const ws = XLSX.utils.json_to_sheet(selectedRows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Selected Lead Data");
        XLSX.writeFile(wb, "Selected_Lead_data.xlsx");
      } else {
        showNotification("Please select a row to export.");
      }
    }
  };

  const totalPages = Math.ceil(totalRows / pageSize);
  const startPage = Math.max(1, currentPage);
  const endPage = Math.min(totalPages, currentPage + 4);
  const pageOptions = Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage);

  // Function to handle successful lead addition
  const handleLeadAdded = (newLead: Lead) => {
    // Update the grid with the new lead data
    setRowData(prevData => [newLead, ...prevData]);
    
    // Clear cache to ensure fresh data on next fetch
    cachedPages.current.clear();
    
    // Refresh the data to show the newly added lead
    fetchData(currentPage, false);
    
    // Show success message
    showNotification("Lead added successfully!");
  };

  return (
    <div className="relative">
      {alertMessage && (
        <div className={`fixed top-4 right-4 p-4 ${alertMessage.includes("successfully") ? "bg-green-500" : "bg-red-500"} text-white rounded-md shadow-md z-50`}>
          {alertMessage}
        </div>
      )}
      <div className="p-4 mt-20 mb-10 mx-auto bg-gray-100 rounded-lg shadow-md relative max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Leads Management</h1>
        </div>

        <div className="flex flex-col md:flex-row mb-4 justify-between items-center">
          <div className="flex w-full md:w-auto mb-2 md:mb-0">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchValue}
              onChange={handleSearchInputChange}
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
                <AiOutlineReload className="mr-1" />
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center p-2 bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700"
                >
                  <FontAwesomeIcon icon={faFilePdf} className="text-lg" />
                </button>
                <button
                  onClick={handleExportToExcel}
                  className="flex items-center p-2 bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700"
                >
                  <FontAwesomeIcon icon={faFileExcel} className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </div>
      
        <div className="ag-theme-alpine" style={{ height: "370px", width: "100%", overflowY: "visible", overflowX: 'visible'  }}>
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
        {!isSearching && (
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
        )}
        <AddRowModal
          isOpen={modalState.add}
          onRequestClose={() => setModalState({ ...modalState, add: false })}
          onSave={(newLead: Lead) => {
            // Pass the newly added lead data to update the UI immediately
            handleLeadAdded(newLead);
            cachedPages.current.clear(); 
            fetchData(1, false); // Fetch first page to show the new lead
            setCurrentPage(1); // Reset to first page to see the new lead
          }}
        />
        <EditRowModal
          isOpen={modalState.edit}
          onRequestClose={() => setModalState({ ...modalState, edit: false })}
          rowData={selectedRow}
          onSave={() => {
            cachedPages.current.clear(); 
            fetchData(currentPage, false);
            showNotification("Lead updated successfully!");
          }}
        />
        <ViewRowModal
          isOpen={modalState.view}
          onRequestClose={() => setModalState({ ...modalState, view: false })}
          rowData={selectedRow}
        />
        <NotificationModal
          isOpen={notificationModal.isOpen}
          onClose={closeNotificationModal}
          message={notificationModal.message}
        />
      </div>
    </div>
  );
};
export default withAuth(Leads);
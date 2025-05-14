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

  // Re-setup columns when window width changes
  useEffect(() => {
    if (rowData.length > 0) {
      setupColumns(rowData);
    }
  }, [windowWidth, rowData]);

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
      // Define responsive column widths
      const getColumnWidth = (field: string) => {
        if (windowWidth < 640) { // Mobile
          if (field === 'id') return 40;
          if (field === 'companyname') return 120;
          return 80;
        } else if (windowWidth < 1024) { // Tablet
          if (field === 'id') return 50;
          if (field === 'companyname') return 150;
          return 100;
        } else { // Desktop
          if (field === 'id') return 70;
          if (field === 'companyname') return 250;
          return 120;
        }
      };

      const columns = [
        { headerName: "ID", field: "id", width: getColumnWidth('id'), editable: false },
        { headerName: "Company Name", field: "companyname", width: getColumnWidth('companyname'), editable: true, editoptions: { size: 75, maxlength: 250, style: "text-transform: uppercase" }, label: "Company Name" },
        { headerName: "Status", field: "status", width: getColumnWidth('status'), editable: true, label: "Status", edittype: "select" },
        { headerName: "Tier", field: "tier", width: getColumnWidth('tier'), editable: true, label: "Tier", edittype: "select" },
        { headerName: "Culture", field: "culture", label: "Culture", width: getColumnWidth('culture'), editable: true, edittype: "select" },
        { headerName: "Solicited", field: "solicited", label: "Solicited", width: getColumnWidth('solicited'), editable: true, edittype: "select" },
        { headerName: "Min Rate", field: "minrate", width: getColumnWidth('minrate'), formatter: "currency", editoptions: { defaultValue: 62.0 }, formatoptions: { decimalPlaces: 2, thousandsSeparator: ",", prefix: "$" }, sorttype: "currency", label: "Rate" },
        { headerName: "Hire Before Term", field: "hirebeforeterm", label: "HBT", width: getColumnWidth('hirebeforeterm'), editable: true, edittype: "select" },
        { headerName: "Hire After Term", field: "hireafterterm", label: "HAT", width: getColumnWidth('hireafterterm'), editable: true, edittype: "select" },
        { headerName: "Late Payments", field: "latepayments", label: "Late Pay", width: getColumnWidth('latepayments'), editable: true, edittype: "select" },
        { headerName: "Total Net Term", field: "totalnetterm", width: getColumnWidth('totalnetterm'), editable: true, editoptions: { defaultValue: 45 }, editrules: { minValue: 0, maxValue: 80 }, label: "Net" },
        { headerName: "Defaulted Payment", field: "defaultedpayment", label: "Defaulted", width: getColumnWidth('defaultedpayment'), editable: true, edittype: "select" },
        { headerName: "URL", field: "url", width: getColumnWidth('url'), editable: true, editoptions: { size: 75, maxlength: 200, style: "text-transform: lowercase" }, formatter: "link", formatoptions: { target: "_blank" }, editrules: { url: true, required: false }, label: "Url" },
        { headerName: "Account Number", field: "accountnumber", width: getColumnWidth('accountnumber'), editable: true, label: "Acct. No" },
        { headerName: "Email", field: "email", width: getColumnWidth('email'), editable: true, editoptions: { size: 75, maxlength: 250, style: "text-transform: lowercase" }, formatter: "email", editrules: { email: true, required: true }, label: "Email" },
        { headerName: "Phone", field: "phone", width: getColumnWidth('phone'), editable: true, editoptions: { size: 75, maxlength: 250 }, label: "Phone" },
        { headerName: "Fax", field: "fax", width: getColumnWidth('fax'), editable: true, editoptions: { size: 75, maxlength: 250 }, label: "Fax" },
        { headerName: "Address", field: "address", width: getColumnWidth('address'), editable: true, editoptions: { size: 75, maxlength: 250 }, label: "Address" },
        { headerName: "City", field: "city", width: getColumnWidth('city'), editable: true, editoptions: { size: 75, maxlength: 250 }, label: "City" },
        { headerName: "State", field: "state", width: getColumnWidth('state'), editable: true, editoptions: { size: 75, maxlength: 250 }, label: "State" },
        { headerName: "Country", field: "country", width: getColumnWidth('country'), editable: true, editoptions: { size: 75, maxlength: 250 }, label: "Country" },
        { headerName: "Zip", field: "zip", width: getColumnWidth('zip'), editable: true, editoptions: { size: 75, maxlength: 250 }, label: "Zip" },
        { headerName: "Twitter", field: "twitter", width: getColumnWidth('twitter'), editable: true, label: "Twitter" },
        { headerName: "Facebook", field: "facebook", width: getColumnWidth('facebook'), editable: true, label: "Facebook" },
        { headerName: "LinkedIn", field: "linkedin", width: getColumnWidth('linkedin'), editable: true, label: "Linkedin" },
        { headerName: "HR Name", field: "hrname", width: getColumnWidth('hrname'), editable: true, editoptions: { size: 75, maxlength: 200 }, label: "HR Name" },
        { headerName: "HR Email", field: "hremail", width: getColumnWidth('hremail'), editable: true, formatter: "email", label: "HR Email" },
        { headerName: "HR Phone", field: "hrphone", width: getColumnWidth('hrphone'), editable: true, label: "HR Phone" },
        { headerName: "Manager Name", field: "managername", width: getColumnWidth('managername'), editable: true, editoptions: { size: 75, maxlength: 200 }, label: "Mgr Name" },
        { headerName: "Manager Email", field: "manageremail", width: getColumnWidth('manageremail'), editable: true, formatter: "email", label: "Mgr Email" },
        { headerName: "Manager Phone", field: "managerphone", width: getColumnWidth('managerphone'), editable: true, label: "Mgr Phone" },
        { headerName: "Secondary Name", field: "secondaryname", width: getColumnWidth('secondaryname'), editable: true, editoptions: { size: 75, maxlength: 200 }, label: "Sec Name" },
        { headerName: "Secondary Email", field: "secondaryemail", width: getColumnWidth('secondaryemail'), editable: true, formatter: "email", label: "Sec Email" },
        { headerName: "Secondary Phone", field: "secondaryphone", width: getColumnWidth('secondaryphone'), editable: true, label: "Secondary Phone" },
        { headerName: "Time Sheet Email", field: "timsheetemail", width: getColumnWidth('timsheetemail'), editable: true, formatter: "email", label: "Time Sheet Email" },
        { headerName: "Agreement Status", field: "agreementstatus", width: getColumnWidth('agreementstatus'), editable: true, label: "Agr Status", edittype: "select" },
        { headerName: "Agreement Name", field: "agreementname", width: getColumnWidth('agreementname'), editable: true, editoptions: { size: 75, maxlength: 200 }, label: "Agreement Name" },
        { headerName: "Agreement Link", field: "agreementlink", width: getColumnWidth('agreementlink'), editable: true, editoptions: { size: 75, maxlength: 200 }, formatter: "link", formatoptions: { target: "_blank" }, editrules: { url: true, required: false }, label: "Agreement Url" },
        { headerName: "Subcontractor Link", field: "subcontractorlink", width: getColumnWidth('subcontractorlink'), editable: true, editoptions: { size: 75, maxlength: 200 }, formatter: "link", formatoptions: { target: "_blank" }, editrules: { url: true, required: false }, label: "Sub Contractor Url" },
        { headerName: "Nonsolicitation Link", field: "nonsolicitationlink", width: getColumnWidth('nonsolicitationlink'), editable: true, editoptions: { size: 75, maxlength: 200 }, formatter: "link", formatoptions: { target: "_blank" }, editrules: { url: true, required: false }, label: "NSA Url" },
        { headerName: "Non Hire Link", field: "nonhirelink", width: getColumnWidth('nonhirelink'), editable: true, editoptions: { size: 75, maxlength: 200 }, formatter: "link", formatoptions: { target: "_blank" }, editrules: { url: true, required: false }, label: "Non Hire Url" },
        { headerName: "Clients", field: "clients", width: getColumnWidth('clients'), editable: true, edittype: "textarea", editoptions: { rows: 6, cols: 60 }, label: "Clients" },
        { headerName: "Notes", field: "notes", width: getColumnWidth('notes'), editable: true, edittype: "textarea", editoptions: { rows: 6, cols: 60 }, label: "Notes" }
      ];
      setColumnDefs(columns);
    }
  };

  const totalPages = Math.ceil(totalRows / paginationPageSize);
  const startPage = Math.max(1, currentPage - (windowWidth < 640 ? 1 : 2));
  const endPage = Math.min(totalPages, currentPage + (windowWidth < 640 ? 1 : 2));
  const pageOptions = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <div className="relative">
      {alertMessage && (
        <div className={`fixed top-4 right-4 p-3 sm:p-4 ${alertMessage.includes("successfully") ? "bg-green-500" : "bg-red-500"} text-white text-xs sm:text-sm rounded-md shadow-md z-50`}>
          {alertMessage}
        </div>
      )}
      <div className="p-2 sm:p-4 mt-16 sm:mt-20 mb-6 sm:mb-10 mx-2 sm:mx-4 md:mx-8 lg:mx-12 xl:mx-16 bg-gray-100 rounded-lg shadow-md relative">
        <div className="flex flex-col md:flex-row justify-between items-center mb-3 sm:mb-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Vendor Management</h1>
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
              onClick={() => fetchData(currentPage, searchValue)}
              className={`flex items-center ${buttonPadding} bg-blue-600 text-white rounded-md ml-1 sm:ml-2 transition duration-300 hover:bg-blue-900 text-xs sm:text-sm`}
            >
              <AiOutlineSearch className={`mr-1 ${iconSize}`} /> 
              <span className="hidden xs:inline">Search</span>
            </button>
          </div>
        
          <div className="flex items-center space-x-1">
            <button
              onClick={handleAddRow}
              className={`flex items-center justify-center ${buttonPadding} bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700 text-xs sm:text-sm`}
              title="Add Vendor"
            >
              <MdAdd className={iconSize} />
            </button>
            <button
              onClick={handleEditRow}
              className={`flex items-center justify-center ${buttonPadding} bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700 text-xs sm:text-sm`}
              title="Edit Vendor"
            >
              <AiOutlineEdit className={iconSize} />
            </button>
            <button
              onClick={handleDeleteRow}
              className={`flex items-center justify-center ${buttonPadding} bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700 text-xs sm:text-sm`}
              title="Delete Vendor"
            >
              <MdDelete className={iconSize} />
            </button>
            <button
              onClick={handleViewRow}
              className={`flex items-center justify-center ${buttonPadding} bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-700 text-xs sm:text-sm`}
              title="View Vendor"
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
            height: windowWidth < 640 ? "300px" : windowWidth < 1024 ? "350px" : "400px", 
            width: "100%", 
            overflowY: "auto",
            fontSize: windowWidth < 640 ? '10px' : windowWidth < 1024 ? '12px' : '14px'
          }}
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
              cellStyle: { 
                color: "#333", 
                fontSize: windowWidth < 640 ? "0.65rem" : windowWidth < 1024 ? "0.7rem" : "0.75rem", 
                padding: windowWidth < 640 ? "0px" : "1px" 
              },
              minWidth: windowWidth < 640 ? 60 : windowWidth < 1024 ? 70 : 80,
            }}
            rowHeight={windowWidth < 640 ? 25 : windowWidth < 1024 ? 28 : 30}
            headerHeight={windowWidth < 640 ? 30 : windowWidth < 1024 ? 32 : 35}
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

        <div className="flex flex-col md:flex-row justify-between items-center mt-3 sm:mt-4">
          <div className="flex items-center justify-center w-full md:w-auto overflow-x-auto">
            <div className="flex space-x-1 overflow-x-auto">
              <button 
                onClick={() => handlePageChange(1)} 
                disabled={currentPage === 1}
                className={`p-1 sm:p-2 disabled:opacity-50 ${iconSize}`}
                title="First Page"
              >
                <FaAngleDoubleLeft className={iconSize} />
              </button>
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                className={`p-1 sm:p-2 disabled:opacity-50 ${iconSize}`}
                title="Previous Page"
              >
                <FaChevronLeft className={iconSize} />
              </button>
              {pageOptions.map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md text-xs sm:text-sm ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className={`p-1 sm:p-2 disabled:opacity-50 ${iconSize}`}
                title="Next Page"
              >
                <FaChevronRight className={iconSize} />
              </button>
              <button 
                onClick={() => handlePageChange(totalPages)} 
                disabled={currentPage === totalPages}
                className={`p-1 sm:p-2 disabled:opacity-50 ${iconSize}`}
                title="Last Page"
              >
                <FaAngleDoubleRight className={iconSize} />
              </button>
            </div>
          </div>
          <span className="mt-2 md:mt-0 text-xs sm:text-sm text-gray-600">
            Total Records: {totalRows}
          </span>
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
    </div>
  );
};

export default Vendors;

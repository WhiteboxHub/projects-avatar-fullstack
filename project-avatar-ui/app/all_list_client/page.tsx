"use client";
import React, { useState, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { FaDownload } from "react-icons/fa";
import AddRowModal from "@/modals/recruiter_byClient_modals/AddRowRecruiter";
import EditRowModal from "@/modals/recruiter_byAllList_modals/EditRowRecruiter";
// import ViewRowModal from "@/modals/recruiter_byAllList_modals/ViewRowRecruiter";
import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import {
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlineSearch
  // AiOutlineReload,
} from "react-icons/ai";
import { MdAdd, MdDelete } from "react-icons/md";
import { Recruiter } from "@/types/byAllList";
import axios from "axios";

jsPDF.prototype.autoTable = autoTable;

const RecruiterByAllList = () => {
  const [modalState, setModalState] = useState<{
    add: boolean;
    edit: boolean;
    view: boolean;
  }>({ add: false, edit: false, view: false });

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [rowData, setRowData] = useState<Recruiter[]>([]);
  const [selectedRow, setSelectedRow] = useState<Recruiter | null>(null);
  const gridRef = useRef<AgGridReact>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
      const response = await axios.get(`${API_URL}/by/recruiters/byAllList`, {
        headers: { AuthToken: localStorage.getItem("token") },
      });
      setRowData(response.data);
    } catch (error) {
      console.error("Error fetching recruiters:", error);
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
        setAlertMessage("Please select a row to edit.");
        setTimeout(() => setAlertMessage(null), 3000);
      }
    }
  };

  const handleDeleteRow = () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        // Handle delete logic
      } else {
        setAlertMessage("Please select a row to delete.");
        setTimeout(() => setAlertMessage(null), 3000);
      }
    }
  };

  const handleViewRow = () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length > 0) {
        setSelectedRow({
          ...selectedRows[0],
          name: selectedRows[0].name || "",
        });
        setModalState((prevState) => ({ ...prevState, view: true }));
      } else {
        setAlertMessage("Please select a row to view.");
        setTimeout(() => setAlertMessage(null), 3000);
      }
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Recruiter Data", 20, 10);
    autoTable(doc, {
      head: [["ID", "Name", "Email", "Phone", "Company", "Status", "Designation", "DOB", "Personal Email", "Employee ID", "Skype ID", "LinkedIn", "Twitter", "Facebook", "Review", "Client ID", "Notes", "Last Modified DateTime"]],
      body: rowData.map((row) => [
        row.id,
        row.name || "",
        row.email,
        row.phone,
        row.comp || "",
        row.status,
        row.designation || "",
        row.dob || "",
        row.personalemail || "",
        row.employeeid || "",
        row.skypeid || "",
        row.linkedin || "",
        row.twitter || "",
        row.facebook || "",
        row.review || "",
        row.clientid,
        row.notes || "",
        row.lastmoddatetime || "",
      ]),
    });
    doc.save("recruiter_data.pdf");
  };

  return (
    <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md relative">
      {alertMessage && (
        <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded-md shadow-md z-50">
          {alertMessage}
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Recruiter Management</h1>
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
      <div
        className="ag-theme-alpine"
        style={{ height: "400px", width: "100%", overflowY: "auto" }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={[
            { headerName: "ID", field: "id" },
            { headerName: "Name", field: "name" },
            { headerName: "Email", field: "email" },
            { headerName: "Phone", field: "phone" },
            { headerName: "Company", field: "comp" },
            { headerName: "Status", field: "status" },
            { headerName: "Designation", field: "designation" },
            { headerName: "DOB", field: "dob" },
            { headerName: "Personal Email", field: "personalemail" },
            { headerName: "Employee ID", field: "employeeid" },
            { headerName: "Skype ID", field: "skypeid" },
            { headerName: "LinkedIn", field: "linkedin" },
            { headerName: "Twitter", field: "twitter" },
            { headerName: "Facebook", field: "facebook" },
            { headerName: "Review", field: "review" },
            { headerName: "Client ID", field: "clientid" },
            { headerName: "Notes", field: "notes" },
            { headerName: "Last Modified DateTime", field: "lastmoddatetime" },
          ]}
          pagination={false}
          domLayout="normal"
          rowSelection="multiple"
          defaultColDef={{
            sortable: true,
            filter: true,
            cellStyle: { color: "#333", fontSize: "0.75rem", padding: "1px" },
            minWidth: 60,
            maxWidth: 200,
          }}
          rowHeight={30}
          headerHeight={35}
        />
      </div>
      <div className="flex justify-between mt-4">
        <div className="flex items-center">
          <button className="p-2">
            <FaAngleDoubleLeft />
          </button>
          <button className="p-2">
            <FaChevronLeft />
          </button>
          {/* Pagination buttons */}
          <button className="p-2">
            <FaChevronRight />
          </button>
          <button className="p-2">
            <FaAngleDoubleRight />
          </button>
        </div>
      </div>
      {modalState.add && (
        <AddRowModal
          isOpen={modalState.add}
          onClose={() => setModalState((prev) => ({ ...prev, add: false }))}
          onSubmit={() => {
            // Handle add logic
          }}
        />
      )}
      {modalState.edit && selectedRow && (
        <EditRowModal
          isOpen={modalState.edit}
          onClose={() => setModalState((prev) => ({ ...prev, edit: false }))}
          initialData={selectedRow}
          onSubmit={() => {
          }}
        />
      )}
      {/* {modalState.view && selectedRow && (
        <ViewRowModal
          isOpen={modalState.view}
          onClose={() => setModalState((prev) => ({ ...prev, view: false }))}
          recruiter={selectedRow}
        />
      )} */}
    </div>
  );
};

export default RecruiterByAllList;
"use client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import EditRowModal from "@/modals/candidate_placements/EditRowModal";
import React, { useEffect, useRef, useState } from "react";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { jsPDF } from "jspdf";

import { 
    AiOutlineDownload,
    AiOutlineDelete,
    AiOutlineEdit,
    AiOutlineSync,
    AiOutlineClose,
    AiOutlineEye,
    AiOutlineSearch
} from "react-icons/ai";
import { 
    FaAngleDoubleLeft,
    FaChevronLeft,
    FaChevronRight,
    FaAngleDoubleRight
} from "react-icons/fa";

interface SelectOption {
    id: string;
    name: string;
}

interface PlacementSelectOptions {
    candidates: SelectOption[];
    managers: SelectOption[];
    recruiters: SelectOption[];
    vendors: SelectOption[];
    clients: SelectOption[];
    statuses: SelectOption[];
    yesno: SelectOption[];
    feedbacks: SelectOption[];
}

interface Placement {
    id: number;
    candidateid: number;
    mmid: number;
    recruiterid: number;
    vendorid: number;
    vendor2id?: number;
    vendor3id?: number;
    clientid: number;
    startdate: string;
    enddate: string;
    status: string;
    paperwork: string;
    insurance: string;
    wrklocation: string;
    wrkdesignation: string;
    wrkemail: string;
    wrkphone: string;
    mgrname: string;
    mgremail: string;
    mgrphone: string;
    hiringmgrname: string;
    hiringmgremail: string;
    hiringmgrphone: string;
    reference: string;
    ipemailclear: string;
    feedbackid?: number;
    projectdocs: string;
    notes: string;
    masteragreementid?: number;
    otheragreementsids?: string;
}

const PlacementPage = () => {
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchInputValue, setSearchInputValue] = useState<string>("");
    const [rowData, setRowData] = useState<Placement[]>([]);
    const [selectedRow, setSelectedRow] = useState<Placement | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [pageSize] = useState<number>(100);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [showDetails, setShowDetails] = useState<boolean>(false);
    const [modalState, setModalState] = useState<{ edit: boolean }>({ edit: false });
    const [loading, setLoading] = useState<boolean>(false);
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [sortField, setSortField] = useState<string>("startdate");
    const [sortOrder, setSortOrder] = useState<string>("desc");
    const [selectOptions, setSelectOptions] = useState<PlacementSelectOptions | null>(null);
    const gridRef = useRef<AgGridReact>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetchPlacements();
        fetchSelectOptions();
    }, [currentPage, searchValue, sortField, sortOrder]);

    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        
        searchTimeoutRef.current = setTimeout(() => {
            setSearchValue(searchInputValue);
            setCurrentPage(1);
        }, 500);
        
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchInputValue]);

    const fetchPlacements = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/candid/placements/getAll`, {
                headers: { AuthToken: localStorage.getItem("token") },
                params: {
                    page: currentPage,
                    rows: pageSize,
                    sidx: sortField,
                    sord: sortOrder,
                    _search: searchValue ? true : false,
                    searchField: searchValue ? "name" : "",
                    searchString: searchValue,
                    searchOper: searchValue ? "cn" : ""
                },
            });

            setRowData(response.data.data);
            setTotalPages(response.data.pages);
            setTotalRecords(response.data.total);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching placements:", error);
            setAlertMessage("Failed to fetch placement data");
            setTimeout(() => setAlertMessage(null), 3000);
            setLoading(false);
        }
    };

    const fetchSelectOptions = async () => {
        try {
            const response = await axios.get(`${API_URL}/candid/placements/options/all`, {
                headers: { AuthToken: localStorage.getItem("token") },
            });
            setSelectOptions(response.data);
        } catch (error) {
            console.error("Error fetching select options:", error);
        }
    };

    const handleSearch = () => {
        setSearchValue(searchInputValue);
        setCurrentPage(1);
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Placement Management Data", 20, 10);
        autoTable(doc, {
            head: [["ID", "Candidate", "Manager", "Recruiter", "Vendor", "Client", "Start Date", "End Date", "Status", "Location"]],
            body: rowData.map((row) => [
                row.id,
                getCandidateName(row.candidateid),
                getManagerName(row.mmid),
                getRecruiterName(row.recruiterid),
                getVendorName(row.vendorid),
                getClientName(row.clientid),
                row.startdate,
                row.enddate,
                row.status,
                row.wrklocation || "",
            ]),
        });
        doc.save("placement_management.pdf");
    };

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleRowClick = (row: Placement) => {
        setSelectedRow(row);
    };

    const handleViewDetails = () => {
        if (selectedRow) {
            setShowDetails(true);
        } else {
            setAlertMessage("Please select a placement record first");
            setTimeout(() => setAlertMessage(null), 3000);
        }
    };

    const handleEditPlacement = () => {
        if (selectedRow) {
            setModalState((prevState) => ({ ...prevState, edit: true }));
        } else {
            setAlertMessage("Please select a placement record first");
            setTimeout(() => setAlertMessage(null), 3000);
        }
    };

    const handleDeletePlacement = async () => {
        if (!selectedRow) {
            setAlertMessage("Please select a placement record first");
            setTimeout(() => setAlertMessage(null), 3000);
            return;
        }
        
        setConfirmDelete(true);
    };

    const confirmDeletePlacement = async () => {
        try {
            await axios.delete(`${API_URL}/candid/placements/delete/${selectedRow?.id}`, {
                headers: { AuthToken: localStorage.getItem("token") },
            });
            
            setAlertMessage("Placement deleted successfully");
            setTimeout(() => setAlertMessage(null), 3000);
            
            fetchPlacements();
            setSelectedRow(null);
            setConfirmDelete(false);
        } catch (error) {
            console.error("Error deleting placement:", error);
            setAlertMessage("Failed to delete placement");
            setTimeout(() => setAlertMessage(null), 3000);
            setConfirmDelete(false);
        }
    };

    const getCandidateName = (candidateId: number) => {
        const candidate = selectOptions?.candidates.find(c => parseInt(c.id) === candidateId);
        return candidate ? candidate.name : "Unknown";
    };

    const getManagerName = (managerId: number) => {
        const manager = selectOptions?.managers.find(m => parseInt(m.id) === managerId);
        return manager ? manager.name : "Unknown";
    };

    const getRecruiterName = (recruiterId: number) => {
        const recruiter = selectOptions?.recruiters.find(r => parseInt(r.id) === recruiterId);
        return recruiter ? recruiter.name : "Unknown";
    };

    const getVendorName = (vendorId: number) => {
        const vendor = selectOptions?.vendors.find(v => parseInt(v.id) === vendorId);
        return vendor ? vendor.name : "Unknown";
    };

    const getClientName = (clientId: number) => {
        const client = selectOptions?.clients.find(c => parseInt(c.id) === clientId);
        return client ? client.name : "Unknown";
    };

    const getFeedbackName = (feedbackId?: number) => {
        if (!feedbackId) return "None";
        const feedback = selectOptions?.feedbacks.find(f => parseInt(f.id) === feedbackId);
        return feedback ? feedback.name : "Unknown";
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
        
        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        
        return pageNumbers;
    };

    const handleSortChanged = () => {
        if (gridRef.current && gridRef.current.api) {
            const columnState = gridRef.current.api.getColumnState();
            const sortedColumn = columnState.find(column => column.sort);
            
            if (sortedColumn) {
                setSortField(sortedColumn.colId);
                setSortOrder(sortedColumn.sort || "asc");
            } else {
                setSortField("startdate");
                setSortOrder("desc");
            }
        }
    };

    const handleSaveEdit = () => {
        fetchPlacements();
        setModalState((prevState) => ({ ...prevState, edit: false }));
    };

    return (
        <div className="p-4 mt-20 mb-10 ml-20 mr-20 bg-gray-100 rounded-lg shadow-md relative">
            {modalState.edit && selectedRow && (
                <EditRowModal
                    isOpen={modalState.edit}
                    onClose={() => setModalState((prev) => ({ ...prev, edit: false }))}
                    placement={selectedRow}
                    onSave={handleSaveEdit}
                />
            )}

            {alertMessage && (
                <div className="fixed top-4 right-4 p-4 bg-red-500 text-white rounded-md shadow-md z-50">
                    {alertMessage}
                </div>
            )}

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-gray-800">Placement Management</h1>
                <div className="flex space-x-2">
                    <button
                        onClick={handleEditPlacement}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700"
                    >
                        <AiOutlineEdit className="mr-2" />
                    </button>
                    <button
                        onClick={handleViewDetails}
                        className={`flex items-center px-4 py-2 ${
                            selectedRow
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-gray-400 text-gray-200 cursor-not-allowed"
                        } rounded-md transition duration-300`}
                        disabled={!selectedRow}
                    >
                        <AiOutlineEye className="mr-2" /> 
                    </button>
                    <button
                        onClick={handleDeletePlacement}
                        className={`flex items-center px-4 py-2 ${
                            selectedRow
                                ? "bg-red-600 text-white hover:bg-red-700"
                                : "bg-gray-400 text-gray-200 cursor-not-allowed"
                        } rounded-md transition duration-300`}
                        disabled={!selectedRow}
                    >
                        <AiOutlineDelete className="mr-2" />
                    </button>
                    <button
                        onClick={fetchPlacements}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700"
                    >
                        <AiOutlineSync className="mr-2" />
                    </button>
                    <button
                        onClick={handleDownloadPDF}
                        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700"
                    >
                        <AiOutlineDownload className="mr-2" />
                    </button>
                </div>
            </div>
            <div className="flex mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchInputValue}
                    onChange={(e) => setSearchInputValue(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-64"
                />
                <button
                    onClick={handleSearch}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md ml-2 transition duration-300 hover:bg-blue-900"
                >
                    <AiOutlineSearch className="mr-2" /> Search
                </button>
            </div>
            <div
                className="ag-theme-alpine"
                style={{ height: "500px", width: "100%", overflowY: "auto" }}
            >
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={[
                        { headerName: "ID", field: "id", width: 70 },
                        { 
                            headerName: "Candidate", 
                            field: "candidateid", 
                            width: 150,
                            valueGetter: (params) => getCandidateName(params.data?.candidateid)
                        },
                        { 
                            headerName: "Manager", 
                            field: "mmid", 
                            width: 150,
                            valueGetter: (params) => getManagerName(params.data?.mmid)
                        },
                        { 
                            headerName: "Recruiter", 
                            field: "recruiterid", 
                            width: 150,
                            valueGetter: (params) => getRecruiterName(params.data?.recruiterid)
                        },
                        { 
                            headerName: "Vendor", 
                            field: "vendorid", 
                            width: 150,
                            valueGetter: (params) => getVendorName(params.data?.vendorid)
                        },
                        { 
                            headerName: "Client", 
                            field: "clientid", 
                            width: 150,
                            valueGetter: (params) => getClientName(params.data?.clientid)
                        },
                        { headerName: "Start Date", field: "startdate", width: 120 },
                        { headerName: "End Date", field: "enddate", width: 120 },
                        { headerName: "Status", field: "status", width: 100 },
                        { headerName: "Paperwork", field: "paperwork", width: 100 },
                        { headerName: "Insurance", field: "insurance", width: 100 },
                        { headerName: "Work Location", field: "wrklocation", width: 150 },
                        { headerName: "Work Designation", field: "wrkdesignation", width: 150 },
                        { headerName: "Work Email", field: "wrkemail", width: 150 },
                        { headerName: "Work Phone", field: "wrkphone", width: 120 },
                        { headerName: "Manager Name", field: "mgrname", width: 150 },
                        { headerName: "Manager Email", field: "mgremail", width: 150 },
                        { headerName: "Manager Phone", field: "mgrphone", width: 120 },
                        { headerName: "Hiring Manager", field: "hiringmgrname", width: 150 },
                        { headerName: "Hiring Mgr Email", field: "hiringmgremail", width: 150 },
                        { headerName: "Hiring Mgr Phone", field: "hiringmgrphone", width: 120 },
                        { headerName: "Reference", field: "reference", width: 100 },
                        { headerName: "IP Email Clear", field: "ipemailclear", width: 120 },
                        { headerName: "Project Docs", field: "projectdocs", width: 120 },
                        { 
                            headerName: "Feedback", 
                            field: "feedbackid", 
                            width: 150,
                            valueGetter: (params) => getFeedbackName(params.data?.feedbackid)
                        }
                    ]}
                    pagination={false}
                    domLayout="normal"
                    rowSelection="single"
                    defaultColDef={{
                        sortable: true,
                        filter: true,
                        cellStyle: { color: "#333", fontSize: "0.75rem", padding: "1px" },
                        minWidth: 60,
                        maxWidth: 200,
                    }}
                    rowHeight={30}
                    headerHeight={35}
                    onRowClicked={(event) => handleRowClick(event.data)}
                    rowClass="cursor-pointer hover:bg-gray-100"
                    onGridReady={(params) => {
                        params.api.sizeColumnsToFit();
                        if (loading) {
                            params.api.showLoadingOverlay();
                        }
                    }}
                    onGridSizeChanged={(params) => {
                        params.api.sizeColumnsToFit();
                    }}
                    onSortChanged={handleSortChanged}
                    overlayLoadingTemplate={
                        '<span class="ag-overlay-loading-center">Loading...</span>'
                    }
                    overlayNoRowsTemplate={
                        '<span class="ag-overlay-no-rows-center">No rows to show</span>'
                    }
                />
            </div>
            {showDetails && selectedRow && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg max-w-4xl w-full relative max-h-[80vh] overflow-y-auto">
                        <button
                            onClick={() => setShowDetails(false)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
                            aria-label="Close"
                        >
                            <AiOutlineClose size={18} />
                        </button>
                        <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">Placement Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-800">ID</span>
                                    <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.id}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-800">Candidate</span>
                                    <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{getCandidateName(selectedRow.candidateid)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-800">Manager</span>
                                    <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{getManagerName(selectedRow.mmid)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-800">Recruiter</span>
                                    <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{getRecruiterName(selectedRow.recruiterid)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-800">Vendor</span>
                                    <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{getVendorName(selectedRow.vendorid)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-800">Client</span>
                                    <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{getClientName(selectedRow.clientid)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-800">Start Date</span>
                                    <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.startdate}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-800">End Date</span>
                                    <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.enddate}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-800">Status</span>
                                    <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.status}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-800">Paperwork</span>
                                    <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.paperwork}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-800">Insurance</span>
                                    <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.insurance}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-800">Work Location</span>
                                    <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.wrklocation}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-800">Work Designation</span>
                                    <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.wrkdesignation}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-800">Work Email</span>
                                    <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.wrkemail}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-800">Work Phone</span>
                                    <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.wrkphone}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-800">Manager Name</span>
                                    <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.mgrname}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-800">Manager Email</span>
                                    <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.mgremail}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-800">Manager Phone</span>
                                    <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.mgrphone}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-800">Hiring Manager</span>
                                    <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.hiringmgrname}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-800">Hiring Manager Email</span>
                                    <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.hiringmgremail}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-800">Hiring Manager Phone</span>
                                    <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.hiringmgrphone}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-800">Reference</span>
                                    <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.reference}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-800">IP Email Clear</span>
                                    <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.ipemailclear}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-800">Project Docs</span>
                                    <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{selectedRow.projectdocs}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-800">Feedback</span>
                                    <span className="text-sm border-b border-gray-200" style={{ width: 'fit-content' }}>{getFeedbackName(selectedRow.feedbackid)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-800">Notes</span>
                                <span className="text-sm bg-gray-50 p-2 rounded border-b border-gray-200">{selectedRow.notes || "No notes available"}</span>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end border-t border-gray-200 pt-3">
                            <button
                                onClick={() => setShowDetails(false)}
                                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
                        <p className="mb-4">Are you sure you want to delete this placement record? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setConfirmDelete(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeletePlacement}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-md ${
                                currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            <FaAngleDoubleLeft className="text-white" />
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-md ${
                                currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            <FaChevronLeft className="text-white" />
                        </button>
                        
                        {getPageNumbers().map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-1 rounded-md ${
                                    currentPage === page
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 hover:bg-gray-300"
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-md ${
                                currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            <FaChevronRight className="text-white" />
                        </button>
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-md ${
                                currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            <FaAngleDoubleRight className="text-white" />
                        </button>
                    </div>
                    <div className="text-sm text-gray-600">
                        Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords} entries
                    </div>
                </div>
            </div>
        );
    };
    
    export default PlacementPage;

<<<<<<< HEAD
=======
export default PlacementPage;
>>>>>>> 8785e7a (all by vendor routes are working)

'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import AddRowModal from "@/modals/recruiter_byClient_modals/AddRowRecruiter";
import ViewRowModal from "@/modals/recruiter_byClient_modals/ViewRowRecruiter";
import {
    FaChevronLeft,
    FaChevronRight,
    FaAngleDoubleLeft,
    FaAngleDoubleRight,
    FaDownload
} from "react-icons/fa";
import {
    AiOutlineEdit,
    AiOutlineEye,
    AiOutlineSearch,
} from "react-icons/ai";
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
    type: 'success' | 'error';
}

const RecruiterByClient = () => {
    const gridRef = useRef<any>();
    const [modalState, setModalState] = useState<{
        add: boolean;
        edit: boolean;
        view: boolean;
    }>({ add: false, edit: false, view: false });
    const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
    const [searchValue, setSearchValue] = useState('');
    const [companies, setCompanies] = useState<Company[]>([]);
    const [expandedCompanies, setExpandedCompanies] = useState<{ [key: number]: boolean }>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRow, setSelectedRow] = useState<RecruiterData | null>(null);
    const pageSize = 10;

    const showAlert = (text: string, type: 'success' | 'error') => {
        setAlertMessage({ text, type });
        setTimeout(() => setAlertMessage(null), 3000);
    };

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/recruiters/by-client`, {
                params: {
                    page: currentPage,
                    pageSize: pageSize,
                    type: 'client',
                    search: searchValue || undefined
                }
            });
            setCompanies(response.data.data);
            setTotalPages(response.data.pages);
        } catch (error) {
            console.error('Error fetching data:', error);
            showAlert('Error loading data', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchValue]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const toggleGroup = (clientId: number) => {
        setExpandedCompanies(prev => ({
            ...prev,
            [clientId]: !prev[clientId]
        }));
    };

    const rowData = useMemo(() => {
      const rows: RowData[] = [];
      companies.forEach(company => {
          // Group row - show only company name when collapsed
          rows.push({
              id: company.clientid,
              name: company.companyname, // Only company name here
              email: '',
              phone: '',
              designation: '',
              status: '',
              dob: null,
              personalemail: '',
              skypeid: '',
              linkedin: '',
              twitter: '',
              facebook: '',
              review: '',
              notes: '',
              clientid: company.clientid,
              companyname: company.companyname,
              isGroupRow: true,
              level: 0,
              expanded: expandedCompanies[company.clientid]
          });
  
          if (expandedCompanies[company.clientid]) {
              company.recruiters.forEach(recruiter => {
                  // Recruiter rows - show ID and name like in the example
                  rows.push({
                      ...recruiter,
                      name: `${recruiter.id} ${recruiter.name} - ${company.companyname}`, // Format like "102646 SAURABH KAUL- Smartdeck"
                      isGroupRow: false,
                      level: 1
                  });
              });
              // Add an empty row after the recruiters
              rows.push({
                  id: null,
                  name: '',
                  email: '',
                  phone: '',
                  designation: '',
                  status: '',
                  dob: null,
                  personalemail: '',
                  skypeid: '',
                  linkedin: '',
                  twitter: '',
                  facebook: '',
                  review: '',
                  notes: '',
                  clientid: null,
                  companyname: '',
                  isGroupRow: false,
                  level: 1
              });
          }
      });
      return rows;
  }, [companies, expandedCompanies]);
  
  const columnDefs = useMemo(() => [
      {
          headerName: 'Name',
          field: 'name',
          cellRenderer: (params: any) => {
              if (params.data.isGroupRow) {
                  const expanded = expandedCompanies[params.data.clientid];
                  return (
                      <div className="flex items-center">
                          <span
                              className="cursor-pointer pl-1 flex items-center hover:bg-gray-100 rounded-md py-1 px-2 transition-colors duration-200"
                              onClick={() => toggleGroup(params.data.clientid)}
                          >
                              <span className="mr-2 text-gray-600 flex items-center justify-center w-4 h-4 bg-white border border-gray-300 rounded">
                                  {expanded ? (
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                      </svg>
                                  ) : (
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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
          flex: 1
      },
      {
          headerName: 'Email',
          field: 'email',
          hide: (params: any) => params.data.isGroupRow,
          minWidth: 150
      },
      {
          headerName: 'Phone',
          field: 'phone',
          hide: (params: any) => params.data.isGroupRow,
          minWidth: 120
      },
      {
          headerName: 'Designation',
          field: 'designation',
          hide: (params: any) => params.data.isGroupRow,
          minWidth: 150
      },
      {
          headerName: 'Status',
          field: 'status',
          hide: (params: any) => params.data.isGroupRow,
          minWidth: 100,
          cellRenderer: (params: any) => {
              const statusMap: { [key: string]: string } = {
                  'A': 'Active',
                  'I': 'Inactive',
                  'D': 'Delete',
                  'R': 'Rejected',
                  'N': 'Not Interested',
                  'E': 'Excellent'
              };
              return statusMap[params.value] || params.value;
          }
      },
      {
          headerName: 'DOB',
          field: 'dob',
          hide: (params: any) => params.data.isGroupRow,
          minWidth: 100
      },
      {
          headerName: 'Personal Email',
          field: 'personalemail',
          hide: (params: any) => params.data.isGroupRow,
          minWidth: 150
      },
      {
          headerName: 'Skype ID',
          field: 'skypeid',
          hide: (params: any) => params.data.isGroupRow,
          minWidth: 120
      },
      {
          headerName: 'LinkedIn',
          field: 'linkedin',
          hide: (params: any) => params.data.isGroupRow,
          minWidth: 120
      },
      {
          headerName: 'Twitter',
          field: 'twitter',
          hide: (params: any) => params.data.isGroupRow,
          minWidth: 120
      },
      {
          headerName: 'Facebook',
          field: 'facebook',
          hide: (params: any) => params.data.isGroupRow,
          minWidth: 120
      },
      {
          headerName: 'Review',
          field: 'review',
          hide: (params: any) => params.data.isGroupRow,
          minWidth: 100
      },
      {
          headerName: 'Notes',
          field: 'notes',
          hide: (params: any) => params.data.isGroupRow,
          minWidth: 200
      },
      {
          headerName: 'Employee ID',
          field: 'employeeid',
          hide: (params: any) => params.data.isGroupRow,
          minWidth: 120
      },
      {
          headerName: 'Last Modified',
          field: 'lastmoddatetime',
          hide: (params: any) => params.data.isGroupRow,
          minWidth: 150
      }
  ], [expandedCompanies]);
  
    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleAdd = async (formData: RecruiterData) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/recruiters/byClient/add`, formData);
            showAlert('Recruiter added successfully', 'success');
            setModalState(prev => ({ ...prev, add: false }));
            fetchData();
        } catch (error) {
            showAlert('Error adding recruiter', 'error');
        }
    };

    const handleEdit = async (formData: RecruiterData) => {
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/recruiters/byClient/update/${formData.id}`, formData);
            showAlert('Recruiter updated successfully', 'success');
            setModalState(prev => ({ ...prev, edit: false }));
            fetchData();
        } catch (error) {
            showAlert('Error updating recruiter', 'error');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this recruiter?')) {
            try {
                await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/recruiters/byClient/remove/${id}`);
                showAlert('Recruiter deleted successfully', 'success');
                fetchData();
            } catch (error) {
                showAlert('Error deleting recruiter', 'error');
            }
        }
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const tableData = rowData
            .filter(row => !row.isGroupRow && row.id !== null)
            .map(row => [
                row.companyname,
                row.name,
                row.email,
                row.phone,
                row.designation,
                row.status,
                row.dob || '',
                row.personalemail || '',
                row.skypeid || '',
                row.linkedin || '',
                row.twitter || '',
                row.facebook || '',
                row.review || '',
                row.notes || ''
            ]);

        autoTable(doc, {
            head: [['Company', 'Name', 'Email', 'Phone', 'Designation', 'Status', 'DOB',
                   'Personal Email', 'Skype ID', 'LinkedIn', 'Twitter', 'Facebook', 'Review', 'Notes']],
            body: tableData,
            styles: { fontSize: 8 },
            margin: { top: 20 }
        });

        doc.save('recruiters-by-client.pdf');
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
                <div className={`fixed top-4 right-4 p-4 ${
                    alertMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                } text-white rounded-md shadow-md z-50`}>
                    {alertMessage.text}
                </div>
            )}

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-gray-800">Recruiter Management</h1>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setModalState(prev => ({ ...prev, add: true }))}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700"
                    >
                        <MdAdd className="mr-2" />
                    </button>
                    <button
                        onClick={() => {
                            const selectedRows = gridRef.current?.api.getSelectedRows();
                            if (selectedRows?.length > 0 && !selectedRows[0].isGroupRow) {
                                setSelectedRow(selectedRows[0]);
                                setModalState(prev => ({ ...prev, edit: true }));
                            } else {
                                showAlert("Please select a recruiter to edit", "error");
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
                                showAlert("Please select a recruiter to delete", "error");
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
                                setSelectedRow(selectedRows[0]);
                                setModalState(prev => ({ ...prev, view: true }));
                            } else {
                                showAlert("Please select a recruiter to view", "error");
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

            <div className="ag-theme-alpine" style={{ height: "400px", width: "100%", overflowY: "auto" }}>
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
                    suppressRowClickSelection={true}
                    rowSelection="multiple"
                    rowHeight={30}
                    headerHeight={35}
                    onGridReady={(params) => {
                        params.api.sizeColumnsToFit();
                    }}
                />
            </div>

            <div className="flex justify-between mt-4">
                <div className="flex items-center flex-wrap gap-2 overflow-auto">
                    <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className="text-sm px-2 py-1 rounded-md"
                    >
                        <FaAngleDoubleLeft />
                    </button>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="text-sm px-2 py-1 rounded-md"
                    >
                        <FaChevronLeft />
                    </button>
                    {renderPageNumbers()}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="text-sm px-2 py-1 rounded-md"
                    >
                        <FaChevronRight />
                    </button>
                    <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="text-sm px-2 py-1 rounded-md"
                    >
                        <FaAngleDoubleRight />
                    </button>
                </div>
            </div>

            <AddRowModal
                isOpen={modalState.add}
                onClose={() => setModalState(prev => ({ ...prev, add: false }))}
                onSubmit={handleAdd}
                clientOptions={companies.map(c => ({ id: c.clientid, name: c.companyname }))}
            />

            <ViewRowModal
                isOpen={modalState.view}
                onClose={() => setModalState(prev => ({ ...prev, view: false }))}
                recruiter={selectedRow}
            />
        </div>
    );
};

export default RecruiterByClient;
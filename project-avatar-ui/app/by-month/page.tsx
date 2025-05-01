"use client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import AddRowModal from "@/modals/bymonth_modals/AddRowByMonth";
import EditRowModal from "@/modals/bymonth_modals/EditRowByMonth";
import ViewRowModal from "@/modals/bymonth_modals/ViewRowByMonth";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { jsPDF } from "jspdf";
import { AiOutlineEdit, AiOutlineEye, AiOutlineSearch } from "react-icons/ai";
import { MdAdd, MdDelete } from "react-icons/md";
import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaDownload,
} from "react-icons/fa";
import { ICellRendererParams, ColDef } from "ag-grid-community";

jsPDF.prototype.autoTable = autoTable;

interface InvoiceData {
  id: number;
  invoicenumber: string;
  startdate: string;
  enddate: string;
  invoicedate: string;
  invmonth: string;
  quantity: number;
  otquantity: number;
  rate: number;
  overtimerate: number;
  status: string;
  emppaiddate: string;
  candpaymentstatus: string;
  reminders: string;
  amountexpected: number;
  expecteddate: string;
  amountreceived: number;
  receiveddate: string;
  releaseddate: string;
  checknumber: string;
  invoiceurl: string;
  checkurl: string;
  freqtype: string;
  invoicenet: number;
  companyname: string;
  vendorfax: string;
  vendorphone: string;
  vendoremail: string;
  timsheetemail: string;
  hrname: string;
  hremail: string;
  hrphone: string;
  managername: string;
  manageremail: string;
  managerphone: string;
  secondaryname: string;
  secondaryemail: string;
  secondaryphone: string;
  candidatename: string;
  candidatephone: string;
  candidateemail: string;
  wrkemail: string;
  wrkphone: string;
  recruitername: string;
  recruiterphone: string;
  recruiteremail: string;
  poid: number;
  notes: string;
}

interface MonthGroup {
  invmonth: string;
  invoices: InvoiceData[];
  isGroup?: boolean;
  isCollapsed?: boolean;
  invoice_count: number;
}

interface RowData extends InvoiceData {
  isGroupRow?: boolean;
  level?: number;
  expanded?: boolean;
  name?: string;
}

interface AlertMessage {
  text: string;
  type: "success" | "error";
}

interface ModalState {
  add: boolean;
  view: boolean;
  edit: boolean;
  selectedRow: InvoiceData | null;
}

interface SearchParams {
  [key: string]: string | undefined;
  poid?: string;
  invoicenumber?: string;
  status?: string;
  reminders?: string;
  candpaymentstatus?: string;
  startdate?: string;
  enddate?: string;
  invoicedate?: string;
  receiveddate?: string;
  releaseddate?: string;
  emppaiddate?: string;
  companyname?: string;
  candidatename?: string;
}

const ByMonth = () => {
  const gridRef = useRef<AgGridReact<RowData>>(null);
  const [modalState, setModalState] = useState<ModalState>({
    add: false,
    view: false,
    edit: false,
    selectedRow: null,
  });
  const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [monthGroups, setMonthGroups] = useState<MonthGroup[]>([]);
  const [expandedMonthGroups, setExpandedMonthGroups] = useState<{
    [key: string]: boolean;
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<{ id: number; pname: string }[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [sortField, setSortField] = useState<string>("invoicedate");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const pageSize = 10;

  const showAlert = (text: string, type: "success" | "error") => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Prepare search parameters
      const params: Record<string, string | number> = {
        page: currentPage,
        page_size: pageSize,
        sort_field: sortField,
        sort_order: sortOrder,
      };

      // Add search parameters if they exist
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key]) {
          params[`search_${key}`] = searchParams[key] as string;
        }
      });

      // First fetch the month list
      const monthResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/invoices/month-list`
      );
      
      // Then fetch detailed data for all months or a specific month
      const detailedResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/invoices/dataByMonth`,
        { params }
      );
      
      // Merge the data
      const mergedData = monthResponse.data.map((monthItem: { invmonth: string }) => {
        const detailedMonth = detailedResponse.data.data.find(
          (d: { invmonth: string; invoices: InvoiceData[] }) => d.invmonth === monthItem.invmonth
        );
        
        return {
          invmonth: monthItem.invmonth,
          invoices: detailedMonth ? detailedMonth.invoices : [],
          isGroup: true,
          isCollapsed: expandedMonthGroups[monthItem.invmonth] || false,
          invoice_count: detailedMonth ? detailedMonth.invoices.length : 0
        };
      });
      
      setMonthGroups(mergedData);
      setTotalPages(detailedResponse.data.pages || 1);
      setClients(detailedResponse.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      showAlert("Error loading data", "error");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchParams, sortField, sortOrder, expandedMonthGroups]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchMonthData = useCallback(async (month: string) => {
    try {
      setIsLoading(true);
      
      const params: Record<string, string | number> = {
        month: month,
        page: currentPage,
        page_size: pageSize,
        sort_field: sortField,
        sort_order: sortOrder,
      };

      // Add search parameters if they exist
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key]) {
          params[`search_${key}`] = searchParams[key] as string;
        }
      });

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/invoices/dataByMonth`,
        { params }
      );
      
      // Update the specific month data
      setMonthGroups(prev => 
        prev.map(group => 
          group.invmonth === month 
            ? {
                ...group,
                invoices: response.data.data.find((d: { invmonth: string }) => d.invmonth === month)?.invoices || [],
                invoice_count: response.data.data.find((d: { invmonth: string }) => d.invmonth === month)?.invoices.length || 0
              }
            : group
        )
      );
      
    } catch (error) {
      console.error("Error fetching month data:", error);
      showAlert("Error loading month data", "error");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, sortField, sortOrder, searchParams]);

  const toggleGroup = (month: string) => {
    setSelectedMonth(month);
    setExpandedMonthGroups((prev) => ({
      ...prev,
      [month]: !prev[month],
    }));
    
    // If expanding, fetch the specific month data
    if (!expandedMonthGroups[month]) {
      fetchMonthData(month);
    }
  };

  const rowData = useMemo(() => {
    const rows: RowData[] = [];
    
    monthGroups.forEach((monthGroup) => {
      // Add month group row
      rows.push({
        id: -1,
        name: monthGroup.invmonth,
        invoicenumber: "",
        startdate: "",
        enddate: "",
        invoicedate: "",
        invmonth: monthGroup.invmonth,
        quantity: 0,
        otquantity: 0,
        rate: 0,
        overtimerate: 0,
        status: "",
        emppaiddate: "",
        candpaymentstatus: "",
        reminders: "",
        amountexpected: 0,
        expecteddate: "",
        amountreceived: 0,
        receiveddate: "",
        releaseddate: "",
        checknumber: "",
        invoiceurl: "",
        checkurl: "",
        freqtype: "",
        invoicenet: 0,
        companyname: "",
        vendorfax: "",
        vendorphone: "",
        vendoremail: "",
        timsheetemail: "",
        hrname: "",
        hremail: "",
        hrphone: "",
        managername: "",
        manageremail: "",
        managerphone: "",
        secondaryname: "",
        secondaryemail: "",
        secondaryphone: "",
        candidatename: "",
        candidatephone: "",
        candidateemail: "",
        wrkemail: "",
        wrkphone: "",
        recruitername: "",
        recruiterphone: "",
        recruiteremail: "",
        poid: 0,
        notes: "",
        isGroupRow: true,
        level: 0,
        expanded: expandedMonthGroups[monthGroup.invmonth],
      });

      // Add child rows if expanded
      if (expandedMonthGroups[monthGroup.invmonth] && monthGroup.invoices) {
        monthGroup.invoices.forEach((invoice) => {
          rows.push({
            ...invoice,
            name: `${invoice.invoicenumber} - ${monthGroup.invmonth}`,
            isGroupRow: false,
            level: 1,
          });
        });
      }
    });
    
    return rows;
  }, [monthGroups, expandedMonthGroups]);

  const columnDefs = useMemo<ColDef<RowData>[]>(
    () => [
      {
        headerName: "Month",
        field: "name",
        cellRenderer: (params: ICellRendererParams<RowData>) => {
          if (params.data && params.data.isGroupRow) {
            const expanded = params.data.invmonth ? expandedMonthGroups[params.data.invmonth] : false;
            return (
              <div className="flex items-center">
                <span
                  className="cursor-pointer pl-1 flex items-center hover:bg-gray-100 rounded-md py-1 px-2 transition-colors duration-200"
                  onClick={() => params.data && params.data.invmonth ? toggleGroup(params.data.invmonth) : undefined}
                >
                  <span className="mr-2 text-gray-600 flex items-center justify-center w-4 h-4 bg-white border border-gray-300 rounded">
                    {expanded ? (
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="font-medium">{params.value}</span>
                  {/* <span className="ml-2 text-sm text-gray-500">
                    ({params.data.invoice_count || 0} invoices)
                  </span> */}
                </span>
              </div>
            );
          }
          return <span className="pl-8">{params.value}</span>;
        },
        minWidth: 250,
        flex: 1,
      },
      {
        headerName: "Invoice Number",
        field: "invoicenumber",
        hide: false,
        minWidth: 150,
      },
      {
        headerName: "Company",
        field: "companyname",
        hide: false,
        minWidth: 150,
      },
      {
        headerName: "Start Date",
        field: "startdate",
        hide: false,
        minWidth: 120,
      },
      {
        headerName: "End Date",
        field: "enddate",
        hide: false,
        minWidth: 120,
      },
      {
        headerName: "Invoice Date",
        field: "invoicedate",
        hide: false,
        minWidth: 120,
      },
      {
        headerName: "Amount Expected",
        field: "amountexpected",
        hide: false,
        minWidth: 120,
        valueFormatter: (params: { value: number }) => {
          return params.value ? `$${params.value.toFixed(2)}` : '';
        }
      },
      {
        headerName: "Amount Received",
        field: "amountreceived",
        hide: false,
        minWidth: 120,
        valueFormatter: (params: { value: number }) => {
          return params.value ? `$${params.value.toFixed(2)}` : '';
        }
      },
      {
        headerName: "Status",
        field: "status",
        hide: false,
        minWidth: 100,
        cellRenderer: (params: ICellRendererParams<RowData>) => {
          const statusMap: { [key: string]: string } = {
            A: "Active",
            I: "Inactive",
            D: "Delete",
            R: "Rejected",
            N: "Not Interested",
            E: "Excellent",
          };
          return statusMap[params.value as string] || params.value;
        },
      },
      {
        headerName: "Expected Date",
        field: "expecteddate",
        hide: false,
        minWidth: 120,
      },
      {
        headerName: "Received Date",
        field: "receiveddate",
        hide: false,
        minWidth: 120,
      },
      {
        headerName: "Released Date",
        field: "releaseddate",
        hide: false,
        minWidth: 120,
      },
      {
        headerName: "Check Number",
        field: "checknumber",
        hide: false,
        minWidth: 120,
      },
      {
        headerName: "Invoice URL",
        field: "invoiceurl",
        hide: false,
        minWidth: 120,
      },
      {
        headerName: "Check URL",
        field: "checkurl",
        hide: false,
        minWidth: 120,
      },
      {
        headerName: "Freq Type",
        field: "freqtype",
        hide: false,
        minWidth: 100,
      },
      {
        headerName: "Invoice Net",
        field: "invoicenet",
        hide: false,
        minWidth: 100,
      },
    ],
    [expandedMonthGroups]
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleAdd = async (formData: InvoiceData) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/invoices/post/`,
        formData
      );
      showAlert("Invoice added successfully", "success");
      setModalState({ ...modalState, add: false });
      fetchData();
    } catch (error) {
      console.error("Error adding invoice:", error);
    }
  };

  // const handleEdit = async (formData: InvoiceData) => {
  //   try {
  //     await axios.put(
  //       `${process.env.NEXT_PUBLIC_API_URL}/invoices/put/${formData.id}`,
  //       formData
  //     );
  //     showAlert("Invoice updated successfully", "success");
  //     setModalState({ ...modalState, edit: false });
  //     fetchData();
  //   } catch (error) {
  //     showAlert("Error updating invoice", "error");
  //   }
  // };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/invoices/delete/${id}`
        );
        showAlert("Invoice deleted successfully", "success");
        fetchData();
      } catch (error) {
        console.error("Error deleting invoice:", error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : "Unknown error";
        showAlert(`Error deleting invoice: ${errorMessage}`, "error");
      }
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const tableData = rowData
      .filter((row) => !row.isGroupRow && row.id !== -1)
      .map((row) => [
        row.companyname,
        row.invoicenumber,
        row.startdate,
        row.enddate,
        row.invoicedate,
        row.quantity,
        row.otquantity,
        row.rate,
        row.overtimerate,
        row.status,
        row.amountexpected,
        row.expecteddate,
        row.amountreceived,
        row.receiveddate,
      ]);

    autoTable(doc, {
      head: [
        [
          "Company",
          "Invoice Number",
          "Start Date",
          "End Date",
          "Invoice Date",
          "Quantity",
          "OT Quantity",
          "Rate",
          "Overtime Rate",
          "Status",
          "Amount Expected",
          "Expected Date",
          "Amount Received",
          "Received Date",
        ],
      ],
      body: tableData,
      styles: { fontSize: 8 },
      margin: { top: 20 },
    });

    doc.save("invoices-by-month.pdf");
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

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    fetchData();
  };

  const handleSearchParamChange = (field: string, value: string) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // const handleSortChange = (field: string) => {
  //   if (sortField === field) {
  //     setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  //   } else {
  //     setSortField(field);
  //     setSortOrder("asc");
  //   }
  // };

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
        <h1 className="text-3xl font-bold text-gray-800">Invoice Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setModalState({ ...modalState, add: true })}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700"
          >
            <MdAdd className="mr-2" />
          </button>
          <button
            onClick={() => {
              const selectedRows = gridRef.current?.api.getSelectedRows();
              if (selectedRows && selectedRows.length > 0 && !selectedRows[0].isGroupRow) {
                setModalState({
                  ...modalState,
                  edit: true,
                  selectedRow: selectedRows[0],
                });
              } else {
                showAlert("Please select an invoice to edit", "error");
              }
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700"
          >
            <AiOutlineEdit className="mr-2" />
          </button>
          <button
            onClick={() => {
              const selectedRows = gridRef.current?.api.getSelectedRows();
              if (selectedRows && selectedRows.length > 0 && !selectedRows[0].isGroupRow) {
                handleDelete(selectedRows[0].id);
              } else {
                showAlert("Please select an invoice to delete", "error");
              }
            }}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700"
          >
            <MdDelete className="mr-2" />
          </button>
          <button
            onClick={() => {
              const selectedRows = gridRef.current?.api.getSelectedRows();
              if (selectedRows && selectedRows.length > 0 && !selectedRows[0].isGroupRow) {
                setModalState({
                  ...modalState,
                  view: true,
                  selectedRow: selectedRows[0],
                });
              } else {
                showAlert("Please select an invoice to view", "error");
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

      <div className="mb-4">
        <div className="flex mb-2">
          <input
            type="text"
            placeholder="Search by company name..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              handleSearchParamChange('companyname', e.target.value);
            }}
            className="border border-gray-300 rounded-md p-2 w-64"
          />
          <button
            onClick={handleSearch}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md ml-2 transition duration-300 hover:bg-blue-900"
          >
            <AiOutlineSearch className="mr-2" /> Search
          </button>
          <button
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md ml-2 transition duration-300 hover:bg-gray-700"
          >
            {showAdvancedSearch ? "Hide Advanced" : "Advanced Search"}
          </button>
        </div>

        {showAdvancedSearch && (
          <div className="bg-white p-4 rounded-md shadow-md mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                <input
                  type="text"
                  value={searchParams.invoicenumber || ''}
                  onChange={(e) => handleSearchParamChange('invoicenumber', e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <input
                  type="text"
                  value={searchParams.status || ''}
                  onChange={(e) => handleSearchParamChange('status', e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Candidate Name</label>
                <input
                  type="text"
                  value={searchParams.candidatename || ''}
                  onChange={(e) => handleSearchParamChange('candidatename', e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={searchParams.startdate || ''}
                  onChange={(e) => handleSearchParamChange('startdate', e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={searchParams.enddate || ''}
                  onChange={(e) => handleSearchParamChange('enddate', e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                <input
                  type="date"
                  value={searchParams.invoicedate || ''}
                  onChange={(e) => handleSearchParamChange('invoicedate', e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSearchParams({});
                  setSearchValue("");
                  setCurrentPage(1);
                  fetchData();
                }}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mr-2 hover:bg-gray-400"
              >
                Clear
              </button>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        className="ag-theme-alpine relative"
        style={{ height: "400px", width: "100%", overflowY: "auto" }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 z-10">
            <span className="ml-3 text-gray-700 font-medium">Loading...</span>
          </div>
        )}

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
          suppressRowClickSelection={false}
          rowSelection="single"
          rowHeight={30}
          headerHeight={35}
          overlayLoadingTemplate={
            '<span class="ag-overlay-loading-center">Loading...</span>'
          }
          overlayNoRowsTemplate={
            '<span class="ag-overlay-no-rows-center">No rows to show</span>'
          }
          onGridReady={(params) => {
            params.api.sizeColumnsToFit();
          }}
          onSortChanged={(event) => {
            const columnState = event.api.getColumnState();
            if (columnState.length > 0) {
              const sortModel = columnState.find((column) => column.sort);
              if (sortModel) {
                setSortField(sortModel.colId);
                setSortOrder(sortModel.sort || "asc");
              }
            }
          }}
        />
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

          {renderPageNumbers()}

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
        </div>
        <span className="ml-4 text-sm text-gray-600">
          Page {currentPage} of {totalPages} | Total Records:{" "}
          {monthGroups && monthGroups.length > 0
            ? monthGroups.reduce((acc, monthGroup) => acc + monthGroup.invoice_count, 0)
            : 0}
        </span>
      </div>

      <AddRowModal
        isOpen={modalState.add}
        onClose={() => setModalState({ ...modalState, add: false })}
        onSubmit={handleAdd}
      />

      <ViewRowModal
        isOpen={modalState.view}
        onClose={() => setModalState({ ...modalState, view: false })}
        invoice={modalState.selectedRow}
      />

      <EditRowModal
        isOpen={modalState.edit}
        onClose={() => setModalState({ ...modalState, edit: false })}
        rowData={modalState.selectedRow as InvoiceData}
        onSave={fetchData}
        clients={clients}
        defaultClientId={selectedMonth || modalState.selectedRow?.poid || 0}
      />
    </div>
  );
};

export default ByMonth;
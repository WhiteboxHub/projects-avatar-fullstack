"use client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import * as XLSX from "xlsx";
import AddRowModal from "@/modals/bypo_modals/AddRowByPO";
import EditRowModal from "@/modals/bypo_modals/EditRowByPO";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ViewRowModal from "@/modals/bypo_modals/ViewRowByPO";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CellClassParams, ColDef, ICellRendererParams, RowSelectedEvent } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { jsPDF } from "jspdf";
import { AiOutlineEdit, AiOutlineEye, AiOutlineReload, AiOutlineSearch } from "react-icons/ai";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdAdd, MdDelete } from "react-icons/md";

// import { INVOICE_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS, REMINDER_OPTIONS } from "@/types/index";

jsPDF.prototype.autoTable = autoTable;

interface PoGroup {
  poid: number;
  name: string;
  pos: InvoiceData[];
  isGroup: boolean;
  isCollapsed: boolean;
  invoice_count: number;
  summary: {
    amountexpected: number;
    amountreceived: number;
    quantity: number;
  };
}

interface InvoiceData {
  id: number;
  invoicenumber: string;
  startdate: string;
  enddate: string;
  invoicedate: string;
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

interface RowData extends InvoiceData {
  name: string;
  isGroupRow?: boolean;
  isSummaryRow?: boolean;
  level?: number;
  expanded?: boolean;
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

interface SortState {
  field: string;
  order: string;
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
      <div className="bg-white rounded-lg p-4 sm:p-6 max-w-xs sm:max-w-md w-full shadow-xl mx-2">
        <div className="text-center">
          <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">{message}</h3>
          <button
            onClick={onClose}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const ByPo = () => {
  const gridRef = useRef<AgGridReact<RowData>>(null);
  const [modalState, setModalState] = useState<ModalState>({
    add: false,
    view: false,
    edit: false,
    selectedRow: null,
  });
  const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [poGroups, setPoGroups] = useState<PoGroup[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<{[key: number]: boolean}>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<{ id: number; pname: string }[]>([]);
  const [selectedPoId, setSelectedPoId] = useState<number | null>(null);
  const [sortState] = useState<SortState>({
    field: "invoicedate",
    order: "desc",
  });
  const [notificationModal, setNotificationModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: "" });
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [, setSelectedRowId] = useState<number | null>(null);
  const pageSize = 100;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showAlert = (text: string, type: "success" | "error") => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 3000);
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/invoices-po`,
        {
          params: {
            page: currentPage,
            page_size: pageSize,
            search: debouncedSearchValue || undefined,
            po_id: selectedPoId || undefined,
            sort_field: sortState.field,
            sort_order: sortState.order,
          },
        }
      );
      
      const newPoGroups = response.data.data.map((group: PoGroup) => ({
        ...group,
        isCollapsed: expandedGroups[group.poid] === undefined ? false : !expandedGroups[group.poid]
      }));
      
      setPoGroups(newPoGroups);
      setTotalPages(response.data.pages);
      setTotalRecords(response.data.total);
    } catch (error) {
      console.error("Error fetching data:", error);
      showAlert("Error loading data", "error");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchValue, selectedPoId, sortState, expandedGroups]);

  const fetchClients = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/invoices/selection`
      );
      setClients(response.data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchClients();
  }, [fetchData, fetchClients]);

  const toggleGroup = useCallback((poId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedGroups(prev => ({
      ...prev,
      [poId]: !prev[poId]
    }));
    setSelectedPoId(prev => prev === poId ? null : poId);
  }, []);

  // const handleSortChange = (field: string) => {
  //   setSortState((prev) => ({
  //     field,
  //     order: prev.field === field ? (prev.order === "asc" ? "desc" : "asc") : "desc",
  //   }));
  // };

  const rowData = useMemo(() => {
    const rows: RowData[] = [];
    poGroups.forEach((poGroup) => {
      rows.push({
        id: poGroup.poid,
        name: poGroup.name,
        invoicenumber: "",
        startdate: "",
        enddate: "",
        invoicedate: "",
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
        poid: poGroup.poid,
        notes: "",
        isGroupRow: true,
        level: 0,
        expanded: expandedGroups[poGroup.poid],
      });

      if (expandedGroups[poGroup.poid]) {
        poGroup.pos.forEach((invoice) => {
          rows.push({
            ...invoice,
            name: `${invoice.id}`,
            isGroupRow: false,
            level: 1,
          });
        });

        rows.push({
          id: -1,
          name: "Summary",
          invoicenumber: "",
          startdate: "",
          enddate: "",
          invoicedate: "",
          quantity: poGroup.summary.quantity,
          otquantity: 0,
          rate: 0,
          overtimerate: 0,
          status: "",
          emppaiddate: "",
          candpaymentstatus: "",
          reminders: "",
          amountexpected: poGroup.summary.amountexpected,
          expecteddate: "",
          amountreceived: poGroup.summary.amountreceived,
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
          poid: poGroup.poid,
          notes: "",
          isGroupRow: false,
          isSummaryRow: true,
          level: 1,
        });
      }
    });
    return rows;
  }, [poGroups, expandedGroups]);

  const getColumnWidth = (field: string) => {
    if (windowWidth < 640) return field === 'name' ? 120 : 80;
    else if (windowWidth < 1024) return field === 'name' ? 150 : 100;
    else return field === 'name' ? 200 : 120;
  };

  const onRowSelected = useCallback((event: RowSelectedEvent<RowData>) => {
    if (event.node.isSelected() && event.data && !event.data.isGroupRow && !event.data.isSummaryRow) {
      setSelectedRowId(event.data.id);
    }
  }, []);

  const nameColumnRenderer = useCallback((params: ICellRendererParams<RowData>) => {
    if (!params.data) return null;
    
    if (params.data.isGroupRow) {
      const expanded = expandedGroups[params.data.poid];
      return (
        <div className="flex items-center">
          <span
            className="cursor-pointer pl-1 flex items-center hover:bg-gray-100 rounded-md py-1 px-2 transition-colors duration-200"
            onClick={(e) => params.data && toggleGroup(params.data.poid, e)}
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
    if (params.data.isSummaryRow) {
      return <span className="pl-3 font-semibold">{params.value}</span>;
    }
    return <span className="pl-3">{params.data.id}</span>;
  }, [expandedGroups, toggleGroup]);

  const columnDefs = useMemo<ColDef<RowData>[]>(
    () => [
      {
        headerName: "Name",
        field: "name",
        cellRenderer: nameColumnRenderer,
        minWidth: getColumnWidth('name'),
        flex: 1,
        suppressSizeToFit: windowWidth < 1024,
        cellClass: (params) => {
          if (params.data?.isGroupRow) return 'group-row';
          if (params.data?.isSummaryRow) return 'summary-row';
          return '';
        }
      },
      {
        headerName: "Invoice Number",
        field: "invoicenumber",
        hide: windowWidth < 768,
        minWidth: getColumnWidth('invoicenumber'),
        valueFormatter: (params) => params.value || '',
      },
      {
        headerName: "Start Date",
        field: "startdate",
        hide: windowWidth < 768,
        minWidth: getColumnWidth('startdate'),
        sortable: true,
        headerClass: "cursor-pointer",
        valueFormatter: (params) => params.value || '',
      },
      {
        headerName: "End Date",
        field: "enddate",
        hide: windowWidth < 768,
        minWidth: getColumnWidth('enddate'),
        sortable: true,
        headerClass: "cursor-pointer",
        valueFormatter: (params) => params.value || '',
      },
      {
        headerName: "Invoice Date",
        field: "invoicedate",
        minWidth: getColumnWidth('invoicedate'),
        sortable: true,
        headerClass: "cursor-pointer",
        valueFormatter: (params) => params.value || '',
      },
      {
        headerName: "Quantity",
        field: "quantity",
        minWidth: getColumnWidth('quantity'),
        cellStyle: (params: CellClassParams<RowData>) => {
          if (params.data?.isSummaryRow) return { fontWeight: "bold" };
          return null;
        },
        valueFormatter: (params) => params.value === 0 && !params.data?.isSummaryRow ? '' : params.value,
      },
      {
        headerName: "Amount Expected",
        field: "amountexpected",
        minWidth: getColumnWidth('amountexpected'),
        cellStyle: (params: CellClassParams<RowData>) => {
          if (params.data?.isSummaryRow) return { fontWeight: "bold" };
          return null;
        },
        valueFormatter: (params) => params.value === 0 && !params.data?.isSummaryRow ? '' : params.value,
      },
      {
        headerName: "Amount Received",
        field: "amountreceived",
        minWidth: getColumnWidth('amountreceived'),
        cellStyle: (params: CellClassParams<RowData>) => {
          if (params.data?.isSummaryRow) return { fontWeight: "bold" };
          return null;
        },
        valueFormatter: (params) => params.value === 0 && !params.data?.isSummaryRow ? '' : params.value,
      },
      {
        headerName: "Status",
        field: "status",
        minWidth: getColumnWidth('status'),
        cellRenderer: (params: ICellRendererParams<RowData>) => {
          const statusMap: { [key: string]: string } = {
            A: "Active",
            I: "Inactive",
            D: "Delete",
            R: "Rejected",
            N: "Not Interested",
            E: "Excellent",
          };
          return statusMap[params.value] || params.value || '';
        },
      },
      {
        headerName: "Company Name",
        field: "companyname",
        minWidth: getColumnWidth('companyname'),
        sortable: true,
        headerClass: "cursor-pointer",
        valueFormatter: (params) => params.value || '',
      },
      {
        headerName: "Candidate Name",
        field: "candidatename",
        minWidth: getColumnWidth('candidatename'),
        sortable: true,
        headerClass: "cursor-pointer",
        valueFormatter: (params) => params.value || '',
      },
    ],
    [expandedGroups, nameColumnRenderer, windowWidth]
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-md mx-0.5 ${
            currentPage === i
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }
    
    return pageNumbers;
  };

  const handleAdd = async (formData: InvoiceData) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/invoices/bypo/post/`,
        formData
      );
      showNotification("Invoice added successfully");
      setModalState({ ...modalState, add: false });
      fetchData();
    } catch (error) {
      console.error("Error adding invoice:", error);
      showNotification("Error adding invoice");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/invoices/bypo/delete/${id}`
        );
        showNotification("Invoice deleted successfully");
        fetchData();
      } catch (error) {
        console.error("Error deleting invoice:", error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : "Unknown error";
        showNotification(`Error deleting invoice: ${errorMessage}`);
      }
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const tableData = rowData
      .filter((row) => !row.isGroupRow && row.id !== -1 && !row.isSummaryRow)
      .map((row) => [
        row.companyname,
        row.name,
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
        row.releaseddate,
        row.checknumber,
        row.invoiceurl,
        row.checkurl,
        row.freqtype,
        row.invoicenet,
        row.vendorfax,
        row.vendorphone,
        row.vendoremail,
        row.timsheetemail,
        row.hrname,
        row.hremail,
        row.hrphone,
        row.managername,
        row.manageremail,
        row.managerphone,
        row.secondaryname,
        row.secondaryemail,
        row.secondaryphone,
        row.candidatename,
        row.candidatephone,
        row.candidateemail,
        row.wrkemail,
        row.wrkphone,
        row.recruitername,
        row.recruiterphone,
        row.recruiteremail,
        row.notes,
      ]);

    autoTable(doc, {
      head: [
        [
          "Company",
          "Name",
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
          "Released Date",
          "Check Number",
          "Invoice URL",
          "Check URL",
          "Freq Type",
          "Invoice Net",
          "Vendor Fax",
          "Vendor Phone",
          "Vendor Email",
          "Timesheet Email",
          "HR Name",
          "HR Email",
          "HR Phone",
          "Manager Name",
          "Manager Email",
          "Manager Phone",
          "Secondary Name",
          "Secondary Email",
          "Secondary Phone",
          "Candidate Name",
          "Candidate Phone",
          "Candidate Email",
          "Work Email",
          "Work Phone",
          "Recruiter Name",
          "Recruiter Phone",
          "Recruiter Email",
          "Notes",
        ],
      ],
      body: tableData,
      styles: { fontSize: 8 },
      margin: { top: 20 },
    });

    doc.save("invoices-by-po.pdf");
  };

  const handleExportToExcel = () => {
    if (gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows && selectedRows.length > 0 && !selectedRows[0].isGroupRow && !selectedRows[0].isSummaryRow) {
        const ws = XLSX.utils.json_to_sheet(selectedRows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Selected Invoice Data");
        XLSX.writeFile(wb, "Selected_Invoice_data.xlsx");
      } else {
        showNotification("Please select an invoice to export");
      }
    }
  };

  const gridHeight = useMemo(() => {
    const rowHeight = windowWidth < 640 ? 25 : windowWidth < 1024 ? 28 : 30;
    const headerHeight = windowWidth < 640 ? 30 : windowWidth < 1024 ? 32 : 35;
    const maxHeight = windowWidth < 640 ? 300 : windowWidth < 1024 ? 350 : 400;
    const minHeight = 200;
    
    let rowCount = poGroups.length;
    poGroups.forEach(group => {
      if (expandedGroups[group.poid]) {
        rowCount += group.pos.length + 1;
      }
    });
    
    const calculatedHeight = Math.min(
      maxHeight,
      Math.max(minHeight, rowCount * rowHeight + headerHeight + 20)
    );
    
    return `${calculatedHeight}px`;
  }, [poGroups, expandedGroups, windowWidth]);

  const getIconSize = () => {
    if (windowWidth < 640) return "text-xs";
    if (windowWidth < 1024) return "text-sm";
    return "text-base";
  };

  const getButtonPadding = () => {
    if (windowWidth < 640) return "px-1 py-1";
    if (windowWidth < 1024) return "px-1.5 py-1";
    return "px-2 py-1.5";
  };

  const iconSize = getIconSize();
  const buttonPadding = getButtonPadding();

  return (
    <div className="relative">
      {alertMessage && (
        <div
          className={`fixed top-4 right-4 p-4 ${
            alertMessage.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white rounded-md shadow-md z-50`}
        >
          {alertMessage.text}
        </div>
      )}

      <div className="p-2 sm:p-4 mt-16 sm:mt-20 mb-6 sm:mb-10 mx-auto bg-gray-100 rounded-lg shadow-md relative max-w-full sm:max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-3 sm:mb-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Invoice Management</h1>
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
              onClick={() => {
                setCurrentPage(1);
                fetchData();
              }}
              className={`flex items-center ${buttonPadding} bg-blue-600 text-white rounded-md ml-1 sm:ml-2 transition duration-300 hover:bg-blue-900 text-xs sm:text-sm`}
            >
              <AiOutlineSearch className={`mr-1 ${iconSize}`} /> 
              <span className="hidden xs:inline">Search</span>
            </button>
          </div>
        
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setModalState({ ...modalState, add: true })}
              className={`flex items-center justify-center ${buttonPadding} bg-green-600 text-white rounded-md transition duration-300 hover:bg-green-700 text-xs sm:text-sm`}
              title="Add Invoice"
            >
              <MdAdd className={iconSize} />
            </button>
            <button
              onClick={() => {
                const selectedRows = gridRef.current?.api.getSelectedRows();
                if (selectedRows && selectedRows.length > 0 && !selectedRows[0].isGroupRow && !selectedRows[0].isSummaryRow) {
                  setModalState({
                    ...modalState,
                    edit: true,
                    selectedRow: selectedRows[0],
                  });
                } else {
                  showNotification("Please select an invoice to edit");
                }
              }}
              className={`flex items-center justify-center ${buttonPadding} bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700 text-xs sm:text-sm`}
              title="Edit Invoice"
            >
              <AiOutlineEdit className={iconSize} />
            </button>
            <button
              onClick={() => {
                const selectedRows = gridRef.current?.api.getSelectedRows();
                if (selectedRows && selectedRows.length > 0 && !selectedRows[0].isGroupRow && !selectedRows[0].isSummaryRow) {
                  setModalState({
                    ...modalState,
                    view: true,
                    selectedRow: selectedRows[0],
                  });
                } else {
                  showNotification("Please select an invoice to view");
                }
              }}
              className={`flex items-center justify-center ${buttonPadding} bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-700 text-xs sm:text-sm`}
              title="View Invoice"
            >
              <AiOutlineEye className={iconSize} />
            </button>
            <button
              onClick={() => {
                const selectedRows = gridRef.current?.api.getSelectedRows();
                if (selectedRows && selectedRows.length > 0 && !selectedRows[0].isGroupRow && !selectedRows[0].isSummaryRow) {
                  handleDelete(selectedRows[0].id);
                } else {
                  showNotification("Please select an invoice to delete");
                }
              }}
              className={`flex items-center justify-center ${buttonPadding} bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-700 text-xs sm:text-sm`}
              title="Delete Invoice"
            >
              <MdDelete className={iconSize} />
            </button>
            <button
              onClick={() => {
                setSearchValue("");
                fetchData();
              }}
              className={`flex items-center justify-center ${buttonPadding} bg-gray-500 text-white rounded-md transition duration-300 hover:bg-gray-900 text-xs sm:text-sm`}
              title="Refresh"
            >
              <AiOutlineReload className={iconSize} />
            </button>
            <button
              onClick={handleDownloadPDF}
              className={`flex items-center justify-center ${buttonPadding} bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700`}
              title="Download PDF"
            >
              <FontAwesomeIcon icon={faFilePdf} className={iconSize} />
            </button>
            <button
              onClick={handleExportToExcel}
              className={`flex items-center justify-center ${buttonPadding} bg-purple-600 text-white rounded-md transition duration-300 hover:bg-purple-700`}
              title="Export to Excel"
            >
              <FontAwesomeIcon icon={faFileExcel} className={iconSize} />
            </button>
          </div>
        </div>
      
        <div 
          className="ag-theme-alpine relative"
          style={{ 
            height: gridHeight, 
            width: "100%", 
            overflowY: "auto",
            fontSize: windowWidth < 640 ? '10px' : windowWidth < 1024 ? '12px' : '14px'
          }}
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
              editable: true,
              resizable: true,
              cellStyle: { 
                color: "#333", 
                fontSize: windowWidth < 640 ? "0.65rem" : windowWidth < 1024 ? "0.7rem" : "0.75rem", 
                padding: windowWidth < 640 ? "0px" : "1px" 
              },
              minWidth: windowWidth < 640 ? 60 : windowWidth < 1024 ? 70 : 80,
              maxWidth: windowWidth < 640 ? 100 : windowWidth < 1024 ? 120 : 150,
            }}
            rowSelection="single"
            onRowSelected={onRowSelected}
            suppressCellFocus={true}
            enableCellTextSelection={true}
            ensureDomOrder={true}
            rowHeight={windowWidth < 640 ? 25 : windowWidth < 1024 ? 28 : 30}
            headerHeight={windowWidth < 640 ? 30 : windowWidth < 1024 ? 32 : 35}
            overlayLoadingTemplate={
              '<span class="ag-overlay-loading-center">Loading...</span>'
            }
            overlayNoRowsTemplate={
              '<span class="ag-overlay-no-rows-center">No rows to show</span>'
            }
            onGridReady={(params) => {
              params.api.sizeColumnsToFit();
            }}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-3 sm:mt-4">
          <div className="flex items-center justify-center w-full md:w-auto overflow-x-auto">
            <div className="flex space-x-1 overflow-x-auto">
              <button 
                onClick={() => handlePageChange(1)} 
                disabled={currentPage === 1}
                className="p-1 sm:p-2 disabled:opacity-50 text-xs sm:text-sm"
                title="First Page"
              >
                <FaAngleDoubleLeft className={iconSize} />
              </button>
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                className="p-1 sm:p-2 disabled:opacity-50 text-xs sm:text-sm"
                title="Previous Page"
              >
                <FaChevronLeft className={iconSize} />
              </button>

              {renderPageNumbers()}

              <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="p-1 sm:p-2 disabled:opacity-50 text-xs sm:text-sm"
                title="Next Page"
              >
                <FaChevronRight className={iconSize} />
              </button>
              <button 
                onClick={() => handlePageChange(totalPages)} 
                disabled={currentPage === totalPages}
                className="p-1 sm:p-2 disabled:opacity-50 text-xs sm:text-sm"
                title="Last Page"
              >
                <FaAngleDoubleRight className={iconSize} />
              </button>
            </div>
          </div>
          <span className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-0">
            Page {currentPage} of {totalPages} | Total Records: {totalRecords}
          </span>
        </div>

        <AddRowModal
          isOpen={modalState.add}
          onClose={() => setModalState({ ...modalState, add: false })}
          onSubmit={handleAdd}
          clients={clients}
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
          defaultClientId={selectedPoId || modalState.selectedRow?.poid || 0}
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

export default ByPo;
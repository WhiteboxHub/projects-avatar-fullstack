import React from 'react';
import Modal from 'react-modal';
import { ByMonth } from '@/types'; // Adjust the import path accordingly

interface ViewRowModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  rowData: ByMonth; // Use the actual type for your row data
}

const ByMonthViewRowModal: React.FC<ViewRowModalProps> = ({ isOpen, onRequestClose, rowData }) => {
  // Format date fields
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency fields
  const formatCurrency = (amount: number | string | null) => {
    if (amount === null || amount === undefined) return 'N/A';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };

  // Group fields into logical sections
  const fieldGroups = [
    {
      title: 'Basic Information',
      fields: [
        { key: 'id', label: 'ID', format: (value: any) => value },
        { key: 'poid', label: 'PO ID', format: (value: any) => value },
        { key: 'invoicenumber', label: 'Invoice Number', format: (value: any) => value },
        { key: 'invmonth', label: 'Invoice Month', format: (value: any) => value },
        { key: 'status', label: 'Status', format: (value: any) => value },
      ]
    },
    {
      title: 'Date Information',
      fields: [
        { key: 'startdate', label: 'Start Date', format: formatDate },
        { key: 'enddate', label: 'End Date', format: formatDate },
        { key: 'invoicedate', label: 'Invoice Date', format: formatDate },
        { key: 'emppaiddate', label: 'Employee Paid Date', format: formatDate },
        { key: 'expecteddate', label: 'Expected Date', format: formatDate },
        { key: 'receiveddate', label: 'Received Date', format: formatDate },
        { key: 'releaseddate', label: 'Released Date', format: formatDate },
      ]
    },
    {
      title: 'Financial Information',
      fields: [
        { key: 'quantity', label: 'Quantity', format: (value: any) => value },
        { key: 'otquantity', label: 'OT Quantity', format: (value: any) => value },
        { key: 'rate', label: 'Rate', format: formatCurrency },
        { key: 'overtimerate', label: 'OT Rate', format: formatCurrency },
        { key: 'amountexpected', label: 'Amount Expected', format: formatCurrency },
        { key: 'amountreceived', label: 'Amount Received', format: formatCurrency },
        { key: 'invoicenet', label: 'Invoice Net', format: formatCurrency },
        { key: 'checknumber', label: 'Check Number', format: (value: any) => value },
      ]
    },
    {
      title: 'Contact Information',
      fields: [
        { key: 'companyname', label: 'Company Name', format: (value: any) => value },
        { key: 'vendorphone', label: 'Vendor Phone', format: (value: any) => value },
        { key: 'vendoremail', label: 'Vendor Email', format: (value: any) => value },
        { key: 'timsheetemail', label: 'Timesheet Email', format: (value: any) => value },
        { key: 'hrname', label: 'HR Name', format: (value: any) => value },
        { key: 'hremail', label: 'HR Email', format: (value: any) => value },
        { key: 'hrphone', label: 'HR Phone', format: (value: any) => value },
        { key: 'managername', label: 'Manager Name', format: (value: any) => value },
        { key: 'manageremail', label: 'Manager Email', format: (value: any) => value },
        { key: 'managerphone', label: 'Manager Phone', format: (value: any) => value },
        { key: 'recruitername', label: 'Recruiter Name', format: (value: any) => value },
        { key: 'recruiteremail', label: 'Recruiter Email', format: (value: any) => value },
        { key: 'recruiterphone', label: 'Recruiter Phone', format: (value: any) => value },
        { key: 'candidatename', label: 'Candidate Name', format: (value: any) => value },
        { key: 'candidateemail', label: 'Candidate Email', format: (value: any) => value },
        { key: 'candidatephone', label: 'Candidate Phone', format: (value: any) => value },
      ]
    },
    {
      title: 'Additional Information',
      fields: [
        { key: 'freqtype', label: 'Frequency Type', format: (value: any) => value },
        { key: 'candpaymentstatus', label: 'Candidate Payment Status', format: (value: any) => value },
        { key: 'reminders', label: 'Reminders', format: (value: any) => value },
        {
          key: 'invoiceurl',
          label: 'Invoice URL',
          format: (value: any) => value ? (
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              View Invoice
            </a>
          ) : 'N/A'
        },
        {
          key: 'checkurl',
          label: 'Check URL',
          format: (value: any) => value ? (
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              View Check
            </a>
          ) : 'N/A'
        },
        { key: 'notes', label: 'Notes', format: (value: any) => value || 'N/A' },
      ]
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false} // Ensure the modal does not hide the app content
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, -50%)',
          maxWidth: '800px',
          width: '90%',
          maxHeight: '80vh',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          overflowY: 'auto',
          fontFamily: 'Arial, sans-serif',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      contentLabel="View Invoice Details"
    >
      <div className="modal-header flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Invoice Details {rowData?.invoicenumber && `- ${rowData.invoicenumber}`}
        </h1>
        <button
          className="text-2xl font-semibold text-gray-500 hover:text-gray-700 transition"
          onClick={onRequestClose}
        >
          ×
        </button>
      </div>

      <div className="modal-body">
        {rowData ? (
          <div className="space-y-6">
            {fieldGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="border border-gray-200 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-3 text-blue-700">{group.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.fields.map((field, fieldIndex) => (
                    <div key={fieldIndex} className="modal-field">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        {field.label}
                      </label>
                      <div className="text-gray-800 bg-gray-50 p-2 rounded-md break-words">
                        {field.format(rowData[field.key as keyof ByMonth])}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No data available</p>
        )}
      </div>

      <div className="modal-actions flex justify-end mt-6">
        <button
          type="button"
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
          onClick={onRequestClose}
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ByMonthViewRowModal;

import Modal from "react-modal";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Po } from "../../types/index";

interface ViewRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowData: Po | null;
}

const ViewRowPo: React.FC<ViewRowModalProps> = ({ isOpen, onClose, rowData }) => {
  // Function to format field names for display
  const formatFieldName = (field: string) => {
    return field
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      .replace(/Id/g, 'ID') // Special case for ID
      .replace(/Url/g, 'URL'); // Special case for URL
  };

  // Function to format values based on field type
  const formatValue = (key: string, value: any) => {
    if (value === null || value === undefined) return 'N/A';
    
    // Format currency fields
    if (key === 'Rate' || key === 'OvertimeRate' || key === 'InvoiceNet') {
      if (value === 0 && key === 'OvertimeRate') return 'N/A';
      return `$${parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    }
    
    // Format date fields
    if (key === 'StartDate' || key === 'EndDate' || key === 'InvoiceStartDate') {
      if (!value) return 'N/A';
      try {
        const date = new Date(value);
        if (isNaN(date.getTime())) return 'N/A';
        return date.toISOString().split('T')[0];
      } catch (e) {
        return 'N/A';
      }
    }
    
    // Format frequency type
    if (key === 'FreqType') {
      const freqTypes: Record<string, string> = {
        'M': 'MONTHLY',
        'W': 'WEEKLY',
        'D': 'DAYS'
      };
      return freqTypes[value] || value;
    }
    
    return value.toString();
  };

  return (
    <Modal
      isOpen={isOpen}
      style={{
        content: {
          top: '15%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, 0)',
          overflowY: 'auto',
          maxHeight: '80vh',
          width: '60%', // Increased width for better readability
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      contentLabel="View Row Modal"
      ariaHideApp={false}
    >
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-gray-500 hover:text-gray-800 transition duration-200"
        >
          <AiOutlineClose size={24} />
        </button>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-6">PO Details</h2>

      {rowData ? (
        <div className="space-y-4">
          {Object.entries(rowData).map(([key, value]) => (
            <div key={key} className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-3 font-medium text-gray-700">
                {formatFieldName(key)}:
              </div>
              <div className="col-span-9">
                {key.toLowerCase().includes('url') && value ? (
                  <a 
                    href={value as string} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 underline break-all"
                  >
                    {formatValue(key, value)}
                  </a>
                ) : (
                  <div className="p-2 bg-gray-50 rounded border border-gray-200 break-all">
                    {formatValue(key, value)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No data available</p>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ViewRowPo;
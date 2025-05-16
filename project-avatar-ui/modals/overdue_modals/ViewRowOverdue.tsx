import Modal from "react-modal";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";

interface OverdueViewType {
  pkid?: number;
  candidateid?: number;
  candidatename?: string;
  clientname?: string;
  startdate?: string;
  enddate?: string;
  invoicedate?: string;
  // amountexpected?: string;
  // amountreceived?: string;
  // expecteddate?: string;
  amountexpected?: string | number;
  amountreceived?: string | number;
  receiveddate?: string;
  checknumber?: string;
  status?: string;
  notes?: string;
  serialNo?: number;
  poid?: string;
  invoicenumber?: string;
  // quantity?: string;
  quantity?: string | number;
  rate?: number;
  remindertype?: string;
  releaseddate?: string;
  invoiceurl?: string;
  checkurl?: string;
  companyname?: string;
  vendorfax?: string;
  candidatephone?: string;
  candidateemail?: string;
  wrkemail?: string;
  wrkphone?: string;
  recruitername?: string;
  recruiterphone?: string;
  recruiteremail?: string;
  [key: string]: string | number | undefined;
}

interface ViewRowOverdueProps {
  isOpen: boolean;
  onClose: () => void;
  rowData: OverdueViewType | null;
}

const ViewRowOverdue: React.FC<ViewRowOverdueProps> = ({ isOpen, onClose, rowData }) => {
  
return (
  <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    style={{
      content: {
        top: '55%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        maxWidth: '400px',
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
    contentLabel="View Overdue Modal"
    ariaHideApp={false}
  >
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
      >
        &times;
      </button>
    </div>
    <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Overdue Details</h2>

    <div className="modal-body">
      {rowData ? (
        <div className="space-y-4">
          {Object.keys(rowData).map((key) => (
            <div key={key} className="modal-field">
              <label htmlFor={key} className="block text-sm font-semibold text-gray-700 mb-1">
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              <p className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50">
                {rowData[key] !== undefined ? String(rowData[key]) : 'N/A'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No data available</p>
      )}
    </div>
    <div className="modal-actions">
      <button
        type="button"
        onClick={onClose}
        className="mt-2 w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition duration-200"
      >
        Cancel
      </button>
    </div>
  </Modal>
);

};

export default ViewRowOverdue;

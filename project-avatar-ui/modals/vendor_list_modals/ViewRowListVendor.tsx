import React from 'react';
import Modal from 'react-modal';
import { AiOutlineClose } from 'react-icons/ai';

interface Vendor {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  designation?: string;
  vendorid?: string;
  comp?: string;
  status?: string;
  dob?: string;
  personalemail?: string;
  skypeid?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  review?: string;
  notes?: string;
}

interface ViewRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowData: Vendor | null;
}

const ViewRowModal: React.FC<ViewRowModalProps> = ({ isOpen, onClose, rowData }) => {
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
      ariaHideApp={false}
    >
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
        >
          <AiOutlineClose />
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">View Vendor</h2>

      <div className="space-y-4">
        {rowData ? (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
              <p className="text-sm text-gray-600">{rowData.name || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <p className="text-sm text-gray-600">{rowData.email || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
              <p className="text-sm text-gray-600">{rowData.phone || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Designation</label>
              <p className="text-sm text-gray-600">{rowData.designation || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Vendor ID</label>
              <p className="text-sm text-gray-600">{rowData.vendorid || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
              <p className="text-sm text-gray-600">{rowData.comp || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <p className="text-sm text-gray-600">{rowData.status || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
              <p className="text-sm text-gray-600">{rowData.dob || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Personal Email</label>
              <p className="text-sm text-gray-600">{rowData.personalemail || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Skype ID</label>
              <p className="text-sm text-gray-600">{rowData.skypeid || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">LinkedIn</label>
              <p className="text-sm text-gray-600">{rowData.linkedin || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Twitter</label>
              <p className="text-sm text-gray-600">{rowData.twitter || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Facebook</label>
              <p className="text-sm text-gray-600">{rowData.facebook || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Review</label>
              <p className="text-sm text-gray-600">{rowData.review || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
              <p className="text-sm text-gray-600">{rowData.notes || 'N/A'}</p>
            </div>
          </>
        ) : (
          <p className="text-gray-600">No data available</p>
        )}
      </div>
    </Modal>
  );
};

export default ViewRowModal;
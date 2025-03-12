import React from 'react';
import Modal from 'react-modal';
import { AiOutlineClose } from 'react-icons/ai';

interface Url {
  id?: string;
  url?: string;
}

interface ViewRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowData: Url; // Changed 'data' to 'rowData'
}

const ViewRowModal: React.FC<ViewRowModalProps> = ({ isOpen, onClose, rowData }) => { // Updated 'data' to 'rowData'
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
    >
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
        >
          &times;
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">View URL</h2>

      <div className="space-y-4">
        {/* ID */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">ID</label>
          <p className="text-sm text-gray-600">{rowData.id}</p> {/* Updated 'data' to 'rowData' */}
        </div>

        {/* URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">URL</label>
          <p className="text-sm text-gray-600">{rowData.url}</p> {/* Updated 'data' to 'rowData' */}
        </div>
      </div>
    </Modal>
  );
};

export default ViewRowModal;

import React from 'react';
import Modal from 'react-modal';
import { Lead } from '@/types/index';

interface ViewRowModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  rowData: Lead | null;
}

const ViewRowModal: React.FC<ViewRowModalProps> = ({ isOpen, onRequestClose, rowData }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
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
          onClick={onRequestClose}
          className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
        >
          &times;
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">View Lead</h2>
      
      <div className="space-y-4">
        {rowData && Object.entries(rowData).map(([key, value]) => (
          <div key={key} className="modal-field">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <div className="w-full px-3 py-2 text-sm bg-gray-100 rounded-md">
              {value || 'N/A'}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default ViewRowModal;
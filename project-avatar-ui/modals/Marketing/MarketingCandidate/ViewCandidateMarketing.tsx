import React from 'react';
import Modal from 'react-modal';
import { CandidateMarketing } from '@/types/index'; // Adjust the import path accordingly

interface ViewEmployeeProps {
  isOpen: boolean;
  onRequestClose: () => void;
  rowData: CandidateMarketing | null;
}

const ViewEmployee: React.FC<ViewEmployeeProps> = ({ isOpen, onRequestClose, rowData }) => {
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
          maxWidth: '600px',
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
      contentLabel="View Employee Modal"
      ariaHideApp={false}
    >
      <div className="flex justify-between items-center mb-6  ">
      <h2 className="text-2xl font-bold  text-gray-800 pr-8">Candidate Details</h2>
      <button
          onClick={onRequestClose}
          className="text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
        >
          &times;
        </button>
      </div>
      
      <div className="modal-body">
        {rowData ? (
          <div className="space-y-4">
            {Object.keys(rowData).map((key) => (
              <div key={key} className="modal-field">
                <label htmlFor={key} className="block text-sm font-semibold text-gray-700 mb-1">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                </label>
                <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                  {rowData[key as keyof CandidateMarketing]}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No data available</p>
        )}
      </div>
    </Modal>
  );
};

export default ViewEmployee;

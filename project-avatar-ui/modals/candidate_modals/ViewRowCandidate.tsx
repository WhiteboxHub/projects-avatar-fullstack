import React from 'react';
import Modal from 'react-modal';
import { Candidate } from '@/types';
// import { AiOutlineClose } from 'react-icons/ai'; // Adjust the import path accordingly

interface ViewRowCandidateProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestClose: () => void;
  rowData: Candidate | null;
}

const ViewRowCandidate: React.FC<ViewRowCandidateProps> = ({ isOpen, onClose, rowData }) => {
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
      contentLabel="View Row Modal"
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Candidate Details</h2>
      <div className="modal-body">
        {rowData ? (
          <div className="space-y-4">
            {Object.keys(rowData).map(key => (
              <div key={key} className="modal-field">
                <label htmlFor={key} className="block text-sm font-semibold text-gray-700 mb-1">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                </label>
                <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200">
                  {rowData[key as keyof Candidate]}
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

export default ViewRowCandidate;

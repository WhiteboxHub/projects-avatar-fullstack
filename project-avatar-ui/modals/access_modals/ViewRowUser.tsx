import React from 'react';
import Modal from 'react-modal';
import { User } from '@/types'; // Adjust the import path accordingly

interface ViewRowModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  rowData: User | null;
}

const UserViewRowModal: React.FC<ViewRowModalProps> = ({ isOpen, onRequestClose, rowData }) => {
  const customStyles: ReactModal.Styles = {
    content: {
      top: '15%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, 0)',
      overflowY: 'auto',
      maxHeight: '80vh',
      width: '90%',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    },
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      // style={}
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
    >
      <div className="modal-header flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Details</h1>
        <button className="text-2xl font-semibold text-red-500 hover:text-red-700 transition" onClick={onRequestClose}>
          &times;
        </button>
      </div>
  
      <div className="modal-body">
        {rowData ? (
          <div className="grid grid-cols-2 gap-6">
            {Object.keys(rowData).map((key) => (
              <div key={key} className="modal-field">
                <label htmlFor={key} className="block text-sm font-bold text-gray-700 mb-1">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                </label>
                <p className="text-gray-700 bg-gray-100 p-2 rounded-md">{rowData[key as keyof User] || 'N/A'}</p>
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
          className="mt-2 w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition duration-200"
          onClick={onRequestClose}
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default UserViewRowModal;

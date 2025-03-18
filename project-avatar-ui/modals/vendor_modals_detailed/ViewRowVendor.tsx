import React from 'react';
import Modal from 'react-modal';
import { Placement } from '../../types/index'; // Adjust the import path accordingly
import { AiOutlineClose } from 'react-icons/ai'; // Adjust the import path accordingly

interface ViewRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowData: Placement | null;
}

const ViewRowVendor: React.FC<ViewRowModalProps> = ({ isOpen, onClose, rowData }) => {
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
          width: '40%',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      contentLabel="View Placement Modal"
      ariaHideApp={false} // Disable aria app for accessibility if needed
    >
      <div className="">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-0 text-gray-500 hover:text-gray-800 transition duration-200"
          >
            <AiOutlineClose size={24} />
          </button>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Placement Details</h2>
      </div>
      <div className="modal-body">
        {rowData ? (
          <div>
            {Object.keys(rowData).map(key => (
              <div key={key} className="modal-field">
                <label htmlFor={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                </label>
                <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                  {rowData[key as keyof Placement]} {/* Correct type access */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No data available</p>
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

export default ViewRowVendor;

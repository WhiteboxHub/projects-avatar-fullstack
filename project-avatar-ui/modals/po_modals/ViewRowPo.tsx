import React from 'react';
import Modal from 'react-modal';
import { Po } from '../../types/index';
import { AiOutlineClose } from 'react-icons/ai'; // Adjust the import path accordingly

interface ViewRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowData: Po | null;
}

const ViewRowPo: React.FC<ViewRowModalProps> = ({ isOpen, onClose, rowData }) => {
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
      contentLabel="View Row Modal"
      ariaHideApp={false}
    >
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-0 text-gray-500 hover:text-gray-800 transition duration-200"
        >
          <AiOutlineClose size={24} />
        </button>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">PO Details</h2>

      <div className="modal-body">
        {rowData ? (
          <div>
            <div className="modal-field">
              <label htmlFor="PO ID">PO ID</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {rowData["POID"]}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Placement ID">Placement ID</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {rowData["PlacementID"]}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Start Date">Start Date</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {rowData["StartDate"]}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="End Date">End Date</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {rowData["EndDate"]}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Rate">Rate</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {rowData["Rate"]}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Overtime Rate">Overtime Rate</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {rowData["OvertimeRate"]}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Freq. Type">Freq. Type</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {rowData["FreqType"]}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Invoice Frequency">Invoice Frequency</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {rowData["InvoiceFrequency"]}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Invoice Start Date">Invoice Start Date</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {rowData["InvoiceStartDate"]}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Invoice Net">Invoice Net</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {rowData["InvoiceNet"]}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="PO Url">PO URL</label>
              <a href={rowData["POUrl"]} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                {rowData["POUrl"]}
              </a>
            </div>

            <div className="modal-field">
              <label htmlFor="Notes">Notes</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {rowData["Notes"]}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Placement Details">Placement Details</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {rowData["PlacementDetails"]}
              </div>
            </div>
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
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ViewRowPo;

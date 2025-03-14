import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { AiOutlineClose } from 'react-icons/ai';
import { Po } from '../../types/index';

interface EditRowModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  rowData: Po | null;
  onSave: () => void;
}

const EditRowPo: React.FC<EditRowModalProps> = ({ isOpen, onRequestClose, rowData, onSave }) => {
  const [formData, setFormData] = useState<Po>({
    id: '',
    PlacementID: '',
    StartDate: '',
    EndDate: '',
    Rate: '',
    OvertimeRate: '',
    FreqType: '',
    InvoiceFrequency: '',
    InvoiceStartDate: '',
    InvoiceNet: '',
    POUrl: '',
    Notes: '',
    PlacementDetails: '',
  });

  useEffect(() => {
    if (rowData) {
      setFormData(rowData);
    }
  }, [rowData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name !== 'POID' && name !== 'PlacementID') {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData) {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL; // Ensure the API URL is set correctly
        const updatedData = { ...formData };
        delete updatedData.id;
        delete updatedData.PlacementID;

        await axios.put(`${API_URL}/po/update/${formData.id}`, updatedData, {
          headers: { AuthToken: localStorage.getItem('token') },
        });
        onSave(); // Call the onSave callback to refresh data or handle post-update actions
        onRequestClose(); // Close the modal after saving
      } catch (error) {
        console.error('Error updating PO:', error);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
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
      contentLabel="Edit PO Modal"
    >
      <div className="">
        <div className="relative">
          <button
            onClick={onRequestClose}
            className="absolute top-4 right-0 text-gray-500 hover:text-gray-800 transition duration-200"
          >
            <AiOutlineClose size={24} />
          </button>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit PO Details</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* PO ID */}
          <div>
            <label className="block text-gray-700">PO ID</label>
            <input
              type="text"
              name="POID"
              value={formData.id}
              readOnly
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter PO ID"
            />
          </div>

          {/* Placement ID */}
          <div>
            <label className="block text-gray-700">Placement ID</label>
            <input
              type="text"
              name="PlacementID"
              value={formData.PlacementID}
              readOnly
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter Placement ID"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-gray-700">Start Date</label>
            <input
              type="date"
              name="StartDate"
              value={formData.StartDate ? new Date(formData.StartDate).toISOString().split('T')[0] : ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-gray-700">End Date</label>
            <input
              type="date"
              name="EndDate"
              value={formData.EndDate ? new Date(formData.EndDate).toISOString().split('T')[0] : ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Invoice Start Date */}
          <div>
            <label className="block text-gray-700">Invoice Start Date</label>
            <input
              type="date"
              name="InvoiceStartDate"
              value={formData.InvoiceStartDate ? new Date(formData.InvoiceStartDate).toISOString().split('T')[0] : ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Rate */}
          <div>
            <label className="block text-gray-700">Rate</label>
            <input
              type="text"
              name="Rate"
              value={formData.Rate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter rate"
            />
          </div>

          {/* Overtime Rate */}
          <div>
            <label className="block text-gray-700">Overtime Rate</label>
            <input
              type="text"
              name="OvertimeRate"
              value={formData.OvertimeRate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter overtime rate"
            />
          </div>

          {/* Freq. Type */}
          <div>
            <label className="block text-gray-700">Freq. Type</label>
            <input
              type="text"
              name="FreqType"
              value={formData.FreqType}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter frequency type"
            />
          </div>

          {/* Invoice Frequency */}
          <div>
            <label className="block text-gray-700">Invoice Frequency</label>
            <input
              type="text"
              name="InvoiceFrequency"
              value={formData.InvoiceFrequency}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter invoice frequency"
            />
          </div>

          {/* Invoice Net */}
          <div>
            <label className="block text-gray-700">Invoice Net</label>
            <input
              type="text"
              name="InvoiceNet"
              value={formData.InvoiceNet}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter invoice net"
            />
          </div>

          {/* PO Url */}
          <div>
            <label className="block text-gray-700">PO URL</label>
            <input
              type="text"
              name="POUrl"
              value={formData.POUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter PO URL"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-gray-700">Notes</label>
            <input
              type="text"
              name="Notes"
              value={formData.Notes}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter notes"
            />
          </div>

          {/* Placement Details */}
          <div>
            <label className="block text-gray-700">Placement Details</label>
            <input
              type="text"
              name="PlacementDetails"
              value={formData.PlacementDetails}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter placement details"
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Save PO
          </button>

          <button
            type="button"
            onClick={onRequestClose}
            className="mt-2 w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Cancel
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default EditRowPo;

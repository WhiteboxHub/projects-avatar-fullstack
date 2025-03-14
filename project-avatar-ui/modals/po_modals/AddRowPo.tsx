import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { AiOutlineClose } from 'react-icons/ai';
import { Po } from '../../types/index';


interface AddRowPOProps {
  isOpen: boolean;
  onClose: () => void;
  refreshData: () => void;
}

const AddRowPO: React.FC<AddRowPOProps> = ({ isOpen, onClose, refreshData }) => {
  const [formData, setFormData] = useState<Po>({
    PlacementDetails: '',
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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/po/add`, formData, {
        headers: { AuthToken: localStorage.getItem('token') },
      });

      refreshData();
      onClose();
    } catch (error) {
      console.error('Error adding row:', error);
    }
  };

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
      <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Add New PO</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Placement Details */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Placement Details</label>
          <input
            type="text"
            name="PlacementDetails"
            value={formData.PlacementDetails}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter placement details"
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            name="StartDate"
            value={formData.StartDate}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            name="EndDate"
            value={formData.EndDate}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        {/* Rate */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Rate</label>
          <input
            type="text"
            name="Rate"
            value={formData.Rate}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter rate"
          />
        </div>

        {/* Overtime Rate */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Overtime Rate</label>
          <input
            type="text"
            name="OvertimeRate"
            value={formData.OvertimeRate}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter overtime rate"
          />
        </div>

        {/* Frequency Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Frequency Type</label>
          <input
            type="text"
            name="FreqType"
            value={formData.FreqType}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter frequency type"
          />
        </div>

        {/* Invoice Frequency */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Invoice Frequency</label>
          <input
            type="text"
            name="InvoiceFrequency"
            value={formData.InvoiceFrequency}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter invoice frequency"
          />
        </div>

        {/* Invoice Start Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Invoice Start Date</label>
          <input
            type="date"
            name="InvoiceStartDate"
            value={formData.InvoiceStartDate}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        {/* Invoice Net */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Invoice Net</label>
          <input
            type="text"
            name="InvoiceNet"
            value={formData.InvoiceNet}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter invoice net"
          />
        </div>

        {/* PO URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">PO URL</label>
          <input
            type="text"
            name="POUrl"
            value={formData.POUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter PO URL"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
          <input
            type="text"
            name="Notes"
            value={formData.Notes}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter notes"
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
        >
          Save PO
        </button>
      </form>
    </Modal>
  );
};

export default AddRowPO;

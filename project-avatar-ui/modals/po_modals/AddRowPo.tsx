// new-projects-avatar-fullstack/project-avatar-ui/modals/po_modals/AddRowPo.tsx

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
// import { AiOutlineClose } from 'react-icons/ai';
import { Po } from '../../types/index';

interface AddRowPOProps {
  isOpen: boolean;
  onClose: () => void;
  refreshData: () => void;
}

interface PlacementOption {
  id: string;
  name: string;
}

const AddRowPO: React.FC<AddRowPOProps> = ({ isOpen, onClose, refreshData }) => {
  const [formData, setFormData] = useState<Po>({
    PlacementDetails: '',
    StartDate: '0000-00-00',
    EndDate: '0000-00-00',
    Rate: '',
    OvertimeRate: '',
    FreqType: '',
    InvoiceFrequency: '',
    InvoiceStartDate: '0000-00-00',
    InvoiceNet: '',
    POUrl: '',
    Notes: '',
  });

  const [selectedPlacementId, setSelectedPlacementId] = useState<string>('');
  const [placementOptions, setPlacementOptions] = useState<PlacementOption[]>([]);
  const [, setLoadingPlacements] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPlacementOptions();
    }
  }, [isOpen]);

  const fetchPlacementOptions = async () => {
    setLoadingPlacements(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/po/data`, {
        headers: { AuthToken: localStorage.getItem('token') },
      });
      setPlacementOptions(response.data);
    } catch (error) {
      console.error('Error fetching placement options:', error);
    } finally {
      setLoadingPlacements(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // If PlacementDetails is changed, update selectedPlacementId
    if (name === 'PlacementDetails') {
      const selectedPlacement = placementOptions.find(option => option.name === value);
      if (selectedPlacement) {
        setSelectedPlacementId(selectedPlacement.id);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        placementid: parseInt(selectedPlacementId),
        begindate: formData.StartDate || '0000-00-00',
        enddate: formData.EndDate || '0000-00-00',
        rate: formData.Rate ? parseFloat(formData.Rate) : 0,
        overtimerate: formData.OvertimeRate ? parseFloat(formData.OvertimeRate) : 0,
        freqtype: formData.FreqType,
        frequency: formData.InvoiceFrequency ? parseInt(formData.InvoiceFrequency) : 0,
        invoicestartdate: formData.InvoiceStartDate || '0000-00-00',
        invoicenet: formData.InvoiceNet ? parseFloat(formData.InvoiceNet) : 0.0,
        polink: formData.POUrl,
        notes: formData.Notes,
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/po`, payload, {
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
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Placement Details</label>
          <select
            name="PlacementDetails"
            value={formData.PlacementDetails}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="">Select Placement</option>
            {placementOptions.map((option) => (
              <option key={option.id} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
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

        <div>
          <label className="block text-gray-700">Frequency Type</label>
          <select
            name="FreqType"
            value={formData.FreqType}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="Monthly">Monthly</option>
            <option value="Weekly">Weekly</option>
            <option value="Daily">Daily</option>
          </select>
        </div>

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

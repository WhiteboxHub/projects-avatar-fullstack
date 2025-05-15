import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Po } from "../../types/index";

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
    StartDate: '',
    EndDate: '',
    Rate: 0,
    OvertimeRate: null,
    FreqType: 'M',
    InvoiceFrequency: 0,
    InvoiceStartDate: '',
    InvoiceNet: 0,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    if (name === 'Rate' || name === 'InvoiceNet') {
      setFormData({ ...formData, [name]: value === '' ? 0 : parseFloat(value) });
    } else if (name === 'OvertimeRate') {
      setFormData({ ...formData, [name]: value === '' ? null : parseFloat(value) });
    } else if (name === 'InvoiceFrequency') {
      setFormData({ ...formData, [name]: value === '' ? 0 : parseInt(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }

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
        begindate: formData.StartDate || null,
        enddate: formData.EndDate || null,
        rate: formData.Rate,
        overtimerate: formData.OvertimeRate,
        freqtype: formData.FreqType,
        frequency: formData.InvoiceFrequency,
        invoicestartdate: formData.InvoiceStartDate || null,
        invoicenet: formData.InvoiceNet,
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
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Placement Details <span className="text-red-500">*</span>
          </label>
          <select
            name="PlacementDetails"
            value={formData.PlacementDetails || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
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
         <label className="block text-sm font-semibold text-gray-700 mb-1">
           Start Date <span className="text-red-500">*</span>
         </label>
         <input
            type="date"
            name="StartDate"
            value={typeof formData.StartDate === 'string' ? formData.StartDate : ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            name="EndDate"
            value={typeof formData.EndDate === 'string' ? formData.EndDate : ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Rate <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            name="Rate"
            value={formData.Rate || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter rate"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Overtime Rate</label>
          <input
            type="number"
            step="0.01"
            name="OvertimeRate"
            value={formData.OvertimeRate === null ? '' : formData.OvertimeRate}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter overtime rate"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Frequency Type <span className="text-red-500">*</span>
          </label>
          <select
            name="FreqType"
            value={formData.FreqType || 'M'}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
          >
            <option value="M">MONTHLY</option>
            <option value="W">WEEKLY</option>
            <option value="D">DAYS</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Invoice Frequency</label>
          <input
            type="number"
            name="InvoiceFrequency"
            value={formData.InvoiceFrequency || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter invoice frequency"
            min="0"
            max="60"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Invoice Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="InvoiceStartDate"
            value={typeof formData.InvoiceStartDate === 'string' ? formData.InvoiceStartDate : ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Invoice Net <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            name="InvoiceNet"
            value={formData.InvoiceNet || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter invoice net"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">PO URL</label>
          <input
            type="url"
            name="POUrl"
            value={formData.POUrl || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="https://example.com"
            pattern="https?://.+"
            title="URL must start with http:// or https://"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
          <textarea
            name="Notes"
            value={formData.Notes || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter notes"
            rows={4}
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

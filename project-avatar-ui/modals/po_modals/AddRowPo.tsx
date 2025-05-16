import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FREQ_TYPE_OPTIONS, Po } from "../../types/index";

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
    placementid: undefined,
    begindate: '',
    enddate: null,
    rate: 0,
    overtimerate: null,
    freqtype: 'M',
    frequency: 0,
    invoicestartdate: '',
    invoicenet: 0,
    polink: null,
    notes: null,
    placement_details: '',
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
    if (name === 'rate' || name === 'invoicenet') {
      setFormData({ ...formData, [name]: value === '' ? 0 : parseFloat(value) });
    } else if (name === 'overtimerate') {
      setFormData({ ...formData, [name]: value === '' ? null : parseFloat(value) });
    } else if (name === 'frequency') {
      setFormData({ ...formData, [name]: value === '' ? 0 : parseInt(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // If placement_details is changed, update selectedPlacementId
    if (name === 'placement_details') {
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
        begindate: formData.begindate || null,
        enddate: formData.enddate || null,
        rate: formData.rate,
        overtimerate: formData.overtimerate,
        freqtype: formData.freqtype,
        frequency: formData.frequency,
        invoicestartdate: formData.invoicestartdate || null,
        invoicenet: formData.invoicenet,
        polink: formData.polink,
        notes: formData.notes,
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
            name="placement_details"
            value={formData.placement_details || ''}
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
            name="begindate"
            value={typeof formData.begindate === 'string' ? formData.begindate : ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            name="enddate"
            value={typeof formData.enddate === 'string' ? formData.enddate : ''}
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
            name="rate"
            value={formData.rate || ''}
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
            name="overtimerate"
            value={formData.overtimerate === null ? '' : formData.overtimerate}
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
            name="freqtype"
            value={formData.freqtype || 'M'}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
          >
            {FREQ_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Invoice Frequency</label>
          <input
            type="number"
            name="frequency"
            value={formData.frequency || ''}
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
            name="invoicestartdate"
            value={typeof formData.invoicestartdate === 'string' ? formData.invoicestartdate : ''}
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
            name="invoicenet"
            value={formData.invoicenet || ''}
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
            name="polink"
            value={formData.polink || ''}
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
            name="notes"
            value={formData.notes || ''}
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

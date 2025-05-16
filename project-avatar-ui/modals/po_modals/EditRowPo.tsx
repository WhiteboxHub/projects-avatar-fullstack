import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import { FREQ_TYPE_OPTIONS, Po } from "../../types/index";

interface EditRowModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  rowData: Po | null;
  onSave: () => void;
}

interface PlacementOption {
  id: string;
  name: string;
}

const EditRowPo: React.FC<EditRowModalProps> = ({ isOpen, onRequestClose, rowData, onSave }) => {
  const [formData, setFormData] = useState<Po>({
    id: undefined,
    placementid: undefined,
    begindate: '',
    enddate: null,
    rate: 0,
    overtimerate: null,
    freqtype: '',
    frequency: 0,
    invoicestartdate: '',
    invoicenet: 0,
    polink: null,
    notes: null,
    placement_details: '',
  });

  const [placementOptions, setPlacementOptions] = useState<PlacementOption[]>([]);
  const [loadingPlacements, setLoadingPlacements] = useState(false);

  useEffect(() => {
    console.log("Row data received in modal:", rowData);
    
    if (rowData) {
      // Format dates properly for input fields
      const formatDate = (dateString: string | Date | undefined) => {
        if (!dateString) return '';
        try {
          // Handle different date formats
          const date = new Date(dateString);
          if (isNaN(date.getTime())) {
            return '';
          }
          return date.toISOString().split('T')[0];
        } catch (e) {
          console.error("Date formatting error:", e);
          return '';
        }
      };

      // Convert any values to string as needed
      const toString = (value: any) => {
        if (value === null || value === undefined) return '';
        return String(value);
      };

      // Map API response fields to the form fields
      const updatedFormData: Po = {
        id: rowData.id,
        placementid: rowData.placementid,
        placement_details: toString(rowData.placement_details || ''),
        begindate: formatDate(rowData.begindate),
        enddate: rowData.enddate,
        rate: rowData.rate || 0,
        overtimerate: rowData.overtimerate,
        freqtype: toString(rowData.freqtype || ''),
        frequency: rowData.frequency || 0,
        invoicestartdate: formatDate(rowData.invoicestartdate),
        invoicenet: rowData.invoicenet || 0,
        polink: rowData.polink,
        notes: rowData.notes,
      };
      
      console.log("Setting form data to:", updatedFormData);
      setFormData(updatedFormData);
    }
  }, [rowData]);

  // Separate useEffect for fetching placement options
  useEffect(() => {
    if (isOpen) {
      fetchPlacementOptions();
    }
  }, [isOpen]);

  const fetchPlacementOptions = async () => {
    if (placementOptions.length === 0) {
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
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    if (name === 'rate' || name === 'invoicenet') {
      setFormData(prevData => ({ ...prevData, [name]: value === '' ? 0 : parseFloat(value) }));
    } else if (name === 'overtimerate') {
      setFormData(prevData => ({ ...prevData, [name]: value === '' ? null : parseFloat(value) }));
    } else if (name === 'frequency') {
      setFormData(prevData => ({ ...prevData, [name]: value === '' ? 0 : parseInt(value) }));
    } else if (name === 'placementid') {
      // When placement is selected, update both placementid and placement_details
      const selectedPlacement = placementOptions.find(option => option.id === value);
      setFormData(prevData => ({ 
        ...prevData, 
        placementid: parseInt(value),
        placement_details: selectedPlacement ? selectedPlacement.name : ''
      }));
    } else {
      setFormData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.id) {
      try {
        const payload = {
          begindate: formData.begindate,
          enddate: formData.enddate || null,
          rate: formData.rate,
          overtimerate: formData.overtimerate,
          freqtype: formData.freqtype,
          frequency: formData.frequency,
          invoicestartdate: formData.invoicestartdate,
          invoicenet: formData.invoicenet,
          polink: formData.polink,
          notes: formData.notes,
        };

        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/po/update/${formData.id}`, payload, {
          headers: { AuthToken: localStorage.getItem('token') },
        });
        onSave();
        onRequestClose();
      } catch (error) {
        console.error('Error updating PO:', error);
      }
    } else {
      console.error('Error: formData.id is undefined');
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
          <div>
            <label className="block text-gray-700">
              Placement <span className="text-red-600">*</span>
            </label>
            <select
              name="placementid"
              value={formData.placementid as number | undefined || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            >
              <option value="">Select Placement</option>
              {placementOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700">
              Start Date <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              name="begindate"
              value={formData.begindate as string}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">End Date</label>
            <input
              type="date"
              name="enddate"
              value={formData.enddate as string || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-gray-700">
              Rate <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              name="rate"
              value={formData.rate as number}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter rate"
              required
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-gray-700">Overtime Rate</label>
            <input
              type="number"
              name="overtimerate"
              value={formData.overtimerate as number || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter overtime rate"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-gray-700">
              Frequency Type <span className="text-red-600">*</span>
            </label>
            <select
              name="freqtype"
              value={formData.freqtype as string}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            >
              <option value="">Select frequency type</option>
              {FREQ_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700">
              Invoice Frequency 
            </label>
            <input
              type="number"
              name="frequency"
              value={formData.frequency as number}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter invoice frequency"
            />
          </div>

          <div>
            <label className="block text-gray-700">
              Invoice Start Date <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              name="invoicestartdate"
              value={formData.invoicestartdate as string}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">
              Invoice Net <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              name="invoicenet"
              value={formData.invoicenet as number}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter invoice net"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">PO URL</label>
            <input
              type="text"
              name="polink"
              value={formData.polink as string || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter PO URL"
            />
          </div>

          <div>
            <label className="block text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={formData.notes as string || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter notes"
              rows={4}
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="mt-4 flex-1 bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 transition duration-300 font-semibold shadow-md hover:shadow-lg flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save PO
            </button>

            <button
              type="button"
              onClick={onRequestClose}
              className="mt-4 flex-1 bg-red-500 text-white py-2.5 px-4 rounded-lg hover:bg-red-600 transition duration-300 font-semibold shadow-md hover:shadow-lg flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditRowPo;
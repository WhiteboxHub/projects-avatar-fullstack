import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import { Po } from "../../types/index";

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
    POID: '',
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

  const [placementOptions, setPlacementOptions] = useState<PlacementOption[]>([]);
  const [loadingPlacements, setLoadingPlacements] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    // Clear debugging
    // console.log('===== MODAL DEBUGGING START =====');
    // console.log('rowData received:', rowData);
    // console.log('rowData type:', typeof rowData);
    // console.log('Is rowData null?', rowData === null);
    
    if (rowData) {
      console.log('rowData keys:', Object.keys(rowData));
      
      // Dump all properties and values for debugging
      Object.keys(rowData).forEach(key => {
        console.log(`${key}: ${rowData[key as keyof Po]}`);
      });
      
      // Use direct property access with fallbacks
      const updatedFormData = {
        POID: rowData.POID ||  '',
        PlacementDetails: rowData.PlacementDetails || '',
        StartDate: rowData.StartDate ||  '',
        EndDate: rowData.EndDate || '',
        Rate: rowData.Rate ||  '',
        OvertimeRate: rowData.OvertimeRate ||  '',
        FreqType: rowData.FreqType ||  '',
        InvoiceFrequency: rowData.InvoiceFrequency ||  '',
        InvoiceStartDate: rowData.InvoiceStartDate ||  '',
        InvoiceNet: rowData.InvoiceNet ||  '',
        POUrl: rowData.POUrl ||  '',
        Notes: rowData.Notes ||  '',
      };
      
      console.log('Populated form data:', updatedFormData);
      
      // Force formData update
      setFormData({...updatedFormData});
      
      // Force a re-render after setting form data
      setTimeout(() => setForceUpdate(prev => prev + 1), 100);
      
      console.log('===== MODAL DEBUGGING END =====');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.POID) {
      try {
        const payload = {
          POID: formData.POID,
          begindate: formData.StartDate,
          enddate: formData.EndDate,
          rate: formData.Rate,
          overtimerate: formData.OvertimeRate,
          freqtype: formData.FreqType,
          frequency: formData.InvoiceFrequency ? parseInt(formData.InvoiceFrequency) : 0,
          invoicestartdate: formData.InvoiceStartDate,
          invoicenet: formData.InvoiceNet ? parseFloat(formData.InvoiceNet) : 0.0,
          polink: formData.POUrl,
          notes: formData.Notes,
        };

        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/po/${formData.POID}`, payload, {
          headers: { AuthToken: localStorage.getItem('token') },
        });
        onSave();
        onRequestClose();
      } catch (error) {
        console.error('Error updating PO:', error);
      }
    } else {
      console.error('Error: formData.POID is undefined');
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

        <div className="bg-gray-100 p-2 mb-4 text-xs overflow-auto max-h-20">
          <div><strong>Debug:</strong> Form has data: {Object.keys(formData).length > 0 ? 'Yes' : 'No'}</div>
          <div>POID: {formData.POID || 'empty'}</div>
          <div>PlacementDetails: {formData.PlacementDetails || 'empty'}</div>
          <div>StartDate: {formData.StartDate || 'empty'}</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Placement</label>
            <select
              name="PlacementDetails"
              value={formData.PlacementDetails}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
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
            <label className="block text-gray-700">Start Date</label>
            <input
              type="date"
              name="StartDate"
              value={formData.StartDate || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <div className="text-xs text-gray-500">
              Raw value: {formData.StartDate || 'empty'}
            </div>
          </div>

          <div>
            <label className="block text-gray-700">End Date</label>
            <input
              type="date"
              name="EndDate"
              value={formData.EndDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

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

          <div>
            <label className="block text-gray-700">Frequency Type</label>
            <select
              name="FreqType"
              value={formData.FreqType}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select frequency type</option>
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
              <option value="Daily">Daily</option>
            </select>
          </div>

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

          <div>
            <label className="block text-gray-700">Invoice Start Date</label>
            <input
              type="date"
              name="InvoiceStartDate"
              value={formData.InvoiceStartDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

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

          <div className="flex space-x-4">
            <button
              type="submit"
              className="mt-4 flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Save PO
            </button>

            <button
              type="button"
              onClick={onRequestClose}
              className="mt-4 flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditRowPo;

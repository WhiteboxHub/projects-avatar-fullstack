// new-projects-avatar-fullstack/project-avatar-ui/modals/bypo_modals/AddRowByPO.tsx
import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

interface AddRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  refreshData: () => Promise<void>;
}

const AddRowModal: React.FC<AddRowModalProps> = ({ isOpen, onClose, refreshData }) => {
  const [formData, setFormData] = useState({
    invoicenumber: '',
    startdate: '',
    enddate: '',
    invoicedate: '',
    quantity: '',
    otquantity: '',
    status: '',
    amountreceived: '',
    releaseddate: '',
    receiveddate: '',
    checknumber: '',
    invoiceurl: '',
    checkurl: '',
    reminders: 'Y',
    remindertype: 'Open',
    emppaiddate: '',
    candpaymentstatus: 'Open',
    poid: '',
    notes: '',
    lastmoddatetime: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/invoices`, formData, {
        headers: { AuthToken: localStorage.getItem("token") },
      });
      await refreshData();
      onClose();
    } catch (error) {
      console.error("Error adding row:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, -50%)',
          maxWidth: '500px',
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Add Invoice</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((key) => (
          <div key={key} className="modal-field">
            <label htmlFor={key} className="block text-sm font-semibold text-gray-700 mb-1">
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              type="text"
              id={key}
              name={key}
              value={formData[key as keyof typeof formData]}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>
        ))}
        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
        >
          Add Invoice
        </button>
      </form>
    </Modal>
  );
};

export default AddRowModal;

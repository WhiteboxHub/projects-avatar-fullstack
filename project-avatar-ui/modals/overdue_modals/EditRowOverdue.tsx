import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { AiOutlineClose } from 'react-icons/ai';

interface Overdue {
  overduename?: string;
  duedate?: string;
  description?: string;
  status?: string;
  overdueid?: string;
  courseid?: string;
}

interface EditRowOverdueProps {
  isOpen: boolean;
  onRequestClose: () => void;
  rowData: Overdue | null;
  onSave: () => void;
}

const EditRowOverdue: React.FC<EditRowOverdueProps> = ({ isOpen, onRequestClose, rowData, onSave }) => {
  const [formData, setFormData] = useState<Overdue>({
    overduename: '',
    duedate: '',
    description: '',
    status: 'Pending',
    overdueid: '',
    courseid: '',
  });

  useEffect(() => {
    if (rowData) {
      setFormData(rowData);
    }
  }, [rowData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData) {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL; // Ensure the API URL is set correctly
        await axios.put(`${API_URL}/overdues/update/${formData.overdueid}`, formData, {
          headers: { AuthToken: localStorage.getItem('token') },
        });
        onSave(); // Call the onSave callback to refresh data or handle post-update actions
        onRequestClose(); // Close the modal after saving
      } catch (error) {
        console.error('Error updating overdue:', error);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
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
      contentLabel="Edit Overdue Modal"
    >
      <div className="relative">
        <button
          onClick={onRequestClose}
          className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
        >
          &times;
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Edit Overdue Details</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Overdue Name */}
        <div className="modal-field">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Overdue Name</label>
          <input
            type="text"
            name="overduename"
            value={formData.overduename}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter overdue name"
          />
        </div>
        {/* Due Date */}
        <div className="modal-field">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
          <input
            type="date"
            name="duedate"
            value={formData.duedate}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>
        {/* Description */}
        <div className="modal-field">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter description"
          />
        </div>
        {/* Status */}
        <div className="modal-field">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        {/* Overdue ID */}
        <div className="modal-field">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Overdue ID</label>
          <input
            type="text"
            name="overdueid"
            value={formData.overdueid}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter overdue ID"
          />
        </div>
        {/* Course ID */}
        <div className="modal-field">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Course ID</label>
          <input
            type="text"
            name="courseid"
            value={formData.courseid}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter course ID"
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
        >
          Save Overdue
        </button>
      </form>
    </Modal>
  );
};

export default EditRowOverdue;

import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Employee } from '../../types/index'; // Adjust the import path accordingly

interface EditEmployeeModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  rowData: Employee | null;
  onSave: () => void;
}

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({ isOpen, onRequestClose, rowData, onSave }) => {
  const [formData, setFormData] = useState<Employee | null>(null);

  useEffect(() => {
    if (rowData) {
      setFormData(rowData);
    }
  }, [rowData]);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (formData) {
  //     setFormData({ ...formData, [e.target.name]: e.target.value });
  //   }
  // };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (formData) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value as string
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData) {
      try {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/employees/update/${formData.id}`, formData, {
          headers: { AuthToken: localStorage.getItem('token') },
        });
        onSave();
        onRequestClose();
      } catch (error) {
        console.error('Error updating employee:', error);
      }
    }
  };

  if (!formData) return null; // Prevent rendering if formData is not set

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
    >
      <div className="flex justify-between items-center mb-6">
       <h2 className="text-2xl font-bold  text-gray-800 pr-8">Edit Employee</h2>
      <button
          onClick={onRequestClose}
          className="text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
        >
          &times;
        </button>
      </div>
     <form onSubmit={handleSubmit} className="space-y-4">
        {formData && Object.keys(formData).map((key) => (
          <div key={key} className="modal-field">
            <label htmlFor={key} className="block text-sm font-semibold text-gray-700 mb-1">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>


            {/* Conditional rendering for the dropdowns */}
            {key === 'status' ? (
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                <option value="">None</option>
                <option value="Active">Active</option>
                <option value="Fired">Fired</option>
                <option value="Discontinued">Discontinued</option>
                <option value="Break">Break</option>
              </select>
            ) : key === 'designationid' ? (
              <select
                id="designationid"
                name="designationid"
                value={formData.designationid}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                <option value="">None</option>
                <option value="HR Manager">HR Manager</option>
                <option value="Operation Manager">Operation Manager</option>
                <option value="Marketing Manager">Marketing Manager</option>
                <option value="Instructor">Instructor</option>
                <option value="Training Manager">Training Manager</option>
                <option value="Marketing Associates">Marketing Associates</option>
                <option value="Recruting Assistant">Recruting Assistant</option>
                <option value="Recruting Manager">Recruting Manager</option>
                <option value="US PayRoll Manager">US PayRoll Manager</option>
                <option value="HR Associate">HR Associate</option>
                <option value="CEO">CEO</option>
                <option value="COO">COO</option>
                <option value="Director">Director</option>
              </select>
            ) : key === 'commission' ? (
              <select
                id="commission"
                name="commission"
                value={formData.commission}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                <option value="">N</option>
                <option value="Y">Y</option>
              </select>
            ) : key === 'type' ? (
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                <option value="">None</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
              </select>
            ) : (
                <input
                type="text"
                id={key}
                name={key}
                value={formData[key as keyof Employee]}
                onChange={handleChange}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            )}
          </div>
        ))}
  
        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
        >
          Save Employee
        </button>
      </form>
    </Modal>
  );
};

export default EditEmployeeModal;

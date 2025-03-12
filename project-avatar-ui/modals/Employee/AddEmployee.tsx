import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  status: string;
  startdate: string;
  mgrid: string;
  designationid: string;
  personalemail: string;
  personalphone: string;
  dob: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  skypeid: string;
  salary: string;
  commission: string;
  commissionrate: string;
  type: string;
  empagreementurl: string;
  offerletterurl: string;
  dlurl: string;
  workpermiturl: string;
  contracturl: string;
  enddate: string;
  loginid: string;
  responsibilities: string;
  notes: string;
}

interface AddEmployeeModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSave: () => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onRequestClose, onSave }) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    email: '',
    phone: '',
    status: '',
    startdate: '',
    mgrid: '',
    designationid: '',
    personalemail: '',
    personalphone: '',
    dob: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zip: '',
    skypeid: '',
    salary: '',
    commission: '',
    commissionrate: '',
    type: '',
    empagreementurl: '',
    offerletterurl: '',
    dlurl: '',
    workpermiturl: '',
    contracturl: '',
    enddate: '',
    loginid: '',
    responsibilities: '',
    notes: '',
  });

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/employees/insert`, formData, {
        headers: { AuthToken: localStorage.getItem('token') },
      });
      onSave();
      onRequestClose();
    } catch (error) {
      console.error('Error adding employee:', error);
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
    >
      <div className="relative">
        <button
          onClick={onRequestClose}
          className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
        >
          &times;
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Add New Employee</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((key) => (
          <div key={key} className="modal-field">
            <label htmlFor={key} className="block text-sm font-semibold text-gray-700 mb-1">
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
 {/* Conditional rendering for the status dropdown */}
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
                <option value=""> None</option>
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
                  value={formData[key as keyof EmployeeFormData]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
              )}
            </div>
          ))}
        
        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
        >
          Add Employee
        </button>
      </form>
    </Modal>
  );
};

export default AddEmployeeModal;

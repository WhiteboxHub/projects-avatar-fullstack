"use client";
import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";

interface Client {
  id: number;
  name: string;
}
interface AddRowRecruiterProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}
Modal.setAppElement('#__next');
const AddRowRecruiter: React.FC<AddRowRecruiterProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    clientid: '',
    status: '',
    dob: null,
    personalemail: '',
    skypeid: '',
    linkedin: '',
    twitter: '',
    facebook: '',
    review: '',
    notes: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [clients, setClients] = useState<Client[]>([]);
  const reviewOptions = [
    { value: 'Y', label: 'Yes' },
    { value: 'N', label: 'No' }
  ];
  useEffect(() => {
    // Fetch clients for the dropdown
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/recruiters/byClient/clients`);
        setClients(response.data || []);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name?.trim()) newErrors.name = "Name is required";
    if (!formData.email?.trim()) newErrors.email = "Email is required";
    if (!formData.designation?.trim()) newErrors.designation = "Designation is required";
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.clientid) newErrors.clientid = "Client is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
        // Create a copy of formData to send to the API
        const dataToSubmit = {...formData};
        
        // If dob is empty, set it to null to avoid validation errors
        if (!dataToSubmit.dob) {
          dataToSubmit.dob = null;
        }
        
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/recruiters/byClient/add`, dataToSubmit, {
            headers: { AuthToken: localStorage.getItem("token") },
        });
        console.log(response.data.message);
        onSubmit(dataToSubmit);
        onClose();
    } catch (error) {
        console.error("Error adding recruiter:", error);
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
          <AiOutlineClose />
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Recruiter</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 text-sm border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
            placeholder="Enter name"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 text-sm border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
            placeholder="Enter email"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter phone"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Designation <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className={`w-full px-3 py-2 text-sm border ${errors.designation ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
            placeholder="Enter designation"
          />
          {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Client <span className="text-red-500">*</span></label>
          <select
            name="clientid"
            value={formData.clientid}
            onChange={handleChange}
            className={`w-full px-3 py-2 text-sm border ${errors.clientid ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
          >
            <option value="">Select Client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
          {errors.clientid && <p className="text-red-500 text-xs mt-1">{errors.clientid}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Status <span className="text-red-500">*</span></label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={`w-full px-3 py-2 text-sm border ${errors.status ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
          >
            <option value="">Select Status</option>
            <option value="A">Active</option>
            <option value="I">Inactive</option>
            <option value="D">Delete</option>
            <option value="R">Rejected</option>
            <option value="N">Not Interested</option>
            <option value="E">Excellent</option>
          </select>
          {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth (Optional)</label>
          <input
            type="date"
            name="dob"
            value={formData.dob || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Personal Email</label>
          <input
            type="email"
            name="personalemail"
            value={formData.personalemail}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter personal email"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Skype ID</label>
          <input
            type="text"
            name="skypeid"
            value={formData.skypeid}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Skype ID"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">LinkedIn</label>
          <input
            type="url"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter LinkedIn URL"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Twitter</label>
          <input
            type="text"
            name="twitter"
            value={formData.twitter}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Twitter handle"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Facebook</label>
          <input
            type="text"
            name="facebook"
            value={formData.facebook}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Facebook URL"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Review</label>
          <select
            name="review"
            value={formData.review}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="">Select Review</option>
            {reviewOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter notes"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200 font-semibold text-sm"
          >
            Cancel
          </button>
        <button
          type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
        >
          Submit
        </button>
        </div>
      </form>
    </Modal>
  );
};
export default AddRowRecruiter
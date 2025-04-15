"use client";
import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import { RecruiterDetails } from "@/types/byDetailed";

interface Client {
  id: number;
  name: string;
}

interface AddRowRecruiterProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  clients?: Client[];
  defaultClientId?: number;
}

const AddRowRecruiter: React.FC<AddRowRecruiterProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  clients = [],
  defaultClientId = 0
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    clientid: defaultClientId ? String(defaultClientId) : '',
    comp: '',
    status: 'A',
    dob: '',
    personalemail: '',
    skypeid: '',
    linkedin: '',
    twitter: '',
    facebook: '',
    review: 'Y',
    notes: '',
  });

  const [availableClients, setAvailableClients] = useState<Client[]>(clients);
  const [clientsFetched, setClientsFetched] = useState(false);
  
  const statusOptions = [
    { value: 'A', label: 'Active' },
    { value: 'I', label: 'Inactive' },
    { value: 'D', label: 'Delete' },
    { value: 'R', label: 'Rejected' },
    { value: 'N', label: 'Not Interested' },
    { value: 'E', label: 'Excellent' }
  ];

  const reviewOptions = [
    { value: 'Y', label: 'Yes' },
    { value: 'N', label: 'No' }
  ];

  useEffect(() => {
    // If clients are not provided as props and haven't been fetched yet, fetch them
    if (clients.length === 0 && !clientsFetched) {
      const fetchClients = async () => {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL;
          const response = await axios.get(`${API_URL}/recruiters/byClient/clients`, {
            headers: { AuthToken: localStorage.getItem("token") }
          });
          setAvailableClients(response.data || []);
          setClientsFetched(true);
        } catch (error) {
          console.error("Error fetching clients:", error);
        }
      };
      fetchClients();
    }

    // Set default client ID if provided
    if (defaultClientId) {
      setFormData(prev => ({
        ...prev,
        clientid: String(defaultClientId)
      }));
    }
  }, [clients, defaultClientId, clientsFetched]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.post(`${API_URL}/by/recruiters/byDetailed/add`, formData, {
        headers: { AuthToken: localStorage.getItem("token") },
      });
      console.log(response.data.message); // Log success message
      onSubmit(); // Call the onSubmit callback
      onClose(); // Close modal after successful submission
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
      contentLabel="Add Recruiter"
      ariaHideApp={false}
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
          <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter email"
            required
          />
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
          <label className="block text-sm font-semibold text-gray-700 mb-1">Designation</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter designation"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Client</label>
          <select
            name="clientid"
            value={formData.clientid}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
          >
            <option value="">Select Client</option>
            {availableClients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Company</label>
          <input
            type="text"
            name="comp"
            value={formData.comp}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter company"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
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

export default AddRowRecruiter;
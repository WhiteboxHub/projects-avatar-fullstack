import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import { Client, ClientUpdate } from "@/types/client";

interface EditRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientData: Client;
  onSave: () => void;
}

const EditRowModal: React.FC<EditRowModalProps> = ({ isOpen, onClose, clientData, onSave }) => {
  const [formData, setFormData] = useState<ClientUpdate>({
    id: String(clientData.id),
    companyname: clientData.companyname,
    // tier: clientData.tier,
    status: clientData.status,
    email: clientData.email,
    phone: clientData.phone,
    fax: clientData.fax || '',
    address: clientData.address,
    city: clientData.city,
    state: clientData.state,
    country: clientData.country,
    zip: clientData.zip,
    url: clientData.url,
    twitter: clientData.twitter || '',
    facebook: clientData.facebook || '',
    linkedIn: clientData.linkedIn || '',
    manager1Name: clientData.manager1Name,
    manager1Email: clientData.manager1Email,
    manager1Phone: clientData.manager1Phone,
    hmName: clientData.hmName || '',
    hmEmail: clientData.hmEmail || '',
    hmPhone: clientData.hmPhone || '',
    hrName: clientData.hrName || '',
    hrEmail: clientData.hrEmail || '',
    hrPhone: clientData.hrPhone || '',
    notes: clientData.notes || '',
  });

  useEffect(() => {
    setFormData({
      ...clientData,
      id: String(clientData.id)
    });
  }, [clientData]);
  const statusOptions = ["Current", "blacklist", "rejectedus", "duplicate"];
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedData: ClientUpdate = { ...formData, id: String(clientData.id) };
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/client/client/edit/${clientData.id}`, updatedData);
      await onSave();
      onClose();
    } catch (error) {
      console.error('Error updating client:', error);
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
          <AiOutlineClose />
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Edit Client</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name *</label>
          <input
            type="text"
            name="companyname"
            value={formData.companyname}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter company name"
            required
          />
        </div>

        {/* Tier
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tier *</label>
          <input
            type="text"
            name="tier"
            value={formData.tier}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter tier"
            required
          />
        </div> */}

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
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

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Phone *</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter phone"
            required
          />
        </div>

      {/* Status */}
      <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            >
              {statusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter address"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter city"
          />
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter state"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter country"
          />
        </div>

        {/* Zip */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Zip</label>
          <input
            type="text"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter zip code"
          />
        </div>

        {/* URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">URL</label>
          <input
            type="text"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter URL"
          />
        </div>

        {/* Twitter */}
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

        {/* Facebook */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Facebook</label>
          <input
            type="text"
            name="facebook"
            value={formData.facebook}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Facebook link"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">LinkedIn</label>
          <input
            type="text"
            name="linkedIn"
            value={formData.linkedIn}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter LinkedIn link"
          />
        </div>

        {/* Manager 1 Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Manager 1 Name</label>
          <input
            type="text"
            name="manager1Name"
            value={formData.manager1Name}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter manager's name"
          />
        </div>

        {/* Manager 1 Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Manager 1 Email</label>
          <input
            type="email"
            name="manager1Email"
            value={formData.manager1Email}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter manager's email"
          />
        </div>

        {/* Manager 1 Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Manager 1 Phone</label>
          <input
            type="text"
            name="manager1Phone"
            value={formData.manager1Phone}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter manager's phone"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter any notes"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
        >
          Save Client
        </button>
      </form>
    </Modal>
  );
};

export default EditRowModal;
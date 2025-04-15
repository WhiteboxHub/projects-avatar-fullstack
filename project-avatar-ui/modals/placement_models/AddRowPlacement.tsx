import Modal from "react-modal";
import React, { useState } from "react";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import { Placement } from "../../types/index";

interface AddRowPlacementProps {
  isOpen: boolean;
  onClose: () => void;
  refreshData: () => void;
}

const AddRowPlacement: React.FC<AddRowPlacementProps> = ({ isOpen, onClose, refreshData }) => {
  const [formData, setFormData] = useState<Placement>({
    Candidate_Name: '',
    Manager: '',
    Recruiter: '',
    Vendor1: '',
    MSA_ID: '',
    Other_AgrID: '',
    Vendor2: '',
    Vendor3: '',
    Client: '',
    Start_Date: '',
    End_Date: '',
    Status: '',
    Paperwork: '',
    Insurance: '',
    Wrk_Location: '',
    Wrk_Designation: '',
    Wrk_Email: '',
    Wrk_Phone: '',
    Mgr_Name: '',
    Mgr_Email: '',
    Mgr_Phone: '',
    Hiring_Mgr_Name: '',
    Hiring_Mgr_Email: '',
    Hiring_Mgr_Phone: '',
    Reference: '',
    IPEmail_Clear: '',
    Feedback_ID: '',
    Project_Docs: '',
    Notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/placements/insert`, formData, {
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Add New Placement</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Candidate Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Candidate Name</label>
          <input
            type="text"
            name="Candidate_Name"
            value={formData.Candidate_Name}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter candidate name"
          />
        </div>

        {/* Manager */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Manager</label>
          <input
            type="text"
            name="Manager"
            value={formData.Manager}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter manager name"
          />
        </div>

        {/* Recruiter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Recruiter</label>
          <input
            type="text"
            name="Recruiter"
            value={formData.Recruiter}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter recruiter name"
          />
        </div>

        {/* Vendor1 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Vendor 1</label>
          <input
            type="text"
            name="Vendor1"
            value={formData.Vendor1}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter vendor 1 name"
          />
        </div>

        {/* MSA_ID */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">MSA ID</label>
          <input
            type="text"
            name="MSA_ID"
            value={formData.MSA_ID}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter MSA ID"
          />
        </div>

        {/* Other_AgrID */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Other Agreement ID</label>
          <input
            type="text"
            name="Other_AgrID"
            value={formData.Other_AgrID}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter other agreement ID"
          />
        </div>

        {/* Vendor2 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Vendor 2</label>
          <input
            type="text"
            name="Vendor2"
            value={formData.Vendor2}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter vendor 2 name"
          />
        </div>

        {/* Vendor3 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Vendor 3</label>
          <input
            type="text"
            name="Vendor3"
            value={formData.Vendor3}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter vendor 3 name"
          />
        </div>

        {/* Client */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Client</label>
          <input
            type="text"
            name="Client"
            value={formData.Client}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter client name"
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            name="Start_Date"
            value={formData.Start_Date}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            name="End_Date"
            value={formData.End_Date}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
          <input
            type="text"
            name="Status"
            value={formData.Status}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter status"
          />
        </div>

        {/* Paperwork */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Paperwork</label>
          <input
            type="text"
            name="Paperwork"
            value={formData.Paperwork}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter paperwork details"
          />
        </div>

        {/* Insurance */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Insurance</label>
          <input
            type="text"
            name="Insurance"
            value={formData.Insurance}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter insurance details"
          />
        </div>

        {/* Work Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Work Location</label>
          <input
            type="text"
            name="Wrk_Location"
            value={formData.Wrk_Location}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter work location"
          />
        </div>

        {/* Work Designation */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Work Designation</label>
          <input
            type="text"
            name="Wrk_Designation"
            value={formData.Wrk_Designation}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter work designation"
          />
        </div>

        {/* Work Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Work Email</label>
          <input
            type="email"
            name="Wrk_Email"
            value={formData.Wrk_Email}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter work email"
          />
        </div>

        {/* Work Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Work Phone</label>
          <input
            type="text"
            name="Wrk_Phone"
            value={formData.Wrk_Phone}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter work phone"
          />
        </div>

        {/* Manager Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Manager Name</label>
          <input
            type="text"
            name="Mgr_Name"
            value={formData.Mgr_Name}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter manager name"
          />
        </div>

        {/* Manager Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Manager Email</label>
          <input
            type="email"
            name="Mgr_Email"
            value={formData.Mgr_Email}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter manager email"
          />
        </div>

        {/* Manager Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Manager Phone</label>
          <input
            type="text"
            name="Mgr_Phone"
            value={formData.Mgr_Phone}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter manager phone"
          />
        </div>

        {/* Hiring Manager Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Hiring Manager Name</label>
          <input
            type="text"
            name="Hiring_Mgr_Name"
            value={formData.Hiring_Mgr_Name}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter hiring manager name"
          />
        </div>

        {/* Hiring Manager Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Hiring Manager Email</label>
          <input
            type="email"
            name="Hiring_Mgr_Email"
            value={formData.Hiring_Mgr_Email}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter hiring manager email"
          />
        </div>

        {/* Hiring Manager Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Hiring Manager Phone</label>
          <input
            type="text"
            name="Hiring_Mgr_Phone"
            value={formData.Hiring_Mgr_Phone}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter hiring manager phone"
          />
        </div>

        {/* Reference */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Reference</label>
          <input
            type="text"
            name="Reference"
            value={formData.Reference}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter reference"
          />
        </div>

        {/* IP Email Clear */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">IP Email Clear</label>
          <input
            type="text"
            name="IPEmail_Clear"
            value={formData.IPEmail_Clear}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter IP email clear"
          />
        </div>

        {/* Feedback ID */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Feedback ID</label>
          <input
            type="text"
            name="Feedback_ID"
            value={formData.Feedback_ID}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter feedback ID"
          />
        </div>

        {/* Project Docs */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Project Docs</label>
          <input
            type="text"
            name="Project_Docs"
            value={formData.Project_Docs}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter project docs"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
          <input
            type="text"
            name="Notes"
            value={formData.Notes}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter notes"
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
        >
          Save Placement
        </button>
      </form>
    </Modal>
  );
};

export default AddRowPlacement;

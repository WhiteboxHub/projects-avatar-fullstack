import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { AiOutlineClose } from 'react-icons/ai';
import { Placement } from '../../types/index';


interface EditRowModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    rowData: Placement | null;
    onSave: () => void;
  }

const EditRowPlacement: React.FC<EditRowModalProps> = ({ isOpen, onRequestClose, rowData, onSave }) => {
  const [formData, setFormData] = useState<Placement>({
    id: '',
    candidateid: '',
    mmid: '',
    recruiterid: '',
    vendorid: '',
    masteragreementid: '',
    otheragreementsids: '',
    vendor2id: '',
    vendor3id: '',
    clientid: '',
    startdate: '',
    enddate: '',
    status: '',
    paperwork: '',
    insurance: '',
    wrklocation: '',
    wrkdesignation: '',
    wrkemail: '',
    wrkphone: '',
    mgrname: '',
    mgremail: '',
    mgrphone: '',
    hiringmgrname: '',
    hiringmgremail: '',
    hiringmgrphone: '',
    reference: '',
    ipemailclear: '',
    feedbackid: '',
    projectdocs: '',
    notes: '',
  });

  useEffect(() => {
    if (rowData) {
      setFormData(rowData);
    }
  }, [rowData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData) {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL; // Ensure the API URL is set correctly
        await axios.put(`${API_URL}/placements/update/${formData.id}`, formData, {
          headers: { AuthToken: localStorage.getItem('token') },
        });
        onSave(); // Call the onSave callback to refresh data or handle post-update actions
        onRequestClose(); // Close the modal after saving
      } catch (error) {
        console.error('Error updating placement:', error);
      }
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
      contentLabel="Edit Placement Modal"
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Placement</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ID */}
          <div>
            <label className="block text-gray-700">ID</label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter ID"
            />
          </div>

          {/* Candidate ID */}
          <div>
            <label className="block text-gray-700">Candidate ID</label>
            <input
              type="text"
              name="candidateid"
              value={formData.candidateid}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter candidate ID"
            />
          </div>

          {/* Manager ID */}
          <div>
            <label className="block text-gray-700">Manager ID</label>
            <input
              type="text"
              name="mmid"
              value={formData.mmid}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter manager ID"
            />
          </div>

          {/* Recruiter ID */}
          <div>
            <label className="block text-gray-700">Recruiter ID</label>
            <input
              type="text"
              name="recruiterid"
              value={formData.recruiterid}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter recruiter ID"
            />
          </div>

          {/* Vendor ID */}
          <div>
            <label className="block text-gray-700">Vendor ID</label>
            <input
              type="text"
              name="vendorid"
              value={formData.vendorid}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter vendor ID"
            />
          </div>

          {/* Master Agreement ID */}
          <div>
            <label className="block text-gray-700">Master Agreement ID</label>
            <input
              type="text"
              name="masteragreementid"
              value={formData.masteragreementid}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter master agreement ID"
            />
          </div>

          {/* Other Agreements IDs */}
          <div>
            <label className="block text-gray-700">Other Agreements IDs</label>
            <input
              type="text"
              name="otheragreementsids"
              value={formData.otheragreementsids}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter other agreements IDs"
            />
          </div>

          {/* Vendor 2 ID */}
          <div>
            <label className="block text-gray-700">Vendor 2 ID</label>
            <input
              type="text"
              name="vendor2id"
              value={formData.vendor2id}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter vendor 2 ID"
            />
          </div>

          {/* Vendor 3 ID */}
          <div>
            <label className="block text-gray-700">Vendor 3 ID</label>
            <input
              type="text"
              name="vendor3id"
              value={formData.vendor3id}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter vendor 3 ID"
            />
          </div>

          {/* Client ID */}
          <div>
            <label className="block text-gray-700">Client ID</label>
            <input
              type="text"
              name="clientid"
              value={formData.clientid}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter client ID"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-gray-700">Start Date</label>
            <input
              type="date"
              name="startdate"
              value={formData.startdate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-gray-700">End Date</label>
            <input
              type="date"
              name="enddate"
              value={formData.enddate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-gray-700">Status</label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter status"
            />
          </div>

          {/* Paperwork */}
          <div>
            <label className="block text-gray-700">Paperwork</label>
            <input
              type="text"
              name="paperwork"
              value={formData.paperwork}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter paperwork"
            />
          </div>

          {/* Insurance */}
          <div>
            <label className="block text-gray-700">Insurance</label>
            <input
              type="text"
              name="insurance"
              value={formData.insurance}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter insurance"
            />
          </div>

          {/* Work Location */}
          <div>
            <label className="block text-gray-700">Work Location</label>
            <input
              type="text"
              name="wrklocation"
              value={formData.wrklocation}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter work location"
            />
          </div>

          {/* Work Designation */}
          <div>
            <label className="block text-gray-700">Work Designation</label>
            <input
              type="text"
              name="wrkdesignation"
              value={formData.wrkdesignation}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter work designation"
            />
          </div>

          {/* Work Email */}
          <div>
            <label className="block text-gray-700">Work Email</label>
            <input
              type="email"
              name="wrkemail"
              value={formData.wrkemail}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter work email"
            />
          </div>

          {/* Work Phone */}
          <div>
            <label className="block text-gray-700">Work Phone</label>
            <input
              type="text"
              name="wrkphone"
              value={formData.wrkphone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter work phone"
            />
          </div>

          {/* Manager Name */}
          <div>
            <label className="block text-gray-700">Manager Name</label>
            <input
              type="text"
              name="mgrname"
              value={formData.mgrname}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter manager name"
            />
          </div>

          {/* Manager Email */}
          <div>
            <label className="block text-gray-700">Manager Email</label>
            <input
              type="email"
              name="mgremail"
              value={formData.mgremail}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter manager email"
            />
          </div>

          {/* Manager Phone */}
          <div>
            <label className="block text-gray-700">Manager Phone</label>
            <input
              type="text"
              name="mgrphone"
              value={formData.mgrphone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter manager phone"
            />
          </div>

          {/* Hiring Manager Name */}
          <div>
            <label className="block text-gray-700">Hiring Manager Name</label>
            <input
              type="text"
              name="hiringmgrname"
              value={formData.hiringmgrname}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter hiring manager name"
            />
          </div>

          {/* Hiring Manager Email */}
          <div>
            <label className="block text-gray-700">Hiring Manager Email</label>
            <input
              type="email"
              name="hiringmgremail"
              value={formData.hiringmgremail}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter hiring manager email"
            />
          </div>

          {/* Hiring Manager Phone */}
          <div>
            <label className="block text-gray-700">Hiring Manager Phone</label>
            <input
              type="text"
              name="hiringmgrphone"
              value={formData.hiringmgrphone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter hiring manager phone"
            />
          </div>

          {/* Reference */}
          <div>
            <label className="block text-gray-700">Reference</label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter reference"
            />
          </div>

          {/* IP Email Clear */}
          <div>
            <label className="block text-gray-700">IP Email Clear</label>
            <input
              type="text"
              name="ipemailclear"
              value={formData.ipemailclear}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter IP email clear"
            />
          </div>

          {/* Feedback ID */}
          <div>
            <label className="block text-gray-700">Feedback ID</label>
            <input
              type="text"
              name="feedbackid"
              value={formData.feedbackid}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter feedback ID"
            />
          </div>

          {/* Project Docs */}
          <div>
            <label className="block text-gray-700">Project Docs</label>
            <input
              type="text"
              name="projectdocs"
              value={formData.projectdocs}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter project docs"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter notes"
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Save Placement
          </button>

          <button
            type="button"
            onClick={onRequestClose}
            className="mt-2 w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Cancel
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default EditRowPlacement;

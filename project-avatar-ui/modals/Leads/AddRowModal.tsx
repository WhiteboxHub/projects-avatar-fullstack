import Modal from "react-modal";
import React, { useState } from "react";
import axios from "axios";
import { Lead } from "@/types/index";

// new-projects-avatar-fullstack/project-avatar-ui/modals/Leads/AddRowModal.tsx

// import { Lead } from '@/types/index';

interface FormData {
  name: string;
  startdate: string;
  course: string;
  workexperience: string;
  email: string;
  phone: string;
  secondaryemail: string;
  secondaryphone: string;
  status: string;
  priority: string;
  workstatus: string;
  spousename: string;
  spouseemail: string;
  spousephone: string;
  spouseoccupationinfo: string;
  attendedclass: string;
  siteaccess: string;
  faq: string;
  closedate: string;
  assignedto: string;
  callsmade: string;
  source: string;
  sourcename: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  notes: string;
}

interface AddRowModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  // onSave: (newLead?: FormData) => void;
  onSave: (newLead: Lead) => void; // Update parameter type to Lead

}

const AddRowModal: React.FC<AddRowModalProps> = ({ isOpen, onRequestClose, onSave }) => {
  const [formData, setFormData] = useState<Lead>({
    name: '',
    course: 'QA',
    startdate: '',
    workexperience: '',
    email: '',
    phone: '',
    secondaryemail: '',
    secondaryphone: '',
    status: 'Open',
    priority: 'P1',
    workstatus: 'None',
    spousename: '',
    spouseemail: '',
    spousephone: '',
    spouseoccupationinfo: '',
    attendedclass: 'N',
    siteaccess: 'N',
    faq: 'N',
    closedate: '',
    assignedto: '',
    callsmade: '0',
    source: 'Student',
    sourcename: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zip: '',
    notes: '',
    usstatus: '',
    intent: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post<Lead>(`${process.env.NEXT_PUBLIC_API_URL}/insert`, formData, { 
        headers: { AuthToken: localStorage.getItem('token') }
      });
      onSave(response.data); // Pass the Lead object from response
      onRequestClose();
    } catch (error) {
      console.error('Error adding row:', error);
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
          maxWidth: '600px',
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Add New Lead</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Information */}
        <div className="modal-field">
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field">
          <label htmlFor="startdate" className="block text-sm font-semibold text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="startdate"
            name="startdate"
            value={formData.startdate || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field">
          <label htmlFor="course" className="block text-sm font-semibold text-gray-700 mb-1">
            Course <span className="text-red-500">*</span>
          </label>
          <select
            id="course"
            name="course"
            value={formData.course}
            onChange={(e) => setFormData({...formData, course: e.target.value})}
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="ML">ML</option>
            <option value="QA">QA</option>
            <option value="UI">UI</option>
            <option value=".NET">.NET</option>
          </select>
        </div>

        <div className="modal-field">
          <label htmlFor="workexperience" className="block text-sm font-semibold text-gray-700 mb-1">
            Experience
          </label>
          <input
            type="text"
            id="workexperience"
            name="workexperience"
            value={formData.workexperience}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field">
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field">
          <label htmlFor="secondaryemail" className="block text-sm font-semibold text-gray-700 mb-1">
            Secondary Email
          </label>
          <input
            type="email"
            id="secondaryemail"
            name="secondaryemail"
            value={formData.secondaryemail}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field">
          <label htmlFor="secondaryphone" className="block text-sm font-semibold text-gray-700 mb-1">
            Secondary Phone
          </label>
          <input
            type="tel"
            id="secondaryphone"
            name="secondaryphone"
            value={formData.secondaryphone}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field">
          <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="Open">Open</option>
            <option value="Intro">Intro</option>
            <option value="in-Progress">in-Progress</option>
            <option value="Agreement">Agreement</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
            <option value="Closed">Closed</option>
            <option value="Future">Future</option>
            <option value="Invalid Email">Invalid Email</option>
            <option value="Delete">Delete</option>
          </select>
        </div>

        <div className="modal-field">
          <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-1">
            {/* Priority <span className="text-red-500">*</span> */}
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
            <option value="P4">P4</option>
            <option value="P5">P5</option>
          </select>
        </div>

        <div className="modal-field">
          <label htmlFor="workstatus" className="block text-sm font-semibold text-gray-700 mb-1">
            Work Status <span className="text-red-500">*</span>
          </label>
          <select
            id="workstatus"
            name="workstatus"
            value={formData.workstatus}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="None">None</option>
            <option value="Citizen">Citizen</option>
            <option value="GC">GC</option>
            <option value="GC EAD">GC EAD</option>
            <option value="OPT H1B">OPT H1B</option>
            <option value="H4">H4</option>
            <option value="L1">L1</option>
            <option value="L2">L2</option>
            <option value="F1">F1</option>
            <option value="India">India</option>
            <option value="Non-US">Non-US</option>
          </select>
        </div>

        <div className="modal-field">
          <label htmlFor="spousename" className="block text-sm font-semibold text-gray-700 mb-1">
            Spouse Name
          </label>
          <input
            type="text"
            id="spousename"
            name="spousename"
            value={formData.spousename}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field">
          <label htmlFor="spouseemail" className="block text-sm font-semibold text-gray-700 mb-1">
            Spouse Email
          </label>
          <input
            type="email"
            id="spouseemail"
            name="spouseemail"
            value={formData.spouseemail}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field">
          <label htmlFor="spousephone" className="block text-sm font-semibold text-gray-700 mb-1">
            Spouse Phone
          </label>
          <input
            type="tel"
            id="spousephone"
            name="spousephone"
            value={formData.spousephone}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field">
          <label htmlFor="spouseoccupationinfo" className="block text-sm font-semibold text-gray-700 mb-1">
            Spouse Occupation Info
          </label>
          <input
            type="text"
            id="spouseoccupationinfo"
            name="spouseoccupationinfo"
            value={formData.spouseoccupationinfo}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field">
          <label htmlFor="siteaccess" className="block text-sm font-semibold text-gray-700 mb-1">
            Access 
            {/* <span className="text-red-500">*</span> */}
          </label>
          <select
            id="siteaccess"
            name="siteaccess"
            value={formData.siteaccess}
            onChange={handleChange}
            // required
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="N">N</option>
            <option value="Y">Y</option>
          </select>
        </div>

        <div className="modal-field">
          <label htmlFor="faq" className="block text-sm font-semibold text-gray-700 mb-1">
            FAQ 
            {/* <span className="text-red-500">*</span> */}
          </label>
          <select
            id="faq"
            name="faq"
            value={formData.faq}
            onChange={handleChange}
            // required
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="N">N</option>
            <option value="Y">Y</option>
          </select>
        </div>

        <div className="modal-field">
          <label htmlFor="closedate" className="block text-sm font-semibold text-gray-700 mb-1">
            Close Date
          </label>
          <input
            type="date"
            id="closedate"
            name="closedate"
            value={formData.closedate}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field">
          <label htmlFor="assignedto" className="block text-sm font-semibold text-gray-700 mb-1">
            Assigned to
          </label>
          <input
            type="text"
            id="assignedto"
            name="assignedto"
            value={formData.assignedto}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field">
          <label htmlFor="callsmade" className="block text-sm font-semibold text-gray-700 mb-1">
            Calls
          </label>
          <input
            type="text"
            id="callsmade"
            name="callsmade"
            value={formData.callsmade}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field">
          <label htmlFor="source" className="block text-sm font-semibold text-gray-700 mb-1">
            Source
          </label>
          <select
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="Student">Student</option>
            <option value="OutSide">OutSide</option>
            <option value="Online">Online</option>
            <option value="Radio">Radio</option>
            <option value="University">University</option>
            <option value="Print">Print</option>
          </select>
        </div>

        <div className="modal-field">
          <label htmlFor="sourcename" className="block text-sm font-semibold text-gray-700 mb-1">
            Source Name
          </label>
          <input
            type="text"
            id="sourcename"
            name="sourcename"
            value={formData.sourcename}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field">
          <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field">
          <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field">
          <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-1">
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field">
          <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-1">
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field">
          <label htmlFor="zip" className="block text-sm font-semibold text-gray-700 mb-1">
            Zip
          </label>
          <input
            type="text"
            id="zip"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field md:col-span-2">
          <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-1">
            Notes
          </label>
          <input
            type="text"
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
          >
            Add Lead
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddRowModal;

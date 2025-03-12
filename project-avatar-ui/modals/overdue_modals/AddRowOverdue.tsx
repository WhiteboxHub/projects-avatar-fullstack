import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { AiOutlineClose } from 'react-icons/ai';
import { Overdue } from '@/types';
interface AddRowOverdueProps {
  isOpen: boolean;
  onClose: () => void;
  refreshData: () => void;
}

const AddRowOverdue: React.FC<AddRowOverdueProps> = ({ isOpen, onClose, refreshData }) => {
  const [formData, setFormData] = useState<Overdue>({
    id: '',
    poid: '',
    invoicenumber: '',
    invoicedate: '',
    quantity: '',
    rate: '',
    expecteddate: '',
    amountexpected: '',
    startdate: '',
    enddate: '',
    status: '',
    remindertype: '',
    amountreceived: '',
    receiveddate: '',
    releaseddate: '',
    checknumber: '',
    invoiceurl: '',
    checkurl: '',
    companyname: '',
    vendorfax: '',
    vendorphone: '',
    vendoremail: '',
    timsheetemail: '',
    hrname: '',
    hremail: '',
    hrphone: '',
    managername: '',
    manageremail: '',
    managerphone: '',
    secondaryname: '',
    secondaryemail: '',
    secondaryphone: '',
    candidatename: '',
    candidatephone: '',
    candidateemail: '',
    wrkemail: '',
    wrkphone: '',
    recruitername: '',
    recruiterphone: '',
    recruiteremail: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/overdues/insert`, formData, {
        headers: { AuthToken: localStorage.getItem('token') },
      });

      const newOverdue = response.data; // assuming the API returns the new overdue
      refreshData(); // Pass the new overdue to be added
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
          onClick={onClose}
          className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
        >
          &times;
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Add New Overdue</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* PO ID */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">PO ID</label>
          <input
            type="text"
            name="poid"
            value={formData.poid}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter PO ID"
          />
        </div>

        {/* Invoice Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Invoice Number</label>
          <input
            type="text"
            name="invoicenumber"
            value={formData.invoicenumber}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Invoice Number"
          />
        </div>

        {/* Invoice Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Invoice Date</label>
          <input
            type="date"
            name="invoicedate"
            value={formData.invoicedate}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Quantity</label>
          <input
            type="text"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Quantity"
          />
        </div>

        {/* Rate */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Rate</label>
          <input
            type="text"
            name="rate"
            value={formData.rate}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Rate"
          />
        </div>

        {/* Expected Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Expected Date</label>
          <input
            type="date"
            name="expecteddate"
            value={formData.expecteddate}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        {/* Amount Expected */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Amount Expected</label>
          <input
            type="text"
            name="amountexpected"
            value={formData.amountexpected}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Amount Expected"
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            name="startdate"
            value={formData.startdate}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            name="enddate"
            value={formData.enddate}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
          <input
            type="text"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Status"
          />
        </div>

        {/* Reminder Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Reminder Type</label>
          <input
            type="text"
            name="remindertype"
            value={formData.remindertype}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Reminder Type"
          />
        </div>

        {/* Amount Received */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Amount Received</label>
          <input
            type="text"
            name="amountreceived"
            value={formData.amountreceived}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Amount Received"
          />
        </div>

        {/* Received Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Received Date</label>
          <input
            type="date"
            name="receiveddate"
            value={formData.receiveddate}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        {/* Released Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Released Date</label>
          <input
            type="date"
            name="releaseddate"
            value={formData.releaseddate}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        {/* Check Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Check Number</label>
          <input
            type="text"
            name="checknumber"
            value={formData.checknumber}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Check Number"
          />
        </div>

        {/* Invoice URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Invoice URL</label>
          <input
            type="text"
            name="invoiceurl"
            value={formData.invoiceurl}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Invoice URL"
          />
        </div>

        {/* Check URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Check URL</label>
          <input
            type="text"
            name="checkurl"
            value={formData.checkurl}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Check URL"
          />
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
          <input
            type="text"
            name="companyname"
            value={formData.companyname}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Company Name"
          />
        </div>

        {/* Vendor Fax */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Vendor Fax</label>
          <input
            type="text"
            name="vendorfax"
            value={formData.vendorfax}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Vendor Fax"
          />
        </div>

        {/* Vendor Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Vendor Phone</label>
          <input
            type="text"
            name="vendorphone"
            value={formData.vendorphone}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Vendor Phone"
          />
        </div>

        {/* Vendor Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Vendor Email</label>
          <input
            type="text"
            name="vendoremail"
            value={formData.vendoremail}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Vendor Email"
          />
        </div>

        {/* Timesheet Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Timesheet Email</label>
          <input
            type="text"
            name="timsheetemail"
            value={formData.timsheetemail}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Timesheet Email"
          />
        </div>

        {/* HR Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">HR Name</label>
          <input
            type="text"
            name="hrname"
            value={formData.hrname}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter HR Name"
          />
        </div>

        {/* HR Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">HR Email</label>
          <input
            type="text"
            name="hremail"
            value={formData.hremail}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter HR Email"
          />
        </div>

        {/* HR Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">HR Phone</label>
          <input
            type="text"
            name="hrphone"
            value={formData.hrphone}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter HR Phone"
          />
        </div>

        {/* Manager Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Manager Name</label>
          <input
            type="text"
            name="managername"
            value={formData.managername}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Manager Name"
          />
        </div>

        {/* Manager Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Manager Email</label>
          <input
            type="text"
            name="manageremail"
            value={formData.manageremail}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Manager Email"
          />
        </div>

        {/* Manager Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Manager Phone</label>
          <input
            type="text"
            name="managerphone"
            value={formData.managerphone}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Manager Phone"
          />
        </div>

        {/* Secondary Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Secondary Name</label>
          <input
            type="text"
            name="secondaryname"
            value={formData.secondaryname}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Secondary Name"
          />
        </div>

        {/* Secondary Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Secondary Email</label>
          <input
            type="text"
            name="secondaryemail"
            value={formData.secondaryemail}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Secondary Email"
          />
        </div>

        {/* Secondary Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Secondary Phone</label>
          <input
            type="text"
            name="secondaryphone"
            value={formData.secondaryphone}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Secondary Phone"
          />
        </div>

        {/* Candidate Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Candidate Name</label>
          <input
            type="text"
            name="candidatename"
            value={formData.candidatename}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Candidate Name"
          />
        </div>

        {/* Candidate Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Candidate Phone</label>
          <input
            type="text"
            name="candidatephone"
            value={formData.candidatephone}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Candidate Phone"
          />
        </div>

        {/* Candidate Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Candidate Email</label>
          <input
            type="text"
            name="candidateemail"
            value={formData.candidateemail}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Candidate Email"
          />
        </div>

        {/* Work Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Work Email</label>
          <input
            type="text"
            name="wrkemail"
            value={formData.wrkemail}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Work Email"
          />
        </div>

        {/* Work Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Work Phone</label>
          <input
            type="text"
            name="wrkphone"
            value={formData.wrkphone}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Work Phone"
          />
        </div>

        {/* Recruiter Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Recruiter Name</label>
          <input
            type="text"
            name="recruitername"
            value={formData.recruitername}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Recruiter Name"
          />
        </div>

        {/* Recruiter Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Recruiter Phone</label>
          <input
            type="text"
            name="recruiterphone"
            value={formData.recruiterphone}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Recruiter Phone"
          />
        </div>

        {/* Recruiter Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Recruiter Email</label>
          <input
            type="text"
            name="recruiteremail"
            value={formData.recruiteremail}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Recruiter Email"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
          <input
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Notes"
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

export default AddRowOverdue;

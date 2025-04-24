import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { AiOutlineClose } from 'react-icons/ai';
import { Vendor } from '../../types/index';

interface AddRowPOProps {
  isOpen: boolean;
  onClose: () => void;
  refreshData: () => void;
}

const AddRowVendor: React.FC<AddRowPOProps> = ({ isOpen, onClose, refreshData }) => {
  const [formData, setFormData] = useState<Vendor>({
    id: '',
    companyname: '',
    email: '',
    status: 'Current',
    accountnumber: '',
    tier: 2,
    phone: '000-000-0000',
    fax: '000-000-0000',
    address: '',
    city: '',
    state: '',
    country: '',
    zip: '',
    url: '',
    solicited: 'N',
    hirebeforeterm: 'N',
    hireafterterm: 'N',
    minrate: 62,
    latepayments: 'N',
    totalnetterm: 45,
    defaultedpayment: 'N',
    culture: 'D',
    hrname: '',
    hremail: '',
    hrphone: '',
    managername: '',
    twitter: '',
    facebook: '',
    linkedin: '',
    manageremail: '',
    managerphone: '',
    secondaryname: '',
    secondaryemail: '',
    secondaryphone: '',
    timsheetemail: '',
    agreementstatus: 'Not Available',
    agreementname: '',
    agreementlink: '',
    subcontractorlink: '',
    nonsolicitationlink: '',
    nonhirelink: '',
    clients: '',
    notes: '',
    name: '',
    vendorid: '',
    comp: '',
    dob: '',
    designation: '',
    personalemail: '',
    skypeid: '',
    review: '',
  });

  // Options matching PHP backend
  const statusOptions = ["Current", "blacklist", "rejectedus", "duplicate"];
  const tierOptions = [1, 2, 3, 4];
  const cultureOptions = ["D", "A", "B", "C"];
  const yesNoOptions = ["Y", "N"];
  const agreementStatusOptions = ["Not Available", "Not Complete", "Complete"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'minrate' || name === 'totalnetterm' || name === 'tier' ? 
               Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Prepare the data exactly as PHP expects it
    const submissionData = {
      ...formData,
      // Ensure all number fields are numbers
      tier: Number(formData.tier),
      minrate: Number(formData.minrate),
      totalnetterm: Number(formData.totalnetterm),
      // Fix the timesheet email field name to match PHP
      timsheetemail: formData.timsheetemail,
    };

    console.log('Submitting:', submissionData);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/vendor/add`, submissionData, {
        headers: { 
          'Content-Type': 'application/json',
          AuthToken: localStorage.getItem('token') 
        },
      });

      refreshData();
      onClose();
    } catch (error) {
      console.error('Error details:', error.response?.data);
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
          maxWidth: '800px',
          width: '90%',
          maxHeight: '90vh',
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
        <button onClick={onClose} className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200">
          <AiOutlineClose />
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Add New Vendor</h2>

      <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Column 1 */}
        <div className="space-y-4">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              name="companyname"
              value={formData.companyname}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter company name"
            />
          </div>

          {/* Email - Required */}
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

          {/* Tier */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tier</label>
            <select
              name="tier"
              value={formData.tier}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            >
              {tierOptions.map(option => (
                <option key={option} value={option}>Level {option}</option>
              ))}
            </select>
          </div>

          {/* Culture */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Culture</label>
            <select
              name="culture"
              value={formData.culture}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            >
              {cultureOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Min Rate */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Min Rate</label>
            <input
              type="number"
              name="minrate"
              value={formData.minrate}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter min rate"
              step="0.01"
            />
          </div>

          {/* Total Net Term */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Total Net Term (0-80)</label>
            <input
              type="number"
              name="totalnetterm"
              value={formData.totalnetterm}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter total net term"
              min="0"
              max="80"
            />
          </div>

          {/* Additional Fields */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Vendor ID</label>
            <input
              type="text"
              name="vendorid"
              value={formData.vendorid}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter vendor ID"
            />
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
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
          {/* Timesheet Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Timesheet Email</label>
            <input
              type="email"
              name="timsheetemail"
              value={formData.timsheetemail}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter timesheet email"
            />
          </div>

          {/* Agreement Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Agreement Status</label>
            <select
              name="agreementstatus"
              value={formData.agreementstatus}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            >
              {agreementStatusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Yes/No Fields */}
          {['solicited', 'hirebeforeterm', 'hireafterterm', 'latepayments', 'defaultedpayment'].map(field => (
            <div key={field}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {field === 'solicited' ? 'Solicited' : 
                 field === 'hirebeforeterm' ? 'Hire Before Term' :
                 field === 'hireafterterm' ? 'Hire After Term' :
                 field === 'latepayments' ? 'Late Payments' : 'Defaulted Payment'}
              </label>
              <select
                name={field}
                value={formData[field as keyof Vendor] as string}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                {yesNoOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          ))}

          {/* URL Fields */}
          {['url', 'agreementlink', 'subcontractorlink', 'nonsolicitationlink', 'nonhirelink'].map(field => (
            <div key={field}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {field === 'url' ? 'Website URL' :
                 field === 'agreementlink' ? 'Agreement URL' :
                 field === 'subcontractorlink' ? 'Subcontractor URL' :
                 field === 'nonsolicitationlink' ? 'NSA URL' : 'Non-Hire URL'}
              </label>
              <input
                type="url"
                name={field}
                value={formData[field as keyof Vendor] as string}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder={`Enter ${field} URL`}
              />
            </div>
          ))}

          {/* Additional Fields */}
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">Review</label>
            <input
              type="text"
              name="review"
              value={formData.review}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter review"
            />
          </div>
        </div>

        {/* Full width fields */}
        <div className="md:col-span-2 space-y-4">
          {/* HR Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">HR Name</label>
              <input
                type="text"
                name="hrname"
                value={formData.hrname}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter HR name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">HR Email</label>
              <input
                type="email"
                name="hremail"
                value={formData.hremail}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter HR email"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">HR Phone</label>
              <input
                type="text"
                name="hrphone"
                value={formData.hrphone}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter HR phone"
              />
            </div>
          </div>

          {/* Manager Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Manager Name</label>
              <input
                type="text"
                name="managername"
                value={formData.managername}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter manager name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Manager Email</label>
              <input
                type="email"
                name="manageremail"
                value={formData.manageremail}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter manager email"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Manager Phone</label>
              <input
                type="text"
                name="managerphone"
                value={formData.managerphone}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter manager phone"
              />
            </div>
          </div>

          {/* Secondary Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Secondary Name</label>
              <input
                type="text"
                name="secondaryname"
                value={formData.secondaryname}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter secondary contact name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Secondary Email</label>
              <input
                type="email"
                name="secondaryemail"
                value={formData.secondaryemail}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter secondary email"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Secondary Phone</label>
              <input
                type="text"
                name="secondaryphone"
                value={formData.secondaryphone}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter secondary phone"
              />
            </div>
          </div>

          {/* Social Media */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <label className="block text-sm font-semibold text-gray-700 mb-1">LinkedIn</label>
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter LinkedIn URL"
              />
            </div>
          </div>

          {/* Clients */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Clients</label>
            <textarea
              name="clients"
              value={formData.clients}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter clients"
              rows={3}
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
              placeholder="Enter notes"
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
          >
            Save Vendor
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddRowVendor;


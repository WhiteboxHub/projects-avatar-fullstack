import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { AiOutlineClose } from 'react-icons/ai';

interface FormData {
  name: string;
  enrolleddate: string;
  email: string;
  course: string;
  phone: string;
  status: string;
  workstatus: string;
  education: string;
  workexperience: string;
  ssn: string;
  agreement: string;
  promissory: string;
  driverslicense: string;
  workpermit: string;
  wpexpirationdate: string;
  offerletter: string;
  secondaryemail: string;
  secondaryphone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  linkedin: string;
  dob: string;
  emergcontactname: string;
  emergcontactemail: string;
  emergcontactphone: string;
  emergcontactaddrs: string;
  guidelines: string;
  ssnvalidated: string;
  bgv: string;
  term: string;
  feepaid: string;
  feedue: string;
  salary0: string;
  salary6: string;
  salary12: string;
  guarantorname: string;
  guarantordesignation: string;
  guarantorcompany: string;
  contracturl: string;
  empagreementurl: string;
  offerletterurl: string;
  dlurl: string;
  workpermiturl: string;
  ssnurl: string;
  referralid: string;
  portalid: string;
  avatarid: string;
  notes: string;
  batchname: string;
  coverletter: string;
  background: string;
  recruiterassesment: string;
  instructorassesment: string;
  processflag: string;
  defaultprocessflag: string;
  originalresume: string;
  lastmoddatetime: string;
  statuschangedate: string;
  diceflag: string;
  batchid: string;
  emaillist: string;
}

interface AddRowCandidateProps {
  isOpen: boolean;
  refreshData: () => void;
  onClose: () => void;
}

const AddRowCandidate: React.FC<AddRowCandidateProps> = ({ isOpen, refreshData, onClose }) => {
  const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
  const [formData, setFormData] = useState<FormData>({
    name: '',
    enrolleddate: '',
    email: '',
    course: '',
    phone: '',
    status: '',
    workstatus: '',
    education: '',
    workexperience: '',
    ssn: '',
    agreement: '',
    promissory: '',
    driverslicense: '',
    workpermit: '',
    wpexpirationdate: '',
    offerletter: '',
    secondaryemail: '',
    secondaryphone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zip: '',
    linkedin: '',
    dob: '',
    emergcontactname: '',
    emergcontactemail: '',
    emergcontactphone: '',
    emergcontactaddrs: '',
    guidelines: '',
    ssnvalidated: '',
    bgv: '',
    term: '',
    feepaid: '',
    feedue: '',
    salary0: '',
    salary6: '',
    salary12: '',
    guarantorname: '',
    guarantordesignation: '',
    guarantorcompany: '',
    contracturl: '',
    empagreementurl: '',
    offerletterurl: '',
    dlurl: '',
    workpermiturl: '',
    ssnurl: '',
    referralid: '',
    portalid: '',
    avatarid: '',
    notes: '',
    batchname: '',
    coverletter: '',
    background: '',
    recruiterassesment: '',
    instructorassesment: '',
    processflag: '',
    defaultprocessflag: '',
    originalresume: '',
    lastmoddatetime: '',
    statuschangedate: '',
    diceflag: '',
    batchid: '',
    emaillist: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/candidates/insert`, formData, {
        headers: { AuthToken: localStorage.getItem('token') },
      });

      // Here, use the newly created batch data for the refreshData
      const newBatch = response.data; // assuming the API returns the new batch
      refreshData(); // Pass the new batch to be added
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Add New Candidate</h2>
  
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="modal-field">
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter name"
            required
          />
        </div>
  
        {/* Enrolled Date */}
        <div className="modal-field">
          <label htmlFor="enrolleddate" className="block text-sm font-semibold text-gray-700 mb-1">Enrolled Date</label>
          <input
            type="date"
            id="enrolleddate"
            name="enrolleddate"
            value={formData.enrolleddate}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>
  
        {/* Email */}
        <div className="modal-field">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter email"
            required
          />
        </div>
  
        {/* Course */}
        <div className="modal-field">
          <label htmlFor="course" className="block text-sm font-semibold text-gray-700 mb-1">Course</label>
          <input
            type="text"
            id="course"
            name="course"
            value={formData.course}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter course"
          />
        </div>
  
        {/* Phone */}
        <div className="modal-field">
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter phone"
          />
        </div>
  
        {/* Status */}
        <div className="modal-field">
          <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
          <input
            type="text"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter status"
          />
        </div>
  
        {/* Work Status */}
        <div className="modal-field">
          <label htmlFor="workstatus" className="block text-sm font-semibold text-gray-700 mb-1">Work Status</label>
          <input
            type="text"
            id="workstatus"
            name="workstatus"
            value={formData.workstatus}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter work status"
          />
        </div>
  
        {/* Education */}
        <div className="modal-field">
          <label htmlFor="education" className="block text-sm font-semibold text-gray-700 mb-1">Education</label>
          <input
            type="text"
            id="education"
            name="education"
            value={formData.education}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter education"
          />
        </div>
  
        {/* Work Experience */}
        <div className="modal-field">
          <label htmlFor="workexperience" className="block text-sm font-semibold text-gray-700 mb-1">Work Experience</label>
          <input
            type="text"
            id="workexperience"
            name="workexperience"
            value={formData.workexperience}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter work experience"
          />
        </div>
  
        {/* SSN */}
        <div className="modal-field">
          <label htmlFor="ssn" className="block text-sm font-semibold text-gray-700 mb-1">SSN</label>
          <input
            type="text"
            id="ssn"
            name="ssn"
            value={formData.ssn}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter SSN"
          />
        </div>
  
        {/* Agreement */}
        <div className="modal-field">
          <label htmlFor="agreement" className="block text-sm font-semibold text-gray-700 mb-1">Agreement</label>
          <input
            type="text"
            id="agreement"
            name="agreement"
            value={formData.agreement}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter agreement"
          />
        </div>
  
        {/* Promissory */}
        <div className="modal-field">
          <label htmlFor="promissory" className="block text-sm font-semibold text-gray-700 mb-1">Promissory</label>
          <input
            type="text"
            id="promissory"
            name="promissory"
            value={formData.promissory}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter promissory"
          />
        </div>
  
        {/* Driver's License */}
        <div className="modal-field">
          <label htmlFor="driverslicense" className="block text-sm font-semibold text-gray-700 mb-1">Driver's License</label>
          <input
            type="text"
            id="driverslicense"
            name="driverslicense"
            value={formData.driverslicense}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter driver's license"
          />
        </div>
  
        {/* Work Permit */}
        <div className="modal-field">
          <label htmlFor="workpermit" className="block text-sm font-semibold text-gray-700 mb-1">Work Permit</label>
          <input
            type="text"
            id="workpermit"
            name="workpermit"
            value={formData.workpermit}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter work permit"
          />
        </div>
  
        {/* Work Permit Expiration Date */}
        <div className="modal-field">
          <label htmlFor="wpexpirationdate" className="block text-sm font-semibold text-gray-700 mb-1">Work Permit Expiration Date</label>
          <input
            type="date"
            id="wpexpirationdate"
            name="wpexpirationdate"
            value={formData.wpexpirationdate}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>
  
        {/* Offer Letter */}
        <div className="modal-field">
          <label htmlFor="offerletter" className="block text-sm font-semibold text-gray-700 mb-1">Offer Letter</label>
          <input
            type="text"
            id="offerletter"
            name="offerletter"
            value={formData.offerletter}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter offer letter"
          />
        </div>
  
        {/* Secondary Email */}
        <div className="modal-field">
          <label htmlFor="secondaryemail" className="block text-sm font-semibold text-gray-700 mb-1">Secondary Email</label>
          <input
            type="email"
            id="secondaryemail"
            name="secondaryemail"
            value={formData.secondaryemail}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter secondary email"
          />
        </div>
  
        {/* Secondary Phone */}
        <div className="modal-field">
          <label htmlFor="secondaryphone" className="block text-sm font-semibold text-gray-700 mb-1">Secondary Phone</label>
          <input
            type="text"
            id="secondaryphone"
            name="secondaryphone"
            value={formData.secondaryphone}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter secondary phone"
          />
        </div>
  
        {/* Address */}
        <div className="modal-field">
          <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter address"
          />
        </div>
  
        {/* City */}
        <div className="modal-field">
          <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-1">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter city"
          />
        </div>
  
        {/* State */}
        <div className="modal-field">
          <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-1">State</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter state"
          />
        </div>
  
        {/* Country */}
        <div className="modal-field">
          <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter country"
          />
        </div>
  
        {/* Zip */}
        <div className="modal-field">
          <label htmlFor="zip" className="block text-sm font-semibold text-gray-700 mb-1">Zip</label>
          <input
            type="text"
            id="zip"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter zip"
          />
        </div>
  
        {/* LinkedIn */}
        <div className="modal-field">
          <label htmlFor="linkedin" className="block text-sm font-semibold text-gray-700 mb-1">LinkedIn</label>
          <input
            type="text"
            id="linkedin"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter LinkedIn"
          />
        </div>
  
        {/* Date of Birth */}
        <div className="modal-field">
          <label htmlFor="dob" className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>
  
        {/* Emergency Contact Name */}
        <div className="modal-field">
          <label htmlFor="emergcontactname" className="block text-sm font-semibold text-gray-700 mb-1">Emergency Contact Name</label>
          <input
            type="text"
            id="emergcontactname"
            name="emergcontactname"
            value={formData.emergcontactname}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter emergency contact name"
          />
        </div>
  
        {/* Emergency Contact Email */}
        <div className="modal-field">
          <label htmlFor="emergcontactemail" className="block text-sm font-semibold text-gray-700 mb-1">Emergency Contact Email</label>
          <input
            type="email"
            id="emergcontactemail"
            name="emergcontactemail"
            value={formData.emergcontactemail}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter emergency contact email"
          />
        </div>
  
        {/* Emergency Contact Phone */}
        <div className="modal-field">
          <label htmlFor="emergcontactphone" className="block text-sm font-semibold text-gray-700 mb-1">Emergency Contact Phone</label>
          <input
            type="text"
            id="emergcontactphone"
            name="emergcontactphone"
            value={formData.emergcontactphone}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter emergency contact phone"
          />
        </div>
  
        {/* Emergency Contact Address */}
        <div className="modal-field">
          <label htmlFor="emergcontactaddrs" className="block text-sm font-semibold text-gray-700 mb-1">Emergency Contact Address</label>
          <input
            type="text"
            id="emergcontactaddrs"
            name="emergcontactaddrs"
            value={formData.emergcontactaddrs}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter emergency contact address"
          />
        </div>
  
        {/* Guidelines */}
        <div className="modal-field">
          <label htmlFor="guidelines" className="block text-sm font-semibold text-gray-700 mb-1">Guidelines</label>
          <input
            type="text"
            id="guidelines"
            name="guidelines"
            value={formData.guidelines}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter guidelines"
          />
        </div>
  
        {/* SSN Validated */}
        <div className="modal-field">
          <label htmlFor="ssnvalidated" className="block text-sm font-semibold text-gray-700 mb-1">SSN Validated</label>
          <input
            type="text"
            id="ssnvalidated"
            name="ssnvalidated"
            value={formData.ssnvalidated}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter SSN validated"
          />
        </div>
  
        {/* BGV */}
        <div className="modal-field">
          <label htmlFor="bgv" className="block text-sm font-semibold text-gray-700 mb-1">BGV</label>
          <input
            type="text"
            id="bgv"
            name="bgv"
            value={formData.bgv}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter BGV"
          />
        </div>
  
        {/* Term */}
        <div className="modal-field">
          <label htmlFor="term" className="block text-sm font-semibold text-gray-700 mb-1">Term</label>
          <input
            type="text"
            id="term"
            name="term"
            value={formData.term}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter term"
          />
        </div>
  
        {/* Fee Paid */}
        <div className="modal-field">
          <label htmlFor="feepaid" className="block text-sm font-semibold text-gray-700 mb-1">Fee Paid</label>
          <input
            type="text"
            id="feepaid"
            name="feepaid"
            value={formData.feepaid}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter fee paid"
          />
        </div>
  
        {/* Fee Due */}
        <div className="modal-field">
          <label htmlFor="feedue" className="block text-sm font-semibold text-gray-700 mb-1">Fee Due</label>
          <input
            type="text"
            id="feedue"
            name="feedue"
            value={formData.feedue}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter fee due"
          />
        </div>
  
        {/* Salary 0 */}
        <div className="modal-field">
          <label htmlFor="salary0" className="block text-sm font-semibold text-gray-700 mb-1">Salary 0</label>
          <input
            type="text"
            id="salary0"
            name="salary0"
            value={formData.salary0}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter salary 0"
          />
        </div>
  
        {/* Salary 6 */}
        <div className="modal-field">
          <label htmlFor="salary6" className="block text-sm font-semibold text-gray-700 mb-1">Salary 6</label>
          <input
            type="text"
            id="salary6"
            name="salary6"
            value={formData.salary6}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter salary 6"
          />
        </div>
  
        {/* Salary 12 */}
        <div className="modal-field">
          <label htmlFor="salary12" className="block text-sm font-semibold text-gray-700 mb-1">Salary 12</label>
          <input
            type="text"
            id="salary12"
            name="salary12"
            value={formData.salary12}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter salary 12"
          />
        </div>
  
        {/* Guarantor Name */}
        <div className="modal-field">
          <label htmlFor="guarantorname" className="block text-sm font-semibold text-gray-700 mb-1">Guarantor Name</label>
          <input
            type="text"
            id="guarantorname"
            name="guarantorname"
            value={formData.guarantorname}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter guarantor name"
          />
        </div>
  
        {/* Guarantor Designation */}
        <div className="modal-field">
          <label htmlFor="guarantordesignation" className="block text-sm font-semibold text-gray-700 mb-1">Guarantor Designation</label>
          <input
            type="text"
            id="guarantordesignation"
            name="guarantordesignation"
            value={formData.guarantordesignation}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter guarantor designation"
          />
        </div>
  
        {/* Guarantor Company */}
        <div className="modal-field">
          <label htmlFor="guarantorcompany" className="block text-sm font-semibold text-gray-700 mb-1">Guarantor Company</label>
          <input
            type="text"
            id="guarantorcompany"
            name="guarantorcompany"
            value={formData.guarantorcompany}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter guarantor company"
          />
        </div>
  
        {/* Contract URL */}
        <div className="modal-field">
          <label htmlFor="contracturl" className="block text-sm font-semibold text-gray-700 mb-1">Contract URL</label>
          <input
            type="text"
            id="contracturl"
            name="contracturl"
            value={formData.contracturl}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter contract URL"
          />
        </div>
  
        {/* Employment Agreement URL */}
        <div className="modal-field">
          <label htmlFor="empagreementurl" className="block text-sm font-semibold text-gray-700 mb-1">Employment Agreement URL</label>
          <input
            type="text"
            id="empagreementurl"
            name="empagreementurl"
            value={formData.empagreementurl}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter employment agreement URL"
          />
        </div>
  
        {/* Offer Letter URL */}
        <div className="modal-field">
          <label htmlFor="offerletterurl" className="block text-sm font-semibold text-gray-700 mb-1">Offer Letter URL</label>
          <input
            type="text"
            id="offerletterurl"
            name="offerletterurl"
            value={formData.offerletterurl}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="Enter offer letter URL"
        />
      </div>

      {/* Avatar ID */}
      <div className="modal-field">
        <label htmlFor="avatarid" className="block text-sm font-semibold text-gray-700 mb-1">Avatar ID</label>
        <input
          type="text"
          id="avatarid"
          name="avatarid"
          value={formData.avatarid}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          placeholder="Enter avatar ID"
        />
      </div>

      {/* Notes */}
      <div className="modal-field">
        <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
        <input
          type="text"
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          placeholder="Enter notes"
        />
      </div>

      {/* Batch Name */}
      <div className="modal-field">
        <label htmlFor="batchname" className="block text-sm font-semibold text-gray-700 mb-1">Batch Name</label>
        <input
          type="text"
          id="batchname"
          name="batchname"
          value={formData.batchname}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          placeholder="Enter batch name"
          required
        />
      </div>

      {/* Cover Letter */}
      <div className="modal-field">
        <label htmlFor="coverletter" className="block text-sm font-semibold text-gray-700 mb-1">Cover Letter</label>
        <input
          type="text"
          id="coverletter"
          name="coverletter"
          value={formData.coverletter}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          placeholder="Enter cover letter"
        />
      </div>

      {/* Background */}
      <div className="modal-field">
        <label htmlFor="background" className="block text-sm font-semibold text-gray-700 mb-1">Background</label>
        <input
          type="text"
          id="background"
          name="background"
          value={formData.background}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          placeholder="Enter background"
        />
      </div>

      {/* Recruiter Assessment */}
      <div className="modal-field">
        <label htmlFor="recruiterassesment" className="block text-sm font-semibold text-gray-700 mb-1">Recruiter Assessment</label>
        <input
          type="text"
          id="recruiterassesment"
          name="recruiterassesment"
          value={formData.recruiterassesment}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          placeholder="Enter recruiter assessment"
        />
      </div>

      {/* Instructor Assessment */}
      <div className="modal-field">
        <label htmlFor="instructorassesment" className="block text-sm font-semibold text-gray-700 mb-1">Instructor Assessment</label>
        <input
          type="text"
          id="instructorassesment"
          name="instructorassesment"
          value={formData.instructorassesment}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          placeholder="Enter instructor assessment"
        />
      </div>

      {/* Process Flag */}
      <div className="modal-field">
        <label htmlFor="processflag" className="block text-sm font-semibold text-gray-700 mb-1">Process Flag</label>
        <input
          type="text"
          id="processflag"
          name="processflag"
          value={formData.processflag}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          placeholder="Enter process flag"
        />
      </div>

      {/* Default Process Flag */}
      <div className="modal-field">
        <label htmlFor="defaultprocessflag" className="block text-sm font-semibold text-gray-700 mb-1">Default Process Flag</label>
        <input
          type="text"
          id="defaultprocessflag"
          name="defaultprocessflag"
          value={formData.defaultprocessflag}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          placeholder="Enter default process flag"
        />
      </div>

      {/* Original Resume */}
      <div className="modal-field">
        <label htmlFor="originalresume" className="block text-sm font-semibold text-gray-700 mb-1">Original Resume</label>
        <input
          type="text"
          id="originalresume"
          name="originalresume"
          value={formData.originalresume}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          placeholder="Enter original resume"
        />
      </div>

      {/* Last Modification Date */}
      <div className="modal-field">
        <label htmlFor="lastmoddatetime" className="block text-sm font-semibold text-gray-700 mb-1">Last Modification Date</label>
        <input
          type="date"
          id="lastmoddatetime"
          name="lastmoddatetime"
          value={formData.lastmoddatetime}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        />
      </div>

      {/* Status Change Date */}
      <div className="modal-field">
        <label htmlFor="statuschangedate" className="block text-sm font-semibold text-gray-700 mb-1">Status Change Date</label>
        <input
          type="date"
          id="statuschangedate"
          name="statuschangedate"
          value={formData.statuschangedate}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        />
      </div>

      {/* Dice Flag */}
      <div className="modal-field">
        <label htmlFor="diceflag" className="block text-sm font-semibold text-gray-700 mb-1">Dice Flag</label>
        <input
          type="text"
          id="diceflag"
          name="diceflag"
          value={formData.diceflag}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          placeholder="Enter dice flag"
        />
      </div>

      {/* Batch ID */}
      <div className="modal-field">
        <label htmlFor="batchid" className="block text-sm font-semibold text-gray-700 mb-1">Batch ID</label>
        <input
          type="text"
          id="batchid"
          name="batchid"
          value={formData.batchid}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          placeholder="Enter batch ID"
        />
      </div>

      {/* Email List */}
      <div className="modal-field">
        <label htmlFor="emaillist" className="block text-sm font-semibold text-gray-700 mb-1">Email List</label>
        <input
          type="text"
          id="emaillist"
          name="emaillist"
          value={formData.emaillist}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          placeholder="Enter email list"
        />
      </div>

      <button
        type="submit"
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
      >
        Save Candidate
      </button>
    </form>
  </Modal>
);
 
};

export default AddRowCandidate;

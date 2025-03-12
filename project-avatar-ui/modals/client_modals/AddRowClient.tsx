// import React, { useState } from 'react';
// import Modal from 'react-modal';
// import axios from 'axios';
// import { AiOutlineClose } from 'react-icons/ai';

// interface Recruiter {
//   id?: string;
//   name?: string;
//   email?: string;
//   phone?: string;
//   designation?: string;
//   clientid?: string;
//   comp?: string;
//   status?: string;
//   dob?: string;
//   personalemail?: string;
//   skypeid?: string;
//   linkedin?: string;
//   twitter?: string;
//   facebook?: string;
//   review?: string;
//   notes?: string;
// }

// interface AddRowModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   refreshData: () => void;
// }

// const AddRowModal: React.FC<AddRowModalProps> = ({ isOpen, onClose, refreshData }) => {
//   const [formData, setFormData] = useState<Recruiter>({
//     name: '',
//     email: '',
//     phone: '',
//     designation: '',
//     clientid: '',
//     comp: '',
//     status: '',
//     dob: '',
//     personalemail: '',
//     skypeid: '',
//     linkedin: '',
//     twitter: '',
//     facebook: '',
//     review: '',
//     notes: '',
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await axios.post('/api/recruiter', formData);
//       refreshData();
//       onClose();
//     } catch (error) {
//       console.error('Error adding recruiter:', error);
//     }
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       style={{
//         content: {
//           top: '55%',
//           left: '50%',
//           right: 'auto',
//           bottom: 'auto',
//           transform: 'translate(-50%, -50%)',
//           maxWidth: '400px',
//           width: '90%',
//           maxHeight: '80vh',
//           padding: '24px',
//           borderRadius: '12px',
//           boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
//           overflowY: 'auto',
//           fontFamily: 'Arial, sans-serif',
//         },
//         overlay: {
//           backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         },
//       }}
//     >
//       <div className="relative">
//         <button
//           onClick={onClose}
//           className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
//         >
//           &times;
//         </button>
//       </div>
//       <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Add New Recruiter</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Name */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter name"
//           />
//         </div>

//         {/* Email */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter email"
//           />
//         </div>

//         {/* Phone */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
//           <input
//             type="text"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter phone"
//           />
//         </div>

//         {/* Designation */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Designation</label>
//           <input
//             type="text"
//             name="designation"
//             value={formData.designation}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter designation"
//           />
//         </div>

//         {/* Client ID */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Client ID</label>
//           <input
//             type="text"
//             name="clientid"
//             value={formData.clientid}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter client ID"
//           />
//         </div>

//         {/* Company Name */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
//           <input
//             type="text"
//             name="comp"
//             value={formData.comp}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter company name"
//           />
//         </div>

//         {/* Status */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
//           <input
//             type="text"
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter status"
//           />
//         </div>

//         {/* Date of Birth */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
//           <input
//             type="date"
//             name="dob"
//             value={formData.dob}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>

//         {/* Personal Email */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Personal Email</label>
//           <input
//             type="email"
//             name="personalemail"
//             value={formData.personalemail}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter personal email"
//           />
//         </div>

//         {/* Skype ID */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Skype ID</label>
//           <input
//             type="text"
//             name="skypeid"
//             value={formData.skypeid}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter Skype ID"
//           />
//         </div>

//         {/* LinkedIn */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">LinkedIn</label>
//           <input
//             type="text"
//             name="linkedin"
//             value={formData.linkedin}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter LinkedIn"
//           />
//         </div>

//         {/* Twitter */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Twitter</label>
//           <input
//             type="text"
//             name="twitter"
//             value={formData.twitter}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter Twitter"
//           />
//         </div>

//         {/* Facebook */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Facebook</label>
//           <input
//             type="text"
//             name="facebook"
//             value={formData.facebook}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter Facebook"
//           />
//         </div>

//         {/* Review */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Review</label>
//           <input
//             type="text"
//             name="review"
//             value={formData.review}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter review"
//           />
//         </div>

//         {/* Notes */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
//           <input
//             type="text"
//             name="notes"
//             value={formData.notes}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter notes"
//           />
//         </div>

//         <button
//           type="submit"
//           className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
//         >
//           Save Recruiter
//         </button>
//       </form>
//     </Modal>
//   );
// };

// export default AddRowModal;
import React from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Client, ClientCreate, ClientStatus, ClientTier, ValidationPatterns } from '@/types/client';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { AiOutlineClose } from 'react-icons/ai';

interface AddRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  refreshData: () => void;
}

const AddRowModal: React.FC<AddRowModalProps> = ({ isOpen, onClose, refreshData }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ClientCreate>();

  const onSubmit = async (data: ClientCreate) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client`, data);
      toast.success('Client added successfully');
      refreshData();
      reset();
      onClose();
    } catch (error) {
      toast.error('Error adding client');
      console.error('Error adding client:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="relative w-full max-w-4xl p-6 bg-white rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Client</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            <AiOutlineClose />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
          {/* Company Information Section */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
              Company Information
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name *</label>
              <input
                {...register('companyName', { 
                  required: 'Company name is required',
                  maxLength: { value: 100, message: 'Company name is too long' }
                })}
                className="form-input"
                placeholder="Enter company name"
              />
              {errors.companyName && (
                <p className="error-message">{errors.companyName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tier</label>
              <select
                {...register('tier')}
                className="form-select"
              >
                {Object.values(ClientTier).map((tier) => (
                  <option key={tier} value={tier}>{tier}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                {...register('status')}
                className="form-select"
              >
                {Object.values(ClientStatus).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Website URL</label>
              <input
                {...register('url', {
                  pattern: {
                    value: ValidationPatterns.url,
                    message: 'Please enter a valid URL'
                  }
                })}
                className="form-input"
                placeholder="https://example.com"
              />
              {errors.url && (
                <p className="error-message">{errors.url.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: ValidationPatterns.email,
                    message: 'Please enter a valid email'
                  }
                })}
                className="form-input"
                placeholder="company@example.com"
              />
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                {...register('phone', {
                  pattern: {
                    value: ValidationPatterns.phone,
                    message: 'Please enter a valid phone number'
                  }
                })}
                className="form-input"
                placeholder="+1 (234) 567-8900"
              />
              {errors.phone && (
                <p className="error-message">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Fax</label>
              <input
                {...register('fax')}
                className="form-input"
                placeholder="Enter fax number"
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
              Address Information
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                {...register('address')}
                className="form-input"
                placeholder="Street address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                {...register('city')}
                className="form-input"
                placeholder="Enter city"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                {...register('state')}
                className="form-input"
                placeholder="Enter state"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                {...register('country')}
                className="form-input"
                placeholder="Enter country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
              <input
                {...register('zip', {
                  pattern: {
                    value: ValidationPatterns.zip,
                    message: 'Please enter a valid ZIP code'
                  }
                })}
                className="form-input"
                placeholder="Enter ZIP code"
              />
              {errors.zip && (
                <p className="error-message">{errors.zip.message}</p>
              )}
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
              Contact Information
            </h3>
          </div>

          {/* Manager Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Manager Name</label>
              <input
                {...register('manager1Name')}
                className="form-input"
                placeholder="Enter manager name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Manager Email</label>
              <input
                {...register('manager1Email', {
                  pattern: {
                    value: ValidationPatterns.email,
                    message: 'Please enter a valid email'
                  }
                })}
                className="form-input"
                placeholder="manager@example.com"
              />
              {errors.manager1Email && (
                <p className="error-message">{errors.manager1Email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Manager Phone</label>
              <input
                {...register('manager1Phone')}
                className="form-input"
                placeholder="Enter manager phone"
              />
            </div>
          </div>

          {/* HR Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">HR Name</label>
              <input
                {...register('hrName')}
                className="form-input"
                placeholder="Enter HR name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">HR Email</label>
              <input
                {...register('hrEmail', {
                  pattern: {
                    value: ValidationPatterns.email,
                    message: 'Please enter a valid email'
                  }
                })}
                className="form-input"
                placeholder="hr@example.com"
              />
              {errors.hrEmail && (
                <p className="error-message">{errors.hrEmail.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">HR Phone</label>
              <input
                {...register('hrPhone')}
                className="form-input"
                placeholder="Enter HR phone"
              />
            </div>
          </div>

          {/* Social Media Section */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
              Social Media
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
              <input
                {...register('linkedIn')}
                className="form-input"
                placeholder="LinkedIn profile URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Twitter</label>
              <input
                {...register('twitter')}
                className="form-input"
                placeholder="Twitter profile URL"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Facebook</label>
              <input
                {...register('facebook')}
                className="form-input"
                placeholder="Facebook profile URL"
              />
            </div>
          </div>

          {/* Notes Section */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
              Additional Information
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                {...register('notes')}
                className="form-textarea"
                rows={4}
                placeholder="Enter any additional notes..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-span-2 mt-6">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Client
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddRowModal;
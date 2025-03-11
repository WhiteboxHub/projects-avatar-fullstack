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
// interface EditRowModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   clientData: Recruiter; // Assuming Recruiter is the type of your client data
//   onSave: () => void; // Adjust based on how you handle saving
// }

// interface AddRowModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   refreshData: () => void;
// }

// const EditRowModal: React.FC<EditRowModalProps> = ({ isOpen, onClose, clientData, onSave }) => {
//   const [formData, setFormData] = useState<Recruiter>(clientData);

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
//       await axios.put(`/api/recruiter/${formData.id}`, formData); // Assuming you're using an ID to update
//       await onSave(); // Call the refresh function
//       onClose(); // Close the modal
//     } catch (error) {
//       console.error('Error updating recruiter:', error);
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onRequestClose={onClose} /* Add your styles here */>
//       {/* Modal content */}
//       <form onSubmit={handleSubmit}>
//         {/* Your input fields, similar to AddRowModal */}
//       </form>
//     </Modal>
//   );
// };

// export default EditRowModal;


import React from 'react';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Client, ClientUpdate, ClientStatus, ClientTier, ValidationPatterns } from '@/types/client';
import { toast } from 'react-hot-toast';
import { AiOutlineClose } from 'react-icons/ai';

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientData: Client;
  onSave: () => void;
}

const EditClientModal: React.FC<EditClientModalProps> = ({
  isOpen,
  onClose,
  clientData,
  onSave,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ClientUpdate>({
    defaultValues: clientData
  });

  const onSubmit = async (data: ClientUpdate) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/client/${clientData.id}`, data);
      toast.success('Client updated successfully');
      onSave();
      onClose();
    } catch (error) {
      toast.error('Error updating client');
      console.error('Error updating client:', error);
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
          <h2 className="text-2xl font-bold text-gray-800">Edit Client</h2>
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
              />
              {errors.url && (
                <p className="error-message">{errors.url.message}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
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
              />
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                {...register('phone')}
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Fax</label>
              <input
                {...register('fax')}
                className="form-input"
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                {...register('city')}
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                {...register('state')}
                className="form-input"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                {...register('country')}
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
              <input
                {...register('zip')}
                className="form-input"
              />
            </div>
          </div>

          {/* Contact Persons Section */}
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Twitter</label>
              <input
                {...register('twitter')}
                className="form-input"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Facebook</label>
              <input
                {...register('facebook')}
                className="form-input"
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
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-span-2 mt-6">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Update Client
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditClientModal;
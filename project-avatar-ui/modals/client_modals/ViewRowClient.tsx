// import React from 'react';
// import Modal from 'react-modal';
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

// interface ViewRowModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   data: Recruiter;
// }

// const ViewRowModal: React.FC<ViewRowModalProps> = ({ isOpen, onClose, data }) => {
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
//       <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">View Recruiter</h2>

//       <div className="space-y-4">
//         {/* Name */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
//           <p className="text-sm text-gray-700">{data.name}</p>
//         </div>

//         {/* Email */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
//           <p className="text-sm text-gray-700">{data.email}</p>
//         </div>

//         {/* Phone */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
//           <p className="text-sm text-gray-700">{data.phone}</p>
//         </div>

//         {/* Designation */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Designation</label>
//           <p className="text-sm text-gray-700">{data.designation}</p>
//         </div>

//         {/* Client ID */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Client ID</label>
//           <p className="text-sm text-gray-700">{data.clientid}</p>
//         </div>

//         {/* Company Name */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
//           <p className="text-sm text-gray-700">{data.comp}</p>
//         </div>

//         {/* Status */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
//           <p className="text-sm text-gray-700">{data.status}</p>
//         </div>

//         {/* Date of Birth */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
//           <p className="text-sm text-gray-700">{data.dob}</p>
//         </div>

//         {/* Personal Email */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Personal Email</label>
//           <p className="text-sm text-gray-700">{data.personalemail}</p>
//         </div>

//         {/* Skype ID */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Skype ID</label>
//           <p className="text-sm text-gray-700">{data.skypeid}</p>
//         </div>

//         {/* LinkedIn */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">LinkedIn</label>
//           <p className="text-sm text-gray-700">{data.linkedin}</p>
//         </div>

//         {/* Twitter */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Twitter</label>
//           <p className="text-sm text-gray-700">{data.twitter}</p>
//         </div>

//         {/* Facebook */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Facebook</label>
//           <p className="text-sm text-gray-700">{data.facebook}</p>
//         </div>

//         {/* Review */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Review</label>
//           <p className="text-sm text-gray-700">{data.review}</p>
//         </div>

//         {/* Notes */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
//           <p className="text-sm text-gray-700">{data.notes}</p>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default ViewRowModal;

import React from 'react';
import Modal from 'react-modal';
import { Client } from '@/types/client';
import { AiOutlineClose } from 'react-icons/ai';

interface ViewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientData: Client;
}

const ViewClientModal: React.FC<ViewClientModalProps> = ({
  isOpen,
  onClose,
  clientData,
}) => {
  const renderField = (label: string, value: string | undefined) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <p className="mt-1 text-sm text-gray-900">{value || 'N/A'}</p>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="relative w-full max-w-4xl p-6 bg-white rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Client Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            <AiOutlineClose />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Company Information */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
              Company Information
            </h3>
          </div>

          <div className="space-y-4">
            {renderField('Company Name', clientData.companyName)}
            {renderField('Status', clientData.status)}
            {renderField('Tier', clientData.tier)}
            {renderField('Website', clientData.url)}
          </div>

          <div className="space-y-4">
            {renderField('Email', clientData.email)}
            {renderField('Phone', clientData.phone)}
            {renderField('Fax', clientData.fax)}
          </div>

          {/* Address Information */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
              Address Information
            </h3>
          </div>

          <div className="space-y-4">
            {renderField('Address', clientData.address)}
            {renderField('City', clientData.city)}
            {renderField('State', clientData.state)}
          </div>

          <div className="space-y-4">
            {renderField('Country', clientData.country)}
            {renderField('ZIP Code', clientData.zip)}
          </div>

          {/* Contact Information */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
              Contact Information
            </h3>
          </div>

          <div className="space-y-4">
            {renderField('Manager Name', clientData.manager1Name)}
            {renderField('Manager Email', clientData.manager1Email)}
            {renderField('Manager Phone', clientData.manager1Phone)}
          </div>

          <div className="space-y-4">
            {renderField('HR Name', clientData.hrName)}
            {renderField('HR Email', clientData.hrEmail)}
            {renderField('HR Phone', clientData.hrPhone)}
          </div>

          {/* Social Media */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
              Social Media
            </h3>
          </div>

          <div className="space-y-4">
            {renderField('LinkedIn', clientData.linkedIn)}
            {renderField('Twitter', clientData.twitter)}
            {renderField('Facebook', clientData.facebook)}
          </div>

          {/* Notes */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
              Additional Information
            </h3>
            {renderField('Notes', clientData.notes)}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewClientModal;
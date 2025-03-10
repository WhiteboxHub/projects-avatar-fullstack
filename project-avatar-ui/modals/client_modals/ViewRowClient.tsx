import React from 'react';
import Modal from 'react-modal';
import { AiOutlineClose } from 'react-icons/ai';

interface Recruiter {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  designation?: string;
  clientid?: string;
  comp?: string;
  status?: string;
  dob?: string;
  personalemail?: string;
  skypeid?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  review?: string;
  notes?: string;
}

interface ViewRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Recruiter;
}

const ViewRowModal: React.FC<ViewRowModalProps> = ({ isOpen, onClose, data }) => {
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">View Recruiter</h2>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
          <p className="text-sm text-gray-700">{data.name}</p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
          <p className="text-sm text-gray-700">{data.email}</p>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
          <p className="text-sm text-gray-700">{data.phone}</p>
        </div>

        {/* Designation */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Designation</label>
          <p className="text-sm text-gray-700">{data.designation}</p>
        </div>

        {/* Client ID */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Client ID</label>
          <p className="text-sm text-gray-700">{data.clientid}</p>
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
          <p className="text-sm text-gray-700">{data.comp}</p>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
          <p className="text-sm text-gray-700">{data.status}</p>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
          <p className="text-sm text-gray-700">{data.dob}</p>
        </div>

        {/* Personal Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Personal Email</label>
          <p className="text-sm text-gray-700">{data.personalemail}</p>
        </div>

        {/* Skype ID */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Skype ID</label>
          <p className="text-sm text-gray-700">{data.skypeid}</p>
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">LinkedIn</label>
          <p className="text-sm text-gray-700">{data.linkedin}</p>
        </div>

        {/* Twitter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Twitter</label>
          <p className="text-sm text-gray-700">{data.twitter}</p>
        </div>

        {/* Facebook */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Facebook</label>
          <p className="text-sm text-gray-700">{data.facebook}</p>
        </div>

        {/* Review */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Review</label>
          <p className="text-sm text-gray-700">{data.review}</p>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
          <p className="text-sm text-gray-700">{data.notes}</p>
        </div>
      </div>
    </Modal>
  );
};

export default ViewRowModal;

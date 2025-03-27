import React from 'react';
import Modal from 'react-modal';
import { RecruiterDetails } from '@/types/byDetailed'; 
import { AiOutlineClose } from 'react-icons/ai';

interface ViewRowRecruiterProps {
  isOpen: boolean;
  onClose: () => void;
  recruiter: RecruiterDetails | null; 
}

const ViewRowRecruiterComponent: React.FC<ViewRowRecruiterProps> = ({ isOpen, onClose, recruiter }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        content: {
          top: '50%',
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
      contentLabel="View Recruiter Details"
      ariaHideApp={false}
    >
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
        >
          <AiOutlineClose />
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">Recruiter Details</h2>

      <div className="space-y-4">
        {recruiter ? (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {recruiter.name || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {recruiter.email || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {recruiter.phone || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {recruiter.status || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Designation</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {recruiter.designation || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {recruiter.dob || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Personal Email</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {recruiter.personalemail || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Skype ID</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {recruiter.skypeid || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">LinkedIn</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {recruiter.linkedin || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Twitter</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {recruiter.twitter || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Facebook</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {recruiter.facebook || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Review</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {recruiter.review || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Vendor ID</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {recruiter.vendorid || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Client ID</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {recruiter.clientid || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {recruiter.notes || 'N/A'}
              </div>
            </div>
          </>
        ) : (
          <p>No data available</p>
        )}
      </div>
    </Modal>
  );
};

export default ViewRowRecruiterComponent;

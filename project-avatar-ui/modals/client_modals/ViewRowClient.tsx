import React from 'react';
import Modal from 'react-modal';
import { Client } from '@/types/client';
import { AiOutlineClose } from 'react-icons/ai';

interface ViewRowClientProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

const ViewRowClient: React.FC<ViewRowClientProps> = ({ isOpen, onClose, client }) => {
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
      contentLabel="View Row Modal"
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

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Client Details</h2>

      <div className="modal-body">
        {client ? (
          <div>
            <div className="modal-field">
              <label htmlFor="Company Name">Company Name</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {client.companyname}
              </div>
            </div>

            {/* <div className="modal-field">
              <label htmlFor="Tier">Tier</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {client.tier}
              </div>
            </div> */}

            <div className="modal-field">
              <label htmlFor="Status">Status</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {client.status}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Email">Email</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {client.email}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Phone">Phone</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {client.phone}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Fax">Fax</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {client.fax}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Address">Address</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {client.address}, {client.city}, {client.state}, {client.zip}, {client.country}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Twitter">Twitter</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {client.twitter}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Facebook">Facebook</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {client.facebook}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="LinkedIn">LinkedIn</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {client.linkedIn}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Manager 1 Name">Manager 1 Name</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {client.manager1Name}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Manager 1 Email">Manager 1 Email</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {client.manager1Email}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Manager 1 Phone">Manager 1 Phone</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {client.manager1Phone}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="HM Name">HM Name</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {client.hmName}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="HM Email">HM Email</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {client.hmEmail}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="HM Phone">HM Phone</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {client.hmPhone}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="HR Name">HR Name</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {client.hrName}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="HR Email">HR Email</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {client.hrEmail}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="HR Phone">HR Phone</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {client.hrPhone}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Notes">Notes</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {client.notes}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Last Modified Date Time">Last Modified Date Time</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {client.lastModDateTime}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Created At">Created At</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {client.createdAt}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Updated At">Updated At</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {client.updatedAt}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Is Active">Is Active</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {client.isActive ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        ) : (
          <p>No data available</p>
        )}
      </div>
    </Modal>
  );
};

export default ViewRowClient;


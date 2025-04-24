// import React from 'react';
// import Modal from 'react-modal';
// import { Placement } from '../../types/index'; // Adjust the import path accordingly
// import { AiOutlineClose } from 'react-icons/ai'; // Adjust the import path accordingly

// interface ViewRowModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   rowData: Placement | null;
// }

// const ViewRowPlacement: React.FC<ViewRowModalProps> = ({ isOpen, onClose, rowData }) => {
//   return (
//     <Modal
//       isOpen={isOpen}
//       style={{
//         content: {
//           top: '15%',
//           left: '50%',
//           right: 'auto',
//           bottom: 'auto',
//           transform: 'translate(-50%, 0)',
//           overflowY: 'auto',
//           maxHeight: '80vh',
//           width: '40%',
//           padding: '20px',
//           borderRadius: '10px',
//           boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
//         },
//         overlay: {
//           backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         },
//       }}
//       contentLabel="View Placement Modal"
//       ariaHideApp={false} // Disable aria app for accessibility if needed
//     >
//       <div className="">
//         <div className="relative">
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-0 text-gray-500 hover:text-gray-800 transition duration-200"
//           >
//             <AiOutlineClose size={24} />
//           </button>
//         </div>
//         <h2 className="text-2xl font-semibold text-gray-800 mb-4">Placement Details</h2>
//       </div>
//       <div className="modal-body">
//         {rowData ? (
//           <div>
//             {Object.keys(rowData).map(key => (
//               <div key={key} className="modal-field">
//                 <label htmlFor={key}>
//                   {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
//                 </label>
//                 <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
//                   {rowData[key as keyof Placement]} {/* Correct type access */}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p>No data available</p>
//         )}
//       </div>
//       <div className="modal-actions">
//         <button
//           type="button"
//           onClick={onClose}
//           className="mt-2 w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition duration-200"
//         >
//           Cancel
//         </button>
//       </div>
//     </Modal>
//   );
// };

// export default ViewRowPlacement;

import React from 'react';
import Modal from 'react-modal';
import { AiOutlineClose } from 'react-icons/ai';

interface Vendor {
  id?: number;
  companyname?: string;
  status?: string;
  accountnumber?: string;
  tier?: number;
  email?: string;
  phone?: string;
  fax?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  url?: string;
  solicited?: string;
  hirebeforeterm?: string;
  hireafterterm?: string;
  minrate?: number;
  latepayments?: string;
  totalnetterm?: number;
  defaultedpayment?: string;
  culture?: string;
  hrname?: string;
  hremail?: string;
  hrphone?: string;
  managername?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  manageremail?: string;
  managerphone?: string;
  secondaryname?: string;
  secondaryemail?: string;
  secondaryphone?: string;
  timsheetemail?: string;
  agreementstatus?: string;
  agreementname?: string;
  agreementlink?: string;
  subcontractorlink?: string;
  nonsolicitationlink?: string;
  nonhirelink?: string;
  clients?: string;
  notes?: string;
  crawldate?: string;
  lastmoddatetime?: string;
}

interface ViewRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowData: Vendor | null;
}

const ViewRowModal: React.FC<ViewRowModalProps> = ({ isOpen, onClose, rowData }) => {
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
      contentLabel="View Vendor Details"
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

      <h2 className="text-2xl font-bold mb-6 text-gray-800">Vendor Details</h2>

      <div className="space-y-4">
        {rowData ? (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">ID</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.id || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.companyname || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.status || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Account Number</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.accountnumber || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tier</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.tier || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.email || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.phone || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Fax</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.fax || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.address || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.city || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.state || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.country || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Zip</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.zip || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">URL</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.url || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Solicited</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.solicited || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Hire Before Term</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.hirebeforeterm || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Hire After Term</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.hireafterterm || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Min Rate</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.minrate || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Late Payments</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.latepayments || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Total Net Term</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.totalnetterm || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Defaulted Payment</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.defaultedpayment || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Culture</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.culture || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">HR Name</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.hrname || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">HR Email</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.hremail || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">HR Phone</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.hrphone || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Manager Name</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.managername || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Twitter</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.twitter || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Facebook</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.facebook || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">LinkedIn</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.linkedin || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Manager Email</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.manageremail || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Manager Phone</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.managerphone || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Secondary Name</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.secondaryname || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Secondary Email</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.secondaryemail || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Secondary Phone</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.secondaryphone || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Time Sheet Email</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.timsheetemail || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Agreement Status</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.agreementstatus || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Agreement Name</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.agreementname || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Agreement Link</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.agreementlink || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Subcontractor Link</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.subcontractorlink || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nonsolicitation Link</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.nonsolicitationlink || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Non Hire Link</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.nonhirelink || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Clients</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.clients || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.notes || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Crawl Date</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.crawldate || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Last Modified Date</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                {rowData.lastmoddatetime || 'N/A'}
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

export default ViewRowModal;
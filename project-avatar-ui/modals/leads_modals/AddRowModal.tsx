import Modal from "react-modal";
import React, { useState } from "react";
import axios from "axios";
import { Lead } from "@/types/index";

interface FormData {
  name: string;
  startdate: string;
  phone: string;
  email: string;
  priority: string;
  workstatus: string;
  source: string;
  workexperience: string;
  sourcename: string;
  course: string;
  intent: string;
  attendedclass: string;
  siteaccess: string;
  assignedto: string;
  status: string;
  secondaryemail: string;
  secondaryphone: string;
  address: string;
  spousename: string;
  spouseemail: string;
  spousephone: string;
  spouseoccupationinfo: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  faq: string;
  callsmade?: number;
  closedate: string;
  notes: string;
}

interface AddRowModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSave: () => void;
}

const AddRowModal: React.FC<AddRowModalProps> = ({ isOpen, onRequestClose, onSave }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    startdate: '',
    phone: '',
    email: '',
    priority: '',
    workstatus: '',
    source: '',
    workexperience: '',
    sourcename: '',
    course: '',
    intent: '',
    attendedclass: '',
    siteaccess: '',
    assignedto: '',
    status: '',
    secondaryemail: '',
    secondaryphone: '',
    address: '',
    spousename: '',
    spouseemail: '',
    spousephone: '',
    spouseoccupationinfo: '',
    city: '',
    state: '',
    country: '',
    zip: '',
    faq: '',
    callsmade: 0,
    closedate: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/leads/insert`, formData, {
        headers: { AuthToken: localStorage.getItem('token') },
      });
      onSave();
      onRequestClose();
    } catch (error) {
      console.error('Error adding row:', error);
    }
  };
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onRequestClose}
//       // className="modal-content"
//       // overlayClassName="modal-overlay"
//       style={{
//         content: {
//           top: '15%',
//         left: '50%',
//         right: 'auto',
//         bottom: 'auto',
//         transform: 'translate(-50%, 0)',
//         overflowY: 'auto',
//         maxHeight: '80vh',
//         width: '40%',
//         },
//       }}

//     >
//       <div className="modal-header">
//         <h2 className="text-xl font-bold mb-4" >Add New Lead</h2>
//         {/* <button className="modal-close-button" onClick={onRequestClose}>&times;</button> */}
//       </div>
//       <form onSubmit={handleSubmit} className="modal-body">
//         {Object.keys(formData).map((key) => (
//           <div key={key} className="modal-field">
//             <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</label>
//             <input
//               type="text"
//               id={key}
//               name={key}
//               value={formData[key as keyof FormData]}
//               onChange={handleChange}
//               className="border rounded-md p-2 "
//             />
//           </div>
//         ))}
//       <div className="modal-actions flex justify-between">
//   <button type="button" className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-500" onClick={onRequestClose}>Cancel</button>
//   <button type="submit" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-500">Add Lead</button>
// </div>
//       </form>
//     </Modal>

// return (
// <Modal
//   isOpen={isOpen}
//   onRequestClose={onRequestClose}
//   style={{
//     content: {
//       top: '15%',
//       left: '50%',
//       right: 'auto',
//       bottom: 'auto',
//       transform: 'translate(-50%, 0)',
//       overflowY: 'auto',
//       maxHeight: '80vh',
//       width: '40%',
//       padding: '20px',
//       borderRadius: '10px',
//       boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
//     },
//     overlay: {
//       backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     },
//   }}
// >
//   <div className="modal-header flex justify-between items-center mb-4">
//     <h2 className="text-xl font-bold">Add New Lead</h2>
//     <button className="text-2xl font-semibold hover:text-red-500 transition" onClick={onRequestClose}>
//       &times;
//     </button>
//   </div>

//   <form onSubmit={handleSubmit} className="modal-body space-y-4">
//     {Object.keys(formData).map((key) => (
//       <div key={key} className="modal-field">
//         <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
//           {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
//         </label>
//         <input
//           type="text"
//           id={key}
//           name={key}
//           value={formData[key as keyof FormData]}
//           onChange={handleChange}
//           className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//         />
//       </div>
//     ))}

   
   
//     <button
//     type="submit"
//     className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 mb-4"  // Added mb-4
//   >
//     Add Lead
//   </button>
  
//   <button
//     type="button"
//     onClick={onRequestClose}
//     className="mt-2 w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition duration-200 mb-4"
//   >
//     Cancel
//   </button>

//   </form>
// </Modal>

//   );
return (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
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
        onClick={onRequestClose}
        className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
      >
        &times;
      </button>
    </div>
    <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Add New Lead</h2>

    <form onSubmit={handleSubmit} className="space-y-4">
      {Object.keys(formData).map((key) => (
        <div key={key} className="modal-field">
          <label htmlFor={key} className="block text-sm font-semibold text-gray-700 mb-1">
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
          </label>
          <input
            type="text"
            id={key}
            name={key}
            value={formData[key as keyof FormData]}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>
      ))}
      
      <button
        type="submit"
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
      >
        Add Lead
      </button>
    </form>
  </Modal>
);
};

export default AddRowModal;
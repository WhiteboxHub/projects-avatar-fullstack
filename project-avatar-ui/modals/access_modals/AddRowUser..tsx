// import React, { useState } from 'react';
// import Modal from 'react-modal';
// import axios from 'axios';
// import { User } from '../types/index'; // Adjust the import path accordingly

// interface FormData {
//   uname: string;
//   passwd: string;
//   dailypwd: string;
//   team: string;
//   level: string;
//   instructor: string;
//   override: string;
//   status: string;
//   lastlogin: string;
//   logincount: number;
//   fullname: string;
//   address: string;
//   phone: string;
//   state: string;
//   zip: string;
//   city: string;
//   country: string;
//   message: string;
//   registereddate: string;
//   level3date: string;
//   demo: string;
//   enddate: string;
//   googleId: string;
//   reset_token: string;
//   token_expiry: string;
// }

// interface AddRowModalProps {
//   isOpen: boolean;
//   onRequestClose: () => void;
//   onSave: () => void;
// }

// const UserRowModal: React.FC<AddRowModalProps> = ({ isOpen, onRequestClose, onSave }) => {
//   const [formData, setFormData] = useState<FormData>({
//     uname: '',
//     passwd: '',
//     dailypwd: '',
//     team: '',
//     level: '',
//     instructor: '',
//     override: '',
//     status: '',
//     lastlogin: '',
//     logincount: 0,
//     fullname: '',
//     address: '',
//     phone: '',
//     state: '',
//     zip: '',
//     city: '',
//     country: '',
//     message: '',
//     registereddate: '',
//     level3date: '',
//     demo: '',
//     enddate: '',
//     googleId: '',
//     reset_token: '',
//     token_expiry: '',
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/insert`, formData, {
//         headers: { AuthToken: localStorage.getItem('token') },
//       });
//       onSave();
//       onRequestClose();
//     } catch (error) {
//       console.error('Error adding row:', error);
//     }
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onRequestClose}
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
//     >
//       <div className="modal-header flex justify-between items-center mb-4">
//         <h2 className="text-xl font-bold">Add New User</h2>
//         <button className="text-2xl font-semibold hover:text-red-500 transition" onClick={onRequestClose}>
//           &times;
//         </button>
//       </div>

//       <form onSubmit={handleSubmit} className="modal-body space-y-4">
//         {Object.keys(formData).map((key) => (
//           <div key={key} className="modal-field">
//             <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
//               {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
//             </label>
//             <input
//               type="text"
//               id={key}
//               name={key}
//               value={formData[key as keyof FormData]}
//               onChange={handleChange}
//               className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             />
//           </div>
//         ))}

//         <div className="modal-actions flex justify-between mt-4">
//           <button
//             type="button"
//             className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md transition duration-300 hover:bg-red-500"
//             onClick={onRequestClose}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-500"
//           >
//             Add User
//           </button>
//         </div>
//       </form>
//     </Modal>
//   );
// };

// export default UserRowModal;

// import React, { useState, useEffect } from 'react';
// import Modal from 'react-modal';
// import axios from 'axios';
// import { AiOutlineClose } from 'react-icons/ai';

// interface Overdue {
//   status?: string;
//   reminderType?: string;
//   received?: number;
//   receivedDate?: string;
//   checkNo?: string;
//   notes?: string;
// }

// interface EditRowOverdueProps {
//   isOpen: boolean;
//   onRequestClose: () => void;
//   rowData: Overdue | null;
//   onSave: () => void;
// }

// const EditRowOverdue: React.FC<EditRowOverdueProps> = ({ isOpen, onRequestClose, rowData, onSave }) => {
//   const [formData, setFormData] = useState<Overdue>({
//     status: 'Open',
//     reminderType: 'Open',
//     received: 0.00,
//     receivedDate: '',
//     checkNo: '',
//     notes: '',
//   });

//   useEffect(() => {
//     if (rowData) {
//       setFormData(rowData);
//     }
//   }, [rowData]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (formData) {
//       try {
//         const API_URL = process.env.NEXT_PUBLIC_API_URL; 
//         await axios.put(`${API_URL}/overdue/${formData.overdue.id}`, formData, {
//           headers: { AuthToken: localStorage.getItem('token') },
//         });
//         onSave(); // Call the onSave callback to refresh data or handle post-update actions
//         onRequestClose(); 
//       } catch (error) {
//         console.error('Error updating overdue:', error);
//       }
//     }
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onRequestClose}
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
//       contentLabel="Edit Overdue Modal"
//     >
//       <div className="relative">
//         <button
//           onClick={onRequestClose}
//           className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
//         >
//           &times;
//         </button>
//       </div>
//       <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Edit Overdue Details</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Status */}
//         <div className="modal-field">
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
//           <select
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             <option value="Open">Open</option>
//             <option value="Close">Close</option>
//             <option value="Void">Void</option>
//             <option value="Delete">Delete</option>
//           </select>
//         </div>
//         {/* Reminder Type */}
//         <div className="modal-field">
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Reminder Type</label>
//           <select
//             name="reminderType"
//             value={formData.reminderType}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             <option value="Open">Open</option>
//             <option value="Warning">Warning</option>
//             <option value="Warn-Candidate">Warn-Candidate</option>
//             <option value="Warn-Client">Warn-Client</option>
//             <option value="Warn-Collection Agency">Warn-Collection Agency</option>
//             <option value="Final-Warning">Final-Warning</option>
//           </select>
//         </div>
//         {/* Received */}
//         <div className="modal-field">
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Received</label>
//           <input
//             type="number"
//             name="received"
//             value={formData.received}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter received amount"
//           />
//         </div>
//         {/* Received Date */}
//         <div className="modal-field">
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Received Date</label>
//           <input
//             type="date"
//             name="receivedDate"
//             value={formData.receivedDate}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>
//         {/* Check No */}
//         <div className="modal-field">
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Check No</label>
//           <input
//             type="text"
//             name="checkNo"
//             value={formData.checkNo}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter check number"
//           />
//         </div>
//         {/* Notes */}
//         <div className="modal-field">
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
//           <input
//             type="text"
//             name="notes"
//             value={formData.notes}
//             onChange={handleChange}
//             className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter notes"
//           />
//         </div>

//         <button
//           type="submit"
//           className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
//         >
//           Save Overdue
//         </button>
//       </form>
//     </Modal>
//   );
// };

// export default EditRowOverdue;



// import React, { useState, useEffect } from 'react';
// import Modal from 'react-modal';
// import axios from 'axios';
// import { AiOutlineClose } from 'react-icons/ai';

// interface Overdue {
//   status?: string;
//   reminderType?: string;
//   received?: number;
//   receivedDate?: string;
//   checkNo?: string;
//   notes?: string;
//   overdueid?: string; // Ensure overdueid is part of the interface
// }

// interface EditRowOverdueProps {
//   isOpen: boolean;
//   onRequestClose: () => void;
//   rowData: Overdue | null;
//   onSave: () => void;
// }

// const EditRowOverdue: React.FC<EditRowOverdueProps> = ({ isOpen, onRequestClose, rowData, onSave }) => {
//   const [formData, setFormData] = useState<Overdue>({
//     status: 'Open',
//     reminderType: 'Open',
//     received: 0.00,
//     receivedDate: '',
//     checkNo: '',
//     notes: '',
//     overdueid: '', // Initialize overdueid
//   });

//   useEffect(() => {
//     if (rowData) {
//       setFormData({
//         ...rowData,
//         overdueid: rowData.overdueid || '', // Ensure overdueid is set from rowData
//       });
//     }
//   }, [rowData]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (formData && formData.overdueid) {
//       try {
//         const API_URL = process.env.NEXT_PUBLIC_API_URL;
//         console.log('Form Data:', formData); // Log formData to check its values

//         await axios.put(`${API_URL}/overdue/${formData.overdueid}`, formData, {
//           headers: { AuthToken: localStorage.getItem('token') },
//         });
//         onSave(); // Call the onSave callback to refresh data or handle post-update actions
//         onRequestClose();
//       } catch (error) {
//         console.error('Error updating overdue:', error);
//       }
//     } else {
//       console.error('overdueid is missing in formData');
//     }
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onRequestClose}
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
//       contentLabel="Edit Overdue Modal"
//     >
//       <div className="relative">
//         <button
//           onClick={onRequestClose}
//           className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
//         >
//           &times;
//         </button>
//       </div>
//       <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Edit Overdue Details</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Status */}
//         <div className="modal-field">
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
//           <select
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             <option value="Open">Open</option>
//             <option value="Close">Close</option>
//             <option value="Void">Void</option>
//             <option value="Delete">Delete</option>
//           </select>
//         </div>
//         {/* Reminder Type */}
//         <div className="modal-field">
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Reminder Type</label>
//           <select
//             name="reminderType"
//             value={formData.reminderType}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             <option value="Open">Open</option>
//             <option value="Warning">Warning</option>
//             <option value="Warn-Candidate">Warn-Candidate</option>
//             <option value="Warn-Client">Warn-Client</option>
//             <option value="Warn-Collection Agency">Warn-Collection Agency</option>
//             <option value="Final-Warning">Final-Warning</option>
//           </select>
//         </div>
//         {/* Received */}
//         <div className="modal-field">
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Received</label>
//           <input
//             type="number"
//             name="received"
//             value={formData.received}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter received amount"
//           />
//         </div>
//         {/* Received Date */}
//         <div className="modal-field">
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Received Date</label>
//           <input
//             type="date"
//             name="receivedDate"
//             value={formData.receivedDate}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>
//         {/* Check No */}
//         <div className="modal-field">
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Check No</label>
//           <input
//             type="text"
//             name="checkNo"
//             value={formData.checkNo}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter check number"
//           />
//         </div>
//         {/* Notes */}
//         <div className="modal-field">
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
//           <input
//             type="text"
//             name="notes"
//             value={formData.notes}
//             onChange={handleChange}
//             className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter notes"
//           />
//         </div>

//         <button
//           type="submit"
//           className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
//         >
//           Save Overdue
//         </button>
//       </form>
//     </Modal>
//   );
// };

// export default EditRowOverdue;



// import React, { useState, useEffect } from 'react';
// import Modal from 'react-modal';
// import axios from 'axios';
// import { AiOutlineClose } from 'react-icons/ai';

// interface Overdue {
//   pkid?: number; // Use pkid as the identifier
//   status?: string;
//   remindertype?: string; // Ensure this matches the backend schema
//   amountreceived?: number; // Ensure this matches the backend schema
//   receiveddate?: string; // Ensure this matches the backend schema
//   checknumber?: string; // Ensure this matches the backend schema
//   notes?: string;
// }

// interface EditRowOverdueProps {
//   isOpen: boolean;
//   onRequestClose: () => void;
//   rowData: Overdue | null;
//   onSave: () => void;
// }

// const EditRowOverdue: React.FC<EditRowOverdueProps> = ({ isOpen, onRequestClose, rowData, onSave }) => {
//   const [formData, setFormData] = useState<Overdue>({
//     pkid: rowData?.pkid, // Initialize pkid from rowData
//     status: 'Open',
//     remindertype: 'Open', // Initialize with a default value
//     amountreceived: 0.00, // Initialize with a default value
//     receiveddate: '', // Initialize with a default value
//     checknumber: '', // Initialize with a default value
//     notes: '',
//   });

//   useEffect(() => {
//     if (rowData) {
//       setFormData(rowData);
//     }
//   }, [rowData]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (formData && formData.pkid) { // Ensure pkid is defined
//       try {
//         const API_URL = process.env.NEXT_PUBLIC_API_URL;
//         const payload = {
//           status: formData.status,
//           remindertype: formData.remindertype,
//           amountreceived: formData.amountreceived,
//           receiveddate: formData.receiveddate,
//           checknumber: formData.checknumber,
//           notes: formData.notes,
//         };

//         await axios.put(`${API_URL}/overdue/${formData.pkid}`, payload, {
//           headers: { AuthToken: localStorage.getItem('token') },
//         });
//         onSave(); // Call the onSave callback to refresh data or handle post-update actions
//         onRequestClose();
//       } catch (error) {
//         console.error('Error updating overdue:', error);
//       }
//     }
//   };


// import React, { useState, useEffect } from 'react';
// import Modal from 'react-modal';
// import axios from 'axios';
// import { AiOutlineClose } from 'react-icons/ai';

// interface Overdue {
//   pkid?: number; // Use pkid as the identifier
//   status?: string;
//   remindertype?: string;
//   amountreceived?: number;
//   receiveddate?: string;
//   checknumber?: string;
//   notes?: string;
//   invoicedate?: string; // Add missing field
//   quantity?: number; // Add missing field
//   releaseddate?: string; // Add missing field
// }

// interface EditRowOverdueProps {
//   isOpen: boolean;
//   onRequestClose: () => void;
//   rowData: Overdue | null;
//   onSave: () => void;
// }

// const EditRowOverdue: React.FC<EditRowOverdueProps> = ({ isOpen, onRequestClose, rowData, onSave }) => {
//   const [formData, setFormData] = useState<Overdue>({
//     pkid: rowData?.pkid, // Initialize pkid from rowData
//     status: 'Open',
//     remindertype: 'Open',
//     amountreceived: 0.00,
//     receiveddate: '',
//     checknumber: '',
//     notes: '',
//     invoicedate: '', // Initialize with a default value
//     quantity: 0, // Initialize with a default value
//     releaseddate: '', // Initialize with a default value
//   });

//   useEffect(() => {
//     if (rowData) {
//       setFormData(rowData);
//     }
//   }, [rowData]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (formData && formData.pkid) { // Ensure pkid is defined
//       try {
//         const API_URL = process.env.NEXT_PUBLIC_API_URL;
//         const payload = {
//           status: formData.status,
//           remindertype: formData.remindertype,
//           amountreceived: formData.amountreceived,
//           receiveddate: formData.receiveddate,
//           checknumber: formData.checknumber,
//           notes: formData.notes,
//           invoicedate: formData.invoicedate, // Include missing field
//           quantity: formData.quantity, // Include missing field
//           releaseddate: formData.releaseddate, // Include missing field
//         };

//         await axios.put(`${API_URL}/overdue/${formData.pkid}`, payload, {
//           headers: { AuthToken: localStorage.getItem('token') },
//         });
//         onSave(); // Call the onSave callback to refresh data or handle post-update actions
//         onRequestClose();
//       } catch (error) {
//         console.error('Error updating overdue:', error);
//       }
//     }
//   };
//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onRequestClose}
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
//       contentLabel="Edit Overdue Modal"
//     >
//       <div className="relative">
//         <button
//           onClick={onRequestClose}
//           className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
//         >
//           &times;
//         </button>
//       </div>
//       <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Edit Overdue Details</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Status */}
//         <div className="modal-field">
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
//           <select
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             <option value="Open">Open</option>
//             <option value="Close">Close</option>
//             <option value="Void">Void</option>
//             <option value="Delete">Delete</option>
//           </select>
//         </div>
//         {/* Reminder Type */}
//         <div className="modal-field">
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Reminder Type</label>
//           <select
//             name="remindertype"
//             value={formData.remindertype}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             <option value="Open">Open</option>
//             <option value="Warning">Warning</option>
//             <option value="Warn-Candidate">Warn-Candidate</option>
//             <option value="Warn-Client">Warn-Client</option>
//             <option value="Warn-Collection Agency">Warn-Collection Agency</option>
//             <option value="Final-Warning">Final-Warning</option>
//           </select>
//         </div>
//         {/* Received */}
//         <div className="modal-field">
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Received</label>
//           <input
//             type="number"
//             name="amountreceived"
//             value={formData.amountreceived}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter received amount"
//           />
//         </div>
//         {/* Received Date */}
//         <div className="modal-field">
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Received Date</label>
//           <input
//             type="date"
//             name="receiveddate"
//             value={formData.receiveddate}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>
//         {/* Check No */}
//         <div className="modal-field">
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Check No</label>
//           <input
//             type="text"
//             name="checknumber"
//             value={formData.checknumber}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter check number"
//           />
//         </div>
//         {/* Notes */}
//         <div className="modal-field">
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
//           <input
//             type="text"
//             name="notes"
//             value={formData.notes}
//             onChange={handleChange}
//             className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter notes"
//           />
//         </div>

//         <button
//           type="submit"
//           className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
//         >
//           Save Overdue
//         </button>
//       </form>
//     </Modal>
//   );
// };

// export default EditRowOverdue;



import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { AiOutlineClose } from 'react-icons/ai';

interface Overdue {
  pkid?: number; // Use pkid as the identifier
  status?: string;
  remindertype?: string;
  amountreceived?: number;
  receiveddate?: string;
  checknumber?: string;
  notes?: string;
  invoicedate?: string;
  quantity?: number;
  releaseddate?: string;  // Added released date field
}

interface EditRowOverdueProps {
  isOpen: boolean;
  onRequestClose: () => void;
  rowData: Overdue | null;
  onSave: () => void;
}

const EditRowOverdue: React.FC<EditRowOverdueProps> = ({ isOpen, onRequestClose, rowData, onSave }) => {
  const [formData, setFormData] = useState<Overdue>({
    pkid: rowData?.pkid, 
    status: 'Open',
    remindertype: 'Open',
    amountreceived: 0.00,
    receiveddate: '',
    checknumber: '',
    notes: '',
    invoicedate: '', 
    quantity: 0, 
    releaseddate: '',  // Added released date field initialization
  });

  useEffect(() => {
    if (rowData) {
      setFormData({
        ...rowData,
        releaseddate: rowData.releaseddate || '', // Ensure releaseddate is set correctly
      });      
    }
  }, [rowData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData && formData.pkid) { 
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const payload = {
          status: formData.status,
          remindertype: formData.remindertype,
          amountreceived: formData.amountreceived,
          receiveddate: formData.receiveddate,
          checknumber: formData.checknumber,
          notes: formData.notes,
          invoicedate: formData.invoicedate,
          quantity: formData.quantity,
          releaseddate: formData.releaseddate,  // Include releaseddate in the payload
        };

        await axios.put(`${API_URL}/overdue/put/${formData.pkid}`, payload, {
          headers: { AuthToken: localStorage.getItem('token') },
        });
        onSave(); 
        onRequestClose();
      } catch (error) {
        console.error('Error updating overdue:', error);
      }
    }
  };

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
      contentLabel="Edit Overdue Modal"
    >
      <div className="relative">
        <button
          onClick={onRequestClose}
          className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
        >
          &times;
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Edit Overdue Details</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Status */}
        <div className="modal-field">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="Open">Open</option>
            <option value="Close">Close</option>
            <option value="Void">Void</option>
            <option value="Delete">Delete</option>
          </select>
        </div>

        {/* Reminder Type */}
        <div className="modal-field">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Reminder Type</label>
          <select
            name="remindertype"
            value={formData.remindertype}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="Open">Open</option>
            <option value="Warning">Warning</option>
            <option value="Warn-Candidate">Warn-Candidate</option>
            <option value="Warn-Client">Warn-Client</option>
            <option value="Warn-Collection Agency">Warn-Collection Agency</option>
            <option value="Final-Warning">Final-Warning</option>
          </select>
        </div>

        {/* Received */}
        <div className="modal-field">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Received</label>
          <input
            type="number"
            name="amountreceived"
            value={formData.amountreceived}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter received amount"
          />
        </div>

        {/* Received Date */}
        <div className="modal-field">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Received Date</label>
          <input
            type="date"
            name="receiveddate"
            value={formData.receiveddate}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        {/* Released Date */}
        <div className="modal-field">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Released Date</label>
          <input
            type="date"
            name="releaseddate"
            value={formData.releaseddate}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        {/* Check No */}
        <div className="modal-field">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Check No</label>
          <input
            type="text"
            name="checknumber"
            value={formData.checknumber}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter check number"
          />
        </div>

        {/* Notes */}
        <div className="modal-field">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
          <input
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter notes"
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
        >
          Save Overdue
        </button>
      </form>
    </Modal>
  );
};

export default EditRowOverdue;
// // // import React, { useState, useEffect } from 'react';
// // // import Modal from 'react-modal';
// // // import { AiOutlineClose } from 'react-icons/ai';
// // // import { Recruiter } from '@/types/byClient';
// // // import axios from 'axios';

// // // interface EditRowRecruiterProps {
// // //   isOpen: boolean;
// // //   onClose: () => void;
// // //   initialData: Recruiter | null; // Allow initialData to be null
// // //   onSubmit: (formData: Recruiter) => Promise<void>; // Update onSubmit to accept formData
// // // }

// // // const EditRowRecruiter: React.FC<EditRowRecruiterProps> = ({ isOpen, onClose, initialData, onSubmit }) => {
// // //   const [formData, setFormData] = useState<Recruiter | null>(initialData); // Allow formData to be null

// // //   useEffect(() => {
// // //     if (initialData) {
// // //       setFormData(initialData);
// // //     }
// // //   }, [initialData]);

// // //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
// // //     const { name, value } = e.target;
// // //     setFormData((prevData) => {
// // //       if (prevData) {
// // //         return {
// // //           ...prevData,
// // //           [name]: value,
// // //         };
// // //       }
// // //       return null; // Return null if prevData is null
// // //     });
// // //   };

// // //   const handleSubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     if (formData) {
// // //       try {
// // //         await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/recruiters/byClient/update/${formData.id}`, formData);
// // //         onClose();
// // //       } catch (error) {
// // //         console.error("Error updating recruiter:", error);
// // //         // Optionally handle error (e.g., show a notification)
// // //       }
// // //     }
// // //   };

// // //   return (
// // //     <Modal
// // //       isOpen={isOpen}
// // //       onRequestClose={onClose}
// // //       style={{
// // //         content: {
// // //           top: '50%',
// // //           left: '50%',
// // //           right: 'auto',
// // //           bottom: 'auto',
// // //           transform: 'translate(-50%, -50%)',
// // //           maxWidth: '400px',
// // //           width: '90%',
// // //           maxHeight: '80vh',
// // //           padding: '24px',
// // //           borderRadius: '12px',
// // //           boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
// // //           overflowY: 'auto',
// // //           fontFamily: 'Arial, sans-serif',
// // //         },
// // //         overlay: {
// // //           backgroundColor: 'rgba(0, 0, 0, 0.5)',
// // //         },
// // //       }}
// // //     >
// // //       <div className="relative">
// // //         <button
// // //           onClick={onClose}
// // //           className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
// // //         >
// // //           <AiOutlineClose />
// // //         </button>
// // //       </div>
// // //       <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Recruiter</h2>

// // //       <form onSubmit={handleSubmit} className="space-y-4">
// // //         <div>
// // //           <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
// // //           <input
// // //             type="text"
// // //             name="name"
// // //             value={formData?.name || ''} // Use optional chaining and provide a default value
// // //             onChange={handleChange}
// // //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// // //             placeholder="Enter name"
// // //           />
// // //         </div>

// // //         <div>
// // //           <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
// // //           <input
// // //             type="email"
// // //             name="email"
// // //             value={formData?.email || ''} // Use optional chaining and provide a default value
// // //             onChange={handleChange}
// // //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// // //             placeholder="Enter email"
// // //           />
// // //         </div>

// // //         <div>
// // //           <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
// // //           <input
// // //             type="text"
// // //             name="phone"
// // //             value={formData?.phone || ''} // Use optional chaining and provide a default value
// // //             onChange={handleChange}
// // //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// // //             placeholder="Enter phone"
// // //           />
// // //         </div>

// // //         <div>
// // //           <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
// // //           <input
// // //             type="text"
// // //             name="status"
// // //             value={formData?.status || ''} // Use optional chaining and provide a default value
// // //             onChange={handleChange}
// // //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// // //             placeholder="Enter status"
// // //           />
// // //         </div>

// // //         <div>
// // //           <label className="block text-sm font-semibold text-gray-700 mb-1">Designation</label>
// // //           <input
// // //             type="text"
// // //             name="designation"
// // //             value={formData?.designation || ''} // Use optional chaining and provide a default value
// // //             onChange={handleChange}
// // //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// // //             placeholder="Enter designation"
// // //           />
// // //         </div>

// // //         <div>
// // //           <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
// // //           <input
// // //             type="date"
// // //             name="dob"
// // //             value={formData?.dob || ''} // Use optional chaining and provide a default value
// // //             onChange={handleChange}
// // //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// // //             placeholder="Enter date of birth"
// // //           />
// // //         </div>

// // //         <div>
// // //           <label className="block text-sm font-semibold text-gray-700 mb-1">Personal Email</label>
// // //           <input
// // //             type="email"
// // //             name="personalemail"
// // //             value={formData?.personalemail || ''} // Use optional chaining and provide a default value
// // //             onChange={handleChange}
// // //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// // //             placeholder="Enter personal email"
// // //           />
// // //         </div>

// // //         <div>
// // //           <label className="block text-sm font-semibold text-gray-700 mb-1">Employee ID</label>
// // //           <input
// // //             type="number"
// // //             name="employeeid"
// // //             value={formData?.employeeid || ''} // Use optional chaining and provide a default value
// // //             onChange={handleChange}
// // //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// // //             placeholder="Enter employee ID"
// // //           />
// // //         </div>

// // //         <div>
// // //           <label className="block text-sm font-semibold text-gray-700 mb-1">Skype ID</label>
// // //           <input
// // //             type="text"
// // //             name="skypeid"
// // //             value={formData?.skypeid || ''} // Use optional chaining and provide a default value
// // //             onChange={handleChange}
// // //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// // //             placeholder="Enter Skype ID"
// // //           />
// // //         </div>

// // //         <div>
// // //           <label className="block text-sm font-semibold text-gray-700 mb-1">LinkedIn</label>
// // //           <input
// // //             type="url"
// // //             name="linkedin"
// // //             value={formData?.linkedin || ''} // Use optional chaining and provide a default value
// // //             onChange={handleChange}
// // //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// // //             placeholder="Enter LinkedIn URL"
// // //           />
// // //         </div>

// // //         <div>
// // //           <label className="block text-sm font-semibold text-gray-700 mb-1">Twitter</label>
// // //           <input
// // //             type="text"
// // //             name="twitter"
// // //             value={formData?.twitter || ''} // Use optional chaining and provide a default value
// // //             onChange={handleChange}
// // //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// // //             placeholder="Enter Twitter handle"
// // //           />
// // //         </div>

// // //         <div>
// // //           <label className="block text-sm font-semibold text-gray-700 mb-1">Facebook</label>
// // //           <input
// // //             type="text"
// // //             name="facebook"
// // //             value={formData?.facebook || ''} // Use optional chaining and provide a default value
// // //             onChange={handleChange}
// // //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// // //             placeholder="Enter Facebook URL"
// // //           />
// // //         </div>

// // //         <div>
// // //           <label className="block text-sm font-semibold text-gray-700 mb-1">Review</label>
// // //           <textarea
// // //             name="review"
// // //             value={formData?.review || ''} // Use optional chaining and provide a default value
// // //             onChange={handleChange}
// // //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// // //             placeholder="Enter review"
// // //           />
// // //         </div>

// // //         <div>
// // //           <label className="block text-sm font-semibold text-gray-700 mb-1">Vendor ID</label>
// // //           <input
// // //             type="number"
// // //             name="vendorid"
// // //             value={formData?.vendorid || ''} // Use optional chaining and provide a default value
// // //             onChange={handleChange}
// // //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// // //             placeholder="Enter vendor ID"
// // //           />
// // //         </div>

// // //         <div>
// // //           <label className="block text-sm font-semibold text-gray-700 mb-1">Client ID</label>
// // //           <input
// // //             type="number"
// // //             name="clientid"
// // //             value={formData?.clientid || ''} // Use optional chaining and provide a default value
// // //             onChange={handleChange}
// // //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// // //             placeholder="Enter client ID"
// // //           />
// // //         </div>

// // //         <div>
// // //           <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
// // //           <textarea
// // //             name="notes"
// // //             value={formData?.notes || ''} // Use optional chaining and provide a default value
// // //             onChange={handleChange}
// // //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// // //             placeholder="Enter notes"
// // //           />
// // //         </div>

// // //         <button
// // //           onClick={onSubmit}
// // //           type="submit"
// // //           className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
// // //         >
// // //           Save Changes
// // //         </button>
// // //       </form>
// // //     </Modal>
// // //   );
// // // };

// // // export default EditRowRecruiter;

// // "use client";
// // import React, { useState, useEffect } from 'react';
// // import Modal from 'react-modal';
// // import { AiOutlineClose } from 'react-icons/ai';
// // import { Recruiter } from '@/types/byClient';
// // import axios from 'axios';

// // interface Client {
// //   id: number;
// //   name: string;
// // }

// // interface EditRowRecruiterProps {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   initialData: Recruiter | null;
// //   onSubmit: (formData: Recruiter) => Promise<void>;
// // }

// // const EditRowRecruiter: React.FC<EditRowRecruiterProps> = ({ isOpen, onClose, initialData, onSubmit }) => {
// //   const [formData, setFormData] = useState<Recruiter | null>(initialData);
// //   const [clients, setClients] = useState<Client[]>([]);
  
// //   const statusOptions = [
// //     { value: 'A', label: 'Active' },
// //     { value: 'I', label: 'Inactive' },
// //     { value: 'D', label: 'Delete' },
// //     { value: 'R', label: 'Rejected' },
// //     { value: 'N', label: 'Not Interested' },
// //     { value: 'E', label: 'Excellent' }
// //   ];

// //   const reviewOptions = [
// //     { value: 'Y', label: 'Yes' },
// //     { value: 'N', label: 'No' }
// //   ];

// //   useEffect(() => {
// //     const fetchClients = async () => {
// //       try {
// //         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/recruiters/byClient/clients`);
// //         setClients(response.data || []);
// //       } catch (error) {
// //         console.error("Error fetching clients:", error);
// //       }
// //     };

// //     fetchClients();
// //   }, []);

// //   useEffect(() => {
// //     if (initialData) {
// //       setFormData(initialData);
// //     }
// //   }, [initialData]);

// //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
// //     const { name, value } = e.target;
// //     setFormData((prevData) => {
// //       if (prevData) {
// //         return {
// //           ...prevData,
// //           [name]: value,
// //         };
// //       }
// //       return null;
// //     });
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (formData) {
// //       try {
// //         await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/recruiters/byClient/update/${formData.id}`, formData);
// //         onSubmit(formData);
// //         onClose();
// //       } catch (error) {
// //         console.error("Error updating recruiter:", error);
// //       }
// //     }
// //   };

// //   if (!formData) return null;

// //   return (
// //     <Modal
// //       isOpen={isOpen}
// //       onRequestClose={onClose}
// //       style={{
// //         content: {
// //           top: '50%',
// //           left: '50%',
// //           right: 'auto',
// //           bottom: 'auto',
// //           transform: 'translate(-50%, -50%)',
// //           maxWidth: '400px',
// //           width: '90%',
// //           maxHeight: '80vh',
// //           padding: '24px',
// //           borderRadius: '12px',
// //           boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
// //           overflowY: 'auto',
// //           fontFamily: 'Arial, sans-serif',
// //         },
// //         overlay: {
// //           backgroundColor: 'rgba(0, 0, 0, 0.5)',
// //         },
// //       }}
// //     >
// //       <div className="relative">
// //         <button
// //           onClick={onClose}
// //           className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
// //         >
// //           <AiOutlineClose />
// //         </button>
// //       </div>
// //       <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Recruiter</h2>

// //       <form onSubmit={handleSubmit} className="space-y-4">
// //         <div>
// //           <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
// //           <input
// //             type="text"
// //             name="name"
// //             value={formData.name || ''}
// //             onChange={handleChange}
// //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// //             placeholder="Enter name"
// //           />
// //         </div>

// //         <div>
// //           <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
// //           <input
// //             type="email"
// //             name="email"
// //             value={formData.email || ''}
// //             onChange={handleChange}
// //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// //             placeholder="Enter email"
// //           />
// //         </div>

// //         <div>
// //           <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
// //           <input
// //             type="text"
// //             name="phone"
// //             value={formData.phone || ''}
// //             onChange={handleChange}
// //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// //             placeholder="Enter phone"
// //           />
// //         </div>

// //         <div>
// //           <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
// //           <select
// //             name="status"
// //             value={formData.status || ''}
// //             onChange={handleChange}
// //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// //           >
// //             {statusOptions.map(option => (
// //               <option key={option.value} value={option.value}>{option.label}</option>
// //             ))}
// //           </select>
// //         </div>

// //         <div>
// //           <label className="block text-sm font-semibold text-gray-700 mb-1">Designation</label>
// //           <input
// //             type="text"
// //             name="designation"
// //             value={formData.designation || ''}
// //             onChange={handleChange}
// //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// //             placeholder="Enter designation"
// //           />
// //         </div>

// //         <div>
// //           <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
// //           <input
// //             type="date"
// //             name="dob"
// //             value={formData.dob || ''}
// //             onChange={handleChange}
// //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// //             placeholder="Enter date of birth"
// //           />
// //         </div>

// //         <div>
// //           <label className="block text-sm font-semibold text-gray-700 mb-1">Personal Email</label>
// //           <input
// //             type="email"
// //             name="personalemail"
// //             value={formData.personalemail || ''}
// //             onChange={handleChange}
// //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// //             placeholder="Enter personal email"
// //           />
// //         </div>

// //         <div>
// //           <label className="block text-sm font-semibold text-gray-700 mb-1">Employee ID</label>
// //           <input
// //             type="number"
// //             name="employeeid"
// //             value={formData.employeeid || ''}
// //             onChange={handleChange}
// //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// //             placeholder="Enter employee ID"
// //           />
// //         </div>

// //         <div>
// //           <label className="block text-sm font-semibold text-gray-700 mb-1">Skype ID</label>
// //           <input
// //             type="text"
// //             name="skypeid"
// //             value={formData.skypeid || ''}
// //             onChange={handleChange}
// //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// //             placeholder="Enter Skype ID"
// //           />
// //         </div>

// //         <div>
// //           <label className="block text-sm font-semibold text-gray-700 mb-1">LinkedIn</label>
// //           <input
// //             type="url"
// //             name="linkedin"
// //             value={formData.linkedin || ''}
// //             onChange={handleChange}
// //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// //             placeholder="Enter LinkedIn URL"
// //           />
// //         </div>

// //         <div>
// //           <label className="block text-sm font-semibold text-gray-700 mb-1">Twitter</label>
// //           <input
// //             type="text"
// //             name="twitter"
// //             value={formData.twitter || ''}
// //             onChange={handleChange}
// //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// //             placeholder="Enter Twitter handle"
// //           />
// //         </div>

// //         <div>
// //           <label className="block text-sm font-semibold text-gray-700 mb-1">Facebook</label>
// //           <input
// //             type="text"
// //             name="facebook"
// //             value={formData.facebook || ''}
// //             onChange={handleChange}
// //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// //             placeholder="Enter Facebook URL"
// //           />
// //         </div>

// //         <div>
// //           <label className="block text-sm font-semibold text-gray-700 mb-1">Review</label>
// //           <select
// //             name="review"
// //             value={formData.review || ''}
// //             onChange={handleChange}
// //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// //           >
// //             {reviewOptions.map(option => (
// //               <option key={option.value} value={option.value}>{option.label}</option>
// //             ))}
// //           </select>
// //         </div>

// //         <div>
// //           <label className="block text-sm font-semibold text-gray-700 mb-1">Vendor ID</label>
// //           <input
// //             type="number"
// //             name="vendorid"
// //             value={formData.vendorid || ''}
// //             onChange={handleChange}
// //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// //             placeholder="Enter vendor ID"
// //           />
// //         </div>

// //         <div>
// //           <label className="block text-sm font-semibold text-gray-700 mb-1">Client ID</label>
// //           <select
// //             name="clientid"
// //             value={formData.clientid || ''}
// //             onChange={handleChange}
// //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// //           >
// //             <option value="">Select Client</option>
// //             {clients.map(client => (
// //               <option key={client.id} value={client.id}>{client.name}</option>
// //             ))}
// //           </select>
// //         </div>

// //         <div>
// //           <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
// //           <textarea
// //             name="notes"
// //             value={formData.notes || ''}
// //             onChange={handleChange}
// //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
// //             placeholder="Enter notes"
// //           />
// //         </div>

// //         <div className="flex justify-end space-x-4">
// //           <button
// //             type="button"
// //             onClick={onClose}
// //             className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200 font-semibold text-sm"
// //           >
// //             Cancel
// //           </button>
// //           <button
// //             type="submit"
// //             className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
// //           >
// //             Save Changes
// //           </button>
// //         </div>
// //       </form>
// //     </Modal>
// //   );
// // };

// // export default EditRowRecruiter;

// "use client";
// import React, { useState, useEffect } from 'react';
// import Modal from 'react-modal';
// import { AiOutlineClose } from 'react-icons/ai';
// import { Recruiter } from '@/types/byClient';
// import axios from 'axios';

// interface Client {
//   id: number;
//   name: string;
// }

// interface EditRowRecruiterProps {
//   isOpen: boolean;
//   onClose: () => void;
//   initialData: Recruiter | null;
//   onSubmit: (formData: Recruiter) => Promise<void>;
//   clients: Client[]; // Pass clients list as prop
//   defaultClientId: number; // Default selected client ID
// }

// const EditRowRecruiter: React.FC<EditRowRecruiterProps> = ({ 
//   isOpen, 
//   onClose, 
//   initialData, 
//   onSubmit,
//   clients,
//   defaultClientId 
// }) => {
//   const [formData, setFormData] = useState<Recruiter | null>(null);
  
//   const statusOptions = [
//     { value: 'A', label: 'Active' },
//     { value: 'I', label: 'Inactive' },
//     { value: 'D', label: 'Delete' },
//     { value: 'R', label: 'Rejected' },
//     { value: 'N', label: 'Not Interested' },
//     { value: 'E', label: 'Excellent' }
//   ];

//   const reviewOptions = [
//     { value: 'Y', label: 'Yes' },
//     { value: 'N', label: 'No' }
//   ];

//   useEffect(() => {
//     if (initialData) {
//       // Set the form data with the initial data
//       setFormData({
//         ...initialData,
//         clientid: defaultClientId // Set default client ID
//       });
//     }
//   }, [initialData, defaultClientId]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => {
//       if (prevData) {
//         return {
//           ...prevData,
//           [name]: value,
//         };
//       }
//       return null;
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (formData) {
//       try {
//         await axios.put(
//           `${process.env.NEXT_PUBLIC_API_URL}/recruiters/byClient/update/${formData.id}`,
//           formData
//         );
//         onSubmit(formData);
//         onClose();
//       } catch (error) {
//         console.error("Error updating recruiter:", error);
//       }
//     }
//   };

//   if (!formData) return null;

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       style={{
//         content: {
//           top: '50%',
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
//           <AiOutlineClose />
//         </button>
//       </div>
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Recruiter</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Other fields remain the same... */}

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Company</label>
//           <select
//             name="clientid"
//             value={formData.clientid || ''}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             required
//           >
//             {clients.map(client => (
//               <option key={client.id} value={client.id}>
//                 {client.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Rest of the form fields... */}

//         <div className="flex justify-end space-x-4">
//           <button
//             type="button"
//             onClick={onClose}
//             className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200 font-semibold text-sm"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
//           >
//             Save Changes
//           </button>
//         </div>
//       </form>
//     </Modal>
//   );
// };

// export default EditRowRecruiter;


"use client";
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { AiOutlineClose } from 'react-icons/ai';
import { Recruiter } from '@/types/byClient';
import axios from 'axios';

interface Client {
  id: number;
  name: string;
}

interface EditRowRecruiterProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: Recruiter | null;
  onSubmit: (formData: Recruiter) => Promise<void>;
  clients: Client[];
  defaultClientId: number;
}

const EditRowRecruiter: React.FC<EditRowRecruiterProps> = ({ 
  isOpen, 
  onClose, 
  initialData, 
  onSubmit,
  clients,
  defaultClientId
}) => {
  const [formData, setFormData] = useState<Recruiter | null>(null);
  
  const statusOptions = [
    { value: 'A', label: 'Active' },
    { value: 'I', label: 'Inactive' },
    { value: 'D', label: 'Delete' },
    { value: 'R', label: 'Rejected' },
    { value: 'N', label: 'Not Interested' },
    { value: 'E', label: 'Excellent' }
  ];

  const reviewOptions = [
    { value: 'Y', label: 'Yes' },
    { value: 'N', label: 'No' }
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        clientid: defaultClientId // Set default client ID from props
      });
    }
  }, [initialData, defaultClientId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      if (prevData) {
        return {
          ...prevData,
          [name]: value,
        };
      }
      return null;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/recruiters/byClient/update/${formData.id}`,
          formData
        );
        onSubmit(formData);
        onClose();
      } catch (error) {
        console.error("Error updating recruiter:", error);
      }
    }
  };

  if (!formData) return null;

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
    >
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
        >
          <AiOutlineClose />
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Recruiter</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter email"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter phone"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Designation</label>
          <input
            type="text"
            name="designation"
            value={formData.designation || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter designation"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Company</label>
          <select
            name="clientid"
            value={formData.clientid || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
          >
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Birth Date</label>
          <input
            type="date"
            name="dob"
            value={formData.dob || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Personal Email</label>
          <input
            type="email"
            name="personalemail"
            value={formData.personalemail || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter personal email"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Skype</label>
          <input
            type="text"
            name="skypeid"
            value={formData.skypeid || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Skype ID"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">LinkedIn</label>
          <input
            type="url"
            name="linkedin"
            value={formData.linkedin || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter LinkedIn URL"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Twitter</label>
          <input
            type="text"
            name="twitter"
            value={formData.twitter || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Twitter handle"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Facebook</label>
          <input
            type="text"
            name="facebook"
            value={formData.facebook || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Facebook URL"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Review</label>
          <select
            name="review"
            value={formData.review || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            {reviewOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter notes"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200 font-semibold text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditRowRecruiter;
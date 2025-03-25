// // // new-projects-avatar-fullstack/project-avatar-ui/modals/Marketing/CurrentMarketing/EditCandidateMarketing.tsx

// import React, { useEffect, useState } from 'react';
// import Modal from 'react-modal';
// import axios from 'axios';

// interface CandidateMarketing {
//   candidateid: number;
//   startdate: string | number;
//   mmid: number;
//   instructorid: number;
//   status: string;
//   submitterid: number;
//   priority: string;
//   technology: string;
//   minrate: number;
//   currentlocation: string;
//   relocation: string;
//   locationpreference: string;
//   skypeid: string;
//   ipemailid: number;
//   resumeid: number;
//   coverletter: string;
//   intro: string;
//   closedate: string;
//   closedemail: string;
//   notes: string;
//   suspensionreason: string;
//   yearsofexperience: string;
// }

// interface EditCandidateMarketingModalProps {
//   isOpen: boolean;
//   onRequestClose: () => void;
//   rowData: CandidateMarketing | null;
//   onSave: () => void;
// }

// const EditCandidateMarketingModal: React.FC<EditCandidateMarketingModalProps> = ({ isOpen, onRequestClose, rowData, onSave }) => {
//   const [formData, setFormData] = useState<CandidateMarketing | null>(null);

//   useEffect(() => {
//     if (rowData) {
//       setFormData(rowData);
//     }
//   }, [rowData]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     if (formData) {
//       setFormData({
//         ...formData,
//         [e.target.name]: e.target.value,
//       });
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (formData) {
//       if (formData.relocation !== "Yes" && formData.relocation !== "No") {
//         alert("Relocation field must be 'Yes' or 'No'");
//         return;
//       }

//       try {
//         const response = await axios.put(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/admin/currentmarketing/${formData.candidateid}`,
//           formData,
//           {
//             headers: { AuthToken: localStorage.getItem('token') },
//           }
//         );
//         console.log(response.data.message); // Log the success message
//         onSave(); // Refresh the data
//         onRequestClose(); // Close the modal
//       } catch (error) {
//         console.error('Error updating candidate marketing:', error);
//         // Handle the error, e.g., show an alert to the user
//       }
//     }
//   };

//   if (!formData) return null; // Prevent rendering if formData is not set

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
//     >
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800 pr-8">Edit Candidate Marketing</h2>
//         <button
//           onClick={onRequestClose}
//           className="text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
//         >
//           &times;
//         </button>
//       </div>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {formData && Object.keys(formData).map((key) => (
//           <div key={key} className="modal-field">
//             <label htmlFor={key} className="block text-sm font-semibold text-gray-700 mb-1">
//               {key.charAt(0).toUpperCase() + key.slice(1)}
//             </label>
//             {key === 'status' ? (
//               <select
//                 id="status"
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               >
//                 <option value="">None</option>
//                 <option value="Active">Active</option>
//                 <option value="Inactive">Inactive</option>
//                 {/* Add more options as needed */}
//               </select>
//             ) : key === 'priority' ? (
//               <select
//                 id="priority"
//                 name="priority"
//                 value={formData.priority}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               >
//                 <option value="">None</option>
//                 <option value="P1">P1</option>
//                 <option value="P2">P2</option>
//                 <option value="P3">P3</option>
//                 <option value="P4">P4</option>
//                 <option value="P5">P5</option>
//                 {/* Add more options as needed */}
//               </select>
//             ) : key === 'technology' ? (
//               <select
//                 id="technology"
//                 name="technology"
//                 value={formData.technology}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               >
//                 <option value="">None</option>
//                 <option value="QA">QA</option>
//                 <option value="UI">UI</option>
//                 <option value="ML">ML</option>
//                 {/* Add more options as needed */}
//               </select>
//             ) : key === 'suspensionreason' ? (
//               <select
//                 id="suspensionreason"
//                 name="suspensionreason"
//                 value={formData.suspensionreason}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               >
//                 <option value="">None</option>
//                 <option value="A">A - Active</option>
//                 <option value="B">B - Break</option>
//                 <option value="D">D - Discontinued</option>
//                 <option value="X">X - Defaulted</option>
//                 {/* Add more options as needed */}
//               </select>
//             ) : key === 'relocation' ? (
//               <select
//                 id="relocation"
//                 name="relocation"
//                 value={formData.relocation}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               >
//                 <option value="">Select</option>
//                 <option value="Yes">Yes</option>
//                 <option value="No">No</option>
//               </select>
//             ) : key === 'coverletter' || key === 'intro' || key === 'notes' ? (
//               <textarea
//                 id={key}
//                 name={key}
//                 value={formData[key as keyof CandidateMarketing]}
//                 onChange={handleChange}
//                 placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               />
//             ) : (
//               <input
//                 type="text"
//                 id={key}
//                 name={key}
//                 value={formData[key as keyof CandidateMarketing]}
//                 onChange={handleChange}
//                 placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               />
//             )}
//           </div>
//         ))}
//         <button
//           type="submit"
//           className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
//         >
//           Save Candidate
//         </button>
//       </form>
//     </Modal>
//   );
// };

// export default EditCandidateMarketingModal;





// import React, { useEffect, useState } from 'react';
// import Modal from 'react-modal';
// import axios from 'axios';

// interface CandidateMarketing {
//   candidateid: number;
//   mmid: number;
//   instructorid: number;
//   status: string;
//   submitterid: number;
//   priority: string;
//   technology: string;
//   resumeid: number;
//   minrate: number;
//   ipemailid: number;
//   relocation: string;
//   closedate: string;
//   suspensionreason: string;
//   intro: string;
//   notes: string;
//   locationpreference: string;
// }

// interface EditCandidateMarketingModalProps {
//   isOpen: boolean;
//   onRequestClose: () => void;
//   rowData: CandidateMarketing | null;
//   onSave: () => void;
// }

// const EditCandidateMarketingModal: React.FC<EditCandidateMarketingModalProps> = ({ isOpen, onRequestClose, rowData, onSave }) => {
//   const [formData, setFormData] = useState<CandidateMarketing | null>(null);

//   useEffect(() => {
//     if (rowData) {
//       setFormData(rowData);
//     }
//   }, [rowData]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     if (formData) {
//       setFormData({
//         ...formData,
//         [e.target.name]: e.target.value,
//       });
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (formData) {
//       if (formData.relocation !== "Yes" && formData.relocation !== "No") {
//         alert("Relocation field must be 'Yes' or 'No'");
//         return;
//       }

//       try {
//         const response = await axios.put(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/admin/currentmarketing/${formData.candidateid}`,
//           formData,
//           {
//             headers: { AuthToken: localStorage.getItem('token') },
//           }
//         );
//         console.log(response.data.message); // Log the success message
//         onSave(); // Refresh the data
//         onRequestClose(); // Close the modal
//       } catch (error) {
//         console.error('Error updating candidate marketing:', error);
//         // Handle the error, e.g., show an alert to the user
//       }
//     }
//   };

//   if (!formData) return null; // Prevent rendering if formData is not set

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
//     >
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800 pr-8">Edit Candidate Marketing</h2>
//         <button
//           onClick={onRequestClose}
//           className="text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
//         >
//           &times;
//         </button>
//       </div>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {formData && (
//           <>
//             <div className="modal-field">
//               <label htmlFor="mmid" className="block text-sm font-semibold text-gray-700 mb-1">
//                 Manager
//               </label>
//               <input
//                 type="text"
//                 id="mmid"
//                 name="mmid"
//                 value={formData.mmid}
//                 onChange={handleChange}
//                 placeholder="Manager"
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               />
//             </div>
//             <div className="modal-field">
//               <label htmlFor="instructorid" className="block text-sm font-semibold text-gray-700 mb-1">
//                 Instructor
//               </label>
//               <input
//                 type="text"
//                 id="instructorid"
//                 name="instructorid"
//                 value={formData.instructorid}
//                 onChange={handleChange}
//                 placeholder="Instructor"
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               />
//             </div>
//             <div className="modal-field">
//               <label htmlFor="submitterid" className="block text-sm font-semibold text-gray-700 mb-1">
//                 Submitter
//               </label>
//               <input
//                 type="text"
//                 id="submitterid"
//                 name="submitterid"
//                 value={formData.submitterid}
//                 onChange={handleChange}
//                 placeholder="Submitter"
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               />
//             </div>
//             <div className="modal-field">
//               <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1">
//                 Status
//               </label>
//               <select
//                 id="status"
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               >
//                 <option value="">None</option>
//                 <option value="To Do">To Do</option>
//                 <option value="Inprogress">Inprogress</option>
//                 <option value="Suspended">Suspended</option>
//                 <option value="Closed">Closed</option>
//               </select>
//             </div>
//             <div className="modal-field">
//               <label htmlFor="locationpreference" className="block text-sm font-semibold text-gray-700 mb-1">
//                 Location Preference
//               </label>
//               <input
//                 type="text"
//                 id="locationpreference"
//                 name="locationpreference"
//                 value={formData.locationpreference}
//                 onChange={handleChange}
//                 placeholder="Location Preference"
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               />
//             </div>
//             <div className="modal-field">
//               <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-1">
//                 Property
//               </label>
//               <select
//                 id="priority"
//                 name="priority"
//                 value={formData.priority}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               >
//                 <option value="">None</option>
//                 <option value="P1">P1</option>
//                 <option value="P2">P2</option>
//                 <option value="P3">P3</option>
//                 <option value="P4">P4</option>
//                 <option value="P5">P5</option>
//               </select>
//             </div>
//             <div className="modal-field">
//               <label htmlFor="technology" className="block text-sm font-semibold text-gray-700 mb-1">
//                 Technology
//               </label>
//               <select
//                 id="technology"
//                 name="technology"
//                 value={formData.technology}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               >
//                 <option value="">ML</option>
//                 <option value="QA">QA</option>
//                 <option value="UI">UI</option>
//                 {/* <option value="ML">ML</option> */}
//               </select>
//             </div>
//             <div className="modal-field">
//               <label htmlFor="resumeid" className="block text-sm font-semibold text-gray-700 mb-1">
//                 Resume Id
//               </label>
//               <input
//                 type="text"
//                 id="resumeid"
//                 name="resumeid"
//                 value={formData.resumeid}
//                 onChange={handleChange}
//                 placeholder="Resume Id"
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               />
//             </div>
//             <div className="modal-field">
//               <label htmlFor="minrate" className="block text-sm font-semibold text-gray-700 mb-1">
//                 Rate
//               </label>
//               <input
//                 type="text"
//                 id="minrate"
//                 name="minrate"
//                 value={formData.minrate}
//                 onChange={handleChange}
//                 placeholder="Rate"
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               />
//             </div>
//             <div className="modal-field">
//               <label htmlFor="ipemailid" className="block text-sm font-semibold text-gray-700 mb-1">
//                 IP Email
//               </label>
//               <input
//                 type="text"
//                 id="ipemailid"
//                 name="ipemailid"
//                 value={formData.ipemailid}
//                 onChange={handleChange}
//                 placeholder="IP Email"
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               />
//             </div>
//             <div className="modal-field">
//               <label htmlFor="relocation" className="block text-sm font-semibold text-gray-700 mb-1">
//                 Relocation
//               </label>
//               <select
//                 id="relocation"
//                 name="relocation"
//                 value={formData.relocation}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               >
//                 <option value="">Select</option>
//                 <option value="Yes">Yes</option>
//                 <option value="No">No</option>
//               </select>
//             </div>
//             <div className="modal-field">
//               <label htmlFor="closedate" className="block text-sm font-semibold text-gray-700 mb-1">
//                 Close Date
//               </label>
//               <input
//                 type="text"
//                 id="closedate"
//                 name="closedate"
//                 value={formData.closedate}
//                 onChange={handleChange}
//                 placeholder="Close Date"
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               />
//             </div>
//             <div className="modal-field">
//               <label htmlFor="suspensionreason" className="block text-sm font-semibold text-gray-700 mb-1">
//                 Reason
//               </label>
//               <select
//                 id="suspensionreason"
//                 name="suspensionreason"
//                 value={formData.suspensionreason}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               >
//                 <option value="">None</option>
//                 <option value="Active">Active</option>
//                 <option value="Break">Break</option>
//                 <option value="DisContinued">DisContinued</option>
//                 <option value="Defaulted">Defaulted</option>
//               </select>
//             </div>
//             <div className="modal-field">
//               <label htmlFor="intro" className="block text-sm font-semibold text-gray-700 mb-1">
//                 Intro
//               </label>
//               <textarea
//                 id="intro"
//                 name="intro"
//                 value={formData.intro}
//                 onChange={handleChange}
//                 placeholder="Intro"
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               />
//             </div>
//             <div className="modal-field">
//               <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-1">
//                 Notes
//               </label>
//               <textarea
//                 id="notes"
//                 name="notes"
//                 value={formData.notes}
//                 onChange={handleChange}
//                 placeholder="Notes"
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               />
//             </div>
//           </>
//         )}
//         <button
//           type="submit"
//           className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
//         >
//           Save Candidate
//         </button>
//       </form>
//     </Modal>
//   );
// };

// export default EditCandidateMarketingModal;













import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

interface CandidateMarketing {
  candidateid: number;
  mmid: number;
  instructorid: number;
  status: string;
  submitterid: number;
  priority: string;
  technology: string;
  resumeid: number;
  minrate: number;
  ipemailid: number;
  relocation: string;
  closedate: string;
  suspensionreason: string;
  intro: string;
  notes: string;
  locationpreference: string;
  skypeid: string;
  currentlocation: string;
  yearsofexperience: string;
  coverletter: string;
  closedemail: string;
}

interface EditCandidateMarketingModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  rowData: CandidateMarketing | null;
  onSave: () => void;
  employees: { id: number; name: string }[];
}

const EditCandidateMarketingModal: React.FC<EditCandidateMarketingModalProps> = ({
  isOpen,
  onRequestClose,
  rowData,
  onSave,
  employees,
}) => {
  const [formData, setFormData] = useState<CandidateMarketing | null>(null);

  useEffect(() => {
    if (rowData) {
      setFormData(rowData);
    }
  }, [rowData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (formData) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData) {
      if (formData.relocation !== "Yes" && formData.relocation !== "No") {
        alert("Relocation field must be 'Yes' or 'No'");
        return;
      }

      // Ensure all required fields are included
      const updatedData = {
        ...formData,
        coverletter: formData.coverletter || "",
        closedemail: formData.closedemail || "",
        yearsofexperience: formData.yearsofexperience || "",
        locationpreference: formData.locationpreference || "",
        skypeid: formData.skypeid || "",
        intro: formData.intro || "",
        notes: formData.notes || "",
        closedate: formData.closedate || "",
      };

      try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/currentmarketing/${formData.candidateid}`,
          updatedData,
          {
            headers: { AuthToken: localStorage.getItem('token') },
          }
        );
        console.log(response.data.message); // Log the success message
        onSave(); // Refresh the data
        onRequestClose(); // Close the modal
      } catch (error) {
        console.error('Error updating candidate marketing:', error);
        // Handle the error, e.g., show an alert to the user
      }
    }
  };

  if (!formData) return null; // Prevent rendering if formData is not set

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 pr-8">Edit Candidate Marketing</h2>
        <button
          onClick={onRequestClose}
          className="text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
        >
          &times;
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {formData && (
          <>
            <div className="modal-field">
              <label htmlFor="mmid" className="block text-sm font-semibold text-gray-700 mb-1">
                Manager
              </label>
              <select
                id="mmid"
                name="mmid"
                value={formData.mmid}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                <option value="">Select Manager</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-field">
              <label htmlFor="instructorid" className="block text-sm font-semibold text-gray-700 mb-1">
                Instructor
              </label>
              <select
                id="instructorid"
                name="instructorid"
                value={formData.instructorid}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                <option value="">Select Instructor</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-field">
              <label htmlFor="submitterid" className="block text-sm font-semibold text-gray-700 mb-1">
                Submitter
              </label>
              <select
                id="submitterid"
                name="submitterid"
                value={formData.submitterid}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                <option value="">Select Submitter</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-field">
              <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                <option value="">None</option>
                <option value="To Do">To Do</option>
                <option value="Inprogress">Inprogress</option>
                <option value="Suspended">Suspended</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div className="modal-field">
              <label htmlFor="locationpreference" className="block text-sm font-semibold text-gray-700 mb-1">
                Location Preference
              </label>
              <input
                type="text"
                id="locationpreference"
                name="locationpreference"
                value={formData.locationpreference}
                onChange={handleChange}
                placeholder="Location Preference"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>
            <div className="modal-field">
              <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-1">
                Property
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                <option value="">None</option>
                <option value="P1">P1</option>
                <option value="P2">P2</option>
                <option value="P3">P3</option>
                <option value="P4">P4</option>
                <option value="P5">P5</option>
              </select>
            </div>
            <div className="modal-field">
              <label htmlFor="technology" className="block text-sm font-semibold text-gray-700 mb-1">
                Technology
              </label>
              <select
                id="technology"
                name="technology"
                value={formData.technology}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                <option value="">None</option>
                <option value="QA">QA</option>
                <option value="UI">UI</option>
                <option value="ML">ML</option>
              </select>
            </div>
            <div className="modal-field">
              <label htmlFor="resumeid" className="block text-sm font-semibold text-gray-700 mb-1">
                Resume Id
              </label>
              <input
                type="text"
                id="resumeid"
                name="resumeid"
                value={formData.resumeid}
                onChange={handleChange}
                placeholder="Resume Id"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>
            <div className="modal-field">
              <label htmlFor="minrate" className="block text-sm font-semibold text-gray-700 mb-1">
                Rate
              </label>
              <input
                type="text"
                id="minrate"
                name="minrate"
                value={formData.minrate}
                onChange={handleChange}
                placeholder="Rate"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>
            <div className="modal-field">
              <label htmlFor="ipemailid" className="block text-sm font-semibold text-gray-700 mb-1">
                IP Email
              </label>
              <input
                type="text"
                id="ipemailid"
                name="ipemailid"
                value={formData.ipemailid}
                onChange={handleChange}
                placeholder="IP Email"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>
            <div className="modal-field">
              <label htmlFor="relocation" className="block text-sm font-semibold text-gray-700 mb-1">
                Relocation
              </label>
              <select
                id="relocation"
                name="relocation"
                value={formData.relocation}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="modal-field">
              <label htmlFor="closedate" className="block text-sm font-semibold text-gray-700 mb-1">
                Close Date
              </label>
              <input
                type="text"
                id="closedate"
                name="closedate"
                value={formData.closedate}
                onChange={handleChange}
                placeholder="Close Date"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>
            <div className="modal-field">
              <label htmlFor="suspensionreason" className="block text-sm font-semibold text-gray-700 mb-1">
                Reason
              </label>
              <select
                id="suspensionreason"
                name="suspensionreason"
                value={formData.suspensionreason}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                <option value="">None</option>
                <option value="Active">Active</option>
                <option value="Break">Break</option>
                <option value="DisContinued">DisContinued</option>
                <option value="Defaulted">Defaulted</option>
              </select>
            </div>
            <div className="modal-field">
              <label htmlFor="intro" className="block text-sm font-semibold text-gray-700 mb-1">
                Intro
              </label>
              <textarea
                id="intro"
                name="intro"
                value={formData.intro}
                onChange={handleChange}
                placeholder="Intro"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>
            <div className="modal-field">
              <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Notes"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>
          </>
        )}
        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
        >
          Save Candidate
        </button>
      </form>
    </Modal>
  );
};

export default EditCandidateMarketingModal;

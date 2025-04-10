// import React, { useEffect, useState } from 'react';
// import Modal from 'react-modal';
// import axios from 'axios';

// interface CandidateMarketing {
//   id: number;
//   mmid: number;
//   instructorid: number;
//   status: string;
//   submitterid: number;
//   priority: string;
//   technology: string;
//   resumeid: number;
//   minrate: number;
//   ipemail: string;
//   relocation: string;
//   closedate: string;
//   suspensionreason: string;
//   intro: string;
//   notes: string;
//   locationpreference: string;
//   skypeid: string;
//   currentlocation: string;
//   yearsofexperience: string;
//   coverletter: string;
//   closedemail: string;
// }

// interface IpEmail {
//   id: number;
//   email: string;
// }

// interface EditCandidateMarketingModalProps {
//   isOpen: boolean;
//   onRequestClose: () => void;
//   rowData: CandidateMarketing | null;
//   onSave: () => void;
//   employees: { id: number; name: string }[];
// }

// const EditCandidateMarketingModal: React.FC<EditCandidateMarketingModalProps> = ({
//   isOpen,
//   onRequestClose,
//   rowData,
//   onSave,
//   employees,
// }) => {
//   const [formData, setFormData] = useState<CandidateMarketing | null>(null);
//   const [ipEmails, setIpEmails] = useState<IpEmail[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchIpEmails = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/currentmarketing/ipemails`, {
//           headers: { AuthToken: localStorage.getItem('token') },
//         });
//         setIpEmails(response.data);
//       } catch (error) {
//         console.error('Error fetching IP emails:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchIpEmails();
//   }, []);

//   useEffect(() => {
//     if (rowData) {
//       console.log("Row Data:", rowData);
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
//       if (formData.relocation && formData.relocation !== "Yes" && formData.relocation !== "No") {
//         alert("Relocation field must be 'Yes' or 'No'");
//         return;
//       }

//       // Find employee names based on IDs
//       const manager = employees.find(e => e.id === formData.mmid);
//       const instructor = employees.find(e => e.id === formData.instructorid);
//       const submitter = employees.find(e => e.id === formData.submitterid);

//       const updatedData = {
        
//         manager_name: manager?.name || "",
//         instructor_name: instructor?.name || "",
//         submitter_name: submitter?.name || "",
//         ipemail: formData.ipemail || "",
//         status: formData.status || "",
//         locationpreference: formData.locationpreference || "",
//         priority: formData.priority || "",
//         technology: formData.technology || "",
//         resumeid: formData.resumeid || 0,
//         minrate: formData.minrate || 0,
//         relocation: formData.relocation || "",
//         closedate: formData.closedate || "",
//         suspensionreason: formData.suspensionreason || "",
//         intro: formData.intro || "",
//         notes: formData.notes || "",
//         skypeid: formData.skypeid || "",
//         currentlocation: formData.currentlocation || ""
//       };

//       try {
//               // Make sure formData.candidateid is defined and a number
//       if (!formData.id || isNaN(formData.id)) {
//         throw new Error("Invalid candidate ID");
//       }
//         // Prepare the data with proper suspension reason
//       const submitData = {
//         ...formData,
//         suspensionreason: formData.suspensionreason?.charAt(0).toUpperCase() || null
//       };
//         const response = await axios.put(
//           `${process.env.NEXT_PUBLIC_API_URL}/candidatemarketing/${formData.id}`,
//           updatedData,
//           {
//             headers: { AuthToken: localStorage.getItem('token') },
//           }
//         );
//         console.log('Update successful:', response.data);
//         onSave();
//         onRequestClose();
//       } catch (error) {
//         if (axios.isAxiosError(error)) {
//           console.error('Error details:', error.response?.data);
//           alert(`Failed to update candidate: ${error.response?.data?.error || error.message}`);
//         } else {
//           console.error('Error updating candidate marketing:', error);
//           alert('Failed to update candidate. Please try again.');
//         }
//       }
//     }
//   };

//   if (!formData) return null;

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
//         <div className="modal-field">
//           <label htmlFor="mmid" className="block text-sm font-semibold text-gray-700 mb-1">
//             Manager
//           </label>
//           <select
//             id="mmid"
//             name="mmid"
//             value={formData.mmid || ""}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             <option value="">Select Manager</option>
//             {employees.map((employee) => (
//               <option key={employee.id} value={employee.id}>
//                 {employee.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="modal-field">
//           <label htmlFor="instructorid" className="block text-sm font-semibold text-gray-700 mb-1">
//             Instructor
//           </label>
//           <select
//             id="instructorid"
//             name="instructorid"
//             value={formData.instructorid || ""}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             <option value="">Select Instructor</option>
//             {employees.map((employee) => (
//               <option key={employee.id} value={employee.id}>
//                 {employee.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="modal-field">
//           <label htmlFor="submitterid" className="block text-sm font-semibold text-gray-700 mb-1">
//             Submitter
//           </label>
//           <select
//             id="submitterid"
//             name="submitterid"
//             value={formData.submitterid || ""}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             <option value="">Select Submitter</option>
//             {employees.map((employee) => (
//               <option key={employee.id} value={employee.id}>
//                 {employee.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="modal-field">
//           <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1">
//             Status
//           </label>
//           <select
//             id="status"
//             name="status"
//             value={formData.status || ""}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             <option value="">None</option>
//             <option value="To Do">To Do</option>
//             <option value="Inprogress">Inprogress</option>
//             <option value="Suspended">Suspended</option>
//             <option value="Closed">Closed</option>
//           </select>
//         </div>
//         <div className="modal-field">
//           <label htmlFor="locationpreference" className="block text-sm font-semibold text-gray-700 mb-1">
//             Location Preference
//           </label>
//           <input
//             type="text"
//             id="locationpreference"
//             name="locationpreference"
//             value={formData.locationpreference || ""}
//             onChange={handleChange}
//             placeholder="Location Preference"
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>
//         <div className="modal-field">
//           <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-1">
//             Property
//           </label>
//           <select
//             id="priority"
//             name="priority"
//             value={formData.priority || ""}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             <option value="">None</option>
//             <option value="P1">P1</option>
//             <option value="P2">P2</option>
//             <option value="P3">P3</option>
//             <option value="P4">P4</option>
//             <option value="P5">P5</option>
//           </select>
//         </div>
//         <div className="modal-field">
//           <label htmlFor="technology" className="block text-sm font-semibold text-gray-700 mb-1">
//             Technology
//           </label>
//           <select
//             id="technology"
//             name="technology"
//             value={formData.technology || ""}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             <option value="">None</option>
//             <option value="QA">QA</option>
//             <option value="UI">UI</option>
//             <option value="ML">ML</option>
//           </select>
//         </div>
//         <div className="modal-field">
//           <label htmlFor="resumeid" className="block text-sm font-semibold text-gray-700 mb-1">
//             Resume Id
//           </label>
//           <input
//             type="text"
//             id="resumeid"
//             name="resumeid"
//             value={formData.resumeid || ""}
//             onChange={handleChange}
//             placeholder="Resume Id"
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>
//         <div className="modal-field">
//           <label htmlFor="minrate" className="block text-sm font-semibold text-gray-700 mb-1">
//             Rate
//           </label>
//           <input
//             type="text"
//             id="minrate"
//             name="minrate"
//             value={formData.minrate || ""}
//             onChange={handleChange}
//             placeholder="Rate"
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>
//         <div className="modal-field">
//           <label htmlFor="ipemail" className="block text-sm font-semibold text-gray-700 mb-1">
//             IP Email
//           </label>
//           {loading ? (
//             <select
//               disabled
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-100"
//             >
//               <option>Loading IP emails...</option>
//             </select>
//           ) : (
//             <select
//               id="ipemail"
//               name="ipemail"
//               value={formData.ipemail || ""}
//               onChange={handleChange}
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             >
//               <option value="">Select IP Email</option>
//               {ipEmails.map((email) => (
//                 <option key={email.id} value={email.email}>
//                   {email.email}
//                 </option>
//               ))}
//             </select>
//           )}
//         </div>
//         <div className="modal-field">
//           <label htmlFor="relocation" className="block text-sm font-semibold text-gray-700 mb-1">
//             Relocation
//           </label>
//           <select
//             id="relocation"
//             name="relocation"
//             value={formData.relocation || ""}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             <option value="">Select</option>
//             <option value="Yes">Yes</option>
//             <option value="No">No</option>
//           </select>
//         </div>
//         <div className="modal-field">
//           <label htmlFor="closedate" className="block text-sm font-semibold text-gray-700 mb-1">
//             Close Date
//           </label>
//           <input
//             type="date"
//             id="closedate"
//             name="closedate"
//             value={formData.closedate || ""}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>
//         <div className="modal-field">
//           <label htmlFor="suspensionreason" className="block text-sm font-semibold text-gray-700 mb-1">
//             Reason
//           </label>
//           <select
//             id="suspensionreason"
//             name="suspensionreason"
//             value={formData.suspensionreason || ""}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             <option value="A">Active</option>
//             <option value="B">Break</option>  
//             <option value="D">Discontinued</option>
//             <option value="X">Defaulted</option>
//           </select>
//         </div>
//         <div className="modal-field">
//           <label htmlFor="intro" className="block text-sm font-semibold text-gray-700 mb-1">
//             Intro
//           </label>
//           <textarea
//             id="intro"
//             name="intro"
//             value={formData.intro || ""}
//             onChange={handleChange}
//             placeholder="Intro"
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>
//         <div className="modal-field">
//           <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-1">
//             Notes
//           </label>
//           <textarea
//             id="notes"
//             name="notes"
//             value={formData.notes || ""}
//             onChange={handleChange}
//             placeholder="Notes"
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>
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


// // new-projects-avatar-fullstack/project-avatar-ui/modals/Marketing/CurrentMarketing/EditCandidateMarketing.tsx
// import React, { useEffect, useState } from 'react';
// import Modal from 'react-modal';
// import axios from 'axios';

// interface CandidateMarketing {
//   id: number;
//   mmid: number;
//   instructorid: number;
//   status: string;
//   submitterid: number;
//   priority: string;
//   technology: string;
//   resumeid: number;
//   minrate: number;
//   ipemail: string;
//   relocation: string;
//   closedate: string;
//   suspensionreason: string;
//   intro: string;
//   notes: string;
//   locationpreference: string;
//   skypeid: string;
//   currentlocation: string;
//   yearsofexperience: string;
//   coverletter: string;
//   closedemail: string;
// }

// interface IpEmail {
//   id: number;
//   email: string;
// }

// interface Employee {
//   id: number;
//   name: string;
// }

// interface EditCandidateMarketingModalProps {
//   isOpen: boolean;
//   onRequestClose: () => void;
//   rowData: CandidateMarketing | null;
//   onSave: () => void;
// }

// const EditCandidateMarketingModal: React.FC<EditCandidateMarketingModalProps> = ({
//   isOpen,
//   onRequestClose,
//   rowData,
//   onSave,
// }) => {
//   const [formData, setFormData] = useState<CandidateMarketing | null>(null);
//   const [ipEmails, setIpEmails] = useState<IpEmail[]>([]);
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch both IP emails and employees in parallel
//         const [ipEmailsResponse, employeesResponse] = await Promise.all([
//           axios.get(`${process.env.NEXT_PUBLIC_API_URL}/currentmarketing/ipemails`, {
//             headers: { AuthToken: localStorage.getItem('token') },
//           }),
//           axios.get(`${process.env.NEXT_PUBLIC_API_URL}/currentmarketing/employees`, {
//             headers: { AuthToken: localStorage.getItem('token') },
//           })
//         ]);

//         setIpEmails(ipEmailsResponse.data);
//         setEmployees(employeesResponse.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (rowData) {
//       console.log("Row Data:", rowData);
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
//       if (formData.relocation && formData.relocation !== "Yes" && formData.relocation !== "No") {
//         alert("Relocation field must be 'Yes' or 'No'");
//         return;
//       }

//       // Find employee names based on IDs
//       const manager = employees.find(e => e.id === formData.mmid);
//       const instructor = employees.find(e => e.id === formData.instructorid);
//       const submitter = employees.find(e => e.id === formData.submitterid);

//       const updatedData = {
//         manager_name: manager?.name || "",
//         instructor_name: instructor?.name || "",
//         submitter_name: submitter?.name || "",
//         ipemail: formData.ipemail || "",
//         status: formData.status || "",
//         locationpreference: formData.locationpreference || "",
//         priority: formData.priority || "",
//         technology: formData.technology || "",
//         resumeid: formData.resumeid || 0,
//         minrate: formData.minrate || 0,
//         relocation: formData.relocation || "",
//         closedate: formData.closedate || "",
//         suspensionreason: formData.suspensionreason?.charAt(0).toUpperCase() || null,
//         intro: formData.intro || "",
//         notes: formData.notes || "",
//         skypeid: formData.skypeid || "",
//         currentlocation: formData.currentlocation || ""
//       };

//       try {
//         if (!formData.id || isNaN(formData.id)) {
//           throw new Error("Invalid candidate ID");
//         }
        
//         // const response = await axios.put(
//         //   `${process.env.NEXT_PUBLIC_API_URL}/candidatemarketing/${formData.id}`,
//         //   updatedData,
//         //   {
//         //     headers: { AuthToken: localStorage.getItem('token') },
//         //   }
//         // );

//         const response = await axios.put(
//           `${process.env.NEXT_PUBLIC_API_URL}/candidatemarketing/put/${formData.id}`,
//           updatedData,
//           {
//             headers: { AuthToken: localStorage.getItem('token') },
//           }
//         );

        
//         console.log('Update successful:', response.data);
//         onSave();
//         onRequestClose();
//       } catch (error) {
//         if (axios.isAxiosError(error)) {
//           console.error('Error details:', error.response?.data);
//           alert(`Failed to update candidate: ${error.response?.data?.error || error.message}`);
//         } else {
//           console.error('Error updating candidate marketing:', error);
//           alert('Failed to update candidate. Please try again.');
//         }
//       }
//     }
//   };

//   if (!formData || loading) return ;

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
//         <div className="modal-field">
//           <label htmlFor="mmid" className="block text-sm font-semibold text-gray-700 mb-1">
//             Manager
//           </label>
//           <select
//             id="mmid"
//             name="mmid"
//             value={formData.mmid || ""}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             <option value="">Select Manager</option>
//             {employees.map((employee) => (
//               <option key={employee.id} value={employee.id}>
//                 {employee.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="modal-field">
//           <label htmlFor="instructorid" className="block text-sm font-semibold text-gray-700 mb-1">
//             Instructor
//           </label>
//           <select
//             id="instructorid"
//             name="instructorid"
//             value={formData.instructorid || ""}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             <option value="">Select Instructor</option>
//             {employees.map((employee) => (
//               <option key={employee.id} value={employee.id}>
//                 {employee.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="modal-field">
//           <label htmlFor="submitterid" className="block text-sm font-semibold text-gray-700 mb-1">
//             Submitter
//           </label>
//           <select
//             id="submitterid"
//             name="submitterid"
//             value={formData.submitterid || ""}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             <option value="">Select Submitter</option>
//             {employees.map((employee) => (
//               <option key={employee.id} value={employee.id}>
//                 {employee.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="modal-field">
//           <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1">
//             Status
//           </label>
//           <select
//             id="status"
//             name="status"
//             value={formData.status || ""}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             <option value="">None</option>
//             <option value="To Do">To Do</option>
//             <option value="Inprogress">Inprogress</option>
//             <option value="Suspended">Suspended</option>
//             <option value="Closed">Closed</option>
//           </select>
//         </div>
//         <div className="modal-field">
//           <label htmlFor="locationpreference" className="block text-sm font-semibold text-gray-700 mb-1">
//             Location Preference
//           </label>
//           <input
//             type="text"
//             id="locationpreference"
//             name="locationpreference"
//             value={formData.locationpreference || ""}
//             onChange={handleChange}
//             placeholder="Location Preference"
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>
//         <div className="modal-field">
//           <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-1">
//             Property
//           </label>
//           <select
//             id="priority"
//             name="priority"
//             value={formData.priority || ""}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             <option value="">None</option>
//             <option value="P1">P1</option>
//             <option value="P2">P2</option>
//             <option value="P3">P3</option>
//             <option value="P4">P4</option>
//             <option value="P5">P5</option>
//           </select>
//         </div>
//         <div className="modal-field">
//           <label htmlFor="technology" className="block text-sm font-semibold text-gray-700 mb-1">
//             Technology
//           </label>
//           <select
//             id="technology"
//             name="technology"
//             value={formData.technology || ""}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             <option value="">None</option>
//             <option value="QA">QA</option>
//             <option value="UI">UI</option>
//             <option value="ML">ML</option>
//           </select>
//         </div>
//         <div className="modal-field">
//           <label htmlFor="resumeid" className="block text-sm font-semibold text-gray-700 mb-1">
//             Resume Id
//           </label>
//           <input
//             type="text"
//             id="resumeid"
//             name="resumeid"
//             value={formData.resumeid || ""}
//             onChange={handleChange}
//             placeholder="Resume Id"
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>
//         <div className="modal-field">
//           <label htmlFor="minrate" className="block text-sm font-semibold text-gray-700 mb-1">
//             Rate
//           </label>
//           <input
//             type="text"
//             id="minrate"
//             name="minrate"
//             value={formData.minrate || ""}
//             onChange={handleChange}
//             placeholder="Rate"
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>
//         <div className="modal-field">
//           <label htmlFor="ipemail" className="block text-sm font-semibold text-gray-700 mb-1">
//             IP Email
//           </label>
//           <select
//             id="ipemail"
//             name="ipemail"
//             value={formData.ipemail || ""}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             <option value="">Select IP Email</option>
//             {ipEmails.map((email) => (
//               <option key={email.id} value={email.email}>
//                 {email.email}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="modal-field">
//           <label htmlFor="relocation" className="block text-sm font-semibold text-gray-700 mb-1">
//             Relocation
//           </label>
//           <select
//             id="relocation"
//             name="relocation"
//             value={formData.relocation || ""}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             <option value="">Select</option>
//             <option value="Yes">Yes</option>
//             <option value="No">No</option>
//           </select>
//         </div>
//         <div className="modal-field">
//           <label htmlFor="closedate" className="block text-sm font-semibold text-gray-700 mb-1">
//             Close Date
//           </label>
//           <input
//             type="date"
//             id="closedate"
//             name="closedate"
//             value={formData.closedate || ""}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>
//         <div className="modal-field">
//           <label htmlFor="suspensionreason" className="block text-sm font-semibold text-gray-700 mb-1">
//             Reason
//           </label>
//           <select
//             id="suspensionreason"
//             name="suspensionreason"
//             value={formData.suspensionreason || ""}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             <option value="A">Active</option>
//             <option value="B">Break</option>  
//             <option value="D">Discontinued</option>
//             <option value="X">Defaulted</option>
//           </select>
//         </div>
//         <div className="modal-field">
//           <label htmlFor="intro" className="block text-sm font-semibold text-gray-700 mb-1">
//             Intro
//           </label>
//           <textarea
//             id="intro"
//             name="intro"
//             value={formData.intro || ""}
//             onChange={handleChange}
//             placeholder="Intro"
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>
//         <div className="modal-field">
//           <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-1">
//             Notes
//           </label>
//           <textarea
//             id="notes"
//             name="notes"
//             value={formData.notes || ""}
//             onChange={handleChange}
//             placeholder="Notes"
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>
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
  id: number;
  manager_name: string;
  instructor_name: string;
  submitter_name: string;
  status: string;
  locationpreference: string;
  priority: string;
  technology: string;
  resumeid: number;
  minrate: number;
  ipemail: string;
  relocation: string;
  closedate: string;
  suspensionreason: string;
  intro: string;
  notes: string;
  skypeid: string;
  currentlocation: string;
}

interface Employee {
  name: string;

}

interface IpEmail {
  email: string;
  
}

interface EditCandidateMarketingModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  rowData: CandidateMarketing | null;
  onSave: () => void;
  employees: Employee[];
}

const EditCandidateMarketingModal: React.FC<EditCandidateMarketingModalProps> = ({
  isOpen,
  onRequestClose,
  rowData,
  onSave,
  employees,
}) => {
  const [formData, setFormData] = useState<CandidateMarketing>({
    id: 0,
    manager_name: '',
    instructor_name: '',
    submitter_name: '',
    status: '',
    locationpreference: '',
    priority: '',
    technology: '',
    resumeid: 0,
    minrate: 0,
    ipemail: '',
    relocation: '',
    closedate: '',
    suspensionreason: '',
    intro: '',
    notes: '',
    skypeid: '',
    currentlocation: '',
  });
  const [ipEmails, setIpEmails] = useState<IpEmail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchIpEmails = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/currentmarketing/ipemails`, {
          headers: { AuthToken: localStorage.getItem('token') },
        });
        setIpEmails(response.data);
      } catch (error) {
        console.error('Error fetching IP emails:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIpEmails();
  }, []);

  useEffect(() => {
    if (rowData) {
      setFormData({
        ...rowData,
        manager_name: rowData.manager_name || '',
        instructor_name: rowData.instructor_name || '',
        submitter_name: rowData.submitter_name || '',
      });
    }
  }, [rowData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.relocation && !['Yes', 'No'].includes(formData.relocation)) {
      alert("Relocation field must be 'Yes' or 'No'");
      return;
    }

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/candidatemarketing/put/${formData.id}`,
        {
          manager_name: formData.manager_name,
          instructor_name: formData.instructor_name,
          submitter_name: formData.submitter_name,
          status: formData.status,
          locationpreference: formData.locationpreference,
          priority: formData.priority,
          technology: formData.technology,
          resumeid: formData.resumeid,
          minrate: formData.minrate,
          ipemail: formData.ipemail,
          relocation: formData.relocation,
          closedate: formData.closedate,
          suspensionreason: formData.suspensionreason,
          intro: formData.intro,
          notes: formData.notes,
          skypeid: formData.skypeid,
          currentlocation: formData.currentlocation,
        },
        {
          headers: { AuthToken: localStorage.getItem('token') },
        }
      );
      
      onSave();
      onRequestClose();
    } catch (error) {
      console.error('Error updating candidate:', error);
      alert('Failed to update candidate. Please try again.');
    }
  };

  if (loading) return <div></div>;
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: '900px',
          maxHeight: '90vh',
          padding: '20px',
          borderRadius: '8px',
          overflow: 'auto',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      ariaHideApp={false}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Edit Candidate Marketing</h2>
        <button
          onClick={onRequestClose}
          className="text-2xl font-semibold text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Manager */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
            <select
              name="manager_name"
              value={formData.manager_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Manager</option>
              {employees.map(emp => (
                <option key={`manager-${emp.id}`} value={emp.name}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Instructor */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
            <select
              name="instructor_name"
              value={formData.instructor_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Instructor</option>
              {employees.map(emp => (
                <option key={`instructor-${emp.id}`} value={emp.name}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submitter */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Submitter</label>
            <select
              name="submitter_name"
              value={formData.submitter_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Submitter</option>
              {employees.map(emp => (
                <option key={`submitter-${emp.id}`} value={emp.name}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">None</option>
              <option value="To Do">To Do</option>
              <option value="Inprogress">Inprogress</option>
              <option value="Suspended">Suspended</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Location Preference */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Location Preference</label>
            <input
              type="text"
              name="locationpreference"
              value={formData.locationpreference}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Priority */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">None</option>
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
              <option value="P4">P4</option>
              <option value="P5">P5</option>
            </select>
          </div>

          {/* Technology */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Technology</label>
            <select
              name="technology"
              value={formData.technology}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">None</option>
              <option value="QA">QA</option>
              <option value="UI">UI</option>
              <option value="ML">ML</option>
            </select>
          </div>

          {/* Resume ID */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Resume ID</label>
            <input
              type="number"
              name="resumeid"
              value={formData.resumeid}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Min Rate */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Rate</label>
            <input
              type="number"
              name="minrate"
              value={formData.minrate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* IP Email */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">IP Email</label>
            <select
              name="ipemail"
              value={formData.ipemail}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select IP Email</option>
              {ipEmails.map((email) => (
                <option key={email.email} value={email.email}>
                  {email.email}
                </option>
              ))}
            </select>
          </div>

          {/* Relocation */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Relocation</label>
            <select
              name="relocation"
              value={formData.relocation}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* Close Date */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Close Date</label>
            <input
              type="date"
              name="closedate"
              value={formData.closedate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Suspension Reason */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Suspension Reason</label>
            <select
              name="suspensionreason"
              value={formData.suspensionreason}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="A">Active</option>
              <option value="B">Break</option>
              <option value="D">Discontinued</option>
              <option value="X">Defaulted</option>
            </select>
          </div>

          {/* Current Location */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
            <input
              type="text"
              name="currentlocation"
              value={formData.currentlocation}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Skype ID */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Skype ID</label>
            <input
              type="text"
              name="skypeid"
              value={formData.skypeid}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Intro */}
        <div className="modal-field">
          <label className="block text-sm font-medium text-gray-700 mb-1">Intro</label>
          <textarea
            name="intro"
            value={formData.intro}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={3}
          />
        </div>

        {/* Notes */}
        <div className="modal-field">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={3}
          />
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={onRequestClose}
            className="px-4 py-2 mr-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditCandidateMarketingModal;
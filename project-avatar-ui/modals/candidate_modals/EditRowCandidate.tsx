// import React, { useEffect, useState } from 'react';
// import Modal from 'react-modal';
// import axios from 'axios';
// import { Candidate } from '../types/index'; // Adjust the import path accordingly

// interface EditRowCandidateProps {
//   isOpen: boolean;
//   onRequestClose: () => void;
//   rowData: Candidate | null;
//   onSave: () => void;
// }

// const EditRowCandidate: React.FC<EditRowCandidateProps> = ({ isOpen, onRequestClose, rowData, onSave }) => {
//   const [formData, setFormData] = useState<Candidate>({
//     candidateid: rowData?.candidateid,
//     name: rowData?.name,
//     enrolleddate: rowData?.enrolleddate,
//     email: rowData?.email,
//     course: rowData?.course || 'ML', // Default to ML
//     phone: rowData?.phone,
//     status: rowData?.status || 'inactive', // Default to inactive
//     workstatus: rowData?.workstatus || 'select', // Default to select
//     education: rowData?.education,
//     workexperience: rowData?.workexperience,
//     ssn: rowData?.ssn,
//     agreement: rowData?.agreement === true ? 'Y' : 'N', // Default to N
//     promissory: rowData?.promissory,
//     driverslicense: rowData?.driverslicense === true ? 'Y' : 'N', // Default to N
//     workpermit: rowData?.workpermit === true ? 'Y' : 'N', // Default to N
//     wpexpirationdate: rowData?.wpexpirationdate,
//     offerletter: rowData?.offerletter,
//     secondaryemail: rowData?.secondaryemail,
//     secondaryphone: rowData?.secondaryphone,
//     address: rowData?.address,
//     city: rowData?.city,
//     state: rowData?.state,
//     country: rowData?.country,
//     zip: rowData?.zip,
//     linkedin: rowData?.linkedin,
//     dob: rowData?.dob,
//     emergcontactphone: rowData?.emergcontactphone,
//     ssnvalidated: rowData?.ssnvalidated,
//     bgv: rowData?.bgv,
//     term: rowData?.term,
//     feepaid: rowData?.feepaid,
//     feedue: rowData?.feedue,
//     salary0: rowData?.salary0,
//     salary6: rowData?.salary6,
//     salary12: rowData?.salary12,
//     guarantorname: rowData?.guarantorname,
//     guarantordesignation: rowData?.guarantordesignation,
//     guarantorcompany: rowData?.guarantorcompany,
//     contracturl: rowData?.contracturl,
//     empagreementurl: rowData?.empagreementurl,
//     offerletterurl: rowData?.offerletterurl,
//     workpermiturl: rowData?.workpermiturl,
//     referralid: rowData?.referralid,
//     portalid: rowData?.portalid,
//     avatarid: rowData?.avatarid,
//     notes: rowData?.notes,
//     batchname: rowData?.batchname, // Add default value if batchname is undefined
//   });

//   const [batchNames, setBatchNames] = useState<string[]>([]);

//   useEffect(() => {
//     if (rowData) {
//       setFormData({
//         candidateid: rowData.candidateid,
//         name: rowData.name,
//         enrolleddate: rowData.enrolleddate,
//         email: rowData.email,
//         course: rowData.course || 'ML',
//         phone: rowData.phone,
//         status: rowData.status || 'inactive',
//         workstatus: rowData.workstatus || 'select',
//         education: rowData.education,
//         workexperience: rowData.workexperience,
//         ssn: rowData.ssn,
//         agreement: rowData.agreement === true ? 'Y' : 'N',
//         promissory: rowData.promissory,
//         driverslicense: rowData.driverslicense === true ? 'Y' : 'N',
//         workpermit: rowData.workpermit === true ? 'Y' : 'N',
//         wpexpirationdate: rowData.wpexpirationdate,
//         offerletter: rowData.offerletter,
//         secondaryemail: rowData.secondaryemail,
//         secondaryphone: rowData.secondaryphone,
//         address: rowData.address,
//         city: rowData.city,
//         state: rowData.state,
//         country: rowData.country,
//         zip: rowData.zip,
//         linkedin: rowData.linkedin,
//         dob: rowData.dob,
//         emergcontactphone: rowData.emergcontactphone,
//         ssnvalidated: rowData.ssnvalidated,
//         bgv: rowData.bgv,
//         term: rowData.term,
//         feepaid: rowData.feepaid,
//         feedue: rowData.feedue,
//         salary0: rowData.salary0,
//         salary6: rowData.salary6,
//         salary12: rowData.salary12,
//         guarantorname: rowData.guarantorname,
//         guarantordesignation: rowData.guarantordesignation,
//         guarantorcompany: rowData.guarantorcompany,
//         contracturl: rowData.contracturl,
//         empagreementurl: rowData.empagreementurl,
//         offerletterurl: rowData.offerletterurl,
//         workpermiturl: rowData.workpermiturl,
//         referralid: rowData.referralid,
//         portalid: rowData.portalid,
//         avatarid: rowData.avatarid,
//         notes: rowData.notes,
//         batchname: rowData.batchname,
//       });
//     }

//     // Fetch batch names from the batch table
//     axios.get(`${process.env.NEXT_PUBLIC_API_URL}/batches`)
//       .then(response => {
//         setBatchNames(response.data.map((batch: { batchname: string }) => batch.batchname));
//       })
//       .catch(error => {
//         console.error('Error fetching batch names:', error);
//       });
//   }, [rowData]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/candidates/update/${formData.candidateid}`, formData, {
//         headers: { AuthToken: localStorage.getItem('token') },
//       });
//       onSave();
//       onRequestClose();
//     } catch (error) {
//       console.error('Error updating candidate:', error);
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
//           boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
//         },
//         overlay: {
//           backgroundColor: 'rgba(0, 0, 0, 0.4)',
//         },
//       }}
//     >
//       <div className="relative">
//         <button
//           onClick={onRequestClose}
//           className="absolute top-4 right-0 text-2xl font-semibold text-gray-500 hover:text-gray-800 transition duration-200">
//           &times;
//         </button>
//       </div>
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Candidate</h2>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {Object.keys(formData).map((key) => (
//           <div key={key} className="modal-field">
//             <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-2">
//               {key.charAt(0).toUpperCase() + key.slice(1)}
//             </label>
//             {key === 'course' && (
//               <select
//                 id={key}
//                 name={key}
//                 value={formData[key as keyof Candidate]}
//                 onChange={handleChange}
//                 className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               >
//                 <option value="QA">QA</option>
//                 <option value="UI">UI</option>
//                 <option value="ML">ML</option>
//               </select>
//             )}

//             {key === 'status' && (
//               <select
//                 id={key}
//                 name={key}
//                 value={formData[key as keyof Candidate]}
//                 onChange={handleChange}
//                 className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               >
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//                 <option value="break">Break</option>
//                 <option value="marketing">Marketing</option>
//                 <option value="placed">Placed</option>
//                 <option value="completed">Completed</option>
//                 <option value="discontinued">Discontinued</option>
//               </select>
//             )}
//             {key === 'workstatus' && (
//               <select
//                 id={key}
//                 name={key}
//                 value={formData[key as keyof Candidate]}
//                 onChange={handleChange}
//                 className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               >
//                 <option value="select">Select</option>
//                 <option value="citizen">Citizen</option>
//                 <option value="none">None</option>
//                 <option value="GC">GC</option>
//                 <option value="H4">H4</option>
//                 <option value="OPT">OPT</option>
//                 <option value="L1">L1</option>
//                 <option value="L2">L2</option>
//                 <option value="GC EAD">GC EAD</option>
//                 <option value="F1">F1</option>
//                 <option value="H4 EAD">H4 EAD</option>
//               </select>
//             )}
//             {key === 'agreement' && (
//               <select
//                 id={key}
//                 name={key}
//                 value={formData[key as keyof Candidate]}
//                 onChange={handleChange}
//                 className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               >
//                 <option value="N">N</option>
//                 <option value="Y">Y</option>
//               </select>
//             )}
//             {key === 'driverslicense' && (
//               <select
//                 id={key}
//                 name={key}
//                 value={formData[key as keyof Candidate]}
//                 onChange={handleChange}
//                 className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               >
//                 <option value="N">N</option>
//                 <option value="Y">Y</option>
//               </select>
//             )}
//             {key === 'workpermit' && (
//               <select
//                 id={key}
//                 name={key}
//                 value={formData[key as keyof Candidate]}
//                 onChange={handleChange}
//                 className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               >
//                 <option value="N">N</option>
//                 <option value="Y">Y</option>
//               </select>
//             )}
//             {key === 'wpexpirationdate' && (
//               <input
//                 type="date"
//                 id={key}
//                 name={key}
//                 value={formData[key as keyof Candidate]}
//                 onChange={handleChange}
//                 className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               />
//             )}
//             {!['course',  'status', 'workstatus', 'agreement', 'driverslicense', 'workpermit', 'wpexpirationdate'].includes(key) && (
//               <input
//                 type="text"
//                 id={key}
//                 name={key}
//                 value={formData[key as keyof Candidate]}
//                 onChange={handleChange}
//                 placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
//                 className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               />
//             )}
//           </div>
//         ))}

//         <button
//           type="submit"
//           className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 mb-4">
//           Save Candidate
//         </button>

//         <button
//           type="button"
//           onClick={onRequestClose}
//           className="mt-2 w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition duration-200">
//           Cancel
//         </button>
//       </form>
//     </Modal>
//   );
// };

// export default EditRowCandidate;

// // ----------------added by me @manisai----------------
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";

interface Candidate {
  candidateid: number; // Ensure candidateid is always a string
  name: string;
  enrolleddate: string;
  email: string;
  course: string;
  phone: string;
  status: string;
  workstatus: string;
  education: string;
  workexperience: string;
  ssn: string;
  agreement: string;
  promissory: boolean;
  driverslicense: string;
  workpermit: string;
  wpexpirationdate: string;
  offerletter: string;
  secondaryemail: string;
  secondaryphone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  linkedin: string;
  dob: string;
  emergcontactphone: string;
  ssnvalidated: boolean;
  bgv: boolean;
  term: string;
  feepaid: boolean;
  feedue: number;
  salary0: number;
  salary6: number;
  salary12: number;
  guarantorname: string;
  guarantordesignation: string;
  guarantorcompany: string;
  contracturl: string;
  empagreementurl: string;
  offerletterurl: string;
  workpermiturl: string;
  referralid: string;
  portalid: string;
  avatarid: string;
  notes: string;
  batchname: string;
}

interface EditRowCandidateProps {
  isOpen: boolean;
  onRequestClose: () => void;
  rowData: Candidate; // Ensure rowData is of type Candidate
  onSave: () => void;
}

const EditRowCandidate: React.FC<EditRowCandidateProps> = ({
  isOpen,
  onRequestClose,
  rowData,
  onSave,
}) => {
  const [formData, setFormData] = useState<Candidate>({
    // candidateid: rowData.candidateid || "", // Ensure candidateid is always a string
    candidateid: rowData.candidateid ? Number(rowData.candidateid) : 0,
    name: rowData.name,
    enrolleddate: rowData.enrolleddate,
    email: rowData.email,
    course: rowData.course || "ML",
    phone: rowData.phone,
    status: rowData.status || "inactive",
    workstatus: rowData.workstatus || "select",
    education: rowData.education,
    workexperience: rowData.workexperience,
    ssn: rowData.ssn,
    agreement: rowData.agreement === "Y" ? "Y" : "N",
    promissory: rowData.promissory,
    driverslicense: rowData.driverslicense === "Y" ? "Y" : "N",
    workpermit: rowData.workpermit === "Y" ? "Y" : "N",
    wpexpirationdate: rowData.wpexpirationdate,
    offerletter: rowData.offerletter,
    secondaryemail: rowData.secondaryemail,
    secondaryphone: rowData.secondaryphone,
    address: rowData.address,
    city: rowData.city,
    state: rowData.state,
    country: rowData.country,
    zip: rowData.zip,
    linkedin: rowData.linkedin,
    dob: rowData.dob,
    emergcontactphone: rowData.emergcontactphone,
    ssnvalidated: rowData.ssnvalidated,
    bgv: rowData.bgv,
    term: rowData.term,
    feepaid: rowData.feepaid,
    feedue: rowData.feedue,
    salary0: rowData.salary0,
    salary6: rowData.salary6,
    salary12: rowData.salary12,
    guarantorname: rowData.guarantorname,
    guarantordesignation: rowData.guarantordesignation,
    guarantorcompany: rowData.guarantorcompany,
    contracturl: rowData.contracturl,
    empagreementurl: rowData.empagreementurl,
    offerletterurl: rowData.offerletterurl,
    workpermiturl: rowData.workpermiturl,
    referralid: rowData.referralid,
    portalid: rowData.portalid,
    avatarid: rowData.avatarid,
    notes: rowData.notes,
    batchname: rowData.batchname,
  });

  const [batchNames, setBatchNames] = useState<string[]>([]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      ...rowData,
      course: rowData.course || "ML",
      status: rowData.status || "inactive",
      workstatus: rowData.workstatus || "select",
      agreement: rowData.agreement === "Y" ? "Y" : "N",
      driverslicense: rowData.driverslicense === "Y" ? "Y" : "N",
      workpermit: rowData.workpermit === "Y" ? "Y" : "N",
    }));

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/batchnames`, {
        headers: { AuthToken: localStorage.getItem("token") },
      })
      .then((response) => {
        setBatchNames(response.data.batchNames);
      })
      .catch((error) => {
        console.error("Error fetching batch names:", error);
      });
  }, [rowData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.batchname) {
      alert("Current Batch name is required");
      return;
    }
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/candidates/update/${formData.candidateid}`,
        formData,
        {
          headers: { AuthToken: localStorage.getItem("token") },
        }
      );
      onSave();
      onRequestClose();
    } catch (error) {
      console.error("Error updating candidate:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        content: {
          top: "55%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          transform: "translate(-50%, -50%)",
          maxWidth: "400px",
          width: "90%",
          maxHeight: "80vh",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          overflowY: "auto",
          fontFamily: "Arial, sans-serif",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Edit Candidate</h2>
        <button
          onClick={onRequestClose}
          className="text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
        >
          &times;
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((key) => (
          <div key={key} className="modal-field">
            <label
              htmlFor={key}
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            {key === "batchname" && (
              <select
                id={key}
                name={key}
                value={formData[key as keyof Candidate] as string} // No need to cast to string
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none bg-white"
              >
                <option value="">Select a batch</option>
                {batchNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            )}
            {key === "course" && (
              <select
                id={key}
                name={key}
                value={formData[key as keyof Candidate] as string} // No need to cast to string
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none bg-white"
              >
                <option value="QA">QA</option>
                <option value="UI">UI</option>
                <option value="ML">ML</option>
              </select>
            )}
            {key === "status" && (
              <select
                id={key}
                name={key}
                value={formData[key as keyof Candidate] as string} // No need to cast to string
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none bg-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="break">Break</option>
                <option value="marketing">Marketing</option>
                <option value="placed">Placed</option>
                <option value="completed">Completed</option>
                <option value="discontinued">Discontinued</option>
              </select>
            )}
            {key === "workstatus" && (
              <select
                id={key}
                name={key}
                value={formData[key as keyof Candidate] as string} // No need to cast to string
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none bg-white"
              >
                <option value="select">Select</option>
                <option value="citizen">Citizen</option>
                <option value="none">None</option>
                <option value="GC">GC</option>
                <option value="H4">H4</option>
                <option value="OPT">OPT</option>
                <option value="L1">L1</option>
                <option value="L2">L2</option>
                <option value="GC EAD">GC EAD</option>
                <option value="F1">F1</option>
                <option value="H4 EAD">H4 EAD</option>
              </select>
            )}
            {(key === "agreement" ||
              key === "driverslicense" ||
              key === "workpermit") && (
              <select
                id={key}
                name={key}
                value={formData[key as keyof Candidate] as string} // No need to cast to string
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none bg-white"
              >
                <option value="N">N</option>
                <option value="Y">Y</option>
              </select>
            )}
            {key === "wpexpirationdate" && (
              <input
                type="date"
                id={key}
                name={key}
                value={formData[key as keyof Candidate] as string} // No need to cast to string
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            )}
            {![
              "course",
              "status",
              "workstatus",
              "agreement",
              "driverslicense",
              "workpermit",
              "wpexpirationdate",
              "batchname",
            ].includes(key) && (
              <input
                type="text"
                id={key}
                name={key}
                value={formData[key as keyof Candidate] as string} // No need to cast to string
                onChange={handleChange}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            )}
          </div>
        ))}

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

export default EditRowCandidate;










//________commint by sai______________________

// import React, { useEffect, useState } from "react";
// import Modal from "react-modal";
// import axios from "axios";

// interface Candidate {
//   candidateid: string; // Ensure candidateid is always a string
//   name: string;
//   enrolleddate: string;
//   email: string;
//   course: string;
//   phone: string;
//   status: string;
//   workstatus: string;
//   education: string;
//   workexperience: string;
//   ssn: string;
//   agreement: string;
//   promissory: boolean;
//   driverslicense: string;
//   workpermit: string;
//   wpexpirationdate: string;
//   offerletter: string;
//   secondaryemail: string;
//   secondaryphone: string;
//   address: string;
//   city: string;
//   state: string;
//   country: string;
//   zip: string;
//   linkedin: string;
//   dob: string;
//   emergcontactphone: string;
//   ssnvalidated: boolean;
//   bgv: boolean;
//   term: string;
//   feepaid: boolean;
//   feedue: number;
//   salary0: number;
//   salary6: number;
//   salary12: number;
//   guarantorname: string;
//   guarantordesignation: string;
//   guarantorcompany: string;
//   contracturl: string;
//   empagreementurl: string;
//   offerletterurl: string;
//   workpermiturl: string;
//   referralid: string;
//   portalid: string;
//   avatarid: string;
//   notes: string;
//   batchname: string;
// }

// interface EditRowCandidateProps {
//   isOpen: boolean;
//   onRequestClose: () => void;
//   rowData: Candidate; // Ensure rowData is of type Candidate
//   onSave: () => void;
// }

// const EditRowCandidate: React.FC<EditRowCandidateProps> = ({
//   isOpen,
//   onRequestClose,
//   rowData,
//   onSave,
// }) => {
//   const [formData, setFormData] = useState<Candidate>({
//     candidateid: rowData.candidateid, // Ensure candidateid is always a string
//     name: rowData.name,
//     enrolleddate: rowData.enrolleddate,
//     email: rowData.email,
//     course: rowData.course || "ML",
//     phone: rowData.phone,
//     status: rowData.status || "inactive",
//     workstatus: rowData.workstatus || "select",
//     education: rowData.education,
//     workexperience: rowData.workexperience,
//     ssn: rowData.ssn,
//     agreement: rowData.agreement === "Y" ? "Y" : "N",
//     promissory: rowData.promissory,
//     driverslicense: rowData.driverslicense === "Y" ? "Y" : "N",
//     workpermit: rowData.workpermit === "Y" ? "Y" : "N",
//     wpexpirationdate: rowData.wpexpirationdate,
//     offerletter: rowData.offerletter,
//     secondaryemail: rowData.secondaryemail,
//     secondaryphone: rowData.secondaryphone,
//     address: rowData.address,
//     city: rowData.city,
//     state: rowData.state,
//     country: rowData.country,
//     zip: rowData.zip,
//     linkedin: rowData.linkedin,
//     dob: rowData.dob,
//     emergcontactphone: rowData.emergcontactphone,
//     ssnvalidated: rowData.ssnvalidated,
//     bgv: rowData.bgv,
//     term: rowData.term,
//     feepaid: rowData.feepaid,
//     feedue: rowData.feedue,
//     salary0: rowData.salary0,
//     salary6: rowData.salary6,
//     salary12: rowData.salary12,
//     guarantorname: rowData.guarantorname,
//     guarantordesignation: rowData.guarantordesignation,
//     guarantorcompany: rowData.guarantorcompany,
//     contracturl: rowData.contracturl,
//     empagreementurl: rowData.empagreementurl,
//     offerletterurl: rowData.offerletterurl,
//     workpermiturl: rowData.workpermiturl,
//     referralid: rowData.referralid,
//     portalid: rowData.portalid,
//     avatarid: rowData.avatarid,
//     notes: rowData.notes,
//     batchname: rowData.batchname,
//   });

//   const [batchNames, setBatchNames] = useState<string[]>([]);

//   useEffect(() => {
//     setFormData((prevData) => ({
//       ...prevData,
//       ...rowData,
//       candidateid: rowData.candidateid, // Ensure candidateid is always a string
//       course: rowData.course || "ML",
//       status: rowData.status || "inactive",
//       workstatus: rowData.workstatus || "select",
//       agreement: rowData.agreement === "Y" ? "Y" : "N",
//       driverslicense: rowData.driverslicense === "Y" ? "Y" : "N",
//       workpermit: rowData.workpermit === "Y" ? "Y" : "N",
//     }));

//     axios
//       .get(`${process.env.NEXT_PUBLIC_API_URL}/batchnames`, {
//         headers: { AuthToken: localStorage.getItem("token") },
//       })
//       .then((response) => {
//         setBatchNames(response.data.batchNames);
//       })
//       .catch((error) => {
//         console.error("Error fetching batch names:", error);
//       });
//   }, [rowData]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!formData.batchname) {
//       alert("Current Batch name is required");
//       return;
//     }
//     try {
//       await axios.put(
//         `${process.env.NEXT_PUBLIC_API_URL}/candidates/update/${formData.candidateid}`,
//         formData,
//         {
//           headers: { AuthToken: localStorage.getItem("token") },
//         }
//       );
//       onSave();
//       onRequestClose();
//     } catch (error) {
//       console.error("Error updating candidate:", error);
//     }
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onRequestClose}
//       style={{
//         content: {
//           top: "55%",
//           left: "50%",
//           right: "auto",
//           bottom: "auto",
//           transform: "translate(-50%, -50%)",
//           maxWidth: "400px",
//           width: "90%",
//           maxHeight: "80vh",
//           padding: "24px",
//           borderRadius: "12px",
//           boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
//           overflowY: "auto",
//           fontFamily: "Arial, sans-serif",
//         },
//         overlay: {
//           backgroundColor: "rgba(0, 0, 0, 0.5)",
//         },
//       }}
//     >
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Edit Candidate</h2>
//         <button
//           onClick={onRequestClose}
//           className="text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
//         >
//           &times;
//         </button>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {Object.keys(formData).map((key) => (
//           <div key={key} className="modal-field">
//             <label
//               htmlFor={key}
//               className="block text-sm font-semibold text-gray-700 mb-1"
//             >
//               {key.charAt(0).toUpperCase() + key.slice(1)}
//             </label>
//             {key === "batchname" && (
//               <select
//                 id={key}
//                 name={key}
//                 value={formData[key as keyof Candidate] as string} // No need to cast to string
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none bg-white"
//               >
//                 <option value="">Select a batch</option>
//                 {batchNames.map((name) => (
//                   <option key={name} value={name}>
//                     {name}
//                   </option>
//                 ))}
//               </select>
//             )}
//             {key === "course" && (
//               <select
//                 id={key}
//                 name={key}
//                 value={formData[key as keyof Candidate] as string} // No need to cast to string
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none bg-white"
//               >
//                 <option value="QA">QA</option>
//                 <option value="UI">UI</option>
//                 <option value="ML">ML</option>
//               </select>
//             )}
//             {key === "status" && (
//               <select
//                 id={key}
//                 name={key}
//                 value={formData[key as keyof Candidate] as string} // No need to cast to string
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none bg-white"
//               >
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//                 <option value="break">Break</option>
//                 <option value="marketing">Marketing</option>
//                 <option value="placed">Placed</option>
//                 <option value="completed">Completed</option>
//                 <option value="discontinued">Discontinued</option>
//               </select>
//             )}
//             {key === "workstatus" && (
//               <select
//                 id={key}
//                 name={key}
//                 value={formData[key as keyof Candidate] as string} // No need to cast to string
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none bg-white"
//               >
//                 <option value="select">Select</option>
//                 <option value="citizen">Citizen</option>
//                 <option value="none">None</option>
//                 <option value="GC">GC</option>
//                 <option value="H4">H4</option>
//                 <option value="OPT">OPT</option>
//                 <option value="L1">L1</option>
//                 <option value="L2">L2</option>
//                 <option value="GC EAD">GC EAD</option>
//                 <option value="F1">F1</option>
//                 <option value="H4 EAD">H4 EAD</option>
//               </select>
//             )}
//             {(key === "agreement" ||
//               key === "driverslicense" ||
//               key === "workpermit") && (
//               <select
//                 id={key}
//                 name={key}
//                 value={formData[key as keyof Candidate] as string} // No need to cast to string
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none bg-white"
//               >
//                 <option value="N">N</option>
//                 <option value="Y">Y</option>
//               </select>
//             )}
//             {key === "wpexpirationdate" && (
//               <input
//                 type="date"
//                 id={key}
//                 name={key}
//                 value={formData[key as keyof Candidate] as string} // No need to cast to string
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               />
//             )}
//             {![
//               "course",
//               "status",
//               "workstatus",
//               "agreement",
//               "driverslicense",
//               "workpermit",
//               "wpexpirationdate",
//               "batchname",
//             ].includes(key) && (
//               <input
//                 type="text"
//                 id={key}
//                 name={key}
//                 value={formData[key as keyof Candidate] as string} // No need to cast to string
//                 onChange={handleChange}
//                 placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               />
//             )}
//           </div>
//         ))}

//         <button
//           type="submit"
//           className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm">
//           Save Candidate
//         </button>
//       </form>
//     </Modal>
//   );
// };

// export default EditRowCandidate;

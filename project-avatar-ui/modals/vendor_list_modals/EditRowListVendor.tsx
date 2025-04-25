// import Modal from "react-modal";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { AiOutlineClose } from "react-icons/ai";

// interface Vendor {
//   id: number;
//   name: string;
// }

// interface Recruiter {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
//   designation: string;
//   clientid: number;
//   comp: string;
//   status: string;
//   dob: string;
//   personalemail: string;
//   skypeid: string;
//   linkedin: string;
  
//   twitter: string;
//   facebook: string;
//   review: string;
//   notes: string;
//   employeeid?: string;
//   lastmoddatetime?: string;
// }

// interface EditRowVendorProps {
//   isOpen: boolean;
//   onClose: () => void;
//   initialData: Recruiter;
//   onSubmit: () => void;
// }

// const EditRowVendor: React.FC<EditRowVendorProps> = ({ isOpen, onClose, initialData, onSubmit }) => {
//   const [formData, setFormData] = useState<Recruiter>(initialData);
//   const [vendors, setVendors] = useState<Vendor[]>([]);

//   const reviewOptions = [
//     { value: 'Y', label: 'Yes' },
//     { value: 'N', label: 'No' }
//   ];

//   useEffect(() => {
//     setFormData(initialData);
//     fetchVendors();
//   }, [initialData]);

//   const fetchVendors = async () => {
//     try {
//       const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/recruiters/byVendor/vendors`, {
//         headers: { AuthToken: localStorage.getItem("token") },
//       });
//       setVendors(response.data || []);
//     } catch (error) {
//       console.error("Error fetching vendors:", error);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/recruiters/byAllListVendor/update/${formData.id}`, formData, {
//         headers: { AuthToken: localStorage.getItem("token") },
//       });
//       console.log(response.data.message); // Log success message
//       onSubmit(); // Call onSubmit to refresh data
//       onClose(); // Close modal after successful submission
//     } catch (error) {
//       console.error("Error updating vendor:", error);
//     }
//   };

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
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Vendor</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter name"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter email"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
//           <input
//             type="text"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter phone"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
//           <select
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             <option value="A">Active</option>
//             <option value="I">Inactive</option>
//             <option value="D">Delete</option>
//             <option value="R">Rejected</option>
//             <option value="N">Not Interested</option>
//             <option value="E">Excellent</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Designation</label>
//           <input
//             type="text"
//             name="designation"
//             value={formData.designation}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter designation"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
//           <input
//             type="date"
//             name="dob"
//             value={formData.dob}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter date of birth"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Personal Email</label>
//           <input
//             type="email"
//             name="personalemail"
//             value={formData.personalemail}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter personal email"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Employee ID</label>
//           <input
//             type="text"
//             name="employeeid"
//             value={formData.employeeid || ''}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter employee ID"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Skype ID</label>
//           <input
//             type="text"
//             name="skypeid"
//             value={formData.skypeid}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter Skype ID"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">LinkedIn</label>
//           <input
//             type="url"
//             name="linkedin"
//             value={formData.linkedin}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter LinkedIn URL"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Twitter</label>
//           <input
//             type="text"
//             name="twitter"
//             value={formData.twitter}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter Twitter handle"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Facebook</label>
//           <input
//             type="text"
//             name="facebook"
//             value={formData.facebook}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter Facebook URL"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Review</label>
//           <select
//             name="review"
//             value={formData.review}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             {reviewOptions.map(option => (
//               <option key={option.value} value={option.value}>{option.label}</option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Vendor ID</label>
//           <select
//             name="clientid"
//             value={formData.clientid}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             <option value="">Select Vendor</option>
//             {vendors.map((vendor) => (
//               <option key={vendor.id} value={vendor.id}>
//                 {vendor.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
//           <textarea
//             name="notes"
//             value={formData.notes}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter notes"
//           />
//         </div>

//         <button
//           type="submit"
//           className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
//         >
//           Save Changes
//         </button>
//       </form>
//     </Modal>
//   );
// };

// export default EditRowVendor;







import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";

interface Vendor {
  id: number;
  name: string;
}

interface Recruiter {
  id: number;
  name: string;
  email: string;
  phone: string;
  designation: string;
  clientid: number;
  comp: string;
  status: string;
  dob: string;
  personalemail: string;
  skypeid: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  review: string;
  notes: string;
  employeeid?: string;
  lastmoddatetime?: string;
}

interface EditRowVendorProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: Recruiter;
  onSubmit: () => void;
  type: string; 
}

const EditRowVendor: React.FC<EditRowVendorProps> = ({ isOpen, onClose, initialData, onSubmit }) => {
  const [formData, setFormData] = useState<Recruiter>({
    ...initialData,
    clientid: initialData.clientid || 0 // Ensure clientid exists with default
  });
  const [vendors, setVendors] = useState<Vendor[]>([]);

  const reviewOptions = [
    { value: 'Y', label: 'Yes' },
    { value: 'N', label: 'No' }
  ];

  useEffect(() => {
    setFormData({
      ...initialData,
      clientid: initialData.clientid || 0 // Ensure clientid exists on update
    });
    fetchVendors();
  }, [initialData]);

  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/recruiters/byVendor/vendors`, {
        headers: { AuthToken: localStorage.getItem("token") },
      });
      setVendors(response.data || []);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/recruiters/byAllListVendor/update/${formData.id}`, formData, {
        headers: { AuthToken: localStorage.getItem("token") },
      });
      console.log(response.data.message);
      onSubmit();
      onClose();
    } catch (error) {
      console.error("Error updating vendor:", error);
    }
  };

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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Vendor</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter email"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter phone"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="A">Active</option>
            <option value="I">Inactive</option>
            <option value="D">Delete</option>
            <option value="R">Rejected</option>
            <option value="N">Not Interested</option>
            <option value="E">Excellent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Designation</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter designation"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter date of birth"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Personal Email</label>
          <input
            type="email"
            name="personalemail"
            value={formData.personalemail}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter personal email"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Employee ID</label>
          <input
            type="text"
            name="employeeid"
            value={formData.employeeid || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter employee ID"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Skype ID</label>
          <input
            type="text"
            name="skypeid"
            value={formData.skypeid}
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
            value={formData.linkedin}
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
            value={formData.twitter}
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
            value={formData.facebook}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Facebook URL"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Review</label>
          <select
            name="review"
            value={formData.review}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            {reviewOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Vendor ID</label>
          <select
            name="clientid"
            value={formData.clientid}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="0">Select Vendor</option>
            {vendors.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter notes"
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
        >
          Save Changes
        </button>
      </form>
    </Modal>
  );
};

export default EditRowVendor;
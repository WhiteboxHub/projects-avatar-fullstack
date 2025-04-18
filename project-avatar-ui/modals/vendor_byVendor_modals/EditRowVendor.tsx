// import React, { useState, useEffect } from 'react';
// import Modal from 'react-modal';
// import { AiOutlineClose } from 'react-icons/ai';
// import { Recruiter } from '@/types/byClient';

// interface EditRowRecruiterProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (data: Recruiter) => void;
//   initialData: Recruiter;
// }

// const EditRowRecruiter: React.FC<EditRowRecruiterProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
//   const [formData, setFormData] = useState<Recruiter>(initialData);

//   useEffect(() => {
//     setFormData(initialData);
//   }, [initialData]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(formData);
//     onClose();
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
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Recruiter</h2>

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
//           <input
//             type="text"
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter status"
//           />
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
//             type="number"
//             name="employeeid"
//             value={formData.employeeid}
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
//           <textarea
//             name="review"
//             value={formData.review}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter review"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Vendor ID</label>
//           <input
//             type="number"
//             name="vendorid"
//             value={formData.vendorid}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter vendor ID"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">Client ID</label>
//           <input
//             type="number"
//             name="clientid"
//             value={formData.clientid}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter client ID"
//           />
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

// export default EditRowRecruiter;





import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { AiOutlineClose } from 'react-icons/ai';
import axios from "axios";

interface EditRowRecruiterProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  rowData: any;
}

const EditRowRecruiter: React.FC<EditRowRecruiterProps> = ({ isOpen, onClose, onSubmit, rowData }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    vendorid: '',
    status: '',
    dob: '',
    personalemail: '',
    skypeid: '',
    linkedin: '',
    twitter: '',
    facebook: '',
    review: '',
    notes: '',
  });

  const statusOptions = ['Active', 'Inactive', 'Rejected', 'Deleted', 'Not Interested', 'Excellent'];
  const reviewOptions = ['Y', 'N'];

  useEffect(() => {
    if (rowData) {
      setFormData({
        name: rowData.name || '',
        email: rowData.email || '',
        phone: rowData.phone || '',
        designation: rowData.designation || '',
        vendorid: rowData.vendorid || '',
        status: rowData.status || '',
        dob: rowData.dob || '',
        personalemail: rowData.personalemail || '',
        skypeid: rowData.skypeid || '',
        linkedin: rowData.linkedin || '',
        twitter: rowData.twitter || '',
        facebook: rowData.facebook || '',
        review: rowData.review || '',
        notes: rowData.notes || '',
      });
    }
  }, [rowData]);

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
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/recruiters/byClient/update`, formData, {
        headers: { AuthToken: localStorage.getItem("token") },
      });
      console.log(response.data.message);
      onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error updating recruiter:", error);
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Recruiter</h2>

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
            required
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
            required
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
          <label className="block text-sm font-semibold text-gray-700 mb-1">Vendor ID</label>
          <select
            name="vendorid"
            value={formData.vendorid}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="">Select Vendor ID</option>
            {/* Options will be populated from API */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="">Select Status</option>
            {statusOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Birth Date</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
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
          <label className="block text-sm font-semibold text-gray-700 mb-1">Skype</label>
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
            <option value="">Select Review</option>
            {reviewOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
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
          Update
        </button>
      </form>
    </Modal>
  );
};

export default EditRowRecruiter;
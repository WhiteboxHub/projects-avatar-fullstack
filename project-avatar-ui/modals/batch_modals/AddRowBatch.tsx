import React, { useState } from 'react';
import Modal from 'react-modal';
import ReactModal from 'react-modal';
import { Styles } from 'react-modal';
import axios from 'axios';
import { AiOutlineClose } from 'react-icons/ai';


interface Batch {
  batchname?: string;
  current?: string;
  orientationdate?: string;
  subject?: string;
  startdate?: string;
  enddate?: string;
  exams?: string;
  instructor1?: string;
  instructor2?: string;
  instructor3?: string;
  topicscovered?: string;
  topicsnotcovered?: string;
  lastmoddatetime?: string;
  batchid?: string;
  courseid?: string;
}

interface AddRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  refreshData: () => void;
}

const AddRowModal: React.FC<AddRowModalProps> = ({ isOpen, onClose, refreshData}) => {
  const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
  const [formData, setFormData] = useState<Batch>({
    batchname: '',
    current: 'Y',
    orientationdate: currentDate, // Set default to current date
    subject: 'ML',
    startdate: '',
    enddate: '',
    exams: '',
    instructor1: '',
    instructor2: '',
    instructor3: '',
    topicscovered: '',
    topicsnotcovered: '',
    lastmoddatetime: '',
    batchid: '',
    courseid: '',
  });



// Assuming OverflowY is defined as follows (this is just an example, you should check the actual definition)


// const customStyles: ReactModal.Styles = {
//   content: {
//     top: '50%',
//     left: '50%',
//     right: 'auto',
//     bottom: 'auto',
//     transform: 'translate(-50%, -50%)',
//     overflowY: 'auto' as const, // Explicitly set the type to one of the allowed values // Ensure this is one of the accepted values
//     maxHeight: '80%',
//     width: '80%',
//   },
//};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/batches/insert`, formData, {
        headers: { AuthToken: localStorage.getItem('token') },
      });
      
      // Here, use the newly created batch data for the refreshData
      const newBatch = response.data; // assuming the API returns the new batch
      refreshData(); // Pass the new batch to be added
      onClose();
    } catch (error) {
      console.error('Error adding row:', error);
    }
  };
  
  // -----------*******Existing code************----------------

//   return (

//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose}
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
//       // contentLabel="Add Batch Modal"
//     >
//       <div className="">
//       <div className="relative">
//       <button
//         onClick={onClose}
//         className="absolute top-4 right-0 text-gray-500 hover:text-gray-800 transition duration-200"
//       >
//         <AiOutlineClose size={24} />
//       </button>
//     </div>
//       <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Batch</h2>
   
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Batch Name */}
//           <div>
//             <label className="block text-gray-700">Batch Name</label>
//             <input
//               type="text"
//               name="batchname"
//               value={formData.batchname}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//               placeholder="Enter batch name"
//             />
//           </div>

//           {/* Current */}
//           <div>
//             <label className="block text-gray-700">Current</label>
//             <select
//               name="current"
//               value={formData.current}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//             >
//               <option value="Y">Yes</option>
//               <option value="N">No</option>
//             </select>
//           </div>

//           {/* Orientation Date */}
//           <div>
//             <label className="block text-gray-700">Orientation Date</label>
//             <input
//               type="date"
//               name="orientationdate"
//               value={formData.orientationdate}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//             />
//           </div>
//  {/* Subject */}
//  <div>
//  <label className="block text-gray-700">Subject</label>
//  <select
//    name="subject"
//    value={formData.subject}
//    onChange={handleChange}
//    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//  >
//    <option value="ML">Machine Learning</option>
//    <option value="UI">User Interface</option>
//    <option value="QA">Quality Assurance</option>
//  </select>
// </div>
//           {/* Start Date */}
//           <div>
//             <label className="block text-gray-700">Start Date</label>
//             <input
//               type="date"
//               name="startdate"
//               value={formData.startdate}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//             />
//           </div>

//           {/* End Date */}
//           <div>
//             <label className="block text-gray-700">End Date</label>
//             <input
//               type="date"
//               name="enddate"
//               value={formData.enddate}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//             />
//           </div>

//           {/* Exams */}
//           <div>
//             <label className="block text-gray-700">Exams</label>
//             <input
//               type="text"
//               name="exams"
//               value={formData.exams}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//               placeholder="Enter exams info"
//             />
//           </div>

//           {/* Instructor 1 */}
//           <div>
//             <label className="block text-gray-700">Instructor 1</label>
//             <input
//               type="text"
//               name="instructor1"
//               value={formData.instructor1}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//               placeholder="Enter instructor 1 name"
//             />
//           </div>

//           {/* Instructor 2 */}
//           <div>
//             <label className="block text-gray-700">Instructor 2</label>
//             <input
//               type="text"
//               name="instructor2"
//               value={formData.instructor2}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//               placeholder="Enter instructor 2 name"
//             />
//           </div>

//           {/* Instructor 3 */}
//           <div>
//             <label className="block text-gray-700">Instructor 3</label>
//             <input
//               type="text"
//               name="instructor3"
//               value={formData.instructor3}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//               placeholder="Enter instructor 3 name"
//             />
//           </div>

//           {/* Topics Covered */}
//           <div>
//             <label className="block text-gray-700">Topics Covered</label>
//             <input
//               type="text"
//               name="topicscovered"
//               value={formData.topicscovered}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//               placeholder="Enter topics covered"
//             />
//           </div>

//           {/* Topics Not Covered */}
//           <div>
//             <label className="block text-gray-700">Topics Not Covered</label>
//             <input
//               type="text"
//               name="topicsnotcovered"
//               value={formData.topicsnotcovered}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//               placeholder="Enter topics not covered"
//             />
//           </div>

//           {/* Last Modification Date */}
//           <div>
//             <label className="block text-gray-700">Last Modification Date</label>
//             <input
//               type="date"
//               name="lastmoddatetime"
//               value={formData.lastmoddatetime}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//             />
//           </div>

//           {/* Batch ID */}
//           <div>
//             <label className="block text-gray-700">Batch ID</label>
//             <input
//               type="text"
//               name="batchid"
//               value={formData.batchid}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//               placeholder="Enter batch ID"
//             />
//           </div>

//           {/* Course ID */}
//           <div>
//           <label className="block text-gray-700">Course ID</label>
//           <input
//             type="text"
//             name="courseid"
//             value={formData.courseid}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//             placeholder="Enter course ID"
//             required // Make the input required
//           />
//         </div>
//         <button
//         type="submit"
//         className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
//       >
//         Save Batch
//       </button>

//       <button
//         type="button"
//         onClick={onClose}
//         className="mt-2 w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition duration-200"
//       >
//         Cancel
//       </button>
//           </form>
//       </div>
//     </Modal>
//   );

// ----------------**********new code**********----------------
return (
  <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
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
        onClick={onClose}
        className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
      >
        &times;
      </button>
    </div>
    <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Add New Batch</h2>

    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Batch Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Batch Name</label>
        <input
          type="text"
          name="batchname"
          value={formData.batchname}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          placeholder="Enter batch name"
        />
      </div>

      {/* Current */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Current</label>
        <select
          name="current"
          value={formData.current}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        >
          <option value="Y">Yes</option>
          <option value="N">No</option>
        </select>
      </div>

      {/* Orientation Date */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Orientation Date</label>
        <input
          type="date"
          name="orientationdate"
          value={formData.orientationdate}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        />
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
        <select
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        >
          <option value="ML">Machine Learning</option>
          <option value="UI">User Interface</option>
          <option value="QA">Quality Assurance</option>
        </select>
      </div>

      {/* Start Date */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
        <input
          type="date"
          name="startdate"
          value={formData.startdate}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        />
      </div>

      {/* End Date */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
        <input
          type="date"
          name="enddate"
          value={formData.enddate}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        />
      </div>

      {/* Exams */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Exams</label>
        <input
          type="text"
          name="exams"
          value={formData.exams}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          placeholder="Enter exams info"
        />
      </div>

      {/* Instructor 1 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Instructor 1</label>
        <input
          type="text"
          name="instructor1"
          value={formData.instructor1}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          placeholder="Enter instructor 1 name"
        />
      </div>

      {/* Instructor 2 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Instructor 2</label>
        <input
          type="text"
          name="instructor2"
          value={formData.instructor2}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          placeholder="Enter instructor 2 name"
        />
      </div>

      {/* Instructor 3 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Instructor 3</label>
        <input
          type="text"
          name="instructor3"
          value={formData.instructor3}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          placeholder="Enter instructor 3 name"
        />
      </div>

      {/* Topics Covered */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Topics Covered</label>
        <input
          type="text"
          name="topicscovered"
          value={formData.topicscovered}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          placeholder="Enter topics covered"
        />
      </div>

      {/* Topics Not Covered */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Topics Not Covered</label>
        <input
          type="text"
          name="topicsnotcovered"
          value={formData.topicsnotcovered}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          placeholder="Enter topics not covered"
        />
      </div>

      {/* Last Modification Date */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Last Modification Date</label>
        <input
          type="date"
          name="lastmoddatetime"
          value={formData.lastmoddatetime}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        />
      </div>

      {/* Batch ID */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Batch ID</label>
        <input
          type="text"
          name="batchid"
          value={formData.batchid}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          placeholder="Enter batch ID"
        />
      </div>

      {/* Course ID */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Course ID</label>
        <input
          type="text"
          name="courseid"
          value={formData.courseid}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          placeholder="Enter course ID"
          required
        />
      </div>

      <button
        type="submit"
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
      >
        Save Batch
      </button>
    </form>
  </Modal>
);
};

export default AddRowModal;


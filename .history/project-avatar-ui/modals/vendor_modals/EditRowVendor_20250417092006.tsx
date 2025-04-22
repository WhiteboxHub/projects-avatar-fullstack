// import React, { useState, useEffect } from 'react';
// import Modal from 'react-modal';
// import axios from 'axios';
// import { AiOutlineClose } from 'react-icons/ai';
// import { Vendor } from '../../types/index'; // Import Vendor type

// interface EditRowModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   refreshData: () => void;
//   rowData: Vendor; // Change initialData to rowData
//   onSave: () => Promise<void>;
// }

// const EditRowModal: React.FC<EditRowModalProps> = ({ isOpen, onClose, refreshData, rowData, onSave }) => {
//   const [formData, setFormData] = useState<Vendor>(rowData); // Initialize formData with rowData

//   useEffect(() => {
//     if (rowData) {
//       setFormData(rowData);
//     }
//   }, [rowData]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.id) {
//       console.error('ID is required to update the URL');
//       return;
//     }
//     try {
//       await axios.put(`/api/vendor/${formData.id}`, formData); // Update the endpoint to match the vendor API
//       await onSave();
//       refreshData();
//       onClose();
//     } catch (error) {
//       console.error('Error updating vendor:', error);
//     }
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose}
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
//       <div className="relative">
//         <button
//           onClick={onClose}
//           className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
//         >
//           <AiOutlineClose />
//         </button>
//       </div>
//       <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Edit Vendor</h2> {/* Updated title */}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* ID */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">ID</label>
//           <input
//             type="text"
//             name="id"
//             value={formData.id || ''}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter ID"
//             readOnly
//           />
//         </div>

//         {/* URL */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-1">URL</label>
//           <input
//             type="text"
//             name="url"
//             value={formData.url || ''}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             placeholder="Enter URL"
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

// export default EditRowModal;




import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { AiOutlineClose } from 'react-icons/ai';
import { Vendor } from '../../types/index';

interface EditRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  refreshData: () => void;
  rowData: Vendor;
  onSave: () => Promise<void>;
}

const EditRowModal: React.FC<EditRowModalProps> = ({ isOpen, onClose, refreshData, rowData, onSave }) => {
  const [formData, setFormData] = useState<Vendor>(rowData);

  useEffect(() => {
    if (rowData) {
      setFormData(rowData);
    }
  }, [rowData]);

  const statusOptions = ["Current", "blacklist", "rejectedus", "duplicate"];
  const tierOptions = ["Prime", "level-2", "layers", "bad ugly"];
  const cultureOptions = ["Desi", "american", "russian", "eeropion", "chiness"];
  const yesNoOptions = ["Y", "N"];
  const agreementStatusOptions = ["complete", "not complete", "Not Available"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'minrate' || name === 'totalnetterm' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id) {
      console.error('ID is required to update the URL');
      return;
    }
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/vendors/update`, formData, {
        headers: { AuthToken: localStorage.getItem('token') },
      });
      await onSave();
      refreshData();
      onClose();
    } catch (error) {
      console.error('Error updating vendor:', error);
    }
  };

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
          maxWidth: '800px',
          width: '90%',
          maxHeight: '90vh',
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Edit Vendor</h2>

      <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
     

        {/* Company Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
          <input
            type="text"
            name="companyname"
            value={formData.companyname || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter company name"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status || 'Current'}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
          >
            {statusOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Tier */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tier</label>
          <select
            name="tier"
            value={formData.tier || 'Prime'}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
          >
            {tierOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Culture */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Culture</label>
          <select
            name="culture"
            value={formData.culture || 'Desi'}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
          >
            {cultureOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Solicited */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Solicited</label>
          <select
            name="solicited"
            value={formData.solicited || 'N'}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
          >
            {yesNoOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Rate */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Rate</label>
          <input
            type="number"
            name="minrate"
            value={formData.minrate || 0}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter rate"
            step="0.01"
          />
        </div>

        {/* HBT */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Hire Before Term (HBT)</label>
          <select
            name="hirebeforeterm"
            value={formData.hirebeforeterm || 'N'}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
          >
            {yesNoOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* HAT */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Hire After Term (HAT)</label>
          <select
            name="hireafterterm"
            value={formData.hireafterterm || 'N'}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
          >
            {yesNoOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Late Pay */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Late Pay</label>
          <select
            name="latepayments"
            value={formData.latepayments || 'N'}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
          >
            {yesNoOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Net */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Net</label>
          <input
            type="number"
            name="totalnetterm"
            value={formData.totalnetterm || 0}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter net"
            step="0.01"
          />
        </div>

        {/* Defaulted */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Defaulted</label>
          <select
            name="defaultedpayment"
            value={formData.defaultedpayment || 'N'}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
          >
            {yesNoOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Agr Status */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Agreement Status</label>
          <select
            name="agreementstatus"
            value={formData.agreementstatus || 'complete'}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
          >
            {agreementStatusOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Url */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Url</label>
          <input
            type="url"
            name="url"
            value={formData.url || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter URL"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter email"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter phone"
          />
        </div>

        {/* Fax */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Fax</label>
          <input
            type="tel"
            name="fax"
            value={formData.fax || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter fax"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter address"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
          <input
            type="text"
            name="city"
            value={formData.city || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter city"
          />
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
          <input
            type="text"
            name="state"
            value={formData.state || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter state"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter country"
          />
        </div>

        {/* Zip */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Zip</label>
          <input
            type="text"
            name="zip"
            value={formData.zip || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter zip"
          />
        </div>

        {/* HR Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">HR Name</label>
          <input
            type="text"
            name="hrname"
            value={formData.hrname || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter HR name"
          />
        </div>

        {/* HR Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">HR Email</label>
          <input
            type="email"
            name="hremail"
            value={formData.hremail || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter HR email"
          />
        </div>

        {/* HR Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">HR Phone</label>
          <input
            type="tel"
            name="hrphone"
            value={formData.hrphone || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter HR phone"
          />
        </div>

        {/* Twitter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Twitter</label>
          <input
            type="url"
            name="twitter"
            value={formData.twitter || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Twitter URL"
          />
        </div>

        {/* Facebook */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Facebook</label>
          <input
            type="url"
            name="facebook"
            value={formData.facebook || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Facebook URL"
          />
        </div>

        {/* Linkedin */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Linkedin</label>
          <input
            type="url"
            name="linkedin"
            value={formData.linkedin || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter Linkedin URL"
          />
        </div>

        {/* Acct. No */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Account Number</label>
          <input
            type="text"
            name="accountnumber"
            value={formData.accountnumber || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter account number"
          />
        </div>

        {/* Mgr Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Manager Name</label>
          <input
            type="text"
            name="managername"
            value={formData.managername || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter manager name"
          />
        </div>

        {/* Mgr Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Manager Email</label>
          <input
            type="email"
            name="manageremail"
            value={formData.manageremail || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter manager email"
          />
        </div>

        {/* Mgr Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Manager Phone</label>
          <input
            type="tel"
            name="managerphone"
            value={formData.managerphone || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter manager phone"
          />
        </div>

        {/* Sec Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Secondary Name</label>
          <input
            type="text"
            name="secondaryname"
            value={formData.secondaryname || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter secondary name"
          />
        </div>

        {/* Sec Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Secondary Email</label>
          <input
            type="email"
            name="secondaryemail"
            value={formData.secondaryemail || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter secondary email"
          />
        </div>

        {/* Secondary Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Secondary Phone</label>
          <input
            type="tel"
            name="secondaryphone"
            value={formData.secondaryphone || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter secondary phone"
          />
        </div>

        {/* Time Sheet Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Time Sheet Email</label>
          <input
            type="email"
            name="timsheetemail"
            value={formData.timsheetemail || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter timesheet email"
          />
        </div>

        {/* Agreement Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Agreement Name</label>
          <input
            type="text"
            name="agreementname"
            value={formData.agreementname || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter agreement name"
          />
        </div>

        {/* Agreement Url */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Agreement Url</label>
          <input
            type="url"
            name="agreementlink"
            value={formData.agreementlink || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter agreement URL"
          />
        </div>

        {/* Sub Contractor Url */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Sub Contractor Url</label>
          <input
            type="url"
            name="subcontractorlink"
            value={formData.subcontractorlink || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter subcontractor URL"
          />
        </div>

        {/* NSA Url */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">NSA Url</label>
          <input
            type="url"
            name="nonsolicitationlink"
            value={formData.nonsolicitationlink || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter NSA URL"
          />
        </div>

        {/* Non Hire Url */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Non Hire Url</label>
          <input
            type="url"
            name="nonhirelink"
            value={formData.nonhirelink || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter non hire URL"
          />
        </div>

        {/* Clients */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Clients</label>
          <textarea
            name="clients"
            value={formData.clients || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter clients"
            rows={3}
          />
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter notes"
            rows={3}
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditRowModal;
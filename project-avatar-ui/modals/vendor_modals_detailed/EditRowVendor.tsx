import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";

interface Vendor {
  id: number;
  companyname: string;
}

interface Recruiter {
  id: number;
  name: string;
  email: string;
  phone: string;
  designation: string;
  vendorid: number;
  comp: string; // Matches AG-Grid's "Company" column (field: "comp")
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
  vendors?: Vendor[]; // Make it optional for backward compatibility
}

const EditRowVendor: React.FC<EditRowVendorProps> = ({ 
  isOpen, 
  onClose, 
  initialData, 
  onSubmit,
  vendors: propVendors = [] // Default to empty array if not provided
}) => {
  const [formData, setFormData] = useState<Recruiter>(initialData);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const reviewOptions = [
    { value: 'Y', label: 'Yes' },
    { value: 'N', label: 'No' }
  ];

  const statusOptions = [
    { value: 'A', label: 'Active' },
    { value: 'I', label: 'Inactive' },
    { value: 'D', label: 'Deleted' },
    { value: 'R', label: 'Rejected' },
    { value: 'N', label: 'Not Interested' },
    { value: 'E', label: 'Excellent' }
  ];

  useEffect(() => {
    setFormData(initialData);
    // Add debug logging
    console.log("EditRowVendor received vendors:", propVendors);
    
    // Only fetch vendors if not provided as props
    if (propVendors.length === 0) {
      console.log("No vendors provided as props, fetching them directly");
      fetchVendors();
    } else {
      console.log("Using vendors from props:", propVendors);
      setVendors(propVendors);
    }
  }, [initialData, propVendors]);

  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No auth token found in localStorage");
        return;
      }
      
      console.log("Fetching vendors...");
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/recruiters/byVendor/vendors`, {
        headers: { AuthToken: token },
      });
      
      console.log("Vendor API response:", response.data);
      
      // Transform vendor data to match AG-Grid's "comp" field
      const vendorOptions = response.data.map((vendor: any) => ({
        id: vendor.id,
        companyname: vendor.companyname || vendor.comp || vendor.name || `Vendor ${vendor.id}`
      }));
      
      console.log("Transformed vendors:", vendorOptions);
      setVendors(vendorOptions);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      // If we get an error, at least create a fallback option for the current vendor
      if (formData && formData.vendorid && formData.comp) {
        setVendors([{
          id: formData.vendorid,
          companyname: formData.comp
        }]);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name?.trim()) newErrors.name = "Name is required";
    if (!formData.email?.trim()) newErrors.email = "Email is required";
    if (!formData.phone?.trim()) newErrors.phone = "Phone is required";
    if (!formData.designation?.trim()) newErrors.designation = "Designation is required";
    if (!formData.status) newErrors.status = "Status is required";
    if (formData.vendorid === undefined || formData.vendorid === null) newErrors.vendorid = "Vendor is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        clientid: 0, // As per your backend requirements
      };

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/recruiters/byVendorDetailed/update/${formData.id}`,
        payload,
        { headers: { AuthToken: localStorage.getItem("token") } }
      );
      
      onSubmit();
      onClose();
    } catch (error) {
      console.error("Update error:", error);
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
          maxWidth: '600px',
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
      ariaHideApp={false}
    >
      <div className="relative">
        <button onClick={onClose} className="absolute top-0 right-0 text-2xl text-red-500 hover:text-red-700">
          <AiOutlineClose />
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Recruiter</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter email"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter phone"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Designation <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="designation"
              value={formData.designation || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                errors.designation ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter designation"
            />
            {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Status <span className="text-red-500">*</span></label>
            <select
              name="status"
              value={formData.status || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                errors.status ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Status</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
          </div>

          {/* Vendor Company Dropdown - Matches AG-Grid's "comp" */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Vendor Company <span className="text-red-500">*</span></label>
            <select
              name="vendorid"
              value={formData.vendorid || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                errors.vendorid ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Vendor Company</option>
              {vendors.length > 0 ? (
                vendors.map(vendor => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.companyname} (ID: {vendor.id})
                  </option>
                ))
              ) : (
                <option value="" disabled>Loading vendors...</option>
              )}
            </select>
            {vendors.length === 0 && (
              <p className="text-xs text-orange-500 mt-1">No vendors available. Please refresh the page.</p>
            )}
            {errors.vendorid && <p className="text-red-500 text-xs mt-1">{errors.vendorid}</p>}
          </div>

          {/* Current Company Display (readonly) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Current Company</label>
            <input
              type="text"
              value={formData.comp || 'No vendor assigned'}
              readOnly
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>

          {/* Personal Email */}
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

          {/* Employee ID */}
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

          {/* Skype ID */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Skype ID</label>
            <input
              type="text"
              name="skypeid"
              value={formData.skypeid || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter Skype ID"
            />
          </div>

          {/* LinkedIn */}
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

          {/* Twitter */}
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

          {/* Facebook */}
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

          {/* Review */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Review</label>
            <select
              name="review"
              value={formData.review || 'N'}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            >
              {reviewOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
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
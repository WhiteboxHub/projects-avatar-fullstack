import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import axios, { AxiosError } from 'axios';
import { Employee } from '../../types/index';

interface DropdownOption {
  id: string;
  name: string;
}

interface DropdownOptions {
  managers: DropdownOption[];
  designations: DropdownOption[];
  loginids: DropdownOption[];
}

interface EditEmployeeModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  rowData: Employee | null;
  onSave: () => void;
}

// Extended Employee type to include the UI-specific fields
interface EmployeeFormData extends Employee {
  manager?: string;
  designation?: string;
  loginid_display?: string;
}

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({ isOpen, onRequestClose, rowData, onSave }) => {
  const [formData, setFormData] = useState<EmployeeFormData | null>(null);
  const [dropdownOptions, setDropdownOptions] = useState<DropdownOptions>({
    managers: [],
    designations: [],
    loginids: []
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDropdownOptions();
      if (rowData) {
        // Transform the API data to match our form structure
        setFormData({
          ...rowData,
          manager: rowData.manager_name || '',
          designation: rowData.designation_name || '',
          loginid_display: rowData.login_email || ''
        });
      }
    }
  }, [isOpen, rowData]);

  const fetchDropdownOptions = async () => {
    setIsLoading(true);
    try {
      const [managersRes, designationsRes, loginidsRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/employee/options/managers`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/employee/options/designations`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/employee/options/loginids`)
      ]);

      setDropdownOptions({
        managers: managersRes.data,
        designations: designationsRes.data,
        loginids: loginidsRes.data
      });
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (formData) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData) return;

    setIsLoading(true);
    try {
      // Transform the form data back to API expected format
      const payload: Record<string, any> = {
        ...formData,
        mgrid: dropdownOptions.managers.find(m => m.name === formData.manager)?.id || null,
        designationid: dropdownOptions.designations.find(d => d.name === formData.designation)?.id || null,
        loginid: dropdownOptions.loginids.find(l => l.name === formData.loginid_display)?.id || null,
        commission: formData.commission === 'Y', // Convert commission to boolean
        startdate: formData.startdate || null, // Ensure date fields are in the correct format
        dob: formData.dob || null,
        enddate: formData.enddate || null,
      };

      // Remove UI-specific fields that shouldn't be sent to the API
      delete payload.manager;
      delete payload.designation;
      delete payload.loginid_display;
      delete payload.manager_name;
      delete payload.designation_name;
      delete payload.login_email;

      // Remove any undefined or null values to avoid validation errors
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined) {
          delete payload[key];
        }
      });

      // Log the payload to verify its structure
      console.log('Payload:', payload);

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/employee/update/${formData.id}`, payload, {
        headers: { AuthToken: localStorage.getItem('token') },
      });
      onSave();
      onRequestClose();
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error updating employee:', 
        axiosError.response ? axiosError.response.data : axiosError.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!formData) return null;

  // Fixed dropdown options
  const statusOptions = ["", "Active", "Fired", "Discontinued", "Break"];
  const typeOptions = ["", "Full Time", "Part Time"];
  const commissionOptions = ["N", "Y"];

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
          maxWidth: '600px',
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
          onClick={onRequestClose}
          className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
        >
          &times;
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Edit Employee</h2>

      {isLoading && !dropdownOptions.managers.length ? (
        <div className="text-center py-4">Loading options...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
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
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>
                    {option || 'Select Status'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                name="startdate"
                value={formData.startdate || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Manager</label>
              <select
                name="manager"
                value={formData.manager || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                <option value="">Select Manager</option>
                {dropdownOptions.managers.map(manager => (
                  <option key={manager.id} value={manager.name}>
                    {manager.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Designation</label>
              <select
                name="designation"
                value={formData.designation || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                <option value="">Select Designation</option>
                {dropdownOptions.designations.map(designation => (
                  <option key={designation.id} value={designation.name}>
                    {designation.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Login ID (Email)</label>
              <select
                name="loginid_display"
                value={formData.loginid_display || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                <option value="">Select Login Email</option>
                {dropdownOptions.loginids.map(login => (
                  <option key={login.id} value={login.name}>
                    {login.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Additional Fields */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Personal Email</label>
              <input
                type="email"
                name="personalemail"
                value={formData.personalemail || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Personal Phone</label>
              <input
                type="text"
                name="personalphone"
                value={formData.personalphone || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
              <select
                name="type"
                value={formData.type || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                {typeOptions.map(option => (
                  <option key={option} value={option}>
                    {option || 'Select Type'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Commission</label>
              <select
                name="commission"
                value={formData.commission || 'N'}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                {commissionOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Commission Rate</label>
              <input
                type="text"
                name="commissionrate"
                value={formData.commissionrate || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm disabled:bg-blue-400"
            >
              {isLoading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default EditEmployeeModal;

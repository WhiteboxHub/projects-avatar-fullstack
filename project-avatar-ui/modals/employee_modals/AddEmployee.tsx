import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  status?: string;
  startdate?: string;
  manager?: string; // Will store manager name
  designation?: string; // Will store designation name
  personalemail?: string;
  personalphone?: string;
  dob?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  skypeid?: string;
  salary?: string;
  commission?: string;
  commissionrate?: string;
  type?: string;
  empagreementurl?: string;
  offerletterurl?: string;
  dlurl?: string;
  workpermiturl?: string;
  contracturl?: string;
  enddate?: string;
  loginid?: string; // Will store login email
  responsibilities?: string;
  notes?: string;
}

interface DropdownOption {
  id: string;
  name: string;
}

interface DropdownOptions {
  managers: DropdownOption[];
  designations: DropdownOption[];
  loginids: DropdownOption[];
}

interface AddEmployeeModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSave: () => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onRequestClose, onSave }) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    email: '',
    phone: '',
    status: '',
    startdate: '',
    manager: '',
    designation: '',
    personalemail: '',
    personalphone: '',
    dob: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zip: '',
    skypeid: '',
    salary: '',
    commission: 'N',
    commissionrate: '',
    type: '',
    empagreementurl: '',
    offerletterurl: '',
    dlurl: '',
    workpermiturl: '',
    contracturl: '',
    enddate: '',
    loginid: '',
    responsibilities: '',
    notes: '',
  });

  const [dropdownOptions, setDropdownOptions] = useState<DropdownOptions>({
    managers: [],
    designations: [],
    loginids: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchDropdownOptions();
    }
  }, [isOpen]);

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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    try {
      // Transform the form data to match API expectations
      const payload = {
        ...formData,
        mgrid: formData.manager ? parseInt(dropdownOptions.managers.find(m => m.name === formData.manager)?.id || '0') : undefined,
        designationid: formData.designation ? parseInt(dropdownOptions.designations.find(d => d.name === formData.designation)?.id || '0') : undefined,
        loginid: formData.loginid ? parseInt(dropdownOptions.loginids.find(l => l.name === formData.loginid)?.id || '0') : undefined,
        commission: formData.commission === 'Y', // Convert commission to boolean
        startdate: formData.startdate || null, // Ensure date fields are in the correct format
        dob: formData.dob || null,
        enddate: formData.enddate || null,
        salary: formData.salary ? parseFloat(formData.salary) : undefined,
        commissionrate: formData.commissionrate ? parseFloat(formData.commissionrate) : undefined,
      };

      // Remove undefined values
      Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

      console.log('Request Payload:', payload); // Log the request payload

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/employee/create`, payload, {
        headers: { AuthToken: localStorage.getItem('token') },
      });

      console.log('Employee added successfully:', response.data);
      onSave();
      onRequestClose();
      setFormData({
        name: '',
        email: '',
        phone: '',
        status: '',
        startdate: '',
        manager: '',
        designation: '',
        personalemail: '',
        personalphone: '',
        dob: '',
        address: '',
        city: '',
        state: '',
        country: '',
        zip: '',
        skypeid: '',
        salary: '',
        commission: 'N',
        commissionrate: '',
        type: '',
        empagreementurl: '',
        offerletterurl: '',
        dlurl: '',
        workpermiturl: '',
        contracturl: '',
        enddate: '',
        loginid: '',
        responsibilities: '',
        notes: '',
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorDetails = error.response?.data?.detail || [];
        console.error('Error adding employee:', errorDetails);
        setErrors(errorDetails.map((err: { msg: string }) => err.msg)); // Extract the error messages
      } else {
        console.error('Unexpected error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

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
      <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Add New Employee</h2>

      {errors.length > 0 && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {isLoading && !dropdownOptions.managers.length ? (
        <div className="text-center py-4">Loading options...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
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
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone*</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
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
                value={formData.startdate}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Manager</label>
              <select
                name="manager"
                value={formData.manager}
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
                value={formData.designation}
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
                name="loginid"
                value={formData.loginid}
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
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Personal Email</label>
              <input
                type="email"
                name="personalemail"
                value={formData.personalemail}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Personal Phone</label>
              <input
                type="text"
                name="personalphone"
                value={formData.personalphone}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
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
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
              <select
                name="type"
                value={formData.type}
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
                value={formData.commission}
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
                value={formData.commissionrate}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Salary</label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Zip</label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
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
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Employment Agreement URL</label>
              <input
                type="text"
                name="empagreementurl"
                value={formData.empagreementurl}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Offer Letter URL</label>
              <input
                type="text"
                name="offerletterurl"
                value={formData.offerletterurl}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">DL URL</label>
              <input
                type="text"
                name="dlurl"
                value={formData.dlurl}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Work Permit URL</label>
              <input
                type="text"
                name="workpermiturl"
                value={formData.workpermiturl}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Contract URL</label>
              <input
                type="text"
                name="contracturl"
                value={formData.contracturl}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Responsibilities</label>
              <input
                type="text"
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
              <input
                type="text"
                name="notes"
                value={formData.notes}
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
              {isLoading ? 'Adding Employee...' : 'Add Employee'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default AddEmployeeModal;

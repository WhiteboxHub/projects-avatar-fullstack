import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";

interface CandidateOption {
  id: number;
  name: string;
  skill: string;
}

interface EmployeeOption {
  id: number;
  name: string;
}

interface MktSubmission {
  id: number;
  submissiondate: string;
  candidateid: number;
  employeeid: number;
  submitter: number;
  email: string;
  phone: string;
  url: string;
  name: string;
  location: string;
  notes: string;
  feedback: string;
}

interface AddRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  refreshData: () => void;
}

const AddRowModal: React.FC<AddRowModalProps> = ({ isOpen, onClose, refreshData }) => {
  const [formData, setFormData] = useState<MktSubmission>({
    id: 0,
    submissiondate: new Date().toISOString().split('T')[0],
    candidateid: 0,
    employeeid: 0,
    submitter: 0,
    email: '',
    phone: '',
    url: '',
    name: '',
    location: '',
    notes: '',
    feedback: '',
  });

  const [candidates, setCandidates] = useState<CandidateOption[]>([]);
  const [marketingManagers, setMarketingManagers] = useState<EmployeeOption[]>([]);
  const [submitters, setSubmitters] = useState<EmployeeOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [candidatesRes, employeesRes] = await Promise.all([
// NEXT_PUBLIC_API_URL=http://localhost:8000/api/admin
axios.get(`${process.env.NEXT_PUBLIC_API_URL}/placements/mkt-submissions/candidates`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/placements/mkt-submissions/employees`)
        ]);

        setCandidates(candidatesRes.data);
        // Same employee list is used for both MM and Submitter
        setMarketingManagers(employeesRes.data);
        setSubmitters(employeesRes.data);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    if (isOpen) {
      fetchDropdownData();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.endsWith('id') ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/placements/mkt-submissions`, formData, {
        headers: { AuthToken: localStorage.getItem('token') }
      });
      refreshData();
      onClose();
    } catch (error) {
      console.error('Error adding submission:', error);
    } finally {
      setLoading(false);
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
          width: '500px',
          maxHeight: '80vh',
          padding: '20px',
          overflowY: 'auto'
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }
      }}
      ariaHideApp={false}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Add Submission</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <AiOutlineClose size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Placement Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Placement Date*</label>
          <input
            type="date"
            name="submissiondate"
            value={formData.submissiondate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Name of the Candidate */}
        <div>
          <label className="block text-sm font-medium mb-1">Name of the Candidate*</label>
          <select
            name="candidateid"
            value={formData.candidateid}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Candidate</option>
            {candidates.map(candidate => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name} ({candidate.skill})
              </option>
            ))}
          </select>
        </div>

        {/* MM (Marketing Manager) */}
        <div>
          <label className="block text-sm font-medium mb-1">MM (Marketing Manager)*</label>
          <select
            name="employeeid"
            value={formData.employeeid}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Marketing Manager</option>
            {marketingManagers.map(manager => (
              <option key={manager.id} value={manager.id}>
                {manager.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submitter */}
        <div>
          <label className="block text-sm font-medium mb-1">Submitter*</label>
          <select
            name="submitter"
            value={formData.submitter}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Submitter</option>
            {submitters.map(submitter => (
              <option key={submitter.id} value={submitter.id}>
                {submitter.name}
              </option>
            ))}
          </select>
        </div>

        {/* Vendor Email ID */}
        <div>
          <label className="block text-sm font-medium mb-1">Vendor Email ID</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Vendor Phone No */}
        <div>
          <label className="block text-sm font-medium mb-1">Vendor Phone No</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Impl.Parther (URL) */}
        <div>
          <label className="block text-sm font-medium mb-1">Impl.Parther</label>
          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Client */}
        <div>
          <label className="block text-sm font-medium mb-1">Client</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <textarea
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        {/* Rate (notes field) */}
        <div>
          <label className="block text-sm font-medium mb-1">Rate</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        {/* Feedback */}
        <div>
          <label className="block text-sm font-medium mb-1">Feedback</label>
          <textarea
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </Modal>
  );
};

export default AddRowModal;
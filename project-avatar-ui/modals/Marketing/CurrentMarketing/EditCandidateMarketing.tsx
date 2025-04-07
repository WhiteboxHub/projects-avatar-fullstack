import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

interface CandidateMarketing {
  id: number;
  mmid: number;
  instructorid: number;
  status: string;
  submitterid: number;
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
  locationpreference: string;
  skypeid: string;
  currentlocation: string;
  yearsofexperience: string;
  coverletter: string;
  closedemail: string;
}

interface IpEmail {
  id: number;
  email: string;
}

interface EditCandidateMarketingModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  rowData: CandidateMarketing | null;
  onSave: () => void;
  employees: { id: number; name: string }[];
}

const EditCandidateMarketingModal: React.FC<EditCandidateMarketingModalProps> = ({
  isOpen,
  onRequestClose,
  rowData,
  onSave,
  employees,
}) => {
  const [formData, setFormData] = useState<CandidateMarketing | null>(null);
  const [ipEmails, setIpEmails] = useState<IpEmail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchIpEmails = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ipemails`, {
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
      console.log("Row Data:", rowData);
      setFormData(rowData);
    }
  }, [rowData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (formData) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData) { 
      if (formData.relocation && formData.relocation !== "Yes" && formData.relocation !== "No") {
        alert("Relocation field must be 'Yes' or 'No'");
        return;
      }

      // Find employee names based on IDs
      const manager = employees.find(e => e.id === formData.mmid);
      const instructor = employees.find(e => e.id === formData.instructorid);
      const submitter = employees.find(e => e.id === formData.submitterid);

      const updatedData = {
        
        manager_name: manager?.name || "",
        instructor_name: instructor?.name || "",
        submitter_name: submitter?.name || "",
        ipemail: formData.ipemail || "",
        status: formData.status || "",
        locationpreference: formData.locationpreference || "",
        priority: formData.priority || "",
        technology: formData.technology || "",
        resumeid: formData.resumeid || 0,
        minrate: formData.minrate || 0,
        relocation: formData.relocation || "",
        closedate: formData.closedate || "",
        suspensionreason: formData.suspensionreason || "",
        intro: formData.intro || "",
        notes: formData.notes || "",
        skypeid: formData.skypeid || "",
        currentlocation: formData.currentlocation || ""
      };

      try {
              // Make sure formData.candidateid is defined and a number
      if (!formData.id || isNaN(formData.id)) {
        throw new Error("Invalid candidate ID");
      }
        // Prepare the data with proper suspension reason
      const submitData = {
        ...formData,
        suspensionreason: formData.suspensionreason?.charAt(0).toUpperCase() || null
      };
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/candidatemarketing/${formData.id}`,
          updatedData,
          {
            headers: { AuthToken: localStorage.getItem('token') },
          }
        );
        console.log('Update successful:', response.data);
        onSave();
        onRequestClose();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error details:', error.response?.data);
          alert(`Failed to update candidate: ${error.response?.data?.error || error.message}`);
        } else {
          console.error('Error updating candidate marketing:', error);
          alert('Failed to update candidate. Please try again.');
        }
      }
    }
  };

  if (!formData) return null;

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 pr-8">Edit Candidate Marketing</h2>
        <button
          onClick={onRequestClose}
          className="text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
        >
          &times;
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="modal-field">
          <label htmlFor="mmid" className="block text-sm font-semibold text-gray-700 mb-1">
            Manager
          </label>
          <select
            id="mmid"
            name="mmid"
            value={formData.mmid || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="">Select Manager</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
        <div className="modal-field">
          <label htmlFor="instructorid" className="block text-sm font-semibold text-gray-700 mb-1">
            Instructor
          </label>
          <select
            id="instructorid"
            name="instructorid"
            value={formData.instructorid || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="">Select Instructor</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
        <div className="modal-field">
          <label htmlFor="submitterid" className="block text-sm font-semibold text-gray-700 mb-1">
            Submitter
          </label>
          <select
            id="submitterid"
            name="submitterid"
            value={formData.submitterid || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="">Select Submitter</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
        <div className="modal-field">
          <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="">None</option>
            <option value="To Do">To Do</option>
            <option value="Inprogress">Inprogress</option>
            <option value="Suspended">Suspended</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        <div className="modal-field">
          <label htmlFor="locationpreference" className="block text-sm font-semibold text-gray-700 mb-1">
            Location Preference
          </label>
          <input
            type="text"
            id="locationpreference"
            name="locationpreference"
            value={formData.locationpreference || ""}
            onChange={handleChange}
            placeholder="Location Preference"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>
        <div className="modal-field">
          <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-1">
            Property
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="">None</option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
            <option value="P4">P4</option>
            <option value="P5">P5</option>
          </select>
        </div>
        <div className="modal-field">
          <label htmlFor="technology" className="block text-sm font-semibold text-gray-700 mb-1">
            Technology
          </label>
          <select
            id="technology"
            name="technology"
            value={formData.technology || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="">None</option>
            <option value="QA">QA</option>
            <option value="UI">UI</option>
            <option value="ML">ML</option>
          </select>
        </div>
        <div className="modal-field">
          <label htmlFor="resumeid" className="block text-sm font-semibold text-gray-700 mb-1">
            Resume Id
          </label>
          <input
            type="text"
            id="resumeid"
            name="resumeid"
            value={formData.resumeid || ""}
            onChange={handleChange}
            placeholder="Resume Id"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>
        <div className="modal-field">
          <label htmlFor="minrate" className="block text-sm font-semibold text-gray-700 mb-1">
            Rate
          </label>
          <input
            type="text"
            id="minrate"
            name="minrate"
            value={formData.minrate || ""}
            onChange={handleChange}
            placeholder="Rate"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>
        <div className="modal-field">
          <label htmlFor="ipemail" className="block text-sm font-semibold text-gray-700 mb-1">
            IP Email
          </label>
          {loading ? (
            <select
              disabled
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-100"
            >
              <option>Loading IP emails...</option>
            </select>
          ) : (
            <select
              id="ipemail"
              name="ipemail"
              value={formData.ipemail || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            >
              <option value="">Select IP Email</option>
              {ipEmails.map((email) => (
                <option key={email.id} value={email.email}>
                  {email.email}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="modal-field">
          <label htmlFor="relocation" className="block text-sm font-semibold text-gray-700 mb-1">
            Relocation
          </label>
          <select
            id="relocation"
            name="relocation"
            value={formData.relocation || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="modal-field">
          <label htmlFor="closedate" className="block text-sm font-semibold text-gray-700 mb-1">
            Close Date
          </label>
          <input
            type="date"
            id="closedate"
            name="closedate"
            value={formData.closedate || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>
        <div className="modal-field">
          <label htmlFor="suspensionreason" className="block text-sm font-semibold text-gray-700 mb-1">
            Reason
          </label>
          <select
            id="suspensionreason"
            name="suspensionreason"
            value={formData.suspensionreason || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="A">Active</option>
            <option value="B">Break</option>  
            <option value="D">Discontinued</option>
            <option value="X">Defaulted</option>
          </select>
        </div>
        <div className="modal-field">
          <label htmlFor="intro" className="block text-sm font-semibold text-gray-700 mb-1">
            Intro
          </label>
          <textarea
            id="intro"
            name="intro"
            value={formData.intro || ""}
            onChange={handleChange}
            placeholder="Intro"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>
        <div className="modal-field">
          <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes || ""}
            onChange={handleChange}
            placeholder="Notes"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>
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

export default EditCandidateMarketingModal;

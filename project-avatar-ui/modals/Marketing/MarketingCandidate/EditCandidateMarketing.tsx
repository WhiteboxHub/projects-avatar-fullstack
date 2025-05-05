import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CandidateMarketing } from "@/types";

interface Employee {
  id: number;
  name: string;
}

interface IPEmail {
  id: number;
  email: string;
}

interface Resume {
  id: string;
  name: string;
  link?: string;
}

interface EditCandidateMarketingModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  rowData: CandidateMarketing | null;
  onSave: () => void;
  employees: Employee[];
  ipEmails: IPEmail[];
  resumes: Resume[];
}

const EditCandidateMarketingModal: React.FC<EditCandidateMarketingModalProps> = ({
  isOpen,
  onRequestClose,
  rowData,
  onSave,
  employees,
  ipEmails,
  resumes,
}) => {
  const [formData, setFormData] = useState<CandidateMarketing>({
    id: 0,
    candidateid: 0,
    startdate: '',
    ipemail: '',
    coverletter: '',
    closedemail: '',
    yearsofexperience: 0,
    manager_name: '',
    instructor_name: '',
    submitter_name: '',
    status: '',
    locationpreference: '',
    priority: '',
    technology: '',
    resumeid: '',
    minrate: 0,
    relocation: '',
    closedate: '',
    suspensionreason: '',
    intro: '',
    notes: '',
    skypeid: '',
    currentlocation: '',
    ipemailid: 0,
    mmid: 0,
    instructorid: 0,
    submitterid: 0
  });

  useEffect(() => {
    if (rowData) {
      setFormData({
        ...rowData,
        manager_name: rowData.manager_name || '',
        instructor_name: rowData.instructor_name || '',
        submitter_name: rowData.submitter_name || '',
        ipemailid: rowData.ipemailid || 0,
        mmid: rowData.mmid || 0,
        instructorid: rowData.instructorid || 0,
        submitterid: rowData.submitterid || 0,
        status: rowData.status || '',
        resumeid: rowData.resumeid || ''
      });
    }
  }, [rowData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.relocation && !['Yes', 'No'].includes(formData.relocation)) {
      alert("Relocation field must be 'Yes' or 'No'");
      return;
    }

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/candidatemarketing/update/${formData.id}`,
        {
          mmid: formData.mmid,
          instructorid: formData.instructorid,
          submitterid: formData.submitterid,
          status: formData.status,
          locationpreference: formData.locationpreference,
          priority: formData.priority,
          technology: formData.technology,
          resumeid: formData.resumeid,
          minrate: formData.minrate,
          ipemailid: formData.ipemailid,
          relocation: formData.relocation,
          closedate: formData.closedate,
          suspensionreason: formData.suspensionreason,
          intro: formData.intro,
          notes: formData.notes,
          skypeid: formData.skypeid,
          currentlocation: formData.currentlocation,
        },
        {
          headers: { AuthToken: localStorage.getItem('token') },
        }
      );
      
      onSave();
      onRequestClose();
    } catch (error) {
      console.error('Error updating candidate:', error);
      alert('Failed to update candidate. Please try again.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: '900px',
          maxHeight: '90vh',
          padding: '20px',
          borderRadius: '8px',
          overflow: 'auto',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      ariaHideApp={false}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Edit Candidate Marketing</h2>
        <button
          onClick={onRequestClose}
          className="text-2xl font-semibold text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Manager */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Manager <span className="text-red-500">*</span></label>
            <select
              name="mmid"
              value={formData.mmid}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Manager</option>
              {employees && employees.map((emp) => (
                <option key={`manager-${emp.id}`} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Instructor */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Instructor <span className="text-red-500">*</span></label>
            <select
              name="instructorid"
              value={formData.instructorid}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Instructor</option>
              {employees && employees.map((emp) => (
                <option key={`instructor-${emp.id}`} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submitter */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Submitter <span className="text-red-500">*</span></label>
            <select
              name="submitterid"
              value={formData.submitterid}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Submitter</option>
              {employees && employees.map((emp) => (
                <option key={`submitter-${emp.id}`} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status <span className="text-red-500">*</span></label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">None</option>
              <option value="To Do">To Do</option>
              <option value="Inprogress">Inprogress</option>
              <option value="Suspended">Suspended</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Location Preference */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Location Preference</label>
            <input
              type="text"
              name="locationpreference"
              value={formData.locationpreference}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Priority */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority <span className="text-red-500">*</span></label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">None</option>
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
              <option value="P4">P4</option>
              <option value="P5">P5</option>
            </select>
          </div>

          {/* Technology */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Technology <span className="text-red-500">*</span></label>
            <select
              name="technology"
              value={formData.technology}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">None</option>
              <option value="QA">QA</option>
              <option value="UI">UI</option>
              <option value="ML">ML</option>
            </select>
          </div>

          {/* Resume ID */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Resume ID <span className="text-red-500">*</span></label>
            <select
              name="resumeid"
              value={formData.resumeid}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Resume</option>
              {resumes && resumes.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  {resume.name}
                </option>
              ))}
            </select>
          </div>

          {/* Min Rate */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Rate <span className="text-red-500">*</span></label>
            <input
              type="number"
              name="minrate"
              value={formData.minrate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              min="45"
              required
            />
          </div>

          {/* IP Email */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">IP Email <span className="text-red-500">*</span></label>
            <select
              name="ipemailid"
              value={formData.ipemailid}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select IP Email</option>
              {ipEmails && ipEmails.map((email) => (
                <option key={email.id} value={email.id}>
                  {email.email}
                </option>
              ))}
            </select>
          </div>

          {/* Relocation */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Relocation <span className="text-red-500">*</span></label>
            <select
              name="relocation"
              value={formData.relocation}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* Close Date */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Close Date</label>
            <input
              type="date"
              name="closedate"
              value={formData.closedate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Suspension Reason */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Suspension Reason <span className="text-red-500">*</span></label>
            <select
              name="suspensionreason"
              value={formData.suspensionreason}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="A">Active</option>
              <option value="B">Break</option>
              <option value="D">Discontinued</option>
              <option value="X">Defaulted</option>
            </select>
          </div>

          {/* Current Location */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
            <input
              type="text"
              name="currentlocation"
              value={formData.currentlocation}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Skype ID */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Skype ID</label>
            <input
              type="text"
              name="skypeid"
              value={formData.skypeid}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Intro */}
        <div className="modal-field">
          <label className="block text-sm font-medium text-gray-700 mb-1">Intro</label>
          <textarea
            name="intro"
            value={formData.intro}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={3}
          />
        </div>

        {/* Notes */}
        <div className="modal-field">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={3}
          />
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={onRequestClose}
            className="px-4 py-2 mr-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditCandidateMarketingModal;
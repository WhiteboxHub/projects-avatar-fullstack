import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CandidateMarketing } from "@/types";

interface Employee {
  id?: number;
  name: string;
}

interface IpEmail {
  email: string;
}

interface Resume {
  id: number;
  name: string;
}

interface EditCandidateMarketingModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  rowData: CandidateMarketing | null;
  onSave: () => void;
  employees: Employee[];
  resumes: Resume[];
}

const EditCandidateMarketingModal: React.FC<EditCandidateMarketingModalProps> = ({
  isOpen,
  onRequestClose,
  rowData,
  onSave,
  employees,
  resumes,
}) => {
  const [formData, setFormData] = useState<CandidateMarketing>({
    id: 0,
    candidateid: 0,
    startdate: '',
    mmid: 0,
    instructorid: 0,
    status: '',
    submitterid: 0,
    priority: '',
    technology: '',
    resumeid: 0,
    minrate: 0,
    ipemail: '',
    relocation: '',
    closedate: '',
    suspensionreason: '',
    intro: '',
    notes: '',
    skypeid: '',
    currentlocation: '',
    locationpreference: '',
    yearsofexperience: 0,
    coverletter: '',
    closedemail: '',
    ipemailid: 0,
    manager_name: '',
    instructor_name: '',
    submitter_name: '',
  });
  const [ipEmails, setIpEmails] = useState<IpEmail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [previousStatus, setPreviousStatus] = useState<string>('');
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  // Function to normalize status values
  const normalizeStatus = (status: string): string => {
    // Handle status formats like "0-InProgress" or "2-ToDo"
    if (status.includes('-')) {
      const statusPart = status.split('-')[1].trim();
      if (statusPart.toLowerCase() === 'inprogress') return 'Inprogress';
      if (statusPart.toLowerCase() === 'todo') return 'To Do';
      if (statusPart.toLowerCase() === 'closed') return 'Closed';
      if (statusPart.toLowerCase() === 'suspended') return 'Suspended';
      return statusPart;
    }
    return status;
  };

  useEffect(() => {
    const fetchIpEmails = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/currentmarketing/ipemails`, {
          headers: { AuthToken: localStorage.getItem('token') },
        });
        setIpEmails(response.data);
      } catch (error) {
        console.error('Error fetching IP emails:', error);
      } finally {
        setLoading(false);
        setDataLoaded(true);
      }
    };

    fetchIpEmails();
  }, []);

  useEffect(() => {
    if (rowData && dataLoaded) {
      // Find the corresponding employee names based on IDs
      const submitterName = employees.find(emp => emp.id === rowData.submitterid)?.name || '';
      const instructorName = employees.find(emp => emp.id === rowData.instructorid)?.name || '';
      const managerName = employees.find(emp => emp.id === rowData.mmid)?.name || '';
      
      // Find the corresponding IP email
      const ipEmail = ipEmails.find(email => email.email === rowData.ipemail)?.email || '';
      
      // Status handling
      const statusParts = rowData.status ? rowData.status.split('-') : [];
      const rawStatus = statusParts.length > 1 ? statusParts[1].trim() : rowData.status;
      const statusMap: Record<string, string> = {
        'todo': 'To Do',
        'inprogress': 'Inprogress',
        'suspended': 'Suspended',
        'closed': 'Closed'
      };
      const normalizedStatus = statusMap[rawStatus.toLowerCase()] || rawStatus;
      
      // Status mapping for proper format
      const statusMapping: Record<string, string> = {
        "To Do": "1-To Do",
        "Inprogress": "2-Inprogress",
        "Suspended": "6-Suspended",
        "Closed": "5-Closed"
      };
      
      setFormData({
        ...rowData,
        startdate: typeof rowData.startdate === 'number' ? String(rowData.startdate) : rowData.startdate || '',
        status: normalizedStatus,
        priority: rowData.priority || '',
        technology: rowData.technology || '',
        relocation: rowData.relocation ? 
          rowData.relocation.charAt(0).toUpperCase() + rowData.relocation.slice(1).toLowerCase() 
          : '',
        manager_name: managerName || rowData.manager_name || '',
        instructor_name: instructorName || rowData.instructor_name || '',
        submitter_name: submitterName || rowData.submitter_name || '',
        ipemail: ipEmail || rowData.ipemail || '',
        suspensionreason: rowData.suspensionreason || '',
        yearsofexperience: rowData.yearsofexperience || 0,
        ipemailid: rowData.ipemailid || 0,
        currentlocation: rowData.currentlocation || '',
        locationpreference: rowData.locationpreference || '',
        notes: rowData.notes || '',
        intro: rowData.intro || '',
        closedate: rowData.closedate || '',
      });
      
      // Apply status mapping
      setFormData(prev => ({
        ...prev,
        status: statusMapping[prev.status] || prev.status
      }));
      
      setPreviousStatus(normalizedStatus);
      
      console.log("Received rowData:", rowData);
      console.log("Setting formData with mapped names:", {
        submitter_name: submitterName,
        instructor_name: instructorName,
        manager_name: managerName,
        ipemail: ipEmail,
        status: normalizedStatus
      });
    }
  }, [rowData, dataLoaded, employees, ipEmails]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Handle special logic for status changes
    if (name === 'status' && value === 'Suspended') {
      // If status is changed to Suspended, ensure suspensionreason is required
      if (!formData.suspensionreason) {
        alert('Please select a suspension reason');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.relocation && !['Yes', 'No'].includes(formData.relocation)) {
      alert("Relocation field must be 'Yes' or 'No'");
      return;
    }
    
    // If status is Suspended, ensure a reason is provided
    if (formData.status === 'Suspended' && !formData.suspensionreason) {
      alert('Please select a suspension reason for the suspended status');
      return;
    }

    // Validate minimum rate
    if (formData.minrate < 45) {
      alert('Rate must be at least 45');
      return;
    }

    // Convert names back to IDs for submission
    const submitterId = employees.find(emp => emp.name === formData.submitter_name)?.id || 0;
    const ipEmailId = ipEmails.find(email => email.email === formData.ipemail)?.email || '';

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/currentMarketing/put/${formData.id}`,
        {
          submitterid: submitterId,
          status: formData.status,
          priority: formData.priority,
          yearsofexperience: formData.yearsofexperience,
          technology: formData.technology,
          resumeid: formData.resumeid,
          minrate: formData.minrate,
          ipemailid: ipEmailId,
          currentlocation: formData.currentlocation,
          locationpreference: formData.locationpreference,
          relocation: formData.relocation,
          closedate: formData.closedate,
          suspensionreason: formData.suspensionreason,
          intro: formData.intro,
          notes: formData.notes,
        },
        {
          headers: { AuthToken: localStorage.getItem('token') },
        }
      );
      
      // Display message based on status change
      if (previousStatus !== formData.status) {
        if ((formData.status === 'To Do' || formData.status === 'Inprogress') && 
            (previousStatus === 'Suspended' || previousStatus === 'Closed')) {
          alert(`Candidate has been moved to Current Marketing with status: ${formData.status}`);
        } else if ((formData.status === 'Suspended' || formData.status === 'Closed') && 
                  (previousStatus === 'To Do' || previousStatus === 'Inprogress')) {
          alert(`Candidate has been removed from Current Marketing with status: ${formData.status}`);
        }
      }
      
      onSave(); // This will refresh the parent component's data
      onRequestClose();
    } catch (error) {
      console.error('Error updating candidate:', error);
      alert('Failed to update candidate. Please try again.');
    }
  };

  // Show conditional fields based on status
  const showSuspensionReason = formData.status === 'Suspended';
  const showCloseDate = formData.status === 'Closed';

  if (loading) return <div>Loading...</div>;
  
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
          {/* Submitter */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Submitter <span className="text-red-600">*</span></label>
            <select
              name="submitter_name"
              value={formData.submitter_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Submitter</option>
              {employees.map((emp, index) => (
                <option key={`submitter-${index}`} value={emp.name}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status dropdown with default value */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status <span className="text-red-600">*</span></label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">None</option>
              {['To Do', 'Inprogress', 'Suspended', 'Closed'].map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {formData.status && (
              <p className="text-xs text-gray-500 mt-1">Current status: {formData.status}</p>
            )}
          </div>

          {/* Priority dropdown with default value */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority <span className="text-red-600">*</span></label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">None</option>
              {['P1', 'P2', 'P3', 'P4', 'P5'].map(priority => (
                <option 
                  key={priority} 
                  value={priority}
                >
                  {priority}
                </option>
              ))}
            </select>
            {formData.priority && (
              <p className="text-xs text-gray-500 mt-1">Current priority: {formData.priority}</p>
            )}
          </div>

          {/* Years of Experience */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience <span className="text-red-600">*</span></label>
            <input
              type="number"
              name="yearsofexperience"
              value={formData.yearsofexperience}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Technology */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Designation/Technology <span className="text-red-600">*</span></label>
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
            {formData.technology && (
              <p className="text-xs text-gray-500 mt-1">Current technology: {formData.technology}</p>
            )}
          </div>

          {/* Resume ID */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Resume ID <span className="text-red-600">*</span></label>
            <select
              name="resumeid"
              value={formData.resumeid}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Resume</option>
              {resumes.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  {resume.id} - {resume.name}
                </option>
              ))}
            </select>
            {formData.resumeid > 0 && (
              <p className="text-xs text-gray-500 mt-1">Current resume ID: {formData.resumeid}</p>
            )}
          </div>

          {/* Min Rate */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Rate <span className="text-red-600">*</span></label>
            <input
              type="number"
              name="minrate"
              value={formData.minrate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              min="45"
            />
          </div>

          {/* IP Email */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">IP Email <span className="text-red-600">*</span></label>
            <select
              name="ipemail"
              value={formData.ipemail}
              onChange={(e) => {
                handleChange(e);
                console.log("Selected IP Email:", e.target.value);
              }}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select IP Email</option>
              {ipEmails.map((email) => (
                <option key={email.email} value={email.email}>
                  {email.email}
                </option>
              ))}
            </select>
            {formData.ipemail && (
              <p className="text-xs text-gray-500 mt-1">Current IP email: {formData.ipemail}</p>
            )}
          </div>

          {/* Current Location */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Location <span className="text-red-600">*</span></label>
            <input
              type="text"
              name="currentlocation"
              value={formData.currentlocation}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Location Preference */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Location Preference <span className="text-red-600">*</span></label>
            <input
              type="text"
              name="locationpreference"
              value={formData.locationpreference}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Relocation */}
          <div className="modal-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">Relocation</label>
            <select
              name="relocation"
              value={formData.relocation}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            {formData.relocation && (
              <p className="text-xs text-gray-500 mt-1">Current relocation: {formData.relocation}</p>
            )}
          </div>

          {/* Suspension Reason - shown only when status is Suspended */}
          {showSuspensionReason && (
            <div className="modal-field">
              <label className="block text-sm font-medium text-gray-700 mb-1">Suspension Reason <span className="text-red-600">*</span></label>
              <select
                name="suspensionreason"
                value={formData.suspensionreason}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required={showSuspensionReason}
              >
                <option value="">Select Reason</option>
                <option value="A">Active</option>
                <option value="B">Break</option>
                <option value="D">Discontinued</option>
                <option value="X">Defaulted</option>
              </select>
              {formData.suspensionreason && (
                <p className="text-xs text-gray-500 mt-1">Current suspension reason: {formData.suspensionreason}</p>
              )}
            </div>
          )}

          {/* Close Date - shown only when status is Closed */}
          {showCloseDate && (
            <div className="modal-field">
              <label className="block text-sm font-medium text-gray-700 mb-1">Close Date <span className="text-red-600">*</span></label>
              <input
                type="date"
                name="closedate"
                value={formData.closedate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required={showCloseDate}
              />
              {formData.closedate && (
                <p className="text-xs text-gray-500 mt-1">Current close date: {formData.closedate}</p>
              )}
            </div>
          )}
        </div>

        {/* Intro - Optional and hidden */}
        <div className="modal-field">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description/Intro</label>
          <textarea
            name="intro"
            value={formData.intro}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={3}
          />
        </div>

        {/* Notes - Optional and hidden */}
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

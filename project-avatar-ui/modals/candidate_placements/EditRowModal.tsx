import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
// import { toast } from "react-toastify";

interface SelectOption {
  id: string;
  name: string;
}

interface PlacementSelectOptions {
  candidates: SelectOption[];
  managers: SelectOption[];
  recruiters: SelectOption[];
  vendors: SelectOption[];
  clients: SelectOption[];
  statuses: SelectOption[];
  yesno: SelectOption[];
  feedbacks: SelectOption[];
}

interface Placement {
  id: number;
  candidateid: number;
  mmid: number;
  recruiterid: number;
  vendorid: number;
  vendor2id?: number;
  vendor3id?: number;
  clientid: number;
  startdate: string;
  enddate: string;
  status: string;
  paperwork: string;
  insurance: string;
  wrklocation: string;
  wrkdesignation: string;
  wrkemail: string;
  wrkphone: string;
  mgrname: string;
  mgremail: string;
  mgrphone: string;
  hiringmgrname: string;
  hiringmgremail: string;
  hiringmgrphone: string;
  reference: string;
  ipemailclear: string;
  feedbackid?: number;
  projectdocs: string;
  notes: string;
  masteragreementid?: number;
  otheragreementsids?: string;
}

interface EditRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  placement: Placement | null;
  onSave: () => void;
}

const EditRowModal: React.FC<EditRowModalProps> = ({ isOpen, onClose, placement, onSave }) => {
  const [formData, setFormData] = useState<Placement | null>(null);
  const [selectOptions, setSelectOptions] = useState<PlacementSelectOptions | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (isOpen && placement) {
      setFormData({ ...placement });
      
      if (placement.startdate) {
        setStartDate(new Date(placement.startdate));
      }
      if (placement.enddate) {
        setEndDate(new Date(placement.enddate));
      }
      
      fetchSelectOptions();
    }
  }, [isOpen, placement]);

  const fetchSelectOptions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/candid/placements/options/all`, {
        headers: { AuthToken: localStorage.getItem("token") },
      });
      setSelectOptions(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching select options:", error);
      setError("Failed to load form options. Please try again.");
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (formData) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    if (formData && date) {
      setFormData({
        ...formData,
        startdate: date.toISOString().split('T')[0],
      });
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    if (formData && date) {
      setFormData({
        ...formData,
        enddate: date.toISOString().split('T')[0],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData) return;
    
    try {
      setLoading(true);
      await axios.put(`${API_URL}/candid/placements/update/${formData.id}`, formData, {
        headers: { AuthToken: localStorage.getItem("token") },
      });
      
      setLoading(false);
      onSave();
      onClose();
    } catch (error) {
      console.error("Error updating placement:", error);
      setError("Failed to update placement. Please try again.");
      setLoading(false);
    }
  };

  const renderField = (
    name: keyof Placement,
    label: string,
    type: string = 'text',
    required: boolean = false,
    options?: SelectOption[],
    isDate: boolean = false
  ) => {
    const baseClassName = `w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`;

    if (isDate) {
      return (
        <div className="modal-field">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <DatePicker
            selected={name === 'startdate' ? startDate : endDate}
            onChange={(date) => name === 'startdate' ? handleStartDateChange(date) : handleEndDateChange(date)}
            dateFormat="yyyy-MM-dd"
            className={`${baseClassName} border-gray-300`}
            required={required}
          />
        </div>
      );
    }

    return (
      <div className="modal-field">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {type === 'select' ? (
          <select
            name={name}
            value={(formData?.[name] || '') as string}
            onChange={handleInputChange}
            className={`${baseClassName} border-gray-300`}
            required={required}
          >
            <option value="">Select {label}</option>
            {options?.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={(formData?.[name] || '') as string}
            onChange={handleInputChange}
            className={`${baseClassName} border-gray-300`}
            required={required}
          />
        )}
      </div>
    );
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
          maxWidth: '1000px',
          width: '95%',
          height: '85vh',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      contentLabel="Edit Placement"
      ariaHideApp={false}
    >
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
        >
          <AiOutlineClose />
        </button>
      </div>
      
      <h2 className="text-2xl font-bold mb-4 text-gray-800 pr-8">Edit Placement</h2>

      <div className="overflow-y-auto flex-grow pr-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderField('candidateid', 'Candidate', 'select', true, selectOptions?.candidates)}
              {renderField('mmid', 'Manager', 'select', true, selectOptions?.managers)}
              {renderField('recruiterid', 'Recruiter', 'select', true, selectOptions?.recruiters)}
              {renderField('vendorid', 'Vendor', 'select', true, selectOptions?.vendors)}
              {renderField('vendor2id', 'Vendor 2', 'select', false, selectOptions?.vendors)}
              {renderField('vendor3id', 'Vendor 3', 'select', false, selectOptions?.vendors)}
              {renderField('clientid', 'Client', 'select', true, selectOptions?.clients)}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField('startdate', 'Start Date', 'text', true, undefined, true)}
              {renderField('enddate', 'End Date', 'text', true, undefined, true)}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Work Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderField('wrklocation', 'Work Location')}
              {renderField('wrkdesignation', 'Designation')}
              {renderField('status', 'Status', 'select', true, selectOptions?.statuses)}
              {renderField('paperwork', 'Paperwork', 'select', false, selectOptions?.yesno)}
              {renderField('insurance', 'Insurance', 'select', false, selectOptions?.yesno)}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderField('wrkemail', 'Work Email', 'email')}
              {renderField('wrkphone', 'Work Phone', 'tel')}
              {renderField('mgrname', 'Manager Name')}
              {renderField('mgremail', 'Manager Email', 'email')}
              {renderField('mgrphone', 'Manager Phone', 'tel')}
              {renderField('hiringmgrname', 'Hiring Manager Name')}
              {renderField('hiringmgremail', 'Hiring Manager Email', 'email')}
              {renderField('hiringmgrphone', 'Hiring Manager Phone', 'tel')}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderField('reference', 'Reference')}
              {renderField('ipemailclear', 'IP Email Clear')}
              {renderField('feedbackid', 'Feedback', 'select', false, selectOptions?.feedbacks)}
              {renderField('projectdocs', 'Project Documents')}
              {renderField('notes', 'Notes', 'textarea')}
              {renderField('masteragreementid', 'Master Agreement ID')}
              {renderField('otheragreementsids', 'Other Agreements IDs')}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 pb-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Saving...' : 'Update Placement'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditRowModal;
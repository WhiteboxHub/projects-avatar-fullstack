import Modal from "react-modal";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";

interface ViewRowCandidateProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestClose: () => void;
  rowData: any;
}

const ViewRowCandidate: React.FC<ViewRowCandidateProps> = ({ isOpen, onClose, rowData }) => {
  if (!rowData) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  const renderSection = (title: string, fields: { key: string, label: string }[]) => (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(({ key, label }) => (
          <div key={key} className="modal-field">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {label}
            </label>
            <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white">
              {key.includes('date') ? formatDate(rowData[key]) : rowData[key] || '-'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

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
      contentLabel="View Candidate"
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
      
      <h2 className="text-2xl font-bold mb-4 text-gray-800 pr-8">Candidate Details</h2>

      <div className="overflow-y-auto flex-grow pr-2" style={{ scrollbarWidth: 'thin' }}>
        {/* Basic Information */}
        {renderSection('Basic Information', [
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
          { key: 'course', label: 'Course' },
          { key: 'batchname', label: 'Batch Name' },
          { key: 'enrolleddate', label: 'Enrolled Date' },
          { key: 'status', label: 'Status' }
        ])}

        {/* Work Status and Authorization */}
        {renderSection('Work Status & Authorization', [
          { key: 'workstatus', label: 'Work Status' },
          { key: 'wpexpirationdate', label: 'Work Permit Expiration' },
          { key: 'processflag', label: 'Process Flag' },
          { key: 'diceflag', label: 'Dice Candidate' }
        ])}

        {/* Personal Information */}
        {renderSection('Personal Information', [
          { key: 'ssn', label: 'SSN' },
          { key: 'ssnvalidated', label: 'SSN Validated' },
          { key: 'dob', label: 'Date of Birth' },
          { key: 'education', label: 'Education' },
          { key: 'workexperience', label: 'Work Experience' }
        ])}

        {/* Contact Information */}
        {renderSection('Contact Information', [
          { key: 'address', label: 'Address' },
          { key: 'city', label: 'City' },
          { key: 'state', label: 'State' },
          { key: 'country', label: 'Country' },
          { key: 'zip', label: 'ZIP Code' },
          { key: 'secondaryemail', label: 'Secondary Email' },
          { key: 'secondaryphone', label: 'Secondary Phone' }
        ])}

        {/* Emergency Contact */}
        {renderSection('Emergency Contact', [
          { key: 'emergcontactname', label: 'Contact Name' },
          { key: 'emergcontactemail', label: 'Contact Email' },
          { key: 'emergcontactphone', label: 'Contact Phone' },
          { key: 'emergcontactaddrs', label: 'Contact Address' }
        ])}

        {/* Guarantor Information */}
        {renderSection('Guarantor Information', [
          { key: 'guarantorname', label: 'Guarantor Name' },
          { key: 'guarantordesignation', label: 'Guarantor Designation' },
          { key: 'guarantorcompany', label: 'Guarantor Company' }
        ])}

        {/* Financial Information */}
        {renderSection('Financial Information', [
          { key: 'salary0', label: 'Salary 0-6 Months' },
          { key: 'salary6', label: 'Salary 6-12 Months' },
          { key: 'salary12', label: 'Salary 12+ Months' },
          { key: 'feepaid', label: 'Fee Paid' },
          { key: 'feedue', label: 'Fee Due' },
          { key: 'term', label: 'Term' }
        ])}

        {/* Documents and URLs */}
        {renderSection('Documents & URLs', [
          { key: 'originalresume', label: 'Resume URL' },
          { key: 'contracturl', label: 'Contract URL' },
          { key: 'empagreementurl', label: 'Employment Agreement URL' },
          { key: 'offerletterurl', label: 'Offer Letter URL' },
          { key: 'dlurl', label: "Driver's License URL" },
          { key: 'workpermiturl', label: 'Work Permit URL' },
          { key: 'ssnurl', label: 'SSN Document URL' }
        ])}

        {/* Additional Information */}
        {renderSection('Additional Information', [
          { key: 'notes', label: 'Notes' },
          { key: 'portalid', label: 'Portal ID' },
          { key: 'referralid', label: 'Referral ID' }
        ])}
      </div>

      <div className="flex justify-end space-x-4 pt-6 pb-4">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ViewRowCandidate;

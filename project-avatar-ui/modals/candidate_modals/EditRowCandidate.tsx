// import Modal from "react-modal";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { AiOutlineClose } from "react-icons/ai";
// import { toast } from "react-toastify";

// interface DropdownOptions {
//   courses: string[];
//   processFlag: string[];
//   diceCandidate: string[];
//   workStatus: string[];
//   ssnValid: string[];
//   bgvDone: string[];
//   salary: string[];
//   batches: string[];
//   candidateStatus: string[]; 
//   portalIds: Array<{id: string, name: string}>;
//   referralIds: Array<{id: string, name: string}>;
// }

// interface FormData {
//   name: string;
//   enrolleddate: string;
//   email: string;
//   course: string;
//   phone: string;
//   status: string;
//   statuschangedate: string;
//   workstatus: string;
//   education: string;
//   workexperience: string;
//   ssn: string;
//   dob: string;
//   portalid: string;
//   wpexpirationdate: string;
//   ssnvalidated: string;
//   bgv: string;
//   secondaryemail: string;
//   secondaryphone: string;
//   address: string;
//   city: string;
//   state: string;
//   country: string;
//   zip: string;
//   guarantorname: string;
//   guarantordesignation: string;
//   guarantorcompany: string;
//   emergcontactname: string;
//   emergcontactemail: string;
//   emergcontactphone: string;
//   emergcontactaddrs: string;
//   term: string;
//   feepaid: string;
//   feedue: string;
//   salary0: string;
//   salary6: string;
//   salary12: string;
//   contracturl: string;
//   empagreementurl: string;
//   offerletterurl: string;
//   dlurl: string;
//   workpermiturl: string;
//   ssnurl: string;
//   referralid: string;
//   notes: string;
//   batchname: string;
//   processflag: string;
//   diceflag: string;
//   originalresume: string;
// }

// interface EditRowCandidateProps {
//   isOpen: boolean;
//   refreshData: () => void;
//   onClose: () => void;
//   candidateData: any;
// }

// const EditRowCandidate: React.FC<EditRowCandidateProps> = ({ isOpen, refreshData, onClose, candidateData }) => {
//   const [dropdownOptions, setDropdownOptions] = useState<DropdownOptions | null>(null);
//   const [formData, setFormData] = useState<FormData>({} as FormData);
//   const [errors, setErrors] = useState<Partial<FormData>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     if (candidateData && isOpen) {
//       // Format dates properly with error handling
//       const formattedData = {
//         ...candidateData,
//         enrolleddate: formatDateSafely(candidateData.enrolleddate),
//         dob: formatDateSafely(candidateData.dob),
//         wpexpirationdate: formatDateSafely(candidateData.wpexpirationdate),
//         statuschangedate: formatDateSafely(candidateData.statuschangedate) || formatDateSafely(new Date()),
//       };
      
//       setFormData(formattedData);
//     }
//   }, [candidateData, isOpen]);

//   // Helper function to safely format dates
//   const formatDateSafely = (dateValue: any): string => {
//     if (!dateValue) return '';
    
//     try {
//       // Handle ISO strings, timestamps, and date objects
//       const date = new Date(dateValue);
      
//       // Check if date is valid
//       if (isNaN(date.getTime())) {
//         return '';
//       }
      
//       // Format as YYYY-MM-DD
//       return date.toISOString().split('T')[0];
//     } catch (error) {
//       console.error('Error formatting date:', error, dateValue);
//       return '';
//     }
//   };

//   useEffect(() => {
//     const fetchDropdownOptions = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           toast.error('Authentication token not found. Please log in again.');
//           return;
//         }
        
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_URL}/candidates/dropdown-options`,
//           { headers: { AuthToken: token } }
//         );
//         setDropdownOptions(response.data);
//       } catch (error) {
//         console.error('Error fetching dropdown options:', error);
//         toast.error('Failed to load form options');
//       }
//     };

//     if (isOpen) {
//       fetchDropdownOptions();
//     }
//   }, [isOpen]);

//   const validateForm = (): boolean => {
//     const newErrors: Partial<FormData> = {};

//     // Required fields validation
//     if (!formData.name?.trim()) newErrors.name = 'Name is required';
//     if (!formData.email?.trim()) newErrors.email = 'Email is required';
//     if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Invalid email format';
//     }
//     if (!formData.phone?.trim()) newErrors.phone = 'Phone is required';
//     if (!formData.course) newErrors.course = 'Course is required';
//     if (!formData.batchname) newErrors.batchname = 'Batch name is required';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     // Clear error when field is modified
//     if (errors[name as keyof FormData]) {
//       setErrors(prev => ({ ...prev, [name]: undefined }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!validateForm()) {
//       toast.error('Please fill in all required fields correctly');
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         toast.error('Authentication token not found. Please log in again.');
//         return;
//       }
      
//       await axios.put(
//         `${process.env.NEXT_PUBLIC_API_URL}/candidates/candidates/update/${candidateData.candidateid}`,
//         formData,
//         { 
//           headers: { 
//             'AuthToken': token,
//             'Content-Type': 'application/json'
//           } 
//         }
//       );
//       toast.success('Candidate updated successfully');
//       refreshData();
//       onClose();
//     } catch (error) {
//       console.error('Error updating candidate:', error);
//       if (axios.isAxiosError(error) && error.response) {
//         toast.error(`Failed to update candidate: ${error.response.data.detail || 'Server error'}`);
//       } else {
//         toast.error('Failed to update candidate. Please check your connection and try again.');
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const renderField = (
//     name: keyof FormData,
//     label: string,
//     type: string = 'text',
//     required: boolean = false,
//     options?: any[],
//     placeholder?: string
//   ) => {
//     const baseClassName = `w-full px-3 py-2 text-sm border ${
//       errors[name] ? 'border-red-500' : 'border-gray-300'
//     } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`;

//     return (
//       <div className="modal-field">
//         <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-1">
//           {label} {required && <span className="text-red-500">*</span>}
//         </label>
        
//         {type === 'select' ? (
//           <select
//             id={name}
//             name={name}
//             value={formData[name] || ''}
//             onChange={handleChange}
//             className={baseClassName}
//             required={required}
//           >
//             <option value="">Select {label}</option>
//             {options?.map((opt: any) => (
//               <option key={opt.id || opt} value={opt.id || opt}>
//                 {opt.name || opt}
//               </option>
//             ))}
//           </select>
//         ) : type === 'textarea' ? (
//           <textarea
//             id={name}
//             name={name}
//             value={formData[name] || ''}
//             onChange={handleChange}
//             className={`${baseClassName} h-24`}
//             required={required}
//             placeholder={placeholder || `Enter ${label.toLowerCase()}`}
//           />
//         ) : (
//           <input
//             type={type}
//             id={name}
//             name={name}
//             value={formData[name] || ''}
//             onChange={handleChange}
//             className={baseClassName}
//             required={required}
//             placeholder={placeholder || `Enter ${label.toLowerCase()}`}
//           />
//         )}
//         {errors[name] && (
//           <p className="mt-1 text-xs text-red-500">{errors[name]}</p>
//         )}
//       </div>
//     );
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       style={{
//         content: {
//           top: '50%',
//           left: '50%',
//           right: 'auto',
//           bottom: 'auto',
//           transform: 'translate(-50%, -50%)',
//           maxWidth: '1000px',
//           width: '95%',
//           height: '85vh',
//           padding: '24px',
//           borderRadius: '12px',
//           boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
//           overflow: 'hidden',
//           display: 'flex',
//           flexDirection: 'column',
//         },
//         overlay: {
//           backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         },
//       }}
//       contentLabel="Edit Candidate"
//       ariaHideApp={false}
//     >
//       <div className="relative">
//         <button
//           onClick={onClose}
//           className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
//         >
//           <AiOutlineClose />
//         </button>
//       </div>
      
//       <h2 className="text-2xl font-bold mb-4 text-gray-800 pr-8">Edit Candidate</h2>

//       <div className="overflow-y-auto flex-grow pr-2" style={{ scrollbarWidth: 'thin' }}>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Basic Information */}
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {renderField('name', 'Name', 'text', true)}
//               {renderField('email', 'Email', 'email', true)}
//               {renderField('phone', 'Phone', 'text', true)}
//               {renderField('course', 'Course', 'select', true, dropdownOptions?.courses)}
//               {renderField('batchname', 'Batch Name', 'select', true, dropdownOptions?.batches)}
//               {renderField('enrolleddate', 'Enrolled Date', 'date', true)}
//             </div>
//           </div>

//           {/* Status Information */}
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="text-lg font-semibold mb-4">Status Information</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {renderField('status', 'Candidate Status', 'select', false, dropdownOptions?.candidateStatus)}
//               {renderField('statuschangedate', 'Status Change Date', 'date')}
//             </div>
//           </div>

//           {/* Work Status and Authorization */}
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="text-lg font-semibold mb-4">Work Status & Authorization</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {renderField('workstatus', 'Work Status', 'select', false, dropdownOptions?.workStatus)}
//               {renderField('wpexpirationdate', 'Work Permit Expiration', 'date')}
//               {renderField('processflag', 'Process Flag', 'select', false, dropdownOptions?.processFlag)}
//               {renderField('diceflag', 'Dice Candidate', 'select', false, dropdownOptions?.diceCandidate)}
//             </div>
//           </div>

//           {/* Personal Information */}
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {renderField('ssn', 'SSN', 'text')}
//               {renderField('ssnvalidated', 'SSN Validated', 'select', false, dropdownOptions?.ssnValid)}
//               {renderField('dob', 'Date of Birth', 'date')}
//               {renderField('education', 'Education', 'text')}
//               {renderField('workexperience', 'Work Experience', 'text')}
//             </div>
//           </div>

//           {/* Contact Information */}
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {renderField('address', 'Address', 'text')}
//               {renderField('city', 'City', 'text')}
//               {renderField('state', 'State', 'text')}
//               {renderField('country', 'Country', 'text')}
//               {renderField('zip', 'ZIP Code', 'text')}
//               {renderField('secondaryemail', 'Secondary Email', 'email')}
//               {renderField('secondaryphone', 'Secondary Phone', 'text')}
//             </div>
//           </div>

//           {/* Emergency Contact */}
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {renderField('emergcontactname', 'Contact Name', 'text')}
//               {renderField('emergcontactemail', 'Contact Email', 'email')}
//               {renderField('emergcontactphone', 'Contact Phone', 'text')}
//               {renderField('emergcontactaddrs', 'Contact Address', 'text')}
//             </div>
//           </div>

//           {/* Guarantor Information */}
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="text-lg font-semibold mb-4">Guarantor Information</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {renderField('guarantorname', 'Guarantor Name', 'text')}
//               {renderField('guarantordesignation', 'Guarantor Designation', 'text')}
//               {renderField('guarantorcompany', 'Guarantor Company', 'text')}
//             </div>
//           </div>

//           {/* Financial Information */}
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="text-lg font-semibold mb-4">Financial Information</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {renderField('salary0', 'Salary 0-6 Months', 'select', false, dropdownOptions?.salary)}
//               {renderField('salary6', 'Salary 6-12 Months', 'select', false, dropdownOptions?.salary)}
//               {renderField('salary12', 'Salary 12+ Months', 'select', false, dropdownOptions?.salary)}
//               {renderField('feepaid', 'Fee Paid', 'number')}
//               {renderField('feedue', 'Fee Due', 'number')}
//               {renderField('term', 'Term', 'text')}
//             </div>
//           </div>

//           {/* Documents and URLs */}
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="text-lg font-semibold mb-4">Documents & URLs</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {renderField('originalresume', 'Resume URL', 'url')}
//               {renderField('contracturl', 'Contract URL', 'url')}
//               {renderField('empagreementurl', 'Employment Agreement URL', 'url')}
//               {renderField('offerletterurl', 'Offer Letter URL', 'url')}
//               {renderField('dlurl', "Driver's License URL", 'url')}
//               {renderField('workpermiturl', 'Work Permit URL', 'url')}
//               {renderField('ssnurl', 'SSN Document URL', 'url')}
//             </div>
//           </div>

//           {/* Additional Information */}
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
//             <div className="grid grid-cols-1 gap-4">
//               {renderField('notes', 'Notes', 'textarea')}
//               {renderField('portalid', 'Portal ID', 'select', false, dropdownOptions?.portalIds)}
//               {renderField('referralid', 'Referral ID', 'select', false, dropdownOptions?.referralIds)}
//             </div>
//           </div>

//           <div className="flex justify-end space-x-4 pt-6 pb-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 ${
//                 isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
//               }`}
//             >
//               {isSubmitting ? 'Saving...' : 'Update Candidate'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </Modal>
//   );
// };

// export default EditRowCandidate;


import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";

interface DropdownOptions {
  courses: string[];
  processFlag: string[];
  diceCandidate: string[];
  workStatus: string[];
  ssnValid: string[];
  bgvDone: string[];
  salary: string[];
  batches: string[];
  portalIds: Array<{ id: string; name: string }>;
  referralIds: Array<{ id: string; name: string }>;
}

interface FormData {
  name: string;
  enrolleddate: string;
  email: string;
  course: string;
  phone: string;
  status: string;
  statuschangedate: string;
  workstatus: string;
  education: string;
  workexperience: string;
  ssn: string;
  dob: string;
  portalid: string;
  wpexpirationdate: string;
  ssnvalidated: string;
  bgv: string;
  secondaryemail: string;
  secondaryphone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  guarantorname: string;
  guarantordesignation: string;
  guarantorcompany: string;
  emergcontactname: string;
  emergcontactemail: string;
  emergcontactphone: string;
  emergcontactaddrs: string;
  term: string;
  feepaid: string;
  feedue: string;
  salary0: string;
  salary6: string;
  salary12: string;
  contracturl: string;
  empagreementurl: string;
  offerletterurl: string;
  dlurl: string;
  workpermiturl: string;
  ssnurl: string;
  referralid: string;
  notes: string;
  batchname: string;
  processflag: string;
  diceflag: string;
  originalresume: string;
}

interface EditRowCandidateProps {
  isOpen: boolean;
  refreshData: () => void;
  onClose: () => void;
  candidateData: any;
}

const candidateStatusOptions = [
  "Active",
  "Inactive",
  "Placed",
  "Training",
  "Marketing",
  "Terminated",
  "Absconded"
];

const EditRowCandidate: React.FC<EditRowCandidateProps> = ({ isOpen, refreshData, onClose, candidateData }) => {
  const [dropdownOptions, setDropdownOptions] = useState<DropdownOptions | null>(null);
  const [formData, setFormData] = useState<FormData>({} as FormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (candidateData && isOpen) {
      // Format dates properly with error handling
      const formattedData = {
        ...candidateData,
        enrolleddate: formatDateSafely(candidateData.enrolleddate),
        dob: formatDateSafely(candidateData.dob),
        wpexpirationdate: formatDateSafely(candidateData.wpexpirationdate),
        statuschangedate: formatDateSafely(candidateData.statuschangedate) || formatDateSafely(new Date()),
        status: candidateData.status || '', // Ensure status is set
      };

      setFormData(formattedData);
    }
  }, [candidateData, isOpen]);

  // Helper function to safely format dates
  const formatDateSafely = (dateValue: any): string => {
    if (!dateValue) return '';

    try {
      // Handle ISO strings, timestamps, and date objects
      const date = new Date(dateValue);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return '';
      }

      // Format as YYYY-MM-DD
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error, dateValue);
      return '';
    }
  };

  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Authentication token not found. Please log in again.');
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/candidates/dropdown-options`,
          { headers: { AuthToken: token } }
        );
        setDropdownOptions(response.data);
      } catch (error) {
        console.error('Error fetching dropdown options:', error);
        toast.error('Failed to load form options');
      }
    };

    if (isOpen) {
      fetchDropdownOptions();
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    // Required fields validation
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone?.trim()) newErrors.phone = 'Phone is required';
    if (!formData.course) newErrors.course = 'Course is required';
    if (!formData.batchname) newErrors.batchname = 'Batch name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when field is modified
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found. Please log in again.');
        return;
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/candidates/candidates/update/${candidateData.candidateid}`,
        formData,
        {
          headers: {
            'AuthToken': token,
            'Content-Type': 'application/json'
          }
        }
      );
      toast.success('Candidate updated successfully');
      refreshData();
      onClose();
    } catch (error) {
      console.error('Error updating candidate:', error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(`Failed to update candidate: ${error.response.data.detail || 'Server error'}`);
      } else {
        toast.error('Failed to update candidate. Please check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (
    name: keyof FormData,
    label: string,
    type: string = 'text',
    required: boolean = false,
    options?: any[],
    placeholder?: string
  ) => {
    const baseClassName = `w-full px-3 py-2 text-sm border ${
      errors[name] ? 'border-red-500' : 'border-gray-300'
    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`;

    return (
      <div className="modal-field">
        <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        {type === 'select' ? (
          <select
            id={name}
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            className={baseClassName}
            required={required}
          >
            <option value="">Select {label}</option>
            {options?.map((opt: any) => (
              <option key={opt.id || opt} value={opt.id || opt}>
                {opt.name || opt}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            className={`${baseClassName} h-24`}
            required={required}
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          />
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            className={baseClassName}
            required={required}
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          />
        )}
        {errors[name] && (
          <p className="mt-1 text-xs text-red-500">{errors[name]}</p>
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
      contentLabel="Edit Candidate"
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

      <h2 className="text-2xl font-bold mb-4 text-gray-800 pr-8">Edit Candidate</h2>

      <div className="overflow-y-auto flex-grow pr-2" style={{ scrollbarWidth: 'thin' }}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderField('name', 'Name', 'text', true)}
              {renderField('email', 'Email', 'email', true)}
              {renderField('phone', 'Phone', 'text', true)}
              {renderField('course', 'Course', 'select', true, dropdownOptions?.courses)}
              {renderField('batchname', 'Batch Name', 'select', true, dropdownOptions?.batches)}
              {renderField('enrolleddate', 'Enrolled Date', 'date', true)}
            </div>
          </div>

          {/* Status Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Status Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField('status', 'Candidate Status', 'select', false, candidateStatusOptions)}
              {renderField('statuschangedate', 'Status Change Date', 'date')}
            </div>
          </div>

          {/* Work Status and Authorization */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Work Status & Authorization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderField('workstatus', 'Work Status', 'select', false, dropdownOptions?.workStatus)}
              {renderField('wpexpirationdate', 'Work Permit Expiration', 'date')}
              {renderField('processflag', 'Process Flag', 'select', false, dropdownOptions?.processFlag)}
              {renderField('diceflag', 'Dice Candidate', 'select', false, dropdownOptions?.diceCandidate)}
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderField('ssn', 'SSN', 'text')}
              {renderField('ssnvalidated', 'SSN Validated', 'select', false, dropdownOptions?.ssnValid)}
              {renderField('dob', 'Date of Birth', 'date')}
              {renderField('education', 'Education', 'text')}
              {renderField('workexperience', 'Work Experience', 'text')}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderField('address', 'Address', 'text')}
              {renderField('city', 'City', 'text')}
              {renderField('state', 'State', 'text')}
              {renderField('country', 'Country', 'text')}
              {renderField('zip', 'ZIP Code', 'text')}
              {renderField('secondaryemail', 'Secondary Email', 'email')}
              {renderField('secondaryphone', 'Secondary Phone', 'text')}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField('emergcontactname', 'Contact Name', 'text')}
              {renderField('emergcontactemail', 'Contact Email', 'email')}
              {renderField('emergcontactphone', 'Contact Phone', 'text')}
              {renderField('emergcontactaddrs', 'Contact Address', 'text')}
            </div>
          </div>

          {/* Guarantor Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Guarantor Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderField('guarantorname', 'Guarantor Name', 'text')}
              {renderField('guarantordesignation', 'Guarantor Designation', 'text')}
              {renderField('guarantorcompany', 'Guarantor Company', 'text')}
            </div>
          </div>

          {/* Financial Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Financial Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderField('salary0', 'Salary 0-6 Months', 'select', false, dropdownOptions?.salary)}
              {renderField('salary6', 'Salary 6-12 Months', 'select', false, dropdownOptions?.salary)}
              {renderField('salary12', 'Salary 12+ Months', 'select', false, dropdownOptions?.salary)}
              {renderField('feepaid', 'Fee Paid', 'number')}
              {renderField('feedue', 'Fee Due', 'number')}
              {renderField('term', 'Term', 'text')}
            </div>
          </div>

          {/* Documents and URLs */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Documents & URLs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField('originalresume', 'Resume URL', 'url')}
              {renderField('contracturl', 'Contract URL', 'url')}
              {renderField('empagreementurl', 'Employment Agreement URL', 'url')}
              {renderField('offerletterurl', 'Offer Letter URL', 'url')}
              {renderField('dlurl', "Driver's License URL", 'url')}
              {renderField('workpermiturl', 'Work Permit URL', 'url')}
              {renderField('ssnurl', 'SSN Document URL', 'url')}
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 gap-4">
              {renderField('notes', 'Notes', 'textarea')}
              {renderField('portalid', 'Portal ID', 'select', false, dropdownOptions?.portalIds)}
              {renderField('referralid', 'Referral ID', 'select', false, dropdownOptions?.referralIds)}
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
              disabled={isSubmitting}
              className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Update Candidate'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditRowCandidate;

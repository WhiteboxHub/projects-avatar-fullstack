// import React, { useState, useEffect } from 'react';
// import Modal from 'react-modal';
// import axios from 'axios';

// interface AddRowModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit?: (formData: any) => Promise<void>;
//   refreshData?: () => Promise<void>;
//   clients?: { id: number; pname: string; }[];
// }

// interface InvoiceOption {
//   id: number;
//   pname: string;
//   // Add other fields if needed
// }

// const AddRowModal: React.FC<AddRowModalProps> = ({ isOpen, onClose, refreshData, onSubmit, clients }) => {
//   const [formData, setFormData] = useState({
//     invoicenumber: '',
//     startdate: '',
//     enddate: '',
//     invoicedate: '',
//     quantity: '',
//     otquantity: '',
//     status: 'Open',
//     amountreceived: '',
//     releaseddate: '',
//     receiveddate: '',
//     checknumber: '',
//     invoiceurl: '',
//     checkurl: '',
//     reminders: 'Y',
//     remindertype: 'Open',
//     emppaiddate: '',
//     candpaymentstatus: 'Open',
//     poid: '',
//     notes: '',
//     lastmoddatetime: '',
//   });

//   const [invoiceOptions, setInvoiceOptions] = useState<InvoiceOption[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       fetchInvoiceOptions();
//     }
//   }, [isOpen]);

//   const fetchInvoiceOptions = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/invoices`, {
//         headers: { AuthToken: localStorage.getItem("token") },
//       });

//       // Just use the raw data
//       setInvoiceOptions(response.data);
//       console.log("Raw data being set:", response.data);
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       const payload = {
//         ...formData,
//         poid: formData.poid, // This should now be the ID
//       };
      
//       if (onSubmit) {
//         await onSubmit(payload);
//       } else if (refreshData) {
//         await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/invoices/bypo/post/`, payload, {
//           headers: { AuthToken: localStorage.getItem("token") },
//         });
//         await refreshData();
//       }
      
//       onClose();
//     } catch (error) {
//       console.error("Error adding row:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
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
//           maxWidth: '600px',
//           width: '90%',
//           maxHeight: '90vh',
//           padding: '24px',
//           borderRadius: '12px',
//           boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
//           overflowY: 'auto',
//           fontFamily: 'Arial, sans-serif',
//         },
//         overlay: {
//           backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         },
//       }}
//     >
//       <div className="relative">
//         <button
//           onClick={onClose}
//           className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
//         >
//           &times;
//         </button>
//       </div>
//       <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Add Invoice</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="flex flex-col gap-4">
//           <div className="modal-field">
//             <label htmlFor="invoicenumber" className="block text-sm font-semibold text-gray-700 mb-1">
//               Invoice No.
//             </label>
//             <input
//               type="text"
//               id="invoicenumber"
//               name="invoicenumber"
//               value={formData.invoicenumber}
//               onChange={handleChange}
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               required
//             />
//           </div>

//           <div className="modal-field">
//             <label htmlFor="poid" className="block text-sm font-semibold text-gray-700 mb-1">
//               PO ID
//             </label>
//             <select
//               id="poid"
//               name="poid"
//               value={formData.poid}
//               onChange={handleChange}
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               required
//               disabled={isLoading}
//             >
//               <option value="">Select PO ID</option>
//               {(clients || invoiceOptions).map((item) => (
//                 <option key={item.id} value={item.id}>
//                   {item.pname}
//                 </option>
//               ))}
//             </select>
//             {isLoading && (
//               <p className="text-xs text-gray-500 mt-1">Loading PO IDs...</p>
//             )}
//           </div>

//           {/* Date Fields */}
//           <div className="modal-field">
//             <label htmlFor="startdate" className="block text-sm font-semibold text-gray-700 mb-1">
//               Start Date
//             </label>
//             <input
//               type="date"
//               id="startdate"
//               name="startdate"
//               value={formData.startdate}
//               onChange={handleChange}
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             />
//           </div>

//           <div className="modal-field">
//             <label htmlFor="enddate" className="block text-sm font-semibold text-gray-700 mb-1">
//               End Date
//             </label>
//             <input
//               type="date"
//               id="enddate"
//               name="enddate"
//               value={formData.enddate}
//               onChange={handleChange}
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             />
//           </div>

//           <div className="modal-field">
//             <label htmlFor="invoicedate" className="block text-sm font-semibold text-gray-700 mb-1">
//               Invoice Date
//             </label>
//             <input
//               type="date"
//               id="invoicedate"
//               name="invoicedate"
//               value={formData.invoicedate}
//               onChange={handleChange}
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             />
//           </div>

//           <div className="modal-field">
//             <label htmlFor="receiveddate" className="block text-sm font-semibold text-gray-700 mb-1">
//               Received Date
//             </label>
//             <input
//               type="date"
//               id="receiveddate"
//               name="receiveddate"
//               value={formData.receiveddate}
//               onChange={handleChange}
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             />
//           </div>

//           <div className="modal-field">
//             <label htmlFor="releaseddate" className="block text-sm font-semibold text-gray-700 mb-1">
//               Released Date
//             </label>
//             <input
//               type="date"
//               id="releaseddate"
//               name="releaseddate"
//               value={formData.releaseddate}
//               onChange={handleChange}
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             />
//           </div>

//           <div className="modal-field">
//             <label htmlFor="emppaiddate" className="block text-sm font-semibold text-gray-700 mb-1">
//               Candidate Paid Date
//             </label>
//             <input
//               type="date"
//               id="emppaiddate"
//               name="emppaiddate"
//               value={formData.emppaiddate}
//               onChange={handleChange}
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             />
//           </div>

//           {/* Quantity Fields */}
//           <div className="modal-field">
//             <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 mb-1">
//               Quantity
//             </label>
//             <input
//               type="number"
//               id="quantity"
//               name="quantity"
//               value={formData.quantity}
//               onChange={handleChange}
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             />
//           </div>

//           <div className="modal-field">
//             <label htmlFor="otquantity" className="block text-sm font-semibold text-gray-700 mb-1">
//               OT Quantity
//             </label>
//             <input
//               type="number"
//               id="otquantity"
//               name="otquantity"
//               value={formData.otquantity}
//               onChange={handleChange}
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             />
//           </div>

//           {/* Status Fields */}
//           <div className="modal-field">
//             <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1">
//               Status
//             </label>
//             <select
//               id="status"
//               name="status"
//               value={formData.status}
//               onChange={handleChange}
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             >
//               <option value="Open">Open</option>
//               <option value="Closed">Closed</option>
//               <option value="Void">Void</option>
//             </select>
//           </div>

//           <div className="modal-field">
//             <label htmlFor="candpaymentstatus" className="block text-sm font-semibold text-gray-700 mb-1">
//               Cand. Payment Status
//             </label>
//             <select
//               id="candpaymentstatus"
//               name="candpaymentstatus"
//               value={formData.candpaymentstatus}
//               onChange={handleChange}
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             >
//               <option value="Open">Open</option>
//               <option value="Pending">Pending</option>
//               <option value="Suspended">Suspended</option>
//               <option value="Closed">Closed</option>
//             </select>
//           </div>

//           {/* Financial Fields */}
//           <div className="modal-field">
//             <label htmlFor="amountreceived" className="block text-sm font-semibold text-gray-700 mb-1">
//               Amount Received
//             </label>
//             <input
//               type="number"
//               step="0.01"
//               id="amountreceived"
//               name="amountreceived"
//               value={formData.amountreceived}
//               onChange={handleChange}
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             />
//           </div>

//           <div className="modal-field">
//             <label htmlFor="checknumber" className="block text-sm font-semibold text-gray-700 mb-1">
//               Check No.
//             </label>
//             <input
//               type="text"
//               id="checknumber"
//               name="checknumber"
//               value={formData.checknumber}
//               onChange={handleChange}
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             />
//           </div>

//           {/* Reminders */}
//           <div className="modal-field">
//             <label htmlFor="reminders" className="block text-sm font-semibold text-gray-700 mb-1">
//               Reminders
//             </label>
//             <select
//               id="reminders"
//               name="reminders"
//               value={formData.reminders}
//               onChange={handleChange}
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             >
//               <option value="Y">Yes</option>
//               <option value="N">No</option>
//             </select>
//           </div>

//           {/* URL Fields */}
//           <div className="modal-field">
//             <label htmlFor="invoiceurl" className="block text-sm font-semibold text-gray-700 mb-1">
//               Invoice URL
//             </label>
//             <input
//               type="url"
//               id="invoiceurl"
//               name="invoiceurl"
//               value={formData.invoiceurl}
//               onChange={handleChange}
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             />
//           </div>

//           <div className="modal-field">
//             <label htmlFor="checkurl" className="block text-sm font-semibold text-gray-700 mb-1">
//               Check URL
//             </label>
//             <input
//               type="url"
//               id="checkurl"
//               name="checkurl"
//               value={formData.checkurl}
//               onChange={handleChange}
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             />
//           </div>

//           {/* Notes */}
//           <div className="modal-field">
//             <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-1">
//               Notes
//             </label>
//             <textarea
//               id="notes"
//               name="notes"
//               value={formData.notes}
//               onChange={handleChange}
//               rows={3}
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//             />
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? "Adding..." : "Add Invoice"}
//         </button>
//       </form>
//     </Modal>
//   );
// };

// export default AddRowModal;









import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

interface AddRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (formData: any) => Promise<void>;
  refreshData?: () => Promise<void>;
  clients?: { id: number; pname: string; }[];
}

interface InvoiceOption {
  id: number;
  pname: string;
  // Add other fields if needed
}

const AddRowModal: React.FC<AddRowModalProps> = ({ isOpen, onClose, refreshData, onSubmit, clients }) => {
  const [formData, setFormData] = useState({
    invoicenumber: '',
    startdate: '',
    enddate: '',
    invoicedate: '',
    quantity: '',
    otquantity: '0.0', // Default value
    status: 'Open',
    amountreceived: 0.0000,
    releaseddate: null,
    receiveddate: null,
    checknumber: '',
    invoiceurl: '',
    checkurl: '',
    reminders: 'Y', // Default value
    remindertype: 'Open', // Default value
    emppaiddate: null,
    candpaymentstatus: 'Open', // Default value
    poid: '',
    notes: '',
    lastmoddatetime: '',
  });

  const [invoiceOptions, setInvoiceOptions] = useState<InvoiceOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchInvoiceOptions();
    }
  }, [isOpen]);

  const fetchInvoiceOptions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/invoices`, {
        headers: { AuthToken: localStorage.getItem("token") },
      });

      // Just use the raw data
      setInvoiceOptions(response.data);
      console.log("Raw data being set:", response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        poid: formData.poid, // This should now be the ID
      };

      if (onSubmit) {
        await onSubmit(payload);
      } else if (refreshData) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/invoices/bypo/post/`, payload, {
          headers: { AuthToken: localStorage.getItem("token") },
        });
        await refreshData();
      }

      onClose();
    } catch (error) {
      console.error("Error adding row:", error);
    } finally {
      setIsSubmitting(false);
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
    >
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
        >
          &times;
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Add Invoice</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="modal-field">
            <label htmlFor="invoicenumber" className="block text-sm font-semibold text-gray-700 mb-1">
              Invoice No. *
            </label>
            <input
              type="text"
              id="invoicenumber"
              name="invoicenumber"
              value={formData.invoicenumber}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            />
          </div>

          <div className="modal-field">
            <label htmlFor="poid" className="block text-sm font-semibold text-gray-700 mb-1">
              PO ID *
            </label>
            <select
              id="poid"
              name="poid"
              value={formData.poid}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
              disabled={isLoading}
            >
              <option value="">Select PO ID</option>
              {(clients || invoiceOptions).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.pname}
                </option>
              ))}
            </select>
            {isLoading && (
              <p className="text-xs text-gray-500 mt-1">Loading PO IDs...</p>
            )}
          </div>

          {/* Date Fields */}
          <div className="modal-field">
            <label htmlFor="startdate" className="block text-sm font-semibold text-gray-700 mb-1">
              Start Date *
            </label>
            <input
              type="date"
              id="startdate"
              name="startdate"
              value={formData.startdate}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            />
          </div>

          <div className="modal-field">
            <label htmlFor="enddate" className="block text-sm font-semibold text-gray-700 mb-1">
              End Date *
            </label>
            <input
              type="date"
              id="enddate"
              name="enddate"
              value={formData.enddate}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            />
          </div>

          <div className="modal-field">
            <label htmlFor="invoicedate" className="block text-sm font-semibold text-gray-700 mb-1">
              Invoice Date *
            </label>
            <input
              type="date"
              id="invoicedate"
              name="invoicedate"
              value={formData.invoicedate}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            />
          </div>

          <div className="modal-field">
            <label htmlFor="receiveddate" className="block text-sm font-semibold text-gray-700 mb-1">
              Received Date
            </label>
            <input
              type="date"
              id="receiveddate"
              name="receiveddate"
              value={formData.receiveddate}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>

          <div className="modal-field">
            <label htmlFor="releaseddate" className="block text-sm font-semibold text-gray-700 mb-1">
              Released Date
            </label>
            <input
              type="date"
              id="releaseddate"
              name="releaseddate"
              value={formData.releaseddate}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>

          <div className="modal-field">
            <label htmlFor="emppaiddate" className="block text-sm font-semibold text-gray-700 mb-1">
              Candidate Paid Date
            </label>
            <input
              type="date"
              id="emppaiddate"
              name="emppaiddate"
              value={formData.emppaiddate}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>

          {/* Quantity Fields */}
          <div className="modal-field">
            <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 mb-1">
              Quantity *
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            />
          </div>

          <div className="modal-field">
            <label htmlFor="otquantity" className="block text-sm font-semibold text-gray-700 mb-1">
              OT Quantity
            </label>
            <input
              type="number"
              id="otquantity"
              name="otquantity"
              value={formData.otquantity}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>

          {/* Status Fields */}
          <div className="modal-field">
            <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Void">Void</option>
            </select>
          </div>

          <div className="modal-field">
            <label htmlFor="candpaymentstatus" className="block text-sm font-semibold text-gray-700 mb-1">
              Cand. Payment Status
            </label>
            <select
              id="candpaymentstatus"
              name="candpaymentstatus"
              value={formData.candpaymentstatus}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            >
              <option value="Open">Open</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Financial Fields */}
          <div className="modal-field">
            <label htmlFor="amountreceived" className="block text-sm font-semibold text-gray-700 mb-1">
              Amount Received
            </label>
            <input
              type="number"
              step="0.01"
              id="amountreceived"
              name="amountreceived"
              value={formData.amountreceived}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>

          <div className="modal-field">
            <label htmlFor="checknumber" className="block text-sm font-semibold text-gray-700 mb-1">
              Check No.
            </label>
            <input
              type="text"
              id="checknumber"
              name="checknumber"
              value={formData.checknumber}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>

          {/* Reminders */}
          <div className="modal-field">
            <label htmlFor="reminders" className="block text-sm font-semibold text-gray-700 mb-1">
              Reminders
            </label>
            <select
              id="reminders"
              name="reminders"
              value={formData.reminders}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            >
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </select>
          </div>

          {/* URL Fields */}
          <div className="modal-field">
            <label htmlFor="invoiceurl" className="block text-sm font-semibold text-gray-700 mb-1">
              Invoice URL
            </label>
            <input
              type="url"
              id="invoiceurl"
              name="invoiceurl"
              value={formData.invoiceurl}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>

          <div className="modal-field">
            <label htmlFor="checkurl" className="block text-sm font-semibold text-gray-700 mb-1">
              Check URL
            </label>
            <input
              type="url"
              id="checkurl"
              name="checkurl"
              value={formData.checkurl}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>

          {/* Notes */}
          <div className="modal-field">
            <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Invoice"}
        </button>
      </form>
    </Modal>
  );
};

export default AddRowModal;

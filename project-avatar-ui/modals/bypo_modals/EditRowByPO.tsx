import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import axios from "axios";

// // new-projects-avatar-fullstack/project-avatar-ui/modals/bypo_modals/EditRowByPO.tsx

// import React, { useState, useEffect } from 'react';
// import Modal from 'react-modal';
// import axios from 'axios';
// import { ByMonth } from '@/types';

// interface InvoiceOption {
//   id: number;
//   pname: string;
// }

// interface EditRowModalProps {
//   isOpen: boolean;
//   onRequestClose: () => void;
//   rowData: ByMonth;
//   onSave: () => Promise<void>;
// }

// const EditRowModal: React.FC<EditRowModalProps> = ({ isOpen, onRequestClose, rowData, onSave }) => {
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

//   useEffect(() => {
//     if (isOpen) {
//       fetchInvoiceOptions();
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     if (rowData) {
//       setFormData({
//         invoicenumber: rowData.invoicenumber || '',
//         startdate: rowData.startdate ? new Date(rowData.startdate).toISOString().split('T')[0] : '',
//         enddate: rowData.enddate ? new Date(rowData.enddate).toISOString().split('T')[0] : '',
//         invoicedate: rowData.invoicedate ? new Date(rowData.invoicedate).toISOString().split('T')[0] : '',
//         quantity: rowData.quantity?.toString() || '',
//         otquantity: rowData.otquantity?.toString() || '',
//         status: rowData.status || 'Open',
//         amountreceived: rowData.amountreceived?.toString() || '',
//         releaseddate: rowData.releaseddate ? new Date(rowData.releaseddate).toISOString().split('T')[0] : '',
//         receiveddate: rowData.receiveddate ? new Date(rowData.receiveddate).toISOString().split('T')[0] : '',
//         checknumber: rowData.checknumber || '',
//         invoiceurl: rowData.invoiceurl || '',
//         checkurl: rowData.checkurl || '',
//         reminders: rowData.reminders || 'Y',
//         remindertype: rowData.remindertype || 'Open',
//         emppaiddate: rowData.emppaiddate ? new Date(rowData.emppaiddate).toISOString().split('T')[0] : '',
//         candpaymentstatus: rowData.candpaymentstatus || 'Open',
//         poid: rowData.poid?.toString() || '',
//         notes: rowData.notes || '',
//         lastmoddatetime: rowData.lastmoddatetime ? new Date(rowData.lastmoddatetime).toISOString().split('T')[0] : '',
//       });
//     }
//   }, [rowData]);

//   const fetchInvoiceOptions = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/invoices`, {
//         headers: { AuthToken: localStorage.getItem("token") },
//       });
      
//       // Map the response data to match our interface
//       const options = response.data.map((item: any) => ({
//         id: item.id,
//         pname: item.pname
//       }));
      
//       setInvoiceOptions(options);
//     } catch (error) {
//       console.error("Error fetching invoice options:", error);
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

//   const handleSave = async () => {
//     try {
//       await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/invoices/put/${rowData.id}`, formData, {
//         headers: { AuthToken: localStorage.getItem("token") },
//       });
//       await onSave();
//       onRequestClose();
//     } catch (error) {
//       console.error("Error updating row:", error);
//     }
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onRequestClose}
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
//           onClick={onRequestClose}
//           className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
//         >
//           &times;
//         </button>
//       </div>
//       <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Edit Invoice</h2>
//       <form className="space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
//               {invoiceOptions.map((invoice) => (
//                 <option key={invoice.id} value={invoice.id}>
//                   {invoice.pname.split('-').slice(0, 3).join('-')}
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
//           <div className="modal-field col-span-2">
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

//           <div className="modal-field col-span-2">
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
//           <div className="modal-field col-span-2">
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
//           type="button"
//           onClick={handleSave}
//           className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
//         >
//           Save Changes
//         </button>
//       </form>
//     </Modal>
//   );
// };

// export default EditRowModal;



interface InvoiceOption {
  id: number;
  pname: string;
  // Add other fields if needed
}

interface EditRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowData: any;
  onSave: () => Promise<void>;
  clients: InvoiceOption[];
  defaultClientId: number;
}

const EditRowModal: React.FC<EditRowModalProps> = ({
  isOpen,
  onClose,
  rowData,
  onSave,
  clients,
  defaultClientId
}) => {
  const [formData, setFormData] = useState({
    invoicenumber: '',
    startdate: '',
    enddate: '',
    invoicedate: '',
    quantity: 0,
    otquantity: 0,
    rate: 0,
    overtimerate: 0,
    status: '',
    emppaiddate: '',
    candpaymentstatus: '',
    reminders: '',
    amountexpected: 0,
    expecteddate: '',
    amountreceived: 0,
    receiveddate: '',
    releaseddate: '',
    checknumber: '',
    invoiceurl: '',
    checkurl: '',
    freqtype: '',
    invoicenet: 0,
    companyname: '',
    vendorfax: '',
    vendorphone: '',
    vendoremail: '',
    timsheetemail: '',
    hrname: '',
    hremail: '',
    hrphone: '',
    managername: '',
    manageremail: '',
    managerphone: '',
    secondaryname: '',
    secondaryemail: '',
    secondaryphone: '',
    candidatename: '',
    candidatephone: '',
    candidateemail: '',
    wrkemail: '',
    wrkphone: '',
    recruitername: '',
    recruiterphone: '',
    recruiteremail: '',
    poid: 0,
    notes: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (rowData) {
      console.log("Row data received in edit modal:", rowData);
      // Format date strings to YYYY-MM-DD for HTML date inputs
      const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return '';
        try {
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) return ''; // Invalid date
          return date.toISOString().split('T')[0];
        } catch (e) {
          return '';
        }
      };

      setFormData({
        invoicenumber: rowData.invoicenumber || '',
        startdate: formatDate(rowData.startdate),
        enddate: formatDate(rowData.enddate),
        invoicedate: formatDate(rowData.invoicedate),
        quantity: rowData.quantity || 0,
        otquantity: rowData.otquantity || 0,
        rate: rowData.rate || 0,
        overtimerate: rowData.overtimerate || 0,
        status: rowData.status || '',
        emppaiddate: formatDate(rowData.emppaiddate),
        candpaymentstatus: rowData.candpaymentstatus || '',
        reminders: rowData.reminders || '',
        amountexpected: rowData.amountexpected || 0,
        expecteddate: formatDate(rowData.expecteddate),
        amountreceived: rowData.amountreceived || 0,
        receiveddate: formatDate(rowData.receiveddate),
        releaseddate: formatDate(rowData.releaseddate),
        checknumber: rowData.checknumber || '',
        invoiceurl: rowData.invoiceurl || '',
        checkurl: rowData.checkurl || '',
        freqtype: rowData.freqtype || '',
        invoicenet: rowData.invoicenet || 0,
        companyname: rowData.companyname || '',
        vendorfax: rowData.vendorfax || '',
        vendorphone: rowData.vendorphone || '',
        vendoremail: rowData.vendoremail || '',
        timsheetemail: rowData.timsheetemail || '',
        hrname: rowData.hrname || '',
        hremail: rowData.hremail || '',
        hrphone: rowData.hrphone || '',
        managername: rowData.managername || '',
        manageremail: rowData.manageremail || '',
        managerphone: rowData.managerphone || '',
        secondaryname: rowData.secondaryname || '',
        secondaryemail: rowData.secondaryemail || '',
        secondaryphone: rowData.secondaryphone || '',
        candidatename: rowData.candidatename || '',
        candidatephone: rowData.candidatephone || '',
        candidateemail: rowData.candidateemail || '',
        wrkemail: rowData.wrkemail || '',
        wrkphone: rowData.wrkphone || '',
        recruitername: rowData.recruitername || '',
        recruiterphone: rowData.recruiterphone || '',
        recruiteremail: rowData.recruiteremail || '',
        poid: rowData.poid || defaultClientId || 0,
        notes: rowData.notes || '',
      });
    }
  }, [rowData, defaultClientId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'otquantity' || name === 'rate' ||
              name === 'overtimerate' || name === 'amountexpected' ||
              name === 'amountreceived' || name === 'invoicenet' || name === 'poid'
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/invoices/put/${rowData.id}`,
        formData
      );
      await onSave();
      onClose();
    } catch (error) {
      console.error("Error updating invoice:", error);
    } finally {
      setIsLoading(false);
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
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Invoice</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
              <input
                type="text"
                name="invoicenumber"
                value={formData.invoicenumber}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">PO ID</label>
              <select
                name="poid"
                value={formData.poid}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                disabled={isLoading}
              >
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.pname}
                  </option>
                ))}
              </select>
            </div>

            {/* Dates */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                name="startdate"
                value={formData.startdate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                name="enddate"
                value={formData.enddate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Invoice Date</label>
              <input
                type="date"
                name="invoicedate"
                value={formData.invoicedate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Received Date</label>
              <input
                type="date"
                name="receiveddate"
                value={formData.receiveddate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Released Date</label>
              <input
                type="date"
                name="releaseddate"
                value={formData.releaseddate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Candidate Paid Date</label>
              <input
                type="date"
                name="emppaiddate"
                value={formData.emppaiddate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Quantities */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">OT Quantity</label>
              <input
                type="number"
                name="otquantity"
                value={formData.otquantity}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Rate</label>
              <input
                type="number"
                step="0.01"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Overtime Rate</label>
              <input
                type="number"
                step="0.01"
                name="overtimerate"
                value={formData.overtimerate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="Void">Void</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Candidate Payment Status</label>
              <select
                name="candpaymentstatus"
                value={formData.candpaymentstatus}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="Open">Open</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Financial */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Amount Expected</label>
              <input
                type="number"
                step="0.01"
                name="amountexpected"
                value={formData.amountexpected}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Amount Received</label>
              <input
                type="number"
                step="0.01"
                name="amountreceived"
                value={formData.amountreceived}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Invoice Net</label>
              <input
                type="number"
                step="0.01"
                name="invoicenet"
                value={formData.invoicenet}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Other fields */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Check Number</label>
              <input
                type="text"
                name="checknumber"
                value={formData.checknumber}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Invoice URL</label>
              <input
                type="url"
                name="invoiceurl"
                value={formData.invoiceurl}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Check URL</label>
              <input
                type="url"
                name="checkurl"
                value={formData.checkurl}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Frequency Type</label>
              <input
                type="text"
                name="freqtype"
                value={formData.freqtype}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Reminders</label>
              <select
                name="reminders"
                value={formData.reminders}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="Y">Yes</option>
                <option value="N">No</option>
              </select>
            </div>

            {/* Company Information */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                name="companyname"
                value={formData.companyname}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Vendor Fax</label>
              <input
                type="text"
                name="vendorfax"
                value={formData.vendorfax}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Vendor Phone</label>
              <input
                type="text"
                name="vendorphone"
                value={formData.vendorphone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Vendor Email</label>
              <input
                type="email"
                name="vendoremail"
                value={formData.vendoremail}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Timesheet Email</label>
              <input
                type="email"
                name="timsheetemail"
                value={formData.timsheetemail}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Notes */}
            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditRowModal;

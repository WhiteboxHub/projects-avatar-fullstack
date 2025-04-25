// // // new-projects-avatar-fullstack/project-avatar-ui/modals/bymonth_modals/EditRowByMonth.tsx


// import React, { useState, useEffect } from 'react';
// import Modal from 'react-modal';
// import axios from 'axios';
// import { ByMonth } from '@/types';

// interface FormData {
//   poid: string;
//   invoicenumber: string; // Updated field name
//   startdate: string; // Updated field name
//   enddate: string; // Updated field name
//   invoicedate: string; // Updated field name
//   quantity: string;
//   otquantity: string; // Updated field name
//   status: string;
//   emppaiddate: string; // Updated field name
//   candpaymentstatus: string; // Updated field name
//   reminders: string;
//   amountreceived: string; // Updated field name
//   receiveddate: string; // Updated field name
//   releaseddate: string; // Updated field name
//   checknumber: string; // Updated field name
//   invoiceurl: string; // Updated field name
//   checkurl: string; // Updated field name
//   notes: string;
// }

// interface EditRowModalProps {
//   isOpen: boolean;
//   onRequestClose: () => void;
//   rowData: ByMonth; // Use the actual type for your row data
//   onSave: () => Promise<void>; // Add this line
// }

// const EditRowModal: React.FC<EditRowModalProps> = ({ isOpen, onRequestClose, rowData, onSave }) => {
//   const [formData, setFormData] = useState<FormData>({
//     poid: '',
//     invoicenumber: '', // Updated field name
//     startdate: '', // Updated field name
//     enddate: '', // Updated field name
//     invoicedate: '', // Updated field name
//     quantity: '',
//     otquantity: '', // Updated field name
//     status: 'Open',
//     emppaiddate: '', // Updated field name
//     candpaymentstatus: 'Open', // Updated field name
//     reminders: 'N',
//     amountreceived: '', // Updated field name
//     receiveddate: '', // Updated field name
//     releaseddate: '', // Updated field name
//     checknumber: '', // Updated field name
//     invoiceurl: '', // Updated field name
//     checkurl: '', // Updated field name
//     notes: '',
//   });

//   const [poidList, setPoidList] = useState<{ id: string; pname: string }[]>([]);

//   useEffect(() => {
//     const fetchPoidList = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pname-list/`, {
//           headers: { AuthToken: localStorage.getItem('token') },
//         });
//         setPoidList(response.data.filter((item: { id: string; pname: string }) => item.id !== null));
//       } catch (error) {
//         console.error('Error fetching POID list:', error);
//       }
//     };

//     fetchPoidList();
//   }, []);

//   useEffect(() => {
//     if (rowData) {
//       setFormData({
//         poid: rowData.poid || '',
//         invoicenumber: rowData.invoicenumber || '', // Updated field name
//         startdate: rowData.startdate || '', // Updated field name
//         enddate: rowData.enddate || '', // Updated field name
//         invoicedate: rowData.invoicedate || '', // Updated field name
//         quantity: rowData.quantity || '',
//         otquantity: rowData.otquantity || '', // Updated field name
//         status: rowData.status || 'Open',
//         emppaiddate: rowData.emppaiddate || '', // Updated field name
//         candpaymentstatus: rowData.candpaymentstatus || 'Open', // Updated field name
//         reminders: rowData.reminders || 'N',
//         amountreceived: rowData.amountreceived || '', // Updated field name
//         receiveddate: rowData.receiveddate || '', // Updated field name
//         releaseddate: rowData.releaseddate || '', // Updated field name
//         checknumber: rowData.checknumber || '', // Updated field name
//         invoiceurl: rowData.invoiceurl || '', // Updated field name
//         checkurl: rowData.checkurl || '', // Updated field name
//         notes: rowData.notes || '',
//       });
//     }
//   }, [rowData]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/invoices/put/${rowData.id}`, formData, {
//         headers: { AuthToken: localStorage.getItem('token') },
//       });
//       await onSave();
//       onRequestClose();
//     } catch (error) {
//       console.error('Error updating invoice:', error);
//     }
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onRequestClose}
//       shouldCloseOnOverlayClick={true} // Add this
//       shouldCloseOnEsc={true} // Add this
//       style={{
//         content: {
//           top: '50%',
//           left: '50%',
//           right: 'auto',
//           bottom: 'auto',
//           transform: 'translate(-50%, -50%)',
//           maxWidth: '600px',
//           width: '90%',
//           maxHeight: '80vh',
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
//           onClick={(e) => {
//             e.stopPropagation(); // Prevent event bubbling
//             onRequestClose();
//           }}
//           className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200 bg-transparent border-none cursor-pointer focus:outline-none"
//         >
//           &times;
//         </button>
//       </div>
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Invoice</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="modal-field">
//           <label htmlFor="poid" className="block text-gray-700 font-semibold mb-1">
//             POID *
//           </label>
//           <select
//             id="poid"
//             name="poid"
//             value={formData.poid}
//             onChange={handleChange}
//             required
//             className="w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             <option value="" disabled>Select POID</option>
//             {poidList.map((poid) => (
//               <option key={poid.id} value={poid.id} className="text-gray-800">
//                 {poid.pname}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="modal-field">
//           <label htmlFor="invoicenumber" className="block text-sm font-semibold text-gray-700 mb-1">
//             Invoice No. *
//           </label>
//           <input
//             type="text"
//             id="invoicenumber"
//             name="invoicenumber"
//             value={formData.invoicenumber}
//             onChange={handleChange}
//             required
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>

//         <div className="modal-field">
//           <label htmlFor="startdate" className="block text-sm font-semibold text-gray-700 mb-1">
//             Start Date
//           </label>
//           <input
//             type="date"
//             id="startdate"
//             name="startdate"
//             value={formData.startdate}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>

//         <div className="modal-field">
//           <label htmlFor="enddate" className="block text-sm font-semibold text-gray-700 mb-1">
//             End Date
//           </label>
//           <input
//             type="date"
//             id="enddate"
//             name="enddate"
//             value={formData.enddate}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>

//         <div className="modal-field">
//           <label htmlFor="invoicedate" className="block text-sm font-semibold text-gray-700 mb-1">
//             Invoice Date
//           </label>
//           <input
//             type="date"
//             id="invoicedate"
//             name="invoicedate"
//             value={formData.invoicedate}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>

//         <div className="modal-field">
//           <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 mb-1">
//             Quantity
//           </label>
//           <input
//             type="text"
//             id="quantity"
//             name="quantity"
//             value={formData.quantity}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>

//         <div className="modal-field">
//           <label htmlFor="otquantity" className="block text-sm font-semibold text-gray-700 mb-1">
//             OT Quantity
//           </label>
//           <input
//             type="text"
//             id="otquantity"
//             name="otquantity"
//             value={formData.otquantity}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>

//         <div className="modal-field">
//           <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1">
//             Status *
//           </label>
//           <select
//             id="status"
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             <option value="Open">Open</option>
//             <option value="Closed">Closed</option>
//             <option value="Void">Void</option>
//             <option value="Delete">Delete</option>
//           </select>
//         </div>

//         <div className="modal-field">
//           <label htmlFor="emppaiddate" className="block text-sm font-semibold text-gray-700 mb-1">
//             Candidate Paid Date
//           </label>
//           <input
//             type="date"
//             id="emppaiddate"
//             name="emppaiddate"
//             value={formData.emppaiddate}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>

//         <div className="modal-field">
//           <label htmlFor="candpaymentstatus" className="block text-sm font-semibold text-gray-700 mb-1">
//             Candidate Payment Status *
//           </label>
//           <select
//             id="candpaymentstatus"
//             name="candpaymentstatus"
//             value={formData.candpaymentstatus}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             <option value="Open">Open</option>
//             <option value="Pending">Pending</option>
//             <option value="Suspended">Suspended</option>
//             <option value="Closed">Closed</option>
//           </select>
//         </div>

//         <div className="modal-field">
//           <label htmlFor="reminders" className="block text-sm font-semibold text-gray-700 mb-1">
//             Reminders *
//           </label>
//           <select
//             id="reminders"
//             name="reminders"
//             value={formData.reminders}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           >
//             <option value="Y">Y</option>
//             <option value="N">N</option>
//           </select>
//         </div>

//         <div className="modal-field">
//           <label htmlFor="amountreceived" className="block text-sm font-semibold text-gray-700 mb-1">
//             Received
//           </label>
//           <input
//             type="text"
//             id="amountreceived"
//             name="amountreceived"
//             value={formData.amountreceived}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>

//         <div className="modal-field">
//           <label htmlFor="receiveddate" className="block text-sm font-semibold text-gray-700 mb-1">
//             Received Date
//           </label>
//           <input
//             type="date"
//             id="receiveddate"
//             name="receiveddate"
//             value={formData.receiveddate}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>

//         <div className="modal-field">
//           <label htmlFor="releaseddate" className="block text-sm font-semibold text-gray-700 mb-1">
//             Released Date
//           </label>
//           <input
//             type="date"
//             id="releaseddate"
//             name="releaseddate"
//             value={formData.releaseddate}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>

//         <div className="modal-field">
//           <label htmlFor="checknumber" className="block text-sm font-semibold text-gray-700 mb-1">
//             Check No.
//           </label>
//           <input
//             type="text"
//             id="checknumber"
//             name="checknumber"
//             value={formData.checknumber}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>

//         <div className="modal-field">
//           <label htmlFor="invoiceurl" className="block text-sm font-semibold text-gray-700 mb-1">
//             Invoice Url
//           </label>
//           <input
//             type="text"
//             id="invoiceurl"
//             name="invoiceurl"
//             value={formData.invoiceurl}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>

//         <div className="modal-field">
//           <label htmlFor="checkurl" className="block text-sm font-semibold text-gray-700 mb-1">
//             Check Url
//           </label>
//           <input
//             type="text"
//             id="checkurl"
//             name="checkurl"
//             value={formData.checkurl}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>

//         <div className="modal-field md:col-span-2">
//           <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-1">
//             Notes
//           </label>
//           <input
//             type="text"
//             id="notes"
//             name="notes"
//             value={formData.notes}
//             onChange={handleChange}
//             className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//           />
//         </div>

//         <div className="md:col-span-2">
//           <button
//             type="submit"
//             className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
//           >
//             Save Changes
//           </button>
//         </div>
//       </form>
//     </Modal>
//   );
// };

// export default EditRowModal;




import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';


interface FormData {
  poid: string;
  invoicenumber: string;
  startdate: string;
  enddate: string;
  invoicedate: string;
  quantity: string;
  otquantity: string;
  status: string;
  emppaiddate: string;
  candpaymentstatus: string;
  reminders: string;
  amountreceived: string;
  receiveddate: string;
  releaseddate: string;
  checknumber: string;
  invoiceurl: string;
  checkurl: string;
  notes: string;
}

interface EditRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowData: any;
  onSave: () => Promise<void>;
  clients: { id: number; pname: string; }[];
  defaultClientId: string | number;
}

const EditRowModal: React.FC<EditRowModalProps> = ({ isOpen, onClose, rowData, onSave, clients, defaultClientId }) => {
  const [formData, setFormData] = useState<FormData>({
    poid: '',
    invoicenumber: '',
    startdate: '',
    enddate: '',
    invoicedate: '',
    quantity: '',
    otquantity: '',
    status: 'Open',
    emppaiddate: '',
    candpaymentstatus: 'Open',
    reminders: 'N',
    amountreceived: '',
    receiveddate: '',
    releaseddate: '',
    checknumber: '',
    invoiceurl: '',
    checkurl: '',
    notes: '',
  });

  const [poidList, setPoidList] = useState<{ id: string; pname: string }[]>([]);

  useEffect(() => {
    const fetchPoidList = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pname-list/`, {
          headers: { AuthToken: localStorage.getItem('token') },
        });
        setPoidList(response.data.filter((item: { id: string; pname: string }) => item.id !== null));
      } catch (error) {
        console.error('Error fetching POID list:', error);
      }
    };

    fetchPoidList();
  }, []);

  useEffect(() => {
    if (rowData) {
      setFormData({
        poid: rowData.poid || '',
        invoicenumber: rowData.invoicenumber || '',
        startdate: rowData.startdate || '',
        enddate: rowData.enddate || '',
        invoicedate: rowData.invoicedate || '',
        quantity: rowData.quantity || '',
        otquantity: rowData.otquantity || '',
        status: rowData.status || 'Open',
        emppaiddate: rowData.emppaiddate || '',
        candpaymentstatus: rowData.candpaymentstatus || 'Open',
        reminders: rowData.reminders || 'N',
        amountreceived: rowData.amountreceived || '',
        receiveddate: rowData.receiveddate || '',
        releaseddate: rowData.releaseddate || '',
        checknumber: rowData.checknumber || '',
        invoiceurl: rowData.invoiceurl || '',
        checkurl: rowData.checkurl || '',
        notes: rowData.notes || '',
      });
    }
  }, [rowData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/invoices/put/${rowData.id}`, formData, {
        headers: { AuthToken: localStorage.getItem('token') },
      });
      await onSave();
      onClose();
    } catch (error) {
      console.error('Error updating invoice:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      style={{
        content: {
          top: '50%',
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
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200 bg-transparent border-none cursor-pointer focus:outline-none"
        >
          &times;
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Invoice</h2>


      <form onSubmit={handleSubmit} className="space-y-4">


        <div className="modal-field">
          <label htmlFor="poid" className="block text-gray-700 font-semibold mb-1">
            POID *
          </label>
          <select
            id="poid"
            name="poid"
            value={formData.poid}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="" disabled>Select POID</option>
            {poidList.map((poid) => (
              <option key={poid.id} value={poid.id} className="text-gray-800">
                {poid.pname}
              </option>
            ))}
          </select>
        </div>

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
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field">
          <label htmlFor="startdate" className="block text-sm font-semibold text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="startdate"
            name="startdate"
            value={formData.startdate}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field">
          <label htmlFor="enddate" className="block text-sm font-semibold text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            id="enddate"
            name="enddate"
            value={formData.enddate}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field">
          <label htmlFor="invoicedate" className="block text-sm font-semibold text-gray-700 mb-1">
            Invoice Date
          </label>
          <input
            type="date"
            id="invoicedate"
            name="invoicedate"
            value={formData.invoicedate}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field">
          <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="text"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field">
          <label htmlFor="otquantity" className="block text-sm font-semibold text-gray-700 mb-1">
            OT Quantity
          </label>
          <input
            type="text"
            id="otquantity"
            name="otquantity"
            value={formData.otquantity}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field">
          <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1">
            Status *
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
            <option value="Delete">Delete</option>
          </select>
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

        <div className="modal-field">
          <label htmlFor="candpaymentstatus" className="block text-sm font-semibold text-gray-700 mb-1">
            Candidate Payment Status *
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

        <div className="modal-field">
          <label htmlFor="reminders" className="block text-sm font-semibold text-gray-700 mb-1">
            Reminders *
          </label>
          <select
            id="reminders"
            name="reminders"
            value={formData.reminders}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="Y">Y</option>
            <option value="N">N</option>
          </select>
        </div>

        <div className="modal-field">
          <label htmlFor="amountreceived" className="block text-sm font-semibold text-gray-700 mb-1">
            Received
          </label>
          <input
            type="text"
            id="amountreceived"
            name="amountreceived"
            value={formData.amountreceived}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
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

        <div className="modal-field">
          <label htmlFor="invoiceurl" className="block text-sm font-semibold text-gray-700 mb-1">
            Invoice Url
          </label>
          <input
            type="text"
            id="invoiceurl"
            name="invoiceurl"
            value={formData.invoiceurl}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field">
          <label htmlFor="checkurl" className="block text-sm font-semibold text-gray-700 mb-1">
            Check Url
          </label>
          <input
            type="text"
            id="checkurl"
            name="checkurl"
            value={formData.checkurl}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field md:col-span-2">
          <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-1">
            Notes
          </label>
          <input
            type="text"
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditRowModal;

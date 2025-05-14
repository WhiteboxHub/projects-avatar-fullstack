import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface InvoiceData {
  id: number;
  invoicenumber: string;
  startdate: string;
  enddate: string;
  invoicedate: string;
  invmonth: string;
  quantity: number;
  otquantity: number;
  rate: number;
  overtimerate: number;
  status: string;
  emppaiddate: string;
  candpaymentstatus: string;
  reminders: string;
  amountexpected: number;
  expecteddate: string;
  amountreceived: number;
  receiveddate: string;
  releaseddate: string;
  checknumber: string;
  invoiceurl: string;
  checkurl: string;
  freqtype: string;
  invoicenet: number;
  companyname: string;
  vendorfax: string;
  vendorphone: string;
  vendoremail: string;
  timsheetemail: string;
  hrname: string;
  hremail: string;
  hrphone: string;
  managername: string;
  manageremail: string;
  managerphone: string;
  secondaryname: string;
  secondaryemail: string;
  secondaryphone: string;
  candidatename: string;
  candidatephone: string;
  candidateemail: string;
  wrkemail: string;
  wrkphone: string;
  recruitername: string;
  recruiterphone: string;
  recruiteremail: string;
  poid: number;
  notes: string;
  placementid: number;
}

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

interface AddRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: InvoiceData) => Promise<void>;
  clients: { id: number; pname: string; }[];
}

const AddRowModal: React.FC<AddRowModalProps> = ({ isOpen, onClose, onSubmit, clients }) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Convert FormData to InvoiceData with default values for missing properties
      const invoiceData: InvoiceData = {
        id: 0, 
        invoicenumber: formData.invoicenumber,
        startdate: formData.startdate,
        enddate: formData.enddate,
        invoicedate: formData.invoicedate,
        invmonth: '',
        quantity: Number(formData.quantity) || 0,
        otquantity: Number(formData.otquantity) || 0,
        rate: 0, 
        overtimerate: 0, 
        status: formData.status,
        emppaiddate: formData.emppaiddate,
        candpaymentstatus: formData.candpaymentstatus,
        reminders: formData.reminders,
        amountexpected: 0, 
        expecteddate: '', 
        amountreceived: Number(formData.amountreceived) || 0,
        receiveddate: formData.receiveddate,
        releaseddate: formData.releaseddate,
        checknumber: formData.checknumber,
        invoiceurl: formData.invoiceurl,
        checkurl: formData.checkurl,
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
        poid: Number(formData.poid) || 0,
        notes: formData.notes,
        placementid: 0, // Added the required placementid property
      };
      
      await onSubmit(invoiceData);
      onClose();
    } catch (error) {
      console.error('Error adding invoice:', error);
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
          onClick={onClose}
          className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
        >
          &times;
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Invoice</h2>

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
            {clients.map((client) => (
              <option key={client.id} value={client.id} className="text-gray-800">
                {client.pname}
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
            Employee Paid Date
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
            Amount Received
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
            Invoice URL
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
            Check URL
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
            Add Invoice
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddRowModal;
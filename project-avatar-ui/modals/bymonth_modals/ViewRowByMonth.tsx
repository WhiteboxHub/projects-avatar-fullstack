import React from 'react';
import Modal from 'react-modal';
import { AiOutlineClose } from 'react-icons/ai';

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
}

interface ViewRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceData | null;
}

const ViewRowModal: React.FC<ViewRowModalProps> = ({ isOpen, onClose, invoice }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        content: {
          top: '55%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, -50%)',
          maxWidth: '800px',
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
      contentLabel="View Invoice Modal"
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

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Invoice Details</h2>

      <div className="modal-body">
        {invoice ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="modal-field">
              <label htmlFor="Company Name">Company Name</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.companyname || 'N/A'}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Invoice Number">Invoice Number</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.invoicenumber || 'N/A'}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Status">Status</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.status || 'N/A'}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Invoice Net">Invoice Net</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.invoicenet ? `$${invoice.invoicenet.toFixed(2)}` : 'N/A'}
              </div>
            </div>

            {/* Month Information */}
            <div className="modal-field">
              <label htmlFor="Month">Month</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.invmonth || 'N/A'}
              </div>
            </div>

            {/* Dates */}
            <div className="modal-field">
              <label htmlFor="Start Date">Start Date</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.startdate || 'N/A'}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="End Date">End Date</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.enddate || 'N/A'}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Invoice Date">Invoice Date</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.invoicedate || 'N/A'}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="EMP Paid Date">EMP Paid Date</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.emppaiddate || 'N/A'}
              </div>
            </div>

            {/* Financial Information */}
            <div className="modal-field">
              <label htmlFor="Quantity">Quantity</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.quantity || 'N/A'}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Rate">Rate</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.rate ? `$${invoice.rate.toFixed(2)}` : 'N/A'}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="OT Quantity">OT Quantity</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.otquantity || 'N/A'}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Overtime Rate">Overtime Rate</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.overtimerate ? `$${invoice.overtimerate.toFixed(2)}` : 'N/A'}
              </div>
            </div>

            {/* Payment Information */}
            <div className="modal-field">
              <label htmlFor="Amount Expected">Amount Expected</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.amountexpected ? `$${invoice.amountexpected.toFixed(2)}` : 'N/A'}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Expected Date">Expected Date</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.expecteddate || 'N/A'}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Amount Received">Amount Received</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.amountreceived ? `$${invoice.amountreceived.toFixed(2)}` : 'N/A'}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Received Date">Received Date</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.receiveddate || 'N/A'}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Released Date">Released Date</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.releaseddate || 'N/A'}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Candidate Payment Status">Candidate Payment Status</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.candpaymentstatus || 'N/A'}
              </div>
            </div>

            {/* Contact Information */}
            <div className="modal-field">
              <label htmlFor="HR Name">HR Name</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.hrname || 'N/A'}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="HR Email">HR Email</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.hremail || 'N/A'}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="HR Phone">HR Phone</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.hrphone || 'N/A'}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Manager Name">Manager Name</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.managername || 'N/A'}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Manager Email">Manager Email</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.manageremail || 'N/A'}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Manager Phone">Manager Phone</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.managerphone || 'N/A'}
              </div>
            </div>

            {/* Candidate Information */}
            <div className="modal-field">
              <label htmlFor="Candidate Name">Candidate Name</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.candidatename || 'N/A'}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Candidate Email">Candidate Email</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.candidateemail || 'N/A'}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Candidate Phone">Candidate Phone</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.candidatephone || 'N/A'}
              </div>
            </div>

            {/* Additional Information */}
            <div className="modal-field">
              <label htmlFor="Check Number">Check Number</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.checknumber || 'N/A'}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Reminders">Reminders</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.reminders || 'N/A'}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Invoice URL">Invoice URL</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.invoiceurl ? (
                  <a href={invoice.invoiceurl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    View Invoice
                  </a>
                ) : 'N/A'}
              </div>
            </div>

            <div className="modal-field">
              <label htmlFor="Check URL">Check URL</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline">
                {invoice.checkurl ? (
                  <a href={invoice.checkurl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    View Check
                  </a>
                ) : 'N/A'}
              </div>
            </div>

            <div className="modal-field col-span-1 md:col-span-2">
              <label htmlFor="Notes">Notes</label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline min-h-[100px]">
                {invoice.notes || 'N/A'}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No invoice data available</p>
        )}
      </div>
    </Modal>
  );
};

export default ViewRowModal;
import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface InvoiceOption {
  id: number;
  pname: string;
}

interface FormDataType {
  invoicenumber: string;
  startdate: string;
  enddate: string;
  invoicedate: string;
  quantity: number;
  otquantity: number;
  rate: number;
  overtimerate: number;
  status: string;
  emppaiddate: string;
  candpaymentstatus: string;
  reminders: string;
  remindertype?: string;
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
  const [formData, setFormData] = useState<FormDataType>({
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
    remindertype: 'Open',
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
        remindertype: rowData.remindertype || 'Open',
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
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Void">Void</option>
                <option value="Closed">Closed</option>
                <option value="Deny">Deny</option>
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

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Reminder Type</label>
              <select
                name="remindertype"
                value={formData.remindertype}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="Open">Open</option>
                <option value="Warning">Warning</option>
                <option value="Warn-Candidate">Warn-Candidate</option>
                <option value="Warn-Client">Warn-Client</option>
                <option value="Warn-CollectionAgency">Warn-CollectionAgency</option>
                <option value="Final-Warning">Final-Warning</option>
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
              <select
                name="freqtype"
                value={formData.freqtype}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="M">MONTHLY</option>
                <option value="W">WEEKLY</option>
                <option value="D">DAYS</option>
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
                readOnly
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
                readOnly
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
                readOnly
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
                readOnly
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
                readOnly
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

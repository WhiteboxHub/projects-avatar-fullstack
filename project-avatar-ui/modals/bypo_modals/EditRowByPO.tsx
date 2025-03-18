import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { ByMonth } from '@/types'; // Ensure this is the correct type for your row data

interface EditRowModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  rowData: ByMonth;
  onSave: () => Promise<void>;
}

const EditRowModal: React.FC<EditRowModalProps> = ({ isOpen, onRequestClose, rowData, onSave }) => {
  const [formData, setFormData] = useState({
    invoicenumber: '',
    startdate: '',
    enddate: '',
    invoicedate: '',
    quantity: '',
    otquantity: '',
    status: '',
    amountreceived: '',
    releaseddate: '',
    receiveddate: '',
    checknumber: '',
    invoiceurl: '',
    checkurl: '',
    reminders: 'Y',
    remindertype: 'Open',
    emppaiddate: '',
    candpaymentstatus: 'Open',
    poid: '',
    notes: '',
    lastmoddatetime: '',
  });

  useEffect(() => {
    if (rowData) {
      setFormData({
        invoicenumber: rowData.invoicenumber || '',
        startdate: rowData.startdate ? new Date(rowData.startdate).toISOString().split('T')[0] : '',
        enddate: rowData.enddate ? new Date(rowData.enddate).toISOString().split('T')[0] : '',
        invoicedate: rowData.invoicedate ? new Date(rowData.invoicedate).toISOString().split('T')[0] : '',
        quantity: rowData.quantity?.toString() || '',
        otquantity: rowData.otquantity?.toString() || '',
        status: rowData.status || '',
        amountreceived: rowData.amountreceived?.toString() || '',
        releaseddate: rowData.releaseddate ? new Date(rowData.releaseddate).toISOString().split('T')[0] : '',
        receiveddate: rowData.receiveddate ? new Date(rowData.receiveddate).toISOString().split('T')[0] : '',
        checknumber: rowData.checknumber || '',
        invoiceurl: rowData.invoiceurl || '',
        checkurl: rowData.checkurl || '',
        reminders: rowData.reminders || 'Y',
        remindertype: rowData.remindertype || 'Open',
        emppaiddate: rowData.emppaiddate ? new Date(rowData.emppaiddate).toISOString().split('T')[0] : '',
        candpaymentstatus: rowData.candpaymentstatus || 'Open',
        poid: rowData.poid?.toString() || '',
        notes: rowData.notes || '',
        lastmoddatetime: rowData.lastmoddatetime ? new Date(rowData.lastmoddatetime).toISOString().split('T')[0] : '',
      });
    }
  }, [rowData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/invoices/${rowData.id}`, formData, {
        headers: { AuthToken: localStorage.getItem("token") },
      });
      await onSave();
      onRequestClose();
    } catch (error) {
      console.error("Error updating row:", error);
    }
  };

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
          maxWidth: '500px',
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
          onClick={onRequestClose}
          className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
        >
          &times;
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Edit Invoice</h2>
      <form className="space-y-4">
        {Object.keys(formData).map((key) => (
          <div key={key} className="modal-field">
            <label htmlFor={key} className="block text-sm font-semibold text-gray-700 mb-1">
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              type="text"
              id={key}
              name={key}
              value={formData[key as keyof typeof formData]}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleSave}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
        >
          Save
        </button>
      </form>
    </Modal>
  );
};

export default EditRowModal;

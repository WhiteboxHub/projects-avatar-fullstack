import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import { INVOICE_STATUS_OPTIONS, REMINDER_TYPE_OPTIONS } from "@/types/index";

interface Overdue {
  pkid?: number;
  status?: string;
  remindertype?: string;
  amountreceived?: number;
  receiveddate?: string | null;
  checknumber?: string;
  notes?: string;
  invoicedate?: string;
  quantity?: number;
  releaseddate?: string | null;
}

interface EditRowOverdueProps {
  isOpen: boolean;
  onRequestClose: () => void;
  rowData: Overdue | null;
  onSave: () => void;
}

const EditRowOverdue: React.FC<EditRowOverdueProps> = ({ isOpen, onRequestClose, rowData, onSave }) => {
  const [formData, setFormData] = useState<Overdue>({
    pkid: undefined,
    status: 'Open',
    remindertype: 'Open',
    amountreceived: 0.00,
    receiveddate: null,
    checknumber: '',
    notes: '',
    invoicedate: '',
    quantity: 0,
    releaseddate: null,
  });

  const isValidDate = (dateString: string | null | undefined): boolean => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const formatDateForInput = (date: string | null | undefined): string => {
    if (!date || !isValidDate(date)) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  useEffect(() => {
    if (rowData) {
      setFormData({
        ...rowData,
        receiveddate: rowData.receiveddate && isValidDate(rowData.receiveddate) 
          ? rowData.receiveddate 
          : null,
        releaseddate: rowData.releaseddate && isValidDate(rowData.releaseddate) 
          ? rowData.releaseddate 
          : null,
      });
    }
  }, [rowData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value ? new Date(value).toISOString().split('T')[0] : null 
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData && formData.pkid) { 
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        
        const payload = {
          ...formData,
          receiveddate: formData.receiveddate && isValidDate(formData.receiveddate)
            ? formData.receiveddate
            : null,
          releaseddate: formData.releaseddate && isValidDate(formData.releaseddate)
            ? formData.releaseddate
            : null,
        };

        const cleanPayload = Object.fromEntries(
          Object.entries(payload).filter(([_, v]) => v !== undefined)
        );

        await axios.put(`${API_URL}/overdue/put/${formData.pkid}`, cleanPayload, {
          headers: { AuthToken: localStorage.getItem('token') },
        });
        onSave(); 
        onRequestClose();
      } catch (error) {
        console.error('Error updating overdue:', error);
        if (axios.isAxiosError(error)) {
          console.error('API Error:', error.response?.data);
        }
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        content: {
          top: '55%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, -50%)',
          maxWidth: '400px',
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
      contentLabel="Edit Overdue Modal"
    >
      <div className="relative">
        <button
          onClick={onRequestClose}
          className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
        >
          &times;
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Edit Overdue Details</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="modal-field">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            {INVOICE_STATUS_OPTIONS.filter(option => option.value !== "").map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-field">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Reminder Type</label>
          <select
            name="remindertype"
            value={formData.remindertype}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            {REMINDER_TYPE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-field">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Received</label>
          <input
            type="number"
            name="amountreceived"
            value={formData.amountreceived}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter received amount"
            step="0.01"
          />
        </div>

        <div className="modal-field">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Received Date</label>
          <input
            type="date"
            name="receiveddate"
            value={formatDateForInput(formData.receiveddate)}
            onChange={handleDateChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Released Date</label>
          <input
            type="date"
            name="releaseddate"
            value={formatDateForInput(formData.releaseddate)}
            onChange={handleDateChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div className="modal-field">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Check No</label>
          <input
            type="text"
            name="checknumber"
            value={formData.checknumber}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter check number"
          />
        </div>

        <div className="modal-field">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
          <input
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter notes"
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
        >
          Save Overdue
        </button>
      </form>
    </Modal>
  );
};

export default EditRowOverdue;
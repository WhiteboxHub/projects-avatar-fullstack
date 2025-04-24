import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { AiOutlineClose } from 'react-icons/ai';

interface Url {
  // sl_no: number;
  url: string;
}

interface EditRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
  initialData: Url;
  currentPage: number;
  pageSize: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const EditRowModal: React.FC<EditRowModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData,
  currentPage,
  pageSize
}) => {
  const [formData, setFormData] = useState<Url>({ sl_no: 0, url: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      await axios.put(
        `${API_URL}/urls/update/${formData.sl_no}`,
        { url: formData.url },
        {
          params: {
            page: currentPage,
            page_size: pageSize
          },
          headers: { 
            AuthToken: localStorage.getItem("token") || "" 
          }
        }
      );
      
      await onSave();
      onClose();
    } catch (error) {
      console.error('Error updating URL:', error);
      alert(
        axios.isAxiosError(error) 
          ? error.response?.data?.detail || error.message
          : 'Failed to update URL'
      );
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
      ariaHideApp={false}
    >
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
          disabled={isSubmitting}
        >
          <AiOutlineClose />
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Edit URL</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* SL No (read-only) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">SL No</label>
          <input
            type="text"
            name="sl_no"
            value={formData.sl_no}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-100"
            readOnly
          />
        </div>

        {/* URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">URL *</label>
          <input
            type="text"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter URL"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm disabled:bg-blue-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </Modal>
  );
};

export default EditRowModal;
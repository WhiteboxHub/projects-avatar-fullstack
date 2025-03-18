import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Lead } from '@/types/index'; // Adjust the import path accordingly

interface EditRowModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  rowData: Lead | null;
  onSave: () => void;
}

const EditRowModal: React.FC<EditRowModalProps> = ({ isOpen, onRequestClose, rowData, onSave }) => {
  const [formData, setFormData] = useState<Lead | null>(null);

  useEffect(() => {
    if (rowData) {
      setFormData(rowData);
    }
  }, [rowData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData) {
      try {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/leads/update/${formData.leadid}`, formData, {
          headers: { AuthToken: localStorage.getItem('token') },
        });
        onSave();
        onRequestClose();
      } catch (error) {
        console.error('Error updating row:', error);
      }
    }
  };

 

  //   <Modal
  //   isOpen={isOpen}
  //   onRequestClose={onRequestClose}
  //   style={{
  //     content: {
  //       top: '15%',
  //     left: '50%',
  //     right: 'auto',
  //     bottom: 'auto',
  //     transform: 'translate(-50%, 0)',
  //     overflowY: 'auto',
  //     maxHeight: '80vh',
  //     width: '40%',
  //     },
  //   }}
  // > {/* // <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal" overlayClassName="modal-overlay"> */}
  //     <h2 className="text-xl font-bold mb-4">Edit Lead</h2>
  //     <form onSubmit={handleSubmit} className="space-y-4">
  //       {formData && Object.keys(formData).map((key) => (
  //         <input
  //           key={key}
  //           type="text"
  //           name={key}
  //           value={formData[key as keyof Lead]}
  //           onChange={handleChange}
  //           placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
  //           className="border rounded-md p-2 w-full"
  //         />
  //       ))}
  //       <div className="flex justify-between mt-4">
  //         <button type="button" onClick={onRequestClose} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">
  //           Cancel
  //         </button>
  //         <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
  //           Update Lead
  //         </button>
  //       </div>
  //     </form>
  //   </Modal>
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
    >
      <div className="relative">
        <button
          onClick={onRequestClose}
          className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
        >
          &times;
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">Edit Lead</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {formData && Object.keys(formData).map((key) => (
          <div key={key} className="modal-field">
            <label htmlFor={key} className="block text-sm font-semibold text-gray-700 mb-1">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <input
              type="text"
              id={key}
              name={key}
              value={formData[key as keyof Lead]}
              onChange={handleChange}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>
        ))}
  
        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-sm"
        >
          Save Lead
        </button>
      </form>
    </Modal>
  );
};

export default EditRowModal;

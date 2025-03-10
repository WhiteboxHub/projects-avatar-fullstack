// EditRowModal.tsx
import { ByMonth } from '@/types';
import React from 'react';

interface EditRowModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  rowData: ByMonth; // Use the actual type for your row data
  onSave: () => Promise<void>; // Add this line
}

const EditRowModal: React.FC<EditRowModalProps> = ({ isOpen, onRequestClose, rowData, onSave }) => {
  if (!isOpen) return null;

  const handleSave = async () => {
    await onSave();
    onRequestClose(); // Optionally close the modal after saving
  };

  return (
    <div>
      <h2>Edit Row</h2>
      {/* Display rowData or any form inputs for editing */}
      <button onClick={handleSave}>Save</button>
      <button onClick={onRequestClose}>Close</button>
    </div>
  );
};

export default EditRowModal;

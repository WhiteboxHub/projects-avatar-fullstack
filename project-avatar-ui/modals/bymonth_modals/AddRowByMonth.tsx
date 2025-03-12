// AddRowModal.tsx
import React from 'react';

interface AddRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  refreshData: () => Promise<void>;
}

const AddRowModal: React.FC<AddRowModalProps> = ({ isOpen, onClose, refreshData }) => {
  if (!isOpen) return null;

  return (
    <div>
      {/* Modal content here */}
      <button onClick={onClose}>Close</button>
      <button onClick={refreshData}>Refresh Data</button>
    </div>
  );
};

export default AddRowModal;

// ViewRowModal.tsx
import React from 'react';

interface ViewRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowData: any; // Replace with your actual type
}

const ViewRowModal: React.FC<ViewRowModalProps> = ({ isOpen, onClose, rowData }) => {
  if (!isOpen) return null;

  return (
    <div>
      <h2>View Row</h2>
      {/* Render rowData details */}
      <pre>{JSON.stringify(rowData, null, 2)}</pre>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ViewRowModal;

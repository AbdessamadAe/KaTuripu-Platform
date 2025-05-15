import React from 'react';

interface HeaderProps {
  isEditing: boolean;
  onClose: () => void;
}

const Header: React.FC<HeaderProps> = ({ isEditing, onClose }) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-medium text-gray-900 dark:text-white">
        {isEditing ? "Edit Exercise" : "Add New Exercise"}
      </h3>
      <button
        type="button"
        onClick={onClose}
        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Header;

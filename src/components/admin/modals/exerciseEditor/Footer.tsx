import React from 'react';

interface FooterProps {
  isEditing: boolean;
  onClose: () => void;
}

const Footer: React.FC<FooterProps> = ({ isEditing, onClose }) => {
  return (
    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
      <div>
        {isEditing && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        )}
      </div>
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-[#5a8aaf] hover:bg-[#4a7ab0] text-white rounded-lg shadow-sm font-medium"
        >
          {isEditing ? "Update Exercise" : "Add Exercise"}
        </button>
      </div>
    </div>
  );
};

export default Footer;

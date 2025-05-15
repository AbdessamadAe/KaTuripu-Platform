import React from 'react';

interface FooterProps {
  isConfirmingDelete: boolean;
  onDeleteClick: () => void;
  onCancelDelete: () => void;
  onClose: () => void;
}

const Footer: React.FC<FooterProps> = ({
  isConfirmingDelete,
  onDeleteClick,
  onCancelDelete,
  onClose,
}) => {
  return (
    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
      <div>
        {isConfirmingDelete ? (
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-md flex items-center space-x-2">
            <p className="text-sm text-red-800 dark:text-red-300">
              Are you sure you want to delete this node?
            </p>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onDeleteClick}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                type="button"
                onClick={onCancelDelete}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={onDeleteClick}
            className="px-4 py-2 text-sm font-medium text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
          >
            Delete Node
          </button>
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
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Footer;

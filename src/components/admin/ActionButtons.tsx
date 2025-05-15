"use client";

import React from 'react';

interface ActionButtonsProps {
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  primaryLabel?: string;
  secondaryLabel?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSave,
  onCancel,
  isSaving,
  primaryLabel = 'Save',
  secondaryLabel = 'Cancel'
}) => {
  return (
    <div className="flex space-x-3">
      <button 
        onClick={onCancel}
        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        disabled={isSaving}
      >
        {secondaryLabel}
      </button>
      <button 
        onClick={onSave}
        className={`px-4 py-2 bg-[#5a8aaf] hover:bg-[#4a7ab0] text-white rounded-lg shadow transition-colors flex items-center ${
          isSaving ? 'opacity-70 cursor-not-allowed' : ''
        }`}
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </>
        ) : (
          primaryLabel
        )}
      </button>
    </div>
  );
};

export default ActionButtons;
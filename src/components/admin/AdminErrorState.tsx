"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

interface AdminErrorStateProps {
  title?: string;
  description?: string;
  retryAction?: () => void;
  backPath?: string;
  backLabel?: string;
}

const AdminErrorState: React.FC<AdminErrorStateProps> = ({ 
  title = "Error loading data",
  description = "There was a problem fetching the data. Please try again later.",
  retryAction,
  backPath = '/admin',
  backLabel = 'Back'
}) => {
  const router = useRouter();
  
  const handleBackClick = () => {
    if (backPath) {
      router.push(backPath);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f5f3ff] dark:from-gray-900 dark:to-indigo-950/30 text-gray-800 dark:text-gray-200 py-8 px-4">
      <div className="max-w-7xl mx-auto text-center py-12">
        <svg className="mx-auto h-16 w-16 text-red-400 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 className="mt-4 text-2xl font-bold text-red-600 dark:text-red-400">{title}</h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400">{description}</p>
        <div className="mt-6 flex justify-center space-x-4">
          {retryAction && (
            <button 
              onClick={retryAction}
              className="px-4 py-2 bg-[#5a8aaf] hover:bg-[#4a7ab0] text-white rounded-lg shadow"
            >
              Retry
            </button>
          )}
          <button 
            onClick={handleBackClick}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {backLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminErrorState;
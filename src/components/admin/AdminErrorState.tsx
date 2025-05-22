"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Alert } from '@/components/ui';

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
        <Alert 
          variant="error" 
          title={title}
          className="mb-6"
        >
          {description}
        </Alert>
        
        <div className="mt-6 flex justify-center space-x-4">
          {retryAction && (
            <Button 
              onClick={retryAction}
              variant="primary"
            >
              Retry
            </Button>
          )}
          <Button 
            onClick={handleBackClick}
            variant="outline"
          >
            {backLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminErrorState;
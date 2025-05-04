import React from 'react';
import { Toaster, ToastPosition } from 'react-hot-toast';

interface ToastProviderProps {
  position?: ToastPosition;
}

const ToastProvider: React.FC<ToastProviderProps> = ({ position = 'bottom-right' }) => {
  return (
    <Toaster
      position={position}
      reverseOrder={false}
      toastOptions={{
        // Default options
        duration: 4000,
        style: {
          background: '#192C88',
          color: '#fff',
          fontWeight: '600',
          padding: '16px',
          borderRadius: '10px',
          boxShadow: '0 10px 15px rgba(0, 0, 0, 0.3)',
        },
        // Custom toast types
        success: {
          style: {
            background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#22c55e',
          },
        },
        error: {
          style: {
            background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#b91c1c',
          },
        },
        // Special gamification toasts
        loading: {
          style: {
            background: '#3730a3',
            color: '#fff',
          },
        },
      }}
    />
  );
};

export default ToastProvider;
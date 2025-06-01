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
          background: 'var(--primary-color)',
          color: 'white',
          fontWeight: '600',
          padding: '16px',
          borderRadius: '10px',
          boxShadow: '0 10px 15px rgba(0, 0, 0, 0.3)',
        },
        // Custom toast types
        success: {
          style: {
            background: 'linear-gradient(135deg, var(--success-color) 0%, var(--success-color-dark) 100%)',
            color: 'white',
          },
          iconTheme: {
            primary: 'white',
            secondary: 'var(--success-color-dark)',
          },
        },
        error: {
          style: {
            background: 'linear-gradient(135deg, var(--error-color) 0%, var(--error-color-dark) 100%)',
            color: 'white',
          },
          iconTheme: {
            primary: 'white',
            secondary: 'var(--error-color-dark)',
          },
        },
        // Special gamification toasts
        loading: {
          style: {
            background: 'var(--primary-color-dark)',
            color: 'white',
          },
        },
      }}
    />
  );
};

export default ToastProvider;
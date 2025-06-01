// Reusable Alert component for consistent messaging
import React from 'react';
// Import icons from react-icons
import { HiInformationCircle, HiCheckCircle, HiExclamationTriangle, HiXCircle } from 'react-icons/hi2';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const getVariantClasses = (variant: AlertVariant): string => {
  switch (variant) {
    case 'info':
      return 'bg-[var(--info-color)]/10 dark:bg-[var(--info-color)]/20 text-[var(--info-color)] dark:text-[var(--info-color)] border-[var(--info-color)]/30 dark:border-[var(--info-color)]/50';
    case 'success':
      return 'bg-[var(--success-color)]/10 dark:bg-[var(--success-color)]/20 text-[var(--success-color)] dark:text-[var(--success-color)] border-[var(--success-color)]/30 dark:border-[var(--success-color)]/50';
    case 'warning':
      return 'bg-[var(--warning-color)]/10 dark:bg-[var(--warning-color)]/20 text-[var(--warning-color)] dark:text-[var(--warning-color)] border-[var(--warning-color)]/30 dark:border-[var(--warning-color)]/50';
    case 'error':
      return 'bg-[var(--error-color)]/10 dark:bg-[var(--error-color)]/20 text-[var(--error-color)] dark:text-[var(--error-color)] border-[var(--error-color)]/30 dark:border-[var(--error-color)]/50';
    default:
      return 'bg-[var(--info-color)]/10 dark:bg-[var(--info-color)]/20 text-[var(--info-color)] dark:text-[var(--info-color)] border-[var(--info-color)]/30 dark:border-[var(--info-color)]/50';
  }
};

const getIconByVariant = (variant: AlertVariant): React.ReactNode => {
  switch (variant) {
    case 'info':
      return <HiInformationCircle className="h-5 w-5" />;
    case 'success':
      return <HiCheckCircle className="h-5 w-5" />;
    case 'warning':
      return <HiExclamationTriangle className="h-5 w-5" />;
    case 'error':
      return <HiXCircle className="h-5 w-5" />;
    default:
      return null;
  }
};

const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  icon,
  onClose,
  className = '',
}) => {
  const baseClasses = 'flex p-4 border rounded-lg';
  const alertClasses = `${baseClasses} ${getVariantClasses(variant)} ${className}`;
  
  return (
    <div className={alertClasses} role="alert">
      {icon !== undefined ? (
        <div className="flex-shrink-0 mr-3">{icon}</div>
      ) : (
        <div className="flex-shrink-0 mr-3">{getIconByVariant(variant)}</div>
      )}
      
      <div className="flex-1">
        {title && <h3 className="text-sm font-medium mb-1">{title}</h3>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
      
      {onClose && (
        <button
          type="button"
          className="ml-3 -my-1.5 bg-transparent inline-flex items-center justify-center p-1.5 rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
          onClick={onClose}
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;

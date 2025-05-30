// Reusable Card component for consistent card styling
import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'elevated' | 'outlined' | 'flat';
  hoverEffect?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'outlined',
  hoverEffect = false,
  clickable = false,
  onClick,
}) => {
  // Base classes for all cards
  const baseClasses = 'rounded-xl overflow-hidden transition-all duration-300';
  
  // Variant-specific classes
  const variantClasses = {
    elevated: 'bg-white dark:bg-gray-800 shadow-md',
    outlined: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    flat: 'bg-gray-50 dark:bg-gray-900',
  };
  
  // Hover effect classes
  const hoverClasses = hoverEffect 
    ? 'hover:shadow-lg transform hover:-translate-y-1' 
    : '';
  
  // Clickable classes
  const clickableClasses = clickable 
    ? 'cursor-pointer' 
    : '';
  
  // Combine all classes
  const cardClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${hoverClasses}
    ${clickableClasses}
    ${className}
  `;
  
  return (
    <div className={cardClasses} onClick={clickable ? onClick : undefined}>
      {children}
    </div>
  );
};

// Card subcomponents for better organization
const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);

const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <h3 className={`font-semibold text-lg text-gray-900 dark:text-white ${className}`}>
    {children}
  </h3>
);

const CardBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);

// Export main component and subcomponents
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
export { CardHeader, CardTitle, CardBody, CardFooter };

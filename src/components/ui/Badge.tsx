// Reusable Badge component for consistent badge styling
import React from 'react';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  className?: string;
}

const getVariantClasses = (variant: BadgeVariant): string => {
  switch (variant) {
    case 'primary':
      return 'bg-[#4a7ab0]/15 text-[#4a7ab0] dark:bg-[#4a7ab0]/20 dark:text-[#6b9bd1]';
    case 'secondary':
      return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    case 'success':
      return 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400';
    case 'danger':
      return 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400';
    case 'info':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400';
    default:
      return 'bg-[#4a7ab0]/15 text-[#4a7ab0] dark:bg-[#4a7ab0]/20 dark:text-[#6b9bd1]';
  }
};

const getSizeClasses = (size: BadgeSize): string => {
  switch (size) {
    case 'sm':
      return 'px-2 py-0.5 text-xs';
    case 'md':
      return 'px-2.5 py-1 text-sm';
    case 'lg':
      return 'px-3 py-1.5 text-base';
    default:
      return 'px-2.5 py-1 text-sm';
  }
};

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = false,
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium';
  const roundedClasses = rounded ? 'rounded-full' : 'rounded-md';
  
  const badgeClasses = `
    ${baseClasses}
    ${getVariantClasses(variant)}
    ${getSizeClasses(size)}
    ${roundedClasses}
    ${className}
  `;
  
  return <span className={badgeClasses}>{children}</span>;
};

export default Badge;

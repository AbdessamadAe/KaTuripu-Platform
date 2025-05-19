// UI component for consistent button styling across the application
// Can be used for buttons, links that look like buttons, and submit buttons
import { forwardRef } from 'react';
import Link from 'next/link';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isFullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  href?: string;
  external?: boolean;
}

const getVariantClasses = (variant: ButtonVariant): string => {
  switch (variant) {
    case 'primary':
      return 'bg-gradient-to-r from-[#4a7ab0] to-[#6b9bd1] text-white shadow hover:shadow-md hover:from-[#3d699d] hover:to-[#588ac0] dark:from-[#4a7ab0] dark:to-[#6b9bd1] dark:hover:from-[#3d699d] dark:hover:to-[#588ac0]';
    case 'secondary':
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600';
    case 'outline':
      return 'bg-transparent border border-[#4a7ab0] text-[#4a7ab0] hover:bg-[#4a7ab0]/10 dark:border-[#6b9bd1] dark:text-[#6b9bd1] dark:hover:bg-[#6b9bd1]/10';
    case 'text':
      return 'bg-transparent text-[#4a7ab0] hover:bg-[#4a7ab0]/10 dark:text-[#6b9bd1] dark:hover:bg-[#6b9bd1]/10';
    case 'danger':
      return 'bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700';
    default:
      return 'bg-gradient-to-r from-[#4a7ab0] to-[#6b9bd1] text-white shadow hover:shadow-md';
  }
};

const getSizeClasses = (size: ButtonSize): string => {
  switch (size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm';
    case 'md':
      return 'px-5 py-2.5 text-base';
    case 'lg':
      return 'px-8 py-4 text-lg';
    default:
      return 'px-5 py-2.5 text-base';
  }
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isFullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      href,
      external,
      className = '',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a7ab0]';
    const widthClass = isFullWidth ? 'w-full' : '';
    const disabledClass = disabled || isLoading ? 'opacity-70 cursor-not-allowed pointer-events-none' : '';
    
    const buttonClasses = `${baseClasses} ${getVariantClasses(variant)} ${getSizeClasses(size)} ${widthClass} ${disabledClass} ${className}`;
    
    const content = (
      <>
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </>
    );
    
    if (href) {
      return (
        <Link 
          href={href} 
          className={buttonClasses}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {content}
        </Link>
      );
    }
    
    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

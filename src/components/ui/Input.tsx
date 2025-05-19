// Reusable Input component for consistent form styling
import { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'outline' | 'filled';
  size?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      fullWidth = false,
      variant = 'outline',
      size = 'md',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Base classes
    const baseInputClasses = 'w-full rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#4a7ab0] transition-colors';
    
    // Size classes
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-5 py-3 text-lg',
    };
    
    // Variant classes
    const variantClasses = {
      outline: 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-[#4a7ab0] dark:focus:border-[#6b9bd1]',
      filled: 'border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-800',
    };
    
    // State classes
    const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';
    const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-700' : '';
    
    // Combine all classes
    const inputClasses = `
      ${baseInputClasses}
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      ${errorClasses}
      ${disabledClasses}
      ${leftIcon ? 'pl-10' : ''}
      ${rightIcon ? 'pr-10' : ''}
      ${className}
    `;
    
    const containerClasses = `relative ${fullWidth ? 'w-full' : ''}`;
    
    return (
      <div className={containerClasses}>
        {label && (
          <label 
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={inputClasses}
            disabled={disabled}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
        
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

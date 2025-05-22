// Reusable Checkbox component for consistent form styling
import { forwardRef } from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      helperText,
      error,
      size = 'md',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Size classes
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };
    
    const labelSizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };
    
    // State classes
    const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed' : '';
    
    // Combine all classes
    const checkboxClasses = `
      form-checkbox rounded
      text-[#4a7ab0] dark:text-[#6b9bd1]
      border-gray-300 dark:border-gray-600
      focus:ring-[#4a7ab0] dark:focus:ring-[#6b9bd1]
      transition-colors
      ${sizeClasses[size]}
      ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
      ${disabledClasses}
      ${className}
    `;
    
    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            type="checkbox"
            className={checkboxClasses}
            disabled={disabled}
            {...props}
          />
        </div>
        
        {(label || helperText || error) && (
          <div className="ml-3 text-sm">
            {label && (
              <label 
                className={`font-medium text-gray-700 dark:text-gray-300 ${labelSizeClasses[size]} ${disabled ? 'opacity-60' : ''}`}
                htmlFor={props.id}
              >
                {label}
              </label>
            )}
            
            {helperText && !error && (
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{helperText}</p>
            )}
            
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;

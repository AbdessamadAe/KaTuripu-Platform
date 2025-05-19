// Reusable Textarea component for consistent form styling
import { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  variant?: 'outline' | 'filled';
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error,
      fullWidth = false,
      variant = 'outline',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Base classes
    const baseTextareaClasses = 'w-full rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#4a7ab0] transition-colors';
    
    // Variant classes
    const variantClasses = {
      outline: 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-[#4a7ab0] dark:focus:border-[#6b9bd1]',
      filled: 'border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-800',
    };
    
    // State classes
    const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';
    const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-700' : '';
    
    // Combine all classes
    const textareaClasses = `
      ${baseTextareaClasses}
      ${variantClasses[variant]}
      ${errorClasses}
      ${disabledClasses}
      px-4 py-2.5 text-base
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
        
        <textarea
          ref={ref}
          className={textareaClasses}
          disabled={disabled}
          rows={props.rows || 4}
          {...props}
        />
        
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

Textarea.displayName = 'Textarea';

export default Textarea;

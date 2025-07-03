import React from 'react';

interface InputFieldProps {
  label: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  required?: boolean;
}

const InputField = ({
  label,
  value,
  onChange,
  type = 'text',
  min,
  max,
  step,
  prefix,
  suffix,
  placeholder,
  disabled = false,
  error,
  helpText,
  required = false
}: InputFieldProps) => {
  const inputId = `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const helpId = helpText ? `${inputId}-help` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="w-full">
      <label 
        htmlFor={inputId}
        className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none z-10">
            <span className="text-gray-500 text-sm sm:text-base font-medium">
              {prefix}
            </span>
          </div>
        )}
        
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
          aria-invalid={error ? 'true' : 'false'}
          className={`
            form-input-responsive
            ${prefix ? 'pl-8 sm:pl-10' : ''}
            ${suffix ? 'pr-10 sm:pr-12' : ''}
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }
            ${disabled 
              ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
              : 'bg-white'
            }
            transition-all duration-200
            touch-target
          `}
        />
        
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center pointer-events-none">
            <span className="text-gray-500 text-sm sm:text-base">
              {suffix}
            </span>
          </div>
        )}
      </div>
      
      {error && (
        <p 
          id={errorId}
          className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p 
          id={helpId}
          className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500"
        >
          {helpText}
        </p>
      )}
    </div>
  );
};

export default InputField;
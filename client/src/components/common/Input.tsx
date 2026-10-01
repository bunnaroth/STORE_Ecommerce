import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
  return (
    <div className="w-full text-left">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
      </label>
      <input
        id={id}
        className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 transition-all duration-200
          placeholder:text-gray-400 
          focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 
          disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-gray-200'} 
          ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
};

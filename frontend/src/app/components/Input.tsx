import { InputHTMLAttributes, forwardRef, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, name, className = '', ...props }, ref) => {
    // Generate a stable unique id if none is provided
    const generatedId = useId();
    const inputId = id ?? (label ? `input-${generatedId}` : undefined);
    const inputName = name ?? inputId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm text-[#1a1a1a] mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          name={inputName}
          className={`
            w-full px-4 py-3 bg-white rounded-[16px] border-2 border-[#e8e4dc]
            focus:border-[#D4AF37] focus:outline-none transition-colors
            placeholder:text-[#757575]
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

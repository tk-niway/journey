import { forwardRef } from 'react';
import type { FieldError } from 'react-hook-form';

export interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
}

/**
 * 汎用的なテキスト入力コンポーネント
 * react-hook-form と統合可能
 */
export const InputText = forwardRef<HTMLInputElement, InputTextProps>(
  ({ label, id, error, className = '', ...props }, ref) => {
    const inputId = id || `input-${label}`;

    return (
      <div>
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          className={`mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm ${
            error ? 'border-red-500 dark:border-red-400' : ''
          } ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

InputText.displayName = 'InputText';

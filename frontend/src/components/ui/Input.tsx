import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-text mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-3.5 py-2.5 text-sm bg-surface border rounded-control text-text placeholder:text-text-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-1 disabled:opacity-50 disabled:bg-bg-subtle ${
            error ? 'border-danger' : 'border-border hover:border-neutral-400'
          } ${className}`}
          {...props}
        />
        {hint && !error && <p className="mt-1 text-xs text-text-muted">{hint}</p>}
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

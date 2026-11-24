import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold uppercase tracking-wider text-text mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
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

Textarea.displayName = 'Textarea';

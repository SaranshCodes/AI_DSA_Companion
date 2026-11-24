import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'dark-card' | 'ghost' | 'danger' | 'outline-danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors select-none rounded-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer disabled:cursor-not-allowed';

    const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
      primary:
        'bg-surface-inverse text-on-inverse hover:bg-neutral-800 active:bg-neutral-900 focus-visible:ring-text shadow-sm',
      secondary:
        'bg-surface text-text border border-border hover:bg-bg-subtle active:bg-neutral-100 focus-visible:ring-text shadow-sm',
      'dark-card':
        'bg-on-inverse text-surface-inverse hover:bg-neutral-100 active:bg-neutral-200 focus-visible:ring-white shadow-sm font-semibold',
      ghost:
        'text-text-muted hover:text-text hover:bg-bg-subtle active:bg-neutral-100 focus-visible:ring-text',
      danger:
        'bg-danger text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-danger shadow-sm',
      'outline-danger':
        'bg-surface text-danger border border-danger/30 hover:bg-danger-bg focus-visible:ring-danger',
    };

    const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-0.5 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'dark' | 'dashed';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className = '', children, ...props }, ref) => {
    const variants: Record<NonNullable<CardProps['variant']>, string> = {
      default: 'bg-surface border border-border shadow-sm text-text',
      subtle: 'bg-bg-subtle border border-border text-text',
      dark: 'bg-surface-inverse text-on-inverse border border-neutral-800 shadow-md',
      dashed: 'bg-bg-subtle border border-dashed border-border-dashed text-text',
    };

    return (
      <div
        ref={ref}
        className={`rounded-card p-6 ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

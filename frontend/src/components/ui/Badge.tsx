import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
    default: 'bg-bg-subtle text-text border border-border',
    success: 'bg-success-bg text-success border border-success/20',
    warning: 'bg-warning-bg text-warning border border-warning/20',
    danger: 'bg-danger-bg text-danger border border-danger/20',
    neutral: 'bg-track text-text-muted border border-border',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

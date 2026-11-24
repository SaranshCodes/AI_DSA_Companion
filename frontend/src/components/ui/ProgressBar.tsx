import React from 'react';

export interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  variant?: 'default' | 'warning' | 'success';
  size?: 'sm' | 'md';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const variants = {
    default: 'bg-surface-inverse',
    warning: 'bg-warning-fill',
    success: 'bg-success',
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2',
  };

  return (
    <div
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`w-full bg-track rounded-full overflow-hidden ${sizes[size]} ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-300 ${variants[variant]}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

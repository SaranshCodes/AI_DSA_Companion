import React from 'react';

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  active?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  active = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
        active
          ? 'bg-surface-inverse text-on-inverse border-surface-inverse'
          : 'bg-surface text-text border-border'
      } ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

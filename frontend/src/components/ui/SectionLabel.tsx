import React from 'react';

export interface SectionLabelProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <h3
      className={`text-xs font-semibold uppercase tracking-wider text-text-muted ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

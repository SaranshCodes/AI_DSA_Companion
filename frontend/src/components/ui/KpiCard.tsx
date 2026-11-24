import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from './Card';

export interface KpiCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subtext?: string;
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  icon: Icon,
  subtext,
  className = '',
}) => {
  return (
    <Card className={`p-5 flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {label}
        </span>
        <div className="w-8 h-8 rounded-full bg-bg-subtle flex items-center justify-center text-text-muted">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-4">
        <span className="text-3xl font-bold tracking-tight text-text tabular-nums">
          {value}
        </span>
        {subtext && (
          <p className="mt-1 text-xs text-text-muted">{subtext}</p>
        )}
      </div>
    </Card>
  );
};

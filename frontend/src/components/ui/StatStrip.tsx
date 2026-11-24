import React from 'react';
import { Timer } from './Timer';

export interface StatStripProps {
  elapsedSeconds: number;
  hintsUsed: number;
  status: 'in_progress' | 'solved' | 'unsolved';
  className?: string;
}

export const StatStrip: React.FC<StatStripProps> = ({
  elapsedSeconds,
  hintsUsed,
  status,
  className = '',
}) => {
  const statusConfig = {
    in_progress: {
      text: 'In Progress',
      color: 'text-warning font-semibold',
      dot: 'bg-warning',
    },
    solved: {
      text: 'Solved',
      color: 'text-success font-semibold',
      dot: 'bg-success',
    },
    unsolved: {
      text: 'Not solved',
      color: 'text-danger font-semibold',
      dot: 'bg-danger',
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <div
      className={`grid grid-cols-3 divide-x divide-border border border-border bg-surface rounded-card p-4 shadow-sm text-center ${className}`}
    >
      <div className="px-3">
        <span className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
          Session Time
        </span>
        <div className="mt-1 text-2xl font-bold tracking-tight text-text">
          <Timer elapsedSeconds={elapsedSeconds} isRunning={status === 'in_progress'} />
        </div>
      </div>

      <div className="px-3">
        <span className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
          Hints Used
        </span>
        <span className="block mt-1 text-2xl font-bold tracking-tight text-text tabular-nums">
          {hintsUsed}
        </span>
      </div>

      <div className="px-3 flex flex-col items-center justify-center">
        <span className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
          Status
        </span>
        <div className="mt-1 flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${currentStatus.dot}`} />
          <span className={`text-base ${currentStatus.color}`}>
            {currentStatus.text}
          </span>
        </div>
      </div>
    </div>
  );
};

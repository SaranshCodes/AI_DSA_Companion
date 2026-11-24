import React from 'react';

export interface TimerProps {
  elapsedSeconds: number;
  isRunning?: boolean;
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({
  elapsedSeconds,
  className = '',
}) => {
  const total = Math.max(0, Math.floor(elapsedSeconds));
  const mins = Math.floor(total / 60);
  const secs = total % 60;

  const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <span role="timer" aria-live="off" className={`tabular-nums font-mono ${className}`}>
      {formatted}
    </span>
  );
};

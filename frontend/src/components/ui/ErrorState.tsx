import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`p-6 rounded-card border border-danger/30 bg-danger-bg text-text ${className}`}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-danger">{title}</h4>
          <p className="mt-1 text-sm text-text-muted leading-relaxed">{message}</p>
          {onRetry && (
            <div className="mt-4">
              <Button
                variant="outline-danger"
                size="sm"
                onClick={onRetry}
                className="gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Try again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

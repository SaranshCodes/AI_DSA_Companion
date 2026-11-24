import React from 'react';
import { SessionRow } from '@/api/types';
import { formatDateTime } from '@/lib/formatters';

export const HistoryRowExpand: React.FC<{ session: SessionRow }> = ({ session }) => {
  const hasPostSolveHelp =
    (session.hints_used_after_solve ?? 0) > 0 ||
    Boolean(session.approach_requested_after_solve) ||
    Boolean(session.code_requested_after_solve);

  return (
    <div className="p-4 bg-bg-subtle/60 border-t border-border/60 text-xs space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="font-semibold text-text uppercase tracking-wider block mb-1">
            Struggle & Learning Notes
          </span>
          <p className="text-text-muted leading-relaxed">
            {session.struggle_notes || (
              <span className="italic text-text-subtle">No notes recorded.</span>
            )}
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between">
            <span className="text-text-muted">Started:</span>
            <span className="font-medium text-text">
              {formatDateTime(session.started_at)}
            </span>
          </div>
          {session.completed_at && (
            <div className="flex justify-between">
              <span className="text-text-muted">Completed:</span>
              <span className="font-medium text-text">
                {formatDateTime(session.completed_at)}
              </span>
            </div>
          )}
          {hasPostSolveHelp && (
            <div className="flex justify-between text-warning">
              <span>Post-Solve Review:</span>
              <span>
                {[
                  (session.hints_used_after_solve ?? 0) > 0 &&
                    `${session.hints_used_after_solve} hints`,
                  session.approach_requested_after_solve && 'approach',
                  session.code_requested_after_solve && 'code',
                ]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

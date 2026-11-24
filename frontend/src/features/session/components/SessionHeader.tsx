import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Trash2 } from 'lucide-react';
import { ActiveSession } from '../store/useActiveSessionStore';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { Dialog } from '@/components/ui/Dialog';

export interface SessionHeaderProps {
  session: ActiveSession;
  onDiscard: () => void;
}

export const SessionHeader: React.FC<SessionHeaderProps> = ({ session, onDiscard }) => {
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const { leetcode_id, title, difficulty, url } = session.problem;

  const problemHeading = /^\d+$/.test(leetcode_id)
    ? `Problem #${leetcode_id}`
    : `Problem ${leetcode_id}`;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <NavLink
            to="/"
            className="inline-flex items-center text-xs font-semibold text-text-muted hover:text-text mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Dashboard
          </NavLink>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-sm font-semibold text-text-muted uppercase tracking-wider">
              {problemHeading}
            </span>
            <span className="text-text-muted">·</span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text">
              {title}
            </h1>
            <DifficultyBadge difficulty={difficulty} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-control border border-border bg-surface text-text hover:bg-bg-subtle transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text"
            >
              Open in LeetCode
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <button
            onClick={() => setShowDiscardConfirm(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-danger hover:bg-danger-bg rounded-control transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Discard
          </button>
        </div>
      </div>

      <Dialog
        isOpen={showDiscardConfirm}
        onClose={() => setShowDiscardConfirm(false)}
        title="Discard current session?"
        description="Are you sure you want to discard this active session? All progress and timers will be permanently lost."
        confirmLabel="Yes, Discard Session"
        confirmVariant="danger"
        onConfirm={() => {
          setShowDiscardConfirm(false);
          onDiscard();
        }}
      />
    </>
  );
};

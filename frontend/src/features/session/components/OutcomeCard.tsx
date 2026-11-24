import React from 'react';
import { Check, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Button } from '@/components/ui/Button';
import { ActiveSession } from '../store/useActiveSessionStore';
import { formatDateTime } from '@/lib/formatters';

export interface OutcomeCardProps {
  session: ActiveSession;
  elapsedMinutes: number;
  onSelectOutcome: (outcome: 'solved' | 'unsolved') => void;
}

export const OutcomeCard: React.FC<OutcomeCardProps> = ({
  session,
  elapsedMinutes,
  onSelectOutcome,
}) => {
  const hintsCount = Object.keys(session.hints).length;

  const getHighestHelpLabel = () => {
    if (session.helpEvents.some((e) => e.kind === 'code')) return 'Solution Code';
    if (session.helpEvents.some((e) => e.kind === 'approach')) return 'Full Approach';
    if (hintsCount > 0) return `Hint ${hintsCount}`;
    return 'None';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Session Details */}
      <Card className="p-6">
        <SectionLabel>Session Overview</SectionLabel>
        <div className="mt-4 space-y-3 text-xs">
          <div className="flex justify-between py-1 border-b border-border/50">
            <span className="text-text-muted">Started:</span>
            <span className="font-medium text-text">
              {formatDateTime(new Date(session.startedAt).toISOString())}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-border/50">
            <span className="text-text-muted">Elapsed Time:</span>
            <span className="font-medium text-text tabular-nums">
              {elapsedMinutes} min(s)
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-border/50">
            <span className="text-text-muted">Hints Requested:</span>
            <span className="font-medium text-text tabular-nums">{hintsCount} / 3</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-text-muted">Highest Assistance:</span>
            <span className="font-semibold text-text">{getHighestHelpLabel()}</span>
          </div>
        </div>
      </Card>

      {/* Outcome Prompt */}
      <Card className="p-6 flex flex-col justify-between">
        <div>
          <SectionLabel>Have you solved this problem?</SectionLabel>
          <p className="mt-1 text-xs text-text-muted leading-relaxed">
            Record your solving outcome. Your choice freezes the session timer and
            determines your spaced-repetition revision interval.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            size="lg"
            className="flex-1 gap-2"
            onClick={() => onSelectOutcome('solved')}
          >
            <Check className="w-4 h-4 text-success" />
            I Solved It
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="flex-1 gap-2 text-text-muted hover:text-danger hover:border-danger/30"
            onClick={() => onSelectOutcome('unsolved')}
          >
            <X className="w-4 h-4" />
            I Couldn&apos;t Solve It
          </Button>
        </div>
      </Card>
    </div>
  );
};

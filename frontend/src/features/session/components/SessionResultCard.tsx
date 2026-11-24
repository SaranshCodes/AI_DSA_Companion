import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, BarChart3, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RESULT_TIER_CONFIG } from '@/lib/constants';

export interface SessionResultCardProps {
  tier: 'independent' | 'solved' | 'solved_with_help' | 'attempted';
  timeTakenMins: number;
  hintsUsed: number;
  onReset: () => void;
}

export const SessionResultCard: React.FC<SessionResultCardProps> = ({
  tier,
  timeTakenMins,
  hintsUsed,
  onReset,
}) => {
  const navigate = useNavigate();
  const config = RESULT_TIER_CONFIG[tier];

  return (
    <Card className="max-w-xl mx-auto p-8 text-center border border-border shadow-md">
      <div className="w-14 h-14 rounded-full bg-success-bg text-success mx-auto flex items-center justify-center mb-4">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-text">
        Session Saved!
      </h2>

      <div className="mt-3 inline-block">
        <Badge
          variant={
            tier === 'independent' || tier === 'solved'
              ? 'success'
              : tier === 'solved_with_help'
              ? 'warning'
              : 'danger'
          }
          size="md"
          className="text-sm px-3.5 py-1"
        >
          {config.label}
        </Badge>
      </div>

      <p className="mt-3 text-sm text-text-muted max-w-md mx-auto leading-relaxed">
        {config.description}
      </p>

      <div className="mt-6 flex justify-center gap-6 py-3 border-y border-border text-xs text-text-muted">
        <div>
          <span>Time: </span>
          <strong className="text-text tabular-nums">{timeTakenMins}m</strong>
        </div>
        <div>
          <span>Hints Used: </span>
          <strong className="text-text tabular-nums">{hintsUsed}</strong>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="primary" size="md" onClick={onReset} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Start New Problem
        </Button>

        <Button
          variant="secondary"
          size="md"
          onClick={() => navigate('/analytics')}
          className="gap-2"
        >
          <BarChart3 className="w-4 h-4" />
          View Analytics
        </Button>
      </div>
    </Card>
  );
};

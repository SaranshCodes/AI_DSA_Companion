import React from 'react';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { WeakPattern } from '@/api/types';

export interface WeakPatternRankingProps {
  patterns: WeakPattern[];
}

export const WeakPatternRanking: React.FC<WeakPatternRankingProps> = ({ patterns }) => {
  return (
    <Card className="p-6">
      <SectionLabel>Weak Patterns Ranked by Priority</SectionLabel>
      <p className="mt-1 text-xs text-text-muted">
        Weighted priority score (0 = mastered, 100 = highest revision priority)
      </p>

      <div className="mt-5 space-y-4">
        {patterns.length === 0 ? (
          <p className="text-xs text-text-muted py-6 text-center italic">
            No weak patterns recorded yet.
          </p>
        ) : (
          patterns.map((item) => (
            <div
              key={item.pattern}
              className="p-4 rounded-control border border-border bg-surface space-y-2 shadow-sm"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-sm text-text">{item.pattern}</span>
                <span
                  className={`font-semibold tabular-nums ${
                    item.weakness_score >= 30 ? 'text-warning' : 'text-text-muted'
                  }`}
                >
                  Weakness Score: {item.weakness_score}/100
                </span>
              </div>

              <ProgressBar
                value={item.weakness_score}
                variant={item.weakness_score >= 30 ? 'warning' : 'default'}
                size="sm"
              />

              <div className="flex flex-wrap items-center justify-between text-[11px] text-text-muted pt-1">
                <span>{item.reason}</span>
                <div className="flex items-center gap-3">
                  <span>
                    Indep. Rate: <strong className="text-text">{item.independent_solve_rate}%</strong>
                  </span>
                  <span>·</span>
                  <span>
                    Avg. Conf: <strong className="text-text">{item.avg_confidence}/5</strong>
                  </span>
                  <span>·</span>
                  <span>
                    Attempts: <strong className="text-text">{item.attempts}</strong>
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

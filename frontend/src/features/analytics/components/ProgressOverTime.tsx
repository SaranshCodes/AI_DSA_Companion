import React from 'react';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ProgressComparison } from '@/lib/analytics';

export interface ProgressOverTimeProps {
  progress: ProgressComparison | null;
}

export const ProgressOverTime: React.FC<ProgressOverTimeProps> = ({ progress }) => {
  if (!progress) {
    return (
      <Card className="p-6 flex flex-col justify-between">
        <div>
          <SectionLabel>Your Progress Over Time</SectionLabel>
          <p className="mt-1 text-xs text-text-muted">
            Day 1 baseline comparison
          </p>
        </div>
        <p className="text-xs text-text-muted py-10 text-center italic">
          Progress comparison unlocks after your second day of practice.
        </p>
      </Card>
    );
  }

  const { baseline, current, dayN, deltas } = progress;

  return (
    <Card className="p-6">
      <SectionLabel>Your Progress Over Time</SectionLabel>
      <p className="mt-1 text-xs text-text-muted">
        Day 1 Baseline vs. Day {dayN} Cumulative Performance
      </p>

      {/* Two cards: Baseline Light vs Current Dark */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-control bg-bg-subtle border border-border text-xs">
          <span className="font-semibold text-text-muted uppercase tracking-wider block">
            Day 1 Baseline
          </span>
          <p className="mt-1 font-bold text-text text-base tabular-nums">
            {baseline.problemsCount} problems
          </p>
          <p className="text-[11px] text-text-muted mt-0.5">
            {baseline.independentCount} independent ({baseline.hintsPerProblem} hints/prob)
          </p>
        </div>

        <div className="p-3.5 rounded-control bg-surface-inverse text-on-inverse border border-neutral-800 text-xs shadow-sm">
          <span className="font-semibold text-neutral-400 uppercase tracking-wider block">
            Day {dayN} Overall
          </span>
          <p className="mt-1 font-bold text-white text-base tabular-nums">
            {current.problemsCount} problems
          </p>
          <p className="text-[11px] text-neutral-300 mt-0.5">
            {current.independentCount} independent ({current.hintsPerProblem} hints/prob)
          </p>
        </div>
      </div>

      {/* 4 Delta Tiles */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 rounded-control border border-border bg-surface text-center">
          <span className="text-text-muted block text-[11px]">Problems</span>
          <strong
            className={`block mt-1 text-sm ${
              deltas.problemsDelta >= 0 ? 'text-success' : 'text-danger'
            }`}
          >
            {deltas.problemsDelta >= 0 ? `+${deltas.problemsDelta}` : deltas.problemsDelta}
          </strong>
        </div>

        <div className="p-2.5 rounded-control border border-border bg-surface text-center">
          <span className="text-text-muted block text-[11px]">Independent</span>
          <strong
            className={`block mt-1 text-sm ${
              deltas.independentDelta >= 0 ? 'text-success' : 'text-danger'
            }`}
          >
            {deltas.independentDelta >= 0 ? `+${deltas.independentDelta}` : deltas.independentDelta}
          </strong>
        </div>

        <div className="p-2.5 rounded-control border border-border bg-surface text-center">
          <span className="text-text-muted block text-[11px]">Hints / Prob</span>
          <strong
            className={`block mt-1 text-sm ${
              deltas.hintsDelta <= 0 ? 'text-success' : 'text-warning'
            }`}
          >
            {deltas.hintsDelta > 0 ? `+${deltas.hintsDelta}` : deltas.hintsDelta}
          </strong>
        </div>

        <div className="p-2.5 rounded-control border border-border bg-surface text-center">
          <span className="text-text-muted block text-[11px]">Confidence</span>
          <strong
            className={`block mt-1 text-sm ${
              deltas.confidenceDelta >= 0 ? 'text-success' : 'text-warning'
            }`}
          >
            {deltas.confidenceDelta >= 0 ? `+${deltas.confidenceDelta}` : deltas.confidenceDelta}
          </strong>
        </div>
      </div>
    </Card>
  );
};

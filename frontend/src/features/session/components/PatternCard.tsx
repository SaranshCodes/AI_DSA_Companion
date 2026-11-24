import React from 'react';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Chip } from '@/components/ui/Chip';
import { PatternAnalysis } from '@/api/types';

export interface PatternCardProps {
  analysis: PatternAnalysis;
}

export const PatternCard: React.FC<PatternCardProps> = ({ analysis }) => {
  const secondary =
    analysis.secondary_patterns && analysis.secondary_patterns.length > 0
      ? analysis.secondary_patterns.join(', ')
      : 'None identified';

  return (
    <Card className="p-6 border border-border shadow-sm">
      <SectionLabel>Pattern Recognition</SectionLabel>

      <div className="mt-3 flex flex-wrap items-baseline gap-2">
        <h2 className="text-xl font-bold tracking-tight text-text">
          {analysis.primary_pattern}
        </h2>
        <span className="text-xs text-text-muted">
          (Secondary: {secondary})
        </span>
      </div>

      <p className="mt-3 text-sm text-text-muted leading-relaxed">
        {analysis.why_this_pattern}
      </p>

      {analysis.recognition_signals && analysis.recognition_signals.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/60">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-2">
            Recognition Signals
          </span>
          <div className="flex flex-wrap gap-2">
            {analysis.recognition_signals.map((signal, idx) => (
              <Chip key={idx} className="bg-bg-subtle text-text text-xs py-1">
                ✓ {signal}
              </Chip>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

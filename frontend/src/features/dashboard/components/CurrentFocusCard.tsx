import React from 'react';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { WeakPattern } from '@/api/types';

export interface CurrentFocusCardProps {
  weakPatterns: WeakPattern[];
}

export const CurrentFocusCard: React.FC<CurrentFocusCardProps> = ({ weakPatterns }) => {
  const topPatterns = weakPatterns.slice(0, 3);

  return (
    <Card className="p-6 flex flex-col justify-between">
      <div>
        <SectionLabel>Your Current Focus</SectionLabel>
        <p className="mt-1 text-xs text-text-muted">
          Algorithmic patterns requiring highest revision priority
        </p>

        <div className="mt-6 space-y-4">
          {topPatterns.length === 0 ? (
            <p className="text-xs text-text-muted italic">
              No weak patterns identified yet. Keep practicing!
            </p>
          ) : (
            topPatterns.map((item) => {
              const mastery = Math.max(0, Math.min(100, Math.round(100 - item.weakness_score)));
              return (
                <div key={item.pattern}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-text">{item.pattern}</span>
                    <span className="text-text-muted font-medium tabular-nums">
                      {mastery}% mastery
                    </span>
                  </div>
                  <ProgressBar
                    value={mastery}
                    variant={mastery < 50 ? 'warning' : 'default'}
                    size="sm"
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </Card>
  );
};

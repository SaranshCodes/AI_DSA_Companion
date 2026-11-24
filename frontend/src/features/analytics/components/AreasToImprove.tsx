import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Button } from '@/components/ui/Button';
import { WeakPattern } from '@/api/types';
import { WEAK_PATTERN_MIN_SCORE } from '@/lib/analytics';

export interface AreasToImproveProps {
  weakPatterns: WeakPattern[];
}

export const AreasToImprove: React.FC<AreasToImproveProps> = ({ weakPatterns }) => {
  const navigate = useNavigate();

  const qualifying = weakPatterns
    .filter((p) => p.weakness_score >= WEAK_PATTERN_MIN_SCORE)
    .slice(0, 3);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <SectionLabel>Areas to Improve</SectionLabel>
        <AlertTriangle className="w-4 h-4 text-warning" />
      </div>

      <div className="mt-4">
        {qualifying.length === 0 ? (
          <p className="text-xs text-text-muted py-6 text-center italic">
            No weak patterns yet. Nice work!
          </p>
        ) : (
          <div className="divide-y divide-border/60">
            {qualifying.map((item, idx) => (
              <div key={item.pattern} className="py-3 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-track flex items-center justify-center text-xs font-bold text-text-muted shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-text">{item.pattern}</h4>
                    <span className="text-xs font-semibold text-warning tabular-nums">
                      Score: {item.weakness_score}/100
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">
                    {item.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <Button
          variant="secondary"
          size="sm"
          className="w-full justify-between"
          onClick={() => navigate('/revision')}
        >
          <span>View Revision Suggestions</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </Card>
  );
};

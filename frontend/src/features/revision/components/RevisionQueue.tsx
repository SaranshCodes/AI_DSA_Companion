import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { RevisionItem } from '@/api/types';

export interface RevisionQueueProps {
  queue: RevisionItem[];
}

export const RevisionQueue: React.FC<RevisionQueueProps> = ({ queue }) => {
  const navigate = useNavigate();

  const handlePracticeAgain = (item: RevisionItem) => {
    const params = new URLSearchParams({
      leetcode_id: item.leetcode_id,
      title: item.title,
      difficulty: item.difficulty,
    });
    if (item.url) params.set('url', item.url);

    navigate(`/session?${params.toString()}`);
  };

  return (
    <Card className="p-6">
      <SectionLabel>Spaced-Repetition Revision Queue</SectionLabel>
      <p className="mt-1 text-xs text-text-muted">
        Problems scheduled for retention review (urgent & due-now first)
      </p>

      <div className="mt-4 divide-y divide-border">
        {queue.length === 0 ? (
          <p className="text-xs text-text-muted py-8 text-center italic">
            No problems in your revision queue yet.
          </p>
        ) : (
          queue.map((item) => (
            <div
              key={item.problem_id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-text">
                    #{item.leetcode_id}
                  </span>
                  <span className="text-xs text-text-muted">·</span>
                  <h4 className="text-sm font-bold text-text">{item.title}</h4>
                  <DifficultyBadge difficulty={item.difficulty} />
                  {item.is_due_now ? (
                    <Badge variant="danger" size="sm">
                      Due Now
                    </Badge>
                  ) : (
                    <Badge variant="neutral" size="sm">
                      Due in {item.days_until_due}d
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-text-muted leading-relaxed">
                  {item.reason}
                </p>

                <div className="flex flex-wrap gap-3 text-[11px] text-text-subtle pt-1">
                  <span>
                    Pattern: <strong className="text-text">{item.primary_pattern}</strong>
                  </span>
                  <span>·</span>
                  <span>
                    Last Status: <strong className="text-text">{item.last_status}</strong>
                  </span>
                  <span>·</span>
                  <span>
                    Interval: <strong className="text-text">{item.interval_days}d</strong>
                  </span>
                  <span>·</span>
                  <span>
                    Last Confidence: <strong className="text-text">{item.last_confidence}/5</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-text-muted hover:text-text rounded-control border border-border bg-surface hover:bg-bg-subtle transition-colors shadow-sm"
                    title="Open on LeetCode"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handlePracticeAgain(item)}
                  className="gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Practice Again
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

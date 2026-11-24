import React from 'react';
import { Sparkles } from 'lucide-react';
import { useRevisionData } from '../hooks/useRevisionData';
import { RevisionQueue } from '../components/RevisionQueue';
import { WeakPatternRanking } from '../components/WeakPatternRanking';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';

export const RevisionPage: React.FC = () => {
  const { recommendations, isLoading, error, refetch } = useRevisionData();

  if (error) {
    return (
      <div className="py-6">
        <ErrorState
          title="Could not load revision queue"
          message="Failed to retrieve recommendations from the server."
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text">
          Revision & Spaced Repetition
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Scheduled retention reviews based on your solve independence, time, and confidence.
        </p>
      </div>

      {/* Dark Suggested Next Action Banner */}
      {isLoading ? (
        <Skeleton className="h-24 rounded-card" />
      ) : (
        <Card variant="dark" className="p-6 shadow-md border border-neutral-800">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Sparkles className="w-4 h-4" />
            Recommended Next Step
          </div>
          <p className="mt-2 text-base font-semibold text-white leading-relaxed">
            {recommendations?.suggested_next_action ||
              'Start by solving and logging problems to generate personalized revision intervals.'}
          </p>
        </Card>
      )}

      {/* Revision Queue */}
      {isLoading ? (
        <Skeleton className="h-64 rounded-card" />
      ) : (
        <RevisionQueue queue={recommendations?.revision_queue || []} />
      )}

      {/* Weak Pattern Ranking */}
      {isLoading ? (
        <Skeleton className="h-64 rounded-card" />
      ) : (
        <WeakPatternRanking patterns={recommendations?.weak_patterns || []} />
      )}
    </div>
  );
};

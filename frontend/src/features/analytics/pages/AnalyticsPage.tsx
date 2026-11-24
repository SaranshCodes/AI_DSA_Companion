import React, { useMemo } from 'react';
import { Target, CheckCircle2, HelpCircle, Zap } from 'lucide-react';
import { useDashboardData } from '@/features/dashboard/hooks/useDashboardData';
import { useHistorySessions } from '@/features/history/hooks/useHistorySessions';
import { PatternPerformanceChart } from '../components/PatternPerformanceChart';
import { HelpLevelDonut } from '../components/HelpLevelDonut';
import { AreasToImprove } from '../components/AreasToImprove';
import { ProgressOverTime } from '../components/ProgressOverTime';
import { IndependenceTrendChart } from '../components/IndependenceTrendChart';
import { KpiCard } from '@/components/ui/KpiCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { helpLevelBuckets } from '@/lib/independence';
import { computeProgress } from '@/lib/analytics';

export const AnalyticsPage: React.FC = () => {
  const {
    overview,
    isOverviewLoading,
    overviewError,
    refetchOverview,
    patterns,
    isPatternsLoading,
    recommendations,
  } = useDashboardData();

  const { sessions, isLoading: isSessionsLoading } = useHistorySessions();

  const donutBuckets = useMemo(() => {
    return helpLevelBuckets(sessions);
  }, [sessions]);

  const progressComparison = useMemo(() => {
    return computeProgress(sessions);
  }, [sessions]);

  if (overviewError) {
    return (
      <div className="py-6">
        <ErrorState
          title="Could not load analytics"
          message="Failed to retrieve analytics metrics from the server."
          onRetry={refetchOverview}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text">
          Your DSA Progress
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Pattern mastery, assistance breakdown, and long-term independence trends.
        </p>
      </div>

      {/* 4 KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isOverviewLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-card" />
          ))
        ) : (
          <>
            <KpiCard
              label="Problems"
              value={overview?.total_attempted ?? 0}
              icon={Target}
            />
            <KpiCard
              label="Solved"
              value={overview?.total_solved ?? 0}
              icon={CheckCircle2}
              subtext={`${overview?.completion_rate ?? 0}% completion`}
            />
            <KpiCard
              label="Independent"
              value={overview?.independent_solves ?? 0}
              icon={Zap}
              subtext={`${overview?.independent_solve_rate ?? 0}% independent`}
            />
            <KpiCard
              label="Hints Used"
              value={overview?.total_hints_used ?? 0}
              icon={HelpCircle}
              subtext={`${overview?.avg_hints_per_problem ?? 0} per problem`}
            />
          </>
        )}
      </div>

      {/* Charts Grid: Pattern Performance & Help Level Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {isPatternsLoading ? (
            <Skeleton className="h-80 rounded-card" />
          ) : (
            <PatternPerformanceChart
              patterns={patterns?.patterns || []}
              strugglingPatterns={patterns?.struggling_patterns || []}
            />
          )}
        </div>

        <div>
          {isSessionsLoading ? (
            <Skeleton className="h-80 rounded-card" />
          ) : (
            <HelpLevelDonut buckets={donutBuckets} />
          )}
        </div>
      </div>

      {/* Comparison Grid: Areas to Improve & Progress Over Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AreasToImprove
          weakPatterns={recommendations?.weak_patterns || []}
        />
        <ProgressOverTime progress={progressComparison} />
      </div>

      {/* Independence Trend */}
      <IndependenceTrendChart
        trend={overview?.independent_solve_rate_trend || []}
      />
    </div>
  );
};

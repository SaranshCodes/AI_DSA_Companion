import React from 'react';
import { Target, CheckCircle2, HelpCircle, Zap } from 'lucide-react';
import { useDashboardData } from '../hooks/useDashboardData';
import { StartBar } from '../components/StartBar';
import { CurrentFocusCard } from '../components/CurrentFocusCard';
import { TodayFocusCard } from '../components/TodayFocusCard';
import { KpiCard } from '@/components/ui/KpiCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { greeting } from '@/lib/formatters';

export const DashboardPage: React.FC = () => {
  const {
    overview,
    isOverviewLoading,
    overviewError,
    refetchOverview,
    recommendations,
    isRecommendationsLoading,
  } = useDashboardData();

  if (overviewError) {
    return (
      <div className="py-6">
        <ErrorState
          title="Could not load dashboard"
          message="Failed to retrieve your practice analytics from the server."
          onRetry={refetchOverview}
        />
      </div>
    );
  }

  const isEmptyAccount = overview && overview.total_attempted === 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Eyebrow */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          SOLVE ON LEETCODE. LEARN FROM EVERY PROBLEM.
        </p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-text">
          {greeting()}
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Ready for your next problem?
        </p>
      </div>

      {/* Start Input Bar */}
      <StartBar />

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isOverviewLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-card" />
          ))
        ) : (
          <>
            <KpiCard
              label="Problems Attempted"
              value={overview?.total_attempted ?? 0}
              icon={Target}
            />
            <KpiCard
              label="Problems Solved"
              value={overview?.total_solved ?? 0}
              icon={CheckCircle2}
              subtext={`${overview?.completion_rate ?? 0}% completion`}
            />
            <KpiCard
              label="Hints Used"
              value={overview?.total_hints_used ?? 0}
              icon={HelpCircle}
              subtext={`${overview?.avg_hints_per_problem ?? 0} per problem`}
            />
            <KpiCard
              label="Independent Solves"
              value={overview?.independent_solves ?? 0}
              icon={Zap}
              subtext={`${overview?.independent_solve_rate ?? 0}% independent`}
            />
          </>
        )}
      </div>

      {/* Focus Section or Zero State */}
      {isEmptyAccount ? (
        <EmptyState
          icon={Target}
          title="Welcome to AI DSA Companion"
          description="Log your first problem to unlock personalized focus areas, pattern mastery insights, and spaced-repetition recommendations."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isRecommendationsLoading ? (
            <>
              <Skeleton className="h-64 rounded-card" />
              <Skeleton className="h-64 rounded-card" />
            </>
          ) : (
            <>
              <CurrentFocusCard
                weakPatterns={recommendations?.weak_patterns || []}
              />
              <TodayFocusCard recommendations={recommendations} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

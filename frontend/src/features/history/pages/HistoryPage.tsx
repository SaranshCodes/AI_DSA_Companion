import React, { useState, useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
import { useHistorySessions } from '../hooks/useHistorySessions';
import { HistoryFilters, HistoryFilterState } from '../components/HistoryFilters';
import { HistoryRowExpand } from '../components/HistoryRowExpand';
import { DataTable, Column } from '@/components/ui/DataTable';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { SessionRow } from '@/api/types';
import { getResultTier } from '@/lib/independence';
import { relativeTime, formatMinutes } from '@/lib/formatters';
import { RESULT_TIER_CONFIG } from '@/lib/constants';

const ITEMS_PER_PAGE = 15;

export const HistoryPage: React.FC = () => {
  const { sessions, isLoading, error, refetch } = useHistorySessions();

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<HistoryFilterState>({
    pattern: 'all',
    result: 'all',
    difficulty: 'all',
  });

  const patternsList = useMemo(() => {
    const set = new Set<string>();
    sessions.forEach((s) => {
      const p = s.problems?.primary_pattern;
      if (p) set.add(p);
    });
    return Array.from(set).sort();
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      if (
        filters.pattern !== 'all' &&
        s.problems?.primary_pattern !== filters.pattern
      ) {
        return false;
      }
      if (
        filters.difficulty !== 'all' &&
        s.problems?.difficulty !== filters.difficulty
      ) {
        return false;
      }
      if (filters.result !== 'all') {
        const tier = getResultTier({
          status: s.status,
          hints_used: s.hints_used,
          approach_requested: s.approach_requested,
          code_requested: s.code_requested,
        });
        if (tier !== filters.result) return false;
      }
      return true;
    });
  }, [sessions, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredSessions.length / ITEMS_PER_PAGE));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSessions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSessions, currentPage]);

  const columns: Column<SessionRow>[] = [
    {
      key: 'problem',
      header: 'Problem',
      render: (s) => {
        const pid = s.problems?.leetcode_id || s.problem_id;
        const title = s.problems?.title || 'Unknown Problem';
        return (
          <div>
            <div className="flex items-center gap-1.5 font-semibold text-text">
              <span>#{pid}</span>
              <span>·</span>
              <span className="hover:underline">{title}</span>
              {s.problems?.url && (
                <a
                  href={s.problems.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-text-subtle hover:text-text ml-1"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <span className="text-[11px] text-text-muted">
              {relativeTime(s.started_at)}
            </span>
          </div>
        );
      },
    },
    {
      key: 'pattern',
      header: 'Pattern',
      render: (s) => (
        <span className="text-text font-medium">
          {s.problems?.primary_pattern || 'Uncategorized'}
        </span>
      ),
    },
    {
      key: 'difficulty',
      header: 'Difficulty',
      render: (s) => (
        <DifficultyBadge
          difficulty={s.problems?.difficulty}
          tableTextOnly
        />
      ),
    },
    {
      key: 'time',
      header: 'Time',
      className: 'tabular-nums',
      render: (s) => formatMinutes(s.time_taken_mins),
    },
    {
      key: 'hints',
      header: 'Hints',
      className: 'tabular-nums text-center',
      render: (s) => s.hints_used ?? 0,
    },
    {
      key: 'confidence',
      header: 'Confidence',
      className: 'tabular-nums text-center',
      render: (s) => (s.confidence ? `${s.confidence}/5` : '—'),
    },
    {
      key: 'result',
      header: 'Result',
      render: (s) => {
        const tier = getResultTier({
          status: s.status,
          hints_used: s.hints_used,
          approach_requested: s.approach_requested,
          code_requested: s.code_requested,
        });
        const config = RESULT_TIER_CONFIG[tier];
        return (
          <Badge
            variant={
              tier === 'independent' || tier === 'solved'
                ? 'success'
                : tier === 'solved_with_help'
                ? 'warning'
                : 'danger'
            }
            size="sm"
            className="text-[11px]"
            title={config.description}
          >
            {config.label}
          </Badge>
        );
      },
    },
  ];

  if (error) {
    return (
      <div className="py-6">
        <ErrorState
          title="Failed to load problem history"
          message="Could not retrieve your past solving sessions."
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text">
          Problem History
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          All logged practice sessions with metrics, hints, and outcomes.
        </p>
      </div>

      <HistoryFilters
        filters={filters}
        onChange={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1);
        }}
        patternsList={patternsList}
        onClear={() => {
          setFilters({ pattern: 'all', result: 'all', difficulty: 'all' });
          setCurrentPage(1);
        }}
      />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-card" />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={paginatedData}
          keyExtractor={(s) => s.id}
          renderExpanded={(s) => <HistoryRowExpand session={s} />}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          emptyState={
            filteredSessions.length === 0 && sessions.length > 0 ? (
              <EmptyState
                title="No matching problems"
                description="No practice sessions match your selected filters."
                actionLabel="Clear filters"
                onAction={() =>
                  setFilters({ pattern: 'all', result: 'all', difficulty: 'all' })
                }
              />
            ) : (
              <EmptyState
                title="No problem sessions yet"
                description="Start solving problems on LeetCode with the companion to build your history."
              />
            )
          }
        />
      )}
    </div>
  );
};

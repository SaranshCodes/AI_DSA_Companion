import React from 'react';
import { Button } from '@/components/ui/Button';

export interface HistoryFilterState {
  pattern: string;
  result: string;
  difficulty: string;
}

export interface HistoryFiltersProps {
  filters: HistoryFilterState;
  onChange: (filters: HistoryFilterState) => void;
  patternsList: string[];
  onClear: () => void;
}

export const HistoryFilters: React.FC<HistoryFiltersProps> = ({
  filters,
  onChange,
  patternsList,
  onClear,
}) => {
  const isFiltered =
    filters.pattern !== 'all' ||
    filters.result !== 'all' ||
    filters.difficulty !== 'all';

  return (
    <div className="flex flex-wrap items-center gap-3 py-3 border-b border-border">
      {/* Pattern Filter */}
      <select
        value={filters.pattern}
        onChange={(e) => onChange({ ...filters, pattern: e.target.value })}
        className="px-3 py-1.5 text-xs bg-surface border border-border rounded-control text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text"
      >
        <option value="all">All Patterns</option>
        {patternsList.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      {/* Result Filter */}
      <select
        value={filters.result}
        onChange={(e) => onChange({ ...filters, result: e.target.value })}
        className="px-3 py-1.5 text-xs bg-surface border border-border rounded-control text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text"
      >
        <option value="all">All Results</option>
        <option value="independent">Independent</option>
        <option value="solved">Solved</option>
        <option value="solved_with_help">Solved with help</option>
        <option value="attempted">Attempted</option>
      </select>

      {/* Difficulty Filter */}
      <select
        value={filters.difficulty}
        onChange={(e) => onChange({ ...filters, difficulty: e.target.value })}
        className="px-3 py-1.5 text-xs bg-surface border border-border rounded-control text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text"
      >
        <option value="all">All Difficulty</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      {isFiltered && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-xs text-text-muted hover:text-text px-2"
        >
          Clear filters
        </Button>
      )}
    </div>
  );
};

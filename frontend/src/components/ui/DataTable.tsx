import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  renderExpanded?: (item: T) => React.ReactNode;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
  emptyState?: React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  renderExpanded,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = '',
  emptyState,
}: DataTableProps<T>): React.ReactElement {
  const [expandedKeys, setExpandedKeys] = React.useState<Set<string | number>>(new Set());

  const toggleRow = (key: string | number) => {
    if (!renderExpanded) return;
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  if (data.length === 0 && emptyState) {
    return <div className={className}>{emptyState}</div>;
  }

  return (
    <div className={`rounded-card border border-border bg-surface overflow-hidden shadow-sm ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-bg-subtle text-xs font-semibold uppercase tracking-wider text-text-muted">
              {columns.map((col, idx) => (
                <th
                  key={col.key}
                  className={`py-3.5 px-4 ${
                    idx === 0 ? 'sticky left-0 bg-bg-subtle z-10' : ''
                  } ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((item) => {
              const key = keyExtractor(item);
              const isExpanded = expandedKeys.has(key);

              return (
                <React.Fragment key={key}>
                  <tr
                    onClick={() => toggleRow(key)}
                    className={`hover:bg-bg-subtle/70 transition-colors ${
                      renderExpanded ? 'cursor-pointer' : ''
                    } ${isExpanded ? 'bg-bg-subtle/40' : ''}`}
                  >
                    {columns.map((col, idx) => (
                      <td
                        key={col.key}
                        className={`py-4 px-4 ${
                          idx === 0
                            ? 'sticky left-0 bg-surface group-hover:bg-bg-subtle z-10 font-medium'
                            : ''
                        } ${col.className || ''}`}
                      >
                        {col.render(item)}
                      </td>
                    ))}
                  </tr>
                  {isExpanded && renderExpanded && (
                    <tr className="bg-bg-subtle/30">
                      <td colSpan={columns.length} className="p-0 border-t border-border/60">
                        {renderExpanded(item)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-bg-subtle/50 text-xs text-text-muted">
          <span>
            Page <strong className="text-text">{currentPage}</strong> of{' '}
            <strong className="text-text">{totalPages}</strong>
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="px-2 py-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="px-2 py-1"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

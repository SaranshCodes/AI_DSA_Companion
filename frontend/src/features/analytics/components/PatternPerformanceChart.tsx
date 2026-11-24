import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { PatternStat } from '@/api/types';
import { abbreviatePattern } from '@/lib/analytics';

export interface PatternPerformanceChartProps {
  patterns: PatternStat[];
  strugglingPatterns: string[];
}

export const PatternPerformanceChart: React.FC<PatternPerformanceChartProps> = ({
  patterns,
  strugglingPatterns,
}) => {
  // Top 8 patterns by attempts
  const chartData = [...patterns]
    .sort((a, b) => b.attempts - a.attempts)
    .slice(0, 8);

  const strugglingSet = new Set(strugglingPatterns);

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <SectionLabel>Pattern Performance</SectionLabel>
          <p className="mt-1 text-xs text-text-muted">
            Independent solve rate (%) by algorithmic pattern
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-neutral-900" />
            <span className="text-text-muted">Standard</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
            <span className="text-text-muted">Struggling</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-text-muted">
            No pattern data available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
            >
              <XAxis
                dataKey="pattern"
                tickFormatter={(val) => abbreviatePattern(val, 12)}
                tick={{ fontSize: 11, fill: '#6B7280' }}
                interval={0}
                angle={-25}
                textAnchor="end"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: '#6B7280' }}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const item = payload[0].payload as PatternStat;
                  return (
                    <div className="rounded-control bg-surface-inverse text-white p-3 shadow-lg text-xs space-y-1">
                      <p className="font-bold">{item.pattern}</p>
                      <p className="text-neutral-300">
                        Attempts: <strong className="text-white">{item.attempts}</strong>
                      </p>
                      <p className="text-neutral-300">
                        Solved: <strong className="text-white">{item.solved}</strong>
                      </p>
                      <p className="text-neutral-300">
                        Independent Rate:{' '}
                        <strong className="text-amber-400">
                          {item.independent_solve_rate}%
                        </strong>
                      </p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="independent_solve_rate" radius={[4, 4, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell
                    key={entry.pattern}
                    fill={strugglingSet.has(entry.pattern) ? '#F59E0B' : '#0A0A0A'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

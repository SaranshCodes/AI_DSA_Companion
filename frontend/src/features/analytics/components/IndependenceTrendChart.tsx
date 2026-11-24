import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { TrendPoint } from '@/api/types';

export interface IndependenceTrendChartProps {
  trend: TrendPoint[];
}

export const IndependenceTrendChart: React.FC<IndependenceTrendChartProps> = ({
  trend,
}) => {
  return (
    <Card className="p-6">
      <SectionLabel>Independence Solve Rate Trend</SectionLabel>
      <p className="mt-1 text-xs text-text-muted">
        Percentage of independent solves over practice sessions
      </p>

      <div className="h-64 w-full mt-4">
        {trend.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-text-muted">
            No trend data available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trend}
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            >
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#6B7280' }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: '#6B7280' }}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const item = payload[0].payload as TrendPoint;
                  return (
                    <div className="rounded-control bg-surface-inverse text-white p-3 shadow-lg text-xs space-y-1">
                      <p className="font-bold">{item.date}</p>
                      <p className="text-neutral-300">
                        Attempts: <strong className="text-white">{item.attempts}</strong>
                      </p>
                      <p className="text-neutral-300">
                        Independent Solves:{' '}
                        <strong className="text-white">{item.independent_solves}</strong>
                      </p>
                      <p className="text-neutral-300">
                        Rate:{' '}
                        <strong className="text-emerald-400">
                          {item.independent_solve_rate}%
                        </strong>
                      </p>
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="independent_solve_rate"
                stroke="#0A0A0A"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#0A0A0A' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

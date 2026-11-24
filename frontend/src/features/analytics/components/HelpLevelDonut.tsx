import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { HelpBuckets } from '@/lib/independence';

export interface HelpLevelDonutProps {
  buckets: HelpBuckets;
}

const COLORS = ['#0A0A0A', '#525252', '#A3A3A3', '#D4D4D4'];

export const HelpLevelDonut: React.FC<HelpLevelDonutProps> = ({ buckets }) => {
  const data = [
    { name: 'Independent', count: buckets.independent },
    { name: 'Hints', count: buckets.hints },
    { name: 'Approach', count: buckets.approach },
    { name: 'Solution', count: buckets.solution },
  ];

  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card className="p-6">
      <SectionLabel>Problems by Help Level</SectionLabel>
      <p className="mt-1 text-xs text-text-muted">
        Assistance tier for solved problems
      </p>

      <div className="h-48 w-full mt-4">
        {total === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-text-muted">
            No solved problems yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                stroke="#FFFFFF"
                strokeWidth={3}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const item = payload[0];
                  const pct = total > 0 ? Math.round(((item.value as number) / total) * 100) : 0;
                  return (
                    <div className="rounded-control bg-surface-inverse text-white p-2.5 shadow-lg text-xs">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-neutral-300">
                        {item.value} problem(s) ({pct}%)
                      </p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Custom Count Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-border text-xs">
        {data.map((item, idx) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: COLORS[idx] }}
              />
              <span className="text-text-muted">{item.name}</span>
            </div>
            <strong className="text-text tabular-nums">{item.count}</strong>
          </div>
        ))}
      </div>
    </Card>
  );
};

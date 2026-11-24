import { SessionRow, Recommendations, RevisionItem } from '../api/types';
import { isSolved, isIndependent } from './independence';

export const WEAK_PATTERN_MIN_SCORE = 30;

export interface DayMetric {
  date: string;
  problemsCount: number;
  independentCount: number;
  hintsCount: number;
  hintsPerProblem: number;
  avgConfidence: number;
}

export interface ProgressComparison {
  baseline: DayMetric;
  current: DayMetric;
  dayN: number;
  deltas: {
    problemsDelta: number;
    independentDelta: number;
    hintsDelta: number; // Negative is improvement
    confidenceDelta: number;
  };
}

/**
 * Compares Day 1 (first practice calendar day) vs Day N (all cumulative sessions)
 * Returns null if fewer than 2 distinct practice days.
 */
export function computeProgress(sessions: SessionRow[]): ProgressComparison | null {
  if (!sessions || sessions.length === 0) return null;

  // Group sessions by local calendar date (YYYY-MM-DD)
  const daysMap = new Map<string, SessionRow[]>();

  for (const s of sessions) {
    if (!s.started_at) continue;
    const d = new Date(s.started_at);
    if (isNaN(d.getTime())) continue;

    // Use local YYYY-MM-DD
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const key = `${year}-${month}-${day}`;

    const list = daysMap.get(key) || [];
    list.push(s);
    daysMap.set(key, list);
  }

  const sortedDates = Array.from(daysMap.keys()).sort();
  if (sortedDates.length < 2) {
    return null;
  }

  const firstDateStr = sortedDates[0];
  const baselineSessions = daysMap.get(firstDateStr)!;

  const calculateMetric = (dateLabel: string, items: SessionRow[]): DayMetric => {
    const problemsCount = items.length;
    const independentCount = items.filter((s) => isSolved(s) && isIndependent(s)).length;
    const hintsCount = items.reduce((acc, s) => acc + (s.hints_used ?? 0), 0);
    const hintsPerProblem = problemsCount > 0 ? Number((hintsCount / problemsCount).toFixed(2)) : 0;

    const confidences = items
      .map((s) => s.confidence)
      .filter((c): c is number => c !== null && c !== undefined);
    const avgConfidence =
      confidences.length > 0
        ? Number((confidences.reduce((a, b) => a + b, 0) / confidences.length).toFixed(2))
        : 0;

    return {
      date: dateLabel,
      problemsCount,
      independentCount,
      hintsCount,
      hintsPerProblem,
      avgConfidence,
    };
  };

  const baseline = calculateMetric(firstDateStr, baselineSessions);
  const current = calculateMetric('Overall', sessions);

  // Inclusive calendar days between first practice day and today
  const firstDate = new Date(firstDateStr);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - firstDate.getTime());
  const dayN = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);

  return {
    baseline,
    current,
    dayN,
    deltas: {
      problemsDelta: current.problemsCount - baseline.problemsCount,
      independentDelta: current.independentCount - baseline.independentCount,
      hintsDelta: Number((current.hintsPerProblem - baseline.hintsPerProblem).toFixed(2)),
      confidenceDelta: Number((current.avgConfidence - baseline.avgConfidence).toFixed(2)),
    },
  };
}

/**
 * Returns recommended problem: first due item, else first queue item, else null
 */
export function getRecommendedProblem(recs: Recommendations | null | undefined): RevisionItem | null {
  if (!recs || !recs.revision_queue || recs.revision_queue.length === 0) return null;
  const due = recs.revision_queue.find((r) => r.is_due_now);
  return due || recs.revision_queue[0];
}

/**
 * Abbreviate long algorithmic pattern names for Recharts X-axis
 */
const PATTERN_OVERRIDES: Record<string, string> = {
  'Dynamic Programming': 'Dynamic Prog',
  'Breadth-First Search': 'BFS',
  'Depth-First Search': 'DFS',
  'Two Pointers': 'Two Pointers',
  'Sliding Window': 'Sliding Window',
  'Binary Search': 'Binary Search',
  'Divide and Conquer': 'Divide & Conq',
  'Monotonic Stack': 'Mono Stack',
  'Topological Sort': 'Topo Sort',
  'Union Find': 'Union Find',
};

export function abbreviatePattern(name: string, max = 14): string {
  if (!name) return 'Unknown';
  if (PATTERN_OVERRIDES[name]) return PATTERN_OVERRIDES[name];
  if (name.length <= max) return name;
  return `${name.slice(0, max - 1)}…`;
}

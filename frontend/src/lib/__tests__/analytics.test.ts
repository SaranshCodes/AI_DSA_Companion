import { describe, it, expect } from 'vitest';
import {
  computeProgress,
  getRecommendedProblem,
  abbreviatePattern,
} from '../analytics';
import { SessionRow, Recommendations } from '@/api/types';

describe('analytics utilities', () => {
  it('abbreviatePattern truncates or overrides correctly', () => {
    expect(abbreviatePattern('Dynamic Programming')).toBe('Dynamic Prog');
    expect(abbreviatePattern('Breadth-First Search')).toBe('BFS');
    expect(abbreviatePattern('Two Pointers')).toBe('Two Pointers');
    expect(abbreviatePattern('Very Long Custom Algorithmic Pattern', 10)).toBe('Very Long…');
  });

  it('getRecommendedProblem prioritizes due-now item or first queue item', () => {
    const recs: Recommendations = {
      suggested_next_action: 'Test action',
      weak_patterns: [],
      revision_queue: [
        {
          problem_id: 1,
          leetcode_id: '1',
          title: 'Two Sum',
          difficulty: 'Easy',
          primary_pattern: 'Hash Map',
          last_status: 'Solved',
          solved_independently: true,
          last_confidence: 5,
          interval_days: 7,
          days_since_last_attempted: 2,
          days_until_due: 5,
          is_due_now: false,
          reason: 'Test',
        },
        {
          problem_id: 2,
          leetcode_id: '200',
          title: 'Number of Islands',
          difficulty: 'Medium',
          primary_pattern: 'BFS',
          last_status: 'Solved',
          solved_independently: false,
          last_confidence: 3,
          interval_days: 3,
          days_since_last_attempted: 4,
          days_until_due: 0,
          is_due_now: true,
          reason: 'Test Due',
        },
      ],
    };

    expect(getRecommendedProblem(recs)?.leetcode_id).toBe('200');
    expect(getRecommendedProblem(null)).toBeNull();
  });

  it('computeProgress returns null with fewer than 2 distinct practice days', () => {
    const singleDaySessions = [
      {
        id: 1,
        started_at: '2026-11-20T10:00:00Z',
        status: 'Solved',
        hints_used: 0,
        approach_requested: false,
        code_requested: false,
        confidence: 4,
      },
    ] as SessionRow[];

    expect(computeProgress(singleDaySessions)).toBeNull();
  });

  it('computeProgress calculates baseline vs current deltas across multi-day sessions', () => {
    const sessions = [
      // Day 1
      {
        id: 1,
        started_at: '2026-11-10T10:00:00Z',
        status: 'Solved',
        hints_used: 2,
        approach_requested: false,
        code_requested: false,
        confidence: 3,
      },
      // Day 2
      {
        id: 2,
        started_at: '2026-11-15T12:00:00Z',
        status: 'Solved',
        hints_used: 0,
        approach_requested: false,
        code_requested: false,
        confidence: 5,
      },
    ] as SessionRow[];

    const result = computeProgress(sessions);
    expect(result).not.toBeNull();
    if (result) {
      expect(result.baseline.problemsCount).toBe(1);
      expect(result.current.problemsCount).toBe(2);
      expect(result.deltas.problemsDelta).toBe(1);
      expect(result.deltas.independentDelta).toBe(1);
    }
  });
});

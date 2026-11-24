import { describe, it, expect } from 'vitest';
import { buildSessionPayload } from '../utils/sessionPayload';
import { ActiveSession } from '../store/useActiveSessionStore';

describe('buildSessionPayload', () => {
  const baseSession: ActiveSession = {
    problem: {
      leetcode_id: '695',
      title: 'Max Area of Island',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/max-area-of-island/',
    },
    problemText: 'Problem description here',
    analysis: {
      primary_pattern: 'Depth-First Search',
      secondary_patterns: ['Breadth-First Search'],
      recognition_signals: ['2D grid flood fill'],
      why_this_pattern: 'DFS traverses connected components.',
    },
    startedAt: 1000,
    hints: {},
    solution: null,
    helpEvents: [],
    outcome: 'solved',
    outcomeAt: 5000,
  };

  it('Scenario 1: Solved completely independently with 0 hints', () => {
    const payload = buildSessionPayload(baseSession, {
      confidence: 5,
      timeTakenMins: 15,
      struggleNotes: 'Clean solve',
    });

    expect(payload.status).toBe('Solved');
    expect(payload.solved_independently).toBe('Yes');
    expect(payload.hints_used).toBe(0);
    expect(payload.approach_requested).toBe(false);
    expect(payload.code_requested).toBe(false);
    expect(payload.hints_used_after_solve).toBe(0);
  });

  it('Scenario 2: Solved with pre-solve hints -> Assisted solve', () => {
    const sessionWithHints: ActiveSession = {
      ...baseSession,
      helpEvents: [
        { kind: 'hint', level: 1, at: 2000 },
        { kind: 'hint', level: 2, at: 3000 },
      ],
    };

    const payload = buildSessionPayload(sessionWithHints, {
      confidence: 3,
      timeTakenMins: 20,
    });

    expect(payload.status).toBe('Solved');
    expect(payload.solved_independently).toBe('No');
    expect(payload.hints_used).toBe(2);
    expect(payload.hints_used_after_solve).toBe(0);
  });

  it('Scenario 3: Solved independently then viewed help post-solve -> Still independent!', () => {
    const sessionPostSolveHelp: ActiveSession = {
      ...baseSession,
      outcome: 'solved',
      outcomeAt: 5000,
      helpEvents: [
        // Both events happened AFTER outcomeAt
        { kind: 'approach', at: 6000 },
        { kind: 'code', at: 7000 },
        { kind: 'hint', level: 1, at: 8000 },
      ],
    };

    const payload = buildSessionPayload(sessionPostSolveHelp, {
      confidence: 4,
      timeTakenMins: 25,
    });

    expect(payload.status).toBe('Solved');
    // Pre-solve counters remain 0 / false
    expect(payload.hints_used).toBe(0);
    expect(payload.approach_requested).toBe(false);
    expect(payload.code_requested).toBe(false);
    // Solved independently remains "Yes"!
    expect(payload.solved_independently).toBe('Yes');

    // Post-solve counters record the review
    expect(payload.hints_used_after_solve).toBe(1);
    expect(payload.approach_requested_after_solve).toBe(true);
    expect(payload.code_requested_after_solve).toBe(true);
  });

  it('Scenario 4: Unsolved/attempted session -> All events count towards primary assistance', () => {
    const unsolvedSession: ActiveSession = {
      ...baseSession,
      outcome: 'unsolved',
      outcomeAt: 5000,
      helpEvents: [
        { kind: 'hint', level: 1, at: 2000 },
        { kind: 'code', at: 6000 }, // occurred after outcome
      ],
    };

    const payload = buildSessionPayload(unsolvedSession, {
      confidence: 1,
      timeTakenMins: 30,
    });

    expect(payload.status).toBe('Attempted');
    expect(payload.solved_independently).toBe('No');
    expect(payload.hints_used).toBe(1);
    expect(payload.code_requested).toBe(true);
    expect(payload.hints_used_after_solve).toBe(0);
    expect(payload.code_requested_after_solve).toBe(false);
  });

  it('Scenario 5: Enforces minimum 1 minute on timeTakenMins', () => {
    const payload = buildSessionPayload(baseSession, {
      confidence: 5,
      timeTakenMins: 0,
    });
    expect(payload.time_taken_mins).toBe(1);
  });
});

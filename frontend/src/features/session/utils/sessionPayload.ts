import { ActiveSession } from '../store/useActiveSessionStore';
import { SessionCreate } from '@/api/types';
import { isIndependent } from '@/lib/independence';

export interface WrapUpFormData {
  confidence: 1 | 2 | 3 | 4 | 5;
  timeTakenMins: number;
  struggleNotes?: string;
}

/**
 * Pure function to build the exact backend payload from active session and wrap-up form.
 * Follows Section 8 rules precisely:
 * - time_taken_mins = max(1, ceil((outcomeAt - startedAt) / 60000))
 * - outcomeAt partitions events into pre-solve and post-solve
 * - Solved status -> "Solved"; Unsolved -> "Attempted"
 * - solved_independently derived using isIndependent on pre-solve assistance counters
 */
export function buildSessionPayload(
  session: ActiveSession,
  formData: WrapUpFormData
): SessionCreate {
  const isSolved = session.outcome === 'solved';
  const outcomeTime = session.outcomeAt || Date.now();

  let hintsUsed = 0;
  let approachRequested = false;
  let codeRequested = false;
  let hintsUsedAfterSolve = 0;
  let approachRequestedAfterSolve = false;
  let codeRequestedAfterSolve = false;

  for (const event of session.helpEvents) {
    const isBeforeOrAtOutcome = event.at <= outcomeTime;

    if (isSolved) {
      if (isBeforeOrAtOutcome) {
        if (event.kind === 'hint') hintsUsed += 1;
        if (event.kind === 'approach') approachRequested = true;
        if (event.kind === 'code') codeRequested = true;
      } else {
        if (event.kind === 'hint') hintsUsedAfterSolve += 1;
        if (event.kind === 'approach') approachRequestedAfterSolve = true;
        if (event.kind === 'code') codeRequestedAfterSolve = true;
      }
    } else {
      // Unsolved: all events count towards primary assistance counters
      if (event.kind === 'hint') hintsUsed += 1;
      if (event.kind === 'approach') approachRequested = true;
      if (event.kind === 'code') codeRequested = true;
    }
  }

  const status: 'Solved' | 'Attempted' = isSolved ? 'Solved' : 'Attempted';

  const solvedIndependently: 'Yes' | 'No' = isIndependent({
    status,
    hints_used: hintsUsed,
    approach_requested: approachRequested,
    code_requested: codeRequested,
  })
    ? 'Yes'
    : 'No';

  return {
    time_taken_mins: Math.max(1, Math.round(formData.timeTakenMins)),
    hints_used: hintsUsed,
    approach_requested: approachRequested,
    code_requested: codeRequested,
    hints_used_after_solve: hintsUsedAfterSolve,
    approach_requested_after_solve: approachRequestedAfterSolve,
    code_requested_after_solve: codeRequestedAfterSolve,
    status,
    solved_independently: solvedIndependently,
    confidence: formData.confidence,
    struggle_notes: formData.struggleNotes?.trim() || '',
    problem_details: {
      leetcode_id: session.problem.leetcode_id,
      title: session.problem.title,
      url: session.problem.url || null,
      difficulty: session.problem.difficulty,
      primary_pattern: session.analysis.primary_pattern,
      secondary_patterns: session.analysis.secondary_patterns || [],
      recognition_signals: session.analysis.recognition_signals || [],
      why_this_pattern: session.analysis.why_this_pattern,
    },
  };
}

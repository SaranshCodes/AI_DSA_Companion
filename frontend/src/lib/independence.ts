import { SessionRow } from '../api/types';

export type HelpCandidate = {
  status?: string | null;
  hints_used?: number | null;
  approach_requested?: boolean | null;
  code_requested?: boolean | null;
};

/**
 * Checks if a session has solved status
 */
export function isSolved(session: HelpCandidate): boolean {
  return (session.status || '').trim().toLowerCase() === 'solved';
}

/**
 * Independence is determined ONLY by:
 * solved AND hints_used === 0 AND approach_requested === false AND code_requested === false.
 */
export function isIndependent(session: HelpCandidate): boolean {
  return (
    isSolved(session) &&
    (session.hints_used ?? 0) === 0 &&
    !session.approach_requested &&
    !session.code_requested
  );
}

/**
 * Highest help level used
 */
export function highestHelp(session: HelpCandidate): 'none' | 'hint' | 'approach' | 'code' {
  if (session.code_requested) return 'code';
  if (session.approach_requested) return 'approach';
  if ((session.hints_used ?? 0) > 0) return 'hint';
  return 'none';
}

/**
 * Categorizes a session result tier:
 * - unsolved -> attempted
 * - no help -> independent
 * - hints only -> solved
 * - approach or code -> solved_with_help
 */
export function getResultTier(
  session: HelpCandidate
): 'independent' | 'solved' | 'solved_with_help' | 'attempted' {
  if (!isSolved(session)) return 'attempted';
  if (session.code_requested || session.approach_requested) return 'solved_with_help';
  if ((session.hints_used ?? 0) > 0) return 'solved';
  return 'independent';
}

export interface HelpBuckets {
  independent: number;
  hints: number;
  approach: number;
  solution: number;
}

/**
 * Solved sessions grouped by highest assistance level before solving
 */
export function helpLevelBuckets(sessions: SessionRow[]): HelpBuckets {
  const buckets: HelpBuckets = {
    independent: 0,
    hints: 0,
    approach: 0,
    solution: 0,
  };

  for (const s of sessions) {
    if (!isSolved(s)) continue;

    if (s.code_requested) {
      buckets.solution += 1;
    } else if (s.approach_requested) {
      buckets.approach += 1;
    } else if ((s.hints_used ?? 0) > 0) {
      buckets.hints += 1;
    } else {
      buckets.independent += 1;
    }
  }

  return buckets;
}

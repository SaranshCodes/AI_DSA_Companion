export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface LoginResponse {
  access_token: string;
  token_type: 'bearer';
  message: string;
}

export interface Me {
  message: string;
  user_id: string;
  email: string;
}

export interface PatternAnalysis {
  primary_pattern: string;
  secondary_patterns: string[];
  recognition_signals: string[];
  why_this_pattern: string;
}

export interface HintResponse {
  hint: string;
}

export interface MultiLanguageCode {
  python: string;
  cpp: string;
  java: string;
}

export interface SolutionResponse {
  approach: string;
  code: string; // Python 3 (preserved for backward compatibility)
  solutions?: MultiLanguageCode;
  time_complexity: string;
  space_complexity: string;
}

export interface ProblemDetails {
  leetcode_id: string;
  title: string;
  url?: string | null;
  difficulty: Difficulty;
  primary_pattern: string;
  secondary_patterns: string[];
  recognition_signals: string[];
  why_this_pattern: string;
}

export interface SessionCreate {
  time_taken_mins: number;
  hints_used: number;
  approach_requested: boolean;
  code_requested: boolean;
  hints_used_after_solve: number;
  approach_requested_after_solve: boolean;
  code_requested_after_solve: boolean;
  status: 'Solved' | 'Attempted';
  solved_independently: 'Yes' | 'No';
  confidence: 1 | 2 | 3 | 4 | 5;
  struggle_notes?: string;
  problem_details: ProblemDetails;
}

export interface SaveSessionResponse {
  message: string;
  session_id: number;
  problem_id: number;
}

export interface SessionRow {
  id: number;
  problem_id: number;
  started_at: string;
  completed_at?: string | null;
  time_taken_mins: number;
  hints_used: number;
  approach_requested: boolean;
  code_requested: boolean;
  hints_used_after_solve?: number;
  approach_requested_after_solve?: boolean;
  code_requested_after_solve?: boolean;
  status: string;
  solved_independently: string;
  confidence: number | null;
  struggle_notes: string | null;
  problems: {
    leetcode_id: string;
    title: string;
    difficulty: string;
    primary_pattern: string;
    url: string | null;
  } | null;
}

export interface SessionsListResponse {
  count: number;
  sessions: SessionRow[];
}

export interface TrendPoint {
  date: string;
  attempts: number;
  independent_solves: number;
  independent_solve_rate: number;
}

export interface DashboardOverview {
  total_attempted: number;
  total_solved: number;
  independent_solves: number;
  assisted_solves: number;
  completion_rate: number;
  independent_solve_rate: number;
  assisted_solve_rate: number;
  avg_solving_time_mins: number;
  total_hints_used: number;
  avg_hints_per_problem: number;
  avg_hints_per_solved_problem: number;
  pct_solved_without_code: number;
  pct_solved_without_approach: number;
  avg_confidence: number;
  avg_confidence_after_solving: number;
  independent_solve_rate_trend: TrendPoint[];
}

export interface PatternStat {
  pattern: string;
  attempts: number;
  solved: number;
  independent_solves: number;
  assisted_solves: number;
  completion_rate: number;
  independent_solve_rate: number;
  assisted_solve_rate: number;
  avg_confidence: number;
  avg_solving_time_mins: number;
}

export interface PatternAnalytics {
  patterns: PatternStat[];
  struggling_patterns: string[];
}

export interface WeakPattern {
  pattern: string;
  weakness_score: number;
  independent_solve_rate: number;
  avg_confidence: number;
  attempts: number;
  reason: string;
}

export interface RevisionItem {
  problem_id: number;
  leetcode_id: string;
  title: string;
  difficulty: string;
  primary_pattern: string;
  url?: string | null;
  last_status: string;
  solved_independently: boolean;
  last_confidence: number;
  interval_days: number;
  days_since_last_attempted: number;
  days_until_due: number;
  is_due_now: boolean;
  reason: string;
}

export interface Recommendations {
  suggested_next_action: string;
  weak_patterns: WeakPattern[];
  revision_queue: RevisionItem[];
}

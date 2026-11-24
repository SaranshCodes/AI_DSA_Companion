import {
  DashboardOverview,
  PatternAnalytics,
  Recommendations,
  SessionRow,
  Me,
  PatternAnalysis,
  HintResponse,
  SolutionResponse,
} from '@/api/types';

export const mockMe: Me = {
  message: 'You are securely authenticated!',
  user_id: 'usr_saransh_demo_01',
  email: 'saransh@dsa-companion.dev',
};

export const mockDashboardOverview: DashboardOverview = {
  total_attempted: 47,
  total_solved: 39,
  independent_solves: 28,
  assisted_solves: 11,
  completion_rate: 82.98,
  independent_solve_rate: 59.57,
  assisted_solve_rate: 23.4,
  avg_solving_time_mins: 22.4,
  total_hints_used: 62,
  avg_hints_per_problem: 1.32,
  avg_hints_per_solved_problem: 1.59,
  pct_solved_without_code: 84.62,
  pct_solved_without_approach: 71.79,
  avg_confidence: 3.8,
  avg_confidence_after_solving: 4.1,
  independent_solve_rate_trend: [
    { date: '2026-11-01', attempts: 5, independent_solves: 2, independent_solve_rate: 40.0 },
    { date: '2026-11-05', attempts: 8, independent_solves: 4, independent_solve_rate: 50.0 },
    { date: '2026-11-10', attempts: 10, independent_solves: 6, independent_solve_rate: 60.0 },
    { date: '2026-11-15', attempts: 12, independent_solves: 8, independent_solve_rate: 66.67 },
    { date: '2026-11-20', attempts: 12, independent_solves: 8, independent_solve_rate: 66.67 },
  ],
};

export const mockEmptyDashboardOverview: DashboardOverview = {
  total_attempted: 0,
  total_solved: 0,
  independent_solves: 0,
  assisted_solves: 0,
  completion_rate: 0.0,
  independent_solve_rate: 0.0,
  assisted_solve_rate: 0.0,
  avg_solving_time_mins: 0.0,
  total_hints_used: 0,
  avg_hints_per_problem: 0.0,
  avg_hints_per_solved_problem: 0.0,
  pct_solved_without_code: 0.0,
  pct_solved_without_approach: 0.0,
  avg_confidence: 0.0,
  avg_confidence_after_solving: 0.0,
  independent_solve_rate_trend: [],
};

export const mockPatternAnalytics: PatternAnalytics = {
  patterns: [
    {
      pattern: 'Two Pointers',
      attempts: 12,
      solved: 11,
      independent_solves: 9,
      assisted_solves: 2,
      completion_rate: 91.67,
      independent_solve_rate: 75.0,
      assisted_solve_rate: 16.67,
      avg_confidence: 4.2,
      avg_solving_time_mins: 18.5,
    },
    {
      pattern: 'Breadth-First Search',
      attempts: 9,
      solved: 8,
      independent_solves: 6,
      assisted_solves: 2,
      completion_rate: 88.89,
      independent_solve_rate: 66.67,
      assisted_solve_rate: 22.22,
      avg_confidence: 3.9,
      avg_solving_time_mins: 24.0,
    },
    {
      pattern: 'Depth-First Search',
      attempts: 8,
      solved: 7,
      independent_solves: 5,
      assisted_solves: 2,
      completion_rate: 87.5,
      independent_solve_rate: 62.5,
      assisted_solve_rate: 25.0,
      avg_confidence: 3.8,
      avg_solving_time_mins: 22.0,
    },
    {
      pattern: 'Binary Search',
      attempts: 7,
      solved: 5,
      independent_solves: 3,
      assisted_solves: 2,
      completion_rate: 71.43,
      independent_solve_rate: 42.86,
      assisted_solve_rate: 28.57,
      avg_confidence: 3.2,
      avg_solving_time_mins: 28.0,
    },
    {
      pattern: 'Sliding Window',
      attempts: 6,
      solved: 4,
      independent_solves: 2,
      assisted_solves: 2,
      completion_rate: 66.67,
      independent_solve_rate: 33.33,
      assisted_solve_rate: 33.33,
      avg_confidence: 3.0,
      avg_solving_time_mins: 26.5,
    },
    {
      pattern: 'Dynamic Programming',
      attempts: 5,
      solved: 4,
      independent_solves: 3,
      assisted_solves: 1,
      completion_rate: 80.0,
      independent_solve_rate: 60.0,
      assisted_solve_rate: 20.0,
      avg_confidence: 3.4,
      avg_solving_time_mins: 34.0,
    },
  ],
  struggling_patterns: ['Sliding Window', 'Binary Search'],
};

export const mockRecommendations: Recommendations = {
  suggested_next_action:
    "Focus on 'Sliding Window' (weakness score: 62.5/100). Next revision due in 1 day(s).",
  weak_patterns: [
    {
      pattern: 'Sliding Window',
      weakness_score: 62.5,
      independent_solve_rate: 33.33,
      avg_confidence: 3.0,
      attempts: 6,
      reason: 'Low independent solve rate (33.33%).',
    },
    {
      pattern: 'Binary Search',
      weakness_score: 54.2,
      independent_solve_rate: 42.86,
      avg_confidence: 3.2,
      attempts: 7,
      reason: 'Low independent solve rate (42.86%).',
    },
    {
      pattern: 'Dynamic Programming',
      weakness_score: 38.0,
      independent_solve_rate: 60.0,
      avg_confidence: 3.4,
      attempts: 5,
      reason: 'Moderate/low average confidence (3.4/5).',
    },
  ],
  revision_queue: [
    {
      problem_id: 101,
      leetcode_id: '3',
      title: 'Longest Substring Without Repeating Characters',
      difficulty: 'Medium',
      primary_pattern: 'Sliding Window',
      url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
      last_status: 'Solved',
      solved_independently: false,
      last_confidence: 3,
      interval_days: 3,
      days_since_last_attempted: 3,
      days_until_due: 0,
      is_due_now: true,
      reason: 'Solved with AI assistance - revise to build independent recall.',
    },
    {
      problem_id: 102,
      leetcode_id: '33',
      title: 'Search in Rotated Sorted Array',
      difficulty: 'Medium',
      primary_pattern: 'Binary Search',
      url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
      last_status: 'Attempted',
      solved_independently: false,
      last_confidence: 2,
      interval_days: 1,
      days_since_last_attempted: 1,
      days_until_due: 0,
      is_due_now: true,
      reason: 'Previously unsolved - retry soon to build familiarity.',
    },
    {
      problem_id: 103,
      leetcode_id: '200',
      title: 'Number of Islands',
      difficulty: 'Medium',
      primary_pattern: 'Breadth-First Search',
      url: 'https://leetcode.com/problems/number-of-islands/',
      last_status: 'Solved',
      solved_independently: true,
      last_confidence: 4,
      interval_days: 7,
      days_since_last_attempted: 5,
      days_until_due: 2,
      is_due_now: false,
      reason: 'Solved independently - scheduled for standard 7-day retention.',
    },
    {
      problem_id: 104,
      leetcode_id: '15',
      title: '3Sum',
      difficulty: 'Medium',
      primary_pattern: 'Two Pointers',
      url: 'https://leetcode.com/problems/3sum/',
      last_status: 'Solved',
      solved_independently: true,
      last_confidence: 5,
      interval_days: 14,
      days_since_last_attempted: 8,
      days_until_due: 6,
      is_due_now: false,
      reason: 'Mastered with high confidence - long-term spaced review.',
    },
  ],
};

export const mockSessionsList: SessionRow[] = [
  {
    id: 1,
    problem_id: 101,
    started_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    completed_at: new Date(Date.now() - 3 * 86400000 + 25 * 60000).toISOString(),
    time_taken_mins: 25,
    hints_used: 2,
    approach_requested: false,
    code_requested: false,
    hints_used_after_solve: 0,
    approach_requested_after_solve: false,
    code_requested_after_solve: false,
    status: 'Solved',
    solved_independently: 'No',
    confidence: 3,
    struggle_notes: 'Struggled with the set shrink condition when duplicate found.',
    problems: {
      leetcode_id: '3',
      title: 'Longest Substring Without Repeating Characters',
      difficulty: 'Medium',
      primary_pattern: 'Sliding Window',
      url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    },
  },
  {
    id: 2,
    problem_id: 102,
    started_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    completed_at: new Date(Date.now() - 2 * 86400000 + 35 * 60000).toISOString(),
    time_taken_mins: 35,
    hints_used: 3,
    approach_requested: true,
    code_requested: true,
    hints_used_after_solve: 0,
    approach_requested_after_solve: false,
    code_requested_after_solve: false,
    status: 'Attempted',
    solved_independently: 'No',
    confidence: 2,
    struggle_notes: 'Binary search boundary checks were confusing in the rotated half.',
    problems: {
      leetcode_id: '33',
      title: 'Search in Rotated Sorted Array',
      difficulty: 'Medium',
      primary_pattern: 'Binary Search',
      url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
    },
  },
  {
    id: 3,
    problem_id: 103,
    started_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    completed_at: new Date(Date.now() - 5 * 86400000 + 19 * 60000).toISOString(),
    time_taken_mins: 19,
    hints_used: 0,
    approach_requested: false,
    code_requested: false,
    hints_used_after_solve: 0,
    approach_requested_after_solve: false,
    code_requested_after_solve: false,
    status: 'Solved',
    solved_independently: 'Yes',
    confidence: 4,
    struggle_notes: 'Clean BFS traversal using queue with grid bounds check.',
    problems: {
      leetcode_id: '200',
      title: 'Number of Islands',
      difficulty: 'Medium',
      primary_pattern: 'Breadth-First Search',
      url: 'https://leetcode.com/problems/number-of-islands/',
    },
  },
  {
    id: 4,
    problem_id: 104,
    started_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    completed_at: new Date(Date.now() - 8 * 86400000 + 16 * 60000).toISOString(),
    time_taken_mins: 16,
    hints_used: 0,
    approach_requested: false,
    code_requested: false,
    hints_used_after_solve: 0,
    approach_requested_after_solve: false,
    code_requested_after_solve: false,
    status: 'Solved',
    solved_independently: 'Yes',
    confidence: 5,
    struggle_notes: 'Sorted array then used standard two-pointer with duplicate skips.',
    problems: {
      leetcode_id: '15',
      title: '3Sum',
      difficulty: 'Medium',
      primary_pattern: 'Two Pointers',
      url: 'https://leetcode.com/problems/3sum/',
    },
  },
  {
    id: 5,
    problem_id: 105,
    started_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    completed_at: new Date(Date.now() - 12 * 86400000 + 14 * 60000).toISOString(),
    time_taken_mins: 14,
    hints_used: 0,
    approach_requested: false,
    code_requested: false,
    hints_used_after_solve: 0,
    approach_requested_after_solve: false,
    code_requested_after_solve: false,
    status: 'Solved',
    solved_independently: 'Yes',
    confidence: 5,
    struggle_notes: null,
    problems: {
      leetcode_id: '1',
      title: 'Two Sum',
      difficulty: 'Easy',
      primary_pattern: 'Hash Map',
      url: 'https://leetcode.com/problems/two-sum/',
    },
  },
  {
    id: 6,
    problem_id: 106,
    started_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    completed_at: new Date(Date.now() - 14 * 86400000 + 42 * 60000).toISOString(),
    time_taken_mins: 42,
    hints_used: 3,
    approach_requested: true,
    code_requested: true,
    hints_used_after_solve: 0,
    approach_requested_after_solve: false,
    code_requested_after_solve: false,
    status: 'Solved',
    solved_independently: 'No',
    confidence: 3,
    struggle_notes: 'State transitions were tricky; needed full approach.',
    problems: {
      leetcode_id: '72',
      title: 'Edit Distance',
      difficulty: 'Hard',
      primary_pattern: 'Dynamic Programming',
      url: 'https://leetcode.com/problems/edit-distance/',
    },
  },
];

export const mockPatternAnalysis: PatternAnalysis = {
  primary_pattern: 'Depth-First Search',
  secondary_patterns: ['Breadth-First Search', 'Matrix Traversal'],
  recognition_signals: [
    'Grid of 0s and 1s representing water and land',
    'Finding maximum connected component size',
    'Four-directional flood fill',
  ],
  why_this_pattern:
    'Max Area of Island asks for the size of connected components in a 2D grid. DFS is ideal for flood-filling each land cell, marking visited cells, and accumulating the component area recursively.',
};

export const mockHints: Record<1 | 2 | 3, HintResponse> = {
  1: {
    hint: 'Think of the grid as a graph where each cell with value 1 is a node, and edges exist between horizontally or vertically adjacent 1s. How can you explore all connected nodes?',
  },
  2: {
    hint: 'Iterate through every cell in the grid. When you encounter a 1, launch a traversal (DFS or BFS) to calculate the island area. How will you avoid visiting the same cell twice?',
  },
  3: {
    hint: 'Implement a recursive helper `dfs(r, c)`. Check boundary conditions (`r < 0`, `c < 0`, `r >= rows`, `c >= cols`) and whether `grid[r][c] == 0`. Sink visited land by setting `grid[r][c] = 0` and return `1 + sum(dfs on 4 neighbors)`.',
  },
};

export const mockSolution: SolutionResponse = {
  approach:
    '### Depth-First Search with In-Place Visited Tracking\n\n1. Iterate through every cell `(r, c)` in the `grid`.\n2. When `grid[r][c] == 1` is found, invoke a recursive `dfs(r, c)` function.\n3. In `dfs`, if out of bounds or current cell is `0`, return `0`.\n4. Mark cell as visited by setting `grid[r][c] = 0` (sinking the island).\n5. Recursively compute `1 + dfs(r+1,c) + dfs(r-1,c) + dfs(r,c+1) + dfs(r,c-1)`.\n6. Track and return the maximum area found.',
  time_complexity: 'O(R * C) where R and C are rows and columns.',
  space_complexity: 'O(R * C) worst case recursion call stack for an entirely filled grid.',
  code: `class Solution:
    def maxAreaOfIsland(self, grid: list[list[int]]) -> int:
        if not grid or not grid[0]:
            return 0
            
        rows, cols = len(grid), len(grid[0])
        max_area = 0
        
        def dfs(r: int, c: int) -> int:
            if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == 0:
                return 0
            # Mark cell as visited
            grid[r][c] = 0
            # Explore 4 directions
            return (
                1
                + dfs(r + 1, c)
                + dfs(r - 1, c)
                + dfs(r, c + 1)
                + dfs(r, c - 1)
            )
            
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == 1:
                    max_area = max(max_area, dfs(r, c))
                    
        return max_area`,
};

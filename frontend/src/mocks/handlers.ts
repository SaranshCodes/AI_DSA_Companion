import { http, HttpResponse, delay } from 'msw';
import {
  mockMe,
  mockDashboardOverview,
  mockPatternAnalytics,
  mockRecommendations,
  mockSessionsList,
  mockPatternAnalysis,
  mockHints,
  mockSolution,
} from './fixtures';
import { SessionCreate } from '@/api/types';

let mockSessions = [...mockSessionsList];

export const handlers = [
  // Auth endpoints
  http.post('*/api/auth/signup', async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };
    if (!body.email || !body.password) {
      return HttpResponse.json(
        { detail: 'Email and password required' },
        { status: 400 }
      );
    }
    return HttpResponse.json({
      access_token: 'mock_jwt_token_for_testing',
      token_type: 'bearer',
      message: 'Account created successfully!',
    });
  }),

  http.post('*/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };
    if (!body.email || !body.password) {
      return HttpResponse.json(
        { detail: 'Email and password required' },
        { status: 400 }
      );
    }
    return HttpResponse.json({
      access_token: 'mock_jwt_token_for_testing',
      token_type: 'bearer',
      message: 'Copy the access_token to use in protected routes!',
    });
  }),

  http.get('*/api/auth/me', () => {
    return HttpResponse.json(mockMe);
  }),

  // AI Analysis endpoints (with simulated Gemini delays)
  http.post('*/api/analysis/pattern', async () => {
    await delay(1200);
    return HttpResponse.json(mockPatternAnalysis);
  }),

  http.post('*/api/analysis/hint', async ({ request }) => {
    await delay(1000);
    const body = (await request.json()) as { hint_level?: 1 | 2 | 3 };
    const level = body.hint_level || 1;
    const hintObj = mockHints[level] || mockHints[1];
    return HttpResponse.json(hintObj);
  }),

  http.post('*/api/analysis/solution', async () => {
    await delay(1200);
    return HttpResponse.json(mockSolution);
  }),

  // Sessions endpoints
  http.post('*/api/sessions/', async ({ request }) => {
    const payload = (await request.json()) as SessionCreate;
    const newId = mockSessions.length + 1;
    const newRow = {
      id: newId,
      problem_id: 200 + newId,
      started_at: new Date(Date.now() - payload.time_taken_mins * 60000).toISOString(),
      completed_at: new Date().toISOString(),
      time_taken_mins: payload.time_taken_mins,
      hints_used: payload.hints_used,
      approach_requested: payload.approach_requested,
      code_requested: payload.code_requested,
      hints_used_after_solve: payload.hints_used_after_solve,
      approach_requested_after_solve: payload.approach_requested_after_solve,
      code_requested_after_solve: payload.code_requested_after_solve,
      status: payload.status,
      solved_independently: payload.solved_independently,
      confidence: payload.confidence,
      struggle_notes: payload.struggle_notes || null,
      problems: {
        leetcode_id: payload.problem_details.leetcode_id,
        title: payload.problem_details.title,
        difficulty: payload.problem_details.difficulty,
        primary_pattern: payload.problem_details.primary_pattern,
        url: payload.problem_details.url || null,
      },
    };
    mockSessions = [newRow, ...mockSessions];
    return HttpResponse.json({
      message: 'Session saved successfully',
      session_id: newId,
      problem_id: 200 + newId,
    });
  }),

  http.get('*/api/sessions/', () => {
    return HttpResponse.json({
      count: mockSessions.length,
      sessions: mockSessions,
    });
  }),

  // Dashboard & Analytics endpoints
  http.get('*/api/dashboard/', () => {
    return HttpResponse.json(mockDashboardOverview);
  }),

  http.get('*/api/dashboard/patterns', () => {
    return HttpResponse.json(mockPatternAnalytics);
  }),

  // Recommendations endpoint
  http.get('*/api/recommendations/', () => {
    return HttpResponse.json(mockRecommendations);
  }),
];

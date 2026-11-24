import './mockLocalStorage';
import { describe, it, expect, beforeEach } from 'vitest';
import {
  useActiveSessionStore,
  getActiveSessionStorageKey,
} from '../store/useActiveSessionStore';
import {
  useAuthStore,
  clearLeftoverSessionKeys,
  parseJwtUser,
} from '@/features/auth/store/useAuthStore';
import { PatternAnalysis } from '@/api/types';

describe('Multi-user Active Session Storage Scoping & Cleanup', () => {
  const dummyAnalysis: PatternAnalysis = {
    primary_pattern: 'Two Pointers',
    secondary_patterns: ['Sliding Window'],
    recognition_signals: ['Sorted array input'],
    why_this_pattern: 'Opposite end pointers converge.',
  };

  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ token: null, user: null, email: null });
    useActiveSessionStore.setState({ session: null, activeUserId: null });
  });

  it('Requirement 1: Does not load any session when user.id is not available', () => {
    localStorage.setItem(
      'dsa_active_session_user_a',
      JSON.stringify({ problem: { title: 'User A Session' } })
    );

    useActiveSessionStore.getState().loadForUser(null);
    expect(useActiveSessionStore.getState().session).toBeNull();
    expect(useActiveSessionStore.getState().activeUserId).toBeNull();
  });

  it('Requirement 1: Scopes localStorage key by authenticated user.id', () => {
    const userA = { id: 'usr_user_a_123', email: 'usera@example.com' };
    useAuthStore.getState().setAuth('mock_token_a', userA);

    useActiveSessionStore.getState().startSession({
      problem: {
        leetcode_id: '22',
        title: 'Generate Parentheses',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/generate-parentheses/',
      },
      problemText: 'Given n pairs of parentheses...',
      analysis: dummyAnalysis,
    });

    const expectedKey = getActiveSessionStorageKey(userA.id);
    expect(expectedKey).toBe('dsa_active_session_usr_user_a_123');

    const storedData = localStorage.getItem(expectedKey);
    expect(storedData).not.toBeNull();
    const parsed = JSON.parse(storedData!);
    expect(parsed.problem.title).toBe('Generate Parentheses');
    expect(parsed.problem.leetcode_id).toBe('22');

    expect(localStorage.getItem('ai_dsa_active_session')).toBeNull();
    expect(localStorage.getItem('dsa_active_session_usr_user_b_456')).toBeNull();
  });

  it('Requirement 2: In logout(), clears localStorage and resets active session state to null', () => {
    const userA = { id: 'usr_user_a_123', email: 'usera@example.com' };
    useAuthStore.getState().setAuth('mock_token_a', userA);

    useActiveSessionStore.getState().startSession({
      problem: {
        leetcode_id: '22',
        title: 'Generate Parentheses',
        difficulty: 'Medium',
      },
      problemText: 'Generate valid parentheses',
      analysis: dummyAnalysis,
    });

    expect(useActiveSessionStore.getState().session).not.toBeNull();

    useAuthStore.getState().logout();

    expect(useActiveSessionStore.getState().session).toBeNull();
    expect(useActiveSessionStore.getState().activeUserId).toBeNull();
    expect(localStorage.getItem('dsa_active_session_usr_user_a_123')).toBeNull();
    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('Requirement 3: In login/signup, clears leftover session keys before setting new token and user', () => {
    localStorage.setItem(
      'dsa_active_session_old_user',
      JSON.stringify({ problem: { title: 'Leftover problem' } })
    );
    localStorage.setItem(
      'ai_dsa_active_session',
      JSON.stringify({ problem: { title: 'Old global problem' } })
    );

    clearLeftoverSessionKeys();

    expect(localStorage.getItem('dsa_active_session_old_user')).toBeNull();
    expect(localStorage.getItem('ai_dsa_active_session')).toBeNull();
  });

  it('End-to-End multi-user flow: User B never sees User A active session', () => {
    const userA = { id: 'usr_a_id', email: 'a@example.com' };
    useAuthStore.getState().setAuth('token_a', userA);

    useActiveSessionStore.getState().startSession({
      problem: {
        leetcode_id: '22',
        title: 'Generate Parentheses',
        difficulty: 'Medium',
      },
      problemText: 'Backtracking parenthesis generation',
      analysis: dummyAnalysis,
    });

    expect(useActiveSessionStore.getState().session?.problem.title).toBe(
      'Generate Parentheses'
    );

    useAuthStore.getState().logout();
    expect(useActiveSessionStore.getState().session).toBeNull();

    clearLeftoverSessionKeys();
    const userB = { id: 'usr_b_id', email: 'b@example.com' };
    useAuthStore.getState().setAuth('token_b', userB);

    expect(useActiveSessionStore.getState().session).toBeNull();
    expect(localStorage.getItem('dsa_active_session_usr_b_id')).toBeNull();
  });

  it('parseJwtUser: Extracts user id and email correctly from standard JWT format', () => {
    const payload = JSON.stringify({ sub: 'uuid-999', email: 'test@example.com' });
    const b64Payload = Buffer.from(payload).toString('base64').replace(/=/g, '');
    const token = `header.${b64Payload}.signature`;

    const parsed = parseJwtUser(token);
    expect(parsed).not.toBeNull();
    expect(parsed?.id).toBe('uuid-999');
    expect(parsed?.email).toBe('test@example.com');
  });
});

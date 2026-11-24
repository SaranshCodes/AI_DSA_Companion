import { create } from 'zustand';
import { Difficulty, PatternAnalysis, SolutionResponse } from '@/api/types';
import {
  useAuthStore,
  registerLogoutListener,
} from '@/features/auth/store/useAuthStore';

export type HelpEvent =
  | { kind: 'hint'; level: 1 | 2 | 3; at: number }
  | { kind: 'approach'; at: number }
  | { kind: 'code'; at: number };

export interface ActiveSession {
  problem: {
    leetcode_id: string;
    title: string;
    difficulty: Difficulty;
    url?: string | null;
  };
  problemText: string;
  analysis: PatternAnalysis;
  startedAt: number;
  hints: Partial<Record<1 | 2 | 3, string>>;
  solution: SolutionResponse | null;
  helpEvents: HelpEvent[];
  outcome: 'solved' | 'unsolved' | null;
  outcomeAt: number | null;
}

export function getActiveSessionStorageKey(userId: string): string {
  return `dsa_active_session_${userId}`;
}

export function loadUserSessionFromStorage(userId: string | null): ActiveSession | null {
  if (!userId || typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(getActiveSessionStorageKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      if ('state' in parsed && parsed.state?.session) {
        return parsed.state.session as ActiveSession;
      }
      if ('problem' in parsed && 'analysis' in parsed) {
        return parsed as ActiveSession;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function saveUserSessionToStorage(
  userId: string | null,
  session: ActiveSession | null
): void {
  if (!userId || typeof window === 'undefined') return;
  const key = getActiveSessionStorageKey(userId);
  try {
    if (session) {
      localStorage.setItem(key, JSON.stringify(session));
    } else {
      localStorage.removeItem(key);
    }
  } catch {
    // ignore quota/storage limits
  }
}

interface ActiveSessionState {
  activeUserId: string | null;
  session: ActiveSession | null;
  loadForUser: (userId: string | null) => void;
  resetSession: () => void;
  startSession: (params: {
    problem: {
      leetcode_id: string;
      title: string;
      difficulty: Difficulty;
      url?: string | null;
    };
    problemText: string;
    analysis: PatternAnalysis;
  }) => void;
  recordHint: (level: 1 | 2 | 3, hintText: string) => void;
  recordApproach: (solution: SolutionResponse) => void;
  recordCode: () => void;
  setOutcome: (outcome: 'solved' | 'unsolved') => void;
  clearOutcome: () => void;
  discardSession: () => void;
}

export const useActiveSessionStore = create<ActiveSessionState>((set, get) => ({
  activeUserId: null,
  session: null,

  loadForUser: (userId) => {
    if (!userId) {
      set({ session: null, activeUserId: null });
      return;
    }
    const session = loadUserSessionFromStorage(userId);
    set({ session, activeUserId: userId });
  },

  resetSession: () => {
    set({ session: null, activeUserId: null });
  },

  startSession: ({ problem, problemText, analysis }) => {
    const userId = get().activeUserId || useAuthStore.getState().user?.id || null;
    const newSession: ActiveSession = {
      problem,
      problemText,
      analysis,
      startedAt: Date.now(),
      hints: {},
      solution: null,
      helpEvents: [],
      outcome: null,
      outcomeAt: null,
    };
    if (userId) {
      saveUserSessionToStorage(userId, newSession);
    }
    set({ session: newSession, activeUserId: userId });
  },

  recordHint: (level, hintText) => {
    const state = get();
    if (!state.session) return;
    const userId = state.activeUserId || useAuthStore.getState().user?.id || null;
    const alreadyHasHint = Boolean(state.session.hints[level]);
    const updatedSession: ActiveSession = {
      ...state.session,
      hints: {
        ...state.session.hints,
        [level]: hintText,
      },
      helpEvents: alreadyHasHint
        ? state.session.helpEvents
        : [
            ...state.session.helpEvents,
            { kind: 'hint', level, at: Date.now() },
          ],
    };
    if (userId) {
      saveUserSessionToStorage(userId, updatedSession);
    }
    set({ session: updatedSession });
  },

  recordApproach: (solution) => {
    const state = get();
    if (!state.session) return;
    const userId = state.activeUserId || useAuthStore.getState().user?.id || null;
    const hadApproach = state.session.helpEvents.some((e) => e.kind === 'approach');
    const updatedSession: ActiveSession = {
      ...state.session,
      solution,
      helpEvents: hadApproach
        ? state.session.helpEvents
        : [...state.session.helpEvents, { kind: 'approach', at: Date.now() }],
    };
    if (userId) {
      saveUserSessionToStorage(userId, updatedSession);
    }
    set({ session: updatedSession });
  },

  recordCode: () => {
    const state = get();
    if (!state.session) return;
    const userId = state.activeUserId || useAuthStore.getState().user?.id || null;
    const hadCode = state.session.helpEvents.some((e) => e.kind === 'code');
    const updatedSession: ActiveSession = {
      ...state.session,
      helpEvents: hadCode
        ? state.session.helpEvents
        : [...state.session.helpEvents, { kind: 'code', at: Date.now() }],
    };
    if (userId) {
      saveUserSessionToStorage(userId, updatedSession);
    }
    set({ session: updatedSession });
  },

  setOutcome: (outcome) => {
    const state = get();
    if (!state.session) return;
    const userId = state.activeUserId || useAuthStore.getState().user?.id || null;
    const updatedSession: ActiveSession = {
      ...state.session,
      outcome,
      outcomeAt: Date.now(),
    };
    if (userId) {
      saveUserSessionToStorage(userId, updatedSession);
    }
    set({ session: updatedSession });
  },

  clearOutcome: () => {
    const state = get();
    if (!state.session) return;
    const userId = state.activeUserId || useAuthStore.getState().user?.id || null;
    const updatedSession: ActiveSession = {
      ...state.session,
      outcome: null,
      outcomeAt: null,
    };
    if (userId) {
      saveUserSessionToStorage(userId, updatedSession);
    }
    set({ session: updatedSession });
  },

  discardSession: () => {
    const userId = get().activeUserId || useAuthStore.getState().user?.id || null;
    if (userId) {
      saveUserSessionToStorage(userId, null);
    }
    set({ session: null });
  },
}));

// Register onLogout listener to reset active session on logout
registerLogoutListener(() => {
  useActiveSessionStore.getState().resetSession();
});

// Reactively subscribe to useAuthStore changes
useAuthStore.subscribe((state, prevState) => {
  const currentUserId = state.user?.id || null;
  const prevUserId = prevState?.user?.id || null;
  if (currentUserId !== prevUserId) {
    if (currentUserId) {
      useActiveSessionStore.getState().loadForUser(currentUserId);
    } else {
      useActiveSessionStore.getState().resetSession();
    }
  }
});

// Initial startup hydration check: DO NOT LOAD UNTIL user.id IS AVAILABLE!
if (typeof window !== 'undefined') {
  const initialUser = useAuthStore.getState().user;
  if (initialUser?.id) {
    useActiveSessionStore.getState().loadForUser(initialUser.id);
  }
}

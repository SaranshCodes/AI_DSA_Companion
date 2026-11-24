import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Difficulty, PatternAnalysis, SolutionResponse } from '@/api/types';

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

interface ActiveSessionState {
  session: ActiveSession | null;
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

export const useActiveSessionStore = create<ActiveSessionState>()(
  persist(
    (set) => ({
      session: null,

      startSession: ({ problem, problemText, analysis }) =>
        set({
          session: {
            problem,
            problemText,
            analysis,
            startedAt: Date.now(),
            hints: {},
            solution: null,
            helpEvents: [],
            outcome: null,
            outcomeAt: null,
          },
        }),

      recordHint: (level, hintText) =>
        set((state) => {
          if (!state.session) return state;
          const alreadyHasHint = Boolean(state.session.hints[level]);
          return {
            session: {
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
            },
          };
        }),

      recordApproach: (solution) =>
        set((state) => {
          if (!state.session) return state;
          const hadApproach = state.session.helpEvents.some((e) => e.kind === 'approach');
          return {
            session: {
              ...state.session,
              solution,
              helpEvents: hadApproach
                ? state.session.helpEvents
                : [...state.session.helpEvents, { kind: 'approach', at: Date.now() }],
            },
          };
        }),

      recordCode: () =>
        set((state) => {
          if (!state.session) return state;
          const hadCode = state.session.helpEvents.some((e) => e.kind === 'code');
          return {
            session: {
              ...state.session,
              helpEvents: hadCode
                ? state.session.helpEvents
                : [...state.session.helpEvents, { kind: 'code', at: Date.now() }],
            },
          };
        }),

      setOutcome: (outcome) =>
        set((state) => {
          if (!state.session) return state;
          return {
            session: {
              ...state.session,
              outcome,
              outcomeAt: Date.now(),
            },
          };
        }),

      clearOutcome: () =>
        set((state) => {
          if (!state.session) return state;
          return {
            session: {
              ...state.session,
              outcome: null,
              outcomeAt: null,
            },
          };
        }),

      discardSession: () => set({ session: null }),
    }),
    {
      name: 'ai_dsa_active_session',
    }
  )
);

# AI DSA Companion — Frontend Implementation & Architecture Documentation

## 1. Overview
The AI DSA Companion frontend is a high-performance, accessible, production-grade React application providing an intentional learning layer for LeetCode practice. Built on the core principle that **"Independence is the metric"**, the product tracks hints, approach requests, and code requests to measure and improve autonomous problem-solving capabilities over time.

This documentation serves as the complete source of truth for the frontend architecture, design tokens, session business logic, API integrations, and backend observations.

---

## 2. Stack and Rationale

| Technology | Selection | Rationale |
|---|---|---|
| **Build Tool & Bundler** | Vite 6 | Instant HMR, minimal configuration, native ESM support. |
| **Framework & UI** | React 18 + TypeScript (`strict: true`) | Predictable UI state rendering, strict type-safety preventing runtime errors and eliminating `any`. |
| **Styling** | Tailwind CSS + CSS Variables | Semantic design tokens matching monochrome editorial aesthetics without third-party CSS overhead. |
| **Routing** | React Router v6 | Declarative client-side routing, route guards, active navigation states. |
| **Server State** | TanStack Query v5 | Automatic caching, stale-while-revalidate, mutation lifecycle, query invalidation. |
| **Client State** | Zustand (`persist` middleware) | Lightweight state management for active session tracking with localStorage persistence across refreshes. |
| **Charts** | Recharts | Composable SVG-based chart library for performance trends, bar charts, and donuts. |
| **Icons** | Lucide React | Clean, tree-shakeable stroke icons matching the minimal monochrome design language. |
| **Markdown** | react-markdown | Safe markdown rendering for AI algorithmic explanations and approach breakdowns. |
| **Mocking & Testing** | MSW (Mock Service Worker) + Vitest | Full network-level API mocking for standalone development and browser verification; blazing-fast unit testing. |
| **Typography** | `@fontsource/inter` | Self-hosted Inter font eliminating runtime external CDN dependencies. |

---

## 3. Architecture

### 3.1 Final Directory Tree
```text
frontend/
├── .env.example
├── .eslintrc.cjs
├── README.md
├── implementation.md
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   └── mockServiceWorker.js
└── src/
    ├── main.tsx
    ├── app/
    │   ├── App.tsx
    │   ├── providers.tsx
    │   ├── queryClient.ts
    │   ├── router.tsx
    │   ├── guards/
    │   │   ├── AuthGuard.tsx
    │   │   └── GuestGuard.tsx
    │   ├── layout/
    │   │   ├── AppShell.tsx
    │   │   ├── TopNav.tsx
    │   │   └── UserMenu.tsx
    │   └── pages/
    │       └── NotFoundPage.tsx
    ├── api/
    │   ├── client.ts
    │   ├── errors.ts
    │   ├── types.ts
    │   ├── __tests__/
    │   │   └── errors.test.ts
    │   └── endpoints/
    │       ├── analysis.ts
    │       ├── auth.ts
    │       ├── dashboard.ts
    │       ├── recommendations.ts
    │       └── sessions.ts
    ├── components/
    │   └── ui/
    │       ├── Badge.tsx
    │       ├── Button.tsx
    │       ├── Card.tsx
    │       ├── Chip.tsx
    │       ├── DataTable.tsx
    │       ├── Dialog.tsx
    │       ├── DifficultyBadge.tsx
    │       ├── EmptyState.tsx
    │       ├── ErrorState.tsx
    │       ├── HelpRow.tsx
    │       ├── Input.tsx
    │       ├── KpiCard.tsx
    │       ├── ProgressBar.tsx
    │       ├── SectionLabel.tsx
    │       ├── Select.tsx
    │       ├── Skeleton.tsx
    │       ├── StatStrip.tsx
    │       ├── Textarea.tsx
    │       ├── Timer.tsx
    │       ├── Toast.tsx
    │       └── useToast.ts
    ├── features/
    │   ├── auth/
    │   │   ├── components/LoginForm.tsx
    │   │   ├── hooks/useAuth.ts
    │   │   ├── pages/LoginPage.tsx
    │   │   └── store/useAuthStore.ts
    │   ├── dashboard/
    │   │   ├── components/
    │   │   │   ├── CurrentFocusCard.tsx
    │   │   │   ├── StartBar.tsx
    │   │   │   └── TodayFocusCard.tsx
    │   │   ├── hooks/useDashboardData.ts
    │   │   └── pages/DashboardPage.tsx
    │   ├── session/
    │   │   ├── components/
    │   │   │   ├── HelpLadder.tsx
    │   │   │   ├── OutcomeCard.tsx
    │   │   │   ├── PatternCard.tsx
    │   │   │   ├── SessionHeader.tsx
    │   │   │   ├── SessionResultCard.tsx
    │   │   │   ├── SessionSetupForm.tsx
    │   │   │   └── WrapUpForm.tsx
    │   │   ├── hooks/
    │   │   │   ├── useSessionAnalysis.ts
    │   │   │   └── useSessionTimer.ts
    │   │   ├── pages/SessionPage.tsx
    │   │   ├── store/useActiveSessionStore.ts
    │   │   ├── utils/sessionPayload.ts
    │   │   └── __tests__/sessionPayload.test.ts
    │   ├── history/
    │   │   ├── components/
    │   │   │   ├── HistoryFilters.tsx
    │   │   │   └── HistoryRowExpand.tsx
    │   │   ├── hooks/useHistorySessions.ts
    │   │   └── pages/HistoryPage.tsx
    │   ├── analytics/
    │   │   ├── components/
    │   │   │   ├── AreasToImprove.tsx
    │   │   │   ├── HelpLevelDonut.tsx
    │   │   │   ├── IndependenceTrendChart.tsx
    │   │   │   ├── PatternPerformanceChart.tsx
    │   │   │   └── ProgressOverTime.tsx
    │   │   └── pages/AnalyticsPage.tsx
    │   └── revision/
    │       ├── components/
    │       │   ├── RevisionQueue.tsx
    │       │   └── WeakPatternRanking.tsx
    │       ├── hooks/useRevisionData.ts
    │       └── pages/RevisionPage.tsx
    ├── lib/
    │   ├── analytics.ts
    │   ├── constants.ts
    │   ├── formatters.ts
    │   ├── independence.ts
    │   ├── parseInput.ts
    │   └── __tests__/
    │       ├── analytics.test.ts
    │       ├── independence.test.ts
    │       └── parseInput.test.ts
    ├── mocks/
    │   ├── browser.ts
    │   ├── fixtures.ts
    │   └── handlers.ts
    └── styles/
        └── tokens.css
```

### 3.2 State Split & Data Flow
1. **Server State (TanStack Query)**:
   - Queries: `["auth", "me"]`, `["dashboard", "overview"]`, `["dashboard", "patterns"]`, `["sessions"]`, `["recommendations"]`.
   - Mutations: AI pattern analysis, hint generation, solution generation, session creation, login.
   - Cache invalidation occurs automatically when a session is saved.
2. **Client State (Zustand)**:
   - `useAuthStore`: Holds `token`, handles login/logout actions, persists to `localStorage`.
   - `useActiveSessionStore`: Holds active problem details, problem text, pattern analysis, timer timestamps, sequential hints cache, full solution cache, raw append-only `HelpEvent[]` log, outcome, and outcome timestamp. Persisted in `localStorage` to survive page reloads and 401 redirects.
3. **Global Network & Auth Interceptor**:
   - `api/client.ts` intercepts all outgoing requests, attaches the Bearer token, and handles 401 Unauthorized responses by clearing auth state and navigating to `/login?next=<current_path>` while preserving unsaved active session data.

---

## 4. API Integration Map

| Endpoint | Method | Client Function | TanStack Query Hook | Consumer Screen |
|---|---|---|---|---|
| `/api/auth/login` | `POST` | `authApi.login` | `useLoginMutation` | Login Screen |
| `/api/auth/me` | `GET` | `authApi.getMe` | `useMeQuery` | App Shell (UserMenu) |
| `/api/analysis/pattern` | `POST` | `analysisApi.analyzePattern` | `useAnalyzePatternMutation` | Session Setup Form |
| `/api/analysis/hint` | `POST` | `analysisApi.getHint` | `useGetHintMutation` | Session HelpLadder |
| `/api/analysis/solution` | `POST` | `analysisApi.getSolution` | `useGetSolutionMutation` | Session HelpLadder |
| `/api/sessions/` | `POST` | `sessionsApi.saveSession` | `useSaveSessionMutation` | Session WrapUpForm |
| `/api/sessions/` | `GET` | `sessionsApi.getSessions` | `useSessionsQuery` | History, Analytics (progress & donut) |
| `/api/dashboard/` | `GET` | `dashboardApi.getOverview` | `useDashboardOverviewQuery` | Dashboard, Analytics |
| `/api/dashboard/patterns` | `GET` | `dashboardApi.getPatterns` | `usePatternAnalyticsQuery` | Analytics |
| `/api/recommendations/` | `GET` | `recommendationsApi.getRecommendations` | `useRecommendationsQuery` | Dashboard, Revision, Analytics |

---

## 5. Screens Specification & Routing

| Route | Screen | Components & Responsibilities | States (Loading / Empty / Error) |
|---|---|---|---|
| `/login` | Login | Centered auth card, email/password inputs, loading state, error alert, link to signup. | Inline API error on failure. |
| `/signup` | Sign Up | Centered registration card, email, password, confirm password, validation, link to login. | Inline validation error, API error banner. |
| `/` | Dashboard | Greeting header, Quick problem StartBar, 4 KPI cards, Current Focus list, Today's Focus dark card. | Skeletons for KPIs & cards; zero-state onboarding when `total_attempted === 0`; error state with Retry. |
| `/session` | Current Session | **State A**: Setup form (LC ID, title, difficulty, URL, statement). **State B**: Active session (Header, StatStrip, PatternCard, 5-row HelpLadder, Session details, Outcome/Wrap-up form, Saved Result). | Analysis loading skeleton, 500 error banner with manual retry; never auto-retries AI requests. |
| `/history` | History | Header, Filter bar (Pattern, Result, Difficulty), Data table with expandable rows for notes/post-solve help, 15 items/page pagination. | Skeletons; empty state for new users, filtered empty state with "Clear filters"; error retry. |
| `/analytics` | DSA Progress | 4 KPIs, Pattern Performance bar chart, Problems by Help Level donut, Areas to Improve cards, Day 1 vs Day N progress comparison, Independence trend line. | Skeletons; insufficient data fallback (<2 practice days for comparison); error retry. |
| `/revision` | Revision | Dark suggestion banner, Revision queue (due-now prioritized) with "Practice Again" CTA, Ranked weak patterns table. | Skeletons; empty queue message; error retry. |

---

## 6. Design Fidelity & Intentional Decisions

### Visual Style
- **Monochrome & Minimal**: Crisp `#FFFFFF` and `#FAFAFA` surfaces with `#E5E5E5` borders and `#0A0A0A` text/buttons.
- **Color Accent Rules**:
  - Green (`#059669` / `#ECFDF5`): Independent solves, positive progress delta, Easy difficulty badge.
  - Amber (`#D97706` / `#FFFBEB`): Assisted solves, struggling patterns, Medium difficulty badge, in-progress timer dot.
  - Red (`#DC2626` / `#FEF2F2`): Unsolved/attempted, negative delta, Hard difficulty badge.
- **Intentional Structural Adjustments**:
  - Top navigation bar replaces sidebar for full-width horizontal responsive layouts (~1120px max-width container).
  - Omitted unsupported fields (Pattern Confidence %, "Why not another approach?") that do not exist in backend schema.
  - Dynamic derivation of Day 1 vs Day N progress comparison and Help Level donut from `/api/sessions/` client-side.

---

## 7. Session Workflow & Business Logic

### 7.1 Active Session Store Specification
```ts
type HelpEvent =
  | { kind: 'hint'; level: 1 | 2 | 3; at: number }
  | { kind: 'approach'; at: number }
  | { kind: 'code'; at: number };

interface ActiveSession {
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
```

### 7.2 Event Log and Counting Rules
1. **Clock & Timer**:
   - `startedAt` is set when pattern analysis succeeds.
   - Timer is derived via `Date.now() - startedAt`.
   - Frozen at `outcomeAt` when user clicks "I Solved It" or "I Couldn't Solve It".
   - If user clicks "Change answer", `outcome` and `outcomeAt` are cleared and timer resumes.
2. **Help Request Rules**:
   - **Hints**: Strictly sequential (Hint 1 -> Hint 2 -> Hint 3). Locked rows show "Reveal Hint N-1 first".
   - **Approach**: Can be unlocked at any point with confirmation dialog. Unlocks time/space complexity and Markdown explanation.
   - **Code**: Becomes available after Approach has been revealed. Requires confirmation dialog.
3. **Partitioning Assistance Events**:
   - For **Solved** sessions:
     - Events where `at <= outcomeAt`: Counted in `hints_used`, `approach_requested`, `code_requested`.
     - Events where `at > outcomeAt`: Counted in `hints_used_after_solve`, `approach_requested_after_solve`, `code_requested_after_solve`. Post-solve help **does not forfeit independent status**.
   - For **Unsolved** sessions (`Attempted`):
     - All events count towards primary assistance counters.
     - Post-solve counters remain `0` / `false`.
4. **Independence Calculation**:
   - `solved_independently === 'Yes'` **ONLY** when `status === 'Solved'` AND `hints_used === 0` AND `!approach_requested` AND `!code_requested`.

---

## 8. Shared Pure Utilities & Unit Tests

All utilities are implemented in `src/lib/` and unit tested in `src/lib/__tests__/`:

- `isSolved(session)`: Checks if status is "solved" (case-insensitive, trimmed).
- `isIndependent(session)`: Verifies solve status with 0 hints and neither approach nor code requested before solve.
- `highestHelp(session)`: Returns `'code' | 'approach' | 'hint' | 'none'`.
- `getResultTier(session)`: Maps session to `'independent' | 'solved' | 'solved_with_help' | 'attempted'`.
- `helpLevelBuckets(sessions)`: Groups solved sessions into independent, hint, approach, and code tiers.
- `computeProgress(sessions)`: Compares baseline (first day) with overall progress, returning problems, independent solve rate, hints per problem, and average confidence deltas.
- `parseProblemInput(raw)`: Extracts ID or LeetCode slug, formatting title and URL cleanly.
- `abbreviatePattern(pattern, max)`: Shortens pattern labels for Recharts X-axis.
- `normalizeError(err, baseUrl)`: Formats 422 arrays, string details, and network errors into uniform `AppError`.
- `buildSessionPayload(session, form)`: Tested against 5 distinct scenarios (independent, assisted, solved-then-viewed, unsolved, minimum 1 min time).

**Test Results**: 22 passed across 5 test suites.

---

## 9. Backend Issues & Verification Findings

During codebase audit, the 3 known issues were verified against backend source code:

1. **`analytics_service._is_independent_solve` typo**:
   - **Status**: **VERIFIED FIXED** in commit `45e06ed`.
   - **Code**: `app/services/analytics_service.py` line 15 now correctly accesses `not bool(session.get("approach_requested"))` (previously `appraoch_requested`).
2. **`recommendation_service.generate_recommendations` revision queue loop**:
   - **Status**: **REMAINS UNFIXED** in backend.
   - **Code**: In `app/services/recommendation_service.py` lines 102–132, `revision_queue: List[RevisionProblemItem] = []` and its population loop are nested inside the outer `for s in sessions:` loop. While `return RecommendationResponse(...)` was moved outside in `45e06ed`, the revision queue is redundantly rebuilt and sorted on every iteration.
3. **Pattern string `"Uncategorized"`**:
   - **Status**: **PARTIALLY FIXED**.
   - **Code**: In `app/services/analytics_service.py:128` and `app/services/recommendation_service.py:55, 118`, `"Uncategorized"` has no leading space. However, in `app/services/recommendation_service.py:34`, the reason string still contains a leading space: `" Solved independently - scheduled for standard 7-day retention."`.

---

## 10. Phase Log

| Phase | Description | Status | Verification Date |
|---|---|---|---|
| **Phase 0** | Codebase audit, backend verification, implementation planning. | **DONE** | 2026-11-24 |
| **Phase 1** | Foundation, Tailwind tokens, font, 20 UI primitives, navigation, router, MSW & fixtures. | **DONE** | 2026-11-24 |
| **Phase 2** | API client, errors, auth store, login, guards, `/me`, logout, central 401 handling. | **DONE** | 2026-11-24 |
| **Phase 3** | Complete session flow, timer, sequential hints, confirmation dialogs, outcome rules, tests. | **DONE** | 2026-11-24 |
| **Phase 4** | Dashboard, start bar, 4 KPIs, focus cards, shared utilities. | **DONE** | 2026-11-24 |
| **Phase 5** | History table, filters, analytics KPIs, pattern chart, donut, progress comparison, trend. | **DONE** | 2026-11-24 |
| **Phase 6** | Spaced-repetition revision queue, weak pattern rankings, practice again prefill. | **DONE** | 2026-11-24 |
| **Phase 7** | Quality gates passed (`npm run test`, `typecheck`, `lint`, `build`), README, `.env.example`. | **DONE** | 2026-11-24 |

---

## 11. Verification Checklist

- [x] All 6 screens plus login implemented and responsive down to 360px.
- [x] Visual fidelity matched to design specifications with top navigation bar.
- [x] Session counters follow Section 8 rules precisely and partition pre-solve vs post-solve events.
- [x] All 22 Vitest unit tests pass (`npm run test`).
- [x] Zero TypeScript errors (`npm run typecheck`).
- [x] Zero ESLint errors or warnings (`npm run lint`).
- [x] Production build generated cleanly in `dist/` (`npm run build`).
- [x] MSW mock mode available via `VITE_USE_MOCKS=true` with complete screenshot fixture values.

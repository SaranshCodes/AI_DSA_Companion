# AI DSA Companion — React + Tailwind Frontend

Production-grade web application for the **AI DSA Companion** platform. It provides an intelligent learning layer for LeetCode practice, identifying algorithmic patterns with Gemini, progressive 3-stage hints, full approach and reference solution requests, and spaced-repetition revision schedules.

The fundamental metric tracked throughout the product is **Independence**: solving problems without AI assistance.

---

## 1. Quick Start

### Prerequisites
- Node.js `v20+` or `v24+`
- npm `v10+`

### Installation
```bash
cd frontend
npm install
```

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_BASE_URL` | `http://127.0.0.1:8000` | URL of the running FastAPI backend. |
| `VITE_USE_MOCKS` | `false` | When set to `true`, enables Mock Service Worker (MSW) client-side API simulation with realistic fixtures. |

### Running Locally

#### Option A: Standalone Mock Mode (No backend required)
To test and develop with complete screenshot fixtures (47 attempted, 39 solved, 28 independent, 62 hints, weak patterns, etc.):
```bash
# In .env set:
VITE_USE_MOCKS=true

# Start Vite dev server:
npm run dev
```
Open [http://localhost:5173](http://localhost:5173). Sign in with any email and password (e.g. `saransh@dsa-companion.dev` / `password123`).

#### Option B: Connected to Local FastAPI Backend
```bash
# Start FastAPI backend (from project root):
uvicorn app.main:app --reload --port 8000

# Start frontend (in frontend/):
npm run dev
```

---

## 2. Scripts & Quality Gates

Run these commands inside `frontend/`:

```bash
# Start development server
npm run dev

# Run full TypeScript typecheck
npm run typecheck

# Run ESLint (zero-warning threshold)
npm run lint

# Run Vitest unit test suite
npm run test

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 3. Architecture & Key Features

- **Top Navigation & App Shell**: Sticky 64px header with brand icon, active navigation pills (`/`, `/session`, `/history`, `/analytics`, `/revision`), active problem indicator dot, and authenticated user dropdown.
- **Active Session State Machine**: Managed via Zustand with `localStorage` persistence. The timer starts upon pattern analysis, freezes at outcome selection, and automatically partitions events into pre-solve and post-solve counters so post-solve solution review never removes independent solve credit.
- **Progressive Help Ladder**: 3 sequential hints (locked rows enforce revealing earlier hints first), approach request with confirmation dialog, and reference Python 3 code with copy button.
- **DSA Progress Analytics**: Recharts bar chart for pattern independent solve rates (struggling patterns highlighted in amber), assistance donut chart over solved problems, Day 1 vs Day N progress comparison, and independence trend line.
- **Spaced-Repetition Revision**: Prioritized queue ranking due-now problems first, with "Practice Again" shortcut that prefills session setup.

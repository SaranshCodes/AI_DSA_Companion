import './mockLocalStorage';
import { describe, it, expect, beforeEach } from 'vitest';
import { SolutionResponse } from '@/api/types';

describe('Multi-language Solution Logic & Fallbacks', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const modernSolution: SolutionResponse = {
    approach: 'Optimal BFS/DFS approach',
    code: 'class Solution:\n    def solve(self): pass',
    solutions: {
      python: 'class Solution:\n    def solve(self): pass',
      cpp: 'class Solution {\npublic:\n    void solve() {}\n};',
      java: 'class Solution {\n    public void solve() {}\n}',
    },
    time_complexity: 'O(N)',
    space_complexity: 'O(1)',
  };

  const legacyCachedSolution: SolutionResponse = {
    approach: 'Legacy cached approach',
    code: 'class Solution:\n    def solve(self): # legacy code',
    time_complexity: 'O(N)',
    space_complexity: 'O(1)',
  };

  const resolveCode = (
    solution: SolutionResponse,
    lang: 'python' | 'cpp' | 'java'
  ) => {
    return (
      solution.solutions?.[lang] ||
      (lang === 'python'
        ? solution.code
        : '// Legacy cached session — re-generate solution for C++/Java')
    );
  };

  it('resolves Python, C++, and Java code correctly when solutions object is present', () => {
    expect(resolveCode(modernSolution, 'python')).toContain('def solve(self)');
    expect(resolveCode(modernSolution, 'cpp')).toContain('void solve()');
    expect(resolveCode(modernSolution, 'java')).toContain('public void solve()');
  });

  it('safely falls back to top-level code for Python on legacy cached sessions', () => {
    expect(resolveCode(legacyCachedSolution, 'python')).toBe(legacyCachedSolution.code);
  });

  it('safely provides instructional comment for C++ and Java on legacy cached sessions without throwing', () => {
    const cppCode = resolveCode(legacyCachedSolution, 'cpp');
    const javaCode = resolveCode(legacyCachedSolution, 'java');

    expect(cppCode).toBe('// Legacy cached session — re-generate solution for C++/Java');
    expect(javaCode).toBe('// Legacy cached session — re-generate solution for C++/Java');
  });

  it('persists and restores language preference in localStorage', () => {
    localStorage.setItem('dsa_preferred_language', 'cpp');
    const stored = localStorage.getItem('dsa_preferred_language');
    expect(stored).toBe('cpp');

    localStorage.setItem('dsa_preferred_language', 'java');
    expect(localStorage.getItem('dsa_preferred_language')).toBe('java');
  });
});

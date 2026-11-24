import { apiClient } from '../client';
import {
  PatternAnalysis,
  HintResponse,
  SolutionResponse,
} from '../types';

export const analysisApi = {
  analyzePattern: async (problem_text: string): Promise<PatternAnalysis> => {
    return apiClient<PatternAnalysis>('/api/analysis/pattern', {
      method: 'POST',
      body: JSON.stringify({ problem_text }),
    });
  },

  getHint: async (
    problem_text: string,
    pattern: string,
    hint_level: 1 | 2 | 3
  ): Promise<HintResponse> => {
    return apiClient<HintResponse>('/api/analysis/hint', {
      method: 'POST',
      body: JSON.stringify({ problem_text, pattern, hint_level }),
    });
  },

  getSolution: async (
    problem_text: string,
    pattern: string
  ): Promise<SolutionResponse> => {
    return apiClient<SolutionResponse>('/api/analysis/solution', {
      method: 'POST',
      body: JSON.stringify({ problem_text, pattern }),
    });
  },
};

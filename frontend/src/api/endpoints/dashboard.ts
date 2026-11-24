import { apiClient } from '../client';
import { DashboardOverview, PatternAnalytics } from '../types';

export const dashboardApi = {
  getOverview: async (): Promise<DashboardOverview> => {
    return apiClient<DashboardOverview>('/api/dashboard/', {
      method: 'GET',
    });
  },

  getPatterns: async (): Promise<PatternAnalytics> => {
    return apiClient<PatternAnalytics>('/api/dashboard/patterns', {
      method: 'GET',
    });
  },
};

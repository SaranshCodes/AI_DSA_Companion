import { apiClient } from '../client';
import { Recommendations } from '../types';

export const recommendationsApi = {
  getRecommendations: async (): Promise<Recommendations> => {
    return apiClient<Recommendations>('/api/recommendations/', {
      method: 'GET',
    });
  },
};

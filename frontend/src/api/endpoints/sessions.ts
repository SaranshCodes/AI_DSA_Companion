import { apiClient } from '../client';
import {
  SessionCreate,
  SaveSessionResponse,
  SessionsListResponse,
} from '../types';

export const sessionsApi = {
  saveSession: async (sessionData: SessionCreate): Promise<SaveSessionResponse> => {
    return apiClient<SaveSessionResponse>('/api/sessions/', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  },

  getSessions: async (): Promise<SessionsListResponse> => {
    return apiClient<SessionsListResponse>('/api/sessions/', {
      method: 'GET',
    });
  },
};

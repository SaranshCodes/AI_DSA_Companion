import { useQuery } from '@tanstack/react-query';
import { sessionsApi } from '@/api/endpoints/sessions';

export function useHistorySessions() {
  const sessionsQuery = useQuery({
    queryKey: ['sessions'],
    queryFn: sessionsApi.getSessions,
  });

  return {
    sessions: sessionsQuery.data?.sessions || [],
    count: sessionsQuery.data?.count || 0,
    isLoading: sessionsQuery.isLoading,
    error: sessionsQuery.error,
    refetch: sessionsQuery.refetch,
  };
}

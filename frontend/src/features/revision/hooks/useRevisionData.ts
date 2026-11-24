import { useQuery } from '@tanstack/react-query';
import { recommendationsApi } from '@/api/endpoints/recommendations';

export function useRevisionData() {
  const recommendationsQuery = useQuery({
    queryKey: ['recommendations'],
    queryFn: recommendationsApi.getRecommendations,
  });

  return {
    recommendations: recommendationsQuery.data,
    isLoading: recommendationsQuery.isLoading,
    error: recommendationsQuery.error,
    refetch: recommendationsQuery.refetch,
  };
}

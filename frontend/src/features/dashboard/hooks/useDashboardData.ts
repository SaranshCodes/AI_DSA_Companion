import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/endpoints/dashboard';
import { recommendationsApi } from '@/api/endpoints/recommendations';

export function useDashboardData() {
  const overviewQuery = useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: dashboardApi.getOverview,
  });

  const patternsQuery = useQuery({
    queryKey: ['dashboard', 'patterns'],
    queryFn: dashboardApi.getPatterns,
  });

  const recommendationsQuery = useQuery({
    queryKey: ['recommendations'],
    queryFn: recommendationsApi.getRecommendations,
  });

  return {
    overview: overviewQuery.data,
    isOverviewLoading: overviewQuery.isLoading,
    overviewError: overviewQuery.error,
    refetchOverview: overviewQuery.refetch,

    patterns: patternsQuery.data,
    isPatternsLoading: patternsQuery.isLoading,
    patternsError: patternsQuery.error,
    refetchPatterns: patternsQuery.refetch,

    recommendations: recommendationsQuery.data,
    isRecommendationsLoading: recommendationsQuery.isLoading,
    recommendationsError: recommendationsQuery.error,
    refetchRecommendations: recommendationsQuery.refetch,
  };
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { analysisApi } from '@/api/endpoints/analysis';
import { sessionsApi } from '@/api/endpoints/sessions';
import { SessionCreate, SaveSessionResponse } from '@/api/types';
import { useToast } from '@/components/ui/useToast';
import { AppError } from '@/api/errors';

export function useSessionAnalysis() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: (problemText: string) => analysisApi.analyzePattern(problemText),
    onError: (err: AppError) => {
      showToast(err.message || 'Pattern analysis failed', 'error');
    },
  });

  const hintMutation = useMutation({
    mutationFn: ({
      problemText,
      pattern,
      hintLevel,
    }: {
      problemText: string;
      pattern: string;
      hintLevel: 1 | 2 | 3;
    }) => analysisApi.getHint(problemText, pattern, hintLevel),
    onError: (err: AppError) => {
      showToast(err.message || 'Failed to generate hint', 'error');
    },
  });

  const solutionMutation = useMutation({
    mutationFn: ({
      problemText,
      pattern,
    }: {
      problemText: string;
      pattern: string;
    }) => analysisApi.getSolution(problemText, pattern),
    onError: (err: AppError) => {
      showToast(err.message || 'Failed to generate solution', 'error');
    },
  });

  const saveMutation = useMutation({
    mutationFn: (payload: SessionCreate): Promise<SaveSessionResponse> =>
      sessionsApi.saveSession(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      showToast('Session saved successfully!', 'success');
    },
    onError: (err: AppError) => {
      showToast(err.message || 'Failed to save session', 'error');
    },
  });

  return {
    analyze: analyzeMutation.mutateAsync,
    isAnalyzing: analyzeMutation.isPending,
    analyzeError: analyzeMutation.error as AppError | null,
    resetAnalyze: analyzeMutation.reset,

    getHint: hintMutation.mutateAsync,
    isGeneratingHint: hintMutation.isPending,

    getSolution: solutionMutation.mutateAsync,
    isGeneratingSolution: solutionMutation.isPending,

    saveSession: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    saveError: saveMutation.error as AppError | null,
  };
}

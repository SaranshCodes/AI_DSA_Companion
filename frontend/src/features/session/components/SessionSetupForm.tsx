import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Difficulty } from '@/api/types';
import { useSessionAnalysis } from '../hooks/useSessionAnalysis';
import { useActiveSessionStore } from '../store/useActiveSessionStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';

export const SessionSetupForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { analyze, isAnalyzing, analyzeError, resetAnalyze } = useSessionAnalysis();
  const startSession = useActiveSessionStore((s) => s.startSession);

  const [leetcodeId, setLeetcodeId] = useState(searchParams.get('leetcode_id') || '');
  const [title, setTitle] = useState(searchParams.get('title') || '');
  const [difficulty, setDifficulty] = useState<Difficulty>(
    (searchParams.get('difficulty') as Difficulty) || 'Medium'
  );
  const [url, setUrl] = useState(searchParams.get('url') || '');
  const [problemText, setProblemText] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!leetcodeId.trim()) errs.leetcodeId = 'LeetCode problem number is required.';
    if (!title.trim()) errs.title = 'Problem title is required.';
    if (!problemText.trim()) errs.problemText = 'Problem statement is required for AI analysis.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    try {
      const analysis = await analyze(problemText);
      startSession({
        problem: {
          leetcode_id: leetcodeId.trim(),
          title: title.trim(),
          difficulty,
          url: url.trim() || null,
        },
        problemText: problemText.trim(),
        analysis,
      });
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-8 border border-border shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-text">
          Start Problem Session
        </h2>
        <p className="mt-1 text-xs text-text-muted leading-relaxed">
          Provide problem details and statement. Our AI will identify the underlying
          algorithmic pattern and prepare progressive hints.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="LeetCode #"
            required
            placeholder="e.g. 695"
            value={leetcodeId}
            onChange={(e) => {
              setLeetcodeId(e.target.value);
              if (fieldErrors.leetcodeId) setFieldErrors((p) => ({ ...p, leetcodeId: '' }));
            }}
            error={fieldErrors.leetcodeId}
            hint="Must match Chrome extension"
          />

          <div className="sm:col-span-2">
            <Input
              label="Problem Title"
              required
              placeholder="e.g. Max Area of Island"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (fieldErrors.title) setFieldErrors((p) => ({ ...p, title: '' }));
              }}
              error={fieldErrors.title}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            options={[
              { value: 'Easy', label: 'Easy' },
              { value: 'Medium', label: 'Medium' },
              { value: 'Hard', label: 'Hard' },
            ]}
          />

          <Input
            label="LeetCode URL (Optional)"
            type="url"
            placeholder="https://leetcode.com/problems/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <Textarea
          label="Problem Statement"
          required
          rows={6}
          placeholder="Paste full problem statement here including constraints..."
          value={problemText}
          onChange={(e) => {
            setProblemText(e.target.value);
            if (fieldErrors.problemText) setFieldErrors((p) => ({ ...p, problemText: '' }));
          }}
          error={fieldErrors.problemText}
          hint="The statement is required for Gemini pattern recognition"
        />

        {analyzeError && (
          <ErrorState
            title="Pattern analysis failed"
            message={analyzeError.message}
            onRetry={() => {
              resetAnalyze();
              handleSubmit();
            }}
          />
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-4 gap-2"
          isLoading={isAnalyzing}
        >
          <Sparkles className="w-4 h-4" />
          {isAnalyzing ? 'Analyzing Algorithmic Pattern...' : 'Analyze & Start Session'}
        </Button>
      </form>
    </Card>
  );
};

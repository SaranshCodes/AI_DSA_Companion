import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { parseProblemInput } from '@/lib/parseInput';
import { useActiveSessionStore } from '@/features/session/store/useActiveSessionStore';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';

export const StartBar: React.FC = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDiscard, setShowConfirmDiscard] = useState(false);
  const activeSession = useActiveSessionStore((s) => s.session);
  const discardSession = useActiveSessionStore((s) => s.discardSession);

  const handleStart = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const parsed = parseProblemInput(input);
    if (parsed.error) {
      setError(parsed.error);
      return;
    }

    if (activeSession && !activeSession.outcome) {
      setShowConfirmDiscard(true);
      return;
    }

    proceedToSession(parsed);
  };

  const proceedToSession = (parsed = parseProblemInput(input)) => {
    const params = new URLSearchParams();
    if (parsed.leetcode_id) params.set('leetcode_id', parsed.leetcode_id);
    if (parsed.title) params.set('title', parsed.title);
    if (parsed.url) params.set('url', parsed.url);

    navigate(`/session?${params.toString()}`);
  };

  const handleConfirmDiscard = () => {
    discardSession();
    setShowConfirmDiscard(false);
    proceedToSession();
  };

  return (
    <>
      <form
        onSubmit={handleStart}
        className="w-full bg-surface border border-border rounded-card p-2 sm:p-2.5 shadow-sm flex flex-col sm:flex-row items-center gap-2"
      >
        <div className="relative flex-1 w-full flex items-center px-3">
          <Sparkles className="w-4 h-4 text-text-subtle mr-2.5 shrink-0" />
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Enter LeetCode number (e.g. 695) or paste URL..."
            className="w-full text-sm text-text bg-transparent placeholder:text-text-subtle focus:outline-none"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full sm:w-auto shrink-0 px-5 gap-1.5"
        >
          Start Session
          <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      {error && <p className="mt-1.5 text-xs text-danger ml-2">{error}</p>}

      <Dialog
        isOpen={showConfirmDiscard}
        onClose={() => setShowConfirmDiscard(false)}
        title="Active session in progress"
        description="You have an ongoing problem session. Starting a new problem will discard your current unsaved progress."
        confirmLabel="Discard & Start New"
        confirmVariant="danger"
        onConfirm={handleConfirmDiscard}
      />
    </>
  );
};

import React, { useState } from 'react';
import { useActiveSessionStore } from '../store/useActiveSessionStore';
import { useSessionTimer } from '../hooks/useSessionTimer';
import { useSessionAnalysis } from '../hooks/useSessionAnalysis';
import { buildSessionPayload, WrapUpFormData } from '../utils/sessionPayload';
import { getResultTier } from '@/lib/independence';
import { SessionSetupForm } from '../components/SessionSetupForm';
import { SessionHeader } from '../components/SessionHeader';
import { StatStrip } from '@/components/ui/StatStrip';
import { PatternCard } from '../components/PatternCard';
import { HelpLadder } from '../components/HelpLadder';
import { OutcomeCard } from '../components/OutcomeCard';
import { WrapUpForm } from '../components/WrapUpForm';
import { SessionResultCard } from '../components/SessionResultCard';

export const SessionPage: React.FC = () => {
  const session = useActiveSessionStore((s) => s.session);
  const recordHint = useActiveSessionStore((s) => s.recordHint);
  const recordApproach = useActiveSessionStore((s) => s.recordApproach);
  const recordCode = useActiveSessionStore((s) => s.recordCode);
  const setOutcome = useActiveSessionStore((s) => s.setOutcome);
  const clearOutcome = useActiveSessionStore((s) => s.clearOutcome);
  const discardSession = useActiveSessionStore((s) => s.discardSession);

  const { saveSession, isSaving } = useSessionAnalysis();

  const [savedResult, setSavedResult] = useState<{
    tier: 'independent' | 'solved' | 'solved_with_help' | 'attempted';
    timeTakenMins: number;
    hintsUsed: number;
  } | null>(null);

  const { elapsedSeconds, elapsedMinutes } = useSessionTimer(
    session?.startedAt ?? null,
    session?.outcomeAt ?? null
  );

  // If session just saved successfully, show result card
  if (savedResult) {
    return (
      <div className="py-8">
        <SessionResultCard
          tier={savedResult.tier}
          timeTakenMins={savedResult.timeTakenMins}
          hintsUsed={savedResult.hintsUsed}
          onReset={() => {
            setSavedResult(null);
            discardSession();
          }}
        />
      </div>
    );
  }

  // State A: Setup Form (no active session)
  if (!session) {
    return <SessionSetupForm />;
  }

  // State B: Active Session
  const hintsCount = Object.keys(session.hints).length;

  const currentStatus =
    session.outcome === 'solved'
      ? 'solved'
      : session.outcome === 'unsolved'
      ? 'unsolved'
      : 'in_progress';

  const handleSaveWrapUp = async (formData: WrapUpFormData) => {
    const payload = buildSessionPayload(session, formData);
    try {
      await saveSession(payload);
      const tier = getResultTier({
        status: payload.status,
        hints_used: payload.hints_used,
        approach_requested: payload.approach_requested,
        code_requested: payload.code_requested,
      });
      setSavedResult({
        tier,
        timeTakenMins: payload.time_taken_mins,
        hintsUsed: payload.hints_used,
      });
    } catch {
      // Toast displayed in mutation
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header */}
      <SessionHeader session={session} onDiscard={discardSession} />

      {/* 2. Stat Strip */}
      <StatStrip
        elapsedSeconds={elapsedSeconds}
        hintsUsed={hintsCount}
        status={currentStatus}
      />

      {/* 3. Pattern Card */}
      <PatternCard analysis={session.analysis} />

      {/* 4. Help Ladder */}
      <HelpLadder
        session={session}
        onRecordHint={recordHint}
        onRecordApproach={recordApproach}
        onRecordCode={recordCode}
      />

      {/* 5. Outcome or Wrap-up Form */}
      {session.outcome ? (
        <WrapUpForm
          outcome={session.outcome}
          defaultTimeMinutes={elapsedMinutes}
          onSave={handleSaveWrapUp}
          onChangeAnswer={clearOutcome}
          isSaving={isSaving}
        />
      ) : (
        <OutcomeCard
          session={session}
          elapsedMinutes={elapsedMinutes}
          onSelectOutcome={setOutcome}
        />
      )}
    </div>
  );
};

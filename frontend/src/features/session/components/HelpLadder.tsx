import React, { useState } from 'react';
import { ActiveSession } from '../store/useActiveSessionStore';
import { useSessionAnalysis } from '../hooks/useSessionAnalysis';
import { HelpRow } from '@/components/ui/HelpRow';
import { Dialog } from '@/components/ui/Dialog';
import { SolutionResponse } from '@/api/types';

export interface HelpLadderProps {
  session: ActiveSession;
  onRecordHint: (level: 1 | 2 | 3, text: string) => void;
  onRecordApproach: (solution: SolutionResponse) => void;
  onRecordCode: () => void;
}

export const HelpLadder: React.FC<HelpLadderProps> = ({
  session,
  onRecordHint,
  onRecordApproach,
  onRecordCode,
}) => {
  const { getHint, isGeneratingHint, getSolution, isGeneratingSolution } =
    useSessionAnalysis();

  const [confirmDialog, setConfirmDialog] = useState<'approach' | 'code' | null>(null);

  const isSolved = session.outcome === 'solved';

  // Hints 1, 2, 3
  const hint1 = session.hints[1];
  const hint2 = session.hints[2];
  const hint3 = session.hints[3];

  const hasApproach = Boolean(session.solution);
  const hasCode = session.helpEvents.some((e) => e.kind === 'code');

  const handleRevealHint = async (level: 1 | 2 | 3) => {
    try {
      const res = await getHint({
        problemText: session.problemText,
        pattern: session.analysis.primary_pattern,
        hintLevel: level,
      });
      onRecordHint(level, res.hint);
    } catch {
      // toast shown in mutation
    }
  };

  const handleRevealApproach = async () => {
    try {
      const res = await getSolution({
        problemText: session.problemText,
        pattern: session.analysis.primary_pattern,
      });
      onRecordApproach(res);
      setConfirmDialog(null);
    } catch {
      // toast shown in mutation
    }
  };

  const handleRevealCode = () => {
    onRecordCode();
    setConfirmDialog(null);
  };

  return (
    <div className="space-y-3">
      {/* Hint 1 */}
      <HelpRow
        label="Hint 1"
        sublabel="Conceptual nudge"
        isUnlocked={Boolean(hint1)}
        isLocked={false}
        content={hint1}
        isLoading={isGeneratingHint}
        onReveal={() => handleRevealHint(1)}
        ctaText="Reveal Hint 1"
      />

      {/* Hint 2 */}
      <HelpRow
        label="Hint 2"
        sublabel="Directional strategy"
        isUnlocked={Boolean(hint2)}
        isLocked={!hint1}
        lockReason="Reveal Hint 1 first"
        content={hint2}
        isLoading={isGeneratingHint}
        onReveal={() => handleRevealHint(2)}
        ctaText="Reveal Hint 2"
      />

      {/* Hint 3 */}
      <HelpRow
        label="Hint 3"
        sublabel="Implementation details"
        isUnlocked={Boolean(hint3)}
        isLocked={!hint2}
        lockReason="Reveal Hint 2 first"
        content={hint3}
        isLoading={isGeneratingHint}
        onReveal={() => handleRevealHint(3)}
        ctaText="Reveal Hint 3"
      />

      {/* Approach */}
      <HelpRow
        label="Approach"
        sublabel="Full algorithmic explanation & complexities"
        isUnlocked={hasApproach}
        isLocked={false}
        content={session.solution?.approach}
        complexity={
          session.solution
            ? {
                time: session.solution.time_complexity,
                space: session.solution.space_complexity,
              }
            : undefined
        }
        isLoading={isGeneratingSolution}
        onReveal={() => setConfirmDialog('approach')}
        ctaText="Reveal Approach"
      />

      {/* Reference Code */}
      <HelpRow
        label="Solution Code"
        sublabel="Python 3 reference implementation"
        isUnlocked={hasCode}
        isLocked={!hasApproach}
        lockReason="Reveal Approach first"
        code={session.solution?.code}
        onReveal={() => setConfirmDialog('code')}
        ctaText="Show Code"
      />

      {/* Approach Confirmation Dialog */}
      <Dialog
        isOpen={confirmDialog === 'approach'}
        onClose={() => setConfirmDialog(null)}
        title="Reveal Full Approach?"
        description={
          isSolved
            ? 'You have already solved this problem! Viewing the full approach now is considered post-solve review and will not impact your independent solve credit.'
            : 'Revealing the complete approach counts as receiving assistance on this problem. Are you sure you want to proceed?'
        }
        confirmLabel="Reveal Approach"
        onConfirm={handleRevealApproach}
        isLoading={isGeneratingSolution}
      />

      {/* Code Confirmation Dialog */}
      <Dialog
        isOpen={confirmDialog === 'code'}
        onClose={() => setConfirmDialog(null)}
        title="Reveal Solution Code?"
        description={
          isSolved
            ? 'Viewing the reference solution code after solving is a great way to compare implementation styles and does not affect your independent solve credit.'
            : 'Viewing reference code will mark this attempt as assisted. Try to implement it independently first if possible!'
        }
        confirmLabel="Reveal Solution Code"
        onConfirm={handleRevealCode}
      />
    </div>
  );
};

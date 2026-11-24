import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { CONFIDENCE_LEVELS } from '@/lib/constants';
import { WrapUpFormData } from '../utils/sessionPayload';

export interface WrapUpFormProps {
  outcome: 'solved' | 'unsolved';
  defaultTimeMinutes: number;
  onSave: (data: WrapUpFormData) => void;
  onChangeAnswer: () => void;
  isSaving: boolean;
}

export const WrapUpForm: React.FC<WrapUpFormProps> = ({
  outcome,
  defaultTimeMinutes,
  onSave,
  onChangeAnswer,
  isSaving,
}) => {
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 4 | 5>(outcome === 'solved' ? 4 : 2);
  const [timeTakenMins, setTimeTakenMins] = useState(defaultTimeMinutes);
  const [struggleNotes, setStruggleNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      confidence,
      timeTakenMins: Math.max(1, timeTakenMins),
      struggleNotes: struggleNotes.trim(),
    });
  };

  return (
    <Card className="p-6 border border-border shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <SectionLabel>Wrap Up Session</SectionLabel>
          <div className="mt-1 flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                outcome === 'solved'
                  ? 'bg-success-bg text-success'
                  : 'bg-danger-bg text-danger'
              }`}
            >
              {outcome === 'solved' ? '✓ Marked as Solved' : '✕ Marked as Unsolved'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onChangeAnswer}
          className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-text font-medium underline-offset-4 hover:underline"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Change answer
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Confidence scale */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text mb-2">
            Confidence Rating (1 = Lost, 5 = Mastered)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {CONFIDENCE_LEVELS.map((lvl) => {
              const isSelected = confidence === lvl.value;
              return (
                <button
                  type="button"
                  key={lvl.value}
                  onClick={() => setConfidence(lvl.value as 1 | 2 | 3 | 4 | 5)}
                  className={`p-3 rounded-control border text-left transition-all ${
                    isSelected
                      ? 'border-surface-inverse bg-surface-inverse text-on-inverse shadow-sm'
                      : 'border-border bg-surface hover:bg-bg-subtle text-text'
                  }`}
                >
                  <div className="text-sm font-bold">{lvl.value}</div>
                  <div
                    className={`text-xs mt-0.5 font-medium ${
                      isSelected ? 'text-neutral-200' : 'text-text-muted'
                    }`}
                  >
                    {lvl.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Time Taken (Minutes)"
            type="number"
            min={1}
            required
            value={timeTakenMins}
            onChange={(e) => setTimeTakenMins(parseInt(e.target.value) || 1)}
            hint="Prefilled from timer, minimum 1 min"
          />

          <div className="sm:col-span-2">
            <Textarea
              label="Struggle Notes (Optional)"
              rows={2}
              placeholder="What made this tricky? Edge cases, off-by-one errors, or data structure choices..."
              value={struggleNotes}
              onChange={(e) => setStruggleNotes(e.target.value)}
              hint="Saved to your history to help future revision"
            />
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isSaving}
          >
            Save Session & Record Learning
          </Button>
        </div>
      </form>
    </Card>
  );
};

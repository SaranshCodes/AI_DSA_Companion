import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Recommendations, RevisionItem } from '@/api/types';
import { getRecommendedProblem } from '@/lib/analytics';

export interface TodayFocusCardProps {
  recommendations?: Recommendations | null;
}

export const TodayFocusCard: React.FC<TodayFocusCardProps> = ({ recommendations }) => {
  const navigate = useNavigate();
  const topWeak = recommendations?.weak_patterns?.[0];
  const recommendedProblem: RevisionItem | null = getRecommendedProblem(recommendations);

  const handleStartRecommended = () => {
    if (!recommendedProblem) {
      navigate('/session');
      return;
    }

    const params = new URLSearchParams({
      leetcode_id: recommendedProblem.leetcode_id,
      title: recommendedProblem.title,
      difficulty: recommendedProblem.difficulty,
    });
    if (recommendedProblem.url) {
      params.set('url', recommendedProblem.url);
    }
    navigate(`/session?${params.toString()}`);
  };

  return (
    <Card variant="dark" className="p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Today&apos;s Focus
          </span>
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>

        <h3 className="mt-2 text-xl font-bold text-white tracking-tight">
          {topWeak?.pattern || 'General Problem Solving'}
        </h3>

        <p className="mt-2 text-xs text-neutral-300 leading-relaxed">
          {topWeak?.reason ||
            recommendations?.suggested_next_action ||
            'Review foundational patterns and practice with intentional focus.'}
        </p>

        {/* Static non-interactive stage chips */}
        <div className="mt-5 flex flex-wrap gap-2">
          <Chip active className="bg-white/10 text-white border-white/20 text-[11px]">
            1. Review Concepts
          </Chip>
          <Chip className="bg-transparent text-neutral-300 border-white/10 text-[11px]">
            2. Practice
          </Chip>
          <Chip className="bg-transparent text-neutral-400 border-white/10 text-[11px]">
            3. Reattempt
          </Chip>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-800">
        <Button
          variant="dark-card"
          size="md"
          className="w-full justify-between"
          onClick={handleStartRecommended}
        >
          <span>
            {recommendedProblem
              ? `Practice: ${recommendedProblem.title}`
              : 'Start Recommended Problem'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

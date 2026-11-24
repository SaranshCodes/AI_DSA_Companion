import React from 'react';
import { Difficulty } from '@/api/types';
import { DIFFICULTY_COLORS } from '@/lib/constants';

export interface DifficultyBadgeProps {
  difficulty?: Difficulty | string | null;
  tableTextOnly?: boolean;
  className?: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty = 'Easy',
  tableTextOnly = false,
  className = '',
}) => {
  const norm = (difficulty || 'Easy').trim();
  const diffKey = (['Easy', 'Medium', 'Hard'].includes(norm) ? norm : 'Easy') as Difficulty;
  const config = DIFFICULTY_COLORS[diffKey] || DIFFICULTY_COLORS.Easy;

  if (tableTextOnly) {
    return <span className={`${config.text} ${className}`}>{diffKey}</span>;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.badge} ${className}`}
    >
      {diffKey}
    </span>
  );
};

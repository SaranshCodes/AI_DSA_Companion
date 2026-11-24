export const APP_NAME = 'AI DSA Companion';
export const APP_SUBTITLE = 'DSA learning companion';

export const DIFFICULTY_COLORS = {
  Easy: {
    badge: 'bg-success-bg text-success border-success/20',
    text: 'text-success font-medium',
  },
  Medium: {
    badge: 'bg-warning-bg text-warning border-warning/20',
    text: 'text-warning font-medium',
  },
  Hard: {
    badge: 'bg-danger-bg text-danger border-danger/20',
    text: 'text-danger font-medium',
  },
} as const;

export const RESULT_TIER_CONFIG = {
  independent: {
    label: 'Independent',
    badgeClass: 'bg-success-bg text-success border-success/30 font-medium',
    description: 'Solved independently without any hints or solutions requested.',
  },
  solved: {
    label: 'Solved',
    badgeClass: 'bg-success-bg text-success border-success/30 font-medium',
    description: 'Solved with conceptual or directional hints only.',
  },
  solved_with_help: {
    label: 'Solved with help',
    badgeClass: 'bg-warning-bg text-warning border-warning/30 font-medium',
    description: 'Solved after requesting full approach or reference code.',
  },
  attempted: {
    label: 'Attempted',
    badgeClass: 'bg-danger-bg text-danger border-danger/30 font-medium',
    description: 'Problem could not be solved during this session.',
  },
} as const;

export const CONFIDENCE_LEVELS = [
  { value: 1, label: 'Lost', description: 'Completely stuck or confused' },
  { value: 2, label: 'Shaky', description: 'Understood partially with hesitation' },
  { value: 3, label: 'Moderate', description: 'Could implement with effort' },
  { value: 4, label: 'Confident', description: 'Clear understanding and smooth flow' },
  { value: 5, label: 'Mastered', description: 'Could explain and solve instantly' },
] as const;

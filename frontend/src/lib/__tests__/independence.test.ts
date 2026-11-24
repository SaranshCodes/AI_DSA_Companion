import { describe, it, expect } from 'vitest';
import {
  isSolved,
  isIndependent,
  highestHelp,
  getResultTier,
  helpLevelBuckets,
} from '../independence';
import { SessionRow } from '@/api/types';

describe('independence utilities', () => {
  it('isSolved correctly identifies solved status regardless of case and trimming', () => {
    expect(isSolved({ status: 'Solved' })).toBe(true);
    expect(isSolved({ status: ' solved ' })).toBe(true);
    expect(isSolved({ status: 'SOLVED' })).toBe(true);
    expect(isSolved({ status: 'Attempted' })).toBe(false);
    expect(isSolved({ status: '' })).toBe(false);
    expect(isSolved({})).toBe(false);
  });

  it('isIndependent returns true only if solved and zero hints and neither approach nor code was requested', () => {
    expect(
      isIndependent({
        status: 'Solved',
        hints_used: 0,
        approach_requested: false,
        code_requested: false,
      })
    ).toBe(true);

    // Hints used > 0
    expect(
      isIndependent({
        status: 'Solved',
        hints_used: 1,
        approach_requested: false,
        code_requested: false,
      })
    ).toBe(false);

    // Approach requested
    expect(
      isIndependent({
        status: 'Solved',
        hints_used: 0,
        approach_requested: true,
        code_requested: false,
      })
    ).toBe(false);

    // Code requested
    expect(
      isIndependent({
        status: 'Solved',
        hints_used: 0,
        approach_requested: false,
        code_requested: true,
      })
    ).toBe(false);

    // Not solved
    expect(
      isIndependent({
        status: 'Attempted',
        hints_used: 0,
        approach_requested: false,
        code_requested: false,
      })
    ).toBe(false);
  });

  it('highestHelp identifies the highest assistance level', () => {
    expect(highestHelp({ code_requested: true, approach_requested: true, hints_used: 3 })).toBe(
      'code'
    );
    expect(highestHelp({ code_requested: false, approach_requested: true, hints_used: 2 })).toBe(
      'approach'
    );
    expect(highestHelp({ code_requested: false, approach_requested: false, hints_used: 1 })).toBe(
      'hint'
    );
    expect(highestHelp({ code_requested: false, approach_requested: false, hints_used: 0 })).toBe(
      'none'
    );
  });

  it('getResultTier maps session to the correct tier', () => {
    expect(
      getResultTier({
        status: 'Attempted',
        hints_used: 0,
        approach_requested: false,
        code_requested: false,
      })
    ).toBe('attempted');

    expect(
      getResultTier({
        status: 'Solved',
        hints_used: 0,
        approach_requested: false,
        code_requested: false,
      })
    ).toBe('independent');

    expect(
      getResultTier({
        status: 'Solved',
        hints_used: 2,
        approach_requested: false,
        code_requested: false,
      })
    ).toBe('solved');

    expect(
      getResultTier({
        status: 'Solved',
        hints_used: 0,
        approach_requested: true,
        code_requested: false,
      })
    ).toBe('solved_with_help');

    expect(
      getResultTier({
        status: 'Solved',
        hints_used: 1,
        approach_requested: true,
        code_requested: true,
      })
    ).toBe('solved_with_help');
  });

  it('helpLevelBuckets aggregates solved sessions only into 4 tiers', () => {
    const sessions = [
      {
        id: 1,
        status: 'Solved',
        hints_used: 0,
        approach_requested: false,
        code_requested: false,
      },
      {
        id: 2,
        status: 'Solved',
        hints_used: 2,
        approach_requested: false,
        code_requested: false,
      },
      {
        id: 3,
        status: 'Solved',
        hints_used: 1,
        approach_requested: true,
        code_requested: false,
      },
      {
        id: 4,
        status: 'Solved',
        hints_used: 3,
        approach_requested: true,
        code_requested: true,
      },
      {
        id: 5,
        status: 'Attempted',
        hints_used: 0,
        approach_requested: false,
        code_requested: false,
      },
    ] as unknown as SessionRow[];

    const buckets = helpLevelBuckets(sessions);
    expect(buckets).toEqual({
      independent: 1,
      hints: 1,
      approach: 1,
      solution: 1,
    });
  });
});

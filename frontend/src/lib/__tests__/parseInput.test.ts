import { describe, it, expect } from 'vitest';
import { parseProblemInput } from '../parseInput';

describe('parseProblemInput', () => {
  it('parses pure digits as leetcode_id', () => {
    const res = parseProblemInput('695');
    expect(res).toEqual({ leetcode_id: '695' });
  });

  it('trims leading and trailing whitespace', () => {
    const res = parseProblemInput('   42   ');
    expect(res).toEqual({ leetcode_id: '42' });
  });

  it('parses LeetCode problem URLs', () => {
    const res = parseProblemInput(
      'https://leetcode.com/problems/max-area-of-island/'
    );
    expect(res.slug).toBe('max-area-of-island');
    expect(res.title).toBe('Max Area Of Island');
    expect(res.url).toBe('https://leetcode.com/problems/max-area-of-island/');
  });

  it('parses LeetCode URLs without trailing slash or protocol', () => {
    const res = parseProblemInput('leetcode.com/problems/two-sum');
    expect(res.slug).toBe('two-sum');
    expect(res.title).toBe('Two Sum');
    expect(res.url).toBe('https://leetcode.com/problems/two-sum/');
  });

  it('returns error on empty or invalid input', () => {
    expect(parseProblemInput('').error).toBeDefined();
    expect(parseProblemInput('invalid-text-without-url').error).toBeDefined();
  });
});

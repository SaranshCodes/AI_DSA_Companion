export interface ParsedProblemInput {
  leetcode_id?: string;
  title?: string;
  url?: string;
  slug?: string;
  error?: string;
}

/**
 * Parses user input from start bar:
 * - Digits: "695" -> { leetcode_id: "695" }
 * - LeetCode URL: "https://leetcode.com/problems/max-area-of-island/" ->
 *   { slug: "max-area-of-island", title: "Max Area Of Island", url: "https://leetcode.com/problems/max-area-of-island/" }
 * - Leading / trailing whitespace trimmed
 * - Title-cased slug conversion with "-" replaced by space
 */
export function parseProblemInput(raw: string): ParsedProblemInput {
  const trimmed = (raw || '').trim();
  if (!trimmed) {
    return { error: 'Please enter a problem number or LeetCode URL' };
  }

  // Pure digits: LeetCode problem number
  if (/^\d+$/.test(trimmed)) {
    return { leetcode_id: trimmed };
  }

  // LeetCode URL matching: leetcode.com/problems/<slug>(/.*)?
  const urlMatch = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?leetcode\.com\/problems\/([^/?#]+)/i
  );

  if (urlMatch && urlMatch[1]) {
    const slug = urlMatch[1].toLowerCase();
    // Title case the slug: "max-area-of-island" -> "Max Area Of Island"
    const title = slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const cleanUrl = `https://leetcode.com/problems/${slug}/`;
    return {
      slug,
      title,
      url: cleanUrl,
    };
  }

  return {
    error: 'Invalid input. Please enter a problem number (e.g. 695) or a LeetCode problem URL.',
  };
}

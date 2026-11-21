function extractLeetCodeProblem() {
  const url = window.location.href;

  // Extract title (e.g., "Two Sum - LeetCode" -> "Two Sum")
  const rawTitle = document.title || "";
  const title = rawTitle.replace(/\s*-\s*LeetCode.*$/i, "").trim();

  // Extract slug as a reliable fallback ID (e.g., "two-sum")
  const slugMatch = url.match(/leetcode\.com\/problems\/([^/]+)/);
  const slug = slugMatch
    ? slugMatch[1]
    : title.toLowerCase().replace(/\s+/g, "-");

  // Try to grab numeric ID from the heading (e.g., "1. Two Sum" -> "1")
  const headingEl = document.querySelector('a[href*="/problems/"]');
  const idMatch = headingEl ? headingEl.innerText.match(/^(\d+)\./) : null;
  const leetcode_id = idMatch ? idMatch[1] : slug;

  // Extract difficulty badge (Easy / Medium / Hard)
  let difficulty = "Medium";
  const allDivs = document.querySelectorAll("div");
  for (const el of allDivs) {
    const text = el.textContent.trim();
    if (text === "Easy" || text === "Medium" || text === "Hard") {
      difficulty = text;
      break;
    }
  }

  // Extract problem description
  const descElement = document.querySelector(
    '[data-track-load="description_content"]',
  );
  let description = descElement ? descElement.innerText.trim() : "";

  if (!description) {
    const metaDesc = document.querySelector('meta[name="description"]');
    description = metaDesc ? metaDesc.getAttribute("content") : "";
  }

  return {
    leetcode_id,
    title,
    url,
    difficulty,
    problem_text: description,
  };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "GET_PROBLEM") {
    sendResponse(extractLeetCodeProblem());
  }
  return true;
});

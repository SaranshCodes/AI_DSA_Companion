PATTERN_ANALYSIS_PROMPT = """
You are an expert Data Structures and Algorithms instructor. 
Analyze the following LeetCode problem and identify its algorithmic patterns.

Return ONLY a valid JSON object with the exact following structure. Do not include markdown formatting like ```json or any conversational text.

{
    "primary_pattern": "Name of the main pattern (e.g., Grid DFS, Sliding Window, Two Pointer)",
    "secondary_patterns": ["Pattern 1", "Pattern 2"],
    "recognition_signals": ["Signal 1", "Signal 2", "Signal 3"],
    "why_this_pattern": "A short, 2-3 sentence explanation of why this pattern applies based on the problem constraints."
}

Problem Title/Description:
{problem_text}
"""
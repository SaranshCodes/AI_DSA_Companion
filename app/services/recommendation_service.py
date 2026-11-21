from collections import defaultdict
from datetime import datetime, timezone
from typing import List, Dict, Any

from app.services.analytics_service import _is_solved, _is_independent_solve
from app.schemas.recommendation import ( WeakPatternItem, RevisionProblemItem, RecommendationResponse)

def _parse_timestamp(ts:str) -> datetime:
    """ 
    Safely parses ISO timestamps from Supabase into timezone-aware UTC datetimes"""
    if not ts:
        return datetime.now(timezone.utc)
    
    normalized = ts.replace("Z", "+00:00")
    dt = datetime.fromisoformat(normalized)
    if dt.tzinfo is None:
        dt =dt.replace(tzinfo = timezone.utc)
    return dt

def _get_revision_interval(session: Dict[str, Any])-> tuple[int,str]:
    """ 
     Determines the spaced-repetition interval (in days) and human-readable reason based on the latest attempt at a problem
    """
    solved = _is_solved(session)
    independent = _is_independent_solve(session)
    confidence = session.get("confidence") or 1
    if not solved: 
        return 1, "Previously unsolved - retry soon to build familiarity."
    if not independent:
        return 3, "Solved with AI assistance - revise to build independent recall."
    if confidence<=2:
        return 3, "Low confidence score - reinforce this pattern soon."
    if confidence<=4:
        return 7, " Solved independently - scheduled for standard 7-day retention."
    return 14, "Mastered with high confidence - long-term spaced review."

def generate_recommendations(sessions: List[Dict[str,Any]]) -> RecommendationResponse:
    """ 
    Generates ranked weak patterns, a spaced-repetition revision queue,
    and a clear next-step suggestion from the user's session history.
    """
    if not sessions:
        return RecommendationResponse(
            suggested_next_action = "Start by solving and logging your first Leetcode problem to unlock personalized recommendations.",
            weak_patterns =[],
            revision_queue=[],
        )
        
    now = datetime.now(timezone.utc)
    
    # 1. Rank weak patterns
    pattern_groups = defaultdict(list)
    for s in sessions:
        problem = s.get("problems") or {}
        pattern = problem.get("primary_pattern") or " Uncategorized"
        pattern_groups[pattern].append(s)
        
    weak_patterns: List[WeakPatternItem] = []
    for pattern, items in pattern_groups.items():
        attempts = len(items)
        independent_count =sum(1 for s in items if _is_independent_solve(s))
        independent_rate = round((independent_count/attempts)*100,2)
        
        confidences = [s["confidence"] for s in items if s.get("confidence") is not None]
        avg_conf = round(sum(confidences)/ len(confidences),2) if confidences else 3.0
        
        # Calculate weighted weakness score (0=mastered, 100 = high priority)
        independence_deficit = 100.0 - independent_rate
        confidence_deficit = max(0.0, min(100.0, ((5.0 - avg_conf)/4.0)*100.0))
        weakness_score = round((0.65 * independence_deficit) + (0.35* confidence_deficit),2)
        
        if independent_rate <50.0:
            reason = f"Low independent solve rate ({independent_rate}%)."
        elif avg_conf <3.5:
            reason = f"Moderate/low average confidence ({avg_conf}/5)."
            
        else:
            reason = "Solid performance - maintain with periodic practice."
            
        weak_patterns.append(
            WeakPatternItem(
                pattern = pattern,
                weakness_score= weakness_score,
                independent_solve_rate= independent_rate,
                avg_confidence= avg_conf,
                attempts = attempts,
                reason = reason, 
            )
        )
        
    # Sort weakest patterns first
    weak_patterns.sort(key = lambda x: x.weakness_score, reverse =True)
    
    # 2. Build Spaced-Repetition Revision Queue (using each problem's Latest session)
    latest_by_problem: Dict[int, Dict[str, Any]] = {}
    for s in sessions:
        pid = s["problem_id"]
        current_ts = _parse_timestamp(s.get("started_at"))
        if pid not in latest_by_problem or current_ts> _parse_timestamp(latest_by_problem[pid].get("started_at")):
            latest_by_problem[pid] = s
            
        revision_queue : List[RevisionProblemItem] =[]
        for pid, latest in latest_by_problem.items():
            problem = latest.get("problems") or {}
            last_dt = _parse_timestamp(latest.get("started_at"))
            days_since = max(0, (now - last_dt).days)
            interval_days, reason = _get_revision_interval(latest)
            
            days_until_due = max(0, interval_days - days_since)
            is_due_now = days_since >=interval_days
            
            revision_queue.append(
                RevisionProblemItem(
                    problem_id = pid,
                    leetcode_id= problem.get("leetcode_id",""),
                    title = problem.get("title", "Unknown Problem"),
                    difficulty = problem.get("difficulty","Unknown"),
                    primary_pattern= problem.get("primary_pattern", "Uncategorized"),
                    url = problem.get("url"),
                    last_status=latest.get("status", "Unknown"),
                    solved_independently= _is_independent_solve(latest),
                    last_confidence= latest.get("confidence") or 0,
                    interval_days= interval_days,
                    days_since_last_attempted= days_since,
                    days_until_due = days_until_due,
                    is_due_now = is_due_now,
                    reason = reason,
                )
            )        
        
        # Sort by most urgent first: due now first, then fewest days until due, then lowest confidence
        revision_queue.sort(key = lambda x: (not x.is_due_now, x.days_until_due, x.last_confidence))
        
        # 3. Generate Top Actionable Suggestion
        due_items = [item for item in revision_queue if item.is_due_now]
        if due_items:
            top_rev =due_items[0]
            suggested_action = (
                f"Revise '{top_rev.title}' ({top_rev.primary_pattern}) - it is due for spaced repetition."
            )
            
        elif weak_patterns:
            top_weak = weak_patterns[0]
            suggested_action = (
                f"Focus on '{top_weak.pattern}' (weakness score: {top_weak.weakness_score}/100)."
                f"Next revision due in {revision_queue[0].days_until_due} day(s)."
            )
        else:
            suggested_action = "Keep practicing new problems to expand your pattern coverage."
            
        return RecommendationResponse(
            suggested_next_action = suggested_action,
            weak_patterns=weak_patterns,
            revision_queue=revision_queue,
            )
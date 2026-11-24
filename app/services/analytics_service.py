from collections import defaultdict
from typing import List, Dict , Any

def _is_solved(session: Dict[str, Any]) -> bool:
    return (session.get("status") or "").strip().lower() == "solved"

def _is_independent_solve(session: Dict[str, Any]) -> bool:
    """ 
    A solve is objectively independent only if solved with zero hints, no approach request, and no code request. 
    """
        
    return (
        _is_solved(session)
        and (session.get("hints_used") or 0)==0
        and not bool(session.get("approach_requested"))
        and not bool (session.get("code_requested"))
    ) 

def calculate_overall_stats(sessions: List[Dict[str, Any]]) -> Dict[str, Any]:
    """ 
    Computes comprehensive learning metrics and independence trends from a list of user sessions.
    """
    total_attempted = len(sessions)
    
    if total_attempted == 0:
        return {
            "total_attempted": 0,
            "total_solved": 0,
            "independent_solves": 0,
            "assisted_solves": 0,
            "completion_rate": 0.0,
            "independent_solve_rate": 0.0,
            "assisted_solve_rate":0.0,
            "avg_solving_time_mins": 0.0,
            "total_hints_used": 0,
            "avg_hints_per_problem": 0.0,
            "avg_hints_per_solved_problem": 0.0,
            "pct_solved_without_code": 0.0,
            "pct_solved_without_approach":0.0,
            "avg_confidence":0.0,
            "avg_confidence_after_solving":0.0,
            "independent_solve_rate_trend": []
        }
    
    solved_sessions = [s for s in sessions if _is_solved(s)]
    total_solved = len(solved_sessions)
    independent_solves = sum(1 for s in solved_sessions if _is_independent_solve(s))
    assisted_solves = total_solved - independent_solves
    
    # Core rates (out of total attempts)
    completion_rate = round((total_solved / total_attempted)*100,2)
    independent_solve_rate = round((independent_solves / total_attempted)*100 , 2)
    assisted_solve_rate = round((assisted_solves/ total_attempted)*100, 2)
    
    # time and hints
    total_time = sum(s.get("time_taken_mins") or 0 for s in sessions)
    total_hints = sum(s.get("hints_used") or 0 for s in sessions)
    solved_hints =  sum(s.get("hints_used") or 0 for s in solved_sessions)
    
    avg_hints_per_solved = (round(solved_hints/total_solved,2) if total_solved>0 else 0.0)
    
    # Assistance-free percentages (out of solved problems)
    solved_without_code = sum(1 for s in solved_sessions if not bool(s.get("code_requested")))
    solved_without_approach = sum(1 for s in solved_sessions if not bool(s.get("approach_requested")))
    
    pct_solved_without_code = (
        round((solved_without_code/ total_solved)*100, 2) if total_solved>0 else 0.0
    )
    
    pct_solved_without_approach = (
        round(( solved_without_approach/ total_solved)*100,2) if total_solved>0 else 0.0
        )
    
    # Confidence (overall vs after solving)
    all_conf = [s["confidence"] for s in sessions if s.get("confidence") is not None]
    
    solved_conf = [s["confidence"] for s in solved_sessions if s.get("confidence") is not None]
    
    avg_confidence = round(sum(all_conf)/ len(all_conf),2) if all_conf else 0.0
    avg_confidence_after_solving = round(sum(solved_conf)/len(solved_conf),2) if solved_conf else 0.0
    
    # Independent solve rate trend over time (grouped by YYYY-MM-DD)
    daily_groups = defaultdict(list)
    for s in sessions:
        timestamp = s.get("started_at") or ""
        date_key = timestamp[:10] if len(timestamp)>=10 else "Unknown"
        daily_groups[date_key].append(s)
        
    trend = []
    for date_key in sorted(daily_groups.keys()):
        day_items = daily_groups[date_key]
        day_attempts =len(day_items)
        day_independent = sum(1 for s in day_items if _is_independent_solve(s))
        trend.append({
            "date": date_key,
            "attempts": day_attempts,
            "independent_solves": day_independent,
            "independent_solve_rate": round((day_independent/ day_attempts)*100,2)
        })
        
    return {
        "total_attempted": total_attempted,
        "total_solved": total_solved,
        "independent_solves": independent_solves,
        "assisted_solves": assisted_solves,
        "completion_rate": completion_rate,
        "independent_solve_rate": independent_solve_rate,
        "assisted_solve_rate": assisted_solve_rate,
        "avg_solving_time_mins": round(total_time / total_attempted, 2),
        "total_hints_used": total_hints,
        "avg_hints_per_problem": round(total_hints / total_attempted, 2),
        "avg_hints_per_solved_problem": avg_hints_per_solved,
        "pct_solved_without_code": pct_solved_without_code,
        "pct_solved_without_approach": pct_solved_without_approach,
        "avg_confidence": avg_confidence,
        "avg_confidence_after_solving": avg_confidence_after_solving,
        "independent_solve_rate_trend": trend
    }
    
def calculate_pattern_stats(sessions: List[Dict[str, Any]]) -> Dict[str,Any]:
    """ 
    Groups sessions by pimary_pattern and flags pattern where the user struggles to solve independently.
    """
    grouped = defaultdict(list)
    
    for s in sessions:
        problem = s.get("problems") or {}
        pattern = problem.get("primary_pattern") or "Uncategorized"
        grouped[pattern].append(s)
        
    pattern_breakdown =[]
    struggling_patterns = []
    
    for pattern, items in grouped.items():
        attempts =len(items)
        solved_items = [s for s in items if _is_solved(s)]
        solved = len(solved_items)
        independent = sum(1 for s in solved_items if _is_independent_solve(s))
        assisted = solved - independent

        completion_rate = round((solved / attempts) * 100, 2)
        independent_solve_rate = round((independent / attempts) * 100, 2)
        assisted_solve_rate = round((assisted / attempts) * 100, 2)

        avg_time = round(
            sum(s.get("time_taken_mins") or 0 for s in items) / attempts, 2
        )
        confidences = [s["confidence"] for s in items if s.get("confidence") is not None]
        avg_conf = round(sum(confidences) / len(confidences), 2) if confidences else 0.0
        stats = {
            "pattern": pattern,
            "attempts": attempts,
            "solved": solved,
            "independent_solves": independent,
            "assisted_solves": assisted,
            "completion_rate": completion_rate,
            "independent_solve_rate": independent_solve_rate,
            "assisted_solve_rate": assisted_solve_rate,
            "avg_confidence": avg_conf,
            "avg_solving_time_mins": avg_time
        }
        pattern_breakdown.append(stats)
        # Flag as struggling if independent solve rate is under 50% or avg confidence is under 3.0
        if independent_solve_rate < 50.0 or (confidences and avg_conf < 3.0):
            struggling_patterns.append(pattern)

    pattern_breakdown.sort(key=lambda x: x["attempts"], reverse=True)

    return {
        "patterns": pattern_breakdown,
        "struggling_patterns": struggling_patterns
    }
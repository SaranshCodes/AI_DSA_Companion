from pydantic import BaseModel
from typing import List, Optional

class WeakPatternItem(BaseModel):
    pattern :str
    weakness_score : float
    independent_solve_rate: float
    avg_confidence: float
    attempts: int
    reason: str
    
class RevisionProblemItem(BaseModel):
    problem_id: int
    leetcode_id: str
    title: str
    difficulty: str
    primary_pattern: str
    url: Optional[str] = None
    last_status: str
    solved_independently: bool
    last_confidence: int
    interval_days : int
    days_since_last_attempted: int
    days_until_due: int
    is_due_now: bool
    reason: str
    
class RecommendationResponse(BaseModel):
    suggested_next_action : str
    weak_patterns: List[WeakPatternItem]
    revision_queue: List[RevisionProblemItem]
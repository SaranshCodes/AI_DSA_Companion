from pydantic import BaseModel
from typing import List, Optional

class ProblemCreate(BaseModel):
    leetcode_id:str
    title:str
    url : Optional[str] =None
    difficulty: str
    primary_pattern: str
    secondary_patterns: List[str]=[]
    recognition_signals: List[str] =[]
    why_this_pattern : str
    
class SessionCreate(BaseModel):
    time_taken_mins: int
    hints_used: int
    approach_requested: bool
    code_requested: bool
    status: str
    solved_independently: str
    confidence: int
    struggle_notes : Optional[str] = ""
    problem_details: ProblemCreate 
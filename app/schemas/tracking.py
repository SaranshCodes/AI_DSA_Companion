from pydantic import BaseModel,Field
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
    
    hints_used_after_solve: int = Field(default =0,description = "Hints used after solving")
    approach_requested_after_solve: bool = Field(default=False, description="Approach viewed AFTER solving")
    code_requested_after_solve: bool = Field(default=False, description="Code viewed AFTER solving")
    status: str
    solved_independently: str
    confidence: int
    struggle_notes : Optional[str] = ""
    problem_details: ProblemCreate 
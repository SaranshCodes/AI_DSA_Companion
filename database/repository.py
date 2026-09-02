import json
from database.db_setup import get_connection

def save_problem(leetcode_id: str, title: str, url: str, difficulty: str,
                 primary_pattern: str, secondary_patterns: list,
                 recognition_signals: list, why_this_pattern: str) -> int:
    conn = get_connection()
    cursor = conn.cursor()
    
    sec_patterns_json = json.dumps(secondary_patterns)
    rec_signals_json = json.dumps(recognition_signals)
    
    cursor.execute("""
                   INSERT INTO problems (leetcode_id, title, url, difficulty, primary_pattern, secondary_patterns, recognition_signals, why_this_pattern)
                   Values (?,?,?,?,?,?,?,?)
                   ON CONFLICT(leetcode_id) DO UPDATE SET
                   title = excluded.title,
                   url = excluded.url,
                   difficulty = excluded.difficulty,
                   primary_pattern = excluded.primary_pattern,
                secondary_patterns = excluded.secondary_patterns,
                recognition_signals = excluded.recognition_signals,
                why_this_pattern = excluded.why_this_pattern
                RETURNING id;
                """,(leetcode_id, title, url, difficulty, primary_pattern, sec_patterns_json, rec_signals_json, why_this_pattern))
    problem_id  = cursor.fetchone()['id']
    conn.commit()
    conn.close()
    return problem_id

def get_problem_by_leetcode_id(leetcode_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM PROBLEMS WHERE leetcode_id = ?",(leetcode_id))
    row = cursor.fetchone()
    conn.close()
    if row:
        row_dict= dict(row)
        row_dict['secondary_patterns']= json.loads(row_dict["secondary_patterns"])
        row_dict['recognition_signals'] = json.loads(row_dict['recognition_signals'])
        return row_dict
    return None

def save_session(problem_id: int, time_taken_mins: int, hints_used: int, 
                 approach_requested: bool, code_requested: bool, status: str, solved_independently: str,
                 confidence: int, struggle_notes: str)-> int:
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
                   INSERT INTO sessions (
                       problem_id, time_taken_mins, hints_used, approach_requested, code_requested, status, solved_independently,
                       confidence, struggle_notes, completed_at)
                       VALUES (?,?,?,?,?,?,?,?,?, CURRENT_TIMESTAMP)
                       RETURNING id;""",
                       (problem_id, time_taken_mins, hints_used, int(approach_requested), int(code_requested),
                        status, solved_independently, confidence, struggle_notes))
    session_id = cursor.fetchone()['id']
    conn.commit()
    conn.close()
    return session_id
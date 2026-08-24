import sqlite3
import os 

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)),"dsa_companion.db")

def get_connection():
    """Return a SQLite connection with foreign keys enabled"""
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON;")
    conn.row_factory = sqlite3.Row  # returns rows as dictionary like objects
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    # Table 1 : Problems and pattern analysis
    cursor.execute("""
                   CREATE TABLE IF NOT EXISTS problems ( 
                   id INTEGER PRIMARY KEY AUTOINCREMENT,
                   leetcode_id TEXT UNIQUE,
                   title TEXT NOT NULL,
                   url TEXT,
                   difficulty TEXT,
                   primary_pattern TEXT,
                   scondary_patterns TEXT,
                   recognition_signals TEXT,
                   why_this_pattern TEXT,
                   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
                   """)
    
    # Table 2 : User Solving Sessions
    cursor.execute("""
                   CREATE TABLE IF NOT EXISTS sessions(
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       problem_id INTEGER NOT NULL,
                       started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       completed_at TIMESTAMP,
                       time_taken_mins INTEGER DEFAULT 0,
                       hints_used INTEGER DEFAULT 0,
                       approach_requested BOOLEAN DEFAULT 0,
                       code_requested BOOLEAN DEFAULT 0,
                       status TEXT,
                       solved_independently TEXT,
                       confidence INTEGER,
                       struggle_notes TEXT,
                       FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE);
                       """)
    conn.commit()
    conn.close()
if __name__ == "__main__":
    init_db()
    print('Database initialized successfully at:', DB_PATH)
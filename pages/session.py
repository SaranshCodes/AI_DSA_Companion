import streamlit as st
import datetime
from services.gemini_service import analyse_problem, generate_hint, generate_solution
from database.repository import save_problem, save_session

st.set_page_config(page_title="Active Session", page_icon="🎯", layout="centered")

st.title("🎯 Start a DSA Session")

# --- INITIALIZE SESSION MEMORY ---
if 'hints' not in st.session_state:
    st.session_state['hints'] = []
if 'solution' not in st.session_state:
    st.session_state['solution'] = None
if 'start_time' not in st.session_state:
    st.session_state['start_time']=None
if 'approach_requested' not in st.session_state:
    st.session_state['approach_requested']=False
if 'session_saved' not in st.session_state:
    st.session_state['session_saved']=False

st.markdown("---")
st.header("Step 1: Problem Input")

col1, col2, col3 = st.columns(3)
with col1:
    # Added key="input_lc_id"
    lc_id = st.text_input("LeetCode ID (e.g., 695)", key="input_lc_id")
with col2:
    # Added key="input_title"
    title = st.text_input("Problem Title", key="input_title")
with col3:
    # Added key="input_diff"
    difficulty = st.selectbox("Difficulty", ["Easy", "Medium", "Hard"], key="input_diff")

# Added key="input_url"
url = st.text_input("LeetCode URL (Optional)", key="input_url")
# Added key="input_desc"
problem_text = st.text_area("Paste the Problem Statement here", height=200, key="input_desc")

if st.button("Analyze Pattern", type="primary"):
    if not lc_id or not title or not problem_text:
        st.warning("Please fill in the ID, Title, and Problem Statement.")
    else:
        with st.spinner("AI is analyzing the pattern..."):
            try:
                analysis = analyse_problem(problem_text)
                
                problem_id = save_problem(
                    leetcode_id=lc_id,
                    title=title,
                    url=url,
                    difficulty=difficulty,
                    primary_pattern=analysis["primary_pattern"],
                    secondary_patterns=analysis["secondary_patterns"],
                    recognition_signals=analysis["recognition_signals"],
                    why_this_pattern=analysis["why_this_pattern"]
                )
                
                st.session_state['problem_id'] = problem_id
                st.session_state['analysis'] = analysis
                st.session_state['problem_text'] = problem_text
                st.session_state['hints'] = []
                st.session_state['solution'] = None
                st.session_state['start_time'] = datetime.datetime.now()
                st.session_state['approach_requested']=False
                st.session_state['session_saved']=False
                
            except Exception as e:
                st.error(f"Analysis Error: {e}")

# --- DISPLAY ANALYSIS & HINTS ONLY IF ANALYZED ---
if 'analysis' in st.session_state:
    st.markdown("---")
    analysis = st.session_state['analysis']
    
    st.header("🧩 Pattern Recognition")
    st.subheader(f"Primary Pattern: {analysis['primary_pattern']}")
    st.write("**Why this pattern?**")
    st.info(analysis['why_this_pattern'])
    
    st.write("**Recognition Signals:**")
    for signal in analysis['recognition_signals']:
        st.write(f"✅ {signal}")

    # --- THE PROGRESSIVE HINT SYSTEM ---
    st.markdown("---")
    st.header("💡 Progressive Hints")
    st.write("Stuck? Ask for a hint. The AI will not give you the code, only a nudge.")

    # 1. Display existing hints
    for i, hint in enumerate(st.session_state['hints']):
        st.success(f"**Hint {i+1}:** {hint}")

    # 2. Button logic with error catching
    current_hint_count = len(st.session_state['hints'])
    if current_hint_count < 3:
        if st.button(f"Get Hint {current_hint_count + 1}"):
            with st.spinner("Generating hint..."):
                try:
                    next_level = current_hint_count + 1
                    hint_text = generate_hint(
                        st.session_state['problem_text'], 
                        analysis['primary_pattern'], 
                        next_level
                    )
                    st.session_state['hints'].append(hint_text)
                    st.rerun()
                except Exception as e:
                    # If something breaks, it will show up here instead of resetting the app!
                    st.error(f"Error generating hint: {e}")
    else:
        st.warning("You have used all 3 progressive hints.")

    # --- APPROACH & CODE SECTION ---
    st.markdown("---")
    st.header("🧠 Approach & Solution")
    
    if st.session_state['solution'] is None:
        if st.button("Reveal Approach & Code"):
            with st.spinner("Generating optimal solution..."):
                try:
                    sol = generate_solution(
                        st.session_state['problem_text'], 
                        analysis['primary_pattern']
                    )
                    st.session_state['solution'] = sol
                    st.rerun()
                except Exception as e:
                    st.error(f"Error generating solution: {e}")
    else:
        with st.expander("Show Optimal Approach", expanded=True):
            st.write(st.session_state['solution']['approach'])
        with st.expander("Show Python Code"):
            st.code(st.session_state['solution']['code'], language="python")
    
    # Session completion form
    st.markdown('---')
    if not st.session_state['session_saved']:
        st.header('Complete Session')
        with st.form('completion_form'):
            status = st.radio('Did you solve it?', ['Solved','Failed'])
            
            solved_independently = st.selectbox("How did you solve it?",[
                "Completely independently",
                "With hints",
                "After seeing the approach",
                "After seeing the solution"
            ])
            
            confidence = st.slider("How confident are you with this pattern",1,5,3)
            struggle_notes =st.text_area("What did you struggle with? (Optional)")
            
            submit_session= st.form_submit_button("Save Session to Database")
            if submit_session:
                end_time = datetime.datetime.now()
                time_diff= end_time-st.session_state['start_time']
                time_taken_mins = int(time_diff.total_seconds()/60)
                
                save_session(
                    problem_id=st.session_state['problem_id'],
                    time_taken_mins=time_taken_mins,
                    hints_used=len(st.session_state['hints']),
                    approach_requested=st.session_state['approach_requested'],
                    code_requested=st.session_state['approach_requested'], # Tied to the same button for V1
                    status=status,
                    solved_independently=solved_independently,
                    confidence=confidence,
                    struggle_notes=struggle_notes
                )
                
                st.session_state['session_saved']=True
                st.rerun()
    else:
        st.success("Session saved successfully! Check your Dashboard to see your stats")
        if st.button('Start New Problem'):
            for key in list(st.session_state.keys()):
                del st.session_state[key]
            st.rerun()
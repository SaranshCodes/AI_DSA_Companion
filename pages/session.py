import streamlit as st
from services.gemini_service import analyse_problem, generate_hint, generate_solution
from database.repository import save_problem

st.set_page_config(page_title="Active Session", page_icon="🎯", layout="centered")

st.title("🎯 Start a DSA Session")

# --- INITIALIZE SESSION MEMORY ---
if 'hints' not in st.session_state:
    st.session_state['hints'] = []
if 'solution' not in st.session_state:
    st.session_state['solution'] = None

st.markdown("---")
st.header("Step 1: Problem Input")

col1, col2, col3 = st.columns(3)
with col1:
    lc_id = st.text_input("LeetCode ID (e.g., 695)")
with col2:
    title = st.text_input("Problem Title")
with col3:
    difficulty = st.selectbox("Difficulty", ["Easy", "Medium", "Hard"])

url = st.text_input("LeetCode URL (Optional)")
problem_text = st.text_area("Paste the Problem Statement here", height=200)

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
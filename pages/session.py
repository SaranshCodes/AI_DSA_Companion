import streamlit as st 
from services.gemini_service import analyse_problem
from database.repository import save_problem

# Streamlit Page Config
st.set_page_config(page_title  = 'Active Session', page_icon = "🎯", layout = "centered")
st.title("Start a DSA Session")

st.markdown("---")
st.header("Step 1: Problem Input")

# Create a clean row of inputs
col1, col2, col3 = st.columns(3)
with col1:
    lc_id = st.text_input("LeetCode ID (eg , 695)")
with col2:
    title = st.text_input("Problem Title")
with col3:
    difficulty = st.selectbox("Difficulty", ["Easy","Medium","Hard"])
    
url = st.text_input("Leetcode URL (Optional)")
problem_text = st.text_area("Paste the Problem Statement here", height =200)

# The Analyze button
if st.button("Analyze Pattern", type = "primary"):
    if not lc_id or not title or not problem_text:
        st.warning("Please fill in the ID, Title and Problem Statement.")
    else:
        with st.spinner("AI is analyzing the pattern...."):
            try:
                # 1. Send the problem to Gemini
                analysis  = analyse_problem(problem_text)
                
                # 2. Save everything to our SQLite database
                problem_id = save_problem(
                    leetcode_id=lc_id,
                    title = title,
                    url = url,
                    difficulty = difficulty,
                    primary_pattern= analysis["primary_pattern"],
                    secondary_patterns= analysis["secondary_patterns"],
                    recognition_signals=analysis['recognition_signals'],
                    why_this_pattern=analysis["why_this_pattern"]
                )
                
                # 3. Store the results in session_state so the app remembers it
                st.session_state["problem_id"] = problem_id
                st.session_state['analysis'] = analysis
                
                st.success("Analysis Complete & Saved to Database!")
            except Exception as e:
                st.error(f"Error: {e}")
    if 'analysis' in st.session_state:
        st.markdown('---')
        analysis = st.session_state['analysis']
        
        st.header("🧩 Pattern Recognition")
        st.subheader(f"Primary Pattern: {analysis['primary_pattern']}")
        
        # Using Streamlit info box for the explanation
        st.write("**Why this pattern?**")
        st.info(analysis['why_this_pattern'])
        
        # Display signals nicely
        st.write("**Recognition Signals:**")
        for signal in analysis['recognition_signals']:
            st.write(f" {signal}")
        if analysis['secondary_patterns']:
            st.write("**Secondary Patterns:**", ",".join(analysis['secondary_patterns']))
                
                
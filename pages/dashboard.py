import streamlit as st 
import pandas as pd 
import plotly.express as px 
from database.repository import get_dashboard_stats

st.set_page_config(page_title = 'Dashboard', layout = 'wide')
st.title('Personal Learning Dashboard')
st.write('Track your pattern recognition progress and weakness')

st.markdown('---')

try:
    df = get_dashboard_stats()
    if df.empty:
        st.info("No sessions recorded yet! Go complete a problem in the Session tab")
    else:
        # Top level Metrics 
        total_attempts =len(df)
        total_solved = len(df[df['status']=='Solved'])
        avg_confidence = df['confidence'].mean()
        
        col1,col2,col3  = st.columns(3)
        col1.metric('Total Attempts', total_attempts)
        col2.metric('Successfully Solved', total_solved)
        col3.metric('Average Confidence', f'{avg_confidence: .1f} /5')
        st.markdown('---')
        
        # Visualizations
        chart_col1, chart_col2 = st.columns(2)
        with chart_col1:
            st.subheader('Attempts by Pattern')
            
            pattern_counts = df['primary_pattern'].value_counts().reset_index()
            pattern_counts.columns = ['Pattern', 'Count']
            
            fig_patterns = px.bar(
                pattern_counts , x ='Pattern' , y = 'Count',
                color = 'Pattern', text_auto =True
                
            )
            fig_patterns.update_layout(showlegend = False)
            st.plotly_chart(fig_patterns, use_container_width=True)
        with chart_col2:
            st.subheader('Independence Level')
            indep_counts = df['solved_independently'].value_counts().reset_index()
            indep_counts.columns = ['Method', 'Count']
            
            fig_pie = px.pie(
                indep_counts, names = 'Method', values = 'Count',
                hole =0.4, color_discrete_sequence=px.colors.qualitative.Pastel
            )
            st.markdown("---")
            
            # Recent session log 
            st.subheader('Recent Sessions')
            display_df = df[['title', 'primary_pattern', 'difficulty', 'status', 'hints_used', 'time_taken_mins']]
            st.dataframe(display_df, use_container_width =True)
            
except Exception as e:
    st.error(f"Error loading dashboard: {e}")
import streamlit as st 
from services.gemini_service import test_connection

st.set_page_config(page_title='AI DSA COMPANION', layout='centered')
st.title("AI DSA Companion")

st.write("Welcome to V1. Let's test our foundational setup.")

if st.button('Test'):
    with st.spinner('Connecting to gemini....'):
        result = test_connection()
        st.success(result)
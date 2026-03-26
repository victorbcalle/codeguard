import os
import json
import logging
from typing import Optional, Dict, Any

import streamlit as st
import google.generativeai as genai
from dotenv import load_dotenv

# ==========================================
# 1. LOGGING & ENVIRONMENT SETUP
# ==========================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("CodeGuard_AppSec")

def initialize_environment() -> bool:
    """
    Loads environment variables and configures the LLM client.
    Returns True if configuration is successful, False otherwise.
    """
    load_dotenv()
    api_key: Optional[str] = os.getenv("GEMINI_API_KEY")
    
    if not api_key:
        logger.error("GEMINI_API_KEY is missing from the environment variables.")
        return False
        
    genai.configure(api_key=api_key)
    logger.info("Environment initialized successfully.")
    return True

# ==========================================
# 2. CORE BUSINESS LOGIC (APPSEC ENGINE)
# ==========================================

def analyze_code_security(code_snippet: str, language: str) -> Optional[Dict[str, Any]]:
    """
    Analyzes code for security vulnerabilities using GenAI.
    Forces a strict JSON output in English for professional UI rendering.
    """
    system_prompt: str = (
        f"You are a Senior AppSec Security Auditor and GDPR compliance expert. "
        f"Analyze the following {language} code snippet. "
        "You MUST respond ONLY with a valid JSON object using this exact schema in ENGLISH:\n"
        "{\n"
        '  "risk_level": "Low" | "Medium" | "High" | "Critical",\n'
        '  "vulnerability": "Exact technical name of the vulnerability (or None)",\n'
        '  "details": "Technical explanation of the flaw and impact (in English)",\n'
        '  "solution_code": "The remediated, secure code"\n'
        "}\n"
        "Do not include Markdown formatting blocks like ```json."
    )

    try:
        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            system_instruction=system_prompt
        )
        
        logger.info(f"Analyzing {language} code snippet...")
        response = model.generate_content(
            f"Code to analyze:\n\n{code_snippet}",
            generation_config=genai.types.GenerationConfig(temperature=0.1)
        )
        
        clean_response: str = response.text.replace("```json", "").replace("```", "").strip()
        result_dict: Dict[str, Any] = json.loads(clean_response)
        
        logger.info("Analysis completed successfully.")
        return result_dict
        
    except json.JSONDecodeError as e:
        logger.error(f"JSON Parse Error: {e}")
        return None
    except Exception as e:
        logger.error(f"API Error: {e}")
        return None

# ==========================================
# 3. PRESENTATION LAYER (STREAMLIT UI)
# ==========================================

def render_ui() -> None:
    """Renders the Streamlit application interface."""
    
    # Removed emojis from page config
    st.set_page_config(page_title="CodeGuard AI", layout="wide")
    
    if not initialize_environment():
        st.error("Critical System Error: GEMINI_API_KEY is not defined.")
        st.stop()

    # Minimalist, professional header
    st.title("CodeGuard AI")
    st.markdown("### Real-Time AppSec & GDPR Code Auditor")
    st.divider()

    col_input, col_output = st.columns(2, gap="large")

    with col_input:
        st.subheader("Source Code Input")
        language = st.selectbox("Programming Language:", ["Python", "SQL", "JavaScript", "PHP", "Java"])
        code_input = st.text_area("Insert code snippet here:", height=300)
        
        analyze_btn = st.button("Run Security Audit", type="primary", use_container_width=True)

    with col_output:
        st.subheader("Audit Results")
        
        if analyze_btn:
            if not code_input.strip():
                st.warning("Please provide a code snippet for analysis.")
                return

            with st.spinner("Running vulnerability and compliance checks..."):
                report_data = analyze_code_security(code_input, language)
                
                if report_data:
                    risk: str = report_data.get("risk_level", "Unknown")
                    
                    # Minimalist Risk Indicators (No emojis, just colors and text)
                    if risk in ["Critical", "High"]:
                        st.error(f"**RISK LEVEL: {risk.upper()}**")
                    elif risk == "Medium":
                        st.warning(f"**RISK LEVEL: {risk.upper()}**")
                    else:
                        st.success(f"**RISK LEVEL: {risk.upper()}**")
                    
                    st.markdown(f"**Vulnerability:** {report_data.get('vulnerability')}")
                    st.info(f"**Details:** {report_data.get('details')}")
                    
                    st.markdown("**Proposed Solution:**")
                    st.code(report_data.get("solution_code"), language=language.lower())
                else:
                    st.error("System encountered an error processing the AI response. Check server logs.")

if __name__ == "__main__":
    render_ui()
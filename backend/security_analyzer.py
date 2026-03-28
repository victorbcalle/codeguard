import json
import logging
from typing import Optional, Dict, Any

import google.generativeai as genai

from config import GEMINI_API_KEY, LLM_MODEL, LLM_TEMPERATURE

logger = logging.getLogger("CodeGuard_SecurityAnalyzer")


class SecurityAnalyzer:
    """Handles code security analysis using Google Gemini API."""

    def __init__(self) -> None:
        """Initialize the security analyzer with API configuration."""
        if not GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY environment variable is not set")
        genai.configure(api_key=GEMINI_API_KEY)
        logger.info("SecurityAnalyzer initialized successfully")

    # Cambia esto:
    # def analyze(self, code_snippet: str, language: str) -> Optional[Dict[str, Any]]:
    
    # A ESTO:
    def analyze(self, code_snippet: str) -> Optional[Dict[str, Any]]:
        """
        Analyzes code for security vulnerabilities using GenAI.
        """
        # Ya no le pasamos el lenguaje al prompt
        system_prompt = self._build_system_prompt() 

        try:
            model = genai.GenerativeModel(
                model_name=LLM_MODEL,
                system_instruction=system_prompt
            )

            logger.info("Analyzing code snippet") # Actualizamos el log
            response = model.generate_content(
                f"Code to analyze:\n\n{code_snippet}",
                generation_config=genai.types.GenerationConfig(
                    temperature=LLM_TEMPERATURE
                )
            )

            result = self._parse_response(response.text)
            logger.info("Analysis completed successfully")
            return result

        except json.JSONDecodeError as e:
            logger.error(f"JSON Parse Error: {e}")
            return None
        except Exception as e:
            logger.error(f"API Error: {e}")
            return None

    @staticmethod
    def _build_system_prompt() -> str:
        """Builds the system prompt for security analysis."""
        return (
            "You are a Senior AppSec Security Auditor. "
            "Your task is to analyze a provided code snippet. "
            "CRITICAL RULE 1: Automatically identify the programming language used. "
            "If you cannot identify the language or it is plain text, return EXACTLY this JSON: "
            '{"risk_level": "Low", "vulnerability": "Mismatch", '
            '"details": "Could not detect a valid programming language. '
            'Please paste a valid code snippet.", "solution_code": "N/A"} '
            "CRITICAL RULE 2: Analyze the code for security vulnerabilities and best practices. "
            "Respond ONLY with valid JSON using this exact schema in ENGLISH:\n"
            "{\n"
            '  "risk_level": "Low" | "Medium" | "High" | "Critical",\n'
            '  "vulnerability": "Exact technical name of the vulnerability (or None)",\n'
            '  "details": "Technical explanation of the flaw and impact (in English)",\n'
            '  "solution_code": "The remediated, secure code"\n'
            "}\n"
            "Do not include Markdown formatting blocks like ```json."
        )

    @staticmethod
    def _parse_response(response_text: str) -> Optional[Dict[str, Any]]:
        """Parses and validates the API response."""
        clean_response = response_text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_response)

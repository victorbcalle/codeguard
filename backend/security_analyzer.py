"""
CodeGuard AI - Security Analyzer Module.

This module handles the core integration with Google's Gemini AI to analyze
provided code snippets for security vulnerabilities, bad practices, and risks.
"""

import json
import logging
from typing import Dict, Any, Optional

import google.generativeai as genai

# Local application configuration imports
from config import GEMINI_API_KEY, LLM_MODEL, LLM_TEMPERATURE

# Configure module-level logger
logger = logging.getLogger("CodeGuard_SecurityAnalyzer")


class SecurityAnalyzer:
    """Analyzes source code for security risks using Google's Gemini AI.

    Attributes:
        model (genai.GenerativeModel): The configured Gemini AI model instance.
        temperature (float): The temperature setting for AI generation.
    """

    def __init__(self) -> None:
        """Initializes the security analyzer with API configuration.

        Raises:
            ValueError: If the GEMINI_API_KEY is not found in the configuration.
        """
        if not GEMINI_API_KEY:
            logger.error("GEMINI_API_KEY is missing from the configuration.")
            raise ValueError("GEMINI_API_KEY not found in config.py.")

        genai.configure(api_key=GEMINI_API_KEY)
        logger.info("SecurityAnalyzer initialized successfully.")

        # Configure the model with environment settings and strict system prompt
        self.model = genai.GenerativeModel(
            model_name=LLM_MODEL,
            system_instruction=self._build_system_prompt()
        )
        self.temperature = LLM_TEMPERATURE

    def analyze(self, code_snippet: str) -> Optional[Dict[str, Any]]:
        """Analyzes the provided code snippet for security vulnerabilities.

        Args:
            code_snippet (str): The source code to be analyzed.

        Returns:
            Optional[Dict[str, Any]]: A dictionary containing the structured analysis results
            (risk_level, vulnerability, details, explanation, solution_code).
        """
        if not code_snippet or not code_snippet.strip():
            logger.warning("Attempted to analyze an empty code snippet.")
            return self._empty_response()

        try:
            logger.info("Analyzing code snippet with Gemini.")
            response = self.model.generate_content(
                f"Code to analyze:\n\n{code_snippet}",
                generation_config=genai.types.GenerationConfig(
                    temperature=self.temperature,
                    response_mime_type="application/json"  # Force JSON format output
                )
            )

            # Clean the response in case the AI injects Markdown fenced code blocks
            json_text = response.text.strip()
            if json_text.startswith("```json"):
                json_text = json_text[7:-3].strip()
            elif json_text.startswith("```"):
                json_text = json_text[3:-3].strip()

            result = json.loads(json_text)
            logger.info("Analysis completed and parsed successfully.")
            return result

        except json.JSONDecodeError as e:
            logger.error(f"JSON Parse Error. Raw Text: {response.text}")
            return self._error_response("The AI did not return a valid JSON object.")
        except Exception as e:
            logger.error(f"Gemini API Error: {e}")
            return self._error_response(str(e))

    @staticmethod
    def _build_system_prompt() -> str:
        """Builds the strict system instruction prompt for the AI model.

        Returns:
            str: The system prompt guiding the AI to act as a security auditor.
        """
        return (
            "You are CodeGuard AI, a Senior Application Security Auditor. "
            "Your task is to analyze a provided code snippet. "
            "CRITICAL RULE 1: Automatically identify the programming language used. "
            "Respond ONLY with valid JSON using this exact schema in ENGLISH:\n"
            "{\n"
            '  "risk_level": "Low" | "Medium" | "High" | "Critical",\n'
            '  "vulnerability": "Exact technical name of the vulnerability (or None)",\n'
            '  "details": "Technical explanation of the flaw and impact",\n'
            '  "explanation": "Step-by-step text explanation of how to remediate the issue",\n'
            '  "solution_code": "The remediated, secure code (PURE CODE ONLY. DO NOT INCLUDE ANY MARKDOWN FENCED BLOCK WRAPPERS like ```python. NO TEXT EXPLANATIONS.)"\n'
            "}\n"
            "Do not include Markdown formatting blocks like ```json."
        )

    @staticmethod
    def _empty_response() -> Dict[str, Any]:
        """Generates a default response for empty or invalid code inputs.

        Returns:
            Dict[str, Any]: A structured response indicating no code was detected.
        """
        return {
            "risk_level": "Low",
            "vulnerability": "Mismatch",
            "details": "Could not detect a valid programming language. Please paste a valid code snippet.",
            "explanation": "No fix required as no code was detected.",
            "solution_code": "N/A"
        }

    @staticmethod
    def _error_response(error_message: str) -> Dict[str, Any]:
        """Generates a structured error response when the AI analysis fails.

        Args:
            error_message (str): The specific error detail to return.

        Returns:
            Dict[str, Any]: A structured response indicating an audit failure.
        """
        return {
            "risk_level": "High",
            "vulnerability": "Audit Error",
            "details": f"Backend Error: {error_message}",
            "explanation": "Check the backend server console for more details.",
            "solution_code": "SYSTEM ERROR"
        }
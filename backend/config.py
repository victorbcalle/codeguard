"""
CodeGuard AI - Global Configuration Module.

This module loads environment variables and defines the global configuration 
constants used throughout the CodeGuard AI application. It acts as the single 
source of truth for API keys, AI model parameters, and application metadata.
"""

import os
from typing import Final

from dotenv import load_dotenv

# Load environment variables from the local .env file into the system environment
load_dotenv()

# ==============================================================================
# Security & Authentication Configuration
# ==============================================================================

# Google Gemini API Key required for LLM authentication.
# Retrieved from the environment securely.
GEMINI_API_KEY: Final[str | None] = os.getenv("GEMINI_API_KEY")


# ==============================================================================
# Application Metadata
# ==============================================================================

# Primary title of the application used in the UI and documentation.
APP_TITLE: Final[str] = "CodeGuard AI"

# Secondary subtitle explaining the core value proposition and GDPR focus.
APP_SUBTITLE: Final[str] = "Real-Time AppSec & GDPR Code Auditor"

# Emoji icon used in browser tabs, headers, and UI elements.
PAGE_ICON: Final[str] = "🛡️"


# ==============================================================================
# Auditing Engine Configuration
# ==============================================================================

# List of programming languages officially supported by the auditing engine.
# Used for UI dropdowns and syntax highlighting context.
SUPPORTED_LANGUAGES: Final[list[str]] = [
    "Python",
    "SQL",
    "JavaScript",
    "PHP",
    "Java",
]


# ==============================================================================
# Large Language Model (LLM) Configuration
# ==============================================================================

# The specific Gemini model identifier used for generating security audits.
LLM_MODEL: Final[str] = "gemini-2.5-flash"

# The temperature parameter controls the randomness of the AI's output.
# A strict value of 0.1 ensures highly deterministic, analytical, and 
# focused responses, which is critical for security auditing.
LLM_TEMPERATURE: Final[float] = 0.1


# ==============================================================================
# User Interface (UI) Configuration
# ==============================================================================

# The default layout structure for the frontend framework viewport.
LAYOUT: Final[str] = "wide"

# The default state of the application's sidebar component.
SIDEBAR_STATE: Final[str] = "collapsed"
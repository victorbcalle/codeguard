import os
from typing import Final

from dotenv import load_dotenv

load_dotenv()

# Environment Variables
GEMINI_API_KEY: Final[str | None] = os.getenv("GEMINI_API_KEY")

# Application Configuration
APP_TITLE: Final[str] = "CodeGuard AI"
APP_SUBTITLE: Final[str] = "Real-Time AppSec & GDPR Code Auditor"
PAGE_ICON: Final[str] = "🛡️"

# Supported Programming Languages
SUPPORTED_LANGUAGES: Final[list[str]] = [
    "Python",
    "SQL",
    "JavaScript",
    "PHP",
    "Java",
]

# LLM Configuration
LLM_MODEL: Final[str] = "gemini-2.5-flash"
LLM_TEMPERATURE: Final[float] = 0.1

# UI Configuration
LAYOUT: Final[str] = "wide"
SIDEBAR_STATE: Final[str] = "collapsed"

"""
CodeGuard AI - Main API Entry Point.

This module initializes the FastAPI application, configures CORS middleware,
and defines the REST endpoints for the CodeGuard AI security auditing tool.
"""

import logging
from typing import Dict

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Local application imports
from security_analyzer import SecurityAnalyzer

# Configure application logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("CodeGuard_API")

# Initialize the FastAPI application instance
app = FastAPI(
    title="CodeGuard AI API",
    description="REST API for AI-powered code security auditing.",
    version="1.0.0"
)

# Configure CORS (Cross-Origin Resource Sharing)
# CRITICAL: This allows the React frontend to communicate with this backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: In strict production, replace "*" with your Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AuditRequest(BaseModel):
    """Represents the expected JSON payload from the client.

    Attributes:
        code: The source code string to be analyzed.
    """
    code: str


@app.get("/")
def read_root() -> Dict[str, str]:
    """Health check endpoint to verify the API is running.

    Returns:
        A dictionary containing the API status and a welcome message.
    """
    return {"status": "online", "message": "CodeGuard AI API is running."}


@app.post("/api/audit")
async def audit_code(request: AuditRequest) -> Dict:
    """Receives code from the client, analyzes it, and returns the findings.

    Args:
        request: The payload containing the code snippet to analyze.

    Returns:
        A dictionary containing the structured security analysis results.

    Raises:
        HTTPException: If the code snippet is empty (400).
        HTTPException: If the AI analysis fails or throws an error (500).
    """
    try:
        analyzer = SecurityAnalyzer()
        
        # Validate that the input is not empty or just whitespace
        if not request.code.strip():
            logger.warning("Received an empty code snippet.")
            raise HTTPException(
                status_code=400, 
                detail="The code snippet cannot be empty."
            )
            
        # Execute the security analysis
        result = analyzer.analyze(request.code)
        
        # Validate that the analyzer returned a valid result
        if not result:
            raise HTTPException(
                status_code=500, 
                detail="The AI analysis failed to produce a valid result."
            )
            
        return result
        
    except ValueError as ve:
        logger.error(f"Configuration error: {ve}")
        raise HTTPException(
            status_code=500, 
            detail="Internal server error (Missing API Key)."
        )
    except Exception as e:
        logger.error(f"Unexpected error during audit: {e}")
        raise HTTPException(
            status_code=500, 
            detail=str(e)
        )
"""Contact form API endpoint"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import os
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

router = APIRouter(prefix="/api", tags=["contact"])


class ContactFormRequest(BaseModel):
    name: str
    email: EmailStr
    message: str


class ContactFormResponse(BaseModel):
    success: bool
    message: str


@router.post("/contact", response_model=ContactFormResponse)
async def submit_contact_form(request: ContactFormRequest) -> ContactFormResponse:
    """
    Handle contact form submission and save to Supabase

    Args:
        request: Contact form data (name, email, message)

    Returns:
        Response indicating success or failure
    """
    # Import here to avoid circular imports
    from contact_db import save_contact_submission

    success, error = await save_contact_submission(
        name=request.name,
        email=request.email,
        message=request.message
    )

    if success:
        return ContactFormResponse(
            success=True,
            message="Submission received! Thank you for reaching out."
        )
    else:
        raise HTTPException(
            status_code=500,
            detail=error or "Failed to save submission"
        )

"""
Contact form submissions stored in Supabase
"""

import os
from datetime import datetime
from typing import Optional
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables from .env.local
env_path = Path(__file__).parent / ".env.local"
if env_path.exists():
    load_dotenv(env_path)


def get_supabase_client() -> Optional[Client]:
    """Initialize Supabase client"""
    try:
        url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
        key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

        if not url or not key:
            print("❌ Missing Supabase credentials")
            return None

        return create_client(url, key)
    except Exception as e:
        print(f"❌ Supabase client error: {e}")
        return None


async def save_contact_submission(
    name: str,
    email: str,
    message: str
) -> tuple[bool, Optional[str]]:
    """
    Save contact form submission to Supabase

    Args:
        name: Submitter name
        email: Submitter email
        message: Message content

    Returns:
        Tuple of (success: bool, error_message: Optional[str])
    """
    try:
        supabase = get_supabase_client()
        if not supabase:
            return False, "Database connection failed"

        # Prepare submission record
        submission = {
            "name": name,
            "email": email,
            "message": message,
            "submitted_at": datetime.utcnow().isoformat(),
            "status": "new"  # new, reviewed, resolved
        }

        # Insert into contact_submissions table
        response = supabase.table("contact_submissions").insert(submission).execute()

        print(f"✅ Contact saved: {name} ({email})")
        return True, None

    except Exception as e:
        error_msg = str(e)
        print(f"❌ Database error: {error_msg}")
        return False, error_msg

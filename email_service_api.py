"""
Email sending service using Zoho Mail REST API
"""

import requests
import os
from typing import Optional
from datetime import datetime


async def get_zoho_access_token() -> Optional[str]:
    """
    Get Zoho API access token using refresh token
    """
    try:
        client_id = os.getenv("ZOHO_CLIENT_ID")
        client_secret = os.getenv("ZOHO_CLIENT_SECRET")
        refresh_token = os.getenv("ZOHO_REFRESH_TOKEN")

        if not all([client_id, client_secret, refresh_token]):
            print("❌ Missing Zoho credentials")
            return None

        token_url = "https://accounts.zoho.com/oauth/v2/token"

        payload = {
            "grant_type": "refresh_token",
            "client_id": client_id,
            "client_secret": client_secret,
            "refresh_token": refresh_token,
        }

        response = requests.post(token_url, data=payload, timeout=10)
        response.raise_for_status()

        result = response.json()
        return result.get("access_token")

    except Exception as e:
        print(f"❌ Token error: {e}")
        return None


async def send_contact_email(
    name: str,
    email: str,
    message: str
) -> tuple[bool, Optional[str]]:
    """
    Send contact form email via Zoho Mail REST API

    Args:
        name: Name of the person submitting the form
        email: Email address to reply to
        message: Message content

    Returns:
        Tuple of (success: bool, error_message: Optional[str])
    """
    try:
        # Get access token
        access_token = await get_zoho_access_token()
        if not access_token:
            return False, "Failed to get access token"

        # Get email configuration
        mail_from = os.getenv("ZOHO_MAIL_FROM")
        mail_to = os.getenv("ZOHO_MAIL_TO")

        if not all([mail_from, mail_to]):
            return False, "Missing email configuration"

        # Prepare email body
        body = f"""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KANTAKA SODHANA — SECURE CONTACT FORM SUBMISSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FROM: {name}
EMAIL: {email}
TIMESTAMP: {datetime.now().isoformat()}

MESSAGE:
────────────────────────────────────────────────────────────────

{message}

────────────────────────────────────────────────────────────────

Reply to: {email}
Channel: SECURE
Status: RECEIVED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""

        # Get account ID (for Zoho Mail API, we need the account ID)
        # This is obtained after OAuth, for now we'll use a placeholder
        # In production, store this from the OAuth response
        account_id = os.getenv("ZOHO_ACCOUNT_ID", "")

        if not account_id:
            # Alternative: Use the direct email sending endpoint
            api_url = "https://mail.zoho.com/api/accounts"
        else:
            api_url = f"https://mail.zoho.com/api/accounts/{account_id}"

        # Prepare headers
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }

        # Prepare email payload
        payload = {
            "fromAddress": mail_from,
            "toAddress": mail_to,
            "subject": f"📬 Kantaka Sodhana Contact: {name}",
            "content": body,
            "replyToAddress": email,
        }

        # Send email via Zoho API
        response = requests.post(
            f"{api_url}/mails",
            json=payload,
            headers=headers,
            timeout=15
        )

        if response.status_code in [200, 201]:
            print(f"✅ Email sent from {email} to {mail_to} via Zoho API")
            return True, None
        else:
            error_msg = response.json().get("message", "Unknown error")
            print(f"❌ API error: {error_msg}")
            return False, error_msg

    except requests.RequestException as e:
        print(f"❌ Request error: {e}")
        return False, "Network error"
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False, str(e)

"""Email sending service using Zoho Mail SMTP"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from typing import Optional


async def send_contact_email(
    name: str,
    email: str,
    message: str
) -> tuple[bool, Optional[str]]:
    """
    Send contact form email via Zoho Mail SMTP

    Args:
        name: Name of the person submitting the form
        email: Email address to reply to
        message: Message content

    Returns:
        Tuple of (success: bool, error_message: Optional[str])
    """
    try:
        smtp_user = os.getenv("ZOHO_MAIL_USER")
        smtp_password = os.getenv("ZOHO_MAIL_PASSWORD")
        smtp_host = os.getenv("ZOHO_MAIL_HOST", "smtp.zoho.com")
        smtp_port = int(os.getenv("ZOHO_MAIL_PORT", "587"))
        recipient = os.getenv("CONTACT_EMAIL_TO")

        # Validate configuration
        if not all([smtp_user, smtp_password, recipient]):
            print("❌ Email configuration missing")
            return False, "Email service not configured"

        # Create message
        msg = MIMEMultipart()
        msg["From"] = smtp_user
        msg["To"] = recipient
        msg["Subject"] = f"📬 Kantaka Sodhana Contact: {name}"
        msg["Reply-To"] = email

        body = f"""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KANTAKA SODHANA — SECURE CONTACT FORM SUBMISSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FROM: {name}
EMAIL: {email}
TIMESTAMP: {__import__('datetime').datetime.now().isoformat()}

MESSAGE:
────────────────────────────────────────────────────────────────

{message}

────────────────────────────────────────────────────────────────

Reply to: {email}
Channel: SECURE
Status: RECEIVED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""

        msg.attach(MIMEText(body, "plain"))

        # Send via Zoho SMTP
        with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)

        print(f"✅ Email sent from {email} to {recipient}")
        return True, None

    except smtplib.SMTPAuthenticationError:
        print("❌ SMTP Authentication failed - invalid credentials")
        return False, "Authentication failed"
    except smtplib.SMTPException as e:
        print(f"❌ SMTP error: {e}")
        return False, "SMTP service error"
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False, "Unexpected error occurred"

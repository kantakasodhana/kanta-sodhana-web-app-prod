"""
Email sending service using Outlook SMTP
"""

import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from datetime import datetime


async def send_contact_email(
    name: str,
    email: str,
    message: str
) -> tuple[bool, Optional[str]]:
    """
    Send contact form email via Outlook SMTP

    Args:
        name: Name of the person submitting the form
        email: Email address to reply to
        message: Message content

    Returns:
        Tuple of (success: bool, error_message: Optional[str])
    """
    try:
        # Get email configuration
        smtp_user = os.getenv("OUTLOOK_EMAIL")
        smtp_password = os.getenv("OUTLOOK_APP_PASSWORD")
        mail_to = os.getenv("CONTACT_EMAIL_TO", smtp_user)

        if not all([smtp_user, smtp_password]):
            return False, "Missing Outlook credentials"

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

        # Create email message
        msg = MIMEMultipart()
        msg["From"] = smtp_user
        msg["To"] = mail_to
        msg["Subject"] = f"📬 Kantaka Sodhana Contact: {name}"
        msg["Reply-To"] = email

        msg.attach(MIMEText(body, "plain"))

        # Send via Outlook SMTP
        with smtplib.SMTP("smtp-mail.outlook.com", 587, timeout=15) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)

        print(f"✅ Email sent from {email} to {mail_to} via Outlook SMTP")
        return True, None

    except smtplib.SMTPAuthenticationError:
        error_msg = "Invalid Outlook email or app password"
        print(f"❌ Auth error: {error_msg}")
        return False, error_msg
    except smtplib.SMTPException as e:
        error_msg = f"SMTP error: {str(e)}"
        print(f"❌ {error_msg}")
        return False, error_msg
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Unexpected error: {error_msg}")
        return False, error_msg

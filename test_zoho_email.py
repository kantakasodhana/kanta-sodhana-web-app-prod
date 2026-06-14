#!/usr/bin/env python3
"""
Direct Zoho Mail SMTP Test
Run this to verify email credentials and connection
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sys
from datetime import datetime

# Zoho Mail Configuration
SMTP_USER = "sumanthnaidu.mathireddy@kantaka-sodhana.app"
SMTP_PASSWORD = "7bsMxvftRUud"
SMTP_HOST = "smtp.zoho.com"
SMTP_PORT = 587
RECIPIENT = "sumanthnaidu.mathireddy@kantaka-sodhana.app"

def test_zoho_connection():
    """Test SMTP connection to Zoho Mail"""
    print("=" * 70)
    print("KANTAKA SODHANA - ZOHO MAIL SMTP TEST")
    print("=" * 70)
    print()

    print("📧 Email Configuration:")
    print(f"   Host: {SMTP_HOST}:{SMTP_PORT}")
    print(f"   User: {SMTP_USER}")
    print(f"   Recipient: {RECIPIENT}")
    print()

    # Test 1: Connection
    print("🔗 Test 1: Testing SMTP connection...")
    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:
            print("   ✅ Connected to SMTP server")

            # Test 2: STARTTLS
            print("🔒 Test 2: Testing TLS encryption...")
            server.starttls()
            print("   ✅ TLS enabled")

            # Test 3: Authentication
            print("🔐 Test 3: Testing authentication...")
            server.login(SMTP_USER, SMTP_PASSWORD)
            print("   ✅ Authentication successful")

            # Test 4: Send test email
            print("📬 Test 4: Sending test email...")

            msg = MIMEMultipart()
            msg["From"] = SMTP_USER
            msg["To"] = RECIPIENT
            msg["Subject"] = f"🧪 Kantaka Sodhana SMTP Test - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"

            body = f"""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KANTAKA SODHANA - SMTP CONNECTIVITY TEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ SMTP Test Status: SUCCESS

If you received this email, it means:
  • Zoho Mail credentials are valid
  • SMTP connection works
  • Email routing is functional
  • Contact form emails will work

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Test Details:
  Date: {datetime.now().isoformat()}
  From: {SMTP_USER}
  To: {RECIPIENT}
  Server: {SMTP_HOST}:{SMTP_PORT}
  Protocol: SMTP + TLS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next Steps:
  1. Check your inbox at {RECIPIENT}
  2. Look for subject: "Kantaka Sodhana SMTP Test"
  3. If received, email integration is ready!
  4. If not received, check spam/junk folder

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""

            msg.attach(MIMEText(body, "plain"))

            server.send_message(msg)
            print("   ✅ Test email sent successfully")

    except smtplib.SMTPAuthenticationError:
        print("   ❌ FAILED: Authentication error")
        print("      Check username and password")
        return False
    except smtplib.SMTPException as e:
        print(f"   ❌ FAILED: SMTP error - {e}")
        return False
    except Exception as e:
        print(f"   ❌ FAILED: {e}")
        return False

    print()
    print("=" * 70)
    print("✅ ALL TESTS PASSED!")
    print("=" * 70)
    print()
    print("📋 Next Steps:")
    print("   1. Check your email inbox for the test message")
    print(f"   2. Look for sender: {SMTP_USER}")
    print("   3. Subject should contain 'Kantaka Sodhana SMTP Test'")
    print("   4. If received → Email integration is working!")
    print("   5. If not received → Check spam/junk folder")
    print()
    print("=" * 70)
    return True


if __name__ == "__main__":
    try:
        success = test_zoho_connection()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n⚠️  Test interrupted by user")
        sys.exit(1)

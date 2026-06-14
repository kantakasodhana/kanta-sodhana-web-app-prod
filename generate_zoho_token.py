#!/usr/bin/env python3
"""
Generate Zoho OAuth Refresh Token
Run this once to get the refresh token for API access
"""

import requests
import webbrowser
from urllib.parse import urlencode
import time

# Credentials from Zoho Developer Console
CLIENT_ID = "1000.7T4DXSW0OH39S5G0MS1TQ8UOSJ0KNI"
CLIENT_SECRET = "2272d4229bdd6d4e87895c098bfcc1a0daf79e3efc"
REDIRECT_URI = "http://localhost:3002/callback"
SCOPE = "ZohoMail.accounts.ALL"

print("=" * 70)
print("ZOHO OAUTH TOKEN GENERATOR")
print("=" * 70)
print()

# Step 1: Generate authorization URL
auth_url = f"https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id={CLIENT_ID}&scope={SCOPE}&redirect_uri={REDIRECT_URI}"

print("📱 Step 1: Opening browser for authorization...")
print(f"URL: {auth_url}")
print()

try:
    webbrowser.open(auth_url)
    print("✅ Browser opened. Please authorize the application.")
except:
    print("⚠️  Couldn't open browser. Visit this URL manually:")
    print(auth_url)

print()
print("=" * 70)
auth_code = input("📋 Step 2: Copy the 'code' parameter from the URL and paste here:\n> ").strip()

if not auth_code:
    print("❌ No code provided")
    exit(1)

print()
print("🔄 Step 3: Exchanging code for refresh token...")

# Exchange code for refresh token
token_url = "https://accounts.zoho.com/oauth/v2/token"
token_data = {
    "grant_type": "authorization_code",
    "client_id": CLIENT_ID,
    "client_secret": CLIENT_SECRET,
    "redirect_uri": REDIRECT_URI,
    "code": auth_code,
    "scope": SCOPE,
}

try:
    response = requests.post(token_url, data=token_data, timeout=10)
    response.raise_for_status()

    result = response.json()

    if "refresh_token" in result:
        refresh_token = result["refresh_token"]
        access_token = result.get("access_token", "")

        print("✅ SUCCESS!")
        print()
        print("=" * 70)
        print("🔑 YOUR REFRESH TOKEN:")
        print("=" * 70)
        print(refresh_token)
        print("=" * 70)
        print()
        print("📝 Copy this and add to .env.local:")
        print(f"ZOHO_REFRESH_TOKEN={refresh_token}")
        print()
        print("=" * 70)

    else:
        print(f"❌ Error: {result.get('error', 'Unknown error')}")
        print(result)

except Exception as e:
    print(f"❌ Error: {e}")
    exit(1)

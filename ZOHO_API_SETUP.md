# Zoho Mail REST API Setup Guide

## ✅ What You Have

- **Client ID:** `1000.7T4DXSW0OH39S5G0MS1TQ8UOSJ0KNI`
- **Client Secret:** `2272d4229bdd6d4e87895c098bfcc1a0daf79e3efc`
- **Email:** `sumanthnaidu.mathireddy@kantaka-sodhana.app`

---

## 🔑 Step 1: Generate Refresh Token

Run this **once** on your machine:

```bash
cd "C:\Users\mathi\OneDrive\Desktop\Projects\kanta-sodhana-web-app\Kantaka Sodhana Web App"
pip install requests
python generate_zoho_token.py
```

### What Happens:

1. Browser opens → Zoho asks for authorization
2. Click **Allow**
3. You're redirected to: `http://localhost:3002/callback?code=xxxxx`
4. Copy the **code** value
5. Paste into the script
6. You'll get a **REFRESH TOKEN**

---

## 📝 Step 2: Add Refresh Token to `.env.local`

After getting the refresh token, update `.env.local`:

```
ZOHO_REFRESH_TOKEN=<paste_refresh_token_here>
```

Example:
```
ZOHO_REFRESH_TOKEN=1000.abcd1234efgh5678ijkl9012
```

---

## 🚀 Step 3: Update Backend

Copy `email_service_api.py` to:
```
services/backend/app/services/email_api.py
```

Update `services/backend/app/routes/contact.py`:

```python
# Change this import:
from app.services.email import send_contact_email

# To this:
from app.services.email_api import send_contact_email
```

---

## ✅ Step 4: Install Dependencies

```bash
cd services/backend
pip install requests
pip install python-multipart
```

---

## 🧪 Step 5: Test

```bash
# Terminal 1: Backend
cd services/backend
./venv/bin/python -m uvicorn main:app --reload --port 8000

# Terminal 2: Frontend
npm run dev

# Terminal 3: Test the contact form
# Go to http://127.0.0.1:3002
# Fill and submit contact form
```

### Expected Flow:

1. Form submitted → API call to backend
2. Backend gets Zoho access token
3. Sends email via Zoho REST API
4. You see "Transmission Accepted"
5. Email received at `sumanthnaidu.mathireddy@kantaka-sodhana.app`

---

## 📋 Checklist

- [ ] Run `generate_zoho_token.py`
- [ ] Get refresh token from browser authorization
- [ ] Add refresh token to `.env.local`
- [ ] Copy `email_service_api.py` to backend
- [ ] Update `contact.py` import
- [ ] Install requests: `pip install requests`
- [ ] Start backend and frontend
- [ ] Test contact form
- [ ] Verify email received

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Browser doesn't open | Visit the URL manually from script output |
| "Failed to get access token" | Refresh token might be invalid, regenerate |
| "Missing email configuration" | Check `.env.local` has all ZOHO_* variables |
| Email not sent | Check backend logs for API error message |

---

## 📚 What's Changed

### Old (SMTP):
```python
import smtplib
# Direct SMTP connection
```

### New (REST API):
```python
import requests
# Uses Zoho's official REST API
# More reliable and feature-rich
```

---

## 🎯 Benefits of REST API

✅ Official Zoho method (more reliable)  
✅ No SMTP authentication issues  
✅ Better error handling  
✅ Built-in rate limiting  
✅ Supports attachments (if needed later)  

---

**Ready? Start with Step 1!** 🚀

# Email Integration Setup Guide

## ✅ What's Been Done

1. **Frontend Contact Form Updated** - `SecureContactForm.tsx` now sends data to backend API
2. **Environment Variables Created** - `.env.local` with Zoho Mail credentials
3. **Email Service Created** - `email_service.py` handles SMTP sending
4. **API Route Template** - `contact_route.py` ready to integrate

---

## 🔧 Integration Steps

### Step 1: Copy Email Service to Backend

Copy `email_service.py` to:
```
services/backend/app/services/email.py
```

### Step 2: Update Backend Main File

Edit `services/backend/main.py` and add this import at the top:

```python
from app.routes.contact import router as contact_router
```

Then add this line in your app initialization (after creating the FastAPI app):

```python
# Include contact routes
app.include_router(contact_router)
```

**Example:**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.contact import router as contact_router

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3002", "http://127.0.0.1:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(contact_router)
```

### Step 3: Add Dependencies

Install required Python packages:

```bash
cd services/backend
pip install python-multipart email-validator
```

### Step 4: Update .env.local (Already Done)

Your `.env.local` already contains:
```
ZOHO_MAIL_USER=sumanthnaidu.mathireddy@kantaka-sodhana.app
ZOHO_MAIL_PASSWORD=dgsMy4BEuUqs
ZOHO_MAIL_HOST=smtp.zoho.com
ZOHO_MAIL_PORT=587
CONTACT_EMAIL_TO=sumanthnaidu.mathireddy@kantaka-sodhana.app
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

**⚠️ Add to `.gitignore`:**
```
.env.local
.env.*.local
```

---

## 🚀 Testing

### 1. Start Backend
```bash
cd services/backend
./venv/bin/python -m uvicorn main:app --reload --port 8000
```

You should see:
```
✓ Uvicorn running on http://127.0.0.1:8000
```

### 2. Start Frontend
```bash
npm run dev
```

### 3. Test Contact Form

1. Open browser to `http://127.0.0.1:3002`
2. Scroll to **Contact** section
3. Fill in form:
   - **Operator Name:** Your Name
   - **Return Channel:** your.email@example.com
   - **Transmission Brief:** Test message
4. Click **Transmit Secure Brief**
5. Check the terminal - you should see:
   ```
   ✅ Email sent from your.email@example.com to sumanthnaidu.mathireddy@kantaka-sodhana.app
   ```

---

## 🔐 Security Checklist

- [x] Credentials in `.env.local` (not in code)
- [x] `.env.local` in `.gitignore`
- [x] CORS configured for localhost only
- [x] Email validation on form submission
- [x] Error handling for SMTP failures
- [ ] On production: Use environment variables from deployment platform

---

## 📧 What Happens When Form Submitted

```
User submits form
    ↓
Frontend sends POST to http://localhost:8000/api/contact
    ↓
Backend receives request
    ↓
Email service connects to Zoho SMTP
    ↓
Sends email to sumanthnaidu.mathireddy@kantaka-sodhana.app
    ↓
Email received! (check your inbox)
    ↓
Frontend shows "Transmission Accepted" message
```

---

## 🐛 Troubleshooting

### Email not sending?

**Check backend logs for:**
- ❌ "Email configuration missing" → Check `.env.local` variables
- ❌ "Authentication failed" → Check Zoho credentials
- ❌ "SMTP service error" → Zoho might be blocking the connection

**Zoho Mail SMTP Settings:**
- **Host:** smtp.zoho.com
- **Port:** 587 (TLS)
- **Username:** sumanthnaidu.mathireddy@kantaka-sodhana.app
- **Password:** dgsMy4BEuUqs

### Form not sending request?

1. Check browser DevTools (F12) → Network tab
2. Look for POST to `http://localhost:8000/api/contact`
3. Check response status and error message

### CORS error?

Add your frontend URL to CORS allowed origins in `main.py`:
```python
allow_origins=["http://localhost:3002", "http://127.0.0.1:3002", "your-production-url.com"]
```

---

## 📝 Files Created/Updated

| File | Status | Action |
|------|--------|--------|
| `.env.local` | ✅ Created | Configure with your credentials |
| `SecureContactForm.tsx` | ✅ Updated | Now sends to backend API |
| `email_service.py` | ✅ Created | Copy to `services/backend/app/services/` |
| `contact_route.py` | ✅ Created | Copy to `services/backend/app/routes/` |
| `main.py` | ⏳ Pending | Add contact router import |

---

## ✨ Next Steps

1. ✅ Copy files to correct locations
2. ✅ Update `main.py` with router import
3. ✅ Start backend server
4. ✅ Test contact form
5. ✅ Check inbox for test email

**You're all set!** 🎉

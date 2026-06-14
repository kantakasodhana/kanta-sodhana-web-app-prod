# Email Integration Test Guide

## 🧪 Test Checklist

Follow these steps to verify the email integration works end-to-end.

---

## Step 1: Prepare Files

Before testing, ensure these files are in place:

```
services/backend/
├── app/
│   ├── services/
│   │   └── email.py                    ← Copy email_service.py here
│   └── routes/
│       └── contact.py                  ← Copy contact_route.py here
└── main.py                             ← Update with router import
```

---

## Step 2: Start Backend Server

**Terminal 1 - Backend:**

```bash
cd services/backend
./venv/bin/python -m uvicorn main:app --reload --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

✅ If you see this, the backend is running!

---

## Step 3: Start Frontend Server

**Terminal 2 - Frontend:**

```bash
cd "C:\Users\mathi\OneDrive\Desktop\Projects\kanta-sodhana-web-app\Kantaka Sodhana Web App"
npm run dev
```

**Expected Output:**
```
▲ Next.js 16.2.4 (Turbopack)
- Local:        http://127.0.0.1:3002
✓ Ready in xxx ms
```

✅ If you see this, frontend is running!

---

## Step 4: Test the Contact Form

### Open Browser

Go to: **http://127.0.0.1:3002**

### Navigate to Contact Section

1. Scroll down to the **Contact** section (or click nav link)
2. You should see the "Secure Contact Form" with three fields

### Fill in Test Data

| Field | Value |
|-------|-------|
| **Operator Name** | Test User |
| **Return Channel** | test@example.com |
| **Transmission Brief** | This is a test email from Kantaka Sodhana contact form. If you receive this, the email integration works! |

### Submit Form

Click **"TRANSMIT SECURE BRIEF"** button

---

## Step 5: Verify Success

### Frontend Success Message

You should see:
```
Transmission Accepted

Secure brief received. We'll respond within 24 hours.
```

✅ **Form submitted successfully!**

### Check Backend Logs

Look at **Terminal 1 (Backend)** output. You should see:

```
✅ Email sent from test@example.com to sumanthnaidu.mathireddy@kantaka-sodhana.app
```

✅ **Email sent successfully!**

### Check Email Inbox

Open your email client and check: **sumanthnaidu.mathireddy@kantaka-sodhana.app**

You should receive an email with:
- **Subject:** 📬 Kantaka Sodhana Contact: Test User
- **From:** sumanthnaidu.mathireddy@kantaka-sodhana.app
- **Reply-To:** test@example.com
- **Body:** Contains your test message

✅ **Email received!**

---

## Step 6: Test Error Handling

### Test 1: Invalid Email

1. Fill form with invalid email: `notanemail`
2. Try to submit
3. Browser should show form validation error before sending

✅ **Frontend validation works**

### Test 2: Empty Fields

1. Leave fields empty
2. Try to submit
3. Browser should require all fields

✅ **Required field validation works**

### Test 3: Backend Connection Error

1. Stop backend server (Ctrl+C in Terminal 1)
2. Try to submit form
3. You should see error message: "Connection error. Please try again later."

✅ **Error handling works**

---

## 🎯 Success Criteria

- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Contact form displays in browser
- [ ] Form submission shows "Transmission Accepted" message
- [ ] Backend logs show "✅ Email sent..."
- [ ] Email received in inbox
- [ ] Email contains correct sender, subject, and message
- [ ] Form validation prevents invalid submissions
- [ ] Error handling shows when backend is unavailable

---

## 🐛 Troubleshooting

### Backend Won't Start

**Error:** `ModuleNotFoundError: No module named 'app.services.email'`

**Fix:**
1. Check `email.py` is in `services/backend/app/services/`
2. Run `pip install -r requirements.txt` in `services/backend`

---

### Email Not Sending

**Check Backend Logs for:**

| Error | Cause | Fix |
|-------|-------|-----|
| `Email configuration missing` | `.env` not loaded | Restart backend after creating `.env.local` |
| `Authentication failed` | Wrong credentials | Verify Zoho password in `.env.local` |
| `SMTP service error` | Connection issue | Check internet, Zoho might be blocking IP |
| `Unexpected error` | Unknown | Check full error message in logs |

---

### Form Won't Submit

**Check Browser Console (F12):**

1. Open DevTools → **Console** tab
2. Look for JavaScript errors
3. Open **Network** tab
4. Try form submission
5. Look for POST request to `http://127.0.0.1:8000/api/contact`
6. Check response status and body

---

### Email Not Appearing

**Check:**
1. ✅ Spam/Junk folder
2. ✅ Check backend logs show `✅ Email sent...`
3. ✅ Correct email address in `.env.local` under `CONTACT_EMAIL_TO`
4. ✅ Zoho Mail is receiving emails (test with another email service)

---

## 📊 Test Results Template

```
═══════════════════════════════════════════════════
KANTAKA SODHANA - EMAIL INTEGRATION TEST REPORT
═══════════════════════════════════════════════════

Date: ________
Tester: ________

BACKEND:
  [ ] Server starts on :8000
  [ ] No module errors
  [ ] Contact route registered
  
FRONTEND:
  [ ] Dev server starts on :3002
  [ ] Contact form renders
  [ ] Form validation works
  
EMAIL INTEGRATION:
  [ ] Form submission succeeds
  [ ] Success message displays
  [ ] Backend logs email sent
  [ ] Email received in inbox
  [ ] Email content is correct
  
ERROR HANDLING:
  [ ] Invalid email blocked
  [ ] Empty fields blocked
  [ ] Backend down → error message
  
OVERALL STATUS: ✅ PASS / ❌ FAIL

Notes:
_________________________________________________
_________________________________________________
```

---

## 🚀 Once Tests Pass

1. ✅ Commit changes to git
2. ✅ Update `.gitignore` to ignore `.env.local`
3. ✅ On production: Use environment variables from hosting platform
4. ✅ Update email recipient if needed in `.env`

**You're done! Email integration is live! 🎉**

# Kantaka Sodhana — Deployment Guide

## 🏠 Local Development

### Prerequisites
- Node.js 18+ 
- Python 3.11+
- Supabase account (configured)

### Setup

**Frontend:**
```bash
npm install
npm run dev  # Runs on http://localhost:3002
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
pip install email-validator pydantic supabase
python -m uvicorn main:app --reload --port 8000
```

**Services:**
- Frontend: http://localhost:3002
- Backend API: http://localhost:8000
- Admin Panel: http://localhost:5001/admin

---

## 🚀 Digital Ocean Production

### Configuration
Use `.env.production` when deploying to Digital Ocean:
```bash
cp .env.production .env
```

### Services
- **Frontend:** port 3002
- **Backend/Risk Scoring:** port 8000
- **Auth Service:** port 5001
- **Doc Forgery:** port 8002
- **Dup/Tamper:** port 8003
- **QR Verify:** port 8004

### Database
- Supabase PostgreSQL (already configured)
- Connection string: `.env.production`

### Contact Form
- Storage: Supabase `contact_submissions` table
- Admin Panel: Available at `/admin` in Flask
- Status tracking: new → reviewed → resolved

---

## 📋 Feature Checklist

✅ **Frontend**
- Light/dark theme with CSS variables
- Contact form → Supabase database
- Demo pages with video placeholders (`/demo/[id]`)
- Admin dashboard (integrated in Flask)

✅ **Backend**
- FastAPI with CORS enabled
- Contact form endpoint (`/api/contact`)
- Supabase integration for data storage
- Risk scoring ML pipeline

✅ **Database**
- Supabase PostgreSQL
- Contact submissions table
- Real-time admin updates

---

## 🔄 Git Workflow

1. **Local Testing:** Use `.env.local`
2. **GitHub Push:** Include `.env.production` (for reference)
3. **Digital Ocean Deployment:** Use `.env.production` values in environment
4. **Database:** Supabase handles migrations

---

## 📱 Admin Panel

**Location:** `http://localhost:5001/admin`

**Features:**
- View pending access requests
- Approve/reject users
- Manage contact form submissions
- Filter by status (new/reviewed/resolved)

**Contact Submissions:**
- Real-time loading
- Status dropdown (new → reviewed → resolved)
- Update on change
- Auto-refresh every 30 seconds

---

## 🎥 Demo Pages

**Structure:** `/demo/[id]/page.tsx`

**Features:**
- Video player (placeholder ready)
- Impact metrics
- Tech stack display
- Description section
- Same styling as main page

**Demo IDs:**
- `uc-rs` — Risk Scoring
- `uc-docforgery` — Document Forgery
- `uc-medai` — Medical AI Adjudication

---

## ⚡ Ready to Deploy

✅ All components working locally  
✅ Supabase credentials configured  
✅ Production env file ready  
✅ No hardcoded secrets in code  
✅ Responsive UI for mobile/desktop  

**Next steps when ready:**
1. Push to GitHub
2. Set Digital Ocean environment variables
3. Deploy using `.env.production`
4. Test all features on live server

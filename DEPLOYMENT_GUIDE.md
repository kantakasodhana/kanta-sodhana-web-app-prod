# Complete Deployment Guide — Kantaka Śodhana

## Pre-Deployment: Final Checklist

```bash
# 1. Verify all files are in place
ls -la README.md docs/ .github/workflows/ vercel.json Dockerfile

# 2. Verify .gitignore excludes sensitive files
cat .gitignore | grep -E "\.env|\.env\.local|node_modules|__pycache__"

# 3. Run final local tests
npm run build
cd backend && pytest tests/ --cov && cd ..

# 4. Verify no secrets in code
grep -r "password\|api_key\|secret" src backend --exclude-dir=node_modules

# 5. Check code quality
npx eslint src
npx tsc --noEmit
```

If all checks pass, proceed to deployment.

---

## Step 1: Frontend Deployment (Vercel)

### 1.1 Create Vercel Project

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login
# Follow the browser prompt

# Link project
cd "Kantaka Sodhana Web App"
vercel link
# Select "Create a new project" if first time
# Project name: kantaka-sodhana
# Framework: Next.js
```

### 1.2 Set Environment Variables

In Vercel dashboard (vercel.com/dashboard/kantaka-sodhana/settings/environment-variables):

```
NEXT_PUBLIC_SUPABASE_URL          = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY     = sb_publishable_xxx (from Supabase dashboard)
NEXT_PUBLIC_API_BASE_URL          = https://api.kantaka-sodhana.app/api
NEXT_PUBLIC_SENTRY_DSN            = https://xxx@o123456.ingest.sentry.io/123456
```

Mark sensitive keys as "Sensitive" (encrypted).

### 1.3 Configure Domain

In Vercel dashboard:

1. Go to Settings > Domains
2. Add domain: `kantaka-sodhana.app`
3. Follow DNS instructions
4. Wait for DNS propagation (< 24h)
5. Verify SSL certificate is active

### 1.4 Deploy Frontend

```bash
# Automatic deployment (recommended)
git push origin main
# Vercel automatically deploys on push to main

# OR manual deployment
vercel deploy --prod
```

**Verify:**
```bash
curl -I https://kantaka-sodhana.app
# Should return 200 OK with Next.js headers
```

---

## Step 2: Backend Deployment (Railway)

### 2.1 Create Railway Project

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login
# Opens browser for authentication

# Create new project
railway init
# Select "Flask" or "FastAPI" (if prompted)
# Project name: kantaka-backend
```

### 2.2 Set Environment Variables

In Railway dashboard (railway.app > Project > Variables):

```
NEXT_PUBLIC_SUPABASE_URL          = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY     = sb_publishable_xxx
SENTRY_DSN                        = https://xxx@o123456.ingest.sentry.io/123456
ENVIRONMENT                       = production
```

### 2.3 Configure Domain

In Railway dashboard > Networking:

1. Generate domain: `kantaka-api.railway.app` (auto-assigned)
2. Add custom domain: `api.kantaka-sodhana.app`
3. Add DNS CNAME record:
   ```
   api CNAME kantaka-api.railway.app
   ```
4. Wait for DNS propagation (< 24h)

### 2.4 Deploy Backend

```bash
# Link Railway project
railway link
# Select the kantaka-backend project

# Deploy
railway up
# Or: git push origin main (if connected to GitHub)

# Verify deployment
curl https://api.kantaka-sodhana.app/api/health
# Should return {"status": "ok"}
```

---

## Step 3: Database Configuration (Supabase)

### 3.1 Create Tables (If Not Exists)

In Supabase dashboard > SQL Editor, run:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  hashed_password TEXT NOT NULL,
  phone TEXT,
  purpose TEXT,
  approved BOOLEAN DEFAULT false,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  submitted_at TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'new', -- new, reviewed, resolved
  admin_notes TEXT
);

-- Create indexes
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_approved ON users(approved);
CREATE INDEX idx_contact_status ON contact_submissions(status);
CREATE INDEX idx_contact_submitted_at ON contact_submissions(submitted_at DESC);

-- Analyze tables
ANALYZE users;
ANALYZE contact_submissions;
```

### 3.2 Configure Row-Level Security (Optional)

For more security, enable RLS:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY users_own_data ON users
  FOR SELECT
  USING (auth.uid()::bigint = id);
```

### 3.3 Setup Automatic Backups

In Supabase dashboard > Settings > Backups:

- ✅ Daily backups (automatic)
- ✅ Backup retention: 30 days
- ✅ Point-in-time recovery enabled

---

## Step 4: Monitoring & Alerts Setup

### 4.1 Sentry Configuration

```bash
# Create Sentry account at sentry.io

# Get DSN from Sentry project settings
NEXT_PUBLIC_SENTRY_DSN=https://key@o123456.ingest.sentry.io/123456
SENTRY_DSN=https://key@o123456.ingest.sentry.io/123456

# Add to Vercel & Railway environment variables
```

### 4.2 GitHub Actions Setup

1. Add secrets to GitHub (Settings > Secrets > Actions):
   ```
   VERCEL_TOKEN          → From vercel.com/account/tokens
   VERCEL_ORG_ID         → From Vercel project settings
   VERCEL_PROJECT_ID     → From Vercel project settings
   RAILWAY_TOKEN         → From railway.app/dashboard/settings
   SLACK_WEBHOOK         → From Slack app webhooks (optional)
   ```

2. Trigger CI/CD:
   ```bash
   git push origin main
   # GitHub Actions automatically runs the pipeline
   # Monitor at: github.com/username/kantaka/actions
   ```

### 4.3 Slack Notifications (Optional)

1. Create Slack app: api.slack.com > Create New App
2. Enable Incoming Webhooks
3. Add webhook to #kantaka-alerts channel
4. Copy webhook URL to GitHub Secrets

---

## Step 5: DNS Configuration

### Update DNS Records

Go to your domain registrar (e.g., GoDaddy, Namecheap):

```
Type    Name              Value
───────────────────────────────────────────────────────────
A       kantaka-sodhana   x.x.x.x (Vercel IP)
CNAME   api               kantaka-api.railway.app
CNAME   staging           staging.vercel.app (if exists)
TXT     @                 v=spf1 ... (for email)
```

**Verify DNS:**
```bash
dig kantaka-sodhana.app +short
# Should return Vercel IP address

dig api.kantaka-sodhana.app +short
# Should return Railway CNAME
```

---

## Step 6: Final Verification

### Health Checks

```bash
# Frontend
curl -I https://kantaka-sodhana.app
# Expected: 200 OK with x-vercel-cache header

# Backend health
curl https://api.kantaka-sodhana.app/api/health
# Expected: {"status": "ok"}

# Backend prediction (with auth cookie)
curl -X POST https://api.kantaka-sodhana.app/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "claim_amount": 50000,
    "length_of_stay": 5,
    "provider_experience": 10,
    "historical_denials": 2,
    "readmission_flag": 0,
    "repeat_procedure_flag": 0
  }'
# Expected: {"score": ..., "band": "...", ...}
```

### Functional Tests

- [ ] Signup page loads
- [ ] Login page loads
- [ ] Contact form submits
- [ ] Admin dashboard loads
- [ ] Error handling works

### Performance Checks

```bash
# Lighthouse score
https://web.dev/measure/
# Target: > 80 all metrics

# Vercel Analytics
vercel.com/dashboard/kantaka-sodhana/analytics
# Check Core Web Vitals

# Sentry dashboard
sentry.io/organizations/kantaka
# Should show zero errors (or expected errors only)
```

---

## Post-Deployment Actions

### Day 1
- [ ] Monitor error rate (Sentry)
- [ ] Verify performance metrics (Vercel, Lighthouse)
- [ ] Test user signup/login flow
- [ ] Test contact form submission
- [ ] Review logs for any warnings

### Week 1
- [ ] Analyze user behavior
- [ ] Check database growth
- [ ] Review security alerts
- [ ] Optimize any slow endpoints
- [ ] Update documentation with production URLs

### Month 1
- [ ] Create monitoring dashboard
- [ ] Schedule regular security audits
- [ ] Plan scaling strategy (if needed)
- [ ] Set up cost tracking alerts
- [ ] Establish on-call rotation

---

## Troubleshooting

### Deployment fails in GitHub Actions

**Problem:** Build step fails
```bash
# Check the error log in GitHub Actions
# Common causes:
# 1. Missing environment variable (add to Vercel/Railway)
# 2. Failed test (run locally: npm test)
# 3. TypeScript error (run: npx tsc --noEmit)
# 4. Missing dependency (run: npm ci)

# Fix and retry
git push origin main
```

### "Cannot reach auth server"

**Problem:** Frontend can't connect to Flask auth service
```bash
# Verify Flask is running in Railway
# Check Railway logs: railway.app > Project > Logs
# 
# Fix:
# 1. Verify FLASK_AUTH_URL is set in Vercel
# 2. Verify Flask service is deployed to Railway
# 3. Check firewall rules allow cross-origin requests
```

### "Missing Supabase credentials"

**Problem:** Backend can't connect to Supabase
```bash
# Verify credentials in Railway environment variables
railway.app > Project > Variables
# Should have:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY

# Re-generate keys in Supabase if needed:
# supabase.com > Project > Settings > API
```

### "SSL certificate not valid"

**Problem:** Browser shows SSL error
```bash
# Verify domain DNS is correct
dig kantaka-sodhana.app

# Verify Vercel certificate status
vercel.com/dashboard > kantaka-sodhana > Settings > Domains

# If still broken:
# 1. Remove domain from Vercel
# 2. Wait 10 minutes
# 3. Re-add domain to Vercel
# 4. Certificate regenerates automatically
```

---

## Rollback Procedure

If critical issues arise post-deployment:

### Option 1: Deploy Previous Version (Recommended)

```bash
# Find last good commit
git log --oneline -10

# Create new branch from good commit
git checkout -b rollback/<hash>
git reset --hard <hash>

# Deploy
git push origin rollback/<hash>
# Vercel auto-deploys the branch

# To make it production:
git push origin rollback/<hash>:main
```

### Option 2: Use Vercel UI

1. Go to vercel.com > Deployments
2. Click previous version
3. Click "Promote to Production"
4. Confirm

### Option 3: Use Railway UI

1. Go to railway.app > Project > Deployments
2. Click previous deployment
3. Click "Rollback"

---

## Success Checklist

✅ **Deployment is successful when:**

- Frontend loads at kantaka-sodhana.app
- Backend responds at api.kantaka-sodhana.app/api/health
- Users can signup → login → use dashboard
- Contact form submits and saves to database
- Admin dashboard shows submissions
- Error rate < 0.5% (first 24 hours)
- Performance metrics stable (LCP < 2.5s)
- All monitoring tools operational
- Team confidence high

---

## Support & Escalation

If you encounter issues:

1. **Check logs first:**
   - Vercel: vercel.com > Deployments > Logs
   - Railway: railway.app > Logs
   - Sentry: sentry.io > Issues

2. **Search documentation:**
   - README.md (general info)
   - docs/API.md (API endpoints)
   - docs/ARCHITECTURE.md (system design)
   - docs/MONITORING.md (observability)

3. **Contact support:**
   - Vercel: vercel.com/support
   - Railway: railway.app/support
   - Supabase: supabase.com/support
   - Sentry: sentry.io/support

4. **Emergency contact:**
   - Email: mathireddysumanth@gmail.com

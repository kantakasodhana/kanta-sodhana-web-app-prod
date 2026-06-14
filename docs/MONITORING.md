# Monitoring & Observability Guide

## Overview

Complete monitoring strategy for Kantaka Śodhana in production, covering error tracking, performance monitoring, and alerting.

## 1. Error Tracking (Sentry)

### Setup

**1. Create Sentry Account**
- Go to sentry.io and sign up
- Create new organization "Kantaka-Sodhana"
- Create two projects: "kantaka-frontend" and "kantaka-backend"

**2. Install Frontend SDK**
```bash
npm install @sentry/nextjs
```

**3. Configure Frontend** (`src/instrumentation.ts`)
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
```

**4. Configure Backend** (`backend/main.py`)
```python
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    environment=os.getenv("ENVIRONMENT", "development"),
    integrations=[FastApiIntegration()],
    traces_sample_rate=0.1,
)
```

**5. Set Environment Variables**

In your deployment platform (Vercel/Railway):
```
NEXT_PUBLIC_SENTRY_DSN=https://your-key@o123456.ingest.sentry.io/123456
SENTRY_DSN=https://your-key@o123456.ingest.sentry.io/123456
```

### Manual Error Reporting

```typescript
// Capture custom errors
try {
  // ... code
} catch (error) {
  Sentry.captureException(error);
}

// Add context
Sentry.addBreadcrumb({
  message: "Contact form submitted",
  level: "info",
  data: { email: "user@example.com" }
});
```

### Sentry Dashboard

In Sentry, create alerts:

**Alert 1: High Error Rate**
```
Trigger: error.count > 50 in 5 minutes
Action: Send Slack notification
Channel: #kantaka-alerts
```

**Alert 2: New Issue**
```
Trigger: A new issue is created
Action: Send email to ops@kantaka-sodhana.app
```

---

## 2. Performance Monitoring (Vercel Speed Insights)

### Frontend Setup

Already included via `@vercel/analytics` (added in `src/app/layout.tsx`):

```typescript
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### Vercel Dashboard

1. Go to vercel.com > Dashboard > Project > Analytics
2. View Core Web Vitals:
   - **LCP (Largest Contentful Paint):** < 2.5s
   - **FID (First Input Delay):** < 100ms
   - **CLS (Cumulative Layout Shift):** < 0.1

### Lighthouse CI

**Setup GitHub Action** (already in `.github/workflows/ci-cd.yml`)

```bash
# Local run to test
npm install --save-dev @lhci/cli@latest
npx lhci autorun
```

Expected scores on every commit:
- Performance: > 80
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

---

## 3. Backend Performance Monitoring

### Request Logging Middleware

Add to `backend/main.py`:

```python
import time
import logging
import json

logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    
    # Log request
    logger.info("Request", extra={
        "method": request.method,
        "path": request.url.path,
        "timestamp": start
    })
    
    response = await call_next(request)
    duration = time.time() - start
    
    # Log response with duration
    logger.info("Response", extra={
        "method": request.method,
        "path": request.url.path,
        "status": response.status_code,
        "duration_ms": duration * 1000
    })
    
    # Add timing header
    response.headers["X-Process-Time"] = str(duration)
    
    # Alert on slow requests
    if duration > 1.0:
        logger.warning("Slow request detected", extra={
            "path": request.url.path,
            "duration_ms": duration * 1000
        })
    
    return response
```

### CPU Profiling (Py-Spy)

```bash
# Profile running backend
py-spy record -o profile.svg -- uvicorn backend.main:app --port 8000

# View profile (open in browser)
open profile.svg
```

### Memory Profiling

```bash
# Install memory profiler
pip install memory-profiler

# Run with memory tracking
python -m memory_profiler -o memory.prof backend/main.py

# Analyze
python -m pstats memory.prof
```

---

## 4. Database Monitoring

### Supabase Dashboard

1. Go to supabase.com > Your Project > Monitoring
2. Track:
   - Database size (growth over time)
   - Query count (by table, by operation)
   - Storage usage (disconnect old records)
   - Connection pool status

### Check for Slow Queries

In Supabase dashboard > Logs > Database:

```sql
-- Find slow queries
SELECT 
  query,
  calls,
  mean_exec_time,
  max_exec_time
FROM pg_stat_statements
WHERE mean_exec_time > 100  -- > 100ms
ORDER BY mean_exec_time DESC;
```

### Add Indexes

```sql
-- Contact form queries
CREATE INDEX CONCURRENTLY idx_contact_status ON contact_submissions(status);
CREATE INDEX CONCURRENTLY idx_contact_submitted_at ON contact_submissions(submitted_at DESC);

-- User queries
CREATE INDEX CONCURRENTLY idx_user_approved ON users(approved);
CREATE INDEX CONCURRENTLY idx_user_email ON users(email);

-- Analyze to update stats
ANALYZE contact_submissions;
ANALYZE users;
```

---

## 5. Custom Metrics Dashboard

### Real-Time Metrics to Track

**Frontend:**
- Page load time (by page)
- Core Web Vitals (LCP, FID, CLS)
- JavaScript errors (count, top 10)
- User sessions (active, daily unique)
- Contact form submissions (rate, success %)

**Backend:**
- Request rate (req/sec)
- Error rate (%)
- API latency (P50, P95, P99)
- Database connections (active, peak)
- ML model inference time
- CPU usage (%)
- Memory usage (%)

**Database:**
- Query count (by table)
- Slow query count
- Connection pool utilization
- Storage growth (MB/day)
- Row count (by table)

### Example Dashboard Query (PostgreSQL)

```sql
-- Daily metrics for monitoring
SELECT 
  DATE(submitted_at) as day,
  COUNT(*) as submissions,
  COUNT(CASE WHEN status='new' THEN 1 END) as new,
  COUNT(CASE WHEN status='resolved' THEN 1 END) as resolved
FROM contact_submissions
GROUP BY DATE(submitted_at)
ORDER BY day DESC
LIMIT 30;
```

---

## 6. Alerting Strategy

### Critical Alerts (Immediate)

```
TRIGGER: Error rate > 5% in last 5 minutes
ACTION: 
  • Slack to #kantaka-alerts
  • Email to ops@kantaka-sodhana.app
  • PagerDuty incident created
```

```
TRIGGER: API response time P99 > 2 seconds
ACTION:
  • Auto-scale Railway backend (+1 replica)
  • Slack notification
```

```
TRIGGER: Database CPU > 90%
ACTION:
  • Slack alert
  • Email database team
```

### Warning Alerts (30 min)

```
TRIGGER: Error rate > 1% in last 30 minutes
ACTION: Slack notification (async)

TRIGGER: Storage growth > 100MB/day
ACTION: Slack notification

TRIGGER: Lighthouse score drops > 10 points
ACTION: Email notification
```

### Informational (Daily)

```
TRIGGER: Daily summary at 9 AM
ACTION: Slack message with:
  • Total requests
  • Error count
  • Average latency
  • Submissions received
```

---

## 7. Slack Integration

### Setup Incoming Webhook

1. Go to api.slack.com > Create New App > From scratch
2. Enable "Incoming Webhooks"
3. Add webhook to channel #kantaka-alerts
4. Copy webhook URL

### Use in Sentry

1. Sentry Dashboard > Settings > Integrations
2. Install Slack
3. Select #kantaka-alerts channel

### Use in Backend Code

```python
import requests

SLACK_WEBHOOK = os.getenv("SLACK_WEBHOOK_URL")

def alert_slack(title: str, message: str, severity: str = "warning"):
    color = {"error": "#FF0000", "warning": "#FFAA00", "info": "#0088FF"}[severity]
    
    payload = {
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"*{title}*\n{message}"
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "context",
                "elements": [
                    {
                        "type": "mrkdwn",
                        "text": f"Severity: `{severity}` • Time: <!date^{int(time.time())}^{{date_short_pretty}} {{time_secs}}|{time.time()}>"
                    }
                ]
            }
        ]
    }
    
    requests.post(SLACK_WEBHOOK, json=payload)

# Use in code
try:
    result = Predictor().predict(claim.model_dump())
except Exception as e:
    alert_slack("🚨 Prediction Failed", str(e), severity="error")
    raise
```

---

## 8. Deployment Health Checks

### Pre-Deployment Checklist

```bash
# Frontend
npm run build           # Build completes
npm run test           # All tests pass
npx tsc --noEmit      # No TypeScript errors
npx eslint src        # No linting errors

# Backend
pytest backend/tests   # All tests pass
python -m py_compile backend/main.py  # No syntax errors
bandit -r backend     # No security issues

# Verify environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SENTRY_DSN
```

### Post-Deployment Checks

```bash
# Frontend
curl -s https://kantaka-sodhana.app/health | head -20

# Backend
curl https://api.kantaka-sodhana.app/api/health

# Sentry
# Check dashboard for errors (should be zero in first hour)

# Vercel Analytics
# Check vercel.com for Core Web Vitals

# Database
# Check Supabase monitoring for connection status
```

---

## 9. On-Call Runbook

If you get an alert, follow these steps:

### High Error Rate Alert

1. Check Sentry dashboard (sentry.io/organizations/kantaka/issues)
2. Click top error to see stack trace
3. Check which file/function is failing
4. Options:
   - **If frontend:** Check browser console, clear cache, restart services
   - **If backend:** Check backend logs, restart FastAPI service
   - **If database:** Check Supabase status page, run ANALYZE
5. If unresolved in 15 min, escalate to team

### Slow API Response

1. Check which endpoint is slow (Sentry, Vercel Analytics)
2. Profile with Py-Spy: `py-spy record -o profile.svg -- ...`
3. Options:
   - **Add database index** if query is slow
   - **Scale Railway** if CPU/memory is high
   - **Clear ML model cache** if prediction is slow
4. Monitor for 30 min to confirm fix

### Database Issues

1. Check Supabase status (supabase.com/status)
2. Check connection count in Supabase dashboard
3. Options:
   - Enable connection pooling
   - Archive old records
   - Increase database size
4. Contact Supabase support if persistent

---

## 10. Cost Optimization

### Monitor Costs

- **Vercel:** Check bandwidth usage monthly
- **Railway:** Monitor CPU/memory consumption
- **Supabase:** Check storage growth (charge per 1GB)
- **Sentry:** Track event count (alert at 80K events/month)

### Cost Reduction Tips

1. **Reduce Sentry sample rate** in production (0.1 = 10%)
2. **Archive contact submissions** older than 1 year
3. **Use Vercel Edge Middleware** instead of API routes where possible
4. **Enable caching** on static assets (Cache-Control headers)
5. **Consolidate monitoring tools** (pick 2 instead of 4)

---

## Next Steps

1. **Today:** Set up Sentry and deploy code changes
2. **Week 1:** Configure alerting rules and test notifications
3. **Week 2:** Create dashboard and train team on monitoring
4. **Week 3:** Run incident response simulation
5. **Ongoing:** Review metrics daily, optimize performance weekly

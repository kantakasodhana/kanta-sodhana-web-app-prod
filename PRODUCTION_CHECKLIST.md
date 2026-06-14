# Production Readiness Checklist

## Phase 1: Pre-Deployment (Week 1-2)

### Security
- [ ] SAST scan completed (Semgrep, Bandit) — No critical issues
- [ ] DAST scan completed (OWASP ZAP baseline)
- [ ] API endpoints rate-limited (5 req/min anonymous, 100 authenticated)
- [ ] CORS restricted to production domains only
- [ ] HTTPS enforced (HSTS header in vercel.json)
- [ ] Input validation on all forms (Pydantic + React)
- [ ] Secrets rotated — New Supabase keys generated
- [ ] SQL injection prevention verified (parameterized queries)
- [ ] XSS prevention verified (React escaping)
- [ ] CSRF protection enabled (SameSite cookies)
- [ ] Dependency vulnerabilities fixed (npm audit, pip audit)
- [ ] No hardcoded secrets in code (grep -r "api_key\|password" src/)

### Performance
- [ ] Lighthouse score > 80 (all metrics)
- [ ] LCP < 2.5s (measured via Vercel Analytics)
- [ ] API P95 latency < 200ms
- [ ] ML prediction < 500ms
- [ ] Database indexes created and analyzed
  ```sql
  CREATE INDEX idx_contact_status ON contact_submissions(status);
  CREATE INDEX idx_contact_submitted_at ON contact_submissions(submitted_at DESC);
  CREATE INDEX idx_user_approved ON users(approved);
  ANALYZE;
  ```
- [ ] Caching strategy implemented (Cache-Control headers)
- [ ] Bundle size acceptable (< 150KB gzipped main)

### Documentation
- [ ] README.md complete (installation, features, troubleshooting)
- [ ] API docs published (docs/API.md)
- [ ] Architecture diagram updated (docs/ARCHITECTURE.md)
- [ ] Deployment runbook created
- [ ] Incident response plan documented
- [ ] Environment variables documented (.env.example)

### Monitoring Setup
- [ ] Sentry integrated (error tracking)
- [ ] Vercel Speed Insights enabled
- [ ] Lighthouse CI configured
- [ ] Alerts configured (5+ critical alerts)
- [ ] Slack webhook connected
- [ ] Log aggregation working (Sentry, Vercel)
- [ ] Dashboards created (custom metrics)

### CI/CD Pipeline
- [ ] GitHub Actions workflow passes (lint, test, security, build)
- [ ] Tests pass (unit + integration)
- [ ] Security scan passes (no critical issues)
- [ ] Build completes in < 15 minutes
- [ ] Staging deployment successful
- [ ] Branch protection rules enforced (main branch)
- [ ] Secrets added to GitHub (VERCEL_TOKEN, etc.)

### Code Quality
- [ ] Dead code removed (email test files, unused components)
- [ ] Code duplication eliminated (especially Supabase client)
- [ ] Refactoring applied (improvements from REFACTORING_GUIDE.md)
- [ ] TypeScript strict mode enabled
- [ ] No console.log statements in production code
- [ ] No TODO/FIXME comments without issue tracking

---

## Phase 2: Deployment Preparation (Week 3)

### Environment Setup
- [ ] Production environment variables set (Vercel + Railway)
  - [ ] NEXT_PUBLIC_SUPABASE_URL (prod)
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY (prod)
  - [ ] NEXT_PUBLIC_API_BASE_URL (https://api.kantaka-sodhana.app/api)
  - [ ] FLASK_AUTH_URL (production URL)
  - [ ] NEXT_PUBLIC_SENTRY_DSN (production)
  - [ ] SENTRY_DSN (production backend)
- [ ] Database backups configured (Supabase automatic)
- [ ] CDN configured (Vercel default or Cloudflare)
- [ ] DNS configured (kantaka-sodhana.app)
- [ ] SSL certificate valid and auto-renewing
- [ ] Email service configured (for notifications)

### Testing
- [ ] Smoke tests passed (critical user journeys)
  - [ ] Signup → Login → View dashboard
  - [ ] Contact form submission
  - [ ] Risk prediction with result display
  - [ ] Error handling (invalid inputs)
- [ ] Penetration testing scheduled (external firm)
- [ ] User acceptance testing (UAT) passed
- [ ] Load test passed (target: 1,000 concurrent users)
  ```bash
  # Using k6 or similar
  k6 run load-test.js
  ```
- [ ] Browser compatibility tested (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness verified

### Compliance
- [ ] GDPR compliance verified (data handling, privacy policy)
- [ ] HIPAA compliance verified (if handling health data)
- [ ] Terms of Service published and reviewed
- [ ] Privacy Policy published and reviewed
- [ ] Cookie policy set (analytics consent)
- [ ] Data retention policy documented

### Team Preparation
- [ ] On-call schedule established
- [ ] Incident response playbook reviewed
- [ ] Team trained on monitoring tools
- [ ] Escalation procedures documented
- [ ] Post-mortems process defined

---

## Phase 3: Production Deployment (Week 4)

### Pre-Launch (1 Hour Before)
- [ ] Final sanity checks on staging environment
- [ ] All tests passing on main branch
- [ ] No critical security issues
- [ ] Monitoring tools operational
- [ ] Team online and ready
- [ ] Communication channels open (Slack)

### Deployment
- [ ] Frontend deployed to Vercel (main branch)
  ```bash
  git push origin main
  # Vercel auto-deploys
  ```
- [ ] Backend deployed to Railway
  ```bash
  railway up
  ```
- [ ] Verify deployment status (no errors in logs)
- [ ] Run health checks
  ```bash
  curl https://kantaka-sodhana.app/health
  curl https://api.kantaka-sodhana.app/api/health
  ```

### Post-Deployment (2 Hours)
- [ ] Error rate normal (< 0.1%)
- [ ] Performance metrics stable (LCP < 2.5s)
- [ ] No spike in error counts (Sentry)
- [ ] Database performing (Supabase dashboard)
- [ ] Users able to signup/login
- [ ] Contact form submissions working
- [ ] Admin dashboard functional
- [ ] Risk predictions responding

### Communication
- [ ] Launch announcement posted
- [ ] Status page updated
- [ ] Slack notification sent to team
- [ ] Customer notification (if applicable)

---

## Phase 4: Post-Deployment (Week 5+)

### Daily Monitoring (First Week)
- [ ] Error rate < 0.5%
- [ ] Performance metrics stable
- [ ] Database healthy
- [ ] No alerts firing
- [ ] User feedback positive

### Weekly Reviews (Ongoing)
- [ ] Performance metrics reviewed
- [ ] Error logs analyzed
- [ ] Security patches applied
- [ ] Database maintenance performed
- [ ] Cost tracking (Vercel, Railway, Supabase)

### Monthly Reviews
- [ ] Capacity planning (growth forecast)
- [ ] Security audit (dependency scan)
- [ ] Performance optimization (profile, improve)
- [ ] Documentation updates
- [ ] Disaster recovery test

---

## Rollback Plan

If critical issues arise post-deployment:

**Step 1: Immediate Actions**
- [ ] Notify team in Slack
- [ ] Create incident in Sentry/Datadog
- [ ] Assess severity (P1/P2/P3)
- [ ] Determine if rollback needed

**Step 2: Quick Fix vs. Rollback**
- If **fixable in < 15 min:** Deploy hotfix
  ```bash
  git checkout -b hotfix/issue-name
  # Make minimal fix
  git push origin hotfix/issue-name
  # Create PR, merge to main, auto-deploys
  ```
- If **requires > 15 min:** Rollback to previous version
  ```bash
  # Vercel: Click "Deployments" > Previous version > "Promote to Production"
  # Railway: git revert <commit>; railway up
  ```

**Step 3: Post-Incident**
- [ ] Root cause analysis (why did this happen?)
- [ ] Action items (how to prevent?)
- [ ] Update documentation/runbooks
- [ ] Post-mortem meeting scheduled

---

## Critical Metrics

Monitor these continuously in production:

| Metric | Target | Red Line | Check |
|--------|--------|----------|-------|
| Error Rate | < 0.1% | > 1% | Hourly |
| LCP | < 2.5s | > 5s | Continuous (Vercel) |
| API Latency (P95) | < 200ms | > 1s | Continuous (Sentry) |
| Database Response | < 100ms | > 500ms | Daily (Supabase) |
| Uptime | > 99.9% | < 99% | Daily |
| Disk Space | < 80% | > 95% | Daily |
| Memory Usage | < 80% | > 95% | Continuous (Railway) |

---

## Success Criteria

Launch is **SUCCESSFUL** when:

✅ All security checks passed
✅ Performance baselines met (LCP, API latency)
✅ Zero critical bugs in first 24 hours
✅ Error rate < 0.5% (first week)
✅ 100+ users successfully onboarded
✅ Contact form submissions received
✅ Admin dashboard functional
✅ All monitoring tools operational
✅ Team confidence high
✅ Documentation complete

---

## Contact & Escalation

**Primary On-Call:** mathireddysumanth@gmail.com

**Escalation Path:**
1. Team slack (2 min response)
2. Phone call (5 min response)
3. Manager (15 min response)

**External Support:**
- Vercel: vercel.com/support
- Railway: railway.app/support
- Supabase: supabase.com/support
- Sentry: sentry.io/support

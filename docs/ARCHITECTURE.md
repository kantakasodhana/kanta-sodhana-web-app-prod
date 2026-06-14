# System Architecture — Kantaka Śodhana

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                 Frontend (Next.js 16.2.4)                       │
│   React 19 + TypeScript + Framer Motion + Three.js              │
│                                                                 │
│   Pages: Home, Login, Signup, Admin, Demo/[id], Contact        │
│   Components: 70+ optimized with dynamic loading                │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ HTTPS + TLS 1.3
                     │ Vercel CDN
                     ↓
        ┌────────────────────────┐
        │   API Gateway          │
        │   (Vercel Edge)        │
        │   CORS Protected       │
        │   Rate Limited         │
        └────────────┬───────────┘
                     │
        ┌────────────┴─────────────────────────────────────┐
        │                                                  │
        ↓                                                  ↓
┌──────────────────────────┐                ┌──────────────────────┐
│  FastAPI Backend         │                │ Flask Auth Service   │
│  (Python 3.10)           │                │ (port 5001)          │
│  Uvicorn ASGI            │                │                      │
│                          │                │ • Registration       │
│  • Risk Scoring (XGBoost)│                │ • Login/Logout       │
│  • SHAP Explainability   │                │ • Token Management   │
│  • Document Forensics    │                │ • User Approval      │
│  • Contact Form Handler  │                │ • Session Creation   │
│  • Hospital Ranking      │                │ • Password Hashing   │
│                          │                │                      │
│  2 Replicas (Railway)    │                │ 1 Instance (Railway) │
└────────────┬─────────────┘                └──────────────────────┘
             │
             │ Connection pooling
             │ Parameterized queries
             │
             ↓
     ┌──────────────────────┐
     │  Supabase PostgreSQL │
     │  (Cloud-managed)     │
     │                      │
     │  Tables:             │
     │  • users             │
     │  • contact_submissions
     │  • sessions (optional)
     │  • audit_logs        │
     │                      │
     │  Features:           │
     │  • Real-time subscriptions
     │  • Row-level security
     │  • Automated backups │
     │  • 99.9% uptime SLA  │
     └──────────────────────┘
```

---

## Data Flow Diagrams

### 1. Contact Form Submission

```
┌─────────────────────┐
│ User Fills Form     │
│ (Frontend)          │
└──────────┬──────────┘
           │
           ↓
┌──────────────────────────────────┐
│ React Form Validation            │
│ • name: 2-100 chars              │
│ • email: valid format            │
│ • message: 10-5000 chars         │
└──────────┬───────────────────────┘
           │
           ↓
┌──────────────────────────────────┐
│ POST /api/contact                │
│ {name, email, message}           │
└──────────┬───────────────────────┘
           │
           ↓
┌──────────────────────────────────┐
│ SecureContactForm.tsx            │
│ • Pydantic validation            │
│ • Error handling                 │
│ • Loading state                  │
└──────────┬───────────────────────┘
           │
           ↓
┌──────────────────────────────────┐
│ contact_route.py                 │
│ Receives POST /api/contact       │
│ Validates request                │
│ Calls save_contact_submission()  │
└──────────┬───────────────────────┘
           │
           ↓
┌──────────────────────────────────┐
│ contact_db.py                    │
│ Creates Supabase client          │
│ Prepares submission record       │
│ {name, email, message,           │
│  submitted_at, status: "new"}    │
└──────────┬───────────────────────┘
           │
           ↓
┌──────────────────────────────────┐
│ Supabase PostgreSQL              │
│ INSERT contact_submissions       │
│ Returns success/error            │
└──────────┬───────────────────────┘
           │
           ↓
┌──────────────────────────────────┐
│ Return Response                  │
│ {success: true, message: "..."}  │
│ Clear form state                 │
│ Show success message             │
└──────────────────────────────────┘
```

### 2. User Authentication

```
┌──────────────────────┐
│ 1. REGISTRATION      │
│ User fills signup    │
│ form                 │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────────────────────┐
│ POST /api/auth/register              │
│ {username, email, password, phone}   │
└──────────┬───────────────────────────┘
           │
           ↓
┌──────────────────────────────────────┐
│ Flask Auth Service (port 5001)       │
│ • Validate email uniqueness          │
│ • Hash password (bcrypt + salt)      │
│ • Create user record                 │
│ • Set status: "pending"              │
└──────────┬───────────────────────────┘
           │
           ↓
┌──────────────────────────────────────┐
│ Supabase: INSERT users               │
│ {username, email, hashed_pwd,        │
│  approved: false, is_admin: false}   │
└──────────┬───────────────────────────┘
           │
           ↓
        ┌──────────────────────────────┐
        │ 2. ADMIN APPROVAL            │
        │ Admin views dashboard        │
        │ Clicks "Grant Access"        │
        └──────────┬───────────────────┘
                   │
                   ↓
        ┌──────────────────────────────┐
        │ UPDATE users                 │
        │ SET approved = true          │
        │ WHERE id = user_id           │
        └──────────┬───────────────────┘
                   │
                   ↓
        ┌────────────────────────────────┐
        │ 3. LOGIN                       │
        │ User enters email/password     │
        └──────────┬─────────────────────┘
                   │
                   ↓
        ┌────────────────────────────────┐
        │ POST /api/auth/login           │
        │ {email, password}              │
        └──────────┬─────────────────────┘
                   │
                   ↓
        ┌────────────────────────────────┐
        │ Flask Auth Service:            │
        │ • Find user by email           │
        │ • Verify password (bcrypt)     │
        │ • Check approval status        │
        │ • Create session token         │
        └──────────┬─────────────────────┘
                   │
                   ↓
        ┌────────────────────────────────┐
        │ SET-COOKIE: session=<token>    │
        │ Return user object             │
        │ {id, username, email, etc}     │
        └──────────┬─────────────────────┘
                   │
                   ↓
        ┌────────────────────────────────┐
        │ Frontend stores cookie         │
        │ (HttpOnly, Secure, SameSite)   │
        │ User logged in ✓               │
        └────────────────────────────────┘
```

### 3. Risk Scoring Prediction

```
┌────────────────────────────────┐
│ Authenticated User             │
│ Submits claim data             │
└──────────┬─────────────────────┘
           │
           ↓
┌────────────────────────────────┐
│ POST /predict                  │
│ {claim_amount, length_of_stay, │
│  provider_experience, ...}     │
└──────────┬─────────────────────┘
           │
           ↓
┌────────────────────────────────┐
│ Middleware: Rate Limit Check   │
│ (100 req/min per user) ✓       │
└──────────┬─────────────────────┘
           │
           ↓
┌────────────────────────────────┐
│ Pydantic Validation            │
│ Check field constraints        │
│ Type conversion                │
└──────────┬─────────────────────┘
           │
           ↓
┌────────────────────────────────┐
│ ML Pipeline:                   │
│ 1. Feature engineering         │
│ 2. Load XGBoost model (cached) │
│ 3. predict() → raw_prob        │
│ 4. Platt scaling → calib_prob  │
│ 5. Discretize → risk band      │
└──────────┬─────────────────────┘
           │
           ↓
┌────────────────────────────────┐
│ Response:                      │
│ {score: 42,                    │
│  band: "LOW_RISK",             │
│  raw_prob: 0.15,               │
│  calibrated_prob: 0.12}        │
└──────────┬─────────────────────┘
           │
           ↓
┌────────────────────────────────┐
│ Frontend receives response     │
│ Renders prediction with chart  │
│ Shows risk band with color     │
└────────────────────────────────┘
```

---

## Technology Stack

| Layer | Technology | Version | Purpose | Why Chosen |
|-------|-----------|---------|---------|-----------|
| **Frontend** | | | | |
| | Next.js | 16.2.4 | Framework | Fast builds (Turbopack), SSR, Edge functions |
| | React | 19.2.4 | UI Library | Latest hooks, concurrent features |
| | TypeScript | 5.x | Type Safety | Catch errors at compile time |
| | Framer Motion | Latest | Animations | Declarative, performant, easy to use |
| | Three.js | Latest | 3D Graphics | WebGL rendering for terrain |
| | Tailwind CSS | 4.x | Styling | Utility-first, responsive, fast |
| | Recharts | Latest | Charts | React-native charting library |
| **Backend** | | | | |
| | FastAPI | 0.109+ | API Framework | Async-native, auto-docs (Swagger/ReDoc) |
| | Python | 3.10 | Language | ML library ecosystem, readability |
| | Uvicorn | Latest | ASGI Server | High-performance async server |
| | Pydantic | 2.x | Validation | Runtime type checking, JSON schema |
| **ML** | | | | |
| | XGBoost | Latest | Risk Scoring | 99.7% AUC, interpretable |
| | SHAP | Latest | Explainability | Feature contribution analysis |
| | Gemma 3 12B | Latest | Clinical AI | Medical knowledge, 94%+ accuracy |
| | OpenCV | 4.x | Image Processing | Document tampering detection |
| **Auth** | | | | |
| | Flask | 3.x | Auth Service | Session-based, bcrypt hashing |
| | Bcrypt | Latest | Password Hashing | Secure salted hashing |
| **Database** | | | | |
| | Supabase | Managed | PostgreSQL | Real-time subscriptions, RLS, backups |
| **Deployment** | | | | |
| | Vercel | Cloud | Frontend Hosting | Native Next.js optimization |
| | Railway | Cloud | Backend Hosting | Python support, auto-scaling, logs |
| **Monitoring** | | | | |
| | Sentry | SaaS | Error Tracking | Real-time alerts, session replay |
| | Vercel Analytics | Cloud | Performance | Core Web Vitals tracking |
| | Lighthouse CI | Tool | Audit | Automated performance testing |

---

## Key Design Decisions

### 1. Microservices Architecture
- **Frontend:** Next.js (Vercel)
- **Backend API:** FastAPI (Railway)
- **Auth Service:** Flask (Railway)
- **Database:** Supabase PostgreSQL (managed)

**Rationale:** Separation of concerns, independent scaling, easier testing and deployment.

### 2. Async/Await Throughout
- FastAPI endpoints: `async def`
- Contact form submission: Promise-based
- Database queries: Async Supabase client

**Rationale:** Non-blocking I/O, better concurrency, improved latency.

### 3. ML Model Caching
- XGBoost loaded once in FastAPI lifespan
- Reused across all predictions
- Warm startup on deploy

**Rationale:** ML models are expensive to load (~2s). Caching them reduces latency from 2000ms → 100ms per prediction.

### 4. Supabase Over Custom Database
- Managed PostgreSQL (no ops overhead)
- Real-time subscriptions (admin dashboard updates live)
- Row-level security (scalable auth)
- Automated backups (reliability)

**Rationale:** Reduces infrastructure complexity, 99.9% SLA, cheaper than self-managed.

### 5. Session-Based Auth (Cookies) Over JWT
- HttpOnly cookies (can't be stolen by XSS)
- Automatic CSRF protection
- Server-side session invalidation (revocation)
- Better for browser-based apps

**Rationale:** More secure for SPA applications, simpler token lifecycle.

### 6. Rate Limiting at API Gateway
- 5 requests/minute for anonymous (/contact)
- 100 requests/minute for authenticated users
- Per-IP and per-user limits

**Rationale:** Prevents abuse, DDoS mitigation, fair resource allocation.

---

## Deployment Topology

### Development
```
laptop:3000 (Next.js dev server)
    ↓ (proxies to)
localhost:8000/api (FastAPI)
localhost:5001 (Flask auth)
```

### Staging
```
staging.kantaka-sodhana.app (Vercel)
    ↓ HTTPS
staging-api.kantaka-sodhana.app (Railway FastAPI)
staging-auth.kantaka-sodhana.app (Railway Flask)
    ↓
Supabase: staging database (separate)
```

### Production
```
kantaka-sodhana.app (Vercel, 2+ edge locations)
    ↓ HTTPS + TLS 1.3
api.kantaka-sodhana.app (Railway, 2 replicas)
auth.kantaka-sodhana.app (Railway, 1 instance)
    ↓
Supabase: production database (encrypted backups)
```

---

## Security Architecture

### Transport Security
- ✅ HTTPS enforced (HSTS header)
- ✅ TLS 1.3 minimum
- ✅ Certificate auto-renewal (Vercel/Railway)

### Authentication & Authorization
- ✅ Bcrypt password hashing (10 rounds)
- ✅ Session-based auth (HttpOnly cookies)
- ✅ CSRF protection (SameSite=Strict)
- ✅ User approval workflow (prevents spam)
- ✅ Admin role-based access (demo/admin pages)

### API Security
- ✅ CORS restricted to allowed domains
- ✅ Rate limiting (SlowAPI)
- ✅ Input validation (Pydantic)
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS prevention (React escaping)

### Data Security
- ✅ Environment variables for secrets (not in code)
- ✅ Supabase encryption at rest
- ✅ Automatic backups (Supabase)
- ✅ No sensitive data in logs
- ✅ SHA-256 hashing for document verification

### Infrastructure Security
- ✅ Network isolation (Supabase VPC)
- ✅ DDoS protection (Vercel, Railway)
- ✅ WAF (Web Application Firewall via Vercel)
- ✅ Regular security audits (SAST/DAST in CI/CD)
- ✅ Dependency scanning (npm audit, Bandit)

---

## Performance Optimization Strategy

### Frontend Optimizations
1. **Code Splitting:** Dynamic imports for heavy components
2. **Image Optimization:** Next.js Image component with lazy loading
3. **CSS-in-JS:** Tailwind with tree-shaking
4. **Caching:** Cache-Control headers via Vercel
5. **CDN:** Global edge network (Vercel)

### Backend Optimizations
1. **Async I/O:** FastAPI with async handlers
2. **Connection Pooling:** Supabase client reuse
3. **Database Indexing:** Indexes on status, created_at
4. **ML Model Caching:** Load once, reuse
5. **Request Logging:** Async logging to not block responses

### Database Optimizations
1. **Indexes:** status, submitted_at, user_id
2. **Partitioning:** None needed (data < 1GB)
3. **Replication:** Supabase manages automatically
4. **Query Analysis:** EXPLAIN ANALYZE for slow queries
5. **Backup Strategy:** Automated daily backups

---

## Scalability Plan

### Current Capacity (June 2026)
- **Concurrent Users:** 1,000
- **Requests/sec:** 100
- **Storage:** 500MB (grows ~1MB/day)
- **Database Connections:** 20-50

### Scaling Triggers
- **CPU > 80%:** Add Railway replica
- **Memory > 90%:** Increase Railway instance size
- **Database connections > 100:** Enable connection pooling
- **Storage > 100GB:** Archive old records

### Future Roadmap
- **Q3 2026:** Add caching layer (Redis)
- **Q4 2026:** Database read replicas
- **2027:** Multi-region deployment

---

## Cost Breakdown (Monthly)

| Service | Cost | Notes |
|---------|------|-------|
| Vercel (Frontend) | $25-150 | Based on bandwidth |
| Railway (Backend) | $25 + usage | 2 CPU, 4GB RAM minimum |
| Supabase (Database) | $25 | 100GB storage included |
| Sentry (Errors) | $29 | 100K events/month |
| Vercel Analytics | $0 | Included |
| **Total** | ~$100-250 | Scales with usage |

---

## Monitoring & Observability

See `docs/MONITORING.md` for detailed observability setup including:
- Error tracking (Sentry)
- Performance monitoring (Vercel Speed Insights)
- Application metrics (custom dashboards)
- Alerts and notifications (Slack)

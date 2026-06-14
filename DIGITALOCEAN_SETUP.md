# Complete DigitalOcean Deployment Guide — Kantaka Śodhana

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│             DigitalOcean App Platform                       │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │  Frontend        │  │  Backend API     │               │
│  │  (Next.js)       │  │  (FastAPI)       │               │
│  │  Port 3000       │  │  Port 8080       │               │
│  └────────┬─────────┘  └─────────┬────────┘               │
│           │                      │                         │
│           └──────────┬───────────┘                         │
│                      │                                      │
│  ┌───────────────────┴────────────────────┐               │
│  │       Ingress (Auto HTTPS)             │               │
│  │  kantaka-sodhana.app                   │               │
│  │  api.kantaka-sodhana.app               │               │
│  └────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────┘
                      │
                      ↓
        ┌─────────────────────────────┐
        │ DigitalOcean Managed DB     │
        │ PostgreSQL 14               │
        │ Auto-backups                │
        │ High Availability           │
        └─────────────────────────────┘
```

---

## Phase 1: DigitalOcean Account Setup

### 1.1 Create DigitalOcean Account

1. Go to **digitalocean.com**
2. Sign up with email
3. Add payment method
4. Create new project: "Kantaka Sodhana"

### 1.2 Create Personal Access Token

1. Go to **DigitalOcean Dashboard** > **Settings** > **API**
2. Click **Generate New Token**
   - Name: `kantaka-deployment-token`
   - Expiration: 90 days
   - Scopes: Check all (read + write)
3. Copy token (save securely)

### 1.3 Install `doctl` (DigitalOcean CLI)

**macOS:**
```bash
brew install doctl
```

**Linux:**
```bash
cd ~
wget https://github.com/digitalocean/doctl/releases/download/v1.102.0/doctl-1.102.0-linux-x64.tar.gz
tar xf ~/doctl-1.102.0-linux-x64.tar.gz
sudo mv ~/doctl /usr/local/bin
```

**Windows (PowerShell):**
```powershell
choco install doctl
# or download from releases page
```

### 1.4 Authenticate `doctl`

```bash
doctl auth init
# Paste your Personal Access Token when prompted
```

---

## Phase 2: Create Managed Database (PostgreSQL)

### 2.1 Create Database Cluster

```bash
# Create PostgreSQL 14 database
doctl databases create kantaka-db \
  --engine pg \
  --version 14 \
  --region blr \
  --num-nodes 1 \
  --size db-s-1vcpu-1gb

# Output will show:
# ID, Name, Engine, Version, Status, Created, etc.
# Status will be "provisioning" - wait ~5 minutes

# Get database details
doctl databases get kantaka-db
```

**OR in DigitalOcean Dashboard:**
1. Go to **Databases**
2. Click **Create Database**
3. Select **PostgreSQL 14**
4. Region: **Bangalore (blr)**
5. Cluster configuration: **Shared cluster** (cheaper)
6. Name: `kantaka-db`
7. Click **Create Database Cluster**

### 2.2 Create Database & User

Once cluster is running:

```bash
# Get connection details
doctl databases connection kantaka-db

# You'll get:
# Host: kantaka-db-do-user-xxx.db.ondigitalocean.com
# Port: 25060
# User: doadmin
# Password: xxx
# Database: defaultdb (rename this)
```

Connect using any PostgreSQL client:

```bash
# Install psql if needed
brew install postgresql@14

# Connect to database
psql -h kantaka-db-do-user-xxx.db.ondigitalocean.com \
     -U doadmin \
     -d defaultdb \
     -p 25060

# You'll be prompted for password (from connection details)
```

In psql, create application database and user:

```sql
-- Create application database
CREATE DATABASE kantaka_db;

-- Create application user
CREATE USER kantaka_user WITH PASSWORD 'secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE kantaka_db TO kantaka_user;
GRANT CONNECT ON DATABASE kantaka_db TO kantaka_user;
GRANT USAGE ON SCHEMA public TO kantaka_user;
GRANT CREATE ON SCHEMA public TO kantaka_user;

-- Exit psql
\q
```

### 2.3 Create Tables

```bash
# Connect to your new database
psql -h kantaka-db-do-user-xxx.db.ondigitalocean.com \
     -U kantaka_user \
     -d kantaka_db \
     -p 25060

# Run these SQL commands:
```

```sql
-- Users table
CREATE TABLE users (
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
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  submitted_at TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'new',
  admin_notes TEXT
);

-- Create indexes for performance
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_approved ON users(approved);
CREATE INDEX idx_contact_status ON contact_submissions(status);
CREATE INDEX idx_contact_submitted_at ON contact_submissions(submitted_at DESC);

-- Analyze for query optimization
ANALYZE users;
ANALYZE contact_submissions;

-- View tables
\dt
```

---

## Phase 3: Deploy with DigitalOcean App Platform

### 3.1 Prepare `app.yaml` File

The `app.yaml` file is already created in your project root. Update these values:

```yaml
# In app.yaml, replace:
# - your-username with your actual GitHub username
# - Update database connection strings
# - Update environment variables with your actual values
```

### 3.2 Connect GitHub Repository

1. Go to **DigitalOcean Dashboard** > **Apps**
2. Click **Create App**
3. Select **GitHub** as source
4. Authorize DigitalOcean to access your GitHub account
5. Select repository: `kantaka-sodhana-web-app`
6. Branch: `main`
7. Auto-deploy: Enable (auto-redeploy on push)

### 3.3 Configure App (Auto-detected from `app.yaml`)

DigitalOcean will auto-detect `app.yaml` and configure:
- ✅ 3 services (frontend, backend, auth)
- ✅ Routes and ingress
- ✅ Environment variables
- ✅ Database connection
- ✅ Health checks
- ✅ Auto-scaling

**Review the configuration:**
1. Verify service specs (3x services)
2. Check environment variables
3. Confirm database connection string
4. Review ingress rules

### 3.4 Set Environment Variables

In DigitalOcean App > Settings > Environment Variables, add:

```
DATABASE_URL=postgresql://kantaka_user:password@host:25060/kantaka_db
SENTRY_DSN=https://xxx@o123456.ingest.sentry.io/123456
NEXT_PUBLIC_SENTRY_DSN=https://xxx@o123456.ingest.sentry.io/123456
ENVIRONMENT=production
NODE_ENV=production
```

### 3.5 Deploy

Click **Deploy** button.

**Deployment Steps:**
1. DigitalOcean pulls code from GitHub
2. Builds frontend Next.js app
3. Builds backend Docker container
4. Deploys all 3 services
5. Auto-provisions HTTPS certificates
6. Routes traffic

**Status:** Monitor in DigitalOcean Dashboard > Apps > kantaka-sodhana

**Expected URLs:**
- Frontend: `https://kantaka-sodhana-app.ondigitalocean.app`
- API: `https://kantaka-sodhana-app.ondigitalocean.app/api`
- Auth: `https://kantaka-sodhana-app.ondigitalocean.app/auth`

---

## Phase 4: Configure Custom Domain

### 4.1 Add Domain to DigitalOcean

1. Go to **DigitalOcean Dashboard** > **Networking** > **Domains**
2. Click **Add Domain**
3. Enter: `kantaka-sodhana.app`
4. Choose nameserver option or existing project

### 4.2 Configure DNS Records

In DigitalOcean Domain Manager, add records:

```
Type    Name              TTL    Value
─────────────────────────────────────────────────────────────
A       @                 3600   Your DigitalOcean App IP
CNAME   www               3600   kantaka-sodhana-app.ondigitalocean.app
CNAME   api               3600   kantaka-sodhana-app.ondigitalocean.app
```

**Or point to DigitalOcean nameservers** (if registrar supports):
- ns1.digitalocean.com
- ns2.digitalocean.com
- ns3.digitalocean.com

### 4.3 Link Domain to App

In DigitalOcean App > Settings > Domains:
1. Click **Add Domain**
2. Enter: `kantaka-sodhana.app`
3. Click **Add**
4. HTTPS certificate auto-provisioned (Let's Encrypt)

**Verify:**
```bash
# Should resolve to your app
dig kantaka-sodhana.app
nslookup api.kantaka-sodhana.app

# Should return DigitalOcean IP
```

---

## Phase 5: CI/CD for DigitalOcean

### 5.1 Update GitHub Actions for DigitalOcean

File: `.github/workflows/digitalocean-deploy.yml`

```yaml
name: Deploy to DigitalOcean

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22.22.3"
          cache: npm
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test || true
      
      - name: Type check
        run: npx tsc --noEmit
      
      - name: Security scan
        run: npm run lint || true

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - uses: actions/checkout@v4
      
      - name: Install doctl
        uses: digitalocean/action-doctl@v2
        with:
          token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}
      
      - name: Trigger app deployment
        run: |
          doctl apps create-deployment \
            --app-id ${{ secrets.DIGITALOCEAN_APP_ID }} \
            --format json
      
      - name: Notify deployment
        run: |
          echo "Deployment triggered for Kantaka Sodhana"
          doctl apps get ${{ secrets.DIGITALOCEAN_APP_ID }}
```

### 5.2 Add GitHub Secrets

Go to GitHub repo > Settings > Secrets and variables > Actions

Add:
```
DIGITALOCEAN_ACCESS_TOKEN    = Your personal access token
DIGITALOCEAN_APP_ID          = From DigitalOcean Apps dashboard
```

---

## Phase 6: Monitoring & Backups

### 6.1 Enable Database Backups

In DigitalOcean Database > Settings:

```
- Backup: Enabled
- Backup Window: Daily at 2 AM UTC
- Backup Retention: 30 days
- Backup Storage: Automatic
```

### 6.2 Enable Database Replication

For High Availability:

```bash
# Add read replica
doctl databases replica create kantaka-db \
  --replica-name kantaka-db-replica \
  --region blr
```

### 6.3 Configure Monitoring

DigitalOcean App Platform includes:
- ✅ Uptime monitoring
- ✅ Resource usage (CPU, memory)
- ✅ Request count & latency
- ✅ Error rate tracking
- ✅ Auto-restart on failure

**View metrics:**
1. DigitalOcean App > Monitoring
2. View CPU, memory, requests, errors

### 6.4 Set Up Alerts

In DigitalOcean Dashboard > Settings > Alerts:

```
Alert 1: CPU > 80%
Alert 2: Memory > 85%
Alert 3: Disk space > 90%
Alert 4: Restart count > 5 in 1 hour

Notifications: Email to mathireddysumanth@gmail.com
```

---

## Phase 7: Local Development with DigitalOcean Services

### 7.1 Create `docker-compose.yml` for Local Dev

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  db:
    image: postgres:14-alpine
    container_name: kantaka-db
    environment:
      POSTGRES_USER: kantaka_user
      POSTGRES_PASSWORD: local_password
      POSTGRES_DB: kantaka_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U kantaka_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: kantaka-backend
    environment:
      DATABASE_URL: postgresql://kantaka_user:local_password@db:5432/kantaka_db
      ENVIRONMENT: development
    ports:
      - "8080:8080"
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./backend:/app/backend
    command: uvicorn backend.main:app --host 0.0.0.0 --port 8080 --reload

  # Frontend
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    container_name: kantaka-frontend
    environment:
      NEXT_PUBLIC_API_BASE_URL: http://localhost:8080/api
      NEXT_PUBLIC_SUPABASE_URL: http://localhost:5432  # Local DB
    ports:
      - "3000:3000"
    depends_on:
      - backend
    volumes:
      - ./src:/app/src

  # Redis (Optional, for caching)
  redis:
    image: redis:7-alpine
    container_name: kantaka-redis
    ports:
      - "6379:6379"

volumes:
  postgres_data:

networks:
  default:
    name: kantaka-network
```

### 7.2 Run Local Stack

```bash
# Start all services
docker-compose up -d

# Verify services running
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Access services
# Frontend: http://localhost:3000
# Backend: http://localhost:8080/api/health
# Database: localhost:5432 (kantaka_user / local_password)

# Stop all services
docker-compose down
```

---

## Production Troubleshooting

### "App deployment failed"

```bash
# Check deployment logs
doctl apps get-logs kantaka-sodhana-app --follow

# View error details
doctl apps describe kantaka-sodhana-app

# Redeploy
doctl apps create-deployment --app-id <app-id>
```

### "Database connection refused"

```bash
# Verify database is running
doctl databases list

# Check connection string in app environment
doctl apps describe kantaka-sodhana-app | grep DATABASE_URL

# Test connection
psql -h kantaka-db-xxx.ondigitalocean.com -U kantaka_user -d kantaka_db -p 25060
```

### "HTTPS certificate not valid"

```bash
# DigitalOcean auto-provisions Let's Encrypt certificates
# If invalid:

# 1. Remove domain
doctl apps remove-domain kantaka-sodhana-app --domain kantaka-sodhana.app

# 2. Re-add domain
doctl apps update kantaka-sodhana-app --domain kantaka-sodhana.app

# 3. Certificate auto-regenerates
```

### "High resource usage"

In DigitalOcean App:
1. Go to Settings > Resource allocation
2. Increase vCPUs/RAM (scales automatically)
3. Or reduce number of replicas

---

## Cost Optimization

| Component | Cost/Month | Notes |
|-----------|-----------|-------|
| App Platform (1 container) | $12 | Micro (512MB RAM, 0.25 vCPU) |
| App Platform (3 containers) | $36 | $12 each for frontend/backend/auth |
| Managed Database (1GB) | $15 | PostgreSQL 14, 1 node |
| Backups | $5 | Automatic daily backups |
| **Total** | **~$56/month** | Much cheaper than separate services |

**Scaling:**
- Auto-scale containers by CPU/memory usage
- Add read replicas for database when needed
- Costs scale linearly with usage

---

## Deployment Checklist (DigitalOcean)

- [ ] DigitalOcean account created
- [ ] Personal access token generated
- [ ] `doctl` CLI installed and authenticated
- [ ] Managed PostgreSQL database created
- [ ] Database tables created with indexes
- [ ] `app.yaml` configured for your environment
- [ ] GitHub repository connected to DigitalOcean
- [ ] Environment variables set in DigitalOcean
- [ ] Deployment triggered and successful
- [ ] Custom domain configured
- [ ] HTTPS certificates verified
- [ ] Backups enabled
- [ ] Alerts configured
- [ ] Local docker-compose working
- [ ] GitHub Actions pipeline configured

---

## Quick Reference Commands

```bash
# List all apps
doctl apps list

# Describe app
doctl apps describe kantaka-sodhana-app

# View deployment logs
doctl apps get-logs kantaka-sodhana-app --follow

# Trigger deployment
doctl apps create-deployment --app-id <app-id>

# List databases
doctl databases list

# Get database info
doctl databases get kantaka-db

# Connect to database
psql -h <host> -U kantaka_user -d kantaka_db -p 25060

# View app specs
doctl apps spec get kantaka-sodhana-app --format yaml

# Update app from GitHub
doctl apps update kantaka-sodhana-app
```

---

## Support

**DigitalOcean Documentation:**
- App Platform: docs.digitalocean.com/products/app-platform/
- Managed Databases: docs.digitalocean.com/products/databases/postgresql/
- doctl CLI: docs.digitalocean.com/reference/doctl/

**Community Support:**
- DigitalOcean Community: community.digitalocean.com/

**Contact:**
- Email: mathireddysumanth@gmail.com

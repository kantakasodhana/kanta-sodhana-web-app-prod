# Kantaka Sodhana — Comprehensive Architectural Documentation

**Version:** 1.0  
**Last Updated:** June 2026  
**Audience:** New developers and team members joining the Kantaka Sodhana project  
**Purpose:** Complete reference guide for understanding system architecture, structure, and workflows

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Directory and File Structure](#directory-and-file-structure)
4. [Technology Stack](#technology-stack)
5. [Frontend Components and Purposes](#frontend-components-and-purposes)
6. [Backend Services](#backend-services)
7. [Data Flow](#data-flow)
8. [Configuration and Environment](#configuration-and-environment)
9. [Key Workflows](#key-workflows)
10. [Integration Points](#integration-points)
11. [Setup and Development](#setup-and-development)

---

## Project Overview

### What Is Kantaka Sodhana?

Kantaka Sodhana is a modern web application built to review medical documents and detect fraudulent or tampered documents. The name comes from an ancient Indian governance concept meaning "removing thorns" — in this context, removing fraudulent documents from the healthcare ecosystem.

**Core Purpose:** Verify that medical documents are completely authentic and have not been altered in any way.

**Key Goals:**
- Detect document forgery in medical records
- Identify document tampering and unauthorized modifications
- Verify document authenticity through cryptographic hashing (SHA-256)
- Provide an engaging, professional user interface for fraud detection
- Support multiple fraud detection verification methods

### Who Uses It?

The platform is designed for healthcare institutions, medical document reviewers, and fraud detection specialists who need to authenticate medical records at scale.

---

## System Architecture

### High-Level Architecture Overview

Kantaka Sodhana follows a **modern full-stack web application pattern** with clear separation between frontend (user interface) and backend (processing engine):

```
┌─────────────────────────────────────────────────────────────┐
│                    END USER BROWSER                         │
│          (Next.js Frontend - Web Application)               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ • Marketing Pages (Homepage, Team, Contact)            │ │
│  │ • Dashboard (Real-time metrics and alerts)             │ │
│  │ • Document Upload Interface                            │ │
│  │ • Authentication Pages (Login, Signup)                 │ │
│  │ • 3D Visualizations and Interactive Elements           │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────┬──────────────────────────────────────────────┘
               │ HTTP/HTTPS REST API Calls
               │ WebSocket (Real-time updates)
               │
┌──────────────▼──────────────────────────────────────────────┐
│              BACKEND SERVICE LAYER                          │
│          (Python/FastAPI Microservices)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ CORE SERVICES:                                       │  │
│  │ • Main Backend (FastAPI) - Orchestration & APIs     │  │
│  │ • Authentication Service - User verification        │  │
│  │ • Document Forgery Detection - Forgery analysis     │  │
│  │ • Duplicate/Tampering Detection - Change detection  │  │
│  │ • QR Code Verification - Document validation        │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────┬──────────────────────────────────────────────┘
               │ Database Queries
               │ File Storage
               │
┌──────────────▼──────────────────────────────────────────────┐
│            DATA & STORAGE LAYER                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ • Database (PostgreSQL or similar)                   │  │
│  │ • File Storage (Document uploads)                    │  │
│  │ • Cache (Redis for performance)                      │  │
│  │ • Hash Registry (SHA-256 hashes for verification)   │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

### Architectural Pattern: Microservices with Monolithic Frontend

The system uses a **microservices architecture for the backend** while maintaining a **monolithic frontend** built with Next.js:

- **Frontend (Monolithic):** Single Next.js application handles all user-facing pages, dashboards, and interactions
- **Backend (Microservices):** Multiple specialized Python services each handle a specific fraud-detection concern:
  - Authentication (user login/verification)
  - Document forgery detection (image analysis, pattern matching)
  - Tampering detection (change detection, duplicate identification)
  - QR code verification (barcode validation)
  - Main orchestrator (coordinates requests between services)

**Why This Pattern?**
- **Scalability:** Each detection service can be scaled independently based on demand
- **Maintainability:** Changes in one verification method don't affect others
- **Specialization:** Each service focuses on one type of fraud detection
- **Flexibility:** Services can be written in different languages or frameworks
- **Resilience:** Failure in one service doesn't crash the entire system

---

## Directory and File Structure

### Root-Level Organization

```
kanta-sodhana-web-app/
├── src/                          # Frontend source code (Next.js)
├── backend/                       # Main backend service
├── services/                      # Specialized microservices
│   ├── kantaka-auth/            # Authentication service
│   ├── doc-forgery/             # Document forgery detection
│   ├── dup-tamper/              # Duplicate & tampering detection
│   └── qr-verify/               # QR code verification
├── public/                        # Static assets
├── scripts/                       # Utility and setup scripts
├── package.json                   # Node.js dependencies
├── next.config.ts                # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── BUILDPLAN.md                  # Frontend build specification
├── handoff.md                     # Project handoff documentation
├── ARCHITECTURAL_DOCUMENTATION.md # This file
└── .gitignore, .node-version, etc.
```

### Frontend Source Structure (`src/`)

The frontend is organized by feature and responsibility:

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout - shared across all pages
│   │                            # (Navigation, Footer, Providers, Global Components)
│   ├── page.tsx                 # Homepage - main marketing site
│   ├── globals.css              # Global styles, CSS variables, themes
│   ├── not-found.tsx            # Custom 404 error page
│   ├── login/page.tsx           # User login page
│   ├── signup/page.tsx          # User registration page
│   ├── dashboard/page.tsx       # Main dashboard with metrics
│   ├── achievements/page.tsx    # Awards and achievements showcase
│   ├── contact/page.tsx         # Contact form page
│   ├── team/page.tsx            # Team member display
│   ├── what-we-do/page.tsx      # Company philosophy and approach
│   └── what-we-build/page.tsx   # Technical stack breakdown
│
├── components/                  # Reusable React components
│   ├── Navigation.tsx           # Top navigation bar with hash-link anchors
│   ├── Footer.tsx               # Page footer with branding and links
│   ├── ThemeProvider.tsx        # Dark/light theme context wrapper
│   ├── ThemeToggle.tsx          # Theme switching button
│   ├── Preloader.tsx            # Loading spinner shown on page load
│   ├── ClientCursor.tsx         # Client-side wrapper for custom cursor
│   ├── CustomCursor.tsx         # Custom orange dot cursor with trail
│   ├── GrainOverlay.tsx         # Film grain texture overlay
│   ├── ScrollProgress.tsx       # Progress bar at top during scroll
│   ├── PageTransition.tsx       # Route transition animations
│   │
│   ├── Hero Components/
│   │   ├── EnterGate.tsx        # Full-screen CRT entry gate animation
│   │   ├── GLSLTerrain.tsx      # WebGL2 terrain visualization
│   │   └── SweepText.tsx        # Rotating hero headline
│   │
│   ├── UI Elements (12 Components)/
│   │   ├── RulerCarousel.tsx    # Achievements carousel with ruler marks
│   │   ├── SegmentedControl.tsx # Tab switcher with animations
│   │   ├── TeamShowcase.tsx     # Photo grid for team members
│   │   ├── Accordion.tsx        # Expandable accordion panels
│   │   ├── ProgressiveBlur.tsx  # Directional blur effect
│   │   ├── ScrollCard.tsx       # Scroll-triggered card reveals
│   │   ├── TextRotate.tsx       # Animated text word cycling
│   │   ├── EnergyRing.tsx       # Animated rings visualization
│   │   ├── ProcessShowcase.tsx  # Process steps with visualizations
│   │   ├── CountUp.tsx          # Animated number counter
│   │   └── MagneticButton.tsx   # Button with cursor-pull effect
│   │
│   └── Other Components/
│       └── SealStamp.tsx        # Circular badge/watermark element
│
├── lib/                         # Utility functions and constants
│   ├── utils.ts                # Helper functions (cn() for classnames)
│   ├── theme.ts                # Theme color tokens and definitions
│   └── constants.ts            # Site content, navigation links, team data
│
└── hooks/                       # Custom React hooks
    ├── useScrollVelocity.ts    # Detects scroll speed for effects
    ├── useMagnetic.ts          # Magnetic pull effect for UI elements
    ├── useReducedMotion.ts     # Respects prefers-reduced-motion
    └── useBelowFold.ts         # Defers rendering below-fold content
```

### Backend Structure

The backend is organized as microservices, each in its own directory:

```
services/
│
├── backend/                     # Main orchestrator service
│   ├── main.py                 # FastAPI application entry point
│   ├── app/
│   │   ├── routes/             # API endpoint definitions
│   │   ├── models/             # Pydantic data models
│   │   ├── services/           # Business logic
│   │   └── utils/              # Helper functions
│   ├── venv/                   # Python virtual environment
│   └── requirements.txt        # Python dependencies
│
├── kantaka-auth/               # Authentication service
│   ├── app.py                  # Flask/FastAPI application
│   ├── venv/
│   └── requirements.txt
│
├── doc-forgery/                # Document forgery detection
│   ├── main.py                 # Service entry point
│   ├── models/                 # ML models for forgery detection
│   ├── venv/
│   └── requirements.txt
│
├── dup-tamper/                 # Duplicate and tampering detection
│   ├── main.py                 # Service entry point
│   ├── detectors/              # Detection algorithms
│   ├── venv/
│   └── requirements.txt
│
└── qr-verify/                  # QR code verification
    ├── main.py                 # Service entry point
    ├── validators/             # QR validation logic
    ├── venv/
    └── requirements.txt
```

---

## Technology Stack

### Frontend (User Interface)

The frontend is built with modern web technologies focused on performance and visual excellence:

| Technology | Version | Purpose | Why Chosen |
|------------|---------|---------|-----------|
| **Next.js** | 16.2.4 | React framework with SSR/SSG | Built-in routing, server components, optimal performance |
| **React** | 19.2.4 | UI library | Modern component model, hooks, excellent ecosystem |
| **TypeScript** | 5.x | Type-safe JavaScript | Catches errors early, improves code maintainability |
| **Tailwind CSS** | 4.x | Utility-first CSS | Rapid styling, design consistency, responsive design |
| **Framer Motion** | 12.x | Animation library | Smooth transitions, scroll effects, gesture handling |
| **Three.js** | 0.184 | 3D graphics (WebGL) | GPU-accelerated 3D visualizations for hero section |
| **Lucide React** | 1.16 | Icon library | Modern, customizable SVG icons |
| **Radix UI** | 1.x | Headless UI primitives | Accessible, unstyled component foundation |
| **Class Variance Authority** | 0.7.1 | Component styling | Manages component variants and states |

**Performance Optimizations Built In:**
- Turbopack for faster development builds
- Next.js automatic code splitting
- Image optimization
- Font loading optimization (Geist font)
- Lazy loading for below-fold components

### Backend (Data Processing & Verification)

The backend services use Python for fast prototyping and access to ML libraries:

| Technology | Purpose | Why Chosen |
|------------|---------|-----------|
| **Python** | Backend language | Excellent ML/data science libraries, rapid development |
| **FastAPI** | Main service framework | High performance, auto-generated API docs, type hints |
| **Pydantic** | Data validation | Type safety, automatic validation, serialization |
| **PyJWT** | Authentication | Secure token-based user authentication |
| **PIL/Pillow** | Image processing | Document image manipulation and analysis |
| **OpenCV** | Computer vision | Pattern detection, image analysis for forgery detection |
| **pandas** | Data processing | Structured data handling and analysis |
| **scikit-learn** | Machine learning | Training and inference for detection models |
| **PyYAML** | Configuration | Managing environment-specific settings |

### Critical Dependency for Tamper Detection

```
SHA-256 Hashing (Mandatory)
```

Per project requirements, all document tampering detection **MUST** use **SHA-256 cryptographic hashing**. This is enforced at code review time and cannot be substituted with other hashing algorithms.

Example workflow:
1. Document uploaded → System computes SHA-256 hash
2. Hash stored in database
3. Later, document re-hashed → Compared with original
4. Any change (even single pixel) produces different hash → Tampering detected

### Development Tools

| Tool | Purpose |
|------|---------|
| **npm** | JavaScript package manager |
| **Node.js** | JavaScript runtime (v22.0.0) |
| **Git** | Version control |
| **ESLint** | JavaScript/TypeScript linting |
| **Vitest** | Unit testing framework |
| **Playwright** | End-to-end testing |
| **Tailwind PostCSS** | CSS preprocessing |

---

## Frontend Components and Purposes

### Core Infrastructure Components

These components provide the foundation for all pages:

**Navigation.tsx**
- **Purpose:** Top navigation bar with theme toggle, clock, and hash-based anchors
- **Key Features:**
  - Magnetic pill design that adapts to user scroll direction
  - Live clock showing current time
  - Dark/light theme toggle button
  - Links to: Home, Process, Stack, Wins, Team, Contact
  - Login/Sign Up buttons for user authentication
  - Auto-hides on scroll down, shows on scroll up
  - Active section highlighting based on scroll position
- **Data Dependencies:** `NAV_LINKS` from `lib/constants.ts`

**Footer.tsx**
- **Purpose:** Page footer with branding, company info, and CTAs
- **Key Features:**
  - Large Devanagari script brand mark
  - Company coordinates
  - Links to main sections
  - "Built with" technology credits
  - Live pulse animation
- **Design Notes:** Designed to complement hero and build brand consistency

**ThemeProvider.tsx & ThemeToggle.tsx**
- **Purpose:** Implement dark/light theme switching
- **Mechanism:** CSS variables change based on `data-theme` attribute on `<html>`
- **Theme Variables:**
  - Dark: `#030305` background, `#FF4D00` orange accent
  - Light: `#F5F0E8` background, `#C7511F` accent
- **Scope:** Affects all colors across the entire site via CSS custom properties

**Preloader.tsx**
- **Purpose:** Show loading animation while page hydrates
- **Behavior:** Displays 4 pulsing orange dots for 1400ms, then fades
- **Why Needed:** Hides the "flash of white" that occurs while Next.js initializes

**CustomCursor.tsx & ClientCursor.tsx**
- **Purpose:** Replace default cursor with custom orange dot + ring
- **Technical Note:** `ClientCursor.tsx` is a `"use client"` wrapper because `layout.tsx` is a Server Component
- **Interactions:**
  - Dispatches custom `kvs-cursor-move` event that other components can listen to
  - Creates visual feedback for user interactions
  - Adjusts style based on hovered element

**GrainOverlay.tsx**
- **Purpose:** Apply subtle film grain texture across the entire page
- **Implementation:** CSS-based overlay with `pointer-events-none` so it doesn't interfere with clicks
- **Visual Effect:** Adds cinematic quality and hides banding artifacts

**ScrollProgress.tsx**
- **Purpose:** Show user progress through page via horizontal progress bar
- **Implementation:** Thin orange line at top that fills from left to right as user scrolls
- **Trigger:** Watches scroll position and window height

**PageTransition.tsx**
- **Purpose:** Animate route changes with Framer Motion
- **Animation:** CRT flash effect between pages
- **Benefit:** Smooth, professional page transitions

### Hero Section Components

These components create the dramatic entry experience:

**EnterGate.tsx**
- **Purpose:** Full-screen CRT monitor effect with interactive ASCII/Sanskrit grid
- **Interaction Model:**
  - Shows on first visit (gated by `sessionStorage`)
  - Mouse movement maps to grid coordinates
  - Clicking cells triggers fill animation → white flash → decay animation
  - Click anywhere to "open the gate" and proceed to site
- **Visual Style:** Retro computer aesthetic with green monochrome aesthetic
- **Technical:** Raw canvas rendering for maximum performance

**GLSLTerrain.tsx**
- **Purpose:** Render 3D terrain background using WebGL2 shaders
- **Visual Effects:**
  - Procedural Perlin noise hills in the background
  - Orange sonar sweep animation (concentric circles expanding)
  - Mouse-following illumination glow (orange highlight ring)
  - Fingerprint-like pattern overlay
- **Performance:** Hardware-accelerated via WebGL, minimal JavaScript overhead
- **Customization:** GLSL shader source code can be modified to change visual style

**SweepText.tsx**
- **Purpose:** Rotate through hero headline taglines on timed interval
- **Animation:** Words slide up and down on interval
- **Content:** Cycles through key brand messages (defined in `page.tsx`)

### UI Component Library (12 Components)

These are specialized interactive elements used throughout the site:

**1. RulerCarousel.tsx**
- **Use Case:** Achievements section - displays NHA hackathon wins
- **Interaction:** Drag to scroll, spring physics for momentum
- **Features:** Dot pagination, keyboard arrow navigation
- **Data Structure:** Array of achievement cards with place, event, problem statement

**2. SegmentedControl.tsx**
- **Use Case:** Stack section - switch between Data Pipelines, Training, Deployment
- **Animation:** Pill indicator animates to selected tab
- **Implementation:** DOM measurement (`offsetLeft`, `offsetWidth`) for precise alignment
- **Key Issue Fixed:** Previous versions used CSS % widths which misaligned - now uses real DOM measurements

**3. TeamShowcase.tsx**
- **Use Case:** Team section - display team members with photos
- **Interaction:** Click on card to reveal social links
- **Visual:** Grayscale by default, color on hover/click
- **Data Structure:** Array of team member objects with name, role, image URL, social links

**4. Accordion.tsx**
- **Use Case:** FAQ or detailed explanations (Philosophy section)
- **Library:** Built on Radix UI accordion for accessibility
- **Features:** Single or multiple panels can be open simultaneously
- **Styling:** Custom Tailwind styling applied over Radix primitives

**5. ProgressiveBlur.tsx**
- **Use Case:** Hero transitions and panel edges
- **Effect:** Directional backdrop blur that fades from opaque to transparent
- **CSS:** Uses `backdrop-filter: blur()` with gradient mask
- **Performance:** Uses GPU-accelerated CSS filters

**6. ScrollCard.tsx**
- **Use Case:** Wraps all major section headings and card content
- **Trigger:** Framer Motion `whileInView` - reveals when scrolled into view
- **Animation:** Opacity fade-in + translate from top/bottom
- **Benefit:** Provides consistent reveal animation across site without repetitive code

**7. TextRotate.tsx**
- **Use Case:** Contact section heading
- **Animation:** Cycles through word variations with slide-up/down motion
- **Implementation:** Framer Motion `AnimatePresence` with timed intervals

**8. EnergyRing.tsx**
- **Use Case:** Background animation for contact section
- **Visual:** 3 concentric animated rings with rotating arcs
- **Implementation:** Raw WebGL canvas with orange glow effect
- **Purpose:** Adds dynamic, technical feeling to contact area

**9. ProcessShowcase.tsx**
- **Use Case:** Process section explaining fraud detection pipeline
- **Layout:** Split panel - left side numbered steps, right side canvas visualization
- **Steps:** Ingest → Detect → Trace → Govern (each with unique animation)
- **Interactive:** Clicking step number updates the right panel visualization
- **Canvases:** Each step has a unique animated canvas visualization

**10. CountUp.tsx**
- **Use Case:** Stats section - animated number counters
- **Trigger:** IntersectionObserver detects when stat appears in viewport
- **Animation:** Easing cubic ease-out from 0 to target number
- **Performance:** Runs for ~1.5s once per page load

**11. MagneticButton.tsx**
- **Use Case:** CTA buttons throughout site
- **Interaction:** Cursor pull effect - button slightly moves toward mouse cursor
- **Benefit:** Engaging, playful interaction that feels responsive
- **Event Listener:** Responds to custom `kvs-cursor-move` event from CustomCursor

**12. (Implied Components)**
- Various component utilities like `SealStamp.tsx` for badge elements
- Layout wrappers like `HorizontalScroll.tsx` for section-specific interactions

### Component Usage Patterns

**Scroll-Triggered Reveals:**
Most section headings and cards use `ScrollCard.tsx` wrapper:
```tsx
<ScrollCard delay={0.2} direction="up">
  <h2>Section Title</h2>
</ScrollCard>
```

**Theme-Aware Styling:**
Components use CSS variables for colors so they automatically adapt to dark/light theme:
```tsx
className="bg-[var(--bg)] text-[var(--text)]"
```

**Conditional Client Rendering:**
Components that need browser APIs (like mouse tracking) use `"use client"` directive:
```tsx
"use client"
import { useEffect, useState } from "react"
```

---

## Backend Services

### Service Architecture

Each backend service is a **separate Python application** that can be deployed and scaled independently. Services communicate with the frontend via REST APIs and with each other via HTTP calls or message queues.

### Main Backend Service

**Location:** `services/backend/`  
**Framework:** FastAPI  
**Port:** 8000  
**Responsibilities:**
- Receive document uploads from frontend
- Coordinate requests to specialized detection services
- Aggregate results and return findings to frontend
- Manage database operations (document metadata, results)
- Serve dashboard metrics and status

**Key Endpoints (typical REST API):**
```
POST   /api/documents/upload          - Accept document file
GET    /api/documents/{id}            - Retrieve document details
POST   /api/documents/{id}/verify     - Trigger verification
GET    /api/results/{id}              - Get verification results
GET    /api/dashboard/metrics         - Get system statistics
POST   /api/auth/login                - User authentication
```

**Data Models:**
```python
class Document(BaseModel):
    id: str                          # Unique identifier
    filename: str                    # Original filename
    upload_date: datetime            # When document was uploaded
    sha256_hash: str                 # SHA-256 hash of document
    status: str                      # "pending", "processing", "completed"
    results: Dict                    # Verification results

class VerificationResult(BaseModel):
    document_id: str
    is_authentic: bool               # Overall verdict
    forgery_score: float             # 0.0-1.0 (higher = more forged)
    tampering_detected: bool         # Changed from original?
    qr_valid: bool                   # QR code validation result
    timestamp: datetime
```

### Authentication Service

**Location:** `services/kantaka-auth/`  
**Framework:** Flask or FastAPI  
**Responsibilities:**
- User login/registration
- Session token generation (JWT)
- Password hashing and validation
- User permissions and roles

**Typical Flow:**
1. User enters credentials on `/login` page
2. Frontend sends POST to `kantaka-auth/login`
3. Service validates against user database
4. Returns JWT token if credentials valid
5. Frontend stores token in localStorage/cookies
6. Subsequent requests include token in `Authorization` header

### Document Forgery Detection Service

**Location:** `services/doc-forgery/`  
**Framework:** FastAPI  
**Responsibilities:**
- Analyze document images for signs of forgery
- Detect inconsistencies in formatting, fonts, spacing
- Compare against known authentic document patterns
- Return forgery score and suspicious regions

**Detection Methods:**
- Image pixel-level analysis
- Font inconsistency detection
- Layout pattern matching
- Metadata examination
- Historical comparison with authentic samples

**Input:** Document image file  
**Output:** 
```json
{
  "forgery_probability": 0.85,
  "suspicious_regions": [
    {"x": 100, "y": 200, "width": 50, "height": 30, "reason": "Font inconsistency"}
  ],
  "analysis_time_ms": 1230
}
```

### Duplicate & Tampering Detection Service

**Location:** `services/dup-tamper/`  
**Framework:** FastAPI  
**Responsibilities:**
- Detect if document has been modified from original
- Find near-duplicate documents in system
- Identify suspicious content changes

**Critical Requirement:** Uses **SHA-256 hashing** for tampering detection
```python
import hashlib

def compute_hash(document_bytes: bytes) -> str:
    return hashlib.sha256(document_bytes).hexdigest()

def check_tampering(original_hash: str, current_hash: str) -> bool:
    return original_hash != current_hash  # Any change detected
```

**Duplicate Detection:**
- Compares document against historical database
- Uses fuzzy matching to find near-duplicates
- Reports similarity score

**Output:**
```json
{
  "is_tampered": false,
  "original_hash": "a3b2c1d0e9f8g7h6i5j4k3l2m1n0o9p8",
  "current_hash": "a3b2c1d0e9f8g7h6i5j4k3l2m1n0o9p8",
  "duplicate_matches": [
    {"document_id": "doc_123", "similarity": 0.98}
  ]
}
```

### QR Code Verification Service

**Location:** `services/qr-verify/`  
**Framework:** FastAPI  
**Responsibilities:**
- Detect and decode QR codes in documents
- Validate QR code integrity
- Verify QR payload against document content
- Check if QR code is authentic and matches document

**Validation Steps:**
1. Scan document image for QR code patterns
2. Decode QR data
3. Verify checksum/error correction data
4. Compare QR content with document metadata
5. Check QR against known valid patterns

**Output:**
```json
{
  "qr_found": true,
  "qr_valid": true,
  "qr_data": "https://medical.registry.gov/doc/abc123xyz",
  "matches_document": true,
  "confidence": 0.99
}
```

---

## Data Flow

### User Journey: Document Verification

Here's how data flows through the system when a user verifies a document:

```
STEP 1: UPLOAD
┌────────────────────────┐
│  User Browser          │
│  Selects PDF file      │
│  Clicks Upload         │
└────────────┬───────────┘
             │ HTTP POST /api/documents/upload
             │ (file bytes, user_id, session_token)
             ▼
┌────────────────────────┐
│  Main Backend          │
│  - Receives file       │
│  - Computes SHA-256    │
│  - Stores file locally │
│  - Creates DB record   │
│  - Returns document_id │
             │ HTTP 200 + {document_id}
             ▼
┌────────────────────────┐
│  User Browser          │
│  Stores document_id    │
│  Shows loading state   │
└────────────────────────┘

STEP 2: TRIGGER VERIFICATION
┌────────────────────────┐
│  Main Backend          │
│  Receives POST         │
│  /documents/{id}/verify│
│  - Reads file from     │
│    storage             │
│  - Queues work         │
│  - Returns "processing"│
└────────────┬───────────┘
             │ Spawns async tasks
             │
    ┌────────┴────────┬────────────┬──────────────┐
    │                 │            │              │
    ▼                 ▼            ▼              ▼
┌─────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Forgery     │ │Dup/      │ │QR        │ │Hash      │
│Detection    │ │Tamper    │ │Verify    │ │Validate  │
│Service      │ │Service   │ │Service   │ │(local)   │
└──────┬──────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
       │             │            │            │
       │             │            │            │
       │ Forgery     │ Tampering  │ QR Valid   │ Hash
       │ Score: 0.15 │ Detected:  │ Result:    │ Matches:
       │             │ NO         │ YES        │ YES
       │             │            │            │
       └─────────────┴────────────┴────────────┘
                     │
                     │ Aggregates results
                     ▼
        ┌────────────────────────┐
        │  Main Backend          │
        │  - Combines results    │
        │  - Computes final      │
        │    verdict (authentic?)│
        │  - Stores in database  │
        └────────────┬───────────┘
                     │ Updates DB record status="completed"

STEP 3: RETRIEVE RESULTS
┌────────────────────────┐
│  User Browser          │
│  Polls for results     │
│  GET /results/{id}     │
└────────────┬───────────┘
             │
             ▼
┌────────────────────────┐
│  Main Backend          │
│  Retrieves from DB     │
│  Returns JSON          │
└────────────┬───────────┘
             │
             │ Returns:
             │ {
             │   document_id: "doc_xyz",
             │   is_authentic: true,
             │   forgery_score: 0.15,
             │   tampering_detected: false,
             │   qr_valid: true,
             │   timestamp: "2026-06-10T10:30:00Z"
             │ }
             ▼
┌────────────────────────┐
│  User Browser          │
│  Displays results      │
│  Shows verdict         │
│  Updates dashboard     │
└────────────────────────┘
```

### Component Data Flow (Frontend)

```
page.tsx (Main Page)
│
├─→ Documents uploaded via form
│   └─→ POST /api/documents/upload
│       └─→ Backend returns document_id
│           └─→ Stored in React state
│
├─→ Results polled periodically
│   └─→ GET /api/results/{document_id}
│       └─→ Data displayed in Dashboard
│
├─→ Navigation state
│   └─→ Active section tracked via scroll
│       └─→ Nav.tsx highlights active link
│
└─→ Theme state
    └─→ ThemeProvider manages dark/light
        └─→ CSS variables update all colors
```

### Database Schema (Conceptual)

```sql
-- Documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    filename VARCHAR(255),
    sha256_hash VARCHAR(64),              -- For tampering detection
    file_path TEXT,                       -- Where file stored
    upload_timestamp TIMESTAMP,
    verification_status VARCHAR(50),       -- pending|processing|completed
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Results table
CREATE TABLE verification_results (
    id UUID PRIMARY KEY,
    document_id UUID REFERENCES documents(id),
    is_authentic BOOLEAN,
    forgery_score FLOAT,                  -- 0.0-1.0
    tampering_detected BOOLEAN,
    qr_valid BOOLEAN,
    forgery_details JSONB,                -- Detailed analysis
    tampering_details JSONB,
    qr_details JSONB,
    verified_at TIMESTAMP
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    organization VARCHAR(255),
    created_at TIMESTAMP,
    last_login TIMESTAMP
);
```

---

## Configuration and Environment

### Environment Variables

The project uses environment variables to control behavior across different deployments:

**Frontend Configuration (`.env.local` or `.env.production`)**

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:5000

# Feature Flags
NEXT_PUBLIC_ENABLE_DASHBOARD=true
NEXT_PUBLIC_ENABLE_CONTACT_FORM=true

# Monitoring
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

**Note:** `NEXT_PUBLIC_*` prefix makes these accessible in the browser. Never expose secrets this way.

**Backend Configuration (`services/backend/.env`)**

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/kantaka_sodhana

# JWT Secrets
JWT_SECRET_KEY=your-very-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# Service URLs
AUTH_SERVICE_URL=http://localhost:5000
FORGERY_SERVICE_URL=http://localhost:5001
TAMPER_SERVICE_URL=http://localhost:5002
QR_SERVICE_URL=http://localhost:5003

# File Storage
UPLOAD_DIRECTORY=/tmp/kantaka_uploads
MAX_FILE_SIZE_MB=50

# Logging
LOG_LEVEL=INFO
```

### Development vs. Production

| Aspect | Development | Production |
|--------|-------------|------------|
| **API Base URL** | `http://localhost:8000` | `https://api.kantaka-sodhana.com` |
| **Database** | Local PostgreSQL | Managed cloud database |
| **File Storage** | Local `/tmp/` | S3 or cloud storage |
| **Logging** | Console output, verbose | Structured logs, silent |
| **CORS** | Permissive (localhost) | Restricted to frontend domain |
| **SSL/TLS** | Not required | Required (`https://`) |
| **Caching** | Minimal | Redis cache layer |

### Node.js and Python Versions

**Node.js:** v22.0.0 - v22.x (locked in `.nvmrc`)  
**Python:** 3.10+ (per FastAPI best practices)

To check versions:
```bash
node --version          # Should be v22.x.x
python3 --version       # Should be 3.10 or higher
```

---

## Key Workflows

### Workflow 1: Document Verification (User Perspective)

This is the primary user action:

```
1. User visits site
   └─→ EnterGate interactive element shown
       └─→ User clicks to enter
           └─→ Homepage loads with hero

2. User navigates to Dashboard
   └─→ Or finds Upload section on page
       └─→ Clicks "Upload Document"

3. User selects PDF file
   └─→ Clicks submit
       └─→ Frontend sends to backend
           └─→ Backend computes SHA-256 hash
               └─→ Creates database record
                   └─→ Returns document_id to frontend

4. Frontend shows "Verifying..."
   └─→ Polls backend for status
       └─→ When complete, shows results:
           ├─→ Forgery score (0-100%)
           ├─→ Tampering detected? (yes/no)
           ├─→ QR valid? (yes/no)
           └─→ Overall verdict (Authentic/Suspicious/Forged)

5. User can:
   └─→ View detailed analysis
   └─→ Download report
   └─→ Compare with other documents
   └─→ Share results
```

### Workflow 2: Service Startup and Deployment

When deploying the full system:

```
DEVELOPMENT STARTUP:
$ npm run dev:all
│
├─→ Starts Frontend (Next.js on 3002)
├─→ Starts Main Backend (FastAPI on 8000)
├─→ Starts Auth Service (Flask/FastAPI on 5000)
├─→ Starts Forgery Service (on 5001)
├─→ Starts Tamper Service (on 5002)
└─→ Starts QR Service (on 5003)
    All running concurrently with color-coded output

PRODUCTION DEPLOYMENT:
$ npm run stack
│
├─→ npm run build (builds Next.js app)
│   └─→ Creates optimized production bundle
├─→ npm run start
│   └─→ Starts frontend (3002)
│   └─→ Starts auth service (5000)
│
(Other services deployed separately, e.g., via Docker)
```

### Workflow 3: Adding a New Detection Service

If you need to add a new type of fraud detection:

```
STEP 1: Create Service Directory
$ mkdir services/new-detection-service
$ cd services/new-detection-service
$ python -m venv venv
$ pip install fastapi uvicorn

STEP 2: Create API Endpoint
# main.py
from fastapi import FastAPI
app = FastAPI()

@app.post("/analyze")
async def analyze_document(file: UploadFile):
    # Detection logic here
    return {"detection_score": 0.95}

STEP 3: Update Main Backend
# services/backend/app/routes/verify.py
async def verify_document(document_id):
    # Call your new service
    new_result = requests.post(
        f"{NEW_SERVICE_URL}/analyze",
        files={"file": document_bytes}
    )
    # Aggregate with other results

STEP 4: Update Frontend
# src/app/page.tsx
// Add new detection type to results display
// Update type definitions

STEP 5: Add to package.json scripts
"dev:newservice": "cd ../services/new-detection-service && ./venv/bin/python main.py"
"dev:all": "concurrently ... \"cd ../services/new-detection-service && ./venv/bin/python main.py\""
```

---

## Integration Points

### Frontend-to-Backend API Contract

The frontend and backend communicate via REST API. Here's the interface:

**API Base URL:** `{API_BASE_URL}/api`

**Key Endpoints:**

```
Authentication:
POST   /auth/login              Request: {email, password}
                                Response: {token, user_id, expires_at}

POST   /auth/signup             Request: {email, password, org_name}
                                Response: {token, user_id}

Documents:
POST   /documents/upload        Request: {file: File, user_id: string}
                                Response: {document_id: string}

POST   /documents/{id}/verify   Request: {}
                                Response: {status: "processing"}

GET    /documents/{id}          Response: {id, filename, status, ...}

GET    /results/{id}            Response: {
                                  document_id,
                                  is_authentic,
                                  forgery_score,
                                  tampering_detected,
                                  qr_valid,
                                  timestamp
                                }

Dashboard:
GET    /dashboard/metrics       Response: {
                                  total_documents,
                                  verified_today,
                                  avg_verification_time_ms,
                                  fraud_detection_rate
                                }
```

### Authentication Flow

```
USER LOGIN (Frontend)
│
├─→ User enters email + password in /login page
│   └─→ Submits form
│       └─→ POST /auth/login
│           └─→ Backend validates credentials
│               └─→ Returns JWT token
│
├─→ Frontend stores token
│   └─→ localStorage.setItem('token', token)
│
├─→ Frontend redirects to dashboard
│   └─→ All subsequent API calls include Authorization header
│       └─→ Authorization: Bearer {token}
│
└─→ Backend validates token on each request
    └─→ If expired, returns 401
        └─→ Frontend redirects to /login
```

### Database Integration

The main backend connects to a PostgreSQL database:

```python
# services/backend/app/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()

# Usage in routes
@app.post("/documents/upload")
async def upload_document(
    file: UploadFile,
    db: Session = Depends(get_db)
):
    # Save to database
    doc = Document(filename=file.filename, ...)
    db.add(doc)
    db.commit()
```

### External Service Communication

Services call each other via HTTP:

```python
# services/backend/app/services/verification.py
import httpx

async def verify_document(document_id: str, file_bytes: bytes):
    async with httpx.AsyncClient() as client:
        
        # Call forgery service
        forgery_result = await client.post(
            f"{FORGERY_SERVICE_URL}/analyze",
            files={"file": file_bytes}
        )
        
        # Call tamper service
        tamper_result = await client.post(
            f"{TAMPER_SERVICE_URL}/detect",
            files={"file": file_bytes},
            json={"original_hash": stored_hash}
        )
        
        # Aggregate results
        return {
            "is_authentic": not tamper_result["is_tampered"],
            "forgery_score": forgery_result["score"],
            "tampering_detected": tamper_result["is_tampered"],
            "qr_valid": qr_result["is_valid"]
        }
```

### Responsive Design Integration Points

The frontend is built to be responsive:

```tsx
// Tailwind responsive classes
<div className="
    grid 
    grid-cols-1          // 1 column on mobile
    md:grid-cols-2       // 2 columns on tablet
    lg:grid-cols-3       // 3 columns on desktop
    gap-4
">
```

**Breakpoints:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

---

## Setup and Development

### Initial Setup

**Prerequisites:**
- Node.js v22.x
- Python 3.10+
- PostgreSQL (for local development)
- Git

**Clone and Install:**

```bash
# Clone repository
git clone https://github.com/Sumanth-tks/kanta-sodhana-web-app.git
cd kanta-sodhana-web-app

# Install frontend dependencies
npm install

# Create Python virtual environments for each service
cd services/backend && python -m venv venv && pip install -r requirements.txt
cd ../kantaka-auth && python -m venv venv && pip install -r requirements.txt
cd ../doc-forgery && python -m venv venv && pip install -r requirements.txt
cd ../dup-tamper && python -m venv venv && pip install -r requirements.txt
cd ../qr-verify && python -m venv venv && pip install -r requirements.txt
```

### Running Development Environment

**Option 1: Run Everything**
```bash
npm run dev:all
# Starts frontend + all 5 services
```

**Option 2: Run Frontend Only**
```bash
npm run dev:frontend
# Frontend at http://127.0.0.1:3002
```

**Option 3: Run Specific Services**
```bash
npm run dev:backend           # Main backend
npm run dev:auth              # Auth service
npm run dev:docforgery        # Forgery detection
npm run dev:duptamper         # Tampering detection
npm run dev:qrverify          # QR verification
```

### Building for Production

```bash
# Build optimized Next.js bundle
npm run build

# Start production server
npm run start

# Or combined
npm run stack
```

### Code Quality

**Linting:**
```bash
npm run lint
```

**Testing:**
```bash
npm run test              # Run tests once
npm run test:watch       # Watch mode
```

---

## Summary: Key Takeaways for New Developers

1. **Architecture:** Microservices backend (Python/FastAPI) + Monolithic frontend (Next.js/React)

2. **Frontend:** Single `page.tsx` contains main site with sections anchored via hash links. Components are modular and animation-heavy.

3. **Backend:** 5 independent Python services, each handling one type of fraud detection. Main service coordinates.

4. **Tampering Detection:** Always use SHA-256 hashing. This is mandatory.

5. **Data Flow:** User uploads document → Frontend sends to backend → Backend fans out to services → Results aggregated → Frontend displays verdict.

6. **Development:** Run `npm run dev:all` to start everything. Frontend is HMR-enabled. Backend services restart on file changes.

7. **Configuration:** Use environment variables. Different configs for dev/prod.

8. **Testing:** End-to-end users verify documents. Internally, each service tested independently.

This documentation should give new team members a complete mental model of how Kantaka Sodhana works from user action through data processing to result delivery. Reference this when making architectural changes or onboarding others.

---

**Version History:**
- v1.0 (June 2026): Initial comprehensive documentation created

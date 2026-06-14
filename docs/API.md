# Kantaka Śodhana API Reference

## Overview

RESTful API for medical document verification and fraud detection.

**Base URL:** `https://api.kantaka-sodhana.app/api`

**Staging:** `https://staging.kantaka-sodhana.app/api`

**Local:** `http://localhost:8000/api`

**Version:** 1.0.0

## Authentication

All endpoints except `/contact` and `/health` require user authentication via session cookie.

### Authentication Flow

1. **Register** — POST `/auth/register`
2. **Admin Approval** — Administrator approves user in dashboard
3. **Login** — POST `/auth/login` (returns session cookie)
4. **Access Protected Resources** — Include session cookie in requests

## Endpoints

### Health Check
```http
GET /health

Response: 200 OK
{
  "status": "ok"
}
```

No authentication required. Use for monitoring and uptime checks.

---

### Contact Form

#### Submit Contact Form
```http
POST /contact
Content-Type: application/json

Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Need fraud detection for PM-JAY claims. Can you provide details?"
}

Response: 200 OK
{
  "success": true,
  "message": "Submission received! Thank you for reaching out."
}

Errors:
400 Bad Request — Invalid input
{
  "detail": [
    {
      "loc": ["body", "name"],
      "msg": "ensure this value has at least 2 characters",
      "type": "value_error.string.min_length"
    }
  ]
}

422 Unprocessable Entity — Validation failed
429 Too Many Requests — Rate limit exceeded (5 requests/minute per IP)
```

**Field Constraints:**
- `name`: 2-100 characters
- `email`: Valid email format
- `message`: 10-5000 characters

**Rate Limit:** 5 requests per minute per IP

**No authentication required.**

---

### Authentication

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

Request:
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "phone": "9876543210",
  "purpose": "Fraud detection for PM-JAY claims"
}

Response: 200 OK
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "is_approved": false,
  "is_admin": false
}

Errors:
400 Bad Request — Email already exists
{
  "detail": "Email already registered"
}

422 Unprocessable Entity — Invalid input
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one number
- At least one special character

**After Registration:** User enters "pending approval" state. Admin must approve in dashboard before login succeeds.

---

#### Login
```http
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}

Response: 200 OK
Set-Cookie: session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict

{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "is_approved": true,
  "is_admin": false
}

Errors:
401 Unauthorized — Invalid credentials
{
  "detail": "Invalid email or password"
}

403 Forbidden — User not approved
{
  "detail": "User account pending admin approval"
}
```

**Session Management:**
- Session cookie valid for 30 days
- HttpOnly flag prevents JavaScript access
- Secure flag requires HTTPS
- SameSite=Strict prevents CSRF attacks

---

#### Check Auth Status
```http
GET /api/auth/me
Cookie: session=...

Response: 200 OK
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "is_approved": true,
  "is_admin": false
}

Errors:
401 Unauthorized — Not authenticated
{
  "detail": "Not authenticated"
}
```

Use this endpoint to check if user is still logged in.

---

#### Logout
```http
POST /api/auth/logout
Cookie: session=...

Response: 200 OK
{
  "message": "Logged out successfully"
}
```

Clears session cookie on client and invalidates server-side session.

---

### Risk Scoring (Authenticated)

#### Predict Risk Score
```http
POST /predict
Content-Type: application/json
Cookie: session=...

Request:
{
  "claim_amount": 50000,
  "length_of_stay": 5,
  "provider_experience": 10,
  "historical_denials": 2,
  "readmission_flag": 0,
  "repeat_procedure_flag": 0
}

Response: 200 OK
{
  "score": 42,
  "band": "LOW_RISK",
  "raw_prob": 0.15,
  "calibrated_prob": 0.12
}

Errors:
400 Bad Request — Value out of range
{
  "detail": [
    {
      "loc": ["body", "claim_amount"],
      "msg": "ensure this value is less than or equal to 300000",
      "type": "value_error.number.not_le"
    }
  ]
}

401 Unauthorized — Not authenticated
422 Unprocessable Entity — Validation failed
```

**Field Constraints:**
| Field | Type | Min | Max | Description |
|-------|------|-----|-----|-------------|
| `claim_amount` | int | 1000 | 300000 | Claim amount in rupees |
| `length_of_stay` | int | 0 | 30 | Hospital stay in days |
| `provider_experience` | int | 1 | 30 | Provider years of experience |
| `historical_denials` | int | 0 | 20 | Previous claim denials |
| `readmission_flag` | int | 0 | 1 | 0=no, 1=yes |
| `repeat_procedure_flag` | int | 0 | 1 | 0=no, 1=yes |

**Response Fields:**
- `score`: 0-100 risk score
- `band`: LOW_RISK, MEDIUM_RISK, HIGH_RISK
- `raw_prob`: Unscaled probability (0-1)
- `calibrated_prob`: Platt-scaled probability (0-1)

---

#### Get Prediction Explanation
```http
POST /explain
Content-Type: application/json
Cookie: session=...

Request:
{
  "claim_amount": 50000,
  "length_of_stay": 5,
  "provider_experience": 10,
  "historical_denials": 2,
  "readmission_flag": 0,
  "repeat_procedure_flag": 0
}

Response: 200 OK
{
  "shap_values": {
    "claim_amount": 0.15,
    "length_of_stay": -0.08,
    "provider_experience": -0.12,
    "historical_denials": 0.25,
    "readmission_flag": 0.05,
    "repeat_procedure_flag": 0.10
  },
  "prediction": {
    "score": 42,
    "band": "LOW_RISK",
    "raw_prob": 0.15,
    "calibrated_prob": 0.12
  }
}

Errors:
401 Unauthorized — Not authenticated
422 Unprocessable Entity — Validation failed
```

**SHAP Values:** Contribution of each feature to the prediction (positive = increases risk, negative = decreases risk).

---

#### Get Feature Importance
```http
GET /features
Cookie: session=...

Response: 200 OK
{
  "claim_amount": 0.32,
  "historical_denials": 0.28,
  "repeat_procedure_flag": 0.18,
  "readmission_flag": 0.15,
  "provider_experience": 0.05,
  "length_of_stay": 0.02
}

Errors:
401 Unauthorized — Not authenticated
```

Global feature importance across all predictions.

---

#### Get Hospital Rankings
```http
GET /hospitals?limit=20
Cookie: session=...

Response: 200 OK
[
  {
    "hospital_id": "HOSP_001",
    "avg_risk_score": 35.2,
    "claim_count": 156
  },
  {
    "hospital_id": "HOSP_002",
    "avg_risk_score": 28.5,
    "claim_count": 213
  }
]

Query Parameters:
- limit: 1-100 (default: 20)

Errors:
400 Bad Request — Limit out of range
401 Unauthorized — Not authenticated
```

Hospitals ranked by average risk score of submitted claims.

---

## Error Handling

All errors follow this format:

```json
{
  "detail": "Error message or array of validation errors"
}
```

### HTTP Status Codes

| Code | Meaning | Resolution |
|------|---------|-----------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid input (check field constraints) |
| 401 | Unauthorized | Not authenticated (login required) |
| 403 | Forbidden | Insufficient permissions |
| 422 | Unprocessable Entity | Validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error (check logs) |
| 503 | Service Unavailable | Maintenance or overload |

---

## Rate Limiting

**Contact Form:** 5 requests per minute per IP

**Authenticated Endpoints:** 100 requests per minute per user

Rate limit headers in response:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1623456789
```

---

## Response Times

| Endpoint | P50 | P95 | P99 |
|----------|-----|-----|-----|
| POST /contact | 50ms | 150ms | 300ms |
| POST /predict | 100ms | 450ms | 800ms |
| POST /explain | 150ms | 600ms | 1000ms |
| GET /hospitals | 75ms | 200ms | 400ms |

---

## Changelog

### v1.0.0 (2026-06-11)
- Initial release
- Risk scoring with SHAP explainability
- Contact form with Supabase storage
- User authentication and approval workflow
- Hospital ranking system
- Rate limiting and CORS protection

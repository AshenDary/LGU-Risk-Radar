# 🔒 Security Implementation Guide

## Overview
This document outlines all security measures implemented in the LGU Risk Scanner to protect against DDOS attacks, SQL injection, XSS, CSRF, bot attacks, and other vulnerabilities.

---

## 🛡️ Security Measures Implemented

### 1. BACKEND SECURITY

#### A. Rate Limiting (DDOS & Bot Protection)
```python
# File: app/security.py
# Implementation: slowapi library with configurable limits

Rate Limits:
- Default: 100 requests/minute
- Auth endpoints: 5 requests/minute
- API endpoints: 30 requests/minute
- Search endpoints: 20 requests/minute
```

**How to apply to endpoints:**
```python
from app.security import limiter
from fastapi import APIRouter

router = APIRouter()

@router.get("/endpoint")
@limiter.limit("10/minute")
async def endpoint(request: Request):
    pass
```

---

#### B. SQL Injection Prevention
✅ **Already Protected** (Using Supabase ORM)
- Parameterized queries prevent SQL injection
- Never concatenate user input into SQL strings
- Use ORM methods for all database operations

**Example (Correct):**
```python
# ✅ SAFE - Using ORM
user = supabase.table('users').select('*').eq('id', user_id).execute()

# ❌ UNSAFE - Never do this:
query = f"SELECT * FROM users WHERE id = {user_id}"
```

---

#### C. Password Hashing
```python
from app.security import hash_password, verify_password

# Hash password
hashed = hash_password("user_password")

# Verify password
is_valid = verify_password("user_password", hashed)
```

Uses **bcrypt with 12 rounds** (very strong)

---

#### D. JWT Token Management
```python
from app.security import create_access_token, verify_token

# Create token with 24-hour expiration
token = create_access_token(
    data={"user_id": 123, "role": "admin"},
    secret_key=settings.SECRET_KEY,
    expires_delta=timedelta(hours=24)
)

# Verify token
payload = verify_token(token, settings.SECRET_KEY)
```

---

#### E. Input Validation & Sanitization
```python
from app.security import sanitize_input, validate_email, validate_url

# Sanitize user input
clean_input = sanitize_input(user_input, max_length=1000)

# Validate email
is_valid_email = validate_email("user@example.com")

# Validate URL
is_valid_url = validate_url("https://example.com")
```

---

#### F. Security Headers
All responses include security headers:

| Header | Purpose |
|--------|---------|
| `X-Frame-Options: DENY` | Prevents clickjacking |
| `X-Content-Type-Options: nosniff` | Prevents MIME sniffing |
| `X-XSS-Protection: 1; mode=block` | Browser XSS protection |
| `Strict-Transport-Security` | Enforces HTTPS |
| `Content-Security-Policy` | Prevents XSS, clickjacking |
| `Referrer-Policy: strict-origin-when-cross-origin` | Prevents referrer leakage |
| `Permissions-Policy` | Disables unnecessary APIs |

---

#### G. CORS Protection
```python
# app/config.py
cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"
cors_origin_regex: Optional[str] = r"^http://(localhost|127\.0\.0\.1):\d+$"
```

- ✅ Only whitelisted origins allowed
- ✅ Credentials required
- ✅ Limited HTTP methods
- ✅ CORS preflight requests cached

---

#### H. IP Blocking & Reputation
```python
from app.security import block_ip, is_ip_blocked

# Block suspicious IP
block_ip("192.168.1.1", reason="Multiple failed auth attempts")

# Check if IP is blocked
if is_ip_blocked(client_ip):
    return {"error": "Access denied"}
```

---

#### I. Trusted Host Middleware
```python
TrustedHostMiddleware(
    allowed_hosts=[
        "localhost",
        "127.0.0.1",
        "*.example.com",
    ]
)
```

Prevents host header injection attacks.

---

#### J. Security Logging & Monitoring
```python
from app.security import log_security_event

log_security_event(
    event_type="FAILED_LOGIN_ATTEMPT",
    ip_address=request.client.host,
    user_id=user_id,
    details={"username": username},
    severity="WARNING"
)
```

All security events are logged for audit trail.

---

### 2. FRONTEND SECURITY

#### A. XSS Prevention
```javascript
import { sanitizeInput, escapeHtml } from '@/utils/security'

// Sanitize user input
const clean = sanitizeInput(userInput)

// Escape HTML
const escaped = escapeHtml(htmlString)

// React automatically escapes by default
<div>{userContent}</div> // ✅ Safe
```

---

#### B. CSRF Protection
```javascript
import { getCsrfToken, setCSRFToken, secureFetch } from '@/utils/security'

// Get CSRF token
const token = getCsrfToken()

// Make secure requests
const response = await secureFetch('/api/endpoint', {
    method: 'POST',
    body: JSON.stringify(data)
})

// CSRF token automatically included in headers
```

---

#### C. Secure API Requests
```javascript
import { securePost, securePut, secureDelete } from '@/utils/security'

// All methods include CSRF token + Auth token
const response = await securePost('/api/users', userData)
const response = await securePut('/api/users/1', userData)
const response = await secureDelete('/api/users/1')
```

---

#### D. Authentication Token Management
```javascript
import { getAuthToken, setAuthToken, clearAuthToken } from '@/utils/security'

// Store token after login
setAuthToken(jwtToken)

// Retrieve token for requests
const token = getAuthToken()

// Clear token on logout
clearAuthToken()
```

---

#### E. Input Validation
```javascript
import {
  validateEmail,
  validatePhoneNumber,
  validatePasswordStrength,
  validateURL
} from '@/utils/security'

// Validate email
if (validateEmail(email)) { /* ... */ }

// Check password strength
const { isStrong, requirements, score } = validatePasswordStrength(password)
if (!isStrong) console.error('Weak password')

// Validate phone
if (validatePhoneNumber(phone)) { /* ... */ }
```

---

#### F. Password Security
```javascript
import {
  validatePasswordStrength,
  generateSecurePassword
} from '@/utils/security'

// Generate secure password
const pwd = generateSecurePassword(16)
// Output: "aB9#xQ2$mN7!pL5@"

// Validate strength
const strength = validatePasswordStrength(userPassword)
// {
//   isStrong: true,
//   requirements: {
//     length: true,
//     uppercase: true,
//     lowercase: true,
//     number: true,
//     special: true
//   },
//   score: 5
// }
```

---

#### G. Client-Side Rate Limiting
```javascript
import { apiRateLimiter } from '@/utils/security'

// Check before making request
if (!apiRateLimiter.isAllowed()) {
    console.error('Too many requests')
    return
}

// Get remaining requests
const remaining = apiRateLimiter.getRemainingRequests()
```

---

#### H. Session Security
```javascript
import {
  setupSessionSecurity,
  clearSensitiveData
} from '@/utils/security'

// Setup session hijacking detection
setupSessionSecurity()

// Clear all sensitive data
clearSensitiveData()
```

---

#### I. Secure Local Storage
```javascript
import {
  secureStore,
  secureRetrieve,
  clearSensitiveData
} from '@/utils/security'

// Store encrypted data
secureStore('user_data', {name: 'John', role: 'admin'})

// Retrieve encrypted data
const userData = secureRetrieve('user_data')

// Clear sensitive data
clearSensitiveData()
```

---

#### J. Security Event Logging
```javascript
import { logSecurityEvent } from '@/utils/security'

await logSecurityEvent('FAILED_LOGIN_ATTEMPT', {
    username: email,
    timestamp: new Date().toISOString()
})
```

---

### 3. ENVIRONMENT SECURITY

#### A. Environment Variables
```bash
# .env (Never commit this!)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-secret-key
SECRET_KEY=your-super-secret-key
```

✅ Already in `.gitignore`
✅ Never expose in frontend code
✅ Rotate regularly

---

#### B. API Keys & Secrets
- ✅ Store in environment variables only
- ✅ Use separate keys for dev/staging/production
- ✅ Rotate keys every 90 days
- ✅ Never commit keys to repository
- ✅ Use external secret management (e.g., AWS Secrets Manager)

---

### 4. DEPLOYMENT SECURITY

#### A. HTTPS/TLS
- ✅ Always use HTTPS in production
- ✅ Use valid SSL certificates (Let's Encrypt is free)
- ✅ Set `Strict-Transport-Security` header
- ✅ Force HTTPS redirect

---

#### B. Web Application Firewall (WAF)
- Recommended: Cloudflare, AWS WAF, or similar
- Protects against DDOS, SQL injection, XSS
- Geo-blocking capabilities
- Bot detection

---

#### C. Environment Separation
```
Development: http://localhost:5173
Staging: https://staging.example.com
Production: https://example.com
```

Different keys for each environment.

---

### 5. DEPENDENCY MANAGEMENT

#### A. Vulnerability Scanning
```bash
# Python
pip install safety
safety check

# JavaScript
npm audit
npm audit fix
```

#### B. Keep Dependencies Updated
```bash
# Python
pip list --outdated
pip install --upgrade package-name

# Node.js
npm outdated
npm update
```

---

### 6. REGULAR SECURITY AUDITS

#### Monthly Checklist
- [ ] Run `safety check` on Python dependencies
- [ ] Run `npm audit` on JavaScript dependencies
- [ ] Review security logs for anomalies
- [ ] Check rate limiting effectiveness
- [ ] Verify CORS configuration
- [ ] Audit user access levels

#### Quarterly Checklist
- [ ] Rotate API keys
- [ ] Review and update CORS whitelist
- [ ] Test authentication flows
- [ ] Test password reset flows
- [ ] Review database backups
- [ ] Update security documentation

#### Annually
- [ ] Full security assessment
- [ ] Penetration testing
- [ ] Code review for security issues
- [ ] Update security policies

---

## 🚨 Common Attack Scenarios & Prevention

### 1. SQL Injection Attack
**Attack:** `' OR '1'='1`
**Prevention:** ✅ Parameterized queries, ORM usage

### 2. XSS Attack
**Attack:** `<img src=x onerror="alert('XSS')">`
**Prevention:** ✅ Input sanitization, React escaping

### 3. CSRF Attack
**Attack:** Form submission from attacker's website
**Prevention:** ✅ CSRF tokens, SameSite cookies

### 4. DDOS Attack
**Attack:** Flood endpoint with requests
**Prevention:** ✅ Rate limiting, WAF, load balancing

### 5. Brute Force Login
**Attack:** Try many password combinations
**Prevention:** ✅ Rate limiting on /login, account lockout

### 6. Session Hijacking
**Attack:** Steal user's session token
**Prevention:** ✅ HTTPS only, HttpOnly cookies, token expiration

### 7. Man-in-the-Middle (MITM)
**Attack:** Intercept communication
**Prevention:** ✅ HTTPS/TLS, HSTS header

### 8. Bot Attacks
**Attack:** Scraping, spam, automated attacks
**Prevention:** ✅ Rate limiting, CAPTCHA, IP blocking

---

## 📋 Deployment Checklist

- [ ] All secrets are in environment variables
- [ ] HTTPS/TLS configured
- [ ] Security headers enabled
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Database backups enabled
- [ ] Logging & monitoring enabled
- [ ] WAF configured
- [ ] Dependencies updated
- [ ] Security audit passed
- [ ] Penetration testing completed
- [ ] Incident response plan in place

---

## 🔑 Key Takeaways

1. **Never trust user input** - Always validate and sanitize
2. **Use parameterized queries** - Prevents SQL injection
3. **Enforce HTTPS** - Encrypt data in transit
4. **Rate limit** - Prevent DDOS and brute force
5. **Log security events** - Detect anomalies
6. **Keep dependencies updated** - Fix vulnerabilities
7. **Rotate secrets** - Reduce exposure window
8. **Test security regularly** - Find issues early
9. **Use security headers** - Defense in depth
10. **Monitor continuously** - Detect attacks in real-time

---

## 📞 Security Incident Response

If you detect a security issue:

1. **Isolate** - Stop the attack immediately
2. **Assess** - Determine scope and impact
3. **Respond** - Fix the vulnerability
4. **Notify** - Inform affected users
5. **Document** - Log what happened
6. **Review** - Update security measures

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [FastAPI Security](https://fastapi.tiangolo.com/advanced/security/)
- [React Security](https://react.dev/learn/security)
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/)

---

**Last Updated:** May 7, 2026
**Status:** ✅ Production Ready

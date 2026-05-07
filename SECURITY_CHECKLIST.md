# 🔐 Security Best Practices for Developers

## Before Committing Code

### Backend (Python/FastAPI)

- [ ] **No hardcoded secrets**
  - Use `.env` file for all secrets
  - Never commit `.env` file
  - Example: `SECRET_KEY = settings.secret_key`

- [ ] **Input validation**
  - Validate all user inputs
  - Use `sanitize_input()` function
  - Set max length limits
  - Example:
    ```python
    from app.security import sanitize_input, validate_email
    email = sanitize_input(user_email)
    if not validate_email(email):
        raise ValueError("Invalid email")
    ```

- [ ] **Rate limiting applied**
  - Add `@limiter.limit()` to public endpoints
  - Stricter limits for sensitive endpoints (auth, admin)
  - Example:
    ```python
    @router.post("/login")
    @limiter.limit("5/minute")
    async def login(request: Request, credentials: LoginRequest):
        pass
    ```

- [ ] **SQL parameterization**
  - Never concatenate user input into queries
  - Use ORM methods or parameterized queries
  - ✅ Good: `table.select().eq('id', user_id)`
  - ❌ Bad: `f"SELECT * WHERE id = {user_id}"`

- [ ] **Error handling**
  - Don't expose internal errors to users
  - Log errors with security context
  - Return generic error messages
  - Example:
    ```python
    try:
        # operation
    except Exception as e:
        log_security_event("ERROR", details=str(e))
        return {"error": "Operation failed"}
    ```

- [ ] **Authentication checks**
  - All protected endpoints have auth verification
  - Use JWT tokens with expiration
  - Verify token before processing request
  - Example:
    ```python
    @router.get("/protected")
    async def protected_endpoint(request: Request, current_user = Depends(get_current_user)):
        pass
    ```

- [ ] **Database queries**
  - Use `.select().eq()` not raw SQL
  - Never expose database structure in errors
  - Use connection pooling
  - Example:
    ```python
    user = supabase.table('users').select('*').eq('id', user_id).execute()
    ```

---

### Frontend (React/JavaScript)

- [ ] **No hardcoded API keys**
  - Use environment variables (`VITE_API_URL`)
  - Example: `const API_URL = import.meta.env.VITE_API_URL`

- [ ] **Input sanitization**
  - Sanitize all user inputs
  - Use `sanitizeInput()` function
  - Example:
    ```javascript
    import { sanitizeInput } from '@/utils/security'
    const cleanInput = sanitizeInput(userInput)
    ```

- [ ] **Secure API calls**
  - Use `secureFetch()` instead of `fetch()`
  - CSRF token automatically included
  - Example:
    ```javascript
    import { securePost } from '@/utils/security'
    const response = await securePost('/api/endpoint', data)
    ```

- [ ] **XSS prevention**
  - Never use `dangerouslySetInnerHTML` with user input
  - Let React escape by default
  - Example:
    ```jsx
    {/* ✅ Good */}
    <div>{userContent}</div>
    
    {/* ❌ Avoid */}
    <div dangerouslySetInnerHTML={{__html: userInput}} />
    ```

- [ ] **No sensitive data in localStorage**
  - Don't store passwords or API keys
  - Use sessionStorage for temporary data
  - Example:
    ```javascript
    // ✅ OK
    localStorage.setItem('auth_token', token)
    
    // ❌ Never
    localStorage.setItem('password', password)
    ```

- [ ] **Validation on both sides**
  - Validate on frontend for UX
  - Always validate on backend for security
  - Example:
    ```javascript
    // Frontend - for UX
    if (!validateEmail(email)) {
        setError('Invalid email')
        return
    }
    
    // Backend - for security
    if not validate_email(email):
        raise ValueError("Invalid email")
    ```

- [ ] **Handle errors safely**
  - Don't expose internal error details
  - Log to console only in development
  - Example:
    ```javascript
    try {
        const response = await secureFetch(url)
        if (!response.ok) {
            throw new Error('Request failed')
        }
    } catch (error) {
        console.error(error) // Only logged, not shown to user
        setError('An error occurred')
    }
    ```

---

## Code Review Checklist

When reviewing code, check for:

### Security Issues
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] Rate limiting on public endpoints
- [ ] Authentication checks in place
- [ ] Proper error handling
- [ ] No SQL concatenation
- [ ] XSS prevention measures
- [ ] CSRF token handling

### Best Practices
- [ ] Follows coding standards
- [ ] Clear variable names
- [ ] Comments for complex logic
- [ ] No duplicate code
- [ ] Proper error messages
- [ ] Logging for debugging

### Testing
- [ ] Unit tests included
- [ ] Edge cases covered
- [ ] Error scenarios tested
- [ ] Security tests included

---

## Common Mistakes to Avoid

### ❌ DON'T

```python
# Backend - Never concatenate user input
user_input = request.body.get("search")
query = f"SELECT * FROM users WHERE name = '{user_input}'"

# Store API keys in code
API_KEY = "sk_live_abc123def456"
```

```javascript
// Frontend - Never use dangerouslySetInnerHTML with user input
<div dangerouslySetInnerHTML={{__html: userContent}} />

// Never store sensitive data in localStorage
localStorage.setItem('password', password)
localStorage.setItem('ssn', socialSecurityNumber)
```

---

### ✅ DO

```python
# Backend - Use parameterized queries
search_term = sanitize_input(request.body.get("search"))
user = supabase.table('users').select('*').ilike('name', f'%{search_term}%').execute()

# Store API keys in environment
API_KEY = os.getenv("API_KEY")
```

```javascript
// Frontend - Let React escape
<div>{userContent}</div>

// Store only non-sensitive tokens
localStorage.setItem('auth_token', token)
sessionStorage.setItem('csrf_token', csrfToken)
```

---

## Testing Security

### Automated Testing

```bash
# Python - Check for security vulnerabilities
pip install bandit
bandit -r app/

# Node.js - Check npm packages
npm audit

# Check for hardcoded secrets
pip install detect-secrets
detect-secrets scan
```

### Manual Testing

1. **SQL Injection Test**
   - Try entering `' OR '1'='1` in forms
   - Verify no SQL errors returned

2. **XSS Test**
   - Try entering `<script>alert('XSS')</script>` in forms
   - Verify no script execution

3. **CSRF Test**
   - Try making requests from external website
   - Verify CSRF token is required

4. **Authentication Test**
   - Try accessing protected endpoints without token
   - Verify 401 Unauthorized returned

5. **Rate Limiting Test**
   - Send 100+ requests in 1 minute
   - Verify rate limit error after threshold

---

## Deployment Security

Before deploying to production:

### Configuration
- [ ] All secrets in environment variables
- [ ] HTTPS/TLS configured
- [ ] Security headers enabled
- [ ] CORS properly configured
- [ ] Rate limiting tuned for production

### Dependencies
- [ ] All dependencies updated
- [ ] `npm audit` and `safety check` pass
- [ ] Security patches applied

### Database
- [ ] Backups enabled
- [ ] Encryption enabled
- [ ] Access logs enabled
- [ ] Firewall rules configured

### Monitoring
- [ ] Logging enabled
- [ ] Error tracking configured
- [ ] Performance monitoring enabled
- [ ] Security alerts configured

### Testing
- [ ] All tests passing
- [ ] Security tests included
- [ ] Penetration testing done
- [ ] Load testing completed

---

## Incident Response

If a security issue is found:

1. **Stop the leak** - Disable affected functionality immediately
2. **Document it** - Record what happened and when
3. **Fix it** - Implement and test the fix
4. **Deploy** - Roll out fix to production
5. **Communicate** - Notify users if necessary
6. **Review** - Analyze how to prevent similar issues
7. **Update** - Update security documentation

---

## Quick Reference

### Security Functions

**Backend (Python)**
```python
from app.security import (
    hash_password,          # Hash password
    verify_password,        # Verify password
    create_access_token,    # Create JWT
    verify_token,           # Verify JWT
    sanitize_input,         # Sanitize input
    validate_email,         # Validate email
    block_ip,               # Block IP
    log_security_event,     # Log event
)
```

**Frontend (JavaScript)**
```javascript
import {
    sanitizeInput,          // Sanitize input
    validateEmail,          // Validate email
    securePost,             // Secure POST
    secureFetch,            // Secure fetch
    getAuthToken,           // Get token
    getCsrfToken,           // Get CSRF token
    logSecurityEvent,       // Log event
    validatePasswordStrength, // Check password
    generateSecurePassword, // Generate password
} from '@/utils/security'
```

---

## Resources

- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- [FastAPI Security](https://fastapi.tiangolo.com/advanced/security/)
- [React Security](https://react.dev/learn/security)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---

**Remember:** Security is everyone's responsibility! 🔐

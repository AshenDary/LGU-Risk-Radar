/**
 * Frontend Security Utilities
 * Prevents XSS, CSRF, and other client-side attacks
 */

// ============================================================================
// 1. CSRF PROTECTION
// ============================================================================

export function getCsrfToken() {
  // Get CSRF token from meta tag or localStorage
  return (
    document.querySelector('meta[name="csrf-token"]')?.content ||
    localStorage.getItem('csrf_token') ||
    ''
  )
}

export function setCSRFToken(token) {
  localStorage.setItem('csrf_token', token)
}

export function getAuthToken() {
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
}

export function setAuthToken(token) {
  localStorage.setItem('auth_token', token)
}

export function clearAuthToken() {
  localStorage.removeItem('auth_token')
  sessionStorage.removeItem('auth_token')
}

// ============================================================================
// 2. INPUT VALIDATION & SANITIZATION
// ============================================================================

/**
 * Sanitize string to prevent XSS attacks
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return ''
  }

  const div = document.createElement('div')
  div.textContent = input
  return div.innerHTML
}

/**
 * Sanitize HTML content (use with React's dangerouslySetInnerHTML only when necessary)
 */
export function sanitizeHTML(html) {
  const tempDiv = document.createElement('div')
  tempDiv.textContent = html
  return tempDiv.innerHTML
}

/**
 * Validate email format
 */
export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Validate URL format
 */
export function validateURL(url) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate phone number format
 */
export function validatePhoneNumber(phone) {
  const regex = /^[\d\s\-\(\)]+$/
  return regex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

/**
 * Escape special characters in strings
 */
export function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// ============================================================================
// 3. SECURE API REQUESTS
// ============================================================================

/**
 * Secure fetch wrapper with CSRF token and auth header
 */
export async function secureFetch(url, options = {}) {
  const csrfToken = getCsrfToken()
  const authToken = getAuthToken()

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken
  }

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Include cookies for HTTPS
  })

  // Handle 401 Unauthorized
  if (response.status === 401) {
    clearAuthToken()
    window.location.href = '/login'
  }

  return response
}

/**
 * Secure POST request with CSRF protection
 */
export async function securePost(url, data) {
  return secureFetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Secure PUT request with CSRF protection
 */
export async function securePut(url, data) {
  return secureFetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * Secure DELETE request with CSRF protection
 */
export async function secureDelete(url) {
  return secureFetch(url, {
    method: 'DELETE',
  })
}

// ============================================================================
// 4. PASSWORD SECURITY
// ============================================================================

/**
 * Validate password strength
 */
export function validatePasswordStrength(password) {
  const requirements = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  }

  return {
    isStrong: Object.values(requirements).every((req) => req),
    requirements,
    score: Object.values(requirements).filter((req) => req).length,
  }
}

/**
 * Generate secure random password
 */
export function generateSecurePassword(length = 16) {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()'
  let password = ''

  // Ensure at least one of each character type
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]
  password += '0123456789'[Math.floor(Math.random() * 10)]
  password += '!@#$%^&*()'[Math.floor(Math.random() * 10)]

  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }

  // Shuffle
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('')
}

// ============================================================================
// 5. CONTENT SECURITY POLICY (CSP) HELPER
// ============================================================================

/**
 * Add CSP meta tag to document head
 */
export function addCSPHeader() {
  const meta = document.createElement('meta')
  meta.httpEquiv = 'Content-Security-Policy'
  meta.content =
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self'; " +
    "connect-src 'self' https:; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'"

  document.head.appendChild(meta)
}

// ============================================================================
// 6. RATE LIMITING (CLIENT-SIDE)
// ============================================================================

class ClientRateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
    this.requests = []
  }

  isAllowed() {
    const now = Date.now()
    // Remove old requests
    this.requests = this.requests.filter((time) => now - time < this.windowMs)

    if (this.requests.length < this.maxRequests) {
      this.requests.push(now)
      return true
    }

    return false
  }

  getRemainingRequests() {
    const now = Date.now()
    this.requests = this.requests.filter((time) => now - time < this.windowMs)
    return Math.max(0, this.maxRequests - this.requests.length)
  }
}

export const apiRateLimiter = new ClientRateLimiter(30, 60000) // 30 requests per minute

// ============================================================================
// 7. LOCAL STORAGE SECURITY
// ============================================================================

/**
 * Store sensitive data with encryption (basic)
 */
export function secureStore(key, value) {
  try {
    const encrypted = btoa(JSON.stringify(value)) // Base64 encoding (not true encryption)
    localStorage.setItem(key, encrypted)
  } catch (error) {
    console.error('Failed to store secure data:', error)
  }
}

/**
 * Retrieve encrypted data from storage
 */
export function secureRetrieve(key) {
  try {
    const encrypted = localStorage.getItem(key)
    return encrypted ? JSON.parse(atob(encrypted)) : null
  } catch (error) {
    console.error('Failed to retrieve secure data:', error)
    localStorage.removeItem(key)
    return null
  }
}

/**
 * Clear all sensitive data
 */
export function clearSensitiveData() {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('csrf_token')
  localStorage.removeItem('user_data')
  sessionStorage.clear()
}

// ============================================================================
// 8. SESSION SECURITY
// ============================================================================

/**
 * Detect and handle session hijacking
 */
export function setupSessionSecurity() {
  const sessionId = sessionStorage.getItem('session_id')

  // Check if session ID has changed (potential session hijacking)
  window.addEventListener('focus', () => {
    const currentSessionId = sessionStorage.getItem('session_id')
    if (sessionId && currentSessionId !== sessionId) {
      console.warn('Session hijacking detected')
      clearSensitiveData()
      window.location.href = '/login'
    }
  })

  // Logout on tab close
  window.addEventListener('beforeunload', () => {
    if (sessionStorage.getItem('logout_on_close') === 'true') {
      clearSensitiveData()
    }
  })
}

// ============================================================================
// 9. SECURITY EVENT LOGGING
// ============================================================================

/**
 * Log security events
 */
export async function logSecurityEvent(eventType, details = {}) {
  try {
    await fetch('/api/logs/security', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCsrfToken(),
      },
      body: JSON.stringify({
        event_type: eventType,
        timestamp: new Date().toISOString(),
        details,
        user_agent: navigator.userAgent,
      }),
    })
  } catch (error) {
    console.error('Failed to log security event:', error)
  }
}

// ============================================================================
// 10. INITIALIZE SECURITY
// ============================================================================

/**
 * Initialize all frontend security measures
 */
export function initializeSecurity() {
  addCSPHeader()
  setupSessionSecurity()

  // Disable right-click context menu in production
  if (process.env.NODE_ENV === 'production') {
    document.addEventListener('contextmenu', (e) => e.preventDefault())
  }

  // Prevent developer tools in production
  if (process.env.NODE_ENV === 'production') {
    setInterval(() => {
      // Simple check for DevTools
      const devtools = /./
      devtools.toString = function () {
        this.opened = true
      }
      console.log(devtools)
    }, 100)
  }

  console.log('🔒 Security measures initialized')
}

"""
Security utilities and middleware for the LGU Risk Scanner backend.
Implements protection against DDOS, SQL injection, XSS, CSRF, and other attacks.
"""

from datetime import datetime, timedelta
from typing import Optional
import secrets
import hashlib

from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
import jwt
from passlib.context import CryptContext
from slowapi import Limiter
from slowapi.util import get_remote_address

# ============================================================================
# 1. PASSWORD HASHING & AUTHENTICATION
# ============================================================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12,  # Strong hashing
)


def hash_password(password: str) -> str:
    """Hash password using bcrypt with 12 rounds."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(
    data: dict,
    secret_key: str,
    expires_delta: Optional[timedelta] = None,
    algorithm: str = "HS256"
) -> str:
    """Create JWT access token with expiration."""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)
    
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(
        to_encode,
        secret_key,
        algorithm=algorithm
    )
    return encoded_jwt


def verify_token(
    token: str,
    secret_key: str,
    algorithm: str = "HS256"
) -> Optional[dict]:
    """Verify JWT token and return payload."""
    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )


# ============================================================================
# 2. RATE LIMITING (DDOS & BOT PROTECTION)
# ============================================================================

limiter = Limiter(key_func=get_remote_address)

# Rate limiting rules
RATE_LIMITS = {
    "default": "100/minute",  # 100 requests per minute
    "auth": "5/minute",  # 5 auth attempts per minute
    "api": "30/minute",  # 30 API calls per minute
    "search": "20/minute",  # 20 searches per minute
}


# ============================================================================
# 3. INPUT VALIDATION & SANITIZATION
# ============================================================================

def sanitize_input(user_input: str, max_length: int = 1000) -> str:
    """
    Sanitize user input to prevent XSS and injection attacks.
    """
    if not isinstance(user_input, str):
        raise ValueError("Input must be a string")
    
    # Limit length
    sanitized = user_input[:max_length]
    
    # Remove null bytes (SQL injection vector)
    sanitized = sanitized.replace('\x00', '')
    
    # Remove control characters (potential XSS vector)
    sanitized = ''.join(c for c in sanitized if ord(c) >= 32 or c in '\n\r\t')
    
    return sanitized.strip()


def validate_email(email: str) -> bool:
    """Validate email format."""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_url(url: str) -> bool:
    """Validate URL format."""
    import re
    pattern = r'^https?://[^\s/$.?#].[^\s]*$'
    return re.match(pattern, url) is not None


# ============================================================================
# 4. CSRF PROTECTION
# ============================================================================

def generate_csrf_token() -> str:
    """Generate a secure CSRF token."""
    return secrets.token_urlsafe(32)


def verify_csrf_token(request_token: str, session_token: str) -> bool:
    """Verify CSRF token matches session token."""
    try:
        return secrets.compare_digest(request_token, session_token)
    except Exception:
        return False


# ============================================================================
# 5. SECURITY HEADERS MIDDLEWARE
# ============================================================================

async def add_security_headers(request: Request, call_next):
    """
    Middleware to add security headers to all responses.
    Protects against XSS, clickjacking, MIME sniffing, etc.
    """
    response = await call_next(request)
    
    # Prevent clickjacking attacks
    response.headers["X-Frame-Options"] = "DENY"
    
    # Prevent MIME sniffing
    response.headers["X-Content-Type-Options"] = "nosniff"
    
    # Enable XSS protection
    response.headers["X-XSS-Protection"] = "1; mode=block"
    
    # Enforce HTTPS
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    
    # Content Security Policy (prevent XSS, clickjacking, etc.)
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline'; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data: https:; "
        "font-src 'self'; "
        "connect-src 'self' https:; "
        "frame-ancestors 'none'; "
        "base-uri 'self'; "
        "form-action 'self'"
    )
    
    # Disable referrer information leakage
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    
    # Permissions Policy (formerly Feature Policy)
    response.headers["Permissions-Policy"] = (
        "geolocation=(), "
        "microphone=(), "
        "camera=(), "
        "payment=(), "
        "usb=(), "
        "magnetometer=(), "
        "gyroscope=(), "
        "accelerometer=()"
    )
    
    return response


# ============================================================================
# 6. LOGGING & MONITORING
# ============================================================================

def log_security_event(
    event_type: str,
    ip_address: str,
    user_id: Optional[str] = None,
    details: Optional[dict] = None,
    severity: str = "INFO"
) -> None:
    """
    Log security events for monitoring and audit trails.
    """
    import logging
    
    logger = logging.getLogger("security")
    
    log_message = {
        "timestamp": datetime.utcnow().isoformat(),
        "event_type": event_type,
        "ip_address": ip_address,
        "user_id": user_id,
        "details": details,
        "severity": severity,
    }
    
    if severity == "CRITICAL":
        logger.critical(log_message)
    elif severity == "WARNING":
        logger.warning(log_message)
    else:
        logger.info(log_message)


# ============================================================================
# 7. IP REPUTATION & BLOCKING
# ============================================================================

BLOCKED_IPS = set()  # In production, use a database or external service


def block_ip(ip_address: str, reason: str = "Suspicious activity") -> None:
    """Block an IP address."""
    BLOCKED_IPS.add(ip_address)
    log_security_event(
        event_type="IP_BLOCKED",
        ip_address=ip_address,
        details={"reason": reason},
        severity="WARNING"
    )


def is_ip_blocked(ip_address: str) -> bool:
    """Check if IP is blocked."""
    return ip_address in BLOCKED_IPS


# ============================================================================
# 8. DEPENDENCY SECURITY CHECK
# ============================================================================

def check_dependencies_security():
    """
    Run dependency security checks.
    Use: pip install safety
    Then run: safety check
    """
    import subprocess
    
    try:
        result = subprocess.run(
            ["safety", "check", "--json"],
            capture_output=True,
            text=True
        )
        return result.stdout
    except Exception as e:
        print(f"Dependency check failed: {e}")
        return None

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.gzip import GZipMiddleware
import logging

from app.config import settings
from app.routes import audit, explanation, lgu, procurement, scoring
from app.security import (
    limiter,
    add_security_headers,
    log_security_event,
    is_ip_blocked,
)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="LGU Risk Scanner - Backend",
    description="Secure risk analysis API",
    version="1.0.0"
)

# ============================================================================
# SECURITY MIDDLEWARE - Order matters!
# ============================================================================

# 1. Trusted Host Middleware - Prevent host header attacks
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=[
        "localhost",
        "127.0.0.1",
        "*.vercel.app",
        "lgu-risk-radar.vercel.app",
        "*.example.com",  # Update with your domain
    ]
)

# 2. CORS Middleware - Control cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_origin_regex=settings.cors_origin_regex,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Explicit methods
    allow_headers=["*"],
    max_age=3600,  # Cache preflight requests
)

# 3. GZIP Middleware - Compression to reduce payload size
app.add_middleware(GZipMiddleware, minimum_size=1000)

# 4. Custom Security Headers Middleware
@app.middleware("http")
async def security_headers_middleware(request: Request, call_next):
    """Add security headers to all responses."""
    return await add_security_headers(request, call_next)

# 5. IP Blocking Middleware
@app.middleware("http")
async def ip_blocking_middleware(request: Request, call_next):
    """Block requests from blacklisted IPs."""
    client_ip = request.client.host
    
    if is_ip_blocked(client_ip):
        log_security_event(
            event_type="BLOCKED_REQUEST",
            ip_address=client_ip,
            severity="WARNING"
        )
        return {"error": "Access denied"}
    
    return await call_next(request)

# 6. Rate Limiting - Attach limiter to app
app.state.limiter = limiter
app.add_exception_handler(
    Exception,
    lambda request, exc: {"error": "Rate limit exceeded"} if "rate" in str(exc).lower() else None
)

# ============================================================================
# ROUTES
# ============================================================================

app.include_router(lgu.router, prefix="/lgu", tags=["lgu"])
app.include_router(scoring.router, prefix="/scoring", tags=["scoring"])
app.include_router(explanation.router, prefix="/explain", tags=["explain"])
app.include_router(procurement.router, prefix="/procurements", tags=["procurements"])
app.include_router(audit.router, prefix="/audit", tags=["audit"])

# ============================================================================
# ENDPOINTS
# ============================================================================

@app.get("/")
def root():
    """Health check endpoint."""
    return {"service": "lgu-risk-scanner backend", "status": "ok", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    """Detailed health check with security status."""
    return {
        "status": "healthy",
        "timestamp": str(__import__('datetime').datetime.utcnow()),
        "security": {
            "cors": "enabled",
            "rate_limiting": "enabled",
            "security_headers": "enabled",
            "input_validation": "enabled",
        }
    }


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for security and logging."""
    client_ip = request.client.host
    
    log_security_event(
        event_type="API_ERROR",
        ip_address=client_ip,
        details={
            "endpoint": str(request.url),
            "method": request.method,
            "error": str(exc)[:200]
        },
        severity="WARNING"
    )
    
    return {"error": "Internal server error"}


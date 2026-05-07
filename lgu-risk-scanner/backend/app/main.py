from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes import audit, explanation, lgu, procurement, scoring

app = FastAPI(title="LGU Risk Scanner - Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_origin_regex=settings.cors_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(lgu.router, prefix="/lgu", tags=["lgu"])
app.include_router(scoring.router, prefix="/scoring", tags=["scoring"])
app.include_router(explanation.router, prefix="/explain", tags=["explain"])
app.include_router(procurement.router, prefix="/procurements", tags=["procurements"])
app.include_router(audit.router, prefix="/audit", tags=["audit"])

@app.get("/")
def root():
    return {"service": "lgu-risk-scanner backend", "status": "ok"}

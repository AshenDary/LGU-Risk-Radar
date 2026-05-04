from fastapi import APIRouter, HTTPException
from typing import List
from uuid import uuid4

from app.models.lgu import LGU
from app.models.audit import AuditEntry
from app.models.risk_score import RiskScore
from app.services.audit_service import record_audit
from app.services.risk_score_service import (
    get_risk_score,
    list_risk_scores,
    risk_level_from_score,
    update_risk_score,
    upsert_risk_score,
)
from app.services.scoring_engine import compute_score

router = APIRouter()


@router.get("/list", response_model=List[RiskScore])
def read_risk_scores():
    return list_risk_scores()


@router.get("/{score_id}", response_model=RiskScore)
def read_risk_score(score_id: str):
    risk_score = get_risk_score(score_id)
    if risk_score is None:
        raise HTTPException(status_code=404, detail="Risk score not found")
    return risk_score


@router.post("/upsert", response_model=RiskScore)
def create_or_update_risk_score(score: RiskScore):
    return upsert_risk_score(score)


@router.put("/{score_id}", response_model=RiskScore)
def replace_risk_score(score_id: str, score: RiskScore):
    return update_risk_score(score_id, score)


@router.post("/compute")
def compute(lgu: LGU):
    score = compute_score(lgu.model_dump())
    risk_score = RiskScore(
        id=f"risk-{lgu.id}",
        lgu_id=lgu.id,
        score=score,
        risk_level=risk_level_from_score(score),
        explanation=f"Auto-generated score for {lgu.name or lgu.id}",
        factors={"population": lgu.population, "location": lgu.location},
    )
    risk_score_result = upsert_risk_score(risk_score)
    record_audit(
        AuditEntry(
            id=str(uuid4()),
            entity_type="risk_score",
            entity_id=risk_score.id,
            action="upsert",
            actor="system",
            details={"lgu_id": lgu.id, "score": score, "risk_level": risk_score.risk_level},
        )
    )
    return {"risk_score": risk_score.model_dump(), "supabase": risk_score_result}

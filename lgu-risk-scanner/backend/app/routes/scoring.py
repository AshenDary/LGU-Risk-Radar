from fastapi import APIRouter, HTTPException
from typing import List
from uuid import uuid4

from app.models.lgu import LGU
from app.models.audit import AuditEntry
from app.models.risk_score import RiskScore
from app.services.audit_service import record_audit
from app.services.lgu_service import get_lgu as service_get_lgu
from app.services.procurement_service import list_procurements_by_lgu
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
    """Compute and store risk score for an LGU."""
    procurements = list_procurements_by_lgu(lgu.id)
    score_data = compute_score(lgu.model_dump(), procurements=procurements)
    risk_score = RiskScore(
        id=f"risk-{lgu.id}",
        lgu_id=lgu.id,
        score=score_data['score'],
        risk_level=risk_level_from_score(score_data['score']),
        explanation=f"Auto-generated score for {lgu.name or lgu.id}",
        factors=score_data['factors'],
    )
    risk_score_result = upsert_risk_score(risk_score)
    record_audit(
        AuditEntry(
            id=str(uuid4()),
            entity_type="risk_score",
            entity_id=risk_score.id,
            action="upsert",
            actor="system",
            details={
                "lgu_id": lgu.id,
                "score": score_data['score'],
                "risk_level": risk_score.risk_level,
                "factors": score_data['factors'],
                "procurement_count": len(procurements),
            },
        )
    )
    return {"risk_score": risk_score.model_dump(), "supabase": risk_score_result}


@router.get("/by-lgu/{lgu_id}")
def get_risk_by_lgu(lgu_id: str):
    """
    Comprehensive endpoint: fetch LGU, its procurements, calculate risk, and return enriched data.
    
    Returns:
    - lgu: The LGU entity
    - procurements: All procurements for this LGU
    - risk_score: Calculated/stored risk score
    - analysis: Detailed risk factor breakdown
    - audit_trail: Recent audit entries for this LGU
    """
    # Fetch LGU
    lgu = service_get_lgu(lgu_id)
    if lgu is None:
        raise HTTPException(status_code=404, detail=f"LGU with id {lgu_id} not found")
    
    # Fetch procurements
    procurements = list_procurements_by_lgu(lgu_id)
    
    # Compute risk score with procurements
    score_data = compute_score(lgu if isinstance(lgu, dict) else lgu.model_dump(), procurements=procurements)
    
    risk_score_id = f"risk-{lgu_id}"
    risk_score = RiskScore(
        id=risk_score_id,
        lgu_id=lgu_id,
        score=score_data['score'],
        risk_level=risk_level_from_score(score_data['score']),
        explanation=f"Risk assessment for {lgu.get('name', lgu_id) if isinstance(lgu, dict) else lgu.name}",
        factors=score_data['factors'],
    )
    upsert_risk_score(risk_score)
    
    # Build response
    return {
        "lgu": lgu,
        "procurements": procurements,
        "procurement_count": len(procurements),
        "risk_score": {
            "id": risk_score.id,
            "score": score_data['score'],
            "risk_level": risk_level_from_score(score_data['score']),
            "factors": score_data['factors'],
        },
        "summary": {
            "message": f"LGU '{lgu.get('name', 'Unknown') if isinstance(lgu, dict) else lgu.name}' has a {risk_level_from_score(score_data['score']).upper()} risk profile",
            "total_procurements": len(procurements),
            "total_procurement_amount": sum(float(p.get('amount', 0)) for p in procurements),
            "recommendations": _generate_recommendations(score_data['factors'], procurements)
        }
    }


def _generate_recommendations(factors: dict, procurements: list) -> list:
    """Generate actionable recommendations based on risk factors."""
    recommendations = []
    
    if factors.get('supplier_concentration_risk', 0) > 15:
        recommendations.append("⚠️ High supplier concentration: Consider diversifying suppliers to reduce monopoly risk")
    
    if factors.get('status_anomaly_risk', 0) > 10:
        recommendations.append("⚠️ Many drafted procurements: Review stalled processes and expedite where possible")
    
    if factors.get('procurement_volume_risk', 0) > 18:
        recommendations.append("⚠️ High procurement volume: Increase scrutiny on large transactions")
    
    if factors.get('data_quality_risk', 0) > 10:
        recommendations.append("📋 Improve data completeness: Fill in missing LGU information")
    
    if not recommendations:
        recommendations.append("✅ Risk profile is within acceptable parameters")
    
    return recommendations

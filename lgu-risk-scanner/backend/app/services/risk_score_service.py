from typing import Any

from app.models.risk_score import RiskScore
from app.services.supabase_client import supabase
from app.services.supabase_client import get_supabase_repository
from app.services.scoring_engine import compute_score


def risk_level_from_score(score: float) -> str:
    if score >= 85:
        return "critical"
    if score >= 75:
        return "high"
    if score >= 40:
        return "medium"
    return "low"


def list_risk_scores():
    return get_supabase_repository().select_all("risk_scores")


def get_risk_score(score_id: str):
    return get_supabase_repository().select_one("risk_scores", "id", score_id)


def upsert_risk_score(score: RiskScore):
    return get_supabase_repository().upsert("risk_scores", score.model_dump(exclude_none=True))


def update_risk_score(score_id: str, score: RiskScore):
    return get_supabase_repository().update("risk_scores", score.model_dump(exclude_none=True), {"id": score_id})


async def compute_and_save_score(lgu_id: str) -> dict:
    """
    Fetch procurements for an LGU, compute its risk score,
    and upsert the result into the risk_scores table.
    """
    # 1. Fetch LGU and all procurements for this LGU
    lgu_response = (
        supabase
        .table("lgus")
        .select("*")
        .eq("id", lgu_id)
        .single()
        .execute()
    )
    lgu = lgu_response.data or {"id": lgu_id}

    response = (
        supabase
        .table("procurements")
        .select("*")
        .eq("lgu_id", lgu_id)
        .execute()
    )
    procurements = response.data or []

    # 2. Run the scoring engine
    result = compute_score(lgu, procurements)
    risk_level = risk_level_from_score(result["score"])

    # 3. Upsert into risk_scores (update if exists, insert if not)
    payload = {
        "id":          f"risk-{lgu_id}",
        "lgu_id":      lgu_id,
        "score":       result["score"],
        "risk_level":  risk_level,
        "factors":     result["factors"],   # stored as JSONB
        "explanation": None,                # filled later by LLM service
    }

    upsert_response = (
        supabase
        .table("risk_scores")
        .upsert(payload, on_conflict="lgu_id")
        .execute()
    )

    return upsert_response.data[0] if upsert_response.data else payload


async def get_score_by_lgu(lgu_id: str) -> dict | None:
    """Retrieve an existing risk score record for an LGU."""
    response = (
        supabase
        .table("risk_scores")
        .select("*")
        .eq("lgu_id", lgu_id)
        .single()
        .execute()
    )
    return response.data

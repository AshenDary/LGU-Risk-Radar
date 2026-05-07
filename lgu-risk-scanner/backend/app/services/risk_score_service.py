from typing import Any

from supabase import Client, create_client

from app.config import settings
from app.models.risk_score import RiskScore
from app.services.scoring_engine import compute_score


supabase: Client = create_client(settings.supabase_url, settings.supabase_service_role_key)


def risk_level_from_score(score: float) -> str:
    if score >= 75:
        return "high"
    if score >= 40:
        return "medium"
    return "low"


def list_risk_scores():
    return supabase.table("risk_scores").select("*").execute().data or []


def get_risk_score(score_id: str):
    response = supabase.table("risk_scores").select("*").eq("id", score_id).limit(1).execute()
    rows = response.data or []
    return rows[0] if rows else None


def upsert_risk_score(score: RiskScore):
    result = supabase.table("risk_scores").upsert(score.model_dump(exclude_none=True), on_conflict="id").execute().data or []
    return result[0] if isinstance(result, list) and len(result) == 1 else result


def update_risk_score(score_id: str, score: RiskScore):
    payload = score.model_dump(exclude_none=True)
    response = supabase.table("risk_scores").update(payload).eq("id", score_id).execute()
    rows = response.data or []
    return rows[0] if isinstance(rows, list) and len(rows) == 1 else rows


def compute_and_save_score(lgu_id: str) -> dict[str, Any]:
    """
    Fetch procurements for an LGU, compute its risk score, and upsert the result.
    """
    response = (
        supabase
        .table("procurements")
        .select("*")
        .eq("lgu_id", lgu_id)
        .execute()
    )
    procurements = response.data or []

    result = compute_score(procurements)
    risk_level = risk_level_from_score(result["score"])

    payload = {
        "lgu_id": lgu_id,
        "score": result["score"],
        "risk_level": risk_level,
        "factors": result["factors"],
        "explanation": None,
    }

    upsert_response = (
        supabase
        .table("risk_scores")
        .upsert(payload, on_conflict="lgu_id")
        .execute()
    )

    rows = upsert_response.data or []
    return rows[0] if isinstance(rows, list) and len(rows) == 1 else payload


def get_score_by_lgu(lgu_id: str) -> dict[str, Any] | None:
    response = (
        supabase
        .table("risk_scores")
        .select("*")
        .eq("lgu_id", lgu_id)
        .single()
        .execute()
    )
    return response.data

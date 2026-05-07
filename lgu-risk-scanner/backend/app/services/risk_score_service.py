from typing import Any

from app.models.risk_score import RiskScore
from app.services.supabase_client import supabase
from app.services.supabase_client import get_supabase_repository
from app.services.scoring_engine import compute_score
from app.services.llm_service import LLMService


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


def list_risk_map_points():
    """Return LGUs with coordinates and the latest risk score for map visualization."""
    lgus = get_supabase_repository().select_all("lgus")
    risk_scores = get_supabase_repository().select_all("risk_scores")
    score_by_lgu = {rs["lgu_id"]: rs for rs in risk_scores}

    results = []
    for lgu in lgus:
        if lgu.get("latitude") is None or lgu.get("longitude") is None:
            continue

        risk = score_by_lgu.get(lgu["id"], {})
        results.append({
            "id": lgu["id"],
            "name": lgu.get("name"),
            "location": lgu.get("location"),
            "latitude": lgu["latitude"],
            "longitude": lgu["longitude"],
            "risk_score": risk.get("score"),
            "risk_level": risk.get("risk_level"),
            "metadata": lgu.get("metadata", {}),
        })

    return results


async def compute_and_save_score(lgu_id: str) -> dict:
    """
    Fetch procurements for an LGU, compute its risk score,
    and upsert the result into the risk_scores table.
    """
    lgu_response = (
        supabase
        .table("lgus")
        .select("*")
        .eq("id", lgu_id)
        .single()
        .execute()
    )

    lgu = lgu_response.data
    if not lgu:
        raise ValueError(f"LGU with id {lgu_id} not found")

    response = (
        supabase
        .table("procurements")
        .select("*")
        .eq("lgu_id", lgu_id)
        .execute()
    )
    procurements = response.data or []

    result = compute_score(lgu, procurements)
    risk_level = risk_level_from_score(result["score"])

    payload = {
        "id":          f"risk-{lgu_id}",
        "lgu_id":      lgu_id,
        "score":       result["score"],
        "risk_level":  risk_level,
        "factors":     result["factors"],
        "explanation": None,
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


async def simulate_risk_score(lgu_id: str, hypothetical_procurements: list = None) -> dict:
    """
    Simulate risk score calculation with hypothetical procurement data.
    Does not save the result - used for what-if analysis.

    Args:
        lgu_id: The LGU ID to simulate for
        hypothetical_procurements: List of modified procurement records

    Returns:
        dict with simulated score, factors, and AI explanation
    """
    # Fetch LGU data
    lgu_response = (
        supabase
        .table("lgus")
        .select("*")
        .eq("id", lgu_id)
        .single()
        .execute()
    )
    lgu = lgu_response.data
    if not lgu:
        raise ValueError(f"LGU with id {lgu_id} not found")

    # Use hypothetical procurements or fetch real ones
    procurements = hypothetical_procurements or []
    if not hypothetical_procurements:
        response = (
            supabase
            .table("procurements")
            .select("*")
            .eq("lgu_id", lgu_id)
            .execute()
        )
        procurements = response.data or []

    # Compute the simulated score
    score_data = compute_score(lgu, procurements)

    # Generate AI explanation
    llm_service = LLMService()
    explanation = llm_service.generate(
        lgu_name=lgu.get('name', f"LGU {lgu_id}"),
        risk_score=score_data['score'],
        risk_level=risk_level_from_score(score_data['score']),
        factors=score_data['factors']
    )

    return {
        "lgu_id": lgu_id,
        "lgu_name": lgu.get('name', f"LGU {lgu_id}"),
        "score": score_data['score'],
        "risk_level": risk_level_from_score(score_data['score']),
        "factors": score_data['factors'],
        "explanation": explanation,
        "is_simulation": True
    }

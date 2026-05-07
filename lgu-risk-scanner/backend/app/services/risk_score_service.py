from typing import Any

from app.services.supabase_client import supabase
from app.services.scoring_engine import compute_score
from app.services.llm_service import LLMService


def risk_level_from_score(score: float) -> str:
    """Determine risk level from numeric score."""
    if score >= 70:
        return "High"
    elif score >= 40:
        return "Medium"
    else:
        return "Low"


async def compute_and_save_score(lgu_id: str) -> dict:
    """
    Fetch procurements for an LGU, compute its risk score,
    and upsert the result into the risk_scores table.
    """
    # 1. Fetch LGU data
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

    # 2. Fetch all procurements for this LGU
    response = (
        supabase
        .table("procurements")
        .select("*")
        .eq("lgu_id", lgu_id)
        .execute()
    )
    procurements = response.data or []

    # 3. Run the scoring engine
    result = compute_score(lgu, procurements)

    # 4. Upsert into risk_scores (update if exists, insert if not)
    payload = {
        "lgu_id":      lgu_id,
        "score":       result["score"],
        "risk_level":  result["risk_level"],
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

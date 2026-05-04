from app.models.risk_score import RiskScore
from app.services.supabase_client import get_supabase_repository


def risk_level_from_score(score: float) -> str:
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
    return get_supabase_repository().upsert("risk_scores", score.model_dump())


def update_risk_score(score_id: str, score: RiskScore):
    return get_supabase_repository().update("risk_scores", score.model_dump(), {"id": score_id})
from app.models.lgu import LGU
from app.services.supabase_client import get_supabase_repository


def list_lgus():
    return get_supabase_repository().select_all("lgus")


def get_lgu(lgu_id: str):
    return get_supabase_repository().select_one("lgus", "id", lgu_id)


def upsert_lgu(lgu: LGU):
    return get_supabase_repository().upsert("lgus", lgu.model_dump())


def update_lgu(lgu_id: str, lgu: LGU):
    return get_supabase_repository().update("lgus", lgu.model_dump(), {"id": lgu_id})
from app.models.procurement import Procurement
from app.services.supabase_client import get_supabase_repository


def list_procurements():
    return get_supabase_repository().select_all("procurements")


def list_procurements_by_lgu(lgu_id: str):
    """Fetch all procurements for a specific LGU."""
    repo = get_supabase_repository()
    all_procurements = repo.select_all("procurements")
    # Filter in Python since Supabase client doesn't support complex queries directly
    return [p for p in all_procurements if isinstance(p, dict) and p.get('lgu_id') == lgu_id]


def get_procurement(procurement_id: str):
    return get_supabase_repository().select_one("procurements", "id", procurement_id)


def upsert_procurement(procurement: Procurement):
    return get_supabase_repository().upsert("procurements", procurement.model_dump())


def update_procurement(procurement_id: str, procurement: Procurement):
    return get_supabase_repository().update("procurements", procurement.model_dump(), {"id": procurement_id})
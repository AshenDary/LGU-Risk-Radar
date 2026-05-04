from app.models.procurement import Procurement
from app.services.supabase_client import get_supabase_repository


def list_procurements():
    return get_supabase_repository().select_all("procurements")


def get_procurement(procurement_id: str):
    return get_supabase_repository().select_one("procurements", "id", procurement_id)


def upsert_procurement(procurement: Procurement):
    return get_supabase_repository().upsert("procurements", procurement.model_dump())


def update_procurement(procurement_id: str, procurement: Procurement):
    return get_supabase_repository().update("procurements", procurement.model_dump(), {"id": procurement_id})
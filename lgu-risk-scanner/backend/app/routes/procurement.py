from fastapi import APIRouter, HTTPException

from app.models.procurement import Procurement
from app.services.procurement_service import get_procurement as service_get_procurement, list_procurements, update_procurement, upsert_procurement

router = APIRouter()


@router.get("/list")
def read_procurements():
    return list_procurements()


@router.get("/{procurement_id}")
def read_procurement(procurement_id: str):
    procurement = service_get_procurement(procurement_id)
    if procurement is None:
        raise HTTPException(status_code=404, detail="Procurement not found")
    return procurement


@router.post("/upsert")
def create_or_update_procurement(procurement: Procurement):
    return upsert_procurement(procurement)


@router.put("/{procurement_id}")
def replace_procurement(procurement_id: str, procurement: Procurement):
    return update_procurement(procurement_id, procurement)
from fastapi import APIRouter, HTTPException
from typing import List

from app.models.lgu import LGU
from app.services.lgu_service import get_lgu as service_get_lgu, list_lgus as service_list_lgus, update_lgu, upsert_lgu

router = APIRouter()


@router.get("/list", response_model=List[LGU])
def list_lgus():
    return service_list_lgus()


@router.get("/{lgu_id}", response_model=LGU)
def get_lgu(lgu_id: str):
    lgu = service_get_lgu(lgu_id)
    if lgu is None:
        raise HTTPException(status_code=404, detail="LGU not found")
    return lgu


@router.post("/upsert", response_model=LGU)
def create_or_update_lgu(lgu: LGU):
    return upsert_lgu(lgu)


@router.put("/{lgu_id}", response_model=LGU)
def replace_lgu(lgu_id: str, lgu: LGU):
    return update_lgu(lgu_id, lgu)

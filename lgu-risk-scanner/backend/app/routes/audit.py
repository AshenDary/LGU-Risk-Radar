from fastapi import APIRouter, HTTPException

from app.models.audit import AuditEntry
from app.services.audit_service import get_audit as service_get_audit, list_audits, record_audit, update_audit

router = APIRouter()


@router.get("/list")
def read_audits():
    return list_audits()


@router.get("/{audit_id}")
def read_audit(audit_id: str):
    audit = service_get_audit(audit_id)
    if audit is None:
        raise HTTPException(status_code=404, detail="Audit entry not found")
    return audit


@router.post("/record")
def create_audit(entry: AuditEntry):
    return record_audit(entry)


@router.put("/{audit_id}")
def replace_audit(audit_id: str, entry: AuditEntry):
    return update_audit(audit_id, entry)
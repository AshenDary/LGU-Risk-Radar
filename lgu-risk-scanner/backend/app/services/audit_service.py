from app.models.audit import AuditEntry
from app.services.supabase_client import get_supabase_repository


def list_audits():
    return get_supabase_repository().select_all("audit_logs")


def get_audit(audit_id: str):
    return get_supabase_repository().select_one("audit_logs", "id", audit_id)


def record_audit(entry: AuditEntry):
    return get_supabase_repository().insert("audit_logs", entry.model_dump(exclude_none=True))


def update_audit(audit_id: str, entry: AuditEntry):
    return get_supabase_repository().update("audit_logs", entry.model_dump(exclude_none=True), {"id": audit_id})

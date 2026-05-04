from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field


class AuditEntry(BaseModel):
    id: str
    entity_type: str
    entity_id: str
    action: str
    actor: str = "system"
    details: dict[str, Any] = Field(default_factory=dict)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

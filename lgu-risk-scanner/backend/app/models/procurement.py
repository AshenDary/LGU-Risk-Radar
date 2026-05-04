from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field


class Procurement(BaseModel):
    id: str = Field(..., description="Unique procurement identifier")
    lgu_id: str
    reference_number: Optional[str] = None
    title: str
    supplier: Optional[str] = None
    amount: float = 0.0
    status: str = "draft"
    metadata: dict[str, Any] = Field(default_factory=dict)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
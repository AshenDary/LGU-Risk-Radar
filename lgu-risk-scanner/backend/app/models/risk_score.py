from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field


class RiskScore(BaseModel):
    id: str = Field(..., description="Unique risk score identifier")
    lgu_id: str
    score: float
    risk_level: str
    explanation: Optional[str] = None
    factors: dict[str, Any] = Field(default_factory=dict)
    metadata: dict[str, Any] = Field(default_factory=dict)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
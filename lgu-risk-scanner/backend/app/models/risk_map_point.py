from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field


class RiskMapPoint(BaseModel):
    id: str = Field(..., description="Unique LGU identifier")
    name: Optional[str]
    location: Optional[str]
    latitude: float
    longitude: float
    risk_score: Optional[float]
    risk_level: Optional[str]
    metadata: dict[str, Any] = Field(default_factory=dict)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

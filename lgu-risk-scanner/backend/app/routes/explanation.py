from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.llm_service import LLMService

router = APIRouter()
llm_service = LLMService()


class ExplanationRequest(BaseModel):
    lgu_name: str
    risk_score: float
    risk_level: str
    factors: dict = {}


@router.post("/reason")
def explain(request: ExplanationRequest):
    """
    Generate an LLM-powered explanation for an LGU risk assessment.
    
    Args:
        request: ExplanationRequest containing LGU name, risk score, risk level, and contributing factors
        
    Returns:
        Dictionary with explanation string and input metadata
    """
    if not request.lgu_name:
        raise HTTPException(status_code=400, detail="lgu_name is required")
    
    if not 0 <= request.risk_score <= 100:
        raise HTTPException(status_code=400, detail="risk_score must be between 0 and 100")
    
    try:
        explanation = llm_service.generate(
            lgu_name=request.lgu_name,
            risk_score=request.risk_score,
            risk_level=request.risk_level,
            factors=request.factors
        )
        return {
            "explanation": explanation,
            "lgu_name": request.lgu_name,
            "risk_score": request.risk_score,
            "risk_level": request.risk_level,
            "factors": request.factors
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating explanation: {str(e)}")

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.llm_service import LLMService
from app.services.risk_score_service import get_score_by_lgu
from app.services.supabase_client import supabase

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


@router.get("/explain/{lgu_id}")
async def explain_lgu(lgu_id: str):
    """
    Fetch risk score for an LGU and generate LLM-powered explanation.
    
    Args:
        lgu_id: ID of the LGU
        
    Returns:
        Dictionary with explanation and risk data
    """
    try:
        # Fetch risk score
        risk_score = await get_score_by_lgu(lgu_id)
        if not risk_score:
            raise HTTPException(status_code=404, detail=f"No risk score found for LGU {lgu_id}")
        
        # Fetch LGU name (assuming risk_score has lgu_id, but need name)
        # For simplicity, use lgu_id as name or fetch from LGU table
        lgu_response = supabase.table("lgus").select("name").eq("id", lgu_id).single().execute()
        lgu_name = lgu_response.data.get("name", lgu_id) if lgu_response.data else lgu_id
        
        # Generate explanation
        explanation = llm_service.generate(
            lgu_name=lgu_name,
            risk_score=risk_score["score"],
            risk_level=risk_score["risk_level"],
            factors=risk_score["factors"]
        )
        
        # Update the risk_scores table with the explanation
        supabase.table("risk_scores").update({"explanation": explanation}).eq("lgu_id", lgu_id).execute()
        
        return {
            "lgu_id": lgu_id,
            "lgu_name": lgu_name,
            "risk_score": risk_score["score"],
            "risk_level": risk_score["risk_level"],
            "factors": risk_score["factors"],
            "explanation": explanation
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating explanation: {str(e)}")

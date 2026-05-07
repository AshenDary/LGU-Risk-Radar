from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.services.llm_service import LLMService
from app.services.risk_score_service import get_score_by_lgu
from app.services.supabase_client import supabase

router = APIRouter()
llm_service = LLMService()


class ExplanationRequest(BaseModel):
    lgu_name: str
    risk_score: float
    risk_level: str
    factors: dict = Field(default_factory=dict)


class ExplanationQuestionRequest(ExplanationRequest):
    question: str


class ChecklistRequest(BaseModel):
    profile: dict = Field(default_factory=dict)


class CompareRequest(BaseModel):
    left: dict = Field(default_factory=dict)
    right: dict = Field(default_factory=dict)


class ReportRequest(BaseModel):
    title: str = "LGU Risk Review Report"
    profiles: list[dict] = Field(default_factory=list)
    notes: str = ""


@router.get("/health")
def explanation_health():
    return {
        "status": "ok",
        "ai_configured": llm_service.configured,
        "model": llm_service.model,
    }


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
        result = llm_service.generate_result(
            lgu_name=request.lgu_name,
            risk_score=request.risk_score,
            risk_level=request.risk_level,
            factors=request.factors
        )
        return {
            "explanation": result["explanation"],
            "ai_configured": llm_service.configured,
            "used_ai": result["used_ai"],
            "fallback_reason": result["fallback_reason"],
            "model": llm_service.model,
            "lgu_name": request.lgu_name,
            "risk_score": request.risk_score,
            "risk_level": request.risk_level,
            "factors": request.factors
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating explanation: {str(e)}")


@router.post("/ask")
def ask_explainer(request: ExplanationQuestionRequest):
    if not request.lgu_name:
        raise HTTPException(status_code=400, detail="lgu_name is required")

    if not 0 <= request.risk_score <= 100:
        raise HTTPException(status_code=400, detail="risk_score must be between 0 and 100")

    if not request.question.strip():
        raise HTTPException(status_code=400, detail="question is required")

    try:
        result = llm_service.answer_question_result(
            lgu_name=request.lgu_name,
            risk_score=request.risk_score,
            risk_level=request.risk_level,
            factors=request.factors,
            question=request.question.strip(),
        )
        return {
            "answer": result["answer"],
            "ai_configured": llm_service.configured,
            "used_ai": result["used_ai"],
            "fallback_reason": result["fallback_reason"],
            "model": llm_service.model,
            "question": request.question.strip(),
            "lgu_name": request.lgu_name,
            "risk_score": request.risk_score,
            "risk_level": request.risk_level,
            "factors": request.factors,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error answering question: {str(e)}")


@router.post("/checklist")
def generate_checklist(request: ChecklistRequest):
    if not request.profile:
        raise HTTPException(status_code=400, detail="profile is required")

    try:
        result = llm_service.checklist_result(request.profile)
        return {
            "checklist": result["checklist"],
            "ai_configured": llm_service.configured,
            "used_ai": result["used_ai"],
            "fallback_reason": result["fallback_reason"],
            "model": llm_service.model,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating checklist: {str(e)}")


@router.post("/compare")
def compare_lgus(request: CompareRequest):
    if not request.left or not request.right:
        raise HTTPException(status_code=400, detail="left and right profiles are required")

    try:
        result = llm_service.compare_result(request.left, request.right)
        return {
            "comparison": result["comparison"],
            "ai_configured": llm_service.configured,
            "used_ai": result["used_ai"],
            "fallback_reason": result["fallback_reason"],
            "model": llm_service.model,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error comparing LGUs: {str(e)}")


@router.post("/report")
def generate_report(request: ReportRequest):
    if not request.profiles:
        raise HTTPException(status_code=400, detail="profiles is required")

    try:
        result = llm_service.report_result(request.title, request.profiles, request.notes)
        return {
            "report": result["report"],
            "ai_configured": llm_service.configured,
            "used_ai": result["used_ai"],
            "fallback_reason": result["fallback_reason"],
            "model": llm_service.model,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating report: {str(e)}")


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
        result = llm_service.generate_result(
            lgu_name=lgu_name,
            risk_score=risk_score["score"],
            risk_level=risk_score["risk_level"],
            factors=risk_score["factors"]
        )
        
        # Update the risk_scores table with the explanation
        supabase.table("risk_scores").update({"explanation": result["explanation"]}).eq("lgu_id", lgu_id).execute()
        
        return {
            "lgu_id": lgu_id,
            "lgu_name": lgu_name,
            "risk_score": risk_score["score"],
            "risk_level": risk_score["risk_level"],
            "factors": risk_score["factors"],
            "explanation": result["explanation"],
            "ai_configured": llm_service.configured,
            "used_ai": result["used_ai"],
            "fallback_reason": result["fallback_reason"],
            "model": llm_service.model,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating explanation: {str(e)}")

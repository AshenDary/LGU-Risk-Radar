from fastapi import APIRouter

router = APIRouter()


@router.post("/reason")
def explain(request: dict):
    # Placeholder: return simple explanation
    return {"explanation": "Explanation generation not implemented yet", "input": request}

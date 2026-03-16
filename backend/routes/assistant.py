from fastapi import APIRouter
router = APIRouter()
@router.post("/chat")
def chat_assistant(query: str):
    return {"response": f"Analyzing: {query}", "charts": []}

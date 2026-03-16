from fastapi import APIRouter
router = APIRouter()
@router.post("/run")
def run_simulation(temp: float, pollution: float, fishing: float):
    return {"prediction": "High stress", "biodiversity_hit": "12%"}

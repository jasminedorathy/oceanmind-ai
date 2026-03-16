from fastapi import APIRouter, HTTPException
from ..services.insight_engine import InsightEngine
import pandas as pd
import os

from pydantic import BaseModel

class SimulationParams(BaseModel):
    temp: float
    pollution: float
    fishing: float

router = APIRouter()
DATA_DIR = "datasets"

@router.get("/summary/{filename}")
async def get_analytics(filename: str):
    file_path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    df = pd.read_csv(file_path)
    engine = InsightEngine()
    insights = engine.generate_insights(df)
    
    return {
        "filename": filename,
        "insights": insights,
        "kpis": {
            "avg_temp": round(df['temperature'].mean(), 2) if 'temperature' in df.columns else None,
            "max_pollution": df['pollution_index'].max() if 'pollution_index' in df.columns else None
        }
    }

@router.post("/simulate")
async def simulate(params: SimulationParams):
    return InsightEngine.predict_impact(params.temp, params.pollution, params.fishing)

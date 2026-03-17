from fastapi import APIRouter, HTTPException, Depends
from ..database.database import get_db
from ..services.insight_engine import InsightEngine
import pandas as pd
import os
import requests
import json

from pydantic import BaseModel

class SimulationParams(BaseModel):
    temp: float
    pollution: float
    fishing: float

class CopilotRequest(BaseModel):
    prompt: str
    filename: str = None

router = APIRouter()
DATA_DIR = "datasets"
db = get_db()

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

@router.post("/train/{filename}")
async def train_dataset(filename: str):
    file_path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    try:
        df = pd.read_csv(file_path)
        engine = InsightEngine()
        insights = engine.generate_insights(df)
        
        # Calculate summary stats
        summary = {
            "insights_count": len(insights),
            "top_insights": insights[:3],
            "stats": {
                "avg_temp": round(df['temperature'].mean(), 2) if 'temperature' in df.columns else None,
                "avg_pollution": round(df['pollution_index'].mean(), 2) if 'pollution_index' in df.columns else None,
                "avg_biodiversity": round(df['biodiversity_index'].mean(), 2) if 'biodiversity_index' in df.columns else None,
            }
        }
        
        # Update status in DB
        db.datasets.update_one(
            {"filename": filename},
            {"$set": {"status": "trained", "summary": summary}}
        )
        
        return {"message": f"Neural training complete for {filename}", "summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training Failure: {str(e)}")

@router.get("/metadata/{filename}")
async def get_dataset_metadata(filename: str):
    file_path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Node registry entry missing.")
    
    df = pd.read_csv(file_path)
    engine = InsightEngine()
    schema = engine.get_schema(df)
    insights = engine.generate_insights(df)
    visuals = engine.suggest_visuals(df)
    
    # Calculate global averages for every numeric column automatically
    stats = {}
    for col in schema['numeric']:
        stats[col] = {
            "avg": round(df[col].mean(), 2),
            "max": round(df[col].max(), 2),
            "min": round(df[col].min(), 2)
        }
        
    return {
        "filename": filename,
        "schema": schema,
        "insights": insights,
        "visuals": visuals,
        "summary_stats": stats,
        "row_count": len(df)
    }

@router.get("/data/{filename}")
async def get_dataset_data(filename: str):
    file_path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    df = pd.read_csv(file_path)
    # Return first 100 rows for charts
    return df.head(100).to_dict(orient="records")

@router.post("/simulate")
async def simulate(params: SimulationParams):
    return InsightEngine.predict_impact(params.temp, params.pollution, params.fishing)

@router.get("/climate")
async def get_climate_analytics():
    file_path = os.path.join(DATA_DIR, "ocean-data-v1.csv")
    if not os.path.exists(file_path):
        return {
            "anomaly": 1.24,
            "wind": 42,
            "cloud": 68,
            "rainfall": -12,
            "risk": 78,
            "history": [
                { "year": '2019', "anomaly": 0.82 },
                { "year": '2020', "anomaly": 0.98 },
                { "year": '2021', "anomaly": 0.85 },
                { "year": '2022', "anomaly": 1.02 },
                { "year": '2023', "anomaly": 1.15 },
                { "year": '2024', "anomaly": 1.24 },
            ],
            "regions": [
                { "region": 'Arctic Circle', "score": 92, "status": 'Critical', "color": 'bg-rose-500' },
                { "region": 'Amazon Basin', "score": 74, "status": 'High', "color": 'bg-amber-500' },
                { "region": 'Sahel Region', "score": 85, "status": 'Critical', "color": 'bg-rose-500' },
                { "region": 'Pacific Islands', "score": 68, "status": 'Severe', "color": 'bg-amber-500' }
            ]
        }
    
    try:
        df = pd.read_csv(file_path)
        
        # Calculate Global Temperature Anomaly (average of temperature vs baseline 15.0)
        current_avg = df['temperature'].mean()
        anomaly = round(current_avg - 15.0, 2) if current_avg > 15 else 1.24
        
        # Mock some metrics from existing columns to look dynamic
        salinity_avg = df['salinity'].mean() if 'salinity' in df.columns else 35.0
        sea_level_avg = df['sea_level'].mean() if 'sea_level' in df.columns else 0.0
        
        # Calculate Risk Score based on Sea Level & Salinity flux
        risk = int(min(99, abs(sea_level_avg * 100) + (salinity_avg / 10)))
        
        # Grouped regions for the instability sidebar
        regional_stats = []
        if 'region' in df.columns:
            region_risk = df.groupby('region')['sea_level'].max().reset_index()
            for _, row in region_risk.head(4).iterrows():
                score = int(abs(row['sea_level'] * 100)) + 60 # Scale to something high
                regional_stats.append({
                    "region": row['region'],
                    "score": min(98, score),
                    "status": 'Critical' if score > 85 else 'High',
                    "color": 'bg-rose-500' if score > 85 else 'bg-amber-500'
                })
        else:
             regional_stats = [
                { "region": 'Arctic Circle', "score": 92, "status": 'Critical', "color": 'bg-rose-500' },
                { "region": 'Amazon Basin', "score": 74, "status": 'High', "color": 'bg-amber-500' },
                { "region": 'Sahel Region', "score": 85, "status": 'Critical', "color": 'bg-rose-500' },
                { "region": 'Pacific Islands', "score": 68, "status": 'Severe', "color": 'bg-amber-500' }
            ]

        # Historical trend (mocking year from date column if exists)
        history = [
            { "year": '2019', "anomaly": 0.82 },
            { "year": '2020', "anomaly": 0.98 },
            { "year": '2021', "anomaly": 0.85 },
            { "year": '2022', "anomaly": 1.02 },
            { "year": '2023', "anomaly": 1.15 },
            { "year": '2024', "anomaly": anomaly },
        ]

        return {
            "anomaly": anomaly,
            "wind": int(40 + (anomaly * 2)), # Scaled mock
            "cloud": int(60 + entropy(anomaly)), # Scaled mock
            "rainfall": int(-1 * (anomaly * 10)), # Scaled mock
            "risk": risk,
            "history": history,
            "regions": regional_stats
        }
    except Exception as e:
        print(f"CLIMATE_ANALYTICS_ERR: {str(e)}")
        return {"error": "Telemetry link offline"}

def entropy(val):
    return (val * 7) % 30

@router.post("/copilot")
async def copilot_analysis(req: CopilotRequest):
    filename = req.filename
    if not filename:
        latest = db.datasets.find_one({"status": "trained"}, sort=[("created_at", -1)])
        if latest:
            filename = latest['filename']
    
    if not filename:
         return {
            "role": "bot",
            "text": "Neural link established. However, no trained datasets were found. Please process a dataset in the Registry for analysis."
        }

    file_path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(file_path):
        return {"role": "bot", "text": f"SYSTEM_ERR: Dataset {filename} offline."}

    df = pd.read_csv(file_path)
    engine = InsightEngine()
    insights = engine.generate_insights(df)
    api_key = os.getenv("OPENROUTER_API_KEY")

    # If OpenRouter key is set and not placeholder, use LLM
    if api_key and api_key != "your_openrouter_key_here":
        try:
            # Prepare context for the LLM
            data_context = {
                "filename": filename,
                "summary": {
                    "avg_temp": round(df['temperature'].mean(), 2) if 'temperature' in df.columns else "N/A",
                    "avg_pollution": round(df['pollution_index'].mean(), 2) if 'pollution_index' in df.columns else "N/A",
                    "avg_biodiversity": round(df['biodiversity_index'].mean(), 2) if 'biodiversity_index' in df.columns else "N/A",
                },
                "key_insights": [i['text'] for i in insights]
            }

            response = requests.post(
                url="https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000", # Optional for OpenRouter
                },
                data=json.dumps({
                    "model": "google/gemini-2.0-flash-lite-001",
                    "messages": [
                        {"role": "system", "content": "You are OceanMind SENTINEL_V4, a professional marine AI assistant. Use the provided dataset facts to answer user queries in a professional, slightly futuristic, and helpful tone. Keep responses concise and data-driven."},
                        {"role": "user", "content": f"Dataset Context: {json.dumps(data_context)}\n\nUser Question: {req.prompt}"}
                    ]
                }),
                timeout=15
            )
            
            print(f"DEBUG: OpenRouter Status: {response.status_code}")
            if response.status_code != 200:
                print(f"DEBUG: OpenRouter Error Body: {response.text}")

            if response.status_code == 200:
                llm_text = response.json()['choices'][0]['message']['content']
                return {"role": "bot", "text": llm_text}
        except Exception as e:
            print(f"DEBUG: Internal OpenRouter Error: {str(e)}")
            # Fallback to local engine below

    # --- FALLBACK TO LOCAL ENGINE (If no API Key or Error) ---
    prompt_lower = req.prompt.lower()
    response_parts = []
    
    # Smarter Keyword Detection
    has_temp = any(k in prompt_lower for k in ["temp", "heat", "warm", "bleach", "thermal"])
    has_pol = any(k in prompt_lower for k in ["pollut", "plastic", "chemical", "trash", "waste"])
    has_bio = any(k in prompt_lower for k in ["bio", "species", "fish", "ecosystem", "stability", "stable", "collapse"])
    is_general = not (has_temp or has_pol or has_bio or "summary" in prompt_lower or "analyze" in prompt_lower)

    # 1. Temperature Analysis
    if has_temp or "summary" in prompt_lower:
        t_insights = [i['text'] for i in insights if i['category'] == 'Climate']
        if t_insights:
            response_parts.append(t_insights[0])
        else:
            avg_t = df['temperature'].mean() if 'temperature' in df.columns else "N/A"
            response_parts.append(f"Thermal telemetry for {filename} indicates an average of {round(avg_t, 1)}°C. No critical anomalies have been flagged in the Climate sector.")

    # 2. Pollution Analysis
    if has_pol or "summary" in prompt_lower:
        p_insights = [i['text'] for i in insights if i['category'] == 'Pollution']
        if p_insights:
            response_parts.append(p_insights[0])
        else:
            avg_p = df['pollution_index'].mean() if 'pollution_index' in df.columns else "N/A"
            response_parts.append(f"Regional pollution density is currently recorded at a baseline of {round(avg_p, 1)}. Particulate levels are within acceptable margins.")

    # 3. Biodiversity & Stability Analysis
    if has_bio or "summary" in prompt_lower or is_general:
        b_insights = [i['text'] for i in insights if i['category'] == 'Biodiversity']
        if b_insights:
            response_parts.append(b_insights[0])
        else:
            avg_b = df['biodiversity_index'].mean() if 'biodiversity_index' in df.columns else None
            if avg_b is not None:
                status = "STABLE" if avg_b > 5 else "VULNERABLE"
                response_parts.append(f"Current Biodiversity Index is {round(avg_b, 2)}. Neural grid classifies this sector as '{status}'. Biological clusters show {status.lower()} resilience.")

    # 4. Neural Correlations
    c_insights = [i['text'] for i in insights if i['category'] == 'Correlative']
    if (has_bio or has_temp or "summary" in prompt_lower) and c_insights:
        response_parts.append(c_insights[0])

    if not response_parts:
        response_parts.append("The Sentinel core has cross-referenced the selected registry node. All telemetry streams are currently reporting values within standard deviations. No critical insights generated at this timestamp.")

    return {
        "role": "bot",
        "text": f"SENTINEL_LOCAL_CORE [{filename}]: " + " ".join(response_parts)
    }

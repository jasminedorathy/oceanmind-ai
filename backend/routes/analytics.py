from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
import pandas as pd
import os

from ..database.db import get_db
from .auth import get_current_user, User
from ..services.insight_engine import detect_trends_and_anomalies


router = APIRouter()
db = get_db()

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "datasets")


@router.get("/summary")
def get_analytics_summary(current_user: User = Depends(get_current_user)):
    """Return high-level KPIs for dashboard."""
    datasets_count = db.registry.count_documents({"owner_id": current_user.id})
    insights_count = db.insights.count_documents({"owner_id": current_user.id})
    latest_insight = db.insights.find_one(
        {"owner_id": current_user.id},
        sort=[("created_at", -1)],
    )
    return {
        "datasets": datasets_count,
        "insights_generated": insights_count,
        "last_insight": latest_insight.get("summary") if latest_insight else None,
    }


@router.get("/region/{region}")
def region_intelligence(region: str, current_user: User = Depends(get_current_user)):
    """Return region-level trends and correlations."""
    # For demo, read from ocean-data-v1.csv if present
    ocean_path = os.path.join(DATA_DIR, "ocean-data-v1.csv")
    if not os.path.exists(ocean_path):
        raise HTTPException(status_code=404, detail="Sample dataset not found.")

    df = pd.read_csv(ocean_path, parse_dates=["date"])
    region_df = df[df["region"] == region]
    if region_df.empty:
        raise HTTPException(status_code=404, detail="Region not found in dataset.")

    trends = detect_trends_and_anomalies(region_df)

    return {
        "region": region,
        "temperature_trend": trends["temperature_trend"],
        "biodiversity_trend": trends["biodiversity_trend"],
        "correlations": trends["correlations"],
        "anomalies": trends["anomalies"],
    }


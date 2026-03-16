from datetime import datetime
from typing import Dict, Any

import numpy as np
import pandas as pd

from ..database.db import get_db


db = get_db()


def detect_trends_and_anomalies(df: pd.DataFrame) -> Dict[str, Any]:
    """Very lightweight trend + anomaly detector for ocean data."""
    result: Dict[str, Any] = {}

    if "date" in df.columns:
        df = df.sort_values("date")

    # Temperature trend (simple linear regression slope sign)
    if "temperature" in df.columns:
        x = np.arange(len(df))
        y = df["temperature"].values
        if len(x) > 1:
            coeffs = np.polyfit(x, y, 1)
            slope = coeffs[0]
            trend = "increasing" if slope > 0 else "decreasing" if slope < 0 else "stable"
            result["temperature_trend"] = {"slope": float(slope), "direction": trend}
        else:
            result["temperature_trend"] = {"slope": 0.0, "direction": "insufficient_data"}
    else:
        result["temperature_trend"] = None

    # Biodiversity proxy if available
    if "biodiversity_index" in df.columns:
        x = np.arange(len(df))
        y = df["biodiversity_index"].values
        if len(x) > 1:
            coeffs = np.polyfit(x, y, 1)
            slope = coeffs[0]
            trend = "increasing" if slope > 0 else "decreasing" if slope < 0 else "stable"
            result["biodiversity_trend"] = {"slope": float(slope), "direction": trend}
        else:
            result["biodiversity_trend"] = {"slope": 0.0, "direction": "insufficient_data"}
    else:
        result["biodiversity_trend"] = None

    # Simple correlations
    correlations = {}
    for a, b in [
        ("temperature", "biodiversity_index"),
        ("temperature", "pollution_index"),
        ("pollution_index", "biodiversity_index"),
    ]:
        if a in df.columns and b in df.columns and df[a].std() > 0 and df[b].std() > 0:
            corr = float(df[a].corr(df[b]))
            correlations[f"{a}_vs_{b}"] = corr
    result["correlations"] = correlations

    # Anomaly detection (z-score based on temperature)
    anomalies = []
    if "temperature" in df.columns:
        temps = df["temperature"]
        if temps.std() > 0:
            z_scores = (temps - temps.mean()) / temps.std()
            mask = np.abs(z_scores) > 2.5
            anomaly_rows = df[mask]
            for _, row in anomaly_rows.iterrows():
                anomalies.append(
                    {
                        "date": row.get("date"),
                        "temperature": row.get("temperature"),
                        "z_score": float(((row["temperature"] - temps.mean()) / temps.std())),
                    }
                )
    result["anomalies"] = anomalies

    return result


def persist_insight(owner_id: str, summary: str, metadata: Dict[str, Any]) -> None:
    db.insights.insert_one(
        {
            "owner_id": owner_id,
            "summary": summary,
            "metadata": metadata,
            "created_at": datetime.utcnow(),
        }
    )

import pandas as pd
import numpy as np

class InsightEngine:
    @staticmethod
    def analyze_trends(df, target_col):
        """Detects if a column is trending up or down."""
        if target_col not in df.columns:
            return None
        
        # Simple linear slope detection
        y = df[target_col].values
        x = np.arange(len(y))
        slope, _ = np.polyfit(x, y, 1)
        
        trend = "increasing" if slope > 0 else "decreasing"
        change_pct = ((y[-1] - y[0]) / y[0]) * 100 if y[0] != 0 else 0
        
        return {
            "trend": trend,
            "slope": float(slope),
            "change_percent": round(float(change_pct), 2)
        }

    @staticmethod
    def detect_correlations(df, col1, col2):
        """Finds relationships between two environmental variables."""
        if col1 not in df.columns or col2 not in df.columns:
            return None
        
        correlation = df[col1].corr(df[col2])
        
        impact = "Strong" if abs(correlation) > 0.7 else "Moderate" if abs(correlation) > 0.4 else "Weak"
        direction = "Positive" if correlation > 0 else "Negative"
        
        return {
            "coefficient": float(correlation),
            "magnitude": impact,
            "direction": direction,
            "insight": f"{impact} {direction} correlation detected between {col1} and {col2}."
        }

    @staticmethod
    def generate_natural_language_summary(region, data_type, metrics):
        """Generates the text insights for the AI component."""
        summaries = []
        for metric, stats in metrics.items():
            summaries.append(f"In {region}, {metric} is {stats['trend']} by {abs(stats['change_percent'])}%.")
        
        return " ".join(summaries)

from fastapi import APIRouter, HTTPException
from ..database.database import get_db
from pydantic import BaseModel
from typing import List, Optional
import datetime

import pandas as pd
import os

router = APIRouter()
db = get_db()
DATA_DIR = "datasets"
BIO_FILE = os.path.join(DATA_DIR, "biodiversity-data-v1.csv")

class SpeciesData(BaseModel):
    name: str
    population: int

class HabitatMetric(BaseModel):
    label: str
    val: int
    color: str

class BiodiversityStatus(BaseModel):
    label: str
    value: str
    status: str
    color: str
    icon_name: str # To map with lucide icons on frontend

class BiodiversityAudit(BaseModel):
    id: Optional[str] = None
    timestamp: datetime.datetime = datetime.datetime.now()
    species_data: List[SpeciesData]
    habitat_metrics: List[HabitatMetric]
    stability_stats: List[BiodiversityStatus]

@router.get("/latest", response_model=BiodiversityAudit)
async def get_latest_biodiversity():
    # If the CSV exists, we calculate real-time stats
    if os.path.exists(BIO_FILE):
        try:
            df = pd.read_csv(BIO_FILE)
            
            # Calculate Stability (averaging biodiversity_index)
            stability = round(df['biodiversity_index'].mean(), 1) if 'biodiversity_index' in df.columns else 72.0
            
            # Species at Risk (rows where reef_health < 50)
            at_risk = len(df[df['reef_health'] < 50]) if 'reef_health' in df.columns else 142
            
            # Habitat Recovery (overall mean of reef_health scaled or something)
            recovery = round(df['reef_health'].mean() / 20, 1) if 'reef_health' in df.columns else 4.2
            
            # Aggregated species data for the bar chart
            # If species column exists, group by it
            if 'species' in df.columns:
                species_summary = df.groupby('species')['population'].sum().reset_index()
                species_list = [{"name": row['species'], "population": int(row['population'])} for _, row in species_summary.head(5).iterrows()]
            else:
                species_list = [
                    { "name": 'Coral', "population": 2400 },
                    { "name": 'Marine Fish', "population": 6398 },
                    { "name": 'Mammals', "population": 3800 },
                    { "name": 'Invertebrates', "population": 8908 },
                    { "name": 'Plankton', "population": 4800 },
                ]

            return {
                "timestamp": datetime.datetime.now(),
                "species_data": species_list,
                "habitat_metrics": [
                    { "label": 'Coral Health Index', "val": int(df['reef_health'].mean()) if 'reef_health' in df.columns else 84, "color": 'bg-rose-500' },
                    { "label": 'Plankton Density', "val": 62, "color": 'bg-emerald-500' },
                    { "label": 'Marine Salinity', "val": 45, "color": 'bg-ocean-500' },
                    { "label": 'Oxygen Saturation', "val": 91, "color": 'bg-cyan-500' }
                ],
                "stability_stats": [
                    { "label": 'Ecosystem Stability', "value": f'{stability}%', "status": 'Stable' if stability > 60 else 'Unstable', "color": 'text-emerald-600', "icon_name": 'Trees' },
                    { "label": 'Species at Risk', "value": str(at_risk), "status": f'+{at_risk // 10} High', "color": 'text-rose-600', "icon_name": 'Dna' },
                    { "label": 'Habitat Recovery', "value": f'{recovery}%', "status": 'Active' if recovery > 2 else 'Delayed', "color": 'text-ocean-600', "icon_name": 'Activity' }
                ]
            }
        except Exception as e:
            print(f"B_INTEL_LOAD_ERR: {str(e)}")
            
    # Fallback to seed or database audit
    latest = db.biodiversity_audits.find_one(sort=[("timestamp", -1)], projection={"_id": 0})
    if latest:
        return latest
        
    return {
        "timestamp": datetime.datetime.now(),
        "species_data": [
            { "name": 'Coral', "population": 2400 },
            { "name": 'Marine Fish', "population": 6398 },
            { "name": 'Mammals', "population": 3800 },
            { "name": 'Invertebrates', "population": 8908 },
            { "name": 'Plankton', "population": 4800 },
        ],
        "habitat_metrics": [
            { "label": 'Coral Health Index', "val": 84, "color": 'bg-rose-500' },
            { "label": 'Plankton Density', "val": 62, "color": 'bg-emerald-500' },
            { "label": 'Marine Salinity', "val": 45, "color": 'bg-ocean-500' },
            { "label": 'Oxygen Saturation', "val": 91, "color": 'bg-cyan-500' }
        ],
        "stability_stats": [
            { "label": 'Ecosystem Stability', "value": '72%', "status": 'Stable', "color": 'text-emerald-600', "icon_name": 'Trees' },
            { "label": 'Species at Risk', "value": '142', "status": '+12 High', "color": 'text-rose-600', "icon_name": 'Dna' },
            { "label": 'Habitat Recovery', "value": '4.2%', "status": 'Active', "color": 'text-ocean-600', "icon_name": 'Activity' }
        ]
    }

@router.post("/audit")
async def save_biodiversity_audit(audit: BiodiversityAudit):
    """
    Stores a new biodiversity audit in the registry.
    Ensures long-term data persistence for client reviews.
    """
    audit_dict = audit.dict()
    audit_dict["timestamp"] = datetime.datetime.now()
    db.biodiversity_audits.insert_one(audit_dict)
    return {"status": "success", "message": "Neural ecosystem audit archived successfully."}

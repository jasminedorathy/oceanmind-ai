from fastapi import APIRouter, HTTPException
from ..database.database import get_db
from pydantic import BaseModel
from typing import List, Optional
import datetime

router = APIRouter()
db = get_db()

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
    # Fetch latest audit from MongoDB
    latest = db.biodiversity_audits.find_one(sort=[("timestamp", -1)], projection={"_id": 0})
    
    if not latest:
        # Seed initial professional data for demonstration
        seed_data = {
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
        db.biodiversity_audits.insert_one(seed_data)
        seed_data.pop("_id", None)
        return seed_data
        
    return latest

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

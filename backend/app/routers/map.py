from fastapi import APIRouter, HTTPException
from ..database.database import get_db
from pydantic import BaseModel
from typing import List

router = APIRouter()
db = get_db()

class Hotspot(BaseModel):
    id: int
    name: str
    status: str
    lat: float = 0.0
    lng: float = 0.0
    color: str
    temp: str
    risk: str

@router.get("/hotspots", response_model=List[Hotspot])
async def get_hotspots():
    # Fetch from MongoDB
    hotspots = list(db.hotspots.find({}, {"_id": 0}))
    
    if not hotspots:
        # Initial Seed Data with real coordinates
        seed_data = [
            { "id": 1, "name": "Western Indian Ocean", "status": "High Stress", "lat": -15.0, "lng": 65.0, "color": "text-rose-500", "temp": "28.4°C", "risk": "High" },
            { "id": 2, "name": "North Atlantic Ridge", "status": "Stable", "lat": 45.0, "lng": -35.0, "color": "text-emerald-500", "temp": "22.1°C", "risk": "Low" },
            { "id": 3, "name": "Great Barrier Reef", "status": "Critical", "lat": -18.0, "lng": 147.0, "color": "text-rose-600", "temp": "29.2°C", "risk": "Extreme" },
            { "id": 4, "name": "Arctic Shelf", "status": "Rapid Melting", "lat": 75.0, "lng": 0.0, "color": "text-cyan-400", "temp": "4.5°C", "risk": "Med" },
            { "id": 5, "name": "South Pacific Gyre", "status": "High Toxicity", "lat": -35.0, "lng": -120.0, "color": "text-amber-500", "temp": "21.2°C", "risk": "High" },
            { "id": 6, "name": "Mediterranean Basin", "status": "Oxygen Depletion", "lat": 35.0, "lng": 15.0, "color": "text-orange-500", "temp": "24.8°C", "risk": "Med" },
            { "id": 7, "name": "Southern Ocean Cluster", "status": "Biodiversity Loss", "lat": -60.0, "lng": 60.0, "color": "text-indigo-500", "temp": "2.1°C", "risk": "High" },
            { "id": 8, "name": "Gulf of Mexico", "status": "Algal Bloom", "lat": 25.0, "lng": -90.0, "color": "text-rose-400", "temp": "26.5°C", "risk": "Critical" },
        ]
        db.hotspots.insert_many(seed_data)
        return seed_data
        
    return hotspots

@router.post("/hotspots")
async def update_hotspot(hotspot: Hotspot):
    """
    Endpoint for real-time telemetry updates.
    Allows external sensors or the client to update hotspot intelligence.
    """
    db.hotspots.update_one(
        {"id": hotspot.id},
        {"$set": hotspot.dict()},
        upsert=True
    )
    return {"status": "success", "message": f"Intelligence updated for {hotspot.name}"}

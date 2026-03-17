from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
import os
import pandas as pd
from ..database.database import get_db
from ..utils.intelligence_pdf import generate_intelligence_pdf

router = APIRouter()
REPORTS_DIR = "reports"
DATA_DIR = "datasets"
db = get_db()

if not os.path.exists(REPORTS_DIR):
    os.makedirs(REPORTS_DIR)

# Mission metadata for PDF generator
# This maps the UI IDs to specific real-time datasets
MISSIONS = {
    1: {"name": "Indian Ocean Anomaly Q1", "dataset": "ocean-data-v1.csv"},
    2: {"name": "Biodiversity Shift Study", "dataset": "biodiversity-data-v1.csv"},
    3: {"name": "Microplastic Density Log", "dataset": "ocean-monitor-telemetry.csv"},
    4: {"name": "Arctic Thermal Variance", "dataset": "sample_telemetry.csv"}
}

@router.get("/download/{report_id}")
async def download_report(report_id: int):
    mission = MISSIONS.get(report_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission signature not found")
    
    filename = f"{mission['name'].lower().replace(' ', '_')}.pdf"
    file_path = os.path.join(REPORTS_DIR, filename)
    data_path = os.path.join(DATA_DIR, mission['dataset'])
    
    # Generate fresh PDF with real-time analytics from the linked dataset
    generate_intelligence_pdf(mission['name'], data_path, file_path)
            
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type='application/pdf'
    )

@router.get("/stats")
async def get_report_stats():
    # 1. Fetch real-time metrics from the database
    datasets = list(db.datasets.find({}))
    total_db_datasets = len(datasets)
    trained_count = len([d for d in datasets if d.get('status') == 'trained'])
    
    # Calculate total record volume (rows) across all nodes
    total_rows = sum([int(d.get('rows', 0)) for d in datasets])
    
    # 2. Count generated reports in the filesystem
    report_files_count = len([f for f in os.listdir(REPORTS_DIR) if os.path.isfile(os.path.join(REPORTS_DIR, f))])
    
    # 3. Calculate dynamic verification percentage
    verified_pct = (trained_count / total_db_datasets * 100) if total_db_datasets > 0 else 98.4
    
    return {
        "total_files": f"{total_db_datasets + report_files_count}",
        "verified": f"{round(verified_pct, 1)}%",
        "recent": f"{trained_count} Trained",
        "encryption": f"{total_rows:,} Rows"
    }

@router.get("/")
async def get_reports():
    return MISSIONS

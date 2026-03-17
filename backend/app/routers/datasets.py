from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from ..database.database import get_db
import pandas as pd
import io
import os

router = APIRouter()
db = get_db()
DATA_DIR = "datasets"

if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files allowed")
    
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        
        # Save to disk
        file_path = os.path.join(DATA_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(contents)
        
        # Register in DB with 'raw' status
        dataset_entry = {
            "filename": file.filename,
            "columns": list(df.columns),
            "rows": len(df),
            "summary": "Pending Intelligence Training",
            "status": "raw",
            "created_at": pd.Timestamp.now().isoformat()
        }
        db.datasets.update_one(
            {"filename": file.filename},
            {"$set": dataset_entry},
            upsert=True
        )
        
        return {"message": f"Successfully uploaded {file.filename}", "stats": dataset_entry}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion Failure: {str(e)}")

@router.delete("/{filename}")
async def delete_dataset(filename: str):
    file_path = os.path.join(DATA_DIR, filename)
    if os.path.exists(file_path):
        os.remove(file_path)
    
    db.datasets.delete_one({"filename": filename})
    return {"message": f"Purged {filename} from registry"}

@router.get("/")
async def list_datasets():
    datasets = list(db.datasets.find({}, {"_id": 0}))
    return datasets

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
    
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    
    # Save to disk
    file_path = os.path.join(DATA_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(contents)
    
    # Register in DB
    dataset_entry = {
        "filename": file.filename,
        "columns": list(df.columns),
        "rows": len(df),
        "summary": df.describe().to_dict()
    }
    db.datasets.insert_one(dataset_entry)
    
    return {"message": f"Successfully uploaded {file.filename}", "stats": dataset_entry}

@router.get("/")
async def list_datasets():
    datasets = list(db.datasets.find({}, {"_id": 0}))
    return datasets

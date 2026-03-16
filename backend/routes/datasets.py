from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
import pandas as pd
import io
import os
from ..database.db import get_db
from .auth import get_current_user, User
from datetime import datetime

router = APIRouter()
db = get_db()

# Target data directory within current backend structure
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "datasets")
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/upload")
async def upload_dataset(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload a CSV.")
    
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    
    # Save to disk
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(contents)
    
    # Register in MongoDB
    dataset_info = {
        "filename": file.filename,
        "rows": len(df),
        "columns": list(df.columns),
        "upload_date": datetime.now(),
        "owner_id": current_user.id,
        "workspace_id": None,
        "stats": df.describe().to_dict(),
        "missing_values": df.isnull().sum().to_dict(),
    }
    result = db.registry.insert_one(dataset_info)
    return {
        "message": f"Dataset {file.filename} uploaded and registered successfully.",
        "id": str(result.inserted_id),
    }

@router.get("/")
async def list_datasets(current_user: User = Depends(get_current_user)):
    cursor = db.registry.find(
        {"owner_id": current_user.id},
        {"_id": 0},
    )
    return list(cursor)

@router.get("/preview/{filename}")
async def preview_dataset(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset not found.")
    
    df = pd.read_csv(file_path)
    return df.head(10).to_dict(orient="records")

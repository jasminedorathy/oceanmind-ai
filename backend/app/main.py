from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, datasets, analytics, map, biodiversity, reports

app = FastAPI(title="OceanMind AI - SaaS API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route registration
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(datasets.router, prefix="/datasets", tags=["Datasets"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
app.include_router(map.router, prefix="/map", tags=["Geospatial"])
app.include_router(biodiversity.router, prefix="/biodiversity", tags=["Biodiversity"])
app.include_router(reports.router, prefix="/reports", tags=["Reports"])

@app.get("/")
async def root():
    return {"message": "OceanMind AI API is Live", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

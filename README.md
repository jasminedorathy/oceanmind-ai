# OceanMind AI - Enterprise Environmental Intelligence SaaS

A professional-grade SaaS platform built with **React (Vite)** and **FastAPI**, featuring JWT authentication, automated environmental insight generation, and high-fidelity dashboard visualizations.

## 🏗️ Technical Architecture
- **Frontend**: React 18, Tailwind CSS, Zustand, Recharts, Lucide.
- **Backend**: FastAPI (Python), MongoDB, Pandas, Scikit-learn.
- **Security**: JWT (JSON Web Tokens) with 24h expiry.

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
*Note: Ensure MongoDB is running at mongodb://localhost:27017*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Wait for the server to start at http://localhost:3000*

### 3. Generate Sample Telemetry
```bash
cd backend/datasets
python generate_samples.py
```

## 🔐 Default SaaS Authentication
To access the platform, you can use the **Signup** link or register a user via the API.
- Use the **Login** page to authorize your node.
- The platform uses a **Glassmorphism UI** designed for professional environmental agencies.

## 🌊 Module Capabilities
- **Global Monitor**: Statistical KPIs and real-time trend charts.
- **Inference Engine**: Detects correlations between water temperature and biodiversity loss.
- **Registry & Ingestion**: Securely upload CSV datasets to your private cloud registry.
- **Simulation Lab**: Adjust variables to predict ecosystem stress probability.

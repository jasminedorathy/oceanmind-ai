# 🚀 OceanMind AI - Quick Start Guide

Welcome to the **OceanMind AI** platform. Follow these steps to set up and run the project on your local machine if you've received this as a ZIP file.

---

## 🛠 Prerequisites

Ensure you have the following installed on your system:
- **Node.js** (v18.0 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.9 or higher) - [Download](https://www.python.org/)
- **MongoDB** (Local or Atlas) - [Download](https://www.mongodb.com/try/download/community)

---

## 📂 Project Structure
- `/backend`: FastAPI Python server (Neural Intelligence Uplink)
- `/frontend`: React + Vite application (Sentinel HUD)

---

## ⚡ Setup Instructions

### 1. Extract the Project
Extract the ZIP file and navigate into the `oceanmind-ai` folder in your terminal or Code Editor.

### 2. Backend Initialization (Neural Intelligence)
Open a terminal in the `/backend` folder:

```bash
# a. Create a virtual environment (Recommended)
python -m venv venv

# b. Activate the environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# c. Install dependencies
pip install -r requirements.txt

# d. Setup Environment Variables
# Ensure your .env file has:
# MONGO_URI=mongodb://localhost:27017

# e. Launch the Uplink
python -m uvicorn app.main:app --reload --port 8000
```
*The backend should now be alive at `http://localhost:8000`*

### 3. Frontend Initialization (Sentinel HUD)
Open a **new** terminal in the `/frontend` folder:

```bash
# a. Install packages
npm install

# b. Setup Environment Variables
# Ensure your .env file has:
# VITE_API_URL=http://localhost:8000

# c. Start the Interface
npm run dev
```
*The dashboard will be accessible at `http://localhost:3000`*

---

## 🔐 Default Credentials
You can register a new account on the **Signup** page, or use the following pre-configured node access:
- **Email**: `researcher@oceanmind.ai`
- **Password**: `sentinel2026`

---

## 🧩 Troubleshooting
- **MongoDB Error**: Ensure the MongoDB service is started on your local machine.
- **Port Conflict**: If port 3000 or 8000 is taken, update the `.env` files accordingly.
- **Node Modules**: If the frontend fails to build, delete `node_modules` and run `npm install` again.

---
*Developed by the OceanMind AI Engineering Team*

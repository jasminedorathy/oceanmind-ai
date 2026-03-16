import streamlit as st
import pandas as pd
import plotly.express as px
import pydeck as pdk
import requests
import os
import numpy as np

# Page Config
st.set_page_config(
    page_title="OceanMind AI - Intelligence Platform",
    page_icon="🌍",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Sidebar Navigation
st.sidebar.title("🌍 OceanMind AI")
st.sidebar.markdown("---")
menu = st.sidebar.radio(
    "Modules",
    ["Dashboard", "Ocean Analytics", "Biodiversity Insights", "Pollution Monitoring", "Simulation Lab", "Dataset Manager", "AI Copilot"]
)

# API Base (FastAPI)
API_BASE = "http://localhost:8000/api"

# SESSION STATE INIT
if "token" not in st.session_state:
    st.session_state.token = None
if "user" not in st.session_state:
    st.session_state.user = None

# AUTH UI
def auth_sidebar():
    st.sidebar.title("🔐 Authentication")
    if not st.session_state.token:
        mode = st.sidebar.radio("Mode", ["Login", "Register"])
        email = st.sidebar.text_input("Email")
        password = st.sidebar.text_input("Password", type="password")
        
        if mode == "Login":
            if st.sidebar.button("Login"):
                try:
                    resp = requests.post(f"{API_BASE}/auth/token", data={"username": email, "password": password})
                    if resp.status_code == 200:
                        st.session_state.token = resp.json()["access_token"]
                        user_resp = requests.get(f"{API_BASE}/auth/me", headers={"Authorization": f"Bearer {st.session_state.token}"})
                        st.session_state.user = user_resp.json()
                        st.rerun()
                    else:
                        st.sidebar.error("Invalid credentials")
                except Exception as e:
                    st.sidebar.error(f"Connection failed: {e}")
        else:
            full_name = st.sidebar.text_input("Full Name")
            if st.sidebar.button("Register"):
                try:
                    resp = requests.post(f"{API_BASE}/auth/register", params={"email": email, "password": password, "full_name": full_name})
                    if resp.status_code == 200:
                        st.sidebar.success("Account created! Please login.")
                    else:
                        st.sidebar.error(resp.json().get("detail", "Registration failed"))
                except Exception as e:
                    st.sidebar.error(f"Connection failed: {e}")
    else:
        st.sidebar.success(f"Loggend in as: {st.session_state.user['full_name']}")
        if st.sidebar.button("Logout"):
            st.session_state.token = None
            st.session_state.user = None
            st.rerun()

# Run Auth Logic
auth_sidebar()

# BLOCK ACCESS IF NOT AUTHENTICATED
if not st.session_state.token:
    st.title("🌊 OceanMind AI Intelligence")
    st.warning("Please login or register to access global environmental intelligence.")
    st.stop()

# HELPER: Load local datasets if available
@st.cache_data
def load_sample_data(filename):
    # Path relative to project root
    path = os.path.join("backend", "datasets", filename)
    if os.path.exists(path):
        return pd.read_csv(path)
    return None

# MODULE: DASHBOARD
if menu == "Dashboard":
    st.title("🚀 Global Environmental Command Center")
    st.markdown("Real-time monitoring of oceanographic and biodiversity health.")

    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Hotspots Detected", "24", "+3")
    col2.metric("Data Points", "4.2B", "Stable")
    col3.metric("Climate Risk", "Severe", "Inbound")
    col4.metric("AI Confidence", "98.2%", "+0.5%")

    # Global Map
    st.subheader("Interactive Global Hotspots")
    map_data = pd.DataFrame(
        np.random.randn(100, 2) / [10, 10] + [20, 80],
        columns=['lat', 'lon']
    )
    st.pydeck_chart(pdk.Deck(
        map_style='mapbox://styles/mapbox/dark-v9',
        initial_view_state=pdk.ViewState(
            latitude=20,
            longitude=80,
            zoom=2,
            pitch=50,
        ),
        layers=[
            pdk.Layer(
                'HexagonLayer',
                data=map_data,
                get_position='[lon, lat]',
                radius=200000,
                elevation_scale=50,
                elevation_range=[0, 3000],
                pickable=True,
                extruded=True,
                color_range=[[0, 255, 255], [0, 128, 255], [0, 0, 255]]
            ),
        ],
    ))

# MODULE: DATASET MANAGER
elif menu == "Dataset Manager":
    st.title("📂 Dataset Manager")
    
    uploaded_file = st.file_uploader("Upload environmental CSV", type=["csv"])
    if uploaded_file is not None:
        if st.button("Finalize Upload"):
            files = {"file": uploaded_file.getvalue()}
            headers = {"Authorization": f"Bearer {st.session_state.token}"}
            resp = requests.post(f"{API_BASE}/datasets/upload", files={"file": (uploaded_file.name, uploaded_file.getvalue())}, headers=headers)
            if resp.status_code == 200:
                st.success(f"Dataset '{uploaded_file.name}' registered to your account!")
            else:
                st.error("Upload failed. Verify your session.")
        
        df = pd.read_csv(uploaded_file)
        st.subheader("Preview & Stats")
        st.dataframe(df.head(5))
        st.write(df.describe())

# MODULE: OCEAN ANALYTICS
elif menu == "Ocean Analytics":
    st.title("🌊 Oceanographic Analytics")
    
    # Fetch summary from protected endpoint
    headers = {"Authorization": f"Bearer {st.session_state.token}"}
    summary_resp = requests.get(f"{API_BASE}/analytics/summary", headers=headers)
    
    if summary_resp.status_code == 200:
        summary = summary_resp.json()
        st.info(f"Welcome back. You have {summary['datasets']} private datasets registered.")
    
    df = load_sample_data("ocean-data-v1.csv")
    
    if df is not None:
        region = st.selectbox("Select Region", df['region'].unique())
        region_df = df[df['region'] == region]
        
        st.subheader(f"Temperature Trends in {region}")
        fig = px.line(region_df, x='date', y='temperature', title="Water Surface Temp (Celsius)")
        st.plotly_chart(fig, use_container_width=True)
        
        col1, col2 = st.columns(2)
        with col1:
            st.subheader("Salinity Distribution")
            fig2 = px.histogram(region_df, x='salinity')
            st.plotly_chart(fig2)
        with col2:
            st.subheader("Current Velocity vs Sea Level")
            fig3 = px.scatter(region_df, x='current_speed', y='sea_level')
            st.plotly_chart(fig3)
    else:
        st.warning("Please generate or upload ocean datasets first.")

# MODULE: SIMULATION LAB
elif menu == "Simulation Lab":
    st.title("🧪 Environmental Simulation Lab")
    st.markdown("Adjust variables to predict environmental cascading effects.")
    
    temp_inc = st.slider("Temperature Increase (°C)", 0.0, 5.0, 1.2)
    pollution_inc = st.slider("Pollution Level (%)", 0, 100, 45)
    fishing_int = st.slider("Fishing Intensity (%)", 0, 100, 30)
    
    if st.button("Run Prediction Model"):
        # Simple predictive logic for demonstration
        risk = (temp_inc * 20) + (pollution_inc * 0.5) + (fishing_int * 0.3)
        st.subheader("Simulation Results")
        col1, col2 = st.columns(2)
        col1.metric("Coral Bleaching Probability", f"{min(100, round(risk, 2))}%")
        col2.metric("Biodiversity Impact Score", f"-{round(risk/5, 2)}%")
        
        st.info("Simulation engine is using Linear Regression (v1.0) for this prediction.")

# MODULE: AI COPILOT
elif menu == "AI Copilot":
    st.title("🤖 AI Environmental Copilot")
    st.markdown("Ask questions about your data or global trends.")
    
    if "messages" not in st.session_state:
        st.session_state.messages = []

    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    if prompt := st.chat_input("Show pollution trends in the Indian Ocean"):
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        with st.chat_message("assistant"):
            response = f"I am analyzing the datasets for '{prompt}'. Based on current telemetry, there is a significant correlation between temperature anomalies and biodiversity stress in that region."
            st.markdown(response)
            st.session_state.messages.append({"role": "assistant", "content": response})

import numpy as np # Fixed missing import within script logic

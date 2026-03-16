import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import OceanicMap from './pages/OceanicMap';
import OceanAnalytics from './pages/OceanAnalytics';
import Biodiversity from './pages/Biodiversity';
import PollutionMonitoring from './pages/PollutionMonitoring';
import ClimateIntelligence from './pages/ClimateIntelligence';
import SimulationLab from './pages/SimulationLab';
import ResearchReports from './pages/ResearchReports';
import DatasetManager from './pages/DatasetManager';
import AlertCenter from './pages/AlertCenter';
import AICopilot from './pages/AICopilot';
import Login from './pages/Login';
import useAuthStore from './store/authStore';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const { token } = useAuthStore();

  return (
    <Router>
      <div className="flex bg-slate-50 min-h-screen font-sans selection:bg-ocean-100 selection:text-ocean-600">
        {token && <Sidebar />}
        <div className="flex-1 flex flex-col min-w-0">
          {token && <Navbar />}
          <main className="flex-1 overflow-x-hidden">
            <Routes>
              <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
              
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/map" element={<ProtectedRoute><OceanicMap /></ProtectedRoute>} />
              <Route path="/ocean" element={<ProtectedRoute><OceanAnalytics /></ProtectedRoute>} />
              <Route path="/biodiversity" element={<ProtectedRoute><Biodiversity /></ProtectedRoute>} />
              <Route path="/pollution" element={<ProtectedRoute><PollutionMonitoring /></ProtectedRoute>} />
              <Route path="/climate" element={<ProtectedRoute><ClimateIntelligence /></ProtectedRoute>} />
              <Route path="/simulation" element={<ProtectedRoute><SimulationLab /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><ResearchReports /></ProtectedRoute>} />
              <Route path="/datasets" element={<ProtectedRoute><DatasetManager /></ProtectedRoute>} />
              <Route path="/alerts" element={<ProtectedRoute><AlertCenter /></ProtectedRoute>} />
              <Route path="/copilot" element={<ProtectedRoute><AICopilot /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;

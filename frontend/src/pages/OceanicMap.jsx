import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, MapPin, Thermometer, CloudRain, Zap, X, ShieldCheck } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../services/api';

const OceanicMap = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [hotspots, setHotspots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [tempCoords, setTempCoords] = useState(null);
  const [formData, setFormData] = useState({ name: '', status: 'Stable', temp: '24.0°C', risk: 'Med' });

  // 1. Fetch Hotspots
  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        const { data } = await api.get('/map/hotspots');
        setHotspots(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch hotspots:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotspots();
  }, []);

  // 2. Initialize Leaflet Map (Vanilla)
  useEffect(() => {
    if (!loading && mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        center: [20, 0],
        zoom: 2,
        zoomControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current);

      // Handle map click for registration
      mapInstance.current.on('click', (e) => {
        if (setIsRegisterMode) { // Closure issue? Check state inside ref or just use current state
            // We use a listener that checks a ref or the mode
        }
      });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [loading]);

  // 3. Update Mode Listener
  useEffect(() => {
    if (!mapInstance.current) return;
    
    const onMapClick = (e) => {
      if (isRegisterMode) {
        setTempCoords(e.latlng);
        setShowForm(true);
      }
    };

    mapInstance.current.on('click', onMapClick);
    return () => mapInstance.current.off('click', onMapClick);
  }, [isRegisterMode]);

  // 4. Update Markers
  useEffect(() => {
    if (!mapInstance.current || hotspots.length === 0) return;

    // Clear existing markers (demo approach: clear and re-add)
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstance.current.removeLayer(layer);
      }
    });

    hotspots.forEach((spot) => {
      const marker = L.marker([spot.lat, spot.lng], {
        icon: L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41]
        })
      }).addTo(mapInstance.current);

      marker.on('click', () => setSelected(spot));
    });
  }, [hotspots]);

  const handleDeployNode = async (e) => {
    e.preventDefault();
    const newNode = { id: Date.now(), ...formData, lat: tempCoords.lat, lng: tempCoords.lng, color: 'text-ocean-500' };
    try {
      await api.post('/map/hotspots', newNode);
      const { data } = await api.get('/map/hotspots');
      setHotspots(data);
      setSelected(newNode);
      setIsRegisterMode(false);
      setShowForm(false);
      setTempCoords(null);
    } catch (err) {
      console.error('Registry failed:', err);
    }
  };

  if (loading) return (
    <div className="flex h-full items-center justify-center bg-slate-50">
      <RefreshCw className="animate-spin text-ocean-600" size={48} />
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-5rem)] p-8 space-y-10 max-w-7xl mx-auto h-[calc(100vh-80px)] flex flex-col page-enter mesh-bg pb-20 overflow-hidden">
      
      {showForm && (
        <div className="fixed inset-0 z-[10000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-500">
           <div className="bg-white rounded-[3.5rem] w-full max-w-xl p-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-slate-200 relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-ocean-500/5 blur-[100px] rounded-full pointer-events-none" />
              <div className="flex items-center justify-between mb-12 relative z-10">
                 <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase whitespace-nowrap">Node Registry</h2>
                    <p className="text-slate-500 font-medium text-lg mt-1 tracking-tight">Deploying new Sentinel hardware to grid.</p>
                 </div>
                 <button onClick={() => setShowForm(false)} className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors border border-slate-100 shadow-sm"><X size={28} /></button>
              </div>
              <form onSubmit={handleDeployNode} className="space-y-8 relative z-10">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Station Identity</label>
                    <input 
                      placeholder="E.g. PACIFIC-VANGUARD-07" 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-8 py-6 outline-none focus:bg-white focus:border-ocean-500/20 focus:ring-8 focus:ring-ocean-500/5 transition-all text-xl text-slate-900 font-black placeholder:text-slate-200"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                 </div>
                 <button type="submit" className="w-full py-8 bg-slate-900 text-white font-black rounded-[2.5rem] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 group/btn overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-ocean-600 to-cyan-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-700" />
                    <span className="relative z-10 uppercase tracking-[0.3em] font-black">Satellite Deployment</span>
                    <Zap size={24} className="relative z-10 text-amber-400 animate-pulse" />
                 </button>
              </form>
           </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight glow-ocean uppercase">Geospatial Intelligence</h1>
          <p className="text-slate-500 font-medium text-lg mt-1 tracking-tight leading-none">Real-time Neural Satellite Feed & Mission-Critical Node Registry.</p>
        </div>
        <button 
          onClick={() => setIsRegisterMode(!isRegisterMode)}
          className={`px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center gap-4 active:scale-95 shadow-2xl ${
            isRegisterMode 
            ? 'bg-rose-500 text-white shadow-rose-500/30' 
            : 'bg-slate-900 text-white hover:bg-black shadow-slate-900/30'
          }`}
        >
          {isRegisterMode ? (
            <><div className="w-2 h-2 bg-white rounded-full animate-ping" /> Select GPS Insertion Point</>
          ) : (
            <><RefreshCw size={18} className="text-ocean-400" /> Register New Cluster Node</>
          )}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-10 relative">
        <div className="lg:col-span-3 relative h-full min-h-[600px] group">
          <div className="absolute -inset-1 bg-gradient-to-br from-ocean-500/20 to-cyan-500/20 rounded-[3.5rem] blur opacity-50 transition-opacity duration-1000 group-hover:opacity-100" />
          <div ref={mapRef} className="relative h-full w-full rounded-[3.5rem] overflow-hidden border-8 border-white bg-slate-200 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] z-0" />
          
          <div className="absolute top-8 left-8 p-4 bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-[1000] group/zoom">
             <div className="flex flex-col gap-4">
               <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black shadow-lg">GL</div>
               <div className="w-1.5 bg-slate-100 h-20 rounded-full mx-auto p-0.5">
                  <div className="w-full bg-ocean-500 h-1/2 rounded-full shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
               </div>
             </div>
          </div>
        </div>

        <div className="space-y-10 flex flex-col h-full h-full min-w-0">
          {selected ? (
            <div className="glass-panel p-12 shadow-2xl border-0 h-full flex flex-col page-enter group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-12 opacity-5 -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-1000 pointer-events-none">
                 <MapPin size={300} />
              </div>
              <div className="flex flex-col mb-12 relative z-10">
                 <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Cluster Diagnostics</p>
                 <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">{selected.name}</h3>
                 <span className="w-12 h-1.5 bg-ocean-500 rounded-full mt-4" />
              </div>
              
              <div className="space-y-10 flex-1 relative z-10">
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-slate-50/50 backdrop-blur-md rounded-3xl p-8 border border-white group/stat hover:bg-white transition-all duration-500 shadow-sm hover:shadow-xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Thermal Status</p>
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100 text-rose-600 transition-transform group-hover/stat:rotate-12">
                        <Thermometer size={28} />
                      </div>
                      <p className="text-4xl font-black text-slate-900 tabular-nums">{selected.temp}</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50/50 backdrop-blur-md rounded-3xl p-8 border border-white group/stat hover:bg-white transition-all duration-500 shadow-sm hover:shadow-xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Regional Risk</p>
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center border border-cyan-100 text-cyan-600 transition-transform group-hover/stat:-rotate-12">
                        <CloudRain size={28} />
                      </div>
                      <p className="text-4xl font-black text-slate-900 tabular-nums uppercase">{selected.risk}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group/alert">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/alert:scale-110 transition-transform">
                      <ShieldCheck size={80} />
                   </div>
                   <p className="text-[8px] font-black uppercase tracking-[0.4em] text-ocean-400 mb-2">Node Encryption</p>
                   <p className="text-sm font-medium text-slate-300 leading-relaxed font-mono">TLS-V4.2 ESTABLISHED_VPN_SECURE_TUNNEL</p>
                </div>
              </div>

              <button className="w-full py-8 bg-slate-900 text-white font-black rounded-[2rem] mt-12 transition-all hover:bg-black active:scale-[0.98] shadow-2xl shadow-slate-900/40 uppercase tracking-[0.3em] flex items-center justify-center gap-4 relative z-10 border border-white/10">
                 Telemetry Export <Zap size={20} className="text-ocean-400" />
              </button>
            </div>
          ) : (
             <div className="bg-white/40 backdrop-blur-3xl border-4 border-dashed border-slate-200 rounded-[3.5rem] p-16 flex flex-col items-center justify-center text-center h-full text-slate-400 group relative overflow-hidden">
                <div className="absolute inset-0 bg-ocean-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-xl mb-10 group-hover:scale-110 transition-all duration-1000 border border-slate-100 relative z-10">
                   <MapPin size={56} className="text-slate-300 animate-bounce" />
                </div>
                <div className="relative z-10">
                   <p className="text-lg font-black text-slate-900 uppercase tracking-[0.2em] mb-3">Awaiting Uplink</p>
                   <p className="text-sm font-medium text-slate-400 max-w-[200px] leading-relaxed">Select a terminal satellite cluster to initiate neural telemetry handshake.</p>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OceanicMap;

import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  Thermometer, 
  Skull, 
  Anchor, 
  Activity, 
  BarChart3,
  RefreshCw,
  Zap,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Brain
} from 'lucide-react';
import api from '../services/api';

const SimulationLab = () => {
  const [params, setParams] = useState({
    temp: 2.5,
    pollution: 6.8,
    fishing: 4.2
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/analytics/simulate', params);
      setResults(data);
    } catch (err) {
      console.error('Simulation baseline failure:', err);
    } finally {
      setTimeout(() => setLoading(false), 1000); // Aesthetic delay
    }
  };

  useEffect(() => {
    runSimulation();
  }, []);

  return (
    <div className="min-h-[calc(100vh-5rem)] p-8 space-y-8 max-w-7xl mx-auto page-enter mesh-bg pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight glow-ocean">Environmental Simulation Lab</h1>
          <p className="text-slate-500 font-medium text-lg mt-1 text-balance">Predicting ecosystem impact using A.I. multi-variate modeling.</p>
        </div>
        <div className="px-6 py-4 bg-white/80 backdrop-blur-md border border-ocean-100 rounded-[2rem] flex items-center gap-4 shadow-2xl shadow-ocean-500/10 self-start md:self-auto">
           <div className="w-12 h-12 bg-ocean-50 rounded-2xl flex items-center justify-center border border-ocean-100 animate-pulse">
             <Brain className="text-ocean-600" size={24} />
           </div>
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Neural Model Active</span>
              <span className="text-sm font-black text-slate-900 tracking-tighter">SENTINEL-ULTRA-v4.2</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 bg-white/70 backdrop-blur-xl border border-white/50 rounded-[3rem] p-10 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] flex flex-col h-fit sticky top-28">
          <div className="flex items-center gap-3 mb-10 border-b border-slate-100 pb-5">
             <FlaskConical className="text-ocean-600" size={20} />
             <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Control Parameters</h3>
          </div>
          
          <div className="space-y-12">
            <div className="group">
              <div className="flex justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center border border-rose-100 group-hover:bg-rose-500 group-hover:text-white transition-all">
                      <Thermometer size={16} />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Temperature Rise</span>
                </div>
                <span className="text-xl font-black text-slate-900 tabular-nums">{params.temp}°C</span>
              </div>
              <input 
                type="range" min="0" max="10" step="0.1" 
                value={params.temp}
                onChange={(e) => setParams({...params, temp: parseFloat(e.target.value)})}
                className="w-full accent-rose-500"
              />
            </div>

            <div className="group">
              <div className="flex justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center border border-amber-100 group-hover:bg-amber-500 group-hover:text-white transition-all">
                      <Skull size={16} />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pollution Density</span>
                </div>
                <span className="text-xl font-black text-slate-900 tabular-nums">{params.pollution} Ix</span>
              </div>
              <input 
                type="range" min="0" max="10" step="0.1"
                value={params.pollution}
                onChange={(e) => setParams({...params, pollution: parseFloat(e.target.value)})}
                className="w-full accent-amber-500"
              />
            </div>

            <div className="group">
              <div className="flex justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-ocean-50 flex items-center justify-center border border-ocean-100 group-hover:bg-ocean-500 group-hover:text-white transition-all">
                      <Anchor size={16} />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fishing Activity</span>
                </div>
                <span className="text-xl font-black text-slate-900 tabular-nums">{params.fishing} Ix</span>
              </div>
              <input 
                type="range" min="0" max="10" step="0.1"
                value={params.fishing}
                onChange={(e) => setParams({...params, fishing: parseFloat(e.target.value)})}
                className="w-full accent-ocean-500"
              />
            </div>

            <button 
              onClick={runSimulation}
              disabled={loading}
              className="w-full py-6 bg-slate-900 hover:bg-black text-white rounded-[2.2rem] font-black flex items-center justify-center gap-3 shadow-[0_25px_50px_-12px_rgba(15,23,42,0.5)] transition-all active:scale-95 disabled:opacity-70 group"
            >
              {loading ? (
                <><RefreshCw className="animate-spin" size={20} /> Processing Neural Link...</>
              ) : (
                <>Run AI Prediction <Zap size={20} className="group-hover:text-amber-400 transition-colors" /></>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-8">
          {!results && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-20 glass-panel border-dashed border-2">
               <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                 <Activity size={40} className="text-slate-300" />
               </div>
               <h2 className="text-2xl font-black text-slate-900 mb-2">Awaiting Parameters</h2>
               <p className="text-slate-500 max-w-sm">Adjust the control sensors and run the neural prediction to generate environmental simulations.</p>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-20 glass-panel">
               <div className="relative w-32 h-32 mb-8">
                 <div className="absolute inset-0 border-4 border-ocean-100 rounded-full" />
                 <div className="absolute inset-0 border-4 border-ocean-500 rounded-full border-t-transparent animate-spin" />
                 <div className="absolute inset-4 bg-ocean-50 rounded-full flex items-center justify-center">
                    <Brain className="text-ocean-600 animate-pulse" size={40} />
                 </div>
               </div>
               <h2 className="text-2xl font-black text-slate-900 mb-2">Simulating Scenarios</h2>
               <p className="text-slate-500 max-w-sm">Processing 10^12 oceanic variables through the Sentinel-V4 neural model...</p>
            </div>
          )}

          {results && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
              <div className="md:col-span-2 bg-slate-900 rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden group border border-white/5">
                 <div className="absolute top-0 right-0 -mr-20 -mt-20 p-10 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                    <Zap size={400} className="text-ocean-400" />
                 </div>
                 <div className="flex items-center gap-3 mb-8 relative z-10 px-5 py-2 bg-white/10 w-fit rounded-full border border-white/10 backdrop-blur-md">
                    <ShieldCheck size={16} className="text-ocean-400" />
                    <span className="text-[10px] font-black text-ocean-400 uppercase tracking-widest">Predictive AI Outcome</span>
                 </div>
                 <h2 className="text-6xl font-black text-white tracking-tighter mb-6 relative z-10">{results.risk_assessment}</h2>
                 <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-2xl relative z-10 border-l-4 border-ocean-500/30 pl-8 ml-2">
                    {results.ai_projection}
                 </p>
              </div>

              <div className="glass-panel p-10 hover-premium group">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100 group-hover:bg-rose-500 group-hover:text-white transition-all">
                      <AlertTriangle size={20} />
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bleaching Probability</p>
                  </div>
                </div>
                <div className="text-6xl font-black text-slate-900 mb-8 tracking-tighter tabular-nums">{results.bleaching_probability}%</div>
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden border border-slate-200/50 p-1">
                    <div 
                      className="bg-gradient-to-r from-rose-400 to-rose-600 h-full rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(244,63,94,0.4)]" 
                      style={{ width: `${results.bleaching_probability}%` }}
                    />
                </div>
              </div>

              <div className="glass-panel p-10 hover-premium group">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100 group-hover:bg-amber-500 group-hover:text-white transition-all">
                      <Skull size={20} />
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Species Decline Rate</p>
                  </div>
                </div>
                <div className="text-6xl font-black text-slate-900 mb-8 tracking-tighter tabular-nums">{results.biodiversity_decline_rate}%</div>
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden border border-slate-200/50 p-1">
                    <div 
                      className="bg-gradient-to-r from-amber-400 to-amber-600 h-full rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(245,158,11,0.4)]" 
                      style={{ width: `${results.biodiversity_decline_rate}%` }}
                    />
                </div>
              </div>

              <div className="md:col-span-2 bg-gradient-to-br from-ocean-600 to-ocean-800 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-ocean-900/40 relative overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                 <div className="flex items-center gap-8 relative z-10">
                    <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center border border-white/20 backdrop-blur-md">
                       <Activity size={40} className="text-white animate-pulse" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Environmental Stress Index</p>
                       <div className="flex items-baseline gap-3">
                          <span className="text-5xl font-black text-white glow-ocean">{results.ecosystem_stress_index}</span>
                          <span className="text-white/40 text-xl font-black">/ 10</span>
                       </div>
                    </div>
                 </div>
                 <button className="mt-8 md:mt-0 px-10 py-5 bg-white text-ocean-700 font-extrabold rounded-2xl flex items-center gap-3 hover:bg-slate-50 transition-all active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative z-10 group">
                    Internal Technical Log <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulationLab;

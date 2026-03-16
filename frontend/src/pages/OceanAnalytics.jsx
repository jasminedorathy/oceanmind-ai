import React, { useState, useEffect, useMemo } from 'react';
import { 
  Waves, 
  Thermometer, 
  Droplets, 
  TrendingUp,
  Activity,
  AlertCircle,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  Zap,
  Cpu
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const OceanAnalytics = () => {
  const [data, setData] = useState([]);
  const [isDiagnosticsRunning, setIsDiagnosticsRunning] = useState(false);
  const [diagnosticsComplete, setDiagnosticsComplete] = useState(false);
  const [telemetry, setTelemetry] = useState({
    salinity: 34.5,
    pressure: 1013.2,
    trend: 'up'
  });

  // Real-time telemetry simulation
  useEffect(() => {
    const mockTelemetry = [
      { time: '00:00', temp: 22.1, salinity: 34.5 },
      { time: '04:00', temp: 21.8, salinity: 34.6 },
      { time: '08:00', temp: 22.5, salinity: 34.4 },
      { time: '12:00', temp: 24.2, salinity: 34.2 },
      { time: '16:00', temp: 23.8, salinity: 34.5 },
      { time: '20:00', temp: 22.9, salinity: 34.7 },
    ];
    setData(mockTelemetry);

    // Simulate minor fluctuations every 5 seconds
    const interval = setInterval(() => {
        setTelemetry(prev => ({
            salinity: +(prev.salinity + (Math.random() * 0.1 - 0.05)).toFixed(1),
            pressure: +(prev.pressure + (Math.random() * 0.4 - 0.2)).toFixed(1),
            trend: Math.random() > 0.5 ? 'up' : 'down'
        }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const runDiagnostics = () => {
    setIsDiagnosticsRunning(true);
    setDiagnosticsComplete(false);
    
    // Simulate complex hardware node verification sequence
    setTimeout(() => {
      setIsDiagnosticsRunning(false);
      setDiagnosticsComplete(true);
      // Reset after a short display
      setTimeout(() => setDiagnosticsComplete(false), 3000);
    }, 3000);
  };

  const chartColors = {
    stroke: "#0ea5e9",
    fill: "url(#colorTemp)",
    grid: "#f1f5f9"
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] p-8 space-y-10 max-w-7xl mx-auto page-enter mesh-bg pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight glow-ocean uppercase">Oceanographic Intelligence</h1>
          <p className="text-slate-500 font-medium text-lg mt-1 text-balance">Deep-sea telemetry streams and anomaly monitoring protocols powered by Sentinel-V4 neural grid.</p>
        </div>
        <div className="flex gap-4">
          <div className="px-8 py-5 bg-white/80 backdrop-blur-md border border-ocean-100 rounded-[2.5rem] text-ocean-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-4 shadow-2xl shadow-ocean-500/10">
            <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-30" />
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
                  <Activity size={20} className="text-emerald-500 relative z-10" />
                </div>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 leading-none mb-1 text-[8px]">Network Status</span>
              <span className="text-emerald-600 tracking-tighter">NEURAL STREAM ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Variation Chart */}
        <div className="lg:col-span-2 glass-panel p-12 shadow-2xl border-0 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-ocean-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="absolute top-0 right-0 -mr-20 -mt-20 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000 pointer-events-none">
             <Waves size={500} />
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 relative z-10 gap-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl border border-white/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                <Thermometer size={32} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Thermal Variation</h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">24H TELEMETRY SNAPSHOT</span>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 shadow-sm uppercase tracking-widest">
               <Cpu size={16} className="text-ocean-500" /> SENSOR NODE: ALPHA-7-G
            </div>
          </div>
          <div className="h-[500px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                   <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                     <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                   dataKey="time" 
                   stroke="#94a3b8" 
                   fontSize={11} 
                   fontWeight="900" 
                   tickLine={false} 
                   axisLine={false} 
                   dy={20}
                   tick={{ fill: '#64748b', fontSize: 10, letterSpacing: '0.1em' }}
                   className="uppercase"
                />
                <YAxis 
                   stroke="#94a3b8" 
                   fontSize={11} 
                   fontWeight="900" 
                   tickLine={false} 
                   axisLine={false} 
                   dx={-20}
                   tick={{ fill: '#64748b' }}
                />
                <Tooltip 
                   cursor={{ stroke: '#0ea5e9', strokeWidth: 2, strokeDasharray: '5 5' }}
                   contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '2rem', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.1)', padding: '24px', backdropFilter: 'blur(10px)' }}
                   labelStyle={{ fontSize: '14px', fontWeight: '900', color: '#0f172a', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                   itemStyle={{ color: '#0ea5e9', fontWeight: '900', textTransform: 'uppercase', fontSize: '12px' }}
                />
                <Area 
                   type="monotone" 
                   dataKey="temp" 
                   stroke="#0ea5e9" 
                   fillOpacity={1} 
                   fill="url(#colorTemp)" 
                   strokeWidth={6} 
                   animationDuration={3000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Intelligence Sidebars */}
        <div className="flex flex-col gap-10">
          <div className="glass-panel p-10 bg-white/40 backdrop-blur-3xl border-0 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-ocean-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="flex items-center justify-between mb-8 relative z-10">
                 <div className="flex flex-col">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-1">Salinity Levels</p>
                    <span className="w-10 h-1 bg-ocean-500 rounded-full" />
                 </div>
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-700 shadow-xl ${telemetry.trend === 'up' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                    <TrendingUp size={24} className={telemetry.trend === 'down' ? 'rotate-180 transition-transform' : 'transition-transform'} />
                 </div>
            </div>
            <div className="flex flex-col mb-10 relative z-10">
              <span className="text-7xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">
                 {telemetry.salinity} 
                 <span className="text-2xl text-slate-300 ml-2 font-black uppercase tracking-widest">PSU</span>
              </span>
            </div>
            <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden border border-slate-200/50 p-0.5 relative z-10">
              <div 
                className="bg-gradient-to-r from-ocean-500 to-cyan-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(14,165,233,0.5)]" 
                style={{ width: `${(telemetry.salinity / 50) * 100}%` }}
              />
            </div>
            <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] text-center relative z-10 flex items-center justify-center gap-3">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Neural Validation: ACTIVE
            </p>
          </div>

          <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-[0_50px_100px_-20px_rgba(15,23,42,0.5)] relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 p-8 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                <AlertCircle size={300} />
            </div>
            <div className="relative z-10">
              <div className="flex items-start gap-8 mb-12">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-3xl rounded-[2rem] flex items-center justify-center text-white shadow-2xl border border-white/10 group-hover:scale-110 transition-all duration-700">
                  <Zap size={40} className="text-amber-400" />
                </div>
                <div>
                  <h4 className="font-black text-3xl mb-3 tracking-tighter uppercase whitespace-nowrap">Thermal Anomaly</h4>
                  <p className="text-slate-400 text-xl font-medium leading-relaxed">System-7G reports critical variance +2.4°C above predicted baseline.</p>
                </div>
              </div>
              
              <button 
                onClick={runDiagnostics}
                disabled={isDiagnosticsRunning || diagnosticsComplete}
                className={`w-full py-8 text-sm uppercase tracking-[0.3em] font-black rounded-[2.5rem] flex items-center justify-center gap-4 transition-all active:scale-95 shadow-2xl border border-white/5 ${
                    diagnosticsComplete 
                    ? 'bg-emerald-500 text-white shadow-emerald-500/40' 
                    : 'bg-white text-slate-900 hover:bg-slate-50 hover:scale-[1.02] shadow-white/10'
                }`}
              >
                {isDiagnosticsRunning ? (
                  <><RefreshCw className="animate-spin text-ocean-600" size={24} /> Verifying Neural Nodes...</>
                ) : diagnosticsComplete ? (
                  <><CheckCircle2 size={24} /> Nodes Verified</>
                ) : (
                  <>Run Sentinel Diagnostics <ChevronRight size={24} className="text-ocean-600" /></>
                )}
              </button>
            </div>
          </div>
          
          <div className="glass-panel p-10 bg-white shadow-xl border-0 overflow-hidden relative group">
             <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
             <div className="flex items-center gap-5 mb-10 relative z-10">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                    <Droplets size={30} className="text-cyan-600" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Regional Pressure</h4>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">BAROMETRIC TELEMETRY</span>
                </div>
             </div>
             <div className="flex flex-col relative z-10">
                <div className="text-6xl font-black text-slate-900 tracking-tighter leading-none mb-4 tabular-nums">
                   {telemetry.pressure} 
                   <span className="text-2xl text-slate-300 ml-2 font-black uppercase tracking-widest">hPa</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Stable Barometric Range [0.4% Dev]</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OceanAnalytics;

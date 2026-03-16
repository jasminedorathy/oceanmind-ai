import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  ChevronRight,
  Fish,
  Trees,
  Dna,
  RefreshCw,
  FileSearch,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Microscope,
  Waves,
  Thermometer,
  CloudRain,
  Eye,
  AlertTriangle,
  ArrowUpRight,
  Globe
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line
} from 'recharts';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const iconMap = {
  Trees,
  Dna,
  Activity
};

const sentinelDetections = [
  { id: 1, species: 'Blue Whale', location: 'Section A-12', confidence: '98.2%', timestamp: '0.2s ago', status: 'Healthy' },
  { id: 2, species: 'Manta Ray', location: 'Reef Sector 7', confidence: '94.5%', timestamp: '1.5s ago', status: 'Migration' },
  { id: 3, species: 'Giant Squid', location: 'Abyssal Zone', confidence: '82.1%', timestamp: '4s ago', status: 'Rare' },
  { id: 4, species: 'Leatherback Turtle', location: 'Near-shore Alpha', confidence: '99.1%', timestamp: '12s ago', status: 'Nesting' },
];

const endangeredWatch = [
  { name: 'Hawksbill Turtle', status: 'Critically Endangered', trend: 'down', risk: 'Extreme', icon: Fish, color: 'text-rose-500' },
  { name: 'Vaquita Porpoise', status: 'Near Extinction', trend: 'down', risk: 'Terminal', icon: Activity, color: 'text-rose-600' },
  { name: 'Giant Sea Bass', status: 'Vulnerable', trend: 'steady', risk: 'High', icon: Dna, color: 'text-amber-500' },
];

const sparkData = [
  { val: 40 }, { val: 45 }, { val: 42 }, { val: 48 }, { val: 46 }, { val: 52 }, { val: 50 }
];

const Biodiversity = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeDetections, setActiveDetections] = useState(sentinelDetections);
  const navigate = useNavigate();

  const fetchLatestAudit = async () => {
    try {
      setSyncing(true);
      const { data: auditData } = await api.get('/biodiversity/latest');
      setData(auditData);
    } catch (err) {
      console.error('Migration link failed:', err);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchLatestAudit();
    
    // Simulate live telemetry stream
    const interval = setInterval(() => {
      setActiveDetections(prev => {
        const first = prev[0];
        const newDet = { ...first, id: Date.now(), timestamp: 'Just now' };
        return [...prev.slice(1), newDet];
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleDeploySentinel = async () => {
    setSyncing(true);
    setTimeout(async () => {
        await fetchLatestAudit();
    }, 2000);
  };

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
        await api.post('/biodiversity/audit', {
            species_data: data.species_data,
            habitat_metrics: data.habitat_metrics,
            stability_stats: data.stability_stats
        });
        
        setTimeout(() => {
            setGenerating(false);
            navigate('/reports');
        }, 1500);
    } catch (err) {
        setGenerating(false);
        console.error('Audit archival failed');
    }
  };

  if (loading || !data) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-ocean-500 rounded-full animate-ping opacity-20" />
          <RefreshCw className="animate-spin text-ocean-600 relative z-10" size={64} />
        </div>
        <p className="text-slate-900 font-black uppercase tracking-[0.4em] text-xs">Syncing Global Biodiversity Grid...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-5rem)] p-8 space-y-12 max-w-[1600px] mx-auto page-enter mesh-bg pb-32">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
             <div className="px-4 py-1.5 bg-ocean-500/10 border border-ocean-500/20 rounded-full text-ocean-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <Globe size={14} className="animate-spin-slow" /> GLOBAL MONITORING NODE: ASIA-PACIFIC-7
             </div>
             <div className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <ShieldCheck size={14} /> SYNC STATUS: STABLE
             </div>
          </div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter glow-ocean uppercase leading-none">Biodiversity <br/>Intelligence Hub</h1>
          <p className="text-slate-500 font-medium text-xl mt-4 leading-relaxed max-w-2xl">
            Real-time multi-spectral neural population tracking & holistic ecosystem health auditing.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 xl:justify-end flex-1">
          <button 
            onClick={fetchLatestAudit}
            className="w-16 h-16 bg-white border border-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-400 hover:text-ocean-600 transition-all shadow-xl hover:shadow-ocean-500/10 active:scale-95 group"
          >
            <RefreshCw size={28} className={`${syncing ? 'animate-spin' : ''} group-hover:rotate-180 transition-transform duration-700`} />
          </button>
          <button 
             onClick={handleDeploySentinel}
             disabled={syncing}
             className="px-12 py-6 bg-slate-900 text-white rounded-[2rem] text-sm font-black shadow-[0_30px_60px_-15px_rgba(15,23,42,0.4)] hover:bg-black transition-all active:scale-95 flex items-center gap-5 group border border-white/10 uppercase tracking-[0.3em]"
          >
            <div className="relative">
              <Zap size={24} className="text-amber-400 group-hover:scale-125 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-amber-400 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity" />
            </div>
            {syncing ? 'Neural Sync Active...' : 'Deploy Sentinel-V4'}
          </button>
        </div>
      </div>

      {/* Primary Analytics HUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {data.stability_stats.map((stat, i) => {
          const IconComp = iconMap[stat.icon_name] || Activity;
          return (
            <div key={i} className="glass-panel p-10 flex flex-col hover-premium group transition-all duration-700 relative overflow-hidden h-[340px] justify-between border-0 shadow-2xl">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000">
                  <IconComp size={200} />
               </div>
               <div className="flex items-center justify-between relative z-10 mb-8">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1">{stat.label}</span>
                    <span className="w-12 h-1.5 bg-ocean-500 rounded-full" />
                 </div>
                 <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center shadow-inner border border-white/40">
                    <IconComp size={32} className="text-ocean-600" />
                 </div>
               </div>
               <div className="relative z-10 space-y-4">
                  <h4 className="text-7xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">{stat.value}</h4>
                  <div className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-[1.25rem] border-2 transition-all group-hover:scale-105 duration-500 ${
                    stat.color.includes('rose') ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                  }`}>
                     <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${stat.color.includes('rose') ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none mt-0.5">{stat.status}</span>
                  </div>
               </div>
            </div>
          );
        })}
        {/* Environmental HUD Card */}
        <div className="glass-panel p-10 bg-slate-900 text-white border-0 shadow-2xl relative overflow-hidden group h-[340px] flex flex-col justify-between">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-1000">
              <Microscope size={180} />
           </div>
           <div className="relative z-10">
              <p className="text-[10px] font-black text-ocean-400 uppercase tracking-[0.4em] mb-1">Neural Verification</p>
              <h4 className="text-3xl font-black tracking-tighter uppercase mb-6 leading-tight">System Core <br/>Integrity</h4>
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <span>MD5 Consistency</span>
                    <span className="text-emerald-400">99.9%</span>
                 </div>
                 <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/10">
                    <div className="w-[99.9%] h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                 </div>
                 <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <span>Threat Profile</span>
                    <span className="text-rose-400">Minimal</span>
                 </div>
                 <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/10">
                    <div className="w-[15%] h-full bg-rose-500" />
                 </div>
              </div>
           </div>
           <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500">Sentinel Uplink: Active</span>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Population Chart */}
        <div className="lg:col-span-8 glass-panel p-12 shadow-2xl border-0 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-ocean-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 relative z-10 gap-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                 <Fish size={40} />
              </div>
              <div>
                 <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Population Distribution</h3>
                 <p className="text-lg text-slate-400 font-medium mt-1 uppercase tracking-widest leading-none">Telemetry-based species density analysis.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="px-5 py-2.5 bg-slate-50 text-[10px] font-black text-slate-500 rounded-xl border border-slate-100 uppercase tracking-widest">Global Aggregate</div>
            </div>
          </div>
          <div className="h-[550px] relative z-10">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.species_data}>
                   <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="0%" stopColor="#0ea5e9" stopOpacity={1} />
                         <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.4} />
                      </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                   <XAxis 
                      dataKey="name" 
                      stroke="#94a3b8" 
                      fontSize={11} 
                      fontWeight="900" 
                      tickLine={false} 
                      axisLine={false} 
                      dy={20}
                      tick={{ fill: '#64748b', fontSize: 10, letterSpacing: '0.1em' }}
                      textAnchor="middle"
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
                      cursor={{ fill: '#f8fafc', radius: 40 }}
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.98)', border: 'none', borderRadius: '2.5rem', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.2)', padding: '32px', backdropFilter: 'blur(20px)' }}
                      labelStyle={{ fontSize: '18px', fontWeight: '900', color: '#0f172a', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.2em' }}
                      itemStyle={{ color: '#0ea5e9', fontWeight: '900', textTransform: 'uppercase', fontSize: '14px' }}
                   />
                   <Bar 
                      dataKey="population" 
                      fill="url(#barGradient)" 
                      radius={[40, 40, 16, 16]} 
                      barSize={100}
                      animationDuration={3000}
                   />
                </BarChart>
             </ResponsiveContainer>
          </div>
          <div className="mt-12 flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] pt-8 border-t border-slate-100">
             <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" /> Neural Consistency Verified
          </div>
        </div>

        {/* Habitat Metrics Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          <div className="glass-panel p-10 bg-white shadow-2xl flex flex-col relative overflow-hidden group min-h-[500px]">
             <div className="absolute inset-0 bg-ocean-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
             <div className="flex items-center gap-6 mb-12 relative z-10">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl transition-transform group-hover:rotate-12">
                  <FileSearch className="text-white" size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Habitat Metrics</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">SENTINEL-NODE FEEDS</p>
                </div>
             </div>
             
             <div className="space-y-10 flex-1 relative z-10">
                {data.habitat_metrics.map((m, i) => (
                  <div key={i} className="space-y-5">
                     <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{m.label}</span>
                        <span className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums">{m.val}%</span>
                     </div>
                     <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden border border-slate-200/50 p-1 relative">
                        <div className={`h-full rounded-full transition-all duration-[2000ms] shadow-lg ${
                          m.color.includes('emerald') ? 'bg-emerald-500' : m.color.includes('rose') ? 'bg-rose-500' : 'bg-ocean-500'
                        }`} 
                        style={{ width: `${m.val}%` }} />
                     </div>
                  </div>
                ))}
             </div>

             <button 
               onClick={handleGenerateReport}
               disabled={generating}
               className="w-full mt-16 py-8 bg-slate-900 hover:bg-black text-white rounded-[2.5rem] font-black flex items-center justify-center gap-5 group transition-all shadow-[0_40px_80px_-20px_rgba(15,23,42,0.5)] active:scale-95 disabled:opacity-70 relative z-10 border border-white/10"
             >
                {generating ? (
                    <><RefreshCw size={28} className="animate-spin text-ocean-400" /> <span className="uppercase tracking-[0.2em]">Archiving Audit...</span></>
                ) : (
                    <><span className="uppercase tracking-[0.2em]">Compile Detailed Audit</span> <ArrowUpRight size={28} className="group-hover:-translate-y-2 group-hover:translate-x-2 transition-transform text-ocean-400" /></>
                )}
             </button>
             <div className="mt-8 flex items-center justify-center gap-3 relative z-10 border-t border-slate-100 pt-8">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Central Registry Synced</p>
             </div>
          </div>

          {/* Neural Stream Feed */}
          <div className="glass-panel p-10 border-0 shadow-2xl bg-slate-50/50 group relative overflow-hidden">
             <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Neural Stream</h3>
                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black tracking-widest uppercase border border-emerald-100">LIVE</div>
             </div>
             <div className="space-y-4">
                {activeDetections.map((det) => (
                  <div key={det.id} className="p-6 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm hover:translate-x-2 transition-transform duration-500 flex items-center justify-between">
                     <div>
                        <p className="text-sm font-black text-slate-900 leading-none mb-1 uppercase tracking-tight">{det.species}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{det.location}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-ocean-600 leading-none mb-1 uppercase tracking-widest">{det.confidence}</p>
                        <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{det.timestamp}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Species Watchlist & Environmental Data */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
         <div className="xl:col-span-2 space-y-8">
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-4">
               <AlertTriangle size={36} className="text-rose-500 animate-pulse" /> Species Watchlist [Level 4]
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {endangeredWatch.map((s, i) => (
                  <div key={i} className="glass-panel p-8 bg-white hover-premium group overflow-hidden relative border-0 shadow-2xl">
                     <div className="absolute -right-4 -top-4 p-8 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                        <s.icon size={120} />
                     </div>
                     <div className="space-y-6 relative z-10">
                        <div className={`w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl`}>
                           <s.icon size={26} />
                        </div>
                        <div>
                           <h5 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-tight mb-2">{s.name}</h5>
                           <p className={`text-[10px] font-bold uppercase tracking-widest ${s.color}`}>{s.status}</p>
                        </div>
                        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                           <div>
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Risk Assessment</p>
                              <p className="text-md font-black text-slate-900 uppercase tracking-widest">{s.risk}</p>
                           </div>
                           <div className={`p-3 rounded-xl shadow-inner ${s.trend === 'down' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                              <ArrowUpRight size={20} className={s.trend === 'down' ? 'rotate-180' : ''} />
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Benthic Telemetry Grid */}
         <div className="glass-panel p-10 bg-white border-0 shadow-2xl relative overflow-hidden group">
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-10 flex items-center gap-4">
               <Thermometer size={28} className="text-ocean-500" /> Benthic Telemetry
            </h3>
            <div className="space-y-10">
               {[
                  { label: 'Water Temp', val: '22.4°C', color: 'text-rose-500', icon: Thermometer },
                  { label: 'pH Levels', val: '8.1', color: 'text-emerald-500', icon: Microscope },
                  { label: 'Turbidity Index', val: '1.2 NTU', color: 'text-amber-500', icon: Waves },
                  { label: 'Salinity Rate', val: '34.5 PSU', color: 'text-blue-500', icon: CloudRain }
               ].map((tele, i) => (
                  <div key={i} className="flex items-center justify-between group/tele">
                     <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover/tele:bg-slate-900 group-hover/tele:text-white transition-all duration-700">
                           <tele.icon size={24} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">{tele.label}</p>
                           <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{tele.val}</p>
                        </div>
                     </div>
                     <div className="h-12 w-28">
                        <ResponsiveContainer width="100%" height="100%">
                           <LineChart data={sparkData}>
                              <Line type="monotone" dataKey="val" stroke={tele.color === 'text-rose-500' ? '#f43f5e' : '#0ea5e9'} strokeWidth={3} dot={false} />
                           </LineChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
               ))}
            </div>
            <div className="mt-12 p-10 bg-slate-900 rounded-[3rem] relative overflow-hidden group/cta flex flex-col items-center">
               <div className="absolute inset-0 bg-gradient-to-br from-ocean-500/20 to-transparent opacity-0 group-hover/cta:opacity-100 transition-opacity duration-1000" />
               <div className="relative z-10 text-center">
                  <p className="text-[10px] font-black text-ocean-400 uppercase tracking-[0.5em] mb-4">Verification Check</p>
                  <p className="text-white font-black uppercase tracking-widest text-lg mb-8 leading-tight">Environmental Protocols <br/>Stand Verified</p>
                  <button className="px-10 py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/5">Re-Verify Hub</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Biodiversity;

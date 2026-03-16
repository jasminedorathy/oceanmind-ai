import React, { useState } from 'react';
import { 
  Skull, 
  Droplets, 
  AlertTriangle, 
  TrendingUp,
  Activity,
  Ship,
  Wind,
  CheckCircle2,
  BarChart2,
  RefreshCw
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const pollutionData = [
  { region: 'Indian Ocean', index: 78, status: 'Critical' },
  { region: 'North Atlantic', index: 42, status: 'Stable' },
  { region: 'Great Barrier Reef', index: 65, status: 'Warning' },
  { region: 'Arctic Shelf', index: 31, status: 'Stable' },
  { region: 'Gulf of Mexico', index: 88, status: 'Critical' },
];

const StatCard = ({ label, value, subtext, icon: Icon, color }) => (
  <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 group hover:border-ocean-500/30 transition-all relative overflow-hidden">
     <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
        <Icon size={80} />
     </div>
     <div className="flex items-center justify-between mb-6 relative z-10">
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
       <Icon size={20} className={color} />
     </div>
     <div className="relative z-10">
        <h4 className="text-5xl font-black text-slate-900 tracking-tighter">{value}</h4>
        <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">{subtext}</p>
     </div>
  </div>
);

const PollutionMonitoring = () => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const navigate = useNavigate();

  const handleLaunch = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setDeployed(true);
      setTimeout(() => navigate('/reports'), 2000);
    }, 2500);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] p-8 space-y-10 max-w-7xl mx-auto page-enter mesh-bg pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight glow-ocean uppercase">Toxicity Surveillance</h1>
          <p className="text-slate-500 font-medium text-lg mt-1 text-balance tracking-tight">Tracking chemical leaching, microplastic density, and oil spill telemetry via Sentinel-V4 neural grid.</p>
        </div>
        <div className="flex gap-4">
           <div className="px-8 py-5 bg-white/80 backdrop-blur-md border border-rose-100 rounded-[2.5rem] text-rose-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-4 shadow-2xl shadow-rose-500/10 transition-transform hover:scale-105 duration-500">
              <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center border border-rose-100">
                <AlertTriangle size={20} className="animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-slate-400 leading-none mb-1 text-[8px]">Anomaly Status</span>
                <span className="text-rose-600 tracking-tighter">CRITICAL-LEACH DETECTED</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard label="Plastic Concentration" value="1.2M" subtext="Tons per km² in Gyres" icon={Droplets} color="text-ocean-500" />
        <StatCard label="Oil Spills (24h)" value="04" subtext="Active leakage alerts" icon={Ship} color="text-slate-900" />
        <StatCard label="Toxicity Score" value="68" subtext="Global average index" icon={Skull} color="text-rose-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="glass-panel p-12 shadow-2xl border-0 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="flex items-center justify-between mb-16 relative z-10">
            <div>
               <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">Regional Pollution Index</h3>
               <p className="text-lg text-slate-500 font-medium">Neural analysis of chemical & solid waste density across nodes.</p>
            </div>
            <div className="p-5 bg-slate-900 text-white rounded-[1.5rem] shadow-2xl shadow-slate-900/40 group-hover:scale-110 transition-all duration-700">
               <Skull size={40} />
            </div>
          </div>
          <div className="h-[450px] relative z-10">
             <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={pollutionData}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                   <XAxis 
                      dataKey="region" 
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
                      cursor={{ fill: '#f8fafc', radius: 24 }}
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '2rem', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.1)', padding: '24px', backdropFilter: 'blur(10px)' }}
                      labelStyle={{ fontSize: '14px', fontWeight: '900', color: '#0f172a', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                      itemStyle={{ color: '#0ea5e9', fontWeight: '900', textTransform: 'uppercase', fontSize: '12px' }}
                   />
                   <Bar dataKey="index" radius={[24, 24, 8, 8]} barSize={80} animationDuration={2000}>
                      {pollutionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.index > 70 ? '#e11d48' : entry.index > 50 ? '#f59e0b' : '#0ea5e9'} />
                      ))}
                   </Bar>
                </ReBarChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-10">
           <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-[0_50px_100px_-20px_rgba(15,23,42,0.5)] h-full flex flex-col justify-between group overflow-hidden relative border border-white/5">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 p-8 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                  <Wind size={400} />
              </div>
              <div className="relative z-10">
                 <div className="flex items-start gap-8 mb-12">
                   <div className="w-20 h-20 bg-white/10 backdrop-blur-3xl rounded-[2rem] flex items-center justify-center text-rose-500 shadow-2xl border border-white/10 group-hover:scale-110 transition-all duration-700">
                     <Skull size={40} />
                   </div>
                   <div>
                     <h4 className="font-black text-3xl mb-3 tracking-tighter uppercase">Mission Critical: Leaching Event</h4>
                     <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-md">Secondary telemetry confirms heavy metal runoff in the Bay of Bengal cluster. Level 4 toxicity detected.</p>
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 shadow-inner hover:bg-white/10 transition-colors duration-500">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">Neural Impact Level</p>
                       <p className="text-3xl font-black text-rose-500 tracking-tighter">SEVERE-V2</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 shadow-inner hover:bg-white/10 transition-colors duration-500">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">Biological Strain</p>
                       <p className="text-3xl font-black text-amber-500 tracking-tighter">82% RISK</p>
                    </div>
                 </div>
              </div>
              
              <button 
                onClick={handleLaunch}
                disabled={isDeploying || deployed}
                className={`relative z-10 w-full py-8 text-sm font-black rounded-[2.5rem] shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-80 border border-white/5 uppercase tracking-[0.3em] ${
                  deployed ? 'bg-emerald-500 text-white shadow-emerald-500/40' : 'bg-white text-slate-900 hover:bg-slate-50 hover:scale-[1.02] shadow-white/10'
                }`}
              >
                 {isDeploying ? (
                     <><RefreshCw size={24} className="animate-spin text-ocean-600" /> Deploying Tactical Units...</>
                 ) : deployed ? (
                     <><CheckCircle2 size={24} /> Protocol ALPHA-7 Active</>
                 ) : (
                     <>Execute Containment Protocol <BarChart2 size={24} className="text-ocean-600" /></>
                 )}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PollutionMonitoring;

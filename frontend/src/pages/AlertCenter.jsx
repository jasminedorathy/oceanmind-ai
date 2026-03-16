import React, { useState } from 'react';
import { 
  BellRing, 
  ShieldAlert, 
  Activity, 
  Settings2,
  AlertTriangle,
  History,
  Trash2,
  ExternalLink,
  Radar,
  ShieldCheck,
  Zap,
  Target,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertOctagon
} from 'lucide-react';

const alertData = [
  { id: 1, level: 'Critical', region: 'Great Barrier Reef', title: 'Severe Thermal Anomaly', desc: 'Thermal anomaly detected: +2.4°C above baseline. Coral bleaching imminent.', time: '2 mins ago', icon: AlertTriangle, status: 'Active' },
  { id: 2, level: 'Warning', region: 'Sector-B4 Indian Ocean', title: 'Unauthorized Maritime Activity', desc: 'Non-registered commercial fishing vessel detected in protected waters.', time: '14 mins ago', icon: ShieldAlert, status: 'Monitoring' },
  { id: 3, level: 'Info', region: 'Global Telemetry', title: 'Satellite Node Sync Complete', desc: 'Sentinel drone network sync complete. 12 new high-fidelity nodes online.', time: '1h ago', icon: Activity, status: 'Resolved' },
  { id: 4, level: 'Critical', region: 'Arctic Cluster R-2', title: 'Ice Shelf Structural Failure', desc: 'Ice shelf structural integrity compromised. Rapid tectonic failure alert active.', time: '3h ago', icon: Radar, status: 'Active' },
];

const AlertCenter = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [alerts, setAlerts] = useState(alertData);

  const clearAlerts = () => setAlerts([]);

  return (
    <div className="min-h-[calc(100vh-5rem)] p-8 space-y-8 max-w-7xl mx-auto page-enter mesh-bg pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight glow-ocean">Neural Alert Center</h1>
          <p className="text-slate-500 font-medium text-lg mt-1 text-balance">Real-time anomaly detection and critical environmental threat management.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="px-6 py-4 bg-white/80 backdrop-blur-md border border-rose-100 rounded-[2rem] text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl shadow-rose-500/10 transition-transform hover:scale-105 duration-500">
              <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center border border-rose-100">
                <BellRing size={20} className="animate-bounce" />
              </div>
              <div className="flex flex-col">
                <span className="text-slate-400 leading-none mb-1 text-[8px]">Current Status</span>
                <span className="text-rose-600 tracking-tighter">CRITICAL-V2</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
           { label: 'Unresolved', val: '24', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', icon: AlertOctagon },
           { label: 'Neural Accuracy', val: '99.9%', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: ShieldCheck },
           { label: 'Active Hotspots', val: '08', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: Zap }
         ].map((stat, i) => (
           <div key={i} className="glass-panel p-10 flex items-center gap-8 hover-premium group transition-all duration-700">
              <div className={`w-16 h-16 ${stat.bg} ${stat.border} ${stat.color} rounded-[1.5rem] flex items-center justify-center transition-all group-hover:scale-110 shadow-lg shadow-slate-200/40 relative overflow-hidden`}>
                 <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <stat.icon size={32} />
              </div>
              <div>
                 <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-1">{stat.label}</p>
                 <p className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums">{stat.val}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2 glass-panel overflow-hidden border-0 shadow-2xl">
          <div className="p-10 border-b border-slate-100 bg-slate-900/[0.02] backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="flex items-center gap-4">
                <div className="p-4 bg-slate-900 text-white rounded-[1.2rem] shadow-xl shadow-slate-900/40">
                  <Target size={24} />
                </div>
                <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 w-fit">
                    <button 
                      onClick={() => setActiveTab('active')}
                      className={`px-8 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${activeTab === 'active' ? 'bg-white text-ocean-600 shadow-xl' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                      Active
                    </button>
                    <button 
                      onClick={() => setActiveTab('archive')}
                      className={`px-8 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${activeTab === 'archive' ? 'bg-white text-ocean-600 shadow-xl' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                      Archive
                    </button>
                </div>
             </div>
             <div className="flex gap-4">
                <button 
                  onClick={clearAlerts}
                  className="px-8 py-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-[1.2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-sm hover:bg-rose-100 transition-all active:scale-95"
                >
                  Deauthorize All
                </button>
             </div>
          </div>
          
          <div className="divide-y divide-slate-100 min-h-[500px]">
            {alerts.filter(a => activeTab === 'active' ? a.status !== 'Resolved' : a.status === 'Resolved').map((alert) => (
              <div key={alert.id} className="p-10 flex flex-col lg:flex-row items-center justify-between group hover:bg-slate-50/50 transition-all duration-700 cursor-pointer relative overflow-hidden">
                {alert.level === 'Critical' && activeTab === 'active' && (
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)]" />
                )}
                <div className="flex items-center gap-10 flex-1 w-full lg:w-auto">
                  <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-700 shadow-xl group-hover:scale-110 group-hover:rotate-6 ${
                    alert.level === 'Critical' ? 'bg-rose-50 border border-rose-100 text-rose-600' : 'bg-amber-50 border border-amber-100 text-amber-600'
                  }`}>
                     <alert.icon size={36} />
                  </div>
                  <div className="flex-1">
                     <div className="flex items-center gap-4 mb-3">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                          alert.level === 'Critical' ? 'bg-rose-500 text-white border-rose-400' : 'bg-amber-500 text-white border-amber-400'
                        }`}>
                           {alert.level}
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <Clock size={12} /> {alert.time}
                        </span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="text-[10px] font-black text-ocean-600 uppercase tracking-widest">{alert.region}</span>
                     </div>
                     <h4 className="text-2xl font-black text-slate-900 mb-2 tracking-tight group-hover:text-ocean-700 transition-colors uppercase">{alert.title}</h4>
                     <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-2xl">{alert.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8 mt-10 lg:mt-0 w-full lg:w-auto self-start lg:self-auto justify-end">
                   <button className="px-8 py-4 bg-white border border-slate-200 text-slate-900 font-black rounded-[1.2rem] shadow-xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 group/btn flex items-center gap-3 text-xs uppercase tracking-widest">
                      HUD Access <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                   </button>
                   <button className="p-4 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-[1.2rem] transition-all shadow-xl active:scale-90 border border-emerald-100">
                      <CheckCircle2 size={24} />
                   </button>
                </div>
              </div>
            ))}

            {alerts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-40 text-slate-300">
                 <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mb-10 border border-emerald-100">
                    <ShieldCheck size={72} className="text-emerald-500 animate-pulse" />
                 </div>
                 <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Clear Neutrality</h2>
                 <p className="text-xl text-slate-400 font-medium">No active anomalies detected in the intelligence stream.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-10">
           <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-[0_50px_100px_-20px_rgba(15,23,42,0.5)] h-full flex flex-col justify-between group overflow-hidden relative border border-white/5">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 p-8 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                 <Radar size={400} />
              </div>
              <div className="relative z-10">
                 <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 mb-8">
                    <Zap size={28} className="text-amber-400" />
                 </div>
                 <h3 className="text-3xl font-black mb-4 tracking-tight">Sentinel Agency Access</h3>
                 <p className="text-slate-400 text-lg font-medium mb-12 max-w-xs leading-relaxed">Upgrade to Tier-5 Agency access for direct satellite override commands & orbital HUD projection.</p>
                 
                 <div className="space-y-6">
                    <div>
                       <div className="flex justify-between mb-3 items-end">
                          <span className="text-slate-300 text-sm font-black uppercase tracking-widest">Global Risk Factor</span>
                          <span className="text-rose-400 text-xl font-black">78%</span>
                       </div>
                       <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/10">
                          <div className="bg-rose-500 h-full w-[78%] shadow-[0_0_20px_rgba(244,63,94,0.4)]" />
                       </div>
                    </div>
                    <div>
                       <div className="flex justify-between mb-3 items-end">
                          <span className="text-slate-300 text-sm font-black uppercase tracking-widest">Neural Accuracy</span>
                          <span className="text-emerald-400 text-xl font-black">99.9%</span>
                       </div>
                       <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/10">
                          <div className="bg-emerald-500 h-full w-[99.9%] shadow-[0_0_20px_rgba(16,185,129,0.4)]" />
                       </div>
                    </div>
                 </div>
              </div>
              <button className="relative z-10 w-full py-6 bg-white text-slate-900 font-extrabold rounded-[2rem] shadow-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 mt-16 group/btn uppercase tracking-widest text-sm">
                 Elevate Control Level <ExternalLink size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AlertCenter;

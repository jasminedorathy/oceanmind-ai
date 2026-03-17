import React, { useState } from 'react';
import { 
  CloudSun, 
  Wind, 
  Thermometer, 
  TrendingUp,
  Activity,
  Zap,
  Globe,
  RefreshCw,
  Navigation,
  CheckCircle2,
  Maximize2
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
import { useNavigate } from 'react-router-dom';

const climateData = [
  { year: '2019', anomaly: 0.82 },
  { year: '2020', anomaly: 0.98 },
  { year: '2021', anomaly: 0.85 },
  { year: '2022', anomaly: 1.02 },
  { year: '2023', anomaly: 1.15 },
  { year: '2024', anomaly: 1.24 },
];

const ClimateIntelligence = () => {
  const [isProjecting, setIsProjecting] = useState(false);
  const [projected, setProjected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    anomaly: 1.24,
    wind: 42,
    cloud: 68,
    rainfall: -12,
    risk: 78,
    history: [],
    regions: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClimateData = async () => {
      try {
        const response = await api.get('/analytics/climate');
        setData(response.data);
      } catch (err) {
        console.error('Benthic telemetry handshake failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClimateData();
  }, []);

  const handleProjection = () => {
    setIsProjecting(true);
    setTimeout(() => {
      setIsProjecting(false);
      setProjected(true);
      setTimeout(() => navigate('/reports'), 2000);
    }, 2500);
  };

  if (loading) return (
    <div className="flex h-[calc(100vh-5rem)] items-center justify-center">
      <RefreshCw className="animate-spin text-ocean-600" size={48} />
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-5rem)] p-8 space-y-8 max-w-7xl mx-auto page-enter mesh-bg pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight glow-ocean uppercase">Climate Intelligence</h1>
          <p className="text-slate-500 font-medium text-lg mt-1 text-balance">Monitoring temperature anomalies, rainfall patterns, and global climate risk scores.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-white/80 backdrop-blur-md border border-ocean-100 px-6 py-4 rounded-[2rem] flex items-center gap-4 shadow-2xl shadow-ocean-500/10 transition-transform hover:scale-105 duration-500 cursor-help">
              <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center border border-rose-100">
                <Globe className="text-rose-600" size={20} />
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none block mb-1">Active Global Anomaly</span>
                <span className="text-sm font-black text-rose-600 tracking-tighter transition-all">+{data.anomaly}°C Critical</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Wind Velocity', value: `${data.wind} km/h`, icon: Wind, color: 'text-cyan-500', bg: 'bg-cyan-50', border: 'border-cyan-100', sub: 'Average Global' },
           { label: 'Cloud Density', value: `${data.cloud}%`, icon: CloudSun, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100', sub: 'Atmospheric Cover' },
           { label: 'Rainfall Deviation', value: `${data.rainfall}%`, icon: RefreshCw, color: 'text-ocean-500', bg: 'bg-ocean-50', border: 'border-ocean-100', sub: 'Below Seasonal Baseline' },
           { label: 'Risk Score (Avg)', value: `${data.risk}/100`, icon: Zap, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', sub: data.risk > 80 ? 'High Instability' : 'Stable Margin' }
         ].map((item, idx) => (
           <div key={idx} className="glass-panel p-8 hover-premium group cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-700">
                <item.icon size={80} />
              </div>
              <div className="flex items-center gap-4 mb-6 relative z-10">
                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 ${item.bg} ${item.border} ${item.color}`}>
                    <item.icon size={20} />
                 </div>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{item.label}</span>
              </div>
              <h4 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter tabular-nums relative z-10">{item.value}</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest relative z-10 flex items-center gap-2">
                 <div className="w-1 h-1 bg-slate-300 rounded-full" />
                 {item.sub}
              </p>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-12 hover-premium">
          <div className="flex items-center justify-between mb-12">
            <div>
               <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Global Temperature Anomaly</h3>
               <p className="text-slate-500 font-medium mt-1">Neural deviation analysis against historical baselines.</p>
            </div>
            <div className="w-16 h-16 bg-rose-50 rounded-[1.5rem] text-rose-600 border border-rose-100 flex items-center justify-center shadow-lg shadow-rose-500/10">
               <TrendingUp size={32} className="animate-pulse" />
            </div>
          </div>
          <div className="h-[400px]">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.history}>
                   <defs>
                     <linearGradient id="colorAnomaly" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#e11d48" stopOpacity={0.2}/>
                       <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                   <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} fontWeight="900" tickLine={false} axisLine={false} dy={15} />
                   <YAxis stroke="#94a3b8" fontSize={12} fontWeight="900" tickLine={false} axisLine={false} dx={-15} />
                   <Tooltip 
                     cursor={{ stroke: '#e11d48', strokeWidth: 2, strokeDasharray: '5 5' }}
                     contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', border: '1px solid #f1f5f9', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '20px' }}
                     itemStyle={{ color: '#0f172a', fontWeight: '900', fontSize: '16px' }}
                     labelStyle={{ color: '#64748b', fontWeight: 'bold', fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                   />
                   <Area type="monotone" dataKey="anomaly" stroke="#e11d48" fillOpacity={1} fill="url(#colorAnomaly)" strokeWidth={5} animationDuration={2000} />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-8 flex flex-col h-full">
           <div className="glass-panel p-10 hover-premium flex flex-col flex-1 group">
              <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-6 uppercase">
                 <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                    <Activity size={20} />
                 </div>
                 <h3 className="text-sm font-black text-slate-900 tracking-[0.2em]">Regional Instability Score</h3>
              </div>
              <div className="flex-1 space-y-10">
                 {data.regions.map((r, i) => (
                   <div key={i} className="space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                         <span className="text-slate-500 group-hover:text-slate-900 transition-colors uppercase">{r.region}</span>
                         <div className="flex items-center gap-2">
                            <span className={r.score > 80 ? 'text-rose-600' : 'text-amber-600'}>{r.score}%</span>
                            <div className={`w-2 h-2 rounded-full ${r.color} animate-pulse`} />
                         </div>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/50 p-0.5">
                         <div 
                           className={`h-full transition-all duration-1000 peer ${r.color} shadow-[0_0_20px_rgba(244,63,94,0.3)]`} 
                           style={{ width: `${r.score}%` }} 
                         />
                      </div>
                   </div>
                 ))}
              </div>
              
              <button 
                onClick={handleProjection}
                disabled={isProjecting || projected}
                className={`w-full mt-12 py-6 font-black rounded-[2rem] flex items-center justify-center gap-4 shadow-2xl transition-all active:scale-95 disabled:opacity-80 group/btn relative overflow-hidden ${projected ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white hover:bg-black'}`}
              >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                  {isProjecting ? (
                      <><RefreshCw size={22} className="animate-spin" /> Neural Modeling...</>
                  ) : projected ? (
                      <><CheckCircle2 size={22} className="text-emerald-300" /> Projection Dispatched</>
                  ) : (
                      <>Generate Risk Projection <Navigation size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                  )}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ClimateIntelligence;

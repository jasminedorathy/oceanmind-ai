import React from 'react';
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Waves,
  Globe,
  ThermometerSun,
  Skull,
  Zap,
  ShieldCheck,
  ChevronRight,
  MousePointer2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const mockData = [
  { name: 'Jan', temp: 21, bio: 8.2, pollution: 45 },
  { name: 'Feb', temp: 22, bio: 8.1, pollution: 48 },
  { name: 'Mar', temp: 21.5, bio: 7.9, pollution: 52 },
  { name: 'Apr', temp: 23, bio: 7.5, pollution: 65 },
  { name: 'May', temp: 24.5, bio: 7.0, pollution: 72 },
  { name: 'Jun', temp: 25, bio: 6.8, pollution: 78 },
];

const StatCard = ({ title, value, change, icon: Icon, trend, color, bg, border }) => (
  <div className="glass-panel p-8 hover-premium group relative overflow-hidden">
    <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700 ${color}`}>
      <Icon size={120} />
    </div>
    <div className="flex items-center gap-4 mb-8 relative z-10">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 shadow-lg ${bg} ${border} ${color}`}>
        <Icon size={24} />
      </div>
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{title}</span>
    </div>
    <div className="flex items-end justify-between relative z-10">
      <div>
         <h3 className="text-4xl font-black text-slate-900 tracking-tighter glow-ocean">{value}</h3>
      </div>
      <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black border-2 transition-all group-hover:px-6 ${trend === 'up' ? 'text-rose-600 bg-rose-50 border-rose-100 shadow-rose-200/20' : 'text-emerald-600 bg-emerald-50 border-emerald-100 shadow-emerald-200/20'}`}>
         {change} {trend === 'up' ? '↑' : '↓'}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-5rem)] p-8 space-y-8 max-w-7xl mx-auto page-enter mesh-bg pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight glow-ocean">Global Environmental Monitor</h1>
          <p className="text-slate-500 font-medium text-lg mt-1 text-balance">Unified command center for multi-source environmental intelligence.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="px-6 py-4 bg-white/80 backdrop-blur-md border border-emerald-100 rounded-[2rem] text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl shadow-emerald-500/10 transition-transform hover:scale-105 duration-500">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
                <ShieldCheck size={20} className="animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-slate-400 leading-none mb-1">Autonomous Guard</span>
                <span className="text-emerald-600 tracking-tighter">STATUS: ACTIVE</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Surface Temperature" value="23.4°C" change="+1.2%" icon={ThermometerSun} trend="up" color="text-rose-600" bg="bg-rose-50" border="border-rose-100" />
        <StatCard title="Biodiversity Health" value="7.8" change="-0.4" icon={Waves} trend="down" color="text-emerald-600" bg="bg-emerald-50" border="border-emerald-100" />
        <StatCard title="Toxicity Index" value="65" change="+12%" icon={Skull} trend="up" color="text-amber-500" bg="bg-amber-50" border="border-amber-100" />
        <StatCard title="Climate Risk Score" value="78" change="High" icon={Zap} trend="up" color="text-rose-600" bg="bg-rose-50" border="border-rose-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-12 hover-premium relative overflow-hidden">
          <div className="flex items-center justify-between mb-12 relative z-10">
            <div>
               <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Ocean Intelligence Trends</h3>
               <p className="text-slate-500 font-medium mt-1">Correlation between thermal anomalies and chemical saturation.</p>
            </div>
            <button onClick={() => navigate('/ocean')} className="w-14 h-14 bg-slate-50 hover:bg-ocean-50 text-slate-400 hover:text-ocean-600 rounded-2xl transition-all border border-slate-100 shadow-sm flex items-center justify-center group/btn">
               <Activity size={28} className="group-hover/btn:scale-110 transition-transform" />
            </button>
          </div>
          <div className="h-[400px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPollution" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} fontWeight="900" tickLine={false} axisLine={false} dy={15} />
                <YAxis stroke="#94a3b8" fontSize={12} fontWeight="900" tickLine={false} axisLine={false} dx={-15} />
                <Tooltip 
                  cursor={{ stroke: '#0ea5e9', strokeWidth: 2, strokeDasharray: '5 5' }}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', border: '1px solid #f1f5f9', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '20px' }}
                  itemStyle={{ fontWeight: '900', fontSize: '15px' }}
                  labelStyle={{ color: '#64748b', fontWeight: 'bold', fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                />
                <Area type="monotone" dataKey="temp" stroke="#e11d48" fillOpacity={1} fill="url(#colorTemp)" strokeWidth={5} name="Thermal Anomaly" animationDuration={2500} />
                <Area type="monotone" dataKey="pollution" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorPollution)" strokeWidth={5} name="Toxicity Index" animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-8 h-full flex flex-col">
           <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl shadow-slate-900/40 flex-1 flex flex-col justify-between group overflow-hidden relative border border-white/5">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 p-8 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                 <Globe size={400} />
              </div>
              <div className="relative z-10">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 mb-8">
                    <Globe size={24} className="text-ocean-400" />
                 </div>
                 <h3 className="text-3xl font-black mb-2 tracking-tight">Geospatial Awareness</h3>
                 <p className="text-slate-400 text-lg font-medium mb-12 max-w-xs leading-relaxed">Active surveillance of 8 global environmental hotspots.</p>
                 
                 <div className="space-y-4">
                    {[
                      { region: 'Indian Ocean Cluster', risk: 'SEVERE', color: 'bg-rose-500' },
                      { region: 'Arctic Shelf Node 2', risk: 'CRITICAL', color: 'bg-amber-500' },
                      { region: 'Great Barrier Reef B4', risk: 'EXTREME', color: 'bg-rose-600' }
                    ].map((spot, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer group/spot">
                         <span className="text-sm font-black text-slate-300 group-hover/spot:text-white transition-colors uppercase tracking-tight">{spot.region}</span>
                         <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg ${spot.color} text-white uppercase tracking-[0.2em] shadow-lg`}>{spot.risk}</span>
                      </div>
                    ))}
                 </div>
              </div>
              <button 
                onClick={() => navigate('/map')}
                className="relative z-10 w-full py-6 bg-white text-slate-900 font-black rounded-2xl shadow-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-3 mt-12 group-hover:scale-[1.02] active:scale-95 group/btn"
              >
                 Launch Geospatial Hub <MousePointer2 size={20} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-ocean-600 via-indigo-700 to-indigo-900 rounded-[4rem] p-16 text-white shadow-[0_40px_100px_-20px_rgba(14,165,233,0.4)] flex flex-col lg:flex-row lg:items-center justify-between group overflow-hidden relative border border-white/10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 p-12 opacity-10 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-1000">
           <Activity size={500} />
        </div>
        <div className="space-y-6 relative z-10 max-w-2xl">
           <div className="bg-white/10 w-fit px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-white/20 backdrop-blur-xl animate-pulse">
              A.I. SENTINEL PROTOCOL V4.0.2
           </div>
           <h3 className="text-5xl font-black tracking-tighter leading-[1.1]">Query the <span className="text-cyan-400">Intelligence Hub</span></h3>
           <p className="text-ocean-100 font-medium text-xl opacity-90 leading-relaxed text-balance">Ask about oceanographic trends, biodiversity decline, or run complex simulation models using our neural assistant.</p>
        </div>
        <button 
          onClick={() => navigate('/copilot')}
          className="mt-12 lg:mt-0 bg-white text-ocean-700 px-14 py-6 rounded-[2.5rem] font-black text-xl hover:bg-slate-50 transition-all shadow-[0_30px_60px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 flex items-center gap-4 relative z-10 group/btn"
        >
          Launch A.I. Copilot <ChevronRight size={28} className="group-hover/btn:translate-x-2 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

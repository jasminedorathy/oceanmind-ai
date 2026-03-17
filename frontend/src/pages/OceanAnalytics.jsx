import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, Cell, Legend
} from 'recharts';
import { 
  Database, Activity, TrendingUp, AlertCircle, Share2, 
  RefreshCcw, Layers, PieChart as PieIcon, Maximize2
} from 'lucide-react';
import api from '../services/api';

const OceanAnalytics = () => {
  const [datasets, setDatasets] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [metadata, setMetadata] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  useEffect(() => {
    if (selectedFile) {
      loadDynamicIntelligence();
    }
  }, [selectedFile]);

  const fetchConfig = async () => {
    try {
      const { data } = await api.get('/datasets');
      const trainedOnly = data.filter(d => d.status === 'trained');
      setDatasets(trainedOnly);
      if (trainedOnly.length > 0) setSelectedFile(trainedOnly[0].filename);
    } catch (err) {
      console.error("Registry Load Failure", err);
    }
  };

  const loadDynamicIntelligence = async () => {
    setLoading(true);
    try {
      const [metaRes, dataRes] = await Promise.all([
        api.get(`/analytics/metadata/${selectedFile}`),
        api.get(`/analytics/data/${selectedFile}`)
      ]);
      setMetadata(metaRes.data);
      setData(dataRes.data);
    } catch (err) {
      console.error("Neural Data Extraction Failure", err);
    } finally {
      setLoading(false);
    }
  };

  const renderDynamicChart = (vis, index) => {
    const ChartType = vis.type === 'line' ? LineChart : vis.type === 'bar' ? BarChart : AreaChart;
    const colors = ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899'];
    const activeColor = colors[index % colors.length];

    return (
      <div key={index} className="glass-panel p-6 space-y-4 group animate-slideInUp">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{vis.title}</h3>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{vis.recommended_for}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-ocean-50 group-hover:text-ocean-500 transition-colors">
            <Maximize2 size={14} />
          </div>
        </div>

        <div className="h-64 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <ChartType data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey={vis.x_axis} 
                fontSize={10} 
                tick={{fill: '#94a3b8', fontWeight: 600}} 
                axisLine={false} 
                tickLine={false} 
              />
              <YAxis 
                fontSize={10} 
                tick={{fill: '#94a3b8', fontWeight: 600}} 
                axisLine={false} 
                tickLine={false} 
              />
              <Tooltip 
                contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff'}}
                itemStyle={{fontSize: '12px', fontWeight: 900}}
              />
              {vis.type === 'line' && (
                <Line type="monotone" dataKey={vis.y_axis} stroke={activeColor} strokeWidth={3} dot={false} animationDuration={2000} />
              )}
              {vis.type === 'bar' && (
                <Bar dataKey={vis.y_axis} fill={activeColor} radius={[4, 4, 0, 0]} animationDuration={2000} />
              )}
              {vis.type === 'area' && (
                <Area type="monotone" dataKey={vis.y_axis} fill={activeColor} fillOpacity={0.1} stroke={activeColor} strokeWidth={2} />
              )}
            </ChartType>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] p-8 bg-[#f8fafc] mesh-bg pb-20">
      {/* Header Intelligence Interface */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 glass-panel p-8">
        <div>
           <div className="flex items-center gap-3 mb-1">
             <div className="p-2 bg-slate-900 rounded-lg text-white">
               <Activity size={20} />
             </div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none mt-1">SENTINEL DASHBOARD</h1>
           </div>
           <p className="text-slate-500 font-bold text-sm tracking-tight">Active Node Hub • Real-Time Autonomous Analytics</p>
        </div>

        <div className="flex items-center gap-4 bg-white/50 p-2 rounded-2xl border border-slate-200">
           <Database size={18} className="text-slate-400 ml-2" />
           <select 
             value={selectedFile}
             onChange={(e) => setSelectedFile(e.target.value)}
             className="bg-transparent border-none outline-none text-sm font-black text-slate-800 uppercase tracking-tight pr-8 cursor-pointer"
           >
             {datasets.map(d => <option key={d.filename} value={d.filename}>{d.filename}</option>)}
           </select>
           <button onClick={loadDynamicIntelligence} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black active:scale-95 transition-all">
             Refresh Core
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Dynamic Telemetry Sidebars */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Node Telemetry</h2>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          
          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 scrollbar-hide">
            {metadata && Object.entries(metadata.summary_stats).map(([col, s]) => (
              <div key={col} className="glass-panel p-6 border-l-4 border-l-ocean-500 group hover:translate-x-2 transition-transform duration-500">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-ocean-600 transition-colors">{col}</p>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-black text-slate-900 tabular-nums leading-none tracking-tighter">{s.avg}</p>
                  <span className="text-[10px] font-bold text-slate-400 mb-0.5 tracking-tight">μ Mean Scale</span>
                </div>
                <div className="mt-4 flex gap-4 pt-4 border-t border-slate-50">
                   <div className="flex-1">
                      <p className="text-[8px] font-black text-slate-300 uppercase">Max</p>
                      <p className="text-[12px] font-black text-slate-600">{s.max}</p>
                   </div>
                   <div className="flex-1 border-l border-slate-50 pl-4">
                      <p className="text-[8px] font-black text-slate-300 uppercase">Min</p>
                      <p className="text-[12px] font-black text-slate-600">{s.min}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-ocean-500/20 rounded-full blur-3xl" />
             <div className="flex items-center gap-3 mb-6">
                <AlertCircle size={20} className="text-ocean-400" />
                <h3 className="text-sm font-black uppercase tracking-widest text-ocean-400">AI Intelligence Triage</h3>
             </div>
             <div className="space-y-6">
                {metadata?.insights.map((ins, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-ocean-400 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{ins.type}</p>
                      <p className="text-xs font-bold leading-relaxed">{ins.text}</p>
                    </div>
                  </div>
                ))}
                {!metadata?.insights.length && <p className="text-xs font-bold opacity-50 italic">Processing neural registry... No anomalies detected.</p>}
             </div>
          </div>
        </div>

        {/* Dynamic Visualization Engine Area */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Processing Visuals</h2>
            <div className="flex gap-3">
               <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm"><RefreshCcw size={14} /></button>
               <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm"><Layers size={14} /></button>
            </div>
          </div>

          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-80 bg-slate-100 rounded-[2rem] animate-pulse flex items-center justify-center">
                    <Database size={40} className="text-slate-200 animate-bounce" />
                  </div>
                ))}
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {metadata?.visuals.map((vis, idx) => renderDynamicChart(vis, idx))}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OceanAnalytics;

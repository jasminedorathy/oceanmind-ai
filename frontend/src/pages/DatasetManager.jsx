import React, { useState, useEffect } from 'react';
import { Upload, Database, FileText, CheckCircle2, AlertCircle, Trash2, ShieldCheck, Zap } from 'lucide-react';
import api from '../services/api';

const DatasetManager = () => {
  const [datasets, setDatasets] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDatasets();
  }, []);

  const filteredDatasets = datasets.filter(ds => 
    ds.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchDatasets = async () => {
    try {
      const { data } = await api.get('/datasets');
      setDatasets(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/datasets/upload', formData);
      setMsg({ type: 'success', text: `Deployed ${file.name} to intelligence core.` });
      fetchDatasets();
    } catch (err) {
      setMsg({ type: 'error', text: 'Upload failed: Server rejected the stream.' });
    } finally {
      setUploading(false);
    }
  };

  const handleTrain = async (filename) => {
    try {
      setMsg({ type: 'success', text: `Initiating neural training for ${filename}...` });
      await api.post(`/analytics/train/${filename}`);
      setMsg({ type: 'success', text: `Neural training complete. ${filename} is now active.` });
      fetchDatasets();
    } catch (err) {
      setMsg({ type: 'error', text: 'Training failed: Neural engine offline.' });
    }
  };

  const handleDelete = async (filename) => {
    try {
      await api.delete(`/datasets/${filename}`);
      fetchDatasets();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] p-8 space-y-8 max-w-7xl mx-auto page-enter mesh-bg pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight glow-ocean">Registry & Ingestion</h1>
          <p className="text-slate-500 font-medium text-lg mt-1 text-balance">Manage environmental datasets for AI processing & neural training.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white/80 backdrop-blur-md border border-ocean-100 px-6 py-4 rounded-[2rem] flex items-center gap-4 shadow-2xl shadow-ocean-500/10 transition-transform hover:scale-105 duration-500">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
                <ShieldCheck size={20} className="text-emerald-500 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Security Node</span>
                <span className="text-sm font-black text-emerald-600 tracking-tighter transition-all">AES-256 ACTIVE</span>
              </div>
           </div>
        </div>
      </div>

      {msg && (
        <div className={`p-6 rounded-[2rem] flex items-center gap-4 border-2 transition-all duration-500 shadow-2xl ${
          msg.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700 shadow-emerald-500/10' : 'bg-rose-50 border-rose-100 text-rose-700 shadow-rose-500/10'
        }`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${msg.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
            {msg.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          </div>
          <span className="text-lg font-black tracking-tight">{msg.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Box */}
        <div className="lg:col-span-1">
          <label className="relative group cursor-pointer block">
            <input type="file" className="hidden" onChange={handleFileUpload} accept=".csv" />
            <div className="glass-panel group-hover:border-ocean-400 group-hover:bg-ocean-50/50 p-12 flex flex-col items-center justify-center gap-8 transition-all h-[500px] border-dashed border-2 text-center group-active:scale-[0.98]">
              <div className="w-32 h-32 bg-ocean-50 rounded-full flex items-center justify-center text-ocean-600 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-inner border border-ocean-100 relative">
                <div className="absolute inset-0 bg-ocean-400 opacity-0 group-hover:opacity-10 rounded-full animate-ping" />
                <Upload size={48} className="relative z-10" />
              </div>
              <div className="space-y-2">
                <p className="text-slate-900 font-black text-3xl tracking-tighter">Deploy Dataset</p>
                <p className="text-slate-400 font-medium text-lg leading-tight">Drag & drop or browse high-fidelity telemetry .CSV</p>
              </div>
              {uploading && (
                <div className="flex flex-col items-center gap-4 py-4">
                  <div className="w-12 h-12 border-4 border-ocean-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] font-black text-ocean-600 uppercase tracking-[0.3em] animate-pulse">Neural Ingestion Active...</span>
                </div>
              )}
              <div className="mt-4 px-6 py-3 bg-slate-900 text-white/90 rounded-2xl border border-white/10 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl group-hover:bg-black transition-colors">
                 <Zap size={16} className="text-amber-400" /> Auto-Clean Telemetry: ON
              </div>
            </div>
          </label>
        </div>

        {/* Dataset List */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Neural Registry</h3>
            <div className="flex-1 max-w-sm relative">
               <input 
                 type="text"
                 placeholder="Search registry..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full bg-white/80 border border-slate-200 rounded-2xl pl-4 pr-4 py-2 text-xs focus:ring-4 focus:ring-ocean-500/5 outline-none font-bold"
               />
            </div>
            <span className="text-[10px] font-black text-ocean-600 bg-ocean-50 border border-ocean-100 px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">{datasets.length} Active Nodes Registered</span>
          </div>

          <div className="grid grid-cols-1 gap-6 overflow-y-auto max-h-[700px] pr-4 scrollbar-hide pb-10">
            {filteredDatasets.map((ds, idx) => (
              <div key={idx} className="glass-panel p-10 flex flex-col md:flex-row items-center gap-10 group hover-premium transition-all duration-700">
                <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-center text-slate-300 group-hover:text-ocean-600 group-hover:bg-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 shadow-sm relative overflow-hidden">
                   <div className="absolute inset-0 bg-ocean-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                   <FileText size={36} className="relative z-10" />
                </div>
                <div className="flex-1 w-full text-center md:text-left">
                  <div className="flex items-center gap-4 mb-3 justify-center md:justify-start">
                    <h4 className="font-black text-slate-900 text-2xl tracking-tighter group-hover:text-ocean-700 transition-colors uppercase">{ds.filename}</h4>
                    <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                      ds.status === 'trained' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {ds.status === 'trained' ? 'Neural Link Active' : 'Ingestion Only'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 mt-2">
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-xl border border-slate-100 transition-all group-hover:border-ocean-200">
                       <Database size={16} className="text-ocean-500" /> 
                       <span className="text-sm font-black text-slate-600 tracking-tight tabular-nums">{ds.rows.toLocaleString()} Records</span>
                    </div>
                    {ds.status !== 'trained' ? (
                       <button 
                         onClick={() => handleTrain(ds.filename)}
                         className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-ocean-600 transition-all shadow-lg active:scale-95"
                       >
                          <Zap size={14} className="text-amber-400" /> Process Intelligence
                       </button>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 rounded-xl border border-emerald-100 transition-all group-hover:border-emerald-200">
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                         <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Training Verified</span>
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(ds.filename)}
                  className="p-5 text-slate-300 hover:text-white hover:bg-rose-500 rounded-2xl transition-all active:scale-95 group-hover:opacity-100 md:opacity-0 shadow-lg border border-slate-100 hover:border-transparent"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            ))}

            {datasets.length === 0 && (
              <div className="text-center py-40 glass-panel border-dashed border-2 border-slate-200 opacity-60 flex flex-col items-center">
                <div className="w-28 h-28 bg-slate-50 rounded-full flex items-center justify-center mb-10 border border-slate-100">
                  <Database size={60} className="text-slate-200" />
                </div>
                <p className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">Null Registry</p>
                <p className="text-lg text-slate-400 font-medium">No datasets currently mapped to this node. Begin ingestion by deploying a CSV telemetry link.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetManager;

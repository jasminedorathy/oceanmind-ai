import React, { useState, useEffect } from 'react';
import { 
  FileBarChart, 
  Download, 
  Search, 
  Calendar,
  Lock,
  ChevronRight,
  ShieldCheck,
  Zap,
  Layers,
  FileText
} from 'lucide-react';

const initialReports = [
  { id: 1, title: 'Indian Ocean Anomaly Q1', date: '2026-03-12', size: '2.4 MB', type: 'Intelligence Report', security: 'Level 4' },
  { id: 2, title: 'Biodiversity Shift Study', date: '2026-03-08', size: '4.1 MB', type: 'Biological Audit', security: 'Level 2' },
  { id: 3, title: 'Microplastic Density Log', date: '2026-03-01', size: '15.2 MB', type: 'Waste Telemetry', security: 'Level 3' },
  { id: 4, title: 'Arctic Thermal Variance', date: '2026-02-25', size: '1.2 MB', type: 'Climate Predict', security: 'Level 5' },
];

const ResearchReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredReports, setFilteredReports] = useState(initialReports);

  useEffect(() => {
    const results = initialReports.filter(report =>
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReports(results);
  }, [searchTerm]);

  return (
    <div className="min-h-[calc(100vh-5rem)] p-8 space-y-8 max-w-7xl mx-auto page-enter mesh-bg pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight glow-ocean">Intelligence Repository</h1>
          <p className="text-slate-500 font-medium text-lg mt-1 text-balance">Archived environmental findings & neural intelligence summaries.</p>
        </div>
        <div className="relative group self-start md:self-auto">
           <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-ocean-600 transition-colors" size={20} />
           <input 
             type="text" 
             placeholder="Search archives..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full md:w-96 bg-white/80 backdrop-blur-md border border-ocean-100 rounded-[2rem] pl-14 pr-6 py-4 text-sm text-slate-900 focus:border-ocean-500 focus:ring-8 focus:ring-ocean-500/5 transition-all outline-none shadow-2xl shadow-ocean-500/5"
           />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         {[
           { label: 'Total Files', val: '1,240', color: 'text-ocean-600', bg: 'bg-ocean-50', border: 'border-ocean-100', icon: Layers },
           { label: 'Verified', val: '98%', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: ShieldCheck },
           { label: 'Recent', val: '12 New', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: Zap },
           { label: 'Encrypted', val: 'AES-256', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', icon: Lock }
         ].map((stat, i) => (
           <div key={i} className="glass-panel p-8 flex items-center gap-6 hover-premium group cursor-help">
              <div className={`w-14 h-14 ${stat.bg} ${stat.border} ${stat.color} rounded-2xl flex items-center justify-center transition-all group-hover:rotate-6 shadow-lg shadow-slate-200/50`}>
                 <stat.icon size={28} />
              </div>
              <div>
                 <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                 <p className="text-2xl font-black text-slate-900 tracking-tighter tabular-nums">{stat.val}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="glass-panel overflow-hidden transition-all hover:shadow-2xl hover:border-white/60">
        <div className="p-10 border-b border-slate-100 bg-white/30 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
           <h3 className="text-xl font-black text-slate-900 flex items-center gap-4 tracking-tight">
              <div className="p-3 bg-ocean-600 text-white rounded-xl shadow-lg shadow-ocean-500/20">
                <FileBarChart size={20} />
              </div>
              Data Intelligence Archive
           </h3>
           <div className="flex gap-4">
              <button className="px-6 py-3 bg-white border border-slate-200 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-ocean-600 hover:border-ocean-200 transition-all shadow-sm active:scale-95">By Neural Date</button>
              <button className="px-6 py-3 bg-white border border-slate-200 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-ocean-600 hover:border-ocean-200 transition-all shadow-sm active:scale-95">By Security Clearance</button>
           </div>
        </div>
        
        <div className="divide-y divide-slate-100 min-h-[500px]">
          {filteredReports.map((report) => (
            <div key={report.id} className="p-10 flex flex-col md:flex-row items-center justify-between group hover:bg-ocean-50/20 transition-all duration-500 cursor-pointer relative">
              <div className="flex items-center gap-8 flex-1 w-full">
                <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-ocean-600 group-hover:border-ocean-500/30 group-hover:rotate-2 group-hover:scale-110 transition-all duration-700 shadow-sm overflow-hidden relative">
                   <div className="absolute inset-0 bg-ocean-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                   <FileText size={28} className="relative z-10" />
                </div>
                <div>
                   <h4 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-3 tracking-tight group-hover:text-ocean-700 transition-colors uppercase">
                      {report.title} <ChevronRight size={18} className="text-ocean-600 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2" />
                   </h4>
                   <div className="flex flex-wrap items-center gap-5 text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
                      <span className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 text-slate-500"><Calendar size={12} /> {report.date}</span>
                      <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                      <span className="text-ocean-600/60 transition-colors group-hover:text-ocean-600">{report.type}</span>
                      <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                      <span className="bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 text-slate-500">{report.size}</span>
                   </div>
                </div>
              </div>

              <div className="flex items-center gap-10 mt-6 md:mt-0 w-full md:w-auto self-start md:self-auto justify-end">
                 <div className="flex flex-col items-end">
                    <div className="flex items-center gap-3 px-4 py-2 bg-white/50 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm transition-all group-hover:border-amber-200">
                       <Lock size={14} className="text-amber-600" />
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">{report.security}</span>
                    </div>
                 </div>
                 <button className="p-5 bg-white hover:bg-slate-900 text-ocean-600 hover:text-white rounded-2xl transition-all shadow-xl hover:shadow-slate-900/20 active:scale-90 group/btn border border-ocean-100 hover:border-slate-900">
                    <Download size={24} className="group-hover/btn:animate-bounce" />
                 </button>
              </div>
            </div>
          ))}

          {filteredReports.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-slate-300">
               <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 border border-dashed border-slate-200">
                  <Search size={48} className="opacity-20 translate-x-1 translate-y-1" />
               </div>
               <p className="text-2xl font-black text-slate-900 mb-2">Archive Search Failed</p>
               <p className="text-slate-400 font-medium max-w-sm text-center">We couldn't find any records matching "{searchTerm}" in the neural database.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResearchReports;

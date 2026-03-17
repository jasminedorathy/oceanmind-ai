import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Zap,
  Search,
  ShieldCheck,
  Trash2,
  Database,
  MessageSquare,
  Cpu,
  Info,
  ChevronDown
} from 'lucide-react';
import api from '../services/api';

const AICopilot = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'bot', 
      text: "Neural link secured. I am OceanMind AI, your sentinel for marine intelligence. I'm connected to the registry and ready to analyze your telemetry datasets. How can I assist your research today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [prompt, setPrompt] = useState('');
  const [chatStarted, setChatStarted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activeDataset, setActiveDataset] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Fetch latest trained dataset to show context
    const fetchContext = async () => {
      try {
        const { data } = await api.get('/datasets');
        const trained = data.filter(d => d.status === 'trained');
        if (trained.length > 0) {
          setActiveDataset(trained[0].filename);
        }
      } catch (err) {
        console.error("Failed to fetch context:", err);
      }
    };
    fetchContext();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!prompt.trim()) return;
    
    const userMsg = { 
      role: 'user', 
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setPrompt('');
    setLoading(true);

    try {
      const { data } = await api.post('/analytics/copilot', { 
        prompt: userMsg.text,
        filename: activeDataset 
      });
      setMessages(prev => [...prev, {
        ...data,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: "Neural connection error. The Sentinel core is currently unreachable. Please verify your network and ensure the neural backend is active.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col bg-[#f8fafc] overflow-hidden lg:flex-row">
      {/* Side Knowledge Hub (Only on LG) */}
      <div className="hidden lg:flex w-80 bg-white border-r border-slate-200 flex-col p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Neural Status</h3>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-black text-emerald-700 uppercase tracking-tight">Core Active</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Context</h3>
          {activeDataset ? (
            <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:scale-110 transition-transform">
                <Database size={40} />
              </div>
              <p className="text-[8px] font-black text-ocean-400 uppercase tracking-widest mb-1">Registry Node</p>
              <p className="text-sm font-bold truncate leading-none">{activeDataset}</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-ocean-400 rounded-full" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Intelligence Ready</span>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <p className="text-[10px] text-amber-700 font-bold uppercase mb-2">No Trained Context</p>
              <p className="text-[10px] text-amber-600 leading-relaxed font-medium">Please upload and train a dataset in the Registry to enable neural analysis.</p>
            </div>
          )}
        </div>

        <div className="flex-1" />
        
        <div className="bg-ocean-50 rounded-2xl p-4 border border-ocean-100">
          <div className="flex items-center gap-2 mb-2">
            <Info size={14} className="text-ocean-600" />
            <span className="text-[10px] font-black text-ocean-700 uppercase">Pro Tip</span>
          </div>
          <p className="text-[10px] text-slate-600 leading-relaxed">Ask about "temperature anomalies" or "pollution trends" for a deep-dive analysis of your current dataset.</p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative bg-white lg:bg-transparent">
        {/* Header */}
        <div className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Cpu size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight leading-none">SENTINEL_V4</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Neural Intelligence Hub</span>
              </div>
            </div>
          </div>
          <button className="lg:hidden w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
             <ChevronDown size={20} />
          </button>
        </div>

        {/* Scrollable Context (for active dataset on mobile) */}
        {!activeDataset && (
          <div className="bg-amber-500 text-white text-[10px] font-black uppercase tracking-[0.2em] py-2 text-center px-4">
             Warning: No neural context detected. Intelligence limited.
          </div>
        )}

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 max-w-5xl mx-auto w-full scrollbar-hide">
          {messages.map((m, i) => (
            <div key={i} className={`flex items-start gap-4 md:gap-6 ${m.role === 'user' ? 'flex-row-reverse' : ''} animate-slideInUp`}>
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                m.role === 'bot' 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-ocean-600 text-white'
              }`}>
                {m.role === 'bot' ? <Bot size={20} /> : <User size={20} />}
              </div>
              
              <div className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[75%]`}>
                <div className={`px-6 py-4 rounded-[1.5rem] text-sm md:text-base font-medium shadow-sm border ${
                  m.role === 'bot' 
                    ? 'bg-white border-slate-200 text-slate-900 rounded-tl-none' 
                    : 'bg-ocean-600 text-white border-ocean-500 rounded-tr-none'
                }`}>
                  {m.text}
                </div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 px-1">
                  {m.role === 'bot' ? 'Sentinel' : 'You'} • {m.timestamp}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-6 animate-pulse">
               <div className="w-12 h-12 bg-slate-200 rounded-xl" />
               <div className="bg-white border border-slate-100 rounded-[1.5rem] rounded-tl-none px-6 py-4 w-32 flex gap-1 items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
               </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Floating Input Area */}
        <div className="p-6 md:p-10 bg-white/50 backdrop-blur-xl">
           <div className="max-w-4xl mx-auto w-full relative group">
              <input 
                type="text"
                placeholder="Submit query to OceanMind Sentinel..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="w-full bg-white border border-slate-200 rounded-2xl pl-6 pr-20 py-5 text-sm md:text-base text-slate-900 focus:border-ocean-500 focus:ring-4 focus:ring-ocean-500/10 transition-all outline-none shadow-xl shadow-slate-200/50"
              />
              <button 
                onClick={handleSend}
                disabled={loading || !prompt}
                className="absolute right-2 top-2 bottom-2 px-6 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center hover:bg-black transition-all active:scale-95 disabled:opacity-50"
              >
                 <Send size={18} />
              </button>
           </div>
           <p className="text-center text-[9px] text-slate-400 mt-4 font-black uppercase tracking-[0.3em]">
             Neural Core V4.2 • Secure Transmission
           </p>
        </div>
      </div>
    </div>
  );
};

export default AICopilot;

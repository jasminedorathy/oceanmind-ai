import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Zap,
  Search,
  ShieldCheck,
  Trash2
} from 'lucide-react';

const AICopilot = () => {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [chatStarted, setChatStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!prompt.trim()) return;
    
    setChatStarted(true);
    const userMsg = { role: 'user', text: prompt };
    setMessages(prev => [...prev, userMsg]);
    setPrompt('');
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg = { 
        role: 'bot', 
        text: `Neural link established. Analysis of deep-sea telemetry for "${userMsg.text}" is active. Based on current registry data, the Indian Ocean thermal index is showing a +0.4 correlation with coral bleaching events in sector 5. Would you like me to generate a projection chart?` 
      };
      setMessages(prev => [...prev, aiMsg]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col mesh-bg page-enter">
      {/* Messages View */}
      <div className="flex-1 overflow-y-auto p-12 space-y-10 scrollbar-hide max-w-6xl mx-auto w-full">
         {!chatStarted ? (
           <div className="h-full flex flex-col items-center justify-center text-center space-y-12 py-20">
              <div className="relative">
                <div className="absolute inset-0 bg-ocean-500 blur-[100px] opacity-20 animate-pulse rounded-full" />
                <div className="w-40 h-40 bg-slate-900 rounded-[3.5rem] flex items-center justify-center relative z-10 shadow-[0_40px_80px_-15px_rgba(15,23,42,0.6)] group border border-white/10">
                   <Bot size={80} className="text-white group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute -top-4 -right-4 w-12 h-12 bg-ocean-500 rounded-2xl flex items-center justify-center border-4 border-slate-900 text-white shadow-xl animate-bounce">
                      <Zap size={24} />
                   </div>
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">Sentinel Neural Link</h1>
                <p className="text-slate-500 text-xl font-medium max-w-2xl leading-relaxed">Harness the power of SENTINEL-V4 to analyze deep-sea telemetry, predict biological decline, or generate intelligence summaries.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                {[
                  "Analyze Indian Ocean thermal anomalies Q1",
                  "Predict bleaching probability at GBR Cluster B4",
                  "Correlate microplastic density with species decline",
                  "Generate regional instability risk projection"
                ].map((p, i) => (
                  <button 
                    key={i} 
                    onClick={() => { setPrompt(p); setChatStarted(true); handleSend(); }}
                    className="glass-panel p-6 text-left hover-premium group transition-all duration-500 flex items-center justify-between border-2 border-transparent hover:border-ocean-300"
                  >
                    <span className="text-sm font-black text-slate-700 tracking-tight group-hover:text-ocean-700 transition-colors uppercase leading-snug">{p}</span>
                    <Sparkles className="text-slate-300 group-hover:text-ocean-500 transition-all group-hover:rotate-12" size={24} />
                  </button>
                ))}
              </div>
           </div>
         ) : (
           <div className="space-y-10 pb-40">
              {messages.map((m, i) => (
                <div key={i} className={`flex items-start gap-8 ${m.role === 'user' ? 'flex-row-reverse' : ''} group animate-slideInUp`}>
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 ${
                     m.role === 'bot' ? 'bg-slate-900 text-white border border-white/10' : 'bg-ocean-600 text-white border border-ocean-500'
                   }`}>
                      {m.role === 'bot' ? <Bot size={28} /> : <User size={28} />}
                   </div>
                   <div className={`max-w-[85%] glass-panel px-10 py-8 relative ${
                     m.role === 'bot' ? 'rounded-tl-none border-l-4 border-l-ocean-600' : 'rounded-tr-none bg-slate-900/5 backdrop-blur-3xl'
                   }`}>
                      <div className="flex items-center gap-3 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                         {m.role === 'bot' ? <span className="text-ocean-600">Sentinel Intelligence Node_v4</span> : 'Authenticated Researcher'}
                         <span className="w-1 h-1 bg-slate-300 rounded-full" />
                         <span>AUTHORIZED ACCESS</span>
                      </div>
                      <p className="text-slate-900 text-xl font-medium leading-relaxed tracking-tight">{m.text}</p>
                      {m.role === 'bot' && (
                        <div className="mt-8 pt-8 border-t border-slate-100 flex items-center gap-6">
                           <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-ocean-600 transition-colors group/tool">
                              <Search size={14} className="group-hover/tool:scale-125 transition-transform" /> Cross-Reference Data
                           </button>
                           <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors group/tool">
                              <ShieldCheck size={14} className="group-hover/tool:scale-125 transition-transform" /> Verify Source
                           </button>
                           <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 transition-colors group/tool ml-auto">
                              <Trash2 size={14} /> Delete Entry
                           </button>
                        </div>
                      )}
                   </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-4 text-ocean-600 bg-ocean-50/50 backdrop-blur-md px-8 py-4 rounded-3xl border border-ocean-100 w-fit animate-pulse ml-24">
                   <div className="w-2 h-2 bg-ocean-600 rounded-full animate-bounce" />
                   <div className="w-2 h-2 bg-ocean-600 rounded-full animate-bounce [animation-delay:-.3s]" />
                   <div className="w-2 h-2 bg-ocean-600 rounded-full animate-bounce [animation-delay:-.5s]" />
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] ml-2">Synthesizing Neural Response...</span>
                </div>
              )}
              <div ref={scrollRef} />
           </div>
         )}
      </div>

      {/* Input Hub */}
      <div className="p-12 glass-panel border-0 border-t border-white/50 sticky bottom-0 z-50 rounded-none rounded-t-[4rem] shadow-[0_-40px_100px_-20px_rgba(0,0,0,0.08)] backdrop-blur-3xl">
         <div className="max-w-6xl mx-auto w-full relative group">
            <div className="absolute inset-0 bg-ocean-500/5 blur-3xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
            <input 
              type="text"
              placeholder="Query the Sentinel Neural Hub..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="w-full bg-white/70 border-2 border-white/10 rounded-[2.5rem] pl-10 pr-28 py-8 text-xl text-slate-900 focus:border-ocean-500 focus:ring-8 focus:ring-ocean-500/5 transition-all outline-none shadow-2xl relative z-10 font-medium placeholder:text-slate-400"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !prompt}
              className="absolute right-4 top-4 bottom-4 px-10 bg-slate-900 text-white rounded-[1.8rem] font-extrabold flex items-center justify-center gap-4 shadow-xl hover:bg-black hover:scale-105 active:scale-95 transition-all disabled:opacity-50 relative z-20 group/send"
            >
               EXECUTE QUERY <Send size={24} className="group-hover/send:translate-x-1 group-hover/send:-translate-y-1 transition-transform" />
            </button>
         </div>
      </div>
    </div>
  );
};

export default AICopilot;

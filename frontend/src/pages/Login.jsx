import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Mail, 
  Lock, 
  User, 
  AlertCircle,
  ChevronRight,
  Fingerprint,
  Zap,
  Globe,
  Waves,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = isLogin ? '/auth/login' : '/auth/signup';
      
      if (isLogin) {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);
        const response = await api.post(url, formData);
        login(response.data, response.data.access_token);
        navigate('/');
      } else {
        const data = { email, password, full_name: fullName };
        await api.post(url, data);
        setIsLogin(true);
        setError('Account initialized successfully. Credentials synced.');
      }
    } catch (err) {
      console.error('Auth gateway failure:', err.response?.data);
      setError(err.response?.data?.detail || 'Handshake failed: Network anomaly or invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 lg:p-12 relative overflow-hidden font-sans mesh-bg">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-ocean-500/10 blur-[150px] rounded-full animate-pulse transition-opacity duration-1000" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse [animation-delay:-2s]" />

      <div className={`max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 glass-panel border-0 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] relative z-10 overflow-hidden transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        
        {/* Left Side: Branding & Intelligence HUD */}
        <div className="hidden lg:flex flex-col justify-between p-24 bg-slate-900 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-[3000ms]">
             <Globe size={400} className="text-white" />
          </div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 p-12 opacity-5 group-hover:scale-110 transition-all duration-[3000ms]">
             <Waves size={500} className="text-white" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-6 mb-16">
               <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                  <ShieldAlert className="text-slate-900" size={32} />
               </div>
               <div>
                 <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
                   SENTINEL<span className="text-ocean-400">V4</span>
                 </h2>
                 <div className="flex items-center gap-2 mt-1">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Intelligence Link</span>
                 </div>
               </div>
            </div>

            <h1 className="text-7xl font-black text-white tracking-tighter leading-[0.9] mb-10 uppercase transition-all duration-700 group-hover:translate-x-2">
              Deep-Sea <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-400 via-cyan-300 to-emerald-400">Neural</span> <br />
              Insight.
            </h1>
            <p className="text-slate-400 text-xl font-medium max-w-md leading-relaxed">
              Harnessing planetary-scale telemetry to protect terrestrial biodiversity through mission-critical AI intelligence.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-8 border-t border-white/10 pt-16">
             <div className="flex flex-col gap-3">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center transition-colors group-hover:border-ocean-400/30">
                   <ShieldCheck size={24} className="text-emerald-400" />
                 </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Quantum Encryption</p>
             </div>
             <div className="flex flex-col gap-3">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center transition-colors group-hover:border-ocean-400/30">
                   <Zap size={24} className="text-amber-400" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Neural Sync-Latency</p>
             </div>
          </div>
        </div>

        {/* Right Side: Identity Core */}
        <div className="p-16 lg:p-24 flex flex-col justify-center bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-ocean-500/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="mb-16 relative z-10">
            <h3 className="text-5xl font-black text-slate-900 tracking-tighter mb-4 uppercase">
              {isLogin ? 'Authorization' : 'Provisioning'}
            </h3>
            <p className="text-xl text-slate-500 font-medium">Verify your researcher identity to access the sentinel grid.</p>
          </div>

          <div className="flex bg-slate-50 p-2 rounded-[2.5rem] mb-12 border border-slate-100 relative z-10">
            <button 
              type="button"
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-5 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 ${isLogin ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/40 translate-z-10' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'}`}
            >
              Identity Lock
            </button>
            <button 
              type="button"
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-5 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 ${!isLogin ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/40 translate-z-10' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'}`}
            >
              New Node
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            {!isLogin && (
              <div className="space-y-3 group/input">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 flex items-center gap-2">
                   Authenticated User <div className="w-1.5 h-1.5 bg-ocean-500 rounded-full animate-pulse" />
                </label>
                <div className="relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-ocean-600 group-focus-within/input:scale-110 transition-all duration-500" size={24} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] pl-16 pr-8 py-6 text-xl text-slate-900 focus:bg-white focus:border-ocean-500/20 focus:ring-8 focus:ring-ocean-500/5 outline-none transition-all placeholder:text-slate-300 font-bold"
                    placeholder="Full Researcher Name"
                  />
                </div>
              </div>
            )}

            <div className="space-y-3 group/input">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Access Portal Vector</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-ocean-600 group-focus-within/input:scale-110 transition-all duration-500" size={24} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] pl-16 pr-8 py-6 text-xl text-slate-900 focus:bg-white focus:border-ocean-500/20 focus:ring-8 focus:ring-ocean-500/5 outline-none transition-all placeholder:text-slate-300 font-bold"
                  placeholder="name@sentinel.hub"
                />
              </div>
            </div>

            <div className="space-y-3 group/input">
              <div className="flex items-center justify-between ml-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Neural Passcode</label>
                 {isLogin && <button type="button" className="text-[10px] font-black text-ocean-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Reset Code?</button>}
              </div>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-ocean-600 group-focus-within/input:scale-110 transition-all duration-500" size={24} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] pl-16 pr-8 py-6 text-xl text-slate-900 focus:bg-white focus:border-ocean-500/20 focus:ring-8 focus:ring-ocean-500/5 outline-none transition-all placeholder:text-slate-300 font-bold"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {error && (
              <div className={`p-8 rounded-[2.5rem] flex items-start gap-5 animate-in fade-in slide-in-from-top-6 duration-700 shadow-2xl ${error.includes('successfully') ? 'bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-emerald-500/5' : 'bg-rose-50 border border-rose-100 text-rose-600 shadow-rose-500/5'}`}>
                {error.includes('successfully') ? <ShieldCheck className="shrink-0 animate-bounce" size={24} /> : <AlertCircle className="shrink-0 animate-pulse" size={24} />}
                <p className="text-xs font-black uppercase tracking-widest leading-relaxed mt-0.5">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-black text-white py-8 rounded-[2.5rem] font-black flex items-center justify-center gap-5 transition-all shadow-[0_40px_80px_-20px_rgba(15,23,42,0.5)] active:scale-[0.98] disabled:opacity-50 group/submit mt-12 border border-white/10"
            >
              {loading ? (
                <><RefreshCw className="animate-spin text-ocean-400" size={28} /> <span className="uppercase tracking-[0.3em]">Neural Verification...</span></>
              ) : (
                <>
                   <Fingerprint size={28} className="text-ocean-400 group-hover:scale-125 transition-transform duration-700" />
                   <span className="uppercase tracking-[0.3em] font-black">{isLogin ? 'Establish Link' : 'Register Alpha Node'}</span>
                   <ChevronRight size={28} className="group-hover:translate-x-3 transition-transform duration-700 text-ocean-400 ml-auto" />
                </>
              )}
            </button>
          </form>

          <p className="mt-16 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] leading-none mb-4 lg:mb-0">
             SENTINEL-NODE v4.2.0-SENTINEL_SECURE
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

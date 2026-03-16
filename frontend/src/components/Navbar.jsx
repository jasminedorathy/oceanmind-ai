import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  User, 
  Globe, 
  ChevronDown,
  Activity,
  Command,
  Menu,
  Settings,
  LogOut
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    if (searchTerm.toLowerCase().includes('report') || searchTerm.toLowerCase().includes('archive')) {
      navigate('/reports');
    } else if (searchTerm.toLowerCase().includes('map') || searchTerm.toLowerCase().includes('gps')) {
      navigate('/map');
    } else {
      navigate('/reports');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-24 bg-white/60 backdrop-blur-2xl border-b border-slate-100 px-6 lg:px-12 flex items-center justify-between sticky top-0 z-[100] shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-10 flex-1">
        {/* Mobile Spacer for the hamburger menu */}
        <div className="w-12 lg:hidden" />
        
        <form onSubmit={handleGlobalSearch} className="relative group w-full max-w-[150px] sm:max-w-xs md:max-w-lg">
          <div className="absolute inset-0 bg-ocean-500/5 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-ocean-600 group-focus-within:scale-110 transition-all" size={20} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Global Intelligence..." 
            className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] pl-16 pr-6 py-4 text-base text-slate-900 focus:bg-white focus:border-ocean-500/30 focus:ring-8 focus:ring-ocean-500/5 transition-all outline-none placeholder:text-slate-400 font-medium shadow-sm"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] text-slate-400 font-black group-focus-within:hidden cursor-help shadow-sm">
             <Command size={10} /> <span className="tracking-widest">K</span>
          </div>
        </form>
        
        <div className="hidden xl:flex items-center gap-10">
           <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <Globe size={14} className="text-ocean-600 animate-spin-slow" />
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Node-Alpha Seven</span>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">ASIA-PACIFIC REGION</span>
           </div>
           
           <div className="w-px h-8 bg-slate-100" />
           
           <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <Activity size={14} className="text-emerald-500" />
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Sync: Operational</span>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">LATENCY: 0.04 MS</span>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-5 lg:gap-8">
        <button className="relative w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-ocean-600 hover:border-ocean-200 hover:shadow-xl hover:shadow-ocean-500/5 transition-all active:scale-90 group">
          <Bell size={24} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
        </button>

        <div className="h-10 w-px bg-slate-100 hidden sm:block" />

        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-4 pl-4 cursor-pointer group"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-black text-slate-900 group-hover:text-ocean-600 transition-colors uppercase tracking-tight">{user?.full_name || 'Admin Authority'}</p>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mt-1">{user?.role || 'Lead Researcher'}</p>
            </div>
            <div className="w-14 h-14 p-1.5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl group-hover:scale-105 transition-all duration-500 shadow-2xl relative overflow-hidden active:scale-95">
               <div className="absolute inset-0 bg-ocean-500 opacity-0 group-hover:opacity-20 transition-opacity" />
               <div className="w-full h-full bg-slate-800 rounded-xl flex items-center justify-center text-white font-black text-xl border border-white/5 relative z-10">
                  {user?.full_name?.charAt(0) || 'A'}
               </div>
            </div>
          </div>

          {/* User Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-6 w-72 bg-white/90 backdrop-blur-2xl border border-slate-100 rounded-[2rem] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.15)] p-4 animate-in fade-in slide-in-from-top-4 duration-500 z-[200]">
              <div className="px-5 py-4 mb-4 bg-slate-50/50 rounded-2xl md:hidden">
                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{user?.full_name || 'Admin Authority'}</p>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{user?.role || 'Lead Researcher'}</p>
              </div>
              
              <button className="w-full flex items-center gap-4 px-5 py-4 text-slate-600 hover:text-ocean-600 hover:bg-ocean-50 rounded-2xl transition-all group overflow-hidden relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-6 bg-ocean-500 rounded-r-full transition-all duration-500" />
                <Settings size={20} className="text-slate-400 group-hover:text-ocean-600 group-hover:rotate-90 transition-all duration-500" />
                <span className="text-sm font-black uppercase tracking-widest">Neural Config</span>
              </button>
              
              <div className="h-px bg-slate-100 my-3 mx-4" />
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-5 py-4 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all group overflow-hidden relative"
              >
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-6 bg-rose-500 rounded-r-full transition-all duration-500" />
                <LogOut size={20} className="text-rose-400 group-hover:text-rose-600 group-hover:-translate-x-1 transition-all duration-500" />
                <span className="text-sm font-black uppercase tracking-widest">Sign Out Node</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

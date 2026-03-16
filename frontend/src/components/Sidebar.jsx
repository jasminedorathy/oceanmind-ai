import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Database, 
  Map as MapIcon, 
  MessageSquare, 
  Settings, 
  ShieldAlert, 
  FlaskConical,
  LogOut,
  LayoutDashboard,
  Waves,
  TrendingUp,
  Globe,
  Bell,
  Heart,
  FileBarChart,
  Skull,
  Zap,
  Activity,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import useAuthStore from '../store/authStore';

const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout);
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { title: 'Oceanic Map', icon: Globe, path: '/map' },
    { title: 'Ocean Analytics', icon: Waves, path: '/ocean' },
    { title: 'Biodiversity', icon: Heart, path: '/biodiversity' },
    { title: 'Pollution Monitor', icon: Skull, path: '/pollution' },
    { title: 'Climate Intelligence', icon: Zap, path: '/climate' },
    { title: 'Simulation Lab', icon: FlaskConical, path: '/simulation' },
    { title: 'Research Reports', icon: FileBarChart, path: '/reports' },
    { title: 'Dataset Registry', icon: Database, path: '/datasets' },
    { title: 'Alert Center', icon: Bell, path: '/alerts' },
    { title: 'AI Copilot', icon: MessageSquare, path: '/copilot' },
  ];

  // Close sidebar on route change for mobile
  useEffect(() => {
    setIsOpen(false);
  }, [window.location.pathname]);

  return (
    <>
      {/* Mobile Hamburger Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-[60] lg:hidden p-4 bg-slate-900 text-white rounded-2xl shadow-2xl active:scale-95 transition-all border border-white/10"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[50] lg:hidden animate-in fade-in duration-500"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-[55] w-80 bg-white/90 backdrop-blur-2xl border-r border-slate-100 flex flex-col transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)
        lg:translate-x-0 lg:static lg:block shadow-[20px_0_50px_-10px_rgba(0,0,0,0.03)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo Section */}
        <div className="p-10 mb-4">
          <div className="flex items-center gap-5 group cursor-pointer">
            <div className="w-14 h-14 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-slate-900/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 border border-white/10 relative overflow-hidden">
               <div className="absolute inset-0 bg-ocean-500 opacity-0 group-hover:opacity-20 transition-opacity" />
               <ShieldAlert className="text-white relative z-10" size={30} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-slate-900 leading-none mb-1">
                SENTINEL<span className="text-ocean-600">V4</span>
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">AI COMMAND CENTER</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-6 space-y-2 overflow-y-auto scrollbar-hide">
          <div className="px-4 py-4">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                <Activity size={12} className="text-ocean-500" /> Neural Interface
             </p>
             <div className="space-y-2">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-500 group relative overflow-hidden
                      ${isActive 
                        ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-ocean-500 rounded-r-full shadow-[0_0_15px_rgba(14,165,233,0.8)]" />
                        )}
                        <item.icon size={20} className={`transition-all duration-700 ${isActive ? 'text-ocean-400 scale-110' : 'group-hover:scale-110 group-hover:text-slate-900'}`} />
                        <span className={`text-sm tracking-tight transition-all duration-500 ${isActive ? 'font-black' : 'font-bold'}`}>
                           {item.title}
                        </span>
                        {!isActive && (
                          <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500 text-slate-300" />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
             </div>
          </div>
        </nav>

        {/* Bottom Utility Card */}
        <div className="p-8 mt-auto">
           <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 group hover:border-ocean-200 transition-all duration-700 cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                    <Zap size={20} className="text-amber-500" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Node Load</p>
                    <p className="text-sm font-black text-slate-900 tracking-tight transition-all tabular-nums group-hover:text-ocean-600">0.4% Latency</p>
                 </div>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                 <div className="bg-ocean-500 h-full w-[12%] animate-pulse" />
              </div>
           </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

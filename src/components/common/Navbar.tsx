import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  GraduationCap, 
  Sun, 
  Moon,
  LogOut
} from 'lucide-react';
import { NavItem } from './Sidebar';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  activeTab: NavItem;
  onOpenValidation: () => void;
  onOpenRequestSim: () => void;
  onOpenPortal?: () => void;
  onSearch?: (query: string) => void;
  onOpenProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  onOpenValidation, 
  onOpenRequestSim, 
  onOpenPortal,
  onOpenProfile 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();

  const tabTitles: Record<NavItem, string> = {
    dashboard: 'Dashboard',
    overview: 'Architecture Overview',
    network: 'Network Architecture & Subnets',
    identity: 'Identity & Access Management (IAM)',
    security: 'Cloud Security & Compliance Controls',
    hybrid: 'Hybrid Connectivity (IPSec VPN)',
    monitoring: 'Monitoring & SIEM Telemetry',
    cad: 'CAD Architecture Engineering Blueprint',
    mapping: 'Cloud Service Mapping',
    docs: 'Technical Documentation',
    validation: 'Case Study Compliance Verification'
  };

  const sampleNotifications = [
    {
      id: 'notif-1',
      title: 'RDS Multi-AZ Standby Synchronized (Simulated)',
      time: '10m ago',
      type: 'success',
      desc: 'Standby instance in simulated ap-south-1b verified healthy.'
    },
    {
      id: 'notif-2',
      title: 'Site-to-Site VPN Keepalive Active (Simulated)',
      time: '25m ago',
      type: 'info',
      desc: 'BGP session 65000 established with CVGU Campus gateway.'
    },
    {
      id: 'notif-3',
      title: 'CloudTrail Audit Stream Ingesting (Simulated)',
      time: '1h ago',
      type: 'info',
      desc: 'Immutable logs exported to encrypted S3 audit bucket.'
    }
  ];

  const initials = currentUser
    ? currentUser.fullName
        .split(' ')
        .filter(Boolean)
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'GU';

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between z-30 shrink-0 select-none font-sans transition-colors duration-150">
      
      {/* Left: Breadcrumbs & Page Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span className="text-slate-700 dark:text-slate-300 font-semibold">CVGU Portal</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
          <span className="text-blue-600 dark:text-blue-400 font-semibold capitalize">{activeTab}</span>
        </div>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />

        <h1 className="text-sm md:text-base font-bold text-slate-900 dark:text-white tracking-tight hidden sm:block">
          {tabTitles[activeTab]}
        </h1>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search architecture, subnets, services, IAM... (Ctrl + K)"
            className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 rounded-xl pl-9 pr-12 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none transition font-sans"
          />
          <kbd className="absolute right-3 top-2 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Status Indicator, Theme Toggle, Notifications, User Menu, Simulation */}
      <div className="flex items-center gap-2.5">
        
        {/* Simulation Status Indicator */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#ECFDF5] dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[#059669] dark:text-emerald-400 font-semibold">Simulation Status: Healthy</span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-500">ap-south-1 (Simulated)</span>
        </div>

        {/* Validation Score Pill */}
        <button
          onClick={onOpenValidation}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-200 dark:border-blue-800/40 transition"
          title="Case Study Requirements: 12/12 Represented"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="hidden md:inline text-blue-600/80 dark:text-blue-300/80">Compliance:</span>
          <span className="font-bold text-blue-700 dark:text-blue-300">12/12</span>
        </button>

        {/* Real Light / Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-xs font-medium hidden md:inline">Dark</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-medium hidden md:inline">Light</span>
            </>
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444]" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 space-y-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white">Simulated Telemetry Alerts</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">3 unread</span>
              </div>

              <div className="space-y-2.5">
                {sampleNotifications.map(n => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">{n.desc}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setNotificationsOpen(false)}
                className="w-full py-1.5 text-center text-slate-500 hover:text-slate-900 dark:hover:text-white text-[11px] transition"
              >
                Close Notifications
              </button>
            </div>
          )}
        </div>

        {/* Simulate Request Shortcut */}
        <button
          onClick={onOpenRequestSim}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold transition shadow-sm active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">Simulate</span> Request
        </button>

        {/* Campus Portal Workspace Switcher */}
        {onOpenPortal && (
          <button
            onClick={onOpenPortal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 text-xs font-semibold transition shadow-sm"
            title="Switch to Student / Faculty / Admin Workspaces"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Campus</span> Portal
          </button>
        )}

        {/* User Profile & Logout Group (CENTRALIZED USER IDENTITY) */}
        <div className="relative flex items-center gap-1.5">
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition"
            title="View authenticated profile and permissions"
          >
            <div className={`w-7 h-7 rounded-lg border flex items-center justify-center font-bold font-mono text-xs ${
              currentUser?.role === 'ADMINISTRATOR'
                ? 'bg-purple-100 dark:bg-purple-950 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300'
                : currentUser?.role === 'FACULTY'
                ? 'bg-amber-100 dark:bg-amber-950 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                : 'bg-blue-100 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
            }`}>
              {initials}
            </div>
            <div className="hidden lg:block text-left text-xs">
              <p className="font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[130px]">
                {currentUser ? currentUser.fullName : 'Guest Session'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono capitalize">
                {currentUser ? currentUser.role.toLowerCase() : 'Unauthenticated'}
              </p>
            </div>
          </button>

          <button
            onClick={() => logout()}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
            title="Sign out of demo session"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
};

import React from 'react';
import { 
  LayoutDashboard, 
  Network, 
  Key, 
  ShieldCheck, 
  Radio, 
  Activity, 
  FileText, 
  Cloud, 
  Layers,
  Award,
  HelpCircle,
  User,
  Settings,
  GraduationCap
} from 'lucide-react';

export type NavItem = 
  | 'dashboard'
  | 'overview' 
  | 'network' 
  | 'identity' 
  | 'security' 
  | 'hybrid' 
  | 'monitoring' 
  | 'cad' 
  | 'mapping' 
  | 'docs'
  | 'validation';

interface SidebarProps {
  activeTab: NavItem;
  onTabChange: (tab: NavItem) => void;
  onOpenHelp?: () => void;
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
  onOpenCampusPortal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  onOpenHelp, 
  onOpenProfile, 
  onOpenSettings,
  onOpenCampusPortal
}) => {
  const navItems: { id: NavItem; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'overview',
      label: 'Architecture Overview',
      icon: <Layers className="w-4 h-4" />
    },
    {
      id: 'network',
      label: 'Network Architecture',
      icon: <Network className="w-4 h-4" />
    },
    {
      id: 'identity',
      label: 'Identity & Access',
      icon: <Key className="w-4 h-4" />
    },
    {
      id: 'security',
      label: 'Security',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: '15 Controls'
    },
    {
      id: 'hybrid',
      label: 'Hybrid Connectivity',
      icon: <Radio className="w-4 h-4" />
    },
    {
      id: 'monitoring',
      label: 'Monitoring & SIEM',
      icon: <Activity className="w-4 h-4" />
    },
    {
      id: 'cad',
      label: 'CAD Architecture',
      icon: <Layers className="w-4 h-4" />,
      badge: 'ISO A3'
    },
    {
      id: 'mapping',
      label: 'Cloud Service Mapping',
      icon: <Cloud className="w-4 h-4" />
    },
    {
      id: 'docs',
      label: 'Documentation',
      icon: <FileText className="w-4 h-4" />,
      badge: '23 Ch'
    },
    {
      id: 'validation',
      label: 'Validation',
      icon: <Award className="w-4 h-4" />,
      badge: '12/12'
    }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 no-print select-none font-sans transition-colors duration-150">
      
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 font-bold font-mono text-sm shadow-xs">
          CV
        </div>
        <div className="overflow-hidden">
          <h2 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight leading-tight truncate">
            C. V. RAMAN GLOBAL UNIVERSITY
          </h2>
          <p className="text-[11px] text-blue-600 dark:text-blue-400 font-mono mt-0.5 font-medium">
            Cloud Management
          </p>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1.5 font-semibold">
          Navigation
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                isActive
                  ? 'bg-[#EFF6FF] dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 font-semibold shadow-xs border border-blue-100 dark:border-blue-900/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className={isActive ? 'text-[#2563EB] dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                  isActive 
                    ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* University Portal Quick Link */}
        {onOpenCampusPortal && (
          <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={onOpenCampusPortal}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 transition border border-emerald-200 dark:border-emerald-800/40 shadow-xs"
            >
              <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Campus Portal Workspaces</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-950/60 space-y-1 text-xs">
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1 font-semibold">
          Account &amp; System
        </div>

        <button
          onClick={onOpenHelp}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition text-left"
        >
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Help &amp; Support</span>
        </button>

        <button
          onClick={onOpenProfile}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition text-left"
        >
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span>User Profile</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition text-left"
        >
          <Settings className="w-3.5 h-3.5 text-slate-400" />
          <span>Settings</span>
        </button>

        <div className="pt-2 px-3 text-[10px] font-mono text-slate-500 dark:text-slate-400 flex justify-between items-center border-t border-slate-200 dark:border-slate-800/60 mt-1">
          <span>VPC: 10.0.0.0/16</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">DC: 172.16.0.0/16</span>
        </div>
      </div>
    </aside>
  );
};

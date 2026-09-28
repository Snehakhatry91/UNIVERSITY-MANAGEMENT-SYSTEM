import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { 
  Users, 
  GraduationCap, 
  ShieldCheck, 
  Globe, 
  Layers, 
  Cpu, 
  Database, 
  Lock, 
  Server, 
  Key, 
  Activity, 
  Radio, 
  ExternalLink,
  Building2,
  Workflow,
  Shield,
  BookOpen,
  Briefcase,
  FileCheck2,
  Binary
} from 'lucide-react';

// Custom Node for Interactive Architecture Components
export const ArchitectureNode = memo(({ data, selected }: NodeProps) => {
  const {
    label,
    title,
    category,
    status = 'healthy',
    isSimActive = false,
    privateOnly = false,
    details = {}
  } = data as any;

  const getIcon = () => {
    switch (category) {
      case 'user':
        if (label.includes('Student')) return <GraduationCap className="w-5 h-5 text-[#2563EB] dark:text-blue-400" />;
        if (label.includes('Faculty')) return <Users className="w-5 h-5 text-[#8B5CF6] dark:text-indigo-400" />;
        return <ShieldCheck className="w-5 h-5 text-[#F59E0B] dark:text-amber-400" />;
      case 'edge':
        if (label.includes('CDN')) return <Layers className="w-5 h-5 text-[#06B6D4] dark:text-cyan-400" />;
        return <Globe className="w-5 h-5 text-[#2563EB] dark:text-blue-400" />;
      case 'ingress':
        if (label.includes('Security Group')) return <Shield className="w-5 h-5 text-[#2563EB] dark:text-cyan-300" />;
        return <Workflow className="w-5 h-5 text-[#2563EB] dark:text-cyan-400" />;
      case 'application':
        if (label.includes('Security Group')) return <Shield className="w-5 h-5 text-[#10B981] dark:text-blue-300" />;
        if (label.includes('LMS')) return <BookOpen className="w-5 h-5 text-[#2563EB] dark:text-sky-400" />;
        if (label.includes('ERP')) return <Briefcase className="w-5 h-5 text-[#8B5CF6] dark:text-violet-400" />;
        if (label.includes('Library')) return <BookOpen className="w-5 h-5 text-[#10B981] dark:text-emerald-400" />;
        return <Cpu className="w-5 h-5 text-[#10B981] dark:text-sky-400" />;
      case 'database':
        if (label.includes('Security Group')) return <Shield className="w-5 h-5 text-[#8B5CF6] dark:text-amber-300" />;
        return <Database className="w-5 h-5 text-[#8B5CF6] dark:text-purple-400" />;
      case 'hybrid':
        if (label.includes('VPN')) return <Radio className="w-5 h-5 text-[#06B6D4] dark:text-purple-400" />;
        return <Building2 className="w-5 h-5 text-slate-600 dark:text-slate-300" />;
      case 'identity':
        if (label.includes('Workload')) return <Binary className="w-5 h-5 text-[#8B5CF6] dark:text-cyan-400" />;
        if (label.includes('MFA')) return <Lock className="w-5 h-5 text-[#EF4444] dark:text-rose-400" />;
        if (label.includes('RBAC')) return <FileCheck2 className="w-5 h-5 text-[#8B5CF6] dark:text-violet-400" />;
        return <Key className="w-5 h-5 text-[#8B5CF6] dark:text-violet-400" />;
      case 'monitoring':
        return <Activity className="w-5 h-5 text-[#10B981] dark:text-emerald-400" />;
      default:
        return <Server className="w-5 h-5 text-[#2563EB] dark:text-cyan-400" />;
    }
  };

  const getBorderColor = () => {
    if (isSimActive) return 'border-[#2563EB] ring-4 ring-blue-400/40 scale-105 shadow-xl shadow-blue-500/20';
    if (selected) return 'border-[#2563EB] ring-2 ring-blue-400/50 shadow-md shadow-blue-500/10';
    if (privateOnly) return 'border-purple-300 dark:border-amber-500/70 hover:border-purple-400 shadow-xs';
    if (label.includes('Security Group')) return 'border-blue-200 dark:border-cyan-500/50 bg-white dark:bg-slate-900/90';
    return 'border-slate-200 dark:border-slate-700/80 hover:border-slate-400';
  };

  return (
    <div
      className={`relative px-4 py-3 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border text-slate-900 dark:text-slate-100 min-w-[210px] max-w-[270px] transition-all duration-200 cursor-pointer shadow-xs ${getBorderColor()}`}
    >
      <Handle type="target" position={Position.Left} className="!bg-[#2563EB] dark:!bg-cyan-400 !w-2.5 !h-2.5" />
      <Handle type="source" position={Position.Right} className="!bg-[#2563EB] dark:!bg-cyan-400 !w-2.5 !h-2.5" />
      <Handle type="target" position={Position.Top} id="top-target" className="!bg-[#8B5CF6] dark:!bg-purple-400 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} id="bottom-source" className="!bg-[#8B5CF6] dark:!bg-purple-400 !w-2 !h-2" />

      {/* Top Header Badge */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 truncate">
          <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
            {getIcon()}
          </div>
          <span className="text-xs font-semibold tracking-wide text-slate-800 dark:text-slate-200 truncate">
            {label}
          </span>
        </div>
        
        {status === 'healthy' && (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#ECFDF5] border border-emerald-200 text-[#047857] dark:bg-emerald-950/70 dark:border-emerald-500/30 dark:text-emerald-400 shrink-0 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Healthy
          </span>
        )}
      </div>

      {/* Title / Description */}
      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2 mb-2">
        {title}
      </p>

      {/* Private database callout badge */}
      {privateOnly && (
        <div className="mb-2 p-1.5 rounded-lg bg-[#F5F3FF] dark:bg-amber-950/70 border border-purple-200 dark:border-amber-500/50 text-[10px] text-[#6D28D9] dark:text-amber-300 font-mono flex flex-col gap-0.5">
          <div className="flex items-center gap-1 font-bold text-[#6D28D9] dark:text-amber-200">
            <Lock className="w-3.5 h-3.5 text-[#8B5CF6] dark:text-amber-400" />
            <span>PRIVATE DATABASE</span>
          </div>
          <span className="text-[9px] text-[#7C3AED] dark:text-amber-300/90 font-bold">NO DIRECT PUBLIC ACCESS · NO PUBLIC IP</span>
        </div>
      )}

      {/* MFA Privileged callout badge */}
      {label.includes('MFA') && (
        <div className="mb-2 p-1 rounded bg-[#FEE2E2] dark:bg-rose-950/60 border border-red-200 dark:border-rose-500/40 text-[9px] text-[#B91C1C] dark:text-rose-300 font-mono font-semibold">
          Protects Privileged Accounts &amp; Users
        </div>
      )}

      {/* CDN static content list badge */}
      {label.includes('CDN') && (
        <div className="mb-2 p-1 rounded bg-[#CFFAFE] dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-500/40 text-[9px] text-[#0E7490] dark:text-cyan-300 font-mono font-medium">
          Static: Images · Videos · CSS · JS
        </div>
      )}

      {/* IP or Security summary badge */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/60">
        <span className="truncate">{details?.allowedPorts?.[0] || details?.ipRange || 'Port 443 / 8080'}</span>
        <span className="text-[#2563EB] dark:text-cyan-400/80 hover:text-blue-700 flex items-center gap-0.5 shrink-0 font-sans font-medium">
          Inspect <ExternalLink className="w-2.5 h-2.5" />
        </span>
      </div>
    </div>
  );
});

ArchitectureNode.displayName = 'ArchitectureNode';

// Boundary / Subnet Container Box
export const SubnetBoundaryNode = memo(({ data }: NodeProps) => {
  const { title, subtitle, cidr, type = 'private', isVpc = false } = data as any;

  const getStyles = () => {
    if (isVpc) {
      return {
        border: 'border-2 border-dashed border-blue-400/80 dark:border-sky-500/60 bg-blue-50/20 dark:bg-sky-950/10 shadow-xs',
        badge: 'bg-[#EFF6FF] dark:bg-sky-900/70 text-[#1D4ED8] dark:text-sky-300 border-blue-300 dark:border-sky-600/50',
        header: 'text-[#1D4ED8] dark:text-sky-300'
      };
    }
    if (type === 'public') {
      return {
        border: 'border-2 border-blue-300/80 dark:border-cyan-500/50 bg-[#EFF6FF]/30 dark:bg-cyan-950/15',
        badge: 'bg-[#DBEAFE] dark:bg-cyan-950/80 text-[#1D4ED8] dark:text-cyan-300 border-blue-300 dark:border-cyan-500/50 font-bold',
        header: 'text-[#1D4ED8] dark:text-cyan-300'
      };
    }
    if (type === 'database') {
      return {
        border: 'border-2 border-purple-300/80 dark:border-amber-500/60 bg-[#F5F3FF]/30 dark:bg-amber-950/15',
        badge: 'bg-[#EDE9FE] dark:bg-amber-950/80 text-[#6D28D9] dark:text-amber-300 border-purple-300 dark:border-amber-500/60 font-bold',
        header: 'text-[#6D28D9] dark:text-amber-300'
      };
    }
    if (type === 'on-premises') {
      return {
        border: 'border-2 border-slate-300/80 dark:border-purple-500/50 bg-slate-50/40 dark:bg-purple-950/15',
        badge: 'bg-slate-100 dark:bg-purple-950/80 text-slate-700 dark:text-purple-300 border-slate-300 dark:border-purple-500/50 font-bold',
        header: 'text-slate-800 dark:text-purple-300'
      };
    }
    if (type === 'identity') {
      return {
        border: 'border-2 border-purple-300/80 dark:border-violet-500/50 bg-[#F5F3FF]/30 dark:bg-violet-950/15',
        badge: 'bg-[#EDE9FE] dark:bg-violet-950/80 text-[#6D28D9] dark:text-violet-300 border-purple-300 dark:border-violet-500/50 font-bold',
        header: 'text-[#6D28D9] dark:text-violet-300'
      };
    }
    // application
    return {
      border: 'border-2 border-emerald-300/80 dark:border-blue-500/50 bg-[#ECFDF5]/30 dark:bg-blue-950/15',
      badge: 'bg-[#D1FAE5] dark:bg-blue-950/80 text-[#047857] dark:text-blue-300 border-emerald-300 dark:border-blue-500/50 font-bold',
      header: 'text-[#047857] dark:text-blue-300'
    };
  };

  const style = getStyles();

  return (
    <div className={`w-full h-full rounded-2xl p-4 ${style.border} pointer-events-none transition-all`}>
      <div className="flex items-center justify-between gap-3 pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold uppercase tracking-wider font-mono ${style.header}`}>
            {title}
          </span>
          {subtitle && (
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans hidden sm:inline">
              — {subtitle}
            </span>
          )}
        </div>
        {cidr && (
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${style.badge}`}>
            CIDR: {cidr}
          </span>
        )}
      </div>
    </div>
  );
});

SubnetBoundaryNode.displayName = 'SubnetBoundaryNode';

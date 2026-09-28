import React from 'react';
import { ArchitectureComponent } from '../../types/architecture';
import { 
  X, 
  ShieldCheck, 
  Layers, 
  Network, 
  ArrowRightCircle, 
  ArrowLeftCircle, 
  GitBranch, 
  Cloud, 
  Lock, 
  CheckCircle2 
} from 'lucide-react';

interface ComponentDetailsDrawerProps {
  component: ArchitectureComponent | null;
  onClose: () => void;
}

export const ComponentDetailsDrawer: React.FC<ComponentDetailsDrawerProps> = ({
  component,
  onClose
}) => {
  if (!component) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col text-slate-900 dark:text-slate-100 transition-all duration-300 font-sans">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/60 dark:bg-slate-950/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold uppercase px-2 py-0.5 rounded bg-[#EFF6FF] border border-blue-200 text-[#1D4ED8] dark:bg-sky-950 dark:border-sky-500/40 dark:text-sky-400">
              {component.category} tier
            </span>
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {component.subnet} subnet
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{component.name}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{component.title}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Close component details"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content Scrollable */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
        {/* Purpose */}
        <div className="bg-[#F8FAFC] dark:bg-slate-950/40 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800/80">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#2563EB] dark:text-sky-400" />
            Purpose &amp; Architectural Role
          </h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
            {component.purpose}
          </p>
        </div>

        {/* Network Location & Security Boundaries */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-[#F8FAFC] dark:bg-slate-950/40 rounded-xl p-3 border border-slate-200 dark:border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1 mb-1">
              <Network className="w-3 h-3 text-[#2563EB] dark:text-cyan-400" />
              Network Location
            </span>
            <span className="text-xs font-mono text-[#2563EB] dark:text-cyan-300 block truncate">
              {component.networkLocation}
            </span>
          </div>

          <div className="bg-[#F8FAFC] dark:bg-slate-950/40 rounded-xl p-3 border border-slate-200 dark:border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1 mb-1">
              <ShieldCheck className="w-3 h-3 text-[#047857] dark:text-emerald-400" />
              Security Role
            </span>
            <span className="text-xs text-[#047857] dark:text-emerald-300 block line-clamp-2">
              {component.securityRole}
            </span>
          </div>
        </div>

        {/* Inputs & Outputs */}
        <div className="space-y-3">
          <div className="bg-[#F8FAFC] dark:bg-slate-950/40 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800/80">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ArrowRightCircle className="w-3.5 h-3.5 text-[#047857] dark:text-emerald-400" />
              Inputs / Ingress Flow
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {component.inputs.map((inp, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{inp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#F8FAFC] dark:bg-slate-950/40 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800/80">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ArrowLeftCircle className="w-3.5 h-3.5 text-[#2563EB] dark:text-sky-400" />
              Outputs / Egress Flow
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {component.outputs.map((out, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <span>{out}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Dependencies */}
        <div className="bg-[#F8FAFC] dark:bg-slate-950/40 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800/80">
          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-[#B45309] dark:text-amber-400" />
            Upstream &amp; Downstream Dependencies
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {component.dependencies.map((dep, idx) => (
              <span key={idx} className="text-xs px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono">
                {dep}
              </span>
            ))}
          </div>
        </div>

        {/* Reference Cloud Service Mapping */}
        <div className="bg-[#EFF6FF]/60 dark:bg-slate-950/50 rounded-xl p-4 border border-blue-200 dark:border-cyan-500/30">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-[#1D4ED8] dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Cloud className="w-4 h-4 text-[#2563EB] dark:text-cyan-400" />
              Reference Cloud Service Mapping
            </h4>
            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-100 text-[#1D4ED8] border border-blue-300 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-600/40 font-semibold">
              Reference Only
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3">
            Architectural equivalences across major platforms. No cloud accounts or subscriptions required.
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">AWS</span>
              <span className="font-mono text-[#B45309] dark:text-amber-300 font-semibold">{component.cloudMapping.aws}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Azure</span>
              <span className="font-mono text-[#0E7490] dark:text-sky-300 font-semibold">{component.cloudMapping.azure}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Google Cloud</span>
              <span className="font-mono text-[#047857] dark:text-emerald-300 font-semibold">{component.cloudMapping.gcp}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Open Source / Local</span>
              <span className="font-mono text-[#6D28D9] dark:text-purple-300 font-semibold">{component.cloudMapping.openSource}</span>
            </div>
          </div>
        </div>

        {/* Security Considerations */}
        <div className="bg-[#F8FAFC] dark:bg-slate-950/40 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800/80">
          <h4 className="text-xs font-semibold text-[#B45309] dark:text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#F59E0B] dark:text-amber-400" />
            Security Considerations &amp; Hardening
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            {component.securityConsiderations.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#047857] dark:text-amber-400 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer disclaimer */}
      <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center">
        <span className="text-[10px] font-mono text-slate-500">
          Local Architecture Simulation · ₹0 Infrastructure Cost
        </span>
      </div>
    </div>
  );
};

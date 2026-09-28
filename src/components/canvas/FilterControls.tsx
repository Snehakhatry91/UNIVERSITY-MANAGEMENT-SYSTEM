import React from 'react';
import { Filter } from 'lucide-react';

export interface FilterState {
  network: boolean;
  security: boolean;
  identity: boolean;
  monitoring: boolean;
  hybrid: boolean;
  application: boolean;
}

interface FilterControlsProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState) => void;
  onResetFilters: () => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  onFilterChange,
  onResetFilters
}) => {
  return (
    <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-3 shadow-lg text-slate-900 dark:text-slate-100 flex flex-col gap-2.5 max-w-sm font-sans transition-colors duration-200">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          <Filter className="w-3.5 h-3.5 text-[#2563EB] dark:text-sky-400" />
          Layer Filtering
        </div>
        <button
          onClick={onResetFilters}
          className="text-[10px] font-mono text-[#2563EB] dark:text-sky-400 hover:underline font-semibold"
        >
          Reset All
        </button>
      </div>

      {/* Toggle items */}
      <div className="grid grid-cols-2 gap-1.5 text-xs">
        <button
          onClick={() => onFilterChange('network')}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-left transition ${
            filters.network
              ? 'bg-[#EFF6FF] border-blue-300 text-[#1D4ED8] dark:bg-cyan-950/70 dark:border-cyan-500/50 dark:text-cyan-300 font-semibold'
              : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${filters.network ? 'bg-[#2563EB] dark:bg-cyan-400' : 'bg-slate-400'}`} />
          <span className="text-[11px]">Network Layer</span>
        </button>

        <button
          onClick={() => onFilterChange('application')}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-left transition ${
            filters.application
              ? 'bg-[#ECFDF5] border-emerald-300 text-[#047857] dark:bg-blue-950/70 dark:border-blue-500/50 dark:text-blue-300 font-semibold'
              : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${filters.application ? 'bg-[#10B981] dark:bg-blue-400' : 'bg-slate-400'}`} />
          <span className="text-[11px]">Application Flow</span>
        </button>

        <button
          onClick={() => onFilterChange('security')}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-left transition ${
            filters.security
              ? 'bg-[#FEF3C7] border-amber-300 text-[#B45309] dark:bg-amber-950/70 dark:border-amber-500/50 dark:text-amber-300 font-semibold'
              : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${filters.security ? 'bg-[#F59E0B] dark:bg-amber-400' : 'bg-slate-400'}`} />
          <span className="text-[11px]">Security Layer</span>
        </button>

        <button
          onClick={() => onFilterChange('identity')}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-left transition ${
            filters.identity
              ? 'bg-[#F5F3FF] border-purple-300 text-[#6D28D9] dark:bg-violet-950/70 dark:border-violet-500/50 dark:text-violet-300 font-semibold'
              : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${filters.identity ? 'bg-[#8B5CF6] dark:bg-violet-400' : 'bg-slate-400'}`} />
          <span className="text-[11px]">Identity Layer</span>
        </button>

        <button
          onClick={() => onFilterChange('hybrid')}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-left transition ${
            filters.hybrid
              ? 'bg-[#CFFAFE] border-cyan-300 text-[#0E7490] dark:bg-purple-950/70 dark:border-purple-500/50 dark:text-purple-300 font-semibold'
              : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${filters.hybrid ? 'bg-[#06B6D4] dark:bg-purple-400' : 'bg-slate-400'}`} />
          <span className="text-[11px]">Hybrid Connectivity</span>
        </button>

        <button
          onClick={() => onFilterChange('monitoring')}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-left transition ${
            filters.monitoring
              ? 'bg-[#ECFDF5] border-emerald-300 text-[#047857] dark:bg-emerald-950/70 dark:border-emerald-500/50 dark:text-emerald-300 font-semibold'
              : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${filters.monitoring ? 'bg-[#10B981] dark:bg-emerald-400' : 'bg-slate-400'}`} />
          <span className="text-[11px]">Monitoring Layer</span>
        </button>
      </div>

      {/* Visual Architectural Legend */}
      <div className="mt-1 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] space-y-1">
        <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
          Visual Legend:
        </span>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-slate-600 dark:text-slate-300 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-[#2563EB] dark:bg-cyan-400 inline-block" />
            <span>Solid: App / Request</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 border-b border-dashed border-emerald-500 inline-block" />
            <span>Dashed: Monitoring</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-1 bg-[#8B5CF6] rounded inline-block" />
            <span>Thick: VPN Tunnel</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 border-b border-dotted border-purple-500 inline-block" />
            <span>Dotted: Identity / SSO</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs border border-purple-400 bg-purple-100 dark:bg-purple-950/40 inline-block" />
            <span>Private Subnet</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs border border-blue-400 bg-blue-100 dark:bg-blue-950/40 inline-block" />
            <span>VPC Boundary</span>
          </div>
        </div>
      </div>
    </div>
  );
};

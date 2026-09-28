import React from 'react';
import { ShieldAlert, Lock, AlertTriangle, X } from 'lucide-react';
import { RbacEvaluationResult } from '../../types/auth';

interface RbacDenialModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: RbacEvaluationResult | null;
  actionAttempted?: string;
}

export const RbacDenialModal: React.FC<RbacDenialModalProps> = ({
  isOpen,
  onClose,
  result,
  actionAttempted
}) => {
  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-rose-500/40 rounded-2xl shadow-2xl shadow-rose-950/50 overflow-hidden text-slate-100">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-rose-950/90 via-red-900/60 to-slate-900 px-6 py-4 border-b border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  HTTP 403 FORBIDDEN
                </span>
                <span className="text-xs text-rose-400 font-mono">Zero Trust Policy</span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                Access Denied: RBAC Enforcement
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/40 text-rose-200 text-xs leading-relaxed flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-300">Policy Evaluation Rejection</p>
              <p className="mt-0.5 text-slate-300">{result.reason}</p>
            </div>
          </div>

          {/* Detailed Security Context Grid */}
          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-2.5 text-xs font-mono">
            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Action Attempted:</span>
              <span className="text-amber-400 font-bold">{actionAttempted || 'Protected Operation'}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Principal Role:</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-cyan-500/20 font-bold">
                {result.userRole}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Required Entitlement:</span>
              <span className="text-rose-400 font-semibold">{result.requiredPermission || 'System Permission'}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Authorization Layer:</span>
              <span className="text-slate-300">API Gateway / RBAC Middleware</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">CloudTrail Audit ID:</span>
              <span className="text-emerald-400">arn:aws:cloudtrail:deny-{Date.now().toString(36)}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60 text-[11px] text-slate-400 flex items-center gap-2">
            <Lock className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              This security boundary is enforced strictly at the API layer. Frontend menu hiding is not relied upon for security.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ShieldAlert, ArrowLeft, KeyRound, Lock, Info } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';

interface AccessDeniedViewProps {
  attemptedPath?: string;
  requiredRoles?: UserRole[];
  requiredPermission?: string;
  onOpenMatrix?: () => void;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  attemptedPath,
  requiredRoles = ['ADMINISTRATOR'],
  requiredPermission,
  onOpenMatrix
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const currentPath = attemptedPath || location.pathname;

  const handleReturnHome = () => {
    if (!currentUser) {
      navigate('/login', { replace: true });
      return;
    }
    if (currentUser.role === 'STUDENT') {
      navigate('/portal/student', { replace: true });
    } else if (currentUser.role === 'FACULTY') {
      navigate('/portal/faculty', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-full flex-1 flex items-center justify-center p-6 bg-[#F5F9FF] dark:bg-slate-950 font-sans transition-colors duration-150">
      <div className="max-w-xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6 relative overflow-hidden">
        
        {/* Top Decorative Alert Bar */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 shadow-xs">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800/60 uppercase">
                HTTP 403 Forbidden
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">RBAC Policy Denial</span>
            </div>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Access Denied: Least-Privilege Enforcement
            </h1>
          </div>
        </div>

        {/* Detailed Explanation Context Card */}
        <div className="space-y-3 text-xs">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Your authenticated session does not possess the authorization required to access this endpoint or view engineering blueprints.
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5 font-mono text-[11px]">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400">Attempted Resource:</span>
              <span className="font-bold text-slate-900 dark:text-white px-2 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">
                {currentPath}
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400">Current Authenticated Identity:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {currentUser?.fullName} ({currentUser?.username})
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400">Active Role:</span>
              <span className="font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
                {currentUser?.role}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">Required Role(s):</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">
                {requiredRoles.join(' or ')}
              </span>
            </div>

            {requiredPermission && (
              <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Missing Entitlement:</span>
                <span className="font-mono text-rose-500">{requiredPermission}</span>
              </div>
            )}
          </div>

          {/* Educational Security Note */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-slate-800 dark:text-slate-200">Demonstration Security Policy:</strong> This client-side guard visually demonstrates the Cloud IAM least-privilege boundary (Case Study Requirement 8 &amp; Security Control SEC-05). In a real production architecture, requests are strictly verified server-side by AWS API Gateway and microservice token introspectors.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={handleReturnHome}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs transition shadow-xs active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to My Workspace</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onOpenMatrix && (
              <button
                onClick={onOpenMatrix}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs border border-slate-200 dark:border-slate-700 transition"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>View Permission Matrix</span>
              </button>
            )}

            <button
              onClick={() => logout()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs border border-slate-200 dark:border-slate-700 transition"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Switch Identity / Logout</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

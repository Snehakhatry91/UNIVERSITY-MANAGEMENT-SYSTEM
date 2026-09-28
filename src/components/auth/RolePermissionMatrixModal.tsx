import React, { useState } from 'react';
import { X, KeyRound, Check, X as DenyIcon, ShieldAlert, Sparkles, Filter, Lock } from 'lucide-react';
import { UserRole } from '../../types/auth';
import { SYSTEM_PERMISSIONS, ROLE_PERMISSION_MAPPINGS } from '../../data/rbacData';
import { evaluateRbacPolicy } from '../../api/middleware';

interface RolePermissionMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RolePermissionMatrixModal: React.FC<RolePermissionMatrixModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedModule, setSelectedModule] = useState<string>('All');
  const [testRole, setTestRole] = useState<UserRole>('STUDENT');
  const [testPermission, setTestPermission] = useState<string>('cad:view');
  const [evalResult, setEvalResult] = useState<{ allowed: boolean; reason: string } | null>(null);

  if (!isOpen) return null;

  const modules = ['All', ...Array.from(new Set(SYSTEM_PERMISSIONS.map(p => p.module)))];

  const filteredPermissions = SYSTEM_PERMISSIONS.filter(p => 
    selectedModule === 'All' || p.module === selectedModule
  );

  const handleTestEvaluation = () => {
    const username = testRole === 'STUDENT' ? '2023cse042' : testRole === 'FACULTY' ? 'prof.mukherjee' : testRole === 'ADMINISTRATOR' ? 'admin.registrar' : 'workload.agent';
    const result = evaluateRbacPolicy(testRole, username, testPermission);
    setEvalResult({ allowed: result.allowed, reason: result.reason });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-5 text-slate-900 dark:text-slate-100 font-sans max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-blue-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Institutional Role &amp; Permission Matrix
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Shared RBAC Policy Engine (Case Study Requirement 8 &amp; Security Control SEC-05)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Evaluation Sandbox */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 shrink-0 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Interactive RBAC Policy Evaluator
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              Deterministic Cloud Policy Engine
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-4 space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase">IAM Principal Role:</label>
              <select
                value={testRole}
                onChange={e => setTestRole(e.target.value as UserRole)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="STUDENT">STUDENT (Student Services)</option>
                <option value="FACULTY">FACULTY (Academics &amp; Grading)</option>
                <option value="ADMINISTRATOR">ADMINISTRATOR (SysAdmin &amp; CAD)</option>
                <option value="WORKLOAD">WORKLOAD (Machine Identity)</option>
              </select>
            </div>

            <div className="sm:col-span-5 space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase">Permission Action:</label>
              <select
                value={testPermission}
                onChange={e => setTestPermission(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-blue-500"
              >
                {SYSTEM_PERMISSIONS.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.id} ({p.module})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3 sm:pt-4">
              <button
                type="button"
                onClick={handleTestEvaluation}
                className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs"
              >
                Evaluate Policy
              </button>
            </div>
          </div>

          {evalResult && (
            <div className={`p-3 rounded-xl border flex items-start gap-2.5 animate-in fade-in duration-150 ${
              evalResult.allowed
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/40 text-rose-800 dark:text-rose-300'
            }`}>
              {evalResult.allowed ? (
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5 font-mono text-[11px]">
                <div className="font-bold">
                  DECISION: {evalResult.allowed ? 'GRANT (HTTP 200 / Access Allowed)' : 'DENY (HTTP 403 / Access Denied)'}
                </div>
                <div className="text-[10px] opacity-90 leading-tight">{evalResult.reason}</div>
              </div>
            </div>
          )}
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          {modules.map(mod => (
            <button
              key={mod}
              onClick={() => setSelectedModule(mod)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedModule === mod
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {mod}
            </button>
          ))}
        </div>

        {/* Shared Permission Matrix Table */}
        <div className="flex-1 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-950/80 sticky top-0 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
              <tr>
                <th className="py-2.5 px-3">Permission ID</th>
                <th className="py-2.5 px-3">Module</th>
                <th className="py-2.5 px-3 text-center">STUDENT</th>
                <th className="py-2.5 px-3 text-center">FACULTY</th>
                <th className="py-2.5 px-3 text-center">ADMIN</th>
                <th className="py-2.5 px-3 text-center">WORKLOAD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredPermissions.map(p => {
                const studentAllowed = ROLE_PERMISSION_MAPPINGS.STUDENT.includes(p.id);
                const facultyAllowed = ROLE_PERMISSION_MAPPINGS.FACULTY.includes(p.id);
                const adminAllowed = ROLE_PERMISSION_MAPPINGS.ADMINISTRATOR.includes(p.id);
                const workloadAllowed = ROLE_PERMISSION_MAPPINGS.WORKLOAD.includes(p.id);

                return (
                  <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="py-2 px-3">
                      <span className="font-semibold text-slate-900 dark:text-white">{p.id}</span>
                      <p className="text-[10px] text-slate-400 font-sans mt-0.5">{p.description}</p>
                    </td>
                    <td className="py-2 px-3 text-slate-500 whitespace-nowrap">{p.module}</td>
                    
                    <td className="py-2 px-3 text-center">
                      {studentAllowed ? (
                        <span className="inline-flex p-1 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="inline-flex p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-400">
                          <DenyIcon className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </td>

                    <td className="py-2 px-3 text-center">
                      {facultyAllowed ? (
                        <span className="inline-flex p-1 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="inline-flex p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-400">
                          <DenyIcon className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </td>

                    <td className="py-2 px-3 text-center">
                      {adminAllowed ? (
                        <span className="inline-flex p-1 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="inline-flex p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-400">
                          <DenyIcon className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </td>

                    <td className="py-2 px-3 text-center">
                      {workloadAllowed ? (
                        <span className="inline-flex p-1 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="inline-flex p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-400">
                          <DenyIcon className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 shrink-0 text-xs">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>Notice: Direct database queries (<code className="text-rose-500">db:direct_query</code>) are DENIED to all human roles.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-white transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

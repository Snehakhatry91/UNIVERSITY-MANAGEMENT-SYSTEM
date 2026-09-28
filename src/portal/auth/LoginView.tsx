import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  KeyRound, 
  CheckCircle2, 
  GraduationCap, 
  ArrowRight, 
  AlertCircle,
  Laptop,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_USERS } from '../../data/seedData';

interface LoginViewProps {
  onSuccess?: () => void;
  onOpenArchitecture?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccess, onOpenArchitecture }) => {
  const { login, verifyMfa, isMfaPending, loginError } = useAuth();
  
  const [username, setUsername] = useState('2023cse042');
  const [password, setPassword] = useState('student123');
  const [mfaCode, setMfaCode] = useState('');
  const [isFederating, setIsFederating] = useState(false);
  const [authStep, setAuthStep] = useState<'IDLE' | 'SAML_ASSERTION' | 'IAM_BROKER' | 'MFA_CHECK' | 'SSO_ISSUED'>('IDLE');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFederating(true);
    setAuthStep('SAML_ASSERTION');

    setTimeout(async () => {
      setAuthStep('IAM_BROKER');
      
      setTimeout(async () => {
        const ok = await login(username, password);
        setIsFederating(false);
        if (ok) {
          const matchedUser = INITIAL_USERS.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
          if (matchedUser?.isMfaEnabled || matchedUser?.role === 'ADMINISTRATOR') {
            setAuthStep('MFA_CHECK');
          } else {
            setAuthStep('SSO_ISSUED');
            if (onSuccess) onSuccess();
          }
        } else {
          setAuthStep('IDLE');
        }
      }, 500);
    }, 600);
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = verifyMfa(mfaCode);
    if (ok) {
      setAuthStep('SSO_ISSUED');
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 400);
    }
  };

  const selectDemoUser = (userKey: 'student' | 'faculty' | 'admin') => {
    if (userKey === 'student') {
      setUsername('2023cse042');
      setPassword('student123');
    } else if (userKey === 'faculty') {
      setUsername('prof.mukherjee');
      setPassword('faculty123');
    } else {
      setUsername('admin.registrar');
      setPassword('admin123');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F9FF] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between overflow-y-auto font-sans transition-colors duration-200">
      {/* Top Banner */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-wide">
              C. V. RAMAN GLOBAL UNIVERSITY
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Bhubaneswar, Odisha · Secure Hybrid Cloud Identity Gateway
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onOpenArchitecture && (
            <button
              onClick={onOpenArchitecture}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EFF6FF] hover:bg-blue-100 border border-blue-200 text-[#1D4ED8] dark:bg-sky-500/10 dark:hover:bg-sky-500/20 dark:border-sky-500/30 dark:text-sky-400 text-xs font-semibold transition"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Explore Cloud CAD Architecture</span>
            </button>
          )}
          <span className="hidden sm:inline-flex text-[10px] font-mono px-2 py-0.5 rounded bg-[#ECFDF5] text-[#047857] border border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-500/30 font-medium">
            SAML 2.0 / OIDC Active
          </span>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Educational Identity Flow Demonstration */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EFF6FF] border border-blue-200 text-[#1D4ED8] dark:bg-cyan-950/80 dark:border-cyan-500/30 dark:text-cyan-300 text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Zero-Trust Educational Identity Layer
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Unified Campus Single Sign-On &amp; Federation Gateway
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Demonstrates end-to-end cloud federation: campus on-premises Active Directory assertion passes to AWS IAM Identity Center, enforces multi-factor authentication, and issues cryptographically bounded role tokens.
              </p>
            </div>

            {/* Architecture Flow Step Indicator */}
            <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Identity Pipeline Sequence</span>
                <span className="text-[#2563EB] dark:text-cyan-400 text-[10px] font-bold">SIMULATED IAM WORKFLOW</span>
              </h4>

              <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-mono">
                <div className={`p-2 rounded-lg border transition ${
                  authStep === 'SAML_ASSERTION' ? 'bg-[#EFF6FF] border-blue-400 text-[#1D4ED8] font-bold animate-pulse' : 'bg-[#F8FAFC] dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                }`}>
                  1. Auth
                </div>
                <div className={`p-2 rounded-lg border transition ${
                  authStep === 'SAML_ASSERTION' || authStep === 'IAM_BROKER' ? 'bg-[#EFF6FF] border-blue-400 text-[#1D4ED8] font-bold' : 'bg-[#F8FAFC] dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                }`}>
                  2. Federation
                </div>
                <div className={`p-2 rounded-lg border transition ${
                  authStep === 'MFA_CHECK' ? 'bg-[#FEF3C7] border-amber-400 text-[#B45309] font-bold animate-pulse' : 'bg-[#F8FAFC] dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                }`}>
                  3. MFA (TOTP)
                </div>
                <div className={`p-2 rounded-lg border transition ${
                  authStep === 'SSO_ISSUED' ? 'bg-[#ECFDF5] border-emerald-400 text-[#047857] font-bold' : 'bg-[#F8FAFC] dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                }`}>
                  4. SSO Session
                </div>
                <div className={`p-2 rounded-lg border transition ${
                  authStep === 'SSO_ISSUED' ? 'bg-[#EFF6FF] border-blue-400 text-[#1D4ED8] font-bold' : 'bg-[#F8FAFC] dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                }`}>
                  5. RBAC Scope
                </div>
              </div>

              <div className="p-3 bg-[#F8FAFC] dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#2563EB] dark:text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-800 dark:text-slate-200">Security Rule Enforced:</strong> Selecting a role or user does <span className="text-[#EF4444] font-semibold">NOT</span> confer privileges. Role entitlements are resolved strictly by the backend directory policy engine.
                </span>
              </div>
            </div>

            {/* Quick-Select Demo Identities */}
            <div className="space-y-2.5">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-semibold">
                Quick-Select Educational Test Identities:
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => selectDemoUser('student')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between shadow-xs ${
                    username === '2023cse042'
                      ? 'bg-[#EFF6FF] border-[#2563EB]'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[#2563EB]">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-xs font-bold">Student</span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-800 dark:text-slate-300 font-mono font-medium">2023cse042</div>
                  <div className="text-[10px] text-slate-500 truncate">Rohan Sharma</div>
                </button>

                <button
                  type="button"
                  onClick={() => selectDemoUser('faculty')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between shadow-xs ${
                    username === 'prof.mukherjee'
                      ? 'bg-[#FEF3C7] border-amber-500'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[#B45309]">
                    <Laptop className="w-4 h-4" />
                    <span className="text-xs font-bold">Faculty</span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-800 dark:text-slate-300 font-mono font-medium">prof.mukherjee</div>
                  <div className="text-[10px] text-slate-500 truncate">Dr. A. Mukherjee</div>
                </button>

                <button
                  type="button"
                  onClick={() => selectDemoUser('admin')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between shadow-xs ${
                    username === 'admin.registrar'
                      ? 'bg-[#F5F3FF] border-purple-500'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[#6D28D9]">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs font-bold">Administrator</span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-800 dark:text-slate-300 font-mono font-medium">admin.registrar</div>
                  <div className="text-[10px] text-slate-500 truncate">Prof. S. K. Mohapatra</div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Login / MFA Form */}
          <div className="lg:col-span-6">
            <div className="bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
              {!isMfaPending ? (
                /* Primary Authentication Form */
                <form onSubmit={handleLoginSubmit} className="space-y-4 relative">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      Campus Portal Authentication
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Sign in using your CVGU University Identity
                    </p>
                  </div>

                  {loginError && (
                    <div className="p-3 rounded-xl bg-[#FEE2E2] border border-red-200 text-[#B91C1C] text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      CVGU Username / Roll Number / Staff ID
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      required
                      placeholder="e.g. 2023cse042"
                      className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#2563EB] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 font-mono focus:outline-none transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      placeholder="••••••••••••"
                      className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#2563EB] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 font-mono focus:outline-none transition"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                      <span>Identity Federation Provider:</span>
                      <span className="font-mono text-[#2563EB] dark:text-cyan-400 font-semibold">cvgu.ad.bhubaneswar</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>MFA Requirement:</span>
                      <span className="text-[#B45309] dark:text-amber-400 font-mono font-semibold">Enforced for Faculty/Admin</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isFederating}
                    className="w-full py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-xs active:scale-98 transition flex items-center justify-center gap-2"
                  >
                    {isFederating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Federating SAML Assertion...</span>
                      </>
                    ) : (
                      <>
                        <span>Authenticate via SAML 2.0</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Second Factor TOTP Challenge Form */
                <form onSubmit={handleMfaSubmit} className="space-y-4 relative">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#FEF3C7] border border-amber-300 text-[#B45309]">
                      <KeyRound className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                        Two-Factor Authentication (MFA)
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Second factor challenge for elevated role: <span className="font-mono text-[#B45309] dark:text-amber-400 font-semibold">{username}</span>
                      </p>
                    </div>
                  </div>

                  {loginError && (
                    <div className="p-3 rounded-xl bg-[#FEE2E2] border border-red-200 text-[#B91C1C] text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <div className="p-4 bg-[#F8FAFC] dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <label className="text-xs font-mono text-slate-700 dark:text-slate-300 block font-medium">
                      Enter 6-digit TOTP verification code:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={mfaCode}
                        onChange={e => setMfaCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="123456"
                        className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-center text-lg font-mono tracking-widest text-[#2563EB] dark:text-cyan-400 focus:outline-none focus:border-[#2563EB]"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setMfaCode('123456')}
                        className="px-3 py-2 rounded-lg bg-[#FEF3C7] hover:bg-amber-200 text-[#B45309] border border-amber-300 text-xs font-mono font-bold"
                      >
                        Demo Code: 123456
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Demonstrates RFC 6238 time-based HMAC algorithm synchronized with AWS IAM.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify MFA &amp; Issue SSO Session</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 px-6 py-3 text-center text-xs text-slate-500 font-mono">
        C. V. RAMAN GLOBAL UNIVERSITY · Secure Hybrid Cloud Architecture Demonstration · ₹0 Cost Local Educational System
      </footer>
    </div>
  );
};

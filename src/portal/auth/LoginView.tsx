import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  CheckCircle2, 
  GraduationCap, 
  ArrowRight, 
  AlertCircle,
  Laptop,
  Layers,
  Sparkles,
  Sun,
  Moon,
  Info
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { INITIAL_USERS } from '../../data/seedData';

interface LoginViewProps {
  onSuccess?: () => void;
  onOpenArchitecture?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccess, onOpenArchitecture }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { login, verifyMfa, cancelMfa, isMfaPending, loginError, isAuthenticated, currentUser } = useAuth();
  
  const [username, setUsername] = useState('2023cse042');
  const [password, setPassword] = useState('student123');
  const [mfaCode, setMfaCode] = useState('');
  const [isFederating, setIsFederating] = useState(false);
  const [authStep, setAuthStep] = useState<'IDLE' | 'SAML_ASSERTION' | 'IAM_BROKER' | 'MFA_CHECK' | 'SSO_ISSUED'>('IDLE');

  // Determine redirect target
  const getDestinationForRole = (role?: string) => {
    const fromPath = (location.state as any)?.from;
    if (fromPath && typeof fromPath === 'string' && fromPath !== '/login') {
      // Check if user is allowed to return to /cad (only ADMIN)
      if (fromPath === '/cad' && role !== 'ADMINISTRATOR') {
        return role === 'STUDENT' ? '/portal/student' : '/portal/faculty';
      }
      return fromPath;
    }
    if (role === 'STUDENT') return '/portal/student';
    if (role === 'FACULTY') return '/portal/faculty';
    return '/dashboard';
  };

  // If already logged in, redirect to appropriate workspace
  useEffect(() => {
    if (isAuthenticated && currentUser && !isMfaPending) {
      const dest = getDestinationForRole(currentUser.role);
      navigate(dest, { replace: true });
    }
  }, [isAuthenticated, currentUser, isMfaPending, navigate]);

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
          if (matchedUser?.isMfaEnabled || matchedUser?.role === 'ADMINISTRATOR' || matchedUser?.role === 'FACULTY') {
            setAuthStep('MFA_CHECK');
          } else {
            setAuthStep('SSO_ISSUED');
            if (onSuccess) onSuccess();
            navigate(getDestinationForRole('STUDENT'), { replace: true });
          }
        } else {
          setAuthStep('IDLE');
        }
      }, 400);
    }, 450);
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = verifyMfa(mfaCode);
    if (ok) {
      setAuthStep('SSO_ISSUED');
      setTimeout(() => {
        if (onSuccess) onSuccess();
        const matchedUser = INITIAL_USERS.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
        navigate(getDestinationForRole(matchedUser?.role), { replace: true });
      }, 300);
    }
  };

  const selectDemoUser = (userKey: 'student' | 'faculty' | 'admin') => {
    cancelMfa();
    setAuthStep('IDLE');
    setMfaCode('');
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
          <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-xs font-bold font-mono">
            CV
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-wide">
              C. V. RAMAN GLOBAL UNIVERSITY
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Bhubaneswar, Odisha · Educational Cloud Management System (CVGU-UMS)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-xs font-medium hidden sm:inline">Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-medium hidden sm:inline">Light</span>
              </>
            )}
          </button>

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
            Educational Identity Simulator
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
                Zero-Trust Educational Identity Layer (DEMO ONLY)
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Unified Campus Single Sign-On &amp; Federation Gateway
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Demonstrates end-to-end simulated cloud federation: campus on-premises Active Directory assertion passes to AWS IAM Identity Center simulation, enforces multi-factor authentication, and issues role-bounded session tokens.
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
                  <strong className="text-slate-800 dark:text-slate-200">Educational Simulation Note:</strong> This is a frontend demo session. Selecting a role configures client-side demo state only. In production cloud environments, all authorization must be verified by backend policy engines.
                </span>
              </div>
            </div>

            {/* Quick-Select Demo Identities */}
            <div className="space-y-2.5">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-semibold">
                Quick-Select Educational Test Identities (DEMO ONLY):
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => selectDemoUser('student')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between shadow-xs ${
                    username === '2023cse042'
                      ? 'bg-[#EFF6FF] dark:bg-blue-950/50 border-[#2563EB] ring-2 ring-blue-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[#2563EB] dark:text-blue-400">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-xs font-bold">Student</span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-800 dark:text-slate-300 font-mono font-medium">2023cse042</div>
                  <div className="text-[10px] text-slate-500 truncate">Rohan Sharma</div>
                  <span className="mt-1 text-[9px] font-mono text-emerald-600 dark:text-emerald-400">Direct Login (No MFA)</span>
                </button>

                <button
                  type="button"
                  onClick={() => selectDemoUser('faculty')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between shadow-xs ${
                    username === 'prof.mukherjee'
                      ? 'bg-[#FEF3C7] dark:bg-amber-950/50 border-amber-500 ring-2 ring-amber-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[#B45309] dark:text-amber-400">
                    <Laptop className="w-4 h-4" />
                    <span className="text-xs font-bold">Faculty</span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-800 dark:text-slate-300 font-mono font-medium">prof.mukherjee</div>
                  <div className="text-[10px] text-slate-500 truncate">Dr. A. Mukherjee</div>
                  <span className="mt-1 text-[9px] font-mono text-amber-600 dark:text-amber-400">MFA Enforced (123456)</span>
                </button>

                <button
                  type="button"
                  onClick={() => selectDemoUser('admin')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between shadow-xs ${
                    username === 'admin.registrar'
                      ? 'bg-[#F5F3FF] dark:bg-purple-950/50 border-purple-500 ring-2 ring-purple-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[#6D28D9] dark:text-purple-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs font-bold">Administrator</span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-800 dark:text-slate-300 font-mono font-medium">admin.registrar</div>
                  <div className="text-[10px] text-slate-500 truncate">Prof. S. K. Mohapatra</div>
                  <span className="mt-1 text-[9px] font-mono text-purple-600 dark:text-purple-400">MFA Enforced (123456)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Login / MFA Form */}
          <div className="lg:col-span-6">
            <div className="bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
              
              {/* Demo Notice Banner */}
              <div className="mb-4 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <Info className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                <span>DEMO ONLY — Educational local simulation. No real credentials or AWS billing required.</span>
              </div>

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
                    <div className="p-3 rounded-xl bg-[#FEE2E2] dark:bg-rose-950/50 border border-red-200 dark:border-rose-900 text-[#B91C1C] dark:text-rose-300 text-xs flex items-start gap-2">
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
                      Password (Demo: any value or default)
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
                      <span className="font-mono text-[#2563EB] dark:text-cyan-400 font-semibold">cvgu.ad.bhubaneswar (Simulated)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>MFA Requirement:</span>
                      <span className="text-[#B45309] dark:text-amber-400 font-mono font-semibold">Enforced for Faculty/Admin</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isFederating}
                    className="w-full py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-xs active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isFederating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Federating SAML Assertion...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In (Demo Session)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Second Factor TOTP Challenge Form */
                <form onSubmit={handleMfaSubmit} className="space-y-4 relative">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#FEF3C7] dark:bg-amber-950 border border-amber-300 dark:border-amber-800 text-[#B45309] dark:text-amber-400">
                      <KeyRound className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                        Two-Factor Authentication (Simulated MFA)
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Second factor challenge for role: <span className="font-mono text-[#B45309] dark:text-amber-400 font-semibold">{username}</span>
                      </p>
                    </div>
                  </div>

                  {loginError && (
                    <div className="p-3 rounded-xl bg-[#FEE2E2] dark:bg-rose-950/50 border border-red-200 dark:border-rose-900 text-[#B91C1C] dark:text-rose-300 text-xs flex items-start gap-2">
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
                        className="px-3 py-2 rounded-lg bg-[#FEF3C7] dark:bg-amber-950/80 hover:bg-amber-200 dark:hover:bg-amber-900 text-[#B45309] dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-xs font-mono font-bold"
                      >
                        Demo: 123456
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Educational simulation: models RFC 6238 time-based TOTP challenge for privileged accounts.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={cancelMfa}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify MFA &amp; Enter Dashboard</span>
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
        C. V. RAMAN GLOBAL UNIVERSITY · Educational Hybrid Cloud Architecture Demonstration · ₹0 Cost Local Frontend Simulation
      </footer>
    </div>
  );
};

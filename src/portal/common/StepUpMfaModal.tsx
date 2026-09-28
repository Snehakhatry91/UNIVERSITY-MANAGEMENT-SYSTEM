import React, { useState } from 'react';
import { KeyRound, ShieldAlert, CheckCircle2, X } from 'lucide-react';

interface StepUpMfaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (totpCode: string) => void;
  actionTitle: string;
}

export const StepUpMfaModal: React.FC<StepUpMfaModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  actionTitle
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length !== 6 || code === '000000') {
      setError('Invalid 6-digit TOTP code. Try demo code: 123456');
      return;
    }
    setError(null);
    onSuccess(code);
    setCode('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl shadow-amber-950/40 overflow-hidden text-slate-100">
        <div className="bg-gradient-to-r from-amber-950/90 via-amber-900/60 to-slate-900 px-6 py-4 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                STEP-UP AUTHENTICATION
              </span>
              <h3 className="text-sm font-bold text-white tracking-tight mt-0.5">
                Elevated Privileges Required
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            The operation <span className="text-amber-400 font-semibold font-mono">[{actionTitle}]</span> is classified as high-impact and requires an active time-based second factor (RFC 6238 TOTP).
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <label className="text-[11px] font-mono text-slate-400 block">
              Enter 6-Digit Authenticator Code (or click Demo Token):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={e => {
                  setCode(e.target.value.replace(/\D/g, ''));
                  setError(null);
                }}
                placeholder="123456"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-center text-lg font-mono tracking-widest text-cyan-400 focus:outline-none focus:border-amber-500"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setCode('123456')}
                className="px-3 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold transition"
              >
                Use Demo (123456)
              </button>
            </div>

            {error && (
              <p className="text-rose-400 text-xs flex items-center gap-1.5 mt-1 font-mono">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                {error}
              </p>
            )}
          </div>

          <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/50 text-[11px] text-slate-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Demonstrates step-up authorization without re-prompting for full credentials.</span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-amber-500/20"
            >
              Confirm Step-Up MFA
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

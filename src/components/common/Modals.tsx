import React from 'react';
import { 
  X, 
  HelpCircle, 
  Mail, 
  Phone, 
  User, 
  ShieldCheck, 
  Settings, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpSupportModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-5 text-slate-900 dark:text-slate-100 font-sans">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#EFF6FF] dark:bg-cyan-950 border border-blue-200 dark:border-cyan-500/40 text-[#2563EB] dark:text-cyan-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Help &amp; Technical Support</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">C. V. Raman Global University · Cloud Management Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs leading-relaxed">
          <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-slate-200">Central IT Operations Helpdesk</span>
            <p className="text-slate-600 dark:text-slate-400">For issues with campus VPN connectivity, Active Directory federation tokens, or cloud workload provisioning.</p>
            <div className="pt-2 flex flex-col gap-1 text-[11px] font-mono text-[#2563EB] dark:text-cyan-400">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> it-cloudops@cvrgu.ac.in
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Internal Ext: 4820 / +91 (0674) 6636555
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-slate-200">System Documentation &amp; Architecture Standards</span>
            <p className="text-slate-600 dark:text-slate-400">Detailed CAD drawings, 23 architectural chapters, and all 12 case study compliance requirements are available inside the Documentation and Validation tabs.</p>
          </div>

          <div className="p-3 rounded-xl bg-[#ECFDF5] dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 text-[#047857] dark:text-emerald-300 text-[11px] flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#047857] dark:text-emerald-400" /> All 12 Case Study Requirements Satisfied
            </span>
            <span className="font-mono text-[10px] font-bold">100% Compliant</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
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

export const UserProfileModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-5 text-slate-900 dark:text-slate-100 font-sans">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#F5F3FF] dark:bg-indigo-950 border border-purple-200 dark:border-indigo-500/40 text-[#8B5CF6] dark:text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Administrator Profile</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Institutional Identity &amp; RBAC Entitlements</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] dark:bg-slate-800 border border-blue-200 dark:border-slate-700 flex items-center justify-center font-bold font-mono text-[#2563EB] dark:text-cyan-400 text-lg">
              SM
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Prof. S. K. Mohapatra</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Chief Cloud Architect &amp; Systems Administrator</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded bg-[#FEF3C7] text-[#B45309] font-mono text-[10px] font-bold border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-600/40">
                ROLE: ADMINISTRATOR (ALL PRIVILEGES)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Institution</span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">C. V. Raman Global University</p>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Identity Provider</span>
              <p className="text-xs font-semibold text-[#2563EB] dark:text-cyan-400 truncate">Campus Active Directory / SAML</p>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase">MFA Status</span>
              <p className="text-xs font-semibold text-[#047857] dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> FIDO2 Hardware Key
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Console Session</span>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Active (14m elapsed)
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Active Permissions</span>
            <div className="flex flex-wrap gap-1 pt-1 font-mono text-[10px]">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">vpc:*</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">ec2:*</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">rds:*</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">iam:*</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">cloudwatch:*</span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
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

export const SettingsModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-5 text-slate-900 dark:text-slate-100 font-sans">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#2563EB] dark:text-cyan-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">System Preferences &amp; Config</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">University Cloud Management Console Settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-white">Cloud Region Target</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EFF6FF] text-[#1D4ED8] border border-blue-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800/40 font-semibold">ap-south-1 (Mumbai)</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-normal">
              Primary multi-AZ deployment for minimum latency to students across India. DR standby in ap-south-2 (Hyderabad).
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-white">Execution Mode</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ECFDF5] text-[#047857] border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800/40 font-semibold">₹0 Local Simulation</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-normal">
              Simulated locally without cloud billing or active cloud credentials. Safe for classroom demonstration and technical evaluation.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-white">CAD Architecture Resolution</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">ISO A3 Landscape</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-normal">
              Pre-configured for high-resolution 300 DPI blueprint export suitable for engineering reports and thesis appendices.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-xs font-semibold text-white transition shadow-xs"
          >
            Save &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};

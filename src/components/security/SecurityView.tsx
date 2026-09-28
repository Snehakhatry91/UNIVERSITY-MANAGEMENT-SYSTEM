import React, { useState } from 'react';
import { SECURITY_CONTROLS } from '../../data/securityData';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2,
  Lock,
  Radio,
  FileText,
  Key,
  Database,
  Network
} from 'lucide-react';

export const SecurityView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Exact 8 categories requested in specification:
  // Network security, Identity security, Database security, Access control, MFA, Logging, Monitoring, Hybrid security
  const domainCategories = [
    { id: 'All', label: 'All Controls', count: 15 },
    { id: 'Network Security', label: 'Network Security', count: 2, icon: <Network className="w-3.5 h-3.5" /> },
    { id: 'Identity Security', label: 'Identity Security', count: 3, icon: <Key className="w-3.5 h-3.5" /> },
    { id: 'Database Security', label: 'Database Security', count: 2, icon: <Database className="w-3.5 h-3.5" /> },
    { id: 'Access Control', label: 'Access Control', count: 2, icon: <Lock className="w-3.5 h-3.5" /> },
    { id: 'MFA', label: 'MFA', count: 1, icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'Logging', label: 'Logging', count: 1, icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'Monitoring', label: 'Monitoring', count: 1, icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'Hybrid Security', label: 'Hybrid Security', count: 3, icon: <Radio className="w-3.5 h-3.5" /> }
  ];

  // Map existing data categories to requested domains
  const mapControlToDomain = (cat: string, id: string): string => {
    if (id === 'SEC-06') return 'MFA';
    if (id === 'SEC-12') return 'Logging';
    if (id === 'SEC-13') return 'Monitoring';
    if (id === 'SEC-03' || id === 'SEC-10') return 'Database Security';
    if (id === 'SEC-05' || id === 'SEC-14') return 'Access Control';
    if (id === 'SEC-04' || id === 'SEC-07' || id === 'SEC-08') return 'Identity Security';
    if (id === 'SEC-09' || id === 'SEC-11' || id === 'SEC-15') return 'Hybrid Security';
    if (cat === 'Network Security') return 'Network Security';
    return cat;
  };

  const filteredControls = SECURITY_CONTROLS.filter(ctrl => {
    const domain = mapControlToDomain(ctrl.category, ctrl.id);
    const matchCat = selectedCategory === 'All' || domain === selectedCategory || ctrl.category === selectedCategory;
    const matchSearch = 
      ctrl.title.toLowerCase().includes(search.toLowerCase()) ||
      ctrl.implementation.toLowerCase().includes(search.toLowerCase()) ||
      ctrl.principle.toLowerCase().includes(search.toLowerCase()) ||
      ctrl.id.toLowerCase().includes(search.toLowerCase()) ||
      ctrl.referenceStandard.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex-1 bg-[#F5F9FF] dark:bg-slate-950 p-6 md:p-8 overflow-y-auto text-slate-900 dark:text-slate-100 font-sans transition-colors duration-150">
      <div className="max-w-7xl mx-auto space-y-7">
        
        {/* Top Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1.5 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>C. V. Raman Global University · Security &amp; Compliance Center</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Enterprise Cloud Security Controls &amp; Defense-in-Depth
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            15 foundational architectural controls spanning network boundary defense, multi-tier isolation, cryptographic integrity, zero-standing-privilege IAM, and tamper-evident audit streams.
          </p>
        </div>

        {/* Dual Compliance Architecture Model Notice */}
        <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-xs flex items-start gap-3">
          <div className="space-y-1">
            <span className="font-bold text-slate-900 dark:text-white">
              Dual Framework Implementation:
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>12 mandatory case-study requirements + 15 supporting security controls.</strong> The counts remain independent: this view indexes the 15 defensive security controls (SEC-01 to SEC-15), while the Validation view indexes the 12 case study specifications (REQ-01 to REQ-12).
            </p>
          </div>
        </div>

        {/* 4 Security Posture Metric Cards with Pastel Accents */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
              <span className="font-medium">Active Controls</span>
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">15 / 15</div>
              <div className="text-[11px] text-[#059669] dark:text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> 100% Policy Enforced
              </div>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Zero Gaps Identified</span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
              <span className="font-medium">Transit Encryption</span>
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono">TLS 1.3</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">Perfect Forward Secrecy</div>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">HSTS Preload Enabled</span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
              <span className="font-medium">Rest Encryption</span>
              <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono">AES-256</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">Customer-Managed KMS</div>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Annual Automated Key Rotation</span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
              <span className="font-medium">Database Exposure</span>
              <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">ZERO IP</div>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">No Public Route Table</div>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Isolated Subnet (10.0.3.0/24)</span>
          </div>
        </div>

        {/* 8 Required Security Categories Overview Strip */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono uppercase tracking-wider">
              Categorized Control Domains (8 Disciplines)
            </h2>
            <span className="text-[11px] font-mono text-[#059669] dark:text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> All Verified Active
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {[
              { label: 'Network Security', count: 'SEC-01, 02' },
              { label: 'Identity Security', count: 'SEC-04, 07, 08' },
              { label: 'Database Security', count: 'SEC-03, 10' },
              { label: 'Access Control', count: 'SEC-05, 14' },
              { label: 'MFA', count: 'SEC-06' },
              { label: 'Logging', count: 'SEC-12' },
              { label: 'Monitoring', count: 'SEC-13' },
              { label: 'Hybrid Security', count: 'SEC-09, 11, 15' },
            ].map(cat => (
              <div 
                key={cat.label}
                onClick={() => setSelectedCategory(cat.label)}
                className={`p-2.5 rounded-lg border text-center transition cursor-pointer ${
                  selectedCategory === cat.label 
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-300 shadow-xs font-semibold' 
                    : 'bg-slate-50/70 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900'
                }`}
              >
                <div className="text-[11px] font-bold truncate leading-tight">{cat.label}</div>
                <div className="text-[9px] font-mono text-slate-500 dark:text-slate-400 mt-1">{cat.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search 15 controls by keyword, standard, or principle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 font-sans"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
            {domainCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-medium shrink-0 transition flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-[#2563EB] text-white font-bold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.label}
                <span className={`text-[9px] font-mono px-1 rounded ${
                  selectedCategory === cat.id ? 'bg-blue-700 text-white' : 'bg-white dark:bg-slate-900 text-slate-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 15 Controls Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredControls.map((ctrl) => {
            const domain = mapControlToDomain(ctrl.category, ctrl.id);
            return (
              <div
                key={ctrl.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between hover:border-blue-400 dark:hover:border-slate-700 transition space-y-4 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {ctrl.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        {domain}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        ctrl.severity === 'Critical'
                          ? 'bg-[#FEE2E2] text-[#B91C1C] border border-red-200'
                          : 'bg-[#FEF3C7] text-[#B45309] border border-amber-200'
                      }`}>
                        {ctrl.severity}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 leading-snug">{ctrl.title}</h3>
                  <div className="text-[11px] text-blue-600 dark:text-blue-400 font-mono mb-2 font-medium">
                    Principle: {ctrl.principle}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {ctrl.implementation}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#047857] dark:text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Enforced
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">{ctrl.referenceStandard}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

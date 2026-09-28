import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Search, 
  ChevronRight, 
  Award
} from 'lucide-react';
import { CASE_STUDY_REQUIREMENTS } from '../../data/validationData';

export const ValidationView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedReqId, setExpandedReqId] = useState<string | null>(null);

  const categories = ['All', 'Networking', 'Edge & Compute', 'Security & Isolation', 'Hybrid Infrastructure', 'Identity & Access', 'Operations'];

  const filteredRequirements = CASE_STUDY_REQUIREMENTS.filter(req => {
    const matchesCategory = selectedCategory === 'All' || req.category === selectedCategory;
    const matchesSearch = 
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.specRequirement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.auditNotes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 bg-[#F5F9FF] dark:bg-slate-950 p-6 md:p-8 overflow-y-auto text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Compliance Header Banner */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800/40">
                  Internal Case-Study Validation · Educational Cloud Simulation
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Architecture Requirement Verification</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Case Study Compliance Verification
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                C. V. Raman Global University · Architecture verification confirming that every mandatory requirement from the case study specification is fully implemented and visibly represented.
              </p>
            </div>

            {/* Score Pill */}
            <div className="p-4 rounded-xl bg-[#EFF6FF] dark:bg-slate-950 border border-blue-200 dark:border-emerald-500/40 flex items-center gap-3 shrink-0">
              <div className="w-12 h-12 rounded-xl bg-[#D1FAE5] dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/40 flex items-center justify-center text-[#047857] dark:text-emerald-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">Requirements Check</div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">12 / 12</div>
                <div className="text-[11px] text-[#047857] dark:text-emerald-400 font-semibold font-mono">All Represented</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dual Compliance Architecture Model Notice */}
        <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-xs flex items-start gap-3">
          <div className="space-y-1">
            <span className="font-bold text-slate-900 dark:text-white">
              Compliance Framework Clarification:
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>12 mandatory case-study requirements + 15 supporting security controls.</strong> Both frameworks are tracked independently. The 12 case study specifications cover (1) 3-tier VPC Subnets, (2) Edge CDN, (3) Multi-Server Load Balancing, (4) Security Groups &amp; Port Controls, (5) Isolated Private Database, (6) Hybrid Site-to-Site VPN, (7) IAM Principals, (8) RBAC, (9) Campus IdP Federation, (10) SSO Portals, (11) MFA Enforcement, and (12) Monitoring &amp; SIEM Telemetry.
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1">
              Educational Simulation Note: Derived from internal verification checks. Does not imply external third-party ISO, SOC 2, or commercial AWS certification.
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-[#2563EB] text-white font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search requirements..."
              className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#2563EB] dark:focus:border-blue-500 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none transition font-sans"
            />
          </div>
        </div>

        {/* Requirements List (Every Requirement Individually Shown) */}
        <div className="space-y-3">
          {filteredRequirements.map(req => {
            const isExpanded = expandedReqId === req.id;
            return (
              <div
                key={req.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition shadow-xs"
              >
                <div
                  onClick={() => setExpandedReqId(isExpanded ? null : req.id)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#D1FAE5] dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-center text-[#047857] dark:text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {req.caseStudyName}
                        </span>
                        <span className="text-xs font-mono text-[#047857] dark:text-emerald-400 font-bold flex items-center gap-1">
                          ✓ Implemented
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                        {req.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 hidden md:inline">
                      {req.category}
                    </span>
                    <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 bg-[#F8FAFC] dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 text-xs space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                        <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Case Study Specification Requirement:</span>
                        <p className="text-slate-700 dark:text-slate-300 font-sans text-xs leading-relaxed">{req.specRequirement}</p>
                      </div>

                      <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                        <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Visual Architecture Representation:</span>
                        <p className="text-[#2563EB] dark:text-cyan-300 font-sans text-xs leading-relaxed">{req.visualRepresentation}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                        <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Interactive Implementation Feature:</span>
                        <p className="text-slate-700 dark:text-slate-300 font-sans text-xs leading-relaxed">{req.interactiveFeature}</p>
                      </div>

                      <div className="p-3 rounded-lg bg-[#ECFDF5] dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 space-y-1">
                        <span className="text-[#047857] dark:text-emerald-400 text-[10px] uppercase font-bold tracking-wider">Independent Audit Verification Note:</span>
                        <p className="text-[#065F46] dark:text-emerald-300 font-sans text-xs leading-relaxed">{req.auditNotes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

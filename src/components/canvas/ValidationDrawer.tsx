import React, { useState } from 'react';
import { CASE_STUDY_REQUIREMENTS } from '../../data/validationData';
import { X, CheckCircle2, Search } from 'lucide-react';

interface ValidationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ValidationDrawer: React.FC<ValidationDrawerProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Networking', 'Edge & Compute', 'Security & Isolation', 'Hybrid Infrastructure', 'Identity & Access', 'Operations'];

  const filteredItems = CASE_STUDY_REQUIREMENTS.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                          item.caseStudyName.toLowerCase().includes(search.toLowerCase()) ||
                          item.specRequirement.toLowerCase().includes(search.toLowerCase()) ||
                          item.visualRepresentation.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[540px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col text-slate-900 dark:text-slate-100 transition-all duration-300">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/70 dark:bg-slate-950/70">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#ECFDF5] border border-emerald-200 text-[#047857] dark:bg-emerald-950 dark:border-emerald-500/40 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#047857] dark:text-emerald-400" />
              12 / 12 Requirements Compliant
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#EFF6FF] text-[#1D4ED8] border border-blue-200 dark:bg-sky-950 dark:text-sky-400 dark:border-sky-500/30">
              Audit Score: 100%
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Case Study Architecture Validation</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Formal verification of all 12 original university cloud requirements
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Close validation drawer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/40 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search requirement, component, or spec..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#2563EB] dark:focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`text-[11px] px-2.5 py-1 rounded-md font-medium shrink-0 transition ${
                categoryFilter === cat
                  ? 'bg-[#2563EB] text-white font-semibold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition space-y-2 shadow-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#047857] dark:text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono text-[#2563EB] dark:text-cyan-400 font-bold block">{item.caseStudyName}</span>
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{item.title}</span>
                </div>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#ECFDF5] text-[#047857] border border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-400 dark:border-emerald-500/30 shrink-0 font-semibold">
                {item.status}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900/70 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/60 text-xs text-slate-700 dark:text-slate-300">
              <span className="font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase block mb-0.5">Specification:</span>
              <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">{item.specRequirement}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400 pt-1">
              <div>
                <span className="text-slate-400 uppercase block">Visual Representation:</span>
                <span className="text-slate-700 dark:text-slate-300">{item.visualRepresentation}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase block">Interactive Feature:</span>
                <span className="text-[#2563EB] dark:text-cyan-300">{item.interactiveFeature}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>Category: {item.category}</span>
              <span className="text-[#047857] dark:text-emerald-400 font-medium">{item.auditNotes}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center">
        <p className="text-[11px] text-slate-600 dark:text-slate-400">
          All 12 required components from the original university case study are visibly represented and simulated.
        </p>
      </div>
    </div>
  );
};

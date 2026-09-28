import React, { useState } from 'react';
import { DOCUMENTATION_SECTIONS } from '../../data/documentationData';
import { BookOpen, Search, Printer, CheckCircle2, ChevronRight, FileText } from 'lucide-react';

export const DocumentationView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSectionId, setActiveSectionId] = useState<string>(DOCUMENTATION_SECTIONS[0].id);

  const categories = ['All', 'Foundation', 'Architecture', 'Security & Identity', 'Operations', 'Non-Functional', 'Governance'];

  const filteredSections = DOCUMENTATION_SECTIONS.filter(sec => {
    const matchCat = selectedCategory === 'All' || sec.category === selectedCategory;
    const matchSearch = sec.title.toLowerCase().includes(search.toLowerCase()) ||
                        sec.content.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const activeSection = DOCUMENTATION_SECTIONS.find(s => s.id === activeSectionId) || DOCUMENTATION_SECTIONS[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 bg-[#F5F9FF] dark:bg-slate-950 p-4 md:p-8 overflow-y-auto text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-7">
        
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#2563EB] dark:text-blue-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1.5">
              <BookOpen className="w-4 h-4" />
              <span>C. V. Raman Global University · Technical Reference Dossier</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Cloud System Architecture Documentation
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              23 comprehensive engineering chapters covering multi-tier network topologies, Zero-Trust cryptographic controls, high availability failover, and institutional cost modeling.
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition shadow-xs no-print"
          >
            <Printer className="w-4 h-4" />
            Print Full Dossier
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs no-print">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search across all 23 chapters by keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#2563EB] dark:focus:border-blue-500 font-sans"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-medium shrink-0 transition ${
                  selectedCategory === cat
                    ? 'bg-[#2563EB] text-white font-semibold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Documentation Reader Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chapter Table of Contents Sidebar */}
          <div className="lg:col-span-4 space-y-2 max-h-[750px] overflow-y-auto pr-2 no-print">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 font-bold">
                Chapters Table of Contents
              </span>
              <span className="text-[10px] font-mono text-[#2563EB] dark:text-blue-400">
                {filteredSections.length} of {DOCUMENTATION_SECTIONS.length}
              </span>
            </div>

            {filteredSections.map(sec => (
              <button
                key={sec.id}
                onClick={() => setActiveSectionId(sec.id)}
                className={`w-full text-left p-3 rounded-xl border transition shadow-xs ${
                  activeSectionId === sec.id
                    ? 'bg-[#EFF6FF] dark:bg-slate-900 border-[#2563EB] text-[#2563EB] dark:text-blue-400'
                    : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-[#2563EB] dark:text-blue-400 mb-1">
                  <span className="font-semibold">CHAPTER {sec.number < 10 ? `0${sec.number}` : sec.number}</span>
                  <span className="text-slate-500">{sec.category}</span>
                </div>
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-200 line-clamp-1">{sec.title}</h3>
              </button>
            ))}
          </div>

          {/* Main Chapter Content Reader */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6 shadow-xs">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-[#2563EB] dark:text-blue-400">
                <span className="flex items-center gap-1.5 font-semibold">
                  <FileText className="w-3.5 h-3.5" />
                  CHAPTER {activeSection.number < 10 ? `0${activeSection.number}` : activeSection.number} OF 23
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {activeSection.category}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                {activeSection.title}
              </h2>

              {/* Architectural Card Strip */}
              <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-600 dark:text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 text-[#047857] dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Specification Status: Enforced
                </span>
                <span>Institution: C. V. Raman Global University</span>
                <span>Audit Ref: NIST 800-207</span>
              </div>
            </div>

            {/* Chapter Body Content */}
            <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line space-y-4 font-sans">
              {activeSection.content}
            </div>

            {/* Bottom Chapter Navigation Bar */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-5 flex items-center justify-between text-xs font-mono no-print">
              <button
                disabled={activeSection.number === 1}
                onClick={() => {
                  const prev = DOCUMENTATION_SECTIONS.find(s => s.number === activeSection.number - 1);
                  if (prev) setActiveSectionId(prev.id);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition"
              >
                ← Previous Chapter
              </button>

              <span className="text-slate-500 hidden sm:inline">
                Document Revision 1.0.0 · Final Release
              </span>

              <button
                disabled={activeSection.number === DOCUMENTATION_SECTIONS.length}
                onClick={() => {
                  const next = DOCUMENTATION_SECTIONS.find(s => s.number === activeSection.number + 1);
                  if (next) setActiveSectionId(next.id);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition flex items-center gap-1"
              >
                <span>Next Chapter</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

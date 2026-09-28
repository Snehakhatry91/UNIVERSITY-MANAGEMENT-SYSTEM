import React, { useState } from 'react';
import { CLOUD_SERVICE_MAPPINGS } from '../../data/cloudMappingData';
import { Cloud, Search, CheckCircle2, Server } from 'lucide-react';

export const CloudMappingView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<'All' | 'AWS' | 'Azure' | 'GCP' | 'OpenSource'>('All');

  // Map each component to its Case Study Requirement
  const getRequirementTag = (component: string): { id: string; name: string } => {
    if (component.includes('CDN')) return { id: 'Req 2', name: 'CDN Edge Locations' };
    if (component.includes('Load Balancer')) return { id: 'Req 3', name: 'Load Balancer' };
    if (component.includes('Compute') || component.includes('Application Tier')) return { id: 'Req 3', name: 'Multi-App Compute' };
    if (component.includes('Relational Database')) return { id: 'Req 5', name: 'Private Database' };
    if (component.includes('Identity & Access Management')) return { id: 'Req 7', name: 'Cloud IAM' };
    if (component.includes('Identity Federation')) return { id: 'Req 9', name: 'University IdP Federation' };
    if (component.includes('Single Sign-On')) return { id: 'Req 10', name: 'Single Sign-On (SSO)' };
    if (component.includes('Multi-Factor Authentication')) return { id: 'Req 11', name: 'Multi-Factor Auth (MFA)' };
    if (component.includes('Virtual Private Cloud') || component.includes('Network Subnets')) return { id: 'Req 1', name: '3-Tier Subnets' };
    if (component.includes('Security Groups')) return { id: 'Req 4', name: 'Security Groups' };
    if (component.includes('VPN') || component.includes('Hybrid')) return { id: 'Req 6', name: 'Hybrid VPN' };
    if (component.includes('Monitoring') || component.includes('Logging')) return { id: 'Req 12', name: 'SIEM & Logging' };
    return { id: 'Req Spec', name: 'Architecture Component' };
  };

  const filteredMappings = CLOUD_SERVICE_MAPPINGS.filter(m => {
    const matchSearch = 
      m.component.toLowerCase().includes(search.toLowerCase()) ||
      m.aws.toLowerCase().includes(search.toLowerCase()) ||
      m.azure.toLowerCase().includes(search.toLowerCase()) ||
      m.gcp.toLowerCase().includes(search.toLowerCase()) ||
      m.openSource.toLowerCase().includes(search.toLowerCase()) ||
      m.purpose.toLowerCase().includes(search.toLowerCase()) ||
      m.notes.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="flex-1 bg-[#F5F9FF] dark:bg-slate-950 p-4 md:p-8 overflow-y-auto text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-7">
        
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-2 text-[#2563EB] dark:text-sky-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1.5">
            <Cloud className="w-4 h-4" />
            <span>C. V. Raman Global University · Multi-Cloud Architecture Translation</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Cloud Service Mapping &amp; Implementation Matrix
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Architectural equivalences across AWS, Microsoft Azure, Google Cloud Platform, and Open-Source self-hosted technologies, highlighting differences between local educational execution and production enterprise cloud deployments.
          </p>
        </div>

        {/* Clear Distinction: SIMULATED LOCALLY vs PRODUCTION CLOUD DEPLOYMENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-500/40 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#047857] dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                SIMULATED LOCALLY (CURRENT RUNTIME)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ECFDF5] text-[#047857] border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800/40 font-semibold">
                ACTIVE · ₹0 EXPENSE
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Executes completely in your local browser with client-side state, mock networking packets, interactive RBAC switches, and synthetic CloudWatch/CloudTrail telemetry streams. Zero external cloud billing or API keys required.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-blue-300 dark:border-sky-500/40 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#1D4ED8] dark:text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Server className="w-4 h-4" />
                PRODUCTION CLOUD DEPLOYMENT (TARGET ARCHITECTURE)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EFF6FF] text-[#1D4ED8] border border-blue-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800/40 font-semibold">
                ENTERPRISE SPEC
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              The target deployment model for production institutional rollout utilizing Amazon Web Services (AWS ap-south-1 Mumbai), Azure (Central India), or GCP (asia-south1) with native managed services, hardware VPN appliances, and HSM-backed KMS.
            </p>
          </div>
        </div>

        {/* Search & Provider Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search component, service, or concept (e.g. ALB, RDS, CloudFront, Keycloak)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#2563EB] dark:focus:border-sky-500 font-sans"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {(['All', 'AWS', 'Azure', 'GCP', 'OpenSource'] as const).map(p => (
              <button
                key={p}
                onClick={() => setSelectedProvider(p)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  selectedProvider === p
                    ? 'bg-[#2563EB] text-white font-semibold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {p === 'All' ? 'All Providers' : p === 'OpenSource' ? 'Open Source' : p}
              </button>
            ))}
          </div>
        </div>

        {/* Professional Mapping Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 font-mono text-[11px]">
                  <th className="p-3.5">Requirement</th>
                  <th className="p-3.5">Architecture Component</th>
                  <th className="p-3.5">Cloud Service Concept</th>
                  <th className="p-3.5">Purpose</th>
                  <th className="p-3.5 whitespace-nowrap">Implementation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredMappings.map((m, idx) => {
                  const req = getRequirementTag(m.component);
                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      {/* 1. Requirement */}
                      <td className="p-3.5 align-top whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded bg-blue-50 dark:bg-slate-800 text-[#1D4ED8] dark:text-cyan-300 font-mono text-[10px] font-bold border border-blue-200 dark:border-slate-700">
                          {req.id}
                        </span>
                        <span className="block text-[11px] text-slate-600 dark:text-slate-400 mt-1 font-medium">
                          {req.name}
                        </span>
                      </td>

                      {/* 2. Architecture Component */}
                      <td className="p-3.5 align-top">
                        <div className="font-bold text-slate-900 dark:text-white text-xs">{m.component}</div>
                        <span className="inline-block text-[10px] font-mono text-slate-500 mt-0.5">
                          Tier: {m.layer}
                        </span>
                      </td>

                      {/* 3. Cloud Service Concept */}
                      <td className="p-3.5 align-top space-y-1.5 min-w-[280px]">
                        {(selectedProvider === 'All' || selectedProvider === 'AWS') && (
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <span className="px-1.5 py-0.5 rounded bg-[#FEF3C7] text-[#B45309] font-mono text-[9px] font-bold border border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800/40 shrink-0">AWS</span>
                            <span className="text-slate-800 dark:text-slate-200 font-mono">{m.aws}</span>
                          </div>
                        )}
                        {(selectedProvider === 'All' || selectedProvider === 'Azure') && (
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <span className="px-1.5 py-0.5 rounded bg-[#CFFAFE] text-[#0E7490] font-mono text-[9px] font-bold border border-cyan-200 dark:bg-sky-950/80 dark:text-sky-300 dark:border-sky-800/40 shrink-0">Azure</span>
                            <span className="text-slate-800 dark:text-slate-200 font-mono">{m.azure}</span>
                          </div>
                        )}
                        {(selectedProvider === 'All' || selectedProvider === 'GCP') && (
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <span className="px-1.5 py-0.5 rounded bg-[#D1FAE5] text-[#047857] font-mono text-[9px] font-bold border border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800/40 shrink-0">GCP</span>
                            <span className="text-slate-800 dark:text-slate-200 font-mono">{m.gcp}</span>
                          </div>
                        )}
                        {(selectedProvider === 'All' || selectedProvider === 'OpenSource') && (
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <span className="px-1.5 py-0.5 rounded bg-[#EDE9FE] text-[#6D28D9] font-mono text-[9px] font-bold border border-purple-200 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800/40 shrink-0">FOSS</span>
                            <span className="text-slate-800 dark:text-slate-300 font-mono">{m.openSource}</span>
                          </div>
                        )}
                      </td>

                      {/* 4. Purpose */}
                      <td className="p-3.5 align-top max-w-sm">
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{m.purpose}</p>
                        <p className="text-[11px] text-slate-500 mt-1 italic leading-normal">{m.notes}</p>
                      </td>

                      {/* 5. Implementation Status */}
                      <td className="p-3.5 align-top whitespace-nowrap space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ECFDF5] text-[#047857] border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800/40 font-medium">
                            SIMULATED LOCALLY (₹0 Cost)
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EFF6FF] text-[#1D4ED8] border border-blue-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800/40 font-medium">
                            PRODUCTION READY (AWS)
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

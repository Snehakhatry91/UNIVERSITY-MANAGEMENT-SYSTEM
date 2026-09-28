import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { 
  Printer, 
  Download, 
  Lock, 
  ShieldCheck, 
  Radio, 
  Layers, 
  GraduationCap,
  Users,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const CadArchitectureView: React.FC = () => {
  const { currentUser } = useAuth();
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPng = async () => {
    if (!sheetRef.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(sheetRef.current, { quality: 0.95, backgroundColor: '#070d19' });
      const link = document.createElement('a');
      link.download = 'university-cloud-cad-architecture.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export PNG:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex-1 bg-[#F5F9FF] dark:bg-slate-950 p-4 md:p-6 overflow-y-auto font-sans transition-colors duration-200">
      {/* Action Bar */}
      <div className="max-w-[1450px] mx-auto mb-4 flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 no-print shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#2563EB] dark:text-cyan-400 uppercase tracking-wider mb-0.5">
            <span className="w-2 h-2 rounded-full bg-[#2563EB] dark:bg-cyan-400" />
            <span>C. V. Raman Global University · Architecture Schematics</span>
          </div>
          <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            CAD Architecture Engineering Blueprint (ISO A3/A2 Landscape Format)
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Case study technical architecture blueprint with ISO title block, multi-tier subnet boundaries, hybrid IPSec bridge, and all 12 case study compliance requirements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EFF6FF] dark:bg-slate-950 border border-blue-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400">
            <span>Format:</span>
            <span className="text-[#2563EB] dark:text-cyan-400 font-bold">ISO A3 Landscape</span>
          </div>

          <button
            onClick={handleExportPng}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            {isExporting ? 'Generating Blueprint...' : 'Export High-Res PNG'}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / PDF
          </button>
        </div>
      </div>

      {/* Engineering Blueprint Container */}
      <div className="max-w-[1450px] mx-auto overflow-x-auto pb-8">
        <div 
          ref={sheetRef} 
          className="cad-engineering-sheet min-w-[1360px] p-8 border-2 border-cyan-500/40 rounded-2xl text-slate-200 font-mono shadow-2xl relative bg-slate-950"
        >
          {/* Top Title Banner */}
          <div className="flex justify-between items-start border-b-2 border-cyan-500/50 pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs tracking-widest uppercase mb-1">
                <span className="font-bold">C. V. RAMAN GLOBAL UNIVERSITY</span>
                <span>•</span>
                <span>UNIVERSITY CLOUD MANAGEMENT SYSTEM</span>
                <span>•</span>
                <span>TECHNICAL DESIGN BLUEPRINT</span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-white font-sans">
                SECURE HYBRID CLOUD ARCHITECTURE SCHEMATIC
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Multi-AZ VPC Subnet Tiers · CloudFront Edge CDN · Dual-AZ ALB · Stateless App Tier · Private PostgreSQL · IPSec Hybrid VPN · IAM/RBAC/MFA/SSO Federation · SIEM Logging
              </p>
            </div>

            <div className="text-right text-xs">
              <span className="inline-block px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold mb-1">
                DWG NO: CVRGU-HYBRID-ARCH-2026-01
              </span>
              <div className="text-slate-400 text-[11px]">
                STATUS: <span className="text-emerald-400 font-bold">DESIGN VALIDATED — EDUCATIONAL SIMULATION</span> | SHEET: 01 OF 01
              </div>
            </div>
          </div>

          {/* MAIN BLUEPRINT SCHEMATIC AREA */}
          <div className="grid grid-cols-12 gap-5 my-5">
            {/* ZONE 1: EXTERNAL & PERIMETER (Cols 1-3) */}
            <div className="col-span-3 space-y-3.5">
              {/* Users */}
              <div className="p-3 border border-dashed border-emerald-500/50 rounded-lg bg-emerald-950/10">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-2">
                  [USERS TIER] (HTTPS 443 Ingress)
                </span>
                
                <div className="space-y-1.5 text-xs">
                  <div className="p-2 rounded bg-slate-900 border border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-bold text-white text-[11px]">Students</span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono">LMS / Profile / Library</span>
                  </div>

                  <div className="p-2 rounded bg-slate-900 border border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="font-bold text-white text-[11px]">Faculty</span>
                    </div>
                    <span className="text-[9px] text-amber-300 font-mono">MFA Mandatory</span>
                  </div>

                  <div className="p-2 rounded bg-slate-900 border border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-bold text-white text-[11px]">Administrators</span>
                    </div>
                    <span className="text-[9px] text-rose-300 font-mono">FIDO2 / Hardware MFA</span>
                  </div>
                </div>
              </div>

              {/* Edge CDN */}
              <div className="p-3 border border-cyan-500/50 rounded-lg bg-cyan-950/20">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-cyan-400 uppercase font-bold">
                    [REQ 2: CDN] EDGE LOCATIONS
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">Edge Cache</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-700 space-y-1">
                  <div className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    Content Delivery Network
                  </div>
                  <div className="text-[10px] text-cyan-300 font-bold bg-cyan-950/80 p-1 rounded">
                    Delivers Static Content: Images · Videos · CSS · JavaScript
                  </div>
                  <p className="text-[9px] text-slate-400 leading-tight">
                    Served from edge locations close to students to reduce latency and origin compute load. Dynamic requests proxied to ALB.
                  </p>
                </div>
              </div>

              {/* Central Monitoring Feed Box */}
              <div className="p-3 border border-emerald-500/40 rounded-lg bg-emerald-950/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-emerald-400 uppercase font-bold flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    [REQ 12: MONITORING & LOGGING]
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-700 text-[10px] space-y-1">
                  <div className="font-bold text-emerald-300">Central SIEM & Log Aggregator</div>
                  <div className="text-slate-400 leading-tight">
                    Records <span className="text-white">Network Events</span> & <span className="text-white">Identity Events</span> for:
                  </div>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    <span className="px-1 py-0.5 rounded bg-slate-800 text-cyan-300 text-[9px]">Troubleshooting</span>
                    <span className="px-1 py-0.5 rounded bg-slate-800 text-amber-300 text-[9px]">Auditing</span>
                    <span className="px-1 py-0.5 rounded bg-slate-800 text-rose-300 text-[9px]">Security</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ZONE 2: CLOUD VPC / VNET (Cols 4-8) */}
            <div className="col-span-6 p-4 border-2 border-sky-500/60 rounded-xl bg-sky-950/10 space-y-3">
              <div className="flex justify-between items-center border-b border-sky-500/30 pb-1.5">
                <span className="text-xs font-bold text-sky-400 uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  [REQ 1: NETWORKING] CLOUD VPC / VNET — CIDR: 10.0.0.0/16
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-sky-900 text-sky-200">
                  MULTI-AZ ISOLATED VPC
                </span>
              </div>

              {/* 3 Subnets Grid */}
              <div className="grid grid-cols-3 gap-3">
                {/* 1. PUBLIC SUBNET */}
                <div className="p-2.5 rounded-lg border-2 border-cyan-500/50 bg-cyan-950/20 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-cyan-300">
                      PUBLIC SUBNET
                    </span>
                    <span className="text-[9px] font-mono text-cyan-400">10.0.1.0/24</span>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-700 text-[10px]">
                    <div className="font-bold text-white">Internet Gateway</div>
                    <div className="text-[8px] text-slate-400">0.0.0.0/0 Entry Route</div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900 border border-cyan-500/40 text-[10px]">
                    <div className="font-bold text-cyan-300">[REQ 3] Load Balancer</div>
                    <div className="text-[8px] text-slate-400">Dual-AZ ALB (HTTPS 443)</div>
                    <div className="text-[8px] text-emerald-400 font-bold mt-0.5">Healthz: 15s Poll</div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-700 text-[9px] text-cyan-300">
                    <span className="font-bold block">[REQ 4] Security Group:</span>
                    <span>ALLOW TCP 443 Only</span>
                  </div>
                </div>

                {/* 2. APPLICATION SUBNET */}
                <div className="p-2.5 rounded-lg border-2 border-blue-500/50 bg-blue-950/20 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-blue-300">
                      APPLICATION SUBNET
                    </span>
                    <span className="text-[9px] font-mono text-blue-400">10.0.2.0/24</span>
                  </div>
                  <div className="p-1 rounded bg-slate-900 border border-slate-700 text-[9px] text-blue-300">
                    <span className="font-bold block">[REQ 4] App SG:</span>
                    <span>Port 8080 from ALB Only</span>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-700 text-[10px]">
                    <div className="font-bold text-white">Application Server 1</div>
                    <div className="text-[8px] text-emerald-400">● Healthy (AZ-1)</div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-700 text-[10px]">
                    <div className="font-bold text-white">Application Server 2</div>
                    <div className="text-[8px] text-emerald-400">● Healthy (AZ-2)</div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-700 text-[10px]">
                    <div className="font-bold text-white">Application Server 3</div>
                    <div className="text-[8px] text-emerald-400">● Healthy (AZ-3)</div>
                  </div>
                </div>

                {/* 3. DATABASE SUBNET */}
                <div className="p-2.5 rounded-lg border-2 border-amber-500/60 bg-amber-950/20 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-amber-300">
                      DATABASE SUBNET
                    </span>
                    <span className="text-[9px] font-mono text-amber-400">10.0.3.0/24</span>
                  </div>
                  <div className="p-1 rounded bg-slate-900 border border-slate-700 text-[9px] text-amber-300">
                    <span className="font-bold block">[REQ 4] DB SG:</span>
                    <span>Port 5432 from App Only</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border-2 border-amber-500/70 text-[10px] space-y-1">
                    <div className="font-bold text-amber-300 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      [REQ 5] PRIVATE DATABASE
                    </div>
                    <div className="text-[8px] text-slate-300">University Management DB</div>
                    <div className="text-[8px] text-amber-300 font-bold bg-amber-950/90 p-1 rounded border border-amber-600/40">
                      NO DIRECT PUBLIC ACCESS · NO PUBLIC IP
                    </div>
                  </div>
                  <p className="text-[8px] text-slate-400 leading-tight">
                    Zero route to Internet Gateway. Ingress strictly limited to sg-app-tier.
                  </p>
                </div>
              </div>
            </div>

            {/* ZONE 3: HYBRID & UNIVERSITY DATA CENTER (Cols 9-12) */}
            <div className="col-span-3 space-y-3.5">
              {/* VPN Gateway */}
              <div className="p-3 border-2 border-dashed border-purple-500/70 rounded-lg bg-purple-950/20">
                <span className="text-[10px] text-purple-400 uppercase font-bold block mb-1">
                  [REQ 6: HYBRID NETWORKING]
                </span>
                <div className="p-2 rounded bg-slate-900 border border-purple-500/40 text-xs">
                  <div className="font-bold text-white flex items-center gap-1 text-[11px]">
                    <Radio className="w-3.5 h-3.5 text-purple-400" />
                    VPN / Dedicated Connectivity
                  </div>
                  <div className="text-[9px] text-purple-300 mt-1">
                    Site-to-Site IPSec Dual-Tunnel (AES-256)
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5">
                    Connects Cloud VPC (10.0.0.0/16) ↔ University DC (172.16.0.0/16)
                  </div>
                </div>
              </div>

              {/* On-Premises University DC */}
              <div className="p-3 border-2 border-purple-500/50 rounded-lg bg-purple-950/15 space-y-2">
                <span className="text-[10px] text-purple-300 uppercase font-bold block">
                  UNIVERSITY DATA CENTER (172.16.0.0/16)
                </span>

                <div className="p-2 rounded bg-slate-900 border border-slate-700 text-xs">
                  <div className="font-bold text-purple-300 text-[10px]">[REQ 9] University IdP</div>
                  <div className="text-[9px] text-slate-400">Campus Active Directory / LDAP / SAML IdP</div>
                </div>

                <div className="p-2 rounded bg-slate-900 border border-slate-700 text-xs">
                  <div className="font-bold text-slate-200 text-[10px]">Legacy Student System</div>
                  <div className="text-[9px] text-slate-400">172.16.10.12 · 40-Year Transcripts Archive</div>
                </div>

                <div className="p-2 rounded bg-slate-900 border border-slate-700 text-xs">
                  <div className="font-bold text-slate-200 text-[10px]">Legacy ERP & Finance</div>
                  <div className="text-[9px] text-slate-400">172.16.20.15 · Payroll & Tuition Batches</div>
                </div>
              </div>
            </div>
          </div>

          {/* LOWER SECTION: IDENTITY & ACCESS GOVERNANCE PIPELINE (ALL REQUIREMENTS EXPLICIT!) */}
          <div className="p-3.5 rounded-xl border-2 border-violet-500/50 bg-violet-950/15 my-4">
            <div className="flex justify-between items-center border-b border-violet-500/30 pb-1.5 mb-3">
              <span className="text-xs font-bold text-violet-300 uppercase tracking-wide">
                [IDENTITY & ACCESS FLOW] — DISTINCT REQUIREMENTS ARCHITECTURE
              </span>
              <span className="text-[9px] text-violet-400 font-mono">
                ZERO STANDING TRUST · SAML 2.0 FEDERATION · ROLE-BASED ACCESS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 text-xs">
              {/* 1. Federation */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-violet-500/40 space-y-1">
                <span className="text-[9px] font-bold text-violet-400 uppercase block">[REQ 9] FEDERATION</span>
                <div className="font-bold text-white text-[11px]">Federation Gateway</div>
                <p className="text-[9px] text-slate-400">
                  Cloud trusts University IdP assertions via SAML 2.0 / OIDC.
                </p>
              </div>

              {/* 2. IAM */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-violet-500/40 space-y-1">
                <span className="text-[9px] font-bold text-violet-400 uppercase block">[REQ 7] IAM</span>
                <div className="font-bold text-white text-[11px]">Cloud IAM Engine</div>
                <div className="text-[9px] text-cyan-300 font-mono">
                  Identities: Students, Faculty, Admins & Workloads
                </div>
              </div>

              {/* 3. RBAC */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-violet-500/40 space-y-1">
                <span className="text-[9px] font-bold text-violet-400 uppercase block">[REQ 8] RBAC</span>
                <div className="font-bold text-white text-[11px]">Role-Based Access</div>
                <div className="text-[9px] text-slate-300 space-y-0.5">
                  <div>• Student: Read Courses/LMS</div>
                  <div>• Faculty: Grade/Rosters</div>
                  <div>• Admin: Provision/Audit</div>
                </div>
              </div>

              {/* 4. MFA */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-rose-500/40 space-y-1">
                <span className="text-[9px] font-bold text-rose-400 uppercase block">[REQ 11] MFA</span>
                <div className="font-bold text-white text-[11px]">Multi-Factor Auth</div>
                <div className="text-[9px] text-rose-300 font-bold bg-rose-950/80 p-1 rounded">
                  MFA protects privileged accounts and, where appropriate, other users.
                </div>
              </div>

              {/* 5. SSO */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-violet-500/40 space-y-1">
                <span className="text-[9px] font-bold text-violet-400 uppercase block">[REQ 10] SSO</span>
                <div className="font-bold text-white text-[11px]">Single Sign-On</div>
                <div className="text-[9px] text-violet-300 font-bold">
                  One University Login → Multiple Services
                </div>
              </div>

              {/* 6. Authorized Services */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-sky-500/40 space-y-1">
                <span className="text-[9px] font-bold text-sky-400 uppercase block">AUTHORIZED SERVICES</span>
                <div className="grid grid-cols-2 gap-1 text-[9px] text-slate-300">
                  <span className="p-0.5 bg-slate-800 rounded text-center">LMS</span>
                  <span className="p-0.5 bg-slate-800 rounded text-center">ERP</span>
                  <span className="p-0.5 bg-slate-800 rounded text-center">Library</span>
                  <span className="p-0.5 bg-slate-800 rounded text-center">SMS Portal</span>
                </div>
              </div>
            </div>
          </div>

          {/* LOWER SPECIFICATION TABLE & TITLE BLOCK */}
          <div className="grid grid-cols-12 gap-5 border-t border-slate-800 pt-3 text-xs font-mono">
            {/* Notes & Standards */}
            <div className="col-span-8 space-y-1 text-[10px] text-slate-400">
              <span className="text-white font-bold block uppercase tracking-wide">
                CASE STUDY COMPLIANCE SPECIFICATIONS (ALL 12 REQUIREMENTS REPRESENTED):
              </span>
              <p>1. NETWORKING: 3 clearly visible network zones (Public, Application, Database subnets) in Cloud VPC/VNet (10.0.0.0/16).</p>
              <p>2. EDGE & COMPUTE: CDN delivers static content (Images, Videos, CSS, JS) from edge; Load Balancer distributes to 3 App Servers.</p>
              <p>3. SECURITY & ISOLATION: Security Groups control port communication (443, 8080, 5432); Database has NO direct public access.</p>
              <p>4. HYBRID & IDENTITY: Site-to-Site VPN links to University DC; IdP federates to IAM, RBAC, MFA, and SSO accessing LMS/ERP/Library/SMS.</p>
            </div>

            {/* Standard CAD Title Block */}
            <div className="col-span-4 border border-cyan-500/40 rounded p-2.5 bg-slate-900/90 text-[10px] space-y-0.5">
              <div className="flex justify-between border-b border-slate-800 pb-0.5">
                <span className="text-slate-500 uppercase">INSTITUTION:</span>
                <span className="font-bold text-white truncate">C. V. RAMAN GLOBAL UNIVERSITY</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-0.5">
                <span className="text-slate-500 uppercase">PROJECT:</span>
                <span className="font-bold text-cyan-300">University Cloud Management System</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-0.5">
                <span className="text-slate-500 uppercase">DATE:</span>
                <span className="text-slate-300">{new Date().toISOString().split('T')[0]}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-0.5">
                <span className="text-slate-500 uppercase">REVIEWED BY:</span>
                <span className="font-bold text-white truncate">
                  {currentUser ? `${currentUser.fullName} (${currentUser.role})` : 'Administrator (ADMINISTRATOR)'}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-0.5">
                <span className="text-slate-500 uppercase">COMPLIANCE:</span>
                <span className="text-emerald-400 font-bold">12 / 12 REQUIREMENTS REPRESENTED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 uppercase">STATUS:</span>
                <span className="text-cyan-300 font-bold">INTERNAL REQUIREMENTS REVIEW</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

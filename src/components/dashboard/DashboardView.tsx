import React, { useState } from 'react';
import { 
  Server, 
  Database, 
  ShieldCheck, 
  Radio, 
  Key, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  BookOpen, 
  Library, 
  GraduationCap, 
  CreditCard,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { NavItem } from '../common/Sidebar';

interface DashboardViewProps {
  onNavigate: (tab: NavItem) => void;
  onOpenRequestSim: () => void;
  onOpenPortal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  onNavigate, 
  onOpenRequestSim, 
  onOpenPortal 
}) => {
  const [selectedFlowComponent, setSelectedFlowComponent] = useState<string | null>(null);

  // Dynamic greeting based on current local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const flowNodes = [
    {
      id: 'users',
      title: 'Users / Clients',
      type: 'Students, Faculty & Staff',
      protocol: 'HTTPS / TLS 1.3',
      location: 'Public Internet / Campus Wi-Fi',
      desc: 'Authenticated browser sessions connecting to cvrgu.edu.in with OAuth2 bearer tokens.'
    },
    {
      id: 'cdn',
      title: 'CloudFront CDN & WAF',
      type: 'Edge Cache & Layer 7 Defense',
      protocol: 'TCP 443 / SSL Edge',
      location: 'Edge PoP (Bhubaneswar/Kolkata)',
      desc: 'Caches portal UI and static media; inspects incoming traffic against SQLi and XSS rules.'
    },
    {
      id: 'alb',
      title: 'Load Balancer (ALB)',
      type: 'Ingress Traffic Distributor',
      protocol: 'Port 443 -> Port 8080',
      location: 'Public Subnet (10.0.1.0/24)',
      desc: 'Dual-AZ Application Load Balancer routes traffic to healthy application server instances.'
    },
    {
      id: 'app',
      title: 'Application Servers',
      type: 'Stateless Microservices Fleet',
      protocol: 'Port 8080 (Private)',
      location: 'App Subnet (10.0.2.0/24)',
      desc: 'Auto Scaling group running 3 EC2 instances in private subnets with no public IPv4.'
    },
    {
      id: 'db',
      title: 'Private Database',
      type: 'Amazon RDS PostgreSQL Multi-AZ',
      protocol: 'Port 5432 (Isolated)',
      location: 'Database Subnet (10.0.3.0/24)',
      desc: 'Multi-AZ synchronous replication with zero public IP and automated daily snapshots.'
    }
  ];

  return (
    <div className="flex-1 bg-[#F5F9FF] dark:bg-slate-950 p-6 md:p-8 overflow-y-auto text-slate-900 dark:text-slate-100 font-sans transition-colors duration-150">
      <div className="max-w-7xl mx-auto space-y-7">
        
        {/* Welcome Banner */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#ECFDF5] dark:bg-emerald-950/60 text-[#059669] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                  Production Hybrid Cloud · ap-south-1
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">CVGU-UMS-v2.4</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {getGreeting()}, Administrator
              </h1>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium">
                C. V. Raman Global University · University Cloud Management System
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={onOpenRequestSim}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs transition shadow-sm"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Simulate Request</span>
              </button>
              {onOpenPortal && (
                <button
                  onClick={onOpenPortal}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold text-xs border border-emerald-200 dark:border-emerald-800/40 transition shadow-xs"
                  title="Open live Student, Faculty, or Admin workspace"
                >
                  <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Campus Portal</span>
                </button>
              )}
              <button
                onClick={() => onNavigate('cad')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition"
              >
                <Layers className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>CAD Blueprint</span>
              </button>
            </div>
          </div>
        </div>

        {/* 6 Key Summary Cards with Pastel Accents */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
              System Summary &amp; Compliance Status
            </h2>
            <span className="text-xs text-[#059669] dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" /> Live Status: Healthy
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* Card 1: 12/12 Requirements (Blue Pastel Accent) */}
            <div 
              onClick={() => onNavigate('validation')}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-slate-700 transition cursor-pointer flex flex-col justify-between shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Requirements</span>
                <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="my-2">
                <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">12 / 12</div>
                <div className="text-[11px] text-[#059669] dark:text-emerald-400 font-medium">Case Study Satisfied</div>
              </div>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium flex items-center gap-0.5">
                Audit Verified <ChevronRight className="w-3 h-3" />
              </span>
            </div>

            {/* Card 2: 3 Application Servers (Green Pastel Accent) */}
            <div 
              onClick={() => onNavigate('network')}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-slate-700 transition cursor-pointer flex flex-col justify-between shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Compute Fleet</span>
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition">
                  <Server className="w-4 h-4" />
                </div>
              </div>
              <div className="my-2">
                <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">3 Active</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Auto Scaling Group</div>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">10.0.2.0/24 Subnet →</span>
            </div>

            {/* Card 3: Private Database (Purple Pastel Accent) */}
            <div 
              onClick={() => onNavigate('network')}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-slate-700 transition cursor-pointer flex flex-col justify-between shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Database</span>
                <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition">
                  <Database className="w-4 h-4" />
                </div>
              </div>
              <div className="my-2">
                <div className="text-xl font-bold text-slate-900 dark:text-white font-mono truncate">Private RDS</div>
                <div className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">Zero Public Ingress</div>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">10.0.3.0/24 Subnet →</span>
            </div>

            {/* Card 4: Hybrid Connectivity (Amber Pastel Accent) */}
            <div 
              onClick={() => onNavigate('hybrid')}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-slate-700 transition cursor-pointer flex flex-col justify-between shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Hybrid Link</span>
                <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition">
                  <Radio className="w-4 h-4" />
                </div>
              </div>
              <div className="my-2">
                <div className="text-xl font-bold text-slate-900 dark:text-white font-mono truncate">Active</div>
                <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">IPSec VPN Connected</div>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">172.16.0.0/16 DC →</span>
            </div>

            {/* Card 5: 15 Security Controls (Green Pastel Accent) */}
            <div 
              onClick={() => onNavigate('security')}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-slate-700 transition cursor-pointer flex flex-col justify-between shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Controls</span>
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="my-2">
                <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">15 / 15</div>
                <div className="text-[11px] text-[#059669] dark:text-emerald-400 font-medium">Security Policies</div>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">All Enforced →</span>
            </div>

            {/* Card 6: Identity Federation (Purple Pastel Accent) */}
            <div 
              onClick={() => onNavigate('identity')}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-slate-700 transition cursor-pointer flex flex-col justify-between shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Identity</span>
                <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition">
                  <Key className="w-4 h-4" />
                </div>
              </div>
              <div className="my-2">
                <div className="text-xl font-bold text-slate-900 dark:text-white font-mono truncate">Federated</div>
                <div className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">Campus AD ↔ IAM</div>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">SAML 2.0 / SSO →</span>
            </div>
          </div>
        </div>

        {/* Interactive Architecture Flow Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                Interactive Infrastructure Request Flow
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Click any node to inspect runtime networking protocols, subnet locations, and security boundaries.
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40 self-start sm:self-auto">
              5 Ingress Tiers
            </span>
          </div>

          {/* Flow Stepper Bar with Pastel Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 items-center">
            {flowNodes.map((node, idx) => {
              const isSelected = selectedFlowComponent === node.id;
              
              // Soft pastel styling per tier
              const getPastelColor = () => {
                if (node.id === 'users') return 'bg-blue-50/70 border-blue-200 text-blue-700 dark:bg-blue-950/30 dark:border-blue-800/40 dark:text-blue-300';
                if (node.id === 'cdn') return 'bg-cyan-50/70 border-cyan-200 text-cyan-700 dark:bg-cyan-950/30 dark:border-cyan-800/40 dark:text-cyan-300';
                if (node.id === 'alb') return 'bg-blue-50/70 border-blue-200 text-blue-700 dark:bg-blue-950/30 dark:border-blue-800/40 dark:text-blue-300';
                if (node.id === 'app') return 'bg-emerald-50/70 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-800/40 dark:text-emerald-300';
                return 'bg-purple-50/70 border-purple-200 text-purple-700 dark:bg-purple-950/30 dark:border-purple-800/40 dark:text-purple-300';
              };

              return (
                <div key={node.id} className="flex items-center">
                  <div 
                    onClick={() => setSelectedFlowComponent(node.id === selectedFlowComponent ? null : node.id)}
                    className={`flex-1 p-3.5 rounded-xl border transition cursor-pointer select-none ${
                      isSelected
                        ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-sm ' + getPastelColor()
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1 text-slate-500 dark:text-slate-400">
                      <span>STAGE 0{idx + 1}</span>
                      <span className="font-semibold">{node.protocol.split(' ')[0]}</span>
                    </div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white leading-tight">{node.title}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{node.type}</div>
                  </div>
                  {idx < 4 && (
                    <div className="hidden md:flex items-center px-1 text-slate-300 dark:text-slate-700">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Node Inspector Drawer */}
          {selectedFlowComponent && (
            <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-slate-950 border border-blue-200 dark:border-blue-900/40 space-y-2 animate-in fade-in duration-150">
              {(() => {
                const node = flowNodes.find(n => n.id === selectedFlowComponent);
                if (!node) return null;
                return (
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-blue-200/60 dark:border-slate-800">
                      <span className="text-xs font-bold text-blue-700 dark:text-blue-400 font-mono">
                        Node Inspector: {node.title}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{node.location}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-mono">Component Classification:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{node.type}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-mono">Protocol &amp; Port:</span>
                        <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">{node.protocol}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-mono">Security Function:</span>
                        <span className="text-slate-700 dark:text-slate-300">{node.desc}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* University Services Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#2563EB]" />
                University Authorized Services (Single Sign-On Enabled)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Integrated academic, financial, and administrative applications federated under unified SAML 2.0 credentials.
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
              5 Active Portals
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* LMS */}
            <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 hover:border-blue-400 transition">
              <div className="flex items-center justify-between">
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#D1FAE5] text-[#047857] border border-emerald-200 font-semibold">ONLINE</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Learning Management (LMS)</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">Course materials, assignment submission, online quizzes &amp; grading.</p>
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                SAML 2.0 Auth · S3 Storage
              </div>
            </div>

            {/* ERP */}
            <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 hover:border-blue-400 transition">
              <div className="flex items-center justify-between">
                <Server className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#D1FAE5] text-[#047857] border border-emerald-200 font-semibold">ONLINE</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Enterprise Resource (ERP)</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">Fee payment, payroll processing, budget allocation &amp; audit trails.</p>
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                Hybrid Sync · VPN Tunnel
              </div>
            </div>

            {/* Library */}
            <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 hover:border-blue-400 transition">
              <div className="flex items-center justify-between">
                <Library className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#D1FAE5] text-[#047857] border border-emerald-200 font-semibold">ONLINE</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Central Library</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">Online OPAC search, RFID issue/return &amp; digital IEEE journals.</p>
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                Catalog Cache at Edge
              </div>
            </div>

            {/* Student Services */}
            <div 
              onClick={onOpenPortal}
              className={`p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 ${onOpenPortal ? 'hover:border-blue-500 cursor-pointer' : ''} transition`}
            >
              <div className="flex items-center justify-between">
                <GraduationCap className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#D1FAE5] text-[#047857] border border-emerald-200 font-semibold">ONLINE</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Student Services</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">Bonafide requests, grade transcripts &amp; examination hall tickets.</p>
              <div className="text-[10px] font-mono text-blue-600 dark:text-blue-400 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between font-semibold">
                <span>SQS Queue</span>
                {onOpenPortal && <span>Open Portal →</span>}
              </div>
            </div>

            {/* Authorized Services */}
            <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 hover:border-blue-400 transition">
              <div className="flex items-center justify-between">
                <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#D1FAE5] text-[#047857] border border-emerald-200 font-semibold">ONLINE</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Authorized Services</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">Campus payment gateway (UPI/Netbanking) &amp; research repositories.</p>
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                PCI-DSS Compliant Gateway
              </div>
            </div>
          </div>
        </div>

        {/* Infrastructure Health / Status Cards (6 cards) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
              Infrastructure Component Health (ap-south-1)
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">6 Monitored Tiers</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* CDN Health */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">CloudFront CDN</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/40">99.99% Availability</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Serving static assets with 12ms average edge latency in Eastern India.</p>
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                <span>Cache Hit Ratio: 94.2%</span>
                <span>TLS 1.3 Strict</span>
              </div>
            </div>

            {/* Load Balancer Health */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Application Load Balancer</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/40">Dual-AZ Active</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Distributing HTTP/2 ingress traffic across all 3 application tier nodes.</p>
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                <span>Port 443 Ingress</span>
                <span>Target Health: 3/3 Healthy</span>
              </div>
            </div>

            {/* Application Servers Health */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Application Servers</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/40">3 Instances Running</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Stateless microservices executing in private subnet 10.0.2.0/24.</p>
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                <span>Port 8080 Listener</span>
                <span>Avg CPU: 42%</span>
              </div>
            </div>

            {/* Database Health */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">PostgreSQL Database</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-400 dark:border-purple-800/40">Isolated Private</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Synchronous standby replication in ap-south-1b with zero public route.</p>
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                <span>Port 5432 Internal</span>
                <span>Active Slots: 48/100</span>
              </div>
            </div>

            {/* VPN Health */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">IPSec Hybrid VPN</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/40">BGP Established</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Redundant tunnel bridge linking Cloud VPC with CVGU campus server room.</p>
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                <span>AES-256-GCM</span>
                <span>Tunnel Latency: 14ms</span>
              </div>
            </div>

            {/* Monitoring Health */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Monitoring &amp; SIEM</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/40">Log Stream Ingesting</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Immutable WORM audit logs recording network and identity telemetry.</p>
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                <span>14,892 Events / hr</span>
                <span>Alarms: 1 Info Active</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

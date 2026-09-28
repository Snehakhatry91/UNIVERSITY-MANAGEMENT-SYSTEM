import React, { useState } from 'react';
import { 
  Radio, 
  ArrowRightLeft, 
  CheckCircle2, 
  AlertTriangle,
  Server,
  Database,
  Key,
  ShieldCheck,
  Activity,
  Play,
  Clock
} from 'lucide-react';

export const HybridConnectivityView: React.FC = () => {
  const [isSimulatingSync, setIsSimulatingSync] = useState(false);
  const [syncResult, setSyncResult] = useState<{
    status: 'idle' | 'success';
    latencyMs: number;
    recordId: string;
    studentName: string;
    enrollmentYear: number;
    gpa: string;
    source: string;
  } | null>(null);

  const handleSimulateCrossPremisesQuery = () => {
    setIsSimulatingSync(true);
    setSyncResult(null);

    setTimeout(() => {
      setIsSimulatingSync(false);
      setSyncResult({
        status: 'success',
        latencyMs: 16,
        recordId: 'CVRGU-HIST-2022-8491',
        studentName: 'Rahul Mohapatra (B.Tech CSE)',
        enrollmentYear: 2022,
        gpa: '8.94 / 10.0',
        source: 'Campus On-Premises Oracle 11g Database (172.16.10.12)'
      });
    }, 1200);
  };

  return (
    <div className="flex-1 bg-[#F5F9FF] dark:bg-slate-950 p-6 md:p-8 overflow-y-auto text-slate-900 dark:text-slate-100 font-sans transition-colors duration-150">
      <div className="max-w-7xl mx-auto space-y-7">
        
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1.5">
            <Radio className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>C. V. Raman Global University · Hybrid Cloud Infrastructure</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Hybrid Connectivity &amp; On-Premises Legacy Integration
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Encrypted cross-premises tunnel linking the elastic AWS ap-south-1 VPC with the C. V. Raman Global University campus server room to preserve legacy archives, Active Directory trust, and financial ledgers.
          </p>
        </div>

        {/* Local Educational Simulation Banner */}
        <div className="p-3.5 rounded-xl bg-purple-50/70 dark:bg-slate-900 border border-purple-200 dark:border-purple-800/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-purple-800 dark:text-purple-300 font-mono">
            <AlertTriangle className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <span>LOCAL EDUCATIONAL ARCHITECTURE DEMONSTRATION · ₹0 RUNTIME EXPENSE</span>
          </div>
          <span className="text-[11px] font-mono text-purple-700 dark:text-purple-400 font-medium">
            Simulated BGP Peering &amp; IPSec SA Configuration
          </span>
        </div>

        {/* Simulated Tunnel Telemetry Bar with Pastel Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Tunnel 1 (Primary Simulated)</span>
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            </div>
            <div className="text-xl font-bold text-[#059669] dark:text-emerald-400 font-mono">UP / ACTIVE</div>
            <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
              IP: 3.109.112.45 ↔ 203.129.214.10 (Simulated)
            </p>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono border-t border-slate-100 dark:border-slate-800 pt-1">
              Latency: 14ms (Simulated) · 0.00% Loss
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Tunnel 2 (Standby Simulated)</span>
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            </div>
            <div className="text-xl font-bold text-slate-700 dark:text-slate-200 font-mono">UP / STANDBY</div>
            <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
              IP: 3.109.112.46 ↔ 203.129.214.11 (Simulated)
            </p>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono border-t border-slate-100 dark:border-slate-800 pt-1">
              Automated Failover Armed (Simulated)
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>BGP Peering (Simulated)</span>
              <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-xl font-bold text-purple-700 dark:text-purple-300 font-mono">ESTABLISHED</div>
            <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
              ASN 65000 (Cloud) ↔ 65001 (CVGU)
            </p>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono border-t border-slate-100 dark:border-slate-800 pt-1">
              Prefixes: 10.0.0.0/16 ↔ 172.16.0.0/16
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Cryptographic Suite</span>
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400 font-mono">AES-256-GCM</div>
            <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
              SHA-384 · DH Group 14 (2048-bit)
            </p>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono border-t border-slate-100 dark:border-slate-800 pt-1">
              IKEv2 SA Lifetime: 28,800s (Simulated)
            </div>
          </div>
        </div>

        {/* High-Level 3-Tier Visual Hybrid Flow */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Hybrid Topology: Campus Data Center ↔ IPSec VPN ↔ Cloud VPC
            </h2>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">End-to-End Isolated Tunnel</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
            
            {/* Zone A: C. V. Raman Global University On-Premises Data Center (Cols 1-4) */}
            <div className="lg:col-span-4 p-5 rounded-xl border border-purple-200 dark:border-purple-800/40 bg-purple-50/40 dark:bg-purple-950/15 space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider block">
                    ON-PREMISES DATA CENTER
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">C. V. Raman Global University</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800/40 font-semibold">
                  172.16.0.0/16
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Campus Server Room · Bhubaneswar, Odisha</p>

              <div className="space-y-2 pt-1 text-xs">
                {/* 1. Identity Provider */}
                <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      1. University Identity Provider
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">ACTIVE</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Active Directory Domain Services / Shibboleth SAML 2.0 (IP: 172.16.5.10). Master source for student and faculty credentials.
                  </p>
                </div>

                {/* 2. Legacy Student System */}
                <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      2. Legacy Student System
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 font-semibold">ARCHIVE</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Heritage Oracle RDBMS (IP: 172.16.10.12) storing 25+ years of graduated alumni transcripts and physical degree registers.
                  </p>
                </div>

                {/* 3. ERP / Finance */}
                <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      3. ERP / Finance Master Ledger
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">LEDGER</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Bursar accounting, faculty payroll, and bank reconciliation server (IP: 172.16.20.15).
                  </p>
                </div>
              </div>
            </div>

            {/* Zone B: VPN / Dedicated Connectivity Interconnect (Cols 5-7) */}
            <div className="lg:col-span-3 p-4 rounded-xl border-2 border-dashed border-cyan-300 dark:border-cyan-700/60 bg-cyan-50/40 dark:bg-cyan-950/20 text-center space-y-3">
              <div className="inline-flex p-3 rounded-full bg-cyan-100 dark:bg-cyan-900/50 border border-cyan-200 dark:border-cyan-700/50 text-cyan-700 dark:text-cyan-300">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-cyan-200">Site-to-Site IPSec VPN</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-mono mt-0.5">
                  Dual Encrypted Tunnels
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] font-mono space-y-1 text-left shadow-2xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Cloud Gateway:</span>
                  <span className="text-slate-900 dark:text-white font-semibold">VGW / TGW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Campus Gateway:</span>
                  <span className="text-slate-900 dark:text-white font-semibold">Fortinet CGW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Routing Protocol:</span>
                  <span className="text-[#059669] dark:text-emerald-400 font-semibold">eBGP (4-Byte ASN)</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                No public IP transit · Zero packet exposure
              </div>
            </div>

            {/* Zone C: Cloud VPC/VNet (Cols 8-11) */}
            <div className="lg:col-span-4 p-5 rounded-xl border border-blue-200 dark:border-blue-800/40 bg-blue-50/40 dark:bg-blue-950/15 space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider block">
                    CLOUD VPC / VNET
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">AWS ap-south-1 (Mumbai)</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800/40 font-semibold">
                  10.0.0.0/16
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">High-Availability Multi-AZ Cloud Deployment</p>

              <div className="space-y-2 pt-1 text-xs">
                {/* Virtual Private Gateway */}
                <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">Virtual Private Gateway (VGW)</span>
                    <span className="text-[9px] font-mono text-blue-600 dark:text-blue-400 font-semibold">TERMINUS</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Terminates IPSec tunnel in Cloud VPC and propagates 172.16.0.0/16 routes to subnet route tables.
                  </p>
                </div>

                {/* Application Subnet */}
                <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">Application Tier Subnet (10.0.2.0/24)</span>
                    <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">3 SERVERS</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Microservices query legacy databases on-demand through VGW without exposing database ports publicly.
                  </p>
                </div>

                {/* Private Database Subnet */}
                <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">Database Subnet (10.0.3.0/24)</span>
                    <span className="text-[9px] font-mono text-purple-600 dark:text-purple-400 font-semibold">ISOLATED</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Primary cloud relational database replicating sync delta batches from campus legacy database over private VPN.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Cross-Premises Simulation Test Console */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono uppercase tracking-wider flex items-center gap-2">
                <Play className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Cross-Premises Data Sync Simulation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Simulate Cloud App Server retrieving a historical student archive from campus legacy database over IPSec VPN.
              </p>
            </div>

            <button
              onClick={handleSimulateCrossPremisesQuery}
              disabled={isSimulatingSync}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold transition shadow-sm font-sans"
            >
              <ArrowRightLeft className={`w-3.5 h-3.5 ${isSimulatingSync ? 'animate-spin' : ''}`} />
              {isSimulatingSync ? 'Querying Campus DC...' : 'Execute Legacy Archive Query'}
            </button>
          </div>

          {isSimulatingSync && (
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-slate-950 border border-purple-200 dark:border-purple-800/40 flex items-center gap-3 text-xs font-mono text-purple-700 dark:text-purple-300">
              <Clock className="w-4 h-4 animate-spin text-purple-600 dark:text-purple-400" />
              <span>Transmitting query packet: Cloud App Server (10.0.2.14) → VGW → IPSec Tunnel → Campus CGW → Legacy Oracle DB (172.16.10.12)...</span>
            </div>
          )}

          {syncResult && (
            <div className="p-4 rounded-xl bg-[#ECFDF5] dark:bg-slate-950 border border-emerald-200 dark:border-emerald-800/40 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-[#059669] dark:text-emerald-400">
                <span className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Query Succeeded (Round-Trip Latency: {syncResult.latencyMs}ms)
                </span>
                <span className="text-[10px] text-slate-500">200 OK · Encrypted Transit</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-emerald-100 dark:border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Record Identifier:</span>
                  <span className="text-slate-900 dark:text-white font-bold">{syncResult.recordId}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Student:</span>
                  <span className="text-slate-900 dark:text-white font-bold">{syncResult.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Cumulative GPA:</span>
                  <span className="text-amber-700 dark:text-amber-400 font-bold">{syncResult.gpa}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Data Source:</span>
                  <span className="text-purple-700 dark:text-purple-400 truncate block">{syncResult.source}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 6 Strategic Reasons Why Hybrid Cloud Architecture is the Optimal Strategy */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">
              Strategic Rationale: Why Hybrid Cloud Architecture is Optimal for Universities
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">6 Core Principles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
              <div className="text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Legacy System Retention
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Decades of customized payroll software and alumni records remain operational without requiring costly, high-risk application rewrites.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
              <div className="text-[#059669] dark:text-emerald-400 font-bold text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Gradual De-risked Migration
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Workloads migrate modularly in planned phases over academic semesters rather than an operational &quot;big bang&quot; transition.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
              <div className="text-purple-600 dark:text-purple-400 font-bold text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Secure Private Connectivity
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                AES-256 encrypted IPSec tunnels shield academic transcripts and student financial information from exposure across the public internet.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
              <div className="text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Reduced Operational Risk
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                If internet uplink experiences transient carrier outage, local campus labs retain immediate access to local on-premises hardware.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
              <div className="text-cyan-600 dark:text-cyan-400 font-bold text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Institutional Data Sovereignty
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Guarantees complete compliance with national higher education regulatory guidelines by maintaining authoritative financial master ledgers locally.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
              <div className="text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Cost Optimization
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Fully utilizes capitalized university server hardware while provisioning elastic cloud instances solely for high-traffic registration surges.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

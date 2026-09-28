import React, { useState } from 'react';
import { 
  Activity, 
  Terminal, 
  AlertTriangle, 
  ShieldAlert, 
  Cpu, 
  Bell, 
  Radio, 
  Search, 
  CheckCircle2, 
  Layers
} from 'lucide-react';

export type EventCategory = 
  | 'Network Events' 
  | 'Identity Events' 
  | 'Security Events' 
  | 'Authentication Events' 
  | 'VPN Events' 
  | 'Application Events';

interface LogEntry {
  id: string;
  time: string;
  category: EventCategory;
  source: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SECURITY';
  message: string;
}

interface SimulatedAlert {
  id: string;
  category: EventCategory;
  title: string;
  source: string;
  timestamp: string;
  severity: 'Critical' | 'Warning' | 'Info';
  details: string;
}

export const MonitoringView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');

  const [activeAlerts, setActiveAlerts] = useState<SimulatedAlert[]>([
    {
      id: 'alt-01',
      category: 'Security Events',
      title: 'Edge WAF Block: SQL Injection Attempt Dropped',
      source: 'AWS WAF / CloudFront Edge',
      timestamp: '10:14:02 UTC',
      severity: 'Critical',
      details: 'Request matched SQL injection pattern on /api/v1/students/search?id=1%20OR%201=1. Remote IP rate-limited.'
    },
    {
      id: 'alt-02',
      category: 'Application Events',
      title: 'App Server 2 CPU Threshold Warning (84%)',
      source: 'App Server 2 (AZ-2)',
      timestamp: '10:12:45 UTC',
      severity: 'Warning',
      details: 'Elevated CPU utilization during course registration rush. Auto Scaling Group evaluating scale-out.'
    },
    {
      id: 'alt-03',
      category: 'VPN Events',
      title: 'BGP Keepalive Latency Fluctuated (+8ms)',
      source: 'Site-to-Site IPSec Tunnel 1',
      timestamp: '10:08:14 UTC',
      severity: 'Info',
      details: 'Transient cross-premises ISP jitter resolved automatically. Tunnel 1 remained active with zero packet loss.'
    }
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', time: '10:14:05', category: 'Security Events', source: 'AWS WAF', level: 'SECURITY', message: 'WAF Rule Block: Inbound request matched SQL injection signature on /api/v1/search (DENIED 403)' },
    { id: '2', time: '10:14:02', category: 'Authentication Events', source: 'University IdP', level: 'WARN', message: 'Failed SAML assertion validation: user "registrar_admin" (Incorrect MFA TOTP token)' },
    { id: '3', time: '10:13:58', category: 'Network Events', source: 'ALB', level: 'INFO', message: 'HTTP/2 GET /api/v1/courses/catalog 200 OK - 14ms (Target: App Server 1:8080)' },
    { id: '4', time: '10:13:50', category: 'Application Events', source: 'PostgreSQL RDS', level: 'INFO', message: 'Checkpoint completed: 18MB written in 1.4s (Zero direct public IP exposure)' },
    { id: '5', time: '10:13:42', category: 'Network Events', source: 'VPC Flow Logs', level: 'INFO', message: 'ACCEPT TCP 10.0.2.14:8080 -> 10.0.3.15:5432 (Stateful rule sg-db-tier)' },
    { id: '6', time: '10:13:30', category: 'VPN Events', source: 'Virtual Private Gateway', level: 'INFO', message: 'IPSec SA Re-key successful: Peer 203.129.214.10 (CVGU Campus CGW) SPI: 0x8f4d92a1' },
    { id: '7', time: '10:13:15', category: 'Identity Events', source: 'Cloud IAM', level: 'INFO', message: 'STS AssumeRoleWithSAML: Student session role assumed by "s_482910@university.edu"' },
    { id: '8', time: '10:12:45', category: 'Application Events', source: 'App Server 2', level: 'WARN', message: 'CPU spike on App Server 2: load average 2.45 over 5 minutes (84% utilization)' },
    { id: '9', time: '10:12:10', category: 'Authentication Events', source: 'Campus Shibboleth', level: 'INFO', message: 'Single Sign-On (SSO) ticket issued: valid for LMS, ERP, Library, SMS portals' },
    { id: '10', time: '10:11:18', category: 'Identity Events', source: 'IAM Audit Trail', level: 'INFO', message: 'Principle of Least Privilege check: App Server role verified without IAM modification rights' },
    { id: '11', time: '10:10:45', category: 'VPN Events', source: 'BGP Daemon', level: 'INFO', message: 'BGP Keepalive received from ASN 65001: 2 prefixes advertised, 1 prefix received (172.16.0.0/16)' },
    { id: '12', time: '10:09:30', category: 'Security Events', source: 'VPC GuardDuty', level: 'INFO', message: 'Zero anomalous outbound traffic detected. DB subnet isolated with no internet route.' }
  ]);

  const handleTriggerSimulatedAlert = (type: 'security' | 'cpu' | 'vpn') => {
    const time = new Date().toTimeString().split(' ')[0] + ' UTC';
    if (type === 'security') {
      const newAlert: SimulatedAlert = {
        id: `alt-${Date.now()}`,
        category: 'Security Events',
        title: 'Simulated Brute-Force Login Attempt',
        source: 'University IdP / IAM Gateway',
        timestamp: time,
        severity: 'Critical',
        details: 'Simulated credential stuffing pattern detected from IP 198.51.100.88. WAF automated rate limit triggered.'
      };
      setActiveAlerts(prev => [newAlert, ...prev]);
      setLogs(prev => [
        { id: String(Date.now()), time: time.split(' ')[0], category: 'Security Events', source: 'AWS WAF', level: 'SECURITY', message: 'SECURITY ALERT: Automated IP ban dispatched for 198.51.100.88 (Failed authentication attempts)' },
        { id: String(Date.now() + 1), time: time.split(' ')[0], category: 'Authentication Events', source: 'Campus IdP', level: 'WARN', message: 'Multiple failed password entries for account: faculty_registrar@cvrgu.ac.in' },
        ...prev
      ]);
    } else if (type === 'cpu') {
      const newAlert: SimulatedAlert = {
        id: `alt-${Date.now()}`,
        category: 'Application Events',
        title: 'App Server 1 High Utilization Surge',
        source: 'App Server 1 (AZ-1)',
        timestamp: time,
        severity: 'Warning',
        details: 'Simulated examination result publish surge. CPU sustained at 91% for 90 seconds.'
      };
      setActiveAlerts(prev => [newAlert, ...prev]);
      setLogs(prev => [
        { id: String(Date.now()), time: time.split(' ')[0], category: 'Application Events', source: 'App Server 1', level: 'WARN', message: 'MONITORING ALERT: CPU utilization exceeded 90% threshold. Dispatching Auto Scaling webhook.' },
        { id: String(Date.now() + 1), time: time.split(' ')[0], category: 'Network Events', source: 'ALB', level: 'INFO', message: 'Target group rebalancing traffic towards App Server 2 and App Server 3.' },
        ...prev
      ]);
    } else {
      const newAlert: SimulatedAlert = {
        id: `alt-${Date.now()}`,
        category: 'VPN Events',
        title: 'Simulated IPSec Tunnel Keepalive Ping',
        source: 'IPSec Tunnel 1 (3.109.112.45)',
        timestamp: time,
        severity: 'Info',
        details: 'Simulated cross-premises healthcheck verification with Bhubaneswar campus Customer Gateway.'
      };
      setActiveAlerts(prev => [newAlert, ...prev]);
      setLogs(prev => [
        { id: String(Date.now()), time: time.split(' ')[0], category: 'VPN Events', source: 'Virtual Private Gateway', level: 'INFO', message: 'VPN KEEP-ALIVE: Peer 203.129.214.10 responded in 14ms. BGP session 65000:65001 fully healthy.' },
        ...prev
      ]);
    }
  };

  const categories: { id: string; label: string; count: number }[] = [
    { id: 'All', label: 'All Streams', count: logs.length },
    { id: 'Network Events', label: 'Network Events', count: logs.filter(l => l.category === 'Network Events').length },
    { id: 'Identity Events', label: 'Identity Events', count: logs.filter(l => l.category === 'Identity Events').length },
    { id: 'Security Events', label: 'Security Events', count: logs.filter(l => l.category === 'Security Events').length },
    { id: 'Authentication Events', label: 'Authentication Events', count: logs.filter(l => l.category === 'Authentication Events').length },
    { id: 'VPN Events', label: 'VPN Events', count: logs.filter(l => l.category === 'VPN Events').length },
    { id: 'Application Events', label: 'Application Events', count: logs.filter(l => l.category === 'Application Events').length },
  ];

  const filteredLogs = logs.filter(l => {
    const matchCategory = selectedCategory === 'All' || l.category === selectedCategory;
    const matchSearch = 
      l.message.toLowerCase().includes(search.toLowerCase()) ||
      l.source.toLowerCase().includes(search.toLowerCase()) ||
      l.category.toLowerCase().includes(search.toLowerCase()) ||
      l.level.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="flex-1 bg-[#F5F9FF] dark:bg-slate-950 p-6 md:p-8 overflow-y-auto text-slate-900 dark:text-slate-100 font-sans transition-colors duration-150">
      <div className="max-w-7xl mx-auto space-y-7">
        
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1.5">
              <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>C. V. Raman Global University · Telemetry &amp; SIEM Operations</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Central Monitoring &amp; Security Auditing (Simulated SIEM)
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Consolidated simulated observability stream aggregating synthetic Network, Identity, Security, Authentication, VPN, and Application events (Requirement 12).
            </p>
          </div>

          {/* Local Simulation Disclaimer Banner */}
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-slate-900 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-mono flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>EDUCATIONAL LOCAL SIMULATION · ZERO CLOUD RUNTIME BILLING</span>
          </div>
        </div>

        {/* 4 Summary Telemetry Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-1 shadow-xs">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Ingested Event Rate (Simulated)</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">14,892 / hr</div>
            <div className="text-[11px] text-[#059669] dark:text-emerald-400 font-medium flex items-center gap-1 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" /> Simulation Ingestion Active
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-1 shadow-xs">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Observability Alarms</span>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono">{activeAlerts.length} Active</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">1 Critical · 1 Warning · 1 Info</div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-1 shadow-xs">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Mean Time to Detect (MTTD)</span>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono">&lt; 1.2s</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Simulated Automated Alarms</div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-1 shadow-xs">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Target Availability Objective</span>
            <div className="text-2xl font-bold text-[#059669] dark:text-emerald-400 font-mono">99.98%</div>
            <div className="text-[11px] text-[#059669] dark:text-emerald-400 font-mono">Simulated Architecture SLA</div>
          </div>
        </div>

        {/* Simulated System Metric Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Compute CPU Load
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-mono text-[11px] font-semibold">3 App Instances</span>
            </div>
            <div className="space-y-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <div className="flex justify-between">
                <span>App Server 1 (AZ-1):</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">42%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-[42%]" />
              </div>
              <div className="flex justify-between">
                <span>App Server 2 (AZ-2):</span>
                <span className="text-amber-600 dark:text-amber-400 font-semibold">84%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[84%]" />
              </div>
              <div className="flex justify-between">
                <span>App Server 3 (AZ-3):</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">38%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-[38%]" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Database Connection Pool
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono text-[11px] font-semibold">PgBouncer</span>
            </div>
            <div className="space-y-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Active Client Slots:</span>
                <span className="text-[#059669] dark:text-emerald-400 font-semibold">48 / 100</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#10B981] h-full w-[48%]" />
              </div>
              <div className="flex justify-between">
                <span>Database Query Latency:</span>
                <span className="text-slate-800 dark:text-slate-200">3.8 ms</span>
              </div>
              <div className="flex justify-between">
                <span>Public IP Association:</span>
                <span className="text-[#059669] dark:text-emerald-400 font-bold">0.0.0.0 (None)</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Hybrid IPSec Tunnel
              </span>
              <span className="text-purple-700 dark:text-purple-400 font-mono text-[11px] font-semibold">Tunnel 1 Active</span>
            </div>
            <div className="space-y-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Cross-Premises Latency:</span>
                <span className="text-slate-800 dark:text-slate-200">14 ms</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full w-[20%]" />
              </div>
              <div className="flex justify-between">
                <span>BGP Peering State:</span>
                <span className="text-[#059669] dark:text-emerald-400 font-bold">ESTABLISHED</span>
              </div>
              <div className="flex justify-between">
                <span>Throughput:</span>
                <span className="text-purple-600 dark:text-purple-300">4.2 MB/s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Synthetic Incident Injector with Pastel Buttons */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" />
              Dispatch Simulated Incident (Educational Telemetry Test):
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Injects synthetic events into live SIEM feed
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => handleTriggerSimulatedAlert('security')}
              className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-300 text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Simulate WAF Block &amp; Brute Force
            </button>

            <button
              onClick={() => handleTriggerSimulatedAlert('cpu')}
              className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-300 text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs"
            >
              <Cpu className="w-3.5 h-3.5" />
              Simulate App Server CPU Spike
            </button>

            <button
              onClick={() => handleTriggerSimulatedAlert('vpn')}
              className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800/40 text-purple-700 dark:text-purple-300 text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs"
            >
              <Radio className="w-3.5 h-3.5" />
              Simulate IPSec Tunnel Keepalive
            </button>
          </div>
        </div>

        {/* Active Observability Incidents Panel */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Active Observability Incidents ({activeAlerts.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeAlerts.map(alt => (
              <div
                key={alt.id}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 relative overflow-hidden shadow-xs"
              >
                <div className={`absolute top-0 left-0 bottom-0 w-1 ${
                  alt.severity === 'Critical' ? 'bg-[#EF4444]' : 
                  alt.severity === 'Warning' ? 'bg-[#F59E0B]' : 'bg-[#2563EB]'
                }`} />
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pl-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{alt.category}</span>
                  <span>{alt.timestamp}</span>
                </div>
                <h3 className="font-bold text-xs text-slate-900 dark:text-white pl-1 leading-snug">{alt.title}</h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed pl-1">{alt.details}</p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-slate-500 pl-1">
                  Source: <span className="text-slate-800 dark:text-slate-300 font-semibold">{alt.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unified SIEM Audit & Telemetry Console */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white font-sans">
                Unified SIEM Audit Stream (CloudWatch &amp; CloudTrail)
              </h2>
            </div>

            <div className="relative w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2" />
              <input
                type="text"
                placeholder="Search audit events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>
          </div>

          {/* 6 Requested Event Stream Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-sans">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1.5 shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-[#2563EB] text-white font-bold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[9px] font-mono px-1 rounded ${
                  selectedCategory === cat.id ? 'bg-blue-700 text-white' : 'bg-white dark:bg-slate-900 text-slate-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Terminal Log Console */}
          <div className="bg-[#0F172A] rounded-xl p-3 border border-slate-800 h-80 overflow-y-auto space-y-1.5 text-[11px] font-mono text-slate-200">
            {filteredLogs.map(l => (
              <div key={l.id} className="flex items-start gap-3 hover:bg-slate-900/60 p-1.5 rounded transition">
                <span className="text-slate-500 shrink-0">{l.time}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                  l.level === 'SECURITY' ? 'bg-[#FEE2E2] text-[#B91C1C]' :
                  l.level === 'ERROR' ? 'bg-[#FEE2E2] text-[#B91C1C]' :
                  l.level === 'WARN' ? 'bg-[#FEF3C7] text-[#B45309]' :
                  'bg-slate-800 text-slate-300'
                }`}>
                  {l.level}
                </span>
                <span className="text-cyan-400 shrink-0 w-36 truncate font-sans font-medium">
                  [{l.category}]
                </span>
                <span className="text-slate-400 shrink-0 w-32 truncate font-mono">
                  {l.source}
                </span>
                <span className="text-slate-200 font-sans flex-1">
                  {l.message}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-100 dark:border-slate-800">
            <span>Showing {filteredLogs.length} of {logs.length} telemetry records</span>
            <span className="flex items-center gap-1 text-[#059669] dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> WORM Log Bucket: Immutable (Compliance Enforced)
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

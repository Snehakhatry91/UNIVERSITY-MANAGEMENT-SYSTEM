import React, { useState } from 'react';
import { NETWORK_SUBNETS, SECURITY_GROUP_RULES } from '../../data/networkData';
import { 
  Network, 
  ShieldCheck, 
  ArrowRight, 
  Globe, 
  Server, 
  Database, 
  Layers, 
  CheckCircle2, 
  XCircle
} from 'lucide-react';

export const NetworkArchitectureView: React.FC = () => {
  const [selectedSubnet, setSelectedSubnet] = useState<string>(NETWORK_SUBNETS[0].name);

  const activeSubnet = NETWORK_SUBNETS.find(s => s.name === selectedSubnet) || NETWORK_SUBNETS[0];

  return (
    <div className="flex-1 bg-[#F5F9FF] dark:bg-slate-950 p-6 md:p-8 overflow-y-auto text-slate-900 dark:text-slate-100 font-sans transition-colors duration-150">
      <div className="max-w-7xl mx-auto space-y-7">
        
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1.5">
            <Network className="w-4 h-4" />
            <span>VPC Topology &amp; Traffic Engineering · 10.0.0.0/16</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Network Architecture &amp; Subnet Segmentation
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Three-tier virtual private cloud topology partitioned into isolated subnets with explicit stateful security group boundaries, eliminating public exposure of database and microservice tiers.
          </p>
        </div>

        {/* End-to-End Infrastructure Flow Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
            <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">Traffic Routing Flow:</span>
            <span>Client → Edge → ALB → App Fleet → Database</span>
          </div>

          <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2 flex-1 min-w-[140px]">
              <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <div>
                <p className="text-slate-900 dark:text-white font-bold text-[11px]">Internet</p>
                <p className="text-[10px] text-slate-500">Public Clients</p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0 hidden md:block" />

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2 flex-1 min-w-[140px]">
              <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <div>
                <p className="text-slate-900 dark:text-white font-bold text-[11px]">CloudFront CDN</p>
                <p className="text-[10px] text-slate-500">Edge Caching + WAF</p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0 hidden md:block" />

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2 flex-1 min-w-[140px]">
              <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <div>
                <p className="text-slate-900 dark:text-white font-bold text-[11px]">Load Balancer</p>
                <p className="text-[10px] text-slate-500">Public DMZ · 443</p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0 hidden md:block" />

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2 flex-1 min-w-[140px]">
              <Server className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="text-slate-900 dark:text-white font-bold text-[11px]">App Servers (x3)</p>
                <p className="text-[10px] text-slate-500">App Subnet · 8080</p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0 hidden md:block" />

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2 flex-1 min-w-[140px]">
              <Database className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <div>
                <p className="text-slate-900 dark:text-white font-bold text-[11px]">RDS PostgreSQL</p>
                <p className="text-[10px] text-slate-500">DB Subnet · 5432</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Visually Distinct Subnet Containers with Pastel Themes */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono mb-3">
            Subnet Partitioning &amp; Traffic Boundaries
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. PUBLIC SUBNET (Blue Pastel) */}
            <div className="bg-white dark:bg-slate-900 border-2 border-blue-200 dark:border-blue-900/50 rounded-2xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800/40">
                    PUBLIC SUBNET
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5">Ingress DMZ</h3>
                </div>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">10.0.1.0/24</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Direct internet-facing subnet with route table pointing to Internet Gateway (IGW 0.0.0.0/0). Houses Application Load Balancer.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 space-y-1">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Allowed Traffic:
                  </span>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400/90 font-mono">
                    • Ingress TCP 443 from 0.0.0.0/0 (HTTPS)
                    <br />• Egress TCP 8080 to sg-app-tier only
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 space-y-1">
                  <span className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5 text-[11px]">
                    <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    Blocked Traffic:
                  </span>
                  <p className="text-[11px] text-rose-700 dark:text-rose-400/90 font-mono">
                    • TCP 80 HTTP (Redirected to 443)
                    <br />• Direct Database Port 5432 (BLOCKED)
                    <br />• SSH Port 22 from Internet (DROPPED)
                  </p>
                </div>
              </div>
            </div>

            {/* 2. APPLICATION SUBNET (Green Pastel) */}
            <div className="bg-white dark:bg-slate-900 border-2 border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800/40">
                    APPLICATION SUBNET
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5">Compute Cluster</h3>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">10.0.2.0/24</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Private subnet hosting 3 EC2 application servers running Spring Boot / Node microservices with no direct public IP routes.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 space-y-1">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Allowed Traffic:
                  </span>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400/90 font-mono">
                    • Ingress TCP 8080 from sg-alb only
                    <br />• Egress TCP 5432 to sg-db-tier
                    <br />• Outbound HTTPS via NAT for OS patches
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 space-y-1">
                  <span className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5 text-[11px]">
                    <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    Blocked Traffic:
                  </span>
                  <p className="text-[11px] text-rose-700 dark:text-rose-400/90 font-mono">
                    • Ingress from Internet 0.0.0.0/0 (BLOCKED)
                    <br />• Direct DB modification bypass (BLOCKED)
                  </p>
                </div>
              </div>
            </div>

            {/* 3. DATABASE SUBNET (Purple Pastel) */}
            <div className="bg-white dark:bg-slate-900 border-2 border-purple-200 dark:border-purple-900/50 rounded-2xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800/40">
                    DATABASE SUBNET
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5">Isolated Data Tier</h3>
                </div>
                <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">10.0.3.0/24</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Completely isolated private subnet. Relational database has NO public IPv4, NO route to Internet Gateway, and NO NAT association.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 space-y-1">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Allowed Traffic:
                  </span>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400/90 font-mono">
                    • Ingress TCP 5432 strictly from sg-app-tier
                    <br />• Multi-AZ sync replication between AZ-1 &amp; AZ-2
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 space-y-1">
                  <span className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5 text-[11px]">
                    <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    Blocked Traffic:
                  </span>
                  <p className="text-[11px] text-rose-700 dark:text-rose-400/90 font-mono">
                    • ANY Ingress from Internet (ZERO IP)
                    <br />• ALB Ingress bypass (BLOCKED)
                    <br />• Public Egress routes (NON-EXISTENT)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subnet Details Inspector Drawer */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Detailed Subnet Configuration
            </h3>
            
            <div className="flex items-center gap-2">
              {NETWORK_SUBNETS.map(sub => (
                <button
                  key={sub.name}
                  onClick={() => setSelectedSubnet(sub.name)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium font-mono transition ${
                    selectedSubnet === sub.name
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {sub.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px]">CIDR Block:</span>
              <p className="font-bold text-blue-600 dark:text-blue-400 text-sm">{activeSubnet.cidr}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px]">Tier Type:</span>
              <p className="font-bold text-slate-900 dark:text-white">{activeSubnet.type}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px]">Availability Zone:</span>
              <p className="font-bold text-slate-900 dark:text-white">{activeSubnet.zone}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px]">Internet Route:</span>
              <p className="font-bold text-purple-600 dark:text-purple-400 truncate">{activeSubnet.internetAccess}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-sans">Associated Tier Resources:</h4>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {activeSubnet.associatedResources.map((res, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs">
                  {res}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stateful Security Group Rules Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Stateful Security Group Matrix (Layer 4 Firewall Rules)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Least functional ingress allowance enforced at network interfaces.
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
              Stateful Filtering Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-[#F8FAFC] dark:bg-slate-950 text-[11px]">
                  <th className="p-3 font-semibold">Security Group</th>
                  <th className="p-3 font-semibold">Direction</th>
                  <th className="p-3 font-semibold">Protocol</th>
                  <th className="p-3 font-semibold">Port Range</th>
                  <th className="p-3 font-semibold">Source / Destination</th>
                  <th className="p-3 font-semibold font-sans">Architectural Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {SECURITY_GROUP_RULES.map((rule, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{rule.groupName}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rule.direction === 'Inbound' 
                          ? 'bg-[#D1FAE5] text-[#047857] border border-emerald-200' 
                          : 'bg-[#DBEAFE] text-[#1D4ED8] border border-blue-200'
                      }`}>
                        {rule.direction}
                      </span>
                    </td>
                    <td className="p-3 text-blue-600 dark:text-blue-400 font-semibold">{rule.protocol}</td>
                    <td className="p-3 font-bold text-amber-600 dark:text-amber-400">{rule.portRange}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 truncate max-w-xs">{rule.sourceDestination}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400 font-sans text-xs">{rule.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

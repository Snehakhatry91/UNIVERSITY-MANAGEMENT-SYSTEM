import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Pause, Terminal, Clock } from 'lucide-react';

interface SimulationControlProps {
  onStepChange: (activeNodes: string[], activeEdges: string[]) => void;
  onReset: () => void;
}

interface StepLog {
  time: string;
  message: string;
  nodes: string[];
  edges: string[];
  detail: string;
}

export const SimulationControl: React.FC<SimulationControlProps> = ({ onStepChange, onReset }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [logs, setLogs] = useState<{ time: string; message: string; type: string }[]>([]);

  const formatNow = () => {
    const d = new Date();
    return d.toTimeString().split(' ')[0];
  };

  const steps: StepLog[] = [
    {
      time: '00:00:01',
      message: '1. Student: Authenticated browser session initiates request (Rohan Sharma)',
      nodes: ['node-students'],
      edges: ['edge-students-internet'],
      detail: 'TLS 1.3 Client Hello initiated toward portal.cvrgu.edu.in with OAuth2 Bearer token'
    },
    {
      time: '00:00:01',
      message: '2. HTTPS 443: Transport Layer Security (TLS 1.3) negotiation & encryption',
      nodes: ['node-students', 'node-internet'],
      edges: ['edge-students-internet'],
      detail: 'Cipher suite: TLS_AES_256_GCM_SHA384 with Perfect Forward Secrecy'
    },
    {
      time: '00:00:01',
      message: '3. Route 53: Authoritative DNS resolves portal.cvrgu.edu.in to Edge PoP',
      nodes: ['node-internet'],
      edges: ['edge-internet-cdn'],
      detail: 'Latency-based Anycast DNS routing returns nearest CloudFront edge IP in 3.1ms'
    },
    {
      time: '00:00:02',
      message: '4. CloudFront: Edge Content Delivery Network inspects URI path',
      nodes: ['node-cdn'],
      edges: ['edge-internet-cdn', 'edge-cdn-alb'],
      detail: 'Dynamic API route (/api/v1/student/records) triggers cache-bypass directly to origin'
    },
    {
      time: '00:00:02',
      message: '5. WAF: AWS WAF inspects request payload for SQLi, XSS, and rate limits',
      nodes: ['node-cdn', 'node-sg-public'],
      edges: ['edge-cdn-alb'],
      detail: 'Deep packet inspection: 0 anomalies detected. Action: ALLOW forwarded to VPC'
    },
    {
      time: '00:00:02',
      message: '6. ALB: Application Load Balancer distributes to healthy instance in App Subnet',
      nodes: ['node-alb', 'node-app-1'],
      edges: ['edge-cdn-alb', 'edge-alb-app-1'],
      detail: 'Round-robin health check verified; forwarded to App Server 1 (10.0.1.45:8080)'
    },
    {
      time: '00:00:03',
      message: '7. App Server: Microservice evaluates RBAC claims & tenant boundaries',
      nodes: ['node-app-1'],
      edges: ['edge-alb-app-1', 'edge-app-1-db'],
      detail: 'Role STUDENT has entitlement student:view_records. Initiating connection pool query to RDS'
    },
    {
      time: '00:00:03',
      message: '8. RDS :5432: Isolated PostgreSQL queries database over Port 5432',
      nodes: ['node-app-1', 'node-db'],
      edges: ['edge-app-1-db'],
      detail: 'Security Group sg-db ingress allows TCP 5432 from sg-app-server. Direct client queries blocked.'
    },
    {
      time: '00:00:04',
      message: "9. Student's Authorized Records: Multi-tenant row-level filter isolated with KMS",
      nodes: ['node-db'],
      edges: ['edge-app-1-db'],
      detail: 'Row-level isolation enforced: WHERE student_id = CVGU2023CSE042. Decrypted with KMS CMK.'
    },
    {
      time: '00:00:04',
      message: '10. Response: HTTP 200 OK encrypted payload delivered back to Student browser',
      nodes: ['node-db', 'node-app-1', 'node-alb', 'node-cdn', 'node-students'],
      edges: ['edge-app-1-db', 'edge-alb-app-1', 'edge-cdn-alb', 'edge-students-internet'],
      detail: 'Encrypted response delivered in 28ms round-trip time. Rendered on Student Dashboard.'
    }
  ];

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isRunning && currentStep < steps.length - 1) {
      timer = setTimeout(() => {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        const step = steps[nextStep];
        onStepChange(step.nodes, step.edges);
        setLogs(prev => [
          ...prev,
          {
            time: formatNow(),
            message: step.message,
            type: nextStep === steps.length - 1 ? 'success' : 'info'
          }
        ]);
      }, 1600);
    } else if (currentStep >= steps.length - 1) {
      setIsRunning(false);
    }
    return () => clearTimeout(timer);
  }, [isRunning, currentStep]);

  const handleStart = () => {
    if (currentStep === -1 || currentStep >= steps.length - 1) {
      setCurrentStep(0);
      const step = steps[0];
      onStepChange(step.nodes, step.edges);
      setLogs([
        {
          time: formatNow(),
          message: step.message,
          type: 'info'
        }
      ]);
      setIsRunning(true);
    } else {
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStep(-1);
    setLogs([]);
    onReset();
  };

  return (
    <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xl text-slate-900 dark:text-slate-100 max-w-xl w-full font-sans transition-colors duration-200">
      {/* Simulation Disclaimer Badge */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            {isRunning && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2563EB] dark:bg-cyan-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isRunning ? 'bg-[#2563EB] dark:bg-cyan-500' : 'bg-slate-400'}`}></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Request Flow Simulator
          </span>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FEF3C7] border border-amber-300 text-[#B45309] dark:bg-amber-950/70 dark:border-amber-500/30 dark:text-amber-300 font-semibold">
          ARCHITECTURE SIMULATION — ₹0 EXPENSE
        </span>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {currentStep === -1 || currentStep >= steps.length - 1 ? 'SIMULATE REQUEST' : 'RESUME'}
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F59E0B] hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs active:scale-95"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              PAUSE
            </button>
          )}

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            RESET
          </button>
        </div>

        {/* Progress tracker */}
        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
          Step: <span className="text-[#2563EB] dark:text-cyan-400 font-bold">{currentStep >= 0 ? currentStep + 1 : 0}</span> / {steps.length}
        </div>
      </div>

      {/* Step Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
        <div 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-300"
          style={{ width: `${currentStep >= 0 ? ((currentStep + 1) / steps.length) * 100 : 0}%` }}
        />
      </div>

      {/* Live Event Console */}
      <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 font-mono text-xs">
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
          <span className="flex items-center gap-1">
            <Terminal className="w-3 h-3 text-cyan-400" />
            Live Telemetry Event Console
          </span>
          <span className="text-slate-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Real-Time UTC
          </span>
        </div>

        <div className="h-28 overflow-y-auto space-y-1.5 pr-1">
          {logs.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs italic">
              Click &quot;SIMULATE REQUEST&quot; to trace student request propagation through the VPC tiers
            </div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px] leading-relaxed">
                <span className="text-slate-500 shrink-0">{log.time}</span>
                <span className={log.type === 'success' ? 'text-emerald-400 font-semibold' : 'text-slate-200'}>
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  CheckCircle2, 
  ShieldCheck, 
  X, 
  Globe, 
  Server, 
  Database, 
  FileText, 
  Layers, 
  Lock, 
  Activity,
  ArrowDown
} from 'lucide-react';

interface RequestFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FlowStage {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  awsService: string;
  protocol: string;
  port: string;
  networkLocation: string;
  securityCheck: string;
  telemetryLog: string;
  payloadSnippet: string;
  icon: React.ReactNode;
}

export const RequestFlowModal: React.FC<RequestFlowModalProps> = ({ isOpen, onClose }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const stages: FlowStage[] = [
    {
      id: 'student',
      stepNumber: 1,
      title: 'Student Client',
      subtitle: 'Authenticated Browser Session (Rohan Sharma)',
      awsService: 'Web Browser Client (CVGU Portal)',
      protocol: 'HTTP/2 over TLS 1.3',
      port: 'Ephemeral (e.g. 52140)',
      networkLocation: 'Public Internet (Student Laptop / Campus Wi-Fi)',
      securityCheck: 'JWT Bearer token attached: Bearer cvgu-jwt-student-042',
      telemetryLog: '[CLIENT] Initiating GET /api/v1/student/records?id=CVGU2023CSE042 with OAuth2 Bearer token.',
      payloadSnippet: '{\n  "action": "GET_ACADEMIC_RECORD",\n  "studentId": "CVGU2023CSE042",\n  "session": "sso-cvgu-live"\n}',
      icon: <FileText className="w-5 h-5 text-sky-400" />
    },
    {
      id: 'https',
      stepNumber: 2,
      title: 'HTTPS (Port 443)',
      subtitle: 'End-to-End Encryption in Transit',
      awsService: 'AWS Certificate Manager (ACM)',
      protocol: 'TLS 1.3 (RFC 8446)',
      port: 'TCP 443',
      networkLocation: 'Public Transit Boundary',
      securityCheck: 'Cipher Suite: TLS_AES_256_GCM_SHA384 with Perfect Forward Secrecy (ECDHE)',
      telemetryLog: '[TLS_HANDSHAKE] Negotiated TLS 1.3. Server certificate verified for *.cvrgu.edu.in issued by Amazon Trust Services.',
      payloadSnippet: 'ClientHello -> ServerHello -> EncryptedExtensions -> Certificate -> Finished\n[Encrypted Application Data: 1,024 bytes]',
      icon: <Lock className="w-5 h-5 text-emerald-400" />
    },
    {
      id: 'route53',
      stepNumber: 3,
      title: 'Amazon Route 53',
      subtitle: 'Global Authoritative DNS & Latency Routing',
      awsService: 'Route 53 Hosted Zone',
      protocol: 'DNS over UDP/TCP 53',
      port: '53',
      networkLocation: 'AWS Anycast Global Edge',
      securityCheck: 'DNSSEC validation enabled. Resolves portal.cvrgu.edu.in to nearest CloudFront PoP.',
      telemetryLog: '[ROUTE53] DNS Query for portal.cvrgu.edu.in resolved to CloudFront distribution d1234.cloudfront.net in 3.1ms.',
      payloadSnippet: ';; QUESTION SECTION:\n;portal.cvrgu.edu.in. IN A\n;; ANSWER SECTION:\nportal.cvrgu.edu.in. 60 IN A 13.224.10.45',
      icon: <Globe className="w-5 h-5 text-cyan-400" />
    },
    {
      id: 'cloudfront',
      stepNumber: 4,
      title: 'Amazon CloudFront',
      subtitle: 'Edge Content Delivery Network (PoP)',
      awsService: 'CloudFront Edge Location',
      protocol: 'HTTPS 443',
      port: '443',
      networkLocation: 'Edge Location (Bhubaneswar / Kolkata PoP)',
      securityCheck: 'Static asset cache-bypass for dynamic /api/* route; TLS termination at edge.',
      telemetryLog: '[CLOUDFRONT] Cache miss on dynamic API route /api/v1/student/records. Forwarding to Origin ALB with X-Forwarded-For headers.',
      payloadSnippet: 'HTTP/1.1 Forward to Origin:\nHost: alb.prod.cvrgu.edu.in\nX-Forwarded-For: 103.112.48.91\nX-Amz-Cf-Id: cf-tx-994102',
      icon: <Activity className="w-5 h-5 text-purple-400" />
    },
    {
      id: 'waf',
      stepNumber: 5,
      title: 'AWS WAF',
      subtitle: 'Layer 7 Deep Packet Inspection & Anti-DDoS',
      awsService: 'AWS WAF WebACL (Attached to CloudFront/ALB)',
      protocol: 'Layer 7 Filter',
      port: 'N/A',
      networkLocation: 'Edge & Ingress Inspection Boundary',
      securityCheck: 'Evaluated AWSManagedRulesCommonRuleSet, SQLi protection, and rate limit rules. 0 threats detected.',
      telemetryLog: '[WAF_INSPECT] Request clean. SQL injection match: false, XSS match: false, Rate limit: 42/2000 per 5m. Action: ALLOW.',
      payloadSnippet: 'Rule: AWS-AWSManagedRulesSQLiRuleSet -> PASS\nRule: AWS-AWSManagedRulesCommonRuleSet -> PASS\nDecision: ALLOW (Terminating)',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />
    },
    {
      id: 'alb',
      stepNumber: 6,
      title: 'Application Load Balancer (ALB)',
      subtitle: 'Dual-AZ Ingress Traffic Distributor',
      awsService: 'Elastic Load Balancing v2 (ALB)',
      protocol: 'HTTP/HTTPS Target Protocol',
      port: '8080 (Target Group)',
      networkLocation: 'VPC Public Subnets (10.0.0.0/24 & 10.0.128.0/24)',
      securityCheck: 'Security Group sg-alb allows inbound 443; routes strictly to target group in private app subnets.',
      telemetryLog: '[ALB] Target health check 200 OK. Round-robin selected healthy target: App Server 1 (10.0.1.45:8080 in ap-south-1a).',
      payloadSnippet: 'Forwarding to TargetGroup: arn:aws:elasticloadbalancing:ap-south-1:...:targetgroup/cvgu-app-tg\nTarget: 10.0.1.45:8080',
      icon: <Layers className="w-5 h-5 text-blue-400" />
    },
    {
      id: 'appserver',
      stepNumber: 7,
      title: 'Application Server (EC2)',
      subtitle: 'Stateless Microservices Fleet (Private Subnet)',
      awsService: 'EC2 c6i.xlarge (Auto Scaling Group)',
      protocol: 'HTTP 8080 (Internal)',
      port: '8080',
      networkLocation: 'Private Application Subnet AZ-A (10.0.1.0/24 - NO Public IP)',
      securityCheck: 'API Gateway Middleware verifies JWT signature and evaluates RBAC: Role STUDENT has permission student:view_records.',
      telemetryLog: '[APP_SERVER] Token valid for Rohan Sharma. Entitlement verified: student:view_records. Initiating connection pool query to RDS.',
      payloadSnippet: 'RBAC Policy Evaluator:\nPrincipal: 2023cse042 (STUDENT)\nRequired: student:view_records\nResult: ALLOW (Tenant Scope: CVGU2023CSE042)',
      icon: <Server className="w-5 h-5 text-amber-400" />
    },
    {
      id: 'rds',
      stepNumber: 8,
      title: 'Amazon RDS PostgreSQL (:5432)',
      subtitle: 'Multi-AZ Database Tier (Port 5432)',
      awsService: 'Amazon RDS PostgreSQL Multi-AZ',
      protocol: 'PostgreSQL TCP wire protocol',
      port: 'TCP 5432',
      networkLocation: 'Isolated Database Subnet (10.0.10.0/24 - ZERO Internet Route)',
      securityCheck: 'Security Group sg-db ingress strictly permits TCP 5432 from sg-app-server. Direct client queries blocked.',
      telemetryLog: '[POSTGRES_5432] Connection accepted from 10.0.1.45. Executing parameterized query with KMS data key decryption.',
      payloadSnippet: 'PREPARED STATEMENT query_student_record AS\nSELECT s.*, g.sgpa, g.cgpa, a.percentage\nFROM students s JOIN grades g ON s.id = g.student_id\nWHERE s.student_id = $1;',
      icon: <Database className="w-5 h-5 text-purple-400" />
    },
    {
      id: 'authorized_records',
      stepNumber: 9,
      title: "Student's Authorized Records",
      subtitle: 'Multi-Tenant Isolation & Least Privilege Scope',
      awsService: 'RDS Storage Engine (Encrypted with KMS CMK)',
      protocol: 'Row-Level Isolation',
      port: 'Internal',
      networkLocation: 'PostgreSQL Buffer Pool & KMS Decryption',
      securityCheck: 'Scope Boundary Check: Result set filtered strictly to CVGU2023CSE042. Zero leakage across tenant partitions.',
      telemetryLog: '[ISOLATION] Returned 1 record matching student_id = CVGU2023CSE042. Query execution time: 2.4ms. Data decrypted with KMS CMK.',
      payloadSnippet: '{\n  "studentId": "CVGU2023CSE042",\n  "fullName": "Rohan Sharma",\n  "cgpa": 8.84,\n  "attendance": 88.5,\n  "dues": 0\n}',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />
    },
    {
      id: 'response',
      stepNumber: 10,
      title: 'Response (HTTP 200 OK)',
      subtitle: 'Encrypted JSON Delivered to Student Portal',
      awsService: 'ALB -> CloudFront -> Student Browser',
      protocol: 'HTTPS 443 / JSON',
      port: 'TCP 443',
      networkLocation: 'Return Journey to Client Viewport',
      securityCheck: 'Response headers injected: X-Content-Type-Options: nosniff, Strict-Transport-Security: max-age=31536000.',
      telemetryLog: '[RESPONSE_200] Payload delivered to client in 28ms total round-trip time. HTTP 200 OK rendered in Student Dashboard.',
      payloadSnippet: 'HTTP/2 200 OK\ncontent-type: application/json\nx-amz-cf-pop: CCU50-P1\ncontent-length: 428\n\n{"status":"SUCCESS","data":{...}}',
      icon: <CheckCircle2 className="w-5 h-5 text-cyan-400" />
    }
  ];

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isOpen && isPlaying) {
      timer = setInterval(() => {
        setActiveStep(prev => (prev < stages.length - 1 ? prev + 1 : 0));
      }, 2200);
    }
    return () => clearInterval(timer);
  }, [isOpen, isPlaying, stages.length]);

  if (!isOpen) return null;

  const currentStage = stages[activeStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-950/50 flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  END-TO-END FLOW TRACER
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Stage {activeStep + 1} of {stages.length}
                </span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                Student Request Propagation &amp; Database Isolation Journey
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold border border-slate-700 transition"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
            </button>
            <button
              onClick={() => setActiveStep(0)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
              title="Restart Sequence"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progression Bar / Breadcrumbs */}
        <div className="px-6 py-3 bg-slate-950 border-b border-slate-800/80 overflow-x-auto shrink-0 select-none">
          <div className="flex items-center gap-1.5 min-w-max text-xs font-mono">
            {stages.map((st, idx) => {
              const isPassed = idx < activeStep;
              const isCurrent = idx === activeStep;
              return (
                <React.Fragment key={st.id}>
                  <button
                    onClick={() => {
                      setActiveStep(idx);
                      setIsPlaying(false);
                    }}
                    className={`px-2.5 py-1 rounded-lg border text-left transition flex items-center gap-1.5 ${
                      isCurrent
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-md shadow-cyan-500/20'
                        : isPassed
                        ? 'bg-slate-900 border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <span>{st.stepNumber}. {st.title}</span>
                  </button>
                  {idx < stages.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Visual Pipeline Diagram */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Architecture Execution Pipeline
            </h4>

            <div className="space-y-2 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
              {stages.map((st, idx) => {
                const isCurrent = idx === activeStep;
                const isPassed = idx < activeStep;
                return (
                  <div key={st.id} className="relative">
                    <button
                      onClick={() => {
                        setActiveStep(idx);
                        setIsPlaying(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border transition flex items-center justify-between ${
                        isCurrent
                          ? 'bg-cyan-500/15 border-cyan-400/80 shadow-lg shadow-cyan-500/10'
                          : isPassed
                          ? 'bg-slate-900/60 border-emerald-500/30 text-slate-300'
                          : 'bg-slate-900/30 border-slate-800/60 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg border ${
                          isCurrent ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}>
                          {st.icon}
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${isCurrent ? 'text-white' : isPassed ? 'text-slate-200' : 'text-slate-400'}`}>
                            {st.stepNumber}. {st.title}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono truncate">{st.awsService}</p>
                        </div>
                      </div>

                      <div className="text-right font-mono text-[10px]">
                        <span className={`px-2 py-0.5 rounded ${
                          isCurrent ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'text-slate-500'
                        }`}>
                          {st.port !== 'N/A' ? `Port ${st.port}` : 'Layer 7'}
                        </span>
                      </div>
                    </button>

                    {idx < stages.length - 1 && (
                      <div className="flex justify-center py-0.5">
                        <ArrowDown className={`w-3 h-3 ${isPassed ? 'text-emerald-500/50' : 'text-slate-700'}`} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Deep Stage Inspection & Telemetry */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      STEP {currentStage.stepNumber} OF 10
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-semibold">
                      STATUS: VERIFIED
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">{currentStage.title}</h3>
                  <p className="text-xs text-slate-300">{currentStage.subtitle}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  {currentStage.icon}
                </div>
              </div>

              {/* Technical Specifications Matrix */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="text-slate-500 block text-[10px]">AWS / Architectural Service:</span>
                  <span className="text-white font-bold">{currentStage.awsService}</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="text-slate-500 block text-[10px]">Protocol &amp; Port:</span>
                  <span className="text-cyan-400 font-bold">{currentStage.protocol} ({currentStage.port})</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="text-slate-500 block text-[10px]">Network Location:</span>
                  <span className="text-slate-200">{currentStage.networkLocation}</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="text-slate-500 block text-[10px]">Zero-Trust Security Barrier:</span>
                  <span className="text-emerald-400 font-bold truncate block">{currentStage.securityCheck}</span>
                </div>
              </div>

              {/* Live Telemetry Log Output */}
              <div className="space-y-1.5 font-mono text-xs">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  CloudWatch &amp; VPC Flow Log Entry:
                </span>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-cyan-300 leading-relaxed text-[11px]">
                  {currentStage.telemetryLog}
                </div>
              </div>

              {/* Wire Payload / SQL Snippet */}
              <div className="space-y-1.5 font-mono text-xs">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  Wire Protocol Payload / Parameterized Query:
                </span>
                <pre className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-amber-300 text-[11px] overflow-x-auto">
                  {currentStage.payloadSnippet}
                </pre>
              </div>
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="flex justify-between items-center pt-2">
              <button
                disabled={activeStep === 0}
                onClick={() => {
                  setActiveStep(prev => Math.max(0, prev - 1));
                  setIsPlaying(false);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-mono font-bold border border-slate-700 transition"
              >
                ← Previous Stage
              </button>

              <button
                disabled={activeStep === stages.length - 1}
                onClick={() => {
                  setActiveStep(prev => Math.min(stages.length - 1, prev + 1));
                  setIsPlaying(false);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 text-xs font-mono font-bold transition shadow-lg shadow-cyan-500/20"
              >
                Next Stage →
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs font-mono text-slate-500 shrink-0">
          <span>C. V. RAMAN GLOBAL UNIVERSITY · Request Flow Simulation</span>
          <span className="text-emerald-400">Strict Network &amp; Database Isolation Verified</span>
        </div>

      </div>
    </div>
  );
};

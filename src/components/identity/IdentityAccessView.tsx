import React, { useState } from 'react';
import { 
  Key, 
  ShieldCheck, 
  GraduationCap, 
  Laptop, 
  Cpu, 
  BookOpen, 
  Library, 
  CreditCard,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export const IdentityAccessView: React.FC = () => {
  const [activeIdentityTab, setActiveIdentityTab] = useState<'iam' | 'rbac' | 'federation' | 'sso' | 'mfa'>('iam');
  const [selectedRole, setSelectedRole] = useState<'student' | 'faculty' | 'admin' | 'workload'>('student');

  return (
    <div className="flex-1 bg-[#F5F9FF] dark:bg-slate-950 p-6 md:p-8 overflow-y-auto text-slate-900 dark:text-slate-100 font-sans transition-colors duration-150">
      <div className="max-w-7xl mx-auto space-y-7">
        
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1.5">
            <Key className="w-4 h-4" />
            <span>Zero-Trust Campus Identity Architecture</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Identity &amp; Access Management (IAM &amp; RBAC)
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Centralized authentication and authorization brokered via University Identity Provider federation, Role-Based Access Control (RBAC), multi-factor enforcement, and single sign-on across campus services.
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-mono">
          {[
            { id: 'iam', label: '1. IAM Identities (4 Types)' },
            { id: 'rbac', label: '2. RBAC Policy Engine' },
            { id: 'federation', label: '3. Identity Federation (SAML 2.0)' },
            { id: 'sso', label: '4. Single Sign-On (SSO Services)' },
            { id: 'mfa', label: '5. Multi-Factor Authentication (MFA)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveIdentityTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl transition whitespace-nowrap font-medium ${
                activeIdentityTab === tab.id
                  ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 1. IAM SECTION: Students, Faculty, Administrators, Workloads */}
        {activeIdentityTab === 'iam' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Cloud IAM Identity Principals</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Classified identity tiers provisioned in the central campus directory.</p>
              </div>
              <span className="text-xs font-mono text-slate-500">4 Architectural Principals</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Students */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    4,800 Users
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Student Identity</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Ephemeral STS session tokens issued upon SAML login. Scoped to personal grades, courses, and submission uploads.
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-blue-600 dark:text-blue-400">
                  Principal: urn:cvrgu:identity:student
                </div>
              </div>

              {/* Faculty */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    340 Users
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Faculty Identity</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Academic instructors with course publishing and grade submission privileges. Mandatory MFA on grade finalization.
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-purple-600 dark:text-purple-400">
                  Principal: urn:cvrgu:identity:faculty
                </div>
              </div>

              {/* Administrators */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    12 Users
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Administrator Identity</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Privileged infrastructure operators. Hardware FIDO2 MFA tokens required. Strictly prohibited from editing student grades.
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-amber-600 dark:text-amber-400">
                  Principal: urn:cvrgu:identity:admin
                </div>
              </div>

              {/* Workloads */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    18 Service Accounts
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Workload Identity</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Instance metadata IAM roles attached to App EC2 and Lambda background workers. Zero hardcoded permanent credentials.
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                  Principal: urn:cvrgu:workload:app-tier
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. RBAC SECTION */}
        {activeIdentityTab === 'rbac' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Role-Based Access Control (RBAC) Entitlement Matrix</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Least privilege authorization matrix enforced at API gateway and application controllers.</p>
              </div>

              <div className="flex items-center gap-1.5">
                {(['student', 'faculty', 'admin', 'workload'] as const).map(role => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition ${
                      selectedRole === role
                        ? 'bg-purple-600 text-white font-bold'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {role} Role
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
              <h4 className="text-xs font-bold font-mono text-purple-700 dark:text-purple-400 uppercase">
                Active Policy Entitlements for Role: [{selectedRole.toUpperCase()}]
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Allowed Actions */}
                <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-2">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Explicitly Allowed Actions (RBAC PERMIT):
                  </span>
                  <ul className="text-slate-700 dark:text-slate-300 space-y-1.5 font-mono text-[11px] list-disc list-inside">
                    {selectedRole === 'student' && (
                      <>
                        <li>portal:courses:read (Enrolled semester subjects)</li>
                        <li>portal:grades:read (Personal grade report only)</li>
                        <li>portal:assignments:submit (Upload homework solutions)</li>
                        <li>portal:profile:read (Student demographic information)</li>
                      </>
                    )}
                    {selectedRole === 'faculty' && (
                      <>
                        <li>portal:courses:manage (Publish syllabi, assignments)</li>
                        <li>portal:grades:write (Draft and publish course grades)</li>
                        <li>portal:roster:read (View student lists per class)</li>
                        <li>portal:mfa:verify (Perform TOTP confirmation for submissions)</li>
                      </>
                    )}
                    {selectedRole === 'admin' && (
                      <>
                        <li>cloud:vpc:read / cloud:ec2:manage (Compute fleet provisioning)</li>
                        <li>cloud:iam:manage (Role assignment and token revoking)</li>
                        <li>cloud:audit:read (CloudWatch / CloudTrail forensic inspection)</li>
                        <li>cloud:db:snapshot (Backup and disaster recovery dispatch)</li>
                      </>
                    )}
                    {selectedRole === 'workload' && (
                      <>
                        <li>db:postgresql:read_write (Port 5432 query execution)</li>
                        <li>cloudwatch:put_metric_data (Telemetry emission)</li>
                        <li>s3:object:read_write (Course document storage)</li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Denied Actions */}
                <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 space-y-2">
                  <span className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    Explicitly Denied Actions (RBAC DENY):
                  </span>
                  <ul className="text-slate-700 dark:text-slate-300 space-y-1.5 font-mono text-[11px] list-disc list-inside">
                    {selectedRole === 'student' && (
                      <>
                        <li>portal:grades:write (DENIED 403 Forbidden)</li>
                        <li>portal:database:direct_connect (DENIED 403 No port route)</li>
                        <li>portal:roster:export (DENIED Privacy violation)</li>
                      </>
                    )}
                    {selectedRole === 'faculty' && (
                      <>
                        <li>cloud:iam:* (DENIED Cannot modify cloud infrastructure)</li>
                        <li>cloud:db:drop_table (DENIED Database administrative action)</li>
                      </>
                    )}
                    {selectedRole === 'admin' && (
                      <>
                        <li>portal:grades:write (DENIED Separation of duty enforcement)</li>
                        <li>cloud:db:public_ip_assign (DENIED Architecturally disabled)</li>
                      </>
                    )}
                    {selectedRole === 'workload' && (
                      <>
                        <li>cloud:iam:create_user (DENIED No privilege escalation)</li>
                        <li>internet:0.0.0.0:egress (DENIED Outbound route restricted)</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. FEDERATION SECTION */}
        {activeIdentityTab === 'federation' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">University Identity Provider (IdP) ↔ Cloud IAM Federation</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Cryptographic assertion exchange via SAML 2.0 and OpenID Connect (OIDC).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 space-y-2">
                <span className="text-[10px] text-purple-700 dark:text-purple-300 font-bold uppercase">STEP 1: ON-PREMISES AUTH</span>
                <h4 className="font-bold text-slate-900 dark:text-white font-sans text-xs">University IdP (Shibboleth)</h4>
                <p className="text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                  Student or faculty enters credentials at campus Active Directory portal (172.16.5.10). No passwords leave the university boundary.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 space-y-2">
                <span className="text-[10px] text-blue-700 dark:text-blue-300 font-bold uppercase">STEP 2: SIGNED ASSERTION</span>
                <h4 className="font-bold text-slate-900 dark:text-white font-sans text-xs">Cryptographic Token (SAML 2.0)</h4>
                <p className="text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                  IdP issues an XML SAML assertion signed with X.509 private certificate containing student ID, role claim, and expiration timestamp.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-2">
                <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold uppercase">STEP 3: CLOUD STS SESSION</span>
                <h4 className="font-bold text-slate-900 dark:text-white font-sans text-xs">AWS IAM AssumeRoleWithSAML</h4>
                <p className="text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                  AWS IAM validates IdP signature and generates short-lived STS credentials for the browser with exact role-based permissions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4. SSO SECTION */}
        {activeIdentityTab === 'sso' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Single Sign-On (SSO) Application Directory</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">One campus login grants authenticated access to all university academic and administrative platforms.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">SSO ACTIVE</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">LMS Portal</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">Canvas / Moodle LMS single sign-on.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <Laptop className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">SSO ACTIVE</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Campus ERP</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">Fee payment and staff administration.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <Library className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">SSO ACTIVE</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Digital Library</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">IEEE Xplore and research journals.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">SSO ACTIVE</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Authorized Services</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">Hostel, transport &amp; alumni portals.</p>
              </div>
            </div>
          </div>
        )}

        {/* 5. MFA SECTION */}
        {activeIdentityTab === 'mfa' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Multi-Factor Authentication (MFA) Enforcement Policy</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Step-up authentication required for privileged operations and faculty grade publishing.</p>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 font-semibold">
                MFA Enforced Globally
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white">TOTP Authenticator Apps</span>
                <p className="text-slate-600 dark:text-slate-400">Google Authenticator, Microsoft Authenticator, or FreeOTP generating 30-second rotating 6-digit codes.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white">FIDO2 Hardware Keys</span>
                <p className="text-slate-600 dark:text-slate-400">YubiKey physical security keys required for institutional cloud console administrators to defeat phishing.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white">Risk-Based Step-Up Trigger</span>
                <p className="text-slate-600 dark:text-slate-400">Step-up MFA prompted when users sign in from an unknown ASN, anomalous IP, or publish semester final grades.</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

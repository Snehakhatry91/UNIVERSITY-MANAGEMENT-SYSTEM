import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  Laptop, 
  Building2, 
  BookOpen, 
  Key, 
  Shield, 
  Bell, 
  Calendar, 
  CreditCard, 
  FileText, 
  Activity, 
  Server, 
  Database, 
  RefreshCw, 
  Layers, 
  Lock, 
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUniversityData } from '../../context/UniversityDataContext';
import { RbacDenialModal } from '../common/RbacDenialModal';
import { RbacEvaluationResult } from '../../types/auth';

type AdminTab =
  | 'dashboard'
  | 'users'
  | 'students'
  | 'faculty'
  | 'departments'
  | 'courses'
  | 'roles'
  | 'permissions'
  | 'notices'
  | 'exams'
  | 'finance'
  | 'audit'
  | 'security'
  | 'monitoring'
  | 'infrastructure'
  | 'backup'
  | 'dr';

export const AdminWorkspace: React.FC<{ onOpenArchitecture?: () => void }> = ({ onOpenArchitecture }) => {
  const { currentUser, logout, switchDemoUser } = useAuth();
  const {
    users,
    courses,
    notices,
    auditLogs,
    addUser,
    updateUserStatus,
    createNotice,
    createCourse,
    executeProtectedAction
  } = useUniversityData();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // RBAC Denial Modal state
  const [rbacModalOpen, setRbacModalOpen] = useState(false);
  const [rbacResult, setRbacResult] = useState<RbacEvaluationResult | null>(null);
  const [actionAttempted, setActionAttempted] = useState('');

  // User provisioning form
  const [newUsername, setNewUsername] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'STUDENT' | 'FACULTY' | 'ADMINISTRATOR'>('STUDENT');
  const [newDept] = useState('Computer Science & Engineering');
  const [userSuccessMsg, setUserSuccessMsg] = useState<string | null>(null);

  // Notice creation form
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'ALL' | 'URGENT' | 'ACADEMIC' | 'EXAMINATION' | 'EVENT'>('ALL');
  const [noticePriority, setNoticePriority] = useState<'HIGH' | 'NORMAL'>('NORMAL');
  const [noticeSuccess, setNoticeSuccess] = useState<string | null>(null);

  // New course form
  const [courseCode, setCourseCode] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCredits, setCourseCredits] = useState(4);
  const [courseRoom] = useState('Hall 302, Academic Block 2');
  const [courseSuccess, setCourseSuccess] = useState<string | null>(null);

  // Disaster recovery simulation
  const [drSimulating, setDrSimulating] = useState(false);
  const [drStatus, setDrStatus] = useState<string | null>(null);

  // CRITICAL SECURITY DEMONSTRATION:
  // Application Admin != AWS Root
  // Even an Administrator CANNOT directly access the private database over Port 5432
  const handleSimulateAdminDirectDbAccess = () => {
    if (!currentUser) return;
    setActionAttempted('Admin attempts direct TCP connection to RDS PostgreSQL (Port 5432)');
    const res = executeProtectedAction('DIRECT_DATABASE_ACCESS', 'db:direct_query', currentUser);
    setRbacResult({
      allowed: res.allowed,
      reason: res.reason,
      requiredPermission: 'db:direct_query',
      userRole: currentUser.role,
      timestamp: res.timestamp
    });
    setRbacModalOpen(true);
  };

  const handleSimulateAdminManageUsers = () => {
    if (!currentUser) return;
    setActionAttempted('Admin provisions new campus user (users:create)');
    const res = executeProtectedAction('PROVISION_USER', 'users:create', currentUser);
    alert(`Action Allowed: ${res.reason}`);
  };

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newFullName || !newEmail) return;
    const res = addUser({
      username: newUsername,
      fullName: newFullName,
      email: newEmail,
      role: newRole,
      department: newDept,
      isMfaEnabled: newRole === 'ADMINISTRATOR' || newRole === 'FACULTY',
      accountStatus: 'ACTIVE',
      lastLogin: 'Never'
    });
    setUserSuccessMsg(res.message);
    setNewUsername('');
    setNewFullName('');
    setNewEmail('');
    setTimeout(() => setUserSuccessMsg(null), 3000);
  };

  const handleCreateNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeContent) return;
    createNotice({
      title: noticeTitle,
      content: noticeContent,
      category: noticeCategory,
      priority: noticePriority,
      author: 'Office of the Registrar',
      authorRole: 'University Administrator'
    });
    setNoticeSuccess('Notice published across university portals.');
    setNoticeTitle('');
    setNoticeContent('');
    setTimeout(() => setNoticeSuccess(null), 3000);
  };

  const handleCreateCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode || !courseTitle) return;
    createCourse({
      id: courseCode,
      code: courseCode,
      title: courseTitle,
      department: 'Computer Science & Engineering',
      credits: courseCredits,
      semester: 6,
      leadFacultyId: 'CVGU-FAC-108',
      leadFacultyName: 'Dr. Arindam Mukherjee',
      schedule: 'Mon, Wed 10:00 - 11:30 AM',
      room: courseRoom,
      enrolledStudentsCount: 0
    });
    setCourseSuccess(`Course [${courseCode}] added to catalog.`);
    setCourseCode('');
    setCourseTitle('');
    setTimeout(() => setCourseSuccess(null), 3000);
  };

  const handleTriggerDrFailover = () => {
    setDrSimulating(true);
    setDrStatus('Simulating Multi-AZ automatic failover: Primary RDS in ap-south-1a unresponsive. Promoting synchronous standby in ap-south-1b...');
    setTimeout(() => {
      setDrStatus('DNS CNAME switch complete. Standby in ap-south-1b promoted to Primary. RTO: 32 seconds. Zero data loss (RPO = 0).');
      setDrSimulating(false);
    }, 2500);
  };

  return (
    <div className="flex h-screen w-screen bg-[#F5F9FF] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-200">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
        {/* Brand Banner */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#8B5CF6] flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <h2 className="text-xs font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
              C. V. RAMAN GLOBAL UNIVERSITY
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F5F3FF] text-[#6D28D9] border border-purple-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800/40 font-semibold">
                Admin Console
              </span>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-3 mx-2 my-2 rounded-xl bg-[#F8FAFC] dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#F5F3FF] dark:bg-rose-500/20 border border-purple-300 dark:border-rose-400/30 flex items-center justify-center font-bold text-[#6D28D9] dark:text-rose-300 text-xs font-mono">
            AD
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Prof. S. K. Mohapatra</p>
            <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">admin.registrar</p>
          </div>
        </div>

        {/* Nav Links (17 Modules) */}
        <nav className="flex-1 px-2 py-1 space-y-0.5 overflow-y-auto text-xs">
          {[
            { id: 'dashboard', label: 'Admin Dashboard', icon: <Layers className="w-4 h-4" /> },
            { id: 'users', label: 'User Directory & IAM', icon: <Users className="w-4 h-4" /> },
            { id: 'students', label: 'Student Management', icon: <GraduationCap className="w-4 h-4" /> },
            { id: 'faculty', label: 'Faculty Management', icon: <Laptop className="w-4 h-4" /> },
            { id: 'departments', label: 'Department Directory', icon: <Building2 className="w-4 h-4" /> },
            { id: 'courses', label: 'Course Curriculum', icon: <BookOpen className="w-4 h-4" /> },
            { id: 'roles', label: 'Role Management', icon: <Key className="w-4 h-4" /> },
            { id: 'permissions', label: 'Permissions Matrix', icon: <Shield className="w-4 h-4" /> },
            { id: 'notices', label: 'Notice Board Publisher', icon: <Bell className="w-4 h-4" /> },
            { id: 'exams', label: 'Examination Controller', icon: <Calendar className="w-4 h-4" /> },
            { id: 'finance', label: 'Finance & Payments', icon: <CreditCard className="w-4 h-4" /> },
            { id: 'audit', label: 'Audit Logs (CloudTrail)', icon: <FileText className="w-4 h-4" /> },
            { id: 'security', label: 'Security & SIEM Dashboard', icon: <ShieldCheck className="w-4 h-4" /> },
            { id: 'monitoring', label: 'CloudWatch Observability', icon: <Activity className="w-4 h-4" /> },
            { id: 'infrastructure', label: 'Multi-AZ Infrastructure', icon: <Server className="w-4 h-4" /> },
            { id: 'backup', label: 'Backup & Snapshots', icon: <Database className="w-4 h-4" /> },
            { id: 'dr', label: 'Disaster Recovery Drill', icon: <RefreshCw className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition text-left ${
                activeTab === tab.id
                  ? 'bg-[#F5F3FF] text-[#6D28D9] font-semibold border border-purple-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {tab.icon}
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Quick Role Switcher */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2 bg-[#F8FAFC] dark:bg-slate-950/40">
          <div className="text-[10px] font-mono uppercase text-slate-500">Quick Role Switch:</div>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
            <button
              onClick={() => switchDemoUser('STUDENT')}
              className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#1D4ED8] dark:text-sky-300 text-center transition font-semibold"
            >
              Student
            </button>
            <button
              onClick={() => switchDemoUser('FACULTY')}
              className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#B45309] dark:text-amber-300 text-center transition font-semibold"
            >
              Faculty
            </button>
          </div>
          <button
            onClick={logout}
            className="w-full py-1.5 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/50 text-[#B91C1C] dark:text-rose-300 text-xs font-semibold border border-rose-200 dark:border-rose-800/30 transition text-center"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white capitalize">
              {activeTab.replace(/([A-Z])/g, ' $1')}
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F5F3FF] text-[#6D28D9] border border-purple-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-500/30 font-medium">
              Role: ADMINISTRATOR (Application Admin ≠ AWS Root)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenArchitecture && (
              <button
                onClick={onOpenArchitecture}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EFF6FF] hover:bg-blue-100 border border-blue-200 text-[#1D4ED8] dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:border-rose-500/30 dark:text-rose-400 text-xs font-semibold transition"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Open Cloud CAD Architecture</span>
              </button>
            )}

            {/* Test Security Boundary: Admin Direct DB Access Attempt */}
            <button
              onClick={handleSimulateAdminDirectDbAccess}
              title="Demonstrates that Application Admin cannot access RDS database directly over port 5432"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-[#B91C1C] border border-rose-200 text-xs font-semibold transition shadow-xs"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Direct DB Deny (Port 5432)</span>
            </button>
          </div>
        </header>

        {/* Dynamic Workspace Body */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Educational Security Rule Banner */}
          <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900 p-4 rounded-2xl border border-rose-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider">
                  Mandatory Architecture Boundary: Application Admin ≠ AWS Root
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  University application administrators have broad campus domain control (managing students, courses, notices), but are strictly isolated from AWS infrastructure root credentials. Private databases in isolated subnets cannot be queried directly over port 5432 by any human user.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleSimulateAdminManageUsers}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono transition"
              >
                Manage Users (Allowed)
              </button>
            </div>
          </div>

          {/* 1. ADMIN DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                  <span className="text-xs text-slate-400 font-medium">Provisioned Users</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold text-white font-mono">{users.length}</span>
                    <span className="text-xs text-emerald-400 font-mono">Synchronized</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">CVGU Active Directory</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                  <span className="text-xs text-slate-400 font-medium">Cloud Infrastructure Health</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-extrabold text-emerald-400 font-mono">100% HEALTHY</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Multi-AZ (ap-south-1a/b)</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                  <span className="text-xs text-slate-400 font-medium">Site-to-Site IPSec VPN</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-extrabold text-cyan-400 font-mono">ACTIVE (UP)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Tunnel 1: 172.16.0.0/16</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                  <span className="text-xs text-slate-400 font-medium">Audit Events (24h)</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold text-purple-400 font-mono">{auditLogs.length}</span>
                    <span className="text-xs text-slate-400 font-mono">Logged</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">CloudTrail + VPC Flow</p>
                </div>
              </div>

              {/* Infrastructure Summary Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white tracking-wide">Multi-AZ High Availability Fleet</h3>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="text-white font-bold">App Server 1 (EC2 c6i.xlarge)</span>
                        <p className="text-slate-400">Subnet: Private App AZ-A (10.0.1.0/24) · IP: 10.0.1.45</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        HEALTHY (ALB Target)
                      </span>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="text-white font-bold">App Server 2 (EC2 c6i.xlarge)</span>
                        <p className="text-slate-400">Subnet: Private App AZ-B (10.0.2.0/24) · IP: 10.0.2.78</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        HEALTHY (ALB Target)
                      </span>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="text-white font-bold">RDS PostgreSQL (db.r6g.2xlarge Multi-AZ)</span>
                        <p className="text-slate-400">Subnets: 10.0.10.0/24 & 10.0.11.0/24 · Synchronous Standby Active</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                        PRIMARY + STANDBY
                      </span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white tracking-wide">Security Posture (AWS WAF & Shield)</h3>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">WAF WebACL:</span>
                        <span className="text-emerald-400 font-bold">CVGU-Production-WAF-ACL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">DDoS Shield:</span>
                        <span className="text-cyan-400">AWS Shield Standard Enabled</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">SQLi / XSS Rules:</span>
                        <span className="text-emerald-400">AWSManagedRulesCommonRuleSet</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Rate Limiting:</span>
                        <span className="text-slate-200">2,000 req / 5 min per IP</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 max-w-3xl space-y-4">
                <h3 className="text-base font-bold text-white">Provision New University User (IdP Sync)</h3>
                <form onSubmit={handleCreateUserSubmit} className="space-y-4 text-xs font-mono">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-400 block mb-1">Username / ID:</label>
                      <input
                        type="text"
                        required
                        value={newUsername}
                        onChange={e => setNewUsername(e.target.value)}
                        placeholder="e.g. 2024cse101 or prof.dash"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Full Legal Name:</label>
                      <input
                        type="text"
                        required
                        value={newFullName}
                        onChange={e => setNewFullName(e.target.value)}
                        placeholder="e.g. Dr. Priyadarshi Dash"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-400 block mb-1">University Email:</label>
                      <input
                        type="email"
                        required
                        value={newEmail}
                        onChange={e => setNewEmail(e.target.value)}
                        placeholder="priyadarshi.dash@cvrgu.edu.in"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Role:</label>
                      <select
                        value={newRole}
                        onChange={e => setNewRole(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
                      >
                        <option value="STUDENT">STUDENT</option>
                        <option value="FACULTY">FACULTY</option>
                        <option value="ADMINISTRATOR">ADMINISTRATOR</option>
                      </select>
                    </div>
                  </div>

                  {userSuccessMsg && (
                    <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 rounded-xl">
                      {userSuccessMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold transition"
                  >
                    Provision Identity & Trigger SAML Sync
                  </button>
                </form>
              </div>

              {/* Users Table */}
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white">Active University Directory Users</h3>
                <table className="w-full text-xs font-mono text-left border-collapse">
                  <thead className="bg-slate-950 text-slate-400">
                    <tr>
                      <th className="p-2.5">Username</th>
                      <th className="p-2.5">Full Name</th>
                      <th className="p-2.5">Email</th>
                      <th className="p-2.5">Role</th>
                      <th className="p-2.5">MFA</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {users.map(u => (
                      <tr key={u.id}>
                        <td className="p-2.5 font-bold text-cyan-400">{u.username}</td>
                        <td className="p-2.5 font-bold text-white">{u.fullName}</td>
                        <td className="p-2.5 text-slate-400">{u.email}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            u.role === 'ADMINISTRATOR' ? 'bg-rose-950 text-rose-300' : u.role === 'FACULTY' ? 'bg-amber-950 text-amber-300' : 'bg-sky-950 text-sky-300'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-2.5 text-emerald-400">{u.isMfaEnabled ? 'ENFORCED' : 'OPTIONAL'}</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px]">
                            {u.accountStatus}
                          </span>
                        </td>
                        <td className="p-2.5">
                          <button
                            onClick={() => updateUserStatus(u.id, u.accountStatus === 'ACTIVE' ? 'LOCKED' : 'ACTIVE')}
                            className="text-xs text-amber-400 hover:underline"
                          >
                            {u.accountStatus === 'ACTIVE' ? 'Lock' : 'Unlock'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. STUDENT MANAGEMENT */}
          {activeTab === 'students' && (
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white">Master Student Directory</h3>
              <table className="w-full text-xs font-mono text-left border-collapse">
                <thead className="bg-slate-950 text-slate-400">
                  <tr>
                    <th className="p-2.5">Roll Number</th>
                    <th className="p-2.5">Student Name</th>
                    <th className="p-2.5">Department</th>
                    <th className="p-2.5">Semester</th>
                    <th className="p-2.5">CGPA</th>
                    <th className="p-2.5">Attendance</th>
                    <th className="p-2.5">Dues</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="p-2.5 font-bold text-cyan-400">CVGU2023CSE042</td>
                    <td className="p-2.5 font-bold text-white">Rohan Sharma</td>
                    <td className="p-2.5">CSE</td>
                    <td className="p-2.5">6th</td>
                    <td className="p-2.5 text-emerald-400">8.84</td>
                    <td className="p-2.5 text-emerald-400">88.5%</td>
                    <td className="p-2.5 text-slate-400">₹0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* 4. FACULTY MANAGEMENT */}
          {activeTab === 'faculty' && (
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white">Faculty Directory & Workload</h3>
              <table className="w-full text-xs font-mono text-left border-collapse">
                <thead className="bg-slate-950 text-slate-400">
                  <tr>
                    <th className="p-2.5">Faculty ID</th>
                    <th className="p-2.5">Name</th>
                    <th className="p-2.5">Designation</th>
                    <th className="p-2.5">Department</th>
                    <th className="p-2.5">Assigned Courses</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="p-2.5 font-bold text-amber-400">CVGU-FAC-108</td>
                    <td className="p-2.5 font-bold text-white">Dr. Arindam Mukherjee</td>
                    <td className="p-2.5">Professor & Head of Cloud Lab</td>
                    <td className="p-2.5">CSE</td>
                    <td className="p-2.5 text-cyan-400">CS301, CS304</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* 5. DEPARTMENT MANAGEMENT */}
          {activeTab === 'departments' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Computer Science & Engineering', code: 'CSE', hod: 'Dr. Arindam Mukherjee', faculty: 48, students: 720 },
                { name: 'Electronics & Communication Eng.', code: 'ECE', hod: 'Dr. S. K. Dash', faculty: 34, students: 480 },
                { name: 'Mechanical Engineering', code: 'ME', hod: 'Dr. P. R. Mishra', faculty: 28, students: 360 },
                { name: 'Civil Engineering', code: 'CE', hod: 'Dr. N. C. Nayak', faculty: 22, students: 280 }
              ].map(d => (
                <div key={d.code} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300">
                      {d.code}
                    </span>
                    <span className="text-xs font-mono text-cyan-400">{d.students} Students</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{d.name}</h4>
                  <p className="text-xs text-slate-400">Head of Department: {d.hod}</p>
                  <p className="text-xs font-mono text-slate-500 pt-2 border-t border-slate-800">
                    Faculty Count: {d.faculty} professors
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* 6. COURSE MANAGEMENT */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 max-w-2xl space-y-4">
                <h3 className="text-base font-bold text-white">Add Curriculum Course</h3>
                <form onSubmit={handleCreateCourseSubmit} className="space-y-4 text-xs font-mono">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-400 block mb-1">Course Code:</label>
                      <input
                        type="text"
                        required
                        value={courseCode}
                        onChange={e => setCourseCode(e.target.value)}
                        placeholder="e.g. CS305"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Credits:</label>
                      <input
                        type="number"
                        value={courseCredits}
                        onChange={e => setCourseCredits(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Course Title:</label>
                    <input
                      type="text"
                      required
                      value={courseTitle}
                      onChange={e => setCourseTitle(e.target.value)}
                      placeholder="e.g. Distributed Consensus & Raft Protocols"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>

                  {courseSuccess && (
                    <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 rounded-xl">
                      {courseSuccess}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold transition"
                  >
                    Add Course to Curriculum
                  </button>
                </form>
              </div>

              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white">Curriculum Courses Catalog</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {courses.map(c => (
                    <div key={c.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs font-mono">
                      <div>
                        <span className="text-rose-400 font-bold">{c.code}</span>
                        <p className="text-white font-semibold mt-0.5">{c.title}</p>
                      </div>
                      <span className="text-slate-400">{c.credits} Credits</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 7. ROLE MANAGEMENT */}
          {activeTab === 'roles' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'STUDENT', desc: 'Enrolled undergraduate or postgraduate student. Access restricted to own grades, attendance, LMS, and submissions.', count: 4800 },
                { name: 'FACULTY', desc: 'Academic professors and laboratory instructors. Access scoped to assigned courses, attendance registers, and grade submission with MFA.', count: 320 },
                { name: 'ADMINISTRATOR', desc: 'University domain registrar and cloud operators. System configuration, user provisioning, and audit reporting. (Isolated from AWS root).', count: 12 }
              ].map(r => (
                <div key={r.name} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300">
                      {r.name}
                    </span>
                    <span className="text-xs font-mono text-cyan-400">{r.count} Identities</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* 8. PERMISSIONS MATRIX */}
          {activeTab === 'permissions' && (
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white">Granular Least-Privilege Entitlements Matrix (21 Permissions)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                {[
                  { id: 'student:view_records', desc: 'View own student profile and academic results', roles: ['STUDENT', 'FACULTY', 'ADMIN'] },
                  { id: 'assignments:submit', desc: 'Upload assignment solution to S3 with KMS encryption', roles: ['STUDENT'] },
                  { id: 'marks:modify', desc: 'Modify student marks (Requires Step-Up MFA)', roles: ['FACULTY'] },
                  { id: 'users:create', desc: 'Provision campus identities in Active Directory', roles: ['ADMIN'] },
                  { id: 'roles:modify', desc: 'Alter RBAC role bindings and security policies', roles: ['ADMIN'] },
                  { id: 'db:direct_query', desc: 'Direct TCP query to RDS PostgreSQL (Port 5432)', roles: ['NONE (DENIED TO ALL HUMAN USERS)'] }
                ].map(p => (
                  <div key={p.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold text-white">{p.id}</span>
                      <span className="text-rose-400 text-[10px]">{p.roles.join(', ')}</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. NOTICE MANAGEMENT */}
          {activeTab === 'notices' && (
            <div className="space-y-6">
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 max-w-2xl space-y-4">
                <h3 className="text-base font-bold text-white">Publish Official Notice</h3>
                <form onSubmit={handleCreateNoticeSubmit} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="text-slate-400 block mb-1">Notice Title:</label>
                    <input
                      type="text"
                      required
                      value={noticeTitle}
                      onChange={e => setNoticeTitle(e.target.value)}
                      placeholder="Title of circular..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Content:</label>
                    <textarea
                      required
                      rows={3}
                      value={noticeContent}
                      onChange={e => setNoticeContent(e.target.value)}
                      placeholder="Body of the announcement..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-400 block mb-1">Category:</label>
                      <select
                        value={noticeCategory}
                        onChange={e => setNoticeCategory(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
                      >
                        <option value="ALL">ALL</option>
                        <option value="URGENT">URGENT</option>
                        <option value="ACADEMIC">ACADEMIC</option>
                        <option value="EXAMINATION">EXAMINATION</option>
                        <option value="EVENT">EVENT</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Priority:</label>
                      <select
                        value={noticePriority}
                        onChange={e => setNoticePriority(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
                      >
                        <option value="NORMAL">NORMAL</option>
                        <option value="HIGH">HIGH</option>
                      </select>
                    </div>
                  </div>

                  {noticeSuccess && (
                    <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 rounded-xl">
                      {noticeSuccess}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold transition"
                  >
                    Broadcast University Notice
                  </button>
                </form>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white">Active Notices</h3>
                {notices.map(n => (
                  <div key={n.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                    <div className="flex justify-between font-mono">
                      <span className="font-bold text-rose-400">[{n.category}] {n.title}</span>
                      <span className="text-slate-500">{n.publishDate}</span>
                    </div>
                    <p className="text-slate-300">{n.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. EXAMINATION MANAGEMENT */}
          {activeTab === 'exams' && (
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 max-w-2xl space-y-4 text-xs font-mono">
              <h3 className="text-base font-bold text-white">Examination Controller Operations</h3>
              <p className="text-slate-400">
                Trigger automated background batch jobs for semester examinations and hall ticket generation.
              </p>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white">Mid-Semester Hall Ticket Generation Batch Job</p>
                    <p className="text-slate-400">Generates 4,800 PDF admit cards with dynamic QR verification.</p>
                  </div>
                  <button
                    onClick={() => alert('Batch job queued to AWS SQS (cvgu-hallticket-generation-queue). Workers processing.')}
                    className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold transition"
                  >
                    Queue SQS Batch Job
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 11. FINANCE & PAYMENTS */}
          {activeTab === 'finance' && (
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white">University Fee Collections & Revenue Ledger</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Tuition Collected:</span>
                  <p className="text-xl font-bold text-emerald-400 mt-1">₹4,08,00,000</p>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Hostel & Mess:</span>
                  <p className="text-xl font-bold text-cyan-400 mt-1">₹2,16,00,000</p>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Pending Dues:</span>
                  <p className="text-xl font-bold text-amber-400 mt-1">₹14,50,000</p>
                </div>
              </div>
            </div>
          )}

          {/* 12. AUDIT LOGS (CLOUDTRAIL) */}
          {activeTab === 'audit' && (
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-white">Immutable Security Audit Logs (AWS CloudTrail Format)</h3>
                  <p className="text-xs text-slate-400 font-mono">Streamed from AWS CloudTrail & VPC Flow Logs</p>
                </div>
                <span className="text-xs font-mono text-cyan-400">Real-Time Security Feed</span>
              </div>

              <div className="space-y-3">
                {auditLogs.map(log => (
                  <div key={log.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          log.status === 'ALLOW' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                        }`}>
                          {log.status}
                        </span>
                        <span className="font-bold text-white">{log.action}</span>
                      </div>
                      <span className="text-slate-500">{log.timestamp}</span>
                    </div>

                    <div className="text-slate-400 text-[11px] grid grid-cols-1 md:grid-cols-2 gap-1 pt-1 border-t border-slate-800/80">
                      <div>Principal: <strong className="text-cyan-400">{log.actor}</strong> ({log.role})</div>
                      <div>Source IP: <strong className="text-slate-300">{log.ipAddress}</strong></div>
                      <div className="col-span-2 truncate">Resource: <strong className="text-slate-300">{log.resource}</strong></div>
                    </div>

                    <p className="text-slate-400 italic text-[11px]">Reason: {log.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 13. SECURITY & SIEM DASHBOARD */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800">
                  <span className="text-slate-400">WAF Blocked Requests</span>
                  <div className="text-2xl font-bold text-rose-400 mt-2">1,482</div>
                  <p className="text-[11px] text-slate-500 mt-1">SQLi, XSS, Bad Bots</p>
                </div>
                <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800">
                  <span className="text-slate-400">Failed MFA Challenges</span>
                  <div className="text-2xl font-bold text-amber-400 mt-2">7</div>
                  <p className="text-[11px] text-slate-500 mt-1">Brute-force lockout active</p>
                </div>
                <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800">
                  <span className="text-slate-400">RBAC Unauthorized Attempts</span>
                  <div className="text-2xl font-bold text-purple-400 mt-2">14</div>
                  <p className="text-[11px] text-slate-500 mt-1">Access denied at API Gateway</p>
                </div>
              </div>
            </div>
          )}

          {/* 14. MONITORING (CLOUDWATCH) */}
          {activeTab === 'monitoring' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs">
                  <span className="text-slate-400 font-bold">EC2 Fleet Average CPU Utilization</span>
                  <div className="text-3xl font-bold text-emerald-400">22.4%</div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-emerald-400 h-full w-[22%]" />
                  </div>
                  <p className="text-slate-500 text-[11px]">Alarm Threshold: &gt; 75% for 3 consecutive 1m periods</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs">
                  <span className="text-slate-400 font-bold">ALB Response Latency</span>
                  <div className="text-3xl font-bold text-cyan-400">18.2 ms</div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-cyan-400 h-full w-[18%]" />
                  </div>
                  <p className="text-slate-500 text-[11px]">Target: &lt; 50 ms p95 response time</p>
                </div>
              </div>
            </div>
          )}

          {/* 15. INFRASTRUCTURE OVERVIEW */}
          {activeTab === 'infrastructure' && (
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4 font-mono text-xs">
              <h3 className="text-sm font-bold text-white">VPC Topology & Subnet IP Addressing</h3>
              <div className="space-y-2">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                  <span className="text-slate-300">Public Subnet AZ-A:</span>
                  <span className="text-cyan-400">10.0.0.0/24 (ALB, NAT Gateway)</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                  <span className="text-slate-300">Private App Subnet AZ-A:</span>
                  <span className="text-emerald-400">10.0.1.0/24 (App Server 1)</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                  <span className="text-slate-300">Private App Subnet AZ-B:</span>
                  <span className="text-emerald-400">10.0.2.0/24 (App Server 2)</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                  <span className="text-slate-300">Isolated Database Subnets:</span>
                  <span className="text-purple-400">10.0.10.0/24 & 10.0.11.0/24 (RDS PostgreSQL)</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                  <span className="text-slate-300">On-Premises Data Center:</span>
                  <span className="text-amber-400">172.16.0.0/16 (Active Directory, Legacy ERP)</span>
                </div>
              </div>
            </div>
          )}

          {/* 16. BACKUP & RECOVERY */}
          {activeTab === 'backup' && (
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 max-w-2xl space-y-4 font-mono text-xs">
              <h3 className="text-base font-bold text-white">Automated RDS Snapshots & S3 Backups</h3>
              <p className="text-slate-400">
                Continuous point-in-time recovery (PITR) with daily full snapshots retained for 35 days in encrypted S3 bucket.
              </p>
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-300">Latest Snapshot:</span>
                  <span className="text-emerald-400">cvgu-rds-snap-2026-09-28-0000-auto</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Encryption Key:</span>
                  <span className="text-cyan-400">KMS arn:aws:kms:ap-south-1:.../key/cvgu-rds</span>
                </div>
              </div>
            </div>
          )}

          {/* 17. DISASTER RECOVERY DRILL */}
          {activeTab === 'dr' && (
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 max-w-2xl space-y-5 font-mono text-xs">
              <div>
                <h3 className="text-base font-bold text-white">Disaster Recovery (DR) Simulation Drill</h3>
                <p className="text-slate-400 mt-1">
                  Test Multi-AZ failover resiliency and Recovery Time Objective (RTO) under simulated availability zone disruption.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Recovery Point Objective (RPO):</span>
                  <span className="text-emerald-400 font-bold">&lt; 5 seconds (Synchronous)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Recovery Time Objective (RTO):</span>
                  <span className="text-emerald-400 font-bold">&lt; 60 seconds (Auto CNAME Failover)</span>
                </div>
              </div>

              {drStatus && (
                <div className="p-3.5 bg-sky-950/60 border border-sky-500/40 text-sky-200 rounded-xl leading-relaxed">
                  {drStatus}
                </div>
              )}

              <button
                onClick={handleTriggerDrFailover}
                disabled={drSimulating}
                className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold transition flex items-center gap-2"
              >
                {drSimulating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Executing Failover Drill...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Trigger Multi-AZ RDS Failover Drill</span>
                  </>
                )}
              </button>
            </div>
          )}

        </main>
      </div>

      {/* RBAC Denial Modal */}
      <RbacDenialModal
        isOpen={rbacModalOpen}
        onClose={() => setRbacModalOpen(false)}
        result={rbacResult}
        actionAttempted={actionAttempted}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  FileText, 
  Calendar, 
  CheckCircle, 
  CreditCard, 
  Library, 
  Home, 
  Bell, 
  MessageSquare, 
  Users, 
  HelpCircle, 
  Award, 
  Layers, 
  Clock, 
  Search, 
  Download, 
  Upload, 
  Send,
  Printer,
  ShieldAlert,
  Sparkles,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUniversityData } from '../../context/UniversityDataContext';
import { RbacDenialModal } from '../common/RbacDenialModal';
import { RequestFlowModal } from '../common/RequestFlowModal';
import { RbacEvaluationResult } from '../../types/auth';

type StudentTab = 
  | 'dashboard'
  | 'profile'
  | 'courses'
  | 'lms'
  | 'assignments'
  | 'attendance'
  | 'timetable'
  | 'registration'
  | 'examinations'
  | 'hallticket'
  | 'results'
  | 'fees'
  | 'library'
  | 'hostel'
  | 'notices'
  | 'notifications'
  | 'forum'
  | 'mentoring'
  | 'helpdesk'
  | 'events'
  | 'services';

export const StudentWorkspace: React.FC<{ onOpenArchitecture?: () => void }> = ({ onOpenArchitecture }) => {
  const { currentUser, logout, switchDemoUser } = useAuth();
  const {
    studentProfile,
    courses,
    attendance,
    assignments,
    submissions,
    examSchedule,
    hallTicket,
    semesterResults,
    notices,
    payments,
    libraryBooks,
    issuedBooks,
    hostelDetails,
    mentoringSessions,
    helpdeskTickets,
    discussionPosts,
    notifications,
    submitAssignment,
    registerElectiveCourse,
    payFees,
    borrowBook,
    raiseTicket,
    postDiscussion,
    markNotificationRead,
    executeProtectedAction
  } = useUniversityData();

  const [activeTab, setActiveTab] = useState<StudentTab>('dashboard');
  
  // Modals & form state
  const [rbacModalOpen, setRbacModalOpen] = useState(false);
  const [rbacResult, setRbacResult] = useState<RbacEvaluationResult | null>(null);
  const [actionAttempted, setActionAttempted] = useState('');
  const [isFlowModalOpen, setIsFlowModalOpen] = useState(false);

  // Assignment submission modal
  const [selectedAsgId, setSelectedAsgId] = useState<string | null>(null);
  const [submissionFileName, setSubmissionFileName] = useState('');
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);

  // Fee payment modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [payFeeType, setPayFeeType] = useState<'TUITION' | 'HOSTEL'>('TUITION');
  const [payAmount, setPayAmount] = useState(45000);
  const [payReceipt, setPayReceipt] = useState<string | null>(null);

  // Ticket creation
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketCategory, setTicketCategory] = useState<'ACADEMIC' | 'HOSTEL' | 'EXAM' | 'WIFI_IT' | 'FINANCE'>('ACADEMIC');
  const [ticketSuccess, setTicketSuccess] = useState<string | null>(null);

  // Discussion state
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');

  // Library search
  const [librarySearch, setLibrarySearch] = useState('');

  // Elective registration status
  const [electiveMsg, setElectiveMsg] = useState<string | null>(null);

  // Trigger simulated RBAC denials
  const handleSimulateUnauthorizedMarksModify = () => {
    if (!currentUser) return;
    setActionAttempted('Student attempts to modify semester grades (marks:modify)');
    const res = executeProtectedAction('UNAUTHORIZED_MARKS_MODIFY', 'marks:modify', currentUser);
    setRbacResult({
      allowed: res.allowed,
      reason: res.reason,
      requiredPermission: 'marks:modify',
      userRole: currentUser.role,
      timestamp: res.timestamp
    });
    setRbacModalOpen(true);
  };

  const handleSimulateScopeViolation = () => {
    if (!currentUser) return;
    setActionAttempted('Access another student private financial ledger (usr-student-99)');
    const res = executeProtectedAction(
      'RESOURCE_ISOLATION_CHECK',
      'student:view_records',
      currentUser,
      'usr-student-99' // another student
    );
    setRbacResult({
      allowed: res.allowed,
      reason: res.reason,
      requiredPermission: 'student:view_records',
      userRole: currentUser.role,
      timestamp: res.timestamp
    });
    setRbacModalOpen(true);
  };

  const handleSimulateDirectDbAccess = () => {
    if (!currentUser) return;
    setActionAttempted('Direct database query over Port 5432 to PostgreSQL (db:direct_query)');
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

  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsgId || !submissionFileName) return;
    const res = submitAssignment(
      selectedAsgId,
      submissionFileName,
      '2.8 MB',
      studentProfile.studentId,
      studentProfile.fullName
    );
    setSubmitSuccessMsg(res.message);
    setTimeout(() => {
      setSelectedAsgId(null);
      setSubmissionFileName('');
      setSubmitSuccessMsg(null);
    }, 2000);
  };

  const handleFeePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const res = payFees(payFeeType, payAmount, 'UPI');
    setPayReceipt(res.receiptNumber);
    setTimeout(() => {
      setPaymentModalOpen(false);
      setPayReceipt(null);
    }, 2500);
  };

  const handleRaiseTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDesc) return;
    const res = raiseTicket({
      userId: currentUser?.id || 'usr-student-01',
      userName: studentProfile.fullName,
      role: 'STUDENT',
      category: ticketCategory,
      subject: ticketSubject,
      description: ticketDesc,
      priority: 'MEDIUM'
    });
    setTicketSuccess(`Support ticket created with ID: ${res.ticketId}`);
    setTicketSubject('');
    setTicketDesc('');
    setTimeout(() => setTicketSuccess(null), 3500);
  };

  const handleDiscussionPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postContent) return;
    postDiscussion('CS301', postTitle, postContent, studentProfile.fullName, 'Student');
    setPostTitle('');
    setPostContent('');
  };

  const filteredBooks = libraryBooks.filter(b => 
    b.title.toLowerCase().includes(librarySearch.toLowerCase()) || 
    b.author.toLowerCase().includes(librarySearch.toLowerCase()) ||
    b.category.toLowerCase().includes(librarySearch.toLowerCase())
  );

  return (
    <div className="flex h-screen w-screen bg-[#F5F9FF] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-200">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
        {/* Brand Banner */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <h2 className="text-xs font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
              C. V. RAMAN GLOBAL UNIVERSITY
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#EFF6FF] text-[#1D4ED8] border border-blue-200 dark:bg-sky-950 dark:text-sky-400 dark:border-sky-800/40 font-semibold">
                Student Portal
              </span>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-3 mx-2 my-2 rounded-xl bg-[#F8FAFC] dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#EFF6FF] dark:bg-sky-500/20 border border-blue-300 dark:border-sky-400/30 flex items-center justify-center font-bold text-[#1D4ED8] dark:text-sky-300 text-xs font-mono">
            RS
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{studentProfile.fullName}</p>
            <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">{studentProfile.studentId}</p>
          </div>
        </div>

        {/* Nav Links (21 Modules) */}
        <nav className="flex-1 px-2 py-1 space-y-0.5 overflow-y-auto text-xs">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <Layers className="w-4 h-4" /> },
            { id: 'profile', label: 'My Profile', icon: <Users className="w-4 h-4" /> },
            { id: 'courses', label: 'Enrolled Courses', icon: <BookOpen className="w-4 h-4" /> },
            { id: 'lms', label: 'Learning / LMS', icon: <BookOpen className="w-4 h-4" /> },
            { id: 'assignments', label: 'Assignments', icon: <FileText className="w-4 h-4" /> },
            { id: 'attendance', label: 'Attendance', icon: <CheckCircle className="w-4 h-4" /> },
            { id: 'timetable', label: 'Academic Timetable', icon: <Clock className="w-4 h-4" /> },
            { id: 'registration', label: 'Course Registration', icon: <FileText className="w-4 h-4" /> },
            { id: 'examinations', label: 'Examinations', icon: <Calendar className="w-4 h-4" /> },
            { id: 'hallticket', label: 'Hall Ticket / Admit Card', icon: <Award className="w-4 h-4" /> },
            { id: 'results', label: 'Semester Results', icon: <Award className="w-4 h-4" /> },
            { id: 'fees', label: 'Fees & Payments', icon: <CreditCard className="w-4 h-4" /> },
            { id: 'library', label: 'Library / OPAC', icon: <Library className="w-4 h-4" /> },
            { id: 'hostel', label: 'Hostel Details', icon: <Home className="w-4 h-4" /> },
            { id: 'notices', label: 'Digital Notices', icon: <Bell className="w-4 h-4" /> },
            { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
            { id: 'forum', label: 'Discussion Forum', icon: <MessageSquare className="w-4 h-4" /> },
            { id: 'mentoring', label: 'Mentoring Sessions', icon: <Users className="w-4 h-4" /> },
            { id: 'helpdesk', label: 'Helpdesk & Support', icon: <HelpCircle className="w-4 h-4" /> },
            { id: 'events', label: 'Events & Webinars', icon: <Calendar className="w-4 h-4" /> },
            { id: 'services', label: 'Student Services', icon: <FileText className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as StudentTab)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition text-left ${
                activeTab === tab.id
                  ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold border border-blue-200 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {tab.icon}
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Role Switcher & Bottom Controls */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2 bg-[#F8FAFC] dark:bg-slate-950/40">
          <div className="text-[10px] font-mono uppercase text-slate-500">Quick Role Switch:</div>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
            <button
              onClick={() => switchDemoUser('FACULTY')}
              className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#B45309] dark:text-amber-300 text-center transition font-semibold"
            >
              Faculty
            </button>
            <button
              onClick={() => switchDemoUser('ADMINISTRATOR')}
              className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#6D28D9] dark:text-rose-300 text-center transition font-semibold"
            >
              Admin
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
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ECFDF5] text-[#047857] border border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-500/30 font-medium">
              Role: STUDENT (Least Privilege)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Trace Live Request Flow Button */}
            <button
              onClick={() => setIsFlowModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-mono font-bold transition shadow-xs active:scale-95"
            >
              <Activity className="w-3.5 h-3.5 fill-current" />
              <span>Trace Request: Student → RDS</span>
            </button>

            {onOpenArchitecture && (
              <button
                onClick={onOpenArchitecture}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EFF6FF] hover:bg-blue-100 border border-blue-200 text-[#1D4ED8] dark:bg-sky-500/10 dark:hover:bg-sky-500/20 dark:border-sky-500/30 dark:text-sky-400 text-xs font-semibold transition"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Open Cloud CAD Architecture</span>
              </button>
            )}
            
            {/* Direct Attack Simulators */}
            <button
              onClick={handleSimulateUnauthorizedMarksModify}
              title="Test RBAC Violation: Student attempts to modify marks"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/70 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold transition shadow-sm"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Test RBAC Deny</span>
            </button>
          </div>
        </header>

        {/* Dynamic Workspace Body */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* RBAC Educational Demonstration Banner */}
          <div className="bg-gradient-to-r from-sky-950/70 via-slate-900 to-slate-900 p-4 rounded-2xl border border-sky-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold text-sky-300 uppercase tracking-wider">
                  Interactive RBAC Authorization Engine Active
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Every request passes through the API Gateway authorization middleware checking authenticated identity, verified role, permissions, and resource multi-tenancy bounds.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleSimulateScopeViolation}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono transition"
              >
                Test Scope Boundary
              </button>
              <button
                onClick={handleSimulateDirectDbAccess}
                className="px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-mono transition"
              >
                Direct DB Query (Port 5432)
              </button>
            </div>
          </div>

          {/* 1. DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                  <span className="text-xs text-slate-400 font-medium">Cumulative Grade (CGPA)</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold text-white font-mono">{studentProfile.cgpa}</span>
                    <span className="text-xs text-emerald-400 font-semibold font-mono">/ 10.00</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Semester 5 SGPA: 8.92</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                  <span className="text-xs text-slate-400 font-medium">Overall Attendance</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold text-cyan-400 font-mono">{studentProfile.attendanceOverall}%</span>
                    <span className="text-xs text-emerald-400 font-mono">Eligible</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Required Threshold: 75%</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                  <span className="text-xs text-slate-400 font-medium">Pending Assignments</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold text-amber-400 font-mono">1</span>
                    <span className="text-xs text-slate-400 font-mono">Due Oct 05</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">CS301: VPC Architecture</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                  <span className="text-xs text-slate-400 font-medium">Pending University Dues</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold text-emerald-400 font-mono">₹{studentProfile.pendingFees}</span>
                    <span className="text-xs text-emerald-400 font-mono">Cleared</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">All semester fees paid</p>
                </div>
              </div>

              {/* Next Class & Quick Notices */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white tracking-wide">Today's Academic Schedule</h3>
                    <span className="text-xs font-mono text-cyan-400">Wednesday</span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">CS301: Cloud Computing & Distributed Systems</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/40">
                            Hall 302
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">Dr. Arindam Mukherjee · 10:00 - 11:30 AM</p>
                      </div>
                      <span className="text-xs font-mono text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30">
                        Attended (33/36)
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">CS304: Cloud Architecture & DevOps Lab</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800/40">
                            Lab 4, Block 3
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">Dr. Arindam Mukherjee · 02:00 - 05:00 PM</p>
                      </div>
                      <span className="text-xs font-mono text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30">
                        Upcoming Today
                      </span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white tracking-wide">Urgent Campus Circulars</h3>
                    <button onClick={() => setActiveTab('notices')} className="text-xs text-cyan-400 hover:underline">
                      View All
                    </button>
                  </div>

                  <div className="space-y-3">
                    {notices.slice(0, 2).map(n => (
                      <div key={n.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/40">
                            {n.category}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">{n.publishDate}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-200">{n.title}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{n.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 max-w-4xl space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-sky-600 flex items-center justify-center text-xl font-bold text-slate-950 font-mono shadow-lg shadow-cyan-500/20">
                  RS
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{studentProfile.fullName}</h3>
                  <p className="text-xs font-mono text-cyan-400 mt-0.5">Roll Number: {studentProfile.studentId}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{studentProfile.program}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-500">Current Semester & Batch:</span>
                  <p className="text-slate-200 font-bold">Semester {studentProfile.currentSemester} ({studentProfile.batch})</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-500">Department:</span>
                  <p className="text-slate-200 font-bold">{studentProfile.department}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-500">Faculty Mentor:</span>
                  <p className="text-slate-200 font-bold">{studentProfile.mentorName} ({studentProfile.mentorEmail})</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-500">Hostel Allocation:</span>
                  <p className="text-slate-200 font-bold">{studentProfile.hostelBlock}, Room {studentProfile.roomNumber}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-500">Registered Phone:</span>
                  <p className="text-slate-200 font-bold">{studentProfile.contactNumber}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-500">Cloud Directory Identity ARN:</span>
                  <p className="text-cyan-400 font-bold truncate">arn:aws:iam::123456789012:user/rohan.sharma</p>
                </div>
              </div>
            </div>
          )}

          {/* 3. COURSES TAB */}
          {activeTab === 'courses' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map(course => (
                <div key={course.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/40">
                      {course.code}
                    </span>
                    <span className="text-xs font-mono text-emerald-400">{course.credits} Credits</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{course.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">Lead: {course.leadFacultyName}</p>
                  </div>
                  <div className="text-xs font-mono text-slate-400 pt-2 border-t border-slate-800 space-y-1">
                    <p>🕒 {course.schedule}</p>
                    <p>📍 {course.room}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4. LEARNING / LMS TAB */}
          {activeTab === 'lms' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">Course LMS & Digital Learning Modules</h3>
                <span className="text-xs font-mono text-cyan-400">AWS S3 Encrypted Assets</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-sky-400" />
                    <h4 className="text-sm font-bold text-white">Module 3: Multi-AZ High Availability</h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    Comprehensive study material on Amazon RDS Multi-AZ synchronous standby replication, ALB cross-zone routing, and fault domains.
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-xs font-mono text-slate-500">PDF · 4.8 MB</span>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 text-xs font-mono hover:bg-sky-500/30 transition">
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white">Lab Manual: IPSec VPN & BGP Peering</h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    Step-by-step laboratory instructions for establishing secure tunnels between on-premises Cisco ASA routers and AWS Virtual Private Gateway.
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-xs font-mono text-slate-500">PDF · 2.1 MB</span>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-mono hover:bg-emerald-500/30 transition">
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. ASSIGNMENTS TAB */}
          {activeTab === 'assignments' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">Course Assignments & Submissions</h3>
                <span className="text-xs font-mono text-slate-400">Total: {assignments.length}</span>
              </div>

              <div className="space-y-4">
                {assignments.map(asg => {
                  const sub = submissions.find(s => s.assignmentId === asg.id && s.studentId === studentProfile.studentId);
                  return (
                    <div key={asg.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/40">
                            {asg.courseId}
                          </span>
                          <h4 className="text-sm font-bold text-white mt-1">{asg.title}</h4>
                        </div>
                        <span className="text-xs font-mono text-amber-400">Max Marks: {asg.maxMarks}</span>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed">{asg.description}</p>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800 text-xs font-mono">
                        <span className="text-slate-500">Due Date: {asg.dueDate}</span>
                        {sub ? (
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
                              Status: {sub.status} {sub.marksObtained !== undefined ? `(${sub.marksObtained}/${asg.maxMarks})` : ''}
                            </span>
                            {sub.feedback && (
                              <span className="text-slate-400 italic">"{sub.feedback}"</span>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedAsgId(asg.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition"
                          >
                            <Upload className="w-3.5 h-3.5" /> Submit Assignment
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Assignment Submission Modal */}
              {selectedAsgId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                  <div className="w-full max-w-md bg-slate-900 border border-sky-500/40 rounded-2xl p-6 space-y-4">
                    <h3 className="text-base font-bold text-white">Upload Assignment Solution</h3>
                    <p className="text-xs text-slate-400">
                      File will be encrypted with AWS KMS and stored in a private multi-region S3 bucket.
                    </p>

                    <form onSubmit={handleAssignmentSubmit} className="space-y-4">
                      <div>
                        <label className="text-xs font-mono text-slate-400 block mb-1">
                          File Name or Archive:
                        </label>
                        <input
                          type="text"
                          required
                          value={submissionFileName}
                          onChange={e => setSubmissionFileName(e.target.value)}
                          placeholder="CVGU2023CSE042_Assignment.pdf"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100"
                        />
                      </div>

                      {submitSuccessMsg && (
                        <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs rounded-lg">
                          {submitSuccessMsg}
                        </div>
                      )}

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setSelectedAsgId(null)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold"
                        >
                          Confirm & Encrypt Upload
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 6. ATTENDANCE TAB */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attendance.map(att => (
                  <div key={att.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/40">
                        {att.courseId}
                      </span>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        att.percentage >= 85 ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                      }`}>
                        {att.percentage}%
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">{att.courseTitle}</h4>

                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div
                        className="bg-cyan-500 h-full rounded-full transition-all"
                        style={{ width: `${att.percentage}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-xs font-mono text-slate-400 pt-1">
                      <span>Attended: {att.attendedClasses} / {att.totalClasses} classes</span>
                      <span>Status: {att.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. TIMETABLE TAB */}
          {activeTab === 'timetable' && (
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4 overflow-x-auto">
              <h3 className="text-sm font-bold text-white">Spring 2026 Academic Timetable</h3>
              <table className="w-full text-xs text-left border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3">Day</th>
                    <th className="py-2.5 px-3">10:00 - 11:30 AM</th>
                    <th className="py-2.5 px-3">11:30 AM - 01:00 PM</th>
                    <th className="py-2.5 px-3">02:00 - 03:30 PM</th>
                    <th className="py-2.5 px-3">03:30 - 05:00 PM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-3 px-3 font-bold text-white">Monday</td>
                    <td className="py-3 px-3 bg-sky-950/20 text-sky-300">CS301 (Hall 302)</td>
                    <td className="py-3 px-3 bg-emerald-950/20 text-emerald-300">CS303 (Hall 305)</td>
                    <td className="py-3 px-3 text-slate-500">-</td>
                    <td className="py-3 px-3 text-slate-500">-</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-white">Tuesday</td>
                    <td className="py-3 px-3 text-slate-500">-</td>
                    <td className="py-3 px-3 text-slate-500">-</td>
                    <td className="py-3 px-3 bg-purple-950/20 text-purple-300">CS302 (Hall 204)</td>
                    <td className="py-3 px-3 text-slate-500">Tutorial</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-white">Wednesday</td>
                    <td className="py-3 px-3 bg-sky-950/20 text-sky-300">CS301 (Hall 302)</td>
                    <td className="py-3 px-3 text-slate-500">-</td>
                    <td colSpan={2} className="py-3 px-3 bg-cyan-950/30 text-cyan-300 text-center font-bold">
                      CS304: Cloud Architecture & DevOps Lab (Lab 4, Block 3)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-white">Thursday</td>
                    <td className="py-3 px-3 text-slate-500">-</td>
                    <td className="py-3 px-3 text-slate-500">-</td>
                    <td className="py-3 px-3 bg-purple-950/20 text-purple-300">CS302 (Hall 204)</td>
                    <td className="py-3 px-3 text-slate-500">-</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-white">Friday</td>
                    <td className="py-3 px-3 text-slate-500">-</td>
                    <td className="py-3 px-3 bg-emerald-950/20 text-emerald-300">CS303 (Hall 305)</td>
                    <td className="py-3 px-3 text-slate-500">Mentoring</td>
                    <td className="py-3 px-3 text-slate-500">Seminar</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* 8. COURSE REGISTRATION TAB */}
          {activeTab === 'registration' && (
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white">Autumn 2026 Elective Course Registration</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Select advanced departmental electives. Prerequisites validated against database records.
                </p>
              </div>

              {electiveMsg && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl font-mono">
                  {electiveMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">CS411: Kubernetes & Container Orchestration</span>
                    <span className="text-cyan-400">4 Credits</span>
                  </div>
                  <p className="text-slate-400">Deep-dive into EKS, ingress controllers, Helm charts, and service meshes.</p>
                  <button
                    onClick={() => {
                      const res = registerElectiveCourse('CS411', studentProfile.studentId);
                      setElectiveMsg(res.message);
                    }}
                    className="mt-2 w-full py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition"
                  >
                    Register for Course
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">CS415: Zero-Trust Security & DevSecOps</span>
                    <span className="text-cyan-400">4 Credits</span>
                  </div>
                  <p className="text-slate-400">Identity federation, dynamic IAM roles, KMS key hierarchies, and CI/CD security.</p>
                  <button
                    onClick={() => {
                      const res = registerElectiveCourse('CS415', studentProfile.studentId);
                      setElectiveMsg(res.message);
                    }}
                    className="mt-2 w-full py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition"
                  >
                    Register for Course
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 9. EXAMINATIONS TAB */}
          {activeTab === 'examinations' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">Official Mid-Semester Examination Schedule</h3>
                <span className="text-xs font-mono text-cyan-400">Venue: CVGU Bhubaneswar</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {examSchedule.map(ex => (
                  <div key={ex.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/40">
                      {ex.courseCode}
                    </span>
                    <h4 className="text-sm font-bold text-white">{ex.courseTitle}</h4>
                    <div className="text-xs font-mono text-slate-400 space-y-1 pt-2 border-t border-slate-800">
                      <p>📅 {ex.date}</p>
                      <p>⏰ {ex.time}</p>
                      <p>📍 {ex.venue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. HALL TICKET TAB */}
          {activeTab === 'hallticket' && (
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 max-w-3xl space-y-6">
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-white">C. V. RAMAN GLOBAL UNIVERSITY</h3>
                  <p className="text-xs text-slate-400">Mid-Semester Examination Hall Ticket · Spring 2026</p>
                  <p className="text-xs font-mono text-cyan-400 mt-1">Admit Card: {hallTicket.ticketNumber}</p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Admit Card
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>Candidate: <strong className="text-white">{hallTicket.studentName}</strong></div>
                <div>Roll No: <strong className="text-white">{hallTicket.studentId}</strong></div>
                <div>Reporting Time: <strong className="text-amber-400">{hallTicket.reportingTime}</strong></div>
                <div>Center: <strong className="text-slate-300">Bidyanagar, Janla, Bhubaneswar</strong></div>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-xs font-mono text-left">
                  <thead className="bg-slate-950 text-slate-400">
                    <tr>
                      <th className="p-2.5">Code</th>
                      <th className="p-2.5">Course Title</th>
                      <th className="p-2.5">Exam Date</th>
                      <th className="p-2.5">Session</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {hallTicket.courses.map(c => (
                      <tr key={c.code}>
                        <td className="p-2.5 font-bold text-sky-400">{c.code}</td>
                        <td className="p-2.5">{c.title}</td>
                        <td className="p-2.5">{c.date}</td>
                        <td className="p-2.5">{c.session}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <p className="font-bold text-slate-300 font-mono">Instructions to Candidate:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  {hallTicket.instructions.map((inst, idx) => (
                    <li key={idx}>{inst}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* 11. RESULTS TAB */}
          {activeTab === 'results' && (
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 max-w-4xl space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Semester 5 Grade Sheet</h3>
                  <p className="text-xs text-slate-400 font-mono">Published: {semesterResults.publishedDate}</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
                    SGPA: {semesterResults.sgpa}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-sky-950 text-sky-300 border border-sky-500/30 font-bold">
                    CGPA: {semesterResults.cgpa}
                  </span>
                </div>
              </div>

              <table className="w-full text-xs font-mono text-left border-collapse">
                <thead className="bg-slate-950 text-slate-400">
                  <tr>
                    <th className="p-2.5">Code</th>
                    <th className="p-2.5">Subject</th>
                    <th className="p-2.5">Credits</th>
                    <th className="p-2.5">Internal</th>
                    <th className="p-2.5">External</th>
                    <th className="p-2.5">Total</th>
                    <th className="p-2.5">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {semesterResults.subjects.map(s => (
                    <tr key={s.code}>
                      <td className="p-2.5 font-bold text-sky-400">{s.code}</td>
                      <td className="p-2.5">{s.title}</td>
                      <td className="p-2.5">{s.credits}</td>
                      <td className="p-2.5">{s.internalMarks}</td>
                      <td className="p-2.5">{s.externalMarks}</td>
                      <td className="p-2.5 font-bold text-white">{s.totalMarks}</td>
                      <td className="p-2.5 font-bold text-emerald-400">{s.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 12. FEES TAB */}
          {activeTab === 'fees' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-white">University Fee Ledger & Payment Portal</h3>
                  <p className="text-xs text-slate-400">Online payment through secured payment gateway</p>
                </div>
                <button
                  onClick={() => setPaymentModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition"
                >
                  <CreditCard className="w-4 h-4" /> Make Online Payment
                </button>
              </div>

              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">Payment Receipts</h4>
                <div className="space-y-3">
                  {payments.map(p => (
                    <div key={p.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs font-mono">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{p.feeType} FEE</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                            {p.status}
                          </span>
                        </div>
                        <p className="text-slate-400 mt-1">Receipt: {p.receiptNumber} · TXN: {p.transactionRef}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-white">₹{p.amount.toLocaleString('en-IN')}</span>
                        <p className="text-[10px] text-slate-500">{p.paymentDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Modal */}
              {paymentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                  <div className="w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 space-y-4">
                    <h3 className="text-base font-bold text-white">Pay University Fees Online</h3>
                    <form onSubmit={handleFeePayment} className="space-y-4">
                      <div>
                        <label className="text-xs font-mono text-slate-400 block mb-1">Fee Category:</label>
                        <select
                          value={payFeeType}
                          onChange={e => setPayFeeType(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100"
                        >
                          <option value="TUITION">Tuition Fees (₹85,000)</option>
                          <option value="HOSTEL">Hostel & Mess Fees (₹45,000)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-mono text-slate-400 block mb-1">Amount (₹):</label>
                        <input
                          type="number"
                          value={payAmount}
                          onChange={e => setPayAmount(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100"
                        />
                      </div>

                      {payReceipt && (
                        <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs rounded-lg font-mono">
                          Payment Successful! Receipt Generated: {payReceipt}
                        </div>
                      )}

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setPaymentModalOpen(false)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
                        >
                          Confirm & Authorize Payment
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 13. LIBRARY TAB */}
          {activeTab === 'library' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h3 className="text-sm font-bold text-white">Central Library Online Public Access Catalog (OPAC)</h3>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={librarySearch}
                    onChange={e => setLibrarySearch(e.target.value)}
                    placeholder="Search books, authors..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredBooks.map(b => (
                  <div key={b.isbn} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/40">
                        {b.category}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1.5">{b.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{b.author}</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono">
                      <div className="flex justify-between text-slate-400">
                        <span>Shelf Location:</span>
                        <span className="text-slate-200">{b.shelfLocation}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Available Copies:</span>
                        <span className="text-emerald-400 font-bold">{b.availableCopies} / {b.totalCopies}</span>
                      </div>
                      <button
                        onClick={() => borrowBook(b.isbn, studentProfile.studentId)}
                        disabled={b.availableCopies <= 0}
                        className="w-full py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-bold border border-sky-500/30 transition text-xs"
                      >
                        Borrow / Reserve
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Currently Borrowed Books */}
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">My Borrowed Books (RFID Tagged)</h4>
                {issuedBooks.map(ib => (
                  <div key={ib.transactionId} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs font-mono">
                    <div>
                      <p className="font-bold text-white">{ib.bookTitle}</p>
                      <p className="text-slate-400">Issued: {ib.issueDate} · Due Date: <span className="text-amber-400">{ib.dueDate}</span></p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
                      {ib.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 14. HOSTEL TAB */}
          {activeTab === 'hostel' && (
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 max-w-2xl space-y-4">
              <h3 className="text-base font-bold text-white">Campus Hostel & Mess Allocation</h3>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Residence Block:</span>
                  <p className="text-white font-bold mt-1">{hostelDetails.block}</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Room Number:</span>
                  <p className="text-white font-bold mt-1">{hostelDetails.roomNumber}</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Hostel Warden:</span>
                  <p className="text-white font-bold mt-1">{hostelDetails.wardenName} ({hostelDetails.wardenContact})</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Mess Preference:</span>
                  <p className="text-emerald-400 font-bold mt-1">{hostelDetails.messType}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
                <span className="text-slate-400 block mb-1">Assigned Roommates:</span>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  {hostelDetails.roommates.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* 15. NOTICES TAB */}
          {activeTab === 'notices' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">University Official Notice Board</h3>
              <div className="space-y-3">
                {notices.map(n => (
                  <div key={n.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/40 font-bold">
                        {n.category}
                      </span>
                      <span className="text-xs font-mono text-slate-500">{n.publishDate}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{n.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{n.content}</p>
                    <p className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                      Published by: {n.author} ({n.authorRole})
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 16. NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 max-w-2xl space-y-3">
              <h3 className="text-sm font-bold text-white">System Notifications</h3>
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex justify-between items-start ${
                    notif.read ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-950 border-sky-500/40 text-slate-200'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold">{notif.title}</p>
                    <p className="text-xs">{notif.message}</p>
                    <span className="text-[10px] font-mono text-slate-500">{notif.timestamp}</span>
                  </div>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse mt-1" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 17. FORUM TAB */}
          {activeTab === 'forum' && (
            <div className="space-y-6">
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">Post Academic Question to Forum</h4>
                <form onSubmit={handleDiscussionPost} className="space-y-3">
                  <input
                    type="text"
                    required
                    value={postTitle}
                    onChange={e => setPostTitle(e.target.value)}
                    placeholder="Question Subject..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100"
                  />
                  <textarea
                    required
                    rows={3}
                    value={postContent}
                    onChange={e => setPostContent(e.target.value)}
                    placeholder="Describe your question or doubt..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition"
                  >
                    <Send className="w-3.5 h-3.5" /> Post to Course Forum
                  </button>
                </form>
              </div>

              <div className="space-y-4">
                {discussionPosts.map(post => (
                  <div key={post.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-sky-400 font-bold">{post.courseTitle}</span>
                      <span className="text-slate-500">{post.createdAt}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{post.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{post.content}</p>
                    <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
                      <span>Author: {post.authorName} ({post.authorRole})</span>
                      <span>Replies: {post.replyCount}</span>
                      <span>Likes: {post.likes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 18. MENTORING TAB */}
          {activeTab === 'mentoring' && (
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 max-w-2xl space-y-4">
              <h3 className="text-base font-bold text-white">Faculty Mentoring Record</h3>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Mentor:</span>
                  <span className="text-cyan-400 font-bold">{studentProfile.mentorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mentor Email:</span>
                  <span className="text-slate-200">{studentProfile.mentorEmail}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">Past Mentoring Sessions</h4>
                {mentoringSessions.map(ms => (
                  <div key={ms.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between font-mono text-slate-400">
                      <span>Date: {ms.date}</span>
                      <span className="text-emerald-400 font-bold">{ms.status}</span>
                    </div>
                    <p className="text-slate-200"><strong>Notes:</strong> {ms.discussionNotes}</p>
                    <p className="text-amber-300"><strong>Action Items:</strong> {ms.actionItems}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 19. HELPDESK TAB */}
          {activeTab === 'helpdesk' && (
            <div className="space-y-6">
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 max-w-2xl space-y-4">
                <h3 className="text-base font-bold text-white">Raise Campus Helpdesk & Support Grievance</h3>
                <form onSubmit={handleRaiseTicket} className="space-y-4">
                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-1">Issue Category:</label>
                    <select
                      value={ticketCategory}
                      onChange={e => setTicketCategory(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100"
                    >
                      <option value="ACADEMIC">Academic / Syllabus</option>
                      <option value="WIFI_IT">Campus Wi-Fi / IT / Network</option>
                      <option value="HOSTEL">Hostel & Infrastructure</option>
                      <option value="EXAM">Examinations & Admit Card</option>
                      <option value="FINANCE">Fee Payments & Accounts</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-1">Subject / Summary:</label>
                    <input
                      type="text"
                      required
                      value={ticketSubject}
                      onChange={e => setTicketSubject(e.target.value)}
                      placeholder="Brief description of the problem..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-1">Detailed Description:</label>
                    <textarea
                      required
                      rows={3}
                      value={ticketDesc}
                      onChange={e => setTicketDesc(e.target.value)}
                      placeholder="Provide full details, locations, and error messages..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
                    />
                  </div>

                  {ticketSuccess && (
                    <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl font-mono">
                      {ticketSuccess}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition"
                  >
                    Submit Support Ticket
                  </button>
                </form>
              </div>

              {/* My Tickets */}
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 max-w-2xl space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">My Active Tickets</h4>
                {helpdeskTickets.map(t => (
                  <div key={t.ticketId} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                    <div className="flex justify-between items-center font-mono">
                      <span className="font-bold text-white">{t.ticketId} · [{t.category}]</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.status === 'RESOLVED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                    <p className="text-slate-200 font-semibold">{t.subject}</p>
                    <p className="text-slate-400 text-[11px]">{t.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 20. EVENTS TAB */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Upcoming Campus Conferences & Technical Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/40">
                    IEEE Conference
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    NC-HCZTA 2026: National Conference on Hybrid Cloud & Zero-Trust Architectures
                  </h4>
                  <p className="text-xs text-slate-400">
                    Organized by Dept. of CSE in collaboration with AWS India. Keynotes on Multi-AZ VPC resilience and Post-Quantum cryptography.
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs font-mono">
                    <span className="text-slate-400">Nov 12-14, 2026</span>
                    <button className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 font-bold transition">
                      Register Delegate
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/40">
                    Cloud Hackathon
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    CVGU 36-Hour Serverless & Edge Computing Hackathon
                  </h4>
                  <p className="text-xs text-slate-400">
                    Build resilient event-driven architectures using AWS Lambda, DynamoDB Global Tables, and CloudFront Functions.
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs font-mono">
                    <span className="text-slate-400">Dec 05-07, 2026</span>
                    <button className="px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 font-bold transition">
                      Register Team
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 21. SERVICES TAB */}
          {activeTab === 'services' && (
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 max-w-2xl space-y-4">
              <h3 className="text-base font-bold text-white">Digital Student Certificate Services</h3>
              <p className="text-xs text-slate-400">
                Instantly request digitally signed academic certificates backed by cryptographic verification.
              </p>
              <div className="space-y-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white">Bonafide Certificate</p>
                    <p className="text-slate-400">For passport, visa, or educational loan processing.</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition">
                    Request Copy
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white">Consolidated Grade Transcript</p>
                    <p className="text-slate-400">Official transcripts for higher studies (Semesters 1-5).</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition">
                    Request Transcript
                  </button>
                </div>
              </div>
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

      {/* 10-Stage Student to RDS Request Flow Modal */}
      <RequestFlowModal
        isOpen={isFlowModalOpen}
        onClose={() => setIsFlowModalOpen(false)}
      />
    </div>
  );
};

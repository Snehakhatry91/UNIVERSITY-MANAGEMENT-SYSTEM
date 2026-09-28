import React, { useState } from 'react';
import { 
  Laptop, 
  BookOpen, 
  Users, 
  CheckCircle, 
  Award, 
  FileText, 
  Upload, 
  Clock, 
  Bell, 
  MessageSquare, 
  Briefcase, 
  HelpCircle, 
  KeyRound, 
  Layers, 
  ShieldAlert, 
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useUniversityData } from '../../context/UniversityDataContext';
import { RbacDenialModal } from '../common/RbacDenialModal';
import { StepUpMfaModal } from '../common/StepUpMfaModal';
import { RbacEvaluationResult } from '../../types/auth';

type FacultyTab =
  | 'dashboard'
  | 'profile'
  | 'courses'
  | 'students'
  | 'attendance'
  | 'marks'
  | 'assignments'
  | 'evaluations'
  | 'materials'
  | 'timetable'
  | 'notices'
  | 'mentoring'
  | 'forum'
  | 'services'
  | 'helpdesk'
  | 'security';

export const FacultyWorkspace: React.FC<{ onOpenArchitecture?: () => void }> = ({ onOpenArchitecture }) => {
  const navigate = useNavigate();
  const { currentUser, logout, switchDemoUser } = useAuth();
  const {
    facultyProfile,
    courses,
    submissions,
    notices,
    discussionPosts,
    markAttendance,
    gradeSubmission,
    createAssignment,
    addCourseMaterial,
    recordMentoringNote,
    executeProtectedAction
  } = useUniversityData();

  const [activeTab, setActiveTab] = useState<FacultyTab>('dashboard');

  // RBAC Denial Modal state
  const [rbacModalOpen, setRbacModalOpen] = useState(false);
  const [rbacResult, setRbacResult] = useState<RbacEvaluationResult | null>(null);
  const [actionAttempted, setActionAttempted] = useState('');

  // Step-Up MFA Modal state
  const [stepUpOpen, setStepUpOpen] = useState(false);
  const [stepUpTitle, setStepUpTitle] = useState('');
  const [pendingEvaluation, setPendingEvaluation] = useState<{ id: string; marks: number; feedback: string } | null>(null);

  // Attendance marking state
  const [selectedCourseForAttendance, setSelectedCourseForAttendance] = useState('CS301');
  const [attendanceSuccess, setAttendanceSuccess] = useState<string | null>(null);

  // New assignment modal / form state
  const [asgTitle, setAsgTitle] = useState('');
  const [asgDesc, setAsgDesc] = useState('');
  const [asgCourse, setAsgCourse] = useState('CS301');
  const [asgDueDate, setAsgDueDate] = useState('2026-10-15 23:59 IST');
  const [asgMaxMarks, setAsgMaxMarks] = useState(50);
  const [asgSuccess, setAsgSuccess] = useState<string | null>(null);

  // Material upload state
  const [matTitle, setMatTitle] = useState('');
  const [matCourse, setMatCourse] = useState('CS301');
  const [matType, setMatType] = useState('pdf');
  const [matSuccess, setMatSuccess] = useState<string | null>(null);

  // Mentoring note state
  const [mentNotes, setMentNotes] = useState('');
  const [mentActions, setMentActions] = useState('');
  const [mentSuccess, setMentSuccess] = useState<string | null>(null);

  // Grade evaluation inputs
  const [evalMarks, setEvalMarks] = useState<Record<string, number>>({});
  const [evalFeedback, setEvalFeedback] = useState<Record<string, string>>({});
  const [evalSuccessMsg, setEvalSuccessMsg] = useState<string | null>(null);

  // Faculty course filter (only assigned courses)
  const assignedCourses = courses.filter(c => facultyProfile.assignedCourses.includes(c.id));

  // Simulate Unauthorized RBAC Action: Faculty attempts to delete roles or provision users
  const handleSimulateUnauthorizedRoleManage = () => {
    if (!currentUser) return;
    setActionAttempted('Faculty attempts to modify university security roles (roles:modify)');
    const res = executeProtectedAction('UNAUTHORIZED_ROLE_MANAGE', 'roles:modify', currentUser);
    setRbacResult({
      allowed: res.allowed,
      reason: res.reason,
      requiredPermission: 'roles:modify',
      userRole: currentUser.role,
      timestamp: res.timestamp
    });
    setRbacModalOpen(true);
  };

  const handleSimulateUnauthorizedUserProvision = () => {
    if (!currentUser) return;
    setActionAttempted('Faculty attempts to provision campus users in IAM directory (users:create)');
    const res = executeProtectedAction('UNAUTHORIZED_USER_PROVISION', 'users:create', currentUser);
    setRbacResult({
      allowed: res.allowed,
      reason: res.reason,
      requiredPermission: 'users:create',
      userRole: currentUser.role,
      timestamp: res.timestamp
    });
    setRbacModalOpen(true);
  };

  const handleAttendanceSubmit = (attended: boolean) => {
    const res = markAttendance(selectedCourseForAttendance, 'CVGU2023CSE042', attended);
    setAttendanceSuccess(res.message);
    setTimeout(() => setAttendanceSuccess(null), 3000);
  };

  const handleTriggerGradeWithMfa = (subId: string) => {
    const marks = evalMarks[subId] !== undefined ? evalMarks[subId] : 45;
    const feedback = evalFeedback[subId] || 'Good performance and modular implementation.';
    setPendingEvaluation({ id: subId, marks, feedback });
    setStepUpTitle(`Post Final Semester Marks: ${marks} pts for [${subId}]`);
    setStepUpOpen(true);
  };

  const handleStepUpSuccess = (totpCode: string) => {
    if (!pendingEvaluation) return;
    const res = gradeSubmission(
      pendingEvaluation.id,
      pendingEvaluation.marks,
      pendingEvaluation.feedback,
      totpCode
    );
    if (res.success) {
      setEvalSuccessMsg(`Grades saved! Step-up MFA authorized with TOTP token.`);
      setTimeout(() => setEvalSuccessMsg(null), 3500);
    }
    setPendingEvaluation(null);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgTitle || !asgDesc) return;
    const course = courses.find(c => c.id === asgCourse);
    const res = createAssignment({
      courseId: asgCourse,
      courseTitle: course ? course.title : 'Course',
      title: asgTitle,
      description: asgDesc,
      dueDate: asgDueDate,
      maxMarks: asgMaxMarks
    });
    setAsgSuccess(res.message);
    setAsgTitle('');
    setAsgDesc('');
    setTimeout(() => setAsgSuccess(null), 3000);
  };

  const handleUploadMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matTitle) return;
    const res = addCourseMaterial(matCourse, matTitle, matType);
    setMatSuccess(res.message);
    setMatTitle('');
    setTimeout(() => setMatSuccess(null), 3000);
  };

  const handleSaveMentoring = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentNotes) return;
    const res = recordMentoringNote('CVGU2023CSE042', mentNotes, mentActions);
    setMentSuccess(res.message);
    setMentNotes('');
    setMentActions('');
    setTimeout(() => setMentSuccess(null), 3000);
  };

  return (
    <div className="flex h-screen w-screen bg-[#F5F9FF] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-200">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
        {/* Brand Banner */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F59E0B] flex items-center justify-center text-white shadow-xs">
            <Laptop className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <h2 className="text-xs font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
              C. V. RAMAN GLOBAL UNIVERSITY
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FEF3C7] text-[#B45309] border border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800/40 font-semibold">
                Faculty Workspace
              </span>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-3 mx-2 my-2 rounded-xl bg-[#F8FAFC] dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#FEF3C7] dark:bg-amber-500/20 border border-amber-300 dark:border-amber-400/30 flex items-center justify-center font-bold text-[#B45309] dark:text-amber-300 text-xs font-mono">
            AM
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-200 truncate">{facultyProfile.fullName}</p>
            <p className="text-[10px] font-mono text-slate-400 truncate">{facultyProfile.facultyId}</p>
          </div>
        </div>

        {/* Nav Links (16 Modules) */}
        <nav className="flex-1 px-2 py-1 space-y-0.5 overflow-y-auto text-xs">
          {[
            { id: 'dashboard', label: 'Faculty Dashboard', icon: <Layers className="w-4 h-4" /> },
            { id: 'profile', label: 'Faculty Profile', icon: <Users className="w-4 h-4" /> },
            { id: 'courses', label: 'My Assigned Courses', icon: <BookOpen className="w-4 h-4" /> },
            { id: 'students', label: 'Enrolled Students', icon: <Users className="w-4 h-4" /> },
            { id: 'attendance', label: 'Mark Attendance', icon: <CheckCircle className="w-4 h-4" /> },
            { id: 'marks', label: 'Marks & Grading (MFA)', icon: <Award className="w-4 h-4" /> },
            { id: 'assignments', label: 'Assignment Manager', icon: <FileText className="w-4 h-4" /> },
            { id: 'evaluations', label: 'Assignment Evaluation', icon: <CheckCircle className="w-4 h-4" /> },
            { id: 'materials', label: 'Course Materials (S3)', icon: <Upload className="w-4 h-4" /> },
            { id: 'timetable', label: 'Teaching Timetable', icon: <Clock className="w-4 h-4" /> },
            { id: 'notices', label: 'Academic Notices', icon: <Bell className="w-4 h-4" /> },
            { id: 'mentoring', label: 'Mentoring Portal', icon: <Users className="w-4 h-4" /> },
            { id: 'forum', label: 'Discussion Forum', icon: <MessageSquare className="w-4 h-4" /> },
            { id: 'services', label: 'Faculty Services', icon: <Briefcase className="w-4 h-4" /> },
            { id: 'helpdesk', label: 'Faculty IT Helpdesk', icon: <HelpCircle className="w-4 h-4" /> },
            { id: 'security', label: 'Step-Up MFA & Auth', icon: <KeyRound className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as FacultyTab)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition text-left ${
                activeTab === tab.id
                  ? 'bg-[#FEF3C7] text-[#B45309] font-semibold border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30'
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
              onClick={() => {
                switchDemoUser('STUDENT');
                navigate('/portal/student');
              }}
              className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#1D4ED8] dark:text-sky-300 text-center transition font-semibold"
            >
              Student
            </button>
            <button
              onClick={() => {
                switchDemoUser('ADMINISTRATOR');
                navigate('/dashboard');
              }}
              className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#6D28D9] dark:text-rose-300 text-center transition font-semibold"
            >
              Admin
            </button>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
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
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FEF3C7] text-[#B45309] border border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-500/30 font-medium">
              Role: FACULTY (Scoped Course Ownership)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenArchitecture && (
              <button
                onClick={onOpenArchitecture}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EFF6FF] hover:bg-blue-100 border border-blue-200 text-[#1D4ED8] dark:bg-amber-500/10 dark:hover:bg-amber-500/20 dark:border-amber-500/30 dark:text-amber-400 text-xs font-semibold transition"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Open Cloud CAD Architecture</span>
              </button>
            )}

            {/* Test RBAC Deny Button */}
            <button
              onClick={handleSimulateUnauthorizedRoleManage}
              title="Test RBAC Violation: Faculty attempts to manage security roles"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-[#B91C1C] border border-rose-200 text-xs font-semibold transition shadow-xs"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Test RBAC Deny</span>
            </button>
          </div>
        </header>

        {/* Dynamic Workspace Body */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Educational Step-Up MFA & Scope Banner */}
          <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 p-4 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                  Least-Privilege Scoped Authorization
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Faculty credentials grant access only to courses explicitly assigned to Dr. Arindam Mukherjee. Modifying final marks triggers elevated step-up MFA verification.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleSimulateUnauthorizedUserProvision}
                className="px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-mono transition"
              >
                Attempt Provision Users
              </button>
            </div>
          </div>

          {/* 1. FACULTY DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                  <span className="text-xs text-slate-400 font-medium">Assigned Courses</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold text-white font-mono">{assignedCourses.length}</span>
                    <span className="text-xs text-amber-400 font-mono font-semibold">Active</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">CS301, CS304</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                  <span className="text-xs text-slate-400 font-medium">Total Enrolled Students</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold text-cyan-400 font-mono">68</span>
                    <span className="text-xs text-slate-400 font-mono">B.Tech CSE</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Section 6-A</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                  <span className="text-xs text-slate-400 font-medium">Pending Submissions to Grade</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold text-amber-400 font-mono">1</span>
                    <span className="text-xs text-slate-400 font-mono">Needs Review</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Assignment 3: VPC Design</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                  <span className="text-xs text-slate-400 font-medium">MFA Security Status</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-extrabold text-emerald-400 font-mono">ENFORCED</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">RFC 6238 TOTP Active</p>
                </div>
              </div>

              {/* Teaching Schedule & Submissions Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white tracking-wide">My Classes Today</h3>
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-white">CS301: Cloud Computing & Distributed Systems</span>
                        <p className="text-xs text-slate-400">Hall 302 · 10:00 - 11:30 AM · Lecture 37</p>
                      </div>
                      <span className="text-xs font-mono text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30">
                        Conducted
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-white">CS304: Cloud Architecture & DevOps Lab</span>
                        <p className="text-xs text-slate-400">Lab 4, Block 3 · 02:00 - 05:00 PM · Practical Session</p>
                      </div>
                      <span className="text-xs font-mono text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30">
                        Upcoming
                      </span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white tracking-wide">Recent Submissions for Evaluation</h3>
                  <div className="space-y-3">
                    {submissions.map(sub => (
                      <div key={sub.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                        <div className="flex justify-between items-center font-mono">
                          <span className="font-bold text-white">{sub.studentName}</span>
                          <span className="text-slate-400">{sub.submissionDate}</span>
                        </div>
                        <p className="text-slate-300 font-mono text-[11px] truncate">{sub.fileName}</p>
                        <div className="flex justify-between items-center pt-2">
                          <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/40 text-[10px] font-mono">
                            {sub.status}
                          </span>
                          <button
                            onClick={() => setActiveTab('evaluations')}
                            className="text-amber-400 hover:underline font-mono text-xs"
                          >
                            Grade & Review →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. FACULTY PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 max-w-4xl space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-xl font-bold text-slate-950 font-mono shadow-lg shadow-amber-500/20">
                  AM
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{facultyProfile.fullName}</h3>
                  <p className="text-xs font-mono text-amber-400 mt-0.5">Faculty ID: {facultyProfile.facultyId}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{facultyProfile.designation}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-500">Department:</span>
                  <p className="text-slate-200 font-bold">{facultyProfile.department}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-500">Cabin & Office:</span>
                  <p className="text-slate-200 font-bold">{facultyProfile.cabinNumber}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-500">Office Hours:</span>
                  <p className="text-slate-200 font-bold">{facultyProfile.officeHours}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-500">Specialization:</span>
                  <p className="text-slate-200 font-bold">{facultyProfile.specialization}</p>
                </div>
              </div>
            </div>
          )}

          {/* 3. ASSIGNED COURSES */}
          {activeTab === 'courses' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">Courses Assigned Under My Instruction</h3>
                <span className="text-xs font-mono text-amber-400">Scoped Course Scope Only</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignedCourses.map(c => (
                  <div key={c.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800/40">
                        {c.code}
                      </span>
                      <span className="text-xs font-mono text-cyan-400">{c.enrolledStudentsCount} Students Enrolled</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{c.title}</h4>
                    <div className="text-xs font-mono text-slate-400 pt-2 border-t border-slate-800 space-y-1">
                      <p>🕒 Schedule: {c.schedule}</p>
                      <p>📍 Room: {c.room}</p>
                      <p>🎓 Credits: {c.credits}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. STUDENTS ROSTER */}
          {activeTab === 'students' && (
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">Enrolled Students in CS301</h3>
                <span className="text-xs font-mono text-slate-400">Section 6-A</span>
              </div>

              <table className="w-full text-xs font-mono text-left border-collapse">
                <thead className="bg-slate-950 text-slate-400">
                  <tr>
                    <th className="p-2.5">Roll Number</th>
                    <th className="p-2.5">Student Name</th>
                    <th className="p-2.5">Program</th>
                    <th className="p-2.5">Attendance</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="p-2.5 font-bold text-cyan-400">CVGU2023CSE042</td>
                    <td className="p-2.5 font-bold text-white">Rohan Sharma</td>
                    <td className="p-2.5">B.Tech CSE</td>
                    <td className="p-2.5 text-emerald-400">91.6% (33/36)</td>
                    <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px]">ELIGIBLE</span></td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-cyan-400">CVGU2023CSE043</td>
                    <td className="p-2.5 font-bold text-white">Soumyajit Sen</td>
                    <td className="p-2.5">B.Tech CSE</td>
                    <td className="p-2.5 text-emerald-400">86.1% (31/36)</td>
                    <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px]">ELIGIBLE</span></td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-cyan-400">CVGU2023CSE044</td>
                    <td className="p-2.5 font-bold text-white">Abhishek Sahu</td>
                    <td className="p-2.5">B.Tech CSE</td>
                    <td className="p-2.5 text-amber-400">77.7% (28/36)</td>
                    <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px]">WARNING</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* 5. MARK ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 max-w-2xl space-y-5">
              <div>
                <h3 className="text-base font-bold text-white">Interactive Attendance Register</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Record daily lecture presence for assigned course classes.
                </p>
              </div>

              {attendanceSuccess && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl font-mono">
                  {attendanceSuccess}
                </div>
              )}

              <div className="space-y-3">
                <label className="text-xs font-mono text-slate-400 block">Select Course:</label>
                <select
                  value={selectedCourseForAttendance}
                  onChange={e => setSelectedCourseForAttendance(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-100"
                >
                  <option value="CS301">CS301: Cloud Computing & Distributed Systems</option>
                  <option value="CS304">CS304: Cloud Architecture & DevOps Lab</option>
                </select>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Rohan Sharma (CVGU2023CSE042)</p>
                  <p className="text-[11px] font-mono text-slate-400">Current Attendance: 91.6%</p>
                </div>
                <div className="flex gap-2 font-mono text-xs">
                  <button
                    onClick={() => handleAttendanceSubmit(true)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold transition"
                  >
                    Mark Present
                  </button>
                  <button
                    onClick={() => handleAttendanceSubmit(false)}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold transition"
                  >
                    Mark Absent
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 6. MARKS & GRADING (WITH STEP-UP MFA) */}
          {activeTab === 'marks' && (
            <div className="space-y-6">
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white">Official Grade Entry & Internal Assessment</h3>
                    <p className="text-xs text-slate-400">
                      Sensitive Operation: Finalizing marks requires <strong>Step-Up MFA Authorization</strong>.
                    </p>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40">
                    Step-Up MFA Protected
                  </span>
                </div>

                {evalSuccessMsg && (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl font-mono">
                    {evalSuccessMsg}
                  </div>
                )}

                <table className="w-full text-xs font-mono text-left border-collapse">
                  <thead className="bg-slate-950 text-slate-400">
                    <tr>
                      <th className="p-2.5">Roll No</th>
                      <th className="p-2.5">Student Name</th>
                      <th className="p-2.5">Course</th>
                      <th className="p-2.5">Internal Marks (Max 30)</th>
                      <th className="p-2.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    <tr>
                      <td className="p-2.5 font-bold text-cyan-400">CVGU2023CSE042</td>
                      <td className="p-2.5 font-bold text-white">Rohan Sharma</td>
                      <td className="p-2.5">CS301</td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          defaultValue={28}
                          className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-center text-white"
                        />
                      </td>
                      <td className="p-2.5">
                        <button
                          onClick={() => handleTriggerGradeWithMfa('sub-01')}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition"
                        >
                          <KeyRound className="w-3.5 h-3.5" /> Commit with MFA
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. ASSIGNMENT MANAGEMENT */}
          {activeTab === 'assignments' && (
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 max-w-2xl space-y-4">
              <h3 className="text-base font-bold text-white">Publish New Assignment</h3>
              <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="text-slate-400 block mb-1">Course:</label>
                  <select
                    value={asgCourse}
                    onChange={e => setAsgCourse(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
                  >
                    <option value="CS301">CS301: Cloud Computing & Distributed Systems</option>
                    <option value="CS304">CS304: Cloud Architecture & DevOps Lab</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Assignment Title:</label>
                  <input
                    type="text"
                    required
                    value={asgTitle}
                    onChange={e => setAsgTitle(e.target.value)}
                    placeholder="e.g. Assignment 4: Auto Scaling & CloudWatch Alarms"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Problem Description & Rubric:</label>
                  <textarea
                    required
                    rows={3}
                    value={asgDesc}
                    onChange={e => setAsgDesc(e.target.value)}
                    placeholder="Provide detailed problem statement, architectural requirements, and submission formats..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Due Date:</label>
                    <input
                      type="text"
                      value={asgDueDate}
                      onChange={e => setAsgDueDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Max Marks:</label>
                    <input
                      type="number"
                      value={asgMaxMarks}
                      onChange={e => setAsgMaxMarks(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                </div>

                {asgSuccess && (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 rounded-xl">
                    {asgSuccess}
                  </div>
                )}

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition"
                >
                  Publish to Student LMS
                </button>
              </form>
            </div>
          )}

          {/* 8. ASSIGNMENT EVALUATIONS */}
          {activeTab === 'evaluations' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Student Assignment Submissions for Review</h3>
              {submissions.map(sub => (
                <div key={sub.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-start text-xs font-mono">
                    <div>
                      <span className="font-bold text-white">{sub.studentName} ({sub.studentId})</span>
                      <p className="text-slate-400 mt-0.5">Submitted: {sub.submissionDate}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-sky-950 text-sky-300 border border-sky-800/40">
                      {sub.status}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs font-mono">
                    <span className="text-cyan-400">📄 {sub.fileName} ({sub.fileSize})</span>
                    <button className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">
                      View Encrypted File
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div>
                      <label className="text-slate-400 block mb-1">Marks (Max 50):</label>
                      <input
                        type="number"
                        defaultValue={sub.marksObtained || 48}
                        onChange={e => setEvalMarks({ ...evalMarks, [sub.id]: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Feedback Comments:</label>
                      <input
                        type="text"
                        defaultValue={sub.feedback || 'Excellent VPC topology diagram.'}
                        onChange={e => setEvalFeedback({ ...evalFeedback, [sub.id]: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => handleTriggerGradeWithMfa(sub.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                    >
                      <KeyRound className="w-3.5 h-3.5" /> Save Evaluation (Requires MFA)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 9. COURSE MATERIALS (S3) */}
          {activeTab === 'materials' && (
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 max-w-2xl space-y-4">
              <h3 className="text-base font-bold text-white">Upload Course Syllabus & Lecture Slides to AWS S3</h3>
              <form onSubmit={handleUploadMaterial} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="text-slate-400 block mb-1">Course:</label>
                  <select
                    value={matCourse}
                    onChange={e => setMatCourse(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
                  >
                    <option value="CS301">CS301: Cloud Computing & Distributed Systems</option>
                    <option value="CS304">CS304: Cloud Architecture & DevOps Lab</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Material Title:</label>
                  <input
                    type="text"
                    required
                    value={matTitle}
                    onChange={e => setMatTitle(e.target.value)}
                    placeholder="e.g. Lecture 12: Site-to-Site VPN with IPSec"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Format:</label>
                  <select
                    value={matType}
                    onChange={e => setMatType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
                  >
                    <option value="pdf">PDF Document (.pdf)</option>
                    <option value="pptx">PowerPoint Presentation (.pptx)</option>
                    <option value="zip">Source Code Archive (.zip)</option>
                  </select>
                </div>

                {matSuccess && (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 rounded-xl">
                    {matSuccess}
                  </div>
                )}

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition"
                >
                  Upload & Sync to CloudFront CDN
                </button>
              </form>
            </div>
          )}

          {/* 10. TIMETABLE */}
          {activeTab === 'timetable' && (
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white">Faculty Weekly Teaching Schedule</h3>
              <table className="w-full text-xs font-mono text-left border-collapse">
                <thead className="bg-slate-950 text-slate-400">
                  <tr>
                    <th className="p-2.5">Day</th>
                    <th className="p-2.5">10:00 - 11:30 AM</th>
                    <th className="p-2.5">02:00 - 05:00 PM</th>
                    <th className="p-2.5">Office Consultation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="p-2.5 font-bold text-white">Monday</td>
                    <td className="p-2.5 text-amber-400">CS301 (Hall 302)</td>
                    <td className="p-2.5 text-slate-500">-</td>
                    <td className="p-2.5 text-cyan-400">03:00 - 05:00 PM</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Wednesday</td>
                    <td className="p-2.5 text-amber-400">CS301 (Hall 302)</td>
                    <td className="p-2.5 text-purple-400">CS304 Lab (Lab 4, Block 3)</td>
                    <td className="p-2.5 text-cyan-400">03:00 - 05:00 PM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* 11. NOTICES */}
          {activeTab === 'notices' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">University & Departmental Notices</h3>
              <div className="space-y-3">
                {notices.map(n => (
                  <div key={n.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                    <div className="flex justify-between items-center font-mono">
                      <span className="font-bold text-amber-400">[{n.category}]</span>
                      <span className="text-slate-500">{n.publishDate}</span>
                    </div>
                    <p className="font-bold text-white">{n.title}</p>
                    <p className="text-slate-400">{n.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 12. MENTORING */}
          {activeTab === 'mentoring' && (
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 max-w-2xl space-y-5">
              <h3 className="text-base font-bold text-white">Record Mentee Consultation Session</h3>
              <form onSubmit={handleSaveMentoring} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="text-slate-400 block mb-1">Student Mentee:</label>
                  <input
                    type="text"
                    disabled
                    value="Rohan Sharma (CVGU2023CSE042)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-300"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Consultation & Academic Progress Notes:</label>
                  <textarea
                    required
                    rows={3}
                    value={mentNotes}
                    onChange={e => setMentNotes(e.target.value)}
                    placeholder="Enter discussion notes regarding semester performance, project choices, and career goals..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-sans"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Agreed Action Items:</label>
                  <input
                    type="text"
                    required
                    value={mentActions}
                    onChange={e => setMentActions(e.target.value)}
                    placeholder="e.g. Complete AWS certification practice tests by Oct 20"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
                  />
                </div>

                {mentSuccess && (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 rounded-xl">
                    {mentSuccess}
                  </div>
                )}

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition"
                >
                  Commit Mentoring Record
                </button>
              </form>
            </div>
          )}

          {/* 13. FORUM */}
          {activeTab === 'forum' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Student Discussions & Instructor Replies</h3>
              {discussionPosts.map(p => (
                <div key={p.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-amber-400 font-bold">{p.courseTitle}</span>
                    <span className="text-slate-500">{p.createdAt}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{p.title}</h4>
                  <p className="text-slate-300">{p.content}</p>
                  <div className="pt-2 border-t border-slate-800 text-slate-400 font-mono flex justify-between items-center">
                    <span>Asked by: {p.authorName}</span>
                    <button className="px-3 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition">
                      Post Instructor Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 14. FACULTY SERVICES */}
          {activeTab === 'services' && (
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 max-w-2xl space-y-4 text-xs font-mono">
              <h3 className="text-base font-bold text-white">Faculty Administrative Services</h3>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">Academic Leave Application</p>
                  <p className="text-slate-400">Apply for conference, duty, or casual leave.</p>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition">
                  Apply Leave
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">Research Travel Grant Reimbursement</p>
                  <p className="text-slate-400">Submit claims for IEEE/ACM conference presentations.</p>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition">
                  Submit Claim
                </button>
              </div>
            </div>
          )}

          {/* 15. FACULTY HELPDESK */}
          {activeTab === 'helpdesk' && (
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 max-w-2xl space-y-4 text-xs font-mono">
              <h3 className="text-base font-bold text-white">Classroom & Lab IT Support</h3>
              <p className="text-slate-400">Report projector, cloud lab workstation, or high-speed connectivity issues.</p>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">Hall 302 HDMI Projector Audio Routing</p>
                  <p className="text-slate-400">Ticket TICK-9912 · Priority: HIGH</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300">RESOLVED</span>
              </div>
            </div>
          )}

          {/* 16. SECURITY & STEP-UP AUTH */}
          {activeTab === 'security' && (
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 max-w-3xl space-y-4 text-xs font-mono">
              <h3 className="text-base font-bold text-white">Faculty Session Security & Step-Up MFA</h3>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Identity Principal:</span>
                  <span className="text-amber-400 font-bold">prof.mukherjee (Dr. Arindam Mukherjee)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Authentication Method:</span>
                  <span className="text-slate-200">SAML 2.0 + RFC 6238 TOTP Authenticator</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Step-Up Elevation Scope:</span>
                  <span className="text-emerald-400">Grades Modification (marks:modify)</span>
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

      {/* Step-Up MFA Modal */}
      <StepUpMfaModal
        isOpen={stepUpOpen}
        onClose={() => setStepUpOpen(false)}
        onSuccess={handleStepUpSuccess}
        actionTitle={stepUpTitle}
      />
    </div>
  );
};

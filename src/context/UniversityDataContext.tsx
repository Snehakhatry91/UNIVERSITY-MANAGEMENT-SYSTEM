import React, { createContext, useContext, useState } from 'react';
import { 
  StudentProfile, 
  FacultyProfile, 
  Course, 
  AttendanceRecord, 
  Assignment, 
  AssignmentSubmission, 
  ExamSchedule, 
  HallTicket, 
  SemesterResult, 
  DigitalNotice, 
  FeePaymentRecord, 
  LibraryBook, 
  LibraryIssuedBook, 
  HostelDetails, 
  MentoringSession, 
  HelpdeskTicket, 
  DiscussionPost, 
  UniversityNotification 
} from '../types/university';
import { User } from '../types/auth';
import {
  INITIAL_USERS,
  INITIAL_STUDENT_PROFILE,
  INITIAL_FACULTY_PROFILE,
  INITIAL_COURSES,
  INITIAL_ATTENDANCE,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_EXAM_SCHEDULE,
  INITIAL_HALL_TICKET,
  INITIAL_SEMESTER_RESULTS,
  INITIAL_NOTICES,
  INITIAL_PAYMENTS,
  INITIAL_LIBRARY_BOOKS,
  INITIAL_ISSUED_BOOKS,
  INITIAL_HOSTEL_DETAILS,
  INITIAL_MENTORING_SESSIONS,
  INITIAL_HELPDESK_TICKETS,
  INITIAL_DISCUSSION_POSTS,
  INITIAL_NOTIFICATIONS
} from '../data/seedData';
import { evaluateRbacPolicy } from '../api/middleware';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  resource: string;
  status: 'ALLOW' | 'DENY';
  reason: string;
  ipAddress: string;
  userAgent: string;
}

interface UniversityDataContextType {
  // State
  users: User[];
  studentProfile: StudentProfile;
  facultyProfile: FacultyProfile;
  courses: Course[];
  attendance: AttendanceRecord[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  examSchedule: ExamSchedule[];
  hallTicket: HallTicket;
  semesterResults: SemesterResult;
  notices: DigitalNotice[];
  payments: FeePaymentRecord[];
  libraryBooks: LibraryBook[];
  issuedBooks: LibraryIssuedBook[];
  hostelDetails: HostelDetails;
  mentoringSessions: MentoringSession[];
  helpdeskTickets: HelpdeskTicket[];
  discussionPosts: DiscussionPost[];
  notifications: UniversityNotification[];
  auditLogs: AuditLogEntry[];

  // Student Actions
  submitAssignment: (assignmentId: string, fileName: string, fileSize: string, studentId: string, studentName: string) => { success: boolean; message: string };
  registerElectiveCourse: (courseCode: string, studentId: string) => { success: boolean; message: string };
  payFees: (feeType: 'TUITION' | 'HOSTEL' | 'EXAMINATION' | 'LIBRARY', amount: number, paymentMode: 'ONLINE_NETBANKING' | 'UPI') => { success: boolean; receiptNumber: string };
  borrowBook: (isbn: string, studentId: string) => { success: boolean; message: string };
  raiseTicket: (ticket: Omit<HelpdeskTicket, 'ticketId' | 'createdAt' | 'status'>) => { success: boolean; ticketId: string };
  postDiscussion: (courseId: string, title: string, content: string, authorName: string, authorRole: string) => void;
  markNotificationRead: (id: string) => void;

  // Faculty Actions
  markAttendance: (courseId: string, studentId: string, attended: boolean) => { success: boolean; message: string };
  gradeSubmission: (submissionId: string, marks: number, feedback: string, facultyMfaToken?: string) => { success: boolean; message: string };
  createAssignment: (asg: Omit<Assignment, 'id' | 'createdAt' | 'submittedCount' | 'totalStudents'>) => { success: boolean; message: string };
  addCourseMaterial: (courseId: string, title: string, fileType: string) => { success: boolean; message: string };
  recordMentoringNote: (studentId: string, notes: string, actions: string) => { success: boolean; message: string };

  // Admin Actions
  addUser: (user: Omit<User, 'id'>) => { success: boolean; message: string };
  updateUserStatus: (userId: string, status: 'ACTIVE' | 'LOCKED' | 'SUSPENDED') => void;
  createNotice: (notice: Omit<DigitalNotice, 'id' | 'publishDate'>) => void;
  createCourse: (course: Course) => void;
  resolveTicket: (ticketId: string, resolutionNotes: string) => void;

  // RBAC Demonstration Helper
  executeProtectedAction: (
    actionName: string,
    requiredPermission: string,
    principalUser: User,
    resourceOwnerId?: string,
    callback?: () => void
  ) => { allowed: boolean; reason: string; timestamp: string };
}

const UniversityDataContext = createContext<UniversityDataContextType | undefined>(undefined);

export const UniversityDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [facultyProfile] = useState<FacultyProfile>(INITIAL_FACULTY_PROFILE);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(INITIAL_SUBMISSIONS);
  const [examSchedule] = useState<ExamSchedule[]>(INITIAL_EXAM_SCHEDULE);
  const [hallTicket] = useState<HallTicket>(INITIAL_HALL_TICKET);
  const [semesterResults] = useState<SemesterResult>(INITIAL_SEMESTER_RESULTS);
  const [notices, setNotices] = useState<DigitalNotice[]>(INITIAL_NOTICES);
  const [payments, setPayments] = useState<FeePaymentRecord[]>(INITIAL_PAYMENTS);
  const [libraryBooks, setLibraryBooks] = useState<LibraryBook[]>(INITIAL_LIBRARY_BOOKS);
  const [issuedBooks, setIssuedBooks] = useState<LibraryIssuedBook[]>(INITIAL_ISSUED_BOOKS);
  const [hostelDetails] = useState<HostelDetails>(INITIAL_HOSTEL_DETAILS);
  const [mentoringSessions, setMentoringSessions] = useState<MentoringSession[]>(INITIAL_MENTORING_SESSIONS);
  const [helpdeskTickets, setHelpdeskTickets] = useState<HelpdeskTicket[]>(INITIAL_HELPDESK_TICKETS);
  const [discussionPosts, setDiscussionPosts] = useState<DiscussionPost[]>(INITIAL_DISCUSSION_POSTS);
  const [notifications, setNotifications] = useState<UniversityNotification[]>(INITIAL_NOTIFICATIONS);

  // Live Audit Logs backed by real simulated CloudTrail format
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'log-001',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      actor: 'admin.registrar',
      role: 'ADMINISTRATOR',
      action: 'AUTHENTICATE_SAML_ASSERTION',
      resource: 'arn:aws:iam::123456789012:saml-provider/CVGU-Campus-IdP',
      status: 'ALLOW',
      reason: 'SAML 2.0 signature verified with CVGU root CA. MFA TOTP challenge passed.',
      ipAddress: '172.16.10.45 (On-Premises Campus Network)',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0'
    },
    {
      id: 'log-002',
      timestamp: new Date(Date.now() - 2400000).toISOString(),
      actor: 'prof.mukherjee',
      role: 'FACULTY',
      action: 'API_INVOCATION [marks:modify]',
      resource: 'arn:aws:execute-api:ap-south-1:123456789012:api/marks/CS301',
      status: 'ALLOW',
      reason: 'Step-up MFA verified. Principal is assigned lead faculty for course CS301.',
      ipAddress: '10.0.1.55 (Private Application Subnet AZ-A)',
      userAgent: 'CVGU-Portal-Client/2.4'
    },
    {
      id: 'log-003',
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      actor: '2023cse042',
      role: 'STUDENT',
      action: 'UNAUTHORIZED_ACCESS_ATTEMPT [marks:modify]',
      resource: 'arn:aws:execute-api:ap-south-1:123456789012:api/marks/CS301',
      status: 'DENY',
      reason: 'RBAC AUTHORIZATION VIOLATION: Role [STUDENT] lacks the required entitlement [marks:modify]. Request rejected at API gateway.',
      ipAddress: '103.112.48.91 (Public Internet via CloudFront/WAF)',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  ]);

  const addAuditLog = (actor: string, role: string, action: string, resource: string, status: 'ALLOW' | 'DENY', reason: string) => {
    const newEntry: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      actor,
      role,
      action,
      resource,
      status,
      reason,
      ipAddress: role === 'ADMINISTRATOR' ? '172.16.10.12 (Campus VPN)' : '103.112.48.91 (CloudFront)',
      userAgent: 'CVGU-University-Platform/v1.0'
    };
    setAuditLogs(prev => [newEntry, ...prev.slice(0, 99)]);
  };

  const executeProtectedAction = (
    actionName: string,
    requiredPermission: string,
    principalUser: User,
    resourceOwnerId?: string,
    callback?: () => void
  ) => {
    const result = evaluateRbacPolicy(
      principalUser.role,
      principalUser.username,
      requiredPermission,
      resourceOwnerId,
      principalUser.id
    );

    addAuditLog(
      principalUser.username,
      principalUser.role,
      actionName,
      `api/v1/protected/${requiredPermission.replace(':', '/')}`,
      result.allowed ? 'ALLOW' : 'DENY',
      result.reason
    );

    if (result.allowed && callback) {
      callback();
    }

    return {
      allowed: result.allowed,
      reason: result.reason,
      timestamp: result.timestamp
    };
  };

  // Student Actions
  const submitAssignment = (
    assignmentId: string,
    fileName: string,
    fileSize: string,
    studentId: string,
    studentName: string
  ) => {
    const newSub: AssignmentSubmission = {
      id: `sub-${Date.now()}`,
      assignmentId,
      studentId,
      studentName,
      submissionDate: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      fileName,
      fileSize,
      status: 'SUBMITTED'
    };
    setSubmissions(prev => [newSub, ...prev]);

    setAssignments(prev => prev.map(a => 
      a.id === assignmentId ? { ...a, submittedCount: (a.submittedCount || 0) + 1 } : a
    ));

    addAuditLog(
      studentId,
      'STUDENT',
      'SUBMIT_ASSIGNMENT',
      `s3://cvgu-student-submissions-encrypted/${assignmentId}/${fileName}`,
      'ALLOW',
      'Encrypted with KMS Customer Managed Key [arn:aws:kms:ap-south-1:123456789012:key/cvgu-sub-key]'
    );

    return { success: true, message: 'Assignment uploaded successfully to encrypted S3 bucket.' };
  };

  const registerElectiveCourse = (courseCode: string, studentId: string) => {
    addAuditLog(
      studentId,
      'STUDENT',
      'REGISTER_ELECTIVE_COURSE',
      `db/enrollments/${courseCode}`,
      'ALLOW',
      'Prerequisites satisfied. Enrollment seat locked.'
    );
    return { success: true, message: `Successfully registered for elective [${courseCode}].` };
  };

  const payFees = (
    feeType: 'TUITION' | 'HOSTEL' | 'EXAMINATION' | 'LIBRARY',
    amount: number,
    paymentMode: 'ONLINE_NETBANKING' | 'UPI'
  ) => {
    const receiptNumber = `CVGU-REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPayment: FeePaymentRecord = {
      id: `pay-${Date.now()}`,
      receiptNumber,
      studentId: studentProfile.studentId,
      studentName: studentProfile.fullName,
      feeType,
      amount,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMode,
      transactionRef: `TXN-${paymentMode}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: 'SUCCESS'
    };

    setPayments(prev => [newPayment, ...prev]);
    setStudentProfile(prev => ({ ...prev, pendingFees: Math.max(0, prev.pendingFees - amount) }));

    addAuditLog(
      studentProfile.studentId,
      'STUDENT',
      'PAY_FEES_GATEWAY',
      `payment/ledger/${receiptNumber}`,
      'ALLOW',
      `Payment of ₹${amount.toLocaleString('en-IN')} verified. Ledger updated.`
    );

    return { success: true, receiptNumber };
  };

  const borrowBook = (isbn: string, studentId: string) => {
    const book = libraryBooks.find(b => b.isbn === isbn);
    if (!book || book.availableCopies <= 0) {
      return { success: false, message: 'No available copies for checkout.' };
    }

    setLibraryBooks(prev => prev.map(b => b.isbn === isbn ? { ...b, availableCopies: b.availableCopies - 1 } : b));
    const newIssue: LibraryIssuedBook = {
      transactionId: `lib-tx-${Date.now()}`,
      bookTitle: book.title,
      isbn: book.isbn,
      studentId,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      fineAmount: 0.00,
      status: 'ACTIVE'
    };
    setIssuedBooks(prev => [newIssue, ...prev]);

    addAuditLog(
      studentId,
      'STUDENT',
      'BORROW_LIBRARY_BOOK',
      `library/checkout/${isbn}`,
      'ALLOW',
      `Book [${book.title}] checked out. 30-day RFID loan issued.`
    );

    return { success: true, message: `Successfully borrowed [${book.title}].` };
  };

  const raiseTicket = (ticket: Omit<HelpdeskTicket, 'ticketId' | 'createdAt' | 'status'>) => {
    const ticketId = `TICK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: HelpdeskTicket = {
      ...ticket,
      ticketId,
      status: 'OPEN',
      createdAt: new Date().toLocaleString('en-IN') + ' IST'
    };
    setHelpdeskTickets(prev => [newTicket, ...prev]);

    addAuditLog(
      ticket.userName,
      ticket.role,
      'CREATE_HELPDESK_TICKET',
      `helpdesk/${ticketId}`,
      'ALLOW',
      `Support ticket created under category [${ticket.category}]. Queued to IT Support SQS.`
    );

    return { success: true, ticketId };
  };

  const postDiscussion = (courseId: string, title: string, content: string, authorName: string, authorRole: string) => {
    const course = courses.find(c => c.id === courseId);
    const newPost: DiscussionPost = {
      id: `post-${Date.now()}`,
      courseId,
      courseTitle: course ? course.title : 'General',
      authorName,
      authorRole,
      title,
      content,
      createdAt: 'Just now',
      replyCount: 0,
      likes: 1
    };
    setDiscussionPosts(prev => [newPost, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Faculty Actions
  const markAttendance = (courseId: string, studentId: string, attended: boolean) => {
    setAttendance(prev => prev.map(a => {
      if (a.courseId === courseId) {
        const total = a.totalClasses + 1;
        const attendedCount = attended ? a.attendedClasses + 1 : a.attendedClasses;
        const pct = Math.round((attendedCount / total) * 1000) / 10;
        return {
          ...a,
          totalClasses: total,
          attendedClasses: attendedCount,
          percentage: pct,
          lastUpdated: new Date().toISOString().split('T')[0],
          status: pct >= 85 ? 'EXCELLENT' : pct >= 75 ? 'GOOD' : 'SHORTAGE'
        };
      }
      return a;
    }));

    addAuditLog(
      'prof.mukherjee',
      'FACULTY',
      'MARK_STUDENT_ATTENDANCE',
      `academic/attendance/${courseId}/${studentId}`,
      'ALLOW',
      `Attendance marked for course [${courseId}] - Status: ${attended ? 'Present' : 'Absent'}`
    );

    return { success: true, message: 'Attendance register updated successfully.' };
  };

  const gradeSubmission = (submissionId: string, marks: number, feedback: string, facultyMfaToken?: string) => {
    // Sensitive operation: requires step-up MFA verification
    if (!facultyMfaToken || facultyMfaToken.trim().length !== 6) {
      addAuditLog(
        'prof.mukherjee',
        'FACULTY',
        'GRADE_SUBMISSION_ATTEMPT',
        `academic/grades/${submissionId}`,
        'DENY',
        'STEP-UP MFA REQUIRED: Grade modification requires second-factor authorization.'
      );
      return { success: false, message: 'Step-up MFA authorization required for grading.' };
    }

    setSubmissions(prev => prev.map(s => 
      s.id === submissionId ? { ...s, status: 'EVALUATED', marksObtained: marks, feedback } : s
    ));

    addAuditLog(
      'prof.mukherjee',
      'FACULTY',
      'GRADE_SUBMISSION_CONFIRMED',
      `academic/grades/${submissionId}`,
      'ALLOW',
      `Grades posted: ${marks} marks. Step-up MFA TOTP verified.`
    );

    return { success: true, message: 'Evaluation committed to student grade record.' };
  };

  const createAssignment = (asg: Omit<Assignment, 'id' | 'createdAt' | 'submittedCount' | 'totalStudents'>) => {
    const newAsg: Assignment = {
      ...asg,
      id: `asg-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      submittedCount: 0,
      totalStudents: 68
    };
    setAssignments(prev => [newAsg, ...prev]);

    addAuditLog(
      'prof.mukherjee',
      'FACULTY',
      'CREATE_COURSE_ASSIGNMENT',
      `academic/lms/${newAsg.id}`,
      'ALLOW',
      `New assignment created: [${newAsg.title}] for course [${newAsg.courseId}].`
    );

    return { success: true, message: 'Assignment published to student LMS portals.' };
  };

  const addCourseMaterial = (courseId: string, title: string, fileType: string) => {
    addAuditLog(
      'prof.mukherjee',
      'FACULTY',
      'UPLOAD_COURSE_MATERIAL',
      `s3://cvgu-course-materials/${courseId}/${title}.${fileType}`,
      'ALLOW',
      'Material uploaded and indexed. CDN edge cache invalidated.'
    );
    return { success: true, message: `Material [${title}] published.` };
  };

  const recordMentoringNote = (studentId: string, notes: string, actions: string) => {
    const newSession: MentoringSession = {
      id: `ment-${Date.now()}`,
      studentId,
      studentName: 'Rohan Sharma',
      facultyId: 'CVGU-FAC-108',
      date: new Date().toISOString().split('T')[0],
      discussionNotes: notes,
      actionItems: actions,
      status: 'COMPLETED'
    };
    setMentoringSessions(prev => [newSession, ...prev]);
    return { success: true, message: 'Mentoring log updated.' };
  };

  // Admin Actions
  const addUser = (user: Omit<User, 'id'>) => {
    const newUser: User = {
      ...user,
      id: `usr-${user.role.toLowerCase()}-${Date.now()}`
    };
    setUsers(prev => [...prev, newUser]);

    addAuditLog(
      'admin.registrar',
      'ADMINISTRATOR',
      'PROVISION_CAMPUS_USER',
      `iam/users/${newUser.username}`,
      'ALLOW',
      `New university identity provisioned with role [${newUser.role}]. Active Directory synchronized.`
    );

    return { success: true, message: `User [${newUser.username}] provisioned successfully.` };
  };

  const updateUserStatus = (userId: string, status: 'ACTIVE' | 'LOCKED' | 'SUSPENDED') => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, accountStatus: status } : u));
    addAuditLog(
      'admin.registrar',
      'ADMINISTRATOR',
      'UPDATE_USER_STATUS',
      `iam/users/${userId}`,
      'ALLOW',
      `Account status updated to [${status}].`
    );
  };

  const createNotice = (notice: Omit<DigitalNotice, 'id' | 'publishDate'>) => {
    const newNotice: DigitalNotice = {
      ...notice,
      id: `not-${Date.now()}`,
      publishDate: new Date().toISOString().split('T')[0]
    };
    setNotices(prev => [newNotice, ...prev]);

    addAuditLog(
      'admin.registrar',
      'ADMINISTRATOR',
      'PUBLISH_UNIVERSITY_NOTICE',
      `portal/notices/${newNotice.id}`,
      'ALLOW',
      `University notice published: [${newNotice.title}]. Priority: ${newNotice.priority}.`
    );
  };

  const createCourse = (course: Course) => {
    setCourses(prev => [...prev, course]);
    addAuditLog(
      'admin.registrar',
      'ADMINISTRATOR',
      'CREATE_CURRICULUM_COURSE',
      `academic/curriculum/${course.code}`,
      'ALLOW',
      `New course [${course.code}: ${course.title}] added to curriculum.`
    );
  };

  const resolveTicket = (ticketId: string, resolutionNotes: string) => {
    setHelpdeskTickets(prev => prev.map(t => 
      t.ticketId === ticketId ? { ...t, status: 'RESOLVED', resolutionNotes } : t
    ));

    addAuditLog(
      'admin.registrar',
      'ADMINISTRATOR',
      'RESOLVE_HELPDESK_TICKET',
      `helpdesk/${ticketId}`,
      'ALLOW',
      `Ticket [${ticketId}] resolved with notes: ${resolutionNotes}.`
    );
  };

  return (
    <UniversityDataContext.Provider
      value={{
        users,
        studentProfile,
        facultyProfile,
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
        auditLogs,
        submitAssignment,
        registerElectiveCourse,
        payFees,
        borrowBook,
        raiseTicket,
        postDiscussion,
        markNotificationRead,
        markAttendance,
        gradeSubmission,
        createAssignment,
        addCourseMaterial,
        recordMentoringNote,
        addUser,
        updateUserStatus,
        createNotice,
        createCourse,
        resolveTicket,
        executeProtectedAction
      }}
    >
      {children}
    </UniversityDataContext.Provider>
  );
};

export const useUniversityData = () => {
  const context = useContext(UniversityDataContext);
  if (!context) {
    throw new Error('useUniversityData must be used within a UniversityDataProvider');
  }
  return context;
};

export interface StudentProfile {
  studentId: string; // e.g., 'CVGU2023CSE042'
  userId: string;
  fullName: string;
  department: string;
  program: string; // 'B.Tech in Computer Science & Engineering'
  currentSemester: number;
  batch: string; // '2023-2027'
  cgpa: number;
  attendanceOverall: number;
  pendingFees: number;
  mentorName: string;
  mentorEmail: string;
  hostelBlock?: string;
  roomNumber?: string;
  contactNumber: string;
}

export interface FacultyProfile {
  facultyId: string; // e.g., 'CVGU-FAC-108'
  userId: string;
  fullName: string;
  designation: string; // 'Professor & Head', 'Associate Professor'
  department: string;
  specialization: string;
  assignedCourses: string[]; // course IDs
  cabinNumber: string;
  officeHours: string;
}

export interface Course {
  id: string; // 'CS301'
  code: string;
  title: string;
  department: string;
  credits: number;
  semester: number;
  leadFacultyId: string;
  leadFacultyName: string;
  syllabusUrl?: string;
  schedule: string; // 'Mon, Wed 10:00 - 11:30 AM'
  room: string;
  enrolledStudentsCount: number;
}

export interface AttendanceRecord {
  id: string;
  courseId: string;
  courseTitle: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  lastUpdated: string;
  status: 'EXCELLENT' | 'GOOD' | 'SHORTAGE'; // < 75% is shortage
}

export interface Assignment {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  description: string;
  dueDate: string;
  maxMarks: number;
  fileAttachment?: string;
  createdAt: string;
  submittedCount?: number;
  totalStudents?: number;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submissionDate: string;
  fileName: string;
  fileSize: string;
  status: 'SUBMITTED' | 'EVALUATED' | 'LATE';
  marksObtained?: number;
  feedback?: string;
}

export interface ExamSchedule {
  id: string;
  examName: string;
  semester: number;
  courseCode: string;
  courseTitle: string;
  date: string;
  time: string;
  venue: string;
}

export interface HallTicket {
  ticketNumber: string;
  studentId: string;
  studentName: string;
  examName: string;
  reportingTime: string;
  centerAddress: string;
  courses: { code: string; title: string; date: string; session: string }[];
  instructions: string[];
}

export interface SemesterResult {
  id: string;
  studentId: string;
  semester: number;
  sgpa: number;
  cgpa: number;
  status: 'PASSED' | 'FAILED';
  publishedDate: string;
  subjects: {
    code: string;
    title: string;
    credits: number;
    internalMarks: number;
    externalMarks: number;
    totalMarks: number;
    grade: string;
    points: number;
  }[];
}

export interface DigitalNotice {
  id: string;
  title: string;
  content: string;
  category: 'ALL' | 'URGENT' | 'ACADEMIC' | 'EXAMINATION' | 'EVENT';
  priority: 'HIGH' | 'NORMAL';
  author: string;
  authorRole: string;
  publishDate: string;
  attachmentName?: string;
}

export interface FeePaymentRecord {
  id: string;
  receiptNumber: string;
  studentId: string;
  studentName: string;
  feeType: 'TUITION' | 'HOSTEL' | 'EXAMINATION' | 'LIBRARY';
  amount: number;
  paymentDate: string;
  paymentMode: 'ONLINE_NETBANKING' | 'UPI' | 'CHALLAN';
  transactionRef: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

export interface LibraryBook {
  isbn: string;
  title: string;
  author: string;
  category: string;
  publisher: string;
  shelfLocation: string;
  totalCopies: number;
  availableCopies: number;
}

export interface LibraryIssuedBook {
  transactionId: string;
  bookTitle: string;
  isbn: string;
  studentId: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  fineAmount: number;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
}

export interface HostelDetails {
  block: string;
  roomNumber: string;
  wardenName: string;
  wardenContact: string;
  messType: 'VEG' | 'NON_VEG';
  roommates: string[];
}

export interface MentoringSession {
  id: string;
  studentId: string;
  studentName: string;
  facultyId: string;
  date: string;
  discussionNotes: string;
  actionItems: string;
  status: 'COMPLETED' | 'SCHEDULED';
}

export interface HelpdeskTicket {
  ticketId: string;
  userId: string;
  userName: string;
  role: string;
  category: 'ACADEMIC' | 'HOSTEL' | 'EXAM' | 'WIFI_IT' | 'FINANCE';
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  resolutionNotes?: string;
}

export interface DiscussionPost {
  id: string;
  courseId: string;
  courseTitle: string;
  authorName: string;
  authorRole: string;
  title: string;
  content: string;
  createdAt: string;
  replyCount: number;
  likes: number;
}

export interface UniversityNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'INFO' | 'ALERT' | 'SUCCESS';
  link?: string;
}

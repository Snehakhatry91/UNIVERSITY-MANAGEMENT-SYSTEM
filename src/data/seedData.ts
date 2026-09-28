import { User } from '../types/auth';
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

// 1. Initial Mock Users
export const INITIAL_USERS: User[] = [
  {
    id: 'usr-student-01',
    username: '2023cse042',
    email: 'rohan.sharma@cvrgu.edu.in',
    fullName: 'Rohan Sharma',
    role: 'STUDENT',
    department: 'Computer Science & Engineering',
    isMfaEnabled: false,
    accountStatus: 'ACTIVE',
    lastLogin: '2026-09-28 08:30 IST'
  },
  {
    id: 'usr-faculty-01',
    username: 'prof.mukherjee',
    email: 'arindam.mukherjee@cvrgu.edu.in',
    fullName: 'Dr. Arindam Mukherjee',
    role: 'FACULTY',
    department: 'Computer Science & Engineering',
    isMfaEnabled: true,
    mfaMethod: 'TOTP',
    accountStatus: 'ACTIVE',
    lastLogin: '2026-09-28 09:15 IST'
  },
  {
    id: 'usr-admin-01',
    username: 'admin.registrar',
    email: 'admin.cloud@cvrgu.edu.in',
    fullName: 'Prof. S. K. Mohapatra',
    role: 'ADMINISTRATOR',
    department: 'University IT & Cloud Operations',
    isMfaEnabled: true,
    mfaMethod: 'TOTP',
    accountStatus: 'ACTIVE',
    lastLogin: '2026-09-28 07:45 IST'
  }
];

// 2. Student Profile (Rohan Sharma)
export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  studentId: 'CVGU2023CSE042',
  userId: 'usr-student-01',
  fullName: 'Rohan Sharma',
  department: 'Computer Science & Engineering',
  program: 'B.Tech in Computer Science & Engineering',
  currentSemester: 6,
  batch: '2023-2027',
  cgpa: 8.84,
  attendanceOverall: 88.5,
  pendingFees: 0,
  mentorName: 'Dr. Arindam Mukherjee',
  mentorEmail: 'arindam.mukherjee@cvrgu.edu.in',
  hostelBlock: 'Aryabhatta Boys Residence (Block-A)',
  roomNumber: 'A-304',
  contactNumber: '+91 98765 43210'
};

// 3. Faculty Profile (Dr. Arindam Mukherjee)
export const INITIAL_FACULTY_PROFILE: FacultyProfile = {
  facultyId: 'CVGU-FAC-108',
  userId: 'usr-faculty-01',
  fullName: 'Dr. Arindam Mukherjee',
  designation: 'Professor & Head of Cloud Lab',
  department: 'Computer Science & Engineering',
  specialization: 'Cloud Computing, Distributed Systems & Virtualization',
  assignedCourses: ['CS301', 'CS402'],
  cabinNumber: 'Academic Block 3, Room 412',
  officeHours: 'Monday & Wednesday 03:00 - 05:00 PM'
};

// 4. University Courses
export const INITIAL_COURSES: Course[] = [
  {
    id: 'CS301',
    code: 'CS301',
    title: 'Cloud Computing & Distributed Systems',
    department: 'Computer Science & Engineering',
    credits: 4,
    semester: 6,
    leadFacultyId: 'CVGU-FAC-108',
    leadFacultyName: 'Dr. Arindam Mukherjee',
    schedule: 'Mon, Wed 10:00 - 11:30 AM',
    room: 'Hall 302, Academic Block 2',
    enrolledStudentsCount: 68
  },
  {
    id: 'CS302',
    code: 'CS302',
    title: 'Network Security & Cryptography',
    department: 'Computer Science & Engineering',
    credits: 4,
    semester: 6,
    leadFacultyId: 'CVGU-FAC-112',
    leadFacultyName: 'Dr. P. K. Dash',
    schedule: 'Tue, Thu 02:00 - 03:30 PM',
    room: 'Hall 204, Academic Block 1',
    enrolledStudentsCount: 68
  },
  {
    id: 'CS303',
    code: 'CS303',
    title: 'Database Management Systems & Internals',
    department: 'Computer Science & Engineering',
    credits: 4,
    semester: 6,
    leadFacultyId: 'CVGU-FAC-115',
    leadFacultyName: 'Dr. S. Panda',
    schedule: 'Mon, Fri 11:30 AM - 01:00 PM',
    room: 'Hall 305, Academic Block 2',
    enrolledStudentsCount: 68
  },
  {
    id: 'CS304',
    code: 'CS304',
    title: 'Cloud Architecture & DevOps Lab',
    department: 'Computer Science & Engineering',
    credits: 2,
    semester: 6,
    leadFacultyId: 'CVGU-FAC-108',
    leadFacultyName: 'Dr. Arindam Mukherjee',
    schedule: 'Wed 02:00 - 05:00 PM',
    room: 'Cloud Computing Lab 4, Block 3',
    enrolledStudentsCount: 68
  }
];

// 5. Attendance Records
export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-01',
    courseId: 'CS301',
    courseTitle: 'Cloud Computing & Distributed Systems',
    totalClasses: 36,
    attendedClasses: 33,
    percentage: 91.6,
    lastUpdated: '2026-09-26',
    status: 'EXCELLENT'
  },
  {
    id: 'att-02',
    courseId: 'CS302',
    courseTitle: 'Network Security & Cryptography',
    totalClasses: 34,
    attendedClasses: 29,
    percentage: 85.3,
    lastUpdated: '2026-09-25',
    status: 'GOOD'
  },
  {
    id: 'att-03',
    courseId: 'CS303',
    courseTitle: 'Database Management Systems & Internals',
    totalClasses: 38,
    attendedClasses: 34,
    percentage: 89.4,
    lastUpdated: '2026-09-26',
    status: 'GOOD'
  },
  {
    id: 'att-04',
    courseId: 'CS304',
    courseTitle: 'Cloud Architecture & DevOps Lab',
    totalClasses: 14,
    attendedClasses: 14,
    percentage: 100.0,
    lastUpdated: '2026-09-24',
    status: 'EXCELLENT'
  }
];

// 6. Assignments
export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-01',
    courseId: 'CS301',
    courseTitle: 'Cloud Computing & Distributed Systems',
    title: 'Assignment 3: Multi-AZ VPC Design & Terraform Specification',
    description: 'Design a 3-tier VPC with Public, Private, and Isolated Database Subnets across two Availability Zones. Provide Terraform HCL modules.',
    dueDate: '2026-10-05 23:59 IST',
    maxMarks: 50,
    createdAt: '2026-09-20',
    submittedCount: 54,
    totalStudents: 68
  },
  {
    id: 'asg-02',
    courseId: 'CS302',
    courseTitle: 'Network Security & Cryptography',
    title: 'Assignment 2: SAML 2.0 Identity Federation & TOTP Verification',
    description: 'Simulate SAML 2.0 assertion validation and compute HMAC-SHA1 TOTP tokens for academic grade publishing.',
    dueDate: '2026-10-08 23:59 IST',
    maxMarks: 40,
    createdAt: '2026-09-22',
    submittedCount: 38,
    totalStudents: 68
  }
];

// 7. Student Submissions
export const INITIAL_SUBMISSIONS: AssignmentSubmission[] = [
  {
    id: 'sub-01',
    assignmentId: 'asg-01',
    studentId: 'CVGU2023CSE042',
    studentName: 'Rohan Sharma',
    submissionDate: '2026-09-25 18:30 IST',
    fileName: 'CVGU2023CSE042_Cloud_Assignment3.pdf',
    fileSize: '2.4 MB',
    status: 'EVALUATED',
    marksObtained: 48,
    feedback: 'Excellent VPC topology diagram and clean Terraform modularity. Good security group boundaries.'
  }
];

// 8. Examination Schedules
export const INITIAL_EXAM_SCHEDULE: ExamSchedule[] = [
  {
    id: 'exam-01',
    examName: 'Spring 2026 Mid-Semester Examinations',
    semester: 6,
    courseCode: 'CS301',
    courseTitle: 'Cloud Computing & Distributed Systems',
    date: '2026-10-15',
    time: '10:00 AM - 12:00 PM',
    venue: 'Hall 302, Academic Block 2'
  },
  {
    id: 'exam-02',
    examName: 'Spring 2026 Mid-Semester Examinations',
    semester: 6,
    courseCode: 'CS302',
    courseTitle: 'Network Security & Cryptography',
    date: '2026-10-17',
    time: '10:00 AM - 12:00 PM',
    venue: 'Hall 204, Academic Block 1'
  },
  {
    id: 'exam-03',
    examName: 'Spring 2026 Mid-Semester Examinations',
    semester: 6,
    courseCode: 'CS303',
    courseTitle: 'Database Management Systems & Internals',
    date: '2026-10-19',
    time: '10:00 AM - 12:00 PM',
    venue: 'Hall 305, Academic Block 2'
  }
];

// 9. Hall Ticket
export const INITIAL_HALL_TICKET: HallTicket = {
  ticketNumber: 'HT-CVGU-2026-S6-042',
  studentId: 'CVGU2023CSE042',
  studentName: 'Rohan Sharma',
  examName: 'Spring 2026 Mid-Semester Examinations',
  reportingTime: '09:30 AM IST',
  centerAddress: 'C. V. Raman Global University, Bidyanagar, Mahura, Janla, Bhubaneswar, Odisha 752054',
  courses: [
    { code: 'CS301', title: 'Cloud Computing & Distributed Systems', date: '2026-10-15', session: 'Morning (10:00 AM - 12:00 PM)' },
    { code: 'CS302', title: 'Network Security & Cryptography', date: '2026-10-17', session: 'Morning (10:00 AM - 12:00 PM)' },
    { code: 'CS303', title: 'Database Management Systems & Internals', date: '2026-10-19', session: 'Morning (10:00 AM - 12:00 PM)' }
  ],
  instructions: [
    'Candidates must display physical university identity card alongside this hall ticket.',
    'Electronic gadgets, smartwatches, and programmable calculators are strictly prohibited inside the hall.',
    'No candidate will be admitted into the examination center after 10:15 AM.'
  ]
};

// 10. Semester Results
export const INITIAL_SEMESTER_RESULTS: SemesterResult = {
  id: 'res-sem5',
  studentId: 'CVGU2023CSE042',
  semester: 5,
  sgpa: 8.92,
  cgpa: 8.84,
  status: 'PASSED',
  publishedDate: '2026-01-20',
  subjects: [
    { code: 'CS201', title: 'Operating Systems & System Programming', credits: 4, internalMarks: 28, externalMarks: 64, totalMarks: 92, grade: 'O', points: 10 },
    { code: 'CS202', title: 'Computer Networks & TCP/IP Protocol Suite', credits: 4, internalMarks: 26, externalMarks: 61, totalMarks: 87, grade: 'A+', points: 9 },
    { code: 'CS203', title: 'Design & Analysis of Algorithms', credits: 4, internalMarks: 27, externalMarks: 58, totalMarks: 85, grade: 'A+', points: 9 },
    { code: 'CS204', title: 'Software Engineering & Microservices', credits: 4, internalMarks: 26, externalMarks: 60, totalMarks: 86, grade: 'A+', points: 9 },
    { code: 'CS205', title: 'Operating Systems & Networking Lab', credits: 2, internalMarks: 48, externalMarks: 46, totalMarks: 94, grade: 'O', points: 10 }
  ]
};

// 11. Digital Notice Board
export const INITIAL_NOTICES: DigitalNotice[] = [
  {
    id: 'not-01',
    title: 'Mid-Semester Examination Schedule for Spring 2026 Released',
    content: 'The Mid-Semester examinations for 4th, 6th, and 8th semester B.Tech students will commence on October 15, 2026. Hall tickets can be downloaded from the Student Workspace.',
    category: 'EXAMINATION',
    priority: 'HIGH',
    author: 'Controller of Examinations',
    authorRole: 'University Registrar',
    publishDate: '2026-09-27'
  },
  {
    id: 'not-02',
    title: 'National Conference on Hybrid Cloud & Zero-Trust Architectures (NC-HCZTA 2026)',
    content: 'Department of Computer Science & Engineering is organizing NC-HCZTA 2026 in collaboration with AWS India and IEEE Bhubaneswar Section on November 12-14, 2026.',
    category: 'EVENT',
    priority: 'NORMAL',
    author: 'Dr. Arindam Mukherjee',
    authorRole: 'Head of Cloud Lab',
    publishDate: '2026-09-25'
  },
  {
    id: 'not-03',
    title: 'Urgent: Course Elective Pre-Registration Portal for Autumn 2026',
    content: 'All pre-final year students are requested to complete elective selections by October 10. Unregistered students will be allocated electives based on seat availability.',
    category: 'ACADEMIC',
    priority: 'HIGH',
    author: 'Academic Dean Office',
    authorRole: 'Dean Academics',
    publishDate: '2026-09-24'
  }
];

// 12. Fee Payments
export const INITIAL_PAYMENTS: FeePaymentRecord[] = [
  {
    id: 'pay-01',
    receiptNumber: 'CVGU-REC-2026-8910',
    studentId: 'CVGU2023CSE042',
    studentName: 'Rohan Sharma',
    feeType: 'TUITION',
    amount: 85000,
    paymentDate: '2026-07-15',
    paymentMode: 'ONLINE_NETBANKING',
    transactionRef: 'TXN-HDFC-99120814',
    status: 'SUCCESS'
  },
  {
    id: 'pay-02',
    receiptNumber: 'CVGU-REC-2026-8911',
    studentId: 'CVGU2023CSE042',
    studentName: 'Rohan Sharma',
    feeType: 'HOSTEL',
    amount: 45000,
    paymentDate: '2026-07-15',
    paymentMode: 'UPI',
    transactionRef: 'UPI-SBI-88219033',
    status: 'SUCCESS'
  }
];

// 13. Library OPAC Books
export const INITIAL_LIBRARY_BOOKS: LibraryBook[] = [
  {
    isbn: '978-0134444321',
    title: 'Cloud Computing: Concepts, Technology & Architecture',
    author: 'Thomas Erl, Ricardo Puttini, Zaigham Mahmood',
    category: 'Cloud Architecture',
    publisher: 'Pearson Education',
    shelfLocation: 'Stack 4B / Row 12',
    totalCopies: 8,
    availableCopies: 5
  },
  {
    isbn: '978-0134096179',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    category: 'Distributed Systems',
    publisher: "O'Reilly Media",
    shelfLocation: 'Stack 4B / Row 15',
    totalCopies: 12,
    availableCopies: 3
  },
  {
    isbn: '978-0132350884',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    category: 'Software Engineering',
    publisher: 'Prentice Hall',
    shelfLocation: 'Stack 2A / Row 04',
    totalCopies: 15,
    availableCopies: 9
  }
];

export const INITIAL_ISSUED_BOOKS: LibraryIssuedBook[] = [
  {
    transactionId: 'lib-tx-01',
    bookTitle: 'Cloud Computing: Concepts, Technology & Architecture',
    isbn: '978-0134444321',
    studentId: 'CVGU2023CSE042',
    issueDate: '2026-09-15',
    dueDate: '2026-10-15',
    fineAmount: 0.00,
    status: 'ACTIVE'
  }
];

// 14. Hostel Details
export const INITIAL_HOSTEL_DETAILS: HostelDetails = {
  block: 'Aryabhatta Boys Residence (Block A)',
  roomNumber: 'A-304',
  wardenName: 'Prof. B. C. Ray',
  wardenContact: '+91 94370 11223',
  messType: 'NON_VEG',
  roommates: ['Soumyajit Sen (2023CSE043)', 'Abhishek Sahu (2023CSE044)']
};

// 15. Mentoring
export const INITIAL_MENTORING_SESSIONS: MentoringSession[] = [
  {
    id: 'ment-01',
    studentId: 'CVGU2023CSE042',
    studentName: 'Rohan Sharma',
    facultyId: 'CVGU-FAC-108',
    date: '2026-09-12',
    discussionNotes: 'Reviewed academic standing and semester 5 SGPA. Discussed final year capstone project proposal on Hybrid Cloud Architectures.',
    actionItems: 'Prepare architectural schematic and explore AWS Site-to-Site VPN with Multi-AZ PostgreSQL.',
    status: 'COMPLETED'
  }
];

// 16. Helpdesk Tickets
export const INITIAL_HELPDESK_TICKETS: HelpdeskTicket[] = [
  {
    ticketId: 'TICK-8021',
    userId: 'usr-student-01',
    userName: 'Rohan Sharma',
    role: 'STUDENT',
    category: 'WIFI_IT',
    subject: 'Campus Wi-Fi 802.1X Authentication Certificate Error in Block A',
    description: 'Device cannot complete EAP-TLS handshake when connecting from Room A-304 after radius certificate rotation.',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    createdAt: '2026-09-26 14:20 IST'
  }
];

// 17. Discussion Forum Posts
export const INITIAL_DISCUSSION_POSTS: DiscussionPost[] = [
  {
    id: 'post-01',
    courseId: 'CS301',
    courseTitle: 'Cloud Computing & Distributed Systems',
    authorName: 'Rohan Sharma',
    authorRole: 'Student',
    title: 'Why is RDS Multi-AZ replication synchronous while read-replicas are asynchronous?',
    content: 'Can someone clarify the trade-offs between Multi-AZ standby instances and Aurora Global Databases for disaster recovery?',
    createdAt: '2026-09-27 16:40 IST',
    replyCount: 3,
    likes: 7
  }
];

// 18. Notifications
export const INITIAL_NOTIFICATIONS: UniversityNotification[] = [
  {
    id: 'notif-01',
    title: 'Hall Ticket Generated',
    message: 'Your Mid-Semester examination hall ticket is now ready for download.',
    timestamp: '2 hours ago',
    read: false,
    type: 'ALERT'
  },
  {
    id: 'notif-02',
    title: 'Assignment 3 Posted',
    message: 'Dr. Arindam Mukherjee posted Assignment 3 for Cloud Computing.',
    timestamp: '1 day ago',
    read: true,
    type: 'INFO'
  }
];

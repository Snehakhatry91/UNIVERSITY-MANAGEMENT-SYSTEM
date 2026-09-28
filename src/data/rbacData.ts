import { UserRole, Permission } from '../types/auth';

export const SYSTEM_PERMISSIONS: Permission[] = [
  // Student & Academic
  { id: 'profile:read_self', module: 'Profile', action: 'READ', description: 'View own personal profile' },
  { id: 'profile:update_self', module: 'Profile', action: 'UPDATE', description: 'Update own contact and emergency details' },
  { id: 'profile:read_all', module: 'Profile', action: 'READ', description: 'View any university user profile' },
  { id: 'courses:read_enrolled', module: 'Courses', action: 'READ', description: 'View enrolled courses and materials' },
  { id: 'courses:manage_assigned', module: 'Courses', action: 'UPDATE', description: 'Upload course syllabi and learning modules' },
  { id: 'courses:manage_all', module: 'Courses', action: 'CREATE', description: 'Create, modify, or delete university courses' },
  
  // Attendance & Grading
  { id: 'attendance:read_self', module: 'Attendance', action: 'READ', description: 'View own attendance summary' },
  { id: 'attendance:mark_assigned', module: 'Attendance', action: 'CREATE', description: 'Mark and update attendance for assigned classes' },
  { id: 'attendance:audit_all', module: 'Attendance', action: 'READ', description: 'View university-wide attendance reports' },
  { id: 'marks:read_self', module: 'Examinations', action: 'READ', description: 'View own semester grades and hall ticket' },
  { id: 'marks:submit_assigned', module: 'Examinations', action: 'UPDATE', description: 'Submit internal and exam marks for assigned students' },
  { id: 'marks:publish_official', module: 'Examinations', action: 'EXECUTE', description: 'Officially publish university semester results' },
  
  // Assignments
  { id: 'assignments:submit', module: 'Assignments', action: 'CREATE', description: 'Upload student assignment solutions' },
  { id: 'assignments:create_course', module: 'Assignments', action: 'CREATE', description: 'Create course assignments and due dates' },
  { id: 'assignments:evaluate', module: 'Assignments', action: 'UPDATE', description: 'Grade student assignment submissions' },
  
  // Administration & Governance
  { id: 'users:provision', module: 'User Management', action: 'CREATE', description: 'Provision new student, faculty, and admin accounts' },
  { id: 'users:disable', module: 'User Management', action: 'DELETE', description: 'Lock or deactivate university user accounts' },
  { id: 'roles:assign', module: 'Role Management', action: 'UPDATE', description: 'Bind or revoke RBAC roles from identities' },
  { id: 'notices:publish_all', module: 'Noticeboard', action: 'CREATE', description: 'Broadcast urgent university-wide notices' },
  { id: 'audit:view_logs', module: 'Audit & SIEM', action: 'READ', description: 'Inspect CloudTrail and security event logs' },
  { id: 'db:direct_query', module: 'Database', action: 'EXECUTE', description: 'Direct SQL execution on private RDS (STRICTLY PROHIBITED TO USERS)' }
];

export const ROLE_PERMISSION_MAPPINGS: Record<UserRole, string[]> = {
  STUDENT: [
    'profile:read_self',
    'profile:update_self',
    'courses:read_enrolled',
    'attendance:read_self',
    'marks:read_self',
    'assignments:submit'
  ],
  FACULTY: [
    'profile:read_self',
    'profile:update_self',
    'courses:read_enrolled',
    'courses:manage_assigned',
    'attendance:mark_assigned',
    'marks:submit_assigned',
    'assignments:create_course',
    'assignments:evaluate'
  ],
  ADMINISTRATOR: [
    'profile:read_self',
    'profile:update_self',
    'profile:read_all',
    'courses:read_enrolled',
    'courses:manage_all',
    'attendance:audit_all',
    'marks:publish_official',
    'users:provision',
    'users:disable',
    'roles:assign',
    'notices:publish_all',
    'audit:view_logs'
    // Notice: db:direct_query is deliberately NOT in ADMINISTRATOR role! Cloud IAM Least Privilege!
  ],
  WORKLOAD: [
    'courses:read_enrolled',
    'attendance:audit_all'
  ]
};

export interface CaseStudyRequirement {
  id: string;
  requirementNumber: number;
  title: string;
  caseStudyName: string;
  category: 'Networking' | 'Edge & Compute' | 'Security & Isolation' | 'Hybrid Infrastructure' | 'Identity & Access' | 'Operations';
  status: 'Represented in architecture';
  specRequirement: string;
  visualRepresentation: string;
  interactiveFeature: string;
  auditNotes: string;
}

export const CASE_STUDY_REQUIREMENTS: CaseStudyRequirement[] = [
  {
    id: 'REQ-01',
    requirementNumber: 1,
    title: 'VPC/VNet with 3 Subnet Tiers',
    caseStudyName: 'Requirement 1 — Networking',
    category: 'Networking',
    status: 'Represented in architecture',
    specRequirement: 'VPC/VNet containing three clearly visible network zones: (1) Public Subnet, (2) Application Subnet, and (3) Database Subnet. Visibly labelled with clear inter-tier relationships.',
    visualRepresentation: 'VPC Boundary (10.0.0.0/16) visually enclosing Public Subnet (10.0.1.0/24), Application Subnet (10.0.2.0/24), and Database Subnet (10.0.3.0/24).',
    interactiveFeature: 'Network Architecture view, CIDR subnet selector, and visual layer filtering on the canvas.',
    auditNotes: 'Requirement Validated: All 3 subnets are discrete containers with explicit CIDR allocations and route tables.'
  },
  {
    id: 'REQ-02',
    requirementNumber: 2,
    title: 'Content Delivery Network (CDN)',
    caseStudyName: 'Requirement 2 — CDN',
    category: 'Edge & Compute',
    status: 'Represented in architecture',
    specRequirement: 'Explicitly represents delivery of static content (Images, Videos, CSS, JavaScript) served from edge locations, connected to the user/Internet side.',
    visualRepresentation: 'Edge CDN component connected between Public Internet and Public Subnet ALB, labelled with static asset caching.',
    interactiveFeature: 'Request simulation cache evaluation (Hit/Miss) and component inspection drawer.',
    auditNotes: 'Requirement Validated: Explicitly models static content caching (Images, Videos, CSS, JS) at edge locations.'
  },
  {
    id: 'REQ-03',
    requirementNumber: 3,
    title: 'Load Balancer with Multiple App Servers',
    caseStudyName: 'Requirement 3 — Load Balancing',
    category: 'Edge & Compute',
    status: 'Represented in architecture',
    specRequirement: 'Load Balancer distributing incoming application requests among MULTIPLE application servers (App Server 1, App Server 2, App Server 3).',
    visualRepresentation: 'Application Load Balancer (ALB) with fan-out connection lines to App Server 1, App Server 2, and App Server 3.',
    interactiveFeature: 'Round-robin load distribution in Request Flow simulator with health checks.',
    auditNotes: 'Requirement Validated: Multiple application servers (Instances 1, 2, 3) are individually rendered with simulated health status.'
  },
  {
    id: 'REQ-04',
    requirementNumber: 4,
    title: 'Security Groups / NSGs & Port Control',
    caseStudyName: 'Requirement 4 — Security Groups / NSGs',
    category: 'Security & Isolation',
    status: 'Represented in architecture',
    specRequirement: 'Controlled communication: Internet → Web/ALB (Port 443) → Application (Port 8080) → Database (Port 5432). Strictly NO direct Internet → Database access.',
    visualRepresentation: 'Visual security boundary callouts on each subnet tier with allowed ports and ingress whitelists.',
    interactiveFeature: 'Stateful Security Group rule matrix with protocol, port ranges, and source/dest whitelists.',
    auditNotes: 'Requirement Validated: Ingress matrices strictly drop all direct external traffic to backend subnets.'
  },
  {
    id: 'REQ-05',
    requirementNumber: 5,
    title: 'Private Database (Strictly Isolated)',
    caseStudyName: 'Requirement 5 — Private Database',
    category: 'Security & Isolation',
    status: 'Represented in architecture',
    specRequirement: 'Database located inside the private database subnet with NO direct public Internet access, NO public exposure, and private network access only.',
    visualRepresentation: 'Rendered in Private DB subnet with prominent badges: "PRIVATE DATABASE" and "NO DIRECT PUBLIC ACCESS" and "NO PUBLIC IP".',
    interactiveFeature: 'Component inspector confirming absence of IGW routes and exclusive sg-app-tier access.',
    auditNotes: 'Requirement Validated: Private DB is visually and architecturally segregated with zero public IP address.'
  },
  {
    id: 'REQ-06',
    requirementNumber: 6,
    title: 'Hybrid Networking (VPN to Campus DC)',
    caseStudyName: 'Requirement 6 — Hybrid Networking',
    category: 'Hybrid Infrastructure',
    status: 'Represented in architecture',
    specRequirement: 'Cloud VPC/VNet connected to University Data Center via Site-to-Site VPN / Dedicated Connectivity, showing legacy systems remaining on-premises.',
    visualRepresentation: 'Encrypted IPSec VPN line connecting Cloud VPC to University On-Premises Data Center with Legacy Student System, Legacy ERP, and Campus IdP.',
    interactiveFeature: 'Hybrid connectivity interactive view detailing dual-tunnel IPSec topology and BGP routing.',
    auditNotes: 'Requirement Validated: On-premises data center and legacy heritage systems are visually modeled outside the cloud VPC.'
  },
  {
    id: 'REQ-07',
    requirementNumber: 7,
    title: 'Cloud IAM (Students, Faculty, Admins, Workloads)',
    caseStudyName: 'Requirement 7 — IAM',
    category: 'Identity & Access',
    status: 'Represented in architecture',
    specRequirement: 'IAM clearly represented communicating Identity + Policy + Access to cloud resources for: (1) Students, (2) Faculty, (3) Administrators, and (4) Workloads.',
    visualRepresentation: 'Dedicated Cloud IAM component with explicit identity mapping for Students, Faculty, Admins, and Machine Workloads.',
    interactiveFeature: 'Interactive IAM & STS token evaluation and policy inspector.',
    auditNotes: 'Requirement Validated: All 4 identity classes including non-human Machine Workloads are modeled with distinct policies.'
  },
  {
    id: 'REQ-08',
    requirementNumber: 8,
    title: 'Role-Based Access Control (RBAC)',
    caseStudyName: 'Requirement 8 — RBAC',
    category: 'Identity & Access',
    status: 'Represented in architecture',
    specRequirement: 'Explicitly shows STUDENT, FACULTY, and ADMINISTRATOR roles with differential permissions (Student-level, Faculty-level, Admin-level resources).',
    visualRepresentation: 'Distinct RBAC node in the identity flow and interactive RBAC matrix in the Identity & Access module.',
    interactiveFeature: 'Role selector updating permitted actions, explicitly denied actions, and authorized resource scopes.',
    auditNotes: 'Requirement Validated: Differential permission matrices are visible and interactive for all roles.'
  },
  {
    id: 'REQ-09',
    requirementNumber: 9,
    title: 'Identity Federation (University IdP)',
    caseStudyName: 'Requirement 9 — Federation',
    category: 'Identity & Access',
    status: 'Represented in architecture',
    specRequirement: 'Cloud authentication trusts the University Identity Provider for authentication (University IdP → Federation → Cloud IAM).',
    visualRepresentation: 'Explicit Federation component linking University Identity Provider (Active Directory/LDAP) on-premises to Cloud IAM.',
    interactiveFeature: 'Federated SAML 2.0 / OIDC assertion token flow simulation.',
    auditNotes: 'Requirement Validated: Federation is rendered as an independent trust component distinct from generic IAM.'
  },
  {
    id: 'REQ-10',
    requirementNumber: 10,
    title: 'Single Sign-On (SSO)',
    caseStudyName: 'Requirement 10 — SSO',
    category: 'Identity & Access',
    status: 'Represented in architecture',
    specRequirement: 'One university login granting access to multiple services: LMS, ERP, Library, and other authorized services.',
    visualRepresentation: 'Dedicated SSO component with fan-out to LMS, ERP, Library, and Student Management System.',
    interactiveFeature: 'Unified session launch simulation and Single Logout (SLO) demonstrations.',
    auditNotes: 'Requirement Validated: SSO is visibly distinct and maps one login session to 4 campus service endpoints.'
  },
  {
    id: 'REQ-11',
    requirementNumber: 11,
    title: 'Multi-Factor Authentication (MFA)',
    caseStudyName: 'Requirement 11 — MFA',
    category: 'Identity & Access',
    status: 'Represented in architecture',
    specRequirement: 'Explicitly represents MFA: Username/Password + Second Factor → MFA → Access. Clearly states: "MFA protects privileged accounts and, where appropriate, other users."',
    visualRepresentation: 'Dedicated MFA component in the architecture canvas and identity flow pipeline.',
    interactiveFeature: 'Step-up MFA challenge in the secure login simulator with policy requirements.',
    auditNotes: 'Requirement Validated: Mandatory TOTP/FIDO2 MFA enforcement is modeled for privileged faculty and administrator accounts.'
  },
  {
    id: 'REQ-12',
    requirementNumber: 12,
    title: 'Monitoring and Logging',
    caseStudyName: 'Requirement 12 — Monitoring and Logging',
    category: 'Operations',
    status: 'Represented in architecture',
    specRequirement: 'Records Network events, Identity events, Application, and Database events for Troubleshooting, Auditing, and Security.',
    visualRepresentation: 'Central Monitoring & Logging component receiving telemetry streams from Network, Identity, App Tier, and Database.',
    interactiveFeature: 'Live simulated telemetry stream with real-time incident simulation (Unauthorized Login, High CPU, App Error).',
    auditNotes: 'Requirement Validated: Central SIEM aggregator explicitly indexes Network, Identity, App, and DB events.'
  }
];

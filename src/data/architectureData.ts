import { ArchitectureComponent } from '../types/architecture';

export const ARCHITECTURE_COMPONENTS: Record<string, ArchitectureComponent> = {
  // Users Tier
  'node-students': {
    id: 'node-students',
    name: 'Students',
    title: 'Student Body Users (Undergraduate & Postgraduate)',
    category: 'user',
    subnet: 'external',
    networkLocation: 'Public Internet / Mobile Clients / Campus Wi-Fi',
    purpose: 'Students accessing coursework, lecture slides, assignment submissions, examination transcripts, and library databases.',
    securityRole: 'Least-privilege student body role bounded by Student-level RBAC policies. Authenticated via University IdP.',
    inputs: ['HTTPS Browser requests', 'Mobile app tokens', 'Student SSO credentials'],
    outputs: ['Coursework uploads', 'Course registration requests', 'Library catalog queries'],
    dependencies: ['Edge CDN', 'Identity Provider', 'Single Sign-On'],
    cloudMapping: {
      aws: 'Amazon Cognito User Pool / External SAML IdP',
      azure: 'Microsoft Entra ID (Student Tenant)',
      gcp: 'Firebase Authentication / Cloud Identity',
      openSource: 'Keycloak Directory / Shibboleth IdP'
    },
    securityConsiderations: [
      'Rate-limiting at CDN/WAF perimeter against automated scraping',
      'Zero backend administrative or database network visibility'
    ],
    status: 'healthy'
  },
  'node-faculty': {
    id: 'node-faculty',
    name: 'Faculty',
    title: 'Faculty & Academic Staff (Professors, Instructors, TAs)',
    category: 'user',
    subnet: 'external',
    networkLocation: 'Campus Workstations / Remote HTTPS with Mandatory MFA',
    purpose: 'Faculty managing course modules, posting syllabi, grading student coursework, and publishing final examination marks.',
    securityRole: 'Privileged academic role; requires mandatory Multi-Factor Authentication (MFA) for grade modification.',
    inputs: ['Grading inputs', 'Course syllabi', 'Attendance rosters', 'MFA OTP / Security Key tokens'],
    outputs: ['Final grade submissions', 'Course announcements', 'Academic advisory feedback'],
    dependencies: ['Identity Provider', 'MFA Service', 'Single Sign-On'],
    cloudMapping: {
      aws: 'AWS IAM Identity Center (Faculty Group)',
      azure: 'Microsoft Entra ID Conditional Access',
      gcp: 'Google Cloud Identity Enterprise',
      openSource: 'Keycloak 2FA / FreeIPA'
    },
    securityConsiderations: [
      'Mandatory secondary MFA verification for all grade submissions',
      'Audit logging of every grade edit in central logging'
    ],
    status: 'healthy'
  },
  'node-admins': {
    id: 'node-admins',
    name: 'Administrators',
    title: 'Cloud & University IT Administrators',
    category: 'user',
    subnet: 'external',
    networkLocation: 'Secured Admin Network / Dedicated VPN Tunnel',
    purpose: 'Systems engineers, registrar admins, and security officers managing user lifecycle, security policies, and cloud infrastructure.',
    securityRole: 'High-privilege system administrator role. Requires hardware token MFA, session recording, and Just-In-Time role elevation.',
    inputs: ['Infrastructure-as-Code commands', 'User lifecycle events', 'Break-glass access tokens'],
    outputs: ['Security Group updates', 'IAM policy assignments', 'SIEM incident reviews'],
    dependencies: ['Cloud IAM', 'MFA Authenticator', 'Central Logging'],
    cloudMapping: {
      aws: 'AWS IAM Identity Center + AWS Organizations',
      azure: 'Microsoft Entra Privileged Identity Management (PIM)',
      gcp: 'Google Cloud Privileged Access Manager',
      openSource: 'Teleport / HashiCorp Boundary'
    },
    securityConsiderations: [
      'Zero standing administrative privileges (ephemeral role assumption)',
      'Immutable session audit logs forwarded to SIEM'
    ],
    status: 'healthy'
  },
  'node-workloads': {
    id: 'node-workloads',
    name: 'Workloads (Machine Identities)',
    title: 'Workload & Service Machine Accounts',
    category: 'identity',
    subnet: 'application',
    networkLocation: 'Application Subnet (Machine-to-Machine)',
    purpose: 'Autonomous background daemons, microservices, and scheduled batch jobs executing student database queries and hybrid sync.',
    securityRole: 'Non-human machine identity with strictly scoped short-lived STS tokens. Zero human interactive login rights.',
    inputs: ['Scheduled batch triggers', 'API calls from microservices'],
    outputs: ['SQL queries to private database (Port 5432)', 'Hybrid ERP sync requests (Port 1433)'],
    dependencies: ['Cloud IAM', 'University Management Database'],
    cloudMapping: {
      aws: 'AWS IAM Roles for Service Accounts (IRSA) / Instance Profiles',
      azure: 'Azure Managed Identities for Azure Resources',
      gcp: 'Google Cloud Workload Identity',
      openSource: 'SPIFFE / SPIRE'
    },
    securityConsiderations: [
      'Zero hardcoded API keys; 1-hour ephemeral STS tokens only',
      'Strict IAM permission boundaries restricting access strictly to SMS DB'
    ],
    status: 'healthy'
  },

  // Edge & Perimeter
  'node-internet': {
    id: 'node-internet',
    name: 'Internet',
    title: 'Public Internet & DNS Resolution',
    category: 'edge',
    subnet: 'external',
    networkLocation: 'Public WAN',
    purpose: 'Global transport network delivering HTTPS requests from students, faculty, and administrators to university endpoints.',
    securityRole: 'Untrusted public network; all traffic must be encrypted with TLS 1.3 and filtered by edge WAF/DDoS defenses.',
    inputs: ['Public IPv4 / IPv6 client traffic'],
    outputs: ['Encrypted HTTPS requests routed to Edge CDN'],
    dependencies: ['Authoritative Campus DNS'],
    cloudMapping: {
      aws: 'Amazon Route 53 + AWS Shield',
      azure: 'Azure DNS + Azure DDoS Protection',
      gcp: 'Cloud DNS + Cloud Armor',
      openSource: 'BIND9 / CoreDNS'
    },
    securityConsiderations: [
      'HSTS preloaded on university domain',
      'DDoS mitigation absorbs L3/L4 volumetric floods'
    ],
    status: 'healthy'
  },
  'node-cdn': {
    id: 'node-cdn',
    name: 'CDN (Content Delivery Network)',
    title: 'Edge Caching — Images, Videos, CSS, JavaScript',
    category: 'edge',
    subnet: 'public',
    networkLocation: 'Global Edge Points of Presence (PoPs)',
    purpose: 'Caches and delivers static content (Images, Videos, CSS, JavaScript bundles, recorded lecture slides) from edge locations close to students and faculty, reducing origin load and latency.',
    securityRole: 'Edge perimeter shielding: terminates TLS 1.3, blocks malicious bot signatures, and proxies dynamic API traffic to the Load Balancer.',
    inputs: ['Static asset requests (.js, .css, .png, .mp4)', 'Dynamic API requests (proxied)'],
    outputs: ['Cached static assets returned immediately from Edge', 'Dynamic HTTPS traffic forwarded to Load Balancer'],
    dependencies: ['Internet Gateway', 'Application Load Balancer'],
    cloudMapping: {
      aws: 'Amazon CloudFront',
      azure: 'Azure Front Door / Azure CDN',
      gcp: 'Google Cloud CDN',
      openSource: 'Varnish HTTP Cache / Nginx Edge Proxy'
    },
    securityConsiderations: [
      'Serves static content directly from edge locations to minimize origin load',
      'TLS 1.3 enforced with strict cipher suites',
      'Dynamic API calls forwarded with custom origin validation headers'
    ],
    status: 'healthy'
  },

  // Public Subnet Components
  'node-igw': {
    id: 'node-igw',
    name: 'Internet Gateway (IGW)',
    title: 'VPC Internet Ingress / Egress Gateway',
    category: 'ingress',
    subnet: 'public',
    networkLocation: 'Cloud VPC Edge (Public Subnet: 10.0.1.0/24)',
    purpose: 'Enables bidirectional point-to-point communication between public VPC resources and the Internet.',
    securityRole: 'Route target for public subnet route tables only. Ingress strictly limited to ALB.',
    inputs: ['Inbound public HTTPS packets (TCP 443)'],
    outputs: ['Routed traffic to Application Load Balancer'],
    dependencies: ['VPC Route Table'],
    cloudMapping: {
      aws: 'AWS Internet Gateway (IGW)',
      azure: 'Azure Public IP / Virtual Network Gateway',
      gcp: 'Cloud Router / VPC Ingress',
      openSource: 'VyOS / iptables Software Gateway'
    },
    securityConsiderations: [
      'No route table association with Application or Database private subnets'
    ],
    status: 'healthy'
  },
  'node-alb': {
    id: 'node-alb',
    name: 'Load Balancer (ALB)',
    title: 'Application Load Balancer (Dual-AZ)',
    category: 'ingress',
    subnet: 'public',
    networkLocation: 'Public Subnet (10.0.1.0/24)',
    purpose: 'Distributes incoming application requests across multiple application servers (App Server 1, App Server 2, App Server 3) with active health check monitoring.',
    securityRole: 'Performs TLS certificate termination, HTTP header inspection, cookie stickiness, and health checks on downstream app servers.',
    inputs: ['HTTPS traffic on Port 443 from CDN and clients'],
    outputs: ['Balanced HTTP traffic on Port 8080 to App Server 1, 2, and 3'],
    dependencies: ['Public Subnet IGW', 'Compute Target Group'],
    cloudMapping: {
      aws: 'AWS Application Load Balancer (ALB)',
      azure: 'Azure Application Gateway v2',
      gcp: 'Cloud Load Balancing (External HTTPS)',
      openSource: 'HAProxy / Traefik / Envoy Proxy'
    },
    securityConsiderations: [
      'Inbound Security Group allows strictly HTTPS 443; rejects all management ports',
      'Polls /healthz every 15 seconds to isolate unhealthy instances automatically'
    ],
    status: 'healthy'
  },

  // Security Groups / NSGs
  'node-sg-public': {
    id: 'node-sg-public',
    name: 'Security Group: Public / ALB',
    title: 'Virtual Firewall (Public Subnet Boundary)',
    category: 'ingress',
    subnet: 'public',
    networkLocation: 'Public Subnet Boundary (10.0.1.0/24)',
    purpose: 'Controls ingress to Load Balancer: permits TCP 443 (HTTPS) from Internet/CDN; blocks all other inbound ports.',
    securityRole: 'Stateful packet inspection at public entry point.',
    inputs: ['Internet HTTPS traffic (Port 443)'],
    outputs: ['Authorized traffic allowed to ALB'],
    dependencies: ['VPC Stateful Firewall Engine'],
    cloudMapping: {
      aws: 'AWS Security Group (sg-alb-tier)',
      azure: 'Azure Network Security Group (nsg-public-subnet)',
      gcp: 'VPC Firewall Rule (allow-https-alb)',
      openSource: 'iptables / nftables'
    },
    securityConsiderations: [
      'Explicit rule: ALLOW TCP 443 from 0.0.0.0/0; DEFAULT DENY ALL'
    ],
    status: 'healthy'
  },
  'node-sg-app': {
    id: 'node-sg-app',
    name: 'Security Group: App Tier',
    title: 'Virtual Firewall (Application Subnet Boundary)',
    category: 'application',
    subnet: 'application',
    networkLocation: 'Application Subnet Boundary (10.0.2.0/24)',
    purpose: 'Restricts ingress to application servers: accepts TCP 8080 STRICTLY from ALB Security Group; blocks direct Internet traffic.',
    securityRole: 'Enforces network isolation between public ingress and compute tier.',
    inputs: ['Port 8080 traffic originating from sg-alb-tier'],
    outputs: ['Allowed traffic to App Server 1, 2, 3'],
    dependencies: ['Load Balancer Security Group'],
    cloudMapping: {
      aws: 'AWS Security Group (sg-app-tier)',
      azure: 'Azure Network Security Group (nsg-app-subnet)',
      gcp: 'VPC Firewall Rule (allow-app-from-alb)',
      openSource: 'iptables / nftables'
    },
    securityConsiderations: [
      'Strict source filtering: sg-alb-tier ONLY. Zero direct Internet ingress.'
    ],
    status: 'healthy'
  },
  'node-sg-db': {
    id: 'node-sg-db',
    name: 'Security Group: Database Tier',
    title: 'Virtual Firewall (Database Subnet Boundary)',
    category: 'database',
    subnet: 'database',
    networkLocation: 'Database Subnet Boundary (10.0.3.0/24)',
    purpose: 'Restricts database access: permits TCP 5432 (PostgreSQL) STRICTLY from App Tier Security Group (sg-app-tier); ZERO direct Internet access.',
    securityRole: 'Guards relational database against any unauthorized connection.',
    inputs: ['Port 5432 SQL queries originating from sg-app-tier'],
    outputs: ['Allowed query connections to University DB'],
    dependencies: ['App Tier Security Group'],
    cloudMapping: {
      aws: 'AWS Security Group (sg-db-tier)',
      azure: 'Azure Network Security Group (nsg-db-subnet)',
      gcp: 'VPC Firewall Rule (allow-pg-from-app)',
      openSource: 'iptables / nftables'
    },
    securityConsiderations: [
      'STRICTLY PRIVATE: ZERO Internet ingress; only sg-app-tier allowed on port 5432'
    ],
    status: 'healthy'
  },

  // Application Servers (Application Subnet)
  'node-app-1': {
    id: 'node-app-1',
    name: 'Application Server 1',
    title: 'SMS Web & API Microservice Instance 1 (AZ-1)',
    category: 'application',
    subnet: 'application',
    networkLocation: 'Application Subnet (10.0.2.0/24) — AZ-1',
    purpose: 'Executes university business logic: course registration, grading APIs, student profile services.',
    securityRole: 'Stateless compute instance in private subnet with no public IP. Accepts traffic solely from ALB on Port 8080.',
    inputs: ['Port 8080 HTTP requests from ALB', 'JWT/SAML security claims'],
    outputs: ['Queries to Private DB (Port 5432)', 'Hybrid sync queries via VPN (Port 1433)'],
    dependencies: ['Load Balancer', 'University Management Database'],
    cloudMapping: {
      aws: 'AWS EC2 / ECS Fargate',
      azure: 'Azure VM Scale Sets / Container Apps',
      gcp: 'Compute Engine / Cloud Run',
      openSource: 'Kubernetes Worker Pods / Docker Swarm'
    },
    securityConsiderations: [
      'No Public IP address; isolated in private application subnet',
      'Stateless execution: local storage stores no user session state'
    ],
    status: 'healthy'
  },
  'node-app-2': {
    id: 'node-app-2',
    name: 'Application Server 2',
    title: 'SMS Web & API Microservice Instance 2 (AZ-2)',
    category: 'application',
    subnet: 'application',
    networkLocation: 'Application Subnet (10.0.2.0/24) — AZ-2',
    purpose: 'Redundant instance ensuring high availability and fault tolerance during peak course enrollment rushes.',
    securityRole: 'Stateless compute instance in private subnet with no public IP. Identical configuration to Instance 1.',
    inputs: ['Port 8080 HTTP requests from ALB', 'JWT/SAML security claims'],
    outputs: ['Queries to Private DB (Port 5432)', 'Hybrid sync queries via VPN (Port 1433)'],
    dependencies: ['Load Balancer', 'University Management Database'],
    cloudMapping: {
      aws: 'AWS EC2 / ECS Fargate',
      azure: 'Azure VM Scale Sets / Container Apps',
      gcp: 'Compute Engine / Cloud Run',
      openSource: 'Kubernetes Worker Pods / Docker Swarm'
    },
    securityConsiderations: [
      'Multi-AZ placement ensures tolerance against single-datacenter outages'
    ],
    status: 'healthy'
  },
  'node-app-3': {
    id: 'node-app-3',
    name: 'Application Server 3',
    title: 'SMS Web & API Microservice Instance 3 (AZ-3)',
    category: 'application',
    subnet: 'application',
    networkLocation: 'Application Subnet (10.0.2.0/24) — AZ-3',
    purpose: 'Handles background university batch processing, transcript PDF generation, and automated student notifications.',
    securityRole: 'Stateless compute instance in private subnet with no public IP.',
    inputs: ['Port 8080 HTTP requests from ALB', 'Async task requests'],
    outputs: ['Queries to Private DB (Port 5432)', 'Hybrid sync queries via VPN (Port 1433)'],
    dependencies: ['Load Balancer', 'University Management Database'],
    cloudMapping: {
      aws: 'AWS EC2 / ECS Fargate',
      azure: 'Azure VM Scale Sets / Container Apps',
      gcp: 'Compute Engine / Cloud Run',
      openSource: 'Kubernetes Worker Pods / Docker Swarm'
    },
    securityConsiderations: [
      'Forwards all execution telemetry to central monitoring daemon'
    ],
    status: 'healthy'
  },

  // Database Tier (Database Subnet)
  'node-db': {
    id: 'node-db',
    name: 'Private Database',
    title: 'University Management Database (PostgreSQL Master)',
    category: 'database',
    subnet: 'database',
    networkLocation: 'Private Database Subnet (10.0.3.0/24) — STRICTLY ISOLATED',
    purpose: 'Stores institutional student records, enrollment catalogs, examination transcripts, tuition ledgers, and academic credentials.',
    securityRole: 'PRIVATE DATABASE — NO DIRECT PUBLIC ACCESS. No public IP address, no IGW route. Ingress strictly limited to sg-app-tier on port 5432.',
    inputs: ['SQL queries (Port 5432) originating exclusively from App Tier Security Group (sg-app-tier)'],
    outputs: ['Encrypted result sets', 'Replication stream to read replica', 'Point-in-time automated snapshots'],
    dependencies: ['App Tier Security Group'],
    cloudMapping: {
      aws: 'Amazon RDS for PostgreSQL (Multi-AZ)',
      azure: 'Azure Database for PostgreSQL Flexible Server',
      gcp: 'Cloud SQL for PostgreSQL (HA)',
      openSource: 'PostgreSQL 16 High Availability Cluster + PgBouncer'
    },
    securityConsiderations: [
      'STRICTLY PRIVATE: NO DIRECT PUBLIC ACCESS and NO PUBLIC IP',
      'No route to Internet Gateway or NAT Gateway',
      'Encryption at rest with customer-managed KMS key (AES-256)',
      'TLS 1.3 enforced for all query connections in transit'
    ],
    status: 'healthy',
    details: {
      ipRange: '10.0.3.15/32 (Private Only)',
      allowedPorts: ['PostgreSQL 5432 (Inbound: sg-app-tier only)'],
      encryption: 'AES-256 KMS At Rest, TLS 1.3 In Transit',
      privateOnly: true
    }
  },

  // Hybrid Networking & University Data Center
  'node-vpn': {
    id: 'node-vpn',
    name: 'VPN / Dedicated Connectivity',
    title: 'Site-to-Site IPSec VPN Hybrid Interconnect',
    category: 'hybrid',
    subnet: 'hybrid',
    networkLocation: 'Cloud Virtual Private Gateway ↔ Campus Customer Gateway',
    purpose: 'Establishes secure, encrypted, bidirectional hybrid communication between the Cloud VPC and the University On-Premises Data Center.',
    securityRole: 'Secures hybrid data exchange over public networks using AES-256-GCM encryption, SHA-384 hashing, and BGP dynamic routing.',
    inputs: ['Encrypted IPSec packets (UDP 500 / UDP 4500) from Cloud App Tier and Campus DC'],
    outputs: ['Decrypted legacy student records to cloud', 'Financial sync batches to on-prem ERP'],
    dependencies: ['Cloud Virtual Private Gateway', 'Campus Customer Gateway'],
    cloudMapping: {
      aws: 'AWS Site-to-Site VPN (or AWS Direct Connect)',
      azure: 'Azure VPN Gateway (or Azure ExpressRoute)',
      gcp: 'Cloud VPN (HA-VPN) (or Cloud Interconnect)',
      openSource: 'StrongSwan IPSec / WireGuard Site-to-Site'
    },
    securityConsiderations: [
      'Dual active-active IPSec tunnels with automated BGP failover',
      'Encrypted transit between 10.0.2.0/24 and 172.16.0.0/16'
    ],
    status: 'healthy'
  },
  'node-onprem-dc': {
    id: 'node-onprem-dc',
    name: 'University Data Center',
    title: 'Campus On-Premises Data Center (172.16.0.0/16)',
    category: 'hybrid',
    subnet: 'on-premises',
    networkLocation: 'Campus Physical Server Room (172.16.0.0/16)',
    purpose: 'Houses heritage university systems that remain on-premises: Legacy Student System, Legacy ERP, and University Identity Provider.',
    securityRole: 'Protected behind campus enterprise perimeter firewalls; accessible from cloud exclusively via encrypted Site-to-Site VPN.',
    inputs: ['Queries from Cloud App Tier via IPSec VPN (10.0.2.0/24)'],
    outputs: ['Historical transcripts, payroll batches, SAML authentication assertions'],
    dependencies: ['Campus Core Switch', 'VPN Concentrator'],
    cloudMapping: {
      aws: 'On-Premises Customer Gateway (Cisco ASA / Fortinet / Palo Alto)',
      azure: 'On-Premises Local Network Gateway',
      gcp: 'On-Premises Router / BGP Peer',
      openSource: 'Enterprise VMware ESXi / KVM Cluster'
    },
    securityConsiderations: [
      'Physical biometric badge access and CCTV monitoring at campus server room',
      'Zero external Internet port forwarding allowed'
    ],
    status: 'healthy'
  },
  'node-legacy-sms': {
    id: 'node-legacy-sms',
    name: 'Legacy Student System',
    title: 'Heritage Student Records & Transcripts Archive',
    category: 'hybrid',
    subnet: 'on-premises',
    networkLocation: 'Campus Data Center (172.16.10.12)',
    purpose: 'Maintains historical student transcripts, alumni degree certifications, and long-term academic archives compiled over past decades.',
    securityRole: 'Legacy environment protected from external exposure; accessible solely via internal VPN queries.',
    inputs: ['Historical query requests from Cloud App servers via VPN'],
    outputs: ['Archived degree certifications and historical grade records'],
    dependencies: ['Site-to-Site VPN', 'University Data Center'],
    cloudMapping: {
      aws: 'Migratable via AWS Application Migration Service (MGN)',
      azure: 'Azure Migrate Appliance',
      gcp: 'Google Cloud Migrate for Compute Engine',
      openSource: 'Legacy Windows Server / AIX / Red Hat Enterprise'
    },
    securityConsiderations: [
      'Read-only replica view exposed to cloud queries where possible',
      'Network segmentation prevents legacy vulnerabilities from impacting cloud tier'
    ],
    status: 'healthy'
  },
  'node-legacy-erp': {
    id: 'node-legacy-erp',
    name: 'Legacy ERP & Finance',
    title: 'University Accounting, Payroll & Vendor ERP',
    category: 'hybrid',
    subnet: 'on-premises',
    networkLocation: 'Campus Data Center (172.16.20.15)',
    purpose: 'Handles institutional financial ledgers, faculty payroll disbursements, research grants tracking, and campus vendor procurement.',
    securityRole: 'High-security financial database zone; allows only authenticated batch synchronization over encrypted VPN.',
    inputs: ['Tuition payment reconciliation records from Cloud SMS'],
    outputs: ['Fee payment verification status, balance confirmations'],
    dependencies: ['Site-to-Site VPN'],
    cloudMapping: {
      aws: 'SAP on AWS / Oracle on AWS / On-Prem Integration',
      azure: 'SAP on Azure / Oracle Cloud Interconnect',
      gcp: 'Bare Metal Solution for ERP',
      openSource: 'Custom SQL Server / Oracle Database'
    },
    securityConsiderations: [
      'PCI-DSS compliance boundaries maintained within campus perimeter',
      'Cryptographic checksum validation on all reconciliation batch transfers'
    ],
    status: 'healthy'
  },
  'node-onprem-idp': {
    id: 'node-onprem-idp',
    name: 'University Identity Provider',
    title: 'Campus Authoritative Directory (Active Directory / LDAP / SAML IdP)',
    category: 'identity',
    subnet: 'on-premises',
    networkLocation: 'Campus Data Center (172.16.5.10)',
    purpose: 'Authoritative source of identity for all university personnel (students, faculty, administrative staff). Issues signed SAML 2.0 assertions to Cloud Authentication.',
    securityRole: 'Single source of truth for passwords and institutional roles; issues cryptographically signed assertions.',
    inputs: ['Authentication credential requests (Username + Password)'],
    outputs: ['Signed SAML 2.0 Assertions / OIDC Tokens with user claims'],
    dependencies: ['Campus Active Directory / OpenLDAP'],
    cloudMapping: {
      aws: 'Active Directory federated with AWS IAM Identity Center',
      azure: 'Microsoft Entra Connect Sync / Cloud Sync',
      gcp: 'Google Cloud Directory Sync (GCDS)',
      openSource: 'FreeIPA / Shibboleth IdP / Keycloak Enterprise'
    },
    securityConsiderations: [
      'Password hashes never exported to cloud; authentication verified on-premises',
      'Assertion signing keys rotated annually using institutional HSM'
    ],
    status: 'healthy'
  },

  // Identity & Access Flow (Federation, IAM, RBAC, MFA, SSO, Services)
  'node-federation': {
    id: 'node-federation',
    name: 'Federation',
    title: 'Identity Federation & SAML 2.0 / OIDC Trust Broker',
    category: 'identity',
    subnet: 'public',
    networkLocation: 'Identity Trust Boundary (HTTPS 443)',
    purpose: 'Establishes cryptographic trust between the University Identity Provider and the Cloud Authentication system. The cloud environment trusts the university IdP without replicating passwords.',
    securityRole: 'Cryptographically validates digital signatures on SAML assertions and issues scoped ephemeral STS access tokens.',
    inputs: ['Signed SAML Response from University Identity Provider'],
    outputs: ['Validated identity claims forwarded to Cloud IAM'],
    dependencies: ['University Identity Provider', 'Cloud IAM'],
    cloudMapping: {
      aws: 'IAM SAML 2.0 Identity Provider / Cognito SAML IdP',
      azure: 'Microsoft Entra ID Federated Enterprise Application',
      gcp: 'Google Cloud Workforce Identity Federation',
      openSource: 'Keycloak Identity Brokering / Shibboleth SP'
    },
    securityConsiderations: [
      'Replay attack prevention through unique assertion ID validation and 5-minute skew window',
      'Digital signature verification using institutional X.509 certificate'
    ],
    status: 'healthy'
  },
  'node-cloud-iam': {
    id: 'node-cloud-iam',
    name: 'IAM (Cloud IAM)',
    title: 'Cloud Identity & Access Management (Identity + Policy + Access)',
    category: 'identity',
    subnet: 'public',
    networkLocation: 'Cloud Control Plane Service',
    purpose: 'Central IAM engine managing identities and policies for: (1) Students, (2) Faculty, (3) Administrators, and (4) Workloads. Controls access to all cloud resources.',
    securityRole: 'Enforces least-privilege policies, evaluates condition keys, and issues short-lived STS credentials.',
    inputs: ['Validated user claims from Federation broker', 'Microservice API authorization checks'],
    outputs: ['Temporary STS session credentials with least-privilege permission policy'],
    dependencies: ['Federation', 'RBAC'],
    cloudMapping: {
      aws: 'AWS Identity and Access Management (IAM) + IAM Roles',
      azure: 'Microsoft Entra ID + Azure RBAC',
      gcp: 'Google Cloud IAM (Roles & Service Accounts)',
      openSource: 'Open Policy Agent (OPA) / Keycloak IAM'
    },
    securityConsiderations: [
      'Zero standing administrative root credentials',
      'Covers human identities (Students, Faculty, Admins) and machine Workloads'
    ],
    status: 'healthy'
  },
  'node-rbac': {
    id: 'node-rbac',
    name: 'RBAC (Role-Based Access Control)',
    title: 'Role-Based Access Control: Student / Faculty / Admin Roles',
    category: 'identity',
    subnet: 'public',
    networkLocation: 'Cloud Policy Evaluation Engine',
    purpose: 'Enforces distinct permission boundaries: STUDENT (Student-level authorized resources), FACULTY (Faculty-level authorized resources), ADMINISTRATOR (Administrative resources).',
    securityRole: 'Separates authorization from authentication; grants access strictly according to verified institutional roles.',
    inputs: ['User identity claim from Cloud IAM'],
    outputs: ['Role-scoped resource access permissions'],
    dependencies: ['Cloud IAM'],
    cloudMapping: {
      aws: 'AWS IAM Managed Policies + Permission Boundaries',
      azure: 'Azure Built-in & Custom RBAC Roles',
      gcp: 'Google Cloud IAM Predefined Roles',
      openSource: 'Casbin / OPA Gatekeeper / Keycloak RBAC'
    },
    securityConsiderations: [
      'Students cannot modify grades or view administrative resources',
      'Faculty can only modify grades for assigned course modules'
    ],
    status: 'healthy'
  },
  'node-mfa': {
    id: 'node-mfa',
    name: 'MFA (Multi-Factor Authentication)',
    title: 'Multi-Factor Authentication (Protects Privileged Accounts)',
    category: 'identity',
    subnet: 'public',
    networkLocation: 'Cloud Identity Verification Layer',
    purpose: 'Requires Username/Password + Second Authentication Factor → MFA → Access. MFA protects privileged accounts (Administrators & Faculty) and, where appropriate, other users.',
    securityRole: 'Guards privileged portals against compromised passwords. Mandatory for administrative and grade-altering actions.',
    inputs: ['Primary password verification', 'Second factor: 6-digit TOTP code / FIDO2 security key'],
    outputs: ['MFA verification token attached to session claim'],
    dependencies: ['University Identity Provider', 'Cloud IAM'],
    cloudMapping: {
      aws: 'AWS IAM MFA / Cognito MFA (TOTP / WebAuthn)',
      azure: 'Microsoft Entra Multi-Factor Authentication',
      gcp: 'Google 2-Step Verification with Titan Security Keys',
      openSource: 'privacyIDEA / FreeOTP / Duo Integration'
    },
    securityConsiderations: [
      'MFA protects privileged accounts and, where appropriate, other users',
      'Enforces phishing-resistant FIDO2 hardware tokens for system administrators'
    ],
    status: 'healthy'
  },
  'node-sso': {
    id: 'node-sso',
    name: 'SSO (Single Sign-On)',
    title: 'Campus Single Sign-On: One University Login → Multiple Services',
    category: 'identity',
    subnet: 'public',
    networkLocation: 'Campus Application Ingress (sso.university.edu)',
    purpose: 'One university login provides seamless authenticated access to multiple authorized services: LMS, ERP, Library, and Student Management System.',
    securityRole: 'Manages user session cookies and OIDC refresh tokens. Enforces centralized Single Logout (SLO).',
    inputs: ['Single verified authentication session from MFA / IAM'],
    outputs: ['Authorized session tokens forwarded to LMS, ERP, Library, and SMS'],
    dependencies: ['Cloud IAM', 'RBAC', 'MFA'],
    cloudMapping: {
      aws: 'AWS IAM Identity Center Application Portal',
      azure: 'Microsoft My Apps Portal',
      gcp: 'Google Workspace Cloud Identity Dashboard',
      openSource: 'Apereo CAS / Keycloak SSO Portal'
    },
    securityConsiderations: [
      'One login session grants access to authorized university services',
      'Centralized session revocation (Single Logout / SLO) across all connected portals'
    ],
    status: 'healthy'
  },

  // Authorized Services Connected to SSO
  'node-service-lms': {
    id: 'node-service-lms',
    name: 'LMS (Learning Management System)',
    title: 'Courseware & Online Learning (Moodle / Canvas)',
    category: 'application',
    subnet: 'application',
    networkLocation: 'University Application Tier (lms.university.edu)',
    purpose: 'Online learning platform hosting course syllabi, lecture slides, quizzes, and student assignment submissions.',
    securityRole: 'Authenticated via SSO; role determines instructor vs. student course privileges.',
    inputs: ['SSO session claim', 'Student assignment uploads'],
    outputs: ['Coursework evaluation data', 'Quiz grades'],
    dependencies: ['Single Sign-On (SSO)'],
    cloudMapping: {
      aws: 'Containerized Moodle / Canvas LMS on ECS Fargate',
      azure: 'Azure Container Apps (LMS Service)',
      gcp: 'Cloud Run (LMS Service)',
      openSource: 'Moodle / Canvas LMS Open Source'
    },
    securityConsiderations: ['Access restricted to authenticated SSO sessions'],
    status: 'healthy'
  },
  'node-service-erp': {
    id: 'node-service-erp',
    name: 'ERP (Enterprise Resource Planning)',
    title: 'University Financial & Administration ERP Portal',
    category: 'application',
    subnet: 'application',
    networkLocation: 'University Application Tier (erp.university.edu)',
    purpose: 'Faculty payroll, institutional accounting, student fee tuition receipts, and vendor procurement portal.',
    securityRole: 'High-privilege financial portal; accessible via SSO with mandatory MFA verification.',
    inputs: ['SSO session claim with MFA proof', 'Fee reconciliation requests'],
    outputs: ['Financial ledger records synced over hybrid VPN'],
    dependencies: ['Single Sign-On (SSO)', 'Site-to-Site VPN'],
    cloudMapping: {
      aws: 'SAP / Oracle / Custom ERP Web Tier',
      azure: 'ERP Application Gateway Integration',
      gcp: 'ERP Web Frontend',
      openSource: 'ERPNext / Odoo Community'
    },
    securityConsiderations: ['Requires verified MFA token on all financial workflows'],
    status: 'healthy'
  },
  'node-service-library': {
    id: 'node-service-library',
    name: 'Library (Digital University Library)',
    title: 'Academic Journals, E-Books & Research Database',
    category: 'application',
    subnet: 'application',
    networkLocation: 'University Application Tier (library.university.edu)',
    purpose: 'Provides students and faculty with authenticated access to academic journals (EBSCO, JSTOR, IEEE Xplore) and e-book catalogs.',
    securityRole: 'Authenticated via SSO; verifies active institutional enrollment status.',
    inputs: ['SSO session claim', 'Journal search queries'],
    outputs: ['Licensed academic journal downloads', 'E-book loans'],
    dependencies: ['Single Sign-On (SSO)'],
    cloudMapping: {
      aws: 'Library Proxy / EZproxy on AWS EC2',
      azure: 'Azure App Service (Library Portal)',
      gcp: 'Cloud Run (Library Catalog)',
      openSource: 'Koha Library Management / EZproxy'
    },
    securityConsiderations: ['Restricts licensed publisher access to enrolled university members'],
    status: 'healthy'
  },
  'node-service-sms': {
    id: 'node-service-sms',
    name: 'SMS (Student Management System)',
    title: 'Core Student Academic Records & Enrollment Portal',
    category: 'application',
    subnet: 'application',
    networkLocation: 'University Application Tier (sms.university.edu)',
    purpose: 'Central academic system managing student profiles, course electives enrollment, attendance tracking, and degree audit transcripts.',
    securityRole: 'Core university microservice tier; connects directly to Private Database in private DB subnet.',
    inputs: ['SSO session claim', 'Enrollment requests', 'Grading updates from Faculty'],
    outputs: ['SQL queries to Private Database (Port 5432)', 'Hybrid sync queries via VPN'],
    dependencies: ['Single Sign-On (SSO)', 'Load Balancer', 'Private Database'],
    cloudMapping: {
      aws: 'SMS Microservices on AWS ECS Fargate',
      azure: 'Azure Container Apps (SMS Cluster)',
      gcp: 'Google Kubernetes Engine (GKE)',
      openSource: 'Custom Spring Boot / Node.js Microservices'
    },
    securityConsiderations: ['Queries Private Database over private port 5432 with zero public IP'],
    status: 'healthy'
  },

  // Monitoring & Logging (Operations)
  'node-monitoring': {
    id: 'node-monitoring',
    name: 'Monitoring & Logging',
    title: 'Central Observability, SIEM & Telemetry Aggregator',
    category: 'monitoring',
    subnet: 'public',
    networkLocation: 'Cloud Management Service (Private VPC Peering / VPC Endpoints)',
    purpose: 'Records Network events, Identity events, Application, and Database events for Troubleshooting, Auditing, and Security.',
    securityRole: 'Real-time threat detection, anomaly correlation, compliance auditing, and synthetic incident alerting.',
    inputs: [
      'Network Events: VPC Flow Logs (accepted & rejected packets), ALB access logs',
      'Identity Events: Authentication failures, SAML assertion logs, IAM role assumptions',
      'Application Events: HTTP 500 error traces, latency spans, microservice exceptions',
      'Database Events: Slow query logs, connection pool saturation, DDL schema audit'
    ],
    outputs: [
      'Unified SIEM audit trails for compliance',
      'Real-time automated security alerts (Unauthorized Login, High CPU, App Error)',
      'Forensic event records for troubleshooting'
    ],
    dependencies: ['All Architecture Tier Log Agents'],
    cloudMapping: {
      aws: 'Amazon CloudWatch + AWS CloudTrail + GuardDuty',
      azure: 'Azure Monitor + Log Analytics + Microsoft Sentinel',
      gcp: 'Google Cloud Operations Suite (Cloud Logging & Monitoring)',
      openSource: 'ELK Stack (Elasticsearch, Logstash, Kibana) + Prometheus/Grafana'
    },
    securityConsiderations: [
      'Records Network events and Identity events for Troubleshooting, Auditing, and Security',
      'Immutable WORM log retention prevents tampering by attackers'
    ],
    status: 'healthy'
  }
};

import { SecurityControl } from '../types/architecture';

export const SECURITY_CONTROLS: SecurityControl[] = [
  {
    id: 'SEC-01',
    title: 'Network Segmentation (3-Tier Subnet Isolation)',
    category: 'Network Security',
    severity: 'Critical',
    principle: 'Network Segregation & Boundary Defense',
    implementation: 'The VPC is partitioned into three discrete subnets: Public (ALB/IGW), Application (Microservices), and Private Database. Route tables prevent inter-subnet bypass and strictly isolate databases from the Internet.',
    referenceStandard: 'NIST SP 800-207, ISO 27001 A.13.1'
  },
  {
    id: 'SEC-02',
    title: 'Stateful Security Groups & NSGs',
    category: 'Network Security',
    severity: 'Critical',
    principle: 'Least Functional Ingress Allowance',
    implementation: 'Layer 4 virtual firewalls filter traffic statefully. ALB accepts only TCP 443; App tier accepts only TCP 8080 from ALB security group; DB accepts only TCP 5432 from App tier security group. All other ingress is dropped.',
    referenceStandard: 'CIS Benchmarks Section 5, PCI-DSS Req 1'
  },
  {
    id: 'SEC-03',
    title: 'Private Database with Zero Public IP',
    category: 'Data Protection',
    severity: 'Critical',
    principle: 'Elimination of External Attack Surface',
    implementation: 'The relational database is allocated in a non-routable private subnet with no public IPv4 address, no IGW route, and no NAT association. Direct Internet ingress or egress is architecturally impossible.',
    referenceStandard: 'OWASP Top 10 A05 (Security Misconfiguration)'
  },
  {
    id: 'SEC-04',
    title: 'Central Cloud IAM Governance',
    category: 'Identity & Access',
    severity: 'Critical',
    principle: 'Centralized Identity Enforcement',
    implementation: 'All human and compute access is brokered through Cloud IAM. Standing root credentials are prohibited. Service accounts use short-lived STS tokens with strict condition keys.',
    referenceStandard: 'NIST SP 800-63B, CIS AWS Foundations 1.x'
  },
  {
    id: 'SEC-05',
    title: 'Role-Based Access Control (RBAC)',
    category: 'Identity & Access',
    severity: 'High',
    principle: 'Granular Role Separation',
    implementation: 'Distinct policies for Students (read-only courses, submission write), Faculty (grade management, course publishing), and Administrators (system provisioning, no direct student grade edits).',
    referenceStandard: 'NIST SP 800-162 (ABAC/RBAC Standard)'
  },
  {
    id: 'SEC-06',
    title: 'Multi-Factor Authentication (MFA)',
    category: 'Authentication',
    severity: 'Critical',
    principle: 'Defense Against Credential Theft',
    implementation: 'Mandatory TOTP / FIDO2 hardware token verification for all administrative cloud console logins and faculty grade submissions. Step-up MFA triggered on anomalous geolocation.',
    referenceStandard: 'NIST SP 800-63-3 AAL2/AAL3'
  },
  {
    id: 'SEC-07',
    title: 'SAML 2.0 / OIDC Identity Federation',
    category: 'Identity & Access',
    severity: 'High',
    principle: 'Cryptographic Trust Federation',
    implementation: 'Cloud infrastructure trusts signed assertions from University on-premises Active Directory/Shibboleth IdP. Password hashes are never synchronized or stored in the cloud.',
    referenceStandard: 'OASIS SAML V2.0, OpenID Connect Core 1.0'
  },
  {
    id: 'SEC-08',
    title: 'Single Sign-On (SSO) & Centralized Revocation',
    category: 'Identity & Access',
    severity: 'Medium',
    principle: 'Streamlined User Access & Single Logout',
    implementation: 'Students and faculty authenticate once to access SMS, LMS, ERP, and Library portals. Single Logout (SLO) terminates all active sessions simultaneously upon session expiry.',
    referenceStandard: 'ISO 27001 A.9.4.2'
  },
  {
    id: 'SEC-09',
    title: 'End-to-End Encryption in Transit (TLS 1.3)',
    category: 'Cryptography',
    severity: 'Critical',
    principle: 'Cryptographic Confidentiality in Transit',
    implementation: 'Client-to-CDN, CDN-to-ALB, and ALB-to-App Tier traffic is encrypted using TLS 1.3 with PFS (Perfect Forward Secrecy) cipher suites. HSTS is preloaded on all university domains.',
    referenceStandard: 'NIST SP 800-52 Rev 2'
  },
  {
    id: 'SEC-10',
    title: 'Encryption at Rest (AES-256 KMS)',
    category: 'Cryptography',
    severity: 'Critical',
    principle: 'Data-at-Rest Confidentiality',
    implementation: 'Database tables, automated snapshots, and application server EBS volumes are encrypted using envelope encryption with customer-managed keys (CMKs) rotated every 365 days.',
    referenceStandard: 'FIPS 140-2/3 Level 3'
  },
  {
    id: 'SEC-11',
    title: 'Encrypted Hybrid Connectivity (IPSec VPN)',
    category: 'Network Security',
    severity: 'Critical',
    principle: 'Secure Cross-Premise Interconnection',
    implementation: 'Site-to-Site VPN tunnel utilizes IPSec with AES-256-GCM encryption, SHA-384 hashing, and Diffie-Hellman Group 14+ key exchange. Dual tunnels ensure fault-tolerant failover.',
    referenceStandard: 'NIST SP 800-77 Rev 1'
  },
  {
    id: 'SEC-12',
    title: 'Comprehensive Logging & Log Aggregation',
    category: 'Observability',
    severity: 'High',
    principle: 'Full Operational Visibility',
    implementation: 'Centralized ingestion of ALB access logs, application execution logs, PostgreSQL query logs, and VPC flow logs into a unified monitoring aggregator for forensic readiness.',
    referenceStandard: 'PCI-DSS Req 10, ISO 27001 A.12.4'
  },
  {
    id: 'SEC-13',
    title: 'Tamper-Evident Security Auditing (SIEM)',
    category: 'Governance & Audit',
    severity: 'High',
    principle: 'Non-Repudiation & Audit Integrity',
    implementation: 'Management plane audit logs (CloudTrail/Activity Logs) are written to an isolated, immutable WORM (Write Once Read Many) bucket with cryptographic log validation.',
    referenceStandard: 'SOC 2 Type II Trust Services Criteria'
  },
  {
    id: 'SEC-14',
    title: 'Principle of Least Privilege (PoLP)',
    category: 'Access Control',
    severity: 'Critical',
    principle: 'Minimum Required Entitlements',
    implementation: 'Workload service accounts are granted only precise permissions (e.g. app server role can read/write DB and publish logs; cannot modify VPC or IAM policies). Zero standing admin privileges.',
    referenceStandard: 'DoD Zero Trust Reference Architecture'
  },
  {
    id: 'SEC-15',
    title: 'Defense in Depth (Multi-Layered Posture)',
    category: 'Architecture Strategy',
    severity: 'Critical',
    principle: 'Layered Protective Redundancy',
    implementation: 'Security is implemented at perimeter (CDN/WAF), network (Subnets/NSG), host (Hardened OS/Stateless pods), application (RBAC/Session tokens), and data tier (KMS/Isolation). Failure of one layer does not compromise the institution.',
    referenceStandard: 'NSA Defense-in-Depth Framework'
  }
];

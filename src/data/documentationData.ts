export interface DocSection {
  id: string;
  number: number;
  title: string;
  category: 'Foundation' | 'Architecture' | 'Security & Identity' | 'Operations' | 'Non-Functional' | 'Governance';
  content: string;
}

export const DOCUMENTATION_SECTIONS: DocSection[] = [
  {
    id: 'problem-statement',
    number: 1,
    title: 'Problem Statement',
    category: 'Foundation',
    content: `University academic and administrative operations face severe challenges when managing legacy on-premises infrastructure:

1. **Scalability Bottlenecks:** Semester course registrations and examination results releases generate 10x traffic spikes, frequently crashing single-server legacy portals.
2. **Security Vulnerabilities:** On-premises setups frequently expose database ports directly to local networks or lack unified Multi-Factor Authentication (MFA).
3. **Legacy Dependencies:** Complete "big-bang" cloud migrations are impossible due to proprietary heritage ERP ledgers, archived student transcripts spanning 40+ years, and on-premises Active Directory identity registries that cannot be decommissioned immediately.
4. **Dispersed User Authentication:** Students, professors, and administrative staff use disparate login credentials for LMS, Library, and Student Management Systems, causing credential exhaustion and phishing risks.

This project addresses these challenges by architecting a secure, highly available, hybrid cloud university management platform with zero standing trust and robust legacy integration.`
  },
  {
    id: 'project-objectives',
    number: 2,
    title: 'Project Objectives & Dual Framework Alignment',
    category: 'Foundation',
    content: `The primary objectives of this architecture are:

- **Fulfill 12 Mandatory Case-Study Requirements:**
  1. *VPC/VNet Subnets:* Dedicated Public, Application, and Database subnets with strict routing.
  2. *Edge CDN:* Edge-cached static content delivery (images, videos, CSS, JavaScript) to reduce origin compute load.
  3. *Load Balancing:* Application Load Balancer distributing requests across multiple application servers (Instances 1, 2, 3).
  4. *Security Groups & Port Control:* Controlled tier-to-tier communication (443 → 8080 → 5432).
  5. *Isolated Private Database:* Zero public IP, zero direct internet ingress, isolated inside database subnet.
  6. *Hybrid Connectivity:* Redundant Site-to-Site IPSec VPN linking Cloud VPC to University Campus Data Center.
  7. *Cloud IAM:* Distinct policies for Students, Faculty, Administrators, and Machine Workloads.
  8. *Role-Based Access Control (RBAC):* Granular least-privilege permission matrix across human and workload roles.
  9. *Identity Provider Federation:* Active Directory/LDAP federation with SAML 2.0 / OIDC assertion exchange.
  10. *Single Sign-On (SSO):* Unified university credentials granting access to LMS, ERP, Library, and Student Portals.
  11. *Multi-Factor Authentication (MFA):* Mandatory TOTP/FIDO2 MFA for privileged roles (Faculty and Administrators).
  12. *Monitoring & Logging:* Centralized SIEM telemetry aggregating Network, Identity, App, and Database events.

- **Enforce 15 Independent Defensive Security Controls:**
  15 supporting security controls (SEC-01 to SEC-15) providing defense-in-depth across Network, Identity, Database, Access Control, MFA, Logging, Monitoring, and Hybrid Security. Both the 12 requirements and 15 controls are kept independent.

- **Ensure ₹0 Cost & Local Reproducibility:** Deliver a complete, interactive architecture platform that runs locally without cloud account costs or API keys.`
  },
  {
    id: 'functional-requirements',
    number: 3,
    title: 'Functional Requirements',
    category: 'Foundation',
    content: `The system fulfills the following core functional capabilities:

- **Student Portal Access:** View course schedules, download lecture syllabi, register for electives, check examination transcripts, and submit coursework.
- **Faculty Portal Management:** Grade submissions, update course curricula, track student attendance, and access academic advisory rosters.
- **Registrar & Admin Governance:** Provision user accounts, audit security logs, monitor server health, and schedule automated database backups.
- **Hybrid Legacy Querying:** Cloud applications transparently query historical student archives and post financial transaction batches to on-prem ERP.
- **Single Sign-On (SSO):** A single unified session grants access to SMS, Moodle/Canvas LMS, Campus ERP, and EBSCO/JSTOR Library databases.`
  },
  {
    id: 'architecture-overview',
    number: 4,
    title: 'Architecture Overview',
    category: 'Architecture',
    content: `The architecture adopts a decoupled, multi-tier hybrid cloud topology structured across four major zones:

1. **Edge & Perimeter Zone:** Public Internet users connect through an Anycast Content Delivery Network (CDN) that terminates TLS 1.3, caches static assets, and mitigates DDoS attacks.
2. **Cloud VPC / VNet (10.0.0.0/16):**
   - *Public Ingress Subnet (10.0.1.0/24):* Internet Gateway and dual-AZ Application Load Balancer (ALB).
   - *Application Tier Subnet (10.0.2.0/24):* Horizontally scalable cluster of 3 stateless microservice servers.
   - *Private Database Subnet (10.0.3.0/24):* Master PostgreSQL relational database, isolated with zero public routing.
3. **University On-Premises Data Center (172.16.0.0/16):** Houses legacy student archive databases, legacy financial ERP, and campus Active Directory/LDAP IdP.
4. **Encrypted Hybrid Interconnect:** Dual IPSec VPN tunnels with BGP dynamic routing linking Cloud VPC to Campus Data Center.`
  },
  {
    id: 'network-architecture',
    number: 5,
    title: 'Network Architecture & Segmentation',
    category: 'Architecture',
    content: `Network isolation is enforced via non-overlapping RFC 1918 address allocations and strict route table boundaries:

| Subnet Zone | CIDR Block | Route Table Association | Ingress Allowed |
| :--- | :--- | :--- | :--- |
| **Public Subnet** | 10.0.1.0/24 | Default 0.0.0.0/0 → Internet Gateway | Port 443 (HTTPS) from Internet |
| **Application Subnet** | 10.0.2.0/24 | Outbound 0.0.0.0/0 → NAT Gateway; 172.16.0.0/16 → VGW | Port 8080 from ALB Security Group only |
| **Database Subnet** | 10.0.3.0/24 | Local VPC Only (10.0.0.0/16) — NO IGW/NAT routes | Port 5432 from App Security Group only |
| **On-Premises DC** | 172.16.0.0/16 | Internal Campus Core Switch → IPSec VPN Tunnel | Ports 1433/443 from Cloud App Subnet only |`
  },
  {
    id: 'application-architecture',
    number: 6,
    title: 'Application Architecture & Microservices',
    category: 'Architecture',
    content: `The Student Management System application tier is engineered for horizontal scale and zero-state persistence:

- **Stateless Microservices:** Built using modern modular REST/gRPC microservices. Application nodes do not store local disk session state; user session state is maintained via cryptographically signed JWT tokens.
- **Active Health Checking:** The Application Load Balancer continuously polls a standardized \`/healthz\` endpoint every 15 seconds. If an instance fails 2 consecutive health checks, it is taken out of service automatically.
- **Multi-Zone Redundancy:** App instances are deployed across three separate Availability Zones (AZ-1, AZ-2, AZ-3) to survive single-datacenter outages.`
  },
  {
    id: 'database-architecture',
    number: 7,
    title: 'Database Architecture & Data Isolation',
    category: 'Architecture',
    content: `The university relational database maintains institutional data integrity under strict isolation:

- **No Public IP & Zero Internet Ingress:** The database resides in a dedicated private subnet with no public IPv4 address and no route to the Internet Gateway.
- **Security Group Whitelisting:** Stateful firewall rules permit inbound connections on port 5432 strictly from the security group ID of the application tier (\`sg-app-tier\`).
- **Encrypted Storage:** Customer-managed KMS keys encrypt database blocks, automated daily snapshots, transaction write-ahead logs (WAL), and read-replica replication streams with AES-256.`
  },
  {
    id: 'identity-architecture',
    number: 8,
    title: 'Identity Architecture, IAM & RBAC',
    category: 'Security & Identity',
    content: `Identity governance enforces least privilege and prevents credential exposure:

- **Identity Federation:** The Cloud IAM engine does not store user passwords; it establishes SAML 2.0 / OIDC trust with the campus on-premises Identity Provider.
- **Granular RBAC Policies:**
  - *Student:* Read access to enrolled courses, library catalog, personal timetable; write access to assignment submissions.
  - *Faculty:* Full read/write for owned course syllabi, grade publishing, attendance registers.
  - *Administrator:* User lifecycle provisioning, IAM role binding, security auditing; zero permission to view student test answers or grades directly.
  - *Workload Service Accounts:* Ephemeral machine credentials for backend batch scripts and monitoring agents.`
  },
  {
    id: 'security-architecture',
    number: 9,
    title: 'Security Architecture & Defense-in-Depth',
    category: 'Security & Identity',
    content: `Security is embedded into every architectural layer according to Defense-in-Depth:

1. **Perimeter:** CloudFront/CDN terminating TLS 1.3, rate-limiting, and geo-restriction.
2. **Network:** Isolated private subnets, default-deny security groups, and absence of public IPs on internal tiers.
3. **Identity:** Multi-Factor Authentication (MFA), SAML federation, and strict role-based access controls.
4. **Data:** Encryption in transit (TLS 1.3) and at rest (AES-256 KMS).
5. **Observability:** Centralized audit trails (CloudTrail/SIEM) in tamper-proof WORM storage.`
  },
  {
    id: 'hybrid-connectivity',
    number: 10,
    title: 'Hybrid Connectivity & Migration Strategy',
    category: 'Architecture',
    content: `Why a Hybrid Architecture is the Optimal Choice for Universities:

- **De-risked Migration:** Avoids high-risk "all-at-once" rewrites of 30-year-old on-prem student records.
- **Data Sovereignty & Compliance:** Confidential financial ledgers and sensitive research records remain within university physical custody until compliance clearances are achieved.
- **Dual IPSec VPN Tunnels:** Cloud Virtual Private Gateway connects with on-prem Customer Gateway using IPSec AES-256 encryption with automated BGP failover.`
  },
  {
    id: 'monitoring-logging',
    number: 11,
    title: 'Monitoring, Telemetry & Logging Architecture',
    category: 'Operations',
    content: `Centralized observability gathers logs from 7 primary telemetry sources:

- **Load Balancer Access Logs:** Ingress latency, HTTP 4xx/5xx error frequencies, and client IPs.
- **Application Microservice Logs:** Structured JSON logs containing transaction IDs, latency spans, and uncaught exceptions.
- **Database Logs:** Query execution duration, connection pool saturation, and DDL schema modifications.
- **VPC Flow Logs:** Packet-level source/destination IP captures for anomaly detection.
- **Cloud IAM Audit Trails:** Real-time logging of authentication failures and privileged role assumptions.`
  },
  {
    id: 'request-flow',
    number: 12,
    title: 'End-to-End Request Flow',
    category: 'Architecture',
    content: `Step-by-step lifecycle of an incoming student request:

1. **Client DNS Resolution:** Browser resolves \`portal.university.edu\` to Anycast CDN edge IP.
2. **Edge Evaluation:** CDN checks local cache for static assets (.js, .css, images). Static content returns immediately (Cache Hit).
3. **Dynamic Forwarding:** API requests are forwarded over TLS 1.3 to the Application Load Balancer.
4. **Load Balancing:** ALB evaluates health check metrics and forwards the request to an available App Server (e.g., App Server 2).
5. **Database Execution:** App Server 2 executes authorized parameterized SQL query on master PostgreSQL DB over private port 5432.
6. **Encrypted Response:** DB returns result set to App Server, which formats JSON payload and returns through ALB/CDN to student browser.`
  },
  {
    id: 'authentication-flow',
    number: 13,
    title: 'End-to-End Authentication & SSO Flow',
    category: 'Security & Identity',
    content: `Authentication execution sequence:

1. **Login Trigger:** User navigates to \`sso.university.edu\`.
2. **Federation Redirect:** Cloud IAM redirects client to University On-Premises IdP (Active Directory/SAML).
3. **Primary Authentication:** User supplies campus username and password.
4. **MFA Verification:** Privileged accounts (Faculty/Admin) complete TOTP / FIDO2 challenge.
5. **Assertion Generation:** University IdP signs SAML 2.0 assertion containing role claims and returns to browser.
6. **Cloud Token Exchange:** Cloud STS validates digital signature, exchanges assertion for short-lived JWT session token.
7. **SSO Access:** User gains unified one-click access to SMS, LMS, ERP, and Library portals.`
  },
  {
    id: 'scalability',
    number: 14,
    title: 'Scalability & Elastic Capacity',
    category: 'Non-Functional',
    content: `The architecture accommodates dynamic university workload swings:

- **Horizontal Compute Scaling:** Application servers scale out horizontally across availability zones based on CPU utilization (>70%) and concurrent request count.
- **Stateless Design:** Instances can be terminated or created without disrupting active user sessions.
- **CDN Edge Offloading:** Up to 85% of total portal byte traffic (static files, syllabus PDFs, media) is absorbed by CDN edge caches, shielding origin compute.`
  },
  {
    id: 'availability',
    number: 15,
    title: 'High Availability & Fault Tolerance',
    category: 'Non-Functional',
    content: `Targeting 99.95% operational uptime through redundant topology:

- **Multi-AZ Application Tier:** Three application servers distributed across discrete physical availability zones with independent power, cooling, and fiber.
- **Automated Failover:** If an app instance experiences failure, ALB stops routing traffic to it within 15 seconds.
- **Database Multi-AZ Synchronous Mirroring (Enhancement):** Master database writes synchronously to a standby replica in a secondary AZ for automated zero-data-loss failover.`
  },
  {
    id: 'performance',
    number: 16,
    title: 'Performance & Latency Optimization',
    category: 'Non-Functional',
    content: `Engineering decisions optimizing response time:

- **Edge Caching:** Sub-50ms static asset delivery worldwide via CDN points of presence.
- **Database Connection Pooling:** PgBouncer connection pooling limits database process spawning overhead.
- **Keep-Alive & HTTP/2:** Multiplexed HTTP/2 connections between browser and load balancer reduce TCP handshakes.
- **In-Memory Caching (Optional Architectural Enhancement):** Redis/Memcached cluster can be positioned in the application subnet to cache hot student catalogs.`
  },
  {
    id: 'security-considerations',
    number: 17,
    title: 'Security Considerations & Threat Mitigation',
    category: 'Security & Identity',
    content: `Mitigation of common cloud threats:

- **DDoS Attacks:** Absorbed by CDN anycast network and cloud perimeter shielding.
- **SQL Injection:** Parameterized ORM queries with zero dynamic string concatenation in app tier.
- **Credential Stuffing:** Rate-limiting at perimeter and mandatory MFA for administrative workflows.
- **Lateral Movement:** Segmented subnets and default-deny security groups prevent attackers from traversing from compromised web servers into the database tier.`
  },
  {
    id: 'disaster-recovery',
    number: 18,
    title: 'Disaster Recovery & Business Continuity',
    category: 'Governance',
    content: `Disaster Recovery (DR) Strategy:

- **Recovery Point Objective (RPO):** < 15 minutes via continuous automated database WAL archiving to immutable object storage.
- **Recovery Time Objective (RTO):** < 1 hour using Infrastructure-as-Code (Terraform/CloudFormation) templates capable of standing up a replica VPC in an alternate cloud region.
- **Hybrid Redundancy:** University on-premises records retain daily cryptographic exports for catastrophic cloud isolation scenarios.`
  },
  {
    id: 'design-assumptions',
    number: 19,
    title: 'Design Assumptions & Boundary Conditions',
    category: 'Governance',
    content: `Key architectural assumptions:

1. The university campus data center possesses stable redundant commercial fiber broadband capable of sustaining IPSec VPN tunnels.
2. The campus Active Directory / LDAP server supports modern SAML 2.0 or OpenID Connect federation protocols.
3. Student management workloads are primarily HTTP/HTTPS web and mobile API requests.
4. Legacy ERP software provides exposed ODBC/JDBC or REST adapter hooks for hybrid synchronization.`
  },
  {
    id: 'limitations',
    number: 20,
    title: 'Limitations of Architecture Simulation',
    category: 'Governance',
    content: `Important disclosures regarding this implementation:

- **Local Telemetry Simulation:** This interactive platform executes locally in the web browser. Metrics, logs, and telemetry are simulated representations for architecture visualization and study.
- **No Active Cloud Billing:** No real AWS, Azure, or GCP cloud infrastructure has been provisioned; zero cloud charges are incurred.
- **Offline Self-Contained:** Designed to run 100% locally on a student laptop without requiring external cloud accounts or paid SaaS credentials.`
  },
  {
    id: 'future-enhancements',
    number: 21,
    title: 'Future Architectural Enhancements',
    category: 'Governance',
    content: `Recommended phase-2 enhancements as migration progresses:

- **AWS Direct Connect / Azure ExpressRoute:** Transition from IPSec VPN over public Internet to dedicated private 1 Gbps physical fiber interconnect.
- **Serverless Event-Driven Workers:** Leverage serverless functions (AWS Lambda / Azure Functions) for asynchronous PDF transcript generation.
- **Distributed In-Memory Cache:** Integrate an Amazon ElastiCache / Azure Redis cluster in the application subnet.
- **AI-Powered Threat Detection:** Integrate cloud-native threat intelligence (AWS GuardDuty / Microsoft Sentinel) for automated anomalous behavioral analysis.`
  },
  {
    id: 'cloud-service-mapping',
    number: 22,
    title: 'Cloud Service Mapping Matrix',
    category: 'Architecture',
    content: `Cross-cloud provider architectural reference mappings:

| Component | AWS Reference | Azure Reference | GCP Reference | Open-Source Alternative |
| :--- | :--- | :--- | :--- | :--- |
| **Edge CDN** | Amazon CloudFront | Azure Front Door | Cloud CDN | Varnish Cache / Nginx Edge |
| **Load Balancer** | Application Load Balancer (ALB) | Azure Application Gateway | Cloud Load Balancing | HAProxy / Traefik / Envoy |
| **Compute Microservices** | EC2 Auto Scaling / ECS Fargate | VM Scale Sets / Container Apps | Compute Engine MIG / Cloud Run | Kubernetes / Docker Swarm |
| **Relational Database** | Amazon RDS for PostgreSQL | Azure Database for PostgreSQL | Cloud SQL for PostgreSQL | PostgreSQL 16 Cluster + Patroni |
| **IAM & Governance** | AWS IAM / Identity Center | Microsoft Entra ID / Azure RBAC | Google Cloud IAM | Keycloak / FreeIPA |
| **Hybrid Connectivity** | AWS Site-to-Site VPN | Azure VPN Gateway | Cloud VPN (HA-VPN) | StrongSwan IPSec Gateway |
| **Monitoring & SIEM** | CloudWatch + CloudTrail | Azure Monitor + Sentinel | Cloud Operations Suite | ELK Stack + Prometheus/Grafana |`
  },
  {
    id: 'cost-model',
    number: 23,
    title: 'Cost & Deployment Model',
    category: 'Governance',
    content: `Financial & Operational Model:

- **Platform Development & Demonstration Cost:** **₹0 (Completely Free)**.
- **Required Cloud Accounts:** None.
- **Required API Keys:** None.
- **Required Credit Cards:** None.
- **Production Reference Cloud Estimate:** If implemented on commercial cloud, estimated monthly operational cost:
  - *ALB + CDN:* ~$35/mo
  - *3x t4g.medium App Compute:* ~$95/mo
  - *db.t4g.medium Multi-AZ PostgreSQL:* ~$140/mo
  - *Site-to-Site VPN Connection:* ~$36/mo
  - *CloudWatch & Storage:* ~$25/mo
  - *Estimated Production Total:* ~$331/month (Qualifies for AWS Cloud for Higher Education institutional grants).`
  }
];

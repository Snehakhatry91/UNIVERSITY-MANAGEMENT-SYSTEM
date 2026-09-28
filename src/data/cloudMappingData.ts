import { CloudServiceMappingItem } from '../types/architecture';

export const CLOUD_SERVICE_MAPPINGS: CloudServiceMappingItem[] = [
  {
    component: 'Content Delivery Network (CDN)',
    layer: 'Edge / Perimeter',
    purpose: 'Caches and serves static assets (portal UI, images, JS/CSS bundles, lecture media) at edge locations with low latency.',
    aws: 'Amazon CloudFront',
    azure: 'Azure Front Door / Azure CDN',
    gcp: 'Google Cloud CDN',
    openSource: 'Varnish HTTP Cache / Nginx Edge Proxy',
    notes: 'Reference mapping only. Terminates TLS 1.3 at edge; routes dynamic API calls to ALB.'
  },
  {
    component: 'Application Load Balancer',
    layer: 'Public Subnet / Ingress',
    purpose: 'Evenly distributes incoming HTTP/HTTPS student and faculty requests across multiple healthy application servers with active health checking.',
    aws: 'AWS Application Load Balancer (ALB)',
    azure: 'Azure Application Gateway v2',
    gcp: 'Cloud Load Balancing (External Application LB)',
    openSource: 'HAProxy / Traefik / Envoy Proxy',
    notes: 'Dual-AZ deployment. Enforces HTTPS listener on port 443 with automated HTTP redirect.'
  },
  {
    component: 'Compute / Application Tier',
    layer: 'Application Subnet (Private)',
    purpose: 'Executes core university business logic, student registration, course scheduling, and grading APIs in an autoscaling tier.',
    aws: 'AWS EC2 (Auto Scaling Group) / AWS ECS (Fargate)',
    azure: 'Azure VM Scale Sets / Azure Container Apps',
    gcp: 'Compute Engine Managed Instance Groups / Cloud Run',
    openSource: 'Kubernetes (K8s) Worker Pods / Docker Swarm',
    notes: 'Stateless containers/VMs in private subnet without public IPs. Scales horizontally based on CPU/Request count.'
  },
  {
    component: 'Relational Database Tier',
    layer: 'Database Subnet (Isolated Private)',
    purpose: 'Provides ACID transactional persistence for student records, enrollment catalogs, examination transcripts, and tuition records.',
    aws: 'Amazon RDS for PostgreSQL (Multi-AZ)',
    azure: 'Azure Database for PostgreSQL Flexible Server',
    gcp: 'Google Cloud SQL for PostgreSQL (HA)',
    openSource: 'PostgreSQL 16 High Availability Cluster + PgBouncer',
    notes: 'STRICTLY ISOLATED: No Internet gateway route, no public IP. Encrypted at rest via customer KMS.'
  },
  {
    component: 'Identity & Access Management (IAM)',
    layer: 'Identity / Governance',
    purpose: 'Enforces fine-grained role-based access control (RBAC), least privilege permissions, and temporary STS credential token issuance.',
    aws: 'AWS IAM + AWS IAM Identity Center',
    azure: 'Microsoft Entra ID + Azure RBAC',
    gcp: 'Google Cloud IAM + Workforce Identity',
    openSource: 'Keycloak Identity Management / FreeIPA',
    notes: 'Controls cloud permissions for Student, Faculty, Admin, and Workload machine identities.'
  },
  {
    component: 'Identity Federation & SAML/OIDC',
    layer: 'Identity / Trust Broker',
    purpose: 'Cryptographically verifies authentication assertions issued by the university on-premises directory without replicating passwords.',
    aws: 'IAM SAML 2.0 Identity Provider / Cognito User Pool',
    azure: 'Microsoft Entra ID B2B / Federated Enterprise App',
    gcp: 'Cloud Workforce Identity Federation',
    openSource: 'Shibboleth IdP/SP / Keycloak SAML Broker',
    notes: 'Enables cross-domain trust. Eliminates password synchronization vulnerabilities.'
  },
  {
    component: 'Multi-Factor Authentication (MFA)',
    layer: 'Identity / Verification',
    purpose: 'Enforces secondary cryptographic or TOTP verification for privileged users (Faculty grade updates, System Administrators).',
    aws: 'AWS IAM MFA / Cognito MFA (TOTP, WebAuthn)',
    azure: 'Microsoft Entra MFA + Conditional Access Policies',
    gcp: 'Google Cloud 2-Step Verification with Security Keys',
    openSource: 'privacyIDEA / FreeOTP / Duo Security Integration',
    notes: 'Mandatory for administrative and academic grade-alteration actions.'
  },
  {
    component: 'Single Sign-On (SSO) Portal',
    layer: 'Application Ingress / Portal',
    purpose: 'Unified authentication hub providing one-click seamless access to SMS, LMS (Moodle/Canvas), ERP, and Digital Library.',
    aws: 'AWS IAM Identity Center Application Portal',
    azure: 'Microsoft My Apps Portal',
    gcp: 'Google Workspace Single Sign-On Portal',
    openSource: 'Apereo CAS / Keycloak User Portal',
    notes: 'Single session cookie with centralized Single Logout (SLO) capability.'
  },
  {
    component: 'Hybrid Network Connectivity (VPN)',
    layer: 'Hybrid / Network Gateway',
    purpose: 'Encrypted site-to-site IPSec VPN connecting Cloud VPC to the University On-Premises Data Center with dynamic BGP routing.',
    aws: 'AWS Site-to-Site VPN (or AWS Direct Connect)',
    azure: 'Azure VPN Gateway (or Azure ExpressRoute)',
    gcp: 'Cloud VPN (HA-VPN) (or Cloud Interconnect)',
    openSource: 'StrongSwan IPSec Gateway / WireGuard Mesh',
    notes: 'Dual tunnels for redundancy; AES-256 encryption. Connects cloud to legacy ERP and Student systems.'
  },
  {
    component: 'Central Monitoring & Observability',
    layer: 'Operations / Security Analytics',
    purpose: 'Aggregates structured logs, VPC flow logs, audit trails, and system telemetry to generate actionable operational alerts.',
    aws: 'Amazon CloudWatch + AWS CloudTrail + GuardDuty',
    azure: 'Azure Monitor + Log Analytics + Microsoft Sentinel',
    gcp: 'Google Cloud Operations Suite (Cloud Logging / Monitoring)',
    openSource: 'ELK Stack (Elasticsearch, Logstash, Kibana) + Prometheus/Grafana',
    notes: 'Simulated architecture telemetry; tamper-proof audit trails for institutional compliance.'
  },
  {
    component: 'Secrets & Cryptographic Key Management',
    layer: 'Security / Encryption',
    purpose: 'Manages master encryption keys for data-at-rest and stores sensitive database connection credentials securely.',
    aws: 'AWS KMS + AWS Secrets Manager',
    azure: 'Azure Key Vault',
    gcp: 'Cloud KMS + Secret Manager',
    openSource: 'HashiCorp Vault',
    notes: 'Automated 90-day secret rotation for database passwords.'
  }
];

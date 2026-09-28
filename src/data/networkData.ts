export interface SubnetConfig {
  name: string;
  cidr: string;
  type: 'Public' | 'Private' | 'Isolated' | 'On-Premises';
  zone: string;
  purpose: string;
  internetAccess: string;
  associatedResources: string[];
}

export interface SecurityGroupRule {
  id: string;
  groupName: string;
  direction: 'Inbound' | 'Outbound';
  type: string;
  protocol: string;
  portRange: string;
  sourceDestination: string;
  description: string;
}

export const NETWORK_SUBNETS: SubnetConfig[] = [
  {
    name: 'Public Ingress Subnet',
    cidr: '10.0.1.0/24',
    type: 'Public',
    zone: 'Cloud VPC (AZ-1 & AZ-2)',
    purpose: 'DMZ entry tier for public internet-facing Application Load Balancers and ingress endpoints.',
    internetAccess: 'Direct bidirectional via Internet Gateway (IGW 0.0.0.0/0 route)',
    associatedResources: ['Application Load Balancer (ALB)', 'NAT Gateway (optional)', 'Internet Gateway association']
  },
  {
    name: 'Application Tier Subnet',
    cidr: '10.0.2.0/24',
    type: 'Private',
    zone: 'Cloud VPC (AZ-1, AZ-2, AZ-3)',
    purpose: 'Stateless microservices hosting Student Management System backend APIs and background workers.',
    internetAccess: 'Outbound only via NAT Gateway for security patches; NO direct inbound from Internet',
    associatedResources: ['App Server 1', 'App Server 2', 'App Server 3', 'Auto Scaling Group']
  },
  {
    name: 'Database Tier Subnet',
    cidr: '10.0.3.0/24',
    type: 'Isolated',
    zone: 'Cloud VPC (AZ-1 & AZ-2)',
    purpose: 'Mission-critical relational database hosting student, academic, and financial records.',
    internetAccess: 'STRICTLY NONE — No default route to IGW or NAT Gateway; isolated private-only subnet',
    associatedResources: ['University Management Database (PostgreSQL Master)', 'Multi-AZ Read Replica (Optional)']
  },
  {
    name: 'University Campus Data Center',
    cidr: '172.16.0.0/16',
    type: 'On-Premises',
    zone: 'University Campus Server Room',
    purpose: 'On-premises enterprise network housing heritage ERP, historical transcripts, and campus IdP.',
    internetAccess: 'Campus enterprise edge firewall; routed to cloud VPC exclusively through IPSec VPN tunnel',
    associatedResources: ['Legacy Student System (172.16.10.12)', 'Legacy ERP (172.16.20.15)', 'University IdP (172.16.5.10)']
  }
];

export const SECURITY_GROUP_RULES: SecurityGroupRule[] = [
  {
    id: 'sg-alb-in-1',
    groupName: 'sg-alb (Load Balancer SG)',
    direction: 'Inbound',
    type: 'HTTPS',
    protocol: 'TCP',
    portRange: '443',
    sourceDestination: '0.0.0.0/0 (Internet / CDN)',
    description: 'Permits encrypted TLS 1.3 traffic from web browsers and CDN edge nodes.'
  },
  {
    id: 'sg-alb-in-2',
    groupName: 'sg-alb (Load Balancer SG)',
    direction: 'Inbound',
    type: 'HTTP',
    protocol: 'TCP',
    portRange: '80',
    sourceDestination: '0.0.0.0/0 (Internet)',
    description: 'Accepts HTTP for immediate 301 redirection to HTTPS 443.'
  },
  {
    id: 'sg-alb-out-1',
    groupName: 'sg-alb (Load Balancer SG)',
    direction: 'Outbound',
    type: 'Custom TCP',
    protocol: 'TCP',
    portRange: '8080',
    sourceDestination: 'sg-app-tier (10.0.2.0/24)',
    description: 'Forwards balanced application requests to healthy compute instances.'
  },
  {
    id: 'sg-app-in-1',
    groupName: 'sg-app-tier (Compute SG)',
    direction: 'Inbound',
    type: 'Custom TCP',
    protocol: 'TCP',
    portRange: '8080',
    sourceDestination: 'sg-alb (Security Group Reference)',
    description: 'Accepts reverse-proxied traffic STRICTLY from ALB. No direct internet access.'
  },
  {
    id: 'sg-app-out-1',
    groupName: 'sg-app-tier (Compute SG)',
    direction: 'Outbound',
    type: 'PostgreSQL',
    protocol: 'TCP',
    portRange: '5432',
    sourceDestination: 'sg-db-tier (10.0.3.0/24)',
    description: 'Queries master relational database in isolated subnet.'
  },
  {
    id: 'sg-app-out-2',
    groupName: 'sg-app-tier (Compute SG)',
    direction: 'Outbound',
    type: 'Hybrid ERP Sync',
    protocol: 'TCP',
    portRange: '1433 / 443',
    sourceDestination: '172.16.0.0/16 (via IPSec VPN)',
    description: 'Synchronizes legacy records and financial batches over encrypted VPN tunnel.'
  },
  {
    id: 'sg-db-in-1',
    groupName: 'sg-db-tier (Database SG)',
    direction: 'Inbound',
    type: 'PostgreSQL',
    protocol: 'TCP',
    portRange: '5432',
    sourceDestination: 'sg-app-tier (Compute SG Only)',
    description: 'Restricts database access exclusively to authorized application servers. ZERO public ingress.'
  },
  {
    id: 'sg-db-out-1',
    groupName: 'sg-db-tier (Database SG)',
    direction: 'Outbound',
    type: 'None / Blocked',
    protocol: 'ALL',
    portRange: 'ALL',
    sourceDestination: '0.0.0.0/0 (DENIED)',
    description: 'No outbound internet access allowed. Eliminates data exfiltration pathways.'
  }
];

import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType
} from '@xyflow/react';
import { ARCHITECTURE_COMPONENTS } from '../../data/architectureData';
import { ArchitectureComponent } from '../../types/architecture';
import { ArchitectureNode, SubnetBoundaryNode } from './CustomNodes';
import { FilterControls, FilterState } from './FilterControls';
import { SimulationControl } from './SimulationControl';
import { ComponentDetailsDrawer } from './ComponentDetailsDrawer';
import { ValidationDrawer } from './ValidationDrawer';
import { 
  Search, 
  Maximize2, 
  Minimize2, 
  Play,
  CheckCircle2
} from 'lucide-react';

const nodeTypes = {
  archNode: ArchitectureNode,
  boundaryNode: SubnetBoundaryNode
};

export const ArchitectureCanvas: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<ArchitectureComponent | null>(null);
  const [isValidationOpen, setIsValidationOpen] = useState(false);
  const [isSimControlOpen, setIsSimControlOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filters, setFilters] = useState<FilterState>({
    network: true,
    security: true,
    identity: true,
    monitoring: true,
    hybrid: true,
    application: true
  });

  const [activeSimNodes, setActiveSimNodes] = useState<string[]>([]);
  const [activeSimEdges, setActiveSimEdges] = useState<string[]>([]);

  // Base Nodes definition containing ALL 12 case study requirements
  const rawNodes: Node[] = useMemo(() => [
    // ==========================================
    // 1. BOUNDARY CONTAINERS (VPC & SUBNETS)
    // ==========================================
    {
      id: 'boundary-vpc',
      type: 'boundaryNode',
      position: { x: 680, y: 30 },
      style: { width: 1420, height: 680, zIndex: -1 },
      data: {
        title: 'CLOUD VPC / VNET (10.0.0.0/16)',
        subtitle: 'Multi-AZ Isolated Cloud Network Boundary',
        cidr: '10.0.0.0/16',
        isVpc: true
      },
      selectable: false,
      draggable: false
    },
    {
      id: 'boundary-public-subnet',
      type: 'boundaryNode',
      position: { x: 710, y: 80 },
      style: { width: 330, height: 600, zIndex: 0 },
      data: {
        title: 'PUBLIC SUBNET (DMZ)',
        subtitle: 'Ingress & Edge Proxy Tier',
        cidr: '10.0.1.0/24',
        type: 'public'
      },
      selectable: false,
      draggable: false
    },
    {
      id: 'boundary-app-subnet',
      type: 'boundaryNode',
      position: { x: 1070, y: 80 },
      style: { width: 440, height: 600, zIndex: 0 },
      data: {
        title: 'APPLICATION SUBNET',
        subtitle: 'Stateless Microservices Compute Tier',
        cidr: '10.0.2.0/24',
        type: 'application'
      },
      selectable: false,
      draggable: false
    },
    {
      id: 'boundary-db-subnet',
      type: 'boundaryNode',
      position: { x: 1540, y: 80 },
      style: { width: 530, height: 600, zIndex: 0 },
      data: {
        title: 'PRIVATE DATABASE SUBNET',
        subtitle: 'Zero Public IP / Strictly Isolated Private Tier',
        cidr: '10.0.3.0/24',
        type: 'database'
      },
      selectable: false,
      draggable: false
    },
    {
      id: 'boundary-onprem-dc',
      type: 'boundaryNode',
      position: { x: 710, y: 760 },
      style: { width: 1360, height: 260, zIndex: 0 },
      data: {
        title: 'UNIVERSITY ON-PREMISES DATA CENTER',
        subtitle: 'Campus Heritage Systems & Authoritative Directory',
        cidr: '172.16.0.0/16',
        type: 'on-premises'
      },
      selectable: false,
      draggable: false
    },
    {
      id: 'boundary-identity',
      type: 'boundaryNode',
      position: { x: 60, y: 1070 },
      style: { width: 2010, height: 350, zIndex: 0 },
      data: {
        title: 'IDENTITY & ACCESS GOVERNANCE PIPELINE',
        subtitle: 'University IdP → Federation → Cloud IAM → RBAC → MFA → SSO → Authorized Services',
        cidr: 'ZERO TRUST IDENTITY DOMAIN',
        type: 'identity'
      },
      selectable: false,
      draggable: false
    },

    // ==========================================
    // 2. USER TIER (LEFT)
    // ==========================================
    {
      id: 'node-students',
      type: 'archNode',
      position: { x: 60, y: 130 },
      data: {
        ...ARCHITECTURE_COMPONENTS['node-students'],
        label: 'Students',
        category: 'user',
        isSimActive: activeSimNodes.includes('node-students')
      }
    },
    {
      id: 'node-faculty',
      type: 'archNode',
      position: { x: 60, y: 280 },
      data: {
        ...ARCHITECTURE_COMPONENTS['node-faculty'],
        label: 'Faculty',
        category: 'user',
        isSimActive: activeSimNodes.includes('node-faculty')
      }
    },
    {
      id: 'node-admins',
      type: 'archNode',
      position: { x: 60, y: 430 },
      data: {
        ...ARCHITECTURE_COMPONENTS['node-admins'],
        label: 'Administrators',
        category: 'user',
        isSimActive: activeSimNodes.includes('node-admins')
      }
    },

    // ==========================================
    // 3. PERIMETER & CDN EDGE
    // ==========================================
    {
      id: 'node-internet',
      type: 'archNode',
      position: { x: 370, y: 200 },
      data: {
        ...ARCHITECTURE_COMPONENTS['node-internet'],
        label: 'Internet',
        category: 'edge',
        isSimActive: activeSimNodes.includes('node-internet')
      }
    },
    {
      id: 'node-cdn',
      type: 'archNode',
      position: { x: 370, y: 370 },
      data: {
        ...ARCHITECTURE_COMPONENTS['node-cdn'],
        label: 'CDN (Edge Locations)',
        title: 'Static Content: Images, Videos, CSS, JS',
        category: 'edge',
        isSimActive: activeSimNodes.includes('node-cdn'),
        details: { allowedPorts: ['Images, Videos, CSS, JS', 'TLS 1.3 Termination'] }
      }
    },

    // ==========================================
    // 4. PUBLIC SUBNET (DMZ)
    // ==========================================
    {
      id: 'node-igw',
      type: 'archNode',
      position: { x: 745, y: 140 },
      data: {
        ...ARCHITECTURE_COMPONENTS['node-igw'],
        label: 'Internet Gateway (IGW)',
        category: 'ingress',
        isSimActive: activeSimNodes.includes('node-igw')
      }
    },
    {
      id: 'node-alb',
      type: 'archNode',
      position: { x: 745, y: 310 },
      data: {
        ...ARCHITECTURE_COMPONENTS['node-alb'],
        label: 'Load Balancer (ALB)',
        title: 'Application Load Balancer (Dual-AZ)',
        category: 'ingress',
        isSimActive: activeSimNodes.includes('node-alb'),
        details: { allowedPorts: ['Port 443 HTTPS', 'Distributes to App 1, 2, 3'] }
      }
    },
    {
      id: 'node-sg-public',
      type: 'archNode',
      position: { x: 745, y: 490 },
      data: {
        ...ARCHITECTURE_COMPONENTS['node-sg-public'],
        label: 'Security Group: Public',
        title: 'Virtual Firewall: HTTPS 443 Ingress Only',
        category: 'ingress',
        details: { allowedPorts: ['Inbound: TCP 443 Only', 'Default Action: DENY ALL'] }
      }
    },

    // ==========================================
    // 5. APPLICATION SUBNET (COMPUTE TIER)
    // ==========================================
    {
      id: 'node-sg-app',
      type: 'archNode',
      position: { x: 1110, y: 140 },
      data: {
        ...ARCHITECTURE_COMPONENTS['node-sg-app'],
        label: 'Security Group: App Tier',
        title: 'Virtual Firewall: Port 8080 from ALB Only',
        category: 'application',
        details: { allowedPorts: ['Inbound: TCP 8080 (sg-alb only)', 'Zero Direct Public Ingress'] }
      }
    },
    {
      id: 'node-app-1',
      type: 'archNode',
      position: { x: 1110, y: 260 },
      data: {
        ...ARCHITECTURE_COMPONENTS['node-app-1'],
        label: 'Application Server 1',
        title: 'Stateless Microservice Node 1 (AZ-1)',
        category: 'application',
        status: 'healthy',
        isSimActive: activeSimNodes.includes('node-app-1'),
        details: { allowedPorts: ['Port 8080 (from ALB)', 'No Public IP'] }
      }
    },
    {
      id: 'node-app-2',
      type: 'archNode',
      position: { x: 1110, y: 400 },
      data: {
        ...ARCHITECTURE_COMPONENTS['node-app-2'],
        label: 'Application Server 2',
        title: 'Stateless Microservice Node 2 (AZ-2)',
        category: 'application',
        status: 'healthy',
        isSimActive: activeSimNodes.includes('node-app-2'),
        details: { allowedPorts: ['Port 8080 (from ALB)', 'No Public IP'] }
      }
    },
    {
      id: 'node-app-3',
      type: 'archNode',
      position: { x: 1110, y: 540 },
      data: {
        ...ARCHITECTURE_COMPONENTS['node-app-3'],
        label: 'Application Server 3',
        title: 'Stateless Microservice Node 3 (AZ-3)',
        category: 'application',
        status: 'healthy',
        isSimActive: activeSimNodes.includes('node-app-3'),
        details: { allowedPorts: ['Port 8080 (from ALB)', 'No Public IP'] }
      }
    },

    // ==========================================
    // 6. PRIVATE DATABASE SUBNET (ISOLATED)
    // ==========================================
    {
      id: 'node-sg-db',
      type: 'archNode',
      position: { x: 1580, y: 140 },
      data: {
        ...ARCHITECTURE_COMPONENTS['node-sg-db'],
        label: 'Security Group: Database',
        title: 'Virtual Firewall: Port 5432 from App Tier Only',
        category: 'database',
        details: { allowedPorts: ['Inbound: TCP 5432 (sg-app only)', 'STRICTLY NO INTERNET INGRESS'] }
      }
    },
    {
      id: 'node-db',
      type: 'archNode',
      position: { x: 1580, y: 310 },
      data: {
        ...ARCHITECTURE_COMPONENTS['node-db'],
        label: 'Private Database',
        title: 'University Management Database (PostgreSQL Master)',
        category: 'database',
        privateOnly: true,
        isSimActive: activeSimNodes.includes('node-db'),
        details: { allowedPorts: ['Port 5432 (sg-app-tier only)', 'NO DIRECT PUBLIC ACCESS · NO PUBLIC IP'] }
      }
    },
    {
      id: 'node-monitoring',
      type: 'archNode',
      position: { x: 1580, y: 500 },
      data: {
        ...ARCHITECTURE_COMPONENTS['node-monitoring'],
        label: 'Monitoring & Logging',
        title: 'Records Network & Identity Events (SIEM)',
        category: 'monitoring',
        status: 'healthy',
        isSimActive: activeSimNodes.includes('node-monitoring'),
        details: { allowedPorts: ['VPC Flow Logs · Identity Trails', 'Troubleshooting · Audit · Security'] }
      }
    },

    // ==========================================
    // 7. HYBRID NETWORK CONNECTIVITY
    // ==========================================
    {
      id: 'node-vpn',
      type: 'archNode',
      position: { x: 1110, y: 700 },
      data: {
        ...ARCHITECTURE_COMPONENTS['node-vpn'],
        label: 'VPN / Dedicated Connectivity',
        title: 'Site-to-Site IPSec VPN Dual-Tunnel',
        category: 'hybrid',
        status: 'healthy',
        isSimActive: activeSimNodes.includes('node-vpn'),
        details: { allowedPorts: ['UDP 500 / 4500 IPSec', '10.0.2.0/24 ↔ 172.16.0.0/16'] }
      }
    },

    // ==========================================
    // 8. UNIVERSITY ON-PREMISES DATA CENTER
    // ==========================================
    {
      id: 'node-legacy-sms',
      type: 'archNode',
      position: { x: 745, y: 840 },
      data: {
        ...ARCHITECTURE_COMPONENTS['node-legacy-sms'],
        label: 'Legacy Student System',
        title: 'Heritage Historical Transcripts Archive',
        category: 'hybrid',
        status: 'healthy',
        details: { ipRange: '172.16.10.12 (Campus DC)', allowedPorts: ['40-Year Student Records'] }
      }
    },
    {
      id: 'node-legacy-erp',
      type: 'archNode',
      position: { x: 1110, y: 840 },
      data: {
        ...ARCHITECTURE_COMPONENTS['node-legacy-erp'],
        label: 'Legacy ERP & Finance',
        title: 'Campus Accounting, Payroll & Ledger',
        category: 'hybrid',
        status: 'healthy',
        details: { ipRange: '172.16.20.15 (Campus DC)', allowedPorts: ['Batch Sync (Port 1433)'] }
      }
    },
    {
      id: 'node-onprem-idp',
      type: 'archNode',
      position: { x: 1580, y: 840 },
      data: {
        ...ARCHITECTURE_COMPONENTS['node-onprem-idp'],
        label: 'University Identity Provider',
        title: 'Active Directory / LDAP / SAML IdP',
        category: 'identity',
        status: 'healthy',
        details: { ipRange: '172.16.5.10 (Campus DC)', allowedPorts: ['SAML 2.0 Digital Signing'] }
      }
    },

    // ==========================================
    // 9. IDENTITY & ACCESS PIPELINE (SEPARATE & DISTINCT NODES!)
    // ==========================================
    {
      id: 'node-federation',
      type: 'archNode',
      position: { x: 90, y: 1140 },
      data: {
        ...ARCHITECTURE_COMPONENTS['node-federation'],
        label: 'Federation',
        title: 'SAML 2.0 / OIDC Trust Broker (Cloud trusts IdP)',
        category: 'identity',
        status: 'healthy',
        details: { allowedPorts: ['SAML Assertions Verified', 'Cryptographic Trust'] }
      }
    },
    {
      id: 'node-cloud-iam',
      type: 'archNode',
      position: { x: 380, y: 1140 },
      data: {
        ...ARCHITECTURE_COMPONENTS['node-cloud-iam'],
        label: 'IAM (Cloud IAM)',
        title: 'Identity + Policy + Access Control',
        category: 'identity',
        status: 'healthy',
        details: { allowedPorts: ['Students, Faculty, Admins, Workloads', 'Least-Privilege Policies'] }
      }
    },
    {
      id: 'node-workloads',
      type: 'archNode',
      position: { x: 380, y: 1280 },
      data: {
        ...ARCHITECTURE_COMPONENTS['node-workloads'],
        label: 'Workloads (Machine Identity)',
        title: 'Machine-to-Machine Service Accounts',
        category: 'identity',
        status: 'healthy',
        details: { allowedPorts: ['Ephemeral STS Tokens', 'No Human Interactive Access'] }
      }
    },
    {
      id: 'node-rbac',
      type: 'archNode',
      position: { x: 680, y: 1140 },
      data: {
        ...ARCHITECTURE_COMPONENTS['node-rbac'],
        label: 'RBAC (Role-Based Access)',
        title: 'Role Separation: Student / Faculty / Admin',
        category: 'identity',
        status: 'healthy',
        details: { allowedPorts: ['Student: Read courses/LMS', 'Faculty: Grade, Admin: Provision'] }
      }
    },
    {
      id: 'node-mfa',
      type: 'archNode',
      position: { x: 980, y: 1140 },
      data: {
        ...ARCHITECTURE_COMPONENTS['node-mfa'],
        label: 'MFA (Multi-Factor Auth)',
        title: 'Protects Privileged Accounts & Users',
        category: 'identity',
        status: 'healthy',
        details: { allowedPorts: ['Username/Password + Second Factor', 'Enforced for Admin & Faculty'] }
      }
    },
    {
      id: 'node-sso',
      type: 'archNode',
      position: { x: 1280, y: 1140 },
      data: {
        ...ARCHITECTURE_COMPONENTS['node-sso'],
        label: 'SSO (Single Sign-On)',
        title: 'One University Login → Multiple Services',
        category: 'identity',
        status: 'healthy',
        details: { allowedPorts: ['One Login Session', 'Single Logout (SLO)'] }
      }
    },

    // Authorized Services Connected to SSO
    {
      id: 'node-service-lms',
      type: 'archNode',
      position: { x: 1600, y: 1120 },
      data: {
        ...ARCHITECTURE_COMPONENTS['node-service-lms'],
        label: 'LMS (Learning Management)',
        category: 'application',
        status: 'healthy',
        details: { allowedPorts: ['SSO Authorized', 'Courseware / Moodle'] }
      }
    },
    {
      id: 'node-service-erp',
      type: 'archNode',
      position: { x: 1600, y: 1200 },
      data: {
        ...ARCHITECTURE_COMPONENTS['node-service-erp'],
        label: 'ERP (University ERP)',
        category: 'application',
        status: 'healthy',
        details: { allowedPorts: ['SSO Authorized', 'Finance / Payroll'] }
      }
    },
    {
      id: 'node-service-library',
      type: 'archNode',
      position: { x: 1600, y: 1280 },
      data: {
        ...ARCHITECTURE_COMPONENTS['node-service-library'],
        label: 'Library (Digital Library)',
        category: 'application',
        status: 'healthy',
        details: { allowedPorts: ['SSO Authorized', 'Journals / JSTOR'] }
      }
    },
    {
      id: 'node-service-sms',
      type: 'archNode',
      position: { x: 1600, y: 1360 },
      data: {
        ...ARCHITECTURE_COMPONENTS['node-service-sms'],
        label: 'Authorized SMS Portal',
        category: 'application',
        status: 'healthy',
        details: { allowedPorts: ['SSO Authorized', 'Core Student Records'] }
      }
    }
  ], [activeSimNodes]);

  // Edges definition connecting all 12 case study components
  const rawEdges: Edge[] = useMemo(() => [
    // --- 1. User Traffic to Internet ---
    {
      id: 'edge-students-internet',
      source: 'node-students',
      target: 'node-internet',
      animated: activeSimEdges.includes('edge-students-internet'),
      style: { stroke: '#38bdf8', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#38bdf8' }
    },
    {
      id: 'edge-faculty-internet',
      source: 'node-faculty',
      target: 'node-internet',
      style: { stroke: '#38bdf8', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#38bdf8' }
    },
    {
      id: 'edge-admins-internet',
      source: 'node-admins',
      target: 'node-internet',
      style: { stroke: '#38bdf8', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#38bdf8' }
    },

    // --- 2. Internet to CDN Edge & Public Entry ---
    {
      id: 'edge-internet-cdn',
      source: 'node-internet',
      target: 'node-cdn',
      label: 'Edge Routing',
      animated: activeSimEdges.includes('edge-internet-cdn'),
      style: { stroke: '#38bdf8', strokeWidth: 2 },
      labelStyle: { fill: '#38bdf8', fontSize: 9, fontFamily: 'monospace' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#38bdf8' }
    },
    {
      id: 'edge-cdn-alb',
      source: 'node-cdn',
      target: 'node-alb',
      label: 'Dynamic HTTPS (Port 443)',
      animated: activeSimEdges.includes('edge-cdn-alb'),
      style: { stroke: '#38bdf8', strokeWidth: 2.5 },
      labelStyle: { fill: '#38bdf8', fontSize: 10, fontFamily: 'monospace' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#38bdf8' }
    },
    {
      id: 'edge-igw-alb',
      source: 'node-igw',
      target: 'node-alb',
      style: { stroke: '#64748b', strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' }
    },

    // --- 3. Security Group Controls on Load Balancer ---
    {
      id: 'edge-alb-sg-public',
      source: 'node-alb',
      target: 'node-sg-public',
      label: 'Port 443 Filter',
      style: { stroke: '#06b6d4', strokeWidth: 1.5, strokeDasharray: '3 3' },
      labelStyle: { fill: '#22d3ee', fontSize: 9, fontFamily: 'monospace' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#06b6d4' }
    },

    // --- 4. Load Balancer to Multiple Application Servers (Fan-out) ---
    {
      id: 'edge-alb-app-1',
      source: 'node-alb',
      target: 'node-app-1',
      label: 'HTTP:8080 (Round-Robin)',
      style: { stroke: '#0ea5e9', strokeWidth: 2 },
      labelStyle: { fill: '#38bdf8', fontSize: 9, fontFamily: 'monospace' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#0ea5e9' }
    },
    {
      id: 'edge-alb-app-2',
      source: 'node-alb',
      target: 'node-app-2',
      label: 'HTTP:8080 (Healthy)',
      animated: activeSimEdges.includes('edge-alb-app-2'),
      style: { stroke: '#0ea5e9', strokeWidth: 2.5 },
      labelStyle: { fill: '#38bdf8', fontSize: 9, fontFamily: 'monospace' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#0ea5e9' }
    },
    {
      id: 'edge-alb-app-3',
      source: 'node-alb',
      target: 'node-app-3',
      label: 'HTTP:8080 (Batch)',
      style: { stroke: '#0ea5e9', strokeWidth: 2 },
      labelStyle: { fill: '#38bdf8', fontSize: 9, fontFamily: 'monospace' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#0ea5e9' }
    },

    // --- 5. Application Tier to Private Database via Security Group ---
    {
      id: 'edge-app-1-db',
      source: 'node-app-1',
      target: 'node-db',
      style: { stroke: '#f59e0b', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' }
    },
    {
      id: 'edge-app-2-db',
      source: 'node-app-2',
      target: 'node-db',
      label: 'TCP:5432 (sg-app-tier)',
      animated: activeSimEdges.includes('edge-app-2-db'),
      style: { stroke: '#f59e0b', strokeWidth: 2.5 },
      labelStyle: { fill: '#f59e0b', fontSize: 10, fontFamily: 'monospace' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' }
    },
    {
      id: 'edge-app-3-db',
      source: 'node-app-3',
      target: 'node-db',
      style: { stroke: '#f59e0b', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' }
    },
    {
      id: 'edge-sg-db-node',
      source: 'node-sg-db',
      target: 'node-db',
      label: 'Zero Public IP',
      style: { stroke: '#f59e0b', strokeWidth: 1.5, strokeDasharray: '3 3' },
      labelStyle: { fill: '#fbbf24', fontSize: 9, fontFamily: 'monospace' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' }
    },

    // --- 6. Hybrid Connectivity (IPSec VPN) ---
    {
      id: 'edge-app-vpn',
      source: 'node-app-2',
      target: 'node-vpn',
      style: { stroke: '#a855f7', strokeWidth: 3, strokeDasharray: '6 4' },
      label: 'IPSec Tunnel (10.0.2.0/24 ↔ 172.16.0.0/16)',
      labelStyle: { fill: '#c084fc', fontSize: 9, fontFamily: 'monospace' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' }
    },
    {
      id: 'edge-vpn-legacy-sms',
      source: 'node-vpn',
      target: 'node-legacy-sms',
      style: { stroke: '#a855f7', strokeWidth: 2.5, strokeDasharray: '4 4' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' }
    },
    {
      id: 'edge-vpn-legacy-erp',
      source: 'node-vpn',
      target: 'node-legacy-erp',
      label: 'Port 1433 Sync',
      style: { stroke: '#a855f7', strokeWidth: 2.5, strokeDasharray: '4 4' },
      labelStyle: { fill: '#c084fc', fontSize: 9, fontFamily: 'monospace' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' }
    },

    // --- 7. Identity & Access Pipeline (Explicit Sequential Flow) ---
    {
      id: 'edge-idp-federation',
      source: 'node-onprem-idp',
      target: 'node-federation',
      label: 'SAML 2.0 Assertions (Hybrid Trust)',
      style: { stroke: '#8b5cf6', strokeWidth: 2.5, strokeDasharray: '4 4' },
      labelStyle: { fill: '#a78bfa', fontSize: 9, fontFamily: 'monospace' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' }
    },
    {
      id: 'edge-federation-iam',
      source: 'node-federation',
      target: 'node-cloud-iam',
      label: 'Token Exchange',
      style: { stroke: '#8b5cf6', strokeWidth: 2 },
      labelStyle: { fill: '#a78bfa', fontSize: 9, fontFamily: 'monospace' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' }
    },
    {
      id: 'edge-iam-workloads',
      source: 'node-cloud-iam',
      target: 'node-workloads',
      label: 'Machine Roles',
      style: { stroke: '#06b6d4', strokeWidth: 1.5, strokeDasharray: '3 3' },
      labelStyle: { fill: '#22d3ee', fontSize: 9, fontFamily: 'monospace' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#06b6d4' }
    },
    {
      id: 'edge-iam-rbac',
      source: 'node-cloud-iam',
      target: 'node-rbac',
      label: 'RBAC Evaluation',
      style: { stroke: '#8b5cf6', strokeWidth: 2 },
      labelStyle: { fill: '#a78bfa', fontSize: 9, fontFamily: 'monospace' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' }
    },
    {
      id: 'edge-rbac-mfa',
      source: 'node-rbac',
      target: 'node-mfa',
      label: 'Privileged Challenge',
      style: { stroke: '#f43f5e', strokeWidth: 2 },
      labelStyle: { fill: '#fb7185', fontSize: 9, fontFamily: 'monospace' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#f43f5e' }
    },
    {
      id: 'edge-mfa-sso',
      source: 'node-mfa',
      target: 'node-sso',
      label: 'Verified Session',
      style: { stroke: '#8b5cf6', strokeWidth: 2.5 },
      labelStyle: { fill: '#a78bfa', fontSize: 9, fontFamily: 'monospace' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' }
    },

    // --- 8. SSO Fan-out to Authorized Services ---
    {
      id: 'edge-sso-lms',
      source: 'node-sso',
      target: 'node-service-lms',
      style: { stroke: '#38bdf8', strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#38bdf8' }
    },
    {
      id: 'edge-sso-erp',
      source: 'node-sso',
      target: 'node-service-erp',
      style: { stroke: '#a855f7', strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' }
    },
    {
      id: 'edge-sso-library',
      source: 'node-sso',
      target: 'node-service-library',
      style: { stroke: '#10b981', strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }
    },
    {
      id: 'edge-sso-sms',
      source: 'node-sso',
      target: 'node-service-sms',
      style: { stroke: '#38bdf8', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#38bdf8' }
    },

    // --- 9. Central Monitoring & Logging Feeds ---
    {
      id: 'edge-alb-monitoring',
      source: 'node-alb',
      target: 'node-monitoring',
      label: 'Network Events',
      style: { stroke: '#10b981', strokeWidth: 1.5, strokeDasharray: '4 4' },
      labelStyle: { fill: '#34d399', fontSize: 9, fontFamily: 'monospace' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }
    },
    {
      id: 'edge-db-monitoring',
      source: 'node-db',
      target: 'node-monitoring',
      label: 'DB Audit Logs',
      style: { stroke: '#10b981', strokeWidth: 1.5, strokeDasharray: '4 4' },
      labelStyle: { fill: '#34d399', fontSize: 9, fontFamily: 'monospace' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }
    },
    {
      id: 'edge-iam-monitoring',
      source: 'node-cloud-iam',
      target: 'node-monitoring',
      label: 'Identity Events',
      style: { stroke: '#10b981', strokeWidth: 1.5, strokeDasharray: '4 4' },
      labelStyle: { fill: '#34d399', fontSize: 9, fontFamily: 'monospace' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }
    }
  ], [activeSimEdges]);

  // Filter nodes & edges based on active toggles and search query
  const filteredNodes = useMemo(() => {
    return rawNodes.filter(node => {
      if (node.type === 'boundaryNode') {
        if (node.id === 'boundary-onprem-dc' && !filters.hybrid) return false;
        if (node.id === 'boundary-identity' && !filters.identity) return false;
        return true;
      }

      const comp = node.data as any;
      const cat = comp.category;

      if (!filters.network && (cat === 'edge' || cat === 'ingress')) return false;
      if (!filters.application && cat === 'application') return false;
      if (!filters.security && (cat === 'database' || comp.privateOnly)) return false;
      if (!filters.identity && cat === 'identity') return false;
      if (!filters.hybrid && cat === 'hybrid') return false;
      if (!filters.monitoring && cat === 'monitoring') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = comp.name?.toLowerCase().includes(q) || comp.label?.toLowerCase().includes(q);
        const titleMatch = comp.title?.toLowerCase().includes(q);
        const purposeMatch = comp.purpose?.toLowerCase().includes(q);
        return nameMatch || titleMatch || purposeMatch;
      }

      return true;
    });
  }, [rawNodes, filters, searchQuery]);

  const filteredEdges = useMemo(() => {
    return rawEdges.filter(edge => {
      if (!filters.application && (edge.id.includes('alb-app') || edge.id.includes('app-2-db'))) return false;
      if (!filters.hybrid && edge.id.includes('vpn')) return false;
      if (!filters.identity && (edge.id.includes('federation') || edge.id.includes('sso') || edge.id.includes('idp') || edge.id.includes('iam') || edge.id.includes('rbac') || edge.id.includes('mfa'))) return false;
      if (!filters.monitoring && edge.id.includes('monitoring')) return false;
      return true;
    });
  }, [rawEdges, filters]);

  const [nodes, setNodes, onNodesChange] = useNodesState(filteredNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(filteredEdges);

  React.useEffect(() => {
    setNodes(filteredNodes);
  }, [filteredNodes, setNodes]);

  React.useEffect(() => {
    setEdges(filteredEdges);
  }, [filteredEdges, setEdges]);

  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (node.type === 'boundaryNode') return;
    const compData = ARCHITECTURE_COMPONENTS[node.id];
    if (compData) {
      setSelectedComponent(compData);
    }
  }, []);

  const handleFilterToggle = (key: keyof FilterState) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleResetFilters = () => {
    setFilters({
      network: true,
      security: true,
      identity: true,
      monitoring: true,
      hybrid: true,
      application: true
    });
    setSearchQuery('');
  };

  const handleSimulationStep = (activeNodes: string[], activeEdges: string[]) => {
    setActiveSimNodes(activeNodes);
    setActiveSimEdges(activeEdges);
  };

  const handleSimulationReset = () => {
    setActiveSimNodes([]);
    setActiveSimEdges([]);
  };

  return (
    <div className={`relative w-full h-[calc(100vh-4rem)] flex flex-col bg-[#F5F9FF] dark:bg-slate-950 font-sans transition-colors duration-200 ${isFullscreen ? 'fixed inset-0 z-50 h-screen' : ''}`}>
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: Search & Quick Status */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search components (ALB, CDN, DB, MFA, SSO...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 shadow-sm focus:outline-none focus:border-[#2563EB] dark:focus:border-cyan-500 w-56 sm:w-72 transition"
            />
          </div>

          <button
            onClick={() => setIsValidationOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#ECFDF5] border border-emerald-200 text-[#047857] dark:bg-emerald-950/80 dark:border-emerald-500/40 dark:text-emerald-400 text-xs font-semibold shadow-xs hover:bg-emerald-100 dark:hover:bg-emerald-900/80 transition"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#047857] dark:text-emerald-400" />
            <span className="hidden sm:inline">Case Study Validation:</span> 12/12 Compliant
          </button>
        </div>

        {/* Right: Simulation & Canvas Actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsSimControlOpen(!isSimControlOpen)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition ${
              isSimControlOpen
                ? 'bg-[#2563EB] text-white ring-2 ring-blue-400/50'
                : 'bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 text-[#2563EB] dark:text-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Simulate Request Flow
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-xs transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* React Flow Canvas */}
      <div className="flex-1 w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.08 }}
          minZoom={0.15}
          maxZoom={1.5}
          attributionPosition="bottom-left"
          proOptions={{ hideAttribution: true }}
          className="cad-blueprint-grid"
        >
          <Background color="#1e293b" gap={25} size={1} />
          <Controls className="!bg-slate-900 !border-slate-800 !rounded-xl !shadow-xl [&>button]:!bg-slate-800 [&>button]:!border-slate-700 [&>button]:!text-slate-200" />
          <MiniMap 
            nodeColor={(node: any) => {
              if (node.type === 'boundaryNode') return '#0f172a';
              if (node.data?.category === 'database') return '#f59e0b';
              if (node.data?.category === 'hybrid') return '#a855f7';
              if (node.data?.category === 'identity') return '#8b5cf6';
              if (node.data?.category === 'user') return '#10b981';
              return '#38bdf8';
            }}
            className="!bg-slate-900/90 !border-slate-800 !rounded-xl overflow-hidden !shadow-2xl hidden md:block" 
          />
        </ReactFlow>
      </div>

      {/* Floating Bottom Filter Controls */}
      <div className="absolute bottom-5 left-5 z-20 hidden md:block">
        <FilterControls
          filters={filters}
          onFilterChange={handleFilterToggle}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* Floating Simulation Panel */}
      {isSimControlOpen && (
        <div className="absolute bottom-5 right-5 z-20">
          <SimulationControl
            onStepChange={handleSimulationStep}
            onReset={handleSimulationReset}
          />
        </div>
      )}

      {/* Details Slide-Over Drawer */}
      <ComponentDetailsDrawer
        component={selectedComponent}
        onClose={() => setSelectedComponent(null)}
      />

      {/* Architecture Validation Drawer */}
      <ValidationDrawer
        isOpen={isValidationOpen}
        onClose={() => setIsValidationOpen(false)}
      />
    </div>
  );
};

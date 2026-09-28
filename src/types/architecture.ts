export type ArchitectureLayer = 
  | 'user' 
  | 'edge' 
  | 'ingress' 
  | 'application' 
  | 'database' 
  | 'hybrid' 
  | 'identity' 
  | 'monitoring';

export type SubnetType = 'public' | 'application' | 'database' | 'on-premises' | 'external' | 'hybrid';

export interface ArchitectureComponent {
  id: string;
  name: string;
  title: string;
  category: ArchitectureLayer;
  subnet: SubnetType;
  networkLocation: string;
  purpose: string;
  securityRole: string;
  inputs: string[];
  outputs: string[];
  dependencies: string[];
  cloudMapping: {
    aws: string;
    azure: string;
    gcp: string;
    openSource: string;
  };
  securityConsiderations: string[];
  status?: 'healthy' | 'warning' | 'standby' | 'failed';
  implementationStatus?: 'Simulated Locally (₹0 Cost)' | 'Production Reference Architecture' | string;
  details?: {
    ipRange?: string;
    allowedPorts?: string[];
    encryption?: string;
    redundancy?: string;
    privateOnly?: boolean;
    availabilityZone?: 'Multi-AZ' | 'us-east-1a' | 'us-east-1b' | 'On-Premises';
  };
}

export interface CloudServiceMappingItem {
  component: string;
  layer: string;
  purpose: string;
  aws: string;
  azure: string;
  gcp: string;
  openSource: string;
  notes: string;
}

export interface SecurityControl {
  id: string;
  title: string;
  category: string;
  severity: string;
  principle: string;
  implementation: string;
  referenceStandard: string;
}

export interface FailureScenario {
  id: string;
  title: string;
  description: string;
  impactedComponent: string;
  expectedBehavior: string;
  status: 'IDLE' | 'SIMULATING' | 'RECOVERED';
  telemetryAlert: string;
}

export interface CloudWatchMetric {
  metricName: string;
  value: number;
  unit: string;
  timestamp: string;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
}

export interface CloudTrailEvent {
  eventId: string;
  eventTime: string;
  eventName: string;
  userIdentity: {
    principalId: string;
    type: string;
    arn: string;
  };
  sourceIPAddress: string;
  userAgent: string;
  requestParameters: Record<string, any>;
  responseElements?: Record<string, any>;
  errorCode?: string;
  errorMessage?: string;
}

export interface VpcFlowLogRecord {
  version: number;
  accountId: string;
  interfaceId: string;
  srcAddr: string;
  dstAddr: string;
  srcPort: number;
  dstPort: number;
  protocol: number; // 6 for TCP, 17 for UDP
  packets: number;
  bytes: number;
  startTime: number;
  endTime: number;
  action: 'ACCEPT' | 'REJECT';
  logStatus: 'OK' | 'NODATA' | 'SKIPDATA';
}

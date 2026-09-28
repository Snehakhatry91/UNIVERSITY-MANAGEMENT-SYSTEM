# Secure Hybrid Cloud Architecture for University Management System

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Terraform](https://img.shields.io/badge/Terraform-1.7-844FBA?logo=terraform&logoColor=white)](https://www.terraform.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> **Interactive Cloud Architecture, Security and Identity Visualization Platform**  
> *Developed for University Academic & Cloud Engineering Demonstration — 100% Free & Offline-First (₹0 Cost)*

---

## Overview

This project is a web-based, interactive cloud architecture and security visualization platform modeling an enterprise-grade **Secure Hybrid Cloud Architecture for a University Management System (SMS)**. 

Universities face distinct challenges during cloud adoption: while modern web portals demand elastic scalability and global CDN caching to absorb 10x traffic spikes during course registration and exam results releases, legacy student archives (spanning 40+ years) and on-premises ERP ledgers cannot be migrated overnight. This platform provides an interactive visualization of a 3-tier Zero-Trust Cloud VPC interconnected with an on-premises campus data center via encrypted Site-to-Site IPSec VPN.

> **CRITICAL ARCHITECTURAL NOTICE:**  
> This platform runs **100% locally on your laptop** with **simulated local telemetry**. No real cloud infrastructure is provisioned, no cloud accounts are required, no API keys are used, and **₹0 in charges** can ever be incurred.

---

## Problem Statement

1. **Severe Traffic Spikes:** Semester course registration generates severe traffic surges that crash monolithic on-premises university portals.
2. **Security & Data Exposure:** Traditional university setups often expose databases to local campus networks without strict subnet segmentation or mandatory Multi-Factor Authentication (MFA).
3. **Heritage Lock-in:** Complete "big-bang" cloud migrations are impossible due to legacy ERP ledgers, historical paper transcript archives, and physical Active Directory identity controllers.
4. **Dispersed Authentication:** Disjointed logins across LMS (Moodle/Canvas), Library catalogs, ERP, and student portals cause credential fatigue and phishing exposure.

---

## Objectives

- **3-Tier Zero-Trust Network Isolation:** Model a secure VPC with Public Ingress, Private Compute, and Strictly Isolated Database tiers.
- **Redundant Hybrid Interconnectivity:** Connect cloud microservices to on-premises heritage systems via dual-tunnel IPSec VPN with BGP routing.
- **Federated Identity & SSO:** Demonstrate SAML 2.0 / OIDC trust federation with an on-premises Identity Provider (IdP) and single sign-on across SMS, LMS, ERP, and Library portals.
- **Comprehensive Defense-in-Depth:** Detail 15 architectural security controls, including TLS 1.3, AES-256 KMS encryption at rest, least-privilege RBAC, and mandatory MFA.
- **Interactive Simulations & CAD Blueprinting:** Provide interactive request trace simulation, secure login simulation, live telemetry streaming, and high-resolution CAD engineering blueprint exports (A3/A2 landscape).

---

## Technology Stack

- **Frontend Core:** React 18, TypeScript 5, Vite 6
- **Styling & UI:** Tailwind CSS, JetBrains Mono & Inter Google Fonts
- **Diagramming & Canvas:** React Flow (`@xyflow/react`)
- **Iconography:** Lucide React
- **Export Engine:** `html-to-image` (High-resolution PNG & browser PDF printing)
- **Data & State:** In-memory TypeScript data models, local telemetry simulation

---

## Architecture Topology

```
[Students / Faculty / Admins]
             │ (HTTPS TLS 1.3)
             ▼
      [Public Internet]
             │
             ▼
   [Anycast Edge CDN] (Static Cache: CSS/JS/Media)
             │
             ▼
  ┌───────────────────────────────────────────────────────────────────┐
  │ CLOUD VPC / VNET (10.0.0.0/16)                                    │
  │                                                                   │
  │  ┌─────────────────────────────────────────────────────────────┐  │
  │  │ PUBLIC INGRESS SUBNET (10.0.1.0/24)                         │  │
  │  │  • Internet Gateway (IGW)                                   │  │
  │  │  • Dual-AZ Application Load Balancer (ALB) - Port 443 HTTPS │  │
  │  └──────────────────────────────┬──────────────────────────────┘  │
  │                                 │ (Port 8080 Private Round-Robin) │
  │  ┌──────────────────────────────▼──────────────────────────────┐  │
  │  │ APPLICATION SUBNET (10.0.2.0/24)                            │  │
  │  │  • App Server 1 (AZ-1) - Stateless Container                │  │
  │  │  • App Server 2 (AZ-2) - Stateless Container                │  │
  │  │  • App Server 3 (AZ-3) - Stateless Container                │  │
  │  └───────────────┬──────────────────────────────┬──────────────┘  │
  │                  │ (Port 5432 Inbound)          │ (Hybrid Sync)   │
  │  ┌───────────────▼──────────────┐               │                 │
  │  │ PRIVATE DB SUBNET (10.0.3.0) │               │                 │
  │  │  • Master PostgreSQL Engine  │               │                 │
  │  │  • NO PUBLIC IP / NO IGW     │               │                 │
  │  └──────────────────────────────┘               │                 │
  └─────────────────────────────────────────────────┼─────────────────┘
                                                    │
                 ┌──────────────────────────────────┴─────────────────┐
                 │ SITE-TO-SITE IPSEC VPN TUNNEL (AES-256 / SHA-384)  │
                 └──────────────────────────────────┬─────────────────┘
                                                    │
  ┌─────────────────────────────────────────────────▼─────────────────┐
  │ UNIVERSITY ON-PREMISES DATA CENTER (172.16.0.0/16)                │
  │  • Campus Customer Gateway (CGW)                                  │
  │  • University Identity Provider (Active Directory / SAML IdP)     │
  │  • Legacy Student Transcripts Archive (172.16.10.12)              │
  │  • Legacy University ERP & Payroll (172.16.20.15)                 │
  └───────────────────────────────────────────────────────────────────┘
```

---

## Network Architecture & Segmentation

The VPC utilizes RFC 1918 address space with non-overlapping subnets:

| Subnet Identifier | CIDR Prefix | Subnet Class | Default Gateway Route | Ingress Restrictions |
| :--- | :--- | :--- | :--- | :--- |
| **Public Subnet** | `10.0.1.0/24` | Public DMZ | `0.0.0.0/0` → Internet Gateway | Port 443 (HTTPS) from CDN & Public |
| **Application Subnet** | `10.0.2.0/24` | Private Compute | `0.0.0.0/0` → NAT Gateway (outbound only) | Port 8080 strictly from ALB Security Group |
| **Database Subnet** | `10.0.3.0/24` | Isolated Private | Local VPC only (`10.0.0.0/16`) — NO IGW | Port 5432 strictly from App Tier Security Group |
| **On-Premises DC** | `172.16.0.0/16` | On-Premises Enterprise | Internal Core Switch → VPN Gateway | Ports 1433/443 strictly via IPSec VPN tunnel |

---

## Security Architecture (15 Defense-in-Depth Controls)

1. **Network Segmentation:** Three-tier VPC isolation separating public, application, and database subnets.
2. **Stateful Security Groups & NSGs:** Virtual firewalls allowing only minimal functional ports (ALB: 443, App: 8080, DB: 5432). Default: DENY ALL.
3. **Private Database with Zero Public IP:** Complete isolation of student data; no route to the Internet Gateway.
4. **Central Cloud IAM Governance:** Ephemeral STS tokens; zero standing root credentials.
5. **Role-Based Access Control (RBAC):** Fine-grained permission matrices for Student, Faculty, Admin, and Workload identities.
6. **Adaptive Multi-Factor Authentication (MFA):** Enforced unconditionally for admin console and faculty grading actions.
7. **Identity Federation (SAML 2.0 / OIDC):** Cloud trusts signed assertions from on-premises IdP without storing passwords.
8. **Single Sign-On (SSO):** One unified session grants access to SMS, LMS, ERP, and Library with Single Logout (SLO).
9. **End-to-End Encryption in Transit (TLS 1.3):** Enforced across all web pathways with preloaded HSTS.
10. **Encryption at Rest (AES-256 KMS):** Master encryption keys protect database storage, backups, and app disks.
11. **Encrypted Hybrid Connectivity (IPSec VPN):** AES-256-GCM encrypted tunnel connects cloud workloads to on-premises servers.
12. **Comprehensive Telemetry Logging:** Ingestion of ALB access logs, application traces, PostgreSQL queries, and VPC flow logs.
13. **Tamper-Evident Security Auditing (SIEM):** Management plane audit trails stored in immutable WORM buckets.
14. **Principle of Least Privilege (PoLP):** Workload service accounts operate with minimal required entitlements.
15. **Defense in Depth Strategy:** Multi-layered protective redundancy where failure of one layer does not compromise the institution.

---

## Identity & Access (RBAC Matrix)

- **Student Body:** Read access to personal profile, courses, assignments, LMS, and digital library; coursework submission write; NO administrative or peer-record visibility.
- **Faculty & Academic Staff:** Manage assigned course modules, grade submissions, view student rosters; mandatory MFA for grade modification; NO infrastructure or financial ledger access.
- **System Administrators:** User lifecycle management, security group updates, audit log reviews, disaster recovery execution; mandatory hardware MFA and session recording.
- **Workload / Machine Identity:** Microservice container-to-service communication; ephemeral STS tokens; zero interactive human privileges.

---

## Interactive Simulations

1. **Request Flow Simulator:**
   - Traces an incoming student request step-by-step: Student Browser → Public Internet → Edge CDN (Cache Check) → Application Load Balancer → App Server 2 (Round-Robin) → Private Database (Port 5432) → Response returned.
   - Includes a live telemetry console with timestamps and active visual path highlights.
2. **Secure Login Simulator:**
   - Demonstrates the complete enterprise authentication pipeline: User → University IdP → SAML 2.0 Federation → Adaptive MFA Challenge → Cloud STS Token Exchange → RBAC Policy Evaluation → SSO Access Granted.
3. **Simulated Telemetry & Alerts:**
   - Live stream of ALB access logs, application traces, database checkpoints, and VPC flow logs.
   - Interactive buttons to dispatch synthetic alerts: **Unauthorized Login**, **High CPU Spike**, and **Application Internal Error 500**.

---

## CAD Engineering Architecture View

For university project viva, reports, and portfolio presentations, the platform includes a **CAD Architecture View**:
- Modeled to ISO drawing sheet standards (A3/A2 landscape proportions).
- Includes an official **Engineering Title Block** with Drawing Number, Revision Control, Scale, Date, and Discipline.
- Outlines clear subnet boundaries, component specification callouts, and visual connection legend.
- **One-Click Export:** Download as a crisp high-resolution PNG or print directly to PDF.

---

## Cloud Service Mapping Reference

| Architecture Component | AWS Reference | Azure Reference | GCP Reference | Open-Source / Local Equivalent |
| :--- | :--- | :--- | :--- | :--- |
| **Edge CDN** | Amazon CloudFront | Azure Front Door | Cloud CDN | Varnish Cache / Nginx Edge |
| **Load Balancer** | Application Load Balancer (ALB) | Azure Application Gateway | Cloud Load Balancing | HAProxy / Traefik / Envoy |
| **Compute Tier** | EC2 Auto Scaling / ECS Fargate | VM Scale Sets / Container Apps | Compute Engine MIG / Cloud Run | Kubernetes / Docker Swarm |
| **Relational Database** | Amazon RDS for PostgreSQL | Azure Database for PostgreSQL | Cloud SQL for PostgreSQL | PostgreSQL 16 Cluster + PgBouncer |
| **IAM & Governance** | AWS IAM / Identity Center | Microsoft Entra ID / Azure RBAC | Google Cloud IAM | Keycloak / FreeIPA |
| **Hybrid Connectivity** | AWS Site-to-Site VPN | Azure VPN Gateway | Cloud VPN (HA-VPN) | StrongSwan IPSec Gateway |
| **Central Monitoring** | CloudWatch + CloudTrail + GuardDuty | Azure Monitor + Sentinel | Cloud Operations Suite | ELK Stack (Elasticsearch) + Prometheus |

*(Note: Reference mapping only. No cloud accounts are required to run this project.)*

---

## Project Structure

```
CAD_PROJECT/
├── .github/
│   ├── workflows/
│   │   └── ci-cd.yml         # GitHub Actions: TypeScript build & Checkov security scan
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md     # Standardized GitHub issue bug report template
│   │   └── feature_request.md# Standardized GitHub feature request template
│   └── PULL_REQUEST_TEMPLATE.md # GitHub PR checklist & verification template
├── cloudformation/
│   └── cvgu-architecture.yaml# AWS CloudFormation multi-tier VPC & hybrid network template
├── docs/
│   ├── architecture.md       # Comprehensive system design specification
│   ├── security.md           # 15 defense-in-depth controls & threat matrix
│   ├── deployment.md         # Deployment runbook and ₹0 cost model
│   └── assumptions.md        # Boundary conditions & institutional assumptions
├── src/
│   ├── components/
│   │   ├── cad/              # CAD Architecture View with Title Block & Export
│   │   ├── canvas/           # React Flow architecture canvas, nodes, edges & simulator
│   │   ├── common/           # Navbar, Sidebar, Badges
│   │   ├── docs/             # 23-chapter technical documentation viewer
│   │   ├── hybrid/           # Hybrid connectivity & IPSec VPN details
│   │   ├── identity/         # IAM, RBAC matrix, and Secure Login simulator
│   │   ├── mapping/          # Cross-cloud service comparison table
│   │   ├── monitoring/       # Simulated telemetry streams & synthetic alerts
│   │   ├── network/          # Subnet CIDR layout & Security Group rules
│   │   └── security/         # 15 Defense-in-Depth controls viewer
│   ├── context/              # University Data Context & state providers
│   ├── data/                 # Architectural specifications, validation data & logs
│   ├── portal/               # Student, Faculty & Admin role workspaces
│   ├── styles/               # Tailwind CSS & CAD blueprint grid styles
│   ├── types/                # TypeScript interface definitions
│   ├── App.tsx               # Main layout and tab orchestrator
│   └── main.tsx              # React DOM entrypoint
├── terraform/                # Complete AWS Production Infrastructure as Code
│   ├── alb.tf                # Application Load Balancer & TLS 1.3 listener
│   ├── asg.tf                # Auto Scaling Group & Launch Templates
│   ├── iam.tf                # Least-privilege IAM roles & KMS policies
│   ├── main.tf               # AWS provider & Terraform backend config
│   ├── outputs.tf            # DNS, VPC, and RDS endpoint outputs
│   ├── rds.tf                # Multi-AZ PostgreSQL with KMS encryption
│   ├── s3.tf                 # Immutable audit log buckets & WORM storage
│   ├── variables.tf          # Parameterized environment variables
│   ├── vpc.tf                # 3-tier subnets, IGW, and NAT Gateways
│   └── vpn.tf                # IPSec Site-to-Site VPN with BGP routing
├── .env.example              # Environment variables template
├── .gitignore                # Comprehensive Git ignore rules (Node, Terraform, OS)
├── CONTRIBUTING.md            # Guidelines for open source and team contributors
├── index.html                # HTML5 entrypoint with Google Fonts
├── LICENSE                   # MIT Open Source License
├── package.json              # Project dependencies and npm scripts
├── README.md                 # Primary project documentation
├── SECURITY.md               # Security policy & vulnerability reporting guide
├── tailwind.config.js        # Tailwind CSS design system configuration
├── tsconfig.json             # TypeScript compiler configuration
└── vite.config.ts            # Vite bundler configuration
```

---

## Cost & Deployment Model

- **Development Cost:** **₹0 (Strictly Free)**
- **Required Cloud Accounts:** **None** (AWS, Azure, or GCP accounts are NOT needed)
- **Required API Keys:** **None**
- **Required Credit Cards:** **None**
- **Paid SaaS / Subscriptions:** **None**
- **Core Execution:** 100% on the local machine in web browser
- **Cloud Services:** Reference architecture mappings only

---

## How to Run

### 1. Prerequisites
- Node.js v18.0.0 or higher (Tested on v22.19.0)
- npm v9.0.0 or higher

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Local Development Server
```bash
npm run dev
```

Open your browser at: `http://localhost:5173`

### 4. Build Production Bundle
```bash
npm run build
```

### 5. Pushing to GitHub

To publish this project to your GitHub account:

```bash
# Initialize git (if not already initialized)
git init -b main

# Stage and commit all files
git add .
git commit -m "feat: complete secure hybrid cloud architecture platform"

# Create a new repository on GitHub (e.g. named 'CAD_PROJECT' or 'cvgu-hybrid-cloud')
# Link your remote repository and push
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<REPO_NAME>.git
git branch -M main
git push -u origin main
```

---

## How to Export the Architecture

1. Open the **CAD Architecture View** tab from the sidebar.
2. Click **Export High-Res PNG** to instantly download a high-resolution image (`university-cloud-cad-architecture.png`).
3. Click **Print / Save to PDF** to open the browser print dialog with print-optimized landscape styling.

---

## Limitations

- **Simulated Telemetry:** CPU utilization, packet logs, and alert triggers are local interactive simulations; no production cloud telemetry agent is running.
- **Client-Side Execution:** The application executes in the user's web browser without requiring a remote database server.

---

## Future Enhancements

- **Dedicated Interconnect:** Transition from IPSec VPN to 1 Gbps AWS Direct Connect / Azure ExpressRoute.
- **Serverless Worker Tier:** Integrate AWS Lambda / Azure Functions for asynchronous PDF transcript watermarking and batch report generation.
- **In-Memory Caching:** Add a distributed Redis cluster in the application subnet for sub-millisecond course catalog caching.

---

## Resume Description

Here are suggested bullet points you can include on your resume based on what was built:

- **Cloud & Solution Architecture:** Designed a 3-tier Zero-Trust hybrid cloud architecture for a university management system with segmented public DMZ, stateless microservices, and an isolated private database with zero public IP exposure.
- **Hybrid Networking & Security:** Architected an IPSec Site-to-Site VPN with BGP dynamic routing linking Cloud VPC (`10.0.0.0/16`) to campus on-premises data center (`172.16.0.0/16`), safeguarding legacy ERP ledgers and historical student transcripts.
- **Identity & Access Governance:** Specified a SAML 2.0 / OIDC identity federation model with university Active Directory IdP, implementing adaptive MFA, Single Sign-On (SSO), and granular Role-Based Access Control (RBAC) across 4 user profiles.
- **Full-Stack Interactive Platform:** Built an offline-first architecture visualization platform in React 18, TypeScript, and React Flow, featuring real-time request flow tracing, simulated security telemetry, and ISO-compliant CAD engineering blueprint export.

---

## License

This project is open-source and distributed under the [MIT License](LICENSE).

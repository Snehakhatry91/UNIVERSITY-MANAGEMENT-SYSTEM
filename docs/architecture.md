# University Cloud Architecture: System Design Specification

## Project Title
**Secure Hybrid Cloud Architecture for a University Management System**
*Subtitle: Interactive Cloud Architecture, Security and Identity Visualization Platform*

---

## 1. System Overview
The University Management System (SMS) architecture addresses modern institutional demands for elastic scalability, zero-trust security, and integration with legacy campus records. Academic workloads feature extreme demand peaks during course enrollment and exam results publication, which historically overwhelmed legacy on-premises servers.

This architecture decouples student web traffic into an autoscaling cloud Virtual Private Cloud (VPC), while maintaining secure, encrypted, low-latency hybrid interconnectivity to on-premises data centers where heritage ERP ledgers, student degree archives, and Active Directory identity servers reside.

---

## 2. High-Level Topology

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

## 3. Network Segmentation & CIDR Structure

The cloud environment strictly prevents flat-network security failures by isolating workloads across three distinct subnets:

| Subnet Identifier | CIDR Prefix | Subnet Class | Default Gateway Route | Ingress Restrictions |
| :--- | :--- | :--- | :--- | :--- |
| **Public Subnet** | `10.0.1.0/24` | Public DMZ | `0.0.0.0/0` → Internet Gateway | Port 443 (HTTPS) from CDN & Public |
| **Application Subnet** | `10.0.2.0/24` | Private Compute | `0.0.0.0/0` → NAT Gateway (outbound only) | Port 8080 strictly from ALB Security Group |
| **Database Subnet** | `10.0.3.0/24` | Isolated Private | Local VPC only (`10.0.0.0/16`) — NO IGW | Port 5432 strictly from App Tier Security Group |
| **On-Premises DC** | `172.16.0.0/16` | On-Premises Enterprise | Internal Core Switch → VPN Gateway | Ports 1433/443 strictly via IPSec VPN tunnel |

---

## 4. Compute Tier Scalability & Resilience
- **Stateless Microservices:** Compute instances store no state on local disks; session validation relies on cryptographically signed JWT tokens issued via federation.
- **Round-Robin Load Distribution:** The Application Load Balancer distributes requests across healthy instances in availability zones AZ-1, AZ-2, and AZ-3.
- **Continuous Health Checks:** ALB checks `/healthz` endpoints every 15 seconds. Unhealthy instances are automatically detached from target groups.

---

## 5. Database Isolation & Zero-Trust Posture
- **Zero Internet Routability:** The master relational database resides in an isolated subnet with no public IPv4 address and no route to the Internet Gateway.
- **Firewall Guardrails:** Stateful security groups (`sg-db-tier`) drop all ingress packets not originating from the specific application tier security group (`sg-app-tier`).
- **Encrypted at Rest:** Database storage volumes, automated snapshots, and transaction logs are encrypted using customer-managed KMS keys (AES-256).

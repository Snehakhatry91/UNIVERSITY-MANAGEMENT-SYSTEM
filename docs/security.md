# Security Architecture & Defense-in-Depth Specification

## 1. Overview
The security framework implements the **Zero-Trust Architecture (ZTA)** paradigm as codified in **NIST SP 800-207** and **ISO/IEC 27001**. The architecture assumes internal networks are untrusted and enforces cryptographic identity verification, segmented network perimeters, and least-privilege access across all layers.

---

## 2. Fifteen Defense-in-Depth Controls

1. **Network Segmentation:** Three-tier VPC isolation (Public Ingress, Private Compute, Isolated DB) preventing unauthorized lateral movement.
2. **Stateful Security Groups & NSGs:** Virtual firewalls allowing only minimal functional ports (ALB: 443, App: 8080 from ALB, DB: 5432 from App). Default action is DENY ALL.
3. **Private Database with Zero Public IP:** Eliminates external attack surface by ensuring the database has no public IPv4 address and no route to the Internet Gateway.
4. **Central Cloud IAM Governance:** All human operators and compute workloads use ephemeral credentials with strict condition policies. Zero standing root credentials.
5. **Role-Based Access Control (RBAC):** Distinct policy enforcement for Student, Faculty, Administrator, and Workload identities.
6. **Adaptive Multi-Factor Authentication (MFA):** Enforced unconditionally for all administrative operators and faculty publishing grades.
7. **Identity Federation (SAML 2.0 / OIDC):** Single source of truth hosted on-premises; password hashes are never exported or stored in the cloud.
8. **Single Sign-On (SSO):** Centralized session lifecycle with Single Logout (SLO) capabilities covering SMS, LMS, ERP, and Library portals.
9. **End-to-End Encryption in Transit (TLS 1.3):** Enforced across all ingress pathways with preloaded HSTS and strong cipher suites.
10. **Encryption at Rest (AES-256 KMS):** Master encryption keys rotated annually protect database storage, backups, and app server disks.
11. **Encrypted Hybrid Connectivity (IPSec VPN):** AES-256-GCM encrypted tunnel connects cloud workloads to on-premises heritage servers.
12. **Comprehensive Telemetry Logging:** Ingestion of ALB access logs, application traces, PostgreSQL queries, and VPC flow logs.
13. **Tamper-Evident Security Auditing (SIEM):** Management plane audit trails stored in immutable WORM buckets for compliance.
14. **Principle of Least Privilege (PoLP):** Workload service accounts operate with scoped read/write permissions tailored strictly to immediate operational tasks.
15. **Defense in Depth Strategy:** Perimeter, network, host, identity, and data layers operate independently; breach of one layer does not compromise the institution.

---

## 3. Threat Matrix & Mitigations

| Threat Vector | Attack Scenario | Architectural Defense |
| :--- | :--- | :--- |
| **Distributed Denial of Service (DDoS)** | Volumetric floods targeting student portal during registration | Anycast CDN edge absorbs L3/L4 volumetric floods; ALB buffers L7 spikes. |
| **Credential Stuffing / Brute Force** | Automated dictionary attacks against student login | Perimeter rate-limiting, SAML IdP lockouts, and mandatory step-up MFA. |
| **SQL Injection (SQLi)** | Malformed input exploiting dynamic query concatenation | Parameterized queries via ORM, input sanitization, and DB subnet isolation. |
| **Lateral Network Intrusion** | Compromised web server attempting to scan database | Security groups reject any traffic not matching `sg-app-tier:8080 -> sg-db-tier:5432`. |
| **Eavesdropping on Hybrid Link** | Man-in-the-middle sniffing campus network packets | IPSec AES-256 tunnel with SHA-384 cryptographic hashing on transit packets. |

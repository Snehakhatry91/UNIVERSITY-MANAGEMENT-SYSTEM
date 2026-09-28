# Architectural Assumptions & Boundary Conditions

## 1. Institutional Assumptions
- **Campus Connectivity:** The university on-premises server room is equipped with dual redundant enterprise internet connections capable of sustaining encrypted IPSec tunnels with sub-50ms latency to the cloud region.
- **Identity Standards:** The university directory server (Microsoft Active Directory, OpenLDAP, or FreeIPA) supports modern SAML 2.0 or OpenID Connect (OIDC) identity federation protocols.
- **Workload Profile:** University workloads are primarily HTTPS web and mobile REST/GraphQL APIs, with predictable bursts during semester course enrollment and grade releases.

## 2. Security Boundaries & Constraints
- **Zero Public DB Ingress:** The master database tier cannot and must not receive incoming packets from 0.0.0.0/0.
- **Credential Storage:** User passwords must never be stored in cloud user pools; cryptographic assertions issued by the campus IdP are verified via public keys.
- **Administrative Privileges:** No human administrator possesses persistent root credentials; administrative actions require Just-In-Time (JIT) role assumption and hardware MFA.

## 3. Simulation Scope
- This visualization platform is an interactive architecture model with simulated local telemetry.
- No live cloud accounts, billable services, or remote databases are accessed during execution.

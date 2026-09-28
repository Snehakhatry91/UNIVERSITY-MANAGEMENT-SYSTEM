# Security Policy

## Supported Versions

Security updates and patches are actively maintained for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0.0 | :x:                |

---

## Architectural Security Context

This repository models an academic demonstration of a **Zero-Trust Secure Hybrid Cloud Architecture**:
- All telemetry, authentication events, and server responses in the frontend application are **100% simulated client-side**.
- No production cloud credentials, live AWS/Azure accounts, or student PII (Personally Identifiable Information) are stored or accessed by this codebase.
- The Terraform and CloudFormation templates provided in `/terraform` and `/cloudformation` adhere to defense-in-depth principles (least privilege IAM, KMS encryption at rest, multi-AZ high availability, and network subnet isolation).

---

## Reporting a Vulnerability

If you discover a potential security vulnerability within this repository (such as an inadvertently committed secret, insecure default template setting, or dependency vulnerability):

1. **Do NOT open a public GitHub issue.**
2. Send an email to the project maintainers or use GitHub's private vulnerability reporting feature:
   - Go to the repository's **Security** tab.
   - Click **Report a vulnerability**.
3. Include the following details in your advisory:
   - Type of issue (e.g. secret exposure, vulnerable dependency, injection)
   - Location (file path and line number)
   - Steps to reproduce or proof-of-concept
   - Impact assessment

Maintainers will acknowledge receipt within 48 hours and work toward remediation before any public disclosure.

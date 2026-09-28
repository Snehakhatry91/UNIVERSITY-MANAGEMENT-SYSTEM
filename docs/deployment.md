# Deployment & Operational Runbook

## 1. Zero-Cost Local Execution Model
This platform operates completely offline on a student laptop.
- **Financial Cost:** ₹0 (Completely Free)
- **Cloud Accounts Required:** None (AWS, Azure, GCP accounts are NOT required)
- **API Keys / Credit Cards:** None
- **External SaaS / Paid APIs:** None

---

## 2. Prerequisites
- **Node.js:** v18.0.0 or higher (Tested on v22.19.0)
- **NPM:** v9.0.0 or higher (Tested on v10.9.3)
- **Modern Web Browser:** Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.

---

## 3. Installation & Local Development Server

```bash
# 1. Clone repository or navigate to workspace directory
cd CAD_PROJECT

# 2. Install dependencies (offline-safe once cached)
npm install

# 3. Start local Vite development server
npm run dev
```

The application will start immediately at:
`http://localhost:5173`

---

## 4. Production Build & Local Preview

```bash
# Build optimized static distribution
npm run build

# Preview production build locally
npm run preview
```

---

## 5. Reference Production Cloud Deployment Model (Theoretical)
If an institution wishes to implement this architecture on commercial cloud providers:

1. **Infrastructure as Code (IaC):** Use Terraform or AWS CloudFormation modules to stand up the VPC, subnets, and route tables.
2. **Key Management:** Provision AWS KMS Customer Managed Key with automated 365-day rotation.
3. **Database Tier:** Provision Multi-AZ Amazon RDS PostgreSQL in private subnets with automated snapshots.
4. **Hybrid Link:** Provision AWS Virtual Private Gateway and establish IPSec BGP peering with the campus firewall.
5. **Compute Tier:** Deploy containerized microservices to AWS ECS Fargate tasks in the application subnet.
6. **Perimeter:** Configure Amazon Route 53 with AWS CloudFront CDN and AWS WAF rate-limiting rules.

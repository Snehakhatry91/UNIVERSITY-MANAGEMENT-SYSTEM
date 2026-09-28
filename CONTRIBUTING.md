# Contributing to CVGU Secure Hybrid Cloud Management System

Thank you for your interest in contributing to the **CVGU Secure Hybrid Cloud Management System**! This guide outlines how to contribute effectively to this repository.

---

## Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free experience for everyone. Please be respectful and considerate when opening issues, submitting pull requests, and engaging in discussions.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18.0.0 or higher (LTS recommended)
- [npm](https://www.npmjs.com/) v9.0.0 or higher
- [Git](https://git-scm.com/)

### Local Setup

1. **Fork the repository** on GitHub.
2. **Clone your fork locally**:
   ```bash
   git clone https://github.com/Snehakhatry91/UNIVERSITY-MANAGEMENT-SYSTEM.git
   cd UNIVERSITY-MANAGEMENT-SYSTEM
   ```
3. **Install project dependencies**:
   ```bash
   npm install
   ```
4. **Start the local Vite development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

5. **Verify the build passes**:
   ```bash
   npm run build
   ```

---

## Development Workflow

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. Make your modifications following our code conventions.
3. Test your changes locally to ensure no TypeScript compilation or styling regressions occur:
   ```bash
   npm run build
   ```
4. Commit your changes with clear, descriptive commit messages:
   ```bash
   git commit -m "feat(network): add subnet routing table visualization"
   ```
5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Open a **Pull Request** against the `main` branch.

---

## Commit Message Conventions

We encourage Conventional Commits:
- `feat:` A new feature or simulator capability
- `fix:` A bug fix in UI, diagramming, or state logic
- `docs:` Documentation updates in `/docs` or `README.md`
- `style:` Formatting, whitespace, or CSS polish without logic changes
- `refactor:` Code restructuring without functional behavior changes
- `ci:` Changes to GitHub Actions workflows in `.github/workflows`
- `chore:` Dependency bumps, tooling updates, configuration changes

---

## Infrastructure as Code (IaC) Guidelines

When contributing to `/terraform` or `/cloudformation`:
- **Zero Secrets**: Never commit AWS access keys, credentials, or production passwords. Use variables with `sensitive = true` or reference AWS Secrets Manager.
- **Formatting**: Run `terraform fmt` before submitting PRs.
- **Static Analysis**: Changes in `/terraform` are validated against Checkov security rules via GitHub Actions.

---

## Reporting Issues

- **Bug Reports**: Use our [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md) with reproduction steps and browser info.
- **Feature Requests**: Use our [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md) describing the use case and architecture context.
- **Security Vulnerabilities**: Please review our [Security Policy](SECURITY.md) for responsible disclosure.

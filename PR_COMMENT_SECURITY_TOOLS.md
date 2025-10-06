# 🔒 Security & Quality Tools - Implementation Guide

## PR Comment Summary

This document provides the minimal diffs required to configure all requested security and quality tools for the External Review Repository.

---

## 📋 Configuration Status

| Tool | Status | Priority | Configuration Files |
|------|--------|----------|-------------------|
| **CodeQL** | ❌ Not Configured | High | `.github/workflows/codeql.yml` |
| **Dependabot** | ❌ Not Configured | High | `.github/dependabot.yml` |
| **SonarCloud** | ❌ Not Configured | High | `sonar-project.properties`, `.github/workflows/sonarcloud.yml` |
| **Snyk** | ❌ Not Configured | High | `.snyk`, `.github/workflows/snyk.yml` |
| **DeepSource** | ❌ Not Configured | Medium | `.deepsource.toml` |

---

## 🚀 Quick Implementation Steps

### 1. Create `.github` Directory Structure
```bash
mkdir -p .github/workflows
```

### 2. Add CodeQL Configuration

**File:** `.github/workflows/codeql.yml`

<details>
<summary>Click to expand CodeQL workflow</summary>

```yaml
name: "CodeQL"

on:
  push:
    branches: [ "main", "master", "develop" ]
  pull_request:
    branches: [ "main", "master", "develop" ]
  schedule:
    - cron: '0 0 * * 1'

jobs:
  analyze:
    name: Analyze
    runs-on: ubuntu-latest
    permissions:
      actions: read
      contents: read
      security-events: write

    strategy:
      fail-fast: false
      matrix:
        language: [ 'javascript', 'typescript' ]

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4

    - name: Initialize CodeQL
      uses: github/codeql-action/init@v3
      with:
        languages: ${{ matrix.language }}
        queries: security-extended,security-and-quality

    - name: Autobuild
      uses: github/codeql-action/autobuild@v3

    - name: Perform CodeQL Analysis
      uses: github/codeql-action/analyze@v3
      with:
        category: "/language:${{matrix.language}}"
```
</details>

### 3. Add Dependabot Configuration

**File:** `.github/dependabot.yml`

<details>
<summary>Click to expand Dependabot configuration</summary>

```yaml
version: 2
updates:
  # InstallSure Backend
  - package-ecosystem: "npm"
    directory: "/applications/installsure/backend"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 5
    reviewers:
      - "Installsure/engineering"
    labels:
      - "dependencies"
      - "area:installsure"

  # InstallSure Frontend
  - package-ecosystem: "npm"
    directory: "/applications/installsure/frontend"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 5
    reviewers:
      - "Installsure/engineering"
    labels:
      - "dependencies"
      - "area:installsure"

  # Demo Dashboard
  - package-ecosystem: "npm"
    directory: "/applications/demo-dashboard"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 3
    labels:
      - "dependencies"

  # FF4U
  - package-ecosystem: "npm"
    directory: "/applications/ff4u"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 3
    labels:
      - "dependencies"

  # RedEye
  - package-ecosystem: "npm"
    directory: "/applications/redeye"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 3
    labels:
      - "dependencies"

  # ZeroStack
  - package-ecosystem: "npm"
    directory: "/applications/zerostack"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 3
    labels:
      - "dependencies"

  # Hello
  - package-ecosystem: "npm"
    directory: "/applications/hello"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 3
    labels:
      - "dependencies"

  # Avatar
  - package-ecosystem: "npm"
    directory: "/applications/avatar"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 3
    labels:
      - "dependencies"

  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 3
    labels:
      - "dependencies"
      - "github-actions"
```
</details>

### 4. Add SonarCloud Configuration

**File:** `sonar-project.properties`

```properties
sonar.projectKey=Installsure_External-Review-Repository
sonar.organization=installsure

sonar.sources=applications
sonar.tests=applications
sonar.exclusions=**/node_modules/**,**/dist/**,**/build/**,**/.next/**,**/coverage/**
sonar.test.inclusions=**/*.test.ts,**/*.test.tsx,**/*.test.js,**/*.test.jsx,**/*.spec.ts,**/*.spec.tsx

sonar.javascript.lcov.reportPaths=**/coverage/lcov.info
sonar.typescript.lcov.reportPaths=**/coverage/lcov.info

sonar.language=js,ts
sonar.qualitygate.wait=true
```

**File:** `.github/workflows/sonarcloud.yml`

<details>
<summary>Click to expand SonarCloud workflow</summary>

```yaml
name: SonarCloud Analysis

on:
  push:
    branches:
      - main
      - master
      - develop
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  sonarcloud:
    name: SonarCloud Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: |
          cd applications/installsure/backend && npm ci
          cd ../frontend && npm ci

      - name: Run tests with coverage
        run: |
          cd applications/installsure/backend && npm run test -- --coverage || true
        continue-on-error: true

      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```
</details>

### 5. Add Snyk Configuration

**File:** `.snyk`

```yaml
version: v1.25.0
ignore: {}
language-settings:
  javascript:
    includeDevDependencies: false
```

**File:** `.github/workflows/snyk.yml`

<details>
<summary>Click to expand Snyk workflow</summary>

```yaml
name: Snyk Security Scan

on:
  push:
    branches:
      - main
      - master
      - develop
  pull_request:
    branches:
      - main
      - master
      - develop
  schedule:
    - cron: '0 0 * * 0'

jobs:
  snyk:
    name: Snyk Security Scan
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write
      
    strategy:
      matrix:
        app:
          - applications/installsure/backend
          - applications/installsure/frontend
          - applications/demo-dashboard
          - applications/ff4u
          - applications/redeye
          - applications/zerostack
          - applications/hello
          - applications/avatar

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: |
          cd ${{ matrix.app }}
          npm ci || npm install

      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        continue-on-error: true
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high --file=${{ matrix.app }}/package.json

      - name: Upload result to GitHub Code Scanning
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: snyk.sarif
```
</details>

### 6. Add DeepSource Configuration

**File:** `.deepsource.toml`

```toml
version = 1

[[analyzers]]
name = "javascript"
enabled = true

  [analyzers.meta]
  plugins = ["react"]
  environment = [
    "nodejs",
    "browser"
  ]
  style_guide = "airbnb"
  skip_doc_coverage = ["node_modules", "dist", "build", ".next"]

[[analyzers]]
name = "test-coverage"
enabled = true

[[transformers]]
name = "prettier"
enabled = true
```

---

## 🔐 Required Secrets

Add these secrets in **Settings → Secrets and variables → Actions**:

1. **`SONAR_TOKEN`** - Get from [SonarCloud.io](https://sonarcloud.io)
   - Create organization: `installsure`
   - Import repository
   - Generate token in My Account → Security

2. **`SNYK_TOKEN`** - Get from [Snyk.io](https://snyk.io)
   - Create account
   - Connect GitHub repository
   - Generate token in Account Settings → API Token

---

## ✅ Post-Implementation Checklist

- [ ] Enable GitHub Advanced Security in repository Settings → Code security and analysis
- [ ] Create SonarCloud organization and project
- [ ] Add `SONAR_TOKEN` secret
- [ ] Create Snyk account and connect repository
- [ ] Add `SNYK_TOKEN` secret
- [ ] Connect repository to [DeepSource.io](https://deepsource.io)
- [ ] Trigger first workflow runs
- [ ] Review and address initial findings
- [ ] Update repository README with tool badges

---

## 📊 Expected Benefits

### Security Improvements
- 🔍 **CodeQL**: Automated detection of 300+ security vulnerabilities
- 🛡️ **Snyk**: Real-time dependency vulnerability alerts
- 🔐 **Dependabot**: Automated security patches

### Code Quality
- 📈 **SonarCloud**: Code smell detection, technical debt tracking
- 🤖 **DeepSource**: Automated code review, anti-pattern detection
- ✨ **All Tools**: Consistent quality enforcement across 7 applications

### Developer Experience
- ⚡ Automated PR checks reduce review burden
- 📝 Clear actionable feedback on security/quality issues
- 🔄 Continuous improvement through trend analysis

---

## 📚 Additional Resources

- [SECURITY_TOOLS_PROPOSAL.md](./SECURITY_TOOLS_PROPOSAL.md) - Detailed implementation guide
- [.github/ISSUE_TEMPLATE/](./github/ISSUE_TEMPLATE/) - Tracking issue templates
  - Boot Scripts & Path Hardening
  - PDF/IFC Tagging Reliability Tests
  - Estimator Edge Cases
  - UE5 Pipeline Preflight Checks

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-05  
**Status:** Ready for Implementation

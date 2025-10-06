# Security & Quality Tools Configuration Proposal

## Executive Summary

As requested in the release engineering review, this document outlines the minimal configuration diffs required to implement CodeQL, SonarCloud, Snyk, DeepSource, and Dependabot for the External Review Repository.

**Current Status:** ❌ None of the requested security/quality tools are configured  
**Priority:** High  
**Effort:** Low to Medium (configuration only, no code changes required)

---

## Missing Configurations

### 1. CodeQL (GitHub Advanced Security)

**Status:** ❌ Not Configured  
**Purpose:** Static analysis for security vulnerabilities and code quality issues

#### Minimal Diff Required:

**File:** `.github/workflows/codeql.yml`

```yaml
name: "CodeQL"

on:
  push:
    branches: [ "main", "master", "develop" ]
  pull_request:
    branches: [ "main", "master", "develop" ]
  schedule:
    - cron: '0 0 * * 1'  # Weekly on Monday

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

**Benefits:**
- Automated security vulnerability detection
- Identifies code quality issues
- SARIF output integration with GitHub Security tab
- Supports JavaScript/TypeScript across all applications

---

### 2. Dependabot

**Status:** ❌ Not Configured  
**Purpose:** Automated dependency updates and security alerts

#### Minimal Diff Required:

**File:** `.github/dependabot.yml`

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
      - "area:ff4u"

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

**Benefits:**
- Automated security vulnerability alerts
- Weekly dependency update PRs
- Covers all 7 applications + GitHub Actions
- Limited PRs to prevent overwhelming the team

---

### 3. SonarCloud

**Status:** ❌ Not Configured  
**Purpose:** Continuous code quality and security analysis

#### Minimal Diff Required:

**File:** `sonar-project.properties`

```properties
sonar.projectKey=Installsure_External-Review-Repository
sonar.organization=installsure

# Sources
sonar.sources=applications
sonar.tests=applications

# Exclusions
sonar.exclusions=**/node_modules/**,**/dist/**,**/build/**,**/.next/**,**/coverage/**
sonar.test.inclusions=**/*.test.ts,**/*.test.tsx,**/*.test.js,**/*.test.jsx,**/*.spec.ts,**/*.spec.tsx

# Coverage
sonar.javascript.lcov.reportPaths=**/coverage/lcov.info
sonar.typescript.lcov.reportPaths=**/coverage/lcov.info

# Language
sonar.language=js,ts

# Quality Gates
sonar.qualitygate.wait=true
```

**File:** `.github/workflows/sonarcloud.yml`

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
          fetch-depth: 0  # Shallow clones should be disabled for better relevancy

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

**Benefits:**
- Code quality metrics and trends
- Security hotspot detection
- Code smell identification
- Technical debt tracking

---

### 4. Snyk

**Status:** ❌ Not Configured  
**Purpose:** Dependency vulnerability scanning and license compliance

#### Minimal Diff Required:

**File:** `.snyk`

```yaml
# Snyk (https://snyk.io) policy file, patches or ignores known vulnerabilities.
version: v1.25.0

# Optionally ignore specific vulnerabilities (example)
ignore: {}

# Language settings
language-settings:
  javascript:
    includeDevDependencies: false
```

**File:** `.github/workflows/snyk.yml`

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
    - cron: '0 0 * * 0'  # Weekly on Sunday

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

**Benefits:**
- Real-time vulnerability alerts
- License compliance checking
- Fix recommendations
- Container and IaC scanning support

---

### 5. DeepSource

**Status:** ❌ Not Configured  
**Purpose:** Automated code review for quality, security, and performance

#### Minimal Diff Required:

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

**Benefits:**
- Automated code review comments on PRs
- Performance anti-pattern detection
- React-specific analysis
- Auto-formatting with Prettier

---

## Implementation Checklist

- [ ] Enable GitHub Advanced Security in repository settings
- [ ] Add `.github/workflows/codeql.yml` for CodeQL analysis
- [ ] Add `.github/dependabot.yml` for dependency management
- [ ] Create SonarCloud organization and add `SONAR_TOKEN` secret
- [ ] Add `sonar-project.properties` configuration
- [ ] Add `.github/workflows/sonarcloud.yml` workflow
- [ ] Create Snyk account and add `SNYK_TOKEN` secret
- [ ] Add `.snyk` policy file
- [ ] Add `.github/workflows/snyk.yml` workflow
- [ ] Connect repository to DeepSource.io
- [ ] Add `.deepsource.toml` configuration
- [ ] Update `.gitignore` if needed for tool artifacts
- [ ] Document security tools in README.md

---

## Secrets Required

Add these secrets in GitHub repository settings:

1. `SONAR_TOKEN` - SonarCloud authentication token
2. `SNYK_TOKEN` - Snyk API token

---

## Estimated Timeline

- **Setup:** 2-4 hours
- **Initial scan resolution:** 1-2 days (addressing findings)
- **Ongoing maintenance:** 30 minutes/week

---

## Next Steps

1. Review and approve this configuration proposal
2. Create `.github` directory structure
3. Add configuration files as outlined above
4. Add required secrets to repository
5. Enable tools in their respective platforms
6. Monitor initial scans and address critical findings
7. Integrate tool badges into README.md

---

**Generated:** 2025-01-05  
**Author:** Release Engineering Team  
**Status:** Pending Approval

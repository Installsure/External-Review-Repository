# Security and Code Quality Tools Configuration

This document provides configuration instructions for security and code quality analysis tools.

## ✅ Configured Tools

### CodeQL (GitHub Native)
- **Status**: ✅ Configured
- **Location**: `.github/workflows/codeql.yml`
- **Languages**: JavaScript/TypeScript, Python
- **Schedule**: Weekly scans + PR analysis
- **Setup**: Automatic - no additional configuration needed

### Dependabot (GitHub Native)
- **Status**: ✅ Configured  
- **Location**: `.github/dependabot.yml`
- **Coverage**: npm packages, GitHub Actions
- **Schedule**: Weekly updates
- **Setup**: Automatic - no additional configuration needed

## ⚠️ External Tools Requiring Setup

The following tools require external service configuration and API tokens. Setup instructions are provided below.

### SonarCloud

**Purpose**: Code quality, security vulnerabilities, code smells, technical debt

**Setup Instructions**:
1. Visit https://sonarcloud.io/
2. Sign in with GitHub account
3. Add the `Installsure/External-Review-Repository` organization/repository
4. Generate a SonarCloud token
5. Add the token as a GitHub secret: `SONAR_TOKEN`
6. Create `.github/workflows/sonarcloud.yml`:

```yaml
name: SonarCloud
on:
  push:
    branches:
      - master
      - main
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  sonarcloud:
    name: SonarCloud
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

7. Create `sonar-project.properties` in repository root:

```properties
sonar.projectKey=Installsure_External-Review-Repository
sonar.organization=installsure

sonar.sources=.
sonar.exclusions=**/node_modules/**,**/dist/**,**/build/**,**/coverage/**

# JavaScript/TypeScript settings
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.typescript.lcov.reportPaths=coverage/lcov.info

# Python settings  
sonar.python.coverage.reportPaths=coverage.xml
```

**Key Metrics Tracked**:
- Security vulnerabilities
- Code smells
- Bugs
- Code coverage
- Duplications
- Technical debt

---

### Snyk

**Purpose**: Dependency vulnerability scanning, container security, IaC scanning

**Setup Instructions**:
1. Visit https://snyk.io/
2. Sign up and connect GitHub account
3. Import `Installsure/External-Review-Repository`
4. Generate a Snyk API token
5. Add the token as a GitHub secret: `SNYK_TOKEN`
6. Create `.github/workflows/snyk.yml`:

```yaml
name: Snyk Security
on:
  push:
    branches: [master, main]
  pull_request:
    branches: [master, main]
  schedule:
    - cron: '0 0 * * 0'

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
          
      - name: Upload result to GitHub Code Scanning
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: snyk.sarif
```

7. Optional: Create `.snyk` file for policy configuration:

```yaml
# Snyk (https://snyk.io) policy file
version: v1.25.0
ignore: {}
patch: {}
```

**Key Features**:
- Dependency vulnerability scanning
- License compliance
- Container image scanning
- Infrastructure as Code (IaC) scanning

---

### DeepSource

**Purpose**: Static analysis, code quality, performance issues, anti-patterns

**Setup Instructions**:
1. Visit https://deepsource.io/
2. Sign in with GitHub account
3. Activate repository: `Installsure/External-Review-Repository`
4. Create `.deepsource.toml` in repository root:

```toml
version = 1

[[analyzers]]
name = "javascript"
enabled = true

  [analyzers.meta]
  environment = [
    "nodejs",
    "browser"
  ]
  module_system = "es-modules"
  dialect = "typescript"

[[analyzers]]
name = "python"
enabled = true

  [analyzers.meta]
  runtime_version = "3.x.x"

[[analyzers]]
name = "docker"
enabled = true

[[analyzers]]
name = "secrets"
enabled = true

[[analyzers]]
name = "test-coverage"
enabled = true

[[transformers]]
name = "prettier"
enabled = true

[[transformers]]
name = "black"
enabled = true
```

**Key Metrics Tracked**:
- Anti-patterns
- Performance issues
- Security issues
- Code style
- Test coverage
- Documentation

---

## Configuration Summary

| Tool | Status | Auto-Setup | Requires Token | Coverage |
|------|--------|------------|----------------|----------|
| CodeQL | ✅ Configured | Yes | No | Security, code scanning |
| Dependabot | ✅ Configured | Yes | No | Dependency updates |
| SonarCloud | ⚠️ Needs Setup | No | Yes | Code quality, security |
| Snyk | ⚠️ Needs Setup | No | Yes | Vulnerabilities, licenses |
| DeepSource | ⚠️ Needs Setup | No | No | Static analysis, quality |

## Minimal Diffs for External Tools

If you wish to enable the external tools, here are the minimal configuration files needed:

### For SonarCloud:
**File**: `.github/workflows/sonarcloud.yml` (41 lines)  
**File**: `sonar-project.properties` (15 lines)  
**Secret**: `SONAR_TOKEN` (add via GitHub Settings → Secrets)

### For Snyk:
**File**: `.github/workflows/snyk.yml` (29 lines)  
**File**: `.snyk` (4 lines, optional)  
**Secret**: `SNYK_TOKEN` (add via GitHub Settings → Secrets)

### For DeepSource:
**File**: `.deepsource.toml` (47 lines)  
**Setup**: Enable repository at https://deepsource.io (no secrets needed)

---

## Recommended Priority

1. **Immediate**: CodeQL ✅ and Dependabot ✅ (already configured)
2. **High Priority**: SonarCloud (comprehensive code quality)
3. **High Priority**: Snyk (dependency security)
4. **Medium Priority**: DeepSource (additional static analysis)

## Next Steps

1. Review the configured CodeQL and Dependabot workflows
2. If external tools are desired, follow setup instructions above
3. Add necessary GitHub secrets for token-based tools
4. Monitor security alerts in GitHub Security tab
5. Review and triage findings from automated scans

---

**Last Updated**: 2025-10-05  
**Maintained By**: Release Engineering Team

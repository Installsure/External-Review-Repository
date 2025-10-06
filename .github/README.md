# GitHub Workflows and Issue Templates

This directory contains GitHub-specific configurations for the External Review Repository.

## 📂 Directory Structure

```
.github/
├── workflows/
│   └── codeql.yml                      # CodeQL security scanning
├── dependabot.yml                       # Dependabot configuration
├── ISSUE_TEMPLATES.md                   # Issue templates for tracking
├── SECURITY_CONFIGURATION_SUMMARY.md    # Security tools summary
├── create-tracking-issues.sh            # Script to create issues
└── README.md                            # This file
```

## ✅ Configured Security Tools

### 1. CodeQL (Active)
- **File**: `workflows/codeql.yml`
- **Status**: ✅ Active
- **Languages**: JavaScript/TypeScript, Python
- **Schedule**: Weekly scans + PR analysis
- **Setup**: Automatic - no configuration needed

### 2. Dependabot (Active)
- **File**: `dependabot.yml`
- **Status**: ✅ Active
- **Coverage**: All 7 applications + GitHub Actions
- **Schedule**: Weekly updates
- **Setup**: Automatic - no configuration needed

## 📋 Creating Tracking Issues

The repository requires 4 tracking issues with comprehensive checklists. There are two ways to create them:

### Option 1: Using the Automated Script (Recommended)

**Requirements**: GitHub CLI (`gh`) installed and authenticated

```bash
# Authenticate with GitHub (one-time setup)
gh auth login

# Run the issue creation script
./.github/create-tracking-issues.sh
```

This script will:
- Create required labels if they don't exist
- Create all 4 tracking issues with proper labels and checklists
- Assign labels: `pri:high`, `area:viewer`, `area:estimator`, `area:ue`

### Option 2: Manual Creation

If you prefer to create issues manually:

1. Go to: https://github.com/Installsure/External-Review-Repository/issues/new
2. Use templates from `ISSUE_TEMPLATES.md`
3. Copy the content for each issue
4. Add the appropriate labels

**Required Labels** (create these first if they don't exist):
- `pri:high` (color: #d73a4a) - High priority items
- `area:viewer` (color: #0075ca) - 3D viewer and visualization
- `area:estimator` (color: #0075ca) - Cost estimation engine
- `area:ue` (color: #0075ca) - Unreal Engine integration

**Issues to Create**:

1. **Boot Scripts & Path Hardening**
   - Labels: `pri:high`, `area:viewer`, `area:estimator`, `area:ue`
   - Template: See `ISSUE_TEMPLATES.md` → Issue #1

2. **PDF/IFC Tagging Reliability Tests**
   - Labels: `pri:high`, `area:viewer`, `area:estimator`
   - Template: See `ISSUE_TEMPLATES.md` → Issue #2

3. **Estimator Edge Cases**
   - Labels: `pri:high`, `area:estimator`
   - Template: See `ISSUE_TEMPLATES.md` → Issue #3

4. **UE5 Pipeline Preflight Checks**
   - Labels: `pri:high`, `area:ue`, `area:viewer`
   - Template: See `ISSUE_TEMPLATES.md` → Issue #4

## 🔧 Additional Security Tools

For optional security tools (SonarCloud, Snyk, DeepSource), see:
- **Setup Guide**: `../documentation/SECURITY_TOOLS_SETUP.md`
- **Summary**: `SECURITY_CONFIGURATION_SUMMARY.md`

## 📚 Documentation

- **ISSUE_TEMPLATES.md**: Complete issue templates with checklists
- **SECURITY_CONFIGURATION_SUMMARY.md**: Summary of all security tools
- **create-tracking-issues.sh**: Automated issue creation script

## 🚀 Quick Start

```bash
# 1. Ensure GitHub CLI is installed
gh --version

# 2. Authenticate (if not already)
gh auth login

# 3. Create all tracking issues
./.github/create-tracking-issues.sh

# 4. Verify issues were created
gh issue list --repo Installsure/External-Review-Repository --label pri:high
```

## ⚠️ Important Notes

1. **CodeQL and Dependabot are already configured** and will start working automatically
2. **Tracking issues** need to be created manually or via the script
3. **External tools** (SonarCloud, Snyk, DeepSource) require separate setup
4. **All configurations are non-breaking** and additive

## 🔍 Verifying Setup

### Check CodeQL Status
```bash
gh api repos/Installsure/External-Review-Repository/code-scanning/alerts
```

### Check Dependabot Status
```bash
gh api repos/Installsure/External-Review-Repository/dependabot/alerts
```

### List Created Issues
```bash
gh issue list --label pri:high
```

## 📞 Support

For questions about:
- **Security tools**: See `../documentation/SECURITY_TOOLS_SETUP.md`
- **Issue templates**: See `ISSUE_TEMPLATES.md`
- **GitHub workflows**: Check files in `workflows/` directory

---

**Last Updated**: 2025-10-05  
**Maintained By**: Release Engineering Team

---
name: Boot Scripts & Path Hardening
about: Tracking issue for boot script improvements and path hardening security
title: '[TRACKING] Boot Scripts & Path Hardening'
labels: ['pri:high', 'area:viewer', 'area:estimator', 'area:ue']
assignees: []
---

# Boot Scripts & Path Hardening - Tracking Issue

## Overview
This tracking issue covers improvements to boot scripts and implementation of path hardening security measures across all applications in the External Review Repository.

**Priority:** High  
**Areas:** Viewer, Estimator, UE Pipeline  
**Status:** 🔴 Not Started

---

## Context

The repository includes several boot scripts across applications:
- `/scripts/start-all.ps1` - Starts all 7 applications
- `/scripts/stop-all.ps1` - Stops all applications  
- `/scripts/test-all.ps1` - Runs tests for all applications
- `/tools/preflight-check.ps1` - Pre-launch validation
- Application-specific start scripts (e.g., `demo-dashboard/start-demo.sh`)

Current issues:
- ⚠️ Path hardening not implemented
- ⚠️ Limited input validation
- ⚠️ Potential path traversal vulnerabilities
- ⚠️ No cross-platform path normalization
- ⚠️ Environment variable injection risks

---

## Checklist

### Phase 1: Audit & Analysis
- [ ] Audit all PowerShell scripts for path usage
- [ ] Audit all Bash scripts for path usage
- [ ] Identify all file system operations
- [ ] Document current path handling patterns
- [ ] List all environment variables used in paths
- [ ] Identify potential injection points

### Phase 2: Path Hardening Implementation
- [ ] Implement path sanitization in `start-all.ps1`
  - [ ] Validate application directory paths
  - [ ] Normalize paths before use
  - [ ] Prevent path traversal attacks
- [ ] Implement path sanitization in `stop-all.ps1`
  - [ ] Validate process paths
  - [ ] Secure port lookup operations
- [ ] Implement path sanitization in `test-all.ps1`
  - [ ] Validate test directory paths
  - [ ] Secure test output paths
- [ ] Implement path hardening in `preflight-check.ps1`
  - [ ] Validate all checked paths
  - [ ] Secure file existence checks
  - [ ] Prevent directory traversal in checks
- [ ] Harden application-specific scripts
  - [ ] `demo-dashboard/start-demo.sh`
  - [ ] `demo-dashboard/start-demo.bat`

### Phase 3: Environment Variable Security
- [ ] Audit environment variable usage in scripts
- [ ] Implement environment variable validation
- [ ] Add sanitization for user-provided paths
- [ ] Document safe environment variable patterns
- [ ] Add warnings for insecure configurations

### Phase 4: Cross-Platform Compatibility
- [ ] Test path handling on Windows
- [ ] Test path handling on Linux
- [ ] Test path handling on macOS
- [ ] Implement cross-platform path normalization
- [ ] Add platform-specific path validation

### Phase 5: File Upload Path Security (InstallSure)
- [ ] Review file upload path handling in `backend/src/routes/files.ts`
- [ ] Validate IFC/DWG/RVT file paths
- [ ] Prevent directory traversal in file uploads
- [ ] Implement filename sanitization
- [ ] Add path length validation
- [ ] Test malicious filename scenarios

### Phase 6: Viewer Application Security
- [ ] Audit viewer file path handling
- [ ] Secure IFC file loading paths
- [ ] Validate model import paths
- [ ] Implement safe temporary file handling
- [ ] Add resource path validation

### Phase 7: Testing & Validation
- [ ] Create test cases for path traversal attempts
- [ ] Test with malicious filenames (e.g., `../../etc/passwd`)
- [ ] Test with long paths (>260 chars Windows, >4096 Linux)
- [ ] Test with special characters in paths
- [ ] Test with Unicode characters in paths
- [ ] Add automated security tests for path handling
- [ ] Document test scenarios and results

### Phase 8: Documentation
- [ ] Document path hardening guidelines
- [ ] Create security best practices guide
- [ ] Update CONTRIBUTING.md with path security rules
- [ ] Add inline documentation to scripts
- [ ] Document remediation steps for issues found

---

## Security Considerations

### Path Traversal Prevention
```powershell
# BAD - Vulnerable to path traversal
$filePath = Join-Path $baseDir $userInput

# GOOD - Sanitized and validated
$sanitizedInput = [System.IO.Path]::GetFileName($userInput)
$filePath = Join-Path $baseDir $sanitizedInput
if (-not (Test-Path $filePath -PathType Leaf -IsValid)) {
    throw "Invalid path"
}
```

### Environment Variable Injection Prevention
```powershell
# BAD - Vulnerable to injection
$path = "$env:BASE_DIR\$userInput"

# GOOD - Validated environment variable
if ([string]::IsNullOrWhiteSpace($env:BASE_DIR)) {
    throw "BASE_DIR not set"
}
$sanitizedBase = [System.IO.Path]::GetFullPath($env:BASE_DIR)
$sanitizedInput = [System.IO.Path]::GetFileName($userInput)
$path = Join-Path $sanitizedBase $sanitizedInput
```

---

## Files to Review

### PowerShell Scripts
- `/scripts/start-all.ps1`
- `/scripts/stop-all.ps1`
- `/scripts/test-all.ps1`
- `/tools/preflight-check.ps1`

### Bash Scripts
- `/applications/demo-dashboard/start-demo.sh`

### Batch Scripts
- `/applications/demo-dashboard/start-demo.bat`

### Backend File Handlers
- `/applications/installsure/backend/src/routes/files.ts`
- `/applications/installsure/backend/src/middleware/upload-optimization.ts`

---

## Success Criteria

- [ ] All scripts pass path security audit
- [ ] No path traversal vulnerabilities exist
- [ ] All file operations use validated paths
- [ ] Environment variables are properly sanitized
- [ ] Cross-platform compatibility maintained
- [ ] Security tests pass 100%
- [ ] Documentation complete and reviewed

---

## Resources

- [OWASP Path Traversal](https://owasp.org/www-community/attacks/Path_Traversal)
- [CWE-22: Path Traversal](https://cwe.mitre.org/data/definitions/22.html)
- [PowerShell Security Best Practices](https://docs.microsoft.com/en-us/powershell/scripting/learn/security)
- [Node.js Path Security](https://nodejs.org/api/path.html#path_path_normalize_path)

---

## Related Issues

- [ ] #TBD - Security Tools Configuration (CodeQL, Snyk)
- [ ] #TBD - PDF/IFC Tagging Reliability Tests
- [ ] #TBD - UE5 Pipeline Preflight Checks

---

**Last Updated:** 2025-01-05  
**Reporter:** Release Engineering Team  
**Assignee:** TBD

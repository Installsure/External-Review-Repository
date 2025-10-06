# Tracking Issues Templates

This file contains templates for creating tracking issues with appropriate labels and checklists.

---

## Issue #1: Boot Scripts & Path Hardening

**Title**: Boot Scripts & Path Hardening

**Labels**: `pri:high`, `area:viewer`, `area:estimator`, `area:ue`

**Description**:

### Overview
Implement comprehensive boot script hardening and path validation for production deployments.

### Checklist

#### Boot Scripts
- [ ] Audit `scripts/start-all.ps1` for hardcoded paths
- [ ] Audit `scripts/stop-all.ps1` for hardcoded paths
- [ ] Audit `scripts/test-all.ps1` for hardcoded paths
- [ ] Audit `tools/preflight-check.ps1` for hardcoded paths
- [ ] Add environment variable support for configurable paths
- [ ] Implement path validation before script execution
- [ ] Add error handling for missing directories
- [ ] Document required directory structure

#### Path Hardening
- [ ] Review all absolute path references in PowerShell scripts
- [ ] Convert hardcoded paths to use `$PSScriptRoot` or env vars
- [ ] Validate all file paths before access
- [ ] Implement proper path escaping for special characters
- [ ] Add cross-platform path compatibility (Windows/Linux)
- [ ] Test scripts with non-standard installation paths
- [ ] Update documentation with path requirements

#### Applications Affected
- [ ] InstallSure (frontend & backend)
- [ ] Demo Dashboard
- [ ] FF4U
- [ ] RedEye
- [ ] ZeroStack
- [ ] Hello
- [ ] Avatar

#### Testing
- [ ] Test boot scripts on clean installation
- [ ] Test with custom installation directories
- [ ] Test with spaces in paths
- [ ] Test with special characters in paths
- [ ] Verify error messages are helpful
- [ ] Document test scenarios

#### Documentation
- [ ] Update SETUP_GUIDE.md with path requirements
- [ ] Update TROUBLESHOOTING.md with path issues
- [ ] Add examples of custom path configurations
- [ ] Document environment variables

### Acceptance Criteria
- All boot scripts use relative or configurable paths
- Scripts fail gracefully with clear error messages
- Documentation includes path hardening best practices
- All tests pass with non-standard paths

### References
- `scripts/start-all.ps1`
- `scripts/stop-all.ps1`
- `scripts/test-all.ps1`
- `tools/preflight-check.ps1`

---

## Issue #2: PDF/IFC Tagging Reliability Tests

**Title**: PDF/IFC Tagging Reliability Tests

**Labels**: `pri:high`, `area:viewer`, `area:estimator`

**Description**:

### Overview
Implement comprehensive testing for PDF and IFC file tagging, parsing, and metadata extraction to ensure reliability across different file formats and edge cases.

### Checklist

#### Test Infrastructure
- [ ] Create test fixtures directory for sample PDFs
- [ ] Create test fixtures directory for sample IFC files
- [ ] Set up automated test suite for file processing
- [ ] Implement test data generator for edge cases
- [ ] Add performance benchmarking tests
- [ ] Configure CI/CD pipeline for file processing tests

#### PDF Tagging Tests
- [ ] Test PDF metadata extraction (title, author, dates)
- [ ] Test PDF text extraction accuracy
- [ ] Test PDF image extraction
- [ ] Test encrypted PDF handling
- [ ] Test corrupted PDF detection and error handling
- [ ] Test large PDF files (>100MB)
- [ ] Test PDF/A compliance validation
- [ ] Test embedded form data extraction
- [ ] Test annotation preservation
- [ ] Test multi-language PDF support

#### IFC Tagging Tests
- [ ] Test IFC metadata parsing (schema version, project info)
- [ ] Test IFC entity extraction (walls, floors, spaces)
- [ ] Test IFC property sets extraction
- [ ] Test IFC relationships parsing
- [ ] Test IFC coordinate system handling
- [ ] Test large IFC files (>500MB)
- [ ] Test IFC 2x3 and IFC 4 compatibility
- [ ] Test corrupted IFC detection
- [ ] Test missing required fields handling
- [ ] Test custom property sets

#### Integration Tests
- [ ] Test PDF to viewer pipeline
- [ ] Test IFC to viewer pipeline
- [ ] Test IFC to Datasmith conversion
- [ ] Test concurrent file processing
- [ ] Test file upload size limits
- [ ] Test file type validation
- [ ] Test storage and retrieval
- [ ] Test cleanup of temporary files

#### Edge Cases
- [ ] Zero-byte files
- [ ] Files with wrong extensions
- [ ] Files with special characters in names
- [ ] Files in non-UTF8 encodings
- [ ] Files with circular references (IFC)
- [ ] Files with invalid schema
- [ ] Files exceeding memory limits
- [ ] Network interruptions during upload

#### Performance Tests
- [ ] Measure parse time for various file sizes
- [ ] Measure memory usage during processing
- [ ] Test parallel processing capability
- [ ] Establish performance baselines
- [ ] Implement performance regression tests

#### Documentation
- [ ] Document supported file formats
- [ ] Document file size limitations
- [ ] Document tag schema and structure
- [ ] Document error codes and messages
- [ ] Create troubleshooting guide for file issues
- [ ] Add examples of valid/invalid files

### Acceptance Criteria
- 95%+ success rate for valid PDF/IFC files
- Graceful error handling for invalid files
- Clear error messages for users
- Performance meets defined SLAs
- All edge cases documented and tested

### References
- `applications/installsure/frontend/src/pages/Viewer.tsx`
- `applications/installsure/frontend/src/pages/Upload.tsx`
- File processing backend endpoints

---

## Issue #3: Estimator Edge Cases

**Title**: Estimator Edge Cases

**Labels**: `pri:high`, `area:estimator`

**Description**:

### Overview
Identify and handle edge cases in the cost estimation engine to improve accuracy and reliability.

### Checklist

#### Input Validation
- [ ] Test with zero quantities
- [ ] Test with negative numbers
- [ ] Test with extremely large numbers (>1 billion)
- [ ] Test with decimal precision edge cases
- [ ] Test with null/undefined values
- [ ] Test with empty strings
- [ ] Test with special characters in descriptions
- [ ] Test with unicode characters
- [ ] Test with SQL injection attempts
- [ ] Test with XSS payloads

#### Calculation Edge Cases
- [ ] Division by zero handling
- [ ] Floating point precision errors
- [ ] Rounding errors in summations
- [ ] Overflow/underflow detection
- [ ] Currency conversion edge cases
- [ ] Tax calculation edge cases
- [ ] Discount calculation edge cases
- [ ] Percentage calculations at boundaries (0%, 100%, >100%)
- [ ] Compound calculations accuracy
- [ ] Multi-currency arithmetic

#### Data Integrity
- [ ] Test with missing required fields
- [ ] Test with duplicate entries
- [ ] Test with circular dependencies
- [ ] Test with orphaned references
- [ ] Test with stale data
- [ ] Test with concurrent updates
- [ ] Test with transaction rollbacks
- [ ] Test database constraint violations

#### Business Logic Edge Cases
- [ ] Zero-cost items
- [ ] Free items with tax
- [ ] Bundled items pricing
- [ ] Volume discounts at boundaries
- [ ] Minimum order quantities
- [ ] Maximum order limits
- [ ] Seasonal pricing changes
- [ ] Expired pricing data
- [ ] Regional pricing variations

#### Performance Edge Cases
- [ ] Estimates with 10,000+ line items
- [ ] Complex calculation chains
- [ ] Recursive calculations
- [ ] Memory usage with large datasets
- [ ] Database query performance
- [ ] Concurrent estimation requests
- [ ] Cache invalidation scenarios

#### Error Handling
- [ ] Implement comprehensive error messages
- [ ] Log all calculation errors
- [ ] Provide fallback calculations
- [ ] Add validation warnings
- [ ] Implement data sanitation
- [ ] Add audit trail for corrections

#### Testing
- [ ] Unit tests for each edge case
- [ ] Integration tests for calculation flows
- [ ] Property-based testing for calculations
- [ ] Fuzzing tests for input validation
- [ ] Load tests for concurrent usage
- [ ] Regression tests for known bugs

#### Documentation
- [ ] Document all edge cases
- [ ] Document validation rules
- [ ] Document calculation formulas
- [ ] Document error codes
- [ ] Create troubleshooting guide
- [ ] Add examples of edge case handling

### Acceptance Criteria
- All identified edge cases have tests
- Error messages are clear and actionable
- No silent failures or incorrect calculations
- Performance acceptable under load
- Documentation complete and accurate

### References
- Estimator calculation engine
- Cost breakdown components
- Database schema for estimates

---

## Issue #4: UE5 Pipeline Preflight Checks

**Title**: UE5 Pipeline Preflight Checks (UE Path, IFC/Datasmith Availability)

**Labels**: `pri:high`, `area:ue`, `area:viewer`

**Description**:

### Overview
Implement comprehensive preflight checks for Unreal Engine 5 pipeline integration, ensuring UE5 installation, IFC support, and Datasmith availability before attempting pipeline operations.

### Checklist

#### UE5 Installation Detection
- [ ] Detect UE5 installation on Windows
- [ ] Detect UE5 installation on Linux
- [ ] Verify UE5 version compatibility (minimum 5.0)
- [ ] Check UE5 Editor executable accessibility
- [ ] Validate UE5 project settings
- [ ] Verify UE5 command-line tools availability
- [ ] Check UE5 plugin directory structure
- [ ] Validate UE5 licensing status

#### UE5 Path Configuration
- [ ] Implement UE5 path auto-detection
- [ ] Support custom UE5 installation paths
- [ ] Validate UE5_PATH environment variable
- [ ] Add UE5 path to configuration file
- [ ] Test with multiple UE5 versions installed
- [ ] Handle UE5 path with spaces and special chars
- [ ] Provide clear error for missing UE5
- [ ] Document UE5 installation requirements

#### Datasmith Plugin Verification
- [ ] Check Datasmith plugin installation
- [ ] Verify Datasmith plugin version
- [ ] Test Datasmith plugin activation
- [ ] Validate Datasmith SDK availability
- [ ] Check Datasmith exporter tools
- [ ] Verify Datasmith runtime dependencies
- [ ] Test Datasmith licensing
- [ ] Document Datasmith setup requirements

#### IFC Support Verification
- [ ] Check IFC import plugin availability
- [ ] Verify IFC plugin version compatibility
- [ ] Test IFC file format support (2x3, 4)
- [ ] Validate IFC parsing libraries
- [ ] Check IFC schema definitions
- [ ] Verify IFC coordinate system support
- [ ] Test IFC metadata extraction
- [ ] Document IFC requirements

#### Pipeline Preflight Script
- [ ] Create PowerShell preflight check script
- [ ] Create bash preflight check script
- [ ] Implement system requirements check
- [ ] Check available disk space for conversion
- [ ] Verify network connectivity (if needed)
- [ ] Check memory requirements
- [ ] Validate GPU requirements
- [ ] Test all checks in isolation

#### Integration with Existing Tools
- [ ] Integrate with `tools/preflight-check.ps1`
- [ ] Add UE5 checks to startup scripts
- [ ] Update `scripts/start-all.ps1` with UE5 validation
- [ ] Add UE5 status to health check endpoint
- [ ] Display UE5 status in Settings UI
- [ ] Add UE5 configuration to `.env.sample`

#### Error Handling
- [ ] Clear error messages for missing UE5
- [ ] Helpful error for wrong UE5 version
- [ ] Guidance for Datasmith installation
- [ ] Guidance for IFC plugin installation
- [ ] Fallback for unavailable features
- [ ] Graceful degradation without UE5
- [ ] Log all preflight check results

#### Testing
- [ ] Test with UE5 installed
- [ ] Test without UE5 installed
- [ ] Test with incomplete UE5 installation
- [ ] Test with multiple UE5 versions
- [ ] Test Datasmith with/without license
- [ ] Test IFC plugin activation
- [ ] Test on Windows and Linux
- [ ] Test with custom UE5 paths

#### Documentation
- [ ] Document UE5 installation steps
- [ ] Document Datasmith setup process
- [ ] Document IFC plugin installation
- [ ] Document environment variables
- [ ] Add UE5 section to SETUP_GUIDE.md
- [ ] Add UE5 troubleshooting to TROUBLESHOOTING.md
- [ ] Create UE5_INTEGRATION.md guide
- [ ] Document minimum system requirements

#### CI/CD Integration
- [ ] Add UE5 checks to CI pipeline
- [ ] Mock UE5 environment for testing
- [ ] Add UE5 availability indicators
- [ ] Test pipeline with/without UE5

### Acceptance Criteria
- Preflight checks detect UE5 availability accurately
- Clear error messages guide users to resolution
- Pipeline gracefully handles missing dependencies
- All checks are automated and reliable
- Documentation is comprehensive and clear
- Tests cover all scenarios

### References
- `tools/preflight-check.ps1`
- `scripts/start-all.ps1`
- `documentation/SETUP_GUIDE.md`
- UE5 integration endpoints

---

## How to Create These Issues

1. Go to: https://github.com/Installsure/External-Review-Repository/issues/new
2. Copy the content from each issue template above
3. Create each issue with the specified labels:
   - `pri:high`
   - `area:viewer` (for issues #1, #2, #4)
   - `area:estimator` (for issues #1, #2, #3)
   - `area:ue` (for issues #1, #4)

## Labels to Create

If these labels don't exist, create them first:

- **pri:high** (color: #d73a4a) - High priority items
- **area:viewer** (color: #0075ca) - 3D viewer and visualization
- **area:estimator** (color: #0075ca) - Cost estimation engine
- **area:ue** (color: #0075ca) - Unreal Engine integration

---

**Note**: These tracking issues provide comprehensive checklists for critical infrastructure improvements. Each issue can be worked on independently while contributing to overall system reliability and security.

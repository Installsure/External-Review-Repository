# GitHub Actions Workflows

This directory contains GitHub Actions workflows for the External Review Repository.

## Workflows

### E2E Tests (`e2e-tests.yml`)

Comprehensive end-to-end testing workflow that runs deep dive E2E tests on all applications.

**Trigger Events:**
- Push to `main`, `master`, or `develop` branches
- Pull requests to `main`, `master`, or `develop` branches
- Manual workflow dispatch

**What it does:**
- Runs E2E tests for all 7 applications in parallel
- Each application runs in an isolated job with its own environment
- Automatically installs dependencies and Playwright browsers
- Starts application servers and waits for them to be ready
- Executes Playwright E2E tests
- Captures screenshots and traces on failure
- Uploads test results as artifacts
- Provides a summary of all test results

**Jobs:**

1. **e2e-installsure** (30 min timeout)
   - Tests the InstallSure application (frontend + backend)
   - Includes Python backend setup
   - Runs on port 3000

2. **e2e-demo-dashboard** (20 min timeout)
   - Tests the Demo Dashboard application
   - Runs on port 3001

3. **e2e-ff4u** (20 min timeout)
   - Tests the FF4U application
   - Runs on port 3002

4. **e2e-redeye** (20 min timeout)
   - Tests the RedEye application
   - Runs on port 3003

5. **e2e-zerostack** (20 min timeout)
   - Tests the ZeroStack application
   - Runs on port 3004

6. **e2e-hello** (20 min timeout)
   - Tests the Hello application
   - Runs on port 3005

7. **e2e-avatar** (20 min timeout)
   - Tests the Avatar application
   - Runs on port 3006

8. **e2e-summary** (always runs)
   - Aggregates results from all application tests
   - Creates a summary table in the GitHub Actions summary
   - Shows pass/fail status for each application

**Artifacts:**

Each job uploads test results to GitHub:
- `<app-name>-e2e-results`
  - HTML test report
  - Screenshots of failures
  - Trace files for debugging
  - Test results JSON

Artifacts are retained for 30 days.

**Viewing Results:**

1. Go to the **Actions** tab in GitHub
2. Click on the workflow run
3. View the summary for overall pass/fail status
4. Click on individual jobs to see detailed logs
5. Download artifacts to view HTML reports and screenshots

**Manual Trigger:**

You can manually trigger the workflow:
1. Go to **Actions** tab
2. Select **Deep Dive E2E Tests** workflow
3. Click **Run workflow**
4. Select the branch to run on
5. Click **Run workflow**

## Running Workflows Locally

You can simulate the workflow locally using the `act` tool:

```bash
# Install act (GitHub Actions local runner)
# macOS: brew install act
# Windows: choco install act-cli
# Linux: see https://github.com/nektos/act

# Run a specific job
act -j e2e-demo-dashboard

# Run all jobs
act
```

Note: Local execution may have differences from GitHub-hosted runners.

## Workflow Best Practices

1. **Timeouts**: Each job has a timeout to prevent hanging
2. **Parallel Execution**: Jobs run in parallel for faster feedback
3. **Artifact Upload**: Always uploads results, even on failure
4. **Caching**: Uses npm caching to speed up dependency installation
5. **Error Handling**: Continues running tests even if one fails (using `|| echo`)

## Troubleshooting Workflow Failures

### Job Timeout
- Check if the application is starting correctly
- Increase timeout in the workflow file
- Review logs for hanging processes

### Dependency Installation Fails
- Check `package-lock.json` exists
- Verify Node.js version compatibility
- Review npm error logs in the job output

### Tests Fail in CI But Pass Locally
- Check environment-specific issues
- Review uploaded artifacts for screenshots and traces
- Verify timing and race conditions

### Server Won't Start
- Check port conflicts
- Verify all dependencies are installed
- Review application logs in the job output

## Adding New Workflows

To add a new workflow:

1. Create a new `.yml` file in `.github/workflows/`
2. Define the workflow structure:
   ```yaml
   name: Workflow Name
   on: [push, pull_request]
   jobs:
     job-name:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         # Add your steps
   ```
3. Test locally with `act` if possible
4. Commit and push to trigger the workflow

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Playwright in CI](https://playwright.dev/docs/ci)
- [Repository E2E Testing Guide](../documentation/E2E_TESTING_GUIDE.md)

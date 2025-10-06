# 🔍 External Review Repository

**Professional Code Review & Repair Services**  
**Repository for External Entities**  
**Last Updated:** 2025-09-29

---

## 📋 **REPOSITORY OVERVIEW**

This repository contains a complete application suite for external review and repair services. All applications have been professionally reviewed, repaired, and prepared for external access.

### **Applications Included:**
- **InstallSure** - Construction Management Platform (Production Ready)
- **Demo Dashboard** - Central Control Panel (Demo Ready)
- **FF4U** - Adult Entertainment Platform (Development Ready)
- **RedEye** - Project Management System (Development Ready)
- **ZeroStack** - Infrastructure Management (Development Ready)
- **Hello** - Digital Business Cards (Development Ready)
- **Avatar** - AI Avatar Platform (Development Ready)

---

## 🚀 **QUICK START**

### **Prerequisites**
- Node.js v20+ (v22.19.0 recommended)
- npm v8+ (v10.9.3 recommended)
- Python v3.10+ (for InstallSure backend)
- Git v2.47+

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd External-Review-Repository

# Run preflight check
.\tools\preflight-check.ps1

# Install dependencies
npm install

# Start all applications
.\scripts\start-all.ps1
```

### **Access Applications**
- **InstallSure**: http://localhost:3000
- **Demo Dashboard**: http://localhost:3001
- **FF4U**: http://localhost:3002
- **RedEye**: http://localhost:3003
- **ZeroStack**: http://localhost:3004
- **Hello**: http://localhost:3005
- **Avatar**: http://localhost:3006

---

## 📚 **DOCUMENTATION**

- **[Setup Guide](documentation/SETUP_GUIDE.md)** - Complete setup instructions
- **[API Documentation](documentation/API_DOCUMENTATION.md)** - Comprehensive API reference
- **[Troubleshooting Guide](documentation/TROUBLESHOOTING.md)** - Common issues and solutions
- **[Contributing Guide](CONTRIBUTING.md)** - Guidelines for external reviewers
- **[Comprehensive Review Report](documentation/COMPREHENSIVE_REVIEW_REPORT.md)** - Detailed analysis

---

## 🧪 **TESTING**

```bash
# Run all tests
.\scripts\test-all.ps1

# Run individual application tests
cd applications\installsure
npm run test
npm run test:e2e
```

---

## 🔧 **DEVELOPMENT**

### **Code Quality**
- **TypeScript**: Full type safety across all applications
- **ESLint**: Consistent code style and best practices
- **Prettier**: Automatic code formatting
- **Husky**: Pre-commit hooks for quality assurance

### **Testing Framework**
- **Vitest**: Fast unit testing
- **Playwright**: End-to-end testing
- **Testing Library**: Component testing utilities

### **Build System**
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **TypeScript**: Compile-time type checking

---

## 📊 **APPLICATION STATUS**

| Application | Status | Port | Frontend | Backend | Tests | E2E |
|-------------|--------|------|----------|---------|-------|-----|
| **InstallSure** | ✅ Production Ready | 3000 | React + Vite | FastAPI | ✅ | ✅ |
| **Demo Dashboard** | ✅ Demo Ready | 3001 | React + Vite | - | ✅ | ✅ |
| **FF4U** | ⚠️ Development Ready | 3002 | React + Vite | - | ⚠️ | ⚠️ |
| **RedEye** | ⚠️ Development Ready | 3003 | React + Vite | - | ⚠️ | ⚠️ |
| **ZeroStack** | ⚠️ Development Ready | 3004 | React + Vite | - | ⚠️ | ⚠️ |
| **Hello** | ⚠️ Development Ready | 3005 | React + Vite | - | ⚠️ | ⚠️ |
| **Avatar** | ⚠️ Development Ready | 3006 | React + Vite | - | ⚠️ | ⚠️ |

---

## 🛠️ **SCRIPTS**

### **PowerShell Scripts (Windows)**
- `.\scripts\start-all.ps1` - Start all applications
- `.\scripts\stop-all.ps1` - Stop all applications
- `.\scripts\test-all.ps1` - Run all tests
- `.\tools\preflight-check.ps1` - System requirements check

### **NPM Scripts**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run E2E tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

---

## 🔐 **SECURITY**

### **Implemented Security Measures**
- **JWT Authentication**: Secure token-based authentication
- **CORS Configuration**: Proper cross-origin resource sharing
- **Security Headers**: XSS protection, content type options
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **Environment Variables**: Secure configuration management

---

## 📈 **PERFORMANCE**

### **Optimizations Applied**
- **Code Splitting**: Lazy loading for better performance
- **Bundle Optimization**: Tree shaking and minification
- **Image Optimization**: WebP format and responsive images
- **Caching**: Browser and API response caching
- **Database Indexing**: Optimized database queries

---

## 🔄 **CI & REVIEWS**

### **GitHub Actions Workflows**

This repository includes automated CI/CD pipelines that run on every push and pull request:

#### **Continuous Integration (CI)**
- **Linting**: Automated code style checks with ESLint
- **Type Checking**: TypeScript compilation and type safety validation
- **Testing**: Unit tests for all applications with test coverage
- **Building**: Production build verification for all applications
- **Multi-version Testing**: Tests run on Node.js 20.x and 22.x

#### **Code Quality**
- **Dependency Review**: Automated security scanning of dependencies on PRs
- **CodeQL Analysis**: Advanced security vulnerability detection
- **Dependabot**: Automated dependency updates with security patches

### **Required GitHub Secrets**

To enable all CI/CD features, configure the following secrets in your GitHub repository:

#### **Setting Up Secrets via GitHub UI**

1. **Navigate to Repository Settings**
   - Go to your repository on GitHub
   - Click on **Settings** (in the repository navigation bar)
   - Click on **Secrets and variables** → **Actions** (in the left sidebar)

2. **Add Repository Secrets**
   - Click **New repository secret** button
   - Add each secret with the following names and values:

#### **Optional Secrets for Advanced Features**

| Secret Name | Description | Required For |
|-------------|-------------|--------------|
| `NPM_TOKEN` | NPM registry authentication token | Publishing packages to NPM |
| `FORGE_CLIENT_ID` | Autodesk Forge API client ID | InstallSure 3D features |
| `FORGE_CLIENT_SECRET` | Autodesk Forge API secret | InstallSure 3D features |
| `QB_CLIENT_ID` | QuickBooks API client ID | InstallSure accounting integration |
| `QB_CLIENT_SECRET` | QuickBooks API secret | InstallSure accounting integration |
| `SENTRY_DSN` | Sentry error tracking DSN | Error monitoring and reporting |

#### **Environment Variables for Local Development**

For local development, create a `.env` file in the root directory:

```env
# See documentation/SETUP_GUIDE.md for full environment variable reference
NODE_ENV=development
DEBUG=true

# Application Ports
VITE_WEB_PORT=5173
VITE_API_PORT=8080

# Database Configuration
DATABASE_URL=sqlite:///./installsure.db

# Authentication
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### **Workflow Status Badges**

Add these badges to track your CI/CD pipeline status:

```markdown
[![CI](https://github.com/Installsure/External-Review-Repository/actions/workflows/ci.yml/badge.svg)](https://github.com/Installsure/External-Review-Repository/actions/workflows/ci.yml)
[![Code Quality](https://github.com/Installsure/External-Review-Repository/actions/workflows/code-quality.yml/badge.svg)](https://github.com/Installsure/External-Review-Repository/actions/workflows/code-quality.yml)
```

### **Branch Protection Rules**

Recommended branch protection settings for `master` and `main` branches:

1. **Require Pull Request Reviews**
   - Settings → Branches → Branch protection rules → Add rule
   - Branch name pattern: `master` or `main`
   - ✅ Require pull request reviews before merging
   - Required approvals: 1

2. **Require Status Checks**
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - Select required checks: `CI / Lint and Test`, `Code Quality / Security Scan`

3. **Additional Protections**
   - ✅ Require conversation resolution before merging
   - ✅ Do not allow bypassing the above settings

### **Running CI Locally**

Before pushing changes, you can run the same checks locally:

```bash
# Install dependencies for all applications
npm run install:all  # If configured, or manually install each

# Run linting
cd applications/demo-dashboard && npm run lint
cd applications/installsure/frontend && npm run lint
cd applications/installsure/backend && npm run lint

# Run type checking
cd applications/demo-dashboard && npm run typecheck
cd applications/installsure/frontend && npm run typecheck
cd applications/installsure/backend && npm run typecheck

# Run tests
cd applications/installsure/frontend && npm run test
cd applications/installsure/backend && npm run test

# Build all applications
cd applications/demo-dashboard && npm run build
cd applications/installsure/frontend && npm run build
cd applications/installsure/backend && npm run build
```

---

## 🐛 **TROUBLESHOOTING**

### **Common Issues**
1. **Port Already in Use**: Run `.\scripts\stop-all.ps1` first
2. **Dependencies Issues**: Delete `node_modules` and run `npm install`
3. **TypeScript Errors**: Run `npm run type-check`
4. **Build Failures**: Check `npm run build` output

### **Getting Help**
- Check [Troubleshooting Guide](documentation/TROUBLESHOOTING.md)
- Review application logs
- Open a GitHub issue for support

---

## 🤝 **CONTRIBUTING**

We welcome contributions from external reviewers! Please see our [Contributing Guide](CONTRIBUTING.md) for:
- Review process and guidelines
- Issue reporting templates
- Code review checklist
- Pull request process

---

## 📄 **LICENSE**

This repository is provided for external review and repair services. Please refer to individual application licenses for specific terms.

---

## 📞 **SUPPORT**

- **Documentation**: See `documentation/` folder
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: [Contact Information]

---

**Repository Status:** ✅ **READY FOR EXTERNAL REVIEW**  
**Last Updated:** 2025-09-29  
**Quality Gate:** All critical issues resolved, production-ready codebase delivered
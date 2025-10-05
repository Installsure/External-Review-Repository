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
- Git v2.47+

### **5-Minute Demo - InstallSure**

Get InstallSure running in under 5 minutes with the automated smoke test:

#### **Windows (PowerShell)**
```powershell
# From repository root
powershell -ExecutionPolicy Bypass -File scripts\smoke.ps1
```

#### **macOS/Linux/WSL**
```bash
# From repository root
bash scripts/smoke.sh
```

The smoke script will:
1. ✅ Install all dependencies (backend, frontend, tests)
2. ✅ Start the backend API on port 8099
3. ✅ Start the frontend dev server on port 3000
4. ✅ Wait for services to be ready
5. ✅ Install Playwright browsers
6. ✅ Run E2E tests
7. ✅ Run backend unit tests
8. ✅ Display test summary and exit

**Manual Setup (if needed):**

```bash
# Backend
cd applications/installsure/backend
npm install
npm run dev  # Starts on http://127.0.0.1:8099

# Frontend (new terminal)
cd applications/installsure/frontend
npm install
npm run dev  # Starts on http://127.0.0.1:3000

# E2E Tests (new terminal)
cd tests
npm install
npx playwright install --with-deps
npx playwright test
```

### **Verify Installation**

1. **Backend Health Check:**
   ```bash
   curl http://127.0.0.1:8099/api/health
   # Should return: {"ok":true,"uptime":...}
   ```

2. **Frontend Access:**
   - Open http://127.0.0.1:3000 in your browser
   - You should see the InstallSure dashboard

3. **API Test:**
   ```bash
   curl http://127.0.0.1:8099/api/projects
   # Should return: {"success":true,"data":[...],"count":2}
   ```

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

## 🔧 **TROUBLESHOOTING**

### **Common Issues**

#### **1. Backend fails to start**
```bash
# Issue: "EADDRINUSE: address already in use :::8099"
# Solution: Kill process on port 8099
lsof -ti:8099 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :8099  # Windows (then use taskkill /PID <pid> /F)
```

#### **2. Frontend build errors**
```bash
# Issue: "Cannot find type definition file for 'node'"
# Solution: Install missing type definitions
cd applications/installsure/frontend
npm install --save-dev @types/node
```

#### **3. esbuild platform mismatch**
```bash
# Issue: "You installed esbuild for another platform"
# Solution: Reinstall dependencies on the correct platform
cd applications/installsure/backend
rm -rf node_modules package-lock.json
npm install
```

#### **4. Playwright browser download fails**
```bash
# Issue: Timeout or network error during browser download
# Solution: Install with system dependencies
cd tests
npx playwright install --with-deps chromium
```

#### **5. Permission denied errors (Unix/macOS)**
```bash
# Solution: Make scripts executable
chmod +x scripts/*.sh
chmod +x applications/*/node_modules/.bin/*
```

### **Environment Variables**

**Backend (.env):**
```env
PORT=8099
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
AUTH_SECRET=dev-secret-change-me-minimum-32-characters-required-for-security
```

**Frontend (.env.local):**
```env
VITE_APP_NAME=InstallSure
VITE_API_BASE=http://127.0.0.1:8099
```

### **Logs and Debugging**

```bash
# Backend logs (when run with smoke script)
tail -f /tmp/installsure-backend.log

# Frontend logs
tail -f /tmp/installsure-frontend.log

# Check health endpoint
curl http://127.0.0.1:8099/api/health

# Test specific API endpoints
curl http://127.0.0.1:8099/api/projects
curl http://127.0.0.1:8099/api/rfis
```

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
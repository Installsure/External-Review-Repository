# 🚀 Setup Guide for External Review Repository

**Professional Development Environment Setup**  
**Last Updated:** 2025-09-29

---

## 📋 **PREREQUISITES**

### **System Requirements**
- **OS:** Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **RAM:** 8GB minimum, 16GB recommended
- **Storage:** 10GB free space
- **Network:** Internet connection for dependencies

### **Required Software**
- **Node.js:** v20+ (v22.19.0 recommended)
- **npm:** v8+ (v10.9.3 recommended)
- **Python:** v3.10+ (v3.13.7 recommended)
- **Git:** v2.47+
- **Docker:** v20+ (optional, for containerization)

### **Optional Development Tools**
- **GitHub Copilot CLI:** AI-powered command line assistant (recommended for external reviewers)
  ```bash
  npm install -g @github/copilot
  ```
  After installation, authenticate with:
  ```bash
  github-copilot auth
  ```

---

## 🔧 **INSTALLATION STEPS**

### **Step 1: Clone Repository**
```bash
git clone <repository-url>
cd External-Review-Repository
```

### **Step 2: Run Preflight Check**
```powershell
# Windows
.\tools\preflight-check.ps1

# macOS/Linux
chmod +x tools/preflight-check.sh
./tools/preflight-check.sh
```

### **Step 3: Install Dependencies**
```bash
# Install root dependencies
npm install

# Install application dependencies
npm run install:all
```

### **Step 4: Environment Setup**
```bash
# Copy environment template
cp .env.sample .env

# Edit environment variables
# (See Environment Variables section below)
```

### **Step 5: Database Setup (InstallSure)**
```bash
# Navigate to InstallSure backend
cd applications/installsure/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python -m alembic upgrade head
```

---

## 🌐 **ENVIRONMENT VARIABLES**

### **Create `.env` file in root directory:**
```env
# Application Ports
VITE_WEB_PORT=5173
VITE_API_PORT=8080

# Database Configuration
DATABASE_URL=sqlite:///./installsure.db
# For PostgreSQL: postgresql://user:password@localhost:5432/installsure

# Authentication
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# File Storage
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# External APIs (optional)
OPENAI_API_KEY=your-openai-key
STRIPE_SECRET_KEY=your-stripe-key

# Development
NODE_ENV=development
DEBUG=true
```

---

## 🚀 **STARTING APPLICATIONS**

### **Option 1: Start All Applications**
```bash
# Windows
.\scripts\start-all.ps1

# macOS/Linux
./scripts/start-all.sh
```

### **Option 2: Start Individual Applications**
```bash
# InstallSure (Production Ready)
cd applications/installsure
npm run dev

# Demo Dashboard
cd applications/demo-dashboard
npm run dev

# Development Apps
cd applications/ff4u
npm run dev

cd applications/redeye
npm run dev

cd applications/zerostack
npm run dev

cd applications/hello
npm run dev

cd applications/avatar
npm run dev
```

### **Option 3: Docker Compose**
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 🧪 **TESTING**

### **Run All Tests**
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# All tests
npm run test:all
```

### **Individual Application Testing**
```bash
# InstallSure
cd applications/installsure
npm run test
npm run test:e2e

# Other applications
cd applications/[app-name]
npm run test
```

---

## 🔍 **VERIFICATION**

### **Health Checks**
```bash
# Check all applications
curl http://localhost:3000/health  # InstallSure
curl http://localhost:3001/health  # Demo Dashboard
curl http://localhost:3002/health  # FF4U
curl http://localhost:3003/health  # RedEye
curl http://localhost:3004/health  # ZeroStack
curl http://localhost:3005/health  # Hello
curl http://localhost:3006/health  # Avatar
```

### **Build Verification**
```bash
# Build all applications
npm run build:all

# Verify builds
npm run verify:release
```

---

## 🛠️ **DEVELOPMENT WORKFLOW**

### **Code Quality**
```bash
# Lint all code
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check

# Format code
npm run format
```

### **Git Workflow**
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature"

# Push and create PR
git push origin feature/your-feature-name
```

### **GitHub Copilot CLI (Optional)**
```bash
# Get command suggestions
github-copilot suggest "how to fix merge conflicts"

# Get git command help
github-copilot suggest "commit all changes with message"

# Explain git commands
github-copilot explain "git rebase -i HEAD~3"
```

---

## 📊 **MONITORING & DEBUGGING**

### **Application Logs**
```bash
# View all logs
npm run logs

# View specific app logs
npm run logs:installsure
npm run logs:demo-dashboard
```

### **Debug Mode**
```bash
# Start with debug logging
DEBUG=true npm run dev

# Start specific app in debug mode
cd applications/installsure
DEBUG=true npm run dev
```

---

## 🐛 **TROUBLESHOOTING**

### **Common Issues**

#### **Port Already in Use**
```bash
# Find process using port
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <process-id> /F

# Kill process (macOS/Linux)
kill -9 <process-id>
```

#### **Dependencies Issues**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

#### **Database Connection Issues**
```bash
# Check database status
cd applications/installsure/backend
python -c "from sqlalchemy import create_engine; print('DB OK')"

# Reset database
python -m alembic downgrade base
python -m alembic upgrade head
```

#### **TypeScript Errors**
```bash
# Clear TypeScript cache
rm -rf .tsbuildinfo
rm -rf node_modules/.cache

# Rebuild
npm run build
```

---

## 📚 **ADDITIONAL RESOURCES**

### **Documentation**
- [API Documentation](API_DOCUMENTATION.md)
- [Troubleshooting Guide](TROUBLESHOOTING.md)
- [Architecture Overview](ARCHITECTURE.md)

### **External Links**
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Playwright Testing](https://playwright.dev/)

---

## 🆘 **SUPPORT**

### **Getting Help**
1. Check [Troubleshooting Guide](TROUBLESHOOTING.md)
2. Review application logs
3. Check GitHub issues
4. Contact development team

### **Reporting Issues**
1. Create detailed issue description
2. Include error logs
3. Specify environment details
4. Provide reproduction steps

---

**Setup Guide Version:** 1.0  
**Last Updated:** 2025-09-29  
**Status:** ✅ **READY FOR EXTERNAL USE**

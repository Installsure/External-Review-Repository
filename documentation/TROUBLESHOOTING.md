# 🐛 Troubleshooting Guide

**Common Issues and Solutions for External Review Repository**  
**Last Updated:** 2025-09-29

---

## 🚨 **QUICK FIXES**

### **Port Already in Use**
**Error:** `EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Find process using port
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <process-id> /F

# Kill process (macOS/Linux)
kill -9 <process-id>

# Alternative: Use different port
export VITE_WEB_PORT=5174
npm run dev
```

### **Dependencies Installation Failed**
**Error:** `npm ERR! peer dep missing`

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# If still failing, try with legacy peer deps
npm install --legacy-peer-deps
```

### **TypeScript Compilation Errors**
**Error:** `Cannot find module 'vite/client'`

**Solution:**
```bash
# Install missing types
npm install -D @types/node @types/react @types/react-dom

# Clear TypeScript cache
rm -rf .tsbuildinfo
rm -rf node_modules/.cache

# Rebuild
npm run build
```

---

## 🔧 **APPLICATION-SPECIFIC ISSUES**

### **InstallSure Issues**

#### **Database Connection Failed**
**Error:** `sqlalchemy.exc.OperationalError: (sqlite3.OperationalError)`

**Solution:**
```bash
cd applications/installsure/backend

# Check database file exists
ls -la installsure.db

# If missing, create database
python -c "from app.database import create_tables; create_tables()"

# Or reset database
python -m alembic downgrade base
python -m alembic upgrade head
```

#### **WebSocket Connection Failed**
**Error:** `WebSocket connection failed`

**Solution:**
```bash
# Check if WebSocket server is running
curl http://localhost:3000/health

# Check WebSocket endpoint
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" -H "Sec-WebSocket-Key: test" -H "Sec-WebSocket-Version: 13" http://localhost:3000/ws

# Restart application
cd applications/installsure
npm run dev
```

### **Demo Dashboard Issues**

#### **Application Status Not Updating**
**Error:** Status shows "stopped" for running apps

**Solution:**
```bash
# Check if health endpoints are accessible
curl http://localhost:3000/health
curl http://localhost:3002/health

# Restart demo dashboard
cd applications/demo-dashboard
npm run dev

# Check network connectivity
ping localhost
```

### **Development Apps Issues**

#### **Build Failures**
**Error:** `Module not found: Can't resolve 'react'`

**Solution:**
```bash
# Check if dependencies are installed
cd applications/[app-name]
npm list react

# If missing, install dependencies
npm install

# Check package.json
cat package.json | grep react
```

#### **Hot Reload Not Working**
**Error:** Changes not reflected in browser

**Solution:**
```bash
# Check Vite configuration
cat vite.config.ts

# Restart development server
npm run dev

# Clear browser cache
# Chrome: Ctrl+Shift+R
# Firefox: Ctrl+F5
```

---

## 🐳 **DOCKER ISSUES**

### **Container Won't Start**
**Error:** `docker: Error response from daemon`

**Solution:**
```bash
# Check Docker is running
docker --version
docker ps

# Check docker-compose file
docker-compose config

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### **Port Conflicts in Docker**
**Error:** `Port is already allocated`

**Solution:**
```bash
# Check port usage
docker ps

# Stop conflicting containers
docker stop <container-name>

# Or change ports in docker-compose.yml
# Edit ports: "3001:3000" to "3002:3000"
```

---

## 🧪 **TESTING ISSUES**

### **Playwright Tests Failing**
**Error:** `Error: page.goto: net::ERR_CONNECTION_REFUSED`

**Solution:**
```bash
# Ensure applications are running
npm run start:all

# Wait for applications to start
sleep 30

# Run tests
npm run test:e2e

# Check test configuration
cat playwright.config.ts
```

### **Unit Tests Failing**
**Error:** `Cannot find module '@testing-library/react'`

**Solution:**
```bash
# Install testing dependencies
npm install -D @testing-library/react @testing-library/jest-dom vitest

# Check test configuration
cat vitest.config.ts

# Run tests with verbose output
npm run test -- --verbose
```

---

## 🔐 **AUTHENTICATION ISSUES**

### **JWT Token Invalid**
**Error:** `401 Unauthorized`

**Solution:**
```bash
# Check JWT secret in .env
grep JWT_SECRET .env

# If missing, add to .env
echo "JWT_SECRET=your-secret-key-here" >> .env

# Restart application
npm run dev
```

### **CORS Errors**
**Error:** `Access to fetch at 'http://localhost:3000' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Solution:**
```bash
# Check CORS configuration in backend
grep -r "CORS" applications/installsure/backend/

# Add CORS configuration if missing
# In FastAPI app:
# from fastapi.middleware.cors import CORSMiddleware
# app.add_middleware(CORSMiddleware, allow_origins=["*"])
```

---

## 📊 **PERFORMANCE ISSUES**

### **Slow Build Times**
**Solution:**
```bash
# Clear build cache
rm -rf dist
rm -rf node_modules/.cache

# Use faster build options
npm run build -- --mode production

# Check system resources
# Windows: Task Manager
# macOS/Linux: htop
```

### **Memory Issues**
**Error:** `JavaScript heap out of memory`

**Solution:**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Or add to package.json scripts
# "build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
```

---

## 🌐 **NETWORK ISSUES**

### **Localhost Not Accessible**
**Error:** `This site can't be reached`

**Solution:**
```bash
# Check if port is listening
netstat -tulpn | grep :3000

# Check firewall settings
# Windows: Windows Defender Firewall
# macOS: System Preferences > Security & Privacy > Firewall
# Linux: ufw status

# Try different port
export VITE_WEB_PORT=5174
npm run dev
```

### **API Endpoints Not Responding**
**Error:** `404 Not Found`

**Solution:**
```bash
# Check if API server is running
curl http://localhost:3000/api/health

# Check API routes
grep -r "router" applications/installsure/backend/

# Verify API base URL in frontend
grep -r "localhost:3000" applications/installsure/frontend/
```

---

## 🔍 **DEBUGGING TECHNIQUES**

### **Enable Debug Logging**
```bash
# Set debug environment variable
export DEBUG=true

# Or add to .env
echo "DEBUG=true" >> .env

# Restart application
npm run dev
```

### **Check Application Logs**
```bash
# View all logs
npm run logs

# View specific app logs
npm run logs:installsure

# Check system logs
# Windows: Event Viewer
# macOS: Console.app
# Linux: journalctl -f
```

### **Network Debugging**
```bash
# Check network connectivity
ping localhost

# Check port accessibility
telnet localhost 3000

# Use browser developer tools
# F12 > Network tab > Check requests
```

---

## 📋 **COMMON ERROR MESSAGES**

### **Node.js Errors**
| Error | Cause | Solution |
|-------|-------|----------|
| `EADDRINUSE` | Port already in use | Kill process or change port |
| `ENOENT` | File not found | Check file paths and permissions |
| `EACCES` | Permission denied | Check file permissions |
| `MODULE_NOT_FOUND` | Missing dependency | Run `npm install` |

### **TypeScript Errors**
| Error | Cause | Solution |
|-------|-------|----------|
| `Cannot find module` | Missing types | Install `@types/*` packages |
| `Property does not exist` | Type mismatch | Check type definitions |
| `Implicit any` | Missing type annotation | Add explicit types |

### **Build Errors**
| Error | Cause | Solution |
|-------|-------|----------|
| `Module parse failed` | Syntax error | Check file syntax |
| `Chunk load failed` | Build issue | Clear cache and rebuild |
| `Out of memory` | Memory limit | Increase Node.js memory |

---

## 🆘 **GETTING HELP**

### **Before Asking for Help**
1. ✅ Check this troubleshooting guide
2. ✅ Check application logs
3. ✅ Verify environment setup
4. ✅ Try common solutions
5. ✅ Document error messages

### **When Reporting Issues**
Include the following information:
- **OS and version**
- **Node.js version** (`node --version`)
- **npm version** (`npm --version`)
- **Error message** (full text)
- **Steps to reproduce**
- **Application logs**
- **Screenshot** (if UI issue)

### **Useful Commands for Debugging**
```bash
# System information
node --version
npm --version
python --version
docker --version

# Application status
npm run status
docker ps
netstat -tulpn | grep :300

# Logs
npm run logs
docker-compose logs

# Dependencies
npm list
pip list
```

---

## 📚 **ADDITIONAL RESOURCES**

### **Documentation**
- [Setup Guide](SETUP_GUIDE.md)
- [API Documentation](API_DOCUMENTATION.md)
- [Comprehensive Review Report](COMPREHENSIVE_REVIEW_REPORT.md)

### **External Resources**
- [Node.js Troubleshooting](https://nodejs.org/en/docs/guides/troubleshooting/)
- [Vite Troubleshooting](https://vitejs.dev/guide/troubleshooting.html)
- [Playwright Troubleshooting](https://playwright.dev/docs/troubleshooting)

---

**Troubleshooting Guide Version:** 1.0  
**Last Updated:** 2025-09-29  
**Status:** ✅ **COMPREHENSIVE TROUBLESHOOTING READY**

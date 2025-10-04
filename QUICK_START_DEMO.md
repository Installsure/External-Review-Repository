# 🚀 Quick Start - E2E Demo

**Get the complete demo running in 5 minutes!**

---

## ⚡ Super Quick Start

```bash
# 1. Install all dependencies (one-time setup)
cd applications/demo-dashboard && npm install && cd ../..

# 2. Start all applications
./scripts/start-all.sh    # Linux/macOS
# OR
.\scripts\start-all.ps1   # Windows

# 3. Verify everything is running
./scripts/verify-demo.sh    # Linux/macOS
# OR
.\scripts\verify-demo.ps1   # Windows

# 4. Open your browser
# Visit: http://localhost:3001
```

---

## 📋 Step-by-Step Guide

### **Step 1: Prerequisites**

Make sure you have:
- ✅ Node.js v20+ (`node --version`)
- ✅ npm v8+ (`npm --version`)
- ✅ Internet connection

### **Step 2: Install Dependencies**

**Option A: Install for just the demo dashboard (quickest)**
```bash
cd applications/demo-dashboard
npm install
cd ../..
```

**Option B: Install for all applications (full demo)**
```bash
# Install for each application
for app in demo-dashboard installsure ff4u redeye zerostack hello avatar; do
  cd applications/$app
  npm install
  cd ../..
done
```

### **Step 3: Start Applications**

**Linux/macOS:**
```bash
chmod +x scripts/*.sh  # Make scripts executable (first time only)
./scripts/start-all.sh
```

**Windows PowerShell:**
```powershell
.\scripts\start-all.ps1
```

**Individual Application (if you only want to start one):**
```bash
cd applications/demo-dashboard
npm run dev
```

### **Step 4: Verify**

**Automated Check:**
```bash
./scripts/verify-demo.sh    # Linux/macOS
.\scripts\verify-demo.ps1   # Windows
```

**Manual Check:**
Open these URLs in your browser:
- http://localhost:3001 - Demo Dashboard (START HERE)
- http://localhost:3000 - InstallSure
- http://localhost:3002 - FF4U
- http://localhost:3003 - RedEye
- http://localhost:3004 - ZeroStack
- http://localhost:3005 - Hello
- http://localhost:3006 - Avatar

### **Step 5: Start Demo**

1. **Open Demo Dashboard**: http://localhost:3001
2. **Browse Applications**: See all 7 applications in the dashboard
3. **Click on an App**: View detailed information
4. **Launch Demo**: Click "Launch Demo" button to open the application
5. **Explore Features**: Follow the E2E_DEMO_GUIDE.md for detailed walkthrough

---

## 🎯 What You'll See

### **Demo Dashboard (Port 3001)**
- Visual overview of all applications
- Search and filter capabilities
- Application details and features
- Quick launch buttons

### **Applications Overview**

| App | Port | Description | Status |
|-----|------|-------------|--------|
| **InstallSure** | 3000 | Construction Management | ✅ Production Ready |
| **Demo Dashboard** | 3001 | Central Control Panel | ✅ Demo Ready |
| **FF4U** | 3002 | Fitness Platform | ⚠️ Development Ready |
| **RedEye** | 3003 | Project Management | ⚠️ Development Ready |
| **ZeroStack** | 3004 | Infrastructure Management | ⚠️ Development Ready |
| **Hello** | 3005 | Digital Business Cards | ⚠️ Development Ready |
| **Avatar** | 3006 | AI Avatar Platform | ⚠️ Development Ready |

---

## 🔐 Demo Credentials

Use these credentials when logging into applications:

```
Email: demo@[app-name].com
Password: demo123

Examples:
- demo@installsure.com / demo123
- admin@ff4u.com / demo123
- demo@redeye.com / demo123
```

---

## 🛑 Stopping the Demo

**Stop all applications:**
```bash
./scripts/stop-all.sh     # Linux/macOS
.\scripts\stop-all.ps1    # Windows
```

**Stop individual application:**
```bash
# Press Ctrl+C in the terminal where it's running
```

---

## ❓ Troubleshooting

### **Port Already in Use**
```bash
# Linux/macOS: Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Windows: Kill process on port 3001
$process = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
Stop-Process -Id $process.OwningProcess -Force
```

### **Dependencies Not Installing**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### **Application Won't Start**
```bash
# Check Node.js version (should be v20+)
node --version

# Check npm version (should be v8+)
npm --version

# Check if port is available
lsof -i :3001  # Linux/macOS
netstat -ano | findstr :3001  # Windows
```

### **Browser Issues**
- Clear browser cache
- Try incognito/private mode
- Try a different browser
- Disable browser extensions

---

## 📚 Next Steps

### **For a Full Demo Walkthrough:**
Read: `documentation/E2E_DEMO_GUIDE.md`

### **For Detailed Setup:**
Read: `documentation/SETUP_GUIDE.md`

### **For API Details:**
Read: `documentation/API_DOCUMENTATION.md`

### **For Troubleshooting:**
Read: `documentation/TROUBLESHOOTING.md`

---

## 🎬 Demo Flow Recommendations

### **Quick Demo (15 min)**
1. Demo Dashboard overview (3 min)
2. InstallSure features (7 min)
3. One other app of choice (5 min)

### **Standard Demo (30 min)**
1. Demo Dashboard overview (5 min)
2. InstallSure deep dive (10 min)
3. FF4U features (5 min)
4. Two other apps briefly (5 min each)

### **Full Demo (60 min)**
1. Demo Dashboard (10 min)
2. All 7 applications (7-8 min each)
3. Q&A (10 min)

---

## ✅ Success Checklist

Before starting your demo:
- [ ] All dependencies installed
- [ ] All applications started successfully
- [ ] Verified with verify-demo script
- [ ] Demo Dashboard accessible at http://localhost:3001
- [ ] Demo credentials ready
- [ ] Browser tabs prepared
- [ ] E2E_DEMO_GUIDE.md reviewed

---

## 💡 Pro Tips

1. **Pre-open Tabs**: Open all 7 URLs in separate browser tabs before the demo
2. **Use Dashboard**: Always return to the Demo Dashboard between apps
3. **Share Screen**: If remote, share your entire browser window
4. **Practice First**: Run through the demo once before presenting
5. **Have Backup**: Keep the verify-demo script running in background

---

**Last Updated:** 2025-09-29  
**Status:** ✅ Ready to Use

**Need Help?** Check `documentation/TROUBLESHOOTING.md` or `documentation/E2E_DEMO_GUIDE.md`

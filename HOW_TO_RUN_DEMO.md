# 🎬 Running the Full E2E Demo

**The Easiest Way to Experience All Applications**

---

## 🚀 Three Ways to Run the Demo

### Option 1: Interactive Demo Runner (Recommended) ⭐

The easiest way - just follow the prompts!

```bash
./scripts/run-demo.sh
```

This interactive script will:
- ✅ Check prerequisites
- ✅ Install dependencies
- ✅ Start the demo dashboard
- ✅ Open your browser automatically
- ✅ Guide you through the demo
- ✅ Provide demo credentials
- ✅ Show you what to do next

**Perfect for:** First-time users, presentations, and guided demos

---

### Option 2: Quick Manual Start

For experienced users who know the drill:

```bash
# 1. Install dependencies
cd applications/demo-dashboard
npm install
cd ../..

# 2. Start demo dashboard
cd applications/demo-dashboard
npm run dev

# 3. Open browser to http://localhost:3001
```

**Perfect for:** Quick testing and development

---

### Option 3: Full Suite

Start all applications at once:

```bash
# Linux/macOS
./scripts/start-all.sh

# Windows
.\scripts\start-all.ps1
```

Then verify everything is running:

```bash
# Linux/macOS
./scripts/verify-demo.sh

# Windows
.\scripts\verify-demo.ps1
```

**Perfect for:** Comprehensive demos showing all applications

---

## 📋 What You'll Need

### Minimum Requirements
- **Node.js** v20+ ([download](https://nodejs.org))
- **npm** v8+
- **8GB RAM** minimum
- **Internet connection** (for initial setup)

### Check Your Versions
```bash
node --version  # Should be v20.0.0 or higher
npm --version   # Should be v8.0.0 or higher
```

---

## 🎯 What You'll See

### Demo Dashboard (http://localhost:3001)

The demo dashboard is your central hub. It shows:

- 📱 **6 Applications** ready to explore
- 🔵 **Launch Demo** buttons to open each app
- 📊 **Feature descriptions** for each application
- 🎨 **Modern, clean interface**

### Available Applications

| Application | Port | Description |
|-------------|------|-------------|
| 🏗️ **InstallSure** | 3000 | Construction project management with AutoCAD integration |
| 💪 **FF4U** | 3002 | Fitness and wellness platform |
| 👁️ **RedEye** | 3003 | Project tracking and management system |
| ☁️ **ZeroStack** | 3004 | Infrastructure management platform |
| 👋 **Hello** | 3005 | Social networking and communication platform |
| 🤖 **Avatar** | 3006 | AI-powered avatar platform for customer service |

---

## 🔐 Demo Credentials

All applications use the same simple pattern:

```
Email:    demo@[app-name].com
Password: demo123

Examples:
- demo@installsure.com / demo123
- admin@ff4u.com / demo123
- demo@redeye.com / demo123
```

**Note:** These are demo credentials for testing only!

---

## 📚 Detailed Guides

Choose the guide that fits your needs:

### 🚀 [QUICK_START_DEMO.md](QUICK_START_DEMO.md)
**5 minutes** - Get the demo running fast
- Prerequisites check
- Installation commands
- Quick troubleshooting

### 🎬 [E2E_DEMO_GUIDE.md](documentation/E2E_DEMO_GUIDE.md)
**60 minutes** - Complete walkthrough
- Full demo script
- Application-by-application guide
- Technical details
- Q&A suggestions

### 🔐 [DEMO_CREDENTIALS.md](documentation/DEMO_CREDENTIALS.md)
**Reference** - All test accounts and scenarios
- All demo credentials
- Test scenarios for each app
- Sample data sets
- Reset procedures

---

## 🛑 Stopping the Demo

When you're done:

```bash
# Linux/macOS
./scripts/stop-all.sh

# Windows
.\scripts\stop-all.ps1

# Or press Ctrl+C in each terminal window
```

---

## ❓ Troubleshooting

### "Port already in use"

```bash
# Find what's using port 3001
lsof -i :3001          # macOS/Linux
netstat -ano | findstr :3001   # Windows

# Kill the process
kill -9 <PID>          # macOS/Linux
taskkill /PID <PID> /F # Windows
```

### "Dependencies not installing"

```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### "Application won't start"

1. Check Node.js version: `node --version` (need v20+)
2. Check port availability: `lsof -i :3001`
3. Check logs: Look in terminal output
4. Try reinstalling: Delete `node_modules` and run `npm install`

### "Can't see the dashboard"

1. Make sure it's running: Check terminal for "VITE ready"
2. Try the URL: http://localhost:3001
3. Clear browser cache
4. Try incognito mode
5. Try a different browser

---

## 💡 Pro Tips

### For Presentations

1. **Pre-load tabs** - Open all apps in separate browser tabs before presenting
2. **Use dashboard** - Always return to the dashboard between apps
3. **Practice first** - Run through the demo once before the real thing
4. **Have credentials ready** - Keep demo credentials visible
5. **Monitor terminal** - Keep an eye on the terminal for errors

### For Development

1. **Use verify script** - Run `./scripts/verify-demo.sh` to check status
2. **Check logs** - Applications log to `/tmp/*.log` files
3. **Kill ports** - Use stop-all.sh to clean up completely
4. **Hot reload** - The demo dashboard supports hot module replacement

### For Testing

1. **Test individual apps** - Start just one app to test it in isolation
2. **Use test data** - See DEMO_CREDENTIALS.md for sample data
3. **Reset state** - Restart apps to reset demo data
4. **Browser tools** - Use DevTools to debug issues

---

## 📞 Need Help?

1. **Check the guides:**
   - QUICK_START_DEMO.md
   - documentation/E2E_DEMO_GUIDE.md
   - documentation/TROUBLESHOOTING.md

2. **Verify setup:**
   - Run `./scripts/verify-demo.sh`
   - Check application logs
   - Verify ports are free

3. **Common issues:**
   - See troubleshooting section above
   - Check documentation/TROUBLESHOOTING.md

---

## ✅ Demo Checklist

Before your demo:

- [ ] Node.js v20+ installed
- [ ] npm v8+ installed
- [ ] Dependencies installed (`npm install` in demo-dashboard)
- [ ] Demo dashboard starts successfully
- [ ] Can access http://localhost:3001
- [ ] Browser is ready (Chrome/Firefox/Safari recommended)
- [ ] Demo credentials are handy
- [ ] Guides are reviewed (E2E_DEMO_GUIDE.md)
- [ ] Practice run completed (optional but recommended)

---

## 🎉 You're Ready!

**Run the demo:**
```bash
./scripts/run-demo.sh
```

**Or jump straight in:**
```bash
cd applications/demo-dashboard && npm run dev
```

**Then visit:** http://localhost:3001

---

**Enjoy your demo!** 🚀

For questions or issues, see the documentation or check the troubleshooting guide.

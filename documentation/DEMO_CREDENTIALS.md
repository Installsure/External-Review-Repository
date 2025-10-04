# 🔐 Demo Credentials & Test Data

**Test Accounts for E2E Demo**  
**Last Updated:** 2025-09-29

---

## 📋 **DEMO CREDENTIALS**

All applications use the same demo credential pattern:

### **Standard Demo Account**
```
Email:    demo@[application-name].com
Password: demo123
```

### **Application-Specific Credentials**

| Application | Email | Password | Role |
|-------------|-------|----------|------|
| **InstallSure** | demo@installsure.com | demo123 | User |
| **FF4U** | admin@ff4u.com | demo123 | Admin |
| **FF4U** | demo@ff4u.com | demo123 | User |
| **RedEye** | demo@redeye.com | demo123 | User |
| **ZeroStack** | demo@zerostack.com | demo123 | User |
| **Hello** | demo@hello.com | demo123 | User |
| **Avatar** | demo@avatar.com | demo123 | User |

---

## 🧪 **TEST SCENARIOS**

### **Scenario 1: Demo Dashboard Navigation**

**Objective:** Navigate through the demo dashboard and launch applications

**Steps:**
1. Open http://localhost:3001
2. View all application cards
3. Read application descriptions
4. Click "Launch Demo" on InstallSure
5. Verify InstallSure opens in new tab
6. Return to dashboard
7. Repeat for other applications

**Expected Result:** All applications launch successfully

---

### **Scenario 2: InstallSure Construction Management**

**Objective:** Test construction project management features

**Steps:**
1. Navigate to http://localhost:3000
2. Login with demo@installsure.com / demo123
3. View dashboard with project statistics
4. Navigate to projects section
5. Create a new project
6. Upload a construction document
7. View project details

**Expected Result:** User can manage construction projects

---

### **Scenario 3: FF4U Fitness Platform**

**Objective:** Test fitness tracking features

**Steps:**
1. Navigate to http://localhost:3002
2. Login with admin@ff4u.com / demo123
3. View user dashboard
4. Check workout tracking section
5. View nutrition planning
6. Check progress monitoring charts
7. Test community features

**Expected Result:** User can track fitness activities

---

### **Scenario 4: RedEye Project Management**

**Objective:** Test project and task management

**Steps:**
1. Navigate to http://localhost:3003
2. Login with demo@redeye.com / demo123
3. View project dashboard
4. Create a new task
5. Assign task to team member
6. Update task status
7. View analytics

**Expected Result:** User can manage projects and tasks

---

### **Scenario 5: ZeroStack Infrastructure**

**Objective:** Test infrastructure management features

**Steps:**
1. Navigate to http://localhost:3004
2. Login with demo@zerostack.com / demo123
3. View infrastructure dashboard
4. Check resource overview
5. View monitoring metrics
6. Check cost optimization
7. Review system health

**Expected Result:** User can monitor infrastructure

---

### **Scenario 6: Hello Digital Cards**

**Objective:** Test digital business card features

**Steps:**
1. Navigate to http://localhost:3005
2. Login with demo@hello.com / demo123
3. View existing business cards
4. Create a new digital card
5. Generate QR code
6. Test card sharing
7. View analytics

**Expected Result:** User can create and share digital cards

---

### **Scenario 7: Avatar AI Platform**

**Objective:** Test AI avatar interaction

**Steps:**
1. Navigate to http://localhost:3006
2. Login with demo@avatar.com / demo123
3. View avatar dashboard
4. Select an AI avatar
5. Test voice interaction (if available)
6. View avatar animations
7. Test multi-persona support

**Expected Result:** User can interact with AI avatars

---

## 📊 **TEST DATA SETS**

### **Sample Project (InstallSure)**
```json
{
  "name": "Demo Construction Project",
  "description": "Sample building project for testing",
  "location": "123 Main St, City, State",
  "startDate": "2025-01-01",
  "endDate": "2025-12-31",
  "budget": 1000000
}
```

### **Sample Task (RedEye)**
```json
{
  "title": "Complete Design Phase",
  "description": "Finalize all design documents",
  "priority": "high",
  "dueDate": "2025-02-15",
  "assignee": "demo@redeye.com",
  "status": "in-progress"
}
```

### **Sample Workout (FF4U)**
```json
{
  "type": "Cardio",
  "duration": 30,
  "intensity": "moderate",
  "calories": 300,
  "date": "2025-01-15"
}
```

---

## 🔍 **VERIFICATION CHECKLIST**

### **Pre-Demo Verification**
- [ ] All applications installed
- [ ] Demo dashboard accessible at http://localhost:3001
- [ ] All demo credentials work
- [ ] No console errors in browser
- [ ] All links are functional

### **During Demo Verification**
- [ ] Can navigate between applications
- [ ] Can login to each application
- [ ] Can perform basic CRUD operations
- [ ] UI is responsive and functional
- [ ] No JavaScript errors
- [ ] Images and assets load correctly

### **Post-Demo Verification**
- [ ] All applications can be stopped cleanly
- [ ] No port conflicts remain
- [ ] Temporary files cleaned up
- [ ] Demo data can be reset

---

## 🛡️ **SECURITY NOTES**

**⚠️ IMPORTANT:**
- These are **DEMO CREDENTIALS ONLY**
- **DO NOT** use these credentials in production
- **DO NOT** commit real credentials to the repository
- All demo accounts have limited permissions
- Demo data is for testing purposes only

---

## 🔄 **RESETTING DEMO DATA**

To reset demo data between presentations:

```bash
# Stop all applications
./scripts/stop-all.sh

# Clear temporary data (if applicable)
rm -rf /tmp/*.log
rm -rf /tmp/*.pid

# Restart applications
./scripts/start-all.sh
```

---

## 📞 **SUPPORT**

If credentials don't work:
1. Check application logs in `/tmp/*.log`
2. Verify application is running on correct port
3. Clear browser cache and cookies
4. Try incognito/private browsing mode
5. Restart the application

---

## 📝 **NOTES**

- **Password Requirements:** All demo passwords are intentionally simple (demo123) for ease of testing
- **Email Format:** All demo emails follow the pattern demo@[app].com
- **Role-Based Access:** Some applications may have different features based on role (admin vs user)
- **Session Duration:** Demo sessions may timeout after 30 minutes of inactivity

---

**Version:** 1.0  
**Last Updated:** 2025-09-29  
**Status:** ✅ Ready for Use

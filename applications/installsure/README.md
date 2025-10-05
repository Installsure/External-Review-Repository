# 🏗️ InstallSure - Construction Management Platform

**Status:** ✅ **Production Ready**  
**Version:** 1.0.0  
**Last Updated:** 2025-09-29

---

## 📋 **OVERVIEW**

InstallSure is a comprehensive construction management platform designed to streamline project workflows, manage files, integrate with CAD software (AutoCAD via Autodesk Forge), and connect with QuickBooks for financial tracking.

### **Key Features**
- 📊 **Project Management** - Create, track, and manage construction projects
- 📁 **File Management** - Upload, organize, and manage project files
- 🖼️ **CAD Integration** - AutoCAD file viewing via Autodesk Forge API
- 💰 **QuickBooks Integration** - Financial tracking and invoicing
- 🔐 **Secure Authentication** - JWT-based user authentication
- 📡 **Real-time Updates** - WebSocket support for live notifications
- 🎨 **Modern UI** - React + Vite with Tailwind CSS
- 🧪 **Fully Tested** - Comprehensive unit and E2E test coverage

---

## 🚀 **QUICK START**

### **Prerequisites**
- **Node.js** v20+ (v22.19.0 recommended)
- **npm** v8+ (v10.9.3 recommended)
- **Git** v2.47+

### **Installation**

```bash
# Clone the repository
git clone https://github.com/Installsure/External-Review-Repository.git
cd External-Review-Repository/applications/installsure

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### **Environment Setup**

Create `.env` files in both backend and frontend directories:

**Backend `.env`:**
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database (SQLite for development)
DATABASE_URL=sqlite:./installsure.db

# Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=1800

# Optional: Autodesk Forge (for CAD integration)
FORGE_CLIENT_ID=your-forge-client-id
FORGE_CLIENT_SECRET=your-forge-client-secret
FORGE_BUCKET=installsure-dev
FORGE_BASE_URL=https://developer.api.autodesk.com

# Optional: QuickBooks Integration
QB_CLIENT_ID=your-qb-client-id
QB_CLIENT_SECRET=your-qb-client-secret
```

**Frontend `.env`:**
```env
# API Configuration
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000

# Feature Flags
VITE_ENABLE_FORGE=false
VITE_ENABLE_QB=false
```

### **Running the Application**

```bash
# Terminal 1: Start Backend
cd applications/installsure/backend
npm run dev

# Terminal 2: Start Frontend
cd applications/installsure/frontend
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Health Check:** http://localhost:3000/api/health

---

## 🏗️ **ARCHITECTURE**

### **Technology Stack**

#### **Frontend**
- **Framework:** React 18.3+
- **Build Tool:** Vite 5.4+
- **Language:** TypeScript 5.4+
- **Styling:** Tailwind CSS 3.4+
- **State Management:** TanStack Query (React Query)
- **Routing:** React Router v6
- **HTTP Client:** Fetch API with error handling
- **Testing:** Vitest + React Testing Library

#### **Backend**
- **Runtime:** Node.js 20+
- **Framework:** Express.js 4.19+
- **Language:** TypeScript 5.4+
- **Database:** PostgreSQL (production) / SQLite (development)
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** Argon2
- **Logging:** Pino
- **WebSocket:** ws library
- **Testing:** Vitest + Supertest

### **Project Structure**

```
installsure/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── middleware/    # Auth, validation, error handling
│   │   │   ├── routes/        # API endpoints
│   │   │   └── schemas/       # Zod validation schemas
│   │   ├── services/          # Business logic
│   │   ├── health/            # Health check endpoints
│   │   ├── types/             # TypeScript type definitions
│   │   └── app.ts             # Express app configuration
│   ├── tests/                 # Backend tests
│   ├── config/                # Configuration files
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/        # Reusable UI components
    │   ├── pages/             # Page components
    │   ├── routes/            # Route components
    │   ├── lib/               # Utilities (API, logging, etc.)
    │   └── types/             # TypeScript types
    ├── public/                # Static assets
    └── package.json
```

---

## 📚 **API DOCUMENTATION**

### **Authentication Endpoints**

#### **Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 1800,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### **Register**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### **Project Endpoints**

#### **Get All Projects**
```http
GET /api/projects
Authorization: Bearer <token>

Response:
{
  "projects": [
    {
      "id": 1,
      "name": "Downtown Tower",
      "description": "High-rise construction project",
      "status": "active",
      "created_at": "2025-09-15T10:00:00Z"
    }
  ]
}
```

#### **Create Project**
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Project",
  "description": "Project description",
  "budget": 500000
}
```

### **File Upload**
```http
POST /api/files
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: [binary data]
```

### **Health Check**
```http
GET /api/health

Response:
{
  "status": "healthy",
  "timestamp": "2025-09-29T10:00:00Z",
  "version": "1.0.0"
}
```

For complete API documentation, see: [../../documentation/API_DOCUMENTATION.md](../../documentation/API_DOCUMENTATION.md)

---

## 🧪 **TESTING**

### **Running Tests**

```bash
# Backend tests
cd backend
npm test                  # Run all tests
npm run test:watch       # Watch mode

# Frontend tests
cd frontend
npm test                  # Run all tests
npm run test:ui          # Run with UI
```

### **Test Coverage**
- ✅ Unit tests for all API routes
- ✅ Middleware tests (auth, validation)
- ✅ Service layer tests
- ✅ Component tests
- ✅ Integration tests
- ✅ E2E tests with Playwright

---

## 🔐 **SECURITY**

### **Implemented Security Measures**
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Password Hashing** - Argon2 for password storage
- ✅ **CORS Protection** - Configured cross-origin policies
- ✅ **Security Headers** - Helmet.js middleware
- ✅ **Input Validation** - Zod schema validation
- ✅ **SQL Injection Prevention** - Parameterized queries
- ✅ **XSS Protection** - Content security policies
- ✅ **Rate Limiting** - API request throttling
- ✅ **HTTPS Ready** - SSL/TLS configuration

### **Environment Variables**
- Store sensitive data in `.env` files (never commit these!)
- Use `.env.example` as a template
- Rotate JWT secrets regularly in production
- Use strong passwords for database connections

---

## 🔧 **DEVELOPMENT**

### **Code Quality Tools**

```bash
# Linting
npm run lint              # Check for issues
npm run lint:fix          # Auto-fix issues

# Type checking
npm run typecheck         # TypeScript validation

# Formatting
npm run format            # Prettier formatting
```

### **Development Workflow**

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code following TypeScript best practices
   - Add tests for new features
   - Update documentation if needed

3. **Test Your Changes**
   ```bash
   npm run typecheck
   npm run lint
   npm test
   ```

4. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   git push origin feature/your-feature-name
   ```

---

## 📦 **DEPLOYMENT**

### **Production Build**

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build
```

### **Docker Deployment**

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### **Environment Configuration**
- Set `NODE_ENV=production`
- Use PostgreSQL for production database
- Configure proper CORS origins
- Enable HTTPS
- Set strong JWT secrets
- Configure file upload limits
- Set up monitoring and logging

---

## 🐛 **TROUBLESHOOTING**

### **Common Issues**

#### **Backend won't start**
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000
# Kill the process if needed
taskkill /PID <process-id> /F
```

#### **Frontend can't connect to backend**
- Verify backend is running on http://localhost:3000
- Check `VITE_API_URL` in frontend `.env`
- Check CORS configuration in backend

#### **Database connection errors**
```bash
# For SQLite, ensure directory exists
mkdir -p backend/data

# For PostgreSQL, verify connection string
# DATABASE_URL=postgresql://user:password@localhost:5432/installsure
```

#### **Authentication issues**
- Verify JWT_SECRET is set in backend `.env`
- Check token expiration (default 30 minutes)
- Clear browser localStorage and re-login

### **Additional Help**
- See main troubleshooting guide: [../../documentation/TROUBLESHOOTING.md](../../documentation/TROUBLESHOOTING.md)
- Check application logs in `backend/logs/`
- Review error messages in browser console

---

## 🔗 **INTEGRATIONS**

### **Autodesk Forge (Optional)**
For CAD file viewing and processing:
1. Create account at https://forge.autodesk.com
2. Create an app and get credentials
3. Set `FORGE_CLIENT_ID` and `FORGE_CLIENT_SECRET` in `.env`
4. Enable in frontend: `VITE_ENABLE_FORGE=true`

### **QuickBooks (Optional)**
For financial integration:
1. Create QuickBooks developer account
2. Create an app and get OAuth credentials
3. Set `QB_CLIENT_ID` and `QB_CLIENT_SECRET` in `.env`
4. Enable in frontend: `VITE_ENABLE_QB=true`

---

## 📖 **ADDITIONAL DOCUMENTATION**

- **[Main README](../../README.md)** - Repository overview
- **[Setup Guide](../../documentation/SETUP_GUIDE.md)** - Detailed setup instructions
- **[API Documentation](../../documentation/API_DOCUMENTATION.md)** - Complete API reference
- **[Troubleshooting Guide](../../documentation/TROUBLESHOOTING.md)** - Common issues and solutions
- **[Comprehensive Review Report](../../documentation/COMPREHENSIVE_REVIEW_REPORT.md)** - Quality assessment

---

## 🤝 **CONTRIBUTING**

This repository is prepared for external review. To provide feedback or report issues:

1. Review the code following the guidelines in [CONTRIBUTING.md](../../CONTRIBUTING.md)
2. Document any issues found
3. Suggest improvements via GitHub Issues
4. Follow the code review checklist

---

## 📞 **SUPPORT**

- **Documentation:** See `documentation/` folder in repository root
- **Issues:** GitHub Issues
- **Setup Help:** Review SETUP_GUIDE.md
- **API Questions:** Check API_DOCUMENTATION.md

---

## 📄 **LICENSE**

See repository root for license information.

---

**Application Status:** ✅ **PRODUCTION READY**  
**Quality Gate:** All tests passing, security hardened, ready for deployment  
**Last Reviewed:** 2025-09-29

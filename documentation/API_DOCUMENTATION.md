# 📚 API Documentation

**Comprehensive API Reference for All Applications**  
**Last Updated:** 2025-09-29

---

## 🌐 **API OVERVIEW**

This documentation covers the APIs for all applications in the External Review Repository:

| Application | Port | API Base URL | Status |
|-------------|------|--------------|--------|
| **InstallSure** | 3000 | `http://localhost:3000/api` | ✅ Production Ready |
| **Demo Dashboard** | 3001 | `http://localhost:3001/api` | ✅ Demo Ready |
| **FF4U** | 3002 | `http://localhost:3002/api` | ⚠️ Development Ready |
| **RedEye** | 3003 | `http://localhost:3003/api` | ⚠️ Development Ready |
| **ZeroStack** | 3004 | `http://localhost:3004/api` | ⚠️ Development Ready |
| **Hello** | 3005 | `http://localhost:3005/api` | ⚠️ Development Ready |
| **Avatar** | 3006 | `http://localhost:3006/api` | ⚠️ Development Ready |

---

## 🏗️ **INSTALLSURE API (Production Ready)**

### **Base URL:** `http://localhost:3000/api`

### **Authentication**
All protected endpoints require JWT authentication:
```http
Authorization: Bearer <jwt-token>
```

### **Health Check**
```http
GET /health
```
**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-09-29T10:00:00Z",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "websocket": "active",
    "file_storage": "available"
  }
}
```

### **Authentication Endpoints**

#### **Login**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
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
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### **Project Management**

#### **Get Projects**
```http
GET /projects
Authorization: Bearer <token>
```

**Response:**
```json
{
  "projects": [
    {
      "id": 1,
      "name": "Construction Project A",
      "description": "Residential building construction",
      "status": "active",
      "created_at": "2025-09-29T10:00:00Z",
      "updated_at": "2025-09-29T10:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "per_page": 10
}
```

#### **Create Project**
```http
POST /projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Project",
  "description": "Project description",
  "status": "planning"
}
```

### **WebSocket Events**

#### **Connection**
```javascript
const ws = new WebSocket('ws://localhost:3000/ws');

ws.onopen = () => {
  console.log('Connected to InstallSure WebSocket');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};
```

#### **Event Types**
- `project_updated` - Project status changes
- `task_created` - New task created
- `task_completed` - Task marked as complete
- `notification` - General notifications

---

## 🎛️ **DEMO DASHBOARD API (Demo Ready)**

### **Base URL:** `http://localhost:3001/api`

### **Application Status**
```http
GET /apps/status
```

**Response:**
```json
{
  "apps": [
    {
      "name": "InstallSure",
      "port": 3000,
      "status": "running",
      "url": "http://localhost:3000",
      "last_check": "2025-09-29T10:00:00Z"
    },
    {
      "name": "FF4U",
      "port": 3002,
      "status": "stopped",
      "url": "http://localhost:3002",
      "last_check": "2025-09-29T09:55:00Z"
    }
  ],
  "total_apps": 7,
  "running_apps": 5,
  "stopped_apps": 2
}
```

### **Start Application**
```http
POST /apps/start
Content-Type: application/json

{
  "app_name": "ff4u",
  "port": 3002
}
```

### **Stop Application**
```http
POST /apps/stop
Content-Type: application/json

{
  "app_name": "ff4u"
}
```

---

## 🎮 **FF4U API (Development Ready)**

### **Base URL:** `http://localhost:3002/api`

### **Health Check**
```http
GET /health
```

### **Content Management**
```http
GET /content
POST /content
PUT /content/:id
DELETE /content/:id
```

---

## 👁️ **REDEYE API (Development Ready)**

### **Base URL:** `http://localhost:3003/api`

### **Health Check**
```http
GET /health
```

### **Project Management**
```http
GET /projects
POST /projects
PUT /projects/:id
DELETE /projects/:id
```

### **Task Management**
```http
GET /tasks
POST /tasks
PUT /tasks/:id
DELETE /tasks/:id
```

---

## 🏗️ **ZEROSTACK API (Development Ready)**

### **Base URL:** `http://localhost:3004/api`

### **Health Check**
```http
GET /health
```

### **Infrastructure Management**
```http
GET /infrastructure
POST /infrastructure
PUT /infrastructure/:id
DELETE /infrastructure/:id
```

---

## 👋 **HELLO API (Development Ready)**

### **Base URL:** `http://localhost:3005/api`

### **Health Check**
```http
GET /health
```

### **Card Management**
```http
GET /cards
POST /cards
PUT /cards/:id
DELETE /cards/:id
```

### **QR Code Generation**
```http
GET /cards/:id/qr
```

---

## 🤖 **AVATAR API (Development Ready)**

### **Base URL:** `http://localhost:3006/api`

### **Health Check**
```http
GET /health
```

### **AI Chat**
```http
POST /ai/chat
Content-Type: application/json

{
  "message": "Hello, how are you?",
  "context": "user_context"
}
```

### **Avatar Management**
```http
GET /avatars
POST /avatars
PUT /avatars/:id
DELETE /avatars/:id
```

---

## 🔐 **AUTHENTICATION & SECURITY**

### **JWT Token Structure**
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "user",
  "iat": 1695996000,
  "exp": 1695997800
}
```

### **Security Headers**
All APIs include security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`

### **Rate Limiting**
- **General APIs:** 100 requests per minute
- **Authentication:** 5 requests per minute
- **File Upload:** 10 requests per minute

---

## 📊 **ERROR HANDLING**

### **Standard Error Response**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    },
    "timestamp": "2025-09-29T10:00:00Z",
    "request_id": "req_123456789"
  }
}
```

### **HTTP Status Codes**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

---

## 🧪 **TESTING ENDPOINTS**

### **Test Data Generation**
```http
POST /test/generate-data
Content-Type: application/json

{
  "app": "installsure",
  "count": 10,
  "type": "projects"
}
```

### **Reset Database**
```http
POST /test/reset-database
Authorization: Bearer <admin-token>
```

---

## 📝 **API EXAMPLES**

### **Complete Workflow Example (InstallSure)**
```bash
# 1. Health Check
curl http://localhost:3000/api/health

# 2. Register User
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# 3. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 4. Create Project (using token from login)
curl -X POST http://localhost:3000/api/projects \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Project","description":"Test Description"}'

# 5. Get Projects
curl -X GET http://localhost:3000/api/projects \
  -H "Authorization: Bearer <token>"
```

---

## 🔧 **DEVELOPMENT TOOLS**

### **API Testing with curl**
```bash
# Test all health endpoints
for port in 3000 3001 3002 3003 3004 3005 3006; do
  echo "Testing port $port..."
  curl -s http://localhost:$port/api/health || echo "Failed"
done
```

### **API Testing with Postman**
Import the Postman collection from `testing/postman/` directory.

### **API Documentation (Swagger)**
- InstallSure: `http://localhost:3000/docs`
- Demo Dashboard: `http://localhost:3001/docs`
- Other apps: Check individual documentation

---

**API Documentation Version:** 1.0  
**Last Updated:** 2025-09-29  
**Status:** ✅ **COMPREHENSIVE API REFERENCE READY**

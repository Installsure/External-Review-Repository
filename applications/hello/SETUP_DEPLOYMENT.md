# Hello App - Setup and Deployment Guide

## Prerequisites

### Required Software
- Node.js v20+ (v22.19.0 recommended)
- npm v10+ (v10.9.3 recommended)
- PostgreSQL database (Neon serverless recommended)
- Git v2.47+

### Required Accounts
- Neon Database account (free tier available at https://neon.tech)
- GitHub account (for deployment)

## Local Development Setup

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd External-Review-Repository/applications/hello
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables

Create or verify `.env` file in the `applications/hello` directory:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
NEON_DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

# Application Configuration
NODE_ENV=development
PORT=3005

# Optional: JWT Secret (for production)
JWT_SECRET=your-secret-key-here
```

### Step 4: Set Up Database

#### Create Database Tables

Run the following SQL to set up the database schema:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  handle TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  links JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hellos table (connection requests)
CREATE TABLE IF NOT EXISTS hellos (
  id SERIAL PRIMARY KEY,
  from_user TEXT REFERENCES users(id) ON DELETE CASCADE,
  to_handle TEXT NOT NULL,
  note TEXT,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Introductions table (confirmed connections)
CREATE TABLE IF NOT EXISTS introductions (
  id SERIAL PRIMARY KEY,
  a_user TEXT REFERENCES users(id) ON DELETE CASCADE,
  b_user TEXT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(
    LEAST(a_user, b_user),
    GREATEST(a_user, b_user)
  )
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_handle ON profiles(handle);
CREATE INDEX IF NOT EXISTS idx_hellos_from_user ON hellos(from_user);
CREATE INDEX IF NOT EXISTS idx_hellos_to_handle ON hellos(to_handle);
CREATE INDEX IF NOT EXISTS idx_hellos_status ON hellos(status);
CREATE INDEX IF NOT EXISTS idx_intros_a_user ON introductions(a_user);
CREATE INDEX IF NOT EXISTS idx_intros_b_user ON introductions(b_user);
```

#### Using Neon Database

1. Go to https://neon.tech and create an account
2. Create a new project
3. Copy the connection string
4. Update `DATABASE_URL` and `NEON_DATABASE_URL` in `.env`
5. Run the SQL schema above in the Neon SQL Editor

### Step 5: Start Development Server

```bash
npm run dev
```

The app will be available at http://localhost:4000 (or the port specified in .env)

## Testing

### Run All Tests
```bash
npm run test
```

### Run Component Tests Only
```bash
npm run test:ui
```

### Run API Tests Only
```bash
npm run test:api
```

### Watch Mode
```bash
npm run test:watch
```

## Building for Production

### Step 1: Build the Application
```bash
npm run build
```

This creates optimized production files in the `build/` directory.

### Step 2: Start Production Server
```bash
npm run start
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `NEON_DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`

### Option 2: Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod
```

3. Configure environment variables in Netlify dashboard

### Option 3: Docker

Create `Dockerfile`:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .
RUN npm run build

EXPOSE 3005

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t hello-app .
docker run -p 3005:3005 --env-file .env hello-app
```

### Option 4: Traditional VPS

1. SSH into your server
2. Clone the repository
3. Install Node.js and npm
4. Follow local setup steps
5. Use PM2 for process management:

```bash
npm install -g pm2
pm2 start npm --name "hello-app" -- start
pm2 save
pm2 startup
```

## Environment-Specific Configuration

### Development
```env
NODE_ENV=development
PORT=3005
DATABASE_URL=postgresql://localhost:5432/hello_dev
```

### Staging
```env
NODE_ENV=staging
PORT=3005
DATABASE_URL=postgresql://staging-host:5432/hello_staging
```

### Production
```env
NODE_ENV=production
PORT=3005
DATABASE_URL=postgresql://prod-host:5432/hello_prod
JWT_SECRET=<strong-secret-key>
```

## Database Migrations

### Manual Migration

Run SQL scripts directly in your database:
```bash
psql $DATABASE_URL -f migrations/001_initial_schema.sql
```

### Automated Migration (Future)

Consider adding a migration tool like:
- node-pg-migrate
- Prisma
- Knex.js

## Monitoring and Logging

### Recommended Tools
- **Application Monitoring**: Sentry, LogRocket
- **Performance**: New Relic, Datadog
- **Uptime**: UptimeRobot, Pingdom
- **Analytics**: Google Analytics, Plausible

### Basic Logging Setup
```javascript
// In production, use a proper logging library
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info'
});

export default logger;
```

## Security Checklist

### Before Production Deployment
- [ ] Use strong JWT secret
- [ ] Enable HTTPS/TLS
- [ ] Set up CORS properly
- [ ] Add rate limiting
- [ ] Enable security headers
- [ ] Validate all inputs
- [ ] Use parameterized queries
- [ ] Keep dependencies updated
- [ ] Enable database SSL
- [ ] Set up backup strategy

## Performance Optimization

### Database
- [ ] Add appropriate indexes
- [ ] Enable connection pooling
- [ ] Use read replicas for scaling
- [ ] Cache frequent queries

### Frontend
- [ ] Enable code splitting
- [ ] Optimize images
- [ ] Use CDN for static assets
- [ ] Enable compression (gzip/brotli)
- [ ] Implement service worker

### Backend
- [ ] Use Redis for session storage
- [ ] Implement API response caching
- [ ] Enable HTTP/2
- [ ] Use load balancer for scale

## Backup Strategy

### Database Backups
```bash
# Daily backup cron job
0 2 * * * pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Application Backups
- Use Git for code versioning
- Store environment configs securely
- Document all manual configurations

## Troubleshooting

### Common Deployment Issues

#### Database Connection Fails
```
Error: No database connection string was provided
```
**Solution**: Verify `DATABASE_URL` is set correctly in production environment

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use
```
**Solution**: Change `PORT` environment variable or stop conflicting process

#### Build Fails
```
Error: Cannot find module
```
**Solution**: Run `npm install` and ensure all dependencies are listed in package.json

#### SSL Certificate Errors
```
Error: unable to verify the first certificate
```
**Solution**: Add `?sslmode=require` to database URL or set `NODE_TLS_REJECT_UNAUTHORIZED=0` (not recommended for production)

### Health Check Endpoint

Use the health check endpoint to verify deployment:
```bash
curl http://your-domain.com/api/health
```

Expected response:
```json
{
  "ok": true,
  "db": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx, HAProxy)
- Deploy multiple instances
- Use Redis for shared sessions
- Implement sticky sessions if needed

### Vertical Scaling
- Upgrade server resources
- Optimize database queries
- Implement caching layers
- Use CDN for static assets

## Maintenance

### Regular Tasks
- **Daily**: Monitor error logs
- **Weekly**: Review performance metrics
- **Monthly**: Update dependencies
- **Quarterly**: Security audit
- **Annually**: Architecture review

### Update Process
```bash
# Backup database
pg_dump $DATABASE_URL > backup.sql

# Pull latest changes
git pull origin main

# Update dependencies
npm install

# Run tests
npm run test

# Build
npm run build

# Deploy
npm run start
```

## Support Resources

### Documentation
- [React Router v7 Docs](https://reactrouter.com/)
- [Neon Database Docs](https://neon.tech/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)

### Community
- GitHub Issues
- Stack Overflow
- Discord/Slack communities

## Rollback Strategy

If deployment fails:
```bash
# 1. Revert to previous Git commit
git revert HEAD

# 2. Rebuild and redeploy
npm run build
npm run start

# 3. Restore database if needed
psql $DATABASE_URL < backup.sql
```

## Cost Estimation

### Free Tier (Development)
- Neon Database: Free tier (0.5GB)
- Vercel: Free tier (100GB bandwidth)
- Total: $0/month

### Production (Small)
- Neon Database: Pro tier (~$19/month)
- Vercel: Pro tier (~$20/month)
- Monitoring: Free tier
- Total: ~$40/month

### Production (Medium)
- Neon Database: Business tier (~$69/month)
- Vercel: Team tier (~$80/month)
- Monitoring: Paid tier (~$29/month)
- Total: ~$180/month

## Success Criteria

Deployment is successful when:
- [ ] Health check returns 200 OK
- [ ] User can complete onboarding
- [ ] Database queries execute successfully
- [ ] All API endpoints respond
- [ ] No console errors
- [ ] Tests pass in production
- [ ] Monitoring is active
- [ ] Backups are configured

---

**Deployment Status**: Ready for staging deployment ✅  
**Production Ready**: Requires security hardening  
**Estimated Setup Time**: 1-2 hours

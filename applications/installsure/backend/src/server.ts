import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { z } from 'zod';

// Configuration
const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '8000', 10),
  CORS_ORIGINS: process.env.CORS_ORIGINS?.split(',').map((o) => o.trim()) || [
    'http://localhost:3000',
  ],
  DATABASE_URL: process.env.DATABASE_URL,
  FORGE_CLIENT_ID: process.env.FORGE_CLIENT_ID,
  FORGE_CLIENT_SECRET: process.env.FORGE_CLIENT_SECRET,
  FORGE_BASE_URL: process.env.FORGE_BASE_URL || 'https://developer.api.autodesk.com',
  FORGE_BUCKET: process.env.FORGE_BUCKET,
};

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: config.CORS_ORIGINS,
    credentials: true,
  }),
);
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/temp';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.ifc', '.dwg', '.rvt', '.step', '.obj', '.gltf', '.glb'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`));
    }
  },
});

// Health endpoints
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    environment: config.NODE_ENV,
  });
});

app.get('/livez', (req, res) => {
  res.json({ status: 'alive' });
});

app.get('/readyz', (req, res) => {
  // Simple readiness check - in production, check database, Redis, etc.
  res.json({ status: 'ready' });
});

// Projects endpoints
app.get('/api/projects', (req, res) => {
  res.json([]);
});

const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

app.post('/api/projects', (req, res) => {
  try {
    const data = projectSchema.parse(req.body);
    const project = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description || '',
      created_at: new Date().toISOString(),
    };
    res.status(201).json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// File upload endpoint
app.post('/api/files/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Clean up temp file
  fs.unlink(req.file.path, (err) => {
    if (err) console.error('Failed to delete temp file:', err);
  });

  const file = {
    id: Date.now().toString(),
    original_name: req.file.originalname,
    file_size: req.file.size,
    mime_type: req.file.mimetype,
    created_at: new Date().toISOString(),
  };

  res.status(201).json(file);
});

// Forge/AutoCAD endpoints
app.post('/api/autocad/auth', (req, res) => {
  if (!config.FORGE_CLIENT_ID || !config.FORGE_CLIENT_SECRET) {
    return res.status(400).json({
      error: 'FORGE_CLIENT_ID/SECRET missing',
      message: 'Configure Forge credentials to enable this feature',
    });
  }
  res.json({ token: 'mock-token', expires_in: 3600 });
});

app.post('/api/autocad/upload', (req, res) => {
  if (!config.FORGE_CLIENT_ID || !config.FORGE_CLIENT_SECRET) {
    return res.status(400).json({
      error: 'FORGE_CLIENT_ID/SECRET missing',
      message: 'Configure Forge credentials to enable this feature',
    });
  }
  res.json({ objectId: 'mock-object-id', bucketKey: config.FORGE_BUCKET || 'installsure-dev' });
});

app.post('/api/autocad/translate', (req, res) => {
  if (!config.FORGE_CLIENT_ID || !config.FORGE_CLIENT_SECRET) {
    return res.status(400).json({
      error: 'FORGE_CLIENT_ID/SECRET missing',
      message: 'Configure Forge credentials to enable this feature',
    });
  }
  res.json({ jobId: 'mock-job-id', urn: 'mock-urn' });
});

app.get('/api/autocad/manifest/:urn', (req, res) => {
  if (!config.FORGE_CLIENT_ID || !config.FORGE_CLIENT_SECRET) {
    return res.status(400).json({
      error: 'FORGE_CLIENT_ID/SECRET missing',
      message: 'Configure Forge credentials to enable this feature',
    });
  }
  res.json({ status: 'success', derivatives: [] });
});

app.get('/api/autocad/properties/:urn', (req, res) => {
  if (!config.FORGE_CLIENT_ID || !config.FORGE_CLIENT_SECRET) {
    return res.status(400).json({
      error: 'FORGE_CLIENT_ID/SECRET missing',
      message: 'Configure Forge credentials to enable this feature',
    });
  }
  res.json({ properties: [] });
});

app.get('/api/autocad/takeoff/:urn', (req, res) => {
  if (!config.FORGE_CLIENT_ID || !config.FORGE_CLIENT_SECRET) {
    return res.status(400).json({
      error: 'FORGE_CLIENT_ID/SECRET missing',
      message: 'Configure Forge credentials to enable this feature',
    });
  }
  res.json({ areas: [], lengths: [] });
});

// QuickBooks endpoint
app.get('/api/qb/health', (req, res) => {
  res.json({
    ok: true,
    connected: false,
    message: 'QuickBooks integration not configured',
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔧 Environment: ${config.NODE_ENV}`);
});

export default app;

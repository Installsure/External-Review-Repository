import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Try to load pdf-parse (optional)
let pdfParse = null;
try {
  const pdfParseModule = await import('pdf-parse');
  pdfParse = pdfParseModule.default;
} catch (e) {
  console.log('⚠️  pdf-parse not available (text extraction disabled)');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const PG_URL = process.env.PG_URL || null;

// Database setup
let db = { enabled: false };
if (PG_URL) {
  try {
    const pg = await import('pg');
    const { Pool } = pg.default;
    db.pool = new Pool({ connectionString: PG_URL });
    db.enabled = true;
    console.log('✓ Using Neon Postgres for storage');
  } catch (e) {
    console.error('PG init error:', e.message);
    console.log('✗ Falling back to local JSON storage');
  }
} else {
  console.log('✓ Using local JSON storage (no PG_URL set)');
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/static', express.static(path.join(__dirname, 'public')));

// Ensure uploads directory exists
const UP = path.join(__dirname, 'uploads');
if (!fs.existsSync(UP)) {
  fs.mkdirSync(UP, { recursive: true });
}

const upload = multer({ dest: UP });

// Ensure database schema if using Postgres
async function ensureSchema() {
  if (!db.enabled) return;
  const sql = `
    create table if not exists tags(
      id bigserial primary key,
      project_id text not null,
      tag_type text not null,
      note text,
      page int,
      x double precision not null,
      y double precision not null,
      created_at timestamptz default now()
    );
    create table if not exists documents(
      id bigserial primary key,
      project_id text not null,
      doc_type text not null,
      title text not null,
      url text,
      content text,
      created_at timestamptz default now()
    );
  `;
  try {
    await db.pool.query(sql);
    console.log('✓ Database schema ready');
  } catch (err) {
    console.error('Schema creation error:', err.message);
  }
}
ensureSchema().catch(console.error);

// Health check endpoint
app.get('/health', async (req, res) => {
  const payload = { ok: true, db: db.enabled ? 'pg' : 'local' };
  if (db.enabled) {
    try {
      const r = await db.pool.query('select 1 as ok');
      payload.db_ok = r.rows[0].ok === 1;
    } catch (e) {
      payload.db_ok = false;
      payload.db_err = e.message;
    }
  }
  res.json(payload);
});

// Upload document endpoint
app.post('/api/docs/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false, error: 'No file' });

  // Try to extract text from PDF (if pdf-parse is available)
  let text = null;
  if (pdfParse) {
    try {
      if (req.file.mimetype === 'application/pdf') {
        const data = await pdfParse(fs.readFileSync(req.file.path));
        text = data && data.text ? data.text.slice(0, 1000) : null;
      }
    } catch (_) {
      // PDF parse failed, continue without text
    }
  }

  if (db.enabled) {
    try {
      await db.pool.query(
        'insert into documents(project_id, doc_type, title, url, content) values($1,$2,$3,$4,$5)',
        ['demo', 'plan', req.file.originalname, `/uploads/${req.file.filename}`, text]
      );
    } catch (e) {
      console.error('DB insert doc failed:', e.message);
    }
  } else {
    // ensure a simple manifest
    const man = path.join(UP, 'manifest.json');
    let state = { docs: [] };
    if (fs.existsSync(man)) {
      try {
        state = JSON.parse(fs.readFileSync(man, 'utf8'));
      } catch (_) {}
    }
    state.docs.push({
      title: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      text,
    });
    fs.writeFileSync(man, JSON.stringify(state, null, 2));
  }
  res.json({ ok: true, path: `/uploads/${req.file.filename}` });
});

// Serve uploaded files
app.use('/uploads', express.static(UP));

// Get tags endpoint
app.get('/api/tags', async (req, res) => {
  if (db.enabled) {
    try {
      const r = await db.pool.query(
        'select project_id, tag_type, note, page, x, y, created_at from tags where project_id=$1 order by created_at desc limit 500',
        ['demo']
      );
      res.json({ ok: true, rows: r.rows });
    } catch (e) {
      res.status(500).json({ ok: false, error: e.message });
    }
  } else {
    const p = path.join(__dirname, 'tags.local.json');
    const rows = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : [];
    res.json({ ok: true, rows });
  }
});

// Create tag endpoint
app.post('/api/tags', async (req, res) => {
  const t = req.body;
  if (!t || !t.tag_type || typeof t.x !== 'number' || typeof t.y !== 'number') {
    return res.status(400).json({ ok: false, error: 'Invalid tag' });
  }
  if (db.enabled) {
    try {
      await db.pool.query(
        'insert into tags(project_id, tag_type, note, page, x, y) values($1,$2,$3,$4,$5,$6)',
        ['demo', t.tag_type, t.note || null, t.page || 1, t.x, t.y]
      );
    } catch (e) {
      return res.status(500).json({ ok: false, error: e.message });
    }
  } else {
    const p = path.join(__dirname, 'tags.local.json');
    const rows = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : [];
    rows.unshift({
      project_id: 'demo',
      tag_type: t.tag_type,
      note: t.note || '',
      page: t.page || 1,
      x: t.x,
      y: t.y,
      created_at: new Date().toISOString(),
    });
    fs.writeFileSync(p, JSON.stringify(rows, null, 2));
  }
  res.json({ ok: true });
});

// Serve frontend
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  InstallSure Rescue - Blueprint Tagging System');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  🚀 Running on http://localhost:${PORT}`);
  console.log(`  💾 Storage: ${db.enabled ? 'Neon Postgres' : 'Local JSON'}`);
  console.log(`  📁 Uploads: ${UP}`);
  console.log('═══════════════════════════════════════════════════════');
  console.log('  Ready to upload blueprints and create tags!');
  console.log('═══════════════════════════════════════════════════════');
});

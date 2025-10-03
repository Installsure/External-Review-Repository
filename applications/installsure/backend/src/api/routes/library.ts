import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { db } from '../../data/db.js';
import { logger } from '../../infra/logger.js';

const router = Router();
const MANIFEST = path.resolve(process.cwd(), 'sample-library.manifest.json');
const PUB_PREFIX = '/library';

async function ensureTables(): Promise<void> {
  await db.query(`
    CREATE TABLE IF NOT EXISTS project_documents (
      id SERIAL PRIMARY KEY,
      project_id TEXT,
      doc_type TEXT,
      title TEXT,
      standard TEXT,
      category TEXT,
      status TEXT,
      path TEXT,
      payload TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS blueprints (
      id SERIAL PRIMARY KEY,
      project_id TEXT,
      name TEXT,
      sheet TEXT,
      file_path TEXT,
      width INTEGER,
      height INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

router.post('/library/ingest', async (req: Request, res: Response) => {
  const requestLogger = req.logger || logger;

  try {
    await ensureTables();

    if (!fs.existsSync(MANIFEST)) {
      return res.status(400).json({ error: 'manifest missing' });
    }

    const manifestContent = fs.readFileSync(MANIFEST, 'utf8');
    const m = JSON.parse(manifestContent);
    const projectId = m.projectId || 'DEMO';
    const items = m.items || [];

    let insertedDocs = 0;
    let insertedPlans = 0;

    for (const it of items) {
      const safeName = (it.title || 'file').replace(/[^a-z0-9\-]+/gi, '_').toLowerCase();
      const ext = (it.url || '').split('?')[0].split('.').pop()?.toLowerCase() || 'bin';
      const pubPath = `${PUB_PREFIX}/${safeName}.${ext}`;

      if (
        (it.docType || '').toLowerCase() === 'blueprint' ||
        (it.category || '').toLowerCase() === 'drawings'
      ) {
        await db.query(
          `INSERT INTO blueprints (project_id, name, sheet, file_path, width, height)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [projectId, it.title || 'Plan', it.sheet || 'A1.1', pubPath, 0, 0],
        );
        insertedPlans++;
      } else {
        await db.query(
          `INSERT INTO project_documents (project_id, doc_type, title, standard, category, status, path, payload)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            projectId,
            it.docType || 'Document',
            it.title || 'Untitled',
            it.standard || 'Std',
            it.category || 'Docs',
            'Imported',
            pubPath,
            JSON.stringify({ tags: it.tags || [], source: 'online' }),
          ],
        );
        insertedDocs++;
      }
    }

    requestLogger.info({ insertedDocs, insertedPlans }, 'Library ingestion completed');
    res.json({ ok: true, insertedDocs, insertedPlans });
  } catch (error: any) {
    requestLogger.error({ error: error.message }, 'Library ingestion failed');
    res.status(500).json({ error: error.message });
  }
});

export default router;

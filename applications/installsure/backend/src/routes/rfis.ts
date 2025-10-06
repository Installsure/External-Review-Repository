import { Router, Request, Response } from 'express';
import { db } from '../services/db.js';

const router = Router();

// Create rfis table if not exists
const initRfisTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS rfis (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status VARCHAR(50) DEFAULT 'open',
      project_id INTEGER REFERENCES projects(id),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
};

// Initialize table on startup
initRfisTable().catch(console.error);

router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await db.query('SELECT * FROM rfis ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching RFIs:', error);
    res.status(500).json({ error: 'Failed to fetch RFIs' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM rfis WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'RFI not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching RFI:', error);
    res.status(500).json({ error: 'Failed to fetch RFI' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, status = 'open', project_id } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await db.query(
      'INSERT INTO rfis (title, description, status, project_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, status, project_id],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating RFI:', error);
    res.status(500).json({ error: 'Failed to create RFI' });
  }
});

export default router;

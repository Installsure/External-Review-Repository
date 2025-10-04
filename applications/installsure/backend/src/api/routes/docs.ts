import { Router } from 'express';
import {
  ingestAIALibrary,
  createRFI,
  createChangeOrder,
  processResidentialDemo,
} from '../../services/documentService.js';
import type { RFIRequest, ChangeOrderRequest } from '../../types/documents.js';

const router = Router();

/**
 * POST /api/docs/ingestAIA
 * Ingest AIA library documents from manifest
 */
router.post('/ingestAIA', async (req, res) => {
  try {
    const result = await ingestAIALibrary();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      error: error.message || 'Internal server error',
    });
  }
});

/**
 * POST /api/docs/rfi
 * Create a Request for Information document
 */
router.post('/rfi', (req, res) => {
  try {
    const body: RFIRequest = req.body;
    
    if (!body.project || !body.title || !body.question) {
      return res.status(400).json({
        ok: false,
        error: 'Missing required fields: project, title, question',
      });
    }

    const result = createRFI(body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      error: error.message || 'Internal server error',
    });
  }
});

/**
 * POST /api/docs/co
 * Create a Change Order document
 */
router.post('/co', (req, res) => {
  try {
    const body: ChangeOrderRequest = req.body;
    
    if (!body.project || !body.desc) {
      return res.status(400).json({
        ok: false,
        error: 'Missing required fields: project, desc',
      });
    }

    const result = createChangeOrder(body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      error: error.message || 'Internal server error',
    });
  }
});

export default router;

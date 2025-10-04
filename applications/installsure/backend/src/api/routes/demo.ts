import { Router } from 'express';
import { processResidentialDemo } from '../../services/documentService.js';

const router = Router();

/**
 * POST /api/demo/residential
 * Process residential demo: download plan, generate RFI/CO from tags
 */
router.post('/residential', async (req, res) => {
  try {
    const result = await processResidentialDemo();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      error: error.message || 'Internal server error',
    });
  }
});

export default router;

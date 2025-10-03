import { Router, Request, Response } from 'express';
import { logger } from '../../infra/logger.js';

const router = Router();

type Assembly = "paint_wall" | "concrete_slab";

interface QTORequest {
  assembly: Assembly;
  params: Record<string, number>;
}

interface QTOResult {
  quantity: number;
  unit: string;
  cost: number;
}

// POST /api/qto-demo - Run QTO calculation
router.post('/', (req: Request, res: Response) => {
  const requestLogger = req.logger || logger;

  try {
    const { assembly, params } = req.body as QTORequest;

    requestLogger.debug({ assembly, params }, 'QTO demo calculation requested');

    let result: QTOResult;

    if (assembly === "paint_wall") {
      const area = (params.length || 10) * (params.height || 3); // m²
      const cost = area * (params.unitCost || 2.5);              // $/m²
      result = { quantity: area, unit: "m2", cost: Math.round(cost * 100) / 100 };
    } else if (assembly === "concrete_slab") {
      const volume = (params.length || 5) * (params.width || 5) * (params.thickness || 0.1); // m³
      const cost = volume * (params.unitCost || 120);                                        // $/m³
      result = { quantity: volume, unit: "m3", cost: Math.round(cost * 100) / 100 };
    } else {
      result = { quantity: 0, unit: "", cost: 0 };
    }

    requestLogger.debug({ result }, 'QTO demo calculation completed');

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    requestLogger.error({ error }, 'QTO demo calculation failed');
    res.status(500).json({
      success: false,
      error: 'Failed to calculate QTO',
    });
  }
});

export default router;

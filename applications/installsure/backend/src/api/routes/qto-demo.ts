import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { z } from 'zod';

const router = Router();

// QTO Demo Schema
const qtoDemoSchema = z.object({
  assembly: z.enum(['paint_wall', 'concrete_slab']),
  inputs: z.record(z.number()),
});

// POST /api/qto-demo - Calculate quantity takeoff
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { assembly, inputs } = qtoDemoSchema.parse(req.body);
    
    let result = { quantity: 0, unit: '', cost: 0 };

    if (assembly === 'paint_wall') {
      const length = inputs.length || 10;
      const height = inputs.height || 3;
      const unitCost = inputs.unitCost || 2.5;
      
      const area = length * height; // m²
      const cost = area * unitCost;  // $/m²
      
      result = {
        quantity: area,
        unit: 'm2',
        cost: Math.round(cost * 100) / 100,
      };
    } else if (assembly === 'concrete_slab') {
      const length = inputs.length || 5;
      const width = inputs.width || 5;
      const thickness = inputs.thickness || 0.1;
      const unitCost = inputs.unitCost || 120;
      
      const volume = length * width * thickness; // m³
      const cost = volume * unitCost;            // $/m³
      
      result = {
        quantity: volume,
        unit: 'm3',
        cost: Math.round(cost * 100) / 100,
      };
    }

    res.json({
      success: true,
      data: result,
    });
  }),
);

export default router;

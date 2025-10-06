import { Router } from 'express';
import healthRoutes from './health.js';
import projectRoutes from './projects.js';
import fileRoutes from './files.js';
import forgeRoutes from './forge.js';
import qbRoutes from './qb.js';
import rfiRoutes from './rfis.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/projects', projectRoutes);
router.use('/files', fileRoutes);
router.use('/autocad', forgeRoutes);
router.use('/qb', qbRoutes);
router.use('/rfis', rfiRoutes);

export default router;

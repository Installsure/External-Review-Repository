import { Router } from 'express';
const router = Router();
router.get('/health', (req, res) => {
    res.json({
        ok: true,
        connected: false,
        message: 'QuickBooks integration placeholder',
    });
});
export default router;
//# sourceMappingURL=qb.js.map
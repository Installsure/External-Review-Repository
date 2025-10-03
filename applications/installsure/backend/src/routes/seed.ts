import { Router } from 'express';
const router = Router();

// Initialize global.db if it doesn't exist
if (!globalThis.db) {
  globalThis.db = {
    blueprints: [],
    docs: [],
    workforce: [],
  };
}

router.post('/blueprints/seed', (req, res) => {
  // Insert local fallback blueprint
  globalThis.db.blueprints = [
    {
      id: 'bp-001',
      name: 'Sample Plan A',
      urn: 'urn:demo:plan1',
      sheetPath: '/demo-assets/plan1.svg',
    },
  ];
  res.json({ ok: true });
});

router.post('/docs/seed', (req, res) => {
  globalThis.db.docs = [
    { id: 'doc-001', type: 'Contract', title: 'Sample AIA Contract' },
    { id: 'doc-002', type: 'Lien', title: 'Sample Lien Waiver' },
    { id: 'doc-003', type: 'Report', title: 'Safety Report' },
  ];
  res.json({ ok: true });
});

router.post('/workforce/seed', (req, res) => {
  globalThis.db.workforce = [
    {
      id: 'wf-001',
      title: 'Orientation Checklist',
      content: 'Basic worker orientation steps',
    },
    { id: 'wf-002', title: 'Safety Training', content: 'Sample training doc' },
  ];
  res.json({ ok: true });
});

export default router;

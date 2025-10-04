import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import * as path from 'path';
import axios from 'axios';
import type {
  AIALibraryManifest,
  ResidentialPlanManifest,
  RFIRequest,
  RFIResponse,
  ChangeOrderRequest,
  ChangeOrderResponse,
  IngestAIAResponse,
  ResidentialDemoResponse,
} from '../types/documents.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const LIBRARY_DIR = path.join(process.cwd(), '../frontend/public/library');

// Ensure directories exist
if (!fsSync.existsSync(DATA_DIR)) {
  fsSync.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fsSync.existsSync(LIBRARY_DIR)) {
  fsSync.mkdirSync(LIBRARY_DIR, { recursive: true });
}

function slug(s: string): string {
  return (s || 'doc').toLowerCase().replace(/[^a-z0-9-]+/g, '_');
}

export async function ingestAIALibrary(): Promise<IngestAIAResponse> {
  const manifestPath = path.join(process.cwd(), '../../../aia-library.manifest.json');
  
  if (!fsSync.existsSync(manifestPath)) {
    return { ok: false, error: 'aia-library.manifest.json missing' };
  }

  try {
    const manifestContent = fsSync.readFileSync(manifestPath, 'utf-8');
    const manifest: AIALibraryManifest = JSON.parse(manifestContent);
    const items = manifest.items || [];
    const saved: Array<{ title: string; public?: string; error?: string }> = [];

    for (const item of items) {
      const url = item.url;
      const title = item.title;

      if (!url || url.includes('YOUR-LICENSED-LINK')) {
        continue;
      }

      try {
        const response = await axios.get(url, {
          timeout: 30000,
          responseType: 'arraybuffer',
        });

        if (response.status === 200) {
          const urlParts = url.split('?')[0].split('.');
          let ext = urlParts[urlParts.length - 1].toLowerCase();
          if (!['pdf', 'png', 'jpg', 'jpeg', 'svg'].includes(ext)) {
            ext = 'pdf';
          }

          const filename = `${slug(title)}.${ext}`;
          const filepath = path.join(LIBRARY_DIR, filename);
          fsSync.writeFileSync(filepath, response.data);

          saved.push({
            title,
            public: `/library/${filename}`,
          });
        }
      } catch (error: any) {
        saved.push({
          title,
          error: error.message || 'Download failed',
        });
      }
    }

    return { ok: true, count: saved.length, items: saved };
  } catch (error: any) {
    return { ok: false, error: error.message || 'Failed to process manifest' };
  }
}

function generateRFIBody(data: RFIRequest): string {
  return `PROJECT: ${data.project || 'DEMO'}
RFI NO.: ${data.sheet || '001'}
SHEET: ${data.sheet || ''}
SUBJECT: ${data.title || 'Request for Information'}
QUESTION:
${data.question || ''}

REFERENCE: ${data.reference || ''}
PROPOSED ANSWER (DRAFT):
${data.proposed || 'TBD'}
RESPONSE DUE: ${data.due || '5 business days'}
`;
}

function generateCOBody(data: ChangeOrderRequest): string {
  return `PROJECT: ${data.project || 'DEMO'}
CHANGE ORDER NO.: ${data.co_no || 'CO-001'}
DESCRIPTION: ${data.desc || 'Scope change'}
COST IMPACT: ${data.cost || '$0.00'}
TIME IMPACT (DAYS): ${data.time || '0'}
REASON: ${data.reason || 'Owner request'}
AUTHORIZATION: PENDING
`;
}

export function createRFI(body: RFIRequest): RFIResponse {
  const text = generateRFIBody(body);
  const rfi_id = `rfi-${Date.now()}`;
  const filepath = path.join(DATA_DIR, `${rfi_id}.txt`);
  
  fsSync.writeFileSync(filepath, text, 'utf-8');
  
  return {
    ok: true,
    rfi_id,
    path: `data/${rfi_id}.txt`,
  };
}

export function createChangeOrder(body: ChangeOrderRequest): ChangeOrderResponse {
  const text = generateCOBody(body);
  const co_id = `co-${Date.now()}`;
  const filepath = path.join(DATA_DIR, `${co_id}.txt`);
  
  fsSync.writeFileSync(filepath, text, 'utf-8');
  
  return {
    ok: true,
    co_id,
    path: `data/${co_id}.txt`,
  };
}

export async function processResidentialDemo(): Promise<ResidentialDemoResponse> {
  const manifestPath = path.join(process.cwd(), '../../../residential-plan.manifest.json');
  
  if (!fsSync.existsSync(manifestPath)) {
    return { ok: false, error: 'residential-plan.manifest.json missing' };
  }

  try {
    const manifestContent = fsSync.readFileSync(manifestPath, 'utf-8');
    const manifest: ResidentialPlanManifest = JSON.parse(manifestContent);
    const planUrl = manifest.planUrl;

    // Download plan if URL is valid
    if (planUrl && !planUrl.includes('YOUR-PUBLIC-PLAN-URL')) {
      try {
        const response = await axios.get(planUrl, {
          timeout: 30000,
          responseType: 'arraybuffer',
        });

        if (response.status === 200) {
          const planPath = path.join(LIBRARY_DIR, 'residential_plan.pdf');
          fsSync.writeFileSync(planPath, response.data);
        }
      } catch (error) {
        // Silently fail if plan download fails
      }
    }

    // Process tags to generate RFI and CO
    const results: Array<RFIResponse | ChangeOrderResponse> = [];
    
    for (const tag of manifest.tags || []) {
      if (tag.type === 'RFI') {
        const rfi = createRFI({
          project: manifest.projectId || 'DEMO-RESI',
          sheet: tag.sheet,
          title: tag.title,
          question: tag.body,
          reference: tag.sheet,
          proposed: 'Pending review',
          due: '5 business days',
        });
        results.push(rfi);
      } else if (tag.type === 'CO') {
        const co = createChangeOrder({
          project: manifest.projectId || 'DEMO-RESI',
          desc: tag.title,
          cost: '$1,500.00',
          time: '0',
          reason: 'Owner upgrade',
          co_no: 'CO-001',
        });
        results.push(co);
      }
    }

    // Create QTO stub
    const qtoStub = {
      source: 'QTO',
      text: 'Residential QTO Stub: walls=220 sheets drywall, studs=500 pcs, insulation=R-38 1200sf',
    };
    const qtoPath = path.join(DATA_DIR, 'residential_qto_stub.json');
    fsSync.writeFileSync(qtoPath, JSON.stringify(qtoStub, null, 2), 'utf-8');

    // Save demo results
    const demoResult = {
      ok: true,
      docs: results,
    };
    const demoPath = path.join(DATA_DIR, 'residential_demo.json');
    fsSync.writeFileSync(demoPath, JSON.stringify(demoResult, null, 2), 'utf-8');

    return {
      ok: true,
      docs: results,
      plan: '/library/residential_plan.pdf',
    };
  } catch (error: any) {
    return { ok: false, error: error.message || 'Failed to process residential demo' };
  }
}

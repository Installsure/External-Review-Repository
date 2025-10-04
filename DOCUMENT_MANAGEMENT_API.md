# Document Management API - AIA Library, RFI/CO Processors, and Residential Demo

This extension adds document management capabilities to the InstallSure backend, including:
- AIA-style library document ingestion
- RFI (Request for Information) generation
- Change Order generation
- Residential plan demo workflow

## Features

### 1. AIA Library Ingestion
Ingest AIA-style documents (forms, templates) from a manifest file. Documents must be legally licensed or accessible.

**Endpoint:** `POST /api/docs/ingestAIA`

**Configuration:** Edit `aia-library.manifest.json` at the repository root to add your licensed document URLs.

### 2. RFI Creation
Generate Request for Information documents with AIA-like formatting.

**Endpoint:** `POST /api/docs/rfi`

**Request Body:**
```json
{
  "project": "Project Name",
  "sheet": "A1.1",
  "title": "RFI Title",
  "question": "The question being asked",
  "reference": "Reference document/sheet",
  "proposed": "Proposed answer",
  "due": "5 business days"
}
```

**Response:**
```json
{
  "ok": true,
  "rfi_id": "rfi-1234567890",
  "path": "data/rfi-1234567890.txt"
}
```

### 3. Change Order Creation
Generate Change Order documents with cost and time impact tracking.

**Endpoint:** `POST /api/docs/co`

**Request Body:**
```json
{
  "project": "Project Name",
  "desc": "Description of change",
  "cost": "$1,500.00",
  "time": "3",
  "reason": "Owner request",
  "co_no": "CO-001"
}
```

**Response:**
```json
{
  "ok": true,
  "co_id": "co-1234567890",
  "path": "data/co-1234567890.txt"
}
```

### 4. Residential Demo
End-to-end workflow that processes a residential plan and generates RFIs and COs from tagged items.

**Endpoint:** `POST /api/demo/residential`

**Configuration:** Edit `residential-plan.manifest.json` at the repository root to set your public plan URL and tags.

**Response:**
```json
{
  "ok": true,
  "docs": [
    { "ok": true, "rfi_id": "rfi-123", "path": "..." },
    { "ok": true, "co_id": "co-456", "path": "..." }
  ],
  "plan": "/library/residential_plan.pdf"
}
```

## Setup

### 1. Configure Manifests

Edit `aia-library.manifest.json` in the repository root:
```json
{
  "notes": "Add URLs you have rights to use",
  "items": [
    {
      "docType": "ChangeOrder",
      "title": "AIA G701 – Change Order",
      "url": "https://your-licensed-url/g701.pdf"
    }
  ]
}
```

Edit `residential-plan.manifest.json` in the repository root:
```json
{
  "projectId": "DEMO-RESI",
  "planUrl": "https://your-public-plan-url/plan.pdf",
  "tags": [
    {
      "id": "T-100",
      "sheet": "A1.1",
      "title": "Wall type question",
      "body": "Confirm wall specifications",
      "type": "RFI"
    }
  ]
}
```

### 2. Directory Structure

The following directories are automatically created:
- `applications/installsure/backend/data/` - Stores generated RFI/CO documents
- `applications/installsure/frontend/public/library/` - Stores downloaded library documents

### 3. Testing

Run the test script to verify all endpoints:

**Bash (Linux/Mac):**
```bash
./scripts/test-document-api.sh
```

**PowerShell (Windows):**
```powershell
.\scripts\test-document-api.ps1
```

## Frontend Integration

The frontend API client (`applications/installsure/frontend/src/lib/api.ts`) has been extended with methods:

```typescript
// Ingest AIA library
await api.ingestAIALibrary();

// Create RFI
await api.createRFI({
  project: "MyProject",
  title: "Question about walls",
  question: "What type of walls?",
  // ... other fields
});

// Create Change Order
await api.createChangeOrder({
  project: "MyProject",
  desc: "Add extra insulation",
  cost: "$2,000",
  // ... other fields
});

// Run residential demo
await api.processResidentialDemo();
```

## Notes

- **Copyright Compliance**: Only use URLs for documents you have legal rights to access. The system does not bypass paywalls or access restricted content.
- **Document Storage**: Generated documents are stored as text files in the `data/` directory.
- **Library Access**: Downloaded library documents are served from `/library/` path in the frontend.
- **Non-Infringing**: RFI and CO formats are AIA-style (inspired by AIA standards) but do not reproduce copyrighted AIA forms verbatim.

## File Locations

- **Backend Routes:** 
  - `src/api/routes/docs.ts` - RFI and CO endpoints
  - `src/api/routes/demo.ts` - Residential demo endpoint
- **Backend Service:** `src/services/documentService.ts`
- **Backend Types:** `src/types/documents.ts`
- **Frontend Types:** `src/types/api.ts`
- **Frontend API:** `src/lib/api.ts`
- **Test Scripts:**
  - `scripts/test-document-api.sh` (Bash)
  - `scripts/test-document-api.ps1` (PowerShell)
- **Manifests:**
  - `aia-library.manifest.json` (repository root)
  - `residential-plan.manifest.json` (repository root)

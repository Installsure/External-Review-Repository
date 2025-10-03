# Online Sample Library - InstallSure

This feature allows you to download sample construction documents from online sources and integrate them into the InstallSure application for testing and demonstration purposes.

## 🎯 What This Feature Provides

1. **Document Management**: Download and organize sample construction documents (RFIs, submittals, change orders, etc.)
2. **Blueprint Viewer**: Display PDF plans and drawings with PDF.js rendering
3. **Database Integration**: Automatically index documents into PostgreSQL database
4. **Frontend UI**: Browse blueprints and documents with tagging and categorization

## 📋 Features

- ✅ Download construction documents from public URLs
- ✅ Support for multiple document types (Blueprints, RFIs, Submittals, Change Orders, etc.)
- ✅ PDF rendering in the browser using PDF.js
- ✅ Image support (PNG, JPG, SVG)
- ✅ Database storage with metadata (tags, categories, standards)
- ✅ Cross-platform download scripts (PowerShell & Bash)
- ✅ UI pages for browsing Blueprints and Documents

## 🚀 Quick Start

### 1. Edit the Manifest

Edit `sample-library.manifest.json` and replace the placeholder URLs with actual public URLs to your sample documents:

```json
{
  "projectId": "DEMO",
  "items": [
    {
      "docType": "Blueprint",
      "title": "Plan A1.1 – Sample Floor Plan",
      "category": "Drawings",
      "standard": "Field",
      "tags": ["plan", "floor"],
      "url": "https://example.com/your-actual-plan.pdf"
    }
  ]
}
```

### 2. Download Files

**Windows (PowerShell):**
```powershell
pwsh ./scripts/fetch-sample-library.ps1
```

**macOS/Linux (Bash):**
```bash
./scripts/fetch-sample-library.sh
```

This will:
- Download files from URLs to `samples/library/`
- Copy files to `applications/installsure/frontend/public/library/`
- Generate a report at `samples/library-download-report.json`

### 3. Ingest into Database

Start the backend server if not already running:
```bash
cd applications/installsure/backend
npm run dev
```

Then ingest the downloaded files:
```bash
curl -X POST http://localhost:8000/api/library/ingest
```

Response:
```json
{
  "ok": true,
  "insertedDocs": 6,
  "insertedPlans": 1
}
```

### 4. View in UI

Start the frontend if not already running:
```bash
cd applications/installsure/frontend
npm run dev
```

Then visit:
- **Blueprints**: http://localhost:5173/blueprints - View plans and drawings with PDF rendering
- **Documents**: http://localhost:5173/docs - Browse RFIs, submittals, change orders, etc.

## 📁 Project Structure

```
External-Review-Repository/
├── sample-library.manifest.json           # Manifest with document URLs
├── samples/
│   └── library/                          # Downloaded files (gitignored)
│       └── .gitkeep
├── scripts/
│   ├── README.md                         # Detailed script documentation
│   ├── fetch-sample-library.ps1         # PowerShell download script
│   └── fetch-sample-library.sh          # Bash download script
└── applications/installsure/
    ├── backend/
    │   └── src/api/routes/
    │       └── library.ts               # /api/library/ingest endpoint
    └── frontend/
        ├── public/library/               # Served files (gitignored)
        │   └── .gitkeep
        └── src/
            ├── components/
            │   └── PdfCanvas.tsx        # PDF rendering component
            └── pages/
                ├── BlueprintsPage.tsx    # Blueprints viewer UI
                └── DocsPage.tsx          # Documents browser UI
```

## 📦 Document Types

The system supports the following document types:

| Type | Description | Storage |
|------|-------------|---------|
| `Blueprint` | Technical drawings and plans | `blueprints` table |
| `RFI` | Request for Information | `project_documents` table |
| `Submittal` | Product submittals | `project_documents` table |
| `ChangeOrder` | Change orders | `project_documents` table |
| `DailyReport` | Daily construction reports | `project_documents` table |
| `LienWaiver` | Lien waiver documents | `project_documents` table |
| `Workforce` | Workforce-related documents | `project_documents` table |

## 🛠️ Technical Details

### Backend

- **Route**: `POST /api/library/ingest`
- **Database Tables**:
  - `project_documents` - For documents (RFIs, submittals, etc.)
  - `blueprints` - For technical drawings
- **Technology**: Express.js, PostgreSQL

### Frontend

- **PDF Rendering**: PDF.js (via CDN worker)
- **Dependencies**: `pdfjs-dist@4.6.82`
- **Pages**:
  - `/blueprints` - BlueprintsPage component
  - `/docs` - DocsPage component
- **Technology**: React, TypeScript, Vite

### Download Scripts

- **PowerShell**: Compatible with Windows, macOS (with `pwsh`), Linux (with `pwsh`)
- **Bash**: Compatible with macOS, Linux (requires `jq` and `curl`)

## 🔒 Security Notes

- Downloaded files are stored locally and served statically
- Only files from URLs in the manifest are downloaded
- No authentication required for the `/api/library/ingest` endpoint (development feature)
- Downloaded files are gitignored to avoid committing large binary files

## 🐛 Troubleshooting

### Downloads fail with 404 errors
- Check that URLs in `sample-library.manifest.json` are accessible and public
- Verify the URLs point to actual files (not HTML pages)

### PDF rendering shows error
- Check browser console for errors
- Verify the PDF file was downloaded successfully
- Check that the file path is accessible at `/library/<filename>`

### Database ingestion fails
- Ensure PostgreSQL is running and connected
- Check backend logs for error details
- Verify the manifest file exists at repository root

### UI shows "No documents yet"
- Run the ingestion endpoint: `POST /api/library/ingest`
- Check that files were downloaded to `applications/installsure/frontend/public/library/`
- Verify database tables were created and populated

## 📝 Example Manifest

See `sample-library.manifest.json` for a complete example with all document types.

## 🤝 Contributing

When adding new document types:
1. Add the type to the manifest
2. Update the backend route to handle the new type
3. Update this README documentation

## 📄 License

This feature is part of the InstallSure External Review Repository.

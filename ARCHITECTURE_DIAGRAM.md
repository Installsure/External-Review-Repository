# Architecture Diagram: Online Sample Library

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Online Sample Library System                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│ 1. Configuration    │
│                     │
│  sample-library.    │
│  manifest.json      │
│  ├─ projectId       │
│  └─ items[]         │
│     ├─ docType      │
│     ├─ title        │
│     ├─ category     │
│     ├─ tags[]       │
│     └─ url          │
└─────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 2. Download Scripts                                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  PowerShell Script              Bash Script                          │
│  ┌──────────────────┐          ┌──────────────────┐                 │
│  │fetch-sample-     │          │fetch-sample-     │                 │
│  │library.ps1       │          │library.sh        │                 │
│  └──────────────────┘          └──────────────────┘                 │
│          │                              │                            │
│          └──────────────┬───────────────┘                            │
│                         ▼                                            │
│          Downloads from URLs in manifest                             │
│                         │                                            │
│          ┌──────────────┴───────────────┐                            │
│          ▼                              ▼                            │
│   samples/library/            public/library/                        │
│   └─ *.pdf, *.png            └─ *.pdf, *.png                         │
│      (local storage)            (web serving)                        │
└─────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 3. Backend API (Node.js + Express + PostgreSQL)                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  POST /api/library/ingest                                            │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ 1. Read sample-library.manifest.json                        │    │
│  │ 2. Create tables if not exist                               │    │
│  │    ├─ project_documents (RFIs, Submittals, etc)             │    │
│  │    └─ blueprints (Technical drawings)                       │    │
│  │ 3. Insert records for each manifest item                    │    │
│  │    ├─ Parse document type                                   │    │
│  │    ├─ Generate file path (/library/filename.pdf)            │    │
│  │    └─ Store metadata (tags, category, standard)             │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                         │                                            │
│                         ▼                                            │
│              ┌──────────────────────┐                                │
│              │   PostgreSQL DB      │                                │
│              ├──────────────────────┤                                │
│              │ project_documents    │                                │
│              │ ├─ id                │                                │
│              │ ├─ doc_type          │                                │
│              │ ├─ title             │                                │
│              │ ├─ path              │                                │
│              │ ├─ tags (JSON)       │                                │
│              │ └─ ...               │                                │
│              ├──────────────────────┤                                │
│              │ blueprints           │                                │
│              │ ├─ id                │                                │
│              │ ├─ name              │                                │
│              │ ├─ file_path         │                                │
│              │ └─ ...               │                                │
│              └──────────────────────┘                                │
└─────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 4. Frontend UI (React + TypeScript + Vite)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Navigation Header                                            │   │
│  │ [Dashboard] [Upload] [Blueprints] [Docs] [Reports] [Settings]│  │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌────────────────────┐           ┌────────────────────┐            │
│  │ /blueprints        │           │ /docs              │            │
│  │ BlueprintsPage     │           │ DocsPage           │            │
│  ├────────────────────┤           ├────────────────────┤            │
│  │                    │           │                    │            │
│  │ ┌────────────────┐ │           │ Document List:     │            │
│  │ │ Sidebar        │ │           │ ┌────────────────┐ │            │
│  │ │ - Plan A1.1    │ │           │ │ RFI-001        │ │            │
│  │ │ - Plan A2.1    │ │           │ │ Type: RFI      │ │            │
│  │ │ - ...          │ │           │ │ Tags: [rfi]    │ │            │
│  │ └────────────────┘ │           │ │ [Preview ▼]    │ │            │
│  │                    │           │ └────────────────┘ │            │
│  │ ┌────────────────┐ │           │ ┌────────────────┐ │            │
│  │ │ Viewer         │ │           │ │ Submittal-001  │ │            │
│  │ │                │ │           │ │ Type: Submittal│ │            │
│  │ │  ┌──────────┐  │ │           │ │ Tags: [submit] │ │            │
│  │ │  │ PdfCanvas│  │ │           │ └────────────────┘ │            │
│  │ │  │ OR       │  │ │           │ ...                │            │
│  │ │  │ <img>    │  │ │           │                    │            │
│  │ │  └──────────┘  │ │           │                    │            │
│  │ │                │ │           │                    │            │
│  │ └────────────────┘ │           └────────────────────┘            │
│  └────────────────────┘                                              │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ PdfCanvas Component (PDF.js)                                 │   │
│  │ ┌────────────────────────────────────────────────────────┐   │   │
│  │ │ import * as pdfjsLib from 'pdfjs-dist/build/pdf'       │   │   │
│  │ │ GlobalWorkerOptions.workerSrc = CDN URL                │   │   │
│  │ │                                                         │   │   │
│  │ │ - Loads PDF from /library/filename.pdf                 │   │   │
│  │ │ - Renders first page to <canvas>                       │   │   │
│  │ │ - Scales to 1.2x                                        │   │   │
│  │ │ - Shows errors if rendering fails                      │   │   │
│  │ └────────────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ File Flow                                                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│ Internet URL                                                         │
│     ↓ (download script)                                              │
│ samples/library/plan.pdf                                             │
│     ↓ (copy)                                                         │
│ public/library/plan.pdf                                              │
│     ↓ (vite static serving)                                          │
│ http://localhost:5173/library/plan.pdf                               │
│     ↓ (PdfCanvas component)                                          │
│ Rendered in browser                                                  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ Dependencies                                                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│ Backend:                         Frontend:                           │
│ - Express.js                     - React 18                          │
│ - PostgreSQL (pg)                - TypeScript                        │
│ - Node.js fs/path                - pdfjs-dist@4.6.82                 │
│                                  - Vite                              │
│                                  - Lucide React (icons)              │
└─────────────────────────────────────────────────────────────────────┘
```

## Key Design Decisions

1. **Two-step process**: Download then ingest separates concerns
2. **Cross-platform**: PowerShell for Windows, Bash for Unix
3. **Static serving**: Files served from public directory for simplicity
4. **CDN worker**: Uses CDN for PDF.js worker to avoid build issues
5. **PostgreSQL**: Uses existing DB infrastructure
6. **No authentication**: Development feature for easy testing
7. **Flexible schema**: JSON payload allows extensible metadata
8. **Empty states**: UI gracefully handles no data scenario

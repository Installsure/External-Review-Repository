# InstallSure Rescue App

A minimal but functional InstallSure application for uploading blueprints (PDFs), tagging them, and exporting tags for quantity estimation.

## 🚀 Quick Start

### Prerequisites
- Node.js v18 or higher
- npm v8 or higher

### Installation & Running

1. **Navigate to the rescue-app directory:**
   ```bash
   cd applications/installsure/rescue-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📋 Features

### ✅ Core Functionality
- **PDF Upload**: Upload construction blueprints and plans
- **Interactive Tagging**: Click on PDFs to drop location-based tags
- **Tag Types**: RFI, Defect, Safety, Takeoff-Assembly, Electrical, Plumbing, HVAC
- **CSV Export**: Export all tags to CSV for quantity estimation
- **Health Check**: Monitor system status at `/health`

### 💾 Storage Options

**Local JSON (Default)**
- No configuration needed
- Tags stored in `tags.local.json`
- Documents tracked in `uploads/manifest.json`

**Neon Postgres (Optional)**
- Set `PG_URL` in `.env` file
- Example: `PG_URL=postgres://user:password@host:5432/database`
- Automatic schema creation
- Production-ready storage

## 🎯 Usage Demo Flow

1. **Upload a Blueprint**
   - Click "Choose File" and select a PDF
   - Click "Upload PDF"
   - The PDF displays in the center viewer

2. **Create Tags**
   - Select a tag type (e.g., "Takeoff-Assembly")
   - Optionally add a note
   - Click anywhere on the PDF to drop a tag
   - Tags appear instantly in the right panel

3. **Export Tags**
   - Click "Export CSV"
   - Opens a CSV file with all tag data
   - Use with estimator tools for quantity calculations

## 🔧 Configuration

### Environment Variables (.env)

```bash
# Server port (default: 3000)
PORT=3000

# Optional: Neon Postgres connection
# PG_URL=postgres://user:password@host:5432/database
```

## 📊 API Endpoints

### GET /health
Health check endpoint
```json
{
  "ok": true,
  "db": "local" | "pg",
  "db_ok": true
}
```

### POST /api/docs/upload
Upload a PDF document
- Content-Type: `multipart/form-data`
- Field: `file` (PDF file)

**Response:**
```json
{
  "ok": true,
  "path": "/uploads/filename"
}
```

### GET /api/tags
Get all tags for the demo project

**Response:**
```json
{
  "ok": true,
  "rows": [
    {
      "project_id": "demo",
      "tag_type": "Takeoff-Assembly",
      "note": "Optional note",
      "page": 1,
      "x": 0.523,
      "y": 0.342,
      "created_at": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### POST /api/tags
Create a new tag

**Request:**
```json
{
  "tag_type": "Takeoff-Assembly",
  "note": "Optional note",
  "page": 1,
  "x": 0.523,
  "y": 0.342
}
```

**Response:**
```json
{
  "ok": true
}
```

## 🗂️ File Structure

```
rescue-app/
├── server.js           # Express server with all backend logic
├── package.json        # Dependencies and scripts
├── .env                # Configuration (optional)
├── public/
│   └── index.html      # Frontend UI
├── uploads/            # Uploaded PDFs and manifest.json
└── tags.local.json     # Local tag storage (when not using Postgres)
```

## 🔐 Database Schema (Postgres)

### tags table
```sql
create table tags(
  id bigserial primary key,
  project_id text not null,
  tag_type text not null,
  note text,
  page int,
  x double precision not null,
  y double precision not null,
  created_at timestamptz default now()
);
```

### documents table
```sql
create table documents(
  id bigserial primary key,
  project_id text not null,
  doc_type text not null,
  title text not null,
  url text,
  content text,
  created_at timestamptz default now()
);
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Server starts on port 3000
- [ ] Health endpoint returns { ok: true }
- [ ] Can upload a PDF
- [ ] PDF displays in viewer
- [ ] Can click to create tags
- [ ] Tags appear in right panel
- [ ] Can export tags as CSV
- [ ] CSV contains correct data
- [ ] Storage persists (JSON or Postgres)

### With Neon Postgres
1. Add `PG_URL` to `.env`
2. Restart server
3. Verify health shows `"db": "pg"`
4. Create tags and verify in database

## 🔄 Next Steps

Once the rescue app is working:
1. **UE5 Integration**: UE5 can read tags via GET `/api/tags`
2. **Enhanced Estimator**: Parse CSV for quantity calculations
3. **Multi-page Support**: Extend to handle multi-page PDFs
4. **Visual Overlays**: Add pin markers directly on PDF viewer
5. **User Authentication**: Add user management for production

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
# Change port in .env
PORT=3001
```

### npm install fails
```bash
# Clear npm cache
npm cache clean --force
npm install
```

### PDF upload fails
- Check `uploads/` directory exists
- Verify file is a valid PDF
- Check file size (default limit: 10MB)

### Postgres connection fails
- Verify `PG_URL` format
- Check network connectivity
- Ensure database exists
- App falls back to local JSON automatically

## 📄 License

Part of the InstallSure External Review Repository

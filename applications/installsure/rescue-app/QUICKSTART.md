# InstallSure Rescue - Quick Start Guide

## ⚡ Fastest Way to Start

### Windows
```powershell
cd applications\installsure\rescue-app
npm install
.\start.ps1
```

### Linux/Mac
```bash
cd applications/installsure/rescue-app
npm install
./start.sh
```

Then open **http://localhost:3000** in your browser!

---

## 🎯 Demo Flow (5 minutes)

### Step 1: Upload a Blueprint
1. Click **"Choose File"**
2. Select any PDF file (construction blueprint, floor plan, etc.)
3. Click **"Upload PDF"**
4. ✅ PDF appears in the center viewer

### Step 2: Create Tags
1. Select a tag type from the dropdown (e.g., "Takeoff-Assembly")
2. Optionally add a note
3. Click anywhere on the PDF to drop a tag
4. ✅ Tag appears instantly in the right panel

### Step 3: Export Tags
1. Click **"Export CSV"**
2. ✅ CSV file downloads with all tag data
3. Open in Excel/Google Sheets for quantity estimation

---

## 🔧 Optional: Use Neon Postgres

### Instead of Local JSON Storage

1. Copy environment template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Neon connection string:
   ```bash
   PG_URL=postgres://user:password@host.neon.tech:5432/database
   ```

3. Restart the server:
   ```bash
   npm start
   ```

4. ✅ Health check shows: `✓ Online • Neon DB`

---

## 📊 What You Get

### API Endpoints
- `GET /health` - System status
- `POST /api/docs/upload` - Upload PDFs
- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create a tag

### Storage Options
- **Local JSON** (default): Zero config, works immediately
- **Neon Postgres** (optional): Production-ready, set `PG_URL` in `.env`

### Tag Types
- RFI (Request for Information)
- Defect
- Safety
- Takeoff-Assembly (for quantity estimation)
- Electrical
- Plumbing
- HVAC

---

## 🎨 Features

✅ **Click-to-Tag**: Point and click to add location-based tags  
✅ **Live Updates**: Tags appear immediately after creation  
✅ **CSV Export**: One-click export for estimator tools  
✅ **Dual Storage**: Local JSON or Postgres, your choice  
✅ **No Build Step**: Pure HTML/JS, runs instantly  
✅ **Health Checks**: Monitor system status at `/health`

---

## 🐛 Troubleshooting

### Port 3000 in use?
Edit `.env` (copy from `.env.example` first):
```bash
PORT=3001
```

### Can't upload PDF?
- Check file is a valid PDF
- Default max size is 10MB
- `uploads/` directory is created automatically

### Tags not persisting?
- Check console for errors
- Verify `tags.local.json` is being created
- If using Postgres, check `PG_URL` is valid

---

## 🚀 Next Steps

Once this works, you can:
1. Integrate UE5 to read tags via `GET /api/tags`
2. Build quantity estimator using exported CSV
3. Add multi-page PDF support
4. Add visual pin overlays on PDF
5. Add user authentication for production

---

## 📝 Full Documentation

See [README.md](README.md) for complete API docs and advanced usage.

---

## ✨ What "Done" Looks Like

1. ✅ http://localhost:3000 opens
2. ✅ Upload a PDF and it displays
3. ✅ Click on PDF to drop tags
4. ✅ Tags appear in right panel
5. ✅ Export CSV works
6. ✅ Health check shows: `✓ Online • Local JSON`

**That's it! You have a working blueprint tagging system.**

# File Converter (PDF Utility Platform)

A high-performance, clean UI/UX platform for PDF manipulation.

## Tech Stack
- **Frontend:** Next.js, Tailwind CSS, Lucide React
- **Backend:** Node.js (Express), `pdf-lib`
- **File Handling:** Multer, `pdf-lib`, `pdf-parse`
- **Storage:** Local temp storage (transitioning to S3)

## Project Structure
```text
pdf-utility-platform/
├── frontend/             # Next.js App
│   ├── src/
│   │   ├── app/          # App Router (Home, Merge, Split, etc.)
│   │   ├── components/   # UI Components (UploadZone, Navbar, Footer)
│   │   └── lib/          # Utilities (API clients)
├── backend/              # Express.js Server
│   ├── src/
│   │   ├── controllers/  # Logic for PDF operations
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Heavy lifting (pdf-lib, conversions)
│   │   └── index.js      # Entry point
├── storage/              # Persistent storage (if needed)
└── temp/                 # Temporary processing folder
```

## Roadmap

### Phase 1: Foundation & UI
1. Initialize Next.js in `frontend/`.
2. Initialize Express in `backend/`.
3. Design Landing Page (Grid of tools).
4. Design Tool Page (Drag-and-drop zone).

### Phase 2: Core Features (Merge PDF)
1. Implement Multi-file upload in Frontend.
2. Implement `POST /api/merge` in Backend using `pdf-lib`.
3. Implement Download logic.

### Phase 3: Conversion Features (PDF to Word)
1. Implement PDF to Word logic.
2. Implement `POST /api/convert/pdf-to-word`.

### Phase 4: Optimization & Polish
1. Add thumbnails for uploaded PDFs.
2. Add progress bars.
3. Implement auto-delete for temp files.

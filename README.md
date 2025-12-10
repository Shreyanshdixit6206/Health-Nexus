# Health NEXUS - Prototype

This workspace contains a minimal backend (Express) and a responsive frontend prototype for the Health NEXUS final-year project.

Overview
- Backend: Node.js + Express serving a simple JSON-store and endpoints for OTP login (Aadhaar based), medicines, orders, and vault uploads.
- Frontend: `frontend/health-nexus.html` — Tailwind CSS, small JS that calls the backend API.

Quick start (Windows PowerShell)

1. Install dependencies

```powershell
cd workspace/server
npm install
```

2. Start the server

```powershell
npm start
# Server listens on http://localhost:3000
```

3. Open the frontend

Open `http://localhost:3000/frontend/health-nexus.html` in your browser (or open the file directly: `workspace/frontend/health-nexus.html`).

Dev notes
- Sample Aadhaar: `123412341234` (no password). Request OTP from the login dialog — OTP is printed on the server console and also returned in the API response as `devOtp` for convenience.
- Orders and vault metadata are stored in `server/data/*.json`.
- Uploaded files are saved to `server/uploads/`.

Security
- This project is a prototype. Do not use this code in production as-is.

Next steps
- Manual testing and polish UI details per your design (I preserved the prototype look and added OTP flow and small tilt effects to store cards).

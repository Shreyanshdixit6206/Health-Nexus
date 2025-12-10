# Health NEXUS - Server

This folder contains the minimal Express backend for the Health NEXUS prototype.

Quick commands (PowerShell):

```
Set-Location -Path 'C:\workspace\server'
npm install
npm start        # start server in foreground
# or
npm run dev      # start server with nodemon (auto-restart)

# run the simple integration flow test
npm test
```

What I added:
- `npm run dev` (uses `nodemon`) for development.
- `npm run test-flow` / `npm test` to run a simple integration flow test that exercises medicines, OTP login, order placement and retrieval.

Notes:
- The integration test (`test/test_flow.js`) uses global `fetch` available in Node 18+. If your Node is older, install `node-fetch` and update the test.
- File uploads are not exercised by the test to keep dependencies minimal.

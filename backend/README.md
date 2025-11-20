# Backend (Structured Copy)

This is a non-destructive, structured copy of the existing JavaScript backend. The original backend remains in `../backend`.

## Run

1. Copy `.env.example` to `.env` and set values.
2. Install deps:
   npm i
3. Start dev server:
   npm run dev

Server uses the routers and models from the original `backend/` directory to avoid code duplication.

## Structure
- src/server.js (entry)
- src/app.js (Express app wiring)
- src/config/db.js (Mongo connection)
- src/config/env.js (env loader)
- src/routes/index.js (mount routes from original backend)

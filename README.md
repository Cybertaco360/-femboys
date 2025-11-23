# PAD Electron (React + TypeScript)

Migrated from a plain HTML/JS interface to a React + TypeScript renderer using Vite, with an Express backend and Electron shell.

## Development

1. Install dependencies:
   npm install
2. Start dev (Vite + TypeScript compiler + Electron):
   npm run dev
   This runs renderer on Vite (port 5173) and Electron after it is ready.
3. Set `GEMINI_API_KEY` in a `.env` file or environment for chat to function.

## Build

1. Build renderer and electron code:
   npm run build
2. Start Electron from built output:
   npm start

## Structure
- `src/renderer` React components & entry HTML.
- `src/server.ts` Express API for Gemini.
- `src/electron` Electron main & preload.
- `styles.css` Shared styles.

Legacy files (`index.html`, `chat.js`) retained for reference; new entry is `src/renderer/index.html`.

## Environment Variables
- `GEMINI_API_KEY` (required for chat responses)
- `PORT` (optional, defaults 3000)
- `GEMINI_MODEL` (optional model override)

## Notes
Ensure network access is permitted for calls to Google Generative Language API.

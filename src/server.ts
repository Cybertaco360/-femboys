import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
// node-fetch is ESM; use dynamic import to stay compatible with CJS build output
const fetch = async (url: string, init?: any) => (await import('node-fetch')).default(url, init);
import path from 'path';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = (process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite').replace(/^models\//, '');

export function startServer(): number {
  if (!GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not set. Set in environment or .env file.');
  }
  const app = express();
  app.use(express.json());
  app.use(cors());

  // Serve renderer build assets (after build) & PAD.png/styles.css from root
  app.use(express.static(path.join(__dirname, '../')));
  app.use('/assets', express.static(path.join(__dirname, 'renderer')));

  interface ChatMessage { role: 'user' | 'model'; text: string; }
  interface ChatBody { convo?: ChatMessage[] }

  app.post('/api/chat', async (req: Request<{}, {}, ChatBody>, res: Response) => {
    try {
      if (!GEMINI_API_KEY) return res.status(500).json({ error: 'API key missing on server' });
      const { convo = [] } = req.body;

  const contents = convo.map((m: ChatMessage) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
  const apiRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      });

      if (!apiRes.ok) {
        const errText = await apiRes.text();
        return res.status(apiRes.status).json({ error: errText });
      }
      const data = await apiRes.json() as any;
      const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') || '';
      res.json({ text });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  const PORT = parseInt(process.env.PORT || '3000', 10);
  app.listen(PORT, () => console.log('Server listening on ' + PORT));
  return PORT;
}

if (require.main === module) {
  startServer();
}

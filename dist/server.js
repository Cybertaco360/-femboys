"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = startServer;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// node-fetch is ESM; use dynamic import to stay compatible with CJS build output
const fetch = async (url, init) => (await Promise.resolve().then(() => __importStar(require('node-fetch')))).default(url, init);
const path_1 = __importDefault(require("path"));
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = (process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite').replace(/^models\//, '');
function startServer() {
    if (!GEMINI_API_KEY) {
        console.warn('GEMINI_API_KEY not set. Set in environment or .env file.');
    }
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    // Serve renderer build assets (after build) & PAD.png/styles.css from root
    app.use(express_1.default.static(path_1.default.join(__dirname, '../')));
    app.use('/assets', express_1.default.static(path_1.default.join(__dirname, 'renderer')));
    app.post('/api/chat', async (req, res) => {
        try {
            if (!GEMINI_API_KEY)
                return res.status(500).json({ error: 'API key missing on server' });
            const { convo = [] } = req.body;
            const contents = convo.map((m) => ({
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
            const data = await apiRes.json();
            const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';
            res.json({ text });
        }
        catch (e) {
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

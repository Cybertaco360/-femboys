"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_markdown_1 = __importDefault(require("react-markdown"));
const App = () => {
    const [convo, setConvo] = (0, react_1.useState)([]);
    const [input, setInput] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const sendToBackend = (0, react_1.useCallback)(async (history) => {
        const recent = history.slice(-20);
        const res = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ convo: recent })
        });
        if (!res.ok)
            throw new Error('Server error ' + res.status);
        const data = await res.json();
        return data.text || '[No response]';
    }, []);
    const onSubmit = (0, react_1.useCallback)(async (e) => {
        e.preventDefault();
        if (!input.trim())
            return;
        const userMsg = { role: 'user', text: input.trim() };
        setInput('');
        setConvo(prev => [...prev, userMsg]);
        setLoading(true);
        try {
            const reply = await sendToBackend([...convo, userMsg]);
            setConvo(prev => [...prev, { role: 'model', text: reply }]);
        }
        catch (err) {
            setConvo(prev => [...prev, { role: 'model', text: 'Error: ' + err.message }]);
        }
        finally {
            setLoading(false);
        }
    }, [input, convo, sendToBackend]);
    (0, react_1.useEffect)(() => {
        // initial empty render
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "app", children: [(0, jsx_runtime_1.jsx)("div", { className: "left-pane", children: (0, jsx_runtime_1.jsx)("div", { className: "image-frame", children: (0, jsx_runtime_1.jsx)("img", { src: "PAD.png", alt: "PAD" }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "right-pane", children: [(0, jsx_runtime_1.jsx)("div", { className: "messages", children: convo.map((m, i) => ((0, jsx_runtime_1.jsx)("p", { className: `message ${m.role === 'user' ? 'user' : 'model'}`, children: m.role === 'user' ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["You: ", m.text] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["AI: ", (0, jsx_runtime_1.jsx)(react_markdown_1.default, { children: m.text })] })) }, i))) }), (0, jsx_runtime_1.jsxs)("form", { className: "input-row", onSubmit: onSubmit, children: [(0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Type message...", value: input, onChange: e => setInput(e.target.value), disabled: loading, autoComplete: "off" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: loading, children: loading ? '...' : 'Send' })] })] })] }));
};
exports.default = App;

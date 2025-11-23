import React, { useState, useCallback, useEffect, FormEvent } from 'react';
import ReactMarkdown from 'react-markdown';

interface Message { role: 'user' | 'model'; text: string; }

const App: React.FC = () => {
  const [convo, setConvo] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendToBackend = useCallback(async (history: Message[]): Promise<string> => {
    const recent = history.slice(-20);
    const res = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ convo: recent })
    });
    if (!res.ok) throw new Error('Server error ' + res.status);
    const data = await res.json();
    return data.text || '[No response]';
  }, []);

  const onSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', text: input.trim() };
    setInput('');
    setConvo(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const reply = await sendToBackend([...convo, userMsg]);
      setConvo(prev => [...prev, { role: 'model', text: reply }]);
    } catch (err: any) {
      setConvo(prev => [...prev, { role: 'model', text: 'Error: ' + err.message }]);
    } finally {
      setLoading(false);
    }
  }, [input, convo, sendToBackend]);

  useEffect(() => {
    // initial empty render
  }, []);

  return (
    <div className="app">
      <div className="left-pane">
        <div className="image-frame">
          <img src="PAD.png" alt="PAD" />
        </div>
      </div>
      <div className="right-pane">
        <div className="messages">
          {convo.map((m, i) => (
            <p key={i} className={`message ${m.role === 'user' ? 'user' : 'model'}`}>
              {m.role === 'user' ? (
                <>You: {m.text}</>
              ) : (
                <>AI: <ReactMarkdown>{m.text}</ReactMarkdown></>
              )}
            </p>
          ))}
        </div>
        <form className="input-row" onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Type message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            autoComplete="off"
          />
          <button type="submit" disabled={loading}>{loading ? '...' : 'Send'}</button>
        </form>
      </div>
    </div>
  );
};

export default App;

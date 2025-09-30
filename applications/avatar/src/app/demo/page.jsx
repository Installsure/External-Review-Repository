'use client';
import { useEffect, useRef, useState } from 'react';

export default function DemoPanel() {
  const [token, setToken] = useState('');
  const [personaId, setPersonaId] = useState('dating-hero');
  const [log, setLog] = useState([]);
  const wsRef = useRef(null);
  const [text, setText] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  async function startSession() {
    try {
      // Use the existing session API
      const res = await fetch('/api/session/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona_id: personaId }),
      });
      const data = await res.json();

      if (data.success) {
        setToken(data.session.session_id);
        setIsConnected(true);
        setLog((prev) => [`Session started with ${personaId}`, ...prev]);
      }
    } catch (error) {
      console.error('Session start failed:', error);
      setLog((prev) => ['Failed to start session', ...prev]);
    }
  }

  async function send() {
    if (!text.trim()) return;

    try {
      // Add user message to log immediately
      setLog((prev) => [`You: ${text}`, ...prev]);

      // Use the existing chat API
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          persona_id: personaId,
          user_id: 'demo-user',
          session_id: token,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setLog((prev) => [data.message, ...prev].slice(0, 50));
        // Auto-save memory
        await logMemory(text);
      }

      setText('');
    } catch (error) {
      console.error('Send failed:', error);
      setLog((prev) => ['Failed to send message', ...prev]);
    }
  }

  async function logMemory(userMessage = null) {
    try {
      const summary = userMessage ? `User said: "${userMessage}"` : 'Manual memory log';
      await fetch('/api/memory/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'demo-user',
          persona_id: personaId,
          summary: summary,
        }),
      });
      console.log('Memory saved');
    } catch (error) {
      console.error('Memory save failed:', error);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 800,
        margin: '0 auto',
        fontFamily: 'system-ui',
      }}
    >
      <div
        style={{
          background: '#f8f9fa',
          padding: 20,
          borderRadius: 12,
          marginBottom: 20,
        }}
      >
        <h1 style={{ margin: 0, color: '#2d3748', fontSize: 28 }}>🤖 Nexus Avatar Control Panel</h1>
        <p style={{ margin: '8px 0 0 0', color: '#666' }}>Real-time AI avatar interaction system</p>
      </div>

      <div
        style={{
          background: 'white',
          padding: 20,
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          marginBottom: 20,
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: 'block',
              marginBottom: 8,
              fontWeight: 500,
              color: '#374151',
            }}
          >
            Choose Persona:
          </label>
          <select
            value={personaId}
            onChange={(e) => setPersonaId(e.target.value)}
            style={{
              width: '100%',
              padding: 12,
              border: '1px solid #d1d5db',
              borderRadius: 8,
              fontSize: 16,
              background: 'white',
            }}
          >
            <option value="dating-hero">💝 Companion (Warm & Empathetic)</option>
            <option value="construction-smart-alec">🏗️ RFI Enforcer (Witty & Firm)</option>
          </select>
        </div>

        <button
          onClick={startSession}
          style={{
            background: isConnected ? '#10b981' : '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 500,
            cursor: 'pointer',
            width: '100%',
          }}
        >
          {isConnected ? '✅ Session Active' : '🚀 Start Session'}
        </button>
      </div>

      {isConnected && (
        <div
          style={{
            background: 'white',
            padding: 20,
            borderRadius: 12,
            border: '1px solid #e2e8f0',
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              style={{
                flex: 1,
                padding: 12,
                border: '1px solid #d1d5db',
                borderRadius: 8,
                fontSize: 16,
              }}
            />
            <button
              onClick={send}
              disabled={!text.trim()}
              style={{
                background: text.trim() ? '#3b82f6' : '#9ca3af',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 500,
                cursor: text.trim() ? 'pointer' : 'not-allowed',
                minWidth: 80,
              }}
            >
              Send
            </button>
          </div>

          <button
            onClick={() => logMemory('Manual memory save')}
            style={{
              background: '#8b5cf6',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: 6,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            💾 Save Memory
          </button>
        </div>
      )}

      <div
        style={{
          background: 'white',
          padding: 20,
          borderRadius: 12,
          border: '1px solid #e2e8f0',
        }}
      >
        <h3 style={{ margin: '0 0 16px 0', color: '#374151' }}>💬 Conversation Log</h3>
        <div
          style={{
            maxHeight: 400,
            overflowY: 'auto',
            border: '1px solid #f3f4f6',
            borderRadius: 8,
            padding: 16,
          }}
        >
          {log.length === 0 ? (
            <p style={{ color: '#9ca3af', fontStyle: 'italic', margin: 0 }}>
              No messages yet. Start a session and send a message!
            </p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {log.map((message, i) => (
                <li
                  key={i}
                  style={{
                    padding: 12,
                    marginBottom: 8,
                    background: message.startsWith('You:') ? '#eff6ff' : '#f0fdf4',
                    borderRadius: 8,
                    borderLeft: `4px solid ${message.startsWith('You:') ? '#3b82f6' : '#10b981'}`,
                  }}
                >
                  {message}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

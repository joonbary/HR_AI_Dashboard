import { useState, useRef, useEffect } from 'react';
import useStore from '../../store/useStore';

export default function CopilotPanel() {
  const { copilotOpen, setCopilotOpen, messages, addMessage } = useStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const historyRef = useRef(null);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    addMessage({ role: 'user', content: userMsg });
    setLoading(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history: messages.slice(-10) }),
      });

      if (res.ok) {
        const data = await res.json();
        addMessage({ role: 'assistant', content: data.reply || '응답을 처리할 수 없습니다.' });
      } else {
        addMessage({ role: 'assistant', content: '서버 연결에 실패했습니다. 서버가 실행 중인지 확인해주세요.' });
      }
    } catch {
      addMessage({ role: 'assistant', content: 'AI Copilot 서버에 연결할 수 없습니다. 추후 오픈 예정입니다.' });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <aside className={`copilot-panel ${copilotOpen ? 'open' : ''}`}>
      <div className="copilot-header">
        <h3>HR Copilot</h3>
        <button className="btn" onClick={() => setCopilotOpen(false)} style={{ fontSize: 11, padding: '3px 10px' }}>✕</button>
      </div>

      <div className="copilot-history" ref={historyRef}>
        {messages.length === 0 && (
          <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>💬</div>
            <p>인사 데이터에 대해 자연어로 질문하세요</p>
            <p style={{ marginTop: 8, fontSize: 11 }}>예: "OK저축은행 과장급 몇 명?"</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{
            marginBottom: 12,
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            <div style={{
              maxWidth: '85%',
              padding: '8px 12px',
              borderRadius: 12,
              fontSize: 12,
              lineHeight: 1.6,
              background: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-subtle)',
              color: msg.role === 'user' ? '#fff' : 'var(--text-body)',
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ padding: 8, fontSize: 12, color: 'var(--text-muted)' }}>
            응답 생성 중...
          </div>
        )}
      </div>

      <div className="copilot-input-wrap">
        <textarea
          className="copilot-input"
          rows={1}
          placeholder="질문을 입력하세요..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="copilot-send" onClick={handleSend} disabled={loading}>
          전송
        </button>
      </div>
    </aside>
  );
}

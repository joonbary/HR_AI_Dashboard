import { useState, useRef, useEffect } from 'react';
import useCopilotStore from '../../../shared/store/copilotStore';
import { sendCopilotMessage } from '../../../services/copilot/copilotClient';
import { buildDashboardCopilotContext } from '../../../services/copilot/dashboardContext';

export default function CopilotPanel() {
  const { copilotOpen, setCopilotOpen, messages, addMessage } = useCopilotStore();
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
      const reply = await sendCopilotMessage({
        app: 'dashboard',
        message: userMsg,
        history: messages.slice(-10),
        context: buildDashboardCopilotContext(),
      });
      addMessage({ role: 'assistant', content: reply });
    } catch {
      addMessage({ role: 'assistant', content: 'AI 코파일럿 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.' });
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
        <h3>HR AI 코파일럿</h3>
        <button className="btn" onClick={() => setCopilotOpen(false)} style={{ fontSize: 11, padding: '3px 10px' }}>닫기</button>
      </div>

      <div className="copilot-history" ref={historyRef}>
        {messages.length === 0 && (
          <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
            <p>인사 데이터에 대해 질문해 주세요.</p>
            <p style={{ marginTop: 8, fontSize: 11 }}>예: "OK저축은행 과장급은 몇 명인가요?"</p>
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

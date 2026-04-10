import { useState } from 'react';
import useStore from '../../store/useStore';
import usePersonnelStore from '../../store/personnelStore';
import { COPILOT_PRESETS } from '../../data/personnelData';

export default function PersonnelCopilot() {
  const messages = useStore((s) => s.messages);
  const addMessage = useStore((s) => s.addMessage);
  const copilotOpen = useStore((s) => s.copilotOpen);
  const setCopilotOpen = useStore((s) => s.setCopilotOpen);

  const activeSubTab = usePersonnelStore((s) => s.activeSubTab);
  const selectedCandidate = usePersonnelStore((s) => s.selectedCandidate);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get preset questions for current sub-tab
  const presets = COPILOT_PRESETS[activeSubTab] || [];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMsg = { role: 'user', content: inputValue };
    addMessage(userMsg);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg = {
        role: 'assistant',
        content: `${inputValue}에 대한 분석 결과입니다.\n\n[이 부분은 실제 API 연동 시 AI 응답으로 대체됩니다]`,
      };
      addMessage(aiMsg);
      setIsLoading(false);
    }, 800);
  };

  const handlePresetClick = (question) => {
    setInputValue(question);
  };

  const handleClose = () => {
    setCopilotOpen(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        width: 'var(--copilot-w)',
        height: '100vh',
        backgroundColor: 'var(--bg)',
        borderLeft: '1px solid var(--divider)',
        display: 'flex',
        flexDirection: 'column',
        transform: copilotOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease',
        zIndex: 200,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--divider)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent)' }}>
            AI 인사부장
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            정기인사 모드
          </div>
        </div>
        <button
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            padding: '0',
            lineHeight: '1',
          }}
        >
          ✕
        </button>
      </div>

      {/* Messages Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
            <div style={{ marginBottom: '12px' }}>대화를 시작해보세요</div>

            {/* Preset Questions */}
            {presets.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  추천 질문
                </div>
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetClick(preset)}
                    style={{
                      padding: '8px 12px',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--divider)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '11px',
                      color: 'var(--text-body)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.backgroundColor = 'var(--accent-light)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--divider)';
                      e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                    }}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '85%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius)',
                  fontSize: '12px',
                  lineHeight: '1.4',
                  backgroundColor:
                    msg.role === 'user' ? 'var(--accent)' : 'var(--bg-subtle)',
                  color: msg.role === 'user' ? '#fff' : 'var(--text-body)',
                }}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius)',
                backgroundColor: 'var(--bg-subtle)',
                fontSize: '12px',
                color: 'var(--text-muted)',
              }}
            >
              입력 중...
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--divider)',
          display: 'flex',
          gap: '8px',
        }}
      >
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              handleSendMessage();
            }
          }}
          placeholder="질문을 입력하세요..."
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid var(--divider)',
            borderRadius: 'var(--radius)',
            fontSize: '12px',
            resize: 'none',
            outline: 'none',
            fontFamily: 'var(--font-main)',
            minHeight: '36px',
            maxHeight: '80px',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--divider)';
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isLoading}
          style={{
            padding: '8px 16px',
            backgroundColor: inputValue.trim() && !isLoading ? 'var(--accent)' : 'var(--text-muted)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius)',
            fontWeight: '600',
            cursor: inputValue.trim() && !isLoading ? 'pointer' : 'not-allowed',
            fontSize: '12px',
            transition: 'all 0.15s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            if (inputValue.trim() && !isLoading) {
              e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
            }
          }}
          onMouseLeave={(e) => {
            if (inputValue.trim() && !isLoading) {
              e.currentTarget.style.backgroundColor = 'var(--accent)';
            }
          }}
        >
          전송
        </button>
      </div>
    </div>
  );
}

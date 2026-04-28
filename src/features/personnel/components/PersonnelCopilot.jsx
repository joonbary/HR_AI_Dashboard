import { useState } from 'react';
import useCopilotStore from '../../../shared/store/copilotStore';
import usePersonnelStore from '../store/personnelStore';
import { COPILOT_PRESETS } from '../data/personnelData';
import { sendCopilotMessage } from '../../../services/copilot/copilotClient';
import { buildPersonnelCopilotContext } from '../../../services/copilot/personnelContext';

export default function PersonnelCopilot() {
  const messages = useCopilotStore((s) => s.messages);
  const addMessage = useCopilotStore((s) => s.addMessage);
  const copilotOpen = useCopilotStore((s) => s.copilotOpen);
  const setCopilotOpen = useCopilotStore((s) => s.setCopilotOpen);

  const activeSubTab = usePersonnelStore((s) => s.activeSubTab);
  const selectedCandidate = usePersonnelStore((s) => s.selectedCandidate);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const presets = COPILOT_PRESETS[activeSubTab] || [];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    addMessage({ role: 'user', content: inputValue });
    setInputValue('');
    setIsLoading(true);

    try {
      const reply = await sendCopilotMessage({
        app: 'personnel',
        message: inputValue,
        history: messages.slice(-10),
        context: buildPersonnelCopilotContext({ activeSubTab, selectedCandidate }),
      });
      addMessage({ role: 'assistant', content: reply });
    } catch {
      addMessage({
        role: 'assistant',
        content: `${inputValue}\uC5D0 \uB300\uD55C \uBD84\uC11D \uACB0\uACFC\uC785\uB2C8\uB2E4.\n\n[\uC2E4\uC81C Copilot API \uC751\uB2F5\uC73C\uB85C \uB300\uCCB4\uB420 \uC608\uC815\uC785\uB2C8\uB2E4]`,
      });
    } finally {
      setIsLoading(false);
    }
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
            {'AI \uC778\uC0AC \uCF54\uD30C\uC77C\uB7FF'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {'\uC815\uAE30\uC778\uC0AC \uBAA8\uB4DC'}
          </div>
        </div>
        <button
          onClick={() => setCopilotOpen(false)}
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
          X
        </button>
      </div>

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
            <div style={{ marginBottom: '12px' }}>{'\uB300\uD654\uB97C \uC2DC\uC791\uD574\uBCF4\uC138\uC694'}</div>
            {presets.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  {'\uCD94\uCC9C \uC9C8\uBB38'}
                </div>
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputValue(preset)}
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
                  backgroundColor: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-subtle)',
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
              {'\uC751\uB2F5 \uC0DD\uC131 \uC911...'}
            </div>
          </div>
        )}
      </div>

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
          placeholder={'\uC9C8\uBB38\uC744 \uC785\uB825\uD558\uC138\uC694...'}
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
            whiteSpace: 'nowrap',
          }}
        >
          {'\uC804\uC1A1'}
        </button>
      </div>
    </div>
  );
}

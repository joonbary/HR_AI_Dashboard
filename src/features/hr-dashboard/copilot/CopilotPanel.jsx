import { useEffect, useRef, useState } from 'react';
import useCopilotStore from '../../../shared/store/copilotStore';
import useDashboardStore from '../store/dashboardStore';
import { sendCopilotMessage } from '../../../services/copilot/copilotClient';
import { buildDashboardCopilotContext } from '../../../services/copilot/dashboardContext';

function parseTraceIdsFromReply(replyText = '', availableTraceIds = []) {
  const matched = [];
  availableTraceIds.forEach((traceId) => {
    if (replyText.includes(traceId)) matched.push(traceId);
  });
  return [...new Set(matched)];
}

function forceTraceIds(replyText, traceIds) {
  if (!traceIds.length) return replyText;
  const traceLine = `\n\n[trace] ${traceIds.join(', ')}`;
  return replyText.includes('[trace]') ? replyText : `${replyText}${traceLine}`;
}

function formatValue(v) {
  if (typeof v === 'number') return Number.isInteger(v) ? `${v}` : `${v.toFixed(1)}`;
  if (v == null) return '-';
  return String(v);
}

function buildTraceSummaryCard(traceId, traceEntry) {
  const trace = traceEntry?.trace || {};
  const metric = trace.metric || traceId?.split(':')[0] || 'unknown';

  if (metric === 'turnover_delta') {
    const delta = Number(trace.delta_pp || 0);
    return {
      title: 'turnover_delta',
      judgment: delta > 0 ? '\uACBD\uACE0' : '\uC548\uC815',
      rows: [
        ['\uCD5C\uC2E0 \uC774\uC9C1\uB960(%)', formatValue(trace.latest_rate_pct)],
        ['\uC804\uB144 \uC774\uC9C1\uB960(%)', formatValue(trace.prev_rate_pct)],
        ['\uBCC0\uB3D9\uD3ED(%p)', formatValue(trace.delta_pp)],
        ['\uC784\uACC4\uCE58', '|delta_pp| >= 1.0'],
      ],
    };
  }

  if (metric === 'labor_delta') {
    const deltaPct = Number(trace.delta_pct || 0);
    return {
      title: 'labor_delta',
      judgment: deltaPct > 8 ? '\uC8FC\uC758' : '\uC548\uC815',
      rows: [
        ['\uCD5C\uC2E0 \uC778\uAC74\uBE44(\uBC31\uB9CC \uC6D0)', formatValue(trace.latest_labor_million_krw)],
        ['\uC804\uB144 \uC778\uAC74\uBE44(\uBC31\uB9CC \uC6D0)', formatValue(trace.prev_labor_million_krw)],
        ['\uBCC0\uB3D9\uB960(%)', formatValue(trace.delta_pct)],
        ['\uC784\uACC4\uCE58', '|delta_pct| >= 8.0'],
      ],
    };
  }

  if (metric === 'a_above_rate') {
    const rate = Number(trace.latest_rate_pct || 0);
    const threshold = Number(trace.threshold_pct || 35);
    return {
      title: 'a_above_rate',
      judgment: rate >= threshold ? '\uC0C1\uD68C' : '\uD558\uD68C',
      rows: [
        ['A \uC774\uC0C1 \uBE44\uC728(%)', formatValue(trace.latest_rate_pct)],
        ['\uAE30\uC900\uCE58(%)', formatValue(trace.threshold_pct)],
        ['\uD310\uC815', rate >= threshold ? '\uAE30\uC900 \uC0C1\uD68C' : '\uAE30\uC900 \uD558\uD68C'],
      ],
    };
  }

  if (metric === 'awta_start_rate') {
    const rate = Number(trace.start_rate_pct || 0);
    const target = Number(trace.target_pct || 30);
    return {
      title: 'awta_start_rate',
      judgment: rate < target ? '\uC8FC\uC758' : '\uC548\uC815',
      rows: [
        ['\uCC29\uC218 \uACFC\uC81C \uC218', formatValue(trace.started_tasks)],
        ['AI \uAC00\uB2A5 \uACFC\uC81C \uC218', formatValue(trace.possible_tasks)],
        ['\uCC29\uC218\uC728(%)', formatValue(trace.start_rate_pct)],
        ['\uBAA9\uD45C\uCE58(%)', formatValue(trace.target_pct)],
      ],
    };
  }

  return {
    title: metric,
    judgment: '\uC815\uBCF4',
    rows: Object.entries(trace).slice(0, 6).map(([k, v]) => [k, formatValue(v)]),
  };
}

function TraceBadge({ traceId, onClick }) {
  return (
    <button
      onClick={() => onClick(traceId)}
      style={{
        padding: '2px 6px',
        borderRadius: 4,
        border: '1px solid var(--divider)',
        backgroundColor: 'var(--bg)',
        color: 'var(--text-muted)',
        fontSize: 10,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        cursor: 'pointer',
      }}
    >
      {traceId}
    </button>
  );
}

export default function CopilotPanel() {
  const {
    copilotOpen,
    setCopilotOpen,
    messages,
    addMessage,
    setSelectedInsightTraceId,
  } = useCopilotStore();
  const setActiveTab = useDashboardStore((s) => s.setActiveTab);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const historyRef = useRef(null);
  const latestContext = buildDashboardCopilotContext();

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
      const context = latestContext;
      const traceMap = context?.summary?.insight_trace_map || {};
      const availableTraceIds = Object.keys(traceMap);
      const fallbackTraceIds = availableTraceIds.slice(0, 1);

      const replyRaw = await sendCopilotMessage({
        app: 'dashboard',
        message: userMsg,
        history: messages.slice(-10),
        context,
      });

      const parsedTraceIds = parseTraceIdsFromReply(replyRaw, availableTraceIds);
      const enforcedTraceIds = parsedTraceIds.length > 0 ? parsedTraceIds : fallbackTraceIds;
      const reply = forceTraceIds(replyRaw, enforcedTraceIds);
      const traceCards = enforcedTraceIds.map((traceId) =>
        buildTraceSummaryCard(traceId, traceMap[traceId]),
      );

      addMessage({
        role: 'assistant',
        content: reply,
        trace_ids: enforcedTraceIds,
        trace_cards: traceCards,
      });
    } catch {
      const traceMap = latestContext?.summary?.insight_trace_map || {};
      const fallbackTraceId = Object.keys(traceMap)[0];
      const traceTail = fallbackTraceId ? `\n\n[trace] ${fallbackTraceId}` : '';
      const traceCards = fallbackTraceId
        ? [buildTraceSummaryCard(fallbackTraceId, traceMap[fallbackTraceId])]
        : [];

      addMessage({
        role: 'assistant',
        content: `AI \uCF54\uD30C\uC77C\uB7FF \uC11C\uBC84\uC5D0 \uC5F0\uACB0\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.${traceTail}`,
        trace_ids: fallbackTraceId ? [fallbackTraceId] : [],
        trace_cards: traceCards,
      });
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

  const handleTraceClick = (traceId) => {
    setSelectedInsightTraceId(traceId);
    setActiveTab('insight');
  };

  return (
    <aside className={`copilot-panel ${copilotOpen ? 'open' : ''}`}>
      <div className="copilot-header">
        <h3>HR AI \uCF54\uD30C\uC77C\uB7FF</h3>
        <button className="btn" onClick={() => setCopilotOpen(false)} style={{ fontSize: 11, padding: '3px 10px' }}>
          \uB2EB\uAE30
        </button>
      </div>

      <div className="copilot-history" ref={historyRef}>
        {messages.length === 0 && (
          <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
            <p>\uC778\uC0AC \uB370\uC774\uD130\uC5D0 \uB300\uD574 \uC9C8\uBB38\uD574 \uC8FC\uC138\uC694.</p>
            <p style={{ marginTop: 8, fontSize: 11 }}>\uC608: "OK\uC800\uCD95\uC740\uD589 \uACFC\uC7A5\uAE09\uC740 \uBA87 \uBA85\uC778\uAC00\uC694?"</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: 12,
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '85%',
                padding: '8px 12px',
                borderRadius: 12,
                fontSize: 12,
                lineHeight: 1.6,
                background: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-subtle)',
                color: msg.role === 'user' ? '#fff' : 'var(--text-body)',
              }}
            >
              <div>{msg.content}</div>

              {msg.role === 'assistant' && Array.isArray(msg.trace_ids) && msg.trace_ids.length > 0 && (
                <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {msg.trace_ids.map((traceId) => (
                    <TraceBadge key={`${i}-${traceId}`} traceId={traceId} onClick={handleTraceClick} />
                  ))}
                </div>
              )}

              {msg.role === 'assistant' && Array.isArray(msg.trace_cards) && msg.trace_cards.length > 0 && (
                <div style={{ marginTop: 8, display: 'grid', gap: 8 }}>
                  {msg.trace_cards.map((card, idx) => (
                    <div
                      key={`${i}-card-${idx}`}
                      style={{
                        border: '1px solid var(--divider)',
                        borderRadius: 8,
                        padding: 8,
                        backgroundColor: 'var(--bg)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 10, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}>
                          {card.title}
                        </span>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{card.judgment}</span>
                      </div>
                      <div style={{ display: 'grid', gap: 2 }}>
                        {card.rows.map(([label, value]) => (
                          <div key={`${card.title}-${label}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{label}</span>
                            <span style={{ fontSize: 10, fontWeight: 600 }}>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && <div style={{ padding: 8, fontSize: 12, color: 'var(--text-muted)' }}>\uC751\uB2F5 \uC0DD\uC131 \uC911...</div>}
      </div>

      <div className="copilot-input-wrap">
        <textarea
          className="copilot-input"
          rows={1}
          placeholder="\uC9C8\uBB38\uC744 \uC785\uB825\uD558\uC138\uC694..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="copilot-send" onClick={handleSend} disabled={loading}>
          \uC804\uC1A1
        </button>
      </div>
    </aside>
  );
}

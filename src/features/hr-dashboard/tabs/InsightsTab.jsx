import { useMemo, useState } from 'react';
import { dashboardData as D } from '../../../services/dashboard/dashboardDataModel';
import { buildInsightsFeed } from '../../../services/insights/generateInsights';
import {
  INSIGHT_CATEGORY_OPTIONS,
  INSIGHT_IMPORTANCE_COLORS,
} from '../../../shared/constants/dashboardTaxonomy';

const CATEGORY_LABEL_MAP = Object.fromEntries(
  INSIGHT_CATEGORY_OPTIONS.map((option) => [option.value, option.label]),
);

function Badge({ text }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 6px',
        borderRadius: '4px',
        border: '1px solid var(--divider)',
        backgroundColor: 'var(--bg-subtle)',
        fontSize: '10px',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        color: 'var(--text-muted)',
      }}
    >
      {text}
    </span>
  );
}

export default function InsightsTab() {
  const [cat, setCat] = useState('전체');
  const insights = useMemo(() => buildInsightsFeed(D), []);

  const filtered = useMemo(() => {
    if (cat === '전체') return insights;
    return insights.filter((item) => item.cat === cat);
  }, [cat, insights]);

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {INSIGHT_CATEGORY_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            className={`filter-chip ${cat === value ? 'active' : ''}`}
            onClick={() => setCat(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="insight-list">
        {filtered.map((item) => (
          <li key={item.id || `${item.date}-${item.title}`} className="insight-item">
            <div className="insight-meta">
              <span>{item.date}</span>
              <span style={{ background: 'var(--accent-light)', padding: '1px 8px', borderRadius: 10, fontSize: 10 }}>
                {CATEGORY_LABEL_MAP[item.cat] || item.cat}
              </span>
              <span style={{ color: INSIGHT_IMPORTANCE_COLORS[item.imp] || '#999', fontWeight: 600 }}>
                중요도: {item.imp}
              </span>
            </div>

            {(item.badges?.length > 0 || item.trace_id) && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {item.badges?.map((badge) => <Badge key={`${item.id}-${badge}`} text={badge} />)}
                {item.trace_id ? <Badge text={item.trace_id} /> : null}
              </div>
            )}

            <div className="insight-title">{item.title}</div>
            <div className="insight-body">{item.content}</div>
          </li>
        ))}
        {filtered.length === 0 && (
          <li style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
            해당 카테고리 인사이트가 없습니다
          </li>
        )}
      </ul>
    </div>
  );
}


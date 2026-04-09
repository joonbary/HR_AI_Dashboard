import { useState, useMemo } from 'react';
import { D } from '../../data/dashboardData';

const CATEGORIES = ['전체', '경영진지시', '주요보고', '제도변경', '인력방침', '외부환경', 'AI전환', '인건비변동'];
const IMP_COLORS = { '상': '#E74C3C', '중': '#F39C12', '하': '#2ECC71' };

export default function InsightsTab() {
  const [cat, setCat] = useState('전체');
  const insights = D.insights || [];

  const filtered = useMemo(() => {
    if (cat === '전체') return insights;
    return insights.filter(i => i.cat === cat);
  }, [cat, insights]);

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {CATEGORIES.map(c => (
          <button
            key={c}
            className={`filter-chip ${cat === c ? 'active' : ''}`}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="insight-list">
        {filtered.map((item, i) => (
          <li key={i} className="insight-item">
            <div className="insight-meta">
              <span>{item.date}</span>
              <span style={{ background: 'var(--accent-light)', padding: '1px 8px', borderRadius: 10, fontSize: 10 }}>{item.cat}</span>
              <span style={{ color: IMP_COLORS[item.imp] || '#999', fontWeight: 600 }}>중요도: {item.imp}</span>
            </div>
            <div className="insight-title">{item.title}</div>
            <div className="insight-body">{item.content}</div>
          </li>
        ))}
        {filtered.length === 0 && (
          <li style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>해당 카테고리 인사이트가 없습니다</li>
        )}
      </ul>
    </div>
  );
}

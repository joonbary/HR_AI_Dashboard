import { useState, useMemo } from 'react';
import { ORG_TREE_DATA } from '../../../data/orgTreeData';
import { CHART_COLORS } from '../../../styles/chartPalette';

const COMPANY_BTNS = [
  { key: 'ALL', label: '전체 그룹' },
  { key: 'OKH', label: 'OK홀딩스' },
  { key: 'OK', label: 'OK저축은행' },
  { key: 'OC', label: 'OK캐피탈' },
  { key: 'ACI', label: 'ACI신용정보' },
  { key: 'AFI', label: 'AFI에프앤아이' },
  { key: 'OKAX', label: 'OKAX' },
  { key: 'ON+소규모', label: 'ON+소규모' },
];

function OrgNode({ node, level = 0 }) {
  const [open, setOpen] = useState(level < 2);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div style={{ marginLeft: level * 20 }}>
      <div
        onClick={() => hasChildren && setOpen(!open)}
        style={{
          padding: '6px 12px',
          margin: '2px 0',
          background: level === 0 ? CHART_COLORS.primary : level === 1 ? 'var(--bg-subtle)' : '#fff',
          color: level === 0 ? '#fff' : 'var(--text-body)',
          borderRadius: 4,
          fontSize: 12,
          fontWeight: level <= 1 ? 600 : 400,
          cursor: hasChildren ? 'pointer' : 'default',
          border: `1px solid ${level === 0 ? 'transparent' : 'var(--divider)'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>
          {hasChildren && <span style={{ marginRight: 6 }}>{open ? '▼' : '▶'}</span>}
          {node.name}
        </span>
        {node._count != null && (
          <span style={{ fontSize: 11, opacity: 0.7 }}>{node._count}명</span>
        )}
      </div>
      {open && hasChildren && node.children.map((child, i) => (
        <OrgNode key={i} node={child} level={level + 1} />
      ))}
    </div>
  );
}

export default function OrgTab() {
  const [selected, setSelected] = useState('ALL');

  const treeData = useMemo(() => {
    if (selected === 'ALL') {
      return ORG_TREE_DATA.group;
    }
    return ORG_TREE_DATA.companies?.[selected] || { name: selected, children: [] };
  }, [selected]);

  const totalCount = treeData._count || 0;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: 13 }}>
        <span style={{ fontWeight: 700 }}>총 {totalCount.toLocaleString()}명</span>
      </div>

      <div className="org-controls" style={{ marginBottom: 16 }}>
        {COMPANY_BTNS.map(btn => (
          <button
            key={btn.key}
            className={`org-btn ${selected === btn.key ? 'active' : ''}`}
            onClick={() => setSelected(btn.key)}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="chart-card" style={{ maxHeight: '60vh', overflowY: 'auto', padding: 16 }}>
        <OrgNode node={treeData} />
      </div>

      <div style={{ marginTop: 12, textAlign: 'right' }}>
        <button className="btn btn-primary" style={{ fontSize: 11 }}>
          PPT 내려받기
        </button>
      </div>
    </div>
  );
}

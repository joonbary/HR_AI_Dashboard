import usePersonnelStore from '../store/personnelStore';

const TYPE_COLORS = {
  '승진확정': '#2ECC71',
  '등급조정': '#F39C12',
  '직책해제': '#E74C3C',
  '이동확정': '#3498DB',
  '승진보류': '#95A5A6',
  '징계제한': '#8E44AD',
};

const STATUS_COLORS = {
  confirmed: '#2ECC71',
  pending: '#F39C12',
};

export default function DecisionLogBar() {
  const decisions = usePersonnelStore((s) => s.decisions);
  const logExpanded = usePersonnelStore((s) => s.logExpanded);
  const toggleLogExpanded = usePersonnelStore((s) => s.toggleLogExpanded);

  const recentDecisions = decisions.slice(-5).reverse();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--bg)',
        borderTop: '1px solid var(--divider)',
        zIndex: 150,
        maxHeight: logExpanded ? '50vh' : '60px',
        transition: 'max-height 0.3s ease',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Collapsed View */}
      <div
        onClick={toggleLogExpanded}
        style={{
          padding: '12px 16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: logExpanded ? '1px solid var(--divider)' : 'none',
          backgroundColor: 'var(--bg)',
        }}
      >
        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>
          결정 기록 ({decisions.length})
        </span>
        <div style={{ display: 'flex', gap: '6px', flex: 1, overflow: 'hidden' }}>
          {recentDecisions.slice(0, 5).map((d) => (
            <span
              key={d.id}
              style={{
                fontSize: '10px',
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: TYPE_COLORS[d.type] || 'var(--bg-subtle)',
                color: '#fff',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {d.subject}
            </span>
          ))}
        </div>
        <span style={{ fontSize: '16px', color: 'var(--text-muted)' }}>
          {logExpanded ? '▼' : '▲'}
        </span>
      </div>

      {/* Expanded View */}
      {logExpanded && (
        <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '12px',
            }}
          >
            <thead>
              <tr style={{ borderBottom: '1px solid var(--divider)' }}>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '8px',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'var(--text-muted)',
                  }}
                >
                  시간
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '8px',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'var(--text-muted)',
                  }}
                >
                  유형
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '8px',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'var(--text-muted)',
                  }}
                >
                  대상자
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '8px',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'var(--text-muted)',
                  }}
                >
                  내용
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '8px',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'var(--text-muted)',
                  }}
                >
                  결정자
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '8px',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'var(--text-muted)',
                  }}
                >
                  상태
                </th>
              </tr>
            </thead>
            <tbody>
              {decisions.slice().reverse().map((d) => (
                <tr
                  key={d.id}
                  style={{
                    borderBottom: '1px solid var(--divider)',
                    backgroundColor: 'var(--bg-subtle)',
                  }}
                >
                  <td style={{ padding: '8px' }}>{d.time}</td>
                  <td style={{ padding: '8px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        padding: '2px 8px',
                        borderRadius: '3px',
                        backgroundColor: TYPE_COLORS[d.type] || 'var(--bg-subtle)',
                        color: '#fff',
                        fontWeight: '600',
                      }}
                    >
                      {d.type}
                    </span>
                  </td>
                  <td style={{ padding: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {d.subject}
                  </td>
                  <td style={{ padding: '8px', color: 'var(--text-body)' }}>{d.detail}</td>
                  <td style={{ padding: '8px', color: 'var(--text-muted)' }}>{d.by}</td>
                  <td style={{ padding: '8px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: STATUS_COLORS[d.status] || 'var(--text-muted)',
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
import { useMemo } from 'react';
import usePersonnelStore from '../../store/personnelStore';
import { CANDIDATES, GRADE_ORDER, GRADE_COLORS, UPPER_LIMIT } from '../../data/personnelData';
import GradeDistChart from './GradeDistChart';

const DIVISIONS = ['전체', 'OK저축은행', 'OK캐피탈', 'OKAX', 'OK홀딩스'];

// Mock bias alert data
const BIAS_ALERTS = [
  { division: 'OK저축은행', type: 'warning', message: '관대화: A+ 등급이 상한선 대비 125% 초과' },
  { division: 'OK캐피탈', type: 'info', message: '중심화: 평가 편차 검출 (분산도 낮음)' },
];

export default function CalibrationView() {
  const {
    selectedDivision,
    setSelectedDivision,
    grades,
    changeGrade,
  } = usePersonnelStore();

  // Get candidates for selected division
  const divisionCandidates = useMemo(() => {
    if (selectedDivision === '전체') return CANDIDATES;
    return CANDIDATES.filter((c) => c.entity === selectedDivision);
  }, [selectedDivision]);

  // Track original grades
  const originalGrades = useMemo(() => {
    return Object.fromEntries(CANDIDATES.map((c) => [c.id, c.grade]));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      {/* Division Selector */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          padding: '12px 16px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--divider)',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>
          조직:
        </span>
        <select
          value={selectedDivision}
          onChange={(e) => setSelectedDivision(e.target.value)}
          style={{
            padding: '6px 10px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--divider)',
            fontSize: '12px',
            fontFamily: 'var(--font-main)',
            backgroundColor: 'var(--bg)',
            cursor: 'pointer',
          }}
        >
          {DIVISIONS.map((div) => (
            <option key={div} value={div}>
              {div}
            </option>
          ))}
        </select>
      </div>

      {/* Bias Alerts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {BIAS_ALERTS.map((alert, idx) => (
          <div
            key={idx}
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: alert.type === 'warning' ? 'rgba(243, 156, 18, 0.1)' : 'rgba(52, 152, 219, 0.1)',
              border: `1px solid ${alert.type === 'warning' ? '#F39C12' : '#3498DB'}`,
              color: alert.type === 'warning' ? '#D68910' : '#2874A6',
            }}
          >
            <span style={{ fontSize: '14px' }}>
              {alert.type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span>{alert.message}</span>
          </div>
        ))}
      </div>

      {/* Grade Distribution Chart */}
      <div
        style={{
          padding: '16px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--divider)',
        }}
      >
        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' }}>
          등급 분포
        </div>
        <GradeDistChart
          grades={grades}
          candidates={divisionCandidates}
          upperLimit={UPPER_LIMIT}
        />
      </div>

      {/* Editable Grade Table */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--divider)',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '12px',
          }}
        >
          <thead>
            <tr style={{ borderBottom: '1px solid var(--divider)' }}>
              <th style={{ textAlign: 'left', padding: '8px', fontWeight: '600', color: 'var(--text-muted)' }}>
                이름
              </th>
              <th style={{ textAlign: 'left', padding: '8px', fontWeight: '600', color: 'var(--text-muted)' }}>
                부서
              </th>
              <th style={{ textAlign: 'left', padding: '8px', fontWeight: '600', color: 'var(--text-muted)' }}>
                현재 등급
              </th>
              <th style={{ textAlign: 'left', padding: '8px', fontWeight: '600', color: 'var(--text-muted)' }}>
                조정 등급
              </th>
              <th style={{ textAlign: 'center', padding: '8px', fontWeight: '600', color: 'var(--text-muted)', width: '50px' }}>
                상태
              </th>
            </tr>
          </thead>
          <tbody>
            {divisionCandidates.map((candidate) => {
              const currentGrade = grades[candidate.id];
              const originalGrade = originalGrades[candidate.id];
              const isChanged = currentGrade !== originalGrade;

              return (
                <tr
                  key={candidate.id}
                  style={{
                    borderBottom: '1px solid var(--divider)',
                    backgroundColor: isChanged ? 'rgba(232, 87, 42, 0.05)' : 'transparent',
                  }}
                >
                  <td style={{ padding: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {candidate.name}
                  </td>
                  <td style={{ padding: '8px', color: 'var(--text-body)' }}>
                    {candidate.division}
                  </td>
                  <td style={{ padding: '8px', color: 'var(--text-muted)' }}>
                    {originalGrade}
                  </td>
                  <td style={{ padding: '8px' }}>
                    <select
                      value={currentGrade}
                      onChange={(e) => changeGrade(candidate.id, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--divider)',
                        fontSize: '12px',
                        fontFamily: 'var(--font-main)',
                        backgroundColor: 'var(--bg)',
                        cursor: 'pointer',
                        fontWeight: '600',
                        color: GRADE_COLORS[currentGrade] || 'var(--text-primary)',
                      }}
                    >
                      {GRADE_ORDER.map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ textAlign: 'center', padding: '8px' }}>
                    {isChanged && (
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '10px',
                          fontWeight: '600',
                          color: '#fff',
                          backgroundColor: 'var(--accent)',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        ✎ 변경
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

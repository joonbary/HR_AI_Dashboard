import { useMemo } from 'react';
import usePersonnelStore from '../../store/personnelStore';
import {
  CANDIDATES, GRADE_ORDER, GRADE_COLORS, BASE_TO_FINAL_MAP,
  ORG_EVAL_LIMITS, REF_DISTRIBUTION,
} from '../../data/personnelData';
import GradeDistChart from './GradeDistChart';

const DIVISIONS = ['전체', ...new Set(CANDIDATES.map((c) => c.entity))];
const ORG_GRADES = ['S', 'A+', 'A', 'B+', 'B', 'C', 'D'];

export default function CalibrationView() {
  const {
    selectedDivision, setSelectedDivision,
    orgEvalGrade, setOrgEvalGrade,
    grades, changeGrade,
  } = usePersonnelStore();

  const divisionCandidates = useMemo(() => {
    if (selectedDivision === '전체') return CANDIDATES;
    return CANDIDATES.filter((c) => c.entity === selectedDivision);
  }, [selectedDivision]);

  const originalGrades = useMemo(
    () => Object.fromEntries(CANDIDATES.map((c) => [c.id, c.finalGrade])), []
  );

  // 현재 등급 분포 계산
  const currentDist = useMemo(() => {
    const total = divisionCandidates.length;
    const counts = {};
    GRADE_ORDER.forEach(g => { counts[g] = 0; });
    divisionCandidates.forEach(c => {
      const g = grades[c.id] || c.finalGrade;
      counts[g] = (counts[g] || 0) + 1;
    });
    return { counts, total };
  }, [divisionCandidates, grades]);

  // 조직평가 연동 상한 (권고)
  const orgLimit = ORG_EVAL_LIMITS[orgEvalGrade] || ORG_EVAL_LIMITS['A'];

  // A이상 비율
  const aAboveCount = (currentDist.counts['S'] || 0) + (currentDist.counts['A+'] || 0) + (currentDist.counts['A'] || 0);
  const aAbovePct = currentDist.total > 0 ? ((aAboveCount / currentDist.total) * 100).toFixed(1) : 0;
  const aPlusCount = (currentDist.counts['S'] || 0) + (currentDist.counts['A+'] || 0);
  const aPlusPct = currentDist.total > 0 ? ((aPlusCount / currentDist.total) * 100).toFixed(1) : 0;

  // 편향 알림 자동 생성
  const biasAlerts = useMemo(() => {
    const alerts = [];
    if (parseFloat(aAbovePct) > orgLimit.aAbove) {
      alerts.push({ type: 'warning', message: `관대화 주의: A이상 ${aAbovePct}%가 권고 상한 ${orgLimit.aAbove}% 초과 (조직평가 ${orgEvalGrade})` });
    }
    if (parseFloat(aPlusPct) > orgLimit.aPlus) {
      alerts.push({ type: 'warning', message: `A+이상 ${aPlusPct}%가 권고 상한 ${orgLimit.aPlus}% 초과` });
    }
    // 기초등급 대비 과도한 상향 분화 검출
    const upshifts = divisionCandidates.filter(c => {
      const finalMap = BASE_TO_FINAL_MAP[c.baseGrade] || [];
      const current = grades[c.id] || c.finalGrade;
      return !finalMap.includes(current);
    });
    if (upshifts.length > 0) {
      alerts.push({ type: 'error', message: `기초등급 범위 이탈 ${upshifts.length}건 — Calibration 범위 밖 조정 (소명 필요)` });
    }
    return alerts;
  }, [divisionCandidates, grades, aAbovePct, aPlusPct, orgLimit, orgEvalGrade]);

  const selectStyle = {
    padding: '6px 10px', borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--divider)', fontSize: '12px',
    fontFamily: 'var(--font-main)', backgroundColor: 'var(--bg)', cursor: 'pointer',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      {/* Controls */}
      <div style={{
        display: 'flex', gap: '12px', padding: '12px 16px',
        backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius)',
        border: '1px solid var(--divider)', alignItems: 'center', flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>조직:</span>
        <select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)} style={selectStyle}>
          {DIVISIONS.map((div) => <option key={div} value={div}>{div}</option>)}
        </select>

        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', marginLeft: '12px' }}>조직평가:</span>
        <select value={orgEvalGrade} onChange={(e) => setOrgEvalGrade(e.target.value)} style={selectStyle}>
          {ORG_GRADES.map((g) => (
            <option key={g} value={g}>{g} ({ORG_EVAL_LIMITS[g].label})</option>
          ))}
        </select>

        {/* 상한 권고 표시 */}
        <div style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-muted)', display: 'flex', gap: '12px' }}>
          <span>A+이상 권고: <strong style={{ color: parseFloat(aPlusPct) > orgLimit.aPlus ? '#EF4444' : '#22C55E' }}>{aPlusPct}%</strong> / {orgLimit.aPlus}%</span>
          <span>A이상 권고: <strong style={{ color: parseFloat(aAbovePct) > orgLimit.aAbove ? '#EF4444' : '#22C55E' }}>{aAbovePct}%</strong> / {orgLimit.aAbove}%</span>
        </div>
      </div>

      {/* Bias Alerts */}
      {biasAlerts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {biasAlerts.map((alert, idx) => (
            <div key={idx} style={{
              padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: '12px',
              display: 'flex', alignItems: 'center', gap: '8px',
              backgroundColor: alert.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(243,156,18,0.1)',
              border: `1px solid ${alert.type === 'error' ? '#EF4444' : '#F39C12'}`,
              color: alert.type === 'error' ? '#DC2626' : '#D68910',
            }}>
              <span>{alert.type === 'error' ? '🔴' : '⚠️'}</span>
              <span>{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Grade Distribution Chart */}
      <div style={{
        padding: '16px', backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius)', border: '1px solid var(--divider)',
      }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' }}>
          등급 분포 (기초→최종 분화)
        </div>
        <GradeDistChart
          grades={grades}
          candidates={divisionCandidates}
          refDist={REF_DISTRIBUTION}
          orgLimit={orgLimit}
        />
      </div>

      {/* Editable Grade Table */}
      <div style={{
        flex: 1, overflow: 'auto', padding: '16px',
        backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius)',
        border: '1px solid var(--divider)',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--divider)' }}>
              {['이름', '부서', '직군', '기초등급', '최종등급 (조정)', '분화 범위', '상태'].map((h) => (
                <th key={h} style={{ textAlign: 'left', padding: '8px', fontWeight: '600', color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {divisionCandidates.map((candidate) => {
              const currentGrade = grades[candidate.id];
              const originalGrade = originalGrades[candidate.id];
              const isChanged = currentGrade !== originalGrade;
              const allowedRange = BASE_TO_FINAL_MAP[candidate.baseGrade] || [];
              const isOutOfRange = !allowedRange.includes(currentGrade);

              return (
                <tr key={candidate.id} style={{
                  borderBottom: '1px solid var(--divider)',
                  backgroundColor: isOutOfRange ? 'rgba(239,68,68,0.05)' : isChanged ? 'rgba(232,87,42,0.05)' : 'transparent',
                }}>
                  <td style={{ padding: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>{candidate.name}</td>
                  <td style={{ padding: '8px', color: 'var(--text-body)' }}>{candidate.division}</td>
                  <td style={{ padding: '8px', color: 'var(--text-body)' }}>
                    <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '3px', backgroundColor: 'var(--bg-subtle)' }}>
                      {candidate.jobFamily}
                    </span>
                  </td>
                  <td style={{ padding: '8px', fontWeight: '600', color: 'var(--text-muted)' }}>
                    {candidate.baseGrade}
                  </td>
                  <td style={{ padding: '8px' }}>
                    <select
                      value={currentGrade}
                      onChange={(e) => changeGrade(candidate.id, e.target.value)}
                      style={{
                        padding: '4px 8px', borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${isOutOfRange ? '#EF4444' : 'var(--divider)'}`,
                        fontSize: '12px', fontFamily: 'var(--font-main)',
                        backgroundColor: 'var(--bg)', cursor: 'pointer',
                        fontWeight: '600', color: GRADE_COLORS[currentGrade] || 'var(--text-primary)',
                      }}
                    >
                      {GRADE_ORDER.map((grade) => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '8px', fontSize: '10px', color: 'var(--text-muted)' }}>
                    {allowedRange.join(' / ')}
                  </td>
                  <td style={{ textAlign: 'center', padding: '8px' }}>
                    {isOutOfRange && (
                      <span style={{
                        fontSize: '10px', fontWeight: '600', color: '#fff',
                        backgroundColor: '#EF4444', padding: '2px 6px', borderRadius: '3px',
                      }}>⚠ 범위이탈</span>
                    )}
                    {!isOutOfRange && isChanged && (
                      <span style={{
                        fontSize: '10px', fontWeight: '600', color: '#fff',
                        backgroundColor: 'var(--accent)', padding: '2px 6px', borderRadius: '3px',
                      }}>✎ 변경</span>
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

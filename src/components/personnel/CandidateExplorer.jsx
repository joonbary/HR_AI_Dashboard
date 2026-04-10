import { useMemo } from 'react';
import usePersonnelStore from '../../store/personnelStore';
import { CANDIDATES, JOB_FAMILIES } from '../../data/personnelData';
import CandidateCard from './CandidateCard';
import DataTable from '../common/DataTable';

const ENTITIES = ['ALL', ...new Set(CANDIDATES.map((c) => c.entity))];
const GRADES = ['ALL', 'S', 'A+', 'A', 'B+', 'B', 'C', 'D'];
const ELIGIBLE_OPTIONS = ['ALL', 'eligible', 'ineligible'];
const JOB_FAMILY_OPTIONS = ['ALL', ...JOB_FAMILIES];

export default function CandidateExplorer() {
  const {
    filterEntity, setFilterEntity,
    filterGrade, setFilterGrade,
    filterEligible, setFilterEligible,
    filterJobFamily, setFilterJobFamily,
    searchText, setSearchText,
    viewMode, setViewMode,
    selectedCandidate, setSelectedCandidate,
    getFilteredCandidates,
  } = usePersonnelStore();

  const filtered = useMemo(() => getFilteredCandidates(), [
    filterEntity, filterGrade, filterEligible, filterJobFamily, searchText,
  ]);

  const eligibleCount = useMemo(
    () => CANDIDATES.filter((c) => c.eligible).length, []
  );

  // Table headers & rows for DataTable
  const tableHeaders = ['이름', '법인', '부서', '직군', '직종', '레벨', '기초', '최종', 'C', 'E', 'I', '자격', 'AI'];

  const tableRows = filtered.map((c) => [
    c.name,
    c.entity,
    c.dept,
    c.jobFamily,
    c.jobType,
    `${c.level} ${c.title}`,
    c.baseGrade,
    c.finalGrade,
    String(c.cei.c),
    String(c.cei.e),
    String(c.cei.i),
    c.eligible ? '✓' : c.discipline ? '⛔' : '-',
    `${c.aiScore}★`,
  ]);

  const selectStyle = {
    padding: '6px 10px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--divider)',
    fontSize: '12px',
    fontFamily: 'var(--font-main)',
    backgroundColor: 'var(--bg)',
    cursor: 'pointer',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      {/* Filter Bar */}
      <div
        style={{
          display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap',
          padding: '12px 16px', backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius)', border: '1px solid var(--divider)',
        }}
      >
        <input
          type="text" placeholder="이름, 부서, 법인, 직종 검색..."
          value={searchText} onChange={(e) => setSearchText(e.target.value)}
          style={{ ...selectStyle, minWidth: '180px' }}
        />
        <select value={filterEntity} onChange={(e) => setFilterEntity(e.target.value)} style={selectStyle}>
          {ENTITIES.map((ent) => (
            <option key={ent} value={ent}>{ent === 'ALL' ? '법인 전체' : ent}</option>
          ))}
        </select>
        <select value={filterJobFamily} onChange={(e) => setFilterJobFamily(e.target.value)} style={selectStyle}>
          {JOB_FAMILY_OPTIONS.map((jf) => (
            <option key={jf} value={jf}>{jf === 'ALL' ? '직군 전체' : jf}</option>
          ))}
        </select>
        <select value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)} style={selectStyle}>
          {GRADES.map((gr) => (
            <option key={gr} value={gr}>{gr === 'ALL' ? '최종등급 전체' : `${gr}`}</option>
          ))}
        </select>
        <select value={filterEligible} onChange={(e) => setFilterEligible(e.target.value)} style={selectStyle}>
          {ELIGIBLE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt === 'ALL' ? '자격 전체' : opt === 'eligible' ? '적격자만' : '부적격자만'}
            </option>
          ))}
        </select>

        {/* View Mode Toggle */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
          {[{ mode: 'card', label: '📇 Card' }, { mode: 'table', label: '📊 Table' }].map(({ mode, label }) => (
            <button key={mode} onClick={() => setViewMode(mode)} style={{
              padding: '6px 12px', borderRadius: 'var(--radius-sm)',
              border: viewMode === mode ? 'none' : '1px solid var(--divider)',
              backgroundColor: viewMode === mode ? 'var(--accent)' : 'var(--bg)',
              color: viewMode === mode ? '#fff' : 'var(--text-body)',
              fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s',
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Results Summary */}
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>
        전체 {CANDIDATES.length}명 중 {filtered.length}명 표시 · 승진 적격:{' '}
        <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{eligibleCount}명</span>
        {' '}· PL {CANDIDATES.filter(c => c.jobFamily === 'PL').length}명 / Non-PL {CANDIDATES.filter(c => c.jobFamily === 'Non-PL').length}명 / 매니저 {CANDIDATES.filter(c => c.jobFamily === '매니저').length}명
      </div>

      {/* Content: Card or Table View */}
      {viewMode === 'card' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px', flex: 1 }}>
          {filtered.map((candidate) => (
            <CandidateCard
              key={candidate.id} candidate={candidate}
              isSelected={selectedCandidate === candidate.id}
              onClick={() => setSelectedCandidate(candidate.id)}
            />
          ))}
        </div>
      ) : (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <DataTable headers={tableHeaders} rows={tableRows} />
        </div>
      )}
    </div>
  );
}

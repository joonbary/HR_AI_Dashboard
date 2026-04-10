import { useMemo } from 'react';
import usePersonnelStore from '../../store/personnelStore';
import { CANDIDATES } from '../../data/personnelData';
import CandidateCard from './CandidateCard';
import DataTable from '../common/DataTable';

const ENTITIES = ['ALL', ...new Set(CANDIDATES.map((c) => c.entity))];
const GRADES = ['ALL', 'S', 'A+', 'A', 'B+', 'B', 'C', 'D'];
const ELIGIBLE_OPTIONS = ['ALL', 'eligible', 'ineligible'];

export default function CandidateExplorer() {
  const {
    filterEntity,
    setFilterEntity,
    filterGrade,
    setFilterGrade,
    filterEligible,
    setFilterEligible,
    searchText,
    setSearchText,
    viewMode,
    setViewMode,
    selectedCandidate,
    setSelectedCandidate,
    getFilteredCandidates,
  } = usePersonnelStore();

  const filtered = useMemo(() => getFilteredCandidates(), [
    filterEntity,
    filterGrade,
    filterEligible,
    searchText,
  ]);

  const eligibleCount = useMemo(
    () => CANDIDATES.filter((c) => c.eligible).length,
    []
  );

  // Table headers & rows for DataTable (headers: string[], rows: string[][])
  const tableHeaders = ['이름', '법인', '부서', '직종', '레벨', '등급', 'C', 'E', 'I', '자격', 'AI'];

  const tableRows = filtered.map((c) => [
    c.name,
    c.entity,
    c.dept,
    c.jobType,
    c.level,
    c.grade,
    String(c.cei.c),
    String(c.cei.e),
    String(c.cei.i),
    c.eligible ? '✓' : '-',
    `${c.aiScore}★`,
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      {/* Filter Bar */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: '12px 16px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--divider)',
        }}
      >
        {/* Search Input */}
        <input
          type="text"
          placeholder="이름, 부서, 법인 검색..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--divider)',
            fontSize: '12px',
            fontFamily: 'var(--font-main)',
          }}
        />

        {/* Entity Dropdown */}
        <select
          value={filterEntity}
          onChange={(e) => setFilterEntity(e.target.value)}
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
          {ENTITIES.map((ent) => (
            <option key={ent} value={ent}>
              {ent === 'ALL' ? '법인 전체' : ent}
            </option>
          ))}
        </select>

        {/* Grade Dropdown */}
        <select
          value={filterGrade}
          onChange={(e) => setFilterGrade(e.target.value)}
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
          {GRADES.map((gr) => (
            <option key={gr} value={gr}>
              {gr === 'ALL' ? '등급 전체' : `등급 ${gr}`}
            </option>
          ))}
        </select>

        {/* Eligible Dropdown */}
        <select
          value={filterEligible}
          onChange={(e) => setFilterEligible(e.target.value)}
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
          {ELIGIBLE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt === 'ALL' && '자격 전체'}
              {opt === 'eligible' && '적격자만'}
              {opt === 'ineligible' && '부적격자만'}
            </option>
          ))}
        </select>

        {/* View Mode Toggle */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setViewMode('card')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: viewMode === 'card' ? 'none' : '1px solid var(--divider)',
              backgroundColor: viewMode === 'card' ? 'var(--accent)' : 'var(--bg)',
              color: viewMode === 'card' ? '#fff' : 'var(--text-body)',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            📇 Card
          </button>
          <button
            onClick={() => setViewMode('table')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: viewMode === 'table' ? 'none' : '1px solid var(--divider)',
              backgroundColor: viewMode === 'table' ? 'var(--accent)' : 'var(--bg)',
              color: viewMode === 'table' ? '#fff' : 'var(--text-body)',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            📊 Table
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div
        style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          fontWeight: '500',
        }}
      >
        전체 {CANDIDATES.length}명 중 {filtered.length}명 표시 · 승진 자격:{' '}
        <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{eligibleCount}명</span>
      </div>

      {/* Content: Card or Table View */}
      {viewMode === 'card' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px',
            flex: 1,
          }}
        >
          {filtered.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isSelected={selectedCandidate === candidate.id}
              onClick={() => setSelectedCandidate(candidate.id)}
              onAskCopilot={() => {
                // Hook into copilot (future implementation)
              }}
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

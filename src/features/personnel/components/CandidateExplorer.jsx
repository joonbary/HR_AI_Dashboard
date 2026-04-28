import { useMemo, useState } from 'react';
import usePersonnelStore from '../store/personnelStore';
import { CANDIDATES, JOB_FAMILIES } from '../data/personnelData';
import { checkEligibility } from '../rules/eligibilityRules';
import CandidateCard from './CandidateCard';
import DataTable from '../../../shared/ui/common/DataTable';

const ENTITIES = ['ALL', ...new Set(CANDIDATES.map((c) => c.entity))];
const LEVELS = ['ALL', 'Lv.1', 'Lv.2', 'Lv.3', 'Lv.4'];
const GRADES = ['ALL', 'S', 'A+', 'A', 'B+', 'B', 'C', 'D'];
const ELIGIBLE_OPTIONS = ['ALL', 'eligible', 'ineligible'];
const JOB_FAMILY_OPTIONS = ['ALL', ...JOB_FAMILIES];

const PAGE_SIZE = 50;

const eligibilityCache = new Map();
CANDIDATES.forEach((c) => {
  eligibilityCache.set(c.id, checkEligibility(c));
});

export default function CandidateExplorer() {
  const {
    filterEntity, setFilterEntity,
    filterGrade, setFilterGrade,
    filterEligible, setFilterEligible,
    filterJobFamily, setFilterJobFamily,
    searchText, setSearchText,
    viewMode, setViewMode,
    selectedCandidate, setSelectedCandidate,
  } = usePersonnelStore();

  const [filterLevel, setFilterLevel] = useState('ALL');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    return CANDIDATES.filter((c) => {
      if (filterEntity !== 'ALL' && c.entity !== filterEntity) return false;
      if (filterGrade !== 'ALL' && c.finalGrade !== filterGrade) return false;
      if (filterJobFamily !== 'ALL' && c.jobFamily !== filterJobFamily) return false;
      if (filterLevel !== 'ALL' && c.level !== filterLevel) return false;
      if (filterEligible !== 'ALL') {
        const elig = eligibilityCache.get(c.id);
        if (filterEligible === 'eligible' && !elig?.eligible) return false;
        if (filterEligible === 'ineligible' && elig?.eligible) return false;
      }
      if (searchText) {
        const q = searchText.toLowerCase();
        const fields = [c.name, c.dept, c.division, c.entity, c.jobType, c.title].join(' ').toLowerCase();
        if (!fields.includes(q)) return false;
      }
      return true;
    });
  }, [filterEntity, filterGrade, filterEligible, filterJobFamily, filterLevel, searchText]);

  const eligibleCount = useMemo(
    () => CANDIDATES.filter((c) => eligibilityCache.get(c.id)?.eligible).length, []
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(totalPages - 1, 0));
  const paged = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  const tableHeaders = [
    '\uC774\uB984',
    '\uBC95\uC778',
    '\uBD80\uC11C',
    '\uC9C1\uAD70',
    '\uC9C1\uC885',
    '\uB808\uBCA8',
    '\uAE30\uCD08',
    '\uCD5C\uC885',
    'C',
    'E',
    'I',
    '\uD569\uACC4',
    '\uC801\uACA9',
  ];

  const tableRows = paged.map((c) => {
    const elig = eligibilityCache.get(c.id);
    return [
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
      String(c.ceiTotal),
      elig?.eligible ? '\uC801\uACA9' : c.discipline ? '\uC81C\uD55C' : '-',
    ];
  });

  const selectStyle = {
    padding: '6px 10px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--divider)',
    fontSize: '12px',
    fontFamily: 'var(--font-main)',
    backgroundColor: 'var(--bg)',
    cursor: 'pointer',
  };

  const pageBtnStyle = (active) => ({
    padding: '4px 10px',
    borderRadius: 'var(--radius-sm)',
    border: active ? 'none' : '1px solid var(--divider)',
    backgroundColor: active ? 'var(--accent)' : 'var(--bg)',
    color: active ? '#fff' : 'var(--text-body)',
    fontSize: '11px',
    cursor: 'pointer',
    fontWeight: '500',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      <div
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: '12px 16px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--divider)',
        }}
      >
        <input
          type="text"
          placeholder="\uC774\uB984, \uBD80\uC11C, \uBC95\uC778, \uC9C1\uC885\uC73C\uB85C \uAC80\uC0C9..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ ...selectStyle, minWidth: '220px' }}
        />
        <select value={filterEntity} onChange={(e) => setFilterEntity(e.target.value)} style={selectStyle}>
          {ENTITIES.map((ent) => (
            <option key={ent} value={ent}>{ent === 'ALL' ? '\uC804\uCCB4 \uBC95\uC778' : ent}</option>
          ))}
        </select>
        <select value={filterJobFamily} onChange={(e) => setFilterJobFamily(e.target.value)} style={selectStyle}>
          {JOB_FAMILY_OPTIONS.map((jf) => (
            <option key={jf} value={jf}>{jf === 'ALL' ? '\uC804\uCCB4 \uC9C1\uAD70' : jf}</option>
          ))}
        </select>
        <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} style={selectStyle}>
          {LEVELS.map((lv) => (
            <option key={lv} value={lv}>{lv === 'ALL' ? '\uC804\uCCB4 \uB808\uBCA8' : lv}</option>
          ))}
        </select>
        <select value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)} style={selectStyle}>
          {GRADES.map((gr) => (
            <option key={gr} value={gr}>{gr === 'ALL' ? '\uC804\uCCB4 \uB4F1\uAE09' : gr}</option>
          ))}
        </select>
        <select value={filterEligible} onChange={(e) => setFilterEligible(e.target.value)} style={selectStyle}>
          {ELIGIBLE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt === 'ALL' ? '\uC804\uCCB4 \uD310\uC815' : opt === 'eligible' ? '\uC801\uACA9\uB9CC' : '\uBD80\uC801\uACA9\uB9CC'}
            </option>
          ))}
        </select>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
          {[{ mode: 'card', label: '\uCE74\uB4DC' }, { mode: 'table', label: '\uD14C\uC774\uBE14' }].map(({ mode, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: viewMode === mode ? 'none' : '1px solid var(--divider)',
                backgroundColor: viewMode === mode ? 'var(--accent)' : 'var(--bg)',
                color: viewMode === mode ? '#fff' : 'var(--text-body)',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>
          \uC804\uCCB4 <strong>{CANDIDATES.length}</strong>\uBA85, \uD45C\uC2DC <strong>{filtered.length}</strong>\uBA85, \uC801\uACA9 <strong>{eligibleCount}</strong>\uBA85
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <button onClick={() => setPage(Math.max(0, safePage - 1))} disabled={safePage === 0} style={pageBtnStyle(false)}>{'\uC774\uC804'}</button>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '0 6px' }}>
              {safePage + 1} / {totalPages} ({safePage * PAGE_SIZE + 1}~{Math.min((safePage + 1) * PAGE_SIZE, filtered.length)})
            </span>
            <button onClick={() => setPage(Math.min(totalPages - 1, safePage + 1))} disabled={safePage >= totalPages - 1} style={pageBtnStyle(false)}>{'\uB2E4\uC74C'}</button>
          </div>
        )}
      </div>

      {viewMode === 'card' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px', flex: 1 }}>
          {paged.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
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

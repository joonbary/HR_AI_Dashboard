import usePersonnelStore from '../store/personnelStore';
import { CANDIDATES, SCENARIOS } from '../data/personnelData';

const CEREMONY_TYPES = ['slides', 'certificates', 'scenario'];

/** 실제 사령장 수여 스크립트 구조 반영 — 8그룹 호명 체계 */
const CEREMONY_GROUPS = [
  { id: 'lv3_promo', label: '차장 승진', icon: '⬆️' },
  { id: 'lv4_promo', label: '부장 승진', icon: '⬆️' },
  { id: 'elevation_team', label: '팀장·지점장 승격', icon: '👑' },
  { id: 'elevation_dept', label: '부장 승격', icon: '👑' },
  { id: 'new_exec', label: '신규 임원 선임', icon: '🌟' },
  { id: 'exec_promo', label: '임원 승진', icon: '🌟' },
  { id: 'ceo_appoint', label: '대표이사 선임', icon: '🎯' },
  { id: 'new_exec_intro', label: '신규 임원 소개', icon: '👋' },
];

export default function CeremonyView() {
  const { ceremonyType, setCeremonyType, activeScenario } = usePersonnelStore();
  const scenario = SCENARIOS.length > 0 ? (SCENARIOS[activeScenario] || SCENARIOS[0]) : null;

  if (!scenario) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '100%', gap: '16px', padding: '40px',
      }}>
        <div style={{ fontSize: '48px' }}>🎓</div>
        <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
          세레모니 준비 대기
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '400px', lineHeight: '1.6' }}>
          인사안 시나리오가 편성되면 사령장 수여식 슬라이드, 사령장 문안, MC 시나리오가 자동 생성됩니다.
          인사안 편집 탭에서 시나리오를 먼저 구성해 주세요.
        </div>
        <div style={{
          padding: '12px 16px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius)',
          border: '1px solid var(--divider)', fontSize: '12px', color: 'var(--text-body)',
        }}>
          참고: 실제 사령장 수여 예식은 8그룹 호명 체계 (차장승진 → 부장승진 → 팀장·지점장 승격 → 부장승격 → 신규임원 → 임원승진 → 대표이사 → 신규임원소개)
        </div>
      </div>
    );
  }

  // 시나리오에서 승진·승격 대상자 추출
  const promotees = scenario.actions
    .filter(a => a.type === 'promotion' || a.type === 'elevation')
    .map(a => {
      const c = CANDIDATES.find(x => x.id === a.candidateId);
      return c ? { ...a, candidate: c } : null;
    })
    .filter(Boolean);

  // 사령장 데이터
  const certificates = promotees.map((p, i) => ({
    id: i + 1,
    name: p.candidate.name,
    entity: p.candidate.entity,
    from: p.from,
    to: p.to,
    type: p.type === 'promotion' ? '승진 사령장' : '승격 사령장',
    text: `사 령 장\n\n${p.candidate.entity} ${p.candidate.division}\n${p.candidate.name}\n\n${p.to}에 급함\n\n2026년 8월 1일\n오케이금융그룹 회장`,
  }));

  // MC 시나리오 (실제 스크립트 구조 반영)
  const mcScript = `[도입 인사]
안녕하십니까, 인사파트 OOO입니다.
지금부터 2026년 하반기 정기인사 사령장 수여식을 시작하겠습니다.

이번 정기인사는 평가심의위원회의 면밀한 검토를 거쳐,
역량과 성과를 중심으로 선발된 인재들에 대한 인사입니다.

[회장님 소개]
사령장 수여를 위해 회장님을 소개합니다.

${promotees.map((p, i) => {
  const label = p.type === 'promotion' ? '승진' : '승격';
  return `[${label} ${i + 1}]
${p.candidate.entity} ${p.candidate.division} ${p.candidate.name}
"사령장, ${p.candidate.entity} ${p.candidate.division} ${p.candidate.name}, ${p.to}에 급함"
"2026년 8월 1일 오케이금융그룹 회장"

차렷, 인사.`;
}).join('\n\n')}

[폐식 인사]
이상으로 2026년 하반기 정기인사 사령장 수여식을 마치겠습니다.
승진·승격하신 모든 분들의 앞날에 더 큰 성과가 함께하시길 바랍니다.
감사합니다.`;

  // 슬라이드 데이터
  const slides = [
    { id: 1, title: 'Opening', subtitle: '2026 하반기 정기인사 사령장 수여식', color: 'var(--accent)' },
    ...promotees.map((p, i) => ({
      id: i + 2,
      title: p.candidate.name,
      subtitle: `${p.from} → ${p.to}`,
      color: p.type === 'promotion' ? '#22C55E' : '#7C3AED',
    })),
    { id: promotees.length + 2, title: 'Closing', subtitle: '축하의 박수 부탁드립니다', color: 'var(--accent)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      {/* Type Selector */}
      <div style={{
        display: 'flex', gap: '8px', padding: '12px 16px',
        backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius)',
        border: '1px solid var(--divider)', alignItems: 'center',
      }}>
        {CEREMONY_TYPES.map((type) => {
          const labels = { slides: '프로모션 슬라이드', certificates: '사령장', scenario: 'MC 시나리오' };
          return (
            <button key={type} onClick={() => setCeremonyType(type)} style={{
              padding: '6px 14px', borderRadius: 'var(--radius-sm)',
              border: ceremonyType === type ? 'none' : '1px solid var(--divider)',
              backgroundColor: ceremonyType === type ? 'var(--accent)' : 'var(--bg)',
              color: ceremonyType === type ? '#fff' : 'var(--text-body)',
              fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s',
            }}>{labels[type]}</button>
          );
        })}
        <div style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-muted)' }}>
          시나리오 「{scenario.name}」 기준 · 대상자 {promotees.length}명
        </div>
        <button style={{
          padding: '6px 14px', borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--divider)', backgroundColor: 'var(--bg)',
          color: 'var(--text-body)', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
        }}>⬇️ 전체 다운로드</button>
      </div>

      {/* Slides View */}
      {ceremonyType === 'slides' && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
            {slides.map((slide) => (
              <div key={slide.id} style={{
                position: 'relative', paddingBottom: '56.25%',
                backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius)',
                border: '1px solid var(--divider)', overflow: 'hidden', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  background: `linear-gradient(135deg, ${slide.color} 0%, ${slide.color}99 100%)`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '20px', textAlign: 'center', color: '#fff',
                }}>
                  <div style={{ fontSize: '10px', opacity: 0.7, marginBottom: '4px' }}>Slide {slide.id}</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>{slide.title}</div>
                  <div style={{ fontSize: '12px', opacity: 0.9 }}>{slide.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificates View */}
      {ceremonyType === 'certificates' && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
            {certificates.map((cert) => (
              <div key={cert.id} style={{
                padding: '24px', backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius)', border: '2px solid var(--ok-gold)',
                textAlign: 'center', minHeight: '280px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--accent)', marginBottom: '16px' }}>
                    ✦ {cert.type}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>{cert.entity}</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>{cert.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-body)', marginBottom: '6px' }}>
                    {cert.to}에 급함
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>({cert.from} → {cert.to})</div>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--divider)', paddingTop: '12px' }}>
                  <div>2026년 8월 1일</div>
                  <div style={{ marginTop: '4px', fontWeight: '600' }}>오케이금융그룹 회장</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MC Scenario View */}
      {ceremonyType === 'scenario' && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <div style={{
            padding: '20px', backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius)', border: '1px solid var(--divider)',
            fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: '1.8',
            color: 'var(--text-body)', whiteSpace: 'pre-wrap', wordWrap: 'break-word',
          }}>
            {mcScript}
          </div>
        </div>
      )}
    </div>
  );
}
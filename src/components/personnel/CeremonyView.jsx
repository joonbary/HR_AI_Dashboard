import usePersonnelStore from '../../store/personnelStore';

const CEREMONY_TYPES = ['slides', 'certificates', 'scenario'];

export default function CeremonyView() {
  const { ceremonyType, setCeremonyType } = usePersonnelStore();

  // Mock slide data
  const slides = [
    { id: 1, title: 'Opening Slide', subtitle: '2026 하반기 정기인사 공식 선포' },
    { id: 2, title: 'Achievement Highlights', subtitle: '주요 성과자 소개' },
    { id: 3, title: 'Closing Remarks', subtitle: '임원 축사' },
  ];

  // Mock certificate data
  const certificates = [
    { id: 1, name: '이서연', rank: '과장', certificate: '승진 사령장' },
    { id: 2, name: '김민수', rank: '과장', certificate: '승진 사령장' },
    { id: 3, name: '한소희', rank: '과장', certificate: '승진 사령장' },
  ];

  // Mock MC script
  const mcScript = `
[Opening]
안녕하세요, 여러분. 2026년 하반기 정기인사 세레모니에 오신 것을 환영합니다.

[Executive Summary]
오늘은 우리 조직의 미래를 이끌 주요 인사가 있는 날입니다.
총 3명의 동료들이 새로운 직책으로 승진하게 되며, 이들은 우리의 AI 전환 전략에서 핵심 역할을 담당할 것입니다.

[Honorable Mentions]
첫 번째 승진자, 이서연 과장입니다.
AIRISS v4 개발을 주도하여 회사의 AI 역량을 한 단계 높인 핵심 인재입니다.

[Closing]
축하의 박수 부탁드립니다.
  `.trim();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      {/* Type Selector */}
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
        {CEREMONY_TYPES.map((type) => {
          const labels = { slides: '프로모션 슬라이드', certificates: '사령장', scenario: 'MC 시나리오' };
          return (
            <button
              key={type}
              onClick={() => setCeremonyType(type)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                border: ceremonyType === type ? 'none' : '1px solid var(--divider)',
                backgroundColor: ceremonyType === type ? 'var(--accent)' : 'var(--bg)',
                color: ceremonyType === type ? '#fff' : 'var(--text-body)',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {labels[type]}
            </button>
          );
        })}

        <button
          style={{
            marginLeft: 'auto',
            padding: '6px 14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--divider)',
            backgroundColor: 'var(--bg)',
            color: 'var(--text-body)',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          ⬇️ 전체 다운로드
        </button>
      </div>

      {/* Content */}
      {ceremonyType === 'slides' && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
            {slides.map((slide) => (
              <div
                key={slide.id}
                style={{
                  position: 'relative',
                  paddingBottom: '56.25%', // 16:9 aspect ratio
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--divider)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, var(--accent) 0%, var(--ok-orange) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    textAlign: 'center',
                    color: '#fff',
                    boxShadow: 'var(--shadow)',
                  }}
                >
                  <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
                    Slide {slide.id}
                  </div>
                  <div style={{ fontSize: '14px' }}>{slide.title}</div>
                  <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>
                    {slide.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {ceremonyType === 'certificates' && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
            {certificates.map((cert) => (
              <div
                key={cert.id}
                style={{
                  padding: '24px',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius)',
                  border: '2px solid var(--ok-gold)',
                  textAlign: 'center',
                  minHeight: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent)', marginBottom: '16px' }}>
                    ✦ {cert.certificate}
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {cert.name}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                    {cert.rank}으로 승진하심
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    borderTop: '1px solid var(--divider)',
                    paddingTop: '12px',
                  }}
                >
                  <div>OK금융그룹 일동</div>
                  <div style={{ marginTop: '4px' }}>2026년 7월</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {ceremonyType === 'scenario' && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <div
            style={{
              padding: '20px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--divider)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              lineHeight: '1.8',
              color: 'var(--text-body)',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
            }}
          >
            {mcScript}
          </div>
        </div>
      )}
    </div>
  );
}

# OK금융그룹 HR Dashboard + AI Copilot

인사부 전용 HR 대시보드 및 AI 코파일럿 시스템

## 주요 기능

- **HR 대시보드**: 인력현황, 채용/퇴직, 근속연수, 직급분포, 성별/연령 분석, 조직도 등 7개 탭
- **AI Copilot**: Claude API 기반 HR 질의응답 (자연어로 인사 데이터 조회)
- **조직도**: D3.js 기반 인터랙티브 조직도 + PPT 다운로드 기능

## 파일 구성

| 파일 | 설명 |
|------|------|
| `HR_Dashboard_v5.html` | 메인 대시보드 (단일 HTML, 브라우저에서 바로 실행) |
| `copilot_server.py` | AI Copilot용 Python HTTP 서버 (Claude API 프록시) |
| `RPT_OK금융그룹_조직도_20260304_v1.pptx` | 조직도 PPT (전체 법인별 조직 구조) |

## 실행 방법

### 대시보드만 사용
```bash
# 브라우저에서 직접 열기
open HR_Dashboard_v5.html
```

### AI Copilot 포함 실행
```bash
# 1. 환경변수 설정
export ANTHROPIC_API_KEY="your-api-key"

# 2. 서버 실행
python copilot_server.py

# 3. 브라우저에서 http://localhost:8000 접속
```

## 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), D3.js, Chart.js, PptxGenJS
- **Backend**: Python HTTP Server, Claude API
- **데이터**: OK금융그룹 사원명부 기반 (7개 법인, 1,738명)

## 법인 구성

OK홀딩스 · OK저축은행 · OK캐피탈 · ACI신용정보 · AFI에프앤아이 · OKAX · ON+소규모

---

*OK금융그룹 인사부 AI 동료 프로젝트*

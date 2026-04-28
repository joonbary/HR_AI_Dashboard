# OK금융그룹 HR Dashboard + AI Copilot

## Current React App Structure

The React codebase is split by app boundary and shared foundation:

| Area | Path | Responsibility |
|------|------|----------------|
| HR Dashboard app | `apps/hr-dashboard/` | Dashboard entry point |
| Personnel app | `apps/personnel-app/` | Regular personnel review entry point |
| HR Dashboard feature | `src/features/hr-dashboard/` | Dashboard tabs, filters, dashboard-only store |
| Personnel feature | `src/features/personnel/` | Personnel workflow, candidate data, personnel-only store |
| Shared UI | `src/shared/ui/` | Reusable UI primitives such as KPI cards, data tables, chart cards |
| Shared Store | `src/shared/store/` | Cross-app UI state such as Copilot panel/messages |
| Shared Services | `src/services/copilot/` | Copilot client and app-specific context builders |

Detailed architecture notes are in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

Copilot routes are app-scoped:

```text
POST /api/copilot/dashboard
POST /api/copilot/personnel
POST /api/chat                # legacy dashboard-compatible route
```

---
# OK湲덉쑖洹몃９ HR Dashboard + AI Copilot

?몄궗遺 ?꾩슜 HR ??쒕낫??諛?AI 肄뷀뙆?쇰읉 ?쒖뒪??

## 二쇱슂 湲곕뒫

- **HR ??쒕낫??*: ?몃젰?꾪솴, 梨꾩슜/?댁쭅, 洹쇱냽?곗닔, 吏곴툒遺꾪룷, ?깅퀎/?곕졊 遺꾩꽍, 議곗쭅????7媛???
- **AI Copilot**: Claude API 湲곕컲 HR 吏덉쓽?묐떟 (?먯뿰?대줈 ?몄궗 ?곗씠??議고쉶)
- **議곗쭅??*: D3.js 湲곕컲 ?명꽣?숉떚釉?議곗쭅??+ PPT ?ㅼ슫濡쒕뱶 湲곕뒫

## ?뚯씪 援ъ꽦

| ?뚯씪 | ?ㅻ챸 |
|------|------|
| `apps/hr-dashboard/` | HR ??쒕낫?????뷀듃由ы룷?명듃 |
| `apps/personnel-app/` | ?뺢린?몄궗 ?좏뵆由ъ??댁뀡 ?뷀듃由ы룷?명듃 |
| `src/` | ???깆씠 怨듭쑀?섎뒗 而댄룷?뚰듃, ?곗씠?? ?ㅽ???|
| `HR_Dashboard_v5.html` | 硫붿씤 ??쒕낫??(?⑥씪 HTML, 釉뚮씪?곗??먯꽌 諛붾줈 ?ㅽ뻾) |
| `copilot_server.py` | AI Copilot??Python HTTP ?쒕쾭 (Claude API ?꾨줉?? |
| `RPT_OK湲덉쑖洹몃９_議곗쭅??20260304_v1.pptx` | 議곗쭅??PPT (?꾩껜 踰뺤씤蹂?議곗쭅 援ъ“) |

## ?ㅽ뻾 諛⑸쾿

### ??쒕낫?쒕쭔 ?ъ슜
```bash
# 釉뚮씪?곗??먯꽌 吏곸젒 ?닿린
open HR_Dashboard_v5.html
```

### AI Copilot ?ы븿 ?ㅽ뻾
```bash
# 1. ?섍꼍蹂???ㅼ젙
export ANTHROPIC_API_KEY="your-api-key"

# 2. ?쒕쾭 ?ㅽ뻾
python copilot_server.py

# 3. 釉뚮씪?곗??먯꽌 http://localhost:8000 ?묒냽
```

### React ???ㅽ뻾
```bash
npm.cmd install
npm.cmd run dev

Copilot 개발 서버를 함께 사용할 때는 별도 터미널에서 실행:

```bash
npm.cmd run copilot
```

Vite 개발 서버는 `/api` 요청을 `http://localhost:8080`으로 프록시합니다.```

- HR ??쒕낫?? `http://localhost:5173/HR_AI_Dashboard/`
- ?뺢린?몄궗 ?? `http://localhost:5173/HR_AI_Dashboard/apps/personnel-app/`

## 湲곗닠 ?ㅽ깮

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), D3.js, Chart.js, PptxGenJS
- **Backend**: Python HTTP Server, Claude API
- **?곗씠??*: OK湲덉쑖洹몃９ ?ъ썝紐낅? 湲곕컲 (7媛?踰뺤씤, 1,738紐?

## 踰뺤씤 援ъ꽦

OK??⑹뒪 쨌 OK?異뺤???쨌 OK罹먰뵾??쨌 ACI?좎슜?뺣낫 쨌 AFI?먰봽?ㅼ븘??쨌 OKAX 쨌 ON+?뚭퇋紐?

---

*OK湲덉쑖洹몃９ ?몄궗遺 AI ?숇즺 ?꾨줈?앺듃*

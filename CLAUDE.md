# Current Architecture Notes

Before making structural changes, check `docs/ARCHITECTURE.md` and `KNOWN_ISSUES.md`.

Current React boundaries:

- HR Dashboard app shell: `apps/hr-dashboard/`
- Personnel app shell: `apps/personnel-app/`
- HR Dashboard feature code: `src/features/hr-dashboard/`
- Personnel feature code: `src/features/personnel/`
- Shared UI primitives: `src/shared/ui/`
- Shared cross-app state: `src/shared/store/`
- Shared Copilot service/client/context: `src/services/copilot/`

State ownership:

- Dashboard state lives in `src/features/hr-dashboard/store/dashboardStore.js`.
- Personnel workflow state lives in `src/features/personnel/store/personnelStore.js`.
- Copilot open state and messages live in `src/shared/store/copilotStore.js`.

Copilot routes:

- `POST /api/copilot/dashboard`
- `POST /api/copilot/personnel`
- `POST /api/chat` remains only as a legacy dashboard-compatible route.

---
# HR Dashboard - ?꾨줈?앺듃 猷?
> ?묒뾽 ?쒖옉 ??`KNOWN_ISSUES.md`瑜?癒쇱? ?뺤씤?쒕떎. ?뱁엳 Windows PowerShell??`npm.cmd`, `node_modules` ?좉툑, Vite 媛쒕컻 ?쒕쾭/localhost ?ㅻ쪟 ?щ컻 諛⑹? ?덉감瑜??곕Ⅸ??

## ?꾨줈?앺듃 媛쒖슂

OK湲덉쑖洹몃９ ?몄궗遺 ?꾩슜 HR ??쒕낫??+ AI Copilot ?쒖뒪??
React (Vite) ??ㅽ깮 ?꾪솚 ?꾨줈?앺듃

- **GitHub**: https://github.com/joonbary/HR_AI_Dashboard
- **諛고룷**: https://joonbary.github.io/HR_AI_Dashboard/ (v5 HTML 踰꾩쟾)
- **?곹깭**: React ?꾪솚 吏꾪뻾 以?(P9), HR ??쒕낫?쒖? ?뺢린?몄궗 ?깆쓣 遺꾨━ ?댁쁺

---

## ??遺꾨━ 援ъ“

| ??| 寃쎈줈 | ??븷 |
|----|------|------|
| HR Dashboard | `apps/hr-dashboard/` | ?몃젰?꾪솴, ?깃낵쨌蹂댁긽, AI?꾪솚, 由ъ뒪?? ?몄궗?댄듃, ?꾩썝?붿빟, 議곗쭅??|
| Personnel App | `apps/personnel-app/` | ??곸옄 ?먯깋, Calibration, ?몄궗?? 蹂닿퀬 紐⑤뱶, ?몃젅紐⑤땲, Decision Log |
| Shared Source | `src/` | ???깆씠 怨듭쑀?섎뒗 而댄룷?뚰듃, ?곗씠?? ?ㅽ??? ?ㅽ넗??|

媛쒕컻 ?쒕쾭 湲곗? URL:

```text
http://localhost:5173/HR_AI_Dashboard/
http://localhost:5173/HR_AI_Dashboard/apps/personnel-app/
```

---

## 湲곗닠 ?ㅽ깮

| ?덉씠??| 湲곗닠 | 鍮꾧퀬 |
|--------|------|------|
| Frontend | React 19 + Vite 8 | SPA, CSR |
| ?곹깭愿由?| Zustand | 寃쎈웾 ?ㅽ넗??|
| 李⑦듃 | Chart.js 4 + react-chartjs-2 | 15媛?李⑦듃 |
| 議곗쭅??| D3.js 7 | SVG ?몃━ ?뚮뜑留?|
| PPT ?앹꽦 | PptxGenJS | ?대씪?댁뼵???ъ씠??|
| ?ㅽ???| CSS Variables + 而ㅼ뒪? CSS | ?ㅽ겕紐⑤뱶 ?鍮?|
| Backend (?덉젙) | Python FastAPI | Claude API ?꾨줉??|
| DB (?덉젙) | SQLite ??PostgreSQL | ?몃젰 ?곗씠?????|

---

## ?붾젆?좊━ 援ъ“

```
src/
?쒋?? components/
??  ?쒋?? layout/          TopBar, FilterBar
??  ?쒋?? tabs/            WorkforceTab, PerformanceTab, AITab, RiskTab,
??  ??                   InsightsTab, ExecTab, OrgTab
??  ?쒋?? charts/          ChartCard (踰붿슜 Chart.js ?섑띁)
??  ?쒋?? common/          KpiCard, DataTable
??  ?붴?? copilot/         CopilotPanel
?쒋?? data/
??  ?쒋?? dashboardData.js   D 媛앹껜 (?몃젰쨌?깃낵쨌?멸굔鍮꽷텮WTA ?쒓퀎??
??  ?쒋?? orgTreeData.js     議곗쭅???몃━ (7媛?踰뺤씤)
??  ?붴?? riskData.js        由ъ뒪??留ㅽ듃由?뒪 怨꾩궛
?쒋?? store/
??  ?붴?? useStore.js        Zustand 湲濡쒕쾶 ?ㅽ넗??
?쒋?? hooks/
??  ?붴?? useFilteredData.js ?꾪꽣 ?곸슜 ?곗씠????
?쒋?? styles/
??  ?붴?? theme.css          ?붿옄???좏겙 + ?꾩껜 ?ㅽ???
?쒋?? api/                   (?덉젙) API ?대씪?댁뼵??
?쒋?? App.jsx                猷⑦듃 而댄룷?뚰듃
?붴?? main.jsx               ?뷀듃由ы룷?명듃
```

---

## 7媛???援ъ꽦

| Tab | 而댄룷?뚰듃 | 李⑦듃 ??| ?듭떖 ?곗씠??|
|-----|---------|---------|------------|
| ?몃젰?꾪솴 | WorkforceTab | 10 | headcount, jobtype, jobgroup, gender, entry/resign |
| ?깃낵쨌蹂댁긽 | PerformanceTab | 4 | evalDist, aAbove, laborCost |
| AI?꾪솚 | AITab | 2 | awta, shift |
| 由ъ뒪??| RiskTab | 2 | calcRiskData() ?숈쟻 怨꾩궛 |
| HR?몄궗?댄듃 | InsightsTab | 0 | insights 諛곗뿴 (移댄뀒怨좊━ ?꾪꽣) |
| ?꾩썝?붿빟 | ExecTab | 2 | 吏묎퀎 KPI + Action Items |
| 議곗쭅??| OrgTab | 0 | ORG_TREE_DATA (?몃━ 而댄룷?뚰듃) |

---

## ?곗씠???먮쫫

```
D (dashboardData.js) ??? ?뺤쟻 JSON (?ъ썝紐낅? 湲곕컲)
  ??
  ?쒋?? useStore (Zustand) ??? company, year ?꾪꽣 ?곹깭
  ??
  ?쒋?? useFilteredData() ??? ?꾪꽣 ?곸슜??吏묎퀎 ?곗씠??
  ??
  ?붴?? 媛?Tab 而댄룷?뚰듃 ??? useMemo濡?Chart.js config ?앹꽦
                            ?붴?? ChartCard媛 canvas???뚮뜑留?
```

---

## OK湲덉쑖洹몃９ CI

| ??ぉ | 媛?|
|------|-----|
| OK Orange | `#F77310` |
| Accent | `#E8572A` |
| OK Gold | `#FCAF17` |
| Dark Gray | `#353C41` |
| ?고듃 | Pretendard > 留묒? 怨좊뵓 |

---

## 媛쒕컻 紐낅졊??

```bash
npm install          # ?섏〈???ㅼ튂
npm run dev          # 媛쒕컻 ?쒕쾭 (HMR)
npm run build        # ?꾨줈?뺤뀡 鍮뚮뱶
npm run preview      # 鍮뚮뱶 寃곌낵 誘몃━蹂닿린
```

---

## ?ν썑 濡쒕뱶留?

### Phase 2 (?꾩옱)
- [ ] React ?꾪솚 ?꾨즺 (紐⑤뱺 ??湲곕뒫 ?숇벑???뺣낫)
- [ ] D3.js 議곗쭅????React ?듯빀 (useRef + useEffect)
- [ ] PptxGenJS PPT ?ㅼ슫濡쒕뱶 React ?곕룞
- [ ] ?ㅽ겕紐⑤뱶 援ы쁽

### Phase 3
- [ ] FastAPI 諛깆뿏??援ъ텞
- [ ] Claude API Copilot ?ㅼ젣 ?곕룞
- [ ] SQLite ???ㅼ떆媛??곗씠???곕룞
- [ ] ?ъ썝紐낅? Excel ?낅줈?????먮룞 ?뚯떛

### Phase 4
- [ ] ?몄쬆/沅뚰븳 (RBAC: CEO/遺?쒖옣/?ㅻТ)
- [ ] GitHub Actions CI/CD
- [ ] 5媛쒕뀈 ?몃젋???곗씠??蹂닿컯
- [ ] 紐⑤컮??理쒖쟻??

---

## 媛쒕컻 而⑤깽??

### 釉뚮옖移??꾨왂

| 釉뚮옖移?| ?⑸룄 | 癒몄? ???|
|--------|------|-----------|
| `main` | ?꾨줈?뺤뀡 (GitHub Pages 諛고룷) | ??|
| `dev` | 媛쒕컻 ?듯빀 | ??main (?덉젙???? |
| `feature/*` | 湲곕뒫 媛쒕컻 | ??dev |
| `hotfix/*` | 湲닿툒 ?섏젙 | ??main + dev |

- `main` 吏곸젒 而ㅻ컠 湲덉? ??PR???듯빐?쒕쭔 癒몄?
- 釉뚮옖移섎챸 ?덉떆: `feature/dark-mode`, `feature/copilot-api`, `hotfix/chart-render-fix`

### 而ㅻ컠 硫붿떆吏

```
[??? ?쒓? ?붿빟 (50???대궡)

?곸꽭 ?ㅻ챸 (?꾩슂 ??
```

| ???| ?⑸룄 |
|------|------|
| `feat` | ??湲곕뒫 |
| `fix` | 踰꾧렇 ?섏젙 |
| `refactor` | 由ы뙥?좊쭅 (湲곕뒫 蹂寃??놁쓬) |
| `style` | CSS/UI 蹂寃?|
| `data` | ?곗씠???뚯씪 異붽?/?섏젙 |
| `docs` | 臾몄꽌 ?섏젙 |
| `chore` | 鍮뚮뱶/?ㅼ젙 蹂寃?|

?덉떆: `[feat] ?ㅽ겕紐⑤뱶 ?좉? 援ы쁽`, `[fix] 議곗쭅???몃━ ?뚮뜑留??ㅻ쪟 ?섏젙`

### 肄붾뱶 ?ㅽ???

- **而댄룷?뚰듃**: React FC (?⑥닔??, PascalCase ?뚯씪紐?(`WorkforceTab.jsx`)
- **??*: `use` ?묐몢?? camelCase (`useFilteredData.js`)
- **?곗씠??*: camelCase ?뚯씪紐?(`dashboardData.js`)
- **?곸닔**: UPPER_SNAKE_CASE (`ORG_TREE_DATA`)
- **CSS**: CSS Variables 湲곕컲, BEM 遺덊븘??(theme.css 以묒븰 愿由?
- **李⑦듃**: ChartCard ?섑띁 ?ъ슜, 吏곸젒 Canvas 議곗옉 湲덉?
- **?곹깭**: Zustand useStore ?듯빐?쒕쭔 湲濡쒕쾶 ?곹깭 愿由?

### PR ?꾨줈?몄뒪

1. `feature/*` 釉뚮옖移섏뿉???묒뾽
2. `npm run build` ?깃났 ?뺤씤
3. PR ?앹꽦 ??蹂寃??ы빆 ?붿빟 + ?ㅽ겕由곗꺑 (UI 蹂寃???
4. `dev`濡?癒몄? ???듯빀 ?뚯뒪??
5. `dev` ??`main` 癒몄? ??GitHub Pages ?먮룞 諛고룷

### 湲덉? ?ы빆

- `node_modules/`, `dist/` 而ㅻ컠 湲덉? (.gitignore 愿由?
- 媛쒖씤?뺣낫 ?ы븿 ?곗씠???ъ썝紐낅? ?먮낯, 湲됱뿬 ?곗씠?? 而ㅻ컠 ?덈? 湲덉?
- API ?? ?좏겙 ???쒗겕由??섎뱶肄붾뵫 湲덉?
- `console.log` ?꾨줈?뺤뀡 而ㅻ컠 湲덉? (?붾쾭源????쒓굅)

---

## 二쇱쓽?ы빆

- 踰뺤씤紐? OK??⑹뒪 (OK湲덉쑖吏二???, OKAX (OK?꾩씠?먯뒪 ??
- ?섏쐞 議곗쭅 紐낆묶: "?뚰듃" (? ??
- ?곗씠??湲곗??? 2026-03-04 ?ъ썝紐낅?
- 媛쒖씤?뺣낫 ?ы븿 ?곗씠?곕뒗 而ㅻ컠?섏? ?딆쓬

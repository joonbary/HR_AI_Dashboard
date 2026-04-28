// Import normalized dashboard data
import { dashboardData as D } from '../services/dashboard/dashboardDataModel.js';

export function calcRiskData(){
  const hc2025 = D.companies.reduce((s,c)=>s+(D.headcount[c]?.[2025]||0),0);
  const nonPL = D.jobgroup['Non-PL']||0;
  const nonPLPct = hc2025>0 ? (nonPL/hc2025*100).toFixed(1) : 0;
  const on2022 = D.headcount['ON+소규모']?.[2022]||0;
  const on2025 = D.headcount['ON+소규모']?.[2025]||0;
  const onDrop = on2022>0 ? ((on2022-on2025)/on2022*100).toFixed(0) : 0;
  const tr2025 = D.turnover[2025]||0;
  const tr2023 = D.turnover[2023]||0;
  const trOKH = D.turnoverByCompany['OKH']?.[2025]||0;
  const trOKHprev = D.turnoverByCompany['OKH']?.[2024]||0;
  const trDelta = ((tr2023-tr2025)*100).toFixed(1);
  const trOKHdelta = ((trOKHprev-trOKH)*100).toFixed(1);
  // 성별
  let totalM=0,totalF=0;
  D.companies.forEach(c=>{totalM+=(D.gender2025[c]?.m||0);totalF+=(D.gender2025[c]?.f||0)});
  const femalePct = (totalM+totalF)>0 ? (totalF/(totalM+totalF)*100).toFixed(1) : 0;
  // AWTA
  const awtaPossible = D.awta.reduce((s,a)=>s+a.possible,0);
  const awtaStarted = D.awta.reduce((s,a)=>s+a.started,0);
  const awtaRate = awtaPossible>0 ? (awtaStarted/awtaPossible*100).toFixed(1) : 0;
  const awtaGap = (63 - parseFloat(awtaRate)).toFixed(0);

  return {hc2025,nonPL,nonPLPct,on2022,on2025,onDrop,tr2025,tr2023,trOKH,trDelta,trOKHdelta,femalePct,awtaRate,awtaGap};
}

function pct(v) { return (v * 100).toFixed(1) + '%'; }
function num(v) { return Number(v).toLocaleString(); }

export function buildRiskData(){
  const r = calcRiskData();

  const categoriesRaw = [
    {
      name:'인재 리스크', icon:'👤', color:'#C95C54', score:42,
      items:[
        {label:'OKH 이직률', detail:`${pct(r.trOKH)} — 지주사 평균 대비 고위, 핵심인재 Retention 모니터링 필요`, level: r.trOKH>0.10?'orange':'yellow'},
        {label:'그룹 이직률', detail:`${pct(r.tr2025)} — 2023년 ${pct(r.tr2023)} 대비 안정화`, level: r.tr2025>0.15?'orange':'green'},
        {label:'후계자 미확보 직위', detail:'데이터 미입력 (별도 취합 필요)', level:'yellow'},
        {label:'고성과자(S등급) 퇴직', detail:'모니터링 체계 구축 필요', level:'yellow'}
      ]
    },
    {
      name:'조직 리스크', icon:'🏢', color:'#6E879D', score:55,
      items:[
        {label:'Non-PL 비중', detail:`${r.nonPLPct}% (${num(r.nonPL)}/${num(r.hc2025)}) — 4B 방침 하 자연감소 중이나 직군 편중 리스크`, level: parseFloat(r.nonPLPct)>40?'orange':'yellow'},
        {label:'ON+소규모 급감', detail:`${num(r.on2022)}명(2022)→${num(r.on2025)}명(2025), 합병·정리 완료 단계`, level:'yellow'},
        {label:'4B 외부채용 금지', detail:'신입 20명 소수정예, 중장기 인력 고령화 리스크', level:'yellow'},
        {label:'여성 비율', detail:`${r.femalePct}% — 양호 수준 유지`, level:'green'}
      ]
    },
    {
      name:'컴플라이언스', icon:'⚖️', color:'#C99536', score:18,
      items:[
        {label:'4대보험 신고', detail:'전건 완료. 다음 마감: 원천세 5/10', level:'green'},
        {label:'52시간 위반', detail:'0건 — 모니터링 정상 (근기법§53)', level:'green'},
        {label:'AI 개인정보규정', detail:'미제정. sLLM 전사 오픈 상태에서 규정 공백', level:'yellow'},
        {label:'연말정산·퇴직연금', detail:'정기 납입 정상', level:'green'}
      ]
    },
    {
      name:'전략 리스크', icon:'🎯', color:'#D85A2A', score:72,
      items:[
        {label:'AI전환 착수율', detail:`${r.awtaRate}% — 연말 목표 63% 대비 ${r.awtaGap}%p 갭. CEO 지시사항`, level:'red'},
        {label:'법인별 착수 편차', detail:'OK저축 39% vs 나머지 4개 법인 0%. 즉시 킥오프 필요', level:'red'},
        {label:'AWTA 2차 취합', detail:'과업정의서 표준화·정합성 이슈 미해소', level:'orange'},
        {label:'두레이 전사 오픈', detail:'교육자료 준비 중, 저항 관리 필요', level:'yellow'}
      ]
    }
  ];

  // level 계산
  categoriesRaw.forEach(c => {
    c.level = c.score >= 60 ? '경고' : c.score >= 40 ? '주의' : '양호';
  });

  const totalScore = Math.round(categoriesRaw.reduce((s, c) => s + c.score, 0) / categoriesRaw.length);

  return { categories: categoriesRaw, totalScore };
}

// Heatmap Items for visualization
export const HEATMAP_ITEMS = [
  {cat:'strategic',label:'AI착수율 갭',prob:4.5,impact:5,color:'#D85A2A'},
  {cat:'strategic',label:'법인별 편차',prob:4,impact:4.5,color:'#D85A2A'},
  {cat:'strategic',label:'AWTA 2차 마감',prob:3,impact:3.5,color:'#D85A2A'},
  {cat:'strategic',label:'두레이 오픈',prob:2,impact:2.5,color:'#D85A2A'},
  {cat:'organization',label:'Non-PL 편중',prob:3.5,impact:3,color:'#6E879D'},
  {cat:'organization',label:'인력 고령화',prob:3,impact:4,color:'#6E879D'},
  {cat:'talent',label:'OKH 이직률',prob:2.5,impact:3.5,color:'#C95C54'},
  {cat:'talent',label:'고성과자 이탈',prob:2,impact:4.5,color:'#C95C54'},
  {cat:'compliance',label:'AI 개인정보규정',prob:2.5,impact:2,color:'#C99536'},
  {cat:'compliance',label:'52시간 위반',prob:1,impact:3,color:'#C99536'}
];

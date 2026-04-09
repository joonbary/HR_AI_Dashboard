// Import D from dashboardData
import { D } from './dashboardData.js';

export function calcRiskData(){
  const hc2025 = D.companies.reduce((s,c)=>s+(D.headcount[c]?.[2025]||0),0);
  const hc2022 = D.companies.reduce((s,c)=>s+(D.headcount[c]?.[2022]||0),0);
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

export function buildRiskData(){
  const r = calcRiskData();
  return {
  talent: {
    label:'인재 리스크', icon:'👤', color:'#D14343', score:42,
    items:[
      {level: r.trOKH>0.10?'orange':'yellow', text:`<strong>OKH 이직률 ${pct(r.trOKH)}</strong> — 지주사 평균 대비 고위, 핵심인재 Retention 모니터링 필요`,delta:`↓ ${r.trOKHdelta}%p`,deltaDir:'down'},
      {level: r.tr2025>0.15?'orange':'green', text:`<strong>그룹 이직률 ${pct(r.tr2025)}</strong> — 2023년 ${pct(r.tr2023)} 대비 안정화`,delta:`↓ ${r.trDelta}%p`,deltaDir:'down'},
      {level:'yellow',text:'<strong>후계자 미확보 직위</strong> — 데이터 미입력 (별도 취합 필요)',delta:'—',deltaDir:''},
      {level:'yellow',text:'<strong>고성과자(S등급) 퇴직</strong> — 모니터링 체계 구축 필요',delta:'—',deltaDir:''}
    ]
  },
  organization: {
    label:'조직 리스크', icon:'🏢', color:'#5BA0D9', score:55,
    items:[
      {level: parseFloat(r.nonPLPct)>40?'orange':'yellow', text:`<strong>Non-PL 비중 ${r.nonPLPct}%</strong> (${num(r.nonPL)}/${num(r.hc2025)}) — 4B 방침 하 자연감소 중이나 직군 편중 리스크`,delta:'',deltaDir:''},
      {level:'yellow',text:`<strong>ON+소규모 급감</strong> — ${num(r.on2022)}명(2022)→${num(r.on2025)}명(2025), 합병·정리 완료 단계`,delta:`↓ ${r.onDrop}%`,deltaDir:'down'},
      {level:'yellow',text:'<strong>4B 외부채용 금지</strong> — 신입 20명 소수정예, 중장기 인력 고령화 리스크',delta:'신규',deltaDir:''},
      {level:'green',text:`<strong>여성 비율 ${r.femalePct}%</strong> — 양호 수준 유지`,delta:'',deltaDir:''}
    ]
  },
  compliance: {
    label:'컴플라이언스', icon:'⚖️', color:'#FCAF17', score:18,
    items:[
      {level:'green',text:'<strong>4대보험 신고 5건</strong> — 전건 완료. 다음 마감: 원천세 5/10',delta:'✅',deltaDir:''},
      {level:'green',text:'<strong>52시간 위반 0건</strong> — 모니터링 정상 (근기법§53)',delta:'✅',deltaDir:''},
      {level:'yellow',text:'<strong>개인정보 AI 사용규정</strong> — 미제정. sLLM 전사 오픈 상태에서 규정 공백',delta:'제정 중',deltaDir:''},
      {level:'green',text:'<strong>연말정산·퇴직연금</strong> — 정기 납입 정상',delta:'✅',deltaDir:''}
    ]
  },
  strategic: {
    label:'전략 리스크', icon:'🎯', color:'#E8572A', score:72,
    items:[
      {level:'red',text:`<strong>AI전환 착수율 ${r.awtaRate}%</strong> — 연말 목표 63% 대비 ${r.awtaGap}%p 갭. CEO 지시사항`,delta:'D-269',deltaDir:''},
      {level:'red',text:'<strong>법인별 착수 편차</strong> — OK저축 39% vs 나머지 4개 법인 0%. 즉시 킥오프 필요',delta:'🔴',deltaDir:''},
      {level:'orange',text:'<strong>AWTA 2차 취합 D-5</strong> — 과업정의서 표준화·정합성 이슈 미해소',delta:'4/11',deltaDir:''},
      {level:'yellow',text:'<strong>두레이 전사 오픈 D-24</strong> — 교육자료 준비 중, 저항 관리 필요',delta:'4월말',deltaDir:''}
    ]
  }
  };
}

// Heatmap Items for visualization
export const HEATMAP_ITEMS = [
  {cat:'strategic',label:'AI착수율 갭',prob:4.5,impact:5,color:'#E8572A'},
  {cat:'strategic',label:'법인별 편차',prob:4,impact:4.5,color:'#E8572A'},
  {cat:'strategic',label:'AWTA 2차 마감',prob:3,impact:3.5,color:'#E8572A'},
  {cat:'strategic',label:'두레이 오픈',prob:2,impact:2.5,color:'#E8572A'},
  {cat:'organization',label:'Non-PL 편중',prob:3.5,impact:3,color:'#5BA0D9'},
  {cat:'organization',label:'인력 고령화',prob:3,impact:4,color:'#5BA0D9'},
  {cat:'talent',label:'OKH 이직률',prob:2.5,impact:3.5,color:'#D14343'},
  {cat:'talent',label:'고성과자 이탈',prob:2,impact:4.5,color:'#D14343'},
  {cat:'compliance',label:'AI 개인정보규정',prob:2.5,impact:2,color:'#FCAF17'},
  {cat:'compliance',label:'52시간 위반',prob:1,impact:3,color:'#FCAF17'}
];

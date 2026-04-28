import { DATA_STATS, GRADE_ORDER } from '../../features/personnel/data/personnelData';

export function buildPersonnelCopilotContext({ activeSubTab, selectedCandidate } = {}) {
  return {
    scope: 'personnel-app',
    activeSubTab,
    selectedCandidate,
    dataStats: DATA_STATS,
    gradeOrder: GRADE_ORDER,
    guardrails: [
      '?뺢린?몄궗 肄뷀뙆?쇰읉? 寃??蹂댁“?⑹씠硫?理쒖쥌 ?섏궗寃곗젙???泥댄븯吏 ?딅뒗??',
      '媛쒖씤 ?⑥쐞 誘쇨컧?뺣낫???꾩슂??理쒖냼 踰붿쐞?먯꽌留??ъ슜?쒕떎.',
      '?뱀쭊/?깃툒/?대룞 ?먮떒? 洹쇨굅? ?쒗븳?ы빆???④퍡 ?쒖떆?쒕떎.',
    ],
  };
}

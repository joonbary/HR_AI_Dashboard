import { useMemo } from 'react';
import useDashboardStore from '../features/hr-dashboard/store/dashboardStore';
import { dashboardData as D } from '../services/dashboard/dashboardDataModel';

/**
 * ?꾪꽣 ?곹깭???곕씪 ?곗씠?곕? 媛怨듯븯????
 */
export function useFilteredData() {
  const { company, year } = useDashboardStore();

  return useMemo(() => {
    const companies = company === 'ALL' ? D.companies : [company];
    const years = year === 'ALL' ? D.years : [Number(year)];
    const latestYear = year === 'ALL' ? D.years[D.years.length - 1] : Number(year);

    // ?몄썝 ?⑹궛
    const totalHeadcount = companies.reduce((sum, co) => {
      return sum + (D.headcount[co]?.[latestYear] || 0);
    }, 0);

    // ?꾨뀈 ?鍮?
    const prevYear = latestYear - 1;
    const prevHeadcount = companies.reduce((sum, co) => {
      return sum + (D.headcount[co]?.[prevYear] || 0);
    }, 0);
    const yoy = prevHeadcount > 0 ? ((totalHeadcount - prevHeadcount) / prevHeadcount * 100).toFixed(1) : 0;

    // ?댁쭅瑜?(鍮꾩쑉?믫띁?쇳듃 蹂??
    const turnoverRaw = company === 'ALL'
      ? (D.turnover?.[latestYear] || 0)
      : (D.turnoverByCompany?.[company]?.[latestYear] || 0);
    const turnoverRate = (turnoverRaw * 100).toFixed(1);

    // ?멸굔鍮?
    const totalLaborCost = companies.reduce((sum, co) => {
      return sum + (D.laborCost[co]?.[latestYear] || 0);
    }, 0);

    const perCapita = totalHeadcount > 0 ? Math.round(totalLaborCost / totalHeadcount) : 0;

    return {
      companies,
      years,
      latestYear,
      totalHeadcount,
      yoy: Number(yoy),
      yoyDelta: totalHeadcount - prevHeadcount,
      turnoverRate,
      totalLaborCost,
      perCapita,
      raw: D,
    };
  }, [company, year]);
}

export default useFilteredData;

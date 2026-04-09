import { useMemo } from 'react';
import useStore from '../store/useStore';
import { D } from '../data/dashboardData';

/**
 * 필터 상태에 따라 데이터를 가공하는 훅
 */
export function useFilteredData() {
  const { company, year } = useStore();

  return useMemo(() => {
    const companies = company === 'ALL' ? D.companies : [company];
    const years = year === 'ALL' ? D.years : [Number(year)];
    const latestYear = year === 'ALL' ? D.years[D.years.length - 1] : Number(year);

    // 인원 합산
    const totalHeadcount = companies.reduce((sum, co) => {
      return sum + (D.headcount[co]?.[latestYear] || 0);
    }, 0);

    // 전년 대비
    const prevYear = latestYear - 1;
    const prevHeadcount = companies.reduce((sum, co) => {
      return sum + (D.headcount[co]?.[prevYear] || 0);
    }, 0);
    const yoy = prevHeadcount > 0 ? ((totalHeadcount - prevHeadcount) / prevHeadcount * 100).toFixed(1) : 0;

    // 이직률
    const turnoverRate = company === 'ALL'
      ? (D.turnoverByCompany?.['그룹']?.[latestYear] || 0)
      : (D.turnoverByCompany?.[company]?.[latestYear] || 0);

    // 인건비
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

import { useRef, useEffect } from 'react';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

/* 차트 유형별 기본 데이터레이블 설정 */
function getDefaultDatalabels(type, stacked) {
  const base = { font: { size: 10, weight: 'bold' }, padding: 2 };

  if (type === 'bar' && stacked) {
    // 스택 바: 각 세그먼트 안에 0이 아닌 값만 표시
    return { ...base, color: '#fff', anchor: 'center', align: 'center',
      formatter: v => v > 0 ? Math.round(v) : '' };
  }
  if (type === 'bar') {
    // 일반 바: 막대 위에 값 표시
    return { ...base, color: '#555', anchor: 'end', align: 'top',
      formatter: v => v > 0 ? v.toLocaleString() : '' };
  }
  if (type === 'line') {
    // 라인: 포인트 위에 값 표시
    return { ...base, color: '#555', anchor: 'end', align: 'top', offset: 4,
      formatter: v => v > 0 ? (v >= 100 ? v.toLocaleString() : v) : '' };
  }
  if (type === 'radar') {
    return { ...base, color: '#555', anchor: 'end', align: 'end',
      formatter: v => v > 0 ? v : '' };
  }
  // 기타: 비활성
  return { display: false };
}

/**
 * 범용 Chart.js 래퍼 컴포넌트
 * @param {string} title - 차트 제목
 * @param {string} subtitle - 차트 부제
 * @param {object} config - Chart.js 설정 (type, data, options)
 * @param {string} height - 차트 높이 CSS class (h240 | h280)
 */
export default function ChartCard({ title, subtitle, config, height = 'h280' }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !config) return;

    // Destroy previous chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const isStacked = config.options?.scales?.x?.stacked || config.options?.scales?.y?.stacked;
    const defaultDL = getDefaultDatalabels(config.type, isStacked);
    // 개별 차트에서 datalabels 옵션을 명시하면 그걸 우선 사용
    const userDL = config.options?.plugins?.datalabels;

    chartRef.current = new Chart(canvasRef.current, {
      type: config.type,
      data: config.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        ...config.options,
        plugins: {
          ...config.options?.plugins,
          datalabels: userDL !== undefined ? userDL : defaultDL,
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [config]);

  return (
    <div className="chart-card">
      {title && <div className="chart-title">{title}</div>}
      {subtitle && <div className="chart-subtitle">{subtitle}</div>}
      <div className={`chart-wrap ${height}`}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

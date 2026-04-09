import { useRef, useEffect } from 'react';
import { Chart } from 'chart.js/auto';

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

    chartRef.current = new Chart(canvasRef.current, {
      type: config.type,
      data: config.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        ...config.options,
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

import { useRef, useEffect } from 'react';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

const axisGrid = {
  color: 'rgba(17, 17, 17, 0.06)',
  drawBorder: false,
};

const axisTicks = {
  color: '#777',
  font: { size: 10 },
};

function mergeScale(base, user) {
  return {
    ...base,
    ...user,
    grid: { ...base.grid, ...user?.grid },
    ticks: { ...base.ticks, ...user?.ticks },
    title: { ...base.title, ...user?.title },
  };
}

function getDefaultScales(type, userScales) {
  if (type === 'doughnut' || type === 'pie') {
    return userScales || {};
  }

  if (type === 'radar') {
    const baseRadarScale = {
      grid: axisGrid,
      angleLines: { color: 'rgba(17, 17, 17, 0.08)' },
      pointLabels: { color: '#555', font: { size: 10 } },
      ticks: { color: '#777', backdropColor: 'transparent', font: { size: 9 } },
    };

    return {
      ...(userScales || {}),
      r: {
        ...userScales?.r,
        grid: { ...baseRadarScale.grid, ...userScales?.r?.grid },
        angleLines: { ...baseRadarScale.angleLines, ...userScales?.r?.angleLines },
        pointLabels: { ...baseRadarScale.pointLabels, ...userScales?.r?.pointLabels },
        ticks: { ...baseRadarScale.ticks, ...userScales?.r?.ticks },
      },
    };
  }

  return {
    ...(userScales || {}),
    x: mergeScale({ grid: axisGrid, ticks: axisTicks, title: { color: '#777', font: { size: 10 } } }, userScales?.x),
    y: mergeScale({ grid: axisGrid, ticks: axisTicks, title: { color: '#777', font: { size: 10 } } }, userScales?.y),
  };
}

/* 李⑦듃 ?좏삎蹂?湲곕낯 ?곗씠?곕젅?대툝 ?ㅼ젙 */
function getDefaultDatalabels(type, stacked) {
  const base = { font: { size: 10, weight: 'bold' }, padding: 2 };

  if (type === 'bar' && stacked) {
    // ?ㅽ깮 諛? 媛??멸렇癒쇳듃 ?덉뿉 0???꾨땶 媛믩쭔 ?쒖떆
    return { ...base, color: '#fff', anchor: 'center', align: 'center',
      formatter: v => v > 0 ? Math.round(v) : '' };
  }
  if (type === 'bar') {
    // ?쇰컲 諛? 留됰? ?꾩뿉 媛??쒖떆
    return { ...base, color: '#555', anchor: 'end', align: 'top',
      formatter: v => v > 0 ? v.toLocaleString() : '' };
  }
  if (type === 'line') {
    // ?쇱씤: ?ъ씤???꾩뿉 媛??쒖떆
    return { ...base, color: '#555', anchor: 'end', align: 'top', offset: 4,
      formatter: v => v > 0 ? (v >= 100 ? v.toLocaleString() : v) : '' };
  }
  if (type === 'radar') {
    return { ...base, color: '#555', anchor: 'end', align: 'end',
      formatter: v => v > 0 ? v : '' };
  }
  // 湲고?: 鍮꾪솢??
  return { display: false };
}

/**
 * 踰붿슜 Chart.js ?섑띁 而댄룷?뚰듃
 * @param {string} title - 李⑦듃 ?쒕ぉ
 * @param {string} subtitle - 李⑦듃 遺??
 * @param {object} config - Chart.js ?ㅼ젙 (type, data, options)
 * @param {string} height - 李⑦듃 ?믪씠 CSS class (h240 | h280)
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
    // 媛쒕퀎 李⑦듃?먯꽌 datalabels ?듭뀡??紐낆떆?섎㈃ 洹멸구 ?곗꽑 ?ъ슜
    const userDL = config.options?.plugins?.datalabels;

    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      color: '#444',
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
            color: '#666',
            font: { size: 10 },
          },
        },
        tooltip: {
          backgroundColor: 'rgba(17, 17, 17, 0.88)',
          titleFont: { size: 12, weight: '600' },
          bodyFont: { size: 11 },
          padding: 10,
          displayColors: true,
          boxWidth: 8,
          boxHeight: 8,
        },
      },
    };

    chartRef.current = new Chart(canvasRef.current, {
      type: config.type,
      data: config.data,
      options: {
        ...baseOptions,
        ...config.options,
        plugins: {
          ...baseOptions.plugins,
          ...config.options?.plugins,
          legend: {
            ...baseOptions.plugins.legend,
            ...config.options?.plugins?.legend,
            labels: {
              ...baseOptions.plugins.legend.labels,
              ...config.options?.plugins?.legend?.labels,
            },
          },
          datalabels: userDL !== undefined ? userDL : defaultDL,
        },
        scales: getDefaultScales(config.type, config.options?.scales),
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

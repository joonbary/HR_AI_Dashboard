/**
 * 범용 데이터 테이블
 * @param {string[]} headers - 헤더 배열
 * @param {Array<Array>} rows - 행 배열 (각 행은 셀 배열)
 * @param {string} className - 추가 CSS 클래스
 */
export default function DataTable({ headers, rows, className = '' }) {
  return (
    <div className="chart-card" style={{ overflowX: 'auto' }}>
      <table className={`data-table ${className}`}>
        <thead>
          <tr>
            {headers.map((h, i) => <th key={i}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => <td key={ci}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

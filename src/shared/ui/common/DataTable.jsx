/**
 * 踰붿슜 ?곗씠???뚯씠釉?
 * @param {string[]} headers - ?ㅻ뜑 諛곗뿴
 * @param {Array<Array>} rows - ??諛곗뿴 (媛??됱? ? 諛곗뿴)
 * @param {string} className - 異붽? CSS ?대옒??
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

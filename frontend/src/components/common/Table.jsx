function Table({
  columns = [],
  data = [],
  emptyMessage = 'No records found',
  rowKey = '_id',
}) {
  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '13px',
        }}
      >
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{
                  textAlign: 'left',
                  padding: '12px 14px',
                  background: '#f8fafc',
                  color: '#475569',
                  fontSize: '11px',
                  fontWeight: '700',
                  borderBottom: '1px solid #e2e8f0',
                  whiteSpace: 'nowrap',
                }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  textAlign: 'center',
                  padding: '30px',
                  color: '#94a3b8',
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={row[rowKey] || index}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    style={{
                      padding: '13px 14px',
                      color: '#334155',
                      borderBottom: '1px solid #f1f5f9',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {column.render
                      ? column.render(row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
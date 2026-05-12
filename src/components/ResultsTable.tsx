'use client'

interface Props {
  columns: string[]
  rows: any[][]
}

export default function ResultsTable({ columns, rows }: Props) {
  if (!columns.length) {
    return (
      <div className="flex items-center justify-center h-32 text-shadow text-sm font-mono">
        Run a query to see results
      </div>
    )
  }

  return (
    <div className="overflow-auto max-h-64 rounded border border-border">
      <table className="w-full text-sm font-mono border-collapse">
        <thead>
          <tr className="bg-dim sticky top-0">
            {columns.map((col) => (
              <th key={col} className="px-3 py-2 text-left text-gold border-b border-border font-normal tracking-wide text-xs uppercase">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-border last:border-0 hover:bg-dim transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 text-aged">
                  {cell === null ? <span className="text-shadow italic">NULL</span> : String(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-3 py-1 text-xs text-shadow bg-surface border-t border-border">
        {rows.length} row{rows.length !== 1 ? 's' : ''} returned
      </div>
    </div>
  )
}

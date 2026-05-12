'use client'

import { useState } from 'react'

const SCHEMA = [
  { table: 'persons',    cols: ['id', 'name', 'role', 'room_no', 'alibi'] },
  { table: 'hotel_log',  cols: ['id', 'person_id', 'event', 'floor', 'timestamp'] },
  { table: 'evidence',   cols: ['id', 'item', 'location', 'notes'] },
  { table: 'phone_rec',  cols: ['id', 'caller_id', 'called', 'duration', 'timestamp'] },
  { table: 'financials', cols: ['id', 'person_id', 'memo', 'amount', 'date'] },
  { table: 'bar_tabs',   cols: ['id', 'person_id', 'drink', 'tab_time', 'paid'] },
  { table: 'witnesses',  cols: ['id', 'name', 'statement', 'credibility'] },
  { table: 'alley_log',  cols: ['id', 'person_id', 'seen_at', 'direction', 'notes'] },
  { table: 'messages',   cols: ['id', 'sender_id', 'recipient', 'body', 'sent_at'] },
  { table: 'staff',      cols: ['id', 'name', 'shift', 'floor_access', 'notes'] },
]

export default function SchemaViewer() {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="border-t border-border">
      <button onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2 text-xs text-shadow hover:text-aged font-mono uppercase tracking-widest transition-colors">
        <span>Table Schema</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-4 pb-3 space-y-1">
          {SCHEMA.map(({ table, cols }) => (
            <div key={table}>
              <button onClick={() => setExpanded(expanded === table ? null : table)}
                className="w-full text-left text-xs text-gold-dim hover:text-gold font-mono py-0.5 transition-colors">
                {expanded === table ? '▾' : '▸'} {table}
              </button>
              {expanded === table && (
                <div className="pl-4 py-1 space-y-0.5">
                  {cols.map((col) => <div key={col} className="text-xs text-shadow font-mono">· {col}</div>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

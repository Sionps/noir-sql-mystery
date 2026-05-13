'use client'

import { useState, useEffect, useCallback } from 'react'

interface ColumnInfo {
  name: string
  kind: 'pk' | 'fk' | 'col'
  description: string
  fkTarget?: string
}

interface TableInfo {
  name: string
  description: string
  columns: ColumnInfo[]
  standalone?: boolean
}

const TABLES: TableInfo[] = [
  {
    name: 'persons',
    description: 'All individuals in the hotel — guests, staff, and the victim',
    columns: [
      { name: 'id', kind: 'pk', description: 'Unique identifier for each person' },
      { name: 'name', kind: 'col', description: 'Full name of the person' },
      { name: 'role', kind: 'col', description: 'Role at the hotel (manager, bellhop, singer, etc.)' },
      { name: 'room_no', kind: 'col', description: 'Hotel room number (NULL for non-guests)' },
      { name: 'alibi', kind: 'col', description: 'Self-reported alibi for the night of the murder' },
    ],
  },
  {
    name: 'hotel_log',
    description: 'Tracking records of elevator usage and floor access',
    columns: [
      { name: 'id', kind: 'pk', description: 'Unique identifier for each log entry' },
      { name: 'person_id', kind: 'fk', description: 'Links to persons table — who performed the action', fkTarget: 'persons.id' },
      { name: 'event', kind: 'col', description: 'Type of event (check-in, room entry, inspection, etc.)' },
      { name: 'floor', kind: 'col', description: 'Floor number that was accessed' },
      { name: 'timestamp', kind: 'col', description: 'Time of the event (24-hour format)' },
    ],
  },
  {
    name: 'phone_rec',
    description: 'Phone call records from the hotel switchboard',
    columns: [
      { name: 'id', kind: 'pk', description: 'Unique identifier for each call record' },
      { name: 'caller_id', kind: 'fk', description: 'Links to persons table — who made the call', fkTarget: 'persons.id' },
      { name: 'called', kind: 'col', description: 'Name of the person who was called' },
      { name: 'duration', kind: 'col', description: 'Call duration in seconds' },
      { name: 'timestamp', kind: 'col', description: 'Time the call was placed' },
    ],
  },
  {
    name: 'messages',
    description: 'Messages delivered to hotel rooms',
    columns: [
      { name: 'id', kind: 'pk', description: 'Unique identifier for each message' },
      { name: 'sender_id', kind: 'fk', description: 'Links to persons table — who sent the message', fkTarget: 'persons.id' },
      { name: 'recipient', kind: 'col', description: 'Name of the message recipient' },
      { name: 'body', kind: 'col', description: 'Content of the message' },
      { name: 'sent_at', kind: 'col', description: 'Time the message was sent' },
    ],
  },
  {
    name: 'financials',
    description: 'Hotel financial transactions and account records',
    columns: [
      { name: 'id', kind: 'pk', description: 'Unique identifier for each transaction' },
      { name: 'person_id', kind: 'fk', description: 'Links to persons table — who the transaction involves', fkTarget: 'persons.id' },
      { name: 'memo', kind: 'col', description: 'Description or reason for the transaction' },
      { name: 'amount', kind: 'col', description: 'Transaction amount (negative = money paid out)' },
      { name: 'date', kind: 'col', description: 'Date the transaction was recorded' },
    ],
  },
  {
    name: 'bar_tabs',
    description: 'Bar tab records from the Velvet Room',
    columns: [
      { name: 'id', kind: 'pk', description: 'Unique identifier for each bar tab entry' },
      { name: 'person_id', kind: 'fk', description: 'Links to persons table — who ordered the drink', fkTarget: 'persons.id' },
      { name: 'drink', kind: 'col', description: 'Type of drink ordered' },
      { name: 'tab_time', kind: 'col', description: 'Time the drink was ordered' },
      { name: 'paid', kind: 'col', description: 'Whether the tab was paid (1 = yes, 0 = no)' },
    ],
  },
  {
    name: 'alley_log',
    description: 'Records of people seen in the hotel back alley',
    columns: [
      { name: 'id', kind: 'pk', description: 'Unique identifier for each alley sighting' },
      { name: 'person_id', kind: 'fk', description: 'Links to persons table — who was seen', fkTarget: 'persons.id' },
      { name: 'seen_at', kind: 'col', description: 'Time the person was seen in the alley' },
      { name: 'direction', kind: 'col', description: 'Direction of travel (north/south)' },
      { name: 'notes', kind: 'col', description: 'Additional observations about the person' },
    ],
  },
  {
    name: 'evidence',
    description: 'Physical evidence collected from crime scene and elsewhere',
    standalone: true,
    columns: [
      { name: 'id', kind: 'pk', description: 'Unique identifier for each evidence item' },
      { name: 'item', kind: 'col', description: 'Description of the evidence item' },
      { name: 'location', kind: 'col', description: 'Where the item was found' },
      { name: 'notes', kind: 'col', description: 'Detailed observations and analysis notes' },
    ],
  },
  {
    name: 'witnesses',
    description: 'Witness statements gathered during the investigation',
    standalone: true,
    columns: [
      { name: 'id', kind: 'pk', description: 'Unique identifier for each witness' },
      { name: 'name', kind: 'col', description: 'Name of the witness' },
      { name: 'statement', kind: 'col', description: "What the witness reported seeing or hearing" },
      { name: 'credibility', kind: 'col', description: 'Credibility score (1-10, higher = more reliable)' },
    ],
  },
  {
    name: 'staff',
    description: 'Hotel staff records and access privileges',
    standalone: true,
    columns: [
      { name: 'id', kind: 'pk', description: 'Unique identifier for each staff member' },
      { name: 'name', kind: 'col', description: "Staff member's name" },
      { name: 'shift', kind: 'col', description: 'Work shift (day/evening/night)' },
      { name: 'floor_access', kind: 'col', description: 'Highest floor the staff member can access' },
      { name: 'notes', kind: 'col', description: 'Notes about access keys and privileges' },
    ],
  },
]

const FK_NAMES = ['hotel_log', 'phone_rec', 'messages', 'financials', 'bar_tabs', 'alley_log']
const STANDALONE_NAMES = ['evidence', 'witnesses', 'staff']

function getRandomRotation() {
  return (Math.random() * 6 - 3).toFixed(2)
}

function KindBadge({ kind }: { kind: string }) {
  if (kind === 'pk') return <span className="bg-red-600 text-white px-1 rounded text-[8px] font-mono font-bold">PK</span>
  if (kind === 'fk') return <span className="bg-blue-600 text-white px-1 rounded text-[8px] font-mono">FK</span>
  return null
}

function TableCard({ table, expanded, onToggle }: { table: TableInfo; expanded: boolean; onToggle: () => void }) {
  const [selectedCol, setSelectedCol] = useState<string | null>(null)
  const rotation = getRandomRotation()

  const isHub = table.name === 'persons'
  const isStandalone = table.standalone

  return (
    <div
      className={`relative bg-white p-3 pb-6 shadow-xl transition-all duration-200 cursor-pointer
        ${expanded ? 'scale-110 z-10' : 'z-0'}
      `}
      style={{ transform: `rotate(${rotation}deg)` }}
      onClick={onToggle}
    >
      {/* Push Pin */}
      <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full shadow-sm ${isHub ? 'bg-red-600' : 'bg-blue-600'}`} />

      <div className={`text-sm uppercase font-serif font-bold mb-1 ${isHub ? 'text-black' : 'text-zinc-800'}`}>
        {table.name}
      </div>

      <div className="text-[9px] text-zinc-500 font-serif italic mb-3 leading-tight">
        {table.description}
      </div>

      {expanded && (
        <div className="space-y-0.5 pt-2 border-t border-zinc-100">
          {table.columns.map((col) => {
            const isColSelected = selectedCol === col.name
            return (
              <div key={col.name}>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCol(isColSelected ? null : col.name);
                  }}
                  className="flex items-center gap-2 text-left py-1 rounded hover:bg-zinc-50 transition-colors group"
                >
                  <KindBadge kind={col.kind} />
                  <span className="text-[11px] font-mono text-zinc-700 group-hover:text-black">
                    {col.name}
                  </span>
                  {col.fkTarget && (
                    <span className="text-[8px] text-zinc-400 font-mono ml-auto">&#x2192;{col.fkTarget}</span>
                  )}
                </div>
                {isColSelected && (
                  <div className="mx-1 px-2 py-1.5 mb-1 bg-zinc-50 border border-zinc-200 rounded text-[10px] text-zinc-600 font-mono leading-relaxed italic">
                    {col.description}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Arrow({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className || ''}`}>
      <div className="w-6 h-px bg-gradient-to-r from-transparent via-gold-dim/40 to-transparent" />
      <span className="text-[10px] text-gold-dim/40 font-mono -ml-2">&#x2192;</span>
    </div>
  )
}

export default function SchemaViewer() {
  const [open, setOpen] = useState(false)
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set())

  const toggleTable = useCallback((name: string) => {
    setExpandedTables((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    setExpandedTables(new Set())
  }, [])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, close])

  const persons = TABLES[0]
  const fkTables = FK_NAMES.map((n) => TABLES.find((t) => t.name === n)!)
  const standaloneTables = STANDALONE_NAMES.map((n) => TABLES.find((t) => t.name === n)!)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex-shrink-0 text-xs font-mono uppercase tracking-wider mr-3 cursor-pointer transition-all duration-200
                   bg-[#fff9c4] text-[#5d4037] px-2 py-1 shadow-md -rotate-1
                   hover:scale-105 hover:rotate-0 border-b-2 border-yellow-400/50"
      >
        Case File
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="border-[12px] border-[#2a1d15] rounded-sm shadow-2xl flex flex-col"
            style={{
              width: '90vw',
              maxWidth: 900,
              maxHeight: '90vh',
              backgroundColor: '#3d2b1f',
              backgroundImage: 'radial-gradient(#4d3b2f 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#2a1d15] bg-[#2a1d15]/30 flex-shrink-0">
              <span className="text-xs text-yellow-200/70 font-mono uppercase tracking-widest italic">
                Evidence Board &mdash; Case #402
              </span>
              <button onClick={close} className="text-yellow-200/40 hover:text-yellow-200 font-mono text-sm transition-colors cursor-pointer">
                &#x2715;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="flex items-start gap-3 justify-center">
                {/* Hub: persons */}
                <div className="w-48 flex-shrink-0">
                  <TableCard
                    table={persons}
                    expanded={expandedTables.has(persons.name)}
                    onToggle={() => toggleTable(persons.name)}
                  />
                </div>

                {/* Arrows + FK tables */}
                <div className="flex flex-col items-center gap-2">
                  <Arrow className="py-2" />
                  <div className="flex flex-col gap-2 min-w-[160px]">
                    {fkTables.map((t) => (
                      <div key={t.name} className="flex items-center gap-2">
                        <span className="text-[8px] text-gold-dim/30 font-mono w-4 text-center">&#x2192;</span>
                        <div className="flex-1">
                          <TableCard
                            table={t}
                            expanded={expandedTables.has(t.name)}
                            onToggle={() => toggleTable(t.name)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Standalone divider + tables */}
                <div className="flex items-stretch gap-3">
                  <div className="w-px bg-border self-stretch" />
                  <div className="flex flex-col gap-2 min-w-[160px]">
                    <div className="text-[9px] text-shadow font-mono uppercase tracking-wider opacity-40 pb-1 text-center">
                      Standalone
                    </div>
                    {standaloneTables.map((t) => (
                      <TableCard
                        key={t.name}
                        table={t}
                        expanded={expandedTables.has(t.name)}
                        onToggle={() => toggleTable(t.name)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-5 px-5 py-2.5 border-t border-border text-[10px] font-mono text-shadow flex-shrink-0">
              <span><span className="text-gold">PK</span> primary key</span>
              <span className="text-aged">FK foreign key</span>
              <span className="text-shadow/60">&middot; plain column</span>
              <span className="ml-auto text-shadow opacity-40 italic">click any table to expand &rarr; click a column for details</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

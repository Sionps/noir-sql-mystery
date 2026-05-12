'use client'

import { useGameStore } from '@/store/gameStore'

const SUSPECTS = [
  { id: 1, name: 'Louis Krane',  role: 'Hotel Manager' },
  { id: 2, name: 'Tommy Ricci',  role: 'Bellhop' },
  { id: 3, name: 'Diane Harlow', role: 'Singer' },
  { id: 4, name: 'Frank Dellum', role: 'Business Partner' },
  { id: 5, name: 'Nora Vance',   role: 'Maid' },
]

export default function SuspectList() {
  const accusedId = useGameStore((s) => s.accusedId)
  const accusationMade = useGameStore((s) => s.accusationMade)

  return (
    <div className="border-t border-border">
      <div className="px-4 py-2 text-xs text-shadow uppercase tracking-widest font-mono">Suspects</div>
      <div className="px-4 pb-3 space-y-1">
        {SUSPECTS.map((s) => (
          <div key={s.id}
            className={[
              'flex items-center justify-between px-2 py-1.5 rounded text-xs font-mono',
              accusationMade && accusedId === s.id
                ? s.id === 3 ? 'border border-red text-red-300' : 'bg-dim border border-border text-shadow'
                : 'text-aged',
            ].join(' ')}>
            <span>{s.name}</span>
            <span className="text-shadow">{s.role}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

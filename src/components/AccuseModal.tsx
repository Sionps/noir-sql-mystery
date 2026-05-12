'use client'

import { useEffect, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'

const SUSPECTS = [
  { id: 1, name: 'Louis Krane',  role: 'Hotel Manager',    detail: 'Cool under pressure. Full building access.' },
  { id: 2, name: 'Tommy Ricci',  role: 'Bellhop',          detail: 'Reported a missing key. Seen in the alley.' },
  { id: 3, name: 'Diane Harlow', role: 'Singer',           detail: '9500 dollars stolen. Threatening message at 10 PM.' },
  { id: 4, name: 'Frank Dellum', role: 'Business Partner', detail: 'Partnership disputes. In the alley at 23:45.' },
  { id: 5, name: 'Nora Vance',   role: 'Maid',             detail: 'Limited floor access. Solid evening timeline.' },
]

interface Props { onClose: () => void }

export default function AccuseModal({ onClose }: Props) {
  const accuse = useGameStore((s) => s.accuse)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handle)
    dialogRef.current?.focus()
    return () => document.removeEventListener('keydown', handle)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Make your accusation"
        tabIndex={-1}
        className="bg-ink border border-border rounded-lg p-6 w-full max-w-lg mx-4 outline-none">
        <h2 className="font-display text-2xl text-gold mb-1">Make Your Accusation</h2>
        <p className="text-sm text-shadow font-mono mb-4">You have one shot, Ray. Choose wrong and the killer walks free.</p>
        <div className="space-y-2">
          {SUSPECTS.map((s) => (
            <button key={s.id} onClick={() => accuse(s.id)}
              className="w-full text-left px-4 py-3 bg-surface border border-border rounded hover:border-gold hover:bg-dim transition-all">
              <div className="flex justify-between items-center">
                <span className="font-display text-paper">{s.name}</span>
                <span className="text-xs text-shadow font-mono">{s.role}</span>
              </div>
              <p className="text-xs text-shadow font-mono mt-1">{s.detail}</p>
            </button>
          ))}
        </div>
        <button onClick={onClose} className="mt-4 text-xs text-shadow hover:text-aged font-mono transition-colors">
          Back — I need more evidence
        </button>
      </div>
    </div>
  )
}

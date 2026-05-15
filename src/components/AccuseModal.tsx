'use client'

import { useEffect, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'
import { useTranslation } from '@/hooks/useTranslation'

  const SUSPECTS = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
  ]

interface Props { onClose: () => void }

export default function AccuseModal({ onClose }: Props) {
  const { t } = useTranslation()
  const accuse = useGameStore((s) => s.accuse)
  const dialogRef = useRef<HTMLDivElement>(null)
// ... no this is wrong.

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
        <h2 className="font-display text-2xl text-gold mb-1">{t('ui.make_your_accusation')}</h2>
        <p className="text-sm text-shadow font-mono mb-4">{t('ui.accusation_warning')}</p>
        <div className="space-y-2">
          {SUSPECTS.map((s) => (
            <button key={s.id} onClick={() => accuse(s.id)}
              className="w-full text-left px-4 py-3 bg-surface border border-border rounded hover:border-gold hover:bg-dim transition-all">
              <div className="flex justify-between items-center">
                <span className="font-display text-paper">{t(`suspects.${s.id === 1 ? 'louis_krane' : s.id === 2 ? 'tommy_ricci' : s.id === 3 ? 'diane_harlow' : s.id === 4 ? 'frank_dellum' : 'nora_vance'}.name`)}</span>
                <span className="text-xs text-shadow font-mono">{t(`suspects.${s.id === 1 ? 'louis_krane' : s.id === 2 ? 'tommy_ricci' : s.id === 3 ? 'diane_harlow' : s.id === 4 ? 'frank_dellum' : 'nora_vance'}.role`)}</span>
              </div>
              <p className="text-xs text-shadow font-mono mt-1">{t(`suspects.${s.id === 1 ? 'louis_krane' : s.id === 2 ? 'tommy_ricci' : s.id === 3 ? 'diane_harlow' : s.id === 4 ? 'frank_dellum' : 'nora_vance'}.detail`)}</p>
            </button>
          ))}
        </div>
        <button onClick={onClose} className="mt-4 text-xs text-shadow hover:text-aged font-mono transition-colors">
          {t('ui.back_more_evidence')}
        </button>
      </div>
    </div>
  )
}

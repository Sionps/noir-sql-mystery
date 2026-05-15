'use client'

import { useEffect, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'

const KILLER_ID = 3

// Remove the unused CONFESSION_LINES constant

interface Props { onClose: () => void }

export default function VerdictModal({ onClose }: Props) {
  const { t } = useTranslation()
  const accusedId = useGameStore((s) => s.accusedId)
  const solved = useGameStore((s) => s.solved)
  const bonusClaimed = useGameStore((s) => s.bonusClaimed)
  const xp = useGameStore((s) => s.xp)
  const reset = useGameStore((s) => s.reset)
  const router = useRouter()
  const dialogRef = useRef<HTMLDivElement>(null)
  const correct = accusedId === KILLER_ID

  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handle)
    dialogRef.current?.focus()
    return () => document.removeEventListener('keydown', handle)
  }, [onClose])

  const handleReplay = () => { reset(); router.push('/') }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      <div ref={dialogRef} role="dialog" aria-modal="true" tabIndex={-1}
        className="bg-ink border border-border rounded-lg p-6 w-full max-w-lg mx-4 outline-none overflow-y-auto max-h-[90vh]">
        {correct ? (
          <>
            <div className="text-xs text-gold uppercase tracking-widest font-mono mb-2">{t('ui.case_closed')}</div>
            <h2 className="font-display text-3xl text-paper mb-4">{t('ui.verdict_guilty')}</h2>
            <div className="space-y-3 mb-6">
              {(() => {
                const confession = t('narrative.confession') as unknown;
                return Array.isArray(confession) ? (confession as string[]).map((line, i) => (
                  <p key={i} className="text-sm text-aged font-mono leading-relaxed">{line}</p>
                )) : null;
              })()}
            </div>
          </>
        ) : (
          <>
            <div className="text-xs text-red-400 uppercase tracking-widest font-mono mb-2">{t('ui.wrong_call')}</div>
            <h2 className="font-display text-3xl text-paper mb-4">{t('ui.killer_walks_free')}</h2>
            <p className="text-sm text-aged font-mono leading-relaxed mb-6">
              {t('ui.wrong_accusation')}
            </p>
          </>
        )}
        <div className="bg-surface border border-border rounded p-4 mb-6 space-y-1">
          <div className="text-xs text-shadow font-mono uppercase tracking-widest mb-2">{t('ui.case_stats')}</div>
          <div className="flex justify-between text-sm font-mono">
            <span className="text-shadow">{t('ui.levels_solved')}</span>
            <span className="text-aged">{solved.length} / 10</span>
          </div>
          <div className="flex justify-between text-sm font-mono">
            <span className="text-shadow">{t('ui.bonus_clues')}</span>
            <span className="text-aged">{bonusClaimed.length} / 10</span>
          </div>
          <div className="flex justify-between text-sm font-mono">
            <span className="text-shadow">{t('ui.total_xp')}</span>
            <span className="text-gold">{xp}</span>
          </div>
        </div>
        <button onClick={handleReplay}
          className="w-full py-2 bg-gold text-ink font-display text-lg rounded hover:bg-amber-400 transition-colors">
          {t('ui.new_investigation')}
        </button>
      </div>
    </div>
  )
}

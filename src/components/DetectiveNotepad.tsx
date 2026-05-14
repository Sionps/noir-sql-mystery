'use client'

import { useState, useEffect, useCallback } from 'react'
import { useGameStore } from '@/store/gameStore'
import { useLocalizedLevels } from '@/hooks/useLocalizedLevel'
import { useTranslation } from '@/hooks/useTranslation'

const NOTES_KEY = 'noir-notes-v1'

function TaskRow({
  done,
  locked,
  type,
  text,
  xpLabel,
}: {
  done: boolean
  locked: boolean
  type: string
  text: string
  xpLabel: string
}) {
  return (
    <div className={`flex items-start gap-2 py-2 border-b border-border last:border-0 ${locked ? 'opacity-40' : ''}`}>
      <div className={`mt-0.5 w-3.5 h-3.5 flex-shrink-0 rounded border text-center text-xs leading-3 ${
        done ? 'border-gold bg-dim text-gold' : 'border-border bg-surface'
      }`}>
        {done && '\u2713'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-shadow font-mono uppercase tracking-wider mb-0.5">{type}</div>
        <p className={`text-xs font-mono leading-relaxed ${done ? 'line-through text-shadow' : locked ? 'text-shadow' : 'text-aged'}`}>
          {text}
        </p>
        {!locked && (
          <span className={`inline-block mt-1 text-xs font-mono px-1.5 py-0.5 rounded ${
            done ? 'text-shadow bg-surface' : type.includes('Bonus') ? 'text-gold-dim bg-dim' : 'text-gold bg-dim'
          }`}>
            {xpLabel}
          </span>
        )}
      </div>
    </div>
  )
}

export default function DetectiveNotepad() {
  const { t } = useTranslation()
  const localizedLevels = useLocalizedLevels()
  const [tab, setTab] = useState<'tasks' | 'notes'>('tasks')
  const [notes, setNotes] = useState('')
  const currentLevel = useGameStore((s) => s.currentLevel)
  const solved = useGameStore((s) => s.solved)
  const bonusClaimed = useGameStore((s) => s.bonusClaimed)

  useEffect(() => {
    const saved = localStorage.getItem(NOTES_KEY)
    if (saved) setNotes(saved)
  }, [])

  const handleNotes = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value)
    localStorage.setItem(NOTES_KEY, e.target.value)
  }, [])

  const visibleLevels = localizedLevels.filter((l) => l.num <= currentLevel + 1)

  return (
    <div className="border-b border-border flex flex-col">
      <div className="flex border-b border-border">
        {(['tasks', 'notes'] as const).map((tabName) => (
          <button
            key={tabName}
            onClick={() => setTab(tabName)}
            className={`flex-1 py-2 text-xs font-mono uppercase tracking-widest transition-colors ${
              tab === tabName
                ? 'text-gold border-b-2 border-gold bg-surface'
                : 'text-shadow hover:text-aged'
            }`}
          >
            {tabName === 'tasks' ? t('ui.tasks_tab') : t('ui.notes_tab')}
          </button>
        ))}
      </div>

      {tab === 'tasks' && (
        <div className="overflow-y-auto max-h-56 px-3 py-1">
          {visibleLevels.map((level) => {
            const isLocked = level.num > currentLevel
            const isSolved = solved.includes(level.num)
            const isBonusDone = bonusClaimed.includes(level.num)
            const isCurrentBonus = level.num === currentLevel

            return (
              <div key={level.num}>
                <TaskRow
                  done={isSolved}
                  locked={isLocked}
                  type={isLocked ? t('ui.level_locked', { n: level.num }) : isSolved ? t('ui.level_done', { n: level.num }) : t('ui.level_current', { n: level.num })}
                  text={isLocked ? t('ui.locked_prompt') : level.objective}
                  xpLabel={isSolved ? t('ui.xp_earned', { n: 100 }) : t('ui.xp_reward', { n: 100 })}
                />
                {(isCurrentBonus || isBonusDone || isLocked) && (
                  <TaskRow
                    done={isBonusDone}
                    locked={isLocked}
                    type={isLocked ? t('ui.level_bonus_locked', { n: level.num }) : isBonusDone ? t('ui.level_bonus_done', { n: level.num }) : t('ui.level_bonus', { n: level.num })}
                    text={isLocked ? t('ui.locked_prompt') : level.bonus_prompt}
                    xpLabel={isBonusDone ? t('ui.xp_earned', { n: 50 }) : t('ui.xp_reward', { n: 50 })}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}

      {tab === 'notes' && (
        <div className="p-3">
          <textarea
            value={notes}
            onChange={handleNotes}
            placeholder="Jot down clues, suspects, timestamps\u2026"
            className="w-full h-40 bg-surface border border-border rounded p-2 text-xs text-aged font-mono leading-relaxed resize-none outline-none focus:border-shadow placeholder:text-shadow"
          />
          <p className="text-xs text-shadow font-mono mt-1">Saved automatically.</p>
        </div>
      )}
    </div>
  )
}

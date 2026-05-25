'use client'

import { useGameStore } from '@/store/gameStore'
import { useLocalizedLevels } from '@/hooks/useLocalizedLevel'
import { useTranslation } from '@/hooks/useTranslation'

export default function LevelNav() {
  const currentLevel = useGameStore((s) => s.currentLevel)
  const setBriefingLevel = useGameStore((s) => s.setBriefingLevel)
  const solved = useGameStore((s) => s.solved)
  const { t } = useTranslation()
  const localizedLevels = useLocalizedLevels()

  const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV']

  return (
    <div className="flex items-end gap-0.5">
      {localizedLevels.map((level) => {
        const isSolved = solved.includes(level.num)
        const isActive = currentLevel === level.num
        return (
          <button
            key={level.num}
            title={`${t('ui.level_label')} ${level.num}: ${level.title}`}
            onClick={() => setBriefingLevel(level.num)}
            className={[
              'px-3 py-1 text-[10px] font-mono uppercase tracking-wider border transition-colors',
              isActive
                ? 'bg-ink border-gold border-b-0 text-gold'
                : isSolved
                ? 'bg-surface border-border text-shadow opacity-50 hover:opacity-75'
                : 'bg-surface border-border text-shadow hover:text-aged hover:border-shadow',
            ].join(' ')}
          >
            {isSolved ? '✓' : `Case ${ROMAN[level.num - 1]}`}
          </button>
        )
      })}
    </div>
  )
}

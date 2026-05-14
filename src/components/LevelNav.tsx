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

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-shadow font-mono mr-2 uppercase tracking-widest">{t('ui.case_file')}</span>
      {localizedLevels.map((level) => {
        const isSolved = solved.includes(level.num)
        const isActive = currentLevel === level.num
        return (
          <button
            key={level.num}
            title={`${t('ui.level_label')} ${level.num}: ${level.title}`}
            onClick={() => setBriefingLevel(level.num)}
            className={[
              'w-7 h-7 rounded-full text-xs font-mono transition-all border',
              isActive
                ? 'bg-gold text-ink border-gold font-bold scale-110'
                : isSolved
                ? 'bg-dim text-gold border-gold-dim'
                : 'bg-surface text-shadow border-border hover:border-shadow',
            ].join(' ')}
          >
            {isSolved ? '✓' : level.num}
          </button>
        )
      })}
    </div>
  )
}

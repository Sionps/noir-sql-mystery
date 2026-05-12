'use client'

import { useGameStore } from '@/store/gameStore'
import { LEVELS } from '@/data/levels'

export default function LevelNav() {
  const currentLevel = useGameStore((s) => s.currentLevel)
  const setLevel = useGameStore((s) => s.setLevel)
  const solved = useGameStore((s) => s.solved)

  return (
    <div className="flex items-center gap-1 px-4 py-2 border-b border-border bg-ink">
      <span className="text-xs text-shadow font-mono mr-3 uppercase tracking-widest">Case</span>
      {LEVELS.map((level) => {
        const isSolved = solved.includes(level.num)
        const isActive = currentLevel === level.num
        return (
          <button
            key={level.num}
            title={`Level ${level.num}: ${level.title}`}
            onClick={() => setLevel(level.num)}
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

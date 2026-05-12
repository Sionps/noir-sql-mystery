'use client'

import { useGameStore } from '@/store/gameStore'
import type { Level } from '@/data/levels'

interface Props { level: Level }

export default function BonusClue({ level }: Props) {
  const claimed = useGameStore((s) => s.bonusClaimed.includes(level.num))

  return (
    <div className="border-t border-border px-4 py-3">
      <div className="text-xs text-gold-dim uppercase tracking-widest font-mono mb-1">Bonus Query</div>
      <p className="text-xs text-shadow font-mono mb-2">{level.bonus_prompt}</p>
      {claimed ? (
        <div className="bg-dim rounded p-2 border border-gold-dim">
          <div className="text-xs text-gold mb-1">★ Clue Unlocked</div>
          <p className="text-xs text-aged font-mono italic">{level.bonus_clue}</p>
        </div>
      ) : (
        <div className="bg-surface rounded p-2 border border-border">
          <p className="text-xs text-shadow font-mono italic">Complete the bonus query to unlock a hidden clue.</p>
        </div>
      )}
    </div>
  )
}

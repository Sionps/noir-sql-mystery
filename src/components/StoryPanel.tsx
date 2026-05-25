'use client'

import type { Level, StoryBlock } from '@/data/levels'
import { useGameStore } from '@/store/gameStore'
import { useTranslation } from '@/hooks/useTranslation'

interface Props { level: Level }

function Block({ block }: { block: StoryBlock }) {
  if (block.type === 'npc') {
    return (
      <div className="border-l-2 border-gold bg-surface rounded-r px-3 py-2 my-1">
        <p className="text-sm text-paper font-mono italic leading-relaxed">{block.text}</p>
      </div>
    )
  }
  return <p className="text-sm text-aged font-mono leading-relaxed">{block.text}</p>
}

export default function StoryPanel({ level }: Props) {
  const { t } = useTranslation()
  const solved = useGameStore((s) => s.solved)
  const isSolved = solved.includes(level.num)
  const caseNumber = `#${String(level.num).padStart(3, '0')}-A`

  return (
    <div className="border-b border-border">
      {/* Folder tab */}
      <div className="inline-block bg-ink border border-border border-b-0 px-3 py-1 ml-3 mt-2">
        <span className="text-[9px] font-mono text-gold uppercase tracking-widest">{t('ui.case_file')}</span>
      </div>
      {/* Panel body */}
      <div className="border border-border mx-0 p-4 space-y-3">
        {/* Stamps row */}
        <div className="flex items-center gap-2">
          <span className="border border-gold text-gold font-mono text-[7px] uppercase tracking-wider px-1.5 py-0.5">
            Confidential
          </span>
          <span className={[
            'border font-mono text-[7px] uppercase tracking-wider px-1.5 py-0.5',
            isSolved ? 'border-red text-red' : 'border-gold text-gold',
          ].join(' ')}>
            {isSolved ? 'Closed' : 'Open'}
          </span>
          <span className="ml-auto font-mono text-[8px] text-shadow">{caseNumber}</span>
        </div>

        <div className="inline-block bg-dim text-shadow text-xs font-mono uppercase tracking-widest px-2 py-0.5 rounded-full">
          {level.act}
        </div>
        <h2 className="font-display text-xl text-paper leading-tight">{level.title}</h2>
        <div className="flex gap-3 text-xs text-shadow font-mono">
          <span>&#x1F4CD; {level.location}</span>
          <span>&#x1F550; {level.time}</span>
        </div>
        <div className="space-y-2">
          {level.story.map((block, i) => <Block key={i} block={block} />)}
        </div>
      </div>
    </div>
  )
}

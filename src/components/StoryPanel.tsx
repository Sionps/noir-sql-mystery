'use client'

import type { Level, StoryBlock } from '@/data/levels'

interface Props { level: Level }

function Block({ block }: { block: StoryBlock }) {
  if (block.type === 'npc') {
    return (
      <blockquote className="border-l-2 border-gold pl-3 my-2 italic text-paper text-sm font-mono leading-relaxed">
        {block.text}
      </blockquote>
    )
  }
  return <p className="text-sm text-aged font-mono leading-relaxed">{block.text}</p>
}

export default function StoryPanel({ level }: Props) {
  return (
    <div className="p-4 space-y-3">
      <div className="text-xs text-shadow uppercase tracking-widest font-mono">{level.act}</div>
      <div className="space-y-0.5">
        <div className="text-xs text-gold-dim font-mono">{level.location}</div>
        <div className="text-xs text-shadow font-mono">{level.time}</div>
      </div>
      <div className="space-y-2">
        {level.story.map((block, i) => <Block key={i} block={block} />)}
      </div>
    </div>
  )
}

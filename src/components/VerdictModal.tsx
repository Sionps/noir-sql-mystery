'use client'

import { useEffect, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'
import { useRouter } from 'next/navigation'

const KILLER_ID = 3

const CONFESSION_LINES = [
  "Diane Harlow sat across from you in the precinct interview room, a cigarette burning between her fingers. She didn't look like a killer. She looked like a woman who'd been pushed too far.",
  '"He stole nine thousand five hundred dollars from me, Mr. Cross. My share of the Velvet Room. Three years of work. He called it a management fee. I called it theft."',
  "She exhaled slowly.",
  '"I sent him a message. I went to his room. I asked him to return it. He laughed at me."',
  "She looked at her hands.",
  '"I didn\'t plan it. But I\'m not sorry."',
  "Case closed. Malone's killer goes to trial. The Goldfinch Hotel goes back to keeping its secrets. And you go back to waiting for the next call at midnight.",
]

interface Props { onClose: () => void }

export default function VerdictModal({ onClose }: Props) {
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
            <div className="text-xs text-gold uppercase tracking-widest font-mono mb-2">Case Closed</div>
            <h2 className="font-display text-3xl text-paper mb-4">Diane Harlow — Guilty</h2>
            <div className="space-y-3 mb-6">
              {CONFESSION_LINES.map((line, i) => (
                <p key={i} className="text-sm text-aged font-mono leading-relaxed">{line}</p>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="text-xs text-red-400 uppercase tracking-widest font-mono mb-2">Wrong Call</div>
            <h2 className="font-display text-3xl text-paper mb-4">The Killer Walks Free</h2>
            <p className="text-sm text-aged font-mono leading-relaxed mb-6">
              You had the wrong person. Diane Harlow was on a train to Cincinnati before you realized your mistake. The case went cold.
            </p>
          </>
        )}
        <div className="bg-surface border border-border rounded p-4 mb-6 space-y-1">
          <div className="text-xs text-shadow font-mono uppercase tracking-widest mb-2">Case Stats</div>
          <div className="flex justify-between text-sm font-mono">
            <span className="text-shadow">Levels Solved</span>
            <span className="text-aged">{solved.length} / 10</span>
          </div>
          <div className="flex justify-between text-sm font-mono">
            <span className="text-shadow">Bonus Clues</span>
            <span className="text-aged">{bonusClaimed.length} / 10</span>
          </div>
          <div className="flex justify-between text-sm font-mono">
            <span className="text-shadow">Total XP</span>
            <span className="text-gold">{xp}</span>
          </div>
        </div>
        <button onClick={handleReplay}
          className="w-full py-2 bg-gold text-ink font-display text-lg rounded hover:bg-amber-400 transition-colors">
          Start a New Investigation
        </button>
      </div>
    </div>
  )
}

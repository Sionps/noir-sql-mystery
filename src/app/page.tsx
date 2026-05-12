'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'

export default function IntroPage() {
  const router = useRouter()
  const solved = useGameStore((s) => s.solved)
  const reset  = useGameStore((s) => s.reset)
  const [hasSave, setHasSave] = useState(false)

  useEffect(() => { setHasSave(solved.length > 0) }, [solved.length])

  return (
    <main className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md bg-ink border border-border rounded-lg p-8 space-y-6">
        <div className="space-y-1">
          <div className="text-xs text-shadow font-mono uppercase tracking-widest">Case File 47-1004</div>
          <h1 className="font-display text-5xl text-gold leading-tight">Dead on Arrival</h1>
          <p className="text-sm text-shadow font-mono">A SQL Murder Mystery · 1947</p>
        </div>

        <div className="space-y-3 text-sm font-mono text-aged leading-relaxed">
          <p>The body was found at half past midnight on the fourth floor of the Goldfinch Hotel. Victor Malone. Businessman. Someone who knew too many people with too many reasons to want him gone.</p>
          <p>You are <strong className="text-paper">Ray Cross</strong>, house detective. The only tool you have is access to the hotel records — ten database tables holding every secret this building has ever kept.</p>
          <p>Ten levels. Ten SQL queries. One killer. The precinct gives you until dawn.</p>
        </div>

        <div className="space-y-2">
          <button onClick={() => { reset(); router.push('/game') }}
            className="w-full py-3 bg-gold text-ink font-display text-xl rounded hover:bg-amber-400 transition-colors">
            Open Case File
          </button>
          {hasSave && (
            <button onClick={() => router.push('/game')}
              className="w-full py-2 bg-surface border border-border text-aged text-sm font-mono rounded hover:border-shadow transition-colors">
              Continue Investigation ({solved.length}/10 solved)
            </button>
          )}
        </div>
      </div>
    </main>
  )
}

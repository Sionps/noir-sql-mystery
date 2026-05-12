'use client'

import dynamic from 'next/dynamic'

const GameClient = dynamic(() => import('@/components/GameClient'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-surface text-aged font-mono">
      <div className="text-center space-y-2">
        <div className="text-gold font-display text-2xl">Loading case files...</div>
        <div className="text-sm text-shadow">Initializing WebAssembly database</div>
      </div>
    </div>
  ),
})

export default function GamePage() {
  return <GameClient />
}

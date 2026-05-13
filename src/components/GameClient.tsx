'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'
import { LEVELS } from '@/data/levels'
import { initDB, runQuery, resetDB } from '@/lib/db'
import { validateResult } from '@/lib/validator'
import type { FeedbackState } from './FeedbackBar'
import type { SQLEditorHandle } from './SQLEditor'
import LevelNav from './LevelNav'
import StoryPanel from './StoryPanel'
import DetectiveNotepad from './DetectiveNotepad'
import CaseBriefing from './CaseBriefing'
import SQLEditor from './SQLEditor'
import ResultsTable from './ResultsTable'
import FeedbackBar from './FeedbackBar'
import SchemaViewer from './SchemaViewer'
import SuspectList from './SuspectList'
import BonusClue from './BonusClue'
import AccuseModal from './AccuseModal'
import VerdictModal from './VerdictModal'

export default function GameClient() {
  const currentLevel  = useGameStore((s) => s.currentLevel)
  const setLevel      = useGameStore((s) => s.setLevel)
  const briefingLevel = useGameStore((s) => s.briefingLevel)
  const solveLevel    = useGameStore((s) => s.solveLevel)
  const claimBonus    = useGameStore((s) => s.claimBonus)
  const useHint       = useGameStore((s) => s.useHint)
  const solved        = useGameStore((s) => s.solved)
  const xp            = useGameStore((s) => s.xp)
  const canAccuse     = useGameStore((s) => s.canAccuse)
  const hintsLeft     = useGameStore((s) => s.hintsLeftForLevel)
  const accusationMade = useGameStore((s) => s.accusationMade)

  const [dbReady,      setDbReady]      = useState(false)
  const [feedback,     setFeedback]     = useState<FeedbackState>({ type: 'idle' })
  const [queryResult,  setQueryResult]  = useState<{ columns: string[]; rows: any[][] }>({ columns: [], rows: [] })
  const [showAccuse,   setShowAccuse]   = useState(false)
  const [showVerdict,  setShowVerdict]  = useState(false)

  const editorRef = useRef<SQLEditorHandle>(null)
  const level = LEVELS[currentLevel - 1]

  const [sidebarWidth, setSidebarWidth] = useState(320)
  const isResizing = useRef(false)

  const handleResizerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    isResizing.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    const startX = e.clientX
    const startW = sidebarWidth

    const onMove = (ev: MouseEvent) => {
      if (!isResizing.current) return
      const newWidth = Math.max(240, Math.min(480, startW + ev.clientX - startX))
      setSidebarWidth(newWidth)
    }

    const onUp = () => {
      isResizing.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [sidebarWidth])

  useEffect(() => { initDB().then(() => setDbReady(true)); return () => resetDB() }, [])
  useEffect(() => { if (accusationMade) setShowVerdict(true) }, [accusationMade])
  useEffect(() => {
    setFeedback({ type: 'idle' })
    setQueryResult({ columns: [], rows: [] })
  }, [currentLevel])

  const handleRun = useCallback((query: string) => {
    if (!dbReady) return
    try {
      const result = runQuery(query)
      setQueryResult(result)

      const { main, bonus } = validateResult(result, level)
      const alreadySolved = solved.includes(level.num)
      const alreadyBonus  = useGameStore.getState().bonusClaimed.includes(level.num)

      if (!alreadyBonus && bonus) {
        claimBonus(level.num)
        setFeedback({ type: 'bonus', message: level.bonus_clue })
        return
      }
      if (!alreadySolved && main) {
        solveLevel(level.num)
        setFeedback({ type: 'success', message: level.success })
        return
      }
      if (alreadySolved) {
        setFeedback({ type: 'success', message: level.success })
        return
      }
      setFeedback({ type: 'error', message: "That query did not reveal what we need. Try a different approach." })
    } catch (e: any) {
      setQueryResult({ columns: [], rows: [] })
      setFeedback({ type: 'error', message: `SQL error: ${e.message}` })
    }
  }, [dbReady, level, solved, solveLevel, claimBonus])

  const handleRunButton = useCallback(() => {
    const query = editorRef.current?.getValue().trim()
    if (query) handleRun(query)
  }, [handleRun])

  const handleHint = useCallback(() => {
    const tier = useHint(level.num)
    setFeedback({ type: 'hint', message: level.hints[tier - 1] })
  }, [level, useHint])

  const handleNext = useCallback(() => {
    if (currentLevel < 10) setLevel(currentLevel + 1)
  }, [currentLevel, setLevel])

  if (!dbReady) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface text-aged font-mono">
        <div className="text-center space-y-2">
          <div className="text-gold font-display text-2xl">Loading case files...</div>
          <div className="text-sm text-shadow">Initializing database</div>
        </div>
      </div>
    )
  }

  const isSolved = solved.includes(level.num)

  return (
    <div className="h-screen flex flex-col bg-surface overflow-hidden">
      <header className="flex items-center justify-between px-4 py-2 border-b border-border bg-ink">
        <div className="font-display text-xl text-gold">Dead on Arrival</div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-shadow hidden md:inline">{level.location}</span>
          <span className="text-shadow hidden md:inline">{level.time}</span>
          <span className="text-gold-dim">XP: {xp}</span>
        </div>
      </header>

      <div className="flex items-center px-4 py-2 border-b border-border bg-ink">
        <LevelNav />
        <div className="ml-auto">
          <SchemaViewer />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className="flex-shrink-0 border-r border-border flex flex-col overflow-y-auto bg-ink"
          style={{ width: sidebarWidth }}
        >
          <StoryPanel level={level} />
          <DetectiveNotepad />
          <BonusClue level={level} />
          <SuspectList />
          <div className="mt-auto p-4 border-t border-border">
            <button
              disabled={!canAccuse()}
              onClick={() => setShowAccuse(true)}
              className={[
                'w-full py-2 rounded font-display text-sm transition-all',
                canAccuse()
                  ? 'bg-red text-paper hover:opacity-80 cursor-pointer'
                  : 'bg-surface text-shadow border border-border cursor-not-allowed',
              ].join(' ')}>
              {canAccuse()
                ? 'Make Accusation'
                : `Solve ${8 - solved.length} more level${8 - solved.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </aside>

        <div
          className="w-1 flex-shrink-0 cursor-col-resize bg-border hover:bg-gold-dim transition-colors relative group"
          onMouseDown={handleResizerMouseDown}
        >
          <div className="absolute inset-y-0 -left-1 -right-1" />
        </div>

        <main className="flex-1 flex flex-col overflow-hidden p-4 gap-3">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs text-gold-dim font-mono uppercase tracking-widest">Level {level.num}</span>
              <span className="text-xs bg-dim text-shadow px-2 py-0.5 rounded font-mono">{level.badge}</span>
            </div>
            <h1 className="font-display text-xl text-paper">{level.title}</h1>
            <p className="text-sm text-shadow font-mono mt-1">{level.objective}</p>
          </div>

          <SQLEditor ref={editorRef} onRun={handleRun} />

          <div className="flex gap-2">
            <button onClick={handleRunButton}
              className="px-4 py-2 bg-gold text-ink text-sm font-display rounded hover:bg-amber-400 transition-colors">
              Run Query
            </button>
            <button onClick={handleHint} disabled={hintsLeft(level.num) === 0}
              className="px-4 py-2 bg-dim border border-border text-aged text-sm font-mono rounded hover:border-shadow transition-colors disabled:text-shadow disabled:cursor-not-allowed">
              Hint ({hintsLeft(level.num)} left)
            </button>
            <button
              onClick={() => { setQueryResult({ columns: [], rows: [] }); setFeedback({ type: 'idle' }) }}
              className="px-4 py-2 bg-surface border border-border text-shadow text-sm font-mono rounded hover:text-aged transition-colors">
              Clear
            </button>
          </div>

          <ResultsTable columns={queryResult.columns} rows={queryResult.rows} />

          <div className="mt-auto">
            <FeedbackBar
              state={feedback}
              onNext={isSolved && currentLevel < 10 ? handleNext : undefined}
            />
          </div>
        </main>
      </div>

      {showAccuse && <AccuseModal onClose={() => setShowAccuse(false)} />}
      {showVerdict && <VerdictModal onClose={() => setShowVerdict(false)} />}
      {briefingLevel !== null && <CaseBriefing levelNum={briefingLevel} />}
    </div>
  )
}

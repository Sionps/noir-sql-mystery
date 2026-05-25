'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'
import { LEVELS } from '@/data/levels'
import { initDB, runQuery, resetDB } from '@/lib/db'
import { validateResult } from '@/lib/validator'
import { useTranslation } from '@/hooks/useTranslation'
import { useLocalizedLevel } from '@/hooks/useLocalizedLevel'
import type { FeedbackState } from './FeedbackBar'
import type { SQLEditorHandle } from './SQLEditor'
import LevelNav from './LevelNav'
import StoryPanel from './StoryPanel'
import DetectiveNotepad from './DetectiveNotepad'
import { CaseBriefing } from './CaseBriefing'
import SQLEditor from './SQLEditor'
import ResultsTable from './ResultsTable'
import FeedbackBar from './FeedbackBar'
import SchemaViewer from './SchemaViewer'
import SuspectDossier from './SuspectDossier'
import BonusClue from './BonusClue'
import AccuseModal from './AccuseModal'
import VerdictModal from './VerdictModal'

export default function GameClient() {
  const currentLevel  = useGameStore((s) => s.currentLevel)
  const setLevel      = useGameStore((s) => s.setLevel)
  const briefingLevel = useGameStore((s) => s.briefingLevel)
  const language     = useGameStore((s) => s.language)
  const setLanguage   = useGameStore((s) => s.setLanguage)
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
  const { t } = useTranslation()
  const rawLevel = LEVELS[currentLevel - 1]
  const level    = useLocalizedLevel(rawLevel)

  const [activeTab, setActiveTab] = useState<'query' | 'suspects' | 'notes'>('query')
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
    setActiveTab('query')
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
      setFeedback({ type: 'error', message: t('ui.query_error') })
    } catch (e: any) {
      setQueryResult({ columns: [], rows: [] })
      setFeedback({ type: 'error', message: `${t('ui.sql_error')}: ${e.message}` })
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
    if (currentLevel < LEVELS.length) setLevel(currentLevel + 1)
  }, [currentLevel, setLevel])

  if (!dbReady) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface text-aged font-mono">
        <div className="text-center space-y-2">
          <div className="text-gold font-display text-2xl">{t('ui.loading_case_files')}</div>
          <div className="text-sm text-shadow">{t('ui.initializing_database')}</div>
        </div>
      </div>
    )
  }

  const isSolved = solved.includes(level.num)

  return (
    <div className="h-screen flex flex-col bg-surface overflow-hidden">
      <header className="flex items-center justify-between px-4 py-2 border-b-2 border-gold bg-ink">
        <div>
          <div className="font-display text-xl text-gold">{t('ui.game_title')}</div>
          <div className="font-mono text-[10px] text-shadow tracking-widest uppercase">A Detective&rsquo;s Case Files</div>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <button
            onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}
            className="text-shadow hover:text-gold transition-colors uppercase tracking-tighter"
          >
            {language === 'en' ? 'ไทย' : 'ENG'}
          </button>
          <span className="text-shadow hidden md:inline">{level.location}</span>
          <span className="text-shadow hidden md:inline">{level.time}</span>
          <span className="text-gold-dim">XP: {xp}</span>
        </div>
      </header>

      <div className="flex items-center px-4 py-1.5 border-b border-border bg-ink">
        <LevelNav />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className="flex-shrink-0 border-r border-border flex flex-col overflow-y-auto bg-ink"
          style={{ width: sidebarWidth }}
        >
          <StoryPanel level={level} />
          <BonusClue level={level} />
          <div className="mt-auto p-4 border-t border-border">
            <button
              disabled={!canAccuse()}
              onClick={() => setShowAccuse(true)}
              className={[
                'w-full py-2 font-mono text-[10px] uppercase tracking-wider border-2 transition-colors',
                canAccuse()
                  ? 'border-red text-red bg-[#0a0300] hover:border-[#c02020] cursor-pointer'
                  : 'border-border text-shadow bg-surface cursor-not-allowed opacity-50',
              ].join(' ')}>
              {canAccuse()
                ? t('ui.make_accusation')
                : (10 - solved.length) === 1
                  ? t('ui.solve_1_more_level')
                  : t('ui.solve_x_more_levels', { x: 10 - solved.length })}
            </button>
          </div>
        </aside>

        <div
          className="w-1 flex-shrink-0 cursor-col-resize bg-border hover:bg-gold-dim transition-colors relative group"
          onMouseDown={handleResizerMouseDown}
        >
          <div className="absolute inset-y-0 -left-1 -right-1" />
        </div>

        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Tab bar — SchemaViewer renders its own button inline in the row */}
          <div className="flex items-end gap-0.5 px-4 pt-3 border-b border-border bg-ink flex-shrink-0">
            <button
              onClick={() => setActiveTab('query')}
              className={[
                'px-4 py-1.5 text-[10px] font-mono uppercase tracking-wider border transition-colors',
                activeTab === 'query'
                  ? 'bg-surface border-gold border-b-0 text-gold'
                  : 'bg-ink border-border text-shadow hover:text-aged',
              ].join(' ')}
            >
              {t('ui.evidence_query')}
            </button>
            {/* SchemaViewer owns its open/close state internally; its button sits in the tab row */}
            <div className="ml-1">
              <SchemaViewer />
            </div>
            <button
              onClick={() => setActiveTab('suspects')}
              className={[
                'ml-1 px-4 py-1.5 text-[10px] font-mono uppercase tracking-wider border transition-colors',
                activeTab === 'suspects'
                  ? 'bg-surface border-gold border-b-0 text-gold'
                  : 'bg-ink border-border text-shadow hover:text-aged',
              ].join(' ')}
            >
              {t('ui.suspects')}
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={[
                'ml-1 px-4 py-1.5 text-[10px] font-mono uppercase tracking-wider border transition-colors',
                activeTab === 'notes'
                  ? 'bg-surface border-gold border-b-0 text-gold'
                  : 'bg-ink border-border text-shadow hover:text-aged',
              ].join(' ')}
            >
              {t('ui.detective_notes')}
            </button>
          </div>

          {/* Tab content */}
          {activeTab === 'query' && (
            <div className="flex-1 flex flex-col overflow-hidden p-4 gap-3">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs text-gold-dim font-mono uppercase tracking-widest">{t('ui.level_label')} {level.num}</span>
                  <span className="text-xs bg-dim text-shadow px-2 py-0.5 rounded font-mono">{level.badge}</span>
                </div>
                <h1 className="font-display text-xl text-paper">{level.title}</h1>
                <p className="text-sm text-shadow font-mono mt-1">{level.objective}</p>
              </div>

              <SQLEditor ref={editorRef} onRun={handleRun} />

              <div className="flex gap-2">
                <button onClick={handleRunButton}
                  className="px-4 py-2 border-2 border-gold text-gold text-[10px] font-mono uppercase tracking-wider bg-ink hover:border-aged transition-colors">
                  {t('ui.run_query')}
                </button>
                <button onClick={handleHint} disabled={hintsLeft(level.num) === 0}
                  className="px-4 py-2 border-2 border-border text-shadow text-[10px] font-mono uppercase tracking-wider hover:border-shadow transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  {t('ui.hint_with_count', { n: hintsLeft(level.num) })}
                </button>
                <button
                  onClick={() => { setQueryResult({ columns: [], rows: [] }); setFeedback({ type: 'idle' }) }}
                  className="px-4 py-2 border-2 border-border text-shadow text-[10px] font-mono uppercase tracking-wider hover:border-shadow transition-colors">
                  {t('ui.clear')}
                </button>
              </div>

              <ResultsTable columns={queryResult.columns} rows={queryResult.rows} />

              <div className="mt-auto">
                <FeedbackBar
                  state={feedback}
                  onNext={isSolved && currentLevel < LEVELS.length ? handleNext : undefined}
                />
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="flex-1 overflow-hidden">
              <DetectiveNotepad />
            </div>
          )}

          {activeTab === 'suspects' && (
            <div className="flex-1 overflow-hidden">
              <SuspectDossier />
            </div>
          )}
        </main>
      </div>

      {showAccuse && <AccuseModal onClose={() => setShowAccuse(false)} />}
      {showVerdict && <VerdictModal onClose={() => setShowVerdict(false)} />}
      {briefingLevel !== null && <CaseBriefing levelNum={briefingLevel} />}
    </div>
  )
}

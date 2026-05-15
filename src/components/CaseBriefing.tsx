import React, { useEffect, useRef } from 'react'
import { LEVELS } from '@/data/levels'
import { useGameStore } from '@/store/gameStore'
import { useTranslation } from '@/hooks/useTranslation'
import { useLocalizedLevel } from '@/hooks/useLocalizedLevel'

interface CaseBriefingProps {
  levelNum: number
}

export const CaseBriefing: React.FC<CaseBriefingProps> = ({ levelNum }) => {
  const setLevel = useGameStore((s) => s.setLevel)
  const setBriefingLevel = useGameStore((s) => s.setBriefingLevel)
  const { t } = useTranslation()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const rawLevel = LEVELS.find((l) => l.num === levelNum)
  const level    = useLocalizedLevel(rawLevel ?? LEVELS[0])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setBriefingLevel(null)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    buttonRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [setBriefingLevel])

  if (!rawLevel) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="briefing-title"
        className="relative max-w-lg w-full animate-in zoom-in-95 duration-300"
      >
        {/* Red push-pin */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full shadow-sm z-10" />

        <div className="bg-[#fff9c4] text-[#5d4037] font-serif p-8 md:p-12 shadow-2xl transform -rotate-2 relative overflow-hidden border border-[#e6dec4] animate-float">
          <div className="space-y-8">
            <div className="space-y-2">
              {/* Stamps */}
              <div className="flex items-center gap-2 mb-1">
                <span className="border border-[#8b6020] text-[#8b6020] font-mono text-[7px] uppercase tracking-wider px-1.5 py-0.5">
                  Confidential
                </span>
                <span className="border border-[#8b6020] text-[#8b6020] font-mono text-[7px] uppercase tracking-wider px-1.5 py-0.5">
                  Open
                </span>
                <span className="ml-auto font-mono text-[8px] text-[#a08040] opacity-60">
                  {`#${String(levelNum).padStart(3, '0')}-A`}
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-widest opacity-60 font-mono">{t('ui.case_briefing')}</span>
              <h2 id="briefing-title" className="text-2xl font-bold italic leading-tight">
                {level.title}
              </h2>
            </div>

            <div className="space-y-4">
              {level.story.map((block, i) =>
                block.type === 'npc' ? (
                  <p key={i} className="italic leading-relaxed text-base pl-4 border-l-2 border-[#c8a84b] text-[#6b4c2a]">
                    {block.text}
                  </p>
                ) : (
                  <p key={i} className="leading-relaxed text-base">
                    {block.text}
                  </p>
                )
              )}
            </div>

            <div className="pt-8 flex justify-center">
              <button
                ref={buttonRef}
                onClick={() => {
                  setLevel(levelNum)
                  setBriefingLevel(null)
                }}
                className="bg-[#5d4037] text-[#fff9c4] px-6 py-2 text-xs font-mono uppercase hover:bg-black hover:brightness-110 hover:scale-105 transition-all shadow-md active:translate-y-0.5"
              >
                {t('ui.start_digging')}
              </button>
            </div>
          </div>

          {/* Subtle paper edges effect */}
          <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-white/20 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  )
}

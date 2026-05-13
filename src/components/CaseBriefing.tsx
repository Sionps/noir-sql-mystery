import React from 'react'
import { LEVELS } from '@/data/levels'
import { useGameStore } from '@/store/gameStore'

interface CaseBriefingProps {
  levelNum: number
}

export const CaseBriefing: React.FC<CaseBriefingProps> = ({ levelNum }) => {
  const setLevel = useGameStore((s) => s.setLevel)
  const setBriefingLevel = useGameStore((s) => s.setBriefingLevel)

  const level = LEVELS.find((l) => l.num === levelNum)

  if (!level) return null

  const narrativeHook = level.story[0]?.text || ''

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative max-w-lg w-full">
        {/* Red push-pin */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full shadow-sm z-10" />

        <div className="bg-[#fff9c4] text-[#5d4037] font-serif p-8 md:p-12 shadow-2xl transform -rotate-2 relative overflow-hidden border border-[#e6dec4]">
          {/* Paper texture/subtle lines could go here, but keeping it clean as per requirements */}

          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest opacity-60 font-mono">Case Briefing</span>
              <h2 className="text-2xl font-bold italic leading-tight">
                {level.title}
              </h2>
            </div>

            <div className="space-y-4">
              <p className="italic leading-relaxed text-lg">
                "{narrativeHook}"
              </p>

              <div className="pt-4 border-t border-[#dccf9e]">
                <span className="text-xs uppercase tracking-wider font-mono opacity-70 block mb-1">Objective</span>
                <p className="font-bold text-lg">
                  {level.objective}
                </p>
              </div>
            </div>

            <div className="pt-8 flex justify-center">
              <button
                onClick={() => {
                  setLevel(levelNum)
                  setBriefingLevel(null)
                }}
                className="bg-[#5d4037] text-[#fff9c4] px-6 py-2 text-xs font-mono uppercase hover:bg-black transition-all shadow-md active:translate-y-0.5"
              >
                Start Digging
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

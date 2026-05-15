'use client'

import { useGameStore } from '@/store/gameStore'
import { useTranslation } from '@/hooks/useTranslation'

const KILLER_ID = 3

const SUSPECTS = [
  { id: 1, name: 'L. Krane',   fullName: 'Louis Krane',   role: 'Manager'  },
  { id: 2, name: 'T. Ricci',   fullName: 'Tommy Ricci',   role: 'Bellhop'  },
  { id: 3, name: 'D. Harlow',  fullName: 'Diane Harlow',  role: 'Singer'   },
  { id: 4, name: 'F. Dellum',  fullName: 'Frank Dellum',  role: 'Partner'  },
  { id: 5, name: 'N. Vance',   fullName: 'Nora Vance',    role: 'Maid'     },
]

export default function SuspectList() {
  const { t } = useTranslation()
  const accusedId      = useGameStore((s) => s.accusedId)
  const accusationMade = useGameStore((s) => s.accusationMade)

  return (
    <div className="border-t border-border">
      {/* Folder tab header */}
      <div className="inline-block bg-ink border border-border border-b-0 px-3 py-1 ml-3 mt-2">
        <span className="text-[9px] font-mono text-gold uppercase tracking-widest">{t('ui.suspects')}</span>
      </div>
      <div className="border border-border mx-0 px-3 py-3">
      <div className="grid grid-cols-2 gap-1.5">
        {SUSPECTS.map((s) => {
          const isAccused  = accusationMade && accusedId === s.id
          const isGuilty   = isAccused && s.id === KILLER_ID

          return (
            <div
              key={s.id}
              title={s.fullName}
              className={[
                'border p-1.5 text-center relative',
                isGuilty  ? 'border-gold bg-ink'    :
                isAccused ? 'border-red bg-[#200808]' :
                            'border-border bg-surface',
              ].join(' ')}
            >
              {/* Badge */}
              {isGuilty  && <span className="absolute top-1 right-1 text-gold text-[8px]">✓</span>}
              {isAccused && !isGuilty && <span className="absolute top-1 right-1 text-red  text-[8px]">✕</span>}

              {/* Portrait */}
              <div className={[
                'w-9 h-11 mx-auto mb-1 flex items-center justify-center text-xl border',
                isGuilty  ? 'bg-dim border-gold-dim'      :
                isAccused ? 'bg-[#3a0808] border-red'      :
                            'bg-ink border-border',
              ].join(' ')}>
                👤
              </div>

              <div className={[
                'font-mono text-[8px] truncate',
                isGuilty  ? 'text-gold'  :
                isAccused ? 'text-red'   :
                            'text-aged',
              ].join(' ')}>
                {s.name}
              </div>
              <div className="font-mono text-[7px] text-shadow truncate">{s.role}</div>

              {/* Stamp */}
              {isGuilty && (
                <div className="border border-gold text-gold font-mono text-[6px] uppercase tracking-wider px-1 mt-0.5 inline-block">
                  Guilty
                </div>
              )}
              {isAccused && !isGuilty && (
                <div className="border border-red text-red font-mono text-[6px] uppercase tracking-wider px-1 mt-0.5 inline-block">
                  Accused
                </div>
              )}
            </div>
          )
        })}
      </div>
      </div>
    </div>
  )
}

'use client'

import { SUSPECTS } from '@/data/suspects'
import { useGameStore } from '@/store/gameStore'
import { useTranslation } from '@/hooks/useTranslation'

const KILLER_ID = 3

export default function SuspectDossier() {
  const { t } = useTranslation()
  const accusedId      = useGameStore((s) => s.accusedId)
  const accusationMade = useGameStore((s) => s.accusationMade)

  return (
    <div className="flex flex-row gap-3 overflow-x-auto p-4 h-full items-start">
      {SUSPECTS.map((s) => {
        const isAccused = accusationMade && accusedId === s.id
        const isGuilty  = isAccused && s.id === KILLER_ID

        const cardBorder  = isGuilty  ? 'border-gold'   : isAccused ? 'border-red'   : 'border-border'
        const cardBg      = isAccused && !isGuilty ? 'bg-[#200808]' : 'bg-[#1a1208]'
        const photoBorder = isGuilty  ? 'border-gold'   : isAccused ? 'border-red'   : 'border-border'
        const photoBg     = isAccused && !isGuilty ? 'bg-[#3a0808]' : 'bg-[#0f0c06]'
        const silFill     = isGuilty  ? '#4a3010'       : isAccused ? '#5a1010'       : '#2a2010'
        const labelColor  = isGuilty  ? 'text-[#7a5518]': isAccused ? 'text-red'     : 'text-shadow'
        const textColor   = isAccused && !isGuilty ? 'text-[#f0c0c0]' : 'text-aged'
        const nameColor   = isGuilty  ? 'text-gold'     : isAccused ? 'text-red'     : 'text-gold'
        const nameBorder  = isGuilty  ? 'border-[#4a3010]' : isAccused ? 'border-[#5a1010]' : 'border-border'
        const plateBg     = isGuilty  ? 'bg-[#4a3010] text-gold' : isAccused ? 'bg-[#5a1010] text-red' : 'bg-[#2a2010] text-aged'
        const fileNumCls  = isGuilty  ? 'border-gold text-[#7a5518]' : isAccused ? 'border-red text-red' : 'border-border text-shadow'
        const alibiColor  = isGuilty  ? 'text-[#a09060] border-[#4a3010]' : isAccused ? 'text-[#c08080] border-[#5a1010]' : 'text-shadow border-border'

        const fields: [string, string][] = [
          [t('ui.field_role'),  t(s.roleKey)],
          [t('ui.field_age'),   String(s.age)],
          [t('ui.field_build'), `${s.height} · ${s.build}`],
          [t('ui.field_hair'),  s.hair],
          [t('ui.field_eyes'),  s.eyes],
        ]

        return (
          <div
            key={s.id}
            className={`flex-shrink-0 w-44 border ${cardBorder} ${cardBg} p-2.5 relative flex flex-col`}
          >
            {/* Status stamp */}
            {isGuilty && (
              <div className="absolute top-1.5 right-1.5 border border-gold text-gold font-mono text-[6px] uppercase tracking-wider px-1 py-0.5 bg-ink z-10">
                Guilty
              </div>
            )}
            {isAccused && !isGuilty && (
              <div className="absolute top-1.5 right-1.5 border border-red text-red font-mono text-[6px] uppercase tracking-wider px-1 py-0.5 bg-[#200808] z-10">
                Accused
              </div>
            )}

            {/* Photo */}
            <div className={`w-full aspect-[3/4] ${photoBg} border ${photoBorder} flex items-center justify-center overflow-hidden relative`}>
              <img
                src={`/suspects/${s.id}.jpg`}
                alt={t(s.nameKey)}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  const sil = e.currentTarget.nextElementSibling as SVGElement | null
                  if (sil) sil.style.display = 'block'
                }}
              />
              <svg
                style={{ display: 'none' }}
                width="60%"
                height="80%"
                viewBox="0 0 60 80"
                fill="none"
                aria-hidden="true"
              >
                <ellipse cx="30" cy="24" rx="15" ry="18" fill={silFill} />
                <ellipse cx="30" cy="64" rx="23" ry="20" fill={silFill} />
              </svg>
            </div>

            {/* Nameplate */}
            <div className={`font-mono text-[6px] text-center py-1 px-1 uppercase tracking-wider ${plateBg}`}>
              {s.plate}
            </div>
            <div className={`font-mono text-[6px] text-center py-0.5 border border-t-0 mb-2 ${fileNumCls}`}>
              #{String(s.id).padStart(3, '0')}-A
            </div>

            {/* Name header */}
            <div className={`font-mono text-[9px] uppercase tracking-wider pb-1 mb-1 border-b ${nameColor} ${nameBorder}`}>
              {t(s.nameKey)}
            </div>

            {/* Fields */}
            <div className={`font-mono text-[7px] leading-loose flex-1 ${textColor}`}>
              {fields.map(([label, value]) => (
                <div key={label} className="flex gap-1">
                  <span className={`flex-shrink-0 ${labelColor}`}>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>

            {/* Alibi */}
            <div className={`mt-2 pt-2 border-t font-mono text-[6.5px] italic leading-relaxed ${alibiColor}`}>
              {t(s.alibiKey)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

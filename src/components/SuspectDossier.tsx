'use client'

import { useState, useEffect } from 'react'
import { SUSPECTS } from '@/data/suspects'
import { useGameStore } from '@/store/gameStore'
import { useTranslation } from '@/hooks/useTranslation'

const KILLER_ID = 3

function getColors(isAccused: boolean, isGuilty: boolean) {
  return {
    cardBorder: isGuilty  ? 'border-gold'              : isAccused ? 'border-red'              : 'border-border',
    cardBg:     isAccused && !isGuilty ? 'bg-[#200808]'             : 'bg-[#1a1208]',
    photoBorder:isGuilty  ? 'border-gold'              : isAccused ? 'border-red'              : 'border-border',
    photoBg:    isAccused && !isGuilty ? 'bg-[#3a0808]'             : 'bg-[#0f0c06]',
    silFill:    isGuilty  ? '#4a3010'                  : isAccused ? '#5a1010'                  : '#2a2010',
    labelColor: isGuilty  ? 'text-[#7a5518]'           : isAccused ? 'text-red'                : 'text-shadow',
    textColor:  isAccused && !isGuilty ? 'text-[#f0c0c0]'           : 'text-aged',
    nameColor:  isGuilty  ? 'text-gold'                : isAccused ? 'text-red'                : 'text-gold',
    nameBorder: isGuilty  ? 'border-[#4a3010]'         : isAccused ? 'border-[#5a1010]'        : 'border-border',
    plateBg:    isGuilty  ? 'bg-[#4a3010] text-gold'   : isAccused ? 'bg-[#5a1010] text-red'   : 'bg-[#2a2010] text-aged',
    fileNumCls: isGuilty  ? 'border-gold text-[#7a5518]': isAccused ? 'border-red text-red'    : 'border-border text-shadow',
    alibiColor: isGuilty  ? 'text-[#a09060] border-[#4a3010]' : isAccused ? 'text-[#c08080] border-[#5a1010]' : 'text-shadow border-border',
  }
}

function SuspectPhoto({ id, name, photoBg, photoBorder, silFill }: {
  id: number; name: string; photoBg: string; photoBorder: string; silFill: string
}) {
  return (
    <div className={`w-full aspect-[3/4] ${photoBg} border ${photoBorder} flex items-center justify-center overflow-hidden relative`}>
      <img
        src={`/suspects/${id}.jpg`}
        alt={name}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.style.display = 'none'
          const sil = e.currentTarget.nextElementSibling as SVGElement | null
          if (sil) sil.style.display = 'block'
        }}
      />
      <svg style={{ display: 'none' }} width="60%" height="80%" viewBox="0 0 60 80" fill="none" aria-hidden="true">
        <ellipse cx="30" cy="24" rx="15" ry="18" fill={silFill} />
        <ellipse cx="30" cy="64" rx="23" ry="20" fill={silFill} />
      </svg>
    </div>
  )
}

export default function SuspectDossier() {
  const { t } = useTranslation()
  const accusedId      = useGameStore((s) => s.accusedId)
  const accusationMade = useGameStore((s) => s.accusationMade)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const selected = SUSPECTS.find((s) => s.id === selectedId) ?? null

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedId(null) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      {/* Card row */}
      <div className="flex flex-row gap-3 overflow-x-auto p-4 h-full items-start">
        {SUSPECTS.map((s) => {
          const isAccused = accusationMade && accusedId === s.id
          const isGuilty  = isAccused && s.id === KILLER_ID
          const c = getColors(isAccused, isGuilty)
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
              onClick={() => setSelectedId(s.id)}
              className={`flex-shrink-0 w-64 border ${c.cardBorder} ${c.cardBg} p-3 relative flex flex-col cursor-pointer hover:brightness-110 transition-all`}
            >
              {isGuilty && (
                <div className="absolute top-2 right-2 border border-gold text-gold font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 bg-ink z-10">
                  {t('ui.stamp_guilty')}
                </div>
              )}
              {isAccused && !isGuilty && (
                <div className="absolute top-2 right-2 border border-red text-red font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 bg-[#200808] z-10">
                  {t('ui.stamp_accused')}
                </div>
              )}

              <SuspectPhoto id={s.id} name={t(s.nameKey)} photoBg={c.photoBg} photoBorder={c.photoBorder} silFill={c.silFill} />

              <div className={`font-mono text-[9px] text-center py-1.5 px-1 uppercase tracking-wider ${c.plateBg}`}>{s.plate}</div>
              <div className={`font-mono text-[8px] text-center py-1 border border-t-0 mb-2 ${c.fileNumCls}`}>
                #{String(s.id).padStart(3, '0')}-A
              </div>

              <div className={`font-mono text-xs uppercase tracking-wider pb-1.5 mb-1.5 border-b ${c.nameColor} ${c.nameBorder}`}>
                {t(s.nameKey)}
              </div>

              <div className={`font-mono text-[9px] leading-loose flex-1 ${c.textColor}`}>
                {fields.map(([label, value]) => (
                  <div key={label} className="flex gap-1.5">
                    <span className={`flex-shrink-0 ${c.labelColor}`}>{label}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>

              <div className={`mt-2 pt-2 border-t font-mono text-[8px] italic leading-relaxed ${c.alibiColor}`}>
                {t(s.alibiKey)}
              </div>
            </div>
          )
        })}
      </div>

      {/* Popup */}
      {selected && (() => {
        const s = selected
        const isAccused = accusationMade && accusedId === s.id
        const isGuilty  = isAccused && s.id === KILLER_ID
        const c = getColors(isAccused, isGuilty)

        return (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedId(null)}
          >
            <div
              className={`relative max-w-3xl w-full border-2 ${c.cardBorder} ${c.cardBg} flex gap-6 p-6 shadow-2xl max-h-[88vh]`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={() => setSelectedId(null)}
                className="absolute top-3 right-4 font-mono text-xs text-shadow hover:text-aged transition-colors"
                aria-label="Close"
              >
                ✕
              </button>

              {/* Photo column */}
              <div className="flex-shrink-0 w-48 flex flex-col gap-0">
                <SuspectPhoto id={s.id} name={t(s.nameKey)} photoBg={c.photoBg} photoBorder={c.photoBorder} silFill={c.silFill} />
                <div className={`font-mono text-[8px] text-center py-1.5 uppercase tracking-wider ${c.plateBg}`}>{s.plate}</div>
                <div className={`font-mono text-[8px] text-center py-1 border border-t-0 ${c.fileNumCls}`}>
                  #{String(s.id).padStart(3, '0')}-A
                </div>
              </div>

              {/* Info column */}
              <div className="flex-1 flex flex-col gap-4 min-w-0 overflow-y-auto">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className={`font-display text-2xl ${c.nameColor} leading-tight`}>{t(s.nameKey)}</div>
                    <div className={`font-mono text-xs uppercase tracking-widest mt-0.5 ${c.labelColor}`}>{t(s.roleKey)}</div>
                  </div>
                  {isGuilty && (
                    <div className="border border-gold text-gold font-mono text-[9px] uppercase tracking-wider px-2 py-1 flex-shrink-0">
                      {t('ui.stamp_guilty')}
                    </div>
                  )}
                  {isAccused && !isGuilty && (
                    <div className="border border-red text-red font-mono text-[9px] uppercase tracking-wider px-2 py-1 flex-shrink-0">
                      {t('ui.stamp_accused')}
                    </div>
                  )}
                </div>

                {/* Physical fields */}
                <div className={`border-t border-b ${c.nameBorder} py-3`}>
                  {([
                    [t('ui.field_age'),   String(s.age)],
                    [t('ui.field_build'), `${s.height} · ${s.build}`],
                    [t('ui.field_hair'),  s.hair],
                    [t('ui.field_eyes'),  s.eyes],
                  ] as [string, string][]).map(([label, value]) => (
                    <div key={label} className={`flex gap-3 font-mono text-sm leading-loose ${c.textColor}`}>
                      <span className={`w-20 flex-shrink-0 ${c.labelColor}`}>{label}</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>

                {/* Alibi */}
                <div>
                  <div className={`font-mono text-[9px] uppercase tracking-widest mb-1.5 ${c.labelColor}`}>
                    {t('ui.field_alibi')}
                  </div>
                  <p className={`font-mono text-sm italic leading-relaxed ${c.alibiColor.split(' ')[0]}`}>
                    "{t(s.alibiKey)}"
                  </p>
                </div>

                <div className={`border-t ${c.nameBorder}`} />

                {/* Backstory */}
                <div>
                  <div className={`font-mono text-[9px] uppercase tracking-widest mb-1.5 ${c.labelColor}`}>
                    {t('ui.field_backstory')}
                  </div>
                  <p className={`font-mono text-sm leading-relaxed ${c.textColor}`}>{t(s.backstoryKey)}</p>
                </div>

                {/* Motive */}
                <div>
                  <div className={`font-mono text-[9px] uppercase tracking-widest mb-1.5 ${c.labelColor}`}>
                    {t('ui.field_motive')}
                  </div>
                  <p className={`font-mono text-sm leading-relaxed ${c.textColor}`}>{t(s.motiveKey)}</p>
                </div>

                {/* Connection */}
                <div>
                  <div className={`font-mono text-[9px] uppercase tracking-widest mb-1.5 ${c.labelColor}`}>
                    {t('ui.field_relation')}
                  </div>
                  <p className={`font-mono text-sm leading-relaxed ${c.textColor}`}>{t(s.relationKey)}</p>
                </div>

                {/* Record */}
                <div className="pb-1">
                  <div className={`font-mono text-[9px] uppercase tracking-widest mb-1.5 ${c.labelColor}`}>
                    {t('ui.field_record')}
                  </div>
                  <p className={`font-mono text-sm leading-relaxed ${c.textColor}`}>{t(s.recordKey)}</p>
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </>
  )
}

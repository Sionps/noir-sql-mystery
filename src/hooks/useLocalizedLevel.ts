import { LEVELS, Level } from '@/data/levels'
import { translations } from '@/data/translations'
import { useGameStore } from '@/store/gameStore'

function applyTranslation(level: Level, translated: any): Level {
  return {
    ...level,
    act: translated.act ?? level.act,
    title: translated.title ?? level.title,
    location: translated.location ?? level.location,
    time: translated.time ?? level.time,
    badge: translated.badge ?? level.badge,
    story: translated.story ?? level.story,
    objective: translated.objective ?? level.objective,
    hints: translated.hints ?? level.hints,
    success: translated.success ?? level.success,
    bonus_prompt: translated.bonus_prompt ?? level.bonus_prompt,
    bonus_clue: translated.bonus_clue ?? level.bonus_clue,
  }
}

export function useLocalizedLevel(level: Level): Level {
  const language = useGameStore((s) => s.language)
  if (language === 'en') return level
  const translated = (translations[language] as any).levels?.[level.num]
  if (!translated) return level
  return applyTranslation(level, translated)
}

export function useLocalizedLevels(): Level[] {
  const language = useGameStore((s) => s.language)
  if (language === 'en') return LEVELS
  const translatedLevels = (translations[language] as any).levels ?? {}
  return LEVELS.map((level) => {
    const translated = translatedLevels[level.num]
    if (!translated) return level
    return applyTranslation(level, translated)
  })
}

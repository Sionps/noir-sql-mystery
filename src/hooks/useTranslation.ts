import { translations, Language } from '@/data/translations'
import { useGameStore } from '@/store/gameStore'

export function useTranslation() {
  const language = useGameStore((s) => s.language)

  const t = (key: string, params?: Record<string, string | number>) => {
    const keys = key.split('.')
    let value: any = translations[language]

    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) break
    }

    if (typeof value === 'string') {
      if (!params) return value

      let translated = value
      for (const [k, v] of Object.entries(params)) {
        translated = translated.replace(`{${k}}`, String(v))
      }
      return translated
    }

    return key
  }

  return { t, language }
}

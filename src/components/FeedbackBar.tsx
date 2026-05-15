'use client'

import { useTranslation } from '@/hooks/useTranslation'

export type FeedbackState =
  | { type: 'idle' }
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }
  | { type: 'hint'; message: string }
  | { type: 'bonus'; message: string }

interface Props {
  state: FeedbackState
  onNext?: () => void
}

const CONFIG: Record<FeedbackState['type'], { bg: string; icon: string; text: string }> = {
  idle:    { bg: 'bg-dim',         icon: '🕵',  text: 'text-shadow' },
  success: { bg: 'bg-green-950',   icon: '✔',   text: 'text-green-300' },
  error:   { bg: 'bg-red-950',     icon: '✖',   text: 'text-red-300' },
  hint:    { bg: 'bg-amber-950',   icon: '💡',  text: 'text-amber-300' },
  bonus:   { bg: 'bg-emerald-950', icon: '★',   text: 'text-emerald-300' },
}

export default function FeedbackBar({ state, onNext }: Props) {
  const { t } = useTranslation()
  const cfg = CONFIG[state.type]
  const message = state.type === 'idle'
    ? t('ui.idle_message')
    : state.message

  return (
    <div role="status" aria-live="polite"
      className={`flex items-center gap-3 px-4 py-2 rounded ${cfg.bg} transition-colors duration-300`}>
      <span className="text-lg flex-shrink-0">{cfg.icon}</span>
      <span className={`flex-1 text-sm font-mono tracking-wide ${cfg.text}`}>{message}</span>
      {state.type === 'success' && onNext && (
        <button onClick={onNext}
          className="ml-auto px-4 py-1.5 border-2 border-gold text-gold text-[10px] font-mono uppercase tracking-wider bg-ink hover:border-aged transition-colors">
          {t('ui.next_level')}
        </button>
      )}
    </div>
  )
}

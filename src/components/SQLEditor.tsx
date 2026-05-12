'use client'

import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react'
import { EditorView, keymap } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { defaultKeymap, historyKeymap, history } from '@codemirror/commands'
import { sql } from '@codemirror/lang-sql'
import { oneDark } from '@codemirror/theme-one-dark'
import { basicSetup } from 'codemirror'

const DB_SCHEMA = {
  persons: ['id', 'name', 'role', 'room_no', 'alibi'],
  hotel_log: ['id', 'person_id', 'event', 'floor', 'timestamp'],
  evidence: ['id', 'item', 'location', 'notes'],
  phone_rec: ['id', 'caller_id', 'called', 'duration', 'timestamp'],
  financials: ['id', 'person_id', 'memo', 'amount', 'date'],
  bar_tabs: ['id', 'person_id', 'drink', 'tab_time', 'paid'],
  witnesses: ['id', 'name', 'statement', 'credibility'],
  alley_log: ['id', 'person_id', 'seen_at', 'direction', 'notes'],
  messages: ['id', 'sender_id', 'recipient', 'body', 'sent_at'],
  staff: ['id', 'name', 'shift', 'floor_access', 'notes'],
}

const noirTheme = EditorView.theme({
  '&': { backgroundColor: '#050401', color: '#d4c49a', height: '180px', fontSize: '13px', fontFamily: "'Courier Prime', monospace" },
  '.cm-content': { padding: '12px' },
  '.cm-focused': { outline: 'none' },
  '.cm-line': { lineHeight: '1.6' },
  '.cm-gutters': { backgroundColor: '#0f0c06', borderRight: '1px solid #2a2010', color: '#6a5030' },
  '.cm-activeLineGutter': { backgroundColor: '#1a1208' },
  '.cm-activeLine': { backgroundColor: '#1a120866' },
  '.cm-selectionBackground': { backgroundColor: '#2a2010 !important' },
})

export interface SQLEditorHandle {
  getValue: () => string
}

interface Props {
  initialValue?: string
  onRun: (query: string) => void
}

const SQLEditor = forwardRef<SQLEditorHandle, Props>(function SQLEditor({ initialValue = '', onRun }, ref) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)

  const handleRun = useCallback(() => {
    const value = viewRef.current?.state.doc.toString().trim() ?? ''
    if (value) onRun(value)
  }, [onRun])

  useImperativeHandle(ref, () => ({
    getValue: () => viewRef.current?.state.doc.toString() ?? '',
  }))

  useEffect(() => {
    if (!containerRef.current) return

    const runKeymap = keymap.of([
      { key: 'Ctrl-Enter', mac: 'Cmd-Enter', run: () => { handleRun(); return true } },
    ])

    const state = EditorState.create({
      doc: initialValue,
      extensions: [
        basicSetup, history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        runKeymap,
        sql({ schema: DB_SCHEMA }),
        oneDark, noirTheme,
        EditorView.lineWrapping,
      ],
    })

    const view = new EditorView({ state, parent: containerRef.current })
    viewRef.current = view
    return () => { view.destroy(); viewRef.current = null }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="rounded border border-border overflow-hidden">
      <div ref={containerRef} aria-label="SQL query editor" className="min-h-[180px]" />
    </div>
  )
})

export default SQLEditor

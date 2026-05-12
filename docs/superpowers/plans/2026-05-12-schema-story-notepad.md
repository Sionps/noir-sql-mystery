# Schema ER Diagram, Story Redesign & Detective Notepad — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve sidebar UX with a visual ER diagram modal for schema, better story typography, and a tabbed detective notepad with auto-generated tasks + free notes.

**Architecture:** Four isolated changes, all in `src/components/`. `StoryPanel.tsx` gets richer markup. `SchemaViewer.tsx` becomes a modal trigger + full SVG ER diagram. A new `DetectiveNotepad.tsx` handles tabbed tasks/notes with localStorage. `GameClient.tsx` gets one new import and one new JSX line.

**Tech Stack:** React (hooks, forwardRef), TypeScript, Tailwind CSS (existing noir tokens), SVG (inline, no library), localStorage (raw, no Zustand).

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/components/StoryPanel.tsx` | Modify | Act chip, serif title, meta row, NPC card, objective box |
| `src/components/SchemaViewer.tsx` | Rewrite | Button opens modal with SVG ER diagram |
| `src/components/DetectiveNotepad.tsx` | Create | Tabbed panel: auto tasks + free notes |
| `src/components/GameClient.tsx` | Modify | Import + render `<DetectiveNotepad />` after `<StoryPanel />` |

---

## Task 1: Story Panel — Better Typography

**Files:**
- Modify: `src/components/StoryPanel.tsx`

The current StoryPanel renders a plain `<div>` with small-text story blocks. We upgrade it to show: act chip pill, serif title, icon meta row (📍 location, 🕐 time), existing story blocks with improved NPC quote styling, and a pinned objective box.

The `Level` interface (from `src/data/levels.ts`) already has `act`, `title`, `location`, `time`, `story`, and `objective` — no data changes needed.

- [ ] **Step 1: Replace StoryPanel.tsx entirely**

Write `src/components/StoryPanel.tsx`:

```tsx
'use client'

import type { Level, StoryBlock } from '@/data/levels'

interface Props { level: Level }

function Block({ block }: { block: StoryBlock }) {
  if (block.type === 'npc') {
    return (
      <div className="border-l-2 border-gold bg-surface rounded-r px-3 py-2 my-1">
        <p className="text-sm text-paper font-mono italic leading-relaxed">{block.text}</p>
      </div>
    )
  }
  return <p className="text-sm text-aged font-mono leading-relaxed">{block.text}</p>
}

export default function StoryPanel({ level }: Props) {
  return (
    <div className="p-4 space-y-3 border-b border-border">
      <div className="inline-block bg-dim text-shadow text-xs font-mono uppercase tracking-widest px-2 py-0.5 rounded-full">
        {level.act}
      </div>
      <h2 className="font-display text-xl text-paper leading-tight">{level.title}</h2>
      <div className="flex gap-3 text-xs text-shadow font-mono">
        <span>📍 {level.location}</span>
        <span>🕐 {level.time}</span>
      </div>
      <div className="space-y-2">
        {level.story.map((block, i) => <Block key={i} block={block} />)}
      </div>
      <div className="bg-surface border border-border rounded p-2 mt-1">
        <div className="text-xs text-gold-dim uppercase tracking-widest font-mono mb-1">Objective</div>
        <p className="text-xs text-aged font-mono leading-relaxed">{level.objective}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/StoryPanel.tsx
git commit -m "feat: improve story panel — serif title, act chip, NPC card, objective box"
```

---

## Task 2: Detective Notepad Component

**Files:**
- Create: `src/components/DetectiveNotepad.tsx`

This component shows two tabs:
- **Tasks** — auto-generated from `LEVELS`, driven by `currentLevel`, `solved`, and `bonusClaimed` from the Zustand store. Read-only. Shows: all solved levels (checked, strikethrough), current level's main + bonus task (unchecked), next level (locked, dimmed). No user input on this tab.
- **Notes** — a `<textarea>` persisted to `localStorage` under key `noir-notes-v1`. Saves on every `onChange`.

- [ ] **Step 1: Create DetectiveNotepad.tsx**

Write `src/components/DetectiveNotepad.tsx`:

```tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useGameStore } from '@/store/gameStore'
import { LEVELS } from '@/data/levels'

const NOTES_KEY = 'noir-notes-v1'

function TaskRow({
  done,
  locked,
  type,
  text,
  xpLabel,
}: {
  done: boolean
  locked: boolean
  type: string
  text: string
  xpLabel: string
}) {
  return (
    <div className={`flex items-start gap-2 py-2 border-b border-border last:border-0 ${locked ? 'opacity-40' : ''}`}>
      <div className={`mt-0.5 w-3.5 h-3.5 flex-shrink-0 rounded border text-center text-xs leading-3 ${
        done ? 'border-gold bg-dim text-gold' : 'border-border bg-surface'
      }`}>
        {done && '✓'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-shadow font-mono uppercase tracking-wider mb-0.5">{type}</div>
        <p className={`text-xs font-mono leading-relaxed ${done ? 'line-through text-shadow' : locked ? 'text-shadow' : 'text-aged'}`}>
          {text}
        </p>
        {!locked && (
          <span className={`inline-block mt-1 text-xs font-mono px-1.5 py-0.5 rounded ${
            done ? 'text-shadow bg-surface' : type.includes('Bonus') ? 'text-gold-dim bg-dim' : 'text-gold bg-dim'
          }`}>
            {xpLabel}
          </span>
        )}
      </div>
    </div>
  )
}

export default function DetectiveNotepad() {
  const [tab, setTab] = useState<'tasks' | 'notes'>('tasks')
  const [notes, setNotes] = useState('')
  const currentLevel = useGameStore((s) => s.currentLevel)
  const solved = useGameStore((s) => s.solved)
  const bonusClaimed = useGameStore((s) => s.bonusClaimed)

  useEffect(() => {
    const saved = localStorage.getItem(NOTES_KEY)
    if (saved) setNotes(saved)
  }, [])

  const handleNotes = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value)
    localStorage.setItem(NOTES_KEY, e.target.value)
  }, [])

  const visibleLevels = LEVELS.filter((l) => l.num <= currentLevel + 1)

  return (
    <div className="border-b border-border flex flex-col">
      <div className="flex border-b border-border">
        {(['tasks', 'notes'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-xs font-mono uppercase tracking-widest transition-colors ${
              tab === t
                ? 'text-gold border-b-2 border-gold bg-surface'
                : 'text-shadow hover:text-aged'
            }`}
          >
            {t === 'tasks' ? '📋 Tasks' : '🗒 Notes'}
          </button>
        ))}
      </div>

      {tab === 'tasks' && (
        <div className="overflow-y-auto max-h-56 px-3 py-1">
          {visibleLevels.map((level) => {
            const isLocked = level.num > currentLevel
            const isSolved = solved.includes(level.num)
            const isBonusDone = bonusClaimed.includes(level.num)
            const isCurrentBonus = level.num === currentLevel

            return (
              <div key={level.num}>
                <TaskRow
                  done={isSolved}
                  locked={isLocked}
                  type={isLocked ? `Level ${level.num} · Locked` : isSolved ? `Level ${level.num} · Done` : `Level ${level.num} · Current`}
                  text={isLocked ? 'Complete the previous level to unlock…' : level.objective}
                  xpLabel={isSolved ? '+100 XP earned' : '+100 XP'}
                />
                {(isCurrentBonus || isBonusDone || isLocked) && (
                  <TaskRow
                    done={isBonusDone}
                    locked={isLocked}
                    type={isLocked ? `Level ${level.num} · Bonus locked` : isBonusDone ? `Level ${level.num} · Bonus done` : `Level ${level.num} · Bonus`}
                    text={isLocked ? 'Complete the previous level to unlock…' : level.bonus_prompt}
                    xpLabel={isBonusDone ? '+50 XP earned' : '+50 XP'}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}

      {tab === 'notes' && (
        <div className="p-3">
          <textarea
            value={notes}
            onChange={handleNotes}
            placeholder="Jot down clues, suspects, timestamps…"
            className="w-full h-40 bg-surface border border-border rounded p-2 text-xs text-aged font-mono leading-relaxed resize-none outline-none focus:border-shadow placeholder:text-shadow"
          />
          <p className="text-xs text-shadow font-mono mt-1">Saved automatically.</p>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/DetectiveNotepad.tsx
git commit -m "feat: add DetectiveNotepad — auto tasks tab + localStorage notes tab"
```

---

## Task 3: Wire DetectiveNotepad into GameClient

**Files:**
- Modify: `src/components/GameClient.tsx`

Add `DetectiveNotepad` to the sidebar between `StoryPanel` and `BonusClue`.

- [ ] **Step 1: Add import to GameClient.tsx**

In `src/components/GameClient.tsx`, find the import block and add one line after the `StoryPanel` import:

```tsx
import DetectiveNotepad from './DetectiveNotepad'
```

The import block currently looks like:
```tsx
import LevelNav from './LevelNav'
import StoryPanel from './StoryPanel'
import SQLEditor from './SQLEditor'
```

Add after `import StoryPanel`:
```tsx
import DetectiveNotepad from './DetectiveNotepad'
```

- [ ] **Step 2: Add to sidebar JSX**

In the sidebar `<aside>`, after `<StoryPanel level={level} />`, add:

```tsx
<DetectiveNotepad />
```

The sidebar currently reads:
```tsx
<StoryPanel level={level} />
<BonusClue level={level} />
```

Change to:
```tsx
<StoryPanel level={level} />
<DetectiveNotepad />
<BonusClue level={level} />
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/GameClient.tsx
git commit -m "feat: wire DetectiveNotepad into game sidebar"
```

---

## Task 4: ER Diagram Schema Viewer

**Files:**
- Modify: `src/components/SchemaViewer.tsx`

Rewrite the accordion into a button that opens a full-screen modal with an SVG ER diagram. The diagram has:
- `persons` as hub (gold border, left-center)
- 6 FK tables with dashed arrows: `hotel_log`, `phone_rec`, `messages`, `financials`, `bar_tabs`, `alley_log`
- 3 standalone tables: `evidence`, `witnesses`, `staff` (right zone, separated by a dashed vertical rule)
- SVG `<marker>` arrowhead in gold-dim
- Legend row in modal header

Each table box: dark background, gold header, 🔑 for PK (gold), `→ col` for FK (aged), other cols (shadow). Standalone table nodes have a dim italic "no foreign keys" note.

- [ ] **Step 1: Replace SchemaViewer.tsx entirely**

Write `src/components/SchemaViewer.tsx`:

```tsx
'use client'

import { useState, useEffect, useCallback } from 'react'

interface TableNode {
  name: string
  x: number
  y: number
  cols: { name: string; kind: 'pk' | 'fk' | 'col' }[]
  standalone?: boolean
}

const TABLES: TableNode[] = [
  {
    name: 'persons', x: 16, y: 155,
    cols: [
      { name: 'id', kind: 'pk' },
      { name: 'name', kind: 'col' },
      { name: 'role', kind: 'col' },
      { name: 'room_no', kind: 'col' },
      { name: 'alibi', kind: 'col' },
    ],
  },
  {
    name: 'hotel_log', x: 210, y: 16,
    cols: [
      { name: 'id', kind: 'pk' },
      { name: '→ person_id', kind: 'fk' },
      { name: 'event', kind: 'col' },
      { name: 'floor', kind: 'col' },
      { name: 'timestamp', kind: 'col' },
    ],
  },
  {
    name: 'phone_rec', x: 210, y: 148,
    cols: [
      { name: 'id', kind: 'pk' },
      { name: '→ caller_id', kind: 'fk' },
      { name: 'called', kind: 'col' },
      { name: 'duration', kind: 'col' },
      { name: 'timestamp', kind: 'col' },
    ],
  },
  {
    name: 'messages', x: 210, y: 282,
    cols: [
      { name: 'id', kind: 'pk' },
      { name: '→ sender_id', kind: 'fk' },
      { name: 'recipient', kind: 'col' },
      { name: 'body', kind: 'col' },
      { name: 'sent_at', kind: 'col' },
    ],
  },
  {
    name: 'financials', x: 210, y: 416,
    cols: [
      { name: 'id', kind: 'pk' },
      { name: '→ person_id', kind: 'fk' },
      { name: 'memo', kind: 'col' },
      { name: 'amount', kind: 'col' },
      { name: 'date', kind: 'col' },
    ],
  },
  {
    name: 'bar_tabs', x: 210, y: 550,
    cols: [
      { name: 'id', kind: 'pk' },
      { name: '→ person_id', kind: 'fk' },
      { name: 'drink', kind: 'col' },
      { name: 'tab_time', kind: 'col' },
      { name: 'paid', kind: 'col' },
    ],
  },
  {
    name: 'alley_log', x: 210, y: 684,
    cols: [
      { name: 'id', kind: 'pk' },
      { name: '→ person_id', kind: 'fk' },
      { name: 'seen_at', kind: 'col' },
      { name: 'direction', kind: 'col' },
      { name: 'notes', kind: 'col' },
    ],
  },
  {
    name: 'evidence', x: 440, y: 16, standalone: true,
    cols: [
      { name: 'id', kind: 'pk' },
      { name: 'item', kind: 'col' },
      { name: 'location', kind: 'col' },
      { name: 'notes', kind: 'col' },
    ],
  },
  {
    name: 'witnesses', x: 440, y: 150, standalone: true,
    cols: [
      { name: 'id', kind: 'pk' },
      { name: 'name', kind: 'col' },
      { name: 'statement', kind: 'col' },
      { name: 'credibility', kind: 'col' },
    ],
  },
  {
    name: 'staff', x: 440, y: 284, standalone: true,
    cols: [
      { name: 'id', kind: 'pk' },
      { name: 'name', kind: 'col' },
      { name: 'shift', kind: 'col' },
      { name: 'floor_access', kind: 'col' },
      { name: 'notes', kind: 'col' },
    ],
  },
]

const NODE_W = 150
const ROW_H = 14
const HEADER_H = 20

function nodeHeight(t: TableNode) {
  return HEADER_H + t.cols.length * ROW_H + 8
}

function nodeRight(t: TableNode) { return t.x + NODE_W }
function nodeMidY(t: TableNode) { return t.y + nodeHeight(t) / 2 }

const FK_TABLES = ['hotel_log', 'phone_rec', 'messages', 'financials', 'bar_tabs', 'alley_log']
const persons = TABLES.find((t) => t.name === 'persons')!

export default function SchemaViewer() {
  const [open, setOpen] = useState(false)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, close])

  const svgH = Math.max(
    nodeMidY(persons) + nodeHeight(persons) / 2 + 16,
    ...TABLES.map((t) => t.y + nodeHeight(t) + 16)
  )

  return (
    <>
      <div className="border-t border-border">
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center justify-between px-4 py-2 text-xs text-shadow hover:text-aged font-mono uppercase tracking-widest transition-colors"
        >
          <span>Table Schema ▤</span>
          <span className="text-gold-dim">ER →</span>
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
          onClick={close}
        >
          <div
            className="bg-ink border border-border rounded-lg flex flex-col"
            style={{ width: '90vw', maxWidth: 760, maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border flex-shrink-0">
              <span className="text-xs text-gold font-mono uppercase tracking-widest">
                Database Schema — Entity Relationship Diagram
              </span>
              <button onClick={close} className="text-shadow hover:text-aged font-mono text-sm transition-colors">
                ✕
              </button>
            </div>

            {/* Legend */}
            <div className="flex gap-5 px-5 py-2 border-b border-border text-xs font-mono text-shadow flex-shrink-0">
              <span><span className="text-gold">🔑</span> primary key</span>
              <span className="flex items-center gap-1">
                <svg width="24" height="8" style={{ display: 'inline' }}>
                  <line x1="0" y1="4" x2="18" y2="4" stroke="#7a5518" strokeWidth="1.5" strokeDasharray="4,2"/>
                  <polygon points="18,1 18,7 24,4" fill="#7a5518"/>
                </svg>
                <span className="text-aged">foreign key</span>
              </span>
              <span>· plain column</span>
              <span className="ml-auto text-shadow italic">standalone = no FK</span>
            </div>

            {/* SVG diagram */}
            <div className="overflow-auto flex-1 p-4">
              <svg
                width={640}
                height={svgH}
                viewBox={`0 0 640 ${svgH}`}
                xmlns="http://www.w3.org/2000/svg"
                style={{ fontFamily: "'Courier New', monospace", display: 'block', minWidth: 600 }}
              >
                <defs>
                  <marker id="arr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                    <polygon points="0,0 0,7 7,3.5" fill="#7a5518"/>
                  </marker>
                </defs>

                {/* Dashed vertical divider before standalone zone */}
                <line x1="425" y1="0" x2="425" y2={svgH} stroke="#2a2010" strokeWidth="1" strokeDasharray="5,4"/>
                <text x="430" y="10" fill="#3a3020" fontSize="8">standalone →</text>

                {/* FK arrows: persons right-edge → fk table left-edge */}
                {FK_TABLES.map((name) => {
                  const target = TABLES.find((t) => t.name === name)!
                  const x1 = nodeRight(persons)
                  const y1 = nodeMidY(persons)
                  const x2 = target.x
                  const y2 = nodeMidY(target)
                  const mx = (x1 + x2) / 2
                  return (
                    <path
                      key={name}
                      d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
                      fill="none"
                      stroke="#7a5518"
                      strokeWidth="1.2"
                      strokeDasharray="5,3"
                      markerEnd="url(#arr)"
                    />
                  )
                })}

                {/* Table nodes */}
                {TABLES.map((t) => {
                  const h = nodeHeight(t)
                  const isHub = t.name === 'persons'
                  return (
                    <g key={t.name}>
                      <rect
                        x={t.x} y={t.y} width={NODE_W} height={h} rx="4"
                        fill="#0f0c06"
                        stroke={isHub ? '#c8922a' : '#2a2010'}
                        strokeWidth={isHub ? 1.5 : 1}
                      />
                      {/* Header */}
                      <rect x={t.x} y={t.y} width={NODE_W} height={HEADER_H} rx="4" fill="#2a1e0e"/>
                      <rect x={t.x} y={t.y + HEADER_H - 4} width={NODE_W} height={4} fill="#2a1e0e"/>
                      <text
                        x={t.x + NODE_W / 2} y={t.y + 13}
                        fill="#c8922a" fontSize="9" textAnchor="middle"
                        fontWeight="bold" letterSpacing="0.5"
                      >
                        {t.name}
                      </text>
                      {/* Columns */}
                      {t.cols.map((col, i) => (
                        <text
                          key={col.name}
                          x={t.x + 8}
                          y={t.y + HEADER_H + 4 + (i + 1) * ROW_H}
                          fontSize="8"
                          fill={col.kind === 'pk' ? '#c8922a' : col.kind === 'fk' ? '#d4c49a' : '#6a5030'}
                        >
                          {col.kind === 'pk' ? '🔑 ' : ''}{col.name}
                        </text>
                      ))}
                      {/* Standalone note */}
                      {t.standalone && (
                        <text
                          x={t.x + 8} y={t.y + h - 4}
                          fontSize="7" fill="#3a3020" fontStyle="italic"
                        >
                          no foreign keys
                        </text>
                      )}
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/SchemaViewer.tsx
git commit -m "feat: replace schema accordion with ER diagram modal (SVG, FK arrows)"
```

---

## Task 5: End-to-End Verification

- [ ] **Step 1: Confirm dev server is running**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/
```
Expected: `200`. If not running: `npm run dev -- --port 3000 &`

- [ ] **Step 2: Verify Story Panel**

Open `http://localhost:3000/game`.

Check:
- Act chip renders as a small pill above the title
- Level title uses Special Elite serif font and is larger than before
- 📍 and 🕐 appear in the meta row
- NPC dialogue lines have a gold left border AND a dark background card
- "Objective" box is visible at the bottom of the story section with a gold-dim label

- [ ] **Step 3: Verify Detective Notepad**

Check:
- "📋 Tasks" and "🗒 Notes" tabs appear below the story panel
- Tasks tab shows current level objective (unchecked) + bonus task (unchecked) + next level (locked/dimmed)
- Switching levels (via pip nav) updates the task list
- Solving a level (run the correct query) marks main task as checked + strikethrough
- Claiming a bonus marks the bonus task as checked
- Notes tab has a textarea; typing into it and refreshing the page preserves the text

- [ ] **Step 4: Verify ER Diagram**

Check:
- "Table Schema ▤" button visible in sidebar with "ER →" hint
- Clicking it opens the full modal overlay
- `persons` table has a gold border; all others have dim border
- Dashed curved arrows connect `persons` to each of the 6 FK tables
- `evidence`, `witnesses`, `staff` sit to the right of the dashed vertical divider
- Legend row shows 🔑, arrow SVG, and "standalone = no FK"
- Clicking outside the modal closes it
- Pressing Escape closes it

- [ ] **Step 5: Regression check**

Verify nothing else broke:
- LevelNav pips still work
- BonusClue still shows below DetectiveNotepad
- SuspectList and Accuse button still at bottom of sidebar
- Running queries, hints, next level, accusation flow all work

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: complete UX update — ER diagram, story redesign, detective notepad"
```

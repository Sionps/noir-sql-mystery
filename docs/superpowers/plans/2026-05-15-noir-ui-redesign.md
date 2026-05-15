# Noir UI Redesign — Dossier Files Style Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin the game UI with a detective dossier aesthetic — folder-tab panels, portrait suspect cards, stamp-style buttons, and a main panel tab bar — without touching game logic or the SQL editor internals.

**Architecture:** Pure CSS/JSX restyle of existing components. `GameClient` gains a local `activeTab` state to switch between the SQL editor and the `DetectiveNotepad` (moved from sidebar to main). `SchemaViewer` stays a modal triggered by the Schema Map tab button. All other components are restyled in-place.

**Tech Stack:** Next.js, Tailwind CSS v4, Zustand, TypeScript

---

## File Map

| File | What changes |
|------|-------------|
| `src/app/globals.css` | Add `'Georgia'` to display font fallback |
| `src/components/GameClient.tsx` | Header subtitle, border, tab bar state + JSX, button stamp styles, move Notepad to tab, remove SchemaViewer from nav |
| `src/components/LevelNav.tsx` | Circular buttons → folder-tab style with "Case I/II/…" labels |
| `src/components/StoryPanel.tsx` | Folder-tab wrapper, stamps row, dashed objective box |
| `src/components/CaseBriefing.tsx` | CONFIDENTIAL + OPEN/CLOSED stamps + case number inside the modal |
| `src/components/SuspectList.tsx` | 2-col portrait card grid with accused/guilty states |
| `src/components/FeedbackBar.tsx` | "Next Level" button → stamp style, add `tracking-wider` to message |

---

## Task 1: globals.css — display font fallback

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update `--font-family-display` to include Georgia**

In `globals.css`, change the `--font-family-display` line from:
```css
--font-family-display: var(--font-special-elite), serif;
```
to:
```css
--font-family-display: var(--font-special-elite), 'Georgia', serif;
```

- [ ] **Step 2: Type-check**

```bash
cd /home/sion/noir-sql-mystery && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "style: add Georgia to display font fallback stack"
```

---

## Task 2: Header — subtitle and border

**Files:**
- Modify: `src/components/GameClient.tsx` (header section only)

The header currently:
```tsx
<header className="flex items-center justify-between px-4 py-2 border-b border-border bg-ink">
  <div className="font-display text-xl text-gold">{t('ui.game_title')}</div>
  ...
```

- [ ] **Step 1: Add subtitle and thicken the bottom border**

Replace the header opening tag and title div:
```tsx
<header className="flex items-center justify-between px-4 py-2 border-b-2 border-gold bg-ink">
  <div>
    <div className="font-display text-xl text-gold">{t('ui.game_title')}</div>
    <div className="font-mono text-[10px] text-shadow tracking-widest uppercase">A Detective&rsquo;s Case Files</div>
  </div>
```

- [ ] **Step 2: Type-check**

```bash
cd /home/sion/noir-sql-mystery && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Start dev server and visually verify**

```bash
npm run dev
```
Open http://localhost:3000 — confirm header shows subtitle line and gold double-border at bottom.

- [ ] **Step 4: Commit**

```bash
git add src/components/GameClient.tsx
git commit -m "style: add header subtitle and thicken gold border"
```

---

## Task 3: LevelNav — folder-tab style

**Files:**
- Modify: `src/components/LevelNav.tsx`

Current buttons are `w-7 h-7 rounded-full` circles showing level numbers. Replace with folder tabs labeled "Case I", "Case II", etc.

- [ ] **Step 1: Replace the button JSX in LevelNav**

Replace the full return of `LevelNav` with:

```tsx
export default function LevelNav() {
  const currentLevel = useGameStore((s) => s.currentLevel)
  const setBriefingLevel = useGameStore((s) => s.setBriefingLevel)
  const solved = useGameStore((s) => s.solved)
  const { t } = useTranslation()
  const localizedLevels = useLocalizedLevels()

  const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X']

  return (
    <div className="flex items-end gap-0.5">
      {localizedLevels.map((level) => {
        const isSolved = solved.includes(level.num)
        const isActive = currentLevel === level.num
        return (
          <button
            key={level.num}
            title={`${t('ui.level_label')} ${level.num}: ${level.title}`}
            onClick={() => setBriefingLevel(level.num)}
            className={[
              'px-3 py-1 text-[10px] font-mono uppercase tracking-wider border transition-colors',
              isActive
                ? 'bg-ink border-gold border-b-0 text-gold'
                : isSolved
                ? 'bg-surface border-border text-shadow opacity-50 hover:opacity-75'
                : 'bg-surface border-border text-shadow hover:text-aged hover:border-shadow',
            ].join(' ')}
          >
            {isSolved ? '✓' : `Case ${ROMAN[level.num - 1]}`}
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
cd /home/sion/noir-sql-mystery && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Visually verify**

Check http://localhost:3000 — nav should show "Case I", "Case II" etc. as folder tabs. Active tab has gold border and no bottom border, flush into the content below.

- [ ] **Step 4: Commit**

```bash
git add src/components/LevelNav.tsx
git commit -m "style: level nav — folder-tab design with Case I/II labels"
```

---

## Task 4: StoryPanel — dossier treatment

**Files:**
- Modify: `src/components/StoryPanel.tsx`

Currently renders: act label, title, location/time, story blocks, objective box — all wrapped in `<div className="p-4 space-y-3 border-b border-border">`.

StoryPanel needs to read `solved` state to know if the case is open or closed. It doesn't currently import `useGameStore`.

- [ ] **Step 1: Rewrite StoryPanel**

Replace the entire file content:

```tsx
'use client'

import type { Level, StoryBlock } from '@/data/levels'
import { useGameStore } from '@/store/gameStore'
import { useTranslation } from '@/hooks/useTranslation'

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
  const { t } = useTranslation()
  const solved = useGameStore((s) => s.solved)
  const isSolved = solved.includes(level.num)
  const caseNumber = `#${String(level.num).padStart(3, '0')}-A`

  return (
    <div className="border-b border-border">
      {/* Folder tab */}
      <div className="inline-block bg-ink border border-border border-b-0 px-3 py-1 ml-3 mt-2">
        <span className="text-[9px] font-mono text-gold uppercase tracking-widest">{t('ui.case_file')}</span>
      </div>
      {/* Panel body */}
      <div className="border border-border mx-0 p-4 space-y-3">
        {/* Stamps row */}
        <div className="flex items-center gap-2">
          <span className="border border-gold text-gold font-mono text-[7px] uppercase tracking-wider px-1.5 py-0.5">
            Confidential
          </span>
          <span className={[
            'border font-mono text-[7px] uppercase tracking-wider px-1.5 py-0.5',
            isSolved ? 'border-red text-red' : 'border-gold text-gold',
          ].join(' ')}>
            {isSolved ? 'Closed' : 'Open'}
          </span>
          <span className="ml-auto font-mono text-[8px] text-shadow">{caseNumber}</span>
        </div>

        <div className="inline-block bg-dim text-shadow text-xs font-mono uppercase tracking-widest px-2 py-0.5 rounded-full">
          {level.act}
        </div>
        <h2 className="font-display text-xl text-paper leading-tight">{level.title}</h2>
        <div className="flex gap-3 text-xs text-shadow font-mono">
          <span>&#x1F4CD; {level.location}</span>
          <span>&#x1F550; {level.time}</span>
        </div>
        <div className="space-y-2">
          {level.story.map((block, i) => <Block key={i} block={block} />)}
        </div>
        <div className="border border-dashed border-border p-2 mt-1">
          <div className="text-xs text-gold-dim uppercase tracking-widest font-mono mb-1">{t('ui.objective')}</div>
          <p className="text-xs text-aged font-mono leading-relaxed">{level.objective}</p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
cd /home/sion/noir-sql-mystery && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Visually verify**

Check http://localhost:3000 sidebar — case briefing panel shows a folder tab on top, CONFIDENTIAL + OPEN stamps, dashed objective box. After solving a level, OPEN stamp turns to CLOSED in red.

- [ ] **Step 4: Commit**

```bash
git add src/components/StoryPanel.tsx
git commit -m "style: StoryPanel — folder-tab, dossier stamps, dashed objective box"
```

---

## Task 5: CaseBriefing modal — stamps

**Files:**
- Modify: `src/components/CaseBriefing.tsx`

The modal is styled as a yellow sticky note. Add CONFIDENTIAL stamp and case file number inside the paper, above the title.

- [ ] **Step 1: Add stamps row inside the paper div**

In `CaseBriefing.tsx`, locate this block (inside the paper `<div>`):
```tsx
<div className="space-y-8">
  <div className="space-y-2">
    <span className="text-[10px] uppercase tracking-widest opacity-60 font-mono">{t('ui.case_briefing')}</span>
    <h2 id="briefing-title" className="text-2xl font-bold italic leading-tight">
```

Replace it with:
```tsx
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
```

- [ ] **Step 2: Type-check**

```bash
cd /home/sion/noir-sql-mystery && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Visually verify**

Click any level in the nav — the yellow paper modal should show CONFIDENTIAL + OPEN stamps and a case number at the top.

- [ ] **Step 4: Commit**

```bash
git add src/components/CaseBriefing.tsx
git commit -m "style: CaseBriefing modal — add CONFIDENTIAL stamp and case number"
```

---

## Task 6: SuspectList — portrait card grid

**Files:**
- Modify: `src/components/SuspectList.tsx`

Replace the vertical list with a 2-column portrait card grid. `KILLER_ID = 3` (Diane Harlow) is the correct accusation, matching `VerdictModal.tsx`.

- [ ] **Step 1: Rewrite SuspectList**

Replace the entire file content:

```tsx
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
```

- [ ] **Step 2: Type-check**

```bash
cd /home/sion/noir-sql-mystery && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Visually verify**

Check http://localhost:3000 sidebar — suspects show as portrait cards in a 2-column grid. Make an accusation to verify the accused state (red border, ✕ badge, ACCUSED stamp) and correct-killer state (gold border, ✓ badge, GUILTY stamp).

- [ ] **Step 4: Commit**

```bash
git add src/components/SuspectList.tsx
git commit -m "style: SuspectList — 2-col portrait card grid with accused/guilty states"
```

---

## Task 7: Main panel tab bar + move DetectiveNotepad

**Files:**
- Modify: `src/components/GameClient.tsx`

Add `activeTab` state. Add a tab bar above the SQL editor. Move `DetectiveNotepad` out of the sidebar into the Detective Notes tab. Move `SchemaViewer` trigger from the nav bar into the Schema Map tab button. Remove both from their current locations.

- [ ] **Step 1: Add `activeTab` state and update imports**

Near the top of `GameClient`, after the existing `useState` declarations, add:
```tsx
const [activeTab, setActiveTab] = useState<'query' | 'notes'>('query')
```

- [ ] **Step 2: Remove SchemaViewer from the nav bar**

Find this block in `GameClient`:
```tsx
<div className="flex items-center px-4 py-2 border-b border-border bg-ink">
  <LevelNav />
  <div className="ml-auto">
    <SchemaViewer />
  </div>
</div>
```
Replace with:
```tsx
<div className="flex items-center px-4 py-1.5 border-b border-border bg-ink">
  <LevelNav />
</div>
```

- [ ] **Step 3: Remove DetectiveNotepad from the sidebar**

In the `<aside>` block, delete the line:
```tsx
<DetectiveNotepad />
```

- [ ] **Step 4: Replace the `<main>` content with the tabbed layout**

Find the existing `<main>` block (starts with `<main className="flex-1 flex flex-col overflow-hidden p-4 gap-3">`). Replace the entire `<main>` element with:

```tsx
<main className="flex-1 flex flex-col overflow-hidden">
  {/* Tab bar — SchemaViewer renders its own button inline in the row */}
  <div className="flex items-end gap-0.5 px-4 pt-3 border-b border-border bg-ink flex-shrink-0">
    <button
      onClick={() => setActiveTab('query')}
      className={[
        'px-4 py-1.5 text-[10px] font-mono uppercase tracking-wider border transition-colors',
        activeTab === 'query'
          ? 'bg-surface border-gold border-b-0 text-gold'
          : 'bg-ink border-border text-shadow hover:text-aged',
      ].join(' ')}
    >
      {t('ui.evidence_query')}
    </button>
    {/* SchemaViewer owns its open/close state internally; its button sits in the tab row */}
    <div className="ml-1">
      <SchemaViewer />
    </div>
    <button
      onClick={() => setActiveTab('notes')}
      className={[
        'ml-1 px-4 py-1.5 text-[10px] font-mono uppercase tracking-wider border transition-colors',
        activeTab === 'notes'
          ? 'bg-surface border-gold border-b-0 text-gold'
          : 'bg-ink border-border text-shadow hover:text-aged',
      ].join(' ')}
    >
      {t('ui.detective_notes')}
    </button>
  </div>

  {/* Tab content */}
  {activeTab === 'query' && (
    <div className="flex-1 flex flex-col overflow-hidden p-4 gap-3">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xs text-gold-dim font-mono uppercase tracking-widest">{t('ui.level_label')} {level.num}</span>
          <span className="text-xs bg-dim text-shadow px-2 py-0.5 rounded font-mono">{level.badge}</span>
        </div>
        <h1 className="font-display text-xl text-paper">{level.title}</h1>
        <p className="text-sm text-shadow font-mono mt-1">{level.objective}</p>
      </div>

      <SQLEditor ref={editorRef} onRun={handleRun} />

      <div className="flex gap-2">
        <button onClick={handleRunButton}
          className="px-4 py-2 border-2 border-gold text-gold text-[10px] font-mono uppercase tracking-wider bg-ink hover:border-aged transition-colors">
          {t('ui.run_query')}
        </button>
        <button onClick={handleHint} disabled={hintsLeft(level.num) === 0}
          className="px-4 py-2 border-2 border-border text-shadow text-[10px] font-mono uppercase tracking-wider hover:border-shadow transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          {t('ui.hint_with_count', { n: hintsLeft(level.num) })}
        </button>
        <button
          onClick={() => { setQueryResult({ columns: [], rows: [] }); setFeedback({ type: 'idle' }) }}
          className="px-4 py-2 border-2 border-border text-shadow text-[10px] font-mono uppercase tracking-wider hover:border-shadow transition-colors">
          {t('ui.clear')}
        </button>
      </div>

      <ResultsTable columns={queryResult.columns} rows={queryResult.rows} />

      <div className="mt-auto">
        <FeedbackBar
          state={feedback}
          onNext={isSolved && currentLevel < 10 ? handleNext : undefined}
        />
      </div>
    </div>
  )}

  {activeTab === 'notes' && (
    <div className="flex-1 overflow-hidden">
      <DetectiveNotepad />
    </div>
  )}
</main>
```

- [ ] **Step 6: Add translation keys**

Open `src/data/translations/en.ts` and add to the `ui` object:
```ts
evidence_query: 'Evidence Query',
detective_notes: 'Detective Notes',
```

Open `src/data/translations/th.ts` and add the same keys with Thai translations:
```ts
evidence_query: 'สืบค้นหลักฐาน',
detective_notes: 'บันทึกนักสืบ',
```

- [ ] **Step 7: Type-check**


```bash
cd /home/sion/noir-sql-mystery && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 8: Visually verify**

Check http://localhost:3000:
- Main area shows "Evidence Query" and "Detective Notes" folder tabs
- SchemaViewer button sits in the tab row
- Clicking "Detective Notes" shows the notepad (tasks + notes)
- Sidebar no longer has the DetectiveNotepad
- SchemaViewer no longer appears in the level nav bar

- [ ] **Step 9: Commit**

```bash
git add src/components/GameClient.tsx src/data/translations/en.ts src/data/translations/th.ts
git commit -m "feat: main panel tab bar — Evidence Query / Schema Map / Detective Notes"
```

---

## Task 8: Accuse button — stamp style

**Files:**
- Modify: `src/components/GameClient.tsx` (sidebar footer button only)

The current accuse button in the sidebar footer:
```tsx
className={[
  'w-full py-2 rounded font-display text-sm transition-all',
  canAccuse()
    ? 'bg-red text-paper hover:opacity-80 cursor-pointer'
    : 'bg-surface text-shadow border border-border cursor-not-allowed',
].join(' ')}
```

- [ ] **Step 1: Change to stamp style**

Replace the className expression:
```tsx
className={[
  'w-full py-2 font-mono text-[10px] uppercase tracking-wider border-2 transition-colors',
  canAccuse()
    ? 'border-red text-red bg-[#0a0300] hover:border-[#c02020] cursor-pointer'
    : 'border-border text-shadow bg-surface cursor-not-allowed opacity-50',
].join(' ')}
```

- [ ] **Step 2: Type-check**

```bash
cd /home/sion/noir-sql-mystery && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Visually verify**

Sidebar accuse button shows red stamp style when `canAccuse()` is true, dim disabled style otherwise.

- [ ] **Step 4: Commit**

```bash
git add src/components/GameClient.tsx
git commit -m "style: accuse button — stamp style with red border"
```

---

## Task 9: FeedbackBar — stamp-style Next Level button

**Files:**
- Modify: `src/components/FeedbackBar.tsx`

The "Next Level" button currently uses `bg-gold text-ink rounded hover:bg-amber-400`.

- [ ] **Step 1: Update the Next Level button**

In `FeedbackBar.tsx`, find:
```tsx
<button onClick={onNext}
  className="ml-auto px-4 py-1 bg-gold text-ink text-sm font-display rounded hover:bg-amber-400 transition-colors">
  {t('ui.next_level')}
</button>
```

Replace with:
```tsx
<button onClick={onNext}
  className="ml-auto px-4 py-1.5 border-2 border-gold text-gold text-[10px] font-mono uppercase tracking-wider bg-ink hover:border-aged transition-colors">
  {t('ui.next_level')}
</button>
```

- [ ] **Step 2: Add `tracking-wide` to the feedback message span**

Find:
```tsx
<span className={`flex-1 text-sm font-mono ${cfg.text}`}>{message}</span>
```
Replace with:
```tsx
<span className={`flex-1 text-sm font-mono tracking-wide ${cfg.text}`}>{message}</span>
```

- [ ] **Step 3: Type-check**

```bash
cd /home/sion/noir-sql-mystery && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Visually verify**

After solving a level, the "Next Level" button shows as a gold stamp-style button.

- [ ] **Step 5: Commit**

```bash
git add src/components/FeedbackBar.tsx
git commit -m "style: FeedbackBar — stamp-style Next Level button"
```

---

## Task 10: Final build verification

- [ ] **Step 1: Run the full build**

```bash
cd /home/sion/noir-sql-mystery && npm run build
```
Expected: no TypeScript errors, no Next.js build errors. Build succeeds.

- [ ] **Step 2: Run dev server and do a full walkthrough**

```bash
npm run dev
```

Check:
1. Header shows subtitle, gold bottom border
2. Level nav shows folder tabs "Case I" etc.
3. Sidebar story panel has folder tab, stamps, dashed objective
4. Suspects show as portrait cards in 2-col grid
5. Main area has Evidence Query / Schema Map / Detective Notes tabs
6. SQL editor, hints, clear button all show stamp style
7. Accuse button shows stamp style
8. After accusation: correct suspect shows GUILTY (gold), others show normal
9. FeedbackBar Next Level button is stamp style
10. Click a level in nav → CaseBriefing modal shows CONFIDENTIAL stamp

- [ ] **Step 3: Commit any final tweaks, then done**

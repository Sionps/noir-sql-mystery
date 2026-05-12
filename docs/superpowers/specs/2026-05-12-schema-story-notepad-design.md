# Schema ER Diagram, Story Redesign & Detective Notepad

**Date:** 2026-05-12
**Scope:** Three UX/UI improvements to the Dead on Arrival game sidebar and schema viewer.

---

## 1. ER Diagram Schema Viewer (modal)

### What changes
Replace the current `SchemaViewer` accordion (collapsible list of table names with column sub-lists) with a button that opens a full-screen modal containing an SVG entity-relationship diagram.

### Modal behaviour
- Triggered by a "Table Schema ▤" button in the sidebar (same position as current SchemaViewer button).
- Opens as a fixed overlay (`z-50`, dark backdrop `bg-black/85`).
- Closes on ✕ button click or `Escape` key.
- Scrollable if viewport is too small (unlikely on desktop).

### Diagram layout
- Rendered as a single inline `<svg>` inside the modal.
- **`persons`** is the hub node — gold border (`#c8922a`), positioned left-center.
- Six FK tables fan out to the right with dashed arrows (`stroke-dasharray`) from the `persons` box to each dependent table:
  - `hotel_log` (person_id)
  - `phone_rec` (caller_id)
  - `messages` (sender_id)
  - `financials` (person_id)
  - `bar_tabs` (person_id)
  - `alley_log` (person_id)
- Three standalone tables (no FK) sit in a separate zone on the far right, separated by a subtle dashed vertical rule:
  - `evidence`, `witnesses`, `staff`
- Arrows use SVG `<marker>` arrowheads, gold-dim color (`#7a5518`).

### Table node anatomy
Each node box has:
- Header row: table name in gold uppercase, dark amber background.
- Column rows:
  - 🔑 primary key — gold text
  - `→ col_name` foreign key — `aged` text (`#d4c49a`)
  - other columns — `shadow` text (`#6a5030`)

### Legend
A one-line legend in the modal header area: `🔑 primary key · → foreign key relationship · plain column`

### Implementation files
- Modify `src/components/SchemaViewer.tsx` — replace accordion with button + modal + SVG.
- No new dependencies (pure SVG, no diagram library).

---

## 2. Story Panel — Better Inline Typography (Option B)

### What changes
`src/components/StoryPanel.tsx` gets richer visual structure without changing layout position (stays in sidebar).

### New structure per level
```
[act chip — pill badge, amber bg]
[level title — serif font, large, light color]
[📍 location  🕐 time — small meta row]
[story paragraphs — body text]
[NPC quote — gold left border + dark bg card]
[objective box — pinned at bottom of story section, subtle border]
```

### Specifics
- **Act chip:** small pill `bg-dim text-shadow` with act string, rounded-full.
- **Title:** `font-display text-xl text-paper` (Special Elite font, already loaded).
- **Meta row:** 📍 and 🕐 prefix, `text-xs text-shadow`.
- **Paragraphs:** `text-sm text-aged` — no change from current.
- **NPC quote:** `border-l-2 border-gold bg-surface rounded-r px-3 py-2 italic text-paper text-sm` — adds background card vs current bare border.
- **Objective box:** new element below story blocks — `bg-surface border border-border rounded p-2`, label `text-xs text-gold-dim uppercase`, content `text-xs text-aged`. Shows `level.objective`.

### Implementation files
- Modify `src/components/StoryPanel.tsx` only.

---

## 3. Detective Notepad — Tabs: Tasks + Notes

### What changes
Add a new `DetectiveNotepad` component below `StoryPanel` in the sidebar. Replaces the gap between `StoryPanel` and `BonusClue`.

### Tab 1: Tasks (auto-generated, read-only)
- Tasks are derived from `LEVELS` data and game state — the user cannot add or remove them.
- Each level contributes two tasks: main objective and bonus query.
- **Task states:**
  - **Completed** (level in `solved[]`): checkbox checked (gold ✓), text strikethrough, dimmed.
  - **Current** (level === `currentLevel`): checkbox unchecked, text `text-aged`, XP badge visible.
  - **Locked** (future levels not yet reached): dimmed, text reads "Complete level N to unlock…"
- Tasks shown: all completed levels + current level (both tasks) + next one level (locked preview).
- XP badges: `+100 XP` for main, `+50 XP bonus` for bonus query.
- Bonus task for current level shows as checked if `bonusClaimed` includes current level.

### Tab 2: Notes (free text)
- `<textarea>` — full width, `~8 rows`, `bg-surface border border-border` styled.
- Persisted to `localStorage` under key `noir-notes-v1` (separate from Zustand store).
- Auto-saves on every `onChange` (no save button needed).
- Placeholder: `"Jot down clues, suspects, timestamps…"`

### Tab switching
- Two tabs: `📋 Tasks` | `🗒 Notes`
- Active tab: `text-gold border-b border-gold bg-surface`.
- Inactive tab: `text-shadow hover:text-aged`.

### Implementation files
- Create `src/components/DetectiveNotepad.tsx`.
- Modify `src/components/GameClient.tsx` — insert `<DetectiveNotepad />` after `<StoryPanel />`.

---

## Summary of file changes

| File | Action |
|------|--------|
| `src/components/SchemaViewer.tsx` | Replace accordion with ER modal |
| `src/components/StoryPanel.tsx` | Better inline typography + objective box |
| `src/components/DetectiveNotepad.tsx` | New component — tabbed tasks + notes |
| `src/components/GameClient.tsx` | Insert `<DetectiveNotepad />` after `<StoryPanel />` |

No new npm packages required. No changes to data, store, or pages.

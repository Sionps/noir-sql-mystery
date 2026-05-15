# Thai Translation Full Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all game content (level story, title, objective, hints, feedback messages) display in Thai when Thai language is selected, using the existing translation system.

**Architecture:** Create a `useLocalizedLevel` hook that overlays Thai translations (already in `th.ts`) on top of the English `LEVELS` base object. Update components that currently read directly from the English `LEVELS` array to use the localized version instead. Add missing Thai translations (hints + error messages) to `th.ts`.

**Tech Stack:** Next.js, React hooks, Zustand, TypeScript

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/data/translations/th.ts` | Modify | Add `hints` arrays for all 10 levels + two UI error keys |
| `src/hooks/useLocalizedLevel.ts` | Create | Merge Thai translations over English Level objects |
| `src/components/GameClient.tsx` | Modify | Use `useLocalizedLevel`; fix two hardcoded English error messages |
| `src/components/CaseBriefing.tsx` | Modify | Use `useLocalizedLevel` instead of raw LEVELS lookup |
| `src/components/DetectiveNotepad.tsx` | Modify | Use `useLocalizedLevels` instead of raw LEVELS import |

> `StoryPanel.tsx` and `BonusClue.tsx` receive `level` as a prop from `GameClient` — they need no changes once GameClient passes the localized level.

---

### Task 1: Add Thai hints and error messages to th.ts

**Files:**
- Modify: `src/data/translations/th.ts`

- [ ] **Step 1: Add `hints` arrays inside each level block in `th.ts`**

In `src/data/translations/th.ts`, inside the `levels` object, add a `hints` triple to each level. Open the file and add the following `hints` entries (insert after the `bonus_clue` line of each level):

Level 1 (after `bonus_clue: '...'` in level `1:`):
```typescript
hints: [
  'ใช้ SELECT เพื่อดึงข้อมูลจากตาราง',
  'รูปแบบคำสั่ง: SELECT * FROM ชื่อตาราง — เครื่องหมาย * หมายถึงทุกคอลัมน์',
  'SELECT * FROM persons',
] as [string, string, string],
```

Level 2:
```typescript
hints: [
  'ใช้ WHERE เพื่อกรองข้อมูล คุณต้องใช้เงื่อนไขสองอย่างเชื่อมด้วย AND',
  "เชื่อมเงื่อนไข: WHERE floor=4 AND timestamp>'23:00'",
  "SELECT * FROM hotel_log WHERE floor=4 AND timestamp>'23:00'",
] as [string, string, string],
```

Level 3:
```typescript
hints: [
  "ใช้ LIKE พร้อม % สำหรับการค้นหา: notes LIKE '%คำ%'",
  'ใช้ OR เพื่อให้ตรงกับเงื่อนไขใดเงื่อนไขหนึ่ง: WHERE เงื่อนไข1 OR เงื่อนไข2',
  "SELECT * FROM evidence WHERE notes LIKE '%lipstick%' OR notes LIKE '%perfume%'",
] as [string, string, string],
```

Level 4:
```typescript
hints: [
  'JOIN รวมสองตารางโดยใช้คอลัมน์ที่ตรงกัน phone_rec.caller_id ตรงกับ persons.id',
  'รูปแบบ: FROM phone_rec pr JOIN persons p ON pr.caller_id=p.id',
  "SELECT p.name, pr.duration, pr.timestamp FROM phone_rec pr JOIN persons p ON pr.caller_id=p.id WHERE pr.called='Victor Malone'",
] as [string, string, string],
```

Level 5:
```typescript
hints: [
  'กรองหาบุคคลเฉพาะโดยใช้ WHERE person_id=3',
  'เรียงลำดับผลลัพธ์ตามเวลาโดยใช้ ORDER BY tab_time',
  'SELECT * FROM bar_tabs WHERE person_id=3 ORDER BY tab_time',
] as [string, string, string],
```

Level 6:
```typescript
hints: [
  'ใช้ >= ใน WHERE สำหรับการเปรียบเทียบมากกว่าหรือเท่ากับ',
  'credibility คือคอลัมน์จำนวนเต็ม ให้คะแนน 1-10',
  'SELECT * FROM witnesses WHERE credibility>=8',
] as [string, string, string],
```

Level 7:
```typescript
hints: [
  'JOIN messages m กับ persons p โดยที่ m.sender_id=p.id เพื่อดึงชื่อ',
  "กรอง: WHERE m.recipient='Victor Malone'",
  "SELECT p.name, m.body, m.sent_at FROM messages m JOIN persons p ON m.sender_id=p.id WHERE m.recipient='Victor Malone' ORDER BY m.sent_at",
] as [string, string, string],
```

Level 8:
```typescript
hints: [
  'JOIN alley_log a กับ persons p โดยที่ a.person_id=p.id',
  'ใช้ ORDER BY a.seen_at เพื่อสร้างไทม์ไลน์ตามลำดับเวลา',
  'SELECT p.name, a.seen_at, a.direction, a.notes FROM alley_log a JOIN persons p ON a.person_id=p.id ORDER BY a.seen_at',
] as [string, string, string],
```

Level 9:
```typescript
hints: [
  'รวมเงื่อนไข WHERE สองอย่างด้วย AND',
  "ใช้ LIKE '%key%' เพื่อหาแถวที่ notes กล่าวถึงกุญแจ",
  "SELECT * FROM staff WHERE floor_access>=4 AND notes LIKE '%key%'",
] as [string, string, string],
```

Level 10:
```typescript
hints: [
  'ใช้ WHERE amount<0 เพื่อกรองค่าติดลบ จากนั้น GROUP BY person_id',
  'ใช้ SUM(amount) as total และ ORDER BY total ASC เพื่อเรียงจากค่าติดลบมากที่สุดก่อน',
  'SELECT person_id, SUM(amount) as total FROM financials WHERE amount<0 GROUP BY person_id ORDER BY total ASC',
] as [string, string, string],
```

- [ ] **Step 2: Add two error message keys to the `ui` block in `th.ts`**

Inside the `ui: { ... }` object in `th.ts`, add after the last entry (before the closing `}`):

```typescript
query_error: 'คำสั่งนี้ไม่ได้ข้อมูลที่เราต้องการ ลองวิธีอื่น',
sql_error: 'ข้อผิดพลาด SQL',
```

Also add the same keys to `en.ts` `ui` block:

```typescript
query_error: 'That query did not reveal what we need. Try a different approach.',
sql_error: 'SQL error',
```

- [ ] **Step 3: Type-check**

```bash
cd /home/sion/noir-sql-mystery && npx tsc --noEmit
```

Expected: no errors (or same errors as before — do not introduce new ones).

- [ ] **Step 4: Commit**

```bash
git add src/data/translations/th.ts src/data/translations/en.ts
git commit -m "feat: add Thai hints and error messages to translations"
```

---

### Task 2: Create useLocalizedLevel hook

**Files:**
- Create: `src/hooks/useLocalizedLevel.ts`

- [ ] **Step 1: Create the hook file**

Create `src/hooks/useLocalizedLevel.ts` with this content:

```typescript
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
```

- [ ] **Step 2: Type-check**

```bash
cd /home/sion/noir-sql-mystery && npx tsc --noEmit
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useLocalizedLevel.ts
git commit -m "feat: add useLocalizedLevel hook for Thai content overlay"
```

---

### Task 3: Update GameClient.tsx

**Files:**
- Modify: `src/components/GameClient.tsx`

- [ ] **Step 1: Import useLocalizedLevel and update level variable**

In `src/components/GameClient.tsx`, add the import:

```typescript
import { useLocalizedLevel } from '@/hooks/useLocalizedLevel'
```

Then change line 47 (the `const level = LEVELS[currentLevel - 1]` line) to:

```typescript
const rawLevel = LEVELS[currentLevel - 1]
const level    = useLocalizedLevel(rawLevel)
```

- [ ] **Step 2: Fix the two hardcoded English error messages**

Replace line 109:
```typescript
      setFeedback({ type: 'error', message: "That query did not reveal what we need. Try a different approach." })
```
with:
```typescript
      setFeedback({ type: 'error', message: t('ui.query_error') })
```

Replace line 112:
```typescript
      setFeedback({ type: 'error', message: `SQL error: ${e.message}` })
```
with:
```typescript
      setFeedback({ type: 'error', message: `${t('ui.sql_error')}: ${e.message}` })
```

- [ ] **Step 3: Type-check**

```bash
cd /home/sion/noir-sql-mystery && npx tsc --noEmit
```

Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/GameClient.tsx
git commit -m "feat: use localized level in GameClient, fix hardcoded error messages"
```

---

### Task 4: Update CaseBriefing.tsx

**Files:**
- Modify: `src/components/CaseBriefing.tsx`

- [ ] **Step 1: Use useLocalizedLevel instead of raw LEVELS lookup**

In `src/components/CaseBriefing.tsx`, add the import:

```typescript
import { useLocalizedLevel } from '@/hooks/useLocalizedLevel'
```

Then change:
```typescript
  const level = LEVELS.find((l) => l.num === levelNum)
```
to:
```typescript
  const rawLevel = LEVELS.find((l) => l.num === levelNum)
  const level    = useLocalizedLevel(rawLevel ?? LEVELS[0])
  if (!rawLevel) return null
```

And remove the existing `if (!level) return null` line (it comes after, now covered by the `rawLevel` check).

The full updated block should look like:

```typescript
  const rawLevel = LEVELS.find((l) => l.num === levelNum)
  const level    = useLocalizedLevel(rawLevel ?? LEVELS[0])
  if (!rawLevel) return null
```

(Remove the old `if (!level) return null` line that was previously after `LEVELS.find`.)

- [ ] **Step 2: Type-check**

```bash
cd /home/sion/noir-sql-mystery && npx tsc --noEmit
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/CaseBriefing.tsx
git commit -m "feat: use localized level in CaseBriefing"
```

---

### Task 5: Update DetectiveNotepad.tsx

**Files:**
- Modify: `src/components/DetectiveNotepad.tsx`

- [ ] **Step 1: Replace LEVELS import with useLocalizedLevels**

In `src/components/DetectiveNotepad.tsx`, replace:
```typescript
import { LEVELS } from '@/data/levels'
```
with:
```typescript
import { useLocalizedLevels } from '@/hooks/useLocalizedLevel'
```

- [ ] **Step 2: Call the hook inside the component**

Inside `export default function DetectiveNotepad()`, add after the existing hooks (after line `const [notes, setNotes] = useState('')` or wherever hooks are):

```typescript
  const localizedLevels = useLocalizedLevels()
```

Then replace every occurrence of `LEVELS` in JSX with `localizedLevels`. Search for `LEVELS.map(` and `LEVELS.find(` in this file and replace with `localizedLevels.map(` and `localizedLevels.find(`.

- [ ] **Step 3: Type-check**

```bash
cd /home/sion/noir-sql-mystery && npx tsc --noEmit
```

Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/DetectiveNotepad.tsx
git commit -m "feat: use localized levels in DetectiveNotepad"
```

---

### Task 6: Visual verification

- [ ] **Step 1: Start dev server**

```bash
cd /home/sion/noir-sql-mystery && npm run dev
```

Open `http://localhost:3000/game` in a browser.

- [ ] **Step 2: Verify Thai mode (default)**

With language set to Thai (default), verify:
- Level title shows in Thai (e.g., "ศพ" not "The Body")
- Act badge shows in Thai (e.g., "องก์ที่ 1 — โรงแรมโกลด์ฟินช์")
- Story paragraphs in Thai
- Objective text in Thai
- Bonus prompt in Thai
- After solving, success message in Thai
- After claiming bonus, bonus clue in Thai
- Hints show in Thai when clicked
- Wrong query error shows: "คำสั่งนี้ไม่ได้ข้อมูลที่เราต้องการ ลองวิธีอื่น"
- Detective Notepad task objectives show in Thai
- Case Briefing modal shows Thai title and objective

- [ ] **Step 3: Verify English mode**

Click the ENG toggle button. Verify:
- Level title switches to English (e.g., "The Body")
- Story switches to English
- All other content switches to English
- Toggle back to Thai — all switches back

- [ ] **Step 4: Final commit if clean**

```bash
git add -A
git status
```

If nothing untracked/unstaged, the feature is complete.

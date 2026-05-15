# Suspect Dossier Tab — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Suspects tab to the main panel showing a horizontally-scrollable row of full police-dossier cards with photo, nameplate, and personal info fields.

**Architecture:** Extend `suspects.ts` with physical/alibi data, add translation keys for alibi text and field labels, create a new `SuspectDossier` component, then wire a new `suspects` tab into `GameClient`. The existing sidebar `SuspectList` is untouched.

**Tech Stack:** Next.js, React, Tailwind CSS v4, TypeScript, Zustand

---

## File Map

| File | Change |
|------|--------|
| `src/data/suspects.ts` | Add `alibiKey`, `plate`, `age`, `height`, `build`, `hair`, `eyes` to each entry |
| `src/data/translations/en.ts` | Add `alibi` to each suspect; add `field_role/age/build/hair/eyes/alibi` to `ui` |
| `src/data/translations/th.ts` | Same keys in Thai |
| `src/components/SuspectDossier.tsx` | **Create** — horizontal scrollable row of dossier cards |
| `src/components/GameClient.tsx` | Add `'suspects'` to tab type, add tab button + panel |

---

## Task 1: Extend suspects.ts

**Files:**
- Modify: `src/data/suspects.ts`

- [ ] **Step 1: Replace the file contents**

```ts
export const SUSPECTS = [
  {
    id: 1,
    nameKey:   'suspects.louis_krane.name',
    roleKey:   'suspects.louis_krane.role',
    detailKey: 'suspects.louis_krane.detail',
    alibiKey:  'suspects.louis_krane.alibi',
    plate:     'KRANE, L.',
    age:       48,
    height:    "6'1\"",
    build:     'Stocky',
    hair:      'Grey',
    eyes:      'Brown',
  },
  {
    id: 2,
    nameKey:   'suspects.tommy_ricci.name',
    roleKey:   'suspects.tommy_ricci.role',
    detailKey: 'suspects.tommy_ricci.detail',
    alibiKey:  'suspects.tommy_ricci.alibi',
    plate:     'RICCI, T.',
    age:       24,
    height:    "5'9\"",
    build:     'Lean',
    hair:      'Brown',
    eyes:      'Green',
  },
  {
    id: 3,
    nameKey:   'suspects.diane_harlow.name',
    roleKey:   'suspects.diane_harlow.role',
    detailKey: 'suspects.diane_harlow.detail',
    alibiKey:  'suspects.diane_harlow.alibi',
    plate:     'HARLOW, D.',
    age:       31,
    height:    "5'6\"",
    build:     'Slender',
    hair:      'Black',
    eyes:      'Brown',
  },
  {
    id: 4,
    nameKey:   'suspects.frank_dellum.name',
    roleKey:   'suspects.frank_dellum.role',
    detailKey: 'suspects.frank_dellum.detail',
    alibiKey:  'suspects.frank_dellum.alibi',
    plate:     'DELLUM, F.',
    age:       44,
    height:    "5'11\"",
    build:     'Heavy',
    hair:      'Dark',
    eyes:      'Blue',
  },
  {
    id: 5,
    nameKey:   'suspects.nora_vance.name',
    roleKey:   'suspects.nora_vance.role',
    detailKey: 'suspects.nora_vance.detail',
    alibiKey:  'suspects.nora_vance.alibi',
    plate:     'VANCE, N.',
    age:       38,
    height:    "5'4\"",
    build:     'Average',
    hair:      'Auburn',
    eyes:      'Grey',
  },
] as const;
```

- [ ] **Step 2: Type-check**

```bash
cd /home/sion/noir-sql-mystery && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/data/suspects.ts
git commit -m "feat: extend suspects data with dossier fields"
```

---

## Task 2: English translation keys

**Files:**
- Modify: `src/data/translations/en.ts`

- [ ] **Step 1: Add alibi to each suspect**

In `src/data/translations/en.ts`, replace the `suspects` block (currently lines 64–70):

```ts
  suspects: {
    louis_krane:  { name: 'Louis Krane',  role: 'Hotel Manager',      detail: 'Cool under pressure. Full building access.',                    alibi: 'Claims to have been in his office reviewing invoices until midnight.' },
    tommy_ricci:  { name: 'Tommy Ricci',  role: 'Bellhop',            detail: 'Reported a missing key. Seen in the alley.',                    alibi: 'Says he was running luggage all evening with no breaks.' },
    diane_harlow: { name: 'Diane Harlow', role: 'Singer',             detail: '9500 dollars stolen. Threatening message at 10 PM.',            alibi: 'Claims she performed until 11 PM then went straight home alone.' },
    frank_dellum: { name: 'Frank Dellum', role: 'Business Partner',   detail: 'Partnership disputes. In the alley at 23:45.',                  alibi: 'Claims to have been in the alley settling a business dispute.' },
    nora_vance:   { name: 'Nora Vance',   role: 'Maid',               detail: 'Limited floor access. Solid evening timeline.',                 alibi: 'Solid evening timeline. Says she never went above the third floor.' },
  },
```

- [ ] **Step 2: Add field label keys to the `ui` object**

In `src/data/translations/en.ts`, add these six keys to the `ui` object (after `detective_notes`):

```ts
    field_role:  'ROLE',
    field_age:   'AGE',
    field_build: 'BUILD',
    field_hair:  'HAIR',
    field_eyes:  'EYES',
    field_alibi: 'ALIBI',
```

- [ ] **Step 3: Type-check**

```bash
cd /home/sion/noir-sql-mystery && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/data/translations/en.ts
git commit -m "feat: add suspect alibi and dossier field labels (EN)"
```

---

## Task 3: Thai translation keys

**Files:**
- Modify: `src/data/translations/th.ts`

- [ ] **Step 1: Add alibi to each suspect**

In `src/data/translations/th.ts`, locate the `suspects` block (around line 275) and add the `alibi` field to each entry:

```ts
  suspects: {
    louis_krane:  { name: 'หลุยส์ เครน',       role: 'ผู้จัดการโรงแรม',           detail: 'เยือกเย็นภายใต้ความกดดัน เข้าถึงทุกพื้นที่ในอาคาร',              alibi: 'อ้างว่าอยู่ในสำนักงานตรวจสอบใบแจ้งหนี้จนถึงเที่ยงคืน' },
    tommy_ricci:  { name: 'ทอมมี่ ริชชี่',      role: 'พนักงานยกกระเป๋า',          detail: 'แจ้งว่ากุญแจหาย ถูกพบเห็นในตรอกหลังโรงแรม',                  alibi: 'อ้างว่าขนกระเป๋าอยู่ตลอดคืนโดยไม่ได้หยุด' },
    diane_harlow: { name: 'ดีแอน ฮาร์โลว์',    role: 'นักร้อง',                   detail: 'เงิน 9,500 ดอลลาร์ถูกขโมย มีข้อความข่มขู่ตอนสี่ทุ่ม',         alibi: 'อ้างว่าแสดงถึงสี่ทุ่มแล้วกลับบ้านคนเดียวทันที' },
    frank_dellum: { name: 'แฟรงก์ เดลลัม',     role: 'หุ้นส่วนทางธุรกิจ',         detail: 'มีข้อพิพาทเรื่องหุ้นส่วน ถูกพบในตรอกตอน 23:45 น.',           alibi: 'อ้างว่าอยู่ในตรอกเพื่อยุติข้อพิพาททางธุรกิจ' },
    nora_vance:   { name: 'โนรา แวนซ์',         role: 'แม่บ้าน',                   detail: 'เข้าถึงชั้นได้จำกัด ไทม์ไลน์ช่วงค่ำชัดเจน',                  alibi: 'ไทม์ไลน์ตอนเย็นชัดเจน อ้างว่าไม่เคยขึ้นไปเกินชั้นสาม' },
  },
```

- [ ] **Step 2: Add field label keys to the `ui` object**

In `src/data/translations/th.ts`, add to the `ui` object (after `detective_notes`):

```ts
    field_role:  'ตำแหน่ง',
    field_age:   'อายุ',
    field_build: 'รูปร่าง',
    field_hair:  'ผม',
    field_eyes:  'ตา',
    field_alibi: 'ข้ออ้าง',
```

- [ ] **Step 3: Type-check**

```bash
cd /home/sion/noir-sql-mystery && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/data/translations/th.ts
git commit -m "feat: add suspect alibi and dossier field labels (TH)"
```

---

## Task 4: Create SuspectDossier component

**Files:**
- Create: `src/components/SuspectDossier.tsx`

- [ ] **Step 1: Create the file**

```tsx
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
```

- [ ] **Step 2: Type-check**

```bash
cd /home/sion/noir-sql-mystery && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/SuspectDossier.tsx
git commit -m "feat: SuspectDossier component — horizontal dossier card row"
```

---

## Task 5: Wire SuspectDossier into GameClient

**Files:**
- Modify: `src/components/GameClient.tsx`

- [ ] **Step 1: Add import for SuspectDossier**

After the existing `import SuspectList from './SuspectList'` line (line 20), add:

```tsx
import SuspectDossier from './SuspectDossier'
```

- [ ] **Step 2: Expand activeTab type**

On line 51, change:

```tsx
  const [activeTab, setActiveTab] = useState<'query' | 'notes'>('query')
```

to:

```tsx
  const [activeTab, setActiveTab] = useState<'query' | 'suspects' | 'notes'>('query')
```

- [ ] **Step 3: Add Suspects tab button**

In the tab bar (around line 219), after the `<div className="ml-1"><SchemaViewer /></div>` block and before the Detective Notes button, insert:

```tsx
            <button
              onClick={() => setActiveTab('suspects')}
              className={[
                'ml-1 px-4 py-1.5 text-[10px] font-mono uppercase tracking-wider border transition-colors',
                activeTab === 'suspects'
                  ? 'bg-surface border-gold border-b-0 text-gold'
                  : 'bg-ink border-border text-shadow hover:text-aged',
              ].join(' ')}
            >
              {t('ui.suspects')}
            </button>
```

- [ ] **Step 4: Add Suspects tab panel**

After the notes panel (around line 280):

```tsx
          {activeTab === 'notes' && (
            <div className="flex-1 overflow-hidden">
              <DetectiveNotepad />
            </div>
          )}
```

Add the suspects panel immediately after:

```tsx
          {activeTab === 'suspects' && (
            <div className="flex-1 overflow-hidden">
              <SuspectDossier />
            </div>
          )}
```

- [ ] **Step 5: Type-check**

```bash
cd /home/sion/noir-sql-mystery && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/GameClient.tsx
git commit -m "feat: add Suspects tab to main panel"
```

---

## Task 6: Final build and visual verification

- [ ] **Step 1: Full build**

```bash
cd /home/sion/noir-sql-mystery && npm run build
```

Expected: build succeeds with no errors.

- [ ] **Step 2: Start dev server and verify**

```bash
npm run dev
```

Open http://localhost:3000. Check:
1. Tab bar shows **Evidence Query | Schema Map | Suspects | Detective Notes**
2. Clicking Suspects shows 5 cards in a horizontal scrollable row
3. Each card shows: photo slot (silhouette since no images yet), nameplate, name header, ROLE/AGE/BUILD/HAIR/EYES fields, alibi text
4. After making an accusation (via the sidebar button), the accused suspect's card turns red with ACCUSED stamp
5. If the correct suspect is accused, the card turns gold with GUILTY stamp
6. Switch to Thai (ไทย) — field labels (ตำแหน่ง / อายุ / รูปร่าง / ผม / ตา / ข้ออ้าง), suspect names, roles, and alibi text all appear in Thai

- [ ] **Step 3: Drop in a test image (optional)**

Place any portrait image at `public/suspects/3.jpg` and verify it displays in the Diane Harlow card instead of the silhouette.

- [ ] **Step 4: Commit any final tweaks, then done**

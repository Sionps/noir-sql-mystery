# Suspect Dossier Tab — Design Spec

## Goal

Add a **Suspects** tab to the main panel tab bar. Each suspect gets a full police-dossier card with a photo, nameplate, and personal information. Cards are laid out in a horizontal scrollable row.

## Layout

The main panel tab bar gains a fourth tab: **Suspects**, inserted between Schema Map and Detective Notes.

```
[ Evidence Query ] [ Schema Map ] [ Suspects ] [ Detective Notes ]
```

The Suspects tab renders a horizontally scrollable row of five cards, one per suspect. The sidebar's existing small 2-column card grid (`SuspectList`) is unchanged — it stays as a quick-reference widget.

## Card Anatomy

Each card is ~160px wide, `flex-shrink: 0`, laid out top-to-bottom:

```
┌─────────────────────┐  ← border (color changes with state)
│  [  PHOTO / IMG  ]  │  ← 3:4 aspect ratio, full card width
│  ┌─ nameplate ─────┐│
│  │ SURNAME, F.     ││  ← 6px mono uppercase, dimmed bg
│  │ #00N-A          ││  ← file number, smaller + muted
│  └─────────────────┘│
│  FULL NAME          │  ← 9px gold uppercase header
│  ─────────────────  │
│  ROLE  Hotel Mgr    │  ← 7px mono, label col muted
│  AGE   48           │
│  BUILD 6'1" · Stocky│
│  HAIR  Grey         │
│  EYES  Brown        │
│  ─────────────────  │
│  Alibi text italic  │  ← 6.5px, italic, muted
└─────────────────────┘
                       ← ACCUSED / GUILTY stamp absolute top-right
```

## Photo

- `<img src="/suspects/{id}.jpg" ...>` inside the photo slot
- If the file is missing the `<img>` `onError` handler replaces it with an SVG silhouette (two ellipses — head + torso, filled with the current state's tint color)
- The user provides image files: `public/suspects/1.jpg` through `public/suspects/5.jpg`

## Card States

| State   | Border          | Background    | Photo bg      | Stamp           |
|---------|-----------------|---------------|---------------|-----------------|
| Default | `border-border` | `bg-[#1a1208]`| `bg-[#0f0c06]`| none            |
| Accused | `#8b1a1a` (red) | `#200808`     | `#3a0808`     | ACCUSED red     |
| Guilty  | `#c8922a` (gold)| `bg-ink`      | `bg-[#0f0c06]`| GUILTY gold     |

State is determined by: `accusationMade && accusedId === suspect.id` (accused), and additionally `suspect.id === KILLER_ID` (guilty).

## Data

### `src/data/suspects.ts`

Extend each suspect with static (non-translated) physical fields and add `alibiKey` for translated alibi text:

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

### `src/data/translations/en.ts`

Add `alibi` to each suspect entry and new UI label keys:

```ts
suspects: {
  louis_krane:  { name: '...', role: '...', detail: '...', alibi: 'Claims to have been in his office reviewing invoices until midnight.' },
  tommy_ricci:  { name: '...', role: '...', detail: '...', alibi: 'Says he was running luggage all evening with no breaks.' },
  diane_harlow: { name: '...', role: '...', detail: '...', alibi: 'Claims she performed until 11 PM then went straight home alone.' },
  frank_dellum: { name: '...', role: '...', detail: '...', alibi: 'Claims to have been in the alley settling a business dispute.' },
  nora_vance:   { name: '...', role: '...', detail: '...', alibi: 'Solid evening timeline. Says she never went above the third floor.' },
},
ui: {
  // ...existing keys...
  suspects_tab:  'Suspects',
  field_age:     'AGE',
  field_build:   'BUILD',
  field_hair:    'HAIR',
  field_eyes:    'EYES',
  field_alibi:   'ALIBI',
},
```

### `src/data/translations/th.ts`

Add the same keys in Thai:

```ts
suspects: {
  louis_krane:  { ..., alibi: 'อ้างว่าอยู่ในสำนักงานตรวจสอบใบแจ้งหนี้จนถึงเที่ยงคืน' },
  tommy_ricci:  { ..., alibi: 'อ้างว่าขนกระเป๋าอยู่ตลอดคืนโดยไม่ได้หยุด' },
  diane_harlow: { ..., alibi: 'อ้างว่าแสดงถึงสี่ทุ่มแล้วกลับบ้านคนเดียว' },
  frank_dellum: { ..., alibi: 'อ้างว่าอยู่ในตรอกเพื่อแก้ปัญหาธุรกิจ' },
  nora_vance:   { ..., alibi: 'มีตารางเวลาตอนเย็นที่ชัดเจน ไม่เคยขึ้นไปเกินชั้นสาม' },
},
ui: {
  suspects_tab:  'ผู้ต้องสงสัย',
  field_age:     'อายุ',
  field_build:   'รูปร่าง',
  field_hair:    'ผม',
  field_eyes:    'ตา',
  field_alibi:   'ข้ออ้าง',
},
```

## New Component: `SuspectDossier.tsx`

`src/components/SuspectDossier.tsx` — renders the full horizontal dossier row.

- Imports `SUSPECTS` from `@/data/suspects`
- Reads `accusedId` and `accusationMade` from `useGameStore`
- `KILLER_ID = 3`
- Renders `<div className="flex flex-row gap-3 overflow-x-auto p-4">` containing one card per suspect
- Each card handles its own photo `<img>` with `onError` silhouette swap

## `GameClient.tsx` changes

- `activeTab` type expands: `'query' | 'suspects' | 'notes'`
- New tab button added between Schema Map and Detective Notes:
  ```tsx
  <button onClick={() => setActiveTab('suspects')} className={tabClass(activeTab === 'suspects')}>
    {t('ui.suspects_tab')}
  </button>
  ```
- New tab panel:
  ```tsx
  {activeTab === 'suspects' && (
    <div className="flex-1 overflow-hidden">
      <SuspectDossier />
    </div>
  )}
  ```

## Out of Scope

- No changes to `SuspectList` (sidebar widget stays as-is)
- No click-to-accuse from the dossier tab (accusation still happens via the sidebar button)
- No animation or expand-on-click interactions

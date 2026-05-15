# Case Briefing Story Popups Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a "Case Briefing" narrative sequence that intercepts level selection with a "Scribbled Note" popup before the player enters a level.

**Architecture:**
- **State Interception:** Use a `briefingLevel` state in `gameStore` to track when a briefing is active.
- **UI Overlay:** Create a `CaseBriefing` component that renders a stylized sticky note.
- **Trigger Flow:** `LevelNav` $\rightarrow$ `setBriefingLevel(n)` $\rightarrow$ `CaseBriefing` Render $\rightarrow$ `setLevel(n)` $\rightarrow$ Close Popup.

**Tech Stack:** React, Tailwind CSS, Zustand.

---

### Task 1: Update gameStore State

**Files:**
- Modify: `src/store/gameStore.ts`

- [ ] **Step 1: Add `briefingLevel` and `setBriefingLevel` to `GameState` interface.**
```tsx
interface GameState {
  // ... existing
  briefingLevel: number | null;
  setBriefingLevel: (levelNum: number | null) => void;
}
```

- [ ] **Step 2: Initialize `briefingLevel: null` and implement `setBriefingLevel`.**
```tsx
// Inside create store
briefingLevel: null,
setBriefingLevel: (levelNum) => set({ briefingLevel: levelNum }),
```

- [ ] **Step 3: Commit**
```bash
git add src/store/gameStore.ts
git commit -m "feat: add briefingLevel state to gameStore"
```

---

### Task 2: Create the CaseBriefing Component

**Files:**
- Create: `src/components/CaseBriefing.tsx`

- [ ] **Step 1: Implement the "Scribbled Note" visual style.**
    - Background: `#fff9c4` (light yellow).
    - Text: `#5d4037` (dark brown).
    - Font: `font-serif` (fallback to typewriter style).
    - Layout: `relative`, `transform -rotate-2`, `shadow-xl`.
    - Detail: Add a red circle `div` as a push-pin at the top center.

- [ ] **Step 2: Implement the narrative logic.**
    - Accept `levelNum` as a prop.
    - Pull `level` data from `LEVELS` array.
    - Render a "Scribbled" version of the story:
        - `hook`: The first block of `level.story`.
        - `objective`: The `level.objective` string.

- [ ] **Step 3: Add the "Start Digging" button.**
    - Button should trigger a callback that calls `setLevel(levelNum)` and `setBriefingLevel(null)`.

- [ ] **Step 4: Commit**
```bash
git add src/components/CaseBriefing.tsx
git commit -m "feat: add CaseBriefing scribbled note component"
```

---

### Task 3: Integrate Briefing into LevelNav and GameClient

**Files:**
- Modify: `src/components/LevelNav.tsx`
- Modify: `src/components/GameClient.tsx`

- [ ] **Step 1: Update `LevelNav` to trigger the briefing.**
    - Replace `onClick={() => setLevel(level.num)}` with `onClick={() => setBriefingLevel(level.num)}`.

- [ ] **Step 2: Update `GameClient` to render the overlay.**
    - Access `briefingLevel` from `useGameStore`.
    - If `briefingLevel` is not null, render `<CaseBriefing />` as a full-screen fixed overlay (above all other content).

- [ ] **Step 3: Commit**
```bash
git add src/components/LevelNav.tsx src/components/GameClient.tsx
git commit -m "feat: integrate case briefing flow into game loop"
```

---

### Task 4: Final Polish and Narrative Tuning

**Files:**
- Modify: `src/components/CaseBriefing.tsx`

- [ ] **Step 1: Add subtle animations.**
    - Add a fade-in/scale-up animation for the note.
    - Add a hover effect to the "Start Digging" button.

- [ ] **Step 2: Refine the layout for different screen sizes.**
    - Ensure the note stays centered and doesn't overflow on mobile.

- [ ] **Step 3: Commit**
```bash
git add src/components/CaseBriefing.tsx
git commit -m "style: polish laout and animations for case briefing"
```

---

### Verification Plan
- **Interception Test:** Click a level number $\rightarrow$ Modal should appear, `currentLevel` should NOT change yet.
- **Content Test:** Verify the correct level's story and objective are displayed.
- **Transition Test:** Click "Start Digging" $\rightarrow$ Modal closes, `currentLevel` updates, level loads.
- **Visual Test:** Verify the "Scribbled Note" look (yellow paper, rotation, red pin).

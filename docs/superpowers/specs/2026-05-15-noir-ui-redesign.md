# Noir UI Redesign — Dossier Files Style

**Date:** 2026-05-15
**Scope:** Skin & decoration — keep existing layout, add noir game chrome
**Style direction:** Detective Board → Dossier Files variant

---

## Overview

The goal is to make the game UI feel more like a physical detective's case file and less like a generic dark-themed web app. All four element groups are in scope: suspect list, story/briefing panel, panel borders/frames, and action buttons. The SQL editor layout and results table are left structurally unchanged; they only get the panel frame treatment.

Color palette and fonts are unchanged (`--color-gold`, `--color-red`, `--color-aged`, etc. from `globals.css`). Georgia serif is introduced for display titles; Courier Prime remains for all body and code text.

---

## 1. Panel Frames — Folder-Tab Treatment

Every sidebar section and main content panel gets a folder-tab header instead of a plain label or border.

**Structure:**
- A `folder-tab` element sits above the panel body, flush with its top-left, styled as a manila folder tab: `background: var(--color-ink)`, `border: 1px solid var(--color-border)`, `border-bottom: none`, small uppercase text in `--color-gold`.
- The panel body below it has a full border on all four sides (`border: 1px solid var(--color-border)`).
- No corner brackets or other decoration — the folder tab itself is the game-feel signal.

**Applies to:** CaseBriefing panel, SchemaViewer panel, DetectiveNotepad panel, SuspectList section header.

---

## 2. Story / Case Briefing Panel

The `CaseBriefing` / `StoryPanel` sidebar section becomes a case file dossier.

**Changes:**
- Folder tab labeled with the act name (e.g. "Case File")
- Inside the panel body, a stamps row at the top: two small bordered labels — "CONFIDENTIAL" (gold border/text) and "OPEN" (default, gold) or "CLOSED" (when `solved[currentLevel]` is true, red border/text) — plus a right-aligned case file number derived from the level number (e.g. level 1 → `#001-A`)
- Act label, title, location/time meta unchanged in content; title uses Georgia serif
- NPC dialogue blocks keep the existing gold left-border treatment
- Objective box gets a dashed border (`border: 1px dashed var(--color-border)`) instead of solid, to feel like a handwritten note tucked into the file

---

## 3. Suspect List — Portrait Card Grid

Replace the current vertical list of `<div>` rows with a 2-column portrait card grid.

**Card anatomy (per suspect):**
- Portrait placeholder: fixed `36×44px` box with `background: var(--color-ink)`, `border: 1px solid var(--color-border)`, centered Unicode `👤` character in `--color-shadow`
- Name below in small Courier, role in dimmer `--color-shadow`
- Default card: `border: 1px solid var(--color-border)`
- **Accused state** (accusation made, outcome unknown): `border: 1px solid var(--color-red)`, `background: #200808`, a small `✕` badge top-right, and an "ACCUSED" stamp below the role label (`border: 1px solid var(--color-red)`, red text, `6px` uppercase)
- **Correct verdict state** (accusation made, this suspect was the killer): gold border, `✓` badge top-right, "GUILTY" stamp in gold

Cards are clickable (no behavior change — clicking opens AccuseModal as before). The grid fits in the existing sidebar width (220–320px); 2 columns with `gap: 6px`.

---

## 4. Buttons — Heavy-Border Stamp Style

All action buttons drop their current `bg-gold text-ink` / rounded style in favor of a typewriter-stamp aesthetic.

| Button | Border | Text | Background |
|--------|--------|------|------------|
| Run Query | `2px solid var(--color-gold)` | `--color-gold` | `var(--color-ink)` |
| Make Accusation | `2px solid var(--color-red)` | `--color-red` | `#0a0300` |
| Use Hint | `2px solid var(--color-border)` | `--color-shadow` | transparent |
| Schema Map | `2px solid var(--color-border)` | `--color-shadow` | transparent |

All buttons: `font-family: monospace`, `font-size: 10px`, `letter-spacing: 1px`, `text-transform: uppercase`, `border-radius: 0` (no rounding). Hover state: border color steps up one shade (gold → `--color-aged`, red → `#c02020`, dim → `--color-shadow`). Background does not change on hover.

The Accuse button and Run Query button are the two visually dominant CTAs. Hint and Schema remain subdued.

---

## 5. Header & Level Nav

**Header:** Add a subtitle line below the game title: "A Detective's Case Files" in small dimmed Courier. Bottom border stays gold but increases to `2px`.

**Level Nav:** Tab labels change from "Level 1" to "Case I", "Case II", etc. (run through the existing translation hook). Active tab gets folder-tab treatment: top and side border in `--color-gold`, bottom border removed, sits flush against the content area below. Solved tabs use `--color-shadow` text at `opacity: 0.5`. Unsolved non-active tabs use `--color-border` text.

---

## 6. Main Panel Tabs

The main content area gets a tab bar along the top with three tabs. This requires a local `activeTab` state in `GameClient` (no store change needed).

- **Evidence Query** (default active) — the SQL editor + results table, as currently rendered
- **Schema Map** — renders `SchemaViewer`. If SchemaViewer is currently rendered in the sidebar, remove it from there and render it only here.
- **Detective Notes** — renders `DetectiveNotepad`. Same: remove from sidebar if currently there, render only here.

Tab bar styling matches the level nav folder-tab treatment: active tab has `--color-gold` border, bottom border removed, inactive tabs are dim (`--color-border` text).

Note: this is a minor layout refactor (moving two panels from sidebar to main tabs), not pure decoration. It keeps all existing functionality and reduces sidebar scroll.

---

## Out of Scope

- SQL editor syntax highlighting and code mirror internals — no changes
- Results table column layout — no changes
- Game logic, store, validators — no changes
- Mobile layout — no changes in this pass
- Animations or transitions beyond existing hover states

---

## Files Affected

| File | Change |
|------|--------|
| `src/components/StoryPanel.tsx` | Folder-tab wrapper, stamps row, dashed objective box |
| `src/components/CaseBriefing.tsx` | Same folder-tab + stamps treatment |
| `src/components/SuspectList.tsx` | Replace list rows with 2-col portrait card grid |
| `src/components/GameClient.tsx` | Header subtitle, level nav tab labels, main panel tab bar |
| `src/components/SchemaViewer.tsx` | Folder-tab wrapper |
| `src/components/DetectiveNotepad.tsx` | Folder-tab wrapper |
| `src/components/FeedbackBar.tsx` | Minor: letter-spacing, monospace consistency |
| `src/app/globals.css` | Add Georgia serif to `--font-family-display` fallback stack |

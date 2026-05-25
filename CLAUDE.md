# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server (webpack mode — required, Turbopack not used)
npm run build    # Production build
npm start        # Serve production build
```

There are no tests. Type-check only via `tsc --noEmit`.

## Stack

- **Next.js 16.2.6 + React 19** — App Router, all game UI is client-side (`'use client'`)
- **Tailwind CSS v4** — configured via `postcss.config.mjs`; uses `@tailwindcss/postcss`
- **sql.js** — SQLite compiled to WASM, runs entirely in the browser; `public/sql-wasm.wasm` is copied from `node_modules` by `postinstall`
- **Zustand v5** — global game state with `localStorage` persistence (`noir-sql-v1` key)
- **CodeMirror 6** — SQL editor component

## Architecture

The app is a single-page noir detective game at `/game` (renders `GameClient`). There is no backend — everything runs client-side.

**Data flow:**
1. `src/data/seed.ts` — SQL `CREATE TABLE / INSERT` statements that bootstrap the in-memory SQLite DB
2. `src/lib/db.ts` — initializes the WASM DB (`initDB`), executes queries (`runQuery`), enforces SELECT-only (blocks INSERT/UPDATE/DELETE/DROP etc. via regex)
3. `src/lib/validator.ts` — runs each level's `validate` / `bonus_validate` functions against query results
4. `src/data/levels.ts` — defines all 10 levels; each `Level` has `validate` and `bonus_validate` callbacks, 3 progressive `hints`, `story` blocks, and a `bonus_prompt`
5. `src/store/gameStore.ts` — tracks progress: solved levels, XP, hints used, language, accusation state; `canAccuse()` requires 8 solved levels
6. `src/components/GameClient.tsx` — orchestrates everything: sidebar (story + bonus clues + accuse button), resizable via drag, main panel with tabs (Evidence Query / Suspects / Detective Notes)

**Localization:** `src/data/translations.ts` + `src/hooks/useTranslation.ts` — bilingual EN/TH; default language is Thai (`'th'`). Level content is localized via `src/hooks/useLocalizedLevel.ts` and locale files in `src/data/translations/`.

**Game loop:** Player writes SQL → `runQuery` executes it → `validateResult` checks it against the current level → on pass, `solveLevel` awards XP; bonus query awards 50 XP if solved before the main query.

**DB tables:** `persons`, `hotel_log`, `evidence`, `phone_rec`, `financials`, `bar_tabs`, `witnesses`, `staff`, `messages`, `alley_log`

## Key Constraints

- `runQuery` blocks all non-SELECT statements — this is a security boundary, not a debug guard.
- The `webpack` flag in `dev`/`build` scripts is required for WASM (`asyncWebAssembly: true` in `next.config.js`).
- `sql.js` must be imported dynamically (`await import('sql.js')`) — static import breaks SSR/module bundling.

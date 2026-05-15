# Design Spec: Case Briefing Story Popups

## Overview
Implement a "Case Briefing" sequence that appears after selecting a level but before the gameplay begins. The briefing is presented as a "Scribbled Note" pinned to the evidence board, providing an atmospheric narrative hook and a clear objective.

## 1. UX Flow
1. **Trigger:** User clicks a level number in `LevelNav`.
2. **Interception:** Instead of immediately changing the active level, the system sets a `briefingLevel` state.
3. **Presentation:** A full-screen overlay appears, presenting the `CaseBriefing` component.
4. **Progression:** User reads the note and clicks the "Start Digging" button.
5. **Execution:** The `currentLevel` state is updated to the target level, and the `briefingLevel` is reset to `null`, closing the popup and starting the level.

## 2. Visual Design (Scribbled Note)
- **Backdrop:** Dark, semi-transparent overlay with a subtle blur.
- **The Note:**
    - **Background:** Light yellow/cream (`#fff9c4`).
    - **Texture:** Subtle paper grain/noise.
    - **Shape:** Rectangular with slightly irregular borders and a random rotation (e.g., -2 degrees).
    - **Shadow:** Deep, soft shadow to make it feel like it's floating above the board.
    - **Pin:** A small red circular push-pin at the top center.
- **Typography:**
    - **Font:** Typewriter/Handwritten style (`Special Elite` or similar).
    - **Ink Color:** Dark brown/charcoal (`#5d4037`).
    - **Style:** Italicized narrative and bolded objectives.

## 3. Content Structure
Each level will have a static briefing object:
- `hook`: A 1-2 sentence narrative snippet setting the mood.
- `objective`: A clear instruction on what to find and which table to target.
- `hint`: (Optional) A subtle clue about the query required.

## 4. Technical Implementation
- **State Management:** 
    - Add `briefingLevel: number | null` to `gameStore`.
    - Add `setBriefingLevel` action to `gameStore`.
- **Components:**
    - `CaseBriefing.tsx`: A new presentational component that takes the current level's story data and renders the note.
- **Logic:**
    - `LevelNav.tsx`: Update `onClick` to call `setBriefingLevel(level.num)` instead of `setLevel(level.num)`.
    - `GameClient.tsx`: Add the `CaseBriefing` component as a conditional overlay based on the `briefingLevel` state.

## 5. Verification Plan
- **Trigger Test:** Verify that clicking a level number opens the popup instead of the level.
- **Content Test:** Verify the correct narrative hook and objective appear for different levels.
- **Transition Test:** Verify that clicking "Start Digging" closes the popup and correctly loads the intended level.
- **Visual Test:** Verify the "Scribbled Note" aesthetic matches the mockups (rotation, pins, colors).

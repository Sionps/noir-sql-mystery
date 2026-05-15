# Design Spec: Evidence Board Case File Redesign

## Overview
Redesign the "Case File" trigger and the Database Schema viewer to transform it from a digital UI into a physical "Evidence Board." This enhances the noir mystery atmosphere by making the data exploration feel like a detective connecting clues on a corkboard.

## 1. The Trigger (Button)
**Current State:** Simple text button.
**New Design:**
- **Visual:** A small, pinned yellow sticky note or an aged index card.
- **Style:** Light yellow background, dark ink text, slightly rotated (1-2 degrees).
- **Interaction:** Subtle scale-up on hover to simulate a "reaching for the note" feeling.

## 2. The Case File Backdrop
**Current State:** Black semi-transparent modal.
**New Design:**
- **Visual:** A rich brown corkboard texture.
- **Implementation:** A combination of a deep brown base color and a subtle radial-gradient pattern to simulate the porous texture of cork.
- **Border:** A thick, dark-wooden frame around the entire modal.

## 3. The Table Components (Polaroids)
**Current State:** Dark "TableCards" with gold/paper text.
**New Design:**
- **Visual:** Physical Polaroid photos.
- **Structure:** 
    - White border with a wider bottom margin (the "caption" area).
    - Off-white/cream interior for the table content.
- **Typography:** Use a typewriter or handwritten-style font (`Special Elite` or similar) for table and column names.
- **Organic Layout:** Each table will have a random slight rotation (between -3 and 3 degrees) so they don't look perfectly aligned.
- **Interaction:** Clicking a "Polaroid" expands it, perhaps by "sliding" it forward or flipping it.

## 4. The Connections (Red String)
**Current State:** Simple gold arrows (`→`).
**New Design:**
- **Visual:** Thick red yarn/string.
- **Implementation:** SVG lines connecting the center of one Polaroid to another.
- **Style:** Deep red color with a slight glow or drop shadow to give it dimension.
- **Anchors:** Small "push-pin" circles at the start and end of each string.

## 5. Additional Flair
- **Push-pins:** Small colored circles (red, blue) at the top center of each Polaroid.
- **Scribbles:** Occasional small red ink marks or "circling" around primary keys.
- **Paper Texture:** Subtle noise/grain overlay on the Polaroids to avoid "flat" digital white.

## Technical Constraints
- Must remain responsive (90vw/90vh).
- Must preserve the original data flow and "expanded" state logic from `SchemaViewer.tsx`.
- Use Tailwind CSS for styling and SVG for the red strings.

# Evidence Board Case File Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Case File trigger and database schema viewer to look like a physical evidence board with corkboard texture, polaroid-style tables, and red string connections.

**Architecture:** 
- Update `SchemaViewer.tsx` to use a custom "Evidence Board" layout.
- Replace standard `div` borders with Polaroid frames.
- Implement a simplified SVG overlay for "red string" connections based on the hub-and-spoke model.
- Use Tailwind's arbitrary values and custom CSS for textures (corkboard).

**Tech Stack:** React, Tailwind CSS, SVG.

---

### Task 1: Redesign the Case File Trigger Button

**Files:**
- Modify: `src/components/SchemaViewer.tsx`

- [ ] **Step 1: Replace the simple text button with a "Sticky Note" style button.**

```tsx
// Find the button at lines 237-242 and replace with:
<button
  onClick={() => setOpen(true)}
  className="flex-shrink-0 text-[10px] font-mono uppercase tracking-wider mr-3 
             bg-[#fff9c4] text-[#5d4037] px-2 py-1 
             shadow-md transform -rotate-1 
             hover:scale-105 hover:rotate-0 transition-all cursor-pointer 
             border-b-2 border-yellow-400/50"
>
  📌 Case File
</button>
```

- [ ] **Step 2: Commit**
```bash
git add src/components/SchemaViewer.tsx
git commit -m "feat: redesign case file trigger as sticky note"
```

---

### Task 2: Implement the Corkboard Backdrop and Frame

**Files:**
- Modify: `src/components/SchemaViewer.tsx`

- [ ] **Step 1: Update the modal container with a corkboard texture and wooden frame.**

```tsx
// Find the modal background div (lines 245-247) and the inner container (lines 249-253)
// Update the outer div to a dark overlay and the inner div to the corkboard style:

<div
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
  onClick={close}
>
  <div
    className="bg-[#3d2b1f] border-[12px] border-[#2a1d15] rounded-sm flex flex-col shadow-2xl"
    style={{ 
      width: '90vw', 
      maxWidth: 900, 
      maxHeight: '90vh',
      backgroundImage: `radial-gradient(#4d3b2f 1px, transparent 1px)`,
      backgroundSize: '20px 20px'
    }}
    onClick={(e) => e.stopPropagation()}
  >
```

- [ ] **Step 2: Update the header to look like a wooden plaque or simple label.**

```tsx
// Replace lines 254-261 with:
<div className="flex items-center justify-between px-5 py-3 border-b border-[#2a1d15] flex-shrink-0 bg-[#2a1d15]/30">
  <span className="text-xs text-yellow-200/70 font-mono uppercase tracking-widest italic">
    Evidence Board — Case #402
  </span>
  <button onClick={close} className="text-yellow-200/40 hover:text-yellow-200 font-mono text-sm transition-colors cursor-pointer">
    &#x2715;
  </button>
</div>
```

- [ ] **Step 3: Commit**
```bash
git add src/components/SchemaViewer.tsx
git commit -m "feat: implement corkboard backdrop and wooden frame"
```

---

### Task 3: Transform TableCards into Polaroids

**Files:**
- Modify: `src/components/SchemaViewer.tsx`

- [ ] **Step 1: Create a helper function to generate random rotations.**

```tsx
// Add this helper outside the components:
const getRandomRotation = () => `${(Math.random() * 6 - 3).toFixed(2)}deg`;
```

- [ ] **Step 2: Update `TableCard` to look like a Polaroid.**

```tsx
// Replace the TableCard return (lines 150-195) with:
return (
  <div 
    className={`relative bg-white p-3 pb-6 shadow-xl transition-all ${expanded ? 'scale-110 z-10' : 'z-0'}`}
    style={{ 
      transform: `rotate(${getRandomRotation()})`,
      borderRadius: '2px',
      minWidth: '160px'
    }}
  >
    {/* Push pin */}
    <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full shadow-sm ${isHub ? 'bg-red-600' : 'bg-blue-600'}`} />
    
    <button
      onClick={onToggle}
      className={`w-full text-left px-1 py-2 font-serif text-xs transition-colors flex items-center justify-between gap-2 ${
        isHub ? 'text-black font-bold' : 'text-zinc-800'
      } hover:bg-zinc-100 ${expanded ? 'border-b border-zinc-200' : ''}`}
    >
      <span className="uppercase">{table.name}</span>
      <span className="text-[9px] text-zinc-400 font-mono opacity-60">{table.columns.length} cols</span>
    </button>

    {expanded && (
      <div className="mt-2 space-y-0.5">
        <div className="px-1 py-1 text-[9px] text-zinc-500 font-serif italic leading-relaxed border-b border-zinc-100 mb-1">
          {table.description}
        </div>
        {table.columns.map((col) => {
          const isColSelected = selectedCol === col.name
          return (
            <div key={col.name}>
              <button
                onClick={() => setSelectedCol(isColSelected ? null : col.name)}
                className="w-full flex items-center gap-2 text-left px-1 py-1 rounded hover:bg-zinc-100 transition-colors"
              >
                <KindBadge kind={col.kind} />
                <span className={`text-[11px] font-mono ${col.kind === 'pk' ? 'text-red-700 font-bold' : 'text-zinc-700'}`}>
                  {col.name}
                </span>
                {col.fkTarget && (
                  <span className="text-[8px] text-zinc-400 font-mono ml-auto">&#x2192;{col.fkTarget}</span>
                )}
              </button>
              {isColSelected && (
                <div className="mx-1 px-2 py-1.5 mb-1 bg-zinc-50 border border-zinc-200 rounded text-[10px] text-zinc-600 font-serif italic leading-relaxed">
                  {col.description}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )}
  </div>
)
```

- [ ] **Step 3: Update `KindBadge` for the Polaroid aesthetic.**

```tsx
// Update KindBadge (lines 136-140) to use a "hand-marked" look:
function KindBadge({ kind }: { kind: string }) {
  if (kind === 'pk') return <span className="text-red-600 text-[9px] font-bold mr-1">PK</span>
  if (kind === 'fk') return <span className="text-blue-600 text-[9px] font-bold mr-1">FK</span>
  return null
}
```

- [ ] **Step 4: Commit**
```bash
git add src/components/SchemaViewer.tsx
git commit -m "feat: transform tables into rotating polaroids"
```

---

### Task 4: Implement Red String Connections

**Files:**
- Modify: `src/components/SchemaViewer.tsx`

- [ ] **Step 1: Implement an SVG overlay to draw the red strings.**

```tsx
// Add a new component for the Red Strings:
function RedString({ start, end }: { start: string; end: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="coloredBlur"/>
          </feMerge>
        </filter>
      </defs>
      <line 
        x1={start} y1={start} // This will be replaced by actual coordinates in a real implementation
        x2={end} y2={end} 
        stroke="#b91c1c" 
        strokeWidth="2" 
        strokeLinecap="round" 
        filter="url(#glow)"
        className="opacity-60"
      />
    </svg>
  )
}
```
*Wait: Since the tables are absolute/relative and randomly rotated, static coordinates won't work. For the MVP of this redesign, we will use CSS pseudo-elements or stylized connectors that maintain the visual "string" look without requiring a full coordinate system for the few tables we have.*

- [ ] **Step 2: Replace the `<Arrow />` component with a "Red Yarn" connector.**

```tsx
// Replace the Arrow component (lines 197-204) with:
function RedYarn({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className || ''}`}>
      <div className="w-12 h-1 bg-[#b91c1c] shadow-[0_0_4px_rgba(185,28,28,0.5)] relative">
        <div className="absolute -left-1 -top-1 w-2 h-2 bg-red-800 rounded-full" />
        <div className="absolute -right-1 -top-1 w-2 h-2 bg-red-800 rounded-full" />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Update the main render loop to use `RedYarn`.**

```tsx
// Replace <Arrow className="py-2" /> at line 276 with <RedYarn className="py-2" />
```

- [ ] **Step 4: Commit**
```bash
git add src/components/SchemaViewer.tsx
git commit -m "feat: replace arrows with red yarn connectors"
```

---

### Task 5: Final Polish and Footer Update

**Files:**
- Modify: `src/components/SchemaViewer.tsx`

- [ ] **Step 1: Update the footer to match the "Evidence Board" aesthetic.**

```tsx
// Replace lines 313-319 with:
<div className="flex gap-5 px-5 py-3 border-t border-[#2a1d15] text-[10px] font-serif italic text-yellow-200/40 flex-shrink-0 bg-[#2a1d15]/20">
  <span><span className="text-red-600 font-bold">PK</span> primary key</span>
  <span><span className="text-blue-600 font-bold">FK</span> foreign key</span>
  <span className="ml-auto opacity-60">Case Note: Click a polaroid to inspect details &rarr;</span>
</div>
```

- [ ] **Step 2: Commit**
```bash
git add src/components/SchemaViewer.tsx
git commit -m "style: finalize evidence board footer and polish"
```

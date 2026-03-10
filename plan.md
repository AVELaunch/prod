# AVELaunch Books v2.0 — Implementation Plan

## Overview
**This is a complete rewrite.** The current app is a multi-file Vite + React 19 + TailwindCSS project with 58 nodes, 79 edges, and top-to-bottom layout. The v2.0 spec calls for a **single HTML file** with CDN imports, 20 stages, 32 edges, left-to-right layout, 4 view modes, and no build step. Nearly nothing is reusable.

---

## Phase 1: Project Setup & Architecture

### Step 1 — Create the single HTML file scaffold
- Create `funnel.html` (the new single-file app)
- Set up the importmap with all CDN dependencies (React 18, @xyflow/react@12, dagre, htm)
- Add ReactFlow CSS via CDN link tag
- Add base HTML structure with `<div id="root">`
- Add loading screen overlay ("AVELaunch Books / Loading Sales Funnel...")
- Verify React mounts correctly with a hello-world test

### Step 2 — Define all data constants
- Embed the 20-stage `STAGES` array exactly as specified
- Embed the 2 `ENTRY_NODES` array
- Embed the 32-edge `EDGES` array
- Define `GROUP_COLORS` mapping (1x→8x, 00, entry)
- Define `TYPE_ICONS` mapping (sequence→📧, ghost→👻, etc.)
- Define edge color classification functions (green/red/gray based on label text)

---

## Phase 2: Core Layout & Flow Engine

### Step 3 — Dagre layout engine
- Implement `getLayoutedElements(nodes, edges)` using dagre
- Configure LR direction, nodesep: 70, ranksep: 120, marginx: 40, marginy: 40
- Stage nodes: 280×88px, entry nodes: 140×52px
- Layout must re-run on view change (only visible nodes + their connecting edges)

### Step 4 — ReactFlow canvas setup
- Set up `<ReactFlow>` with custom node/edge types
- Configure fitView with padding 0.15
- Zoom range: 0.3–2.0
- Add `<Background>` dot grid (light gray)
- Add `<MiniMap>` (top-right below top bar, colored by group)
- Add `<Controls>` (bottom-left above table toggle)

---

## Phase 3: Custom Components (all using `htm` tagged templates)

### Step 5 — Custom Stage Node component
- Rounded rect (border-radius 14px), 2px border colored by group
- Background from `stage.color` (pastel from data)
- Top row: type emoji (18px) + "CODE LABEL" bold (16px) + optional badges
- Bottom row: subtitle text (changes per view mode — goal/hubspot/sequence/trigger)
- Badges: amber "DEAL" badge for dealCreation, red "⚠" for warning, white text for textLight
- Handles: left (target) + right (source), colored by group
- Click handler to open Detail Card
- Wrap in `React.memo()`

### Step 6 — Custom Entry Node component
- Smaller pill shape (140×52px), solid color background, white text
- Only a source handle on the right
- Click handler same as stage nodes

### Step 7 — Custom Edge component
- Edge labels (13px, weight 600)
- Green (#22c55e, strokeWidth 2.5) for positive labels
- Red (#ef4444, strokeWidth 1.5) for negative labels
- Gray (#94a3b8) for neutral/other
- Loop edges: smoothstep type + animated: true
- ArrowClosed markers colored to match stroke

---

## Phase 4: View Modes & Top Bar

### Step 8 — Top Bar component
- Fixed position, z-index 1000
- Dark gradient background (#1e293b → #334155)
- Left: "AVELaunch" (20px, weight 800) + "Sales Funnel" (16px, weight 500)
- Center: 4 view mode tabs (pill-shaped, active = white bg)
- Right: visible stage count + edge count (14px)

### Step 9 — View mode logic
- State: `activeView` — one of "Lead Journey", "HubSpot Setup", "Email Sequences", "Full Detail"
- Lead Journey (default): all 20 stages + entries, subtitle = stage.goal
- HubSpot Setup: all 20 + entries, subtitle = stage.hubspot
- Email Sequences: only stages where sequence !== null, subtitle = sequence + email count
- Full Detail: all 20 + entries, subtitle = stage.trigger
- On view change: filter nodes/edges → re-run dagre layout → update ReactFlow

---

## Phase 5: Interactive Panels

### Step 10 — Floating Detail Card
- Appears top-right on node click, z-index 1000
- 360px wide, max-height 420px with scroll
- Colored header bar (group color) with code + label + type icon
- Body: key/value pairs for all metadata fields
- Closes on ✕ button or clicking the same node again

### Step 11 — Collapsible Table (bottom panel)
- Hidden by default (48px toggle bar)
- Expands to max 40vh
- Columns adapt to active view:
  - Always: Code, Label, Group (colored pill), Trigger, Goal
  - HubSpot/Full: + HubSpot column (monospace)
  - Emails/Full: + Sequence (monospace) + Emails count
- Sticky header row
- z-index 900

### Step 12 — Legend (bottom-left toggle)
- Hidden by default, toggle button "❓ Legend"
- 2-column grid of type icons + labels
- Group color pills below
- Closes with "✕ Close Legend"

---

## Phase 6: Finishing Touches

### Step 13 — Loading screen
- Centered overlay: "AVELaunch Books / Loading Sales Funnel..."
- Remove 500ms after React mounts (useEffect with setTimeout)

### Step 14 — Typography & sizing audit
- Verify all font sizes match the spec table exactly
- Minimum 16px anywhere except specified exceptions (edge labels 13px, badges 11px, etc.)
- Verify all font weights match

### Step 15 — Theme & visual polish
- Background: #f8fafc
- Text colors: #1e293b (primary), #475569 (secondary), #94a3b8 (tertiary)
- Shadows: 0 2px 8px rgba(0,0,0,0.08) on nodes, stronger on floating card
- All styling via inline React style objects (no Tailwind)

---

## Phase 7: Refactoring & Optimization

### Step 16 — Code refactoring
- Extract repeated style objects into shared constants
- Ensure clean separation of data, layout, and rendering logic within the single file
- Remove any dead code or unused variables
- Ensure consistent naming conventions throughout

### Step 17 — Performance optimization
- Verify `React.memo()` on node components
- `useMemo` for layout computation and node/edge arrays
- `useCallback` for all handlers (node click, view change, panel close)
- Ensure dagre only runs when view actually changes (not on every render)

---

## Phase 8: QA & UX QA

### Step 18 — Functional QA
- Verify all 20 stages render with correct data
- Verify all 32 edges connect correctly with proper colors
- Test all 4 view modes switch correctly and re-layout
- Test Email Sequences view filters to only sequence stages
- Test detail card opens/closes correctly for every node
- Test table expands/collapses and shows correct columns per view
- Test legend toggles on/off
- Verify entry nodes (Web Form, Manual Entry) connect to stage 11

### Step 19 — UX QA
- Verify fitView works on initial load
- Test zoom in/out within 0.3–2.0 range
- Verify MiniMap shows correct node colors by group
- Test responsive behavior (scrolling, overflow)
- Verify dark backgrounds (stages 33, 00) use white text
- Verify DEAL badge on stage 43, ⚠ badges on stages 22 and 42
- Check edge label readability at various zoom levels
- Verify loading screen appears and dismisses smoothly
- Test that loop edges (22→21, 42→41) show animated smoothstep

### Step 20 — Cross-browser & CDN verification
- Test the HTML file opens directly in browser (no server needed)
- Verify all CDN imports load correctly
- Test in Chrome and Firefox
- Verify no console errors (especially no duplicate React instance errors)

---

## File Changes Summary
- **New**: `funnel.html` — the complete single-file application
- **Unchanged**: All existing files remain (the Vite app stays as-is for reference)
- After QA passes, the old Vite project files can be cleaned up if desired

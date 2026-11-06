# Cult UI Integration Guide for VedaAI Grader

[Cult UI](https://www.cult-ui.com) has been installed and integrated into this project.

---

## 1. Setup & Configuration

- **Registry Config**: Configured in [`components.json`](file:///c:/Users/dhanush%20gopi/Downloads/veda-ai-grader/components.json) with `@cult-ui`:
  ```json
  "registries": {
    "@cult-ui": "https://www.cult-ui.com/r/{name}.json"
  }
  ```
- **Helper Utilities**: [`lib/utils.ts`](file:///c:/Users/dhanush%20gopi/Downloads/veda-ai-grader/lib/utils.ts) exporting `cn(...)` via `clsx` and `tailwind-merge`.
- **Core Dependencies Installed**:
  - `motion` (Motion / Framer Motion v12+)
  - `clsx` & `tailwind-merge`
  - `class-variance-authority`
  - `@base-ui/react`
  - `lucide-react`

---

## 2. Included Components ([`components/cult/`](file:///c:/Users/dhanush%20gopi/Downloads/veda-ai-grader/components/cult/))

Over 80 animation and interactive components are ready to use immediately:

### Buttons & Interactive
- `HaloButton` (`halo-button.tsx`)
- `CosmicButton` (`cosmic-button.tsx`)
- `GlowButton` (`glow-button.tsx`)
- `NeumorphButton` (`neumorph-button.tsx`)
- `OrganicButton` (`organic-button.tsx`)
- `FamilyButton` (`family-button.tsx`)

### Cards & Layout Containers
- `ShiftCard` (`shift-card.tsx`)
- `MinimalCard` (`minimal-card.tsx`)
- `FoldedCard` (`folded-card.tsx`)
- `TextureCard` (`texture-card.tsx`)
- `HaloCard` (`halo-card.tsx`)
- `OrganicCard` (`organic-card.tsx`)
- `AgentSuggestCardStack` (`agent-suggest-card-stack.tsx`)

### Navigation & Panels
- `Dock` (`dock.tsx`)
- `DynamicIsland` (`dynamic-island.tsx`)
- `FloatingPanel` (`floating-panel.tsx`)
- `ExpandableScreen` (`expandable-screen.tsx`)
- `HaloTabs` (`halo-tabs.tsx`)
- `HaloSegmented` (`halo-segmented.tsx`)
- `SidePanel` (`side-panel.tsx`)

### Text & Animation
- `TextAnimate` (`text-animate.tsx`)
- `Typewriter` (`typewriter.tsx`)
- `RollingNumber` (`rolling-number.tsx`)
- `TextGif` (`text-gif.tsx`)

### Backgrounds & Visual FX
- `BgAnimatedGradient` (`bg-animated-gradient.tsx`)
- `BgAnimatedFractalDotGrid` (`bg-animated-fractal-dot-grid.tsx`)
- `CanvasFractalGrid` (`canvas-fractal-grid.tsx`)
- `DistortedGlass` (`distorted-glass.tsx`)
- `GridBeam` (`grid-beam.tsx`)
- `StripeBgGuides` (`stripe-bg-guides.tsx`)
- `EdgeBlur` (`edge-blur.tsx`)
- `CircuitBoard` (`circuit-board.tsx`)
- `SvgBands` (`svg-bands.tsx`)

### Mockups & Data Displays
- `AppleIphone17Pro` (`apple-iphone-17-pro.tsx`)
- `AppleWatchUltra` (`apple-watch-ultra.tsx`)
- `MacScreen` (`mac-screen.tsx`)
- `MockBrowserWindow` (`mock-browser-window.tsx`)
- `AnalyticsChart` (`analytics-chart.tsx`)
- `CodeBlock` (`code-block.tsx`)

---

## 3. How to Use

### Re-exported from [`components/cult`](file:///c:/Users/dhanush%20gopi/Downloads/veda-ai-grader/components/cult/index.ts):
```tsx
import { ShiftCard, MinimalCard, Dock, HaloButton, DynamicIsland } from "@/components/cult"
```

### Or Modular Direct Import:
```tsx
import { ShiftCard } from "@/components/cult/shift-card"
import { HaloButton } from "@/components/cult/halo-button"
import { MinimalCard } from "@/components/cult/minimal-card"
```

---

## 4. Installing Additional Components via CLI

You can install any component directly using the shadcn CLI:

```bash
npx shadcn@latest add @cult-ui/<component-name>
```

Or by URL:
```bash
npx shadcn@latest add https://www.cult-ui.com/r/<component-name>.json
```

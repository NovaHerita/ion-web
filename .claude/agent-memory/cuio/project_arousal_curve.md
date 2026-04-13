---
name: Arousal-Performance Curve component layout
description: Layout architecture and known overlap fixes for the Yerkes-Dodson curve component
type: project
---

The Arousal-Performance Curve (Yerkes-Dodson) component is in `index.html` (lines ~165-181), styled in `css/styles.css` (search `.arousal-`), and drawn in `js/main.js` (`initArousalCurve`, line ~720).

**Architecture after overlap fix (April 2026):**
- `.arousal-curve` wrapper: `position: relative`, `padding-left: 28px` (Y-axis label space), `padding-bottom: 56px` (zone labels + X-axis label space)
- Canvas: `height: 220px` at desktop, 180/160/140px at breakpoints
- `.arousal-axis-y`: absolutely positioned, `top: calc(220px / 2)` — must be updated at each breakpoint to match canvas height
- `.arousal-axis-x`: `bottom: 0` — sits at very bottom of padding area, below zone labels
- `.arousal-zones`: absolutely positioned flex container, `bottom: 18px` — zone labels are flex children, not individually absolutely positioned
- Canvas `padTop: 28`, `padBottom: 22` — keeps drawn text (Low/High, Peak Performance) clear of HTML element layer
- "Peak Performance" label Y is clamped: `Math.max(12, peakY - (pulseR + 10))`

**Why:** The original layout used three individually absolute-positioned zone divs with hardcoded `left`/`right` values — they collided at narrower widths and with the canvas-drawn Low/High text. Switching to a flex row inside the padding-bottom zone eliminates all collision risk.

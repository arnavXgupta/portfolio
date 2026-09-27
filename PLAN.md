# Portfolio build plan (Community-only ThreeUI)

**Design read:** portfolio for AI/LLM, full-stack and backend hiring. Arnav is introduced as an AI engineer and full-stack engineer ("Full-stack engineer with an AI edge."). The visual language is a dark, cinematic signal lab. Stack: Next.js 16, Tailwind v4, Motion, and vendored ThreeUI Community WebGL/canvas components.

**Theme:** dark only, locked on purpose. Every ThreeUI shader here is authored for a dark canvas.

## Design system
- **Colour:** zinc-cool neutrals (`#09090b` bg, `#ececef` text, `#a1a1aa` muted). One accent, emerald `#3ee0a4`; every shader is retinted to it.
- **Type:** Geist and Geist Mono via `next/font`.
- **Shape:** panels 20px, interactive elements full pill. The dock keeps its own sable radii.
- **Icons and logos:** Phosphor for icons; tech logos from the `simple-icons` package.
- **Copy:** no em-dashes; one CTA label per intent ("See the work", "Get in touch", "Résumé").

## ThreeUI Community pieces (MIT, vendored in `src/threeui/`)
| Component | Where | Change |
|---|---|---|
| Animated Top Dock (sable, first theme) | Navigation | Original spring controller. Items are real section links; the section in view gets the pressed state. |
| Liquid Metal Button | Hero and Contact primary CTAs | Moved out of its iframe into a native renderer, so it is a real, focusable link. |
| Energy Orb | Hero "AI core" | Stack logos orbit it on three rings; data packets brighten it. |
| CRT Background (terminal) | Boot loader | Log rewritten as a build-and-deploy of the stack. |
| Typography Vortex | Stack section | Arnav's stack as the phrase. |
| Emerald Horizon | Contact backdrop | Ported from three.js to raw WebGL. |
| Article-heading decode | Section titles and the "AI edge." accent | Unchanged. |

The hero backdrop follows ThreeUI's Sylva hero: no shader, just soft pools of light and three faint column guides, with a large faded "ARNAV" cropped along the bottom edge.

## Sections
Loader → dock → Hero (kinetic headline, rotating "I ship…" line, orbiting AI core, quiet backdrop with the "ARNAV" wordmark) → logo marquee → Experience (sticky rail, call-pipeline diagram) → Selected work (bento with live visuals, morphing modal) → More builds (index rows, GitHub card preview) → Stack (vortex and skill groups) → Contact (horizon, copy email, particle sign-off).

## Guardrails
- Canvases pause when off-screen, DPR is capped, and the column guides are hidden under 768px.
- `prefers-reduced-motion` gives static frames and skips the loader.

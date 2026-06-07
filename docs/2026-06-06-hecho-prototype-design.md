# Hecho functional prototype — design spec

_Companion to Design Brief v1.1 and Design System v3.0 (in `/reference`). The brief owns the product requirements; this doc owns the prototype's architecture._

## Goal

A single static web app that renders the Hecho mobile app inside a phone frame, with **all 91 screens reachable, every documented state viewable, and all 14 flows clickable end-to-end** on mocked data — plus a persistent **control panel** to drive the app and test how screens react to different variables.

## Decisions

- **Vanilla static SPA** — no framework, no build step. Reuses the Design System CSS verbatim so components match the system with no orphan styles (acceptance #4).
- **GitHub Pages** deploy via Actions from `main`; relative paths + hash routing so it works under `/<repo>/`.
- **Public repo** under `sebzmunoz`.

## Architecture

| Unit | Responsibility |
|---|---|
| `index.html` | Device frame, role-aware header + bottom tab bar, console, overlay roots |
| `styles/system.css` | Design System v3.0 — canonical CSS, copied verbatim |
| `styles/app.css` | Prototype chrome only (phone frame, console, transitions, mask) |
| `src/state.js` | Reactive store; role→capability matrix (§02b); telemetry log (§07-G) |
| `src/router.js` | Hash routing, in-device back stack, deep-link + QR scheme (§07-C) |
| `src/registry.js` | 91 screen IDs → render fn + group + documented states |
| `src/flows.js` | The 14 flows as step sequences (+ walkthrough) |
| `src/data.js` | The mocked world; §07-H contracts (H1 reorder, H2 confidence, H3 staleness) |
| `src/components.js` | Render helpers, privacy mask, overlay system (sheet/modal/drawer/toast) |
| `src/screens/*.js` | 9 modules grouped exactly like §04 |
| `src/panel.js` | Control panel: Flows / Screens / Variables / Telemetry |
| `src/app.js` | Boot, route renderer, tab bar, global action delegation |

## Reactive model

The control panel writes variables to `state.js`; `state.emit()` notifies subscribers. Navigation and variable changes call `nav.refresh()` so the live screen re-renders with the new variable values — that is how a reviewer "tests how a screen reacts to different variables."

Per-screen state is an **ephemeral** flag (`_state`) set by the panel's state switcher; normal navigation clears it, the switcher and flow-branches set it.

## Acceptance-criteria mapping (§10)

1. **91 screens** — `registry.js` (one per ID); Screens panel mirrors §04; aliases (S702, S805) reuse parents.
2. **Every state** — each screen branches on `_state`; the panel offers each screen's documented states; generic loading/error/offline are centrally available.
3. **14 flows clickable** — spec-card actions are real links; the Flow Player walks each flow and surfaces branches.
4. **DS parity** — `system.css` verbatim; screens compose only documented components/tokens.
5. **Walkthrough** — F1 → F2 → F6 → F7 → F12 player.
6. **Accessibility** — focus trap, masked-chip aria, status icon+label+color, 44px targets, reduced motion, rem type.
7. **Telemetry affordances** — §07-G events fire from real taps into the Telemetry log.
8. **Open issues** — tracked in the brief; the resolved contracts (H1–H5, OI-02/03/04/06/08/09/10) are implemented.

## Out of scope (prototype)

All integrations are depicted with mocked data, none live (§PH). No backend, no real auth/payments/POS. P0 flows + walkthrough carry the deepest interactivity; every other screen is fully rendered and wired.

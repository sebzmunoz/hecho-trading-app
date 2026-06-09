# Hecho · Wholesale showroom app

Two surfaces for the **Hecho Trading Co.** wholesale showroom companion app, built to the **Design Brief v1.1** and **Design System v3.0** in [`/reference`](./reference):

- **`/` — Explainer site.** A public overview of the features, the four roles (with a capability comparison chart), how the app works, tiers, and the nine brands.
- **`/app/` — Functional prototype.** A clickable, mocked-data build of **all 91 screens**, **all 14 user flows** (end-to-end with branches), and **every documented state** — wrapped in a phone frame with a live **control panel** for driving the app and testing how each screen reacts to different variables.

> No build step. Pure HTML/CSS/JS. The styling is the canonical Design System CSS, used verbatim.

## Run it

Open through any static server (ES modules need `http://`, not `file://`):

```bash
# pick one
python -m http.server 8080
npx serve .
```

Then visit **http://localhost:8080** (explainer) and **http://localhost:8080/app/** (prototype).

Live build: deployed to **GitHub Pages** on every push to `main` (see `.github/workflows/deploy.yml`).
Explainer: `https://sebzmunoz.github.io/hecho-trading-app/` · Prototype: `…/app/`

## The control panel (side console)

Drive the prototype and watch screens react in real time:

- **Flows** — run any of F1–F14 as a step-by-step player (with the inline branches), or play the 2-minute stakeholder **walkthrough** (F1 → F2 → F6 → F7 → F12).
- **Screens** — jump to any of the 91 screens, grouped exactly like §04 of the brief, with search.
- **Variables** — flip the things that change screen behavior, applied live:
  | Variable | Effect |
  |---|---|
  | Role | Owner / Manager / Member / Rep — submit & approve gating, Rep tab swap (§02b) |
  | Privacy on the floor | on/off + reveal gesture; masks price, stock, spend, credit (§07-D) |
  | POS | Connected / Connecting / Off — live stock ↔ "last counted", reorder math (§07-H) |
  | Exclusivity tier | Standard / Mid / Top — silent discovery filtering + S804 locks (§TM) |
  | Tax-ID | Current / Renews / Expired — submit warning vs. hard hold (F10) |
  | Network | Online / Offline / Slow — persistent bars, sync-pending, disabled submit (§07-A) |
  | Theme | Light / Dark (camera surfaces always dark) |
  | Reduced motion | disables animation |
  | This screen → State | per-screen state switcher (default / loading / empty / error / locked / …) |
- **Telemetry** — a live log of the §07-G events (`scan.result.added_to_cart`, `cart.submitted`, `privacy.reveal`, …) as your taps fire them. Values are never logged, per the contract.

The console collapses (device chrome button, top-left) so you can also view the app exactly as a buyer would. On narrow screens it becomes a slide-over drawer.

## How it maps to the brief

- **91 screens** — `src/registry.js` has one entry per ID; the Screens panel mirrors §04. State-alias frames (S702→S411, S805→S410) reuse the parent layout.
- **14 flows** — `src/flows.js`; the Flow Player walks each one and exposes the branches.
- **Design System parity** — `styles/system.css` is copied verbatim from `reference/design-system.html`; screens compose only documented components/tokens (`styles/app.css` is prototype chrome only — phone frame, console, transitions).
- **Data contracts (§07-H)** — reorder qty (H1), photo-match thresholds (H2), and stock staleness (H3) are implemented in `src/data.js`.
- **Accessibility (§07-E / §SR)** — semantic markup, focus trap in overlays, the canonical masked-chip aria string, status = icon + label + color, 44px targets, reduced-motion honored, rem-based type.
- **Copy deck (§13)** — push bodies, error/empty one-liners, and confirmations use the written strings; voice is first-person, "buyer" / "draft cart", relative time only.

## Project structure

```
index.html              explainer / marketing site (front door)
site.js                 explainer content (features, roles, comparison chart, brands) + reveal
styles/marketing.css    explainer layout (built on Design System tokens)
app/index.html          prototype shell — device frame, role-aware header + tab bar, console
styles/system.css       Design System v3.0 — canonical CSS (verbatim)
styles/app.css          prototype chrome only (frame, console, transitions, masks)
src/
  app.js                boot · route renderer · tab bar · global actions
  router.js             hash routing · back stack · deep-link & QR scheme (§07-C)
  state.js              reactive store · role capabilities · telemetry
  panel.js              the control panel (Flows / Screens / Variables / Telemetry)
  registry.js           91 screens → render fn + group + states
  flows.js              the 14 flows (+ walkthrough)
  data.js               the mocked world + §07-H contracts
  components.js         render helpers · privacy mask · overlays · toasts
  icons.js              line-icon set + HECHO mark
  screens/*.js          9 modules grouped like §04
reference/              the source Design Brief + Design System
docs/                   prototype spec
```

## Scope

Prototype only — every integration (POS, ACH, push, live stock) is **depicted with mocked data**, none live, exactly as §PH (Phasing) intends. The P0 flows (F1, F2, F4, F7, F8) and the walkthrough carry the deepest interactivity; every other screen is fully rendered with its content, states, and flow wiring.

---
Built from the Hecho Design Brief v1.1 and Design System v3.0.

# Hecho · Wholesale showroom app — MVP

Functional prototype of the **Hecho Trading Co.** wholesale showroom companion app — the simplified **MVP** cut, built to the **Design Brief v1.1** and **Design System v3.0** in [`/reference`](./reference): a clickable, mocked-data build of **all 51 screens**, **all 7 user flows** (end-to-end with branches), and **every documented state** — wrapped in a phone frame with a live **control panel** for driving the app and testing how each screen reacts to different variables.

> No build step. Pure HTML/CSS/JS. The styling is the canonical Design System CSS, used verbatim.

## Run it

Open through any static server (ES modules need `http://`, not `file://`):

```bash
# pick one
python -m http.server 8080
npx serve .
```

Then visit **http://localhost:8080**.

Live build: deployed to **GitHub Pages** on every push to `main` (see `.github/workflows/deploy.yml`):
**https://sebzmunoz.github.io/hecho-trading-app/mvp/** — the full prototype lives at **…/flagship/**.

## The control panel (side console)

Drive the prototype and watch screens react in real time:

- **Flows** — run any of the 7 flows as a step-by-step player (with the inline branches), or play the 2-minute stakeholder **walkthrough** (F1 → F2 → F15 → F7).
- **Screens** — jump to any of the 51 screens, grouped exactly like §04 of the brief, with search.
- **Variables** — flip the things that change screen behavior, applied live:
  | Variable | Effect |
  |---|---|
  | Guest mode | Signed in / Guest — guests shop and love freely; account details only at first order |
  | Exclusivity tier | Standard / Mid / Top — silent discovery filtering + S804 locks (§TM) |
  | Network | Online / Offline / Slow — persistent bars, sync-pending, disabled submit (§07-A) |
  | Theme | Light / Dark (camera surfaces always dark) |
  | Reduced motion | disables animation |
  | This screen → State | per-screen state switcher (default / loading / empty / error / locked / …) |
- **Telemetry** — a live log of the §07-G events (`scan.resolved`, `cart.submitted`, `love.added`, …) as your taps fire them. Values are never logged, per the contract.

The console collapses (device chrome button, top-left) so you can also view the app exactly as a buyer would. On narrow screens it becomes a slide-over drawer.

## How it maps to the brief

- **51 screens** — `src/registry.js` has one entry per ID; the Screens panel mirrors §04. State-alias frames (S702→S411) reuse the parent layout.
- **7 flows** — `src/flows.js`; the Flow Player walks each one and exposes the branches. F15 is the love-list flow: love now, decide later.
- **Design System parity** — `styles/system.css` is copied verbatim from `reference/design-system.html`; screens compose only documented components/tokens (`styles/app.css` is prototype chrome only — phone frame, console, transitions).
- **Data contracts (§07-H)** — reorder qty (H1) and stock state (H3) are implemented in `src/data.js`. Scanning is barcode-only and resolves straight to the product page; each brand keeps its own stock counts current.
- **Accessibility (§07-E / §SR)** — semantic markup, focus trap in overlays, status = icon + label + color, 44px targets, reduced-motion honored, rem-based type.
- **Copy deck (§13)** — push bodies, error/empty one-liners, and confirmations use the written strings; voice is first-person, "buyer" / "draft cart", relative time only.

## Project structure

```
index.html              prototype shell — device frame, hub-and-spoke header, console
app/index.html          redirect for old /app/ links
styles/system.css       Design System v3.0 — canonical CSS (verbatim)
styles/app.css          prototype chrome only (frame, console, transitions)
src/
  app.js                boot · route renderer · global actions
  router.js             hash routing · back stack · deep-link scheme (§07-C)
  state.js              reactive store · guest mode · love list · telemetry
  panel.js              the control panel (Flows / Screens / Variables / Telemetry)
  registry.js           51 screens → render fn + group + states
  flows.js              the 7 flows (+ walkthrough)
  data.js               the mocked world + §07-H contracts
  components.js         render helpers · love button · overlays · toasts
  icons.js              line-icon set + HECHO mark
  screens/*.js          9 modules grouped like §04 (incl. love.js)
reference/              the source Design Brief + Design System
docs/                   prototype spec + MVP build prompt
```

## Scope

MVP cut — single-buyer model: no roles or approvals, no POS, no photo recognition, no rep mode, no privacy masking, no tax/compliance hold. Guests shop straight from entry and register at their first order; the love list (zero-commitment capture → explicit bridge into a cart) is the centerpiece flow. Every integration (ACH, push, live stock) is **depicted with mocked data**, none live.

---
Built from the Hecho Design Brief v1.1 and Design System v3.0.

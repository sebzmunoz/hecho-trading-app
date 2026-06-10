# Build the Hecho MVP from this prototype

> Prompt for Claude (Fable 5). Paste as the first message of a new session opened in this repo.

## Mission

Turn the Hecho wholesale showroom prototype in this repo into a production app that current and new Hecho clients use — live as fast as possible. The prototype is the source of truth for flow architecture, screen layouts, and design. Hecho's existing webapp backend is the source of truth for data, auth, roles, and business rules. We are simplifying and unifying what already exists into one app — not inventing anything new.

## What's in this repo

A pure HTML/CSS/JS prototype (no build step) of all 91 screens and 14 flows, with every integration mocked:

- `index.html` — device frame + control panel shell (prototype chrome, not product)
- `styles/system.css` — Design System v3.0, canonical CSS (keep verbatim)
- `src/registry.js` — all 91 screens with IDs, groups, and states (§04 of the brief)
- `src/flows.js` — the 14 flows + walkthrough player (prototype chrome)
- `src/panel.js` — control panel: role/POS/network/tier switchers, telemetry log (prototype chrome)
- `src/data.js` — the entire mocked world + data contracts (§07-H)
- `src/state.js`, `src/router.js`, `src/components.js`, `src/screens/*.js` — store, hash router, render helpers, 9 screen modules
- `reference/` — the Design Brief v1.1 and Design System v3.0 (read these before cutting anything)

## Source-of-truth hierarchy (when things conflict)

1. **Hecho's existing backend** — data model, roles, credentials, permissions, business rules. Never create new roles, permission levels, or business rules. Pull them from the existing system and mirror them.
2. **The prototype** — navigation, flows, layouts, copy, and the design system.
3. **Your judgment** — only for gaps, and note every judgment call in your progress updates.

## Hard constraints

- **Guest-first entry.** A first-time visitor opens the app and is scanning or browsing within seconds — no account creation, no form, no sign-in wall. Auth is deferred to the latest point the backend allows (e.g., order submit, or price reveal if wholesale pricing must be gated — Phase 0 decides which). Converting guest → account asks for the absolute minimum the backend requires (the prototype's magic-link flow, S503–S504, is the model — email only); company details, tax-ID, and everything else are collected later or pulled from existing records. The guest's in-progress cart survives sign-in.
- **Work in a copy.** Confirm the target in Phase 0 (new sibling folder, new repo, or subfolder). Never modify the prototype files — they stay as the design reference.
- **Ship speed beats completeness.** Any feature not backed by an existing backend capability is cut from v1. Record every cut in `DEFERRED.md` with one line on what backend work it needs.
- **Strip all prototype chrome:** the control panel, flow player, phone frame, variable switchers, per-screen state forcing, and the telemetry console. Real runtime states (loading / empty / error / offline) stay.
- **One data layer.** Replace every mock in `src/data.js` with a single API module that talks to the existing backend. No screen reads mocked data in v1.
- **No new frameworks or build tooling** unless the Phase 0 answers require it (e.g., the app must embed in an existing framework). The prototype's vanilla stack is already deployable.

## Phase 0 — Scope interview (do this first; write no code until answered)

Ask all of the following in one batch, then wait:

**A. Backend reality.** What stack and API surface do the current Hecho webapps expose (REST/GraphQL, OpenAPI/docs, staging URL + test credentials, CORS)? How does auth work (sessions, JWT, magic link, SSO)? How are roles and company/user relationships represented?

**B. Capability checklist.** For each, does the current backend support it today — yes / partial / no:
product catalog + images · search · brand pages · carts (multiple? shared?) · order submission · order history + detail · invoices · payments (ACH?) · shipment tracking · returns/RMA · user + company management · invites · roles (Owner/Manager/Member/Rep) · tax-ID / compliance docs · POS integration · push notifications · exclusivity tiers · barcode-to-SKU lookup · photo recognition · anonymous/guest sessions · guest-cart-to-account merge.

**C2. Guest boundaries.** What may an unauthenticated guest see and do: catalog and product detail? wholesale prices? stock levels? build a cart? Where is the hard auth gate — order submit, price reveal, or somewhere else? What is the minimum the backend needs to create or match an account (email magic link only? existing-client email matching?)? If the backend has no guest concept today, what is the cheapest path the backend team will accept (e.g., public read-only catalog endpoints + client-side guest cart)?

**C. Launch definition.** Who uses v1 (existing retailers only? reps too?), how many pilot clients, target date, and what specifically counts as "live."

**D. Platform.** Responsive web / PWA vs. native wrapper; hosting target; whether it lives under an existing Hecho domain.

**E. Continuity.** Anything that must not change for current clients (login method, URLs, terminology).

Treat any "unknown" answer as **no** — cut the feature and flag it.

## Phase 1 — Cut list (the one approval gate)

Map all 9 screen groups in `src/registry.js` against the Phase 0 capability answers and produce a keep / cut / defer table with a one-line reason per group or screen. Two benchmark journeys must survive intact:

1. **Guest:** open app → scan a product (camera or manual SKU) or browse → build a cart — no account, no form, no sign-in wall.
2. **Buyer:** guest cart in hand → lightweight sign-in (existing credentials or email magic link) → submit order → see order status.

This makes the Scan group (S101–S102 viewfinder + result, S106 manual SKU entry, S105/S507 camera permission) part of the essential core, not a nice-to-have — it is the lowest-friction entry into the catalog on a showroom floor. Photo recognition (S103–S104) remains a likely cut. Everything outside these two journeys must justify itself against a confirmed backend capability. Likely cuts to evaluate first (all mocked-only in the prototype): POS integration, ACH payments, push notifications, photo recognition, rep mode, exclusivity tiers, RMA, reports, privacy-on-the-floor. Keep any of these only if Phase 0 confirmed the backend supports it today.

Present the table and wait for approval. After approval, do not relitigate the cut list — changes to it require asking.

## Phase 2 — Build (autonomous after Phase 1 approval)

1. Copy the prototype to the agreed target; remove panel/flows/frame chrome; the root route becomes the real app shell.
2. Delete cut screens from `src/registry.js` and the screen modules; remove dead routes, tabs, and nav entries they leave behind.
3. Create `src/api.js` — every endpoint the app calls, typed against the real backend. If docs exist, match them exactly. If not, emit `API-CONTRACT.md` for the backend team and run against a thin mock that matches that exact contract, behind a single flag.
4. Wire auth and roles from the existing backend; the prototype's role-capability gating (`src/state.js`) becomes a mapping from backend role claims — same gates, real source. Guest is a first-class state in that mapping, not a hacked-in exception: the app boots into it, the cart persists locally (or via the backend's guest session if one exists), and the single auth gate sits exactly where Phase 0 placed it. On sign-in, the guest cart merges into the account.
5. Keep `styles/system.css` verbatim; keep router/state/components patterns unless a kept screen forces a change.
6. Verify every kept flow in the browser end-to-end; no console errors; offline/error/empty states fire from real network conditions, not switches.

## Working agreements

- For minor choices (naming, file layout, equivalent approaches), pick a reasonable option and note it — don't ask. Ask first only for: changing the approved cut list, anything that touches the production backend or live client data, and deleting anything outside the copy.
- Default to silence between actions; post one line when a flow goes live, when you cut something unplanned, or when you're blocked.
- Don't add helpers, abstractions, or error handling for scenarios the kept screens can't reach.

## Definition of done (v1)

- A first-time visitor with no account opens the deployed app and reaches a scan result or product detail within seconds — zero forms, zero sign-in prompts.
- That guest builds a cart, signs in with the minimal flow (existing credentials or email magic link), and their cart survives the transition.
- A real Hecho buyer account submits that cart as an order and sees the resulting order status — all against real backend data.
- All prototype chrome is gone, every kept screen runs on real data, and `DEFERRED.md` + `API-CONTRACT.md` are current.

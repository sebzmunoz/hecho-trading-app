# Love list — design note (2026-06-10)

## The idea

Buyers on a showroom floor want to capture interest *without* starting a purchase.
Add-to-cart asks for decisions (quantity, destination draft, MOQ math); that weight
makes people hesitate to save anything. The love list is the **anti-cart**: capture
is one tap with zero decisions, and commerce only appears at an explicit,
user-initiated bridge.

## Principles

1. **One tap, nothing asked.** No sheet, no quantity, no destination. Heart → toast → done.
2. **Remember the context.** Every love records its source (`scan` / `browse` / `guide`)
   and a relative time, so the list answers "where did I see this?" later.
3. **No totals.** The list never sums prices — a running total *feels* like a cart.
   Per-item wholesale shows (masked under Privacy on the floor like everywhere else).
4. **The bridge is explicit.** "Start a cart" is the only place quantities and MOQs
   enter; loving never implies buying. Items stay loved after converting.
5. **Notes to your future self.** Optional, added later from the list — never at
   capture time.

## Where the heart lives (capture points)

| Surface | Form | Source tag |
|---|---|---|
| Product cards (rails, grids, brand pages) | overlay heart on the image | `browse` |
| Product detail S004 | sticky-bar "Love / Loved" button | `browse` |
| Scan result S102 | heart beside View / Add | `scan` |
| Search results S006 | heart in the row trail | `browse` |
| Style-guide scene popover S002 | heart beside View / Add | `guide` |

## Entry points to the list

- Header heart with live count badge on tab headers (`tabHeaderActions`)
- Carts index S201: "Your love list — N saved with zero commitment" bridge row
- You overview S401: Love list tile
- Toast action ("Open") after every capture

## New screens & flow

- **S010 Love list** (Shop group) — reassurance line, source filter chips, items
  grouped by brand with source + note, per-item heart / options menu
  (add to cart · note · view · remove, with undo), sticky Share + Start a cart.
  States: default / empty / loading / offline.
- **S011 Love list → cart** — the bridge as sheet *and* screen: pick lines
  (all pre-checked), pick a destination draft, gentle multi-brand MOQ hint, confirm.
- **F15 "Love now, decide later"** — added to the flow player and the 2-minute
  walkthrough (F1 → F2 → F15 → F6 → F7 → F12).

## Mechanics

- `state.loved` (persisted) seeded from `data.lovedSeeds`; helpers `isLoved`,
  `toggleLove(pid, src)`, `setLoveNote`, `lovedItems`, `lovedCount`.
- Telemetry per §07-G: `love.added` / `love.removed` / `love.note` / `love.to_cart`
  (value never logged).
- Hearts render as `span[role=button]` so they can sit inside card `<button>`s
  (the HTML parser flattens nested buttons); a keydown handler covers Enter/Space.
- Global click delegation now lets the **nearest** of `data-action` / `data-go` win,
  so controls nested inside navigating cards work (this also fixed the pre-existing
  S006 quick-add nesting trap).
- Inside popovers/sheets the heart swaps in place instead of re-rendering, so the
  overlay stays open.

## Inventory

91 → **93 screens**, 14 → **15 flows**. Design System v3.0 additions: `.love-btn`
(+ `.overlay`), `.love-row`, `.love-src`, `.love-note`, `love-pop` keyframe
(disabled under reduced motion).

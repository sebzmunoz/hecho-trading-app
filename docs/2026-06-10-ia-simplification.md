# IA simplification — design note (2026-06-10)

User-requested simplification pass. The app moves from five tabs to **hub-and-spoke**:
one entry gate, one main screen, everything else a spoke with a back button.

## The new structure

1. **Entry (S502, the cold-open screen)** — Hecho logo, one question:
   *Current customer* → straight to the floor · *New to Hecho* → retailer application
   sheet. Account & settings in the corner; "Sign in another way" keeps the full
   auth path (magic link / SSO / invite) one tap away.
2. **Main screen (S001)** — logo top-left; **love list · carts · account** top-right
   (with live count badges); search bar; one full-width terracotta **Scan a product**
   CTA; the **9-brand wall**; two quiet links (Style guides · Live stock). Nothing else.
3. **Brand page (S003)** — story + MOQ + save, then **Shop by category** cards
   (derived from the brand's actual products, with counts) plus an All-products card.
   `S003?brand=x&cat=y` is the product grid one level down.

## Removed

- **Privacy on the floor** — the eye toggle, all value masking, S210 / S412 / S707,
  flow F12, the panel switcher, and the state fields. `maskField` stays as a
  pass-through so ~25 call sites needed no edits. All prices/stock/spend render plainly.
- **The bottom tab bar** — with Scan promoted to a hero button, Carts to the header,
  and Account to the corner, tabs were three redundant entry points. Orders + Carts
  tiles were added to the account hub (S401) so nothing became unreachable.
  Every non-hub screen now always shows back (falls back to S001 on a cold deep link).

## Judgment calls (and why)

- *Current customer skips sign-in in the prototype.* The entry screen's job is
  routing, not auth; demoing 5 sign-in screens on every open kills the demo. The
  full magic-link flow remains intact behind "Sign in another way" and in flow F1.
- *Categories are derived from products, not the brand's marketing tags* — so a
  category card can never be empty.
- *+7 products* (one extra per under-filled brand) so category cards show real
  counts (2–3 items) instead of a single orphan product.
- *Global "Browse categories" moved into Search* — its natural home now that the
  per-brand path covers most category browsing.
- Walkthrough is now **F1 → F2 → F15 → F6 → F7**; inventory is **90 screens · 14 flows**.

The love list (S010/S011, hearts on every product surface) is unchanged and
re-verified under the new structure.

## Round 2 (same day) — entry rework + more cuts

- **Entry is the logo and two cards, nothing else** (tagline, corner icon, and
  "sign in another way" removed).
- **New to Hecho = shop now.** Guests land on the main screen immediately
  (`state.guest`); the account ask happens exactly once, at order submit
  (registration sheet → "Application sent"). The guest's account screen explains
  the model and offers apply / sign-in.
- **Current customer = email + 6-digit code.** S503 is email-only (SSO and the
  magic-link screens removed; S505 deleted), S504 is the code entry.
- **Cut:** live stock board (S708), style guides (S002 / S705 / S212 + scenes,
  shoppable popovers, flow F13), photo recognition (S103 / S104, flow F3,
  the barcode/photo mode toggle — scanner is barcode-only).
- Ripples: restock notifications now deep-link to the product page; the love
  list loses its "From guides" source; S510 became a simple "you're all set"
  hand-off; F1 rewritten around the new entry.
- Inventory: **83 screens · 12 flows**; walkthrough unchanged (F1 → F2 → F15 → F6 → F7).

## Round 3 (same day) — single-buyer model, scan-to-page, no pop-up adds

- **Scan resolves straight to the product page** (the scan-result half-sheet is gone),
  and **quantity lives inline on the product page** — the add-to-cart sheet is removed
  everywhere; quick-adds (+) add a pack directly with an undoable toast.
- **Guests see price only**: no store stock, no last order, no suggested quantity
  (they have no purchase history); the quantity stepper defaults to pack size.
  Signed-in buyers keep stock / last order / suggested ×N on the product page.
- **Removed wholesale**: sharing (sheets, header icons, cart shares, approvals),
  the map/QR-booth feature, rep mode (screens, role machinery, co-shopping, F11),
  tax-ID + compliance (screens, submit gate, F10), address book, company users +
  invites + roles, connected POS (screens, state, onboarding step), reports.
  "Help & support" became **Contact us** (email + hours).
- The app is now a **single-buyer model**: one account, drafts are simply yours,
  the only approval that exists is Hecho approving a new retailer.
- Inventory: **55 screens · 9 flows** (F3, F5, F10, F11, F12, F13 all retired).

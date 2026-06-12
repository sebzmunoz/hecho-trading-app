import * as C from '../components.js';
import * as D from '../data.js';
import { state } from '../state.js';
import { nav } from '../router.js';
import { icon } from '../icons.js';
import { base } from './shop.js';

function brandGroups(cart) {
  const groups = {};
  cart.lines.forEach(([pid, q]) => {
    const p = D.productById[pid]; if (!p) return;
    (groups[p.brand] ||= []).push([p, q]);
  });
  return groups;
}

// Brand lead times (days) → the relative-time phrases the copy deck mandates.
function leadPhrase(days) {
  if (days <= 7) return 'about a week';
  if (days <= 14) return 'about two weeks';
  if (days <= 21) return 'about three weeks';
  if (days <= 31) return 'about a month';
  return `about ${Math.round(days / 7)} weeks`;
}

// ---- Ship timing (the second delivery decision: ASAP or an exact date) ----
function fmtShipDate(iso) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
function shipWhen(scope) {
  return (state.get('shipWhen') || {})[scope] || { when: 'asap', date: '' };
}
function timingChips(scope, label) {
  const sel = shipWhen(scope);
  const todayISO = new Date().toISOString().slice(0, 10);
  return `
    <div class="row-between"><span class="${label ? '' : 'muted'}" style="font-weight:600">${C.esc(label || 'Ship date')}</span>
      <span class="chip-row" style="padding-bottom:0">
        <button class="chip ${sel.when === 'asap' ? 'is-selected' : ''}" data-action="ship-when" data-scope="${scope}" data-when="asap">ASAP</button>
        <button class="chip ${sel.when === 'date' ? 'is-selected' : ''}" data-action="ship-when" data-scope="${scope}" data-when="date">${sel.when === 'date' && sel.date ? icon('clock', 12) + ' ' + fmtShipDate(sel.date) : 'Pick a date'}</button>
      </span></div>
    ${sel.when === 'date' ? `<input class="input" type="date" data-shipdate="${scope}" value="${sel.date || ''}" min="${todayISO}" aria-label="Ship date${label ? ' for ' + C.esc(label) : ''}" />` : ''}`;
}
function timingSummary(scope) {
  const sel = shipWhen(scope);
  return sel.when === 'date' && sel.date ? `ships ${fmtShipDate(sel.date)}` : 'ships ASAP';
}

export const carts = {
  // S201 Carts index
  S201() {
    if (state.get('_state') === 'empty' || !D.carts.length) {
      return base('Carts', { back: true, headerRight: newCartActions(), body:
        C.emptyState({ ic: 'draft', title: 'No drafts yet', body: 'Scan a shelf or start one by hand.', primary: { label: 'New cart', action: 'new-cart' }, secondary: { label: 'Scan the floor', go: 'S101' } }) });
    }
    const lovedN = state.lovedCount();
    const body = `
      ${lovedN ? C.listRow({ thumbIcon: 'heart', pri: 'Your love list', sec: `${lovedN} saved with zero commitment — start a cart when ready`, trail: `<span class="badge">${lovedN}</span>`, go: 'S010' }) : ''}
      ${C.sectionLabel('Drafts')}
      <div class="stack tight">${D.carts.map(C.draftCard).join('')}</div>
      <button class="btn full" data-action="new-cart">${icon('plus', 16)} New cart</button>`;
    return base('Carts', { back: true, headerRight: newCartActions(), body });
  },

  // S202 Cart detail
  S202(params) {
    const c = D.cartById[params.cart] || D.carts[0];
    const groups = brandGroups(c);
    const conflict = state.get('_state') === 'conflict';
    let total = D.cartTotal(c);
    const body = `
      ${conflict ? C.banner('<b>This draft changed on another device.</b> Resolve before you continue.', { kind: 'caution', ic: 'warning', action: { label: 'Resolve', go: 'S807?cart=' + c.id } }) : ''}
      ${c.sync === 'pending' && state.get('network') !== 'online' ? `<div class="row-between"><span class="sync-tag"><span class="spin-dot"></span>Sync pending</span></div>` : ''}
      ${Object.entries(groups).map(([bid, lines]) => {
        const b = D.brandById[bid];
        const sub = lines.reduce((s, [p, q]) => s + p.wholesale * q, 0);
        const met = sub >= b.moq;
        return `<div class="card" style="max-width:none;gap:var(--s-2)">
          <div class="row-between"><b>${b.name}</b><span class="moq ${met ? '' : 'unmet'}" data-moq="${bid}" data-min="${b.moq}">${met ? icon('check', 12) + 'MOQ met' : icon('warning', 12) + '$' + b.moq + ' · $' + (b.moq - sub) + ' to go'}</span></div>
          ${lines.map(([p, q]) => `<div class="line-row" data-line data-price="${p.wholesale}" data-brand="${bid}">
            <span class="thumb thumb-illo" style="width:40px;height:40px;flex:0 0 auto">${C.illo(p.illo, 22)}</span>
            <span class="body" style="flex:1;min-width:0"><span class="pri">${p.name}</span><span class="sec">${p.variant}</span></span>
            <span class="line-trail">${C.stepper(q, { id: p.id })}<span data-linetotal class="muted" style="font-size:var(--fs-caption)">${C.money(p.wholesale * q)}</span></span></div>`).join('')}
        </div>`;
      }).join('')}
      <div class="card" style="max-width:none"><div class="row-between"><b>Cart total</b><span class="price compact"><span class="v" data-carttotal>${D.usd(total)}</span><span class="currency">USD</span></span></div></div>
      <div class="sticky-actions"><button class="btn full" data-action="submit-cart" data-cart="${c.id}">Continue</button></div>`;
    return base(c.name, { back: true, headerRight: C.hActions([{ icon: 'dots', action: 'cart-menu' }]), body });
  },

  // S203 New cart sheet (also openable as a real sheet)
  S203() {
    return base('New cart', { back: true, body: newCartBody() });
  },

  // S204 Shipping — the one step between cart and order. Everything on a
  // single screen: where it goes, how it ships, what it costs, what happens
  // next. "Place order" lands directly on the new order's detail.
  S204(params) {
    const c = D.cartById[params.cart] || D.carts[0];
    const offline = state.get('network') !== 'online';
    const total = D.cartTotal(c);
    const overLimit = D.account.outstanding + total > D.account.creditLimit;
    const addrId = D.addresses.some((a) => a.id === params.addr) ? params.addr : (D.addresses.find((a) => a.def) || D.addresses[0]).id;
    const cartBrandIds = [...new Set(c.lines.map(([pid]) => D.productById[pid]?.brand).filter(Boolean))];
    const leads = cartBrandIds.map((bid) => D.brandById[bid]?.lead ?? 14);
    const multi = cartBrandIds.length > 1;
    const ship = multi && params.ship === 'split' ? 'split' : 'together';
    // selection re-renders replace the route so Back still returns to the cart in one tap
    const q = (over) => { const p = { addr: addrId, ship, ...over }; return `S204?cart=${c.id}&addr=${p.addr}&ship=${p.ship}`; };

    const addrRows = D.addresses.map((a) => C.listRow({
      thumbIcon: 'pin', pri: C.esc(a.name), sec: `${C.esc(a.line1)} · ${C.esc(a.city)}, ${C.esc(a.region)} ${C.esc(a.postal)}`,
      trail: a.id === addrId ? icon('check', 18) : '', current: a.id === addrId,
      go: q({ addr: a.id }), attrs: 'data-replace',
    })).join('');

    const delivery = multi ? `
      ${C.listRow({ thumbIcon: 'pkg', pri: 'Everything together', sec: `One delivery · lands in ${leadPhrase(Math.max(...leads))}`,
        trail: ship === 'together' ? icon('check', 18) : '', current: ship === 'together', go: q({ ship: 'together' }), attrs: 'data-replace' })}
      ${C.listRow({ thumbIcon: 'truck', pri: 'As each brand is ready', sec: `${cartBrandIds.length} deliveries · first lands in ${leadPhrase(Math.min(...leads))}`,
        trail: ship === 'split' ? icon('check', 18) : '', current: ship === 'split', go: q({ ship: 'split' }), attrs: 'data-replace' })}`
      : C.listRow({ thumbIcon: 'pkg', pri: 'One delivery', sec: `${C.esc(D.brandById[cartBrandIds[0]]?.name || 'Your brand')} ships in ${leadPhrase(leads[0] || 14)}`, trail: icon('check', 18), current: true });

    const freeShip = total >= 500
      ? C.banner('<b>Free shipping.</b> This order clears the $500 minimum.', { ic: 'truck' })
      : C.banner(`<b>Free shipping</b> kicks in over $500 — ${C.money(500 - total)} to go.`, { ic: 'truck' });

    // second decision, per delivery: ASAP or an exact date. Together = one
    // decision for the whole order; split = one per brand.
    const timing = ship === 'together' || !multi
      ? `<div class="card" style="max-width:none;gap:var(--s-2)">${timingChips('all', 'Whole order')}</div>`
      : `<div class="card" style="max-width:none;gap:var(--s-3)">${cartBrandIds.map((bid) => timingChips(bid, D.brandById[bid]?.name || bid)).join('')}</div>`;

    const body = `
      ${offline ? C.banner('You\'re offline — placing an order needs a connection.', { kind: 'caution', ic: 'wifi_off' }) : ''}
      ${C.sectionLabel('Ship to')}
      <div class="stack tight">${addrRows}</div>
      <button class="btn ghost sm full" data-action="add-address">${icon('plus', 16)} Add an address</button>
      ${C.sectionLabel('Delivery')}
      <div class="stack tight">${delivery}</div>
      ${C.sectionLabel('When')}
      ${timing}
      ${freeShip}
      <div class="input-group"><label>Delivery note · optional</label><input class="input" data-shipnote value="${C.esc(state.get('shipNote') || '')}" placeholder="Gate code, dock hours, who signs…" aria-label="Delivery note" /></div>
      <div class="card" style="max-width:none;gap:var(--s-2)">
        <div class="row-between"><b>Order summary</b><span class="muted">${c.lines.length} lines · ${cartBrandIds.length} ${cartBrandIds.length === 1 ? 'brand' : 'brands'}</span></div>
        <div class="row-between"><span class="muted">Goods total</span><span class="price compact"><span class="v">${D.usd(total)}</span><span class="currency">USD</span></span></div>
        <div class="row-between"><span class="muted">Delivery</span><span>${ship === 'together' || !multi ? `One delivery · ${timingSummary('all')}` : `${cartBrandIds.length} deliveries · dates above`}</span></div>
        <div class="row-between"><span class="muted">Shipping</span><span>${total >= 500 ? 'Free' : 'On the invoice'}</span></div>
        <div class="row-between"><span class="muted">Terms</span><span class="pill">${D.account.terms}</span></div>
        ${overLimit ? `<div class="row-between"><span style="color:var(--critical);font-weight:600">${icon('warning', 14)} Over credit limit</span><span class="muted">won't block</span></div>` : ''}
        <p class="muted" style="font-size:var(--fs-nano)">Nothing is charged today — I invoice on your ${D.account.terms} terms once the brands confirm.</p>
      </div>
      <div class="sticky-actions"><button class="btn ghost" data-back>Back to cart</button>
        <button class="btn" data-action="confirm-submit" data-cart="${c.id}" ${offline ? 'aria-disabled="true"' : ''}>Place order</button></div>`;
    return base('Shipping', { back: true, noTabbar: true, eyebrow: c.name, body,
      onMount(root) {
        root.querySelector('[data-shipnote]')?.addEventListener('input', (e) => state.setEphemeral('shipNote', e.target.value));
        root.querySelectorAll('[data-shipdate]').forEach((inp) => inp.addEventListener('change', (e) => {
          const w = { ...(state.get('shipWhen') || {}) };
          w[inp.dataset.shipdate] = { when: 'date', date: e.target.value };
          state.setEphemeral('shipWhen', w);
          nav.refresh();
        }));
      } });
  },

  // S205 Added to cart — the fork after every add: back to the shelf with
  // the scanner, or into the draft. No dead-end toast, no decision debt.
  S205(params) {
    const p = D.productById[params.p] || D.products[0];
    const qty = parseInt(params.qty, 10) || p.pack;
    const c = D.cartById[params.cart] || D.carts[0];
    const b = D.brandById[p.brand];
    const body = `
      <div class="center-col pad-block">${C.successMark()}<h3>Added to ${C.esc(c.name)}</h3>
        <p class="muted">It's in the draft — nothing is ordered yet.</p></div>
      <div class="card" style="max-width:none;gap:var(--s-2)">
        <div class="list-row dense" style="border:0;padding-inline:0">
          <span class="thumb thumb-illo" style="width:40px;height:40px">${C.illo(p.illo, 22)}</span>
          <span class="body"><span class="pri">${C.esc(p.name)} ×${qty}</span><span class="sec">${C.esc(b.name)} · ${C.esc(p.variant)}</span></span>
          <span class="trail">${C.money(p.wholesale * qty)}</span>
        </div>
        <div class="row-between"><span class="muted">Cart total</span><b>${C.money(D.cartTotal(c))}</b></div>
      </div>
      <div class="sticky-actions">
        <button class="btn ghost" data-go="S101">${icon('scan', 16)} Scan another</button>
        <button class="btn" data-go="S202?cart=${c.id}">Go to cart</button>
      </div>`;
    return base('Added to cart', { back: true, body });
  },

  // S207 MOQ-not-met
  S207(params) {
    const bid = 'lavender';
    const b = D.brandById[bid];
    const suggestions = D.productsByBrand(bid).slice(0, 3);
    return base('Hit the minimum', { back: true, body: `
      <div class="card" style="max-width:none">
        <div class="row-between"><b>${b.name}</b><span class="moq unmet">${icon('warning', 12)} $160 to minimum</span></div>
        <p class="muted">Add a few lines you've reordered before, ranked by sell-through — no dead stock.</p>
        ${suggestions.map((p) => `<div class="list-row dense" style="border:0;padding-inline:0"><span class="thumb thumb-illo" style="width:40px;height:40px">${C.illo(p.illo, 22)}</span><span class="body"><span class="pri">${p.name}</span><span class="sec">${C.esc(D.whyString(p))}</span></span><span class="trail"><button class="btn sm" data-action="add-to-cart" data-p="${p.id}">Add</button></span></div>`).join('')}
      </div>
      <button class="btn ghost full" data-go="S003?brand=${bid}">Browse ${b.name}</button>` });
  },
};

// ---- shared bodies (used by screens AND by sheets) ----
export function newCartActions() {
  return C.hActions([{ icon: 'plus', action: 'new-cart', label: 'New cart' }]);
}
export function addAddressBody() {
  return `
    <div class="input-group"><label>Label</label><input class="input" data-f="name" placeholder="Marfa Studio · Pop-up" aria-label="Address label" /></div>
    <div class="input-group"><label>Street</label><input class="input" data-f="line1" placeholder="Street address" aria-label="Street address" /></div>
    <div class="grid-2">
      <div class="input-group"><label>City</label><input class="input" data-f="city" placeholder="Marfa" /></div>
      <div class="input-group"><label>State</label><input class="input" data-f="region" placeholder="TX" /></div>
    </div>
    <div class="input-group"><label>ZIP</label><input class="input" data-f="postal" inputmode="numeric" placeholder="79843" /></div>
    <button class="btn full" data-action="save-address">Save address</button>`;
}
export function newCartBody() {
  return `
    <div class="input-group"><label>Name</label><input class="input" value="Back wall refresh" aria-label="Cart name" /></div>
    ${C.sectionLabel('Start from')}
    <div class="stack tight">
      <button class="list-row" data-action="create-cart" data-tpl="blank"><span class="thumb">${icon('draft', 22)}</span><span class="body"><span class="pri">Blank</span><span class="sec">An empty draft</span></span><span class="trail">${icon('chevron-right', 16)}</span></button>
      <button class="list-row" data-action="create-cart" data-tpl="repeat"><span class="thumb">${icon('refresh', 22)}</span><span class="body"><span class="pri">Repeat last order</span><span class="sec">Order #4790 lines</span></span><span class="trail">${icon('chevron-right', 16)}</span></button>
    </div>`;
}

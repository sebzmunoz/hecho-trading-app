import * as C from '../components.js';
import * as D from '../data.js';
import { state } from '../state.js';
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

export const carts = {
  // S201 Carts index
  S201() {
    if (state.get('_state') === 'empty' || !D.carts.length) {
      return base('Carts', { back: true, headerRight: newCartActions(), body:
        C.emptyState({ ic: 'draft', title: 'No drafts yet', body: 'Scan a shelf or start one by hand.', primary: { label: 'New cart', action: 'new-cart' }, secondary: { label: 'Smart reorder', action: 'smart-reorder' } }) });
    }
    const lovedN = state.lovedCount();
    const body = `
      ${lovedN ? C.listRow({ thumbIcon: 'heart', pri: 'Your love list', sec: `${lovedN} saved with zero commitment — start a cart when ready`, trail: `<span class="badge">${lovedN}</span>`, go: 'S010' }) : ''}
      ${C.sectionLabel('Drafts')}
      <div class="stack tight">${D.carts.map(C.draftCard).join('')}</div>
      <div class="grid-2"><button class="btn ghost" data-action="smart-reorder">${icon('reorder', 16)} Smart reorder</button><button class="btn" data-action="new-cart">${icon('plus', 16)} New cart</button></div>`;
    return base('Carts', { back: true, headerRight: newCartActions(), body });
  },

  // S202 Cart detail
  S202(params) {
    const c = D.cartById[params.cart] || D.carts[0];
    const groups = brandGroups(c);
    const conflict = state.get('_state') === 'conflict';
    let total = D.cartTotal(c);
    const body = `
      ${conflict ? C.banner('<b>This draft changed on another device.</b> Resolve before you submit.', { kind: 'caution', ic: 'warning', action: { label: 'Resolve', go: 'S807?cart=' + c.id } }) : ''}
      ${c.sync === 'pending' && state.get('network') !== 'online' ? `<div class="row-between"><span class="sync-tag"><span class="spin-dot"></span>Sync pending</span></div>` : ''}
      <div class="input-group"><label>Cart name</label><input class="input" value="${C.esc(c.name)}" aria-label="Cart name" /></div>
      ${Object.entries(groups).map(([bid, lines]) => {
        const b = D.brandById[bid];
        const sub = lines.reduce((s, [p, q]) => s + p.wholesale * q, 0);
        const met = sub >= b.moq;
        return `<div class="card" style="max-width:none;gap:var(--s-2)">
          <div class="row-between"><b>${b.name}</b><span class="moq ${met ? '' : 'unmet'}" data-moq="${bid}" data-min="${b.moq}">${met ? icon('check', 12) + 'MOQ met' : icon('warning', 12) + '$' + b.moq + ' · $' + (b.moq - sub) + ' to go'}</span></div>
          ${lines.map(([p, q]) => `<div class="line-row" data-line data-price="${p.wholesale}" data-brand="${bid}">
            <span class="thumb thumb-illo" style="width:40px;height:40px;flex:0 0 auto">${C.illo(p.illo, 22)}</span>
            <span class="body" style="flex:1;min-width:0"><span class="pri">${p.name}</span><span class="sec">${p.variant}${p.map ? ' · MAP' : ''}</span></span>
            <span class="line-trail">${C.stepper(q, { id: p.id })}<span data-linetotal class="muted" style="font-size:var(--fs-caption)">${C.money(p.wholesale * q)}</span></span></div>`).join('')}
        </div>`;
      }).join('')}
      <div class="card" style="max-width:none"><div class="row-between"><b>Cart total</b><span class="price compact"><span class="v" data-carttotal>${D.usd(total)}</span><span class="currency">USD</span></span></div></div>
      <div class="sticky-actions"><button class="btn full" data-action="submit-cart" data-cart="${c.id}">Submit order</button></div>`;
    return base(c.name, { back: true, headerRight: C.hActions([{ icon: 'dots', action: 'cart-menu' }]), body });
  },

  // S203 New cart sheet (also openable as a real sheet)
  S203() {
    return base('New cart', { back: true, body: newCartBody() });
  },

  // S204 Cart submit
  S204(params) {
    const c = D.cartById[params.cart] || D.carts[0];
    const offline = state.get('network') !== 'online';
    const total = D.cartTotal(c);
    const overLimit = D.account.outstanding + total > D.account.creditLimit;
    const body = `
      <div class="card" style="max-width:none">
        <div class="row-between"><span class="muted">Ship to</span></div>
        <b>${D.addresses[0].name}</b><span class="muted">${D.addresses[0].line1}, ${D.addresses[0].city} ${D.addresses[0].region}</span>
      </div>
      <div class="card" style="max-width:none">
        <div class="row-between"><span class="muted">Terms</span><span class="pill">${D.account.terms}</span></div>
        <div class="row-between"><span class="muted">Payment</span><span>Net-30 · override at pay</span></div>
        ${overLimit ? `<div class="row-between"><span class="critical" style="color:var(--critical);font-weight:600">${icon('warning', 14)} Over credit limit</span><span class="muted">won't block</span></div>` : ''}
      </div>
      <div class="card" style="max-width:none"><div class="row-between"><b>Order total</b><span class="price"><span class="v">${D.usd(total)}</span><span class="currency">USD</span></span></div></div>
      ${offline ? C.banner('You\'re offline — Submit needs a connection.', { kind: 'caution', ic: 'wifi_off' }) : ''}
      <div class="sticky-actions"><button class="btn ghost" data-back>Edit lines</button>
        <button class="btn" data-action="confirm-submit" data-cart="${c.id}" ${offline ? 'aria-disabled="true"' : ''}>Submit order</button></div>`;
    return base('Review & submit', { back: true, noTabbar: true, body });
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
  return C.hActions([{ icon: 'reorder', action: 'smart-reorder', label: 'Smart reorder' }, { icon: 'plus', action: 'new-cart', label: 'New cart' }]);
}
export function newCartBody() {
  return `
    <div class="input-group"><label>Name</label><input class="input" value="Back wall refresh" aria-label="Cart name" /></div>
    ${C.sectionLabel('Start from')}
    <div class="stack tight">
      <button class="list-row" data-action="create-cart" data-tpl="blank"><span class="thumb">${icon('draft', 22)}</span><span class="body"><span class="pri">Blank</span><span class="sec">An empty draft</span></span><span class="trail">${icon('chevron-right', 16)}</span></button>
      <button class="list-row" data-action="create-cart" data-tpl="repeat"><span class="thumb">${icon('refresh', 22)}</span><span class="body"><span class="pri">Repeat last order</span><span class="sec">Order #4790 lines</span></span><span class="trail">${icon('chevron-right', 16)}</span></button>
      <button class="list-row" data-action="smart-reorder"><span class="thumb">${icon('sparkle', 22)}</span><span class="body"><span class="pri">Smart reorder</span><span class="sec">Behavior-ranked picks</span></span><span class="trail">${icon('chevron-right', 16)}</span></button>
    </div>`;
}

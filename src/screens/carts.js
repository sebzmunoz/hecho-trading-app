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
    if (state.get('_state') === 'empty') {
      return base('Carts', { tab: 'carts', headerRight: newCartActions(), body:
        C.emptyState({ ic: 'draft', title: 'No drafts yet', body: 'Scan a shelf or start one by hand.', primary: { label: 'New cart', action: 'new-cart' }, secondary: { label: 'Smart reorder', action: 'smart-reorder' } }) });
    }
    const mine = D.carts.filter((c) => c.section === 'mine');
    const shared = D.carts.filter((c) => c.section === 'shared');
    const pending = D.carts.filter((c) => c.section === 'pending');
    const isOwner = state.get('role') === 'owner';
    const lovedN = state.lovedCount();
    const body = `
      ${state.get('network') !== 'online' ? '' : ''}
      ${lovedN ? C.listRow({ thumbIcon: 'heart', pri: 'Your love list', sec: `${lovedN} saved with zero commitment — start a cart when ready`, trail: `<span class="badge">${lovedN}</span>`, go: 'S010' }) : ''}
      ${C.sectionLabel('Mine')}
      <div class="stack tight">${mine.map(C.draftCard).join('')}</div>
      ${C.sectionLabel('Shared with me')}
      <div class="stack tight">${shared.map(C.draftCard).join('')}</div>
      ${isOwner && pending.length ? `${C.sectionLabel('Pending approval')}<div class="stack tight">${pending.map(C.draftCard).join('')}</div>` : ''}
      <div class="grid-2"><button class="btn ghost" data-action="smart-reorder">${icon('reorder', 16)} Smart reorder</button><button class="btn" data-action="new-cart">${icon('plus', 16)} New cart</button></div>`;
    return base('Carts', { tab: 'carts', headerRight: newCartActions(), body });
  },

  // S202 Cart detail
  S202(params) {
    const c = D.cartById[params.cart] || D.carts[0];
    const groups = brandGroups(c);
    const role = state.get('role');
    const conflict = state.get('_state') === 'conflict';
    const repView = role === 'rep';
    let total = D.cartTotal(c);
    const body = `
      ${repView ? C.banner('<b>Editing as rep.</b> Changes are visible to the retailer.', { ic: 'user' }) : ''}
      ${conflict ? C.banner('<b>This draft changed elsewhere.</b> Resolve before you submit.', { kind: 'caution', ic: 'warning', action: { label: 'Resolve', go: 'S807?cart=' + c.id } }) : ''}
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
            <span class="line-trail">${C.stepper(q, { id: p.id })}<span data-linetotal class="muted" style="font-size:var(--fs-caption)">${C.maskField(C.money(p.wholesale * q), 'spend')}</span></span></div>`).join('')}
        </div>`;
      }).join('')}
      <div class="card" style="max-width:none"><div class="row-between"><b>Cart total</b>${C.maskField(`<span class="price compact"><span class="v" data-carttotal>${D.usd(total)}</span><span class="currency">USD</span></span>`, 'spend')}</div></div>
      <div class="sticky-actions">
        <button class="btn ghost" data-action="share-cart" data-cart="${c.id}">${icon('share', 16)} Share</button>
        ${role === 'owner'
          ? `<button class="btn" data-action="submit-cart" data-cart="${c.id}">Submit</button>`
          : (role === 'rep'
            ? `<button class="btn" data-action="add-line">Add a line</button>`
            : `<button class="btn" data-action="share-cart" data-cart="${c.id}">Request approval</button>`)}
      </div>`;
    return base(c.name, { back: true, headerRight: C.hActions([{ icon: 'dots', action: 'cart-menu' }]), body });
  },

  // S203 New cart sheet (also openable as a real sheet)
  S203() {
    return base('New cart', { back: true, body: newCartBody() });
  },

  // S204 Cart submit
  S204(params) {
    const c = D.cartById[params.cart] || D.carts[0];
    const tax = state.get('taxId');
    const offline = state.get('network') !== 'online';
    const total = D.cartTotal(c);
    const overLimit = D.account.outstanding + total > D.account.creditLimit;
    const taxRow = tax === 'expired'
      ? C.banner('<b>Tax ID expired.</b> Resolve to submit.', { kind: 'caution', ic: 'warning', action: { label: 'Resolve', go: 'S409' } })
      : (tax === 'renews' ? C.banner('Tax ID renews soon — this won\'t block your order.', { ic: 'clock' }) : '');
    const body = `
      <div class="card" style="max-width:none">
        <div class="row-between"><span class="muted">Ship to</span><button class="chip" data-go="S403">Edit</button></div>
        <b>${D.addresses[0].name}</b><span class="muted">${D.addresses[0].line1}, ${D.addresses[0].city} ${D.addresses[0].region}</span>
      </div>
      <div class="card" style="max-width:none">
        <div class="row-between"><span class="muted">Terms</span><span class="pill">${D.account.terms}</span></div>
        <div class="row-between"><span class="muted">Payment</span><span>Net-30 · override at pay</span></div>
        ${overLimit ? `<div class="row-between"><span class="critical" style="color:var(--critical);font-weight:600">${icon('warning', 14)} Over credit limit</span><span class="muted">won't block</span></div>` : ''}
      </div>
      <div class="card" style="max-width:none"><div class="row-between"><span class="muted">Tax-ID status</span>${C.statusPill(tax === 'current' ? 'current' : tax)}</div></div>
      ${taxRow}
      <div class="card" style="max-width:none"><div class="row-between"><b>Order total</b><span class="price"><span class="v">${D.usd(total)}</span><span class="currency">USD</span></span></div></div>
      ${offline ? C.banner('You\'re offline — Submit needs a connection.', { kind: 'caution', ic: 'wifi_off' }) : ''}
      <div class="sticky-actions"><button class="btn ghost" data-back>Edit lines</button>
        <button class="btn" data-action="confirm-submit" data-cart="${c.id}" ${offline ? 'aria-disabled="true"' : ''}>Submit order</button></div>`;
    return base('Review & submit', { back: true, noTabbar: true, body });
  },

  // S205 Cart share sheet
  S205() { return base('Share draft', { back: true, body: shareBody() }); },

  // S206 Share confirmation
  S206() {
    return base('Shared', { back: true, body: `
      <div class="center-col pad-block">${C.successMark()}<h3>Sent</h3><p class="muted">I sent the draft to Priya N. with “Approve to submit”. You'll see status here.</p></div>
      <div class="card" style="max-width:none"><div class="drawer-row row-between" style="padding:var(--s-2) 0"><span class="muted">Delivery</span><b>Delivered</b></div><div class="row-between" style="padding:var(--s-2) 0"><span class="muted">Status</span>${C.statusPill('pending', 'Awaiting review')}</div></div>
      <button class="btn ghost full" data-action="revoke">Revoke share</button>
      <button class="btn full" data-go="S201">Done</button>` });
  },

  // S207 MOQ-not-met
  S207(params) {
    const c = D.cartById[params.cart] || D.carts[0];
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

  // S208 Approval inbox (owner)
  S208() {
    const pending = D.carts.filter((c) => c.section === 'pending' || c.awaiting);
    if (!pending.length || state.get('_state') === 'empty') {
      return base('Approvals', { back: true, body: C.emptyState({ ic: 'check', title: 'Nothing to approve', body: 'Drafts your team sends for sign-off show up here.' }) });
    }
    return base('Approvals', { back: true, body: `
      ${C.sectionLabel('Awaiting your sign-off')}
      <div class="stack tight">${pending.map((c) => C.listRow({ thumbIcon: 'draft', pri: c.name, sec: `${c.author} · ${c.lastEdited}`, trail: C.statusPill('pending', 'Review'), go: `S209?cart=${c.id}` })).join('')}</div>` });
  },

  // S209 Approval review (owner)
  S209(params) {
    const c = D.cartById[params.cart] || D.carts.find((x) => x.section === 'pending') || D.carts[0];
    const total = D.cartTotal(c);
    const groups = brandGroups(c);
    return base('Review draft', { back: true, noTabbar: true, body: `
      <div class="card" style="max-width:none"><div class="row-between"><b>${c.name}</b><span class="muted">${c.author}</span></div><span class="muted">${D.cartBrandCount(c)} brands · ${C.money(total)}</span></div>
      ${Object.entries(groups).map(([bid, lines]) => `<div class="card" style="max-width:none;gap:var(--s-2)"><b>${D.brandById[bid].name}</b>${lines.map(([p, q]) => `<div class="row-between"><span>${p.name} ×${q}</span><span class="muted">${C.money(p.wholesale * q)}</span></div>`).join('')}</div>`).join('')}
      <div class="sticky-actions" style="flex-wrap:wrap">
        <button class="btn ghost sm" data-action="send-back">Send back</button>
        <button class="btn ghost sm" data-go="S202?cart=${c.id}">Edit & own</button>
        <button class="btn" data-action="approve-submit" data-cart="${c.id}">Approve</button></div>` });
  },

  // S211 Add to cart (sheet, also screen)
  S211(params) { return base('Add to cart', { back: true, body: addToCartBody(params.p || 'p-throw') }); },
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
function shareRecipient(initials, name, role, canGrant, dark) {
  return `<div class="share-rec">
    <label class="choice" style="margin:0"><input type="checkbox" data-share-check /><span class="box"></span></label>
    <span class="avatar sm ${dark ? 'dark' : ''}">${initials}</span>
    <span class="body" style="display:flex;flex-direction:column"><span class="pri">${C.esc(name)}</span><span class="sec">${C.esc(role)}</span></span>
    <select class="select share-perm" aria-label="Permission for ${C.esc(name)}">
      <option value="edit">Can edit</option>
      <option value="approve" ${canGrant ? '' : 'disabled'}>Approve to submit${canGrant ? '' : ' (owners)'}</option>
    </select>
  </div>`;
}
export function shareBody() {
  const canGrant = state.get('role') === 'owner';
  return `
    ${C.sectionLabel('Send to — pick one or more')}
    <div class="stack tight">
      ${D.companyUsers.filter((u) => !u.self).map((u) => shareRecipient(u.initials, u.name, u.role, canGrant)).join('')}
      ${shareRecipient('DO', D.account.rep, 'Hecho rep', canGrant, true)}
    </div>
    <div class="input-group"><label>Note</label><textarea class="textarea" placeholder="Optional note"></textarea></div>
    <button class="btn full" data-action="send-share">Send to selected</button>`;
}
export function addToCartBody(pid) {
  const p = D.productById[pid] || D.products[0];
  const b = D.brandById[p.brand];
  const rec = D.recommendedQty(p, state.get('pos') === 'connected') || 12;
  return `
    <div class="card" style="max-width:none;gap:var(--s-3)" data-line data-price="${p.wholesale}">
      <div style="display:flex;gap:var(--s-3);align-items:center">
        <span class="thumb thumb-illo" style="width:48px;height:48px;border-radius:var(--r-2);flex:0 0 auto">${C.illo(p.illo, 28)}</span>
        <div style="flex:1;min-width:0"><div style="font-weight:600;line-height:1.25">${p.name}</div><div class="muted" style="font-size:var(--fs-caption)">${b.name} · ${p.variant}</div></div>
        ${C.pricePair(p, { compact: true, masked: false })}
      </div>
      <div class="hairline"></div>
      <div class="row-between"><span class="muted">Quantity${rec ? ' · recommended' : ''}</span>${C.stepper(rec, { id: pid })}</div>
      <div class="row-between"><span class="muted">Line subtotal</span><b style="font-feature-settings:'tnum' 1">$<span data-carttotal>${(p.wholesale * rec).toLocaleString('en-US')}</span></b></div>
    </div>
    ${C.sectionLabel('Add to')}
    <div class="chip-row" data-chipgroup><button class="chip is-selected">Back wall refresh</button><button class="chip">Holiday 2026</button><button class="chip" data-action="new-cart">+ New draft</button></div>
    <button class="btn full" data-action="confirm-add" data-p="${pid}">Confirm</button>`;
}

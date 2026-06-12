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

// 'Wed, Jun 24' from an <input type=date> value (noon avoids TZ day-shift).
function fmtShipDate(iso) {
  if (!iso) return '';
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
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
    const isOwner = state.get('role') === 'admin';
    const body = `
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
      ${Object.entries(groups).map(([bid, lines]) => {
        const b = D.brandById[bid];
        const sub = lines.reduce((s, [p, q]) => s + p.wholesale * q, 0);
        const met = sub >= b.moq;
        return `<div class="card" style="max-width:none;gap:var(--s-2)">
          <div class="row-between"><b>${b.name}</b><span class="moq ${met ? '' : 'unmet'}" data-moq="${bid}" data-min="${b.moq}">${met ? icon('check', 12) + 'MOQ met' : icon('warning', 12) + '$' + b.moq + ' · $' + (b.moq - sub) + ' to go'}</span></div>
          ${lines.map(([p, q]) => `<div class="line-row" data-line data-price="${p.wholesale}" data-brand="${bid}">
            <span class="thumb thumb-illo" style="width:40px;height:40px;flex:0 0 auto">${C.illo(p.illo, 22)}</span>
            <span class="body" style="flex:1;min-width:0"><span class="pri">${p.name}</span><span class="sec">${p.variant}</span></span>
            <span class="line-trail">${C.stepper(q, { id: p.id })}<span data-linetotal class="muted" style="font-size:var(--fs-caption)">${C.maskField(C.money(p.wholesale * q), 'spend')}</span></span></div>`).join('')}
        </div>`;
      }).join('')}
      <div class="card" style="max-width:none"><div class="row-between"><b>Cart total</b>${C.maskField(`<span class="price compact"><span class="v" data-carttotal>${D.usd(total)}</span><span class="currency">USD</span></span>`, 'spend')}</div></div>
      <div class="sticky-actions">
        <button class="btn ghost" data-action="share-cart" data-cart="${c.id}">${icon('share', 16)} Share</button>
        ${role === 'rep'
          ? `<button class="btn" data-action="add-line">Add a line</button>`
          : `<button class="btn" data-action="submit-cart" data-cart="${c.id}">Submit</button>`}
      </div>`;
    return base(c.name, { back: true, headerRight: C.hActions([{ icon: 'dots', action: 'cart-menu' }]), body });
  },

  // S203 New cart sheet (also openable as a real sheet)
  S203() {
    return base('New cart', { back: true, body: newCartBody() });
  },

  // S204 Cart submit — per-brand shipping control + free-shipping note live here.
  S204(params) {
    const c = D.cartById[params.cart] || D.carts[0];
    const tax = state.get('taxId');
    const caps = state.caps();
    const offline = state.get('network') !== 'online';
    const total = D.cartTotal(c);
    const overLimit = D.account.outstanding + total > D.account.creditLimit;
    const taxRow = tax === 'expired'
      ? C.banner('<b>Tax ID expired.</b> Resolve to submit.', { kind: 'caution', ic: 'warning', action: { label: 'Resolve', go: 'S409' } })
      : (tax === 'renews' ? C.banner('Tax ID renews soon — this won\'t block your order.', { ic: 'clock' }) : '');

    // Shipping: brands ready at different times. 'split' ships each brand as
    // it's ready (multiple deliveries); 'together' holds for the slowest one.
    const ship = params.ship === 'together' ? 'together' : 'split';
    const cartBrands = [...new Set(c.lines.map(([pid]) => D.productById[pid]?.brand))].filter(Boolean).map((bid) => D.brandById[bid]);
    const weeks = (d) => `~${Math.max(1, Math.round(d / 7))} wk`;
    const slowest = cartBrands.reduce((a, b) => (b.lead > a.lead ? b : a), cartBrands[0]);
    const shipChip = (v, l) => `<button class="chip ${ship === v ? 'is-selected' : ''}" data-go="S204?cart=${c.id}&ship=${v}">${l}</button>`;
    const shipCard = `
      <div class="card" style="max-width:none;gap:var(--s-2)">
        <div class="row-between"><b>Shipping</b><span class="muted" style="font-size:var(--fs-nano)">${cartBrands.length} brands · ${cartBrands.length > 1 ? (ship === 'split' ? cartBrands.length + ' deliveries' : 'one delivery') : 'one delivery'}</span></div>
        <div class="chip-row">${shipChip('split', 'As each brand is ready')}${shipChip('together', 'Everything together')}</div>
        ${ship === 'split'
          ? cartBrands.map((b) => `<div class="row-between"><span class="muted">${C.esc(b.name)}</span><span>${icon('truck', 14)} ${weeks(b.lead)}</span></div>`).join('')
          : `<div class="row-between"><span class="muted">One delivery, when everything is ready</span><span>${icon('truck', 14)} ${weeks(slowest.lead)}</span></div>
             <p class="muted" style="font-size:var(--fs-nano)">Waits for ${C.esc(slowest.name)} — the slowest brand in this order.</p>`}
      </div>`;

    // Ship date: ASAP or an exact future date — one date for the whole
    // order, or each brand on its own. Persisted in state.shipDates.
    const sd = state.get('shipDates') || { mode: 'all', all: { when: 'asap', date: '' }, brands: {} };
    const sdMode = sd.mode === 'per' ? 'per' : 'all';
    const todayISO = new Date().toISOString().slice(0, 10);
    const whenChips = (scope, sel) => `
      <div class="chip-row">
        <button class="chip ${sel.when !== 'date' ? 'is-selected' : ''}" data-action="ship-when" data-scope="${scope}" data-when="asap">ASAP</button>
        <button class="chip ${sel.when === 'date' ? 'is-selected' : ''}" data-action="ship-when" data-scope="${scope}" data-when="date">${sel.when === 'date' && sel.date ? icon('clock', 12) + ' ' + fmtShipDate(sel.date) : 'Pick a date'}</button>
      </div>
      ${sel.when === 'date' ? `<input class="input" type="date" data-shipdate="${scope}" value="${sel.date || ''}" min="${todayISO}" aria-label="Ship date${scope === 'all' ? '' : ' for ' + C.esc(D.brandById[scope]?.name || scope)}" />` : ''}`;
    let sdSummary;
    if (sdMode === 'all') sdSummary = sd.all?.when === 'date' && sd.all.date ? 'ships ' + fmtShipDate(sd.all.date) : 'ships ASAP';
    else {
      const dated = cartBrands.filter((b) => sd.brands?.[b.id]?.when === 'date' && sd.brands[b.id].date).length;
      sdSummary = dated ? `${dated} of ${cartBrands.length} scheduled` : 'all ASAP';
    }
    const shipDateCard = `
      <div class="card" style="max-width:none;gap:var(--s-2)">
        <div class="row-between"><b>Ship date</b><span class="muted" style="font-size:var(--fs-nano)">${sdSummary}</span></div>
        <div class="chip-row">
          <button class="chip ${sdMode === 'all' ? 'is-selected' : ''}" data-action="ship-mode" data-mode="all">All brands at once</button>
          <button class="chip ${sdMode === 'per' ? 'is-selected' : ''}" data-action="ship-mode" data-mode="per">Per brand</button>
        </div>
        ${sdMode === 'all'
          ? whenChips('all', sd.all || { when: 'asap', date: '' })
          : cartBrands.map((b) => {
              const sel = (sd.brands && sd.brands[b.id]) || { when: 'asap', date: '' };
              return `<div class="hairline"></div>
                <div class="row-between"><b style="font-size:var(--fs-caption)">${C.esc(b.name)}</b><span class="muted" style="font-size:var(--fs-nano)">${weeks(b.lead)} lead</span></div>
                ${whenChips(b.id, sel)}`;
            }).join('')}
        <p class="muted" style="font-size:var(--fs-nano)">${sdMode === 'all' ? 'One ship date for the whole order — ASAP, or exactly when you pick.' : 'Each brand ships ASAP or on its own exact date.'}</p>
      </div>`;

    // Free-shipping note: applied over $500, otherwise show the path to it.
    const freeShip = total >= 500
      ? C.banner(`<b>Free shipping applied.</b> This order clears the $500 minimum.`, { ic: 'truck' })
      : C.banner(`<b>Free shipping</b> kicks in on orders over $500 — ${C.money(500 - total)} to go. It's also free on every order after your second.`, { ic: 'truck' });

    // Staff budget: instant submit up to what's left of the admin-set budget.
    // Over it, only the overage waits on approval — never the whole sale.
    let budgetCard = '';
    let inBudgetNow = 0, overage = 0, budgetLeft = 0, withinBudget = true;
    if (caps.submit === 'budget') {
      const me = D.companyUsers.find((u) => u.name === D.staffSelf) || {};
      const budget = (state.get('budgets') || {})[me.name] ?? me.budget ?? 0;
      const spent = me.spent || 0;
      budgetLeft = Math.max(0, budget - spent);
      withinBudget = total <= budgetLeft;
      inBudgetNow = Math.min(total, budgetLeft);
      overage = Math.max(0, total - budgetLeft);
      const pct = budget ? Math.min(100, Math.round(((spent + inBudgetNow) / budget) * 100)) : 100;
      budgetCard = `
        <div class="card" style="max-width:none;gap:var(--s-2)">
          <div class="row-between"><b>Your budget</b><span class="muted" style="font-size:var(--fs-nano)">set by ${C.esc(D.account.owner.split(' ')[0])} · ${C.money(budget)}/mo</span></div>
          <div class="row-between"><span class="muted">Left this month</span>${C.maskField(`<b>${C.money(budgetLeft)}</b>`, 'spend')}</div>
          <div style="height:6px;border-radius:999px;background:var(--surface-dim);overflow:hidden" aria-hidden="true"><div style="height:100%;width:${pct}%;background:${withinBudget ? 'var(--accent)' : 'var(--critical)'}"></div></div>
          ${withinBudget
            ? `<p class="muted" style="font-size:var(--fs-nano)">${icon('check', 12)} This order fits your budget — it submits instantly, no approval needed.</p>`
            : `<div class="row-between"><span class="muted">Submits now (in budget)</span>${C.maskField(`<b>${C.money(inBudgetNow)}</b>`, 'spend')}</div>
               <div class="row-between"><span class="muted">Needs approval (overage)</span>${C.maskField(`<b style="color:var(--critical)">${C.money(overage)}</b>`, 'spend')}</div>
               <p class="muted" style="font-size:var(--fs-nano)">Only the ${C.money(overage)} over budget waits for sign-off. The in-budget part goes through on the spot, so the sale never waits on a person.</p>`}
        </div>`;
    }

    const body = `
      <div class="card" style="max-width:none">
        <div class="row-between"><span class="muted">Ship to</span><button class="chip" data-go="S403">Edit</button></div>
        <b>${D.addresses[0].name}</b><span class="muted">${D.addresses[0].line1}, ${D.addresses[0].city} ${D.addresses[0].region}</span>
      </div>
      ${shipCard}
      ${shipDateCard}
      <div class="card" style="max-width:none">
        <div class="row-between"><span class="muted">Terms</span><span class="pill">${D.account.terms}</span></div>
        <div class="row-between"><span class="muted">Payment</span><span>Net-30 · override at pay</span></div>
        ${overLimit ? `<div class="row-between"><span class="critical" style="color:var(--critical);font-weight:600">${icon('warning', 14)} Over credit limit</span><span class="muted">won't block</span></div>` : ''}
      </div>
      <div class="card" style="max-width:none"><div class="row-between"><span class="muted">Tax-ID status</span>${C.statusPill(tax === 'current' ? 'current' : tax)}</div></div>
      ${taxRow}
      ${freeShip}
      ${budgetCard}
      <div class="card" style="max-width:none"><div class="row-between"><b>Order total</b><span class="price"><span class="v">${D.usd(total)}</span><span class="currency">USD</span></span></div></div>
      ${offline ? C.banner('You\'re offline — Submit needs a connection.', { kind: 'caution', ic: 'wifi_off' }) : ''}
      ${caps.submit === 'grant' ? C.banner('<b>Rep view.</b> Submitting on the retailer\'s behalf needs their per-account grant (§02b).', { ic: 'user' }) : ''}
      ${caps.submit === 'budget' && budgetLeft === 0 ? C.banner('<b>Your budget is used up this month.</b> Send this for approval and the admin takes it from here.', { ic: 'user' }) : ''}
      <div class="sticky-actions"><button class="btn ghost" data-back>Edit lines</button>
        ${caps.submit === true
          ? `<button class="btn" data-action="confirm-submit" data-cart="${c.id}" ${offline ? 'aria-disabled="true"' : ''}>Submit order</button>`
          : caps.submit === 'grant'
            ? `<button class="btn" aria-disabled="true">Needs retailer grant</button>`
            : budgetLeft === 0
              ? `<button class="btn" data-action="share-cart" data-cart="${c.id}">Request approval</button>`
              : withinBudget
                ? `<button class="btn" data-action="confirm-submit" data-cart="${c.id}" ${offline ? 'aria-disabled="true"' : ''}>Submit order</button>`
                : `<button class="btn" data-action="split-submit" data-cart="${c.id}" data-now="${C.money(inBudgetNow)}" data-over="${C.money(overage)}" ${offline ? 'aria-disabled="true"' : ''}>Submit ${C.money(inBudgetNow)} now</button>`}</div>`;
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
    if (!state.caps().approve) {
      return base('Approvals', { back: true, body: C.emptyState({ ic: 'check', title: 'Approvals are the admin\'s queue', body: 'Drafts you send for sign-off show their status in Carts.', primary: { label: 'Back to Carts', go: 'S201' } }) });
    }
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
      <div class="card" style="max-width:none"><div class="row-between"><b>${c.name}</b><span class="muted">${c.author}</span></div><span class="muted">${D.cartBrandCount(c)} brands · ${C.maskField(C.money(total), 'spend')}</span></div>
      ${Object.entries(groups).map(([bid, lines]) => `<div class="card" style="max-width:none;gap:var(--s-2)"><b>${D.brandById[bid].name}</b>${lines.map(([p, q]) => `<div class="row-between"><span>${p.name} ×${q}</span><span class="muted">${C.maskField(C.money(p.wholesale * q), 'spend')}</span></div>`).join('')}</div>`).join('')}
      <div class="sticky-actions" style="flex-wrap:wrap">
        <button class="btn ghost sm" data-action="send-back">Send back</button>
        <button class="btn ghost sm" data-go="S202?cart=${c.id}">Edit & own</button>
        ${state.caps().approve
          ? `<button class="btn" data-action="approve-submit" data-cart="${c.id}">Approve</button>`
          : `<button class="btn" aria-disabled="true">Admin only</button>`}</div>` });
  },

  // S211 Add to cart (sheet, also screen)
  S211(params) { return base('Add to cart', { back: true, body: addToCartBody(params.p || 'p-throw') }); },

  // S212 Shop the look (sheet, also screen)
  S212(params) { return base('Shop the look', { back: true, body: shopLookBody(params.guide || 'sg-table') }); },
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
      <option value="approve" ${canGrant ? '' : 'disabled'}>Approve to submit${canGrant ? '' : ' (admins)'}</option>
    </select>
  </div>`;
}
export function shareBody() {
  const canGrant = state.get('role') === 'admin';
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
  const rec = D.recommendedQty(p) || 12;
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
export function shopLookBody(gid) {
  const g = D.styleGuideById[gid] || D.styleGuides[0];
  const lines = g.lines.map((id) => D.productById[id]).filter(Boolean);
  return `
    <p class="muted">${g.title} — pick or skip each line, then add the set.</p>
    <div class="stack tight">${lines.map((p) => `<label class="list-row dense" style="cursor:pointer"><span class="thumb thumb-illo" style="width:40px;height:40px">${C.illo(p.illo, 22)}</span><span class="body"><span class="pri">${p.name}</span><span class="sec">${D.brandById[p.brand].name} · $${p.wholesale}</span></span><span class="trail"><span class="choice"><input type="checkbox" checked /><span class="box"></span></span></span></label>`).join('')}</div>
    <button class="btn full" data-action="confirm-look" data-guide="${g.id}">Add ${lines.length} items</button>`;
}

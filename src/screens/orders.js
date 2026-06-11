import * as C from '../components.js';
import * as D from '../data.js';
import { state } from '../state.js';
import { icon } from '../icons.js';
import { base } from './shop.js';

export const orders = {
  // S301 Orders index + wallet
  S301(params) {
    if (state.get('guest')) {
      return base('Orders', { back: true, body: C.emptyState({ ic: 'bag', title: 'Orders come with an account', body: 'Browse and build carts freely as a guest — your orders and Net-30 wallet appear once your store is set up.', primary: { label: 'Apply to become a retailer', action: 'register' }, secondary: { label: 'I already have an account', go: 'S503' } }) });
    }
    if (state.get('_state') === 'empty') {
      return base('Orders', { tab: 'orders', headerRight: C.tabHeaderActions(), body: C.emptyState({ ic: 'bag', title: 'No orders yet', body: 'When you submit a draft, it lands here with live status.' , primary: { label: 'Build a cart', go: 'S201' } }) });
    }
    const seg = params.seg || 'all';
    const list = seg === 'all' ? D.orders : D.orders.filter((o) => o.status === seg);
    const pastDue = D.orders.some((o) => o.pastDue);
    const wallet = `<div class="card order" style="max-width:none;border-color:${pastDue ? 'var(--critical)' : 'var(--line)'}">
      <div class="row-between"><span class="id">Net-${D.account.terms.replace('Net-', '')} wallet</span>${pastDue ? C.statusPill('pastdue') : ''}</div>
      <div class="row-between"><span class="muted">Outstanding</span>${C.maskField(`<b>${C.money(D.account.outstanding)}</b>`, 'credit')}</div>
      <div class="row-between"><span class="muted">Headroom</span>${C.maskField(`<b>${C.money(D.account.creditLimit - D.account.outstanding)}</b>`, 'credit')}</div>
      <div class="row-between"><span class="muted">Oldest due</span><span>INV-4602 · past due 8 days</span></div>
      <button class="btn full" data-go="S304?order=4602">Pay oldest</button></div>`;
    const segs = [['all', 'All'], ['open', 'Open'], ['fulfillment', 'Fulfillment'], ['shipped', 'Shipped'], ['delivered', 'Delivered'], ['settled', 'Settled']];
    const body = `
      ${wallet}
      <div class="chip-row">${segs.map(([v, l]) => `<button class="chip ${seg === v ? 'is-selected' : ''}" data-go="S301?seg=${v}">${l}</button>`).join('')}</div>
      <div class="stack tight">${list.map(C.orderCard).join('')}</div>`;
    return base('Orders', { tab: 'orders', headerRight: C.tabHeaderActions(), body });
  },

  // S302 Order detail
  S302(params) {
    const o = D.orderById[params.order] || D.orders[0];
    const idx = D.lifecycleIndex[o.status];
    const caps = { 0: 'Brands notified.', 1: 'Picking your lines.', 2: 'On the way.', 3: 'Left at your door.', 4: 'Closed and settled.' };
    const ctx = o.status === 'open' ? `<button class="btn" data-go="S304?order=${o.id}">Pay invoice</button>`
      : o.status === 'shipped' ? `<button class="btn" data-go="S306?order=${o.id}">Track</button>`
      : o.status === 'delivered' ? `<button class="btn" data-action="create-cart" data-tpl="repeat">Reorder</button>`
      : `<button class="btn ghost" data-go="S303?order=${o.id}">View invoice</button>`;
    const body = `
      <div class="row-between"><h3>#${o.id}</h3>${C.maskField(`<span class="price"><span class="v">${D.usd(o.total)}</span><span class="currency">USD</span></span>`, 'spend')}</div>
      ${o.pastDue ? C.banner('<b>Past due by 8 days.</b> Pay to keep terms clean.', { kind: 'caution', ic: 'warning', action: { label: 'Pay', go: `S304?order=${o.id}` } }) : ''}
      <div class="card" style="max-width:none">${C.timeline(D.lifecycleSteps, idx, caps)}</div>
      ${o.status === 'shipped' || o.status === 'delivered' ? C.listRow({ thumbIcon: 'truck', pri: o.carrier || 'Carrier', sec: `${o.tracking} · ${o.eta}`, go: `S306?order=${o.id}` }) : ''}
      ${C.sectionLabel('Lines')}
      <div class="stack tight">${o.lines.map(([pid, q]) => { const p = D.productById[pid]; return `<div class="list-row dense"><span class="thumb thumb-illo" style="width:40px;height:40px">${C.illo(p.illo, 22)}</span><span class="body"><span class="pri">${p.name} ×${q}</span><span class="sec">${D.brandById[p.brand].name}</span></span><span class="trail">${C.maskField(C.money(p.wholesale * q), 'spend')}</span></div>`; }).join('')}</div>
      <button class="btn ghost sm full" data-go="S303?order=${o.id}">${icon('receipt', 16)} Invoice</button>
      <div class="sticky-actions">${ctx}<button class="btn ghost" data-go="S704">Contact us</button></div>`;
    return base(`Order #${o.id}`, { back: true, headerRight: C.hActions([{ icon: 'dots', action: 'order-menu' }]), body });
  },

  // S303 Invoice viewer
  S303(params) {
    const o = D.orderById[params.order] || D.orders[0];
    const body = `
      <div class="photo-frame r-4-5" style="background:var(--surface)"><div style="position:absolute;inset:0;padding:var(--s-5);display:flex;flex-direction:column;gap:var(--s-3)">
        <div class="row-between"><b style="font-size:var(--fs-h4)">INVOICE</b><span class="muted">${o.invoice}</span></div>
        <div class="hairline"></div>
        ${o.lines.map(([pid, q]) => { const p = D.productById[pid]; return `<div class="row-between" style="font-size:var(--fs-caption)"><span>${p.name} ×${q}</span><span>${C.money(p.wholesale * q)}</span></div>`; }).join('')}
        <div class="hairline"></div>
        <div class="row-between"><b>Total</b><b>${C.money(o.total)}</b></div>
        <div class="row-between"><span class="muted">Terms</span><span class="muted">${o.due}</span></div>
      </div></div>
      <div class="grid-2"><button class="btn ghost sm" data-action="reemail">${icon('mail', 16)} Re-email</button><button class="btn ghost sm" data-action="download">${icon('download', 16)} Download</button></div>
      ${!o.paid ? `<button class="btn full" data-go="S304?order=${o.id}">Pay invoice</button>` : ''}`;
    return base('Invoice', { back: true, body });
  },

  // S304 Payment sheet
  S304(params) {
    const o = D.orderById[params.order] || D.orders.find((x) => !x.paid) || D.orders[0];
    return base('Pay invoice', { back: true, noTabbar: true, body: paymentBody(o.id) });
  },

  // S304a ACH onboarding
  S304a() {
    return base('Link your bank', { back: true, noTabbar: true, body: `
      <div class="center-col pad-block">${icon('bank', 48)}<h3>Connect with Plaid</h3><p class="muted">I link your bank once, securely through Plaid. After this, ACH is a one-tap payment.</p></div>
      <div class="stack tight">${['Chase', 'Bank of America', 'Wells Fargo', 'Other bank'].map((b) => C.listRow({ thumbIcon: 'bank', pri: b, sec: 'Sign in to connect', go: 'S305?ach=1' })).join('')}</div>
      <button class="btn ghost full" data-back>Use a different method</button>` });
  },

  // S305 Payment success
  S305() {
    return base('Paid', { back: true, noTabbar: true, body: `
      <div class="center-col pad-block">${C.successMark()}<h3>Paid</h3><p class="muted">Reference HX-90431. Your order moves to settled.</p></div>
      <div class="card" style="max-width:none"><div class="row-between"><span class="muted">Amount</span><b>${C.money(2080)}</b></div><div class="row-between"><span class="muted">Method</span><span>ACH · Plaid</span></div></div>
      <button class="btn ghost full" data-action="email-receipt">Email receipt</button>
      <button class="btn full" data-go="S301">Back to Orders</button>` });
  },

  // S306 Tracking detail
  S306(params) {
    const o = D.orderById[params.order] || D.orders.find((x) => x.status === 'shipped') || D.orders[1];
    const steps = ['Label created', 'Picked up', 'In transit', 'Out for delivery', 'Delivered'];
    const at = o.status === 'delivered' ? 4 : 2;
    return base('Tracking', { back: true, body: `
      <div class="card" style="max-width:none"><div class="row-between"><b>${o.carrier || 'UPS Ground'}</b><span class="pill ${o.status === 'delivered' ? 'positive' : ''}">${o.status === 'delivered' ? 'Delivered' : 'In transit'}</span></div><span class="muted">${o.tracking} · ${o.eta}</span></div>
      <div class="card" style="max-width:none">${C.timeline(steps, at)}</div>
      <div class="card" style="max-width:none"><span class="muted">Ship to</span><b>${D.addresses[0].name}</b><span class="muted">${D.addresses[0].line1}, ${D.addresses[0].city}</span></div>
      <button class="btn ghost full" data-action="copy">${icon('copy', 16)} Copy tracking number</button>
      <button class="btn full" data-action="open-carrier">Open carrier site</button>` });
  },

};

// shared payment body (screen + sheet)
export function paymentBody(orderId) {
  const o = D.orderById[orderId] || D.orders[0];
  const offline = state.get('network') !== 'online';
  const methods = [...D.paymentMethods, ...state.get('cards')];
  const methodRow = (m, i) => `<label class="list-row" style="cursor:pointer"><span class="thumb">${icon(m.icon, 22)}</span><span class="body"><span class="pri">${C.esc(m.label)}</span><span class="sec">${C.esc(m.sub)}</span></span><span class="trail"><span class="choice"><input type="radio" name="pay" ${i === 0 ? 'checked' : ''} /><span class="box round"></span></span></span></label>`;
  return `
    <div class="card" style="max-width:none"><div class="row-between"><span class="muted">Amount due</span><span class="price"><span class="v">${D.usd(o.total)}</span><span class="currency">USD</span></span></div><span class="muted">${o.invoice} · ${o.due}</span></div>
    ${C.sectionLabel('Method')}
    <div class="stack tight">${methods.map(methodRow).join('')}</div>
    <button class="btn ghost sm full" data-action="add-method">+ Add a payment method</button>
    ${offline ? C.banner("You're offline — pay needs a connection.", { kind: 'caution', ic: 'wifi_off' }) : ''}
    <p class="muted" style="font-size:var(--fs-nano)">Partial payment isn't supported — the amount is fixed.</p>
    <button class="btn full" data-action="confirm-pay" data-order="${o.id}" ${offline ? 'aria-disabled="true"' : ''}>Pay ${C.money(o.total)}</button>`;
}

// Add-method chooser + card form (opened as sheets)
export function addMethodBody() {
  return `<p class="muted">How would you like to pay?</p>
    <div class="opts">
      <button class="opt" data-go="S304a">${icon('bank', 20)}<span style="flex:1;text-align:start">Link a bank (ACH)</span>${icon('chevron-right', 16)}</button>
      <button class="opt" data-action="add-card">${icon('card', 20)}<span style="flex:1;text-align:start">Add a credit / debit card</span>${icon('chevron-right', 16)}</button>
    </div>`;
}
export function addCardBody() {
  return `
    <div class="input-group"><label>Card number</label><input class="input" inputmode="numeric" placeholder="1234 5678 9012 3456" /></div>
    <div class="grid-2"><div class="input-group"><label>Expiry</label><input class="input" placeholder="MM / YY" /></div><div class="input-group"><label>CVC</label><input class="input" inputmode="numeric" placeholder="123" /></div></div>
    <div class="input-group"><label>Name on card</label><input class="input" placeholder="${C.esc(D.account.owner)}" /></div>
    <div class="input-group"><label>Billing ZIP</label><input class="input" inputmode="numeric" placeholder="79843" /></div>
    <button class="btn full" data-action="save-card">Add card</button>`;
}

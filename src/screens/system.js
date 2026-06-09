import * as C from '../components.js';
import * as D from '../data.js';
import { state } from '../state.js';
import { icon } from '../icons.js';
import { base } from './shop.js';
import { notifSettingsBody } from './you.js';

const visibleBrands = () => D.brands.filter((b) => D.canSee(b, state.get('tier')));

function stockCard(b) {
  const s = D.brandStock(b.id);
  return `<div class="card" style="max-width:none;gap:var(--s-2)">
    <button class="row-between" data-go="S003?brand=${b.id}" style="background:none;border:0;padding:0;text-align:start;cursor:pointer;width:100%">
      <span><b>${b.name}</b><br/><span class="muted" style="font-size:var(--fs-nano)">Stock set by ${b.steward} · ${b.name}</span></span>
      <span style="color:var(--fg-mute)">${icon('chevron-right', 18)}</span>
    </button>
    <div class="chip-row"><span class="pill positive">${icon('check', 12)} ${s.skus} SKUs</span>${s.low ? `<span class="pill caution">${icon('warning', 12)} ${s.low} low</span>` : ''}${s.out ? `<span class="pill critical">${icon('warning', 12)} ${s.out} out</span>` : ''}</div>
    ${s.outItems.map((p) => `<div class="row-between" style="padding-top:var(--s-1)"><span class="muted">${p.name}</span><span class="sync-tag" style="color:var(--caution)">${icon('clock', 12)} ${p.restock || 'restock pending'}</span></div>`).join('')}
  </div>`;
}

export const system = {
  // S701 Notifications center
  S701() {
    if (state.get('_state') === 'empty') return base('Notifications', { back: true, body: C.emptyState({ ic: 'bell', title: "You're all caught up", body: 'New pings about orders, approvals, and drops land here.' }) });
    const groups = {};
    D.notifications.forEach((n) => (groups[n.group] ||= []).push(n));
    const catIcon = (cat) => D.pushCategories.find((c) => c.id === cat)?.icon || 'info';
    return base('Notifications', { back: true, headerRight: C.hActions([{ icon: 'settings', go: 'S702' }]), body: `
      ${state.get('network') !== 'online' ? '' : ''}
      ${Object.entries(groups).map(([g, items]) => `${C.sectionLabel(g)}<div class="stack tight">${items.map((n) => C.listRow({ thumbIcon: catIcon(n.cat), pri: n.title, sec: n.body, trail: `<span class="muted" style="font-size:var(--fs-nano)">${n.when}</span>`, go: n.deep })).join('')}</div>`).join('')}
      <button class="btn ghost sm full" data-action="mark-read">Mark all read</button>` });
  },

  // S702 Notification settings (alias of S411)
  S702() { return base('Notifications', { back: true, body: notifSettingsBody() }); },

  // S703 Global search
  S703() {
    return base('Search', { back: true, body: `
      <div class="search"><span>${icon('search', 20)}</span><input placeholder="Products, brands, orders, carts" aria-label="Global search" /><button class="hicon" aria-label="Voice" style="width:32px;height:32px">${icon('mic', 18)}</button></div>
      ${C.sectionLabel('Products')}
      <div class="stack tight">${D.products.slice(0, 2).map((p) => C.listRow({ thumb: `<span class="thumb thumb-illo">${C.illo(p.illo, 24)}</span>`, pri: p.name, sec: D.brandById[p.brand].name, go: `S004?p=${p.id}` })).join('')}</div>
      ${C.sectionLabel('Orders')}
      <div class="stack tight">${C.listRow({ thumbIcon: 'bag', pri: 'Order #4790', sec: 'Shipped · Marlow, Lavender Thorne', go: 'S302?order=4790' })}</div>
      ${C.sectionLabel('Carts')}
      <div class="stack tight">${C.listRow({ thumbIcon: 'draft', pri: 'Back wall refresh', sec: '4 brands', go: 'S202?cart=c-back' })}</div>` });
  },

  // S704 Help & support
  S704() {
    return base('Help', { back: true, body: `
      <div class="search"><span>${icon('search', 20)}</span><input placeholder="Search help" aria-label="Search help" /></div>
      <button class="btn full" data-go="S606">${icon('chat', 16)} Chat with your rep</button>
      ${C.sectionLabel('FAQ')}
      <div class="stack tight">${['How does Privacy on the floor work?', 'What happens if my POS disconnects?', 'How do approvals work?', 'When is an order settled?'].map((q) => C.listRow({ thumbIcon: 'help', pri: q })).join('')}</div>
      <button class="btn ghost full" data-action="email-support">Email Hecho support</button>` });
  },

  // S705 Style-guide gallery
  S705() {
    return base('Style guides', { back: true, headerRight: C.hActions([{ icon: 'filter', action: 'filters' }]), body: `
      <div class="chip-row"><button class="chip is-selected">All</button><button class="chip">Spring</button><button class="chip">Summer</button><button class="chip">Fall</button><button class="chip">Winter</button></div>
      <div class="grid-2">${D.styleGuides.map((g) => C.styleTile(g)).join('')}</div>` });
  },

  // S706 Brand directory
  S706() {
    return base('Brands', { back: true, headerRight: C.hActions([{ icon: 'search', go: 'S005' }]), body: `
      <div class="chip-row"><button class="chip is-selected">All</button><button class="chip">My tier</button><button class="chip">Invitation-only</button><button class="chip">Launching</button></div>
      <div class="stack tight">${D.brands.map((b) => { const seen = D.canSee(b, state.get('tier')); return C.brandCard(b, { locked: !seen }); }).join('')}</div>` });
  },

  // S707 Privacy holding state (transient)
  S707() {
    const on = state.get('privacyOn');
    return base('Privacy demo', { back: true, body: `
      <div class="center-col pad-block">${icon(on ? 'eye-off' : 'eye', 56)}
        <h3>${on ? 'Masked' : 'Revealed'}</h3>
        <p class="muted">${on ? 'Sensitive values render as dots. Tap the eye in the header to reveal them.' : 'Everything is visible. Tap the eye to re-mask before you turn the phone around.'}</p></div>
      <div class="card" style="max-width:none"><div class="row-between"><span class="muted">Your price</span>${C.maskField('<b>$18 wholesale</b>', 'wholesale')}</div>
        <div class="row-between"><span class="muted">On hand</span>${C.maskField('<b>14 units</b>', 'stock')}</div></div>` });
  },

  // S708 Live stock — the 9 brands you manage (replaces the floor map)
  S708() {
    const f = state.get('_state'); // 'low' | 'out' | null
    let list = D.brands;
    if (f === 'low') list = D.brands.filter((b) => D.brandStock(b.id).low > 0);
    if (f === 'out') list = D.brands.filter((b) => D.brandStock(b.id).out > 0);
    const chip = (v, l) => `<button class="chip ${(f || 'all') === v ? 'is-selected' : ''}" data-go="S708${v === 'all' ? '' : '?_=' + v}" data-stockfilter="${v}">${l}</button>`;
    return base('Live stock', { back: true, headerRight: C.hActions([{ icon: 'refresh', action: 'refresh-stock', label: 'Refresh' }]), body: `
      <p class="muted">Live on-hand across the 9 brands you manage. Each brand keeps its own counts current — out-of-stock lines show a restock window.</p>
      <div class="chip-row">${chip('all', 'All 9 brands')}${chip('low', 'Low')}${chip('out', 'Out of stock')}</div>
      <div class="stack tight">${list.map((b) => stockCard(b)).join('')}</div>` });
  },

  // S709 Brand from QR (a brand tag scanned on the floor)
  S709(params) {
    const b = D.brandById[params.brand] || D.brands.find((x) => D.canSee(x, state.get('tier'))) || D.brands[0];
    const s = D.brandStock(b.id);
    return base(b.name, { back: true, body: `
      <div class="thumb-illo" style="border-radius:var(--r-4);padding:var(--s-6)">${C.illo(D.productsByBrand(b.id)[0]?.illo || 'jar', 80)}</div>
      <h3>${b.name}</h3>
      <p class="muted">You scanned ${b.name}'s tag. Here's the live line and stock.</p>
      <div class="chip-row"><span class="pill positive">${s.skus} SKUs</span>${s.low ? `<span class="pill caution">${s.low} low</span>` : ''}${s.out ? `<span class="pill critical">${s.out} out</span>` : ''}</div>
      <div class="sticky-actions"><button class="btn ghost" data-action="new-cart">Sampler cart</button><button class="btn" data-go="S003?brand=${b.id}">Open brand</button></div>` });
  },

  // S710 Brand-launch arrival (push deep link)
  S710(params) {
    const b = D.brandById[params.brand] || D.brandById['pompom'];
    return base('First-look', { back: true, body: `
      <div class="thumb-illo" style="border-radius:var(--r-4);padding:var(--s-6)">${C.illo('tote', 88)}</div>
      <span class="pill coral">${icon('sparkle', 13)} First-look open now</span>
      <h3>${b.name}</h3>
      <p class="muted">${b.story}</p>
      <div class="sticky-actions"><button class="btn ghost" data-action="remind">Save for later</button><button class="btn" data-go="S003?brand=${b.id}">Open the drop</button></div>` });
  },
};

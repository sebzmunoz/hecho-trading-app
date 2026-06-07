import * as C from '../components.js';
import * as D from '../data.js';
import { state } from '../state.js';
import { icon } from '../icons.js';
import { base } from './shop.js';
import { notifSettingsBody } from './you.js';

const visibleBrands = () => D.brands.filter((b) => D.canSee(b, state.get('tier')));

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
    return base('', { noTabbar: true, hideHeader: true, body: `
      <div class="center-col" style="height:100%;justify-content:center;gap:var(--s-4)">${icon('eye', 56)}<h3>$18 wholesale</h3><p class="muted">Release to mask</p></div>` });
  },

  // S708 Showroom map / wayfinding
  S708() {
    const pins = D.booths.map((b) => `<button class="map-pin ${b.current ? 'current' : (b.visited ? 'visited' : '')}" data-action="pick-booth" data-b="${b.id}" style="left:${b.x}%;top:${b.y}%" aria-label="Booth ${b.n}, ${b.brand}">${b.n}</button>`).join('');
    return base('Floor map', { back: true, body: `
      <div class="floorplan">${C.vignette()}<div class="pins">${pins}</div></div>
      <div class="card" style="max-width:none"><div class="row-between"><b>Booth 214 · Mirador</b><span class="tag coral">You're here</span></div><span class="muted">On your route · 2 booths to Cedar House</span><button class="btn sm full" data-go="S709?booth=b-214">Open booth</button></div>
      ${C.sectionLabel('Breadcrumb')}
      <div class="chip-row">${D.booths.filter((b) => b.visited).map((b) => `<span class="chip">${b.n} · ${b.brand}</span>`).join('')}</div>
      <button class="btn ghost full" data-action="reset-breadcrumb">Reset trail</button>` });
  },

  // S709 Booth detail from QR
  S709(params) {
    const b = D.booths.find((x) => x.id === params.booth) || D.booths[4];
    const brand = D.brands.find((x) => x.name === b.brand);
    return base(`Booth ${b.n}`, { back: true, body: `
      <div class="thumb-illo" style="border-radius:var(--r-4);padding:var(--s-6)">${C.illo('hat', 80)}</div>
      <div class="row-between"><h3>${b.brand}</h3><span class="pill">Booth ${b.n}</span></div>
      <p class="muted">${brand ? brand.story : 'Scan a booth QR to land here with full brand context.'}</p>
      <div class="sticky-actions"><button class="btn ghost" data-go="S003?brand=${brand ? brand.id : 'mirador'}">Open brand</button><button class="btn" data-action="new-cart">Sampler cart</button></div>` });
  },

  // S710 Brand-launch arrival (push deep link)
  S710(params) {
    const b = D.brandById[params.brand] || D.brandById['mirador'];
    return base('First-look', { back: true, body: `
      <div class="thumb-illo" style="border-radius:var(--r-4);padding:var(--s-6)">${C.illo('tote', 88)}</div>
      <span class="pill coral">${icon('sparkle', 13)} First-look open now</span>
      <h3>${b.name}</h3>
      <p class="muted">${b.story}</p>
      <div class="sticky-actions"><button class="btn ghost" data-action="remind">Save for later</button><button class="btn" data-go="S003?brand=${b.id}">Open the drop</button></div>` });
  },
};

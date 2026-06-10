import * as C from '../components.js';
import * as D from '../data.js';
import { state } from '../state.js';
import { icon } from '../icons.js';
import { base } from './shop.js';
import { notifSettingsBody } from './you.js';

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

  // S704 Contact us
  S704() {
    return base('Contact us', { back: true, body: `
      <p class="muted">Questions about an order, a brand, or your account — we answer the same day.</p>
      <button class="btn full" data-action="email-support">${icon('mail', 16)} Email us</button>
      <div class="card" style="max-width:none">
        <div class="row-between"><span class="muted">Email</span><b>hello@hecho.app</b></div>
        <div class="row-between"><span class="muted">Hours</span><span>Mon–Fri · 9–6 CT</span></div>
        <div class="row-between"><span class="muted">Showroom</span><span>Dallas Market Center</span></div>
      </div>
      ${C.sectionLabel('Common questions')}
      <div class="stack tight">${['How does signing in with a code work?', 'When is an order settled?', 'How do returns work?'].map((q) => C.listRow({ thumbIcon: 'help', pri: q })).join('')}</div>` });
  },

  // S706 Brand directory
  S706() {
    return base('Brands', { back: true, headerRight: C.hActions([{ icon: 'search', go: 'S005' }]), body: `
      <div class="chip-row"><button class="chip is-selected">All</button><button class="chip">My tier</button><button class="chip">Invitation-only</button><button class="chip">Launching</button></div>
      <div class="stack tight">${D.brands.map((b) => { const seen = D.canSee(b, state.get('tier')); return C.brandCard(b, { locked: !seen }); }).join('')}</div>` });
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

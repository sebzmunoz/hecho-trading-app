import * as C from '../components.js';
import * as D from '../data.js';
import { state } from '../state.js';
import { icon } from '../icons.js';
import { base } from './shop.js';

const retById = Object.fromEntries(D.repRetailers.map((r) => [r.id, r]));
const initials = (name) => name.split(' ').map((w) => w[0]).slice(0, 2).join('');

export const rep = {
  // S601 Rep account picker
  S601() {
    return base('Switch retailer', { back: true, body: `
      <div class="search"><span>${icon('search', 20)}</span><input placeholder="Find a retailer" aria-label="Search retailers" /></div>
      ${C.sectionLabel('Recent')}
      <div class="stack tight">${D.repRetailers.map((r) => C.listRow({ thumb: `<span class="avatar">${r.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</span>`, pri: r.name, sec: r.city, trail: r.taxId === 'Expired' ? C.statusPill('expired') : '', go: '', attrs: `data-action="pick-retailer" data-r="${r.id}"` })).join('')}</div>` });
  },

  // S602 Rep dashboard
  S602() {
    if (state.get('_state') === 'empty') {
      return base('Rep dashboard', { tab: 'retailers', headerRight: C.hActions([{ icon: 'chat', go: 'S606' }, { icon: 'swap', action: 'role-switch' }]), body:
        C.emptyState({ ic: 'building', title: 'No retailers yet', body: 'Retailers Hecho assigns to you land here, with their live carts and appointments.' }) });
    }
    const cur = retById[state.get('repAccount')] || D.repRetailers[0];
    const live = D.repRetailers.filter((r) => r.liveCart);
    const pending = D.repRetailers.filter((r) => r.status === 'pending');
    const approved = D.repRetailers.filter((r) => r.status !== 'pending');
    const body = `
      <button class="card" style="max-width:none" data-go="S601"><div class="row-between"><span><span class="muted" style="font-size:var(--fs-nano)">CO-SHOPPING</span><br/><b>${cur.name}</b></span>${icon('swap', 20)}</div></button>
      ${C.listRow({ thumbIcon: 'map', pri: 'Coverage map', sec: 'Where every retailer sits — and who is too close', trail: '<span class="badge">1</span>', go: 'S607' })}
      <div class="row-between">${C.sectionLabel("Today's appointments")}<button class="chip" data-action="book-appt" style="min-height:28px;padding:2px 10px;font-size:var(--fs-nano)">+ New</button></div>
      <div class="stack tight">${D.repAppointments.map((a) => C.listRow({ thumbIcon: 'clock', pri: a.retailer, sec: `${a.kind} · ${a.when}` , go: '', attrs: `data-action="pick-retailer-name" data-n="${a.retailer}"` })).join('')}</div>
      ${C.sectionLabel('Live carts')}
      <div class="stack tight">${live.map((r) => C.listRow({ thumbIcon: 'cart', pri: r.liveCart, sec: r.name, trail: '<span class="tag coral">Live</span>', go: 'S604' })).join('')}</div>
      ${pending.length ? `${C.sectionLabel('Pending approval')}<div class="stack tight">${pending.map((r) => C.listRow({ thumb: `<span class="avatar sm">${initials(r.name)}</span>`, pri: r.name, sec: `${r.city} · new application`, trail: `<button class="btn sm" data-action="approve-retailer" data-r="${r.id}">Review</button>`, go: '', attrs: `data-action="pick-retailer" data-r="${r.id}" data-then="S603"` })).join('')}</div>` : ''}
      ${C.sectionLabel('Assigned retailers')}
      <div class="stack tight">${approved.map((r) => C.listRow({ thumb: `<span class="avatar sm">${initials(r.name)}</span>`, pri: r.name, sec: r.city, trail: r.taxId === 'Expired' ? C.statusPill('expired') : C.statusPill('current'), go: '', attrs: `data-action="pick-retailer" data-r="${r.id}" data-then="S603"` })).join('')}</div>`;
    return base('Rep dashboard', { tab: 'retailers', headerRight: C.hActions([{ icon: 'chat', go: 'S606' }, { icon: 'swap', action: 'role-switch' }]), body });
  },

  // S603 Rep retailer profile
  S603() {
    const r = retById[state.get('repAccount')] || D.repRetailers[0];
    return base(r.name, { back: true, body: `
      <h3>${r.name}</h3>
      ${r.status === 'pending' ? C.banner('<b>New application.</b> Review the resale cert, then approve to onboard this retailer.', { kind: 'caution', ic: 'shield', action: { label: 'Approve', action: 'approve-retailer' } }) : ''}
      <p class="muted">${r.city} · ${r.note}</p>
      <div class="row-between"><span class="muted">Account status</span>${r.status === 'pending' ? C.statusPill('pending', 'Pending approval') : C.statusPill('current', 'Approved')}</div>
      <div class="grid-2">
        <div class="card" style="max-width:none"><span class="muted">Tax-ID</span>${C.statusPill(r.taxId === 'Expired' ? 'expired' : (r.taxId === 'Renews soon' ? 'renews' : 'current'))}</div>
        <div class="card" style="max-width:none"><span class="muted">Credit</span><b>${r.credit}</b></div>
      </div>
      ${C.sectionLabel('Recent orders')}
      <div class="stack tight">${D.orders.slice(0, 2).map(C.orderCard).join('')}</div>
      ${C.sectionLabel('Internal notes')}
      <div class="card" style="max-width:none"><p class="muted">${r.note}</p></div>
      <div class="sticky-actions" style="flex-wrap:wrap"><button class="btn ghost sm" data-go="S606">Chat</button><button class="btn ghost sm" data-go="S605">Add memo</button><button class="btn" data-go="S604">Co-shop</button></div>` });
  },

  // S604 Rep cart co-shop
  S604() {
    const r = retById[state.get('repAccount')] || D.repRetailers[0];
    const c = D.carts[0];
    const groups = {};
    c.lines.forEach(([pid, q]) => { const p = D.productById[pid]; (groups[p.brand] ||= []).push([p, q]); });
    return base('Co-shop', { back: true, body: `
      ${state.get('_state') === 'conflict' ? C.banner('<b>This draft changed elsewhere.</b> Resolve before you keep editing.', { kind: 'caution', ic: 'warning', action: { label: 'Resolve', go: 'S807' } }) : ''}
      ${C.banner(`<b>Editing ${r.name}'s draft as rep.</b> Changes are visible to the retailer.`, { ic: 'user' })}
      <div class="card" style="max-width:none"><b>${c.name}</b><span class="muted">${D.cartBrandCount(c)} brands · ${C.money(D.cartTotal(c))}</span></div>
      ${Object.entries(groups).map(([bid, lines]) => `<div class="card" style="max-width:none;gap:var(--s-2)"><b>${D.brandById[bid].name}</b>${lines.map(([p, q]) => `<div class="row-between"><span>${p.name} ×${q}</span><span class="muted">${C.money(p.wholesale * q)}</span></div>`).join('')}</div>`).join('')}
      <p class="muted">A rep can't submit on the retailer's behalf without an explicit per-account grant.</p>
      <div class="sticky-actions"><button class="btn ghost" data-go="S606">Send memo</button><button class="btn" data-go="S101">Scan a line</button></div>` });
  },

  // S605 Rep visit memo
  S605() {
    return base('Visit memo', { back: true, body: `
      <div class="card" style="max-width:none center-col" ><div class="center-col" style="padding:var(--s-4) 0"><button data-action="record" style="width:72px;height:72px;border-radius:50%;background:var(--action-sm);color:var(--on-action);display:grid;place-items:center;border:0">${icon('mic', 28)}</button><span class="muted">Tap to record a voice memo</span></div></div>
      <button class="btn ghost full" data-action="library">${icon('image', 16)} Attach a photo</button>
      <div class="input-group"><label>Note</label><textarea class="textarea" placeholder="What happened on this visit?"></textarea></div>
      ${C.switchRow('Internal only', true, { sub: 'Off shares with the retailer in chat' })}
      <button class="btn full" data-go="S603">Save memo</button>` });
  },

  // S607 Retailer coverage map — exclusivity guardrail. Reps see where every
  // store sits so a new application inside another store's radius is caught
  // before it's approved, not after the competition starts.
  S607() {
    const pros = D.repProspect;
    const near = retById[pros.distanceTo];
    const pin = (r) => `<div class="rpin ${r.status === 'pending' ? 'is-pending' : ''}" style="left:${r.mx}%;top:${r.my}%">
      <span class="rp-dot"></span><span class="rp-lbl">${C.esc(r.name)}</span></div>`;
    return base('Coverage map', { back: true, body: `
      <p class="muted">Every stocking retailer, pinned. Applications that land inside another store's exclusivity radius get flagged before approval.</p>
      <div class="rmap" role="img" aria-label="Map of retailer locations across the Southwest">
        <span class="rmap-tag">Southwest territory</span>
        <div class="rmap-radius" style="left:${near.mx}%;top:${near.my}%" aria-hidden="true"></div>
        ${D.repRetailers.map(pin).join('')}
        <div class="rpin is-prospect" style="left:${pros.mx}%;top:${pros.my}%"><span class="rp-dot">!</span><span class="rp-lbl">${C.esc(pros.name)}</span></div>
      </div>
      ${C.banner(`<b>Exclusivity conflict.</b> ${pros.name} (applying) is ${pros.distance} from ${near.name} — inside its ${pros.radius} radius.`, { kind: 'caution', ic: 'warning' })}
      ${C.sectionLabel('On the map')}
      <div class="stack tight">
        ${D.repRetailers.map((r) => C.listRow({ thumb: `<span class="avatar sm">${initials(r.name)}</span>`, pri: r.name, sec: r.city, trail: r.status === 'pending' ? C.statusPill('pending', 'Applying') : C.statusPill('current', 'Stocking'), go: '', attrs: `data-action="pick-retailer" data-r="${r.id}" data-then="S603"` })).join('')}
        ${C.listRow({ thumbIcon: 'warning', pri: pros.name, sec: `${pros.city} · ${pros.distance} from ${near.name}`, trail: `<button class="btn sm" data-action="flag-conflict">Flag</button>` })}
      </div>` });
  },

  // S606 Rep chat with retailer
  S606() {
    const bubble = (mine, txt) => `<div style="display:flex;justify-content:${mine ? 'flex-end' : 'flex-start'}"><div style="max-width:80%;padding:var(--s-2) var(--s-3);border-radius:var(--r-3);background:${mine ? 'var(--action-sm)' : 'var(--surface-dim)'};color:${mine ? 'var(--on-action)' : 'var(--fg)'};font-size:var(--fs-caption)">${txt}</div></div>`;
    return base(D.account.rep, { back: true, body: `
      <div class="stack tight">
        ${bubble(false, 'Hey — added the Wool Throw to your Back wall draft. Holler if you want it out.')}
        ${bubble(true, 'Perfect. Can you check Etta & East lead time?')}
        ${bubble(false, '21 days right now. I can hold a slot if you submit this week.')}
      </div>
      <div class="sticky-actions" style="gap:var(--s-2)"><button class="btn ghost icon-only" data-action="library" aria-label="Photo">${icon('image', 18)}</button><button class="btn ghost icon-only" data-action="voice" aria-label="Voice">${icon('mic', 18)}</button><input class="input" placeholder="Message" style="flex:2" /><button class="btn sm" data-action="send-msg">Send</button></div>` });
  },
};

import * as C from '../components.js';
import * as D from '../data.js';
import { state } from '../state.js';
import { icon } from '../icons.js';
import { base } from './shop.js';

const roleLabel = { admin: 'Admin', staff: 'Staff', rep: 'Hecho Rep' };

export const you = {
  // S401 You overview
  S401() {
    const tax = state.get('taxId');
    const role = state.get('role');
    const tiles = [
      { ic: 'user', label: 'My details', go: 'S402' },
      { ic: 'pin', label: 'Address book', go: 'S403' },
      { ic: 'user', label: 'Company users', go: 'S405' },
      { ic: 'shield', label: 'Compliance', go: 'S408' },
      { ic: 'bell', label: 'Notifications', go: 'S411' },
      { ic: 'help', label: 'Help & support', go: 'S704' },
    ];
    const body = `
      <div class="center-col" style="padding:var(--s-4) 0"><span class="avatar lg dark">${D.account.initials}</span><h3 style="margin-top:var(--s-1)">${D.account.owner}</h3><span class="muted">${roleLabel[role]} · ${D.account.retailer}</span></div>
      ${tax !== 'current' ? C.banner(tax === 'expired' ? '<b>Tax ID expired.</b> Resolve before your next submit.' : 'Tax ID renews soon.', { kind: tax === 'expired' ? 'caution' : '', ic: tax === 'expired' ? 'warning' : 'clock', action: { label: 'Open', go: 'S409' } }) : ''}
      ${role !== 'rep' ? C.listRow({ thumbIcon: 'swap', pri: 'Switch to Rep mode', sec: 'Co-shop with retailers', go: '', attrs: 'data-action="role-switch"' }) : C.listRow({ thumbIcon: 'swap', pri: 'Back to buyer view', sec: 'You · ' + D.account.retailer, attrs: 'data-action="role-switch"' })}
      ${C.listRow({ thumbIcon: 'clock', pri: 'Appointments', sec: D.appointments.length ? `${D.appointments[0].kind} · ${D.appointments[0].when}` : 'Book time with your rep', trail: D.appointments.length ? `<span class="badge">${D.appointments.length}</span>` : undefined, go: 'S412' })}
      <div class="grid-2">${tiles.map((t) => `<button class="card" style="max-width:none;flex-direction:row;align-items:center;gap:var(--s-3)" data-go="${t.go}"><span style="color:var(--accent)">${icon(t.ic, 22)}</span><b style="font-size:var(--fs-caption)">${t.label}</b></button>`).join('')}</div>
      <button class="btn ghost full" data-go="S416">${icon('list', 16)} Reports</button>
      <button class="btn ghost full" data-action="sign-out">Sign out</button>`;
    return base('You', { tab: 'you', headerRight: C.hActions([{ icon: 'bell', go: 'S701', label: 'Notifications', badge: '3' }]), body });
  },

  // S402 My details
  S402() {
    return base('My details', { back: true, body: `
      <div class="input-group"><label>Name</label><input class="input" value="${D.account.owner}" /></div>
      <div class="input-group"><label>Email</label><input class="input" value="${D.account.email}" /></div>
      <div class="input-group"><label>Phone</label><input class="input" value="${D.account.phone}" /></div>
      <div class="card" style="max-width:none"><div class="row-between"><span class="muted">Last verified</span><span>two weeks ago</span></div><button class="btn sm" data-action="verify">Verify</button></div>
      <button class="btn full" data-action="save">Save</button>` });
  },

  // S403 Address book
  S403() {
    return base('Address book', { back: true, headerRight: C.hActions([{ icon: 'plus', go: 'S404', label: 'Add' }]), body: `
      <div class="stack tight">${D.addresses.map((a) => `<div class="card" style="max-width:none"><div class="row-between"><b>${a.name}</b>${a.def ? '<span class="tag positive">Default</span>' : ''}</div><span class="muted">${a.line1}, ${a.city} ${a.region} ${a.postal}</span><div class="row-between"><span class="pill">${a.kind}</span><div style="display:flex;gap:var(--s-2)"><button class="chip" data-go="S404?a=${a.id}">Edit</button>${!a.def ? '<button class="chip" data-action="set-default">Set default</button>' : ''}</div></div></div>`).join('')}</div>
      <button class="btn full" data-go="S404">Add new address</button>` });
  },

  // S404 Address detail / add
  S404(params) {
    const a = D.addresses.find((x) => x.id === params.a);
    return base(a ? 'Edit address' : 'Add address', { back: true, body: `
      <div class="input-group"><label>Country</label><select class="select"><option>United States</option><option>Canada</option><option>Mexico</option></select></div>
      <div class="input-group"><label>Label</label><input class="input" value="${a ? a.name : ''}" placeholder="e.g. Floor" /></div>
      <div class="input-group"><label>Address line 1</label><input class="input" value="${a ? a.line1 : ''}" /></div>
      <div class="grid-2"><div class="input-group"><label>City</label><input class="input" value="${a ? a.city : ''}" /></div><div class="input-group"><label>Region</label><input class="input" value="${a ? a.region : ''}" /></div></div>
      <div class="input-group"><label>Postal</label><input class="input" value="${a ? a.postal : ''}" inputmode="numeric" /></div>
      <div class="chip-row"><button class="chip is-selected">Ship-to</button><button class="chip">Bill-to</button></div>
      ${C.switchRow('Set as default', a ? a.def : false)}
      <button class="btn full" data-go="S403">Save</button>` });
  },

  // S405 Company users
  S405() {
    const budgets = state.get('budgets') || {};
    const userSec = (u) => {
      if (!u.budget) return u.activity;
      const b = budgets[u.name] ?? u.budget;
      return `${u.activity} · ${C.maskField(`${C.money(u.spent || 0)} of ${C.money(b)} budget`, 'spend')}`;
    };
    return base('Company users', { back: true, headerRight: C.hActions([{ icon: 'plus', go: 'S406', label: 'Invite' }]), body: `
      <div class="stack tight">${D.companyUsers.map((u) => C.listRow({ thumb: `<span class="avatar">${u.initials}</span>`, pri: u.name + (u.self ? ' (you)' : ''), sec: userSec(u), trail: `<span class="pill">${u.role}</span>`, go: u.self ? '' : 'S407?user=' + encodeURIComponent(u.name) })).join('')}</div>
      <button class="btn full" data-go="S406">Invite new user</button>
      <p class="muted">The only Admin can't be removed, and you can't demote yourself while sole Admin. Staff submit instantly within the budget you set — approval is only for what goes over.</p>` });
  },

  // S406 Invite user
  S406() {
    const canInvite = state.caps().users;
    return base('Invite user', { back: true, body: `
      <div class="input-group"><label>Email</label><input class="input" placeholder="name@store.com" inputmode="email" ${canInvite ? '' : 'disabled'} /></div>
      ${C.sectionLabel('Role')}
      <div class="chip-row"><button class="chip is-selected">Staff</button></div>
      <p class="muted">Staff build drafts and submit instantly within the monthly budget you set them — approval is only asked for spend that goes over it. The Admin role can't be granted by invite.</p>
      ${!canInvite ? C.banner('<b>Only the admin invites users</b> (§02b).', { ic: 'user' }) : ''}
      ${canInvite
        ? `<button class="btn full" data-action="send-invite">Send invite</button>
      <button class="btn ghost full" data-action="copy">Copy invite link</button>`
        : `<button class="btn full" aria-disabled="true">Send invite · admin only</button>`}` });
  },

  // S407 Roles & permissions (+ the member's spending budget, admin-set)
  S407(params) {
    const uname = params.user || 'Priya Nair';
    const u = D.companyUsers.find((x) => x.name === uname) || D.companyUsers[1];
    const isAdmin = state.caps().users === true;
    const budget = (state.get('budgets') || {})[u.name] ?? u.budget ?? 0;
    const spent = u.spent || 0;
    const pct = budget ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
    const groups = [
      ['Cart', [['Create / edit / share drafts', true], ['Submit within budget — instant', true], ['Submit over budget (overage needs approval)', false]]],
      ['Approval', [['Approve a draft', false], ['Grant Approve to others', false]]],
      ['Compliance', [['Manage Tax-ID, W-9, COI', false]]],
      ['Payment', [['Pay invoices · manage ACH', false]]],
      ['User management', [['Invite, change role, remove', false]]],
    ];
    return base('Roles & permissions', { back: true, body: `
      <div class="card" style="max-width:none"><div class="row-between"><b>${C.esc(u.name)}</b><span class="pill">${C.esc(u.role)}</span></div></div>
      ${C.sectionLabel('Spending budget')}
      <div class="card" style="max-width:none;gap:var(--s-2)">
        <div class="row-between"><span class="muted">Used this month</span>${C.maskField(`<b>${C.money(spent)}</b> of ${C.money(budget)}`, 'spend')}</div>
        <div style="height:6px;border-radius:999px;background:var(--surface-dim);overflow:hidden" aria-hidden="true"><div style="height:100%;width:${pct}%;background:var(--accent)"></div></div>
        ${isAdmin
          ? `<div class="input-group"><label>Monthly budget (USD)</label><input class="input" id="budgetInput" inputmode="numeric" value="${budget}" aria-label="Monthly budget for ${C.esc(u.name)}" /></div>
             <button class="btn sm" data-action="save-budget" data-user="${C.esc(u.name)}">Save budget</button>`
          : `<p class="muted" style="font-size:var(--fs-nano)">Only the admin sets budgets.</p>`}
        <p class="muted" style="font-size:var(--fs-nano)">${C.esc(u.name.split(' ')[0])} submits instantly up to what's left of this budget. Going over only sends the overage for approval — the in-budget part of the sale closes on the spot.</p>
      </div>
      ${groups.map(([g, rows]) => `${C.sectionLabel(g)}<div class="stack tight">${rows.map(([l, on]) => C.switchRow(l, on)).join('')}</div>`).join('')}
      ${C.sectionLabel('Rep access')}
      ${C.switchRow('Let ' + D.account.rep + ' submit on your behalf', false, { sub: 'Off by default · per-account grant' })}
      <button class="btn full" data-action="save">Save changes</button>` });
  },

  // S412 Appointments — admins AND staff book time with the rep. No gate.
  S412() {
    if (state.get('_state') === 'empty') {
      return base('Appointments', { back: true, body: C.emptyState({ ic: 'clock', title: 'No appointments yet', body: 'Book time with your rep — showroom walks, line reviews, previews.', primary: { label: 'Book an appointment', action: 'book-appt' } }) });
    }
    return base('Appointments', { back: true, headerRight: C.hActions([{ icon: 'plus', action: 'book-appt', label: 'Book an appointment' }]), body: `
      ${C.banner('<b>Anyone on the team books.</b> Admins and staff can both set appointments — no sign-off needed.', { ic: 'user' })}
      ${C.sectionLabel('Upcoming')}
      <div class="stack tight">${D.appointments.map((a) => C.listRow({ thumbIcon: 'clock', pri: `${C.esc(a.kind)} · ${C.esc(a.with)}`, sec: `${C.esc(a.when)} · ${C.esc(a.where)}${a.by !== 'You' ? ' · booked by ' + C.esc(a.by) : ''}`, trail: '<span class="pill positive">' + icon('check', 13) + 'Booked</span>' })).join('')}</div>
      <button class="btn full" data-action="book-appt">Book an appointment</button>` });
  },

  // S408 Compliance hub
  S408() {
    const tax = state.get('taxId');
    const items = D.complianceItems.map((it) => it.id === 'taxid' ? { ...it, status: tax === 'expired' ? 'expired' : (tax === 'current' ? 'current' : 'renews') } : it);
    return base('Compliance', { back: true, body: `
      <div class="stack tight">${items.map((it) => C.listRow({ thumbIcon: 'shield', pri: it.label, sec: '', trail: C.statusPill(it.status), go: it.id === 'taxid' ? 'S409' : '' })).join('')}</div>
      <button class="btn ghost full" data-action="download">Download current docs</button>` });
  },

  // S409 Tax-ID upload
  S409() {
    return base('Tax ID', { back: true, body: `
      <button class="photo-frame r-3-2" data-action="capture-doc" style="border:2px dashed var(--line-strong);background:var(--surface)"><div class="ph" style="flex-direction:column;gap:var(--s-2)">${icon('doc', 48)}<span class="muted">Tap to add photo or PDF</span></div></button>
      <div class="input-group"><label>State</label><input class="input" value="TX" /></div>
      <div class="input-group"><label>ID number</label><input class="input" placeholder="Resale certificate #" /></div>
      <div class="input-group"><label>Expiry</label><input class="input" placeholder="Renewal window" /></div>
      <button class="btn full" data-action="save-taxid">Save</button>` });
  },

  // S410 Tax-ID hold (modal-style)
  S410() {
    return base('Submit on hold', { back: true, noTabbar: true, body: `
      <div class="fullscreen-state"><div class="ico" style="color:var(--critical)">${icon('warning', 48)}</div><h4>Your tax ID has expired</h4><p>I'm holding this order, not your account. Refresh the tax ID and I'll let the submit through.</p><div class="actions"><button class="btn" data-go="S409">Resolve</button><button class="btn ghost" data-back>Cancel</button></div></div>` });
  },

  // S411 Notification settings (alias S702)
  S411() {
    return base('Notifications', { back: true, body: notifSettingsBody() });
  },

  // S416 Reports
  S416() {
    return base('Reports', { back: true, body: `
      <div class="chip-row"><button class="chip is-selected">This season</button><button class="chip">Last season</button><button class="chip">This year</button></div>
      <div class="grid-2">
        <div class="card" style="max-width:none"><span class="muted">Spend</span>${C.maskField('<b style="font-size:var(--fs-h3)">$18.4k</b>', 'spend')}</div>
        <div class="card" style="max-width:none"><span class="muted">Reorder rate</span><b style="font-size:var(--fs-h3)">42%</b></div>
      </div>
      ${C.sectionLabel('Top brands')}
      <div class="stack tight">${['The New Savant', 'Etta & East', 'Lavender Thorne'].map((b, i) => C.listRow({ thumbIcon: 'building', pri: b, sec: `${[6, 5, 4][i]} orders`, trail: C.maskField(C.money([5200, 4100, 3300][i]), 'spend') })).join('')}</div>
      <button class="btn ghost full" data-action="export">Email full report</button>` });
  },

  // S417 Sign out (modal)
  S417() {
    return base('Sign out', { back: true, noTabbar: true, body: `
      <div class="fullscreen-state"><div class="ico">${icon('user', 48)}</div><h4>Sign out?</h4><p>You have one draft with sync pending — I'll keep it safe and sync when you're back.</p><div class="actions"><button class="btn" data-go="S502">Sign out</button><button class="btn ghost" data-back>Cancel</button></div></div>` });
  },
};

// Booking sheet — shared by buyer mode (admin + staff book with the rep)
// and Rep mode (the rep books with a retailer). Exact date and time.
export function bookApptBody() {
  const isRep = state.get('role') === 'rep';
  const todayISO = new Date().toISOString().slice(0, 10);
  return `
    ${isRep
      ? `${C.sectionLabel('Retailer')}<select class="select" data-appt-with aria-label="Retailer">${D.repRetailers.map((r) => `<option>${C.esc(r.name)}</option>`).join('')}</select>`
      : `<div class="card" style="max-width:none;flex-direction:row;align-items:center;gap:var(--s-3)"><span class="avatar sm dark">DO</span><span style="display:flex;flex-direction:column"><b>${C.esc(D.account.rep)}</b><span class="muted" style="font-size:var(--fs-nano)">Your Hecho rep</span></span></div>`}
    ${C.sectionLabel('Kind')}
    <div class="chip-row" data-chipgroup data-appt-kind>${D.appointmentKinds.map((k, i) => `<button class="chip ${i === 0 ? 'is-selected' : ''}">${C.esc(k)}</button>`).join('')}</div>
    ${C.sectionLabel('Exactly when')}
    <div class="grid-2">
      <div class="input-group"><label>Date</label><input class="input" type="date" data-appt-date min="${todayISO}" value="${todayISO}" aria-label="Appointment date" /></div>
      <div class="input-group"><label>Time</label><input class="input" type="time" data-appt-time value="10:00" aria-label="Appointment time" /></div>
    </div>
    <div class="input-group"><label>Note</label><textarea class="textarea" data-appt-note placeholder="Anything to prep?"></textarea></div>
    <button class="btn full" data-action="confirm-appt">Book appointment</button>`;
}
// 'Tue, Jun 16 · 2:30 PM' from the sheet's date + time inputs.
export function apptWhenLabel(dateISO, time) {
  const d = dateISO ? new Date(dateISO + 'T12:00:00') : new Date();
  const day = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  let t = time || '10:00';
  const [h, m] = t.split(':').map(Number);
  t = `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
  return `${day} · ${t}`;
}

export function notifSettingsBody() {
  return `
    ${C.switchRow('System permission', true, { sub: 'Allowed in iOS Settings' })}
    ${C.sectionLabel('Categories')}
    <div class="stack tight">${D.pushCategories.map((c) => C.switchRow(c.label, c.id !== 'lowstock')).join('')}</div>
    ${C.sectionLabel('Snooze all')}
    <div class="chip-row"><button class="chip is-selected" data-snooze="off">Off</button><button class="chip" data-snooze="1h">1 hour</button><button class="chip" data-snooze="3h">3 hours</button><button class="chip" data-snooze="tonight">Until tonight</button><button class="chip" data-snooze="tomorrow">Until tomorrow</button><button class="chip" data-snooze="week">1 week</button><button class="chip" data-action="snooze-custom">Custom…</button></div>`;
}

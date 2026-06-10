import * as C from '../components.js';
import * as D from '../data.js';
import { state } from '../state.js';
import { icon } from '../icons.js';
import { base } from './shop.js';

export const you = {
  // S401 Account & settings
  S401() {
    if (state.get('guest')) {
      return base('Account', { back: true, body: `
        <div class="center-col pad-block">${icon('user', 56)}<h3>Browsing as a guest</h3>
          <p class="muted" style="text-align:center;max-width:32ch">Build carts and love lists freely. I'll only ask for your store details when you place your first order.</p></div>
        <button class="btn full" data-action="register">Apply to become a retailer</button>
        <button class="btn ghost full" data-go="S503">I already have an account</button>` });
    }
    const tiles = [
      { ic: 'bag', label: 'Orders', go: 'S301' },
      { ic: 'cart', label: 'Carts', go: 'S201' },
      { ic: 'heart', label: 'Love list', go: 'S010' },
      { ic: 'user', label: 'My details', go: 'S402' },
      { ic: 'bell', label: 'Notifications', go: 'S411' },
      { ic: 'chat', label: 'Contact us', go: 'S704' },
    ];
    const body = `
      <div class="center-col" style="padding:var(--s-4) 0"><span class="avatar lg dark">${D.account.initials}</span><h3 style="margin-top:var(--s-1)">${D.account.owner}</h3><span class="muted">${D.account.retailer}</span></div>
      <div class="grid-2">${tiles.map((t) => `<button class="card" style="max-width:none;flex-direction:row;align-items:center;gap:var(--s-3)" data-go="${t.go}"><span style="color:var(--accent)">${icon(t.ic, 22)}</span><b style="font-size:var(--fs-caption)">${t.label}</b></button>`).join('')}</div>
      <button class="btn ghost full" data-action="sign-out">Sign out</button>`;
    return base('Account', { back: true, headerRight: C.hActions([{ icon: 'bell', go: 'S701', label: 'Notifications', badge: '3' }]), body });
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

  // S411 Notification settings (alias S702)
  S411() {
    return base('Notifications', { back: true, body: notifSettingsBody() });
  },

  // S417 Sign out (modal)
  S417() {
    return base('Sign out', { back: true, noTabbar: true, body: `
      <div class="fullscreen-state"><div class="ico">${icon('user', 48)}</div><h4>Sign out?</h4><p>You have one draft with sync pending — I'll keep it safe and sync when you're back.</p><div class="actions"><button class="btn" data-go="S502">Sign out</button><button class="btn ghost" data-back>Cancel</button></div></div>` });
  },
};

export function notifSettingsBody() {
  return `
    ${C.switchRow('System permission', true, { sub: 'Allowed in iOS Settings' })}
    ${C.sectionLabel('Categories')}
    <div class="stack tight">${D.pushCategories.map((c) => C.switchRow(c.label, c.id !== 'lowstock')).join('')}</div>
    ${C.sectionLabel('Snooze all')}
    <div class="chip-row"><button class="chip is-selected" data-snooze="off">Off</button><button class="chip" data-snooze="1h">1 hour</button><button class="chip" data-snooze="3h">3 hours</button><button class="chip" data-snooze="tonight">Until tonight</button><button class="chip" data-snooze="tomorrow">Until tomorrow</button><button class="chip" data-snooze="week">1 week</button><button class="chip" data-action="snooze-custom">Custom…</button></div>`;
}

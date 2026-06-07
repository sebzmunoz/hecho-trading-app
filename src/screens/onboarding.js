import * as C from '../components.js';
import * as D from '../data.js';
import { icon } from '../icons.js';
import { logoMark } from '../icons.js';
import { base } from './shop.js';

export const onboarding = {
  // S501 Splash
  S501() {
    return base('', { noTabbar: true, hideHeader: true, camera: false, body: `
      <div class="center-col" style="justify-content:center;height:100%;gap:var(--s-6)">
        <div style="color:var(--accent);width:200px">${logoMark()}</div>
        <div class="skeleton" style="max-width:120px"><div class="s-bar sm" style="width:100%"></div></div>
      </div>`, flush: false });
  },

  // S502 Welcome (3 cards)
  S502() {
    const cards = [
      { ic: 'scan', t: 'Scan the shelf', b: 'Point at any product on the floor. I resolve it to your live stock.' },
      { ic: 'draft', t: 'Build a draft', b: 'Drop lines into a named draft cart from scan, search, or a style guide.' },
      { ic: 'reorder', t: 'Reorder smart', b: 'Past orders become starting points, ranked by what actually sells.' },
    ];
    return base('', { noTabbar: true, hideHeader: true, body: `
      <div class="center-col" style="height:100%;justify-content:space-between;padding:var(--s-5) 0">
        <div style="color:var(--accent);width:120px">${logoMark()}</div>
        <div class="rail" style="scroll-snap-type:x mandatory;width:100%">${cards.map((c) => `<div style="width:100%;flex:0 0 100%;scroll-snap-align:center;display:flex;flex-direction:column;align-items:center;gap:var(--s-4);padding:0 var(--s-4)"><div style="color:var(--accent)">${icon(c.ic, 64)}</div><h3>${c.t}</h3><p class="muted" style="text-align:center;max-width:30ch">${c.b}</p></div>`).join('')}</div>
        <div style="display:flex;gap:6px">${cards.map((_, i) => `<span style="width:7px;height:7px;border-radius:50%;background:${i === 0 ? 'var(--accent)' : 'var(--surface-dim)'}"></span>`).join('')}</div>
        <div class="stack" style="width:100%"><button class="btn full" data-go="S503">Sign in</button><button class="btn ghost full" data-go="S503">Skip</button></div>
      </div>` });
  },

  // S503 Sign in
  S503() {
    return base('Sign in', { noTabbar: true, body: `
      <div style="color:var(--accent);width:120px;margin:var(--s-4) auto">${logoMark()}</div>
      <div class="input-group"><label>Email</label><input class="input" placeholder="you@store.com" inputmode="email" value="${D.account.email}" /></div>
      <button class="btn full" data-go="S504">Send magic link</button>
      <div class="row-between"><span class="hairline" style="flex:1"></span><span class="muted" style="padding:0 var(--s-3)">or</span><span class="hairline" style="flex:1"></span></div>
      <button class="btn ghost full" data-go="S505">Continue with Apple</button>
      <button class="btn ghost full" data-go="S505">Continue with Google</button>
      <button class="btn ghost full" data-go="S505">Hecho SSO</button>
      <button class="btn ghost sm full" data-go="S506">I have an invite</button>` });
  },

  // S504 Magic link sent
  S504() {
    return base('Check your mail', { back: true, noTabbar: true, body: `
      <div class="center-col pad-block">${icon('mail', 56)}<h3>Magic link sent</h3><p class="muted">I sent a link to ${D.account.email}. Open it on this device to sign in.</p></div>
      <button class="btn full" data-go="S505">Open mail app</button>
      <button class="btn ghost full" data-action="resend">Send it again</button>
      <button class="btn ghost sm full" data-go="S503">Use a different email</button>` });
  },

  // S505 Email verification
  S505() {
    return base('', { noTabbar: true, hideHeader: true, body: `
      <div class="center-col" style="height:100%;justify-content:center;gap:var(--s-5)">${icon('check', 56)}<h3>Signing you in</h3><p class="muted">One moment.</p>
      <button class="btn" data-go="S506">Continue</button></div>` });
  },

  // S506 Account picker
  S506() {
    return base('Choose account', { noTabbar: true, body: `
      <p class="muted">You belong to more than one account. Pick where to work.</p>
      <div class="stack tight">
        ${C.listRow({ thumb: '<span class="avatar dark">SM</span>', pri: 'Marfa Studio', sec: 'Owner', go: 'S507' })}
        ${C.listRow({ thumb: '<span class="avatar">OG</span>', pri: 'Ojai General', sec: 'Manager', go: 'S507' })}
        ${C.listRow({ thumb: '<span class="avatar">HR</span>', pri: 'Hecho field rep', sec: 'Rep · 4 retailers', go: '', attrs: 'data-action="pick-rep"' })}
      </div>` });
  },

  // S507 Camera permission prompt
  S507() {
    return base('', { noTabbar: true, hideHeader: true, body: `
      <div class="center-col" style="height:100%;justify-content:center;gap:var(--s-4);padding:0 var(--s-4)">${icon('camera', 64)}<h3>Scan on the floor</h3><p class="muted" style="text-align:center;max-width:30ch">Scan products on the showroom floor and add them to a draft in seconds.</p>
      <div class="stack" style="width:100%"><button class="btn full" data-go="S508">Allow camera</button><button class="btn ghost full" data-go="S508">Skip</button></div></div>` });
  },

  // S508 Notification permission prompt
  S508() {
    const preview = ['Order shipped', 'Low stock', 'Tax-ID', 'Style guide', 'Brand drop'];
    return base('', { noTabbar: true, hideHeader: true, body: `
      <div class="center-col" style="height:100%;justify-content:center;gap:var(--s-4);padding:0 var(--s-4)">${icon('bell', 64)}<h3>Stay in the loop</h3><p class="muted" style="text-align:center;max-width:32ch">Get a ping when an order ships, stock runs low, or a brand opens first-look.</p>
      <div class="chip-row" style="justify-content:center;flex-wrap:wrap">${preview.map((p) => `<span class="chip">${p}</span>`).join('')}</div>
      <div class="stack" style="width:100%"><button class="btn full" data-go="S509">Allow notifications</button><button class="btn ghost full" data-go="S509">Skip</button></div></div>` });
  },

  // S509 POS connect invite
  S509() {
    return base('Connect a POS', { noTabbar: true, body: `
      <p class="muted">Link a POS for live stock and sharper reorder picks. You can skip and do this later.</p>
      <div class="stack tight">${['Shopify', 'Lightspeed', 'Square'].map((v) => C.listRow({ thumbIcon: 'refresh', pri: v, sec: 'Connect', go: 'S414?vendor=' + v.toLowerCase() })).join('')}</div>
      <button class="btn ghost full" data-go="S414">Connect another POS (open API)</button>
      <button class="btn full" data-go="S510">Continue</button>
      <button class="btn ghost sm full" data-go="S001">Skip for now</button>` });
  },

  // S510 First showroom-visit cue
  S510() {
    return base('', { noTabbar: true, hideHeader: true, body: `
      <div style="height:100%;display:flex;flex-direction:column;justify-content:flex-end">
        <div class="thumb-illo" style="flex:1;border-radius:0">${C.vignette()}</div>
        <div class="sheet" style="border-radius:var(--r-4) var(--r-4) 0 0;position:static;box-shadow:none"><span class="grab"></span>
          <h4>Welcome to the showroom</h4><p class="muted">Looks like you're at a Hecho showroom. Want the floor map?</p>
          <button class="btn full" data-go="S708">Open floor map</button>
          <button class="btn ghost full" data-action="new-cart">Start a draft</button>
          <button class="btn ghost sm full" data-go="S001">Dismiss</button>
        </div>
      </div>`, flush: true });
  },
};

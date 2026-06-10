import * as C from '../components.js';
import * as D from '../data.js';
import { icon } from '../icons.js';
import { base } from './shop.js';

const mark = (w) => `<svg viewBox="0 0 463 168" style="width:${w};height:auto;color:var(--accent);display:block" aria-label="HECHO"><use href="#hecho-mark"/></svg>`;

export const onboarding = {
  // S501 Splash
  S501() {
    return base('', { noTabbar: true, hideHeader: true, camera: false, body: `
      <div class="center-col" style="justify-content:center;height:100%;gap:var(--s-7)">
        ${mark('min(260px, 64%)')}
        <div class="splash-bar" aria-hidden="true"><i></i></div>
      </div>`, flush: false });
  },

  // S502 Entry — the logo and two choices, nothing else.
  // Current → email + code. New → shop immediately as a guest; account
  // details are only asked for at the first order.
  S502() {
    const body = `
      <div class="entry">
        <div class="entry-brand">${mark('min(210px, 56%)')}</div>
        <div class="entry-choices">
          <button class="entry-card" data-go="S503">
            <span class="ec-ic">${icon('bag', 26)}</span>
            <span class="ec-body"><b>Current customer</b><span>Sign in with your email</span></span>
            <span class="ec-arr">${icon('chevron-right', 18)}</span>
          </button>
          <button class="entry-card" data-action="guest-enter">
            <span class="ec-ic">${icon('sparkle', 26)}</span>
            <span class="ec-body"><b>New to Hecho</b><span>Start shopping now — set up at your first order</span></span>
            <span class="ec-arr">${icon('chevron-right', 18)}</span>
          </button>
        </div>
      </div>`;
    return base('', { noTabbar: true, hideHeader: true, body });
  },

  // S503 Sign in — email only; a 6-digit code does the rest
  S503() {
    return base('Sign in', { noTabbar: true, body: `
      <div style="margin:var(--s-4) auto;display:flex;justify-content:center">${mark('120px')}</div>
      <p class="muted" style="text-align:center">Enter the email on your account — I'll send a 6-digit code.</p>
      <div class="input-group"><label>Email</label><input class="input" placeholder="you@store.com" inputmode="email" value="${D.account.email}" /></div>
      <button class="btn full" data-go="S504">Send code</button>` });
  },

  // S504 Verification code
  S504() {
    return base('Enter the code', { back: true, noTabbar: true, body: `
      <div class="center-col pad-block">${icon('mail', 56)}<h3>Check your mail</h3><p class="muted">I sent a 6-digit code to ${D.account.email}.</p></div>
      <div class="input-group"><label>Verification code</label><input class="input" inputmode="numeric" maxlength="6" placeholder="••••••" aria-label="6-digit verification code" style="text-align:center;letter-spacing:.4em;font-size:var(--fs-h3);font-weight:700" /></div>
      <button class="btn full" data-action="verify-code">Continue</button>
      <button class="btn ghost sm full" data-action="resend">Send it again</button>
      <button class="btn ghost sm full" data-go="S503">Use a different email</button>` });
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
    const preview = ['Order shipped', 'Low stock', 'Tax-ID', 'Brand drop'];
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
      <div class="center-col" style="height:100%;justify-content:center;gap:var(--s-4);padding:0 var(--s-4)">
        ${C.successMark()}
        <h3>You're all set</h3>
        <p class="muted" style="text-align:center;max-width:30ch">Scan anything on the floor, or browse the nine brands.</p>
        <div class="stack" style="width:100%"><button class="btn full" data-go="S101">Scan the floor</button><button class="btn ghost full" data-go="S001">Start browsing</button></div>
      </div>` });
  },
};

// Retailer registration (apply for an account, then await Hecho approval).
export function registrationBody() {
  return `
    <p class="muted">Tell me about your store. Hecho reviews every application and approves your account before you can order.</p>
    <div class="input-group"><label>Store name</label><input class="input" placeholder="Your shop" /></div>
    <div class="input-group"><label>Website or Instagram</label><input class="input" placeholder="@yourshop" /></div>
    <div class="input-group"><label>Resale certificate #</label><input class="input" /></div>
    <div class="input-group"><label>Business email</label><input class="input" inputmode="email" /></div>
    <button class="btn full" data-action="submit-registration">Submit application</button>`;
}

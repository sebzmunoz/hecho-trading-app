import * as C from '../components.js';
import * as D from '../data.js';
import { state } from '../state.js';
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

  // S502 Welcome (3-card carousel)
  S502() {
    const cards = [
      { ic: 'scan', t: 'Scan the shelf', b: 'Point at any product on the floor. I resolve it to your live stock.' },
      { ic: 'draft', t: 'Build a draft', b: 'Drop lines into a named draft cart from scan, search, or a style guide.' },
      { ic: 'reorder', t: 'Reorder smart', b: 'Past orders become starting points, ranked by what actually sells.' },
    ];
    const body = `
      <div class="welcome">
        ${mark('108px')}
        <div class="carousel" id="welcomeCarousel">
          <div class="carousel-track">${cards.map((c) => `<div class="slide"><div class="slide-ic">${icon(c.ic, 56)}</div><h3>${c.t}</h3><p class="muted">${c.b}</p></div>`).join('')}</div>
        </div>
        <div class="dots" id="welcomeDots">${cards.map((_, i) => `<button class="dot ${i === 0 ? 'is-on' : ''}" data-slide="${i}" aria-label="Card ${i + 1}"></button>`).join('')}</div>
        <div class="stack" style="width:100%"><button class="btn full" data-go="S503">Sign in</button><button class="btn ghost full" data-go="S503">Skip</button></div>
      </div>`;
    return base('', { noTabbar: true, hideHeader: true, body, onMount: wireCarousel });
  },

  // S503 Sign in
  S503() {
    return base('Sign in', { noTabbar: true, body: `
      <div style="margin:var(--s-4) auto;display:flex;justify-content:center">${mark('120px')}</div>
      <div class="input-group"><label>Email</label><input class="input" placeholder="you@store.com" inputmode="email" value="${D.account.email}" /></div>
      <button class="btn full" data-go="S504">Send magic link</button>
      <div class="row-between"><span class="hairline" style="flex:1"></span><span class="muted" style="padding:0 var(--s-3)">or</span><span class="hairline" style="flex:1"></span></div>
      <button class="btn ghost full" data-go="S505">Continue with Apple</button>
      <button class="btn ghost full" data-go="S505">Continue with Google</button>
      <button class="btn ghost full" data-go="S505">Hecho SSO</button>
      <div class="hairline"></div>
      <div class="center-col" style="gap:var(--s-2)"><span class="muted">New to Hecho?</span><button class="btn ghost full" data-action="register">Apply to become a retailer</button><button class="btn ghost sm full" data-go="S506">I have an invite</button></div>` });
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
      <div class="center-col" style="height:100%;justify-content:center;gap:var(--s-5)"><div class="proto-spinner"></div><h3>Signing you in</h3><p class="muted">One moment.</p>
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
          <h4>You're all set</h4><p class="muted">Want to see live stock across the 9 brands you manage?</p>
          <button class="btn full" data-go="S708">See live stock</button>
          <button class="btn ghost full" data-action="new-cart">Start a draft</button>
          <button class="btn ghost sm full" data-go="S001">Dismiss</button>
        </div>
      </div>`, flush: true });
  },
};

// Welcome carousel wiring: clickable dots, swipe, gentle auto-advance.
function wireCarousel(root) {
  const car = root.querySelector('#welcomeCarousel');
  if (!car) return;
  const track = car.querySelector('.carousel-track');
  const dots = [...root.querySelectorAll('#welcomeDots .dot')];
  const n = track.children.length;
  let i = 0;
  const go = (k) => { i = (k + n) % n; track.style.transform = `translateX(-${i * 100}%)`; dots.forEach((d, j) => d.classList.toggle('is-on', j === i)); };
  dots.forEach((d) => d.addEventListener('click', () => { go(parseInt(d.dataset.slide, 10)); restart(); }));
  let sx = null;
  car.addEventListener('pointerdown', (e) => { sx = e.clientX; });
  car.addEventListener('pointerup', (e) => { if (sx == null) return; const dx = e.clientX - sx; if (dx < -40) go(i + 1); else if (dx > 40) go(i - 1); sx = null; restart(); });
  if (window._welcomeTimer) clearInterval(window._welcomeTimer);
  const auto = () => { if (state.get('reducedMotion')) return; window._welcomeTimer = setInterval(() => go(i + 1), 3600); };
  const restart = () => { if (window._welcomeTimer) clearInterval(window._welcomeTimer); auto(); };
  auto();
}

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

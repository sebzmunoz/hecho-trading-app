// ============================================================
// App boot + route renderer + global action handling.
// ============================================================
import { state, applyEnvironment } from './state.js';
import { nav, initRouter, TAB_HOME } from './router.js';
import { registry } from './registry.js';
import { initPanel, onRouteChange } from './panel.js';
import { icon } from './icons.js';
import * as C from './components.js';
import { newCartBody, shareBody, addToCartBody, shopLookBody } from './screens/carts.js';
import { filtersBody } from './screens/shop.js';
import { paymentBody, addMethodBody, addCardBody } from './screens/orders.js';
import { registrationBody } from './screens/onboarding.js';
import * as D from './data.js';

const $ = (s) => document.querySelector(s);
const screenFrame = $('#screenFrame');
const appHeader = $('#appHeader');
const screenBody = $('#screenBody');
const screenScroll = $('#screen-scroll');
const netSlot = $('#netSlot');
const tabbarWrap = $('#tabbarWrap');

window.HECHO = { nav, state };

// States these screens render themselves; the generic loading / error
// fallback in renderRoute leaves them alone. (Declared before boot —
// initRouter renders the first route synchronously.)
const SELF_STATES = {
  S001: ['empty'], S003: ['launching'], S004: ['oos'], S006: ['empty'],
  S009: ['closed', 'requested'], S101: ['perm', 'lowlight', 'identifying'],
  S106: ['error'], S201: ['empty'], S202: ['conflict'], S208: ['empty'],
  S301: ['empty'], S308: ['error'], S310: ['empty'], S602: ['empty'],
  S604: ['conflict'], S701: ['empty'], S708: ['low', 'out'],
};

// ---------- boot ----------
C.initOverlays($('#overlayRoot'), $('#toastHost'));
applyEnvironment();
initPanel();
initRouter(renderRoute);
wireChrome();

// ---------- route render ----------
function renderRoute(route, { direction } = {}) {
  if (direction !== 'refresh') state.setEphemeral('_state', null);
  const entry = registry[route.id] || registry.S803;
  const st = state.get('_state');
  const own = (SELF_STATES[entry.id] || []).includes(st);
  let spec;
  try {
    if (st === 'loading' && !own) spec = { title: entry.name, tab: entry.tab, back: true, body: C.skeleton(5) };
    else if (st === 'error' && !own) spec = { title: entry.name, tab: entry.tab, back: true, body: C.fullscreenState({ ic: 'warning', title: 'Something went wrong', body: 'Something went wrong on my end. Try again.', actions: [{ label: 'Try again', action: 'retry' }, { label: 'Get help', ghost: true, go: 'S704' }] }) };
    else spec = entry.render(route.params || {}) || {};
  }
  catch (err) { console.error('render error', route.id, err); spec = registry.S803.render({}); }

  // header
  if (spec.hideHeader) { appHeader.hidden = true; }
  else {
    appHeader.hidden = false;
    const showBack = spec.back || nav.canBack();
    appHeader.classList.toggle('on-camera', !!spec.camera);
    appHeader.innerHTML = `
      ${showBack ? `<button class="back" data-back aria-label="Back">${icon('chevron-left', 22)}</button>` : `<span style="width:8px"></span>`}
      <div class="title">${spec.eyebrow ? `<small>${C.esc(spec.eyebrow)}</small>` : ''}${C.esc(spec.title || '')}</div>
      <div style="display:flex;gap:2px">${spec.headerRight || ''}</div>`;
  }

  // network bar — the panel's per-screen 'offline' state shows it too
  const net = st === 'offline' ? 'offline' : state.get('network');
  netSlot.innerHTML = net === 'offline'
    ? `<div class="offline-bar">${icon('wifi_off', 16)}<span>Offline · changes save locally</span></div>`
    : net === 'slow'
      ? `<div class="offline-bar slow">${icon('clock', 16)}<span>Slow connection</span><button class="act" data-action="go-offline">Offline mode</button></div>`
      : '';

  // body
  screenFrame.classList.toggle('camera', !!spec.camera);
  screenBody.className = 'screen-body' + (spec.flush ? ' flush' : '') + ((direction !== 'refresh' && !state.get('reducedMotion')) ? ' animate-in' : '');
  screenBody.innerHTML = spec.body || '';
  screenScroll.scrollTop = 0;

  // tab bar
  if (spec.noTabbar) tabbarWrap.hidden = true;
  else { tabbarWrap.hidden = false; tabbarWrap.innerHTML = tabbar(spec.tab); }

  // privacy eye — appears only when the screen actually shows sensitive info
  if (!spec.hideHeader && screenBody.querySelector('.mask-inline, .privacy-row')) {
    const on = state.get('privacyOn');
    const actions = appHeader.lastElementChild;
    actions.insertAdjacentHTML('beforeend',
      `<button class="hicon" data-action="privacy-toggle" aria-pressed="${on}"
        aria-label="${on ? 'Privacy on the floor is on. Tap to reveal sensitive values.' : 'Privacy is off. Tap to mask sensitive values.'}">${icon(on ? 'eye-off' : 'eye', 22)}</button>`);
  }

  // wiring
  C.wireScene(screenBody);
  C.wireSteppers(screenBody, () => C.recomputeTotals(screenBody));
  if (spec.onMount) try { spec.onMount(screenBody); } catch (e) { console.error(e); }

  onRouteChange(route);
}

function tabbar(active) {
  const rep = state.get('role') === 'rep';
  const tabs = [
    { id: 'shop', label: 'Shop', ic: 'home' },
    { id: 'scan', label: 'Scan', ic: 'scan' },
    { id: 'carts', label: 'Carts', ic: 'cart' },
    { id: 'orders', label: 'Orders', ic: 'bag' },
    rep ? { id: 'retailers', label: 'Retailers', ic: 'building' } : { id: 'you', label: 'You', ic: 'user' },
  ];
  return `<nav class="tabbar" role="tablist" aria-label="Primary">${tabs.map((t) =>
    `<button class="tab ${t.id === active ? 'is-active' : ''}" data-tab="${t.id}" aria-selected="${t.id === active}"><span class="dot"></span>${icon(t.ic, 24)}<span>${t.label}</span></button>`).join('')}</nav>`;
}

// ---------- global delegation ----------
screenFrame.addEventListener('click', (e) => {
  const goEl = e.target.closest('[data-go]');
  if (goEl && goEl.getAttribute('data-go')) { e.preventDefault(); C.closeAllOverlays(); state.setEphemeral('_state', null); nav.go(goEl.dataset.go); return; }
  const tabEl = e.target.closest('[data-tab]');
  if (tabEl) { e.preventDefault(); C.closeAllOverlays(); state.setEphemeral('_state', null); nav.tab(tabEl.dataset.tab); return; }
  const backEl = e.target.closest('[data-back]');
  if (backEl) { e.preventDefault(); if (!nav.back()) nav.go('S001'); return; }
  const segEl = e.target.closest('.segmented [data-val]');
  if (segEl && segEl.closest('[data-seg]')) { const seg = segEl.closest('[data-seg]'); seg.querySelectorAll('[role=tab]').forEach((b) => b.setAttribute('aria-selected', String(b === segEl))); }
  // chip-group single-select (destination chips, snooze, generic)
  const groupChip = e.target.closest('[data-chipgroup] .chip, .chip[data-snooze]');
  if (groupChip && groupChip.getAttribute('aria-disabled') !== 'true') {
    const group = groupChip.closest('[data-chipgroup]') || groupChip.parentElement;
    group.querySelectorAll('.chip').forEach((c) => c.classList.toggle('is-selected', c === groupChip));
    if (groupChip.dataset.snooze) C.toast(groupChip.dataset.snooze === 'off' ? 'Snooze off' : 'Snoozed');
  }
  const actEl = e.target.closest('[data-action]');
  if (actEl) { e.preventDefault(); handleAction(actEl.dataset.action, actEl, e); }
});

// ---------- actions ----------
function curSource() {
  const id = nav.current().id;
  if (id === 'S102') return 'barcode';
  if (id === 'S106') return 'manual';
  return 'manual';
}

function handleAction(action, el) {
  const T = state.telemetry.bind(state);
  switch (action) {
    // ---- navigation-ish ----
    case 'privacy-toggle': {
      const revealing = state.get('privacyOn');
      state.set({ privacyOn: !revealing });
      if (revealing) T('privacy.reveal', 'toggle', nav.current().id);
      nav.refresh();
      break;
    }
    case 'new-cart': C.openSheet({ title: 'New cart', html: newCartBody() }); break;
    case 'create-cart': C.closeAllOverlays(); T('cart.created', 'manual', 'c-new'); nav.go('S202?cart=c-back'); C.toast('Draft created', { positive: true }); break;
    case 'smart-reorder': C.closeAllOverlays(); T('cart.smart_reorder.accepted', 'order', 'c-back'); nav.go('S202?cart=c-back'); C.toast('Smart reorder ready — accept lines', { positive: true }); break;
    case 'filters': C.openSheet({ title: 'Filters', html: filtersBody() }); break;
    case 'apply-filters': C.closeAllOverlays(); C.toast('Filters applied'); break;
    case 'reset-filters': C.toast('Filters reset'); break;

    // ---- add to cart / look ----
    case 'add-to-cart': C.openSheet({ title: 'Add to cart', html: addToCartBody(el.dataset.p), onMount: (r) => { C.wirePrivacy(r); C.wireSteppers(r); } }); break;
    case 'confirm-add': C.closeAllOverlays(); T('scan.result.added_to_cart', curSource(), el.dataset.p); C.toast('Added to Back wall refresh', { positive: true, action: { label: 'View', fn: () => nav.go('S202?cart=c-back') } }); break;
    case 'shop-the-look': C.openSheet({ title: 'Shop the look', html: shopLookBody(el.dataset.guide) }); break;
    case 'confirm-look': C.closeAllOverlays(); T('scan.result.added_to_cart', 'manual', el.dataset.guide); C.toast('Added the look', { positive: true, action: { label: 'View cart', fn: () => nav.go('S202?cart=c-back') } }); break;
    case 'add-line': C.toast('Added to the retailer\'s draft', { positive: true }); break;

    // ---- share / approve / submit ----
    case 'share-cart': C.openSheet({ title: 'Share draft', html: shareBody() }); break;
    case 'send-share': C.closeAllOverlays(); T('cart.shared', 'cart', el.dataset.cart || 'c-back'); nav.go('S206'); break;
    case 'revoke': C.toast('Share revoked'); break;
    case 'submit-cart':
      if (state.get('taxId') === 'expired') { nav.go('S410'); }
      else nav.go('S204?cart=' + (el.dataset.cart || 'c-back'));
      break;
    case 'confirm-submit':
      if (state.get('network') !== 'online') { C.toast('You\'re offline — reconnect to submit'); break; }
      T('cart.submitted', 'cart', el.dataset.cart || 'c-back'); nav.go('S301'); C.toast('Order submitted', { positive: true });
      break;
    case 'approve-submit': T('cart.approved', 'cart', el.dataset.cart); nav.go('S204?cart=' + (el.dataset.cart || 'c-spring')); break;
    case 'send-back': nav.go('S208'); C.toast('Sent back with notes'); break;

    // ---- payment ----
    case 'confirm-pay':
      if (state.get('network') !== 'online') { C.toast('You\'re offline — reconnect to pay'); break; }
      T('order.paid', 'order', el.dataset.order); nav.go('S305');
      break;
    case 'email-receipt': C.toast('Receipt emailed', { positive: true }); break;
    case 'reemail': C.toast('Invoice re-emailed', { positive: true }); break;

    // ---- privacy ----
    case 'toggle-privacy': state.set({ privacyOn: !state.get('privacyOn') }); nav.refresh(); break;

    // ---- scanning ----
    case 'simulate-scan': T('scan.result.shown', 'barcode', 'p-throw'); nav.go('S102?p=p-throw'); break;
    case 'flash': C.toast('Flash toggled'); break;
    case 'library': C.toast('Opening photo library…'); break;

    // ---- brand ----
    case 'request-access': T('brand.requested_access', 'brand', 'savant'); state.setEphemeral('_state', 'requested'); nav.refresh(); C.toast('Request sent — your rep will follow up', { positive: true }); break;
    case 'save-brand': { const saved = state.toggleSavedBrand(el.dataset.brand); T('brand.saved', 'brand', el.dataset.brand); nav.refresh(); C.toast(saved ? 'Brand saved' : 'Removed from saved'); break; }
    case 'save-template': C.toast('Saved as a personal template', { positive: true }); break;
    case 'remind': C.toast('I\'ll remind you'); break;

    // ---- sharing (full flow) ----
    case 'share': { const label = (document.querySelector('.app-header .title')?.textContent || 'this').trim(); C.openSheet({ title: 'Share', html: C.shareSheetBody(label) }); break; }
    case 'share-rep': C.closeAllOverlays(); nav.go('S606'); C.toast('Shared with your rep', { positive: true }); break;
    case 'share-team': C.openSheet({ title: 'Send to a teammate', html: shareTeamBody() }); break;
    case 'share-team-send': C.closeAllOverlays(); C.toast('Sent', { positive: true }); break;
    case 'share-email': C.closeAllOverlays(); C.toast('Opening your mail composer…'); break;
    case 'share-copy': C.closeAllOverlays(); C.toast('Link copied', { positive: true }); break;

    // ---- payment methods ----
    case 'add-method': C.openSheet({ title: 'Add a payment method', html: addMethodBody() }); break;
    case 'add-card': C.closeAllOverlays(); C.openSheet({ title: 'Add a card', html: addCardBody() }); break;
    case 'save-card': state.addCard({ id: 'm-card2', kind: 'card', label: 'Credit / debit card', sub: '•••• 8210', icon: 'card' }); C.closeAllOverlays(); nav.refresh(); C.toast('Card added', { positive: true }); break;

    // ---- notifications ----
    case 'snooze-custom': C.openSheet({ title: 'Snooze for…', html: snoozeCustomBody() }); break;
    case 'snooze-apply': C.closeAllOverlays(); C.toast('Snoozed'); break;

    // ---- registration & approval ----
    case 'register': C.openSheet({ title: 'Apply to become a retailer', html: registrationBody() }); break;
    case 'submit-registration': C.closeAllOverlays(); C.openModal({ title: 'Application sent', html: '<p>Hecho reviews every new retailer. I\'ll email you the moment your store is approved, then you can place your first order.</p>', actions: [{ label: 'Got it', action: 'close-overlay' }] }); break;
    case 'approve-retailer': { const r = D.repRetailers.find((x) => x.id === (el.dataset.r || state.get('repAccount'))); if (r) { r.status = 'approved'; r.taxId = 'Current'; r.credit = 'Headroom $12k'; } C.closeAllOverlays(); nav.refresh(); C.toast('Retailer approved', { positive: true }); break; }
    case 'flag-conflict': C.toast('Conflict flagged — application on hold for territory review', { positive: true }); break;

    // ---- live stock ----
    case 'refresh-stock': C.toast('Stock refreshed', { positive: true }); break;

    case 'close-overlay': C.closeTopOverlay(); break;
    case 'noop': break;

    // ---- compliance / account ----
    case 'save-taxid': state.set({ taxId: 'current' }); nav.go('S408'); C.toast('Tax ID updated', { positive: true }); break;
    case 'verify': C.toast('Details verified', { positive: true }); break;
    case 'save': C.toast('Saved', { positive: true }); break;
    case 'send-invite': C.toast('Invite sent', { positive: true }); break;
    case 'set-default': C.toast('Default address set'); break;

    // ---- rep ----
    case 'role-switch': {
      const toRep = state.get('role') !== 'rep';
      state.set({ role: toRep ? 'rep' : 'admin' });
      nav.go(toRep ? 'S602' : 'S401', { resetStack: true });
      break;
    }
    case 'pick-rep': state.set({ role: 'rep' }); nav.go('S602', { resetStack: true }); break;
    case 'pick-retailer': state.set({ repAccount: el.dataset.r }); nav.go(el.dataset.then || 'S602'); break;
    case 'pick-retailer-name': {
      const map = { 'Marfa Studio': 'r-marfa', 'Ojai General': 'r-ojai', 'Taos Mercantile': 'r-taos', 'Bisbee Co.': 'r-bisbee' };
      state.set({ repAccount: map[el.dataset.n] || 'r-marfa' }); nav.go('S603'); break;
    }
    case 'record': C.toast('Recording memo…'); break;
    case 'voice': C.toast('Listening…'); break;
    case 'send-msg': C.toast('Message sent', { positive: true }); break;

    // ---- map ----
    case 'pick-booth': nav.go('S709?booth=' + el.dataset.b); break;
    case 'reset-breadcrumb': C.toast('Trail reset'); break;

    // ---- search / ingest ----
    case 'run-search': nav.go('S006?q=' + encodeURIComponent(el.dataset.q || '')); break;
    case 'forward-email': C.toast('Opening mail composer…'); break;
    case 'upload-file': C.toast('Opening file picker…'); break;

    // ---- conflict ----
    case 'pick-conflict': { const opts = el.closest('.cmp'); opts.querySelectorAll('.opt').forEach((o) => o.classList.toggle('is-chosen', o === el)); break; }
    case 'keep-both': C.toast('Kept both as separate lines'); break;
    case 'apply-conflict': nav.go('S202?cart=c-back'); C.toast('Conflict resolved', { positive: true }); break;

    // ---- edge / misc ----
    case 'retry': C.toast('Retrying…'); nav.go('S001'); break;
    case 'open-settings': C.toast('Opening system settings…'); break;
    case 'go-offline': state.set({ network: 'offline' }); applyEnvironment(); nav.refresh(); C.toast('Offline mode on'); break;
    case 'download': C.toast('Downloaded'); break;
    case 'copy': C.toast('Copied'); break;
    case 'open-carrier': C.toast('Opening carrier site…'); break;
    case 'export': C.toast('Report emailed', { positive: true }); break;
    case 'email-support': C.toast('Opening mail to support…'); break;
    case 'mark-read': C.toast('All marked read'); break;
    case 'sign-out': nav.go('S417'); break;
    case 'capture-rma': nav.go('S308'); break;
    case 'capture-doc': C.toast('Document added', { positive: true }); break;
    case 'cart-menu': case 'order-menu': C.openSheet({ title: 'Options', html: `<div class="opts"><button class="opt">${icon('share', 20)} Share</button><button class="opt">${icon('copy', 20)} Duplicate</button><button class="opt">${icon('trash', 20)} Archive</button></div>` }); break;

    default: C.toast('Done'); break;
  }
}

// ---- small sheet bodies used by actions ----
function shareTeamBody() {
  return `<div class="stack tight">${D.companyUsers.filter((u) => !u.self).map((u) =>
    `<label class="share-rec" style="grid-template-columns:auto auto 1fr"><label class="choice" style="margin:0"><input type="checkbox" /><span class="box"></span></label><span class="avatar sm">${u.initials}</span><span class="body"><span class="pri">${C.esc(u.name)}</span><span class="sec">${C.esc(u.role)}</span></span></label>`).join('')}</div>
    <button class="btn full" data-action="share-team-send">Send</button>`;
}
function snoozeCustomBody() {
  return `<p class="muted">Pause all notifications for a custom window.</p>
    <div class="chip-row" data-chipgroup><button class="chip is-selected">2 hours</button><button class="chip">4 hours</button><button class="chip">8 hours</button><button class="chip">2 days</button><button class="chip">3 days</button></div>
    <button class="btn full" data-action="snooze-apply">Apply snooze</button>`;
}

// ---------- chrome (device tools + console drawer) ----------
function wireChrome() {
  $('#toolConsole').addEventListener('click', toggleConsole);
  $('#fabConsole').addEventListener('click', toggleConsole);
  $('#consoleScrim').addEventListener('click', toggleConsole);
  $('#toolBack').addEventListener('click', () => { if (!nav.back()) nav.go('S001'); });
  $('#toolTheme').addEventListener('click', () => {
    const dark = state.get('theme') !== 'dark';
    state.set({ theme: dark ? 'dark' : 'light' }); applyEnvironment();
    $('#toolTheme').setAttribute('aria-pressed', String(dark));
    nav.refresh();
  });
}
function toggleConsole() {
  const shell = $('#appShell');
  if (window.matchMedia('(max-width:1040px)').matches) {
    shell.classList.toggle('console-open');
  } else {
    shell.classList.toggle('console-collapsed');
    $('#fabConsole').hidden = !shell.classList.contains('console-collapsed');
  }
}

import * as C from '../components.js';
import * as D from '../data.js';
import { state } from '../state.js';
import { icon } from '../icons.js';
import { base } from './shop.js';
import { shop } from './shop.js';

export const edge = {
  // S801 Offline (no cache)
  S801() {
    return base('Offline', { noTabbar: true, body: C.fullscreenState({ ic: 'wifi_off', title: "You're offline", body: "You're offline and there's nothing saved yet. Reconnect to load your floor.", actions: [{ label: 'Retry', action: 'retry' }, { label: 'Open Settings', ghost: true, action: 'open-settings' }] }) });
  },

  // S802 Empty (generic, per surface)
  S802() {
    return base('Empty', { back: true, body: `
      ${C.emptyState({ ic: 'draft', title: 'Nothing here yet', body: 'This is the reusable empty pattern every list falls back to.', primary: { label: 'Primary action', go: 'S001' }, secondary: { label: 'Secondary', go: 'S201' } })}
      <p class="muted">Surfaces: ${['Carts — No drafts yet. Scan a shelf or start one by hand.', 'Orders — No orders yet.', 'Search — Nothing matched. Try a SKU or forward the email.'].join(' · ')}</p>` });
  },

  // S803 Generic error
  S803() {
    return base('Something went wrong', { noTabbar: true, body: C.fullscreenState({ ic: 'warning', title: 'Something went wrong', body: 'Something went wrong on my end. Try again.', actions: [{ label: 'Try again', action: 'retry' }, { label: 'Get help', ghost: true, go: 'S704' }] }) });
  },

  // S804 Locked · tier-gated  (delegates to the shop implementation)
  S804(params) { return shop.S804(params); },

  // S805 Locked · tax-ID expired (alias of S410)
  S805() {
    return base('Submit on hold', { noTabbar: true, body: C.fullscreenState({ ic: 'warning', title: 'Tax ID expired', body: "I'm holding this submit until the tax ID is refreshed.", actions: [{ label: 'Resolve', go: 'S409' }, { label: 'Cancel', ghost: true, action: 'back' }] }) });
  },

  // S806 Locked · MOQ not met (modal-style)
  S806() {
    return base('Minimum not met', { noTabbar: true, body: `
      <div class="fullscreen-state"><div class="ico">${icon('cart', 48)}</div><h4>Some brands are under minimum</h4>
        <p>Lavender Thorne is $160 under its minimum. Add a few lines or drop the brand.</p>
        <div class="actions"><button class="btn" data-go="S207">Add suggestions</button><button class="btn ghost" data-back>Cancel</button></div></div>` });
  },

  // S807 Sync conflict resolver
  S807() {
    const p = D.productById['p-throw'];
    return base('Resolve conflict', { noTabbar: true, body: `
      <p class="muted">This draft changed in two places. Pick a value per line, or keep both.</p>
      <div class="conflict">
        <div class="row-between"><b>${p.name}</b><span class="muted">quantity</span></div>
        <div class="cmp">
          <button class="opt is-chosen" data-action="pick-conflict" data-side="mine"><span class="who">Mine</span><span class="qty">12</span></button>
          <button class="opt" data-action="pick-conflict" data-side="theirs"><span class="who">Theirs</span><span class="qty">18</span></button>
        </div>
      </div>
      <button class="btn ghost full" data-action="keep-both">Keep both as separate lines</button>
      <button class="btn full" data-action="apply-conflict">Apply resolution</button>` });
  },

  // S808 Loading skeleton
  S808() {
    return base('Loading', { tab: 'shop', body: C.skeleton(5) });
  },

  // S809 Permission denied (camera / notifications)
  S809() {
    return base('Permission needed', { noTabbar: true, body: C.fullscreenState({ ic: 'camera', title: 'Permission is off', body: 'Turn it back on in Settings, or use the manual workaround.', actions: [{ label: 'Open Settings', action: 'open-settings' }, { label: 'Use workaround', ghost: true, go: 'S106' }] }) });
  },

  // S810 Slow network
  S810() {
    return base('Slow connection', { tab: 'shop', body: `
      ${C.skeleton(3)}
      <div class="offline-bar slow"><span>${icon('clock', 16)}</span><span>This is taking a moment</span><button class="act" data-action="go-offline">Switch to offline mode</button></div>` });
  },
};

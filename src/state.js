// ============================================================
// Reactive prototype state. The Variables panel writes here;
// screens subscribe and re-render so you can watch them react.
// ============================================================

import { lovedSeeds } from './data.js';

const KEY = 'hecho-proto-state-v1';

const DEFAULTS = {
  guest: false,         // "New to Hecho" path — shop now, register at first order
  tier: 'top',          // standard | mid | top  (§TM) — top = you manage all 9 brands
  network: 'online',    // online | offline | slow (§07-A)
  theme: 'light',       // light | dark
  reducedMotion: false,
  savedBrands: [],      // brand ids the buyer saved
  loved: lovedSeeds.map((x) => ({ ...x })), // love list — {p, src, when, note}
  cards: [],            // payment cards added in-session
  stateOverride: null,  // per-screen state forced from the panel
};

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    return { ...DEFAULTS, ...saved, stateOverride: null };
  } catch { return { ...DEFAULTS }; }
}

const data = load();
const subs = new Set();
const telemetryLog = [];
const telSubs = new Set();
let tick = 0;

function persist() {
  const { stateOverride, ...rest } = data;
  try { localStorage.setItem(KEY, JSON.stringify(rest)); } catch {}
}

export const state = {
  get: (k) => (k ? data[k] : { ...data }),

  set(patch, opts = {}) {
    let changed = false;
    for (const k in patch) {
      if (data[k] !== patch[k]) { data[k] = patch[k]; changed = true; }
    }
    if (changed) {
      if (!opts.transient) persist();
      this.emit(opts);
    }
    return changed;
  },

  emit(opts = {}) {
    tick++;
    subs.forEach((fn) => fn(data, opts));
  },

  subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },

  // Set a value WITHOUT persisting or emitting (e.g. the per-screen _state flag).
  setEphemeral(k, v) { data[k] = v; },

  // ---- Telemetry (§07-G). Value is never logged, per the contract. ----
  telemetry(event, source = null, entityId = null) {
    const entry = { event, source, entity_id: entityId, n: telemetryLog.length + 1 };
    telemetryLog.unshift(entry);
    if (telemetryLog.length > 60) telemetryLog.pop();
    telSubs.forEach((fn) => fn(telemetryLog));
  },
  getTelemetry: () => telemetryLog.slice(),
  subscribeTelemetry(fn) { telSubs.add(fn); return () => telSubs.delete(fn); },
  clearTelemetry() { telemetryLog.length = 0; telSubs.forEach((fn) => fn(telemetryLog)); },

  // ---- love list ----
  // Capture is one tap with zero decisions; newest first on the list screen.
  isLoved(pid) { return data.loved.some((x) => x.p === pid); },
  lovedItems() { return data.loved.slice().reverse(); },
  lovedCount() { return data.loved.length; },
  toggleLove(pid, src = 'browse') {
    const i = data.loved.findIndex((x) => x.p === pid);
    if (i >= 0) data.loved.splice(i, 1);
    else data.loved.push({ p: pid, src });
    persist();
    return i < 0;
  },

  // ---- saved brands ----
  isBrandSaved(id) { return data.savedBrands.includes(id); },
  toggleSavedBrand(id) {
    const i = data.savedBrands.indexOf(id);
    if (i >= 0) data.savedBrands.splice(i, 1); else data.savedBrands.push(id);
    persist();
    return this.isBrandSaved(id);
  },

  // ---- payment cards ----
  addCard(card) { data.cards.push(card); persist(); },

  reset() {
    Object.assign(data, JSON.parse(JSON.stringify(DEFAULTS)));
    persist();
    this.emit();
  },
};

// Apply theme / reduced-motion / network to the document root.
export function applyEnvironment() {
  const root = document.documentElement;
  root.setAttribute('data-theme', data.theme);
  root.toggleAttribute('data-reduced', data.reducedMotion);
  if (data.reducedMotion) root.style.setProperty('--proto-rm', '1');
  document.body.classList.toggle('is-offline', data.network !== 'online');
}

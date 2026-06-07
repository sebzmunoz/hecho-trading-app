// ============================================================
// Reactive prototype state. The Variables panel writes here;
// screens subscribe and re-render so you can watch them react.
// ============================================================

const KEY = 'hecho-proto-state-v1';

const DEFAULTS = {
  role: 'owner',        // owner | manager | member | rep   (§02b)
  privacyOn: true,      // Privacy on the floor — ON by default (§07-D)
  gesture: 'hold',      // hold | tap | double | off
  pos: 'connected',     // connected | connecting | disconnected (§07-H H3)
  tier: 'mid',          // standard | mid | top  (§TM)
  taxId: 'renews',      // current | renews | expired (F10)
  network: 'online',    // online | offline | slow (§07-A)
  theme: 'light',       // light | dark
  reducedMotion: false,
  repAccount: 'r-marfa',// current retailer in Rep mode
  stateOverride: null,  // per-screen state forced from the panel
};

// Capabilities per role (§02b roles & capabilities matrix)
const CAPS = {
  owner:   { submit: true,  approve: true,  grantApprove: true, compliance: true, pay: true, users: true },
  manager: { submit: false, approve: false, grantApprove: false, compliance: 'view', pay: false, users: false },
  member:  { submit: false, approve: false, grantApprove: false, compliance: 'view', pay: false, users: false },
  rep:     { submit: 'grant', approve: false, grantApprove: false, compliance: 'view', pay: false, users: false },
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
  caps: () => CAPS[data.role] || CAPS.owner,

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

  reset() {
    Object.assign(data, DEFAULTS);
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

// ============================================================
// Screen registry — every screen ID → render fn + metadata.
// Mirrors §04 Screen inventory. `states` drives the panel's
// per-screen state switcher so every documented state has a frame.
// ============================================================
import { shop } from './screens/shop.js';
import { love } from './screens/love.js';
import { scan } from './screens/scan.js';
import { carts } from './screens/carts.js';
import { orders } from './screens/orders.js';
import { you } from './screens/you.js';
import { onboarding } from './screens/onboarding.js';
import { system } from './screens/system.js';
import { edge } from './screens/edge.js';

const modules = { ...shop, ...love, ...scan, ...carts, ...orders, ...you, ...onboarding, ...system, ...edge };

// Common state sets
const S = (...x) => x;

// id → { name, group, tab, states }
const META = {
  // ---- Shop ----
  S001: { name: 'Main screen', group: 'Shop', tab: 'shop', states: S('default', 'loading', 'empty', 'offline', 'error') },
  S003: { name: 'Brand page', group: 'Shop', tab: 'shop', states: S('default', 'locked', 'launching', 'loading', 'offline') },
  S004: { name: 'Product detail', group: 'Shop', tab: 'shop', states: S('default', 'oos', 'locked', 'loading', 'offline') },
  S005: { name: 'Search', group: 'Shop', tab: 'shop', states: S('default') },
  S006: { name: 'Search results', group: 'Shop', tab: 'shop', states: S('default', 'empty', 'loading', 'offline') },
  S007: { name: 'Category index', group: 'Shop', tab: 'shop', states: S('default', 'loading', 'offline') },
  S008: { name: 'Filters sheet', group: 'Shop', tab: 'shop', states: S('default') },
  S009: { name: 'Brand launch detail', group: 'Shop', tab: 'shop', states: S('default', 'closed') },
  S010: { name: 'Love list', group: 'Shop', tab: 'shop', states: S('default', 'empty', 'loading', 'offline') },
  S011: { name: 'Love list → cart', group: 'Shop', tab: 'shop', states: S('default') },
  // ---- Scan ----
  S101: { name: 'Scanner viewfinder', group: 'Scan', tab: 'scan', states: S('default', 'identifying', 'lowlight', 'perm', 'offline') },
  S105: { name: 'Permission denied (camera)', group: 'Scan', tab: 'scan', states: S('default') },
  S106: { name: 'Manual SKU entry', group: 'Scan', tab: 'scan', states: S('default', 'error', 'offline') },
  // ---- Carts ----
  S201: { name: 'Carts index', group: 'Carts', tab: 'carts', states: S('default', 'empty', 'loading', 'offline') },
  S202: { name: 'Cart detail', group: 'Carts', tab: 'carts', states: S('default', 'conflict', 'offline') },
  S203: { name: 'New cart sheet', group: 'Carts', tab: 'carts', states: S('default') },
  S204: { name: 'Cart submit', group: 'Carts', tab: 'carts', states: S('default', 'offline', 'error') },
  S207: { name: 'MOQ-not-met state', group: 'Carts', tab: 'carts', states: S('default') },
  // ---- Orders ----
  S301: { name: 'Orders index', group: 'Orders', tab: 'orders', states: S('default', 'empty', 'loading', 'offline') },
  S302: { name: 'Order detail', group: 'Orders', tab: 'orders', states: S('default', 'offline', 'error') },
  S303: { name: 'Invoice viewer', group: 'Orders', tab: 'orders', states: S('default', 'loading', 'offline') },
  S304: { name: 'Payment sheet', group: 'Orders', tab: 'orders', states: S('default', 'offline', 'error') },
  S304a: { name: 'ACH onboarding', group: 'Orders', tab: 'orders', states: S('default') },
  S305: { name: 'Payment success', group: 'Orders', tab: 'orders', states: S('default') },
  S306: { name: 'Tracking detail', group: 'Orders', tab: 'orders', states: S('default', 'offline') },
  // ---- Account ----
  S401: { name: 'Account & settings', group: 'Account', tab: 'you', states: S('default', 'offline') },
  S402: { name: 'My details', group: 'Account', tab: 'you', states: S('default') },
  S411: { name: 'Notification settings', group: 'Account', tab: 'you', states: S('default') },
  S417: { name: 'Sign out', group: 'Account', tab: 'you', states: S('default') },
  // ---- Onboarding ----
  S501: { name: 'Splash', group: 'Onboarding', tab: null, states: S('default') },
  S502: { name: 'Entry — current or new customer', group: 'Onboarding', tab: null, states: S('default') },
  S503: { name: 'Sign in — email', group: 'Onboarding', tab: null, states: S('default') },
  S504: { name: 'Verification code', group: 'Onboarding', tab: null, states: S('default') },
  S507: { name: 'Camera permission prompt', group: 'Onboarding', tab: null, states: S('default') },
  S508: { name: 'Notification permission prompt', group: 'Onboarding', tab: null, states: S('default') },
  S510: { name: 'First showroom-visit cue', group: 'Onboarding', tab: null, states: S('default') },
  // ---- System & cross-cutting ----
  S701: { name: 'Notifications center', group: 'System', tab: null, states: S('default', 'empty', 'offline') },
  S702: { name: 'Notification settings', group: 'System', tab: null, states: S('default') },
  S703: { name: 'Global search', group: 'System', tab: null, states: S('default') },
  S704: { name: 'Contact us', group: 'System', tab: null, states: S('default') },
  S706: { name: 'Brand directory', group: 'System', tab: null, states: S('default') },
  S710: { name: 'Brand-launch arrival', group: 'System', tab: null, states: S('default') },
  // ---- Edge & state ----
  S801: { name: 'Offline (no cache)', group: 'Edge & states', tab: null, states: S('default') },
  S802: { name: 'Empty', group: 'Edge & states', tab: null, states: S('default') },
  S803: { name: 'Generic error', group: 'Edge & states', tab: null, states: S('default') },
  S804: { name: 'Locked · tier-gated', group: 'Edge & states', tab: null, states: S('default', 'requested') },
  S806: { name: 'Locked · MOQ not met', group: 'Edge & states', tab: null, states: S('default') },
  S807: { name: 'Sync conflict resolver', group: 'Edge & states', tab: null, states: S('default') },
  S808: { name: 'Loading skeleton', group: 'Edge & states', tab: null, states: S('default') },
  S809: { name: 'Permission denied', group: 'Edge & states', tab: null, states: S('default') },
  S810: { name: 'Slow network', group: 'Edge & states', tab: null, states: S('default') },
};

export const registry = {};
for (const id in META) {
  registry[id] = { id, ...META[id], render: modules[id] };
}

// Grouped list for the Screens panel (preserves §04 order)
export const GROUP_ORDER = ['Shop', 'Scan', 'Carts', 'Orders', 'Account', 'Onboarding', 'System', 'Edge & states'];
export function groupedScreens() {
  const out = {};
  GROUP_ORDER.forEach((g) => (out[g] = []));
  for (const id in registry) out[registry[id].group].push(registry[id]);
  return out;
}
export const SCREEN_COUNT = Object.keys(registry).length;

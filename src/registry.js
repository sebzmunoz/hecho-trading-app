// ============================================================
// Screen registry — every screen ID → render fn + metadata.
// Mirrors §04 Screen inventory. `states` drives the panel's
// per-screen state switcher so every documented state has a frame.
// ============================================================
import { shop } from './screens/shop.js';
import { scan } from './screens/scan.js';
import { carts } from './screens/carts.js';
import { orders } from './screens/orders.js';
import { you } from './screens/you.js';
import { onboarding } from './screens/onboarding.js';
import { rep } from './screens/rep.js';
import { system } from './screens/system.js';
import { edge } from './screens/edge.js';

const modules = { ...shop, ...scan, ...carts, ...orders, ...you, ...onboarding, ...rep, ...system, ...edge };

// Common state sets
const S = (...x) => x;
const BASE = S('default', 'loading', 'error', 'offline');

// id → { name, group, tab, states }
const META = {
  // ---- Shop ----
  S001: { name: 'Shop home', group: 'Shop', tab: 'shop', states: S('default', 'loading', 'empty', 'offline', 'error') },
  S002: { name: 'Style guide detail', group: 'Shop', tab: 'shop', states: BASE },
  S003: { name: 'Brand page', group: 'Shop', tab: 'shop', states: S('default', 'locked', 'launching', 'loading', 'offline') },
  S004: { name: 'Product detail', group: 'Shop', tab: 'shop', states: S('default', 'oos', 'locked', 'loading', 'offline') },
  S005: { name: 'Search', group: 'Shop', tab: 'shop', states: S('default') },
  S006: { name: 'Search results', group: 'Shop', tab: 'shop', states: S('default', 'empty', 'loading', 'offline') },
  S007: { name: 'Category index', group: 'Shop', tab: 'shop', states: S('default', 'loading', 'offline') },
  S008: { name: 'Filters sheet', group: 'Shop', tab: 'shop', states: S('default') },
  S009: { name: 'Brand launch detail', group: 'Shop', tab: 'shop', states: S('default', 'closed') },
  // ---- Scan ----
  S101: { name: 'Scanner viewfinder', group: 'Scan', tab: 'scan', states: S('default', 'identifying', 'lowlight', 'perm', 'offline') },
  S102: { name: 'Scan result', group: 'Scan', tab: 'scan', states: S('default') },
  S103: { name: 'Photo recognition', group: 'Scan', tab: 'scan', states: S('default') },
  S104: { name: 'Photo result', group: 'Scan', tab: 'scan', states: S('default', 'nomatch') },
  S105: { name: 'Permission denied (camera)', group: 'Scan', tab: 'scan', states: S('default') },
  S106: { name: 'Manual SKU entry', group: 'Scan', tab: 'scan', states: S('default', 'error', 'offline') },
  // ---- Carts ----
  S201: { name: 'Carts index', group: 'Carts', tab: 'carts', states: S('default', 'empty', 'loading', 'offline') },
  S202: { name: 'Cart detail', group: 'Carts', tab: 'carts', states: S('default', 'conflict', 'offline') },
  S203: { name: 'New cart sheet', group: 'Carts', tab: 'carts', states: S('default') },
  S204: { name: 'Cart submit', group: 'Carts', tab: 'carts', states: S('default', 'offline', 'error') },
  S205: { name: 'Cart share sheet', group: 'Carts', tab: 'carts', states: S('default') },
  S206: { name: 'Share / approval confirmation', group: 'Carts', tab: 'carts', states: S('default') },
  S207: { name: 'MOQ-not-met state', group: 'Carts', tab: 'carts', states: S('default') },
  S208: { name: 'Approval inbox', group: 'Carts', tab: 'carts', states: S('default', 'empty') },
  S209: { name: 'Approval review', group: 'Carts', tab: 'carts', states: S('default') },
  S210: { name: 'Privacy toggle', group: 'Carts', tab: 'carts', states: S('default') },
  S211: { name: 'Add to cart sheet', group: 'Carts', tab: 'carts', states: S('default') },
  S212: { name: 'Shop the look sheet', group: 'Carts', tab: 'carts', states: S('default') },
  // ---- Orders ----
  S301: { name: 'Orders index', group: 'Orders', tab: 'orders', states: S('default', 'empty', 'loading', 'offline') },
  S302: { name: 'Order detail', group: 'Orders', tab: 'orders', states: S('default', 'offline', 'error') },
  S303: { name: 'Invoice viewer', group: 'Orders', tab: 'orders', states: S('default', 'loading', 'offline') },
  S304: { name: 'Payment sheet', group: 'Orders', tab: 'orders', states: S('default', 'offline', 'error') },
  S304a: { name: 'ACH onboarding', group: 'Orders', tab: 'orders', states: S('default') },
  S305: { name: 'Payment success', group: 'Orders', tab: 'orders', states: S('default') },
  S306: { name: 'Tracking detail', group: 'Orders', tab: 'orders', states: S('default', 'offline') },
  S307: { name: 'Damage / RMA start', group: 'Orders', tab: 'orders', states: S('default') },
  S308: { name: 'RMA submit / review', group: 'Orders', tab: 'orders', states: S('default', 'error') },
  S309: { name: 'RMA submitted', group: 'Orders', tab: 'orders', states: S('default') },
  S310: { name: 'RMA history', group: 'Orders', tab: 'orders', states: S('default', 'empty') },
  // ---- You ----
  S401: { name: 'You overview', group: 'You', tab: 'you', states: S('default', 'offline') },
  S402: { name: 'My details', group: 'You', tab: 'you', states: S('default') },
  S403: { name: 'Address book', group: 'You', tab: 'you', states: S('default') },
  S404: { name: 'Address detail / add', group: 'You', tab: 'you', states: S('default') },
  S405: { name: 'Company users', group: 'You', tab: 'you', states: S('default') },
  S406: { name: 'Invite user', group: 'You', tab: 'you', states: S('default') },
  S407: { name: 'Roles & permissions', group: 'You', tab: 'you', states: S('default') },
  S408: { name: 'Compliance hub', group: 'You', tab: 'you', states: S('default') },
  S409: { name: 'Tax-ID upload', group: 'You', tab: 'you', states: S('default') },
  S410: { name: 'Tax-ID hold', group: 'You', tab: 'you', states: S('default') },
  S411: { name: 'Notification settings', group: 'You', tab: 'you', states: S('default') },
  S412: { name: 'Privacy on the floor settings', group: 'You', tab: 'you', states: S('default') },
  S413: { name: 'Connected POS', group: 'You', tab: 'you', states: S('default') },
  S414: { name: 'POS OAuth flow', group: 'You', tab: 'you', states: S('default') },
  S415: { name: 'POS disconnect confirm', group: 'You', tab: 'you', states: S('default') },
  S416: { name: 'Reports', group: 'You', tab: 'you', states: S('default') },
  S417: { name: 'Sign out', group: 'You', tab: 'you', states: S('default') },
  // ---- Onboarding ----
  S501: { name: 'Splash', group: 'Onboarding', tab: null, states: S('default') },
  S502: { name: 'Welcome (3 cards)', group: 'Onboarding', tab: null, states: S('default') },
  S503: { name: 'Sign in', group: 'Onboarding', tab: null, states: S('default') },
  S504: { name: 'Magic link sent', group: 'Onboarding', tab: null, states: S('default') },
  S505: { name: 'Email verification', group: 'Onboarding', tab: null, states: S('default') },
  S506: { name: 'Account picker', group: 'Onboarding', tab: null, states: S('default') },
  S507: { name: 'Camera permission prompt', group: 'Onboarding', tab: null, states: S('default') },
  S508: { name: 'Notification permission prompt', group: 'Onboarding', tab: null, states: S('default') },
  S509: { name: 'POS connect invite', group: 'Onboarding', tab: null, states: S('default') },
  S510: { name: 'First showroom-visit cue', group: 'Onboarding', tab: null, states: S('default') },
  // ---- Rep ----
  S601: { name: 'Rep account picker', group: 'Rep mode', tab: 'retailers', states: S('default') },
  S602: { name: 'Rep dashboard', group: 'Rep mode', tab: 'retailers', states: S('default', 'empty') },
  S603: { name: 'Rep retailer profile', group: 'Rep mode', tab: 'retailers', states: S('default') },
  S604: { name: 'Rep cart co-shop', group: 'Rep mode', tab: 'retailers', states: S('default', 'conflict') },
  S605: { name: 'Rep visit memo', group: 'Rep mode', tab: 'retailers', states: S('default') },
  S606: { name: 'Rep chat with retailer', group: 'Rep mode', tab: 'retailers', states: S('default') },
  // ---- System & cross-cutting ----
  S701: { name: 'Notifications center', group: 'System', tab: null, states: S('default', 'empty', 'offline') },
  S702: { name: 'Notification settings', group: 'System', tab: null, states: S('default') },
  S703: { name: 'Global search', group: 'System', tab: null, states: S('default') },
  S704: { name: 'Help & support', group: 'System', tab: null, states: S('default') },
  S705: { name: 'Style-guide gallery', group: 'System', tab: null, states: S('default') },
  S706: { name: 'Brand directory', group: 'System', tab: null, states: S('default') },
  S707: { name: 'Privacy holding state', group: 'System', tab: null, states: S('default') },
  S708: { name: 'Live stock board', group: 'System', tab: null, states: S('default', 'low', 'out') },
  S709: { name: 'Brand from QR', group: 'System', tab: null, states: S('default') },
  S710: { name: 'Brand-launch arrival', group: 'System', tab: null, states: S('default') },
  // ---- Edge & state ----
  S801: { name: 'Offline (no cache)', group: 'Edge & states', tab: null, states: S('default') },
  S802: { name: 'Empty', group: 'Edge & states', tab: null, states: S('default') },
  S803: { name: 'Generic error', group: 'Edge & states', tab: null, states: S('default') },
  S804: { name: 'Locked · tier-gated', group: 'Edge & states', tab: null, states: S('default', 'requested') },
  S805: { name: 'Locked · tax-ID expired', group: 'Edge & states', tab: null, states: S('default') },
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
export const GROUP_ORDER = ['Shop', 'Scan', 'Carts', 'Orders', 'You', 'Onboarding', 'Rep mode', 'System', 'Edge & states'];
export function groupedScreens() {
  const out = {};
  GROUP_ORDER.forEach((g) => (out[g] = []));
  for (const id in registry) out[registry[id].group].push(registry[id]);
  return out;
}
export const SCREEN_COUNT = Object.keys(registry).length;

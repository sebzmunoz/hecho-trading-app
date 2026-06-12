// ============================================================
// Hash router + in-device back stack + deep-link / QR scheme.
// Routes look like "S004?p=p-lulu". The renderer is injected.
// ============================================================

let renderFn = null;
let suppress = false;
const stack = [];                 // history of {id, params, query}
export const TAB_HOME = { shop: 'S001', scan: 'S101', carts: 'S201', orders: 'S301', you: 'S401', retailers: 'S602' };

function parseRoute(str) {
  // accept "S004?p=x" | "#/S004?p=x" | deep links
  let s = String(str).trim();
  s = translateDeepLink(s);
  s = s.replace(/^#\/?/, '');
  const [id, query = ''] = s.split('?');
  const params = {};
  query.split('&').forEach((kv) => { if (!kv) return; const [k, v] = kv.split('='); params[decodeURIComponent(k)] = decodeURIComponent(v || ''); });
  return { id: id || 'S001', params, query };
}

// §07-C deep linking: push scheme + showroom QR
function translateDeepLink(s) {
  if (s.startsWith('hecho://')) {
    const path = s.slice('hecho://'.length);
    const [seg, id] = path.split('/');
    const map = {
      orders: (i) => `S302?order=${i}`,
      carts: (i) => `S202?cart=${i}`,
      brands: (i) => `S003?brand=${i}`,
      'style-guides': (i) => `S002?guide=${i}`,
      compliance: () => `S408`,
    };
    if (seg === 'compliance') return 'S408';
    if (map[seg]) return map[seg](id);
    return 'S001';
  }
  // Showroom QR: https://qr.hecho.app/booth/{showroomId}/{boothId}
  const qr = s.match(/qr\.hecho\.app\/booth\/([^/]+)\/([^/?#]+)/);
  if (qr) return `S709?showroom=${qr[1]}&booth=${qr[2]}`;
  return s;
}

function setHash(route) {
  suppress = true;
  location.hash = '#/' + route;
  setTimeout(() => { suppress = false; }, 0);
}

function routeToString(r) {
  return r.query ? `${r.id}?${r.query}` : r.id;
}

export const nav = {
  go(route, { replace = false, resetStack = false } = {}) {
    const r = parseRoute(route);
    if (resetStack) stack.length = 0;
    if (replace && stack.length) stack[stack.length - 1] = r;
    else stack.push(r);
    setHash(routeToString(r));
    renderFn && renderFn(r, { direction: 'forward' });
  },
  back() {
    if (stack.length > 1) {
      stack.pop();
      const r = stack[stack.length - 1];
      setHash(routeToString(r));
      renderFn && renderFn(r, { direction: 'back' });
      return true;
    }
    return false;
  },
  // switch tab → go to that tab's home (resetting the stack to that tab)
  tab(tabId) {
    const home = TAB_HOME[tabId];
    if (home) this.go(home, { resetStack: true });
  },
  current() { return stack[stack.length - 1] || parseRoute('S001'); },
  canBack() { return stack.length > 1; },
  // re-render current route (used when a Variable changes)
  refresh() { const r = this.current(); renderFn && renderFn(r, { direction: 'refresh' }); },
};

export function initRouter(fn) {
  renderFn = fn;
  window.addEventListener('hashchange', () => {
    if (suppress) return;
    const r = parseRoute(location.hash || '#/S001');
    // ignore echoes of programmatic navs that land after their suppress
    // window (e.g. two nav.go calls back-to-back) — the route is already top
    const top = stack[stack.length - 1];
    if (top && routeToString(top) === routeToString(r)) return;
    stack.push(r);
    renderFn && renderFn(r, { direction: 'forward' });
  });
  // initial route
  const initial = location.hash ? parseRoute(location.hash) : parseRoute('S001');
  stack.push(initial);
  renderFn && renderFn(initial, { direction: 'init' });
}

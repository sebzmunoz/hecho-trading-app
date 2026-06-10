import * as C from '../components.js';
import * as D from '../data.js';
import { state } from '../state.js';
import { icon } from '../icons.js';

const visibleBrands = () => D.brands.filter((b) => D.canSee(b, state.get('tier')));

export const shop = {
  // S001 Main screen — one calm hub: search, scan, the nine brands.
  // Love list + carts + account live top right; everything else is a spoke.
  S001() {
    const lovedN = state.lovedCount();
    const cartN = D.carts.filter((c) => c.section === 'mine').length;
    const top = `
      <div class="home-top">
        <svg viewBox="0 0 463 168" style="width:92px;height:auto;color:var(--accent)" aria-label="HECHO"><use href="#hecho-mark"/></svg>
        <span class="ht-actions">${C.hActions([
          { icon: 'heart', go: 'S010', label: 'Love list', badge: lovedN ? String(lovedN) : '' },
          { icon: 'cart', go: 'S201', label: 'Carts', badge: cartN ? String(cartN) : '' },
          { icon: 'user', go: 'S401', label: 'Account & settings' },
        ])}</span>
      </div>`;
    if (state.get('_state') === 'empty') {
      return base('', { hideHeader: true, body: top +
        C.emptyState({ ic: 'home', title: 'The floor is empty', body: 'No brands are live for your account yet. Your rep is on it.', primary: { label: 'Get help', go: 'S704' } }) });
    }
    const body = `
      ${top}
      <div class="search" data-go="S005"><span>${icon('search', 20)}</span><span class="muted" style="flex:1">Search name, SKU, or barcode</span></div>
      <button class="scan-cta" data-go="S101">
        <span class="sc-ic">${icon('scan', 30)}</span>
        <span class="sc-body"><b>Scan a product</b><span>Point at any barcode on the floor</span></span>
      </button>
      ${C.sectionLabel('The nine brands')}
      <div class="brand-grid">${D.brands.map((b) => C.brandTile(b)).join('')}</div>
      <div class="grid-2"><button class="btn ghost sm" data-go="S705">Style guides</button><button class="btn ghost sm" data-go="S708">Live stock</button></div>`;
    return base('', { hideHeader: true, body });
  },

  // S002 Style guide detail — the illustration IS the shop surface: every
  // piece in the scene carries a tappable marker (no product list below).
  S002(params) {
    const g = D.styleGuideById[params.guide] || D.styleGuides[0];
    const lines = g.lines.map((id) => D.productById[id]).filter(Boolean);
    const setTotal = lines.reduce((s, p) => s + p.wholesale, 0);
    const body = `
      <div class="card" style="padding:0;overflow:visible;max-width:none;border-radius:var(--r-4)">
        ${C.sceneArt(g, { interactive: true, scale: 1.05 })}
      </div>
      <div class="row-between"><span class="scene-hint"><i></i> Tap a marker to shop the piece</span>
        <span class="muted" style="font-size:var(--fs-nano)">${lines.length} pieces · ${C.maskField('$' + setTotal + ' the set', 'wholesale')}</span></div>
      <div><small class="section-label">${g.season} · ${g.theme}</small><h3 style="margin-top:var(--s-1)">${g.title}</h3></div>
      <p class="muted">${g.blurb}</p>
      <div class="chip-row">${g.brands.map((b) => C.brandChip(b)).join('')}</div>
      <div class="sticky-actions"><button class="btn ghost" data-action="save-template">Save look</button><button class="btn" data-action="shop-the-look" data-guide="${g.id}">Shop the look</button></div>`;
    return base(g.title, { back: true, headerRight: C.hActions([{ icon: 'share', action: 'share', label: 'Share' }]), body });
  },

  // S003 Brand page — category cards first; products live one level down
  // (S003?brand=x&cat=y). 'all' is the everything view.
  S003(params) {
    const b = D.brandById[params.brand] || D.brands[0];
    if (!D.canSee(b, state.get('tier'))) return shop.S804({ brand: b.id });
    const prods = D.productsByBrand(b.id);
    const saved = state.isBrandSaved(b.id);

    // category view: the products themselves
    if (params.cat) {
      const all = params.cat === 'all';
      const list = all ? prods : prods.filter((p) => p.cat === params.cat);
      const body = `
        <div class="grid-2">${list.map((p) => C.productCard(p)).join('')}</div>
        ${list.length ? '' : C.emptyState({ ic: 'tag', title: 'Nothing here yet', body: 'This category is empty for now.' })}`;
      return base(all ? 'All products' : params.cat, { back: true, eyebrow: b.name, headerRight: C.hActions([{ icon: 'search', go: 'S005' }]), body });
    }

    const cats = [...new Set(prods.map((p) => p.cat))];
    const catCards = cats.map((cat) => {
      const inCat = prods.filter((p) => p.cat === cat);
      return `<button class="card cat-card" data-go="S003?brand=${b.id}&cat=${encodeURIComponent(cat)}">
        <span class="thumb-illo cc-art">${C.illo(inCat[0].illo, 36)}</span>
        <b>${C.esc(cat)}</b><span class="muted">${inCat.length} product${inCat.length > 1 ? 's' : ''}</span></button>`;
    }).join('');
    const body = `
      <div class="thumb-illo" style="border-radius:var(--r-4);padding:var(--s-6)">${C.illo(prods[0]?.illo || 'jar', 96)}</div>
      <h3>${b.name}</h3>
      ${b.launching ? C.banner(`<b>First-look open now.</b> New collection pinned below.`, { kind: '', ic: 'sparkle', action: { label: 'The drop', go: `S009?brand=${b.id}` } }) : ''}
      <p class="muted">${b.story}</p>
      <div class="row-between"><span class="moq">${icon('cart', 12)}MOQ $${b.moq}</span>
        <button class="chip ${saved ? 'is-selected' : ''}" data-action="save-brand" data-brand="${b.id}" aria-pressed="${saved}">${icon('star', 13)} ${saved ? 'Saved' : 'Save brand'}</button></div>
      ${C.sectionLabel('Shop by category')}
      <div class="grid-2">${catCards}
        <button class="card cat-card" data-go="S003?brand=${b.id}&cat=all">
          <span class="thumb-illo cc-art">${icon('grid', 28)}</span>
          <b>All products</b><span class="muted">${prods.length} total</span></button>
      </div>`;
    return base(b.name, { back: true, headerRight: C.hActions([{ icon: 'search', go: 'S005' }, { icon: 'share', action: 'share' }]), body });
  },

  // S004 Product detail
  S004(params) {
    const p = D.productById[params.p] || D.products[0];
    const b = D.brandById[p.brand];
    if (!D.canSee(b, state.get('tier'))) return shop.S804({ brand: b.id });
    const variantOut = state.get('_state') === 'oos';
    const rec = D.recommendedQty(p, state.get('pos') === 'connected');
    // Variant alternates coherent with the product's category — never apparel
    // sizes on a candle. Last alternate renders OOS in the 'oos' state.
    const ALTS = { Textiles: ['Clay', 'Dune'], Body: ['4 oz', '8 oz'], Stationery: ['Assorted 20'], Gifts: ['Box of 40'], Home: ['Terracotta', 'Sage'], Jewelry: ['Silver', 'Rose gold'], Bags: ['Olive', 'Black'], Novelty: ['Blue', 'Mint'], Candles: ['14 oz'] };
    const alts = (ALTS[p.cat] || []).filter((a) => a !== p.variant);
    const variantChips = [
      `<button class="chip is-selected">${p.variant}</button>`,
      ...alts.map((a, i) => (variantOut && i === alts.length - 1)
        ? `<button class="chip" aria-disabled="true" style="opacity:.5">${a} · OOS</button>`
        : `<button class="chip">${a}</button>`),
    ].join('');
    const body = `
      <div class="photo-frame r-1-1"><div class="ph">${C.illo(p.illo, 120)}</div></div>
      <div><button class="chip" data-go="S003?brand=${p.brand}">${b.name}</button></div>
      <h3>${p.name}</h3>
      ${C.sectionLabel('Variant')}
      <div class="chip-row" data-chipgroup>${variantChips}</div>
      <div class="card" style="max-width:none">
        <div class="row-between"><span class="muted">Your price</span>${p.map ? `<span class="pill">${icon('info', 12)} MAP $${p.msrp}</span>` : ''}</div>
        <div class="row-between"><span></span>${C.pricePair(p)}</div>
        ${C.stockRow(p)}
        <div class="hairline"></div>
        <div class="row-between"><span class="muted">Margin at MSRP</span>${C.maskField(`${Math.round((1 - p.wholesale / p.msrp) * 100)}%`, 'spend')}</div>
        <p class="muted" style="font-size:var(--fs-nano)">${rec ? `Behavior model: ${C.esc(D.whyString(p, state.get('pos') === 'connected'))}` : 'Connect a POS for a reorder recommendation.'}</p>
      </div>
      ${state.get('pos') !== 'connected' ? C.softPitch() : ''}
      <div class="sticky-actions"><button class="btn ghost" data-action="love-toggle" data-p="${p.id}" data-src="browse" aria-pressed="${state.isLoved(p.id)}">${icon(state.isLoved(p.id) ? 'heart-fill' : 'heart', 16)} ${state.isLoved(p.id) ? 'Loved' : 'Love'}</button><button class="btn" data-action="add-to-cart" data-p="${p.id}">Add to cart${rec ? ` · ${C.maskField(String(rec), 'recommended')}` : ''}</button></div>`;
    return base(p.name, { back: true, headerRight: C.hActions([{ icon: 'share', action: 'share' }]), body });
  },

  // S005 Search
  S005() {
    const body = `
      <div class="search" id="searchField"><span>${icon('search', 20)}</span><input placeholder="Name, SKU, or barcode" aria-label="Search" /><button class="hicon" data-action="voice" aria-label="Voice search" style="width:32px;height:32px">${icon('mic', 18)}</button></div>
      ${C.sectionLabel('Recent')}
      <div class="chip-row">${D.recentSearches.map((s) => `<button class="chip" data-action="run-search" data-q="${C.esc(s)}">${C.esc(s)}</button>`).join('')}</div>
      ${C.sectionLabel('Trending')}
      <div class="chip-row">${D.trendingChips.map((s) => `<button class="chip" data-action="run-search" data-q="${C.esc(s)}">${C.esc(s)}</button>`).join('')}</div>
      <div class="grid-2"><button class="btn ghost" data-go="S101">Scan instead</button><button class="btn ghost" data-go="S007">Browse categories</button></div>`;
    return base('Search', { back: true, body, onMount: (root) => { const i = root.querySelector('input'); i && i.addEventListener('keydown', (e) => { if (e.key === 'Enter') window.HECHO.nav.go('S006?q=' + encodeURIComponent(i.value)); }); } });
  },

  // S006 Search results
  S006(params) {
    const q = params.q || 'knit';
    if (state.get('_state') === 'empty') {
      return base(`"${q}"`, { back: true, body: `${noResults()}` });
    }
    const matchBrands = visibleBrands().filter((b) => b.name.toLowerCase().includes(String(q).toLowerCase())).slice(0, 2);
    const matchProds = D.products.filter((p) => p.name.toLowerCase().includes(String(q).toLowerCase()) || true).slice(0, 6);
    const body = `
      <div class="search" data-go="S005"><span>${icon('search', 20)}</span><span class="muted" style="flex:1">${C.esc(q)}</span></div>
      <div class="chip-row"><button class="chip" data-action="filters">${icon('filter', 14)} Filters</button>${visibleBrands().slice(0, 4).map((b) => `<button class="chip">${b.name}</button>`).join('')}</div>
      ${matchBrands.length ? C.sectionLabel('Brands') + '<div class="stack tight">' + matchBrands.map((b) => C.listRow({ thumbIcon: 'building', pri: b.name, sec: b.cats.join(' · '), go: `S003?brand=${b.id}` })).join('') + '</div>' : ''}
      ${C.sectionLabel('Products')}
      <div class="stack tight">${matchProds.map((p) => C.listRow({ thumb: `<span class="thumb-illo" style="width:44px;height:44px;border-radius:var(--r-2)">${C.illo(p.illo, 24)}</span>`, pri: p.name, sec: D.brandById[p.brand].name, trail: `${C.loveBtn(p.id)}<span class="btn sm icon-only" role="button" tabindex="0" data-action="add-to-cart" data-p="${p.id}" aria-label="Quick add">${icon('plus', 16)}</span>`, go: `S004?p=${p.id}` })).join('')}</div>`;
    return base(`Results`, { back: true, body });
  },

  // S007 Category index
  S007() {
    const body = `
      ${C.sectionLabel('Categories')}
      <div class="grid-2">${['Apparel', 'Home', 'Beauty', 'Gifts', 'Pantry', 'Ceramics'].map((c) => `<button class="card" style="max-width:none;align-items:flex-start" data-go="S006?q=${c}"><b>${c}</b></button>`).join('')}</div>
      ${C.sectionLabel('Brands A–Z')}
      <div class="stack tight">${visibleBrands().slice().sort((a, b) => a.name.localeCompare(b.name)).map((b) => C.listRow({ thumbIcon: 'building', pri: b.name, sec: b.cats.join(' · '), go: `S003?brand=${b.id}` })).join('')}</div>`;
    return base('Browse', { back: true, headerRight: C.hActions([{ icon: 'search', go: 'S005' }]), body });
  },

  // S008 Filters sheet (rendered as a screen for the inventory; also opened as a sheet)
  S008() {
    return base('Filters', { back: true, body: filtersBody(), onMount: () => {} });
  },

  // S009 Brand launch detail
  S009(params) {
    const b = D.brandById[params.brand] || D.brandById['pompom'];
    const closed = state.get('_state') === 'closed';
    if (closed) {
      return base(b.name, { back: true, body: C.fullscreenState({ ic: 'lock', title: 'First-look has closed', body: `Join the waitlist and I'll open ${b.name} to you the moment your tier clears.`, actions: [{ label: 'Join the waitlist', action: 'request-access' }, { label: 'Back', ghost: true, action: 'back' }] }) });
    }
    const body = `
      <div class="thumb-illo" style="border-radius:var(--r-4);padding:var(--s-6)">${C.illo('hat', 96)}</div>
      <span class="pill coral">${icon('clock', 13)} First-look open now</span>
      <h3>${b.name}</h3>
      <p class="muted">${b.story}</p>
      ${C.sectionLabel('New collection')}
      <div class="grid-2">${D.productsByBrand(b.id).map((p) => C.productCard(p)).join('')}</div>
      <div class="sticky-actions"><button class="btn ghost" data-action="remind">Remind me</button><button class="btn" data-go="S003?brand=${b.id}">Open the drop</button></div>`;
    return base('First-look', { back: true, body });
  },

  // S804 Locked · tier-gated (lives in edge but reused heavily from shop)
  S804(params) {
    const b = D.brandById[params.brand] || D.brandById['savant'];
    const requested = state.get('_state') === 'requested';
    return base(b.name, { back: true, body:
      C.fullscreenState({ ic: 'lock', title: 'This brand opens at a higher tier',
        body: `Your buyers see the full ${b.name} line once you reach the next tier. I can let your rep know you're interested.`,
        actions: requested ? [{ label: 'Request sent', ghost: true }] : [{ label: 'Request access', action: 'request-access', go: '' }, { label: 'Read brand story', ghost: true }] }) });
  },
};

// ---- local helpers ----
function noResults() {
  return `${C.emptyState({ ic: 'search', title: 'Nothing matched', body: 'Try a SKU or forward the email.' })}
    <div class="grid-2"><button class="btn ghost sm" data-action="forward-email">${icon('mail', 16)} Forward an email</button><button class="btn ghost sm" data-action="upload-file">${icon('download', 16)} Upload a file</button></div>`;
}
export function filtersBody() {
  return `
    ${C.sectionLabel('Brand')}
    <div class="chip-row">${D.brands.slice(0, 5).map((b) => `<button class="chip">${b.name}</button>`).join('')}</div>
    ${C.sectionLabel('Category')}
    <div class="chip-row">${['Apparel', 'Home', 'Beauty', 'Gifts'].map((c) => `<button class="chip">${c}</button>`).join('')}</div>
    ${C.sectionLabel('Price tier')}
    <div class="chip-row"><button class="chip">Any</button><button class="chip">Volume</button></div>
    ${C.switchRow('In stock only', false)}
    <div class="grid-2"><button class="btn ghost" data-action="reset-filters">Reset</button><button class="btn" data-action="apply-filters">Apply</button></div>`;
}

// shared scaffold
export function base(title, opts = {}) { return { title, ...opts }; }

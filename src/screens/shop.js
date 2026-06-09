import * as C from '../components.js';
import * as D from '../data.js';
import { state } from '../state.js';
import { icon } from '../icons.js';

const visibleBrands = () => D.brands.filter((b) => D.canSee(b, state.get('tier')));

export const shop = {
  // S001 Shop home
  S001() {
    if (state.get('_state') === 'empty') {
      return base('Shop', { tab: 'shop', headerRight: C.tabHeaderActions(), body:
        C.emptyState({ ic: 'home', title: 'Nothing curated yet', body: "I'll show Hecho-picked guides here until I learn your shop.", primary: { label: 'Browse brands', go: 'S706' } }) });
    }
    const hero = D.styleGuides[0];
    const recs = D.products.slice(0, 6);
    const drops = visibleBrands().filter((b) => b.launching || b.tier !== 'standard').slice(0, 4);
    const body = `
      <div class="search" data-go="S005"><span>${icon('search', 20)}</span><span class="muted" style="flex:1">Search name, SKU, or barcode</span></div>
      <div class="chip-row">${visibleBrands().slice(0, 6).map((b) => C.brandChip(b.id)).join('')}</div>
      ${C.sectionLabel('Featured guide')}
      ${C.styleTile(hero, { wide: true })}
      ${rail('For your shop', recs.map((p) => C.productCard(p)).join(''))}
      ${rail('New on the floor', drops.map((b) => `<div style="width:200px">${C.brandCard(b, { locked: !D.canSee(b, state.get('tier')) })}</div>`).join(''))}
      ${rail('Continue shopping', D.carts.slice(0, 2).map((c) => `<div style="width:240px">${C.draftCard(c)}</div>`).join(''))}
      ${C.softPitch()}
      <button class="btn ghost full" data-go="S705">See all style guides</button>`;
    return base('Shop', { tab: 'shop', headerRight: C.tabHeaderActions({ search: false }), body });
  },

  // S002 Style guide detail
  S002(params) {
    const g = D.styleGuideById[params.guide] || D.styleGuides[0];
    const lines = g.lines.map((id) => D.productById[id]).filter(Boolean);
    const body = `
      <div class="card" style="padding:0;overflow:hidden;max-width:none">
        <div class="thumb-illo" style="padding:var(--s-5)">${C.vignette()}</div>
      </div>
      <div><small class="section-label">${g.season} · ${g.theme}</small><h3 style="margin-top:var(--s-1)">${g.title}</h3></div>
      <p class="muted">${g.blurb}</p>
      <div class="chip-row">${g.brands.map((b) => C.brandChip(b)).join('')}</div>
      ${C.sectionLabel('The look')}
      <div class="stack tight">${lines.map((p) => C.listRow({ thumb: `<span class="thumb-illo" style="width:44px;height:44px;border-radius:var(--r-2)">${C.illo(p.illo, 26)}</span>`, pri: p.name, sec: `${D.brandById[p.brand].name} · ${p.variant}`, trail: C.pricePair(p, { compact: true }), go: `S004?p=${p.id}` })).join('')}</div>
      <div class="sticky-actions"><button class="btn ghost" data-action="save-template">Save look</button><button class="btn" data-action="shop-the-look" data-guide="${g.id}">Shop the look</button></div>`;
    return base(g.title, { back: true, headerRight: C.hActions([{ icon: 'share', action: 'share', label: 'Share' }]), body });
  },

  // S003 Brand page
  S003(params) {
    const b = D.brandById[params.brand] || D.brands[0];
    if (!D.canSee(b, state.get('tier'))) return shop.S804({ brand: b.id });
    const prods = D.productsByBrand(b.id);
    const saved = state.isBrandSaved(b.id);
    const body = `
      <div class="thumb-illo" style="border-radius:var(--r-4);padding:var(--s-6)">${C.illo(prods[0]?.illo || 'jar', 96)}</div>
      <h3>${b.name}</h3>
      ${b.launching ? C.banner(`<b>First-look open now.</b> New collection pinned below.`, { kind: '', ic: 'sparkle', action: { label: 'The drop', go: `S009?brand=${b.id}` } }) : ''}
      <p class="muted">${b.story}</p>
      <div class="row-between"><span class="moq">${icon('cart', 12)}MOQ $${b.moq}</span>
        <button class="chip ${saved ? 'is-selected' : ''}" data-action="save-brand" data-brand="${b.id}" aria-pressed="${saved}">${icon('star', 13)} ${saved ? 'Saved' : 'Save brand'}</button></div>
      ${C.sectionLabel('Catalog')}
      <div class="grid-2">${prods.map((p) => C.productCard(p)).join('')}</div>`;
    return base(b.name, { back: true, headerRight: C.hActions([{ icon: 'search', go: 'S005' }, { icon: 'share', action: 'share' }]), body });
  },

  // S004 Product detail
  S004(params) {
    const p = D.productById[params.p] || D.products[0];
    const b = D.brandById[p.brand];
    if (!D.canSee(b, state.get('tier'))) return shop.S804({ brand: b.id });
    const variantOut = state.get('_state') === 'oos';
    const rec = D.recommendedQty(p, state.get('pos') === 'connected');
    const body = `
      <div class="photo-frame r-1-1"><div class="ph">${C.illo(p.illo, 120)}</div></div>
      <div><button class="chip" data-go="S003?brand=${p.brand}">${b.name}</button></div>
      <h3>${p.name}</h3>
      ${C.sectionLabel('Variant')}
      <div class="chip-row"><button class="chip is-selected">${p.variant}</button><button class="chip ${variantOut ? '' : ''}">Clay · M</button><button class="chip" aria-disabled="true" style="opacity:.5">Ash · L · OOS</button></div>
      <div class="card" style="max-width:none">
        <div class="row-between"><span class="muted">Your price</span>${p.map ? `<span class="pill">${icon('info', 12)} MAP $${p.msrp}</span>` : ''}</div>
        <div class="row-between"><span></span>${C.pricePair(p)}</div>
        ${C.stockRow(p)}
        <div class="hairline"></div>
        <div class="row-between"><span class="muted">Margin at MSRP</span>${C.maskField(`${Math.round((1 - p.wholesale / p.msrp) * 100)}%`, 'spend')}</div>
        <p class="muted" style="font-size:var(--fs-nano)">${rec ? `Behavior model: ${C.esc(D.whyString(p, state.get('pos') === 'connected'))}` : 'Connect a POS for a reorder recommendation.'}</p>
      </div>
      ${state.get('pos') !== 'connected' ? C.softPitch() : ''}
      <div class="sticky-actions"><button class="btn ghost" data-action="save-template">Save</button><button class="btn" data-action="add-to-cart" data-p="${p.id}">Add to cart${rec ? ` · ${C.maskField(String(rec), 'recommended')}` : ''}</button></div>`;
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
      <button class="btn ghost full" data-go="S101">Scan a barcode instead</button>`;
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
      <div class="stack tight">${matchProds.map((p) => C.listRow({ thumb: `<span class="thumb-illo" style="width:44px;height:44px;border-radius:var(--r-2)">${C.illo(p.illo, 24)}</span>`, pri: p.name, sec: D.brandById[p.brand].name, trail: `<button class="btn sm icon-only" data-action="add-to-cart" data-p="${p.id}" aria-label="Quick add">${icon('plus', 16)}</button>`, go: `S004?p=${p.id}` })).join('')}</div>`;
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
function rail(title, inner) {
  return `<div class="stack tight"><div class="row-between">${C.sectionLabel(title)}</div><div class="rail tiles">${inner}</div></div>`;
}
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

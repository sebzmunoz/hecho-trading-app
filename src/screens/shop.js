import * as C from '../components.js';
import * as D from '../data.js';
import { state } from '../state.js';
import { icon } from '../icons.js';

export const shop = {
  // S001 Shop home — ordered by buyer decision priority: reorder what's
  // running out → clear what's waiting on you → discover what's new.
  S001() {
    if (state.get('_state') === 'empty') {
      return base('Shop', { tab: 'shop', headerRight: C.tabHeaderActions(), body:
        C.emptyState({ ic: 'home', title: 'Nothing curated yet', body: "I'll show Hecho-picked guides here until I learn your shop.", primary: { label: 'Browse brands', go: 'S706' } }) });
    }
    const role = state.get('role');
    const hero = D.styleGuides[0];
    // New launches: launching first, then the freshest general-release
    // brands — six drop tiles, not two.
    const drops = [...D.brands.filter((b) => b.launching), ...D.brands.filter((b) => !b.launching).slice(-5)].slice(0, 6);
    // Resume rail: every draft in motion — mine and shared with me.
    const openDrafts = D.carts.filter((c) => c.section === 'mine' || c.section === 'shared');
    const pendingApprovals = D.carts.filter((c) => c.awaiting);

    // 1 · Running low at your store (the reorder motion, H1 math)
    let lowRail = '';
    {
      const low = D.lowStockLines(4);
      if (low.length) lowRail = `
        <div class="stack tight">
          <div class="row-between">${C.sectionLabel('Running low at your store')}<button class="chip" data-go="S708" style="min-height:28px;padding:2px 10px;font-size:var(--fs-nano)">Live stock</button></div>
          <div class="rail">${low.map(({ p, daysLeft }) => {
            const rec = D.recommendedQty(p);
            const st = D.stockState(p);
            return `<div class="low-card">
              <span class="thumb-illo" style="width:44px;height:44px;border-radius:var(--r-2);flex:0 0 auto">${C.illo(p.illo, 26)}</span>
              <span class="lc-body">
                <b>${C.esc(p.name)}</b>
                <span class="stock ${st.kind}" style="font-size:var(--fs-nano)"><span class="dot"></span>${C.maskField(`${st.value} left · ~${daysLeft}d`, 'stock')}</span>
              </span>
              <button class="btn sm" data-action="add-to-cart" data-p="${p.id}">Add${rec ? ' ×' + rec : ''}</button>
            </div>`;
          }).join('')}</div>
        </div>`;
    }

    // 2 · Waiting on you (role-aware)
    const waiting = [];
    if (role === 'admin' && pendingApprovals.length) {
      waiting.push(C.listRow({ thumbIcon: 'check', pri: `${pendingApprovals.length} draft${pendingApprovals.length > 1 ? 's' : ''} awaiting your approval`, sec: pendingApprovals.map((c) => c.name).join(' · '), trail: `<span class="badge">${pendingApprovals.length}</span>`, go: 'S208' }));
    }
    const pastDue = D.orders.find((o) => o.pastDue);
    if (role === 'admin' && pastDue) {
      waiting.push(C.listRow({ thumbIcon: 'card', pri: 'An invoice is past due', sec: `#${pastDue.id} · ${pastDue.due}`, trail: C.statusPill('pastdue'), go: `S304?order=${pastDue.id}` }));
    }
    const waitingBlock = waiting.length ? `<div class="stack tight">${C.sectionLabel('Waiting on you')}${waiting.join('')}</div>` : '';

    // Discovery order: New launches lead, then resume, then the featured guide.
    const body = `
      <div class="search" data-go="S005"><span>${icon('search', 20)}</span><span class="muted" style="flex:1">Search name, SKU, or barcode</span></div>
      ${lowRail}
      ${waitingBlock}
      ${rail('New launches', drops.map((b) => C.dropCard(b)).join(''))}
      ${openDrafts.length ? rail('Pick up where you left off', openDrafts.map((c) => C.resumeCard(c)).join('')) : ''}
      <div class="stack tight">
        <div class="row-between">${C.sectionLabel('Featured guide')}<span class="scene-hint"><i></i> Shoppable</span></div>
        ${C.styleTile(hero, { wide: true })}
      </div>
      ${rail('For your shop', D.products.slice(0, 6).map((p) => C.productCard(p)).join(''))}
      ${C.sectionLabel('Brands')}
      <div class="brand-grid">${D.brands.map((b) => C.brandTile(b)).join('')}</div>
      <div class="grid-2"><button class="btn ghost sm" data-go="S705">All style guides</button><button class="btn ghost sm" data-go="S007">Browse categories</button></div>`;
    return base('Shop', { tab: 'shop', headerRight: C.tabHeaderActions({ search: false }), body });
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

  // S003 Brand page
  S003(params) {
    const b = D.brandById[params.brand] || D.brands[0];
    const prods = D.productsByBrand(b.id);
    const launching = b.launching || state.get('_state') === 'launching';
    const body = `
      <div class="thumb-illo" style="border-radius:var(--r-4);padding:var(--s-6)">${C.illo(prods[0]?.illo || 'jar', 96)}</div>
      <h3>${b.name}</h3>
      ${launching ? C.banner(`<b>First-look open now.</b> New collection pinned below.`, { kind: '', ic: 'sparkle', action: { label: 'The drop', go: `S009?brand=${b.id}` } }) : ''}
      <p class="muted">${b.story}</p>
      ${b.founder && state.get('role') !== 'rep' ? `${C.sectionLabel('From the founder')}
      <div class="card" style="max-width:none;flex-direction:row;gap:var(--s-3);align-items:flex-start">
        <span class="avatar dark" style="flex:0 0 auto">${C.esc(b.founder.split(' ').map((w) => w[0]).slice(0, 2).join(''))}</span>
        <span style="min-width:0"><b>${C.esc(b.founder)}</b><p class="muted" style="margin-top:2px;font-size:var(--fs-caption)">${C.esc(b.founderStory)}</p></span>
      </div>` : ''}
      <div class="row-between"><span class="moq">${icon('cart', 12)}MOQ $${b.moq}</span>
        <span class="muted" style="font-size:var(--fs-caption)">${icon('truck', 13)} Ships in ~${b.lead} days</span></div>
      ${C.sectionLabel('Catalog')}
      <div class="grid-2">${prods.map((p) => C.productCard(p)).join('')}</div>`;
    return base(b.name, { back: true, headerRight: C.hActions([{ icon: 'search', go: 'S005' }, { icon: 'share', action: 'share' }]), body });
  },

  // S004 Product detail
  S004(params) {
    const p = D.productById[params.p] || D.products[0];
    const b = D.brandById[p.brand];
    const variantOut = state.get('_state') === 'oos';
    const rec = D.recommendedQty(p);
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
        <div class="row-between"><span class="muted">Your price</span>${C.pricePair(p)}</div>
        ${C.stockRow(p)}
        <div class="hairline"></div>
        <div class="row-between"><span class="muted">Margin at MSRP</span>${C.maskField(`${Math.round((1 - p.wholesale / p.msrp) * 100)}%`, 'spend')}</div>
        <p class="muted" style="font-size:var(--fs-nano)">${rec ? `Behavior model: ${C.esc(D.whyString(p))}` : `First order — start with a pack of ${p.pack}.`}</p>
      </div>
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
      <button class="btn ghost full" data-go="S101">Scan a barcode instead</button>`;
    return base('Search', { back: true, body, onMount: (root) => { const i = root.querySelector('input'); i && i.addEventListener('keydown', (e) => { if (e.key === 'Enter') window.HECHO.nav.go('S006?q=' + encodeURIComponent(i.value)); }); } });
  },

  // S006 Search results
  S006(params) {
    const q = params.q || 'knit';
    if (state.get('_state') === 'empty') {
      return base(`"${q}"`, { back: true, body: `${noResults()}` });
    }
    const matchBrands = D.brands.filter((b) => b.name.toLowerCase().includes(String(q).toLowerCase())).slice(0, 2);
    const matchProds = D.products.filter((p) => p.name.toLowerCase().includes(String(q).toLowerCase()) || true).slice(0, 6);
    const body = `
      <div class="search" data-go="S005"><span>${icon('search', 20)}</span><span class="muted" style="flex:1">${C.esc(q)}</span></div>
      <div class="chip-row"><button class="chip" data-action="filters">${icon('filter', 14)} Filters</button>${D.brands.slice(0, 4).map((b) => `<button class="chip">${b.name}</button>`).join('')}</div>
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
      <div class="stack tight">${D.brands.slice().sort((a, b) => a.name.localeCompare(b.name)).map((b) => C.listRow({ thumbIcon: 'building', pri: b.name, sec: b.cats.join(' · '), go: `S003?brand=${b.id}` })).join('')}</div>`;
    return base('Browse', { back: true, headerRight: C.hActions([{ icon: 'search', go: 'S005' }]), body });
  },

  // S008 Filters sheet (rendered as a screen for the inventory; also opened as a sheet)
  S008() {
    return base('Filters', { back: true, body: filtersBody(), onMount: () => {} });
  },

  // S009 Brand launch detail
  S009(params) {
    const b = D.brandById[params.brand] || D.brandById['pompom'];
    const requested = state.get('_state') === 'requested';
    if (state.get('_state') === 'closed' || requested) {
      return base(b.name, { back: true, body: C.fullscreenState({ ic: 'lock', title: 'First-look has closed',
        body: requested ? `You're on the list — I'll ping you the moment ${b.name} reopens.` : `Join the waitlist and I'll open ${b.name} to you the moment the drop reopens.`,
        actions: requested ? [{ label: 'On the waitlist', ghost: true }, { label: 'Back', ghost: true, action: 'back' }] : [{ label: 'Join the waitlist', action: 'request-access' }, { label: 'Back', ghost: true, action: 'back' }] }) });
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

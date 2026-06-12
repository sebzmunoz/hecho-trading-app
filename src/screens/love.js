import * as C from '../components.js';
import * as D from '../data.js';
import { state } from '../state.js';
import { icon } from '../icons.js';
import { base } from './shop.js';

// The love list is the anti-cart: capture is one tap with zero decisions.
// The list itself is a visual wall — big image, name and brand, nothing
// else. Everything deeper lives on the product page. Quantities, MOQs,
// and approvals only appear at the explicit bridge into a draft cart.

function loveCard(p) {
  const b = D.brandById[p.brand];
  return `<button class="card product" data-go="S004?p=${p.id}" style="text-align:start">
    <div class="img thumb-illo">${C.illo(p.illo, 64)}${C.loveBtn(p.id, { overlay: true })}</div>
    <div class="body"><span class="brand">${C.esc(b.name)}</span><span class="nm">${C.esc(p.name)}</span></div>
  </button>`;
}

export const love = {
  // S010 Love list
  S010() {
    const all = state.lovedItems();
    if (!all.length || state.get('_state') === 'empty') {
      return base('Love list', { back: true, tab: 'shop', body:
        C.emptyState({ ic: 'heart', title: 'Nothing loved yet', body: 'Tap the heart on anything that catches your eye. No quantities, no sign-off — I\'ll keep it all here for later.', primary: { label: 'Browse the floor', go: 'S001' }, secondary: { label: 'Scan the shelf', go: 'S101' } }) });
    }
    if (state.get('_state') === 'loading') return base('Love list', { back: true, tab: 'shop', body: C.skeleton(5) });

    const items = all.map((it) => D.productById[it.p]).filter(Boolean);
    const body = `
      <p class="muted" style="font-size:var(--fs-caption)">${items.length} thing${items.length > 1 ? 's' : ''} that caught your eye — no quantities, no commitment. Start a cart whenever you're ready.</p>
      <div class="grid-2">${items.map(loveCard).join('')}</div>
      <div class="sticky-actions">
        <button class="btn full" data-action="love-to-cart">Start a cart</button>
      </div>`;
    return base('Love list', { back: true, tab: 'shop', headerRight: C.hActions([{ icon: 'search', go: 'S005', label: 'Search' }]), body });
  },

  // S011 Love list → cart (the explicit bridge; also opened as a sheet)
  S011() {
    return base('Start a cart', { back: true, tab: 'shop', body: loveToCartBody() });
  },
};

// ---- shared bodies (screen AND sheet) ----
export function loveToCartBody() {
  const items = state.lovedItems().map((it) => ({ it, p: D.productById[it.p] })).filter((x) => x.p);
  const brandCount = new Set(items.map(({ p }) => p.brand)).size;
  const mine = D.carts.filter((c) => c.section === 'mine');
  return `
    <p class="muted">Pick what's ready. Quantities come next — I'll suggest pack-size amounts in the cart.</p>
    <div class="stack tight">${items.map(({ it, p }) => `
      <label class="list-row dense pick" style="cursor:pointer"><span class="choice" style="margin:0"><input type="checkbox" checked data-love-pick data-p="${p.id}" /><span class="box"></span></span>
        <span class="thumb thumb-illo" style="width:40px;height:40px">${C.illo(p.illo, 22)}</span>
        <span class="body"><span class="pri">${C.esc(p.name)}</span><span class="sec">${C.esc(D.brandById[p.brand].name)} · $${p.wholesale}</span></span>
      </label>`).join('')}</div>
    ${brandCount > 1 ? `<p class="muted" style="font-size:var(--fs-nano)">${icon('info', 12)} Spread across ${brandCount} brands — each brand's minimum applies once it's a cart.</p>` : ''}
    ${C.sectionLabel('Add to')}
    <div class="chip-row" data-chipgroup>${mine.map((c, i) => `<button class="chip ${i === 0 ? 'is-selected' : ''}">${C.esc(c.name)}</button>`).join('')}<button class="chip" data-action="new-cart">+ New draft</button></div>
    <button class="btn full" data-action="love-to-cart-confirm">Add to cart</button>`;
}

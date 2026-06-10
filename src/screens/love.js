import * as C from '../components.js';
import * as D from '../data.js';
import { state } from '../state.js';
import { icon } from '../icons.js';
import { base } from './shop.js';

// The love list is the anti-cart: capture is one tap with zero decisions.
// Quantities, MOQs, and approvals only appear at the explicit bridge into
// a draft cart — never before.

const SRC = {
  scan: { ic: 'scan', label: 'Scanned' },
  browse: { ic: 'tag', label: 'Browsing' },
};

function srcLine(it) {
  const s = SRC[it.src] || SRC.browse;
  return `<span class="love-src">${icon(s.ic, 12)} ${s.label} · ${C.esc(it.when)}</span>`;
}

function lovedByBrand(items) {
  const groups = {};
  items.forEach((it) => {
    const p = D.productById[it.p]; if (!p) return;
    (groups[p.brand] ||= []).push({ it, p });
  });
  return groups;
}

export const love = {
  // S010 Love list
  S010(params) {
    const all = state.lovedItems();
    if (!all.length || state.get('_state') === 'empty') {
      return base('Love list', { back: true, body:
        C.emptyState({ ic: 'heart', title: 'Nothing loved yet', body: 'Tap the heart on anything that catches your eye. No quantities, no sign-off — I\'ll keep it all here for later.', primary: { label: 'Browse the floor', go: 'S001' }, secondary: { label: 'Scan the shelf', go: 'S101' } }) });
    }
    if (state.get('_state') === 'loading') return base('Love list', { back: true, body: C.skeleton(5) });

    const f = params.f || 'all';
    const items = f === 'all' ? all : all.filter((it) => it.src === f);
    const chips = [['all', 'All'], ['scan', 'Scanned'], ['browse', 'Browsing']]
      .map(([v, l]) => `<button class="chip ${f === v ? 'is-selected' : ''}" data-go="S010?f=${v}">${l}</button>`).join('');
    const groups = lovedByBrand(items);
    const body = `
      <p class="muted" style="font-size:var(--fs-caption)">${all.length} thing${all.length > 1 ? 's' : ''} that caught your eye — no quantities, no commitment. Start a cart whenever you're ready.</p>
      <div class="chip-row">${chips}</div>
      ${Object.entries(groups).map(([bid, rows]) => {
        const b = D.brandById[bid];
        return `<div class="stack tight">
          <div class="row-between">${C.sectionLabel(b.name)}<button class="chip" data-go="S003?brand=${bid}" style="min-height:28px;padding:2px 10px;font-size:var(--fs-nano)">Brand</button></div>
          ${rows.map(({ it, p }) => `<div class="list-row love-row">
            <button class="lr-open" data-go="S004?p=${p.id}" aria-label="Open ${C.esc(p.name)}">
              <span class="thumb thumb-illo" style="width:44px;height:44px">${C.illo(p.illo, 24)}</span>
              <span class="body"><span class="pri">${C.esc(p.name)}</span>
                <span class="sec">${C.esc(p.variant)} · ${C.maskField('$' + p.wholesale, 'wholesale')}</span>
                ${srcLine(it)}${it.note ? `<span class="love-note">${icon('draft', 11)} ${C.esc(it.note)}</span>` : ''}</span>
            </button>
            <span class="trail">
              ${C.loveBtn(p.id, { src: it.src })}
              <button class="btn sm icon-only ghost" data-action="love-menu" data-p="${p.id}" aria-label="Options for ${C.esc(p.name)}">${icon('dots', 16)}</button>
            </span>
          </div>`).join('')}
        </div>`;
      }).join('')}
      <div class="sticky-actions">
        <button class="btn ghost" data-action="share">${icon('share', 16)} Share</button>
        <button class="btn" data-action="love-to-cart">Start a cart</button>
      </div>`;
    return base('Love list', { back: true, headerRight: C.hActions([{ icon: 'search', go: 'S005', label: 'Search' }]), body });
  },

  // S011 Love list → cart (the explicit bridge; also opened as a sheet)
  S011() {
    return base('Start a cart', { back: true, body: loveToCartBody() });
  },
};

// ---- shared bodies (screen AND sheet) ----
export function loveToCartBody() {
  const items = state.lovedItems().map((it) => ({ it, p: D.productById[it.p] })).filter((x) => x.p);
  const brandCount = new Set(items.map(({ p }) => p.brand)).size;
  return `
    <p class="muted">Pick what's ready. Quantities come next — I'll suggest pack-size amounts in the cart.</p>
    <div class="stack tight">${items.map(({ it, p }) => `
      <label class="list-row dense" style="cursor:pointer"><span class="choice" style="margin:0"><input type="checkbox" checked data-love-pick data-p="${p.id}" /><span class="box"></span></span>
        <span class="thumb thumb-illo" style="width:40px;height:40px">${C.illo(p.illo, 22)}</span>
        <span class="body"><span class="pri">${C.esc(p.name)}</span><span class="sec">${C.esc(D.brandById[p.brand].name)} · $${p.wholesale}</span></span>
      </label>`).join('')}</div>
    ${brandCount > 1 ? `<p class="muted" style="font-size:var(--fs-nano)">${icon('info', 12)} Spread across ${brandCount} brands — each brand's minimum applies once it's a cart.</p>` : ''}
    ${C.sectionLabel('Add to')}
    <div class="chip-row" data-chipgroup>${D.carts.filter((c) => c.section === 'mine').map((c, i) => `<button class="chip ${i === 0 ? 'is-selected' : ''}">${C.esc(c.name)}</button>`).join('')}<button class="chip" data-action="new-cart">+ New draft</button></div>
    <button class="btn full" data-action="love-to-cart-confirm">Add to cart</button>`;
}

export function loveNoteBody(pid) {
  const p = D.productById[pid];
  const it = state.lovedItems().find((x) => x.p === pid);
  return `
    <p class="muted">A word to your future self — why this one caught your eye.</p>
    <div class="input-group"><label>${C.esc(p ? p.name : 'Note')}</label>
      <textarea class="textarea" data-love-note placeholder="e.g. Back wall? Ask Dana about lead time" maxlength="120">${C.esc(it ? it.note : '')}</textarea></div>
    <button class="btn full" data-action="love-note-save" data-p="${pid}">Save note</button>`;
}

export function loveMenuBody(pid) {
  const p = D.productById[pid];
  const it = state.lovedItems().find((x) => x.p === pid);
  const opt = (ic, t, attrs) => `<button class="opt" ${attrs}>${icon(ic, 20)}<span style="flex:1;text-align:start">${t}</span>${icon('chevron-right', 16)}</button>`;
  return `<div class="opts">
    ${opt('cart', 'Add to a cart', `data-action="add-to-cart" data-p="${pid}"`)}
    ${opt('draft', it && it.note ? 'Edit the note' : 'Add a note', `data-action="love-note" data-p="${pid}"`)}
    ${opt('search', 'View product', `data-go="S004?p=${pid}"`)}
    ${opt('heart-fill', 'Remove from the list', `data-action="love-remove" data-p="${pid}"`)}
  </div>`;
}

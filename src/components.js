// ============================================================
// Render helpers + interaction primitives. Every visual is a
// composition of Design System v3.0 components/tokens.
// Render functions return HTML strings; behavior is wired via
// data-* delegation (app.js) and the mount helpers below.
// ============================================================
import { icon } from './icons.js';
import { state } from './state.js';
import * as D from './data.js';

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const money = D.money;

// ---- Product line illustrations (line-art, Terracotta, per §07b) ----
const ILLO = {
  sweater: '<path d="M16 14h48l-8 12v40H24V26z"/><path d="M16 14l-10 8 8 14M64 14l10 8-8 14"/>',
  scarf: '<path d="M22 12h36v56H22z" /><path d="M22 24h36M22 56h36"/>',
  jar: '<rect x="24" y="26" width="32" height="44" rx="6"/><path d="M28 26v-6h24v6"/><path d="M24 40h32"/>',
  tube: '<rect x="30" y="14" width="20" height="56" rx="8"/><path d="M30 26h20"/>',
  bar: '<rect x="18" y="30" width="44" height="26" rx="6"/><path d="M28 30v26M40 30v26"/>',
  charm: '<circle cx="40" cy="46" r="18"/><path d="M40 28v-10M34 18h12"/>',
  pen: '<path d="M30 12l8 0 0 44-4 12-4-12z"/><path d="M30 24h8"/>',
  plush: '<circle cx="40" cy="44" r="22"/><circle cx="33" cy="40" r="2" fill="currentColor"/><circle cx="47" cy="40" r="2" fill="currentColor"/><path d="M34 50a8 6 0 0 0 12 0"/>',
  candle: '<rect x="28" y="30" width="24" height="40" rx="4"/><path d="M40 30v-8M40 14c4 4 4 8 0 8s-4-4 0-8"/>',
  incense: '<rect x="22" y="56" width="36" height="6" rx="2"/><path d="M30 56V20M40 56V14M50 56V22"/>',
  hat: '<ellipse cx="40" cy="56" rx="30" ry="8"/><path d="M24 56c0-18 4-32 16-32s16 14 16 32"/>',
  tote: '<path d="M22 28h36l-4 40H26z"/><path d="M30 28a10 8 0 0 1 20 0"/>',
  mug: '<rect x="22" y="26" width="30" height="40" rx="6"/><path d="M52 36a10 10 0 0 1 0 20"/>',
  bowl: '<path d="M16 38h48a24 18 0 0 1-48 0z"/><path d="M28 64h24"/>',
  coat: '<path d="M28 14l-10 8 6 10 4-3v37h24V29l4 3 6-10-10-8z"/><path d="M40 19v45"/>',
  bottle: '<path d="M34 12h12v10l4 8v40H30V30l4-8z"/><path d="M30 44h20"/>',
  tin: '<rect x="24" y="28" width="32" height="38" rx="4"/><path d="M24 38h32"/>',
  throw: '<path d="M16 26h48v12H16zM18 38h44v12H18zM20 50h40v12H20z"/><path d="M24 62v8M32 62v8M40 62v8M48 62v8M56 62v8"/>',
  bag: '<path d="M22 34h36v32a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4z"/><path d="M22 34l18 12 18-12"/><path d="M28 34c0-16 24-16 24 0"/>',
};
export function illo(kind, size = 80) {
  const body = ILLO[kind] || ILLO.jar;
  return `<svg viewBox="0 0 80 80" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

// ---- Status (icon + label + color, never color alone — §07-E) ----
const STATUS = {
  current:  { pill: 'positive', icon: 'check',   label: 'Current' },
  paid:     { pill: 'positive', icon: 'check',   label: 'Paid' },
  in:       { pill: 'positive', icon: 'check',   label: 'In stock' },
  renews:   { pill: 'caution',  icon: 'clock',   label: 'Renews soon' },
  low:      { pill: 'caution',  icon: 'warning', label: 'Low' },
  expired:  { pill: 'critical', icon: 'warning', label: 'Expired' },
  pastdue:  { pill: 'critical', icon: 'warning', label: 'Past due' },
  pending:  { pill: '',         icon: 'clock',   label: 'Pending' },
};
export function statusPill(kind, labelOverride) {
  const s = STATUS[kind] || { pill: '', icon: 'info', label: labelOverride || kind };
  return `<span class="pill ${s.pill}">${icon(s.icon, 13)}${esc(labelOverride || s.label)}</span>`;
}

export function brandChip(bid, { go = true } = {}) {
  const b = D.brandById[bid]; if (!b) return '';
  const attr = go ? `data-go="S003?brand=${bid}"` : '';
  return `<button class="chip" ${attr}>${esc(b.name)}</button>`;
}
export function tierBadge(tier) {
  const map = { standard: 'Standard', mid: 'Mid tier', top: 'Top tier' };
  return `<span class="tag">${esc(map[tier] || tier)}</span>`;
}
export function lockChip(label = 'Higher tier') {
  return `<span class="lock-chip">${icon('lock', 12)}${esc(label)}</span>`;
}

// Privacy on the floor was removed — values always render plainly.
// maskField stays as a pass-through so the many call sites need no edits.
export function maskField(valueHTML) {
  return valueHTML;
}
// Animated success mark for confirmation screens.
export function successMark() {
  return `<div class="success-mark" aria-hidden="true">
    <svg viewBox="0 0 64 64"><circle class="ring" cx="32" cy="32" r="28"/><path class="tick" d="M20 33l9 9 16-18"/></svg>
    <span class="spark s1"></span><span class="spark s2"></span><span class="spark s3"></span><span class="spark s4"></span></div>`;
}

// ---- Love button (zero-commitment capture) ----
// One tap, no sheet, no quantity. `src` records where the heart was tapped
// so the list can answer "where did I see this?" later.
// Rendered as span[role=button] so it can sit inside card buttons —
// the HTML parser flattens nested <button> elements.
export function loveBtn(pid, { src = 'browse', overlay = false, size = 16 } = {}) {
  const loved = state.isLoved(pid);
  return `<span class="love-btn ${overlay ? 'overlay' : ''} ${loved ? 'is-loved' : ''}" role="button" tabindex="0"
    data-action="love-toggle" data-p="${pid}" data-src="${src}" aria-pressed="${loved}"
    aria-label="${loved ? 'Remove from your love list' : 'Add to your love list'}">${icon(loved ? 'heart-fill' : 'heart', size)}</span>`;
}

// ---- Price pair (A1) ----
export function pricePair(p, { compact = false } = {}) {
  return `<span class="price ${compact ? 'compact' : ''}"><span class="v">${p.wholesale}</span><span class="currency">USD</span>${p.msrp ? `<span class="msrp">$${p.msrp}</span>` : ''}</span>`;
}

// ---- Stock check row (A3 + H3) — signed-in only; guests never see stock ----
export function stockRow(p) {
  const st = D.stockState(p);
  return `<div class="row-between"><span class="muted">Stock</span><span class="stock ${st.kind}"><span class="dot"></span>${esc(st.label)}</span></div>
    <div class="muted" style="font-size:var(--fs-nano)">${esc(st.caption)}</div>`;
}

// ---- MOQ chip ----
export function moqChip(bid, subtotal) {
  const b = D.brandById[bid];
  if (!b) return '';
  if (subtotal >= b.moq) return `<span class="moq">${icon('check', 12)}MOQ met</span>`;
  return `<span class="moq unmet">${icon('warning', 12)}MOQ $${b.moq} · $${b.moq - subtotal} to go</span>`;
}

// ---- List row ----
export function listRow({ thumbIcon, thumb, pri, sec, trail, go, current, dense, attrs = '' }) {
  const t = thumb ? `<span class="thumb">${thumb}</span>` : (thumbIcon ? `<span class="thumb">${icon(thumbIcon, 22)}</span>` : '');
  const tr = trail !== undefined ? `<span class="trail">${trail}</span>` : `<span class="trail">${icon('chevron-right', 16)}</span>`;
  const tag = go ? 'button' : 'div';
  const goAttr = go ? `data-go="${go}"` : '';
  return `<${tag} class="list-row ${dense ? 'dense' : ''}" ${current ? 'aria-current="true"' : ''} ${goAttr} ${attrs}>
    ${t}<span class="body"><span class="pri">${pri}</span>${sec ? `<span class="sec">${sec}</span>` : ''}</span>${tr}
  </${tag}>`;
}

// ---- Cards ----
export function productCard(p, { go = true, lockedView = false } = {}) {
  const b = D.brandById[p.brand];
  if (lockedView) {
    return `<div class="card product is-locked">
      <div class="img thumb-illo">${illo(p.illo, 64)}</div>
      <div class="lock-over">${lockChip('Higher tier')}<span class="price-hidden">Pricing hidden</span></div>
      <div class="body"><span class="brand">${esc(b.name)}</span><span class="nm">${esc(p.name)}</span></div>
    </div>`;
  }
  return `<${go ? 'button' : 'div'} class="card product" ${go ? `data-go="S004?p=${p.id}"` : ''} style="text-align:start">
    <div class="img thumb-illo">${illo(p.illo, 64)}${loveBtn(p.id, { overlay: true })}</div>
    <div class="body"><span class="brand">${esc(b.name)}</span><span class="nm">${esc(p.name)}</span>
      <div class="row">${pricePair(p, { compact: true })}<span class="muted" style="font-size:var(--fs-nano)">${esc(p.variant)}</span></div>
    </div></${go ? 'button' : 'div'}>`;
}

export function draftCard(c) {
  const total = D.cartTotal(c);
  const tag = c.sync === 'pending' ? `<span class="sync-tag"><span class="spin-dot"></span>Sync pending</span>` : '';
  return `<button class="card draft" data-go="S202?cart=${c.id}" style="text-align:start">
    <div class="head"><span class="nm">${esc(c.name)}</span>${tag}</div>
    <div class="meta"><span>${D.cartBrandCount(c)} brands</span><span><b>${money(total)}</b></span><span>${esc(c.lastEdited)}</span></div>
  </button>`;
}

export function orderCard(o) {
  const idx = D.lifecycleIndex[o.status];
  const pillKind = o.pastDue ? 'critical' : (o.status === 'settled' ? 'positive' : '');
  const pillLabel = o.pastDue ? 'Past due' : D.lifecycleSteps[idx];
  return `<button class="card order" data-go="S302?order=${o.id}" style="text-align:start">
    <div class="row"><span class="id">Order #${o.id}</span><span class="pill ${pillKind}">${o.pastDue ? icon('warning', 13) : ''}${esc(pillLabel)}</span></div>
    <div class="row"><span class="muted">${esc(o.brands.join(' · '))}</span></div>
    <div class="row"><span class="muted">${esc(o.eta)}</span>${maskField(`<span class="total">${money(o.total)}</span>`, 'spend')}</div>
  </button>`;
}

// Brand tile — the Brands wall: nine big image cards in one grid, no scroll.
export function brandTile(b, i = 0) {
  const locked = !D.canSee(b, state.get('tier'));
  const p = D.productsByBrand(b.id)[0];
  return `<button class="brand-tile ${locked ? 'is-locked' : ''}" data-go="${locked ? `S804?brand=${b.id}` : `S003?brand=${b.id}`}" aria-label="${esc(b.name)}${locked ? ', higher tier' : ''}">
    <span class="bt-art">${illo(p ? p.illo : 'jar', 54)}</span>
    <span class="bt-name">${esc(b.name)}</span>
    ${locked ? `<span class="bt-lock">${icon('lock', 12)}</span>` : ''}
  </button>`;
}

export function brandCard(b, { locked = false } = {}) {
  const nameEl = `<span class="name" style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(b.name)}</span>`;
  if (locked) {
    return `<button class="card brand is-locked" data-go="S804?brand=${b.id}" style="text-align:start">
      <div class="head">${nameEl}<span style="flex:0 0 auto;margin-inline-start:var(--s-2)">${lockChip()}</span></div>
      <p class="muted">${esc(b.cats.join(' · '))}</p>
    </button>`;
  }
  const trail = b.launching ? `<span class="tag coral">Launching</span>` : `<span style="color:var(--fg-mute)">${icon('chevron-right', 18)}</span>`;
  return `<button class="card brand" data-go="S003?brand=${b.id}" style="text-align:start">
    <div class="head">${nameEl}<span style="flex:0 0 auto;margin-inline-start:var(--s-2);display:inline-flex">${trail}</span></div>
    <p class="muted">${esc(b.cats.join(' · '))} · MOQ $${b.moq}</p>
  </button>`;
}

// ---- Generic states ----
export function emptyState({ ic = 'draft', title, body, primary, secondary }) {
  return `<div class="empty">${icon(ic, 42)}<h4>${esc(title)}</h4><p>${esc(body)}</p>
    ${primary ? `<button class="btn" ${primary.go ? `data-go="${primary.go}"` : ''} ${primary.action ? `data-action="${primary.action}"` : ''}>${esc(primary.label)}</button>` : ''}
    ${secondary ? `<button class="btn ghost sm" ${secondary.go ? `data-go="${secondary.go}"` : ''}>${esc(secondary.label)}</button>` : ''}
  </div>`;
}
export function fullscreenState({ ic = 'info', title, body, actions = [] }) {
  return `<div class="fullscreen-state"><div class="ico">${icon(ic, 48)}</div><h4>${esc(title)}</h4><p>${esc(body)}</p>
    <div class="actions">${actions.map(a => `<button class="btn ${a.ghost ? 'ghost' : ''}" ${a.go ? `data-go="${a.go}"` : ''} ${a.action ? `data-action="${a.action}"` : ''}>${esc(a.label)}</button>`).join('')}</div></div>`;
}
export function skeleton(rows = 4) {
  let h = '<div class="skeleton"><div class="s-bar lg"></div>';
  for (let i = 0; i < rows; i++) h += `<div class="s-bar"></div><div class="s-bar sm"></div>`;
  return h + '</div>';
}
export function banner(msg, { kind = '', ic = 'info', action } = {}) {
  return `<div class="banner ${kind}">${icon(ic, 20)}<span class="msg">${msg}</span>${action ? `<button class="btn sm ghost" ${action.go ? `data-go="${action.go}"` : ''} ${action.action ? `data-action="${action.action}"` : ''}>${esc(action.label)}</button>` : ''}</div>`;
}

// ---- Quantity stepper ----
export function stepper(value, { id = '', field = 'recommended', masked = false } = {}) {
  const inner = `<div class="qty" data-stepper ${id ? `data-id="${id}"` : ''}>
    <button data-step="-1" aria-label="Remove one">${icon('minus', 16)}</button>
    <input type="text" inputmode="numeric" value="${value}" aria-label="Quantity" />
    <button data-step="1" aria-label="Add one">${icon('plus', 16)}</button>
  </div>`;
  return masked ? maskField(inner, field) : inner;
}

// ---- Segmented control ----
export function segmented(options, selected, name) {
  return `<div class="segmented" role="tablist" data-seg="${name}">${options.map(o =>
    `<button role="tab" aria-selected="${o.value === selected}" data-val="${o.value}">${esc(o.label)}</button>`).join('')}</div>`;
}

// ---- Timeline (lifecycle) ----
export function timeline(steps, currentIndex, captions = {}) {
  return `<div class="timeline"><span class="rail"></span>${steps.map((s, i) =>
    `<div class="step ${i > currentIndex ? 'todo' : ''}"><span class="pip"></span><div><b>${esc(s)}</b>${captions[i] ? `<div class="caption">${esc(captions[i])}</div>` : ''}</div></div>`).join('')}</div>`;
}

// ---- Switch / toggle row (clean flex layout, no leading thumbnail) ----
export function switchRow(label, checked, { sub = '', action = '' } = {}) {
  return `<div class="toggle-row"><span class="tl"><span class="pri">${esc(label)}</span>${sub ? `<span class="sec">${esc(sub)}</span>` : ''}</span>
    <label class="switch"><input type="checkbox" ${checked ? 'checked' : ''} ${action ? `data-action="${action}"` : ''} aria-label="${esc(label)}" /><span class="track"></span><span class="thumb"></span></label></div>`;
}

// ---- Header action icons (search / bell / etc.) ----
export function hActions(list) {
  return list.map((a) => {
    const attr = a.go ? `data-go="${a.go}"` : (a.action ? `data-action="${a.action}"` : '');
    const badge = a.badge ? `<span class="badge">${esc(a.badge)}</span>` : '';
    return `<button class="hicon" ${attr} aria-label="${esc(a.label || a.icon)}">${icon(a.icon, 22)}${badge}</button>`;
  }).join('');
}
// Standard header actions for primary screens: search + love list + notifications.
export function tabHeaderActions({ search = 'S005', bell = true, love = true } = {}) {
  const list = [];
  if (search) list.push({ icon: 'search', go: search, label: 'Search' });
  if (love) { const n = state.lovedCount(); list.push({ icon: 'heart', go: 'S010', label: 'Love list', badge: n ? String(n) : '' }); }
  if (bell) list.push({ icon: 'bell', go: 'S701', label: 'Notifications', badge: '3' });
  return hActions(list);
}
export function sectionLabel(t) { return `<div class="section-label">${esc(t)}</div>`; }

// Recompute line + cart totals after a quantity change, in place.
export function recomputeTotals(root) {
  let grand = 0;
  const brandSub = {};
  root.querySelectorAll('[data-line]').forEach((row) => {
    const price = parseFloat(row.dataset.price) || 0;
    const brand = row.dataset.brand;
    const input = row.querySelector('[data-stepper] input');
    const qty = input ? (parseInt(input.value, 10) || 0) : (parseInt(row.dataset.qty, 10) || 0);
    const lineTotal = price * qty;
    grand += lineTotal;
    if (brand) brandSub[brand] = (brandSub[brand] || 0) + lineTotal;
    const lt = row.querySelector('[data-linetotal] .mv, [data-linetotal]');
    if (lt) lt.textContent = '$' + lineTotal.toLocaleString('en-US');
  });
  const gt = root.querySelector('[data-carttotal] .mv, [data-carttotal]');
  if (gt) gt.textContent = grand.toLocaleString('en-US');
  // brand MOQ chips
  root.querySelectorAll('[data-moq]').forEach((chip) => {
    const b = chip.dataset.moq; const min = parseFloat(chip.dataset.min) || 0;
    const sub = brandSub[b] || 0;
    if (sub >= min) { chip.className = 'moq'; chip.innerHTML = `${icon('check', 12)}MOQ met`; }
    else { chip.className = 'moq unmet'; chip.innerHTML = `${icon('warning', 12)}$${min} · $${min - sub} to go`; }
  });
  return grand;
}

// ====================================================================
//  OVERLAYS — scoped to the device. Sheets / modals / drawers / toasts.
// ====================================================================
let overlayRoot, toastHost;
const overlayStack = [];
export function initOverlays(root, toasts) { overlayRoot = root; toastHost = toasts; }

function trapFocus(container, onEsc) {
  const sel = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';
  function key(e) {
    if (e.key === 'Escape') { e.preventDefault(); onEsc(); return; }
    if (e.key !== 'Tab') return;
    const f = [...container.querySelectorAll(sel)].filter(el => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  container.addEventListener('keydown', key);
  return () => container.removeEventListener('keydown', key);
}

function enableSwipeDown(sheetEl, close) {
  // Draggable from the grab handle AND the title row, like a native sheet.
  const handles = [sheetEl.querySelector('.grab'), sheetEl.querySelector('.row-between')].filter(Boolean);
  if (!handles.length) return;
  let startY = null;
  const move = (e) => { if (startY == null) return; const dy = Math.max(0, e.clientY - startY); sheetEl.style.transform = `translateY(${dy}px)`; };
  const end = (e) => { if (startY == null) return; const dy = Math.max(0, e.clientY - startY); sheetEl.style.transition = ''; if (dy > 90) close(); else sheetEl.style.transform = ''; startY = null; };
  handles.forEach((h) => {
    h.style.touchAction = 'none';
    h.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.sheet-x,button:not(.grab),input,select,textarea')) return; // don't hijack controls
      startY = e.clientY; try { h.setPointerCapture(e.pointerId); } catch {} sheetEl.style.transition = 'none';
    });
    h.addEventListener('pointermove', move);
    h.addEventListener('pointerup', end);
    h.addEventListener('pointercancel', end);
  });
}

function mountOverlay(_shellClass, innerHTML, { onMount, dismissible = true } = {}) {
  const prevFocus = document.activeElement;
  const wrap = document.createElement('div');
  wrap.className = 'overlay-host';
  wrap.innerHTML = `<div class="scrim"></div>${innerHTML}`;
  overlayRoot.appendChild(wrap);
  const shell = wrap.querySelector('.sheet-shell,.modal-shell,.drawer-shell');
  const panel = shell ? shell.querySelector('.sheet,.modal,.drawer') : null;
  const close = () => {
    const untrap = wrap._untrap; if (untrap) untrap();
    wrap.remove();
    const i = overlayStack.indexOf(close); if (i >= 0) overlayStack.splice(i, 1);
    if (prevFocus && prevFocus.focus) try { prevFocus.focus(); } catch {}
  };
  // explicit close buttons
  wrap.querySelectorAll('[data-dismiss]').forEach((b) => b.addEventListener('click', close));
  if (dismissible) {
    // tap on the backdrop closes — both the scrim layer and the shell area outside the panel
    wrap.querySelector('.scrim')?.addEventListener('click', close);
    if (shell) {
      shell.addEventListener('click', (e) => { if (e.target === shell) close(); });
      if (shell.classList.contains('sheet-shell') && panel) enableSwipeDown(panel, close);
    }
  }
  wrap._untrap = trapFocus(wrap, () => { if (dismissible) close(); });
  overlayStack.push(close);
  if (onMount) onMount(wrap, close);
  // Focus the dialog itself (screen reader announces its label first; avoids a
  // clipped focus ring on whatever control happens to come first).
  if (panel) { panel.setAttribute('tabindex', '-1'); setTimeout(() => panel.focus({ preventScroll: true }), 30); }
  return close;
}

export function openSheet({ title = '', html = '', onMount, dismissible = true } = {}) {
  const inner = `<div class="sheet-shell"><div class="sheet" role="dialog" aria-modal="true" ${title ? 'aria-label="' + esc(title) + '"' : ''}>
    <button class="grab" aria-label="Drag down or tap to close" data-dismiss></button>${title ? `<div class="row-between" style="margin-bottom:var(--s-1)"><h4>${esc(title)}</h4><button class="sheet-x" data-dismiss aria-label="Close">${icon('close', 16)}</button></div>` : ''}
    ${html}</div></div>`;
  return mountOverlay('overlay-host', inner, { onMount, dismissible });
}
export function openModal({ title = '', html = '', actions = [], onMount, dismissible = true } = {}) {
  const act = actions.length ? `<div class="actions">${actions.map(a => `<button class="btn ${a.ghost ? 'ghost' : ''} ${a.danger ? 'danger' : ''}" data-modal-act="${a.id || ''}" ${a.go ? `data-go="${a.go}"` : ''} ${a.action ? `data-action="${a.action}"` : ''}>${esc(a.label)}</button>`).join('')}</div>` : '';
  const inner = `<div class="modal-shell"><div class="modal" role="alertdialog" aria-modal="true" aria-label="${esc(title)}">
    <div class="head"><h4>${esc(title)}</h4><button class="close" data-dismiss aria-label="Close">${icon('close', 14)}</button></div>
    ${html}${act}</div></div>`;
  return mountOverlay('overlay-host', inner, { onMount, dismissible });
}
export function openDrawer({ title = '', html = '', onMount } = {}) {
  const inner = `<div class="drawer-shell"><div class="drawer" role="dialog" aria-modal="true" aria-label="${esc(title)}">
    <div class="row-between"><h4>${esc(title)}</h4><button class="close" data-dismiss aria-label="Close">${icon('close', 14)}</button></div>${html}</div></div>`;
  return mountOverlay('overlay-host', inner, { onMount });
}
export function closeTopOverlay() { const c = overlayStack[overlayStack.length - 1]; if (c) c(); }
export function closeAllOverlays() { while (overlayStack.length) overlayStack.pop()(); }

export function toast(msg, { action, positive = false, ms = 4000 } = {}) {
  const t = document.createElement('div');
  t.className = `toast ${positive ? 'positive' : ''}`;
  t.innerHTML = `${icon(positive ? 'check' : 'info', 20)}<span class="msg">${msg}</span>${action ? `<button class="act">${esc(action.label)}</button>` : ''}`;
  toastHost.appendChild(t);
  if (action) t.querySelector('.act').addEventListener('click', () => { action.fn && action.fn(); t.remove(); });
  setTimeout(() => { t.style.transition = 'opacity .3s'; t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, ms);
}

// ---- Privacy wiring (called on every screen mount + on overlay mount) ----
// Per-chip gestures are gone — masking is the single global toggle, flipped
// by the header eye. Nothing to wire on individual chips anymore.
export function wirePrivacy() {}

// ---- Steppers wiring ----
export function wireSteppers(root, onChange) {
  root.querySelectorAll('[data-stepper]').forEach((q) => {
    if (q._wired) return; q._wired = true;
    const input = q.querySelector('input');
    q.querySelectorAll('[data-step]').forEach((b) => b.addEventListener('click', () => {
      let v = parseInt(input.value, 10) || 0;
      v = Math.max(0, v + parseInt(b.dataset.step, 10));
      input.value = v;
      onChange && onChange(q.dataset.id, v);
    }));
  });
}

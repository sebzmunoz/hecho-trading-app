import * as C from '../components.js';
import * as D from '../data.js';
import { state } from '../state.js';
import { icon } from '../icons.js';
import { base } from './shop.js';

function viewfinder(extra = '') {
  const lowlight = state.get('_state') === 'lowlight';
  return `<div class="viewfinder" style="aspect-ratio:auto;flex:1;border-radius:0">
    <div class="corners"><i class="tr"></i><i class="bl"></i></div>
    ${state.get('_state') === 'identifying' ? '' : '<div class="scan-line"></div>'}
    ${lowlight ? `<div class="lowlight">${icon('flash', 12)} Low light · tap for flash</div>` : ''}
    <div class="hint">${state.get('_state') === 'identifying' ? 'Identifying…' : 'Center any product · I\'ll do the rest'}</div>
    ${extra}</div>`;
}

export const scan = {
  // S101 Scanner viewfinder
  S101() {
    if (state.get('_state') === 'perm') return scan.S105();
    const controls = `
      <div style="position:absolute;top:var(--s-3);left:var(--s-3);right:var(--s-3);display:flex;justify-content:space-between;z-index:5">
        <button class="cam-btn" data-go="S708" aria-label="Live stock">${icon('layers', 18)}</button>
        <button class="cam-btn" data-action="flash" aria-label="Flash">${icon('flash', 18)}</button>
      </div>
      <div style="position:absolute;bottom:var(--s-6);left:0;right:0;display:flex;flex-direction:column;align-items:center;gap:var(--s-4);z-index:5;padding:0 var(--s-4)">
        <button class="btn lg" data-action="simulate-scan">Simulate a scan</button>
        <button class="cam-link" data-go="S106">Enter SKU by hand</button>
      </div>`;
    return base('Scan', { tab: 'scan', camera: true, flush: true, body: `<div style="position:relative;display:flex;flex-direction:column;height:100%">${viewfinder(controls)}</div>` });
  },

  // S102 Scan result (half-sheet over camera)
  S102(params) {
    const p = D.productById[params.p] || D.productById['p-throw'];
    const b = D.brandById[p.brand];
    const rec = D.recommendedQty(p);
    const st = D.stockState(p);
    const stockVal = st.kind === 'out' ? 'Out' : String(st.value);
    const card = `<div class="scan-result" style="position:absolute;left:var(--s-3);right:var(--s-3);bottom:var(--s-3);z-index:6;width:auto;max-width:none">
      <div class="top"><div class="info"><span class="brand">${b.name}</span><span class="nm">${p.name}</span><span class="muted" style="font-size:var(--fs-nano)">${p.variant}</span></div></div>
      <div class="grid-info">
        <div class="col"><span class="l">Your price</span><span class="v">${C.pricePair(p, { compact: true })}</span></div>
        <div class="col"><span class="l">Your stock</span><span class="v">${C.maskField(stockVal, 'stock')}</span></div>
        <div class="col"><span class="l">Last order</span><span class="v">${p.lastOrder ? `${p.lastOrderQty} · ${p.lastOrder}` : 'First time'}</span></div>
        <div class="col"><span class="l">Reorder rec</span><span class="v rec">${rec ? C.maskField(String(rec), 'recommended') : '<span class="manual-link">Reorder?</span>'}</span></div>
      </div>
      <div class="actions"><button class="btn ghost sm" data-go="S004?p=${p.id}">View</button><button class="btn sm" data-action="add-to-cart" data-p="${p.id}" data-qty="${rec || 12}">Add${rec ? ` ×${rec}` : ''}</button></div>
    </div>`;
    return base('Scan result', { tab: 'scan', camera: true, flush: true, body: `<div style="position:relative;display:flex;flex-direction:column;height:100%">${viewfinder()}${card}</div>` });
  },

  // S105 Permission denied (camera)
  S105() {
    return base('Scan', { tab: 'scan', body: `<div class="viewfinder permission" style="aspect-ratio:4/5">${icon('camera', 48)}<h4>Camera is off</h4><p>I can't open the camera without permission, so scanning is off for now.</p></div>
      <button class="btn full" data-action="open-settings">Open Settings</button>
      <button class="btn ghost full" data-go="S005">Search instead</button>
      <button class="btn ghost full" data-go="S106">Enter SKU by hand</button>` });
  },

  // S106 Manual SKU entry
  S106() {
    const err = state.get('_state') === 'error';
    const body = `
      <div class="input-group"><label>SKU or barcode</label><input class="input" inputmode="numeric" placeholder="e.g. 4821-OAT" aria-invalid="${err}" />${err ? `<span class="help err">${icon('warning', 16)} SKU not found. Check the digits.</span>` : ''}</div>
      ${C.sectionLabel('Recent SKUs')}
      <div class="chip-row">${['4821-OAT', '3390-MNT', '1107-PNK'].map((s) => `<button class="chip">${s}</button>`).join('')}</div>
      <button class="btn full" data-go="S004?p=p-throw">Look up</button>
      <button class="btn ghost full" data-go="S005">Open search</button>`;
    return base('Enter SKU', { back: true, body });
  },
};

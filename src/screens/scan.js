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
        <div class="segmented on-camera" data-seg="mode"><button role="tab" aria-selected="true" data-val="barcode">Barcode</button><button role="tab" aria-selected="false" data-val="photo" data-go="S103">Photo</button></div>
        <button class="btn lg" data-action="simulate-scan">Simulate a scan</button>
        <button class="cam-link" data-go="S106">Enter SKU by hand</button>
      </div>`;
    return base('Scan', { tab: 'scan', camera: true, flush: true, body: `<div style="position:relative;display:flex;flex-direction:column;height:100%">${viewfinder(controls)}</div>` });
  },

  // S102 Scan result (half-sheet over camera)
  S102(params) {
    const p = D.productById[params.p] || D.productById['p-throw'];
    const b = D.brandById[p.brand];
    const rec = D.recommendedQty(p, state.get('pos') === 'connected');
    const st = D.stockState(p, state.get('pos'));
    const stockVal = st.kind === 'out' ? 'Out' : (st.kind === 'unknown' ? String(st.value) : String(st.value));
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

  // S103 Photo recognition
  S103() {
    const controls = `
      <div style="position:absolute;bottom:var(--s-5);left:0;right:0;display:flex;flex-direction:column;align-items:center;gap:var(--s-3);z-index:5">
        <div class="segmented on-camera" data-seg="mode"><button role="tab" aria-selected="false" data-val="barcode" data-go="S101">Barcode</button><button role="tab" aria-selected="true" data-val="photo">Photo</button></div>
        <div class="row" style="display:flex;gap:var(--s-4);align-items:center">
          <button class="cam-btn" data-action="library" aria-label="Pick from library">${icon('image', 22)}</button>
          <button data-action="capture-photo" aria-label="Capture" style="width:68px;height:68px;border-radius:50%;border:4px solid var(--on-viewfinder);background:var(--on-viewfinder)"></button>
          <button class="cam-btn" aria-label="Flash">${icon('flash', 22)}</button>
        </div>
        <span class="hint" style="position:static">Photograph a product on any shelf or page</span></div>`;
    return base('Photo identify', { tab: 'scan', camera: true, flush: true, body: `<div style="position:relative;display:flex;flex-direction:column;height:100%"><div class="viewfinder" style="flex:1;border-radius:0"><div class="corners"><i class="tr"></i><i class="bl"></i></div></div>${controls}</div>` });
  },

  // S104 Photo result
  S104() {
    const noMatch = state.get('_state') === 'nomatch';
    if (noMatch) {
      return base('No match', { back: true, body: `${C.emptyState({ ic: 'camera', title: 'I couldn\'t place that one', body: 'No confident match. Try the AI ingest path instead.' })}
        <div class="grid-2"><button class="btn ghost sm" data-action="forward-email">${icon('mail', 16)} Forward an email</button><button class="btn ghost sm" data-action="upload-file">${icon('download', 16)} Upload a file</button></div>` });
    }
    // §07-H H2: show score >= 0.40, best-guess flag when top < 0.65, cap 5
    const cands = D.photoCandidates.filter((c) => c.score >= 0.4).sort((a, b) => b.score - a.score).slice(0, 5);
    const tentative = cands[0].score < 0.65;
    const body = `
      ${tentative ? C.banner('Best guess only — none of these is a confident match.', { kind: 'caution', ic: 'warning' }) : ''}
      <div class="candidate-list">${cands.map((c) => {
        const p = D.productById[c.product]; const b = D.brandById[p.brand];
        const conf = c.score >= 0.75 ? '' : (c.score >= 0.55 ? 'mid' : 'low');
        const pct = Math.round(c.score * 100);
        return `<button class="list-row" data-go="S004?p=${p.id}" style="text-align:start"><span class="thumb thumb-illo">${C.illo(p.illo, 24)}</span><span class="body"><span class="pri">${p.name}</span><span class="sec">${b.name} · $${p.wholesale}</span></span><span class="trail"><span class="confidence ${conf}"><span class="meter"><i style="width:${pct}%"></i></span>${pct}%</span></span></button>`;
      }).join('')}</div>
      <button class="btn ghost full" data-action="forward-email">None of these — forward an email</button>`;
    return base('Best matches', { back: true, body });
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

import * as C from '../components.js';
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
  // S101 Scanner viewfinder — barcode only
  S101() {
    if (state.get('_state') === 'perm') return scan.S105();
    const controls = `
      <div style="position:absolute;top:var(--s-3);right:var(--s-3);display:flex;justify-content:flex-end;z-index:5">
        <button class="cam-btn" data-action="flash" aria-label="Flash">${icon('flash', 18)}</button>
      </div>
      <div style="position:absolute;bottom:var(--s-6);left:0;right:0;display:flex;flex-direction:column;align-items:center;gap:var(--s-4);z-index:5;padding:0 var(--s-4)">
        <button class="btn lg" data-action="simulate-scan">Simulate a scan</button>
        <button class="cam-link" data-go="S106">Enter SKU by hand</button>
      </div>`;
    return base('Scan', { tab: 'scan', camera: true, flush: true, body: `<div style="position:relative;display:flex;flex-direction:column;height:100%">${viewfinder(controls)}</div>` });
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

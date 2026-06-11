// ============================================================
// Control panel (the side console): Flows · Screens · Variables · Telemetry.
// Writes to the reactive store; screens re-render so you can watch them react.
// ============================================================
import { state, applyEnvironment } from './state.js';
import { nav } from './router.js';
import { registry, groupedScreens, SCREEN_COUNT } from './registry.js';
import { flows, flowById, walkthrough } from './flows.js';
import { esc } from './components.js';

let panelTab = 'flows';
let flowState = { id: null, i: 0, queue: null };   // queue: array of flow ids (walkthrough)
let screenFilter = '';

const $ = (s, r = document) => r.querySelector(s);
const body = () => $('#consoleBody');

export function initPanel() {
  // console top tabs
  $('#consoleTabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-ctab]'); if (!b) return;
    panelTab = b.dataset.ctab;
    $('#consoleTabs').querySelectorAll('[role=tab]').forEach((t) => t.setAttribute('aria-selected', String(t === b)));
    renderPanel();
  });

  // delegated clicks inside the console body
  body().addEventListener('click', onPanelClick);
  body().addEventListener('input', onPanelInput);

  // re-render Variables / footer when state changes
  state.subscribe(() => { if (panelTab === 'vars') renderPanel(); });
  state.subscribeTelemetry(() => { if (panelTab === 'tel') renderPanel(); });

  renderPanel();
}

export function onRouteChange(route) {
  const entry = registry[route.id];
  $('#footScreen').textContent = entry ? `${route.id} · ${entry.name}` : route.id;
  // keep flow player's "current" marker honest if user navigated manually
  if (panelTab === 'screens' || panelTab === 'flows' || panelTab === 'vars') renderPanel();
}

function renderPanel() {
  const r = body();
  if (panelTab === 'flows') r.innerHTML = renderFlows();
  else if (panelTab === 'screens') r.innerHTML = renderScreens();
  else if (panelTab === 'vars') r.innerHTML = renderVars();
  else r.innerHTML = renderTelemetry();
  if (panelTab === 'screens') { const s = $('#screenSearch'); if (s) { s.value = screenFilter; } }
}

// ---------- FLOWS ----------
function renderFlows() {
  const cur = nav.current().id;
  let player = '';
  if (flowState.id) {
    const f = flowById[flowState.id];
    const step = f.steps[flowState.i];
    player = `<div class="flow-player">
      <div class="fp-head"><span class="fp-title">${f.id} · ${esc(f.name)}</span><span class="fp-count">${flowState.i + 1}/${f.steps.length}</span></div>
      <div class="fp-step"><span class="sid">${esc(step.screen.split('?')[0])}</span> ${esc(step.text)}
        ${step.branch ? `<div class="fp-branch"><button class="c-item" data-branch="${esc(step.branch.screen)}" style="padding:4px 8px;margin-top:4px"><span class="cnm">${esc(step.branch.label)} →</span></button></div>` : ''}</div>
      <div class="fp-nav">
        <button class="btn ghost sm" data-fp="prev" ${flowState.i === 0 && !flowState.queue ? 'disabled' : ''}>Back</button>
        <button class="btn sm" data-fp="next">${flowState.i === f.steps.length - 1 ? (flowState.queue && flowState.qi < flowState.queue.length - 1 ? 'Next flow' : 'Finish') : 'Next'}</button>
      </div>
      <button class="btn ghost sm" data-fp="exit">Exit player</button>
    </div>`;
  }
  const items = flows.map((f) => `<button class="c-item ${flowState.id === f.id ? 'is-active' : ''}" data-flow="${f.id}">
    <span class="cid">${f.id}</span><span class="cnm">${esc(f.name)}</span><span class="cph">${f.phase}</span></button>`).join('');
  return `
    <button class="c-item" data-flow-walk style="border-color:var(--accent);background:color-mix(in srgb,var(--accent) 6%,transparent)">
      <span class="cid">▶</span><span class="cnm"><b>${esc(walkthrough.name)}</b><br/><span class="muted" style="font-size:var(--fs-nano)">F1 → F2 → F6 → F7 → F12</span></span></button>
    ${player}
    <div class="c-group-h">All flows <span>${flows.length}</span></div>
    <div class="console-list">${items}</div>`;
}

function startFlow(id, queue = null, qi = 0) {
  flowState = { id, i: 0, queue, qi };
  goStep();
  renderPanel();
}
function goStep() {
  const f = flowById[flowState.id];
  const step = f.steps[flowState.i];
  navStep(step.screen);
}
function navStep(screen) {
  // role auto-switch for rep screens
  if (/^S60[0-7]/.test(screen) && state.get('role') !== 'rep') state.set({ role: 'rep' });
  const [base, q] = screen.split('?_=');
  if (q !== undefined) { nav.go(base); state.setEphemeral('_state', q); nav.refresh(); }
  else { state.setEphemeral('_state', null); nav.go(screen); }
}

// ---------- SCREENS ----------
function renderScreens() {
  const groups = groupedScreens();
  const cur = nav.current().id;
  const f = screenFilter.toLowerCase();
  let html = `<div class="search" style="margin-bottom:var(--s-2)"><input id="screenSearch" placeholder="Find a screen (${SCREEN_COUNT})" aria-label="Find a screen" value="${esc(screenFilter)}" /></div>`;
  for (const g in groups) {
    const list = groups[g].filter((s) => !f || s.id.toLowerCase().includes(f) || s.name.toLowerCase().includes(f));
    if (!list.length) continue;
    html += `<div class="c-group-h">${g} <span>${list.length}</span></div><div class="console-list">`;
    html += list.map((s) => `<button class="c-item ${cur === s.id ? 'is-active' : ''}" data-screen="${s.id}"><span class="cid">${s.id}</span><span class="cnm">${esc(s.name)}</span></button>`).join('');
    html += `</div>`;
  }
  return html;
}

// ---------- VARIABLES ----------
function seg(varKey, opts, current) {
  return `<div class="seg-mini" data-var="${varKey}">${opts.map((o) => `<button data-val="${o.v}" aria-pressed="${o.v === current}">${esc(o.l)}</button>`).join('')}</div>`;
}
function row(key, sub, control) {
  return `<div class="var-row"><span class="vk">${esc(key)}${sub ? `<small>${esc(sub)}</small>` : ''}</span>${control}</div>`;
}
function renderVars() {
  const s = state.get();
  const cur = nav.current().id;
  const entry = registry[cur];
  const stateOpts = (entry?.states || ['default']).map((st) => ({ v: st, l: st }));
  const curState = s._state || 'default';
  return `
    <div class="var-group"><span class="gl">Persona & role</span>
      ${row('Role', '§02b capabilities', seg('role', [{ v: 'admin', l: 'Admin' }, { v: 'staff', l: 'Staff' }, { v: 'rep', l: 'Rep' }], s.role))}
    </div>
    <div class="var-group"><span class="gl">Privacy on the floor</span>
      ${row('Privacy', 'the header eye toggle', seg('privacyOn', [{ v: true, l: 'On' }, { v: false, l: 'Off' }], s.privacyOn))}
    </div>
    <div class="var-group"><span class="gl">Account</span>
      ${row('Tax-ID', 'submit gating (F10)', seg('taxId', [{ v: 'current', l: 'Current' }, { v: 'renews', l: 'Renews' }, { v: 'expired', l: 'Expired' }], s.taxId))}
    </div>
    <div class="var-group"><span class="gl">Environment</span>
      ${row('Network', '§07-A', seg('network', [{ v: 'online', l: 'Online' }, { v: 'offline', l: 'Offline' }, { v: 'slow', l: 'Slow' }], s.network))}
      ${row('Theme', 'camera always dark', seg('theme', [{ v: 'light', l: 'Light' }, { v: 'dark', l: 'Dark' }], s.theme))}
      ${row('Reduced motion', '', seg('reducedMotion', [{ v: false, l: 'Off' }, { v: true, l: 'On' }], s.reducedMotion))}
    </div>
    <div class="var-group"><span class="gl">This screen — ${cur}</span>
      ${row('State', entry?.name || '', seg('_screenstate', stateOpts, curState))}
    </div>
    <button class="btn ghost sm full" data-var-reset style="margin-top:var(--s-2)">Reset all variables</button>`;
}

// ---------- TELEMETRY ----------
function renderTelemetry() {
  const log = state.getTelemetry();
  if (!log.length) return `<div class="tel-empty">No events yet. Tap around the app — §07-G events (scan, cart, privacy, payment…) log here as affordances fire.</div>`;
  return `<button class="btn ghost sm full" data-tel-clear style="margin-bottom:var(--s-2)">Clear log</button>
    <div class="telemetry">${log.map((e) => `<div class="tel-row"><span class="ts">${e.n}</span><span class="te">${esc(e.event)}</span>${e.source ? `<span class="tsrc">${esc(e.source)}</span>` : ''}</div>`).join('')}</div>`;
}

// ---------- interactions ----------
function onPanelClick(e) {
  const t = e.target;
  const flowBtn = t.closest('[data-flow]'); if (flowBtn) { startFlow(flowBtn.dataset.flow); return; }
  if (t.closest('[data-flow-walk]')) { const q = walkthrough.flows; startFlow(q[0], q, 0); return; }
  const branch = t.closest('[data-branch]'); if (branch) { navStep(branch.dataset.branch); return; }
  const fp = t.closest('[data-fp]'); if (fp) { flowNav(fp.dataset.fp); return; }
  const sc = t.closest('[data-screen]'); if (sc) { state.setEphemeral('_state', null); nav.go(sc.dataset.screen); closeDrawerIfMobile(); return; }
  const segBtn = t.closest('.seg-mini [data-val]');
  if (segBtn) { setVar(segBtn.closest('[data-var]').dataset.var, parseVal(segBtn.dataset.val)); return; }
  if (t.closest('[data-var-reset]')) { state.reset(); applyEnvironment(); nav.refresh(); return; }
  if (t.closest('[data-tel-clear]')) { state.clearTelemetry(); return; }
}
function onPanelInput(e) {
  if (e.target.id === 'screenSearch') { screenFilter = e.target.value; renderScreens_inplace(); }
}
function renderScreens_inplace() {
  // re-render list without losing focus on the search box
  const r = body();
  const search = r.querySelector('#screenSearch');
  const sel = search ? search.selectionStart : null;
  r.innerHTML = renderScreens();
  const s2 = r.querySelector('#screenSearch'); if (s2) { s2.focus(); if (sel != null) s2.setSelectionRange(sel, sel); }
}

function parseVal(v) { return v === 'true' ? true : v === 'false' ? false : v; }

function setVar(key, val) {
  if (key === '_screenstate') {
    state.setEphemeral('_state', val === 'default' ? null : val);
    nav.refresh();
    return;
  }
  const prevRole = state.get('role');
  state.set({ [key]: val });
  if (['theme', 'reducedMotion', 'network'].includes(key)) applyEnvironment();
  if (key === 'role') {
    if (val === 'rep') return nav.go('S602', { resetStack: true });
    if (prevRole === 'rep') return nav.go('S401', { resetStack: true });
  }
  nav.refresh();
}

function flowNav(dir) {
  const f = flowById[flowState.id];
  if (dir === 'exit') { flowState = { id: null, i: 0, queue: null }; renderPanel(); return; }
  if (dir === 'prev') {
    if (flowState.i > 0) flowState.i--;
    else if (flowState.queue && flowState.qi > 0) { flowState.qi--; flowState.id = flowState.queue[flowState.qi]; flowState.i = flowById[flowState.id].steps.length - 1; }
  } else { // next
    if (flowState.i < f.steps.length - 1) flowState.i++;
    else if (flowState.queue && flowState.qi < flowState.queue.length - 1) { flowState.qi++; flowState.id = flowState.queue[flowState.qi]; flowState.i = 0; }
    else { flowState = { id: null, i: 0, queue: null }; renderPanel(); return; }
  }
  goStep();
  renderPanel();
}

function closeDrawerIfMobile() {
  if (window.matchMedia('(max-width:1040px)').matches) document.getElementById('appShell').classList.remove('console-open');
}

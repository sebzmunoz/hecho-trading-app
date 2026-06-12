// Icon registry — 1.6px line icons on a 32px keyline grid, from the Design System.
// Usage: icon('scan') -> svg string (inherits currentColor). icon('scan', 20) sets size.

const P = {
  scan: `<path d="M5 9V6a1 1 0 0 1 1-1h3"/><path d="M23 5h3a1 1 0 0 1 1 1v3"/><path d="M27 23v3a1 1 0 0 1-1 1h-3"/><path d="M9 27H6a1 1 0 0 1-1-1v-3"/><path d="M10 11v10M14 11v10M18 11v10M22 11v10"/>`,
  camera: `<rect x="5" y="9" width="22" height="16" rx="2"/><circle cx="16" cy="17" r="4.5"/><path d="M11 9l2-3h6l2 3"/>`,
  search: `<circle cx="14" cy="14" r="8"/><path d="M20 20l7 7"/>`,
  cart: `<path d="M7 10h18l-2 14a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3z"/><path d="M11 10a5 5 0 0 1 10 0"/>`,
  draft: `<rect x="7" y="6" width="18" height="22" rx="2"/><path d="M12 12h8M12 17h8M12 22h5"/>`,
  reorder: `<path d="M26 16a10 10 0 1 1-3-7"/><path d="M26 6v6h-6"/>`,
  bell: `<path d="M16 4a7 7 0 0 0-7 7v5l-2 4h18l-2-4v-5a7 7 0 0 0-7-7z"/><path d="M13 24a3 3 0 0 0 6 0"/>`,
  chat: `<path d="M6 8h20v14H14l-5 5v-5H6z"/>`,
  user: `<circle cx="16" cy="12" r="5"/><path d="M6 27c1-5 5-8 10-8s9 3 10 8"/>`,
  settings: `<circle cx="16" cy="16" r="3"/><path d="M16 4v3M16 25v3M4 16h3M25 16h3M7.5 7.5l2 2M22.5 22.5l2 2M7.5 24.5l2-2M22.5 9.5l2-2"/>`,
  home: `<path d="M4 14l12-9 12 9v14a1 1 0 0 1-1 1h-7v-9h-8v9H5a1 1 0 0 1-1-1z"/>`,
  map: `<path d="M16 28s-9-8-9-15a9 9 0 1 1 18 0c0 7-9 15-9 15z"/><circle cx="16" cy="13" r="3"/>`,
  qr: `<rect x="5" y="5" width="9" height="9"/><rect x="18" y="5" width="9" height="9"/><rect x="5" y="18" width="9" height="9"/><path d="M18 18h4v4M18 22v5h5v-5M27 27v-5"/>`,
  check: `<path d="M6 16l7 7L26 9"/>`,
  close: `<path d="M8 8l16 16M24 8L8 24"/>`,
  plus: `<path d="M16 7v18M7 16h18"/>`,
  minus: `<path d="M7 16h18"/>`,
  'chevron-right': `<path d="M12 6l10 10-10 10"/>`,
  'chevron-left': `<path d="M20 6L10 16l10 10"/>`,
  'chevron-up': `<path d="M6 20l10-10 10 10"/>`,
  'chevron-down': `<path d="M6 12l10 10 10-10"/>`,
  filter: `<path d="M5 8h22M9 16h14M13 24h6"/>`,
  share: `<circle cx="9" cy="16" r="3"/><circle cx="23" cy="9" r="3"/><circle cx="23" cy="23" r="3"/><path d="M11.5 14.5l9-4M11.5 17.5l9 4"/>`,
  eye: `<path d="M3 16s5-9 13-9 13 9 13 9-5 9-13 9S3 16 3 16z"/><circle cx="16" cy="16" r="4"/>`,
  'eye-off': `<path d="M3 16s5-9 13-9c2.4 0 4.6.7 6.5 1.8M29 16s-5 9-13 9c-2.4 0-4.6-.7-6.5-1.8"/><path d="M11 11a5 5 0 0 0 7 7M21 21a5 5 0 0 0-3-9"/><path d="M5 5l22 22"/>`,
  trash: `<path d="M7 10h18M11 10v17a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V10M13 10V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3"/>`,
  info: `<circle cx="16" cy="16" r="11"/><path d="M16 11v6M16 21h.01"/>`,
  warning: `<path d="M16 5l13 22H3z"/><path d="M16 13v6M16 23h.01"/>`,
  star: `<path d="M16 3l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>`,
  mail: `<path d="M5 12l11-7 11 7v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z"/><path d="M5 12l11 7 11-7"/>`,
  list: `<rect x="5" y="5" width="22" height="22" rx="3"/><path d="M11 12h10M11 16h10M11 20h6"/>`,
  lock: `<rect x="6" y="11" width="20" height="15" rx="2"/><path d="M11 11V8a5 5 0 0 1 10 0v3"/><circle cx="16" cy="18" r="1.4" fill="currentColor"/>`,
  clock: `<circle cx="16" cy="16" r="11"/><path d="M16 10v6l4 3"/>`,
  truck: `<path d="M3 8h14v13H3z"/><path d="M17 12h5l4 4v5h-9z"/><circle cx="8" cy="24" r="2.4"/><circle cx="22" cy="24" r="2.4"/>`,
  card: `<rect x="3" y="7" width="26" height="18" rx="2"/><path d="M3 13h26M7 19h6"/>`,
  bank: `<path d="M16 4l12 6H4z"/><path d="M6 12v10M12 12v10M20 12v10M26 12v10M4 26h24"/>`,
  doc: `<path d="M8 4h11l5 5v19H8z"/><path d="M19 4v5h5M12 16h8M12 20h8M12 12h4"/>`,
  flag: `<path d="M8 4v24"/><path d="M8 5h14l-3 5 3 5H8"/>`,
  pin: `<path d="M16 28s-9-8-9-15a9 9 0 1 1 18 0c0 7-9 15-9 15z"/><circle cx="16" cy="13" r="3"/>`,
  mic: `<rect x="12" y="4" width="8" height="14" rx="4"/><path d="M8 15a8 8 0 0 0 16 0M16 23v4M12 27h8"/>`,
  image: `<rect x="4" y="6" width="24" height="20" rx="2"/><circle cx="11" cy="13" r="2.5"/><path d="M5 24l7-7 5 5 4-3 6 6"/>`,
  flash: `<path d="M17 3L7 18h7l-1 11 10-15h-7z"/>`,
  grid: `<rect x="5" y="5" width="9" height="9"/><rect x="18" y="5" width="9" height="9"/><rect x="5" y="18" width="9" height="9"/><rect x="18" y="18" width="9" height="9"/>`,
  tag: `<path d="M4 4h11l13 13-11 11L4 16z"/><circle cx="10" cy="10" r="2"/>`,
  bag: `<path d="M8 11h16l-1.5 16a2 2 0 0 1-2 1.8H11.5a2 2 0 0 1-2-1.8z"/><path d="M12 11V8a4 4 0 0 1 8 0v3"/>`,
  layers: `<path d="M16 4l12 6-12 6L4 10z"/><path d="M4 16l12 6 12-6M4 22l12 6 12-6"/>`,
  building: `<rect x="7" y="4" width="18" height="24" rx="1"/><path d="M12 9h3M17 9h3M12 14h3M17 14h3M12 19h3M17 19h3M13 28v-4h6v4"/>`,
  wifi_off: `<path d="M5 5l22 22M16 24h.01"/><path d="M9 14a14 14 0 0 1 5-2.6M2 9a18 18 0 0 1 6-3.6"/><path d="M22.5 11.5A14 14 0 0 1 27 14"/>`,
  refresh: `<path d="M26 16a10 10 0 1 1-3-7"/><path d="M26 6v6h-6"/>`,
  arrow_right: `<path d="M5 16h22M19 8l8 8-8 8"/>`,
  arrow_left: `<path d="M27 16H5M13 8l-8 8 8 8"/>`,
  play: `<path d="M9 6l18 10L9 26z"/>`,
  pause: `<rect x="9" y="6" width="4" height="20"/><rect x="19" y="6" width="4" height="20"/>`,
  dots: `<circle cx="8" cy="16" r="2" fill="currentColor"/><circle cx="16" cy="16" r="2" fill="currentColor"/><circle cx="24" cy="16" r="2" fill="currentColor"/>`,
  help: `<circle cx="16" cy="16" r="12"/><path d="M12.5 12.5a3.5 3.5 0 1 1 5 3.2c-1 .6-1.5 1.2-1.5 2.3M16 23h.01"/>`,
  shield: `<path d="M16 4l11 4v7c0 7-5 11-11 13-6-2-11-6-11-13V8z"/><path d="M11 16l3.5 3.5L21 13"/>`,
  voice: `<rect x="12" y="4" width="8" height="14" rx="4"/><path d="M8 15a8 8 0 0 0 16 0M16 23v4M12 27h8"/>`,
  swap: `<path d="M8 11h16M19 6l5 5-5 5"/><path d="M24 21H8M13 26l-5-5 5-5"/>`,
  download: `<path d="M16 5v16M9 14l7 7 7-7M6 27h20"/>`,
  copy: `<rect x="10" y="10" width="16" height="16" rx="2"/><path d="M6 20V8a2 2 0 0 1 2-2h12"/>`,
  globe: `<circle cx="16" cy="16" r="12"/><path d="M4 16h24M16 4c4 4 4 20 0 24-4-4-4-20 0-24"/>`,
  pkg: `<path d="M16 4l12 6v12l-12 6-12-6V10z"/><path d="M4 10l12 6 12-6M16 16v12"/>`,
  receipt: `<path d="M8 4h16v24l-3-2-3 2-2-2-2 2-3-2-3 2z"/><path d="M12 11h8M12 16h8"/>`,
  location_off: `<path d="M16 28s-9-8-9-15a9 9 0 0 1 1.5-5M22.8 8A9 9 0 0 1 25 13c0 4-3 8-5.5 11"/><path d="M5 5l22 22"/>`,
  sparkle: `<path d="M16 4l2.5 7.5L26 14l-7.5 2.5L16 24l-2.5-7.5L6 14l7.5-2.5z"/>`,
  heart: `<path d="M16 27C9.2 21.6 4 17 4 11.8 4 8.1 6.9 5 10.5 5c2.3 0 4.4 1.2 5.5 3.2C17.1 6.2 19.2 5 21.5 5 25.1 5 28 8.1 28 11.8c0 5.2-5.2 9.8-12 15.2z"/>`,
  'heart-fill': `<path d="M16 27C9.2 21.6 4 17 4 11.8 4 8.1 6.9 5 10.5 5c2.3 0 4.4 1.2 5.5 3.2C17.1 6.2 19.2 5 21.5 5 25.1 5 28 8.1 28 11.8c0 5.2-5.2 9.8-12 15.2z" fill="currentColor"/>`,
};

export function icon(name, size) {
  const body = P[name] || P.info;
  const s = size ? ` width="${size}" height="${size}"` : '';
  return `<svg viewBox="0 0 32 32"${s} fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

// Solid-pip variants (status). Returns svg with a filled dot, currentColor.
export function logoMark(cls = 'hecho-logo') {
  return `<svg class="${cls}" viewBox="0 0 463 168" aria-hidden="true"><use href="#hecho-mark"/></svg>`;
}

export const hasIcon = (name) => !!P[name];

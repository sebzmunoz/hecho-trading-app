/* Hecho explainer site — content population + light interactions. */
(function () {
  'use strict';
  var svg = function (p, s) {
    return '<svg viewBox="0 0 32 32" width="' + (s || 24) + '" height="' + (s || 24) + '" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  };
  var I = {
    scan: '<path d="M5 9V6a1 1 0 0 1 1-1h3"/><path d="M23 5h3a1 1 0 0 1 1 1v3"/><path d="M27 23v3a1 1 0 0 1-1 1h-3"/><path d="M9 27H6a1 1 0 0 1-1-1v-3"/><path d="M10 11v10M14 11v10M18 11v10M22 11v10"/>',
    lock: '<rect x="6" y="11" width="20" height="15" rx="2"/><path d="M11 11V8a5 5 0 0 1 10 0v3"/><circle cx="16" cy="18" r="1.4" fill="currentColor"/>',
    user: '<circle cx="16" cy="12" r="5"/><path d="M6 27c1-5 5-8 10-8s9 3 10 8"/>',
    users: '<circle cx="12" cy="12" r="4.5"/><path d="M3 26c1-4.5 4.5-7 9-7s8 2.5 9 7"/><path d="M22 8a4.5 4.5 0 0 1 0 8M24 26c-.5-3-2-5-4-6"/>',
    reorder: '<path d="M26 16a10 10 0 1 1-3-7"/><path d="M26 6v6h-6"/>',
    layers: '<path d="M16 4l12 6-12 6L4 10z"/><path d="M4 16l12 6 12-6M4 22l12 6 12-6"/>',
    draft: '<rect x="7" y="6" width="18" height="22" rx="2"/><path d="M12 12h8M12 17h8M12 22h5"/>',
    bag: '<path d="M8 11h16l-1.5 16a2 2 0 0 1-2 1.8H11.5a2 2 0 0 1-2-1.8z"/><path d="M12 11V8a4 4 0 0 1 8 0v3"/>',
    card: '<rect x="3" y="7" width="26" height="18" rx="2"/><path d="M3 13h26M7 19h6"/>',
    image: '<rect x="4" y="6" width="24" height="20" rx="2"/><circle cx="11" cy="13" r="2.5"/><path d="M5 24l7-7 5 5 4-3 6 6"/>',
    flag: '<path d="M8 4v24"/><path d="M8 5h14l-3 5 3 5H8"/>',
    bell: '<path d="M16 4a7 7 0 0 0-7 7v5l-2 4h18l-2-4v-5a7 7 0 0 0-7-7z"/><path d="M13 24a3 3 0 0 0 6 0"/>',
    check: '<path d="M6 16l7 7L26 9"/>',
    minus: '<path d="M8 16h16"/>',
    eye: '<path d="M3 16s5-9 13-9 13 9 13 9-5 9-13 9S3 16 3 16z"/><circle cx="16" cy="16" r="4"/>',
    swap: '<path d="M8 11h16M19 6l5 5-5 5"/><path d="M24 21H8M13 26l-5-5 5-5"/>',
    cart: '<path d="M7 10h18l-2 14a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3z"/><path d="M11 10a5 5 0 0 1 10 0"/>'
  };
  var ic = function (n, s) { return svg(I[n] || I.draft, s); };

  // ---- Features ----
  var features = [
    { ic: 'scan', t: 'Live shelf scan', d: 'Point your phone at a barcode on a real shelf. Hecho resolves it to that product’s own live POS stock, last order, and a recommended reorder quantity — instantly.', tag: 'Signature', span: true },
    { ic: 'lock', t: 'Privacy on the floor', d: 'Negotiated price, on-hand stock, past spend, and credit balance mask by default. When something sensitive is on-screen, an eye appears in the header — one tap reveals, one tap re-masks. Nobody reads your numbers over your shoulder.', tag: 'Signature' },
    { ic: 'swap', t: 'Rep co-shop', d: 'A Hecho rep switches into your account and adds lines to your draft live — then hands it back. They can only submit with your explicit grant.', tag: 'Signature' },
    { ic: 'reorder', t: 'Smart reorder', d: 'Past orders become starting points, not history. Hecho proposes a draft ranked by what actually sells, with the “why” on every line. Accept piece by piece.' },
    { ic: 'layers', t: 'Live stock board', d: 'On-hand across all nine brands you manage. Out-of-stock lines show a restock window — each brand keeps its own counts current.' },
    { ic: 'draft', t: 'Draft carts & approvals', d: 'Build named drafts from scan, search, or a style guide. Managers send up for approval; owners approve, edit, or send back, then submit.' },
    { ic: 'bag', t: 'Orders & Net-30', d: 'Follow every order from Open to Settled. Pay invoices in-app by ACH or saved card, with a Net-terms wallet up top.' },
    { ic: 'image', t: 'Style guides', d: 'Curated, shoppable looks — a magazine, not a spreadsheet. Tap “Shop the look” to batch-add a multi-brand set to a draft.' },
    { ic: 'flag', t: 'Damage & RMA', d: 'Photo-first claims, pre-filled from the original line and routed to the brand’s returns queue. Track every claim to resolution.' }
  ];
  var fg = document.getElementById('featureGrid');
  if (fg) fg.innerHTML = features.map(function (f) {
    return '<article class="feature reveal' + (f.span ? ' span2' : '') + '"><span class="fic">' + ic(f.ic) + '</span><h3>' + f.t + '</h3><p>' + f.d + '</p>' + (f.tag ? '<span class="tagline">' + f.tag + '</span>' : '') + '</article>';
  }).join('');

  // ---- Steps ----
  var steps = [
    { sid: 'S101 · S102', ic: 'scan', t: 'Scan', d: 'Open Scan and point at the shelf. The result rises over the camera with price, stock, and a reorder pick.' },
    { sid: 'S202', ic: 'draft', t: 'Draft', d: 'Add the line to a named draft cart. Combine scans, search, and style guides into one order.' },
    { sid: 'S209', ic: 'check', t: 'Approve', d: 'A manager hands the draft up; the owner reviews line by line and approves, edits, or sends back.' },
    { sid: 'S204', ic: 'bag', t: 'Submit', d: 'Review ship-to, terms, MOQ, and tax-ID status, then submit. The order lands at the top of Orders.' },
    { sid: 'S302 · S304', ic: 'card', t: 'Track & pay', d: 'Watch the lifecycle move Open → Settled, and pay the invoice by ACH or card when you’re ready.' }
  ];
  var st = document.getElementById('steps');
  if (st) st.innerHTML = steps.map(function (s) {
    return '<div class="step reveal"><div class="ic">' + ic(s.ic, 28) + '</div><div class="sid">' + s.sid + '</div><h4>' + s.t + '</h4><p>' + s.d + '</p></div>';
  }).join('');

  // ---- Roles ----
  var roles = [
    { code: 'P1 · Primary', ic: 'user', name: 'Owner', maps: 'The Boutique Buyer', primary: true, d: 'Owner-operator who holds the budget and the brand relationships. Walks the floor and approves every final order personally.', can: 'Can do everything — build, approve, submit, pay, and manage the team.' },
    { code: 'P2 · Secondary', ic: 'user', name: 'Manager', maps: 'The Buying Assistant', d: 'Store manager who walks the showroom on the owner’s behalf and builds draft carts, but cannot commit spend.', can: 'Builds and shares drafts · sends up for approval. Cannot submit or self-approve.' },
    { code: 'Company staff', ic: 'users', name: 'Member', maps: 'Team member', d: 'General company staff who help assemble orders. The lightest role on the account.', can: 'Create, edit, and share drafts. View-only on compliance.' },
    { code: 'P3 · Internal', ic: 'swap', name: 'Rep', maps: 'The Hecho Rep', d: 'Hecho’s own field rep. Co-shops live with a buyer and switches between the retailer accounts they manage.', can: 'Co-shops any assigned retailer. Submits only with an Owner’s per-account grant.' }
  ];
  var rg = document.getElementById('roleGrid');
  if (rg) rg.innerHTML = roles.map(function (r) {
    return '<article class="role reveal' + (r.primary ? ' is-primary' : '') + '"><span class="pcode">' + r.code + '</span><span class="av">' + ic(r.ic, 22) + '</span><h3>' + r.name + '</h3><span class="maps">' + r.maps + '</span><p>' + r.d + '</p><div class="can">' + r.can + '</div></article>';
  }).join('');

  // ---- Comparison matrix ----  cell types: yes | no | view | grant
  var cell = function (type) {
    var map = { yes: ['yes', 'check', 'Yes'], no: ['no', 'minus', 'No'], view: ['view', 'eye', 'View'], grant: ['grant', 'lock', 'With grant'] };
    var c = map[type] || map.no;
    return '<span class="cell ' + c[0] + '">' + ic(c[1], 16) + ' ' + c[2] + '</span>';
  };
  var matrix = [
    { grp: 'Cart' },
    { cap: 'Create, edit & share draft carts', cells: ['yes', 'yes', 'yes', 'yes'] },
    { cap: 'Submit a final order', cells: ['yes', 'no', 'no', 'grant'] },
    { grp: 'Approval' },
    { cap: 'Approve a draft for submission', cells: ['yes', 'no', 'no', 'no'] },
    { cap: 'Grant the Approve permission', cells: ['yes', 'no', 'no', 'no'] },
    { grp: 'Compliance' },
    { cap: 'Manage Tax-ID, W-9, COI & terms', cells: ['yes', 'view', 'view', 'view'] },
    { grp: 'Payment' },
    { cap: 'Pay invoices; manage ACH & cards', cells: ['yes', 'no', 'no', 'no'] },
    { grp: 'User management' },
    { cap: 'Invite, change role, remove users', cells: ['yes', 'no', 'no', 'no'] }
  ];
  var cb = document.getElementById('compareBody');
  if (cb) cb.innerHTML = matrix.map(function (row) {
    if (row.grp) return '<tr class="grp"><td colspan="5">' + row.grp + '</td></tr>';
    return '<tr><td class="cap">' + row.cap + '</td>' + row.cells.map(function (c, i) {
      return '<td' + (i === 0 ? ' class="owner-col"' : '') + '>' + cell(c) + '</td>';
    }).join('') + '</tr>';
  }).join('');

  // ---- Brands ----
  var brands = [
    { n: 'Etta & East', c: 'Home · Textiles' }, { n: 'Lavender Thorne', c: 'Beauty · Body' },
    { n: 'El Arroyo', c: 'Gifts · Stationery' }, { n: 'Frida Vida', c: 'Home · Gifts' },
    { n: 'Beljoy', c: 'Jewelry · Accessories' }, { n: 'Pom Pom London', c: 'Jewelry · Launching' },
    { n: 'Ellie Rose', c: 'Bags · Accessories' }, { n: 'Popkle', c: 'Gifts · Novelty' },
    { n: 'The New Savant', c: 'Home · Candles' }
  ];
  var bg = document.getElementById('brandGrid');
  if (bg) bg.innerHTML = brands.map(function (b) {
    return '<div class="brand-c reveal"><span class="nm">' + b.n + '</span><span class="ct">' + b.c + '</span></div>';
  }).join('');

  // ---- Interactions ----
  // nav jump
  document.querySelectorAll('[data-jump]').forEach(function (b) {
    b.addEventListener('click', function () {
      var el = document.querySelector(b.getAttribute('data-jump'));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  // header scrolled
  var header = document.getElementById('header');
  var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 10); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  // reveal (robust: fires on any intersection; immediately reveals anything already on screen)
  var reveals = [].slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
    requestAnimationFrame(function () {
      reveals.forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < window.innerHeight && r.bottom > 0) { el.classList.add('in'); io.unobserve(el); } });
    });
    // final safety net — never leave content hidden
    setTimeout(function () { reveals.forEach(function (el) { el.classList.add('in'); }); }, 2500);
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }
  // scroll-spy nav highlight
  var navBtns = [].slice.call(document.querySelectorAll('.nav [data-jump]'));
  var secs = navBtns.map(function (b) { return document.querySelector(b.getAttribute('data-jump')); });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var i = secs.indexOf(e.target);
          navBtns.forEach(function (b, j) { b.classList.toggle('is-current', j === i); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(function (s) { if (s) spy.observe(s); });
  }
})();

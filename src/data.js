// ============================================================
// Mocked world for the Hecho prototype. Relative-time phrases
// only (never a clock or calendar date), first-person voice,
// "buyer" / "draft cart" terminology per the copy deck (§13).
// ============================================================

export const account = {
  retailer: 'Marfa Studio',
  owner: 'Sebastián Muñoz',
  initials: 'SM',
  terms: 'Net-30',
  creditLimit: 25000,
  outstanding: 8740,
  status: 'approved',     // registered & approved retailer
  email: 'sebz.munoz@gmail.com',
  phone: '+1 (415) 555-0148',
  rep: 'Dana Okafor',
};

// ---- The 9 brands Marfa Studio manages through Hecho ----
// steward = the brand-side user who keeps stock current ("brands set it
// themselves"). founder/founderStory carry the storytelling block on the
// brand page (hidden in Rep mode).
export const brands = [
  { id: 'etta', name: 'Etta & East', cats: ['Home', 'Textiles'], lead: 21, moq: 500, steward: 'Nadia R.',
    story: 'Washed linens and slow home textiles, woven in small runs. Earthen palette, nothing loud.',
    founder: 'June Etta Calloway',
    founderStory: 'June wove her first table runners on her grandmother\'s loom in Abilene. Forty years on, she still won\'t ship a weave she hasn\'t slept under at least one season.' },
  { id: 'lavender', name: 'Lavender Thorne', cats: ['Beauty', 'Body'], lead: 14, moq: 250, steward: 'June P.',
    story: 'Tallow-based skincare, unscented or wild-harvested. Made in cast-iron batches, labeled by hand.',
    founder: 'Maribel Thorne',
    founderStory: 'A nurse for twelve years, Maribel started rendering tallow on her kitchen stove when nothing on the shelf helped her daughter\'s skin. The cast-iron pots never left.' },
  { id: 'arroyo', name: 'El Arroyo', cats: ['Gifts', 'Stationery'], lead: 12, moq: 200, steward: 'Marco T.',
    story: 'The Austin sign you have seen. Witty cards, napkins, and gifts with a one-liner on every one.',
    founder: 'The Vasquez family',
    founderStory: 'The sign started outside the family\'s Austin taqueria in 1975 — one line, changed daily. The one-liners outgrew the menu and became the brand.' },
  { id: 'frida', name: 'Frida Vida', cats: ['Home', 'Gifts'], lead: 18, moq: 300, steward: 'Lupita G.',
    story: 'Color-first home and gifts with a Mexican folk-art lean. Talavera glaze, marigold everything.',
    founder: 'Lupita Reyes',
    founderStory: 'Lupita grew up between Puebla and El Paso, glazing talavera in her tío\'s workshop after school. Every collection starts with a color she remembers from home.' },
  { id: 'beljoy', name: 'Beljoy', cats: ['Jewelry', 'Accessories'], lead: 20, moq: 350, steward: 'Camille D.',
    story: 'Hand-beaded jewelry made by artisan co-ops. Each stack is strung one bead at a time.',
    founder: 'Camille Bertrand',
    founderStory: 'Camille met her first beading co-op outside Port-au-Prince in 2014 and never really left. Today sixty artisans string every stack by hand, and she knows their names.' },
  { id: 'pompom', name: 'Pom Pom London', cats: ['Jewelry'], lead: 28, moq: 700, launching: true, steward: 'Saskia W.',
    story: 'Birthstones and charms in recycled gold vermeil. Pom Pom opens on Hecho this season.',
    founder: 'Saskia Pommeroy',
    founderStory: 'A Hatton Garden apprentice turned designer, Saskia recasts vintage charm molds in recycled vermeil from a two-room studio in East London.' },
  { id: 'ellie', name: 'Ellie Rose', cats: ['Bags', 'Accessories'], lead: 16, moq: 400, steward: 'Bea M.',
    story: 'Everyday canvas and quilted bags, cut and sewn in small batches. Built to be over-used.',
    founder: 'Ellie Rose Tanaka',
    founderStory: 'Ellie sewed her first market tote from her dad\'s retired sailcloth. The bags are still cut the same way — to be over-used, never babied.' },
  { id: 'popkle', name: 'Popkle', cats: ['Gifts', 'Novelty'], lead: 18, moq: 300, steward: 'Kit N.',
    story: 'Loud little objects that make a counter fun. Boba keychains, jelly pens, the occasional plush.',
    founder: 'Kit Nakamura',
    founderStory: 'Kit spent six years designing claw-machine prizes in Osaka. Popkle is the counter-top joy they always wanted to make — small, loud, impossible not to pick up.' },
  { id: 'savant', name: 'The New Savant', cats: ['Home', 'Candles'], lead: 30, moq: 900, steward: 'Ana M.',
    story: 'Chicago candles and incense, poured in reserve runs that sell through fast.',
    founder: 'Ana Maldonado',
    founderStory: 'Ana poured her first reserve run in a Chicago walk-up, naming each scent after a block she\'s lived on. She still approves every batch nose-first.' },
];
export const brandById = Object.fromEntries(brands.map((b) => [b.id, b]));

// ---- Products ----  restock set only where on_hand hits 0.
export const products = [
  // Etta & East
  { id: 'p-linen', brand: 'etta', name: 'Washed Linen Napkins', variant: 'Set of 4 · Flax', wholesale: 16, msrp: 38, pack: 6, velocity: 0.7, onHand: 9, lastOrderQty: 12, lastOrder: 'one month ago', cat: 'Textiles', illo: 'scarf', season: 'in' },
  { id: 'p-throw', brand: 'etta', name: 'Wool Throw', variant: 'Oat', wholesale: 34, msrp: 78, pack: 4, velocity: 0.5, onHand: 3, lastOrderQty: 8, lastOrder: 'two weeks ago', cat: 'Textiles', illo: 'throw', season: 'in' },
  // Lavender Thorne
  { id: 'p-tallow', brand: 'lavender', name: 'Tallow Moisturizer', variant: '2 oz', wholesale: 18, msrp: 38, pack: 12, velocity: 1.4, onHand: 4, lastOrderQty: 24, lastOrder: 'two weeks ago', cat: 'Body', illo: 'jar', season: null },
  { id: 'p-balm', brand: 'lavender', name: 'Wild Lip Balm', variant: 'Mint', wholesale: 4, msrp: 9, pack: 24, velocity: 2.1, onHand: 0, restock: 'back in about two weeks', lastOrderQty: 48, lastOrder: 'three weeks ago', cat: 'Body', illo: 'tube', season: null },
  // El Arroyo
  { id: 'p-cards', brand: 'arroyo', name: 'A-Frame Card Pack', variant: 'Assorted 10', wholesale: 9, msrp: 20, pack: 10, velocity: 1.0, onHand: 14, lastOrderQty: 20, lastOrder: 'one month ago', cat: 'Stationery', illo: 'pen', season: null },
  { id: 'p-napkins', brand: 'arroyo', name: 'Cocktail Napkins', variant: 'Box of 20', wholesale: 6, msrp: 14, pack: 12, velocity: 1.3, onHand: 5, lastOrderQty: 24, lastOrder: 'two weeks ago', cat: 'Gifts', illo: 'bar', season: 'in' },
  // Frida Vida
  { id: 'p-tumbler', brand: 'frida', name: 'Talavera Tumbler', variant: 'Cobalt', wholesale: 11, msrp: 26, pack: 8, velocity: 0.9, onHand: 3, lastOrderQty: 16, lastOrder: 'three weeks ago', cat: 'Home', illo: 'mug', season: null },
  { id: 'p-towel', brand: 'frida', name: 'Marigold Tea Towel', variant: 'Set of 2', wholesale: 7, msrp: 16, pack: 10, velocity: 0.6, onHand: 12, lastOrderQty: 10, lastOrder: 'two months ago', cat: 'Home', illo: 'scarf', season: 'off' },
  // Beljoy
  { id: 'p-bracelet', brand: 'beljoy', name: 'Beaded Bracelet Stack', variant: 'Sunset', wholesale: 12, msrp: 28, pack: 6, velocity: 0.8, onHand: 7, lastOrderQty: 12, lastOrder: 'one month ago', cat: 'Jewelry', illo: 'charm', season: null },
  { id: 'p-hoops', brand: 'beljoy', name: 'Confetti Hoops', variant: 'Multi', wholesale: 9, msrp: 22, pack: 8, velocity: 1.1, onHand: 0, restock: 'back in about a week', lastOrderQty: 16, lastOrder: 'two weeks ago', cat: 'Jewelry', illo: 'charm', season: 'in' },
  // Pom Pom London (mid, launching)
  { id: 'p-necklace', brand: 'pompom', name: 'Birthstone Necklace', variant: 'Gold · June', wholesale: 24, msrp: 58, pack: 6, velocity: 0.5, onHand: 5, lastOrderQty: 6, lastOrder: 'two months ago', cat: 'Jewelry', illo: 'charm', season: 'in' },
  { id: 'p-charmb', brand: 'pompom', name: 'Charm Bracelet', variant: 'Gold', wholesale: 22, msrp: 52, pack: 6, velocity: 0.4, onHand: 8, lastOrderQty: 6, lastOrder: 'one month ago', cat: 'Jewelry', illo: 'charm', season: 'in' },
  // Ellie Rose
  { id: 'p-tote', brand: 'ellie', name: 'Canvas Market Tote', variant: 'Sand', wholesale: 19, msrp: 46, pack: 8, velocity: 0.9, onHand: 6, lastOrderQty: 8, lastOrder: 'one month ago', cat: 'Bags', illo: 'tote', season: 'in' },
  { id: 'p-cross', brand: 'ellie', name: 'Quilted Crossbody', variant: 'Clay', wholesale: 28, msrp: 64, pack: 6, velocity: 0.4, onHand: 2, lastOrderQty: 6, lastOrder: 'two months ago', cat: 'Bags', illo: 'bag', season: 'in' },
  // Popkle
  { id: 'p-boba', brand: 'popkle', name: 'Pop Lift Boba', variant: 'Pink', wholesale: 6, msrp: 14, pack: 12, velocity: 1.6, onHand: 4, lastOrderQty: 24, lastOrder: 'two weeks ago', cat: 'Novelty', illo: 'charm', season: null },
  { id: 'p-pen', brand: 'popkle', name: 'Jelly Gel Pen', variant: 'Set of 5', wholesale: 7, msrp: 16, pack: 10, velocity: 0.8, onHand: 14, lastOrderQty: 10, lastOrder: 'two months ago', cat: 'Novelty', illo: 'pen', season: null },
  // The New Savant (top)
  { id: 'p-candle', brand: 'savant', name: 'Vanguard Candle', variant: '9 oz', wholesale: 16, msrp: 36, pack: 6, velocity: 1.0, onHand: 5, lastOrderQty: 12, lastOrder: 'three weeks ago', cat: 'Candles', illo: 'candle', season: 'in' },
  { id: 'p-incense', brand: 'savant', name: 'Cedar Incense', variant: 'Box of 30', wholesale: 6, msrp: 15, pack: 12, velocity: 0.7, onHand: 8, lastOrderQty: 12, lastOrder: 'one month ago', cat: 'Home', illo: 'incense', season: 'off' },
];
export const productById = Object.fromEntries(products.map((p) => [p.id, p]));
export const productsByBrand = (bid) => products.filter((p) => p.brand === bid);

// ---- §07-H H1: reorder recommendation ----
// Behavior model: order history + lead time + the store's last counts.
const roundUpToPack = (n, pack) => Math.ceil(n / pack) * pack;
export function recommendedQty(p) {
  const lead = brandById[p.brand]?.lead ?? 14;
  const need = Math.max(0, Math.ceil(p.velocity * lead) - p.onHand);
  return roundUpToPack(need, p.pack);
}
export function whyString(p) {
  const parts = [];
  if (p.lastOrder) parts.push(`Ordered ${p.lastOrderQty} ${p.lastOrder}`);
  if (p.season) parts.push(p.season === 'in' ? 'in season' : 'off season');
  return parts.join(' · ');
}

// ---- §07-H H3: stock state (brands keep their own counts current) ----
export function stockState(p) {
  if (p.onHand === 0) return { kind: 'out', label: 'Out of stock', value: 0, caption: p.restock ? 'Brand says: ' + p.restock : 'Restock pending' };
  if (p.onHand <= 4) return { kind: 'low', label: `Low · ${p.onHand}`, value: p.onHand, caption: 'Set by the brand · current' };
  return { kind: 'in', label: `In stock · ${p.onHand}`, value: p.onHand, caption: 'Set by the brand · current' };
}

// ---- "Running low at your store" (Shop home) ----
// Lines the buyer has ordered before, sorted by days of cover left
// (on_hand / velocity). The motion the low-stock push (§07-B) feeds.
export function lowStockLines(max = 4) {
  return products
    .filter((p) => p.lastOrderQty > 0 && p.velocity > 0 && p.onHand <= Math.ceil(p.velocity * 7))
    .map((p) => ({ p, daysLeft: Math.round(p.onHand / p.velocity) }))
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, max);
}

// ---- Brand-level live stock summary (for the Live Stock board, S708) ----
export function brandStock(bid) {
  const ps = productsByBrand(bid);
  const out = ps.filter((p) => p.onHand === 0);
  const low = ps.filter((p) => p.onHand > 0 && p.onHand <= 4);
  const units = ps.reduce((s, p) => s + p.onHand, 0);
  return { skus: ps.length, units, out: out.length, low: low.length, outItems: out, lowItems: low };
}

// ---- Style guides (editorial, multi-brand) ----
// Each guide carries a composed `scene`: the products drawn ON the vignette,
// bottom-anchored at (x%, y%) of the canvas, size in px (scaled per surface).
// The scene IS the shoppable surface on S002 — every item is tappable.
export const styleGuides = [
  { id: 'sg-table', title: 'The Set Table', season: 'Spring', theme: 'Home', region: 'Southwest',
    blurb: 'A warm tablescape for the long evenings — washed linen, Talavera color, and a candle to close it.',
    brands: ['etta', 'frida', 'savant'], lines: ['p-linen', 'p-tumbler', 'p-towel', 'p-candle', 'p-incense'],
    scene: [
      { p: 'p-linen', x: 14, y: 78, s: 52 }, { p: 'p-tumbler', x: 33, y: 78, s: 42 },
      { p: 'p-towel', x: 52, y: 78, s: 48 }, { p: 'p-candle', x: 70, y: 78, s: 46 },
      { p: 'p-incense', x: 87, y: 78, s: 44 }] },
  { id: 'sg-counter', title: 'The Fun Counter', season: 'Summer', theme: 'Gifts', region: 'National',
    blurb: 'Impulse buys that earn their inch of counter. A one-liner, a charm, a pen by the register.',
    brands: ['arroyo', 'popkle', 'beljoy'], lines: ['p-cards', 'p-napkins', 'p-boba', 'p-hoops'],
    scene: [
      { p: 'p-cards', x: 17, y: 78, s: 50 }, { p: 'p-napkins', x: 40, y: 78, s: 52 },
      { p: 'p-boba', x: 63, y: 78, s: 44 }, { p: 'p-hoops', x: 84, y: 78, s: 40 }] },
  { id: 'sg-carry', title: 'Carry & Adorn', season: 'Fall', theme: 'Accessories', region: 'National',
    blurb: 'The tote you reach for and the stack you never take off. Canvas, clay, and a little gold.',
    brands: ['ellie', 'pompom', 'beljoy'], lines: ['p-tote', 'p-cross', 'p-necklace', 'p-bracelet'],
    scene: [
      { p: 'p-tote', x: 18, y: 78, s: 58 }, { p: 'p-cross', x: 44, y: 78, s: 50 },
      { p: 'p-necklace', x: 67, y: 78, s: 40 }, { p: 'p-bracelet', x: 86, y: 78, s: 36 }] },
  { id: 'sg-bath', title: 'Slow Bath', season: 'Winter', theme: 'Body', region: 'National',
    blurb: 'Unscented, hand-labeled, made in cast iron. The quiet end of the shelf.',
    brands: ['lavender'], lines: ['p-tallow', 'p-balm'],
    scene: [
      { p: 'p-tallow', x: 36, y: 78, s: 52 }, { p: 'p-balm', x: 62, y: 78, s: 44 }] },
];
export const styleGuideById = Object.fromEntries(styleGuides.map((g) => [g.id, g]));

// ---- Draft carts ----
export const carts = [
  { id: 'c-back', name: 'Back wall refresh', section: 'mine', author: 'You', lastEdited: 'a few minutes ago',
    lines: [['p-throw', 8], ['p-tallow', 24], ['p-candle', 12], ['p-boba', 24]], sync: 'synced', scanSourced: true },
  { id: 'c-holiday', name: 'Holiday 2026', section: 'mine', author: 'You', lastEdited: 'two days ago',
    lines: [['p-candle', 24], ['p-incense', 12], ['p-tumbler', 16], ['p-cards', 20], ['p-napkins', 12]], sync: 'pending' },
  { id: 'c-mday', name: "Mother's Day", section: 'shared', author: 'Priya N. (Staff)', lastEdited: 'yesterday',
    lines: [['p-tallow', 12], ['p-necklace', 6], ['p-bracelet', 12]], sync: 'synced', sharedWith: 'You · Approve to submit' },
  { id: 'c-spring', name: 'Spring counter', section: 'pending', author: 'Priya N. (Staff)', lastEdited: 'three hours ago',
    lines: [['p-boba', 24], ['p-pen', 10], ['p-tumbler', 16]], sync: 'synced', awaiting: true },
];
export const cartById = Object.fromEntries(carts.map((c) => [c.id, c]));
export function cartTotal(c) { return c.lines.reduce((s, [pid, q]) => s + (productById[pid]?.wholesale || 0) * q, 0); }
export function cartBrandCount(c) { return new Set(c.lines.map(([pid]) => productById[pid]?.brand)).size; }

// ---- Orders (lifecycle: open / fulfillment / shipped / delivered / settled) ----
export const orders = [
  { id: '4821', status: 'fulfillment', total: 4820, brands: ['The New Savant', 'Frida Vida', 'El Arroyo'],
    eta: 'arriving in about a week', placed: 'three days ago',
    lines: [['p-candle', 24], ['p-tumbler', 16], ['p-cards', 20], ['p-incense', 12]],
    invoice: 'INV-4821', due: 'due in 27 days', paid: false },
  { id: '4790', status: 'shipped', total: 2210, brands: ['Etta & East', 'Lavender Thorne'],
    eta: 'arriving in two days', placed: 'one week ago', tracking: '1Z-HECHO-4790', carrier: 'UPS Ground',
    lines: [['p-throw', 8], ['p-tallow', 24], ['p-balm', 24]],
    invoice: 'INV-4790', due: 'due in 21 days', paid: false },
  { id: '4763', status: 'delivered', total: 1180, brands: ['Popkle', 'El Arroyo'],
    eta: 'delivered two days ago', placed: 'two weeks ago', carrier: 'UPS Ground', tracking: '1Z-HECHO-4763',
    lines: [['p-boba', 24], ['p-pen', 10], ['p-napkins', 12]],
    invoice: 'INV-4763', due: 'due in 9 days', paid: false },
  { id: '4701', status: 'open', total: 3960, brands: ['Ellie Rose', 'Beljoy'],
    eta: 'awaiting confirmation', placed: 'one day ago',
    lines: [['p-tote', 8], ['p-cross', 6], ['p-bracelet', 12], ['p-hoops', 16]],
    invoice: 'INV-4701', due: 'Net-30 on confirmation', paid: false },
  { id: '4655', status: 'settled', total: 1540, brands: ['The New Savant', 'Lavender Thorne'],
    eta: 'settled', placed: 'one month ago', pastDue: false,
    lines: [['p-candle', 12], ['p-tallow', 18], ['p-incense', 12]],
    invoice: 'INV-4655', due: 'paid', paid: true },
  { id: '4602', status: 'open', total: 2080, brands: ['Frida Vida'], pastDue: true,
    eta: 'awaiting payment', placed: 'six weeks ago',
    lines: [['p-tumbler', 16], ['p-towel', 10]],
    invoice: 'INV-4602', due: 'past due by 8 days', paid: false },
];
export const orderById = Object.fromEntries(orders.map((o) => [o.id, o]));
export const lifecycleSteps = ['Open', 'In fulfillment', 'Shipped', 'Delivered', 'Settled'];
export const lifecycleIndex = { open: 0, fulfillment: 1, shipped: 2, delivered: 3, settled: 4 };

// ---- RMA / claims ----
export const claims = [
  { id: 'RMA-318', order: '4763', product: 'p-boba', qty: 4, reason: 'Damaged', status: 'In review', brand: 'Popkle', when: 'two days ago' },
  { id: 'RMA-302', order: '4655', product: 'p-candle', qty: 2, reason: 'Wrong item', status: 'Replaced', brand: 'The New Savant', when: 'three weeks ago' },
  { id: 'RMA-288', order: '4602', product: 'p-tumbler', qty: 1, reason: 'Damaged', status: 'Refunded', brand: 'Frida Vida', when: 'one month ago' },
];

// ---- Company users (§02b roles) ----
// budget = monthly spend the admin lets this member submit without approval
// (overridable live via state.budgets); spent = used so far this month.
export const companyUsers = [
  { name: 'Sebastián Muñoz', role: 'Admin', initials: 'SM', activity: 'active now', self: true },
  { name: 'Priya Nair', role: 'Staff', initials: 'PN', activity: 'active yesterday', budget: 2500, spent: 1840 },
  { name: 'Theo Vance', role: 'Staff', initials: 'TV', activity: 'active three days ago', budget: 1500, spent: 380 },
];
// When the prototype runs in the Staff role, it simulates this member.
export const staffSelf = 'Priya Nair';

// ---- Appointments (buyer side) ----
// Admins AND staff can book time with the rep — no role gate.
export const appointments = [
  { id: 'ap-1', with: 'Dana Okafor', kind: 'Showroom walk', when: 'tomorrow · 10:00 AM', where: 'Hecho Showroom · Dallas Market Center', by: 'You' },
  { id: 'ap-2', with: 'Dana Okafor', kind: 'Line review', when: 'Friday · 2:30 PM', where: 'Marfa Studio · your floor', by: 'Priya N. (Staff)' },
];
export const appointmentKinds = ['Showroom walk', 'Line review', 'Reserve preview', 'Order planning'];

// ---- Notification categories (§07-B) + copy deck (§13) ----
export const pushCategories = [
  { id: 'lifecycle', label: 'Order lifecycle', icon: 'truck', deep: 'S302', title: 'Order shipped', body: 'Your order to {brand} just shipped. Track it.' },
  { id: 'payment', label: 'Payment', icon: 'card', deep: 'S303', title: 'Invoice due soon', body: "Your {brand} invoice is due soon. Pay when you're ready." },
  { id: 'lowstock', label: 'Low stock', icon: 'warning', deep: 'S203', title: 'Running low', body: '{product} is running low at your store. Reorder?' },
  { id: 'compliance', label: 'Compliance', icon: 'doc', deep: 'S408', title: 'Tax ID renews soon', body: "Your tax ID is due for renewal. Submit when you're ready." },
  { id: 'restock', label: 'Restock', icon: 'refresh', deep: 'S708', title: 'Back in stock', body: '{product} from {brand} is back in stock.' },
  { id: 'styleguide', label: 'New style guide', icon: 'image', deep: 'S002', title: 'New style guide', body: 'A new look just landed: {guide}.' },
  { id: 'branddrop', label: 'Brand drop', icon: 'sparkle', deep: 'S710', title: 'First-look open', body: '{brand} is open for first-look. See it now.' },
  { id: 'approval', label: 'Approval requests', icon: 'check', deep: 'S208', title: 'Approval needed', body: '{name} sent a draft cart for your approval.' },
  { id: 'dm', label: 'Direct messages', icon: 'chat', deep: 'S606', title: '{name}', body: '{name} sent you a message.' },
];
export const notifications = [
  { cat: 'lifecycle', group: 'Today', title: 'Order shipped', body: 'Your order to Etta & East just shipped. Track it.', when: 'two hours ago', deep: 'S302?order=4790' },
  { cat: 'approval', group: 'Today', title: 'Approval needed', body: 'Priya N. sent a draft cart for your approval.', when: 'three hours ago', deep: 'S208' },
  { cat: 'restock', group: 'Today', title: 'Back in stock', body: 'Wild Lip Balm from Lavender Thorne is back in stock.', when: 'four hours ago', deep: 'S708' },
  { cat: 'branddrop', group: 'Today', title: 'First-look open', body: 'Pom Pom London is open for first-look. See it now.', when: 'five hours ago', deep: 'S710?brand=pompom' },
  { cat: 'payment', group: 'Earlier this week', title: 'Invoice due soon', body: 'Your Frida Vida invoice is past due. Pay when you can.', when: 'two days ago', deep: 'S303?order=4602' },
  { cat: 'lowstock', group: 'Earlier this week', title: 'Running low', body: 'Tallow Moisturizer is running low at your store. Reorder?', when: 'three days ago', deep: 'S203' },
  { cat: 'styleguide', group: 'Older', title: 'New style guide', body: 'A new look just landed: The Set Table.', when: 'one week ago', deep: 'S002?guide=sg-table' },
];

// ---- Rep mode (P3) — retailers, with registration/approval status ----
// mx/my position each store on the coverage map (S607), in % of the map canvas.
export const repRetailers = [
  { id: 'r-marfa', name: 'Marfa Studio', city: 'Marfa, TX', mx: 56, my: 62, status: 'approved', liveCart: 'Back wall refresh', taxId: 'Current', credit: 'Headroom $16.3k', note: 'Admin approves every cart personally.' },
  { id: 'r-ojai', name: 'Ojai General', city: 'Ojai, CA', mx: 12, my: 38, status: 'approved', liveCart: null, taxId: 'Renews soon', credit: 'Headroom $9.1k', note: 'Staff builds, the admin is hands-off.' },
  { id: 'r-taos', name: 'Taos Mercantile', city: 'Taos, NM', mx: 44, my: 22, status: 'approved', liveCart: 'Reserve preview', taxId: 'Current', credit: 'Headroom $40k', note: 'First-look on every drop.' },
  { id: 'r-bisbee', name: 'Bisbee Co.', city: 'Bisbee, AZ', mx: 26, my: 68, status: 'pending', liveCart: null, taxId: 'Pending', credit: 'Awaiting approval', note: 'New application — review the resale cert to approve.' },
];

// A prospect mid-application, used by the coverage map to demo the
// proximity check: Alpine sits 26 mi from Marfa Studio's door.
export const repProspect = { name: 'Alpine Provisions', city: 'Alpine, TX', mx: 63, my: 56, distanceTo: 'r-marfa', distance: '26 mi', radius: '50 mi' };

export const repAppointments = [
  { retailer: 'Marfa Studio', when: 'in 30 minutes', kind: 'Showroom walk' },
  { retailer: 'Taos Mercantile', when: 'this afternoon', kind: 'Reserve preview' },
];

// ---- Search ----
export const recentSearches = ['Wool Throw', 'candle', 'Talavera', 'SKU 4821-OAT'];
export const trendingChips = ['Jewelry', 'Under MOQ', 'New drops', 'In stock', 'Reorder'];

// ---- Compliance items ----
export const complianceItems = [
  { id: 'taxid', label: 'Tax ID / Resale cert', status: 'renews', note: 'Renews soon' },
  { id: 'w9', label: 'W-9', status: 'current', note: 'On file' },
  { id: 'coi', label: 'Certificate of insurance', status: 'current', note: 'On file' },
  { id: 'terms', label: 'Financial terms', status: 'current', note: 'Net-30 accepted' },
];

// ---- Addresses ----
export const addresses = [
  { id: 'a-1', name: 'Marfa Studio · Floor', line1: '207 W San Antonio St', city: 'Marfa', region: 'TX', postal: '79843', kind: 'Ship-to', def: true },
  { id: 'a-2', name: 'Marfa Studio · Billing', line1: 'PO Box 1120', city: 'Marfa', region: 'TX', postal: '79843', kind: 'Bill-to', def: false },
  { id: 'a-3', name: 'Marfa Studio · Stockroom', line1: '114 E El Paso St', city: 'Marfa', region: 'TX', postal: '79843', kind: 'Ship-to', def: false },
];
export function addAddress(a) {
  const addr = { id: 'a-' + (addresses.length + 1), kind: 'Ship-to', def: false, ...a };
  addresses.push(addr);
  return addr;
}

// ---- Order placement ----
// Placing an order turns the draft into a real order at the top of the
// index, so the post-shipping CTA can land on the actual order detail.
let nextOrderId = 4847;
export function placeOrder(cart, { ship = 'together', note = '' } = {}) {
  const brandIds = [...new Set(cart.lines.map(([pid]) => productById[pid]?.brand).filter(Boolean))];
  const id = String(nextOrderId++);
  const o = {
    id, status: 'open', total: cartTotal(cart),
    brands: brandIds.map((b) => brandById[b].name),
    eta: 'awaiting confirmation', placed: 'just now',
    lines: cart.lines.map((l) => l.slice()),
    invoice: 'INV-' + id, due: 'Net-30 on confirmation', paid: false,
    ship, note,
  };
  orders.unshift(o);
  orderById[id] = o;
  return o;
}

// ---- Love list seeds ----
// Pre-loved items so the prototype demos with a lived-in list. src is where
// the heart was tapped: 'scan' (showroom floor) or 'browse' — telemetry only.
export const lovedSeeds = [
  { p: 'p-candle', src: 'scan' },
  { p: 'p-linen', src: 'browse' },
  { p: 'p-necklace', src: 'browse' },
  { p: 'p-boba', src: 'scan' },
  { p: 'p-cross', src: 'browse' },
];

// ---- Saved payment methods ----
export const paymentMethods = [
  { id: 'm-ach', kind: 'ach', label: 'ACH bank transfer', sub: 'Lowest fee · 1–2 days', icon: 'bank' },
  { id: 'm-card', kind: 'card', label: 'Saved card', sub: '•••• 4242', icon: 'card' },
];

// ---- Helpers ----
export const usd = (n) => n.toLocaleString('en-US');
export const money = (n) => `$${n.toLocaleString('en-US')}`;
export const SENSITIVE = ['wholesale', 'stock', 'spend', 'credit', 'recommended'];

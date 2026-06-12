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
  tier: 'top',            // overridden live by the Variables panel
  status: 'approved',     // registered & approved retailer
  email: 'sebz.munoz@gmail.com',
  phone: '+1 (415) 555-0148',
};

// ---- The 9 brands Marfa Studio manages through Hecho ----
// tier = lowest exclusivity level that can see it (§TM). steward = the brand-side
// user who keeps stock current ("brands set it themselves"). founder/founderStory
// carry the storytelling block on the brand page.
export const brands = [
  { id: 'etta', name: 'Etta & East', tier: 'standard', cats: ['Home', 'Textiles'], lead: 21, moq: 500, steward: 'Nadia R.',
    story: 'Washed linens and slow home textiles, woven in small runs. Earthen palette, nothing loud.',
    founder: 'June Etta Calloway',
    founderStory: 'June wove her first table runners on her grandmother\'s loom in Abilene. Forty years on, she still won\'t ship a weave she hasn\'t slept under at least one season.' },
  { id: 'lavender', name: 'Lavender Thorne', tier: 'standard', cats: ['Beauty', 'Body'], lead: 14, moq: 250, steward: 'June P.',
    story: 'Tallow-based skincare, unscented or wild-harvested. Made in cast-iron batches, labeled by hand.',
    founder: 'Maribel Thorne',
    founderStory: 'A nurse for twelve years, Maribel started rendering tallow on her kitchen stove when nothing on the shelf helped her daughter\'s skin. The cast-iron pots never left.' },
  { id: 'arroyo', name: 'El Arroyo', tier: 'standard', cats: ['Gifts', 'Stationery'], lead: 12, moq: 200, steward: 'Marco T.',
    story: 'The Austin sign you have seen. Witty cards, napkins, and gifts with a one-liner on every one.',
    founder: 'The Vasquez family',
    founderStory: 'The sign started outside the family\'s Austin taqueria in 1975 — one line, changed daily. The one-liners outgrew the menu and became the brand.' },
  { id: 'frida', name: 'Frida Vida', tier: 'standard', cats: ['Home', 'Gifts'], lead: 18, moq: 300, steward: 'Lupita G.',
    story: 'Color-first home and gifts with a Mexican folk-art lean. Talavera glaze, marigold everything.',
    founder: 'Lupita Reyes',
    founderStory: 'Lupita grew up between Puebla and El Paso, glazing talavera in her tío\'s workshop after school. Every collection starts with a color she remembers from home.' },
  { id: 'beljoy', name: 'Beljoy', tier: 'standard', cats: ['Jewelry', 'Accessories'], lead: 20, moq: 350, steward: 'Camille D.',
    story: 'Hand-beaded jewelry made by artisan co-ops. Each stack is strung one bead at a time.',
    founder: 'Camille Bertrand',
    founderStory: 'Camille met her first beading co-op outside Port-au-Prince in 2014 and never really left. Today sixty artisans string every stack by hand, and she knows their names.' },
  { id: 'pompom', name: 'Pom Pom London', tier: 'mid', cats: ['Jewelry'], lead: 28, moq: 700, launching: true, steward: 'Saskia W.',
    story: 'Birthstones and charms in recycled gold vermeil. Pom Pom opens to mid-tier and above this season.',
    founder: 'Saskia Pommeroy',
    founderStory: 'A Hatton Garden apprentice turned designer, Saskia recasts vintage charm molds in recycled vermeil from a two-room studio in East London.' },
  { id: 'ellie', name: 'Ellie Rose', tier: 'standard', cats: ['Bags', 'Accessories'], lead: 16, moq: 400, steward: 'Bea M.',
    story: 'Everyday canvas and quilted bags, cut and sewn in small batches. Built to be over-used.',
    founder: 'Ellie Rose Tanaka',
    founderStory: 'Ellie sewed her first market tote from her dad\'s retired sailcloth. The bags are still cut the same way — to be over-used, never babied.' },
  { id: 'popkle', name: 'Popkle', tier: 'standard', cats: ['Gifts', 'Novelty'], lead: 18, moq: 300, steward: 'Kit N.',
    story: 'Loud little objects that make a counter fun. Boba keychains, jelly pens, the occasional plush.',
    founder: 'Kit Nakamura',
    founderStory: 'Kit spent six years designing claw-machine prizes in Osaka. Popkle is the counter-top joy they always wanted to make — small, loud, impossible not to pick up.' },
  { id: 'savant', name: 'The New Savant', tier: 'top', cats: ['Home', 'Candles'], lead: 30, moq: 900, steward: 'Ana M.',
    story: 'Chicago candles and incense, poured in reserve runs. We show The New Savant to top-tier buyers first.',
    founder: 'Ana Maldonado',
    founderStory: 'Ana poured her first reserve run in a Chicago walk-up, naming each scent after a block she\'s lived on. She still approves every batch nose-first.' },
];
export const brandById = Object.fromEntries(brands.map((b) => [b.id, b]));

// ---- Products ----  restock set only where on_hand hits 0.
export const products = [
  // Etta & East
  { id: 'p-linen', brand: 'etta', name: 'Washed Linen Napkins', variant: 'Set of 4 · Flax', wholesale: 16, msrp: 38, pack: 6, velocity: 0.7, onHand: 9, lastOrderQty: 12, lastOrder: 'one month ago', cat: 'Textiles', illo: 'scarf', season: 'in' },
  { id: 'p-throw', brand: 'etta', name: 'Wool Throw', variant: 'Oat', wholesale: 34, msrp: 78, pack: 4, velocity: 0.5, onHand: 3, lastOrderQty: 8, lastOrder: 'two weeks ago', cat: 'Textiles', illo: 'throw', season: 'in' },
  { id: 'p-runner', brand: 'etta', name: 'Linen Table Runner', variant: 'Flax', wholesale: 22, msrp: 48, pack: 4, velocity: 0.4, onHand: 6, lastOrderQty: 4, lastOrder: 'two months ago', cat: 'Home', illo: 'scarf', season: 'in' },
  // Lavender Thorne
  { id: 'p-tallow', brand: 'lavender', name: 'Tallow Moisturizer', variant: '2 oz', wholesale: 18, msrp: 38, pack: 12, velocity: 1.4, onHand: 4, lastOrderQty: 24, lastOrder: 'two weeks ago', cat: 'Body', illo: 'jar', season: null },
  { id: 'p-balm', brand: 'lavender', name: 'Wild Lip Balm', variant: 'Mint', wholesale: 4, msrp: 9, pack: 24, velocity: 2.1, onHand: 0, restock: 'back in about two weeks', lastOrderQty: 48, lastOrder: 'three weeks ago', cat: 'Body', illo: 'tube', season: null },
  { id: 'p-clbar', brand: 'lavender', name: 'Tallow Cleansing Bar', variant: 'Unscented', wholesale: 8, msrp: 18, pack: 12, velocity: 0.9, onHand: 10, lastOrderQty: 12, lastOrder: 'one month ago', cat: 'Beauty', illo: 'bar', season: null },
  // El Arroyo
  { id: 'p-cards', brand: 'arroyo', name: 'A-Frame Card Pack', variant: 'Assorted 10', wholesale: 9, msrp: 20, pack: 10, velocity: 1.0, onHand: 14, lastOrderQty: 20, lastOrder: 'one month ago', cat: 'Stationery', illo: 'pen', season: null },
  { id: 'p-napkins', brand: 'arroyo', name: 'Cocktail Napkins', variant: 'Box of 20', wholesale: 6, msrp: 14, pack: 12, velocity: 1.3, onHand: 5, lastOrderQty: 24, lastOrder: 'two weeks ago', cat: 'Gifts', illo: 'bar', season: 'in' },
  // Frida Vida
  { id: 'p-tumbler', brand: 'frida', name: 'Talavera Tumbler', variant: 'Cobalt', wholesale: 11, msrp: 26, pack: 8, velocity: 0.9, onHand: 3, lastOrderQty: 16, lastOrder: 'three weeks ago', cat: 'Home', illo: 'mug', season: null },
  { id: 'p-towel', brand: 'frida', name: 'Marigold Tea Towel', variant: 'Set of 2', wholesale: 7, msrp: 16, pack: 10, velocity: 0.6, onHand: 12, lastOrderQty: 10, lastOrder: 'two months ago', cat: 'Home', illo: 'scarf', season: 'off' },
  { id: 'p-ornament', brand: 'frida', name: 'Talavera Ornament Set', variant: 'Set of 3', wholesale: 9, msrp: 22, pack: 8, velocity: 0.5, onHand: 8, lastOrderQty: 8, lastOrder: 'two months ago', cat: 'Gifts', illo: 'charm', season: 'off' },
  // Beljoy
  { id: 'p-bracelet', brand: 'beljoy', name: 'Beaded Bracelet Stack', variant: 'Sunset', wholesale: 12, msrp: 28, pack: 6, velocity: 0.8, onHand: 7, lastOrderQty: 12, lastOrder: 'one month ago', cat: 'Jewelry', illo: 'charm', season: null },
  { id: 'p-hoops', brand: 'beljoy', name: 'Confetti Hoops', variant: 'Multi', wholesale: 9, msrp: 22, pack: 8, velocity: 1.1, onHand: 0, restock: 'back in about a week', lastOrderQty: 16, lastOrder: 'two weeks ago', cat: 'Jewelry', illo: 'charm', season: 'in' },
  { id: 'p-bagcharm', brand: 'beljoy', name: 'Beaded Bag Charm', variant: 'Sunset', wholesale: 8, msrp: 18, pack: 10, velocity: 0.7, onHand: 9, lastOrderQty: 10, lastOrder: 'one month ago', cat: 'Accessories', illo: 'charm', season: null },
  // Pom Pom London (mid, launching)
  { id: 'p-necklace', brand: 'pompom', name: 'Birthstone Necklace', variant: 'Gold · June', wholesale: 24, msrp: 58, pack: 6, velocity: 0.5, onHand: 5, lastOrderQty: 6, lastOrder: 'two months ago', cat: 'Jewelry', illo: 'charm', season: 'in' },
  { id: 'p-charmb', brand: 'pompom', name: 'Charm Bracelet', variant: 'Gold', wholesale: 22, msrp: 52, pack: 6, velocity: 0.4, onHand: 8, lastOrderQty: 6, lastOrder: 'one month ago', cat: 'Jewelry', illo: 'charm', season: 'in' },
  // Ellie Rose
  { id: 'p-tote', brand: 'ellie', name: 'Canvas Market Tote', variant: 'Sand', wholesale: 19, msrp: 46, pack: 8, velocity: 0.9, onHand: 6, lastOrderQty: 8, lastOrder: 'one month ago', cat: 'Bags', illo: 'tote', season: 'in' },
  { id: 'p-cross', brand: 'ellie', name: 'Quilted Crossbody', variant: 'Clay', wholesale: 28, msrp: 64, pack: 6, velocity: 0.4, onHand: 2, lastOrderQty: 6, lastOrder: 'two months ago', cat: 'Bags', illo: 'bag', season: 'in' },
  { id: 'p-pouch', brand: 'ellie', name: 'Canvas Zip Pouch', variant: 'Sand', wholesale: 9, msrp: 22, pack: 10, velocity: 0.8, onHand: 11, lastOrderQty: 10, lastOrder: 'one month ago', cat: 'Accessories', illo: 'bag', season: null },
  // Popkle
  { id: 'p-boba', brand: 'popkle', name: 'Pop Lift Boba', variant: 'Pink', wholesale: 6, msrp: 14, pack: 12, velocity: 1.6, onHand: 4, lastOrderQty: 24, lastOrder: 'two weeks ago', cat: 'Novelty', illo: 'charm', season: null },
  { id: 'p-pen', brand: 'popkle', name: 'Jelly Gel Pen', variant: 'Set of 5', wholesale: 7, msrp: 16, pack: 10, velocity: 0.8, onHand: 14, lastOrderQty: 10, lastOrder: 'two months ago', cat: 'Novelty', illo: 'pen', season: null },
  { id: 'p-sticker', brand: 'popkle', name: 'Boba Sticker Pack', variant: 'Pack of 12', wholesale: 4, msrp: 10, pack: 20, velocity: 1.2, onHand: 16, lastOrderQty: 20, lastOrder: 'one month ago', cat: 'Gifts', illo: 'pen', season: null },
  // The New Savant (top)
  { id: 'p-candle', brand: 'savant', name: 'Vanguard Candle', variant: '9 oz', wholesale: 16, msrp: 36, pack: 6, velocity: 1.0, onHand: 5, lastOrderQty: 12, lastOrder: 'three weeks ago', cat: 'Candles', illo: 'candle', season: 'in' },
  { id: 'p-incense', brand: 'savant', name: 'Cedar Incense', variant: 'Box of 30', wholesale: 6, msrp: 15, pack: 12, velocity: 0.7, onHand: 8, lastOrderQty: 12, lastOrder: 'one month ago', cat: 'Home', illo: 'incense', season: 'off' },
];
export const productById = Object.fromEntries(products.map((p) => [p.id, p]));
export const productsByBrand = (bid) => products.filter((p) => p.brand === bid);

// ---- §07-H H1: reorder recommendation (signed-in accounts only) ----
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

// ---- Tier visibility (§TM) ----
const tierRank = { standard: 0, mid: 1, top: 2 };
export function canSee(brand, accountTier) {
  return tierRank[accountTier] >= tierRank[brand.tier];
}

// ---- Draft carts ----
export const carts = [
  { id: 'c-back', name: 'Back wall refresh', lastEdited: 'a few minutes ago',
    lines: [['p-throw', 8], ['p-tallow', 24], ['p-candle', 12], ['p-boba', 24]], sync: 'synced', scanSourced: true },
  { id: 'c-holiday', name: 'Holiday 2026', lastEdited: 'two days ago',
    lines: [['p-candle', 24], ['p-incense', 12], ['p-tumbler', 16], ['p-cards', 20], ['p-napkins', 12]], sync: 'pending' },
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

// ---- Notification categories (§07-B) + copy deck (§13) ----
export const pushCategories = [
  { id: 'lifecycle', label: 'Order lifecycle', icon: 'truck', deep: 'S302', title: 'Order shipped', body: 'Your order to {brand} just shipped. Track it.' },
  { id: 'payment', label: 'Payment', icon: 'card', deep: 'S303', title: 'Invoice due soon', body: "Your {brand} invoice is due soon. Pay when you're ready." },
  { id: 'lowstock', label: 'Low stock', icon: 'warning', deep: 'S203', title: 'Running low', body: '{product} is running low at your store. Reorder?' },
  { id: 'restock', label: 'Restock', icon: 'refresh', deep: 'S004', title: 'Back in stock', body: '{product} from {brand} is back in stock.' },
  { id: 'branddrop', label: 'Brand drop', icon: 'sparkle', deep: 'S710', title: 'First-look open', body: '{brand} is open for first-look. See it now.' },
];
export const notifications = [
  { cat: 'lifecycle', group: 'Today', title: 'Order shipped', body: 'Your order to Etta & East just shipped. Track it.', when: 'two hours ago', deep: 'S302?order=4790' },
  { cat: 'restock', group: 'Today', title: 'Back in stock', body: 'Wild Lip Balm from Lavender Thorne is back in stock.', when: 'four hours ago', deep: 'S004?p=p-balm' },
  { cat: 'branddrop', group: 'Today', title: 'First-look open', body: 'Pom Pom London is open for first-look. See it now.', when: 'five hours ago', deep: 'S710?brand=pompom' },
  { cat: 'payment', group: 'Earlier this week', title: 'Invoice due soon', body: 'Your Frida Vida invoice is past due. Pay when you can.', when: 'two days ago', deep: 'S303?order=4602' },
  { cat: 'lowstock', group: 'Earlier this week', title: 'Running low', body: 'Tallow Moisturizer is running low at your store. Reorder?', when: 'three days ago', deep: 'S203' },
];

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

// ---- Search ----
export const recentSearches = ['Wool Throw', 'candle', 'Talavera', 'SKU 4821-OAT'];
export const trendingChips = ['Jewelry', 'Under MOQ', 'New drops', 'In stock'];

// ---- Ship-to (chosen on the shipping screen) ----
export const addresses = [
  { id: 'a-1', name: 'Marfa Studio · Floor', line1: '207 W San Antonio St', city: 'Marfa', region: 'TX', postal: '79843', kind: 'Ship-to', def: true },
  { id: 'a-2', name: 'Marfa Studio · Stockroom', line1: '114 E El Paso St', city: 'Marfa', region: 'TX', postal: '79843', kind: 'Ship-to', def: false },
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

// ---- Saved payment methods ----
export const paymentMethods = [
  { id: 'm-ach', kind: 'ach', label: 'ACH bank transfer', sub: 'Lowest fee · 1–2 days', icon: 'bank' },
  { id: 'm-card', kind: 'card', label: 'Saved card', sub: '•••• 4242', icon: 'card' },
];

// ---- Helpers ----
export const usd = (n) => n.toLocaleString('en-US');
export const money = (n) => `$${n.toLocaleString('en-US')}`;

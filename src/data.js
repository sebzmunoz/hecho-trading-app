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
  tier: 'mid',            // overridden live by the Variables panel
  email: 'sebz.munoz@gmail.com',
  phone: '+1 (415) 555-0148',
  rep: 'Dana Okafor',
};

// ---- Brands ----  tier = lowest exclusivity level that can see it.
export const brands = [
  { id: 'marlow',   name: 'Marlow',          tier: 'standard', cats: ['Apparel','Knitwear'], lead: 21, moq: 600,
    story: 'Slow-made knitwear from a two-loom studio in the high desert. I keep the palette earthen and the runs small.' },
  { id: 'lavender', name: 'Lavender Thorne',  tier: 'standard', cats: ['Beauty','Body'], lead: 14, moq: 250,
    story: 'Tallow-based skincare, unscented or wild-harvested. Made in cast-iron batches, labeled by hand.' },
  { id: 'popkle',   name: 'Popkle',           tier: 'standard', cats: ['Gifts','Novelty'], lead: 18, moq: 300,
    story: 'Loud little objects that make a counter fun. Boba keychains, jelly pens, the occasional plush.' },
  { id: 'cedar',    name: 'Cedar House',      tier: 'standard', cats: ['Home','Candles'], lead: 24, moq: 480,
    story: 'Hand-poured candles and cedar goods. One scent family, four seasons, no overlap.' },
  { id: 'mirador',  name: 'Mirador',          tier: 'mid', cats: ['Apparel','Accessories'], lead: 28, moq: 900, launching: true,
    story: 'Resort-adjacent accessories with a Pacific lean. Mirador opens to mid-tier and above this season.' },
  { id: 'saltwch',  name: 'Saltwitch',        tier: 'mid', cats: ['Home','Ceramics'], lead: 30, moq: 750,
    story: 'Tidal-glazed stoneware. Each piece carries the kiln it came from on the foot ring.' },
  { id: 'marquee',  name: 'Marquee Reserve',  tier: 'top', cats: ['Apparel','Outerwear'], lead: 35, moq: 1500,
    story: 'A reserve line we show to top-tier buyers first. Limited makers, limited windows.' },
  { id: 'fieldfen', name: 'Field & Fennel',   tier: 'standard', cats: ['Pantry','Gifts'], lead: 16, moq: 220,
    story: 'Small-batch pantry: shrubs, salts, and slow jams. Shelf-stable, gift-ready, regional.' },
];
export const brandById = Object.fromEntries(brands.map(b => [b.id, b]));

// ---- Products ----
// wholesale/msrp in USD; pack = case size; velocity30d units/day; onHand live POS units.
export const products = [
  { id: 'p-lulu',   brand: 'marlow',   name: 'Lulu Knit Crew',        variant: 'Oat · M', wholesale: 18, msrp: 42, map: true,  pack: 6,  velocity: 0.9, onHand: 4,  lastOrderQty: 12, lastOrder: 'two weeks ago', cat: 'Knitwear', illo: 'sweater', season: 'in' },
  { id: 'p-bea',    brand: 'marlow',   name: 'Bea Mockneck',          variant: 'Clay · S', wholesale: 22, msrp: 52, map: true,  pack: 6,  velocity: 0.6, onHand: 9,  lastOrderQty: 6,  lastOrder: 'one month ago', cat: 'Knitwear', illo: 'sweater', season: 'in' },
  { id: 'p-scarf',  brand: 'marlow',   name: 'Loom Scarf',            variant: 'Ash',     wholesale: 14, msrp: 34, map: false, pack: 8,  velocity: 0.4, onHand: 16, lastOrderQty: 8,  lastOrder: 'two months ago', cat: 'Accessories', illo: 'scarf', season: 'off' },
  { id: 'p-tallow', brand: 'lavender', name: 'Tallow Moisturizer',    variant: '2 oz',    wholesale: 18, msrp: 38, map: true,  pack: 12, velocity: 1.4, onHand: 3,  lastOrderQty: 24, lastOrder: 'two weeks ago', cat: 'Body', illo: 'jar', season: null },
  { id: 'p-balm',   brand: 'lavender', name: 'Wild Lip Balm',         variant: 'Mint',    wholesale: 4,  msrp: 9,  map: false, pack: 24, velocity: 2.1, onHand: 11, lastOrderQty: 48, lastOrder: 'three weeks ago', cat: 'Body', illo: 'tube', season: null },
  { id: 'p-soap',   brand: 'lavender', name: 'Ash Bar Soap',          variant: 'Cedar',   wholesale: 5,  msrp: 12, map: false, pack: 18, velocity: 1.1, onHand: 6,  lastOrderQty: 18, lastOrder: 'one month ago', cat: 'Body', illo: 'bar', season: null },
  { id: 'p-boba',   brand: 'popkle',   name: 'Pop Lift Boba',         variant: 'Pink',    wholesale: 6,  msrp: 14, map: false, pack: 12, velocity: 1.6, onHand: 4,  lastOrderQty: 24, lastOrder: 'two weeks ago', cat: 'Novelty', illo: 'charm', season: null },
  { id: 'p-pen',    brand: 'popkle',   name: 'Jelly Gel Pen',         variant: 'Set of 5',wholesale: 7,  msrp: 16, map: false, pack: 10, velocity: 0.8, onHand: 14, lastOrderQty: 10, lastOrder: 'two months ago', cat: 'Novelty', illo: 'pen', season: null },
  { id: 'p-plush',  brand: 'popkle',   name: 'Mochi Plush',           variant: 'Cloud',   wholesale: 9,  msrp: 22, map: false, pack: 8,  velocity: 0.3, onHand: 22, lastOrderQty: 0,  lastOrder: null, cat: 'Novelty', illo: 'plush', season: null },
  { id: 'p-candle', brand: 'cedar',    name: 'Cedar Hearth Candle',   variant: '8 oz',    wholesale: 12, msrp: 28, map: true,  pack: 6,  velocity: 1.0, onHand: 5,  lastOrderQty: 12, lastOrder: 'three weeks ago', cat: 'Candles', illo: 'candle', season: 'in' },
  { id: 'p-incense',brand: 'cedar',    name: 'Smoke Incense',         variant: 'Box of 30',wholesale: 6, msrp: 15, map: false, pack: 12, velocity: 0.7, onHand: 8,  lastOrderQty: 12, lastOrder: 'one month ago', cat: 'Home', illo: 'incense', season: 'off' },
  { id: 'p-hat',    brand: 'mirador',  name: 'Brim Sun Hat',          variant: 'Natural', wholesale: 24, msrp: 58, map: true,  pack: 6,  velocity: 0.5, onHand: 2,  lastOrderQty: 6,  lastOrder: 'two months ago', cat: 'Accessories', illo: 'hat', season: 'in' },
  { id: 'p-tote',   brand: 'mirador',  name: 'Pacific Tote',          variant: 'Sand',    wholesale: 19, msrp: 46, map: false, pack: 8,  velocity: 0.6, onHand: 7,  lastOrderQty: 8,  lastOrder: 'one month ago', cat: 'Accessories', illo: 'tote', season: 'in' },
  { id: 'p-mug',    brand: 'saltwch',  name: 'Tide Mug',              variant: 'Sea Glass',wholesale: 11, msrp: 26, map: false, pack: 8,  velocity: 0.9, onHand: 3,  lastOrderQty: 16, lastOrder: 'three weeks ago', cat: 'Ceramics', illo: 'mug', season: null },
  { id: 'p-bowl',   brand: 'saltwch',  name: 'Foot-Ring Bowl',        variant: 'Kelp',    wholesale: 16, msrp: 38, map: false, pack: 6,  velocity: 0.4, onHand: 10, lastOrderQty: 6,  lastOrder: 'two months ago', cat: 'Ceramics', illo: 'bowl', season: null },
  { id: 'p-coat',   brand: 'marquee',  name: 'Reserve Field Coat',    variant: 'Loden',   wholesale: 88, msrp: 210, map: true, pack: 4,  velocity: 0.2, onHand: 0,  lastOrderQty: 0,  lastOrder: null, cat: 'Outerwear', illo: 'coat', season: 'in' },
  { id: 'p-shrub',  brand: 'fieldfen', name: 'Quince Shrub',          variant: '8 oz',    wholesale: 8,  msrp: 18, map: false, pack: 12, velocity: 1.2, onHand: 6,  lastOrderQty: 24, lastOrder: 'two weeks ago', cat: 'Pantry', illo: 'bottle', season: 'in' },
  { id: 'p-salt',   brand: 'fieldfen', name: 'Smoked Sea Salt',       variant: '4 oz',    wholesale: 5,  msrp: 12, map: false, pack: 12, velocity: 0.9, onHand: 9,  lastOrderQty: 12, lastOrder: 'one month ago', cat: 'Pantry', illo: 'tin', season: null },
];
export const productById = Object.fromEntries(products.map(p => [p.id, p]));
export const productsByBrand = (bid) => products.filter(p => p.brand === bid);

// ---- §07-H H1: reorder recommendation ----
const roundUpToPack = (n, pack) => Math.ceil(n / pack) * pack;
export function recommendedQty(p, posConnected = true) {
  if (!posConnected) return null; // degraded: rank by history, no fabricated number
  const lead = brandById[p.brand]?.lead ?? 14;
  const need = Math.max(0, Math.ceil(p.velocity * lead) - p.onHand);
  return roundUpToPack(need, p.pack);
}
export function whyString(p, posConnected = true) {
  const parts = [];
  if (posConnected) parts.push(`Sold ${Math.round(p.velocity * 30)} in 30d`);
  if (p.lastOrder) parts.push(`last ordered ${p.lastOrder}`);
  if (p.season) parts.push(p.season === 'in' ? 'in season' : 'off season');
  return parts.join(' · ');
}

// ---- §07-H H3: stock staleness ----
export function stockState(p, pos) {
  // pos: 'connected' | 'connecting' | 'disconnected'
  if (pos === 'disconnected') return { kind: 'unknown', label: 'Last counted', value: p.onHand, caption: 'No POS connected · manual count' };
  if (p.onHand === 0) return { kind: 'out', label: 'Out of stock', value: 0, caption: 'Live · synced just now' };
  if (p.onHand <= 4) return { kind: 'low', label: `Low · ${p.onHand}`, value: p.onHand, caption: 'Live · synced just now' };
  return { kind: 'in', label: `In stock · ${p.onHand}`, value: p.onHand, caption: 'Live · synced just now' };
}

// ---- Tier visibility (§TM) ----
const tierRank = { standard: 0, mid: 1, top: 2 };
export function canSee(brand, accountTier) {
  return tierRank[accountTier] >= tierRank[brand.tier];
}

// ---- Style guides (editorial, multi-brand) ----
export const styleGuides = [
  { id: 'sg-desert', title: 'Desert Table', season: 'Spring', theme: 'Home', region: 'Southwest',
    blurb: 'A warm tablescape for the long evenings — stoneware, cedar smoke, and a quince shrub to pour.',
    brands: ['saltwch','cedar','fieldfen'], lines: ['p-mug','p-bowl','p-candle','p-shrub','p-incense'] },
  { id: 'sg-counter', title: 'The Fun Counter', season: 'Summer', theme: 'Gifts', region: 'National',
    blurb: 'Impulse buys that earn their inch of counter. Loud, cheap, and gone by Friday.',
    brands: ['popkle','fieldfen'], lines: ['p-boba','p-pen','p-plush','p-salt'] },
  { id: 'sg-layer', title: 'First Layer', season: 'Fall', theme: 'Apparel', region: 'National',
    blurb: 'The knit you reach for when the desert finally cools. Oat, clay, ash.',
    brands: ['marlow','mirador'], lines: ['p-lulu','p-bea','p-scarf','p-hat'] },
  { id: 'sg-bath', title: 'Slow Bath', season: 'Winter', theme: 'Body', region: 'National',
    blurb: 'Unscented, hand-labeled, made in cast iron. The quiet end of the shelf.',
    brands: ['lavender'], lines: ['p-tallow','p-balm','p-soap'] },
];
export const styleGuideById = Object.fromEntries(styleGuides.map(g => [g.id, g]));

// ---- Draft carts ----
export const carts = [
  { id: 'c-back', name: 'Back wall refresh', section: 'mine', author: 'You', lastEdited: 'a few minutes ago',
    lines: [['p-lulu',12],['p-tallow',24],['p-candle',12],['p-boba',24]], sync: 'synced', scanSourced: true },
  { id: 'c-holiday', name: 'Holiday 2026', section: 'mine', author: 'You', lastEdited: 'two days ago',
    lines: [['p-candle',24],['p-incense',12],['p-mug',16],['p-shrub',24],['p-salt',12]], sync: 'pending' },
  { id: 'c-mday', name: "Mother's Day", section: 'shared', author: 'Priya N. (Manager)', lastEdited: 'yesterday',
    lines: [['p-tallow',12],['p-soap',18],['p-balm',24]], sync: 'synced', sharedWith: 'You · Approve to submit' },
  { id: 'c-spring', name: 'Spring counter', section: 'pending', author: 'Priya N. (Manager)', lastEdited: 'three hours ago',
    lines: [['p-boba',24],['p-pen',10],['p-mug',16]], sync: 'synced', awaiting: true },
];
export const cartById = Object.fromEntries(carts.map(c => [c.id, c]));
export function cartTotal(c) {
  return c.lines.reduce((s, [pid, q]) => s + (productById[pid]?.wholesale || 0) * q, 0);
}
export function cartBrandCount(c) {
  return new Set(c.lines.map(([pid]) => productById[pid]?.brand)).size;
}

// ---- Orders (lifecycle: open / fulfillment / shipped / delivered / settled) ----
export const orders = [
  { id: '4821', status: 'fulfillment', total: 4820, brands: ['Cedar House','Saltwitch','Field & Fennel'],
    eta: 'arriving in about a week', placed: 'three days ago',
    lines: [['p-candle',24],['p-mug',16],['p-shrub',24],['p-incense',12]],
    invoice: 'INV-4821', due: 'due in 27 days', paid: false },
  { id: '4790', status: 'shipped', total: 2210, brands: ['Marlow','Lavender Thorne'],
    eta: 'arriving in two days', placed: 'one week ago', tracking: '1Z-HECHO-4790', carrier: 'UPS Ground',
    lines: [['p-lulu',12],['p-tallow',24],['p-balm',24]],
    invoice: 'INV-4790', due: 'due in 21 days', paid: false },
  { id: '4763', status: 'delivered', total: 1180, brands: ['Popkle','Field & Fennel'],
    eta: 'delivered two days ago', placed: 'two weeks ago', carrier: 'UPS Ground', tracking: '1Z-HECHO-4763',
    lines: [['p-boba',24],['p-pen',10],['p-salt',12]],
    invoice: 'INV-4763', due: 'due in 9 days', paid: false },
  { id: '4701', status: 'open', total: 3960, brands: ['Mirador','Marlow'],
    eta: 'awaiting confirmation', placed: 'one day ago',
    lines: [['p-hat',6],['p-tote',8],['p-bea',12],['p-scarf',8]],
    invoice: 'INV-4701', due: 'Net-30 on confirmation', paid: false },
  { id: '4655', status: 'settled', total: 1540, brands: ['Cedar House','Lavender Thorne'],
    eta: 'settled', placed: 'one month ago', pastDue: false,
    lines: [['p-candle',12],['p-soap',18],['p-incense',12]],
    invoice: 'INV-4655', due: 'paid', paid: true },
  { id: '4602', status: 'open', total: 2080, brands: ['Saltwitch'], pastDue: true,
    eta: 'awaiting payment', placed: 'six weeks ago',
    lines: [['p-mug',16],['p-bowl',6]],
    invoice: 'INV-4602', due: 'past due by 8 days', paid: false },
];
export const orderById = Object.fromEntries(orders.map(o => [o.id, o]));
export const lifecycleSteps = ['Open','In fulfillment','Shipped','Delivered','Settled'];
export const lifecycleIndex = { open: 0, fulfillment: 1, shipped: 2, delivered: 3, settled: 4 };

// ---- RMA / claims ----
export const claims = [
  { id: 'RMA-318', order: '4763', product: 'p-boba', qty: 4, reason: 'Damaged', status: 'In review', brand: 'Popkle', when: 'two days ago' },
  { id: 'RMA-302', order: '4655', product: 'p-candle', qty: 2, reason: 'Wrong item', status: 'Replaced', brand: 'Cedar House', when: 'three weeks ago' },
  { id: 'RMA-288', order: '4602', product: 'p-bowl', qty: 1, reason: 'Damaged', status: 'Refunded', brand: 'Saltwitch', when: 'one month ago' },
];

// ---- Company users (§02b roles) ----
export const companyUsers = [
  { name: 'Sebastián Muñoz', role: 'Owner', initials: 'SM', activity: 'active now', self: true },
  { name: 'Priya Nair', role: 'Manager', initials: 'PN', activity: 'active yesterday' },
  { name: 'Theo Vance', role: 'Member', initials: 'TV', activity: 'active three days ago' },
];

// ---- Notification categories (§07-B) + copy deck (§13) ----
export const pushCategories = [
  { id: 'lifecycle', label: 'Order lifecycle', icon: 'truck', deep: 'S302', title: 'Order shipped', body: 'Your order to {brand} just shipped. Track it.' },
  { id: 'payment',   label: 'Payment',        icon: 'card',  deep: 'S303', title: 'Invoice due soon', body: "Your {brand} invoice is due soon. Pay when you're ready." },
  { id: 'lowstock',  label: 'Low stock',      icon: 'warning', deep: 'S203', title: 'Running low', body: '{product} is running low at your store. Reorder?' },
  { id: 'compliance',label: 'Compliance',     icon: 'doc',   deep: 'S408', title: 'Tax ID renews soon', body: "Your tax ID is due for renewal. Submit when you're ready." },
  { id: 'styleguide',label: 'New style guide',icon: 'image', deep: 'S002', title: 'New style guide', body: 'A new look just landed: {guide}.' },
  { id: 'branddrop', label: 'Brand drop',     icon: 'sparkle', deep: 'S710', title: 'First-look open', body: '{brand} is open for first-look. See it now.' },
  { id: 'approval',  label: 'Approval requests', icon: 'check', deep: 'S208', title: 'Approval needed', body: '{name} sent a draft cart for your approval.' },
  { id: 'dm',        label: 'Direct messages', icon: 'chat', deep: 'S606', title: '{name}', body: '{name} sent you a message.' },
];
export const notifications = [
  { cat: 'lifecycle', group: 'Today', title: 'Order shipped', body: 'Your order to Marlow just shipped. Track it.', when: 'two hours ago', deep: 'S302?order=4790' },
  { cat: 'approval', group: 'Today', title: 'Approval needed', body: 'Priya N. sent a draft cart for your approval.', when: 'three hours ago', deep: 'S208' },
  { cat: 'branddrop', group: 'Today', title: 'First-look open', body: 'Mirador is open for first-look. See it now.', when: 'five hours ago', deep: 'S710?brand=mirador' },
  { cat: 'payment', group: 'Earlier this week', title: 'Invoice due soon', body: 'Your Saltwitch invoice is past due. Pay when you can.', when: 'two days ago', deep: 'S303?order=4602' },
  { cat: 'lowstock', group: 'Earlier this week', title: 'Running low', body: 'Tallow Moisturizer is running low at your store. Reorder?', when: 'three days ago', deep: 'S203' },
  { cat: 'styleguide', group: 'Older', title: 'New style guide', body: 'A new look just landed: Desert Table.', when: 'one week ago', deep: 'S002?guide=sg-desert' },
];

// ---- Rep mode (P3) ----
export const repRetailers = [
  { id: 'r-marfa', name: 'Marfa Studio', tier: 'mid', city: 'Marfa, TX', liveCart: 'Back wall refresh', taxId: 'Current', credit: 'Headroom $16.3k', note: 'Owner approves every cart personally.' },
  { id: 'r-ojai', name: 'Ojai General', tier: 'standard', city: 'Ojai, CA', liveCart: null, taxId: 'Renews soon', credit: 'Headroom $9.1k', note: 'Manager builds, owner is hands-off.' },
  { id: 'r-taos', name: 'Taos Mercantile', tier: 'top', city: 'Taos, NM', liveCart: 'Reserve preview', taxId: 'Current', credit: 'Headroom $40k', note: 'Top-tier. First-look on every drop.' },
  { id: 'r-bisbee', name: 'Bisbee Co.', tier: 'standard', city: 'Bisbee, AZ', liveCart: null, taxId: 'Expired', credit: 'At limit', note: 'Tax-ID expired — submits are held.' },
];
export const repAppointments = [
  { retailer: 'Marfa Studio', when: 'in 30 minutes', kind: 'Showroom walk' },
  { retailer: 'Taos Mercantile', when: 'this afternoon', kind: 'Reserve preview' },
];

// ---- Showroom map / booths ----
export const booths = [
  { id: 'b-101', n: '101', brand: 'Marlow', visited: true,  x: 18, y: 22 },
  { id: 'b-118', n: '118', brand: 'Lavender Thorne', visited: true, x: 52, y: 18 },
  { id: 'b-140', n: '140', brand: 'Cedar House', visited: false, x: 80, y: 30 },
  { id: 'b-205', n: '205', brand: 'Popkle', visited: true, x: 28, y: 54 },
  { id: 'b-214', n: '214', brand: 'Mirador', current: true, x: 60, y: 60 },
  { id: 'b-230', n: '230', brand: 'Saltwitch', visited: false, x: 84, y: 70 },
  { id: 'b-260', n: '260', brand: 'Field & Fennel', visited: false, x: 40, y: 82 },
];

// ---- Photo-match candidates (§07-H H2: score 0-1, show >=0.40, best-guess <0.65, cap 5) ----
export const photoCandidates = [
  { product: 'p-lulu', score: 0.91 },
  { product: 'p-bea',  score: 0.74 },
  { product: 'p-scarf',score: 0.58 },
  { product: 'p-tote', score: 0.43 },
  { product: 'p-plush',score: 0.31 }, // below floor — filtered out
];

// ---- Search ----
export const recentSearches = ['Lulu Knit', 'candle', '8 oz', 'SKU 4821-OAT'];
export const trendingChips = ['Knitwear', 'Under MOQ', 'New drops', 'In stock', 'Reorder'];

// ---- Compliance items ----
export const complianceItems = [
  { id: 'taxid', label: 'Tax ID / Resale cert', status: 'renews', note: 'Renews soon' },
  { id: 'w9', label: 'W-9', status: 'current', note: 'On file' },
  { id: 'coi', label: 'Certificate of insurance', status: 'current', note: 'On file' },
  { id: 'map', label: 'MAP policy', status: 'current', note: 'Signed' },
  { id: 'terms', label: 'Signed terms', status: 'current', note: 'Net-30 accepted' },
];

// ---- Addresses ----
export const addresses = [
  { id: 'a-1', name: 'Marfa Studio · Floor', line1: '207 W San Antonio St', city: 'Marfa', region: 'TX', postal: '79843', kind: 'Ship-to', def: true },
  { id: 'a-2', name: 'Marfa Studio · Billing', line1: 'PO Box 1120', city: 'Marfa', region: 'TX', postal: '79843', kind: 'Bill-to', def: false },
];

// ---- POS vendors ----
export const posVendors = [
  { id: 'shopify', name: 'Shopify', status: 'connected', sync: 'synced just now' },
  { id: 'lightspeed', name: 'Lightspeed', status: 'disconnected' },
  { id: 'square', name: 'Square', status: 'disconnected' },
];

// ---- Helpers ----
export const usd = (n) => n.toLocaleString('en-US');
export const money = (n) => `$${n.toLocaleString('en-US')}`;

// Sensitive fields masked by Privacy on the floor (§07-D)
export const SENSITIVE = ['wholesale', 'stock', 'spend', 'credit', 'recommended'];

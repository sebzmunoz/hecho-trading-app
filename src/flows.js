// ============================================================
// The 7 user flows (§05) as step sequences for the Flow Player.
// Each step: { screen, text, branch? } — branch jumps to an edge.
// ============================================================

export const flows = [
  { id: 'F1', name: 'First-time entry & sign-in', persona: 'All', phase: 'P0', steps: [
    { screen: 'S501', text: 'Cold launch. The brand mark holds during boot.' },
    { screen: 'S502', text: 'Entry: current customers sign in; new buyers start shopping immediately.', branch: { label: 'Branch · shop as a guest', screen: 'S001' } },
    { screen: 'S503', text: 'Email only — I send a 6-digit code.' },
    { screen: 'S504', text: 'Type the code. That is the whole sign-in.' },
    { screen: 'S507', text: 'Camera rationale before the OS prompt.' },
    { screen: 'S508', text: 'Notification categories preview.' },
    { screen: 'S510', text: 'All set — scan the floor or browse the brands.' },
    { screen: 'S001', text: 'Land on the main screen.' },
  ] },
  { id: 'F2', name: 'Walking the showroom & scanning a real shelf', persona: 'P1·P2', phase: 'P0', steps: [
    { screen: 'S101', text: 'Open Scan — barcode only, no modes.' },
    { screen: 'S004', text: 'The scan resolves straight to the product page.', branch: { label: 'Branch · camera denied', screen: 'S105' } },
    { screen: 'S004', text: 'Set the quantity right here — no pop-up — and add it.' },
    { screen: 'S101', text: 'Back to the viewfinder for the next shelf.' },
  ] },
  { id: 'F4', name: 'Building a named draft cart', persona: 'P1·P2', phase: 'P0', steps: [
    { screen: 'S201', text: 'Open Carts.' },
    { screen: 'S203', text: 'New cart — name it "Back wall refresh", pick a template.' },
    { screen: 'S202', text: 'Cart detail. Add lines from any source.' },
    { screen: 'S004', text: 'Every add happens on the product page, quantity inline.' },
    { screen: 'S202', text: 'Edit lines, change quantity, save.', branch: { label: 'Branch · MOQ not met', screen: 'S207' } },
  ] },
  { id: 'F7', name: 'Submitting an order & its lifecycle', persona: 'P1', phase: 'P0', steps: [
    { screen: 'S202', text: 'Tap Continue — the draft is done when you say it is.' },
    { screen: 'S204', text: 'One shipping screen: where it goes, how it ships, what it costs. Place the order.' },
    { screen: 'S302', text: 'You land directly on the new order — no detour through a list.' },
    { screen: 'S301', text: 'It also sits at the top of the index. Lifecycle updates Open → Settled; each change fires a push.' },
  ] },
  { id: 'F8', name: 'Paying an invoice in-app', persona: 'P1', phase: 'P0', steps: [
    { screen: 'S301', text: 'Net-terms wallet shows balance and oldest due.' },
    { screen: 'S302', text: 'Tap a due order, then Pay invoice.' },
    { screen: 'S304', text: 'Choose ACH or saved card.' },
    { screen: 'S304a', text: 'First-time ACH triggers bank-link (Plaid).' },
    { screen: 'S305', text: 'Payment success. Lifecycle moves to Settled.', branch: { label: 'Branch · network error', screen: 'S803' } },
  ] },
  { id: 'F14', name: 'Receiving a brand-launch notification', persona: 'P1', phase: 'P2', steps: [
    { screen: 'S701', text: 'A brand-drop push arrives (tier-gated).' },
    { screen: 'S710', text: 'Brand-launch arrival with first-look phrase.' },
    { screen: 'S009', text: 'First-look detail — Open the drop.', branch: { label: 'Branch · below tier', screen: 'S804?brand=marquee' } },
    { screen: 'S003', text: 'Land on the brand page with the new collection.' },
  ] },
  { id: 'F15', name: 'Love now, decide later', persona: 'P1·P2', phase: 'P0', steps: [
    { screen: 'S001', text: 'Every product surface carries a heart — one tap, nothing else asked.' },
    { screen: 'S004', text: 'On the floor: scan lands here — love it and keep walking, no quantity needed.' },
    { screen: 'S010', text: 'Your loves as a visual wall — tap a card to open the product.', branch: { label: 'Branch · empty list', screen: 'S010?_=empty' } },
    { screen: 'S011', text: 'When you\'re ready — and only then — pick lines and start a cart. Quantities and MOQs live there, not before.' },
  ] },
];

export const flowById = Object.fromEntries(flows.map((f) => [f.id, f]));

// Stakeholder walkthrough (acceptance criteria): F1 → F2 → F15 → F7
export const walkthrough = {
  name: '2-minute walkthrough',
  line: 'Set up, scan a real shelf, love it for later, then submit and track.',
  flows: ['F1', 'F2', 'F15', 'F7'],
};

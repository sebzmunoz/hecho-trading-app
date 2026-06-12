// ============================================================
// The 14 user flows (§05) as step sequences for the Flow Player.
// Each step: { screen, text, branch? } — branch jumps to an edge.
// ============================================================

export const flows = [
  { id: 'F1', name: 'First-time setup & onboarding', persona: 'All', phase: 'P0', steps: [
    { screen: 'S501', text: 'Cold launch. The brand mark holds during boot.' },
    { screen: 'S502', text: 'Welcome — three cards: scan, draft, reorder.' },
    { screen: 'S503', text: 'Sign in by email magic link or SSO.' },
    { screen: 'S504', text: 'Magic link sent. Open it on this device.' },
    { screen: 'S505', text: 'The link returns — verifying.' },
    { screen: 'S506', text: 'Multi-account holder picks an account.', branch: { label: 'Branch · invite path', screen: 'S503' } },
    { screen: 'S507', text: 'Camera rationale before the OS prompt.' },
    { screen: 'S508', text: 'Notification categories preview.' },
    { screen: 'S510', text: 'Showroom arrival cue offers wayfinding.' },
    { screen: 'S001', text: 'Land on Shop home.' },
  ] },
  { id: 'F2', name: 'Walking the showroom & scanning a real shelf', persona: 'P1·P2', phase: 'P0', steps: [
    { screen: 'S101', text: 'Open Scan — barcode mode by default.' },
    { screen: 'S102', text: 'Point at a barcode. The result half-sheet appears over the camera.' },
    { screen: 'S211', text: 'Add to cart — pick a draft, set quantity.' },
    { screen: 'S101', text: 'Sheet collapses, viewfinder live again with a confirmation chip.', branch: { label: 'Branch · camera denied', screen: 'S105' } },
  ] },
  { id: 'F3', name: 'Looking up a product by hand', persona: 'P1·P2', phase: 'P1', steps: [
    { screen: 'S101', text: 'Open the scanner.' },
    { screen: 'S106', text: 'No barcode in reach — enter the SKU by hand.', branch: { label: 'Branch · SKU not found', screen: 'S106?_=error' } },
    { screen: 'S004', text: 'Look up → product detail.' },
    { screen: 'S211', text: 'Add to cart.' },
  ] },
  { id: 'F4', name: 'Building a named draft cart', persona: 'P1·P2', phase: 'P0', steps: [
    { screen: 'S201', text: 'Open Carts.' },
    { screen: 'S203', text: 'New cart — name it "Back wall refresh", pick a template.' },
    { screen: 'S202', text: 'Cart detail. Add lines from any source.' },
    { screen: 'S211', text: 'Each add runs the Add to cart sheet.' },
    { screen: 'S202', text: 'Edit lines, change quantity, save.', branch: { label: 'Branch · MOQ not met', screen: 'S207' } },
  ] },
  { id: 'F5', name: 'Sharing a draft for approval', persona: 'P1·P2', phase: 'P1', steps: [
    { screen: 'S202', text: 'A staff draft runs over its budget — only the overage needs sign-off. Tap Share.' },
    { screen: 'S205', text: 'Pick a recipient and permission level.' },
    { screen: 'S206', text: 'Share confirmation. The admin gets a push.' },
    { screen: 'S208', text: 'The admin opens the approval inbox.' },
    { screen: 'S209', text: 'The admin reviews — approve, edit, or send back.', branch: { label: 'Branch · concurrent edit', screen: 'S807' } },
    { screen: 'S204', text: 'Approve → cart submit.' },
  ] },
  { id: 'F6', name: 'Smart reorder from past orders', persona: 'P1·P2', phase: 'P1', steps: [
    { screen: 'S201', text: 'Tap Smart reorder.' },
    { screen: 'S203', text: 'Smart reorder template selected.' },
    { screen: 'S202', text: 'Builder lists proposed lines with the why; accept piece by piece.', branch: { label: 'Branch · MOQ not met', screen: 'S207' } },
    { screen: 'S204', text: 'Continue to submit.' },
  ] },
  { id: 'F7', name: 'Submitting an order & its lifecycle', persona: 'P1', phase: 'P0', steps: [
    { screen: 'S202', text: 'Tap Submit.' },
    { screen: 'S204', text: 'Review ship-to, terms, MOQ, Tax-ID. Confirm.', branch: { label: 'Branch · tax-ID expired', screen: 'S410' } },
    { screen: 'S301', text: 'Order lands at the top of the index.' },
    { screen: 'S302', text: 'Lifecycle updates Open → Settled; each change fires a push.' },
  ] },
  { id: 'F8', name: 'Paying an invoice in-app', persona: 'P1', phase: 'P0', steps: [
    { screen: 'S301', text: 'Net-terms wallet shows balance and oldest due.' },
    { screen: 'S302', text: 'Tap a due order, then Pay invoice.' },
    { screen: 'S304', text: 'Choose ACH or saved card.' },
    { screen: 'S304a', text: 'First-time ACH triggers bank-link (Plaid).' },
    { screen: 'S305', text: 'Payment success. Lifecycle moves to Settled.', branch: { label: 'Branch · network error', screen: 'S803' } },
  ] },
  { id: 'F9', name: 'Filing a damage / RMA claim', persona: 'P1·P2', phase: 'P1', steps: [
    { screen: 'S302', text: 'From order detail, report damage on a line.' },
    { screen: 'S307', text: 'Take or pick a photo.' },
    { screen: 'S308', text: 'Pre-filled claim — reason and note.', branch: { label: 'Branch · offline', screen: 'S310' } },
    { screen: 'S309', text: 'Submitted. Claim ID and brand queue routing.' },
  ] },
  { id: 'F10', name: 'Renewing the tax ID', persona: 'P1', phase: 'P1', steps: [
    { screen: 'S408', text: 'Compliance push deep-links to the hub.' },
    { screen: 'S409', text: 'Re-upload the document and confirm.' },
    { screen: 'S204', text: 'On submit with an expired tax-ID…' },
    { screen: 'S410', text: 'Tax-ID hold blocks the submit. Resolve.' },
  ] },
  { id: 'F11', name: 'Rep view & co-shopping', persona: 'P3', phase: 'P2', steps: [
    { screen: 'S602', text: 'Switch to Rep mode — the dashboard.', branch: { label: 'From the You tab', screen: 'S401' } },
    { screen: 'S601', text: 'Pick a retailer to co-shop with.' },
    { screen: 'S603', text: 'Retailer profile: context, credit, tax-ID.' },
    { screen: 'S607', text: 'Coverage map: every retailer pinned; a nearby applicant is flagged before approval.' },
    { screen: 'S604', text: 'Co-shop live in the retailer\'s draft.' },
    { screen: 'S606', text: 'Send a memo via chat. Switch back any time.' },
  ] },
  { id: 'F12', name: 'Privacy on the floor', persona: 'P1·P2', phase: 'P1', steps: [
    { screen: 'S004', text: 'Privacy is ON by default — sensitive values render as dots. The eye appears in the header whenever something sensitive is on-screen.' },
    { screen: 'S707', text: 'Tap the eye: everything reveals. Tap again: everything re-masks. One toggle, nothing to configure.' },
  ] },
  { id: 'F13', name: 'Discovering a style guide', persona: 'P1·P2', phase: 'P2', steps: [
    { screen: 'S001', text: 'Shop home features a hero style guide.' },
    { screen: 'S002', text: 'Editorial spread, multi-brand, the look list.' },
    { screen: 'S212', text: 'Shop the look — pick or skip, batch-add.' },
    { screen: 'S202', text: 'Picked lines flow into the chosen draft.' },
  ] },
  { id: 'F14', name: 'Receiving a brand-launch notification', persona: 'P1', phase: 'P2', steps: [
    { screen: 'S701', text: 'A brand-drop push arrives.' },
    { screen: 'S710', text: 'Brand-launch arrival with first-look phrase.' },
    { screen: 'S009', text: 'First-look detail — Open the drop.', branch: { label: 'Branch · first-look closed', screen: 'S009?_=closed' } },
    { screen: 'S003', text: 'Land on the brand page with the new collection.' },
  ] },
];

export const flowById = Object.fromEntries(flows.map((f) => [f.id, f]));

// Stakeholder walkthrough (acceptance criteria): F1 → F2 → F6 → F7 → F12
export const walkthrough = {
  name: '2-minute walkthrough',
  line: 'Set up, scan a real shelf, reorder smart, submit and track, then protect it on the floor.',
  flows: ['F1', 'F2', 'F6', 'F7', 'F12'],
};

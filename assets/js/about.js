/* ==========================================================================
   CyberSetu — about the service
   The feature inventory lives here so the page and the README stay in step.
   ========================================================================== */

import { initSite, observeReveal, hydrateIcons } from './site.js';
import { $, escapeHTML } from './utils.js';

initSite();

/* --------------------------------------------------------------------------
   Principles
   -------------------------------------------------------------------------- */
const PRINCIPLES = [
  {
    n: '01',
    t: 'Speed before completeness',
    d: 'A complaint filed in five minutes with three details beats a perfect one filed tomorrow. Everything optional is genuinely optional and can be added later.'
  },
  {
    n: '02',
    t: 'Never leave someone wondering',
    d: 'Every case shows its stage, its response deadline and what is expected next. Silence is what makes people call the helpline five times.'
  },
  {
    n: '03',
    t: 'Prevention sits beside reporting',
    d: 'The cheapest fraud to handle is the one that does not happen. Checking a number or link is a first-class task, not a buried page.'
  },
  {
    n: '04',
    t: 'Both sides of the counter',
    d: 'A citizen feature that creates unusable work for an officer is not a feature. Every citizen action has a matching view in the officer console.'
  }
];

/* --------------------------------------------------------------------------
   Citizen features
   -------------------------------------------------------------------------- */
const CITIZEN = [
  {
    t: 'Plain-language triage',
    tag: 'Intake',
    d: 'People choose from “money was taken from me”, “something else happened online” or “online abuse of a woman or child” — not a legal taxonomy. The correct statutory category is attached behind the scenes.',
    why: 'The first screen of a legal category list is where a large share of people stop, because getting it wrong feels risky.'
  },
  {
    t: 'Bank-message parsing',
    tag: 'Intake',
    d: 'Paste the SMS your bank sent and the amount, transaction reference, beneficiary handle, bank and date are extracted and filled into the form.',
    why: 'The transaction reference is the single most useful field for a bank hold, and the hardest for a distressed person to transcribe correctly.'
  },
  {
    t: 'Hold request prepared at filing',
    tag: 'Recovery',
    d: 'For financial fraud, a beneficiary-bank hold request is assembled from the details already given and travels with the complaint.',
    why: 'Recovery odds fall sharply once funds are layered onward. The request should not wait for a queue.'
  },
  {
    t: 'Evidence fingerprinting',
    tag: 'Evidence',
    d: 'Every attached file is hashed with SHA-256 in the browser before it is submitted, and the fingerprint is printed on the acknowledgement.',
    why: 'It gives the complainant a receipt proving the file was not altered afterwards, and gives the officer a chain of custody from the first minute.'
  },
  {
    t: 'Draft autosave and resume',
    tag: 'Intake',
    d: 'A part-finished complaint is written to the device as it is typed and restored on return, including which step was reached.',
    why: 'People are interrupted, lose signal, or stop to find a document. Losing the form means many never come back.'
  },
  {
    t: 'Guided description prompts',
    tag: 'Intake',
    d: 'Tappable phrases build a usable description for someone who cannot face a blank box, and every word stays editable.',
    why: 'A free-text box with a minimum length is a wall for people writing in a second language or under stress.'
  },
  {
    t: 'Visible case journey',
    tag: 'Transparency',
    d: 'Each case shows five stages, what happened at each, when, and what is expected next.',
    why: 'The most common follow-up call is “has anything happened?”. The answer should be on the screen.'
  },
  {
    t: 'A response deadline you can see',
    tag: 'Accountability',
    d: 'Every category carries a response window. The case page shows how much has been used, and marks a case overdue when it passes.',
    why: 'A commitment nobody can see is not a commitment.'
  },
  {
    t: 'One-step escalation',
    tag: 'Accountability',
    d: 'When the window is exceeded, an escalation button appears. Using it notifies a supervising officer and writes the request onto the case history.',
    why: 'Otherwise the only escalation route is calling the helpline repeatedly and hoping.'
  },
  {
    t: 'Recovery ledger',
    tag: 'Recovery',
    d: 'Each financial case shows three figures: lost, currently held by the bank, and returned.',
    why: '“Held” and “returned” are different things, and confusing them causes real distress.'
  },
  {
    t: 'Check before you pay',
    tag: 'Prevention',
    d: 'A lookup for a phone number, UPI ID, email or link, returning a risk score with the specific reasons behind it.',
    why: 'The reasons matter more than the score — they teach the pattern rather than just issuing a verdict.'
  },
  {
    t: 'Community flagging',
    tag: 'Prevention',
    d: 'Anyone can flag an identifier they were targeted with, without having lost money, and it becomes findable by the next person who checks it.',
    why: 'Most people who are approached are not defrauded, and today that warning signal is simply lost.'
  },
  {
    t: 'Anonymous reporting',
    tag: 'Access',
    d: 'Complaints involving a woman or child can be filed with no name or number, still returning a working reference number.',
    why: 'Requiring identity suppresses exactly the reports that matter most.'
  },
  {
    t: 'Real acknowledgement and case documents',
    tag: 'Records',
    d: 'The acknowledgement and case summary download as genuine PDFs containing the reference number, details, evidence fingerprints and full history.',
    why: 'People need something to show a bank, an employer or a family member.'
  },
  {
    t: 'Track by reference or by mobile',
    tag: 'Transparency',
    d: 'Either look up a single complaint by its reference, or sign in with a mobile number to see everything filed, with a CSV export.',
    why: 'Anonymous complainants have only a reference; everyone else wants one list.'
  },
  {
    t: 'Prevention and alerts in one place',
    tag: 'Prevention',
    d: 'Current fraud alerts, the pattern behind each scam, and a short self-check for whether you would spot one.',
    why: 'Advice is only useful attached to what is happening this week.'
  },
  {
    t: 'Three languages and full accessibility controls',
    tag: 'Access',
    d: 'English, Hindi and Kannada, with text scaling to 145%, a high-contrast mode, light and dark themes, keyboard operation throughout and full reduced-motion support.',
    why: 'The people most targeted by fraud are frequently the least well served by default interfaces.'
  },
  {
    t: 'Nearest cyber cell finder',
    tag: 'Access',
    d: 'Choose a state and get the responsible unit, its address, and a maps link.',
    why: 'Some cases only progress in person, and finding the right office is its own obstacle.'
  }
];

/* --------------------------------------------------------------------------
   Officer features
   -------------------------------------------------------------------------- */
const OFFICER = [
  {
    t: 'Live triage board',
    tag: 'Triage',
    d: 'Incoming complaints ranked by a priority score, filterable by band, category and state, with the full queue one click away.',
    why: 'A chronological queue treats a ₹2.8 lakh fraud reported eighteen minutes ago the same as a month-old profile complaint.'
  },
  {
    t: 'Explainable priority',
    tag: 'Triage',
    d: 'Every score exposes the specific reasons that produced it — amount, time since the debit, evidence attached, cluster match.',
    why: 'An officer will not trust, and should not be asked to act on, a ranking they cannot interrogate.'
  },
  {
    t: 'Recovery-window queue',
    tag: 'Recovery',
    d: 'A separate live queue of cases where money can still be held, counting down the minutes remaining and sorted by urgency.',
    why: 'This is the only queue where a few minutes changes the outcome, so it deserves its own surface.'
  },
  {
    t: 'Link analysis across cases',
    tag: 'Investigation',
    d: 'A graph connecting complaints that share a phone number, UPI handle or beneficiary account, showing the shape of a network rather than isolated cases.',
    why: 'Fraud is organised; investigating each complaint alone repeats the same work dozens of times.'
  },
  {
    t: 'Mule-cluster detection',
    tag: 'Investigation',
    d: 'Groups of beneficiary accounts receiving from unrelated complainants in a short window are surfaced as a cluster with its combined exposure.',
    why: 'Freezing a cluster protects the victims who have not reported yet.'
  },
  {
    t: 'Bulk hold dispatch',
    tag: 'Recovery',
    d: 'Select multiple cases and issue hold requests together, with a per-bank status trail.',
    why: 'Cluster-scale fraud needs cluster-scale response.'
  },
  {
    t: 'Full audit trail',
    tag: 'Accountability',
    d: 'Assignments, status changes, hold requests, merges, jurisdiction transfers and citizen messages are all written to a readable log.',
    why: 'It is both an accountability record and the handover note the next officer needs.'
  },
  {
    t: 'Workload and deadline dashboard',
    tag: 'Accountability',
    d: 'Open case counts and response-window compliance per officer and per unit.',
    why: 'Missed deadlines are usually a distribution problem, not an effort problem.'
  },
  {
    t: 'One action, one citizen update',
    tag: 'Transparency',
    d: 'When an officer records an action, the citizen-facing timeline updates with a plain-language version of the same event.',
    why: 'It removes the follow-up call without anyone writing a separate message.'
  },
  {
    t: 'Duplicate merge and jurisdiction transfer',
    tag: 'Operations',
    d: 'Duplicate complaints merge while keeping both references alive, and transfers between units record the reason.',
    why: 'Both are routine, and both currently lose information the complainant later needs.'
  },
  {
    t: 'Geographic concentration view',
    tag: 'Intelligence',
    d: 'Complaint volumes by state, so emerging campaigns are visible while they are still emerging.',
    why: 'A spike in one district is the earliest warning of a new script.'
  },
  {
    t: 'Case-level export',
    tag: 'Operations',
    d: 'Any queue or case list exports to CSV for use in an existing case-management system.',
    why: 'A tool that cannot hand data onward becomes another silo.'
  }
];

/* --------------------------------------------------------------------------
   Comparison
   -------------------------------------------------------------------------- */
const COMPARE = [
  ['Choose what to report', 'Legal category first', 'Plain-language situation, category derived'],
  ['Transaction details', 'Typed manually from the bank SMS', 'Parsed from the pasted message'],
  ['Bank hold request', 'Follows the complaint separately', 'Prepared and attached at filing'],
  ['Part-finished form', 'Lost on interruption', 'Saved on the device and resumed'],
  ['Evidence integrity', 'File is uploaded as-is', 'SHA-256 fingerprint on the acknowledgement'],
  ['Knowing what stage it is at', 'Status label', 'Five-stage history with expected next step'],
  ['Response commitment', 'Not surfaced', 'Deadline shown, overdue flagged'],
  ['If nothing happens', 'Call the helpline again', 'One-step escalation recorded on the case'],
  ['Money recovered', 'Not distinguished', 'Lost / held / returned shown separately'],
  ['Checking a suspicious number', 'Report only, after the fact', 'Lookup with reasons, before paying'],
  ['Reporting without loss', 'Not really catered for', 'Community flagging feeds the checker'],
  ['Case documents', 'Acknowledgement only', 'Acknowledgement, case summary and CSV export'],
  ['Officer prioritisation', 'Largely chronological', 'Explainable priority score plus recovery queue'],
  ['Linking related cases', 'Manual', 'Shared-identifier graph and mule clusters'],
  ['Accessibility controls', 'Limited', 'Text scaling, contrast, themes, three languages']
];

/* --------------------------------------------------------------------------
   Stack
   -------------------------------------------------------------------------- */
const STACK = [
  { t: 'No framework', d: 'Standard ES modules and the platform APIs. Nothing to learn before maintaining it.' },
  { t: 'Vite', d: 'Multi-page build, one entry per route, hashed assets and tree shaking.' },
  { t: 'Eight real pages', d: 'Each route is its own document that loads only its own script.' },
  { t: 'CSS custom properties', d: 'One token file drives light, dark and high-contrast without duplicated rules.' },
  { t: 'Web Crypto', d: 'SHA-256 evidence fingerprints computed in the browser, never uploaded to hash.' },
  { t: 'Hand-built PDF writer', d: 'Valid PDF 1.4 documents generated client-side with no third-party runtime.' },
  { t: 'localStorage', d: 'Draft autosave, filed complaints, flags and preferences persist across visits.' },
  { t: 'Inline SVG', d: 'Icons, the monument skyline, sparklines and the link graph — no icon font, no image requests.' }
];

const REAL = [
  'Filing a complaint issues a reference number and it really appears in tracking afterwards',
  'Attached files are really read and really hashed with SHA-256',
  'Acknowledgement and case summary downloads are genuine PDF files',
  'CSV exports open correctly in a spreadsheet',
  'Draft autosave, language, theme, text size and contrast all persist across reloads',
  'Flagging an identifier makes it findable by a later lookup',
  'Escalation writes a new entry onto the case history'
];

const PROD = [
  'Server-side complaint storage with an audited database rather than the browser',
  'Real bank and payment-operator integration for hold requests',
  'Authentication for citizens and role-based access for officers',
  'Live identifier reputation fed from national complaint volumes',
  'SMS and email notification delivery',
  'Formal accessibility audit and penetration testing before public use'
];

/* --------------------------------------------------------------------------
   Render
   -------------------------------------------------------------------------- */
$('#principles').innerHTML = PRINCIPLES.map((p, i) => `
  <article class="feat reveal" data-delay="${i % 3}">
    <span class="fnum">${p.n}</span>
    <h3>${escapeHTML(p.t)}</h3>
    <p>${escapeHTML(p.d)}</p>
  </article>`).join('');

const specRows = list => list.map((s, i) => `
  <article class="specrow reveal">
    <span class="specn">${String(i + 1).padStart(2, '0')}</span>
    <div>
      <h3>${escapeHTML(s.t)}</h3>
      <span class="badge primary spectag">${escapeHTML(s.tag)}</span>
      <p>${escapeHTML(s.d)}</p>
    </div>
    <div class="specwhy">
      <b>Why it matters</b>
      ${escapeHTML(s.why)}
    </div>
  </article>`).join('');

$('#citizenSpecs').innerHTML = specRows(CITIZEN);
$('#officerSpecs').innerHTML = specRows(OFFICER);

$('#compareBody').innerHTML = COMPARE.map(([what, now, ours]) => `
  <tr>
    <td class="cwhat"><b>${escapeHTML(what)}</b></td>
    <td class="no">${escapeHTML(now)}</td>
    <td class="yes">${escapeHTML(ours)}</td>
  </tr>`).join('');

$('#stackGrid').innerHTML = STACK.map(s => `
  <div class="stackchip">
    <b>${escapeHTML(s.t)}</b>
    <span>${escapeHTML(s.d)}</span>
  </div>`).join('');

$('#realList').innerHTML = REAL.map(r => `<li>• ${escapeHTML(r)}</li>`).join('');
$('#prodList').innerHTML = PROD.map(r => `<li>• ${escapeHTML(r)}</li>`).join('');

hydrateIcons();
observeReveal();

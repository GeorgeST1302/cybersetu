/* ==========================================================================
   CyberSetu — sample dataset
   ---------------------------------------------------------------------------
   Every figure, case record, officer action and identifier in this file is
   invented for demonstration. Nothing here is real, and no request made from
   this interface leaves the browser.
   ========================================================================== */

export const STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi (NCT)', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Odisha', 'Punjab', 'Rajasthan',
  'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export const CATEGORIES = [
  {
    id: 'financial',
    label: 'Money was taken from me',
    legal: 'Financial fraud',
    desc: 'A payment you did not authorise, or one you were tricked into making — UPI, card, net banking, wallet or a loan app.',
    icon: 'wallet'
  },
  {
    id: 'other',
    label: 'Something else happened online',
    legal: 'Other cybercrime',
    desc: 'A hacked account, a fake profile, data theft, online harassment, or a job, matrimony or investment scam.',
    icon: 'shield'
  },
  {
    id: 'women',
    label: 'Online abuse of a woman or child',
    legal: 'Crime against women and children',
    desc: 'Stalking, threats, obscene content or abuse. You may file this without giving your name.',
    icon: 'heart'
  }
];

export const PLATFORMS = [
  'WhatsApp', 'Telegram', 'Instagram', 'Facebook', 'A phone call', 'SMS',
  'Google Pay', 'PhonePe', 'Paytm', 'A website', 'An app I downloaded',
  'Email', 'YouTube', 'A dating app', 'Other'
];

/* --------------------------------------------------------------------------
   National figures — sample
   -------------------------------------------------------------------------- */
export const NATIONAL = {
  complaintsToday: 4382,
  complaintsTrend: [31, 38, 35, 44, 41, 52, 48, 57, 61, 55, 68, 72],
  frozenToday: 21740000,          // rupees held before the money moved on
  frozenTrend: [12, 18, 15, 24, 22, 31, 28, 36, 33, 42, 39, 47],
  callsToday: 9126,
  callsTrend: [40, 44, 39, 51, 47, 58, 54, 62, 59, 66, 63, 71],
  medianFirstResponse: 3.4,       // hours
  responseTrend: [9.2, 8.6, 8.1, 7.4, 6.8, 6.1, 5.5, 5.0, 4.6, 4.1, 3.8, 3.4],
  recoveryRate: 38,               // %
  casesResolved: 1284
};

export const STATE_HEAT = [
  { state: 'Maharashtra', count: 612 },
  { state: 'Uttar Pradesh', count: 548 },
  { state: 'Karnataka', count: 471 },
  { state: 'Tamil Nadu', count: 396 },
  { state: 'Delhi (NCT)', count: 358 },
  { state: 'Telangana', count: 312 },
  { state: 'Gujarat', count: 287 },
  { state: 'West Bengal', count: 244 }
];

/* --------------------------------------------------------------------------
   Citizen cases — sample records tied to the demo mobile number
   -------------------------------------------------------------------------- */
export const CASES = [
  {
    id: 'CS-2026-0814-77413',
    title: 'UPI debit after a fake electricity-bill call',
    category: 'financial',
    legal: 'Financial fraud',
    filed: '2026-08-14T09:12:00',
    updated: '2026-08-27T16:40:00',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    platform: 'A phone call',
    amount: 48500,
    frozen: 31200,
    returned: 0,
    stage: 3,
    officer: 'Insp. R. Kulkarni',
    unit: 'Bengaluru City Cyber Crime Police Station',
    slaDays: 14,
    slaElapsed: 13,
    suspects: [
      { type: 'Phone', value: '+91 98XXX 41207' },
      { type: 'UPI ID', value: 'quickpay.support@okaxis' }
    ],
    evidence: [
      { name: 'bank-sms-14aug.png', size: '218 KB', hash: 'a91f4c' },
      { name: 'call-log-screenshot.png', size: '164 KB', hash: '7b2e08' },
      { name: 'statement-aug.pdf', size: '512 KB', hash: 'c40d19' }
    ],
    timeline: [
      { t: 'Complaint received', d: 'Your report was logged and a reference number was issued.', w: '14 Aug, 9:12 AM', s: 'done' },
      { t: 'Bank freeze requested', d: 'A hold request was sent to the beneficiary bank within the first hour.', w: '14 Aug, 9:51 AM', s: 'done' },
      { t: '₹31,200 held', d: 'The beneficiary bank confirmed a hold on part of the transferred amount.', w: '14 Aug, 2:20 PM', s: 'done' },
      { t: 'Assigned to an officer', d: 'Routed to Bengaluru City Cyber Crime Police Station.', w: '16 Aug, 11:05 AM', s: 'done' },
      { t: 'Under investigation', d: 'The officer has requested account details from the beneficiary bank.', w: '27 Aug, 4:40 PM', s: 'now' },
      { t: 'Outcome recorded', d: 'You will be told the result and what happens to the held amount.', w: 'Expected by 11 Sep', s: 'todo' }
    ]
  },
  {
    id: 'CS-2026-0722-31980',
    title: 'Fake customer-care number on a search result',
    category: 'financial',
    legal: 'Financial fraud',
    filed: '2026-07-22T18:44:00',
    updated: '2026-08-19T10:15:00',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    platform: 'A website',
    amount: 12000,
    frozen: 12000,
    returned: 12000,
    stage: 5,
    officer: 'SI M. Fernandes',
    unit: 'Bengaluru City Cyber Crime Police Station',
    slaDays: 14,
    slaElapsed: 14,
    suspects: [{ type: 'Phone', value: '+91 74XXX 90355' }],
    evidence: [{ name: 'search-result.png', size: '190 KB', hash: '2fd7a1' }],
    timeline: [
      { t: 'Complaint received', d: 'Your report was logged and a reference number was issued.', w: '22 Jul, 6:44 PM', s: 'done' },
      { t: 'Bank freeze requested', d: 'A hold request was sent to the beneficiary bank.', w: '22 Jul, 7:02 PM', s: 'done' },
      { t: '₹12,000 held', d: 'The full transferred amount was held before it moved on.', w: '22 Jul, 9:30 PM', s: 'done' },
      { t: 'Assigned to an officer', d: 'Routed to Bengaluru City Cyber Crime Police Station.', w: '24 Jul, 10:00 AM', s: 'done' },
      { t: 'Refund ordered', d: 'The held amount was ordered to be returned to your account.', w: '14 Aug, 3:12 PM', s: 'done' },
      { t: 'Money returned — case closed', d: '₹12,000 was credited back to your account.', w: '19 Aug, 10:15 AM', s: 'done' }
    ]
  },
  {
    id: 'CS-2026-0803-55021',
    title: 'Impersonation profile using my photographs',
    category: 'other',
    legal: 'Other cybercrime',
    filed: '2026-08-03T13:20:00',
    updated: '2026-08-25T09:05:00',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    platform: 'Instagram',
    amount: 0,
    frozen: 0,
    returned: 0,
    stage: 2,
    officer: 'ASI P. Nair',
    unit: 'Bengaluru City Cyber Crime Police Station',
    slaDays: 21,
    slaElapsed: 22,
    suspects: [{ type: 'Profile', value: 'instagram.com/not_the_real_one' }],
    evidence: [
      { name: 'fake-profile-1.png', size: '244 KB', hash: '9c31be' },
      { name: 'fake-profile-2.png', size: '221 KB', hash: 'e05a72' }
    ],
    timeline: [
      { t: 'Complaint received', d: 'Your report was logged and a reference number was issued.', w: '3 Aug, 1:20 PM', s: 'done' },
      { t: 'Takedown notice sent', d: 'A removal request was sent to the platform.', w: '5 Aug, 4:30 PM', s: 'done' },
      { t: 'Assigned to an officer', d: 'Routed to Bengaluru City Cyber Crime Police Station.', w: '25 Aug, 9:05 AM', s: 'now' },
      { t: 'Platform response', d: 'Awaiting confirmation that the profile has been removed.', w: 'Expected by 1 Sep', s: 'todo' },
      { t: 'Outcome recorded', d: 'You will be told the result of the takedown request.', w: 'Expected by 8 Sep', s: 'todo' }
    ]
  }
];

/* --------------------------------------------------------------------------
   Suspect repository — sample identifiers people have reported
   -------------------------------------------------------------------------- */
export const SUSPECTS = [
  {
    value: '9845012345', kind: 'Phone number', risk: 92, reports: 214,
    firstSeen: '2026-03-11', lastSeen: '2026-08-28',
    tags: ['Fake electricity bill', 'Remote-access app'],
    signals: [
      { s: 'bad', t: '214 reports in the last 90 days', d: 'Reported from 19 states, most often as a fake utility-bill call.' },
      { s: 'bad', t: 'Linked to 6 held accounts', d: 'Money sent to this contact has been traced to accounts already under hold.' },
      { s: 'bad', t: 'Asks you to install a screen-sharing app', d: 'Reports consistently mention being asked to install remote-access software.' },
      { s: 'warn', t: 'Number is active again', d: 'Reported as recently as yesterday, so the line is still in use.' }
    ]
  },
  {
    value: 'quickpay.support@okaxis', kind: 'UPI ID', risk: 88, reports: 147,
    firstSeen: '2026-05-02', lastSeen: '2026-08-27',
    tags: ['Fake refund', 'Customer care'],
    signals: [
      { s: 'bad', t: '147 reports in the last 90 days', d: 'Almost all describe a promised refund that never arrived.' },
      { s: 'bad', t: 'Collect requests, not payments', d: 'Victims report being sent a request to pay while being told they are receiving money.' },
      { s: 'warn', t: 'Handle imitates a bank', d: 'The name resembles a bank support account but is a personal handle.' }
    ]
  },
  {
    value: 'https://rbi-kyc-update.in', kind: 'Website', risk: 96, reports: 389,
    firstSeen: '2026-06-18', lastSeen: '2026-08-29',
    tags: ['Fake KYC', 'Credential harvesting'],
    signals: [
      { s: 'bad', t: '389 reports in the last 90 days', d: 'The fastest-growing reported link this month.' },
      { s: 'bad', t: 'Imitates a regulator', d: 'No regulator asks you to update KYC through a link sent by message.' },
      { s: 'bad', t: 'Registered 11 days ago', d: 'The domain is very new, which is common for scam sites.' },
      { s: 'bad', t: 'Collects card and OTP fields', d: 'The page asks for a full card number and one-time password.' }
    ]
  },
  {
    value: 'parttime.earnings@oksbi', kind: 'UPI ID', risk: 61, reports: 34,
    firstSeen: '2026-07-30', lastSeen: '2026-08-24',
    tags: ['Task scam', 'Investment'],
    signals: [
      { s: 'warn', t: '34 reports in the last 90 days', d: 'Reported in connection with paid-task and rating jobs.' },
      { s: 'warn', t: 'Small first payouts', d: 'Victims describe receiving a small amount before being asked to deposit more.' }
    ]
  },
  {
    value: '8012349876', kind: 'Phone number', risk: 18, reports: 2,
    firstSeen: '2026-08-20', lastSeen: '2026-08-22',
    tags: ['Unverified'],
    signals: [
      { s: 'ok', t: 'Only 2 reports', d: 'Too few reports to draw a conclusion. Stay careful anyway.' }
    ]
  }
];

/* --------------------------------------------------------------------------
   Learning content
   -------------------------------------------------------------------------- */
export const LESSONS = [
  { tag: 'Payments', title: 'A UPI PIN never receives money', body: 'You only ever enter your PIN to send money. If somebody asks for your PIN to “receive a refund”, it is a scam.', tone: 'primary' },
  { tag: 'Calls', title: 'No official will ask for an OTP', body: 'Banks, police, couriers and utilities never ask for a one-time password. Anybody who does is not who they claim to be.', tone: 'accent' },
  { tag: 'Links', title: 'Check the address, not the logo', body: 'A scam page can copy any logo perfectly. Read the domain slowly, character by character, before you type anything.', tone: 'success' },
  { tag: 'Jobs', title: 'Real jobs do not ask you to pay', body: 'Registration fees, security deposits and “unlock your earnings” payments are the core of the task-based job scam.', tone: 'info' },
  { tag: 'Apps', title: 'Screen sharing gives away everything', body: 'If somebody asks you to install a screen-sharing or remote-access app to “fix” a problem, end the call.', tone: 'primary' },
  { tag: 'Elders', title: 'The digital arrest call', body: 'No agency arrests anybody over a video call, and none demands a transfer to a “verification account”. Hang up and call 1930.', tone: 'accent' }
];

export const QUIZ = [
  {
    q: 'A caller says your electricity will be cut in 30 minutes unless you pay now. What is the safest next step?',
    opts: [
      'Pay the small amount they ask to be safe',
      'Hang up and call your provider on the number printed on your bill',
      'Install the app they send so they can verify your meter',
      'Share the OTP so they can confirm your identity'
    ],
    right: 1,
    why: 'Urgency is the tool, not the truth. Ending the call and dialling the number on your own bill removes the pressure and reaches the real provider.'
  },
  {
    q: 'You receive a UPI request for ₹1 described as a “refund verification”. What is happening?',
    opts: [
      'It is a normal refund step',
      'It confirms your account before a large credit',
      'It is a payment request — approving it sends money out',
      'It is a bank charge'
    ],
    right: 2,
    why: 'A UPI collect request always takes money from you. Receiving money never needs your approval or your PIN.'
  },
  {
    q: 'Money has just left your account to a fraudster. When does reporting help most?',
    opts: [
      'Within the first hour, before the money is moved on',
      'After you have gathered every document',
      'Within 30 days',
      'Timing makes no difference'
    ],
    right: 0,
    why: 'Funds are usually moved through several accounts quickly. The first hour is when a hold is most likely to catch the money.'
  }
];

export const DIGEST = [
  { w: '29 Aug', t: 'Fake KYC-update links imitating a regulator', d: 'Reports up sharply this week across Maharashtra, Delhi and Karnataka.', level: 'high' },
  { w: '28 Aug', t: '“Digital arrest” video calls targeting retired citizens', d: 'Callers pose as investigators and demand a transfer to a verification account.', level: 'high' },
  { w: '27 Aug', t: 'Paid-task job scams on messaging groups', d: 'Small early payouts are followed by a request for a large deposit.', level: 'medium' },
  { w: '26 Aug', t: 'Fake customer-care numbers in search results', d: 'Numbers placed to look like official support lines for banks and delivery firms.', level: 'medium' },
  { w: '25 Aug', t: 'Festival delivery-fee messages', d: 'A small “pending customs fee” link that captures card details.', level: 'low' }
];

/* --------------------------------------------------------------------------
   Officer console — sample queue, alerts and audit trail
   -------------------------------------------------------------------------- */
export const QUEUE = [
  { id: 'CS-2026-0829-91204', when: '12 min ago', cat: 'Financial fraud', amount: 285000, state: 'Maharashtra', score: 94, band: 'p1', minsLeft: 18, status: 'New',
    why: ['Reported 18 minutes after the debit', 'Amount above ₹2,00,000', 'Beneficiary matches a flagged mule cluster'] },
  { id: 'CS-2026-0829-91198', when: '26 min ago', cat: 'Financial fraud', amount: 74000, state: 'Karnataka', score: 88, band: 'p1', minsLeft: 34, status: 'New',
    why: ['Within the freeze window', 'Suspect UPI already reported 147 times', 'Bank SMS attached'] },
  { id: 'CS-2026-0829-91186', when: '41 min ago', cat: 'Women and children', amount: 0, state: 'Delhi (NCT)', score: 86, band: 'p1', minsLeft: null, status: 'New',
    why: ['Category requires priority handling', 'Complainant is a minor', 'Evidence attached at filing'] },
  { id: 'CS-2026-0829-91171', when: '1 hr ago', cat: 'Financial fraud', amount: 39500, state: 'Uttar Pradesh', score: 71, band: 'p2', minsLeft: 5, status: 'Assigned',
    why: ['Freeze window closing', 'Single beneficiary account', 'No evidence attached yet'] },
  { id: 'CS-2026-0829-91160', when: '2 hr ago', cat: 'Other cybercrime', amount: 0, state: 'Tamil Nadu', score: 58, band: 'p2', minsLeft: null, status: 'Assigned',
    why: ['Account takeover reported', 'Platform takedown pending'] },
  { id: 'CS-2026-0828-90884', when: '9 hr ago', cat: 'Financial fraud', amount: 15200, state: 'Gujarat', score: 44, band: 'p3', minsLeft: null, status: 'In progress',
    why: ['Outside the freeze window', 'Amount below the escalation threshold'] },
  { id: 'CS-2026-0828-90790', when: '14 hr ago', cat: 'Other cybercrime', amount: 0, state: 'West Bengal', score: 31, band: 'p3', minsLeft: null, status: 'In progress',
    why: ['No financial loss reported', 'Awaiting complainant response'] }
];

export const CLUSTERS = [
  {
    name: 'Cluster A — fake utility-bill calls',
    cases: 47, accounts: 9, exposure: 3840000, states: ['Maharashtra', 'Karnataka', 'Telangana'],
    note: 'Nine beneficiary accounts receiving from unrelated complainants within minutes of each other.'
  },
  {
    name: 'Cluster B — regulator KYC pages',
    cases: 112, accounts: 14, exposure: 7210000, states: ['Delhi (NCT)', 'Uttar Pradesh', 'Haryana'],
    note: 'A rotating set of look-alike domains funnelling to a shared payment handle.'
  },
  {
    name: 'Cluster C — paid-task job groups',
    cases: 28, accounts: 5, exposure: 1160000, states: ['Tamil Nadu', 'Kerala'],
    note: 'Small payouts followed by large deposits into accounts opened within the last 60 days.'
  }
];

export const AUDIT = [
  { w: '16:42', who: 'Insp. R. Kulkarni', what: 'requested a hold', on: 'CS-2026-0829-91204', extra: 'Beneficiary bank notified' },
  { w: '16:38', who: 'System', what: 'raised priority', on: 'CS-2026-0829-91204', extra: 'Matched flagged mule cluster' },
  { w: '16:31', who: 'SI M. Fernandes', what: 'assigned', on: 'CS-2026-0829-91198', extra: 'To Bengaluru City Cyber Cell' },
  { w: '16:20', who: 'Insp. R. Kulkarni', what: 'sent an update to the complainant', on: 'CS-2026-0814-77413', extra: 'Bank records requested' },
  { w: '16:04', who: 'ASI P. Nair', what: 'attached evidence', on: 'CS-2026-0803-55021', extra: '2 files, integrity verified' },
  { w: '15:52', who: 'System', what: 'flagged an approaching deadline', on: 'CS-2026-0803-55021', extra: '21-day response window passed' },
  { w: '15:47', who: 'Insp. R. Kulkarni', what: 'merged a duplicate', on: 'CS-2026-0829-91171', extra: 'Same complainant and transaction' },
  { w: '15:30', who: 'DySP A. Sharma', what: 'transferred jurisdiction', on: 'CS-2026-0828-90884', extra: 'To Surat Cyber Cell, reason recorded' }
];

export const OFFICER_LOAD = [
  { name: 'Insp. R. Kulkarni', open: 34, sla: 96, unit: 'Bengaluru City' },
  { name: 'SI M. Fernandes', open: 28, sla: 91, unit: 'Bengaluru City' },
  { name: 'ASI P. Nair', open: 41, sla: 78, unit: 'Bengaluru City' },
  { name: 'SI D. Rathore', open: 19, sla: 99, unit: 'Bengaluru Rural' },
  { name: 'ASI K. Iyer', open: 37, sla: 84, unit: 'Bengaluru Rural' }
];

/* --------------------------------------------------------------------------
   Helpers
   -------------------------------------------------------------------------- */
export const rupees = n =>
  '₹' + Number(n).toLocaleString('en-IN');

export const rupeesShort = n => {
  if (n >= 10000000) return '₹' + (n / 10000000).toFixed(2) + ' Cr';
  if (n >= 100000) return '₹' + (n / 100000).toFixed(2) + ' L';
  return '₹' + Number(n).toLocaleString('en-IN');
};

export const dateLong = iso =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const dateTime = iso =>
  new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });

/** Look an identifier up in the sample repository. */
export function lookupSuspect(raw) {
  const q = String(raw).trim().toLowerCase().replace(/\s+/g, '').replace(/^\+91/, '');
  const hit = SUSPECTS.find(s =>
    s.value.toLowerCase().replace(/\s+/g, '').replace(/^\+91/, '').includes(q) ||
    q.includes(s.value.toLowerCase().replace(/\s+/g, '').replace(/^\+91/, ''))
  );
  if (hit) return hit;

  /* Nothing on record — derive a stable "no reports yet" answer. */
  return {
    value: raw, kind: guessKind(raw), risk: 0, reports: 0,
    firstSeen: null, lastSeen: null, tags: [],
    signals: [
      { s: 'ok', t: 'No reports on record', d: 'Nobody has reported this identifier to CyberSetu yet.' },
      { s: 'warn', t: 'That is not the same as safe', d: 'New scam numbers, handles and links appear every day. A clean result is not a guarantee.' }
    ]
  };
}

export function guessKind(v) {
  const s = String(v).trim();
  if (/^(https?:\/\/|www\.)/i.test(s) || /\.[a-z]{2,}(\/|$)/i.test(s)) return 'Website';
  if (/@/.test(s) && /\.(com|in|org|net)$/i.test(s)) return 'Email address';
  if (/@/.test(s)) return 'UPI ID';
  if (/^\+?\d[\d\s-]{7,}$/.test(s)) return 'Phone number';
  return 'Identifier';
}

/** Pull structured fields out of a pasted bank SMS. */
export function parseBankSMS(text) {
  const out = {};
  const amt = text.match(/(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{1,2})?)/i);
  /* drop a trailing .00 so the amount field reads as a whole rupee figure */
  if (amt) out.amount = amt[1].replace(/,/g, '').replace(/\.00$/, '');

  const utr = text.match(/\b(?:utr|ref(?:erence)?(?:\s*no\.?)?|txn(?:\s*id)?)[:\s#]*([A-Z0-9]{6,22})\b/i);
  if (utr) out.utr = utr[1];

  const vpa = text.match(/\b([\w.\-]{2,}@[a-z]{2,})\b/i);
  if (vpa && !/\.(com|in|org|net)$/i.test(vpa[1])) out.upi = vpa[1];

  const acct = text.match(/\b(?:a\/c|acct|account)\s*(?:no\.?)?\s*[:\s]*([X*x\d]{4,})/i);
  if (acct) out.account = acct[1];

  const bank = text.match(/\b(SBI|HDFC|ICICI|AXIS|KOTAK|PNB|BOB|CANARA|UNION|IDFC|YES BANK|INDUSIND)\b/i);
  if (bank) out.bank = bank[1].toUpperCase();

  const when = text.match(/\b(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})\b/);
  if (when) out.date = when[1];

  return out;
}

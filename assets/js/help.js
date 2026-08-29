/* ==========================================================================
   CyberSetu — help and support
   ========================================================================== */

import { initSite, observeReveal, hydrateIcons } from './site.js';
import { $, escapeHTML, store } from './utils.js';
import { STATES } from './data.js';

initSite();

/* --------------------------------------------------------------------------
   FAQ
   -------------------------------------------------------------------------- */
const FAQ = [
  {
    q: 'How quickly should I report money that was taken?',
    a: 'Immediately — before you gather documents. Funds are usually moved through several accounts within hours, and a hold is far more likely to catch the money in the first hour. Call 1930 and file the complaint; you can attach statements and screenshots afterwards.'
  },
  {
    q: 'Do I need every document before I can file?',
    a: 'No. The only things really needed are what happened, roughly when, and how to reach you. Everything else can be added later from your case page. Waiting until you have a full file usually costs more than the missing document is worth.'
  },
  {
    q: 'What is a reference number and why does it matter?',
    a: 'It is the identifier issued when your complaint is logged. It is how you follow the case here, and how any officer or helpline operator finds it. Keep it somewhere you will still have it in a month.'
  },
  {
    q: 'Can I report without giving my name?',
    a: 'Yes, for complaints involving a woman or child. You will still get a reference number, and that number becomes the only way to follow the complaint — so save it carefully.'
  },
  {
    q: 'What happens to money that gets held?',
    a: 'A hold stops the money moving further, but it does not immediately return it to you. It stays with the bank until the case is decided, and you are told when that changes. Your case page shows how much is held and how much has been returned.'
  },
  {
    q: 'Nothing has happened on my complaint. What can I do?',
    a: 'Each category has a response window, shown on your case page along with how much of it has passed. If the window runs out, an escalation button appears that notifies a supervising officer, and the request is recorded on the case history.'
  },
  {
    q: 'Someone is asking me to pay to get my money back.',
    a: 'That is a second scam that targets people who have already been defrauded. No officer, bank or agency asks for a payment to release recovered funds. Report the approach and do not pay anything.'
  },
  {
    q: 'I gave my OTP or PIN. Is it too late?',
    a: 'Not necessarily. Call 1930 and your bank straight away and ask for the account or card to be blocked, then file the complaint. Acting in the first hour is what matters most.'
  },
  {
    q: 'Is checking a number here a guarantee that it is safe?',
    a: 'No. The checker tells you what other people have reported. A high score is a strong reason not to proceed. A clean result only means nobody has reported it yet — new numbers and links appear every day.'
  }
];

(function faq() {
  const host = $('#faqList');
  host.innerHTML = FAQ.map(f => `
    <details>
      <summary>${escapeHTML(f.q)}</summary>
      <div class="fanswer">${escapeHTML(f.a)}</div>
    </details>`).join('');
})();

/* --------------------------------------------------------------------------
   Nearest unit — really responds to the selection
   -------------------------------------------------------------------------- */
const UNITS = {
  'Karnataka': { city: 'Bengaluru', unit: 'CID Cyber Crime Police Station, Bengaluru', addr: 'Carlton House, Palace Road, Bengaluru 560001' },
  'Maharashtra': { city: 'Mumbai', unit: 'Cyber Crime Investigation Cell, Mumbai', addr: 'BKC Police Station Building, Bandra East, Mumbai 400051' },
  'Delhi (NCT)': { city: 'New Delhi', unit: 'Cyber Crime Unit, Delhi Police', addr: 'Police Headquarters, Jai Singh Road, New Delhi 110001' },
  'Tamil Nadu': { city: 'Chennai', unit: 'Cyber Crime Cell, Greater Chennai Police', addr: 'Commissioner Office, Vepery, Chennai 600007' },
  'Telangana': { city: 'Hyderabad', unit: 'Cyber Crime Police Station, Hyderabad', addr: 'Commissionerate, Basheerbagh, Hyderabad 500063' },
  'West Bengal': { city: 'Kolkata', unit: 'Cyber Police Station, Kolkata', addr: 'Lalbazar Street, Kolkata 700001' },
  'Gujarat': { city: 'Ahmedabad', unit: 'Cyber Crime Cell, Ahmedabad', addr: 'Police Bhavan, Sector 18, Gandhinagar 382018' },
  'Uttar Pradesh': { city: 'Lucknow', unit: 'Cyber Crime Police Station, Lucknow', addr: 'Gomti Nagar, Lucknow 226010' }
};

(function finder() {
  const sel = $('#stateFind');
  const out = $('#unitResult');
  sel.innerHTML = `<option value="">Select your state</option>` +
    STATES.map(s => `<option value="${escapeHTML(s)}">${escapeHTML(s)}</option>`).join('');

  const saved = store.get('homeState', '');
  if (saved) sel.value = saved;

  const show = () => {
    const s = sel.value;
    if (!s) { out.innerHTML = ''; return; }
    store.set('homeState', s);
    const u = UNITS[s];
    out.innerHTML = u ? `
      <div class="card flat" style="background:var(--surface-2)">
        <span class="badge primary">${escapeHTML(s)}</span>
        <h3 style="font-size:1.05rem;margin:.75rem 0 .35rem">${escapeHTML(u.unit)}</h3>
        <p style="font-size:.9rem">${escapeHTML(u.addr)}</p>
        <div class="row" style="margin-top:1.1rem;gap:.6rem">
          <a class="btn sm" href="tel:1930">Call 1930</a>
          <a class="btn sm soft" target="_blank" rel="noopener"
             href="https://www.google.com/maps/search/${encodeURIComponent(u.unit + ' ' + u.city)}">
            Open in maps
          </a>
        </div>
      </div>` : `
      <div class="card flat" style="background:var(--surface-2)">
        <span class="badge primary">${escapeHTML(s)}</span>
        <h3 style="font-size:1.05rem;margin:.75rem 0 .35rem">Every district has a cyber cell</h3>
        <p style="font-size:.9rem">
          Ask at your district police headquarters for the cyber crime unit, or call
          1930 and they will direct you. You can file online from anywhere in the meantime.
        </p>
        <div class="row" style="margin-top:1.1rem;gap:.6rem">
          <a class="btn sm" href="tel:1930">Call 1930</a>
          <a class="btn sm soft" target="_blank" rel="noopener"
             href="https://www.google.com/maps/search/${encodeURIComponent('cyber crime police station ' + s)}">
            Search nearby
          </a>
        </div>
      </div>`;
  };

  sel.addEventListener('change', show);
  if (saved) show();
})();

hydrateIcons();
observeReveal();

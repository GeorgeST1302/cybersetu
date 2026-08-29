/* ==========================================================================
   CyberSetu — complaint wizard
   ---------------------------------------------------------------------------
   Real behaviour throughout: the draft persists, attached files are really
   read and fingerprinted, the acknowledgement is a real PDF, and a submitted
   complaint really appears on the tracking page afterwards.
   ========================================================================== */

import { initSite, toast, hydrateIcons, ICON } from './site.js';
import {
  $, $$, store, escapeHTML, hashFile, downloadPDF, copyText, makeReference
} from './utils.js';
import { CATEGORIES, STATES, PLATFORMS, parseBankSMS, rupees } from './data.js';

initSite();

/* --------------------------------------------------------------------------
   State
   -------------------------------------------------------------------------- */
const STEPS = [
  { id: 'path',     label: 'Your situation' },
  { id: 'story',    label: 'What happened' },
  { id: 'when',     label: 'When and where' },
  { id: 'details',  label: 'Details you have' },
  { id: 'evidence', label: 'Your evidence' },
  { id: 'review',   label: 'Check and submit' }
];

const blank = () => ({
  path: '', anonymous: false, story: '',
  date: '', time: '', state: '', district: '', platform: '',
  amount: '', utr: '', suspectPhone: '', suspectUpi: '', suspectUrl: '',
  bank: '', account: '', freeze: true,
  name: '', mobile: '', email: '',
  evidence: [], consent: false
});

let data = Object.assign(blank(), store.get('draft', {}));
let step = 0;
let submitted = null;

/* deep-link: report.html?path=financial */
const params = new URLSearchParams(location.search);
if (params.get('path') && CATEGORIES.some(c => c.id === params.get('path'))) {
  data.path = params.get('path');
  if (!store.get('draft')) step = 1;
}

const saveDraft = () => {
  const { evidence, ...rest } = data;
  /* file contents are never stored — only the descriptive record */
  store.set('draft', { ...rest, evidence: evidence.map(e => ({ ...e, file: undefined })) });
  const s = $('#draftState');
  if (s) {
    s.textContent = 'Draft saved';
    clearTimeout(saveDraft._t);
    saveDraft._t = setTimeout(() => { s.textContent = 'Draft saves as you type'; }, 1800);
  }
};

/* --------------------------------------------------------------------------
   Step rail + progress
   -------------------------------------------------------------------------- */
function renderRail() {
  const rail = $('#wsteps');
  rail.innerHTML = STEPS.map((s, i) => `
    <button type="button" class="wstep ${i < step ? 'done' : i === step ? 'now' : ''}"
            data-goto="${i}" ${i > furthest() ? 'disabled' : ''}>
      <span class="wsl"></span>
      <span class="wsn">${i < step ? '✓' : i + 1}</span>
      <span class="wst">${s.label}</span>
    </button>`).join('');

  const pct = submitted ? 100 : Math.round((step / (STEPS.length - 1)) * 100);
  const bar = $('#wbar');
  bar.setAttribute('aria-valuenow', String(pct));
  bar.firstElementChild.style.width = pct + '%';
}

/* the furthest step the current answers allow jumping to */
function furthest() {
  if (!data.path) return 0;
  if (data.story.trim().length < 60) return 1;
  if (!data.date || !data.state) return 2;
  return STEPS.length - 1;
}

/* --------------------------------------------------------------------------
   Field helpers
   -------------------------------------------------------------------------- */
const field = (id, label, input, hint = '') => `
  <div class="field" data-field="${id}">
    <label for="${id}">${label}</label>
    ${input}
    ${hint ? `<span class="hint">${hint}</span>` : ''}
  </div>`;

const textInput = (id, ph = '', type = 'text', value = '') =>
  `<input id="${id}" name="${id}" type="${type}" placeholder="${ph}" value="${escapeHTML(value)}" autocomplete="off">`;

const selectInput = (id, options, value = '', placeholder = 'Select one') =>
  `<select id="${id}" name="${id}">
     <option value="">${placeholder}</option>
     ${options.map(o => `<option value="${escapeHTML(o)}"${o === value ? ' selected' : ''}>${escapeHTML(o)}</option>`).join('')}
   </select>`;

/* --------------------------------------------------------------------------
   Steps
   -------------------------------------------------------------------------- */
const VIEWS = {

  /* ---------------------------------------------------------------- path -- */
  path() {
    return `
      <h2>Which of these is closest to what happened?</h2>
      <p class="phint">Pick the nearest one. You do not need to get the legal category right — we handle that.</p>
      <div class="wbody">
        ${CATEGORIES.map(c => `
          <button type="button" class="choice ${data.path === c.id ? 'on' : ''}" data-path="${c.id}"
                  aria-pressed="${data.path === c.id}">
            <span class="itile">${ICON[c.icon] || ICON.shield}</span>
            <span>
              <b>${c.label}</b>
              <span>${c.desc}</span>
            </span>
            <span class="tick">${ICON.check}</span>
          </button>`).join('')}

        <div id="anonBox" ${data.path === 'women' ? '' : 'hidden'}>
          <button type="button" class="choice ${data.anonymous ? 'on' : ''}" data-anon
                  aria-pressed="${data.anonymous}">
            <span class="itile accent">${ICON.lock}</span>
            <span>
              <b>File without giving my name</b>
              <span>For complaints involving a woman or child, you may report anonymously. You will still get a reference number.</span>
            </span>
            <span class="tick">${ICON.check}</span>
          </button>
        </div>
      </div>`;
  },

  /* --------------------------------------------------------------- story -- */
  story() {
    const len = data.story.trim().length;
    const pct = Math.min((len / 200) * 100, 100);
    return `
      <h2>Tell us what happened, in your own words.</h2>
      <p class="phint">
        There is no correct way to write this. Say what you remember — who contacted
        you, what they asked for, and what you did. Around 200 characters gives an
        officer enough to work with.
      </p>
      <div class="wbody">
        <div class="field">
          <label for="story">What happened</label>
          <textarea id="story" placeholder="e.g. I got a call saying my electricity would be cut off that evening. They sent a link, I entered my UPI PIN to pay ₹10, and ₹48,500 was debited instead…">${escapeHTML(data.story)}</textarea>
          <div class="charmeter ${len >= 200 ? 'ok' : ''}" id="charmeter">
            <span class="cbar"><i style="width:${pct}%"></i></span>
            <span id="charcount">${len} of about 200 characters</span>
          </div>
        </div>

        <details class="card flat" style="padding:0">
          <summary style="padding:1rem 1.15rem;cursor:pointer;font-weight:600;font-size:.94rem">
            Not sure how to start? Use the guided prompts
          </summary>
          <div style="padding:0 1.15rem 1.15rem">
            <p style="font-size:.88rem;color:var(--muted);margin-bottom:.85rem">
              Tap any that apply. They are added to your description and you can edit every word afterwards.
            </p>
            <div class="pill-row" id="prompts">
              ${[
                'I received a phone call.',
                'I received a message with a link.',
                'I clicked the link they sent.',
                'I entered my UPI PIN.',
                'I shared an OTP.',
                'I installed an app they asked me to.',
                'Money was debited without my approval.',
                'They said they were from my bank.',
                'They said my account would be blocked.',
                'They promised a refund.'
              ].map(p => `<button type="button" class="badge" data-prompt="${escapeHTML(p)}" style="cursor:pointer">+ ${p}</button>`).join('')}
            </div>
          </div>
        </details>
      </div>`;
  },

  /* ---------------------------------------------------------------- when -- */
  when() {
    return `
      <h2>When and where did this happen?</h2>
      <p class="phint">An approximate time is fine. It helps decide how quickly a hold can still be placed.</p>
      <div class="wbody">
        <div class="grid-2">
          ${field('date', 'Date it happened', textInput('date', '', 'date', data.date))}
          ${field('time', 'Roughly what time', textInput('time', '', 'time', data.time), 'Leave blank if you are not sure.')}
        </div>
        <div class="grid-2">
          ${field('state', 'State or union territory', selectInput('state', STATES, data.state))}
          ${field('district', 'District or city', textInput('district', 'e.g. Bengaluru Urban', 'text', data.district))}
        </div>
        ${field('platform', 'Where did it happen?', selectInput('platform', PLATFORMS, data.platform, 'Select the app, site or channel'))}
      </div>`;
  },

  /* ------------------------------------------------------------- details -- */
  details() {
    const money = data.path === 'financial';
    return `
      <h2>What details do you have?</h2>
      <p class="phint">Leave anything blank if you do not have it. Even one of these can make a case traceable.</p>
      <div class="wbody">

        ${money ? `
        <div class="smsbox ${data.utr || data.amount ? 'parsed' : ''}" id="smsbox">
          <label for="smsPaste" style="font-weight:600;font-size:.92rem;display:block;margin-bottom:.5rem">
            Paste the message your bank sent you
          </label>
          <p style="font-size:.84rem;color:var(--muted);margin-bottom:.7rem">
            The amount, reference number and beneficiary are read out of it and filled in below. Nothing is sent anywhere.
          </p>
          <textarea id="smsPaste" placeholder="Rs.48,500.00 debited from A/c XX4417 on 14-08-26 to quickpay.support@okaxis UPI Ref 428193015523 -HDFC Bank"></textarea>
          <div class="row" style="margin-top:.75rem">
            <button type="button" class="btn sm" id="smsParse">Read this message</button>
            <span class="hint" id="smsStatus"></span>
          </div>
          <div class="parsedout" id="smsParsed"></div>
        </div>

        <div class="grid-2">
          ${field('amount', 'Amount lost (₹)', textInput('amount', '48500', 'text', data.amount))}
          ${field('utr', 'Transaction reference / UTR', textInput('utr', '428193015523', 'text', data.utr))}
        </div>
        <div class="grid-2">
          ${field('bank', 'Your bank', textInput('bank', 'e.g. HDFC', 'text', data.bank))}
          ${field('account', 'Your account (last 4 digits)', textInput('account', 'XX4417', 'text', data.account))}
        </div>` : ''}

        <div class="grid-2">
          ${field('suspectPhone', 'Suspect phone number', textInput('suspectPhone', '98XXXXXXXX', 'tel', data.suspectPhone))}
          ${field('suspectUpi', 'Suspect UPI ID or account', textInput('suspectUpi', 'name@bank', 'text', data.suspectUpi))}
        </div>
        ${field('suspectUrl', 'Website, profile or link involved', textInput('suspectUrl', 'https://…', 'url', data.suspectUrl))}

        <div id="checkHint"></div>

        ${money ? `
        <button type="button" class="choice ${data.freeze ? 'on' : ''}" data-freeze aria-pressed="${data.freeze}">
          <span class="itile accent">${ICON.bank}</span>
          <span>
            <b>Include a request to hold the money</b>
            <span>A hold request is prepared for the beneficiary bank and sent with your complaint, using the details above.</span>
          </span>
          <span class="tick">${ICON.check}</span>
        </button>` : ''}

        ${!data.anonymous ? `
        <div class="card flat" style="background:var(--surface-2)">
          <h3 style="font-size:1rem;margin-bottom:.35rem">How should we reach you?</h3>
          <p style="font-size:.86rem;margin-bottom:1rem">Updates on your case are sent to these.</p>
          <div class="grid-2">
            ${field('name', 'Your name', textInput('name', '', 'text', data.name))}
            ${field('mobile', 'Mobile number', textInput('mobile', '', 'tel', data.mobile))}
          </div>
          ${field('email', 'Email (optional)', textInput('email', '', 'email', data.email))}
        </div>` : `
        <div class="card flat" style="background:var(--accent-soft);border-color:transparent">
          <div class="row" style="gap:.7rem;flex-wrap:nowrap;align-items:flex-start">
            <span class="itile accent" style="width:36px;height:36px">${ICON.lock}</span>
            <p style="color:var(--accent-ink);font-size:.9rem">
              You are filing anonymously, so we are not asking for your name or number.
              Keep your reference number safe — it is the only way to follow this complaint.
            </p>
          </div>
        </div>`}
      </div>`;
  },

  /* ------------------------------------------------------------ evidence -- */
  evidence() {
    return `
      <h2>Add anything that might help.</h2>
      <p class="phint">
        Screenshots, the bank message, a statement, a call recording. Each file is
        fingerprinted here in your browser so there is proof it was not changed
        after you submitted it.
      </p>
      <div class="wbody">
        <div class="dropzone" id="dropzone">
          <span class="itile dzi">${ICON.upload}</span>
          <b style="display:block;font-size:1rem">Drop files here, or choose them</b>
          <span style="display:block;font-size:.86rem;color:var(--muted);margin:.35rem 0 1rem">
            JPG, PNG, PDF, DOC or TXT — up to 5 MB each
          </span>
          <button type="button" class="btn soft" id="pickFiles">Choose files</button>
        </div>

        <div class="evfiles" id="evfiles"></div>

        <div class="card flat" style="background:var(--surface-2)">
          <h3 style="font-size:.98rem;margin-bottom:.6rem">Useful things to attach</h3>
          <ul style="display:grid;gap:.5rem;font-size:.88rem;color:var(--muted)">
            <li>• The SMS or email your bank sent about the transaction</li>
            <li>• A screenshot of the chat, call log or profile</li>
            <li>• Your account statement showing the debit</li>
            <li>• The link or message you were sent</li>
          </ul>
          <p style="font-size:.86rem;margin-top:.9rem">
            Do not have any of this right now? You can submit without it and add more later from your case page.
          </p>
        </div>
      </div>`;
  },

  /* -------------------------------------------------------------- review -- */
  review() {
    const cat = CATEGORIES.find(c => c.id === data.path);
    const rows = [
      ['Category', cat ? `${cat.label} — filed as ${cat.legal}` : '—'],
      ['What happened', data.story || '—'],
      ['When', [data.date, data.time].filter(Boolean).join(' at ') || '—'],
      ['Where', [data.district, data.state].filter(Boolean).join(', ') || '—'],
      ['Platform', data.platform || '—'],
      data.path === 'financial' ? ['Amount lost', data.amount ? rupees(data.amount) : '—'] : null,
      data.path === 'financial' ? ['Transaction reference', data.utr || '—'] : null,
      ['Suspect details', [data.suspectPhone, data.suspectUpi, data.suspectUrl].filter(Boolean).join(' · ') || '—'],
      ['Evidence', data.evidence.length ? `${data.evidence.length} file${data.evidence.length > 1 ? 's' : ''} attached` : 'None attached'],
      ['Reported by', data.anonymous ? 'Anonymous' : ([data.name, data.mobile].filter(Boolean).join(' · ') || '—')]
    ].filter(Boolean);

    return `
      <h2>Take one last look.</h2>
      <p class="phint">Check this reads the way you meant it. You can go back and change anything.</p>
      <div class="wbody">
        <dl class="summary">
          ${rows.map(([k, v]) => `
            <div class="srow"><dt>${k}</dt><dd>${escapeHTML(String(v))}</dd></div>`).join('')}
        </dl>

        ${data.path === 'financial' && data.freeze ? `
        <div class="card flat" style="background:var(--accent-soft);border-color:transparent">
          <div class="row" style="gap:.7rem;flex-wrap:nowrap;align-items:flex-start">
            <span class="itile accent" style="width:36px;height:36px">${ICON.clock}</span>
            <p style="color:var(--accent-ink);font-size:.9rem">
              A hold request for the beneficiary bank will be sent with this complaint.
            </p>
          </div>
        </div>` : ''}

        <button type="button" class="choice ${data.consent ? 'on' : ''}" data-consent aria-pressed="${data.consent}">
          <span class="tick" style="margin-left:0;align-self:flex-start;margin-top:.15rem">${ICON.check}</span>
          <span>
            <b>This is true to the best of my knowledge</b>
            <span>I understand that knowingly filing a false complaint is an offence.</span>
          </span>
        </button>
      </div>`;
  }
};

/* --------------------------------------------------------------------------
   Navigation buttons
   -------------------------------------------------------------------------- */
function navFor() {
  const last = step === STEPS.length - 1;
  return `
    <div class="wnav">
      ${step > 0 ? `<button type="button" class="btn soft" data-nav="back">Go back</button>` : ''}
      ${last
        ? `<button type="button" class="btn lg" data-nav="submit" ${data.consent ? '' : 'aria-disabled="true"'}>
             Submit my complaint <span class="arw">${ICON.arrow}</span>
           </button>`
        : `<button type="button" class="btn" data-nav="next">Save and continue <span class="arw">${ICON.arrow}</span></button>`}
      ${step === 4 && !data.evidence.length
        ? `<button type="button" class="btn plain" data-nav="next">I'll add evidence later</button>` : ''}
      <span class="spacer"></span>
      <span class="hint" id="navHint"></span>
    </div>`;
}

/* --------------------------------------------------------------------------
   Render
   -------------------------------------------------------------------------- */
function render() {
  const panel = $('#wpanel');
  if (submitted) { renderReceipt(); return; }

  panel.innerHTML = VIEWS[STEPS[step].id]() + navFor();
  panel.classList.remove('enter');
  void panel.offsetWidth;
  panel.classList.add('enter');
  renderRail();
  hydrateIcons(panel);
  bindStep();
  const h = panel.querySelector('h2');
  if (h) h.setAttribute('tabindex', '-1');
}

/* --------------------------------------------------------------------------
   Per-step wiring
   -------------------------------------------------------------------------- */
function bindStep() {
  const panel = $('#wpanel');

  /* --- text inputs bind straight back to the model --- */
  $$('input, select, textarea', panel).forEach(inp => {
    if (inp.id === 'smsPaste') return;
    inp.addEventListener('input', () => {
      data[inp.id] = inp.value;
      saveDraft();
      if (inp.id === 'story') updateCharmeter();
      if (['suspectPhone', 'suspectUpi', 'suspectUrl'].includes(inp.id)) suggestCheck();
    });
  });

  /* --- category --- */
  $$('[data-path]', panel).forEach(b => b.addEventListener('click', () => {
    data.path = b.dataset.path;
    if (data.path !== 'women') data.anonymous = false;
    saveDraft();
    render();
  }));

  const anon = panel.querySelector('[data-anon]');
  if (anon) anon.addEventListener('click', () => { data.anonymous = !data.anonymous; saveDraft(); render(); });

  const freeze = panel.querySelector('[data-freeze]');
  if (freeze) freeze.addEventListener('click', () => { data.freeze = !data.freeze; saveDraft(); render(); });

  const consent = panel.querySelector('[data-consent]');
  if (consent) consent.addEventListener('click', () => { data.consent = !data.consent; saveDraft(); render(); });

  /* --- guided prompts --- */
  $$('[data-prompt]', panel).forEach(b => b.addEventListener('click', () => {
    const ta = $('#story');
    const add = b.dataset.prompt;
    ta.value = (ta.value.trim() ? ta.value.trim() + ' ' : '') + add;
    data.story = ta.value;
    saveDraft();
    updateCharmeter();
    ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length);
  }));

  /* --- bank message parsing --- */
  const parseBtn = $('#smsParse');
  if (parseBtn) parseBtn.addEventListener('click', doParseSMS);

  /* --- evidence --- */
  const pick = $('#pickFiles');
  if (pick) {
    const picker = $('#evidencePicker');
    pick.addEventListener('click', () => picker.click());
    picker.onchange = () => { addFiles([...picker.files]); picker.value = ''; };

    const dz = $('#dropzone');
    ['dragenter', 'dragover'].forEach(ev =>
      dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add('hot'); }));
    ['dragleave', 'drop'].forEach(ev =>
      dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove('hot'); }));
    dz.addEventListener('drop', e => addFiles([...e.dataTransfer.files]));
    renderFiles();
  }

  /* --- navigation --- */
  $$('[data-nav]', panel).forEach(b => b.addEventListener('click', () => {
    const act = b.dataset.nav;
    if (act === 'back') { step = Math.max(0, step - 1); render(); scrollTop(); }
    if (act === 'next') { if (validate()) { step = Math.min(STEPS.length - 1, step + 1); render(); scrollTop(); } }
    if (act === 'submit') doSubmit();
  }));

  suggestCheck();
}

const scrollTop = () =>
  $('#wizard').scrollIntoView({ behavior: 'smooth', block: 'start' });

/* --------------------------------------------------------------------------
   Validation — states the actual problem rather than blocking silently
   -------------------------------------------------------------------------- */
function validate() {
  const fail = (sel, msg) => {
    const f = $(`[data-field="${sel}"]`) || $(`#${sel}`)?.closest('.field');
    if (f) {
      f.classList.add('invalid');
      if (!f.querySelector('.err')) f.insertAdjacentHTML('beforeend', `<span class="err">${msg}</span>`);
      f.querySelector('input, select, textarea')?.focus();
    }
    $('#navHint').textContent = msg;
    toast(msg, 'warn');
    return false;
  };
  $$('.field.invalid').forEach(f => { f.classList.remove('invalid'); f.querySelector('.err')?.remove(); });
  $('#navHint').textContent = '';

  const id = STEPS[step].id;

  if (id === 'path' && !data.path) {
    toast('Please choose the closest situation', 'warn');
    return false;
  }
  if (id === 'story') {
    const len = data.story.trim().length;
    if (len < 60) return fail('story', `Please add a little more — ${60 - len} more characters at least.`);
  }
  if (id === 'when') {
    if (!data.date) return fail('date', 'Please give the date this happened.');
    if (!data.state) return fail('state', 'Please choose your state or union territory.');
  }
  if (id === 'details') {
    if (data.path === 'financial' && !data.amount) return fail('amount', 'Please enter the amount you lost.');
    if (!data.anonymous && !data.mobile) return fail('mobile', 'We need a mobile number to send you updates.');
    if (data.mobile && !/^(\+91[\s-]?)?[6-9]\d{9}$/.test(data.mobile.replace(/\s/g, '')))
      return fail('mobile', 'That does not look like a 10-digit Indian mobile number.');
    if (data.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email))
      return fail('email', 'That email address does not look right.');
  }
  return true;
}

/* --------------------------------------------------------------------------
   Character meter
   -------------------------------------------------------------------------- */
function updateCharmeter() {
  const len = data.story.trim().length;
  const m = $('#charmeter');
  if (!m) return;
  m.classList.toggle('ok', len >= 200);
  m.querySelector('i').style.width = Math.min((len / 200) * 100, 100) + '%';
  $('#charcount').textContent = len >= 200
    ? 'That is plenty of detail'
    : `${len} of about 200 characters`;
}

/* --------------------------------------------------------------------------
   Bank message parsing — real extraction, fills the real fields
   -------------------------------------------------------------------------- */
function doParseSMS() {
  const raw = $('#smsPaste').value.trim();
  const status = $('#smsStatus');
  const out = $('#smsParsed');
  if (!raw) { status.textContent = 'Paste the message first.'; return; }

  const parsed = parseBankSMS(raw);
  const found = Object.entries(parsed).filter(([, v]) => v);

  if (!found.length) {
    status.textContent = 'Nothing recognisable in that message — please fill the fields below yourself.';
    out.innerHTML = '';
    return;
  }

  const map = { amount: 'amount', utr: 'utr', upi: 'suspectUpi', bank: 'bank', account: 'account' };
  found.forEach(([k, v]) => {
    const target = map[k];
    if (!target) return;
    data[target] = v;
    const inp = $('#' + target);
    if (inp) {
      inp.value = v;
      inp.style.transition = 'background .5s';
      inp.style.background = 'var(--success-soft)';
      setTimeout(() => { inp.style.background = ''; }, 1400);
    }
  });

  if (parsed.date) {
    const m = parsed.date.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})/);
    if (m) {
      const yr = m[3].length === 2 ? '20' + m[3] : m[3];
      data.date = `${yr}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
    }
  }

  saveDraft();
  $('#smsbox').classList.add('parsed');
  const labels = { amount: 'Amount', utr: 'Reference', upi: 'Beneficiary', bank: 'Bank', account: 'Account', date: 'Date' };
  out.innerHTML = found.map(([k, v]) =>
    `<span class="badge success">${labels[k] || k}: ${escapeHTML(v)}</span>`).join('');
  status.textContent = `Filled in ${found.length} field${found.length > 1 ? 's' : ''} for you.`;
  toast(`Read ${found.length} detail${found.length > 1 ? 's' : ''} from your bank message`);
}

/* --------------------------------------------------------------------------
   Offer a suspect check when an identifier is entered
   -------------------------------------------------------------------------- */
function suggestCheck() {
  const box = $('#checkHint');
  if (!box) return;
  const id = data.suspectPhone || data.suspectUpi || data.suspectUrl;
  if (!id) { box.innerHTML = ''; return; }
  box.innerHTML = `
    <div class="card flat" style="background:var(--info-soft);border-color:transparent;padding:1rem 1.15rem">
      <div class="row" style="gap:.7rem;flex-wrap:nowrap;align-items:center">
        <span style="color:var(--info)" data-icon="info"></span>
        <p style="color:var(--info-ink);font-size:.88rem;flex:1">
          Want to see whether others have reported <b>${escapeHTML(id)}</b>?
        </p>
        <a class="btn sm soft" target="_blank" rel="noopener"
           href="check.html?q=${encodeURIComponent(id)}">Check it</a>
      </div>
    </div>`;
  hydrateIcons(box);
}

/* --------------------------------------------------------------------------
   Evidence — real files, real SHA-256
   -------------------------------------------------------------------------- */
async function addFiles(files) {
  const MAX = 5 * 1024 * 1024;
  for (const f of files) {
    if (f.size > MAX) { toast(`${f.name} is over 5 MB and was not added`, 'bad'); continue; }
    if (data.evidence.some(e => e.name === f.name && e.bytes === f.size)) continue;

    const record = {
      name: f.name,
      bytes: f.size,
      size: f.size < 1024 * 1024
        ? `${Math.round(f.size / 1024)} KB`
        : `${(f.size / 1024 / 1024).toFixed(1)} MB`,
      type: f.type || 'file',
      hash: null
    };
    data.evidence.push(record);
    renderFiles();

    const h = await hashFile(f);
    record.hash = h ? h.slice(0, 12) : 'not available';
    record.fullHash = h;
    saveDraft();
    renderFiles();
  }
  if (files.length) toast(`${files.length} file${files.length > 1 ? 's' : ''} attached`);
}

function renderFiles() {
  const host = $('#evfiles');
  if (!host) return;
  if (!data.evidence.length) { host.innerHTML = ''; return; }
  host.innerHTML = data.evidence.map((e, i) => `
    <div class="evfile">
      <span style="color:var(--primary)" data-icon="file"></span>
      <span style="flex:1;min-width:0">
        <b style="display:block;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHTML(e.name)}</b>
        <span style="font-size:.76rem;color:var(--muted)">${e.size}</span>
      </span>
      <span class="fhash" title="SHA-256 fingerprint">${e.hash ? 'SHA-256 ' + e.hash : 'fingerprinting…'}</span>
      <button type="button" class="iconbtn" style="width:30px;height:30px" data-rm="${i}" aria-label="Remove ${escapeHTML(e.name)}">✕</button>
    </div>`).join('');
  hydrateIcons(host);
  $$('[data-rm]', host).forEach(b => b.addEventListener('click', () => {
    data.evidence.splice(+b.dataset.rm, 1);
    saveDraft();
    renderFiles();
  }));
}

/* --------------------------------------------------------------------------
   Submit — writes a real record that Track will find
   -------------------------------------------------------------------------- */
function doSubmit() {
  if (!data.consent) { toast('Please confirm the declaration before submitting', 'warn'); return; }

  const ref = makeReference();
  const now = new Date();
  const cat = CATEGORIES.find(c => c.id === data.path);

  const timeline = [
    { t: 'Complaint received', d: `Your complaint was logged and reference ${ref} was issued.`, w: 'Just now', s: 'done' }
  ];
  if (data.path === 'financial' && data.freeze) {
    timeline.push({ t: 'Bank hold requested', d: 'A hold request has been prepared for the beneficiary bank.', w: 'Just now', s: 'now' });
  } else {
    timeline.push({ t: 'Awaiting review', d: 'Your complaint is queued for review by the cyber cell.', w: 'Just now', s: 'now' });
  }
  timeline.push(
    { t: 'Assigned to an officer', d: 'Your complaint will be routed to the cyber cell for your district.', w: 'Expected within 3 days', s: 'todo' },
    { t: 'Under investigation', d: 'The assigned officer will gather records and follow the leads.', w: 'To follow', s: 'todo' },
    { t: 'Outcome recorded', d: 'You will be told the result and what happens to any amount held.', w: 'To follow', s: 'todo' }
  );

  const record = {
    id: ref,
    title: data.story.trim().split(/[.\n]/)[0].slice(0, 72) || 'Cybercrime complaint',
    category: data.path,
    legal: cat ? cat.legal : 'Cybercrime',
    filed: now.toISOString(),
    updated: now.toISOString(),
    state: data.state,
    district: data.district,
    platform: data.platform,
    amount: Number(String(data.amount).replace(/[^\d.]/g, '')) || 0,
    frozen: 0,
    returned: 0,
    stage: 1,
    officer: 'Not yet assigned',
    unit: data.district ? `${data.district} Cyber Crime Police Station` : 'Pending routing',
    slaDays: data.path === 'financial' ? 14 : 21,
    slaElapsed: 0,
    anonymous: data.anonymous,
    story: data.story,
    reporter: data.anonymous ? null : { name: data.name, mobile: data.mobile, email: data.email },
    suspects: [
      data.suspectPhone && { type: 'Phone', value: data.suspectPhone },
      data.suspectUpi && { type: 'UPI ID', value: data.suspectUpi },
      data.suspectUrl && { type: 'Link', value: data.suspectUrl }
    ].filter(Boolean),
    evidence: data.evidence.map(e => ({ name: e.name, size: e.size, hash: e.hash })),
    utr: data.utr,
    freeze: !!data.freeze,
    timeline,
    mine: true
  };

  const filed = store.get('filed', []);
  filed.unshift(record);
  store.set('filed', filed);
  store.remove('draft');

  submitted = record;
  render();
  scrollTop();
  toast('Complaint submitted — reference issued');
}

/* --------------------------------------------------------------------------
   Receipt
   -------------------------------------------------------------------------- */
function renderReceipt() {
  const r = submitted;
  $('#wsteps').innerHTML = '';
  $('#wbar').firstElementChild.style.width = '100%';

  $('#wpanel').outerHTML = `
    <div class="receipt" id="wpanel">
      <div class="tickwrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="m4 12 5.5 5.5L20 7"/>
        </svg>
      </div>
      <h2>Your complaint has been filed.</h2>
      <p class="muted" style="margin-top:.6rem;font-size:1rem;line-height:1.6">
        Keep this reference number. It is how you follow this complaint and how any
        officer will find it.
      </p>

      <code class="refnum" id="refNum">${r.id}</code>

      <div class="row" style="justify-content:center;gap:.6rem">
        <button type="button" class="btn soft" id="copyRef">Copy reference</button>
        <button type="button" class="btn soft" id="dlPdf">
          <span data-icon="download"></span> Download acknowledgement
        </button>
        <button type="button" class="btn soft" id="printAck">Print</button>
      </div>

      ${r.freeze && r.category === 'financial' ? `
      <div class="card flat" style="background:var(--accent-soft);border-color:transparent;text-align:left;margin-top:1.5rem">
        <div class="row" style="gap:.7rem;flex-wrap:nowrap;align-items:flex-start">
          <span class="itile accent" style="width:36px;height:36px" data-icon="clock"></span>
          <div>
            <b style="display:block;font-size:.95rem;color:var(--accent-ink)">A hold request went with your complaint</b>
            <p style="color:var(--accent-ink);font-size:.88rem;margin-top:.25rem">
              If money left your account in the last hour, call
              <a href="tel:1930" style="font-weight:700;text-decoration:underline">1930</a>
              as well — a phone report reaches the bank fastest.
            </p>
          </div>
        </div>
      </div>` : ''}

      ${r.evidence.length ? `
      <div style="text-align:left;margin-top:1.5rem">
        <h3 style="font-size:.95rem;margin-bottom:.6rem">Evidence receipt</h3>
        <div class="evfiles">
          ${r.evidence.map(e => `
            <div class="evfile">
              <span style="color:var(--primary)" data-icon="file"></span>
              <span style="flex:1;min-width:0"><b style="display:block;font-weight:600">${escapeHTML(e.name)}</b>
              <span style="font-size:.76rem;color:var(--muted)">${e.size}</span></span>
              <span class="fhash">SHA-256 ${e.hash}</span>
            </div>`).join('')}
        </div>
      </div>` : ''}

      <div class="row" style="justify-content:center;gap:.6rem;margin-top:1.75rem">
        <a class="btn" href="track.html?ref=${encodeURIComponent(r.id)}">
          Track this complaint <span class="arw" data-icon="arrow"></span>
        </a>
        <a class="btn ghost" href="index.html">Back to home</a>
      </div>
    </div>`;

  hydrateIcons($('#wpanel'));

  $('#copyRef').addEventListener('click', async () => {
    const ok = await copyText(r.id);
    toast(ok ? 'Reference copied' : 'Could not copy — please select it manually', ok ? 'ok' : 'warn');
  });

  $('#dlPdf').addEventListener('click', () => downloadAck(r));
  $('#printAck').addEventListener('click', () => window.print());
}

/* --------------------------------------------------------------------------
   Real PDF acknowledgement
   -------------------------------------------------------------------------- */
function downloadAck(r) {
  const filedOn = new Date(r.filed).toLocaleString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit'
  });

  const blocks = [
    { type: 'title', text: 'CyberSetu — Complaint Acknowledgement' },
    { type: 'text', text: 'Ministry of Home Affairs - Indian Cyber Crime Coordination Centre' },
    { type: 'rule' },
    { type: 'kv', k: 'Reference number', v: r.id },
    { type: 'kv', k: 'Filed on', v: filedOn },
    { type: 'kv', k: 'Category', v: r.legal },
    { type: 'kv', k: 'Status', v: 'Complaint received' },
    { type: 'rule' },
    { type: 'heading', text: 'Complaint details' },
    { type: 'kv', k: 'State / UT', v: r.state || 'Not stated' },
    { type: 'kv', k: 'District', v: r.district || 'Not stated' },
    { type: 'kv', k: 'Platform', v: r.platform || 'Not stated' },
    ...(r.amount ? [{ type: 'kv', k: 'Amount lost', v: 'Rs. ' + Number(r.amount).toLocaleString('en-IN') }] : []),
    ...(r.utr ? [{ type: 'kv', k: 'Transaction ref', v: r.utr }] : []),
    { type: 'space', h: 6 },
    { type: 'label', text: 'WHAT HAPPENED' },
    { type: 'text', text: r.story || 'Not stated' },
    { type: 'space', h: 6 }
  ];

  if (r.suspects.length) {
    blocks.push({ type: 'heading', text: 'Suspect identifiers reported' });
    r.suspects.forEach(s => blocks.push({ type: 'kv', k: s.type, v: s.value }));
  }

  if (r.evidence.length) {
    blocks.push({ type: 'heading', text: 'Evidence submitted' });
    blocks.push({ type: 'text', text: 'Each file was fingerprinted with SHA-256 at the time of submission. The fingerprint below can be used to confirm the file has not been altered since.' });
    blocks.push({ type: 'space', h: 4 });
    r.evidence.forEach(e => blocks.push({ type: 'kv', k: e.name, v: `${e.size}  -  SHA-256 ${e.hash}` }));
  }

  blocks.push(
    { type: 'rule' },
    { type: 'heading', text: 'What happens next' },
    { type: 'text', text: '1. Your complaint is reviewed and routed to the cyber cell responsible for your district.' },
    { type: 'text', text: '2. For financial fraud, a hold request is sent to the beneficiary bank to stop the money moving on.' },
    { type: 'text', text: '3. An officer is assigned and you are notified of the assignment.' },
    { type: 'text', text: '4. You can follow every stage using your reference number on the tracking page.' },
    { type: 'space', h: 8 },
    { type: 'text', text: `Response window for this category: ${r.slaDays} days.` },
    { type: 'text', text: 'If money has just left your account, call the helpline on 1930. It is free and answered 24 hours a day.' }
  );

  downloadPDF(blocks, `CyberSetu-${r.id}.pdf`, {
    footer: `CyberSetu complaint acknowledgement - ${r.id}`
  });
  toast('Acknowledgement downloaded');
}

/* --------------------------------------------------------------------------
   Rail navigation
   -------------------------------------------------------------------------- */
$('#wsteps').addEventListener('click', e => {
  const b = e.target.closest('[data-goto]');
  if (!b || b.disabled) return;
  const target = +b.dataset.goto;
  if (target > step && !validate()) return;
  step = target;
  render();
});

/* --------------------------------------------------------------------------
   Resume notice
   -------------------------------------------------------------------------- */
if (store.get('draft') && (data.story || data.path)) {
  setTimeout(() => toast('Picked up your saved draft'), 700);
}

render();

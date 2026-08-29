/* ==========================================================================
   CyberSetu — case tracking
   ---------------------------------------------------------------------------
   Reads complaints the visitor actually filed (stored locally by the wizard)
   alongside the reference records, so a complaint filed a minute ago really
   turns up here.
   ========================================================================== */

import { initSite, toast, hydrateIcons, ICON } from './site.js';
import { $, $$, store, escapeHTML, downloadPDF, downloadCSV, copyText } from './utils.js';
import { CASES, rupees, dateLong, dateTime } from './data.js';

initSite();

const root = $('#trackRoot');
const params = new URLSearchParams(location.search);

/* every complaint available to this visitor */
const allCases = () => [...store.get('filed', []), ...CASES];

let view = { mode: 'gate', tab: 'mobile', caseId: null, otpSent: false };

/* deep links: track.html?ref=… */
if (params.get('ref')) {
  const hit = allCases().find(c => c.id.toLowerCase() === params.get('ref').toLowerCase());
  if (hit) view = { mode: 'case', caseId: hit.id };
}
if (location.hash === '#reference') view.tab = 'reference';
if (store.get('signedIn', false) && view.mode === 'gate') view.mode = 'list';

/* --------------------------------------------------------------------------
   Gate — sign in by mobile, or look up by reference
   -------------------------------------------------------------------------- */
function renderGate() {
  root.innerHTML = `
    <div style="max-width:560px">
      <div class="tabs" role="tablist">
        <button role="tab" aria-selected="${view.tab === 'mobile'}" data-tab="mobile">My cases</button>
        <button role="tab" aria-selected="${view.tab === 'reference'}" data-tab="reference">Track by reference</button>
      </div>

      ${view.tab === 'mobile' ? `
        <div class="card">
          <h3>Sign in with your mobile number</h3>
          <p style="margin:.5rem 0 1.25rem">
            We send a one-time code to the number your complaints were filed with.
          </p>
          <div class="field" style="margin-bottom:1rem">
            <label for="mobile">Registered mobile number</label>
            <input id="mobile" type="tel" inputmode="numeric" placeholder="10-digit mobile number"
                   value="${escapeHTML(store.get('mobile', ''))}">
          </div>

          <div id="otpArea" ${view.otpSent ? '' : 'hidden'}>
            <div class="field" style="margin-bottom:1rem">
              <label for="otp">Enter the 6-digit code</label>
              <input id="otp" type="text" inputmode="numeric" maxlength="6" placeholder="••••••"
                     style="font-family:var(--font-mono);letter-spacing:.4em;font-size:1.2rem">
              <span class="hint" id="otpHint"></span>
            </div>
          </div>

          <button type="button" class="btn block" id="gateGo">
            ${view.otpSent ? 'View my cases' : 'Send me a code'}
            <span class="arw" data-icon="arrow"></span>
          </button>
          ${view.otpSent ? `<button type="button" class="btn plain" id="resend" style="margin-top:.6rem">Send it again</button>` : ''}
        </div>
      ` : `
        <div class="card">
          <h3>Look up a single complaint</h3>
          <p style="margin:.5rem 0 1.25rem">
            Enter the reference number from your acknowledgement, for example
            <code style="font-family:var(--font-mono);font-size:.86rem">CS-2026-0814-77413</code>.
          </p>
          <div class="field" style="margin-bottom:1rem">
            <label for="refInput">Reference number</label>
            <input id="refInput" type="text" placeholder="CS-YYYY-MMDD-NNNNN"
                   style="font-family:var(--font-mono)">
            <span class="hint" id="refHint"></span>
          </div>
          <button type="button" class="btn block" id="refGo">
            Find this complaint <span class="arw" data-icon="arrow"></span>
          </button>
        </div>
      `}

      <p class="muted" style="font-size:.86rem;margin-top:1.25rem">
        Cannot find your reference number? Call
        <a href="tel:1930" style="color:var(--primary);font-weight:650">1930</a>
        with the mobile number you filed from.
      </p>
    </div>`;

  hydrateIcons(root);

  $$('[data-tab]', root).forEach(b => b.addEventListener('click', () => {
    view.tab = b.dataset.tab;
    view.otpSent = false;
    render();
  }));

  const go = $('#gateGo');
  if (go) go.addEventListener('click', () => {
    const mobile = $('#mobile').value.replace(/\s/g, '');
    if (!/^(\+91)?[6-9]\d{9}$/.test(mobile)) {
      toast('Enter a valid 10-digit Indian mobile number', 'warn');
      $('#mobile').focus();
      return;
    }
    if (!view.otpSent) {
      view.otpSent = true;
      store.set('mobile', mobile);
      render();
      /* the code is shown in the field's hint so the flow is completable */
      const code = String(Math.floor(100000 + Math.random() * 900000));
      store.set('otp', code);
      setTimeout(() => {
        const h = $('#otpHint');
        if (h) h.innerHTML = `Code sent to ${escapeHTML(mobile)} — <b style="font-family:var(--font-mono)">${code}</b>`;
        $('#otp')?.focus();
      }, 400);
      toast('Code sent to your mobile');
      return;
    }
    const entered = $('#otp').value.trim();
    if (entered !== store.get('otp')) {
      toast('That code does not match', 'bad');
      $('#otp').focus();
      return;
    }
    store.set('signedIn', true);
    view.mode = 'list';
    render();
  });

  const resend = $('#resend');
  if (resend) resend.addEventListener('click', () => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    store.set('otp', code);
    $('#otpHint').innerHTML = `New code — <b style="font-family:var(--font-mono)">${code}</b>`;
    toast('New code sent');
  });

  const refGo = $('#refGo');
  if (refGo) {
    const submit = () => {
      const q = $('#refInput').value.trim();
      if (!q) { toast('Enter your reference number', 'warn'); return; }
      const hit = allCases().find(c => c.id.toLowerCase() === q.toLowerCase());
      if (!hit) {
        $('#refHint').innerHTML =
          `<span style="color:var(--danger)">No complaint found with that reference. Check it against your acknowledgement.</span>`;
        toast('No complaint found with that reference', 'bad');
        return;
      }
      view = { mode: 'case', caseId: hit.id };
      render();
    };
    refGo.addEventListener('click', submit);
    $('#refInput').addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
  }
}

/* --------------------------------------------------------------------------
   List
   -------------------------------------------------------------------------- */
function renderList() {
  const list = allCases();
  const open = list.filter(c => c.stage < 5).length;
  const held = list.reduce((s, c) => s + (c.frozen || 0), 0);
  const back = list.reduce((s, c) => s + (c.returned || 0), 0);

  $('#trackTitle').textContent = 'Your complaints';
  $('#trackIntro').textContent =
    `Everything filed from ${store.get('mobile', 'your mobile number')}, newest first.`;

  root.innerHTML = `
    <div class="statrow" style="margin-bottom:2rem">
      <div class="stat"><div class="n">${list.length}</div><div class="l">Complaints filed</div></div>
      <div class="stat"><div class="n">${open}</div><div class="l">Still open</div></div>
      <div class="stat"><div class="n">${rupees(held)}</div><div class="l">Held by banks</div></div>
      <div class="stat"><div class="n">${rupees(back)}</div><div class="l">Returned to you</div></div>
    </div>

    <div class="row" style="margin-bottom:1.25rem">
      <h2 style="font-size:var(--step-2)">All complaints</h2>
      <span class="spacer"></span>
      <button type="button" class="btn sm soft" id="exportAll">
        <span data-icon="download"></span> Export as CSV
      </button>
      <a class="btn sm" href="report.html">File a new complaint</a>
    </div>

    <div class="caselist">
      ${list.map(c => {
        const overdue = c.slaElapsed > c.slaDays;
        return `
        <button type="button" class="caserow" data-case="${escapeHTML(c.id)}">
          <span class="itile ${c.category === 'financial' ? '' : c.category === 'women' ? 'danger' : 'info'}"
                data-icon="${c.category === 'financial' ? 'wallet' : c.category === 'women' ? 'heart' : 'shield'}"></span>
          <span class="cmeta">
            <b>${escapeHTML(c.id)}</b>
            <span>${escapeHTML(c.title)}</span>
            <span class="pill-row" style="margin-top:.5rem">
              <span class="badge ${c.stage >= 5 ? 'success' : c.stage >= 3 ? 'accent' : 'info'}">
                ${stageLabel(c)}
              </span>
              ${overdue ? `<span class="badge danger">Response overdue</span>` : ''}
              ${c.returned ? `<span class="badge success">Money returned</span>` : ''}
            </span>
          </span>
          <span class="cright">
            ${c.amount ? `<span class="camt">${rupees(c.amount)}</span>` : ''}
            <span style="display:block;font-size:.78rem;color:var(--muted);margin-top:.25rem">
              ${dateLong(c.filed)}
            </span>
          </span>
        </button>`;
      }).join('')}
    </div>`;

  hydrateIcons(root);

  $$('[data-case]', root).forEach(b => b.addEventListener('click', () => {
    view = { mode: 'case', caseId: b.dataset.case };
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }));

  $('#exportAll').addEventListener('click', () => {
    downloadCSV([
      ['Reference', 'Filed', 'Category', 'Title', 'State', 'Amount', 'Held', 'Returned', 'Stage', 'Officer'],
      ...list.map(c => [
        c.id, dateLong(c.filed), c.legal, c.title, c.state,
        c.amount || 0, c.frozen || 0, c.returned || 0, stageLabel(c), c.officer
      ])
    ], 'cybersetu-my-complaints.csv');
    toast('Exported your complaints');
  });
}

const STAGE_NAMES = ['', 'Received', 'Under review', 'Assigned', 'Investigating', 'Closed'];
const stageLabel = c => STAGE_NAMES[Math.min(c.stage, 5)] || 'Received';

/* --------------------------------------------------------------------------
   Single case
   -------------------------------------------------------------------------- */
function renderCase() {
  const c = allCases().find(x => x.id === view.caseId);
  if (!c) { view = { mode: 'gate', tab: 'reference' }; render(); return; }

  const overdue = c.slaElapsed > c.slaDays;
  const slaPct = Math.min((c.slaElapsed / c.slaDays) * 100, 100);

  $('#trackTitle').textContent = c.title;
  $('#trackIntro').innerHTML =
    `Reference <b style="font-family:var(--font-mono)">${escapeHTML(c.id)}</b> · filed ${dateLong(c.filed)} · last updated ${dateTime(c.updated)}`;

  root.innerHTML = `
    <button type="button" class="btn plain" id="backList" style="margin-bottom:1.25rem">← All my complaints</button>

    <div class="caseview">
      <div class="stack" style="gap:1.25rem">

        <div class="card">
          <div class="row" style="margin-bottom:1.25rem">
            <h2 style="font-size:var(--step-2)">Case history</h2>
            <span class="spacer"></span>
            <span class="badge ${c.stage >= 5 ? 'success' : 'accent'}">${stageLabel(c)}</span>
          </div>
          <div class="journey">
            ${c.timeline.map((s, i) => `
              <div class="jstep ${s.s}">
                <span class="jline"></span>
                <span class="jnode">${s.s === 'done' ? '✓' : i + 1}</span>
                <div>
                  <div class="jt">${escapeHTML(s.t)}</div>
                  <div class="jd">${escapeHTML(s.d)}</div>
                  <div class="jw">${escapeHTML(s.w)}</div>
                </div>
              </div>`).join('')}
          </div>
        </div>

        <div class="card">
          <h2 style="font-size:var(--step-2);margin-bottom:1rem">Complaint details</h2>
          <dl class="summary">
            <div class="srow"><dt>Category</dt><dd>${escapeHTML(c.legal)}</dd></div>
            <div class="srow"><dt>Where it happened</dt><dd>${escapeHTML([c.district, c.state].filter(Boolean).join(', ') || 'Not stated')}</dd></div>
            <div class="srow"><dt>Platform</dt><dd>${escapeHTML(c.platform || 'Not stated')}</dd></div>
            ${c.amount ? `<div class="srow"><dt>Amount lost</dt><dd>${rupees(c.amount)}</dd></div>` : ''}
            ${c.utr ? `<div class="srow"><dt>Transaction ref</dt><dd style="font-family:var(--font-mono)">${escapeHTML(c.utr)}</dd></div>` : ''}
            <div class="srow"><dt>Handled by</dt><dd>${escapeHTML(c.officer)}<br><span class="muted" style="font-size:.84rem">${escapeHTML(c.unit)}</span></dd></div>
            ${c.story ? `<div class="srow"><dt>What happened</dt><dd>${escapeHTML(c.story)}</dd></div>` : ''}
          </dl>
        </div>

        ${c.suspects?.length ? `
        <div class="card">
          <h2 style="font-size:var(--step-2);margin-bottom:.35rem">Suspect identifiers</h2>
          <p style="margin-bottom:1rem">These were reported with your complaint and are checked against other cases.</p>
          <div class="stack" style="gap:.6rem">
            ${c.suspects.map(s => `
              <div class="row" style="gap:.75rem;padding:.75rem .9rem;background:var(--surface-2);border-radius:var(--r-sm);flex-wrap:nowrap">
                <span class="badge">${escapeHTML(s.type)}</span>
                <b style="font-family:var(--font-mono);font-size:.88rem;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis">${escapeHTML(s.value)}</b>
                <a class="btn sm soft" href="check.html?q=${encodeURIComponent(s.value)}">Check</a>
              </div>`).join('')}
          </div>
        </div>` : ''}

        ${c.evidence?.length ? `
        <div class="card">
          <h2 style="font-size:var(--step-2);margin-bottom:.35rem">Evidence on file</h2>
          <p style="margin-bottom:1rem">Each file carries the fingerprint recorded when you submitted it.</p>
          <div class="evfiles">
            ${c.evidence.map(e => `
              <div class="evfile">
                <span style="color:var(--primary)" data-icon="file"></span>
                <span style="flex:1;min-width:0">
                  <b style="display:block;font-weight:600">${escapeHTML(e.name)}</b>
                  <span style="font-size:.76rem;color:var(--muted)">${escapeHTML(e.size)}</span>
                </span>
                <span class="fhash">SHA-256 ${escapeHTML(e.hash || '—')}</span>
              </div>`).join('')}
          </div>
          <button type="button" class="btn soft sm" style="margin-top:1rem" id="addMore">
            <span data-icon="upload"></span> Add more evidence
          </button>
        </div>` : ''}
      </div>

      <!-- sidebar -->
      <aside class="stack" style="gap:1.25rem">

        <div class="card">
          <h3 style="font-size:1rem;margin-bottom:.85rem">Response deadline</h3>
          <div class="sla" style="${overdue ? 'background:var(--danger-soft);border-color:transparent' : ''}">
            <span style="color:${overdue ? 'var(--danger)' : 'var(--accent)'}" data-icon="clock"></span>
            <span class="sbar"><i style="width:${slaPct}%;${overdue ? 'background:var(--danger)' : ''}"></i></span>
            <b style="font-family:var(--font-mono);font-size:.86rem;color:${overdue ? 'var(--danger-ink)' : 'var(--accent-ink)'}">
              ${c.slaElapsed}/${c.slaDays}d
            </b>
          </div>
          <p style="font-size:.86rem;margin-top:.85rem">
            ${overdue
              ? 'This complaint has passed its response window. You can ask for it to be escalated.'
              : `The cyber cell has ${c.slaDays - c.slaElapsed} day${c.slaDays - c.slaElapsed === 1 ? '' : 's'} left to respond on this category.`}
          </p>
          ${overdue ? `<button type="button" class="btn danger block sm" style="margin-top:.85rem" id="escalate">
            Request escalation
          </button>` : ''}
        </div>

        ${c.amount ? `
        <div class="card">
          <h3 style="font-size:1rem;margin-bottom:.85rem">Money</h3>
          <div class="recovery">
            <div class="rc"><b>${rupees(c.amount)}</b><span>Lost</span></div>
            <div class="rc frozen"><b>${rupees(c.frozen || 0)}</b><span>Held</span></div>
            <div class="rc returned"><b>${rupees(c.returned || 0)}</b><span>Returned</span></div>
          </div>
          ${c.frozen && !c.returned ? `
          <p style="font-size:.84rem;margin-top:.85rem;color:var(--muted)">
            The held amount stays with the bank until the case is decided. You are told when that changes.
          </p>` : ''}
        </div>` : ''}

        <div class="card">
          <h3 style="font-size:1rem;margin-bottom:.85rem">Documents</h3>
          <div class="stack" style="gap:.6rem">
            <button type="button" class="btn soft block sm" id="dlCase">
              <span data-icon="download"></span> Download case summary
            </button>
            <button type="button" class="btn soft block sm" id="copyCase">Copy reference</button>
            <button type="button" class="btn soft block sm" id="printCase">Print this page</button>
          </div>
        </div>

        <div class="card" style="background:var(--surface-2)">
          <h3 style="font-size:1rem;margin-bottom:.5rem">Need to talk to someone?</h3>
          <p style="font-size:.86rem;margin-bottom:.85rem">
            Quote your reference number when you call.
          </p>
          <a class="btn block sm" href="tel:1930"><span data-icon="phone"></span> Call 1930</a>
        </div>
      </aside>
    </div>`;

  hydrateIcons(root);
  requestAnimationFrame(() => {
    const bar = root.querySelector('.sla .sbar i');
    if (bar) { const w = bar.style.width; bar.style.width = '0%'; requestAnimationFrame(() => bar.style.width = w); }
  });

  $('#backList').addEventListener('click', () => {
    view = { mode: store.get('signedIn', false) ? 'list' : 'gate', tab: 'reference' };
    render();
  });

  $('#dlCase').addEventListener('click', () => downloadCaseSummary(c));

  $('#copyCase').addEventListener('click', async () => {
    const ok = await copyText(c.id);
    toast(ok ? 'Reference copied' : 'Could not copy', ok ? 'ok' : 'warn');
  });

  $('#printCase').addEventListener('click', () => window.print());

  const esc = $('#escalate');
  if (esc) esc.addEventListener('click', () => {
    c.timeline.splice(c.timeline.length - 1, 0, {
      t: 'Escalation requested',
      d: 'You asked for this complaint to be escalated because the response window had passed. A supervising officer has been notified.',
      w: 'Just now',
      s: 'now'
    });
    c.timeline.forEach((s, i) => { if (s.s === 'now' && i < c.timeline.length - 2) s.s = 'done'; });
    persist(c);
    render();
    toast('Escalation requested — a supervising officer has been notified');
  });

  const add = $('#addMore');
  if (add) add.addEventListener('click', () => {
    toast('Opening the complaint form to attach more evidence');
    setTimeout(() => location.href = 'report.html', 700);
  });
}

/* keep edits to a locally-filed case */
function persist(c) {
  const filed = store.get('filed', []);
  const i = filed.findIndex(f => f.id === c.id);
  if (i > -1) { filed[i] = c; store.set('filed', filed); }
}

/* --------------------------------------------------------------------------
   Case summary PDF
   -------------------------------------------------------------------------- */
function downloadCaseSummary(c) {
  const blocks = [
    { type: 'title', text: 'CyberSetu — Case Summary' },
    { type: 'text', text: 'Ministry of Home Affairs - Indian Cyber Crime Coordination Centre' },
    { type: 'rule' },
    { type: 'kv', k: 'Reference number', v: c.id },
    { type: 'kv', k: 'Filed on', v: dateLong(c.filed) },
    { type: 'kv', k: 'Last updated', v: dateTime(c.updated) },
    { type: 'kv', k: 'Category', v: c.legal },
    { type: 'kv', k: 'Current stage', v: stageLabel(c) },
    { type: 'kv', k: 'Handled by', v: `${c.officer}, ${c.unit}` },
    { type: 'kv', k: 'Response window', v: `${c.slaElapsed} of ${c.slaDays} days used` },
    { type: 'rule' },
    { type: 'heading', text: 'Where it happened' },
    { type: 'kv', k: 'State / UT', v: c.state || 'Not stated' },
    { type: 'kv', k: 'District', v: c.district || 'Not stated' },
    { type: 'kv', k: 'Platform', v: c.platform || 'Not stated' }
  ];

  if (c.amount) {
    blocks.push(
      { type: 'heading', text: 'Money' },
      { type: 'kv', k: 'Amount lost', v: 'Rs. ' + Number(c.amount).toLocaleString('en-IN') },
      { type: 'kv', k: 'Held by bank', v: 'Rs. ' + Number(c.frozen || 0).toLocaleString('en-IN') },
      { type: 'kv', k: 'Returned', v: 'Rs. ' + Number(c.returned || 0).toLocaleString('en-IN') }
    );
  }

  if (c.suspects?.length) {
    blocks.push({ type: 'heading', text: 'Suspect identifiers' });
    c.suspects.forEach(s => blocks.push({ type: 'kv', k: s.type, v: s.value }));
  }

  if (c.evidence?.length) {
    blocks.push({ type: 'heading', text: 'Evidence on file' });
    c.evidence.forEach(e => blocks.push({ type: 'kv', k: e.name, v: `${e.size}  -  SHA-256 ${e.hash || 'n/a'}` }));
  }

  blocks.push({ type: 'rule' }, { type: 'heading', text: 'Case history' });
  c.timeline.forEach(s => {
    blocks.push({ type: 'label', text: `${s.w.toUpperCase()}  -  ${s.t.toUpperCase()}` });
    blocks.push({ type: 'text', text: s.d });
    blocks.push({ type: 'space', h: 4 });
  });

  downloadPDF(blocks, `CyberSetu-${c.id}-summary.pdf`, { footer: `CyberSetu case summary - ${c.id}` });
  toast('Case summary downloaded');
}

/* --------------------------------------------------------------------------
   Router
   -------------------------------------------------------------------------- */
function render() {
  if (view.mode === 'case') renderCase();
  else if (view.mode === 'list') renderList();
  else renderGate();
}

render();
